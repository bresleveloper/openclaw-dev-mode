import { a as GATEWAY_SERVICE_SELECTOR_ENV_KEYS, i as GATEWAY_SERVICE_RUNTIME_PID_ENV } from "./constants-CJCmIHb-.mjs";
import { r as resolveEnvironmentValue, t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { r as mergePathPrepend } from "./path-prepend-CRp372y2.mjs";
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
	const resolved = { ...params.baseEnv };
	const selectorEnv = params.selectorEnv ?? params.serviceEnv;
	for (const key of MANAGED_UPDATE_SELECTOR_ENV_KEYS) if (resolveEnvironmentValue(selectorEnv, key)?.trim()) resolved[key] = params.serviceEnv[key];
	else delete resolved[key];
	return resolved;
}
function resolveServiceRefreshEnv(env, invocationCwd) {
	const resolvedEnv = process.platform === "win32" ? Object.fromEntries(Object.entries(mergeProcessEnv([env])).map(([key, value]) => [key.toUpperCase(), value])) : { ...env };
	for (const key of SERVICE_REFRESH_PATH_ENV_KEYS) {
		const rawValue = resolvedEnv[key]?.trim();
		if (!rawValue) continue;
		if (rawValue.startsWith("~") || path.isAbsolute(rawValue) || path.win32.isAbsolute(rawValue)) {
			resolvedEnv[key] = rawValue;
			continue;
		}
		if (!invocationCwd) {
			resolvedEnv[key] = rawValue;
			continue;
		}
		resolvedEnv[key] = path.resolve(invocationCwd, rawValue);
	}
	return resolvedEnv;
}
/** Run one update phase under the managed Gateway's authoritative environment. */
async function withOwnedManagedUpdateEnv(env, run) {
	if (!env) return await run();
	const previousEnv = { ...process.env };
	for (const key of Object.keys(process.env)) delete process.env[key];
	const phaseEnv = env === process.env ? previousEnv : env;
	for (const [key, value] of Object.entries(phaseEnv)) if (value !== void 0) process.env[key] = value;
	try {
		return await run();
	} finally {
		for (const key of Object.keys(process.env)) delete process.env[key];
		Object.assign(process.env, previousEnv);
	}
}
async function withUpdateInProgressEnv(invocationCwd, run) {
	const env = resolveServiceRefreshEnv(process.env, invocationCwd);
	env.OPENCLAW_UPDATE_IN_PROGRESS = "1";
	const scopedKeys = Object.keys(env).filter((key) => key === "OPENCLAW_UPDATE_IN_PROGRESS" || env[key] !== process.env[key]);
	const previousValues = scopedKeys.map((key) => [key, process.env[key]]);
	for (const key of scopedKeys) process.env[key] = env[key];
	try {
		return await run();
	} finally {
		for (const [key, value] of previousValues) if (value === void 0) delete process.env[key];
		else process.env[key] = value;
	}
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
function resolveUpdatedInstallCommandEnv(params) {
	const processEnv = resolveServiceRefreshEnv(params?.processEnv ?? process.env, params?.invocationCwd);
	const serviceEnv = params?.serviceEnv ? resolveServiceRefreshEnv(params.serviceEnv, params.invocationCwd) : void 0;
	return disableUpdatedPackageCompileCacheEnv({
		...processEnv,
		...serviceEnv
	});
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
export { resolveUpdateTargetEnv as a, withOwnedManagedUpdateEnv as c, resolveServiceRefreshEnv as i, withUpdateInProgressEnv as l, resolveOwnedManagedUpdateEnv as n, resolveUpdatedInstallCommandEnv as o, resolveServiceRecoveryContext as r, stripGatewayServiceMarkerEnv as s, disableUpdatedPackageCompileCacheEnv as t };
