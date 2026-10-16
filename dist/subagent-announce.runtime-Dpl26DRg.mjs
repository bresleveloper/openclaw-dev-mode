import "./config-CzeZu5J_.mjs";
import { a as loadSessionEntry } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import "./runs-BErx7xDZ.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { t as bindGatewayLifecycleRequest } from "./server-recovery-runtime-context-Cl-1FBey.mjs";
import "./session-transcript-readers-CDyCeaj9.mjs";
import "./server-plugin-in-process-dispatch-BzMtb5Z5.mjs";
//#region src/agents/subagents/announce/subagent-announce.runtime.ts
function readSubagentSessionEntry(storePath, sessionKey) {
	return loadSessionEntry({
		storePath,
		sessionKey
	});
}
const callSubagentLifecycleGateway = (request) => bindGatewayLifecycleRequest()(request);
//#endregion
export { readSubagentSessionEntry as n, callSubagentLifecycleGateway as t };
