import { d as toStringifiedError, u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { s as sleepWithAbort, t as RetrySupervisor } from "./src-D4OikzaT.mjs";
import "./backoff-CszdOMiF.mjs";
import { n as createDebugProxyWebSocketAgent, r as resolveDebugProxySettings } from "./env-BOt5Nx-y.mjs";
import { n as captureWsEvent } from "./runtime-Cr-8v8fa.mjs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/realtime-transcription/websocket-session.ts
const require = createRequire(import.meta.url);
let webSocketConstructor;
function loadWebSocket() {
	return webSocketConstructor ??= import(pathToFileURL(path.join(path.dirname(require.resolve("ws/package.json")), "wrapper.mjs")).href).then((module) => module.default);
}
const WEBSOCKET_OPEN = 1;
const DEFAULT_CONNECT_TIMEOUT_MS = 1e4;
const DEFAULT_CLOSE_TIMEOUT_MS = 5e3;
const DEFAULT_MAX_RECONNECT_ATTEMPTS = 5;
const DEFAULT_MAX_QUEUED_BYTES = 2097152;
const RECONNECT_STABLE_RESET_MS = 3e4;
const REALTIME_TRANSCRIPTION_WS_MAX_PAYLOAD_BYTES = 16777216;
const REALTIME_TRANSCRIPTION_WS_MAX_BUFFERED_BYTES = 1048576;
function defaultParseMessage(payload) {
	try {
		return JSON.parse(payload.toString());
	} catch {
		throw new Error("Realtime transcription websocket received malformed JSON.");
	}
}
var WebSocketRealtimeTranscriptionSession = class {
	constructor(options) {
		this.closed = false;
		this.currentUrl = "";
		this.queuedAudio = [];
		this.queuedAudioHead = 0;
		this.queuedBytes = 0;
		this.ready = false;
		this.reconnecting = false;
		this.ws = null;
		this.connectionGeneration = 0;
		this.flowId = randomUUID();
		this.options = options;
		this.reconnectSupervisor = new RetrySupervisor({
			initialMs: options.reconnectDelayMs ?? 1e3,
			maxMs: Number.MAX_SAFE_INTEGER,
			factor: 2,
			jitter: 0
		}, options.maxReconnectAttempts ?? DEFAULT_MAX_RECONNECT_ATTEMPTS);
	}
	async connect() {
		const previousSocket = this.ws;
		this.connectionGeneration += 1;
		this.cancelConnecting?.();
		this.forceClose(previousSocket);
		this.closed = false;
		this.readySinceMs = void 0;
		this.reconnecting = false;
		this.reconnectSupervisor.reset();
		await this.doConnect(this.connectionGeneration);
	}
	sendAudio(audio) {
		if (this.closed || audio.byteLength === 0) return;
		if (this.ws?.readyState === WEBSOCKET_OPEN && this.ready && this.transport) {
			this.options.sendAudio(audio, this.transport);
			return;
		}
		this.queueAudio(audio);
	}
	close() {
		if (this.closed) return;
		this.closed = true;
		this.cancelConnecting?.();
		this.ready = false;
		this.readySinceMs = void 0;
		this.reconnectSupervisor.cancel();
		this.clearQueuedAudio();
		const socket = this.ws;
		const transport = this.transport;
		if (!socket || socket.readyState !== WEBSOCKET_OPEN || !transport) {
			this.forceClose(socket);
			return;
		}
		try {
			this.options.onClose?.(transport);
		} catch (error) {
			this.emitError(error);
		}
		if (this.ws === socket) this.closeTimer = setTimeout(() => this.forceClose(socket), this.closeTimeoutMs);
	}
	isConnected() {
		return this.ready;
	}
	get closeTimeoutMs() {
		return this.options.closeTimeoutMs ?? DEFAULT_CLOSE_TIMEOUT_MS;
	}
	get connectTimeoutMs() {
		return this.options.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS;
	}
	get maxQueuedBytes() {
		return this.options.maxQueuedBytes ?? DEFAULT_MAX_QUEUED_BYTES;
	}
	async doConnect(generation) {
		await new Promise((resolve, reject) => {
			if (generation !== this.connectionGeneration || this.closed) {
				resolve();
				return;
			}
			this.ready = false;
			const debugProxy = resolveDebugProxySettings();
			const proxyAgent = createDebugProxyWebSocketAgent(debugProxy);
			let settled = false;
			let opened = false;
			let connectTimeout;
			let socket;
			const ownsGeneration = () => generation === this.connectionGeneration;
			const ownsSocket = () => ownsGeneration() && this.ws === socket;
			const clearConnectTimeout = () => {
				if (connectTimeout) {
					clearTimeout(connectTimeout);
					connectTimeout = void 0;
				}
				if (this.cancelConnecting === finishClosedConnect) this.cancelConnecting = void 0;
			};
			const finishClosedConnect = () => {
				if (settled) return;
				settled = true;
				clearConnectTimeout();
				resolve();
			};
			const finishConnect = () => {
				if (settled) return;
				if (!ownsSocket()) {
					finishClosedConnect();
					return;
				}
				this.ready = true;
				this.readySinceMs = Date.now();
				try {
					this.flushQueuedAudio(transport);
				} catch (error) {
					failConnect(toErrorObject(error, "Realtime audio send failed"));
					return;
				}
				settled = true;
				clearConnectTimeout();
				resolve();
			};
			const failConnect = (error) => {
				if (settled) return;
				if (!ownsGeneration() || socket && !ownsSocket()) {
					finishClosedConnect();
					return;
				}
				settled = true;
				clearConnectTimeout();
				this.emitError(error);
				this.forceClose(socket ?? this.ws);
				reject(error);
			};
			this.cancelConnecting = finishClosedConnect;
			const handleBackpressure = () => {
				const error = /* @__PURE__ */ new Error(`${this.options.providerId} realtime transcription send buffer exceeded ${REALTIME_TRANSCRIPTION_WS_MAX_BUFFERED_BYTES} bytes; closing stalled connection`);
				if (!settled) {
					failConnect(error);
					return;
				}
				if (socket) this.closeForBackpressure(socket, error);
			};
			const transport = {
				callbacks: this.options.callbacks,
				closeNow: () => {
					if (!ownsSocket()) return;
					this.closed = true;
					this.cancelConnecting?.();
					this.reconnectSupervisor.cancel();
					this.forceClose(socket);
				},
				failConnect: (error) => {
					if (ownsSocket()) failConnect(error);
				},
				isOpen: () => ownsSocket() && socket?.readyState === WEBSOCKET_OPEN,
				isReady: () => ownsSocket() && this.ready,
				markReady: () => {
					if (ownsSocket()) finishConnect();
				},
				sendBinary: (payload) => this.send(payload, socket, generation, handleBackpressure),
				sendJson: (payload) => this.send(JSON.stringify(payload), socket, generation, handleBackpressure)
			};
			connectTimeout = setTimeout(() => {
				failConnect(new Error(this.options.connectTimeoutMessage ?? `${this.options.providerId} realtime transcription connection timeout`));
			}, this.connectTimeoutMs);
			(async () => {
				let connection;
				let NpmWebSocket;
				try {
					[connection, NpmWebSocket] = await Promise.all([this.resolveConnection(), loadWebSocket()]);
				} catch (error) {
					failConnect(toStringifiedError(error));
					return;
				}
				if (settled) return;
				if (!ownsGeneration() || this.closed) {
					finishClosedConnect();
					return;
				}
				this.currentUrl = connection.url;
				try {
					socket = new NpmWebSocket(this.currentUrl, {
						headers: connection.headers,
						maxPayload: REALTIME_TRANSCRIPTION_WS_MAX_PAYLOAD_BYTES,
						...proxyAgent ? { agent: proxyAgent } : {}
					});
					socket.binaryType = "nodebuffer";
					this.ws = socket;
					this.transport = transport;
				} catch (error) {
					failConnect(toStringifiedError(error));
					return;
				}
				socket.on("open", () => {
					if (!ownsSocket()) return;
					opened = true;
					this.captureLocalOpen();
					try {
						this.options.onOpen?.(transport);
						if (this.options.readyOnOpen) finishConnect();
					} catch (error) {
						failConnect(toStringifiedError(error));
					}
				});
				socket.on("message", (data) => {
					if (!ownsSocket()) return;
					const payload = data;
					this.captureFrame("inbound", payload);
					try {
						if (!this.options.onMessage) return;
						const parseMessage = this.options.parseMessage ?? defaultParseMessage;
						this.options.onMessage(parseMessage(payload), transport);
					} catch (error) {
						this.emitError(error);
					}
				});
				socket.on("error", (error) => {
					if (!ownsSocket()) return;
					const normalized = toStringifiedError(error);
					this.captureError(normalized);
					if (!opened || !settled) {
						failConnect(normalized);
						return;
					}
					this.emitError(normalized);
				});
				socket.on("close", (code, reasonBuffer) => {
					if (!ownsSocket()) return;
					clearConnectTimeout();
					this.captureClose(code, reasonBuffer);
					const readyForMs = this.readySinceMs === void 0 ? 0 : Date.now() - this.readySinceMs;
					this.ready = false;
					this.readySinceMs = void 0;
					if (readyForMs >= RECONNECT_STABLE_RESET_MS) this.reconnectSupervisor.reset();
					if (this.closeTimer) {
						clearTimeout(this.closeTimer);
						this.closeTimer = void 0;
					}
					if (this.closed) {
						this.forceClose(socket);
						return;
					}
					if (!opened || !settled) {
						failConnect(new Error(this.options.connectClosedBeforeReadyMessage ?? `${this.options.providerId} realtime transcription connection closed before ready`));
						return;
					}
					this.attemptReconnect(generation);
				});
			})();
		});
	}
	async resolveConnection() {
		return {
			url: await (typeof this.options.url === "function" ? this.options.url() : this.options.url),
			headers: await (typeof this.options.headers === "function" ? this.options.headers() : this.options.headers)
		};
	}
	async attemptReconnect(generation) {
		if (generation !== this.connectionGeneration || this.closed || this.reconnecting) return;
		const retry = this.reconnectSupervisor.next();
		if (!retry) {
			this.emitError(new Error(this.options.reconnectLimitMessage ?? `${this.options.providerId} realtime transcription reconnect limit reached`));
			return;
		}
		this.reconnecting = true;
		try {
			await sleepWithAbort(retry.delayMs, retry.signal);
			if (generation === this.connectionGeneration && !this.closed) await this.doConnect(generation);
		} catch {
			if (generation === this.connectionGeneration && !this.closed) {
				this.reconnecting = false;
				await this.attemptReconnect(generation);
			}
		} finally {
			if (generation === this.connectionGeneration) this.reconnecting = false;
		}
	}
	queueAudio(audio) {
		const queued = Buffer.from(audio);
		this.queuedAudio.push(queued);
		this.queuedBytes += queued.byteLength;
		while (this.queuedBytes > this.maxQueuedBytes && this.queuedAudioHead < this.queuedAudio.length) {
			const dropped = this.queuedAudio[this.queuedAudioHead];
			this.queuedAudio[this.queuedAudioHead] = void 0;
			this.queuedAudioHead += 1;
			this.queuedBytes -= dropped?.byteLength ?? 0;
		}
		this.compactQueuedAudio();
	}
	flushQueuedAudio(transport) {
		while (this.queuedAudioHead < this.queuedAudio.length) {
			const audio = this.queuedAudio[this.queuedAudioHead];
			if (audio) {
				this.options.sendAudio(audio, transport);
				this.queuedBytes -= audio.byteLength;
			}
			this.queuedAudio[this.queuedAudioHead] = void 0;
			this.queuedAudioHead += 1;
		}
		this.clearQueuedAudio();
	}
	compactQueuedAudio() {
		if (this.queuedAudioHead === 0 || this.queuedAudioHead * 2 < this.queuedAudio.length) return;
		this.queuedAudio = this.queuedAudio.slice(this.queuedAudioHead);
		this.queuedAudioHead = 0;
	}
	clearQueuedAudio() {
		this.queuedAudio = [];
		this.queuedAudioHead = 0;
		this.queuedBytes = 0;
	}
	send(payload, socket, generation, handleBackpressure) {
		if (!socket || generation !== this.connectionGeneration || this.ws !== socket || socket.readyState !== WEBSOCKET_OPEN) return false;
		const payloadBytes = typeof payload === "string" ? Buffer.byteLength(payload) : payload.byteLength;
		if (socket.bufferedAmount + payloadBytes > REALTIME_TRANSCRIPTION_WS_MAX_BUFFERED_BYTES) {
			handleBackpressure();
			return false;
		}
		this.captureFrame("outbound", payload);
		socket.send(payload);
		return true;
	}
	closeForBackpressure(socket, error) {
		if (socket !== this.ws) return;
		const shouldReport = !this.closed;
		this.closed = true;
		this.cancelConnecting?.();
		this.reconnectSupervisor.cancel();
		this.clearQueuedAudio();
		this.forceClose(socket);
		if (shouldReport) this.emitError(error);
	}
	forceClose(socket = this.ws) {
		if (socket !== this.ws) return;
		if (this.closeTimer) {
			clearTimeout(this.closeTimer);
			this.closeTimer = void 0;
		}
		this.ready = false;
		this.readySinceMs = void 0;
		this.ws = null;
		this.transport = void 0;
		socket?.terminate();
	}
	emitError(error) {
		const normalized = error instanceof Error ? error : new Error(String(error));
		try {
			this.options.callbacks.onError?.(normalized);
		} catch (callbackError) {
			try {
				this.captureError(callbackError instanceof Error ? callbackError : new Error(String(callbackError)));
			} catch {}
		}
	}
	captureFrame(direction, payload) {
		captureWsEvent({
			url: this.currentUrl,
			direction,
			kind: "ws-frame",
			flowId: this.flowId,
			payload,
			meta: {
				provider: this.options.providerId,
				capability: "realtime-transcription"
			}
		});
	}
	captureLocalOpen() {
		captureWsEvent({
			url: this.currentUrl,
			direction: "local",
			kind: "ws-open",
			flowId: this.flowId,
			meta: {
				provider: this.options.providerId,
				capability: "realtime-transcription"
			}
		});
	}
	captureError(error) {
		captureWsEvent({
			url: this.currentUrl,
			direction: "local",
			kind: "error",
			flowId: this.flowId,
			errorText: error.message,
			meta: {
				provider: this.options.providerId,
				capability: "realtime-transcription"
			}
		});
	}
	captureClose(code, reasonBuffer) {
		captureWsEvent({
			url: this.currentUrl,
			direction: "local",
			kind: "ws-close",
			flowId: this.flowId,
			closeCode: code,
			meta: {
				provider: this.options.providerId,
				capability: "realtime-transcription",
				reason: reasonBuffer.length > 0 ? reasonBuffer.toString("utf8") : void 0
			}
		});
	}
};
/** Creates a reusable websocket session wrapper for a provider implementation. */
function createRealtimeTranscriptionWebSocketSession(options) {
	return new WebSocketRealtimeTranscriptionSession(options);
}
//#endregion
export { createRealtimeTranscriptionWebSocketSession as t };
