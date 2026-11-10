import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { u as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { c as runOpenClawAgentWriteTransaction, o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { s as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { o as sanitizeTranscriptMessageForStorage, t as appendTranscriptEventInTransaction } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { _ as withSessionPendingInputRelocation } from "./session-accessor.sqlite-pending-inputs-dFWJwbQM.mjs";
import { c as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { h as withOwnedSessionTranscriptWriterFence, t as assertOwnedTranscriptWriteCommit } from "./transcript-write-context-C02sC3zd.mjs";
import { r as resolveTranscriptAppendRefusal } from "./session-accessor.sqlite-transcript-write-guard-C3zmfbiJ.mjs";
import { t as appendTranscriptMessageInTransaction } from "./session-accessor.sqlite-transcript-message-append-DFcvBgrv.mjs";
//#region src/config/sessions/session-accessor.sqlite-branch-rewrite.ts
/** The session owner prepares payloads; the transaction checks their source version once. */
function prepareTranscriptRewriteSync(scope, assertActive, loadedVersion, admit, preparation) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	const options = toDatabaseOptions(resolved);
	if (openOpenClawAgentDatabase(options).db.isTransaction) throw new Error("Transcript rewrite must own its commit; run it outside the active transaction");
	assertActive();
	assertOwnedTranscriptWriteCommit(fencedScope);
	const conflict = () => /* @__PURE__ */ new Error("Session transcript changed before rewrite publication");
	if (!loadedVersion) throw conflict();
	return (entries, sources, adopt) => {
		if (openOpenClawAgentDatabase(options).db.isTransaction) throw new Error("Transcript rewrite must own its commit; run it outside the active transaction");
		if (!preparation?.messagesAlreadyRedacted) {
			for (const entry of entries) if (entry.type === "message") entry.message = sanitizeTranscriptMessageForStorage(entry.message);
		}
		let committedVersion;
		runOpenClawAgentWriteTransaction((current) => {
			admit?.("transaction");
			if (!deferOpenClawAgentPostCommitPublication(current, () => adopt(committedVersion))) throw new Error("Transcript rewrite requires a commit publication");
			assertActive();
			assertOwnedTranscriptWriteCommit(fencedScope);
			const fresh = readSessionEntryRow(current, resolved.sessionKey);
			const refusal = resolveTranscriptAppendRefusal(fresh?.entry, resolved, fencedScope);
			if (refusal) throw new SessionTranscriptWriterClaimReboundError(refusal);
			const currentVersion = readTranscriptContextVersionInTransaction(current, resolved.sessionId);
			if (currentVersion.generation !== loadedVersion.generation || currentVersion.rawSeq !== loadedVersion.rawSeq || currentVersion.updatedAt !== loadedVersion.updatedAt) throw conflict();
			for (const entry of entries) {
				assertActive();
				assertOwnedTranscriptWriteCommit(fencedScope);
				if (entry.type === "message") {
					const source = sources.get(entry.id);
					if (!source) throw new Error("Transcript rewrite message has no source entry");
					const result = withSessionPendingInputRelocation(source.id, entry.message, () => appendTranscriptMessageInTransaction(current, resolved, {
						eventId: entry.id,
						parentId: entry.parentId,
						now: Date.parse(entry.timestamp),
						message: entry.message,
						appendMode: entry.appendMode,
						idempotencyLookup: "caller-checked"
					}, void 0, preparation)?.result);
					if (!result?.appended || result.messageId !== entry.id) throw new Error("Transcript rewrite message was not appended");
					entry.message = result.message;
				} else if (!appendTranscriptEventInTransaction(current, resolved, entry, preparation)) throw new Error("Transcript rewrite entry was not appended");
			}
			assertActive();
			assertOwnedTranscriptWriteCommit(fencedScope);
			committedVersion = readTranscriptContextVersionInTransaction(current, resolved.sessionId);
			admit?.("commit");
		}, options, { operationLabel: "session.transcript.prepare-rewrite" });
	};
}
//#endregion
export { prepareTranscriptRewriteSync as t };
