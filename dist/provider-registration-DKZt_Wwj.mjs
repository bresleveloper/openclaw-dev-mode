import { a as createLazyRuntimeSurface } from "./lazy-runtime-CJrzFzqU.mjs";
import { n as normalizeGooglePreviewModelId } from "./provider-model-id-normalize-DjenOxD2.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-wdC9jpCz.mjs";
import { n as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-ZKXZrO2f.mjs";
import { h as runLiveProviderCatalog } from "./provider-catalog-live-runtime-BILEsjga.mjs";
import "./provider-catalog-shared-Di2nlF3g.mjs";
import "./provider-entry-CKUq_-Jy.mjs";
import "./model-id-B1FKGbAg.mjs";
import { a as isOfficialGoogleAiStudioBaseUrl, r as isGoogleVertexBaseUrl } from "./google-api-base-url-BSKc6KBi.mjs";
import { r as resolveGoogleGenerativeAiTransport, t as normalizeGoogleProviderConfig } from "./provider-policy-COnE2-la.mjs";
import { t as GOOGLE_GEMINI_PROVIDER_HOOKS } from "./provider-hooks-DZTeU4OL.mjs";
import { a as resolveGoogleGeminiForwardCompatModel, i as isModernGoogleModel, n as isGoogleNativeVideoModelId, o as resolveGoogleModelApi } from "./provider-models-D-n-Hu1B.mjs";
import { n as applyGoogleGeminiModelDefault, t as GOOGLE_GEMINI_DEFAULT_MODEL } from "./onboard-B3W8W8Z7.mjs";
import { a as buildGoogleStaticCatalogProvider, o as buildGoogleVertexStaticCatalogProvider } from "./provider-catalog-DnwI0rvm.mjs";
import { t as buildGoogleLiveCatalogProvider } from "./provider-catalog-runtime-BQOYl6GR.mjs";
import { i as resolveGoogleVertexConfigApiKey } from "./vertex-adc-config-D9DGGSGC.mjs";
//#region extensions/google/provider-discovery.ts
const googleProviderDiscovery = {
	id: "google",
	label: "Google AI Studio",
	docsPath: "/providers/models",
	auth: [],
	resolveConfigApiKey: ({ provider, env }) => provider === "google-vertex" ? resolveGoogleVertexConfigApiKey(env) : void 0,
	staticCatalog: {
		order: "simple",
		run: async () => ({ providers: {
			google: buildGoogleStaticCatalogProvider(),
			"google-vertex": buildGoogleVertexStaticCatalogProvider()
		} })
	}
};
//#endregion
//#region extensions/google/provider-registration.ts
function resolveGoogleReasoningOutputMode(ctx) {
	if (ctx.provider === "google" || ctx.provider === "google-vertex" || ctx.provider === "google-interactions") {
		const api = ctx.model?.api ?? ctx.modelApi;
		if (!api || api === "google-generative-ai" || api === "google-vertex" || api === "google-interactions") return "native";
	}
	return "tagged";
}
const loadGenerativeAiStream = createLazyRuntimeSurface(() => import("./extensions/google/transport-stream.js"), (runtime) => runtime.createGoogleGenerativeAiTransportStreamFn());
const loadVertexStream = createLazyRuntimeSurface(() => import("./extensions/google/transport-stream.js"), (runtime) => runtime.createGoogleVertexTransportStreamFn());
const loadInteractionsStream = createLazyRuntimeSurface(() => import("./extensions/google/transport-stream.js"), (runtime) => runtime.createGoogleInteractionsTransportStreamFn());
function buildGoogleProvider() {
	return {
		...googleProviderDiscovery,
		hookAliases: [
			"google-antigravity",
			"google-vertex",
			"google-interactions"
		],
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
		normalizeModelId: ({ modelId }) => normalizeGooglePreviewModelId(modelId),
		normalizeResolvedModel: (ctx) => {
			const input = ctx.model.input.filter((type) => type !== "video");
			const supportsVideo = ctx.provider === "google" && (ctx.model.api === "google-generative-ai" || ctx.model.api === "google-interactions") && isOfficialGoogleAiStudioBaseUrl(ctx.model.baseUrl) && isGoogleNativeVideoModelId(ctx.modelId);
			return {
				...ctx.model,
				api: resolveGoogleModelApi({
					provider: ctx.provider,
					modelId: ctx.modelId,
					api: ctx.model.api,
					baseUrl: ctx.model.baseUrl,
					providerConfig: resolveMergedModelProviderConfig(ctx.config, ctx.provider)
				}),
				input: supportsVideo ? [...input, "video"] : input
			};
		},
		resolveDynamicModel: (ctx) => resolveGoogleGeminiForwardCompatModel({
			providerId: ctx.provider,
			ctx
		}),
		createStreamFn: ({ model }) => {
			if (model.api === "google-vertex" || model.api === "google-generative-ai" && (model.provider === "google-vertex" || isGoogleVertexBaseUrl(model.baseUrl))) return async (...args) => (await loadVertexStream())(...args);
			if (model.api === "google-generative-ai") return async (...args) => (await loadGenerativeAiStream())(...args);
			if (model.api === "google-interactions") return async (...args) => (await loadInteractionsStream())(...args);
		},
		...GOOGLE_GEMINI_PROVIDER_HOOKS,
		resolveReasoningOutputMode: resolveGoogleReasoningOutputMode,
		isModernModelRef: ({ modelId }) => isModernGoogleModel(modelId)
	};
}
//#endregion
export { buildGoogleProvider as t };
