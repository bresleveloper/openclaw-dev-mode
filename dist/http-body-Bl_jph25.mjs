import { C as parseStrictNonNegativeInteger, F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { a as selectHttpRequestRejection, o as sendHttpRequestRejection, r as isHttpConnectionClosing } from "./http-request-lifecycle-JdoSg2uH.mjs";
import "./http-response-body-timeout-QllykGBC.mjs";
import "./http-response-body-DXfezLdR.mjs";
import { clearTimeout, setTimeout } from "node:timers";
//#region src/infra/http-body.ts
const DEFAULT_WEBHOOK_MAX_BODY_BYTES = 1048576;
const DEFAULT_WEBHOOK_BODY_TIMEOUT_MS = 3e4;
const DEFAULT_ERROR_MESSAGE = {
	PAYLOAD_TOO_LARGE: "PayloadTooLarge",
	REQUEST_BODY_TIMEOUT: "RequestBodyTimeout",
	CONNECTION_CLOSED: "RequestBodyConnectionClosed"
};
const DEFAULT_ERROR_STATUS_CODE = {
	PAYLOAD_TOO_LARGE: 413,
	REQUEST_BODY_TIMEOUT: 408,
	CONNECTION_CLOSED: 400
};
const DEFAULT_RESPONSE_MESSAGE = {
	PAYLOAD_TOO_LARGE: "Payload too large",
	REQUEST_BODY_TIMEOUT: "Request body timeout",
	CONNECTION_CLOSED: "Connection closed"
};
var RequestBodyLimitError = class extends Error {
	constructor(init) {
		super(init.message ?? DEFAULT_ERROR_MESSAGE[init.code]);
		this.name = "RequestBodyLimitError";
		this.code = init.code;
		this.statusCode = DEFAULT_ERROR_STATUS_CODE[init.code];
	}
};
function isRequestBodyLimitError(error, code) {
	if (!(error instanceof RequestBodyLimitError)) return false;
	if (!code) return true;
	return error.code === code;
}
function requestBodyErrorToText(code) {
	return DEFAULT_RESPONSE_MESSAGE[code];
}
function parseContentLengthHeader(req) {
	const header = req.headers["content-length"];
	const raw = Array.isArray(header) ? header[0] : header;
	if (typeof raw !== "string") return null;
	const parsed = parseStrictNonNegativeInteger(raw);
	if (parsed !== void 0) return parsed;
	return /^\d+$/.test(raw.trim()) ? Number.MAX_SAFE_INTEGER : null;
}
function resolveRequestBodyLimitValues(options) {
	return {
		maxBytes: Number.isFinite(options.maxBytes) ? Math.max(1, Math.floor(options.maxBytes)) : 1,
		timeoutMs: options.timeoutMs === void 0 ? DEFAULT_WEBHOOK_BODY_TIMEOUT_MS : resolveTimerTimeoutMs(options.timeoutMs, DEFAULT_WEBHOOK_BODY_TIMEOUT_MS)
	};
}
const testApi = { resolveRequestBodyLimitValues };
function stopRequestBodyAfterLimit(req, destroyOnLimit) {
	if (req.destroyed) return;
	if (destroyOnLimit) {
		req.destroy();
		return;
	}
	selectHttpRequestRejection(req);
}
async function readRequestBodyWithLimit(req, options) {
	const { maxBytes, timeoutMs } = resolveRequestBodyLimitValues(options);
	const encoding = options.encoding ?? "utf-8";
	const destroyOnLimit = options.destroyOnLimit !== false;
	if (isHttpConnectionClosing(req.socket)) throw new RequestBodyLimitError({ code: "CONNECTION_CLOSED" });
	const declaredLength = parseContentLengthHeader(req);
	if (declaredLength !== null && declaredLength > maxBytes) {
		const error = new RequestBodyLimitError({ code: "PAYLOAD_TOO_LARGE" });
		stopRequestBodyAfterLimit(req, destroyOnLimit);
		throw error;
	}
	return await new Promise((resolve, reject) => {
		let done = false;
		let totalBytes = 0;
		const chunks = [];
		const cleanup = () => {
			req.removeListener("data", onData);
			req.removeListener("end", onEnd);
			req.removeListener("error", onError);
			req.removeListener("close", onClose);
			clearTimeout(timer);
		};
		const finish = (cb) => {
			if (done) return;
			done = true;
			cleanup();
			cb();
		};
		const fail = (error) => {
			finish(() => reject(error));
		};
		const timer = setTimeout(() => {
			const error = new RequestBodyLimitError({ code: "REQUEST_BODY_TIMEOUT" });
			stopRequestBodyAfterLimit(req, destroyOnLimit);
			fail(error);
		}, timeoutMs);
		const onData = (chunk) => {
			if (done) return;
			const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			totalBytes += buffer.length;
			if (totalBytes > maxBytes) {
				const error = new RequestBodyLimitError({ code: "PAYLOAD_TOO_LARGE" });
				stopRequestBodyAfterLimit(req, destroyOnLimit);
				fail(error);
				return;
			}
			chunks.push(buffer);
		};
		const onEnd = () => {
			if (isHttpConnectionClosing(req.socket)) {
				fail(new RequestBodyLimitError({ code: "CONNECTION_CLOSED" }));
				return;
			}
			finish(() => resolve(chunks.length === 1 ? chunks[0].toString(encoding) : Buffer.concat(chunks).toString(encoding)));
		};
		const onError = (error) => {
			if (done) return;
			fail(error);
		};
		const onClose = () => {
			fail(new RequestBodyLimitError({ code: "CONNECTION_CLOSED" }));
		};
		req.on("data", onData);
		req.on("end", onEnd);
		req.on("error", onError);
		req.on("close", onClose);
		if (req.destroyed && !req.readableEnded) onClose();
	});
}
async function readJsonBodyWithLimit(req, options) {
	try {
		const trimmed = (await readRequestBodyWithLimit(req, options)).trim();
		if (!trimmed) {
			if (options.emptyObjectOnEmpty === false) return {
				ok: false,
				code: "INVALID_JSON",
				error: "empty payload"
			};
			return {
				ok: true,
				value: {}
			};
		}
		try {
			return {
				ok: true,
				value: JSON.parse(trimmed)
			};
		} catch (error) {
			return {
				ok: false,
				code: "INVALID_JSON",
				error: formatErrorMessage(error)
			};
		}
	} catch (error) {
		if (isRequestBodyLimitError(error)) return {
			ok: false,
			code: error.code,
			error: requestBodyErrorToText(error.code)
		};
		return {
			ok: false,
			code: "CONNECTION_CLOSED",
			error: requestBodyErrorToText("CONNECTION_CLOSED")
		};
	}
}
function installRequestBodyLimitGuard(req, res, options) {
	const { maxBytes, timeoutMs } = resolveRequestBodyLimitValues(options);
	const responseFormat = options.responseFormat ?? "json";
	const customText = options.responseText ?? {};
	let tripped = false;
	let reason = null;
	let done = false;
	let totalBytes = 0;
	const cleanup = () => {
		req.removeListener("data", onData);
		req.removeListener("end", finish);
		req.removeListener("close", finish);
		req.removeListener("error", finish);
		clearTimeout(timer);
	};
	const finish = () => {
		if (done) return;
		done = true;
		cleanup();
	};
	const respond = (error) => {
		const text = customText[error.code] ?? requestBodyErrorToText(error.code);
		const body = responseFormat === "text" ? text : JSON.stringify({ error: text });
		const contentType = responseFormat === "text" ? "text/plain" : "application/json";
		sendHttpRequestRejection(req, res, error.statusCode, body, `${contentType}; charset=utf-8`);
	};
	const trip = (error) => {
		if (tripped) return;
		tripped = true;
		reason = error.code;
		finish();
		respond(error);
	};
	const onData = (chunk) => {
		if (done) return;
		totalBytes += typeof chunk === "string" ? Buffer.byteLength(chunk) : chunk.length;
		if (totalBytes > maxBytes) trip(new RequestBodyLimitError({ code: "PAYLOAD_TOO_LARGE" }));
	};
	const timer = setTimeout(() => {
		trip(new RequestBodyLimitError({ code: "REQUEST_BODY_TIMEOUT" }));
	}, timeoutMs);
	req.on("data", onData);
	req.on("end", finish);
	req.on("close", finish);
	req.on("error", finish);
	const declaredLength = parseContentLengthHeader(req);
	if (isHttpConnectionClosing(req.socket)) {
		tripped = true;
		reason = "CONNECTION_CLOSED";
		finish();
	} else if (req.destroyed && !req.readableEnded) finish();
	else if (declaredLength !== null && declaredLength > maxBytes) trip(new RequestBodyLimitError({ code: "PAYLOAD_TOO_LARGE" }));
	return {
		dispose: finish,
		isTripped: () => tripped,
		code: () => reason
	};
}
//#endregion
export { isRequestBodyLimitError as a, requestBodyErrorToText as c, installRequestBodyLimitGuard as i, testApi as l, DEFAULT_WEBHOOK_MAX_BODY_BYTES as n, readJsonBodyWithLimit as o, RequestBodyLimitError as r, readRequestBodyWithLimit as s, DEFAULT_WEBHOOK_BODY_TIMEOUT_MS as t };
