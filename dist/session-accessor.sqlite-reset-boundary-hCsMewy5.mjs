import { u as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import "./openclaw-agent-db-_fC-kf1x.mjs";
import { Y as buildSessionResetBoundaryEvent } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { r as resolveResetBoundaryHeaderCwd } from "./transcript-header-DiYg502H.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-76OxWRqj.mjs";
import { t as appendTranscriptEventInTransaction } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { l as loadTranscriptEventsFromDatabase } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { t as clearSessionProgressCardForReset } from "./progress-card-store-BAskGyMI.mjs";
import { t as ensureTranscriptHeader } from "./session-accessor.sqlite-transcript-header-DxLFa_Iq.mjs";
//#region src/config/sessions/session-accessor.sqlite-reset-boundary.ts
/** Transcript reset and prior-task retirement share the owning guarded transaction. */
function appendSessionResetBoundary(database, scope, previousEntry, boundary, projection) {
	ensureTranscriptHeader(database, scope, resolveResetBoundaryHeaderCwd(previousEntry, boundary.cwd), projection);
	const event = buildSessionResetBoundaryEvent({
		events: loadTranscriptEventsFromDatabase(database, scope.sessionId, { projection: "reset-boundary" }),
		...boundary
	});
	if (appendTranscriptEventInTransaction(database, scope, event, projection) === false) throw new Error("Failed to append reset boundary for " + scope.sessionKey);
	if (boundary.context === "clear" && clearSessionProgressCardForReset(database.db, scope.sessionKey)) {
		const { agentId, sessionKey } = scope;
		deferOpenClawAgentPostCommitPublication(database, () => {
			emitSessionLifecycleEvent({
				agentId,
				sessionKey,
				reason: "progress-card-reset"
			});
		});
		return true;
	}
	return false;
}
//#endregion
export { appendSessionResetBoundary as t };
