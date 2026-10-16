import { o as readSessionTranscriptActivePathEntryRelation } from "./session-accessor.sqlite-active-events-BE94zNkI.mjs";
import { n as readSessionTranscriptWatermarkInDatabase } from "./session-accessor.sqlite-transcript-watermark-D3Is2Kik.mjs";
//#region src/config/sessions/session-entry-patch-guard.ts
function sessionEntryPatchPredicateMatches(database, sessionKey, predicate) {
	if (!predicate) return true;
	if (readSessionTranscriptWatermarkInDatabase(database, predicate.sessionId).generation !== predicate.generation) return false;
	return !predicate.leafEntryId || readSessionTranscriptActivePathEntryRelation({
		agentId: database.agentId,
		storePath: database.path,
		sessionKey,
		sessionId: predicate.sessionId
	}, predicate.leafEntryId) !== "off-path";
}
//#endregion
export { sessionEntryPatchPredicateMatches as t };
