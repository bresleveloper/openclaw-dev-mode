import { c as pcmToMulaw, o as createStreamingPcmResampler, s as mulawToPcm } from "./audio-energy-CUNIcCl_.mjs";
import "./realtime-voice-provider-C3SkPdAW.mjs";
//#region extensions/openai/realtime-quicksilver-audio-buffer.ts
const RELAY_FRAME_SAMPLES = 480;
const MAX_PENDING_RELAY_FRAMES = 250;
const OPENAI_QUICKSILVER_AUDIO_FRAME_DURATION_MS = 20;
const OPENAI_QUICKSILVER_RELAY_FRAME_BYTES = RELAY_FRAME_SAMPLES * 2;
const OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES = 960 * MAX_PENDING_RELAY_FRAMES;
function assertOpenAIQuicksilverPcmOutput(format) {
	if (format && (format.encoding !== "pcm16" || format.sampleRateHz !== 24e3 || format.channels !== 1)) throw new Error("GPT-Live direct audio output requires mono PCM16 at 24 kHz");
}
/** Keeps telephony resampling state and its delayed output tail with the audio adapter. */
var OpenAIQuicksilverAudioAdapter = class {
	constructor(config) {
		this.config = config;
		this.inbound = createStreamingPcmResampler(8e3, 24e3);
		this.outbound = createStreamingPcmResampler(24e3, 8e3);
		this.telephony = config.audioFormat?.encoding === "g711_ulaw";
	}
	decodeInput(audio) {
		return this.telephony ? this.inbound.process(mulawToPcm(audio)) : audio;
	}
	sendOutput(pcm) {
		const audio = this.telephony ? pcmToMulaw(this.outbound.process(pcm)) : pcm;
		if (audio.length > 0) this.config.onAudio(audio);
	}
	finishOutput() {
		if (!this.telephony) return;
		const tail = pcmToMulaw(this.outbound.flush());
		this.outbound = createStreamingPcmResampler(24e3, 8e3);
		if (tail.length > 0) this.config.onAudio(tail);
	}
	reset() {
		this.inbound = createStreamingPcmResampler(8e3, 24e3);
		this.outbound = createStreamingPcmResampler(24e3, 8e3);
	}
};
/** One real-time clock for WebSocket PCM and WebRTC RTP; stalls never drain capture in a burst. */
var OpenAIQuicksilverAudioClock = class {
	constructor(onFrame) {
		this.onFrame = onFrame;
	}
	start() {
		if (this.timer) return;
		let nextFrameAt = performance.now();
		const tick = () => {
			const skippedFrames = Math.max(0, Math.floor((performance.now() - nextFrameAt) / 20));
			nextFrameAt += (skippedFrames + 1) * 20;
			this.timer = setTimeout(tick, Math.max(0, nextFrameAt - performance.now()));
			this.timer.unref?.();
			this.onFrame(skippedFrames);
		};
		tick();
	}
	stop() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = void 0;
		}
	}
};
var OpenAIQuicksilverPendingAudio = class {
	constructor() {
		this.readOffset = 0;
		this.pendingBytes = 0;
	}
	get length() {
		return this.pendingBytes;
	}
	append(incoming) {
		const evenLength = incoming.length - incoming.length % 2;
		if (evenLength === 0) return;
		const retainedBytes = Math.min(evenLength, OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES);
		const sourceOffset = evenLength - retainedBytes;
		const storage = this.storage ??= Buffer.alloc(OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES);
		const droppedBytes = Math.max(0, this.pendingBytes + retainedBytes - OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES);
		this.readOffset = (this.readOffset + droppedBytes) % OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES;
		this.pendingBytes -= droppedBytes;
		const writeOffset = (this.readOffset + this.pendingBytes) % OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES;
		const firstBytes = Math.min(retainedBytes, OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES - writeOffset);
		incoming.copy(storage, writeOffset, sourceOffset, sourceOffset + firstBytes);
		if (firstBytes < retainedBytes) incoming.copy(storage, 0, sourceOffset + firstBytes, sourceOffset + retainedBytes);
		this.pendingBytes += retainedBytes;
	}
	readInto(target) {
		const evenLength = target.length - target.length % 2;
		const readBytes = Math.min(evenLength, this.pendingBytes);
		const storage = this.storage;
		if (readBytes === 0 || !storage) return 0;
		const firstBytes = Math.min(readBytes, OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES - this.readOffset);
		storage.copy(target, 0, this.readOffset, this.readOffset + firstBytes);
		if (firstBytes < readBytes) storage.copy(target, firstBytes, 0, readBytes - firstBytes);
		this.readOffset = (this.readOffset + readBytes) % OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES;
		this.pendingBytes -= readBytes;
		if (this.pendingBytes === 0) this.readOffset = 0;
		return readBytes;
	}
	clear() {
		this.storage = void 0;
		this.readOffset = 0;
		this.pendingBytes = 0;
	}
};
//#endregion
export { OpenAIQuicksilverPendingAudio as a, OpenAIQuicksilverAudioClock as i, OPENAI_QUICKSILVER_RELAY_FRAME_BYTES as n, assertOpenAIQuicksilverPcmOutput as o, OpenAIQuicksilverAudioAdapter as r, OPENAI_QUICKSILVER_AUDIO_FRAME_DURATION_MS as t };
