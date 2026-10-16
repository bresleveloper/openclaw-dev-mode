import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { p as createPrivateSqliteTempDirectorySync } from "./sqlite-snapshot-staging-BIgaAYlp.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { n as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-BPapZs5n.mjs";
import { x as assertOpenClawStateDatabaseOwner } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-CqSvP1tc.mjs";
import { n as hashFileDescriptorSync } from "./file-descriptor-B4yBUiAP.mjs";
import { n as assertSqliteIntegrity, t as SqliteRepairableForeignKeyError } from "./sqlite-integrity-GtqcmwG3.mjs";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/state/openclaw-state-db-task-delivery-recovery.ts
const ORPHAN_PREDICATE = "NOT EXISTS (SELECT 1 FROM task_runs WHERE task_runs.task_id = task_delivery_state.task_id)";
function orphanRows(database) {
	const statement = database.prepare(`SELECT rowid, * FROM task_delivery_state
    WHERE ${ORPHAN_PREDICATE} ORDER BY rowid`);
	statement.setReadBigInts(true);
	return statement.iterate();
}
function encodeOrphanRow(row) {
	if (typeof row.rowid !== "bigint" || typeof row.task_id !== "string" || row.requester_origin_json !== null && typeof row.requester_origin_json !== "string" || row.last_notified_event_at !== null && typeof row.last_notified_event_at !== "bigint") throw new Error("Orphan task delivery values do not match the supported recovery contract.");
	return `${JSON.stringify(row, (_key, value) => typeof value === "bigint" ? value.toString() : value)}\n`;
}
function assertRecoveryShape(database) {
	const columns = database.prepare("PRAGMA table_xinfo(task_delivery_state)").all();
	const expected = [
		{
			cid: 0,
			name: "task_id",
			type: "TEXT",
			notnull: 1,
			dflt_value: null,
			pk: 1,
			hidden: 0
		},
		{
			cid: 1,
			name: "requester_origin_json",
			type: "TEXT",
			notnull: 0,
			dflt_value: null,
			pk: 0,
			hidden: 0
		},
		{
			cid: 2,
			name: "last_notified_event_at",
			type: "INTEGER",
			notnull: 0,
			dflt_value: null,
			pk: 0,
			hidden: 0
		}
	];
	const foreignKeys = database.prepare("PRAGMA foreign_key_list(task_delivery_state)").all();
	const canonicalForeignKey = [{
		id: 0,
		seq: 0,
		table: "task_runs",
		from: "task_id",
		to: "task_id",
		on_update: "NO ACTION",
		on_delete: "CASCADE",
		match: "NONE"
	}];
	const triggers = database.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'trigger' AND tbl_name = 'task_delivery_state'").get();
	if (JSON.stringify(columns) !== JSON.stringify(expected) || JSON.stringify(foreignKeys) !== JSON.stringify(canonicalForeignKey) || triggers) throw new Error("Orphan task delivery recovery refused an unrecognized table, foreign key, or trigger.");
}
function assertKnownOrphanIntegrity(database) {
	try {
		assertSqliteIntegrity(database, "task delivery recovery database");
		return 0;
	} catch (error) {
		if (error instanceof SqliteRepairableForeignKeyError) return error.repair.orphanCount;
		throw error;
	}
}
function syncAndHash(filePath) {
	const descriptor = fs.openSync(filePath, "r+");
	try {
		fs.fsyncSync(descriptor);
		return hashFileDescriptorSync(descriptor);
	} finally {
		fs.closeSync(descriptor);
	}
}
/**
* Caller holds Doctor's ownership/schema fences and its immediate write transaction.
* Foreign-key actions stay disabled: inbound dependents must fail the post-check,
* never cascade into unrelated data. The caller rolls back any failed check.
*/
function recoverOrphanTaskDeliveryRows(database, pathname) {
	if (!tableExists(database, "task_delivery_state") || !tableExists(database, "task_runs") || !database.prepare(`SELECT 1 FROM task_delivery_state WHERE ${ORPHAN_PREDICATE} LIMIT 1`).get()) return [];
	assertOpenClawStateDatabaseOwner(database, { pathname });
	assertRecoveryShape(database);
	const count = assertKnownOrphanIntegrity(database);
	if (!database.isTransaction) throw new Error("Orphan task delivery recovery requires the Doctor write transaction.");
	const prepared = prepareSqliteReadOnlyLocationSync(pathname);
	let recoveryDirectory;
	try {
		const snapshot = openNodeSqliteDatabase(prepared.location);
		try {
			snapshot.exec("PRAGMA journal_mode = DELETE;");
			assertRecoveryShape(snapshot);
			if (assertKnownOrphanIntegrity(snapshot) !== count) throw new Error("Orphan task delivery snapshot changed before preservation.");
			const sourceHash = createHash("sha256");
			const snapshotHash = createHash("sha256");
			for (const row of orphanRows(database)) sourceHash.update(encodeOrphanRow(row));
			for (const row of orphanRows(snapshot)) snapshotHash.update(encodeOrphanRow(row));
			if (sourceHash.digest("hex") !== snapshotHash.digest("hex")) throw new Error("Orphan task delivery snapshot does not preserve the current payload.");
		} finally {
			snapshot.close();
		}
		recoveryDirectory = createPrivateSqliteTempDirectorySync(path.dirname(pathname), "openclaw-task-delivery-recovery-");
		const backupPath = path.join(recoveryDirectory, "database.sqlite");
		const expectedBackup = syncAndHash(prepared.location);
		fs.copyFileSync(prepared.location, backupPath, fs.constants.COPYFILE_EXCL);
		fs.chmodSync(backupPath, 384);
		if (JSON.stringify(syncAndHash(backupPath)) !== JSON.stringify(expectedBackup)) throw new Error("Orphan task delivery backup verification failed.");
		const exportPath = path.join(recoveryDirectory, "orphan-rows.jsonl");
		const exportDescriptor = fs.openSync(exportPath, "wx+", 384);
		const exportHash = createHash("sha256");
		let exportedCount = 0;
		try {
			for (const row of orphanRows(database)) {
				const encoded = encodeOrphanRow(row);
				fs.writeFileSync(exportDescriptor, encoded);
				exportHash.update(encoded);
				exportedCount += 1;
			}
			fs.fsyncSync(exportDescriptor);
			if (hashFileDescriptorSync(exportDescriptor).sha256 !== exportHash.digest("hex")) throw new Error("Orphan task delivery export verification failed.");
		} finally {
			fs.closeSync(exportDescriptor);
		}
		if (exportedCount !== count) throw new Error("Orphan task delivery export did not account for every foreign-key violation.");
		fs.writeFileSync(path.join(recoveryDirectory, "manifest.json"), JSON.stringify({
			format: "openclaw.task-delivery-recovery.v1",
			state: "preserved-before-repair",
			sourcePath: pathname,
			backup: {
				file: "database.sqlite",
				...expectedBackup,
				integrity: "structural-ok-known-orphans"
			},
			export: {
				file: "orphan-rows.jsonl",
				...syncAndHash(exportPath),
				count,
				integerEncoding: "decimal-string"
			},
			relation: "task_delivery_state.task_id -> task_runs.task_id",
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, null, 2), {
			flag: "wx",
			mode: 384,
			flush: true
		});
		requireDirectorySync(syncDirectorySync(recoveryDirectory), "Task delivery recovery directory");
		requireDirectorySync(syncDirectorySync(path.dirname(recoveryDirectory)), "Task delivery recovery parent");
		const removed = database.prepare(`DELETE FROM task_delivery_state WHERE ${ORPHAN_PREDICATE}`).run();
		if (Number(removed.changes) !== count) throw new Error("Orphan task delivery recovery removed an unexpected number of rows.");
		assertSqliteIntegrity(database, pathname);
		return [`Preserved and recovered ${count} orphan task delivery rows; backup and row export: ${recoveryDirectory}`];
	} catch (error) {
		throw new Error(`Task delivery recovery failed without committing row removal${recoveryDirectory ? `; retained artifacts: ${recoveryDirectory}` : ""}: ${String(error)}`, { cause: error });
	} finally {
		prepared.cleanup();
	}
}
//#endregion
export { recoverOrphanTaskDeliveryRows as t };
