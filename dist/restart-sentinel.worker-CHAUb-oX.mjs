import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as gitCommitPrefixesMatch } from "./git-commit-eT_9FBYG.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { c as writeRestartSentinelRowIfRevisionSync, l as writeRestartSentinelRowSync, n as deleteRestartSentinelRowSync, o as readRestartSentinelRowSync, s as readRestartSentinelSnapshotSync, u as writeUpdateInstallReceiptRowSync } from "./restart-sentinel-store-CVYfycIC.mjs";
//#region src/infra/restart-sentinel.worker.ts
function transaction(label, operation) {
	return (input, { open, stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const result = operation(db, input);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		return result;
	}, {
		database: open(),
		...stateOptions()
	}, { operationLabel: label });
}
const restartSentinelOperations = {
	"restartSentinel.admit": (_input, { open }) => {
		open();
	},
	"restartSentinel.write": transaction("restart-sentinel.write", (db, payload) => writeRestartSentinelRowSync(db, payload)),
	"restartSentinel.writeIfUnchanged": transaction("restart-sentinel.write-if-unchanged", (db, input) => {
		const current = readRestartSentinelSnapshotSync(db);
		return current.state.kind !== "invalid" && current.revision === input.expectedRevision ? writeRestartSentinelRowSync(db, input.payload) : null;
	}),
	"restartSentinel.markFailure": transaction("restart-sentinel.mark-failure", (db, input) => {
		const current = readRestartSentinelRowSync(db);
		if (current.kind !== "valid") return null;
		const payload = current.sentinel.payload;
		if (payload.kind !== "update" || input.expectedOwner?.runId !== void 0 && payload.stats?.runId !== input.expectedOwner.runId || input.expectedOwner?.handoffId !== void 0 && payload.stats?.handoffId !== input.expectedOwner.handoffId) return null;
		delete payload.continuation;
		payload.status = "error";
		payload.stats = {
			...payload.stats,
			reason: input.reason
		};
		return writeRestartSentinelRowIfRevisionSync(db, payload, current.sentinel.revision);
	}),
	"restartSentinel.clear": transaction("restart-sentinel.clear-if-revision", deleteRestartSentinelRowSync),
	"restartSentinel.finalize": transaction("restart-sentinel.finalize-running-install", (db, input) => {
		const { version, commit, expectedRoot, actualRoot } = input;
		const current = readRestartSentinelRowSync(db);
		if (current.kind !== "valid" || current.sentinel.revision !== input.expectedRevision || current.sentinel.payload.kind !== "update") return null;
		const payload = current.sentinel.payload;
		const stats = payload.stats ? { ...payload.stats } : {};
		const after = isRecord(stats.after) ? { ...stats.after } : {};
		let changed = false;
		if (after.version !== version) {
			after.version = version;
			changed = true;
		}
		if (expectedRoot && stats.root !== expectedRoot) {
			stats.root = expectedRoot;
			changed = true;
		}
		const before = isRecord(stats.before) ? stats.before : {};
		const beforeSha = typeof before.sha === "string" ? before.sha.trim() : "";
		const expectedSha = typeof after.sha === "string" ? after.sha.trim() : "";
		const actualSha = commit?.trim() ?? "";
		const verifiesGitRevision = stats.mode !== "git" || expectedSha.length > 0 && gitCommitPrefixesMatch(expectedSha, actualSha);
		const verifiesInstallRoot = expectedRoot !== null && actualRoot !== null && expectedRoot === actualRoot;
		const changedInstall = stats.mode !== "git" || beforeSha.length > 0 && expectedSha.length > 0 && !gitCommitPrefixesMatch(beforeSha, expectedSha);
		if (payload.status === "ok" && expectedRoot && !verifiesInstallRoot) {
			payload.status = "error";
			stats.reason = actualRoot ? "restart-root-mismatch" : "restart-root-unavailable";
			delete payload.continuation;
			changed = true;
		} else if (payload.status === "ok" && stats.mode === "git" && expectedSha && !verifiesGitRevision) {
			payload.status = "error";
			stats.reason = actualSha ? "restart-revision-mismatch" : "restart-revision-unavailable";
			delete payload.continuation;
			changed = true;
		}
		stats.after = after;
		payload.stats = stats;
		const finalized = changed ? writeRestartSentinelRowIfRevisionSync(db, payload, current.sentinel.revision) : current.sentinel;
		if (!finalized) return null;
		if (stats.mode === "git" && verifiesInstallRoot && verifiesGitRevision && changedInstall) writeUpdateInstallReceiptRowSync(db, payload);
		return changed ? finalized : null;
	})
};
//#endregion
export { restartSentinelOperations };
