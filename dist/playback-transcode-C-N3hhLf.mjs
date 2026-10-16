import { u as openLocalFileSafely } from "./fs-safe-BUXBSN-4.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { a as maxBytesForKind } from "./constants-GzjKtFvA.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { t as copyFileHandle } from "./file-descriptor-B4yBUiAP.mjs";
import { d as normalizeMimeType, r as extensionForMime } from "./mime-CGDYrRzL.mjs";
import { r as runFfmpeg } from "./ffmpeg-exec-C4A6Kzb2.mjs";
import { i as toMediaProbeResult, n as probePlaybackMediaFileDescriptor } from "./media-probe-DFKlsDXP.mjs";
import { g as writePlaybackTranscodeCache, n as PLAYBACK_TRANSCODE_SUBDIR, s as getMediaDir } from "./store-A0dMc8iV.mjs";
import { t as createPermitPool } from "./permit-pool-D1LtDFRv.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { sameFileIdentity } from "@openclaw/fs-safe/advanced";
import { withTempWorkspace } from "@openclaw/fs-safe/temp";
import { fileStore } from "@openclaw/fs-safe/store";
//#region src/media/playback-codec-policy.ts
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
/** Returns whether a sniffed audio/video type needs the cross-client playback target. */
function resolvePlaybackMode(mimeType, policy) {
	const mime = normalizeMimeType(mimeType);
	if (!mime) return;
	if (policy.nativeMimeTypes.includes(mime)) return "native";
	return policy.transcodeInputFormats[mime] ? "transcode" : void 0;
}
function resolvePlaybackInputFormat(policy, mimeType) {
	const normalized = normalizeMimeType(mimeType);
	return normalized ? policy.transcodeInputFormats[normalized] ?? policy.codecProbeInputFormats[normalized] : void 0;
}
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
var PlaybackInspectionBusyError = class extends Error {
	constructor() {
		super("Media inspection is busy. Retry shortly.");
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
	inspections: 32
};
const MAX_PENDING_PLAYBACK_INSPECTIONS = 32;
const playbackJobs = /* @__PURE__ */ new Map();
const playbackFailures = /* @__PURE__ */ new Map();
const playbackInspections = /* @__PURE__ */ new Map();
const playbackInspectionJobs = /* @__PURE__ */ new Map();
const playbackInspectionPermits = createPermitPool(2);
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
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.playbackTranscodeTestApi")] = {
	createPlaybackTranscodeCacheKey,
	getPlaybackTranscodeJobs: () => [...playbackJobs.values()]
};
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
async function probePlaybackSource(source, kind, assertCurrent) {
	try {
		var _usingCtx$1 = _usingCtx();
		assertCurrent();
		const opened = _usingCtx$1.a(await openLocalFileSafely({ filePath: source.path }).catch(() => null));
		if (!opened || !playbackSourceIdentityMatches(source, opened)) return null;
		assertCurrent();
		return await probePlaybackMediaFileDescriptor(opened.handle.fd, kind);
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
function assertPlaybackInspectionAuthority(waiters) {
	let failure = createAbortError("Playback inspection abandoned");
	for (const waiter of waiters) {
		if (waiter.signal?.aborted) continue;
		try {
			waiter.assertCurrent?.();
			return;
		} catch (error) {
			failure = error;
		}
	}
	throw failure;
}
async function inspectPlaybackSource(params) {
	params.signal?.throwIfAborted();
	params.assertCurrent?.();
	const policy = PLAYBACK_TRANSCODE_POLICY[params.kind];
	const containerMode = resolvePlaybackMode(params.mimeType, policy);
	const source = {
		path: params.sourcePath,
		...params.sourceStat
	};
	const cacheKey = `${createPlaybackTranscodeCacheKey(source)}:${params.kind}:${normalizeMimeType(params.mimeType) ?? "unknown"}`;
	const cached = readPlaybackInspection(cacheKey);
	if (cached) return cached;
	const computeInspection = async (assertCurrent) => {
		const probe = await probePlaybackSource(source, params.kind, assertCurrent);
		const metadata = toMediaProbeResult(probe);
		const mimeType = normalizeMimeType(params.mimeType);
		const needsCodecProbe = Boolean(mimeType && policy.codecProbeInputFormats[mimeType]);
		if (containerMode === "native") {
			const nativeCodecs = !needsCodecProbe ? true : probe ? resolveNativePlaybackCodecCompatibility(params.kind, params.mimeType, probe) : void 0;
			if (nativeCodecs !== false) {
				const inspection = {
					...metadata,
					mode: "native"
				};
				if (probe && nativeCodecs === true) cachePlaybackInspection(cacheKey, inspection);
				return inspection;
			}
		}
		if (!containerMode || source.size > maxBytesForKind(params.kind)) {
			const inspection = {
				...metadata,
				mode: "fallback"
			};
			if (probe) cachePlaybackInspection(cacheKey, inspection);
			return inspection;
		}
		const maxDurationMs = PLAYBACK_TRANSCODE_MAX_DURATION_SECS * 1e3;
		const primaryStreamIndex = params.kind === "audio" ? probe?.audioStreamIndex : probe?.videoStreamIndex;
		if (!probe?.durationMs || primaryStreamIndex === void 0) return {
			...metadata,
			mode: "fallback"
		};
		const inspection = probe.durationMs <= maxDurationMs ? {
			...metadata,
			mode: "transcode",
			durationMs: probe.durationMs,
			...probe.audioStreamIndex !== void 0 ? { audioStreamIndex: probe.audioStreamIndex } : {},
			...probe.videoStreamIndex !== void 0 ? { videoStreamIndex: probe.videoStreamIndex } : {}
		} : {
			...metadata,
			mode: "fallback"
		};
		cachePlaybackInspection(cacheKey, inspection);
		return inspection;
	};
	let job = playbackInspectionJobs.get(cacheKey);
	if (job?.pending && params.admission === "immediate") throw new PlaybackInspectionBusyError();
	if (!job) {
		if (playbackInspectionPermits.pendingCount >= MAX_PENDING_PLAYBACK_INSPECTIONS) throw new PlaybackInspectionBusyError();
		const immediatePermit = params.admission === "immediate" ? playbackInspectionPermits.tryAcquire() : void 0;
		if (immediatePermit === null) throw new PlaybackInspectionBusyError();
		const waiters = /* @__PURE__ */ new Set();
		const controller = new AbortController();
		let pending = true;
		const created = {
			waiters,
			controller,
			get pending() {
				return pending;
			},
			result: (async () => {
				const release = await (immediatePermit ?? playbackInspectionPermits.acquire({ signal: controller.signal }));
				if (!release) throw createAbortError("Playback inspection abandoned");
				pending = false;
				try {
					return await computeInspection(() => assertPlaybackInspectionAuthority(waiters));
				} finally {
					release();
				}
			})().finally(() => {
				if (playbackInspectionJobs.get(cacheKey) === created) playbackInspectionJobs.delete(cacheKey);
			})
		};
		job = created;
		playbackInspectionJobs.set(cacheKey, job);
	}
	const waiter = {
		signal: params.signal,
		assertCurrent: params.assertCurrent
	};
	job.waiters.add(waiter);
	try {
		const inspection = await racePromiseWithAbortSignal(job.result, params.signal);
		params.assertCurrent?.();
		return inspection;
	} finally {
		job.waiters.delete(waiter);
		if (job.pending && job.waiters.size === 0) {
			job.controller.abort();
			if (playbackInspectionJobs.get(cacheKey) === job) playbackInspectionJobs.delete(cacheKey);
		}
	}
}
/** Shares display metadata and playback classification by file identity. */
async function resolvePlaybackMetadataForSource(params) {
	const { mode, durationMs, width, height } = await inspectPlaybackSource(params);
	return {
		playback: mode === "fallback" ? void 0 : mode,
		durationMs,
		width,
		height
	};
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
	try {
		var _usingCtx3 = _usingCtx();
		const store = fileStore({
			rootDir: getMediaDir(),
			dirMode: 448,
			mode: 384,
			maxBytes: params.maxBytes
		});
		return _usingCtx3.a(await store.open(playbackCacheRelativePath(params.cacheKey, params.extension)).catch(() => null))?.realPath ?? null;
	} catch (_) {
		_usingCtx3.e = _;
	} finally {
		await _usingCtx3.d();
	}
}
function makePlaybackInputFileName(sourcePath, mimeType) {
	const sourceExtension = path.extname(sourcePath).toLowerCase();
	return `input${/^\.[a-z0-9]{1,12}$/u.test(sourceExtension) ? sourceExtension : extensionForMime(mimeType) ?? ".media"}`;
}
function playbackDurationsMatch(sourceDurationMs, outputDurationMs) {
	const toleranceMs = Math.min(2e3, Math.max(1e3, Math.ceil(sourceDurationMs * .02)));
	return outputDurationMs <= PLAYBACK_TRANSCODE_MAX_DURATION_SECS * 1e3 && Math.abs(outputDurationMs - sourceDurationMs) <= toleranceMs;
}
function buildPlaybackFfmpegArgs(params) {
	const audioOnly = params.kind === "audio";
	const { audioStreamIndex, videoStreamIndex } = params.inspection;
	const primaryStreamIndex = audioOnly ? audioStreamIndex : videoStreamIndex;
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
		...!audioOnly && audioStreamIndex !== void 0 ? ["-map", `0:${audioStreamIndex}`] : [],
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
	try {
		var _usingCtx4 = _usingCtx();
		const policy = PLAYBACK_TRANSCODE_POLICY[params.kind];
		const opened = _usingCtx4.a(await openLocalFileSafely({ filePath: params.source.path }));
		if (!playbackSourceIdentityMatches(params.source, opened)) throw new Error("Playback source changed before transcode");
		const outputBuffer = await withTempWorkspace({
			rootDir: resolvePreferredOpenClawTmpDir(),
			prefix: "playback-transcode-"
		}, async (workspace) => {
			const inputName = makePlaybackInputFileName(params.source.path, params.mimeType);
			const stagingName = `.${inputName}.stage`;
			await workspace.write(stagingName, "");
			const inputRoot = await workspace.store.root();
			let inputPath;
			try {
				var _usingCtx5 = _usingCtx();
				const staged = _usingCtx5.a(await inputRoot.openWritable(stagingName, {
					writeMode: "update",
					mode: 384,
					mkdir: false
				}));
				const inputIdentity = await staged.handle.stat({ bigint: true });
				if (await copyFileHandle(opened.handle, staged.handle, { maxBytes: Math.min(params.source.size, params.maxBytes) }) !== params.source.size || !playbackSourceIdentityMatches(params.source, {
					realPath: opened.realPath,
					stat: await opened.handle.stat()
				})) throw new Error("Playback source changed during transcode read");
				await staged.handle.sync().catch((error) => {
					if (!hasErrnoCode(error, "EPERM")) throw error;
				});
				await inputRoot.move(stagingName, inputName);
				const input = _usingCtx5.a(await inputRoot.open(inputName));
				const stat = await input.handle.stat({ bigint: true });
				if (!sameFileIdentity(inputIdentity, stat) || stat.size !== BigInt(params.source.size) || process.platform !== "win32" && (stat.mode & 4095n) !== 384n) throw new Error("Playback staged input changed before transcode");
				inputPath = input.realPath;
			} catch (_) {
				_usingCtx5.e = _;
			} finally {
				await _usingCtx5.d();
			}
			const outputPath = workspace.path(`output${policy.target.extension}`);
			const inputFormat = resolvePlaybackInputFormat(policy, params.mimeType);
			if (!inputFormat) throw new Error("Playback transcode input format is not allowed");
			await runFfmpeg(buildPlaybackFfmpegArgs({
				inspection: params.inspection,
				inputPath,
				inputFormat,
				kind: params.kind,
				maxOutputBytes: params.maxBytes,
				outputPath
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
			if (!outputProbe?.durationMs || !playbackDurationsMatch(params.inspection.durationMs, outputProbe.durationMs)) throw new Error("Playback transcode output duration does not match its source");
			return await fs.readFile(outputPath);
		});
		await writePlaybackTranscodeCache({
			buffer: outputBuffer,
			fileName: path.basename(playbackCacheRelativePath(params.cacheKey, policy.target.extension)),
			maxBytes: params.maxBytes,
			tempPrefix: `.${params.cacheKey}`
		});
	} catch (_) {
		_usingCtx4.e = _;
	} finally {
		await _usingCtx4.d();
	}
}
/** Resolves a native, pending, cached, or failed playback rendition without blocking on ffmpeg. */
async function resolvePlaybackTranscode(params) {
	params.signal?.throwIfAborted();
	params.assertCurrent?.();
	const policy = PLAYBACK_TRANSCODE_POLICY[params.kind];
	const containerMode = resolvePlaybackMode(params.mimeType, policy);
	if (!containerMode) return { kind: "fallback" };
	if (containerMode === "native" && !policy.codecProbeInputFormats[normalizeMimeType(params.mimeType) ?? ""]) return { kind: "passthrough" };
	const maxBytes = maxBytesForKind(params.kind);
	const source = {
		path: params.sourcePath,
		...params.sourceStat
	};
	const cacheKey = createPlaybackTranscodeCacheKey(source);
	const target = policy.target;
	const operationKey = playbackCacheRelativePath(cacheKey, target.extension);
	const cachedPath = await resolveCachedPlaybackPath({
		cacheKey,
		extension: target.extension,
		maxBytes
	});
	params.signal?.throwIfAborted();
	params.assertCurrent?.();
	if (cachedPath) return {
		kind: "transcoded",
		path: cachedPath,
		contentType: target.contentType,
		extension: target.extension
	};
	let inspection;
	try {
		inspection = await inspectPlaybackSource(params);
	} catch (error) {
		if (error instanceof PlaybackInspectionBusyError) return { kind: "preparing" };
		throw error;
	}
	params.signal?.throwIfAborted();
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
		inspection,
		source,
		mimeType: params.mimeType,
		kind: params.kind,
		cacheKey,
		maxBytes
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
export { resolvePlaybackTranscode as i, replacePlaybackFileExtension as n, resolvePlaybackMetadataForSource as r, PlaybackInspectionBusyError as t };
