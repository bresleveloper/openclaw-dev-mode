import { gt as selectMemorySessionTargets } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { n as listSessionTranscriptArchivesReadOnly } from "./session-accessor.sqlite-history-DHJfVW84.mjs";
import { t as listSessionTranscriptInstances } from "./session-history-BKt1cI8X.mjs";
import { t as listSessionParticipantsReadOnly } from "./session-accessor.sqlite-participant-read-BB88Lmot.mjs";
//#region src/config/sessions/session-memory-targets.ts
/** Resolve explicit memory-forget selectors against authoritative session owners. */
function readMemorySessionTargets(params, continuation) {
	if (!params.sessionIds?.length && !params.hookSources?.length && !params.participants?.length) return [];
	return selectMemorySessionTargets(params, {
		instances: listSessionTranscriptInstances(params, { includeAllWindows: true }, continuation),
		participants: new Map([...listSessionParticipantsReadOnly(params)].map(([key, rows]) => [key, rows.map(({ identity }) => identity)])),
		archives: listSessionTranscriptArchivesReadOnly({
			...params,
			sessionIds: [...new Set(params.sessionIds ?? [])]
		})
	});
}
//#endregion
export { readMemorySessionTargets as t };
