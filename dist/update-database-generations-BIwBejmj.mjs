import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { c as readDatabaseIdentityBirthtime } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { s as prepareSqliteReadOnlyLocationSyncInProcess } from "./sqlite-readonly-location-OdGkIPCl.mjs";
import { o as runWithSqliteCleanup } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { _ as truncateSqliteWal } from "./sqlite-wal-DUSYRhyv.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { n as hashFileDescriptorSync } from "./file-descriptor-B4yBUiAP.mjs";
import { i as sameSqliteFileGeneration, r as readStableSqliteFileGeneration } from "./sqlite-file-generation-C_XgOkXx.mjs";
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
		if (!before.isFile() || !current.isFile() || before.dev !== after.dev || before.ino !== after.ino || before.dev !== current.dev || before.ino !== current.ino || first !== 48 || second !== 48 || !header.subarray(0, 48).equals(header.subarray(48, 96))) throw new Error(`SQLite WAL commit header is unavailable or changing: ${pathname}`);
		return header;
	} finally {
		fs.closeSync(descriptor);
	}
}
/** Run only in an isolated process, after all source handles drain, or under a
* schema-maintenance owner before live reads are admitted: raw close
* can release this process's SQLite locks. Inspect only the supplied inventory. */
function readUpdateDatabaseGenerations(paths) {
	return Object.fromEntries(paths.map((pathname) => {
		const entry = fs.lstatSync(pathname, {
			bigint: true,
			throwIfNoEntry: false
		});
		if (!entry) {
			if (["-wal", "-journal"].some((suffix) => fs.lstatSync(`${pathname}${suffix}`, { throwIfNoEntry: false }))) throw new Error(`Database is absent but retained journal data exists: ${pathname}`);
			return [pathname, null];
		}
		if (!entry.isFile()) throw new Error(`Database generation requires a regular file: ${pathname}`);
		const before = readWalIndexHeader(pathname);
		const generation = readStableSqliteFileGeneration(pathname);
		const content = readCommittedContent(pathname);
		const current = readStableSqliteFileGeneration(pathname);
		const after = readWalIndexHeader(pathname);
		if (!sameSqliteFileGeneration(generation, current) || (before === null ? after !== null : !after?.equals(before)) || generation.wal && generation.wal.size > 0n && after?.[12] !== 1) throw new Error(`SQLite WAL commit publication could not be verified: ${pathname}`);
		return [pathname, sha256Hex(JSON.stringify([
			generation.database.dev.toString(),
			generation.database.ino.toString(),
			readDatabaseIdentityBirthtime(entry),
			content,
			after?.subarray(8, 12).toString("hex") ?? null,
			after?.subarray(24, 32).toString("hex") ?? null
		]))];
	}));
}
//#endregion
export { readUpdateDatabaseGenerations as t };
