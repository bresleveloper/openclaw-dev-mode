import { L as ensureSessionGoalOperationsSchema } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { r as runWithCliHistoryWriter } from "./cli-history-boundary-CwwMqsE-.mjs";
import { f as readSessionPendingInputWorkerReceipt, h as resolveSessionPendingInputAppend, v as runWithSessionPendingInputWorkerCustody } from "./session-accessor.sqlite-pending-inputs-DtDOOibA.mjs";
import { c as readTranscriptMessageByScopedIdempotencyKey } from "./session-accessor.sqlite-transcript-store-Bqsq62BI.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-0wQEn3Eb.mjs";
import { n as prepareSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-mI3FEuTy.mjs";
import { n as readCommittedTranscriptMessageSequence } from "./session-accessor.sqlite-transcript-sequences-BVG-PGVB.mjs";
import { a as readSessionGoalOperationReceipt, t as applySessionGoalOperation } from "./goals-operations-BofIFvAE.mjs";
import { r as prepareSessionTurnRouting } from "./session-turn-predicate-C3pbz2vZ.mjs";
import { r as sqliteSessionTranscriptTurnRebound, t as createSessionTranscriptTurnKernel } from "./session-turn.kernel-DMv2fk8b.mjs";
import { r as transferSessionEntryWorkerCandidate } from "./session-entry-patch.worker-CNfHtLgK.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-turn.worker.ts
function inCustody(input, context, run) {
	const assertCurrent = () => context.admit("transaction", { kind: "session-entry-patch-validated" });
	const owned = () => runWithCliHistoryWriter(input.cliWriter ? {
		...input.cliWriter,
		target: {
			agentId: input.agentId,
			sessionKey: input.sessionKey,
			sessionId: input.options.expectedSessionId,
			storePath: context.options.path
		},
		assertCurrent,
		assertReadable: assertCurrent
	} : void 0, run);
	return input.custody ? runWithSessionPendingInputWorkerCustody(input.custody, input.relocation, () => context.admit("transaction", { kind: "session-turn-custody" }), owned).value : owned();
}
function prepareSessionTurn(input, context) {
	const database = context.open();
	prepareSessionTurnRouting(input.options.sessionTurnMutation?.routingPredicate, context.options.env)?.(database);
	const scope = {
		agentId: input.agentId,
		path: context.options.path,
		sessionKey: input.sessionKey,
		sessionId: input.options.expectedSessionId
	};
	if (input.options.sessionTurnMutation) ensureSessionGoalOperationsSchema(database.db);
	const kernel = createSessionTranscriptTurnKernel(scope, input.options);
	const selected = kernel.readEntry(database);
	const mutation = input.options.sessionTurnMutation;
	const replay = mutation ? readSessionGoalOperationReceipt(database.db, scope.sessionKey, scope.sessionId, mutation.operation) : void 0;
	const expectedEntry = kernel.resolveExpectedEntry(selected);
	const result = replay && selected?.entry.sessionId === scope.sessionId ? {
		appendedMessages: [],
		sessionEntry: selected.entry,
		sessionFile: input.options.sessionFile,
		sessionTurnMutationResult: {
			result: replay,
			replayed: true
		}
	} : !expectedEntry ? sqliteSessionTranscriptTurnRebound(selected, input.options.sessionFile) : void 0;
	return {
		result,
		messages: result ? [] : inCustody(input, context, () => input.options.messages.map((append) => {
			const key = readMessageIdempotencyKey(append.message);
			return {
				pending: Boolean(resolveSessionPendingInputAppend(database, scope, append.message)),
				existing: key && append.idempotencyLookup !== "caller-checked" ? readTranscriptMessageByScopedIdempotencyKey(database, scope, key, append.idempotencyLookup) : void 0
			};
		})),
		goalId: mutation && !result && expectedEntry && input.options.messages.length ? applySessionGoalOperation(expectedEntry, mutation.operation, Date.now())?.id : void 0
	};
}
function commitSessionTurn(input, context) {
	const assertRouting = prepareSessionTurnRouting(input.options.sessionTurnMutation?.routingPredicate, context.options.env);
	return inCustody(input, context, () => context.writeTransaction("session.transcript.append-turn", "Session turn", (database) => {
		const scope = {
			agentId: input.agentId,
			path: context.options.path,
			sessionKey: input.sessionKey,
			sessionId: input.options.expectedSessionId
		};
		const messages = input.options.messages.map((append) => ({
			...append,
			...append.preparation ? { prepareMessageAfterIdempotencyCheck: () => append.preparation.message } : {}
		}));
		const kernel = createSessionTranscriptTurnKernel(scope, {
			...input.options,
			workerPrepared: true,
			messages
		}, assertRouting);
		for (const append of input.options.messages) {
			if (!append.preparation) continue;
			const key = readMessageIdempotencyKey(append.message);
			const current = key && append.idempotencyLookup !== "caller-checked" ? readTranscriptMessageByScopedIdempotencyKey(database, scope, key, append.idempotencyLookup) : void 0;
			if (!isDeepStrictEqual(current, append.preparation.expected)) throw new Error("Transcript idempotency changed while preparing the turn");
		}
		let projectionNeedsReconcile = false;
		const committed = kernel.commit(database, messages, {
			scheduleProjectionReconcile: false,
			onProjectionReconcileNeeded: () => {
				projectionNeedsReconcile = true;
			}
		});
		const candidate = {
			kind: "session-turn",
			result: committed.result,
			projectionNeedsReconcile,
			sequences: committed.result.appendedMessages.map(readCommittedTranscriptMessageSequence),
			custody: readSessionPendingInputWorkerReceipt(database),
			publication: committed.identity ? prepareSessionEntryReplacementPublication({
				...committed.identity,
				pendingArchiveRecovery: false,
				membershipInvalidatedKeys: [],
				maintenancePlans: []
			}, database) : void 0
		};
		return transferSessionEntryWorkerCandidate(database, context.admit, candidate);
	}));
}
//#endregion
export { commitSessionTurn, prepareSessionTurn };
