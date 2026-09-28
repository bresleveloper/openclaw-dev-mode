import { a as isOpenAIGptLiveSubscriptionModel, r as isOpenAIGptLiveApiModel } from "./realtime-quicksilver-0VQEPDSP.mjs";
import { i as closeOpenAILiveSocket } from "./realtime-quicksilver-protocol-nZFviYYI.mjs";
import { a as projectOpenAIQuicksilverAuthErrorMessage, o as projectOpenAIQuicksilverErrorMessage } from "./realtime-quicksilver-redaction-Cfc2vSbu.mjs";
import { a as buildOpenAIQuicksilverSessionUpdate, i as buildOpenAIQuicksilverSession, l as createOpenAIQuicksilverCall, o as buildOpenAIQuicksilverWebSocketUrl, u as createOpenAIQuicksilverRequestIds } from "./realtime-quicksilver-wire-CdGWbOsM.mjs";
import { t as OpenAIQuicksilverDelegationController } from "./realtime-quicksilver-delegation-controller-IGMwvj4X.mjs";
import { n as reserveOpenAIQuicksilverSession, t as releaseOpenAIQuicksilverSession } from "./realtime-quicksilver-session-limit-D_5q6nOg.mjs";
import { i as waitForOpenAIQuicksilverConnectStep, n as loadOpenAIQuicksilverMediaSocketFactory, r as openAIQuicksilverConnectAbortError, t as connectOpenAIQuicksilverSideband } from "./realtime-quicksilver-sideband-Cr9HsKBe.mjs";
import { a as OpenAIQuicksilverPendingAudio, o as assertOpenAIQuicksilverPcmOutput, r as OpenAIQuicksilverAudioAdapter } from "./realtime-quicksilver-audio-buffer-CpNltm_9.mjs";
import { a as QuicksilverSocketAudioQueue } from "./realtime-quicksilver-socket.shared-BAkFNqz8.mjs";
import WebSocket$1 from "ws";
//#region extensions/openai/realtime-quicksilver-gateway-bridge.ts
const RELAY_SAMPLE_RATE = 24e3;
const QUICKSILVER_SESSION_TTL_MS = 18e5;
const QUICKSILVER_CONNECT_TIMEOUT_MS = 3e4;
const WEBSOCKET_OPEN = 1;
function normalizeSidebandCloseReason(reason) {
	return (typeof reason === "string" ? reason : reason?.toString("utf8") ?? "").replaceAll(/\s+/g, " ").trim().slice(0, 180);
}
function describeSidebandClose(code, reason) {
	return `OpenAI GPT-Live sideband closed (code ${code}${reason ? `: ${reason}` : ""})`;
}
/** Realtime voice bridge used only when a Gateway relay injects the agent runner. */
var OpenAIQuicksilverGatewayBridge = class {
	constructor(config, runtime) {
		this.config = config;
		this.runtime = runtime;
		this.supportsToolResultContinuation = false;
		this.supportsToolResultSuppression = false;
		this.handlesInputAudioBargeIn = true;
		this.outputAudioMode = "continuous";
		this.pacesInputAudio = true;
		this.abortController = new AbortController();
		this.connected = false;
		this.closed = false;
		this.closeNotified = false;
		this.closeReason = "completed";
		this.providerSessionClosed = false;
		this.pendingAudio = new OpenAIQuicksilverPendingAudio();
		this.ready = false;
		this.audio = new OpenAIQuicksilverAudioAdapter(config);
		this.pendingRawAudio = new QuicksilverSocketAudioQueue(config.audioFormat?.encoding === "g711_ulaw" ? 4e4 : 24e4);
	}
	setAudioOutputPort(output) {
		assertOpenAIQuicksilverPcmOutput(this.config.audioFormat);
		if (this.connectPromise || this.closed) throw new Error("GPT-Live audio output must be configured before connecting");
		this.closeAudioOutput();
		this.audioOutput = output;
	}
	closeAudioOutput() {
		if (!this.audioOutput) return;
		Atomics.store(new Int32Array(this.audioOutput.state), 0, 1);
		this.audioOutput.port.close();
		this.audioOutput = void 0;
	}
	connect() {
		if (this.closed) return Promise.reject(/* @__PURE__ */ new Error("GPT-Live gateway relay bridge is closed"));
		this.connectPromise ??= this.connectInternal().catch((error) => {
			this.closeAudioOutput();
			throw error;
		});
		return this.connectPromise;
	}
	sendAudio(audio) {
		if (this.closed) return;
		if (this.directSocket) this.directSocket.sendAudio(audio);
		else if (this.transport === "webrtc") {
			const pcm = this.audio.decodeInput(audio);
			if (this.peer) this.peer.sendAudio(pcm);
			else this.pendingAudio.append(pcm);
		} else if (!this.abortController.signal.aborted) this.pendingRawAudio.append(audio);
	}
	setMediaTimestamp(_ts) {}
	sendUserMessage(text) {
		this.delegations?.sendSessionContext(text, "speakable");
	}
	triggerGreeting(instructions) {
		this.sendUserMessage(instructions?.trim() || "Greet the user briefly.");
	}
	submitToolResult() {
		throw new Error("GPT-Live gateway relay uses provider-owned agent delegations");
	}
	acknowledgeMark() {}
	close(options) {
		return this.teardown("completed", void 0, options?.disposition ?? "abort");
	}
	isConnected() {
		return this.connected && !this.closed;
	}
	async connectInternal() {
		if (!this.config.runAgentConsult) throw new Error("OpenAI GPT-Live gateway relay requires the Gateway agent-consult runtime");
		const audioFormat = this.config.audioFormat;
		if (audioFormat && (audioFormat.channels !== 1 || !(audioFormat.encoding === "pcm16" && audioFormat.sampleRateHz === RELAY_SAMPLE_RATE || audioFormat.encoding === "g711_ulaw" && audioFormat.sampleRateHz === 8e3))) throw new Error("OpenAI GPT-Live gateway relay requires mono PCM16 at 24 kHz or G.711 mu-law at 8 kHz");
		reserveOpenAIQuicksilverSession(this);
		const connectSignal = AbortSignal.any([this.abortController.signal, AbortSignal.timeout(this.config.connectTimeoutMs ?? QUICKSILVER_CONNECT_TIMEOUT_MS)]);
		let auth;
		try {
			auth = await waitForOpenAIQuicksilverConnectStep(this.config.resolveAuth(), connectSignal);
		} catch (error) {
			if (!this.closingPromise) this.releaseResources("abort");
			throw this.redactAdmissionError(error);
		}
		try {
			const requestIds = createOpenAIQuicksilverRequestIds();
			if (auth.type === "api-key" && !isOpenAIGptLiveSubscriptionModel(this.config.model)) await this.connectDirect(auth, requestIds, connectSignal);
			else await this.connectWebRtc(auth, requestIds, connectSignal);
			if (this.closed || connectSignal.aborted) throw openAIQuicksilverConnectAbortError(connectSignal);
			this.connected = true;
			if (!this.timer) this.scheduleExpiry(QUICKSILVER_SESSION_TTL_MS);
		} catch (error) {
			if (!this.closingPromise) this.releaseResources("abort");
			throw this.redactError(error);
		}
	}
	async connectDirect(auth, requestIds, connectSignal) {
		this.transport = "direct";
		let resolveReady;
		const readyPromise = new Promise((resolve) => {
			resolveReady = resolve;
		});
		this.delegations = this.createDelegationController({ onSessionStarted: resolveReady });
		await this.connectSocket(auth, requestIds, buildOpenAIQuicksilverWebSocketUrl(this.config.model), connectSignal);
		if (!this.closed && this.audioOutput) this.directSocket?.setAudioOutputPort(this.audioOutput);
		this.sendSocketEvent(buildOpenAIQuicksilverSessionUpdate({
			model: this.config.model,
			hostControlsInput: true,
			instructions: this.config.instructions,
			voice: this.config.voice
		}));
		await waitForOpenAIQuicksilverConnectStep(readyPromise, connectSignal);
	}
	async connectWebRtc(auth, requestIds, connectSignal) {
		this.transport = "webrtc";
		this.pendingAudio.append(this.audio.decodeInput(this.pendingRawAudio.take()));
		this.delegations = this.createDelegationController();
		const peerPromise = (this.config.createPeer ?? (async (callbacks, signal) => {
			const { OpenAIQuicksilverAudioPeer } = await import("./extensions/openai/realtime-quicksilver-peer.runtime.js");
			return await OpenAIQuicksilverAudioPeer.create({
				callbacks,
				signal,
				output: this.audioOutput
			});
		}))({
			onAudio: (audio) => this.audio.sendOutput(audio),
			onError: (error) => this.fail(error),
			onMediaError: () => this.config.logger.debug?.("GPT-Live WebRTC media packet dropped"),
			onRtpPacket: () => this.config.onEvent?.({
				direction: "server",
				type: "output_audio.rtp"
			})
		}, connectSignal);
		peerPromise.then((peer) => {
			if (connectSignal.aborted || this.closed) peer.close();
		}, () => void 0);
		this.peer = await waitForOpenAIQuicksilverConnectStep(peerPromise, connectSignal);
		if (this.pendingAudio.length > 0) {
			const pendingAudio = this.pendingAudio;
			this.pendingAudio = new OpenAIQuicksilverPendingAudio();
			this.peer.adoptPendingAudio(pendingAudio);
		}
		const offerSdp = await waitForOpenAIQuicksilverConnectStep(this.peer.createOffer(), connectSignal);
		const call = await waitForOpenAIQuicksilverConnectStep(createOpenAIQuicksilverCall({
			auth,
			requestIds,
			sdp: offerSdp,
			session: buildOpenAIQuicksilverSession({
				model: this.config.model,
				hostControlsInput: Boolean(this.config.handleDelegationInput),
				instructions: this.config.instructions,
				voice: this.config.voice
			}),
			signal: connectSignal,
			fetchImpl: this.config.fetchImpl
		}, this.runtime), connectSignal);
		if (call.kind !== "gpt-live") throw new Error("GPT-Live gateway relay unexpectedly used the GA realtime call shape");
		await waitForOpenAIQuicksilverConnectStep(this.peer.applyAnswer(call.answerSdp), connectSignal);
		await this.connectSocket(auth, requestIds, call.sidebandUrl, connectSignal);
	}
	async connectSocket(auth, requestIds, url, connectSignal) {
		const mediaSocketFactory = this.transport === "direct" ? this.config.mediaSocketFactory ?? await loadOpenAIQuicksilverMediaSocketFactory(connectSignal) : void 0;
		let directSocket;
		const createSocket = mediaSocketFactory ? (socketUrl, options) => {
			const socket = mediaSocketFactory(socketUrl, options, {
				model: this.config.model,
				paced: true,
				audioFormat: this.config.audioFormat
			}, { onAudio: (audio) => {
				if (this.closed) return;
				this.config.onAudio(audio);
				this.config.onEvent?.({
					direction: "server",
					type: isOpenAIGptLiveApiModel(this.config.model) ? "session.output_audio.delta" : "output_audio.delta"
				});
			} });
			directSocket = socket;
			return socket;
		} : this.config.webSocketFactory ?? ((socketUrl, options) => new WebSocket$1(socketUrl, options));
		const connected = await connectOpenAIQuicksilverSideband({
			auth,
			createSocket,
			requestIds,
			signal: connectSignal,
			url
		}, this.runtime);
		if (connectSignal.aborted) {
			connected.socket.close(1e3, "session stopped");
			throw connectSignal.reason;
		}
		this.sideband = {
			socket: connected.socket,
			requestIds
		};
		this.attachSidebandHandlers(connected.socket);
		this.adoptConnectedSocket(connected, directSocket);
	}
	adoptConnectedSocket(connected, directSocket) {
		const terminalEvent = connected.detachBuffer();
		if (!terminalEvent && directSocket) {
			this.directSocket = directSocket;
			directSocket.sendAudio(this.pendingRawAudio.take());
		}
		for (const frame of connected.bufferedFrames) this.handleSidebandFrame(frame.data, frame.isBinary);
		if (terminalEvent?.kind === "error") throw terminalEvent.error;
		if (terminalEvent?.kind === "close") {
			const reason = normalizeSidebandCloseReason(terminalEvent.reason);
			throw new Error(describeSidebandClose(terminalEvent.code, reason));
		}
	}
	createDelegationController(params) {
		const runAgentConsult = this.config.runAgentConsult;
		if (!runAgentConsult) throw new Error("OpenAI GPT-Live gateway relay requires the Gateway agent-consult runtime");
		return new OpenAIQuicksilverDelegationController({
			getSocket: () => this.sideband?.socket,
			logger: this.config.logger,
			model: this.config.model,
			onError: this.config.onError,
			onFatalError: (error) => this.fail(error),
			onSessionClosed: (reason) => {
				this.providerSessionClosed = true;
				if (reason === "content" || reason === "connection_lost") this.closeReason = "error";
				this.teardown(reason === "content" || reason === "connection_lost" ? "error" : "completed");
			},
			onSessionStarted: (expiresAt) => {
				if (expiresAt !== void 0) this.scheduleExpiry(Math.min(QUICKSILVER_SESSION_TTL_MS, Math.max(0, expiresAt * 1e3 - Date.now())));
				if (!this.ready) {
					this.connected = true;
					this.ready = true;
					if (this.transport === "direct") this.directSocket?.startAudio();
					if (this.closed) return;
					this.config.onReady?.();
				}
				params?.onSessionStarted?.();
			},
			onTranscript: (role, text, done) => this.config.onTranscript?.(role, text, done),
			handleDelegationInput: this.config.handleDelegationInput,
			onWireEventType: (eventType) => {
				this.config.onEvent?.({
					direction: "server",
					type: eventType
				});
				if (eventType === "output_audio_buffer.cleared") {
					this.audio.reset();
					if (this.transport === "webrtc") this.peer?.clearOutputAudio?.();
					if (!this.audioOutput) this.config.onClearAudio("barge-in");
				}
			},
			runAgentConsult,
			signal: this.abortController.signal
		}, this.runtime.formatErrorMessage);
	}
	sendSocketEvent(event) {
		const socket = this.sideband?.socket;
		if (socket?.readyState === WEBSOCKET_OPEN) socket.send(JSON.stringify(event));
	}
	attachSidebandHandlers(socket) {
		socket.on("message", (data, isBinary) => this.handleSidebandFrame(data, isBinary));
		socket.on("error", (error) => this.fail(error));
		socket.on("close", (code, rawReason) => {
			const closeCode = code ?? 1006;
			const reason = normalizeSidebandCloseReason(rawReason);
			if (!this.closed) {
				if (isOpenAIGptLiveApiModel(this.config.model) && !this.providerSessionClosed) this.fail(/* @__PURE__ */ new Error("GPT-Live transport ended without session.closed"));
				else if (closeCode === 1e3) this.teardown("completed");
				else this.fail(new Error(describeSidebandClose(closeCode, reason)));
			}
		});
	}
	handleSidebandFrame(data, isBinary) {
		this.delegations?.handleFrame(data, isBinary);
	}
	scheduleExpiry(ttlMs) {
		if (this.timer) clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.teardown("completed");
		}, Math.max(0, ttlMs));
		this.timer.unref?.();
	}
	fail(error) {
		const redactedError = this.redactError(error);
		this.teardown("error", () => this.config.onError?.(redactedError));
	}
	redactError(error) {
		const projected = new Error(projectOpenAIQuicksilverErrorMessage("gateway"));
		if (error instanceof Error && error.name === "TimeoutError") projected.name = "TimeoutError";
		return projected;
	}
	redactAdmissionError(error) {
		const projected = new Error(projectOpenAIQuicksilverAuthErrorMessage(error));
		if (error instanceof Error && error.name === "TimeoutError") projected.name = "TimeoutError";
		return projected;
	}
	teardown(reason, beforeClose, disposition = "abort") {
		if (this.closed) return this.closingPromise;
		this.closed = true;
		this.closeAudioOutput();
		this.directSocket?.stopAudio();
		this.closeReason = reason;
		const socket = this.sideband?.socket;
		if (socket?.readyState === WEBSOCKET_OPEN && isOpenAIGptLiveApiModel(this.config.model) && !this.providerSessionClosed) {
			this.delegations?.beginTranscriptDrain(disposition);
			this.connected = false;
			this.ready = false;
			this.pendingAudio.clear();
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = void 0;
			}
			if (this.providerSessionClosed) {
				this.finishClose(disposition, beforeClose);
				return;
			}
			this.closingPromise = closeOpenAILiveSocket(socket).then((receiptReason) => {
				if (receiptReason === "content" || receiptReason === "connection_lost") this.closeReason = "error";
			}).catch((error) => {
				this.closeReason = "error";
				throw error;
			}).finally(() => this.finishClose(disposition, beforeClose));
			this.closingPromise.catch(() => {
				this.config.logger.warn("GPT-Live cleanup INCOMPLETE: finalization or final cleanup failed");
			});
			return this.closingPromise;
		}
		this.finishClose(disposition, beforeClose);
	}
	finishClose(disposition, beforeClose) {
		try {
			this.delegations?.flushTranscript();
		} finally {
			this.releaseResources(disposition);
			try {
				beforeClose?.();
			} finally {
				if (!this.closeNotified) {
					this.closeNotified = true;
					this.config.onClose?.(this.closeReason);
				}
			}
		}
	}
	releaseResources(disposition) {
		this.closeAudioOutput();
		this.directSocket?.stopAudio();
		releaseOpenAIQuicksilverSession(this);
		this.connected = false;
		this.ready = false;
		this.transport = void 0;
		this.pendingAudio.clear();
		this.pendingRawAudio.clear();
		this.audio.reset();
		if (disposition === "detach") this.delegations?.detach();
		else this.delegations?.stop(/* @__PURE__ */ new Error("GPT-Live delegation stopped"));
		this.abortController.abort(/* @__PURE__ */ new Error("GPT-Live gateway relay bridge closed"));
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = void 0;
		}
		const socket = this.sideband?.socket;
		this.sideband = void 0;
		this.directSocket = void 0;
		if (socket?.readyState === WEBSOCKET_OPEN && !this.providerSessionClosed && !this.closingPromise) try {
			socket.send(JSON.stringify({ type: "session.close" }));
		} catch {}
		try {
			socket?.close(1e3, "session closed");
		} catch {}
		this.peer?.close();
		this.peer = void 0;
	}
};
//#endregion
export { OpenAIQuicksilverGatewayBridge as t };
