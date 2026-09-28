import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { s as normalizeOptionalTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { f as readPluginCacheFile, l as pluginCacheRealpathSync, o as parsePluginCacheJson, r as getPackageManifestMetadata, s as pluginCacheExistsSync, t as DEFAULT_PLUGIN_ENTRY_CANDIDATES } from "./package-manifest-C8sTeZKW.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-BGJkK8G5.mjs";
import { _ as resolveInstalledPluginIndexPolicyHash, d as extractPluginInstallRecordsFromInstalledPluginIndex, h as getInstalledPluginIndexFacts } from "./installed-plugin-index-D0kh4WcK.mjs";
import { F as hashStableJson, O as listBundledSourceOverlayDirs, P as hashJson, T as recordPluginCandidateInstallOwner, o as tracePluginLifecyclePhase, t as discoverConfiguredPluginLoadPaths } from "./discovery-D_5mAUI7.mjs";
import { r as resolveChannelSetupFieldCliAttributeName } from "./setup-contract-6y0bhIm8.mjs";
import { a as normalizeManifestChannelCommandDefaults } from "./manifest-DHkEL08H.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DhqUNG6g.mjs";
import { t as resolvePluginCacheInputs } from "./roots-DtYz58sU.mjs";
import { i as normalizePluginDependencySpecs } from "./status-dependencies-core-CNMnZyKQ.mjs";
import { r as resolveInstalledPluginIndexInstallOwner, t as isInstalledPluginIndexInstallOwnerAmbiguous } from "./installed-plugin-index-install-owner-Bd-Byre8.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-CEG7WMVu.mjs";
import path from "node:path";
//#region src/plugins/manifest-registry-installed.ts
/** Builds manifest registry records from installed plugin index snapshots. */
function resolveInstalledManifestRegistryIndexFingerprint(index) {
	const facts = getInstalledPluginIndexFacts(index);
	const cached = facts?.fingerprint;
	if (cached) return cached;
	const fingerprint = hashStableJson({
		version: index.version,
		hostContractVersion: index.hostContractVersion,
		compatRegistryVersion: index.compatRegistryVersion,
		migrationVersion: index.migrationVersion,
		policyHash: index.policyHash,
		installRecords: index.installRecords,
		diagnostics: index.diagnostics,
		plugins: index.plugins.map(({ doctorContractFile: _doctorContractFile, packageBuild, ...plugin }) => ({
			...plugin,
			...packageBuild?.bundledDist === void 0 ? {} : { packageBuild: { bundledDist: packageBuild.bundledDist } }
		}))
	});
	if (facts) facts.fingerprint = fingerprint;
	return fingerprint;
}
function resolveInstalledPluginRootDir(record) {
	return record.rootDir || path.dirname(record.manifestPath || process.cwd());
}
function resolveFallbackPluginSource(record) {
	const rootDir = resolveInstalledPluginRootDir(record);
	for (const entry of DEFAULT_PLUGIN_ENTRY_CANDIDATES) {
		const candidate = path.join(rootDir, entry);
		if (pluginCacheExistsSync(candidate)) return candidate;
	}
	return path.join(rootDir, DEFAULT_PLUGIN_ENTRY_CANDIDATES[0]);
}
function normalizePackageChannelExposure(exposure) {
	if (!isRecord(exposure)) return;
	const normalized = {};
	for (const key of [
		"configured",
		"setup",
		"docs"
	]) if (typeof exposure[key] === "boolean") normalized[key] = exposure[key];
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizePackageChannelConfiguredState(configuredState) {
	if (!isRecord(configuredState)) return;
	const rawEnv = isRecord(configuredState.env) ? configuredState.env : void 0;
	const allOf = rawEnv ? normalizeOptionalTrimmedStringList(rawEnv.allOf) : void 0;
	const anyOf = rawEnv ? normalizeOptionalTrimmedStringList(rawEnv.anyOf) : void 0;
	const env = allOf || anyOf ? {
		...allOf ? { allOf } : {},
		...anyOf ? { anyOf } : {}
	} : void 0;
	const specifier = normalizeOptionalString(configuredState.specifier);
	const exportName = normalizeOptionalString(configuredState.exportName);
	return specifier || exportName || env ? {
		...specifier ? { specifier } : {},
		...exportName ? { exportName } : {},
		...env ? { env } : {}
	} : void 0;
}
function normalizePackageChannelPersistedAuthState(persistedAuthState) {
	if (!isRecord(persistedAuthState)) return;
	const specifier = normalizeOptionalString(persistedAuthState.specifier);
	const exportName = normalizeOptionalString(persistedAuthState.exportName);
	return specifier || exportName ? {
		...specifier ? { specifier } : {},
		...exportName ? { exportName } : {},
		...persistedAuthState.backingStore === "plugin-state" ? { backingStore: "plugin-state" } : {}
	} : void 0;
}
function normalizePackageChannelDoctorCapabilities(doctorCapabilities) {
	if (!isRecord(doctorCapabilities)) return;
	const normalized = {};
	const { dmAllowFromMode, groupModel } = doctorCapabilities;
	if (dmAllowFromMode === "topOnly" || dmAllowFromMode === "topOrNested" || dmAllowFromMode === "nestedOnly") normalized.dmAllowFromMode = dmAllowFromMode;
	if (groupModel === "sender" || groupModel === "route" || groupModel === "hybrid") normalized.groupModel = groupModel;
	for (const key of [
		"openDmRequiresAllowFromWildcard",
		"groupAllowFromFallbackToAllowFrom",
		"warnOnEmptyGroupSenderAllowlist"
	]) if (typeof doctorCapabilities[key] === "boolean") normalized[key] = doctorCapabilities[key];
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizePackageChannelCliOptions(cliAddOptions) {
	if (!Array.isArray(cliAddOptions)) return;
	const normalized = cliAddOptions.flatMap((option) => {
		if (!isRecord(option)) return [];
		const flags = normalizeOptionalString(option.flags);
		const description = normalizeOptionalString(option.description);
		if (!flags || !description) return [];
		const defaultValue = typeof option.defaultValue === "boolean" || typeof option.defaultValue === "string" ? option.defaultValue : void 0;
		const valueType = option.valueType === "int" || option.valueType === "list" ? option.valueType : void 0;
		return [{
			flags,
			description,
			...defaultValue !== void 0 ? { defaultValue } : {},
			...valueType ? { valueType } : {}
		}];
	});
	return normalized.length > 0 ? normalized : void 0;
}
function normalizePackageChannelSetup(setup) {
	if (!isRecord(setup) || !Array.isArray(setup.fields)) return;
	const fields = [];
	for (const value of setup.fields) {
		if (!isRecord(value) || !isRecord(value.cli)) continue;
		const key = normalizeOptionalString(value.key);
		const kind = normalizeOptionalString(value.kind);
		const flags = normalizeOptionalString(value.cli.flags);
		const negatedFlags = normalizeOptionalString(value.cli.negatedFlags);
		const description = normalizeOptionalString(value.cli.description);
		if (!key || !flags || !description || !kind || kind !== "string" && kind !== "boolean" && kind !== "integer" && kind !== "string-list" && kind !== "choice") continue;
		try {
			if (resolveChannelSetupFieldCliAttributeName(flags) !== key || negatedFlags && resolveChannelSetupFieldCliAttributeName(negatedFlags) !== key) continue;
		} catch {
			continue;
		}
		const defaultValue = typeof value.cli.defaultValue === "boolean" || typeof value.cli.defaultValue === "string" ? value.cli.defaultValue : void 0;
		const cli = {
			flags,
			...negatedFlags ? { negatedFlags } : {},
			description,
			...defaultValue !== void 0 ? { defaultValue } : {}
		};
		if (kind === "choice") {
			const choices = normalizeOptionalTrimmedStringList(value.choices);
			if (!choices?.length) continue;
			fields.push({
				key,
				kind,
				choices,
				cli
			});
			continue;
		}
		if (kind === "string" || kind === "string-list") {
			fields.push({
				key,
				kind,
				...value.sensitive === true ? { sensitive: true } : {},
				cli
			});
			continue;
		}
		if (kind === "boolean") {
			const envVars = normalizeOptionalTrimmedStringList(value.envVars);
			const envVarMode = value.envVarMode === "any" || value.envVarMode === "all" ? value.envVarMode : void 0;
			fields.push({
				key,
				kind,
				...envVars?.length ? { envVars } : {},
				...envVars?.length && envVarMode ? { envVarMode } : {},
				cli
			});
			continue;
		}
		fields.push({
			key,
			kind,
			cli
		});
	}
	return { fields };
}
const PACKAGE_CHANNEL_NORMALIZERS = [
	["exposure", normalizePackageChannelExposure],
	["commands", normalizeManifestChannelCommandDefaults],
	["configuredState", normalizePackageChannelConfiguredState],
	["persistedAuthState", normalizePackageChannelPersistedAuthState],
	["doctorCapabilities", normalizePackageChannelDoctorCapabilities],
	["setup", normalizePackageChannelSetup],
	["cliAddOptions", normalizePackageChannelCliOptions]
];
function normalizePersistedPackageChannel(value) {
	if (!isRecord(value)) return;
	const id = normalizeOptionalString(value.id);
	if (!id) return;
	const channel = { id };
	for (const key of [
		"label",
		"selectionLabel",
		"detailLabel",
		"docsPath",
		"docsLabel",
		"blurb",
		"systemImage"
	]) {
		const normalized = normalizeOptionalString(value[key]);
		if (normalized) channel[key] = normalized;
	}
	const selectionDocsPrefix = readStringValue(value.selectionDocsPrefix);
	if (selectionDocsPrefix !== void 0) channel.selectionDocsPrefix = selectionDocsPrefix;
	if (typeof value.order === "number" && Number.isFinite(value.order)) channel.order = value.order;
	for (const key of [
		"aliases",
		"preferOver",
		"selectionExtras"
	]) {
		const normalized = normalizeOptionalTrimmedStringList(value[key]);
		if (normalized?.length) channel[key] = normalized;
	}
	if (Array.isArray(value.approvalFlags) && value.approvalFlags.includes("native")) channel.approvalFlags = ["native"];
	for (const key of [
		"selectionDocsOmitLabel",
		"markdownCapable",
		"quickstartAllowFrom",
		"forceAccountBinding",
		"preferSessionLookupForAnnounceTarget"
	]) if (typeof value[key] === "boolean") channel[key] = value[key];
	for (const [key, normalize] of PACKAGE_CHANNEL_NORMALIZERS) {
		const normalized = normalize(value[key]);
		if (normalized) Object.assign(channel, { [key]: normalized });
	}
	return channel;
}
function normalizePreparedManifestRecord(record) {
	if (!record.packageManifest?.channel && !record.packageChannel) return record;
	const packageChannel = normalizePersistedPackageChannel(record.packageManifest?.channel ?? record.packageChannel);
	const { channel: _ignoredChannel, ...packageManifest } = record.packageManifest ?? {};
	return {
		...record,
		packageChannel,
		...record.packageManifest ? { packageManifest: {
			...packageManifest,
			...packageChannel ? { channel: packageChannel } : {}
		} } : {},
		...!packageChannel && record.channelCatalogMeta ? { channelCatalogMeta: void 0 } : {}
	};
}
function resolveInstalledPackageMetadata(record, env) {
	const recordPackageChannel = normalizePersistedPackageChannel(record.packageChannel);
	const fallbackPackageManifest = recordPackageChannel ? { channel: recordPackageChannel } : void 0;
	const fallback = {
		packageDependencies: {},
		packageOptionalDependencies: {},
		...fallbackPackageManifest ? { packageManifest: fallbackPackageManifest } : {}
	};
	if (!record.packageJson?.path) return fallback;
	const rootDir = resolveInstalledPluginRootDir(record);
	const file = readPluginCacheFile({
		rootDir,
		relativePath: record.packageJson.path,
		rejectHardlinks: shouldRejectHardlinkedPluginFiles({
			origin: record.origin,
			rootDir,
			env
		})
	});
	const parsed = file.ok ? parsePluginCacheJson(file) : void 0;
	if (!parsed?.ok || !isRecord(parsed.value)) return fallback;
	const packageJson = parsed.value;
	const packageDescription = normalizeOptionalString(packageJson.description);
	const packageManifest = getPackageManifestMetadata(packageJson);
	const dependencies = normalizePluginDependencySpecs({
		dependencies: packageJson.dependencies,
		optionalDependencies: packageJson.optionalDependencies
	});
	if (!packageManifest) return {
		...fallback,
		packageDescription,
		packageDependencies: dependencies.dependencies,
		packageOptionalDependencies: dependencies.optionalDependencies
	};
	const packageChannel = normalizePersistedPackageChannel(packageManifest.channel);
	const channel = recordPackageChannel || packageChannel ? {
		...recordPackageChannel,
		...packageChannel
	} : void 0;
	const { channel: _ignoredChannel, ...packageManifestWithoutChannel } = packageManifest;
	return {
		packageDescription,
		packageManifest: {
			...packageManifestWithoutChannel,
			...channel ? { channel } : {}
		},
		packageDependencies: dependencies.dependencies,
		packageOptionalDependencies: dependencies.optionalDependencies
	};
}
function toPluginCandidate(record, env) {
	const rootDir = resolveInstalledPluginRootDir(record);
	const packageMetadata = resolveInstalledPackageMetadata(record, env);
	return recordPluginCandidateInstallOwner({
		idHint: record.pluginId,
		effectivePluginId: record.pluginId,
		source: record.source ?? resolveFallbackPluginSource(record),
		...record.setupSource ? { setupSource: record.setupSource } : {},
		rootDir,
		origin: record.origin,
		...record.format ? { format: record.format } : {},
		...record.bundleFormat ? { bundleFormat: record.bundleFormat } : {},
		...record.packageName ? { packageName: record.packageName } : {},
		...record.packageVersion ? { packageVersion: record.packageVersion } : {},
		...packageMetadata.packageDescription ? { packageDescription: packageMetadata.packageDescription } : {},
		...packageMetadata.packageManifest ? { packageManifest: packageMetadata.packageManifest } : {},
		...packageMetadata.packageDependencies ? { packageDependencies: packageMetadata.packageDependencies } : {},
		...packageMetadata.packageOptionalDependencies ? { packageOptionalDependencies: packageMetadata.packageOptionalDependencies } : {},
		packageDir: rootDir
	}, resolveInstalledPluginIndexInstallOwner(record), isInstalledPluginIndexInstallOwnerAmbiguous(record));
}
/** Selects installed owners without projecting unrelated manifest fields. */
function selectInstalledPluginManifestRecords(index, registry, pluginIds, includeDisabled) {
	const enabledPluginIds = new Set(index.plugins.filter((plugin) => includeDisabled || plugin.enabled).map((plugin) => plugin.pluginId));
	return registry.plugins.filter((plugin) => enabledPluginIds.has(plugin.id) && (!pluginIds || pluginIds.has(plugin.id)));
}
/** Prepares transient candidates without loading a registry or Doctor artifact bytes. */
function prepareInstalledPluginCandidateResolver(params) {
	const env = params.env ?? process.env;
	const sourceRoots = new Set(listBundledSourceOverlayDirs({
		bundledRoot: resolveBundledPluginsDir(env),
		env
	}).map((root) => pluginCacheRealpathSync(root) ?? root));
	const loadPaths = params.config?.plugins?.load?.paths ?? [];
	const configuredSources = new Set(loadPaths.length > 0 ? discoverConfiguredPluginLoadPaths({
		loadPaths,
		env,
		workspaceDir: params.workspaceDir
	}).candidates.map((candidate) => pluginCacheRealpathSync(candidate.source) ?? candidate.source) : []);
	return (plugin) => {
		const candidate = toPluginCandidate(plugin, env);
		if (candidate.origin === "global" && (resolveInstalledPluginIndexInstallOwner(plugin) || isInstalledPluginIndexInstallOwnerAmbiguous(plugin))) candidate.workspaceDir = normalizeOptionalString(params.workspaceDir);
		if (candidate.origin === "bundled" && (sourceRoots.size > 0 && sourceRoots.has(pluginCacheRealpathSync(candidate.rootDir) ?? candidate.rootDir) || configuredSources.size > 0 && configuredSources.has(pluginCacheRealpathSync(candidate.source) ?? candidate.source))) candidate.sourcePreferred = true;
		return candidate;
	};
}
function loadPluginManifestRegistryForInstalledIndex(params) {
	return tracePluginLifecyclePhase("manifest registry", () => {
		if (params.pluginIds && params.pluginIds.length === 0) return {
			plugins: [],
			diagnostics: []
		};
		const env = params.env ?? process.env;
		const pluginIdSet = params.pluginIds?.length ? new Set(params.pluginIds) : null;
		const diagnostics = pluginIdSet ? params.index.diagnostics.filter((diagnostic) => {
			const pluginId = diagnostic.pluginId;
			return !pluginId || pluginIdSet.has(pluginId);
		}) : params.index.diagnostics;
		if (params.manifestRegistry && !params.bundledChannelConfigCollector) return {
			plugins: selectInstalledPluginManifestRecords(params.index, params.manifestRegistry, pluginIdSet, params.includeDisabled).map(normalizePreparedManifestRecord),
			diagnostics: [...diagnostics]
		};
		const resolveCandidate = prepareInstalledPluginCandidateResolver({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env
		});
		const candidates = params.index.plugins.filter((plugin) => params.includeDisabled || plugin.enabled).filter((plugin) => !pluginIdSet || pluginIdSet.has(plugin.pluginId)).map(resolveCandidate);
		return loadPluginManifestRegistryCore({
			registryPath: params.registryPath,
			config: params.config,
			workspaceDir: params.workspaceDir,
			env,
			candidates,
			diagnostics: [...diagnostics],
			installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(params.index),
			...params.bundledChannelConfigCollector ? { bundledChannelConfigCollector: params.bundledChannelConfigCollector } : {}
		});
	}, {
		includeDisabled: params.includeDisabled === true,
		pluginIdCount: params.pluginIds?.length,
		indexPluginCount: params.index.plugins.length
	});
}
//#endregion
//#region src/plugins/plugin-control-plane-context.ts
function resolveConfiguredPluginLoadPaths(config) {
	const paths = config?.plugins?.load?.paths;
	return Array.isArray(paths) ? paths : void 0;
}
/** Resolves plugin discovery roots and load paths for cache/fingerprint callers. */
function resolvePluginDiscoveryContext(params = {}) {
	return resolvePluginCacheInputs({
		env: params.env ?? process.env,
		workspaceDir: params.workspaceDir,
		loadPaths: params.loadPaths ?? resolveConfiguredPluginLoadPaths(params.config)
	});
}
/** Resolves a stable fingerprint for plugin control-plane activation state. */
function resolvePluginControlPlaneFingerprint(params = {}) {
	const inventoryFingerprint = params.inventoryFingerprint ?? (params.index ? resolveInstalledManifestRegistryIndexFingerprint(params.index) : void 0);
	return hashJson({
		discovery: resolvePluginDiscoveryContext(params),
		policyFingerprint: params.policyHash ?? resolveInstalledPluginIndexPolicyHash(params.config, params.env),
		...inventoryFingerprint ? { inventoryFingerprint } : {},
		...params.activationFingerprint ? { activationFingerprint: params.activationFingerprint } : {}
	});
}
//#endregion
export { resolveInstalledManifestRegistryIndexFingerprint as a, prepareInstalledPluginCandidateResolver as i, resolvePluginDiscoveryContext as n, selectInstalledPluginManifestRecords as o, loadPluginManifestRegistryForInstalledIndex as r, resolvePluginControlPlaneFingerprint as t };
