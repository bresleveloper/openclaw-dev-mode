import { n as readResponseWithLimit } from "./read-response-with-limit-MDCSJrlg.js";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-DmSIVBht.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Behn5ZPn.js";
import { d as isNonSecretApiKeyMarker } from "./model-auth-markers-C4s6SbvA.js";
import "./ssrf-runtime-CZi-6iMr.js";
import { i as getCachedLiveCatalogValue } from "./provider-catalog-shared-D_YliG-V.js";
//#region src/plugin-sdk/provider-catalog-live-runtime.ts
const LIVE_MODEL_CATALOG_BODY_MAX_BYTES = 4 * 1024 * 1024;
var LiveModelCatalogHttpError = class extends Error {
	constructor(providerId, status) {
		super(`${providerId} model discovery failed: HTTP ${status}`);
		this.name = "LiveModelCatalogHttpError";
		this.status = status;
	}
};
function readDefaultLiveModelCatalogRows(body) {
	if (Array.isArray(body)) return body;
	if (body && typeof body === "object" && Array.isArray(body.data)) return body.data;
	throw new Error("Live model catalog response must be an array or { data: [] }");
}
function readDefaultLiveModelId(row) {
	if (!row || typeof row !== "object" || Array.isArray(row)) return;
	const candidate = row;
	if (candidate.object !== void 0 && candidate.object !== "model") return;
	if (typeof candidate.id !== "string") return;
	return candidate.id.trim() || void 0;
}
function normalizeLiveModelCatalogRequestApiKey(value) {
	const trimmed = value?.trim();
	if (!trimmed || isNonSecretApiKeyMarker(trimmed)) return;
	return trimmed;
}
function selectLiveModelCatalogRequestApiKey(ctx) {
	return normalizeLiveModelCatalogRequestApiKey(ctx.discoveryApiKey) ?? normalizeLiveModelCatalogRequestApiKey(ctx.apiKey);
}
function buildDefaultLiveModelCatalogHeaders(ctx) {
	const requestApiKey = selectLiveModelCatalogRequestApiKey(ctx);
	return {
		Accept: "application/json",
		...requestApiKey ? { Authorization: `Bearer ${requestApiKey}` } : {}
	};
}
function buildHeaders(params) {
	const requestApiKey = selectLiveModelCatalogRequestApiKey(params);
	const headers = new Headers((params.buildRequestHeaders ?? buildDefaultLiveModelCatalogHeaders)({
		apiKey: normalizeLiveModelCatalogRequestApiKey(params.apiKey),
		discoveryApiKey: requestApiKey
	}));
	if (!headers.has("accept")) headers.set("accept", "application/json");
	return headers;
}
async function cancelUnreadResponseBody(response) {
	if (!response.bodyUsed) await response.body?.cancel().catch(() => void 0);
}
async function readLiveModelCatalogJson(response, timeoutMs) {
	const buffer = await readResponseWithLimit(response, LIVE_MODEL_CATALOG_BODY_MAX_BYTES, {
		chunkTimeoutMs: timeoutMs,
		onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`Live model catalog response exceeded ${maxBytes} bytes (${size} bytes received)`),
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Live model catalog response stalled: no data received for ${chunkTimeoutMs}ms`)
	});
	return JSON.parse(new TextDecoder().decode(buffer));
}
async function fetchLiveProviderModelRows(params) {
	const fetchGuard = params.fetchGuard ?? fetchWithSsrFGuard;
	const timeoutMs = params.timeoutMs ?? 5e3;
	const { response, release } = await fetchGuard({
		url: params.endpoint,
		init: { headers: buildHeaders(params) },
		signal: params.signal,
		timeoutMs,
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
		return (params.readRows ?? readDefaultLiveModelCatalogRows)(await readLiveModelCatalogJson(response, timeoutMs));
	} finally {
		await release();
	}
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
	const readModelId = params.readModelId ?? readDefaultLiveModelId;
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
function buildProviderConfig(params, models) {
	return {
		...params.providerConfig,
		...params.apiKey ? { apiKey: params.apiKey } : {},
		models: [...models]
	};
}
async function buildLiveModelProviderConfig(params) {
	try {
		const liveModelIds = await getCachedLiveCatalogValue({
			keyParts: params.cacheKeyParts ?? [
				params.providerId,
				"models",
				params.endpoint,
				liveModelCatalogAuthCacheKey(params)
			],
			ttlMs: params.ttlMs,
			load: async () => await fetchLiveProviderModelIds(params),
			shouldCache: (modelIds) => modelIds.length > 0
		});
		const liveModelIdSet = new Set(liveModelIds);
		const models = params.models.filter((model) => liveModelIdSet.has(model.id));
		if (models.length > 0) return buildProviderConfig(params, models);
	} catch {}
	return buildProviderConfig(params, params.models);
}
//#endregion
export { getCachedLiveProviderModelRows as a, fetchLiveProviderModelRows as i, buildLiveModelProviderConfig as n, fetchLiveProviderModelIds as r, LiveModelCatalogHttpError as t };
