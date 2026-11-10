import { t as CLI_HISTORY_CHANGED_BEFORE_PREPARATION } from "./cli-history-boundary-B1eSXpAQ.mjs";
import { t as collectSessionEntryLookupKeys } from "./store-entry-CUxN9KZj.mjs";
import { a as assertConversationAuthority } from "./conversation-delivery-policy-BttgDEjN.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-B7chVWi3.mjs";
import { c as withSessionParticipantWriteSnapshot } from "./session-accessor.sqlite-participant-projection-B8eNZYGT.mjs";
import { _ as readSessionIdentitySnapshot, a as writeSessionEntry } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { n as readSessionTranscriptWatermarkInDatabase } from "./session-accessor.sqlite-transcript-watermark-CfdOKFaq.mjs";
import { t as assertLifecycleTargetSnapshotUnchanged } from "./session-accessor.sqlite-entry-equality-59qE2chV.mjs";
import { t as resolveConversationInDatabase } from "./session-accessor.sqlite-conversation-read-C_ZuagCK.mjs";
import { r as readActivePathEntryRelationFromProjection } from "./session-accessor.sqlite-transcript-anchor-Dc-2VOHU.mjs";
import { i as validateSessionTranscriptContextInDatabase } from "./session-accessor.sqlite-model-context-BymThP-K.mjs";
import { i as readCurrentProjectionSnapshot } from "./session-accessor.sqlite-projection-read-3DYCwfDO.mjs";
//#region src/config/sessions/session-entry-patch-guard.ts
/** CLI planning yields; admission and the exact tip belong to the writer's transaction. */
function assertSessionEntryPatchCliHistory(database, sessionKey, context) {
	if (!context) return;
	if (context.admission) validateSessionTranscriptContextInDatabase(database, {
		agentId: database.agentId,
		path: database.path,
		sessionKey,
		sessionId: context.sessionId
	}, { admission: context.admission });
	const fresh = readSessionTranscriptWatermarkInDatabase(database, context.sessionId);
	if (fresh.generation !== context.watermark.generation || fresh.maxSeq !== context.watermark.maxSeq) throw new Error(CLI_HISTORY_CHANGED_BEFORE_PREPARATION);
}
function readSessionEntryPatchPredicate(database, sessionKey, predicate, committedTranscript) {
	if (!predicate) return { matches: true };
	const watermark = committedTranscript?.sessionId === predicate.sessionId ? committedTranscript.watermark : readSessionTranscriptWatermarkInDatabase(database, predicate.sessionId);
	if (watermark.generation !== predicate.generation) return { matches: false };
	const transcriptPredicate = {
		sessionId: predicate.sessionId,
		watermark
	};
	const leafEntryId = predicate.leafEntryId;
	if (!leafEntryId) return {
		matches: true,
		transcriptPredicate
	};
	const projection = readCurrentProjectionSnapshot(database, {
		agentId: database.agentId,
		path: database.path,
		sessionKey,
		sessionId: predicate.sessionId
	}, (snapshot) => readActivePathEntryRelationFromProjection(snapshot, leafEntryId) !== "off-path");
	return {
		matches: projection.kind === "value" && projection.value,
		transcriptPredicate
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-mutation.ts
/** The caller owns transaction admission and publication after the durable commit. */
function replaceSessionEntryInDatabase(database, sessionKey, entry) {
	const identityKeys = collectSessionEntryLookupKeys(sessionKey);
	const previous = readSessionIdentitySnapshot(database, identityKeys);
	writeSessionEntry(database, sessionKey, entry);
	return {
		previous,
		current: readSessionIdentitySnapshot(database, identityKeys)
	};
}
/** Revalidate prepared rows and apply the patch on the already-admitted connection. */
function applySessionEntryPatchInDatabase(database, params) {
	if (params.validateCanonicalKeys) assertCanonicalSqliteSessionKeysCurrent(database);
	const fresh = withSessionParticipantWriteSnapshot(database.db, () => params.readSnapshot(database));
	assertLifecycleTargetSnapshotUnchanged(params.prepared, fresh, params.operationLabel);
	return writeSessionEntryPatchInDatabase(database, {
		...params,
		fresh
	});
}
/** Apply a patch evaluated against rows read in this same synchronous transaction. */
function writeSessionEntryPatchInDatabase(database, params) {
	const { fresh } = params;
	params.options.assertCommitAllowed?.();
	const conversation = params.options.workerGuard?.conversation;
	if (conversation) assertConversationAuthority(resolveConversationInDatabase(database, conversation.conversationRef), conversation);
	assertSessionEntryPatchCliHistory(database, params.sessionKey, params.options.workerGuard?.cliHistory);
	if (!params.next) return {
		applied: false,
		entry: structuredClone(params.writeBase)
	};
	const previous = new Map(fresh.map((row) => [row.sessionKey, row.entry]));
	const selectedPreviousEntry = fresh[0]?.entry ?? params.writeBase;
	const postimages = /* @__PURE__ */ new Map();
	const persisted = writeSessionEntry(database, params.sessionKey, params.next, {
		...params.options.consumePendingReset ? { consumePendingReset: true } : {},
		...params.options.providerReviewMutation ? { providerReviewMutation: true } : {},
		previousEntry: selectedPreviousEntry,
		postimages,
		canonicalPreviousEntry: fresh[0]?.sessionKey === params.sessionKey ? fresh[0].entry : null,
		...fresh[0]?.sessionKey === params.sessionKey ? {
			canonicalPreviousRow: fresh[0].row,
			canonicalPreviousWindow: fresh[0].window,
			canonicalPreviousSideTables: fresh[0].sideTables
		} : {}
	});
	if (postimages.get(params.sessionKey)?.changed === false) return {
		applied: true,
		entry: persisted
	};
	return {
		applied: true,
		entry: persisted,
		identity: {
			previous,
			current: /* @__PURE__ */ new Map([[params.sessionKey, persisted]])
		},
		postimages
	};
}
//#endregion
export { readSessionEntryPatchPredicate as i, replaceSessionEntryInDatabase as n, writeSessionEntryPatchInDatabase as r, applySessionEntryPatchInDatabase as t };
