import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { a as resolveOpenClawStateDirForDatabasePath, s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-dG8swyHC.mjs";
import { a as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { i as readOpenClawAgentDatabaseIdentity, r as isOpenClawAgentDatabasePathCurrent } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import "./openclaw-agent-db-CaQAStOA.mjs";
import { i as getOpenClawAgentDatabaseValidation, l as markOpenClawAgentCanonicalValidation, o as hasOpenClawAgentCanonicalValidation } from "./openclaw-agent-db-validation-cache-BQ1Mko2o.mjs";
import { t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { h as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { r as hasPendingCanonicalSessionValidation } from "./session-canonical-validation-DxuYA6hL.mjs";
import { c as withSqliteMutationWorkerLifetime } from "./session-accessor.sqlite-archive-DRWDbZcu.mjs";
import { a as withSqliteReclamationAuthorization } from "./session-accessor.sqlite-reclamation-commit-DdiLAbAH.mjs";
import { r as withSqliteReclamationWorker } from "./session-accessor.sqlite-reclamation-worker-CLuHKRTt.mjs";
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
			try {
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
							}, "session.canonical-validation.certify", { reclamationAdmission }, "worker")
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
			} finally {
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
