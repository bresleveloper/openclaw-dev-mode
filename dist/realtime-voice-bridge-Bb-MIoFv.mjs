import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { n as createDebugProxyWebSocketAgent, r as resolveDebugProxySettings } from "./env-BOt5Nx-y.mjs";
import { n as captureWsEvent } from "./runtime-Cr-8v8fa.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./proxy-capture-Dq2n0qoF.mjs";
import { t as RealtimeVoiceSessionLifecycle } from "./realtime-session-lifecycle-CJCE-3t7.mjs";
import "./realtime-voice-provider-C3SkPdAW.mjs";
import { b as toXaiRealtimeWsUrl, h as XAI_REALTIME_WS_MAX_PAYLOAD_BYTES, n as XAI_REALTIME_BASE_RECONNECT_DELAY_MS, r as XAI_REALTIME_CONNECT_TIMEOUT_MS, v as readXaiRealtimeErrorDetail, y as serializeXaiRealtimeToolResult } from "./realtime-voice-config-BZr_Tp5F.mjs";
import { n as xaiUserAgentHeaderFor } from "./xai-user-agent-D6jVFWMW.mjs";
import { t as resolveXaiRealtimeApiKey } from "./realtime-voice-auth.runtime.js";
import { t as XaiRealtimePlaybackMarkOverflowError } from "./realtime-voice-protocol-CQ-Fka4Z.mjs";
import { n as XaiRealtimeVoiceEvents, t as XaiRealtimeMalformedAudioError } from "./realtime-voice-events-Bo1RWMRi.mjs";
import { t as WebSocket } from "./ws-runtime-BC0VsR8N.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/xai/realtime-voice-bridge.ts
var XaiRealtimeVoiceBridge = class extends XaiRealtimeVoiceEvents {
	constructor(..._args) {
		super(..._args);
		this.supportsToolResultContinuation = false;
		this.ws = null;
		this.terminalError = null;
		this.lifecycle = new RealtimeVoiceSessionLifecycle("xAI");
		this.pendingToolResults = [];
		this.pendingUserMessages = [];
		this.connectionUrl = "";
		this.flowId = randomUUID();
		this.sessionReadyFired = false;
	}
	async connect() {
		if (this.terminalError) throw this.terminalError;
		await this.lifecycle.connect((connection) => this.doConnect(connection));
	}
	sendAudio(audio) {
		if (this.lifecycle.phase() === "terminal") return;
		if (!this.isConnected()) {
			this.lifecycle.enqueuePendingAudio(audio);
			return;
		}
		this.sendEvent({
			type: "input_audio_buffer.append",
			audio: audio.toString("base64")
		});
	}
	setMediaTimestamp(ts) {
		this.latestMediaTimestamp = ts;
	}
	sendUserMessage(text) {
		if (this.lifecycle.phase() === "terminal") return;
		if (!this.canSubmitInput()) {
			if (this.pendingUserMessages.length < 128) this.pendingUserMessages.push(text);
			else this.config.onError?.(/* @__PURE__ */ new Error("xAI realtime voice pending user message queue overflow during reconnect"));
			return;
		}
		this.sendUserMessageNow(text);
	}
	triggerGreeting(instructions) {
		if (this.isConnected() && this.ws) this.sendUserMessage(instructions ?? this.config.instructions ?? "Greet the user.");
	}
	submitToolResult(callId, result, options) {
		if (this.lifecycle.phase() === "terminal" || options?.willContinue === true) return;
		if (!this.canSubmitInput()) {
			let serialized;
			try {
				serialized = serializeXaiRealtimeToolResult(result);
			} catch (error) {
				this.config.onError?.(error);
				throw error;
			}
			if (this.pendingToolResults.length >= 128) {
				const error = /* @__PURE__ */ new Error("xAI realtime voice pending tool result queue overflow during reconnect");
				this.config.onError?.(error);
				throw error;
			}
			this.pendingToolResults.push({
				callId,
				result: JSON.parse(serialized),
				...options ? { options } : {}
			});
			return;
		}
		this.submitToolResultNow(callId, result, options);
	}
	close() {
		const connection = this.lifecycle.currentConnection();
		if (!this.lifecycle.cancel()) return;
		this.resetTerminalState();
		if (!connection) return;
		const ws = this.ws;
		this.ws = null;
		if (ws?.readyState !== WebSocket.CLOSED) ws?.close(1e3, "Bridge closed");
		this.notifyClose(connection, "completed");
	}
	isConnected() {
		return this.lifecycle.isReady() && this.ws?.readyState === WebSocket.OPEN;
	}
	async doConnect(connection) {
		let activeWs;
		const attempt = this.lifecycle.createConnectAttempt({
			connection,
			timeoutMs: XAI_REALTIME_CONNECT_TIMEOUT_MS,
			timeoutError: () => /* @__PURE__ */ new Error("xAI realtime voice connection timeout"),
			onTimeout: () => activeWs?.terminate(),
			onAbort: (outcome) => {
				if (outcome !== "error" && activeWs && activeWs.readyState !== WebSocket.CLOSED) activeWs.close(1e3, "connection canceled");
			}
		});
		const openWebSocket = (resolvedConnection) => {
			if (attempt.settled) return;
			if (!this.lifecycle.isCurrent(connection) || connection.signal.aborted) {
				attempt.resolve();
				return;
			}
			attempt.startTimeout();
			const { url, headers } = resolvedConnection;
			this.connectionUrl = url;
			const proxyAgent = createDebugProxyWebSocketAgent(resolveDebugProxySettings());
			const ws = new WebSocket(url, {
				headers,
				maxPayload: XAI_REALTIME_WS_MAX_PAYLOAD_BYTES,
				...proxyAgent ? { agent: proxyAgent } : {}
			});
			activeWs = ws;
			this.ws = ws;
			const rejectStartup = (error) => {
				if (!attempt.rejectStartup(error)) return;
				if (ws.readyState !== WebSocket.CLOSED) ws.close(1e3, "startup failed");
			};
			ws.on("open", () => {
				if (!this.lifecycle.acceptsEvents(connection)) {
					ws.close(1e3, "stale connection");
					return;
				}
				this.resetRealtimeSessionState({ preserveToolCallState: this.config.sessionResumption === true && this.conversationId !== null });
				captureWsEvent({
					url,
					direction: "local",
					kind: "ws-open",
					flowId: this.flowId,
					meta: {
						provider: "xai",
						capability: "realtime-voice"
					}
				});
				this.sendEvent(this.buildSessionUpdate());
			});
			ws.on("message", (data) => {
				if (!this.lifecycle.acceptsEvents(connection) || this.ws !== ws) return;
				if (attempt.settled && !attempt.ready) return;
				captureWsEvent({
					url,
					direction: "inbound",
					kind: "ws-frame",
					flowId: this.flowId,
					payload: data,
					meta: {
						provider: "xai",
						capability: "realtime-voice"
					}
				});
				try {
					const event = JSON.parse(data.toString());
					if (event.type === "error" && !attempt.ready) {
						rejectStartup(new Error(readXaiRealtimeErrorDetail(event.error)));
						return;
					}
					this.handleEvent(event, connection);
					if (event.type === "session.updated" && this.lifecycle.isCurrent(connection) && this.lifecycle.isReady()) attempt.resolve(true);
				} catch (error) {
					if (error instanceof XaiRealtimeMalformedAudioError || error instanceof XaiRealtimePlaybackMarkOverflowError) {
						attempt.reject(error);
						this.failConnection(error, ws, connection);
						return;
					}
					console.error("[xai] realtime event parse failed:", error);
				}
			});
			ws.on("error", (error) => {
				if (!this.lifecycle.acceptsEvents(connection) || this.ws !== ws) return;
				captureWsEvent({
					url,
					direction: "local",
					kind: "error",
					flowId: this.flowId,
					errorText: error instanceof Error ? error.message : String(error),
					meta: {
						provider: "xai",
						capability: "realtime-voice"
					}
				});
				if (!attempt.ready) {
					rejectStartup(toStringifiedError(error));
					return;
				}
				this.config.onError?.(toStringifiedError(error));
			});
			ws.on("close", (code, reasonBuffer) => {
				captureWsEvent({
					url,
					direction: "local",
					kind: "ws-close",
					flowId: this.flowId,
					closeCode: typeof code === "number" ? code : void 0,
					meta: {
						provider: "xai",
						capability: "realtime-voice",
						reason: Buffer.isBuffer(reasonBuffer) && reasonBuffer.length > 0 ? reasonBuffer.toString("utf8") : void 0
					}
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
					attempt.reject(/* @__PURE__ */ new Error("xAI realtime voice connection closed before ready"));
					return;
				}
				this.attemptReconnect("websocket-close", connection);
			});
		};
		this.resolveConnectionParams().then(openWebSocket).catch((error) => {
			if (!this.lifecycle.isCurrent(connection) || this.lifecycle.terminalOutcome(connection) === "completed") {
				attempt.resolve();
				return;
			}
			attempt.reject(toStringifiedError(error));
		});
		await attempt.promise;
	}
	async resolveConnectionParams() {
		const apiKey = this.config.resolveApiKey ? await this.config.resolveApiKey() : await resolveXaiRealtimeApiKey(this.config.apiKey, this.config.cfg, this.config.agentId);
		const model = this.config.model ?? "grok-voice-latest";
		return {
			url: toXaiRealtimeWsUrl(this.config.baseUrl, model, this.config.sessionResumption === true ? this.conversationId ?? void 0 : void 0),
			headers: {
				Authorization: `Bearer ${apiKey}`,
				...xaiUserAgentHeaderFor(this.config.baseUrl)
			}
		};
	}
	async attemptReconnect(reason, connection) {
		const blocked = this.reconnectBlockReason();
		if (blocked) {
			this.config.onEvent?.({
				direction: "client",
				type: "session.reconnect.blocked",
				detail: `reason=${reason} ${blocked}`
			});
			this.enterTerminalState(connection);
			return;
		}
		const retry = this.lifecycle.retry(connection, 5);
		if (!retry) return;
		if (retry === "exhausted") {
			this.config.onEvent?.({
				direction: "client",
				type: "session.reconnect.exhausted",
				detail: `reason=${reason} attempts=5`
			});
			this.enterTerminalState(connection);
			return;
		}
		const attempt = retry.attempt;
		const delay = XAI_REALTIME_BASE_RECONNECT_DELAY_MS * 2 ** (attempt - 1);
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
			this.config.onEvent?.({
				direction: "client",
				type: "session.reconnect.ready",
				detail: `reason=${reason} attempt=${attempt}`
			});
		} catch (error) {
			if (this.terminalError || !this.lifecycle.isCurrent(nextConnection) || this.lifecycle.terminalOutcome(nextConnection)) return;
			this.config.onError?.(toStringifiedError(error));
			await this.attemptReconnect(reason, nextConnection);
		}
	}
	reconnectBlockReason() {
		if (this.config.sessionResumption !== true) return "sessionResumption=false";
		if (this.pendingToolResultAcks.size > 0) return `unacknowledgedToolResults=${this.pendingToolResultAcks.size}`;
		if (!this.conversationId) return "missingConversationId=true";
	}
	acceptsEvent(connection) {
		return this.lifecycle.acceptsEvents(connection);
	}
	onSessionUpdated(connection) {
		if (!this.lifecycle.ready(connection)) return;
		for (const chunk of this.lifecycle.drainPendingAudio()) this.sendAudio(chunk);
		for (const pending of this.pendingToolResults.splice(0)) this.submitToolResultNow(pending.callId, pending.result, pending.options);
		for (const message of this.pendingUserMessages.splice(0)) this.sendUserMessageNow(message);
		if (!this.sessionReadyFired) {
			this.sessionReadyFired = true;
			this.config.onReady?.();
		}
	}
	sendEvent(event, detail) {
		const ws = this.ws;
		if (ws?.readyState !== WebSocket.OPEN) return;
		const type = event && typeof event === "object" && typeof event.type === "string" ? event.type : "unknown";
		const payload = JSON.stringify(event);
		captureWsEvent({
			url: this.connectionUrl,
			direction: "outbound",
			kind: "ws-frame",
			flowId: this.flowId,
			payload,
			meta: {
				provider: "xai",
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
	canSubmitInput() {
		return this.isConnected();
	}
	failConnection(error, ws, connection) {
		if (!this.lifecycle.failure(connection)) return;
		this.terminalError = error;
		this.resetTerminalState();
		try {
			this.config.onError?.(error);
		} finally {
			if (ws.readyState !== WebSocket.CLOSED) ws.close(1002, error instanceof XaiRealtimePlaybackMarkOverflowError ? "Playback mark overflow" : "Malformed audio payload");
			else this.notifyClose(connection, "error");
		}
	}
	enterTerminalState(connection) {
		if (this.lifecycle.failure(connection)) this.resetTerminalState();
		this.notifyClose(connection, "error");
	}
	notifyClose(connection, outcome) {
		const terminalOutcome = this.lifecycle.close(connection, outcome);
		if (!terminalOutcome) return;
		this.resetTerminalState();
		this.config.onClose?.(terminalOutcome);
	}
	resetTerminalState() {
		this.pendingToolResults = [];
		this.pendingUserMessages = [];
		this.conversationId = null;
		this.resetRealtimeSessionState();
	}
};
//#endregion
export { XaiRealtimeVoiceBridge as t };
