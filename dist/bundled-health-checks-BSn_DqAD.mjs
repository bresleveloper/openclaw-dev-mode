import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizePluginsConfig, s as normalizePluginId } from "./config-state-BEAL5gWH.mjs";
import { _ as describePluginAvailabilityFailure } from "./discovery-D_5mAUI7.mjs";
import { n as loadBundledPluginManifestRegistry } from "./manifest-registry-build-BbQTPsvD.mjs";
import { n as loadBundledPluginPublicArtifactModuleSync, r as loadPluginPublicArtifactModuleSync, t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-CNXp9Fm5.mjs";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-CHC0CCKR.mjs";
import "./plugin-registry-CVPVm6lt.mjs";
import { r as resolveProviderPolicySurface } from "./provider-public-artifacts-Dm_p9SMS.mjs";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-DBwiH9TR.mjs";
import { t as collectConfiguredWorkerProviderIds } from "./worker-provider-config-OOjrHh-W.mjs";
import { t as listBundledWorkerProviderOwners } from "./worker-provider-manifest-nXb1-dX2.mjs";
import { o as registerHealthCheck, r as getHealthCheck } from "./health-check-registry-AvzmSJIz.mjs";
//#region src/flows/bundled-health-checks.ts
function defineHealthCheckRegistration(register, updateReadiness) {
	const registerCheck = updateReadiness ? (check) => registerHealthCheck(Object.assign(check, { updateReadiness })) : registerHealthCheck;
	return {
		updateReadiness,
		register: (params) => register(params, registerCheck)
	};
}
const HEALTH_CHECK_REGISTRATIONS = [
	defineHealthCheckRegistration(registerMemoryCoreHealthChecks, "post-plugin"),
	defineHealthCheckRegistration(registerCodexHealthChecks),
	defineHealthCheckRegistration(registerPolicyHealthChecks),
	defineHealthCheckRegistration(registerCuaHealthChecks),
	defineHealthCheckRegistration(registerBundledWorkerProviderHealthChecks)
];
function loadMemoryCoreHealthApi() {
	return loadBundledPluginPublicArtifactModuleSync({
		dirName: "memory-core",
		artifactBasename: "doctor-health-api.js"
	});
}
function resolveBundledHealthCheckPluginStateMode(selection) {
	if (selection.updateReadiness !== void 0) return "isolated";
	if (selection.includeAllChecks !== true && (selection.onlyIds === void 0 || selection.onlyIds.length === 0)) return "direct";
	const isolatedIds = new Set(loadMemoryCoreHealthApi().pluginStateIsolatedDoctorCheckIds ?? []);
	const skippedIds = new Set(selection.skipIds ?? []);
	const selectedOnlyIds = [...new Set(selection.onlyIds ?? [])].filter((id) => !skippedIds.has(id));
	if ((selectedOnlyIds.length > 0 ? selectedOnlyIds.filter((id) => isolatedIds.has(id)) : [...isolatedIds].filter((id) => !skippedIds.has(id))).length === 0) return "direct";
	if (selectedOnlyIds.length > 0 && selectedOnlyIds.every((id) => isolatedIds.has(id))) return "deferred";
	return "isolated";
}
/** Registers bundled health checks that are explicitly enabled by config and owner policy. */
function registerBundledHealthChecks(params) {
	const findings = [];
	for (const registration of HEALTH_CHECK_REGISTRATIONS) {
		if (params.updateReadiness !== void 0 && registration.updateReadiness !== params.updateReadiness) continue;
		findings.push(...registration.register(params) ?? []);
	}
	return findings;
}
function registerMemoryCoreHealthChecks(params, registerCheck) {
	const env = params.env ?? process.env;
	loadMemoryCoreHealthApi().registerMemoryCoreDoctorChecks?.({
		getHealthCheck,
		registerHealthCheck: registerCheck,
		async inspectEmbeddingProviderSetup(providerParams) {
			const inspect = async (pluginMetadataEnv) => {
				const manifestRegistry = loadPluginManifestRegistryForPluginRegistry({
					config: params.cfg,
					workspaceDir: params.cwd,
					env: pluginMetadataEnv
				});
				const inspector = resolveProviderPolicySurface(providerParams.provider, { manifestRegistry })?.inspectEmbeddingProviderSetup;
				return inspector ? await inspector({
					...providerParams,
					env: pluginMetadataEnv
				}) : void 0;
			};
			return params.runWithPluginStateSnapshot ? await params.runWithPluginStateSnapshot(inspect) : await inspect(env);
		},
		memoryCoreActive: isMemoryCoreActive(params.cfg)
	});
}
function registerCodexHealthChecks(params, registerCheck) {
	const unavailable = (detail) => [{
		checkId: "core/doctor/codex-session-routes",
		...describePluginAvailabilityFailure("codex", detail)
	}];
	const env = params.env ?? process.env;
	if (shouldRegisterCodexManagedHealth(params.cfg)) {
		const owner = loadPluginManifestRegistryForPluginRegistry({
			config: params.cfg,
			workspaceDir: params.cwd,
			env,
			pluginIds: ["codex"]
		}).plugins.find((plugin) => plugin.id === "codex");
		if (!owner) {
			if (!collectConfiguredAgentHarnessRuntimes(params.cfg, { includeImplicitRuntimePreferences: false }).includes("codex")) return [];
			return unavailable("The configured Codex plugin was not found. Install it with openclaw plugins install @openclaw/codex.");
		}
		if (owner.origin !== "bundled" && owner.trustedOfficialInstall !== true) return unavailable("The selected Codex plugin is not a bundled or verified official installation. Run openclaw plugins inspect codex --runtime --json to inspect its source; install the official plugin with openclaw plugins install @openclaw/codex.");
		if (owner.doctorHealthChecks === true) {
			let api;
			try {
				api = loadPluginPublicArtifactModuleSync({
					pluginRoot: owner.rootDir,
					artifactBasename: "api.js",
					origin: owner.origin === "bundled" ? "bundled" : "global"
				});
			} catch {
				return unavailable("The selected Codex plugin declares Doctor health checks but its health API could not be loaded. Run openclaw plugins inspect codex --runtime --json for details, or openclaw triage for repair help.");
			}
			if (typeof api.registerCodexManagedAppServerDoctorChecks !== "function") return unavailable("The selected Codex plugin's Doctor health checks are incomplete. Run openclaw plugins inspect codex --runtime --json for details, or openclaw triage for repair help.");
			api.registerCodexManagedAppServerDoctorChecks({
				getHealthCheck,
				registerHealthCheck: registerCheck
			});
		}
	}
	return [];
}
function registerPolicyHealthChecks(params, registerCheck) {
	if (shouldRegisterPolicyHealth(params)) loadBundledPluginPublicArtifactModuleSync({
		dirName: "policy",
		artifactBasename: "api.js"
	}).registerPolicyDoctorChecks?.({ registerHealthCheck: registerCheck });
}
function registerCuaHealthChecks(params, registerCheck) {
	if (shouldRegisterPluginHealth(params.cfg, "cua-computer")) loadBundledPluginPublicArtifactModuleSync({
		dirName: "cua-computer",
		artifactBasename: "api.js"
	}).registerCuaDriverDoctorChecks?.({ registerHealthCheck: registerCheck });
}
function registerBundledWorkerProviderHealthChecks(params, registerCheck) {
	const env = params.env ?? process.env;
	const providerIds = collectConfiguredWorkerProviderIds(params.cfg);
	if (providerIds.length === 0) return;
	const manifestRegistry = loadBundledPluginManifestRegistry({ env });
	const pluginIds = new Set(listBundledWorkerProviderOwners(manifestRegistry, providerIds).map((owner) => owner.pluginId));
	for (const pluginId of pluginIds) loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		dirName: pluginId,
		artifactCandidates: ["doctor-health-api.js"]
	})?.registerWorkerProviderDoctorChecks?.({
		getHealthCheck,
		registerHealthCheck: registerCheck,
		async listPluginStateEntries(options) {
			const { createPluginStateKeyedStore } = await import("./plugin-state-store-Bm-w12Xn.mjs");
			return createPluginStateKeyedStore(pluginId, options).entries();
		}
	});
}
function shouldRegisterCodexManagedHealth(cfg) {
	if (cfg.plugins?.entries?.codex?.enabled !== true && !collectConfiguredAgentHarnessRuntimes(cfg).includes("codex")) return false;
	return passesManifestOwnerBasePolicy({
		plugin: { id: "codex" },
		normalizedConfig: normalizePluginsConfig(cfg.plugins)
	});
}
function isMemoryCoreActive(cfg) {
	const plugins = normalizePluginsConfig(cfg.plugins);
	const selectedMemoryPluginId = typeof plugins.slots.memory === "string" ? normalizePluginId(plugins.slots.memory) : plugins.slots.memory;
	const configuredMemorySlot = cfg.plugins?.slots?.memory;
	const explicitlySelected = typeof configuredMemorySlot === "string" && normalizePluginId(configuredMemorySlot) === "memory-core";
	return selectedMemoryPluginId === "memory-core" && passesManifestOwnerBasePolicy({
		plugin: { id: "memory-core" },
		normalizedConfig: plugins,
		allowRestrictiveAllowlistBypass: explicitlySelected
	});
}
function shouldRegisterPluginHealth(cfg, pluginId) {
	if ((cfg.plugins?.entries?.[pluginId])?.enabled !== true) return false;
	return passesManifestOwnerBasePolicy({
		plugin: { id: pluginId },
		normalizedConfig: normalizePluginsConfig(cfg.plugins)
	});
}
function shouldRegisterPolicyHealth(params) {
	const entry = params.cfg.plugins?.entries?.policy;
	const config = asOptionalObjectRecord(entry?.config) ?? {};
	if (entry === void 0 || entry.enabled === false || config.enabled === false) return false;
	if (!passesManifestOwnerBasePolicy({
		plugin: { id: "policy" },
		normalizedConfig: normalizePluginsConfig(params.cfg.plugins)
	})) return false;
	return entry.enabled === true || config.enabled === true;
}
//#endregion
export { registerBundledHealthChecks, resolveBundledHealthCheckPluginStateMode };
