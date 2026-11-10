import { n as __exportAll } from "./sqlite-readonly-rolldown-runtime-XITHOX9H.mjs";
import { t as createSubsystemLogger } from "./sqlite-readonly-subsystem-DxzYbxOQ.mjs";
import { X as isSameOpenClawAgentDatabasePath } from "./sqlite-readonly-sqlite-snapshot-staging-owner-DzwQ_rDP.mjs";
import { U as listConfiguredSessionStoreAgentIds, gt as listSqliteTargetCandidatePathsForSessionStorePath, ht as resolveSessionStorePathCore, yt as resolveAgentDir } from "./sqlite-readonly-openclaw-agent-db-DnbjFHbu.mjs";
import "./sqlite-readonly-agent-delete-session-store-safety.kernel-D_rnr4oI.mjs";
import path from "node:path";
import fs from "node:fs";
createSubsystemLogger("sessions/targets");
//#endregion
//#region src/config/sessions/targets.ts
var targets_exports = /* @__PURE__ */ __exportAll({
	isConfiguredAgentDatabaseTarget: () => isConfiguredAgentDatabaseTarget,
	resolveConfiguredAgentDatabaseCandidatePaths: () => resolveConfiguredAgentDatabaseCandidatePaths
});
/** Candidate files for version inspection only; this does not assign migration ownership. */
function resolveConfiguredAgentDatabaseCandidatePaths(cfg, params) {
	return [...new Set(listConfiguredSessionStoreAgentIds(cfg).flatMap((agentId) => listSqliteTargetCandidatePathsForSessionStorePath(resolveSessionStorePathCore(cfg.session?.store, {
		agentId,
		env: params.env
	}), agentId).concat(path.join(resolveAgentDir(cfg, agentId, params.env), "openclaw-agent.sqlite"))))];
}
function isConfiguredAgentDatabaseTarget(targets, agentId, pathname) {
	return targets.some((target) => (agentId === void 0 || target.agentId === void 0 || target.agentId === agentId) && (target.path === pathname || fs.statSync(target.path, { throwIfNoEntry: false }) && fs.statSync(pathname, { throwIfNoEntry: false }) && isSameOpenClawAgentDatabasePath(target.path, pathname)));
}
//#endregion
export { resolveConfiguredAgentDatabaseCandidatePaths as n, targets_exports as r, isConfiguredAgentDatabaseTarget as t };
