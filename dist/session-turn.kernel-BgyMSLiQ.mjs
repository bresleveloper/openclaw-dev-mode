import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as collectSessionEntryLookupKeys } from "./store-entry-Bb_svqyv.mjs";
import { l as readSessionEntryRow, s as readQualifiedSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { r as sqliteSessionEntriesEqual } from "./session-accessor.sqlite-entry-equality-7UlL8HUK.mjs";
import { d as writeSessionEntry, s as readSessionIdentitySnapshot } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { _ as readTranscriptEventMessage, n as findAssistantTranscriptEventInDatabase } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import { r as mergeSessionEntry } from "./types-BZlUzQZy.mjs";
import { t as appendTranscriptMessageInTransaction } from "./session-accessor.sqlite-transcript-message-append-DoBG3JQd.mjs";
import { i as rememberCommittedTranscriptMessageSequencesInTransaction } from "./session-accessor.sqlite-transcript-sequences-CTh1nTDB.mjs";
import { a as readSessionGoalOperationReceipt, o as writeSessionGoalOperationReceipt, t as applySessionGoalOperation } from "./goals-operations-DSJHMBAH.mjs";
import { i as sessionTurnPredicateMatches, t as assertSessionTurnAcceptedResult } from "./session-turn-predicate-BoPjAamw.mjs";
import { d as sameRestartRecoveryTerminalRunIds, s as mergeRestartRecoveryTerminalRunIds } from "./restart-recovery-state-IiHiWzPq.mjs";
//#region src/config/sessions/session-transcript-turn-state.ts
function buildRestartRecoveryExpectedState(entry, mainRestartRecovery) {
	const expectedMainRestartRecovery = mainRestartRecovery ?? entry.mainRestartRecovery;
	return {
		abortedLastRun: entry.abortedLastRun,
		mainRestartRecoveryCycleId: expectedMainRestartRecovery?.cycleId,
		mainRestartRecoveryRevision: expectedMainRestartRecovery?.revision,
		restartRecoveryBeforeAgentReplyState: entry.restartRecoveryBeforeAgentReplyState,
		restartRecoveryDeliveryReceiptState: entry.restartRecoveryDeliveryReceiptState,
		restartRecoveryDeliveryToolCallId: entry.restartRecoveryDeliveryToolCallId,
		restartRecoveryDeliveryRequestFingerprint: entry.restartRecoveryDeliveryRequestFingerprint,
		restartRecoveryDeliveryRunId: entry.restartRecoveryDeliveryRunId,
		restartRecoveryDeliverySourceRunId: entry.restartRecoveryDeliverySourceRunId,
		restartRecoveryRequesterAccountId: entry.restartRecoveryRequesterAccountId,
		restartRecoveryRequesterSenderId: entry.restartRecoveryRequesterSenderId,
		restartRecoverySameChannelThreadRequired: entry.restartRecoverySameChannelThreadRequired,
		restartRecoverySourceIngress: entry.restartRecoverySourceIngress,
		restartRecoverySourceReplyDeliveryMode: entry.restartRecoverySourceReplyDeliveryMode,
		restartRecoveryTerminalRunIds: entry.restartRecoveryTerminalRunIds,
		status: entry.status
	};
}
function sessionMatchesExpectedTranscriptTurn(selected, expected) {
	const expectedState = expected.expectedSessionState;
	return Boolean(selected && selected.entry.sessionId === expected.expectedSessionId && (expected.expectedLifecycleRevision === void 0 || selected.entry.lifecycleRevision === (expected.expectedLifecycleRevision ?? void 0)) && (expected.expectedWriterRunId === void 0 || selected.entry.activeWriterRunId === expected.expectedWriterRunId) && (expectedState === void 0 || selected.entry.abortedLastRun === expectedState.abortedLastRun && selected.entry.mainRestartRecovery?.cycleId === expectedState.mainRestartRecoveryCycleId && selected.entry.mainRestartRecovery?.revision === expectedState.mainRestartRecoveryRevision && selected.entry.restartRecoveryBeforeAgentReplyState === expectedState.restartRecoveryBeforeAgentReplyState && selected.entry.restartRecoveryDeliveryReceiptState === expectedState.restartRecoveryDeliveryReceiptState && selected.entry.restartRecoveryDeliveryToolCallId === expectedState.restartRecoveryDeliveryToolCallId && selected.entry.restartRecoveryDeliveryRequestFingerprint === expectedState.restartRecoveryDeliveryRequestFingerprint && selected.entry.restartRecoveryDeliveryRunId === expectedState.restartRecoveryDeliveryRunId && selected.entry.restartRecoveryDeliverySourceRunId === expectedState.restartRecoveryDeliverySourceRunId && selected.entry.restartRecoveryRequesterAccountId === expectedState.restartRecoveryRequesterAccountId && selected.entry.restartRecoveryRequesterSenderId === expectedState.restartRecoveryRequesterSenderId && selected.entry.restartRecoverySameChannelThreadRequired === expectedState.restartRecoverySameChannelThreadRequired && selected.entry.restartRecoverySourceIngress === expectedState.restartRecoverySourceIngress && selected.entry.restartRecoverySourceReplyDeliveryMode === expectedState.restartRecoverySourceReplyDeliveryMode && sameRestartRecoveryTerminalRunIds(selected.entry.restartRecoveryTerminalRunIds, expectedState.restartRecoveryTerminalRunIds) && selected.entry.status === expectedState.status));
}
function buildExpectedTranscriptTurnSessionPatch(params) {
	const appendedCount = params.appendedMessages.filter((message) => message.appended).length;
	const acceptedMessage = appendedCount > 0 || params.expectedSessionState !== void 0 && params.appendedMessages.some((message) => !message.appended);
	const touchUpdatedAt = params.touchSessionEntry === true && appendedCount > 0 ? Date.now() : 0;
	const restartRecoveryTerminalRunIds = params.sessionLifecyclePatch?.restartRecoveryTerminalRunIds ? mergeRestartRecoveryTerminalRunIds(params.currentEntry.restartRecoveryTerminalRunIds, params.sessionLifecyclePatch.restartRecoveryTerminalRunIds) : void 0;
	return {
		...acceptedMessage ? params.sessionLifecyclePatch : void 0,
		...acceptedMessage && restartRecoveryTerminalRunIds ? { restartRecoveryTerminalRunIds } : {},
		...touchUpdatedAt > 0 ? { updatedAt: Math.max(params.currentEntry.updatedAt ?? 0, params.sessionLifecyclePatch?.updatedAt ?? 0, touchUpdatedAt) } : {}
	};
}
//#endregion
//#region src/config/sessions/session-turn.kernel.ts
function createSessionTranscriptTurnKernel(resolved, options, assertRouting) {
	const initialEntry = options.initialSessionEntry ? structuredClone(options.initialSessionEntry) : void 0;
	if (initialEntry && (initialEntry.sessionId !== options.expectedSessionId || options.expectedLifecycleRevision !== void 0 || options.expectedWriterRunId !== void 0 || options.expectedSessionState !== void 0)) throw new Error("Session initialization requires its new identity and no existing writer state.");
	const resolveExpectedEntry = (selected) => {
		if (options.selectedSessionId !== void 0 && ((selected?.entry.sessionId ?? null) !== options.selectedSessionId || selected?.entry.lifecycleRevision !== (options.selectedLifecycleRevision ?? void 0))) return;
		if (initialEntry) return selected ? void 0 : initialEntry;
		return sessionMatchesExpectedTranscriptTurn(selected, options) ? selected.entry : void 0;
	};
	const readEntry = (database) => {
		const selected = options.keyFormat === "agent-qualified" ? readQualifiedSessionEntryRow(database, resolved.agentId, resolved.sessionKey) : readSessionEntryRow(database, resolved.sessionKey);
		return selected?.entry ? {
			entry: selected.entry,
			row: selected.row
		} : void 0;
	};
	return {
		readEntry,
		resolveExpectedEntry,
		commit(transactionDb, messages, projection) {
			const mutation = options.sessionTurnMutation;
			options.assertCurrent?.();
			mutation?.assertCurrent?.();
			assertRouting?.(transactionDb);
			let result;
			const fresh = readEntry(transactionDb);
			const replay = mutation ? readSessionGoalOperationReceipt(transactionDb.db, resolved.sessionKey, options.expectedSessionId, mutation.operation) : void 0;
			if (replay) {
				if (fresh?.entry.sessionId !== options.expectedSessionId) {
					result = sqliteSessionTranscriptTurnRebound(fresh, options.sessionFile);
					return { result };
				}
				result = {
					appendedMessages: [],
					sessionEntry: fresh.entry,
					sessionFile: options.sessionFile,
					sessionTurnMutationResult: {
						result: replay,
						replayed: true
					}
				};
				return { result };
			}
			const currentEntry = resolveExpectedEntry(fresh);
			if (!currentEntry) {
				result = sqliteSessionTranscriptTurnRebound(fresh, options.sessionFile);
				return { result };
			}
			assertSessionTurnAcceptedResult(resolved.sessionKey, currentEntry, options);
			let predicateSkipped = false;
			const goal = mutation ? applySessionGoalOperation(currentEntry, mutation.operation, Date.now()) : void 0;
			if (goal && options.preparedGoalId) goal.id = options.preparedGoalId;
			const appendedMessages = [];
			for (const append of messages) {
				const { shouldAppend: _shouldAppend, shouldAppendInTransaction, ...appendOptions } = append;
				if (shouldAppendInTransaction) {
					if (!shouldAppendInTransaction(() => {
						const latestAssistant = findAssistantTranscriptEventInDatabase(transactionDb, resolved.sessionId);
						return latestAssistant ? readTranscriptEventMessage(latestAssistant.event) : void 0;
					})) continue;
				}
				if (!sessionTurnPredicateMatches(transactionDb, resolved, append.predicate)) {
					predicateSkipped = true;
					continue;
				}
				const message = prepareSessionTurnGoalMessage(appendOptions.message, mutation, goal?.id);
				const appended = appendTranscriptMessageInTransaction(transactionDb, resolved, {
					...appendOptions,
					...append.workerPreparation,
					message,
					messageAlreadyRedacted: options.atomicGroup === true || options.workerPrepared === true,
					...append.cwd ?? options.cwd ? { cwd: append.cwd ?? options.cwd } : {},
					...append.config ?? options.config ? { config: append.config ?? options.config } : {}
				}, void 0, projection);
				if (appended) appendedMessages.push(appended);
			}
			if (options.atomicGroup && (appendedMessages.length !== messages.length || appendedMessages.some((message) => message.appended) !== appendedMessages.every((message) => message.appended))) throw new Error("SQLite transcript batch was not wholly inserted or replayed");
			if ((mutation || initialEntry) && (appendedMessages.length === 0 || appendedMessages.length !== messages.length || appendedMessages.some((message) => !message.appended))) throw new Error(mutation ? "Goal admission requires a new transcript turn in the same transaction." : "Session initialization requires a new transcript turn in the same transaction.");
			rememberCommittedTranscriptMessageSequencesInTransaction(transactionDb, resolved.sessionId, appendedMessages);
			const appended = readEntry(transactionDb);
			const appendedEntry = appended?.entry ?? currentEntry;
			const sessionPatch = buildExpectedTranscriptTurnSessionPatch({
				appendedMessages,
				currentEntry: appendedEntry,
				expectedSessionState: options.expectedSessionState,
				sessionFile: options.sessionFile,
				sessionLifecyclePatch: options.sessionLifecyclePatch,
				touchSessionEntry: options.touchSessionEntry
			});
			if (mutation) sessionPatch.goal = goal;
			const next = Object.keys(sessionPatch).length > 0 ? mergeSessionEntry(appendedEntry, sessionPatch) : appendedEntry;
			let identity;
			const writesEntry = initialEntry || next !== appendedEntry;
			if (writesEntry || !sqliteSessionEntriesEqual(currentEntry, appendedEntry)) {
				const identityKeys = collectSessionEntryLookupKeys(resolved.sessionKey);
				const previousIdentity = readSessionIdentitySnapshot(transactionDb, identityKeys.filter((key) => key !== resolved.sessionKey));
				if (appended) previousIdentity.set(resolved.sessionKey, appended.entry);
				const persisted = writesEntry ? writeSessionEntry(transactionDb, resolved.sessionKey, next, { canonicalPreviousEntry: previousIdentity.get(resolved.sessionKey) ?? null }) : appendedEntry;
				const currentIdentity = new Map(previousIdentity);
				currentIdentity.set(resolved.sessionKey, persisted);
				identity = {
					previous: previousIdentity,
					current: currentIdentity
				};
			}
			result = {
				sessionTurnMutationResult: mutation ? {
					result: writeSessionGoalOperationReceipt(transactionDb.db, resolved.sessionKey, options.expectedSessionId, mutation.operation, goal, mutation.runId),
					replayed: false
				} : void 0,
				predicateSkipped,
				appendedMessages,
				sessionEntry: structuredClone(next),
				sessionFile: options.sessionFile
			};
			return {
				result,
				identity
			};
		}
	};
}
function sqliteSessionTranscriptTurnRebound(selected, sessionFile) {
	return {
		appendedMessages: [],
		rejectedReason: "session-rebound",
		sessionEntry: selected?.entry,
		sessionFile
	};
}
function prepareSessionTurnGoalMessage(message, mutation, goalId) {
	if (!mutation || !goalId || !isRecord(message) || message.role !== "user") return message;
	return {
		...message,
		__openclaw: {
			...isRecord(message["__openclaw"]) ? message["__openclaw"] : {},
			intent: {
				kind: mutation.operation.action === "start" ? "session-goal-start" : "session-goal-resume",
				version: 1,
				goalId,
				operationId: mutation.operation.operationId
			}
		}
	};
}
//#endregion
export { sessionMatchesExpectedTranscriptTurn as a, buildRestartRecoveryExpectedState as i, prepareSessionTurnGoalMessage as n, sqliteSessionTranscriptTurnRebound as r, createSessionTranscriptTurnKernel as t };
