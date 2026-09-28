import { t as pathMayExistSync } from "./path-existence-ZQl5cy75.mjs";
import { n as formatDoctorStateRepairFailure } from "./state-repair-message-B5Bu99oR.mjs";
import { l as resolveExecApprovalsPath } from "./exec-approvals-config-C7iYNiP7.mjs";
import path from "node:path";
//#region src/infra/exec-approvals-migration-gate.ts
const DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
const legacyAbsenceCache = /* @__PURE__ */ new Set();
/**
* Doctor repairs whichever state directory its own environment resolves to, so a bare
* `openclaw doctor --fix` repairs the default root while a scoped install stays blocked.
* Name the directory whenever this process is scoped to a non-default one. Say it in
* prose rather than as a `VAR=value cmd` one-liner, which no Windows shell accepts.
*/
function doctorFixInstruction(filePath, env) {
	const command = "Run `openclaw doctor --fix`";
	return env.OPENCLAW_STATE_DIR?.trim() ? `${command} with OPENCLAW_STATE_DIR set to ${path.dirname(filePath)}` : command;
}
var ExecApprovalsMigrationRequiredError = class extends Error {
	constructor(filePath, operation, problem = "Legacy exec approvals exist", env = process.env) {
		super(operation === "doctor" ? formatDoctorStateRepairFailure(`${problem} at ${filePath}`, "Stop the Gateway and node hosts, then reconcile this file with a verified copy of the intended exec policy; preserve existing SQLite policy.") : `${problem} at ${filePath}. ${doctorFixInstruction(filePath, env)} before using exec approvals.`);
		this.name = "ExecApprovalsMigrationRequiredError";
	}
};
/** Refuse runtime access until Doctor owns the one-time legacy import. */
function assertNoPendingLegacyExecApprovals(options = {}) {
	const sourcePath = resolveExecApprovalsPath(options.env);
	if (legacyAbsenceCache.has(sourcePath)) return;
	const probe = options.pathMayExist ?? pathMayExistSync;
	const sourceBefore = probe(sourcePath);
	const claim = probe(`${sourcePath}${DOCTOR_CLAIM_SUFFIX}`);
	const sourceAfter = probe(sourcePath);
	if (sourceBefore || claim || sourceAfter) throw new ExecApprovalsMigrationRequiredError(options.operation === "doctor" && !sourceBefore && !sourceAfter ? `${sourcePath}${DOCTOR_CLAIM_SUFFIX}` : sourcePath, options.operation, void 0, options.env);
	legacyAbsenceCache.add(sourcePath);
}
function resetExecApprovalsMigrationGateForTest() {
	legacyAbsenceCache.clear();
}
//#endregion
export { assertNoPendingLegacyExecApprovals as n, resetExecApprovalsMigrationGateForTest as r, ExecApprovalsMigrationRequiredError as t };
