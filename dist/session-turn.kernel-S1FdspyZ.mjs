import { N as prepareSessionTranscriptTurnEntry, j as buildExpectedTranscriptTurnSessionPatch } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { t as collectSessionEntryLookupKeys } from "./store-entry-CUxN9KZj.mjs";
import { r as mergeSessionEntry } from "./types-BGDhC4_W.mjs";
import { r as applySessionGoalOperation, s as prepareSessionTurnGoalMessage } from "./goals-operation-policy-qSLTo9UN.mjs";
import { c as readQualifiedSessionEntryRow, p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { _ as readSessionIdentitySnapshot, a as writeSessionEntry, p as captureSessionEntrySnapshot } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { r as findAssistantTranscriptEventInDatabase, v as readTranscriptEventMessage } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { r as sqliteSessionEntriesEqual } from "./session-accessor.sqlite-entry-equality-59qE2chV.mjs";
import { l as readTranscriptAppendPostimage } from "./session-accessor.sqlite-transcript-anchor-Dc-2VOHU.mjs";
import { t as appendTranscriptMessageInTransaction } from "./session-accessor.sqlite-transcript-message-append-DFcvBgrv.mjs";
import { i as rememberCommittedTranscriptMessageSequencesInTransaction } from "./session-accessor.sqlite-transcript-sequences-B5FCjqGn.mjs";
import { i as writeSessionGoalOperationReceipt, r as readSessionGoalOperationReceipt } from "./goals-operations-DPpmJyei.mjs";
import { i as sessionTurnPredicateMatches, t as assertSessionTurnAcceptedResult } from "./session-turn-predicate-DmzgQUpv.mjs";
//#region src/config/sessions/session-turn.kernel.ts
function createSessionTranscriptTurnKernel(resolved, options, assertRouting) {
	const { initialEntry, resolveExpectedEntry } = prepareSessionTranscriptTurnEntry(options);
	const readEntry = (database, includeWindowFacts) => {
		const selected = options.keyFormat === "agent-qualified" ? readQualifiedSessionEntryRow(database, resolved.agentId, resolved.sessionKey, { includeWindowFacts }) : readSessionEntryRow(database, resolved.sessionKey, "full", includeWindowFacts);
		return selected?.entry ? {
			entry: selected.entry,
			row: selected.row
		} : void 0;
	};
	return {
		readEntry,
		resolveExpectedEntry,
		commit(transactionDb, messages, projection, validateSelected) {
			const mutation = options.sessionTurnMutation;
			options.assertCurrent?.();
			mutation?.assertCurrent?.();
			assertRouting?.(transactionDb);
			let result;
			const fresh = readEntry(transactionDb, true);
			validateSelected?.(fresh);
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
			let postimage;
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
					...append.cwd ?? options.cwd ? { cwd: append.cwd ?? options.cwd } : {},
					...append.config ?? options.config ? { config: append.config ?? options.config } : {}
				}, void 0, projection);
				if (appended) {
					appendedMessages.push(appended.result);
					postimage = readTranscriptAppendPostimage(appended);
				}
			}
			if (options.atomicGroup && (appendedMessages.length !== messages.length || appendedMessages.some((message) => message.appended) !== appendedMessages.every((message) => message.appended))) throw new Error("SQLite transcript batch was not wholly inserted or replayed");
			if ((mutation || initialEntry) && (appendedMessages.length === 0 || appendedMessages.length !== messages.length || appendedMessages.some((message) => !message.appended))) throw new Error(mutation ? "Goal admission requires a new transcript turn in the same transaction." : "Session initialization requires a new transcript turn in the same transaction.");
			options.assertCurrent?.();
			rememberCommittedTranscriptMessageSequencesInTransaction(transactionDb, resolved.sessionId, appendedMessages, postimage);
			const appended = readEntry(transactionDb, true);
			const appendedEntry = appended?.entry ?? currentEntry;
			const sessionPatch = buildExpectedTranscriptTurnSessionPatch({
				appendedMessages,
				currentEntry: appendedEntry,
				expectedSessionState: options.expectedSessionState,
				sessionLifecyclePatch: options.sessionLifecyclePatch,
				touchSessionEntry: options.touchSessionEntry
			});
			if (mutation) sessionPatch.goal = goal;
			const next = Object.keys(sessionPatch).length > 0 ? mergeSessionEntry(appendedEntry, sessionPatch) : appendedEntry;
			const postimages = /* @__PURE__ */ new Map();
			let identity;
			const writesEntry = initialEntry || next !== appendedEntry;
			if (writesEntry || !sqliteSessionEntriesEqual(currentEntry, appendedEntry)) {
				const identityKeys = collectSessionEntryLookupKeys(resolved.sessionKey);
				const previousIdentity = readSessionIdentitySnapshot(transactionDb, identityKeys.filter((key) => key !== resolved.sessionKey));
				if (appended) previousIdentity.set(resolved.sessionKey, appended.entry);
				const snapshot = appended ? captureSessionEntrySnapshot(appended) : void 0;
				const persisted = writesEntry ? writeSessionEntry(transactionDb, resolved.sessionKey, next, {
					canonicalPreviousEntry: previousIdentity.get(resolved.sessionKey) ?? null,
					canonicalPreviousRow: snapshot?.row,
					canonicalPreviousWindow: snapshot?.window,
					canonicalPreviousSideTables: snapshot?.sideTables,
					postimages
				}) : appendedEntry;
				const currentIdentity = new Map(previousIdentity);
				currentIdentity.set(resolved.sessionKey, persisted);
				if (!writesEntry && appended && snapshot?.window?.row && snapshot.sideTables) postimages.set(resolved.sessionKey, {
					changed: true,
					entry: appendedEntry,
					row: appended.row,
					window: snapshot.window.row,
					sideTables: snapshot.sideTables
				});
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
				identity,
				postimages
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
//#endregion
export { sqliteSessionTranscriptTurnRebound as n, createSessionTranscriptTurnKernel as t };
