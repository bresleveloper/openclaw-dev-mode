import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
//#region src/plugins/runtime/session-changes.ts
const subscribeRuntimeSessionChanges = (listener) => sessionChanges.subscribeProjection((change) => {
	if (!("sessionKey" in change)) return;
	const agentId = change.agentId ?? parseAgentSessionKey(change.sessionKey)?.agentId;
	if (!agentId) return;
	const factsInvalidated = change.factsInvalidated ?? (change.facts?.kind === "category" ? "category" : void 0);
	listener({
		agentId,
		sessionKey: change.sessionKey,
		...factsInvalidated === void 0 ? {} : { factsInvalidated: String(factsInvalidated) }
	});
});
//#endregion
export { subscribeRuntimeSessionChanges as t };
