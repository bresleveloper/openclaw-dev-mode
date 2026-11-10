import { a as resolveDebugProxySettings, r as createDebugProxyWebSocketAgent } from "./env-ZuG6CRvK.mjs";
import { i as captureWsEventAsync } from "./runtime-BZkWDI2h.mjs";
import "./proxy-capture-DSHKg1g9.mjs";
import { t as RealtimeVoiceSessionLifecycle } from "./realtime-session-lifecycle-D5AJf2IE.mjs";
import { t as RealtimeVoiceWebSocketTransport } from "./realtime-voice-provider-CSOj_y12.mjs";
import { b as toXaiRealtimeWsUrl, h as XAI_REALTIME_WS_MAX_PAYLOAD_BYTES, n as XAI_REALTIME_BASE_RECONNECT_DELAY_MS, r as XAI_REALTIME_CONNECT_TIMEOUT_MS, v as readXaiRealtimeErrorDetail, y as serializeXaiRealtimeToolResult } from "./realtime-voice-config-ZrZsQBkX.mjs";
import { n as xaiUserAgentHeaderFor } from "./xai-user-agent-DZopgRsl.mjs";
import { t as resolveXaiRealtimeApiKey } from "./realtime-voice-auth.runtime.js";
import { t as XaiRealtimePlaybackMarkOverflowError } from "./realtime-voice-protocol-6SM7Lsej.mjs";
import { n as XaiRealtimeVoiceEvents, t as XaiRealtimeMalformedAudioError } from "./realtime-voice-events-CnULwTQO.mjs";
import { t as WebSocket } from "./ws-runtime-BC0VsR8N.mjs";
//#region extensions/xai/realtime-voice-bridge.ts
var XaiRealtimeVoiceBridge = class extends XaiRealtimeVoiceEvents {
	constructor(config) {
		super(config);
		this.supportsToolResultContinuation = false;
		this.pendingToolResults = [];
		this.pendingUserMessages = [];
		this.sessionReadyFired = false;
		this.transport = new RealtimeVoiceWebSocketTransport({
			providerId: "xai",
			label: "xAI realtime voice",
			callbacks: config,
			lifecycle: new RealtimeVoiceSessionLifecycle("xAI"),
			resolveConnection: () => this.resolveConnectionParams(),
			createSocket: ({ url, headers }) => {
				const proxyAgent = createDebugProxyWebSocketAgent(resolveDebugProxySettings());
				return new WebSocket(url, {
					headers,
					maxPayload: XAI_REALTIME_WS_MAX_PAYLOAD_BYTES,
					...proxyAgent ? { agent: proxyAgent } : {}
				});
			},
			capture: captureWsEventAsync,
			onOpen: () => {
				this.resetRealtimeSessionState({ preserveToolCallState: config.sessionResumption === true && this.conversationId !== null });
				this.sendEvent(this.buildSessionUpdate());
			},
			onEvent: (event, connection) => this.handleEvent(event, connection),
			onReset: () => this.resetTerminalState(),
			startupError: (error) => error instanceof Error ? error : new Error(readXaiRealtimeErrorDetail(error)),
			fatalEventError: (error) => error instanceof XaiRealtimeMalformedAudioError ? {
				code: 1002,
				reason: "Malformed audio payload"
			} : error instanceof XaiRealtimePlaybackMarkOverflowError ? {
				code: 1002,
				reason: "Playback mark overflow"
			} : void 0,
			reconnectBlocked: () => this.reconnectBlockReason(),
			maxReconnectAttempts: 5,
			reconnectDelayMs: XAI_REALTIME_BASE_RECONNECT_DELAY_MS,
			connectTimeoutMs: XAI_REALTIME_CONNECT_TIMEOUT_MS
		});
	}
	connect() {
		return this.transport.connect();
	}
	sendAudio(audio) {
		if (this.transport.lifecycle.phase() === "terminal") return;
		if (!this.isConnected()) {
			this.transport.lifecycle.enqueuePendingAudio(audio);
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
		if (this.transport.lifecycle.phase() === "terminal") return;
		if (!this.isConnected()) {
			if (this.pendingUserMessages.length < 128) this.pendingUserMessages.push(text);
			else this.config.onError?.(/* @__PURE__ */ new Error("xAI realtime voice pending user message queue overflow during reconnect"));
			return;
		}
		this.sendUserMessageNow(text);
	}
	triggerGreeting(instructions) {
		if (this.isConnected() && this.transport.socket) this.sendUserMessage(instructions ?? this.config.instructions ?? "Greet the user.");
	}
	submitToolResult(callId, result, options) {
		if (this.transport.lifecycle.phase() === "terminal" || options?.willContinue === true) return;
		if (!this.isConnected()) {
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
		this.transport.close();
	}
	isConnected() {
		return this.transport.isConnected();
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
	reconnectBlockReason() {
		if (this.config.sessionResumption !== true) return "sessionResumption=false";
		if (this.pendingToolResultAcks.size > 0) return `unacknowledgedToolResults=${this.pendingToolResultAcks.size}`;
		if (!this.conversationId) return "missingConversationId=true";
	}
	acceptsEvent(connection) {
		return this.transport.lifecycle.acceptsEvents(connection);
	}
	onSessionUpdated(connection) {
		if (!this.transport.lifecycle.ready(connection)) return;
		for (const chunk of this.transport.lifecycle.drainPendingAudio()) this.sendAudio(chunk);
		for (const pending of this.pendingToolResults.splice(0)) this.submitToolResultNow(pending.callId, pending.result, pending.options);
		for (const message of this.pendingUserMessages.splice(0)) this.sendUserMessageNow(message);
		if (!this.sessionReadyFired) {
			this.sessionReadyFired = true;
			this.config.onReady?.();
		}
	}
	sendEvent(event, detail) {
		this.transport.send(event, detail);
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
