import "./config-9720xhC5.mjs";
import { a as loadSessionEntry } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import "./runs-CzCPh-gu.mjs";
import "./sessions-D_sxp1B4.mjs";
import { t as bindGatewayLifecycleRequest } from "./server-recovery-runtime-context-Cl-1FBey.mjs";
import "./session-transcript-readers-Z-j3mApc.mjs";
import "./server-plugin-in-process-dispatch-CakmmEh-.mjs";
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
