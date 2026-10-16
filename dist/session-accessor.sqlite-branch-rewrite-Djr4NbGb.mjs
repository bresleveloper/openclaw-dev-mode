import { i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { c as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { s as openOpenClawAgentDatabase, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import { n as assertOwnedTranscriptWriteCommit, t as SessionTranscriptWriterClaimReboundError, u as withOwnedSessionTranscriptWriterFence } from "./transcript-write-context-m7NE2aEm.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { d as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { y as withSessionPendingInputRelocation } from "./session-accessor.sqlite-pending-inputs-DtDOOibA.mjs";
import { l as redactTranscriptMessageForStorage, t as appendTranscriptEventInTransaction } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import { s as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-xJ1TJ9j2.mjs";
import { j as resolveTranscriptMessageAppendParent } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import { t as appendTranscriptMessageInTransaction } from "./session-accessor.sqlite-transcript-message-append-DoBG3JQd.mjs";
import { i as resolveTranscriptAppendRefusal } from "./session-accessor.sqlite-transcript-write-guard-zwgi538F.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-branch-rewrite.ts
/** Capture a constant-size snapshot; the session owner prepares payloads outside the write lock. */
function prepareTranscriptRewriteSync(scope, appendParentId, assertActive, loadedVersion, admit, preparation) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	const options = toDatabaseOptions(resolved);
	const database = openOpenClawAgentDatabase(options);
	if (database.db.isTransaction) throw new Error("Transcript rewrite must own its commit; run it outside the active transaction");
	assertActive();
	assertOwnedTranscriptWriteCommit(fencedScope);
	const version = readTranscriptContextVersionInTransaction(database, resolved.sessionId);
	const conflict = () => /* @__PURE__ */ new Error("Session transcript changed before rewrite publication");
	if (!loadedVersion || version.generation !== loadedVersion.generation || version.rawSeq !== loadedVersion.rawSeq || resolveTranscriptMessageAppendParent(database, resolved.sessionId, {}) !== appendParentId) throw conflict();
	return (entries, sources, adopt) => {
		if (openOpenClawAgentDatabase(options).db.isTransaction) throw new Error("Transcript rewrite must own its commit; run it outside the active transaction");
		if (!preparation?.messagesAlreadyRedacted) {
			for (const entry of entries) if (entry.type === "message") entry.message = redactTranscriptMessageForStorage(entry.message, {});
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
			if (currentVersion.generation !== version.generation || currentVersion.rawSeq !== version.rawSeq) throw conflict();
			for (const source of sources.values()) {
				const row = executeSqliteQueryTakeFirstSync(current.db, getSessionKysely(current.db).selectFrom("transcript_event_identities as identity").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select(transcriptEventJsonSql(current.db, "event").as("event_json")).where("identity.session_id", "=", resolved.sessionId).where("identity.event_id", "=", source.id));
				if (!row || !isDeepStrictEqual(JSON.parse(row.event_json), source)) throw conflict();
			}
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
						messageAlreadyRedacted: true,
						appendMode: entry.appendMode,
						idempotencyLookup: "caller-checked"
					}, void 0, preparation));
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
