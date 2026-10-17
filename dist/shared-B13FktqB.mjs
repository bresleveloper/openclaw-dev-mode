import { w as parseStrictPositiveInteger, x as parseStrictFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { a as resolveAgentDir, l as resolveAgentOperationAgentId, m as resolveConfiguredAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-C_lyIdYO.mjs";
import { D as setRuntimeConfigSnapshot, l as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { f as listProfilesForProvider } from "./order-B7W96aON.mjs";
import { o as loadAuthProfileStoreForRuntime } from "./store-runtime-Qx0DZ2Si.mjs";
import "./auth-profiles-BIPn3mmc.mjs";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DXeKniz_.mjs";
import { t as resolveModelRefOverride } from "./model-ref-override-smHu15tb.mjs";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-BYPIp_np.mjs";
//#region src/cli/capability-cli/shared.ts
function resolveTransport(opts) {
	if (opts.local && opts.gateway) throw new Error("Pass only one of --local or --gateway.");
	if (opts.local) {
		if (!opts.supported.includes("local")) throw new Error("This command does not support --local.");
		return "local";
	}
	if (opts.gateway) {
		if (!opts.supported.includes("gateway")) throw new Error("This command does not support --gateway.");
		return "gateway";
	}
	return opts.defaultTransport;
}
function hasOwnKeys(value) {
	return Boolean(value && typeof value === "object" && Object.keys(value).length > 0);
}
function resolveSelectedProviderFromModelRef(modelRef) {
	return resolveModelRefOverride(modelRef).provider;
}
function resolveCapabilityProviderAgentId(cfg, rawAgentId, surface = "inference provider inspection") {
	const requestedAgentId = rawAgentId?.trim();
	if (rawAgentId !== void 0 && !requestedAgentId) throw new Error("--agent must not be blank");
	const agentId = resolveAgentOperationAgentId(cfg, requestedAgentId, {
		surface,
		hint: "Pass --agent <id> or set agents.defaults.systemAgent.agentId."
	});
	return resolveConfiguredAgentId(cfg, agentId);
}
function resolveCapabilityAgentOption(command, rawAgentId) {
	return typeof rawAgentId === "string" ? rawAgentId : inheritOptionFromParent(command, "agent");
}
function providerHasGenericConfig(params) {
	const modelsProviders = params.cfg.models?.providers ?? {};
	const pluginEntries = params.cfg.plugins?.entries ?? {};
	const ttsProviders = params.cfg.tts?.providers ?? {};
	const envConfigured = (params.envVars ?? getProviderEnvVarsCore(params.providerId, {
		config: params.cfg,
		includeUntrustedWorkspacePlugins: false
	})).some((envVar) => Boolean(process.env[envVar]?.trim()));
	return (params.agentId ? listProfilesForProvider(loadAuthProfileStoreForRuntime(resolveAgentDir(params.cfg, params.agentId)), params.providerId).length > 0 : false) || hasOwnKeys(modelsProviders[params.providerId]) || hasOwnKeys(pluginEntries[params.providerId]?.config) || hasOwnKeys(ttsProviders[params.providerId]) || envConfigured;
}
function requireProviderModelOverride(raw) {
	const resolved = resolveModelRefOverride(raw);
	if (!raw?.trim()) return;
	if (!resolved.provider || !resolved.model) throw new Error("Model overrides must use the form <provider/model>.");
	return {
		provider: resolved.provider,
		model: resolved.model
	};
}
function parseOptionalFiniteNumber(raw, label) {
	if (raw === void 0) return;
	const value = parseStrictFiniteNumber(raw);
	if (value === void 0) throw new Error(`${label} must be a finite number`);
	return value;
}
function parseOptionalPositiveInteger(raw, label) {
	if (raw === void 0) return;
	const value = parseStrictPositiveInteger(raw);
	if (value === void 0) throw new Error(`${label} must be a positive integer`);
	return value;
}
function parseOptionalTimeoutMs(raw, flagName = "--timeout-ms") {
	if (raw === void 0) return;
	return parseTimeoutMsWithFallback(raw, 0, {
		invalidType: "error",
		flagName
	});
}
async function resolveLocalCapabilityRuntimeConfig(params) {
	const cfg = params.config ?? getRuntimeConfig();
	const { effectiveConfig } = await resolveCommandConfigWithSecrets({
		config: cfg,
		commandName: params.commandName,
		targetIds: params.targetIds,
		...params.allowedPaths ? { allowedPaths: params.allowedPaths } : {},
		...params.forcedActivePaths ? { forcedActivePaths: params.forcedActivePaths } : {},
		...params.optionalActivePaths ? { optionalActivePaths: params.optionalActivePaths } : {},
		runtime: defaultRuntime,
		autoEnable: true
	});
	pinRuntimeConfigSnapshot(effectiveConfig);
	return effectiveConfig;
}
async function resolveLocalCapabilityAgent(params) {
	const cfg = await resolveLocalCapabilityRuntimeConfig(params);
	const agentId = resolveCapabilityProviderAgentId(cfg, params.agent, params.surface ?? params.commandName);
	const { prepareLocalCapabilityAccountSecrets } = await import("./local-account-secrets-CpKwMI3X.mjs");
	await prepareLocalCapabilityAccountSecrets({
		cfg,
		agentId
	});
	return {
		cfg,
		agentId,
		agentDir: resolveAgentDir(cfg, agentId)
	};
}
function pinRuntimeConfigSnapshot(config) {
	const sourceConfig = getRuntimeConfigSourceSnapshot();
	if (sourceConfig) setRuntimeConfigSnapshot(config, sourceConfig);
	else setRuntimeConfigSnapshot(config);
}
//#endregion
export { providerHasGenericConfig as a, resolveCapabilityProviderAgentId as c, resolveSelectedProviderFromModelRef as d, resolveTransport as f, pinRuntimeConfigSnapshot as i, resolveLocalCapabilityAgent as l, parseOptionalPositiveInteger as n, requireProviderModelOverride as o, parseOptionalTimeoutMs as r, resolveCapabilityAgentOption as s, parseOptionalFiniteNumber as t, resolveLocalCapabilityRuntimeConfig as u };
