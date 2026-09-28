import { j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./origin-check-Dh0t_-zy.mjs";
import { o as sendHttpRequestRejection, r as isHttpConnectionClosing, s as waitForHttpRequestRejection } from "./http-request-lifecycle-JdoSg2uH.mjs";
import { a as isRequestBodyLimitError, c as requestBodyErrorToText, o as readJsonBodyWithLimit, s as readRequestBodyWithLimit } from "./http-body-Bl_jph25.mjs";
import { x as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-CHv_0noy.mjs";
//#region src/plugin-sdk/webhook-request-guards.ts
/** Default webhook body size/time limits for pre-auth and post-auth reads. */
const WEBHOOK_BODY_READ_DEFAULTS = Object.freeze({
	preAuth: {
		maxBytes: 65536,
		timeoutMs: 5e3
	},
	postAuth: {
		maxBytes: 1048576,
		timeoutMs: 3e4
	},
	postAuthResponseFirst: {
		maxBytes: 1048576,
		timeoutMs: 3e4,
		destroyOnLimit: false
	}
});
/** Default in-flight concurrency limits for webhook request pipelines. */
const WEBHOOK_IN_FLIGHT_DEFAULTS = Object.freeze({
	maxInFlightPerKey: 8,
	maxTrackedKeys: 4096
});
function resolveWebhookBodyReadLimits(params) {
	const defaults = params.profile === "pre-auth" ? WEBHOOK_BODY_READ_DEFAULTS.preAuth : WEBHOOK_BODY_READ_DEFAULTS.postAuth;
	return {
		maxBytes: typeof params.maxBytes === "number" && Number.isFinite(params.maxBytes) && params.maxBytes > 0 ? Math.floor(params.maxBytes) : defaults.maxBytes,
		timeoutMs: typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs) && params.timeoutMs > 0 ? Math.floor(params.timeoutMs) : defaults.timeoutMs
	};
}
async function respondWebhookBodyReadError(params) {
	const { req, res, code, invalidMessage, invalidStatusCode } = params;
	if (code === "PAYLOAD_TOO_LARGE" || code === "REQUEST_BODY_TIMEOUT") {
		await sendHttpRequestRejection(req, res, code === "PAYLOAD_TOO_LARGE" ? 413 : 408, requestBodyErrorToText(code));
		return { ok: false };
	}
	const rejection = waitForHttpRequestRejection(req);
	if (rejection) {
		await rejection;
		return { ok: false };
	}
	if (code === "CONNECTION_CLOSED") {
		res.statusCode = 400;
		res.end(requestBodyErrorToText("CONNECTION_CLOSED"));
		return { ok: false };
	}
	res.statusCode = invalidStatusCode ?? 400;
	res.end(invalidMessage ?? "Bad Request");
	return { ok: false };
}
/** Create an in-memory limiter that caps concurrent webhook handlers per key. */
function createWebhookInFlightLimiter(options) {
	const maxInFlightPerKey = resolveIntegerOption(options?.maxInFlightPerKey, WEBHOOK_IN_FLIGHT_DEFAULTS.maxInFlightPerKey, { min: 1 });
	const maxTrackedKeys = resolveIntegerOption(options?.maxTrackedKeys, WEBHOOK_IN_FLIGHT_DEFAULTS.maxTrackedKeys, { min: 1 });
	const active = /* @__PURE__ */ new Map();
	return {
		tryAcquire: (key) => {
			if (!key) return true;
			const current = active.get(key) ?? 0;
			if (current >= maxInFlightPerKey) return false;
			active.set(key, current + 1);
			pruneMapToMaxSize(active, maxTrackedKeys);
			return true;
		},
		release: (key) => {
			if (!key) return;
			const current = active.get(key);
			if (current === void 0) return;
			if (current <= 1) {
				active.delete(key);
				return;
			}
			active.set(key, current - 1);
		},
		size: () => active.size,
		clear: () => active.clear()
	};
}
/** Detect JSON content types, including structured syntax suffixes like `application/ld+json`. */
function isJsonContentType(value) {
	const first = Array.isArray(value) ? value[0] : value;
	if (!first) return false;
	const mediaType = normalizeOptionalLowercaseString(first.split(";", 1)[0]);
	return mediaType === "application/json" || Boolean(mediaType?.endsWith("+json"));
}
/** Apply method, rate-limit, and content-type guards before a webhook handler reads the body. */
function applyBasicWebhookRequestGuards(params) {
	if (isHttpConnectionClosing(params.req.socket)) return false;
	const allowMethods = params.allowMethods?.length ? params.allowMethods : null;
	if (allowMethods && !allowMethods.includes(params.req.method ?? "")) {
		params.res.statusCode = 405;
		params.res.setHeader("Allow", allowMethods.join(", "));
		params.res.end("Method Not Allowed");
		return false;
	}
	if (params.rateLimiter && params.rateLimitKey && params.rateLimiter.isRateLimited(params.rateLimitKey, params.nowMs ?? Date.now())) {
		params.res.statusCode = 429;
		params.res.end("Too Many Requests");
		return false;
	}
	if (params.requireJsonContentType && params.req.method === "POST" && !isJsonContentType(params.req.headers["content-type"])) {
		params.res.statusCode = 415;
		params.res.end("Unsupported Media Type");
		return false;
	}
	return true;
}
/** Start the shared webhook request lifecycle and return a release hook for in-flight tracking. */
function beginWebhookRequestPipelineOrReject(params) {
	if (!applyBasicWebhookRequestGuards({
		req: params.req,
		res: params.res,
		allowMethods: params.allowMethods,
		rateLimiter: params.rateLimiter,
		rateLimitKey: params.rateLimitKey,
		nowMs: params.nowMs,
		requireJsonContentType: params.requireJsonContentType
	})) return { ok: false };
	const inFlightKey = params.inFlightKey ?? "";
	const inFlightLimiter = params.inFlightLimiter;
	if (inFlightLimiter && inFlightKey && !inFlightLimiter.tryAcquire(inFlightKey)) {
		params.res.statusCode = params.inFlightLimitStatusCode ?? 429;
		params.res.end(params.inFlightLimitMessage ?? "Too Many Requests");
		return { ok: false };
	}
	let released = false;
	return {
		ok: true,
		release: () => {
			if (released) return;
			released = true;
			if (inFlightLimiter && inFlightKey) {
				const closed = waitForHttpRequestRejection(params.req);
				if (closed) closed.then(() => inFlightLimiter.release(inFlightKey));
				else inFlightLimiter.release(inFlightKey);
			}
		}
	};
}
/**
* Run post-ack webhook processing on its own admitted gateway work root with
* an independently owned async work scope.
*
* Ack-first handlers respond before processing events, so the continued work
* outlives the HTTP request admission it inherited; once that admission is
* released, queue enqueues from the inherited chain are refused as if the
* gateway were draining. Call this synchronously from the request handler
* (while the request is still admitted): it reserves an independent root that
* keeps the detached processing accepted and lets a restart drain wait for it.
* The callback also runs inside a fresh detached async work scope, so work
* started here (for example deferred embedded-agent runs) keeps tracking even
* after the caller's own scope closes.
*/
function runDetachedWebhookWork(run) {
	return runWithGatewayDetachedWorkContinuation(async () => {
		await Promise.resolve();
		return await run();
	}, "webhook:detached");
}
/** Read a webhook request body with bounded size/time limits and translate failures into responses. */
async function readWebhookBodyOrReject(params) {
	const limits = resolveWebhookBodyReadLimits({
		maxBytes: params.maxBytes,
		timeoutMs: params.timeoutMs,
		profile: params.profile
	});
	try {
		return {
			ok: true,
			value: await readRequestBodyWithLimit(params.req, {
				...limits,
				destroyOnLimit: false
			})
		};
	} catch (error) {
		if (isRequestBodyLimitError(error)) return respondWebhookBodyReadError({
			req: params.req,
			res: params.res,
			code: error.code,
			invalidMessage: params.invalidBodyMessage
		});
		return respondWebhookBodyReadError({
			req: params.req,
			res: params.res,
			code: "INVALID_BODY",
			invalidMessage: params.invalidBodyMessage ?? formatErrorMessage(error)
		});
	}
}
/** Read and parse a JSON webhook body, rejecting malformed or oversized payloads consistently. */
async function readJsonWebhookBodyOrReject(params) {
	const limits = resolveWebhookBodyReadLimits({
		maxBytes: params.maxBytes,
		timeoutMs: params.timeoutMs,
		profile: params.profile
	});
	const body = await readJsonBodyWithLimit(params.req, {
		maxBytes: limits.maxBytes,
		timeoutMs: limits.timeoutMs,
		emptyObjectOnEmpty: params.emptyObjectOnEmpty,
		destroyOnLimit: false
	});
	if (body.ok) return {
		ok: true,
		value: body.value
	};
	return respondWebhookBodyReadError({
		req: params.req,
		res: params.res,
		code: body.code,
		invalidMessage: params.invalidJsonMessage,
		invalidStatusCode: params.invalidJsonStatusCode
	});
}
//#endregion
export { createWebhookInFlightLimiter as a, readWebhookBodyOrReject as c, beginWebhookRequestPipelineOrReject as i, runDetachedWebhookWork as l, WEBHOOK_IN_FLIGHT_DEFAULTS as n, isJsonContentType as o, applyBasicWebhookRequestGuards as r, readJsonWebhookBodyOrReject as s, WEBHOOK_BODY_READ_DEFAULTS as t };
