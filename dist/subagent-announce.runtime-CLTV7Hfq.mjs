import "./config-DryArA1l.mjs";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import "./runs-ciDkXIOQ.mjs";
import "./sessions-Cesa3L0p.mjs";
import { t as bindGatewayLifecycleRequest } from "./server-recovery-runtime-context-DmpOWr_7.mjs";
import "./server-plugin-in-process-dispatch-BpUBEeez.mjs";
import "./session-transcript-readers-nuptsJ6Q.mjs";
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
