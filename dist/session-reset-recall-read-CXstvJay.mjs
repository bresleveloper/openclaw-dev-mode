import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-CfuaO6_K.mjs";
import { y as readTranscriptExportSnapshotReadOnlySync } from "./session-accessor.sqlite-read-8qBtzC-z.mjs";
import { i as readSessionResetRecallCutoffInWorker } from "./openclaw-runtime-session-Daq6skjB.mjs";
import { t as resolveSessionResetRecallCutoff } from "./session-reset-recall-ZlAM1yc3.mjs";
//#region packages/memory-host-sdk/src/host/session-reset-recall-read.ts
/** Read only reset navigation; transcript bodies are irrelevant to recall visibility. */
function readSessionResetRecallCutoffInProcess(scope) {
	const snapshot = readTranscriptExportSnapshotReadOnlySync(scope, { projection: "reset-boundary" });
	return snapshot ? resolveSessionResetRecallCutoff(snapshot.events) : { state: "invalid" };
}
async function readSessionResetRecallCutoff(scope) {
	const read = () => isIncognitoSessionKey(scope.sessionKey) || isIncognitoOpenClawAgentSqlitePath(scope.storePath, { agentId: scope.agentId }) ? readSessionResetRecallCutoffInProcess(scope) : readSessionResetRecallCutoffInWorker(scope);
	try {
		return await read();
	} catch (error) {
		if (!(error instanceof SessionTranscriptColdError) || error.sessionId !== scope.sessionId) throw error;
		return readRestoredSessionTranscript(scope, read);
	}
}
//#endregion
export { readSessionResetRecallCutoffInProcess as n, readSessionResetRecallCutoff as t };
