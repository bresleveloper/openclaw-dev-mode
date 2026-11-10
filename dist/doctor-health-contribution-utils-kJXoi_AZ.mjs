import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { l as tryResolveSoleAgentId } from "./agent-roster-gkYP38su.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { l as isLegacyParentWritableUpdateDoctorPass } from "./update-phase-M5rvMZiC.mjs";
//#region src/flows/doctor-health-contribution-utils.ts
function isUpdateDoctorRun(env) {
	const value = env.OPENCLAW_UPDATE_IN_PROGRESS;
	return value === "1" || value === "true";
}
function resolveDoctorMode(cfg) {
	return cfg.gateway?.mode === "remote" ? "remote" : "local";
}
function resolveDoctorWorkspaceDir(cfg, env = process.env) {
	const agentId = tryResolveSoleAgentId(cfg);
	return agentId ? resolveAgentWorkspaceDir(cfg, agentId, env) : void 0;
}
function resolveLegacyParentVersionOverride(ctx) {
	if (!isLegacyParentWritableUpdateDoctorPass(ctx.env ?? process.env)) return {};
	const version = ctx.configResult.sourceLastTouchedVersion?.trim();
	return version ? { lastTouchedVersionOverride: version } : {};
}
function noteDoctorRepairResult(result, note) {
	for (const kind of ["changes", "warnings"]) if (result[kind].length > 0) note(result[kind].join("\n"), `Doctor ${kind}`);
}
//#endregion
export { resolveLegacyParentVersionOverride as a, resolveDoctorWorkspaceDir as i, noteDoctorRepairResult as n, resolveDoctorMode as r, isUpdateDoctorRun as t };
