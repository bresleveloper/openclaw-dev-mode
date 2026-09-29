import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as resolveProviderModelMaterializationAuthMode, r as resolveProviderModelRouteAuthRequirement } from "./provider-model-route-auth-DkAaX3ui.mjs";
import { R as shouldPreferProviderRuntimeResolvedModel } from "./provider-runtime-BofzCM_V.mjs";
import { t as materializePreparedRuntimeModel } from "./materialize-model-BGTV6m9x.mjs";
import { t as agentRuntimeAuthPlanMatchesTarget } from "./prepare-auth-CvmQc1W2.mjs";
//#region src/agents/runtime-plan/credential-scoped-model.ts
function providerUsesCredentialScopedModelMetadata(params) {
	return shouldPreferProviderRuntimeResolvedModel({
		provider: params.provider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env ?? process.env,
		context: {
			config: params.config,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			provider: params.provider,
			modelId: params.modelId
		}
	});
}
/** Reuses forwarded model auth only when the prepared plan owns the exact target. */
function resolveReusableRuntimeModelAuth(params) {
	const plan = params.plan && agentRuntimeAuthPlanMatchesTarget(params.plan, {
		provider: params.provider,
		modelId: params.modelId
	}) ? params.plan : void 0;
	const authProfileId = params.authProfileId ?? plan?.forwardedAuthProfileId;
	const authProfileMode = resolveProviderModelMaterializationAuthMode(plan?.selectedAuthMode);
	return {
		plan,
		authProfileId,
		modelAuth: authProfileId !== void 0 ? { authProfileId } : authProfileMode !== void 0 ? { authProfileMode } : void 0
	};
}
/** Direct auth after a profile attempt must drop credential-scoped model metadata. */
function shouldForceDirectAuthFallbackModelResolve(params) {
	return params.attempt.kind === "direct" && params.priorProfileAttempted;
}
/** Re-resolves when the selected profile or direct credential can change provider metadata. */
function shouldForceCredentialScopedModelResolve(plan, requestedProfileId, providerUsesProfileScopedModelMetadata = false) {
	return Boolean(plan.forwardedAuthProfileId || requestedProfileId || providerUsesProfileScopedModelMetadata && plan.selectedAuthMode);
}
/** Re-resolves metadata whenever the prepared credential can change provider limits. */
function shouldMaterializeAuthPlanModel(plan, requestedProfileId, providerUsesProfileScopedModelMetadata = false) {
	return Boolean(plan.modelRoute || shouldForceCredentialScopedModelResolve(plan, requestedProfileId, providerUsesProfileScopedModelMetadata));
}
function resolveCredentialScopedAuthAttemptModelDecision(params) {
	const forceResolve = shouldForceDirectAuthFallbackModelResolve(params);
	const shouldMaterialize = shouldMaterializeAuthPlanModel(params.attempt.plan, params.requestedProfileId, params.providerUsesProfileScopedModelMetadata) || forceResolve;
	return {
		forceResolve,
		shouldMaterialize,
		authRequirement: params.attempt.plan.modelRoute?.authRequirement ?? (shouldMaterialize && params.providerUsesProfileScopedModelMetadata ? resolveProviderModelRouteAuthRequirement(params.attempt.plan.selectedAuthMode) : void 0)
	};
}
function hasPreparedAuthAttemptModelMetadata(params) {
	return params.attempts.some((attempt) => params.providerUsesProfileScopedModelMetadata && (attempt.kind === "profile" || Boolean(attempt.plan.forwardedAuthProfileId)) || Boolean(attempt.plan.modelRoute) || attempt.allowAuthProfileFallback !== void 0);
}
const ROUTE_MODEL_MEMO_MAX_ENTRIES = 64;
function routeModelMemoKey(plan, params) {
	const route = plan.modelRoute;
	return JSON.stringify([
		params.provider,
		params.modelId,
		plan.forwardedAuthProfileId ?? "",
		plan.selectedAuthMode ?? "",
		route?.api ?? "",
		route?.baseUrl ?? "",
		route?.authRequirement ?? "",
		params.requestedProfileId?.trim() ?? "",
		params.providerUsesProfileScopedModelMetadata
	]);
}
function createPreparedRuntimeModelMaterializer(params) {
	const materializedRouteModels = /* @__PURE__ */ new WeakMap();
	const materializeUncached = async (plan, forceResolve = false) => {
		const model = params.getModel();
		if (params.nativeModelOwned) return model;
		return await materializePreparedRuntimeModel({
			plan,
			provider: params.provider,
			modelId: params.modelId,
			config: params.config,
			workspaceDir: params.workspaceDir,
			metadataSnapshot: params.metadataSnapshot,
			model,
			forceResolve: forceResolve || shouldForceCredentialScopedModelResolve(plan, params.requestedProfileId, params.providerUsesProfileScopedModelMetadata),
			resolveModel: (request) => params.resolveModel(request)
		}) ?? model;
	};
	const materialize = (plan) => {
		const willResolve = shouldForceCredentialScopedModelResolve(plan, params.requestedProfileId, params.providerUsesProfileScopedModelMetadata);
		const memo = params.nativeModelOwned || !willResolve || params.providerOwnsDynamicModelRefresh ? void 0 : params.generationRouteModelMemo;
		if (!plan.modelRoute && !memo) return materializeUncached(plan);
		if (plan.modelRoute) {
			const cached = materializedRouteModels.get(plan);
			if (cached) return cached;
		}
		const materialized = memo ? getOrCreatePromise(memo, routeModelMemoKey(plan, params), () => {
			if (memo.size >= ROUTE_MODEL_MEMO_MAX_ENTRIES) {
				const oldest = memo.keys().next().value;
				if (oldest !== void 0) memo.delete(oldest);
			}
			return materializeUncached(plan);
		}, { cacheRejections: false }) : materializeUncached(plan);
		if (plan.modelRoute) materializedRouteModels.set(plan, materialized);
		return materialized;
	};
	return {
		materialize,
		materializeUncached
	};
}
//#endregion
export { resolveReusableRuntimeModelAuth as a, resolveCredentialScopedAuthAttemptModelDecision as i, hasPreparedAuthAttemptModelMetadata as n, shouldForceDirectAuthFallbackModelResolve as o, providerUsesCredentialScopedModelMetadata as r, createPreparedRuntimeModelMaterializer as t };
