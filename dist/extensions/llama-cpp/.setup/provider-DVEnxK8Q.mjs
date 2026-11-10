import { _ as LLAMA_CPP_PROVIDER_ID } from "./defaults-DX4XN2j1.mjs";
import { r as resolveLlamaServerEndpoint, s as hasLlamaServerAuthorizationHeader } from "./provider-discovery-SxEYhgMV.mjs";
import { i as resolveLlamaServerRuntimeApiKey, n as buildLlamaServerProviderConfig, r as resolveLlamaServerProviderHeaders, t as discoverLlamaServer } from "./discovery-osk0TXQN.mjs";
import { isNonSecretApiKeyMarker } from "openclaw/plugin-sdk/provider-auth";
import { LiveModelCatalogHttpError, runLiveProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
//#region extensions/llama-cpp/src/external-server/provider.ts
/** Discovers external llama-server models for provider runtime resolution. */
async function discoverLlamaServerProvider(ctx) {
	const configured = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const auth = ctx.resolveProviderApiKey(LLAMA_CPP_PROVIDER_ID);
	const headers = await resolveLlamaServerProviderHeaders({
		config: ctx.config,
		env: ctx.env,
		headers: configured?.headers
	});
	const authApiKey = auth.discoveryApiKey ?? auth.apiKey;
	const apiKey = hasLlamaServerAuthorizationHeader(headers) || authApiKey && isNonSecretApiKeyMarker(authApiKey) ? void 0 : authApiKey;
	return await runLiveProviderCatalog({
		providerId: LLAMA_CPP_PROVIDER_ID,
		profileId: apiKey ? auth.profileId : void 0,
		run: async () => {
			const discovery = await discoverLlamaServer({
				baseUrl: configured?.baseUrl,
				apiKey,
				headers,
				allowPrivateNetwork: configured?.request?.allowPrivateNetwork
			});
			if (discovery.kind !== "success") {
				if (!configured && !apiKey && !headers) return null;
				throw discovery.kind === "http-error" ? new LiveModelCatalogHttpError(LLAMA_CPP_PROVIDER_ID, discovery.status) : discovery.error;
			}
			return { provider: buildLlamaServerProviderConfig({
				configured,
				discoveredModels: discovery.models
			}) };
		}
	});
}
async function prepareLlamaServerDynamicModel(ctx) {
	const apiKey = await resolveLlamaServerRuntimeApiKey({
		config: ctx.config,
		agentDir: ctx.agentDir,
		profileId: ctx.authProfileId
	});
	const headers = await resolveLlamaServerProviderHeaders({
		config: ctx.config,
		env: process.env,
		headers: ctx.providerConfig?.headers
	});
	const discovery = await discoverLlamaServer({
		baseUrl: ctx.providerConfig?.baseUrl,
		apiKey: hasLlamaServerAuthorizationHeader(headers) ? void 0 : apiKey,
		headers,
		allowPrivateNetwork: ctx.providerConfig?.request?.allowPrivateNetwork
	});
	const model = discovery.kind === "success" ? discovery.models.find((entry) => entry.config.id === ctx.modelId) : void 0;
	if (!model) return;
	return {
		...model.config,
		provider: LLAMA_CPP_PROVIDER_ID,
		api: ctx.providerConfig?.api ?? "openai-completions",
		baseUrl: resolveLlamaServerEndpoint(ctx.providerConfig?.baseUrl).inferenceBaseUrl,
		input: model.config.input.filter((entry) => entry === "text" || entry === "image")
	};
}
//#endregion
export { discoverLlamaServerProvider, prepareLlamaServerDynamicModel };
