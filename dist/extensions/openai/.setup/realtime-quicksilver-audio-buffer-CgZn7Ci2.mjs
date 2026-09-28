import { createStreamingPcmResampler, mulawToPcm, pcmToMulaw } from "openclaw/plugin-sdk/realtime-voice-provider";
const OPENAI_QUICKSILVER_MAX_PENDING_AUDIO_BYTES = 24e4;
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
export { OpenAIQuicksilverPendingAudio as n, assertOpenAIQuicksilverPcmOutput as r, OpenAIQuicksilverAudioAdapter as t };
