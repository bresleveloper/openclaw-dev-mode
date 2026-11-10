import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { O as setRuntimeConfigSnapshot, l as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as resolveAgentDir, h as resolveConfiguredAgentId, l as resolveAgentOperationAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as getProviderEnvVarsCore } from "./provider-env-vars-D43Pu6eG.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { f as listProfilesForProvider } from "./order-CElLtwMu.mjs";
import { d as loadAuthProfileStoreForRuntime } from "./store-runtime-CwqGD12G.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DRdbYkg7.mjs";
import { t as resolveModelRefOverride } from "./model-ref-override-smHu15tb.mjs";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-yepx543B.mjs";
//#region src/cli/capability-cli/shared.ts
function resolveTransport(opts) {
	if (opts.local && opts.gateway) throw new Error("Pass only one of --local or --gateway.");
	if (opts.local) return "local";
	if (opts.gateway) return "gateway";
	return opts.defaultTransport;
}
function hasOwnKeys(value) {
	return Boolean(value && typeof value === "object" && Object.keys(value).length > 0);
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
function parseOptionalPositiveInteger(raw, label) {
	if (raw === void 0) return;
	const value = parseStrictPositiveInteger(raw);
	if (value === void 0) throw new Error(`${label} must be a positive integer`);
	return value;
}
function parseOptionalTimeoutMs(raw) {
	if (raw === void 0) return;
	return parseTimeoutMsWithFallback(raw, 0, {
		invalidType: "error",
		flagName: "--timeout-ms"
	});
}
async function resolveLocalCapabilityRuntimeConfig(params) {
	const cfg = params.config ?? await captureRuntimeConfigAsyncReader()();
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
	const { prepareLocalCapabilityAccountSecrets } = await import("./local-account-secrets-CVbZkrlU.mjs");
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
	setRuntimeConfigSnapshot(config, getRuntimeConfigSourceSnapshot() ?? void 0);
}
//#endregion
export { requireProviderModelOverride as a, resolveLocalCapabilityAgent as c, providerHasGenericConfig as i, resolveLocalCapabilityRuntimeConfig as l, parseOptionalTimeoutMs as n, resolveCapabilityAgentOption as o, pinRuntimeConfigSnapshot as r, resolveCapabilityProviderAgentId as s, parseOptionalPositiveInteger as t, resolveTransport as u };
