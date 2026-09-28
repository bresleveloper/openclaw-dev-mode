import { c as readErrorName, i as extractErrorCode, u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as canonicalizeBase64 } from "./base64-B5EyWEOm.mjs";
import { n as rawDataToString } from "./ws-BdD3UP1C.mjs";
import { o as buildRealtimeVoiceAgentControlSpeechMessage } from "./agent-run-control-shared-DXVEJ-0Y.mjs";
import "./realtime-voice-provider-C3SkPdAW.mjs";
import { r as isOpenAIGptLiveApiModel } from "./realtime-quicksilver-0VQEPDSP.mjs";
import { t as OpenAILiveDelegationQueue } from "./realtime-live-delegation-queue-uq4IZI5i.mjs";
import { r as buildOpenAIQuicksilverDelegationPrompt } from "./realtime-quicksilver-instructions-CkYwSLJz.mjs";
import { t as parseOpenAIQuicksilverEvent } from "./realtime-quicksilver-events-DmOkRrC8.mjs";
import { n as buildOpenAIQuicksilverContextAppend } from "./realtime-quicksilver-protocol-nZFviYYI.mjs";
import { o as projectOpenAIQuicksilverErrorMessage } from "./realtime-quicksilver-redaction-Cfc2vSbu.mjs";
import { c as chunkOpenAIQuicksilverAppendText, r as boundOpenAIQuicksilverDelegationResult } from "./realtime-quicksilver-wire-CdGWbOsM.mjs";
import { t as OpenAIQuicksilverTranscript } from "./realtime-quicksilver-transcript-C3GUFLNm.mjs";
//#region extensions/openai/realtime-quicksilver-delegation-controller.ts
const WEBSOCKET_OPEN = 1;
const CONSULT_FAILURE_TEXT = "The agent task failed. Tell the user it did not complete and offer to try again.";
function projectWireEventType(event, model) {
	const live = isOpenAIGptLiveApiModel(model);
	switch (event.kind) {
		case "session-started": return "session.started";
		case "session-closed": return "session.closed";
		case "audio-cleared": return "output_audio_buffer.cleared";
		case "audio": return live ? "session.output_audio.delta" : "output_audio.delta";
		case "transcript-delta": return live ? `session.${event.role === "user" ? "input" : "output"}_transcript.delta` : event.role === "user" ? "input_transcript.added" : "output_transcript.added";
		case "transcript-done": return "turn.done";
		case "delegation": return live ? "session.delegation.created" : "delegation.created";
		case "error": return "error";
		case "ignored": return event.eventType === "session.updated" ? "session.updated" : void 0;
		case "unknown": return;
	}
}
/** Owns the provider's single active delegation and its once-consumed transcript context. */
var OpenAIQuicksilverDelegationController = class {
	constructor(options, formatErrorMessage) {
		this.options = options;
		this.formatErrorMessage = formatErrorMessage;
		this.delegationGeneration = 0;
		this.onSessionAbort = () => {
			const reason = this.options.signal.reason;
			this.stop(reason instanceof Error ? reason : /* @__PURE__ */ new Error("GPT-Live session stopped"));
		};
		this.stopped = false;
		this.transcript = new OpenAIQuicksilverTranscript();
		if (isOpenAIGptLiveApiModel(options.model)) this.publicDelegations = new OpenAILiveDelegationQueue({
			isActive: () => !this.stopped && !this.drainDisposition && !options.signal.aborted,
			readInput: () => this.transcript.latestUserInput(),
			dispatch: (id, input) => this.startDelegation(id, input),
			onExpired: (id) => {
				this.sendAppend("Ask the user to repeat their request; no user transcript was received.", "speakable", id);
			},
			onError: (error) => this.fail(error)
		});
		this.completionClaimsAdopted = options.runAgentConsult.adoptCompletionClaims !== void 0;
		options.runAgentConsult.adoptCompletionClaims?.();
		if (options.signal.aborted) this.onSessionAbort();
		else options.signal.addEventListener("abort", this.onSessionAbort, { once: true });
	}
	handleFrame(data, isBinary) {
		if (this.stopped) return;
		if (isBinary) {
			this.fail(/* @__PURE__ */ new Error("OpenAI GPT-Live sideband returned an unexpected binary frame"));
			return;
		}
		const payload = rawDataToString(data);
		const event = parseOpenAIQuicksilverEvent(payload, this.options.model);
		if (event) {
			if (event.kind === "session-closed") {
				this.handleEvent(event);
				return;
			}
			const eventType = this.drainDisposition ? void 0 : projectWireEventType(event, this.options.model);
			if (eventType) this.options.onWireEventType?.(eventType);
			this.handleEvent(event);
		}
	}
	handleEvent(event) {
		if (this.stopped || event.kind === "ignored" || event.kind === "audio-cleared") return;
		if (this.drainDisposition && event.kind !== "transcript-delta" && event.kind !== "transcript-done" && event.kind !== "session-closed") return;
		if (event.kind === "unknown") {
			this.options.logger.debug?.("OpenAI GPT-Live ignored an unsupported sideband event");
			return;
		}
		if (event.kind === "session-started") {
			this.options.onSessionStarted?.(event.expiresAt);
			return;
		}
		if (event.kind === "session-closed") {
			try {
				this.options.onSessionClosed?.(event.reason);
			} finally {
				if (this.drainDisposition === "detach") this.detach();
				else this.stop(/* @__PURE__ */ new Error("GPT-Live session closed"));
			}
			return;
		}
		if (event.kind === "transcript-delta" || event.kind === "transcript-done") {
			if (isOpenAIGptLiveApiModel(this.options.model)) {
				this.transcript.appendPublic(event, {
					onTranscript: this.options.onTranscript,
					canAppend: () => !this.stopped
				});
				this.publicDelegations?.resume();
			} else {
				this.transcript.append(event);
				this.options.onTranscript?.(event.role, event.text, event.kind === "transcript-done");
			}
			return;
		}
		if (event.kind === "error") {
			const error = new Error(projectOpenAIQuicksilverErrorMessage("provider"));
			this.options.logger.warn(error.message);
			if (event.fatalAuth) this.options.onFatalError(error);
			else this.options.onError?.(error);
			return;
		}
		if (event.kind === "audio") {
			if (!this.options.onAudio) return;
			const audio = canonicalizeBase64(event.data);
			if (!audio) {
				this.fail(/* @__PURE__ */ new Error("OpenAI GPT-Live returned malformed base64 audio"));
				return;
			}
			this.options.onAudio(Buffer.from(audio, "base64"));
			return;
		}
		if (this.publicDelegations) this.publicDelegations.enqueue(event.id);
		else {
			const input = event.prompt ?? this.transcript.latestUserInput();
			if (event.prompt === void 0 && !input.trim()) {
				this.sendAppend("Ask the user to repeat their request; no user transcript was received.", "speakable", event.id);
				return;
			}
			this.startDelegation(event.id, input);
		}
	}
	sendSessionContext(text, channel) {
		const content = text.trim();
		if (content) this.sendAppend(content, channel);
	}
	beginTranscriptDrain(disposition) {
		if (this.stopped || this.drainDisposition) return;
		this.drainDisposition = disposition;
		this.publicDelegations?.stop();
		this.revokeRequesterFinal();
		this.pendingDelegation = void 0;
		if (disposition === "abort") this.consultController?.abort(/* @__PURE__ */ new Error("GPT-Live session closing"));
	}
	stop(reason) {
		if (this.stopped) return;
		this.publicDelegations?.stop();
		this.flushTranscript();
		this.markStopped();
		this.consultController?.abort(reason);
		this.consultController = void 0;
	}
	/** Releases sideband ownership without canceling work already accepted by the host. */
	detach() {
		if (this.stopped) return;
		this.publicDelegations?.stop();
		this.flushTranscript();
		this.markStopped();
	}
	flushTranscript() {
		if (isOpenAIGptLiveApiModel(this.options.model)) this.consumeTranscript();
	}
	consumeTranscript() {
		const snapshot = this.transcript.consume();
		this.transcript.publish(snapshot.publication, { onTranscript: this.options.onTranscript });
		return snapshot.context;
	}
	startDelegation(id, input) {
		if (this.stopped || this.drainDisposition || this.options.signal.aborted || !input.trim()) return;
		const handleInput = this.options.handleDelegationInput;
		if (handleInput) {
			const socket = this.options.getSocket();
			let responded = false;
			const respond = (message) => {
				if (responded) return;
				responded = true;
				if (!socket || socket !== this.options.getSocket()) return;
				try {
					this.sendAppend(message, "speakable", id, socket);
				} catch (error) {
					this.fail(toErrorObject(error, "OpenAI GPT-Live control response failed"));
				}
			};
			try {
				if (handleInput(input, respond) === "control") {
					this.transcript.clearPendingUserInput();
					return;
				}
			} catch (error) {
				this.fail(toErrorObject(error, "OpenAI GPT-Live control admission failed"));
				return;
			}
		}
		if (this.stopped || this.drainDisposition || this.options.signal.aborted) return;
		const transcript = this.consumeTranscript();
		if (this.stopped || this.drainDisposition || this.options.signal.aborted) return;
		const delegation = {
			id,
			prompt: buildOpenAIQuicksilverDelegationPrompt({
				input,
				transcript
			})
		};
		if (this.consultController) {
			this.pendingDelegation = delegation;
			const runner = this.options.runAgentConsult;
			if (runner.steer) this.schedulePendingSteering(this.consultController, runner.steer);
			else {
				this.revokeRequesterFinal();
				this.consultController.abort(/* @__PURE__ */ new Error("Realtime delegation superseded"));
			}
			return;
		}
		this.launchDelegation(delegation);
	}
	launchDelegation(delegation) {
		if (this.stopped || this.options.signal.aborted) return;
		const controller = new AbortController();
		const generation = ++this.delegationGeneration;
		this.consultController = controller;
		this.activeDelegationId = delegation.id;
		this.requesterFinalOwner = {
			delegationId: delegation.id,
			generation
		};
		this.runDelegation(delegation, generation, controller.signal).catch((error) => this.fail(toErrorObject(error, "OpenAI GPT-Live delegation failed"))).finally(() => {
			if (this.consultController !== controller) return;
			this.consultController = void 0;
			this.activeDelegationId = void 0;
			const pending = this.pendingDelegation;
			this.pendingDelegation = void 0;
			if (pending) this.launchDelegation(pending);
		});
	}
	schedulePendingSteering(controller, steer) {
		if (this.steeringPromise) return;
		const completion = (async () => {
			await Promise.resolve();
			while (!this.stopped && !controller.signal.aborted && this.consultController === controller) {
				const delegation = this.pendingDelegation;
				this.pendingDelegation = void 0;
				if (!delegation) return;
				try {
					await steer({
						prompt: delegation.prompt,
						signal: controller.signal
					});
				} catch (error) {
					this.revokeRequesterFinal();
					if (this.stopped || controller.signal.aborted || readErrorName(error) === "AbortError" || extractErrorCode(error) === "ABORT_ERR") return;
					const fatal = toErrorObject(error, "Realtime delegation steering failed");
					this.pendingDelegation = void 0;
					controller.abort(fatal);
					this.fail(fatal);
					return;
				}
				if (this.stopped || controller.signal.aborted || this.consultController !== controller) return;
				this.activeDelegationId = delegation.id;
				const requesterFinalOwner = this.requesterFinalOwner;
				if (requesterFinalOwner) this.requesterFinalOwner = {
					delegationId: delegation.id,
					generation: requesterFinalOwner.generation
				};
			}
		})().finally(() => {
			if (this.steeringPromise === completion) this.steeringPromise = void 0;
			if (this.pendingDelegation && !this.stopped) this.schedulePendingSteering(controller, steer);
		});
		this.steeringPromise = completion;
	}
	markStopped() {
		this.stopped = true;
		this.revokeRequesterFinal();
		this.options.signal.removeEventListener("abort", this.onSessionAbort);
		this.pendingDelegation = void 0;
		this.transcript.clear();
	}
	async runDelegation(delegation, generation, signal) {
		let text;
		let failed = false;
		const runner = this.options.runAgentConsult;
		try {
			if (this.options.handleDelegationInput) this.sendSessionContext(buildRealtimeVoiceAgentControlSpeechMessage("I’ll check that request."), "speakable");
			const result = await runner({
				prompt: delegation.prompt,
				signal,
				requesterFinal: { append: (finalText) => this.appendRequesterFinal(generation, finalText) }
			});
			if (signal.aborted) {
				runner.claimAppend?.();
				this.revokeRequesterFinal();
				return;
			}
			text = boundOpenAIQuicksilverDelegationResult(result.text);
		} catch (error) {
			if (signal.aborted || readErrorName(error) === "AbortError" || extractErrorCode(error) === "ABORT_ERR") {
				runner.claimAppend?.();
				this.revokeRequesterFinal();
				return;
			}
			const reason = this.formatErrorMessage(error).replaceAll(/\s+/g, " ").trim();
			this.options.logger.warn(`OpenAI GPT-Live delegation consult failed: ${truncateUtf16Safe(reason, 180) || "unknown error"}`);
			failed = true;
			text = CONSULT_FAILURE_TEXT;
		}
		while (this.steeringPromise) await this.steeringPromise;
		if (signal.aborted || this.stopped) {
			runner.claimAppend?.();
			this.revokeRequesterFinal();
			return;
		}
		const claim = failed ? runner.claimFailureAppend : runner.claimAppend;
		if (claim) {
			if (!claim()) {
				this.revokeRequesterFinal();
				return;
			}
		} else if (this.completionClaimsAdopted) {
			this.revokeRequesterFinal();
			this.fail(/* @__PURE__ */ new Error(failed ? "Realtime delegation failure ownership is unavailable" : "Realtime delegation completion ownership is unavailable"));
			return;
		}
		const delegationId = this.activeDelegationId;
		if (!delegationId) {
			this.revokeRequesterFinal();
			return;
		}
		if (!this.sendAppend(text, "speakable", delegationId)) this.revokeRequesterFinal();
	}
	appendRequesterFinal(generation, text) {
		const owner = this.requesterFinalOwner;
		if (this.stopped || !owner || owner.generation !== generation) return false;
		this.requesterFinalOwner = void 0;
		return this.sendAppend(boundOpenAIQuicksilverDelegationResult(text), "speakable", owner.delegationId);
	}
	revokeRequesterFinal() {
		this.requesterFinalOwner = void 0;
		this.options.runAgentConsult.revokeRequesterFinal?.();
	}
	sendAppend(text, channel, delegationId, socket = this.options.getSocket()) {
		for (const chunk of chunkOpenAIQuicksilverAppendText(text)) {
			if (this.stopped || this.drainDisposition || this.options.signal.aborted || !socket || socket !== this.options.getSocket() || socket.readyState !== WEBSOCKET_OPEN) return false;
			socket.send(JSON.stringify(buildOpenAIQuicksilverContextAppend({
				model: this.options.model,
				text: chunk,
				channel,
				delegationId
			})));
		}
		return true;
	}
	fail(error) {
		if (this.stopped) return;
		this.options.logger.warn(error.message);
		this.options.onFatalError(error);
	}
};
//#endregion
export { OpenAIQuicksilverDelegationController as t };
