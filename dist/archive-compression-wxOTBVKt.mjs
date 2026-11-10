import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { t as SESSION_ARCHIVE_ZSTD_SUFFIX } from "./transcript-file-names-BZ8jA63H.mjs";
import { t as resolveZstdCodec } from "./zstd-codec-C-vEb3Qf.mjs";
import fs from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { walkDirectorySync } from "@openclaw/fs-safe/walk";
import { createZstdDecompress } from "node:zlib";
import { pipeline } from "node:stream/promises";
//#region src/config/sessions/archive-decode.ts
const zstdCodec$1 = resolveZstdCodec();
function decodeSessionArchiveBytes(bytes, compressed, expectedUtf8Bytes) {
	if (!compressed) return Buffer.from(bytes).toString("utf8");
	if (!zstdCodec$1) throw new Error("Cannot decode compressed transcript archive: this runtime lacks zstd support");
	return zstdCodec$1.decompress(Buffer.from(bytes), expectedUtf8Bytes ?? bytes.byteLength + 1048576).toString("utf8");
}
//#endregion
//#region src/config/sessions/archive-compression.ts
const zstdCodec = resolveZstdCodec();
function encodeSessionArchiveContent(content) {
	const plain = Buffer.from(content, "utf8");
	if (!zstdCodec || plain.length === 0) return {
		bytes: plain,
		suffix: ""
	};
	return {
		bytes: zstdCodec.compress(plain),
		suffix: SESSION_ARCHIVE_ZSTD_SUFFIX
	};
}
/** Full-content convenience read; known source bytes override its bounded default. */
function readSessionArchiveContentSync(filePath, expectedUtf8Bytes) {
	if (!filePath.endsWith(".zst")) return fs.readFileSync(filePath, "utf8");
	if (!zstdCodec) throw new Error(`Cannot read compressed transcript archive ${filePath}: this runtime lacks node:zlib zstd support`);
	try {
		return decodeSessionArchiveBytes(fs.readFileSync(filePath), true, expectedUtf8Bytes);
	} catch (error) {
		if (error instanceof Error && hasErrnoCode(error, "ERR_BUFFER_TOO_LARGE")) error.message = "Transcript archive " + filePath + " exceeds its decompression limit";
		throw error;
	}
}
/**
* Materializes a compressed archive as a plain JSONL cache file and returns
* the readable path; plain archives pass through untouched. Source identity
* validates cached bytes so downstream readers need not handle compression.
*/
async function materializeSessionArchiveForRead(filePath) {
	if (!filePath.endsWith(".zst")) return filePath;
	const cacheDir = path.join(resolvePreferredOpenClawTmpDir(), "session-archive-read-cache");
	const pathKey = createHash("sha256").update(filePath).digest("hex").slice(0, 32);
	let sourceStat;
	try {
		sourceStat = fs.statSync(filePath);
	} catch (error) {
		removeMaterializedArchiveCacheEntries(cacheDir, pathKey);
		throw error;
	}
	const cachePath = path.join(cacheDir, `${pathKey}-${sourceStat.size}-${Math.trunc(sourceStat.mtimeMs)}.jsonl`);
	sweepMaterializedArchiveCache(cacheDir);
	if (fs.existsSync(cachePath)) return cachePath;
	if (!zstdCodec) throw new Error("Cannot materialize compressed transcript archive: this runtime lacks zstd support");
	removeMaterializedArchiveCacheEntries(cacheDir, pathKey, path.basename(cachePath));
	fs.mkdirSync(cacheDir, {
		recursive: true,
		mode: 448
	});
	const tempPath = `${cachePath}.${process.pid}.${randomUUID()}.tmp`;
	try {
		await pipeline(fs.createReadStream(filePath, { highWaterMark: 65536 }), createZstdDecompress({ chunkSize: 65536 }), fs.createWriteStream(tempPath, {
			flags: "wx",
			mode: 384,
			highWaterMark: 65536
		}));
		const currentStat = fs.statSync(filePath);
		if (currentStat.size !== sourceStat.size || currentStat.mtimeMs !== sourceStat.mtimeMs) throw new Error("Transcript archive changed during materialization; retry the read");
		fs.renameSync(tempPath, cachePath);
	} finally {
		fs.rmSync(tempPath, { force: true });
	}
	return cachePath;
}
const MATERIALIZED_ARCHIVE_CACHE_TTL_MS = 864e5;
let lastMaterializedArchiveCacheSweepMs = 0;
function sweepMaterializedArchiveCache(cacheDir) {
	const now = Date.now();
	if (now - lastMaterializedArchiveCacheSweepMs < MATERIALIZED_ARCHIVE_CACHE_TTL_MS / 24) return;
	lastMaterializedArchiveCacheSweepMs = now;
	for (const entry of walkDirectorySync(cacheDir, {
		maxDepth: 1,
		symlinks: "include"
	}).entries) try {
		if (now - fs.statSync(entry.path).mtimeMs > MATERIALIZED_ARCHIVE_CACHE_TTL_MS) fs.rmSync(entry.path, { force: true });
	} catch {}
}
function removeMaterializedArchiveCacheEntries(cacheDir, pathKey, keepName) {
	for (const entry of walkDirectorySync(cacheDir, {
		maxDepth: 1,
		symlinks: "include"
	}).entries) {
		if (!entry.name.startsWith(`${pathKey}-`) || entry.name === keepName || entry.name.endsWith(".tmp")) continue;
		fs.rmSync(entry.path, { force: true });
	}
}
//#endregion
export { materializeSessionArchiveForRead as n, readSessionArchiveContentSync as r, encodeSessionArchiveContent as t };
