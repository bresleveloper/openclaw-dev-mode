import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { u as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { c as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { i as prepareSessionIdentityPublication } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { n as assertCanonicalSessionKeyWrite } from "./session-canonical-key-B7chVWi3.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { m as readSessionEntryRowScan, r as parseReadableSqliteSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { a as writeSessionEntry } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { c as getOwnedSessionTranscriptInitialWriter, h as withOwnedSessionTranscriptWriterFence, t as assertOwnedTranscriptWriteCommit } from "./transcript-write-context-C02sC3zd.mjs";
//#region src/config/sessions/session-accessor.sqlite-initial-entry.ts
/** The transaction owns absence and writer-row checks; callers publish only committed facts. */
function ensureSessionEntryInTransaction(database, resolved, scope, entry, initialWriterRunId) {
	const snapshot = readSessionEntryRowScan(database, resolved.sessionKey);
	const existing = snapshot?.selected?.entry;
	if (existing) {
		if (initialWriterRunId !== void 0) throw new SessionTranscriptWriterClaimReboundError();
		return { owned: existing.sessionId === entry.sessionId };
	}
	if (scope.expectedOwner !== void 0 || scope.expectedWriterRunId !== void 0 && initialWriterRunId === void 0) return { owned: false };
	const previous = /* @__PURE__ */ new Map();
	for (const row of snapshot?.rows ?? []) {
		const previousEntry = parseReadableSqliteSessionEntryRow(database, row);
		if (previousEntry) previous.set(row.session_key, previousEntry);
	}
	const persisted = writeSessionEntry(database, resolved.sessionKey, initialWriterRunId !== void 0 ? {
		...entry,
		activeWriterRunId: initialWriterRunId
	} : entry, { canonicalPreviousEntry: null });
	const current = new Map(previous).set(resolved.sessionKey, persisted);
	const owned = persisted.sessionId === entry.sessionId;
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
	}, toDatabaseOptions(resolved), { operationLabel: "session.entry.ensure" });
	if (!initializing) publishCommitted?.();
	if (fencedScope.expectedWriterRunId !== void 0 && !owned) throw new SessionTranscriptWriterClaimReboundError();
	return owned;
}
//#endregion
export { ensureSessionEntrySync as n, ensureSessionEntryInTransaction as t };
