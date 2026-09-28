import { _ as normalizeExecApprovalPolicySnapshot } from "./exec-approvals-authorization.kernel-DYisNIDQ.mjs";
import { f as normalizeNonEmptyString, p as normalizeStringArray } from "./system-run-approval-binding-BDEolZhR.mjs";
//#region src/infra/system-run-approval-plan.ts
function normalizeSystemRunApprovalFileOperand(value) {
	if (value === void 0) return;
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const candidate = value;
	const argvIndex = typeof candidate.argvIndex === "number" && Number.isInteger(candidate.argvIndex) && candidate.argvIndex >= 0 ? candidate.argvIndex : null;
	const filePath = normalizeNonEmptyString(candidate.path);
	const sha256 = normalizeNonEmptyString(candidate.sha256);
	if (argvIndex === null || !filePath || !sha256) return null;
	return {
		argvIndex,
		path: filePath,
		sha256
	};
}
function normalizeSystemRunApprovalPlan(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const candidate = value;
	const argv = normalizeStringArray(candidate.argv);
	if (argv.length === 0) return null;
	const mutableFileOperand = normalizeSystemRunApprovalFileOperand(candidate.mutableFileOperand);
	if (candidate.mutableFileOperand !== void 0 && mutableFileOperand === null) return null;
	const policySnapshot = normalizeExecApprovalPolicySnapshot(candidate.policySnapshot);
	if (candidate.policySnapshot !== void 0 && policySnapshot === null) return null;
	const commandText = normalizeNonEmptyString(candidate.commandText) ?? normalizeNonEmptyString(candidate.rawCommand);
	if (!commandText) return null;
	return {
		argv,
		cwd: normalizeNonEmptyString(candidate.cwd),
		commandText,
		commandPreview: normalizeNonEmptyString(candidate.commandPreview),
		agentId: normalizeNonEmptyString(candidate.agentId),
		sessionKey: normalizeNonEmptyString(candidate.sessionKey),
		...policySnapshot ? { policySnapshot } : {},
		mutableFileOperand: mutableFileOperand ?? void 0
	};
}
//#endregion
export { normalizeSystemRunApprovalPlan as t };
