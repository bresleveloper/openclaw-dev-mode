import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveRuntimeScriptPosition } from "./runtime-binary-BAwmhhZ0.mjs";
import { n as normalizeProfileName, t as isValidProfileName } from "./profile-utils-BsmgdpgZ.mjs";
import { n as parseCliProfileArgs, t as applyCliProfileEnv } from "./profile-DEgnfd3z.mjs";
import { r as resolveEnvironmentValue, t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
//#region src/daemon/service-env-merge.ts
function resolveWindowsServiceCommandProfile(command) {
	if (!command.programArguments[0]?.trim()) return { kind: "unavailable" };
	const { position } = resolveRuntimeScriptPosition(command.programArguments);
	if (typeof position !== "number" && position.kind !== "not-runtime") return { kind: "unavailable" };
	const entryIndex = typeof position === "number" ? position : 0;
	if (!command.programArguments[entryIndex]?.trim()) return { kind: "unavailable" };
	const parsed = parseCliProfileArgs(["node", ...command.programArguments.slice(entryIndex)]);
	const saved = normalizeOptionalString(resolveEnvironmentValue(command.environment, "OPENCLAW_PROFILE", "win32"));
	if (!parsed.ok || saved !== void 0 && !isValidProfileName(saved)) return { kind: "unavailable" };
	if (parsed.profile !== null) return {
		kind: "resolved",
		profile: normalizeProfileName(parsed.profile) ?? "default",
		source: "argv"
	};
	return {
		kind: "resolved",
		profile: normalizeProfileName(saved) ?? "default",
		source: saved === void 0 ? "default" : "environment"
	};
}
function projectWindowsServiceEnv(...sources) {
	return Object.fromEntries(Object.entries(mergeProcessEnv(sources, "win32")).map(([key, value]) => [key.toUpperCase(), value]));
}
function mergeGatewayServiceEnv(baseEnv, command) {
	const windows = process.platform === "win32";
	if (!command || !command.environment && !windows) return baseEnv;
	const callerEnv = windows ? projectWindowsServiceEnv(baseEnv) : baseEnv;
	const merged = windows ? projectWindowsServiceEnv(baseEnv, command.environment) : {
		...baseEnv,
		...command.environment
	};
	if (windows) {
		const profile = resolveWindowsServiceCommandProfile(command);
		if (profile.kind === "resolved" && profile.source === "argv") applyCliProfileEnv({
			profile: profile.profile,
			env: merged
		});
	}
	for (const key of [
		"DBUS_SESSION_BUS_ADDRESS",
		"XDG_RUNTIME_DIR",
		"USER",
		"LOGNAME",
		"SUDO_USER"
	]) if (Object.hasOwn(callerEnv, key)) merged[key] = callerEnv[key];
	else delete merged[key];
	for (const key of [
		"OPENCLAW_LAUNCHD_LABEL",
		"OPENCLAW_SYSTEMD_UNIT",
		"OPENCLAW_WINDOWS_TASK_NAME"
	]) {
		const value = callerEnv[key]?.trim();
		if (value) merged[key] = value;
	}
	return merged;
}
//#endregion
export { resolveWindowsServiceCommandProfile as n, mergeGatewayServiceEnv as t };
