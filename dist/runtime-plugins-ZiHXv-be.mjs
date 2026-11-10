import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import "./utils-gjJ-tD2q.mjs";
import { d as withPluginRuntimeRegistryScope, g as getGatewayContextResolver, m as getCanonicalGatewayContextResolver, o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { i as hasRetainedPluginRuntimeCloseError } from "./runtime-close-error-DOUCCb00.mjs";
import { a as capturePluginLifecycleAuthority, d as getPluginRegistryGatewayOwner, i as bindPluginRegistryResourceOwner, m as isPluginRecordActive, n as bindPluginRegistryGatewayOwner, p as getPluginRegistryResourceOwner, x as isPluginRegistryRetired } from "./registry-lifecycle-CjTFYNkp.mjs";
import { n as getPluginInstance } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { f as getActivePluginRegistryWorkspaceDir, l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { p as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-LVFKT7eZ.mjs";
import { l as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { t as projectRuntimeChangesOntoSource } from "./source-value-projection-v5vH7oJ8.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-DAkjzBhe.mjs";
import { n as getPluginRegistryRuntime } from "./registry-runtime-binding-i7RQa2C4.mjs";
import { i as collectRegistryInvocationInstances, n as getPluginRegistryInspectionResources, r as PluginInvocationScope } from "./registry-inspection-resources-COvkPmap.mjs";
import { i as getPluginRuntimeLoadContext } from "./load-context-YqkPeFye.mjs";
import { a as registryContainsRuntimePluginIds, i as listRuntimePluginIdsFromRegistry, r as listLoadedRuntimePluginIds, t as createRuntimePluginManifestLookup } from "./active-runtime-registry-BrXk-dcA.mjs";
import { t as acquirePluginRegistryForInspection } from "./loader-runtime-load-DzFljQbT.mjs";
import { _ as adoptRuntimeContextEngineRegistrations } from "./registry-BNFZRyO5.mjs";
import { t as ensureGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import { i as resolveAgentRuntimePluginLoadPlan, o as resolveAgentRuntimePluginSelections } from "./runtime-plugin-load-plan-Cjd4Pbax.mjs";
import { n as loadPluginRegistryHandle } from "./loader-B8PRFJEU.mjs";
import { t as adoptRuntimeMemoryRegistrations } from "./memory-state-CrbG6eAa.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/runtime-plugin-work.ts
/** Mark finite host custody without granting execution or joining instance disposal. */
function retainRuntimePluginWork(registries) {
	const releases = [];
	const release = () => releases.splice(0).forEach((close) => close());
	try {
		const instances = /* @__PURE__ */ new Set();
		for (const registry of registries) for (const instance of collectRegistryInvocationInstances(registry)) if (!instances.has(instance)) {
			releases.push(instance.retainWork());
			instances.add(instance);
		}
		return release;
	} catch (error) {
		release();
		throw error;
	}
}
/** Keep replacement blocked through physical cleanup, including retained cleanup failures. */
async function releaseRuntimePluginWork(release, releaseWork) {
	try {
		await release?.();
	} catch (error) {
		if (!hasRetainedPluginRuntimeCloseError(error)) releaseWork();
		throw error;
	}
	releaseWork();
}
//#endregion
//#region src/decisions/registry-adoption.ts
/** Prepared Gateway views borrow the exact provider owner, not another circuit or admission pool. */
function adoptRuntimeDecisionProviders(target, runtime, config) {
	const preparedConfig = getPluginRuntimeLoadContext(runtime)?.activationSourceConfig;
	if (!preparedConfig || isPluginRegistryRetired(target) || isPluginRegistryRetired(runtime)) return target;
	let changed = false;
	const sourceConfig = projectConfigOntoRuntimeSourceSnapshot(config);
	const decisionProviders = target.decisionProviders.map((entry) => {
		const owner = runtime.decisionProviders.find((candidate) => candidate.pluginId === entry.pluginId && candidate.host.provider.id === entry.host.provider.id);
		const localRecord = target.plugins.find((record) => record.id === entry.pluginId);
		if (!owner || owner === entry || localRecord?.status !== "loaded" || !localRecord.enabled || localRecord.source !== owner.host.record.source || !isPluginRecordActive(runtime, owner.host.record) || !isDeepStrictEqual(sourceConfig.plugins?.entries?.[entry.pluginId]?.config, preparedConfig.plugins?.entries?.[entry.pluginId]?.config)) return entry;
		changed = true;
		return owner;
	});
	return changed ? {
		...target,
		decisionProviders
	} : target;
}
//#endregion
//#region src/plugins/channel-registry-adoption.ts
/** Capture before preparation awaits; a successor cannot become this request's donor. */
function captureRuntimeChannelSource(registry) {
	const isCurrent = registry && capturePluginLifecycleAuthority(registry);
	return registry && isCurrent ? {
		registry,
		isCurrent: () => getActivePluginRegistry() === registry && isCurrent()
	} : void 0;
}
function gatewayOwner(registry) {
	const runtime = getPluginRegistryRuntime(getPluginRegistryResourceOwner(registry));
	const resolver = runtime && getGatewayContextResolver(runtime);
	return resolver && getCanonicalGatewayContextResolver(resolver);
}
/** A prepared view selects channels; the matching live instance owns their transport state. */
function adoptRuntimeChannelRegistrations(target, source) {
	if (!source || target === source.registry || target.channels.length === 0) return target;
	if (!source.isCurrent()) throw new Error("Channel runtime owner changed during prepared registry admission");
	const donor = source.registry;
	const targetContext = getPluginRuntimeLoadContext(target);
	const donorContext = getPluginRuntimeLoadContext(donor);
	const donorGateway = gatewayOwner(donor);
	const caller = getPluginRuntimeGatewayRequestScope();
	const callerGateway = caller?.resolveGatewayContext ? getCanonicalGatewayContextResolver(caller.resolveGatewayContext) : caller?.pluginRegistry ? gatewayOwner(caller.pluginRegistry) : void 0;
	if (!targetContext || !donorContext || targetContext.env !== process.env || !isDeepStrictEqual({ ...targetContext.env }, { ...donorContext.env }) || !donorGateway || gatewayOwner(target) !== donorGateway || caller && callerGateway !== donorGateway || caller?.context && donorGateway() !== caller.context || targetContext.registrationConfigKey !== donorContext.registrationConfigKey || isPluginRegistryRetired(target)) return target;
	const manifests = targetContext.manifestRegistry?.plugins;
	const donorManifests = donorContext.manifestRegistry?.plugins;
	if (!manifests || !donorManifests) return target;
	const selectedTarget = createRuntimePluginManifestLookup(target, manifests, targetContext.preferBuiltPluginArtifacts);
	const selectedDonor = createRuntimePluginManifestLookup(donor, manifests, targetContext.preferBuiltPluginArtifacts);
	let changed = false;
	const channels = target.channels.map((entry) => {
		const record = selectedTarget(entry.pluginId);
		const donorRecord = selectedDonor(entry.pluginId);
		const local = record && getPluginInstance(record);
		const runtime = donorRecord && getPluginInstance(donorRecord);
		const registration = donor.channels.find((candidate) => candidate.pluginId === entry.pluginId && candidate.plugin.id === entry.plugin.id);
		if (!record?.enabled || !donorRecord || record === donorRecord || !local?.acceptingCalls || !runtime?.acceptingCalls || !registration || !isPluginRecordActive(donor, donorRecord) || local.sourceDigest !== runtime.sourceDigest || !isDeepStrictEqual(manifests.find((manifest) => manifest.id === entry.pluginId), donorManifests.find((manifest) => manifest.id === entry.pluginId))) return entry;
		const scoped = local.wrap(runtime.wrap(registration));
		changed = true;
		return {
			...scoped,
			borrowedRuntimeRecord: donorRecord
		};
	});
	if (!source.isCurrent()) throw new Error("Channel runtime owner changed during prepared registry admission");
	return changed ? {
		...target,
		channels
	} : target;
}
//#endregion
//#region src/plugins/tool-registry-adoption.ts
/** Tools borrow the Gateway instance whose services prepared their runtime. */
function adoptRuntimeToolRegistrations(target, runtime, config) {
	const preparedConfig = getPluginRuntimeLoadContext(runtime)?.activationSourceConfig;
	if (!preparedConfig || isPluginRegistryRetired(target) || isPluginRegistryRetired(runtime)) return target;
	const sourceConfig = projectConfigOntoRuntimeSourceSnapshot(config);
	const replacements = /* @__PURE__ */ new Map();
	for (const pluginId of new Set(target.tools.map((entry) => entry.pluginId))) {
		const localRecord = target.plugins.find((record) => record.id === pluginId);
		const runtimeRecord = runtime.plugins.find((record) => record.id === pluginId);
		if (localRecord?.status !== "loaded" || !localRecord.enabled || !runtimeRecord || localRecord.source !== runtimeRecord.source || !isPluginRecordActive(runtime, runtimeRecord) || !isDeepStrictEqual(sourceConfig.plugins?.entries?.[pluginId]?.config, preparedConfig.plugins?.entries?.[pluginId]?.config)) continue;
		const owned = groupByDeclaredIdentity(runtime.tools, pluginId);
		for (const [identity, locals] of groupByDeclaredIdentity(target.tools, pluginId)) {
			const donors = owned.get(identity);
			if (donors?.length !== locals.length) continue;
			locals.forEach((local, index) => {
				const donor = donors[index];
				if (donor && donor !== local) replacements.set(local, donor);
			});
		}
	}
	return replacements.size === 0 ? target : {
		...target,
		tools: target.tools.map((entry) => replacements.get(entry) ?? entry)
	};
}
/** Unnamed registrations have no comparable identity and stay with discovery. */
function groupByDeclaredIdentity(tools, pluginId) {
	const groups = /* @__PURE__ */ new Map();
	for (const entry of tools) {
		const names = [...new Set(entry.names)].toSorted();
		if (entry.pluginId !== pluginId || names.length === 0) continue;
		const identity = JSON.stringify([entry.optional, names]);
		groups.set(identity, [...groups.get(identity) ?? [], entry]);
	}
	return groups;
}
//#endregion
//#region src/plugins/widget-presenters.ts
function hasMatchingLoadedOwner(registration, targetRegistry, runtimeRegistry) {
	const target = targetRegistry.plugins.find((plugin) => plugin.id === registration.pluginId);
	const runtime = runtimeRegistry.plugins.find((plugin) => plugin.id === registration.pluginId);
	return target?.status === "loaded" && runtime?.status === "loaded" && target.source === runtime.source && registration.source === runtime.source;
}
/** Copies full-only presenters into a matching discovery registry without rerunning plugin code. */
function adoptRuntimeWidgetPresenterRegistrations(targetRegistry, runtimeRegistry) {
	const presenters = [...targetRegistry.widgetPresenters];
	let changed = false;
	for (const registration of runtimeRegistry.widgetPresenters) {
		if (!hasMatchingLoadedOwner(registration, targetRegistry, runtimeRegistry)) continue;
		if (!presenters.some((candidate) => registration.presenter.target === "current_channel" ? candidate.pluginId === registration.pluginId && candidate.presenter.target === registration.presenter.target : candidate.presenter.target === registration.presenter.target)) {
			presenters.push(registration);
			changed = true;
		}
	}
	return changed ? {
		...targetRegistry,
		widgetPresenters: presenters
	} : targetRegistry;
}
/** Returns presenter registrations from the exact request registry when available. */
function resolveWidgetPresenters() {
	const registry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry() ?? void 0;
	if (!registry) return [];
	const source = getPluginRegistryInspectionResources(registry);
	const ordinary = new PluginInvocationScope(registry, collectRegistryInvocationInstances(registry));
	return registry.widgetPresenters.map((registration) => {
		const adopted = source?.wrapAdoptedValue(registration.presenter) ?? registration.presenter;
		const presenter = adopted !== registration.presenter ? adopted : ordinary.wrap(adopted);
		return presenter === registration.presenter ? registration : Object.assign({}, registration, { presenter });
	});
}
//#endregion
//#region src/agents/runtime-plugins.ts
function resolveAgentRuntimePluginRegistryLoad(params) {
	const loadOptions = {
		config: params.config,
		activationSourceConfig: params.config && projectConfigOntoRuntimeSourceSnapshot(params.config),
		env: params.env,
		workspaceDir: typeof params.workspaceDir === "string" && params.workspaceDir.trim() ? resolveUserPath(params.workspaceDir) : void 0,
		runtimeOptions: params.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : void 0
	};
	if (params.config?.plugins?.enabled === false) return {
		...loadOptions,
		onlyPluginIds: []
	};
	const metadataSnapshot = params.metadataSnapshot ?? loadPluginMetadataSnapshot({
		config: params.config ?? {},
		env: params.env ?? process.env,
		workspaceDir: loadOptions.workspaceDir
	});
	const workspaceDir = metadataSnapshot.workspaceDir ?? loadOptions.workspaceDir;
	const requestPluginRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const activePluginIds = listLoadedRuntimePluginIds();
	const startupPluginIds = params.purpose === "isolated-completion" ? [] : params.purpose === "model-catalog" ? params.basePluginIds ?? [] : params.basePluginIds ?? (requestPluginRegistry ? listRuntimePluginIdsFromRegistry(requestPluginRegistry) : metadataSnapshot.pluginIds ?? (activePluginIds.length > 0 ? activePluginIds : void 0));
	const plan = resolveAgentRuntimePluginLoadPlan({
		config: params.config,
		workspaceDir: workspaceDir ?? process.cwd(),
		basePluginIds: startupPluginIds,
		selections: resolveAgentRuntimePluginSelections(params.config, params.selections ?? [], params.purpose === "model-catalog" || params.purpose === "isolated-completion" ? [] : params.configuredHarnessRuntimes),
		metadataSnapshot,
		...params.purpose ? { purpose: params.purpose } : {}
	});
	let activationSourceConfig = loadOptions.activationSourceConfig;
	if (plan.config !== params.config) activationSourceConfig = params.config && activationSourceConfig ? projectRuntimeChangesOntoSource(activationSourceConfig, params.config, plan.config) : plan.config;
	return {
		...loadOptions,
		config: plan.config,
		activationSourceConfig,
		workspaceDir,
		discovery: metadataSnapshot.discovery,
		installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(metadataSnapshot.index),
		manifestRegistry: metadataSnapshot.manifestRegistry,
		normalizePluginId: metadataSnapshot.normalizePluginId,
		preferBuiltPluginArtifacts: params.preferBuiltPluginArtifacts,
		onlyPluginIds: startupPluginIds === void 0 ? void 0 : plan.pluginIds,
		channelPluginLoadIntent: startupPluginIds === void 0 ? void 0 : "full",
		borrowRegistry: params.borrowRegistry,
		previousRegistry: params.purpose === "model-catalog" ? params.reusableRegistry : void 0
	};
}
function reusableAgentRuntimeRegistry(params, loadOptions) {
	const pluginIds = loadOptions.onlyPluginIds;
	return params.reusableRegistry && pluginIds !== void 0 && (params.purpose !== "model-catalog" && params.purpose !== "isolated-completion" || listRuntimePluginIdsFromRegistry(params.reusableRegistry).every((pluginId) => pluginIds.includes(pluginId))) && registryContainsRuntimePluginIds(params.reusableRegistry, pluginIds) ? params.reusableRegistry : void 0;
}
function adoptAgentRuntimeRegistrations(pluginRegistry, params, config, channelSource) {
	const activeRegistry = getActivePluginRegistry();
	if (params.purpose === "model-catalog" || params.purpose === "isolated-completion") return { registry: pluginRegistry };
	const canAdoptGatewayRegistrations = params.allowGatewaySubagentBinding === true && (params.env === void 0 || params.env === process.env);
	const channelRegistry = canAdoptGatewayRegistrations ? adoptRuntimeChannelRegistrations(pluginRegistry, channelSource) : pluginRegistry;
	const requestRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const toolDonor = requestRegistry && getPluginRegistryGatewayOwner(requestRegistry)?.current();
	const toolRegistry = toolDonor && config && canAdoptGatewayRegistrations ? adoptRuntimeToolRegistrations(channelRegistry, toolDonor, config) : channelRegistry;
	let registry = toolRegistry;
	if (activeRegistry) {
		const memoryRegistry = params.metadataSnapshot && params.workspaceDir && config && getActivePluginRegistryWorkspaceDir() === resolveUserPath(params.workspaceDir) ? adoptRuntimeMemoryRegistrations(toolRegistry, activeRegistry, config) : toolRegistry;
		registry = adoptRuntimeWidgetPresenterRegistrations(adoptRuntimeContextEngineRegistrations(config && canAdoptGatewayRegistrations ? adoptRuntimeDecisionProviders(memoryRegistry, activeRegistry, config) : memoryRegistry, activeRegistry), activeRegistry);
	}
	bindPluginRegistryResourceOwner(registry, pluginRegistry);
	return {
		registry: bindAdmittingGateway(registry),
		...activeRegistry && registry !== pluginRegistry ? { donor: activeRegistry } : {},
		...toolRegistry !== channelRegistry ? { toolDonor } : {}
	};
}
/** The admitting Gateway owns reload recovery for work that runs in a turn registry. */
function bindAdmittingGateway(registry) {
	const requestRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const admittingGateway = requestRegistry && getPluginRegistryGatewayOwner(requestRegistry);
	if (admittingGateway) bindPluginRegistryGatewayOwner(registry, admittingGateway, requestRegistry);
	return registry;
}
/** Prepared read-only owners reuse the load plan while owning fresh, uncached registrations. */
async function acquireAgentRuntimePluginRegistry(params) {
	const loadOptions = resolveAgentRuntimePluginRegistryLoad(params);
	const reusable = reusableAgentRuntimeRegistry(params, loadOptions);
	if (reusable) return {
		registry: bindAdmittingGateway(reusable),
		primaryRegistry: reusable
	};
	const acquire = () => acquirePluginRegistryForInspection(loadOptions);
	const channelSource = captureRuntimeChannelSource(getActivePluginRegistry());
	const acquired = await (params.metadataSnapshot ? withPluginMetadataSnapshotScope(params.metadataSnapshot, acquire) : acquire());
	let releaseWork = () => {};
	try {
		const { registry, donor, toolDonor } = adoptAgentRuntimeRegistrations(acquired.registry, params, loadOptions.config, channelSource);
		releaseWork = retainRuntimePluginWork([registry]);
		const primaryResources = getPluginRegistryInspectionResources(acquired.registry);
		if (!primaryResources) throw new Error("Acquired prepared registry has no registration resource owner");
		if (registry !== acquired.registry) primaryResources.attach(registry);
		if (donor || toolDonor) {
			primaryResources.adoptInvocations(registry, donor);
			const toolResources = toolDonor && getPluginRegistryInspectionResources(toolDonor);
			if (toolResources && toolDonor !== donor) primaryResources.retainDependency(toolResources);
		}
		return {
			registry,
			primaryRegistry: acquired.registry,
			resources: primaryResources,
			releaseRegistry: acquired.release,
			releaseWork
		};
	} catch (error) {
		try {
			await releaseRuntimePluginWork(acquired.release, releaseWork);
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], "Prepared registry acquisition and cleanup failed", { cause: cleanupError });
		}
		throw error;
	}
}
/** Loads the registry handle owned by an agent prepared-runtime generation. */
function loadAgentRuntimePluginRegistryHandle(params, onPrimaryRegistry) {
	const loadOptions = resolveAgentRuntimePluginRegistryLoad(params);
	const reusable = reusableAgentRuntimeRegistry(params, loadOptions);
	if (reusable) {
		onPrimaryRegistry?.(reusable);
		return bindAdmittingGateway(reusable);
	}
	const load = () => loadPluginRegistryHandle(loadOptions);
	const channelSource = captureRuntimeChannelSource(getActivePluginRegistry());
	const pluginRegistry = params.metadataSnapshot ? withPluginMetadataSnapshotScope(params.metadataSnapshot, load) : load();
	onPrimaryRegistry?.(pluginRegistry);
	return adoptAgentRuntimeRegistrations(pluginRegistry, params, loadOptions.config, channelSource).registry;
}
/** Binds a scoped plugin generation when a direct host has no Gateway owner. */
async function withAgentPluginRegistry(params) {
	const requestPluginRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	if (requestPluginRegistry && params.selections === void 0) return await params.run(requestPluginRegistry);
	const [{ setPluginRuntimeLoadContext }, { resolvePluginRuntimeLoadContext }] = await Promise.all([import("./load-context-CHJ_llo0.mjs"), import("./load-context.resolve-D4j4FbHA.mjs")]);
	const context = resolvePluginRuntimeLoadContext({
		config: params.config,
		activationSourceConfig: projectConfigOntoRuntimeSourceSnapshot(params.config),
		env: params.env,
		workspaceDir: params.workspaceDir,
		...params.config.plugins?.enabled === false ? { manifestRegistry: {
			plugins: [],
			diagnostics: []
		} } : { metadataSnapshot: loadPluginMetadataSnapshot(params) }
	});
	const pluginRegistry = loadAgentRuntimePluginRegistryHandle({
		config: params.config,
		env: context.env,
		metadataSnapshot: context.metadataSnapshot,
		selections: params.selections,
		workspaceDir: params.workspaceDir
	});
	setPluginRuntimeLoadContext(pluginRegistry, context);
	ensureGlobalHookRunner();
	const invocations = new PluginInvocationScope(pluginRegistry, collectRegistryInvocationInstances(pluginRegistry));
	return await withPluginRuntimeRegistryScope(pluginRegistry, () => invocations.run(() => params.run(pluginRegistry)));
}
//#endregion
export { releaseRuntimePluginWork as a, resolveWidgetPresenters as i, loadAgentRuntimePluginRegistryHandle as n, retainRuntimePluginWork as o, withAgentPluginRegistry as r, acquireAgentRuntimePluginRegistry as t };
