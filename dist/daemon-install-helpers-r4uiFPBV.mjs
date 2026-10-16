import { u as resolveGatewayLaunchAgentLabel } from "./constants-BLghGsId.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { g as resolveSecretInputRef } from "./types.secrets-DsPRn9Dz.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as resolveGatewayStateDir, r as resolveGatewayTaskScriptPath } from "./paths-DMJOvLwv.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-CDVrpZuO.mjs";
import { a as normalizeEnvVarKey, n as isDangerousHostEnvOverrideVarName, r as isDangerousHostEnvVarName } from "./host-env-security-BgpkByrc.mjs";
import { f as resolveConfigSecretRef, n as collectEnvSecretRefIds } from "./resolution-facts-HH1cnmIY.mjs";
import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DdBZxRt7.mjs";
import { i as createResolverContext } from "./runtime-shared-7qI1DEx4.mjs";
import { n as discoverConfigSecretTargets } from "./target-registry-query-f56MMhmb.mjs";
import "./target-registry-1a6D8fYt.mjs";
import { S as resolveGatewayProgramArguments, w as resolveOpenClawWrapperPath, x as OPENCLAW_WRAPPER_ENV_KEY } from "./schtasks-BZ33FXAo.mjs";
import { o as resolveManagedGatewayServiceCommand } from "./service-types-CPk6CBn6.mjs";
import { o as resolveLaunchAgentEnvWrapperPath } from "./launchd-service-files-BNJoYP-S.mjs";
import { D as collectDurableServiceEnvVarSources } from "./systemd-service-files-BXSBYnK_.mjs";
import { c as normalizeServiceEnvKey, d as readManagedServiceEnvKeysFromEnvironment, i as formatManagedServiceEnvKeys, p as writeManagedServiceEnvKeysToEnvironment, u as readEnvironmentValueSource } from "./service-managed-env-BaBwrbT1.mjs";
import { m as mergeServicePath } from "./runtime-paths-D7k3lrcM.mjs";
import { r as resolveSecretProviderIntegrationConfig, t as isPluginIntegrationSecretProviderConfig } from "./provider-integrations-CoL46KV7.mjs";
import { n as evaluateGatewayAuthSurfaceStates } from "./runtime-gateway-auth-surfaces-Ds6pwa6z.mjs";
import { t as collectPluginConfigAssignments } from "./runtime-config-collectors-plugins-W3Ka4qGY.mjs";
import { n as hasSecretRefCandidate } from "./runtime-secret-scan-oiKIfhgL.mjs";
import { r as buildServiceEnvironment } from "./service-env-6WPxGura.mjs";
import { i as resolveDaemonServicePathDirs, n as resolveDaemonInstallRuntimeInputs, t as emitNodeRuntimeWarning } from "./daemon-install-runtime-warning-D95FO_9s.mjs";
import path from "node:path";
//#region src/daemon/service-env-plan.ts
function createMutableServiceEnvPlan() {
	return {
		environment: {},
		environmentValueSources: {}
	};
}
function addServiceEnvPlanEntries(plan, entries, options) {
	for (const [rawKey, rawValue] of Object.entries(entries)) {
		if (typeof rawValue !== "string" || !rawValue.trim()) {
			if (options.includeRawKeys) {
				plan.environment[rawKey] = rawValue;
				plan.environmentValueSources[rawKey] = "inline";
			}
			continue;
		}
		const normalizedKey = normalizeServiceEnvKey(rawKey);
		if (!normalizedKey || options.includeKeys && !options.includeKeys.has(normalizedKey)) continue;
		plan.environment[rawKey] = rawValue;
		const valueSource = typeof options.valueSource === "function" ? options.valueSource({
			rawKey,
			normalizedKey
		}) : options.valueSource;
		plan.environmentValueSources[rawKey] = valueSource ?? "inline";
	}
}
function compactServiceEnvPlanValueSources(plan) {
	for (const key of Object.keys(plan.environmentValueSources)) if (!Object.hasOwn(plan.environment, key)) delete plan.environmentValueSources[key];
}
//#endregion
//#region src/daemon/service-env-render-policy.ts
function applyManagedServiceEnvRenderPolicy(params) {
	const launchAgent = params.platform === "darwin" && Boolean(params.serviceEnvironment.OPENCLAW_LAUNCHD_LABEL?.trim());
	writeManagedServiceEnvKeysToEnvironment(params.plan.environment, params.managedServiceEnvKeys);
	if (params.plan.environment.OPENCLAW_SERVICE_MANAGED_ENV_KEYS) params.plan.environmentValueSources.OPENCLAW_SERVICE_MANAGED_ENV_KEYS = "inline";
	const managedKeys = readManagedServiceEnvKeysFromEnvironment({ OPENCLAW_SERVICE_MANAGED_ENV_KEYS: params.managedServiceEnvKeys });
	if (managedKeys.size === 0) return;
	if (launchAgent || params.platform === "linux") addServiceEnvPlanEntries(params.plan, params.existingSecretRefEnvironment, {
		includeKeys: managedKeys,
		valueSource: "file"
	});
	if (launchAgent) addServiceEnvPlanEntries(params.plan, params.stateDirDotEnvEnvironment, {
		includeKeys: managedKeys,
		valueSource: "inline"
	});
	addServiceEnvPlanEntries(params.plan, params.configSecretRefEnvironment, {
		includeKeys: managedKeys,
		valueSource: params.platform === "linux" ? "file" : "inline"
	});
}
//#endregion
//#region src/commands/daemon-install-helpers.ts
const NON_PERSISTED_CONFIG_SECRET_ENV_TARGET_IDS = /* @__PURE__ */ new Set(["gateway.auth.password", "gateway.auth.token"]);
const EXEC_SECRET_REF_PASS_ENV_ALLOWED_OVERRIDE_ONLY_KEYS = /* @__PURE__ */ new Set(["HOME"]);
function isBlockedExecSecretRefPassEnvKey(key) {
	if (isDangerousHostEnvVarName(key)) return true;
	if (!isDangerousHostEnvOverrideVarName(key)) return false;
	return !EXEC_SECRET_REF_PASS_ENV_ALLOWED_OVERRIDE_ONLY_KEYS.has(key.toUpperCase());
}
const loadDaemonInstallAuthProfileSourceRuntime = createLazyPromise(() => import("./daemon-install-auth-profiles-source.runtime.js"), { cacheRejections: true });
const loadDaemonInstallAuthProfileStoreRuntime = createLazyPromise(() => import("./daemon-install-auth-profiles-store.runtime.js"), { cacheRejections: true });
const loadDaemonInstallProviderManifestRuntime = createLazyPromise(() => import("./manifest-contract-eligibility-BnJ_c0-O.mjs"), { cacheRejections: true });
async function resolveAuthProfileStoreForServiceEnv(authStore) {
	if (authStore) return authStore;
	const { hasAnyAuthProfileStoreSource } = await loadDaemonInstallAuthProfileSourceRuntime();
	if (!hasAnyAuthProfileStoreSource()) return;
	const { loadAuthProfileStoreForSecretsRuntime } = await loadDaemonInstallAuthProfileStoreRuntime();
	return loadAuthProfileStoreForSecretsRuntime();
}
function collectAuthProfileSecretRefs(authStore) {
	if (!authStore) return [];
	const refs = [];
	for (const credential of Object.values(authStore.profiles)) {
		const ref = credential.type === "api_key" ? credential.keyRef : credential.type === "token" ? credential.tokenRef : void 0;
		if (ref) refs.push(ref);
	}
	return refs;
}
function collectAuthProfileServiceEnvVars(params) {
	const entries = {};
	for (const ref of collectAuthProfileSecretRefs(params.authStore)) {
		if (ref.source !== "env") continue;
		const key = normalizeEnvVarKey(ref.id, { portable: true });
		if (!key) continue;
		if (isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key)) {
			params.warn?.(`Auth profile env ref "${key}" blocked by host-env security policy`, "Auth profile");
			continue;
		}
		const value = params.env[key]?.trim();
		if (!value) continue;
		entries[key] = value;
	}
	return entries;
}
async function collectAmbientProviderApiKeyServiceEnvVars(params) {
	if (params.platform !== "linux") return {};
	const existingManagedKeys = readManagedServiceEnvKeysFromEnvironment(params.existingEnvironment);
	const ownedKeys = new Set([
		...Object.keys(params.durableEnvironment),
		...Object.keys(params.authProfileEnvironment),
		...Object.entries(params.existingEnvironment ?? {}).flatMap(([key, value]) => existingManagedKeys.has(key.toUpperCase()) && params.env[key]?.trim() !== value?.trim() ? [] : [key])
	].map((key) => key.toUpperCase()));
	const candidates = new Map(Object.entries(params.env).flatMap(([rawKey, rawValue]) => {
		const key = normalizeEnvVarKey(rawKey, { portable: true })?.toUpperCase();
		const value = rawValue?.trim();
		return key && key.endsWith("_API_KEY") && !key.endsWith("_ADMIN_API_KEY") && !ownedKeys.has(key) && value && !isDangerousHostEnvVarName(key) && !isDangerousHostEnvOverrideVarName(key) ? [[key, value]] : [];
	}));
	if (candidates.size === 0) return {};
	const { isManifestPluginAvailableForControlPlane, loadManifestMetadataSnapshot } = await loadDaemonInstallProviderManifestRuntime();
	const config = params.config ?? {};
	const snapshot = loadManifestMetadataSnapshot({
		config,
		env: params.env
	});
	return Object.fromEntries(snapshot.plugins.flatMap((plugin) => {
		if (plugin.origin !== "bundled" && plugin.trustedOfficialInstall !== true || !isManifestPluginAvailableForControlPlane({
			snapshot,
			plugin,
			config
		})) return [];
		const providers = new Set((plugin.providerAuthChoices ?? []).filter(({ method, appGuidedSecret, onboardingScopes }) => method === "api-key" && appGuidedSecret === true && (!onboardingScopes || onboardingScopes.includes("text-inference"))).map(({ provider }) => provider));
		return (plugin.setup?.providers ?? []).filter(({ id }) => providers.has(id)).flatMap(({ envVars = [] }) => envVars.flatMap((name) => {
			const key = normalizeEnvVarKey(name, { portable: true })?.toUpperCase();
			const value = key ? candidates.get(key) : void 0;
			return key && value ? [[key, value]] : [];
		}));
	}));
}
function* configSecretRefsForService(config) {
	for (const target of discoverConfigSecretTargets(config)) {
		if (!target.entry.includeInPlan) continue;
		const { ref } = resolveSecretInputRef({
			value: resolveConfigSecretRef({
				config,
				path: target.path,
				value: target.value,
				defaults: config.secrets?.defaults,
				includeResolved: true
			}),
			refValue: target.refValue,
			defaults: config.secrets?.defaults
		});
		if (ref) yield {
			target,
			ref
		};
	}
}
function collectConfigSecretRefServiceEnvSources(params) {
	const keys = /* @__PURE__ */ new Set();
	const environment = {};
	if (!params.config || !params.configContainsSecretRef) return {
		keys: [],
		environment
	};
	const gatewayAuthSurfaceStates = evaluateGatewayAuthSurfaceStates({
		config: params.config,
		env: params.env,
		defaults: params.config.secrets?.defaults
	});
	for (const { target, ref } of configSecretRefsForService(params.config)) {
		if (ref.source !== "env") continue;
		const key = normalizeEnvVarKey(ref.id, { portable: true });
		if (!key) {
			params.warn?.(`Config SecretRef env id "${ref.id}" is not portable and was not added to the service environment`, "Config SecretRef");
			continue;
		}
		if (isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key)) {
			params.warn?.(`Config SecretRef env ref "${key}" blocked by host-env security policy`, "Config SecretRef");
			continue;
		}
		if (NON_PERSISTED_CONFIG_SECRET_ENV_TARGET_IDS.has(target.entry.id)) {
			if (gatewayAuthSurfaceStates[target.entry.id]?.active) keys.add(key.toUpperCase());
			continue;
		}
		keys.add(key.toUpperCase());
		if (Object.hasOwn(params.stateDirDotEnvEnvironment, key)) continue;
		const value = params.env[key]?.trim();
		if (!value) continue;
		environment[key] = value;
	}
	return {
		keys: [...keys],
		environment
	};
}
function collectExecSecretRefPassEnvServiceEnvVars(params) {
	if (!params.config) return {};
	const entries = {};
	let manifestRegistry;
	const sources = [];
	if (params.configContainsSecretRef) {
		for (const { ref } of configSecretRefsForService(params.config)) if (ref.source === "exec") sources.push({
			ref,
			warningTitle: "Config SecretRef"
		});
	}
	for (const ref of collectAuthProfileSecretRefs(params.authStore)) if (ref.source === "exec") sources.push({
		ref,
		warningTitle: "Auth profile"
	});
	if (params.configContainsSecretRef) {
		for (const ref of collectPluginConfigSecretRefs({
			env: params.env,
			config: params.config
		})) if (ref.source === "exec") sources.push({
			ref,
			warningTitle: "Plugin config SecretRef"
		});
	}
	for (const { ref, warningTitle } of sources) {
		const provider = params.config.secrets?.providers?.[ref.provider];
		if (!provider || provider.source !== "exec") continue;
		const execProvider = isPluginIntegrationSecretProviderConfig(provider) ? (() => {
			manifestRegistry ??= resolveConfigWidePluginManifestRegistry({
				config: params.config,
				env: params.env
			});
			const resolved = resolveSecretProviderIntegrationConfig({
				manifestRegistry,
				providerAlias: ref.provider,
				providerConfig: provider,
				config: params.config,
				env: params.env
			});
			if (!resolved.ok) {
				params.warn?.(`Exec SecretRef plugin provider "${ref.provider}" could not be resolved for service environment planning: ${resolved.reason}`, warningTitle);
				return;
			}
			return resolved.providerConfig;
		})() : provider;
		if (!execProvider) continue;
		for (const rawKey of execProvider.passEnv ?? []) {
			const key = normalizeEnvVarKey(rawKey, { portable: true });
			if (!key) {
				params.warn?.(`Exec SecretRef passEnv id "${rawKey}" is not portable and was not added to the service environment`, warningTitle);
				continue;
			}
			const value = Object.hasOwn(params.env, key) ? params.env[key]?.trim() : void 0;
			if (!value) continue;
			if (isBlockedExecSecretRefPassEnvKey(key)) {
				params.warn?.(`Exec SecretRef passEnv ref "${key}" blocked by host-env security policy`, warningTitle);
				continue;
			}
			if (Object.hasOwn(params.durableEnvironment, key)) continue;
			entries[key] = value;
		}
	}
	return entries;
}
function collectPluginConfigSecretRefs(params) {
	const context = createResolverContext({
		sourceConfig: params.config,
		env: params.env
	});
	collectPluginConfigAssignments({
		config: params.config,
		defaults: params.config.secrets?.defaults,
		context
	});
	return context.assignments.map((assignment) => assignment.ref);
}
const PRESERVED_OPENCLAW_OPERATOR_OPT_IN_ENV_KEYS = /* @__PURE__ */ new Set([
	"OPENCLAW_CLI_CONTAINER_BYPASS",
	"OPENCLAW_CONFIG_READONLY",
	"OPENCLAW_CONTAINER_HINT"
]);
function collectExistingServiceEnvVars(existingEnvironment, includeKey) {
	const preserved = {};
	for (const [rawKey, rawValue] of Object.entries(existingEnvironment ?? {})) {
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (!key || !includeKey(key.toUpperCase()) || isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key)) continue;
		const value = rawValue?.trim();
		if (!value) continue;
		preserved[key] = value;
	}
	return preserved;
}
function omitEnvironmentEntriesShadowedBy(entries, shadowEntries) {
	const shadowKeys = new Set(shadowEntries.flatMap((environment) => Object.keys(environment).flatMap((key) => {
		const normalized = normalizeEnvVarKey(key, { portable: true })?.toUpperCase();
		return normalized ? [normalized] : [];
	})));
	return Object.fromEntries(Object.entries(entries).filter(([key]) => {
		const normalized = normalizeEnvVarKey(key, { portable: true })?.toUpperCase();
		return !normalized || !shadowKeys.has(normalized);
	}));
}
async function buildGatewayInstallEnvironment(params) {
	const { stateDirDotEnvEnvironment, configEnvironment, durableEnvironment } = collectDurableServiceEnvVarSources({
		env: params.env,
		config: params.config
	});
	const containsConfigSecretRef = hasSecretRefCandidate(params.config, params.config?.secrets?.defaults) || collectEnvSecretRefIds(params.config).size > 0;
	const { keys: configSecretRefKeys, environment: configSecretRefEnvironment } = collectConfigSecretRefServiceEnvSources({
		env: params.env,
		config: params.config,
		configContainsSecretRef: containsConfigSecretRef,
		stateDirDotEnvEnvironment,
		warn: params.warn
	});
	const authStore = await resolveAuthProfileStoreForServiceEnv(params.authStore);
	const execSecretRefPassEnvEnvironment = collectExecSecretRefPassEnvServiceEnvVars({
		env: params.env,
		config: params.config,
		configContainsSecretRef: containsConfigSecretRef,
		authStore,
		durableEnvironment,
		warn: params.warn
	});
	const authProfileEnvironment = collectAuthProfileServiceEnvVars({
		env: params.env,
		authStore,
		warn: params.warn
	});
	const ambientProviderApiKeyEnvironment = await collectAmbientProviderApiKeyServiceEnvVars({
		env: params.env,
		config: params.config,
		durableEnvironment,
		authProfileEnvironment,
		existingEnvironment: params.existingEnvironment,
		platform: params.platform
	});
	const stateDirDotEnvRenderEnvironment = omitEnvironmentEntriesShadowedBy(stateDirDotEnvEnvironment, [
		configEnvironment,
		configSecretRefEnvironment,
		execSecretRefPassEnvEnvironment,
		authProfileEnvironment
	]);
	const existingManagedKeys = readManagedServiceEnvKeysFromEnvironment(params.existingEnvironment);
	const preservedExistingEnvironment = collectExistingServiceEnvVars(params.existingEnvironment, (key) => key !== "HOME" && key !== "PATH" && key !== "TMPDIR" && key !== "HOMEBREW_PREFIX" && (!key.startsWith("OPENCLAW_") || PRESERVED_OPENCLAW_OPERATOR_OPT_IN_ENV_KEYS.has(key)) && !existingManagedKeys.has(key));
	const plan = createMutableServiceEnvPlan();
	addServiceEnvPlanEntries(plan, preservedExistingEnvironment, { valueSource: ({ normalizedKey }) => readEnvironmentValueSource(params.existingEnvironmentValueSources, normalizedKey) ?? "inline" });
	addServiceEnvPlanEntries(plan, ambientProviderApiKeyEnvironment, { valueSource: "file" });
	addServiceEnvPlanEntries(plan, stateDirDotEnvEnvironment, {});
	addServiceEnvPlanEntries(plan, configEnvironment, {});
	addServiceEnvPlanEntries(plan, configSecretRefEnvironment, {});
	addServiceEnvPlanEntries(plan, execSecretRefPassEnvEnvironment, {});
	addServiceEnvPlanEntries(plan, authProfileEnvironment, {});
	const configSecretRefKeyEnvironment = Object.fromEntries(configSecretRefKeys.map((key) => [key, "1"]));
	const managedServiceEnvKeys = formatManagedServiceEnvKeys({
		...durableEnvironment,
		...configSecretRefKeyEnvironment,
		...configSecretRefEnvironment
	}, { omitKeys: Object.keys(params.serviceEnvironment) });
	const configSecretRefKeySet = new Set(configSecretRefKeys);
	const existingSecretRefRenderEnvironment = omitEnvironmentEntriesShadowedBy(collectExistingServiceEnvVars(params.existingEnvironment, (key) => configSecretRefKeySet.has(key)), [
		stateDirDotEnvRenderEnvironment,
		configSecretRefEnvironment,
		execSecretRefPassEnvEnvironment,
		authProfileEnvironment
	]);
	applyManagedServiceEnvRenderPolicy({
		plan,
		managedServiceEnvKeys,
		serviceEnvironment: params.serviceEnvironment,
		platform: params.platform,
		existingSecretRefEnvironment: existingSecretRefRenderEnvironment,
		stateDirDotEnvEnvironment: stateDirDotEnvRenderEnvironment,
		configSecretRefEnvironment
	});
	addServiceEnvPlanEntries(plan, params.serviceEnvironment, { includeRawKeys: true });
	const mergedPath = mergeServicePath(params.serviceEnvironment.PATH, params.existingEnvironment?.PATH, params.serviceEnvironment.TMPDIR, params.platform);
	if (mergedPath) {
		plan.environment.PATH = mergedPath;
		plan.environmentValueSources.PATH = "inline";
	}
	compactServiceEnvPlanValueSources(plan);
	return {
		environment: plan.environment,
		environmentValueSources: plan.environmentValueSources
	};
}
/** Build command, working directory, and environment for installing the Gateway service. */
async function buildGatewayInstallPlan(params) {
	const platform = params.platform ?? process.platform;
	const wrapperInput = params.wrapperPath ?? params.env["OPENCLAW_WRAPPER"];
	const generatedWrapperPath = platform === "win32" ? resolveGatewayTaskScriptPath(params.env) : platform === "darwin" ? resolveLaunchAgentEnvWrapperPath(params.env, resolveLaunchAgentLabel(params.env)) : void 0;
	const wrapperPointsAtGeneratedScript = generatedWrapperPath !== void 0 && normalizeServicePathForCompare(wrapperInput, platform) === normalizeServicePathForCompare(generatedWrapperPath, platform);
	if (wrapperPointsAtGeneratedScript) params.warn?.(platform === "win32" ? `Ignoring ${OPENCLAW_WRAPPER_ENV_KEY} because it points to the Windows task script; using the OpenClaw gateway entrypoint directly to avoid a recursive gateway.cmd wrapper.` : `Ignoring ${OPENCLAW_WRAPPER_ENV_KEY} because it points to the generated LaunchAgent environment wrapper; using the OpenClaw gateway entrypoint directly to avoid a self-referencing wrapper.`);
	const wrapperPath = wrapperPointsAtGeneratedScript ? void 0 : await resolveOpenClawWrapperPath(wrapperInput);
	const { devMode, runtime, runtimePath } = await resolveDaemonInstallRuntimeInputs({
		env: params.env,
		runtime: params.runtime,
		runtimeExplicit: params.runtimeExplicit,
		devMode: params.devMode,
		runtimePath: params.runtimePath,
		pinnedRuntimePath: params.pinnedRuntimePath,
		wrapperPath,
		warn: params.warn
	});
	const serviceInputEnv = { ...params.env };
	if (wrapperPath) serviceInputEnv[OPENCLAW_WRAPPER_ENV_KEY] = wrapperPath;
	else if (wrapperPointsAtGeneratedScript) delete serviceInputEnv[OPENCLAW_WRAPPER_ENV_KEY];
	const { programArguments, workingDirectory } = await resolveGatewayProgramArguments({
		port: params.port,
		allowUnconfigured: params.allowUnconfigured ?? (params.config?.gateway?.mode === "remote" && resolveManagedGatewayServiceCommand(params.existingCommand)?.programArguments.includes("--allow-unconfigured") === true),
		dev: devMode,
		runtime,
		runtimePath,
		wrapperPath,
		...params.existingCommand ? { existingCommand: params.existingCommand } : {}
	});
	await emitNodeRuntimeWarning({
		env: params.env,
		runtime,
		nodeProgram: programArguments[0],
		warn: params.warn,
		title: "Gateway runtime"
	});
	const serviceEnvironment = buildServiceEnvironment({
		env: serviceInputEnv,
		port: params.port,
		runtime,
		existingNodeOptions: resolveManagedGatewayServiceCommand(params.existingCommand)?.environment?.NODE_OPTIONS,
		launchdLabel: platform === "darwin" ? resolveGatewayLaunchAgentLabel(serviceInputEnv.OPENCLAW_PROFILE) : void 0,
		platform,
		extraPathDirs: resolveDaemonServicePathDirs({
			runtimePath,
			env: serviceInputEnv,
			platform
		})
	});
	const { environment, environmentValueSources } = await buildGatewayInstallEnvironment({
		env: serviceInputEnv,
		config: params.config,
		authStore: params.authStore,
		warn: params.warn,
		serviceEnvironment,
		existingEnvironment: params.existingEnvironment,
		existingEnvironmentValueSources: params.existingEnvironmentValueSources,
		platform
	});
	return {
		runtime,
		programArguments,
		workingDirectory: workingDirectory || (platform === "darwin" ? resolveGatewayStateDir(serviceInputEnv) : void 0),
		environment,
		...Object.keys(environmentValueSources).length > 0 ? { environmentValueSources } : {}
	};
}
function normalizeServicePathForCompare(value, platform) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	return platform === "win32" ? path.win32.resolve(trimmed).toLowerCase() : path.resolve(trimmed);
}
/** Return the user-facing recovery hint for failed Gateway service installation. */
function gatewayInstallErrorHint(platform = process.platform) {
	return platform === "win32" ? "Tip: native Windows now falls back to a per-user Startup-folder login item when Scheduled Task creation is denied; if install still fails, rerun from an elevated PowerShell or skip service install." : `Tip: rerun \`${formatCliCommand("openclaw gateway install")}\` after fixing the error.`;
}
//#endregion
export { gatewayInstallErrorHint as n, buildGatewayInstallPlan as t };
