import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-jg_14gWz.mjs";
import { a as safeRealpathSync } from "./path-safety-n0YlfCVt.mjs";
import { f as resolveEffectiveEnableState, u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { n as isBundledPluginInsideDevSourceRoot } from "./dev-source-root-TlYYNN5t.mjs";
import { i as normalizePluginDependencySpecs, r as findMissingRequiredPluginDependencies } from "./status-dependencies-core-CUcepTmO.mjs";
import { o as parseRegistryNpmSpec, t as compareOpenClawReleaseVersions } from "./npm-registry-spec-B_IER0ZB.mjs";
import { S as resolveOfficialExternalWebProviderContractPluginIdsForEnv, a as isExternallyDistributedPlugin, b as resolveOfficialExternalProviderPluginIds, h as resolveOfficialExternalPluginLabel, l as listOfficialExternalPluginCatalogEntries, p as resolveOfficialExternalPluginInstall, x as resolveOfficialExternalProviderPluginIdsForEnv, y as resolveOfficialExternalProviderContractPluginIds } from "./official-external-plugin-catalog-B5ALUbx8.mjs";
import { s as resolveRetainedManagedNpmInstallPackageInfo } from "./managed-npm-retention-DL_TwTTS.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { c as normalizeUpdateChannel, u as resolveRegistryUpdateChannel } from "./update-channels-l0GQCX9n.mjs";
import { g as resolveOfficialExternalPluginId } from "./official-external-plugin-catalog-source-8hS3NARf.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-BqtrPPLI.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-R9aCxQcY.mjs";
import { m as resolveConfiguredChannelPresencePolicy } from "./channel-presence-policy-hdzky3AO.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { n as resolveWebSearchInstallCatalogEntriesForEnv, r as resolveWebSearchInstallCatalogEntry } from "./web-search-install-catalog-D_H3kjvG.mjs";
import { i as isNativeSessionCatalogOptOutOnly } from "./native-session-catalog-config-Cw2NJHbW.mjs";
import { n as removePluginInstallRecordFromRecords } from "./installed-plugin-index-records-DTzp62mN.mjs";
import { _ as collectConfiguredMemoryEmbeddingProviderIds } from "./gateway-startup-plugin-config-Cv_2HdnZ.mjs";
import { t as collectConfiguredSpeechProviderIds } from "./gateway-startup-speech-providers-GphgdX8d.mjs";
import "./gateway-startup-plugin-ids-NMA5rryx.mjs";
import "./channel-plugin-ids-Bgv12GOX.mjs";
import { n as VERSION_BOUND_RUNTIME_PLUGIN_IDS, t as CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES } from "./official-runtime-plugins-WPvV9MD6.mjs";
import { h as shouldDeferConfiguredPluginInstallRepair } from "./update-phase-M5rvMZiC.mjs";
import { t as listDoctorConfiguredChannelIds } from "./configured-channel-ids-C-CNDuxu.mjs";
import { n as isPayloadMissing } from "./payload-verification-B5DHkUNO.mjs";
import { r as listRawChannelPluginCatalogEntries } from "./catalog-CUtkjPo2.mjs";
import { n as resolveProviderInstallCatalogEntries } from "./provider-install-catalog-BJ9XbGmI.mjs";
import { n as collectConfiguredModelProviderSelectionIds, r as collectConfiguredProviderSelectionIds, t as collectConfiguredMediaProviderSelectionIds } from "./configured-provider-selection-ids-CcoBNl5w.mjs";
import { t as collectConfiguredRuntimePluginIds } from "./configured-runtime-plugin-owners-Be2_SW9F.mjs";
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
	return [.../* @__PURE__ */ new Set([
		...resolveOfficialExternalProviderPluginIds({ providerIds: configuredProviderIds }),
		...resolveOfficialExternalProviderPluginIdsForEnv(params.env ?? process.env),
		...resolveOfficialExternalProviderContractPluginIds({
			contract: "mediaUnderstandingProviders",
			providerIds: configuredMediaProviderIds
		}),
		...resolveOfficialExternalProviderContractPluginIds({
			contract: "speechProviders",
			providerIds: configuredProviderIds
		})
	])].toSorted((left, right) => left.localeCompare(right));
}
function collectConfiguredWebSearchPluginIds(cfg, env, mode) {
	const search = cfg.tools?.web?.search;
	if (search?.enabled === false) return [];
	const providerId = mode === "backfill" ? typeof search?.provider === "string" ? search.provider : void 0 : normalizeOptionalLowercaseString(search?.provider);
	const entry = providerId !== void 0 ? resolveWebSearchInstallCatalogEntry({ providerId }) : void 0;
	return [...entry?.pluginId ? [entry.pluginId] : [], ...mode === "backfill" || !providerId ? resolveWebSearchInstallCatalogEntriesForEnv(env).map((candidate) => candidate.pluginId) : []];
}
function collectConfiguredWebFetchPluginIds(cfg, env) {
	const webFetch = cfg.tools?.web?.fetch;
	if (webFetch?.enabled === false) return [];
	const providerId = normalizeOptionalLowercaseString(webFetch?.provider);
	return [...providerId ? resolveOfficialExternalProviderContractPluginIds({
		contract: "webFetchProviders",
		providerIds: /* @__PURE__ */ new Set([providerId])
	}) : [], ...resolveOfficialExternalWebProviderContractPluginIdsForEnv({
		contract: "webFetchProviders",
		env
	})];
}
//#endregion
//#region src/commands/doctor/shared/configured-provider-plugin-installs.ts
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
function collectConfiguredPluginIds(cfg, env) {
	const ids = /* @__PURE__ */ new Set();
	const plugins = asNullableRecord(cfg.plugins);
	if (plugins?.enabled === false) return ids;
	const entries = asNullableRecord(plugins?.entries);
	for (const [pluginId, entry] of Object.entries(entries ?? {})) {
		if (asNullableRecord(entry)?.enabled === false || isNativeSessionCatalogOptOutOnly(pluginId, entry)) continue;
		addConfiguredPluginId(ids, pluginId);
	}
	for (const pluginId of collectConfiguredWebSearchPluginIds(cfg, env ?? process.env, "selected")) ids.add(pluginId);
	for (const pluginId of collectConfiguredRuntimePluginIds(cfg, { env })) ids.add(pluginId);
	for (const pluginId of collectConfiguredProviderPluginIds({
		cfg,
		env
	})) ids.add(pluginId);
	const embeddingProviderIds = collectConfiguredMemoryEmbeddingProviderIds(cfg);
	if (embeddingProviderIds.size > 0) for (const pluginId of resolveOfficialExternalProviderContractPluginIds({
		contract: "embeddingProviders",
		providerIds: embeddingProviderIds
	})) ids.add(pluginId);
	for (const pluginId of resolveOfficialExternalProviderContractPluginIds({
		contract: "speechProviders",
		providerIds: collectConfiguredSpeechProviderIds(cfg)
	})) ids.add(pluginId);
	for (const pluginId of collectConfiguredWebFetchPluginIds(cfg, env ?? process.env)) ids.add(pluginId);
	return ids;
}
function collectBlockedPluginIds(cfg) {
	const ids = /* @__PURE__ */ new Set();
	const deny = cfg.plugins?.deny;
	if (Array.isArray(deny)) for (const pluginId of deny) addConfiguredPluginId(ids, pluginId);
	const entries = asNullableRecord(cfg.plugins?.entries);
	for (const [pluginId, entry] of Object.entries(entries ?? {})) if (asNullableRecord(entry)?.enabled === false) addConfiguredPluginId(ids, pluginId);
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
	const isRepairTarget = (pluginId) => params.configuredPluginIds.has(pluginId) || params.configuredChannelIds.has(pluginId) || [...configuredChannelOwnerPluginIds.values()].some((ownerIds) => ownerIds.has(pluginId));
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
		isRepairTarget,
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
	const repairableConfiguredPluginIds = new Set([...installedPluginIdsWithRepairablePackages].filter((pluginId) => !installedPluginMissingRequiredDependencies.has(pluginId) && isRepairTarget(pluginId)));
	const officialReplacementPluginIds = new Set(repairableConfiguredPluginIds.size === 0 ? [] : collectDownloadableInstallCandidates({
		...params,
		configuredChannelOwnerPluginIds,
		missingPluginIds: repairableConfiguredPluginIds
	}).filter((candidate) => repairableConfiguredPluginIds.has(candidate.pluginId) && candidate.trustedSourceLinkedOfficialInstall).map((candidate) => candidate.pluginId));
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
		officialReplacementPluginIds,
		collectDeferredRepairs(currentRecords) {
			const pluginIds = new Set(shouldDeferConfiguredPluginInstallRepair(params.env) ? [...collectUpdateDeferredPluginIds({
				...params,
				configuredChannelOwnerPluginIds
			})].filter((pluginId) => !operatorManagedPluginIds.has(pluginId)) : []);
			return {
				pluginIds,
				repairPluginIds: [...pluginIds].filter((pluginId) => {
					const record = currentRecords[pluginId];
					return record && (isPayloadMissing(params.env, record.installPath) || installedPluginMissingRequiredDependencies.has(pluginId));
				})
			};
		},
		collectRecordedRepairs(currentRecords, deferredPluginIds, driftedPluginIds) {
			return Object.entries(effectiveRecords).filter(([pluginId]) => !operatorManagedPluginIds.has(pluginId) && !deferredPluginIds.has(pluginId) && !officialReplacementPluginIds.has(pluginId) && Object.hasOwn(currentRecords, pluginId) && !bundledPluginsById.has(pluginId) && (params.configuredPluginIds.has(pluginId) && (!knownIds.has(pluginId) || isPayloadMissing(params.env, currentRecords[pluginId]?.installPath)) || configuredPluginIdsWithStaleDescriptors.has(pluginId) || installedPluginIdsWithRepairablePackages.has(pluginId) || driftedPluginIds?.has(pluginId)));
		},
		collectInstallCandidates(currentRecords, deferredPluginIds) {
			const missingPluginIds = [...params.configuredPluginIds].filter((pluginId) => {
				if (operatorManagedPluginIds.has(pluginId) || deferredPluginIds.has(pluginId)) return false;
				const hasRecord = Object.hasOwn(currentRecords, pluginId);
				return !bundledPluginsById.has(pluginId) && (hasRecord ? isPayloadMissing(params.env, currentRecords[pluginId]?.installPath) : !knownIds.has(pluginId));
			});
			return collectDownloadableInstallCandidates({
				...params,
				configuredChannelOwnerPluginIds,
				missingPluginIds: /* @__PURE__ */ new Set([...missingPluginIds, ...officialReplacementPluginIds]),
				blockedPluginIds: /* @__PURE__ */ new Set([
					...params.blockedPluginIds ?? [],
					...deferredPluginIds,
					...operatorManagedPluginIds
				])
			});
		}
	};
}
const MISSING_CHANNEL_CONFIG_DESCRIPTOR_DIAGNOSTIC = "without channelConfigs metadata";
const REPAIRABLE_PACKAGE_ENTRY_DIAGNOSTIC_MARKERS = [
	"extension entry not found",
	"extension entry escapes package directory",
	"extension entry unreadable",
	"requires compiled runtime output"
];
function collectDownloadableInstallCandidates(params) {
	const { configuredPluginIds, configuredChannelIds } = params;
	if (params.missingPluginIds.size === 0 && configuredPluginIds.size === 0 && configuredChannelIds.size === 0) return [];
	const candidates = /* @__PURE__ */ new Map();
	function setDownloadableInstallCandidate(candidate) {
		const npmSpec = candidate.install.npmSpec?.trim();
		const clawhubSpec = candidate.install.clawhubSpec?.trim();
		if (!npmSpec && !clawhubSpec) return;
		candidates.set(candidate.pluginId, {
			pluginId: candidate.pluginId,
			label: candidate.label,
			...npmSpec ? { npmSpec } : {},
			...clawhubSpec ? { clawhubSpec } : {},
			...candidate.install.expectedIntegrity ? { expectedIntegrity: candidate.install.expectedIntegrity } : {},
			...candidate.trustedSourceLinkedOfficialInstall ? { trustedSourceLinkedOfficialInstall: true } : {},
			...candidate.install.defaultChoice ? { defaultChoice: candidate.install.defaultChoice } : {}
		});
	}
	const isRequestedPlugin = (pluginId) => configuredPluginIds.has(pluginId) || params.missingPluginIds.has(pluginId);
	for (const entry of listRawChannelPluginCatalogEntries({
		env: params.env,
		excludeWorkspace: true
	})) {
		if (entry.origin === "bundled") continue;
		const pluginId = entry.pluginId ?? entry.id;
		const channelId = normalizeOptionalLowercaseString(entry.id);
		if (params.blockedPluginIds?.has(pluginId)) continue;
		const selectedOnlyByChannel = !isRequestedPlugin(pluginId) && (channelId ? configuredChannelIds.has(channelId) : configuredChannelIds.has(entry.id));
		const configuredChannelOwnerPluginIds = channelId ? params.configuredChannelOwnerPluginIds?.get(channelId) : void 0;
		if (selectedOnlyByChannel && configuredChannelOwnerPluginIds && configuredChannelOwnerPluginIds.size > 0 && !configuredChannelOwnerPluginIds.has(pluginId)) continue;
		if (!isRequestedPlugin(pluginId) && !configuredChannelIds.has(entry.id)) continue;
		setDownloadableInstallCandidate({
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
		if (!isRequestedPlugin(entry.pluginId) || params.blockedPluginIds?.has(entry.pluginId)) continue;
		setDownloadableInstallCandidate({
			pluginId: entry.pluginId,
			label: entry.label,
			install: entry.install,
			trustedSourceLinkedOfficialInstall: entry.origin === "bundled"
		});
	}
	for (const entry of listOfficialExternalPluginCatalogEntries()) {
		const pluginId = resolveOfficialExternalPluginId(entry);
		if (!pluginId || candidates.has(pluginId) || params.blockedPluginIds?.has(pluginId)) continue;
		if (!isRequestedPlugin(pluginId)) continue;
		const install = resolveOfficialExternalPluginInstall(entry);
		if (!install) continue;
		setDownloadableInstallCandidate({
			pluginId,
			label: resolveOfficialExternalPluginLabel(entry),
			install,
			trustedSourceLinkedOfficialInstall: true
		});
	}
	for (const entry of CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES) {
		if (!isRequestedPlugin(entry.pluginId) || params.blockedPluginIds?.has(entry.pluginId)) continue;
		const existing = candidates.get(entry.pluginId);
		if (existing && entry.versionBoundToOpenClaw) candidates.set(entry.pluginId, {
			...existing,
			versionBoundToOpenClaw: true
		});
		else if (!existing) candidates.set(entry.pluginId, entry);
	}
	return [...candidates.values()].toSorted((left, right) => left.pluginId.localeCompare(right.pluginId));
}
function collectUpdateDeferredPluginIds(params) {
	const pluginIds = new Set(params.configuredPluginIds);
	for (const candidate of collectDownloadableInstallCandidates({
		...params,
		missingPluginIds: /* @__PURE__ */ new Set()
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
function collectInstalledPluginIdsWithStaleVersionBoundRuntimePackages(params) {
	const pluginIds = /* @__PURE__ */ new Set();
	const currentVersion = normalizeOptionalLowercaseString(params.currentVersion);
	if (!currentVersion) return pluginIds;
	for (const candidate of CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES) {
		if (!VERSION_BOUND_RUNTIME_PLUGIN_IDS.has(candidate.pluginId) || !params.configuredPluginIds.has(candidate.pluginId)) continue;
		const record = params.installRecords[candidate.pluginId];
		if (!record) continue;
		const plugin = params.snapshot.byPluginId?.get(candidate.pluginId) ?? params.snapshot.plugins.find((entry) => entry.id === candidate.pluginId);
		const installedVersion = normalizeOptionalLowercaseString(record.resolvedVersion ?? record.version ?? plugin?.packageVersion ?? plugin?.version);
		if (!installedVersion) continue;
		const comparison = compareOpenClawReleaseVersions(installedVersion, currentVersion);
		if (comparison === null ? installedVersion !== currentVersion : comparison < 0) pluginIds.add(candidate.pluginId);
	}
	return pluginIds;
}
//#endregion
export { collectConfiguredChannelIds as a, collectConfiguredWebFetchPluginIds as c, collectBlockedPluginIds as i, collectConfiguredWebSearchPluginIds as l, collectUpdateDeferredPluginIds as n, collectConfiguredPluginIds as o, resolveConfiguredPluginInstallContext as r, collectConfiguredProviderPluginIds as s, collectDownloadableInstallCandidates as t };
