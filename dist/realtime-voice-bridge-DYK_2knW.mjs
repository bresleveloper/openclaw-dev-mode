import { t as WebSocket } from "./websocket-runtime-jKgLhX3s.mjs";
import { t as RealtimeVoiceSessionLifecycle } from "./realtime-session-lifecycle-D5AJf2IE.mjs";
import { t as RealtimeVoiceWebSocketTransport } from "./realtime-voice-provider-CSOj_y12.mjs";
import { i as resolveOpenAIRealtimeRequestHeaders, n as readRealtimeErrorDetail } from "./realtime-provider-shared-vbb3-15T.mjs";
import { s as buildOpenAIRealtimeSidebandUrl } from "./realtime-quicksilver-wire-DYi1LbKq.mjs";
import { A as requireOpenAIRealtimeApiKey, C as isDirectOpenAIRealtimeWebSocketUrl, P as resolveOpenAIRealtimeSecretInput, T as isOpenAIRealtimeStartupAuthFailure, a as OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED, b as hasOpenAIRealtimeConfiguredApiKeyInput, d as OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED, f as OPENAI_REALTIME_SIDEBAND_STARTUP_MAX_BYTES, j as requireOpenAIRealtimePlatformAuth, m as OPENAI_VOICE_WS_MAX_PAYLOAD_BYTES, r as OPENAI_REALTIME_API_KEY_REQUIRED } from "./realtime-voice-session-policy-BOfFN3Av.mjs";
import { n as OpenAIRealtimeMalformedAudioError, t as OpenAIRealtimeEvents } from "./realtime-voice-events-DsmvxWTc.mjs";
//#region extensions/openai/realtime-voice-bridge.ts
const OPENAI_REALTIME_MAX_BUFFERED_AUDIO_BYTES = 1048576;
const OPENAI_REALTIME_AUDIO_DROP_WARN_INTERVAL_MS = 5e3;
var OpenAIRealtimeBridge = class extends OpenAIRealtimeEvents {
	constructor(config, runtime) {
		super(config, runtime);
		this.sessionReadyFired = false;
		this.droppedInputAudioFrames = 0;
		this.lastInputAudioDropWarningAt = Number.NEGATIVE_INFINITY;
		this.transport = new RealtimeVoiceWebSocketTransport({
			providerId: "openai",
			label: "OpenAI realtime",
			callbacks: config,
			lifecycle: new RealtimeVoiceSessionLifecycle("OpenAI", {
				pendingAudioOverflowPolicy: "drop-oldest",
				onPendingAudioOverflow: () => config.logger.warn("OpenAI realtime input audio queue overflow; keeping newest audio")
			}),
			resolveConnection: () => this.resolveConnectionParams(),
			createSocket: ({ url, headers }) => {
				const proxyAgent = runtime.createDebugProxyWebSocketAgent(runtime.resolveDebugProxySettings());
				return new WebSocket(url, {
					headers,
					maxPayload: OPENAI_VOICE_WS_MAX_PAYLOAD_BYTES,
					...proxyAgent ? { agent: proxyAgent } : {}
				});
			},
			capture: runtime.captureWsEventAsync,
			onOpen: () => {
				this.resetRealtimeSessionState();
				this.sendSessionUpdate();
			},
			onEvent: (event, connection) => this.handleEvent(event, connection),
			onReset: () => this.resetTerminalState(),
			startupError: (error, url) => isDirectOpenAIRealtimeWebSocketUrl(url) && isOpenAIRealtimeStartupAuthFailure(error) ? new Error(OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED) : error instanceof Error ? error : new Error(readRealtimeErrorDetail(error)),
			fatalEventError: (error, event) => event?.type === "session.updated" ? {
				code: 1011,
				reason: "Readiness callback failed"
			} : error instanceof OpenAIRealtimeMalformedAudioError ? {
				code: 1002,
				reason: "Malformed audio payload"
			} : void 0,
			startupLimit: {
				bytes: OPENAI_REALTIME_SIDEBAND_STARTUP_MAX_BYTES,
				message: "OpenAI realtime sideband startup buffer exceeded",
				reason: "Sideband startup buffer exceeded"
			},
			closeOnFailedAbort: true,
			onFirstReconnect: () => {
				this.resetRealtimeSessionState();
				config.onEvent?.({
					direction: "client",
					type: "session.continuity.reset"
				});
			},
			maxReconnectAttempts: 5,
			reconnectDelayMs: 1e3,
			connectTimeoutMs: 1e4
		});
	}
	connect() {
		return this.transport.connect();
	}
	sendAudio(audio) {
		if (this.transport.lifecycle.phase() === "terminal") return;
		if (!this.transport.lifecycle.isReady() || this.transport.socket?.readyState !== WebSocket.OPEN) {
			this.transport.lifecycle.enqueuePendingAudio(audio);
			return;
		}
		if (this.transport.socket.bufferedAmount > OPENAI_REALTIME_MAX_BUFFERED_AUDIO_BYTES) {
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
		if (options?.toolChoice && (this.responseBusy || this.pendingToolCallIds.size > 0)) throw new Error("Forced realtime tool choice requires an idle response state");
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
		if (!this.isConnected() || !this.transport.socket) return;
		this.sendUserMessage(instructions ?? this.config.instructions ?? "Greet the meeting.");
	}
	submitToolResult(callId, result, options) {
		if (this.transport.lifecycle.phase() === "terminal" || !this.pendingToolCallIds.has(callId)) return;
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
		this.transport.close();
	}
	isConnected() {
		return this.transport.isConnected();
	}
	resolveConnectionParams() {
		const cfg = this.config;
		const model = cfg.model ?? "gpt-realtime-2.1";
		if (cfg.azureEndpoint && cfg.azureDeployment) {
			const apiKey = requireOpenAIRealtimeApiKey(cfg.apiKey);
			const url = `${cfg.azureEndpoint.replace(/\/$/, "").replace(/^http(s?):/, (_, secure) => `ws${secure}:`)}/openai/realtime?api-version=${cfg.azureApiVersion ?? "2024-10-01-preview"}&deployment=${encodeURIComponent(cfg.azureDeployment)}`;
			return {
				url,
				headers: resolveOpenAIRealtimeRequestHeaders(this.runtime, url, { "api-key": apiKey }, "websocket")
			};
		}
		if (hasOpenAIRealtimeConfiguredApiKeyInput(cfg.apiKey)) {
			const directApiKey = resolveOpenAIRealtimeSecretInput(cfg.apiKey);
			if (!directApiKey) throw new Error(OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED);
			return this.resolveApiKeyConnectionParams(directApiKey, model);
		}
		if (cfg.azureEndpoint) {
			const directApiKey = resolveOpenAIRealtimeSecretInput(process.env.OPENAI_API_KEY);
			if (!directApiKey) throw new Error(OPENAI_REALTIME_API_KEY_REQUIRED);
			return this.resolveApiKeyConnectionParams(directApiKey, model);
		}
		return this.resolveDefaultConnectionParams(model);
	}
	async resolveDefaultConnectionParams(model) {
		const auth = await requireOpenAIRealtimePlatformAuth({
			configuredApiKey: this.config.apiKey,
			cfg: this.config.cfg,
			agentId: this.config.agentId
		}, this.runtime);
		return this.resolveApiKeyConnectionParams(auth, model);
	}
	resolveApiKeyConnectionParams(apiKey, model) {
		const cfg = this.config;
		let url;
		if (cfg.baseUrl) {
			const endpoint = new URL(cfg.baseUrl);
			endpoint.search = [...endpoint.search ? endpoint.search.slice(1).split("&").filter((part) => !new URLSearchParams(part).has("model")) : [], `model=${encodeURIComponent(model)}`].join("&");
			url = endpoint.toString();
		} else if (cfg.azureEndpoint) url = `${cfg.azureEndpoint.replace(/\/$/, "").replace(/^http(s?):/, (_, secure) => `ws${secure}:`)}/v1/realtime?model=${encodeURIComponent(model)}`;
		else url = cfg.callId ? buildOpenAIRealtimeSidebandUrl(cfg.callId) : `wss://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`;
		return {
			url,
			headers: resolveOpenAIRealtimeRequestHeaders(this.runtime, url, { Authorization: `Bearer ${apiKey}` }, "websocket")
		};
	}
	onSessionUpdated(connection) {
		if (!this.transport.lifecycle.ready(connection)) return;
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
		for (const chunk of this.transport.lifecycle.drainPendingAudio()) this.sendAudio(chunk);
	}
	resetTerminalState() {
		this.sessionReadyFired = false;
		this.activeConnectionReason = void 0;
		this.resetRealtimeSessionState();
	}
	sendEvent(event, detail) {
		this.transport.send(event, detail);
	}
	acceptsEvent(connection) {
		return this.transport.lifecycle.acceptsEvents(connection);
	}
	isTransportOpen() {
		return this.transport.socket?.readyState === WebSocket.OPEN;
	}
	rotateExpiredSession() {
		this.activeConnectionReason = "max-duration";
		this.config.onEvent?.({
			direction: "server",
			type: "session.rotation",
			detail: "reason=max-duration"
		});
		this.transport.rotate("max-duration");
	}
	failToolCallSessionLimit(error, connection) {
		if (this.transport.socket) this.transport.fail(error, connection, {
			code: 1008,
			reason: "Tool-call session limit exceeded"
		});
	}
};
//#endregion
export { OpenAIRealtimeBridge as t };
