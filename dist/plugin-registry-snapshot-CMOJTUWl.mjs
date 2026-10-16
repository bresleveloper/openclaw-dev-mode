import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { u as tryReadJsonSync } from "./json-files-C5mNTScg.mjs";
import { a as loadInstalledPluginIndexWithDiscovery, c as hasMissingConfigPathActivationMetadata, d as hasOptionalMissingPluginManifestFile, n as hasInstalledPluginIndexWorkspaceScopeMismatch, p as extractPluginInstallRecordsFromInstalledPluginIndex, s as diffInstalledPluginIndexInvalidationReasons, y as resolveInstalledPluginIndexPolicyHash } from "./installed-plugin-index-Zl-RSskC.mjs";
import { a as safeRealpathSync, n as isPathInside } from "./path-safety-6KJ2Rbnw.mjs";
import { r as getPackageManifestMetadata } from "./package-manifest-CEbdS_C4.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-DkyLPnyV.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { i as safeHashFile, r as safeFileSignature } from "./installed-plugin-index-hash-N3AVaUCF.mjs";
import { a as groupPluginRecords, j as buildLegacyBundledRootPath, k as listBundledSourceOverlayDirs, t as discoverConfiguredPluginLoadPaths } from "./discovery-Dma3bVNk.mjs";
import "./manifest-BXjFCp0F.mjs";
import { i as resolveOpenClawDevSourceRoot, n as isBundledPluginInsideDevSourceRoot } from "./dev-source-root-T6MQRtRo.mjs";
import { n as resolvePluginSourceRoots } from "./roots-B9wyzNNR.mjs";
import { t as resolvePluginDoctorContractArtifact } from "./doctor-contract-artifact-xZyiClKv.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-U3x0s0Ho.mjs";
import { i as prepareInstalledPluginCandidateResolver } from "./plugin-control-plane-context-DPS9EUx6.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { n as resolvePluginControlPlaneWorkspace, t as appendPluginControlPlaneWorkspaceDiagnostic } from "./control-plane-workspace-BSuk9I48.mjs";
import { t as preservePluginSourceAdmissions } from "./installed-plugin-index-source-admissions-BEyyngFY.mjs";
import { r as readPersistedInstalledPluginIndexSync } from "./installed-plugin-index-store-Dcdr8x8f.mjs";
import { n as hasMissingInstalledPluginOwnerMetadata } from "./installed-plugin-package-ownership-EjDH4q5b.mjs";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/plugins/plugin-registry-comparison.ts
function isContainedPluginPath(rootPath, targetPath, cache) {
	const resolveProjectedPath = (inputPath) => {
		const target = path.resolve(inputPath);
		for (let cursor = target;; cursor = path.dirname(cursor)) try {
			fs.lstatSync(cursor);
			const realCursor = safeRealpathSync(cursor, cache);
			return realCursor ? path.resolve(realCursor, path.relative(cursor, target)) : null;
		} catch {
			if (cursor === path.dirname(cursor)) return null;
		}
	};
	const root = resolveProjectedPath(rootPath);
	const target = resolveProjectedPath(targetPath);
	return Boolean(root && target && isPathInside(root, target));
}
function resolvePluginRegistryRecordContent(plugin, comparePackageJsonPath) {
	const { doctorContractFile: _doctorContractFile, manifestFile: _manifestFile, sourceAdmissions: _sourceAdmissions, packageBuild, packageJson, ...record } = plugin;
	const stableRecord = Object.assign(record, packageBuild?.bundledDist === void 0 ? {} : { packageBuild: { bundledDist: packageBuild.bundledDist } });
	if (!packageJson || !comparePackageJsonPath) return stableRecord;
	const { fileSignature: _fileSignature, ...stablePackageJson } = packageJson;
	return Object.assign(stableRecord, { packageJson: stablePackageJson });
}
function resolvePluginRegistryContent(index, comparePackageJsonPath, excludedPlugins) {
	const { generatedAtMs: _generatedAtMs, refreshReason: _refreshReason, warning: _warning, ...content } = index;
	const excludedRoots = [...excludedPlugins?.values() ?? []].map((root) => path.resolve(root));
	const exclusionPathCache = /* @__PURE__ */ new Map();
	return {
		...content,
		diagnostics: excludedPlugins ? content.diagnostics.filter((diagnostic) => !(diagnostic.pluginId && excludedPlugins.has(diagnostic.pluginId) || diagnostic.source && excludedRoots.some((root) => isContainedPluginPath(root, diagnostic.source, exclusionPathCache)))) : content.diagnostics,
		installRecords: excludedPlugins ? Object.fromEntries(Object.entries(content.installRecords).filter(([pluginId]) => !excludedPlugins.has(pluginId))) : content.installRecords,
		plugins: content.plugins.filter((plugin) => !excludedPlugins?.has(plugin.pluginId)).map((plugin) => resolvePluginRegistryRecordContent(plugin, comparePackageJsonPath))
	};
}
function diffPluginRegistryRecords(persisted, derived, comparePackageJsonPath, excludedPlugins) {
	const persistedPlugins = new Map(persisted.plugins.map((plugin) => [plugin.pluginId, plugin]));
	const derivedPlugins = new Map(derived.plugins.map((plugin) => [plugin.pluginId, plugin]));
	const persistedDiagnostics = groupPluginRecords(persisted.diagnostics, (entry) => entry.pluginId);
	const derivedDiagnostics = groupPluginRecords(derived.diagnostics, (entry) => entry.pluginId);
	return [.../* @__PURE__ */ new Set([
		...persistedPlugins.keys(),
		...derivedPlugins.keys(),
		...Object.keys(persisted.installRecords),
		...Object.keys(derived.installRecords),
		...[...persistedDiagnostics.keys(), ...derivedDiagnostics.keys()].filter((pluginId) => Boolean(pluginId))
	])].filter((pluginId) => !excludedPlugins.has(pluginId)).toSorted((left, right) => left.localeCompare(right)).flatMap((pluginId) => {
		const persistedPlugin = persistedPlugins.get(pluginId);
		const derivedPlugin = derivedPlugins.get(pluginId);
		const changed = [
			[
				"record",
				persistedPlugin ? resolvePluginRegistryRecordContent(persistedPlugin, comparePackageJsonPath) : void 0,
				derivedPlugin ? resolvePluginRegistryRecordContent(derivedPlugin, comparePackageJsonPath) : void 0
			],
			[
				"install",
				persisted.installRecords[pluginId],
				derived.installRecords[pluginId]
			],
			[
				"diagnostics",
				persistedDiagnostics.get(pluginId) ?? [],
				derivedDiagnostics.get(pluginId) ?? []
			]
		].filter(([, before, after]) => !isDeepStrictEqual(before, after)).map(([facet]) => facet);
		return changed.length === 0 ? [] : [{
			pluginId,
			changed,
			persistedSource: persistedPlugin?.source ?? persistedPlugin?.manifestPath ?? null,
			derivedSource: derivedPlugin?.source ?? derivedPlugin?.manifestPath ?? null
		}];
	});
}
//#endregion
//#region src/plugins/plugin-registry-snapshot.ts
function resolveControlPlaneRegistryParams(params) {
	if (!params.config) return params;
	const workspace = resolvePluginControlPlaneWorkspace({
		config: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir
	});
	const diagnostics = appendPluginControlPlaneWorkspaceDiagnostic(params.diagnostics ?? [], workspace);
	return {
		...params,
		...diagnostics.length > 0 ? { diagnostics } : {},
		...workspace.workspaceDir !== void 0 ? { workspaceDir: workspace.workspaceDir } : {}
	};
}
function canReusePluginRegistrySnapshot(params) {
	return params.index === void 0 && params.allowCurrent !== false && params.preferPersisted !== false && params.stateDir === void 0 && params.filePath === void 0 && params.pluginIndexFilePath === void 0 && params.installRecords === void 0 && params.candidates === void 0 && params.diagnostics === void 0 && params.discovery === void 0 && params.now === void 0;
}
function getCurrentPluginMetadataSnapshotForRegistry(params) {
	if (!canReusePluginRegistrySnapshot(params)) return;
	return getCurrentPluginMetadataSnapshot({
		config: params.config,
		env: params.env ?? process.env,
		...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}
	});
}
function loadCurrentPluginRegistrySnapshotResult(params) {
	const current = getCurrentPluginMetadataSnapshotForRegistry(params);
	if (!current) return;
	return {
		snapshot: current.index,
		source: current.registrySource ?? (current.registryDiagnostics.length > 0 ? "derived" : "provided"),
		diagnostics: current.registryDiagnostics,
		...current.discovery ? { discovery: current.discovery } : {},
		manifestRegistry: current.manifestRegistry
	};
}
function fileContentMatches(filePath, hash, signature, trustSignature = true) {
	const current = safeFileSignature(filePath);
	if (!current) return false;
	if (trustSignature && signature?.ctimeMs !== void 0 && current.size === signature.size && current.mtimeMs === signature.mtimeMs && current.ctimeMs === signature.ctimeMs) return true;
	return safeHashFile({
		filePath,
		diagnostics: [],
		required: false
	}) === hash;
}
function hasStaleDoctorContractFiles(index, params) {
	const resolveCandidate = prepareInstalledPluginCandidateResolver({
		config: params.config,
		env: params.env
	});
	return index.plugins.some((plugin) => {
		if (!plugin.enabled && !fs.existsSync(plugin.rootDir)) return false;
		const artifact = resolvePluginDoctorContractArtifact(resolveCandidate(plugin));
		return artifact ? !plugin.doctorContractHash || !fileContentMatches(artifact.modulePath, plugin.doctorContractHash, plugin.doctorContractFile) : plugin.doctorContractHash !== void 0 || plugin.doctorContractFile !== void 0;
	});
}
function hasStalePersistedPluginMetadataFiles(index) {
	const realpathCache = /* @__PURE__ */ new Map();
	return index.plugins.some((plugin) => {
		if (!isContainedPluginPath(plugin.rootDir, plugin.rootDir, realpathCache)) return true;
		if (!fs.existsSync(plugin.rootDir) && plugin.enabled) return true;
		for (const artifactPath of [
			plugin.source,
			plugin.setupSource,
			plugin.manifestPath
		]) if (artifactPath && !isContainedPluginPath(plugin.rootDir, artifactPath, realpathCache)) return true;
		if (plugin.enabled && ((plugin.source ? !fs.existsSync(plugin.source) : false) || (plugin.setupSource ? !fs.existsSync(plugin.setupSource) : false))) return true;
		if (!hasOptionalMissingPluginManifestFile(plugin)) {
			if (!fs.existsSync(plugin.manifestPath)) {
				if (plugin.enabled) return true;
			} else if (!fileContentMatches(plugin.manifestPath, plugin.manifestHash, plugin.manifestFile)) return true;
		}
		if (!plugin.packageJson) return false;
		const packageJsonPath = path.resolve(plugin.rootDir, plugin.packageJson.path);
		if (!isContainedPluginPath(plugin.rootDir, packageJsonPath, realpathCache)) return true;
		if (!fs.existsSync(packageJsonPath)) return plugin.enabled;
		if (!isRealPathInside(plugin.rootDir, packageJsonPath, realpathCache)) return true;
		return !fileContentMatches(packageJsonPath, plugin.packageJson.hash, plugin.packageJson.fileSignature, plugin.origin === "bundled");
	});
}
function isRealPathInside(parentPath, childPath, cache) {
	const parent = safeRealpathSync(parentPath, cache);
	const child = safeRealpathSync(childPath, cache);
	return Boolean(parent && child && isPathInside(parent, child));
}
function hasMismatchedPersistedBundledRoot(index, env) {
	const bundledRoot = resolveBundledPluginsDir(env);
	if (!bundledRoot) return false;
	const realpathCache = /* @__PURE__ */ new Map();
	const overlays = listBundledSourceOverlayDirs({
		bundledRoot,
		env
	});
	const legacyRoot = buildLegacyBundledRootPath(bundledRoot);
	const sourceCheckout = legacyRoot && fs.existsSync(path.join(path.dirname(legacyRoot), ".git")) && fs.existsSync(path.join(path.dirname(legacyRoot), "pnpm-workspace.yaml")) && fs.existsSync(path.join(path.dirname(legacyRoot), "src"));
	return index.plugins.some((plugin) => {
		if (plugin.origin !== "bundled") return false;
		if (!plugin.enabled && !fs.existsSync(plugin.rootDir)) return ![
			bundledRoot,
			...overlays,
			...legacyRoot ? [legacyRoot] : []
		].some((root) => isContainedPluginPath(root, plugin.rootDir, realpathCache));
		if (isRealPathInside(bundledRoot, plugin.rootDir, realpathCache)) {
			const sourcePluginRoot = legacyRoot && path.join(legacyRoot, path.relative(safeRealpathSync(bundledRoot, realpathCache) ?? bundledRoot, safeRealpathSync(plugin.rootDir, realpathCache) ?? plugin.rootDir));
			return Boolean(sourcePluginRoot && (overlays.some((root) => isRealPathInside(root, sourcePluginRoot, realpathCache)) || sourceCheckout && getPackageManifestMetadata(tryReadJsonSync(path.join(sourcePluginRoot, "package.json")) ?? void 0)?.build?.bundledDist === false));
		}
		return !overlays.some((root) => isRealPathInside(root, plugin.rootDir, realpathCache)) && !(plugin.packageBuild?.bundledDist === false && legacyRoot && isRealPathInside(legacyRoot, plugin.rootDir, realpathCache));
	});
}
function hasRecoveredInstallRecordsMissingFromPersistedIndex(index, params, env) {
	const installRecords = loadInstalledPluginIndexInstallRecordsSync({
		env,
		...params.stateDir ? { stateDir: params.stateDir } : {},
		...params.filePath ? { filePath: params.filePath } : params.pluginIndexFilePath ? { filePath: params.pluginIndexFilePath } : {}
	});
	return Object.keys(installRecords).some((pluginId) => !index.installRecords?.[pluginId]);
}
function requiresDerivedRegistryValidation(index, params, env, hasStalePluginFiles, hasMismatchedBundledRoot) {
	const bundledRoot = resolveBundledPluginsDir(env);
	return hasStalePluginFiles() || hasInstalledPluginIndexWorkspaceScopeMismatch(index, params.workspaceDir) || params.candidates !== void 0 || params.discovery !== void 0 || params.diagnostics !== void 0 || params.installRecords !== void 0 || resolveOpenClawDevSourceRoot(env) !== null || bundledRoot !== void 0 && isBundledPluginInsideDevSourceRoot({
		rootDir: bundledRoot,
		env
	}) || normalizePluginsConfig(params.config?.plugins).loadPaths.length > 0 || hasMissingConfigPathActivationMetadata(index) || hasMissingInstalledPluginOwnerMetadata(index, env) || index.diagnostics.some(({ pluginId, source }) => Boolean(pluginId && source && path.isAbsolute(source) && !fs.existsSync(source))) || hasMismatchedBundledRoot() || hasRecoveredInstallRecordsMissingFromPersistedIndex(index, params, env) || hasConfiguredGlobalSourcePluginMissingFromPersistedIndex(params, index, env);
}
function hasConfiguredGlobalSourcePluginMissingFromPersistedIndex(params, index, env) {
	const plugins = normalizePluginsConfig(params.config?.plugins);
	const persistedPluginIds = new Set(index.plugins.map((plugin) => plugin.pluginId));
	const missingConfiguredPluginIds = new Set([
		...Object.keys(plugins.entries),
		...plugins.allow,
		...Object.values(plugins.slots).filter((pluginId) => pluginId != null)
	].filter((pluginId) => !persistedPluginIds.has(pluginId)));
	if (missingConfiguredPluginIds.size === 0) return false;
	const globalExtensionsRoot = resolvePluginSourceRoots({
		workspaceDir: params.workspaceDir,
		env
	}).global;
	const discovery = discoverConfiguredPluginLoadPaths({
		loadPaths: [globalExtensionsRoot],
		workspaceDir: params.workspaceDir,
		env
	});
	return loadPluginManifestRegistryCore({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env,
		candidates: discovery.candidates,
		diagnostics: discovery.diagnostics,
		installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(index)
	}).plugins.some((plugin) => missingConfiguredPluginIds.has(plugin.id));
}
function loadPluginRegistrySnapshotWithMetadata(params = {}) {
	return preparePluginRegistrySnapshotReader(params)(params.workspaceDir);
}
/** A fleet shares one fresh physical inventory check while retaining workspace selection. */
function preparePluginRegistrySnapshotReader(params = {}) {
	let prepared;
	return (workspaceDir) => loadPluginRegistrySnapshotWithPreparedValidation({
		...params,
		workspaceDir
	}, () => prepared ??= preparePersistedRegistryValidation(params));
}
function preparePersistedRegistryValidation(params) {
	const env = params.env ?? process.env;
	const persistedIndex = readPersistedInstalledPluginIndexSync(params);
	let stalePluginFiles;
	let mismatchedBundledRoot;
	return {
		persistedIndex,
		hasStalePluginFiles: () => stalePluginFiles ??= persistedIndex ? hasStalePersistedPluginMetadataFiles(persistedIndex) || hasStaleDoctorContractFiles(persistedIndex, params) : false,
		hasMismatchedBundledRoot: () => mismatchedBundledRoot ??= persistedIndex ? hasMismatchedPersistedBundledRoot(persistedIndex, env) : false
	};
}
function loadPluginRegistrySnapshotWithPreparedValidation(params, readPrepared) {
	if (params.index) return {
		snapshot: params.index,
		source: "provided",
		diagnostics: []
	};
	const current = loadCurrentPluginRegistrySnapshotResult(params);
	if (current) return current;
	const env = params.env ?? process.env;
	if (!(params.preferPersisted !== false)) {
		const derived = loadInstalledPluginIndexWithDiscovery({
			...params,
			installRecords: params.installRecords ?? {}
		});
		return {
			snapshot: derived.index,
			source: "derived",
			diagnostics: [],
			discovery: derived.discovery,
			manifestRegistry: derived.manifestRegistry
		};
	}
	const diagnostics = [];
	const { persistedIndex, hasStalePluginFiles, hasMismatchedBundledRoot } = readPrepared();
	if (!persistedIndex) diagnostics.push({
		level: "info",
		code: "persisted-registry-missing",
		message: "Persisted plugin registry is missing or invalid; using derived plugin index."
	});
	else if (params.config && persistedIndex.policyHash !== resolveInstalledPluginIndexPolicyHash(params.config, params.env, { artifactPreservingReadOnly: params.artifactPreservingReadOnly })) diagnostics.push({
		level: "warn",
		code: "persisted-registry-stale-policy",
		message: "Persisted plugin registry policy does not match current config; using derived plugin index. Run `openclaw plugins registry --refresh` to update the persisted registry."
	});
	else if (!requiresDerivedRegistryValidation(persistedIndex, params, env, hasStalePluginFiles, hasMismatchedBundledRoot)) return {
		snapshot: persistedIndex,
		source: "persisted",
		diagnostics
	};
	const derived = loadInstalledPluginIndexWithDiscovery({
		...params,
		...params.filePath && !params.pluginIndexFilePath ? { pluginIndexFilePath: params.filePath } : {}
	});
	const comparePackageJsonPath = params.candidates !== void 0 || params.discovery !== void 0 || hasStalePluginFiles();
	const excludedMissingDisabledPlugins = /* @__PURE__ */ new Map();
	if (persistedIndex && params.candidates === void 0 && params.discovery === void 0 && params.installRecords === void 0 && !hasStalePluginFiles() && !hasMismatchedBundledRoot()) {
		const derivedPluginIds = new Set(derived.index.plugins.map((plugin) => plugin.pluginId));
		for (const plugin of persistedIndex.plugins) if (!plugin.enabled && !derivedPluginIds.has(plugin.pluginId)) excludedMissingDisabledPlugins.set(plugin.pluginId, plugin.rootDir);
	}
	const contentMatches = persistedIndex && diagnostics.length === 0 && isDeepStrictEqual(resolvePluginRegistryContent(persistedIndex, comparePackageJsonPath, excludedMissingDisabledPlugins), resolvePluginRegistryContent(derived.index, comparePackageJsonPath, excludedMissingDisabledPlugins));
	if (persistedIndex && contentMatches) {
		const packageMetadataMatches = comparePackageJsonPath || isDeepStrictEqual(resolvePluginRegistryContent(persistedIndex, true), resolvePluginRegistryContent(derived.index, true));
		return {
			snapshot: persistedIndex,
			source: "persisted",
			diagnostics,
			discovery: derived.discovery,
			...packageMetadataMatches ? { manifestRegistry: derived.manifestRegistry } : {}
		};
	} else if (persistedIndex && diagnostics.length === 0) {
		const differences = diffPluginRegistryRecords(persistedIndex, derived.index, comparePackageJsonPath, excludedMissingDisabledPlugins);
		diagnostics.push({
			level: "warn",
			code: "persisted-registry-stale-source",
			message: "Persisted plugin registry no longer matches current plugin discovery or metadata; using derived plugin index. Run `openclaw plugins registry --refresh` to update the persisted registry.",
			...differences.length > 0 ? { differences } : {}
		});
	}
	preservePluginSourceAdmissions(persistedIndex, derived.index);
	return {
		snapshot: derived.index,
		source: "derived",
		diagnostics,
		discovery: derived.discovery,
		manifestRegistry: derived.manifestRegistry
	};
}
function loadPluginRegistrySnapshot(params = {}) {
	return loadPluginRegistrySnapshotWithMetadata(params).snapshot;
}
async function inspectPluginRegistry(params = {}) {
	return withPluginCache(createPluginCache(), () => {
		const inspectionParams = resolveControlPlaneRegistryParams(params);
		const persisted = readPersistedInstalledPluginIndexSync(inspectionParams);
		const result = loadPluginRegistrySnapshotWithMetadata({
			...inspectionParams,
			allowCurrent: false
		});
		if (!persisted) return {
			state: "missing",
			refreshReasons: ["missing"],
			differences: [],
			persisted: null,
			current: result.snapshot
		};
		const fresh = result.source === "persisted";
		const differences = result.diagnostics.flatMap((diagnostic) => diagnostic.differences ?? []);
		const refreshReasons = fresh ? [] : [...diffInstalledPluginIndexInvalidationReasons(persisted, result.snapshot)];
		if (!fresh && refreshReasons.length === 0) refreshReasons.push(result.diagnostics.some((diagnostic) => diagnostic.code === "persisted-registry-stale-policy") ? "policy-changed" : "source-changed");
		return {
			state: fresh ? "fresh" : "stale",
			refreshReasons,
			differences,
			persisted,
			current: result.snapshot
		};
	});
}
//#endregion
export { loadPluginRegistrySnapshotWithMetadata as a, loadPluginRegistrySnapshot as i, getCurrentPluginMetadataSnapshotForRegistry as n, preparePluginRegistrySnapshotReader as o, inspectPluginRegistry as r, resolveControlPlaneRegistryParams as s, canReusePluginRegistrySnapshot as t };
