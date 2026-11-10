import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as redactIdentifier } from "./node-crypto-BG4u3UnX.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { u as transcriptWriteScopeIsCurrent } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-CWFSrppd.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { t as assertOwnedTranscriptWriteCommit } from "./transcript-write-context-C02sC3zd.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-write-guard.ts
function assertNonMessageTranscriptEvent(event) {
	if (isRecord(event) && "type" in event && event.type === "message") throw new Error("appendTranscriptEvent cannot write message transcript records; use appendTranscriptMessage instead.");
}
function resolveTranscriptAppendRefusal(entry, resolved, scope) {
	if (transcriptWriteScopeIsCurrent(entry, resolved.sessionId, scope)) return;
	const identity = {
		agentIdHash: redactIdentifier(resolved.agentId),
		expectedSessionIdHash: redactIdentifier(resolved.sessionId),
		sessionKeyHash: redactIdentifier(resolved.sessionKey)
	};
	if (!entry) return {
		...identity,
		code: "session-entry-missing"
	};
	return {
		...identity,
		actualSessionIdHash: redactIdentifier(entry.sessionId),
		code: "session-rebound"
	};
}
function assertLockedTranscriptWriteAllowed(database, resolved, scope) {
	assertSessionTranscriptHot(database.db, resolved.sessionId);
	const fencedScope = {
		...scope,
		sessionId: resolved.sessionId,
		sessionKey: resolved.sessionKey
	};
	assertOwnedTranscriptWriteCommit(fencedScope);
	if (fencedScope.expectedLifecycleRevision === void 0 && fencedScope.expectedWriterRunId === void 0 && fencedScope.expectedOwner === void 0) return;
	const fresh = readSessionEntryRow(database, resolved.sessionKey);
	const refusal = resolveTranscriptAppendRefusal(fresh?.entry, resolved, fencedScope);
	if (refusal) throw new SessionTranscriptWriterClaimReboundError(refusal);
	return fresh?.entry;
}
//#endregion
export { assertNonMessageTranscriptEvent as n, resolveTranscriptAppendRefusal as r, assertLockedTranscriptWriteAllowed as t };
