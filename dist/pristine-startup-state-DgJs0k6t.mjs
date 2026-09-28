import { c as isRecord, l as isStringRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as resolveEffectiveHomeDir } from "./home-dir-D0b-ywue.mjs";
import { E as resolveStateDir, p as resolveConfigPath, w as resolveLegacyStateDirs } from "./paths-DehQwyE0.mjs";
import { t as discoverConfiguredPluginLoadPaths } from "./discovery-D_5mAUI7.mjs";
import { m as tryReadJsonSync } from "./json-files-C0HSMh2Z.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-CEG7WMVu.mjs";
import { i as inspectPluginStartupMetadata, r as inspectBundledPluginStartupMetadata, t as configMayRequireStartupPluginConvergence } from "./startup-plugin-convergence-plan-BsmrDCLu.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor/shared/pristine-startup-state.ts
const STATEFUL_CONFIG_KEYS = /* @__PURE__ */ new Set([
	"accessGroups",
	"acp",
	"approvals",
	"audio",
	"bindings",
	"broadcast",
	"channels",
	"cloudWorkers",
	"commitments",
	"cron",
	"env",
	"marketplaces",
	"mcp",
	"media",
	"memory",
	"messages",
	"nodeHost",
	"proxy",
	"secrets",
	"session",
	"surfaces",
	"talk",
	"tools",
	"transcripts",
	"web"
]);
function hasOnlyMigrationSafeDiscovery(config) {
	const discovery = config.discovery;
	if (discovery === void 0) return true;
	if (!isRecord(discovery) || Object.keys(discovery).some((key) => key !== "mdns")) return false;
	const mdns = discovery.mdns;
	return mdns === void 0 || isRecord(mdns) && Object.keys(mdns).every((key) => key === "mode") && (mdns.mode === void 0 || mdns.mode === "off" || mdns.mode === "minimal" || mdns.mode === "full");
}
function hasOnlyMigrationSafeInternalHooks(config) {
	const hooks = config.hooks;
	if (hooks === void 0) return true;
	if (!isRecord(hooks) || Object.keys(hooks).some((key) => key !== "internal")) return false;
	const internal = hooks.internal;
	if (internal === void 0) return true;
	if (!isRecord(internal) || Object.keys(internal).some((key) => !["enabled", "entries"].includes(key)) || internal.enabled !== void 0 && typeof internal.enabled !== "boolean") return false;
	if (internal.entries === void 0) return true;
	if (!isRecord(internal.entries)) return false;
	return Object.values(internal.entries).every((entry) => {
		if (!isRecord(entry)) return false;
		if (entry.enabled !== void 0 && typeof entry.enabled !== "boolean") return false;
		if (entry.env === void 0) return true;
		return isStringRecord(entry.env);
	});
}
function containsObjectKey(value, targetKey) {
	if (Array.isArray(value)) return value.some((entry) => containsObjectKey(entry, targetKey));
	if (!isRecord(value)) return false;
	return Object.hasOwn(value, targetKey) || Object.values(value).some((entry) => containsObjectKey(entry, targetKey));
}
function hasOnlyMigrationSafePluginEntries(config, env) {
	const plugins = config.plugins;
	if (!isRecord(plugins)) return plugins === void 0;
	if (Object.keys(plugins).some((key) => ![
		"enabled",
		"entries",
		"allow",
		"deny",
		"load"
	].includes(key))) return false;
	if (plugins.load !== void 0) {
		if (!isRecord(plugins.load) || Object.keys(plugins.load).some((key) => key !== "paths") || !Array.isArray(plugins.load.paths) || !plugins.load.paths.every((entry) => typeof entry === "string" && entry.trim().length > 0)) return false;
		if (plugins.load.paths.length > 0) {
			const discovery = discoverConfiguredPluginLoadPaths({
				loadPaths: plugins.load.paths,
				env
			});
			if (discovery.candidates.length === 0) return false;
			const registry = loadPluginManifestRegistryCore({
				config,
				discovery,
				env,
				installRecords: {}
			});
			if (registry.diagnostics.length > 0 || registry.plugins.length !== discovery.candidates.length) return false;
			for (const plugin of registry.plugins) {
				const metadata = inspectPluginStartupMetadata({
					pluginId: plugin.id,
					rootDir: plugin.rootDir
				});
				if (!metadata || metadata.hasDoctorContract) return false;
			}
		}
	}
	if (!isRecord(plugins.entries)) return plugins.entries === void 0;
	return Object.entries(plugins.entries).every(([pluginId, entry]) => {
		if (!isRecord(entry)) return false;
		if (entry.enabled === false) return true;
		if (entry.config !== void 0) return false;
		const metadata = inspectBundledPluginStartupMetadata({
			pluginId,
			env
		});
		return Boolean(metadata && !metadata.hasDoctorContract);
	});
}
function configIsPristineCoreStateSafe(config) {
	if ([...STATEFUL_CONFIG_KEYS].some((key) => Object.hasOwn(config, key))) return false;
	if (!hasOnlyMigrationSafeDiscovery(config) || !hasOnlyMigrationSafeInternalHooks(config)) return false;
	if (containsObjectKey(config.agents, "memorySearch")) return false;
	return true;
}
/** Revalidates the authored config after startup recovery without rereading physical state. */
function planPristineStartupConfigMigrations(config, env = process.env) {
	if (!isRecord(config) || containsObjectKey(config, "$include")) return {
		skipAllStateMigrations: false,
		skipCoreStateMigrations: false
	};
	const skipCoreStateMigrations = configIsPristineCoreStateSafe(config);
	return {
		skipAllStateMigrations: skipCoreStateMigrations && hasOnlyMigrationSafePluginEntries(config, env) && !configMayRequireStartupPluginConvergence({
			config,
			env
		}),
		skipCoreStateMigrations
	};
}
function stateDirHasOnlyConfig(stateDir, configPath) {
	let entries;
	try {
		entries = fs.readdirSync(stateDir, { withFileTypes: true });
	} catch (error) {
		return error.code === "ENOENT";
	}
	const resolvedConfigPath = path.resolve(configPath);
	return entries.every((entry) => path.resolve(stateDir, entry.name) === resolvedConfigPath);
}
/**
* A missing/empty state root can skip core migrations; plugin config may still require work.
* Keep ambiguity on the full migration path; this shortcut only accepts a proven new install.
*/
function planPristineStartupStateMigrations(env = process.env) {
	const stateDir = resolveStateDir(env);
	const configPath = resolveConfigPath(env, stateDir);
	if (!stateDirHasOnlyConfig(stateDir, configPath)) return {
		skipAllStateMigrations: false,
		skipCoreStateMigrations: false
	};
	const homeDir = resolveEffectiveHomeDir(env);
	if (!homeDir) return {
		skipAllStateMigrations: false,
		skipCoreStateMigrations: false
	};
	const explicitStateDir = env.OPENCLAW_STATE_DIR?.trim();
	if (!(Boolean(explicitStateDir) || resolveLegacyStateDirs(() => homeDir).every((legacyDir) => {
		if (path.resolve(legacyDir) === path.resolve(stateDir)) return false;
		return !fs.existsSync(legacyDir);
	}))) return {
		skipAllStateMigrations: false,
		skipCoreStateMigrations: false
	};
	return planPristineStartupConfigMigrations(fs.existsSync(configPath) ? tryReadJsonSync(configPath) : {}, env);
}
//#endregion
export { planPristineStartupConfigMigrations, planPristineStartupStateMigrations };
