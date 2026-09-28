import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { n as createCodexInferenceContext } from "./inference-context-D96l9-ew.mjs";
import { promisify } from "node:util";
import { zstdCompress, zstdDecompress } from "node:zlib";
import { Writable, getDefaultHighWaterMark } from "node:stream";
import { WebSocket, WebSocketServer, rejectWebSocketUpgrade } from "openclaw/plugin-sdk/websocket-runtime";
import { createServer } from "node:http";
import { createPermitPool } from "openclaw/plugin-sdk/concurrency-runtime";
import { createNodeProxyAgent } from "openclaw/plugin-sdk/fetch-runtime";
import { generateSecureToken } from "openclaw/plugin-sdk/secure-random-runtime";
import { fetchWithSsrFGuard, isBlockedHostnameOrIp, resolvePinnedHostnameWithPolicy } from "openclaw/plugin-sdk/ssrf-runtime";
//#region extensions/codex/src/app-server/inference-upload.ts
const MAX_BODY_BYTES = 33554432;
function createUploadAdmission() {
	const permits = createPermitPool(16);
	let outstanding = 0;
	let queuedBytes = 0;
	return async (signal, deadlineAtMs, bytes = 0) => {
		const queued = outstanding >= 16;
		if (outstanding >= 32 || queued && queuedBytes + bytes > 33554432) return null;
		outstanding++;
		if (queued) queuedBytes += bytes;
		const releasePermit = await permits.acquire({
			signal,
			deadlineAtMs
		});
		if (queued) queuedBytes -= bytes;
		let released = false;
		const release = () => {
			if (released) return;
			released = true;
			outstanding--;
			releasePermit?.();
		};
		if (!releasePermit || signal.aborted) {
			release();
			return null;
		}
		return release;
	};
}
function createUploadBody(bytes, signal, release) {
	const length = bytes.length;
	const chunkSize = getDefaultHighWaterMark(false);
	let remaining = bytes;
	let offset = 0;
	const settle = () => {
		remaining = void 0;
		signal.removeEventListener("abort", settle);
		release();
	};
	signal.addEventListener("abort", settle, { once: true });
	if (signal.aborted) settle();
	return {
		body: new ReadableStream({
			pull(controller) {
				signal.throwIfAborted();
				if (!remaining || offset === length) {
					settle();
					controller.close();
					return;
				}
				const end = Math.min(offset + chunkSize, length);
				controller.enqueue(Uint8Array.from(remaining.subarray(offset, end)));
				offset = end;
			},
			cancel: settle
		}, { highWaterMark: 0 }),
		length,
		settle
	};
}
//#endregion
//#region extensions/codex/src/app-server/inference-proxy.ts
const MAX_ERROR_BODY_BYTES = 1048576;
const MAX_WEBSOCKETS = 64;
const MAX_RESIDENTS = 80;
const REQUEST_TIMEOUT_MS = 3e4;
const HANDSHAKE_TIMEOUT_MS = 1e4;
const IDLE_WEBSOCKET_MS = 6e4;
const OVERLOADED = "Codex inference relay is busy; retry on a fresh connection.";
const OVERLOAD_HEADERS = {
	"content-type": "application/json",
	"retry-after": "1"
};
const OVERLOAD_BODY = JSON.stringify({
	type: "error",
	status: 503,
	error: {
		type: "server_error",
		code: "inference_relay_busy",
		message: OVERLOADED
	},
	headers: { "retry-after": "1" }
});
const compress = promisify(zstdCompress);
const decompress = promisify(zstdDecompress);
const HOP_HEADERS = /* @__PURE__ */ new Set([
	"connection",
	"keep-alive",
	"proxy-authenticate",
	"proxy-authorization",
	"te",
	"trailer",
	"transfer-encoding",
	"upgrade",
	"host",
	"content-length"
]);
const FAILURE = "Codex parent-local inference transport failed; retry on a fresh connection.";
/** Private, fixed-destination relay. No upstream credentials or model content are retained. */
async function createCodexInferenceProxy(params) {
	const upstream = new URL(params.upstream);
	if (upstream.protocol !== "https:" || upstream.username || upstream.password || upstream.hash) throw new Error("Codex inference requires a credential-free HTTPS upstream URL");
	const lifetime = new AbortController();
	const assertCurrent = () => {
		lifetime.signal.throwIfAborted();
		params.assertCurrent();
	};
	const context = createCodexInferenceContext(assertCurrent);
	const pathPrefix = "/" + generateSecureToken({
		bytes: 32,
		redact: true
	}) + upstream.pathname.replace(/\/$/, "");
	const acquireUpload = createUploadAdmission();
	const connections = /* @__PURE__ */ new Set();
	const idleConnections = /* @__PURE__ */ new Set();
	const residents = createPermitPool(MAX_RESIDENTS);
	const tickets = /* @__PURE__ */ new Set();
	const reclaimIdle = () => {
		if (tickets.size < MAX_RESIDENTS || idleConnections.size === 0) return;
		let acquired = 0;
		let waiting = false;
		let retiring = false;
		for (const ticket of tickets) {
			retiring ||= ticket.retiring;
			if (ticket.release) acquired++;
			else if (ticket.pending && !ticket.signal.aborted && Date.now() < ticket.deadlineAtMs) waiting = true;
		}
		if (!retiring && acquired === MAX_RESIDENTS && waiting) idleConnections.values().next().value?.();
	};
	const reserveResident = (socket, signal, deadlineAtMs) => {
		if (tickets.size >= 96) return null;
		const ticket = {
			signal,
			deadlineAtMs,
			pending: true,
			release: null,
			retiring: false
		};
		tickets.add(ticket);
		let finished = false;
		const settle = () => {
			if (!finished || !socket.closed || ticket.pending || !tickets.delete(ticket)) return;
			socket.off("close", settle);
			ticket.release?.();
			ticket.release = null;
			reclaimIdle();
		};
		socket.once("close", settle);
		const ready = residents.acquire({
			signal,
			deadlineAtMs
		}).then((release) => {
			ticket.pending = false;
			if (release && signal.aborted) release();
			else ticket.release = release;
			settle();
			reclaimIdle();
			return ticket.release !== null;
		});
		reclaimIdle();
		return {
			ready,
			retireIdle() {
				ticket.retiring = true;
			},
			finish() {
				finished = true;
				settle();
			}
		};
	};
	const wss = new WebSocketServer({
		noServer: true,
		maxPayload: MAX_BODY_BYTES,
		perMessageDeflate: false
	});
	const handshakeHeaders = /* @__PURE__ */ new WeakMap();
	wss.on("headers", (headers, request) => {
		for (const [key, value] of Object.entries(handshakeHeaders.get(request) ?? {})) if (!key.startsWith("sec-websocket-")) headers.push(key + ": " + value);
		handshakeHeaders.delete(request);
	});
	const resolveTarget = (request) => {
		assertCurrent();
		if (request.headers.origin || !request.url?.startsWith(pathPrefix + "/") || isBlockedHostnameOrIp(upstream.hostname)) throw new Error(FAILURE);
		const suffix = request.url.slice(pathPrefix.length);
		if (suffix.startsWith("//") || suffix.includes("\\") || /%2e|%2f|%5c|(?:^|\/)\.\.?(?:\/|\?|$)/i.test(suffix)) throw new Error(FAILURE);
		const target = new URL(upstream);
		const incoming = new URL(suffix, "http://localhost");
		target.pathname = upstream.pathname.replace(/\/$/, "") + incoming.pathname;
		for (const [key, value] of incoming.searchParams) target.searchParams.append(key, value);
		return {
			target,
			sampling: incoming.pathname === "/responses"
		};
	};
	const prepare = (bytes, sampling) => {
		assertCurrent();
		if (!sampling) return {
			bytes,
			assertCurrent,
			signal: void 0
		};
		const value = JSON.parse(bytes.toString("utf8"));
		if (!isJsonObject(value)) throw new Error(FAILURE);
		const prepared = context.prepare(value);
		const rewritten = Buffer.from(JSON.stringify(prepared.body));
		if (rewritten.length > 33554432) throw new Error(FAILURE);
		return {
			bytes: rewritten,
			assertCurrent: prepared.assertCurrent,
			signal: prepared.signal
		};
	};
	const prepareHttp = async (req, sampling, signal, release) => {
		const wire = await readProxyBody(req, MAX_BODY_BYTES);
		const encoding = req.headers["content-encoding"];
		if (encoding && encoding !== "identity" && encoding !== "zstd") throw new Error(FAILURE);
		const decoded = encoding === "zstd" ? await decompress(wire, { maxOutputLength: MAX_BODY_BYTES }) : wire;
		signal.throwIfAborted();
		const prepared = prepare(decoded, sampling);
		const body = encoding === "zstd" ? await compress(prepared.bytes) : prepared.bytes;
		prepared.assertCurrent();
		const requestSignal = AbortSignal.any([signal, ...prepared.signal ? [prepared.signal] : []]);
		return {
			...createUploadBody(body, requestSignal, release),
			assertCurrent: prepared.assertCurrent,
			signal: requestSignal
		};
	};
	const server = createServer((req, res) => {
		const socket = req.socket;
		res.setHeader("Connection", "close");
		const controller = new AbortController();
		const signal = AbortSignal.any([lifetime.signal, controller.signal]);
		const deadlineAtMs = Date.now() + REQUEST_TIMEOUT_MS;
		let releasePermit = null;
		let resident = null;
		let upload;
		let guarded;
		const abort = () => controller.abort();
		req.once("aborted", abort);
		res.once("close", abort);
		(async () => {
			try {
				const { target, sampling } = resolveTarget(req);
				if (req.method !== "POST") throw new Error(FAILURE);
				resident = reserveResident(socket, signal, deadlineAtMs);
				const admitted = resident && await resident.ready;
				signal.throwIfAborted();
				assertCurrent();
				if (!admitted) {
					res.writeHead(503, OVERLOAD_HEADERS).end(OVERLOAD_BODY);
					return;
				}
				releasePermit = await acquireUpload(signal, deadlineAtMs);
				signal.throwIfAborted();
				assertCurrent();
				if (!releasePermit) {
					res.writeHead(503, OVERLOAD_HEADERS).end(OVERLOAD_BODY);
					return;
				}
				upload = await prepareHttp(req, sampling, signal, releasePermit);
				const init = {
					method: "POST",
					headers: {
						...relayHeaders(req.headers),
						"content-length": String(upload.length)
					},
					body: upload.body,
					signal: upload.signal,
					duplex: "half"
				};
				guarded = await fetchWithSsrFGuard({
					url: target.toString(),
					init,
					signal: upload.signal,
					beforeRequest: upload.assertCurrent,
					requireHttps: true,
					maxRedirects: 0,
					capture: false,
					mode: "trusted_env_proxy",
					auditContext: "codex-parent-local-inference"
				});
				upload.assertCurrent();
				const headers = Object.fromEntries(guarded.response.headers);
				delete headers["content-encoding"];
				res.writeHead(guarded.response.status, relayHeaders(headers));
				if (!guarded.response.body) res.end();
				else await guarded.response.body.pipeTo(Writable.toWeb(res), { signal: upload.signal });
			} catch {
				if (!res.headersSent && !res.destroyed) res.writeHead(502, { "content-type": "text/plain" }).end(FAILURE);
				else res.destroy();
			} finally {
				upload?.settle();
				releasePermit?.();
				req.off("aborted", abort);
				res.off("close", abort);
				await guarded?.release().catch(() => void 0);
				resident?.finish();
			}
		})();
	});
	server.maxConnections = 128;
	server.requestTimeout = REQUEST_TIMEOUT_MS;
	server.headersTimeout = HANDSHAKE_TIMEOUT_MS;
	server.on("upgrade", (req, socket, head) => {
		(async () => {
			let remote;
			let local;
			let proxyAgent;
			let upstreamClosed = Promise.resolve();
			let finishSetup = () => {};
			const setupSettled = new Promise((resolve) => {
				finishSetup = resolve;
			});
			let resident = null;
			const controller = new AbortController();
			const deadlineAtMs = Date.now() + HANDSHAKE_TIMEOUT_MS;
			let releasePermit = null;
			let framePending = false;
			let idleTimer;
			let handshakeTimer;
			let closing = false;
			const close = () => {
				if (closing) return;
				closing = true;
				if (idleConnections.has(close)) resident?.retireIdle();
				clearTimeout(idleTimer);
				clearTimeout(handshakeTimer);
				socket.off("end", close);
				connections.delete(close);
				idleConnections.delete(close);
				controller.abort();
				remote?.terminate();
				local?.terminate();
				proxyAgent?.destroy();
				socket.destroy();
				setupSettled.then(() => upstreamClosed).then(() => {
					releasePermit?.();
					releasePermit = null;
					resident?.finish();
				});
			};
			try {
				const { target, sampling } = resolveTarget(req);
				if (!sampling) throw new Error(FAILURE);
				if (connections.size >= MAX_WEBSOCKETS) idleConnections.values().next().value?.();
				if (connections.size >= MAX_WEBSOCKETS) {
					rejectBusyUpgrade(socket);
					return;
				}
				connections.add(close);
				socket.once("close", close);
				socket.once("error", close);
				socket.once("end", close);
				const signal = AbortSignal.any([lifetime.signal, controller.signal]);
				resident = reserveResident(socket, signal, deadlineAtMs);
				const admitted = resident && await resident.ready;
				signal.throwIfAborted();
				assertCurrent();
				if (!admitted) {
					rejectBusyUpgrade(socket);
					return;
				}
				releasePermit = await acquireUpload(signal, deadlineAtMs);
				signal.throwIfAborted();
				assertCurrent();
				if (!releasePermit) {
					rejectBusyUpgrade(socket);
					return;
				}
				handshakeTimer = setTimeout(close, Math.max(1, deadlineAtMs - Date.now()));
				handshakeTimer.unref();
				const assertHandshakeCurrent = () => {
					assertCurrent();
					signal.throwIfAborted();
					if (Date.now() >= deadlineAtMs) throw new Error(FAILURE);
				};
				proxyAgent = createNodeProxyAgent({
					mode: "env",
					targetUrl: target.href
				});
				const lookup = proxyAgent ? void 0 : (await resolvePinnedHostnameWithPolicy(target.hostname, { signal })).lookup;
				assertHandshakeCurrent();
				target.protocol = "wss:";
				const headers = relayHeaders(req.headers);
				for (const key of Object.keys(headers)) if (key.startsWith("sec-websocket-")) delete headers[key];
				remote = new WebSocket(target, {
					headers,
					...proxyAgent ? { agent: proxyAgent } : { lookup },
					followRedirects: false,
					perMessageDeflate: false,
					maxPayload: MAX_BODY_BYTES,
					handshakeTimeout: Math.max(1, deadlineAtMs - Date.now()),
					finishRequest(request) {
						let socketClosed = Promise.resolve();
						request.once("socket", (upstreamSocket) => {
							socketClosed = new Promise((resolve) => {
								upstreamSocket.once("close", () => resolve());
							});
						});
						upstreamClosed = new Promise((resolve) => {
							request.once("close", () => {
								socketClosed.then(resolve);
							});
						});
						request.end();
					}
				});
				remote.once("upgrade", (response) => {
					handshakeHeaders.set(req, relayHeaders(response.headers));
				});
				remote.once("error", close);
				remote.once("close", close);
				remote.once("unexpected-response", (_request, response) => {
					(async () => {
						try {
							const body = await readProxyBody(response, MAX_ERROR_BODY_BYTES);
							assertCurrent();
							signal.throwIfAborted();
							const failureHeaders = Object.entries(relayHeaders(response.headers)).map(([key, value]) => key + ": " + value);
							failureHeaders.push("Connection: close", "Content-Length: " + body.length);
							const status = "HTTP/1.1 " + response.statusCode + " " + (response.statusMessage ?? "Upstream refused");
							socket.end(Buffer.concat([Buffer.from(status + "\r\n" + failureHeaders.join("\r\n") + "\r\n\r\n"), body]), close);
						} catch {
							close();
						}
					})();
				});
				remote.once("open", () => {
					try {
						assertHandshakeCurrent();
						wss.handleUpgrade(req, socket, head, (accepted) => {
							clearTimeout(handshakeTimer);
							socket.off("end", close);
							local = accepted;
							accepted.once("error", close);
							accepted.once("close", close);
							let releaseFrame = () => {};
							const idle = (reclaimable = true) => {
								framePending = false;
								idleConnections.delete(close);
								if (reclaimable) idleConnections.add(close);
								clearTimeout(idleTimer);
								idleTimer = setTimeout(close, IDLE_WEBSOCKET_MS);
								idleTimer.unref();
								reclaimIdle();
							};
							releasePermit?.();
							releasePermit = null;
							idle(false);
							const forward = async (prepared) => {
								let releaseUpload = null;
								try {
									const requestSignal = AbortSignal.any([signal, ...prepared.signal ? [prepared.signal] : []]);
									releaseUpload = await acquireUpload(requestSignal, Date.now() + REQUEST_TIMEOUT_MS, prepared.bytes.length);
									requestSignal.throwIfAborted();
									prepared.assertCurrent();
									if (!releaseUpload) {
										accepted.send(OVERLOAD_BODY, { binary: false }, close);
										return;
									}
									if (!remote || remote.readyState !== WebSocket.OPEN || remote.bufferedAmount + prepared.bytes.length > 33554432) throw new Error(FAILURE);
									const release = releaseUpload;
									remote.send(prepared.bytes, { binary: false }, (error) => {
										release();
										if (error) close();
									});
								} catch {
									releaseUpload?.();
									close();
								}
							};
							accepted.on("message", (data, binary) => {
								try {
									if (binary) throw new Error(FAILURE);
									const prepared = prepare(rawBytes(data), true);
									prepared.assertCurrent();
									if (framePending) throw new Error(FAILURE);
									framePending = true;
									clearTimeout(idleTimer);
									idleConnections.delete(close);
									releaseFrame();
									const onAbort = () => close();
									const frameSignal = prepared.signal;
									frameSignal?.addEventListener("abort", onAbort, { once: true });
									releaseFrame = () => frameSignal?.removeEventListener("abort", onAbort);
									forward(prepared);
								} catch {
									close();
								}
							});
							accepted.once("close", () => releaseFrame());
							remote.on("message", (data, binary) => {
								if (accepted.readyState !== WebSocket.OPEN || accepted.bufferedAmount + rawBytes(data).length > 33554432) {
									close();
									return;
								}
								const terminal = !binary && isTerminalResponse(rawBytes(data));
								accepted.send(data, { binary }, (error) => {
									if (error) close();
									else if (terminal && connections.has(close)) idle();
								});
							});
						});
					} catch {
						close();
					}
				});
			} catch {
				close();
			} finally {
				finishSetup();
			}
		})();
	});
	const close = () => {
		lifetime.abort();
		context.close();
		for (const closeConnection of connections) closeConnection();
		server.close();
		server.closeAllConnections();
		wss.close();
	};
	try {
		await new Promise((resolve, reject) => {
			server.once("error", reject);
			server.listen(0, "127.0.0.1", () => {
				server.off("error", reject);
				resolve();
			});
		});
		assertCurrent();
		server.on("error", close);
		const address = server.address();
		if (!address || typeof address === "string") throw new Error(FAILURE);
		return {
			context,
			upstream: upstream.toString(),
			baseUrl: "http://127.0.0.1:" + address.port + pathPrefix,
			assertCurrent,
			close
		};
	} catch (error) {
		close();
		throw error;
	}
}
function rejectBusyUpgrade(socket) {
	rejectWebSocketUpgrade(socket, {
		status: 503,
		headers: { "Retry-After": "1" },
		body: {
			contentType: "application/json",
			text: OVERLOAD_BODY
		}
	});
}
function isTerminalResponse(bytes) {
	try {
		const event = JSON.parse(bytes.toString("utf8"));
		return isJsonObject(event) && (event.type === "response.failed" || event.type === "response.incomplete" || event.type === "response.completed" && isJsonObject(event.response) && typeof event.response.id === "string");
	} catch {
		return false;
	}
}
async function readProxyBody(stream, maxBytes) {
	const chunks = [];
	let size = 0;
	for await (const chunk of stream) {
		const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		size += bytes.length;
		if (size > maxBytes) throw new Error(FAILURE);
		chunks.push(bytes);
	}
	return Buffer.concat(chunks);
}
function rawBytes(data) {
	return Array.isArray(data) ? Buffer.concat(data) : Buffer.isBuffer(data) ? data : Buffer.from(data);
}
function relayHeaders(input) {
	const excluded = new Set(HOP_HEADERS);
	for (const token of (input.connection ?? "").split(",")) excluded.add(token.trim().toLowerCase());
	const output = {};
	for (const [key, value] of Object.entries(input)) if (value !== void 0 && !excluded.has(key.toLowerCase())) output[key.toLowerCase()] = Array.isArray(value) ? value.join(", ") : value;
	return output;
}
//#endregion
export { createCodexInferenceProxy };
