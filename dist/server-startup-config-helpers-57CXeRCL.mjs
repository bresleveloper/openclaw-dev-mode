import { a as isConfigReadFailure, n as createConfigReadError, r as createInvalidConfigError } from "./io.invalid-config-BzeD3bi5.mjs";
import { S as resolveIsConfigReadOnly, l as isNixMode } from "./paths-DGIwWbpu.mjs";
import { i as copyConfigResolutionFactsExcept, r as copyConfigResolutionFacts, u as hasUnresolvedConfigPath } from "./resolution-facts-HH1cnmIY.mjs";
import { u as applyConfigOverrides } from "./io.factory-DWrU5KGJ.mjs";
import { r as isPluginPackagingRuntimeOutputInvalidConfigSnapshot } from "./recovery-policy-CgbblNbu.mjs";
import { d as readConfigFileSnapshotWithPluginMetadata } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CSQ1bLlx.mjs";
import { i as resolveGatewayAuthForConfig, n as mergeGatewayAuthConfig } from "./auth-resolve-BmUDP1m_.mjs";
import { t as assertGatewayAuthNotKnownWeak } from "./known-weak-gateway-secrets-BLCyfEDY.mjs";
import { n as evaluateGatewayAuthSurfaceStates, t as GATEWAY_AUTH_SURFACE_PATHS } from "./runtime-gateway-auth-surfaces-Ds6pwa6z.mjs";
import { n as mergeGatewayTailscaleConfig, t as ensureGatewayStartupAuth } from "./startup-auth-DUayyGtj.mjs";
import { n as formatPluginPackagingRuntimeOutputRecoveryHint, t as formatInvalidConfigRecoveryHint } from "./config-recovery-hints-BcovfhC8.mjs";
import { t as renderConfigValidationIssueLines } from "./issue-location-nU8-G0tV.mjs";
import { t as isChannelStartupSuppressedByEnvironment } from "./server-sidecar-startup-mode-De0PJqUq.mjs";
import { t as mergeActivationSectionsIntoRuntimeConfig } from "./plugin-activation-runtime-config-gs4-U9B6.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-startup-secret-surfaces.ts
function resolveGatewayStartupSourceConfig(config, env) {
	if (!isChannelStartupSuppressedByEnvironment(env) || !config.channels) return config;
	return {
		...config,
		channels: void 0
	};
}
//#endregion
//#region src/gateway/server-startup-config-helpers.ts
/** Throw a formatted startup error when the loaded config snapshot is invalid. */
function assertValidGatewayStartupConfigSnapshot(snapshot, options = {}) {
	if (snapshot.valid) return;
	const issues = snapshot.issues.length > 0 ? renderConfigValidationIssueLines(snapshot, "").join("\n") : "Unknown validation issue.";
	if (isConfigReadFailure(snapshot)) throw createConfigReadError(snapshot, `${issues}\nResolve the read error shown above, then retry.`);
	const recoveryHint = options.includeDoctorHint && isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot) ? `\n${formatPluginPackagingRuntimeOutputRecoveryHint()}` : options.includeDoctorHint ? `\n${formatInvalidConfigRecoveryHint()}` : "";
	throw createInvalidConfigError(snapshot.path, `${issues}${recoveryHint}`, { recovery: isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot) ? "manual" : "doctor" });
}
/** Load and validate the config snapshot, applying runtime-only plugin auto-enable changes. */
async function loadGatewayStartupConfigSnapshot(params) {
	const measure = params.measure ?? (async (_name, run) => await run());
	const snapshotRead = params.initialSnapshotRead ?? await measure("config.snapshot.read", () => readConfigFileSnapshotWithPluginMetadata({ measure }));
	const configSnapshot = snapshotRead.snapshot;
	const pluginMetadataSnapshot = snapshotRead.pluginMetadataSnapshot;
	if (configSnapshot.legacyIssues.length > 0 && resolveIsConfigReadOnly()) throw createInvalidConfigError(configSnapshot.path, isNixMode ? "Legacy config entries detected while running in Nix mode. Update your Nix config to the latest schema and restart." : "Legacy config entries detected in read-only config. Update your external config source to the latest schema and restart.", { recovery: "manual" });
	if (configSnapshot.exists) assertValidGatewayStartupConfigSnapshot(configSnapshot, { includeDoctorHint: true });
	const autoEnable = params.minimalTestGateway ? {
		config: configSnapshot.config,
		changes: []
	} : await measure("config.snapshot.auto-enable", () => applyPluginAutoEnable({
		config: configSnapshot.sourceConfig,
		env: process.env,
		ambientEnvTriggers: params.ambientEnvTriggers,
		...pluginMetadataSnapshot?.manifestRegistry ? { manifestRegistry: pluginMetadataSnapshot.manifestRegistry } : {},
		discovery: pluginMetadataSnapshot?.discovery
	}));
	if (autoEnable.changes.length === 0) return {
		snapshot: configSnapshot,
		...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}
	};
	params.log.info(`gateway: auto-enabled plugins for this runtime without writing config:\n${autoEnable.changes.map((entry) => `- ${entry}`).join("\n")}`);
	const runtimeConfig = mergeActivationSectionsIntoRuntimeConfig({
		runtimeConfig: configSnapshot.runtimeConfig,
		activationConfig: autoEnable.config
	});
	copyConfigResolutionFacts(configSnapshot.sourceConfig, runtimeConfig);
	return {
		snapshot: {
			...configSnapshot,
			runtimeConfig,
			config: runtimeConfig
		},
		...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}
	};
}
function hasActiveGatewayAuthSecretRef(config) {
	const states = evaluateGatewayAuthSurfaceStates({
		config,
		defaults: config.secrets?.defaults,
		env: process.env
	});
	return GATEWAY_AUTH_SURFACE_PATHS.some((path) => {
		const state = states[path];
		return state.hasSecretRef && state.active;
	});
}
function assertRuntimeGatewayAuthNotKnownWeak(config) {
	assertGatewayAuthNotKnownWeak(resolveGatewayAuthForConfig({
		config,
		env: process.env,
		tailscaleMode: config.gateway?.tailscale?.mode ?? "off"
	}), config.gateway?.auth?.token, config.gateway?.auth?.password);
}
function logGatewayAuthSurfaceDiagnostics(prepared, logSecrets) {
	const states = evaluateGatewayAuthSurfaceStates({
		config: prepared.sourceConfig,
		defaults: prepared.sourceConfig.secrets?.defaults,
		env: process.env
	});
	const inactiveWarnings = /* @__PURE__ */ new Map();
	for (const warning of prepared.warnings) {
		if (warning.code !== "SECRETS_REF_IGNORED_INACTIVE_SURFACE") continue;
		inactiveWarnings.set(warning.path, warning.message);
	}
	for (const path of GATEWAY_AUTH_SURFACE_PATHS) {
		const state = states[path];
		if (!state.hasSecretRef) continue;
		const stateLabel = state.active ? "active" : "inactive";
		const details = (!state.active && inactiveWarnings.get(path) ? inactiveWarnings.get(path) : void 0) ?? state.reason;
		logSecrets.info(`[SECRETS_GATEWAY_AUTH_SURFACE] ${path} is ${stateLabel}. ${details}`);
	}
}
function applyGatewayAuthOverridesForStartupPreflight(config, overrides) {
	if (!overrides.auth && !overrides.tailscale) return config;
	const next = {
		...config,
		gateway: {
			...config.gateway,
			...overrides.auth ? { auth: mergeGatewayAuthConfig(config.gateway?.auth, overrides.auth) } : {},
			...overrides.tailscale ? { tailscale: mergeGatewayTailscaleConfig(config.gateway?.tailscale, overrides.tailscale) } : {}
		}
	};
	copyConfigResolutionFactsExcept(config, next, [...overrides.auth?.token !== void 0 ? ["gateway.auth.token"] : [], ...overrides.auth?.password !== void 0 ? ["gateway.auth.password"] : []]);
	return next;
}
/** Prepare the effective Gateway startup config after auth, overrides, and secrets activation. */
async function prepareGatewayStartupConfig(params) {
	const measure = params.measure ?? (async (_name, run) => await run());
	await measure("config.auth.snapshot-validate", () => assertValidGatewayStartupConfigSnapshot(params.configSnapshot));
	const runtimeConfig = await measure("config.auth.runtime-overrides", () => applyConfigOverrides(params.configSnapshot.config));
	copyConfigResolutionFacts(params.configSnapshot.config, runtimeConfig);
	const startupPreflightConfig = await measure("config.auth.startup-overrides", () => applyGatewayAuthOverridesForStartupPreflight(runtimeConfig, {
		auth: params.authOverride,
		tailscale: params.tailscaleOverride
	}));
	const needsAuthSecretPreflight = await measure("config.auth.secret-surface", () => hasActiveGatewayAuthSecretRef(startupPreflightConfig));
	let preflightPrepared;
	const preflightConfig = await measure("config.auth.secret-preflight", async () => {
		if (!needsAuthSecretPreflight) return startupPreflightConfig;
		preflightPrepared = await params.activateRuntimeSecrets(startupPreflightConfig, {
			reason: "startup",
			activate: false
		});
		return preflightPrepared.config;
	}, { omitErrorMessage: true });
	const activateStartupSecrets = async (config) => {
		if (preflightPrepared && isDeepStrictEqual(resolveGatewayStartupSourceConfig(config, process.env), preflightPrepared.sourceConfig)) return await params.activateRuntimeSecrets.activatePreparedSnapshot(preflightPrepared, {
			reason: "startup",
			activate: true
		});
		return await params.activateRuntimeSecrets(config, {
			reason: "startup",
			activate: true
		});
	};
	const preflightAuthOverride = await measure("config.auth.preflight-override", () => {
		const token = preflightConfig.gateway?.auth?.token;
		const password = preflightConfig.gateway?.auth?.password;
		const resolvedToken = typeof token === "string" && !hasUnresolvedConfigPath(preflightConfig, "gateway.auth.token");
		const resolvedPassword = typeof password === "string" && !hasUnresolvedConfigPath(preflightConfig, "gateway.auth.password");
		return resolvedToken || resolvedPassword ? {
			...params.authOverride,
			...resolvedToken ? { token } : {},
			...resolvedPassword ? { password } : {}
		} : params.authOverride;
	});
	const authBootstrap = await measure("config.auth.ensure", () => ensureGatewayStartupAuth({
		cfg: runtimeConfig,
		env: process.env,
		authOverride: preflightAuthOverride,
		tailscaleOverride: params.tailscaleOverride,
		warn: params.log?.warn
	}));
	const runtimeStartupConfig = await measure("config.auth.runtime-startup-overrides", () => applyGatewayAuthOverridesForStartupPreflight(authBootstrap.cfg, {
		auth: params.authOverride,
		tailscale: params.tailscaleOverride
	}));
	const activatedConfig = (await measure("config.auth.secrets-activate", () => activateStartupSecrets(runtimeStartupConfig), { omitErrorMessage: true })).config;
	return {
		...authBootstrap,
		cfg: activatedConfig
	};
}
//#endregion
export { logGatewayAuthSurfaceDiagnostics as a, loadGatewayStartupConfigSnapshot as i, assertRuntimeGatewayAuthNotKnownWeak as n, prepareGatewayStartupConfig as o, hasActiveGatewayAuthSecretRef as r, resolveGatewayStartupSourceConfig as s, applyGatewayAuthOverridesForStartupPreflight as t };
