import { t as createSessionTranscriptHeader } from "./transcript-header-DiYg502H.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { x as hasStoredTranscriptEvents } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { t as appendTranscriptEventInTransaction } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-header.ts
function ensureTranscriptHeader(database, scope, cwd, projection) {
	const actor = readSessionActorTransactionState(database, scope);
	if (actor && actor.hot.transcript.version.rawSeq !== null) return;
	if (!actor && hasStoredTranscriptEvents(database, scope.sessionId)) return;
	appendTranscriptEventInTransaction(database, scope, createSessionTranscriptHeader({
		cwd,
		sessionId: scope.sessionId
	}), projection);
}
//#endregion
export { ensureTranscriptHeader as t };
