import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { t as acpSessionActorKey } from "./manager.utils-D-EbA2WL.mjs";
//#region src/acp/control-plane/active-turns.ts
/** Process-local active-turn registry for ACP maintenance and recovery decisions. */
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
	state.activeTurnKeys.set(actorKey, owner);
	return () => {
		if (state.activeTurnKeys.get(actorKey) === owner) state.activeTurnKeys.delete(actorKey);
	};
}
/** Returns whether the process currently owns an in-flight ACP turn for a session. */
function isAcpTurnActive(target) {
	if (!target.sessionKey) return false;
	return getAcpActiveTurnState().activeTurnKeys.has(acpSessionActorKey(target));
}
//#endregion
export { markAcpTurnActive as n, isAcpTurnActive as t };
