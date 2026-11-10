import { A as PluginDependencyLinkError } from "./plugin-cache-BbahpD-b.mjs";
import { i as asOptionalObjectRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { Fn as object, Jn as string, Nt as array, Pn as number, xn as literal } from "./schemas-BOYIvvln.mjs";
import { r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { P as collectConfiguredModelRefs } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as parseProviderModelRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { a as withPluginSourceCaptureStorage } from "./plugin-source-capture-context-BeR5LVZ8.mjs";
import { i as coerceDoctorSessionRouteStateOwners } from "./manifest-gUPkNRN0.mjs";
import { t as areBundledPluginsDisabled } from "./bundled-dir-LfC_CFuw.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { t as discoverConfiguredPluginLoadPaths } from "./discovery-B5pUUvVG.mjs";
import { n as findUninspectedPluginDiagnostic } from "./discovery-availability-CEoTdFoo.mjs";
import { t as resolvePluginDoctorContractArtifact } from "./doctor-contract-artifact-CkzDe3D_.mjs";
import { n as loadBundledPluginManifestRegistry } from "./manifest-registry-build-r3_ZeucU.mjs";
import { t as discoverConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DeOUS5WQ.mjs";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.mjs";
import { n as isActivatedManifestOwner } from "./manifest-owner-policy-Dq1F0Dcx.mjs";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-BDlJJbko.mjs";
import { n as hasPluginConfigMigrationSource } from "./config-contract-matches-CYadf-lt.mjs";
import { t as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./bundled-channel-config-metadata.generated-C6coO7KH.mjs";
import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-Dmwzhxit.mjs";
import { a as resolveBundledPluginScanDir } from "./bundled-plugin-scan-DAfwXJuI.mjs";
import { t as getPluginSetupModuleLoader } from "./plugin-setup-module-B4MiOXOl.mjs";
import { n as unwrapDefaultModuleExport } from "./module-export-BbYMQUy2.mjs";
import { n as applyResolvedPluginDoctorCompatibilityMigrations } from "./doctor-compatibility-migration-B2hBndkx.mjs";
import "./plugin-registry-BKRXR0Si.mjs";
import { a as resolveSetupChannelRegistration, t as channelPluginIdBelongsToManifest } from "./loader-channel-setup-_ipy9Zx8.mjs";
import { t as shouldIncludeChannelSetupFeatureForConfig } from "./bundled-setup-policy-Br7Jvdie.mjs";
import { t as definePluginDoctorMigrationFromPlans } from "./doctor-migration-plan-adapter-CQ61Kl01.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/doctor-contract-legacy-setup.ts
const log$1 = createSubsystemLogger("plugins/doctor-contracts");
function loadLegacyChannelStateMigrationDetector(record, onInspectedStatelessPlugin) {
	const source = record.setupSource;
	if (!source) return null;
	try {
		const moduleLoader = getPluginSetupModuleLoader(record, source, record.rootDir);
		return moduleLoader.initialize(() => {
			const entry = unwrapDefaultModuleExport(moduleLoader(source));
			if (entry?.kind !== "bundled-channel-setup-entry") {
				const { plugin } = resolveSetupChannelRegistration(entry);
				if (!plugin?.id || !channelPluginIdBelongsToManifest({
					channelId: plugin.id,
					pluginId: record.id,
					manifestChannels: record.channels
				})) return null;
				const detector = plugin.lifecycle?.detectLegacyStateMigrations;
				if (detector === void 0) return null;
				if (typeof detector !== "function") throw new Error(`Plugin ${record.id} legacy migration detector is not a function.`);
				return detector;
			}
			if (typeof entry.loadSetupPlugin !== "function") return null;
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
		log$1.warn(`failed to load legacy state migration for ${record.id} from ${record.setupSource}: ${formatErrorMessage(error)}`);
		return null;
	}
}
//#endregion
//#region src/plugins/doctor-contract-module.ts
function coerceLegacyConfigRules(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((entry) => {
		const candidate = asOptionalObjectRecord(entry);
		return Array.isArray(candidate?.path) && typeof candidate?.message === "string";
	});
}
function coerceNormalizeCompatibilityConfig(value) {
	return typeof value === "function" ? value : void 0;
}
function coerceSessionStoreAgentIdsResolver(value) {
	return typeof value === "function" ? value : void 0;
}
function isPluginDoctorStateMigration(value) {
	const candidate = asOptionalObjectRecord(value);
	return typeof candidate?.id === "string" && candidate.id.trim().length > 0 && typeof candidate.label === "string" && candidate.label.trim().length > 0 && typeof candidate.detectLegacyState === "function" && typeof candidate.migrateLegacyState === "function";
}
function coercePluginDoctorStateMigrations(value) {
	if (!Array.isArray(value)) return [];
	return value.filter(isPluginDoctorStateMigration).map((migration) => ({
		id: migration.id.trim(),
		label: migration.label.trim(),
		doctorOnly: migration.doctorOnly === true ? true : void 0,
		phase: migration.phase === "after-session-repair" ? migration.phase : void 0,
		collectBackupResources: migration.collectBackupResources,
		detectLegacyState: migration.detectLegacyState,
		migrateLegacyState: migration.migrateLegacyState
	}));
}
function coerceProviderRenames(value) {
	return array(object({
		from: string().regex(/^[a-z0-9][a-z0-9._-]*$/),
		to: string().regex(/^[a-z0-9][a-z0-9._-]*$/),
		baseUrl: string().url()
	}).refine(({ from, to }) => from !== to)).parse(value ?? []);
}
/** Coerce a loaded doctor contract once for both registry use and declaration validation. */
function coercePluginDoctorContractModule(mod, allowedChannels) {
	const defaultExport = mod.default;
	const historicalWebhookListener = object({
		channelId: string().trim().min(1).refine((id) => !allowedChannels || allowedChannels.includes(id), "Historical webhook listener channel must belong to the plugin"),
		port: number().int().min(1).max(65535),
		host: string().trim().min(1).optional(),
		preserveAuthoredActivation: literal(true).optional()
	}).optional().parse(mod.historicalWebhookListener === void 0 ? defaultExport?.historicalWebhookListener : mod.historicalWebhookListener);
	const rules = coerceLegacyConfigRules(defaultExport?.legacyConfigRules ?? mod.legacyConfigRules);
	const normalizeCompatibilityConfig = coerceNormalizeCompatibilityConfig(mod.normalizeCompatibilityConfig ?? defaultExport?.normalizeCompatibilityConfig);
	const normalizeHistoricalWebhookConfig = coerceNormalizeCompatibilityConfig(mod.normalizeHistoricalWebhookConfig ?? defaultExport?.normalizeHistoricalWebhookConfig);
	const resolveSessionStoreAgentIds = coerceSessionStoreAgentIdsResolver(mod.resolveSessionStoreAgentIds ?? defaultExport?.resolveSessionStoreAgentIds);
	const sessionRouteStateOwners = coerceDoctorSessionRouteStateOwners(mod.sessionRouteStateOwners ?? defaultExport?.sessionRouteStateOwners);
	const stateMigrations = coercePluginDoctorStateMigrations(mod.stateMigrations ?? defaultExport?.stateMigrations);
	const providerRenames = coerceProviderRenames(mod.providerRenames ?? defaultExport?.providerRenames);
	return {
		historicalWebhookListener,
		normalizeHistoricalWebhookConfig,
		rules,
		normalizeCompatibilityConfig,
		providerRenames,
		resolveSessionStoreAgentIds,
		sessionRouteStateOwners,
		stateMigrations,
		summary: {
			configRepair: rules.length > 0 || Boolean(normalizeCompatibilityConfig) || providerRenames.length > 0,
			resolveSessionStoreAgentIds: Boolean(resolveSessionStoreAgentIds),
			sessionRouteStateOwners: sessionRouteStateOwners.length > 0,
			stateMigrations: stateMigrations.length > 0
		}
	};
}
//#endregion
//#region src/plugins/doctor-contract-relevance.ts
function hasScopedProviderAuthAlias(record, scopedProviderIds) {
	return Object.entries(record.providerAuthAliases ?? {}).some(([rawAlias, rawTarget]) => {
		if (typeof rawTarget !== "string") return false;
		const target = normalizeProviderId(rawTarget);
		return scopedProviderIds.has(normalizeProviderId(rawAlias)) && target !== "" && record.providers.some((providerId) => normalizeProviderId(providerId) === target);
	});
}
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
		if (first === "plugins" || first === "models") {
			if (second !== (first === "plugins" ? "entries" : "providers") || !third) return collectRelevantDoctorPluginIds(params.raw);
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
/** Defer unavailable plugin repairs while retaining host-owned historical listener facts. */
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
	const declaration = record.doctorContract;
	if (declaration && !declaresPluginDoctorContractSurface(declaration, surface)) return null;
	const contractArtifact = resolvePluginDoctorContractArtifact(record);
	if (!contractArtifact) return null;
	try {
		const loader = getPluginSetupModuleLoader(record, contractArtifact.modulePath, contractArtifact.boundaryRoot);
		const { summary, ...contract } = loader.initialize(() => coercePluginDoctorContractModule(loader(contractArtifact.modulePath), record.channels));
		if (contract.providerRenames.some(({ from, to }) => !record.providers.includes(from) || !record.providers.includes(to))) throw new Error("Provider renames must belong to the plugin's declared providers.");
		if (!Object.values(summary).some(Boolean) && surface !== "stateMigrations") return null;
		return {
			pluginId: record.id,
			...contract,
			origin: record.origin
		};
	} catch (error) {
		log.warn(`failed to load doctor contract for ${record.id} from ${contractArtifact.modulePath}: ${formatErrorMessage(error)}`);
		return error instanceof PluginDependencyLinkError ? error : null;
	}
}
function resolvePluginDoctorManifestRecords(params, includeDeferred = false) {
	if (params?.pluginIds && params.pluginIds.length === 0) return [];
	return filterPluginDoctorRecordsByScope((params.manifestRegistry ?? loadPluginManifestRegistryForPluginRegistry({
		config: params?.config,
		workspaceDir: params?.workspaceDir,
		env: params.env ?? process.env,
		includeDisabled: true,
		artifactPreservingReadOnly: params.artifactPreservingReadOnly
	})).plugins, params.pluginIds, includeDeferred);
}
function filterPluginDoctorRecordsByScope(records, pluginIds, includeDeferred = false) {
	const scopedPluginIds = pluginIds ? new Set(pluginIds) : null;
	const scopedProviderIds = pluginIds ? new Set(pluginIds.map(normalizeProviderId).filter(Boolean)) : null;
	return records.filter((record) => (includeDeferred || !isPluginDoctorMigrationDeferred(record.id)) && !(scopedPluginIds && !scopedPluginIds.has(record.id) && !(record.packageName && scopedPluginIds.has(record.packageName)) && !record.legacyPluginIds?.some((pluginId) => scopedPluginIds.has(pluginId)) && !record.channels.some((channelId) => scopedPluginIds.has(channelId)) && !record.providers.some((providerId) => scopedPluginIds.has(providerId)) && !(scopedProviderIds && hasScopedProviderAuthAlias(record, scopedProviderIds))));
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
	const includeDeferred = params.surface === "configRepair";
	const records = resolvePluginDoctorManifestRecords(params, includeDeferred);
	const entries = loadPluginDoctorContractEntries({
		records: includeDeferred ? records.filter((record) => !isPluginDoctorMigrationDeferred(record.id)) : records,
		surface: params.surface
	});
	if (params.surface !== "configRepair") return entries;
	for (const { channelId, pluginId } of GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA) {
		const owner = records.find((record) => record.id === pluginId || record.channels.includes(channelId));
		const supplement = params.historicalWebhookListeners && owner?.id === pluginId && owner.trustedOfficialInstall === true ? entries.find((entry) => entry.pluginId === pluginId && !entry.historicalWebhookListener) : void 0;
		const deferredOfficialOwner = params.historicalWebhookListeners && owner?.id === pluginId && owner.trustedOfficialInstall === true && isPluginDoctorMigrationDeferred(pluginId);
		if (isPluginDoctorMigrationDeferred(pluginId) && !params.historicalWebhookListeners || !params.historicalWebhookListeners && !Object.hasOwn(params.config?.channels ?? {}, channelId) && !Object.hasOwn(params.config?.plugins?.entries ?? {}, pluginId) || owner && !supplement && !deferredOfficialOwner || params.pluginIds && !params.pluginIds.includes(channelId) && !params.pluginIds.includes(pluginId)) continue;
		const mod = loadBundledPluginPublicArtifactModuleFromCandidatesSync({
			dirName: channelId,
			artifactCandidates: ["config-doctor-api.js"],
			env: params.env
		});
		if (!mod) continue;
		const { summary: _summary, ...contract } = coercePluginDoctorContractModule(mod, [channelId]);
		if (supplement && contract.historicalWebhookListener && contract.normalizeCompatibilityConfig) {
			supplement.historicalWebhookListener = contract.historicalWebhookListener;
			supplement.historicalWebhookNormalizer = contract.normalizeCompatibilityConfig;
		} else if (!owner || deferredOfficialOwner) {
			if (isPluginDoctorMigrationDeferred(pluginId)) {
				const normalize = contract.normalizeHistoricalWebhookConfig;
				if (!contract.historicalWebhookListener || !normalize) continue;
				entries.push({
					pluginId,
					...contract,
					origin: owner?.origin ?? "bundled",
					rules: [],
					providerRenames: [],
					normalizeCompatibilityConfig: normalize
				});
			} else entries.push({
				pluginId,
				...contract,
				providerRenames: [],
				origin: "bundled"
			});
		}
	}
	return entries;
}
function loadPluginDoctorContractEntries(params) {
	return params.records.flatMap((record) => {
		const entry = loadPluginDoctorContractEntry(record, params.surface);
		return entry && !(entry instanceof PluginDependencyLinkError) ? [entry] : [];
	});
}
function listPluginDoctorLegacyConfigRules(params) {
	return (params?.activeOnly ? loadPluginDoctorContractEntries({
		records: resolvePluginDoctorStateMigrationRecords(params),
		surface: "configRepair"
	}) : resolvePluginDoctorContracts({
		...params,
		surface: "configRepair"
	})).flatMap((entry) => entry.rules);
}
/** Resolve only the selected config-repair owners, including their deferral policy. */
function resolvePluginDoctorProviderRenames(params) {
	return resolvePluginDoctorContracts({
		...params,
		pluginIds: params.pluginIds ?? collectRelevantDoctorPluginIds(params.config ?? {}),
		surface: "configRepair"
	}).flatMap((entry) => entry.providerRenames);
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
var PluginDoctorStateMigrationDeclarationError = class extends Error {};
function listPluginDoctorStateMigrationEntries(params) {
	return loadPluginDoctorStateMigrationEntries(params?.inventory?.records ?? resolvePluginDoctorStateMigrationRecords(params ?? {}), params?.validateDeclarations, params?.onInspectedPlugin, params?.onInspectedStatelessPlugin, params?.onSelectedPlugin, params?.onUnavailablePlugin);
}
function loadPluginDoctorStateMigrationEntries(records, validateDeclarations = true, onInspectedPlugin, onInspectedStatelessPlugin, onSelectedPlugin, onUnavailablePlugin) {
	const entries = [];
	for (const record of records) {
		onSelectedPlugin?.(record.id);
		const modern = loadPluginDoctorContractEntry(record, "stateMigrations");
		if (modern instanceof PluginDependencyLinkError) {
			onUnavailablePlugin?.(record.id, modern);
			continue;
		}
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
	return filterPluginDoctorStateMigrationRecords(filterPluginDoctorRecordsByScope((params.manifestRegistry ?? discoverConfigWidePluginManifestRegistry(params)).plugins, params.pluginIds), params.config);
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
		if (declaration === true) unresolvedPluginIds.push(record.id);
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
		records,
		knownPluginIds: [.../* @__PURE__ */ new Set([...bundledInventory.knownPluginIds, ...records.map((r) => r.id)])],
		sessionStoreOwnerPluginIds: records.filter((record) => record.doctorContract?.resolveSessionStoreAgentIds === true).map((record) => record.id),
		descriptors,
		unresolvedPluginIds: []
	};
}
function applyPluginDoctorCompatibilityMigrations(cfg, params) {
	return applyResolvedPluginDoctorCompatibilityMigrations(cfg, resolvePluginDoctorContracts({
		...params,
		config: params?.config ?? cfg,
		surface: "configRepair"
	}), {
		...params,
		isDeferred: isPluginDoctorMigrationDeferred
	});
}
/** Inspect plugin-owned migration paths before the updater captures its recovery set. */
async function preparePluginDoctorMigrationBackupResources(params) {
	return await withArtifactPreservingStateReads(() => withPluginSourceCaptureStorage({
		stateDir: params.stateDir,
		placement: "temporary"
	}, async () => {
		const entries = loadPluginDoctorStateMigrationEntries(resolvePluginDoctorStateMigrationRecords({
			...params,
			artifactPreservingReadOnly: true
		}));
		const { preparePluginDoctorMigrationResources } = await import("./doctor-migration-resources-LIO2LnTV.mjs");
		return await preparePluginDoctorMigrationResources(entries, params);
	}));
}
//#endregion
export { isTrustedForDurableStores as a, listPluginDoctorSessionStoreAgentIds as c, resolveLivePluginDoctorStateMigrationInventory as d, resolvePluginDoctorProviderRenames as f, collectRelevantDoctorPluginIds as g, withDeferredPluginDoctorMigrations as h, isPluginDoctorMigrationDeferred as i, listPluginDoctorStateMigrationEntries as l, resolvePluginDoctorStateMigrationRecords as m, applyPluginDoctorCompatibilityMigrations as n, listPluginDoctorLegacyConfigRules as o, resolvePluginDoctorStateMigrationInventory as p, collectDoctorConfigRepairPluginIds as r, listPluginDoctorSessionRouteStateOwners as s, PluginDoctorStateMigrationDeclarationError as t, preparePluginDoctorMigrationBackupResources as u };
