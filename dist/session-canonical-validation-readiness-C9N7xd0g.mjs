import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { c as resolveOpenClawStateSqlitePath, o as resolveOpenClawStateDirForDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CO5zyEkR.mjs";
import "./session-key-CSDERtm3.mjs";
import { a as readOpenClawAgentDatabaseIdentity, i as isOpenClawAgentDatabasePathCurrent } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { c as getOpenClawAgentDatabaseValidation, g as markOpenClawAgentCanonicalValidation, u as hasOpenClawAgentCanonicalValidation, x as loadOpenClawAgentCanonicalValidationReceipt } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import "./openclaw-agent-db-_fC-kf1x.mjs";
import { l as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { f as withSqliteMutationWorkerLifetime } from "./session-accessor.sqlite-archive-C60vk-we.mjs";
import { n as withSqliteReclamationWorker } from "./session-accessor.sqlite-reclamation-worker-CpDhxTpI.mjs";
import { n as hasPendingCanonicalSessionValidation } from "./session-canonical-validation-YRdOORAf.mjs";
import { setTimeout } from "node:timers/promises";
//#region src/config/sessions/session-canonical-validation-readiness.ts
const MAX_BATCH_ROWS = 128;
const MAX_BATCH_BYTES = 1048576;
const CONTENTION_BACKOFF_MS = [
	0,
	25,
	100,
	250
];
const log = createSubsystemLogger("sessions/canonical-validation");
const runtimeDrains = /* @__PURE__ */ new Map();
/** Startup and Doctor certify pending rows through their retained database owner. */
async function certifySessionCanonicalValidationPending(options, withWorker = withSqliteReclamationWorker, assertCurrentOwner) {
	const assertOwnerCurrent = () => assertCurrentOwner?.();
	assertOwnerCurrent();
	const sourceEnv = options.env ?? process.env;
	const pathname = resolveOpenClawAgentSqlitePath(options);
	if (isIncognitoOpenClawAgentSqlitePath(pathname, options)) return;
	const native = retainOpenClawAgentDatabaseReadOnly(options);
	if (!native.found) return;
	const { database, claim } = native;
	const validationOwner = {
		database,
		isCurrent: claim.isCurrent
	};
	const drainKey = readOpenClawAgentDatabaseIdentity(database).incarnation;
	let oversizedRows = 0;
	try {
		const readiness = runSqliteReadOperationSync(database.db, () => {
			loadOpenClawAgentCanonicalValidationReceipt(database);
			const initialize = !hasOpenClawAgentCanonicalValidation(database);
			return {
				initialize,
				hasWork: initialize || hasPendingCanonicalSessionValidation(database)
			};
		});
		if (!readiness.hasWork) return;
		let initializeCanonicalValidation = readiness.initialize;
		const databaseOptions = {
			agentId: normalizeAgentId(options.agentId),
			path: readOpenClawAgentDatabaseIdentity(database).filename,
			env: {
				OPENCLAW_STATE_DIR: resolveOpenClawStateDirForDatabasePath(options.database?.path ?? resolveOpenClawStateSqlitePath(sourceEnv)),
				...isGatewayExternallySupervised(sourceEnv) ? { OPENCLAW_SUPERVISOR_MODE: "external" } : {}
			}
		};
		return await withSqliteMutationWorkerLifetime(databaseOptions, async ({ assertCurrent: assertReadinessCurrent }) => {
			const shareRuntimeDrain = withWorker === withSqliteReclamationWorker && assertCurrentOwner === void 0;
			const drain = async () => {
				let contendedBatches = 0;
				while (true) {
					assertOwnerCurrent();
					assertReadinessCurrent();
					claim.assertCurrent();
					const result = await withSqliteMutationWorkerLifetime(databaseOptions, async ({ assertCurrent, signal }) => await withWorker(databaseOptions, claim, async (worker) => {
						const assertCommitAllowed = () => {
							assertOwnerCurrent();
							assertReadinessCurrent();
							assertCurrent();
							worker.assertCurrent(databaseOptions, claim);
						};
						assertCommitAllowed();
						return await worker.runCanonicalValidation({
							databaseOptions,
							claim,
							validationOwner,
							maxRows: MAX_BATCH_ROWS,
							maxBytes: MAX_BATCH_BYTES,
							initializeCanonicalValidation,
							withWriteAdmission: async (run, reclamationAdmission) => await runExclusiveSqliteSessionWrite(databaseOptions, async () => {
								let refusal;
								try {
									assertCommitAllowed();
								} catch (error) {
									refusal = { error };
								}
								await run(refusal);
							}, "session.canonical-validation.certify", { reclamationAdmission }, "worker", signal)
						});
					}, () => {
						assertOwnerCurrent();
						assertReadinessCurrent();
						assertCurrent();
						claim.assertCurrent();
					}, signal));
					assertOwnerCurrent();
					assertReadinessCurrent();
					claim.assertCurrent();
					if (!getOpenClawAgentDatabaseValidation(database)) throw new Error("SQLite session reclamation database owner is no longer current");
					oversizedRows += result.oversizedRows;
					if (!result.hasMore) {
						if (!isOpenClawAgentDatabasePathCurrent(database) || !markOpenClawAgentCanonicalValidation(database)) throw new Error("SQLite session reclamation database owner is no longer current");
						return;
					}
					if (initializeCanonicalValidation) {
						initializeCanonicalValidation = false;
						continue;
					}
					if (result.certifiedRows === 0) {
						const waitMs = CONTENTION_BACKOFF_MS[contendedBatches] ?? 250;
						contendedBatches = Math.min(contendedBatches + 1, CONTENTION_BACKOFF_MS.length - 1);
						await setTimeout(waitMs);
					} else contendedBatches = 0;
				}
			};
			let completion;
			let ownsDrain = false;
			try {
				assertOwnerCurrent();
				assertReadinessCurrent();
				claim.assertCurrent();
				completion = shareRuntimeDrain ? runtimeDrains.get(drainKey) : void 0;
				ownsDrain = completion === void 0;
				if (!completion) {
					completion = drain();
					if (shareRuntimeDrain) runtimeDrains.set(drainKey, completion);
				}
				await completion;
				assertOwnerCurrent();
				assertReadinessCurrent();
				claim.assertCurrent();
				if (!isOpenClawAgentDatabasePathCurrent(database) || !hasOpenClawAgentCanonicalValidation(database)) throw new Error("SQLite session reclamation database owner is no longer current");
			} finally {
				if (ownsDrain && runtimeDrains.get(drainKey) === completion) runtimeDrains.delete(drainKey);
			}
		});
	} finally {
		claim.release();
		if (oversizedRows > 0) log.warn("Canonical session validation processed oversized rows in its Worker", {
			path: pathname,
			rows: oversizedRows,
			batchByteLimit: MAX_BATCH_BYTES
		});
	}
}
//#endregion
export { certifySessionCanonicalValidationPending };
