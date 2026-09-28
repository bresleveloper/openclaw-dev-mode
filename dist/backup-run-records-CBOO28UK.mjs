import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { existsSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/state/backup-run-records.contract.ts
const BACKUP_RUN_ERROR_MAX_LENGTH = 1200;
//#endregion
//#region src/state/backup-run-records.ts
function boundedText(value, maxLength) {
	const trimmed = value?.trim();
	return trimmed ? truncateUtf16Safe(trimmed, maxLength) : void 0;
}
function parseBackupRun(row) {
	if (row.status !== "ok" && row.status !== "failed") return;
	let manifest;
	try {
		manifest = JSON.parse(row.manifest_json);
	} catch {
		return;
	}
	if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) return;
	const value = manifest;
	if (value.kind !== "archive" && value.kind !== "sqlite-snapshot" && value.kind !== "git") return;
	return {
		id: row.id,
		createdAt: row.created_at,
		archivePath: row.archive_path,
		status: row.status,
		kind: value.kind,
		...typeof value.target === "string" ? { target: value.target } : {},
		...typeof value.error === "string" ? { error: value.error } : {},
		...value.pushFailed === true ? { pushFailed: true } : {}
	};
}
/** Record one best-effort backup outcome in the shared bounded operational log. */
async function recordBackupRunOutcome(params) {
	const databasePath = resolveOpenClawStateSqlitePath(params.env ?? process.env);
	if (!existsSync(databasePath)) return;
	const context = captureOpenClawStateWorkerContext({
		path: databasePath,
		env: params.env
	});
	const manifest = JSON.stringify({
		kind: params.kind,
		...boundedText(params.target, 512) ? { target: boundedText(params.target, 512) } : {},
		...boundedText(params.error, 1200) ? { error: boundedText(params.error, BACKUP_RUN_ERROR_MAX_LENGTH) } : {},
		...params.pushFailed === true ? { pushFailed: true } : {}
	});
	const row = {
		id: randomUUID(),
		created_at: params.createdAt ?? Date.now(),
		archive_path: params.archivePath,
		status: params.status,
		manifest_json: manifest
	};
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "backup.recordOutcome",
		input: row
	}), { existingOnly: true });
}
function readBackupRun(database, status) {
	if (!tableExists(database, "backup_runs")) return;
	let query = getNodeSqliteKysely(database).selectFrom("backup_runs").selectAll();
	if (status) query = query.where("status", "=", status);
	const row = executeSqliteQueryTakeFirstSync(database, query.orderBy("created_at", "desc").orderBy("id", "desc").limit(1));
	return row ? parseBackupRun(row) : void 0;
}
/** Read backup freshness without creating or repairing an absent state database. */
async function readBackupRunFreshness(env) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => ({
		latest: readBackupRun(db),
		latestOk: readBackupRun(db, "ok")
	}), {
		env,
		path: resolveOpenClawStateSqlitePath(env)
	}) ?? {};
}
/** Archive parents are the fallback scratch roots when TMPDIR overlaps a source. */
function readBackupArchiveDirectories(env) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "backup_runs")) return [];
		const rows = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("backup_runs").selectAll()).rows;
		return [...new Set(rows.flatMap((row) => {
			const record = parseBackupRun(row);
			return record?.kind === "archive" && path.isAbsolute(record.archivePath) ? [path.dirname(record.archivePath)] : [];
		}))];
	}, {
		env,
		path: resolveOpenClawStateSqlitePath(env)
	}) ?? [];
}
//#endregion
export { BACKUP_RUN_ERROR_MAX_LENGTH as i, readBackupRunFreshness as n, recordBackupRunOutcome as r, readBackupArchiveDirectories as t };
