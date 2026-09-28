import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/session-placement-forced-terminal-settlement.ts
const forcedTerminalSettlement = resolveGlobalSingleton(Symbol.for("openclaw.sessionPlacementForcedTerminalSettlement"), () => new AsyncLocalStorage());
function withSessionPlacementForcedTerminalSettlement(settle, assertClaimCurrent, task) {
	return forcedTerminalSettlement.run({
		settle,
		assertCurrent: assertClaimCurrent
	}, task);
}
function resolveSessionPlacementForcedTerminalSettlement() {
	return forcedTerminalSettlement.getStore()?.settle;
}
function resolveSessionPlacementTurnSettlementAssertion() {
	return forcedTerminalSettlement.getStore()?.assertCurrent;
}
/** A new admission must acquire its own claim, never inherit its invoker's. */
function withoutSessionPlacementForcedTerminalSettlement(task) {
	return forcedTerminalSettlement.exit(task);
}
//#endregion
export { withoutSessionPlacementForcedTerminalSettlement as i, resolveSessionPlacementTurnSettlementAssertion as n, withSessionPlacementForcedTerminalSettlement as r, resolveSessionPlacementForcedTerminalSettlement as t };
