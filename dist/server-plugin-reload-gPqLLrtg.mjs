import { C as retirePluginCache, D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as getPluginRegistryVersion } from "./runtime-state-C5tDvNBc.mjs";
import { l as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { o as prepareGatewayPluginMetadataSnapshotPublication } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { i as resolveConfigWidePluginMetadataSnapshotAsync } from "./io.plugin-metadata-DPc05JSs.mjs";
import { a as PluginInstanceDrainTimeoutError, s as PluginSourceRecoveryUnavailableError } from "./plugin-generation-artifact-VyjUi6ei.mjs";
import "./backoff-CszdOMiF.mjs";
import { r as listAmbientOnlyConfiguredChannelIds } from "./channel-presence-policy-C83ks5im.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
import { j as waitForGatewayRestartFenceSettlement, s as getGatewayRestartDrainSignal } from "./gateway-work-admission-CHv_0noy.mjs";
import { S as withPluginRegistryPreparationScope } from "./registry-lifecycle-xdpzLZzd.mjs";
import { E as waitForPluginRegistryRetirement, o as disposePluginRegistryInstances } from "./runtime-B2zZQffc.mjs";
import { n as withPluginHostCleanupTimeout, t as PluginHostCleanupTimeoutError } from "./host-hook-cleanup-timeout-CuGfY1se.mjs";
import { l as capturePluginRuntimeRecovery } from "./active-runtime-registry-k2s7FqfS.mjs";
import { t as createHookRunner } from "./hooks-DuXrq03h.mjs";
import { t as PluginLoadFailureError } from "./loader-shared-CminlXwi.mjs";
import { r as getPluginRuntimeLoadContext } from "./load-context-D-CZ4KSw.mjs";
import { i as validateConfiguredBindings } from "./configured-binding-registry-CFlh3sPP.mjs";
import { i as withCoreCanvasNodeCapability } from "./constants-Cm4bJJ1Q.mjs";
import { t as loadPluginLookUpTable } from "./plugin-lookup-table-M18rSVFs.mjs";
import { o as prepareMemoryRuntimeReload } from "./memory-runtime-Dxg3qwYx.mjs";
import { t as isCoreCanvasHostEnabled } from "./config-VMD9Rb60.mjs";
import { d as reconcileClientPluginNodeCapabilities, o as indexPluginNodeCapabilitySurfaces, u as prepareClientPluginNodeCapabilities } from "./plugin-node-capability-BUbmEXwy.mjs";
import { i as withPluginHttpRouteRegistry } from "./http-registry-Am1C83T4.mjs";
import { i as prepareDecisionProviderReload } from "./runtime-COFnHPEE.mjs";
import { i as getPluginRuntimeGeneration, n as PluginRuntimeApplicationError } from "./lifecycle-BeHJ-l7R.mjs";
import { r as resolveGatewayStartupPluginActivationConfig } from "./plugin-activation-runtime-config-8zX3nnmq.mjs";
import { n as getPluginServiceCleanupSettlement, r as startPluginServices, t as PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS } from "./services-CYuhG2DB.mjs";
import { t as GatewayConfigReloadSupersededError } from "./server-reload-contracts-BKTBnxfS.mjs";
import { n as listPluginNodeCapabilities } from "./route-capability-BlWqoZBl.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-plugin-reload-channels.ts
/** Keeps channel admission and route handoffs with one plugin reload operation. */
function createPluginReloadChannels({ channelManager, previousRegistry, skipChannels, previousStopStarted, reloadParams, ambientEnvTriggers }) {
	const channelTargets = /* @__PURE__ */ new Set();
	let releaseChannelStarts;
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
			for (const channelId of additionalChannels) await channelManager.stopChannel(channelId, void 0, {
				manual: false,
				strict: true,
				routeHandoff: true
			});
		}
	};
	const stopPrevious = async (resourceHandoffIds, errors, cleanup) => {
		for (const { plugin, pluginId } of previousRegistry.channels) {
			if (!channelTargets.has(plugin.id)) continue;
			const stop = () => channelManager.stopChannel(plugin.id, void 0, {
				manual: false,
				strict: true,
				routeHandoff: true
			});
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
//#region src/gateway/server-plugin-reload-cleanup.ts
const PLUGIN_RELOAD_ADMITTED_WORK_TIMEOUT_MS = 6e4;
var PluginAdmittedWorkTimeoutError = class extends Error {
	constructor(pluginIds, cause) {
		const ids = [...pluginIds].join(", ");
		super(`plugin ${ids} admitted work did not settle within 60s; the previous plugin generation stays active. Retry \`openclaw plugins reload ${[...pluginIds].join(" ")}\` after that work finishes.`, { cause });
	}
};
/** Owns resource handoff and rejected-registration cleanup for one reload transaction. */
function createPluginReloadCleanup({ previousRegistry, changedPluginIds, port, pluginWorkspaceDir, getCron, abortSignal, log, recordCleanup, retainRetirement }) {
	let pendingServiceCleanup;
	const attempt = async (errors, run) => {
		try {
			await run();
		} catch (error) {
			errors.push(error);
		}
	};
	const drainInstances = async (registry, pluginIds, includeConsumers = true, isObservationCurrent) => {
		for (const record of registry.plugins) {
			if (!pluginIds.has(record.id)) continue;
			if (isObservationCurrent?.() === false) return;
			const result = await withPluginHostCleanupTimeout(`plugin ${record.id} admitted work`, () => getPluginInstance(record)?.drain({ includeConsumers }));
			if (result?.errors.length) throw new AggregateError(result.errors, `Plugin ${record.id} work did not drain`);
		}
	};
	const drainWithDeadline = async (pluginIds, signal, reportStatus, phase) => {
		const deadlineAtMs = Date.now() + PLUGIN_RELOAD_ADMITTED_WORK_TIMEOUT_MS;
		reportStatus({
			phase,
			pluginIds: [...changedPluginIds],
			deadlineAtMs,
			reason: phase === "recovering" ? "Waiting for cleanup and admitted work before restoring the previous plugin runtime." : `Waiting for admitted work of plugin ${[...pluginIds].join(", ")} before replacing it.`
		});
		let backoffMs = 1e3;
		for (;;) {
			signal.throwIfAborted();
			let observing = true;
			try {
				await withPluginHostCleanupTimeout(phase === "recovering" ? "previous plugin recovery drain" : "previous plugin admitted work", async () => {
					if (phase === "recovering") await pendingServiceCleanup?.settled;
					await drainInstances(previousRegistry, pluginIds, phase === "recovering", phase === "reloading" ? () => observing : void 0);
				}, Math.max(0, Math.min(5e3, deadlineAtMs - Date.now()))).finally(() => {
					observing = false;
				});
				return;
			} catch (error) {
				if (!(error instanceof PluginHostCleanupTimeoutError)) throw error;
				const remainingMs = deadlineAtMs - Date.now();
				if (remainingMs <= 0) {
					if (phase === "reloading") throw error;
					throw new Error("Previous plugin work did not settle before the recovery deadline", { cause: error });
				}
				await sleepWithAbort(Math.min(backoffMs, remainingMs), signal);
				backoffMs = Math.min(backoffMs * 2, 4e3);
			}
		}
	};
	const disposeInstances = async (registry, pluginIds) => {
		const failures = [];
		for (const record of registry.plugins) {
			if (!pluginIds.has(record.id)) continue;
			await attempt(failures, async () => {
				const errors = await withPluginHostCleanupTimeout(`plugin ${record.id} resources`, async () => {
					return collectResourceFailures((await getPluginInstance(record)?.dispose())?.errors ?? []);
				});
				failures.push(...errors);
			});
		}
		if (failures.length) throw new AggregateError(failures, "Plugin resource cleanup failed");
	};
	const runLifecycleHooks = async (registry, start, config, pluginIds = changedPluginIds) => {
		const hooks = createHookRunner({
			...registry,
			typedHooks: registry.typedHooks.filter((hook) => pluginIds.has(hook.pluginId))
		}, {
			logger: log,
			catchErrors: false,
			voidHookTimeoutMsByHook: {
				gateway_start: PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS,
				gateway_stop: PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS
			}
		});
		const context = {
			port,
			config,
			workspaceDir: pluginWorkspaceDir,
			getCron,
			...start ? { abortSignal } : {}
		};
		await withPluginHttpRouteRegistry(registry, () => start ? hooks.runGatewayStart({ port }, context) : hooks.runGatewayStop({ reason: "plugin replacement" }, context));
	};
	const prepareRegistrationFailureCleanup = (config) => (registry, record) => {
		const stopHooks = registry.typedHooks.filter((hook) => hook.pluginId === record.id && hook.hookName === "gateway_stop");
		if (stopHooks.length) {
			const cleanupRegistry = {
				...registry,
				typedHooks: stopHooks
			};
			getPluginInstance(record)?.lifecycle.onDispose(() => runLifecycleHooks(cleanupRegistry, false, config));
		}
	};
	const retireUnpublished = async (registry, config, services) => {
		const errors = [];
		retainRetirement(async () => {
			const failures = [];
			await attempt(failures, async () => {
				await services?.stop({
					strict: true,
					pluginIds: changedPluginIds
				});
			});
			const result = await disposePluginRegistryInstances(registry, previousRegistry);
			for (const { error, hookId } of result.failures) failures.push(...hookId === "instance" ? await collectResourceFailures([error]) : [error]);
			if (failures.length) throw new AggregateError(failures, "Unpublished plugin resource cleanup failed");
			return result;
		});
		for (const record of registry.plugins) if (!previousRegistry.plugins.includes(record)) {
			const instance = getPluginInstance(record);
			if (!instance?.disposing) {
				prepareRegistrationFailureCleanup(config)(registry, record);
				instance?.quiesce();
			}
		}
		await attempt(errors, async () => {
			await services?.stop({
				strict: true,
				deadlineAtMs: Date.now() + PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS,
				pluginIds: changedPluginIds
			});
		});
		await attempt(errors, async () => {
			const result = await withPluginHostCleanupTimeout("unpublished plugin resources", () => disposePluginRegistryInstances(registry, previousRegistry));
			recordCleanup(result);
			errors.push(...result.failures.map((entry) => entry.error));
		});
		if (errors.length) throw new AggregateError(errors, "Unpublished plugin resource cleanup failed");
	};
	return {
		attempt,
		stopPreviousServices: async (services, strict) => {
			try {
				await services?.stop({
					strict: true,
					deadlineAtMs: Date.now() + PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS,
					pluginIds: changedPluginIds
				});
			} catch (error) {
				pendingServiceCleanup = strict ? getPluginServiceCleanupSettlement(error) : void 0;
				throw error;
			}
		},
		selectResourceHandoff: (nextRegistry, requestedIds) => {
			const retainedRecords = new Set(nextRegistry.plugins);
			changedPluginIds.clear();
			for (const pluginId of [
				...requestedIds,
				...previousRegistry.plugins.filter((record) => !retainedRecords.has(record)).map((record) => record.id),
				...nextRegistry.plugins.filter((record) => !previousRegistry.plugins.includes(record)).map((record) => record.id)
			]) changedPluginIds.add(pluginId);
			return new Set(nextRegistry.plugins.filter((record) => changedPluginIds.has(record.id) && record.enabled && record.status === "loaded" && record.format !== "bundle" && previousRegistry.plugins.some((previous) => previous.id === record.id && getPluginInstance(previous))).map((record) => record.id));
		},
		isBlockingStopError: (error) => !pendingServiceCleanup || error !== pendingServiceCleanup.error,
		rethrowServiceStopTimeout: () => {
			if (pendingServiceCleanup) throw pendingServiceCleanup.error;
		},
		includeServiceStopFailure: (error) => pendingServiceCleanup && pendingServiceCleanup.error !== error ? new AggregateError([pendingServiceCleanup.error, error], "Previous plugin cleanup failed") : error,
		reserveResourceHandoff: (pluginIds) => {
			const releases = [];
			const release = () => releases.splice(0).forEach((close) => close());
			try {
				for (const record of previousRegistry.plugins) {
					const instance = pluginIds.has(record.id) && getPluginInstance(record);
					if (instance) releases.push(instance.reserveReplacement());
				}
			} catch (error) {
				release();
				throw error;
			}
			return release;
		},
		drainInstances,
		drainBeforeReplacement: async (pluginIds, signal, reportStatus) => {
			if (pluginIds.size) await drainWithDeadline(pluginIds, signal, reportStatus, "reloading");
		},
		drainForRecovery: async (signal, reportStatus) => {
			await drainWithDeadline(changedPluginIds, signal, reportStatus, "recovering");
		},
		disposeInstances,
		runLifecycleHooks,
		prepareRegistrationFailureCleanup,
		retireUnpublished
	};
}
async function collectResourceFailures(errors) {
	const failures = [];
	for (const error of errors) if (error instanceof PluginInstanceDrainTimeoutError) await error.settled;
	else failures.push(error);
	return failures;
}
/** Keeps cleanup warnings bounded in receipts while retaining full diagnostic logs. */
function createPluginReloadDiagnostics(log) {
	const warnings = /* @__PURE__ */ new Set();
	const recordWarning = (warning) => {
		if (warnings.size < 8) warnings.add(truncateUtf16Safe(warning, 240));
		else warnings.add("Additional plugin cleanup warnings were recorded in the Gateway log.");
	};
	const recordCleanup = (result) => {
		for (const pluginId of result.deferredPluginIds ?? []) {
			const warning = `Plugin ${pluginId} cleanup is deferred until its admitted work finishes.`;
			log.info(warning);
			recordWarning(warning);
		}
		for (const failure of result.failures) recordWarning(`Plugin ${failure.pluginId} cleanup failed (${failure.hookId}): ${formatErrorMessage(failure.error)}`);
	};
	const cleanup = async (label, run) => {
		try {
			await run();
		} catch (error) {
			const warning = `${label}: ${formatErrorMessage(error)}`;
			log.warn(warning);
			recordWarning(warning);
		}
	};
	return {
		warnings,
		recordWarning,
		recordCleanup,
		cleanup
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
		prepare(params, cause) {
			const retainedErrorIds = new Set(previousRegistry.plugins.filter((record) => selectedUnavailableIds.has(record.id) && record.status === "error").map((record) => record.id));
			const recoveryParams = {
				...params,
				pluginIds: previousRegistry.plugins.filter((record) => !selectedUnavailableIds.has(record.id) || retainedErrorIds.has(record.id)).map((record) => record.id),
				replacePluginIds: new Set([...params.replacePluginIds ?? []].filter((id) => !retainedErrorIds.has(id))),
				moduleRecoveries
			};
			if (selectedUnavailableIds.size) {
				const plan = preparePlugins({
					...recoveryParams,
					loadModules: false
				});
				plan.retireGatewayRuntimeBindings();
				const unavailable = plan.pluginRegistry.plugins.filter((record) => selectedUnavailableIds.has(record.id) && record.enabled && record.status === "loaded");
				if (unavailable.length) throw new Error(`Plugin recovery requires previously retired runtimes without captured source: ${unavailable.map((record) => record.id).join(", ")}`, { cause });
			}
			return preparePlugins(recoveryParams);
		},
		dispose() {
			for (const recovery of moduleRecoveries.values()) recovery.module.dispose();
			moduleRecoveries.clear();
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
//#region src/gateway/server-plugin-reload.ts
async function reloadGatewayPlugins({ runtime, port, log, loadGatewayPluginBootstrapModule, prepareAttachedPluginRuntime }, params) {
	const restartDrainSignal = getGatewayRestartDrainSignal();
	const { prepareGatewayPluginLoad: preparePlugins } = await loadGatewayPluginBootstrapModule();
	const { pluginRuntime, kernel, pluginWorkspaceDir, runtimeState, ambientEnvTriggers, workerEnvironmentStartup, coreGatewayMethodNames, pluginHostServices, baseMethods, resolvePluginGatewayContext, channelManager, broadcastPluginEvent, clients, broadcast } = runtime;
	const previousRegistry = pluginRuntime.registry;
	const previousConfig = getRuntimeConfig();
	const previousServices = kernel.pluginRuntimeGeneration.currentServices();
	const previousMetadata = runtime.pluginMetadataSnapshot;
	const previousLoadContext = getPluginRuntimeLoadContext(previousRegistry);
	const recovery = createPluginReloadRecovery(previousRegistry, preparePlugins);
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
	const sidecarReplacements = [];
	const quiescedInstances = [];
	let rollbackConfigEffects;
	let releaseResourceHandoff;
	const channels = createPluginReloadChannels({
		channelManager,
		previousRegistry,
		skipChannels: isTruthyEnvValue(params.env?.OPENCLAW_SKIP_CHANNELS) || isTruthyEnvValue(params.env?.OPENCLAW_SKIP_PROVIDERS),
		previousStopStarted: () => previousStopStarted,
		reloadParams: params,
		ambientEnvTriggers
	});
	const { channelTargets, startReplacedChannels, releaseChannelHandoffs } = channels;
	const { attempt, stopPreviousServices, isBlockingStopError, rethrowServiceStopTimeout, includeServiceStopFailure, reserveResourceHandoff, selectResourceHandoff, drainInstances, drainBeforeReplacement, drainForRecovery, disposeInstances, runLifecycleHooks, prepareRegistrationFailureCleanup, retireUnpublished } = createPluginReloadCleanup({
		previousRegistry,
		changedPluginIds,
		port,
		pluginWorkspaceDir,
		abortSignal: AbortSignal.any([runtime.requestEntryLifetime.signal, restartDrainSignal]),
		log,
		getCron: kernel.getCronService,
		recordCleanup,
		retainRetirement: (retire) => kernel.pluginMetadata.retire(cache, retire)
	});
	const replacement = kernel.pluginRuntimeGeneration.reserve();
	const assertCurrent = () => {
		params.assertInvokerOwned?.();
		if (params.isAborted?.()) throw new GatewayConfigReloadSupersededError();
	};
	try {
		await params.checkpoint?.();
		assertCurrent();
		recordCleanup(await withPluginHostCleanupTimeout("pending plugin retirement", () => kernel.pluginMetadata.waitForRetirement()));
		await params.checkpoint?.();
		assertCurrent();
		const nextMetadata = await withPluginCache(cache, () => resolveConfigWidePluginMetadataSnapshotAsync({
			config: params.sourceConfig,
			env: params.env,
			allowCurrent: false
		}));
		await params.checkpoint?.();
		assertCurrent();
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
			cfg: params.nextConfig,
			activationSourceConfig: params.sourceConfig,
			workspaceDir: pluginWorkspaceDir,
			log,
			coreGatewayMethodNames,
			hostServices: pluginHostServices,
			baseMethods,
			pluginLookUpTable: lookup,
			pluginMetadataSnapshot: nextMetadata,
			ambientEnvTriggers,
			resolveGatewayContext: resolvePluginGatewayContext,
			loadIntent: "replacement",
			previousRegistry,
			replacePluginIds,
			expectedSourceDigests: params.pluginLifecycle?.expectedSourceDigests,
			prepareRegistrationFailureCleanup: prepareRegistrationFailureCleanup(params.nextConfig),
			env: params.env
		};
		const preflight = withPluginCache(cache, () => preparePlugins({
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
		await params.checkpoint?.();
		assertCurrent();
		releaseResourceHandoff = reserveResourceHandoff(resourceHandoffIds);
		rollbackConfigEffects = params.prepareConfigEffects({
			pluginIds: changedPluginIds,
			channels: channelTargets
		});
		phase = "drain";
		replacement.setReloadStatus({
			phase: "reloading",
			pluginIds: [...changedPluginIds]
		});
		channels.pause();
		decisionReplacement = prepareDecisionProviderReload(previousRegistry, changedPluginIds);
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
		try {
			const result = await memoryReplacement.drain();
			for (const error of result.errors) {
				const warning = `Memory cleanup failed: ${formatErrorMessage(error)}`;
				log.warn(warning);
				recordWarning(warning);
			}
		} catch (error) {
			if (!(error instanceof PluginHostCleanupTimeoutError)) throw error;
			log.warn(error.message);
			recordWarning(error.message);
		}
		await runtimeState.discovery?.update({ gatewayDiscoveryServices: previousRegistry.gatewayDiscoveryServices.filter((entry) => !changedPluginIds.has(entry.pluginId)) });
		for (const record of previousRegistry.plugins) if (changedPluginIds.has(record.id)) {
			const instance = getPluginInstance(record);
			if (instance?.quiesce()) quiescedInstances.push(instance);
		}
		try {
			await drainBeforeReplacement(resourceHandoffIds, restartDrainSignal, replacement.setReloadStatus);
		} catch (error) {
			if (error instanceof PluginHostCleanupTimeoutError) throw new PluginAdmittedWorkTimeoutError(resourceHandoffIds, error);
			throw error;
		}
		assertCurrent();
		replacement.setReloadStatus({
			phase: "reloading",
			pluginIds: [...changedPluginIds]
		});
		previousStopStarted = true;
		const stopErrors = [];
		const stopOwner = (strict, label, run) => strict ? attempt(stopErrors, run) : cleanup(label, run);
		await channels.stopPrevious(resourceHandoffIds, stopErrors, cleanup);
		await stopOwner(resourceHandoffIds.size > 0, "Plugin service cleanup failed", () => stopPreviousServices(previousServices, resourceHandoffIds.size > 0));
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
		await params.checkpoint?.();
		assertCurrent();
		phase = "activate";
		loaded = withPluginCache(cache, () => preparePlugins(loadParams));
		nextRegistry = loaded.pluginRegistry;
		const { resolvedConfig } = loaded;
		const attached = await prepareAttachedPluginRuntime(loaded);
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
		await params.checkpoint?.();
		assertCurrent();
		phase = "activate";
		const startedServices = await withPluginRegistryPreparationScope(nextRegistry, () => startPluginServices({
			registry: nextRegistry,
			config: params.nextConfig,
			workspaceDir: pluginWorkspaceDir,
			broadcastPluginEvent,
			getCronService: kernel.getCronService,
			previous: previousServices,
			onHandle: (handle) => {
				candidateServices = handle;
			},
			throwOnStartError: true
		}));
		await params.checkpoint?.();
		assertCurrent();
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
		}
		if (committed) {
			await attempt(activationErrors, () => memoryReplacement.commit(nextRegistry));
			for (const sidecar of sidecarReplacements) await attempt(activationErrors, () => sidecar.resume(params.nextConfig));
			await attempt(activationErrors, () => runtimeState.discovery?.update({ gatewayDiscoveryServices: nextRegistry.gatewayDiscoveryServices }, replacement.claim));
		}
		await attempt(activationErrors, () => runLifecycleHooks(nextRegistry, true, params.nextConfig));
		await attempt(activationErrors, () => channels.startPublishedChannels(nextRegistry, activationErrors, nextMetadata.manifestRegistry.plugins));
		if (activationErrors.length > 0) throw activationErrors.length === 1 ? activationErrors[0] : new AggregateError(activationErrors, activationErrors.map(formatErrorMessage).join("; "));
		phase = "dispose";
		recordCleanup(await waitForPluginRegistryRetirement(previousRegistry, { deferConsumers: true }));
		recordCleanup(await kernel.pluginMetadata.waitForRetirement());
		const sourceDigests = Object.fromEntries(nextRegistry.plugins.flatMap((record) => {
			const digest = getPluginInstance(record)?.sourceDigest;
			return digest && changedPluginIds.has(record.id) ? [[record.id, digest]] : [];
		}));
		const receipt = {
			operationId,
			generation: getPluginRuntimeGeneration(),
			pluginIds: [...changedPluginIds].toSorted(),
			sourceDigests,
			...warnings.size ? { warnings: [...warnings] } : {}
		};
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
						recovered = recovery.prepare({
							cfg: previousConfig,
							activationSourceConfig: previousLoadContext?.activationSourceConfig ?? previousConfig,
							workspaceDir: pluginWorkspaceDir,
							log,
							coreGatewayMethodNames,
							hostServices: pluginHostServices,
							baseMethods,
							pluginMetadataSnapshot: previousMetadata,
							ambientEnvTriggers,
							resolveGatewayContext: resolvePluginGatewayContext,
							loadIntent: "replacement",
							previousRegistry,
							replacePluginIds: changedPluginIds,
							prepareRegistrationFailureCleanup: prepareRegistrationFailureCleanup(previousConfig),
							env: previousLoadContext?.env ?? params.env
						}, error);
						restoredRegistry = recovered.pluginRegistry;
						const attached = await prepareAttachedPluginRuntime(recovered);
						await withPluginRegistryPreparationScope(restoredRegistry, async () => {
							await attempt(recoveryErrors, async () => {
								await startPluginServices({
									registry: restoredRegistry,
									config: previousConfig,
									workspaceDir: pluginWorkspaceDir,
									broadcastPluginEvent,
									getCronService: kernel.getCronService,
									previous: kernel.pluginRuntimeGeneration.currentServices(),
									onHandle: (handle) => {
										recoveredServices = handle;
										kernel.pluginRuntimeGeneration.publishServices(kernel.pluginRuntimeGeneration.currentClaim(), handle);
									},
									throwOnStartError: true
								});
							});
							attached.publish();
							recoveryPublished = true;
							attached.afterCommit();
						});
						await attempt(recoveryErrors, () => memoryReplacement?.commit(restoredRegistry));
						broadcast("plugins.changed", { generation: getPluginRegistryVersion(restoredRegistry) }, { dropIfSlow: true });
					} else {
						releaseResourceHandoff?.();
						for (const instance of quiescedInstances) instance.resume();
						await attempt(recoveryErrors, () => memoryReplacement?.rollback());
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
		recovery.dispose();
	}
}
//#endregion
export { reloadGatewayPlugins };
