import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as resolveConfigIncludes, s as readConfigIncludeFileWithGuards } from "./includes-CaaCq-XN.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { p as resolveConfigPath, y as resolveIncludeRoots } from "./paths-DehQwyE0.mjs";
import { X as resolveConfigEnvVars } from "./redact-B5EGyLvV.mjs";
import { t as applyConfigEnvVars } from "./config-env-vars-BHI12YH5.mjs";
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
	if (Object.hasOwn(value, "env")) applyConfigEnvVars(value, env);
	const projected = {};
	for (const key of GATEWAY_DISPATCH_TOP_LEVEL_KEYS) if (Object.hasOwn(value, key)) projected[key] = value[key];
	return resolveConfigEnvVars(projected, env, { onMissing: () => void 0 });
}
function applyGatewayDispatchSessionDefaults(config) {
	if (config.session?.mainKey === void 0) return config;
	return {
		...config,
		session: {
			...config.session,
			mainKey: "main"
		}
	};
}
function resolveIncludesForGatewayDispatch(parsed, configPath, env) {
	return resolveConfigIncludes(parsed, configPath, {
		readFile: (candidate) => fs.readFileSync(candidate, "utf-8"),
		readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) => readConfigIncludeFileWithGuards({
			includePath,
			resolvedPath,
			rootRealDir,
			ioFs: fs
		}),
		parseJson: parseJsonWithJson5Fallback
	}, { allowedRoots: resolveIncludeRoots(env) });
}
function readRawGatewayDispatchConfig(options = {}) {
	const env = options.env ?? process.env;
	const configPath = options.configPath ?? resolveConfigPath(env);
	if (!fs.existsSync(configPath)) return {
		config: {},
		configPath
	};
	const raw = fs.readFileSync(configPath, "utf-8");
	return {
		config: applyGatewayDispatchSessionDefaults(resolveGatewayDispatchConfig(resolveIncludesForGatewayDispatch(parseJsonWithJson5Fallback(raw), configPath, env), env)),
		configPath
	};
}
function readGatewayDispatchConfig(options = {}) {
	return readRawGatewayDispatchConfig(options).config;
}
async function readGatewayDispatchConfigWithShellEnvFallback(options = {}) {
	const env = options.env ?? process.env;
	const firstRead = readRawGatewayDispatchConfig(options);
	const { loadShellEnvFallback, resolveShellEnvFallbackTimeoutMs, shouldDeferShellEnvFallback, shouldEnableShellEnvFallback } = await import("./shell-env-CH_X490Y.mjs");
	if ((shouldEnableShellEnvFallback(env) || firstRead.config.env?.shellEnv?.enabled === true) && !shouldDeferShellEnvFallback(env)) loadShellEnvFallback({
		enabled: true,
		env,
		expectedKeys: [...GATEWAY_DISPATCH_SHELL_ENV_EXPECTED_KEYS],
		logger: options.logger ?? console,
		timeoutMs: firstRead.config.env?.shellEnv?.timeoutMs ?? resolveShellEnvFallbackTimeoutMs(env)
	});
	return readGatewayDispatchConfig({
		...options,
		configPath: path.resolve(firstRead.configPath)
	});
}
//#endregion
export { readGatewayDispatchConfigWithShellEnvFallback as n, readGatewayDispatchConfig as t };
