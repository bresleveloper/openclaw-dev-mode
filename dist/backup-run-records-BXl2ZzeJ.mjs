import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { i as isOpenClawStateDatabaseDefinitelyAbsent, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { a as serializeBackupRunManifest, i as resolveBackupRunTarget, r as resolveBackupRunNamespace } from "./backup-run-records.contract.js";
import { existsSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/state/backup-run-records.ts
/** Record one best-effort backup outcome in the shared bounded operational log. */
async function recordBackupRunOutcome(params) {
	const databasePath = resolveOpenClawStateSqlitePath(params.env ?? process.env);
	if (!existsSync(databasePath)) return;
	const context = captureOpenClawStateWorkerContext({
		path: databasePath,
		env: params.env
	});
	const manifest = serializeBackupRunManifest({
		...params,
		pushFailed: params.pushFailed === true ? true : void 0
	});
	const row = {
		id: randomUUID(),
		created_at: params.createdAt ?? Date.now(),
		archive_path: params.archivePath,
		status: params.status,
		manifest_json: manifest
	};
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "backup.recordOutcome",
		input: row
	}), { existingOnly: true });
}
/** Read ledger rows through the shared SQLite read worker without bootstrapping state. */
async function readBackupRuns(env) {
	if (isOpenClawStateDatabaseDefinitelyAbsent(env)) return [];
	const result = await executeExistingOpenClawStateRead({
		env,
		path: resolveOpenClawStateSqlitePath(env)
	}, { type: "backup.runs" });
	if (!result) return [];
	if (!result.ok) throw new Error(result.message);
	if (result.type !== "backup.runs") throw new Error("Unexpected backup ledger read result");
	return result.runs;
}
function summarizeBackupFreshness(runs) {
	const latest = runs[0];
	const latestOk = runs.find((run) => run.status === "ok");
	const latestOffsite = runs.find((run) => run.kind === "archive" && (run.location || run.target));
	return {
		...latest ? { latest } : {},
		...latestOk ? { latestOk } : {},
		...latestOffsite ? { latestOffsite } : {}
	};
}
/** Read backup freshness without creating or repairing an absent state database. */
async function readBackupRunFreshness(env) {
	return summarizeBackupFreshness(await readBackupRuns(env));
}
function summarizeBackupTargets(runs) {
	const groups = /* @__PURE__ */ new Map();
	for (const run of runs) {
		const target = run.location?.name ?? resolveBackupRunTarget(run);
		const namespace = resolveBackupRunNamespace(run);
		const key = JSON.stringify([
			run.kind,
			target,
			namespace
		]);
		let group = groups.get(key);
		if (!group) {
			group = {
				kind: run.kind,
				target: target ?? run.archivePath,
				...namespace === void 0 ? {} : { namespace },
				latest: run
			};
			groups.set(key, group);
		}
		if (run.status === "ok" && !group.latestOk) group.latestOk = run;
	}
	return [...groups.values()];
}
/** Archive parents are the fallback scratch roots when TMPDIR overlaps a source. */
async function readBackupArchiveDirectories(env) {
	return [...new Set((await readBackupRuns(env)).flatMap((record) => record.kind === "archive" && path.isAbsolute(record.archivePath) ? [path.dirname(record.archivePath)] : []))];
}
//#endregion
export { summarizeBackupFreshness as a, recordBackupRunOutcome as i, readBackupRunFreshness as n, summarizeBackupTargets as o, readBackupRuns as r, readBackupArchiveDirectories as t };
