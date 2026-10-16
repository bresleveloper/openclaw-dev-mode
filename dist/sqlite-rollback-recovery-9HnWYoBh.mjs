import { r as resolveExistingSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { p as createPrivateSqliteTempDirectorySync } from "./sqlite-snapshot-staging-BIgaAYlp.mjs";
import { n as withExistingSqliteRollbackDatabase } from "./sqlite-existing-database-DMt1YTXm.mjs";
import { t as retainMutationAuthority } from "./mutation-authority-E8BC9dNY.mjs";
import { r as removePathWithinRoot } from "./fs-safe-remove-DuP7yp5L.mjs";
import { t as createVerifiedSqliteSnapshot } from "./sqlite-snapshot-c6hBDowh.mjs";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/sqlite-recovery-snapshot.ts
/** Keep recovery scratch attached to its original journal/control authority.
* The callback must recheck the supplied guard after awaited transport, before
* opening the result. Cleanup never adopts a successor directory or parent. */
async function withSqliteRecoverySnapshot(control, assertCurrent, read) {
	const assertOwner = retainMutationAuthority(assertCurrent);
	assertOwner();
	const directory = createPrivateSqliteTempDirectorySync(control, ".recovery-snapshot-");
	const original = fs.lstatSync(directory, { bigint: true });
	const assertSnapshot = (allowMissing = false) => {
		assertOwner();
		const current = fs.lstatSync(directory, {
			bigint: true,
			throwIfNoEntry: false
		});
		if (!current && !allowMissing || current && (!current.isDirectory() || current.isSymbolicLink() || process.platform !== "win32" && (current.mode & 63n) !== 0n || current.dev !== original.dev || current.ino !== original.ino)) throw new Error("SQLite recovery snapshot directory changed.");
	};
	let outcome;
	try {
		assertSnapshot();
		const value = await read(path.join(directory, "operation.sqlite"), assertSnapshot);
		assertSnapshot();
		outcome = { value };
	} catch (error) {
		outcome = { error };
	}
	let cleanupFailure;
	try {
		await removePathWithinRoot({
			rootDir: control,
			relativePath: path.basename(directory),
			recursive: true,
			force: true,
			assertBeforeMutation: () => assertSnapshot(true)
		});
	} catch (error) {
		cleanupFailure = { error };
	}
	if (cleanupFailure) {
		if ("error" in outcome) throw new AggregateError([outcome.error, cleanupFailure.error], "Recovery snapshot and owned cleanup failed.", { cause: outcome.error });
		throw cleanupFailure.error;
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
//#endregion
//#region src/infra/sqlite-rollback-recovery.ts
/** Prepare evidence without replaying the source journal; only its live owner may admit rollback. */
async function prepareSqliteRollbackRecovery(params) {
	const fingerprint = (file) => {
		const stat = fs.lstatSync(file, {
			bigint: true,
			throwIfNoEntry: false
		});
		if (!stat) return null;
		if (!stat.isFile() || stat.nlink !== 1n) throw new Error("SQLite recovery requires regular unshared database and sidecar files.");
		params.assertFileSafe(file, stat);
		return `${stat.dev}:${stat.ino}:${stat.ctimeNs}:${stat.mtimeNs}:${stat.size}`;
	};
	params.assertIdentity();
	const files = [
		params.path,
		`${params.path}-journal`,
		`${params.path}-wal`,
		`${params.path}-shm`
	];
	const identities = files.map(fingerprint);
	const assertUnchanged = () => {
		params.assertIdentity();
		if (files.some((file, index) => fingerprint(file) !== identities[index])) throw new Error("SQLite recovery database or journal changed.");
	};
	const read = () => withExistingSqliteRollbackDatabase(params.path, {
		write: false,
		busyTimeoutMs: 0,
		assertIdentity: params.assertIdentity,
		validate: () => void 0
	}, params.read);
	let record;
	let hot = false;
	try {
		record = read();
	} catch (error) {
		if (!(error instanceof Error && "errcode" in error && error.errcode === 776)) throw error;
		hot = true;
		assertUnchanged();
		if (identities[2] !== null || identities[3] !== null) throw new Error("SQLite rollback recovery refuses retained WAL or shared-memory artifacts.", { cause: error });
		record = await withSqliteRecoverySnapshot(params.scratchRoot, params.assertIdentity, async (targetPath, assertSnapshot) => {
			await createVerifiedSqliteSnapshot({
				sourcePath: params.path,
				targetPath,
				preserveRowIds: true,
				validate: (database) => {
					params.read(database);
				}
			});
			assertSnapshot();
			const snapshot = openNodeSqliteDatabase(targetPath, { readOnly: true });
			try {
				return params.read(snapshot);
			} finally {
				snapshot.close();
			}
		});
	}
	assertUnchanged();
	const assertRecord = (actual) => {
		if (!isDeepStrictEqual(record, actual)) throw new Error("SQLite recovery record changed after preparation.");
	};
	return {
		record,
		assertUnchanged,
		admit(assertCurrent) {
			assertUnchanged();
			assertCurrent();
			if (!hot) {
				assertRecord(read());
				return;
			}
			const database = openNodeSqliteDatabase(resolveExistingSqliteFileUri(params.path));
			try {
				params.assertIdentity();
				assertCurrent();
				const mode = database.prepare("PRAGMA journal_mode").get()?.journal_mode;
				if (![
					"delete",
					"truncate",
					"persist"
				].includes(String(mode))) throw new Error("SQLite recovery requires rollback journal mode.");
				assertRecord(params.read(database));
			} finally {
				database.close();
			}
		}
	};
}
//#endregion
export { prepareSqliteRollbackRecovery as t };
