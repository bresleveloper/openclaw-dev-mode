import { h as runLiveProviderCatalog, m as LiveModelCatalogHttpError } from "./provider-catalog-live-runtime-8rOzIDOV.mjs";
import { r as getCachedLiveCatalogValue } from "./provider-catalog-shared-D7_lTYyN.mjs";
import { i as resolveGithubCopilotDomain } from "./domain-Bbe8oFEv.mjs";
import { t as buildCopilotRuntimeHeaders } from "./runtime-identity-BaI10xhs.mjs";
import { a as resolveCopilotForwardCompatModel, i as isCopilotCatalogModelVisible, n as PROVIDER_ID, r as fetchCopilotModelCatalog } from "./models-4bPcKrk0.mjs";
import { t as resolveFirstGithubToken } from "./auth-wtN2B4YS.mjs";
import { t as CopilotRuntimeAuthError } from "./runtime-auth-error-CQZde1c0.mjs";
//#region extensions/github-copilot/dynamic-models.ts
function dynamicModelScope(profileId, authProfileMode) {
	const normalizedProfileId = profileId?.trim();
	return normalizedProfileId ? `profile:${normalizedProfileId}` : authProfileMode ? `direct:${authProfileMode}` : "unscoped";
}
function createGithubCopilotDynamicModelHooks() {
	const preparedDynamicModels = /* @__PURE__ */ new WeakMap();
	async function resolveCatalogAuth(ctx) {
		const auth = await resolveFirstGithubToken(ctx);
		return auth.githubToken ? auth : null;
	}
	async function loadCatalog(ctx, auth, headers) {
		const { resolveCopilotRuntimeAuth } = await import("./extensions/github-copilot/register.runtime.js");
		const { apiKey: copilotApiToken, baseUrl } = await resolveCopilotRuntimeAuth({
			githubToken: auth.githubToken,
			env: ctx.env,
			githubDomain: resolveGithubCopilotDomain({
				env: ctx.env,
				explicit: auth.githubDomain,
				config: ctx.config
			})
		}).catch((error) => {
			if (error instanceof CopilotRuntimeAuthError && error.status !== void 0) throw new LiveModelCatalogHttpError(PROVIDER_ID, error.status);
			throw error;
		});
		return {
			baseUrl,
			models: await getCachedLiveCatalogValue({
				keyParts: [
					PROVIDER_ID,
					"models",
					baseUrl,
					copilotApiToken,
					headers["Copilot-Integration-Id"]
				],
				load: async () => await fetchCopilotModelCatalog({
					copilotApiToken,
					baseUrl,
					headers
				})
			})
		};
	}
	async function runCatalog(ctx) {
		const auth = await resolveCatalogAuth(ctx);
		if (!auth) return null;
		const headers = buildCopilotRuntimeHeaders({ config: ctx.config });
		return await runLiveProviderCatalog({
			providerId: PROVIDER_ID,
			profileId: auth.profileId,
			run: async () => {
				const catalog = await loadCatalog(ctx, auth, headers);
				return { provider: {
					...catalog,
					models: catalog.models.filter(isCopilotCatalogModelVisible)
				} };
			}
		});
	}
	async function prepareDynamicModel(ctx) {
		const catalogContext = {
			agentDir: ctx.agentDir,
			env: process.env,
			config: ctx.config,
			profileId: ctx.authProfileId,
			authProfileMode: ctx.authProfileMode
		};
		const auth = await resolveCatalogAuth(catalogContext);
		const catalog = auth ? await loadCatalog(catalogContext, auth, buildCopilotRuntimeHeaders({ config: ctx.config })).catch(() => null) : null;
		const models = /* @__PURE__ */ new Map();
		if (catalog) for (const model of catalog.models) models.set(model.id, {
			...model,
			provider: PROVIDER_ID,
			baseUrl: catalog.baseUrl
		});
		let scopedModels = preparedDynamicModels.get(ctx.modelRegistry);
		if (!scopedModels) {
			scopedModels = /* @__PURE__ */ new Map();
			preparedDynamicModels.set(ctx.modelRegistry, scopedModels);
		}
		scopedModels.set(dynamicModelScope(ctx.authProfileId, ctx.authProfileMode), models);
	}
	function resolveDynamicModel(ctx) {
		return preparedDynamicModels.get(ctx.modelRegistry)?.get(dynamicModelScope(ctx.authProfileId, ctx.authProfileMode))?.get(ctx.modelId) ?? resolveCopilotForwardCompatModel(ctx);
	}
	return {
		prepareDynamicModel,
		resolveDynamicModel,
		runCatalog,
		preferRuntimeResolvedModel: () => true
	};
}
//#endregion
export { createGithubCopilotDynamicModelHooks as t };
