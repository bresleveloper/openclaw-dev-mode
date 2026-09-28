import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { channel } from "node:diagnostics_channel";
import { clearTimeout, setTimeout } from "node:timers";
//#region src/infra/http-request-lifecycle.ts
const REJECTION_CLOSE_TIMEOUT_MS = 1e3;
const connections = /* @__PURE__ */ new WeakMap();
/** Abort disconnected work without treating normal request/response completion as cancellation. */
function createHttpRequestAbortSignal(req, res) {
	const controller = new AbortController();
	const abortIfRequestIncomplete = () => {
		if (!req.complete) controller.abort();
	};
	const abortIfResponseStillOpen = () => {
		if (!res.writableEnded) controller.abort();
	};
	req.once("close", abortIfRequestIncomplete);
	res.once("close", abortIfResponseStillOpen);
	if (req.destroyed && !req.complete || res.destroyed && !res.writableEnded) controller.abort();
	return {
		signal: controller.signal,
		cleanup: () => {
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
		if (process.versions.bun) res.end(body, () => {
			if (rejection.phase === "writing") rejection.phase = "written";
		});
		else if (req.method === "HEAD") {
			const writeHeaders = () => {
				if (!res.socket || rejection.phase !== "writing") return;
				stopWaitingForSocket?.();
				try {
					res.flushHeaders();
					res.socket.write("", onWritten);
				} catch {
					rejection.destroy();
				}
			};
			if (!res.socket) {
				const finished = channel("http.server.response.finish");
				const onFinish = (message) => {
					if (message.socket === socket) queueMicrotask(writeHeaders);
				};
				finished.subscribe(onFinish);
				stopWaitingForSocket = () => finished.unsubscribe(onFinish);
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
export { selectHttpRequestRejection as a, runHttpConnectionRequest as i, createHttpRequestAbortSignal as n, sendHttpRequestRejection as o, isHttpConnectionClosing as r, waitForHttpRequestRejection as s, clearHttpResponseRepresentationHeaders as t };
