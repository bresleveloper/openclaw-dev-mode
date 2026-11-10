import { N as PluginSourceRecoveryUnavailableError, T as retirePluginCache, k as withPluginCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { d as withPluginRuntimeRegistryScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { r as getPluginRegistryVersion } from "./runtime-state-Cd-Ga9cg.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { A as withPluginRegistryPreparationScope } from "./registry-lifecycle-CjTFYNkp.mjs";
import { n as getPluginInstance } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { $ as withPluginHostCleanupTimeout, T as waitForPluginRegistryRetirement } from "./runtime-DkPagH0y.mjs";
import { o as prepareGatewayPluginMetadataSnapshotPublication } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { F as waitForGatewayRestartFenceSettlement, l as getGatewayRestartDrainSignal } from "./gateway-work-admission-FWbk4b3p.mjs";
import { t as isCoreCanvasHostEnabled } from "./config-DvrkJSoS.mjs";
import { i as withCoreCanvasNodeCapability } from "./constants-Cm4bJJ1Q.mjs";
import { i as resolveConfigWidePluginMetadataSnapshotAsync } from "./io.plugin-metadata-DeOUS5WQ.mjs";
import { i as listAmbientOnlyConfiguredChannelIds } from "./channel-presence-policy-hdzky3AO.mjs";
import "./io-DIF-KW3P.mjs";
import { d as reconcileClientPluginNodeCapabilities, o as indexPluginNodeCapabilitySurfaces, u as prepareClientPluginNodeCapabilities } from "./plugin-node-capability-3KBblmAq.mjs";
import { n as listPluginNodeCapabilities } from "./route-capability-D3mP9gle.mjs";
import { i as getPluginRuntimeLoadContext } from "./load-context-YqkPeFye.mjs";
import { n as capturePluginRuntimeRecovery } from "./plugin-runtime-artifact-binding-CqK5OPco.mjs";
import { t as PluginLoadFailureError } from "./loader-shared-yt0SORbS.mjs";
import { t as isChannelStartupSuppressedByEnvironment } from "./server-sidecar-startup-mode-BZT1Vmld.mjs";
import { r as resolveGatewayStartupPluginActivationConfig } from "./plugin-activation-runtime-config-DNccnd-0.mjs";
import { i as validateConfiguredBindings } from "./configured-binding-registry-QGs3UeEc.mjs";
import { t as loadPluginLookUpTable } from "./plugin-lookup-table-tLBMDcKE.mjs";
import { c as prepareMemoryRuntimeReload } from "./memory-runtime-CXcwwGi2.mjs";
import { i as prepareDecisionProviderReload } from "./runtime-CncTig96.mjs";
import { a as getPluginRuntimeGeneration, i as createPluginRuntimeApplication, n as PluginRuntimeApplicationError } from "./lifecycle-CvcKJfYf.mjs";
import { r as startPluginServices } from "./services-Do95f9n7.mjs";
import { l as createPluginReloadCleanup, t as GatewayConfigReloadSupersededError, u as createPluginReloadDiagnostics } from "./server-reload-contracts-PZxFCbkh.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-plugin-reload-channels.ts
/** Keeps channel admission and route handoffs with one plugin reload operation. */
function createPluginReloadChannels({ channelManager, previousRegistry, skipChannels, previousStopStarted, reloadParams, ambientEnvTriggers }) {
	const channelTargets = /* @__PURE__ */ new Set();
	let releaseChannelStarts;
	const stopChannel = (channelId) => channelManager.stopChannel(channelId, void 0, {
		manual: false,
		strict: true,
		routeHandoff: true
	});
	const attempt = async (errors, run) => {
		try {
			await run();
		} catch (error) {
			errors.push(error);
		}
	};
	const startReplacedChannels = async (registry, errors, targets = channelTargets) => {
		for (const { plugin } of registry.channels) {
			if (skipChannels || !targets.has(plugin.id)) continue;
			await attempt(errors, async () => {
				const failures = [...await channelManager.startChannel(plugin.id, void 0, {
					reason: "plugin-reload",
					manual: false,
					preserveManualStop: true,
					skipUnavailableAccounts: true
				})].filter(([accountId, outcome]) => outcome.status === "retry" && (previousStopStarted() || outcome.reason !== "task-owned" || !channelManager.hasCurrentAccountTask(plugin.id, accountId)));
				if (failures.length) throw new Error(`Plugin channel ${plugin.id} could not start: ${failures.map(([id]) => id).join(", ")}`);
			});
		}
	};
	const releaseChannelHandoffs = async (errors, targets = channelTargets) => {
		for (const channelId of targets) await attempt(errors, () => channelManager.releaseChannelRouteHandoffs(channelId));
	};
	const collectTargets = (nextRegistry, changedPluginIds) => {
		if (previousRegistry.commands.some((entry) => !nextRegistry.commands.includes(entry)) || nextRegistry.commands.some((entry) => !previousRegistry.commands.includes(entry))) for (const channel of previousRegistry.channels) channelTargets.add(channel.plugin.id);
		for (const channel of [...previousRegistry.channels, ...nextRegistry.channels]) if (changedPluginIds.has(channel.pluginId)) channelTargets.add(channel.plugin.id);
	};
	const stopAdditional = async (nextRegistry, changedPluginIds) => {
		const additionalChannels = /* @__PURE__ */ new Set();
		const commandsChanged = previousRegistry.commands.some((entry) => !nextRegistry.commands.includes(entry)) || nextRegistry.commands.some((entry) => !previousRegistry.commands.includes(entry));
		for (const { plugin, pluginId } of [...previousRegistry.channels, ...nextRegistry.channels]) if ((commandsChanged || changedPluginIds.has(pluginId)) && !channelTargets.has(plugin.id)) {
			additionalChannels.add(plugin.id);
			channelTargets.add(plugin.id);
		}
		if (additionalChannels.size) {
			const releaseAdditional = channelManager.pauseChannelStarts(additionalChannels);
			const releasePrevious = releaseChannelStarts;
			releaseChannelStarts = (outcome, selected) => {
				releasePrevious?.(outcome, selected);
				releaseAdditional(outcome, selected);
			};
			for (const channelId of additionalChannels) await stopChannel(channelId);
		}
	};
	const stopPrevious = async (resourceHandoffIds, errors, cleanup) => {
		for (const { plugin, pluginId } of previousRegistry.channels) {
			if (!channelTargets.has(plugin.id)) continue;
			const stop = () => stopChannel(plugin.id);
			if (resourceHandoffIds.has(pluginId)) await attempt(errors, stop);
			else await cleanup(`Plugin channel ${plugin.id} cleanup failed`, stop);
		}
	};
	return {
		channelTargets,
		stopPrevious,
		collectTargets,
		stopAdditional,
		startReplacedChannels,
		startPublishedChannels: async (registry, errors, manifestRecords) => {
			try {
				channelManager.setAmbientAutostartSuppressedChannelIds(new Set(ambientEnvTriggers === "suppress" ? listAmbientOnlyConfiguredChannelIds({
					config: reloadParams.nextConfig,
					activationSourceConfig: reloadParams.sourceConfig,
					env: reloadParams.env,
					includePersistedAuthState: false,
					manifestRecords
				}) : []));
				await startReplacedChannels(registry, errors);
			} finally {
				await releaseChannelHandoffs(errors);
			}
		},
		releaseChannelHandoffs,
		restoreUnchanged: async (changedPluginIds, errors) => {
			if (!releaseChannelStarts) return;
			const callableIds = new Set(previousRegistry.plugins.filter((record) => !changedPluginIds.has(record.id) && getPluginInstance(record)?.acceptingCalls).map((record) => record.id));
			const targets = new Set(previousRegistry.channels.filter(({ plugin, pluginId }) => channelTargets.has(plugin.id) && callableIds.has(pluginId)).map(({ plugin }) => plugin.id));
			releaseChannelStarts("rollback", targets);
			try {
				await startReplacedChannels(previousRegistry, errors, targets);
			} finally {
				await releaseChannelHandoffs(errors, targets);
			}
		},
		pause: () => {
			releaseChannelStarts = channelManager.pauseChannelStarts(channelTargets);
		},
		release: (outcome) => {
			releaseChannelStarts?.(outcome);
			releaseChannelStarts = void 0;
		}
	};
}
//#endregion
//#region src/gateway/server-plugin-reload-recovery.ts
/** Owns one operation's old source, excluding runtimes retired before it began. */
function createPluginReloadRecovery(previousRegistry, preparePlugins) {
	const moduleRecoveries = /* @__PURE__ */ new Map();
	const previouslyUnavailableIds = new Set(previousRegistry.plugins.filter((record) => record.status === "error" || getPluginInstance(record)?.disposing).map((record) => record.id));
	const selectedUnavailableIds = /* @__PURE__ */ new Set();
	const previousHookIds = /* @__PURE__ */ new Set();
	return {
		get previousHookIds() {
			return previousHookIds;
		},
		get unavailablePluginIds() {
			return new Set([...selectedUnavailableIds].filter((id) => !previouslyUnavailableIds.has(id)));
		},
		capture(pluginIds) {
			const warnings = [];
			for (const record of previousRegistry.plugins) {
				if (!pluginIds.has(record.id)) continue;
				if (previouslyUnavailableIds.has(record.id)) {
					selectedUnavailableIds.add(record.id);
					continue;
				}
				previousHookIds.add(record.id);
				try {
					const recovery = capturePluginRuntimeRecovery(record);
					if (recovery) moduleRecoveries.set(record.id, recovery);
				} catch (error) {
					if (!(error instanceof PluginSourceRecoveryUnavailableError)) throw error;
					selectedUnavailableIds.add(record.id);
					warnings.push(`Plugin ${record.id} captured source is missing. Continuing replacement; rollback cannot restore this plugin's previous code.`);
				}
			}
			return warnings;
		},
		async prepare(params, cause) {
			const retainedErrorIds = new Set(previousRegistry.plugins.filter((record) => selectedUnavailableIds.has(record.id) && record.status === "error").map((record) => record.id));
			const recoveryParams = {
				...params,
				pluginIds: previousRegistry.plugins.filter((record) => !selectedUnavailableIds.has(record.id) || retainedErrorIds.has(record.id)).map((record) => record.id),
				replacePluginIds: new Set([...params.replacePluginIds ?? []].filter((id) => !retainedErrorIds.has(id))),
				moduleRecoveries
			};
			if (selectedUnavailableIds.size) {
				const plan = await preparePlugins({
					...recoveryParams,
					loadModules: false
				});
				plan.retireGatewayRuntimeBindings();
				const unavailable = plan.pluginRegistry.plugins.filter((record) => selectedUnavailableIds.has(record.id) && record.enabled && record.status === "loaded");
				if (unavailable.length) throw new Error(`Plugin recovery requires previously retired runtimes without captured source: ${unavailable.map((record) => record.id).join(", ")}`, { cause });
			}
			return preparePlugins(recoveryParams);
		},
		async dispose() {
			const results = await Promise.allSettled([...moduleRecoveries.values()].map((recovery) => recovery.module.dispose()));
			moduleRecoveries.clear();
			const errors = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw new AggregateError(errors, "Plugin reload recovery cleanup failed");
		}
	};
}
/** Select old owners whose registrations cannot be retained by this reload. */
function resolvePluginReloadReplacementIds(previousRegistry, requestedIds, changedPaths) {
	const replacePluginIds = new Set(requestedIds);
	for (const record of previousRegistry.plugins) if (changedPaths.some((key) => key === `plugins.entries.${record.id}` || key.startsWith(`plugins.entries.${record.id}.`) || key === `plugins.installs.${record.id}` || key.startsWith(`plugins.installs.${record.id}.`))) replacePluginIds.add(record.id);
	return replacePluginIds;
}
//#endregion
//#region src/gateway/server-plugin-reload-services.ts
function createPluginReloadServices(runtime, stopServices) {
	const generation = runtime.kernel.pluginRuntimeGeneration;
	const start = (registry, config, onHandle, deferStartForPluginIds) => withPluginRegistryPreparationScope(registry, () => startPluginServices({
		scheduler: runtime.scheduler,
		registry,
		config,
		workspaceDir: runtime.pluginWorkspaceDir,
		broadcastPluginEvent: runtime.broadcastPluginEvent,
		getCronService: runtime.kernel.getCronService,
		previous: generation.currentServices(),
		onHandle,
		throwOnStartError: true,
		deferStartForPluginIds
	}));
	return {
		start,
		async resumeMemory(memory, config, rollback = false) {
			if (!memory) return;
			const restartPluginIds = rollback ? memory.rollback() : memory.retainedPluginIds;
			if (!rollback) memory.commit(runtime.pluginRuntime.registry);
			if (restartPluginIds.size === 0) return;
			if (rollback) await stopServices(generation.currentServices(), true, restartPluginIds);
			await start(runtime.pluginRuntime.registry, config, (handle) => generation.publishServices(generation.currentClaim(), handle));
		}
	};
}
//#endregion
//#region src/gateway/server-plugin-reload.ts
async function reloadGatewayPlugins({ runtime, port, log, loadGatewayPluginBootstrapModule, prepareAttachedPluginRuntime }, params) {
	const restartDrainSignal = getGatewayRestartDrainSignal();
	const drainSignal = params.pluginLifecycle?.waitForDrain && params.pluginLifecycle.drainSignal ? AbortSignal.any([restartDrainSignal, params.pluginLifecycle.drainSignal]) : restartDrainSignal;
	const { prepareGatewayPluginLoad: preparePlugins } = await loadGatewayPluginBootstrapModule();
	const { pluginRuntime, kernel, pluginWorkspaceDir, runtimeState, ambientEnvTriggers, workerEnvironmentStartup, coreGatewayMethodNames, pluginHostServices, baseMethods, resolvePluginGatewayContext, channelManager, clients, broadcast } = runtime;
	const previousRegistry = pluginRuntime.registry;
	const previousConfig = readRuntimeConfig();
	const previousServices = kernel.pluginRuntimeGeneration.currentServices();
	const previousMetadata = runtime.pluginMetadataSnapshot;
	const previousLoadContext = getPluginRuntimeLoadContext(previousRegistry);
	const recovery = createPluginReloadRecovery(previousRegistry, preparePlugins);
	const sharedLoadParams = {
		workspaceDir: pluginWorkspaceDir,
		log,
		coreGatewayMethodNames,
		hostServices: pluginHostServices,
		baseMethods,
		ambientEnvTriggers,
		resolveGatewayContext: resolvePluginGatewayContext,
		loadIntent: "replacement",
		previousRegistry
	};
	const cache = createPluginCache();
	const operationId = params.pluginLifecycle?.operationId ?? randomUUID();
	const requestedIds = new Set(params.pluginLifecycle?.pluginIds ?? []);
	const { warnings, recordWarning, recordCleanup, cleanup } = createPluginReloadDiagnostics(log);
	const replacePluginIds = resolvePluginReloadReplacementIds(previousRegistry, [...requestedIds, ...params.reloadPluginIds ?? []], params.changedPaths);
	let phase = "prepare";
	let previousStopStarted = false;
	let previousHooksStopped = false;
	let previousCleanupFailed = false;
	let committed = false;
	let restored = false;
	let candidateServices;
	let loaded;
	let decisionReplacement;
	let memoryReplacement;
	const changedPluginIds = new Set(replacePluginIds);
	let resourceHandoffIds = /* @__PURE__ */ new Set();
	let releaseResourceHandoff;
	const sidecarReplacements = [];
	let rollbackConfigEffects;
	const channels = createPluginReloadChannels({
		channelManager,
		previousRegistry,
		skipChannels: isChannelStartupSuppressedByEnvironment(params.env ?? {}),
		previousStopStarted: () => previousStopStarted,
		reloadParams: params,
		ambientEnvTriggers
	});
	const { channelTargets, startReplacedChannels, releaseChannelHandoffs } = channels;
	const { attempt, stopPreviousServices, isBlockingStopError, rethrowServiceStopTimeout, includeServiceStopFailure, assertResourceHandoff, selectResourceHandoff, drainInstances, drainMemory, drainRetainedWork, drainBeforeReplacement, quiesceInstances, resumeInstances, drainForRecovery, disposeInstances, runLifecycleHooks, prepareRegistrationFailureCleanup, retireUnpublished } = createPluginReloadCleanup({
		previousRegistry,
		changedPluginIds,
		waitForDrain: params.pluginLifecycle?.waitForDrain,
		port,
		pluginWorkspaceDir,
		abortSignal: AbortSignal.any([runtime.requestEntryLifetime.signal, restartDrainSignal]),
		log,
		getCron: kernel.getCronService,
		recordCleanup,
		recordWarning,
		retainRetirement: (retire) => kernel.pluginMetadata.retire(cache, retire)
	});
	const replacement = kernel.pluginRuntimeGeneration.reserve();
	const assertCurrent = () => {
		drainSignal.throwIfAborted();
		params.assertInvokerOwned?.();
		if (params.isAborted?.()) throw new GatewayConfigReloadSupersededError();
	};
	const services = createPluginReloadServices(runtime, stopPreviousServices);
	const checkpoint = async () => {
		await params.checkpoint?.();
		assertCurrent();
	};
	try {
		await checkpoint();
		recordCleanup(await withPluginHostCleanupTimeout("pending plugin retirement", () => kernel.pluginMetadata.waitForRetirement()));
		await checkpoint();
		const nextMetadata = await withPluginCache(cache, () => resolveConfigWidePluginMetadataSnapshotAsync({
			config: params.sourceConfig,
			env: params.env,
			allowCurrent: false
		}));
		await checkpoint();
		const activationConfig = resolveGatewayStartupPluginActivationConfig({
			runtimeConfig: params.nextConfig,
			activationSourceConfig: params.sourceConfig,
			env: params.env,
			manifestRegistry: nextMetadata.manifestRegistry,
			discovery: nextMetadata.discovery,
			ambientEnvTriggers
		});
		const lookup = withPluginCache(cache, () => loadPluginLookUpTable({
			config: activationConfig,
			workspaceDir: pluginWorkspaceDir,
			env: params.env,
			activationSourceConfig: params.sourceConfig,
			metadataSnapshot: nextMetadata,
			workerProviderIds: workerEnvironmentStartup?.listDurableProviderIds() ?? [],
			ambientEnvTriggers
		}));
		const loadParams = {
			...sharedLoadParams,
			cfg: params.nextConfig,
			activationSourceConfig: params.sourceConfig,
			pluginLookUpTable: lookup,
			pluginMetadataSnapshot: nextMetadata,
			replacePluginIds,
			expectedSourceDigests: params.pluginLifecycle?.expectedSourceDigests,
			prepareRegistrationFailureCleanup: prepareRegistrationFailureCleanup(params.nextConfig),
			env: params.env
		};
		const preflight = await withPluginCache(cache, () => preparePlugins({
			...loadParams,
			loadModules: false
		}));
		preflight.retireGatewayRuntimeBindings();
		let nextRegistry = preflight.pluginRegistry;
		resourceHandoffIds = selectResourceHandoff(nextRegistry, requestedIds);
		channels.collectTargets(nextRegistry, changedPluginIds);
		for (const warning of recovery.capture(changedPluginIds)) {
			log.warn(warning);
			recordWarning(warning);
		}
		await checkpoint();
		releaseResourceHandoff = assertResourceHandoff(resourceHandoffIds);
		const configEffects = params.prepareConfigEffects({
			pluginIds: changedPluginIds,
			channels: channelTargets
		});
		rollbackConfigEffects = configEffects.rollback;
		phase = "drain";
		replacement.setReloadStatus({
			phase: "reloading",
			pluginIds: [...changedPluginIds]
		});
		await drainRetainedWork(resourceHandoffIds, drainSignal, replacement.setReloadStatus);
		await checkpoint();
		decisionReplacement = prepareDecisionProviderReload(previousRegistry, changedPluginIds);
		channels.pause();
		quiesceInstances();
		await drainRetainedWork(resourceHandoffIds, drainSignal, replacement.setReloadStatus, { includeCalls: true });
		await checkpoint();
		configEffects.retire();
		for (const sidecar of runtimeState.gatewayLifetimeSidecars.snapshot()) {
			const prepared = sidecar.preparePluginReload?.({
				previousRegistry,
				nextRegistry,
				changedPluginIds,
				nextConfig: params.nextConfig
			});
			if (prepared) sidecarReplacements.push(prepared);
		}
		memoryReplacement = prepareMemoryRuntimeReload(previousRegistry, nextRegistry);
		for (const sidecar of sidecarReplacements) await sidecar.drain();
		await drainMemory(memoryReplacement.drain);
		await runtimeState.discovery?.update({ gatewayDiscoveryServices: previousRegistry.gatewayDiscoveryServices.filter((entry) => !changedPluginIds.has(entry.pluginId)) });
		await drainBeforeReplacement(resourceHandoffIds, drainSignal, replacement.setReloadStatus, checkpoint);
		await checkpoint();
		replacement.setReloadStatus({
			phase: "reloading",
			pluginIds: [...changedPluginIds]
		});
		previousStopStarted = true;
		const stopErrors = [];
		const stopOwner = (strict, label, run) => strict ? attempt(stopErrors, run) : cleanup(label, run);
		await channels.stopPrevious(resourceHandoffIds, stopErrors, cleanup);
		const strictServiceStop = resourceHandoffIds.size > 0 || memoryReplacement.retainedPluginIds.size > 0;
		const serviceStopIds = /* @__PURE__ */ new Set([...changedPluginIds, ...memoryReplacement.retainedPluginIds]);
		await stopOwner(strictServiceStop, "Plugin service cleanup failed", () => stopPreviousServices(previousServices, strictServiceStop, serviceStopIds));
		previousCleanupFailed = stopErrors.some(isBlockingStopError);
		await drainInstances(previousRegistry, resourceHandoffIds);
		rethrowServiceStopTimeout();
		previousHooksStopped = true;
		await stopOwner(resourceHandoffIds.size > 0, "Plugin stop hook failed", () => runLifecycleHooks(previousRegistry, false, previousConfig, recovery.previousHookIds));
		await attempt(stopErrors, () => disposeInstances(previousRegistry, resourceHandoffIds));
		if (stopErrors.length) {
			previousCleanupFailed = true;
			throw new AggregateError(stopErrors, `Previous plugin cleanup failed; automatic recovery could not safely start: ${stopErrors.map(formatErrorMessage).join("; ")}`);
		}
		await checkpoint();
		phase = "activate";
		loaded = await withPluginCache(cache, () => preparePlugins(loadParams));
		nextRegistry = loaded.pluginRegistry;
		const { resolvedConfig } = loaded;
		const activationCleanup = [];
		const attached = await prepareAttachedPluginRuntime(loaded, (completion) => activationCleanup.push(completion));
		const publishMetadata = prepareGatewayPluginMetadataSnapshotPublication(nextMetadata, {
			config: params.nextConfig,
			compatibleConfigs: [params.sourceConfig, activationConfig],
			env: params.env,
			workspaceDir: pluginWorkspaceDir
		});
		const surfaces = withCoreCanvasNodeCapability(listPluginNodeCapabilities(nextRegistry), isCoreCanvasHostEnabled(params.nextConfig));
		const indexedSurfaces = indexPluginNodeCapabilitySurfaces(surfaces);
		withPluginRegistryPreparationScope(nextRegistry, () => withPluginRuntimeRegistryScope(nextRegistry, () => validateConfiguredBindings(resolvedConfig)));
		await channels.stopAdditional(nextRegistry, changedPluginIds);
		await checkpoint();
		const startedServices = await services.start(nextRegistry, params.nextConfig, (handle) => {
			candidateServices = handle;
		}, memoryReplacement.retainedPluginIds);
		await checkpoint();
		const activationErrors = [];
		try {
			await params.commitRuntime({
				publish: () => {
					assertCurrent();
					const publishCapabilities = [...clients].map((client) => prepareClientPluginNodeCapabilities({
						client,
						surfaces,
						changedPluginIds,
						...client.connect.role === "node" ? { allowedSurfaces: new Set(client.connect.caps ?? []) } : {}
					}));
					attached.publish();
					kernel.pluginMetadata.publish(nextMetadata, changedPluginIds, (options) => waitForPluginRegistryRetirement(previousRegistry, options));
					publishMetadata();
					runtime.pluginMetadataSnapshot = nextMetadata;
					replacement.commit();
					kernel.pluginRuntimeGeneration.publishServices(replacement.claim, startedServices);
					for (const client of clients) reconcileClientPluginNodeCapabilities(client, indexedSurfaces);
					for (const publish of publishCapabilities) publish();
					committed = true;
					log.info(`Plugin replacement applied: ${[...changedPluginIds].join(", ")}`);
					channels.release("published");
				},
				afterCommit: () => {
					try {
						broadcast("plugins.changed", { generation: getPluginRegistryVersion(nextRegistry) }, { dropIfSlow: true });
					} catch (error) {
						activationErrors.push(error);
					}
					attached.afterCommit();
				}
			});
		} catch (error) {
			if (!committed) throw error;
			activationErrors.push(error);
		} finally {
			await Promise.allSettled(activationCleanup);
		}
		if (committed) {
			await attempt(activationErrors, () => services.resumeMemory(memoryReplacement, params.nextConfig));
			for (const sidecar of sidecarReplacements) await attempt(activationErrors, () => sidecar.resume(params.nextConfig));
			await attempt(activationErrors, () => runtimeState.discovery?.update({ gatewayDiscoveryServices: nextRegistry.gatewayDiscoveryServices }, replacement.claim));
		}
		await attempt(activationErrors, () => runLifecycleHooks(nextRegistry, true, params.nextConfig));
		await attempt(activationErrors, () => channels.startPublishedChannels(nextRegistry, activationErrors, nextMetadata.manifestRegistry.plugins));
		if (activationErrors.length > 0) throw activationErrors.length === 1 ? activationErrors[0] : new AggregateError(activationErrors, activationErrors.map(formatErrorMessage).join("; "));
		phase = "dispose";
		recordCleanup(await waitForPluginRegistryRetirement(previousRegistry, { deferConsumers: true }));
		recordCleanup(await kernel.pluginMetadata.waitForRetirement());
		const receipt = createPluginRuntimeApplication({
			operationId,
			generation: getPluginRuntimeGeneration(),
			registry: nextRegistry,
			pluginIds: changedPluginIds,
			reloadPluginIds: params.pluginLifecycle?.reason === "reload" ? requestedIds : void 0,
			warnings: [...warnings]
		});
		return {
			activeChannels: new Set(nextRegistry.channels.map((entry) => entry.plugin.id)),
			runtime: receipt
		};
	} catch (error) {
		let failure = includeServiceStopFailure(error);
		const onCleanupFailure = (message) => (cleanupError) => {
			failure = new AggregateError([failure, cleanupError], message);
		};
		replacement.reject();
		if (!committed) {
			const candidateRegistry = loaded?.pluginRegistry ?? (error instanceof PluginLoadFailureError ? error.registry : void 0);
			let candidateCleanupFailed = false;
			if (candidateServices) kernel.pluginRuntimeGeneration.publishServices(kernel.pluginRuntimeGeneration.currentClaim(), candidateServices);
			if (candidateRegistry) try {
				await retireUnpublished(candidateRegistry, params.nextConfig, candidateServices);
			} catch (cleanupError) {
				candidateCleanupFailed = true;
				onCleanupFailure("Plugin candidate cleanup failed; automatic recovery could not safely start")(cleanupError);
			}
			loaded?.retireGatewayRuntimeBindings();
			if (candidateRegistry) await withPluginHostCleanupTimeout("plugin candidate retirement", () => kernel.pluginMetadata.waitForRetirement()).then(recordCleanup).catch(onCleanupFailure("Plugin candidate cleanup failed"));
			else await retirePluginCache(cache).catch(onCleanupFailure("Plugin candidate cache cleanup failed"));
			if (phase !== "prepare") await waitForGatewayRestartFenceSettlement();
			if (phase !== "prepare" && !restartDrainSignal.aborted && !candidateCleanupFailed && !previousCleanupFailed) {
				const recoveryErrors = [];
				let recovered;
				let recoveredServices;
				let recoveryPublished = false;
				try {
					let restoredRegistry = previousRegistry;
					if (previousStopStarted) {
						await drainForRecovery(restartDrainSignal, replacement.setReloadStatus);
						if (!previousHooksStopped) {
							previousHooksStopped = true;
							await runLifecycleHooks(previousRegistry, false, previousConfig, recovery.previousHookIds);
						}
						await disposeInstances(previousRegistry, changedPluginIds);
						recovered = await recovery.prepare({
							...sharedLoadParams,
							cfg: previousConfig,
							activationSourceConfig: previousLoadContext?.activationSourceConfig ?? previousConfig,
							pluginMetadataSnapshot: previousMetadata,
							replacePluginIds: changedPluginIds,
							prepareRegistrationFailureCleanup: prepareRegistrationFailureCleanup(previousConfig),
							env: previousLoadContext?.env ?? params.env
						}, error);
						restoredRegistry = recovered.pluginRegistry;
						const recoveryActivationCleanup = [];
						const attached = await prepareAttachedPluginRuntime(recovered, (completion) => recoveryActivationCleanup.push(completion));
						await withPluginRegistryPreparationScope(restoredRegistry, async () => {
							await attempt(recoveryErrors, async () => {
								await services.start(restoredRegistry, previousConfig, (handle) => {
									recoveredServices = handle;
									kernel.pluginRuntimeGeneration.publishServices(kernel.pluginRuntimeGeneration.currentClaim(), handle);
								}, memoryReplacement?.retainedPluginIds);
							});
							try {
								attached.publish();
								recoveryPublished = true;
								attached.afterCommit();
							} finally {
								await Promise.allSettled(recoveryActivationCleanup);
							}
						});
						await attempt(recoveryErrors, () => services.resumeMemory(memoryReplacement, previousConfig));
						broadcast("plugins.changed", { generation: getPluginRegistryVersion(restoredRegistry) }, { dropIfSlow: true });
					} else {
						releaseResourceHandoff?.();
						resumeInstances();
						await attempt(recoveryErrors, () => services.resumeMemory(memoryReplacement, previousConfig, true));
					}
					for (const sidecar of sidecarReplacements) await attempt(recoveryErrors, () => sidecar.resume(previousConfig));
					await attempt(recoveryErrors, () => runtimeState.discovery?.update({ gatewayDiscoveryServices: restoredRegistry.gatewayDiscoveryServices }, kernel.pluginRuntimeGeneration.currentClaim()));
					if (previousStopStarted) await attempt(recoveryErrors, () => runLifecycleHooks(restoredRegistry, true, previousConfig));
					if (recoveryErrors.length === 0) {
						if (!previousStopStarted) await decisionReplacement?.rollback(restartDrainSignal);
						channels.release("rollback");
						await startReplacedChannels(restoredRegistry, recoveryErrors);
					}
				} catch (recoveryError) {
					recoveryErrors.push(recoveryError);
					const failedRecoveryRegistry = recovered?.pluginRegistry ?? (recoveryError instanceof PluginLoadFailureError ? recoveryError.registry : void 0);
					if (!recoveryPublished && failedRecoveryRegistry) {
						await attempt(recoveryErrors, () => retireUnpublished(failedRecoveryRegistry, previousConfig, recoveredServices));
						recovered?.retireGatewayRuntimeBindings();
						await attempt(recoveryErrors, async () => {
							recordCleanup(await withPluginHostCleanupTimeout("plugin recovery retirement", () => kernel.pluginMetadata.waitForRetirement()));
						});
					}
				} finally {
					await releaseChannelHandoffs(recoveryErrors);
				}
				restored = recoveryErrors.length === 0;
				if (recoveryErrors.length > 0) {
					const recoveryError = recoveryErrors.length === 1 ? recoveryErrors[0] : new AggregateError(recoveryErrors, recoveryErrors.map(formatErrorMessage).join("; "));
					failure = new AggregateError([failure, recoveryError], "Plugin replacement failed and its previous instance could not be restored.");
				}
			}
			if (phase !== "prepare" && !restartDrainSignal.aborted) {
				const retainedChannelErrors = [];
				await channels.restoreUnchanged(changedPluginIds, retainedChannelErrors);
				if (retainedChannelErrors.length) failure = new AggregateError([failure, ...retainedChannelErrors], "Plugin replacement failed and an unchanged channel could not resume.");
				try {
					await rollbackConfigEffects?.();
				} catch (rollbackError) {
					restored = false;
					onCleanupFailure("Plugin runtime rollback could not republish the model runtime")(rollbackError);
				}
			}
		} else await kernel.pluginMetadata.waitForRetirement().catch(onCleanupFailure("Previous plugin cache cleanup failed"));
		throw new PluginRuntimeApplicationError(`Plugin operation failed during ${phase}: ${formatErrorMessage(failure)}`, {
			operationId,
			generation: getPluginRuntimeGeneration(),
			pluginIds: [...changedPluginIds].toSorted(),
			phase,
			committed
		}, { cause: failure });
	} finally {
		releaseResourceHandoff?.();
		channels.release("failed");
		const activated = phase === "dispose";
		replacement.finishReload(activated ? "applied" : restored ? "restored" : phase === "prepare" ? "unchanged" : "failed", changedPluginIds, pluginRuntime.registry, recovery.unavailablePluginIds, restartDrainSignal.aborted ? void 0 : log.error);
		await recovery.dispose();
	}
}
//#endregion
export { reloadGatewayPlugins };
