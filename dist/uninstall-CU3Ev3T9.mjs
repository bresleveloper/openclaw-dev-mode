import { r as resolveRealpathOrAbsolute } from "./boundary-path-CAv_plX7.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { o as resolveNpmCommand } from "./npm-install-env-CROOzau_.mjs";
import { n as defaultSlotIdForKey } from "./slots-DarSawuQ.mjs";
import { c as resolvePluginInstallDir, n as isPluginNpmManagedPath, o as resolveDefaultPluginGitDir, p as resolvePluginNpmProjectsDir, r as isPluginNpmProjectDir, s as resolveDefaultPluginNpmDir } from "./install-paths-R7__5hE9.mjs";
import { s as relinkOpenClawPeerDependenciesInManagedNpmRoot } from "./plugin-peer-link-B8_Vs9lb.mjs";
import { t as pathMayExistSync } from "./path-existence-O1bMV6vh.mjs";
import { s as createSafeNpmInstallEnv } from "./install-package-dir-BIZrRqZG.mjs";
import { d as isNpmAliasOverrideCompatibilityError, o as syncManagedNpmRootPeerDependencies, r as readOpenClawManagedNpmRootOverrides } from "./npm-managed-root-GptrecB0.mjs";
import { a as removePluginInstallOwnerFromConfig, i as mergePluginConfigUninstallActions, o as removePluginRuntimePolicyFromConfig, r as isUninstallPathInsideOrEqual } from "./uninstall-config-DN1ft0Eq.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { root } from "@openclaw/fs-safe/root";
//#region src/plugins/uninstall-package-plan.ts
const PLUGIN_PACKAGE_UNINSTALL_PLAN = Symbol.for("openclaw.pluginPackageUninstallPlan");
function recordPluginPackageUninstallPlan(params, metadata) {
	Object.defineProperty(params, PLUGIN_PACKAGE_UNINSTALL_PLAN, {
		configurable: false,
		enumerable: true,
		value: metadata
	});
	return params;
}
function resolvePluginPackageUninstallPlan(params) {
	return params[PLUGIN_PACKAGE_UNINSTALL_PLAN];
}
function prepareConfigForDisabledPluginSet(config, pluginIds, plannedUninstall) {
	const entries = { ...config.plugins?.entries };
	for (const entryId of new Set(pluginIds)) entries[entryId] = {
		...entries[entryId],
		enabled: false
	};
	const plugins = {
		...config.plugins,
		entries
	};
	if (plannedUninstall) {
		if (plannedUninstall.plugins?.load) plugins.load = plannedUninstall.plugins.load;
		else delete plugins.load;
	}
	return {
		...config,
		plugins
	};
}
//#endregion
//#region src/plugins/uninstall-managed-npm.ts
const MANAGED_NPM_PEER_CLEANUP_ARGS = [
	"install",
	"--omit=dev",
	"--omit=peer",
	"--loglevel=error",
	"--legacy-peer-deps",
	"--ignore-scripts",
	"--no-audit",
	"--no-fund"
];
async function pruneManagedNpmPeerDependenciesAfterUninstall(params) {
	const command = (...args) => {
		params.beforePersistentApply?.();
		return (params.runCommand ?? runCommandWithTimeout)(...args);
	};
	const commandOptions = {
		cwd: params.npmRoot,
		timeoutMs: 3e5,
		env: createSafeNpmInstallEnv(process.env, {
			legacyPeerDeps: true,
			npmConfigCwd: params.npmRoot,
			packageLock: true,
			quiet: true
		})
	};
	let omitNpmAliasOverrides = false;
	const syncPeerDependencies = async () => await syncManagedNpmRootPeerDependencies({
		npmRoot: params.npmRoot,
		managedOverrides: params.managedOverrides,
		omitNpmAliasOverrides,
		runCommand: command,
		beforePersistentApply: params.beforePersistentApply
	});
	if (!await syncPeerDependencies()) return;
	let cleanup = await command(resolveNpmCommand(MANAGED_NPM_PEER_CLEANUP_ARGS), commandOptions);
	if (cleanup.code !== 0 && isNpmAliasOverrideCompatibilityError(cleanup)) {
		omitNpmAliasOverrides = true;
		await syncPeerDependencies();
		cleanup = await command(resolveNpmCommand(MANAGED_NPM_PEER_CLEANUP_ARGS), commandOptions);
	}
	if (cleanup.code === 0) return;
	return `Failed to prune managed peer dependencies after uninstalling ${params.packageName}: ${cleanup.stderr.trim() || cleanup.stdout.trim() || `npm exited with code ${cleanup.code}`}`;
}
//#endregion
//#region src/plugins/uninstall.ts
const UNINSTALL_ACTION_LABELS = {
	entry: "plugin settings",
	install: "install record",
	allowlist: "allowlist entry",
	denylist: "denylist entry",
	loadPath: "load path",
	memorySlot: "memory slot",
	contextEngineSlot: "context engine slot",
	channelConfig: "channel config",
	directory: "directory"
};
function formatUninstallActionLabels(actions, preview) {
	return Object.keys(UNINSTALL_ACTION_LABELS).flatMap((key) => {
		if (!actions[key]) return [];
		if (preview) {
			if (key === "memorySlot" || key === "contextEngineSlot") {
				const slot = key === "memorySlot" ? "memory" : "contextEngine";
				return [`${UNINSTALL_ACTION_LABELS[key]} (will reset to "${defaultSlotIdForKey(slot)}")`];
			}
			if (key === "channelConfig") return preview.channelConfigKeys.map((id) => `${UNINSTALL_ACTION_LABELS.channelConfig} (channels.${id})`);
		}
		return [UNINSTALL_ACTION_LABELS[key]];
	});
}
function hasUninstallAction(actions) {
	return Object.values(actions).some(Boolean);
}
function resolveUninstallDirectoryRemoval(params) {
	if (!params.hasInstall || isLinkedPathInstallRecord(params.installRecord)) return null;
	const npmManagedInstall = resolveNpmManagedInstall({
		installRecord: params.installRecord,
		extensionsDir: params.extensionsDir
	});
	if (npmManagedInstall) {
		const { installPath, ...cleanup } = npmManagedInstall;
		return {
			target: installPath,
			cleanup: {
				kind: "npm",
				...cleanup
			}
		};
	}
	const gitManagedInstall = resolveGitManagedInstall({
		installRecord: params.installRecord,
		extensionsDir: params.extensionsDir
	});
	if (gitManagedInstall) return {
		target: gitManagedInstall.installPath,
		cleanup: {
			kind: "git",
			parentDir: gitManagedInstall.parentDir
		}
	};
	let defaultPath;
	try {
		defaultPath = resolvePluginInstallDir(params.pluginId, params.extensionsDir);
	} catch {
		return null;
	}
	const configuredPath = params.installRecord?.installPath;
	if (!configuredPath) return { target: defaultPath };
	if (path.resolve(configuredPath) === path.resolve(defaultPath)) return { target: configuredPath };
	if (params.extensionsDir && isUninstallPathInsideOrEqual(params.extensionsDir, configuredPath)) return { target: configuredPath };
	const recordedManagedPath = resolveRecordedManagedInstallPath({
		pluginId: params.pluginId,
		installPath: configuredPath
	});
	if (recordedManagedPath) return { target: recordedManagedPath };
	return { target: defaultPath };
}
function resolveNpmManagedInstall(params) {
	const installPath = params.installRecord?.installPath?.trim();
	if (params.installRecord?.source !== "npm" || !installPath) return null;
	const npmRoots = /* @__PURE__ */ new Set();
	if (params.extensionsDir) npmRoots.add(path.join(path.dirname(path.resolve(params.extensionsDir)), "npm"));
	npmRoots.add(resolveDefaultPluginNpmDir());
	for (const npmRoot of npmRoots) {
		const nodeModulesRoot = path.join(npmRoot, "node_modules");
		if (isUninstallPathInsideOrEqual(nodeModulesRoot, installPath) && resolveRealpathOrAbsolute(nodeModulesRoot) !== resolveRealpathOrAbsolute(installPath)) {
			const packageName = resolveNpmPackageNameFromInstallPath({
				installPath,
				nodeModulesRoot
			});
			return packageName ? {
				installPath,
				npmRoot,
				packageName,
				rootKind: "legacy-shared"
			} : null;
		}
		const projectMatch = resolveNpmManagedProjectInstall({
			installPath,
			projectsDir: resolvePluginNpmProjectsDir(npmRoot)
		});
		if (projectMatch) return projectMatch;
	}
	return null;
}
function resolveNpmManagedProjectInstall(params) {
	if (!isUninstallPathInsideOrEqual(params.projectsDir, params.installPath) || resolveRealpathOrAbsolute(params.projectsDir) === resolveRealpathOrAbsolute(params.installPath)) return null;
	const segments = path.relative(path.resolve(params.projectsDir), path.resolve(params.installPath)).split(path.sep).filter(Boolean);
	if (segments.length < 3 || segments[1] !== "node_modules") return null;
	const npmRoot = path.join(params.projectsDir, segments[0] ?? "");
	const npmDir = path.dirname(params.projectsDir);
	if (!isUninstallPathInsideOrEqual(npmDir, params.installPath)) return null;
	const nodeModulesRoot = path.join(npmRoot, "node_modules");
	const packageName = resolveNpmPackageNameFromInstallPath({
		installPath: params.installPath,
		nodeModulesRoot
	});
	if (!packageName || resolveRealpathOrAbsolute(params.installPath) !== resolveRealpathOrAbsolute(path.join(nodeModulesRoot, ...packageName.split("/")))) return null;
	return {
		installPath: isPluginNpmProjectDir({
			packageName,
			projectDir: npmRoot,
			npmDir
		}) ? npmRoot : params.installPath,
		npmRoot,
		packageName,
		rootKind: "isolated-project"
	};
}
function resolveNpmPackageNameFromInstallPath(params) {
	const relativePath = path.relative(path.resolve(params.nodeModulesRoot), path.resolve(params.installPath));
	if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) return null;
	const segments = relativePath.split(path.sep).filter(Boolean);
	if (segments.length < 1) return null;
	if (segments[0]?.startsWith("@")) return segments.length >= 2 ? `${segments[0]}/${segments[1]}` : null;
	return segments[0] ?? null;
}
function resolveGitManagedInstall(params) {
	const installPath = params.installRecord?.installPath?.trim();
	if (params.installRecord?.source !== "git" || !installPath) return null;
	const gitRoots = /* @__PURE__ */ new Set();
	if (params.extensionsDir) gitRoots.add(path.join(path.dirname(path.resolve(params.extensionsDir)), "git"));
	gitRoots.add(resolveDefaultPluginGitDir());
	for (const gitRoot of gitRoots) if (isUninstallPathInsideOrEqual(gitRoot, installPath) && resolveRealpathOrAbsolute(gitRoot) !== resolveRealpathOrAbsolute(installPath)) return {
		installPath,
		parentDir: path.dirname(installPath)
	};
	return null;
}
function resolveRecordedManagedInstallPath(params) {
	const resolvedInstallPath = path.resolve(params.installPath);
	const recordedExtensionsDir = path.dirname(resolvedInstallPath);
	if (path.basename(recordedExtensionsDir) !== "extensions") return null;
	try {
		return path.resolve(resolvePluginInstallDir(params.pluginId, recordedExtensionsDir)) === resolvedInstallPath ? params.installPath : null;
	} catch {
		return null;
	}
}
function isLinkedPathInstallRecord(installRecord) {
	if (installRecord?.source !== "path") return false;
	if (!installRecord.sourcePath || !installRecord.installPath) return true;
	return resolveRealpathOrAbsolute(installRecord.sourcePath) === resolveRealpathOrAbsolute(installRecord.installPath);
}
/**
* Plan a plugin uninstall by removing it from config and resolving a safe file-removal target.
* Linked path plugins never have their source directory deleted. Copied path installs still remove
* their managed install directory.
*/
function planPluginUninstall(params) {
	const { config, pluginId, channelIds, deleteFiles = true, extensionsDir } = params;
	const packagePlan = resolvePluginPackageUninstallPlan(params);
	const runtimePluginIds = packagePlan?.runtimePluginIds ?? [pluginId];
	const entries = config.plugins?.entries ?? {};
	const installs = config.plugins?.installs ?? {};
	const hasEntry = runtimePluginIds.some((entryId) => Object.hasOwn(entries, entryId));
	const hasInstall = Object.hasOwn(installs, pluginId);
	const installRecord = hasInstall ? installs[pluginId] : void 0;
	let newConfig = config;
	let configActions = mergePluginConfigUninstallActions();
	for (const configPluginId of new Set(runtimePluginIds)) {
		const removal = removePluginRuntimePolicyFromConfig(newConfig, configPluginId, {
			channelIds,
			loadPaths: packagePlan?.runtimeLoadPaths ? [...packagePlan.runtimeLoadPaths] : void 0
		});
		newConfig = removal.config;
		configActions = mergePluginConfigUninstallActions(configActions, removal.actions);
	}
	const ownerRemoval = removePluginInstallOwnerFromConfig(newConfig, pluginId);
	newConfig = ownerRemoval.config;
	configActions = mergePluginConfigUninstallActions(configActions, ownerRemoval.actions);
	if (hasInstall && runtimePluginIds.length > 0) newConfig = prepareConfigForDisabledPluginSet(newConfig, runtimePluginIds);
	if (!hasEntry && !hasInstall && !hasUninstallAction(configActions)) return {
		ok: false,
		error: `Plugin not found: ${pluginId}`
	};
	const actions = {
		...configActions,
		directory: false
	};
	return {
		ok: true,
		config: newConfig,
		pluginId,
		actions,
		directoryRemoval: deleteFiles ? resolveUninstallDirectoryRemoval({
			pluginId,
			hasInstall,
			installRecord,
			extensionsDir
		}) : null
	};
}
function pluginUninstallTargetExists(target) {
	return pathMayExistSync(target);
}
function isOwnedNpmRemoval(removal) {
	const cleanup = removal.cleanup;
	if (cleanup?.kind !== "npm") return true;
	const projectsDir = path.dirname(cleanup.npmRoot);
	const projectRoot = cleanup.rootKind === "isolated-project";
	if (projectRoot !== (path.basename(projectsDir) === "projects")) return false;
	const npmDir = projectRoot ? path.dirname(projectsDir) : cleanup.npmRoot;
	if (projectRoot ? !isPluginNpmManagedPath({
		managedPath: cleanup.npmRoot,
		npmDir
	}) : !pluginUninstallTargetExists(npmDir) || !isPluginNpmManagedPath({
		managedPath: npmDir,
		npmDir
	})) return false;
	const manifestPath = path.join(cleanup.npmRoot, "package.json");
	if (pluginUninstallTargetExists(manifestPath) && !isPluginNpmManagedPath({
		managedPath: manifestPath,
		npmDir
	})) return false;
	if (path.resolve(removal.target) === path.resolve(cleanup.npmRoot)) return projectRoot && isPluginNpmProjectDir({
		npmDir,
		packageName: cleanup.packageName,
		projectDir: cleanup.npmRoot
	});
	const expectedPackageDir = path.join(cleanup.npmRoot, "node_modules", ...cleanup.packageName.split("/"));
	if (path.resolve(removal.target) !== path.resolve(expectedPackageDir)) return false;
	return !pluginUninstallTargetExists(removal.target) || isPluginNpmManagedPath({
		managedPath: removal.target,
		npmDir
	});
}
async function applyPluginUninstallDirectoryRemoval(removal, beforePersistentApply) {
	if (!removal) return {
		directoryRemoved: false,
		warnings: []
	};
	const existed = pluginUninstallTargetExists(removal.target);
	const warnings = [];
	let rethrowAuthorityFailure;
	const assertPersistentApply = () => {
		try {
			beforePersistentApply?.();
		} catch (error) {
			rethrowAuthorityFailure = () => {
				throw error;
			};
			throw error;
		}
	};
	const warn = (message, error) => {
		rethrowAuthorityFailure?.();
		warnings.push(`${message}: ${formatErrorMessage(error)}`);
	};
	if (!existed && removal.cleanup?.kind !== "npm") return {
		directoryRemoved: false,
		warnings
	};
	const usesLegacySharedNpmRoot = removal.cleanup?.kind === "npm" && removal.cleanup.rootKind === "legacy-shared";
	const npmCleanupManifestPath = removal.cleanup?.kind === "npm" ? path.join(removal.cleanup.npmRoot, "package.json") : "";
	const npmCleanupManifestExists = removal.cleanup?.kind === "npm" ? await fs.access(npmCleanupManifestPath).then(() => true).catch(() => false) : false;
	if (!existed && removal.cleanup?.kind === "npm" && !npmCleanupManifestExists) return {
		directoryRemoved: false,
		warnings
	};
	const ownershipWarning = `Refused to remove npm path without canonical package ownership: ${removal.target}`;
	if (!isOwnedNpmRemoval(removal)) return {
		directoryRemoved: false,
		warnings: [ownershipWarning]
	};
	if (removal.cleanup?.kind === "npm" && npmCleanupManifestExists && usesLegacySharedNpmRoot) {
		assertPersistentApply();
		const uninstall = await runCommandWithTimeout(resolveNpmCommand([
			"uninstall",
			"--loglevel=error",
			"--legacy-peer-deps",
			"--ignore-scripts",
			"--no-audit",
			"--no-fund",
			removal.cleanup.packageName
		]), {
			cwd: removal.cleanup.npmRoot,
			timeoutMs: 3e5,
			env: createSafeNpmInstallEnv(process.env, {
				legacyPeerDeps: true,
				npmConfigCwd: removal.cleanup.npmRoot,
				packageLock: true,
				quiet: true
			})
		});
		if (uninstall.code !== 0) warnings.push(`Failed to prune npm dependencies for plugin package ${removal.cleanup.packageName}: ${uninstall.stderr.trim() || uninstall.stdout.trim() || `npm exited with code ${uninstall.code}`}`);
		try {
			const managedOverrides = await readOpenClawManagedNpmRootOverrides();
			const warning = await pruneManagedNpmPeerDependenciesAfterUninstall({
				npmRoot: removal.cleanup.npmRoot,
				packageName: removal.cleanup.packageName,
				managedOverrides,
				beforePersistentApply: assertPersistentApply
			});
			if (warning) warnings.push(warning);
		} catch (error) {
			warn(`Failed to sync managed peer dependencies after uninstalling ${removal.cleanup.packageName}`, error);
		}
		try {
			await relinkOpenClawPeerDependenciesInManagedNpmRoot({
				npmRoot: removal.cleanup.npmRoot,
				logger: { warn: (message) => warnings.push(message) },
				beforePersistentApply: assertPersistentApply
			});
		} catch (error) {
			warn(`Failed to repair managed npm peer links after uninstalling ${removal.cleanup.packageName}`, error);
		}
	}
	if (!isOwnedNpmRemoval(removal) && pluginUninstallTargetExists(removal.target)) return {
		directoryRemoved: false,
		warnings: [...warnings, ownershipWarning]
	};
	assertPersistentApply();
	try {
		const target = path.resolve(removal.target);
		await (await root(path.dirname(target))).remove(`.${path.sep}${path.basename(target)}`, {
			recursive: true,
			force: true,
			maxEntries: Infinity,
			maxDepth: Infinity,
			assertBeforeMutation: assertPersistentApply
		});
	} catch (error) {
		rethrowAuthorityFailure?.();
		if (!isMissingPathError(error)) return {
			directoryRemoved: false,
			warnings: [...warnings, `Failed to remove plugin directory ${removal.target}: ${formatErrorMessage(error)}`]
		};
	}
	if (removal.cleanup?.kind === "git") {
		assertPersistentApply();
		try {
			await fs.rmdir(removal.cleanup.parentDir);
		} catch (error) {
			const code = error.code;
			if (code !== "ENOENT" && code !== "ENOTEMPTY") warn(`Failed to remove empty git plugin install parent ${removal.cleanup.parentDir}`, error);
		}
	}
	return {
		directoryRemoved: existed,
		warnings
	};
}
//#endregion
export { prepareConfigForDisabledPluginSet as a, pluginUninstallTargetExists as i, formatUninstallActionLabels as n, recordPluginPackageUninstallPlan as o, planPluginUninstall as r, applyPluginUninstallDirectoryRemoval as t };
