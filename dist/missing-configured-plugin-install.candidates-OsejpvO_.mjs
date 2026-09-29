import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { o as safeRealpathSync } from "./path-safety-0BfxAYBQ.mjs";
import "./path-safety-Cc0rrc_m.mjs";
import { n as isBundledPluginInsideDevSourceRoot } from "./dev-source-root-b-YTkLfc.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-BkM1aB4w.mjs";
import { l as normalizePluginsConfig, u as resolveEffectiveEnableState } from "./config-state-BEAL5gWH.mjs";
import { c as readLegacyNpmPluginDeclaration } from "./discovery-D_5mAUI7.mjs";
import { o as parseRegistryNpmSpec, t as compareOpenClawReleaseVersions } from "./npm-registry-spec-CjcsDXUg.mjs";
import { a as resolveDefaultPluginExtensionsDir, c as resolvePluginInstallDir } from "./install-paths-DnOgVB7K.mjs";
import { i as normalizePluginDependencySpecs, r as findMissingRequiredPluginDependencies } from "./status-dependencies-core-CNMnZyKQ.mjs";
import { S as resolveOfficialExternalWebProviderContractPluginIdsForEnv, a as isExternallyDistributedPlugin, b as resolveOfficialExternalProviderPluginIds, h as resolveOfficialExternalPluginLabel, l as listOfficialExternalPluginCatalogEntries, p as resolveOfficialExternalPluginInstall, x as resolveOfficialExternalProviderPluginIdsForEnv, y as resolveOfficialExternalProviderContractPluginIds } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { o as resolveRetainedManagedNpmInstallPackageInfo } from "./managed-npm-retention-dDTeoxiW.mjs";
import { c as normalizeUpdateChannel, d as resolveRegistryUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { h as resolveOfficialExternalPluginId } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-CEG7WMVu.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-BnGMmE02.mjs";
import { t as listDoctorConfiguredChannelIds } from "./configured-channel-ids-DxxfdkXT.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { u as resolveConfiguredChannelPresencePolicy } from "./channel-presence-policy-C83ks5im.mjs";
import { n as resolveWebSearchInstallCatalogEntriesForEnv, r as resolveWebSearchInstallCatalogEntry } from "./web-search-install-catalog-DJ92D1Xo.mjs";
import { i as isNativeSessionCatalogOptOutOnly } from "./native-session-catalog-config-CYC8tjEu.mjs";
import { r as removePluginInstallRecordFromRecords } from "./installed-plugin-index-records-Clh203og.mjs";
import { y as collectConfiguredMemoryEmbeddingProviderIds } from "./gateway-startup-plugin-config-AVh0bjkO.mjs";
import { t as collectConfiguredSpeechProviderIds } from "./gateway-startup-speech-providers-CXRk02Zm.mjs";
import "./gateway-startup-plugin-ids-B1xxPE6K.mjs";
import "./channel-plugin-ids-DiMsgxMa.mjs";
import { n as VERSION_BOUND_RUNTIME_PLUGIN_IDS, t as CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES } from "./configured-runtime-plugin-installs-DW1vCQmx.mjs";
import { n as isPayloadMissing } from "./payload-verification-DlThdi1u.mjs";
import { r as listRawChannelPluginCatalogEntries } from "./catalog-soE9Hrg0.mjs";
import { n as resolveProviderInstallCatalogEntries } from "./provider-install-catalog-Dthg1dSQ.mjs";
import { n as collectConfiguredModelProviderSelectionIds, r as collectConfiguredProviderSelectionIds, t as collectConfiguredMediaProviderSelectionIds } from "./configured-provider-selection-ids-2ML-_-_L.mjs";
import { t as collectConfiguredRuntimePluginIds } from "./configured-runtime-plugin-owners-BEPmC61D.mjs";
import path from "node:path";
//#region src/commands/doctor/shared/missing-configured-plugin-install.dependency-health.ts
/** Collects dependency failures only for enabled, canonically recorded npm installs. */
async function collectInstalledPluginMissingRequiredDependencies(params) {
	const missing = /* @__PURE__ */ new Map();
	const config = normalizePluginsConfig(params.cfg.plugins);
	for (const plugin of params.snapshot.plugins) {
		const record = Object.hasOwn(params.installRecords, plugin.id) ? params.installRecords[plugin.id] : void 0;
		if (!params.isRepairTarget(plugin.id) || plugin.origin === "bundled" || params.blockedPluginIds?.has(plugin.id) || record?.source !== "npm" || !record.installPath?.trim() || !record.spec?.trim()) continue;
		const spec = parseRegistryNpmSpec(record.spec);
		if (!spec || plugin.packageName !== spec.name || record.resolvedName && record.resolvedName !== spec.name || !resolveEffectiveEnableState({
			id: plugin.id,
			origin: plugin.origin,
			config,
			rootConfig: params.cfg,
			enabledByDefault: plugin.enabledByDefault,
			channelIds: plugin.channels
		}).enabled) continue;
		const rootDir = params.resolvePathIdentity(plugin.rootDir);
		if (rootDir !== params.resolvePathIdentity(record.installPath)) continue;
		const missingRequired = await findMissingRequiredPluginDependencies({
			rootDir,
			dependencyRootDir: resolveRetainedManagedNpmInstallPackageInfo(rootDir)?.projectRoot ?? rootDir,
			...normalizePluginDependencySpecs({
				dependencies: plugin.packageDependencies,
				optionalDependencies: plugin.packageOptionalDependencies
			})
		});
		if (missingRequired.length > 0) missing.set(plugin.id, {
			rootDir,
			missingRequired
		});
	}
	return missing;
}
//#endregion
//#region src/commands/doctor/shared/configured-provider-plugin-ids.ts
/** Lists official external provider plugins without loading installed plugin registries. */
function collectConfiguredOfficialProviderPluginIds(params) {
	const configuredProviderIds = collectConfiguredModelProviderSelectionIds(params.cfg);
	const configuredMediaProviderIds = collectConfiguredMediaProviderSelectionIds(params.cfg);
	const pluginIds = new Set(resolveOfficialExternalProviderPluginIds({ providerIds: configuredProviderIds }));
	for (const pluginId of resolveOfficialExternalProviderPluginIdsForEnv(params.env ?? process.env)) pluginIds.add(pluginId);
	for (const pluginId of resolveOfficialExternalProviderContractPluginIds({
		contract: "mediaUnderstandingProviders",
		providerIds: configuredMediaProviderIds
	})) pluginIds.add(pluginId);
	for (const pluginId of resolveOfficialExternalProviderContractPluginIds({
		contract: "speechProviders",
		providerIds: configuredProviderIds
	})) pluginIds.add(pluginId);
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region src/commands/doctor/shared/configured-provider-plugin-installs.ts
/** Lists external provider plugins implied by configured auth profiles and model refs. */
function collectConfiguredProviderPluginIds(params) {
	const selectedProviderIds = collectConfiguredProviderSelectionIds(params.cfg);
	const pluginIds = new Set(collectConfiguredOfficialProviderPluginIds(params));
	if (selectedProviderIds.size > 0) {
		for (const entry of resolveProviderInstallCatalogEntries({
			config: params.cfg,
			env: params.env,
			includeUntrustedWorkspacePlugins: false
		})) if ([entry.providerId, ...entry.providerAliases ?? []].some((providerId) => selectedProviderIds.has(providerId.toLowerCase()))) pluginIds.add(entry.pluginId);
	}
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region src/commands/doctor/shared/missing-configured-plugin-install.ids.ts
function addConfiguredPluginId(ids, value) {
	if (typeof value !== "string") return;
	const pluginId = value.trim();
	if (pluginId) ids.add(pluginId);
}
function addConfiguredMemoryEmbeddingProviderPluginIds(ids, cfg) {
	const configuredProviderIds = collectConfiguredMemoryEmbeddingProviderIds(cfg);
	if (configuredProviderIds.size === 0) return;
	for (const pluginId of resolveOfficialExternalProviderContractPluginIds({
		contract: "embeddingProviders",
		providerIds: configuredProviderIds
	})) ids.add(pluginId);
}
function addConfiguredSpeechProviderPluginIds(ids, cfg) {
	for (const pluginId of resolveOfficialExternalProviderContractPluginIds({
		contract: "speechProviders",
		providerIds: collectConfiguredSpeechProviderIds(cfg)
	})) ids.add(pluginId);
}
function addConfiguredWebFetchProviderPluginIds(ids, cfg) {
	const webFetch = cfg.tools?.web?.fetch;
	if (webFetch?.enabled === false) return;
	const providerId = normalizeOptionalLowercaseString(webFetch?.provider);
	if (!providerId) return;
	for (const pluginId of resolveOfficialExternalProviderContractPluginIds({
		contract: "webFetchProviders",
		providerIds: /* @__PURE__ */ new Set([providerId])
	})) ids.add(pluginId);
}
function addEnvWebFetchProviderPluginIds(ids, cfg, env) {
	if (cfg.tools?.web?.fetch?.enabled === false) return;
	for (const pluginId of resolveOfficialExternalWebProviderContractPluginIdsForEnv({
		contract: "webFetchProviders",
		env: env ?? process.env
	})) ids.add(pluginId);
}
function collectConfiguredPluginIds(cfg, env) {
	const ids = /* @__PURE__ */ new Set();
	const plugins = asNullableRecord(cfg.plugins);
	if (plugins?.enabled === false) return ids;
	const entries = asNullableRecord(plugins?.entries);
	for (const [pluginId, entry] of Object.entries(entries ?? {})) {
		if (asNullableRecord(entry)?.enabled === false || isNativeSessionCatalogOptOutOnly(pluginId, entry)) continue;
		addConfiguredPluginId(ids, pluginId);
	}
	const searchProvider = normalizeOptionalLowercaseString(cfg.tools?.web?.search?.provider);
	if (cfg.tools?.web?.search?.enabled !== false && searchProvider) {
		const installEntry = resolveWebSearchInstallCatalogEntry({ providerId: searchProvider });
		if (installEntry?.pluginId) ids.add(installEntry.pluginId);
	} else if (cfg.tools?.web?.search?.enabled !== false) for (const entry of resolveWebSearchInstallCatalogEntriesForEnv(env ?? process.env)) ids.add(entry.pluginId);
	for (const pluginId of collectConfiguredRuntimePluginIds(cfg, { env })) ids.add(pluginId);
	for (const pluginId of collectConfiguredProviderPluginIds({
		cfg,
		env
	})) ids.add(pluginId);
	addConfiguredMemoryEmbeddingProviderPluginIds(ids, cfg);
	addConfiguredSpeechProviderPluginIds(ids, cfg);
	addConfiguredWebFetchProviderPluginIds(ids, cfg);
	addEnvWebFetchProviderPluginIds(ids, cfg, env);
	return ids;
}
function collectBlockedPluginIds(cfg) {
	const ids = /* @__PURE__ */ new Set();
	const deny = cfg.plugins?.deny;
	if (Array.isArray(deny)) {
		for (const pluginId of deny) if (typeof pluginId === "string" && pluginId.trim()) ids.add(pluginId.trim());
	}
	const entries = asNullableRecord(cfg.plugins?.entries);
	for (const [pluginId, entry] of Object.entries(entries ?? {})) if (pluginId.trim() && asNullableRecord(entry)?.enabled === false) ids.add(pluginId.trim());
	return ids;
}
function collectConfiguredChannelIds(cfg, env) {
	if (asNullableRecord(cfg.plugins)?.enabled === false) return /* @__PURE__ */ new Set();
	const candidateChannelIds = listRawChannelPluginCatalogEntries({
		env,
		excludeWorkspace: true
	}).map((entry) => entry.id);
	return new Set(listDoctorConfiguredChannelIds(cfg, {
		configEntryPolicy: "meaningful",
		env: env ?? process.env,
		candidateChannelIds,
		skipWhenPluginsDisabled: true,
		excludeExplicitlyDisabled: true
	}));
}
function collectEffectiveConfiguredChannelOwnerPluginIds(params) {
	const owners = /* @__PURE__ */ new Map();
	const configuredChannelIds = new Set([...params.configuredChannelIds].map((channelId) => normalizeOptionalLowercaseString(channelId)).filter((channelId) => Boolean(channelId)));
	if (configuredChannelIds.size === 0) return owners;
	for (const entry of resolveConfiguredChannelPresencePolicy({
		config: params.cfg,
		env: params.env,
		includePersistedAuthState: false,
		manifestRecords: params.snapshot.plugins
	})) {
		if (!entry.effective || !configuredChannelIds.has(entry.channelId)) continue;
		const pluginIds = new Set(entry.pluginIds);
		if (pluginIds.size > 0) owners.set(entry.channelId, pluginIds);
	}
	return owners;
}
//#endregion
//#region src/commands/doctor/shared/missing-configured-plugin-install.candidates.ts
/** Keep doctor diagnostics and actual package repair on the same discovery snapshot. */
async function resolveConfiguredPluginInstallContext(params) {
	const realpathCache = /* @__PURE__ */ new Map();
	const resolvePathIdentity = (value) => {
		const resolved = path.resolve(resolveUserPath(value, params.env));
		return safeRealpathSync(resolved, realpathCache) ?? resolved;
	};
	const snapshot = loadManifestMetadataSnapshot({
		config: params.cfg,
		env: params.env
	});
	const currentBundledPlugins = loadPluginManifestRegistryCore({
		config: params.cfg,
		env: params.env,
		installRecords: {}
	}).plugins.filter((plugin) => plugin.origin === "bundled");
	const knownIds = /* @__PURE__ */ new Set([...snapshot.plugins.filter((plugin) => plugin.origin !== "bundled").map((plugin) => plugin.id), ...currentBundledPlugins.map((plugin) => plugin.id)]);
	const configuredChannelOwnerPluginIds = collectEffectiveConfiguredChannelOwnerPluginIds({
		cfg: params.cfg,
		env: params.env,
		snapshot,
		configuredChannelIds: params.configuredChannelIds
	});
	const bundledPluginsById = new Map(currentBundledPlugins.flatMap((plugin) => {
		const external = isExternallyDistributedPlugin({
			pluginId: plugin.id,
			packageName: plugin.packageName,
			packageBuild: plugin.packageManifest?.build
		});
		const sourceCheckout = isBundledPluginInsideDevSourceRoot({
			rootDir: plugin.rootDir,
			env: params.env
		});
		return !external || sourceCheckout ? [[plugin.id, {
			packageName: plugin.packageName,
			preserveExternalInstallRecord: external && sourceCheckout
		}]] : [];
	}));
	const configuredPluginIdsWithStaleDescriptors = collectConfiguredPluginIdsWithMissingChannelConfigDescriptors({
		snapshot,
		configuredPluginIds: params.configuredPluginIds,
		configuredChannelIds: params.configuredChannelIds
	});
	const records = params.baselineRecords ?? await loadInstalledPluginIndexInstallRecords({ env: params.env });
	const operatorManagedPluginIds = /* @__PURE__ */ new Set();
	if (params.cfg.plugins?.load?.paths?.length) {
		const ownership = createInstalledPluginOwnershipResolver({
			...snapshot.index,
			installRecords: records
		}, params.env);
		for (const plugin of snapshot.index.plugins) {
			const update = ownership.resolveUpdate(plugin.pluginId);
			if (update.ok && update.value.kind === "operator-managed") {
				operatorManagedPluginIds.add(plugin.pluginId);
				if (update.value.shadowedInstallOwner) operatorManagedPluginIds.add(update.value.shadowedInstallOwner);
			}
		}
	}
	const currentVersion = params.coreVersion ?? resolveCompatibilityHostVersion(params.env);
	const updateChannel = resolveRegistryUpdateChannel({
		configChannel: normalizeUpdateChannel(params.cfg.update?.channel),
		currentVersion
	});
	const installedPluginIdsWithRepairablePackageDiagnostics = collectInstalledPluginIdsWithRepairablePackageDiagnostics({
		snapshot,
		installRecords: records,
		resolvePathIdentity
	});
	const installedPluginIdsWithStaleVersionBoundRuntimePackages = collectInstalledPluginIdsWithStaleVersionBoundRuntimePackages({
		snapshot,
		installRecords: records,
		configuredPluginIds: params.configuredPluginIds,
		currentVersion
	});
	const installedPluginMissingRequiredDependencies = await collectInstalledPluginMissingRequiredDependencies({
		cfg: params.cfg,
		isRepairTarget: (pluginId) => isConfiguredPluginRepairTarget({
			pluginId,
			configuredPluginIds: params.configuredPluginIds,
			configuredChannelIds: params.configuredChannelIds,
			configuredChannelOwnerPluginIds
		}),
		snapshot,
		installRecords: records,
		blockedPluginIds: params.blockedPluginIds,
		resolvePathIdentity
	});
	const installedPluginIdsWithRepairablePackages = /* @__PURE__ */ new Set([
		...installedPluginIdsWithRepairablePackageDiagnostics,
		...installedPluginIdsWithStaleVersionBoundRuntimePackages,
		...installedPluginMissingRequiredDependencies.keys()
	]);
	const officialReplacementPluginIds = new Set(collectOfficialReplacementInstallCandidates({
		cfg: params.cfg,
		env: params.env,
		repairablePluginIds: new Set([...installedPluginIdsWithRepairablePackages].filter((pluginId) => !installedPluginMissingRequiredDependencies.has(pluginId))),
		configuredPluginIds: params.configuredPluginIds,
		configuredChannelIds: params.configuredChannelIds,
		configuredChannelOwnerPluginIds,
		blockedPluginIds: params.blockedPluginIds
	}).keys());
	const configuredLoadPathIdentities = new Set(snapshot.discovery?.candidates.filter((candidate) => candidate.configSelected).flatMap((candidate) => [candidate.rootDir, candidate.source]).map(resolvePathIdentity));
	const configuredLoadPathPluginsById = /* @__PURE__ */ new Map();
	for (const plugin of snapshot.plugins) if (plugin.origin === "config" || configuredLoadPathIdentities.size > 0 && [plugin.rootDir, plugin.source].some((value) => configuredLoadPathIdentities.has(resolvePathIdentity(value)))) configuredLoadPathPluginsById.set(plugin.id, plugin.rootDir);
	const stalePathInstallPluginIds = /* @__PURE__ */ new Set();
	for (const [pluginId, record] of Object.entries(records)) {
		if (installedPluginIdsWithRepairablePackages.has(pluginId)) continue;
		const configPluginRoot = configuredLoadPathPluginsById.get(pluginId);
		const recordedPaths = [record.installPath, record.sourcePath].filter((value) => Boolean(value?.trim()));
		if (!configPluginRoot || record.source !== "path" || recordedPaths.length === 0) continue;
		const configRootIdentity = resolvePathIdentity(configPluginRoot);
		if (isPayloadMissing(params.env, record.installPath) && recordedPaths.every((value) => resolvePathIdentity(value) !== configRootIdentity)) stalePathInstallPluginIds.add(pluginId);
	}
	let effectiveRecords = records;
	for (const pluginId of stalePathInstallPluginIds) effectiveRecords = removePluginInstallRecordFromRecords(effectiveRecords, pluginId);
	return {
		knownIds,
		configuredChannelOwnerPluginIds,
		bundledPluginsById,
		configuredPluginIdsWithStaleDescriptors,
		operatorManagedPluginIds,
		stalePathInstallPluginIds,
		records: effectiveRecords,
		persistedRecords: records,
		updateChannel,
		installedPluginIdsWithRepairablePackageDiagnostics,
		installedPluginIdsWithStaleVersionBoundRuntimePackages,
		installedPluginIdsWithRepairablePackages,
		installedPluginMissingRequiredDependencies,
		officialReplacementPluginIds
	};
}
const MISSING_CHANNEL_CONFIG_DESCRIPTOR_DIAGNOSTIC = "without channelConfigs metadata";
const REPAIRABLE_PACKAGE_ENTRY_DIAGNOSTIC_MARKERS = [
	"extension entry not found",
	"extension entry escapes package directory",
	"extension entry unreadable",
	"requires compiled runtime output"
];
function setDownloadableInstallCandidate(params) {
	const npmSpec = params.install.npmSpec?.trim();
	const clawhubSpec = params.install.clawhubSpec?.trim();
	if (!npmSpec && !clawhubSpec) return;
	params.candidates.set(params.pluginId, {
		pluginId: params.pluginId,
		label: params.label,
		...npmSpec ? { npmSpec } : {},
		...clawhubSpec ? { clawhubSpec } : {},
		...params.install.expectedIntegrity ? { expectedIntegrity: params.install.expectedIntegrity } : {},
		...params.trustedSourceLinkedOfficialInstall ? { trustedSourceLinkedOfficialInstall: true } : {},
		...params.install.defaultChoice ? { defaultChoice: params.install.defaultChoice } : {}
	});
}
function collectDownloadableInstallCandidates(params) {
	const configuredPluginIds = params.configuredPluginIds ?? collectConfiguredPluginIds(params.cfg, params.env);
	const configuredChannelIds = params.configuredChannelIds ?? collectConfiguredChannelIds(params.cfg, params.env);
	if (params.missingPluginIds.size === 0 && configuredPluginIds.size === 0 && configuredChannelIds.size === 0) return [];
	const candidates = /* @__PURE__ */ new Map();
	for (const entry of listRawChannelPluginCatalogEntries({
		env: params.env,
		excludeWorkspace: true
	})) {
		if (entry.origin === "bundled") continue;
		const pluginId = entry.pluginId ?? entry.id;
		const channelId = normalizeOptionalLowercaseString(entry.id);
		if (params.blockedPluginIds?.has(pluginId)) continue;
		const selectedOnlyByChannel = !params.missingPluginIds.has(pluginId) && !configuredPluginIds.has(pluginId) && (channelId ? configuredChannelIds.has(channelId) : configuredChannelIds.has(entry.id));
		const configuredChannelOwnerPluginIds = channelId ? params.configuredChannelOwnerPluginIds?.get(channelId) : void 0;
		if (selectedOnlyByChannel && configuredChannelOwnerPluginIds && configuredChannelOwnerPluginIds.size > 0 && !configuredChannelOwnerPluginIds.has(pluginId)) continue;
		if (!params.missingPluginIds.has(pluginId) && !configuredPluginIds.has(pluginId) && !configuredChannelIds.has(entry.id)) continue;
		setDownloadableInstallCandidate({
			candidates,
			pluginId,
			label: entry.meta.label,
			install: entry.install,
			trustedSourceLinkedOfficialInstall: entry.trustedSourceLinkedOfficialInstall
		});
	}
	for (const entry of resolveProviderInstallCatalogEntries({
		config: params.cfg,
		env: params.env,
		includeUntrustedWorkspacePlugins: false
	})) {
		if (!configuredPluginIds.has(entry.pluginId) && !params.missingPluginIds.has(entry.pluginId)) continue;
		if (params.blockedPluginIds?.has(entry.pluginId)) continue;
		setDownloadableInstallCandidate({
			candidates,
			pluginId: entry.pluginId,
			label: entry.label,
			install: entry.install,
			trustedSourceLinkedOfficialInstall: entry.origin === "bundled"
		});
	}
	for (const entry of listOfficialExternalPluginCatalogEntries()) {
		const pluginId = resolveOfficialExternalPluginId(entry);
		if (!pluginId || candidates.has(pluginId) || params.blockedPluginIds?.has(pluginId)) continue;
		if (!configuredPluginIds.has(pluginId) && !params.missingPluginIds.has(pluginId)) continue;
		const install = resolveOfficialExternalPluginInstall(entry);
		if (!install) continue;
		setDownloadableInstallCandidate({
			candidates,
			pluginId,
			label: resolveOfficialExternalPluginLabel(entry),
			install,
			trustedSourceLinkedOfficialInstall: true
		});
	}
	for (const entry of CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES) {
		if (!configuredPluginIds.has(entry.pluginId) && !params.missingPluginIds.has(entry.pluginId)) continue;
		if (params.blockedPluginIds?.has(entry.pluginId)) continue;
		const existing = candidates.get(entry.pluginId);
		if (existing && entry.versionBoundToOpenClaw) candidates.set(entry.pluginId, {
			...existing,
			versionBoundToOpenClaw: true
		});
		else if (!existing) candidates.set(entry.pluginId, entry);
	}
	for (const candidate of collectLegacyNpmDeclarationInstallCandidates({
		cfg: params.cfg,
		env: params.env,
		configuredPluginIds,
		missingPluginIds: params.missingPluginIds,
		blockedPluginIds: params.blockedPluginIds
	})) if (!candidates.has(candidate.pluginId)) candidates.set(candidate.pluginId, candidate);
	return [...candidates.values()].toSorted((left, right) => left.pluginId.localeCompare(right.pluginId));
}
function addLegacyNpmDeclarationInstallCandidate(params) {
	const declaration = readLegacyNpmPluginDeclaration(params.pluginDir);
	if (!declaration) return;
	if (params.blockedPluginIds?.has(declaration.pluginId) || !params.configuredPluginIds.has(declaration.pluginId) && !params.missingPluginIds.has(declaration.pluginId)) return;
	params.candidates.set(declaration.pluginId, {
		pluginId: declaration.pluginId,
		label: declaration.pluginId,
		npmSpec: declaration.npmSpec,
		defaultChoice: "npm"
	});
}
function collectLegacyNpmDeclarationInstallCandidates(params) {
	const candidates = /* @__PURE__ */ new Map();
	const env = params.env ?? process.env;
	const loadPaths = params.cfg.plugins?.load?.paths;
	if (Array.isArray(loadPaths)) for (const rawPath of loadPaths) {
		if (typeof rawPath !== "string" || !rawPath.trim()) continue;
		addLegacyNpmDeclarationInstallCandidate({
			candidates,
			pluginDir: resolveUserPath(rawPath, env),
			configuredPluginIds: params.configuredPluginIds,
			missingPluginIds: params.missingPluginIds,
			blockedPluginIds: params.blockedPluginIds
		});
	}
	const extensionsDir = resolveDefaultPluginExtensionsDir(env);
	const configuredOrMissingPluginIds = /* @__PURE__ */ new Set([...params.configuredPluginIds, ...params.missingPluginIds]);
	for (const pluginId of configuredOrMissingPluginIds) try {
		addLegacyNpmDeclarationInstallCandidate({
			candidates,
			pluginDir: resolvePluginInstallDir(pluginId, extensionsDir),
			configuredPluginIds: params.configuredPluginIds,
			missingPluginIds: params.missingPluginIds,
			blockedPluginIds: params.blockedPluginIds
		});
	} catch {
		continue;
	}
	return [...candidates.values()].toSorted((left, right) => left.pluginId.localeCompare(right.pluginId));
}
function collectUpdateDeferredPluginIds(params) {
	const pluginIds = new Set(params.configuredPluginIds);
	for (const candidate of collectDownloadableInstallCandidates({
		cfg: params.cfg,
		env: params.env,
		missingPluginIds: /* @__PURE__ */ new Set(),
		configuredPluginIds: params.configuredPluginIds,
		configuredChannelIds: params.configuredChannelIds,
		configuredChannelOwnerPluginIds: params.configuredChannelOwnerPluginIds,
		blockedPluginIds: params.blockedPluginIds
	})) pluginIds.add(candidate.pluginId);
	return pluginIds;
}
function collectConfiguredPluginIdsWithMissingChannelConfigDescriptors(params) {
	const stalePluginIds = /* @__PURE__ */ new Set();
	const pluginsById = new Map(params.snapshot.plugins.map((plugin) => [plugin.id, plugin]));
	for (const diagnostic of params.snapshot.diagnostics) {
		const pluginId = diagnostic.pluginId?.trim();
		if (!pluginId || !diagnostic.message.includes(MISSING_CHANNEL_CONFIG_DESCRIPTOR_DIAGNOSTIC)) continue;
		const ownsConfiguredChannel = pluginsById.get(pluginId)?.channels.some((channelId) => params.configuredChannelIds.has(channelId));
		if (params.configuredPluginIds.has(pluginId) || ownsConfiguredChannel) stalePluginIds.add(pluginId);
	}
	return stalePluginIds;
}
function collectInstalledPluginIdsWithRepairablePackageDiagnostics(params) {
	const pluginIds = /* @__PURE__ */ new Set();
	for (const diagnostic of params.snapshot.diagnostics) {
		const pluginId = diagnostic.pluginId?.trim();
		if (!pluginId || !Object.hasOwn(params.installRecords, pluginId)) continue;
		const installPath = params.installRecords[pluginId]?.installPath;
		if (installPath && diagnostic.source && params.resolvePathIdentity(diagnostic.source) === params.resolvePathIdentity(installPath) && REPAIRABLE_PACKAGE_ENTRY_DIAGNOSTIC_MARKERS.some((marker) => diagnostic.message.includes(marker))) pluginIds.add(pluginId);
	}
	return pluginIds;
}
function resolveInstalledRuntimePackageVersion(params) {
	const plugin = params.snapshot.byPluginId?.get(params.pluginId) ?? params.snapshot.plugins.find((entry) => entry.id === params.pluginId);
	return normalizeOptionalLowercaseString(params.record.resolvedVersion ?? params.record.version ?? plugin?.packageVersion ?? plugin?.version);
}
function installedRuntimePackageVersionIsStale(params) {
	if (!params.installedVersion) return false;
	const comparison = compareOpenClawReleaseVersions(params.installedVersion, params.currentVersion);
	return comparison === null ? params.installedVersion !== params.currentVersion : comparison < 0;
}
function collectInstalledPluginIdsWithStaleVersionBoundRuntimePackages(params) {
	const pluginIds = /* @__PURE__ */ new Set();
	const currentVersion = normalizeOptionalLowercaseString(params.currentVersion);
	if (!currentVersion) return pluginIds;
	for (const candidate of CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES) {
		if (!VERSION_BOUND_RUNTIME_PLUGIN_IDS.has(candidate.pluginId) || !params.configuredPluginIds.has(candidate.pluginId)) continue;
		const record = params.installRecords[candidate.pluginId];
		if (!record) continue;
		if (installedRuntimePackageVersionIsStale({
			installedVersion: resolveInstalledRuntimePackageVersion({
				pluginId: candidate.pluginId,
				snapshot: params.snapshot,
				record
			}),
			currentVersion
		})) pluginIds.add(candidate.pluginId);
	}
	return pluginIds;
}
function isConfiguredPluginRepairTarget(params) {
	if (params.configuredPluginIds.has(params.pluginId)) return true;
	if (params.configuredChannelIds.has(params.pluginId)) return true;
	for (const ownerIds of params.configuredChannelOwnerPluginIds.values()) if (ownerIds.has(params.pluginId)) return true;
	return false;
}
function collectOfficialReplacementInstallCandidates(params) {
	const repairableConfiguredPluginIds = new Set([...params.repairablePluginIds].filter((pluginId) => isConfiguredPluginRepairTarget({
		pluginId,
		configuredPluginIds: params.configuredPluginIds,
		configuredChannelIds: params.configuredChannelIds,
		configuredChannelOwnerPluginIds: params.configuredChannelOwnerPluginIds
	})));
	if (repairableConfiguredPluginIds.size === 0) return /* @__PURE__ */ new Map();
	const candidates = collectDownloadableInstallCandidates({
		cfg: params.cfg,
		env: params.env,
		missingPluginIds: repairableConfiguredPluginIds,
		configuredPluginIds: params.configuredPluginIds,
		configuredChannelIds: params.configuredChannelIds,
		configuredChannelOwnerPluginIds: params.configuredChannelOwnerPluginIds,
		blockedPluginIds: params.blockedPluginIds
	});
	return new Map(candidates.filter((candidate) => repairableConfiguredPluginIds.has(candidate.pluginId) && candidate.trustedSourceLinkedOfficialInstall).map((candidate) => [candidate.pluginId, candidate]));
}
//#endregion
export { collectConfiguredChannelIds as a, collectBlockedPluginIds as i, collectUpdateDeferredPluginIds as n, collectConfiguredPluginIds as o, resolveConfiguredPluginInstallContext as r, collectConfiguredProviderPluginIds as s, collectDownloadableInstallCandidates as t };
