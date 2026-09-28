import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { s as isLoopbackHost } from "./net-DU4aWKLv.mjs";
import { n as WebSocketServer } from "./websocket-CGHaToS5.mjs";
import { s as readRequestBodyWithLimit } from "./http-body-Bl_jph25.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { n as rawDataToString } from "./ws-BdD3UP1C.mjs";
import "./ssrf-runtime-Darh53Ay.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { t as rejectWebSocketUpgrade } from "./websocket-upgrade-reject-D2Ac4nen.mjs";
import { t as resolveRequestClientIp } from "./webhook-ingress-CLBPfE22.mjs";
import { t as WEBHOOK_BODY_READ_DEFAULTS } from "./webhook-request-guards-CccCHICi.mjs";
import { i as BROWSER_ACTION_TRANSPORT_SLACK_MS, l as resolveActWaitTimeoutMs } from "./act-policy-3Ku82pq-.mjs";
import "./subsystem-DDeJ2N6_.mjs";
import { n as readExtensionRelayToken } from "./relay-auth-BkA-pgXS.mjs";
import { a as getBrowserRelayAuthV2Authority, c as parseRelayAuthHello, d as parseRelayHttpCompleteRequest, f as parseStrictJsonObject, g as randomRelayId, l as parseRelayAuthResponse, o as invalidateBrowserRelayAuthV2Authority, r as BROWSER_RELAY_CHALLENGE_TTL_MS, s as parseExtensionRelayResource, u as parseRelayHttpChallengeRequest } from "./auth-v2-B-IXoFi_.mjs";
import { a as relayOwnerRequest, o as relayOwnerResource, r as relayOwnerFrame, t as RELAY_OPERATION_TTL_MS } from "./owner-protocol-Chu-AHTl.mjs";
import { Duplex } from "node:stream";
import crypto, { randomUUID } from "node:crypto";
import { addAbortListener, once } from "node:events";
import http from "node:http";
const MAX_WEBSOCKET_PREAUTH_WIRE_BYTES = 17408;
function boundedRawDataByteLength(data, limit) {
	if (!Array.isArray(data)) return data.byteLength;
	let length = 0;
	for (const chunk of data) {
		length += chunk.byteLength;
		if (length > limit) break;
	}
	return length;
}
var PreAuthWebSocketTransport = class extends Duplex {
	constructor(rawSocket, headBytes) {
		super();
		this.rawSocket = rawSocket;
		this.guardActive = true;
		this.removeGuard = () => {
			this.guardActive = false;
		};
		this.onRawData = (chunk) => {
			if (this.guardActive) {
				this.wireBytes += chunk.byteLength;
				if (this.wireBytes > MAX_WEBSOCKET_PREAUTH_WIRE_BYTES) {
					this.destroy();
					return;
				}
			}
			if (!this.push(chunk)) this.rawSocket.pause();
		};
		this.onRawEnd = () => this.push(null);
		this.onRawClose = () => {
			this.rawSocket.off("error", this.onRawError);
			this.destroy();
		};
		this.onRawError = (error) => this.destroy(error);
		this.wireBytes = headBytes;
		rawSocket.on("data", this.onRawData);
		rawSocket.once("end", this.onRawEnd);
		rawSocket.once("close", this.onRawClose);
		rawSocket.once("error", this.onRawError);
	}
	_read() {
		this.rawSocket.resume();
	}
	_write(chunk, encoding, callback) {
		this.rawSocket.write(chunk, encoding, callback);
	}
	_final(callback) {
		this.rawSocket.end(callback);
	}
	_destroy(error, callback) {
		this.rawSocket.off("data", this.onRawData);
		this.rawSocket.off("end", this.onRawEnd);
		this.rawSocket.destroy();
		callback(error);
	}
};
/** Withhold pre-auth bytes from `ws`; successful proof makes the transport transparent. */
function handlePreAuthWebSocketUpgrade(params) {
	if (params.head.byteLength > MAX_WEBSOCKET_PREAUTH_WIRE_BYTES) return false;
	const transport = new PreAuthWebSocketTransport(params.socket, params.head.byteLength);
	try {
		params.wss.handleUpgrade(params.req, transport, params.head, (ws) => {
			params.onUpgrade(ws, transport.removeGuard);
		});
	} catch (err) {
		transport.destroy();
		throw err;
	}
	return true;
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/auth-v2-websocket.ts
const log$2 = createSubsystemLogger("browser").child("extension-relay");
function authenticateExtensionWebSocket(params) {
	const { ws, authority } = params;
	ws.on("error", (err) => log$2.warn(`relay socket error: ${String(err)}`));
	let stage = "hello";
	let preAuthGuardActive = true;
	const removePreAuthGuard = () => {
		if (!preAuthGuardActive) return;
		preAuthGuardActive = false;
		params.removePreAuthGuard?.();
	};
	const closePreAuthSocket = (code, reason) => {
		ws.close(code, reason);
		setTimeout(() => ws.terminate(), 100).unref?.();
	};
	const timer = setTimeout(() => {
		stage = "failed";
		ws.off("message", onMessage);
		ws.close(4008, "browser relay auth timeout");
		ws.terminate();
	}, BROWSER_RELAY_CHALLENGE_TTL_MS);
	timer.unref?.();
	const release = () => {
		clearTimeout(timer);
		removePreAuthGuard();
		authority.releaseConnection(ws);
	};
	if (!authority.registerPendingConnection(ws, () => {
		ws.close(4003, "browser relay key rotated");
	}, params.source)) {
		clearTimeout(timer);
		closePreAuthSocket(4013, "browser relay auth capacity reached");
		return;
	}
	ws.once("close", release);
	const fail = (code, reason) => {
		if (stage === "failed") return;
		stage = "failed";
		clearTimeout(timer);
		ws.off("message", onMessage);
		closePreAuthSocket(code, reason);
	};
	const onMessage = (data, isBinary) => {
		if (isBinary) {
			fail(4003, "binary browser relay auth frames are not allowed");
			return;
		}
		if (boundedRawDataByteLength(data, 16384) > 16384) {
			fail(4003, "browser relay auth frame is too large");
			return;
		}
		const raw = rawDataToString(data);
		const parsed = parseStrictJsonObject(raw);
		if (stage === "hello") {
			const hello = parseRelayAuthHello(parsed);
			if (!hello) {
				fail(4003, "invalid browser relay auth hello");
				return;
			}
			const challenge = authority.issueChallenge(ws, hello, {
				role: params.binding?.role ?? "extension",
				transport: "websocket",
				method: "GET",
				resource: params.resource,
				flow: params.binding?.flow ?? "extension"
			});
			if (!challenge) {
				fail(4003, "browser relay auth rejected");
				return;
			}
			stage = "response";
			ws.send(JSON.stringify(challenge));
			return;
		}
		if (stage === "response") {
			const response = parseRelayAuthResponse(parsed);
			if (!response) {
				fail(4003, "invalid browser relay auth response");
				return;
			}
			const completed = authority.completeChallenge(ws, response);
			if (!completed) {
				fail(4003, "browser relay auth proof failed");
				return;
			}
			stage = "authenticated";
			clearTimeout(timer);
			removePreAuthGuard();
			params.prepareAuthenticated().then((attach) => {
				if (ws.readyState !== 1) return;
				ws.off("message", onMessage);
				attach();
				ws.send(JSON.stringify(completed.ok), (err) => {
					if (err) ws.close(1011, "browser relay auth acknowledgement failed");
				});
			}).catch((err) => {
				log$2.warn(`browser relay post-auth preparation failed: ${String(err)}`);
				fail(1011, "browser relay unavailable after authentication");
			});
			return;
		}
		fail(4003, "unexpected browser relay auth frame");
	};
	ws.on("message", onMessage);
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-protocol.ts
function hasExactOwnKeys(value, keys) {
	return Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}
function isRelayTabInfo(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	if (!hasExactOwnKeys(value, [
		"tabId",
		"url",
		"title",
		"active"
	])) return false;
	const tab = value;
	return Number.isSafeInteger(tab.tabId) && tab.tabId >= 0 && typeof tab.url === "string" && tab.url.length <= 16384 && typeof tab.title === "string" && tab.title.length <= 4096 && typeof tab.active === "boolean";
}
function isRelayTabInfoArray(value) {
	if (!Array.isArray(value) || value.length > 1e3 || !value.every(isRelayTabInfo)) return false;
	return new Set(value.map((tab) => tab.tabId)).size === value.length;
}
function isNonNegativeSafeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function isExtensionHelloMessage(value) {
	if (!hasExactOwnKeys(value, [
		"type",
		"userAgent",
		"browserVersion",
		"extensionVersion",
		"tabs"
	])) return false;
	const hello = value;
	if (hello.type !== "hello" || typeof hello.userAgent !== "string" || hello.userAgent.length === 0 || hello.userAgent.length > 2048 || typeof hello.browserVersion !== "string" || hello.browserVersion.length === 0 || hello.browserVersion.length > 512 || typeof hello.extensionVersion !== "string" || hello.extensionVersion.length === 0 || hello.extensionVersion.length > 128 || !isRelayTabInfoArray(hello.tabs)) return false;
	return true;
}
function isExtensionTabsMessage(msg) {
	return msg.type === "tabs" && isRelayTabInfoArray(msg.tabs);
}
function isExtensionCdpEventMessage(msg) {
	return msg.type === "cdpEvent" && isNonNegativeSafeInteger(msg.tabId) && (msg.sessionId === void 0 || typeof msg.sessionId === "string") && typeof msg.method === "string";
}
function isExtensionResultMessage(msg) {
	return msg.type === "result" && isNonNegativeSafeInteger(msg.seq);
}
function isExtensionErrorMessage(msg) {
	return msg.type === "error" && isNonNegativeSafeInteger(msg.seq) && typeof msg.message === "string";
}
function isExtensionDetachedMessage(msg) {
	return msg.type === "detached" && isNonNegativeSafeInteger(msg.tabId) && typeof msg.reason === "string";
}
function isExtensionPongMessage(msg) {
	return msg.type === "pong";
}
/** Parse one extension frame; returns null for malformed input. */
function parseExtensionMessage(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}
	if (!parsed || typeof parsed !== "object") return null;
	const msg = parsed;
	switch (msg.type) {
		case "hello": return isExtensionHelloMessage(msg) ? msg : null;
		case "tabs": return isExtensionTabsMessage(msg) ? msg : null;
		case "cdpEvent": return isExtensionCdpEventMessage(msg) ? msg : null;
		case "result": return isExtensionResultMessage(msg) ? msg : null;
		case "error": return isExtensionErrorMessage(msg) ? msg : null;
		case "detached": return isExtensionDetachedMessage(msg) ? msg : null;
		case "pong": return isExtensionPongMessage(msg) ? msg : null;
		default: return null;
	}
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/owner-server.ts
/** All references and streams belong to this authenticated connection, never to a token holder. */
function attachRelayOwner(params) {
	const { ws, bridge } = params;
	const controller = new AbortController();
	const captures = /* @__PURE__ */ new Map();
	const streams = /* @__PURE__ */ new Map();
	let nextStream = 0;
	let pending = 0;
	let closing;
	const assertCurrent = () => {
		controller.signal.throwIfAborted();
		if (!params.isCurrent()) throw new Error("Relay owner retired");
	};
	const send = (value) => {
		if (ws.readyState === 1) ws.send(JSON.stringify(value));
	};
	const captureFor = (ref) => {
		assertCurrent();
		const capture = captures.get(ref);
		if (!capture || capture.expires <= Date.now()) {
			captures.delete(ref);
			return;
		}
		return capture.isCurrent() ? capture : void 0;
	};
	const closeStream = async (id) => {
		const stream = streams.get(id);
		if (!stream) return;
		await (stream.closing ??= stream.close());
		if (streams.get(id) === stream) streams.delete(id);
		send({
			stream: id,
			closed: true
		});
	};
	const close = () => {
		controller.abort(/* @__PURE__ */ new Error("Relay owner connection closed"));
		for (const capture of captures.values()) clearTimeout(capture.timer);
		captures.clear();
		return closing ??= Promise.all([...streams.keys()].map(closeStream)).then(() => {});
	};
	ws.once("close", () => {
		close().catch(() => {});
	});
	ws.on("message", (raw) => {
		const message = parseStrictJsonObject(rawDataToString(raw));
		const streamFrame = relayOwnerFrame.safeParse(message);
		if (streamFrame.success) {
			const stream = streams.get(streamFrame.data.stream);
			try {
				assertCurrent();
				if (!stream || stream.closing || stream.ref && !captureFor(stream.ref)) throw new Error("Relay operation reference is no longer current");
				stream.onMessage(streamFrame.data.frame);
			} catch {
				closeStream(streamFrame.data.stream).catch(() => ws.close(1011, "relay cleanup failed"));
			}
			return;
		}
		const request = relayOwnerRequest.safeParse(message);
		if (!request.success || pending >= 64) {
			ws.close(4003, "invalid relay owner request");
			return;
		}
		pending += 1;
		const requestId = request.data.id;
		(async () => {
			const req = request.data;
			if (req.op !== "close" && req.op !== "stream.close" && req.op !== "release") assertCurrent();
			switch (req.op) {
				case "ready":
					await bridge.waitForExtensionConnection(controller.signal, req.timeoutMs);
					assertCurrent();
					return {
						ready: bridge.extensionConnected,
						identity: bridge.identity,
						generation: bridge.extensionGeneration,
						allowLegacyAuth: params.allowLegacyAuth
					};
				case "capture": {
					const captured = bridge.captureOperationTarget(req.targetId);
					if (!captured) return null;
					if (captures.size >= 64) throw new Error("Relay operation capacity reached");
					const ref = randomRelayId();
					const timer = setTimeout(() => {
						captures.delete(ref);
						for (const [id, stream] of streams) if (stream.ref === ref) closeStream(id).catch(() => ws.close(1011, "relay cleanup failed"));
					}, RELAY_OPERATION_TTL_MS);
					timer.unref?.();
					captures.set(ref, {
						resolve: captured,
						isCurrent: captured.isCurrent,
						expires: Date.now() + RELAY_OPERATION_TTL_MS,
						timer
					});
					return ref;
				}
				case "resolve": return captureFor(req.ref)?.resolve() ?? null;
				case "release": {
					const capture = captures.get(req.ref);
					if (capture) clearTimeout(capture.timer);
					captures.delete(req.ref);
					await Promise.all([...streams].filter(([, stream]) => stream.ref === req.ref).map(([id]) => closeStream(id)));
					return null;
				}
				case "cdp.open":
				case "ingress.open": {
					if (streams.size >= 64) throw new Error("Relay stream capacity reached");
					if (req.op === "cdp.open" && req.ref && !captureFor(req.ref)) throw new Error("Relay operation reference is no longer current");
					const id = ++nextStream;
					const socket = {
						send: (frame) => send({
							stream: id,
							frame
						}),
						close: () => {
							closeStream(id).catch(() => ws.close(1011, "relay cleanup failed"));
						}
					};
					if (req.op === "cdp.open") {
						const handlers = bridge.attachCdpClientSocket(socket);
						streams.set(id, {
							onMessage: handlers.onMessage,
							close: handlers.onClose,
							ref: req.ref
						});
					} else {
						const handlers = bridge.attachExtensionSocket(socket);
						const timer = setTimeout(() => socket.close(), 1e4);
						timer.unref?.();
						streams.set(id, {
							onMessage: (frame) => {
								if (parseExtensionMessage(frame)?.type === "hello") clearTimeout(timer);
								handlers.onMessage(frame);
							},
							close: async () => {
								clearTimeout(timer);
								handlers.onClose();
							}
						});
					}
					return id;
				}
				case "stream.close":
					await closeStream(req.stream);
					return null;
				case "close":
					await close();
					return null;
			}
			throw new Error("Unsupported relay owner operation");
		})().then((result) => send({
			id: requestId,
			result
		}), () => send({
			id: requestId,
			error: "Relay owner operation failed or was superseded"
		})).finally(() => {
			pending -= 1;
		});
	});
	return async () => {
		await close();
		if (ws.readyState === 1) await new Promise((resolve) => {
			ws.send(JSON.stringify({ retired: true }), () => resolve());
		});
	};
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/create-target-params.ts
function resolveCreateTargetParams(params) {
	const background = params?.background;
	const focus = params?.focus;
	if (background === true && focus === true) throw new Error("Target.createTarget does not support background=true with focus=true");
	const resolvedBackground = focus === void 0 ? background !== false : background === true && focus === false;
	return {
		background: resolvedBackground,
		focus: focus === true || focus === void 0 && !resolvedBackground
	};
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-command-timeout.ts
const EXTENSION_COMMAND_TIMEOUT_MS = 15e3;
const EXTENSION_AWAITED_RUNTIME_TIMEOUT_MS = resolveActWaitTimeoutMs(Number.MAX_SAFE_INTEGER) + BROWSER_ACTION_TRANSPORT_SLACK_MS;
function resolveExtensionRelayCommandTimeoutMs(command) {
	return command.type === "cdp" && (command.method === "Runtime.awaitPromise" || (command.method === "Runtime.evaluate" || command.method === "Runtime.callFunctionOn") && asOptionalRecord(command.params)?.awaitPromise === true) ? EXTENSION_AWAITED_RUNTIME_TIMEOUT_MS : EXTENSION_COMMAND_TIMEOUT_MS;
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-fetch.ts
const STREAM_PREFIX = "openclaw-fetch-stream:";
const REQUEST_COMMANDS = /* @__PURE__ */ new Set([
	"Fetch.continueRequest",
	"Fetch.continueResponse",
	"Fetch.continueWithAuth",
	"Fetch.failRequest",
	"Fetch.fulfillRequest",
	"Fetch.getResponseBody",
	"Fetch.takeResponseBodyAsStream"
]);
/** One physical Fetch domain; exact logical-session objects own its exclusive lease. */
var RelayFetch = class {
	constructor(send) {
		this.send = send;
		this.instanceId = randomUUID();
		this.nextLease = 0;
		this.nextStream = 0;
		this.state = { kind: "idle" };
		this.streams = /* @__PURE__ */ new Map();
		this.closedOwners = /* @__PURE__ */ new WeakSet();
	}
	command(owner, emit, method, params) {
		const input = asOptionalRecord(params);
		const handle = input?.handle;
		const ownedIO = (method === "IO.read" || method === "IO.close") && typeof handle === "string" && (handle.startsWith(STREAM_PREFIX) || [...this.streams.values()].some((stream) => stream.nativeHandle === handle));
		if (!method.startsWith("Fetch.") && !ownedIO) return;
		try {
			if (this.state.kind === "gone" || this.state.kind === "retiring" || this.closedOwners.has(owner)) throw new Error("Fetch session detached");
			if (ownedIO && typeof handle === "string") return this.streamCommand(owner, method, handle, input);
			if (method === "Fetch.enable") return this.enable(owner, emit, input);
			if (method === "Fetch.disable") {
				if (!("lease" in this.state) || this.state.lease.owner !== owner) return Promise.resolve({});
				return this.release(this.state.lease, "disable").then(() => ({}));
			}
			if (!REQUEST_COMMANDS.has(method)) throw new Error(`Unsupported Fetch command: ${method}`);
			const lease = this.ownedLease(owner);
			const requestId = input?.requestId;
			const nativeId = typeof requestId === "string" && requestId.startsWith(lease.prefix) ? requestId.slice(lease.prefix.length) : void 0;
			const pause = nativeId === void 0 ? void 0 : lease.pauses.get(nativeId);
			if (!pause) throw new Error("Invalid Fetch requestId for this session");
			this.validatePause(pause, method, input);
			return this.runPause(lease, pause, method, input);
		} catch (error) {
			return Promise.reject(error instanceof Error ? error : new Error(String(error)));
		}
	}
	event(method, params) {
		if (method !== "Fetch.requestPaused" && method !== "Fetch.authRequired") return false;
		const input = asOptionalRecord(params);
		const state = this.state;
		const lease = "lease" in state ? state.lease : void 0;
		if (!lease?.acceptEvents || typeof input?.requestId !== "string") return true;
		const kind = method === "Fetch.authRequired" ? "auth" : input.responseStatusCode !== void 0 || input.responseErrorReason !== void 0 ? "response" : "request";
		const nativeId = input.requestId;
		lease.pauses.set(nativeId, {
			nativeId,
			kind
		});
		if (this.state.kind === "owned" && !this.closedOwners.has(lease.owner)) {
			const redirectedRequestId = typeof input.redirectedRequestId === "string" ? lease.prefix + input.redirectedRequestId : void 0;
			lease.emit(method, {
				...input,
				requestId: lease.prefix + nativeId,
				...redirectedRequestId === void 0 ? {} : { redirectedRequestId }
			});
		}
		return true;
	}
	async close(owner) {
		this.closedOwners.add(owner);
		const state = this.state;
		if (state.kind === "uncertain" && state.lease.owner === owner) throw state.error;
		const lease = "lease" in state ? state.lease : void 0;
		if (lease?.owner === owner) await this.release(lease, "close");
		const errors = await this.closeStreamSnapshot([...this.streams].filter(([, stream]) => stream.owner === owner));
		if (errors.length > 0) throw new AggregateError(errors, "Fetch stream cleanup failed");
	}
	/**
	* Stop admission and run bounded best-effort cleanup before the physical owner detaches.
	* Existing hung commands are skipped; transport loss cannot guarantee fail-closed cancellation.
	*/
	prepareRetirement(timeoutMs) {
		if (this.retirement) return this.retirement;
		const lease = "lease" in this.state ? this.state.lease : void 0;
		if (lease) {
			this.closedOwners.add(lease.owner);
			lease.acceptEvents = false;
		}
		const pauses = lease ? [...lease.pauses.values()].filter((pause) => !pause.pending) : [];
		lease?.pauses.clear();
		const streams = [...this.streams];
		this.state = {
			kind: "retiring",
			...lease ? { lease } : {}
		};
		this.retirement = Promise.resolve().then(async () => {
			const errors = [];
			const cleanup = [...pauses.map((pause) => this.sendPauseCleanup(pause)), ...streams.map(([handle, stream]) => this.closeStream(handle, stream))];
			const settled = Promise.all(cleanup.map(async (operation) => {
				try {
					await operation;
				} catch (error) {
					errors.push(error);
				}
			}));
			let timer;
			const timedOut = await Promise.race([settled.then(() => false), new Promise((resolve) => {
				timer = setTimeout(() => resolve(true), timeoutMs);
				timer.unref?.();
			})]);
			if (timer) clearTimeout(timer);
			return { errors: [...errors, ...timedOut ? [/* @__PURE__ */ new Error(`Fetch retirement cleanup timed out after ${timeoutMs}ms`)] : []] };
		});
		return this.retirement;
	}
	/** Physical loss cannot be canceled through a successor transport. */
	dispose() {
		const state = this.state;
		const lease = "lease" in state ? state.lease : void 0;
		if (lease) {
			lease.acceptEvents = false;
			lease.pauses.clear();
		}
		this.streams.clear();
		this.state = { kind: "gone" };
	}
	ownedLease(owner) {
		if (this.state.kind === "uncertain") throw this.state.error;
		if (this.state.kind !== "owned" || this.state.lease.owner !== owner) throw new Error("Fetch interception is owned by another session or is being released");
		return this.state.lease;
	}
	assertLiveLease(lease) {
		if (!("lease" in this.state) || this.state.lease !== lease || this.state.kind === "retiring") throw new Error("Fetch attachment or lease retired");
		if (this.state.kind === "uncertain") throw this.state.error;
	}
	fence(lease, error) {
		if ("lease" in this.state && this.state.lease === lease && this.state.kind !== "retiring") {
			lease.acceptEvents = false;
			this.state = {
				kind: "uncertain",
				lease,
				error
			};
		}
	}
	async nativeFetch(lease, method, params) {
		this.assertLiveLease(lease);
		try {
			const result = await this.send(method, params);
			this.assertLiveLease(lease);
			return result;
		} catch (error) {
			this.fence(lease, error);
			throw error;
		}
	}
	enable(owner, emit, params) {
		if (this.state.kind === "idle") this.state = {
			kind: "owned",
			lease: {
				owner,
				emit,
				prefix: `openclaw-fetch:${this.instanceId}:${++this.nextLease}:`,
				pauses: /* @__PURE__ */ new Map(),
				operations: /* @__PURE__ */ new Set(),
				control: Promise.resolve(),
				acceptEvents: true
			}
		};
		const lease = this.ownedLease(owner);
		const operation = lease.control.then(async () => {
			this.assertLiveLease(lease);
			if (this.state.kind !== "owned") throw new Error("Fetch enable superseded by release");
			const result = await this.nativeFetch(lease, "Fetch.enable", params);
			this.assertLiveLease(lease);
			if (this.state.kind !== "owned" || this.closedOwners.has(owner)) throw new Error("Fetch enable superseded by release");
			return result;
		});
		this.trackOperation(lease, operation);
		lease.control = operation.then(() => void 0, () => void 0);
		return operation;
	}
	validatePause(pause, method, params) {
		if (pause.pending) throw new Error("Fetch request already has a command in flight");
		const auth = method === "Fetch.continueWithAuth";
		const body = method === "Fetch.getResponseBody" || method === "Fetch.takeResponseBodyAsStream";
		const response = pause.kind === "response" || pause.kind === "buffered";
		if (auth !== (pause.kind === "auth") || (body || method === "Fetch.continueResponse") && !response || method === "Fetch.takeResponseBodyAsStream" && pause.kind !== "response" || pause.kind === "stream" && method !== "Fetch.failRequest" && !(method === "Fetch.fulfillRequest" && typeof params?.body === "string")) throw new Error(`Invalid Fetch request stage for ${method}`);
	}
	runPause(lease, pause, method, params) {
		const operation = Promise.resolve().then(async () => {
			this.assertLiveLease(lease);
			if (lease.pauses.get(pause.nativeId) !== pause) throw new Error("Fetch pause retired before command dispatch");
			let result = await this.nativeFetch(lease, method, {
				...params,
				requestId: pause.nativeId
			});
			this.assertLiveLease(lease);
			if (method === "Fetch.takeResponseBodyAsStream") {
				const response = asOptionalRecord(result);
				if (typeof response?.stream !== "string") {
					const error = /* @__PURE__ */ new Error("Fetch stream response did not contain a stream handle");
					this.fence(lease, error);
					throw error;
				}
				const handle = `${STREAM_PREFIX}${this.instanceId}:${++this.nextStream}`;
				this.streams.set(handle, {
					owner: lease.owner,
					nativeHandle: response.stream,
					readable: true,
					reading: false
				});
				result = {
					...response,
					stream: handle
				};
			}
			if (lease.pauses.get(pause.nativeId) === pause) {
				if (method === "Fetch.getResponseBody") pause.kind = "buffered";
				else if (method === "Fetch.takeResponseBodyAsStream") pause.kind = "stream";
				else lease.pauses.delete(pause.nativeId);
			}
			pause.pending = void 0;
			if (this.closedOwners.has(lease.owner) || this.state.kind === "retiring") throw new Error("Fetch session closed during command");
			return result;
		});
		pause.pending = operation;
		this.trackOperation(lease, operation);
		return operation;
	}
	trackOperation(lease, operation) {
		lease.operations.add(operation);
		operation.finally(() => {
			lease.operations.delete(operation);
		}).catch(() => {});
	}
	release(lease, reason) {
		this.assertLiveLease(lease);
		if (this.state.kind === "releasing") {
			if (reason === "close") this.state.reason = "close";
			return this.state.done;
		}
		const done = Promise.resolve().then(async () => {
			await lease.control;
			await Promise.allSettled(lease.operations);
			this.assertLiveLease(lease);
			const closeRequested = this.state.kind === "releasing" && this.state.reason === "close";
			if (!closeRequested && [...lease.pauses.values()].some((pause) => pause.kind === "stream")) {
				this.state = {
					kind: "owned",
					lease
				};
				throw new Error("Fetch.disable requires streamed responses to be failed or fulfilled first");
			}
			lease.acceptEvents = false;
			if (closeRequested) {
				const pauses = [...lease.pauses.values()];
				const streams = [...this.streams].filter(([, stream]) => stream.owner === lease.owner);
				lease.pauses.clear();
				const errors = (await Promise.allSettled([...pauses.map((pause) => this.sendPauseCleanup(pause)), ...streams.map(([handle, stream]) => this.closeStream(handle, stream))])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				if (errors.length > 0) {
					const error = new AggregateError(errors, "Fetch owner cleanup failed");
					this.fence(lease, error);
					throw error;
				}
				await this.nativeFetch(lease, "Fetch.disable");
				this.state = { kind: "idle" };
				return;
			}
			await this.nativeFetch(lease, "Fetch.disable");
			lease.pauses.clear();
			this.state = { kind: "idle" };
		});
		this.state = {
			kind: "releasing",
			lease,
			reason,
			done
		};
		return done;
	}
	sendPauseCleanup(pause) {
		return pause.kind === "auth" ? this.send("Fetch.continueWithAuth", {
			requestId: pause.nativeId,
			authChallengeResponse: { response: "CancelAuth" }
		}) : this.send("Fetch.failRequest", {
			requestId: pause.nativeId,
			errorReason: "Aborted"
		});
	}
	streamCommand(owner, method, handle, params) {
		const stream = this.streams.get(handle);
		if (!stream || stream.owner !== owner || stream.closing) throw new Error("Invalid Fetch stream handle for this session");
		if (method === "IO.close") return this.closeStream(handle, stream);
		if (!stream.readable) throw new Error("Fetch stream is no longer readable");
		if (stream.reading) throw new Error("Fetch stream already has a read in flight");
		stream.reading = true;
		return this.send(method, {
			...params,
			handle: stream.nativeHandle
		}).then((result) => {
			if (this.streams.get(handle) !== stream || this.closedOwners.has(owner)) throw new Error("Fetch stream retired during read");
			return result;
		}).catch((error) => {
			stream.readable = false;
			throw error;
		}).finally(() => {
			stream.reading = false;
		});
	}
	closeStream(handle, stream) {
		stream.readable = false;
		return stream.closing ??= this.send("IO.close", { handle: stream.nativeHandle }).then((result) => {
			this.streams.delete(handle);
			return result;
		});
	}
	async closeStreamSnapshot(streams) {
		return (await Promise.allSettled(streams.map(([handle, stream]) => this.closeStream(handle, stream)))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	}
};
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-runtime.ts
/** One physical Runtime, subscribed by the same exact logical owners as Fetch. */
var RelayRuntime = class {
	constructor(active, sendBinding) {
		this.active = active;
		this.sendBinding = sendBinding;
		this.contexts = /* @__PURE__ */ new Map();
		this.subscribers = /* @__PURE__ */ new Map();
		this.bindings = /* @__PURE__ */ new Map();
		this.bindingQueue = Promise.resolve();
	}
	binding(owner, send, method, params) {
		if (!params || typeof params.name !== "string") return Promise.reject(/* @__PURE__ */ new Error("Binding name must be a string"));
		const name = params.name;
		let state = this.bindings.get(owner);
		if (!state) {
			state = {
				send,
				names: /* @__PURE__ */ new Set(),
				retired: false
			};
			this.bindings.set(owner, state);
		}
		const binding = state;
		return this.enqueueBinding(async () => {
			if (binding.retired) throw new Error("Runtime session detached");
			if (method === "Runtime.removeBinding") return this.removeBinding(binding, name);
			const result = await this.sendBinding(method, params);
			this.active.throwIfAborted();
			binding.names.add(name);
			if (binding.retired) throw new Error("Runtime session detached");
			return result;
		});
	}
	enqueueBinding(operation) {
		const result = this.bindingQueue.then(() => {
			this.active.throwIfAborted();
			return operation();
		});
		this.bindingQueue = result.catch(() => {});
		return result;
	}
	async removeBinding(binding, name) {
		if (!binding.names.has(name)) return {};
		let result = {};
		if (![...this.bindings.values()].some((peer) => peer !== binding && peer.names.has(name))) {
			result = await this.sendBinding("Runtime.removeBinding", { name });
			this.active.throwIfAborted();
		}
		binding.names.delete(name);
		return result;
	}
	retire(owner) {
		this.disable(owner);
		const binding = this.bindings.get(owner);
		if (binding) binding.retired = true;
	}
	close(owner) {
		const binding = this.bindings.get(owner);
		if (!binding) return Promise.resolve();
		return this.enqueueBinding(async () => {
			for (const name of binding.names) await this.removeBinding(binding, name);
			this.bindings.delete(owner);
		});
	}
	async enable(owner, send, admit) {
		this.active.throwIfAborted();
		let subscription = this.subscribers.get(owner);
		if (!subscription) {
			subscription = {
				send,
				pending: 0,
				delivered: /* @__PURE__ */ new Set()
			};
			this.subscribers.set(owner, subscription);
		}
		subscription.pending++;
		try {
			await admit();
			this.active.throwIfAborted();
			if (this.subscribers.get(owner) !== subscription) throw new Error("Runtime session detached or disabled");
			if (subscription.delivered) {
				for (const [id, params] of this.contexts) if (!subscription.delivered.has(id)) subscription.send("Runtime.executionContextCreated", params);
				subscription.delivered = void 0;
			}
		} finally {
			subscription.pending--;
			if (subscription.delivered && subscription.pending === 0 && this.subscribers.get(owner) === subscription) this.subscribers.delete(owner);
		}
	}
	disable(owner) {
		this.subscribers.delete(owner);
	}
	event(method, params) {
		if (this.active.aborted) return;
		if (method === "Runtime.bindingCalled") {
			const name = asOptionalRecord(params)?.name;
			if (typeof name === "string") {
				for (const binding of this.bindings.values()) if (!binding.retired && binding.names.has(name)) binding.send(method, params);
			}
			return;
		}
		const createdId = asOptionalRecord(asOptionalRecord(params)?.context)?.id;
		const destroyedId = asOptionalRecord(params)?.executionContextId;
		if (method === "Runtime.executionContextCreated" && typeof createdId === "number") this.contexts.set(createdId, params);
		else if (method === "Runtime.executionContextDestroyed" && typeof destroyedId === "number") this.contexts.delete(destroyedId);
		else if (method === "Runtime.executionContextsCleared") this.contexts.clear();
		for (const subscription of this.subscribers.values()) {
			if (method === "Runtime.executionContextCreated" && typeof createdId === "number") subscription.delivered?.add(createdId);
			else if (method === "Runtime.executionContextDestroyed" && typeof destroyedId === "number") subscription.delivered?.delete(destroyedId);
			else if (method === "Runtime.executionContextsCleared") subscription.delivered?.clear();
			subscription.send(method, params);
		}
	}
	dispose() {
		this.contexts.clear();
		this.subscribers.clear();
		this.bindings.clear();
	}
};
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-target.ts
const DEFAULT_FILTER = [
	{
		type: "browser",
		exclude: true
	},
	{
		type: "tab",
		exclude: true
	},
	{}
];
const matches = (filter, type) => {
	const entry = filter.find((candidate) => candidate.type === void 0 || candidate.type === type);
	return entry !== void 0 && entry.exclude !== true;
};
/** One native Target policy, projected onto exact logical parent interests. */
var RelayTarget = class {
	constructor(send, reconcile, assertActive) {
		this.send = send;
		this.reconcile = reconcile;
		this.assertActive = assertActive;
		this.interests = /* @__PURE__ */ new Map();
		this.tail = Promise.resolve();
		this.waiting = false;
	}
	enqueue(operation) {
		const pending = this.tail.then(() => {
			this.assertActive();
			return operation();
		});
		this.tail = pending.catch(() => {});
		return pending;
	}
	interest(owner, type) {
		const interest = this.interests.get(owner);
		return interest && matches(interest.filter, type) ? interest : void 0;
	}
	wanted(type) {
		return [...this.interests.values()].some((interest) => matches(interest.filter, type));
	}
	params() {
		if (!this.interests.size) return {
			autoAttach: false,
			waitForDebuggerOnStart: false,
			flatten: true
		};
		const filters = [...this.interests.values()].map((interest) => interest.filter);
		const fallback = filters.some((filter) => matches(filter));
		const union = [...new Set(filters.flatMap((filter) => filter.flatMap((entry) => entry.type === void 0 ? [] : [entry.type])))].toSorted().flatMap((type) => {
			const include = filters.some((filter) => matches(filter, type));
			return include === fallback ? [] : [{
				type,
				exclude: !include
			}];
		});
		if (fallback) union.push({});
		return {
			autoAttach: true,
			waitForDebuggerOnStart: this.waiting,
			flatten: true,
			filter: union
		};
	}
	command(owner, params, assertCurrent) {
		if (typeof params?.autoAttach !== "boolean" || typeof params.waitForDebuggerOnStart !== "boolean" || params.flatten !== void 0 && typeof params.flatten !== "boolean") throw new Error("Invalid Target auto-attach parameters");
		let filter = DEFAULT_FILTER;
		if (params.filter !== void 0) {
			if (!Array.isArray(params.filter)) throw new Error("Invalid Target filter");
			filter = params.filter.map((value) => {
				const entry = asOptionalRecord(value);
				if (!entry || entry.type !== void 0 && typeof entry.type !== "string" || entry.exclude !== void 0 && typeof entry.exclude !== "boolean") throw new Error("Invalid Target filter entry");
				return {
					...typeof entry.type === "string" ? { type: entry.type } : {},
					...typeof entry.exclude === "boolean" ? { exclude: entry.exclude } : {}
				};
			});
		}
		if (!params.autoAttach && params.filter !== void 0 && filter.length) throw new Error("Target filter should be empty when disabling auto-attach");
		const waiting = params.waitForDebuggerOnStart;
		const next = params.autoAttach ? {
			filter,
			flatten: params.flatten === true,
			admitted: false
		} : void 0;
		return this.enqueue(async () => {
			assertCurrent();
			if (next) this.interests.set(owner, next);
			else this.interests.delete(owner);
			this.waiting = waiting;
			try {
				await this.reconcile();
				const result = await this.send(this.params());
				assertCurrent();
				if (next && this.interests.get(owner) === next) next.admitted = true;
				await this.reconcile();
				return result;
			} catch (error) {
				if (this.interests.get(owner) === next) this.interests.delete(owner);
				throw error;
			}
		});
	}
	remove(owner) {
		if (!this.interests.delete(owner)) return;
		return this.enqueue(async () => {
			await this.reconcile();
			await this.send(this.params());
		});
	}
	dispose() {
		this.interests.clear();
	}
};
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-session-owner.ts
const SESSION_RETIREMENT_MS = 1e3;
/** Owns physical debugger lifetimes and their per-connection logical sessions. */
var RelaySessionOwner = class {
	constructor(clients, retireAttachment, report, hasPendingClaims) {
		this.clients = clients;
		this.retireAttachment = retireAttachment;
		this.report = report;
		this.hasPendingClaims = hasPendingClaims;
		this.physical = /* @__PURE__ */ new Map();
		this.nextAlias = 1;
	}
	registerRoot(tabId, nativeTargetId, sessionId, transport) {
		this.register({
			tabId,
			nativeTargetId,
			rootSessionId: sessionId,
			transport
		});
	}
	register(scope) {
		const active = new AbortController();
		const physical = {
			...scope,
			id: scope.childSessionId ?? scope.rootSessionId,
			runtime: new RelayRuntime(active.signal, (method, params) => this.send(physical, method, params)),
			target: new RelayTarget((params) => this.send(physical, "Target.setAutoAttach", params, "target"), () => this.reconcileChildren(physical), () => active.signal.throwIfAborted()),
			children: /* @__PURE__ */ new Set(),
			subscribers: /* @__PURE__ */ new Set(),
			active,
			lifetime: new AbortController(),
			fetch: new RelayFetch((method, params) => this.send(physical, method, params, "fetch"))
		};
		physical.parent?.children.add(physical);
		this.physical.set(scope.childSessionId ?? scope.rootSessionId, physical);
		return physical;
	}
	async send(physical, method, params, domain) {
		const assertCurrent = () => {
			physical.lifetime.signal.throwIfAborted();
			if (this.physical.get(physical.id) !== physical) throw new Error("Physical session detached");
		};
		assertCurrent();
		const signal = physical.active.signal.aborted ? physical.lifetime.signal : physical.active.signal;
		if (domain !== "fetch") physical.active.signal.throwIfAborted();
		try {
			const result = await physical.transport(physical.childSessionId, method, params, signal);
			assertCurrent();
			signal.throwIfAborted();
			if (method === "Runtime.runIfWaitingForDebugger" && physical.attached) physical.attached.waitingForDebugger = false;
			return result;
		} catch (error) {
			if (domain && !physical.active.signal.aborted) this.retireAttachment(physical.rootSessionId).catch(this.report);
			throw error;
		}
	}
	announce(client, sessionId, physicalId, params, parentSessionId, flat = true) {
		const physical = this.physical.get(physicalId);
		if (!physical || physical.active.signal.aborted || !this.clients.has(client) || client.sessions.has(sessionId)) return;
		const parent = parentSessionId ? client.sessions.get(parentSessionId) : void 0;
		const session = {
			physical,
			client,
			id: sessionId,
			parentSessionId,
			parent,
			children: /* @__PURE__ */ new Map(),
			flat,
			detachedChildren: /* @__PURE__ */ new Set(),
			runtimeGeneration: 0
		};
		client.sessions.set(sessionId, session);
		physical.subscribers.add(session);
		parent?.children.set(physical, session);
		this.parentEvent(session, "Target.attachedToTarget", params);
	}
	deliver(session, payload, flatId = session.id) {
		if (session.parent && !session.flat) {
			const message = flatId === session.id ? payload : {
				...payload,
				sessionId: flatId
			};
			this.deliver(session.parent, {
				method: "Target.receivedMessageFromTarget",
				params: {
					sessionId: session.id,
					targetId: session.physical.nativeTargetId,
					message: JSON.stringify(message)
				}
			});
		} else if (session.parent) this.deliver(session.parent, payload, flatId);
		else session.client.socket.send(JSON.stringify({
			...payload,
			sessionId: flatId
		}));
	}
	child(parent, params) {
		const child = params?.sessionId !== void 0 ? typeof params.sessionId === "string" ? parent.client.sessions.get(params.sessionId) : void 0 : [...parent.children.values()].find((candidate) => candidate.physical.nativeTargetId === params?.targetId);
		if (!child || child.parent !== parent) throw new Error("Target child session not found");
		return child;
	}
	parentEvent(session, method, params) {
		if (session.parent) this.deliver(session.parent, {
			method,
			params
		});
		else session.client.socket.send(JSON.stringify({
			sessionId: session.parentSessionId,
			method,
			params
		}));
	}
	emit(session, payload) {
		if (this.clients.has(session.client) && session.client.sessions.get(session.id) === session) this.deliver(session, payload);
	}
	childWanted(child) {
		const parent = child.parent;
		return Boolean(parent && [...parent.subscribers].some((session) => !session.detachedChildren.has(child) && parent.target.interest(session, String(child.attached?.targetInfo.type))));
	}
	projectChild(parent, child) {
		const info = child.attached;
		const interest = parent.physical.target.interest(parent, String(info?.targetInfo.type));
		if (!info || !interest?.admitted || parent.children.has(child) || parent.detachedChildren.has(child)) return;
		const id = `openclaw-child-${this.nextAlias++}`;
		this.announce(parent.client, id, child.id, {
			...info,
			sessionId: id
		}, parent.id, interest.flatten);
	}
	async reconcileChildren(physical) {
		if (physical.active.signal.aborted) return;
		const removed = [];
		for (const parent of physical.subscribers) for (const child of physical.children) {
			const info = child.attached;
			if (!info || child.active.signal.aborted) continue;
			const interest = physical.target.interest(parent, String(info.targetInfo.type));
			const existing = parent.children.get(child);
			if (existing && (!interest || existing.flat !== interest.flatten)) removed.push(...this.remove(existing.client, existing.id));
			this.projectChild(parent, child);
		}
		await Promise.all([...physical.children].map(async (child) => {
			if (!child.subscribers.size && !this.childWanted(child)) await this.retire(child.id, () => this.send(physical, "Target.detachFromTarget", { sessionId: child.childSessionId }, "target").then(() => {}));
		}));
		await this.release(removed, physical);
	}
	remove(client, sessionId) {
		const session = client.sessions.get(sessionId);
		if (!session) return [];
		session.physical.runtime.retire(session);
		client.sessions.delete(sessionId);
		session.physical.subscribers.delete(session);
		session.parent?.children.delete(session.physical);
		if (this.clients.has(client)) this.parentEvent(session, "Target.detachedFromTarget", {
			sessionId,
			targetId: session.physical.nativeTargetId
		});
		return [session, ...[...session.children.values()].flatMap((child) => this.remove(client, child.id))];
	}
	detach(client, sessionId) {
		const session = client.sessions.get(sessionId);
		session?.parent?.detachedChildren.add(session.physical);
		return this.release(this.remove(client, sessionId));
	}
	detachChildren(client, parentSessionId) {
		return this.release([...client.sessions].filter(([, session]) => session.parentSessionId === parentSessionId).flatMap(([id]) => this.remove(client, id)));
	}
	async release(sessions, reconciling) {
		await Promise.all(sessions.map(async (session) => {
			const physical = session.physical;
			if (physical.active.signal.aborted) return;
			if (!this.hasRootSessions(physical.rootSessionId) && !this.hasPendingClaims(physical.tabId)) {
				await this.retireAttachment(physical.rootSessionId);
				return;
			}
			const parent = physical.parent;
			if (parent && !physical.subscribers.size && !this.childWanted(physical) && parent !== reconciling) {
				await parent.target.enqueue(() => this.reconcileChildren(parent));
				return;
			}
			const targetCleanup = physical.target.remove(session);
			let timer;
			try {
				await Promise.all([targetCleanup, Promise.race([Promise.all([physical.fetch.close(session), physical.runtime.close(session)]), new Promise((_resolve, reject) => {
					timer = setTimeout(() => reject(/* @__PURE__ */ new Error("Session owner cleanup timed out")), SESSION_RETIREMENT_MS);
					timer.unref?.();
				})])]);
			} catch (error) {
				await this.retireAttachment(physical.rootSessionId);
				throw error;
			} finally {
				clearTimeout(timer);
			}
			if (parent && parent !== reconciling && !physical.subscribers.size) await parent.target.enqueue(() => this.reconcileChildren(parent));
		}));
	}
	retire(sessionId, detach) {
		const physical = this.physical.get(sessionId);
		if (!physical) return Promise.resolve();
		const descendants = (scope) => [scope, ...[...scope.children].flatMap(descendants)];
		const scopes = descendants(physical);
		for (const scope of scopes) {
			scope.active.abort(/* @__PURE__ */ new Error("Physical session detached"));
			scope.runtime.dispose();
			scope.target.dispose();
			for (const session of scope.subscribers) this.remove(session.client, session.id);
		}
		const dispose = () => {
			for (const scope of scopes) {
				scope.lifetime.abort(/* @__PURE__ */ new Error("Physical session detached"));
				scope.fetch.dispose();
				scope.parent?.children.delete(scope);
				for (const parent of scope.parent?.subscribers ?? []) parent.detachedChildren.delete(scope);
				const id = scope.childSessionId ?? scope.rootSessionId;
				if (this.physical.get(id) === scope) this.physical.delete(id);
			}
		};
		if (!detach) {
			dispose();
			return physical.retiring ?? Promise.resolve();
		}
		if (physical.retiring) return physical.retiring;
		const preparations = scopes.map((scope) => scope.fetch.prepareRetirement(SESSION_RETIREMENT_MS));
		return physical.retiring = (async () => {
			try {
				const results = await Promise.all(preparations);
				for (const result of results) for (const error of result.errors) this.report(error);
			} finally {
				const needsDetach = !physical.lifetime.signal.aborted;
				dispose();
				if (needsDetach) await detach();
			}
		})();
	}
	retireTab(tabId) {
		for (const [id, scope] of this.physical) if (scope.tabId === tabId) this.retire(id);
	}
	hasRootSessions(id) {
		return (this.physical.get(id)?.subscribers.size ?? 0) > 0;
	}
	close(client) {
		return this.release([...client.sessions.keys()].flatMap((id) => this.remove(client, id)));
	}
	forward(rootSessionId, childSessionId, method, params) {
		const sessionId = childSessionId ?? rootSessionId;
		const physical = this.physical.get(sessionId);
		if (!physical || physical.active.signal.aborted || physical.rootSessionId !== rootSessionId) return;
		if (physical.fetch.event(method, params)) return;
		if (method.startsWith("Runtime.")) {
			physical.runtime.event(method, params);
			return;
		}
		if (method === "Target.detachedFromTarget") {
			const detached = asOptionalRecord(params);
			if (typeof detached?.sessionId === "string" && this.physical.get(detached.sessionId)?.parent === physical) this.retire(detached.sessionId);
			return;
		}
		if (method === "Target.targetInfoChanged") {
			const info = asOptionalRecord(asOptionalRecord(params)?.targetInfo);
			const child = [...physical.children].find((candidate) => candidate.nativeTargetId === info?.targetId);
			if (child?.attached && info && typeof info.type === "string") {
				child.attached.targetInfo = info;
				for (const parent of physical.subscribers) if (parent.children.has(child) && physical.target.interest(parent, info.type)?.admitted) this.emit(parent, {
					method,
					params
				});
				physical.target.enqueue(() => this.reconcileChildren(physical)).catch(this.report);
				return;
			}
		}
		if (method === "Target.attachedToTarget") {
			const attached = asOptionalRecord(params);
			const childId = attached?.sessionId;
			const nativeTargetId = asOptionalRecord(attached?.targetInfo)?.targetId;
			if (typeof childId !== "string" || typeof nativeTargetId !== "string") {
				this.report(/* @__PURE__ */ new Error("Native child attachment is missing its session or target identity"));
				return;
			}
			const targetInfo = asOptionalRecord(attached?.targetInfo);
			if (!targetInfo || typeof targetInfo.type !== "string" || !nativeTargetId) {
				this.report(/* @__PURE__ */ new Error("Native child attachment is missing its target type"));
				return;
			}
			if (!this.physical.has(childId)) {
				const child = this.register({
					tabId: physical.tabId,
					nativeTargetId,
					rootSessionId,
					childSessionId: childId,
					parent: physical,
					transport: physical.transport
				});
				child.attached = {
					targetInfo,
					waitingForDebugger: attached?.waitingForDebugger === true
				};
			}
			const child = this.physical.get(childId);
			if (!child || child.parent !== physical || child.active.signal.aborted) return;
			for (const parent of physical.subscribers) this.projectChild(parent, child);
			if (!physical.target.wanted(targetInfo.type)) physical.target.enqueue(() => this.reconcileChildren(physical)).catch(this.report);
			return;
		}
		for (const session of physical.subscribers) this.emit(session, {
			method,
			params
		});
	}
	dispose() {
		for (const id of this.physical.keys()) this.retire(id);
		for (const client of this.clients) client.sessions.clear();
	}
};
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-bridge.ts
/**
* Extension relay CDP bridge.
*
* Presents a CDP browser endpoint (compatible with Playwright connectOverCDP)
* on one side and the OpenClaw Chrome extension's chrome.debugger transport on
* the other. The bridge owns all Target.* synthesis so the extension stays a
* thin forwarder — the old assets/chrome-extension put this logic in an
* untestable MV3 service worker, which is why it rotted and was removed.
*/
const log$1 = createSubsystemLogger("browser").child("extension-relay");
/** App-level keepalive interval; message traffic keeps the MV3 worker alive. */
const EXTENSION_PING_INTERVAL_MS = 2e4;
/** Synthetic targetId for the emulated browser target. */
const BROWSER_TARGET_ID = "openclaw-extension-relay";
/** Playwright requires every attached page target to identify its browser context. */
const BROWSER_CONTEXT_ID = "openclaw-extension-context";
function toErrorPayload(id, sessionId, message, code = -32e3) {
	return JSON.stringify({
		id,
		...sessionId ? { sessionId } : {},
		error: {
			code,
			message
		}
	});
}
/**
* One relay bridge per extension-driver profile. Accepts at most one extension
* connection (a newer one replaces the old — MV3 workers restart freely) and
* any number of CDP clients (pw-session caches one per cdpUrl in practice).
*/
var ExtensionRelayBridge = class {
	constructor(opts = {}) {
		this.extension = null;
		this.extensionGeneration = 0;
		this.extensionCandidates = /* @__PURE__ */ new Set();
		this.clients = /* @__PURE__ */ new Set();
		this.tabs = /* @__PURE__ */ new Map();
		this.browserSessions = /* @__PURE__ */ new Map();
		this.sessions = new RelaySessionOwner(this.clients, (root) => this.retireAttachment(root), (error) => log$1.warn(`Debugger cleanup incomplete: ${String(error)}`), (tabId) => (this.tabs.get(tabId)?.claimants.size ?? 0) > 0);
		this.pendingExtension = /* @__PURE__ */ new Map();
		this.nextSeq = 1;
		this.nextSessionOrdinal = 1;
		this.nextExtensionCandidateOrdinal = 1;
		this.latestPromotedCandidateOrdinal = 0;
		this.pingTimer = null;
		this.missedPongs = 0;
		this.connectionEvents = new EventTarget();
		this.onStateChange = opts.onStateChange;
	}
	/** True once an extension socket completed its hello handshake. */
	get extensionConnected() {
		return this.extension !== null;
	}
	/** Wait for an authenticated extension hello without polling its CDP endpoint. */
	async waitForExtensionConnection(signal, timeoutMs) {
		if (this.extensionConnected) return true;
		const timeout = new AbortController();
		const timer = setTimeout(() => timeout.abort(), timeoutMs);
		try {
			await once(this.connectionEvents, "ready", { signal: AbortSignal.any([signal, timeout.signal]) });
			return this.extensionConnected;
		} catch (error) {
			signal.throwIfAborted();
			if (timeout.signal.aborted) return false;
			throw error;
		} finally {
			clearTimeout(timer);
		}
	}
	/** Identity of the paired browser, when connected. */
	get identity() {
		return this.extension?.identity ?? null;
	}
	/** Tabs currently reported as accessible by the extension. */
	accessibleTabs() {
		return [...this.tabs.values()].map((tab) => tab.info);
	}
	/** Capture the exact extension connection and tab instance for one browser operation. */
	captureOperationTarget(targetId) {
		const extension = this.extension;
		const target = this.tabByTargetId(targetId);
		if (!extension || !target) return;
		const isCurrent = () => this.extension === extension && this.tabs.get(target.tabId) === target.tab;
		return Object.assign(() => isCurrent() && target.tab.target?.sessionId ? target.tab.target.id : void 0, { isCurrent });
	}
	/**
	* DevTools-style descriptors for `/json/list`: RelayTabInfo plus the `id`
	* and `type` fields CDP discovery clients expect. `id` is the live debugger
	* targetId once a tab is attached; before that it is the same `tab-<tabId>`
	* discovery-only placeholder; native attachment never fabricates an identity.
	* No per-target webSocketDebuggerUrl: all CDP traffic multiplexes over the
	* single browser endpoint (`/cdp`).
	*/
	devtoolsTargetDescriptors() {
		return [...this.tabs.values()].map((tab) => ({
			tabId: tab.info.tabId,
			url: tab.info.url,
			title: tab.info.title,
			active: tab.info.active,
			id: tab.target?.id ?? `tab-${tab.info.tabId}`,
			type: "page"
		}));
	}
	/** Number of connected CDP clients (diagnostics). */
	get cdpClientCount() {
		return this.clients.size;
	}
	/** Wire up a newly accepted extension WebSocket. */
	attachExtensionSocket(socket) {
		const candidateOrdinal = this.nextExtensionCandidateOrdinal++;
		let candidateState = "awaiting-hello";
		this.extensionCandidates.add(socket);
		const rejectCandidate = (code, reason) => {
			candidateState = "rejected";
			this.extensionCandidates.delete(socket);
			socket.close(code, reason);
		};
		const onMessage = (raw) => {
			if (candidateState === "rejected") return;
			const msg = parseExtensionMessage(raw);
			if (candidateState === "awaiting-hello") {
				if (msg?.type !== "hello") {
					rejectCandidate(4001, "expected valid hello");
					return;
				}
				if (candidateOrdinal < this.latestPromotedCandidateOrdinal) {
					rejectCandidate(4e3, "superseded by newer extension connection");
					return;
				}
				candidateState = "active";
				this.extensionCandidates.delete(socket);
				this.latestPromotedCandidateOrdinal = candidateOrdinal;
				if (this.extension) {
					log$1.info("extension reconnected; replacing previous relay connection");
					const previous = this.extension;
					previous.socket.close(4e3, "replaced by newer extension connection");
					if (this.extension === previous) this.handleExtensionGone();
				}
				this.extensionGeneration += 1;
				this.extension = {
					socket,
					identity: {
						userAgent: msg.userAgent,
						browserVersion: msg.browserVersion,
						extensionVersion: msg.extensionVersion
					}
				};
				this.syncTabs(msg.tabs);
				this.startPing();
				this.connectionEvents.dispatchEvent(new Event("ready"));
				this.onStateChange?.();
				return;
			}
			if (this.extension?.socket !== socket) return;
			if (!msg) {
				log$1.warn("dropping malformed extension relay frame");
				return;
			}
			this.handleExtensionMessage(msg);
		};
		const onClose = () => {
			candidateState = "rejected";
			this.extensionCandidates.delete(socket);
			if (this.extension?.socket === socket) {
				this.handleExtensionGone();
				this.onStateChange?.();
			}
		};
		return {
			onMessage,
			onClose
		};
	}
	handleExtensionMessage(msg) {
		switch (msg.type) {
			case "result": {
				const pending = this.pendingExtension.get(msg.seq);
				if (pending) {
					this.pendingExtension.delete(msg.seq);
					clearTimeout(pending.timer);
					pending.resolve(msg.result);
				}
				return;
			}
			case "error": {
				const pending = this.pendingExtension.get(msg.seq);
				if (pending) {
					this.pendingExtension.delete(msg.seq);
					clearTimeout(pending.timer);
					pending.reject(new Error(msg.message));
				}
				return;
			}
			case "cdpEvent": {
				const root = this.tabs.get(msg.tabId)?.target?.sessionId;
				if (root) this.sessions.forward(root, msg.sessionId, msg.method, msg.params);
				return;
			}
			case "tabs":
				this.syncTabs(msg.tabs);
				return;
			case "detached": {
				const tab = this.tabs.get(msg.tabId);
				const recover = tab !== void 0 && msg.reason === "target_closed" && !tab.retiring;
				if (tab) {
					tab.attaching = void 0;
					tab.restoreAttachment = recover;
				}
				this.sessions.retireTab(msg.tabId);
				if (tab?.target) tab.target.sessionId = void 0;
				if (recover) this.autoAttachTab(msg.tabId);
				break;
			}
			case "pong": this.missedPongs = 0;
		}
	}
	handleExtensionGone() {
		this.extension = null;
		this.stopPing();
		for (const pending of this.pendingExtension.values()) {
			clearTimeout(pending.timer);
			pending.reject(/* @__PURE__ */ new Error("extension disconnected"));
		}
		this.pendingExtension.clear();
		this.sessions.dispose();
		for (const tab of this.tabs.values()) {
			tab.restoreAttachment ||= tab.target?.sessionId !== void 0 || tab.attaching !== void 0;
			tab.attaching = void 0;
			tab.retiring = void 0;
			tab.target = void 0;
		}
	}
	startPing() {
		this.stopPing();
		const owner = this.extension;
		this.pingTimer = setInterval(() => {
			if (!owner || this.extension !== owner) return;
			if (++this.missedPongs > 2) {
				owner.socket.close(4e3, "extension heartbeat timeout");
				if (this.extension === owner) {
					this.handleExtensionGone();
					this.onStateChange?.();
				}
				return;
			}
			this.sendToExtension({ type: "ping" });
		}, EXTENSION_PING_INTERVAL_MS);
		this.pingTimer.unref?.();
	}
	stopPing() {
		this.missedPongs = 0;
		if (this.pingTimer) {
			clearInterval(this.pingTimer);
			this.pingTimer = null;
		}
	}
	sendToExtension(msg) {
		if (!this.extension) throw new Error("OpenClaw Chrome extension is not connected to the relay");
		this.extension.socket.send(JSON.stringify(msg));
	}
	callExtension(command, signal) {
		signal?.throwIfAborted();
		const seq = this.nextSeq++;
		let abortListener;
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				this.pendingExtension.delete(seq);
				reject(/* @__PURE__ */ new Error(`extension relay command timed out: ${command.type}`));
			}, resolveExtensionRelayCommandTimeoutMs(command));
			timer.unref?.();
			this.pendingExtension.set(seq, {
				resolve,
				reject,
				timer
			});
			if (signal) abortListener = addAbortListener(signal, () => {
				this.pendingExtension.delete(seq);
				clearTimeout(timer);
				reject(/* @__PURE__ */ new Error("Physical session detached"));
			});
			try {
				this.sendToExtension({
					...command,
					seq
				});
			} catch (err) {
				this.pendingExtension.delete(seq);
				clearTimeout(timer);
				reject(err instanceof Error ? err : new Error(String(err)));
			}
		}).finally(() => abortListener?.[Symbol.dispose]());
	}
	syncTabs(tabs) {
		const nextIds = new Set(tabs.map((tab) => tab.tabId));
		for (const tabId of this.tabs.keys()) if (!nextIds.has(tabId)) {
			this.sessions.retireTab(tabId);
			this.tabs.delete(tabId);
			for (const client of this.clients) client.detachedTabs.delete(tabId);
		}
		for (const info of tabs) {
			const existing = this.tabs.get(info.tabId);
			const shouldAttach = !existing || existing.restoreAttachment;
			if (existing) existing.info = info;
			else this.tabs.set(info.tabId, {
				info,
				claimants: /* @__PURE__ */ new Set(),
				restoreAttachment: false
			});
			if (shouldAttach) this.autoAttachTab(info.tabId);
		}
	}
	autoAttachTab(tabId) {
		for (const client of this.autoAttachRecipients(tabId)) this.withAttachedTab(client, tabId, (attached) => {
			this.announceAttachedTab(tabId, attached, this.autoAttachRecipients(tabId, attached.sessionId));
		}).catch((err) => log$1.warn(`auto-attach of accessible tab ${tabId} failed: ${String(err)}`));
	}
	async withAttachedTab(client, tabId, use, createdTargetId) {
		const tab = this.tabs.get(tabId);
		const extension = this.extension;
		if (!tab) throw new Error(`tab ${tabId} is not available to OpenClaw`);
		const claimant = { client };
		tab.claimants.add(claimant);
		try {
			const attached = await this.ensureTabAttached(tabId, createdTargetId);
			if (!this.clients.has(client) || this.tabs.get(tabId) !== tab || this.extension !== extension) throw new Error("Target claimant retired");
			return use(attached);
		} finally {
			tab.claimants.delete(claimant);
			this.detachUnusedAttachments();
		}
	}
	async ensureTabAttached(tabId, createdTargetId) {
		const extension = this.extension;
		const tab = this.tabs.get(tabId);
		if (!tab) throw new Error(`tab ${tabId} is not available to OpenClaw`);
		if (tab.retiring) {
			await tab.retiring;
			if (this.tabs.get(tabId) !== tab || this.extension !== extension) throw new Error(`tab ${tabId} closed during retirement`);
		}
		if (tab.target?.sessionId) return {
			targetId: tab.target.id,
			sessionId: tab.target.sessionId
		};
		if (tab.attaching) return await tab.attaching;
		const attaching = (createdTargetId !== void 0 ? Promise.resolve({ targetId: createdTargetId }) : this.callExtension({
			type: "attach",
			tabId
		})).then(async (response) => {
			const targetId = asOptionalRecord(response)?.targetId;
			if (typeof targetId !== "string" || !targetId) {
				if (this.extension === extension && this.tabs.get(tabId) === tab && tab.attaching === attaching) await this.callExtension({
					type: "detach",
					tabId
				});
				throw new Error("Extension did not return a native target identity");
			}
			const sessionId = `openclaw-tab-${tabId}-${this.nextSessionOrdinal++}`;
			const attached = {
				targetId,
				sessionId
			};
			const current = this.tabs.get(tabId);
			if (current !== tab || this.extension !== extension || tab.attaching !== attaching) throw new Error(`tab ${tabId} closed during attach`);
			current.target = {
				id: targetId,
				sessionId
			};
			this.sessions.registerRoot(tabId, targetId, sessionId, async (childSessionId, method, params, signal) => {
				const assertCurrent = () => {
					signal.throwIfAborted();
					if (this.extension !== extension || this.tabs.get(tabId) !== tab) throw new Error("Extension or tab generation retired");
				};
				assertCurrent();
				const commandResult = await this.callExtension({
					type: "cdp",
					tabId,
					...childSessionId ? { sessionId: childSessionId } : {},
					method,
					params
				}, signal);
				assertCurrent();
				return commandResult;
			});
			current.restoreAttachment = false;
			return attached;
		});
		tab.attaching = attaching;
		try {
			return await attaching;
		} finally {
			if (tab.attaching === attaching) tab.attaching = void 0;
		}
	}
	targetInfoForTab(tab, targetId) {
		return {
			targetId,
			type: "page",
			title: tab.info.title,
			url: tab.info.url,
			browserContextId: BROWSER_CONTEXT_ID,
			attached: Boolean(tab.target?.sessionId),
			canAccessOpener: false
		};
	}
	autoAttachRecipients(tabId, sessionId) {
		return [...this.clients].filter((candidate) => candidate.autoAttach && !candidate.detachedTabs.has(tabId) && (!sessionId || !candidate.sessions.has(sessionId)));
	}
	async enumerateTargetInfos(client) {
		if (!this.extensionConnected) return {
			status: "unavailable",
			reason: "extension-disconnected"
		};
		const identities = /* @__PURE__ */ new Map();
		while (this.extensionConnected) {
			const pending = [...this.tabs].filter(([, tab]) => !identities.has(tab));
			if (pending.length === 0) break;
			for (const [, tab] of pending) identities.set(tab, void 0);
			await Promise.allSettled(pending.map(([tabId, tab]) => this.withAttachedTab(client, tabId, (attached) => {
				this.announceAttachedTab(tabId, attached, this.autoAttachRecipients(tabId, attached.sessionId));
				identities.set(tab, attached.targetId);
			})));
		}
		if (!this.extensionConnected) return {
			status: "unavailable",
			reason: "extension-disconnected"
		};
		const targetInfos = [];
		for (const [tabId, tab] of this.tabs) {
			const targetId = identities.get(tab);
			if (!targetId || !tab.target?.sessionId && this.autoAttachRecipients(tabId).length > 0) return {
				status: "unavailable",
				reason: "target-identity-unresolved"
			};
			targetInfos.push(this.targetInfoForTab(tab, targetId));
		}
		return {
			status: "available",
			targetInfos
		};
	}
	announceAttachedTab(tabId, attached, recipients) {
		const tab = this.tabs.get(tabId);
		const { targetId, sessionId } = attached;
		if (tab?.target?.sessionId !== sessionId) return;
		const params = {
			sessionId,
			targetInfo: this.targetInfoForTab(tab, targetId),
			waitingForDebugger: false
		};
		for (const client of recipients) this.sessions.announce(client, sessionId, sessionId, params);
	}
	/** Wire up a newly accepted CDP client WebSocket. */
	attachCdpClientSocket(socket) {
		const client = {
			socket,
			autoAttach: false,
			detachedTabs: /* @__PURE__ */ new Set(),
			sessions: /* @__PURE__ */ new Map(),
			creating: /* @__PURE__ */ new Set()
		};
		this.clients.add(client);
		const onMessage = (raw) => {
			if (!this.clients.has(client)) return;
			let parsed;
			try {
				parsed = JSON.parse(raw);
			} catch {
				client.socket.send(toErrorPayload(null, void 0, "Parse error", -32700));
				return;
			}
			if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
				client.socket.send(toErrorPayload(null, void 0, "Invalid request", -32600));
				return;
			}
			const request = parsed;
			if (typeof request.id !== "number" || typeof request.method !== "string") {
				const id = typeof request.id === "number" ? request.id : null;
				const sessionId = typeof request.sessionId === "string" ? request.sessionId : void 0;
				client.socket.send(toErrorPayload(id, sessionId, "Invalid request", -32600));
				return;
			}
			this.handleCdpRequest(client, request);
		};
		const onClose = async () => {
			this.clients.delete(client);
			const acquisitions = [...client.creating];
			for (const tab of this.tabs.values()) for (const claim of tab.claimants) if (claim.client === client) {
				tab.claimants.delete(claim);
				if (tab.attaching) acquisitions.push(tab.attaching.then(() => this.detachUnusedAttachments()));
			}
			const cleanup = this.sessions.close(client);
			for (const [sessionId, owner] of this.browserSessions) if (owner === client) this.browserSessions.delete(sessionId);
			await Promise.all([
				cleanup,
				...acquisitions,
				this.detachUnusedAttachments()
			]);
		};
		return {
			onMessage,
			onClose
		};
	}
	/**
	* Release a tab only after its last pending or delivered logical claimant leaves.
	*/
	detachUnusedAttachments() {
		if (!this.extension) return Promise.resolve();
		const retirements = [];
		for (const tab of this.tabs.values()) if (tab.retiring) retirements.push(tab.retiring);
		else if (tab.target?.sessionId && tab.claimants.size === 0 && !this.sessions.hasRootSessions(tab.target.sessionId)) retirements.push(this.retireAttachment(tab.target.sessionId));
		const cleanup = Promise.all(retirements).then(() => {});
		cleanup.catch((error) => log$1.warn(`Debugger retirement failed: ${String(error)}`));
		return cleanup;
	}
	retireAttachment(rootSessionId) {
		const entry = [...this.tabs].find(([, tab]) => tab.target?.sessionId === rootSessionId);
		if (!entry) return Promise.resolve();
		const [tabId, tab] = entry;
		const extension = this.extension;
		const target = tab.target;
		if (!target) return Promise.resolve();
		target.sessionId = void 0;
		const retiring = this.sessions.retire(rootSessionId, async () => {
			if (this.extension === extension && this.tabs.get(tabId) === tab) await this.callExtension({
				type: "detach",
				tabId
			});
		});
		tab.retiring = retiring;
		retiring.finally(() => {
			if (tab.retiring === retiring) tab.retiring = void 0;
		}).catch(() => {});
		return retiring;
	}
	respond(client, request, result) {
		if (!this.clients.has(client)) return;
		const logical = request.sessionId ? client.sessions.get(request.sessionId) : void 0;
		if (logical) {
			this.sessions.emit(logical, {
				id: request.id,
				result: result ?? {}
			});
			return;
		}
		client.socket.send(JSON.stringify({
			id: request.id,
			...request.sessionId ? { sessionId: request.sessionId } : {},
			result: result ?? {}
		}));
	}
	respondError(client, request, message, code = -32e3) {
		if (this.clients.has(client)) {
			const logical = request.sessionId ? client.sessions.get(request.sessionId) : void 0;
			if (logical) this.sessions.emit(logical, {
				id: request.id,
				error: {
					code,
					message
				}
			});
			else client.socket.send(toErrorPayload(request.id, request.sessionId, message, code));
		}
	}
	tabByTargetId(targetId) {
		for (const [tabId, tab] of this.tabs) if (tab.target?.id === targetId) return {
			tabId,
			tab
		};
		return null;
	}
	async createTarget(client, request) {
		const extension = this.extension;
		const url = typeof request.params?.url === "string" && request.params.url ? request.params.url : "about:blank";
		const command = {
			type: "createTab",
			url,
			...resolveCreateTargetParams(request.params)
		};
		const created = await this.callExtension(command);
		if (this.extension !== extension) return;
		if (typeof created?.tabId !== "number") {
			this.respondError(client, request, "extension did not return a tabId for createTab");
			return;
		}
		const tabId = created.tabId;
		if (!this.clients.has(client) && !this.tabs.has(tabId)) {
			if (typeof created.targetId === "string") await this.callExtension({
				type: "detach",
				tabId
			});
			return;
		}
		if (!this.tabs.has(tabId)) this.tabs.set(tabId, {
			info: {
				tabId,
				url,
				title: "",
				active: false
			},
			claimants: /* @__PURE__ */ new Set(),
			restoreAttachment: false
		});
		await this.withAttachedTab(client, tabId, (attached) => {
			const recipients = [...this.clients].filter((recipient) => recipient.autoAttach);
			this.announceAttachedTab(tabId, attached, recipients);
			this.announceAttachedTab(tabId, attached, [client]);
			this.respond(client, request, { targetId: attached.targetId });
		}, typeof created.targetId === "string" ? created.targetId : void 0);
	}
	handleCdpRequest(client, request) {
		const session = request.sessionId ? client.sessions.get(request.sessionId) : void 0;
		const completed = (request.sessionId && this.browserSessions.get(request.sessionId) !== client ? this.handleSessionScopedRequest(client, request) : this.handleBrowserScopedRequest(client, request)).catch((err) => {
			this.respondError(client, request, err instanceof Error ? err.message : String(err));
		});
		if (session && request.method === "Page.getFrameTree") {
			const ready = Promise.all([session.frameTreeRead, completed]).then(() => {});
			session.frameTreeRead = ready;
			ready.then(() => {
				if (session.frameTreeRead === ready) session.frameTreeRead = void 0;
			});
		}
		return completed;
	}
	async handleSessionScopedRequest(client, request) {
		const sessionId = request.sessionId;
		const session = client.sessions.get(sessionId);
		if (!session) {
			this.respondError(client, request, `Session not found: ${sessionId}`, -32001);
			return;
		}
		if (request.method === "Target.detachFromTarget") {
			const child = this.sessions.child(session, request.params);
			await this.sessions.detach(client, child.id);
			this.respond(client, request, {});
			return;
		}
		if (request.method === "Target.sendMessageToTarget") {
			const child = this.sessions.child(session, request.params);
			if (child.flat || typeof request.params?.message !== "string") throw new Error("Non-flat Target child session not found");
			const nested = asOptionalRecord(JSON.parse(request.params.message));
			if (!nested || typeof nested.id !== "number" || typeof nested.method !== "string") throw new Error("Invalid Target message");
			const target = nested.sessionId === void 0 ? child : typeof nested.sessionId === "string" ? client.sessions.get(nested.sessionId) : void 0;
			let ancestor = target;
			while (ancestor && ancestor !== child && ancestor.flat) ancestor = ancestor.parent;
			if (!target || ancestor !== child) throw new Error("Nested Target session not found");
			this.handleCdpRequest(client, {
				id: nested.id,
				method: nested.method,
				params: asOptionalRecord(nested.params),
				sessionId: target.id
			});
			this.respond(client, request, {});
			return;
		}
		if (request.method === "Target.setAutoAttach") {
			const result = await session.physical.target.command(session, request.params, () => {
				if (client.sessions.get(sessionId) !== session || !this.clients.has(client)) throw new Error("Target parent detached");
			});
			this.respond(client, request, result);
			return;
		}
		const { runtime, fetch } = session.physical;
		const emit = (method, params) => this.sessions.emit(session, {
			method,
			params
		});
		const fetchResult = fetch.command(session, emit, request.method, request.params);
		if (fetchResult) {
			const result = await fetchResult;
			if (client.sessions.get(sessionId) !== session) throw new Error(`Session detached: ${sessionId}`);
			this.respond(client, request, result);
			return;
		}
		if (request.method === "Runtime.disable") {
			session.runtimeGeneration++;
			runtime.disable(session);
			this.respond(client, request, {});
			return;
		}
		if (request.method === "Runtime.enable" && session.frameTreeRead) {
			const generation = session.runtimeGeneration;
			await session.frameTreeRead;
			if (!this.clients.has(client) || client.sessions.get(sessionId) !== session || session.runtimeGeneration !== generation) throw new Error("Runtime session detached or disabled");
		}
		const send = () => this.sessions.send(session.physical, request.method, request.params, request.method === "Runtime.runIfWaitingForDebugger" ? "target" : void 0);
		const result = request.method === "Runtime.enable" ? await runtime.enable(session, emit, send) : request.method === "Runtime.addBinding" || request.method === "Runtime.removeBinding" ? await runtime.binding(session, emit, request.method, request.params) : await send();
		if (client.sessions.get(sessionId) !== session) throw new Error(`Session detached: ${sessionId}`);
		this.respond(client, request, result);
	}
	async handleBrowserScopedRequest(client, request) {
		switch (request.method) {
			case "Browser.getVersion": {
				const identity = this.extension?.identity;
				this.respond(client, request, {
					protocolVersion: "1.3",
					product: identity?.browserVersion ?? "Chrome/unknown",
					revision: "openclaw-extension-relay",
					userAgent: identity?.userAgent ?? "unknown",
					jsVersion: ""
				});
				return;
			}
			case "Browser.close":
				this.respond(client, request, {});
				client.socket.close(1e3, "Browser.close");
				return;
			case "Browser.setDownloadBehavior":
			case "Target.setDiscoverTargets":
				this.respond(client, request, {});
				return;
			case "Target.getTargetInfo": {
				const targetId = request.params?.targetId;
				if (!targetId || targetId === BROWSER_TARGET_ID) {
					this.respond(client, request, { targetInfo: {
						targetId: BROWSER_TARGET_ID,
						type: "browser",
						title: "OpenClaw Extension Relay",
						url: "",
						attached: true,
						canAccessOpener: false
					} });
					return;
				}
				const found = this.tabByTargetId(targetId);
				if (!found) {
					this.respondError(client, request, `No target with given id found: ${targetId}`, -32602);
					return;
				}
				this.respond(client, request, { targetInfo: this.targetInfoForTab(found.tab, targetId) });
				return;
			}
			case "Target.getTargets": {
				const enumeration = await this.enumerateTargetInfos(client);
				if (enumeration.status === "unavailable") {
					const message = enumeration.reason === "extension-disconnected" ? "Extension is disconnected" : "Target identities are unavailable";
					this.respondError(client, request, message, -32002);
					return;
				}
				this.respond(client, request, { targetInfos: enumeration.targetInfos });
				return;
			}
			case "Target.attachToBrowserTarget": {
				const sessionId = `openclaw-browser-${this.nextSessionOrdinal++}`;
				this.browserSessions.set(sessionId, client);
				this.respond(client, request, { sessionId });
				return;
			}
			case "Target.setAutoAttach": {
				const autoAttach = request.params?.autoAttach !== false;
				client.autoAttach = autoAttach;
				if (autoAttach) {
					client.detachedTabs.clear();
					const attachResults = await Promise.allSettled([...this.tabs.keys()].map((tabId) => this.withAttachedTab(client, tabId, (attached) => {
						this.announceAttachedTab(tabId, attached, this.autoAttachRecipients(tabId, attached.sessionId));
					})));
					for (const settled of attachResults) if (settled.status === "rejected") log$1.warn(`setAutoAttach attach failed: ${String(settled.reason)}`);
				}
				this.respond(client, request, {});
				return;
			}
			case "Target.attachToTarget": {
				const targetId = request.params?.targetId;
				const found = targetId ? this.tabByTargetId(targetId) : null;
				if (!found && targetId) {
					this.respondError(client, request, `No target with given id found: ${targetId}`, -32602);
					return;
				}
				if (!found) {
					this.respondError(client, request, "targetId is required", -32602);
					return;
				}
				await this.withAttachedTab(client, found.tabId, (attached) => {
					if (attached.targetId !== targetId) throw new Error("Requested native target changed during attachment");
					if (found.tab.target?.sessionId !== attached.sessionId || request.sessionId && this.browserSessions.get(request.sessionId) !== client) throw new Error("Target attachment retired");
					const sessionId = `openclaw-tab-${found.tabId}-${this.nextSessionOrdinal++}`;
					this.sessions.announce(client, sessionId, attached.sessionId, {
						sessionId,
						targetInfo: this.targetInfoForTab(found.tab, attached.targetId),
						waitingForDebugger: false
					}, request.sessionId);
					this.respond(client, request, { sessionId });
				});
				return;
			}
			case "Target.detachFromTarget": {
				const sessionId = request.params?.sessionId;
				if (sessionId && this.browserSessions.get(sessionId) === client) {
					this.browserSessions.delete(sessionId);
					await this.sessions.detachChildren(client, sessionId);
				} else {
					const session = sessionId ? client.sessions.get(sessionId) : void 0;
					if (!sessionId || !session) {
						this.respondError(client, request, `Session not found: ${String(sessionId)}`, -32001);
						return;
					}
					if (!session.parent && session.id === session.physical.rootSessionId) client.detachedTabs.add(session.physical.tabId);
					await this.sessions.detach(client, sessionId);
				}
				this.respond(client, request, {});
				return;
			}
			case "Target.createTarget": {
				const creating = this.createTarget(client, request);
				client.creating.add(creating);
				try {
					await creating;
				} finally {
					client.creating.delete(creating);
				}
				return;
			}
			case "Target.closeTarget": {
				const targetId = request.params?.targetId;
				const found = targetId ? this.tabByTargetId(targetId) : null;
				if (!found) {
					this.respondError(client, request, `No target with given id found: ${String(targetId)}`, -32602);
					return;
				}
				await this.callExtension({
					type: "closeTab",
					tabId: found.tabId
				});
				this.respond(client, request, { success: true });
				return;
			}
			case "Target.activateTarget": {
				const targetId = request.params?.targetId;
				const found = targetId ? this.tabByTargetId(targetId) : null;
				if (!found) {
					this.respondError(client, request, `No target with given id found: ${String(targetId)}`, -32602);
					return;
				}
				await this.callExtension({
					type: "activateTab",
					tabId: found.tabId
				});
				this.respond(client, request, {});
				return;
			}
			case "Target.getBrowserContexts":
				this.respond(client, request, { browserContextIds: [] });
				return;
			case "Target.createBrowserContext":
				this.respondError(client, request, "The OpenClaw extension relay drives the user's real browser profile; isolated browser contexts are not supported.");
				return;
			default: this.respondError(client, request, `'${request.method}' wasn't found`, -32601);
		}
	}
	/** Close all sockets and reject pending work (relay shutdown). */
	dispose() {
		this.stopPing();
		for (const pending of this.pendingExtension.values()) {
			clearTimeout(pending.timer);
			pending.reject(/* @__PURE__ */ new Error("extension relay stopped"));
		}
		this.pendingExtension.clear();
		for (const candidate of this.extensionCandidates) candidate.close(1001, "relay stopped");
		this.extensionCandidates.clear();
		this.extension?.socket.close(1001, "relay stopped");
		this.extension = null;
		this.connectionEvents.dispatchEvent(new Event("ready"));
		this.sessions.dispose();
		for (const client of this.clients) client.socket.close(1001, "relay stopped");
		this.clients.clear();
		this.browserSessions.clear();
		this.tabs.clear();
	}
};
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-request.ts
const LEGACY_EXTENSION_RELAY_PROTOCOL = "openclaw-extension-relay";
const LEGACY_EXTENSION_RELAY_TOKEN_PROTOCOL_PREFIX = "openclaw-extension-token.";
function firstHeader(value) {
	return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}
function requestProtocols(req) {
	return firstHeader(req.headers["sec-websocket-protocol"]).split(",").map((value) => value.trim()).filter(Boolean);
}
function requestExtensionProtocolToken(req) {
	const protocols = requestProtocols(req);
	if (!protocols.includes("openclaw-extension-relay")) return "";
	return protocols.find((value) => value.startsWith(LEGACY_EXTENSION_RELAY_TOKEN_PROTOCOL_PREFIX))?.slice(25) ?? "";
}
function isAllowedExtensionOrigin(req) {
	const origin = firstHeader(req.headers.origin);
	return origin === "" || origin.startsWith("chrome-extension://");
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/relay-server.ts
/** Loopback extension relay with connection-bound Browser Relay Authentication v2. */
const log = createSubsystemLogger("browser").child("extension-relay");
const INTERNAL_CDP_USERNAME = "openclaw-internal";
const MAX_AUTH_BODY_BYTES = 8192;
const EXTENSION_RELAY_MAX_PAYLOAD_BYTES = 67108864;
function decodeBasic(req) {
	const auth = firstHeader(req.headers.authorization);
	if (!auth.startsWith("Basic ")) return null;
	try {
		const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
		const separator = decoded.indexOf(":");
		return separator < 0 ? {
			username: "",
			password: decoded
		} : {
			username: decoded.slice(0, separator),
			password: decoded.slice(separator + 1)
		};
	} catch {
		return null;
	}
}
function isAuthorizedInternal(req, internalToken) {
	const basic = decodeBasic(req);
	return basic?.username === INTERNAL_CDP_USERNAME && safeEqualSecret(internalToken, basic.password);
}
function isAuthorizedLegacy(req, token, allowLegacyAuth) {
	if (!allowLegacyAuth) return false;
	const auth = firstHeader(req.headers.authorization);
	if (auth.startsWith("Bearer ") && safeEqualSecret(token, auth.slice(7).trim())) return true;
	const basic = decodeBasic(req);
	if (basic && safeEqualSecret(token, basic.password)) return true;
	const protocolToken = requestExtensionProtocolToken(req);
	return protocolToken.length > 0 && safeEqualSecret(token, protocolToken);
}
function hasLoopbackHostHeader(req) {
	const host = firstHeader(req.headers.host);
	if (!host) return true;
	try {
		return isLoopbackHost(new URL(`http://${host}`).hostname);
	} catch {
		return false;
	}
}
function writeJson(res, status, value, headers = {}) {
	const body = JSON.stringify(value);
	res.writeHead(status, {
		"Content-Type": "application/json",
		"Content-Length": String(Buffer.byteLength(body)),
		...headers
	});
	res.end(body);
}
function rejectHttp(res, status, message) {
	res.once("finish", () => res.socket?.destroy());
	writeJson(res, status, { error: message }, { Connection: "close" });
}
async function readAuthBody(req) {
	try {
		return await readRequestBodyWithLimit(req, {
			...WEBHOOK_BODY_READ_DEFAULTS.preAuth,
			maxBytes: MAX_AUTH_BODY_BYTES,
			destroyOnLimit: false
		});
	} catch {
		return null;
	}
}
function bindSocket(ws, handlers) {
	ws.on("message", (data) => handlers.onMessage(rawDataToString(data)));
	ws.on("close", () => {
		Promise.resolve(handlers.onClose()).catch((error) => log.warn(`Client cleanup incomplete: ${String(error)}`));
	});
	ws.on("error", (err) => log.warn(`relay socket error: ${String(err)}`));
}
function trackAuthenticatedSocket(authority, ws) {
	if (!authority.registerAuthenticatedConnection(ws, () => ws.close(4003, "browser relay key rotated"))) {
		ws.terminate();
		return false;
	}
	ws.once("close", () => authority.releaseConnection(ws));
	return true;
}
/** Wire an already-v2-authenticated extension socket to the bridge. */
function attachExtensionWebSocket(bridge, ws) {
	const handlers = bridge.attachExtensionSocket(ws);
	let helloSeen = false;
	const helloTimer = setTimeout(() => {
		ws.close(4008, "extension hello timeout");
		ws.terminate();
	}, BROWSER_RELAY_CHALLENGE_TTL_MS);
	helloTimer.unref?.();
	bindSocket(ws, {
		onMessage: (raw) => {
			if (!helloSeen && parseExtensionMessage(raw)?.type === "hello") {
				helloSeen = true;
				clearTimeout(helloTimer);
			}
			handlers.onMessage(raw);
		},
		onClose: () => {
			clearTimeout(helloTimer);
			handlers.onClose();
		}
	});
}
async function startExtensionRelayServer(params) {
	const allowLegacyAuth = params.allowLegacyAuth ?? true;
	const internalToken = crypto.randomBytes(32).toString("base64url");
	const owner = randomRelayId();
	let retired = false;
	if (readExtensionRelayToken() === params.token) getBrowserRelayAuthV2Authority(params.token);
	const bridge = new ExtensionRelayBridge({ onStateChange: params.onStateChange });
	const wss = new WebSocketServer({
		noServer: true,
		maxPayload: EXTENSION_RELAY_MAX_PAYLOAD_BYTES
	});
	const httpStates = /* @__PURE__ */ new WeakMap();
	const socketAuthorities = /* @__PURE__ */ new WeakMap();
	const authSockets = /* @__PURE__ */ new Set();
	const ownerConnections = /* @__PURE__ */ new Map();
	const currentAuthority = () => {
		const liveToken = readExtensionRelayToken();
		if (!liveToken) {
			invalidateBrowserRelayAuthV2Authority();
			return null;
		}
		return getBrowserRelayAuthV2Authority(liveToken);
	};
	const clearSocketState = (socket) => {
		const state = httpStates.get(socket);
		if (state && "timer" in state) clearTimeout(state.timer);
		httpStates.delete(socket);
		authSockets.delete(socket);
		const authority = socketAuthorities.get(socket);
		socketAuthorities.delete(socket);
		authority?.releaseConnection(socket);
	};
	const armSocketTimer = (socket) => {
		const timer = setTimeout(() => socket.destroy(), BROWSER_RELAY_CHALLENGE_TTL_MS);
		timer.unref?.();
		return timer;
	};
	const registerHttpSocket = (socket, authority, source) => {
		if (authSockets.has(socket)) return true;
		if (!authority.registerPendingConnection(socket, () => socket.destroy(), source)) return false;
		authSockets.add(socket);
		socketAuthorities.set(socket, authority);
		socket.once("close", () => clearSocketState(socket));
		return true;
	};
	const versionPayload = () => ({
		Browser: bridge.identity?.browserVersion ?? "Chrome/unknown",
		"Protocol-Version": "1.3",
		"User-Agent": bridge.identity?.userAgent ?? "unknown",
		webSocketDebuggerUrl: `ws://127.0.0.1:${resolvedPort()}/cdp`
	});
	const server = http.createServer((req, res) => {
		(async () => {
			if (!hasLoopbackHostHeader(req)) {
				rejectHttp(res, 403, "Forbidden");
				return;
			}
			const path = (req.url ?? "/").split("?")[0];
			const socket = req.socket;
			const source = resolveRequestClientIp(req) ?? "unknown";
			const existingState = httpStates.get(socket);
			const authority = currentAuthority();
			if (path === "/_openclaw/relay/auth/v2/challenge") {
				if (req.url !== "/_openclaw/relay/auth/v2/challenge" || req.method !== "POST" || existingState || !authority || !registerHttpSocket(socket, authority, source)) {
					rejectHttp(res, existingState ? 409 : 400, "Invalid relay auth sequence");
					return;
				}
				const pending = { stage: "busy" };
				httpStates.set(socket, pending);
				const raw = await readAuthBody(req);
				const request = raw === null ? null : parseRelayHttpChallengeRequest(parseStrictJsonObject(raw));
				if (!request || request.keyId !== authority.keyId) {
					clearSocketState(socket);
					rejectHttp(res, 400, "Invalid relay auth challenge request");
					return;
				}
				const challenge = authority.issueChallenge(socket, {
					type: "auth.hello",
					v: 2,
					keyId: request.keyId,
					clientNonce: request.clientNonce
				}, {
					role: request.role,
					transport: request.transport,
					method: request.method,
					resource: request.resource,
					flow: request.flow
				});
				if (!challenge) {
					clearSocketState(socket);
					rejectHttp(res, 401, "Relay auth challenge rejected");
					return;
				}
				res.once("finish", () => {
					if (!socket.destroyed && httpStates.get(socket) === pending) httpStates.set(socket, {
						stage: "challenged",
						flow: request.flow,
						authority,
						timer: armSocketTimer(socket)
					});
				});
				writeJson(res, 200, challenge);
				return;
			}
			if (path === "/_openclaw/relay/auth/v2/complete") {
				if (req.url !== "/_openclaw/relay/auth/v2/complete" || req.method !== "POST" || existingState?.stage !== "challenged") {
					rejectHttp(res, 409, "Invalid relay auth sequence");
					return;
				}
				clearTimeout(existingState.timer);
				const pending = { stage: "busy" };
				httpStates.set(socket, pending);
				const raw = await readAuthBody(req);
				const request = raw === null ? null : parseRelayHttpCompleteRequest(parseStrictJsonObject(raw));
				const completed = request ? existingState.authority.completeChallenge(socket, {
					type: "auth.response",
					...request
				}) : null;
				if (!completed) {
					clearSocketState(socket);
					rejectHttp(res, 401, "Relay auth proof failed");
					return;
				}
				res.once("finish", () => {
					if (!socket.destroyed && httpStates.get(socket) === pending) httpStates.set(socket, {
						stage: "authenticated",
						flow: existingState.flow,
						authority: existingState.authority,
						timer: armSocketTimer(socket)
					});
				});
				writeJson(res, 200, completed.ok);
				return;
			}
			if (existingState?.stage === "authenticated") {
				clearTimeout(existingState.timer);
				const pending = { stage: "busy" };
				httpStates.set(socket, pending);
				if (existingState.flow === "cdp" && req.method === "GET" && req.url === "/json/version") {
					if (!bridge.extensionConnected) {
						clearSocketState(socket);
						rejectHttp(res, 503, "OpenClaw Chrome extension is not connected");
						return;
					}
					res.once("finish", () => {
						if (!socket.destroyed && httpStates.get(socket) === pending) httpStates.set(socket, {
							stage: "awaiting-upgrade",
							authority: existingState.authority,
							timer: armSocketTimer(socket)
						});
					});
					writeJson(res, 200, versionPayload());
					return;
				}
				if (existingState.flow === "json-list" && req.method === "GET" && req.url === "/json/list") {
					clearSocketState(socket);
					res.once("finish", () => socket.destroy());
					writeJson(res, 200, bridge.devtoolsTargetDescriptors(), { Connection: "close" });
					return;
				}
				clearSocketState(socket);
				rejectHttp(res, 409, "Invalid relay auth sequence");
				return;
			}
			if (existingState) {
				clearSocketState(socket);
				rejectHttp(res, 409, "Invalid relay auth sequence");
				return;
			}
			if (!(isAuthorizedInternal(req, internalToken) || authority !== null && isAuthorizedLegacy(req, readExtensionRelayToken() ?? "", allowLegacyAuth))) {
				rejectHttp(res, 401, "Unauthorized");
				return;
			}
			if (req.method === "GET" && (path === "/json/version" || path === "/json/version/")) {
				if (!bridge.extensionConnected) {
					writeJson(res, 503, { error: "OpenClaw Chrome extension is not connected. Install the extension and pair it with `openclaw browser extension pair`." });
					return;
				}
				writeJson(res, 200, versionPayload());
				return;
			}
			if (req.method === "GET" && (path === "/json" || path === "/json/list")) {
				writeJson(res, 200, bridge.devtoolsTargetDescriptors());
				return;
			}
			rejectHttp(res, 404, "Not found");
		})().catch((err) => {
			log.warn(`relay HTTP request failed: ${String(err)}`);
			if (!res.headersSent) rejectHttp(res, 500, "Relay request failed");
			else res.destroy();
		});
	});
	server.on("upgrade", (req, socket, head) => {
		socket.once("error", () => socket.destroy());
		const path = (req.url ?? "/").split("?")[0];
		const source = resolveRequestClientIp(req) ?? "unknown";
		if (retired) {
			rejectWebSocketUpgrade(socket, { status: 503 });
			return;
		}
		if (!hasLoopbackHostHeader(req)) {
			rejectWebSocketUpgrade(socket, { status: 403 });
			return;
		}
		if (path === "/_openclaw/relay/owner") {
			const resource = params.profileName ? relayOwnerResource(resolvedPort(), params.profileName) : null;
			const authority = currentAuthority();
			const protocols = requestProtocols(req);
			if (!resource || req.url !== resource || !authority || readExtensionRelayToken() !== params.token || retired || protocols.length !== 1 || protocols[0] !== "openclaw-extension-relay.v2") {
				rejectWebSocketUpgrade(socket, { status: 403 });
				return;
			}
			handlePreAuthWebSocketUpgrade({
				wss,
				req,
				socket,
				head,
				onUpgrade: (ws, removePreAuthGuard) => authenticateExtensionWebSocket({
					ws,
					authority,
					source,
					resource: `${resource}&owner=${owner}`,
					binding: {
						role: "cdp",
						flow: "owner"
					},
					removePreAuthGuard,
					prepareAuthenticated: async () => () => {
						if (retired || readExtensionRelayToken() !== params.token) throw new Error("Relay owner retired");
						const closeOwner = attachRelayOwner({
							ws,
							bridge,
							allowLegacyAuth,
							isCurrent: () => !retired && readExtensionRelayToken() === params.token
						});
						ownerConnections.set(ws, closeOwner);
						ws.once("close", () => {
							closeOwner().then(() => ownerConnections.delete(ws), () => {});
						});
					}
				})
			});
			return;
		}
		if (path === "/extension") {
			if (!isAllowedExtensionOrigin(req)) {
				rejectWebSocketUpgrade(socket, { status: 403 });
				return;
			}
			const protocols = requestProtocols(req);
			const resource = parseExtensionRelayResource(req.url ?? "/", "/extension");
			if (protocols.length === 1 && protocols[0] === "openclaw-extension-relay.v2" && resource) {
				const authority = currentAuthority();
				if (!authority) {
					rejectWebSocketUpgrade(socket, { status: 401 });
					return;
				}
				if (!handlePreAuthWebSocketUpgrade({
					wss,
					req,
					socket,
					head,
					onUpgrade: (ws, removePreAuthGuard) => {
						authenticateExtensionWebSocket({
							ws,
							authority,
							source,
							resource,
							removePreAuthGuard,
							prepareAuthenticated: async () => () => {
								attachExtensionWebSocket(bridge, ws);
								log.info("extension authenticated and connected to relay");
							}
						});
					}
				})) rejectWebSocketUpgrade(socket, { status: 400 });
				return;
			}
			if (protocols.includes("openclaw-extension-relay.v2")) {
				rejectWebSocketUpgrade(socket, { status: 400 });
				return;
			}
			const liveToken = readExtensionRelayToken();
			if (!liveToken || !isAuthorizedLegacy(req, liveToken, allowLegacyAuth)) {
				rejectWebSocketUpgrade(socket, { status: 401 });
				return;
			}
			const authority = getBrowserRelayAuthV2Authority(liveToken);
			wss.handleUpgrade(req, socket, head, (ws) => {
				if (!trackAuthenticatedSocket(authority, ws)) return;
				attachExtensionWebSocket(bridge, ws);
				log.warn("legacy extension relay authentication accepted");
			});
			return;
		}
		if (path === "/cdp") {
			const state = httpStates.get(socket);
			if (req.url === "/cdp" && state?.stage === "awaiting-upgrade") {
				clearTimeout(state.timer);
				httpStates.delete(socket);
				wss.handleUpgrade(req, socket, head, (ws) => bindSocket(ws, bridge.attachCdpClientSocket(ws)));
				return;
			}
			if (!isAuthorizedInternal(req, internalToken) && !isAuthorizedLegacy(req, readExtensionRelayToken() ?? "", allowLegacyAuth)) {
				rejectWebSocketUpgrade(socket, { status: 401 });
				return;
			}
			const authority = currentAuthority();
			if (!authority) {
				rejectWebSocketUpgrade(socket, { status: 401 });
				return;
			}
			wss.handleUpgrade(req, socket, head, (ws) => trackAuthenticatedSocket(authority, ws) ? bindSocket(ws, bridge.attachCdpClientSocket(ws)) : void 0);
			return;
		}
		rejectWebSocketUpgrade(socket, { status: 404 });
	});
	await new Promise((resolve, reject) => {
		server.once("error", reject);
		server.listen(params.port, "127.0.0.1", () => resolve());
	});
	const resolvedPort = () => {
		const address = server.address();
		return typeof address === "object" && address ? address.port : params.port;
	};
	return {
		ownership: "owned",
		port: resolvedPort(),
		token: params.token,
		allowLegacyAuth,
		internalToken,
		bridge,
		close: async () => {
			retired = true;
			try {
				await Promise.all([...ownerConnections.values()].map((closeOwner) => closeOwner()));
			} finally {
				for (const socket of authSockets) {
					clearSocketState(socket);
					socket.destroy();
				}
				for (const client of wss.clients) client.terminate();
				bridge.dispose();
				wss.close();
				await new Promise((resolve) => {
					server.close(() => resolve());
				});
			}
		}
	};
}
//#endregion
export { isAllowedExtensionOrigin as a, authenticateExtensionWebSocket as c, LEGACY_EXTENSION_RELAY_PROTOCOL as i, handlePreAuthWebSocketUpgrade as l, attachExtensionWebSocket as n, requestExtensionProtocolToken as o, startExtensionRelayServer as r, requestProtocols as s, EXTENSION_RELAY_MAX_PAYLOAD_BYTES as t };
