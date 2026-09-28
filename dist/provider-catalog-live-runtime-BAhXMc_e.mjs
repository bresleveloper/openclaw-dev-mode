import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as normalizeUpstreamModelPricing } from "./model-catalog-pricing-CvFizjD3.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-BQRtcdBp.mjs";
import { i as fetchWithSsrFGuard, u as retainSafeHeadersForCrossOriginRedirect } from "./fetch-guard-EFfAF2PS.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-BfYDKFYI.mjs";
import { a as buildSingleProviderApiKeyCatalog } from "./provider-catalog-DaDnKUnq.mjs";
import { i as normalizeModelCompat } from "./provider-model-compat-D1iLDbYW.mjs";
import "./provider-model-shared-DUNuGxOQ.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import { r as getCachedLiveCatalogValue } from "./provider-catalog-shared-D7_lTYyN.mjs";
//#region src/plugin-sdk/provider-catalog-live-normalize.internal.ts
function readLiveModelCatalogId(row) {
	const record = readLiveModelCatalogRecord(row);
	if (record?.object !== void 0 && record.object !== "model") return;
	return readLiveModelCatalogStringField(record, "id");
}
function readLiveModelCatalogRecord(body) {
	return asOptionalRecord(body);
}
function readLiveModelCatalogStringField(row, keys) {
	const record = readLiveModelCatalogRecord(row);
	for (const key of typeof keys === "string" ? [keys] : keys) {
		const value = record?.[key];
		if (typeof value === "string" && value.trim()) return value.trim();
	}
}
function readLiveModelCatalogBooleanField(row, keys) {
	const record = readLiveModelCatalogRecord(row);
	for (const key of typeof keys === "string" ? [keys] : keys) {
		const value = record?.[key];
		if (typeof value === "boolean") return value;
	}
}
function readLiveModelCatalogPositiveSafeIntegerField(row, keys) {
	const record = readLiveModelCatalogRecord(row);
	for (const key of typeof keys === "string" ? [keys] : keys) {
		const value = record?.[key];
		if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) return value;
	}
}
function isUpstreamProviderCatalogModel(value) {
	const model = readLiveModelCatalogRecord(value);
	const limits = readLiveModelCatalogRecord(model?.limit);
	return Boolean(readLiveModelCatalogStringField(model, "id") && readLiveModelCatalogPositiveSafeIntegerField(limits, "context") && readLiveModelCatalogPositiveSafeIntegerField(limits, "output"));
}
function readLiveModelPositiveIntegerFromRecords(records, keys) {
	for (const record of records) {
		const value = readLiveModelCatalogPositiveSafeIntegerField(record, keys);
		if (value !== void 0) return value;
	}
}
function readLiveModelStringArray(records, keys) {
	for (const record of records) for (const key of keys) {
		const value = record?.[key];
		if (Array.isArray(value)) {
			const strings = value.filter((entry) => typeof entry === "string").map((entry) => entry.trim().toLowerCase()).filter(Boolean);
			if (strings.length > 0) return strings;
		}
	}
	return [];
}
function isSafeLiveModelId(value) {
	if (!value || value.length > 512) return false;
	for (const char of value) {
		const codePoint = char.codePointAt(0) ?? 0;
		if (codePoint <= 32 || codePoint === 127) return false;
	}
	return true;
}
const NON_TEXT_MODEL_ID_PATTERN = /(?:^|[/_:.-])(?:embed(?:ding)?|rerank(?:er)?|whisper|transcri(?:be|ption)|tts|speech|moderation|guard|gpt-image|dall-e|flux|sdxl|stable-diffusion|imagen|image-gen(?:eration)?|text-to-image|veo|sora|video-gen(?:eration)?|text-to-video)(?:$|[/_:.-])/i;
function rowAdvertisesNonTextModel(record, nestedRecords) {
	const outputModalities = readLiveModelStringArray([record, ...nestedRecords], [
		"output_modalities",
		"outputModalities",
		"output"
	]);
	if (outputModalities.length > 0 && !outputModalities.includes("text")) return true;
	const kind = readLiveModelCatalogStringField(record, [
		"type",
		"task",
		"model_type",
		"modelType",
		"pipeline_tag"
	]);
	return Boolean(kind && NON_TEXT_MODEL_ID_PATTERN.test(kind));
}
function rowAdvertisesChatModel(record, nestedRecords) {
	const explicitChatCapability = readLiveModelCatalogBooleanField(nestedRecords[0], [
		"completion_chat",
		"chat_completion",
		"chatCompletion"
	]);
	if (explicitChatCapability !== void 0) return explicitChatCapability;
	if (readLiveModelStringArray([record, ...nestedRecords], [
		"capabilities",
		"features",
		"endpoints",
		"supported_endpoints"
	]).some((value) => /(?:^|[./:])(?:chat|responses?|generate|completions?)(?:$|[./:])|(?:^|[./:_-])(?:chat[-_]completions?|completions?[-_]chat|text[-_]generation)(?:$|[./:_-])/.test(value))) return true;
}
function commonPrefixLength(left, right) {
	const limit = Math.min(left.length, right.length);
	let index = 0;
	while (index < limit && left[index] === right[index]) index += 1;
	return index;
}
function findLiveModelTemplate(modelId, models) {
	const exact = models.find((model) => model.id === modelId);
	if (exact) return exact;
	const normalizedId = modelId.toLowerCase();
	let best;
	let bestScore = 0;
	for (const model of models) {
		const score = commonPrefixLength(normalizedId, model.id.toLowerCase());
		if (score > bestScore) {
			best = model;
			bestScore = score;
		}
	}
	return bestScore >= 4 ? best : void 0;
}
function inferLiveModelReasoning(modelId) {
	return /(?:^|[/_:.-])(?:reason(?:er|ing)?|thinking|deepseek-r1|o[134](?:-mini)?|gpt-5)(?:$|[/_:.-])/i.test(modelId);
}
function readLiveModelContextWindow(records) {
	return readLiveModelPositiveIntegerFromRecords(records, [
		"context_window",
		"contextWindow",
		"context_length",
		"contextLength",
		"context_size",
		"contextSize",
		"max_context_length",
		"maxModelLen",
		"max_model_len",
		"max_input_tokens",
		"maxInputTokens"
	]);
}
function buildOpenAICompatibleLiveModel(row, fallback, acceptUnknownModel) {
	const record = readLiveModelCatalogRecord(row);
	const id = readLiveModelCatalogStringField(record, [
		"id",
		"model",
		"model_name",
		"modelName"
	]);
	if (!record || !id || !isSafeLiveModelId(id)) return;
	if (readLiveModelCatalogBooleanField(record, [
		"active",
		"enabled",
		"available"
	]) === false) return;
	if (readLiveModelCatalogBooleanField(record, ["archived", "deprecated"]) === true) return;
	const capabilities = readLiveModelCatalogRecord(record.capabilities);
	const architecture = readLiveModelCatalogRecord(record.architecture);
	const topProvider = readLiveModelCatalogRecord(record.top_provider);
	const modelInfo = readLiveModelCatalogRecord(record.model_info);
	const nestedRecords = [
		capabilities,
		architecture,
		topProvider,
		modelInfo
	];
	const advertisedChatCapability = rowAdvertisesChatModel(record, nestedRecords);
	if (advertisedChatCapability === false || advertisedChatCapability !== true && (rowAdvertisesNonTextModel(record, nestedRecords) || NON_TEXT_MODEL_ID_PATTERN.test(id))) return;
	const exact = fallback.models.find((model) => model.id === id);
	if (exact) {
		const liveContextWindow = readLiveModelContextWindow([record, ...nestedRecords]);
		return exact.contextWindow === void 0 && liveContextWindow !== void 0 ? {
			...exact,
			contextWindow: liveContextWindow
		} : exact;
	}
	if (acceptUnknownModel && !acceptUnknownModel({
		id,
		record
	})) return;
	const template = findLiveModelTemplate(id, fallback.models);
	const inputModalities = readLiveModelStringArray([
		record,
		architecture,
		capabilities,
		modelInfo
	], [
		"input_modalities",
		"inputModalities",
		"input"
	]);
	const contextWindow = readLiveModelContextWindow([record, ...nestedRecords]) ?? template?.contextWindow ?? 128e3;
	const maxTokens = readLiveModelPositiveIntegerFromRecords([
		record,
		topProvider,
		capabilities,
		modelInfo
	], [
		"max_completion_tokens",
		"maxCompletionTokens",
		"max_output_tokens",
		"maxOutputTokens",
		"output_token_limit",
		"outputTokenLimit",
		"max_tokens",
		"maxTokens"
	]) ?? fallback.maxTokens ?? template?.maxTokens ?? Math.min(contextWindow, 8192);
	const explicitReasoning = readLiveModelCatalogBooleanField(record, [
		"reasoning",
		"supports_reasoning",
		"supportsReasoning",
		"thinking"
	]);
	const featureNames = readLiveModelStringArray([
		record,
		capabilities,
		modelInfo
	], [
		"features",
		"supported_parameters",
		"supportedParameters"
	]);
	const reasoning = explicitReasoning ?? (featureNames.some((feature) => /reason|think/.test(feature)) || template?.reasoning === true || inferLiveModelReasoning(id));
	const input = inputModalities.includes("image") ? ["text", "image"] : template?.input ?? ["text"];
	return {
		id,
		name: readLiveModelCatalogStringField(record, [
			"display_name",
			"displayName",
			"name"
		]) ?? id,
		...template?.api ? { api: template.api } : {},
		reasoning,
		input,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow,
		maxTokens,
		...template?.compat ? { compat: template.compat } : {},
		...template?.thinkingLevelMap ? { thinkingLevelMap: template.thinkingLevelMap } : {}
	};
}
function buildOpenAICompatibleLiveModels(rows, fallback, acceptUnknownModel) {
	const models = rows.map((row) => buildOpenAICompatibleLiveModel(row, fallback, acceptUnknownModel)).filter((model) => Boolean(model));
	return [...new Map(models.map((model) => [model.id, model])).values()].toSorted((a, b) => a.id.localeCompare(b.id));
}
function parseUpstreamProviderCatalogUrl(value) {
	try {
		return new URL(value);
	} catch {
		return;
	}
}
const UPSTREAM_PROVIDER_API_BY_PACKAGE = /* @__PURE__ */ new Map([
	["@ai-sdk/anthropic", "anthropic-messages"],
	["@ai-sdk/google", "google-generative-ai"],
	["@ai-sdk/openai", "openai-responses"],
	["@ai-sdk/openai-compatible", "openai-completions"]
]);
/** Projects authoritative provider-owned model metadata into its runtime transport and capabilities. */
function projectUpstreamProviderCatalogModel(params) {
	const model = readLiveModelCatalogRecord(params.model);
	const limit = readLiveModelCatalogRecord(model?.limit);
	const id = readLiveModelCatalogStringField(model, "id");
	const contextWindow = readLiveModelCatalogPositiveSafeIntegerField(limit, "context");
	const maxTokens = readLiveModelCatalogPositiveSafeIntegerField(limit, "output");
	if (!model || !id || !contextWindow || !maxTokens) return;
	const modelProvider = readLiveModelCatalogRecord(model.provider);
	const npm = readLiveModelCatalogStringField(modelProvider, "npm") ?? params.provider.npm ?? "@ai-sdk/openai-compatible";
	const api = UPSTREAM_PROVIDER_API_BY_PACKAGE.get(npm);
	if (!api) return;
	const canonicalBaseUrl = params.defaultBaseUrl ?? params.provider.api;
	const canonicalOrigin = canonicalBaseUrl ? parseUpstreamProviderCatalogUrl(canonicalBaseUrl)?.origin : void 0;
	const providerBaseUrl = params.provider.api ?? params.defaultBaseUrl;
	const modelBaseUrl = readLiveModelCatalogStringField(modelProvider, "api");
	if (!canonicalOrigin || providerBaseUrl && parseUpstreamProviderCatalogUrl(providerBaseUrl)?.origin !== canonicalOrigin || modelBaseUrl && parseUpstreamProviderCatalogUrl(modelBaseUrl)?.origin !== canonicalOrigin) return;
	const upstreamBaseUrl = modelBaseUrl ?? providerBaseUrl;
	const baseUrl = api === "anthropic-messages" ? params.anthropicBaseUrl ?? upstreamBaseUrl?.replace(/\/v1\/?$/, "") : upstreamBaseUrl;
	if (!baseUrl || parseUpstreamProviderCatalogUrl(baseUrl)?.origin !== canonicalOrigin) return;
	const modalities = readLiveModelCatalogRecord(model.modalities);
	const input = ["text"];
	if (Array.isArray(modalities?.input) && modalities.input.includes("image")) input.push("image");
	const reasoningOptions = Array.isArray(model.reasoning_options) ? model.reasoning_options : void 0;
	const effortOptions = reasoningOptions?.flatMap((option) => {
		const record = readLiveModelCatalogRecord(option);
		return record?.type === "effort" && Array.isArray(record.values) ? [record.values] : [];
	});
	const reasoningEfforts = effortOptions?.length || reasoningOptions?.length === 0 ? [...new Set(effortOptions?.flat().flatMap((value) => value === null ? ["none"] : typeof value === "string" && value ? [value] : []))] : void 0;
	const contextTokens = readLiveModelCatalogPositiveSafeIntegerField(limit, "input");
	return {
		id,
		name: readLiveModelCatalogStringField(model, "name") ?? id,
		provider: params.providerId,
		api,
		baseUrl,
		reasoning: readLiveModelCatalogBooleanField(model, "reasoning") ?? false,
		input,
		cost: normalizeUpstreamModelPricing(model.cost) ?? {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow,
		...contextTokens && contextTokens <= contextWindow ? { contextTokens } : {},
		maxTokens,
		...api === "openai-responses" && reasoningEfforts && reasoningEfforts.length > 0 && !reasoningEfforts.includes("none") ? { thinkingLevelMap: { off: null } } : {},
		compat: {
			supportsUsageInStreaming: true,
			maxTokensField: "max_tokens",
			...typeof model.tool_call === "boolean" ? { supportsTools: model.tool_call } : {},
			...reasoningEfforts ? {
				supportsReasoningEffort: reasoningEfforts.length > 0,
				supportedReasoningEfforts: reasoningEfforts
			} : {},
			...api === "openai-completions" ? {
				supportsDeveloperRole: false,
				supportsStrictMode: false
			} : {}
		}
	};
}
//#endregion
//#region src/plugin-sdk/provider-catalog-live-outcome.internal.ts
var LiveModelCatalogHttpError = class extends Error {
	constructor(providerId, status) {
		super(`${providerId} model discovery failed: HTTP ${status}`);
		this.name = "LiveModelCatalogHttpError";
		this.status = status;
	}
};
async function runLiveProviderCatalog(params) {
	const identity = {
		provider: params.providerId,
		...params.profileId ? { profileId: params.profileId } : {}
	};
	try {
		const result = await params.run();
		return result ? {
			...result,
			outcomes: [...result.outcomes ?? [], {
				...identity,
				status: "ready"
			}]
		} : result;
	} catch (error) {
		return {
			providers: {},
			outcomes: [error instanceof LiveModelCatalogHttpError && (error.status === 401 || error.status === 403) ? {
				...identity,
				status: "auth-rejected",
				rejectionScope: "catalog"
			} : {
				...identity,
				status: "unavailable"
			}]
		};
	}
}
//#endregion
//#region src/plugin-sdk/provider-catalog-live-acquisition.internal.ts
const LIVE_MODEL_CATALOG_BODY_MAX_BYTES = 4194304;
const UPSTREAM_PROVIDER_CATALOG_BODY_MAX_BYTES = 8388608;
const LIVE_MODEL_CATALOG_MAX_PAGES = 50;
function readDefaultLiveModelCatalogRows(body) {
	if (Array.isArray(body)) return body;
	if (body && typeof body === "object" && Array.isArray(body.data)) return body.data;
	throw new Error("Live model catalog response must be an array or { data: [] }");
}
function normalizeLiveModelCatalogRequestApiKey(value) {
	const trimmed = value?.trim();
	if (!trimmed || isNonSecretApiKeyMarker(trimmed)) return;
	return trimmed;
}
function selectLiveModelCatalogRequestApiKey(ctx) {
	return normalizeOptionalString(ctx.discoveryApiKey) ?? normalizeLiveModelCatalogRequestApiKey(ctx.apiKey);
}
function buildDefaultLiveModelCatalogHeaders(ctx) {
	const requestApiKey = selectLiveModelCatalogRequestApiKey(ctx);
	return {
		Accept: "application/json",
		...requestApiKey ? { Authorization: `Bearer ${requestApiKey}` } : {}
	};
}
function buildHeaders(params, safeReplayHeaders) {
	const headers = safeReplayHeaders ? new Headers(safeReplayHeaders) : new Headers((params.buildRequestHeaders ?? buildDefaultLiveModelCatalogHeaders)({
		apiKey: normalizeLiveModelCatalogRequestApiKey(params.apiKey),
		discoveryApiKey: selectLiveModelCatalogRequestApiKey(params)
	}));
	if (!headers.has("accept")) headers.set("accept", "application/json");
	return headers;
}
async function readLiveModelCatalogJson(response, params) {
	return await readProviderJsonResponse(response, params.label, {
		chunkTimeoutMs: params.timeoutMs,
		maxBytes: params.maxBytes ?? LIVE_MODEL_CATALOG_BODY_MAX_BYTES,
		requestHeaders: params.requestHeaders,
		onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`Live model catalog response exceeded ${maxBytes} bytes (${size} bytes received)`),
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Live model catalog response stalled: no data received for ${chunkTimeoutMs}ms`)
	});
}
/** Loads one provider from a shared public metadata feed only when explicitly requested. */
async function getCachedUpstreamProviderCatalog(params) {
	const provider = readLiveModelCatalogRecord((await getCachedLiveCatalogValue({
		keyParts: ["upstream-provider-catalog", params.endpoint],
		ttlMs: params.ttlMs ?? 3e5,
		load: async () => {
			const timeoutMs = params.timeoutMs ?? 15e3;
			const { response, release } = await (params.fetchGuard ?? fetchWithSsrFGuard)({
				url: params.endpoint,
				init: { headers: { Accept: "application/json" } },
				signal: params.signal,
				timeoutMs,
				policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(params.endpoint),
				requireHttps: true,
				auditContext: "upstream-provider-catalog-discovery"
			});
			try {
				if (!response.ok) {
					await cancelUnreadResponseBody(response);
					throw new LiveModelCatalogHttpError("upstream-provider-catalog", response.status);
				}
				const catalog = readLiveModelCatalogRecord(await readLiveModelCatalogJson(response, {
					label: "upstream-provider-catalog",
					timeoutMs,
					maxBytes: UPSTREAM_PROVIDER_CATALOG_BODY_MAX_BYTES
				}));
				if (!catalog) throw new Error("Upstream provider catalog response must be an object");
				return catalog;
			} finally {
				await release();
			}
		}
	}))[params.providerId]);
	const models = readLiveModelCatalogRecord(provider?.models);
	if (!provider || !models || readLiveModelCatalogStringField(provider, "id") !== params.providerId) return;
	return {
		id: params.providerId,
		...readLiveModelCatalogStringField(provider, "api") ? { api: readLiveModelCatalogStringField(provider, "api") } : {},
		...readLiveModelCatalogStringField(provider, "npm") ? { npm: readLiveModelCatalogStringField(provider, "npm") } : {},
		models: Object.fromEntries(Object.entries(models).filter((entry) => isUpstreamProviderCatalogModel(entry[1])))
	};
}
function readLiveModelCatalogNextUrl(body) {
	const record = readLiveModelCatalogRecord(body);
	if (!record) return;
	const links = readLiveModelCatalogRecord(record.links);
	return normalizeOptionalString(record.next) ?? normalizeOptionalString(links?.next);
}
function readLiveModelCatalogCursor(body) {
	const record = readLiveModelCatalogRecord(body);
	if (!record || record.has_more === false) return;
	const nextCursor = normalizeOptionalString(record.next_cursor);
	if (nextCursor) return {
		name: "after",
		value: nextCursor
	};
	const lastId = normalizeOptionalString(record.last_id) ?? normalizeOptionalString(record.lastId);
	if (lastId) return {
		name: "after_id",
		value: lastId
	};
	const nextPageToken = normalizeOptionalString(record.nextPageToken);
	if (nextPageToken) return {
		name: "pageToken",
		value: nextPageToken
	};
	const nextPageTokenSnakeCase = normalizeOptionalString(record.next_page_token);
	return nextPageTokenSnakeCase ? {
		name: "page_token",
		value: nextPageTokenSnakeCase
	} : void 0;
}
function bodyAdvertisesMoreLiveModelCatalogPages(body) {
	const record = readLiveModelCatalogRecord(body);
	if (!record || record.has_more === false) return false;
	return Boolean(record.has_more === true || readLiveModelCatalogNextUrl(body) || normalizeOptionalString(record.next_cursor) || normalizeOptionalString(record.nextPageToken) || normalizeOptionalString(record.next_page_token));
}
function tryParseUrl(url, base) {
	try {
		return new URL(url, base);
	} catch {
		return;
	}
}
function resolveLiveModelCatalogNextPage(currentUrl, body) {
	const rawNextUrl = readLiveModelCatalogNextUrl(body);
	if (rawNextUrl) {
		const currentParsed = tryParseUrl(currentUrl);
		const nextUrl = tryParseUrl(rawNextUrl, currentUrl);
		if (nextUrl && currentParsed && nextUrl.origin === currentParsed.origin) return {
			status: "next",
			url: nextUrl.toString()
		};
		const cursor = readLiveModelCatalogCursor(body);
		if (cursor) {
			const cursorUrl = tryParseUrl(currentUrl);
			if (cursorUrl) {
				cursorUrl.searchParams.set(cursor.name, cursor.value);
				return {
					status: "next",
					url: cursorUrl.toString()
				};
			}
		}
		return { status: "incomplete" };
	}
	const cursor = readLiveModelCatalogCursor(body);
	if (cursor) {
		const nextUrl = tryParseUrl(currentUrl);
		if (nextUrl) {
			nextUrl.searchParams.set(cursor.name, cursor.value);
			return {
				status: "next",
				url: nextUrl.toString()
			};
		}
	}
	return bodyAdvertisesMoreLiveModelCatalogPages(body) ? { status: "incomplete" } : { status: "complete" };
}
async function fetchLiveProviderModelCatalogPage(params) {
	const requestHeaders = buildHeaders(params, params.safeReplayHeaders);
	const { response, finalUrl, release } = await params.fetchGuard({
		url: params.url,
		init: { headers: requestHeaders },
		signal: params.signal,
		timeoutMs: params.timeoutMs,
		policy: params.policy ?? ssrfPolicyFromHttpBaseUrlAllowedHostname(params.endpoint),
		...params.lookupFn ? { lookupFn: params.lookupFn } : {},
		...params.requireHttps !== void 0 ? { requireHttps: params.requireHttps } : {},
		auditContext: params.auditContext ?? `${params.providerId}-model-discovery`
	});
	try {
		if (!response.ok) {
			await cancelUnreadResponseBody(response);
			throw new LiveModelCatalogHttpError(params.providerId, response.status);
		}
		const body = await readLiveModelCatalogJson(response, {
			label: `${params.providerId} model discovery`,
			timeoutMs: params.timeoutMs,
			requestHeaders
		});
		return {
			body,
			finalUrl,
			requestHeaders,
			rows: (params.readRows ?? readDefaultLiveModelCatalogRows)(body)
		};
	} finally {
		await release();
	}
}
async function fetchLiveProviderModelRows(params) {
	const fetchGuard = params.fetchGuard ?? fetchWithSsrFGuard;
	const timeoutMs = params.timeoutMs ?? 5e3;
	const startedAt = performance.now();
	const rows = [];
	const seenPageUrls = /* @__PURE__ */ new Set();
	let pageUrl = params.endpoint;
	let safeReplayHeaders;
	for (let page = 0; page < LIVE_MODEL_CATALOG_MAX_PAGES && pageUrl; page += 1) {
		if (seenPageUrls.has(pageUrl)) break;
		const remainingTimeoutMs = Math.floor(timeoutMs - (performance.now() - startedAt));
		if (remainingTimeoutMs <= 0) throw new Error(`${params.providerId} model discovery exceeded ${timeoutMs}ms before the catalog completed`);
		seenPageUrls.add(pageUrl);
		const requestedPageUrl = pageUrl;
		const result = await fetchLiveProviderModelCatalogPage({
			...params,
			fetchGuard,
			url: requestedPageUrl,
			timeoutMs: remainingTimeoutMs,
			safeReplayHeaders
		});
		rows.push(...result.rows);
		const finalParsed = tryParseUrl(result.finalUrl);
		const requestedParsed = tryParseUrl(requestedPageUrl);
		if (safeReplayHeaders || !finalParsed || !requestedParsed || finalParsed.origin !== requestedParsed.origin) safeReplayHeaders = new Headers(retainSafeHeadersForCrossOriginRedirect(result.requestHeaders));
		const nextPage = resolveLiveModelCatalogNextPage(result.finalUrl, result.body);
		if (nextPage.status === "incomplete") throw new Error(`${params.providerId} model discovery did not include a supported next page before the catalog completed`);
		pageUrl = nextPage.status === "next" ? nextPage.url : void 0;
	}
	if (pageUrl) throw new Error(`${params.providerId} model discovery exceeded ${LIVE_MODEL_CATALOG_MAX_PAGES} pages before the catalog completed`);
	return rows;
}
function liveModelCatalogAuthCacheKey(params) {
	return selectLiveModelCatalogRequestApiKey(params);
}
async function getCachedLiveProviderModelRows(params) {
	return await getCachedLiveCatalogValue({
		keyParts: params.cacheKeyParts ?? [
			params.providerId,
			"model-rows",
			params.endpoint,
			liveModelCatalogAuthCacheKey(params)
		],
		ttlMs: params.ttlMs,
		load: async () => await fetchLiveProviderModelRows(params),
		shouldCache: params.shouldCacheRows
	});
}
async function fetchLiveProviderModelIds(params) {
	const rows = await fetchLiveProviderModelRows(params);
	const readModelId = params.readModelId ?? readLiveModelCatalogId;
	const seen = /* @__PURE__ */ new Set();
	const modelIds = [];
	for (const row of rows) {
		const modelId = readModelId(row);
		if (!modelId || seen.has(modelId)) continue;
		seen.add(modelId);
		modelIds.push(modelId);
	}
	return modelIds;
}
//#endregion
//#region src/plugin-sdk/provider-catalog-snapshot.internal.ts
/** Rebuilds public metadata from trusted seeds without retaining withdrawn upstream rows. */
function projectUpstreamProviderCatalogSnapshot(params) {
	const snapshot = new Map(params.seed);
	for (const upstreamModel of Object.values(params.provider.models)) {
		const projected = projectUpstreamProviderCatalogModel({
			providerId: params.providerId,
			provider: params.provider,
			model: upstreamModel,
			anthropicBaseUrl: params.anthropicBaseUrl,
			defaultBaseUrl: params.defaultBaseUrl
		});
		if (!projected) continue;
		const decorated = params.decorateModel ? params.decorateModel(projected) : projected;
		const model = normalizeModelCompat(decorated);
		snapshot.set(model.id.toLowerCase(), {
			model,
			...upstreamModel.status === "deprecated" ? { status: "deprecated" } : {}
		});
	}
	return snapshot;
}
/** Intersects advertised ids with active trusted metadata, retaining endpoint order. */
function projectProviderCatalogSnapshotRows(rows, snapshot) {
	const seen = /* @__PURE__ */ new Set();
	const models = [];
	for (const row of rows) {
		const id = readLiveModelCatalogId(row)?.toLowerCase();
		if (!id || seen.has(id)) continue;
		seen.add(id);
		const entry = snapshot.get(id);
		if (entry && !entry.status) models.push(entry.model);
	}
	return models;
}
function listProviderCatalogSnapshotEntries(snapshot) {
	return Array.from(snapshot.values(), ({ model, status, replacedBy }) => ({
		provider: model.provider,
		id: model.id,
		name: model.name,
		api: model.api,
		baseUrl: model.baseUrl,
		reasoning: model.reasoning,
		input: model.input,
		contextWindow: model.contextWindow,
		contextTokens: model.contextTokens,
		compat: model.compat,
		...status ? { status } : {},
		...replacedBy ? { replacedBy } : {}
	}));
}
//#endregion
//#region src/plugin-sdk/provider-catalog-live-runtime.ts
function matchesProviderCatalogScope(ctx, providerIds) {
	const selected = ctx.providerIds;
	return selected === void 0 || providerIds.some((id) => selected.includes(normalizeProviderId(id)));
}
function buildProviderConfig(params, models) {
	return {
		...params.providerConfig,
		...params.apiKey ? { apiKey: params.apiKey } : {},
		models: [...models]
	};
}
async function projectCachedLiveModelRows(params) {
	const load = async (requestAuth) => {
		const rows = await getCachedLiveProviderModelRows({
			...params,
			...requestAuth,
			cacheKeyParts: requestAuth.apiKey === params.apiKey && requestAuth.discoveryApiKey === params.discoveryApiKey ? params.cacheKeyParts : void 0,
			shouldCacheRows: (candidateRows) => params.projectRows(candidateRows, params.fallback).length > 0 || params.discoveryMode === "strict"
		});
		return params.projectRows(rows, params.fallback);
	};
	try {
		return await load({
			apiKey: params.apiKey,
			discoveryApiKey: params.discoveryApiKey
		});
	} catch (error) {
		if (params.fallbackToAnonymousOnUnauthorized && params.discoveryMode !== "strict" && error instanceof LiveModelCatalogHttpError && error.status === 401 && (params.apiKey || params.discoveryApiKey)) return await load({
			apiKey: void 0,
			discoveryApiKey: void 0
		});
		throw error;
	}
}
async function buildLiveModelProviderConfig(params) {
	const fallback = buildProviderConfig(params, params.models);
	const cacheKeyParts = params.discoveryMode === "strict" ? [
		params.providerId,
		params.projectRows ? "model-rows" : "models",
		params.endpoint,
		liveModelCatalogAuthCacheKey(params),
		"strict",
		params.cacheKeyParts
	] : params.cacheKeyParts;
	try {
		if (params.projectRows) {
			const models = await projectCachedLiveModelRows({
				...params,
				cacheKeyParts,
				fallback,
				projectRows: params.projectRows
			});
			if (models.length > 0 || params.discoveryMode === "strict") return {
				...fallback,
				models: [...models]
			};
			return fallback;
		}
		const liveModelIds = await getCachedLiveCatalogValue({
			keyParts: cacheKeyParts ?? [
				params.providerId,
				"models",
				params.endpoint,
				liveModelCatalogAuthCacheKey(params)
			],
			ttlMs: params.ttlMs,
			load: async () => await fetchLiveProviderModelIds(params),
			shouldCache: (modelIds) => modelIds.length > 0 || params.discoveryMode === "strict"
		});
		const liveModelIdSet = new Set(liveModelIds);
		const models = params.models.filter((model) => liveModelIdSet.has(model.id));
		if (models.length > 0 || params.discoveryMode === "strict") return buildProviderConfig(params, models);
	} catch (error) {
		if (params.discoveryMode === "strict") throw error;
	}
	return fallback;
}
/** Keeps one provider's public metadata snapshot separate from per-call discovery credentials. */
function createUpstreamProviderCatalog(params) {
	let snapshot = params.seed;
	const buildStaticProvider = (apiKey) => ({
		...params.providerConfig,
		...apiKey ? { apiKey } : {},
		models: [...params.seed.values()].filter(({ model }) => params.isStaticEntryActive(snapshot.get(model.id))).map(({ model }) => model)
	});
	const refreshMetadata = async (request) => {
		const provider = await getCachedUpstreamProviderCatalog({
			endpoint: params.metadataEndpoint,
			providerId: params.providerId,
			fetchGuard: request.fetchGuard,
			signal: request.signal
		});
		if (!provider) return;
		snapshot = projectUpstreamProviderCatalogSnapshot({
			providerId: params.providerId,
			provider,
			seed: params.upstreamSeed ?? params.seed,
			anthropicBaseUrl: params.anthropicBaseUrl,
			defaultBaseUrl: params.providerConfig.baseUrl,
			decorateModel: params.decorateModel
		});
		return snapshot;
	};
	return {
		getSnapshot: () => snapshot,
		buildStaticProvider,
		refreshMetadata,
		async buildLiveProvider(request = {}) {
			if (!request.apiKey && !request.discoveryApiKey) return buildStaticProvider();
			try {
				await refreshMetadata(request);
			} catch {}
			return await buildLiveModelProviderConfig({
				discoveryMode: "strict",
				providerId: params.providerId,
				endpoint: params.modelsEndpoint,
				providerConfig: params.providerConfig,
				models: buildStaticProvider().models,
				apiKey: request.apiKey,
				discoveryApiKey: request.discoveryApiKey,
				fetchGuard: request.fetchGuard,
				signal: request.signal,
				timeoutMs: params.timeoutMs,
				ttlMs: params.ttlMs,
				auditContext: params.auditContext,
				projectRows: (rows) => projectProviderCatalogSnapshotRows(rows, snapshot)
			});
		}
	};
}
function resolveLiveModelDiscoveryEndpoint(baseUrl, endpointPath) {
	return `${baseUrl.trim().replace(/\/+$/, "")}/${endpointPath.trim().replace(/^\/+/, "")}`;
}
function resolveFixedLiveModelDiscoveryEndpoint(baseUrl, endpoint) {
	return baseUrl.trim().replace(/\/+$/, "") === endpoint.requireBaseUrl.trim().replace(/\/+$/, "") ? endpoint.url : void 0;
}
function prepareOpenAICompatibleLiveModelDiscovery(params) {
	const fallback = {
		...params.providerConfig,
		...params.apiKey ? { apiKey: params.apiKey } : {}
	};
	const acceptUnknownModel = params.modelDiscovery?.acceptUnknownModel;
	const endpoint = params.modelDiscovery?.endpointUrl ? resolveFixedLiveModelDiscoveryEndpoint(fallback.baseUrl, params.modelDiscovery.endpointUrl) : resolveLiveModelDiscoveryEndpoint(fallback.baseUrl, params.modelDiscovery?.endpointPath ?? "models");
	if (!endpoint) return {
		kind: "static",
		provider: fallback
	};
	const { models, ...providerConfig } = fallback;
	const auth = params.modelDiscovery?.authentication === "none" ? {} : {
		apiKey: params.apiKey,
		discoveryApiKey: params.discoveryApiKey,
		profileId: params.profileId
	};
	return {
		kind: "live",
		request: {
			discoveryMode: params.discoveryMode,
			providerId: params.providerId,
			endpoint,
			providerConfig,
			models,
			apiKey: auth.apiKey,
			discoveryApiKey: auth.discoveryApiKey,
			fetchGuard: params.fetchGuard,
			signal: params.signal,
			timeoutMs: params.modelDiscovery?.timeoutMs,
			ttlMs: params.modelDiscovery?.ttlMs ?? 6e4,
			auditContext: `${params.providerId}-model-discovery`,
			readRows: params.modelDiscovery?.readRows,
			buildRequestHeaders: params.modelDiscovery?.buildRequestHeaders,
			projectRows: params.modelDiscovery?.projectRows ?? ((rows, fallbackProvider) => buildOpenAICompatibleLiveModels(rows, fallbackProvider, acceptUnknownModel))
		},
		profileId: auth.profileId
	};
}
async function buildOpenAICompatibleLiveModelProviderConfig(params) {
	const discovery = prepareOpenAICompatibleLiveModelDiscovery(params);
	return discovery.kind === "static" ? discovery.provider : await buildLiveModelProviderConfig(discovery.request);
}
async function buildOpenAICompatibleLiveProviderCatalog(params) {
	const discovery = prepareOpenAICompatibleLiveModelDiscovery(params);
	if (discovery.kind === "static") return { provider: discovery.provider };
	const run = async () => ({ provider: await buildLiveModelProviderConfig(discovery.request) });
	return params.discoveryMode === "strict" ? await runLiveProviderCatalog({
		providerId: params.providerId,
		profileId: discovery.profileId,
		run
	}) : await run();
}
/** Builds the shared authenticated live/static hooks for an ordered provider family. */
function buildOpenAICompatibleProviderFamilyCatalog(params) {
	return {
		catalog: {
			order: "paired",
			run: async (ctx) => {
				const entries = params.entries.filter(({ id }) => matchesProviderCatalogScope(ctx, [id]));
				if (entries.length === 0) return null;
				const auth = ctx.resolveProviderApiKey(params.credentialProviderId);
				if (!auth.apiKey) return null;
				const results = await Promise.all(entries.map(async ({ id, buildProvider }) => ({
					id,
					result: await buildOpenAICompatibleLiveProviderCatalog({
						providerId: id,
						providerConfig: buildProvider(),
						apiKey: auth.apiKey,
						discoveryApiKey: auth.discoveryApiKey,
						profileId: auth.profileId,
						discoveryMode: params.discoveryMode
					})
				})));
				return {
					providers: Object.fromEntries(results.flatMap(({ id, result }) => result && "provider" in result ? [[id, result.provider]] : [])),
					...params.discoveryMode === "strict" ? { outcomes: results.flatMap(({ result }) => result?.outcomes ?? []) } : {}
				};
			},
			staticRun: params.staticCatalog
		},
		augmentModelCatalog: params.augmentModelCatalog
	};
}
async function buildOpenAICompatibleProviderCatalog(params) {
	if (!matchesProviderCatalogScope(params.ctx, [params.providerId, ...params.providerAliases ?? []])) return null;
	const auth = params.ctx.resolveProviderApiKey(normalizeProviderId(params.providerId));
	const result = await buildSingleProviderApiKeyCatalog({
		ctx: {
			...params.ctx,
			resolveProviderApiKey: () => auth
		},
		providerId: params.providerId,
		buildProvider: params.buildProvider,
		allowExplicitBaseUrl: params.allowExplicitBaseUrl
	});
	if (!result || !("provider" in result)) return result;
	return await buildOpenAICompatibleLiveProviderCatalog({
		providerId: params.providerId,
		providerConfig: result.provider,
		apiKey: auth.apiKey,
		discoveryApiKey: auth.discoveryApiKey,
		modelDiscovery: params.modelDiscovery,
		profileId: auth.profileId,
		discoveryMode: params.discoveryMode
	});
}
//#endregion
export { readLiveModelCatalogPositiveSafeIntegerField as _, buildOpenAICompatibleProviderFamilyCatalog as a, projectProviderCatalogSnapshotRows as c, fetchLiveProviderModelRows as d, getCachedLiveProviderModelRows as f, readLiveModelCatalogBooleanField as g, runLiveProviderCatalog as h, buildOpenAICompatibleProviderCatalog as i, projectUpstreamProviderCatalogSnapshot as l, LiveModelCatalogHttpError as m, buildOpenAICompatibleLiveModelProviderConfig as n, createUpstreamProviderCatalog as o, getCachedUpstreamProviderCatalog as p, buildOpenAICompatibleLiveProviderCatalog as r, listProviderCatalogSnapshotEntries as s, buildLiveModelProviderConfig as t, fetchLiveProviderModelIds as u, readLiveModelCatalogStringField as v };
