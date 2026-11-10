import { f as readDatabasePathIdentitySync } from "../../sqlite-worker-identity-DLqVBf5J.mjs";
import { n as ok, t as err } from "../../result-BQGgYouL.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "../../openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as runSqliteDeferredTransactionSync, t as assertTransactionUsable } from "../../sqlite-transaction-CpDyZPQ0.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "../../session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { i as getSqliteWorkerStateContext } from "../../sqlite-worker-state-context-QuvwmAax.mjs";
import { c as runOpenClawAgentWriteTransaction, i as getOpenClawAgentDatabaseIfOpen } from "../../openclaw-agent-db-_fC-kf1x.mjs";
import { i as toDatabaseOptions } from "../../session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "../../session-accessor.sqlite-scope-9ysL95gx.mjs";
import { p as readSessionEntryRow } from "../../session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { u as advanceCliHistoryBoundaryRangeInTransaction } from "../../session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import "../../session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { r as requestSessionEntryCurrentAdmission } from "../../session-entry-current-admission.worker-DSV3cklJ.mjs";
import { c as readTranscriptContextVersionInTransaction } from "../../session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import "../../transcript-write-context-C02sC3zd.mjs";
import { r as resolveTranscriptAppendRefusal } from "../../session-accessor.sqlite-transcript-write-guard-C3zmfbiJ.mjs";
import { i as prepareTranscriptReportSelection, n as appendSelectedTranscriptReportInTransaction, t as appendAbortedSessionTranscriptPartialInTransaction } from "../../session-accessor.sqlite-transcript-reports.kernel-CQPjJU2G.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-transcript-reports.worker.ts
/** Domain binding borrows the existing SQLite broker's canonical writer. */
function bindSqliteWorkerBackend(target, context) {
	const { fence } = target;
	const resolved = {
		...target.resolved,
		env: getSqliteWorkerStateContext().environment
	};
	const options = toDatabaseOptions(resolved);
	const pathname = resolveOpenClawAgentSqlitePath(options);
	if (!(context.database.location() ? readDatabasePathIdentitySync(pathname).canonicalPath === context.databasePath : pathname === context.databasePath && getOpenClawAgentDatabaseIfOpen(options)?.db === context.database)) throw new Error("Transcript report target changed its database owner");
	resolved.path = context.databasePath;
	options.path = context.databasePath;
	const database = getOpenClawAgentDatabaseIfOpen(options);
	if (!database || database.db !== context.database || database.path !== context.databasePath) throw new Error("Transcript report lost its canonical database owner");
	const admit = (stage) => context.admit(stage, (request, dispatch) => requestSessionEntryCurrentAdmission(target.sessionEntryCurrentSource, request, { database }, dispatch));
	let closed = false;
	const assertOpen = () => {
		if (closed || !database.db.isOpen) throw new Error("Transcript report domain is closed");
		assertTransactionUsable(database.db);
	};
	const readCurrentEntry = () => {
		const entry = readSessionEntryRow(database, resolved.sessionKey, "list")?.entry;
		return {
			entry,
			refusal: resolveTranscriptAppendRefusal(entry, resolved, {
				...resolved,
				...fence
			})
		};
	};
	let prepared;
	return {
		execute(command) {
			assertOpen();
			if (command.type === "prepare") return runSqliteDeferredTransactionSync(database.db, () => {
				prepared = void 0;
				const { refusal } = readCurrentEntry();
				if (refusal) return err(refusal);
				prepared = {
					facts: prepareTranscriptReportSelection(database, resolved, command.input),
					version: readTranscriptContextVersionInTransaction(database, resolved.sessionId)
				};
				return ok(prepared.facts);
			});
			return runOpenClawAgentWriteTransaction((current) => {
				if (current.db !== database.db) throw new Error("Transcript report lost its canonical database owner");
				admit("transaction");
				const { refusal } = readCurrentEntry();
				if (refusal) {
					admit("commit");
					return err(refusal);
				}
				const firstSeq = target.cliWriter ? (readTranscriptContextVersionInTransaction(database, resolved.sessionId).rawSeq ?? -1) + 1 : void 0;
				let projectionNeedsReconcile = false;
				const projection = {
					scheduleProjectionReconcile: false,
					onProjectionReconcileNeeded: () => {
						projectionNeedsReconcile = true;
					}
				};
				let abortedPartial;
				if (command.type === "abortedPartial") abortedPartial = appendAbortedSessionTranscriptPartialInTransaction(database, resolved, command.input, command.input.preparedMessage, projection);
				else if (command.type === "assistant") {
					const facts = prepareTranscriptReportSelection(database, resolved, {
						kind: "assistant",
						responseId: command.input.message.responseId
					});
					if (!facts.suppressed) appendSelectedTranscriptReportInTransaction(database, resolved, facts.appendParentId, command.input, projection, command.input.preparedMessage);
				} else {
					const plan = prepared;
					prepared = void 0;
					if (!plan || plan.facts.suppressed) throw new Error("Transcript report append requires its prepared selection");
					const currentVersion = readTranscriptContextVersionInTransaction(database, resolved.sessionId);
					if (!isDeepStrictEqual(currentVersion, plan.version)) {
						admit("commit");
						return ok({
							committed: false,
							projectionNeedsReconcile: false
						});
					}
					appendSelectedTranscriptReportInTransaction(database, resolved, plan.facts.appendParentId, command.input, projection);
				}
				let commitGranted = false;
				const authorizeCommit = () => {
					if (!commitGranted) {
						admit("commit");
						commitGranted = true;
					}
				};
				const cliHistoryChanged = target.cliWriter && firstSeq !== void 0 ? advanceCliHistoryBoundaryRangeInTransaction(database, resolved, {
					first: firstSeq,
					last: readTranscriptContextVersionInTransaction(database, resolved.sessionId).rawSeq ?? -1
				}, target.cliWriter, authorizeCommit) : false;
				const { entry, refusal: rebound } = readCurrentEntry();
				if (rebound) throw new SessionTranscriptWriterClaimReboundError(rebound);
				authorizeCommit();
				return ok({
					committed: true,
					projectionNeedsReconcile,
					cliHistoryChanged,
					...(cliHistoryChanged || abortedPartial && !abortedPartial.skipped && abortedPartial.append.appended) && { entry },
					...abortedPartial ? {
						abortedPartial,
						sessionEntryChanged: !abortedPartial.skipped && abortedPartial.append.appended
					} : {}
				});
			}, options, { operationLabel: "session.transcript.report" });
		},
		assertSettled() {
			assertOpen();
			if (database.db.isTransaction) throw new Error("Transcript report command left a transaction open");
		},
		close() {
			closed = true;
			prepared = void 0;
		}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
