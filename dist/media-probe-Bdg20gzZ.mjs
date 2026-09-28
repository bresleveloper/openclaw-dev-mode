import { d as asPositiveSafeInteger, f as asSafeIntegerInRange } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as runFfprobe } from "./ffmpeg-exec-Dx-p1dpM.mjs";
import fs from "node:fs/promises";
//#region src/media/media-probe.ts
function parseDurationMs(value) {
	if (typeof value !== "number" && typeof value !== "string") return;
	const seconds = typeof value === "number" ? value : Number(value.trim());
	if (!Number.isFinite(seconds) || seconds <= 0) return;
	return asPositiveSafeInteger(Math.round(seconds * 1e3));
}
function normalizeCodecName(value) {
	if (typeof value !== "string") return;
	return value.trim().toLowerCase() || void 0;
}
function parseStreamIndex(value) {
	return asSafeIntegerInRange(value, { min: 0 });
}
function selectPlaybackStream(streams, codecType) {
	const candidates = streams.filter((stream) => {
		if (stream.codec_type !== codecType) return false;
		const disposition = asOptionalRecord(stream.disposition);
		return codecType !== "video" || disposition?.attached_pic !== 1;
	});
	return candidates.find((stream) => asOptionalRecord(stream.disposition)?.default === 1) ?? candidates[0];
}
function parseFfprobeMediaMetadata(stdout, kind) {
	let parsed;
	try {
		parsed = JSON.parse(stdout);
	} catch {
		return null;
	}
	const root = asOptionalRecord(parsed);
	if (!root) return null;
	const format = asOptionalRecord(root.format);
	const streams = (Array.isArray(root.streams) ? root.streams : []).map(asOptionalRecord).filter((stream) => Boolean(stream));
	const audioStream = selectPlaybackStream(streams, "audio");
	const videoStream = selectPlaybackStream(streams, "video");
	const selectedDurations = (kind === "video" ? [videoStream, audioStream] : [audioStream]).map((stream) => parseDurationMs(stream?.duration)).filter((duration) => duration !== void 0);
	const durationMs = (selectedDurations.length > 0 ? Math.max(...selectedDurations) : void 0) ?? parseDurationMs(format?.duration);
	const width = asPositiveSafeInteger(videoStream?.width);
	const height = asPositiveSafeInteger(videoStream?.height);
	const [sarWidth, sarHeight] = typeof videoStream?.sample_aspect_ratio === "string" ? videoStream.sample_aspect_ratio.split(":").map((value) => asPositiveSafeInteger(Number(value))) : [];
	const videoSampleAspectRatio = sarWidth && sarHeight ? sarWidth / sarHeight : void 0;
	const videoRotation = (Array.isArray(videoStream?.side_data_list) ? videoStream.side_data_list : []).map((sideData) => asSafeIntegerInRange(asOptionalRecord(sideData)?.rotation, {})).find((rotation) => rotation !== void 0);
	const audioCodec = normalizeCodecName(audioStream?.codec_name);
	const videoCodec = normalizeCodecName(videoStream?.codec_name);
	const videoPixelFormat = normalizeCodecName(videoStream?.pix_fmt);
	const videoProfile = normalizeCodecName(videoStream?.profile);
	const audioStreamIndex = parseStreamIndex(audioStream?.index);
	const videoStreamIndex = parseStreamIndex(videoStream?.index);
	return {
		...durationMs ? { durationMs } : {},
		...kind === "video" && width && height ? {
			width,
			height
		} : {},
		...videoRotation !== void 0 ? { videoRotation } : {},
		...videoSampleAspectRatio !== void 0 ? { videoSampleAspectRatio } : {},
		...audioCodec ? { audioCodec } : {},
		...audioStreamIndex !== void 0 ? { audioStreamIndex } : {},
		...videoCodec ? { videoCodec } : {},
		...videoPixelFormat ? { videoPixelFormat } : {},
		...videoProfile ? { videoProfile } : {},
		...videoStreamIndex !== void 0 ? { videoStreamIndex } : {}
	};
}
function buildFfprobeMetadataArgs(protocol) {
	const isFileDescriptor = protocol === "fd";
	return [
		"-v",
		"error",
		"-protocol_whitelist",
		protocol,
		"-show_entries",
		"format=duration:stream=index,codec_type,codec_name,profile,pix_fmt,duration,width,height,sample_aspect_ratio:stream_disposition=default,attached_pic:stream_side_data=rotation",
		"-of",
		"json",
		...isFileDescriptor ? ["-fd", "0"] : [],
		isFileDescriptor ? "fd:" : "pipe:0"
	];
}
function isMissingFdProtocolError(error) {
	const stderr = asOptionalRecord(error)?.stderr;
	const message = typeof stderr === "string" ? stderr : error instanceof Error ? error.message : "";
	return /(?:fd:.*protocol not found|protocol not found.*fd|unrecognized option ['"]?fd|option ['"]?fd\b.*not found)/is.test(message);
}
async function probeMediaSource(source, kind, options = {}) {
	const runProbe = async (protocol) => await runFfprobe(buildFfprobeMetadataArgs(protocol), source.kind === "buffer" ? {
		input: source.buffer,
		...options
	} : {
		stdinFileDescriptor: source.fd,
		...options
	});
	try {
		return parseFfprobeMediaMetadata(await runProbe(source.kind === "fileDescriptor" ? "fd" : "pipe"), kind);
	} catch (error) {
		if (source.kind === "fileDescriptor" && isMissingFdProtocolError(error)) try {
			return parseFfprobeMediaMetadata(await runProbe("pipe"), kind);
		} catch {
			return null;
		}
		return null;
	}
}
/** Keep encoded playback facts separate from attachment display dimensions. */
function toMediaProbeResult(result) {
	if (!result) return {};
	const swapsAxes = Math.abs(result.videoRotation ?? 0) % 180 === 90;
	const width = result.width && (asPositiveSafeInteger(Math.round(result.width * (result.videoSampleAspectRatio ?? 1))) ?? result.width);
	return {
		...result.durationMs ? { durationMs: result.durationMs } : {},
		...width && result.height ? {
			width: swapsAxes ? result.height : width,
			height: swapsAxes ? width : result.height
		} : {}
	};
}
/** Probes a local audio or video file; every failure degrades to absent fields. */
async function probeMediaFile(filePath, kind, options = {}) {
	try {
		const handle = await fs.open(filePath, "r");
		try {
			return toMediaProbeResult(await probeMediaSource({
				kind: "fileDescriptor",
				fd: handle.fd
			}, kind, options));
		} finally {
			await handle.close().catch(() => {});
		}
	} catch {
		return {};
	}
}
/** Probes a bounded batch under one elapsed-time budget, unaffected by wall-clock steps. */
async function probeMediaFilesWithinBudget(inputs, options) {
	const results = inputs.map(() => ({}));
	const deadlineMs = performance.now() + options.budgetMs;
	const probeCount = Math.min(inputs.length, options.maxProbes);
	for (let offset = 0; offset < probeCount; offset += options.concurrency) {
		const timeoutMs = deadlineMs - performance.now();
		if (timeoutMs <= 0) break;
		const batchEnd = Math.min(offset + options.concurrency, probeCount);
		const batch = inputs.slice(offset, batchEnd);
		const batchResults = await Promise.all(batch.map((input) => probeMediaFile(input.filePath, input.kind, { timeoutMs })));
		for (const [batchIndex, metadata] of batchResults.entries()) results[offset + batchIndex] = metadata;
	}
	return results;
}
/** Probes duration and first-stream codecs from an already validated local descriptor. */
async function probePlaybackMediaFileDescriptor(fd, kind, options = {}) {
	return await probeMediaSource({
		kind: "fileDescriptor",
		fd
	}, kind, options);
}
/** Probes a video buffer while preserving the existing public media-runtime API. */
async function probeVideoDimensions(buffer) {
	const { width, height } = toMediaProbeResult(await probeMediaSource({
		kind: "buffer",
		buffer
	}, "video"));
	return width && height ? {
		width,
		height
	} : void 0;
}
//#endregion
export { toMediaProbeResult as i, probePlaybackMediaFileDescriptor as n, probeVideoDimensions as r, probeMediaFilesWithinBudget as t };
