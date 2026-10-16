import { r as createLazyRuntimeModule } from "../../lazy-runtime-CJrzFzqU.mjs";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.mjs";
import { h as defaultToolStreamExtraParams } from "../../provider-stream-shared-D8q3R1a-.mjs";
import { r as buildProviderReplayFamilyHooks } from "../../provider-model-shared-BZZnLgoM.mjs";
import { h as runLiveProviderCatalog } from "../../provider-catalog-live-runtime-NaavztHY.mjs";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-B2Tqqb69.mjs";
import "../../provider-web-search-DUaDxxRi.mjs";
import { n as createCodeExecutionToolDefinition, t as buildMissingCodeExecutionApiKeyPayload } from "../../code-execution-tool-shared-CeAkKo1Y.mjs";
import { i as normalizeXaiModelId } from "../../model-id-BCpLVsfx.mjs";
import { a as createLazyXaiSpeechProvider, i as createLazyXaiRealtimeVoiceProvider, n as createLazyXaiMediaUnderstandingProvider, r as createLazyXaiRealtimeTranscriptionProvider, t as createLazyXaiImageGenerationProvider } from "../../lazy-capability-provider-factories-DRo4AbZV.mjs";
import { t as createLazyXaiVideoGenerationProvider } from "../../lazy-capability-providers-sWXLo4Nl.mjs";
import "../../model-compat-BSGTIihA.mjs";
import { n as applyXaiConfig, t as XAI_DEFAULT_MODEL_REF } from "../../onboard-CnuA5-ZT.mjs";
import { i as isXaiGrokProxyBaseUrl, n as buildLiveXaiProvider, r as buildXaiProvider, t as buildLiveXaiOAuthProvider } from "../../provider-catalog-CAX97roz.mjs";
import { t as isXaiProviderId } from "../../provider-id-BvdhW5fW.mjs";
import { t as resolveXaiTransport } from "../../provider-routing-DQwJJlDW.mjs";
import { t as applyXaiRuntimeModelCompat } from "../../runtime-model-compat-DAKPoZ8t.mjs";
import { n as resolveXaiForwardCompatModel, t as isModernXaiModel } from "../../provider-models-fl9IQjAZ.mjs";
import { n as resolveThinkingProfile } from "../../provider-policy-api-CGWCzq3O.mjs";
import { n as resolveFallbackXaiAuth, t as isXaiToolEnabled } from "../../tool-auth-shared-DfHEiTF0.mjs";
import { n as readPluginCodeExecutionConfig, r as resolveCodeExecutionEnabled } from "../../code-execution-config-LHbglujB.mjs";
import { t as resolveEffectiveXSearchConfig } from "../../x-search-config-wCiEf8cg.mjs";
import { t as wrapXaiProviderStream } from "../../stream-Df8Nq_5n.mjs";
import { t as fetchXaiUsage } from "../../usage-PpgCR5_O.mjs";
import { t as createXaiWebSearchProvider } from "../../web-search-z2Ycgs2T.mjs";
import { n as buildMissingXSearchApiKeyPayload, r as createXSearchToolDefinition } from "../../x-search-tool-shared-nlZ40kdg.mjs";
import { n as createXaiOAuthAuthMethod, r as refreshXaiOAuthCredential, t as createXaiDeviceCodeAuthMethod } from "../../xai-oauth-entry-Cf0zvn9x.mjs";
//#region extensions/xai/index.ts
const PROVIDER_ID = "xai";
const XAI_CREDIT_OR_SPENDING_LIMIT_RE = /\b(?:used all available credits|run out of credits|monthly spending limit|purchase more credits|raise your spending limit|need a Grok subscription)\b/i;
const XAI_RATE_LIMIT_RE = /\b(?:rate limit exceeded|too many requests)\b/i;
const XAI_PROVIDER_INTERNAL_ERROR_RE = /\binternal error during token generation\b/i;
const loadCodeExecutionModule = createLazyRuntimeModule(() => import("./code-execution.js"));
const loadXSearchModule = createLazyRuntimeModule(() => import("./x-search.js"));
function classifyXaiFailoverReason({ errorMessage, status, code, errorType }) {
	if (XAI_CREDIT_OR_SPENDING_LIMIT_RE.test(errorMessage)) return "billing";
	if (XAI_RATE_LIMIT_RE.test(errorMessage)) return "rate_limit";
	if (status === void 0 && code === void 0 && errorType === void 0 && XAI_PROVIDER_INTERNAL_ERROR_RE.test(errorMessage)) return "server_error";
}
function isCodeExecutionEnabled(config, auth) {
	return resolveCodeExecutionEnabled({
		sourceConfig: config,
		runtimeConfig: config,
		config: readPluginCodeExecutionConfig(config),
		auth
	});
}
function isXSearchEnabled(config, auth) {
	if ((config && typeof config === "object" ? resolveEffectiveXSearchConfig(config) : void 0)?.enabled === false) return false;
	return isXaiToolEnabled({
		sourceConfig: config,
		auth
	});
}
function shouldExposeXaiBilledTool(params) {
	const activeProvider = params.activeProvider?.trim();
	if (!activeProvider || params.enabled === false) return false;
	return isXaiProviderId(activeProvider) || params.enabled === true;
}
function createLazyCodeExecutionTool(ctx) {
	const effectiveConfig = ctx.runtimeConfig ?? ctx.config;
	const codeExecutionConfig = readPluginCodeExecutionConfig(effectiveConfig);
	if (!shouldExposeXaiBilledTool({
		activeProvider: ctx.activeModel?.provider,
		enabled: codeExecutionConfig?.enabled
	})) return null;
	if (!isCodeExecutionEnabled(effectiveConfig, ctx)) return null;
	return createCodeExecutionToolDefinition(async (toolCallId, args) => {
		const { createCodeExecutionTool } = await loadCodeExecutionModule();
		const tool = createCodeExecutionTool({
			config: ctx.config,
			runtimeConfig: ctx.runtimeConfig ?? null,
			auth: ctx
		});
		if (!tool) return jsonResult(buildMissingCodeExecutionApiKeyPayload());
		return await tool.execute(toolCallId, args);
	});
}
function createLazyXSearchTool(ctx) {
	const effectiveConfig = ctx.runtimeConfig ?? ctx.config;
	const xSearchConfig = resolveEffectiveXSearchConfig(effectiveConfig);
	if (!shouldExposeXaiBilledTool({
		activeProvider: ctx.activeModel?.provider,
		enabled: xSearchConfig?.enabled
	})) return null;
	if (!isXSearchEnabled(effectiveConfig, ctx)) return null;
	return createXSearchToolDefinition(async (toolCallId, args, signal) => {
		signal?.throwIfAborted();
		const { createXSearchTool } = await loadXSearchModule();
		signal?.throwIfAborted();
		const tool = createXSearchTool({
			config: ctx.config,
			runtimeConfig: ctx.runtimeConfig ?? null,
			auth: ctx
		});
		if (!tool) return jsonResult(buildMissingXSearchApiKeyPayload());
		return await tool.execute(toolCallId, args, signal);
	});
}
var xai_default = defineSingleProviderPluginEntry({
	id: "xai",
	name: "xAI Plugin",
	description: "Bundled xAI plugin",
	provider: (pluginApi) => ({
		label: "xAI",
		aliases: ["x-ai"],
		docsPath: "/providers/xai",
		auth: [{
			methodId: "api-key",
			label: "xAI API key",
			hint: "API key",
			optionKey: "xaiApiKey",
			flagName: "--xai-api-key",
			envVar: "XAI_API_KEY",
			promptMessage: "Enter xAI API key",
			defaultModel: XAI_DEFAULT_MODEL_REF,
			preserveExistingPrimary: true,
			applyConfig: (cfg) => applyXaiConfig(cfg),
			wizard: { groupLabel: "xAI (Grok)" }
		}],
		extraAuth: [createXaiOAuthAuthMethod(), createXaiDeviceCodeAuthMethod()],
		catalog: {
			order: "simple",
			run: async (ctx) => {
				const auth = ctx.resolveProviderAuth(PROVIDER_ID);
				if (auth.preparationFailed) return null;
				const { resolveApiKeyForProvider } = await import("../../plugin-sdk/provider-auth-runtime.js");
				const grokProxy = isXaiGrokProxyBaseUrl(ctx.config.models?.providers?.[PROVIDER_ID]?.baseUrl);
				const resolvedAuth = auth.mode === "token" && grokProxy && auth.discoveryApiKey ? {
					...auth,
					apiKey: auth.discoveryApiKey
				} : await resolveApiKeyForProvider({
					provider: PROVIDER_ID,
					cfg: ctx.config,
					...ctx.agentDir ? { agentDir: ctx.agentDir } : {},
					...ctx.workspaceDir ? { workspaceDir: ctx.workspaceDir } : {},
					...auth.profileId ? {
						profileId: auth.profileId,
						lockedProfile: true
					} : {},
					...!auth.profileId && auth.mode !== "none" ? { allowAuthProfileFallback: false } : {}
				}).catch(() => void 0);
				const subscriptionToken = (resolvedAuth?.mode === "token" || auth.mode === "token") && grokProxy;
				if (subscriptionToken && (!resolvedAuth?.apiKey || resolvedAuth.mode !== "token")) return {
					providers: {},
					outcomes: [{
						provider: PROVIDER_ID,
						profileId: auth.profileId,
						status: "unavailable"
					}]
				};
				const selectedAuth = resolvedAuth?.apiKey && (resolvedAuth.mode === "oauth" || subscriptionToken) ? {
					...resolvedAuth,
					oauth: true
				} : {
					...auth.apiKey ? auth : ctx.resolveProviderApiKey(PROVIDER_ID),
					oauth: false
				};
				if (!selectedAuth.apiKey) return null;
				const apiKey = selectedAuth.apiKey;
				return await runLiveProviderCatalog({
					providerId: PROVIDER_ID,
					profileId: selectedAuth.profileId,
					run: async () => ({ provider: selectedAuth.oauth ? await buildLiveXaiOAuthProvider({
						discoveryApiKey: apiKey,
						authMode: selectedAuth.mode === "token" ? "token" : "oauth"
					}) : await buildLiveXaiProvider(selectedAuth) })
				});
			},
			staticRun: async (ctx) => {
				const auth = ctx.resolveProviderAuth(PROVIDER_ID);
				const authMode = auth.mode === "oauth" ? "oauth" : auth.mode === "token" && isXaiGrokProxyBaseUrl(ctx.config.models?.providers?.[PROVIDER_ID]?.baseUrl) ? "token" : void 0;
				return { provider: buildXaiProvider("openai-responses", authMode) };
			}
		},
		...buildProviderReplayFamilyHooks({ family: "openai-compatible" }),
		prepareExtraParams: (ctx) => defaultToolStreamExtraParams(ctx.extraParams),
		wrapStreamFn: (ctx) => wrapXaiProviderStream(ctx, { clientVersion: pluginApi.runtime.version }),
		resolveSyntheticAuth: ({ config }) => {
			const fallbackAuth = resolveFallbackXaiAuth(config);
			if (!fallbackAuth) return;
			return {
				apiKey: fallbackAuth.apiKey,
				source: fallbackAuth.source,
				mode: "api-key"
			};
		},
		normalizeResolvedModel: ({ model }) => applyXaiRuntimeModelCompat(model),
		normalizeTransport: ({ provider, api, baseUrl }) => resolveXaiTransport({
			provider,
			api,
			baseUrl
		}),
		normalizeModelId: ({ modelId }) => normalizeXaiModelId(modelId),
		resolveDynamicModel: (ctx) => resolveXaiForwardCompatModel({
			providerId: PROVIDER_ID,
			ctx
		}),
		refreshOAuth: refreshXaiOAuthCredential,
		resolveUsageAuth: async (ctx) => {
			const oauth = await ctx.resolveOAuthToken();
			return oauth ? oauth : { handled: true };
		},
		fetchUsageSnapshot: async (ctx) => await fetchXaiUsage(ctx.token, ctx.timeoutMs, ctx.fetchFn),
		resolveThinkingProfile,
		isModernModelRef: ({ modelId }) => isModernXaiModel(modelId),
		classifyFailoverReason: classifyXaiFailoverReason
	}),
	register(api) {
		api.registerWebSearchProvider(createXaiWebSearchProvider());
		api.registerMediaUnderstandingProvider(createLazyXaiMediaUnderstandingProvider());
		api.registerVideoGenerationProvider(createLazyXaiVideoGenerationProvider());
		api.registerImageGenerationProvider(createLazyXaiImageGenerationProvider());
		api.registerSpeechProvider(createLazyXaiSpeechProvider);
		api.registerRealtimeTranscriptionProvider(createLazyXaiRealtimeTranscriptionProvider);
		api.registerRealtimeVoiceProvider(createLazyXaiRealtimeVoiceProvider);
		api.registerTool((ctx) => createLazyCodeExecutionTool(ctx), { name: "code_execution" });
		api.registerTool((ctx) => createLazyXSearchTool(ctx), { name: "x_search" });
	}
});
//#endregion
export { xai_default as default };
