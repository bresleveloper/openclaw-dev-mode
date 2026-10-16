import { n as fsSafeEnvInput, r as normalizeFsSafeNativeEnv, t as clearFsSafeEnvFallback } from "./fs-safe-env-CCe2lU-3.mjs";
import { a as GATEWAY_SERVICE_SELECTOR_ENV_KEYS, i as GATEWAY_SERVICE_RUNTIME_PID_ENV } from "./constants-BLghGsId.mjs";
import { r as resolveEnvironmentValue, t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { r as mergePathPrepend } from "./path-prepend-Cv1ulMUG.mjs";
import { a as resolveGatewayHeapNodeOptions, r as readServiceHeapExecArgv } from "./gateway-heap-DTqeZ8TX.mjs";
import path from "node:path";
//#region src/cli/update-cli/update-command-service-env.ts
const SERVICE_REFRESH_PATH_ENV_KEYS = [
	"OPENCLAW_HOME",
	"OPENCLAW_STATE_DIR",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_WORKSPACE_DIR"
];
const MANAGED_UPDATE_SELECTOR_ENV_KEYS = ["OPENCLAW_HOME", ...GATEWAY_SERVICE_SELECTOR_ENV_KEYS];
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
function applyManagedServiceSelectorEnv(params) {
	const resolved = { ...fsSafeEnvInput(params.baseEnv) };
	const selectorEnv = params.selectorEnv ?? params.serviceEnv;
	for (const key of MANAGED_UPDATE_SELECTOR_ENV_KEYS) if (resolveEnvironmentValue(selectorEnv, key)?.trim()) resolved[key] = params.serviceEnv[key];
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
/** Run one update phase under the managed Gateway's authoritative environment. */
async function withOwnedManagedUpdateEnv(env, run) {
	if (!env) return await run();
	const previousEnv = { ...fsSafeEnvInput(process.env) };
	const phaseEnv = env === process.env ? previousEnv : { ...fsSafeEnvInput(env) };
	clearFsSafeEnvFallback(process.env);
	for (const key of Object.keys(process.env)) delete process.env[key];
	for (const [key, value] of Object.entries(phaseEnv)) if (value !== void 0) process.env[key] = value;
	normalizeFsSafeNativeEnv();
	try {
		return await run();
	} finally {
		clearFsSafeEnvFallback(process.env);
		for (const key of Object.keys(process.env)) delete process.env[key];
		Object.assign(process.env, previousEnv);
		normalizeFsSafeNativeEnv();
	}
}
/** Restore only this phase's overrides; other environment writes remain with their owners. */
async function withUpdateEnv(overrides, run) {
	const inputs = fsSafeEnvInput(overrides);
	const before = fsSafeEnvInput(process.env);
	const previous = Object.keys(inputs).map((key) => [key, process.platform === "win32" ? resolveEnvironmentValue(before, key) : before[key]]);
	const apply = (entries) => {
		clearFsSafeEnvFallback(process.env);
		for (const [key, value] of entries) if (value === void 0) delete process.env[key];
		else process.env[key] = value;
		normalizeFsSafeNativeEnv();
	};
	apply(Object.entries(inputs));
	try {
		return await run();
	} finally {
		apply(previous);
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
	return disableUpdatedPackageCompileCacheEnv(resolveUpdateServiceHeapEnv({
		...processEnv,
		...serviceEnv
	}, processEnv));
}
function resolveOwnedManagedUpdateEnv(params) {
	const resolved = resolveUpdatedInstallCommandEnv(params);
	return applyManagedServiceSelectorEnv({
		baseEnv: resolved,
		serviceEnv: resolved,
		selectorEnv: params.serviceDefinitionEnv ?? params.serviceEnv
	});
}
function resolveUpdateTargetEnv(params) {
	const resolvedEnv = disableUpdatedPackageCompileCacheEnv(resolveServiceRefreshEnv(params?.baseEnv ?? process.env, params?.invocationCwd));
	if (params?.nodeRunner) resolvedEnv.PATH = mergePathPrepend(resolvedEnv.PATH, [path.dirname(params.nodeRunner)]);
	if (!params?.serviceEnv) return resolvedEnv;
	return applyManagedServiceSelectorEnv({
		baseEnv: resolvedEnv,
		serviceEnv: resolveServiceRefreshEnv(params.serviceEnv, params.invocationCwd)
	});
}
//#endregion
export { resolveUpdateServiceHeapEnv as a, stripGatewayServiceMarkerEnv as c, withUpdateInProgressEnv as d, resolveServiceRefreshEnv as i, withOwnedManagedUpdateEnv as l, resolveOwnedManagedUpdateEnv as n, resolveUpdateTargetEnv as o, resolveServiceRecoveryContext as r, resolveUpdatedInstallCommandEnv as s, disableUpdatedPackageCompileCacheEnv as t, withUpdateEnv as u };
