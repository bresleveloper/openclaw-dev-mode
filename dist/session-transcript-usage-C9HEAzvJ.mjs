import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { i as resolveConcreteSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import "./paths-YgcBNLgG.mjs";
import { n as readLatestSessionUsageFromTranscriptFileAsync } from "./session-utils.fs-BfASFo7x.mjs";
import { g as readSessionTranscriptSummaryAsync } from "./session-transcript-readers-ChK_-oGN.mjs";
import path from "node:path";
//#region src/gateway/session-transcript-usage.ts
/** Reads aggregate usage from a full transcript asynchronously through the reader seam. */
async function readLatestSessionUsageFromTranscriptAsync(scope) {
	const artifactFile = scope.sessionFile?.trim();
	const concreteStorePath = resolveConcreteSessionStorePath(scope.storePath);
	const targetAgentId = scope.agentId?.trim() || resolveAgentIdFromSessionKey(scope.sessionKey);
	if (!Boolean(targetAgentId && scope.sessionKey?.trim() && concreteStorePath) && artifactFile && path.isAbsolute(artifactFile) && artifactFile.endsWith(".jsonl")) return await readLatestSessionUsageFromTranscriptFileAsync(scope.sessionId, concreteStorePath, artifactFile);
	const { usage } = await readSessionTranscriptSummaryAsync(scope, { kind: "usage" });
	return usage;
}
//#endregion
export { readLatestSessionUsageFromTranscriptAsync as t };
