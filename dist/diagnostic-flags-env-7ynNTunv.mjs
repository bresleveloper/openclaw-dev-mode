//#region src/infra/diagnostic-flags-env.ts
function parseDiagnosticEnvFlags(raw) {
	const trimmed = raw?.trim() ?? "";
	const lowered = trimmed.toLowerCase();
	if (!lowered) return {
		flags: [],
		disablesAll: false
	};
	if ([
		"0",
		"false",
		"off",
		"none"
	].includes(lowered)) return {
		flags: [],
		disablesAll: true
	};
	if ([
		"1",
		"true",
		"all",
		"*"
	].includes(lowered)) return {
		flags: ["*"],
		disablesAll: false
	};
	return {
		flags: trimmed.split(/[,\s]+/),
		disablesAll: false
	};
}
//#endregion
export { parseDiagnosticEnvFlags as t };
