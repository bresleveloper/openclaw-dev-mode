import "./config-Ciq2mxdN.mjs";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import "./runs-Cjzxx3Pg.mjs";
import "./sessions-DE4llkPV.mjs";
import { t as bindGatewayLifecycleRequest } from "./server-recovery-runtime-context-DmpOWr_7.mjs";
import "./server-plugin-in-process-dispatch-kZUX_Us7.mjs";
import "./session-transcript-readers-Bmg2Zjrq.mjs";
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
