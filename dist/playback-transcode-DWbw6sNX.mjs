import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { u as openLocalFileSafely } from "./fs-safe-BAPek8At.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as copyFileHandle } from "./file-descriptor-C_0BsNDD.mjs";
import { r as withTempWorkspace } from "./private-temp-workspace-DQFTMfun.mjs";
import { a as maxBytesForKind } from "./constants-DUxuqQz8.mjs";
import { d as normalizeMimeType, r as extensionForMime } from "./mime-1zBUMwu6.mjs";
import { r as runFfmpeg } from "./ffmpeg-exec-Dx-p1dpM.mjs";
import { n as probePlaybackMediaFileDescriptor } from "./media-probe-Bdg20gzZ.mjs";
import { t as fileStore } from "./file-store-adUqqkP0.mjs";
import { h as writePlaybackTranscodeCache, n as PLAYBACK_TRANSCODE_SUBDIR, s as getMediaDir } from "./store-BrX2xbJz.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/media/playback-codec-policy.ts
/** Combines selected audio/video codec facts without letting unknown facts hide incompatibility. */
function resolveNativePlaybackCodecCompatibility(kind, mimeType, probe) {
	if (kind === "audio") {
		const codec = probe.audioCodec;
		if (probe.audioStreamIndex === void 0 || !codec) return;
		if (/^audio\/(?:x-wav|wav|wave)$/.test(normalizeMimeType(mimeType) ?? "")) return codec === "pcm_s16le" || codec === "pcm_u8";
		return codec === "mp3" || normalizeMimeType(mimeType) !== "audio/mpeg" && codec === "aac";
	}
	const audioCompatible = probe.audioStreamIndex === void 0 ? probe.audioCodec ? void 0 : true : probe.audioCodec ? probe.audioCodec === "aac" || probe.audioCodec === "mp3" : void 0;
	let videoCompatible;
	if (probe.videoCodec && probe.videoStreamIndex !== void 0) {
		const portableProfile = probe.videoProfile === "baseline" || probe.videoProfile === "constrained baseline" || probe.videoProfile === "main" || probe.videoProfile === "high";
		const portablePixelFormat = probe.videoPixelFormat === "yuv420p" || probe.videoPixelFormat === "yuvj420p";
		videoCompatible = probe.videoCodec === "h264" && probe.videoProfile && probe.videoPixelFormat ? portableProfile && portablePixelFormat : probe.videoCodec === "h264" ? void 0 : false;
	}
	return audioCompatible === false || videoCompatible === false ? false : audioCompatible === true && videoCompatible === true ? true : void 0;
}
//#endregion
//#region src/media/playback-transcode.ts
/**
* Native means safe across the supported browser, AVPlayer, and ExoPlayer clients.
* Client-specific formats stay in the transcode path because metadata cannot know its consumer.
*/
const PLAYBACK_TRANSCODE_POLICY = {
	audio: {
		nativeMimeTypes: [
			"audio/m4a",
			"audio/mp3",
			"audio/mp4",
			"audio/mpeg",
			"audio/wav",
			"audio/wave",
			"audio/x-m4a",
			"audio/x-wav"
		],
		codecProbeInputFormats: {
			"audio/m4a": "mov",
			"audio/mpeg": "mp3",
			"audio/mp4": "mov",
			"audio/wav": "wav",
			"audio/wave": "wav",
			"audio/x-m4a": "mov",
			"audio/x-wav": "wav"
		},
		transcodeInputFormats: {
			"audio/aac": "aac",
			"audio/aiff": "aiff",
			"audio/amr": "amr",
			"audio/amr-wb": "amr",
			"audio/flac": "flac",
			"audio/ogg": "ogg",
			"audio/opus": "ogg",
			"audio/vorbis": "ogg",
			"audio/webm": "matroska,webm",
			"audio/x-aiff": "aiff",
			"audio/x-caf": "caf",
			"audio/x-ms-asf": "asf",
			"audio/x-ms-wma": "asf"
		},
		target: {
			contentType: "audio/mp4",
			extension: ".m4a"
		}
	},
	video: {
		nativeMimeTypes: ["video/mp4"],
		codecProbeInputFormats: { "video/mp4": "mov" },
		transcodeInputFormats: {
			"video/avi": "avi",
			"video/flv": "flv",
			"video/matroska": "matroska,webm",
			"video/quicktime": "mov",
			"video/webm": "matroska,webm",
			"video/x-flv": "flv",
			"video/x-matroska": "matroska,webm",
			"video/x-ms-asf": "asf",
			"video/x-ms-wmv": "asf",
			"video/x-msvideo": "avi"
		},
		target: {
			contentType: "video/mp4",
			extension: ".mp4"
		}
	}
};
const PLAYBACK_TRANSCODE_CACHE_VERSION = "v2";
const MAX_PLAYBACK_TRANSCODE_JOBS = 2;
const PLAYBACK_TRANSCODE_MAX_ALLOC_BYTES = 268435456;
const PLAYBACK_TRANSCODE_MAX_DURATION_SECS = 1200;
const PLAYBACK_TRANSCODE_MAX_INPUT_PIXELS = 16777216;
const PLAYBACK_TRANSCODE_THREADS = 2;
const PLAYBACK_TRANSCODE_FAILURE_COOLDOWN_MS = 6e4;
const MAX_PLAYBACK_ENTRIES = {
	failures: 32,
	inspections: 32,
	inspectionJobs: 2
};
const playbackJobs = /* @__PURE__ */ new Map();
const playbackFailures = /* @__PURE__ */ new Map();
const playbackInspections = /* @__PURE__ */ new Map();
const playbackInspectionJobs = /* @__PURE__ */ new Map();
const log = createSubsystemLogger("media/playback");
/** Hashes the immutable source identity used by playback cache file names. */
function createPlaybackTranscodeCacheKey(source) {
	return createHash("sha256").update(JSON.stringify([
		source.path,
		source.size,
		source.mtimeMs,
		source.ctimeMs,
		source.dev,
		source.ino
	])).digest("hex");
}
/** Returns whether a sniffed audio/video type needs the cross-client playback target. */
function resolvePlaybackMode(mimeType, policy) {
	const mime = normalizeMimeType(mimeType);
	if (!mime) return;
	if (policy.nativeMimeTypes.includes(mime)) return "native";
	return policy.transcodeInputFormats[mime] ? "transcode" : void 0;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.playbackTranscodeTestApi")] = {
	createPlaybackTranscodeCacheKey,
	getPlaybackTranscodeJobs: () => [...playbackJobs.values()]
};
function playbackSourceIdentity(params) {
	return {
		path: params.sourcePath,
		...params.sourceStat
	};
}
function playbackSourceIdentityMatches(source, opened) {
	return opened.realPath === source.path && opened.stat.size === source.size && opened.stat.mtimeMs === source.mtimeMs && opened.stat.ctimeMs === source.ctimeMs && opened.stat.dev === source.dev && opened.stat.ino === source.ino;
}
function readPlaybackInspection(cacheKey) {
	const inspection = playbackInspections.get(cacheKey);
	if (inspection) cachePlaybackInspection(cacheKey, inspection);
	return inspection;
}
function cachePlaybackInspection(cacheKey, inspection) {
	playbackInspections.delete(cacheKey);
	playbackInspections.set(cacheKey, inspection);
	pruneMapToMaxSize(playbackInspections, MAX_PLAYBACK_ENTRIES.inspections);
}
function playbackInspectionCacheKey(params) {
	return `${params.sourceCacheKey}:${params.kind}:${normalizeMimeType(params.mimeType) ?? "unknown"}`;
}
async function probePlaybackSource(source, kind) {
	const opened = await openLocalFileSafely({ filePath: source.path }).catch(() => null);
	if (!opened) return null;
	try {
		if (!playbackSourceIdentityMatches(source, opened)) return null;
		return await probePlaybackMediaFileDescriptor(opened.handle.fd, kind);
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
async function inspectPlaybackSource(params) {
	const policy = PLAYBACK_TRANSCODE_POLICY[params.kind];
	const containerMode = resolvePlaybackMode(params.mimeType, policy);
	if (!containerMode) return { mode: "fallback" };
	const source = playbackSourceIdentity(params);
	const cacheKey = playbackInspectionCacheKey({
		sourceCacheKey: createPlaybackTranscodeCacheKey(source),
		kind: params.kind,
		mimeType: params.mimeType
	});
	const cached = readPlaybackInspection(cacheKey);
	if (cached) return cached;
	const computeInspection = async () => {
		const mimeType = normalizeMimeType(params.mimeType);
		const needsCodecProbe = Boolean(mimeType && policy.codecProbeInputFormats[mimeType]);
		if (containerMode === "native" && !needsCodecProbe) {
			const inspection = { mode: "native" };
			cachePlaybackInspection(cacheKey, inspection);
			return inspection;
		}
		const probe = params.probe !== void 0 ? params.probe : await probePlaybackSource(source, params.kind);
		if (containerMode === "native") {
			const nativeCodecs = probe ? resolveNativePlaybackCodecCompatibility(params.kind, params.mimeType, probe) : void 0;
			if (nativeCodecs === true) {
				const inspection = { mode: "native" };
				cachePlaybackInspection(cacheKey, inspection);
				return inspection;
			}
			if (nativeCodecs === void 0) return { mode: "native" };
		}
		if (source.size > maxBytesForKind(params.kind)) return { mode: "fallback" };
		const maxDurationMs = PLAYBACK_TRANSCODE_MAX_DURATION_SECS * 1e3;
		const primaryStreamIndex = params.kind === "audio" ? probe?.audioStreamIndex : probe?.videoStreamIndex;
		if (!probe?.durationMs || primaryStreamIndex === void 0) return { mode: "fallback" };
		const inspection = probe.durationMs <= maxDurationMs ? {
			mode: "transcode",
			durationMs: probe.durationMs,
			...probe.audioStreamIndex !== void 0 ? { audioStreamIndex: probe.audioStreamIndex } : {},
			...probe.videoStreamIndex !== void 0 ? { videoStreamIndex: probe.videoStreamIndex } : {}
		} : { mode: "fallback" };
		cachePlaybackInspection(cacheKey, inspection);
		return inspection;
	};
	if (params.probe !== void 0) return await computeInspection();
	const existingJob = playbackInspectionJobs.get(cacheKey);
	if (existingJob) return await existingJob;
	if (playbackInspectionJobs.size >= MAX_PLAYBACK_ENTRIES.inspectionJobs) return { mode: "fallback" };
	return await getOrCreatePromise(playbackInspectionJobs, cacheKey, computeInspection, { evictOnSettled: true });
}
/** Resolves source-aware playback metadata and caches codec classification by file identity. */
async function resolvePlaybackModeForSource(params) {
	const inspection = await inspectPlaybackSource(params);
	return inspection.mode === "transcode" ? "transcode" : inspection.mode === "native" ? "native" : void 0;
}
/** Replaces the original container suffix for a transcoded response filename. */
function replacePlaybackFileExtension(fileName, extension) {
	const currentExtension = path.extname(fileName);
	return `${(currentExtension ? fileName.slice(0, -currentExtension.length) : fileName) || "media"}${extension}`;
}
function playbackCacheRelativePath(cacheKey, extension) {
	return `${PLAYBACK_TRANSCODE_SUBDIR}/${PLAYBACK_TRANSCODE_CACHE_VERSION}-${cacheKey}${extension}`;
}
async function resolveCachedPlaybackPath(params) {
	const opened = await fileStore({
		rootDir: getMediaDir(),
		dirMode: 448,
		mode: 384,
		maxBytes: params.maxBytes
	}).open(playbackCacheRelativePath(params.cacheKey, params.extension)).catch(() => null);
	if (!opened?.stat.isFile()) {
		await opened?.handle.close().catch(() => {});
		return null;
	}
	try {
		return opened.realPath;
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
function makePlaybackInputFileName(sourcePath, mimeType) {
	const sourceExtension = path.extname(sourcePath).toLowerCase();
	return `input${/^\.[a-z0-9]{1,12}$/u.test(sourceExtension) ? sourceExtension : extensionForMime(mimeType) ?? ".media"}`;
}
function resolvePlaybackInputFormat(policy, mimeType) {
	const normalized = normalizeMimeType(mimeType);
	return normalized ? policy.transcodeInputFormats[normalized] ?? policy.codecProbeInputFormats[normalized] : void 0;
}
function playbackDurationsMatch(sourceDurationMs, outputDurationMs) {
	const toleranceMs = Math.min(2e3, Math.max(1e3, Math.ceil(sourceDurationMs * .02)));
	return outputDurationMs <= PLAYBACK_TRANSCODE_MAX_DURATION_SECS * 1e3 && Math.abs(outputDurationMs - sourceDurationMs) <= toleranceMs;
}
function buildPlaybackFfmpegArgs(params) {
	const audioOnly = params.kind === "audio";
	const primaryStreamIndex = audioOnly ? params.audioStreamIndex : params.videoStreamIndex;
	if (primaryStreamIndex === void 0) throw new Error(`Playback ${audioOnly ? "audio" : "video"} stream is missing`);
	return [
		"-hide_banner",
		"-loglevel",
		"error",
		"-max_alloc",
		String(PLAYBACK_TRANSCODE_MAX_ALLOC_BYTES),
		"-filter_threads",
		String(PLAYBACK_TRANSCODE_THREADS),
		"-y",
		"-protocol_whitelist",
		"file",
		"-f",
		params.inputFormat,
		"-max_pixels",
		String(PLAYBACK_TRANSCODE_MAX_INPUT_PIXELS),
		"-threads",
		String(PLAYBACK_TRANSCODE_THREADS),
		"-i",
		params.inputPath,
		"-map_metadata",
		"-1",
		"-map_chapters",
		"-1",
		"-map",
		`0:${primaryStreamIndex}`,
		...!audioOnly && params.audioStreamIndex !== void 0 ? ["-map", `0:${params.audioStreamIndex}`] : [],
		...audioOnly ? ["-vn"] : [],
		"-sn",
		"-dn",
		"-t",
		String(PLAYBACK_TRANSCODE_MAX_DURATION_SECS),
		...audioOnly ? [] : [
			"-vf",
			"scale=w='min(1920,iw)':h='min(1080,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
			"-c:v",
			"libx264",
			"-threads",
			String(PLAYBACK_TRANSCODE_THREADS),
			"-pix_fmt",
			"yuv420p"
		],
		"-c:a",
		"aac",
		"-b:a",
		"128k",
		"-movflags",
		"+faststart",
		"-f",
		audioOnly ? "ipod" : "mp4",
		"-fs",
		String(params.maxOutputBytes + 1),
		params.outputPath
	];
}
async function transcodePlaybackSource(params) {
	const policy = PLAYBACK_TRANSCODE_POLICY[params.kind];
	const opened = await openLocalFileSafely({ filePath: params.source.path });
	try {
		if (!playbackSourceIdentityMatches(params.source, opened)) throw new Error("Playback source changed before transcode");
		const outputBuffer = await withTempWorkspace({
			rootDir: resolvePreferredOpenClawTmpDir(),
			prefix: "playback-transcode-"
		}, async (workspace) => {
			const inputName = makePlaybackInputFileName(params.source.path, params.mimeType);
			const stagingName = `.${inputName}.stage`;
			await workspace.write(stagingName, "");
			const inputRoot = await workspace.store.root();
			const staged = await inputRoot.openWritable(stagingName, {
				writeMode: "update",
				mode: 384,
				mkdir: false
			});
			let inputPath;
			try {
				const inputIdentity = await staged.handle.stat({ bigint: true });
				if (await copyFileHandle(opened.handle, staged.handle, { maxBytes: Math.min(params.source.size, params.maxBytes) }) !== params.source.size || !playbackSourceIdentityMatches(params.source, {
					realPath: opened.realPath,
					stat: await opened.handle.stat()
				})) throw new Error("Playback source changed during transcode read");
				await staged.handle.sync().catch((error) => {
					if (!hasErrnoCode(error, "EPERM")) throw error;
				});
				await inputRoot.move(stagingName, inputName);
				const input = await inputRoot.open(inputName);
				try {
					const stat = await input.handle.stat({ bigint: true });
					if (!sameFileIdentity(inputIdentity, stat) || stat.size !== BigInt(params.source.size) || process.platform !== "win32" && (stat.mode & 4095n) !== 384n) throw new Error("Playback staged input changed before transcode");
					inputPath = input.realPath;
				} finally {
					await input.handle.close().catch(() => {});
				}
			} finally {
				await staged.handle.close().catch(() => {});
			}
			const outputPath = workspace.path(`output${policy.target.extension}`);
			const inputFormat = resolvePlaybackInputFormat(policy, params.mimeType);
			if (!inputFormat) throw new Error("Playback transcode input format is not allowed");
			await runFfmpeg(buildPlaybackFfmpegArgs({
				...params.audioStreamIndex !== void 0 ? { audioStreamIndex: params.audioStreamIndex } : {},
				inputPath,
				inputFormat,
				kind: params.kind,
				maxOutputBytes: params.maxBytes,
				outputPath,
				...params.videoStreamIndex !== void 0 ? { videoStreamIndex: params.videoStreamIndex } : {}
			}));
			const outputStat = await fs.stat(outputPath);
			if (!outputStat.isFile() || outputStat.size === 0 || outputStat.size > params.maxBytes) throw new Error("Playback transcode output exceeds its media limit");
			const outputHandle = await fs.open(outputPath, "r");
			let outputProbe;
			try {
				outputProbe = await probePlaybackMediaFileDescriptor(outputHandle.fd, params.kind);
			} finally {
				await outputHandle.close().catch(() => {});
			}
			if (!outputProbe?.durationMs || !playbackDurationsMatch(params.sourceDurationMs, outputProbe.durationMs)) throw new Error("Playback transcode output duration does not match its source");
			return await fs.readFile(outputPath);
		});
		await writePlaybackTranscodeCache({
			buffer: outputBuffer,
			fileName: path.basename(playbackCacheRelativePath(params.cacheKey, policy.target.extension)),
			maxBytes: params.maxBytes,
			tempPrefix: `.${params.cacheKey}`
		});
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
/** Resolves a native, pending, cached, or failed playback rendition without blocking on ffmpeg. */
async function resolvePlaybackTranscode(params) {
	const policy = PLAYBACK_TRANSCODE_POLICY[params.kind];
	if (!resolvePlaybackMode(params.mimeType, policy)) return { kind: "fallback" };
	const maxBytes = maxBytesForKind(params.kind);
	const source = playbackSourceIdentity(params);
	const cacheKey = createPlaybackTranscodeCacheKey(source);
	const target = policy.target;
	const operationKey = playbackCacheRelativePath(cacheKey, target.extension);
	const cachedPath = await resolveCachedPlaybackPath({
		cacheKey,
		extension: target.extension,
		maxBytes
	});
	if (cachedPath) return {
		kind: "transcoded",
		path: cachedPath,
		contentType: target.contentType,
		extension: target.extension
	};
	const inspection = await inspectPlaybackSource(params);
	if (inspection.mode === "native") return { kind: "passthrough" };
	if (inspection.mode === "fallback") return { kind: "fallback" };
	if (playbackJobs.has(operationKey)) return { kind: "preparing" };
	const failedAtMs = playbackFailures.get(operationKey);
	if (failedAtMs !== void 0) {
		const nowMs = Date.now();
		if (failedAtMs <= nowMs && nowMs - failedAtMs < PLAYBACK_TRANSCODE_FAILURE_COOLDOWN_MS) return { kind: "fallback" };
	}
	if (playbackJobs.size >= MAX_PLAYBACK_TRANSCODE_JOBS) return { kind: "preparing" };
	const job = transcodePlaybackSource({
		...inspection.audioStreamIndex !== void 0 ? { audioStreamIndex: inspection.audioStreamIndex } : {},
		source,
		mimeType: params.mimeType,
		kind: params.kind,
		cacheKey,
		maxBytes,
		sourceDurationMs: inspection.durationMs,
		...inspection.videoStreamIndex !== void 0 ? { videoStreamIndex: inspection.videoStreamIndex } : {}
	});
	playbackJobs.set(operationKey, job);
	job.then(() => {
		playbackJobs.delete(operationKey);
		playbackFailures.delete(operationKey);
	}, (reason) => {
		playbackJobs.delete(operationKey);
		if (!playbackFailures.has(operationKey)) log.warn(`Playback transcode failed for ${params.sourcePath}: ${formatErrorMessage(reason)}`);
		playbackFailures.delete(operationKey);
		playbackFailures.set(operationKey, Date.now());
		pruneMapToMaxSize(playbackFailures, MAX_PLAYBACK_ENTRIES.failures);
	});
	return { kind: "preparing" };
}
//#endregion
export { resolvePlaybackModeForSource as n, resolvePlaybackTranscode as r, replacePlaybackFileExtension as t };
