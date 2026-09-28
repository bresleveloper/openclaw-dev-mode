import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as resolveGatewayProfileSuffix } from "./constants-CJCmIHb-.mjs";
import path from "node:path";
//#region src/daemon/paths.ts
/** Resolves daemon state, home, and generated task-script paths. */
const windowsAbsolutePath = /^[a-zA-Z]:[\\/]/;
const windowsUncPath = /^\\\\/;
/** Resolves the home directory used for daemon state paths. */
function resolveDaemonHomeDir(env) {
	const home = normalizeOptionalString(env.HOME) || normalizeOptionalString(env.USERPROFILE);
	if (!home) throw new Error("Missing HOME");
	return home;
}
function resolveUserPathWithHome(input, home) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	if (trimmed.startsWith("~")) {
		if (!home) throw new Error("Missing HOME");
		const expanded = trimmed.replace(/^~(?=$|[\\/])/, () => home);
		return path.resolve(expanded);
	}
	if (windowsAbsolutePath.test(trimmed) || windowsUncPath.test(trimmed)) return trimmed;
	return path.resolve(trimmed);
}
function resolveGatewayStateDir(env) {
	const override = normalizeOptionalString(env.OPENCLAW_STATE_DIR);
	if (override) return resolveUserPathWithHome(override, override.startsWith("~") ? resolveDaemonHomeDir(env) : void 0);
	const home = resolveDaemonHomeDir(env);
	const suffix = resolveGatewayProfileSuffix(env.OPENCLAW_PROFILE);
	return path.join(home, `.openclaw${suffix}`);
}
function resolveGatewayTaskScriptPath(env) {
	const override = normalizeOptionalString(env.OPENCLAW_TASK_SCRIPT);
	if (override) return override;
	const scriptName = normalizeOptionalString(env.OPENCLAW_TASK_SCRIPT_NAME) || "gateway.cmd";
	if (/[/\\]|\.\./.test(scriptName)) throw new Error(`OPENCLAW_TASK_SCRIPT_NAME must be a file name only, not a path: ${scriptName}`);
	return path.join(resolveGatewayStateDir(env), scriptName);
}
//#endregion
export { resolveGatewayStateDir as n, resolveGatewayTaskScriptPath as r, resolveDaemonHomeDir as t };
