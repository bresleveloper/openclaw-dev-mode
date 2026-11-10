import { E as readSqliteDatabaseScopedWriteToken, G as sqliteSessionIdWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { o as runSqliteReadSnapshotSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { Ct as createHarnessCompletionInputPredicate } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { i as encodeSessionTranscriptWorkerError } from "./session-history-worker-errors-D75quOgT.mjs";
import { o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { c as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { i as readCurrentProjectionSnapshot } from "./session-accessor.sqlite-projection-read-3DYCwfDO.mjs";
import { t as everySessionTranscriptUserInputFrom } from "./session-accessor.sqlite-active-events-CqOkO0QM.mjs";
//#region src/config/sessions/session-harness-completion-source.kernel.ts
/** Exact source lookup is independent of the display tail used to choose recovery policy. */
function readAdmittedHarnessCompletionInputFromSqlite(params) {
	const scope = {
		agentId: params.claim.requesterAgentId,
		sessionKey: params.claim.requesterSessionKey,
		sessionId: params.entry.sessionId,
		storePath: params.storePath
	};
	return everySessionTranscriptUserInputFrom(scope, `${params.claim.sourceRunId}:user`, createHarnessCompletionInputPredicate(params), params.projection);
}
/** Entry, source input and context version share the admitted reader's SQLite snapshot. */
function readHarnessCompletionSourceInDatabase(database, claim, mode = "admission") {
	return runSqliteReadSnapshotSync(database.db, () => {
		const writeToken = readSqliteDatabaseScopedWriteToken(database.db, [claim.requesterSessionKey, sqliteSessionIdWriteScope(claim.sessionId)]);
		const entry = readExactSessionEntryRow(database, claim.requesterSessionKey, "full", "canonical")?.entry;
		if (!entry || mode === "admission" && entry.restartRecoveryDeliveryRunId === claim.sourceRunId) return {
			entry,
			validInput: true,
			writeToken
		};
		const resolved = {
			agentId: claim.requesterAgentId,
			sessionKey: claim.requesterSessionKey,
			sessionId: entry.sessionId,
			path: database.path
		};
		try {
			const snapshot = readCurrentProjectionSnapshot(database, resolved, (projection) => ({
				entry,
				validInput: readAdmittedHarnessCompletionInputFromSqlite({
					claim,
					entry,
					storePath: database.path,
					operationalRunId: entry.restartRecoveryDeliveryRunId,
					projection
				}),
				version: readTranscriptContextVersionInTransaction(database, entry.sessionId),
				writeToken
			}));
			if (snapshot.kind !== "value") throw new SessionTranscriptProjectionUnavailableError(entry.sessionId);
			return snapshot.value;
		} catch (error) {
			const readError = encodeSessionTranscriptWorkerError(error);
			if (!readError) throw error;
			return {
				entry,
				validInput: false,
				readError,
				writeToken
			};
		}
	});
}
//#endregion
export { readHarnessCompletionSourceInDatabase as n, readAdmittedHarnessCompletionInputFromSqlite as t };
