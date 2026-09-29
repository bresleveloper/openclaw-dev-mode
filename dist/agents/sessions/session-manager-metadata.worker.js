import { c as isRecord } from "../../record-coerce-DItp3I4t.mjs";
import { t as assertTransactionUsable } from "../../sqlite-transaction-DKSXLQhb.mjs";
import { t as encodeOpenClawStateWorkerError } from "../../openclaw-state-worker-error-DLFiBmPG.mjs";
import { f as runOpenClawAgentWriteTransaction } from "../../openclaw-agent-db-CaQAStOA.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "../../transcript-write-context-MlBhwaKa.mjs";
import { g as toDatabaseOptions, m as resolveSqliteTranscriptScope } from "../../session-accessor.sqlite-scope-DHC66DLY.mjs";
import { t as getSqliteWorkerStateContext } from "../../sqlite-worker-state-context-C9ABaq_h.mjs";
import { n as assertCanonicalSessionKeyWrite } from "../../session-canonical-key-BBylVEaq.mjs";
import { a as runWithSessionTranscriptReadFence } from "../../session-transcript-read-fence-Crjo4FKU.mjs";
import { t as readSessionTranscriptBoundedActiveContextCore } from "../../session-accessor.sqlite-active-context-C3x2ZjEy.mjs";
import { t as ensureSessionEntryInTransaction } from "../../session-accessor.sqlite-initial-entry-DTpzTl-3.mjs";
import { O as readTranscriptMutationAtSync, n as appendTranscriptEventSnapshotSync } from "../../session-accessor.sqlite-transcript-write-Bk_2EeDT.mjs";
import { a as inspectTranscriptEventsSync, f as loadTranscriptReadSnapshotSync } from "../../session-accessor.sqlite-read-BzN7WYll.mjs";
import { serialize } from "node:v8";
//#region src/agents/sessions/session-manager-metadata.worker.ts
function copyTranscriptRefusal(value) {
	if (value === void 0) return;
	if (!isRecord(value) || typeof value.agentIdHash !== "string" || typeof value.expectedSessionIdHash !== "string" || typeof value.sessionKeyHash !== "string") throw new Error("Session metadata refusal has an invalid identity");
	const identity = {
		agentIdHash: value.agentIdHash,
		expectedSessionIdHash: value.expectedSessionIdHash,
		sessionKeyHash: value.sessionKeyHash
	};
	if (value.code === "session-entry-missing") return {
		...identity,
		code: value.code
	};
	if (value.code === "session-rebound" && typeof value.actualSessionIdHash === "string") return {
		...identity,
		code: value.code,
		actualSessionIdHash: value.actualSessionIdHash
	};
	throw new Error("Session metadata refusal has an invalid kind");
}
function readCommittedMetadataView(scope, limits, admission) {
	return runWithSessionTranscriptReadFence(admission, () => {
		if (limits) return {
			kind: "bounded",
			snapshot: readSessionTranscriptBoundedActiveContextCore(scope, {
				...limits,
				...admission !== void 0 ? { ignoreReadFence: true } : {}
			})
		};
		if (admission !== void 0) {
			const inspected = inspectTranscriptEventsSync(scope);
			return {
				kind: "full",
				snapshot: {
					events: inspected.events,
					version: {
						generation: inspected.snapshot.generation,
						rawSeq: inspected.snapshot.lastSeq,
						updatedAt: inspected.snapshot.transcriptUpdatedAt
					}
				}
			};
		}
		return {
			kind: "full",
			snapshot: loadTranscriptReadSnapshotSync(scope)
		};
	});
}
/** Borrow the canonical actor's connection; this domain never opens or closes a database. */
function bindSqliteWorkerBackend(_input, context) {
	let closed = false;
	const assertOpen = () => {
		if (closed || !context.database.isOpen) throw new Error("Session metadata domain is closed");
		assertTransactionUsable(context.database);
	};
	const execute = (command) => {
		assertOpen();
		const scope = {
			...command.input.scope,
			env: getSqliteWorkerStateContext().environment
		};
		const resolved = resolveSqliteTranscriptScope(scope);
		const options = toDatabaseOptions(resolved);
		if (options.path !== context.databasePath) throw new Error("Session metadata target changed its database owner");
		if (command.type === "session.metadata.mutation") return {
			ok: true,
			value: readTranscriptMutationAtSync(scope)
		};
		assertCanonicalSessionKeyWrite(resolved.sessionKey, resolved.agentId);
		const outcome = runOpenClawAgentWriteTransaction((database) => {
			if (database.db !== context.database) throw new Error("Session metadata lost its borrowed canonical connection");
			context.admit("transaction");
			if (command.type === "session.metadata.initialize") {
				const result = ensureSessionEntryInTransaction(database, resolved, scope, command.input.entry, command.input.initialWriterRunId);
				context.admit("commit");
				return {
					ok: true,
					value: result
				};
			}
			let projectionNeedsReconcile = false;
			const snapshot = appendTranscriptEventSnapshotSync(scope, command.input.event, command.input.options, {
				scheduleProjectionReconcile: false,
				onProjectionReconcileNeeded: () => {
					projectionNeedsReconcile = true;
				}
			});
			context.admit("commit");
			return {
				ok: true,
				value: {
					snapshot,
					projectionNeedsReconcile
				}
			};
		}, options);
		if (command.type === "session.metadata.append" && command.input.event.type !== "session" && command.input.view && outcome.ok && "snapshot" in outcome.value && outcome.value.snapshot.ok) {
			const { event, view } = command.input;
			const committed = outcome.value.snapshot.value;
			if (!committed.result.appended) return outcome;
			const version = view.loadedVersion;
			const effectiveParentId = committed.result.effectiveParentId;
			if (version && (committed.before.generation !== version.generation || committed.before.rawSeq !== version.rawSeq) || effectiveParentId !== void 0 && effectiveParentId !== event.parentId) try {
				outcome.value.reload = {
					ok: true,
					value: readCommittedMetadataView(scope, view.limits, view.admission)
				};
				serialize(outcome);
			} catch (error) {
				outcome.value.reload = {
					ok: false,
					error: encodeOpenClawStateWorkerError(error, { includeOrdinary: true })
				};
			}
		}
		return outcome;
	};
	return {
		execute(command) {
			try {
				return execute(command);
			} catch (error) {
				if (error instanceof SessionTranscriptWriterClaimReboundError) return {
					ok: false,
					refusal: copyTranscriptRefusal(error.cause)
				};
				throw error;
			}
		},
		assertSettled() {
			assertOpen();
			if (context.database.isTransaction) throw new Error("Session metadata command left a transaction open");
		},
		close() {
			closed = true;
		}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
