import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as acpSessionActorKey } from "./manager.utils-Cuk8oQ5a.mjs";
//#region src/acp/control-plane/active-turns.ts
/** Process-local active-turn registry for restart draining and ACP child admission. */
const ACP_ACTIVE_TURN_STATE_KEY = Symbol.for("openclaw.acp.activeTurns");
function getAcpActiveTurnState() {
	return resolveGlobalSingleton(ACP_ACTIVE_TURN_STATE_KEY, () => ({ activeTurnKeys: /* @__PURE__ */ new Map() }));
}
/** Registers the current turn and returns its ownership-checked release callback. */
function markAcpTurnActive(target) {
	if (!target.sessionKey) return;
	const actorKey = acpSessionActorKey(target);
	const owner = Symbol("acp-active-turn");
	const state = getAcpActiveTurnState();
	state.activeTurnKeys.set(actorKey, {
		token: owner,
		sessionKey: target.sessionKey,
		ownerSessionKey: target.ownerSessionKey
	});
	return () => {
		if (state.activeTurnKeys.get(actorKey)?.token === owner) state.activeTurnKeys.delete(actorKey);
	};
}
/** Number of currently owned ACP turns that must settle before restart. */
function getActiveAcpTurnCount() {
	return getAcpActiveTurnState().activeTurnKeys.size;
}
function listActiveAcpSessionsForOwner(ownerSessionKey) {
	return [...getAcpActiveTurnState().activeTurnKeys.values()].filter((turn) => turn.ownerSessionKey === ownerSessionKey).map((turn) => turn.sessionKey);
}
//#endregion
export { listActiveAcpSessionsForOwner as n, markAcpTurnActive as r, getActiveAcpTurnCount as t };
