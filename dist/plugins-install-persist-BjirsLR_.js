import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { i as isPathInside } from "./path-BlG8lhgR.js";
import { a as tracePluginLifecyclePhaseAsync } from "./discovery-DM5vTQts.js";
import { _ as shortenHomePath, m as resolveUserPath } from "./utils-BApvfmPs.js";
import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-DvZKmwhP.js";
import "./path-guards-CBe_wA_B.js";
import { t as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-CZE4dDG4.js";
import { n as recordPluginInstallInRecords, o as withoutPluginInstallRecords } from "./installed-plugin-index-records-BiW0BXs2.js";
import { a as readConfigIncludeFileWithGuards, i as hashConfigIncludeRaw, o as resolveConfigIncludeWritePath } from "./includes-BO60JzJZ.js";
import { n as enablePluginInConfig } from "./enable-BS06nvHE.js";
import { r as replaceConfigFile } from "./config-A41fTHlt.js";
import { n as applyPluginUninstallDirectoryRemoval, o as planPluginUninstall } from "./uninstall-DYQ2_3dZ.js";
import { s as buildPluginSnapshotReport } from "./status-qK7bZwFD.js";
import { i as enableInternalHookEntries, o as logHookPackRestartHint, s as logSlotWarnings, t as applySlotSelectionForPlugin } from "./plugins-command-helpers-B4rQf4Sa.js";
import { r as commitPluginInstallRecordsWithConfig } from "./plugins-install-record-commit-DJW-YbgH.js";
import { n as refreshPluginRegistryAfterConfigMutation } from "./plugins-registry-refresh-DEGFVt_D.js";
import fs from "node:fs";
import path from "node:path";
//#region src/hooks/installs.ts
/** Return config with one hook install record merged into hooks.internal.installs. */
function recordHookInstall(cfg, update) {
	const { hookId, ...record } = update;
	const installs = {
		...cfg.hooks?.internal?.installs,
		[hookId]: {
			...cfg.hooks?.internal?.installs?.[hookId],
			...record,
			installedAt: record.installedAt ?? (/* @__PURE__ */ new Date()).toISOString()
		}
	};
	return {
		...cfg,
		hooks: {
			...cfg.hooks,
			internal: {
				...cfg.hooks?.internal,
				installs: {
					...installs,
					[hookId]: installs[hookId]
				}
			}
		}
	};
}
//#endregion
//#region src/cli/plugins-install-persist.ts
function addInstalledPluginToAllowlist(cfg, pluginId) {
	const allow = cfg.plugins?.allow;
	if (!Array.isArray(allow) || allow.length === 0 || allow.includes(pluginId)) return cfg;
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			allow: [...allow, pluginId]
		}
	};
}
function removeInstalledPluginFromDenylist(cfg, pluginId) {
	const deny = cfg.plugins?.deny;
	if (!Array.isArray(deny) || !deny.includes(pluginId)) return cfg;
	const nextDeny = deny.filter((id) => id !== pluginId);
	const plugins = {
		...cfg.plugins,
		...nextDeny.length > 0 ? { deny: nextDeny } : {}
	};
	if (nextDeny.length === 0) delete plugins.deny;
	return {
		...cfg,
		plugins
	};
}
const CONFIG_MUTATION_ALLOWED = { mode: "allowed" };
function containsConfigIncludeDirective(value) {
	if (Array.isArray(value)) return value.some((entry) => containsConfigIncludeDirective(entry));
	if (!isRecord(value)) return false;
	return Object.hasOwn(value, "$include") || Object.values(value).some((entry) => containsConfigIncludeDirective(entry));
}
function supportsInstallConfigSingleTopLevelIncludeShape(authoredSection) {
	if (!containsConfigIncludeDirective(authoredSection)) return true;
	return isRecord(authoredSection) && Object.keys(authoredSection).length === 1 && typeof authoredSection.$include === "string";
}
function resolveSingleTopLevelIncludePath(parsed, configPath, section) {
	const authoredSection = parsed[section];
	if (!isRecord(authoredSection) || Object.keys(authoredSection).length !== 1 || typeof authoredSection.$include !== "string") return null;
	return path.normalize(path.isAbsolute(authoredSection.$include) ? authoredSection.$include : path.resolve(path.dirname(configPath), authoredSection.$include));
}
function resolveConfigMutationPreflight(params) {
	if (Object.hasOwn(params.parsed, "$include")) return {
		mode: "blocked",
		scope: "config",
		reason: `Config ${params.section} are stored through an unsupported $include shape at the root; edit the included file directly or move ${params.section} into the root config before installing.`
	};
	if (!supportsInstallConfigSingleTopLevelIncludeShape(params.parsed[params.section])) return {
		mode: "blocked",
		scope: params.section,
		reason: `Config ${params.section} are stored through an unsupported $include shape; edit the included file directly or move ${params.section} to a single-file top-level include before installing.`
	};
	const includePath = resolveSingleTopLevelIncludePath(params.parsed, params.snapshotPath, params.section);
	if (!includePath) return CONFIG_MUTATION_ALLOWED;
	const expectedTarget = params.writeOptions.includeFileTargetsForWrite?.[includePath];
	let resolvedTarget = null;
	try {
		resolvedTarget = resolveConfigIncludeWritePath({
			configPath: params.snapshotPath,
			includePath,
			allowedRoots: []
		});
	} catch {}
	if (expectedTarget && resolvedTarget && path.normalize(expectedTarget) === path.normalize(resolvedTarget)) {
		const expectedHash = params.writeOptions.includeFileHashesForWrite?.[includePath];
		try {
			const raw = readConfigIncludeFileWithGuards({
				includePath,
				resolvedPath: resolvedTarget,
				rootRealDir: fs.realpathSync(path.dirname(params.snapshotPath))
			});
			if (expectedHash !== hashConfigIncludeRaw(raw)) return {
				mode: "blocked",
				scope: params.section,
				reason: `Config ${params.section} include changed since the config was read; rerun the install after reloading the config.`
			};
			if (containsConfigIncludeDirective(parseJsonWithJson5Fallback(raw))) return {
				mode: "blocked",
				scope: params.section,
				reason: `Config ${params.section} are stored through a nested $include; edit the included file directly or remove the nested $include before installing.`
			};
			return CONFIG_MUTATION_ALLOWED;
		} catch {
			return {
				mode: "blocked",
				scope: params.section,
				reason: `Config ${params.section} include could not be inspected at its snapshot target; rerun the install after repairing or reloading the config.`
			};
		}
	}
	return {
		mode: "blocked",
		scope: params.section,
		reason: `Config ${params.section} are stored in an external or unresolved top-level $include; edit the included file directly or move it under the config directory before installing.`
	};
}
function resolveInstallConfigMutationPreflights(params) {
	const pluginMutation = resolveConfigMutationPreflight({
		...params,
		section: "plugins"
	});
	const hookMutation = resolveConfigMutationPreflight({
		...params,
		section: "hooks"
	});
	const pluginIncludePath = resolveSingleTopLevelIncludePath(params.parsed, params.snapshotPath, "plugins");
	const hookIncludePath = resolveSingleTopLevelIncludePath(params.parsed, params.snapshotPath, "hooks");
	const pluginTarget = pluginIncludePath ? params.writeOptions.includeFileTargetsForWrite?.[pluginIncludePath] : void 0;
	const hookTarget = hookIncludePath ? params.writeOptions.includeFileTargetsForWrite?.[hookIncludePath] : void 0;
	if (pluginTarget && hookTarget && path.normalize(pluginTarget) === path.normalize(hookTarget)) {
		const blocked = {
			mode: "blocked",
			scope: "config",
			reason: "Config plugins and hooks share the same top-level $include target; split them into separate include files before installing."
		};
		return {
			hookMutation: blocked,
			pluginMutation: blocked
		};
	}
	return {
		hookMutation,
		pluginMutation
	};
}
function resolveCombinedPluginAndHookConfigMutationPreflight(params) {
	const pluginIncludePath = resolveSingleTopLevelIncludePath(params.parsed, params.snapshotPath, "plugins");
	const hookIncludePath = resolveSingleTopLevelIncludePath(params.parsed, params.snapshotPath, "hooks");
	if (!pluginIncludePath && !hookIncludePath) return CONFIG_MUTATION_ALLOWED;
	return {
		mode: "blocked",
		scope: "config",
		reason: "Config plugins and hooks cannot be updated together while either section uses a top-level $include; update them separately."
	};
}
function selectInstallMutationWriteOptions(writeOptions) {
	return {
		...writeOptions.assertConfigPathForWrite ? { assertConfigPathForWrite: writeOptions.assertConfigPathForWrite } : {},
		expectedConfigPath: writeOptions.expectedConfigPath,
		ownedConfigPathForWrite: writeOptions.ownedConfigPathForWrite,
		envSnapshotForRestore: writeOptions.envSnapshotForRestore,
		includeFileHashesForWrite: writeOptions.includeFileHashesForWrite,
		includeFileTargetsForWrite: writeOptions.includeFileTargetsForWrite
	};
}
function sourceMatchesInstalledPath(params) {
	const activeSource = resolveUserPath(params.activeSource, params.env);
	const installedSource = resolveUserPath(params.installedSource, params.env);
	return activeSource === installedSource || isPathInside(installedSource, activeSource);
}
function logShadowedNpmInstallWarning(params) {
	if (params.install.source !== "npm") return;
	const installedSource = params.install.installPath ?? params.install.sourcePath;
	if (!installedSource) return;
	const active = buildPluginSnapshotReport({
		config: params.config,
		effectiveOnly: true,
		onlyPluginIds: [params.pluginId]
	}).plugins.find((plugin) => plugin.id === params.pluginId);
	if (!active || active.origin !== "config" || sourceMatchesInstalledPath({
		activeSource: active.source,
		installedSource
	})) return;
	params.runtime.log(theme.warn([
		`Warning: installed plugin "${params.pluginId}" is not the active source because a config-selected plugin with the same id is currently selected:`,
		`  active config source: ${shortenHomePath(active.source)}`,
		`  installed npm source: ${shortenHomePath(installedSource)}`,
		"Run `openclaw plugins doctor` for repair options."
	].join("\n")));
}
function resolveComparableInstallPath(install) {
	return install.installPath ?? install.sourcePath;
}
function shouldPreserveReplacedInstallPath(params) {
	const removalTarget = resolveUserPath(params.removalTarget);
	const nextInstallPath = resolveUserPath(params.nextInstallPath);
	return isPathInside(removalTarget, nextInstallPath) || isPathInside(nextInstallPath, removalTarget);
}
function resolveReplacedManagedInstallRemoval(params) {
	if (!params.previousInstall) return null;
	const previousInstallPath = resolveComparableInstallPath(params.previousInstall);
	const nextInstallPath = resolveComparableInstallPath(params.nextInstall);
	if (!previousInstallPath || !nextInstallPath) return null;
	if (params.previousInstall.source === "npm" && params.nextInstall.source === "npm") return null;
	if (shouldPreserveReplacedInstallPath({
		removalTarget: previousInstallPath,
		nextInstallPath
	})) return null;
	const plan = planPluginUninstall({
		config: { plugins: { installs: { [params.pluginId]: params.previousInstall } } },
		pluginId: params.pluginId,
		deleteFiles: true
	});
	if (!plan.ok || !plan.directoryRemoval) return null;
	if (shouldPreserveReplacedInstallPath({
		removalTarget: plan.directoryRemoval.target,
		nextInstallPath
	})) return null;
	return plan.directoryRemoval;
}
async function persistPluginInstall(params) {
	const runtime = params.runtime ?? defaultRuntime;
	const installConfig = params.enable === false ? params.snapshot.config : removeInstalledPluginFromDenylist(addInstalledPluginToAllowlist(params.snapshot.config, params.pluginId), params.pluginId);
	let next = params.enable === false ? installConfig : enablePluginInConfig(installConfig, params.pluginId, { updateChannelConfig: false }).config;
	const installRecords = await tracePluginLifecyclePhaseAsync("install records load", () => loadInstalledPluginIndexInstallRecords(), { command: "install" });
	const previousInstall = installRecords[params.pluginId];
	const replacedInstallRemoval = resolveReplacedManagedInstallRemoval({
		pluginId: params.pluginId,
		previousInstall,
		nextInstall: params.install
	});
	const nextInstallRecords = recordPluginInstallInRecords(installRecords, {
		pluginId: params.pluginId,
		...params.install
	});
	const slotResult = params.enable === false ? {
		config: next,
		warnings: []
	} : await tracePluginLifecyclePhaseAsync("slot selection", async () => applySlotSelectionForPlugin(next, params.pluginId), {
		command: "install",
		pluginId: params.pluginId
	});
	next = withoutPluginInstallRecords(slotResult.config);
	await tracePluginLifecyclePhaseAsync("config mutation", () => commitPluginInstallRecordsWithConfig({
		previousInstallRecords: installRecords,
		nextInstallRecords,
		nextConfig: next,
		baseHash: params.snapshot.baseHash,
		writeOptions: {
			...params.snapshot.writeOptions,
			afterWrite: {
				mode: "restart",
				reason: "plugin source changed"
			}
		}
	}), { command: "install" });
	if (replacedInstallRemoval) {
		const removalResult = await tracePluginLifecyclePhaseAsync("replaced install cleanup", () => applyPluginUninstallDirectoryRemoval(replacedInstallRemoval), {
			command: "install",
			pluginId: params.pluginId
		});
		for (const warning of removalResult.warnings) runtime.log(theme.warn(warning));
		if (removalResult.directoryRemoved) runtime.log(theme.muted(`Removed previous plugin install directory: ${shortenHomePath(replacedInstallRemoval.target)}`));
	}
	await refreshPluginRegistryAfterConfigMutation({
		config: next,
		reason: "source-changed",
		installRecords: nextInstallRecords,
		invalidateRuntimeCache: params.invalidateRuntimeCache,
		traceCommand: "install",
		logger: { warn: (message) => runtime.log(theme.warn(message)) }
	});
	logSlotWarnings(slotResult.warnings, runtime);
	if (params.warningMessage) runtime.log(theme.warn(params.warningMessage));
	runtime.log(params.successMessage ?? `Installed plugin: ${params.pluginId}`);
	logShadowedNpmInstallWarning({
		config: next,
		pluginId: params.pluginId,
		install: params.install,
		runtime
	});
	runtime.log("Restart the gateway to load plugins.");
	return next;
}
async function persistHookPackInstall(params) {
	const runtime = params.runtime ?? defaultRuntime;
	let next = enableInternalHookEntries(params.snapshot.config, params.hooks);
	next = recordHookInstall(next, {
		hookId: params.hookPackId,
		hooks: params.hooks,
		...params.install
	});
	await replaceConfigFile({
		nextConfig: next,
		baseHash: params.snapshot.baseHash,
		writeOptions: params.snapshot.writeOptions
	});
	runtime.log(params.successMessage ?? `Installed hook pack: ${params.hookPackId}`);
	logHookPackRestartHint(runtime);
	return next;
}
//#endregion
export { resolveInstallConfigMutationPreflights as a, recordHookInstall as c, resolveCombinedPluginAndHookConfigMutationPreflight as i, persistHookPackInstall as n, selectInstallMutationWriteOptions as o, persistPluginInstall as r, supportsInstallConfigSingleTopLevelIncludeShape as s, containsConfigIncludeDirective as t };
