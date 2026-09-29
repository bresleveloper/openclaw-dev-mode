import { a as deferOpenClawAgentPostCommitPublication, f as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CaQAStOA.mjs";
import { n as assertOwnedTranscriptWriteCommit, o as getOwnedSessionTranscriptInitialWriter, t as SessionTranscriptWriterClaimReboundError, u as withOwnedSessionTranscriptWriterFence } from "./transcript-write-context-MlBhwaKa.mjs";
import { t as collectSessionEntryLookupKeys } from "./store-entry-DuM7NmYY.mjs";
import { g as toDatabaseOptions, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { c as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { n as assertCanonicalSessionKeyWrite } from "./session-canonical-key-BBylVEaq.mjs";
import { c as readSessionIdentitySnapshot, f as writeSessionEntry } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { r as prepareSessionIdentityPublication } from "./session-accessor.sqlite-identity-Can_jxkB.mjs";
//#region src/config/sessions/session-accessor.sqlite-initial-entry.ts
/** Lazy session identity creation, including the original admission's first writer claim. */
/** The transaction owns absence and writer-row checks; callers publish only committed facts. */
function ensureSessionEntryInTransaction(database, resolved, scope, entry, initialWriterRunId) {
	const identityKeys = collectSessionEntryLookupKeys(database, resolved.sessionKey);
	const previous = readSessionIdentitySnapshot(database, identityKeys);
	const existing = readSessionEntryRow(database, resolved.sessionKey)?.entry;
	if (existing) {
		if (initialWriterRunId !== void 0) throw new SessionTranscriptWriterClaimReboundError();
		return { owned: existing.sessionId === entry.sessionId };
	}
	if (scope.expectedWriterRunId !== void 0 && initialWriterRunId === void 0) return { owned: false };
	const persisted = writeSessionEntry(database, resolved.sessionKey, initialWriterRunId !== void 0 ? {
		...entry,
		activeWriterRunId: initialWriterRunId
	} : entry);
	const current = readSessionIdentitySnapshot(database, identityKeys);
	const owned = current.get(resolved.sessionKey)?.sessionId === entry.sessionId;
	if (initialWriterRunId !== void 0) {
		if (!owned || persisted.activeWriterRunId !== initialWriterRunId) throw new SessionTranscriptWriterClaimReboundError();
		return {
			owned,
			fence: {
				expectedLifecycleRevision: persisted.lifecycleRevision,
				expectedWriterRunId: persisted.activeWriterRunId
			},
			identity: {
				previous,
				current
			}
		};
	}
	return {
		owned,
		identity: {
			previous,
			current
		}
	};
}
/** Creates a missing session identity without replacing a concurrently owned row. */
function ensureSessionEntrySync(scope, entry) {
	const initialWriter = getOwnedSessionTranscriptInitialWriter({ sessionTarget: {
		...scope,
		sessionId: entry.sessionId
	} });
	const initializing = initialWriter && !initialWriter.committedFence;
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteScope(fencedScope);
	assertCanonicalSessionKeyWrite(resolved.sessionKey, resolved.agentId);
	let owned = false;
	const publishCommitted = runOpenClawAgentWriteTransaction((database) => {
		assertOwnedTranscriptWriteCommit({
			...fencedScope,
			sessionId: entry.sessionId
		});
		const committed = ensureSessionEntryInTransaction(database, resolved, fencedScope, entry, initializing ? initialWriter.writerRunId : void 0);
		owned = committed.owned;
		if (!committed.identity) return;
		const publish = prepareSessionIdentityPublication(database, resolved.agentId, committed.identity.previous, committed.identity.current);
		if (initializing && committed.fence) {
			const fence = committed.fence;
			if (!deferOpenClawAgentPostCommitPublication(database, () => {
				try {
					initialWriter.recordCommitted(fence);
				} finally {
					publish();
				}
			})) throw new Error("initial session writer requires a managed commit boundary");
		}
		return publish;
	}, toDatabaseOptions(resolved));
	if (!initializing) publishCommitted?.();
	if (fencedScope.expectedWriterRunId !== void 0 && !owned) throw new SessionTranscriptWriterClaimReboundError();
	return owned;
}
//#endregion
export { ensureSessionEntrySync as n, ensureSessionEntryInTransaction as t };
