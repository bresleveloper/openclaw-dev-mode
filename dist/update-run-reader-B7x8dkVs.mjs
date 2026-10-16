import { a as getNodeSqliteKysely, o as iterateSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { c as runSqlitePinnedReadSnapshotSync, n as getAdmittedSqliteSchemaFacts, o as runSqliteReadOperationSync, t as admitSqliteSchema } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { i as SqliteCoordinatorError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { t as assertTransactionUsable } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { c as getOpenClawDatabaseMaintenanceResourceScope, l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { S as retainOpenClawStateDatabaseForIndependentRead, _ as registerOpenClawStateDatabaseAsyncResource, f as openClawStateDatabaseCache, n as captureOpenClawStateDatabaseReadAdmission, y as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { a as isExistingOpenClawStateSchema } from "./openclaw-state-db-schema-policy-BxAJZRG6.mjs";
import { a as readCurrentOpenClawStateDatabaseContentVersion, g as canReadWarmNativeSourceIndependently, l as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, o as withArtifactPreservingStateReads, s as withCurrentOpenClawStateReadScope, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as openOpenClawStateReadConnection, t as assertStateReadSchema } from "./openclaw-state-db-read-connection-C62_-Nv8.mjs";
import { r as isAcknowledgedAbandonedUpdateRun } from "./update-run-record-Cu3LgwJt.mjs";
import { c as readUpdateRunRecord, i as readActiveUpdateRun, n as decodeRun, u as readUpdateRuns } from "./update-run-read.kernel-D2osBKAZ.mjs";
//#region src/state/openclaw-state-db-current-reader.ts
/** Mutating maintenance can retain an independent current reader under its exact source lifetime. */
function createOpenClawStateCurrentWarmReader(operation, options, openStateSchemaReadAdmission) {
	let bound;
	return () => {
		return withCurrentOpenClawStateReadScope(options, (pathname) => {
			const scope = getOpenClawDatabaseMaintenanceScope();
			if (!scope?.ownsSchemaMaintenance || bound && bound.scope !== scope) return { available: false };
			if (bound && bound.path !== pathname) throw new Error("Current shared-state reader cannot change its database before cleanup");
			if (!bound) {
				const native = openClawStateDatabaseCache.getCachedOpenClawStateDatabase(pathname, { readOnly: true });
				if (!native?.db.isOpen) return { available: false };
				const sourceScope = getOpenClawDatabaseMaintenanceResourceScope(native.db);
				if (sourceScope && sourceScope !== scope) return { available: false };
				const identity = requireOpenClawStateDatabaseIdentity(native);
				if (!canReadWarmNativeSourceIndependently(native, pathname, identity.key)) return { available: false };
				const admission = captureOpenClawStateDatabaseReadAdmission(pathname);
				const retained = retainOpenClawStateDatabaseForIndependentRead(pathname, "cached-read");
				if (!retained) return { available: false };
				let connection;
				try {
					connection = openOpenClawStateReadConnection(pathname, pathname, identity.key);
				} catch (error) {
					try {
						retained.release();
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
					retained.assertCurrent();
					assertExistingDatabaseIdentity(pathname, identity.key);
					openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, options.env ?? process.env);
				};
				const reader = {
					path: pathname,
					scope,
					read() {
						assertCurrent();
						const result = runOpenClawStateCurrentReadConnection(connection, operation, openStateSchemaReadAdmission);
						assertCurrent();
						retained.observe();
						return result;
					}
				};
				const resource = { async close(closingIdentity) {
					if (!active || closingIdentity && closingIdentity.key !== identity.key && closingIdentity.canonicalPath !== identity.canonicalPath) return;
					connection.close();
					retained.release();
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
const currentReaderSchemaAdmissions = /* @__PURE__ */ new WeakMap();
/** An independent current reader keeps composite policy rows in one bounded snapshot. */
function runOpenClawStateCurrentReadConnection(connection, operation, openStateSchemaReadAdmission) {
	const { db, path: pathname } = connection.database;
	let closeAdmission;
	const errors = [];
	let result;
	try {
		const previous = currentReaderSchemaAdmissions.get(db);
		const facts = previous && !previous.legacyAdmission ? getAdmittedSqliteSchemaFacts(db) : void 0;
		if (!previous || previous.admission !== openStateSchemaReadAdmission || previous.legacyAdmission || previous.facts !== facts) closeAdmission = openStateSchemaReadAdmission?.(db);
		const existingSchema = isExistingOpenClawStateSchema(pathname, db);
		const admit = () => {
			const current = getAdmittedSqliteSchemaFacts(db);
			const accepted = currentReaderSchemaAdmissions.get(db);
			if (!current || accepted?.facts !== current || accepted.existingSchema !== existingSchema || accepted.admission !== openStateSchemaReadAdmission) {
				assertStateReadSchema(db, pathname);
				admitSqliteSchema(db);
				const admitted = getAdmittedSqliteSchemaFacts(db);
				if (!admitted) throw new Error("Current shared-state reader could not retain schema admission");
				currentReaderSchemaAdmissions.set(db, {
					facts: admitted,
					existingSchema,
					admission: openStateSchemaReadAdmission,
					legacyAdmission: closeAdmission !== void 0
				});
			}
		};
		runSqliteReadOperationSync(db, admit);
		result = runSqlitePinnedReadSnapshotSync(db, () => {
			const value = operation(connection.database);
			if (isPromiseLike(value)) throw new SqliteCoordinatorError("SQLite current-authority read must remain synchronous");
			return value;
		});
		runSqliteReadOperationSync(db, admit);
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
	if (!reply.ok || reply.type !== "updateRuns.get") throw new Error("Unexpected update run lookup result");
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
	const reply = await withArtifactPreservingStateReads(() => executeExistingOpenClawStateRead(options, { type: "updateRuns.status" }, { preferIndependentWarmRead: true }));
	if (!reply) return {};
	if (!reply.ok || reply.type !== "updateRuns.status") throw new Error("Unexpected update run status result");
	return reply.status;
}
async function getUpdateRunHistoryStatusAsync(options = {}) {
	const reply = await withArtifactPreservingStateReads(() => executeExistingOpenClawStateRead(options, { type: "updateRuns.historyStatus" }, { preferIndependentWarmRead: true }));
	if (!reply) return {};
	if (!reply.ok || reply.type !== "updateRuns.historyStatus") throw new Error("Unexpected update run history status result");
	return reply.status;
}
/** Doctor retains its maintenance owner while the worker reads the private snapshot. */
async function listUpdateRunsAsync(input = {}, options = {}) {
	const reply = await withArtifactPreservingStateReads(() => executeExistingOpenClawStateRead(options, {
		type: "updateRuns.list",
		input: { ...input }
	}, { preferIndependentWarmRead: true }));
	if (!reply) return [];
	if (!reply.ok || reply.type !== "updateRuns.list") throw new Error("Unexpected update run list result");
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
