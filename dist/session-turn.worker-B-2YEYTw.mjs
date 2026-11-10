import { G as sqliteSessionIdWriteScope, U as withSqliteDatabaseWriteScope, W as withoutSqliteDatabaseWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { o as getSqliteReadScopeRevision, p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { o as runSqliteReadSnapshotSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as SqliteTranscriptMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { R as ensureSessionGoalOperationsSchema } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { M as buildRestartRecoveryExpectedState } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { a as runWithCliHistoryWriter } from "./cli-history-boundary-B1eSXpAQ.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-0wQEn3Eb.mjs";
import { r as applySessionGoalOperation } from "./goals-operation-policy-qSLTo9UN.mjs";
import { g as runWithSessionPendingInputWorkerCustody, p as resolveSessionPendingInputAppend, u as readSessionPendingInputWorkerReceipt } from "./session-accessor.sqlite-pending-inputs-dFWJwbQM.mjs";
import { c as readTranscriptContextVersionInTransaction, s as readTranscriptContextStateInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { a as readTranscriptMessageByScopedIdempotencyKey } from "./session-accessor.sqlite-transcript-identity-BbaLin80.mjs";
import { r as prepareSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-BqtqwF34.mjs";
import { n as readCommittedTranscriptMessageSequence } from "./session-accessor.sqlite-transcript-sequences-B5FCjqGn.mjs";
import { r as readSessionGoalOperationReceipt } from "./goals-operations-DPpmJyei.mjs";
import { r as prepareSessionTurnRouting } from "./session-turn-predicate-DmzgQUpv.mjs";
import { n as sqliteSessionTranscriptTurnRebound, t as createSessionTranscriptTurnKernel } from "./session-turn.kernel-S1FdspyZ.mjs";
import { t as readSessionPendingInputAuthorityFacts } from "./session-pending-input-authority.kernel-Cz8X54WZ.mjs";
import { n as readSessionSourceValidation } from "./session-source-predicate.worker-CY9FAsb_.mjs";
import { i as transferSessionEntryWorkerCandidate } from "./session-entry-patch.worker-CyYnfK5G.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-turn.worker.ts
let voiceKernel;
async function prepareVoiceTranscriptCommit() {
	voiceKernel ??= await import("./client-voice-session-write.kernel-C9dcAcrK.mjs");
}
function inCustody(input, context, run, readEntry) {
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
	return input.custody ? runWithSessionPendingInputWorkerCustody(input.custody, input.relocation, () => context.admit("transaction", {
		kind: "session-turn-custody",
		authority: input.custody.preparedAuthority ? readSessionPendingInputAuthorityFacts(context.open(), input.custody.sessionKey, input.custody.agentId, readEntry?.()) : void 0
	}), owned).value : owned();
}
function prepareSessionTurn(input, context, incarnation) {
	const database = context.open();
	if (input.options.sessionTurnMutation) ensureSessionGoalOperationsSchema(database.db);
	return (input.custody?.preparedAuthority ? runSqliteReadSnapshotSync : runSqliteReadOperationSync)(database.db, () => {
		const scope = {
			agentId: input.agentId,
			path: context.options.path,
			sessionKey: input.sessionKey,
			sessionId: input.options.expectedSessionId
		};
		const kernel = createSessionTranscriptTurnKernel(scope, input.options);
		const selected = kernel.readEntry(database);
		const revision = getSqliteReadScopeRevision(database.db);
		const ownerSourceValidation = input.ownerSources?.length ? readSessionSourceValidation(database, input.ownerSources, incarnation, /* @__PURE__ */ new Map([[scope.sessionKey, selected?.entry]])) : void 0;
		if (ownerSourceValidation?.refusedSource) return { refusedOwnerSource: ownerSourceValidation.refusedSource };
		prepareSessionTurnRouting(input.options.sessionTurnMutation?.routingPredicate, context.options.env)?.(database);
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
		const transcriptState = !result && input.options.messages.length ? readTranscriptContextStateInTransaction(database, scope.sessionId) : void 0;
		if (input.prepareColdTranscript && transcriptState?.coldArchive) return {
			ownerSourceValidation,
			result: void 0,
			messages: [],
			coldArchive: transcriptState.coldArchive,
			version: void 0,
			goalId: void 0
		};
		return {
			ownerSourceValidation,
			result,
			messages: result ? [] : inCustody(input, context, () => input.options.messages.map((append) => {
				const key = readMessageIdempotencyKey(append.message);
				return {
					pending: Boolean(resolveSessionPendingInputAppend(database, scope, append.message)),
					existing: key && append.idempotencyLookup !== "caller-checked" ? readTranscriptMessageByScopedIdempotencyKey(database, scope, key, append.idempotencyLookup) : void 0
				};
			}), () => selected && revision ? {
				sessionKey: scope.sessionKey,
				entry: selected.entry,
				revision
			} : void 0),
			coldArchive: void 0,
			version: transcriptState?.version,
			expectedSessionState: expectedEntry && buildRestartRecoveryExpectedState(selected?.entry ?? {
				sessionId: scope.sessionId,
				updatedAt: 0
			}),
			goalId: mutation && !result && expectedEntry && input.options.messages.length ? applySessionGoalOperation(expectedEntry, mutation.operation, Date.now())?.id : void 0
		};
	});
}
function commitSessionTurn(input, context) {
	return applySessionTurn(input, context, (database, candidate) => transferSessionEntryWorkerCandidate(database, context.admit, candidate));
}
function applySessionTurn(input, context, publish, incarnation) {
	const assertRouting = prepareSessionTurnRouting(input.options.sessionTurnMutation?.routingPredicate, context.options.env);
	let selectedPostimage;
	return inCustody(input, context, () => context.writeTransaction("session.transcript.append-turn", "Session turn", (database) => withSqliteDatabaseWriteScope(database.db, [
		input.sessionKey,
		sqliteSessionIdWriteScope(input.options.expectedSessionId),
		...input.custody ? [input.custody.sessionKey] : []
	], () => {
		const scope = {
			agentId: input.agentId,
			path: context.options.path,
			sessionKey: input.sessionKey,
			sessionId: input.options.expectedSessionId
		};
		const transactionVersion = input.options.messages.some((append) => append.preparationVersion) ? { ...readTranscriptContextVersionInTransaction(database, scope.sessionId) } : void 0;
		const messages = input.options.messages.map((append, index) => ({
			...append,
			...append.preparedMessage ? { prepareMessageAfterIdempotencyCheck: () => append.preparedMessage.message } : {},
			...append.freshGuard || append.preparedMessage ? { beforeFreshMessageCommit: () => {
				if (append.preparedMessage && !append.preparedMessage.prepared) throw new SqliteTranscriptMutationConflictError(scope.sessionId);
				if (append.preparationVersion && !isDeepStrictEqual(append.preparationVersion, transactionVersion)) throw new SqliteTranscriptMutationConflictError(scope.sessionId);
				if (append.freshGuard) withoutSqliteDatabaseWriteScope(database.db, () => context.admit("transaction", {
					kind: "session-turn-fresh",
					index,
					sourceValidation: readSessionSourceValidation(database, append.sources, incarnation)
				}));
			} } : {}
		}));
		const kernel = createSessionTranscriptTurnKernel(scope, {
			...input.options,
			workerPrepared: true,
			messages
		}, assertRouting);
		for (const append of input.options.messages) {
			if (!append.preparedMessage?.prepared) continue;
			const key = readMessageIdempotencyKey(append.message);
			const current = key && append.idempotencyLookup !== "caller-checked" ? readTranscriptMessageByScopedIdempotencyKey(database, scope, key, append.idempotencyLookup) : void 0;
			if (!isDeepStrictEqual(current, append.preparedMessage.expected)) throw new Error("Transcript idempotency changed while preparing the turn");
		}
		let projectionNeedsReconcile = false;
		const committed = kernel.commit(database, messages, {
			scheduleProjectionReconcile: false,
			onProjectionReconcileNeeded: () => {
				projectionNeedsReconcile = true;
			}
		}, (selected) => {
			const revision = getSqliteReadScopeRevision(database.db);
			selectedPostimage = selected && revision ? {
				sessionKey: scope.sessionKey,
				entry: selected.entry,
				revision
			} : void 0;
			if (input.ownerSources?.length) withoutSqliteDatabaseWriteScope(database.db, () => context.admit("transaction", {
				kind: "session-turn-owner",
				sourceValidation: readSessionSourceValidation(database, input.ownerSources, incarnation, /* @__PURE__ */ new Map([[scope.sessionKey, selected?.entry]]))
			}));
		});
		if (input.options.voiceTranscript && committed.result.appendedMessages.length === 1) {
			if (!voiceKernel) throw new Error("Voice transcript commit was not prepared");
			committed.result.voiceSession = voiceKernel.mutateVoiceSessionInDatabase(database, {
				...input.options.voiceTranscript,
				kind: "confirm",
				now: Date.now()
			});
		}
		const revision = getSqliteReadScopeRevision(database.db);
		const publication = committed.identity ? prepareSessionEntryReplacementPublication({
			...committed.identity,
			pendingArchiveRecovery: false,
			membershipInvalidatedKeys: [],
			maintenancePlans: []
		}, database, {
			captureFullFacts: true,
			postimages: committed.postimages
		}) : void 0;
		const custodyEntry = input.custody && revision && getSqliteReadScopeRevision(database.db) === revision && publication?.current.get(input.custody.sessionKey);
		const candidate = {
			kind: "session-turn",
			result: committed.result,
			projectionNeedsReconcile,
			sequences: committed.result.appendedMessages.map(readCommittedTranscriptMessageSequence),
			custody: readSessionPendingInputWorkerReceipt(database),
			authority: input.custody?.preparedAuthority && input.custody.databasePath === (readOpenClawAgentDatabaseIdentity(database).canonicalPath || database.path) ? readSessionPendingInputAuthorityFacts(database, input.custody.sessionKey, input.custody.agentId, custodyEntry && revision ? {
				sessionKey: input.custody.sessionKey,
				entry: custodyEntry,
				revision
			} : void 0) : void 0,
			publication
		};
		if (incarnation && candidate.publication?.source) Object.assign(candidate.publication.source, {
			identity: incarnation,
			incarnation
		});
		return withoutSqliteDatabaseWriteScope(database.db, () => publish(database, candidate));
	})), () => selectedPostimage);
}
//#endregion
export { prepareVoiceTranscriptCommit as i, commitSessionTurn as n, prepareSessionTurn as r, applySessionTurn as t };
