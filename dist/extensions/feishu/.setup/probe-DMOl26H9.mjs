import { _ as __exportAll } from "./doctor-contract-ItAh0keT.mjs";
import { r as createFeishuClient } from "./client-BAiJnY41.mjs";
import { t as raceWithTimeoutAndAbort } from "./async-WkOXCAZ1.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { createHash } from "node:crypto";
// extensions/feishu/src/probe.ts
var probe_exports = /* @__PURE__ */ __exportAll({
	probeFeishu: () => probeFeishu,
	registerFeishuAiAgent: () => registerFeishuAiAgent
});
/** Cache probe results to reduce repeated health-check calls.
* Gateway health checks call probeFeishu() every minute; without caching this
* burns ~43,200 calls/month, easily exceeding Feishu's free-tier quota.
* Successful bot info is effectively static, while failures are cached briefly
* to avoid hammering the API during transient outages. */
const probeCache = /* @__PURE__ */ new Map();
const PROBE_SUCCESS_TTL_MS = 6e5;
const PROBE_ERROR_TTL_MS = 6e4;
const MAX_PROBE_CACHE_SIZE = 64;
const FEISHU_PROBE_REQUEST_TIMEOUT_MS = 1e4;
function buildProbeCacheKey(creds) {
	const identity = [
		creds.accountId ?? null,
		creds.appId,
		creds.appSecret,
		creds.domain ?? null
	];
	return createHash("sha256").update(JSON.stringify(identity)).digest("hex");
}
function setCachedProbeResult(cacheKey, result, ttlMs) {
	probeCache.set(cacheKey, {
		result,
		expiresAt: performance.now() + ttlMs
	});
	pruneMapToMaxSize(probeCache, MAX_PROBE_CACHE_SIZE);
	return result;
}
async function probeFeishu(creds, options = {}) {
	if (!creds?.appId || !creds?.appSecret) return {
		ok: false,
		error: "missing credentials (appId, appSecret)"
	};
	if (options.abortSignal?.aborted) return {
		ok: false,
		appId: creds.appId,
		error: "check aborted"
	};
	const timeoutMs = options.timeoutMs ?? FEISHU_PROBE_REQUEST_TIMEOUT_MS;
	const cacheKey = buildProbeCacheKey(creds);
	const cacheError = (error) => setCachedProbeResult(cacheKey, {
		ok: false,
		appId: creds.appId,
		error
	}, PROBE_ERROR_TTL_MS);
	const cached = probeCache.get(cacheKey);
	if (cached) {
		if (cached.expiresAt > performance.now()) return cached.result;
		probeCache.delete(cacheKey);
	}
	try {
		const client = createFeishuClient(creds);
		const responseResult = await raceWithTimeoutAndAbort(client.request({
			method: "GET",
			url: "/open-apis/bot/v3/info",
			timeout: timeoutMs
		}), {
			timeoutMs,
			abortSignal: options.abortSignal
		});
		if (responseResult.status === "aborted") return {
			ok: false,
			appId: creds.appId,
			error: "check aborted"
		};
		if (responseResult.status === "timeout") return cacheError(`check timed out after ${timeoutMs}ms`);
		const response = responseResult.value;
		if (options.abortSignal?.aborted) return {
			ok: false,
			appId: creds.appId,
			error: "check aborted"
		};
		if (response.code !== 0) return cacheError(`API error: ${response.msg || `code ${response.code}`}`);
		const botInfo = response.bot ?? response.data?.bot;
		if (!botInfo?.open_id) return cacheError("API response missing bot open_id");
		return setCachedProbeResult(cacheKey, {
			ok: true,
			appId: creds.appId,
			botName: botInfo.app_name,
			botOpenId: botInfo.open_id
		}, PROBE_SUCCESS_TTL_MS);
	} catch (err) {
		return cacheError(formatErrorMessage(err));
	}
}
/**
* Preserve Feishu's optional AI-agent registration without coupling it to health or
* identity. Monitor startup calls this once per account and never awaits it.
*/
async function registerFeishuAiAgent(creds, options = {}) {
	if (!creds?.appId || !creds?.appSecret) return {
		ok: false,
		reason: "missing-credentials"
	};
	if (options.abortSignal?.aborted) return {
		ok: false,
		reason: "aborted"
	};
	try {
		const client = createFeishuClient(creds);
		const responseResult = await raceWithTimeoutAndAbort(client.request({
			method: "POST",
			url: "/open-apis/bot/v1/openclaw_bot/ping",
			data: { needBotInfo: true },
			timeout: FEISHU_PROBE_REQUEST_TIMEOUT_MS
		}), {
			timeoutMs: FEISHU_PROBE_REQUEST_TIMEOUT_MS,
			abortSignal: options.abortSignal
		});
		if (responseResult.status === "aborted" || options.abortSignal?.aborted) return {
			ok: false,
			reason: "aborted"
		};
		if (responseResult.status === "timeout") return {
			ok: false,
			reason: "timeout"
		};
		return responseResult.value.code === 0 ? { ok: true } : {
			ok: false,
			reason: "api-error"
		};
	} catch {
		return {
			ok: false,
			reason: "request-error"
		};
	}
}
export { probe_exports as n, registerFeishuAiAgent as r, probeFeishu as t };
