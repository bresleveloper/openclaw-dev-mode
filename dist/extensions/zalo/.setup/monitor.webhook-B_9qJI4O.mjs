import { WEBHOOK_ANOMALY_COUNTER_DEFAULTS, WEBHOOK_RATE_LIMIT_DEFAULTS, applyBasicWebhookRequestGuards, createFixedWindowRateLimiter, createWebhookAnomalyTracker, registerWebhookTarget, registerWebhookTargetWithPluginRoute, resolveClientIp, resolveWebhookTargetWithAuthOrRejectSync, withResolvedWebhookRequestPipeline } from "../runtime-api.js";
import { ZaloWebhookPayloadError } from "./webhook-spool-BSTKDQ8X.mjs";
import { safeEqualSecret } from "openclaw/plugin-sdk/security-runtime";
import { readWebhookBodyOrReject } from "openclaw/plugin-sdk/webhook-request-guards";
//#region extensions/zalo/src/monitor.webhook.ts
const ZALO_WEBHOOK_ACCEPTED_HEADER = "x-openclaw-delivery-accepted";
const ZALO_WEBHOOK_ACCEPTED_VALUE = "durable";
const webhookTargets = /* @__PURE__ */ new Map();
const webhookRateLimiter = createFixedWindowRateLimiter({
	windowMs: WEBHOOK_RATE_LIMIT_DEFAULTS.windowMs,
	maxRequests: WEBHOOK_RATE_LIMIT_DEFAULTS.maxRequests,
	maxTrackedKeys: WEBHOOK_RATE_LIMIT_DEFAULTS.maxTrackedKeys
});
const webhookAnomalyTracker = createWebhookAnomalyTracker({
	maxTrackedKeys: WEBHOOK_ANOMALY_COUNTER_DEFAULTS.maxTrackedKeys,
	ttlMs: WEBHOOK_ANOMALY_COUNTER_DEFAULTS.ttlMs,
	logEvery: WEBHOOK_ANOMALY_COUNTER_DEFAULTS.logEvery
});
function clearZaloWebhookSecurityStateForTest() {
	webhookRateLimiter.clear();
	webhookAnomalyTracker.clear();
}
function getZaloWebhookStatusCounterSizeForTest() {
	return webhookAnomalyTracker.size();
}
function recordWebhookStatus(runtime, path, statusCode) {
	webhookAnomalyTracker.record({
		key: `${path}:${statusCode}`,
		statusCode,
		log: runtime?.log,
		message: (count) => `[zalo] webhook anomaly path=${path} status=${statusCode} count=${String(count)}`
	});
}
function headerValue(value) {
	return Array.isArray(value) ? value[0] : value;
}
function registerZaloWebhookTarget(target, opts) {
	if (opts?.route) return registerWebhookTargetWithPluginRoute({
		targetsByPath: webhookTargets,
		target,
		route: opts.route,
		onLastPathTargetRemoved: opts.onLastPathTargetRemoved
	}).unregister;
	return registerWebhookTarget(webhookTargets, target, opts).unregister;
}
async function handleZaloWebhookRequest(req, res) {
	return await withResolvedWebhookRequestPipeline({
		req,
		res,
		targetsByPath: webhookTargets,
		allowMethods: ["POST"],
		handle: async ({ targets, path }) => {
			const trustedProxies = targets[0]?.config.gateway?.trustedProxies;
			const allowRealIpFallback = targets[0]?.config.gateway?.allowRealIpFallback === true;
			const rateLimitKey = `${path}:${resolveClientIp({
				remoteAddr: req.socket.remoteAddress,
				forwardedFor: headerValue(req.headers["x-forwarded-for"]),
				realIp: headerValue(req.headers["x-real-ip"]),
				trustedProxies,
				allowRealIpFallback
			}) ?? req.socket.remoteAddress ?? "unknown"}`;
			if (!applyBasicWebhookRequestGuards({
				req,
				res,
				rateLimiter: webhookRateLimiter,
				rateLimitKey,
				nowMs: Date.now()
			})) {
				recordWebhookStatus(targets[0]?.runtime, path, res.statusCode);
				return true;
			}
			const headerToken = String(req.headers["x-bot-api-secret-token"] ?? "");
			const target = resolveWebhookTargetWithAuthOrRejectSync({
				targets,
				res,
				isMatch: (entry) => safeEqualSecret(entry.secret, headerToken)
			});
			if (!target) {
				recordWebhookStatus(targets[0]?.runtime, path, res.statusCode);
				return true;
			}
			if (!applyBasicWebhookRequestGuards({
				req,
				res,
				requireJsonContentType: true
			})) {
				recordWebhookStatus(target.runtime, path, res.statusCode);
				return true;
			}
			const body = await readWebhookBodyOrReject({
				req,
				res,
				maxBytes: 1048576,
				timeoutMs: 3e4,
				invalidBodyMessage: "Bad Request"
			});
			if (!body.ok) {
				recordWebhookStatus(target.runtime, path, res.statusCode);
				return true;
			}
			try {
				await target.acceptWebhook(body.value);
			} catch (error) {
				res.statusCode = error instanceof ZaloWebhookPayloadError ? 400 : 500;
				res.end(res.statusCode === 400 ? "Bad Request" : "Internal Server Error");
				recordWebhookStatus(target.runtime, path, res.statusCode);
				target.runtime.error?.(`[${target.account.accountId}] Zalo webhook admission failed: ${String(error)}`);
				return true;
			}
			res.setHeader(ZALO_WEBHOOK_ACCEPTED_HEADER, ZALO_WEBHOOK_ACCEPTED_VALUE);
			res.statusCode = 200;
			res.end("ok");
			return true;
		}
	});
}
const zaloWebhookRuntime = {
	clearZaloWebhookSecurityStateForTest,
	getZaloWebhookStatusCounterSizeForTest,
	handleZaloWebhookRequest,
	registerZaloWebhookTarget
};
//#endregion
export { zaloWebhookRuntime };
