import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listSessionTranscriptInstances } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { n as readMemorySessionTargets, t as projectSessionMetadata } from "./session-memory-targets-Ctc6HX_o.mjs";
import "./session-transcript-inventory-runtime-DuZB__vC.mjs";
import "./query-expansion-CBz4n5iE.mjs";
import "./openclaw-runtime-session-CtDUsooQ.mjs";
import "./session-files-Cw_0yyPO.mjs";
import "./session-reset-recall-read-CskgEhwv.mjs";
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
