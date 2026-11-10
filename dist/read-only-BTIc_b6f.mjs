import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as getChildLogger } from "./logger-DR3u4tgD.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { a as ensureSqliteLibrarySelected } from "./bun-sqlite-library-CYR1RYZS.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { d as retainSnapshotWork, l as removeTempDirectoryAsync, t as SqliteSnapshotCleanupError, u as retainSnapshotTempDirectory } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { r as captureOpenClawStateDatabaseReadAdmission, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { n as createSqliteSnapshotStagingDirectory } from "./sqlite-snapshot-staging-B4VrWJSe.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as restoreCronLoadError } from "./load-error-CO2Pg-SG.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import fs from "node:fs";
//#region src/cron/store/read-only.ts
function emptyLoadedCronStore() {
	return {
		store: {
			version: 1,
			jobs: []
		},
		configJobs: [],
		configJobIndexes: [],
		configJobRuntimeEntries: [],
		invalidConfigRows: []
	};
}
/** Loads cron jobs from existing SQLite state without creating or migrating it. */
async function loadCronJobsStoreWithConfigJobsReadOnly(storePath, env = process.env) {
	return (await readCronState({
		storeKey: cronStoreKey(storePath),
		env
	})).loaded ?? emptyLoadedCronStore();
}
/** Doctor inventory includes raw definitions in every persisted partition. */
async function inspectCronJobsReadOnly(env) {
	return (await readCronState({ env })).inventory ?? [];
}
async function readCronState({ storeKey, env, history }) {
	const statePath = resolveOpenClawStateSqlitePath(env);
	if (!fs.existsSync(statePath)) return { ok: true };
	const preserveArtifacts = storeKey === void 0 || isArtifactPreservingStateRead();
	const admission = captureOpenClawStateDatabaseReadAdmission(statePath);
	const identity = admission.identity;
	const canonicalPath = identity.canonicalPath;
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	ensureSqliteLibrarySelected();
	const environment = { ...process.env };
	const environmentBytes = Object.entries(environment).reduce((bytes, [key, value]) => bytes + Buffer.byteLength(key) + Buffer.byteLength(value ?? ""), 0);
	const pool = new WorkerTaskPool({
		workerUrl: resolveRuntimeProcessEntrypointUrl("cronReadOnly"),
		workerOptions: { env: environment },
		workerClass: "singleton",
		sharedCompute: true
	});
	const controller = new AbortController();
	const producerSettled = createDeferredCore();
	let stagingRoot;
	let releaseSnapshot;
	let workerStopped = false;
	let readSucceeded = false;
	let cleaned = false;
	let cleanupPending;
	const cleanup = () => {
		if (cleaned) return Promise.resolve();
		return cleanupPending ??= (async () => {
			if (!workerStopped) {
				await pool.close();
				workerStopped = true;
			}
			await producerSettled.promise;
			releaseSnapshot?.();
			releaseSnapshot = void 0;
			if (stagingRoot) {
				let cause;
				if (!await removeTempDirectoryAsync(stagingRoot, (error) => cause = error)) {
					const error = new SqliteSnapshotCleanupError("Cron read-only state snapshot cleanup failed.", { cause });
					if (!readSucceeded) throw error;
					try {
						getChildLogger({ subsystem: "cron" }).warn({
							path: stagingRoot,
							error: String(cause)
						}, "Cron read-only snapshot cleanup deferred; the read completed successfully.");
					} catch {}
				}
				stagingRoot = void 0;
			}
			cleaned = true;
			unregister();
		})().finally(() => {
			cleanupPending = void 0;
		});
	};
	const resource = { async close(target) {
		if (!target || target.key === identity?.key || target.canonicalPath === canonicalPath) {
			controller.abort(/* @__PURE__ */ new Error("Cron read-only load closed"));
			await cleanup();
		}
	} };
	const unregister = registerOpenClawStateDatabaseAsyncResource(resource);
	const run = async () => {
		let loaded = { ok: true };
		const failures = [];
		try {
			maintenance?.own(resource, "shared-resources", () => resource.close());
			if (preserveArtifacts) {
				stagingRoot = await createSqliteSnapshotStagingDirectory(void 0, false, controller.signal, true);
				releaseSnapshot = retainSnapshotTempDirectory(stagingRoot);
			}
			const location = statePath;
			controller.signal.throwIfAborted();
			admission.assertCurrent();
			const result = await pool.run({
				location,
				storeKey,
				history,
				stagingRoot
			}, {
				signal: controller.signal,
				inputBytes: Buffer.byteLength(location) + Buffer.byteLength(storeKey ?? "") + Buffer.byteLength(history?.jobId ?? "") + Buffer.byteLength(history?.transcript?.runId ?? "") + (history?.transcript?.runAtMs === void 0 ? 0 : 8) + Buffer.byteLength(stagingRoot ?? "") + environmentBytes
			});
			if (!result.ok) throw restoreCronLoadError(result.error);
			loaded = result;
			readSucceeded = true;
		} catch (error) {
			failures.push(error);
		} finally {
			producerSettled.resolve();
			try {
				await cleanup();
			} catch (error) {
				failures.push(error);
			}
		}
		throwSqliteLifecycleErrors(failures, "Cron read-only state inspection and cleanup failed.");
		controller.signal.throwIfAborted();
		admission.assertCurrent();
		return loaded;
	};
	return await retainSnapshotWork(run(), () => controller.abort(/* @__PURE__ */ new Error("Cron read-only load closed")));
}
async function readCronRunRecords(storeKey, jobId) {
	return (await readCronState({
		storeKey: cronStoreKey(storeKey),
		env: process.env,
		history: { jobId }
	})).history ?? [];
}
async function readCronRunHistoryBinding(storeKey, jobId, transcript) {
	return (await readCronState({
		storeKey: cronStoreKey(storeKey),
		env: process.env,
		history: {
			jobId,
			transcript
		}
	})).binding;
}
//#endregion
export { readCronRunRecords as i, loadCronJobsStoreWithConfigJobsReadOnly as n, readCronRunHistoryBinding as r, inspectCronJobsReadOnly as t };
