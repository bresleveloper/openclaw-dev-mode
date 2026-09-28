import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { n as hasRetainedPluginRuntimeCloseError } from "./runtime-close-error-CYO2S35x.mjs";
import { a as getGatewayContextResolver, r as getCanonicalGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { i as getPluginRuntimeGatewayRequestScope, l as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { d as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-D0kh4WcK.mjs";
import { l as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { i as projectRuntimeChangesOntoSource, n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-D2uZ1zpS.mjs";
import { d as isPluginRecordActive, h as isPluginRegistryRetired, i as capturePluginLifecycleAuthority, r as bindPluginRegistryResourceOwner, u as getPluginRegistryResourceOwner } from "./registry-lifecycle-xdpzLZzd.mjs";
import { f as getActivePluginRegistryWorkspaceDir, l as getActivePluginRegistry } from "./runtime-B2zZQffc.mjs";
import { t as acquirePluginRegistryForInspection } from "./loader-runtime-load-DitY2Htf.mjs";
import { n as getPluginRegistryRuntime } from "./registry-runtime-binding-i7RQa2C4.mjs";
import { a as listRuntimePluginIdsFromRegistry, i as listLoadedRuntimePluginIds, o as registryContainsRuntimePluginIds, t as createRuntimePluginManifestLookup } from "./active-runtime-registry-k2s7FqfS.mjs";
import { f as getPluginRegistryInspectionResources, g as adoptRuntimeContextEngineRegistrations, m as collectRegistryInvocationInstances, p as PluginInvocationScope } from "./registry-BKkCbmgx.mjs";
import { r as getPluginRuntimeLoadContext } from "./load-context-D-CZ4KSw.mjs";
import { a as resolveAgentRuntimePluginSelections, i as resolveAgentRuntimePluginLoadPlan } from "./runtime-plugin-load-plan-CJ0f8mTH.mjs";
import { r as loadPluginRegistryHandle } from "./loader-CidXT38G.mjs";
import { t as adoptRuntimeMemoryRegistrations } from "./memory-state-CGjwGUK0.mjs";
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
		if (!record?.enabled || !donorRecord || !local?.acceptingCalls || !runtime?.acceptingCalls || !registration || !isPluginRecordActive(donor, donorRecord) || local.sourceDigest !== runtime.sourceDigest || !isDeepStrictEqual(manifests.find((manifest) => manifest.id === entry.pluginId), donorManifests.find((manifest) => manifest.id === entry.pluginId))) return entry;
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
	const startupPluginIds = params.purpose === "model-catalog" ? params.basePluginIds ?? [] : params.basePluginIds ?? (requestPluginRegistry ? listRuntimePluginIdsFromRegistry(requestPluginRegistry) : metadataSnapshot.pluginIds ?? (activePluginIds.length > 0 ? activePluginIds : void 0));
	const plan = resolveAgentRuntimePluginLoadPlan({
		config: params.config,
		workspaceDir: workspaceDir ?? process.cwd(),
		basePluginIds: startupPluginIds,
		selections: resolveAgentRuntimePluginSelections(params.config, params.selections ?? [], params.purpose === "model-catalog" ? [] : params.configuredHarnessRuntimes),
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
		preferBuiltPluginArtifacts: params.preferBuiltPluginArtifacts,
		onlyPluginIds: startupPluginIds === void 0 ? void 0 : plan.pluginIds,
		channelPluginLoadIntent: startupPluginIds === void 0 ? void 0 : "full"
	};
}
function reusableAgentRuntimeRegistry(params, loadOptions) {
	const pluginIds = loadOptions.onlyPluginIds;
	return params.reusableRegistry && pluginIds !== void 0 && (params.purpose !== "model-catalog" || listRuntimePluginIdsFromRegistry(params.reusableRegistry).every((pluginId) => pluginIds.includes(pluginId))) && registryContainsRuntimePluginIds(params.reusableRegistry, pluginIds) ? params.reusableRegistry : void 0;
}
function adoptAgentRuntimeRegistrations(pluginRegistry, params, config, channelSource) {
	const activeRegistry = getActivePluginRegistry();
	if (params.purpose === "model-catalog") return { registry: pluginRegistry };
	const channelRegistry = params.allowGatewaySubagentBinding === true && (params.env === void 0 || params.env === process.env) ? adoptRuntimeChannelRegistrations(pluginRegistry, channelSource) : pluginRegistry;
	if (!activeRegistry) return { registry: channelRegistry };
	const memoryRegistry = params.metadataSnapshot && params.workspaceDir && config && getActivePluginRegistryWorkspaceDir() === resolveUserPath(params.workspaceDir) ? adoptRuntimeMemoryRegistrations(channelRegistry, activeRegistry, config) : channelRegistry;
	const registry = bindPluginRegistryResourceOwner(adoptRuntimeWidgetPresenterRegistrations(adoptRuntimeContextEngineRegistrations(config && params.allowGatewaySubagentBinding === true && (params.env === void 0 || params.env === process.env) ? adoptRuntimeDecisionProviders(memoryRegistry, activeRegistry, config) : memoryRegistry, activeRegistry), activeRegistry), pluginRegistry);
	return {
		registry,
		...registry !== pluginRegistry ? { donor: activeRegistry } : {}
	};
}
/** Prepared read-only owners reuse the load plan while owning fresh, uncached registrations. */
async function acquireAgentRuntimePluginRegistry(params) {
	const loadOptions = resolveAgentRuntimePluginRegistryLoad(params);
	const reusable = reusableAgentRuntimeRegistry(params, loadOptions);
	if (reusable) return {
		registry: reusable,
		primaryRegistry: reusable
	};
	const acquire = () => acquirePluginRegistryForInspection(loadOptions);
	const channelSource = captureRuntimeChannelSource(getActivePluginRegistry());
	const acquired = await (params.metadataSnapshot ? withPluginMetadataSnapshotScope(params.metadataSnapshot, acquire) : acquire());
	let releaseWork = () => {};
	try {
		const { registry, donor } = adoptAgentRuntimeRegistrations(acquired.registry, params, loadOptions.config, channelSource);
		releaseWork = retainRuntimePluginWork([registry]);
		const primaryResources = getPluginRegistryInspectionResources(acquired.registry);
		if (!primaryResources) throw new Error("Acquired prepared registry has no registration resource owner");
		if (registry !== acquired.registry) primaryResources.attach(registry);
		if (donor) primaryResources.adoptInvocations(registry, donor);
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
		return reusable;
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
	const [{ setPluginRuntimeLoadContext }, { resolvePluginRuntimeLoadContext }] = await Promise.all([import("./load-context-C7k-fho6.mjs"), import("./load-context.resolve-DoB98wly.mjs")]);
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
	const invocations = new PluginInvocationScope(pluginRegistry, collectRegistryInvocationInstances(pluginRegistry));
	return await withPluginRuntimeRegistryScope(pluginRegistry, () => invocations.run(() => params.run(pluginRegistry)));
}
//#endregion
export { releaseRuntimePluginWork as a, resolveWidgetPresenters as i, loadAgentRuntimePluginRegistryHandle as n, retainRuntimePluginWork as o, withAgentPluginRegistry as r, acquireAgentRuntimePluginRegistry as t };
