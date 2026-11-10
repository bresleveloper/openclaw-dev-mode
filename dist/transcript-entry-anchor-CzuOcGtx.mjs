import { a as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
//#region src/config/sessions/transcript-entry-anchor.ts
function sameTranscriptEntryAnchor(left, right) {
	return right !== void 0 && [
		"agentId",
		"sessionId",
		"sessionKey",
		"generation",
		"entryId",
		"rawSeq",
		"effectiveParentId",
		"activeMessagePosition"
	].every((field) => left[field] === right[field]) && (left.storePath === right.storePath || isSameOpenClawAgentDatabasePath(left.storePath, right.storePath));
}
//#endregion
export { sameTranscriptEntryAnchor as t };
