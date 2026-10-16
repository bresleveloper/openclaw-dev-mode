import { A as OPENAI_PROVIDER_MODERN_MODEL_IDS, B as resolveOpenAIDefaultBaseUrl, C as OPENAI_GPT_55_PRO_MODEL_ID, D as OPENAI_GPT_56_TERRA_MODEL_ID, E as OPENAI_GPT_56_SOL_MODEL_ID, F as resolveOpenAICodexReasoningEfforts, I as OPENAI_CODEX_RESPONSES_BASE_URL, L as classifyOpenAIBaseUrl, M as isOpenAIPlatformOnlyRouteModelId, N as isOpenAISubscriptionOnlyRouteModelId, O as OPENAI_GPT_56_VARIANT_MODEL_IDS, P as normalizeOpenAIModelRouteId, R as isOpenAIApiBaseUrl, S as OPENAI_GPT_55_MODEL_ID, T as OPENAI_GPT_56_MODEL_ID, a as modelCatalog, b as OPENAI_GPT_54_NANO_MODEL_ID, g as OPENAI_GPT_53_CODEX_SPARK_MODEL_ID, h as OPENAI_DAYBREAK_MODEL_IDS, i as resolveUnifiedOpenAIThinkingProfile, j as buildOpenAIUnknownModelHint, k as OPENAI_GPT_6_MODEL_IDS, m as OPENAI_CHAT_LATEST_MODEL_ID, n as resolveAuthoredOpenAIProviderConfig, p as OPENAI_CHATGPT_MODERN_MODEL_IDS, v as OPENAI_GPT_54_MINI_MODEL_ID, w as OPENAI_GPT_56_LUNA_MODEL_ID, x as OPENAI_GPT_54_PRO_MODEL_ID, y as OPENAI_GPT_54_MODEL_ID, z as isOpenAICodexBaseUrl } from "./provider-policy-api-yoLTiHQu.mjs";
import { l as isSIWCAuthFlow, s as TOKEN_SHARING_RESOURCE } from "./token-sharing-CmBELw8t.mjs";
import { t as createOpenAIProvider } from "./provider-contract-api-S5SZuAgg.mjs";
import { asOptionalRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString, readStringValue, uniqueValues } from "openclaw/plugin-sdk/string-coerce-runtime";
import { DEFAULT_CONTEXT_TOKENS, buildFamilyForwardCompatModel, buildFirstTemplateModel, buildManifestModelProviderConfig, findCatalogTemplate, matchesExactOrPrefix, normalizeProviderId } from "openclaw/plugin-sdk/provider-model-metadata";
import { resolveOpenAICodexAuthIdentity } from "openclaw/plugin-sdk/provider-oauth-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { createLazyRuntimeModule, createLazyRuntimeSurface } from "openclaw/plugin-sdk/lazy-runtime";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-entry";
import { applyAgentDefaultModelPrimary, ensureModelAllowlistEntry, resolveAgentModelPrimaryValue } from "openclaw/plugin-sdk/provider-onboard";
import { addProviderUsageModel, asProviderUsageObject, buildProviderUsageHistorySnapshot, buildUsageHttpErrorSnapshot, cleanProviderUsageCredential, createProviderUsageDailyAccumulator, decodeProviderUsageAdminToken, encodeProviderUsageAdminToken, fetchCodexUsage, fetchProviderUsagePages, parseProviderUsageNonNegativeInteger, parseProviderUsageNumber, resolveProviderUsageDailyPeriod, resolveProviderUsageDisplayName } from "openclaw/plugin-sdk/provider-usage";
//#region extensions/openai/account-models.ts
const OPENAI_UNKNOWN_MODEL_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const OPENAI_CHAT_FAMILY_MODEL_ID_PATTERN = /^(?:gpt-(?:4o|4\.1|[5-9](?:\.\d+)?|[1-9]\d(?:\.\d+)?)|o[1-9])(?:-[a-z0-9.]+)*$/;
const OPENAI_UNADMITTED_MODEL_ID_PATTERN = /(?:^|-)(?:audio|realtime|live|transcribe|diarize|tts|image|search|deep-research|instruct|translate|exp|preview|alpha|beta|treatment|chat-latest|codex|cyber|\d{4}(?:-\d{2}-\d{2})?)(?:-|$)/;
/** Conservative rows for account-listed chat models that no catalog row describes. */
function buildOpenAIAccountOnlyModels(params) {
	const knownIds = /* @__PURE__ */ new Set([...OPENAI_PROVIDER_MODERN_MODEL_IDS, ...params.catalogModels.map((model) => model.id)]);
	return [...params.discoveredIds].filter((id) => !knownIds.has(id) && OPENAI_CHAT_FAMILY_MODEL_ID_PATTERN.test(id) && !OPENAI_UNADMITTED_MODEL_ID_PATTERN.test(id)).toSorted().map((id) => ({
		id,
		name: id,
		api: "openai-responses",
		baseUrl: params.baseUrl,
		reasoning: /^(?:gpt-(?:[5-9]|\d{2})|o\d)/.test(id),
		input: ["text"],
		cost: OPENAI_UNKNOWN_MODEL_COST,
		contextWindow: 128e3,
		maxTokens: 16384
	}));
}
//#endregion
//#region extensions/openai/codex-model-rows.ts
function readCodexReasoningLevels(row) {
	const record = asOptionalRecord(row);
	const value = record?.supported_reasoning_levels ?? record?.supportedReasoningLevels;
	if (!Array.isArray(value)) return;
	return value.flatMap((entry) => {
		if (typeof entry === "string" && entry.trim().length > 0) return [entry.trim()];
		const effort = asOptionalRecord(entry)?.effort;
		return typeof effort === "string" && effort.trim().length > 0 ? [effort.trim()] : [];
	});
}
function readCodexModelRows(body) {
	const models = asOptionalRecord(body)?.models;
	if (!Array.isArray(models)) throw new Error("OpenAI Codex model discovery response must be { models: [] }");
	return models;
}
function shouldIncludeCodexModelRow(row, readers) {
	const { readLiveModelCatalogStringField, readLiveModelCatalogBooleanField } = readers;
	const visibility = normalizeLowercaseStringOrEmpty(readLiveModelCatalogStringField(row, "visibility") ?? "");
	if (visibility && visibility !== "list") return false;
	return (readLiveModelCatalogBooleanField(row, "show_in_picker") ?? readLiveModelCatalogBooleanField(row, "showInPicker")) !== false;
}
function resolveCodexModelInput(row, fallback) {
	const record = asOptionalRecord(row);
	const rawModalities = [record?.input_modalities, record?.inputModalities].find(Array.isArray)?.filter((entry) => typeof entry === "string") ?? [];
	if (rawModalities.length === 0) return fallback?.input ?? ["text", "image"];
	const modalities = new Set(rawModalities.map((modality) => normalizeLowercaseStringOrEmpty(modality)));
	const input = [
		"text",
		"image",
		"audio",
		"video"
	].filter((modality) => modalities.has(modality) || modality === "image" && modalities.has("vision"));
	return input.length > 0 ? input : fallback?.input ?? ["text", "image"];
}
//#endregion
//#region extensions/openai/default-models.ts
const OPENAI_DEFAULT_MODEL = "openai/gpt-6-astra";
const OPENAI_CODEX_DEFAULT_MODEL = "openai/gpt-6-astra";
function applyOpenAIProviderConfig(cfg) {
	const configuredModel = cfg.agents?.defaults?.model;
	const withConfiguredRefs = [resolveAgentModelPrimaryValue(configuredModel), ...typeof configuredModel === "object" ? configuredModel.fallbacks ?? [] : []].filter((ref) => typeof ref === "string" && ref.trim().length > 0).reduce((next, modelRef) => ensureModelAllowlistEntry({
		cfg: next,
		modelRef
	}), cfg);
	const models = { ...withConfiguredRefs.agents?.defaults?.models };
	const gptAliasClaimed = Object.entries(models).some(([modelRef, model]) => modelRef !== "openai/gpt-6-astra" && model?.alias?.trim().toLowerCase() === "gpt");
	models[OPENAI_DEFAULT_MODEL] = {
		...models[OPENAI_DEFAULT_MODEL],
		...models["openai/gpt-6-astra"]?.alias === void 0 && !gptAliasClaimed ? { alias: "GPT" } : {}
	};
	return {
		...withConfiguredRefs,
		agents: {
			...withConfiguredRefs.agents,
			defaults: {
				...withConfiguredRefs.agents?.defaults,
				models
			}
		}
	};
}
function applyOpenAIConfig(cfg) {
	const next = applyOpenAIProviderConfig(cfg);
	return resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) === void 0 ? applyAgentDefaultModelPrimary(next, OPENAI_DEFAULT_MODEL) : next;
}
//#endregion
//#region extensions/openai/model-service-tiers.ts
/** Only authenticated remote rows may supply this private observation, never fallback seeds. */
function readOpenAICodexServiceTiers(rows) {
	return rows.flatMap((row) => {
		const record = asOptionalRecord(row);
		const modelId = normalizeOptionalString(record?.slug) ?? normalizeOptionalString(record?.id);
		const tiers = record?.service_tiers;
		if (!modelId || !Array.isArray(tiers)) return [];
		const serviceTiers = [];
		for (const tier of tiers) {
			const id = normalizeOptionalString(asOptionalRecord(tier)?.id);
			if (!id) return [];
			serviceTiers.push(id);
		}
		return [{
			modelId,
			runtimeId: "codex",
			api: "openai-chatgpt-responses",
			baseUrl: OPENAI_CODEX_RESPONSES_BASE_URL,
			serviceTiers: [...new Set(serviceTiers)]
		}];
	});
}
function projectOpenAICatalog(catalog, profileId) {
	const scopedProfileId = profileId?.trim();
	return {
		providers: { openai: catalog.provider },
		...catalog.outcome ? { outcomes: [scopedProfileId ? {
			...catalog.outcome,
			profileId: scopedProfileId
		} : catalog.outcome] } : {}
	};
}
//#endregion
//#region extensions/openai/replay-policy.ts
const RESPONSES_FAMILY_APIS = /* @__PURE__ */ new Set([
	"openai-responses",
	"openai-chatgpt-responses",
	"azure-openai-responses"
]);
/**
* Returns the provider-owned replay policy for OpenAI-family transports.
*/
function buildOpenAIReplayPolicy(ctx) {
	return {
		sanitizeMode: "images-only",
		applyAssistantFirstOrderingFix: false,
		validateGeminiTurns: false,
		validateAnthropicTurns: false,
		...RESPONSES_FAMILY_APIS.has(ctx.modelApi ?? "") ? {
			allowSyntheticToolResults: true,
			appendOnlyRuntimeContext: true
		} : {},
		...ctx.modelApi === "openai-completions" ? {
			sanitizeToolCallIds: true,
			toolCallIdMode: "strict",
			duplicateToolCallIdStyle: "openai"
		} : { sanitizeToolCallIds: false }
	};
}
//#endregion
//#region extensions/openai/transport-policy.ts
const DEFAULT_OPENAI_WS_DEGRADE_COOLDOWN_MS = 6e4;
const AZURE_PROVIDER_IDS = /* @__PURE__ */ new Set(["azure-openai", "azure-openai-responses"]);
function isAzureOpenAIBaseUrl(baseUrl) {
	return normalizeLowercaseStringOrEmpty(URL.parse(baseUrl?.trim() ?? "")?.hostname).endsWith(".openai.azure.com");
}
function normalizeIdentityValue(value, maxLength = 160) {
	const trimmed = value.trim().replace(/[\r\n]+/g, " ");
	return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed;
}
function usesKnownNativeOpenAIRoute(provider, baseUrl) {
	const normalizedProvider = normalizeProviderId(provider);
	if (!normalizedProvider) return false;
	if (normalizedProvider === "openai") return !baseUrl || isOpenAIApiBaseUrl(baseUrl) || isOpenAICodexBaseUrl(baseUrl);
	if (AZURE_PROVIDER_IDS.has(normalizedProvider)) return !baseUrl || isAzureOpenAIBaseUrl(baseUrl);
	return false;
}
function resolveSessionHeaders(sessionIdValue) {
	if (!sessionIdValue) return;
	const sessionId = normalizeIdentityValue(sessionIdValue);
	if (!sessionId) return;
	return {
		"x-client-request-id": sessionId,
		"x-openclaw-session-id": sessionId
	};
}
function resolveOpenAITransportTurnState(ctx) {
	if (!usesKnownNativeOpenAIRoute(ctx.provider, ctx.model?.baseUrl)) return;
	const sessionHeaders = resolveSessionHeaders(ctx.sessionId);
	if (!sessionHeaders) return ctx.transport === "websocket" ? { websocket: { degradeCooldownMs: DEFAULT_OPENAI_WS_DEGRADE_COOLDOWN_MS } } : void 0;
	const turnId = normalizeIdentityValue(ctx.turnId);
	const attempt = String(Math.max(1, ctx.attempt));
	return {
		headers: {
			...sessionHeaders,
			"x-openclaw-turn-id": turnId,
			"x-openclaw-turn-attempt": attempt
		},
		metadata: {
			openclaw_session_id: sessionHeaders["x-openclaw-session-id"] ?? "",
			openclaw_turn_id: turnId,
			openclaw_turn_attempt: attempt,
			openclaw_transport: ctx.transport
		},
		...ctx.transport === "websocket" ? { websocket: {
			headers: sessionHeaders,
			degradeCooldownMs: DEFAULT_OPENAI_WS_DEGRADE_COOLDOWN_MS
		} } : {}
	};
}
//#endregion
//#region extensions/openai/shared.ts
const OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS = 272e3;
const loadResponsesStream = createLazyRuntimeModule(() => import("./responses-stream.runtime-CSyCbhkY.mjs"));
const wrapOpenAIResponsesProviderStreamFn = (ctx) => {
	const loadStream = createLazyRuntimeSurface(loadResponsesStream, (runtime) => runtime.wrapOpenAIResponsesStream(ctx));
	return async (...args) => (await loadStream())(...args);
};
function buildOpenAIResponsesProviderHooks(options) {
	return {
		isCacheTtlEligible: ({ provider, baseUrl, supportsPromptCacheKey }) => normalizeProviderId(provider) === "openai" && (supportsPromptCacheKey ?? (classifyOpenAIBaseUrl(baseUrl) === "platform" || isOpenAICodexBaseUrl(baseUrl))),
		buildReplayPolicy: buildOpenAIReplayPolicy,
		prepareExtraParams: ({ extraParams }) => {
			const transport = extraParams?.transport;
			return [
				"auto",
				"sse",
				"websocket",
				"websocket-cached"
			].some((candidate) => candidate === transport) ? extraParams : {
				...extraParams,
				transport: options?.transport ?? "auto"
			};
		},
		wrapStreamFn: wrapOpenAIResponsesProviderStreamFn,
		wrapSimpleCompletionStreamFn: (ctx) => ctx.auth?.mode === "oauth" && ctx.auth.authFlow === "chatgpt-token-sharing" ? wrapOpenAIResponsesProviderStreamFn({
			...ctx,
			nativeWebSearchAllowedByToolPolicy: false
		}) : void 0,
		resolveTransportTurnState: resolveOpenAITransportTurnState
	};
}
//#endregion
//#region extensions/openai/usage.ts
const OPENAI_COSTS_URL = "https://api.openai.com/v1/organization/costs";
const OPENAI_COMPLETIONS_USAGE_URL = "https://api.openai.com/v1/organization/usage/completions";
const OPENAI_ADMIN_TOKEN_PREFIX = "openclaw:openai-admin:v1:";
const OPENAI_USAGE_RESPONSE_MAX_BYTES = 4194304;
const OPENAI_USAGE_HISTORY_DAYS = 30;
function utcDay(epochSeconds) {
	return (/* @__PURE__ */ new Date(epochSeconds * 1e3)).toISOString().slice(0, 10);
}
async function fetchPages(params) {
	return await fetchProviderUsagePages({
		responseLabel: "OpenAI usage",
		responseMaxBytes: OPENAI_USAGE_RESPONSE_MAX_BYTES,
		timeoutMs: params.timeoutMs,
		fetchFn: params.fetchFn,
		buildRequest: (page) => {
			const url = new URL(params.baseUrl);
			url.searchParams.set("start_time", String(params.startTime));
			url.searchParams.set("end_time", String(params.endTime));
			url.searchParams.set("bucket_width", "1d");
			url.searchParams.set("limit", String(params.periodDays));
			url.searchParams.set("group_by", params.groupBy);
			if (params.projectId) url.searchParams.set("project_ids", params.projectId);
			if (page) url.searchParams.set("page", page);
			return {
				url,
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${params.apiKey}`
				}
			};
		}
	});
}
function aggregateHistory(params) {
	const daily = /* @__PURE__ */ new Map();
	const getDaily = (startTime) => {
		const current = daily.get(startTime) ?? createProviderUsageDailyAccumulator(utcDay(startTime), true);
		daily.set(startTime, current);
		return current;
	};
	for (const rawBucket of params.costs) {
		const bucket = asProviderUsageObject(rawBucket);
		const startTime = parseProviderUsageNumber(bucket?.start_time);
		if (startTime === void 0 || !Array.isArray(bucket?.results)) continue;
		const accumulator = getDaily(startTime);
		for (const rawResult of bucket.results) {
			const result = asProviderUsageObject(rawResult);
			const amount = parseProviderUsageNumber(asProviderUsageObject(result?.amount)?.value) ?? 0;
			const category = resolveProviderUsageDisplayName(result?.line_item, "API");
			accumulator.amount += amount;
			accumulator.categories.set(category, (accumulator.categories.get(category) ?? 0) + amount);
		}
	}
	for (const rawBucket of params.completions) {
		const bucket = asProviderUsageObject(rawBucket);
		const startTime = parseProviderUsageNumber(bucket?.start_time);
		if (startTime === void 0 || !Array.isArray(bucket?.results)) continue;
		const accumulator = getDaily(startTime);
		for (const rawResult of bucket.results) {
			const result = asProviderUsageObject(rawResult);
			if (!result) continue;
			const requests = parseProviderUsageNonNegativeInteger(result.num_model_requests);
			const textInputTokens = parseProviderUsageNonNegativeInteger(result.input_tokens);
			const audioInputTokens = parseProviderUsageNonNegativeInteger(result.input_audio_tokens);
			const cacheReadTokens = parseProviderUsageNonNegativeInteger(result.input_cached_tokens);
			const inputTokens = Math.max(0, textInputTokens - cacheReadTokens) + audioInputTokens;
			const outputTokens = parseProviderUsageNonNegativeInteger(result.output_tokens) + parseProviderUsageNonNegativeInteger(result.output_audio_tokens);
			const totalTokens = textInputTokens + audioInputTokens + outputTokens;
			accumulator.requests = (accumulator.requests ?? 0) + requests;
			accumulator.inputTokens += inputTokens;
			accumulator.cacheReadTokens += cacheReadTokens;
			accumulator.outputTokens += outputTokens;
			accumulator.totalTokens += totalTokens;
			addProviderUsageModel(accumulator, resolveProviderUsageDisplayName(result.model, "Responses and Chat Completions"), {
				requests,
				inputTokens,
				cacheReadTokens,
				cacheWriteTokens: 0,
				outputTokens,
				totalTokens
			});
		}
	}
	return buildProviderUsageHistorySnapshot({
		provider: "openai",
		displayName: "OpenAI",
		plan: params.projectId ? `Admin API · ${params.projectId}` : "Admin API",
		periodDays: params.periodDays,
		unit: "USD",
		...params.projectId ? { scope: `Project ${params.projectId}` } : {},
		daily: [...daily.entries()].toSorted(([a], [b]) => a - b).map(([, entry]) => entry),
		formatSummary: ({ requests, totalTokens }) => `${requests.toLocaleString("en-US")} requests · ${totalTokens.toLocaleString("en-US")} tokens`
	});
}
async function fetchOpenAIAdminUsage(params) {
	const period = resolveProviderUsageDailyPeriod({
		now: params.now ?? Date.now(),
		periodDays: params.periodDays,
		defaultPeriodDays: OPENAI_USAGE_HISTORY_DAYS
	});
	const common = {
		apiKey: params.apiKey,
		projectId: params.projectId,
		startTime: Math.floor(period.startMs / 1e3),
		endTime: Math.floor(period.endMs / 1e3),
		periodDays: period.periodDays,
		timeoutMs: params.timeoutMs,
		fetchFn: params.fetchFn
	};
	const [costs, completions] = await Promise.all([fetchPages({
		...common,
		baseUrl: OPENAI_COSTS_URL,
		groupBy: "line_item"
	}), fetchPages({
		...common,
		baseUrl: OPENAI_COMPLETIONS_USAGE_URL,
		groupBy: "model"
	})]);
	if (!costs.ok || !completions.ok) {
		const failedStatus = !costs.ok ? costs.status : !completions.ok ? completions.status : void 0;
		if (failedStatus === 401 || failedStatus === 403) return {
			provider: "openai",
			displayName: "OpenAI",
			windows: [],
			error: "Admin API key required"
		};
		return failedStatus ? buildUsageHttpErrorSnapshot({
			provider: "openai",
			status: failedStatus
		}) : {
			provider: "openai",
			displayName: "OpenAI",
			windows: [],
			error: "Usage unavailable"
		};
	}
	return aggregateHistory({
		costs: costs.data,
		completions: completions.data,
		periodDays: period.periodDays,
		projectId: params.projectId
	});
}
async function resolveOpenAIUsageAuth(ctx) {
	const explicitAdminKey = cleanProviderUsageCredential(ctx.env.OPENAI_ADMIN_KEY);
	if (explicitAdminKey) return { token: encodeProviderUsageAdminToken(OPENAI_ADMIN_TOKEN_PREFIX, explicitAdminKey) };
	const oauth = await ctx.resolveOAuthToken();
	if (oauth && isSIWCAuthFlow(oauth.authFlow)) return { handled: true };
	if (oauth) return oauth;
	return { handled: true };
}
async function fetchOpenAIUsage(ctx) {
	const adminKey = decodeProviderUsageAdminToken(OPENAI_ADMIN_TOKEN_PREFIX, ctx.token);
	if (!adminKey) {
		const snapshot = await fetchCodexUsage(ctx.token, ctx.accountId, ctx.timeoutMs, ctx.fetchFn);
		if (snapshot.error) return snapshot;
		const { token: accessToken, email: profileEmail } = ctx;
		const accountEmail = resolveOpenAICodexAuthIdentity({
			access: accessToken,
			email: profileEmail
		}).email ?? profileEmail;
		return accountEmail ? {
			...snapshot,
			accountEmail
		} : snapshot;
	}
	return await fetchOpenAIAdminUsage({
		apiKey: adminKey,
		projectId: cleanProviderUsageCredential(ctx.env.OPENAI_PROJECT_ID),
		timeoutMs: ctx.timeoutMs,
		fetchFn: ctx.fetchFn
	});
}
//#endregion
//#region extensions/openai/openai-chatgpt-provider.ts
const PROVIDER_ID$1 = "openai";
const OPENAI_MANIFEST_MODELS = buildManifestModelProviderConfig({
	providerId: PROVIDER_ID$1,
	catalog: modelCatalog.providers.openai
}).models;
const OPENAI_CODEX_GPT_56_THINKING_LEVEL_MAP = {
	off: null,
	xhigh: "xhigh",
	max: "max"
};
const OPENAI_CODEX_GPT_56_NATIVE_CONTEXT_TOKENS = 372e3;
const OPENAI_CODEX_GPT_55_CODEX_CONTEXT_TOKENS = 4e5;
const OPENAI_CODEX_GPT_54_MAX_TOKENS = 128e3;
const OPENAI_CODEX_GPT_54_MINI_COST = {
	input: .75,
	output: 4.5,
	cacheRead: .075,
	cacheWrite: 0
};
const OPENAI_CODEX_FORWARD_COMPAT_PATCHES = /* @__PURE__ */ new Map([
	[OPENAI_GPT_55_PRO_MODEL_ID, {
		contextWindow: 1e6,
		cost: {
			input: 30,
			output: 180,
			cacheRead: 0,
			cacheWrite: 0
		}
	}],
	[OPENAI_GPT_54_MODEL_ID, {
		contextWindow: 105e4,
		cost: {
			input: 2.5,
			output: 15,
			cacheRead: .25,
			cacheWrite: 0
		}
	}],
	[OPENAI_GPT_54_PRO_MODEL_ID, {
		contextWindow: 105e4,
		cost: {
			input: 30,
			output: 180,
			cacheRead: 0,
			cacheWrite: 0
		}
	}],
	[OPENAI_GPT_54_MINI_MODEL_ID, {
		contextWindow: 4e5,
		cost: OPENAI_CODEX_GPT_54_MINI_COST
	}],
	[OPENAI_GPT_53_CODEX_SPARK_MODEL_ID, {
		input: ["text"],
		contextWindow: 128e3,
		contextTokens: 128e3,
		cost: OPENAI_CODEX_GPT_54_MINI_COST
	}]
]);
const OPENAI_CODEX_GPT_54_TEMPLATE_MODEL_IDS = ["gpt-5.3-codex"];
/** Legacy codex rows first; fall back to catalog `gpt-5.4` when the API omits 5.3/5.2. */
const OPENAI_CODEX_GPT_54_CATALOG_SYNTH_TEMPLATE_MODEL_IDS = [...OPENAI_CODEX_GPT_54_TEMPLATE_MODEL_IDS, OPENAI_GPT_54_MODEL_ID];
const OPENAI_CODEX_GPT_55_PRO_TEMPLATE_MODEL_IDS = [
	OPENAI_GPT_54_MODEL_ID,
	OPENAI_GPT_54_PRO_MODEL_ID,
	...OPENAI_CODEX_GPT_54_TEMPLATE_MODEL_IDS
];
const OPENAI_CODEX_IMAGE_CAPABLE_MODEL_IDS = [
	...OPENAI_GPT_6_MODEL_IDS,
	...OPENAI_GPT_56_VARIANT_MODEL_IDS,
	OPENAI_GPT_55_MODEL_ID,
	OPENAI_GPT_55_PRO_MODEL_ID,
	OPENAI_GPT_54_MODEL_ID,
	OPENAI_GPT_54_PRO_MODEL_ID,
	OPENAI_GPT_54_MINI_MODEL_ID
];
function isOpenAIProvider(provider) {
	return normalizeProviderId(provider ?? "") === PROVIDER_ID$1;
}
function normalizeCodexTransportFields(params) {
	const useCodexTransport = !params.baseUrl || isOpenAIApiBaseUrl(params.baseUrl) || isOpenAICodexBaseUrl(params.baseUrl);
	const api = useCodexTransport && (!params.api || params.api === "openai-responses" || params.api === "openai-completions") ? "openai-chatgpt-responses" : params.api ?? void 0;
	return {
		api,
		baseUrl: api === "openai-chatgpt-responses" && useCodexTransport ? OPENAI_CODEX_RESPONSES_BASE_URL : params.baseUrl
	};
}
function matchesOpenAICodexImageCapableModel(modelId, modelName) {
	return [modelId, modelName].filter((value) => typeof value === "string").some((candidate) => matchesExactOrPrefix(candidate, OPENAI_CODEX_IMAGE_CAPABLE_MODEL_IDS));
}
function applyOpenAICodexImageInputCapability(params) {
	if (Array.isArray(params.model.input) && params.model.input.includes("image")) return;
	if (!matchesOpenAICodexImageCapableModel(params.modelId, params.model.name)) return;
	return {
		...params.model,
		input: ["text", "image"]
	};
}
function normalizeCodexTransport(model) {
	const canonicalModelId = normalizeLowercaseStringOrEmpty(model.id) === "gpt-5.4-codex" ? OPENAI_GPT_54_MODEL_ID : model.id;
	const canonicalName = normalizeLowercaseStringOrEmpty(model.name) === "gpt-5.4-codex" ? OPENAI_GPT_54_MODEL_ID : model.name;
	const normalizedTransport = normalizeCodexTransportFields({
		api: model.api,
		baseUrl: model.baseUrl
	});
	const api = normalizedTransport.api ?? model.api;
	const baseUrl = normalizedTransport.baseUrl ?? model.baseUrl;
	if (api === model.api && baseUrl === model.baseUrl && canonicalModelId === model.id && canonicalName === model.name) return model;
	return {
		...model,
		id: canonicalModelId,
		name: canonicalName,
		api,
		baseUrl
	};
}
function resolveCodexForwardCompatModel(ctx) {
	const trimmedModelId = ctx.modelId.trim();
	const lower = normalizeLowercaseStringOrEmpty(trimmedModelId);
	const synthBaseUrl = ctx.providerConfig?.baseUrl ?? "https://chatgpt.com/backend-api/codex";
	if (OPENAI_GPT_6_MODEL_IDS.some((modelId) => modelId === lower)) {
		const catalogModel = OPENAI_MANIFEST_MODELS.find((model) => model.id === lower);
		if (!catalogModel || catalogModel.contextWindow === void 0) return;
		return {
			...catalogModel,
			contextWindow: catalogModel.contextWindow,
			input: catalogModel.input.filter((item) => item === "text" || item === "image"),
			...ctx.modelRegistry.find(PROVIDER_ID$1, trimmedModelId),
			id: trimmedModelId,
			provider: PROVIDER_ID$1,
			api: "openai-chatgpt-responses",
			baseUrl: synthBaseUrl
		};
	}
	const isGpt56 = OPENAI_GPT_56_VARIANT_MODEL_IDS.some((modelId) => modelId === lower);
	if (isGpt56 || lower === "gpt-5.5") {
		const contextWindow = isGpt56 ? OPENAI_CODEX_GPT_56_NATIVE_CONTEXT_TOKENS : OPENAI_CODEX_GPT_55_CODEX_CONTEXT_TOKENS;
		const registeredModel = withDefaultCodexContextMetadata({
			model: ctx.modelRegistry.find(PROVIDER_ID$1, trimmedModelId),
			baseUrl: synthBaseUrl,
			contextWindow,
			contextTokens: OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS
		});
		const model = registeredModel ?? {
			id: trimmedModelId,
			name: trimmedModelId,
			api: "openai-chatgpt-responses",
			provider: PROVIDER_ID$1,
			baseUrl: synthBaseUrl,
			reasoning: true,
			input: ["text", "image"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow,
			contextTokens: 272e3,
			maxTokens: OPENAI_CODEX_GPT_54_MAX_TOKENS
		};
		return isGpt56 ? {
			...model,
			thinkingLevelMap: registeredModel ? {
				...OPENAI_CODEX_GPT_56_THINKING_LEVEL_MAP,
				...registeredModel.thinkingLevelMap
			} : OPENAI_CODEX_GPT_56_THINKING_LEVEL_MAP
		} : model;
	}
	let templateIds;
	let patch;
	const knownPatch = OPENAI_CODEX_FORWARD_COMPAT_PATCHES.get(lower === "gpt-5.4-codex" ? OPENAI_GPT_54_MODEL_ID : lower);
	if (knownPatch) {
		templateIds = lower === "gpt-5.5-pro" ? OPENAI_CODEX_GPT_55_PRO_TEMPLATE_MODEL_IDS : OPENAI_CODEX_GPT_54_CATALOG_SYNTH_TEMPLATE_MODEL_IDS;
		patch = {
			contextTokens: OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS,
			maxTokens: OPENAI_CODEX_GPT_54_MAX_TOKENS,
			...knownPatch,
			...knownPatch.input ? { input: [...knownPatch.input] } : {}
		};
	} else if (ctx.agentRuntimeId === "codex" && ctx.authProfileId === void 0 && ctx.authProfileMode === void 0 && ctx.providerConfig?.auth === void 0) {
		templateIds = OPENAI_GPT_56_VARIANT_MODEL_IDS;
		patch = {
			reasoning: true,
			input: ["text", "image"],
			thinkingLevelMap: OPENAI_CODEX_GPT_56_THINKING_LEVEL_MAP,
			compat: {
				supportsReasoningEffort: true,
				supportedReasoningEfforts: [
					"low",
					"medium",
					"high",
					"xhigh",
					"max"
				]
			}
		};
	} else return;
	patch = {
		...patch,
		api: "openai-chatgpt-responses",
		baseUrl: synthBaseUrl
	};
	const canonicalModelId = lower === "gpt-5.4-codex" ? OPENAI_GPT_54_MODEL_ID : trimmedModelId;
	return buildFirstTemplateModel({
		providerId: PROVIDER_ID$1,
		modelId: canonicalModelId,
		templateIds,
		ctx,
		patch
	}) ?? {
		id: canonicalModelId,
		name: canonicalModelId,
		api: "openai-chatgpt-responses",
		provider: PROVIDER_ID$1,
		baseUrl: synthBaseUrl,
		reasoning: true,
		input: patch?.input ?? ["text", "image"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: patch?.contextWindow ?? DEFAULT_CONTEXT_TOKENS,
		contextTokens: patch?.contextTokens,
		maxTokens: patch?.maxTokens ?? DEFAULT_CONTEXT_TOKENS,
		...patch?.thinkingLevelMap ? { thinkingLevelMap: patch.thinkingLevelMap } : {},
		...patch?.compat ? { compat: patch.compat } : {}
	};
}
function withDefaultCodexContextMetadata(params) {
	if (!params.model) return;
	const contextTokens = typeof params.model.contextTokens === "number" ? params.model.contextTokens : typeof params.model.contextWindow === "number" && params.model.contextWindow > 0 ? Math.min(params.contextTokens, params.model.contextWindow) : params.contextTokens;
	const input = params.model.input?.includes("image") ? params.model.input : uniqueValues([...params.model.input ?? ["text"], "image"]);
	return {
		...params.model,
		api: "openai-chatgpt-responses",
		baseUrl: params.baseUrl,
		input,
		contextWindow: params.contextWindow,
		contextTokens
	};
}
function buildCodexCredentialExtra(identity) {
	const extra = {
		...identity.accountId ? { accountId: identity.accountId } : {},
		...identity.chatgptPlanType ? { chatgptPlanType: identity.chatgptPlanType } : {}
	};
	return Object.keys(extra).length > 0 ? extra : void 0;
}
async function refreshOpenAICodexOAuthCredential(cred) {
	try {
		const { refreshOpenAICodexToken } = await import("./openai-chatgpt-provider.runtime-aODjuHro.mjs");
		const refreshed = await refreshOpenAICodexToken(cred.refresh);
		const identity = resolveOpenAICodexAuthIdentity({
			access: refreshed.access,
			email: cred.email
		});
		return {
			...cred,
			...refreshed,
			type: "oauth",
			provider: PROVIDER_ID$1,
			email: identity.email ?? cred.email,
			displayName: cred.displayName,
			...buildCodexCredentialExtra(identity)
		};
	} catch (error) {
		const message = formatErrorMessage(error);
		if (/extract\s+accountid\s+from\s+token/i.test(message) && typeof cred.access === "string" && cred.access.trim().length > 0) return cred;
		throw error;
	}
}
function buildOpenAICodexAuthResult(buildResult, creds) {
	const identity = resolveOpenAICodexAuthIdentity({
		access: creds.access,
		email: readStringValue(creds.email)
	});
	return buildResult({
		providerId: PROVIDER_ID$1,
		defaultModel: OPENAI_CODEX_DEFAULT_MODEL,
		configPatch: { agents: { defaults: { models: { [OPENAI_CODEX_DEFAULT_MODEL]: {} } } } },
		access: creds.access,
		refresh: creds.refresh,
		expires: creds.expires,
		email: identity.email,
		profileName: identity.profileName,
		credentialExtra: buildCodexCredentialExtra(identity)
	});
}
async function runOpenAICodexOAuth(ctx) {
	const [{ loginOpenAICodexOAuth }, { buildOauthProviderAuthResult }] = await Promise.all([import("./openai-chatgpt-oauth.runtime-CdKEKkAW.mjs"), import("openclaw/plugin-sdk/provider-auth-result")]);
	const creds = await loginOpenAICodexOAuth({
		prompter: ctx.prompter,
		runtime: ctx.runtime,
		oauth: ctx.oauth,
		isRemote: ctx.isRemote,
		openUrl: ctx.openUrl,
		signal: ctx.signal,
		assertCurrent: ctx.assertCurrent,
		onManualCodeInput: ctx.onManualCodeInput,
		localBrowserMessage: "Complete sign-in in browser…"
	});
	if (!creds) return { profiles: [] };
	return buildOpenAICodexAuthResult(buildOauthProviderAuthResult, creds);
}
async function runOpenAICodexDeviceCode(ctx) {
	const spin = ctx.prompter.progress("Starting device code flow…");
	try {
		const [{ loginOpenAICodexDeviceCode }, { buildOauthProviderAuthResult }] = await Promise.all([import("./openai-chatgpt-device-code-D0lBXedu.mjs"), import("openclaw/plugin-sdk/provider-auth-result")]);
		const creds = await loginOpenAICodexDeviceCode({
			...ctx.signal ? { signal: ctx.signal } : {},
			assertCurrent: ctx.assertCurrent,
			onProgress: (message) => spin.update(message),
			onVerification: async ({ verificationUrl, userCode, expiresInMs }) => {
				const expiresInMinutes = Math.max(1, Math.round(expiresInMs / 6e4));
				const deviceCodeMessage = [ctx.isRemote ? "Open this URL in your LOCAL browser and enter the code below." : "Open this URL in your browser and enter the code below.", `URL: <${verificationUrl}>`].join("\n");
				if (ctx.isRemote) await ctx.openUrl(verificationUrl);
				if (ctx.prompter.deviceCode) await ctx.prompter.deviceCode({
					title: "OpenAI Codex device code",
					code: userCode,
					expiresInMinutes,
					message: "Enter this one-time code on the sign-in page."
				});
				else await ctx.prompter.note([
					deviceCodeMessage,
					`Code: ${userCode}`,
					`Code expires in ${expiresInMinutes} minutes. Never share it.`
				].join("\n"), "OpenAI Codex device code");
				if (ctx.isRemote) {
					ctx.runtime.log(`\nOpen this URL in your LOCAL browser:\n\n${verificationUrl}\n`);
					return;
				}
				try {
					await ctx.openUrl(verificationUrl);
					ctx.runtime.log(`Open: ${verificationUrl}`);
				} catch {
					ctx.runtime.log(`Open manually: ${verificationUrl}`);
				}
			}
		});
		spin.stop("OpenAI device code complete");
		return buildOpenAICodexAuthResult(buildOauthProviderAuthResult, creds);
	} catch (error) {
		spin.stop("OpenAI device code failed");
		ctx.runtime.error(formatErrorMessage(error));
		await ctx.prompter.note("Trouble with device code login? See https://docs.openclaw.ai/start/faq", "OAuth help");
		throw error;
	}
}
function buildOpenAIChatGPTAuthMethodRuns() {
	return {
		oauth: runOpenAICodexOAuth,
		"device-code": runOpenAICodexDeviceCode
	};
}
function buildOpenAICodexProviderHooks() {
	return {
		resolveDynamicModel: resolveCodexForwardCompatModel,
		preferRuntimeResolvedModel: (ctx) => {
			if (!isOpenAIProvider(ctx.provider)) return false;
			const id = ctx.modelId.trim().toLowerCase();
			return OPENAI_CHATGPT_MODERN_MODEL_IDS.some((modelId) => modelId === id);
		},
		normalizeResolvedModel: (ctx) => {
			if (!isOpenAIProvider(ctx.provider)) return;
			const transportNormalized = normalizeCodexTransport(ctx.model);
			const imageCapable = applyOpenAICodexImageInputCapability({
				modelId: ctx.modelId,
				model: transportNormalized
			}) ?? transportNormalized;
			return imageCapable === ctx.model ? void 0 : imageCapable;
		},
		normalizeTransport: ({ provider, api, baseUrl }) => {
			if (!isOpenAIProvider(provider)) return;
			const normalized = normalizeCodexTransportFields({
				api,
				baseUrl
			});
			if (normalized.api === api && normalized.baseUrl === baseUrl) return;
			return normalized;
		},
		resolveUsageAuth: resolveOpenAIUsageAuth,
		fetchUsageSnapshot: fetchOpenAIUsage,
		refreshOAuth: refreshOpenAICodexOAuthCredential
	};
}
//#endregion
//#region extensions/openai/openai-provider.ts
const PROVIDER_ID = "openai";
function classifyOpenAiFailoverCode(code) {
	switch (code?.trim().toUpperCase()) {
		case "SERVER_ERROR": return "server_error";
		case "INSUFFICIENT_QUOTA": return "billing";
		default: return;
	}
}
const OPENAI_MODELS_ENDPOINT = "https://api.openai.com/v1/models";
const OPENAI_CODEX_MODELS_ENDPOINT = `${OPENAI_CODEX_RESPONSES_BASE_URL}/models?client_version=0.160.0`;
const OPENAI_MODELS_CACHE_TTL_MS = 6e4;
const OPENAI_CODEX_MODELS_CACHE_TTL_MS = 6e4;
const OPENAI_CODEX_GPT_56_CONTEXT_WINDOW = 372e3;
const OPENAI_GPT_55_PRO_CONTEXT_WINDOW = 105e4;
const OPENAI_GPT_54_CONTEXT_TOKENS = 105e4;
const OPENAI_GPT_54_PRO_CONTEXT_TOKENS = 105e4;
const OPENAI_GPT_54_MINI_CONTEXT_TOKENS = 4e5;
const OPENAI_GPT_54_NANO_CONTEXT_TOKENS = 4e5;
const OPENAI_GPT_54_MAX_TOKENS = 128e3;
const OPENAI_CHAT_LATEST_COST = {
	input: 5,
	output: 30,
	cacheRead: .5,
	cacheWrite: 0
};
const OPENAI_GPT_55_PRO_TEMPLATE_MODEL_IDS = [OPENAI_GPT_54_PRO_MODEL_ID, OPENAI_GPT_54_MODEL_ID];
const OPENAI_GPT_54_TEMPLATE_MODEL_IDS = [OPENAI_GPT_54_MODEL_ID, OPENAI_GPT_55_MODEL_ID];
const OPENAI_GPT_54_PRO_TEMPLATE_MODEL_IDS = [OPENAI_GPT_54_PRO_MODEL_ID, OPENAI_GPT_55_PRO_MODEL_ID];
const OPENAI_GPT_54_MINI_TEMPLATE_MODEL_IDS = [OPENAI_GPT_54_MINI_MODEL_ID, "gpt-5-mini"];
const OPENAI_GPT_54_NANO_TEMPLATE_MODEL_IDS = [
	OPENAI_GPT_54_NANO_MODEL_ID,
	"gpt-5-nano",
	"gpt-5-mini"
];
const OPENAI_CHAT_LATEST_TEMPLATE_MODEL_IDS = [OPENAI_GPT_55_MODEL_ID, OPENAI_GPT_54_MODEL_ID];
const OPENAI_GPT_56_TEMPLATE_MODEL_IDS = [OPENAI_GPT_55_MODEL_ID];
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
	const models = fallback.models;
	if (!isOpenAIApiBaseUrl(baseUrl)) return { provider: fallback };
	const [{ getCachedLiveProviderModelRows, LiveModelCatalogHttpError }, { isNonSecretApiKeyMarker }] = await Promise.all([import("openclaw/plugin-sdk/provider-catalog-live-runtime"), import("openclaw/plugin-sdk/provider-auth")]);
	const rejectionScope = params.apiKey && !params.discoveryApiKey && isNonSecretApiKeyMarker(params.apiKey) ? "catalog" : void 0;
	try {
		const rows = await getCachedLiveProviderModelRows({
			providerId: PROVIDER_ID,
			endpoint: OPENAI_MODELS_ENDPOINT,
			apiKey: params.apiKey,
			discoveryApiKey: params.discoveryApiKey,
			fetchGuard: params.fetchGuard,
			signal: params.signal,
			ttlMs: OPENAI_MODELS_CACHE_TTL_MS,
			auditContext: "openai-model-discovery"
		});
		const discoveredIds = new Set(rows.flatMap((row) => {
			const candidate = asOptionalRecord(row);
			if (candidate?.object !== void 0 && candidate.object !== "model") return [];
			const modelId = typeof candidate?.id === "string" ? candidate.id.trim() : "";
			return modelId ? [modelId] : [];
		}));
		const selectedIds = /* @__PURE__ */ new Set();
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
		return {
			provider: {
				...fallback,
				models: [...catalogModels.filter((model) => {
					if (!discoveredIds.has(model.id) || selectedIds.has(model.id)) return false;
					selectedIds.add(model.id);
					return true;
				}), ...buildOpenAIAccountOnlyModels({
					discoveredIds,
					catalogModels,
					baseUrl
				})]
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
	const contextWindow = readLiveModelCatalogPositiveSafeIntegerField(row, ["max_context_window", "maxContextWindow"]) ?? fallback?.contextWindow ?? observedContextTokens ?? DEFAULT_CONTEXT_TOKENS;
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
	const catalogRuntime = await import("openclaw/plugin-sdk/provider-catalog-live-runtime");
	const { getCachedLiveProviderModelRows, LiveModelCatalogHttpError } = catalogRuntime;
	try {
		const rows = await getCachedLiveProviderModelRows({
			providerId: PROVIDER_ID,
			endpoint: OPENAI_CODEX_MODELS_ENDPOINT,
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
				OPENAI_CODEX_MODELS_ENDPOINT,
				params.discoveryApiKey,
				params.accountId ?? ""
			]
		});
		const models = rows.map((row) => buildOpenAICodexModelFromLiveRow(row, catalogRuntime)).filter((model) => Boolean(model));
		const modelServiceTiers = readOpenAICodexServiceTiers(rows);
		return {
			provider: {
				baseUrl: OPENAI_CODEX_RESPONSES_BASE_URL,
				api: "openai-chatgpt-responses",
				auth: "oauth",
				models
			},
			outcome: {
				provider: PROVIDER_ID,
				status: "ready",
				...modelServiceTiers.length ? { modelServiceTiers } : {}
			}
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
/** Resolves the effective authored OpenAI config route for one model. */
function resolveAuthoredOpenAIConfigRoute(params) {
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
	return {
		...modelConfig ? { configuredModel: modelConfig } : {},
		configuredProvider: providerConfig
	};
}
/** Authored Completions is a current transport contract; only catalog defaults are upgraded. */
function resolveAuthoredOpenAICompletionsRoute(params) {
	const configuredRoute = resolveAuthoredOpenAIConfigRoute(params);
	if (!configuredRoute) return;
	if ((normalizeOptionalString(configuredRoute.configuredModel?.api) ?? normalizeOptionalString(configuredRoute.configuredProvider.api)) !== "openai-completions") return;
	return {
		api: "openai-completions",
		baseUrl: normalizeOptionalString(configuredRoute.configuredModel?.baseUrl) ?? normalizeOptionalString(configuredRoute.configuredProvider.baseUrl) ?? resolveOpenAIDefaultBaseUrl(process.env)
	};
}
function shouldUseCodexResponsesHooks(params) {
	if (params.api === "openai-chatgpt-responses") return true;
	return typeof params.baseUrl === "string" && isOpenAICodexBaseUrl(params.baseUrl);
}
function shouldResolveDynamicModelThroughCodex(ctx) {
	if (shouldUseCodexResponsesHooks({
		provider: ctx.provider,
		api: ctx.providerConfig?.api,
		baseUrl: ctx.providerConfig?.baseUrl
	})) return true;
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
		templateIds: OPENAI_CHAT_LATEST_TEMPLATE_MODEL_IDS,
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
		templateIds: OPENAI_GPT_56_TEMPLATE_MODEL_IDS
	},
	{
		match: [OPENAI_GPT_55_MODEL_ID],
		templateIds: [OPENAI_GPT_55_MODEL_ID, OPENAI_GPT_54_MODEL_ID]
	},
	{
		match: [OPENAI_GPT_55_PRO_MODEL_ID],
		templateIds: OPENAI_GPT_55_PRO_TEMPLATE_MODEL_IDS
	},
	{
		match: [OPENAI_GPT_54_MODEL_ID],
		templateIds: OPENAI_GPT_54_TEMPLATE_MODEL_IDS
	},
	{
		match: [OPENAI_GPT_54_PRO_MODEL_ID],
		templateIds: OPENAI_GPT_54_PRO_TEMPLATE_MODEL_IDS
	},
	{
		match: [OPENAI_GPT_54_MINI_MODEL_ID],
		templateIds: OPENAI_GPT_54_MINI_TEMPLATE_MODEL_IDS
	},
	{
		match: [OPENAI_GPT_54_NANO_MODEL_ID],
		templateIds: OPENAI_GPT_54_NANO_TEMPLATE_MODEL_IDS
	}
];
function resolveOpenAIGptForwardCompatModel(ctx) {
	const trimmedModelId = ctx.modelId.trim();
	const modelId = normalizeLowercaseStringOrEmpty(trimmedModelId);
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
			method.run = async (ctx) => (await import("./token-sharing-oauth.runtime-yY3tK7VM.mjs")).loginTokenSharing(ctx);
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
					const { buildTokenSharingCatalog } = await import("./token-sharing-catalog-D_OMt41h.mjs");
					return await buildTokenSharingCatalog({
						auth,
						models: buildOpenAIStaticPlatformProviderConfig(void 0, TOKEN_SHARING_RESOURCE).models,
						signal: ctx.signal
					});
				}
				if (auth.preparationFailed) return null;
				const [{ resolveApiKeyForProvider, resolveProviderAuthProfileMetadata }, { isNonSecretApiKeyMarker }] = await Promise.all([import("openclaw/plugin-sdk/provider-auth-runtime"), import("openclaw/plugin-sdk/provider-auth")]);
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
					const metadata = resolveProviderAuthProfileMetadata({
						provider: PROVIDER_ID,
						cfg: ctx.config,
						...ctx.agentDir ? { agentDir: ctx.agentDir } : {},
						...runtimeAuth.profileId ?? auth.profileId ? { profileId: runtimeAuth.profileId ?? auth.profileId } : {}
					});
					return projectOpenAICatalog(await buildOpenAICodexLiveProviderConfig({
						discoveryApiKey: runtimeAuth.apiKey,
						accountId: metadata.accountId
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
					return projectOpenAICatalog(await buildOpenAICodexLiveProviderConfig({ discoveryApiKey }));
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
			if (shouldUseCodexResponsesHooks({
				provider: ctx.provider,
				api: ctx.model.api,
				baseUrl: ctx.model.baseUrl
			})) return codexHooks.normalizeResolvedModel?.(ctx);
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
			return (shouldUseCodexResponsesHooks({
				provider: ctx.provider,
				api: ctx.model?.api,
				baseUrl: ctx.model?.baseUrl
			}) || normalizeProviderId(ctx.provider) === PROVIDER_ID && (!providerConfig?.baseUrl || isOpenAIApiBaseUrl(providerConfig.baseUrl)) && isCodexCatalogAuthMode(providerConfig?.auth ?? "") ? nativeResponsesHooks : responsesHooks).prepareExtraParams?.(ctx);
		},
		resolveUsageAuth: codexHooks.resolveUsageAuth,
		fetchUsageSnapshot: codexHooks.fetchUsageSnapshot,
		refreshOAuth: async (credential) => isSIWCAuthFlow(credential.authFlow) ? (await import("./token-sharing-oauth.runtime-yY3tK7VM.mjs")).refreshTokenSharingCredential(credential) : codexHooks.refreshOAuth(credential),
		buildUnknownModelHint: ({ modelId }) => buildOpenAIUnknownModelHint(modelId),
		buildMissingAuthMessage: (ctx) => {
			if (normalizeProviderId(ctx.provider) !== PROVIDER_ID) return;
			if (ctx.listProfileIds(PROVIDER_ID).length === 0) return;
			return `No API key found for provider "openai". You are authenticated with OpenAI ChatGPT/Codex OAuth. Use ${OPENAI_CODEX_DEFAULT_MODEL} with the ChatGPT/Codex OAuth profile, or set OPENAI_API_KEY for direct OpenAI API access.`;
		},
		matchesContextOverflowError: ({ errorMessage }) => /content_filter.*(?:prompt|input).*(?:too long|exceed)/i.test(errorMessage),
		classifyFailoverReason: ({ code }) => classifyOpenAiFailoverCode(code),
		resolveReasoningOutputMode: () => "native",
		resolveThinkingProfile: ({ provider, modelId, agentRuntime, api, compat, thinkingLevelMap }) => normalizeProviderId(provider) === PROVIDER_ID ? resolveUnifiedOpenAIThinkingProfile(modelId, agentRuntime, compat, api, thinkingLevelMap) : null,
		isModernModelRef: ({ modelId }) => matchesExactOrPrefix(modelId, OPENAI_PROVIDER_MODERN_MODEL_IDS),
		augmentModelCatalog: (ctx) => {
			return [
				{
					id: OPENAI_GPT_55_PRO_MODEL_ID,
					templateIds: OPENAI_GPT_55_PRO_TEMPLATE_MODEL_IDS,
					contextWindow: OPENAI_GPT_55_PRO_CONTEXT_WINDOW,
					contextTokens: OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS
				},
				{
					id: OPENAI_GPT_54_MODEL_ID,
					templateIds: OPENAI_GPT_54_TEMPLATE_MODEL_IDS,
					contextWindow: OPENAI_GPT_54_CONTEXT_TOKENS
				},
				{
					id: OPENAI_GPT_54_PRO_MODEL_ID,
					templateIds: OPENAI_GPT_54_PRO_TEMPLATE_MODEL_IDS,
					contextWindow: OPENAI_GPT_54_PRO_CONTEXT_TOKENS
				},
				{
					id: OPENAI_GPT_54_MINI_MODEL_ID,
					templateIds: OPENAI_GPT_54_MINI_TEMPLATE_MODEL_IDS,
					contextWindow: OPENAI_GPT_54_MINI_CONTEXT_TOKENS
				},
				{
					id: OPENAI_GPT_54_NANO_MODEL_ID,
					templateIds: OPENAI_GPT_54_NANO_TEMPLATE_MODEL_IDS,
					contextWindow: OPENAI_GPT_54_NANO_CONTEXT_TOKENS
				}
			].flatMap(({ templateIds, ...model }) => {
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
export { buildOpenAIProvider, OPENAI_DEFAULT_MODEL as t };
