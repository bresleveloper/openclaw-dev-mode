import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as parseProviderModelRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-Bj8S5W5g.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as areBundledPluginsDisabled } from "./bundled-dir-BGJkK8G5.mjs";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { o as resolveBundledPluginScanDir } from "./bundled-plugin-scan-BXXDA_cr.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { l as findUninspectedPluginDiagnostic, t as discoverConfiguredPluginLoadPaths } from "./discovery-D_5mAUI7.mjs";
import { d as coerceDoctorSessionRouteStateOwners } from "./manifest-DHkEL08H.mjs";
import { t as resolvePluginDoctorContractArtifact } from "./doctor-contract-artifact-6DlZADc0.mjs";
import { n as loadBundledPluginManifestRegistry } from "./manifest-registry-build-BbQTPsvD.mjs";
import { n as unwrapDefaultModuleExport } from "./module-export-BbYMQUy2.mjs";
import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-CNXp9Fm5.mjs";
import { i as passesManifestOwnerBasePolicy, n as isActivatedManifestOwner } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { t as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./bundled-channel-config-metadata.generated-BMhosYMN.mjs";
import { t as discoverConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DPc05JSs.mjs";
import { t as definePluginDoctorMigrationFromPlans } from "./doctor-migration-plan-adapter-TVpF1vTR.mjs";
import { n as hasPluginConfigMigrationSource } from "./config-contract-matches-BX-jIwaa.mjs";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-ngXQhRsV.mjs";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-CHC0CCKR.mjs";
import "./plugin-registry-CVPVm6lt.mjs";
import { t as getPluginSetupModuleLoader } from "./plugin-setup-module-DjAZi3JK.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/doctor-compatibility-migration.ts
/** Compatibility hooks transform a private candidate; state migration admission stays separate. */
function applyPluginDoctorCompatibilityMigration(params) {
	const candidate = cloneConfigWithResolutionFacts(params.config);
	try {
		const mutation = params.normalize({ cfg: candidate });
		return mutation?.changes.length ? mutation : {
			config: params.config,
			changes: []
		};
	} catch (error) {
		return {
			config: params.config,
			changes: [],
			warnings: [`Plugin "${params.pluginId}" config repair failed: ${formatErrorMessage(error)}. Its config was preserved; run \`openclaw doctor --fix\` after repairing the plugin.`]
		};
	}
}
//#endregion
//#region src/channels/plugins/bundled-setup-policy.ts
function shouldIncludeChannelSetupFeatureForConfig(params) {
	if (!params.config) return true;
	const pluginId = params.plugin.id;
	if (!passesManifestOwnerBasePolicy({
		plugin: { id: pluginId },
		normalizedConfig: params.normalizedConfig,
		allowRestrictiveAllowlistBypass: true
	})) return false;
	let hasExplicitChannelDisable = false;
	for (const channelId of params.plugin.channels ?? [pluginId]) {
		const normalizedChannelId = normalizeOptionalLowercaseString(channelId);
		if (!normalizedChannelId) continue;
		const channelConfig = params.config.channels?.[normalizedChannelId];
		if (!channelConfig || typeof channelConfig !== "object" || Array.isArray(channelConfig)) continue;
		if (channelConfig.enabled === false) {
			hasExplicitChannelDisable = true;
			continue;
		}
		return true;
	}
	return !hasExplicitChannelDisable;
}
//#endregion
//#region src/plugins/doctor-contract-module.ts
function coerceLegacyConfigRules(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((entry) => {
		if (!entry || typeof entry !== "object") return false;
		const candidate = entry;
		return Array.isArray(candidate.path) && typeof candidate.message === "string";
	});
}
function coerceNormalizeCompatibilityConfig(value) {
	return typeof value === "function" ? value : void 0;
}
function coerceSessionStoreAgentIdsResolver(value) {
	return typeof value === "function" ? value : void 0;
}
function isPluginDoctorStateMigration(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return typeof candidate.id === "string" && candidate.id.trim().length > 0 && typeof candidate.label === "string" && candidate.label.trim().length > 0 && typeof candidate.detectLegacyState === "function" && typeof candidate.migrateLegacyState === "function";
}
function coercePluginDoctorStateMigrations(value) {
	if (!Array.isArray(value)) return [];
	return value.filter(isPluginDoctorStateMigration).map((migration) => ({
		id: migration.id.trim(),
		label: migration.label.trim(),
		doctorOnly: migration.doctorOnly === true ? true : void 0,
		phase: migration.phase === "after-session-repair" ? migration.phase : void 0,
		detectLegacyState: migration.detectLegacyState,
		migrateLegacyState: migration.migrateLegacyState
	}));
}
/** Coerce a loaded doctor contract once for both registry use and declaration validation. */
function coercePluginDoctorContractModule(mod) {
	const defaultExport = mod.default;
	const rules = coerceLegacyConfigRules(defaultExport?.legacyConfigRules ?? mod.legacyConfigRules);
	const normalizeCompatibilityConfig = coerceNormalizeCompatibilityConfig(mod.normalizeCompatibilityConfig ?? defaultExport?.normalizeCompatibilityConfig);
	const resolveSessionStoreAgentIds = coerceSessionStoreAgentIdsResolver(mod.resolveSessionStoreAgentIds ?? defaultExport?.resolveSessionStoreAgentIds);
	const sessionRouteStateOwners = coerceDoctorSessionRouteStateOwners(mod.sessionRouteStateOwners ?? defaultExport?.sessionRouteStateOwners);
	const stateMigrations = coercePluginDoctorStateMigrations(mod.stateMigrations ?? defaultExport?.stateMigrations);
	return {
		rules,
		normalizeCompatibilityConfig,
		resolveSessionStoreAgentIds,
		sessionRouteStateOwners,
		stateMigrations,
		summary: {
			configRepair: rules.length > 0 || Boolean(normalizeCompatibilityConfig),
			resolveSessionStoreAgentIds: Boolean(resolveSessionStoreAgentIds),
			sessionRouteStateOwners: sessionRouteStateOwners.length > 0,
			stateMigrations: stateMigrations.length > 0
		}
	};
}
//#endregion
//#region src/plugins/doctor-contract-registry-loader-state.ts
const pluginDoctorContractRegistryLoaderState = { moduleLoaderFactory: void 0 };
//#endregion
//#region src/plugins/doctor-contract-relevance.ts
function hasLegacyElevenLabsTalkFields(raw) {
	const talk = asNullableRecord(asNullableRecord(raw)?.talk);
	if (!talk) return false;
	return [
		"voiceId",
		"voiceAliases",
		"modelId",
		"outputFormat",
		"apiKey"
	].some((key) => Object.hasOwn(talk, key));
}
function collectMediaProviderIds(root, ids) {
	const media = asNullableRecord(asNullableRecord(root.tools)?.media);
	if (!media) return;
	const modelLists = [
		media.models,
		asNullableRecord(media.audio)?.models,
		asNullableRecord(media.image)?.models,
		asNullableRecord(media.video)?.models
	];
	for (const models of modelLists) {
		if (!Array.isArray(models)) continue;
		for (const model of models) {
			const provider = asNullableRecord(model)?.provider;
			if (typeof provider === "string" && provider.trim()) ids.add(normalizeProviderId(provider));
		}
	}
}
function collectConfiguredModelProviderIds(params) {
	const addRef = (value) => {
		const parsed = typeof value === "string" ? parseProviderModelRef(value) : null;
		if (parsed) params.ids.add(normalizeProviderId(parsed.provider));
	};
	for (const ref of collectConfiguredModelRefs(params.root)) addRef(ref.value);
	const collectAgentPolicy = (value) => {
		const allow = asNullableRecord(asNullableRecord(value)?.modelPolicy)?.allow;
		if (Array.isArray(allow)) allow.forEach(addRef);
	};
	const agents = asNullableRecord(params.root.agents) ?? {};
	collectAgentPolicy(agents.defaults);
	if (Object.hasOwn(agents, "entries")) {
		const entries = asNullableRecord(agents.entries);
		if (entries) Object.values(entries).forEach(collectAgentPolicy);
	} else if (Array.isArray(agents.list)) agents.list.forEach(collectAgentPolicy);
}
function collectRelevantDoctorPluginIds(raw) {
	const ids = /* @__PURE__ */ new Set();
	const root = asNullableRecord(raw);
	if (!root) return [];
	const channels = asNullableRecord(root.channels);
	if (channels) for (const rawChannelId of Object.keys(channels)) {
		const channelId = rawChannelId.trim();
		if (channelId && !isChannelConfigMetadataKey(channelId)) ids.add(channelId);
	}
	const pluginsEntries = asNullableRecord(asNullableRecord(root.plugins)?.entries);
	if (pluginsEntries) for (const pluginId of Object.keys(pluginsEntries)) ids.add(pluginId);
	const modelProviders = asNullableRecord(asNullableRecord(root.models)?.providers);
	if (modelProviders) for (const providerId of Object.keys(modelProviders)) ids.add(providerId);
	collectMediaProviderIds(root, ids);
	collectConfiguredModelProviderIds({
		root,
		ids
	});
	if (hasLegacyElevenLabsTalkFields(root)) ids.add("elevenlabs");
	return [...ids].toSorted();
}
function collectRelevantDoctorPluginIdsForTouchedPaths(params) {
	const root = asNullableRecord(params.raw);
	if (!root) return [];
	const ids = /* @__PURE__ */ new Set();
	collectConfiguredModelProviderIds({
		root,
		ids
	});
	for (const touchedPath of params.touchedPaths) {
		const [first, second, third] = touchedPath;
		if (first === "channels") {
			if (!second) return collectRelevantDoctorPluginIds(params.raw);
			const channelId = second.trim();
			if (channelId && !isChannelConfigMetadataKey(channelId)) ids.add(channelId);
			continue;
		}
		if (first === "plugins") {
			if (second !== "entries" || !third) return collectRelevantDoctorPluginIds(params.raw);
			ids.add(third);
			continue;
		}
		if (first === "models") {
			if (second !== "providers" || !third) return collectRelevantDoctorPluginIds(params.raw);
			ids.add(third);
			continue;
		}
		if (first === "tools" && second === "media") {
			collectMediaProviderIds(root, ids);
			continue;
		}
		if (first === "talk" && hasLegacyElevenLabsTalkFields(root)) ids.add("elevenlabs");
	}
	return [...ids].toSorted();
}
//#endregion
//#region src/plugins/doctor-contract-registry.ts
const log = createSubsystemLogger("plugins/doctor-contracts");
const deferredPluginMigrations = new AsyncLocalStorage();
/** A prepared Doctor generation excludes unavailable owners from every migration surface. */
function withDeferredPluginDoctorMigrations(pluginIds, run) {
	return deferredPluginMigrations.run(new Set(pluginIds), run);
}
function isPluginDoctorMigrationDeferred(pluginId) {
	return deferredPluginMigrations.getStore()?.has(pluginId) === true;
}
function declaresPluginDoctorContractSurface(declaration, surface) {
	const value = declaration?.[surface];
	return value === true || surface === "stateMigrations" && Array.isArray(value);
}
function isTrustedForDurableStores(record) {
	return record.origin === "bundled" || record.trustedOfficialInstall === true;
}
function loadPluginDoctorContractModule(modulePath) {
	return getCachedPluginModuleLoader({
		modulePath,
		importerUrl: import.meta.url,
		...pluginDoctorContractRegistryLoaderState.moduleLoaderFactory ? { createLoader: pluginDoctorContractRegistryLoaderState.moduleLoaderFactory } : {}
	})(modulePath);
}
function hasScopedProviderAuthAlias(record, scopedProviderIds) {
	return Object.entries(record.providerAuthAliases ?? {}).some(([rawAlias, rawTarget]) => {
		if (typeof rawTarget !== "string") return false;
		const target = normalizeProviderId(rawTarget);
		return scopedProviderIds.has(normalizeProviderId(rawAlias)) && target !== "" && record.providers.some((providerId) => normalizeProviderId(providerId) === target);
	});
}
/** Include manifest-owned legacy roots for config repair, never session ownership. */
function collectDoctorConfigRepairPluginIds(raw, touchedPaths) {
	const config = asNullableRecord(raw);
	if (!config) return [];
	const ids = new Set(touchedPaths ? collectRelevantDoctorPluginIdsForTouchedPaths({
		raw,
		touchedPaths
	}) : collectRelevantDoctorPluginIds(raw));
	const registry = loadPluginManifestRegistryForPluginRegistry({
		config,
		includeDisabled: true
	});
	for (const plugin of registry.plugins) if (hasPluginConfigMigrationSource({
		root: raw,
		pathPatterns: plugin.configContracts?.compatibilityMigrationPaths,
		touchedPaths
	})) ids.add(plugin.id);
	return [...ids].toSorted();
}
function loadPluginDoctorContractEntry(record, surface) {
	if (isPluginDoctorMigrationDeferred(record.id)) return null;
	const declaration = record.doctorContract;
	if (declaration && !declaresPluginDoctorContractSurface(declaration, surface)) return null;
	const contractArtifact = resolvePluginDoctorContractArtifact(record);
	if (!contractArtifact) return null;
	let mod;
	try {
		mod = loadPluginDoctorContractModule(contractArtifact.modulePath);
	} catch (error) {
		log.warn(`failed to load doctor contract for ${record.id} from ${contractArtifact.modulePath}: ${formatErrorMessage(error)}`);
		return null;
	}
	const { summary, ...contract } = coercePluginDoctorContractModule(mod);
	if (!Object.values(summary).some(Boolean) && surface !== "stateMigrations") return null;
	return {
		pluginId: record.id,
		...contract
	};
}
function resolvePluginDoctorManifestRecords(params) {
	if (params?.pluginIds && params.pluginIds.length === 0) return [];
	return filterPluginDoctorRecordsByScope(loadPluginManifestRegistryForPluginRegistry({
		config: params?.config,
		workspaceDir: params?.workspaceDir,
		env: params.env ?? process.env,
		includeDisabled: true,
		artifactPreservingReadOnly: params.artifactPreservingReadOnly
	}).plugins, params.pluginIds);
}
function filterPluginDoctorRecordsByScope(records, pluginIds) {
	const scopedPluginIds = pluginIds ? new Set(pluginIds) : null;
	const scopedProviderIds = pluginIds ? new Set(pluginIds.map(normalizeProviderId).filter(Boolean)) : null;
	return records.filter((record) => !deferredPluginMigrations.getStore()?.has(record.id) && !(scopedPluginIds && !scopedPluginIds.has(record.id) && !(record.packageName && scopedPluginIds.has(record.packageName)) && !record.legacyPluginIds?.some((pluginId) => scopedPluginIds.has(pluginId)) && !record.channels.some((channelId) => scopedPluginIds.has(channelId)) && !record.providers.some((providerId) => scopedPluginIds.has(providerId)) && !(scopedProviderIds && hasScopedProviderAuthAlias(record, scopedProviderIds))));
}
function resolvePluginDoctorContracts(params) {
	const loadPaths = params.config?.plugins?.load?.paths ?? [];
	if (params.surface === "configRepair" && loadPaths.length > 0) {
		const warning = findUninspectedPluginDiagnostic(discoverConfiguredPluginLoadPaths({
			loadPaths,
			env: params.env
		}).diagnostics);
		if (warning) {
			log.warn(warning.message);
			return [];
		}
	}
	const records = resolvePluginDoctorManifestRecords(params);
	const entries = loadPluginDoctorContractEntries({
		records,
		surface: params.surface
	});
	if (params.surface !== "configRepair") return entries;
	const ownedChannels = new Set(records.flatMap((record) => record.channels));
	const installedPluginIds = new Set(records.map((record) => record.id));
	for (const { channelId, pluginId } of GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA) {
		if (deferredPluginMigrations.getStore()?.has(pluginId) || !Object.hasOwn(params.config?.channels ?? {}, channelId) && !Object.hasOwn(params.config?.plugins?.entries ?? {}, pluginId) || ownedChannels.has(channelId) || installedPluginIds.has(pluginId) || params.pluginIds && !params.pluginIds.includes(channelId) && !params.pluginIds.includes(pluginId)) continue;
		const mod = loadBundledPluginPublicArtifactModuleFromCandidatesSync({
			dirName: channelId,
			artifactCandidates: ["config-doctor-api.js"],
			env: params.env
		});
		if (!mod) continue;
		const { summary: _summary, ...contract } = coercePluginDoctorContractModule(mod);
		entries.push({
			pluginId,
			...contract
		});
	}
	return entries;
}
function loadPluginDoctorContractEntries(params) {
	return params.records.flatMap((record) => {
		const entry = loadPluginDoctorContractEntry(record, params.surface);
		return entry ? [entry] : [];
	});
}
function listPluginDoctorLegacyConfigRules(params) {
	return resolvePluginDoctorContracts({
		...params,
		surface: "configRepair"
	}).flatMap((entry) => entry.rules);
}
function listPluginDoctorSessionRouteStateOwners(params) {
	const owners = /* @__PURE__ */ new Map();
	const records = resolvePluginDoctorManifestRecords(params ?? {});
	const manifestOwners = records.flatMap((record) => record.sessionRouteStateOwners ?? []);
	const legacyModuleOwners = loadPluginDoctorContractEntries({
		records: records.filter((record) => record.sessionRouteStateOwners === void 0),
		surface: "sessionRouteStateOwners"
	}).flatMap((entry) => entry.sessionRouteStateOwners);
	for (const owner of [...manifestOwners, ...legacyModuleOwners]) if (!owners.has(owner.id)) owners.set(owner.id, owner);
	return [...owners.values()].toSorted((left, right) => left.id.localeCompare(right.id));
}
/** Resolve plugin-owned agent IDs whose core session stores need migration. */
function listPluginDoctorSessionStoreAgentIds(params) {
	const cfg = params?.config ?? {};
	const agentIds = /* @__PURE__ */ new Set();
	for (const entry of resolvePluginDoctorContracts({
		...params,
		surface: "resolveSessionStoreAgentIds"
	})) {
		let resolved;
		try {
			resolved = entry.resolveSessionStoreAgentIds?.({ cfg });
		} catch {
			continue;
		}
		for (const agentId of normalizeTrimmedStringList(resolved)) agentIds.add(agentId);
	}
	return [...agentIds].toSorted();
}
function loadLegacyChannelStateMigrationDetector(record, onInspectedStatelessPlugin) {
	const source = record.setupSource;
	if (!source) return null;
	try {
		const moduleLoader = getPluginSetupModuleLoader(record, source, record.rootDir);
		return moduleLoader.initialize(() => {
			const entry = unwrapDefaultModuleExport(moduleLoader(source));
			if (entry?.kind !== "bundled-channel-setup-entry" || typeof entry.loadSetupPlugin !== "function") return null;
			if (typeof entry.loadLegacyStateMigrationDetector === "function") {
				const directDetector = entry.loadLegacyStateMigrationDetector();
				if (typeof directDetector !== "function") throw new Error(`Plugin ${record.id} legacy migration loader did not return a detector.`);
				return directDetector;
			}
			if (entry.features?.legacyStateMigrations !== true) {
				onInspectedStatelessPlugin?.(record.id);
				return null;
			}
			const lifecycleDetector = entry.loadSetupPlugin().lifecycle?.detectLegacyStateMigrations;
			return typeof lifecycleDetector === "function" ? lifecycleDetector : null;
		});
	} catch (error) {
		log.warn(`failed to load legacy state migration for ${record.id} from ${record.setupSource}: ${formatErrorMessage(error)}`);
		return null;
	}
}
var PluginDoctorStateMigrationDeclarationError = class extends Error {};
function listPluginDoctorStateMigrationEntries(params) {
	return loadPluginDoctorStateMigrationEntries(resolvePluginDoctorStateMigrationRecords(params ?? {}), params?.validateDeclarations, params?.onInspectedPlugin, params?.onInspectedStatelessPlugin);
}
function loadPluginDoctorStateMigrationEntries(records, validateDeclarations = true, onInspectedPlugin, onInspectedStatelessPlugin) {
	const entries = [];
	for (const record of records) {
		const modern = loadPluginDoctorContractEntry(record, "stateMigrations");
		const declaration = record.doctorContract?.stateMigrations;
		const migrations = modern?.stateMigrations ?? [];
		if (validateDeclarations && Array.isArray(declaration) && (declaration.length !== migrations.length || declaration.some((action, index) => {
			const migration = migrations[index];
			return action.id !== migration?.id || action.doctorOnly === true !== (migration?.doctorOnly === true) || action.phase !== migration?.phase;
		}))) throw new PluginDoctorStateMigrationDeclarationError(`Refused plugin migrations that do not match the immutable action order and authority declared by ${record.id}.`);
		if (modern?.stateMigrations.length) {
			onInspectedPlugin?.(record.id);
			for (const migration of modern.stateMigrations) entries.push({
				pluginId: modern.pluginId,
				channelIds: record.channels,
				trustedForDurableStores: isTrustedForDurableStores(record),
				migration
			});
			continue;
		}
		if (declaresPluginDoctorContractSurface(record.doctorContract, "stateMigrations")) {
			if (modern && Array.isArray(declaration) && declaration.length === 0) onInspectedStatelessPlugin?.(record.id);
			continue;
		}
		if (record.channels.length === 0 || record.origin === "bundled") {
			if (modern) onInspectedStatelessPlugin?.(record.id);
			continue;
		}
		const detector = loadLegacyChannelStateMigrationDetector(record, onInspectedStatelessPlugin);
		if (!detector) {
			if (modern && !record.setupSource) onInspectedStatelessPlugin?.(record.id);
			continue;
		}
		onInspectedPlugin?.(record.id);
		entries.push({
			pluginId: record.id,
			channelIds: record.channels,
			trustedForDurableStores: isTrustedForDurableStores(record),
			migration: definePluginDoctorMigrationFromPlans({
				id: `${record.id}-legacy-channel-state`,
				label: `${record.id} legacy channel state`,
				resolvePlans: detector
			})
		});
	}
	return entries;
}
function resolvePluginDoctorStateMigrationRecords(params) {
	if (params.pluginIds?.length === 0) return [];
	return filterPluginDoctorStateMigrationRecords(filterPluginDoctorRecordsByScope(discoverConfigWidePluginManifestRegistry(params).plugins, params.pluginIds), params.config);
}
function filterPluginDoctorStateMigrationRecords(candidates, config) {
	const records = [];
	const normalizedConfig = normalizePluginsConfig(config?.plugins);
	for (const record of candidates) {
		if (deferredPluginMigrations.getStore()?.has(record.id)) continue;
		if (record.channels.length > 0 && !shouldIncludeChannelSetupFeatureForConfig({
			plugin: record,
			config,
			normalizedConfig
		})) continue;
		if (record.origin !== "bundled" && !isActivatedManifestOwner({
			plugin: record,
			normalizedConfig,
			rootConfig: config
		})) continue;
		records.push(record);
	}
	return records.toSorted((left, right) => left.id.localeCompare(right.id));
}
/**
* Read candidate-bundled migration identities without importing Doctor contract modules.
* Installed plugin artifacts are outside the candidate and copied-state identity boundary;
* candidate staging must bind them before their descriptors can authorize execution.
*/
function listPluginDoctorStateMigrationInventory(params) {
	const knownPluginIds = [];
	const sessionStoreOwnerPluginIds = [];
	const descriptors = [];
	const unresolvedPluginIds = [];
	const candidateBundledRoot = params?.candidateRoot ? resolveBundledPluginScanDir({
		packageRoot: path.resolve(params.candidateRoot),
		runningFromBuiltArtifact: true
	}) : void 0;
	const bundled = params?.candidateRoot ? candidateBundledRoot && !areBundledPluginsDisabled(params.env) ? loadBundledPluginManifestRegistry({
		env: {
			...params.env,
			OPENCLAW_DISABLE_BUNDLED_SOURCE_OVERLAYS: "1"
		},
		bundledRoot: candidateBundledRoot
	}).plugins : [] : loadBundledPluginManifestRegistry({ env: params?.env }).plugins;
	knownPluginIds.push(...bundled.map((record) => record.id));
	for (const record of filterPluginDoctorStateMigrationRecords(bundled, params?.config)) {
		if (record.doctorContract?.resolveSessionStoreAgentIds === true) sessionStoreOwnerPluginIds.push(record.id);
		const declaration = record.doctorContract?.stateMigrations;
		if (Array.isArray(declaration)) {
			descriptors.push(...declaration.map((migration) => Object.assign({ pluginId: record.id }, migration)));
			continue;
		}
		if (declaration === true || record.channels.length > 0 && record.origin !== "bundled") unresolvedPluginIds.push(record.id);
	}
	return {
		knownPluginIds,
		sessionStoreOwnerPluginIds,
		descriptors,
		unresolvedPluginIds
	};
}
/** Resolve the bundled action inventory plus every configured owner that is not identity-bound. */
function resolvePluginDoctorStateMigrationInventory(params) {
	const inventory = listPluginDoctorStateMigrationInventory(params);
	const hasConfiguredLoadPaths = params.config.plugins?.load?.paths?.some((entry) => entry.trim().length > 0) === true;
	let externallySelectedPluginIds = /* @__PURE__ */ new Set();
	try {
		externallySelectedPluginIds = new Set(resolvePluginDoctorManifestRecords(params).filter((record) => record.origin !== "bundled").map((record) => record.id));
	} catch {}
	const relevantPluginIds = collectRelevantDoctorPluginIds(params.config);
	const knownPluginIds = inventory.knownPluginIds.filter((pluginId) => !externallySelectedPluginIds.has(pluginId));
	const sessionStoreOwnerPluginIds = inventory.sessionStoreOwnerPluginIds.filter((pluginId) => !externallySelectedPluginIds.has(pluginId));
	const descriptors = inventory.descriptors.filter((descriptor) => !externallySelectedPluginIds.has(descriptor.pluginId));
	const describedPluginIds = /* @__PURE__ */ new Set([
		...knownPluginIds,
		...descriptors.map((descriptor) => descriptor.pluginId),
		...inventory.unresolvedPluginIds
	]);
	const unresolvedPluginIds = [
		...inventory.unresolvedPluginIds,
		...externallySelectedPluginIds,
		...relevantPluginIds.filter((pluginId) => !describedPluginIds.has(pluginId))
	];
	if (hasConfiguredLoadPaths) unresolvedPluginIds.push("configured-load-paths");
	return {
		knownPluginIds,
		sessionStoreOwnerPluginIds,
		descriptors,
		unresolvedPluginIds: [...new Set(unresolvedPluginIds)].toSorted()
	};
}
/** Freeze the live registry's selected migration actions before state mutation. */
function resolveLivePluginDoctorStateMigrationInventory(params) {
	const bundledInventory = listPluginDoctorStateMigrationInventory(params);
	let records;
	try {
		records = resolvePluginDoctorStateMigrationRecords({
			...params,
			artifactPreservingReadOnly: true
		});
	} catch (error) {
		return {
			...bundledInventory,
			unresolvedPluginIds: [],
			resolutionFailure: {
				code: "plugin-inventory-unavailable",
				message: `Could not resolve live plugin migration inventory: ${formatErrorMessage(error)}`
			}
		};
	}
	const descriptors = [];
	for (const record of records) {
		const declaration = record.doctorContract?.stateMigrations;
		if (Array.isArray(declaration)) {
			descriptors.push(...declaration.map((migration) => Object.assign({ pluginId: record.id }, migration)));
			continue;
		}
		descriptors.push(...loadPluginDoctorStateMigrationEntries([record]).map(({ pluginId, migration }) => Object.assign({
			pluginId,
			id: migration.id
		}, migration.doctorOnly === true ? { doctorOnly: true } : {}, migration.phase === "after-session-repair" ? { phase: migration.phase } : {})));
	}
	return {
		knownPluginIds: [.../* @__PURE__ */ new Set([...bundledInventory.knownPluginIds, ...records.map((r) => r.id)])],
		sessionStoreOwnerPluginIds: records.filter((record) => record.doctorContract?.resolveSessionStoreAgentIds === true).map((record) => record.id),
		descriptors,
		unresolvedPluginIds: []
	};
}
function applyPluginDoctorCompatibilityMigrations(cfg, params) {
	let nextCfg = cfg;
	const changes = [];
	const warnings = [];
	for (const entry of resolvePluginDoctorContracts({
		...params,
		config: params?.config ?? cfg,
		surface: "configRepair"
	})) {
		if (!entry.normalizeCompatibilityConfig) continue;
		const mutation = applyPluginDoctorCompatibilityMigration({
			pluginId: entry.pluginId,
			config: nextCfg,
			normalize: entry.normalizeCompatibilityConfig
		});
		nextCfg = mutation.config;
		changes.push(...mutation.changes);
		warnings.push(...mutation.warnings ?? []);
	}
	return {
		config: nextCfg,
		changes,
		...warnings.length ? { warnings } : {}
	};
}
//#endregion
export { listPluginDoctorLegacyConfigRules as a, listPluginDoctorStateMigrationEntries as c, withDeferredPluginDoctorMigrations as d, collectRelevantDoctorPluginIds as f, isPluginDoctorMigrationDeferred as i, resolveLivePluginDoctorStateMigrationInventory as l, applyPluginDoctorCompatibilityMigration as m, applyPluginDoctorCompatibilityMigrations as n, listPluginDoctorSessionRouteStateOwners as o, shouldIncludeChannelSetupFeatureForConfig as p, collectDoctorConfigRepairPluginIds as r, listPluginDoctorSessionStoreAgentIds as s, PluginDoctorStateMigrationDeclarationError as t, resolvePluginDoctorStateMigrationInventory as u };
