import { n as SessionGoalOperationError } from "../../goals-operations.types-DnxMqPtA.mjs";
import { R as ensureSessionGoalOperationsSchema } from "../../openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { r as mergeSessionEntry } from "../../types-BGDhC4_W.mjs";
import { r as applySessionGoalOperation } from "../../goals-operation-policy-qSLTo9UN.mjs";
import { p as readSessionEntryRow } from "../../session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { a as writeSessionEntry } from "../../session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { r as prepareSessionEntryReplacementPublication } from "../../session-accessor.sqlite-replacement-state-BqtqwF34.mjs";
import { i as writeSessionGoalOperationReceipt, r as readSessionGoalOperationReceipt } from "../../goals-operations-DPpmJyei.mjs";
import { n as readSessionSourceValidation } from "../../session-source-predicate.worker-CY9FAsb_.mjs";
import { i as transferSessionEntryWorkerCandidate, t as bindSessionWorkerBackend } from "../../session-entry-patch.worker-CyYnfK5G.mjs";
//#region src/config/sessions/goals-operations.worker.ts
/** Lend the existing executor connection; keep this private command outside the released SDK union. */
function bindSqliteWorkerBackend(input, bound) {
	return bindSessionWorkerBackend(input, bound, "Goal", ({ admit, writeTransaction }, database) => {
		ensureSessionGoalOperationsSchema(database.db);
		return ({ input: request }) => {
			return writeTransaction("session.goal.mutate", "Goal transaction", (current) => {
				const assertSources = () => {
					const validation = readSessionSourceValidation(current, request.sources);
					const { refusedSource } = validation;
					if (refusedSource) {
						transferSessionEntryWorkerCandidate(current, admit, {
							kind: "session-goal-management",
							refusedSource
						});
						throw new Error("Goal source refusal was not rejected");
					}
					if (validation.conversationMatches.length) admit("transaction", {
						kind: "session-entry-patch-validated",
						sourceValidation: validation
					});
				};
				assertSources();
				const { previous, ...result } = mutateSessionGoalInDatabase(current, request);
				const candidate = {
					kind: "session-goal-management",
					result,
					publication: previous && result.sessionEntry ? prepareSessionEntryReplacementPublication({
						previous: /* @__PURE__ */ new Map([[request.sessionKey, previous]]),
						current: /* @__PURE__ */ new Map([[request.sessionKey, result.sessionEntry]]),
						pendingArchiveRecovery: false,
						membershipInvalidatedKeys: [],
						maintenancePlans: []
					}, current) : void 0
				};
				return transferSessionEntryWorkerCandidate(current, admit, candidate);
			});
		};
	}, "Goal management");
}
/** Receipt replay and the reducer share the current row and the caller's synchronous transaction. */
function mutateSessionGoalInDatabase(database, input) {
	const fresh = readSessionEntryRow(database, input.sessionKey);
	const replay = readSessionGoalOperationReceipt(database.db, input.sessionKey, input.expectedSessionId, input.operation);
	if (replay && fresh?.entry.sessionId === input.expectedSessionId) return {
		result: replay,
		replayed: true
	};
	if (!fresh || fresh.entry.sessionId !== input.expectedSessionId) throw new SessionGoalOperationError("session-rebound", "Session changed; refresh before changing its Goal.");
	const goal = applySessionGoalOperation(fresh.entry, input.operation, Date.now());
	const sessionEntry = writeSessionEntry(database, input.sessionKey, mergeSessionEntry(fresh.entry, { goal }), { canonicalPreviousEntry: fresh.entry });
	return {
		result: writeSessionGoalOperationReceipt(database.db, input.sessionKey, input.expectedSessionId, input.operation, goal),
		replayed: false,
		sessionEntry,
		previous: fresh.entry
	};
}
//#endregion
export { bindSqliteWorkerBackend };
