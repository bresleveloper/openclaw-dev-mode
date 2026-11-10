import { f as toStringifiedError } from "./error-coercion-BwMr25F8.mjs";
import { d as sleepWithAbort } from "./src-Bzfi3cQM.mjs";
import "./backoff-N5Hi0doU.mjs";
import { t as RealtimeVoiceSessionLifecycle } from "./realtime-session-lifecycle-D5AJf2IE.mjs";
import "./audio-codec-CZcvtjIg.mjs";
import "./audio-energy-D6TOXih8.mjs";
import "./audio-output-port-D8MeN94q.mjs";
import { randomUUID } from "node:crypto";
//#region src/talk/realtime-voice-lazy-lifecycle.ts
/** Owns a lazy bridge generation while provider-local queues own input admission and ordering. */
function createLazyRealtimeVoiceBridgeLifecycle(params) {
	const request = params.request;
	const { getPlaybackState, handleDelegationInput, runAgentConsult } = request;
	const lifecycle = new RealtimeVoiceSessionLifecycle(`${params.label} lazy`);
	const disposedBridges = /* @__PURE__ */ new WeakMap();
	let loaded;
	let closePromise;
	let closing;
	const dispose = (state, bridge) => {
		if (disposedBridges.has(bridge)) return disposedBridges.get(bridge);
		disposedBridges.set(bridge, void 0);
		const completion = state.closeOptions ? bridge.close(state.closeOptions) : bridge.close();
		disposedBridges.set(bridge, completion);
		return completion;
	};
	const notifyTerminal = (connection, outcome) => {
		if (closing?.connection === connection && lifecycle.isCurrent(connection)) {
			if (outcome === "error") closing.outcome = outcome;
			return;
		}
		const reason = lifecycle.close(connection, outcome);
		if (reason) {
			params.clearPending();
			request.onClose?.(reason);
		}
	};
	const close = (outcome, primaryError, options) => {
		const connection = lifecycle.currentConnection();
		if (!(outcome === "error" && connection ? lifecycle.failure(connection) : lifecycle.cancel())) return closePromise;
		const state = loaded;
		if (state) state.closeOptions = options;
		const owner = {
			connection,
			outcome
		};
		closing = owner;
		params.clearPending();
		const finish = (reason = owner.outcome) => {
			if (closing === owner) {
				closing = void 0;
				if (outcome === "error") try {
					request.onError?.(toStringifiedError(primaryError));
				} catch {}
			}
			if (connection ? lifecycle.close(connection, reason) : !lifecycle.currentConnection()) request.onClose?.(reason);
		};
		const fail = (error) => {
			try {
				finish("error");
			} catch {}
			throw error;
		};
		let pending;
		try {
			pending = state?.bridge ? dispose(state, state.bridge) : state && state.connection === connection ? state.promise.then((bridge) => dispose(state, bridge)) : void 0;
		} catch (error) {
			return fail(error);
		}
		if (pending) {
			const completion = pending.then(() => finish(), fail);
			if (closing === owner) closePromise = completion;
			return completion;
		}
		finish();
	};
	const guardRequest = (connection) => {
		const isCurrent = () => lifecycle.acceptsEvents(connection);
		const guard = (callback) => (...args) => {
			if (isCurrent()) callback(...args);
		};
		return {
			...request,
			onAudio: guard(request.onAudio),
			onClearAudio: guard(request.onClearAudio),
			...request.onMark ? { onMark: guard(request.onMark) } : {},
			...request.onEvent ? { onEvent: guard(request.onEvent) } : {},
			...request.onResponseDone ? { onResponseDone: guard(request.onResponseDone) } : {},
			...request.onToolCall ? { onToolCall: guard(request.onToolCall) } : {},
			...request.onError ? { onError: guard(request.onError) } : {},
			...getPlaybackState ? { getPlaybackState: () => {
				if (!isCurrent()) return [];
				const playback = getPlaybackState();
				return isCurrent() ? playback : [];
			} } : {},
			...handleDelegationInput ? { handleDelegationInput: (text, respond) => {
				if (!isCurrent()) return "control";
				return handleDelegationInput(text, (message) => {
					if (isCurrent()) respond(message);
				});
			} } : {},
			...runAgentConsult ? { runAgentConsult: (input) => isCurrent() ? runAgentConsult(input) : Promise.reject(/* @__PURE__ */ new Error(`${params.label} realtime voice session closed`)) } : {},
			...request.onTranscript ? { onTranscript: (...args) => {
				const isFinal = args[2];
				if (isCurrent() || isFinal && closing?.connection === connection && lifecycle.isCurrent(connection)) request.onTranscript?.(...args);
			} } : {},
			onReady: () => {
				if (isCurrent()) {
					request.onReady?.();
					if (isCurrent()) params.onProviderReady?.(loaded?.bridge);
				}
			},
			onClose: (reason) => notifyTerminal(connection, reason)
		};
	};
	return {
		get bridge() {
			return loaded?.bridge;
		},
		isActive: () => lifecycle.phase() !== "terminal",
		connect: () => lifecycle.connect(async (connection) => {
			closePromise = void 0;
			closing = void 0;
			const state = {
				connection,
				promise: Promise.resolve().then(() => params.load(guardRequest(connection)))
			};
			loaded = state;
			const bridge = await state.promise;
			const isCurrent = () => lifecycle.acceptsEvents(connection);
			if (!isCurrent()) {
				await dispose(state, bridge);
				return;
			}
			state.bridge = bridge;
			try {
				await bridge.connect();
				if (isCurrent()) {
					await params.onConnected?.(bridge, isCurrent);
					lifecycle.ready(connection);
				}
			} catch (error) {
				try {
					if (isCurrent()) await close("error", error);
					else await dispose(state, bridge);
				} catch {}
				throw error;
			}
			if (!isCurrent()) await dispose(state, bridge);
		}),
		close: (options) => close("completed", void 0, options)
	};
}
//#endregion
//#region src/talk/realtime-voice-websocket-transport.ts
/** Shared socket/retry ownership; provider authentication and event policy remain local. */
var RealtimeVoiceWebSocketTransport = class {
	constructor(options) {
		this.options = options;
		this.ws = null;
		this.connectionUrl = "";
		this.flowId = randomUUID();
	}
	get socket() {
		return this.ws;
	}
	get lifecycle() {
		return this.options.lifecycle;
	}
	async connect() {
		if (this.terminalError) throw this.terminalError;
		await this.lifecycle.connect((connection) => this.doConnect(connection));
	}
	isOpen() {
		return this.ws?.readyState === 1;
	}
	isConnected() {
		return this.lifecycle.isReady() && this.isOpen();
	}
	close() {
		const connection = this.lifecycle.currentConnection();
		if (!this.lifecycle.cancel()) return;
		this.options.onReset();
		if (!connection) return;
		const socket = this.ws;
		this.ws = null;
		if (socket && socket.readyState !== 3) socket.close(1e3, "Bridge closed");
		this.notifyClose(connection, "completed");
	}
	rotate(reason) {
		this.reconnectReason = reason;
		this.ws?.close(1e3, `${reason} rotation`);
	}
	send(event, detail) {
		const socket = this.ws;
		if (socket?.readyState !== 1) return;
		const payload = JSON.stringify(event);
		const type = event && typeof event === "object" && "type" in event && typeof event.type === "string" ? event.type : "unknown";
		this.capture(this.connectionUrl, {
			direction: "outbound",
			kind: "ws-frame",
			payload
		});
		socket.send(payload);
		this.options.callbacks.onEvent?.({
			direction: "client",
			type,
			...detail ? { detail } : {}
		});
	}
	fail(error, connection, close) {
		if (this.terminalError) return;
		const socket = this.ws;
		this.terminalError = error;
		if (!this.lifecycle.failure(connection)) return;
		this.options.onReset();
		try {
			this.options.callbacks.onError?.(error);
		} finally {
			if (socket && socket.readyState !== 3) socket.close(close.code, close.reason);
			else this.notifyClose(connection, "error");
		}
	}
	notifyClose(connection, outcome) {
		const terminal = this.lifecycle.close(connection, outcome);
		if (!terminal) return;
		this.reconnectReason = void 0;
		this.options.onReset();
		this.options.callbacks.onClose?.(terminal);
	}
	async doConnect(connection) {
		let socket;
		let startupBytes = 0;
		const attempt = this.lifecycle.createConnectAttempt({
			connection,
			timeoutMs: this.options.connectTimeoutMs,
			timeoutError: () => /* @__PURE__ */ new Error(`${this.options.label} connection timeout`),
			onTimeout: () => socket?.terminate(),
			onAbort: (outcome) => {
				if ((this.options.closeOnFailedAbort || outcome !== "error") && socket && socket.readyState !== 3) socket.close(1e3, "connection canceled");
			}
		});
		const open = (params) => {
			if (attempt.settled) return;
			if (!this.lifecycle.isCurrent(connection) || connection.signal.aborted) {
				attempt.resolve();
				return;
			}
			attempt.startTimeout();
			const { url } = params;
			this.connectionUrl = url;
			const ws = this.options.createSocket(params);
			socket = ws;
			this.ws = ws;
			const rejectStartup = (error) => {
				const mapped = this.options.startupError(error, url);
				if (attempt.rejectStartup(mapped) && ws.readyState !== 3) ws.close(1e3, "startup failed");
			};
			ws.on("open", () => {
				if (!this.lifecycle.acceptsEvents(connection)) {
					ws.close(1e3, "stale connection");
					return;
				}
				this.capture(url, {
					direction: "local",
					kind: "ws-open"
				});
				this.options.onOpen(connection);
			});
			ws.on("message", (data) => {
				if (!this.lifecycle.acceptsEvents(connection) || this.ws !== ws || attempt.settled && !attempt.ready) return;
				const limit = this.options.startupLimit;
				if (!attempt.ready && limit) {
					startupBytes += data.byteLength;
					if (startupBytes > limit.bytes) {
						const error = new Error(limit.message);
						attempt.reject(error);
						this.fail(error, connection, {
							code: 1009,
							reason: limit.reason
						});
						return;
					}
				}
				this.capture(url, {
					direction: "inbound",
					kind: "ws-frame",
					payload: data
				});
				let event;
				try {
					event = JSON.parse(data.toString());
					if (event.type === "error" && !attempt.ready) {
						rejectStartup(event.error);
						return;
					}
					this.options.onEvent(event, connection);
					if (event.type === "session.updated" && this.lifecycle.isCurrent(connection) && this.lifecycle.isReady()) attempt.resolve(true);
				} catch (error) {
					const close = this.options.fatalEventError(error, event);
					if (close) {
						const failure = toStringifiedError(error);
						attempt.reject(failure);
						this.fail(failure, connection, close);
					} else console.error(`[${this.options.providerId}] realtime event parse failed:`, error);
				}
			});
			ws.on("error", (error) => {
				if (!this.lifecycle.acceptsEvents(connection) || this.ws !== ws) return;
				this.capture(url, {
					direction: "local",
					kind: "error",
					errorText: error.message
				});
				if (!attempt.ready) rejectStartup(toStringifiedError(error));
				else this.options.callbacks.onError?.(toStringifiedError(error));
			});
			ws.on("close", (code, reasonBuffer) => {
				this.capture(url, {
					direction: "local",
					kind: "ws-close",
					closeCode: code,
					meta: { reason: reasonBuffer.length ? reasonBuffer.toString("utf8") : void 0 }
				});
				if (!this.lifecycle.isCurrent(connection)) return;
				if (this.ws === ws) this.ws = null;
				if (attempt.startupFailed) return;
				if (this.terminalError) {
					this.notifyClose(connection, "error");
					return;
				}
				if (this.lifecycle.terminalOutcome(connection) === "completed") {
					attempt.resolve();
					this.notifyClose(connection, "completed");
					return;
				}
				if (!attempt.ready && !attempt.settled) {
					attempt.reject(/* @__PURE__ */ new Error(`${this.options.label} connection closed before ready`));
					return;
				}
				const reason = this.reconnectReason ?? "websocket-close";
				this.reconnectReason = void 0;
				this.attemptReconnect(reason, connection);
			});
		};
		try {
			const params = this.options.resolveConnection();
			if ("then" in params) params.then(open).catch((error) => {
				if (!this.lifecycle.isCurrent(connection) || this.lifecycle.terminalOutcome(connection) === "completed") attempt.resolve();
				else attempt.reject(toStringifiedError(error));
			});
			else open(params);
		} catch (error) {
			attempt.reject(toStringifiedError(error));
		}
		await attempt.promise;
	}
	async attemptReconnect(reason, connection) {
		const blocked = this.options.reconnectBlocked?.();
		if (blocked) {
			this.options.callbacks.onEvent?.({
				direction: "client",
				type: "session.reconnect.blocked",
				detail: `reason=${reason} ${blocked}`
			});
			this.endAfterReconnect(connection);
			return;
		}
		const retry = this.lifecycle.retry(connection, this.options.maxReconnectAttempts);
		if (!retry) return;
		if (retry === "exhausted") {
			this.options.callbacks.onEvent?.({
				direction: "client",
				type: "session.reconnect.exhausted",
				detail: `reason=${reason} attempts=${this.options.maxReconnectAttempts}`
			});
			this.endAfterReconnect(connection);
			return;
		}
		const { attempt } = retry;
		const delay = this.options.reconnectDelayMs * 2 ** (attempt - 1);
		if (attempt === 1) this.options.onFirstReconnect?.();
		this.options.callbacks.onEvent?.({
			direction: "client",
			type: "session.reconnect.scheduled",
			detail: `reason=${reason} attempt=${attempt} delayMs=${delay}`
		});
		try {
			await sleepWithAbort(delay, retry.signal);
		} catch (error) {
			if (!retry.signal.aborted) throw error;
			return;
		}
		const next = this.lifecycle.reconnect(connection);
		if (!next) return;
		try {
			await this.doConnect(next);
			if (!this.lifecycle.isCurrent(next) || !this.lifecycle.isReady()) return;
			this.options.callbacks.onEvent?.({
				direction: "client",
				type: "session.reconnect.ready",
				detail: `reason=${reason} attempt=${attempt}`
			});
		} catch (error) {
			if (!this.lifecycle.acceptsEvents(next)) return;
			this.options.callbacks.onError?.(toStringifiedError(error));
			await this.attemptReconnect(reason, next);
		}
	}
	endAfterReconnect(connection) {
		if (this.lifecycle.failure(connection)) this.options.onReset();
		this.notifyClose(connection, "error");
	}
	capture(url, event) {
		this.options.capture?.({
			url,
			flowId: this.flowId,
			...event,
			meta: {
				provider: this.options.providerId,
				capability: "realtime-voice",
				...event.meta
			}
		}).catch(() => {});
	}
};
//#endregion
export { createLazyRealtimeVoiceBridgeLifecycle as n, RealtimeVoiceWebSocketTransport as t };
