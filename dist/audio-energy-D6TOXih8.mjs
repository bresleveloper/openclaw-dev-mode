import { r as mulawToPcm } from "./audio-codec-CZcvtjIg.mjs";
//#region src/talk/audio-energy.ts
const PCM16_MAX_AMPLITUDE = 32768;
const MULAW_LINEAR_SAMPLES = (() => {
	const encoded = Buffer.from([...Array(256).keys()]);
	const decoded = mulawToPcm(encoded);
	return Int16Array.from(encoded, (_, index) => decoded.readInt16LE(index * 2));
})();
/** Ignore decoded transport silence below -66 dBFS while retaining quiet speech. */
function isRealtimeVoiceAudioAudible(audio, format) {
	const minimumPeak = 16;
	if (format.encoding === "g711_ulaw") return audio.some((sample) => Math.abs(MULAW_LINEAR_SAMPLES[sample] ?? 0) >= minimumPeak);
	for (let offset = 0; offset + 1 < audio.byteLength; offset += 2) if (Math.abs(audio.readInt16LE(offset)) >= minimumPeak) return true;
	return false;
}
/** Read RMS and absolute peak from complete little-endian signed PCM16 samples. */
function readPcm16AudioStats(audio) {
	let sumSquares = 0;
	let peak = 0;
	const samples = Math.floor(audio.byteLength / 2);
	for (let index = 0; index < samples; index += 1) {
		const sample = audio.readInt16LE(index * 2);
		peak = Math.max(peak, Math.abs(sample));
		sumSquares += sample * sample;
	}
	return {
		rms: samples > 0 ? Math.sqrt(sumSquares / samples) : 0,
		peak
	};
}
/** Calculate normalized RMS from G.711 mu-law bytes. */
function calculateMulawRms(muLaw) {
	if (muLaw.length === 0) return 0;
	let sumSquares = 0;
	for (const encoded of muLaw) {
		const normalized = (MULAW_LINEAR_SAMPLES[encoded] ?? 0) / PCM16_MAX_AMPLITUDE;
		sumSquares += normalized * normalized;
	}
	return Math.sqrt(sumSquares / muLaw.length);
}
/** Build an OR-threshold gate with optional sustained onset, silence hold, and cooldown. */
function createSpeechThresholdGate(options) {
	const speechFrames = Math.max(1, Math.floor(options.speechFrames ?? 1));
	const silenceFrames = Math.max(0, Math.floor(options.silenceFrames ?? 0));
	const cooldownMs = Math.max(0, options.cooldownMs ?? 0);
	let loudFrames = 0;
	let quietFrames = 0;
	let speaking = false;
	let lastTriggerAt = Number.NEGATIVE_INFINITY;
	return { accept(stats, acceptOptions = {}) {
		if (!(options.rmsThreshold !== void 0 && stats.rms >= options.rmsThreshold || options.peakThreshold !== void 0 && stats.peak >= options.peakThreshold)) {
			loudFrames = 0;
			if (speaking && ++quietFrames >= silenceFrames) speaking = false;
			return false;
		}
		quietFrames = 0;
		loudFrames += 1;
		if (speaking || loudFrames < speechFrames) return false;
		const nowMs = acceptOptions.nowMs ?? Date.now();
		if (nowMs - lastTriggerAt < cooldownMs || acceptOptions.onTrigger?.() === false) return false;
		lastTriggerAt = nowMs;
		speaking = silenceFrames > 0;
		if (!speaking) loudFrames = 0;
		return true;
	} };
}
//#endregion
export { readPcm16AudioStats as i, createSpeechThresholdGate as n, isRealtimeVoiceAudioAudible as r, calculateMulawRms as t };
