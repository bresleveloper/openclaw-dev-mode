import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/cli-history-boundary.ts
const cliHistoryWriter = new AsyncLocalStorage();
/** The transcript tip moved between CLI history planning and the writer's commit. */
const CLI_HISTORY_CHANGED_BEFORE_PREPARATION = "CLI history changed before preparation";
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
/** Advance only a contiguous prefix owned by the same prepared CLI account. */
function advanceCliHistoryBoundary(entry, sessionId, generation, range, writer) {
	const boundary = entry?.cliHistoryBoundary;
	if (range.last < range.first || !entry || !isKnownCliHistoryBoundary(boundary) || entry.sessionId !== sessionId || boundary.sessionId !== sessionId || entry.activeWriterRunId !== writer.runId || entry.lifecycleRevision !== writer.lifecycleRevision || boundary.writerRunId !== writer.runId || boundary.authFingerprint !== writer.authFingerprint || (boundary.maxSeq === null ? range.first !== 0 : boundary.maxSeq !== range.first - 1) || !generation || (boundary.generation === null ? range.first !== 0 : boundary.generation !== generation)) return;
	return {
		...entry,
		cliHistoryBoundary: {
			...boundary,
			generation,
			maxSeq: range.last
		}
	};
}
//#endregion
export { runWithCliHistoryWriter as a, isKnownCliHistoryBoundary as i, advanceCliHistoryBoundary as n, getCliHistoryWriter as r, CLI_HISTORY_CHANGED_BEFORE_PREPARATION as t };
