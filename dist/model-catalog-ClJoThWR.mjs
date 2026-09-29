import { l as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import { r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { n as dedupeByKey } from "./provider-thinking-catalog-B0d_iUnw.mjs";
import { r as buildConfiguredModelCatalog, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { d as resolveModelCatalogIdentityKey, s as createModelCatalogIdentityKeyResolver } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { l as getActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import { n as getRegisteredAgentHarness } from "./registry-aYyey5ds.mjs";
import { t as resolveConfiguredModelEntries } from "./configured-model-entries-Bm-hrIsj.mjs";
import { n as collectPreparedModelRuntimeConfiguredRefs } from "./prepared-model-runtime.configured-BMNUMuvG.mjs";
import "./workspace-mlzi3k1x.mjs";
//#region src/agents/harness/model-catalog.ts
function normalizeRouteBaseUrl(value) {
	if (!value) return "";
	try {
		const url = new URL(value);
		url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
		return url.toString();
	} catch {
		return value.trim();
	}
}
function routeVariantKey(entry, identityKey) {
	return [
		identityKey,
		entry.nativeRuntime ?? "",
		entry.api ?? "",
		normalizeRouteBaseUrl(entry.baseUrl)
	].join("\0");
}
function mergeHarnessCompat(observed, provider) {
	if (!observed && !provider) return;
	const compat = {
		...provider,
		...observed
	};
	if (observed?.supportedReasoningEfforts?.length === 0) return {
		...compat,
		supportsReasoningEffort: false,
		supportedReasoningEfforts: []
	};
	const efforts = [.../* @__PURE__ */ new Set([...provider?.supportedReasoningEfforts ?? [], ...observed?.supportedReasoningEfforts ?? []])];
	return efforts.length > 0 ? {
		...compat,
		supportsReasoningEffort: true,
		supportedReasoningEfforts: efforts
	} : compat;
}
function enrichHarnessRows(rows, snapshot) {
	const keyOf = createModelCatalogIdentityKeyResolver();
	const routeDonors = /* @__PURE__ */ new Map();
	const identityDonors = /* @__PURE__ */ new Map();
	let donorsPrepared = false;
	return rows.map((entry) => {
		if (entry.nativeRuntime) return entry;
		if (!donorsPrepared) {
			for (const donor of [...snapshot.entries, ...snapshot.staticEntries ?? []]) {
				const identityKey = keyOf(donor);
				const routeKey = routeVariantKey(donor, identityKey);
				if (!routeDonors.has(routeKey)) routeDonors.set(routeKey, donor);
				if (!identityDonors.has(identityKey)) identityDonors.set(identityKey, donor);
			}
			donorsPrepared = true;
		}
		const identityKey = keyOf(entry);
		const donor = routeDonors.get(routeVariantKey(entry, identityKey)) ?? (entry.api === void 0 && entry.baseUrl === void 0 ? identityDonors.get(identityKey) : void 0);
		if (!donor) return entry;
		const compat = mergeHarnessCompat(entry.compat, donor.compat);
		const mergedParams = donor.params || entry.params ? {
			...donor.params,
			...entry.params
		} : void 0;
		return {
			...donor,
			...entry,
			...mergedParams ? { params: mergedParams } : {},
			...compat ? { compat } : {}
		};
	});
}
async function augmentModelCatalogWithAgentHarness(params) {
	const prepared = params.preparedSnapshot ?? params.snapshot;
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
		try {
			listedRows = await harness.loadModelCatalog({
				config: params.observationConfig ?? params.cfg,
				agentId: params.agentId,
				agentDir: params.agentDir,
				workspaceDir: params.workspaceDir,
				configuredModelRefs
			});
		} catch (error) {
			if (!isCurrent()) return params.snapshot;
			params.onError?.(error, scopedProviders);
			continue;
		}
		if (!isCurrent()) return params.snapshot;
		const includesProvider = params.includesProvider;
		const scopedRows = includesProvider ? listedRows.filter((entry) => includesProvider(entry.provider)) : listedRows;
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
		const retain = (entry) => entry.nativeRuntime !== runtime || configuredKeys.has(resolveModelCatalogIdentityKey(entry)) || includesProvider !== void 0 && !includesProvider(entry.provider);
		const retainedEntries = result.entries.filter(retain);
		const retainedVariants = result.routeVariants.filter(retain);
		if (rows.length === 0 && retainedEntries.length === result.entries.length && retainedVariants.length === result.routeVariants.length) continue;
		if (result === params.snapshot) result = { ...params.snapshot };
		result.entries = dedupeByKey(runtime === defaultRuntime ? [...rows, ...retainedEntries] : [...retainedEntries, ...rows], createModelCatalogIdentityKeyResolver());
		const variantKeyOf = createModelCatalogIdentityKeyResolver();
		result.routeVariants = dedupeByKey([...rows, ...retainedVariants], (entry) => routeVariantKey(entry, variantKeyOf(entry)));
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
	const { config, agentId, agentDir, workspaceDir } = preparedHarnessCatalogScope(params.input);
	return augmentModelCatalogWithAgentHarness({
		cfg: config,
		agentId,
		agentDir,
		workspaceDir,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: resolveAgentEffectiveModelPrimary(params.input.config, agentId),
		nativeSelection: params.nativeSelection,
		snapshot: params.snapshot,
		preparedSnapshot: params.preparedSnapshot,
		includePickerRuntimes: params.nativeSelection === void 0,
		pluginRegistry: params.pluginRegistry,
		isCurrent: params.isCurrent,
		observationConfig: params.input.config,
		includesProvider: params.includesProvider,
		onDiscoveryStarted: params.onDiscoveryStarted,
		onDiscoveryCompleted: params.onDiscoveryCompleted,
		onError: params.onError
	});
}
//#endregion
export { augmentPreparedModelCatalogWithAgentHarness as n, isPreparedNativeModelCatalogReady as r, augmentModelCatalogWithAgentHarness as t };
