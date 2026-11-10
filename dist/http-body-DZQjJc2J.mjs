import { C as parseStrictNonNegativeInteger, F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import "./http-response-body-timeout-eMZmV6xc.mjs";
import "./http-response-body-B70cE6fn.mjs";
import { Socket } from "node:net";
import { channel } from "node:diagnostics_channel";
import { clearTimeout, setTimeout } from "node:timers";
//#region src/infra/http-request-lifecycle.ts
const REJECTION_CLOSE_TIMEOUT_MS = 1e3;
const connections = /* @__PURE__ */ new WeakMap();
function httpRejectionTransport(socket) {
	if (!process.versions.bun) return "node";
	return socket.destroySoon === Socket.prototype.destroySoon ? "bun-native" : "bun-node";
}
/** Abort disconnected work without treating normal request/response completion as cancellation. */
function createHttpRequestAbortSignal(req, res) {
	const controller = new AbortController();
	let responseFinished = res.writableFinished;
	const abortIfRequestIncomplete = () => {
		if (!req.complete) controller.abort();
	};
	const abortIfResponseStillOpen = () => {
		if (!responseFinished) controller.abort();
	};
	const finishResponse = () => {
		responseFinished = !req.socket.destroyed;
		abortIfResponseStillOpen();
	};
	res.prependOnceListener("finish", finishResponse);
	req.once("close", abortIfRequestIncomplete);
	res.once("close", abortIfResponseStillOpen);
	if (req.destroyed && !req.complete || res.destroyed && !responseFinished) controller.abort();
	return {
		signal: controller.signal,
		cleanup: () => {
			res.off("finish", finishResponse);
			req.off("close", abortIfRequestIncomplete);
			res.off("close", abortIfResponseStillOpen);
		}
	};
}
function connectionFor(socket) {
	const existing = connections.get(socket);
	if (existing) return existing;
	const requests = /* @__PURE__ */ new Set();
	const connection = {
		requests,
		detach: () => {
			socket.off("resume", pauseQueuedInput);
			socket.off("close", onClose);
		}
	};
	connections.set(socket, connection);
	const pauseQueuedInput = () => {
		const phase = connection.rejection?.phase;
		if (requests.size > 1 || phase === "selected" || phase === "writing" || connection.rejection?.request.complete) socket.pause();
	};
	socket.on("resume", pauseQueuedInput);
	const onClose = () => {
		connection.detach();
		for (const resume of requests) resume();
	};
	socket.once("close", onClose);
	return connection;
}
/** Closing is selected before any ordered response write can reach the socket. */
function isHttpConnectionClosing(socket) {
	return socket.destroyed || socket.writableEnded || Boolean(connections.get(socket)?.rejection);
}
/**
* Serialize application admission, not Node's response writes. A later request
* must not cross async routing/auth while an earlier body can still be rejected.
* Already admitted work finishes; queued work is never dispatched after closure.
*/
async function runHttpConnectionRequest(req, run, response) {
	const socket = req.socket;
	if (isHttpConnectionClosing(socket)) {
		socket.pause();
		return;
	}
	const connection = connectionFor(socket);
	const queued = connection.requests.size > 0;
	const ready = createDeferredCore();
	connection.requests.add(ready.resolve);
	try {
		if (queued) {
			socket.pause();
			await ready.promise;
		}
		if (!isHttpConnectionClosing(socket)) {
			if (response === "upgrade") {
				connection.requests.delete(ready.resolve);
				connection.detach();
				connections.delete(socket);
				return await run();
			}
			await run();
			const res = response;
			if (res && !res.writableFinished && !res.destroyed && !socket.destroyed) {
				const responseDone = createDeferredCore();
				res.once("finish", responseDone.resolve);
				res.once("close", responseDone.resolve);
				socket.once("close", responseDone.resolve);
				await responseDone.promise;
				res.off("finish", responseDone.resolve);
				res.off("close", responseDone.resolve);
				socket.off("close", responseDone.resolve);
			}
		}
	} finally {
		if (connections.get(socket) === connection) {
			connection.requests.delete(ready.resolve);
			if (connection.requests.size <= 1 && !isHttpConnectionClosing(socket)) socket.resume();
			connection.requests.values().next().value?.();
		}
	}
}
/** Keep security/CORS headers, but discard metadata for an abandoned representation. */
function clearHttpResponseRepresentationHeaders(res) {
	for (const header of [
		"Content-Encoding",
		"Content-Disposition",
		"Content-Range",
		"Content-Language",
		"Content-Location",
		"Content-Type",
		"ETag",
		"Last-Modified",
		"Transfer-Encoding",
		"Trailer"
	]) res.removeHeader(header);
}
/** Fence synchronously at the byte/time limit, before a reader rejects its promise. */
function selectHttpRequestRejection(req) {
	const socket = req.socket;
	const connection = connectionFor(socket);
	if (connection.rejection) return connection.rejection;
	const completion = createDeferredCore();
	const rejection = {
		request: req,
		phase: "selected",
		closed: completion.promise,
		destroy: () => socket.destroy()
	};
	connection.rejection = rejection;
	for (const resume of connection.requests) resume();
	req.pause();
	socket.pause();
	const pauseCompletedRequest = () => {
		if (req.complete) socket.pause();
	};
	req.on("readable", pauseCompletedRequest);
	const timer = setTimeout(rejection.destroy, REJECTION_CLOSE_TIMEOUT_MS);
	timer.unref();
	const detachRequestError = () => req.off("error", rejection.destroy);
	req.once("close", detachRequestError);
	const onClose = () => {
		rejection.phase = "closed";
		clearTimeout(timer);
		req.off("close", detachRequestError);
		req.off("readable", pauseCompletedRequest);
		socket.off("error", rejection.destroy);
		queueMicrotask(detachRequestError);
		completion.resolve();
	};
	req.on("error", rejection.destroy);
	socket.on("error", rejection.destroy);
	socket.once("close", onClose);
	if (socket.destroyed) {
		socket.off("close", onClose);
		onClose();
	}
	return rejection;
}
/** Preserve the caller's error representation and security headers until half-close. */
async function sendHttpRequestRejection(req, res, statusCode, body, contentType) {
	const rejection = selectHttpRequestRejection(req);
	if (rejection.request !== req || rejection.phase !== "selected") return await rejection.closed;
	if (res.headersSent || res.destroyed || res.writableEnded) {
		rejection.destroy();
		return await rejection.closed;
	}
	const socket = req.socket;
	const onResponseClose = () => {
		if (!res.writableFinished) rejection.destroy();
	};
	res.on("error", rejection.destroy);
	res.once("close", onResponseClose);
	let stopWaitingForSocket;
	try {
		rejection.phase = "writing";
		res.statusCode = statusCode;
		clearHttpResponseRepresentationHeaders(res);
		res.setHeader("Connection", "close");
		res.setHeader("Content-Length", Buffer.byteLength(body));
		if (contentType) res.setHeader("Content-Type", contentType);
		const onWritten = (error) => {
			if (error) rejection.destroy();
			else if (rejection.phase === "writing") {
				rejection.phase = "written";
				try {
					socket.end();
					socket.resume();
				} catch {
					rejection.destroy();
				}
			}
		};
		const transport = httpRejectionTransport(socket);
		if (transport === "bun-native") res.end(body, () => {
			if (rejection.phase === "writing") rejection.phase = "written";
		});
		else if (req.method === "HEAD") {
			const writeHeaders = () => {
				if (!res.socket || rejection.phase !== "writing") return;
				stopWaitingForSocket?.();
				try {
					res.flushHeaders();
					if (transport === "bun-node") res.write("", onWritten);
					else res.socket.write("", onWritten);
				} catch {
					rejection.destroy();
				}
			};
			if (!res.socket) {
				if (transport === "bun-node") {
					const onSocket = () => queueMicrotask(writeHeaders);
					res.once("socket", onSocket);
					stopWaitingForSocket = () => res.off("socket", onSocket);
				} else {
					const finished = channel("http.server.response.finish");
					const onFinish = (message) => {
						if (message.socket === socket) queueMicrotask(writeHeaders);
					};
					finished.subscribe(onFinish);
					stopWaitingForSocket = () => finished.unsubscribe(onFinish);
				}
			}
			writeHeaders();
		} else res.write(body, onWritten);
	} catch {
		rejection.destroy();
	}
	await rejection.closed;
	stopWaitingForSocket?.();
	res.off("error", rejection.destroy);
	res.off("close", onResponseClose);
}
/** Release handler/limiter ownership only after the selected transport closes. */
function waitForHttpRequestRejection(req) {
	return connections.get(req.socket)?.rejection?.closed;
}
//#endregion
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
	return error instanceof RequestBodyLimitError && (!code || error.code === code);
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
		timeoutMs: resolveTimerTimeoutMs(options.timeoutMs, DEFAULT_WEBHOOK_BODY_TIMEOUT_MS)
	};
}
function stopRequestBodyAfterLimit(req, destroyOnLimit) {
	if (req.destroyed) return;
	if (destroyOnLimit) {
		req.destroy();
		return;
	}
	selectHttpRequestRejection(req);
}
function createRequestBodyLimitTracker(limits, cleanup, onLimit) {
	let done = false;
	let totalBytes = 0;
	const timer = setTimeout(() => onLimit("REQUEST_BODY_TIMEOUT"), limits.timeoutMs);
	return {
		finish(complete) {
			if (done) return;
			done = true;
			cleanup();
			clearTimeout(timer);
			complete?.();
		},
		accept(chunk) {
			if (done) return false;
			totalBytes += typeof chunk === "string" ? Buffer.byteLength(chunk) : chunk.length;
			if (totalBytes > limits.maxBytes) {
				onLimit("PAYLOAD_TOO_LARGE");
				return false;
			}
			return true;
		}
	};
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
		const chunks = [];
		const tracker = createRequestBodyLimitTracker({
			maxBytes,
			timeoutMs
		}, () => {
			req.removeListener("data", onData);
			req.removeListener("end", onEnd);
			req.removeListener("error", fail);
			req.removeListener("close", onClose);
		}, (code) => {
			const error = new RequestBodyLimitError({ code });
			stopRequestBodyAfterLimit(req, destroyOnLimit);
			fail(error);
		});
		const fail = (error) => {
			tracker.finish(() => reject(error));
		};
		const onData = (chunk) => {
			if (tracker.accept(chunk)) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
		};
		const onEnd = () => {
			if (isHttpConnectionClosing(req.socket)) {
				fail(new RequestBodyLimitError({ code: "CONNECTION_CLOSED" }));
				return;
			}
			tracker.finish(() => resolve(chunks.length === 1 ? chunks[0].toString(encoding) : Buffer.concat(chunks).toString(encoding)));
		};
		const onClose = () => {
			fail(new RequestBodyLimitError({ code: "CONNECTION_CLOSED" }));
		};
		req.on("data", onData);
		req.on("end", onEnd);
		req.on("error", fail);
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
	let reason = null;
	const tracker = createRequestBodyLimitTracker({
		maxBytes,
		timeoutMs
	}, () => {
		req.removeListener("data", onData);
		req.removeListener("end", finish);
		req.removeListener("close", finish);
		req.removeListener("error", finish);
	}, (code) => trip(code));
	const finish = () => tracker.finish();
	const trip = (code) => {
		if (reason !== null) return;
		reason = code;
		finish();
		const text = customText[code] ?? requestBodyErrorToText(code);
		const body = responseFormat === "text" ? text : JSON.stringify({ error: text });
		const contentType = responseFormat === "text" ? "text/plain" : "application/json";
		sendHttpRequestRejection(req, res, DEFAULT_ERROR_STATUS_CODE[code], body, `${contentType}; charset=utf-8`);
	};
	const onData = (chunk) => {
		tracker.accept(chunk);
	};
	req.on("data", onData);
	req.on("end", finish);
	req.on("close", finish);
	req.on("error", finish);
	const declaredLength = parseContentLengthHeader(req);
	if (isHttpConnectionClosing(req.socket)) {
		reason = "CONNECTION_CLOSED";
		finish();
	} else if (req.destroyed && !req.readableEnded) finish();
	else if (declaredLength !== null && declaredLength > maxBytes) trip("PAYLOAD_TOO_LARGE");
	return {
		dispose: finish,
		isTripped: () => reason !== null,
		code: () => reason
	};
}
//#endregion
export { readJsonBodyWithLimit as a, clearHttpResponseRepresentationHeaders as c, runHttpConnectionRequest as d, sendHttpRequestRejection as f, isRequestBodyLimitError as i, createHttpRequestAbortSignal as l, RequestBodyLimitError as n, readRequestBodyWithLimit as o, waitForHttpRequestRejection as p, installRequestBodyLimitGuard as r, requestBodyErrorToText as s, DEFAULT_WEBHOOK_MAX_BODY_BYTES as t, isHttpConnectionClosing as u };
