import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import "./number-runtime-DBLVDypr.js";
import "./string-coerce-runtime-ZbuYDJgZ.js";
import { a as createFixedWindowRateLimiter, o as createWebhookAnomalyTracker, r as WEBHOOK_RATE_LIMIT_DEFAULTS, t as WEBHOOK_ANOMALY_COUNTER_DEFAULTS } from "./webhook-ingress-AkkdLLGY.js";
import { n as probeFeishu } from "./probe-DfgHQjhn.js";
//#region extensions/feishu/src/monitor.startup.ts
const FEISHU_STARTUP_BOT_INFO_TIMEOUT_DEFAULT_MS = 3e4;
const FEISHU_STARTUP_BOT_INFO_TIMEOUT_ENV = "OPENCLAW_FEISHU_STARTUP_PROBE_TIMEOUT_MS";
function resolveStartupProbeTimeoutMs(env = process.env) {
	const raw = env[FEISHU_STARTUP_BOT_INFO_TIMEOUT_ENV];
	if (raw) {
		const parsed = parseStrictPositiveInteger(raw);
		if (parsed !== void 0) return parsed;
		console.warn(`[feishu] ${FEISHU_STARTUP_BOT_INFO_TIMEOUT_ENV}="${raw}" is invalid; using default ${FEISHU_STARTUP_BOT_INFO_TIMEOUT_DEFAULT_MS}ms`);
	}
	return FEISHU_STARTUP_BOT_INFO_TIMEOUT_DEFAULT_MS;
}
const FEISHU_STARTUP_BOT_INFO_TIMEOUT_MS = resolveStartupProbeTimeoutMs();
function isTimeoutErrorMessage(message) {
	const lower = normalizeLowercaseStringOrEmpty(message);
	return lower.includes("timeout") || lower.includes("timed out");
}
function isAbortErrorMessage(message) {
	return normalizeLowercaseStringOrEmpty(message).includes("aborted");
}
async function fetchBotIdentityForMonitor(account, options = {}) {
	if (options.abortSignal?.aborted) return {};
	const timeoutMs = options.timeoutMs ?? FEISHU_STARTUP_BOT_INFO_TIMEOUT_MS;
	const result = await probeFeishu(account, {
		timeoutMs,
		abortSignal: options.abortSignal
	});
	if (result.ok) return {
		botOpenId: result.botOpenId,
		botName: result.botName
	};
	const probeError = result.error ?? void 0;
	if (options.abortSignal?.aborted || isAbortErrorMessage(probeError)) return {};
	if (isTimeoutErrorMessage(probeError)) (options.runtime?.error ?? console.error)(`feishu[${account.accountId}]: bot info probe timed out after ${timeoutMs}ms; continuing startup`);
	return {};
}
//#endregion
//#region extensions/feishu/src/monitor.state.ts
const wsClients = /* @__PURE__ */ new Map();
const httpServers = /* @__PURE__ */ new Map();
const botOpenIds = /* @__PURE__ */ new Map();
const botNames = /* @__PURE__ */ new Map();
const botIdentityRevisions = /* @__PURE__ */ new Map();
const FEISHU_WEBHOOK_MAX_BODY_BYTES = 64 * 1024;
const FEISHU_WEBHOOK_BODY_TIMEOUT_MS = 5e3;
const FEISHU_HTTP_SERVER_CLOSE_TIMEOUT_MS = 5e3;
const FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS = {
	windowMs: 6e4,
	maxRequests: 120,
	maxTrackedKeys: 4096
};
const FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS = {
	maxTrackedKeys: 4096,
	ttlMs: 360 * 6e4,
	logEvery: 25
};
function coercePositiveInt(value, fallback) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	const normalized = Math.floor(value);
	return normalized > 0 ? normalized : fallback;
}
function resolveFeishuWebhookRateLimitDefaultsForTest(defaults) {
	const resolved = defaults;
	return {
		windowMs: coercePositiveInt(resolved?.windowMs, FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS.windowMs),
		maxRequests: coercePositiveInt(resolved?.maxRequests, FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS.maxRequests),
		maxTrackedKeys: coercePositiveInt(resolved?.maxTrackedKeys, FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS.maxTrackedKeys)
	};
}
function resolveFeishuWebhookAnomalyDefaultsForTest(defaults) {
	const resolved = defaults;
	return {
		maxTrackedKeys: coercePositiveInt(resolved?.maxTrackedKeys, FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS.maxTrackedKeys),
		ttlMs: coercePositiveInt(resolved?.ttlMs, FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS.ttlMs),
		logEvery: coercePositiveInt(resolved?.logEvery, FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS.logEvery)
	};
}
const feishuWebhookRateLimitDefaults = resolveFeishuWebhookRateLimitDefaultsForTest(WEBHOOK_RATE_LIMIT_DEFAULTS);
const feishuWebhookAnomalyDefaults = resolveFeishuWebhookAnomalyDefaultsForTest(WEBHOOK_ANOMALY_COUNTER_DEFAULTS);
const feishuWebhookRateLimiter = createFixedWindowRateLimiter({
	windowMs: feishuWebhookRateLimitDefaults.windowMs,
	maxRequests: feishuWebhookRateLimitDefaults.maxRequests,
	maxTrackedKeys: feishuWebhookRateLimitDefaults.maxTrackedKeys
});
const feishuWebhookAnomalyTracker = createWebhookAnomalyTracker({
	maxTrackedKeys: feishuWebhookAnomalyDefaults.maxTrackedKeys,
	ttlMs: feishuWebhookAnomalyDefaults.ttlMs,
	logEvery: feishuWebhookAnomalyDefaults.logEvery
});
function readBotIdentityRevision(accountId) {
	return botIdentityRevisions.get(accountId) ?? 0;
}
function bumpBotIdentityRevision(accountId) {
	botIdentityRevisions.set(accountId, readBotIdentityRevision(accountId) + 1);
}
function captureBotIdentitySnapshot(accountId) {
	return { revision: readBotIdentityRevision(accountId) };
}
function clearFeishuBotIdentityStateIfUnchanged(accountId, snapshot) {
	if (readBotIdentityRevision(accountId) !== snapshot.revision) return;
	botOpenIds.delete(accountId);
	botNames.delete(accountId);
	bumpBotIdentityRevision(accountId);
}
function setFeishuBotIdentityState(accountId, identity) {
	botOpenIds.set(accountId, identity.botOpenId);
	if (identity.botName) botNames.set(accountId, identity.botName);
	else botNames.delete(accountId);
	bumpBotIdentityRevision(accountId);
}
function clearFeishuBotIdentityState(accountId) {
	botOpenIds.delete(accountId);
	botNames.delete(accountId);
	bumpBotIdentityRevision(accountId);
}
function isServerNotRunningError(error) {
	return error.code === "ERR_SERVER_NOT_RUNNING";
}
async function closeFeishuHttpServer(server) {
	await new Promise((resolve, reject) => {
		let settled = false;
		const settle = (err) => {
			if (settled) return;
			settled = true;
			clearTimeout(fallbackTimer);
			if (!err || isServerNotRunningError(err)) {
				resolve();
				return;
			}
			reject(err);
		};
		const fallbackTimer = setTimeout(() => {
			try {
				server.closeAllConnections();
				settle();
			} catch (err) {
				settle(err instanceof Error ? err : new Error(String(err)));
			}
		}, FEISHU_HTTP_SERVER_CLOSE_TIMEOUT_MS);
		try {
			server.close((err) => {
				settle(err);
			});
		} catch (err) {
			settle(err instanceof Error ? err : new Error(String(err)));
		}
	});
}
async function closeTrackedFeishuHttpServer(accountId, server) {
	const identitySnapshot = captureBotIdentitySnapshot(accountId);
	try {
		await closeFeishuHttpServer(server);
	} finally {
		if (httpServers.get(accountId) === server) {
			httpServers.delete(accountId);
			clearFeishuBotIdentityStateIfUnchanged(accountId, identitySnapshot);
		}
	}
}
function recordWebhookStatus(runtime, accountId, path, statusCode) {
	feishuWebhookAnomalyTracker.record({
		key: `${accountId}:${path}:${statusCode}`,
		statusCode,
		log: runtime?.log ?? console.log,
		message: (count) => `feishu[${accountId}]: webhook anomaly path=${path} status=${statusCode} count=${count}`
	});
}
//#endregion
export { clearFeishuBotIdentityState as a, httpServers as c, wsClients as d, fetchBotIdentityForMonitor as f, botOpenIds as i, recordWebhookStatus as l, FEISHU_WEBHOOK_MAX_BODY_BYTES as n, closeTrackedFeishuHttpServer as o, botNames as r, feishuWebhookRateLimiter as s, FEISHU_WEBHOOK_BODY_TIMEOUT_MS as t, setFeishuBotIdentityState as u };
