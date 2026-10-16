import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as resolveProviderModelMaterializationAuthMode } from "./provider-model-route-auth-Cbwct-ZM.mjs";
import { o as resolveProviderModelAuthPolicy } from "./model-runtime-policy-Bz7NzEHI.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-Cuz_bq6T.mjs";
import { c as mintSecretSentinel, s as looksLikeSecretSentinel } from "./sentinel-D8TyDpFw.mjs";
import { I as shouldPreferProviderRuntimeResolvedModel } from "./provider-runtime-BMdc4CgR.mjs";
import { t as materializePreparedRuntimeModel } from "./materialize-model-NIyjRPmc.mjs";
import { t as agentRuntimeAuthPlanMatchesTarget } from "./prepare-auth-CySXPvY1.mjs";
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
function resolveCredentialScopedAuthAttemptModelDecision(params) {
	const forceResolve = shouldForceDirectAuthFallbackModelResolve(params);
	const shouldMaterialize = Boolean(params.attempt.plan.modelRoute) || shouldForceCredentialScopedModelResolve(params.attempt.plan, params.requestedProfileId, params.providerUsesProfileScopedModelMetadata) || forceResolve;
	return {
		forceResolve,
		shouldMaterialize,
		authRequirement: params.attempt.plan.modelRoute?.authRequirement ?? (shouldMaterialize && params.providerUsesProfileScopedModelMetadata ? resolveProviderModelAuthPolicy({
			provider: params.attempt.plan.providerForAuth,
			mode: params.attempt.plan.selectedAuthMode,
			authFlow: params.attempt.plan.selectedAuthFlow
		}).authRequirement ?? void 0 : void 0)
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
		plan.selectedAuthFlow ?? "",
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
//#region src/agents/provider-runtime-auth-protection.ts
/** Re-sentinels credentials returned by a provider auth exchange. */
function protectPreparedProviderRuntimeAuth(params) {
	const { preparedAuth } = params;
	if (!preparedAuth) return;
	const protect = (value, label) => !value || isNonSecretApiKeyMarker(value) || looksLikeSecretSentinel(value) ? value : mintSecretSentinel(value, { label: `model-auth:${params.provider}:${label}` });
	const request = preparedAuth.request;
	const headers = request?.headers ? Object.fromEntries(Object.entries(request.headers).map(([name, value]) => [name, protect(value, `runtime-header:${name.toLowerCase()}`)])) : void 0;
	const auth = request?.auth;
	const protectedAuth = auth?.mode === "authorization-bearer" ? {
		...auth,
		token: protect(auth.token, "runtime-bearer")
	} : auth?.mode === "header" ? {
		...auth,
		value: protect(auth.value, `runtime-auth-header:${auth.headerName.toLowerCase()}`)
	} : auth;
	return {
		...preparedAuth,
		apiKey: protect(preparedAuth.apiKey, "runtime-api-key"),
		...request ? { request: {
			...request,
			...headers ? { headers } : {},
			...protectedAuth ? { auth: protectedAuth } : {}
		} } : {}
	};
}
//#endregion
export { resolveCredentialScopedAuthAttemptModelDecision as a, providerUsesCredentialScopedModelMetadata as i, createPreparedRuntimeModelMaterializer as n, resolveReusableRuntimeModelAuth as o, hasPreparedAuthAttemptModelMetadata as r, shouldForceDirectAuthFallbackModelResolve as s, protectPreparedProviderRuntimeAuth as t };
