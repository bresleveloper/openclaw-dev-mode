import "./config-CEUrg-wS.mjs";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-BS_nB9DT.mjs";
import "./session-accessor-hXSUswC9.mjs";
import "./runs-DA0exOSb.mjs";
import "./sessions-BvWA0t48.mjs";
import { t as bindGatewayLifecycleRequest } from "./server-recovery-runtime-context-DmpOWr_7.mjs";
import "./server-plugin-in-process-dispatch-BFifwogr.mjs";
import "./session-transcript-readers-fTop43cz.mjs";
//#region src/agents/subagents/announce/subagent-announce.runtime.ts
/**
* Runtime dependency barrel for subagent announcement/output collection.
*
* Keeping these imports behind one module lets tests replace gateway/session
* IO without changing the announce logic itself.
*/
function readSubagentSessionEntry(storePath, sessionKey) {
	return loadSessionEntry({
		storePath,
		sessionKey
	});
}
const callSubagentLifecycleGateway = (request) => bindGatewayLifecycleRequest()(request);
//#endregion
export { readSubagentSessionEntry as n, callSubagentLifecycleGateway as t };
