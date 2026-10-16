import { c as pcmToMulaw, o as createStreamingPcmResampler, s as mulawToPcm } from "./audio-energy-DXFUFDyy.mjs";
import "./realtime-voice-provider-BV3-O7oZ.mjs";
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
	constructor(maxBytes = OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES, sampleBytes = 2) {
		this.maxBytes = maxBytes;
		this.sampleBytes = sampleBytes;
		this.readOffset = 0;
		this.pendingBytes = 0;
	}
	get length() {
		return this.pendingBytes;
	}
	append(incoming) {
		const alignedLength = incoming.length - incoming.length % this.sampleBytes;
		if (alignedLength === 0) return;
		const retainedBytes = Math.min(alignedLength, this.maxBytes);
		const sourceOffset = alignedLength - retainedBytes;
		const storage = this.storage ??= Buffer.alloc(this.maxBytes);
		const droppedBytes = Math.max(0, this.pendingBytes + retainedBytes - this.maxBytes);
		this.readOffset = (this.readOffset + droppedBytes) % this.maxBytes;
		this.pendingBytes -= droppedBytes;
		const writeOffset = (this.readOffset + this.pendingBytes) % this.maxBytes;
		const firstBytes = Math.min(retainedBytes, this.maxBytes - writeOffset);
		incoming.copy(storage, writeOffset, sourceOffset, sourceOffset + firstBytes);
		if (firstBytes < retainedBytes) incoming.copy(storage, 0, sourceOffset + firstBytes, sourceOffset + retainedBytes);
		this.pendingBytes += retainedBytes;
	}
	readInto(target) {
		const alignedLength = target.length - target.length % this.sampleBytes;
		const readBytes = Math.min(alignedLength, this.pendingBytes);
		const storage = this.storage;
		if (readBytes === 0 || !storage) return 0;
		const firstBytes = Math.min(readBytes, this.maxBytes - this.readOffset);
		storage.copy(target, 0, this.readOffset, this.readOffset + firstBytes);
		if (firstBytes < readBytes) storage.copy(target, firstBytes, 0, readBytes - firstBytes);
		this.readOffset = (this.readOffset + readBytes) % this.maxBytes;
		this.pendingBytes -= readBytes;
		if (this.pendingBytes === 0) this.readOffset = 0;
		return readBytes;
	}
	take(limit = this.length) {
		const output = Buffer.alloc(Math.min(limit, this.length));
		this.readInto(output);
		return output;
	}
	clear() {
		this.storage = void 0;
		this.readOffset = 0;
		this.pendingBytes = 0;
	}
};
//#endregion
export { OpenAIQuicksilverPendingAudio as a, OpenAIQuicksilverAudioClock as i, OPENAI_QUICKSILVER_RELAY_FRAME_BYTES as n, assertOpenAIQuicksilverPcmOutput as o, OpenAIQuicksilverAudioAdapter as r, OPENAI_QUICKSILVER_AUDIO_FRAME_DURATION_MS as t };
