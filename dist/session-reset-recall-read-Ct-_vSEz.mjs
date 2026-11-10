import { t as resolveSessionResetRecallCutoff } from "./session-reset-recall-Be-x5cWW.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CWFSrppd.mjs";
import { t as readRestoredSessionTranscript } from "./session-cold-storage-read-DxurMT4l.mjs";
import { S as readTranscriptExportSnapshotReadOnlySync } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { s as readSessionResetRecallCutoffInWorker, t as captureIncognitoMemoryReader } from "./openclaw-runtime-session-Du3RWOJ8.mjs";
//#region packages/memory-host-sdk/src/host/session-reset-recall-read.ts
/** Read only reset navigation; transcript bodies are irrelevant to recall visibility. */
function readSessionResetRecallCutoffInProcess(scope) {
	const snapshot = readTranscriptExportSnapshotReadOnlySync(scope, { projection: "reset-boundary" });
	return snapshot ? resolveSessionResetRecallCutoff(snapshot.events) : { state: "invalid" };
}
async function readSessionResetRecallCutoff(scope) {
	const source = captureIncognitoMemoryReader(scope);
	if (source) return source.memoryResetRecall();
	const read = () => readSessionResetRecallCutoffInWorker(scope);
	try {
		return await read();
	} catch (error) {
		if (!(error instanceof SessionTranscriptColdError) || error.sessionId !== scope.sessionId) throw error;
		return readRestoredSessionTranscript(scope, read);
	}
}
//#endregion
export { readSessionResetRecallCutoffInProcess as n, readSessionResetRecallCutoff as t };
