import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as normalizeOptionalTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { a as pluginCacheRealpathSync, c as readPluginCacheFile, n as parsePluginCacheJson, r as pluginCacheExistsSync } from "./plugin-cache-files-VxWaav6j.mjs";
import { d as omitUndefinedManifestFields, f as optionalManifestFields, s as normalizeManifestChannelCommandDefaults, u as normalizeManifestObjectList } from "./manifest-gUPkNRN0.mjs";
import { n as getPackageManifestMetadata, t as DEFAULT_PLUGIN_ENTRY_CANDIDATES } from "./package-manifest-Zddwuhx3.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-LfC_CFuw.mjs";
import { _ as recordPluginCandidateInstallOwner, s as tracePluginLifecyclePhase, t as discoverConfiguredPluginLoadPaths, u as listBundledSourceOverlayDirs } from "./discovery-B5pUUvVG.mjs";
import { r as resolveInstalledPluginIndexInstallOwner, t as isInstalledPluginIndexInstallOwnerAmbiguous } from "./installed-plugin-index-install-owner-CQJv99I6.mjs";
import { n as hashStableJson, t as hashJson } from "./installed-plugin-index-hash-N3AVaUCF.mjs";
import { _ as getInstalledPluginIndexFacts, p as extractPluginInstallRecordsFromInstalledPluginIndex, y as resolveInstalledPluginIndexPolicyHash } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { r as resolveChannelSetupFieldCliAttributeName } from "./setup-contract-DgLM9zTf.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DiVSy6jb.mjs";
import { t as resolvePluginCacheInputs } from "./roots-MVdSmrth.mjs";
import { i as normalizePluginDependencySpecs } from "./status-dependencies-core-CUcepTmO.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-BqtrPPLI.mjs";
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
		plugins: index.plugins.map(({ doctorContractFile: _doctorContractFile, sourceAdmissions: _sourceAdmissions, packageBuild, ...plugin }) => ({
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
	return optionalManifestFields({
		specifier: normalizeOptionalString(configuredState.specifier),
		exportName: normalizeOptionalString(configuredState.exportName),
		env: isRecord(configuredState.env) ? optionalManifestFields({
			allOf: normalizeOptionalTrimmedStringList(configuredState.env.allOf),
			anyOf: normalizeOptionalTrimmedStringList(configuredState.env.anyOf)
		}) : void 0
	});
}
function normalizePackageChannelPersistedAuthState(persistedAuthState) {
	if (!isRecord(persistedAuthState)) return;
	const specifier = normalizeOptionalString(persistedAuthState.specifier);
	const exportName = normalizeOptionalString(persistedAuthState.exportName);
	const exportNameAsync = normalizeOptionalString(persistedAuthState.exportNameAsync);
	return specifier || exportName || exportNameAsync ? omitUndefinedManifestFields({
		specifier,
		exportName,
		exportNameAsync,
		backingStore: persistedAuthState.backingStore === "plugin-state" ? "plugin-state" : void 0
	}) : void 0;
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
	return normalizeManifestObjectList(cliAddOptions, (option) => {
		const flags = normalizeOptionalString(option.flags);
		const description = normalizeOptionalString(option.description);
		if (!flags || !description) return;
		const valueType = option.valueType === "int" || option.valueType === "list" ? option.valueType : void 0;
		return omitUndefinedManifestFields({
			flags,
			description,
			defaultValue: typeof option.defaultValue === "boolean" || typeof option.defaultValue === "string" ? option.defaultValue : void 0,
			valueType
		});
	});
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
	return recordPluginCandidateInstallOwner(omitUndefinedManifestFields({
		idHint: record.pluginId,
		effectivePluginId: record.pluginId,
		source: record.source ?? resolveFallbackPluginSource(record),
		setupSource: record.setupSource || void 0,
		rootDir,
		origin: record.origin,
		format: record.format || void 0,
		bundleFormat: record.bundleFormat || void 0,
		packageName: record.packageName || void 0,
		packageVersion: record.packageVersion || void 0,
		packageDescription: packageMetadata.packageDescription || void 0,
		packageManifest: packageMetadata.packageManifest || void 0,
		packageDependencies: packageMetadata.packageDependencies || void 0,
		packageOptionalDependencies: packageMetadata.packageOptionalDependencies || void 0,
		packageDir: rootDir
	}), resolveInstalledPluginIndexInstallOwner(record), isInstalledPluginIndexInstallOwnerAmbiguous(record));
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
function resolvePluginDiscoveryContext(params = {}) {
	const paths = params.config?.plugins?.load?.paths;
	return resolvePluginCacheInputs({
		env: params.env ?? process.env,
		workspaceDir: params.workspaceDir,
		loadPaths: params.loadPaths ?? (Array.isArray(paths) ? paths : void 0)
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
