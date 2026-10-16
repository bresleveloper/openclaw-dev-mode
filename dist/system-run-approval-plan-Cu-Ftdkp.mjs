import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as normalizeExecApprovalPolicySnapshot } from "./exec-approval-policy-snapshot-DVeeymq8.mjs";
import { f as normalizeStringArray } from "./system-run-approval-binding-D_QCHpDn.mjs";
//#region src/infra/system-run-approval-plan.ts
function normalizeSystemRunApprovalFileOperand(candidate) {
	if (candidate === void 0) return;
	if (!isRecord(candidate)) return null;
	const argvIndex = typeof candidate.argvIndex === "number" && Number.isInteger(candidate.argvIndex) && candidate.argvIndex >= 0 ? candidate.argvIndex : null;
	const filePath = normalizeNullableString(candidate.path);
	const sha256 = normalizeNullableString(candidate.sha256);
	if (argvIndex === null || !filePath || !sha256) return null;
	return {
		argvIndex,
		path: filePath,
		sha256
	};
}
function normalizeSystemRunApprovalPlan(candidate) {
	if (!isRecord(candidate)) return null;
	const argv = normalizeStringArray(candidate.argv);
	if (argv.length === 0) return null;
	const mutableFileOperand = normalizeSystemRunApprovalFileOperand(candidate.mutableFileOperand);
	if (candidate.mutableFileOperand !== void 0 && mutableFileOperand === null) return null;
	const policySnapshot = normalizeExecApprovalPolicySnapshot(candidate.policySnapshot);
	if (candidate.policySnapshot !== void 0 && policySnapshot === null) return null;
	const commandText = normalizeNullableString(candidate.commandText) ?? normalizeNullableString(candidate.rawCommand);
	if (!commandText) return null;
	return {
		argv,
		cwd: normalizeNullableString(candidate.cwd),
		commandText,
		commandPreview: normalizeNullableString(candidate.commandPreview),
		agentId: normalizeNullableString(candidate.agentId),
		sessionKey: normalizeNullableString(candidate.sessionKey),
		...policySnapshot ? { policySnapshot } : {},
		mutableFileOperand: mutableFileOperand ?? void 0
	};
}
//#endregion
export { normalizeSystemRunApprovalPlan as t };
