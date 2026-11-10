import { a as asOptionalRecord } from "../../record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "../../utf16-slice-D_ngcYKd.mjs";
import { n as findNormalizedProviderValue } from "../../provider-id-D1VImdKk.mjs";
import { r as resolveAgentConfig } from "../../agent-scope-config-fjA2T9Gz.mjs";
import { o as resolveDefaultModelMaxTokens } from "../../defaults-Bg930vxE.mjs";
import "../../string-coerce-runtime-BbIJhy7G.mjs";
import "../../text-utility-runtime-B9RB6Cg0.mjs";
import { o as buildPassthroughGeminiSanitizingReplayPolicy } from "../../provider-replay-helpers-B7QyB_ca.mjs";
import "../../agent-scope-runtime-Dld1eD8B.mjs";
import "../../provider-model-shared-B_4afNJ5.mjs";
import "../../provider-auth-JCvgbsWg.mjs";
import { h as runLiveProviderCatalog } from "../../provider-catalog-live-runtime-BILEsjga.mjs";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-CKUq_-Jy.mjs";
import { a as loadOpenRouterModelCapabilities, r as getLoadedOpenRouterModelCapabilities } from "../../provider-stream-D-B5aERN.mjs";
import "../../provider-stream-family-DCSl210N.mjs";
import "../../provider-defaults-ilQX6q3J.mjs";
import { a as resolveOpenRouterApiBaseUrl, i as normalizeOpenRouterBaseUrl, n as buildOpenrouterProvider, r as isOpenRouterProxyReasoningUnsupportedModel, t as buildOpenrouterLiveProvider } from "../../provider-catalog-CNn8GbrF.mjs";
import { t as buildOpenRouterImageGenerationProvider } from "../../image-generation-provider-C5kchZoW.mjs";
import { t as openrouterMediaUnderstandingProvider } from "../../media-understanding-provider-Bb8XYIDu.mjs";
import { i as normalizeOpenRouterModelFamilyId, n as isOpenRouterMistralModelId, r as normalizeOpenRouterApiModelId } from "../../models-CrlfkNW6.mjs";
import { t as buildOpenRouterMusicGenerationProvider } from "../../music-generation-provider-BS2iHTEh.mjs";
import { n as applyOpenrouterConfig, t as OPENROUTER_DEFAULT_MODEL_REF } from "../../onboard-DOCPQBy4.mjs";
import { t as createOpenRouterOAuthAuthMethod } from "../../oauth-CLJMWWs6.mjs";
import { t as resolveOpenRouterExtraParamsForTransport } from "../../provider-routing-CgfUYlmZ.mjs";
import { t as buildOpenRouterSpeechProvider } from "../../speech-provider-CXRkg77r.mjs";
import { t as wrapOpenRouterProviderStream } from "../../stream-D0Uilx0L.mjs";
import { t as resolveOpenRouterThinkingProfile } from "../../thinking-policy-DqOqcerC.mjs";
import { n as normalizeOpenRouterToolSchemas, t as inspectOpenRouterToolSchemas } from "../../tool-schemas-CbJSCojp.mjs";
import { t as fetchOpenRouterUsage } from "../../usage-DpZRQ9-T.mjs";
import { t as listOpenRouterVideoModelCatalog } from "../../video-model-catalog-FRX7YYEl.mjs";
import { t as buildOpenRouterVideoGenerationProvider } from "../../video-generation-provider-Bhisvymz.mjs";
//#region extensions/openrouter/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "openrouter",
	categories: ["models"],
	capabilityCatalogEntry: "./capability-catalog.ts",
	activation: { "onStartup": false },
	enabledByDefault: true,
	managesOwnAvailability: true,
	providers: ["openrouter"],
	modelCatalog: { "discovery": { "openrouter": "runtime" } },
	modelIdNormalization: { "providers": { "openrouter": { "prefixWhenBare": "openrouter" } } },
	modelPricing: { "providers": { "openrouter": {
		"openRouter": { "provider": "openrouter" },
		"modelsDev": false,
		"liteLLM": false
	} } },
	providerEndpoints: [{
		"endpointClass": "openrouter",
		"hostSuffixes": ["openrouter.ai"]
	}],
	providerRequest: { "providers": { "openrouter": { "family": "openrouter" } } },
	setup: { "providers": [{
		"id": "openrouter",
		"envVars": ["OPENROUTER_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "openrouter",
		"method": "api-key",
		"choiceId": "openrouter-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "OpenRouter API key",
		"groupId": "openrouter",
		"groupLabel": "OpenRouter",
		"groupHint": "OAuth or API key",
		"onboardingScopes": ["text-inference", "music-generation"],
		"optionKey": "openrouterApiKey",
		"cliFlag": "--openrouter-api-key",
		"cliOption": "--openrouter-api-key <key>",
		"cliDescription": "OpenRouter API key"
	}, {
		"provider": "openrouter",
		"method": "oauth",
		"choiceId": "openrouter-oauth",
		"credentialOnly": true,
		"appGuidedAuth": "oauth",
		"channelLogin": {},
		"choiceLabel": "OpenRouter OAuth",
		"choiceHint": "Browser sign-in",
		"groupId": "openrouter",
		"groupLabel": "OpenRouter",
		"groupHint": "OAuth or API key",
		"onboardingScopes": ["text-inference", "music-generation"],
		"onboardingFeatured": true
	}],
	contracts: {
		"mediaUnderstandingProviders": ["openrouter"],
		"imageGenerationProviders": ["openrouter"],
		"musicGenerationProviders": ["openrouter"],
		"videoGenerationProviders": ["openrouter"],
		"speechProviders": ["openrouter"],
		"usageProviders": ["openrouter"]
	},
	mediaUnderstandingProviderMetadata: { "openrouter": {
		"capabilities": ["image", "audio"],
		"defaultModels": {
			"image": "auto",
			"audio": "openai/whisper-large-v3-turbo"
		},
		"autoPriority": { "audio": 35 }
	} },
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/openrouter/index.ts
const PROVIDER_ID = "openrouter";
const OPENROUTER_FUSION_MODEL_ID = "openrouter/fusion";
const OPENROUTER_CACHE_TTL_MODEL_FAMILY = /^(?:(?:anthropic|deepseek|moonshot(?:ai)?|x-ai|z-?ai)\/|google\/gemini-(?:2\.5|3))/;
const MAX_PROMPT_MODEL_ID_DISPLAY_CHARS = 256;
function isOpenRouterCatalogRoute(route) {
	return (route.api == null || route.api === "openai-completions") && (route.baseUrl == null || route.baseUrl === "https://openrouter.ai/api/v1");
}
function withOpenRouterCatalogThinking(ctx) {
	if (ctx.thinkingLevelMap || ctx.compat?.supportsReasoningEffort !== void 0 || ctx.compat?.supportedReasoningEfforts !== void 0 || !isOpenRouterCatalogRoute(ctx)) return ctx;
	const capabilities = getLoadedOpenRouterModelCapabilities(normalizeOpenRouterApiModelId(ctx.modelId) ?? ctx.modelId);
	if (!capabilities?.compat && !capabilities?.thinkingLevelMap) return ctx;
	return {
		...ctx,
		compat: {
			...capabilities.compat,
			...ctx.compat
		},
		...capabilities.thinkingLevelMap ? { thinkingLevelMap: capabilities.thinkingLevelMap } : {}
	};
}
function normalizeOpenRouterResolvedModel(model) {
	const normalizedBaseUrl = normalizeOpenRouterBaseUrl(model.baseUrl);
	const normalizedId = normalizeOpenRouterApiModelId(model.id);
	const reasoning = isOpenRouterProxyReasoningUnsupportedModel(model.id) ? false : model.reasoning;
	if ((!normalizedBaseUrl || normalizedBaseUrl === model.baseUrl) && (!normalizedId || normalizedId === model.id) && reasoning === model.reasoning) return;
	return {
		...model,
		...normalizedId ? { id: normalizedId } : {},
		...normalizedBaseUrl ? { baseUrl: normalizedBaseUrl } : {},
		reasoning
	};
}
function sanitizePromptModelId(value) {
	if (typeof value !== "string") return;
	return truncateUtf16Safe(value.replace(/[\p{Cc}\u2028\u2029]/gu, "").trim(), MAX_PROMPT_MODEL_ID_DISPLAY_CHARS) || void 0;
}
function openRouterModelConfigKey(modelId) {
	const providerPrefix = `${PROVIDER_ID}/`;
	return modelId.trim().toLowerCase().startsWith(providerPrefix) ? modelId : `${PROVIDER_ID}/${modelId}`;
}
function findConfiguredOpenRouterModelParams(ctx) {
	const configuredModels = ctx.config?.agents?.defaults?.models;
	if (!configuredModels) return;
	const normalizedModelId = normalizeOpenRouterApiModelId(ctx.modelId) ?? ctx.modelId;
	const directKeys = [
		openRouterModelConfigKey(ctx.modelId),
		openRouterModelConfigKey(normalizedModelId),
		`${PROVIDER_ID}/${ctx.modelId}`,
		`${PROVIDER_ID}/${normalizedModelId}`
	];
	for (const key of directKeys) {
		const params = asOptionalRecord(configuredModels[key]?.params);
		if (params) return params;
	}
	for (const [rawKey, entry] of Object.entries(configuredModels)) {
		const slashIndex = rawKey.indexOf("/");
		if (slashIndex <= 0) continue;
		const provider = rawKey.slice(0, slashIndex).trim().toLowerCase();
		const modelId = rawKey.slice(slashIndex + 1);
		const candidateModelId = normalizeOpenRouterApiModelId(modelId) ?? modelId;
		if (provider === PROVIDER_ID && candidateModelId.trim().toLowerCase() === normalizedModelId.trim().toLowerCase()) return asOptionalRecord(entry.params);
	}
}
function resolveFusionExtraBody(ctx) {
	const params = {
		...asOptionalRecord(ctx.config?.agents?.defaults?.params),
		...findConfiguredOpenRouterModelParams(ctx),
		...ctx.agentId ? asOptionalRecord(resolveAgentConfig(ctx.config ?? {}, ctx.agentId)?.params) : {}
	};
	if (Object.keys(params).length === 0) return;
	return asOptionalRecord(Object.hasOwn(params, "extra_body") ? params.extra_body : params.extraBody);
}
function resolveOpenRouterFusionPromptContribution(ctx) {
	if ((normalizeOpenRouterApiModelId(ctx.modelId) ?? ctx.modelId) !== OPENROUTER_FUSION_MODEL_ID) return;
	const extraBody = resolveFusionExtraBody(ctx);
	const fusionPlugin = Array.isArray(extraBody?.plugins) ? extraBody.plugins.map(asOptionalRecord).find((plugin) => plugin?.id === "fusion") : void 0;
	if (!fusionPlugin || fusionPlugin.enabled === false) return;
	const analysisModels = Array.isArray(fusionPlugin.analysis_models) ? fusionPlugin.analysis_models.map(sanitizePromptModelId).filter((model) => Boolean(model)) : [];
	const finalModel = sanitizePromptModelId(fusionPlugin.model);
	const lines = [
		"## OpenRouter Fusion Configuration",
		"The active OpenRouter Fusion request is configured with these non-secret Fusion plugin fields.",
		analysisModels.length > 0 ? `Analysis models: ${analysisModels.join(", ")}.` : void 0,
		finalModel ? `Final Fusion model: ${finalModel}.` : void 0
	].filter((line) => Boolean(line));
	return lines.length > 2 ? { dynamicSuffix: lines.join("\n") } : void 0;
}
var openrouter_default = defineSingleProviderPluginEntry({
	id: "openrouter",
	name: "OpenRouter Provider",
	description: "Bundled OpenRouter provider plugin",
	manifest: openclaw_plugin_default,
	provider() {
		function buildDynamicOpenRouterModel(ctx) {
			const apiModelId = normalizeOpenRouterApiModelId(ctx.modelId) ?? ctx.modelId;
			const capabilities = getLoadedOpenRouterModelCapabilities(apiModelId);
			return {
				id: ctx.modelId,
				name: capabilities?.name ?? ctx.modelId,
				api: "openai-completions",
				provider: PROVIDER_ID,
				baseUrl: resolveOpenRouterApiBaseUrl(ctx.providerConfig?.baseUrl ?? ctx.config?.models?.providers?.openrouter?.baseUrl),
				reasoning: (capabilities?.reasoning ?? false) && !isOpenRouterProxyReasoningUnsupportedModel(ctx.modelId),
				input: capabilities?.input ?? ["text"],
				...capabilities?.compat || capabilities?.supportsTools !== void 0 ? { compat: {
					...capabilities.compat,
					...capabilities.supportsTools !== void 0 ? { supportsTools: capabilities.supportsTools } : {}
				} } : {},
				...capabilities?.thinkingLevelMap ? { thinkingLevelMap: capabilities.thinkingLevelMap } : {},
				cost: capabilities?.cost ?? {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0
				},
				contextWindow: capabilities?.contextWindow ?? 2e5,
				maxTokens: capabilities?.maxTokens ?? resolveDefaultModelMaxTokens(capabilities?.contextWindow)
			};
		}
		return {
			label: "OpenRouter",
			docsPath: "/providers/models",
			manifestAuth: {
				hint: "API key",
				defaultModel: OPENROUTER_DEFAULT_MODEL_REF,
				applyConfig: applyOpenrouterConfig
			},
			extraAuth: [createOpenRouterOAuthAuthMethod()],
			catalog: {
				order: "simple",
				run: async (ctx) => {
					const auth = ctx.resolveProviderApiKey(PROVIDER_ID);
					const apiKey = auth.apiKey;
					if (!apiKey) return null;
					const providerConfig = ctx.config.models?.providers?.openrouter;
					return await runLiveProviderCatalog({
						providerId: PROVIDER_ID,
						profileId: auth.profileId,
						run: async () => ({ provider: await buildOpenrouterLiveProvider({
							apiKey,
							discoveryApiKey: auth.discoveryApiKey,
							baseUrl: providerConfig?.baseUrl,
							request: providerConfig?.request
						}) })
					});
				},
				staticRun: async (ctx) => {
					if (ctx.providerIds?.includes(PROVIDER_ID)) await loadOpenRouterModelCapabilities(OPENROUTER_DEFAULT_MODEL_REF);
					return { provider: buildOpenrouterProvider() };
				}
			},
			resolveDynamicModel: buildDynamicOpenRouterModel,
			preferRuntimeResolvedModel: (ctx) => {
				const configuredProvider = findNormalizedProviderValue(ctx.config?.models?.providers, PROVIDER_ID);
				const requestedId = normalizeOpenRouterApiModelId(ctx.modelId) ?? ctx.modelId;
				const configuredModel = configuredProvider?.models?.find((model) => (normalizeOpenRouterApiModelId(model.id) ?? model.id) === requestedId);
				return configuredModel !== void 0 && isOpenRouterCatalogRoute({
					api: configuredModel.api ?? configuredProvider?.api,
					baseUrl: configuredModel.baseUrl ?? configuredProvider?.baseUrl
				});
			},
			prepareDynamicModel: async (ctx) => {
				await loadOpenRouterModelCapabilities(normalizeOpenRouterApiModelId(ctx.modelId) ?? ctx.modelId);
			},
			normalizeConfig: ({ providerConfig }) => {
				const normalizedBaseUrl = normalizeOpenRouterBaseUrl(providerConfig.baseUrl);
				return normalizedBaseUrl && normalizedBaseUrl !== providerConfig.baseUrl ? {
					...providerConfig,
					baseUrl: normalizedBaseUrl
				} : void 0;
			},
			normalizeResolvedModel: ({ model }) => normalizeOpenRouterResolvedModel(model),
			normalizeTransport: ({ api: apiLocal, baseUrl }) => {
				const normalizedBaseUrl = normalizeOpenRouterBaseUrl(baseUrl);
				return normalizedBaseUrl && normalizedBaseUrl !== baseUrl ? {
					api: apiLocal,
					baseUrl: normalizedBaseUrl
				} : void 0;
			},
			classifyFailoverReason: ({ provider, errorMessage }) => {
				if (provider?.trim().toLowerCase() !== PROVIDER_ID) return;
				if (/\b(?:api\s+key\s+budget|key)\s+limit\s*(?:exceeded|reached|hit)\b/i.test(errorMessage)) return "billing";
				return /provider returned error/i.test(errorMessage) ? "timeout" : void 0;
			},
			buildReplayPolicy: ({ modelId }) => ({
				...buildPassthroughGeminiSanitizingReplayPolicy(modelId),
				...isOpenRouterMistralModelId(modelId) ? {
					sanitizeToolCallIds: true,
					toolCallIdMode: "strict9"
				} : {}
			}),
			normalizeToolSchemas: normalizeOpenRouterToolSchemas,
			inspectToolSchemas: inspectOpenRouterToolSchemas,
			resolveReasoningOutputMode: () => "native",
			resolveThinkingProfile: (ctx) => resolveOpenRouterThinkingProfile(ctx.modelId, withOpenRouterCatalogThinking(ctx)),
			isModernModelRef: () => true,
			resolveSystemPromptContribution: resolveOpenRouterFusionPromptContribution,
			extraParamsForTransport: resolveOpenRouterExtraParamsForTransport,
			wrapStreamFn: wrapOpenRouterProviderStream,
			wrapSimpleCompletionStreamFn: wrapOpenRouterProviderStream,
			isCacheTtlEligible: ({ modelId }) => OPENROUTER_CACHE_TTL_MODEL_FAMILY.test(normalizeOpenRouterModelFamilyId(modelId) ?? ""),
			resolveUsageAuth: async (ctx) => {
				const apiKey = (await ctx.resolveApiKeyCandidatesFromConfigAndStore?.({ envDirect: [ctx.env.OPENROUTER_API_KEY] }))?.[0];
				return apiKey ? { token: apiKey } : null;
			},
			fetchUsageSnapshot: async (ctx) => await fetchOpenRouterUsage({
				token: ctx.token,
				baseUrl: ctx.config.models?.providers?.openrouter?.baseUrl,
				request: ctx.config.models?.providers?.openrouter?.request,
				timeoutMs: ctx.timeoutMs,
				signal: ctx.signal,
				fetchFn: ctx.fetchFn
			})
		};
	},
	register(api) {
		api.registerMediaUnderstandingProvider(openrouterMediaUnderstandingProvider);
		api.registerImageGenerationProvider(buildOpenRouterImageGenerationProvider());
		api.registerMusicGenerationProvider(buildOpenRouterMusicGenerationProvider());
		api.registerVideoGenerationProvider(buildOpenRouterVideoGenerationProvider());
		api.registerModelCatalogProvider({
			provider: PROVIDER_ID,
			kinds: ["video_generation"],
			liveCatalog: listOpenRouterVideoModelCatalog
		});
		api.registerSpeechProvider(buildOpenRouterSpeechProvider());
	}
});
//#endregion
export { openrouter_default as default };
