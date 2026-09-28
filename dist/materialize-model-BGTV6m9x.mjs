import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as resolveProviderModelRouteMaterializationAuthMode, n as resolveProviderModelMaterializationAuthMode } from "./provider-model-route-auth-DkAaX3ui.mjs";
import { a as projectProviderModelRouteConfig, i as modelMatchesProviderModelRoute, t as canonicalizeProviderModelId } from "./provider-model-route-D-_CCdkJ.mjs";
import { r as resolveBuiltInModelSuppressionFromManifest } from "./model-suppression-BVXq4y94.mjs";
import { t as FailoverError } from "./error-ON38hPhx.mjs";
//#region src/agents/runtime-plan/materialize-model.ts
function modelMatchesPreparedTarget(params) {
	const modelId = canonicalizeProviderModelId(params.provider, params.model.id ?? "");
	const targetModelId = canonicalizeProviderModelId(params.provider, params.modelId);
	return normalizeProviderId(params.model.provider ?? "") === normalizeProviderId(params.provider) && modelId === targetModelId && (!params.route || modelMatchesProviderModelRoute({
		provider: params.provider,
		api: params.model.api,
		baseUrl: params.model.baseUrl,
		route: params.route
	}));
}
function validatePreparedTarget(params) {
	const { route } = params;
	if (route && (normalizeProviderId(route.provider) !== normalizeProviderId(params.provider) || canonicalizeProviderModelId(route.provider, route.modelId) !== canonicalizeProviderModelId(params.provider, params.modelId))) throw new Error(`Prepared runtime auth route ${route.provider}/${route.modelId} does not match target ${params.provider}/${params.modelId}.`);
}
/** Validates supplied final metadata without preparing credentials or resolving another model. */
function validatePreparedRuntimeModel(params) {
	validatePreparedTarget(params);
	const { model, route } = params;
	if (route && !modelMatchesPreparedTarget({
		...params,
		route
	})) throw new Error(`Caller-provided ${params.provider}/${params.modelId} metadata does not match its prepared ${route.authRequirement} route.`);
	const suppression = resolveBuiltInModelSuppressionFromManifest({
		provider: model.provider ?? params.provider,
		id: model.id ?? params.modelId,
		baseUrl: model.baseUrl,
		config: params.config,
		workspaceDir: params.workspaceDir,
		metadataSnapshot: params.metadataSnapshot
	});
	if (suppression?.retirement) throw new FailoverError(suppression.errorMessage, {
		reason: "model_not_found",
		provider: model.provider ?? params.provider,
		model: model.id ?? params.modelId
	});
	return model;
}
/** Resolves the exact model tuple selected by a prepared runtime auth plan. */
async function materializePreparedRuntimeModel(params) {
	const route = params.plan.modelRoute;
	const config = route ? projectProviderModelRouteConfig({
		provider: params.provider,
		config: params.config,
		route
	}) : params.config;
	const target = {
		...params,
		route,
		config
	};
	const validateFinalModel = (model) => model ? validatePreparedRuntimeModel({
		...target,
		model
	}) : void 0;
	if (!route && !params.forceResolve) return validateFinalModel(params.model);
	validatePreparedTarget(target);
	const callerModelMatches = params.model !== void 0 && modelMatchesPreparedTarget({
		...target,
		model: params.model
	});
	if (callerModelMatches && !params.forceResolve) return validateFinalModel(params.model);
	if (params.model && !callerModelMatches && params.rejectMismatchedModel) throw new Error(route ? `Caller-provided ${params.provider}/${params.modelId} metadata does not match its prepared ${route.authRequirement} route.` : `Caller-provided model metadata does not match ${params.provider}/${params.modelId}.`);
	const resolved = await params.resolveModel({
		config: config ?? {},
		authProfileId: params.plan.forwardedAuthProfileId,
		authProfileMode: route ? resolveProviderModelRouteMaterializationAuthMode({
			mode: params.plan.selectedAuthMode,
			requirement: route.authRequirement
		}) : resolveProviderModelMaterializationAuthMode(params.plan.selectedAuthMode)
	});
	if (!resolved.model || !modelMatchesPreparedTarget({
		...target,
		model: resolved.model
	})) throw new Error(resolved.error ?? (route ? `Unable to materialize ${params.provider}/${params.modelId} for its prepared ${route.authRequirement} route.` : `Unable to rematerialize ${params.provider}/${params.modelId} for its resolved auth profile.`));
	return validateFinalModel(resolved.model);
}
//#endregion
export { validatePreparedRuntimeModel as n, materializePreparedRuntimeModel as t };
