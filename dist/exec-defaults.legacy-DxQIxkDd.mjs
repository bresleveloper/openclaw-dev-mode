import { a as resolveNodeExecEligibility, n as resolveExecConfigState, r as resolveExecDefaults } from "./exec-defaults-DrIV-0KT.mjs";
import { t as resolveSandboxRuntimeStatusLegacy } from "./runtime-status.legacy-Bb9ESsk0.mjs";
//#region src/agents/exec-defaults.legacy.ts
/** @deprecated Only for synchronous Plugin SDK compatibility; use resolveExecDefaultsAsync. */
function resolveExecDefaultsLegacy(params) {
	const { agentId } = resolveExecConfigState(params);
	return resolveExecDefaults(params, params.sessionKey ? resolveSandboxRuntimeStatusLegacy({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId
	}) : void 0);
}
/** @deprecated Only for synchronous skill-command discovery compatibility. */
function resolveNodeExecEligibilityLegacy(params) {
	return resolveNodeExecEligibility(params, resolveExecDefaultsLegacy(params));
}
//#endregion
export { resolveNodeExecEligibilityLegacy as n, resolveExecDefaultsLegacy as t };
