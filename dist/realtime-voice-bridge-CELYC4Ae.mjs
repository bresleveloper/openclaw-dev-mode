import { d as toStringifiedError, t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { t as RealtimeVoiceSessionLifecycle } from "./realtime-session-lifecycle-CJCE-3t7.mjs";
import "./realtime-voice-provider-C3SkPdAW.mjs";
import { s as buildOpenAIRealtimeSidebandUrl } from "./realtime-quicksilver-wire-CdGWbOsM.mjs";
import { i as readRealtimeErrorDetail, t as captureOpenAIRealtimeWsClose } from "./realtime-provider-shared-CvSijJ_n.mjs";
import { A as requireOpenAIRealtimePlatformAuth, C as isOpenAIRealtimeStartupAuthFailure, M as resolveOpenAIRealtimeEnvApiKey, P as resolveOpenAIRealtimeSecretInput, a as OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED, d as OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED, k as requireOpenAIRealtimeApiKey, m as OPENAI_VOICE_WS_MAX_PAYLOAD_BYTES, r as OPENAI_REALTIME_API_KEY_REQUIRED, s as OPENAI_REALTIME_DEFAULT_MODEL, x as isDirectOpenAIRealtimeWebSocketUrl, y as hasOpenAIRealtimeConfiguredApiKeyInput } from "./realtime-voice-session-policy-BGXV2brx.mjs";
import { n as OpenAIRealtimeMalformedAudioError, t as OpenAIRealtimeEvents } from "./realtime-voice-events-DSXW20yJ.mjs";
import { randomUUID } from "node:crypto";
import WebSocket$1 from "ws";
//#region extensions/openai/realtime-voice-bridge.ts
const OPENAI_REALTIME_MAX_BUFFERED_AUDIO_BYTES = 1048576;
const OPENAI_REALTIME_AUDIO_DROP_WARN_INTERVAL_MS = 5e3;
var OpenAIRealtimeBridge = class OpenAIRealtimeBridge extends OpenAIRealtimeEvents {
	static {
		this.DEFAULT_MODEL = OPENAI_REALTIME_DEFAULT_MODEL;
	}
	static {
		this.MAX_RECONNECT_ATTEMPTS = 5;
	}
	static {
		this.BASE_RECONNECT_DELAY_MS = 1e3;
	}
	static {
		this.CONNECT_TIMEOUT_MS = 1e4;
	}
	constructor(config, runtime) {
		super(config, runtime);
		this.ws = null;
		this.connectionUrl = "";
		this.flowId = randomUUID();
		this.sessionReadyFired = false;
		this.droppedInputAudioFrames = 0;
		this.lastInputAudioDropWarningAt = Number.NEGATIVE_INFINITY;
		this.lifecycle = new RealtimeVoiceSessionLifecycle("OpenAI", {
			pendingAudioOverflowPolicy: "drop-oldest",
			onPendingAudioOverflow: () => this.config.logger.warn("OpenAI realtime input audio queue overflow; keeping newest audio")
		});
	}
	async connect() {
		if (this.terminalError) throw this.terminalError;
		await this.lifecycle.connect((connection) => this.doConnect(connection));
	}
	sendAudio(audio) {
		if (this.lifecycle.phase() === "terminal") return;
		if (!this.lifecycle.isReady() || this.ws?.readyState !== WebSocket$1.OPEN) {
			this.lifecycle.enqueuePendingAudio(audio);
			return;
		}
		if (this.ws.bufferedAmount > OPENAI_REALTIME_MAX_BUFFERED_AUDIO_BYTES) {
			this.droppedInputAudioFrames += 1;
			const now = Date.now();
			if (now - this.lastInputAudioDropWarningAt >= OPENAI_REALTIME_AUDIO_DROP_WARN_INTERVAL_MS) {
				this.config.logger.warn(`OpenAI realtime input audio backpressure; droppedFrames=${this.droppedInputAudioFrames}`);
				this.droppedInputAudioFrames = 0;
				this.lastInputAudioDropWarningAt = now;
			}
			return;
		}
		this.sendEvent({
			type: "input_audio_buffer.append",
			audio: audio.toString("base64")
		});
	}
	sendUserMessage(text, options) {
		if (options?.toolChoice && (this.interruptingPlayback || this.responseActive || this.responseCreateState !== "idle" || this.responseCancelInFlight || this.pendingToolCallIds.size > 0)) throw new Error("Forced realtime tool choice requires an idle response state");
		if (this.pendingToolCallIds.size > 0) {
			this.standaloneSpeechQueue.push(text);
			this.flushStandaloneSpeech();
			return;
		}
		this.sendEvent({
			type: "conversation.item.create",
			item: {
				type: "message",
				role: "user",
				content: [{
					type: "input_text",
					text
				}]
			}
		});
		this.requestResponseCreate(options);
	}
	triggerGreeting(instructions) {
		if (!this.isConnected() || !this.ws) return;
		this.sendUserMessage(instructions ?? this.config.instructions ?? "Greet the meeting.");
	}
	submitToolResult(callId, result, options) {
		if (this.lifecycle.phase() === "terminal" || !this.pendingToolCallIds.has(callId)) return;
		const output = JSON.stringify(result);
		if (typeof output !== "string") throw new Error("OpenAI realtime voice tool result is not JSON-serializable");
		this.sendEvent({
			type: "conversation.item.create",
			item: {
				type: "function_call_output",
				call_id: callId,
				output
			}
		});
		if (options?.willContinue === true) {
			this.continuingToolCallIds.add(callId);
			return;
		}
		this.continuingToolCallIds.delete(callId);
		this.pendingToolCallIds.delete(callId);
		if (options?.suppressResponse === true) {
			this.flushPendingResponseCreate();
			return;
		}
		this.requestResponseCreate();
	}
	close() {
		const connection = this.lifecycle.currentConnection();
		if (!this.lifecycle.cancel()) return;
		this.resetTerminalState();
		if (!connection) return;
		const ws = this.ws;
		this.ws = null;
		ws?.close(1e3, "Bridge closed");
		this.notifyClose(connection, "completed");
	}
	isConnected() {
		return this.lifecycle.isReady() && this.ws?.readyState === WebSocket$1.OPEN;
	}
	async doConnect(lifecycleConnection) {
		let activeWs;
		let startupFrameBytes = 0;
		const attempt = this.lifecycle.createConnectAttempt({
			connection: lifecycleConnection,
			timeoutMs: OpenAIRealtimeBridge.CONNECT_TIMEOUT_MS,
			timeoutError: () => /* @__PURE__ */ new Error("OpenAI realtime connection timeout"),
			onTimeout: () => activeWs?.terminate(),
			onAbort: () => {
				if (activeWs && activeWs.readyState !== WebSocket$1.CLOSED) activeWs.close(1e3, "connection canceled");
			}
		});
		const openWebSocket = (resolvedConnection) => {
			if (attempt.settled) return;
			if (!this.lifecycle.isCurrent(lifecycleConnection) || lifecycleConnection.signal.aborted) {
				attempt.resolve();
				return;
			}
			attempt.startTimeout();
			const url = resolvedConnection.url;
			this.connectionUrl = resolvedConnection.url;
			const debugProxy = this.runtime.resolveDebugProxySettings();
			const proxyAgent = this.runtime.createDebugProxyWebSocketAgent(debugProxy);
			const ws = new WebSocket$1(resolvedConnection.url, {
				headers: resolvedConnection.headers,
				maxPayload: OPENAI_VOICE_WS_MAX_PAYLOAD_BYTES,
				...proxyAgent ? { agent: proxyAgent } : {}
			});
			activeWs = ws;
			this.ws = ws;
			const rejectStartup = (error) => {
				if (!attempt.rejectStartup(error)) return;
				if (ws.readyState !== WebSocket$1.CLOSED) ws.close(1e3, "startup failed");
			};
			ws.on("open", () => {
				if (!this.lifecycle.acceptsEvents(lifecycleConnection)) {
					ws.close(1e3, "stale connection");
					return;
				}
				this.resetRealtimeSessionState();
				this.runtime.captureWsEvent({
					url,
					direction: "local",
					kind: "ws-open",
					flowId: this.flowId,
					meta: {
						provider: "openai",
						capability: "realtime-voice"
					}
				});
				this.sendSessionUpdate();
			});
			ws.on("message", (data) => {
				if (!this.lifecycle.acceptsEvents(lifecycleConnection) || this.ws !== ws) return;
				if (attempt.settled && !attempt.ready) return;
				if (!attempt.ready) {
					startupFrameBytes += data.byteLength;
					if (startupFrameBytes > 1048576) {
						const error = /* @__PURE__ */ new Error("OpenAI realtime sideband startup buffer exceeded");
						attempt.reject(error);
						this.failConnection(error, ws, lifecycleConnection, {
							code: 1009,
							reason: "Sideband startup buffer exceeded"
						});
						return;
					}
				}
				this.runtime.captureWsEvent({
					url,
					direction: "inbound",
					kind: "ws-frame",
					flowId: this.flowId,
					payload: data,
					meta: {
						provider: "openai",
						capability: "realtime-voice"
					}
				});
				try {
					const event = JSON.parse(data.toString());
					if (event.type === "error" && !attempt.ready) {
						rejectStartup(isDirectOpenAIRealtimeWebSocketUrl(url) && isOpenAIRealtimeStartupAuthFailure(event.error) ? new Error(OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED) : new Error(readRealtimeErrorDetail(event.error)));
						return;
					}
					if (event.type === "session.updated") {
						try {
							this.handleEvent(event, lifecycleConnection);
						} catch (error) {
							const readyError = toStringifiedError(error);
							attempt.reject(readyError);
							this.failConnection(readyError, ws, lifecycleConnection, {
								code: 1011,
								reason: "Readiness callback failed"
							});
							return;
						}
						attempt.resolve(this.lifecycle.isReady());
						return;
					}
					this.handleEvent(event, lifecycleConnection);
				} catch (error) {
					if (error instanceof OpenAIRealtimeMalformedAudioError) {
						attempt.reject(error);
						this.failConnection(error, ws, lifecycleConnection, {
							code: 1002,
							reason: "Malformed audio payload"
						});
						return;
					}
					console.error("[openai] realtime event parse failed:", error);
				}
			});
			ws.on("error", (error) => {
				if (!this.lifecycle.acceptsEvents(lifecycleConnection) || this.ws !== ws) return;
				this.runtime.captureWsEvent({
					url,
					direction: "local",
					kind: "error",
					flowId: this.flowId,
					errorText: coerceErrorMessage(error),
					meta: {
						provider: "openai",
						capability: "realtime-voice"
					}
				});
				if (!attempt.ready) {
					const startupError = toStringifiedError(error);
					rejectStartup(isDirectOpenAIRealtimeWebSocketUrl(url) && isOpenAIRealtimeStartupAuthFailure(startupError) ? new Error(OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED) : startupError);
					return;
				}
				this.config.onError?.(toStringifiedError(error));
			});
			ws.on("close", (code, reasonBuffer) => {
				captureOpenAIRealtimeWsClose({
					url,
					flowId: this.flowId,
					capability: "realtime-voice",
					code,
					reasonBuffer
				}, this.runtime.captureWsEvent);
				if (!this.lifecycle.isCurrent(lifecycleConnection)) return;
				if (this.ws === ws) this.ws = null;
				if (attempt.startupFailed) return;
				if (this.terminalError) {
					this.notifyClose(lifecycleConnection, "error");
					return;
				}
				if (this.lifecycle.terminalOutcome(lifecycleConnection) === "completed") {
					attempt.resolve();
					this.notifyClose(lifecycleConnection, "completed");
					return;
				}
				if (!attempt.ready && !attempt.settled) {
					const error = /* @__PURE__ */ new Error("OpenAI realtime connection closed before ready");
					attempt.reject(error);
					return;
				}
				const reason = this.reconnectReason ?? "websocket-close";
				this.reconnectReason = void 0;
				this.attemptReconnect(reason, lifecycleConnection);
			});
		};
		let connectionOrPromise;
		try {
			connectionOrPromise = this.resolveConnectionParams();
		} catch (error) {
			attempt.reject(toStringifiedError(error));
			return attempt.promise;
		}
		if (connectionOrPromise instanceof Promise) connectionOrPromise.then(openWebSocket).catch((error) => {
			if (!this.lifecycle.isCurrent(lifecycleConnection) || this.lifecycle.terminalOutcome(lifecycleConnection) === "completed") {
				attempt.resolve();
				return;
			}
			attempt.reject(toStringifiedError(error));
		});
		else try {
			openWebSocket(connectionOrPromise);
		} catch (error) {
			attempt.reject(toStringifiedError(error));
		}
		await attempt.promise;
	}
	resolveConnectionParams() {
		const cfg = this.config;
		const model = cfg.model ?? OpenAIRealtimeBridge.DEFAULT_MODEL;
		if (cfg.azureEndpoint && cfg.azureDeployment) {
			const apiKey = requireOpenAIRealtimeApiKey(cfg.apiKey);
			const url = `${cfg.azureEndpoint.replace(/\/$/, "").replace(/^http(s?):/, (_, secure) => `ws${secure}:`)}/openai/realtime?api-version=${cfg.azureApiVersion ?? "2024-10-01-preview"}&deployment=${encodeURIComponent(cfg.azureDeployment)}`;
			return {
				url,
				headers: this.runtime.resolveProviderRequestHeaders({
					provider: "openai",
					baseUrl: url,
					capability: "audio",
					transport: "websocket",
					defaultHeaders: { "api-key": apiKey }
				}) ?? { "api-key": apiKey }
			};
		}
		if (hasOpenAIRealtimeConfiguredApiKeyInput(cfg.apiKey)) {
			const directApiKey = resolveOpenAIRealtimeSecretInput(cfg.apiKey);
			if (directApiKey.status === "missing") throw new Error(OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED);
			return this.resolveApiKeyConnectionParams(directApiKey.value, model);
		}
		if (cfg.azureEndpoint) {
			const directApiKey = resolveOpenAIRealtimeEnvApiKey();
			if (directApiKey.status === "missing") throw new Error(OPENAI_REALTIME_API_KEY_REQUIRED);
			return this.resolveApiKeyConnectionParams(directApiKey.value, model);
		}
		return this.resolveDefaultConnectionParams(model);
	}
	async resolveDefaultConnectionParams(model) {
		const auth = await requireOpenAIRealtimePlatformAuth({
			configuredApiKey: this.config.apiKey,
			cfg: this.config.cfg,
			agentId: this.config.agentId
		}, this.runtime);
		return this.resolveApiKeyConnectionParams(auth.value, model);
	}
	resolveApiKeyConnectionParams(apiKey, model) {
		const cfg = this.config;
		if (cfg.azureEndpoint) {
			const url = `${cfg.azureEndpoint.replace(/\/$/, "").replace(/^http(s?):/, (_, secure) => `ws${secure}:`)}/v1/realtime?model=${encodeURIComponent(model)}`;
			return {
				url,
				headers: this.runtime.resolveProviderRequestHeaders({
					provider: "openai",
					baseUrl: url,
					capability: "audio",
					transport: "websocket",
					defaultHeaders: { Authorization: `Bearer ${apiKey}` }
				}) ?? { Authorization: `Bearer ${apiKey}` }
			};
		}
		const url = cfg.callId ? buildOpenAIRealtimeSidebandUrl(cfg.callId) : `wss://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`;
		return {
			url,
			headers: this.runtime.resolveProviderRequestHeaders({
				provider: "openai",
				baseUrl: url,
				capability: "audio",
				transport: "websocket",
				defaultHeaders: { Authorization: `Bearer ${apiKey}` }
			}) ?? { Authorization: `Bearer ${apiKey}` }
		};
	}
	async attemptReconnect(reason, connection) {
		const retry = this.lifecycle.retry(connection, OpenAIRealtimeBridge.MAX_RECONNECT_ATTEMPTS);
		if (!retry) return;
		if (retry === "exhausted") {
			this.config.onEvent?.({
				direction: "client",
				type: "session.reconnect.exhausted",
				detail: `reason=${reason} attempts=${OpenAIRealtimeBridge.MAX_RECONNECT_ATTEMPTS}`
			});
			if (this.lifecycle.failure(connection)) this.resetTerminalState();
			this.notifyClose(connection, "error");
			return;
		}
		const attempt = retry.attempt;
		const delay = OpenAIRealtimeBridge.BASE_RECONNECT_DELAY_MS * 2 ** (attempt - 1);
		if (attempt === 1) {
			this.resetRealtimeSessionState();
			this.config.onEvent?.({
				direction: "client",
				type: "session.continuity.reset"
			});
		}
		this.config.onEvent?.({
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
		const nextConnection = this.lifecycle.reconnect(connection);
		if (!nextConnection) return;
		try {
			await this.doConnect(nextConnection);
			if (!this.lifecycle.isCurrent(nextConnection) || !this.lifecycle.isReady()) return;
			this.config.onEvent?.({
				direction: "client",
				type: "session.reconnect.ready",
				detail: `reason=${reason} attempt=${attempt}`
			});
		} catch (error) {
			if (!this.lifecycle.acceptsEvents(nextConnection)) return;
			this.config.onError?.(toStringifiedError(error));
			await this.attemptReconnect(reason, nextConnection);
		}
	}
	markSessionReady(connection) {
		if (!this.lifecycle.ready(connection)) return;
		if (this.activeConnectionReason) {
			this.config.onEvent?.({
				direction: "server",
				type: "session.rotation.ready",
				detail: `reason=${this.activeConnectionReason}`
			});
			this.activeConnectionReason = void 0;
		}
		if (!this.sessionReadyFired) {
			this.sessionReadyFired = true;
			this.config.onReady?.();
		}
		for (const chunk of this.lifecycle.drainPendingAudio()) this.sendAudio(chunk);
	}
	resetTerminalState() {
		this.sessionReadyFired = false;
		this.reconnectReason = void 0;
		this.activeConnectionReason = void 0;
		this.resetRealtimeSessionState();
	}
	failConnection(error, ws, connection, close) {
		if (this.terminalError) return;
		this.terminalError = error;
		this.lifecycle.failure(connection);
		this.resetTerminalState();
		try {
			this.config.onError?.(error);
		} finally {
			if (ws.readyState !== WebSocket$1.CLOSED) ws.close(close.code, close.reason);
			else this.notifyClose(connection, "error");
		}
	}
	notifyClose(connection, outcome) {
		const terminalOutcome = this.lifecycle.close(connection, outcome);
		if (!terminalOutcome) return;
		this.resetTerminalState();
		this.config.onClose?.(terminalOutcome);
	}
	sendEvent(event, detail) {
		const ws = this.ws;
		if (ws?.readyState === WebSocket$1.OPEN) {
			const type = event && typeof event === "object" && typeof event.type === "string" ? event.type : "unknown";
			const payload = JSON.stringify(event);
			this.runtime.captureWsEvent({
				url: this.connectionUrl,
				direction: "outbound",
				kind: "ws-frame",
				flowId: this.flowId,
				payload,
				meta: {
					provider: "openai",
					capability: "realtime-voice"
				}
			});
			ws.send(payload);
			this.config.onEvent?.({
				direction: "client",
				type,
				...detail ? { detail } : {}
			});
		}
	}
	acceptsEvent(connection) {
		return this.lifecycle.acceptsEvents(connection);
	}
	isTransportOpen() {
		return this.ws?.readyState === WebSocket$1.OPEN;
	}
	onSessionUpdated(connection) {
		this.markSessionReady(connection);
	}
	rotateExpiredSession() {
		this.reconnectReason = "max-duration";
		this.activeConnectionReason = "max-duration";
		this.config.onEvent?.({
			direction: "server",
			type: "session.rotation",
			detail: "reason=max-duration"
		});
		this.ws?.close(1e3, "max-duration rotation");
	}
	failToolCallSessionLimit(error, connection) {
		const ws = this.ws;
		if (ws) this.failConnection(error, ws, connection, {
			code: 1008,
			reason: "Tool-call session limit exceeded"
		});
	}
};
//#endregion
export { OpenAIRealtimeBridge as t };
