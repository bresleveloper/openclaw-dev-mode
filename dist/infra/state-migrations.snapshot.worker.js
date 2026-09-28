import { t as formatErrorMessage } from "../errors-DnjwnOju.mjs";
import { constants, lstatSync, readdirSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { endianness } from "node:os";
import { text } from "node:stream/consumers";
import { createHash } from "node:crypto";
//#region src/infra/state-migrations.snapshot.worker.ts
const SQLITE_FILE_HEADER = Buffer.from("SQLite format 3\0", "utf8");
const SQLITE_SHM_REGION_BYTES = 32768;
const SQLITE_WAL_INDEX_HEADER_COPY_BYTES = 48;
const SQLITE_WAL_INDEX_HEADER_BYTES = 96;
const SQLITE_WAL_INDEX_VERSION = 3007e3;
const SQLITE_WAL_HEADER_BYTES = 32;
const SQLITE_WAL_MAGIC_LE = 931071618;
const SQLITE_WAL_MAGIC_BE = 931071619;
const SQLITE_SHM_VOLATILE_RANGES = [[96, 120], [128, 132]];
const SNAPSHOT_HASH_BUFFER_BYTES = 1048576;
function readUint32(buffer, offset, byteOrder) {
	return byteOrder === "LE" ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
}
function sqliteWalChecksum(buffer, byteOrder) {
	let first = 0;
	let second = 0;
	for (let offset = 0; offset < buffer.length; offset += 8) {
		first = first + readUint32(buffer, offset, byteOrder) + second >>> 0;
		second = second + readUint32(buffer, offset + 4, byteOrder) + first >>> 0;
	}
	return [first, second];
}
async function digestFile(filePath, observedEntries, hashPrefix = "") {
	const before = await fs$1.lstat(filePath);
	if (!before.isFile()) throw new Error(`Snapshot path is not a regular file: ${filePath}`);
	if (before.nlink !== 1) throw new Error(`Snapshot path has unbound hard links: ${filePath}`);
	observedEntries.push({
		path: filePath,
		stat: before
	});
	const handle = await openSnapshotRegularFile(filePath);
	if (!handle) throw new Error(`Snapshot path is not a regular file: ${filePath}`);
	return `sha256:${await digestSnapshotFileHandle(filePath, handle, before, [], hashPrefix)}`;
}
async function openSnapshotRegularFile(filePath) {
	let before;
	try {
		before = await fs$1.lstat(filePath);
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return;
		throw error;
	}
	if (!before.isFile()) return;
	let handle;
	try {
		handle = await fs$1.open(filePath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0) | (constants.O_NONBLOCK ?? 0));
		const [opened, after] = await Promise.all([handle.stat(), fs$1.lstat(filePath)]);
		if (!opened.isFile() || !after.isFile() || before.dev !== opened.dev || before.ino !== opened.ino || before.dev !== after.dev || before.ino !== after.ino) throw new Error(`Snapshot file changed while opening: ${filePath}`);
		return handle;
	} catch (error) {
		await handle?.close();
		throw error;
	}
}
async function openSqliteSharedMemoryEntry(directory, entry) {
	if (!entry.endsWith("-shm")) return;
	const databasePath = path.join(directory, entry.slice(0, -4));
	const sharedMemoryPath = path.join(directory, entry);
	let databaseHandle;
	try {
		databaseHandle = await openSnapshotRegularFile(databasePath);
		if (!databaseHandle) return;
		const header = Buffer.alloc(SQLITE_FILE_HEADER.length);
		const { bytesRead } = await databaseHandle.read(header, 0, header.length, 0);
		if (bytesRead !== header.length || !header.equals(SQLITE_FILE_HEADER)) return;
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return;
		throw error;
	} finally {
		await databaseHandle?.close();
	}
	let sharedMemoryStat;
	try {
		sharedMemoryStat = await fs$1.lstat(sharedMemoryPath);
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return;
		throw error;
	}
	if (!sharedMemoryStat.isFile() || sharedMemoryStat.size === 0 || sharedMemoryStat.size % SQLITE_SHM_REGION_BYTES !== 0) return;
	let sharedMemoryHandle;
	let walHandle;
	try {
		sharedMemoryHandle = await openSnapshotRegularFile(sharedMemoryPath);
		if (!sharedMemoryHandle) return;
		const header = Buffer.alloc(SQLITE_WAL_INDEX_HEADER_BYTES);
		const { bytesRead } = await sharedMemoryHandle.read(header, 0, header.length, 0);
		if (bytesRead !== header.length) return;
		const first = header.subarray(0, SQLITE_WAL_INDEX_HEADER_COPY_BYTES);
		const second = header.subarray(SQLITE_WAL_INDEX_HEADER_COPY_BYTES);
		const nativeByteOrder = endianness();
		const [indexChecksumFirst, indexChecksumSecond] = sqliteWalChecksum(first.subarray(0, 40), nativeByteOrder);
		if (readUint32(first, 0, nativeByteOrder) !== SQLITE_WAL_INDEX_VERSION || readUint32(first, 4, nativeByteOrder) !== 0 || first[12] !== 1 || readUint32(first, 40, nativeByteOrder) !== indexChecksumFirst || readUint32(first, 44, nativeByteOrder) !== indexChecksumSecond || !first.equals(second)) return;
		walHandle = await openSnapshotRegularFile(`${databasePath}-wal`);
		if (!walHandle) return;
		const walHeader = Buffer.alloc(SQLITE_WAL_HEADER_BYTES);
		if ((await walHandle.read(walHeader, 0, walHeader.length, 0)).bytesRead !== walHeader.length) return;
		const walMagic = walHeader.readUInt32BE(0);
		const walByteOrder = walMagic === SQLITE_WAL_MAGIC_LE ? "LE" : "BE";
		if (walMagic !== SQLITE_WAL_MAGIC_LE && walMagic !== SQLITE_WAL_MAGIC_BE || walHeader.readUInt32BE(4) !== SQLITE_WAL_INDEX_VERSION) return;
		const [walChecksumFirst, walChecksumSecond] = sqliteWalChecksum(walHeader.subarray(0, 24), walByteOrder);
		if (walHeader.readUInt32BE(24) === walChecksumFirst && walHeader.readUInt32BE(28) === walChecksumSecond && first.subarray(32, 40).equals(walHeader.subarray(16, 24))) {
			const verifiedHandle = sharedMemoryHandle;
			sharedMemoryHandle = void 0;
			return verifiedHandle;
		}
		return;
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return;
		throw error;
	} finally {
		await sharedMemoryHandle?.close();
		await walHandle?.close();
	}
}
async function digestSnapshotFileHandle(filePath, handle, expectedStat, volatileRanges = [], hashPrefix = "") {
	const hash = createHash("sha256").update(hashPrefix);
	const buffer = Buffer.alloc(SNAPSHOT_HASH_BUFFER_BYTES);
	let position = 0;
	try {
		const opened = await handle.stat();
		if (expectedStat.dev !== opened.dev || expectedStat.ino !== opened.ino || expectedStat.size !== opened.size || expectedStat.mtimeMs !== opened.mtimeMs) throw new Error(`Snapshot file changed before hashing: ${filePath}`);
		for (;;) {
			const { bytesRead } = await handle.read(buffer, 0, buffer.length, position);
			if (bytesRead === 0) break;
			const chunk = Buffer.from(buffer.subarray(0, bytesRead));
			for (const [rangeStart, rangeEnd] of volatileRanges) {
				const overlapStart = Math.max(position, rangeStart);
				const overlapEnd = Math.min(position + bytesRead, rangeEnd);
				if (overlapStart < overlapEnd) chunk.fill(0, overlapStart - position, overlapEnd - position);
			}
			hash.update(chunk);
			position += bytesRead;
		}
		const after = await handle.stat();
		if (expectedStat.dev !== after.dev || expectedStat.ino !== after.ino || expectedStat.size !== after.size || expectedStat.mtimeMs !== after.mtimeMs) throw new Error(`Snapshot file changed while hashing: ${filePath}`);
	} finally {
		await handle.close();
	}
	return hash.digest("hex");
}
async function digestDirectory(directory, observedEntries) {
	if (!(await fs$1.lstat(directory)).isDirectory()) throw new Error(`Snapshot state path is not a directory: ${directory}`);
	const hash = createHash("sha256");
	const hardLinks = /* @__PURE__ */ new Map();
	const visit = async (current, relative) => {
		const stat = await fs$1.lstat(current);
		if (stat.isSymbolicLink()) throw new Error(`Snapshot tree contains a symbolic link: ${current}`);
		const portableRelative = relative.split(path.sep).join("/");
		if (stat.isFile()) {
			observedEntries.push({
				path: current,
				stat
			});
			const hardLinkKey = `${stat.dev}:${stat.ino}`;
			const existingHardLink = hardLinks.get(hardLinkKey);
			if (existingHardLink) {
				if (existingHardLink.expected !== stat.nlink) throw new Error(`Snapshot hard-link count changed while hashing: ${current}`);
				existingHardLink.observed += 1;
				hash.update("hardlink\0").update(portableRelative).update("\0").update(existingHardLink.firstRelative).update("\0");
				return;
			}
			hardLinks.set(hardLinkKey, {
				firstPath: current,
				firstRelative: portableRelative,
				observed: 1,
				expected: stat.nlink
			});
			const sharedMemoryHandle = await openSqliteSharedMemoryEntry(path.dirname(current), path.basename(current));
			const handle = sharedMemoryHandle ?? await openSnapshotRegularFile(current);
			if (!handle) throw new Error(`Snapshot file changed before hashing: ${current}`);
			const fileDigest = await digestSnapshotFileHandle(current, handle, stat, sharedMemoryHandle ? SQLITE_SHM_VOLATILE_RANGES : []);
			hash.update("file\0").update(portableRelative).update("\0").update(fileDigest).update("\0");
			return;
		}
		if (!stat.isDirectory()) throw new Error(`Snapshot tree contains a non-file entry: ${current}`);
		hash.update("directory\0").update(portableRelative).update("\0");
		const entries = (await fs$1.readdir(current)).toSorted();
		observedEntries.push({
			path: current,
			stat,
			children: entries
		});
		for (const entry of entries) await visit(path.join(current, entry), path.join(relative, entry));
	};
	await visit(directory, "");
	for (const hardLink of hardLinks.values()) if (hardLink.observed !== hardLink.expected) throw new Error(`Snapshot file has links outside copied state: ${hardLink.firstPath}`);
	return `sha256:${hash.digest("hex")}`;
}
function verifySnapshotEntries(observedEntries) {
	for (const entry of observedEntries) {
		const after = lstatSync(entry.path);
		const before = entry.stat;
		if (before.isFile() !== after.isFile() || before.isDirectory() !== after.isDirectory() || before.dev !== after.dev || before.ino !== after.ino || before.nlink !== after.nlink || before.size !== after.size || before.mtimeMs !== after.mtimeMs || before.ctimeMs !== after.ctimeMs) throw new Error(`Snapshot entry changed while hashing: ${entry.path}`);
		if (entry.children) {
			const children = readdirSync(entry.path).toSorted();
			if (entry.children.length !== children.length || entry.children.some((child, index) => child !== children[index])) throw new Error(`Snapshot directory changed while hashing: ${entry.path}`);
		}
	}
}
async function captureLegacyStateSnapshotIdentityInProcess(params) {
	const warnings = [];
	const observedEntries = [];
	const capture = async (label, pathname, read) => {
		try {
			return await read();
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			warnings.push(`Could not bind copied ${label} at ${pathname}: ${message}`);
			return;
		}
	};
	const configPath = path.resolve(params.configPath);
	const stateDir = path.resolve(params.stateDir);
	let configDigest = await capture("config", configPath, async () => {
		const rootDigest = await digestFile(configPath, observedEntries);
		if (params.configInputHashes) {
			if (rootDigest !== `sha256:${params.configInputHashes.root}`) throw new Error(`Snapshot config changed while planning: ${configPath}`);
			for (const input of params.configInputHashes.includes) if (await digestFile(input.path, observedEntries, "present\0") !== `sha256:${input.hash}`) throw new Error(`Snapshot config input changed while planning: ${input.path}`);
		}
		return rootDigest;
	});
	let stateDigest = await capture("state", stateDir, () => digestDirectory(stateDir, observedEntries));
	if (warnings.length === 0) try {
		verifySnapshotEntries(observedEntries);
	} catch (error) {
		warnings.push(`Could not bind copied snapshot: ${formatErrorMessage(error)}`);
		configDigest = void 0;
		stateDigest = void 0;
	}
	return {
		...configDigest ? { configDigest } : {},
		...stateDigest ? { stateDigest } : {},
		warnings
	};
}
async function runSnapshotWorker() {
	try {
		const params = JSON.parse(await text(process.stdin));
		process.stdout.write(JSON.stringify(await captureLegacyStateSnapshotIdentityInProcess(params)));
	} catch (error) {
		process.exitCode = 1;
		process.stderr.write(formatErrorMessage(error));
	}
}
if (process.argv[2] === "--openclaw-state-snapshot") runSnapshotWorker();
//#endregion
export { captureLegacyStateSnapshotIdentityInProcess };
