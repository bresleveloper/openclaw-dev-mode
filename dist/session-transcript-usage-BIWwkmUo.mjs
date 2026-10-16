import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { r as resolveConcreteSessionStorePath } from "./paths-dpReqUI8.mjs";
import { a as readRecentSessionTranscriptMessageEvents } from "./session-accessor.sqlite-active-events-BE94zNkI.mjs";
import { i as resolveSessionTranscriptReadTarget } from "./session-accessor.transcript-target-CpxKGy_2.mjs";
import { n as toTranscriptReadScope } from "./session-transcript-read-target-BsloKGMb.mjs";
import { t as aggregateSessionTranscriptUsage } from "./session-transcript-derived-readers-B5MmwB8i.mjs";
import { m as readSessionTranscriptSummaryAsync, v as readLatestSessionUsageFromTranscriptFileAsync } from "./session-transcript-readers-CDyCeaj9.mjs";
import path from "node:path";
//#region src/gateway/session-transcript-usage.ts
/** Reads aggregate usage from a full transcript asynchronously through the reader seam. */
async function readLatestSessionUsageFromTranscriptAsync(scope) {
	const artifactFile = scope.sessionFile?.trim();
	const concreteStorePath = resolveConcreteSessionStorePath(scope.storePath);
	const targetAgentId = scope.agentId?.trim() || resolveAgentIdFromSessionKey(scope.sessionKey);
	if (!Boolean(targetAgentId && scope.sessionKey?.trim() && concreteStorePath) && artifactFile && path.isAbsolute(artifactFile) && artifactFile.endsWith(".jsonl")) return await readLatestSessionUsageFromTranscriptFileAsync(scope.sessionId, concreteStorePath, artifactFile, void 0);
	const { usage } = await readSessionTranscriptSummaryAsync(scope, { kind: "usage" });
	return usage;
}
/** Reads aggregate usage from a bounded transcript tail synchronously through the reader seam. */
function readRecentSessionUsageFromTranscript(scope, maxBytes) {
	const target = resolveSessionTranscriptReadTarget(scope);
	const page = readRecentSessionTranscriptMessageEvents(toTranscriptReadScope(target), {
		maxBytes: Math.max(1024, Math.floor(Number.isFinite(maxBytes) ? maxBytes : 8388608)),
		maxLines: 1e3,
		maxMessages: 1e3
	});
	return aggregateSessionTranscriptUsage(page.events.map((entry) => asOptionalRecord(entry.event)?.message));
}
//#endregion
export { readRecentSessionUsageFromTranscript as n, readLatestSessionUsageFromTranscriptAsync as t };
