import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listSessionTranscriptInstances } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { n as readMemorySessionTargets, t as projectSessionMetadata } from "./session-memory-targets-DRzulbKx.mjs";
import "./session-transcript-inventory-runtime-L37QW-fd.mjs";
import "./query-expansion-CBz4n5iE.mjs";
import "./openclaw-runtime-session-Daq6skjB.mjs";
import "./session-files-DeB3fQWn.mjs";
import "./session-reset-recall-read-CXstvJay.mjs";
//#region src/plugin-sdk/memory-core-host-engine-sessions.ts
/** Private-local SDK subpath for memory session transcript helpers. */
/** Read authoritative admission facts without creating a missing agent database. */
function loadMemorySessionMetadata(params) {
	const instance = listSessionTranscriptInstances(params, {
		includeAllWindows: true,
		sessionId: params.sessionId
	}).find((candidate) => candidate.agentId === normalizeAgentId(params.agentId) && (!params.sessionKey || candidate.sessionKey === params.sessionKey));
	return instance ? projectSessionMetadata(instance) : void 0;
}
/** @deprecated Use resolveMemorySessionTargetsAsync; removed at the next Plugin SDK major. */
function resolveMemorySessionTargets(params) {
	return readMemorySessionTargets(params);
}
//#endregion
export { resolveMemorySessionTargets as n, loadMemorySessionMetadata as t };
