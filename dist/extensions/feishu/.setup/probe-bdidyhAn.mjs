import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { r as createFeishuClient } from "./client-DCwNVFZg.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { asDateTimestampMs, resolveExpiresAtMsFromDurationMs, resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { createHash } from "node:crypto";
//#region extensions/feishu/src/async.ts
const RACE_TIMEOUT = Symbol("race-timeout");
const RACE_ABORT = Symbol("race-abort");
async function raceWithTimeoutAndAbort(promise, options = {}) {
	if (options.abortSignal?.aborted) return { status: "aborted" };
	if (options.timeoutMs === void 0 && !options.abortSignal) return {
		status: "resolved",
		value: await promise
	};
	let timeoutHandle;
	let abortHandler;
	const contenders = [promise];
	if (options.timeoutMs !== void 0) {
		const timeoutMs = resolveTimerTimeoutMs(options.timeoutMs, 1);
		contenders.push(new Promise((resolve) => {
			timeoutHandle = setTimeout(() => resolve(RACE_TIMEOUT), timeoutMs);
		}));
	}
	if (options.abortSignal) contenders.push(new Promise((resolve) => {
		abortHandler = () => resolve(RACE_ABORT);
		options.abortSignal?.addEventListener("abort", abortHandler, { once: true });
	}));
	try {
		const result = await Promise.race(contenders);
		if (result === RACE_TIMEOUT) return { status: "timeout" };
		if (result === RACE_ABORT) return { status: "aborted" };
		return {
			status: "resolved",
			value: result
		};
	} finally {
		if (timeoutHandle) clearTimeout(timeoutHandle);
		if (abortHandler) options.abortSignal?.removeEventListener("abort", abortHandler);
	}
}
function waitForAbortableDelay(delayMs, abortSignal) {
	if (abortSignal?.aborted) return Promise.resolve(false);
	return new Promise((resolve) => {
		let settled = false;
		let timer = void 0;
		const finish = (value) => {
			if (settled) return;
			settled = true;
			if (timer) clearTimeout(timer);
			if (handleAbort) abortSignal?.removeEventListener("abort", handleAbort);
			resolve(value);
		};
		const handleAbort = () => {
			finish(false);
		};
		abortSignal?.addEventListener("abort", handleAbort, { once: true });
		if (abortSignal?.aborted) {
			finish(false);
			return;
		}
		timer = setTimeout(() => finish(true), resolveTimerTimeoutMs(delayMs, 1));
		timer.unref?.();
	});
}
//#endregion
//#region extensions/feishu/src/probe.ts
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
	const expiresAt = resolveExpiresAtMsFromDurationMs(ttlMs);
	if (expiresAt === void 0) {
		probeCache.delete(cacheKey);
		return result;
	}
	probeCache.set(cacheKey, {
		result,
		expiresAt
	});
	if (probeCache.size > MAX_PROBE_CACHE_SIZE) {
		const oldest = probeCache.keys().next().value;
		if (oldest !== void 0) probeCache.delete(oldest);
	}
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
		error: "probe aborted"
	};
	const timeoutMs = options.timeoutMs ?? FEISHU_PROBE_REQUEST_TIMEOUT_MS;
	const cacheKey = buildProbeCacheKey(creds);
	const cached = probeCache.get(cacheKey);
	if (cached) {
		const now = asDateTimestampMs(Date.now());
		const expiresAt = asDateTimestampMs(cached.expiresAt);
		if (now !== void 0 && expiresAt !== void 0 && expiresAt > now) return cached.result;
		probeCache.delete(cacheKey);
	}
	try {
		const responseResult = await raceWithTimeoutAndAbort(createFeishuClient(creds).request({
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
			error: "probe aborted"
		};
		if (responseResult.status === "timeout") return setCachedProbeResult(cacheKey, {
			ok: false,
			appId: creds.appId,
			error: `probe timed out after ${timeoutMs}ms`
		}, PROBE_ERROR_TTL_MS);
		const response = responseResult.value;
		if (options.abortSignal?.aborted) return {
			ok: false,
			appId: creds.appId,
			error: "probe aborted"
		};
		if (response.code !== 0) return setCachedProbeResult(cacheKey, {
			ok: false,
			appId: creds.appId,
			error: `API error: ${response.msg || `code ${response.code}`}`
		}, PROBE_ERROR_TTL_MS);
		const botInfo = response.bot ?? response.data?.bot;
		if (!botInfo?.open_id) return setCachedProbeResult(cacheKey, {
			ok: false,
			appId: creds.appId,
			error: "API response missing bot open_id"
		}, PROBE_ERROR_TTL_MS);
		return setCachedProbeResult(cacheKey, {
			ok: true,
			appId: creds.appId,
			botName: botInfo.app_name,
			botOpenId: botInfo.open_id
		}, PROBE_SUCCESS_TTL_MS);
	} catch (err) {
		return setCachedProbeResult(cacheKey, {
			ok: false,
			appId: creds.appId,
			error: formatErrorMessage(err)
		}, PROBE_ERROR_TTL_MS);
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
	const timeoutMs = options.timeoutMs ?? FEISHU_PROBE_REQUEST_TIMEOUT_MS;
	try {
		const responseResult = await raceWithTimeoutAndAbort(createFeishuClient(creds).request({
			method: "POST",
			url: "/open-apis/bot/v1/openclaw_bot/ping",
			data: { needBotInfo: true },
			timeout: timeoutMs
		}), {
			timeoutMs,
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
//#endregion
export { waitForAbortableDelay as a, raceWithTimeoutAndAbort as i, probe_exports as n, registerFeishuAiAgent as r, probeFeishu as t };
