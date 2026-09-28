import { n as rawDataToString } from "./ws-BdD3UP1C.mjs";
import { t as RealtimeVoiceSessionLifecycle } from "./realtime-session-lifecycle-CJCE-3t7.mjs";
import "./realtime-voice-provider-C3SkPdAW.mjs";
import { r as isOpenAIGptLiveApiModel } from "./realtime-quicksilver-0VQEPDSP.mjs";
import { t as OpenAILiveDelegationQueue } from "./realtime-live-delegation-queue-uq4IZI5i.mjs";
import { t as parseOpenAIQuicksilverEvent } from "./realtime-quicksilver-events-DmOkRrC8.mjs";
import { a as openAIQuicksilverToolResultText, i as closeOpenAILiveSocket, n as buildOpenAIQuicksilverContextAppend, r as captureOpenAIQuicksilverTransportEvent } from "./realtime-quicksilver-protocol-nZFviYYI.mjs";
import { o as projectOpenAIQuicksilverErrorMessage } from "./realtime-quicksilver-redaction-Cfc2vSbu.mjs";
import { a as buildOpenAIQuicksilverSessionUpdate, c as chunkOpenAIQuicksilverAppendText, o as buildOpenAIQuicksilverWebSocketUrl, r as boundOpenAIQuicksilverDelegationResult, u as createOpenAIQuicksilverRequestIds } from "./realtime-quicksilver-wire-CdGWbOsM.mjs";
import { t as OpenAIQuicksilverTranscript } from "./realtime-quicksilver-transcript-C3GUFLNm.mjs";
import { i as waitForOpenAIQuicksilverConnectStep, n as loadOpenAIQuicksilverMediaSocketFactory, t as connectOpenAIQuicksilverSideband } from "./realtime-quicksilver-sideband-Cr9HsKBe.mjs";
import { o as assertOpenAIQuicksilverPcmOutput } from "./realtime-quicksilver-audio-buffer-CpNltm_9.mjs";
import { t as dispatchOpenAIQuicksilverBridgeDelegation } from "./realtime-quicksilver-bridge-delegation-BjGiDROX.mjs";
//#region extensions/openai/realtime-quicksilver-bridge.ts
const OPENAI_QUICKSILVER_READY_TIMEOUT_MS = 15e3;
const WEBSOCKET_OPEN = 1;
var OpenAIQuicksilverVoiceBridge = class {
	get pacesInputAudio() {
		return isOpenAIGptLiveApiModel(this.config.model);
	}
	constructor(config, runtime) {
		this.config = config;
		this.runtime = runtime;
		this.supportsToolResultContinuation = true;
		this.supportsToolResultSuppression = true;
		this.handlesInputAudioBargeIn = true;
		this.outputAudioMode = "continuous";
		this.activeDelegations = /* @__PURE__ */ new Set();
		this.transcript = new OpenAIQuicksilverTranscript();
		this.requestIds = createOpenAIQuicksilverRequestIds();
		this.lifecycle = new RealtimeVoiceSessionLifecycle("OpenAI", {
			pendingAudioOverflowPolicy: "drop-oldest",
			onPendingAudioOverflow: () => (config.logger?.warn ?? console.warn)("OpenAI GPT-Live input audio queue overflow; keeping newest audio")
		});
	}
	setAudioOutputPort(output) {
		assertOpenAIQuicksilverPcmOutput(this.config.audioFormat);
		if (this.lifecycle.currentConnection() && this.lifecycle.phase() !== "terminal") throw new Error("GPT-Live audio output must be configured before connecting");
		this.closeAudioOutput();
		this.audioOutput = output;
	}
	closeAudioOutput() {
		if (!this.audioOutput) return;
		Atomics.store(new Int32Array(this.audioOutput.state), 0, 1);
		this.audioOutput.port.close();
		this.audioOutput = void 0;
	}
	async connect() {
		await this.lifecycle.connect((connection) => this.connectConnection(connection));
	}
	async connectConnection(connection) {
		let connected;
		try {
			const auth = await waitForOpenAIQuicksilverConnectStep(this.config.resolveAuth(), connection.signal);
			const mediaSocketFactory = this.config.mediaSocketFactory ?? await loadOpenAIQuicksilverMediaSocketFactory(connection.signal);
			connected = await connectOpenAIQuicksilverSideband({
				auth,
				createSocket: (url, options) => {
					const socket = mediaSocketFactory(url, options, {
						model: this.config.model,
						paced: this.pacesInputAudio,
						audioFormat: this.config.audioFormat
					}, { onAudio: (audio) => {
						if (!this.lifecycle.acceptsEvents(connection)) return;
						this.config.onAudio(audio);
						this.config.onEvent?.({
							direction: "server",
							type: isOpenAIGptLiveApiModel(this.config.model) ? "session.output_audio.delta" : "output_audio.delta"
						});
					} });
					this.socket = socket;
					return socket;
				},
				requestIds: this.requestIds,
				signal: connection.signal,
				url: buildOpenAIQuicksilverWebSocketUrl(this.config.model)
			}, this.runtime);
		} catch (error) {
			if (!this.lifecycle.isCurrent(connection) || this.lifecycle.terminalOutcome(connection) === "completed") return;
			this.failLifecycle(connection);
			throw this.redactError(error);
		}
		if (!this.lifecycle.isCurrent(connection) || connection.signal.aborted) {
			this.closeSocket("stale connection", connected.socket);
			return;
		}
		if (isOpenAIGptLiveApiModel(this.config.model)) this.publicDelegations = new OpenAILiveDelegationQueue({
			isActive: () => this.lifecycle.acceptsEvents(connection),
			readInput: () => this.transcript.latestUserInput(),
			dispatch: (id, input) => this.startDelegation(id, input, connection),
			onExpired: (id) => this.sendContext("Ask the user to repeat their request; no user transcript was received.", "speakable", id),
			onError: (error) => this.fail(connection, error)
		});
		captureOpenAIQuicksilverTransportEvent(this.runtime, "local", "ws-open");
		let reachedReady = false;
		let resolveReady;
		let rejectReady;
		let readySettled = false;
		let removeAbortListener = () => {};
		const readyPromise = new Promise((resolve, reject) => {
			resolveReady = resolve;
			rejectReady = reject;
		});
		const settleReady = (providerReady = true) => {
			if (readySettled) return;
			readySettled = true;
			reachedReady = providerReady;
			if (readyTimeout) clearTimeout(readyTimeout);
			removeAbortListener();
			resolveReady();
		};
		const failReady = (error) => {
			if (readySettled) return;
			readySettled = true;
			if (readyTimeout) clearTimeout(readyTimeout);
			removeAbortListener();
			rejectReady(error);
		};
		const failStartup = (error, reason) => {
			if (this.lifecycle.terminalOutcome(connection) === "completed") {
				settleReady(false);
				return;
			}
			if (!this.lifecycle.acceptsEvents(connection) || reachedReady) return;
			this.failLifecycle(connection);
			failReady(this.redactError(error));
			this.closeSocket(reason, connected.socket);
		};
		const readyTimeout = setTimeout(() => {
			failStartup(/* @__PURE__ */ new Error("GPT-Live WebSocket did not emit session.started"), "session-start timeout");
		}, OPENAI_QUICKSILVER_READY_TIMEOUT_MS);
		readyTimeout.unref?.();
		const onAbort = () => {
			if (this.lifecycle.terminalOutcome(connection) === "completed") settleReady(false);
		};
		connection.signal.addEventListener("abort", onAbort, { once: true });
		removeAbortListener = () => connection.signal.removeEventListener("abort", onAbort);
		if (connection.signal.aborted) onAbort();
		connected.socket.on("message", (data, isBinary) => {
			const draining = this.closing?.connection === connection && this.lifecycle.terminalOutcome(connection) === "completed";
			if (!this.lifecycle.acceptsEvents(connection) && !draining || this.socket !== connected.socket) return;
			if (isBinary && draining) return;
			if (isBinary) {
				const error = /* @__PURE__ */ new Error("GPT-Live WebSocket returned an unexpected binary frame");
				if (!reachedReady) failStartup(error, "unexpected binary frame");
				else this.fail(connection, error);
				return;
			}
			const payload = rawDataToString(data);
			captureOpenAIQuicksilverTransportEvent(this.runtime, "inbound", "ws-frame");
			const event = parseOpenAIQuicksilverEvent(payload, this.config.model);
			if (event) {
				if (draining && event.kind !== "transcript-delta" && event.kind !== "transcript-done") return;
				this.handleEvent(event, connection, settleReady, failStartup);
			}
		});
		connected.socket.on("error", (error) => {
			if (!this.lifecycle.acceptsEvents(connection) || this.socket !== connected.socket) return;
			if (!reachedReady) failStartup(error, "startup error");
			else this.fail(connection, error);
		});
		connected.socket.on("close", (code) => {
			if (!this.lifecycle.isCurrent(connection) || this.socket !== connected.socket) return;
			this.socket = void 0;
			if (!reachedReady) {
				if (this.lifecycle.terminalOutcome(connection) === "completed") {
					settleReady();
					this.notifyClose(connection, "completed");
					return;
				}
				const error = /* @__PURE__ */ new Error("GPT-Live WebSocket closed before session.started");
				this.failLifecycle(connection);
				failReady(error);
				this.lifecycle.close(connection, "error");
				return;
			}
			if (this.closing?.connection !== connection) this.notifyClose(connection, code === 1e3 && !isOpenAIGptLiveApiModel(this.config.model) ? "completed" : "error");
		});
		const terminalEvent = connected.detachBuffer();
		if (!terminalEvent && this.audioOutput) this.socket?.setAudioOutputPort(this.audioOutput);
		this.sendEvent(buildOpenAIQuicksilverSessionUpdate({
			model: this.config.model,
			instructions: this.config.instructions,
			voice: this.config.voice
		}));
		for (const frame of connected.bufferedFrames) if (!frame.isBinary) {
			const event = parseOpenAIQuicksilverEvent(rawDataToString(frame.data), this.config.model);
			if (event) this.handleEvent(event, connection, settleReady, failStartup);
		}
		if (terminalEvent) {
			const error = terminalEvent.kind === "error" ? terminalEvent.error : /* @__PURE__ */ new Error("GPT-Live WebSocket closed during startup");
			if (reachedReady) {
				if (terminalEvent.kind === "close" && terminalEvent.code === 1e3 && !isOpenAIGptLiveApiModel(this.config.model)) this.notifyClose(connection, "completed");
				else this.fail(connection, error, "startup terminal event");
			} else failStartup(error, "startup terminal event");
		}
		await readyPromise;
	}
	sendAudio(audio) {
		if (this.lifecycle.phase() === "terminal") return;
		if (!this.lifecycle.isReady() || this.socket?.readyState !== WEBSOCKET_OPEN) {
			this.lifecycle.enqueuePendingAudio(audio);
			return;
		}
		this.sendAudioNow(audio);
	}
	setMediaTimestamp(_ts) {}
	sendUserMessage(text) {
		const channel = isOpenAIGptLiveApiModel(this.config.model) ? "speakable" : void 0;
		this.sendContext(text, channel);
	}
	triggerGreeting(instructions) {
		this.sendContext(instructions ?? "Greet the user briefly.", "speakable");
	}
	submitToolResult(callId, result, options) {
		const channel = options?.suppressResponse || options?.willContinue ? "commentary" : "speakable";
		const isDelegation = this.activeDelegations.has(callId);
		const text = openAIQuicksilverToolResultText(result);
		this.sendContext(isDelegation ? boundOpenAIQuicksilverDelegationResult(text) : text, channel, isDelegation ? callId : void 0);
		if (!options?.willContinue) this.activeDelegations.delete(callId);
	}
	acknowledgeMark(_markName) {}
	close() {
		this.closeAudioOutput();
		const connection = this.lifecycle.currentConnection();
		if (!this.lifecycle.cancel()) return this.closing?.connection === connection ? this.closing?.completion : void 0;
		const socket = this.socket;
		const { publication: transcript } = this.transcript.consume();
		this.resetTerminalState();
		if (connection && socket && isOpenAIGptLiveApiModel(this.config.model)) {
			const closing = { connection };
			this.closing = closing;
			let publicationFailure;
			const completion = closeOpenAILiveSocket(socket).then((reason) => this.notifyClose(connection, reason === "content" || reason === "connection_lost" ? "error" : "completed"), (error) => {
				this.notifyClose(connection, "error");
				throw error;
			}).finally(() => {
				if (publicationFailure) throw publicationFailure.error;
			});
			closing.completion = completion;
			completion.catch(() => (this.config.logger?.warn ?? console.warn)("GPT-Live cleanup INCOMPLETE: finalization or final cleanup failed"));
			try {
				this.publishTranscriptSnapshots(transcript, connection);
			} catch (error) {
				publicationFailure = { error };
			}
			return completion;
		}
		try {
			this.publishTranscriptSnapshots(transcript, connection);
		} finally {
			if (connection) try {
				if (socket?.readyState === WEBSOCKET_OPEN) socket.send(JSON.stringify({ type: "session.close" }));
			} finally {
				this.closeSocket("bridge closed", socket);
				this.notifyClose(connection, "completed");
			}
		}
	}
	isConnected() {
		return this.lifecycle.isReady() && this.socket?.readyState === WEBSOCKET_OPEN;
	}
	handleEvent(event, connection, settleReady, failStartup) {
		if (event.kind === "ignored" || event.kind === "unknown") return;
		if (event.kind === "session-started") {
			if (this.lifecycle.ready(connection)) {
				for (const audio of this.lifecycle.drainPendingAudio()) this.sendAudioNow(audio);
				this.socket?.startAudio();
				if (!this.lifecycle.acceptsEvents(connection)) return;
				this.config.onReady?.();
			}
			this.config.onEvent?.({
				direction: "server",
				type: "session.started"
			});
			settleReady();
			return;
		}
		if (event.kind === "session-closed") {
			if (!this.lifecycle.isReady()) {
				failStartup(/* @__PURE__ */ new Error("GPT-Live closed before startup"), "session closed");
				return;
			}
			const socket = this.socket;
			try {
				this.notifyClose(connection, event.reason === "connection_lost" || event.reason === "content" ? "error" : "completed");
			} finally {
				this.closeSocket("session closed", socket);
			}
			return;
		}
		if (event.kind === "audio-cleared") {
			this.config.onEvent?.({
				direction: "server",
				type: "output_audio_buffer.cleared"
			});
			if (!this.audioOutput) this.config.onClearAudio("barge-in");
			return;
		}
		if (event.kind === "audio") return;
		if (event.kind === "transcript-delta" || event.kind === "transcript-done") {
			const publicApi = isOpenAIGptLiveApiModel(this.config.model);
			if (publicApi) {
				const draining = this.closing?.connection === connection && this.lifecycle.terminalOutcome(connection) === "completed";
				const isCurrent = () => this.lifecycle.isCurrent(connection);
				this.transcript.appendPublic(event, {
					onTranscript: this.config.onTranscript,
					isCurrent,
					canAppend: () => isCurrent() && (draining || this.lifecycle.acceptsEvents(connection))
				});
			} else this.transcript.append(event);
			if (!this.lifecycle.isCurrent(connection)) return;
			if (!publicApi) this.config.onTranscript?.(event.role, event.text, event.kind === "transcript-done");
			this.config.onEvent?.({
				direction: "server",
				type: event.kind === "transcript-done" ? event.role === "assistant" ? "response.done" : "turn.done" : publicApi ? `session.${event.role === "user" ? "input" : "output"}_transcript.delta` : `${event.role === "user" ? "input" : "output"}_transcript.added`
			});
			this.publicDelegations?.resume();
			return;
		}
		if (event.kind === "delegation") {
			if (this.publicDelegations) this.publicDelegations.enqueue(event.id);
			else this.startDelegation(event.id, event.prompt ?? this.transcript.latestUserInput(), connection, event.prompt);
			return;
		}
		const message = projectOpenAIQuicksilverErrorMessage("provider");
		const error = new Error(message);
		if (!this.lifecycle.isReady()) {
			failStartup(error, "session start failed");
			return;
		}
		const reportEvent = () => this.config.onEvent?.({
			direction: "server",
			type: "error",
			detail: message
		});
		if (event.fatalAuth) this.fail(connection, error, "authentication failed", reportEvent);
		else {
			reportEvent();
			this.config.onError?.(error);
		}
	}
	startDelegation(id, input, connection, prompt) {
		dispatchOpenAIQuicksilverBridgeDelegation({
			id,
			input,
			prompt,
			model: this.config.model,
			callbacks: this.config,
			transcript: this.transcript,
			activeDelegations: this.activeDelegations,
			isActive: () => this.lifecycle.acceptsEvents(connection),
			isCurrent: () => this.lifecycle.isCurrent(connection),
			sendReply: (message) => this.sendContext(message, "speakable", id),
			onError: (error) => this.fail(connection, error)
		});
	}
	sendAudioNow(audio) {
		this.socket?.sendAudio(audio);
	}
	sendContext(text, channel, delegationId) {
		if (this.lifecycle.phase() === "terminal") return;
		for (const chunk of chunkOpenAIQuicksilverAppendText(text)) this.sendEvent(buildOpenAIQuicksilverContextAppend({
			model: this.config.model,
			text: chunk,
			channel,
			delegationId
		}));
	}
	sendEvent(event) {
		if (!this.socket || this.socket.readyState !== WEBSOCKET_OPEN) return;
		const payload = JSON.stringify(event);
		captureOpenAIQuicksilverTransportEvent(this.runtime, "outbound", "ws-frame");
		this.socket.send(payload);
	}
	fail(connection, error, reason = "bridge error", beforeError) {
		if (!this.lifecycle.failure(connection)) return;
		const socket = this.socket;
		let drain;
		if (isOpenAIGptLiveApiModel(this.config.model)) {
			const completion = new Promise((resolve, reject) => {
				drain = {
					resolve,
					reject
				};
			});
			this.closing = {
				connection,
				completion
			};
			completion.catch(() => (this.config.logger?.warn ?? console.warn)("GPT-Live failure cleanup observer failed"));
		}
		try {
			this.notifyClose(connection, "error", () => {
				beforeError?.();
				if (this.lifecycle.isCurrent(connection)) this.config.onError?.(this.redactError(error));
			});
		} catch (failure) {
			drain?.reject(failure);
			throw failure;
		} finally {
			this.closeSocket(reason, socket);
			drain?.resolve();
		}
	}
	redactError(_error) {
		return new Error(projectOpenAIQuicksilverErrorMessage("transport"));
	}
	failLifecycle(connection) {
		if (this.lifecycle.failure(connection)) this.resetTerminalState();
	}
	publishTranscriptSnapshots(publication, connection = this.lifecycle.currentConnection()) {
		this.transcript.publish(publication, {
			onTranscript: this.config.onTranscript,
			isCurrent: () => Boolean(connection && this.lifecycle.isCurrent(connection))
		});
	}
	resetTerminalState() {
		this.closeAudioOutput();
		this.socket?.stopAudio();
		this.publicDelegations?.stop();
		this.publicDelegations = void 0;
		this.activeDelegations.clear();
		this.transcript.clear();
	}
	closeSocket(reason, socket = this.socket) {
		try {
			socket?.close(1e3, reason);
		} catch {}
	}
	notifyClose(connection, reason, beforeClose) {
		const outcome = this.lifecycle.close(connection, reason);
		if (!outcome) return;
		const { publication: transcript } = this.transcript.consume();
		this.resetTerminalState();
		try {
			this.publishTranscriptSnapshots(transcript, connection);
		} finally {
			try {
				if (this.lifecycle.isCurrent(connection)) beforeClose?.();
			} finally {
				if (this.lifecycle.isCurrent(connection)) this.config.onClose?.(reason === "error" ? "error" : outcome);
			}
		}
	}
};
//#endregion
export { OpenAIQuicksilverVoiceBridge as t };
