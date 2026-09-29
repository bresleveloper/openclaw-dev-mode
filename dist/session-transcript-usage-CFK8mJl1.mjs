import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { r as resolveConcreteSessionStorePath } from "./paths-CcMbq5NY.mjs";
import { n as readRestoredSessionTranscript } from "./session-cold-storage-read-BK-Qc6S7.mjs";
import { r as resolveSessionTranscriptReadTarget } from "./session-accessor.transcript-target-w5-iuMeM.mjs";
import { d as visitSessionTranscriptMessageEvents, i as readRecentSessionTranscriptMessageEvents } from "./session-accessor.sqlite-active-events-Cnt-hBim.mjs";
import { i as createSessionTranscriptUsageAccumulator, n as readLatestSessionUsageFromTranscriptFileAsync, r as aggregateSessionTranscriptUsage } from "./session-utils.fs-B4keyzHX.mjs";
import { n as toTranscriptReadScope } from "./session-transcript-read-target-Cmb7QmaZ.mjs";
import path from "node:path";
//#region src/gateway/session-transcript-usage.ts
function extractMessagePayloads(entries) {
	return entries.map((entry) => asOptionalRecord(entry.event)?.message);
}
/** Reads aggregate usage from a full transcript asynchronously through the reader seam. */
async function readLatestSessionUsageFromTranscriptAsync(scope) {
	const artifactFile = scope.sessionFile?.trim();
	const concreteStorePath = resolveConcreteSessionStorePath(scope.storePath);
	const targetAgentId = scope.agentId?.trim() || resolveAgentIdFromSessionKey(scope.sessionKey);
	if (!Boolean(targetAgentId && scope.sessionKey?.trim() && concreteStorePath) && artifactFile && path.isAbsolute(artifactFile) && artifactFile.endsWith(".jsonl")) return await readLatestSessionUsageFromTranscriptFileAsync(scope.sessionId, concreteStorePath, artifactFile, void 0);
	const target = resolveSessionTranscriptReadTarget(scope);
	const transcriptScope = toTranscriptReadScope(target);
	return readRestoredSessionTranscript(transcriptScope, () => {
		const usage = createSessionTranscriptUsageAccumulator();
		visitSessionTranscriptMessageEvents(transcriptScope, (entry) => {
			usage.add(asOptionalRecord(entry.event)?.message);
		});
		return usage.finish();
	});
}
/** Reads aggregate usage from a bounded transcript tail synchronously through the reader seam. */
function readRecentSessionUsageFromTranscript(scope, maxBytes) {
	const target = resolveSessionTranscriptReadTarget(scope);
	const page = readRecentSessionTranscriptMessageEvents(toTranscriptReadScope(target), {
		maxBytes: Math.max(1024, Math.floor(Number.isFinite(maxBytes) ? maxBytes : 8388608)),
		maxLines: 1e3,
		maxMessages: 1e3
	});
	return aggregateSessionTranscriptUsage(extractMessagePayloads(page.events));
}
//#endregion
export { readRecentSessionUsageFromTranscript as n, readLatestSessionUsageFromTranscriptAsync as t };
