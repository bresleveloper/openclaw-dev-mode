import { r as WorkerTaskError } from "./src-WCJCjrey.mjs";
import "./worker-task-pool-iI3pfrsK.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
//#region src/gateway/session-history-error.ts
function resolveSessionHistoryUnavailableMessage(error) {
	if (isSessionTranscriptProjectionUnavailableError(error)) return error.reason === "window-changed" ? "session history window changed; reload the conversation" : "session history is rebuilding; retry shortly";
	if (!(error instanceof WorkerTaskError)) return;
	switch (error.code) {
		case "overloaded": return "session history is busy; retry shortly";
		case "unavailable": return "session history is temporarily unavailable; retry shortly";
		case "timeout": return "session history read timed out; retry shortly";
		default: return;
	}
}
//#endregion
export { resolveSessionHistoryUnavailableMessage as t };
