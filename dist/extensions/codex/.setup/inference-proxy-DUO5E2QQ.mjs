import { t as codexWebSocketDataToBuffer } from "./websocket-data-XlRvt8Ys.mjs";
import { CODEX_INFERENCE_TRANSPORT_FAILURE, authorizationFailure, createCodexInferenceDispatch, isTerminalResponse, n as createUploadAdmission, readProxyBody, t as MAX_BODY_BYTES } from "./inference-dispatch-B5UKEUyC.mjs";
import { t as createCodexInferenceContext } from "./inference-context-D-9gWlTR.mjs";
import { createPermitPool } from "openclaw/plugin-sdk/concurrency-runtime";
import { Writable } from "node:stream";
import { WebSocket, WebSocketServer, rejectWebSocketUpgrade } from "openclaw/plugin-sdk/websocket-runtime";
import { createServer } from "node:http";
import { createNodeProxyAgent } from "openclaw/plugin-sdk/fetch-runtime";
import { generateSecureToken } from "openclaw/plugin-sdk/secure-random-runtime";
import { fetchWithSsrFGuard, isBlockedHostnameOrIp, resolvePinnedHostnameWithPolicy } from "openclaw/plugin-sdk/ssrf-runtime";
//#region extensions/codex/src/app-server/inference-proxy-http.ts
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
function relayHeaders(input) {
	const excluded = new Set(HOP_HEADERS);
	for (const token of (input.connection ?? "").split(",")) excluded.add(token.trim().toLowerCase());
	const output = {};
	for (const [key, value] of Object.entries(input)) if (value !== void 0 && !excluded.has(key.toLowerCase())) output[key.toLowerCase()] = Array.isArray(value) ? value.join(", ") : value;
	return output;
}
//#endregion
//#region extensions/codex/src/app-server/inference-proxy.ts
const MAX_ERROR_BODY_BYTES = 1048576;
const MAX_WEBSOCKETS = 64;
const MAX_RESIDENTS = 80;
const REQUEST_TIMEOUT_MS = 3e4;
const HANDSHAKE_TIMEOUT_MS = 1e4;
const IDLE_WEBSOCKET_MS = 6e4;
/** Private, fixed-destination relay. No upstream credentials or model content are retained. */
async function createCodexInferenceProxy(params) {
	const upstream = new URL(params.upstream);
	if (upstream.protocol !== "https:" || upstream.username || upstream.password || upstream.hash) throw new Error("Codex inference requires a credential-free HTTPS upstream URL");
	if (params.oauth && upstream.href.replace(/\/$/, "") !== "https://api.openai.com/v1") throw new Error("ChatGPT subscription sharing requires the public Responses endpoint");
	const lifetime = new AbortController();
	const assertCurrent = () => {
		lifetime.signal.throwIfAborted();
		params.assertCurrent();
	};
	const context = createCodexInferenceContext(assertCurrent);
	const upstreamPath = upstream.pathname.replace(/\/+$/, "");
	const pathPrefix = "/" + generateSecureToken({
		bytes: 32,
		redact: true
	}) + (params.preserveAzureUrlFeatures ? "/azure-api." : "") + upstreamPath + (params.preserveCodexBackendRoutes && !upstreamPath.endsWith("/backend-api/codex") ? "/backend-api/codex" : params.preserveCodexBackendRoutes === false && upstreamPath.endsWith("/backend-api/codex") ? "/native-responses" : "");
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
		if (request.headers.origin || !request.url?.startsWith(pathPrefix + "/") || isBlockedHostnameOrIp(upstream.hostname)) throw new Error(CODEX_INFERENCE_TRANSPORT_FAILURE);
		const suffix = request.url.slice(pathPrefix.length);
		const rawPath = suffix.split("?", 1)[0] ?? suffix;
		if (rawPath.startsWith("//") || rawPath.includes("\\") || /%2e|%2f|%5c|(?:^|\/)\.\.?(?:\/|$)/i.test(rawPath)) throw new Error(CODEX_INFERENCE_TRANSPORT_FAILURE);
		const target = new URL(upstream);
		const incoming = new URL(suffix, "http://localhost");
		if (params.oauth && (incoming.pathname !== "/responses" || incoming.search)) throw new Error(CODEX_INFERENCE_TRANSPORT_FAILURE);
		target.pathname = upstreamPath + incoming.pathname;
		for (const [key, value] of incoming.searchParams) target.searchParams.append(key, value);
		return {
			target,
			path: incoming.pathname,
			sampling: incoming.pathname === "/responses"
		};
	};
	const { prepare, prepareHttp } = createCodexInferenceDispatch({
		context,
		assertCurrent,
		bindModelExecution: params.bindModelExecution,
		requireAdmission: Boolean(params.oauth)
	});
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
				const { target, sampling, path } = resolveTarget(req);
				if (req.method !== "POST") throw new Error(CODEX_INFERENCE_TRANSPORT_FAILURE);
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
				upload = await prepareHttp(req, sampling, path, signal, releasePermit, Boolean(params.oauth));
				const preparedUpload = upload;
				let body = upload.body;
				for (let attempt = 0; attempt < (params.oauth ? 2 : 1); attempt++) {
					const headers = {
						...relayHeaders(req.headers),
						"content-length": String(upload.length)
					};
					const auth = await params.oauth?.resolve(attempt === 1);
					const assertAuthorized = () => {
						preparedUpload.assertCurrent();
						auth?.assertCurrent();
					};
					assertAuthorized();
					if (auth) {
						for (const key of [
							"authorization",
							"chatgpt-account-id",
							"openai-organization",
							"openai-project"
						]) delete headers[key];
						headers.authorization = `Bearer ${auth.token}`;
						headers["x-openai-chatpass-test"] = "codex-direct";
					}
					const init = {
						method: "POST",
						headers,
						body,
						signal: upload.signal,
						duplex: "half"
					};
					guarded = await fetchWithSsrFGuard({
						url: target.toString(),
						init,
						signal: upload.signal,
						beforeRequest: assertAuthorized,
						requireHttps: true,
						maxRedirects: 0,
						capture: false,
						mode: "trusted_env_proxy",
						auditContext: "codex-parent-local-inference"
					});
					assertAuthorized();
					if (!upload.retry || guarded.response.status !== 401 || attempt === 1) {
						upload.commit?.();
						break;
					}
					await guarded.response.body?.cancel();
					await guarded.release();
					guarded = void 0;
					body = upload.retry();
				}
				if (!guarded) throw new Error(CODEX_INFERENCE_TRANSPORT_FAILURE);
				upload.assertCurrent();
				const headers = Object.fromEntries(guarded.response.headers);
				delete headers["content-encoding"];
				res.writeHead(guarded.response.status, relayHeaders(headers));
				if (!guarded.response.body) res.end();
				else await guarded.response.body.pipeTo(Writable.toWeb(res), { signal: upload.signal });
			} catch (error) {
				if (!res.headersSent && !res.destroyed) {
					const denied = authorizationFailure(error);
					if (denied) res.writeHead(403, { "content-type": "application/json" }).end(denied);
					else res.writeHead(502, { "content-type": "text/plain" }).end(CODEX_INFERENCE_TRANSPORT_FAILURE);
				} else res.destroy();
			} finally {
				upload?.settle();
				releasePermit?.();
				req.off("aborted", abort);
				res.off("close", abort);
				await guarded?.release().catch(() => void 0);
				upload?.releaseModelExecution();
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
			const finish = (status) => {
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
				if (status && !local && !socket.destroyed && !socket.writableEnded) rejectWebSocketUpgrade(socket, {
					status,
					body: {
						contentType: "text/plain",
						text: CODEX_INFERENCE_TRANSPORT_FAILURE
					}
				});
				else socket.destroy();
				setupSettled.then(() => upstreamClosed).then(() => {
					releasePermit?.();
					releasePermit = null;
					resident?.finish();
				});
			};
			const close = () => finish();
			const failHandshake = () => finish(Date.now() >= deadlineAtMs ? 504 : 502);
			try {
				const { target, sampling, path } = resolveTarget(req);
				if (params.oauth) throw new Error(CODEX_INFERENCE_TRANSPORT_FAILURE);
				if (!sampling && path !== "/guardian" && path !== "/guardian-classifier") throw new Error(CODEX_INFERENCE_TRANSPORT_FAILURE);
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
				handshakeTimer = setTimeout(() => finish(504), Math.max(1, deadlineAtMs - Date.now()));
				handshakeTimer.unref();
				const assertHandshakeCurrent = () => {
					assertCurrent();
					signal.throwIfAborted();
					if (Date.now() >= deadlineAtMs) throw new Error(CODEX_INFERENCE_TRANSPORT_FAILURE);
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
				remote.once("error", failHandshake);
				remote.once("close", failHandshake);
				remote.once("unexpected-response", (_request, response) => {
					(async () => {
						try {
							const body = await readProxyBody(response, MAX_ERROR_BODY_BYTES);
							assertHandshakeCurrent();
							clearTimeout(handshakeTimer);
							const failureHeaders = Object.entries(relayHeaders(response.headers)).map(([key, value]) => key + ": " + value);
							failureHeaders.push("Connection: close", "Content-Length: " + body.length);
							const status = "HTTP/1.1 " + response.statusCode + " " + (response.statusMessage ?? "Upstream refused");
							socket.end(Buffer.concat([Buffer.from(status + "\r\n" + failureHeaders.join("\r\n") + "\r\n\r\n"), body]), close);
						} catch {
							failHandshake();
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
							let settleFrame = () => {};
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
									if (!remote || remote.readyState !== WebSocket.OPEN || remote.bufferedAmount + prepared.bytes.length > 33554432) throw new Error(CODEX_INFERENCE_TRANSPORT_FAILURE);
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
								if (framePending) {
									close();
									return;
								}
								framePending = true;
								clearTimeout(idleTimer);
								idleConnections.delete(close);
								releaseFrame();
								(async () => {
									let prepared;
									try {
										if (binary) throw new Error(CODEX_INFERENCE_TRANSPORT_FAILURE);
										prepared = await prepare(codexWebSocketDataToBuffer(data), sampling, path, req.headers, signal, "websocket");
										prepared.assertCurrent();
										const frame = prepared;
										const onAbort = () => close();
										frame.signal.addEventListener("abort", onAbort, { once: true });
										frame.contextSignal?.addEventListener("abort", onAbort, { once: true });
										const releaseModel = () => {
											frame.signal.removeEventListener("abort", onAbort);
											frame.release();
										};
										settleFrame = releaseModel;
										releaseFrame = () => {
											frame.contextSignal?.removeEventListener("abort", onAbort);
											releaseModel();
										};
										frame.signal.throwIfAborted();
										await forward(frame);
									} catch (error) {
										prepared?.release();
										const denied = authorizationFailure(error);
										if (denied && accepted.readyState === WebSocket.OPEN) accepted.send(denied, { binary: false }, close);
										else close();
									}
								})();
							});
							accepted.once("close", () => releaseFrame());
							remote.on("message", (data, binary) => {
								if (accepted.readyState !== WebSocket.OPEN || accepted.bufferedAmount + codexWebSocketDataToBuffer(data).length > 33554432) {
									close();
									return;
								}
								const terminal = !binary && isTerminalResponse(codexWebSocketDataToBuffer(data));
								const releaseCompletedFrame = terminal ? settleFrame : void 0;
								accepted.send(data, { binary }, (error) => {
									if (error) close();
									else if (terminal && connections.has(close)) {
										releaseCompletedFrame?.();
										idle();
									}
								});
							});
						});
					} catch {
						failHandshake();
					}
				});
			} catch {
				if (connections.has(close)) failHandshake();
				else close();
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
		if (!address || typeof address === "string") throw new Error(CODEX_INFERENCE_TRANSPORT_FAILURE);
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
//#endregion
export { createCodexInferenceProxy };
