import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { i as SqliteCoordinatorError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { c as getOpenClawDatabaseMaintenanceResourceScope, l as getOpenClawDatabaseMaintenanceScope, o as allowsMaintenanceLiveAuthorityReads } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { o as getNodeSqliteKysely, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { m as openClawStateDatabaseCache, r as captureOpenClawStateDatabaseReadAdmission, w as retainOpenClawStateDatabaseForIndependentRead, x as requireOpenClawStateDatabaseIdentity, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { o as runSqliteReadSnapshotSync, t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as requireNativeDatabaseFile } from "./physical-facts-Cvtfrs3r.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { n as admitStateSchemaFacts } from "./openclaw-state-db-schema-version-CcCTuttF.mjs";
import { a as withCurrentOpenClawStateReadScope, i as readCurrentOpenClawStateDatabaseContentVersion, m as canReadWarmNativeSourceIndependently, s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as isStatePostgres } from "./openclaw-state-db-engine-DST3Q_pv.mjs";
import { n as openOpenClawStateReadConnection, t as assertStateReadSchema } from "./openclaw-state-db-read-connection-D53a_-IZ.mjs";
import { r as isAcknowledgedAbandonedUpdateRun } from "./update-run-record-Chv9kKnY.mjs";
import { c as readUpdateRunRecord, i as readActiveUpdateRun, n as decodeRun, u as readUpdateRuns } from "./update-run-read.kernel-C7evz-Ne.mjs";
//#region src/state/openclaw-state-db-current-reader.ts
/** Mutating maintenance can retain an independent current reader under its exact source lifetime. */
function createOpenClawStateCurrentWarmReader(operation, options, openStateSchemaReadAdmission) {
	let bound;
	return () => {
		return withCurrentOpenClawStateReadScope(options, (pathname) => {
			const scope = getOpenClawDatabaseMaintenanceScope();
			if (!scope?.ownsSchemaMaintenance || bound && bound.scope !== scope) return { available: false };
			if (isStatePostgres()) requireNativeDatabaseFile("postgres", "repair");
			if (bound && bound.path !== pathname) throw new Error("Current shared-state reader cannot change its database before cleanup");
			if (!bound) {
				const native = openClawStateDatabaseCache.getCachedOpenClawStateDatabase(pathname, { readOnly: true });
				const liveSource = allowsMaintenanceLiveAuthorityReads(scope, pathname);
				if (!native?.db.isOpen && !liveSource) return { available: false };
				const sourceScope = native && getOpenClawDatabaseMaintenanceResourceScope(native.db);
				if (sourceScope && sourceScope !== scope) return { available: false };
				const admission = captureOpenClawStateDatabaseReadAdmission(pathname);
				const identity = native ? requireOpenClawStateDatabaseIdentity(native) : admission.identity;
				if (!identity.key.startsWith("file:") || native && !canReadWarmNativeSourceIndependently(native, pathname, identity.key)) return { available: false };
				const retained = native ? retainOpenClawStateDatabaseForIndependentRead(pathname, "cached-read") : void 0;
				if (native && !retained) return { available: false };
				let connection;
				try {
					connection = openOpenClawStateReadConnection(pathname, pathname, identity.key);
				} catch (error) {
					try {
						retained?.release();
					} catch (cleanupError) {
						throwSqliteLifecycleErrors([error, cleanupError], "Current shared-state reader open and cleanup failed.");
					}
					throw error;
				}
				let active = true;
				let unregister = () => {};
				const assertCurrent = () => {
					if (!active) throw new Error("Current shared-state reader is closed");
					scope?.assertReadAdmission();
					admission.assertCurrent();
					retained?.assertCurrent();
					assertExistingDatabaseIdentity(pathname, identity.key);
					openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, options.env ?? process.env);
				};
				const reader = {
					path: pathname,
					scope,
					read() {
						assertCurrent();
						const result = runOpenClawStateCurrentReadConnection(connection, operation, openStateSchemaReadAdmission);
						retained?.observe();
						return result;
					}
				};
				const resource = { async close(closingIdentity) {
					if (!active || closingIdentity && closingIdentity.key !== identity.key && closingIdentity.canonicalPath !== identity.canonicalPath) return;
					connection.close();
					retained?.release();
					active = false;
					if (bound === reader) bound = void 0;
					unregister();
				} };
				unregister = registerOpenClawStateDatabaseAsyncResource(resource);
				scope?.own(resource, "shared-resources", () => resource.close());
				bound = reader;
			}
			return {
				available: true,
				value: bound.read()
			};
		});
	};
}
/** An independent current reader keeps composite policy rows in one bounded snapshot. */
function runOpenClawStateCurrentReadConnection(connection, operation, openStateSchemaReadAdmission) {
	const { db, path: pathname } = connection.database;
	let closeAdmission;
	const errors = [];
	let result;
	try {
		if (isPostgresSqlConnection(db)) requireNativeDatabaseFile("postgres", "repair");
		closeAdmission = openStateSchemaReadAdmission?.(db);
		runSqliteReadOperationSync(db, () => {
			admitStateSchemaFacts(db, pathname);
			assertStateReadSchema(db, pathname);
		});
		result = runSqliteReadSnapshotSync(db, () => {
			const value = operation(connection.database);
			if (isPromiseLike(value)) throw new SqliteCoordinatorError("SQLite current-authority read must remain synchronous");
			return value;
		});
	} catch (error) {
		errors.push(error);
	}
	try {
		closeAdmission?.();
	} catch (error) {
		errors.push(error);
	}
	try {
		assertTransactionUsable(db);
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Current shared-state read and schema cleanup failed.");
	return result;
}
//#endregion
//#region src/infra/update-run-reader.ts
function getUpdateRun(runId, options = {}) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => tableExists(db, "update_runs") ? readUpdateRunRecord(db, runId) : void 0, options);
}
function findActiveUpdateRun(options = {}) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => readActiveUpdateRun(db), options);
}
/** Previews and acknowledged abandonment cannot replace failure or completion evidence. */
function readUpdateRunResolutionHistory(options = {}) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => {
		if (!tableExists(db, "update_runs")) return {};
		const latest = (failedOnly) => {
			const query = getNodeSqliteKysely(db).selectFrom("update_runs").selectAll().where("status", failedOnly ? "=" : "!=", failedOnly ? "failed" : "skipped").orderBy("created_at_ms", "desc").orderBy("run_id", "desc");
			for (const row of iterateSqliteQuerySync(db, query)) {
				const run = decodeRun(row);
				if (!isAcknowledgedAbandonedUpdateRun(run)) return run;
			}
		};
		return {
			failure: latest(true),
			outcome: latest(false)
		};
	}, options) ?? {};
}
async function getUpdateRunAsync(runId, options = {}) {
	return await withArtifactPreservingStateReads(() => readUpdateRunAsync(runId, options, { preferIndependentWarmRead: true }));
}
/** The active updater already writes this ledger, so SQLite sidecars need no private copy.
* Canonical state closure drains the retained worker before database replacement.
*/
function getUpdateRunForProgressAsync(runId, options = {}, signal) {
	return readUpdateRunAsync(runId, options, {
		live: true,
		signal
	});
}
async function readUpdateRunAsync(runId, options, readOptions) {
	const reply = await executeExistingOpenClawStateRead(options, {
		type: "updateRuns.get",
		runId
	}, readOptions);
	if (!reply) return;
	return reply.run;
}
function listUpdateRuns(input = {}, options = {}, openStateSchemaReadAdmission) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => readUpdateRuns(db, input), options, openStateSchemaReadAdmission) ?? [];
}
/** Read current rows on an independent warm owner; cold reads preserve every source byte.
* The caller still evaluates admission on every invocation; no grant is cached.
*/
function createUpdateRunAdmissionReader(input, options, openStateSchemaReadAdmission) {
	const query = { ...input };
	const readWarm = createOpenClawStateCurrentWarmReader(({ db }) => readUpdateRuns(db, query), options, openStateSchemaReadAdmission);
	let previous;
	return () => {
		const warm = readWarm();
		if (warm.available) {
			previous = void 0;
			return warm.value;
		}
		const version = readCurrentOpenClawStateDatabaseContentVersion(options);
		if (version !== void 0 && previous?.version === version) return structuredClone(previous.runs);
		previous = void 0;
		const runs = listUpdateRuns(query, options, openStateSchemaReadAdmission);
		if (version !== void 0 && version === readCurrentOpenClawStateDatabaseContentVersion(options)) previous = {
			version,
			runs: structuredClone(runs)
		};
		return runs;
	};
}
/** Keep the fixed status projection in one read-worker snapshot. */
async function getUpdateRunStatusAsync(options = {}) {
	return readUpdateRunStatusAsync("updateRuns.status", options);
}
async function getUpdateRunHistoryStatusAsync(options = {}) {
	return readUpdateRunStatusAsync("updateRuns.historyStatus", options);
}
async function readUpdateRunStatusAsync(type, options) {
	const reply = await withArtifactPreservingStateReads(() => executeExistingOpenClawStateRead(options, { type }, { preferIndependentWarmRead: true }));
	if (!reply) return {};
	return reply.status;
}
/** Doctor retains its maintenance owner while the worker reads the private snapshot. */
async function listUpdateRunsAsync(input = {}, options = {}) {
	const reply = await withArtifactPreservingStateReads(() => executeExistingOpenClawStateRead(options, {
		type: "updateRuns.list",
		input: { ...input }
	}, { preferIndependentWarmRead: true }));
	if (!reply) return [];
	return reply.runs;
}
/** Only a later recorded fetch completion clears an updater fetch failure. */
function getLatestUpdateFetchFailure(options = {}) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => {
		if (!tableExists(db, "update_runs")) return;
		const query = getNodeSqliteKysely(db).selectFrom("update_runs").selectAll().orderBy("created_at_ms", "desc").orderBy("run_id", "desc");
		let latestAtMs = -Infinity;
		let latestFailure;
		for (const row of iterateSqliteQuerySync(db, query)) {
			const run = decodeRun(row);
			const fetchSteps = run.steps.filter(({ step }) => /^git (?:fetch(?:\s|$)|target inspection fetch$)/u.test(step) || step === "git import admitted target");
			const failed = fetchSteps.findLast((step) => step.status === "failed");
			if (run.reason === "fetch-failed" || failed) {
				const failedAtMs = failed?.endedAtMs ?? run.finishedAtMs ?? run.updatedAtMs;
				if (failedAtMs < latestAtMs) continue;
				const detail = failed?.detail ?? "";
				latestAtMs = failedAtMs;
				latestFailure = {
					reason: "fetch-failed",
					failedAtMs,
					detail: /would clobber existing tag/iu.test(detail) ? "tag conflict" : /authentication|permission denied|could not read Username|access denied/iu.test(detail) ? "authentication failed" : /resolve host|network|timed? out|timeout|unreachable/iu.test(detail) ? "network error" : "fetch-failed",
					runId: run.runId
				};
			} else for (const step of fetchSteps) {
				if (step.status !== "completed" || step.endedAtMs === void 0) continue;
				const completedAtMs = step.endedAtMs;
				if (completedAtMs > latestAtMs) {
					latestAtMs = completedAtMs;
					latestFailure = void 0;
				}
			}
		}
		return latestFailure;
	}, options);
}
//#endregion
export { getUpdateRunAsync as a, getUpdateRunStatusAsync as c, readUpdateRunResolutionHistory as d, getUpdateRun as i, listUpdateRuns as l, findActiveUpdateRun as n, getUpdateRunForProgressAsync as o, getLatestUpdateFetchFailure as r, getUpdateRunHistoryStatusAsync as s, createUpdateRunAdmissionReader as t, listUpdateRunsAsync as u };
