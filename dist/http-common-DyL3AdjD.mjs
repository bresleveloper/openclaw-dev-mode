import { Mg as buildMissingScopeErrorDetails } from "./src-pLJQA6J5.mjs";
import { y as retainGatewayRootWorkAdmissionContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import { n as PROXY_ATTRIBUTION_REQUIRED_REASON } from "./ingress-attribution-CP_2XS9r.mjs";
import { c as clearHttpResponseRepresentationHeaders, f as sendHttpRequestRejection } from "./http-body-DZQjJc2J.mjs";
import { p as readJsonBody } from "./hooks-C6wwC8eA.mjs";
import { n as logRejectedLargePayload, r as parseContentLengthHeader } from "./diagnostic-payload-BJUCTxkN.mjs";
import { i as respondPlainText } from "./control-ui-http-utils-CpDIFFwm.mjs";
//#region src/gateway/http-common.ts
/**
* Apply baseline security headers that are safe for all response types (API JSON,
* HTML pages, static assets, SSE streams). Headers that restrict framing or set a
* Content-Security-Policy are intentionally omitted here because some handlers
* (canvas host, A2UI) serve content that may be loaded inside frames.
*/
function setDefaultSecurityHeaders(res, opts) {
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("Referrer-Policy", "no-referrer");
	res.setHeader("Permissions-Policy", "camera=(), microphone=(self), geolocation=()");
	const strictTransportSecurity = typeof opts?.strictTransportSecurity === "string" ? opts.strictTransportSecurity.trim() : void 0;
	if (typeof strictTransportSecurity === "string" && strictTransportSecurity.length > 0) res.setHeader("Strict-Transport-Security", strictTransportSecurity);
}
/** Prepare an unsent error response; committed responses can only be closed. */
function prepareGatewayHttpErrorResponse(res, statusMessage) {
	if (res.destroyed || res.writableEnded) return false;
	if (res.headersSent) {
		res.destroy();
		return false;
	}
	clearHttpResponseRepresentationHeaders(res);
	res.removeHeader("Content-Length");
	res.setHeader("Cache-Control", "no-store");
	res.statusMessage = statusMessage;
	return true;
}
/** Finish a failed request without rewriting committed headers or orphaning its transport. */
function finishFailedGatewayHttpResponse(res) {
	if (prepareGatewayHttpErrorResponse(res, "Internal Server Error")) respondPlainText(res, 500, res.statusMessage);
}
function sendJson(res, status, body) {
	res.statusCode = status;
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.end(JSON.stringify(body));
}
function sendMethodNotAllowed(res, allow = "POST") {
	res.setHeader("Allow", allow);
	respondPlainText(res, 405, "Method Not Allowed");
}
function sendUnauthorized(res) {
	if (!prepareGatewayHttpErrorResponse(res, "Unauthorized")) return;
	res.removeHeader("Set-Cookie");
	sendJson(res, 401, { error: {
		message: "Unauthorized",
		type: "unauthorized"
	} });
}
function sendRateLimited(res, retryAfterMs) {
	if (retryAfterMs && retryAfterMs > 0) res.setHeader("Retry-After", String(Math.ceil(retryAfterMs / 1e3)));
	sendJson(res, 429, { error: {
		message: "Too many failed authentication attempts. Please try again later.",
		type: "rate_limited"
	} });
}
function sendGatewayAuthFailure(res, authResult) {
	if (authResult.rateLimited) {
		sendRateLimited(res, authResult.retryAfterMs);
		return;
	}
	if (authResult.reason === "proxy_attribution_required") {
		sendJson(res, 403, { error: {
			message: "Proxy client attribution is required. Configure gateway.trustedProxies narrowly and make the proxy overwrite or safely rebuild forwarded client headers.",
			type: PROXY_ATTRIBUTION_REQUIRED_REASON
		} });
		return;
	}
	sendUnauthorized(res);
}
function sendInvalidRequest(res, message) {
	sendJson(res, 400, { error: {
		message,
		type: "invalid_request_error"
	} });
}
function parseGatewayJsonRequest(res, body, schema) {
	const parsed = schema.safeParse(body);
	if (parsed.success) return parsed.data;
	const issue = parsed.error.issues[0];
	sendInvalidRequest(res, issue ? `${issue.path.join(".")}: ${issue.message}` : "Invalid request body");
}
function sendMissingScopeForbidden(res, missingScope) {
	const details = typeof missingScope === "string" && missingScope.length > 0 ? buildMissingScopeErrorDetails({
		missingScope,
		requiredScopes: [missingScope]
	}) : void 0;
	sendJson(res, 403, {
		ok: false,
		error: {
			type: "forbidden",
			message: `missing scope: ${missingScope}`,
			...details ? { details } : {}
		}
	});
}
async function readJsonBodyOrError(req, res, maxBytes, timeoutMs) {
	const body = await readJsonBody(req, maxBytes, timeoutMs);
	if (!body.ok) {
		if (body.error === "payload too large") {
			const contentLength = parseContentLengthHeader(req.headers?.["content-length"]);
			logRejectedLargePayload({
				surface: "gateway.http.json",
				limitBytes: maxBytes,
				reason: "json_body_limit",
				...contentLength !== void 0 ? { bytes: contentLength } : {}
			});
		}
		if (body.error === "payload too large" || body.error === "request body timeout") {
			const tooLarge = body.error === "payload too large";
			await sendHttpRequestRejection(req, res, tooLarge ? 413 : 408, JSON.stringify({ error: {
				message: tooLarge ? "Payload too large" : "Request body timeout",
				type: "invalid_request_error"
			} }), "application/json; charset=utf-8");
			return;
		}
		sendInvalidRequest(res, body.error);
		return;
	}
	return body.value;
}
function writeDone(res) {
	res.write("data: [DONE]\n\n");
}
const SSE_CONTENT_TYPE = "text/event-stream; charset=utf-8";
function setSseHeaders(res) {
	res.statusCode = 200;
	res.setHeader("Content-Type", SSE_CONTENT_TYPE);
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");
	res.flushHeaders?.();
}
/** Deferred delivery retains request admission independently of agent settlement. */
function retainGatewayHttpResponseWork(res) {
	const releaseRootWork = retainGatewayRootWorkAdmissionContinuation();
	const release = () => {
		res.off("finish", release);
		res.off("close", release);
		releaseRootWork?.();
	};
	res.once("finish", release);
	res.once("close", release);
	if (res.destroyed || res.writableFinished) release();
	return release;
}
/** Abort reason used when the HTTP client disconnects before delivery. */
var ClientDisconnectError = class extends Error {
	constructor() {
		super("HTTP client disconnected");
		this.name = "ClientDisconnectError";
	}
};
function watchClientDisconnect(req, res, abortController, onDisconnect) {
	const sockets = Array.from(new Set([req.socket, res.socket].filter((socket) => socket !== null)));
	const stopWatchingDisconnect = () => {
		for (const socket of sockets) socket.off("close", handleClose);
		res.off("finish", stopWatchingDisconnect);
	};
	const handleClose = () => {
		stopWatchingDisconnect();
		onDisconnect?.();
		if (!abortController.signal.aborted) abortController.abort(new ClientDisconnectError());
	};
	const handleResponseClose = () => {
		res.off("error", handleClose);
		if (!res.writableFinished) {
			handleClose();
			return;
		}
		stopWatchingDisconnect();
	};
	res.on("error", handleClose);
	res.once("close", handleResponseClose);
	res.once("finish", stopWatchingDisconnect);
	if (res.destroyed || sockets.some((socket) => socket.destroyed)) {
		handleClose();
		return () => {};
	}
	for (const socket of sockets) socket.on("close", handleClose);
	return stopWatchingDisconnect;
}
function isWebSocketUpgradeRequest(req) {
	const headerContains = (value, token) => (typeof value === "string" ? [value] : value ?? []).some((entry) => entry.toLowerCase().split(",").some((part) => part.trim() === token));
	return headerContains(req.headers.upgrade, "websocket") && headerContains(req.headers.connection, "upgrade");
}
//#endregion
export { watchClientDisconnect as _, prepareGatewayHttpErrorResponse as a, sendGatewayAuthFailure as c, sendMethodNotAllowed as d, sendMissingScopeForbidden as f, setSseHeaders as g, setDefaultSecurityHeaders as h, parseGatewayJsonRequest as i, sendInvalidRequest as l, sendUnauthorized as m, finishFailedGatewayHttpResponse as n, readJsonBodyOrError as o, sendRateLimited as p, isWebSocketUpgradeRequest as r, retainGatewayHttpResponseWork as s, SSE_CONTENT_TYPE as t, sendJson as u, writeDone as v };
