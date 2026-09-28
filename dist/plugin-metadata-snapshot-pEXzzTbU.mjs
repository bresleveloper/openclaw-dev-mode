import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { D as withPluginCache, a as createPluginCache, d as getPluginMetadataSnapshotCache, i as bindPluginMetadataSnapshotCache, o as getPluginCache, x as retainPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { i as getActiveDiagnosticsTimelineSpan, s as measureDiagnosticsTimelineSpanSync } from "./diagnostics-timeline-uuHa_36_.mjs";
import { t as registerPluginMetadataSnapshotReaders } from "./plugin-metadata-snapshot-readers-NmF34DMg.mjs";
import { n as prepareBundledDiscoveryMode } from "./bundled-discovery-state-BnkoG5eV.mjs";
import { _ as resolveInstalledPluginIndexPolicyHash } from "./installed-plugin-index-D0kh4WcK.mjs";
import { P as hashJson } from "./discovery-D_5mAUI7.mjs";
import { i as resolveInstalledPluginIndexStorePath } from "./installed-plugin-record-match-CPrj3NTo.mjs";
import { n as loadBundledPluginManifestRegistry } from "./manifest-registry-build-BbQTPsvD.mjs";
import { l as preparePersistedInstalledPluginIndexCacheEntry } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { a as loadPluginRegistrySnapshotWithMetadata, n as getCurrentPluginMetadataSnapshotForRegistry, t as canReusePluginRegistrySnapshot } from "./plugin-registry-snapshot-BAw04cGV.mjs";
import { a as resolveInstalledManifestRegistryIndexFingerprint, o as selectInstalledPluginManifestRecords, r as loadPluginManifestRegistryForInstalledIndex, t as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-CNov0ojO.mjs";
import { t as resolvePluginMetadataEnvFingerprint } from "./plugin-metadata-env-CYA0dErq.mjs";
import { a as isCurrentPluginMetadataSnapshotRuntimeGeneration, i as getCurrentPluginMetadataSnapshot, m as serializePluginIdScope, p as normalizePluginIdScope } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { n as buildPluginMetadataProviderFacts } from "./plugin-metadata-provider-facts-VzYAAmcr.mjs";
import { t as adoptCurrentPluginMetadataSnapshotIfAbsentRuntime } from "./plugin-metadata-snapshot.runtime.js";
import { t as buildDeclaredProviderOwnerIndex } from "./provider-owner-index-eVSJvcfU.mjs";
import { r as registerProviderPolicyOwnerIndexes } from "./provider-policy-owners-CS5yTO36.mjs";
//#region src/plugins/plugin-metadata-contributions.ts
const PLUGIN_METADATA_CONTRIBUTION_KEYS = [
	"channels",
	"channelConfigs",
	"providers",
	"modelCatalogProviders",
	"cliBackends",
	"setupProviders",
	"commandAliases",
	"contracts"
];
/** Raw declarations retain their order and spelling; owner indexes add normalization and aliases. */
function listPluginManifestContributionIds(plugin, contribution) {
	switch (contribution) {
		case "providers": return plugin.providers ?? [];
		case "channels": return plugin.channels ?? [];
		case "channelConfigs": return Object.keys(plugin.channelConfigs ?? {});
		case "setupProviders": return plugin.setup?.providers?.map((provider) => provider.id) ?? [];
		case "cliBackends": return [...plugin.cliBackends ?? [], ...plugin.setup?.cliBackends ?? []];
		case "modelCatalogProviders": return [...Object.keys(plugin.modelCatalog?.providers ?? {}), ...Object.keys(plugin.modelCatalog?.aliases ?? {})];
		case "commandAliases": return plugin.commandAliases?.map((alias) => alias.name) ?? [];
		case "contracts": return Object.entries(plugin.contracts ?? {}).flatMap(([key, values]) => Array.isArray(values) && values.length > 0 ? [key] : []);
	}
	return [];
}
//#endregion
//#region src/plugins/plugin-metadata-snapshot-input.ts
/** Acquires workspace metadata before the fleet publishes its immutable snapshot. */
function loadPluginMetadataSnapshotInput(params, readRegistry = () => loadPluginRegistrySnapshotWithMetadata({
	config: params.config,
	workspaceDir: params.workspaceDir,
	...params.stateDir ? { stateDir: params.stateDir } : {},
	env: params.env,
	...params.installRecords !== void 0 ? { preferPersisted: false } : params.preferPersisted !== void 0 ? { preferPersisted: params.preferPersisted } : {},
	...params.allowCurrent !== void 0 ? { allowCurrent: params.allowCurrent } : {},
	...params.index ? { index: params.index } : {},
	...params.installRecords ? { installRecords: params.installRecords } : {}
})) {
	const totalStartedAt = performance.now();
	const registryStartedAt = performance.now();
	const registryResult = readRegistry();
	const registrySnapshotMs = performance.now() - registryStartedAt;
	const index = registryResult.snapshot.diagnostics ? registryResult.snapshot : {
		...registryResult.snapshot,
		diagnostics: []
	};
	const manifestStartedAt = performance.now();
	const manifestRegistry = loadPluginManifestRegistryForInstalledIndex({
		index,
		registryPath: resolveInstalledPluginIndexStorePath({
			env: params.env,
			stateDir: params.stateDir
		}),
		...registryResult.manifestRegistry ? { manifestRegistry: registryResult.manifestRegistry } : {},
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		includeDisabled: true
	});
	const manifestRegistryMs = performance.now() - manifestStartedAt;
	const totalMs = performance.now() - totalStartedAt;
	return {
		policyHash: index.policyHash,
		registrySource: registryResult.source,
		workspaceDir: params.workspaceDir,
		index,
		registryIndex: index,
		registryDiagnostics: registryResult.diagnostics,
		manifestRegistry,
		metrics: {
			registrySnapshotMs,
			manifestRegistryMs,
			ownerMapsMs: 0,
			totalMs,
			indexPluginCount: index.plugins.length,
			manifestPluginCount: manifestRegistry.plugins.length
		},
		discovery: registryResult.discovery
	};
}
//#endregion
//#region src/plugins/plugin-registry-id-normalizer.ts
function collectObjectKeys(value) {
	return value ? Object.keys(value) : [];
}
function listPluginRegistryNormalizerAliases(plugin) {
	return [
		plugin.id,
		...plugin.providers ?? [],
		...plugin.channels ?? [],
		...plugin.setup?.providers?.map((provider) => provider.id) ?? [],
		...plugin.cliBackends ?? [],
		...plugin.setup?.cliBackends ?? [],
		...collectObjectKeys(plugin.modelCatalog?.providers),
		...collectObjectKeys(plugin.modelCatalog?.aliases),
		...collectObjectKeys(plugin.providerAuthAliases),
		...plugin.legacyPluginIds ?? []
	];
}
/** Creates a normalizer that maps provider/channel/catalog aliases back to plugin ids. */
function createPluginRegistryIdNormalizer(index, options = {}) {
	const aliases = /* @__PURE__ */ new Map();
	for (const plugin of index.plugins) {
		if (!plugin.pluginId) continue;
		const pluginId = plugin.pluginId.trim();
		if (pluginId) aliases.set(pluginId.toLowerCase(), plugin.pluginId);
	}
	const registry = options.lookUpTable?.manifestRegistry ?? options.manifestRegistry ?? loadPluginManifestRegistryForInstalledIndex({
		index,
		includeDisabled: true
	});
	for (const plugin of registry.plugins.toSorted((left, right) => left.id.localeCompare(right.id))) {
		const pluginId = plugin.id.trim();
		if (!pluginId) continue;
		aliases.set(pluginId.toLowerCase(), plugin.id);
		for (const alias of listPluginRegistryNormalizerAliases(plugin)) {
			const normalizedAlias = alias.trim();
			const normalizedAliasKey = normalizedAlias.toLowerCase();
			if (normalizedAlias && !aliases.has(normalizedAliasKey)) aliases.set(normalizedAliasKey, pluginId);
		}
	}
	return (pluginId) => {
		const trimmed = pluginId.trim();
		return aliases.get(trimmed.toLowerCase()) ?? trimmed;
	};
}
//#endregion
//#region src/plugins/plugin-metadata-snapshot.ts
const MAX_PLUGIN_METADATA_PROJECTIONS = 64;
const throwReadonlyPluginMetadataMutation = resolveGlobalSingleton(Symbol.for("openclaw.pluginMetadataReadonlyMutation"), () => () => {
	throw new TypeError("Plugin metadata snapshots are immutable");
});
function freezeSnapshotValue(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return value;
	seen.add(value);
	if (value instanceof Map) {
		for (const [key, entry] of value) {
			freezeSnapshotValue(key, seen);
			freezeSnapshotValue(entry, seen);
		}
		Object.defineProperties(value, {
			clear: { value: throwReadonlyPluginMetadataMutation },
			delete: { value: throwReadonlyPluginMetadataMutation },
			set: { value: throwReadonlyPluginMetadataMutation }
		});
		return Object.freeze(value);
	}
	if (value instanceof Set) {
		for (const entry of value) freezeSnapshotValue(entry, seen);
		Object.defineProperties(value, {
			add: { value: throwReadonlyPluginMetadataMutation },
			clear: { value: throwReadonlyPluginMetadataMutation },
			delete: { value: throwReadonlyPluginMetadataMutation }
		});
		return Object.freeze(value);
	}
	for (const entry of Object.values(value)) freezeSnapshotValue(entry, seen);
	return Object.freeze(value);
}
function indexesMatch(left, right) {
	if (!left || !right) return true;
	return resolveInstalledManifestRegistryIndexFingerprint(left) === resolveInstalledManifestRegistryIndexFingerprint(right);
}
/** Freezes prepared process-local facts; worker transfers must use restorePluginMetadataSnapshot. */
function finalizePluginMetadataSnapshot(snapshot) {
	freezeSnapshotValue(snapshot);
	bindPluginMetadataSnapshotCache(snapshot);
	const cache = getPluginMetadataSnapshotCache(snapshot);
	registerProviderPolicyOwnerIndexes(snapshot, cache);
	return snapshot;
}
/** Restores process-local behavior and immutability after a snapshot crosses a worker boundary. */
function restorePluginMetadataSnapshot(snapshot) {
	return finalizePluginMetadataSnapshot({
		...snapshot,
		normalizePluginId: createPluginRegistryIdNormalizer(snapshot.index, { manifestRegistry: snapshot.manifestRegistry })
	});
}
function isPluginMetadataSnapshotCompatible(params) {
	const env = params.env ?? process.env;
	if (isCurrentPluginMetadataSnapshotRuntimeGeneration(params.snapshot)) return true;
	const requestedPluginIds = normalizePluginIdScope(params.pluginIds);
	const snapshotPluginIds = normalizePluginIdScope(params.snapshot.pluginIds);
	return (snapshotPluginIds === void 0 || params.allowScopedSnapshot === true || requestedPluginIds !== void 0 && serializePluginIdScope(snapshotPluginIds) === serializePluginIdScope(requestedPluginIds)) && params.snapshot.policyHash === resolveInstalledPluginIndexPolicyHash(params.config, env) && (!params.snapshot.configFingerprint || params.snapshot.configFingerprint === resolvePluginControlPlaneFingerprint({
		config: params.config,
		env,
		index: params.index ?? params.snapshot.index,
		policyHash: params.snapshot.policyHash,
		workspaceDir: params.workspaceDir
	})) && (params.snapshot.workspaceDir ?? "") === (params.workspaceDir ?? "") && indexesMatch(params.snapshot.index, params.index);
}
function appendOwner(owners, ownedId, pluginId) {
	const existing = owners.get(ownedId);
	if (existing) {
		if (existing.includes(pluginId)) return;
		existing.push(pluginId);
		return;
	}
	owners.set(ownedId, [pluginId]);
}
function buildPluginMetadataOwnerMaps(manifestRegistry, index) {
	const plugins = manifestRegistry.plugins;
	const owners = {
		channels: /* @__PURE__ */ new Map(),
		channelConfigs: /* @__PURE__ */ new Map(),
		providers: /* @__PURE__ */ new Map(),
		modelCatalogProviders: /* @__PURE__ */ new Map(),
		cliBackends: /* @__PURE__ */ new Map(),
		setupProviders: /* @__PURE__ */ new Map(),
		commandAliases: /* @__PURE__ */ new Map(),
		contracts: /* @__PURE__ */ new Map()
	};
	for (const plugin of plugins) {
		for (const contribution of PLUGIN_METADATA_CONTRIBUTION_KEYS) for (const id of listPluginManifestContributionIds(plugin, contribution)) appendOwner(owners[contribution], contribution === "cliBackends" ? normalizeProviderId(id) : id, plugin.id);
		for (const [rawAlias, target] of Object.entries(plugin.providerAuthAliases ?? {})) {
			if (typeof target !== "string") continue;
			const alias = normalizeProviderId(rawAlias);
			const targetProvider = normalizeProviderId(target);
			if (alias && targetProvider && (plugin.providers ?? []).some((providerId) => normalizeProviderId(providerId) === targetProvider)) appendOwner(owners.providers, alias, plugin.id);
		}
	}
	for (const map of Object.values(owners)) map.forEach((pluginIds) => Object.freeze(pluginIds));
	const channelAccountKeyPolicies = /* @__PURE__ */ new Map();
	const selectedChannels = /* @__PURE__ */ new Set();
	const enabledPluginIds = new Set(index.plugins.filter((plugin) => plugin.enabled).map((plugin) => plugin.pluginId));
	const channelOwners = selectInstalledPluginManifestRecords(index, manifestRegistry, null, true).toSorted((a, b) => Number(enabledPluginIds.has(b.id)) - Number(enabledPluginIds.has(a.id)));
	for (const owner of channelOwners) for (const channel of owner.channels) {
		if (selectedChannels.has(channel)) continue;
		selectedChannels.add(channel);
		const policy = owner.channelAccountKeyPolicies?.[channel];
		if (policy) channelAccountKeyPolicies.set(channel, policy);
	}
	return {
		...owners,
		channelAccountKeyPolicies,
		...buildPluginMetadataProviderFacts(plugins)
	};
}
function buildPluginMetadataManifestFacts(manifestRegistry, index) {
	const plugins = manifestRegistry.plugins;
	return {
		manifestRegistry,
		plugins,
		diagnostics: manifestRegistry.diagnostics,
		byPluginId: new Map(plugins.map((plugin) => [plugin.id, plugin])),
		owners: buildPluginMetadataOwnerMaps(manifestRegistry, index),
		declaredProviderOwners: buildDeclaredProviderOwnerIndex(plugins)
	};
}
function listPluginOriginsFromMetadataSnapshot(snapshot) {
	return new Map(snapshot.plugins.map((record) => [record.id, record.origin]));
}
/** Rebuilds every manifest-derived snapshot fact from one authoritative registry. */
function rebasePluginMetadataSnapshotManifestRegistry(snapshot, manifestRegistry) {
	const rebased = {
		...snapshot,
		...buildPluginMetadataManifestFacts(manifestRegistry, snapshot.index),
		normalizePluginId: snapshot.index ? createPluginRegistryIdNormalizer(snapshot.index, { manifestRegistry }) : snapshot.normalizePluginId,
		...snapshot.metrics ? { metrics: {
			...snapshot.metrics,
			manifestPluginCount: manifestRegistry.plugins.length
		} } : {}
	};
	bindPluginMetadataSnapshotCache(rebased, getPluginMetadataSnapshotCache(snapshot));
	return rebased;
}
function projectPluginMetadataSnapshot(snapshot, pluginIds) {
	const selectedIds = normalizePluginIdScope(pluginIds);
	if (selectedIds === void 0) return snapshot;
	const key = serializePluginIdScope(selectedIds);
	if (key === serializePluginIdScope(snapshot.pluginIds)) return snapshot;
	const cache = getPluginMetadataSnapshotCache(snapshot);
	let selections = cache.metadata.projections.get(snapshot);
	if (!selections) {
		selections = /* @__PURE__ */ new Map();
		cache.metadata.projections.set(snapshot, selections);
	}
	const cached = selections.get(key);
	if (cached) return cached;
	const selected = new Set(selectedIds);
	const projected = freezeSnapshotValue({
		...rebasePluginMetadataSnapshotManifestRegistry(snapshot, {
			plugins: snapshot.plugins.filter((plugin) => selected.has(plugin.id)),
			diagnostics: snapshot.manifestRegistry.diagnostics
		}),
		pluginIds: selectedIds
	});
	bindPluginMetadataSnapshotCache(projected, cache);
	registerProviderPolicyOwnerIndexes(projected, cache);
	cache.metadata.projectionSources.set(projected, snapshot);
	selections.set(key, projected);
	pruneMapToMaxSize(selections, MAX_PLUGIN_METADATA_PROJECTIONS);
	return projected;
}
/** Uses semantic inputs only: checking freshness here would defeat first-access reuse. */
function resolvePluginMetadataSnapshotCacheKey(params) {
	return hashJson({
		env: resolvePluginMetadataEnvFingerprint(params.env ?? process.env),
		policy: resolveInstalledPluginIndexPolicyHash(params.config, params.env),
		loadPaths: params.config?.plugins?.load?.paths,
		workspaceDir: params.workspaceDir,
		stateDir: params.stateDir,
		index: params.index ? resolveInstalledManifestRegistryIndexFingerprint(params.index) : void 0,
		installRecords: params.installRecords,
		preferPersisted: params.installRecords === void 0 && params.preferPersisted !== false
	});
}
function loadPluginMetadataSnapshot(params) {
	if (params.allowCurrent === false && getPluginCache().kind !== "operation") return withPluginCache(createPluginCache(), () => loadPluginMetadataSnapshot(params));
	if (params.allowCurrent !== false && params.installRecords === void 0 && params.stateDir === void 0 && params.preferPersisted !== false) {
		const current = getCurrentPluginMetadataSnapshot({
			config: params.config,
			env: params.env,
			workspaceDir: params.workspaceDir,
			allowWorkspaceScopedSnapshot: true
		});
		if (current && (isCurrentPluginMetadataSnapshotRuntimeGeneration(current) || isPluginMetadataSnapshotCompatible({
			snapshot: current,
			config: params.config,
			env: params.env,
			workspaceDir: params.workspaceDir,
			index: params.index
		}))) return projectPluginMetadataSnapshot(current, params.pluginIds ?? params.pluginIdScope?.resolve({ index: current.index }));
	}
	return loadCachedPluginMetadataSnapshot(params);
}
/** Registry readers retain their exact current-snapshot selection without publishing cold loads. */
function loadPluginMetadataSnapshotForRegistry(params) {
	if (!canReusePluginRegistrySnapshot(params) || params.artifactPreservingReadOnly !== void 0) return;
	return getCurrentPluginMetadataSnapshotForRegistry(params) ?? loadCachedPluginMetadataSnapshot({
		config: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir
	});
}
function loadCachedPluginMetadataSnapshot(params) {
	const cache = getPluginCache();
	const key = resolvePluginMetadataSnapshotCacheKey(params);
	const cached = cache.metadata.snapshots.get(key);
	if (cached) return projectPluginMetadataSnapshot(cached, params.pluginIds ?? params.pluginIdScope?.resolve({ index: cached.index }));
	const activeTimelineSpan = getActiveDiagnosticsTimelineSpan();
	const snapshot = measureDiagnosticsTimelineSpanSync("plugins.metadata.scan", () => buildPluginMetadataSnapshot(loadPluginMetadataSnapshotInput(params), params), {
		phase: activeTimelineSpan?.phase ?? "startup",
		config: params.config,
		env: params.env,
		attributes: {
			hasWorkspaceDir: params.workspaceDir !== void 0,
			hasInstalledIndex: params.index !== void 0
		}
	});
	const frozen = measureDiagnosticsTimelineSpanSync("plugins.metadata.freeze", () => restorePluginMetadataSnapshot(snapshot), {
		phase: activeTimelineSpan?.phase ?? "startup",
		config: params.config,
		env: params.env,
		attributes: {
			indexPluginCount: snapshot.index.plugins.length,
			manifestPluginCount: snapshot.plugins.length
		}
	});
	cache.metadata.snapshots.set(key, frozen);
	return projectPluginMetadataSnapshot(frozen, params.pluginIds ?? params.pluginIdScope?.resolve({ index: frozen.index }));
}
/** Promotes a planning-scoped graph to the complete process-lifecycle metadata snapshot. */
function completePluginMetadataSnapshot(params) {
	if (!params.snapshot || params.snapshot.pluginIds === void 0 && params.snapshot.bundledManifestRegistry) return params.snapshot;
	const snapshot = params.snapshot;
	const cache = getPluginMetadataSnapshotCache(snapshot);
	const cached = cache.metadata.completions.get(snapshot);
	if (cached) return cached;
	const source = cache.metadata.projectionSources.get(snapshot);
	if (source) {
		const completed = completePluginMetadataSnapshot({
			...params,
			snapshot: source
		});
		if (completed) cache.metadata.completions.set(snapshot, completed);
		return completed;
	}
	return withPluginCache(cache, () => {
		const inputs = {
			...params,
			snapshot
		};
		const workspaceDir = inputs.workspaceDir ?? inputs.snapshot.workspaceDir;
		const manifestStartedAt = performance.now();
		const manifestRegistry = inputs.snapshot.pluginIds === void 0 ? inputs.snapshot.manifestRegistry : loadPluginManifestRegistryForInstalledIndex({
			index: inputs.snapshot.index,
			config: inputs.config,
			env: inputs.env ?? process.env,
			...workspaceDir ? { workspaceDir } : {},
			includeDisabled: true
		});
		const bundledManifestRegistry = inputs.snapshot.bundledManifestRegistry ?? loadBundledPluginManifestRegistry({ env: inputs.env });
		const manifestRegistryMs = performance.now() - manifestStartedAt;
		const rebased = snapshot.pluginIds === void 0 ? snapshot : rebasePluginMetadataSnapshotManifestRegistry(snapshot, manifestRegistry);
		const { pluginIds: _pluginIds, ...unscoped } = rebased;
		const completed = finalizePluginMetadataSnapshot({
			...unscoped,
			bundledManifestRegistry,
			configFingerprint: resolvePluginControlPlaneFingerprint({
				config: inputs.config,
				env: inputs.env,
				index: rebased.index,
				policyHash: rebased.policyHash,
				workspaceDir
			}),
			metrics: {
				...rebased.metrics,
				manifestRegistryMs,
				totalMs: rebased.metrics.totalMs + manifestRegistryMs
			}
		});
		cache.metadata.completions.set(snapshot, completed);
		return completed;
	});
}
function selectPluginMetadataSnapshot(params, allowSynchronousPolicyRead = true) {
	if (params.allowCurrent !== false && params.installRecords === void 0 && params.stateDir === void 0 && params.preferPersisted !== false) {
		const current = getCurrentPluginMetadataSnapshot({
			allowSynchronousPolicyRead,
			config: params.config,
			env: params.env,
			...params.config === void 0 ? { requireDefaultDiscoveryContext: true } : {},
			...params.pluginIds !== void 0 ? { pluginIds: params.pluginIds } : {},
			...params.pluginIdScope !== void 0 ? { pluginIdScope: params.pluginIdScope } : {},
			...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
			...params.allowWorkspaceScopedCurrent === true ? { allowWorkspaceScopedSnapshot: true } : {}
		});
		if (!current) return {
			kind: "load",
			adoptCurrent: true
		};
		if (isCurrentPluginMetadataSnapshotRuntimeGeneration(current)) return {
			kind: "current",
			snapshot: projectPluginMetadataSnapshot(current, params.pluginIds ?? params.pluginIdScope?.resolve({ index: current.index }))
		};
		if (!params.index) return {
			kind: "current",
			snapshot: current
		};
		if (allowSynchronousPolicyRead && isPluginMetadataSnapshotCompatible({
			snapshot: current,
			config: params.config,
			env: params.env,
			allowScopedSnapshot: params.pluginIds !== void 0 || params.pluginIdScope !== void 0,
			workspaceDir: params.workspaceDir ?? (params.allowWorkspaceScopedCurrent === true ? current.workspaceDir : void 0),
			index: params.index
		})) return {
			kind: "current",
			snapshot: current
		};
	}
	return {
		kind: "load",
		adoptCurrent: false
	};
}
function resolvePluginMetadataSnapshot(params) {
	const selection = selectPluginMetadataSnapshot(params);
	if (selection.kind === "current") return selection.snapshot;
	const snapshot = loadPluginMetadataSnapshot(params);
	if (selection.adoptCurrent && params.index === void 0 && params.workspaceDir === void 0 && params.pluginIds === void 0 && params.pluginIdScope === void 0 && snapshot.workspaceDir === void 0 && snapshot.pluginIds === void 0) adoptCurrentPluginMetadataSnapshotIfAbsentRuntime(snapshot, params);
	return snapshot;
}
/** Prepare database facts while retaining the existing metadata selection and cache owner. */
async function resolvePluginMetadataSnapshotAsync(params) {
	const captured = {
		...params,
		env: cloneEnvWithPlatformSemantics(params.env ?? process.env)
	};
	if (captured.allowCurrent === false && getPluginCache().kind !== "operation") return withPluginCache(createPluginCache(), () => resolvePluginMetadataSnapshotAsync(captured));
	const cache = getPluginCache();
	const release = retainPluginCache(cache);
	try {
		return await withPluginCache(cache, async () => {
			const current = selectPluginMetadataSnapshot(captured, false);
			if (current.kind === "current") return current.snapshot;
			const activateDiscovery = await prepareBundledDiscoveryMode(captured.env);
			activateDiscovery();
			const prepared = selectPluginMetadataSnapshot(captured);
			if (prepared.kind === "current") return prepared.snapshot;
			if (captured.index === void 0 && captured.installRecords === void 0 && captured.preferPersisted !== false) (await preparePersistedInstalledPluginIndexCacheEntry({
				env: captured.env,
				stateDir: captured.stateDir
			})).assertCurrent();
			activateDiscovery();
			return resolvePluginMetadataSnapshot(captured);
		});
	} finally {
		release();
	}
}
/** Reuse prepared workspace facts without materializing an intermediate immutable graph. */
function resolvePluginMetadataSnapshotInput(params, registryReader) {
	const selection = selectPluginMetadataSnapshot(params);
	if (selection.kind === "current") return selection.snapshot;
	return getPluginCache().metadata.snapshots.get(resolvePluginMetadataSnapshotCacheKey(params)) ?? loadPluginMetadataSnapshotInput(params, () => registryReader(params.workspaceDir));
}
function buildPluginMetadataSnapshot(input, params) {
	const startedAt = performance.now();
	const index = structuredClone(input.index);
	const registryIndex = input.registryIndex === input.index ? index : structuredClone(input.registryIndex);
	const manifestFacts = buildPluginMetadataManifestFacts(input.manifestRegistry, index);
	const ownerMapsMs = performance.now() - startedAt;
	return {
		...input,
		index,
		registryIndex,
		...manifestFacts,
		configFingerprint: resolvePluginControlPlaneFingerprint({
			config: params.config,
			env: params.env,
			index,
			policyHash: input.policyHash,
			workspaceDir: input.workspaceDir
		}),
		metrics: {
			...input.metrics,
			ownerMapsMs,
			totalMs: input.metrics.totalMs + ownerMapsMs
		}
	};
}
registerPluginMetadataSnapshotReaders({
	resolvePluginMetadataSnapshot,
	loadPluginMetadataSnapshot
});
//#endregion
export { listPluginOriginsFromMetadataSnapshot as a, projectPluginMetadataSnapshot as c, resolvePluginMetadataSnapshotAsync as d, resolvePluginMetadataSnapshotCacheKey as f, listPluginManifestContributionIds as g, createPluginRegistryIdNormalizer as h, isPluginMetadataSnapshotCompatible as i, rebasePluginMetadataSnapshotManifestRegistry as l, restorePluginMetadataSnapshot as m, completePluginMetadataSnapshot as n, loadPluginMetadataSnapshot as o, resolvePluginMetadataSnapshotInput as p, finalizePluginMetadataSnapshot as r, loadPluginMetadataSnapshotForRegistry as s, buildPluginMetadataSnapshot as t, resolvePluginMetadataSnapshot as u };
