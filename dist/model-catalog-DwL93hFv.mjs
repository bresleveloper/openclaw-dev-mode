import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { d as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, y as resolveNativeModelPrimary } from "./agent-scope-config-CDYpzA0r.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-Cwkw6Ed6.mjs";
import { r as DEFAULT_PROVIDER } from "./defaults-Jag53zwP.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { l as getActivePluginRegistry } from "./runtime-D4MkflNJ.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-BNE7YdYW.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { r as buildConfiguredModelCatalog, v as resolveModelRefFromString } from "./model-selection-shared-BZeDVoch.mjs";
import { a as resolveModelCatalogIdentityKey, t as createModelCatalogIdentityKeyResolver } from "./openai-model-routes-mS12tkxj.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BJNC949_.mjs";
import { t as copyProviderCatalogOutcomes } from "./provider-catalog-result-B_GZzKWr.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BUEqtPpd.mjs";
import { n as modelCatalogRouteVariantKey, t as enrichHarnessRows } from "./model-catalog-entry-CqW6R2Ff.mjs";
import { t as resolveConfiguredModelEntries } from "./configured-model-entries-CmPcCOdA.mjs";
import { n as collectPreparedModelRuntimeConfiguredRefs } from "./prepared-model-runtime.configured-B1Tizmkw.mjs";
import "./workspace-7iuzSwDh.mjs";
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
	if (!pluginRegistry || params.isCurrent?.() === false) return params.snapshot;
	const isCurrent = () => params.isCurrent?.() !== false && (Boolean(params.pluginRegistry) || getActivePluginRegistry() === pluginRegistry);
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
		if (params.isCurrent?.() === false) return params.snapshot;
		for (const provider of scopedProviders) params.onDiscoveryStarted?.(provider);
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
			if (!isCurrent()) return params.snapshot;
			params.onError?.(error, scopedProviders);
			continue;
		}
		if (!isCurrent()) return params.snapshot;
		const includesProvider = params.includesProvider;
		const scopedRows = includesProvider ? listedRows.filter((entry) => includesProvider(entry.provider)) : listedRows;
		const outsideScope = ({ provider }) => includesProvider !== void 0 && !includesProvider(provider);
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
	if (!isCurrent()) return params.snapshot;
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
	if (![...snapshot.entries, ...snapshot.routeVariants].some((entry) => entry.provider === selection.provider && entry.id === selection.modelId && entry.nativeRuntime === selection.runtime)) return false;
	const harness = pluginGeneration.pluginRegistry?.agentHarnesses.find((registration) => registration.harness.id === selection.runtime)?.harness;
	return !harness?.readModelCatalogReadiness || withPluginRuntimeGenerationScope({
		metadataSnapshot: pluginGeneration.pluginMetadataSnapshot,
		pluginRegistry: pluginGeneration.pluginRegistry
	}, () => harness.readModelCatalogReadiness?.({
		...preparedHarnessCatalogScope(params.input),
		provider: selection.provider,
		modelId: selection.modelId
	})) !== void 0;
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
