import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as getPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { l as normalizeSortedUniqueStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { n as isDeeplyFrozenPlainData } from "./immutable-data-DqJSDH8t.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-jg_14gWz.mjs";
import { n as isPathInside } from "./path-safety-n0YlfCVt.mjs";
import { a as pluginCacheRealpathSync, c as readPluginCacheFile, r as pluginCacheExistsSync } from "./plugin-cache-files-VxWaav6j.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { c as normalizePluginId, f as resolveEffectiveEnableState, p as resolveEffectivePluginActivationState, r as createPluginActivationSource, u as normalizePluginsConfig, w as hasKind } from "./config-state-DkDfCu7E.mjs";
import { g as isPluginCandidateInstallOwnerAmbiguous, n as discoverOpenClawPlugins, y as resolvePluginCandidateInstallOwner } from "./discovery-B5pUUvVG.mjs";
import { n as recordInstalledPluginIndexInstallOwner, r as resolveInstalledPluginIndexInstallOwner, t as isInstalledPluginIndexInstallOwnerAmbiguous } from "./installed-plugin-index-install-owner-CQJv99I6.mjs";
import { i as readBundledDiscoveryModeMemoized } from "./bundled-discovery-state-Bb6gGYEi.mjs";
import { t as listPluginCompatRecords } from "./registry-xrBs3971.mjs";
import { t as hashJson } from "./installed-plugin-index-hash-N3AVaUCF.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DiVSy6jb.mjs";
import { a as createPluginInstallRecordMap, d as setPluginInstallRecordMapEntry, l as parsePluginInstallRecordMap, o as getPluginInstallRecordMapEntry } from "./installed-plugin-index-row-B-2QiBMA.mjs";
import { t as resolvePluginDoctorContractArtifact } from "./doctor-contract-artifact-CkzDe3D_.mjs";
import { t as describePluginInstallSource } from "./install-source-info-DXcIzsvs.mjs";
import { i as resolvePluginManifestInstallOwner } from "./manifest-registry-build-r3_ZeucU.mjs";
import { r as resolveInstalledPluginIndexStorePath } from "./installed-plugin-index-store-path-SeqhMDBO.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-BqtrPPLI.mjs";
import path from "node:path";
//#region src/plugins/installed-plugin-index-policy.ts
/** Hashes plugin compat registry state that can affect installed index validity. */
function resolveCompatRegistryVersion() {
	return hashJson(listPluginCompatRecords().map((record) => ({
		code: record.code,
		status: record.status,
		deprecated: record.deprecated,
		warningStarts: record.warningStarts,
		removeAfter: record.removeAfter,
		removalGate: record.removalGate,
		replacement: record.replacement
	})));
}
/** Hashes config policy inputs that can change installed plugin activation. */
function resolveInstalledPluginIndexPolicyHash(config, env, behavior = {}) {
	const normalized = normalizePluginsConfig(config?.plugins);
	const channelPolicy = {};
	const channels = config?.channels;
	if (channels && typeof channels === "object" && !Array.isArray(channels)) {
		for (const [channelId, value] of Object.entries(channels)) if (value && typeof value === "object" && !Array.isArray(value)) {
			const enabled = value.enabled;
			if (typeof enabled === "boolean") channelPolicy[channelId] = enabled;
		}
	}
	return hashJson({
		plugins: {
			enabled: normalized.enabled,
			allow: normalized.allow,
			deny: normalized.deny,
			bundledDiscovery: readBundledDiscoveryModeMemoized(env, behavior) ?? null,
			slots: normalized.slots,
			entries: Object.fromEntries(Object.entries(normalized.entries).flatMap(([pluginId, entry]) => typeof entry.enabled === "boolean" ? [[pluginId, entry.enabled]] : []).toSorted(([left], [right]) => left.localeCompare(right)))
		},
		channels: Object.fromEntries(Object.entries(channelPolicy).toSorted(([left], [right]) => left.localeCompare(right)))
	});
}
//#endregion
//#region src/plugins/installed-plugin-index-facts.ts
/** Package facts share the existing generation; mutable management inputs stay uncached. */
function getInstalledPluginIndexFacts(index) {
	const entries = getPluginCache().metadata.indexFacts;
	const existing = entries.get(index);
	if (existing) return existing;
	if (!isDeeplyFrozenPlainData(index)) return;
	const facts = {};
	entries.set(index, facts);
	return facts;
}
//#endregion
//#region src/plugins/bundled-compat.ts
/** Returns config with selected bundled plugins explicitly enabled when compat rules require it. */
function withBundledPluginEnablementCompat(params) {
	if (params.pluginIds.length === 0) return params.config;
	const existingEntries = params.config?.plugins?.entries ?? {};
	const selectPlugins = params.activation !== "defaults";
	const forcePluginsEnabled = selectPlugins && params.config?.plugins?.enabled === false;
	const allow = params.config?.plugins?.allow;
	const bypassAllowlist = readBundledDiscoveryModeMemoized(params.env, { artifactPreservingReadOnly: params.artifactPreservingReadOnly }) === "compat";
	const allowSet = !bypassAllowlist && Array.isArray(allow) && allow.length > 0 ? new Set(allow.map((pluginId) => normalizePluginId(pluginId)).filter(Boolean)) : void 0;
	let hasEligiblePlugin = false;
	let changed = false;
	const nextEntries = { ...existingEntries };
	const nextAllow = bypassAllowlist && Array.isArray(allow) ? new Set(allow) : void 0;
	for (const pluginId of params.pluginIds) {
		if (allowSet && !allowSet.has(pluginId)) continue;
		hasEligiblePlugin = true;
		const beforeAllowSize = nextAllow?.size;
		nextAllow?.add(pluginId);
		if (nextAllow && nextAllow.size !== beforeAllowSize) changed = true;
		if (!selectPlugins || existingEntries[pluginId] !== void 0) continue;
		nextEntries[pluginId] = { enabled: true };
		changed = true;
	}
	if (!changed && (!forcePluginsEnabled || !hasEligiblePlugin)) return params.config;
	return {
		...params.config,
		plugins: {
			...params.config?.plugins,
			...forcePluginsEnabled ? { enabled: true } : {},
			...nextAllow ? { allow: [...nextAllow] } : {},
			...selectPlugins ? { entries: nextEntries } : {}
		}
	};
}
//#endregion
//#region src/plugins/bundled-provider-compat.ts
const BUNDLED_PROVIDER_COMPAT_CONTRACT_KEYS = [
	"speechProviders",
	"externalAuthProviders",
	"embeddingProviders",
	"mediaUnderstandingProviders",
	"transcriptSourceProviders",
	"realtimeVoiceProviders",
	"realtimeTranscriptionProviders",
	"imageGenerationProviders",
	"videoGenerationProviders",
	"musicGenerationProviders",
	"webFetchProviders",
	"webSearchProviders",
	"workerProviders",
	"storageProviders",
	"usageProviders",
	"migrationProviders"
];
const BUNDLED_PROVIDER_COMPAT_CONTRACTS = new Set(BUNDLED_PROVIDER_COMPAT_CONTRACT_KEYS);
function isBundledProviderCompatContract(contract) {
	return BUNDLED_PROVIDER_COMPAT_CONTRACTS.has(contract);
}
function isBundledProviderCompatPlugin(plugin) {
	return plugin.origin === "bundled" && ((plugin.providers?.length ?? 0) > 0 || BUNDLED_PROVIDER_COMPAT_CONTRACT_KEYS.some((contract) => (plugin.contracts?.[contract]?.length ?? 0) > 0));
}
//#endregion
//#region src/plugins/installed-plugin-index-install-records.ts
/** Normalizes durable plugin install records into installed-index metadata and back. */
/** Normalizes raw plugin install records into index-safe install record metadata. */
function normalizeInstallRecordMap(records) {
	const normalized = parsePluginInstallRecordMap(records ?? {});
	if (!normalized) throw new Error("Invalid plugin install record map");
	return normalized;
}
function restoreInstallRecordMap(records) {
	const restored = parsePluginInstallRecordMap(records ?? {});
	if (!restored) throw new Error("Invalid persisted plugin install record map");
	return restored;
}
/** Copies canonical install records out of the installed index. */
function extractPluginInstallRecordsFromInstalledPluginIndex(index) {
	const facts = index ? getInstalledPluginIndexFacts(index) : void 0;
	if (!facts) return restoreInstallRecordMap(index?.installRecords);
	const parsed = facts.installRecords ??= restoreInstallRecordMap(index?.installRecords);
	const records = createPluginInstallRecordMap();
	for (const [pluginId, record] of Object.entries(parsed)) setPluginInstallRecordMapEntry(records, pluginId, {
		...record,
		...record.clawhubTrustReasons ? { clawhubTrustReasons: [...record.clawhubTrustReasons] } : {},
		...record.acceptedSurface ? { acceptedSurface: structuredClone(record.acceptedSurface) } : {}
	});
	return records;
}
//#endregion
//#region src/plugins/installed-plugin-index-manifest.ts
/** True when the bundle format permits omitting its manifest file. */
function isOptionalPluginManifestFile(record) {
	return record.format === "bundle" && record.bundleFormat === "claude";
}
/** True when a Claude bundle record omits its optional manifest file. */
function hasOptionalMissingPluginManifestFile(record) {
	return isOptionalPluginManifestFile(record) && !pluginCacheExistsSync(record.manifestPath);
}
//#endregion
//#region src/plugins/installed-plugin-index-record-builder.ts
/** Builds installed-index records from normalized plugin manifest registry entries. */
function buildStartupInfo(record) {
	return {
		sidecar: record.activation?.onStartup === true,
		memory: hasKind(record.kind, "memory"),
		agentHarnesses: normalizeSortedUniqueStringEntries([...record.activation?.onAgentHarnesses ?? [], ...record.cliBackends ?? []]),
		configPaths: normalizeSortedUniqueStringEntries(record.activation?.onConfigPaths)
	};
}
function buildContributionInfo(record) {
	const contracts = Object.fromEntries(Object.entries(record.contracts ?? {}).map(([key, values]) => [key, normalizeSortedUniqueStringEntries(values)]));
	return {
		channels: normalizeSortedUniqueStringEntries(record.channels),
		channelConfigs: normalizeSortedUniqueStringEntries(Object.keys(record.channelConfigs ?? {})),
		providers: normalizeSortedUniqueStringEntries(record.providers),
		modelCatalogProviders: normalizeSortedUniqueStringEntries([
			...Object.keys(record.modelCatalog?.providers ?? {}),
			...Object.keys(record.modelCatalog?.aliases ?? {}),
			...(record.modelCatalog?.suppressions ?? []).map((entry) => entry.provider)
		]),
		modelSupportPrefixes: normalizeSortedUniqueStringEntries(record.modelSupport?.modelPrefixes),
		modelSupportPatterns: normalizeSortedUniqueStringEntries(record.modelSupport?.modelPatterns),
		autoEnableProviderIds: normalizeSortedUniqueStringEntries(record.autoEnableWhenConfiguredProviders),
		commandAliases: normalizeSortedUniqueStringEntries(record.commandAliases?.map((alias) => alias.name)),
		contracts
	};
}
const ACTIVATION_COMPAT_CODES = [
	["onProviders", "activation-provider-hint"],
	["onAgentHarnesses", "activation-agent-harness-hint"],
	["onChannels", "activation-channel-hint"],
	["onCommands", "activation-command-hint"],
	["onRoutes", "activation-route-hint"],
	["onConfigPaths", "activation-config-path-hint"],
	["onCapabilities", "activation-capability-hint"]
];
/** Collects compatibility codes implied by a manifest's legacy or activation surfaces. */
function collectPluginManifestCompatCodes(record) {
	return ACTIVATION_COMPAT_CODES.filter(([key]) => record.activation?.[key]?.length).map(([, code]) => code).toSorted();
}
function resolvePackageJsonRecord(params) {
	const { candidate } = params;
	if (!candidate?.packageDir) return;
	const file = readPluginCacheFile({
		rootDir: candidate.packageDir,
		relativePath: "package.json",
		rejectHardlinks: params.rejectHardlinks
	});
	if (!file.ok) return;
	const rootDir = candidate.rootDir === candidate.packageDir ? file.rootRealPath : pluginCacheRealpathSync(candidate.rootDir) ?? path.resolve(candidate.rootDir);
	if (!isPathInside(rootDir, file.path)) return;
	const packageJsonPath = path.join(file.rootRealPath, "package.json");
	return {
		path: (path.relative(rootDir, packageJsonPath) || "package.json").split(path.sep).join("/"),
		hash: file.hash,
		fileSignature: file.signature
	};
}
function describePackageInstallSource(candidate) {
	const install = candidate?.packageManifest?.install;
	if (!install) return;
	return describePluginInstallSource(install, { expectedPackageName: candidate?.packageName });
}
function normalizePackageChannel(channel) {
	const id = normalizeOptionalString(channel?.id);
	if (!id) return;
	return {
		...structuredClone(channel),
		id
	};
}
function hashManifestlessBundleRecord(record) {
	return hashJson({
		id: record.id,
		name: record.name,
		description: record.description,
		version: record.version,
		format: record.format,
		bundleFormat: record.bundleFormat,
		bundleCapabilities: record.bundleCapabilities ?? [],
		skills: record.skills ?? [],
		settingsFiles: record.settingsFiles ?? [],
		hooks: record.hooks ?? []
	});
}
function readRecordFile(params) {
	const rootDir = params.boundaryRoot ?? params.record.rootDir;
	const file = readPluginCacheFile({
		rootDir,
		relativePath: path.relative(rootDir, params.filePath),
		rejectHardlinks: params.rejectHardlinks,
		...params.required && path.extname(params.filePath) === ".json" ? { maxBytes: 262144 } : {}
	});
	if (file.ok) return file;
	if (params.required) params.diagnostics.push({
		level: "warn",
		pluginId: params.record.id,
		source: params.filePath,
		message: `installed plugin index could not hash ${params.filePath}: ${file.failure.reason}`
	});
}
function buildInstalledPluginIndexRecords(params) {
	const candidateBySource = new Map(params.candidates.map((candidate) => [candidate.source, candidate]));
	const normalizedConfig = normalizePluginsConfig(params.config?.plugins);
	return params.registry.plugins.map((record) => {
		const candidate = candidateBySource.get(record.source);
		const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
			origin: record.origin,
			rootDir: record.rootDir,
			env: params.env
		});
		const installOwner = candidate && isPluginCandidateInstallOwnerAmbiguous(candidate) ? void 0 : resolvePluginManifestInstallOwner(record) ?? (candidate ? resolvePluginCandidateInstallOwner(candidate) : void 0);
		const installRecord = installOwner ? getPluginInstallRecordMapEntry(params.installRecords, installOwner) : void 0;
		const packageInstall = describePackageInstallSource(candidate);
		const packageChannel = normalizePackageChannel(record.packageChannel ?? candidate?.packageManifest?.channel);
		const manifestless = hasOptionalMissingPluginManifestFile(record);
		const manifestFile = manifestless ? void 0 : readRecordFile({
			record,
			filePath: record.manifestPath,
			rejectHardlinks,
			required: true,
			diagnostics: params.diagnostics
		});
		const manifestHash = manifestless ? hashManifestlessBundleRecord(record) : manifestFile?.hash ?? "";
		const doctorContractArtifact = resolvePluginDoctorContractArtifact(record);
		const doctorContractFile = doctorContractArtifact ? readRecordFile({
			record,
			filePath: doctorContractArtifact.modulePath,
			boundaryRoot: doctorContractArtifact.boundaryRoot,
			rejectHardlinks,
			diagnostics: params.diagnostics,
			required: false
		}) : void 0;
		const packageJson = resolvePackageJsonRecord({
			candidate,
			rejectHardlinks
		});
		const enabled = resolveEffectiveEnableState({
			id: record.id,
			origin: record.origin,
			channelIds: record.channels,
			config: normalizedConfig,
			rootConfig: params.config,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(record)
		}).enabled;
		const indexRecord = {
			pluginId: record.id,
			manifestPath: record.manifestPath,
			manifestHash,
			...doctorContractFile ? {
				doctorContractHash: doctorContractFile.hash,
				doctorContractFile: doctorContractFile.signature
			} : {},
			...manifestFile ? { manifestFile: manifestFile.signature } : {},
			source: record.source,
			rootDir: record.rootDir,
			origin: record.origin,
			enabled,
			startup: buildStartupInfo(record),
			contributions: buildContributionInfo(record),
			compat: collectPluginManifestCompatCodes(record)
		};
		if (record.format && record.format !== "openclaw") indexRecord.format = record.format;
		if (record.bundleFormat) indexRecord.bundleFormat = record.bundleFormat;
		if (record.enabledByDefault === true) indexRecord.enabledByDefault = true;
		if (record.enabledByDefaultOnPlatforms?.length) indexRecord.enabledByDefaultOnPlatforms = [...record.enabledByDefaultOnPlatforms];
		if (record.syntheticAuthRefs?.length) indexRecord.syntheticAuthRefs = [...record.syntheticAuthRefs];
		if (record.setupSource) indexRecord.setupSource = record.setupSource;
		if (candidate?.packageName) indexRecord.packageName = candidate.packageName;
		if (candidate?.packageVersion) indexRecord.packageVersion = candidate.packageVersion;
		if (installRecord) indexRecord.installRecordHash = hashJson(installRecord);
		if (packageInstall) indexRecord.packageInstall = packageInstall;
		if (packageChannel) indexRecord.packageChannel = packageChannel;
		if (candidate?.packageManifest?.build) indexRecord.packageBuild = structuredClone(candidate.packageManifest.build);
		if (packageJson) indexRecord.packageJson = packageJson;
		return recordInstalledPluginIndexInstallOwner(indexRecord, installOwner, candidate ? isPluginCandidateInstallOwnerAmbiguous(candidate) : false);
	});
}
//#endregion
//#region src/plugins/installed-plugin-index-types.ts
const INSTALLED_PLUGIN_INDEX_WARNING = "DO NOT EDIT. This file is generated by OpenClaw from plugin manifests, install records, and config policy. Use `openclaw plugins registry --refresh`, `openclaw plugins install/update/uninstall`, or `openclaw plugins enable/disable` instead.";
//#endregion
//#region src/plugins/installed-plugin-index-config-path-scope.ts
/** Compat code marking install records that need config-path activation metadata. */
const CONFIG_PATH_ACTIVATION_COMPAT_CODE = "activation-config-path-hint";
function recordUsesConfigPathActivation(plugin) {
	return plugin.compat.includes(CONFIG_PATH_ACTIVATION_COMPAT_CODE);
}
/** True when an index still has config-path activation records missing startup metadata. */
function hasMissingConfigPathActivationMetadata(index) {
	return index.plugins.some((plugin) => recordUsesConfigPathActivation(plugin) && plugin.startup.configPaths === void 0);
}
/** True when a record migrated config-path activation startup metadata. */
function hasConfigPathActivationMetadataMigration(params) {
	return recordUsesConfigPathActivation(params.previous) && params.previous.startup.configPaths === void 0 && params.current.startup.configPaths !== void 0;
}
//#endregion
//#region src/plugins/installed-plugin-index-invalidation.ts
function diffInstalledPluginIndexInvalidationReasons(previous, current) {
	const reasons = /* @__PURE__ */ new Set();
	if (previous.version !== current.version) reasons.add("missing");
	if (previous.hostContractVersion !== current.hostContractVersion) reasons.add("host-contract-changed");
	if (previous.compatRegistryVersion !== current.compatRegistryVersion) reasons.add("compat-registry-changed");
	if (previous.migrationVersion !== current.migrationVersion) reasons.add("migration");
	if (previous.policyHash !== current.policyHash) reasons.add("policy-changed");
	if (hashJson(previous.installRecords ?? {}) !== hashJson(current.installRecords ?? {})) reasons.add("source-changed");
	const previousByPluginId = new Map(previous.plugins.map((plugin) => [plugin.pluginId, plugin]));
	const currentByPluginId = new Map(current.plugins.map((plugin) => [plugin.pluginId, plugin]));
	for (const [pluginId, previousPlugin] of previousByPluginId) {
		const currentPlugin = currentByPluginId.get(pluginId);
		if (!currentPlugin) {
			reasons.add("source-changed");
			continue;
		}
		if (previousPlugin.rootDir !== currentPlugin.rootDir || previousPlugin.manifestPath !== currentPlugin.manifestPath || previousPlugin.source !== currentPlugin.source || previousPlugin.setupSource !== currentPlugin.setupSource || resolveInstalledPluginIndexInstallOwner(previousPlugin) !== resolveInstalledPluginIndexInstallOwner(currentPlugin) || isInstalledPluginIndexInstallOwnerAmbiguous(previousPlugin) !== isInstalledPluginIndexInstallOwnerAmbiguous(currentPlugin) || previousPlugin.installRecordHash !== currentPlugin.installRecordHash) reasons.add("source-changed");
		if (previousPlugin.enabled !== currentPlugin.enabled) reasons.add("policy-changed");
		if (hasConfigPathActivationMetadataMigration({
			previous: previousPlugin,
			current: currentPlugin
		})) reasons.add("migration");
		if (previousPlugin.manifestHash !== currentPlugin.manifestHash || previousPlugin.doctorContractHash !== currentPlugin.doctorContractHash) reasons.add("stale-manifest");
		if (previousPlugin.packageVersion !== currentPlugin.packageVersion || previousPlugin.packageJson?.path !== currentPlugin.packageJson?.path || previousPlugin.packageJson?.hash !== currentPlugin.packageJson?.hash) reasons.add("stale-package");
	}
	for (const [pluginId, plugin] of currentByPluginId) if (!previousByPluginId.has(pluginId) && plugin.enabled) reasons.add("source-changed");
	return Array.from(reasons).toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region src/plugins/installed-plugin-index.ts
function buildInstalledPluginIndex(params) {
	const env = params.env ?? process.env;
	const installRecords = normalizeInstallRecordMap(params.installRecords ?? loadInstalledPluginIndexInstallRecordsSync({
		env,
		...params.stateDir ? { stateDir: params.stateDir } : {},
		...params.pluginIndexFilePath ? { filePath: params.pluginIndexFilePath } : {}
	}));
	const baseDiscovery = params.candidates ? {
		candidates: params.candidates,
		diagnostics: params.diagnostics ?? []
	} : params.discovery ?? discoverOpenClawPlugins({
		workspaceDir: params.workspaceDir,
		extraPaths: normalizePluginsConfig(params.config?.plugins).loadPaths,
		env,
		installRecords
	});
	const discovery = !params.candidates && params.diagnostics?.length ? {
		...baseDiscovery,
		diagnostics: [...baseDiscovery.diagnostics, ...params.diagnostics]
	} : baseDiscovery;
	const registry = loadPluginManifestRegistryCore({
		registryPath: resolveInstalledPluginIndexStorePath({
			env,
			stateDir: params.stateDir,
			filePath: params.pluginIndexFilePath
		}),
		config: params.config,
		workspaceDir: params.workspaceDir,
		env,
		candidates: discovery.candidates,
		diagnostics: discovery.diagnostics,
		installRecords
	});
	const diagnostics = [...registry.diagnostics ?? []];
	const generatedAtMs = (params.now?.() ?? /* @__PURE__ */ new Date()).getTime();
	const activationConfig = withBundledPluginEnablementCompat({
		config: params.config,
		env,
		pluginIds: registry.plugins.filter(isBundledProviderCompatPlugin).map((plugin) => plugin.id),
		activation: "defaults",
		artifactPreservingReadOnly: params.artifactPreservingReadOnly
	});
	const plugins = buildInstalledPluginIndexRecords({
		candidates: discovery.candidates,
		registry,
		config: activationConfig,
		env,
		diagnostics,
		installRecords
	});
	return {
		index: {
			version: 1,
			warning: INSTALLED_PLUGIN_INDEX_WARNING,
			hostContractVersion: resolveCompatibilityHostVersion(env),
			compatRegistryVersion: resolveCompatRegistryVersion(),
			migrationVersion: 1,
			policyHash: resolveInstalledPluginIndexPolicyHash(params.config, env, { artifactPreservingReadOnly: params.artifactPreservingReadOnly }),
			generatedAtMs,
			...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
			...params.refreshReason ? { refreshReason: params.refreshReason } : {},
			installRecords,
			plugins,
			diagnostics
		},
		discovery: params.candidates ? void 0 : discovery,
		manifestRegistry: registry
	};
}
function loadInstalledPluginIndex(params = {}) {
	return buildInstalledPluginIndex(params).index;
}
function loadInstalledPluginIndexWithDiscovery(params = {}) {
	return buildInstalledPluginIndex(params);
}
/** True when a persisted index cannot represent the requested workspace discovery scope. */
function hasInstalledPluginIndexWorkspaceScopeMismatch(index, workspaceDir) {
	if (workspaceDir !== void 0) return index.workspaceDir !== workspaceDir;
	return index.workspaceDir !== void 0 || index.plugins.some((plugin) => plugin.origin === "workspace");
}
function refreshInstalledPluginIndex(params) {
	return buildInstalledPluginIndex({
		...params,
		refreshReason: params.reason
	}).index;
}
function isInstalledPluginEnabled(index, pluginId, config, env) {
	const record = index.plugins.find((plugin) => plugin.pluginId === pluginId);
	if (!record || !config) return record?.enabled ?? false;
	return createInstalledPluginEnabledPredicate([record], config, env)(pluginId);
}
function isInstalledBundledProvider(record) {
	return isBundledProviderCompatPlugin({
		origin: record.origin,
		providers: record.contributions?.providers,
		contracts: record.contributions?.contracts
	});
}
/** Prepare live policy for one synchronous operation, never across config/root changes. */
function createInstalledPluginEnabledPredicate(plugins, config, env) {
	let source;
	let bundledSource;
	let records;
	return (pluginId) => {
		if (!records) {
			records = /* @__PURE__ */ new Map();
			for (const entry of plugins) if (!records.has(entry.pluginId)) records.set(entry.pluginId, entry);
		}
		const record = records.get(pluginId);
		if (!record || !config) return record?.enabled ?? false;
		let activationSource;
		if (isInstalledBundledProvider(record)) {
			if (!bundledSource) {
				const bundledConfig = withBundledPluginEnablementCompat({
					config,
					env,
					pluginIds: plugins.filter(isInstalledBundledProvider).map((entry) => entry.pluginId),
					activation: "defaults"
				});
				bundledSource = bundledConfig === config ? source ??= createPluginActivationSource({ config }) : createPluginActivationSource({ config: bundledConfig });
			}
			activationSource = bundledSource;
		} else activationSource = source ??= createPluginActivationSource({ config });
		return resolveEffectivePluginActivationState({
			id: record.pluginId,
			origin: record.origin,
			channelIds: record.contributions?.channels,
			config: activationSource.plugins,
			rootConfig: activationSource.rootConfig,
			activationSource,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(record)
		}).enabled;
	};
}
//#endregion
export { getInstalledPluginIndexFacts as _, loadInstalledPluginIndexWithDiscovery as a, hasMissingConfigPathActivationMetadata as c, hasOptionalMissingPluginManifestFile as d, isOptionalPluginManifestFile as f, withBundledPluginEnablementCompat as g, isBundledProviderCompatPlugin as h, loadInstalledPluginIndex as i, INSTALLED_PLUGIN_INDEX_WARNING as l, isBundledProviderCompatContract as m, hasInstalledPluginIndexWorkspaceScopeMismatch as n, refreshInstalledPluginIndex as o, extractPluginInstallRecordsFromInstalledPluginIndex as p, isInstalledPluginEnabled as r, diffInstalledPluginIndexInvalidationReasons as s, createInstalledPluginEnabledPredicate as t, collectPluginManifestCompatCodes as u, resolveCompatRegistryVersion as v, resolveInstalledPluginIndexPolicyHash as y };
