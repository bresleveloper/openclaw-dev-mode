import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { u as readDatabaseIdentityBirthtime } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { o as runWithSqliteCleanup } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { n as hashFileDescriptorSync } from "./file-descriptor-BWLpOgrg.mjs";
import { a as sameSqliteFileGeneration, i as readStableSqliteFileGeneration, t as createSqliteFileGenerationReader } from "./sqlite-file-generation-Cmk6kG35.mjs";
import { a as truncateSqliteWal } from "./sqlite-wal-checkpoint-CgnAfdqs.mjs";
import { s as prepareSqliteReadOnlyLocationSyncInProcess } from "./sqlite-readonly-location-Cz5jsVbC.mjs";
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
function readUpdateDatabaseGenerations(paths) {
	return Object.fromEntries(paths.map((pathname) => [pathname, readUpdateDatabaseGenerationObservation(pathname).generation]));
}
//#endregion
//#region src/infra/update-physical-database-generations.ts
async function readUpdatePhysicalDatabaseGenerations(paths) {
	const result = readUpdateDatabaseGenerations(paths);
	const { readBackupEngine, fingerprintPostgresBackup } = await import("./database-backup-DtIZf0VT.mjs");
	const postgres = paths.filter((pathname) => result[pathname] !== null && readBackupEngine(pathname).engine === "postgres");
	if (postgres.length) {
		const { createConfigIO } = await import("./io-Cwio_qp9.mjs");
		const { config } = await createConfigIO({
			observe: false,
			pluginValidation: "core-only",
			shellEnvFallback: "defer"
		}).readConfigFileSnapshot();
		for (const pathname of postgres) result[pathname] = await fingerprintPostgresBackup(pathname, config);
	}
	return result;
}
//#endregion
export { readUpdateDatabaseGenerations as n, readUpdatePhysicalDatabaseGenerations as t };
