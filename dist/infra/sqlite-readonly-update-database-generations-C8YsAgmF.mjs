import { lt as hasNodeErrorCode } from "./sqlite-readonly-runtime-process-manifest-B1faCUt1.mjs";
import { Dn as runWithSqliteCleanup, mn as readDatabaseIdentityBirthtime, s as openNodeSqliteDatabase } from "./sqlite-readonly-sqlite-busy-timeout-CPLgQzS6.mjs";
import { Ct as truncateSqliteWal, I as sha256Hex, d as prepareSqliteReadOnlyLocationSyncInProcess } from "./sqlite-readonly-location.worker.js";
import { a as sameSqliteFileGeneration, i as readStableSqliteFileGeneration, s as hashFileDescriptorSync, t as createSqliteFileGenerationReader } from "./sqlite-readonly-sqlite-file-generation-B2tri0d6.mjs";
import fs from "node:fs";
//#region src/infra/update-database-generations.ts
function readCommittedContent(pathname) {
	const prepared = prepareSqliteReadOnlyLocationSyncInProcess(pathname);
	return runWithSqliteCleanup({ release: prepared.cleanup }, "Database generation snapshot", () => {
		const database = openNodeSqliteDatabase(prepared.location);
		runWithSqliteCleanup({ release: () => database.close() }, "Database generation checkpoint", () => truncateSqliteWal(database, prepared.location));
		const descriptor = fs.openSync(prepared.location, "r");
		return runWithSqliteCleanup({ release: () => fs.closeSync(descriptor) }, "Database generation digest", () => hashFileDescriptorSync(descriptor).sha256);
	});
}
function readWalIndexHeader(pathname) {
	const file = `${pathname}-shm`;
	let descriptor;
	try {
		descriptor = fs.openSync(file, "r");
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return null;
		throw error;
	}
	try {
		const before = fs.fstatSync(descriptor, { bigint: true });
		const header = Buffer.alloc(96);
		const first = fs.readSync(descriptor, header, 0, 48, 0);
		const second = fs.readSync(descriptor, header, 48, 48, 48);
		const after = fs.fstatSync(descriptor, { bigint: true });
		const current = fs.lstatSync(file, { bigint: true });
		if (!before.isFile() || !current.isFile() || [after, current].some((stat) => before.dev !== stat.dev || before.ino !== stat.ino) || first !== 48 || second !== 48 || !header.subarray(0, 48).equals(header.subarray(48, 96))) throw new Error(`SQLite WAL commit header is unavailable or changing: ${pathname}`);
		return header;
	} finally {
		fs.closeSync(descriptor);
	}
}
/** Run only in an isolated process, after all source handles drain, or under a
* schema-maintenance owner before live reads are admitted: raw close
* can release this process's SQLite locks. Inspect only the supplied inventory. */
function readUpdateDatabaseGenerationObservation(pathname) {
	const entry = fs.lstatSync(pathname, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (!entry) {
		if (["-wal", "-journal"].some((suffix) => fs.lstatSync(`${pathname}${suffix}`, { throwIfNoEntry: false }))) throw new Error(`Database is absent but retained journal data exists: ${pathname}`);
		return { generation: null };
	}
	if (!entry.isFile()) throw new Error(`Database generation requires a regular file: ${pathname}`);
	const before = readWalIndexHeader(pathname);
	const readGeneration = createSqliteFileGenerationReader();
	const generation = readStableSqliteFileGeneration(pathname, readGeneration);
	const content = readCommittedContent(pathname);
	const current = readStableSqliteFileGeneration(pathname, readGeneration);
	const after = readWalIndexHeader(pathname);
	if (!sameSqliteFileGeneration(generation, current) || (before === null ? after !== null : !after?.equals(before)) || generation.wal && generation.wal.size > 0n && after?.[12] !== 1) throw new Error(`SQLite WAL commit publication could not be verified: ${pathname}`);
	const identity = [
		generation.database.dev.toString(),
		generation.database.ino.toString(),
		readDatabaseIdentityBirthtime(entry),
		content
	];
	const change = after?.subarray(8, 12).toString("hex") ?? null;
	const checksum = after?.subarray(24, 32).toString("hex") ?? null;
	const fingerprint = (writeChange, writeChecksum) => sha256Hex(JSON.stringify([
		...identity,
		writeChange,
		writeChecksum
	]));
	const emptyReader = !generation.journal && (generation.wal?.size ?? 0n) === 0n && (after === null || change === "00000000" && checksum === "0000000000000000");
	return {
		generation: fingerprint(change, checksum),
		...emptyReader ? { emptyReaderAlternate: after === null ? fingerprint("00000000", "0000000000000000") : fingerprint(null, null) } : {}
	};
}
//#endregion
export { readUpdateDatabaseGenerationObservation };
