import "./config-DH29aVhU.mjs";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-BbdrsVIR.mjs";
import "./session-accessor-BhE5D_VR.mjs";
import "./runs-1VQeqQMi.mjs";
import "./sessions-BvOnR0by.mjs";
import { t as bindGatewayLifecycleRequest } from "./server-recovery-runtime-context-DmpOWr_7.mjs";
import "./server-plugin-in-process-dispatch-DH0lDzzo.mjs";
import "./session-transcript-readers-CfvAyJeY.mjs";
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
