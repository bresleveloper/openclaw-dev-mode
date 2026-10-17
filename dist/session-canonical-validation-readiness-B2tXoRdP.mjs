import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { c as resolveOpenClawStateSqlitePath, o as resolveOpenClawStateDirForDatabasePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CUdBruRD.mjs";
import { _ as isOpenClawAgentDatabasePathCurrent, i as getOpenClawAgentDatabaseValidation, o as hasOpenClawAgentCanonicalValidation, u as markOpenClawAgentCanonicalValidation, v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import "./openclaw-agent-db-DBug3LUA.mjs";
import { t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { p as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as hasPendingCanonicalSessionValidation } from "./session-canonical-validation-RtyogOdc.mjs";
import { d as withSqliteMutationWorkerLifetime } from "./session-accessor.sqlite-archive-B_Nn5x_K.mjs";
import { a as withSqliteReclamationAuthorization } from "./session-accessor.sqlite-reclamation-commit-CC945S9j.mjs";
import { n as withSqliteReclamationWorker } from "./session-accessor.sqlite-reclamation-worker-C2YCwGPg.mjs";
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
const runtimeDrains = /* @__PURE__ */ new WeakMap();
/** Certify dirty persisted rows before startup maintenance reads their full entries. */
async function certifySessionCanonicalValidationPending(options, withWorker = withSqliteReclamationWorker, assertCurrentOwner) {
	assertCurrentOwner?.();
	const sourceEnv = options.env ?? process.env;
	const pathname = resolveOpenClawAgentSqlitePath(options);
	if (isIncognitoOpenClawAgentSqlitePath(pathname, options)) return;
	const retained = retainOpenClawAgentDatabaseReadOnly(options);
	if (!retained.found) return;
	const { database, claim } = retained;
	let oversizedRows = 0;
	try {
		let initializeCanonicalValidation = !hasOpenClawAgentCanonicalValidation(database);
		if (!initializeCanonicalValidation && !hasPendingCanonicalSessionValidation(database)) return;
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
				let validation = getOpenClawAgentDatabaseValidation(database);
				while (true) {
					assertCurrentOwner?.();
					assertReadinessCurrent();
					claim.assertCurrent();
					const result = await withSqliteMutationWorkerLifetime(databaseOptions, async ({ assertCurrent, commitGate, signal }) => await withWorker(databaseOptions, claim, async (worker) => {
						const assertCommitAllowed = () => {
							assertCurrentOwner?.();
							assertReadinessCurrent();
							assertCurrent();
							worker.assertCurrent(databaseOptions, claim);
						};
						assertCommitAllowed();
						return await withSqliteReclamationAuthorization(commitGate, database.db, assertCommitAllowed, (authorize) => worker.runCanonicalValidation({
							databaseOptions,
							claim,
							validationOwner: {
								database,
								isCurrent: claim.isCurrent
							},
							commitGate,
							maxRows: MAX_BATCH_ROWS,
							maxBytes: MAX_BATCH_BYTES,
							initializeCanonicalValidation,
							onCommitRequest: authorize,
							withWriteAdmission: async (run, reclamationAdmission) => await runExclusiveSqliteSessionWrite(databaseOptions, async () => {
								let refusal;
								try {
									assertCommitAllowed();
								} catch (error) {
									refusal = { error };
								}
								await run(refusal);
							}, "session.canonical-validation.certify", { reclamationAdmission }, "worker", signal)
						}));
					}, () => {
						assertCurrentOwner?.();
						assertReadinessCurrent();
						assertCurrent();
						claim.assertCurrent();
					}, signal));
					assertCurrentOwner?.();
					assertReadinessCurrent();
					claim.assertCurrent();
					const currentValidation = getOpenClawAgentDatabaseValidation(database);
					if (!currentValidation || validation && validation !== currentValidation) throw new Error("SQLite session reclamation database owner is no longer current");
					validation ??= currentValidation;
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
				assertCurrentOwner?.();
				assertReadinessCurrent();
				claim.assertCurrent();
				completion = shareRuntimeDrain ? runtimeDrains.get(database.db) : void 0;
				ownsDrain = completion === void 0;
				if (!completion) {
					completion = drain();
					if (shareRuntimeDrain) runtimeDrains.set(database.db, completion);
				}
				await completion;
				assertCurrentOwner?.();
				assertReadinessCurrent();
				claim.assertCurrent();
				if (!isOpenClawAgentDatabasePathCurrent(database) || !hasOpenClawAgentCanonicalValidation(database)) throw new Error("SQLite session reclamation database owner is no longer current");
			} finally {
				if (ownsDrain && runtimeDrains.get(database.db) === completion) runtimeDrains.delete(database.db);
				claim.release();
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
