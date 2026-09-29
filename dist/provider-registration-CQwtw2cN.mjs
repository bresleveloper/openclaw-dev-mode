import { n as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-Chp7QFG3.mjs";
import { h as runLiveProviderCatalog } from "./provider-catalog-live-runtime-8rOzIDOV.mjs";
import "./provider-entry-D3wDLM3X.mjs";
import { n as normalizeGoogleModelId } from "./model-id-CAmKILzd.mjs";
import { d as isOfficialGoogleAiStudioBaseUrl, l as isGoogleVertexBaseUrl, r as resolveGoogleGenerativeAiTransport, t as normalizeGoogleProviderConfig } from "./provider-policy-BWkzSuhk.mjs";
import { t as GOOGLE_GEMINI_PROVIDER_HOOKS } from "./provider-hooks-HvR5E__W.mjs";
import { i as resolveGoogleGeminiForwardCompatModel, r as isModernGoogleModel, t as isGoogleNativeVideoModelId } from "./provider-models-C7kay9Ti.mjs";
import { n as applyGoogleGeminiModelDefault, t as GOOGLE_GEMINI_DEFAULT_MODEL } from "./onboard-C3bCQYKd.mjs";
import { a as buildGoogleStaticCatalogProvider, o as buildGoogleVertexStaticCatalogProvider } from "./provider-catalog-DqlBFSWN.mjs";
import { t as buildGoogleLiveCatalogProvider } from "./provider-catalog-runtime-BaPcXKf7.mjs";
import { i as resolveGoogleVertexConfigApiKey } from "./vertex-adc-config-DuKAthGG.mjs";
import { n as createGoogleGenerativeAiTransportStreamFn, r as createGoogleVertexTransportStreamFn } from "./transport-stream-D_yaVqhX.mjs";
//#region extensions/google/provider-registration.ts
function normalizeGoogleVideoInput(ctx) {
	const input = ctx.model.input.filter((type) => type !== "video");
	const supportsVideo = ctx.provider === "google" && ctx.model.api === "google-generative-ai" && isOfficialGoogleAiStudioBaseUrl(ctx.model.baseUrl) && isGoogleNativeVideoModelId(ctx.modelId);
	return {
		...ctx.model,
		input: supportsVideo ? [...input, "video"] : input
	};
}
function resolveGoogleReasoningOutputMode(ctx) {
	if (ctx.provider === "google" || ctx.provider === "google-vertex") {
		const api = ctx.model?.api ?? ctx.modelApi;
		if (!api || api === "google-generative-ai" || api === "google-vertex") return "native";
	}
	return "tagged";
}
function buildGoogleProvider() {
	return {
		id: "google",
		label: "Google AI Studio",
		docsPath: "/providers/models",
		hookAliases: ["google-antigravity", "google-vertex"],
		envVars: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
		auth: [createProviderApiKeyAuthMethod({
			providerId: "google",
			methodId: "api-key",
			label: "Google AI Studio API key",
			hint: "Supported API-key access from aistudio.google.com/apikey",
			optionKey: "geminiApiKey",
			flagName: "--gemini-api-key",
			envVar: "GEMINI_API_KEY",
			promptMessage: "Enter Google AI Studio API key",
			defaultModel: GOOGLE_GEMINI_DEFAULT_MODEL,
			expectedProviders: ["google"],
			applyConfig: (cfg) => applyGoogleGeminiModelDefault(cfg).next,
			wizard: {
				choiceId: "gemini-api-key",
				choiceLabel: "Google AI Studio API key",
				groupId: "google",
				groupLabel: "Google",
				groupHint: "Supported API-key setup"
			}
		})],
		normalizeTransport: ({ provider, api, baseUrl }) => resolveGoogleGenerativeAiTransport({
			provider,
			api,
			baseUrl
		}),
		normalizeConfig: ({ provider, providerConfig }) => normalizeGoogleProviderConfig(provider, providerConfig),
		resolveConfigApiKey: ({ provider, env }) => provider === "google-vertex" ? resolveGoogleVertexConfigApiKey(env) : void 0,
		staticCatalog: {
			order: "simple",
			run: async () => ({ providers: {
				google: buildGoogleStaticCatalogProvider(),
				"google-vertex": buildGoogleVertexStaticCatalogProvider()
			} })
		},
		catalog: {
			order: "simple",
			run: async (ctx) => {
				if (ctx.providerIds && !ctx.providerIds.includes("google")) return null;
				const auth = ctx.resolveProviderApiKey("google");
				if (!auth.apiKey) return null;
				return await runLiveProviderCatalog({
					providerId: "google",
					profileId: auth.profileId,
					run: async () => ({ providers: { google: await buildGoogleLiveCatalogProvider({
						discoveryMode: "strict",
						apiKey: auth.apiKey,
						discoveryApiKey: auth.discoveryApiKey
					}) } })
				});
			}
		},
		normalizeModelId: ({ modelId }) => normalizeGoogleModelId(modelId),
		normalizeResolvedModel: normalizeGoogleVideoInput,
		resolveDynamicModel: (ctx) => resolveGoogleGeminiForwardCompatModel({
			providerId: ctx.provider,
			ctx
		}),
		createStreamFn: ({ model }) => {
			if (model.api === "google-vertex" || model.api === "google-generative-ai" && (model.provider === "google-vertex" || isGoogleVertexBaseUrl(model.baseUrl))) return createGoogleVertexTransportStreamFn();
			if (model.api === "google-generative-ai") return createGoogleGenerativeAiTransportStreamFn();
		},
		...GOOGLE_GEMINI_PROVIDER_HOOKS,
		resolveReasoningOutputMode: resolveGoogleReasoningOutputMode,
		isModernModelRef: ({ modelId }) => isModernGoogleModel(modelId)
	};
}
function registerGoogleProvider(api) {
	api.registerProvider(buildGoogleProvider());
}
//#endregion
export { registerGoogleProvider as n, buildGoogleProvider as t };
