import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
//#region src/talk/audio-codec.ts
const TELEPHONY_SAMPLE_RATE = 8e3;
const RESAMPLE_FILTER_TAPS = 31;
const RESAMPLE_CUTOFF_GUARD = .94;
const RESAMPLE_MAX_PRECOMPUTED_PHASES = 4096;
const RESAMPLE_HALF_TAPS = Math.floor(RESAMPLE_FILTER_TAPS / 2);
const RESAMPLE_WINDOW = Array.from({ length: RESAMPLE_FILTER_TAPS }, (_, tapIndex) => .5 - .5 * Math.cos(2 * Math.PI * tapIndex / 30));
const HOST_IS_LITTLE_ENDIAN = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;
/** Clamp an intermediate sample to signed 16-bit PCM range. */
function clamp16(value) {
	return Math.max(-32768, Math.min(32767, value));
}
function canUseInt16View(buffer) {
	return HOST_IS_LITTLE_ENDIAN && buffer.byteOffset % Int16Array.BYTES_PER_ELEMENT === 0;
}
function int16View(buffer) {
	return new Int16Array(buffer.buffer, buffer.byteOffset, Math.floor(buffer.byteLength / Int16Array.BYTES_PER_ELEMENT));
}
function readInt16Samples(buffer) {
	if (canUseInt16View(buffer)) return int16View(buffer);
	const samples = new Int16Array(Math.floor(buffer.byteLength / Int16Array.BYTES_PER_ELEMENT));
	for (let i = 0; i < samples.length; i += 1) samples[i] = buffer.readInt16LE(i * Int16Array.BYTES_PER_ELEMENT);
	return samples;
}
function sinc(x) {
	if (x === 0) return 1;
	return Math.sin(Math.PI * x) / (Math.PI * x);
}
function gcd(left, right) {
	let a = Math.abs(Math.trunc(left));
	let b = Math.abs(Math.trunc(right));
	while (b !== 0) {
		const next = a % b;
		a = b;
		b = next;
	}
	return a || 1;
}
function buildResampleKernel(inputSampleRate, outputSampleRate, cutoffCyclesPerSample) {
	if (!Number.isInteger(inputSampleRate) || !Number.isInteger(outputSampleRate)) return;
	const divisor = gcd(inputSampleRate, outputSampleRate);
	const inputStep = inputSampleRate / divisor;
	const phaseCount = outputSampleRate / divisor;
	if (phaseCount > RESAMPLE_MAX_PRECOMPUTED_PHASES) return;
	return {
		coefficients: Array.from({ length: phaseCount }, (_, phaseIndex) => {
			const phase = phaseIndex / phaseCount;
			const phaseCoefficients = new Float64Array(RESAMPLE_FILTER_TAPS);
			let weightSum = 0;
			for (let tap = -15; tap <= RESAMPLE_HALF_TAPS; tap += 1) {
				const distance = tap - phase;
				const lowPass = 2 * cutoffCyclesPerSample * sinc(2 * cutoffCyclesPerSample * distance);
				const tapIndex = tap + RESAMPLE_HALF_TAPS;
				const coefficient = lowPass * (RESAMPLE_WINDOW[tapIndex] ?? 0);
				phaseCoefficients[tapIndex] = coefficient;
				weightSum += coefficient;
			}
			return {
				coefficients: phaseCoefficients,
				weightSum
			};
		}),
		inputStep,
		phaseCount
	};
}
function sampleBandlimitedWithCoefficients(input, center, phase) {
	const { coefficients } = phase;
	let weighted = 0;
	if (center >= RESAMPLE_HALF_TAPS && center + RESAMPLE_HALF_TAPS < input.length && phase.weightSum !== 0) {
		for (let tap = -15; tap <= RESAMPLE_HALF_TAPS; tap += 1) weighted += (input[center + tap] ?? 0) * (coefficients[tap + RESAMPLE_HALF_TAPS] ?? 0);
		return weighted / phase.weightSum;
	}
	let weightSum = 0;
	for (let tap = -15; tap <= RESAMPLE_HALF_TAPS; tap += 1) {
		const sampleIndex = center + tap;
		if (sampleIndex < 0 || sampleIndex >= input.length) continue;
		const coeff = coefficients[tap + RESAMPLE_HALF_TAPS] ?? 0;
		weighted += (input[sampleIndex] ?? 0) * coeff;
		weightSum += coeff;
	}
	if (weightSum === 0) return input[Math.max(0, Math.min(input.length - 1, center))] ?? 0;
	return weighted / weightSum;
}
function sampleBandlimited(input, srcPos, cutoffCyclesPerSample) {
	const center = Math.floor(srcPos);
	let weighted = 0;
	let weightSum = 0;
	for (let tap = -15; tap <= RESAMPLE_HALF_TAPS; tap += 1) {
		const sampleIndex = center + tap;
		if (sampleIndex < 0 || sampleIndex >= input.length) continue;
		const distance = sampleIndex - srcPos;
		const coeff = 2 * cutoffCyclesPerSample * sinc(2 * cutoffCyclesPerSample * distance) * (RESAMPLE_WINDOW[tap + RESAMPLE_HALF_TAPS] ?? 0);
		weighted += (input[sampleIndex] ?? 0) * coeff;
		weightSum += coeff;
	}
	if (weightSum === 0) return input[Math.max(0, Math.min(input.length - 1, Math.round(srcPos)))] ?? 0;
	return weighted / weightSum;
}
function createResamplePlan(inputSampleRate, outputSampleRate) {
	const ratio = inputSampleRate / outputSampleRate;
	const maxCutoff = .5;
	const downsampleCutoff = ratio > 1 ? maxCutoff / ratio : maxCutoff;
	const cutoffCyclesPerSample = Math.max(.01, downsampleCutoff * RESAMPLE_CUTOFF_GUARD);
	return {
		cutoffCyclesPerSample,
		inputSampleRate,
		kernel: buildResampleKernel(inputSampleRate, outputSampleRate, cutoffCyclesPerSample),
		outputSampleRate,
		ratio
	};
}
function sampleResampledPcm(input, inputStartSample, outputIndex, plan) {
	const sourcePosition = outputIndex * plan.inputSampleRate / plan.outputSampleRate;
	return Math.round(plan.kernel ? sampleBandlimitedWithCoefficients(input, Math.floor(sourcePosition) - inputStartSample, expectDefined(plan.kernel.coefficients[outputIndex * plan.kernel.inputStep % plan.kernel.phaseCount], "coefficients entry at (output index * kernel input step) % kernel phase count") ?? plan.kernel.coefficients[0]) : sampleBandlimited(input, outputIndex * plan.ratio - inputStartSample, plan.cutoffCyclesPerSample));
}
function renderResampledPcm(input, inputStartSample, firstOutputIndex, outputSamples, plan) {
	const output = Buffer.alloc(outputSamples * 2);
	const inputView = readInt16Samples(input);
	const outputView = canUseInt16View(output) ? int16View(output) : void 0;
	for (let offset = 0; offset < outputSamples; offset += 1) {
		const sample = clamp16(sampleResampledPcm(inputView, inputStartSample, firstOutputIndex + offset, plan));
		if (outputView) outputView[offset] = sample;
		else output.writeInt16LE(sample, offset * 2);
	}
	return output;
}
/** Resample little-endian signed 16-bit PCM to another integer sample rate. */
function resamplePcm(input, inputSampleRate, outputSampleRate) {
	if (inputSampleRate === outputSampleRate) return input;
	const inputSamples = Math.floor(input.length / 2);
	if (inputSamples === 0) return Buffer.alloc(0);
	const plan = createResamplePlan(inputSampleRate, outputSampleRate);
	return renderResampledPcm(input, 0, 0, Math.floor(inputSamples / plan.ratio), plan);
}
/** Create a chunk-safe PCM resampler that preserves filter and fractional phase state. */
function createStreamingPcmResampler(inputSampleRate, outputSampleRate) {
	if (inputSampleRate === outputSampleRate) return {
		process: (chunk) => Buffer.from(chunk),
		flush: () => Buffer.alloc(0)
	};
	const plan = createResamplePlan(inputSampleRate, outputSampleRate);
	let bufferedInput = Buffer.alloc(0);
	let inputStartSample = 0;
	let totalInputSamples = 0;
	let nextOutputIndex = 0;
	let trailingByte = Buffer.alloc(0);
	let flushed = false;
	const renderAvailable = (includeRightEdge) => {
		const targetOutputCount = Math.floor(totalInputSamples / plan.ratio);
		let endOutputIndex = nextOutputIndex;
		while (endOutputIndex < targetOutputCount) {
			const center = Math.floor(endOutputIndex * plan.inputSampleRate / plan.outputSampleRate);
			if (!includeRightEdge && center + RESAMPLE_HALF_TAPS >= totalInputSamples) break;
			endOutputIndex += 1;
		}
		const output = renderResampledPcm(bufferedInput, inputStartSample, nextOutputIndex, endOutputIndex - nextOutputIndex, plan);
		nextOutputIndex = endOutputIndex;
		const nextCenter = Math.floor(nextOutputIndex * plan.inputSampleRate / plan.outputSampleRate);
		const retainFromSample = Math.max(0, nextCenter - RESAMPLE_HALF_TAPS);
		const dropSamples = retainFromSample - inputStartSample;
		if (dropSamples > 0) {
			bufferedInput = Buffer.from(bufferedInput.subarray(dropSamples * 2));
			inputStartSample = retainFromSample;
		}
		return output;
	};
	return {
		process(chunk) {
			if (flushed) throw new Error("Cannot process PCM after the streaming resampler was flushed");
			const combined = trailingByte.length > 0 ? Buffer.concat([trailingByte, chunk]) : chunk;
			const completeBytes = combined.length - combined.length % 2;
			trailingByte = Buffer.from(combined.subarray(completeBytes));
			if (completeBytes > 0) {
				const completePcm = combined.subarray(0, completeBytes);
				bufferedInput = bufferedInput.length > 0 ? Buffer.concat([bufferedInput, completePcm]) : Buffer.from(completePcm);
				totalInputSamples += completeBytes / 2;
			}
			return renderAvailable(false);
		},
		flush() {
			if (flushed) return Buffer.alloc(0);
			flushed = true;
			trailingByte = Buffer.alloc(0);
			const output = renderAvailable(true);
			bufferedInput = Buffer.alloc(0);
			return output;
		}
	};
}
/** Resample little-endian signed 16-bit PCM to the telephony 8 kHz rate. */
function resamplePcmTo8k(input, inputSampleRate) {
	return resamplePcm(input, inputSampleRate, TELEPHONY_SAMPLE_RATE);
}
/** Convert little-endian signed 16-bit PCM samples to G.711 mu-law bytes. */
function pcmToMulaw(pcm) {
	const pcmView = readInt16Samples(pcm);
	const mulaw = Buffer.alloc(pcmView.length);
	for (let i = 0; i < pcmView.length; i += 1) mulaw[i] = linearToMulaw(pcmView[i] ?? 0);
	return mulaw;
}
/** Expand G.711 mu-law bytes into little-endian signed 16-bit PCM samples. */
function mulawToPcm(mulaw) {
	const pcm = Buffer.alloc(mulaw.length * 2);
	const pcmView = canUseInt16View(pcm) ? int16View(pcm) : void 0;
	if (pcmView) {
		for (let i = 0; i < mulaw.length; i += 1) pcmView[i] = clamp16(mulawToLinear(mulaw[i] ?? 0));
		return pcm;
	}
	for (let i = 0; i < mulaw.length; i += 1) pcm.writeInt16LE(clamp16(mulawToLinear(mulaw[i] ?? 0)), i * 2);
	return pcm;
}
/** Resample signed 16-bit PCM to 8 kHz and encode it as G.711 mu-law. */
function convertPcmToMulaw8k(pcm, inputSampleRate) {
	return pcmToMulaw(resamplePcmTo8k(pcm, inputSampleRate));
}
function linearToMulaw(sampleInput) {
	let sample = sampleInput;
	const BIAS = 132;
	const CLIP = 32635;
	const sign = sample < 0 ? 128 : 0;
	if (sample < 0) sample = -sample;
	if (sample > CLIP) sample = CLIP;
	sample += BIAS;
	let exponent = 7;
	for (let expMask = 16384; (sample & expMask) === 0 && exponent > 0; exponent -= 1) expMask >>= 1;
	const mantissa = sample >> exponent + 3 & 15;
	return ~(sign | exponent << 4 | mantissa) & 255;
}
function mulawToLinear(value) {
	const muLaw = ~value & 255;
	const sign = muLaw & 128;
	const exponent = muLaw >> 4 & 7;
	let sample = ((muLaw & 15) << 3) + 132 << exponent;
	sample -= 132;
	return sign ? -sample : sample;
}
//#endregion
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
export { convertPcmToMulaw8k as a, pcmToMulaw as c, readPcm16AudioStats as i, resamplePcm as l, createSpeechThresholdGate as n, createStreamingPcmResampler as o, isRealtimeVoiceAudioAudible as r, mulawToPcm as s, calculateMulawRms as t, resamplePcmTo8k as u };
