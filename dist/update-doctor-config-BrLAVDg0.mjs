//#region src/infra/update-doctor-config.ts
function formatUpdateDoctorConfigWriteRefusal(refusal) {
	return `Doctor config promotion refused for top-level keys: ${refusal.keys.join(", ") || "none recorded"}. ${refusal.reason}: ${refusal.message}`;
}
function formatUpdateDoctorConfigChange(change) {
	return change.kind === "key" ? `Doctor changed config key: ${change.key}.` : `Doctor migration: ${change.message}`;
}
function getUpdateDoctorConfigFailureReason(refusal) {
	return refusal ? refusal.reason === "requester-revoked" ? "requester-revoked" : "repair-requires-config-change" : void 0;
}
function createUpdateDoctorConfigWarningStep(root, changes) {
	return {
		name: "doctor-config-changes",
		command: "report Doctor config changes",
		cwd: root,
		durationMs: 0,
		exitCode: 0,
		advisory: {
			kind: "recoverable-maintenance",
			message: `Doctor changed config keys ${[...new Set(changes.flatMap((change) => change.kind === "key" ? [change.key] : []))].toSorted().join(", ") || "none recorded"} during update checks. Check those settings after the update; this version cannot verify that they were applied.`
		}
	};
}
//#endregion
export { getUpdateDoctorConfigFailureReason as i, formatUpdateDoctorConfigChange as n, formatUpdateDoctorConfigWriteRefusal as r, createUpdateDoctorConfigWarningStep as t };
