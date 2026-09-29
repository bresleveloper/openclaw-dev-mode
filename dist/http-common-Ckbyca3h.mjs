import { n as PROXY_ATTRIBUTION_REQUIRED_REASON } from "./ingress-attribution-C5e071om.mjs";
import { d as buildMissingScopeErrorDetails } from "./error-codes-DvB36bCj.mjs";
import { o as sendHttpRequestRejection, t as clearHttpResponseRepresentationHeaders } from "./http-request-lifecycle-JdoSg2uH.mjs";
import { n as logRejectedLargePayload, r as parseContentLengthHeader } from "./diagnostic-payload-CxhAhghE.mjs";
import { r as splitHttpHeaderValue } from "./http-header-value-Be14tJQx.mjs";
import { f as readJsonBody } from "./hooks-BXb-LCk7.mjs";
//#region src/gateway/http-media-range.ts
const HTTP_TOKEN_PATTERN = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/u;
const HTTP_QVALUE_PATTERN = /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/u;
const HTTP_OPTIONAL_WHITESPACE_PATTERN = /^[\t ]+|[\t ]+$/gu;
function trimHttpOptionalWhitespace(value) {
	return value.replace(HTTP_OPTIONAL_WHITESPACE_PATTERN, "");
}
function parseParameterValue(value) {
	if (HTTP_TOKEN_PATTERN.test(value)) return value;
	if (value.length < 2 || value[0] !== "\"" || value.at(-1) !== "\"") return null;
	let parsed = "";
	let escaped = false;
	for (let index = 1; index < value.length - 1; index += 1) {
		const character = value[index];
		if (escaped) {
			parsed += character;
			escaped = false;
			continue;
		}
		if (character === "\\") {
			escaped = true;
			continue;
		}
		if (character === "\"") return null;
		parsed += character;
	}
	return escaped ? null : parsed;
}
function normalizeParameterValue(name, value) {
	return name === "charset" ? value.toLowerCase() : value;
}
function parseMediaType(value, allowQuality) {
	const segments = splitHttpHeaderValue(value, ";", "quoted-string");
	if (!segments) return null;
	const [type, subtype, ...extra] = trimHttpOptionalWhitespace(segments.shift() ?? "").toLowerCase().split("/");
	if (extra.length > 0 || !type || !subtype || !HTTP_TOKEN_PATTERN.test(type) || !HTTP_TOKEN_PATTERN.test(subtype)) return null;
	let quality = 1;
	let qualitySeen = false;
	const parameters = /* @__PURE__ */ new Map();
	for (const rawParameter of segments) {
		const parameter = trimHttpOptionalWhitespace(rawParameter);
		if (!parameter) continue;
		const separator = parameter.indexOf("=");
		const name = (separator < 0 ? parameter : parameter.slice(0, separator)).toLowerCase();
		if (!HTTP_TOKEN_PATTERN.test(name)) return null;
		if (separator <= 0) return null;
		const rawValue = parameter.slice(separator + 1);
		if (!rawValue) return null;
		if (name === "q") {
			if (!allowQuality || qualitySeen || !HTTP_QVALUE_PATTERN.test(rawValue)) return null;
			qualitySeen = true;
			quality = Number(rawValue);
			continue;
		}
		const parameterValue = parseParameterValue(rawValue);
		if (parameterValue === null || parameters.has(name)) return null;
		parameters.set(name, normalizeParameterValue(name, parameterValue));
	}
	return {
		type,
		subtype,
		parameters,
		quality
	};
}
function matchesRepresentation(range, representation, allowWildcards) {
	const exact = range.type === representation.type && range.subtype === representation.subtype;
	const wildcard = allowWildcards && range.subtype === "*" && (range.type === "*" || range.type === representation.type);
	if (!exact && !wildcard) return false;
	for (const [name, value] of range.parameters) if (representation.parameters.get(name) !== value) return false;
	return true;
}
/** Checks the quality of the most specific range matching the offered representation. */
function acceptsMediaType(accept, expectedRepresentation, allowWildcards = true) {
	if (!accept) return false;
	const representation = parseMediaType(expectedRepresentation, false);
	if (!representation) return false;
	const ranges = splitHttpHeaderValue(accept, ",", "quoted-string");
	if (!ranges) return false;
	let bestMediaSpecificity = -1;
	let bestParameterSpecificity = -1;
	let bestQuality = 0;
	for (const range of ranges) {
		const parsedRange = parseMediaType(range, true);
		if (!parsedRange || !matchesRepresentation(parsedRange, representation, allowWildcards)) continue;
		const mediaSpecificity = parsedRange.type === "*" ? 0 : parsedRange.subtype === "*" ? 1 : 2;
		const parameterSpecificity = parsedRange.parameters.size;
		const comparison = mediaSpecificity - bestMediaSpecificity || parameterSpecificity - bestParameterSpecificity;
		if (comparison > 0) {
			bestMediaSpecificity = mediaSpecificity;
			bestParameterSpecificity = parameterSpecificity;
			bestQuality = parsedRange.quality;
		} else if (comparison === 0) bestQuality = Math.max(bestQuality, parsedRange.quality);
	}
	return bestQuality > 0;
}
/** Wildcards cannot opt callers into long-lived streaming responses. */
function hasExplicitAcceptableMediaRange(accept, expectedRepresentation) {
	return acceptsMediaType(accept, expectedRepresentation, false);
}
//#endregion
//#region src/gateway/control-ui-http-utils.ts
/** Returns true for idempotent HTTP methods that can read Control UI assets. */
function isReadHttpMethod(method) {
	return method === "GET" || method === "HEAD";
}
/** Returns whether an Accept header permits an HTML document response. */
function acceptsControlUiHtmlResponse(accept) {
	const normalized = accept?.trim();
	if (!normalized) return true;
	return acceptsMediaType(normalized, "text/html; charset=utf-8") || hasExplicitAcceptableMediaRange(normalized, "application/xhtml+xml");
}
/** Sends a plain-text response with the standard UTF-8 content type. */
function respondPlainText(res, statusCode, body) {
	res.statusCode = statusCode;
	res.setHeader("Content-Type", "text/plain; charset=utf-8");
	if (statusCode !== 204) res.setHeader("Content-Length", String(Buffer.byteLength(body)));
	res.end(body);
}
/** Sends the shared plain-text 404 response for Control UI routes. */
function respondNotFound(res) {
	respondPlainText(res, 404, "Not Found");
}
//#endregion
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
/** Finish a failed request without rewriting committed headers or orphaning its transport. */
function finishFailedGatewayHttpResponse(res) {
	if (res.destroyed || res.writableEnded) return;
	if (!res.headersSent) {
		clearHttpResponseRepresentationHeaders(res);
		res.setHeader("Cache-Control", "no-store");
		res.statusMessage = "Internal Server Error";
		respondPlainText(res, 500, res.statusMessage);
		return;
	}
	res.destroy();
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
function buildMissingScopeForbiddenBody(missingScope, requiredScopes) {
	const details = typeof missingScope === "string" && missingScope.length > 0 ? buildMissingScopeErrorDetails({
		missingScope,
		requiredScopes: requiredScopes ?? [missingScope]
	}) : void 0;
	return {
		ok: false,
		error: {
			type: "forbidden",
			message: `missing scope: ${missingScope}`,
			...details ? { details } : {}
		}
	};
}
function sendMissingScopeForbidden(res, missingScope, requiredScopes) {
	sendJson(res, 403, buildMissingScopeForbiddenBody(missingScope, requiredScopes));
}
async function readJsonBodyOrError(req, res, maxBytes) {
	const body = await readJsonBody(req, maxBytes);
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
/** Abort reason used when the HTTP client disconnects before delivery. */
var ClientDisconnectError = class extends Error {
	constructor(message = "HTTP client disconnected") {
		super(message);
		this.name = "ClientDisconnectError";
	}
};
function watchClientDisconnect(req, res, abortController, onDisconnect) {
	const sockets = Array.from(new Set([req.socket, res.socket].filter((socket) => socket !== null)));
	if (sockets.length === 0) return () => {};
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
export { acceptsControlUiHtmlResponse as _, readJsonBodyOrError as a, respondPlainText as b, sendJson as c, sendRateLimited as d, sendUnauthorized as f, writeDone as g, watchClientDisconnect as h, parseGatewayJsonRequest as i, sendMethodNotAllowed as l, setSseHeaders as m, finishFailedGatewayHttpResponse as n, sendGatewayAuthFailure as o, setDefaultSecurityHeaders as p, isWebSocketUpgradeRequest as r, sendInvalidRequest as s, SSE_CONTENT_TYPE as t, sendMissingScopeForbidden as u, isReadHttpMethod as v, hasExplicitAcceptableMediaRange as x, respondNotFound as y };
