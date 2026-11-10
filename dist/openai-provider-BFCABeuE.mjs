import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import "./defaults-Bg930vxE.mjs";
import { a as findCatalogTemplate, n as buildManifestModelProviderConfig } from "./provider-catalog-D0GOHaAj.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { n as buildFamilyForwardCompatModel, t as matchesExactOrPrefix } from "./provider-model-id-match-B5Dy1dOR.mjs";
import { n as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-ZKXZrO2f.mjs";
import "./provider-entry-CKUq_-Jy.mjs";
import "./provider-model-metadata-DkObn07R.mjs";
import { a as isOpenAIApiBaseUrl, c as resolveOpenAIDefaultBaseUrl, i as classifyOpenAIBaseUrl, n as OPENAI_CODEX_RESPONSES_BASE_URL, o as isOpenAICodexBaseUrl, s as resolveOpenAICodexModelsEndpoint } from "./base-url-Baro1bPi.mjs";
import { a as OPENAI_DEFAULT_MODEL, c as applyOpenAIConfig, t as OPENAI_CODEX_DEFAULT_MODEL } from "./default-models-CU9j2AqC.mjs";
import { C as isOpenAIPlatformOnlyRouteModelId, E as resolveOpenAICodexReasoningEfforts, T as normalizeOpenAIModelRouteId, b as OPENAI_PROVIDER_MODERN_MODEL_IDS, c as OPENAI_GPT_54_NANO_MODEL_ID, d as OPENAI_GPT_55_PRO_MODEL_ID, f as OPENAI_GPT_56_LUNA_MODEL_ID, h as OPENAI_GPT_56_TERRA_MODEL_ID, l as OPENAI_GPT_54_PRO_MODEL_ID, m as OPENAI_GPT_56_SOL_MODEL_ID, n as OPENAI_CHAT_LATEST_MODEL_ID, o as OPENAI_GPT_54_MINI_MODEL_ID, p as OPENAI_GPT_56_MODEL_ID, r as OPENAI_DAYBREAK_MODEL_IDS, s as OPENAI_GPT_54_MODEL_ID, u as OPENAI_GPT_55_MODEL_ID, w as isOpenAISubscriptionOnlyRouteModelId, x as buildOpenAIUnknownModelHint, y as OPENAI_GPT_6_MODEL_IDS } from "./model-route-contract-Fecaqw2C.mjs";
import { t as modelCatalog } from "./openclaw.plugin-_vm__Dty.mjs";
import { t as resolveUnifiedOpenAIThinkingProfile } from "./thinking-policy-D8447AxL.mjs";
import { l as isSIWCAuthFlow, s as TOKEN_SHARING_RESOURCE } from "./token-sharing-CmBELw8t.mjs";
import { o as resolveAuthoredOpenAIProviderConfig } from "./provider-policy-api-C5GDY1fk.mjs";
import { n as OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS, r as buildOpenAIResponsesProviderHooks, t as OPENAI_CODEX_GPT_61_SOL_CONTEXT_TOKENS } from "./shared-Dzn7GLPX.mjs";
import { i as projectOpenAIAccountModels, n as OPENAI_UNKNOWN_MODEL_COST, r as buildOpenAIUncataloguedModel, t as OPENAI_PRE_GPT5_MODEL_ID_PATTERN } from "./account-models-Dc_Z_cQ6.mjs";
import { i as shouldIncludeCodexModelRow, n as readCodexReasoningLevels, r as resolveCodexModelInput, t as readCodexModelRows } from "./codex-model-rows-BOOe49xC.mjs";
import { t as classifyOpenAiFailoverCode } from "./failover-code-D3m-V1qX.mjs";
import { n as projectOpenAICatalog, t as buildOpenAICodexReadyOutcome } from "./model-service-tiers-tOysGVi_.mjs";
import { n as buildOpenAICodexProviderHooks, t as buildOpenAIChatGPTAuthMethodRuns } from "./openai-chatgpt-provider-BzleGDeP.mjs";
import { t as createOpenAIProvider } from "./provider-contract-api-CBc9A4bA.mjs";
//#region extensions/openai/openai-provider.ts
const PROVIDER_ID = "openai";
const OPENAI_MODELS_ENDPOINT = "https://api.openai.com/v1/models";
const OPENAI_MODELS_CACHE_TTL_MS = 6e4;
const OPENAI_CODEX_MODELS_CACHE_TTL_MS = 6e4;
const OPENAI_CODEX_GPT_56_CONTEXT_WINDOW = 372e3;
const OPENAI_GPT_54_MAX_TOKENS = 128e3;
const OPENAI_CHAT_LATEST_COST = {
	input: 5,
	output: 30,
	cacheRead: .5,
	cacheWrite: 0
};
const OPENAI_CATALOG_AUGMENTATIONS = [
	{
		id: OPENAI_GPT_55_PRO_MODEL_ID,
		templateIds: [OPENAI_GPT_54_PRO_MODEL_ID, OPENAI_GPT_54_MODEL_ID],
		contextWindow: 105e4,
		contextTokens: OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS
	},
	{
		id: OPENAI_GPT_54_MODEL_ID,
		templateIds: [OPENAI_GPT_54_MODEL_ID, OPENAI_GPT_55_MODEL_ID],
		contextWindow: 105e4
	},
	{
		id: OPENAI_GPT_54_PRO_MODEL_ID,
		templateIds: [OPENAI_GPT_54_PRO_MODEL_ID, OPENAI_GPT_55_PRO_MODEL_ID],
		contextWindow: 105e4
	},
	{
		id: OPENAI_GPT_54_MINI_MODEL_ID,
		templateIds: [OPENAI_GPT_54_MINI_MODEL_ID, "gpt-5-mini"],
		contextWindow: 4e5
	},
	{
		id: OPENAI_GPT_54_NANO_MODEL_ID,
		templateIds: [
			OPENAI_GPT_54_NANO_MODEL_ID,
			"gpt-5-nano",
			"gpt-5-mini"
		],
		contextWindow: 4e5
	}
];
const OPENAI_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
	providerId: PROVIDER_ID,
	catalog: modelCatalog.providers.openai
});
function buildOpenAIManifestModelsForBaseUrl(baseUrl) {
	return OPENAI_MANIFEST_PROVIDER.models.map((model) => model.api === "openai-chatgpt-responses" || isOpenAICodexBaseUrl(model.baseUrl) ? { ...model } : {
		...model,
		api: model.api ?? OPENAI_MANIFEST_PROVIDER.api ?? "openai-responses",
		baseUrl
	});
}
function buildOpenAIStaticPlatformProviderConfig(apiKey, baseUrl = resolveOpenAIDefaultBaseUrl()) {
	return {
		baseUrl,
		api: "openai-responses",
		...apiKey ? { apiKey } : {},
		models: buildOpenAIManifestModelsForBaseUrl(baseUrl)
	};
}
async function buildOpenAILiveProviderConfig(params) {
	const baseUrl = normalizeOptionalString(params.baseUrl) ?? resolveOpenAIDefaultBaseUrl(params.env);
	const fallback = buildOpenAIStaticPlatformProviderConfig(params.apiKey, baseUrl);
	if (!isOpenAIApiBaseUrl(baseUrl)) return { provider: fallback };
	const [{ buildLiveModelProviderConfig, LiveModelCatalogHttpError }, { isNonSecretApiKeyMarker }] = await Promise.all([import("./plugin-sdk/provider-catalog-live-runtime.js"), import("./plugin-sdk/provider-auth.js")]);
	const rejectionScope = params.apiKey && !params.discoveryApiKey && isNonSecretApiKeyMarker(params.apiKey) ? "catalog" : void 0;
	const { models, ...providerConfig } = fallback;
	const catalogModels = [...models, {
		id: OPENAI_CHAT_LATEST_MODEL_ID,
		name: "Chat Latest",
		reasoning: false,
		cost: OPENAI_CHAT_LATEST_COST,
		contextWindow: 4e5,
		api: "openai-responses",
		baseUrl,
		input: ["text", "image"],
		maxTokens: OPENAI_GPT_54_MAX_TOKENS
	}];
	try {
		const provider = await buildLiveModelProviderConfig({
			discoveryMode: "strict",
			providerId: PROVIDER_ID,
			endpoint: OPENAI_MODELS_ENDPOINT,
			providerConfig,
			models: catalogModels,
			apiKey: params.apiKey,
			discoveryApiKey: params.discoveryApiKey,
			fetchGuard: params.fetchGuard,
			signal: params.signal,
			ttlMs: OPENAI_MODELS_CACHE_TTL_MS,
			auditContext: "openai-model-discovery"
		});
		return {
			provider: {
				...provider,
				models: projectOpenAIAccountModels({
					listedModels: provider.models,
					catalogModels,
					baseUrl
				})
			},
			outcome: {
				provider: PROVIDER_ID,
				status: "ready"
			}
		};
	} catch (error) {
		if (error instanceof LiveModelCatalogHttpError && (error.status === 401 || error.status === 403)) return {
			provider: {
				...fallback,
				models: []
			},
			outcome: {
				provider: PROVIDER_ID,
				...rejectionScope ? { rejectionScope } : {},
				status: "auth-rejected"
			}
		};
		return {
			provider: fallback,
			outcome: {
				provider: PROVIDER_ID,
				status: "unavailable"
			}
		};
	}
}
function normalizeOpenAICodexCatalogModel(model) {
	const modelId = normalizeLowercaseStringOrEmpty(model.id);
	if (modelId === "gpt-5.6-sol" || modelId === "gpt-5.6-terra" || modelId === "gpt-5.6-luna") {
		const supportedReasoningEfforts = resolveOpenAICodexReasoningEfforts(modelId, model.compat?.supportedReasoningEfforts?.filter((effort) => effort !== "none"));
		return {
			...model,
			contextWindow: OPENAI_CODEX_GPT_56_CONTEXT_WINDOW,
			contextTokens: OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS,
			thinkingLevelMap: {
				...model.thinkingLevelMap,
				off: null
			},
			...model.compat ? { compat: {
				...model.compat,
				...supportedReasoningEfforts ? { supportedReasoningEfforts } : {}
			} } : {}
		};
	}
	return model;
}
function resolveCodexModelFallback(modelId) {
	const fallbackModel = OPENAI_MANIFEST_PROVIDER.models.find((candidate) => normalizeLowercaseStringOrEmpty(candidate.id) === normalizeLowercaseStringOrEmpty(modelId));
	if (fallbackModel?.id === "gpt-6.1-sol") return {
		...fallbackModel,
		contextTokens: OPENAI_CODEX_GPT_61_SOL_CONTEXT_TOKENS
	};
	return fallbackModel ? normalizeOpenAICodexCatalogModel(fallbackModel) : void 0;
}
function buildOpenAICodexModelFromLiveRow(row, readers) {
	const { readLiveModelCatalogStringField, readLiveModelCatalogPositiveSafeIntegerField } = readers;
	if (!shouldIncludeCodexModelRow(row, readers)) return;
	const modelId = readLiveModelCatalogStringField(row, "slug") ?? readLiveModelCatalogStringField(row, "id");
	if (!modelId) return;
	if (isOpenAIPlatformOnlyRouteModelId(modelId)) return;
	const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
	const fallback = resolveCodexModelFallback(modelId);
	const reasoningLevels = readCodexReasoningLevels(row);
	const observedContextTokens = readLiveModelCatalogPositiveSafeIntegerField(row, ["context_window", "contextWindow"]);
	const contextTokens = matchesExactOrPrefix(normalizedModelId, ["gpt-5.6"]) ? Math.min(observedContextTokens ?? fallback?.contextTokens ?? 272e3, OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS) : observedContextTokens;
	const contextWindow = readLiveModelCatalogPositiveSafeIntegerField(row, ["max_context_window", "maxContextWindow"]) ?? fallback?.contextWindow ?? observedContextTokens ?? 2e5;
	const maxTokens = readLiveModelCatalogPositiveSafeIntegerField(row, [
		"max_output_tokens",
		"maxOutputTokens",
		"max_completion_tokens",
		"maxCompletionTokens"
	]) ?? fallback?.maxTokens ?? OPENAI_GPT_54_MAX_TOKENS;
	const compat = reasoningLevels !== void 0 ? {
		...fallback?.compat,
		supportsReasoningEffort: true,
		supportedReasoningEfforts: [...reasoningLevels]
	} : fallback?.compat;
	const thinkingLevelMap = {
		...reasoningLevels === void 0 ? fallback?.thinkingLevelMap : {},
		...fallback?.thinkingLevelMap?.off === null || normalizedModelId.startsWith("gpt-5.6") ? { off: null } : {},
		...reasoningLevels?.includes("xhigh") ? { xhigh: "xhigh" } : {},
		...reasoningLevels?.includes("max") ? { max: "max" } : {}
	};
	return normalizeOpenAICodexCatalogModel({
		id: modelId,
		name: readLiveModelCatalogStringField(row, "display_name") ?? fallback?.name ?? modelId,
		api: "openai-chatgpt-responses",
		baseUrl: OPENAI_CODEX_RESPONSES_BASE_URL,
		reasoning: (reasoningLevels?.length ?? 0) > 0 || fallback?.reasoning || false,
		input: resolveCodexModelInput(row, fallback),
		cost: fallback?.cost ?? OPENAI_UNKNOWN_MODEL_COST,
		contextWindow,
		maxTokens,
		...contextTokens ?? fallback?.contextTokens ? { contextTokens: contextTokens ?? fallback?.contextTokens } : {},
		...fallback?.mediaInput ? { mediaInput: fallback.mediaInput } : {},
		...compat ? { compat } : {},
		...Object.keys(thinkingLevelMap).length > 0 ? { thinkingLevelMap } : {}
	});
}
function buildOpenAICodexStaticProviderConfig() {
	return {
		baseUrl: OPENAI_CODEX_RESPONSES_BASE_URL,
		api: "openai-chatgpt-responses",
		auth: "oauth",
		models: OPENAI_MANIFEST_PROVIDER.models.flatMap((model) => {
			const modelId = normalizeLowercaseStringOrEmpty(model.id);
			if (isOpenAIPlatformOnlyRouteModelId(modelId)) return [];
			if (OPENAI_GPT_6_MODEL_IDS.some((id) => id === modelId) || OPENAI_DAYBREAK_MODEL_IDS.some((id) => id === modelId) || modelId.startsWith("gpt-5.6") && modelId !== "gpt-5.6-sol") return [];
			return [normalizeOpenAICodexCatalogModel(model)];
		})
	};
}
async function buildOpenAICodexLiveProviderConfig(params) {
	const catalogRuntime = await import("./plugin-sdk/provider-catalog-live-runtime.js");
	const { getCachedLiveProviderModelRows, LiveModelCatalogHttpError } = catalogRuntime;
	const endpoint = await resolveOpenAICodexModelsEndpoint(params.catalogContext);
	try {
		const rows = await getCachedLiveProviderModelRows({
			providerId: PROVIDER_ID,
			endpoint,
			discoveryApiKey: params.discoveryApiKey,
			fetchGuard: params.fetchGuard,
			signal: params.signal,
			ttlMs: OPENAI_CODEX_MODELS_CACHE_TTL_MS,
			auditContext: "openai-model-discovery",
			readRows: readCodexModelRows,
			buildRequestHeaders: ({ discoveryApiKey }) => ({
				Accept: "application/json",
				...discoveryApiKey ? { Authorization: `Bearer ${discoveryApiKey}` } : {},
				...params.accountId ? { "ChatGPT-Account-ID": params.accountId } : {}
			}),
			cacheKeyParts: [
				PROVIDER_ID,
				"codex-model-rows",
				endpoint,
				params.discoveryApiKey,
				params.accountId ?? ""
			]
		});
		const models = rows.map((row) => buildOpenAICodexModelFromLiveRow(row, catalogRuntime)).filter((model) => Boolean(model));
		return {
			provider: {
				baseUrl: OPENAI_CODEX_RESPONSES_BASE_URL,
				api: "openai-chatgpt-responses",
				auth: "oauth",
				models
			},
			outcome: buildOpenAICodexReadyOutcome(rows)
		};
	} catch (error) {
		if (error instanceof LiveModelCatalogHttpError && (error.status === 401 || error.status === 403)) return {
			provider: {
				...buildOpenAICodexStaticProviderConfig(),
				models: []
			},
			outcome: {
				provider: PROVIDER_ID,
				status: "auth-rejected"
			}
		};
	}
	return {
		provider: buildOpenAICodexStaticProviderConfig(),
		outcome: {
			provider: PROVIDER_ID,
			status: "unavailable"
		}
	};
}
function isCodexCatalogAuthMode(mode) {
	return mode === "oauth" || mode === "token";
}
function resolveOpenAICatalogBaseUrl(ctx) {
	const configuredProvider = Object.entries(ctx.config?.models?.providers ?? {}).find(([providerId]) => normalizeProviderId(providerId) === PROVIDER_ID)?.[1];
	return normalizeOptionalString(configuredProvider?.baseUrl) ?? resolveOpenAIDefaultBaseUrl(ctx.env ?? process.env);
}
function shouldUseOpenAIResponsesTransport(params) {
	if (params.api !== "openai-completions") return false;
	const isOwnerProvider = normalizeProviderId(params.provider) === PROVIDER_ID;
	const isPlatformEndpoint = typeof params.baseUrl === "string" && classifyOpenAIBaseUrl(params.baseUrl) === "platform";
	if (isOwnerProvider) {
		if (resolveAuthoredOpenAICompletionsRoute(params)) return false;
		return !params.baseUrl || isPlatformEndpoint;
	}
	return isPlatformEndpoint;
}
/** Authored Completions is a current transport contract; only catalog defaults are upgraded. */
function resolveAuthoredOpenAICompletionsRoute(params) {
	const providerConfig = resolveAuthoredOpenAIProviderConfig(params);
	if (!providerConfig) return;
	const modelId = normalizeOpenAIModelRouteId(params.modelId);
	let modelConfig;
	for (const model of providerConfig.models ?? []) {
		if (normalizeOpenAIModelRouteId(model.id) !== modelId) continue;
		modelConfig = modelConfig ? {
			...model,
			...modelConfig
		} : model;
	}
	if ((normalizeOptionalString(modelConfig?.api) ?? normalizeOptionalString(providerConfig.api)) !== "openai-completions") return;
	return {
		api: "openai-completions",
		baseUrl: normalizeOptionalString(modelConfig?.baseUrl) ?? normalizeOptionalString(providerConfig.baseUrl) ?? resolveOpenAIDefaultBaseUrl(process.env)
	};
}
function shouldUseCodexResponsesHooks(params) {
	if (params?.api === "openai-chatgpt-responses") return true;
	return typeof params?.baseUrl === "string" && isOpenAICodexBaseUrl(params.baseUrl);
}
function shouldResolveDynamicModelThroughCodex(ctx) {
	if (shouldUseCodexResponsesHooks(ctx.providerConfig)) return true;
	if (ctx.providerConfig?.api === "openai-responses" || ctx.providerConfig?.api === "openai-completions" || ctx.providerConfig?.baseUrl && !isOpenAICodexBaseUrl(ctx.providerConfig.baseUrl)) return false;
	if (isOpenAIPlatformOnlyRouteModelId(ctx.modelId)) return false;
	if (isOpenAISubscriptionOnlyRouteModelId(ctx.modelId)) return true;
	return ctx.agentRuntimeId === "codex";
}
const OPENAI_GPT_FORWARD_COMPAT_CASES = [
	{
		match: OPENAI_DAYBREAK_MODEL_IDS,
		templateIds: [OPENAI_GPT_56_SOL_MODEL_ID]
	},
	{
		match: OPENAI_GPT_6_MODEL_IDS,
		templateIds: [OPENAI_GPT_56_SOL_MODEL_ID, OPENAI_GPT_55_MODEL_ID]
	},
	{
		match: [OPENAI_CHAT_LATEST_MODEL_ID],
		templateIds: [OPENAI_GPT_55_MODEL_ID, OPENAI_GPT_54_MODEL_ID],
		patch: {
			reasoning: false,
			cost: OPENAI_CHAT_LATEST_COST,
			contextWindow: 4e5
		}
	},
	{
		match: [
			OPENAI_GPT_56_MODEL_ID,
			OPENAI_GPT_56_SOL_MODEL_ID,
			OPENAI_GPT_56_TERRA_MODEL_ID,
			OPENAI_GPT_56_LUNA_MODEL_ID
		],
		templateIds: [OPENAI_GPT_55_MODEL_ID]
	},
	{
		match: [OPENAI_GPT_55_MODEL_ID],
		templateIds: [OPENAI_GPT_55_MODEL_ID, OPENAI_GPT_54_MODEL_ID]
	},
	...OPENAI_CATALOG_AUGMENTATIONS.map(({ id, templateIds }) => ({
		match: [id],
		templateIds
	}))
];
function resolveOpenAIGptForwardCompatModel(ctx) {
	const trimmedModelId = ctx.modelId.trim();
	const modelId = normalizeLowercaseStringOrEmpty(trimmedModelId);
	if (OPENAI_PRE_GPT5_MODEL_ID_PATTERN.test(modelId)) return {
		...buildOpenAIUncataloguedModel(trimmedModelId, resolveOpenAIDefaultBaseUrl()),
		provider: PROVIDER_ID
	};
	const exactModel = ctx.modelRegistry.find(PROVIDER_ID, trimmedModelId);
	if (OPENAI_DAYBREAK_MODEL_IDS.some((id) => id === modelId) || OPENAI_GPT_6_MODEL_IDS.some((id) => id === modelId) || modelId === "gpt-5.6-sol" || modelId === "gpt-5.6-terra" || modelId === "gpt-5.6-luna") {
		if (exactModel) return exactModel;
	}
	const catalogModel = OPENAI_MANIFEST_PROVIDER.models.find(({ id }) => id === (modelId === "gpt-5.6" ? OPENAI_GPT_56_SOL_MODEL_ID : modelId));
	return buildFamilyForwardCompatModel({
		providerId: PROVIDER_ID,
		ctx,
		cases: OPENAI_GPT_FORWARD_COMPAT_CASES,
		patch: {
			reasoning: true,
			maxTokens: OPENAI_GPT_54_MAX_TOKENS,
			...catalogModel,
			id: trimmedModelId,
			name: trimmedModelId,
			api: "openai-responses",
			provider: PROVIDER_ID,
			baseUrl: resolveOpenAIDefaultBaseUrl(),
			input: catalogModel ? catalogModel.input.filter((item) => item === "text" || item === "image") : ["text", "image"],
			compat: exactModel ? exactModel.compat : catalogModel?.compat
		},
		synthesize: true
	});
}
function buildOpenAIProvider() {
	const providerDefinition = createOpenAIProvider();
	const apiKeyDefinition = providerDefinition.auth.find((method) => method.id === "api-key");
	if (!apiKeyDefinition) throw new Error("OpenAI provider contract is missing API-key auth");
	const chatGPTAuthRuns = buildOpenAIChatGPTAuthMethodRuns();
	const apiKeyRuntime = createProviderApiKeyAuthMethod({
		providerId: PROVIDER_ID,
		methodId: apiKeyDefinition.id,
		label: apiKeyDefinition.label,
		hint: apiKeyDefinition.hint,
		optionKey: "openaiApiKey",
		flagName: "--openai-api-key",
		envVar: "OPENAI_API_KEY",
		promptMessage: "Enter OpenAI API key",
		profileId: "openai:api-key",
		defaultModel: OPENAI_DEFAULT_MODEL,
		preserveExistingPrimary: true,
		expectedProviders: [PROVIDER_ID],
		applyConfig: (cfg) => applyOpenAIConfig(cfg),
		wizard: apiKeyDefinition.wizard
	});
	for (const method of providerDefinition.auth) {
		if (method.id === "siwc") {
			method.starterModel = OPENAI_DEFAULT_MODEL;
			method.run = async (ctx) => (await import("./extensions/openai/token-sharing-oauth.runtime.js")).loginTokenSharing(ctx);
			continue;
		}
		if (method.id === "oauth" || method.id === "device-code") {
			method.starterModel = OPENAI_CODEX_DEFAULT_MODEL;
			method.run = chatGPTAuthRuns[method.id];
			continue;
		}
		if (method.id !== "api-key") throw new Error(`OpenAI provider contract has unknown auth method: ${method.id}`);
		method.starterModel = apiKeyRuntime.starterModel;
		method.run = apiKeyRuntime.run;
		method.runNonInteractive = apiKeyRuntime.runNonInteractive;
		method.validateNonInteractive = apiKeyRuntime.validateNonInteractive;
	}
	const codexHooks = buildOpenAICodexProviderHooks();
	const nativeResponsesHooks = buildOpenAIResponsesProviderHooks();
	const responsesHooks = buildOpenAIResponsesProviderHooks({ transport: "sse" });
	return {
		...providerDefinition,
		catalog: {
			order: "simple",
			run: async (ctx) => {
				if (ctx.providerIds && !ctx.providerIds.includes(PROVIDER_ID)) return null;
				const auth = ctx.resolveProviderAuth(PROVIDER_ID);
				if (isSIWCAuthFlow(auth.authFlow)) {
					const { buildTokenSharingCatalog } = await import("./extensions/openai/token-sharing-catalog.js");
					return await buildTokenSharingCatalog({
						auth,
						models: buildOpenAIStaticPlatformProviderConfig(void 0, TOKEN_SHARING_RESOURCE).models,
						signal: ctx.signal
					});
				}
				if (auth.preparationFailed) return null;
				const [{ resolveApiKeyForProvider, resolveProviderAuthProfileMetadataAsync }, { isNonSecretApiKeyMarker }] = await Promise.all([import("./plugin-sdk/provider-auth-runtime.js"), import("./plugin-sdk/provider-auth.js")]);
				let runtimeAuth;
				if (auth.profileId || auth.mode === "none") try {
					runtimeAuth = await resolveApiKeyForProvider({
						provider: PROVIDER_ID,
						cfg: ctx.config,
						...ctx.agentDir ? { agentDir: ctx.agentDir } : {},
						...ctx.workspaceDir ? { workspaceDir: ctx.workspaceDir } : {},
						...auth.profileId ? {
							profileId: auth.profileId,
							lockedProfile: true
						} : {}
					});
				} catch {
					runtimeAuth = void 0;
				}
				if (runtimeAuth && isCodexCatalogAuthMode(runtimeAuth.mode) && runtimeAuth.apiKey) {
					const metadata = await resolveProviderAuthProfileMetadataAsync({
						provider: PROVIDER_ID,
						cfg: ctx.config,
						...ctx.agentDir ? { agentDir: ctx.agentDir } : {},
						...runtimeAuth.profileId ?? auth.profileId ? { profileId: runtimeAuth.profileId ?? auth.profileId } : {}
					});
					return projectOpenAICatalog(await buildOpenAICodexLiveProviderConfig({
						discoveryApiKey: runtimeAuth.apiKey,
						accountId: metadata.accountId,
						catalogContext: ctx
					}), runtimeAuth.profileId ?? auth.profileId);
				}
				if (!auth.profileId && isCodexCatalogAuthMode(auth.mode) && auth.apiKey) {
					const discoveryApiKey = auth.discoveryApiKey ?? (isNonSecretApiKeyMarker(auth.apiKey) ? void 0 : auth.apiKey);
					if (!discoveryApiKey) return {
						providers: { [PROVIDER_ID]: buildOpenAICodexStaticProviderConfig() },
						outcomes: [{
							provider: PROVIDER_ID,
							status: "unavailable"
						}]
					};
					return projectOpenAICatalog(await buildOpenAICodexLiveProviderConfig({
						discoveryApiKey,
						catalogContext: ctx
					}));
				}
				if (auth.profileId && isCodexCatalogAuthMode(auth.mode)) return {
					providers: { [PROVIDER_ID]: buildOpenAICodexStaticProviderConfig() },
					outcomes: [{
						provider: PROVIDER_ID,
						profileId: auth.profileId,
						status: "unavailable"
					}]
				};
				if (auth.mode === "api_key" && auth.apiKey) {
					const discoveryApiKey = auth.discoveryApiKey ?? (runtimeAuth?.mode === "api-key" ? runtimeAuth.apiKey : void 0);
					if (!discoveryApiKey && isNonSecretApiKeyMarker(auth.apiKey)) return {
						providers: { [PROVIDER_ID]: buildOpenAIStaticPlatformProviderConfig(auth.apiKey, resolveOpenAICatalogBaseUrl(ctx)) },
						outcomes: [{
							provider: PROVIDER_ID,
							...auth.profileId ? { profileId: auth.profileId } : {},
							rejectionScope: "catalog",
							status: "unavailable"
						}]
					};
					return projectOpenAICatalog(await buildOpenAILiveProviderConfig({
						apiKey: auth.apiKey,
						baseUrl: resolveOpenAICatalogBaseUrl(ctx),
						discoveryApiKey
					}), auth.profileId);
				}
				return null;
			}
		},
		staticCatalog: {
			order: "simple",
			run: async () => ({ providers: { [PROVIDER_ID]: OPENAI_MANIFEST_PROVIDER } })
		},
		resolveDynamicModel: (ctx) => shouldResolveDynamicModelThroughCodex(ctx) ? codexHooks.resolveDynamicModel?.(ctx) : resolveOpenAIGptForwardCompatModel(ctx),
		preferRuntimeResolvedModel: (ctx) => codexHooks.preferRuntimeResolvedModel?.(ctx) ?? false,
		normalizeResolvedModel: (ctx) => {
			if (normalizeProviderId(ctx.provider ?? "") !== PROVIDER_ID) return;
			const authoredCompletionsRoute = resolveAuthoredOpenAICompletionsRoute(ctx);
			if (authoredCompletionsRoute) return {
				...ctx.model,
				...authoredCompletionsRoute
			};
			if (shouldUseCodexResponsesHooks(ctx.model)) return codexHooks.normalizeResolvedModel?.(ctx);
			return shouldUseOpenAIResponsesTransport({
				...ctx.model,
				modelId: ctx.modelId,
				config: ctx.config
			}) ? {
				...ctx.model,
				api: "openai-responses"
			} : ctx.model;
		},
		normalizeTransport: (ctx) => {
			const authoredCompletionsRoute = resolveAuthoredOpenAICompletionsRoute(ctx);
			if (authoredCompletionsRoute) return ctx.api === authoredCompletionsRoute.api && ctx.baseUrl === authoredCompletionsRoute.baseUrl ? void 0 : authoredCompletionsRoute;
			if (shouldUseCodexResponsesHooks(ctx)) return codexHooks.normalizeTransport?.(ctx);
			return shouldUseOpenAIResponsesTransport(ctx) ? {
				api: "openai-responses",
				baseUrl: ctx.baseUrl
			} : void 0;
		},
		...responsesHooks,
		prepareExtraParams: (ctx) => {
			if (ctx.auth?.mode === "oauth" && ctx.auth.authFlow === "chatgpt-token-sharing") return {
				...ctx.extraParams,
				transport: "sse",
				store: false,
				responsesServerCompaction: false
			};
			const providerConfig = ctx.config?.models?.providers?.[PROVIDER_ID];
			return (shouldUseCodexResponsesHooks(ctx.model) || normalizeProviderId(ctx.provider) === PROVIDER_ID && (!providerConfig?.baseUrl || isOpenAIApiBaseUrl(providerConfig.baseUrl)) && isCodexCatalogAuthMode(providerConfig?.auth ?? "") ? nativeResponsesHooks : responsesHooks).prepareExtraParams?.(ctx);
		},
		resolveUsageAuth: codexHooks.resolveUsageAuth,
		fetchUsageSnapshot: codexHooks.fetchUsageSnapshot,
		refreshOAuth: async (credential) => isSIWCAuthFlow(credential.authFlow) ? (await import("./extensions/openai/token-sharing-oauth.runtime.js")).refreshTokenSharingCredential(credential) : codexHooks.refreshOAuth(credential),
		buildUnknownModelHint: ({ modelId }) => buildOpenAIUnknownModelHint(modelId),
		buildMissingAuthMessage: (ctx) => {
			if (normalizeProviderId(ctx.provider) !== PROVIDER_ID) return;
			if (ctx.listProfileIds(PROVIDER_ID).length === 0) return;
			return `No API key found for provider "openai". You are authenticated with OpenAI ChatGPT/Codex OAuth. Use ${OPENAI_CODEX_DEFAULT_MODEL} with the ChatGPT/Codex OAuth profile, or set OPENAI_API_KEY for direct OpenAI API access.`;
		},
		matchesContextOverflowError: ({ errorMessage }) => /content_filter.*(?:prompt|input).*(?:too long|exceed)/i.test(errorMessage),
		classifyFailoverReason: ({ code, errorMessage }) => /^Provider (?:finish_reason|incomplete_reason): content_filter$/.test(errorMessage) ? "format" : classifyOpenAiFailoverCode(code),
		resolveReasoningOutputMode: () => "native",
		resolveThinkingProfile: ({ provider, modelId, agentRuntime, api, compat, thinkingLevelMap }) => normalizeProviderId(provider) === PROVIDER_ID ? resolveUnifiedOpenAIThinkingProfile(modelId, agentRuntime, compat, api, thinkingLevelMap) : null,
		isModernModelRef: ({ modelId }) => matchesExactOrPrefix(modelId, OPENAI_PROVIDER_MODERN_MODEL_IDS),
		augmentModelCatalog: (ctx) => {
			return OPENAI_CATALOG_AUGMENTATIONS.flatMap(({ templateIds, ...model }) => {
				const template = findCatalogTemplate({
					entries: ctx.entries,
					providerId: PROVIDER_ID,
					templateIds
				});
				const input = ["text", "image"];
				return template ? [{
					...template,
					...model,
					name: model.id,
					reasoning: true,
					input
				}] : [];
			});
		}
	};
}
//#endregion
export { buildOpenAIProvider as t };
