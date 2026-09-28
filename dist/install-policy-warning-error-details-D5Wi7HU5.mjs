import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region packages/gateway-protocol/src/install-policy-warning-error-details.ts
const INSTALL_POLICY_WARNING_ACKNOWLEDGEMENT_REQUIRED = "install_policy_warning_acknowledgement_required";
function readFinding(value) {
	const record = asNullableRecord(value);
	if (!record) return;
	const ruleId = normalizeOptionalString(record.ruleId);
	const message = normalizeOptionalString(record.message);
	const severity = record.severity;
	if (!ruleId || !message || severity !== "info" && severity !== "warn" && severity !== "critical") return;
	const file = normalizeOptionalString(record.file);
	const evidence = normalizeOptionalString(record.evidence);
	const line = record.line;
	if (record.file !== void 0 && !file || record.evidence !== void 0 && !evidence || line !== void 0 && (typeof line !== "number" || !Number.isSafeInteger(line) || line <= 0)) return;
	return {
		ruleId,
		severity,
		message,
		...file ? { file } : {},
		...line !== void 0 ? { line } : {},
		...evidence ? { evidence } : {}
	};
}
function readInstallPolicyWarningErrorDetails(value) {
	const record = asNullableRecord(value);
	if (!record) return;
	const targetName = normalizeOptionalString(record.targetName);
	const reason = normalizeOptionalString(record.reason);
	const targetType = record.targetType;
	const requestMode = record.requestMode;
	if (record.installPolicyCode !== "install_policy_warning_acknowledgement_required" || !targetName || !reason || targetType !== "skill" && targetType !== "plugin" || requestMode !== "install" && requestMode !== "update") return;
	let findings;
	if (record.findings !== void 0) {
		if (!Array.isArray(record.findings)) return;
		findings = [];
		for (const findingValue of record.findings) {
			const finding = readFinding(findingValue);
			if (!finding) return;
			findings.push(finding);
		}
	}
	return {
		installPolicyCode: INSTALL_POLICY_WARNING_ACKNOWLEDGEMENT_REQUIRED,
		targetName,
		targetType,
		requestMode,
		reason,
		...findings ? { findings } : {}
	};
}
//#endregion
export { readInstallPolicyWarningErrorDetails as n, INSTALL_POLICY_WARNING_ACKNOWLEDGEMENT_REQUIRED as t };
