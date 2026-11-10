import { wt as isRecord } from "./sqlite-readonly-subsystem-DxzYbxOQ.mjs";
import { Wt as sameFileIdentity } from "./sqlite-readonly-runtime-process-manifest-B1faCUt1.mjs";
import { t as sha256FileSync } from "./sqlite-readonly-file-hash-DvbqfXs2.mjs";
import "node:path";
import fs from "node:fs";
import "node:fs/promises";
//#region src/infra/file-descriptor.ts
/** Strict field equality; callers own any platform-specific identity tolerance. */
function sameFileMutationFingerprint(left, right) {
	return left.birthtimeNs === right.birthtimeNs && left.ctimeNs === right.ctimeNs && left.dev === right.dev && left.ino === right.ino && left.mtimeNs === right.mtimeNs && left.size === right.size;
}
/** Maps the borrowed-descriptor digest to OpenClaw's persisted artifact fields. */
function hashFileDescriptorSync(fd, maxBytes) {
	const { digest, bytes } = sha256FileSync(fd, { maxBytes });
	return {
		sha256: digest,
		sizeBytes: bytes
	};
}
//#endregion
//#region src/infra/sqlite-snapshot-file.ts
function assertExpectedContent(actual, expected, filePath) {
	if (actual.sizeBytes !== expected.sizeBytes) throw new Error(`SQLite snapshot size mismatch for ${filePath}: expected ${expected.sizeBytes}, got ${actual.sizeBytes}`);
	if (actual.sha256 !== expected.sha256) throw new Error(`SQLite snapshot hash mismatch for ${filePath}: expected ${expected.sha256}, got ${actual.sha256}`);
}
function assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity) {
	const openedIdentity = fs.fstatSync(fileDescriptor, { bigint: true });
	const currentIdentity = fs.lstatSync(filePath, { bigint: true });
	if (!openedIdentity.isFile() || !currentIdentity.isFile() || !sameFileIdentity(expectedIdentity, openedIdentity) || !sameFileIdentity(expectedIdentity, currentIdentity)) throw new Error(`SQLite snapshot file changed: ${filePath}`);
}
function hashPublishedFileSync(filePath, expectedIdentity) {
	const fileDescriptor = fs.openSync(filePath, "r");
	try {
		assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity);
		const initialStat = fs.fstatSync(fileDescriptor, { bigint: true });
		const content = hashFileDescriptorSync(fileDescriptor);
		const finalStat = fs.fstatSync(fileDescriptor, { bigint: true });
		if (!sameFileMutationFingerprint(initialStat, finalStat)) {
			if (!sameFileStatFingerprint(initialStat, finalStat)) throw new Error(`SQLite snapshot file changed while reading: ${filePath}`);
			assertExpectedContent(hashFileDescriptorSync(fileDescriptor), content, filePath);
		}
		assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity);
		return content;
	} finally {
		fs.closeSync(fileDescriptor);
	}
}
function sameFileStatFingerprint(left, right) {
	return sameFileIdentity(left, right) && left.size === right.size;
}
//#endregion
//#region src/infra/sqlite-file-generation.ts
function readSqliteIntegrityFileIdentity(pathname, expected) {
	const current = fs.statSync(pathname, { bigint: true });
	if (!current.isFile() || expected && !sameFileIdentity(expected, current)) throw new Error(`SQLite source changed during integrity admission: ${pathname}`);
	return {
		dev: current.dev,
		ino: current.ino,
		size: current.size
	};
}
function canRetainDigest(stat, observedAtNs) {
	const cutoff = observedAtNs - 2000000000n;
	return typeof stat.dev === "bigint" && typeof stat.ino === "bigint" && typeof stat.size === "bigint" && stat.dev !== 0n && stat.ino !== 0n && typeof stat.birthtimeNs === "bigint" && typeof stat.mtimeNs === "bigint" && typeof stat.ctimeNs === "bigint" && stat.mtimeNs > 0n && stat.ctimeNs > 0n && stat.mtimeNs < cutoff && stat.ctimeNs < cutoff;
}
function timestampNs(nanoseconds, milliseconds) {
	return nanoseconds ?? (typeof milliseconds === "bigint" ? milliseconds * 1000000n : BigInt(Math.trunc(milliseconds * 1e6)));
}
function fingerprintFile(pathname, verified) {
	const observedAtNs = BigInt(Date.now()) * 1000000n;
	const fd = fs.openSync(pathname, "r");
	try {
		const before = fs.fstatSync(fd, { bigint: true });
		if (!before.isFile()) throw new Error("SQLite generation target must be a regular file");
		const previous = verified.get(pathname);
		if (previous && canRetainDigest(before, observedAtNs) && sameFileMutationFingerprint(previous, before)) {
			const after = fs.fstatSync(fd, { bigint: true });
			const current = fs.statSync(pathname, { bigint: true });
			if (current.isFile() && sameFileMutationFingerprint(before, after) && sameFileMutationFingerprint(after, current)) return previous;
		}
		const { sha256 } = hashPublishedFileSync(fs.realpathSync.native(pathname), before);
		const after = fs.fstatSync(fd, { bigint: true });
		const current = fs.statSync(pathname, { bigint: true });
		if (!sameFileStatFingerprint(before, after) || !sameFileStatFingerprint(after, current)) throw new Error(`SQLite generation target changed while hashing: ${pathname}`);
		const fingerprint = {
			birthtimeNs: timestampNs(after.birthtimeNs, after.birthtimeMs),
			ctimeNs: timestampNs(after.ctimeNs, after.ctimeMs),
			dev: after.dev,
			ino: after.ino,
			mtimeNs: timestampNs(after.mtimeNs, after.mtimeMs),
			sha256,
			size: after.size
		};
		if (canRetainDigest(before, observedAtNs) && sameFileMutationFingerprint(before, after) && sameFileMutationFingerprint(after, current)) verified.set(pathname, fingerprint);
		else verified.delete(pathname);
		return fingerprint;
	} finally {
		fs.closeSync(fd);
	}
}
function readOptionalFile(pathname, verified) {
	try {
		return fingerprintFile(pathname, verified);
	} catch (error) {
		if (error.code === "ENOENT") {
			verified.delete(pathname);
			return;
		}
		throw error;
	}
}
/** One observation owns its digests; every read still checks the complete family. */
function createSqliteFileGenerationReader() {
	const verified = /* @__PURE__ */ new Map();
	return (pathname) => {
		const database = fingerprintFile(pathname, verified);
		const journal = readOptionalFile(`${pathname}-journal`, verified);
		const wal = readOptionalFile(`${pathname}-wal`, verified);
		return {
			database,
			...journal ? { journal } : {},
			...wal ? { wal } : {}
		};
	};
}
/** Raw source reads require an isolated process or a drained database owner. */
function readStableSqliteFileGeneration(pathname, readGeneration = createSqliteFileGenerationReader()) {
	const first = readGeneration(pathname);
	const second = readGeneration(pathname);
	if (!sameSqliteFileGeneration(first, second)) throw new Error(`SQLite file generation changed while reading: ${pathname}`);
	return second;
}
function sameFileFingerprint(left, right) {
	return left.dev === right.dev && left.ino === right.ino && sameFileStatFingerprint(left, right) && left.sha256 === right.sha256;
}
function sameOptionalFileFingerprint(left, right) {
	return left === void 0 ? right === void 0 : right !== void 0 && sameFileFingerprint(left, right);
}
function sameSqliteFileGeneration(left, right) {
	return sameFileFingerprint(left.database, right.database) && sameOptionalFileFingerprint(left.journal, right.journal) && sameOptionalFileFingerprint(left.wal?.size === 0n ? void 0 : left.wal, right.wal?.size === 0n ? void 0 : right.wal);
}
function serializeFileFingerprint(fingerprint) {
	return {
		birthtimeNs: fingerprint.birthtimeNs.toString(),
		ctimeNs: fingerprint.ctimeNs.toString(),
		dev: fingerprint.dev.toString(),
		ino: fingerprint.ino.toString(),
		mtimeNs: fingerprint.mtimeNs.toString(),
		sha256: fingerprint.sha256,
		size: fingerprint.size.toString()
	};
}
function serializeSqliteFileGeneration(generation) {
	return JSON.stringify({
		database: serializeFileFingerprint(generation.database),
		...generation.journal ? { journal: serializeFileFingerprint(generation.journal) } : {},
		...generation.wal ? { wal: serializeFileFingerprint(generation.wal) } : {}
	});
}
function parseFileFingerprint(fingerprint) {
	if (!isRecord(fingerprint)) throw new Error("SQLite file fingerprint must be an object");
	for (const field of [
		"birthtimeNs",
		"ctimeNs",
		"dev",
		"ino",
		"mtimeNs",
		"size"
	]) if (typeof fingerprint[field] !== "string" || !/^-?\d+$/u.test(fingerprint[field])) throw new Error(`SQLite file fingerprint ${field} is invalid`);
	if (typeof fingerprint.sha256 !== "string" || !/^[a-f0-9]{64}$/u.test(fingerprint.sha256)) throw new Error("SQLite file fingerprint sha256 is invalid");
	return {
		birthtimeNs: BigInt(fingerprint.birthtimeNs),
		ctimeNs: BigInt(fingerprint.ctimeNs),
		dev: BigInt(fingerprint.dev),
		ino: BigInt(fingerprint.ino),
		mtimeNs: BigInt(fingerprint.mtimeNs),
		sha256: fingerprint.sha256,
		size: BigInt(fingerprint.size)
	};
}
function parseSqliteFileGeneration(serialized) {
	const generation = JSON.parse(serialized);
	if (!isRecord(generation)) throw new Error("SQLite file generation must be an object");
	return {
		database: parseFileFingerprint(generation.database),
		...generation.journal === void 0 ? {} : { journal: parseFileFingerprint(generation.journal) },
		...generation.wal === void 0 ? {} : { wal: parseFileFingerprint(generation.wal) }
	};
}
//#endregion
export { sameSqliteFileGeneration as a, readStableSqliteFileGeneration as i, parseSqliteFileGeneration as n, serializeSqliteFileGeneration as o, readSqliteIntegrityFileIdentity as r, hashFileDescriptorSync as s, createSqliteFileGenerationReader as t };
