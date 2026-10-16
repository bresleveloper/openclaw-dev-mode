import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { u as resolveConfigIncludes } from "./includes-BkzfmxST.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { m as resolveConfigPath, x as resolveIncludeRoots } from "./paths-DGIwWbpu.mjs";
import { h as setConfigResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
import { u as resolveConfigForRead } from "./io.read-helpers-Bvdjf9tk.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/config/gateway-dispatch-config.ts
const GATEWAY_DISPATCH_SHELL_ENV_EXPECTED_KEYS = ["OPENCLAW_GATEWAY_TOKEN", "OPENCLAW_GATEWAY_PASSWORD"];
const GATEWAY_DISPATCH_TOP_LEVEL_KEYS = [
	"agents",
	"env",
	"gateway",
	"plugins",
	"secrets",
	"session"
];
function resolveGatewayDispatchConfig(value, env) {
	if (!isRecord(value)) return {};
	const projected = {};
	for (const key of GATEWAY_DISPATCH_TOP_LEVEL_KEYS) if (Object.hasOwn(value, key)) projected[key] = value[key];
	const { resolvedConfigRaw, resolutionFacts } = resolveConfigForRead(projected, env);
	const config = resolvedConfigRaw;
	if (config.session?.mainKey !== void 0) config.session.mainKey = "main";
	setConfigResolutionFacts(config, resolutionFacts);
	return config;
}
function readRawGatewayDispatchConfig(options = {}) {
	const env = options.env ?? process.env;
	const configPath = options.configPath ?? resolveConfigPath(env);
	if (!fs.existsSync(configPath)) return {
		config: {},
		configPath
	};
	const raw = fs.readFileSync(configPath, "utf-8");
	const parsed = parseJsonWithJson5Fallback(raw);
	return {
		config: resolveGatewayDispatchConfig(resolveConfigIncludes(parsed, configPath, void 0, { allowedRoots: resolveIncludeRoots(env) }), env),
		configPath
	};
}
function readGatewayDispatchConfig(options = {}) {
	return readRawGatewayDispatchConfig(options).config;
}
async function readGatewayDispatchConfigWithShellEnvFallback(options = {}) {
	const env = options.env ?? process.env;
	const firstRead = readRawGatewayDispatchConfig(options);
	const { loadShellEnvFallback, resolveShellEnvFallbackTimeoutMs, shouldDeferShellEnvFallback, shouldEnableShellEnvFallback } = await import("./shell-env-CIeama6G.mjs");
	if ((shouldEnableShellEnvFallback(env) || firstRead.config.env?.shellEnv?.enabled === true) && !shouldDeferShellEnvFallback(env)) {
		const { applied } = loadShellEnvFallback({
			enabled: true,
			env,
			expectedKeys: [...GATEWAY_DISPATCH_SHELL_ENV_EXPECTED_KEYS],
			logger: options.logger ?? console,
			timeoutMs: firstRead.config.env?.shellEnv?.timeoutMs ?? resolveShellEnvFallbackTimeoutMs(env)
		});
		if (applied.length > 0) return readGatewayDispatchConfig({
			...options,
			configPath: path.resolve(firstRead.configPath)
		});
	}
	return firstRead.config;
}
//#endregion
export { readGatewayDispatchConfigWithShellEnvFallback as n, readGatewayDispatchConfig as t };
