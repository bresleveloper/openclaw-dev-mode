import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { l as normalizeResolvedSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import { b as redactProviderResponseErrorText, o as createProviderHttpError, p as readProviderJsonObjectResponse, t as ProviderHttpError, u as formatProviderHttpErrorMessage, v as truncateErrorDetail } from "./provider-http-errors-CTY_-ABT.mjs";
import { n as readProviderEnvValue } from "./provider-credential-values-DSE2VVU-.mjs";
import { o as wrapWebContent } from "./external-content-CLufk6dK.mjs";
import { d as readPositiveIntegerParam, h as readToolStringParam } from "./common-XfKigJno.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { a as buildUnsupportedSearchFilterResponse, b as withTrustedWebSearchEndpoint, f as readCachedSearchPayload, g as resolveSearchTimeoutSeconds, i as buildSearchCacheKey, m as resolveSearchCacheTtlMs, p as readConfiguredSecretString, u as parseWebSearchTimeFilters, x as writeCachedSearchPayload } from "./web-search-provider-common-6Yt6-I5E.mjs";
import "./provider-http-Dn9NddwC.mjs";
import { n as resolveCitationRedirectUrl } from "./provider-web-search-CRDOBhl4.mjs";
import "./secret-input-runtime-C01-y7l7.mjs";
import { f as normalizeGoogleApiBaseUrl } from "./provider-policy-BWkzSuhk.mjs";
import { t as resolveGoogleApiClientHeaders } from "./google-api-client-header-BGxuny7v.mjs";
import { createHash } from "node:crypto";
//#region extensions/google/src/gemini-web-search-provider.shared.ts
const DEFAULT_GEMINI_WEB_SEARCH_MODEL = "gemini-3.6-flash";
function resolveGeminiConfig(searchConfig) {
	const gemini = searchConfig?.gemini;
	return isRecord(gemini) ? gemini : {};
}
function resolveGeminiModel(gemini) {
	return normalizeOptionalString(gemini?.model) ?? DEFAULT_GEMINI_WEB_SEARCH_MODEL;
}
function resolveGeminiBaseUrl(gemini) {
	return normalizeGoogleApiBaseUrl(normalizeOptionalString(gemini?.baseUrl) ?? normalizeOptionalString(gemini?.providerBaseUrl));
}
//#endregion
//#region extensions/google/src/gemini-web-search-provider.runtime.ts
const GEMINI_PROVIDER_OWNED_HEADER_NAMES = /* @__PURE__ */ new Set([
	"content-type",
	"x-goog-api-client",
	"x-goog-api-key"
]);
const GEMINI_UNSAFE_REQUEST_HEADER_NAMES = /* @__PURE__ */ new Set([
	"connection",
	"content-length",
	"expect",
	"host",
	"keep-alive",
	"proxy-connection",
	"te",
	"trailer",
	"transfer-encoding",
	"upgrade"
]);
function throwMalformedGeminiResponse() {
	throw new Error("Gemini API error: malformed JSON response");
}
const GEMINI_FRESHNESS_DAYS = {
	day: 1,
	week: 7,
	month: 30,
	year: 365
};
const GEMINI_DAY_FRESHNESS_HINT = "Prioritize web sources published in the last 24 hours.";
function toGeminiTimeRangeTimestamp(date) {
	return date.toISOString().replace(/\.\d+Z$/, "Z");
}
function isoDateStart(value) {
	return `${value}T00:00:00Z`;
}
function isoDateExclusiveEnd(value) {
	const end = /* @__PURE__ */ new Date(`${value}T00:00:00Z`);
	end.setUTCDate(end.getUTCDate() + 1);
	return toGeminiTimeRangeTimestamp(end);
}
function freshnessStartTime(freshness, now) {
	const start = new Date(now);
	start.setUTCDate(start.getUTCDate() - GEMINI_FRESHNESS_DAYS[freshness]);
	return toGeminiTimeRangeTimestamp(start);
}
function queryWithSoftFreshness(query, freshness) {
	if (freshness !== "day") return query;
	return `${query}\n\nSearch recency instruction: ${GEMINI_DAY_FRESHNESS_HINT} If no matching recent sources are available, state that limitation and use the most relevant available sources.`;
}
function resolveGeminiTimeRangeFilter(args, now = /* @__PURE__ */ new Date()) {
	const rawFreshness = readToolStringParam(args, "freshness");
	const rawDateAfter = readToolStringParam(args, "date_after");
	const rawDateBefore = readToolStringParam(args, "date_before");
	const parsedTimeFilters = parseWebSearchTimeFilters({
		rawDateAfter,
		rawDateBefore,
		rawFreshness,
		freshnessProvider: "perplexity",
		invalidFreshnessMessage: "freshness must be day, week, month, year, or the shortcuts pd, pw, pm, py.",
		invalidDateAfterMessage: "date_after must be YYYY-MM-DD format.",
		invalidDateBeforeMessage: "date_before must be YYYY-MM-DD format.",
		invalidDateRangeMessage: "date_after must be before date_before."
	});
	if ("error" in parsedTimeFilters) return parsedTimeFilters;
	const { freshness, dateAfter, dateBefore } = parsedTimeFilters;
	if (freshness) {
		if (freshness === "day") return { freshness };
		return {
			freshness,
			timeRangeFilter: {
				startTime: freshnessStartTime(freshness, now),
				endTime: toGeminiTimeRangeTimestamp(now)
			}
		};
	}
	if (!dateAfter && !dateBefore) return {};
	return {
		dateAfter,
		dateBefore,
		timeRangeFilter: {
			startTime: dateAfter ? isoDateStart(dateAfter) : "1970-01-01T00:00:00Z",
			endTime: dateBefore ? isoDateExclusiveEnd(dateBefore) : toGeminiTimeRangeTimestamp(now)
		}
	};
}
function resolveGeminiRuntimeApiKey(gemini) {
	return readConfiguredSecretString(gemini?.apiKey, "plugins.entries.google.config.webSearch.apiKey") ?? readProviderEnvValue(["GEMINI_API_KEY"]) ?? readConfiguredSecretString(gemini?.providerApiKey, "models.providers.google.apiKey");
}
function resolveGeminiWebSearchHeaders(gemini) {
	if (!isRecord(gemini?.headers)) return;
	const headers = new Headers();
	for (const [name, input] of Object.entries(gemini.headers)) {
		const path = `plugins.entries.google.config.webSearch.headers[${JSON.stringify(name)}]`;
		const value = typeof input === "string" ? input : normalizeResolvedSecretInputString({
			value: input,
			path
		});
		if (value === void 0) throw new Error(`${path} must be a string or resolved SecretRef.`);
		let normalizedName;
		let normalizedValue;
		try {
			const [entry] = new Headers([[name, value]]).entries();
			if (!entry) throw new Error("missing normalized header entry");
			[normalizedName, normalizedValue] = entry;
		} catch {
			throw new Error(`${path} is not a valid HTTP header.`);
		}
		if (GEMINI_UNSAFE_REQUEST_HEADER_NAMES.has(normalizedName)) throw new Error(`${path} uses a reserved or framing HTTP header.`);
		if (GEMINI_PROVIDER_OWNED_HEADER_NAMES.has(normalizedName)) continue;
		headers.set(normalizedName, normalizedValue);
	}
	const entries = [...headers.entries()];
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function buildGeminiRequestHeaders(params) {
	const providerHeaders = {
		"Content-Type": "application/json",
		"x-goog-api-key": params.apiKey,
		...resolveGoogleApiClientHeaders({
			baseUrl: params.baseUrl,
			api: "google-generative-ai",
			capability: "other",
			transport: "http"
		})
	};
	if (!params.operatorHeaders) return providerHeaders;
	const headers = new Headers(params.operatorHeaders);
	for (const [name, value] of Object.entries(providerHeaders)) headers.set(name, value);
	return headers;
}
async function runGeminiSearch(params) {
	const endpoint = `${params.baseUrl}/models/${params.model}:generateContent`;
	const googleSearch = params.timeRangeFilter === void 0 ? {} : { timeRangeFilter: params.timeRangeFilter };
	const headers = buildGeminiRequestHeaders({
		apiKey: params.apiKey,
		baseUrl: params.baseUrl,
		operatorHeaders: params.headers
	});
	return withTrustedWebSearchEndpoint({
		url: endpoint,
		timeoutSeconds: params.timeoutSeconds,
		signal: params.signal,
		init: {
			method: "POST",
			headers,
			body: JSON.stringify({
				contents: [{ parts: [{ text: params.query }] }],
				tools: [{ google_search: googleSearch }]
			})
		}
	}, async (res) => {
		if (!res.ok) {
			const error = await createProviderHttpError(res, "Gemini API error", {
				signal: params.signal,
				requestHeaders: headers
			});
			error.message = error.message.replace(/key=[^&\s]+/giu, "key=***");
			throw error;
		}
		const data = await readProviderJsonObjectResponse(res, "Gemini API error");
		if (data.error !== void 0) {
			if (!isRecord(data.error)) throwMalformedGeminiResponse();
			const rawMessage = normalizeOptionalString(data.error.message) ?? normalizeOptionalString(data.error.status) ?? "unknown";
			const status = typeof data.error.code === "number" ? data.error.code : 0;
			throw new ProviderHttpError(formatProviderHttpErrorMessage({
				label: "Gemini API error",
				status,
				detail: redactProviderResponseErrorText(rawMessage, headers).replace(/key=[^&\s]+/giu, "key=***")
			}), { status });
		}
		if (data.candidates !== void 0 && !Array.isArray(data.candidates) || data.promptFeedback !== void 0 && !isRecord(data.promptFeedback)) throwMalformedGeminiResponse();
		const candidate = data.candidates?.[0];
		if (candidate !== void 0 && !isRecord(candidate)) throwMalformedGeminiResponse();
		const candidateContent = candidate?.content;
		if (candidateContent !== void 0 && !isRecord(candidateContent)) throwMalformedGeminiResponse();
		const parts = candidateContent?.parts;
		if (parts !== void 0 && !Array.isArray(parts)) throwMalformedGeminiResponse();
		const content = (parts ?? []).map((part) => isRecord(part) && typeof part.text === "string" ? part.text : void 0).filter((text) => Boolean(text)).join("\n");
		const groundingMetadata = candidate?.groundingMetadata;
		if (groundingMetadata !== void 0 && !isRecord(groundingMetadata)) throwMalformedGeminiResponse();
		const groundingChunks = groundingMetadata?.groundingChunks;
		if (groundingChunks !== void 0 && !Array.isArray(groundingChunks)) throwMalformedGeminiResponse();
		if (!content) {
			const reasons = [data.promptFeedback?.blockReason, candidate?.finishReason];
			if (reasons.some((reason) => reason !== void 0 && typeof reason !== "string") || parts?.some((part) => !isRecord(part) || part.text !== void 0 && typeof part.text !== "string")) throwMalformedGeminiResponse();
			const reason = reasons.map((value) => normalizeOptionalString(value)).find(Boolean);
			const detail = reason ? ` (${truncateErrorDetail(reason, 120)})` : "";
			throw new Error(`Gemini search returned no final answer${detail}.`);
		}
		const rawCitations = (groundingChunks ?? []).flatMap((chunk) => {
			if (!isRecord(chunk) || !isRecord(chunk.web) || typeof chunk.web.uri !== "string") return [];
			return [{
				url: chunk.web.uri,
				title: typeof chunk.web.title === "string" ? chunk.web.title : void 0
			}];
		});
		const citations = [];
		for (let index = 0; index < rawCitations.length; index += 10) {
			const batch = rawCitations.slice(index, index + 10);
			const resolved = await Promise.all(batch.map(async (citation) => Object.assign({}, citation, { url: await resolveCitationRedirectUrl(citation.url) })));
			citations.push(...resolved);
		}
		return {
			content,
			citations
		};
	});
}
async function executeGeminiSearch(args, searchConfig, context) {
	context?.signal?.throwIfAborted();
	const unsupportedResponse = buildUnsupportedSearchFilterResponse({
		country: args.country,
		language: args.language
	}, "gemini");
	if (unsupportedResponse) return unsupportedResponse;
	const timeRange = resolveGeminiTimeRangeFilter(args);
	if ("error" in timeRange) return timeRange;
	const geminiConfig = resolveGeminiConfig(searchConfig);
	const apiKey = resolveGeminiRuntimeApiKey(geminiConfig);
	if (!apiKey) return {
		error: "missing_gemini_api_key",
		message: "web_search (gemini) needs an API key. Set GEMINI_API_KEY in the Gateway environment, configure plugins.entries.google.config.webSearch.apiKey, or reuse models.providers.google.apiKey. If you do not want to configure a search API key, use web_fetch for a specific URL or the browser tool for interactive pages.",
		docs: "https://docs.openclaw.ai/tools/web"
	};
	const query = readToolStringParam(args, "query", { required: true });
	readPositiveIntegerParam(args, "count", {
		max: 10,
		message: `count must be an integer from 1 to 10.`
	});
	const model = resolveGeminiModel(geminiConfig);
	const baseUrl = resolveGeminiBaseUrl(geminiConfig);
	const headers = resolveGeminiWebSearchHeaders(geminiConfig);
	const headersCacheKey = headers ? createHash("sha256").update(JSON.stringify(Object.entries(headers).toSorted(([left], [right]) => left.localeCompare(right)))).digest("hex") : void 0;
	const cacheKey = buildSearchCacheKey([
		"gemini",
		query,
		baseUrl,
		model,
		timeRange.freshness,
		timeRange.dateAfter,
		timeRange.dateBefore,
		headersCacheKey
	]);
	const cacheTtlMs = resolveSearchCacheTtlMs(searchConfig);
	const cached = readCachedSearchPayload(cacheKey, cacheTtlMs);
	if (cached) return cached;
	const start = Date.now();
	const result = await runGeminiSearch({
		query: queryWithSoftFreshness(query, timeRange.freshness),
		apiKey,
		baseUrl,
		model,
		timeoutSeconds: resolveSearchTimeoutSeconds(searchConfig),
		signal: context?.signal,
		timeRangeFilter: timeRange.timeRangeFilter,
		headers
	});
	context?.signal?.throwIfAborted();
	const payload = {
		query,
		provider: "gemini",
		model,
		tookMs: Date.now() - start,
		externalContent: {
			untrusted: true,
			source: "web_search",
			provider: "gemini",
			wrapped: true
		},
		content: wrapWebContent(result.content),
		citations: result.citations
	};
	writeCachedSearchPayload(cacheKey, payload, cacheTtlMs);
	return payload;
}
//#endregion
export { executeGeminiSearch };
