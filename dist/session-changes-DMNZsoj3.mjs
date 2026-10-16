import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
//#region src/plugins/runtime/session-changes.ts
const subscribeRuntimeSessionChanges = (listener) => sessionChanges.subscribeFacts((change) => {
	if (!("sessionKey" in change)) return;
	const agentId = change.agentId ?? parseAgentSessionKey(change.sessionKey)?.agentId;
	if (!agentId) return;
	listener({
		agentId,
		sessionKey: change.sessionKey,
		...change.factsInvalidated === void 0 ? {} : { factsInvalidated: String(change.factsInvalidated) }
	});
});
//#endregion
export { subscribeRuntimeSessionChanges as t };
