import { d as withPluginRuntimeRegistryScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { _ as resolveDefaultAgentId, b as resolveNativeModelPrimary, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-BccyWLRI.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { i as DEFAULT_PROVIDER } from "./defaults-Bg930vxE.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { r as buildConfiguredModelCatalog, y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { a as resolveModelCatalogIdentityKey, t as createModelCatalogIdentityKeyResolver } from "./openai-model-routes-BJEokkWC.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BDZ8eM01.mjs";
import { n as modelCatalogRouteVariantKey, t as enrichHarnessRows } from "./model-catalog-entry-BWd5zbsm.mjs";
import "./workspace-3xrXOvoY.mjs";
import { t as copyProviderCatalogOutcomes } from "./provider-catalog-result-COZXbs2U.mjs";
import { n as resolveConfiguredModelEntries } from "./configured-model-entries-BnlVcGcZ.mjs";
import { n as collectPreparedModelRuntimeConfiguredRefs } from "./prepared-model-runtime.configured-B8Q2qHyF.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/harness/model-catalog.ts
function isCatalogRowList(result) {
	return Array.isArray(result);
}
function replaceRuntimeScope(previous, runtime, rows, retain) {
	const before = previous && Object.hasOwn(previous, runtime) ? previous[runtime] ?? [] : [];
	const next = [...before.filter(retain), ...rows];
	if (isDeepStrictEqual(before, next)) return previous;
	const updated = {
		...previous,
		[runtime]: next
	};
	if (!next.length) delete updated[runtime];
	return updated;
}
async function augmentModelCatalogWithAgentHarness(params) {
	const prepared = params.preparedSnapshot ?? params.snapshot;
	const normalizeProvider = params.normalizeProvider ?? normalizeProviderId;
	const runtimeProviders = /* @__PURE__ */ new Map();
	const addRuntime = (value, provider) => {
		const runtime = normalizeOptionalAgentRuntimeId(value);
		if (!runtime || isDefaultAgentRuntimeId(runtime) || runtime === "openclaw") return;
		const providers = runtimeProviders.get(runtime) ?? /* @__PURE__ */ new Set();
		providers.add(provider);
		runtimeProviders.set(runtime, providers);
	};
	const rawDefaultModel = params.defaultModel?.trim();
	const ref = params.nativeSelection ? {
		provider: params.nativeSelection.provider,
		model: params.nativeSelection.modelId
	} : rawDefaultModel ? resolveModelRefFromString({
		cfg: params.cfg,
		raw: rawDefaultModel,
		defaultProvider: params.defaultProvider,
		allowManifestNormalization: true,
		allowPluginNormalization: true
	})?.ref : void 0;
	let defaultRuntime;
	if (ref) {
		const routeKeyOf = createModelCatalogIdentityKeyResolver();
		const refKey = routeKeyOf({
			provider: ref.provider,
			id: ref.model
		});
		const routeEntry = [...prepared.entries, ...prepared.staticEntries ?? []].find((entry) => routeKeyOf(entry) === refKey);
		defaultRuntime = params.nativeSelection?.runtime ?? params.agentRuntime ?? resolveAgentHarnessPolicy({
			provider: ref.provider,
			modelId: ref.model,
			modelApi: routeEntry?.api,
			modelBaseUrl: routeEntry?.baseUrl,
			config: params.cfg,
			agentId: params.agentId
		}).runtime;
		addRuntime(defaultRuntime, ref.provider);
	}
	if (params.includePickerRuntimes) for (const entry of resolveConfiguredModelEntries({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel
	}).entries) for (const runtime of entry.pickerRuntimes ?? []) addRuntime(runtime, entry.ref.provider);
	const pluginRegistry = params.observationConfig ? params.pluginRegistry : params.pluginRegistry ?? getActivePluginRegistry();
	if (!pluginRegistry) return params.snapshot;
	if (params.includePickerRuntimes) {
		for (const { harness } of pluginRegistry.agentHarnesses) if (harness.loadModelCatalog && !runtimeProviders.has(harness.id)) runtimeProviders.set(harness.id, /* @__PURE__ */ new Set());
	}
	if (runtimeProviders.size === 0) return params.snapshot;
	let configuredModelRefs;
	try {
		configuredModelRefs = collectPreparedModelRuntimeConfiguredRefs(params.cfg, params.agentId).flatMap(({ value }) => {
			const resolved = resolveModelRefFromString({
				cfg: params.cfg,
				agentId: params.agentId,
				raw: value,
				defaultProvider: params.defaultProvider,
				allowManifestNormalization: true,
				allowPluginNormalization: true
			})?.ref;
			return resolved ? [resolved] : [];
		});
	} catch (error) {
		params.onError?.(error);
		return params.snapshot;
	}
	let result = params.snapshot;
	const completedRows = [];
	let discovered = false;
	for (const [runtime, providers] of runtimeProviders) {
		const scopedProviders = [...providers].filter((provider) => !params.includesProvider || params.includesProvider(provider));
		if (providers.size > 0 && scopedProviders.length === 0) continue;
		const harness = withPluginRuntimeRegistryScope(pluginRegistry, () => getRegisteredAgentHarness(runtime)?.harness);
		if (!harness?.loadModelCatalog) continue;
		for (const provider of scopedProviders) params.onDiscoveryStarted?.(provider);
		const includesProvider = params.includesProvider;
		const outsideScope = ({ provider }) => includesProvider !== void 0 && !includesProvider(provider);
		let listedRows;
		let outcomes = [];
		try {
			const loaded = await harness.loadModelCatalog({
				config: params.observationConfig ?? params.cfg,
				agentId: params.agentId,
				agentDir: params.agentDir,
				workspaceDir: params.workspaceDir,
				configuredModelRefs
			});
			if (isCatalogRowList(loaded)) listedRows = loaded;
			else {
				listedRows = loaded.entries;
				outcomes = copyProviderCatalogOutcomes(loaded);
				for (const outcome of outcomes) outcome.provider = normalizeProvider(outcome.provider);
			}
		} catch (error) {
			const failedProviders = new Set([...scopedProviders, ...[...result.entries, ...result.routeVariants].filter((entry) => entry.nativeRuntime === runtime && !outsideScope(entry)).map((entry) => entry.provider)].map(normalizeProvider));
			if (result === params.snapshot) result = { ...params.snapshot };
			result.nativeProviderOutcomes = replaceRuntimeScope(result.nativeProviderOutcomes, runtime, [...failedProviders].map((provider) => ({
				provider,
				status: "unavailable"
			})), outsideScope);
			params.onError?.(error, scopedProviders);
			continue;
		}
		const scopedRows = includesProvider ? listedRows.filter((entry) => includesProvider(entry.provider)) : listedRows;
		const nativeProviderOutcomes = replaceRuntimeScope(result.nativeProviderOutcomes, runtime, outcomes.filter((outcome) => !outsideScope(outcome)), outsideScope);
		const failedProviders = new Set(outcomes.filter((outcome) => outcome.status !== "ready").map(({ provider }) => provider));
		const nativeHostRows = replaceRuntimeScope(result.nativeHostRows, runtime, scopedRows.filter((row) => !row.nativeRuntime && !failedProviders.has(normalizeProvider(row.provider))), (row) => outsideScope(row) || failedProviders.has(normalizeProvider(row.provider)));
		if (nativeProviderOutcomes !== result.nativeProviderOutcomes || nativeHostRows !== result.nativeHostRows) {
			if (result === params.snapshot) result = { ...params.snapshot };
			result.nativeProviderOutcomes = nativeProviderOutcomes;
			result.nativeHostRows = nativeHostRows;
		}
		completedRows.push(...scopedRows);
		discovered = true;
		const rows = enrichHarnessRows(scopedRows, prepared);
		const keyOf = createModelCatalogIdentityKeyResolver();
		const configuredKeys = /* @__PURE__ */ new Set([...configuredModelRefs.map(({ provider, model }) => keyOf({
			provider,
			id: model
		})), ...buildConfiguredModelCatalog({
			cfg: params.cfg,
			workspaceDir: params.workspaceDir
		}).map(keyOf)]);
		const retain = (entry) => entry.nativeRuntime !== runtime || failedProviders.has(normalizeProvider(entry.provider)) || configuredKeys.has(resolveModelCatalogIdentityKey(entry)) || includesProvider !== void 0 && !includesProvider(entry.provider);
		const retainedEntries = result.entries.filter(retain);
		const retainedVariants = result.routeVariants.filter(retain);
		if (rows.length === 0 && retainedEntries.length === result.entries.length && retainedVariants.length === result.routeVariants.length) continue;
		if (result === params.snapshot) result = { ...params.snapshot };
		result.entries = dedupeByKey(runtime === defaultRuntime ? [...rows, ...retainedEntries] : [...retainedEntries, ...rows], createModelCatalogIdentityKeyResolver());
		const variantKeyOf = createModelCatalogIdentityKeyResolver();
		result.routeVariants = dedupeByKey([...rows, ...retainedVariants], (entry) => modelCatalogRouteVariantKey(entry, variantKeyOf(entry)));
	}
	if (discovered) params.onDiscoveryCompleted?.(completedRows);
	return result;
}
function preparedHarnessCatalogScope(input) {
	const agentId = input.agentId ?? resolveDefaultAgentId(input.config);
	return {
		config: input.config,
		agentId,
		agentDir: input.agentDir,
		workspaceDir: input.workspaceDir ?? resolveAgentWorkspaceDir(input.config, agentId) ?? resolveDefaultAgentWorkspaceDir()
	};
}
function isPreparedNativeModelCatalogReady(params) {
	const { selection, snapshot, pluginGeneration } = params;
	if (!selection && params.catalogAcquired !== true) return false;
	if (!selection && !snapshot.routeVariants.some((entry) => entry.nativeRuntime)) return true;
	let scope;
	const readReady = (entry) => {
		const harness = pluginGeneration.pluginRegistry?.agentHarnesses.find((registration) => registration.harness.id === entry.nativeRuntime)?.harness;
		return !harness?.readModelCatalogReadiness || harness.readModelCatalogReadiness({
			...scope ??= preparedHarnessCatalogScope(params.input),
			provider: entry.provider,
			modelId: entry.id
		}) !== void 0;
	};
	return withPluginRuntimeGenerationScope({
		metadataSnapshot: pluginGeneration.pluginMetadataSnapshot,
		pluginRegistry: pluginGeneration.pluginRegistry
	}, () => {
		if (selection) {
			const matches = (entry) => entry.provider === selection.provider && entry.id === selection.modelId && entry.nativeRuntime === selection.runtime;
			const entry = snapshot.entries.find(matches) ?? snapshot.routeVariants.find(matches);
			return entry !== void 0 && readReady(entry);
		}
		return snapshot.routeVariants.every((entry) => !entry.nativeRuntime || snapshot.nativeProviderOutcomes && Object.hasOwn(snapshot.nativeProviderOutcomes, entry.nativeRuntime) && snapshot.nativeProviderOutcomes[entry.nativeRuntime]?.some((outcome) => outcome.provider === entry.provider && outcome.status !== "ready") || readReady(entry));
	});
}
function augmentPreparedModelCatalogWithAgentHarness(params) {
	const { input, ...catalogParams } = params;
	const { config, agentId, agentDir, workspaceDir } = preparedHarnessCatalogScope(input);
	return augmentModelCatalogWithAgentHarness({
		...catalogParams,
		cfg: config,
		agentId,
		agentDir,
		workspaceDir,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: resolveNativeModelPrimary(input.config, agentId),
		includePickerRuntimes: params.nativeSelection === void 0,
		observationConfig: input.config
	});
}
//#endregion
export { augmentPreparedModelCatalogWithAgentHarness as n, isPreparedNativeModelCatalogReady as r, augmentModelCatalogWithAgentHarness as t };
