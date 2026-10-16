import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/cli-history-boundary.ts
const cliHistoryWriter = new AsyncLocalStorage();
function runWithCliHistoryWriter(writer, run) {
	return writer ? cliHistoryWriter.run(writer, run) : cliHistoryWriter.exit(run);
}
function getCliHistoryWriter(target) {
	const writer = cliHistoryWriter.getStore();
	return writer && writer.target.agentId === target.agentId && writer.target.sessionId === target.sessionId && writer.target.sessionKey === target.sessionKey && writer.target.storePath === target.storePath ? writer : void 0;
}
function isKnownCliHistoryBoundary(boundary) {
	return boundary?.version === 1 && boundary.state === "known" && typeof boundary.sessionId === "string" && boundary.sessionId.length > 0 && typeof boundary.authFingerprint === "string" && /^[a-f0-9]{64}$/.test(boundary.authFingerprint) && (boundary.generation === null || typeof boundary.generation === "string" && boundary.generation.length > 0) && (boundary.maxSeq === null || boundary.generation !== null && Number.isSafeInteger(boundary.maxSeq) && boundary.maxSeq >= 0) && typeof boundary.writerRunId === "string" && boundary.writerRunId.length > 0;
}
//#endregion
export { isKnownCliHistoryBoundary as n, runWithCliHistoryWriter as r, getCliHistoryWriter as t };
