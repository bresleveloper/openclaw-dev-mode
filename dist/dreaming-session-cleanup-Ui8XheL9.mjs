import { t as cleanupSessionLifecycleArtifacts } from "./session-store-runtime-XTMMGjZf.mjs";
//#region extensions/memory-core/src/dreaming-session-cleanup.ts
const DREAMING_SESSION_KEY_PREFIX = "dreaming-narrative-";
const DREAMING_ORPHAN_MIN_AGE_MS = 3e5;
const DREAMING_TRANSCRIPT_RUN_MARKER = "\"runId\":\"dreaming-narrative-";
async function scrubDreamingNarrativeArtifacts(params) {
	const result = await cleanupSessionLifecycleArtifacts({
		agentId: params.agentId,
		archiveRemovedEntryTranscripts: false,
		orphanTranscriptMinAgeMs: DREAMING_ORPHAN_MIN_AGE_MS,
		pluginOwnerId: "memory-core",
		sessionStore: params.config.session?.store,
		sessionKeySegmentPrefix: DREAMING_SESSION_KEY_PREFIX,
		transcriptContentMarker: DREAMING_TRANSCRIPT_RUN_MARKER,
		...params.nowMs === void 0 ? {} : { nowMs: params.nowMs }
	});
	const prunedEntries = result.removedEntries;
	const archivedOrphans = result.archivedTranscriptArtifacts;
	if (prunedEntries > 0 || archivedOrphans > 0) params.logger.info(`memory-core: dreaming cleanup scrubbed ${prunedEntries} stale session entr${prunedEntries === 1 ? "y" : "ies"} and archived ${archivedOrphans} orphan transcript${archivedOrphans === 1 ? "" : "s"}.`);
}
//#endregion
export { DREAMING_ORPHAN_MIN_AGE_MS, scrubDreamingNarrativeArtifacts };
