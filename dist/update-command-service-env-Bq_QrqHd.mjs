import { n as fsSafeEnvInput, r as normalizeFsSafeNativeEnv, t as clearFsSafeEnvFallback } from "./fs-safe-env-wxBiM84C.mjs";
import { a as GATEWAY_SERVICE_SELECTOR_ENV_KEYS, i as GATEWAY_SERVICE_RUNTIME_PID_ENV } from "./constants-BLghGsId.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { r as resolveEnvironmentValue, t as mergeProcessEnv } from "./process-env-BNjOnVtu.mjs";
import { r as mergePathPrepend } from "./path-prepend-D21kYd3c.mjs";
import { a as resolveGatewayHeapNodeOptions, r as readServiceHeapExecArgv } from "./gateway-heap-DPLzOlX-.mjs";
import path from "node:path";
//#region src/cli/update-cli/update-command-service-env.ts
const SERVICE_REFRESH_PATH_ENV_KEYS = [
	"OPENCLAW_HOME",
	"OPENCLAW_STATE_DIR",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_WORKSPACE_DIR"
];
const MANAGED_UPDATE_SELECTOR_ENV_KEYS = ["OPENCLAW_HOME", ...GATEWAY_SERVICE_SELECTOR_ENV_KEYS];
const OPERATOR_SCRATCH_ENV_KEYS = [
	"TMPDIR",
	"TMP",
	"TEMP"
];
/** Recovery can be printed inside an owned-env scope that the operator's shell never had. */
function resolveServiceRecoveryContext(params) {
	const env = resolveOwnedManagedUpdateEnv(params);
	const keys = [.../* @__PURE__ */ new Set([...MANAGED_UPDATE_SELECTOR_ENV_KEYS, ...SERVICE_REFRESH_PATH_ENV_KEYS])];
	if (process.platform === "win32") return {
		env,
		command: keys.map((key) => env[key] === void 0 ? `Remove-Item Env:${key} -ErrorAction SilentlyContinue` : `$env:${key} = ${quotePowerShellArg(env[key])}`).join("; ")
	};
	const assigned = keys.flatMap((key) => env[key] === void 0 ? [] : [`${key}=${quoteCliArg(env[key])}`]);
	const unset = keys.filter((key) => env[key] === void 0);
	return {
		env,
		command: [assigned.length ? `export ${assigned.join(" ")}` : "", unset.length ? `unset ${unset.join(" ")}` : ""].filter(Boolean).join("; ")
	};
}
function applyManagedServiceSelectorEnv(resolved, serviceEnv, selectorEnv = serviceEnv) {
	for (const key of MANAGED_UPDATE_SELECTOR_ENV_KEYS) if (resolveEnvironmentValue(selectorEnv, key)?.trim()) resolved[key] = serviceEnv[key];
	else delete resolved[key];
	return resolved;
}
function resolveServiceRefreshEnv(env, invocationCwd) {
	const resolvedEnv = process.platform === "win32" ? Object.fromEntries(Object.entries(mergeProcessEnv([fsSafeEnvInput(env)])).map(([key, value]) => [key.toUpperCase(), value])) : { ...fsSafeEnvInput(env) };
	for (const key of SERVICE_REFRESH_PATH_ENV_KEYS) {
		const rawValue = resolvedEnv[key]?.trim();
		if (!rawValue) continue;
		resolvedEnv[key] = !invocationCwd || rawValue.startsWith("~") || path.isAbsolute(rawValue) || path.win32.isAbsolute(rawValue) ? rawValue : path.resolve(invocationCwd, rawValue);
	}
	return resolvedEnv;
}
function applyUpdateEnv(entries, replace) {
	clearFsSafeEnvFallback(process.env);
	if (replace) for (const key of Object.keys(process.env)) delete process.env[key];
	for (const [key, value] of entries) if (value !== void 0) process.env[key] = value;
	else if (!replace) delete process.env[key];
	normalizeFsSafeNativeEnv();
}
/** Run one update phase under the managed Gateway's authoritative environment. */
async function withOwnedManagedUpdateEnv(env, run) {
	return env ? await withUpdateEnvScope(env, run, true) : await run();
}
/** Restore only this phase's overrides; other environment writes remain with their owners. */
async function withUpdateEnv(overrides, run) {
	return await withUpdateEnvScope(overrides, run, false);
}
async function withUpdateEnvScope(env, run, replace) {
	const inputs = fsSafeEnvInput(env);
	const before = fsSafeEnvInput(process.env);
	const previous = replace ? Object.entries(before) : Object.keys(inputs).map((key) => [key, process.platform === "win32" ? resolveEnvironmentValue(before, key) : before[key]]);
	applyUpdateEnv(Object.entries(inputs), replace);
	try {
		return await run();
	} finally {
		applyUpdateEnv(previous, replace);
	}
}
async function withUpdateInProgressEnv(invocationCwd, run) {
	const env = resolveServiceRefreshEnv(process.env, invocationCwd);
	env.OPENCLAW_UPDATE_IN_PROGRESS = "1";
	return await withUpdateEnv(Object.fromEntries(Object.entries(env).filter(([key, value]) => key === "OPENCLAW_UPDATE_IN_PROGRESS" || value !== process.env[key])), run);
}
function stripGatewayServiceMarkerEnv(env) {
	const resolvedEnv = { ...env };
	delete resolvedEnv.OPENCLAW_SERVICE_MARKER;
	delete resolvedEnv.OPENCLAW_SERVICE_KIND;
	delete resolvedEnv[GATEWAY_SERVICE_RUNTIME_PID_ENV];
	return resolvedEnv;
}
function disableUpdatedPackageCompileCacheEnv(env) {
	return {
		...env,
		NODE_DISABLE_COMPILE_CACHE: "1"
	};
}
/** Carry service heap controls without changing the captured environment's other facts. */
function resolveUpdateServiceHeapEnv(env, processEnv = process.env, programArguments = []) {
	const resolved = { ...env };
	if (resolved.NODE_OPTIONS !== void 0 && !resolved.NODE_OPTIONS.trim()) resolved.NODE_OPTIONS = resolveGatewayHeapNodeOptions(processEnv.NODE_OPTIONS);
	const heapArgs = readServiceHeapExecArgv(programArguments);
	if (heapArgs.length) resolved.NODE_OPTIONS = [resolved.NODE_OPTIONS, ...heapArgs].filter(Boolean).join(" ");
	return resolved;
}
function resolveUpdatedInstallCommandEnv(params) {
	const processEnv = resolveServiceRefreshEnv(params?.processEnv ?? process.env, params?.invocationCwd);
	const serviceEnv = params?.serviceEnv ? resolveServiceRefreshEnv(params.serviceEnv, params.invocationCwd) : void 0;
	const resolved = resolveUpdateServiceHeapEnv({
		...processEnv,
		...serviceEnv
	}, processEnv);
	for (const key of OPERATOR_SCRATCH_ENV_KEYS) if (processEnv[key] !== void 0) resolved[key] = processEnv[key];
	return disableUpdatedPackageCompileCacheEnv(resolved);
}
function resolveOwnedManagedUpdateEnv(params) {
	const resolved = resolveUpdatedInstallCommandEnv(params);
	return applyManagedServiceSelectorEnv(resolved, resolved, params.serviceDefinitionEnv ?? params.serviceEnv);
}
function resolveUpdateTargetEnv(params) {
	const resolvedEnv = disableUpdatedPackageCompileCacheEnv(resolveServiceRefreshEnv(params?.baseEnv ?? process.env, params?.invocationCwd));
	if (params?.nodeRunner) resolvedEnv.PATH = mergePathPrepend(resolvedEnv.PATH, [path.dirname(params.nodeRunner)]);
	if (!params?.serviceEnv) return resolvedEnv;
	return applyManagedServiceSelectorEnv(resolvedEnv, resolveServiceRefreshEnv(params.serviceEnv, params.invocationCwd));
}
//#endregion
export { resolveUpdateServiceHeapEnv as a, stripGatewayServiceMarkerEnv as c, withUpdateInProgressEnv as d, resolveServiceRefreshEnv as i, withOwnedManagedUpdateEnv as l, resolveOwnedManagedUpdateEnv as n, resolveUpdateTargetEnv as o, resolveServiceRecoveryContext as r, resolveUpdatedInstallCommandEnv as s, disableUpdatedPackageCompileCacheEnv as t, withUpdateEnv as u };
