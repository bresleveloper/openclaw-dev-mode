import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as runExec } from "./exec-shcN2-sN.mjs";
import { t as resolveSystemBin } from "./resolve-system-bin-wk53Z0G9.mjs";
/** Default ffprobe timeout for lightweight metadata probes. */
const MEDIA_FFPROBE_TIMEOUT_MS = 1e4;
/** Default ffmpeg timeout for bounded media conversion work. */
const MEDIA_FFMPEG_TIMEOUT_MS = 45e3;
/** Maximum audio duration accepted by ffmpeg-backed media flows. */
const MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS = 1200;
//#endregion
//#region src/media/ffmpeg-exec.ts
function resolveExecOptions(defaultTimeoutMs, options) {
	if (options?.input !== void 0 && options.stdinFileDescriptor !== void 0) throw new Error("media exec accepts either input or stdinFileDescriptor, not both");
	return {
		input: options?.input,
		...options?.stdinFileDescriptor !== void 0 ? { stdinFileDescriptor: options.stdinFileDescriptor } : {},
		logOutput: false,
		maxBuffer: options?.maxBufferBytes ?? 10485760,
		timeoutMs: options?.timeoutMs ?? defaultTimeoutMs
	};
}
function requireSystemBin(name) {
	const resolved = resolveSystemBin(name, { trust: "standard" });
	if (!resolved) {
		const hint = process.platform === "darwin" ? "e.g. brew install ffmpeg" : "e.g. apt install ffmpeg / dnf install ffmpeg";
		throw new Error(`${name} not found in trusted system directories. Install it via your system package manager (${hint}).`);
	}
	return resolved;
}
/** Resolves ffmpeg from trusted system paths before command execution. */
function resolveFfmpegBin() {
	return requireSystemBin("ffmpeg");
}
/** Runs ffprobe with optional stdin input. */
async function runFfprobe(args, options) {
	const { stdout } = await runExec(requireSystemBin("ffprobe"), args, resolveExecOptions(MEDIA_FFPROBE_TIMEOUT_MS, options));
	return stdout;
}
/** Runs ffmpeg with bounded timeout and buffer settings. */
async function runFfmpeg(args, options) {
	const { stdout } = await runExec(resolveFfmpegBin(), args, resolveExecOptions(MEDIA_FFMPEG_TIMEOUT_MS, options));
	return stdout;
}
/** Splits ffprobe CSV-ish output into normalized lowercase fields. */
function parseFfprobeCsvFields(stdout, maxFields) {
	return stdout.trim().split(/[,\r\n]+/, maxFields).map((field) => normalizeLowercaseStringOrEmpty(field));
}
function parseFfprobeSampleRateHz(value) {
	if (!value || !/^\d+$/.test(value)) return null;
	const sampleRate = Number(value);
	return Number.isSafeInteger(sampleRate) && sampleRate > 0 ? sampleRate : null;
}
/** Parses codec and positive sample rate from compact ffprobe stream output. */
function parseFfprobeCodecAndSampleRate(stdout) {
	const [codecRaw, sampleRateRaw] = parseFfprobeCsvFields(stdout, 2);
	return {
		codec: codecRaw ? codecRaw : null,
		sampleRateHz: parseFfprobeSampleRateHz(sampleRateRaw)
	};
}
//#endregion
export { MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS as a, runFfprobe as i, resolveFfmpegBin as n, runFfmpeg as r, parseFfprobeCodecAndSampleRate as t };
