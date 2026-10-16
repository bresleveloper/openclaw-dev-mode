import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { u as hasRestartSentinel } from "./restart-sentinel-CWHFSDjo.mjs";
import { n as getPluginModuleLoaderStats } from "./plugin-module-loader-cache-CUtYxPiw.mjs";
import { i as getGatewayContextLifetime } from "./gateway-context-binding-VqB7gkMe.mjs";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { S as runWithGatewayIndependentRootWorkAdmission, a as getActiveGatewayRootWorkCount, s as getGatewayRestartDrainSignal } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { n as findCapabilityProviderEntry } from "./provider-registry-shared-Cov0065J.mjs";
import { c as applyRemoteModelCatalogUpdate } from "./prepared-model-runtime-B8unFFC9.mjs";
import { _ as sweepSessionStateWatchNotices } from "./session-state-events-B7wdeeGU.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-BiGOf1E1.mjs";
import { r as loadGetReplyFromConfigRuntime } from "./dispatch-from-config.runtime.js";
import { a as prepareTranscriptCaptureDisable } from "./capture-startup-YlmBfTMP.mjs";
import { t as resolveTranscriptsConfig } from "./config-B42acf6V.mjs";
import { t as isChannelStartupSuppressedByEnvironment } from "./server-sidecar-startup-mode-De0PJqUq.mjs";
import { r as resolveInternalHookSelection } from "./configured-VU03G-Um.mjs";
import { a as canReadDetailedUpdateMetadata, o as projectUpdateAvailable, r as GATEWAY_EVENT_UPDATE_AVAILABLE } from "./events-D023Lo1g.mjs";
import { t as createGatewayUpdateLifecycle } from "./update-check-lifecycle-B4Emx-2v.mjs";
import { n as wakeUpdateRunWatcher, t as startUpdateRunWatcher } from "./update-run-watcher-QPFAEDaX.mjs";
import { t as scheduleGatewayIdleTask } from "./server-idle-task-CWJoOeL4.mjs";
import { n as measureStartup } from "./server-startup-trace-D88Ik5PK.mjs";
import { n as logGatewayReady, r as logGatewaySidecarsReady, t as beginMacOSSystemCaWarmupOnce } from "./system-ca-warmup-D8yqU9RU.mjs";
import { performance } from "node:perf_hooks";
import { setImmediate as setImmediate$1, setTimeout as setTimeout$1 } from "node:timers/promises";
//#region src/gateway/server-startup-handler-prewarm.ts
const GATEWAY_HANDLER_PREWARM_RETRY_DELAY_MS = 250;
function gatewayPrewarmItems(getConfig) {
	return [
		{
			name: "session-history-worker",
			waitForIdle: false,
			load: async (isCancelled) => {
				const { prewarmGatewaySessionHistory } = await import("./server-history-prewarm-DpxpK9Dc.mjs");
				if (!isCancelled()) await prewarmGatewaySessionHistory(getConfig(), { isCancelled });
			}
		},
		{
			name: "connection",
			load: () => import("./message-handler-DhD2S7cl.mjs")
		},
		...[
			"chat.history",
			"chat.send",
			"sessions.list"
		].map((method) => ({
			name: method,
			load: async (isCancelled) => {
				const [{ coreGatewayHandlers }, { prepareGatewayRequestHandler }] = await Promise.all([import("./core-handlers-PtaFhCUw.mjs"), import("./lazy-core-handlers-DOJxSTvc.mjs")]);
				if (!isCancelled()) {
					const handler = coreGatewayHandlers[method];
					if (!handler) throw new Error(`Gateway prewarm handler not found: ${method}`);
					await prepareGatewayRequestHandler(handler);
				}
			}
		})),
		{
			name: "agent-events",
			load: () => import("./server-chat-Biw6RgYQ.mjs")
		},
		{
			name: "session-key",
			load: () => import("./server-session-key-CAsHhLeN.mjs")
		},
		...listAgentIds(getConfig()).map((agentId) => ({
			name: `skills.${agentId}`,
			load: async (isCancelled) => {
				const [{ prepareWorkspaceSkillEntries }, { getAgentWorkspaceAccess }, { ensureSkillsWatcher }] = await Promise.all([
					import("./workspace-skill-loader-Dr1hGjB7.mjs"),
					import("./workspace-access-D2z0k4Ia.mjs"),
					import("./refresh-D0Cr8MC9.mjs")
				]);
				const config = getConfig();
				if (isCancelled() || !listAgentIds(config).includes(agentId)) return;
				const workspaceDir = resolveAgentWorkspaceDir(config, agentId);
				if (!getAgentWorkspaceAccess(workspaceDir, "loadSkills")) {
					ensureSkillsWatcher({
						workspaceDir,
						config,
						agentId
					});
					await prepareWorkspaceSkillEntries(workspaceDir, {
						config,
						agentId
					});
				}
			}
		})),
		{
			name: "context-window-cache",
			notBeforeMs: 5e3,
			load: async (isCancelled) => {
				const { prewarmContextWindowCacheAfterReady } = await import("./context-CtiZCXRO.mjs");
				if (!isCancelled()) await prewarmContextWindowCacheAfterReady({
					config: getConfig(),
					isCancelled
				});
			}
		},
		{
			name: "memory-search",
			load: async (isCancelled) => {
				const { getMemoryCapabilityRegistration } = await import("./plugins/memory-state.js");
				if (isCancelled() || getMemoryCapabilityRegistration()?.pluginId !== "memory-core") return;
				const { loadBundledPluginPublicArtifactModuleSync } = await import("./public-surface-loader-DvffICdw.mjs");
				if (isCancelled()) return;
				const { prewarmMemorySearchWorker } = loadBundledPluginPublicArtifactModuleSync({
					dirName: "memory-core",
					artifactBasename: "prewarm-api.js"
				});
				await prewarmMemorySearchWorker();
			}
		},
		{
			name: "plugins",
			load: async (isCancelled) => {
				const { listManagedPlugins } = await import("./management-service-Cb5IYZGH.mjs");
				if (!isCancelled()) await listManagedPlugins({ config: getConfig() });
			}
		}
	];
}
function scheduleGatewayHandlerPrewarm(params) {
	let stopped = false;
	const startedAt = params.scheduler.now();
	const items = params.items ?? gatewayPrewarmItems(params.getConfig);
	let nextIndex = 0;
	let currentItemName = "unknown";
	let idleTask;
	const scheduleNext = () => {
		if (stopped || nextIndex >= items.length) return;
		(async () => {
			await params.waitForPostReadyWork?.();
			if (stopped) return;
			const item = items[nextIndex++];
			if (!item) return;
			currentItemName = item.name;
			const isBusy = () => item.waitForIdle !== false && getActiveGatewayRootWorkCount({ excludeCurrent: true }) > 0;
			const load = () => item.load(() => stopped || isBusy());
			idleTask = scheduleGatewayIdleTask({
				id: "startup:handler-prewarm",
				scheduler: params.scheduler,
				delayMs: Math.max(0, (item.notBeforeMs ?? 0) - (params.scheduler.now() - startedAt)),
				retryDelayMs: GATEWAY_HANDLER_PREWARM_RETRY_DELAY_MS,
				isClosing: () => stopped,
				isBusy,
				run: async () => {
					try {
						await (params.startupTrace ? params.startupTrace.measure(`post-ready.gateway-data.${item.name}`, load) : load());
					} finally {
						Promise.resolve(idleTask?.stop()).then(scheduleNext, scheduleNext);
					}
				},
				log: params.log,
				errorMessage: `post-ready gateway data prewarm failed for ${item.name}`
			});
		})().catch((err) => {
			params.log.warn(`post-ready gateway data prewarm failed for ${currentItemName}: ${String(err)}`);
			scheduleNext();
		});
	};
	scheduleNext();
	return { stop: () => {
		stopped = true;
		return idleTask?.stop();
	} };
}
//#endregion
//#region src/gateway/server-startup-main-session-orphans.ts
const loadMainSessionRestartRecoveryMarkingModule = createLazyRuntimeModule(() => import("./main-session-restart-recovery-marking-DVFJUqcV.mjs"));
/** Mark predecessors before channels admit work; a tripped crash-loop breaker quarantines them. */
async function markGatewayStartupMainSessionOrphans(params, startupCheckedStorePaths) {
	await measureStartup(params.startupTrace, "sidecars.main-session-recovery", async () => {
		try {
			if (params.scheduler.signal.aborted || params.isRestartRecoverySuppressed?.()) return;
			const { markStartupOrphanedMainSessionsForRecovery } = await measureStartup(params.startupTrace, "sidecars.main-session-recovery-load", loadMainSessionRestartRecoveryMarkingModule);
			if (params.scheduler.signal.aborted || params.isRestartRecoverySuppressed?.()) return;
			await measureStartup(params.startupTrace, "sidecars.main-session-recovery-scan", () => markStartupOrphanedMainSessionsForRecovery({
				cfg: params.cfg,
				startupCheckedStorePaths
			}));
		} catch (err) {
			params.log.warn(`main-session startup orphan marking failed before channel startup: ${String(err)}`);
		}
	});
}
//#endregion
//#region src/gateway/server-startup-model-runtime.ts
async function hydrateConfiguredExternalCliAuth(params) {
	const deps = await params.deps ?? await Promise.all([
		import("./agent-scope-BbGZA7Yc.mjs"),
		import("./prepared-model-runtime.configured-IuNrCYJs.mjs"),
		import("./store-runtime-CIjYuZf0.mjs"),
		import("./external-cli-discovery-BsbaH0IA.mjs")
	]).then(([scope, configured, store, external]) => ({
		listAgentIds: scope.listAgentIds,
		resolveAgentDir: scope.resolveAgentDir,
		collectConfiguredRefs: configured.collectPreparedModelRuntimeConfiguredRefs,
		hydrate: (cfg, agentDir, providers) => {
			const discovery = external.externalCliDiscoveryForProviders({
				cfg,
				providers
			});
			if (discovery.mode === "none") return;
			store.ensureAuthProfileStore(agentDir, {
				config: cfg,
				externalCli: discovery,
				allowKeychainPrompt: false,
				readOnly: true,
				syncExternalCli: false
			});
		}
	}));
	const cfg = params.getConfig();
	const hydratedDirs = /* @__PURE__ */ new Set();
	for (const agentId of deps.listAgentIds(cfg)) {
		const providers = deps.collectConfiguredRefs(cfg, agentId).flatMap(({ value }) => {
			const separator = value.indexOf("/");
			return separator > 0 ? [value.slice(0, separator)] : [];
		});
		const agentDir = deps.resolveAgentDir(cfg, agentId);
		if (providers.length === 0 || hydratedDirs.has(agentDir)) continue;
		hydratedDirs.add(agentDir);
		try {
			deps.hydrate(cfg, agentDir, providers);
		} catch (error) {
			params.log.warn(`startup external CLI auth hydration failed for agent ${agentId}: ${String(error)}`);
		}
	}
	return cfg;
}
async function publishConfiguredModelRuntimeSnapshots(params) {
	const { refreshPreparedModelRuntimeSnapshots } = await import("./prepared-model-runtime-BnpMlDe5.mjs");
	if (params.isCurrent?.() === false) return;
	await refreshPreparedModelRuntimeSnapshots(params.getConfig ?? params.cfg, {
		gatewayLifecycle: true,
		startup: true,
		catalogMode: "static",
		allowGatewaySubagentBinding: true,
		...params.isCurrent ? { isPublicationCurrent: params.isCurrent } : {},
		...params.pluginMetadataSnapshot ? { pluginMetadataSnapshot: params.pluginMetadataSnapshot } : {},
		...params.workspaceDir ? { defaultWorkspaceDir: params.workspaceDir } : {},
		...params.startupTrace ? { onBuildStats: (stats) => params.startupTrace?.detail("sidecars.model-runtime-build", [
			["agentCount", stats.agentCount],
			["workspaceGroupCount", stats.workspaceGroupCount],
			["configuredFactsGroupCount", stats.configuredFactsGroupCount],
			["catalogSourceCount", stats.catalogSourceCount],
			["credentialGroupCount", stats.credentialGroupCount],
			["catalogGroupCount", stats.catalogGroupCount],
			["runtimeRegistryCount", stats.runtimeRegistryCount],
			["configuredRuntimeModelCount", stats.configuredRuntimeModelCount],
			["generatedCatalogPluginCount", stats.generatedCatalogPluginCount],
			["generatedCatalogReadCount", stats.generatedCatalogReadCount],
			["workspaceFactsMs", stats.workspaceFactsMs],
			["runtimePluginMs", stats.runtimePluginMs],
			["pluginMetadataMs", stats.pluginMetadataMs],
			["staticProviderCatalogMs", stats.staticProviderCatalogMs],
			["ambientCredentialsMs", stats.ambientCredentialsMs],
			["agentFactsMs", stats.agentFactsMs],
			["configuredProjectionMs", stats.configuredProjectionMs],
			["catalogSourceMs", stats.catalogSourceMs],
			["registryMs", stats.registryMs],
			["sourceConcurrencyLimitCount", stats.sourceConcurrencyLimit],
			["fullCatalogConcurrencyLimitCount", stats.fullCatalogConcurrencyLimit]
		]) } : {}
	});
}
//#endregion
//#region src/gateway/server-startup-observers.ts
/** The tracked startup tail owns both observers until their original work settles. */
async function runGatewayStartupObservers(params) {
	await params.waitForPostReadyWork?.();
	if (params.isClosing?.()) return;
	await setImmediate$1();
	if (params.isClosing?.()) return;
	const sentinelRefresh = runWithGatewayIndependentRootWorkAdmission(async () => {
		await measureStartup(params.startupTrace, "post-attach.update-sentinel", async () => {
			if (!params.isClosing?.()) await params.refreshLatestUpdateRestartSentinel();
		});
	}, "startup:update-sentinel", params.signal).catch((err) => {
		params.log.warn(`restart sentinel refresh failed: ${String(err)}`);
	});
	try {
		await sweepSessionStateWatchNotices();
		const hookRunner = await params.createHookRunner(params.registry, { logger: params.logHooks });
		if (params.isClosing?.() || !hookRunner.hasHooks("gateway_start")) return;
		const { withPluginHttpRouteRegistry } = await import("./http-registry-DTImXdfV.mjs");
		if (params.isClosing?.()) return;
		await runWithGatewayIndependentRootWorkAdmission(async () => {
			if (params.isClosing?.()) return;
			await withPluginHttpRouteRegistry(params.registry, () => hookRunner.runGatewayStart({ port: params.port }, {
				port: params.port,
				config: params.config,
				workspaceDir: params.workspaceDir,
				abortSignal: AbortSignal.any([params.signal, getGatewayRestartDrainSignal()]),
				getCron: params.getCron
			}));
		}, "hooks:gateway-start", params.signal).catch((err) => {
			params.log.warn(`gateway_start hook failed: ${String(err)}`);
		});
	} finally {
		await sentinelRefresh;
	}
}
//#endregion
//#region src/gateway/server-startup-outcomes.ts
const GATEWAY_STARTUP_SUBSYSTEMS = [
	"internal-hooks",
	"internal-startup-hook",
	"gateway-start-hooks",
	"gmail-watcher",
	"gmail-model"
];
function skipped(subsystem, reason) {
	return {
		subsystem,
		status: "skipped",
		reason
	};
}
/** Create the complete initial outcome set; awaited startup work may replace entries later. */
function createGatewayStartupOutcomeRecorder(params) {
	const internalHooks = params.cfg.hooks?.internal?.enabled === false ? "hooks-disabled" : resolveInternalHookSelection(params.cfg).configured ? "no-handlers-loaded" : "not-configured";
	const gmailWatcher = !params.cfg.hooks?.enabled ? "hooks-disabled" : !params.cfg.hooks.gmail?.account ? "no-gmail-account" : isTruthyEnvValue((params.env ?? process.env).OPENCLAW_SKIP_GMAIL_WATCHER) ? "disabled-by-environment" : "scheduled";
	const initial = [
		skipped("internal-hooks", internalHooks),
		skipped("internal-startup-hook", internalHooks === "hooks-disabled" ? "hooks-disabled" : "no-handlers-loaded"),
		params.gatewayStartHooks ? {
			subsystem: "gateway-start-hooks",
			status: "scheduled"
		} : skipped("gateway-start-hooks", "no-handlers-loaded"),
		gmailWatcher === "scheduled" ? {
			subsystem: "gmail-watcher",
			status: "scheduled"
		} : skipped("gmail-watcher", gmailWatcher),
		params.cfg.hooks?.gmail?.model ? {
			subsystem: "gmail-model",
			status: "scheduled"
		} : skipped("gmail-model", "not-configured")
	];
	const outcomes = new Map(initial.map((outcome) => [outcome.subsystem, outcome]));
	return {
		record: (outcome) => {
			outcomes.set(outcome.subsystem, outcome);
		},
		snapshot: () => [...outcomes.values()]
	};
}
/** Format outcomes in canonical order regardless of collection order. */
function formatGatewayStartupOutcomes(outcomes) {
	const bySubsystem = new Map(outcomes.map((outcome) => [outcome.subsystem, outcome]));
	return `gateway startup outcomes: ${GATEWAY_STARTUP_SUBSYSTEMS.flatMap((subsystem) => {
		const outcome = bySubsystem.get(subsystem);
		if (!outcome) return [];
		const detail = "reason" in outcome ? ` (${outcome.reason})` : "";
		return `${outcome.subsystem}=${outcome.status}${detail}`;
	}).join("; ")}`;
}
//#endregion
//#region src/gateway/server-startup-sidecar-scheduler.ts
function schedulePostReadySidecarTask(params) {
	const abortController = new AbortController();
	const isStopped = () => abortController.signal.aborted || params.shouldRun?.() === false;
	const handle = setImmediate(() => {
		(async () => {
			await params.waitForPostReadyWork?.();
			if (isStopped()) return;
			await runWithGatewayIndependentRootWorkAdmission(async () => {
				if (isStopped()) return;
				await measureStartup(params.startupTrace, params.name, () => params.run(isStopped, abortController.signal));
			}, `startup:${params.name}`);
		})().catch((err) => {
			params.log.warn(`${params.name} failed after gateway ready: ${String(err)}`);
		});
	});
	handle.unref?.();
	return { stop: async () => {
		abortController.abort();
		clearImmediate(handle);
		await params.stop?.();
	} };
}
function scheduleGatewayGenerationTimer(params) {
	const scope = params.scheduler.scope();
	const { signal } = scope;
	const isStopped = () => signal.aborted || params.shouldRun?.() === false;
	scope.schedule({
		id: params.origin,
		delayMs: params.delayMs,
		run: () => {
			if (isStopped()) return;
			return runWithGatewayIndependentRootWorkAdmission(async () => {
				if (isStopped()) return;
				await params.run(isStopped);
			}, params.origin, signal).catch((err) => {
				if (!signal.aborted) params.onError(err);
			});
		}
	});
	return scope;
}
//#endregion
//#region src/gateway/server-startup-restart-sentinel.ts
const loadGatewayRestartSentinelModule = createLazyRuntimeModule(() => import("./server-restart-sentinel-BqF_KIyI.mjs"));
function scheduleRestartSentinelWakeAfterReady(params) {
	const context = params.context ?? captureDeliveryQueueStateContext();
	const controller = new AbortController();
	const signal = AbortSignal.any([controller.signal, params.scheduler.signal]);
	const pending = /* @__PURE__ */ new Set();
	const timer = scheduleGatewayGenerationTimer({
		scheduler: params.scheduler,
		delayMs: 750,
		origin: "restart-sentinel:wake",
		shouldRun: params.shouldRun,
		run: async (isStopped) => {
			const { scheduleRestartSentinelWake } = await loadGatewayRestartSentinelModule();
			if (isStopped()) return;
			await scheduleRestartSentinelWake({
				scheduler: params.scheduler,
				signal,
				deps: params.deps,
				context,
				shouldRun: () => !signal.aborted && !isStopped(),
				trackWork: (work) => {
					pending.add(work);
					work.then(() => pending.delete(work), () => pending.delete(work));
				}
			});
		},
		onError: (err) => params.log.warn(`restart sentinel wake failed to schedule: ${String(err)}`)
	});
	return { async stop() {
		controller.abort();
		await timer.stop();
		await Promise.all(pending);
	} };
}
async function refreshLatestUpdateRestartSentinelIfPresent(env = captureDeliveryQueueStateContext().workerContext.environment) {
	if (!await hasRestartSentinel(env)) return null;
	return await (await loadGatewayRestartSentinelModule()).refreshLatestUpdateRestartSentinel(env);
}
//#endregion
//#region src/gateway/server-startup-transcripts.ts
function scheduleTranscriptsSidecar(params) {
	const stateDir = resolveStateDir();
	let config = params.cfg;
	let paused = false;
	let service;
	let sidecar;
	let shutdownCapturePolicy;
	let stopped = false;
	const start = () => {
		if (stopped || paused) return;
		if (service) withPluginRuntimeRegistryScope(params.getPluginRegistry(), () => service.start(config));
		else if (!sidecar && config.transcripts?.autoStart?.length) sidecar = schedulePostReadySidecarTask({
			startupTrace: params.startupTrace,
			name: "sidecars.transcripts-auto-start",
			log: params.log,
			waitForPostReadyWork: params.waitForPostReadyWork,
			shouldRun: params.shouldRun,
			run: async (isStopped) => {
				const { createTranscriptsAutoStartService } = await import("./auto-start-DrS28HfO.mjs");
				if (isStopped()) return;
				service = createTranscriptsAutoStartService({
					config,
					stateDir,
					logger: params.log
				}, params.getConfig);
				start();
			},
			stop: () => withPluginRuntimeRegistryScope(params.getPluginRegistry(), () => service?.stop())
		});
	};
	start();
	return {
		stop: async () => {
			stopped = true;
			if (!shutdownCapturePolicy) {
				shutdownCapturePolicy = prepareTranscriptCaptureDisable(stateDir);
				if (params.lifetimeSignal.aborted) shutdownCapturePolicy.resume();
				else params.lifetimeSignal.addEventListener("abort", shutdownCapturePolicy.resume, { once: true });
			}
			const failures = (await Promise.allSettled([sidecar?.stop(), shutdownCapturePolicy.drain()])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (failures.length) throw new AggregateError(failures, "Transcript capture shutdown failed");
		},
		preparePluginReload({ previousRegistry, nextRegistry, changedPluginIds, nextConfig }) {
			const affected = /* @__PURE__ */ new Set();
			let capturePolicy;
			for (const entry of resolveTranscriptsConfig(config.transcripts).autoStart) {
				const { providerId } = entry;
				if ([previousRegistry, nextRegistry].some((registry) => {
					const provider = findCapabilityProviderEntry(registry.transcriptSourceProviders, providerId);
					return provider && changedPluginIds.has(provider.pluginId);
				})) affected.add(providerId.trim().toLowerCase());
			}
			paused = true;
			return {
				drain: () => withPluginRuntimeRegistryScope(previousRegistry, async () => {
					if (nextConfig.transcripts?.enabled === false) {
						capturePolicy = prepareTranscriptCaptureDisable(stateDir);
						await capturePolicy.drain();
					}
					await service?.stop(affected, nextConfig);
				}),
				async resume(resumedConfig) {
					capturePolicy?.resume();
					const registry = params.getPluginRegistry();
					const newlyAvailable = /* @__PURE__ */ new Set();
					for (const { providerId } of resolveTranscriptsConfig(config.transcripts).autoStart) {
						const normalized = providerId.trim().toLowerCase();
						const provider = findCapabilityProviderEntry(registry.transcriptSourceProviders, providerId);
						if (provider && changedPluginIds.has(provider.pluginId) && !affected.has(normalized)) {
							affected.add(normalized);
							newlyAvailable.add(normalized);
						}
					}
					if (newlyAvailable.size) await withPluginRuntimeRegistryScope(registry, () => service?.stop(newlyAvailable));
					config = resumedConfig;
					paused = false;
					start();
				}
			};
		}
	};
}
//#endregion
//#region src/gateway/server-startup-update-check.ts
function createDeferredGatewayUpdateCheck(params) {
	const lifecycle = createGatewayUpdateLifecycle(params.scheduler);
	let stopped = false;
	let started = false;
	let runWatcher;
	let owner;
	let ownerReady;
	let initialization;
	let stopPromise;
	let latestUpdateAvailable = null;
	let latestSchedule;
	const broadcastUpdateAvailable = (payload) => {
		if (stopped || params.isClosing?.()) return;
		const detailedConnIds = params.getClientConnIds((client) => canReadDetailedUpdateMetadata(client.connect.role ?? "operator", client.connect.scopes ?? []));
		const legacyConnIds = new Set(params.getClientConnIds());
		for (const connId of detailedConnIds) legacyConnIds.delete(connId);
		params.broadcastToConnIds(GATEWAY_EVENT_UPDATE_AVAILABLE, payload, detailedConnIds, { dropIfSlow: true });
		params.broadcastToConnIds(GATEWAY_EVENT_UPDATE_AVAILABLE, { updateAvailable: projectUpdateAvailable(payload.updateAvailable, false) ?? null }, legacyConnIds, { dropIfSlow: true });
	};
	const stop = () => {
		stopped = true;
		return stopPromise ??= (async () => {
			const cleanup = Promise.all([
				lifecycle.stop(),
				runWatcher?.stop(),
				owner?.stop()
			]);
			await ownerReady;
			await cleanup;
			await initialization;
		})();
	};
	const start = () => {
		if (started || stopped) return;
		started = true;
		runWatcher = startUpdateRunWatcher({
			lifecycle,
			broadcast: (event, payload) => params.broadcastToConnIds(event, payload, params.getClientConnIds()),
			log: params.log
		});
		(async () => {
			if (params.waitForPostReadyWork) {
				await params.waitForPostReadyWork();
				await setImmediate$1();
			}
			if (stopped || params.isClosing?.()) return;
			ownerReady = (async () => {
				try {
					owner = await params.createUpdateCheck({
						lifecycle,
						getConfig: params.getConfig,
						applyRemoteCatalogUpdate: (signal) => withPluginRuntimeRegistryScope(params.getPluginRegistry(), () => applyRemoteModelCatalogUpdate(params.getConfig, signal)),
						onUpdateRunCreated: wakeUpdateRunWatcher,
						log: params.log,
						isNixMode: params.isNixMode,
						...params.activeWorkInspectors ? { activeWorkInspectors: params.activeWorkInspectors } : {},
						onUpdateAvailableChange: (updateAvailable) => {
							latestUpdateAvailable = updateAvailable;
							const payload = {
								updateAvailable,
								...latestSchedule ? { schedule: latestSchedule } : {}
							};
							broadcastUpdateAvailable(payload);
						},
						onUpdateScheduleChange: (schedule) => {
							latestSchedule = schedule;
							broadcastUpdateAvailable({
								updateAvailable: latestUpdateAvailable,
								schedule
							});
						}
					});
				} catch (err) {
					if (!stopped) params.log.warn(`gateway update check failed to initialize: ${String(err)}`);
					return;
				}
				if (stopped || params.isClosing?.()) {
					await owner.stop();
					return;
				}
				const updateCheck = owner;
				initialization = (async () => {
					const result = await updateCheck.initialize();
					if (result.status.error) throw new Error(result.status.error.message);
				})().catch((err) => {
					if (!stopped) params.log.warn(`gateway update status failed to initialize: ${String(err)}`);
				});
			})();
			await ownerReady;
			await setImmediate$1();
			if (!stopped && !params.isClosing?.()) await runWithGatewayIndependentRootWorkAdmission(async () => {
				if (stopped || params.isClosing?.()) return;
				await measureStartup(params.startupTrace, "post-attach.update-check", () => owner?.start());
			}, "startup:update-check");
		})().catch((err) => {
			if (!stopped) params.log.warn(`gateway update check readiness wait failed: ${String(err)}`);
		});
	};
	return {
		start,
		stop
	};
}
//#endregion
//#region src/gateway/server-startup-post-attach.ts
const ACP_BACKEND_READY_TIMEOUT_MS = 5e3;
const ACP_BACKEND_READY_POLL_MS = 50;
const loadMainSessionRestartRecoveryModule = createLazyRuntimeModule(() => import("./main-session-restart-recovery-CRcOoTnm.mjs"));
const loadAgentDefaultsModule = createLazyRuntimeModule(() => import("./defaults-DwjgwHqH.mjs"));
const loadAgentModelSelectionModule = createLazyRuntimeModule(() => import("./model-selection-S60zJYI0.mjs"));
const loadInternalHooksModule = createLazyRuntimeModule(() => import("./internal-hooks-D0LucR41.mjs"));
async function hasGatewayStartupInternalHookListeners() {
	const { hasInternalHookListeners } = await loadInternalHooksModule();
	return hasInternalHookListeners("gateway", "startup");
}
async function waitForAcpRuntimeBackendReady(backendId) {
	const { getAcpRuntimeBackend } = await import("./registry-DZ9yf2Ij.mjs");
	const deadline = performance.now() + ACP_BACKEND_READY_TIMEOUT_MS;
	do {
		const backend = getAcpRuntimeBackend(backendId);
		if (backend) try {
			if (!backend.healthy || backend.healthy()) return true;
		} catch {}
		await setTimeout$1(ACP_BACKEND_READY_POLL_MS, void 0, { ref: false });
	} while (performance.now() < deadline);
	return false;
}
/** Start post-ready sidecars such as channels, hooks, plugin services, and cleanup tasks. */
async function startGatewaySidecars(params) {
	const restartSentinelContext = params.restartSentinelContext ?? captureDeliveryQueueStateContext();
	const postReadySidecars = [];
	const internalHooksConfigured = resolveInternalHookSelection(params.cfg).configured;
	await measureStartup(params.startupTrace, "sidecars.internal-hooks", async () => {
		try {
			const { prepareInternalHooks } = await import("./loader-DgzA5esZ.mjs");
			const prepared = await prepareInternalHooks(params.cfg, params.defaultWorkspaceDir, { failureMode: "best-effort" });
			if (params.shouldCreatePostReadySidecars?.() === false || !prepared.commit({ initial: true })) {
				params.startupOutcomes?.record({
					subsystem: "internal-hooks",
					status: "skipped",
					reason: "superseded"
				});
				return;
			}
			if (!internalHooksConfigured) return;
			const { loadedCount } = prepared;
			if (loadedCount > 0) {
				params.startupOutcomes?.record({
					subsystem: "internal-hooks",
					status: "loaded"
				});
				params.logHooks.info(`loaded ${loadedCount} internal hook handler${loadedCount > 1 ? "s" : ""}`);
			} else params.startupOutcomes?.record({
				subsystem: "internal-hooks",
				status: "skipped",
				reason: "no-handlers-loaded"
			});
		} catch (err) {
			params.startupOutcomes?.record({
				subsystem: "internal-hooks",
				status: "failed",
				reason: "see earlier log"
			});
			params.logHooks.error(`failed to load hooks: ${String(err)}`);
		}
	});
	const mainSessionRecoveryStartupCheckedStorePaths = params.mainSessionRecoveryStartupCheckedStorePaths ?? /* @__PURE__ */ new Set();
	const skipChannels = isChannelStartupSuppressedByEnvironment();
	await markGatewayStartupMainSessionOrphans(params, mainSessionRecoveryStartupCheckedStorePaths);
	const getModelRuntimeConfig = params.getModelRuntimeConfig ?? (() => params.cfg);
	if (await params.pluginRuntimeClaim?.waitForUnblocked() !== false) await measureStartup(params.startupTrace, "sidecars.model-runtime", () => withPluginRuntimeRegistryScope(params.pluginRegistry, () => publishConfiguredModelRuntimeSnapshots({
		cfg: params.cfg,
		getConfig: () => measureStartup(params.startupTrace, "sidecars.model-auth", () => hydrateConfiguredExternalCliAuth({
			getConfig: getModelRuntimeConfig,
			log: params.log
		})),
		isCurrent: params.pluginRuntimeClaim?.isCurrent,
		...params.pluginMetadataSnapshot ? { pluginMetadataSnapshot: params.pluginMetadataSnapshot } : {},
		workspaceDir: params.defaultWorkspaceDir,
		startupTrace: params.startupTrace
	})));
	await measureStartup(params.startupTrace, "sidecars.reply-runtime", async () => {
		const { prewarmConfigDrivenReplyRuntime } = await loadGetReplyFromConfigRuntime();
		await prewarmConfigDrivenReplyRuntime();
	});
	await measureStartup(params.startupTrace, "sidecars.chat-metadata", async () => {
		await params.refreshChatMetadata?.();
	});
	const shouldStartChannels = params.shouldStartChannels?.() !== false;
	await measureStartup(params.startupTrace, "sidecars.channels", async () => {
		const channelStart = skipChannels ? measureStartup(params.startupTrace, "sidecars.channel-skip", () => params.logChannels.info("skipping channel start (OPENCLAW_SKIP_CHANNELS=1 or OPENCLAW_SKIP_PROVIDERS=1)")) : shouldStartChannels ? measureStartup(params.startupTrace, "sidecars.channel-start", params.startChannels).catch((err) => params.logChannels.error(`channel startup failed: ${String(err)}`)) : Promise.resolve();
		const accountStartGateRelease = shouldStartChannels ? params.onChannelsStarted?.() : void 0;
		await Promise.all([accountStartGateRelease, channelStart]);
	});
	await params.pluginRuntimeClaim?.waitForUnblocked();
	if (params.pluginRuntimeClaim?.isCurrent() !== false && params.shouldStartPluginServices?.() !== false) {
		let pluginServicesStopRequested = false;
		const ownedPluginServices = createDeferredCore();
		const pluginServicesOwner = {
			reload: async (config, serviceIds) => {
				const handle = await ownedPluginServices.promise;
				if (pluginServicesStopRequested || !handle) throw new Error("Plugin services are stopping");
				await handle.reload(config, serviceIds);
			},
			stop: (options) => {
				pluginServicesStopRequested = true;
				ownedPluginServices.resolve(null);
				const stopPromise = ownedPluginServices.promise.then((handle) => handle?.stop(options));
				const deadlineAtMs = options?.strict ? options.deadlineAtMs : void 0;
				if (deadlineAtMs === void 0) return stopPromise;
				return new Promise((resolve, reject) => {
					const timer = setTimeout(() => {
						reject(new AggregateError([/* @__PURE__ */ new Error("Gateway plugin service startup did not settle before replacement")], "Gateway plugin service replacement cleanup failed"));
					}, Math.max(0, deadlineAtMs - Date.now()));
					stopPromise.finally(() => clearTimeout(timer)).then(resolve, (error) => {
						reject(error instanceof Error ? error : new Error(String(error)));
					});
				});
			}
		};
		params.onPluginServices?.(pluginServicesOwner);
		await measureStartup(params.startupTrace, "sidecars.plugin-services", async () => {
			try {
				const { startPluginServices } = await import("./services-Yrfb7am3.mjs");
				await params.pluginRuntimeClaim?.waitForUnblocked();
				if (pluginServicesStopRequested || params.pluginRuntimeClaim?.isCurrent() === false || params.shouldStartPluginServices?.(pluginServicesOwner) === false) {
					ownedPluginServices.resolve(null);
					return;
				}
				await startPluginServices({
					scheduler: params.scheduler,
					registry: params.pluginRegistry,
					config: params.cfg,
					workspaceDir: params.defaultWorkspaceDir,
					startupTrace: params.startupTrace,
					broadcastPluginEvent: params.broadcastPluginEvent,
					getCronService: params.getCronService,
					onHandle: (handle) => {
						ownedPluginServices.resolve(handle);
						if (params.pluginRuntimeClaim?.isCurrent() !== false && params.shouldStartPluginServices?.(pluginServicesOwner) !== false) params.onPluginServices?.(handle);
					}
				});
			} catch (err) {
				ownedPluginServices.resolve(null);
				params.log.warn(`plugin services failed to start: ${String(err)}`);
			}
		});
	}
	const shouldDispatchGatewayStartupInternalHook = internalHooksConfigured || await hasGatewayStartupInternalHookListeners();
	if (params.shouldCreatePostReadySidecars?.() === false) return 0;
	if (shouldDispatchGatewayStartupInternalHook) {
		params.startupOutcomes?.record({
			subsystem: "internal-startup-hook",
			status: "scheduled"
		});
		postReadySidecars.push(scheduleGatewayGenerationTimer({
			scheduler: params.scheduler,
			delayMs: 250,
			origin: "hooks:gateway-startup",
			shouldRun: params.shouldCreatePostReadySidecars,
			run: async (isStopped) => {
				const { createInternalHookEvent, triggerInternalHook } = await loadInternalHooksModule();
				if (isStopped()) return;
				await triggerInternalHook(createInternalHookEvent("gateway", "startup", "gateway:startup", {
					cfg: params.cfg,
					deps: params.deps,
					workspaceDir: params.defaultWorkspaceDir
				}));
			},
			onError: (err) => params.logHooks.warn(`gateway startup hook failed: ${String(err)}`)
		}));
	}
	if (params.cfg.acp?.enabled) runWithGatewayIndependentRootWorkAdmission(async () => {
		if (params.shouldCreatePostReadySidecars?.() === false) return;
		const ready = await measureStartup(params.startupTrace, "sidecars.acp.runtime-ready", () => waitForAcpRuntimeBackendReady(params.cfg.acp?.backend));
		params.startupTrace?.detail("sidecars.acp.runtime-ready", [["readyCount", ready ? 1 : 0], ["backend", params.cfg.acp?.backend ?? "default"]]);
		if (params.shouldCreatePostReadySidecars?.() === false) return;
		await measureStartup(params.startupTrace, "sidecars.acp.identity-reconcile", async () => {
			const [{ getAcpSessionManager }, { ACP_SESSION_IDENTITY_RENDERER_VERSION }] = await Promise.all([import("./acp/control-plane/manager.js"), import("./acp-core/runtime/session-identifiers.js")]);
			if (params.shouldCreatePostReadySidecars?.() === false) return;
			const result = await getAcpSessionManager().reconcilePendingSessionIdentities({ cfg: params.cfg });
			if (result.checked === 0) return;
			params.log.warn(`acp startup identity reconcile (renderer=${ACP_SESSION_IDENTITY_RENDERER_VERSION}): checked=${result.checked} resolved=${result.resolved} failed=${result.failed}`);
		});
	}, "startup:acp-identity-reconcile").catch((err) => {
		params.log.warn(`acp startup identity reconcile failed: ${String(err)}`);
	});
	let restartSentinelWake;
	postReadySidecars.push(schedulePostReadySidecarTask({
		startupTrace: params.startupTrace,
		name: "sidecars.restart-sentinel",
		log: params.log,
		waitForPostReadyWork: params.waitForPostReadyWork,
		shouldRun: params.shouldCreatePostReadySidecars,
		run: async (isStopped) => {
			if (process.env.VITEST || isStopped()) return;
			if (!await hasRestartSentinel(restartSentinelContext.workerContext.environment)) {
				const { detectLegacyRestartSentinel } = await import("./state-migrations.restart-sentinel-X35zWp1T.mjs");
				if (!detectLegacyRestartSentinel({ stateDir: restartSentinelContext.stateDir }).hasLegacy) return;
			}
			if (isStopped()) return;
			restartSentinelWake = scheduleRestartSentinelWakeAfterReady({
				scheduler: params.scheduler,
				context: restartSentinelContext,
				deps: params.deps,
				log: params.log,
				shouldRun: params.shouldCreatePostReadySidecars
			});
		},
		stop: async () => {
			await restartSentinelWake?.stop();
		}
	}));
	if (params.cfg.hooks?.enabled && params.cfg.hooks.gmail?.account) postReadySidecars.push(schedulePostReadySidecarTask({
		startupTrace: params.startupTrace,
		name: "sidecars.gmail-watch",
		log: params.log,
		waitForPostReadyWork: params.waitForPostReadyWork,
		shouldRun: params.shouldCreatePostReadySidecars,
		run: async (isStopped, signal) => {
			const { startGmailWatcherWithLogs } = await import("./gmail-watcher-lifecycle-DJ6_ci7R.mjs");
			if (isStopped()) return;
			await startGmailWatcherWithLogs({
				cfg: params.cfg,
				log: params.logHooks,
				signal,
				scheduler: params.scheduler
			});
		}
	}));
	if (params.cfg.hooks?.gmail?.model) postReadySidecars.push(schedulePostReadySidecarTask({
		startupTrace: params.startupTrace,
		name: "sidecars.gmail-model",
		log: params.log,
		waitForPostReadyWork: params.waitForPostReadyWork,
		shouldRun: params.shouldCreatePostReadySidecars,
		run: async (isStopped) => {
			const [{ DEFAULT_MODEL, DEFAULT_PROVIDER }, { readPreparedModelCatalog }, { getModelRefStatus, resolveConfiguredModelRef, resolveHooksGmailModel }] = await Promise.all([
				loadAgentDefaultsModule(),
				import("./prepared-model-catalog-sffagvF9.mjs"),
				loadAgentModelSelectionModule()
			]);
			if (isStopped()) return;
			const hooksModelRef = resolveHooksGmailModel({
				cfg: params.cfg,
				defaultProvider: DEFAULT_PROVIDER
			});
			if (hooksModelRef) {
				const { provider: resolvedDefaultProvider, model: defaultModel } = resolveConfiguredModelRef({
					cfg: params.cfg,
					defaultProvider: DEFAULT_PROVIDER,
					defaultModel: DEFAULT_MODEL
				});
				const catalog = await readPreparedModelCatalog({
					config: params.cfg,
					readOnly: true
				});
				if (isStopped()) return;
				const status = getModelRefStatus({
					cfg: params.cfg,
					catalog,
					ref: hooksModelRef,
					defaultProvider: resolvedDefaultProvider,
					defaultModel: {
						provider: resolvedDefaultProvider,
						model: defaultModel
					}
				});
				if (!status.allowed) params.logHooks.warn(`hooks.gmail.model "${status.key}" not allowed by agents.defaults.modelPolicy.allow (will use primary instead)`);
				if (!status.inCatalog) params.logHooks.warn(`hooks.gmail.model "${status.key}" not in the model catalog (may fail at runtime)`);
			}
		}
	}));
	params.onPostReadySidecars(...postReadySidecars);
	return postReadySidecars.length;
}
const defaultGatewayPostAttachRuntimeDeps = {
	createHookRunner: async (...args) => (await import("./hooks-CPQpZQVr.mjs")).createHookRunner(...args),
	logGatewayStartup: async (params) => (await import("./server-startup-log-C-Nzky6M.mjs")).logGatewayStartup(params),
	refreshLatestUpdateRestartSentinel: refreshLatestUpdateRestartSentinelIfPresent,
	createGatewayUpdateCheck: async (...args) => (await import("./update-startup-BaVaaM3o.mjs")).createGatewayUpdateCheck(...args),
	startGatewaySidecars,
	warmSystemCa: beginMacOSSystemCaWarmupOnce,
	loadSubagentRegistryActivation: async () => (await import("./subagent-registry-DXEFX54X.mjs")).activateSubagentRegistry
};
/** Start work that depends on the HTTP server being attached and visible. */
async function startGatewayPostAttachRuntime(params, runtimeDeps = defaultGatewayPostAttachRuntimeDeps) {
	const restartSentinelContext = captureDeliveryQueueStateContext();
	const candidateCanary = params.updateCanary === true;
	const controlUiRootLifecycle = params.controlUiRootLifecycle;
	const mainSessionRecoveryStartupCheckedStorePaths = /* @__PURE__ */ new Set();
	const controlUiAssetsSidecar = !params.minimalTestGateway && controlUiRootLifecycle ? schedulePostReadySidecarTask({
		name: "sidecars.control-ui-assets",
		startupTrace: params.startupTrace,
		log: params.log,
		shouldRun: () => params.isClosing?.() !== true,
		run: controlUiRootLifecycle.start,
		stop: controlUiRootLifecycle.stop
	}) : void 0;
	if (controlUiAssetsSidecar) params.onGatewayLifetimeSidecars(controlUiAssetsSidecar);
	if (!params.minimalTestGateway) await measureStartup(params.startupTrace, "post-attach.system-ca", () => runtimeDeps.warmSystemCa({ log: params.log }));
	let pluginRegistry = params.pluginRegistry;
	const loadStartupPluginsIfNeeded = async () => {
		if (params.minimalTestGateway || !params.loadStartupPlugins) return;
		params.onStartupPluginsLoading?.();
		const { disposePluginRegistryInstances } = await import("./runtime-H3kSuoER.mjs");
		const loaded = await measureStartup(params.startupTrace, "plugins.runtime-post-bind", () => params.loadStartupPlugins());
		const disposeUnattached = async () => {
			const current = params.getCurrentPluginRegistry?.() ?? pluginRegistry;
			if (loaded.pluginRegistry !== current) {
				loaded.retireGatewayRuntimeBindings?.();
				await disposePluginRegistryInstances(loaded.pluginRegistry, current);
			}
			pluginRegistry = current;
		};
		await params.pluginRuntimeClaim?.waitForUnblocked();
		if (params.isClosing?.() || params.pluginRuntimeClaim?.isCurrent() === false) return await disposeUnattached();
		let published;
		try {
			published = await params.onStartupPluginsLoaded?.(loaded);
		} catch (error) {
			await disposeUnattached().catch((cleanupError) => {
				throw new AggregateError([error, cleanupError], "Startup plugin attachment cleanup failed", { cause: error });
			});
			throw error;
		}
		if (published === false) return await disposeUnattached();
		pluginRegistry = loaded.pluginRegistry;
		params.startupTrace?.detail("plugins.runtime-post-bind", [["loadedPluginCount", pluginRegistry.plugins.filter((plugin) => plugin.status === "loaded").length], ["gatewayMethodCount", loaded.gatewayMethods.length]]);
	};
	let startupLogPromise;
	const startupLogSettled = createDeferredCore();
	startupLogSettled.promise.catch(() => {});
	let startupLogOwnerAssigned = false;
	const assignStartupLogOwner = (owner) => {
		if (params.sidecarStartup !== "defer" || startupLogOwnerAssigned) return;
		startupLogOwnerAssigned = true;
		owner.then(startupLogSettled.resolve, startupLogSettled.reject);
	};
	const startStartupLog = () => {
		if (startupLogPromise) return startupLogPromise;
		startupLogPromise = params.trackStartupWork(() => {
			const startupRuntimeCurrent = params.pluginRuntimeClaim?.isCurrent() !== false;
			const startupPluginRegistry = startupRuntimeCurrent ? pluginRegistry : params.getCurrentPluginRegistry?.() ?? pluginRegistry;
			return measureStartup(params.startupTrace, "post-attach.log", () => runtimeDeps.logGatewayStartup({
				cfg: startupRuntimeCurrent ? params.cfgAtStart : params.getConfig(),
				activationSourceConfig: startupRuntimeCurrent ? params.activationSourceConfig : params.getCurrentActivationSourceConfig?.() ?? void 0,
				env: process.env,
				manifestRecords: startupRuntimeCurrent ? params.pluginManifestRecords : params.getCurrentPluginMetadataSnapshot?.()?.plugins ?? [],
				...params.ambientEnvTriggers ? { ambientEnvTriggers: params.ambientEnvTriggers } : {},
				loadedPluginIds: startupPluginRegistry.plugins.filter((plugin) => plugin.status === "loaded").map((plugin) => plugin.id),
				log: params.log,
				isNixMode: params.isNixMode,
				startupStartedAt: params.startupStartedAt
			}));
		});
		startupLogPromise.catch(() => {});
		assignStartupLogOwner(startupLogPromise);
		return startupLogPromise;
	};
	const skipStartupLog = () => assignStartupLogOwner(Promise.resolve());
	const updateCheck = createDeferredGatewayUpdateCheck({
		scheduler: params.scheduler,
		startupTrace: params.startupTrace,
		createUpdateCheck: runtimeDeps.createGatewayUpdateCheck,
		getConfig: params.getConfig,
		getPluginRegistry: () => params.getCurrentPluginRegistry?.() ?? pluginRegistry,
		log: params.log,
		isNixMode: params.isNixMode,
		broadcastToConnIds: params.broadcastToConnIds,
		getClientConnIds: params.getClientConnIds,
		waitForPostReadyWork: params.waitForPostReadyWork,
		isClosing: params.isClosing,
		activeWorkInspectors: params.activeWorkInspectors
	});
	params.onGatewayLifetimeSidecars(updateCheck);
	const reportPluginServices = (pluginServices) => {
		if (params.pluginRuntimeClaim?.isCurrent() === false) return;
		params.onPluginServices?.(pluginServices);
	};
	const startSidecars = () => params.minimalTestGateway ? startStartupLog().then(() => pluginRegistry) : setImmediate$1().then(async () => {
		if (params.isClosing?.()) {
			skipStartupLog();
			return pluginRegistry;
		}
		await loadStartupPluginsIfNeeded();
		if (params.isClosing?.()) {
			skipStartupLog();
			return pluginRegistry;
		}
		const startupLog = startStartupLog();
		if (candidateCanary) {
			await startupLog;
			if (pluginRegistry.diagnostics.some((diagnostic) => diagnostic.level === "error" && !diagnostic.pluginId)) throw new Error("Candidate plugin registry reported an unattributed error");
			params.unlockStartupMethods();
			params.onSidecarsReady?.();
			logGatewayReady(params, "candidate gateway ready; autonomous sidecars suppressed");
			return pluginRegistry;
		}
		const startupOutcomes = createGatewayStartupOutcomeRecorder({
			cfg: params.gatewayPluginConfigAtStart,
			gatewayStartHooks: pluginRegistry.typedHooks.some((hook) => hook.hookName === "gateway_start")
		});
		const workerEnvironmentSidecar = params.isClosing?.() ? null : await params.startWorkerEnvironmentRuntime?.() ?? null;
		if (params.isClosing?.()) return pluginRegistry;
		params.log.info("starting channels and sidecars...");
		const loaderStatsBefore = getPluginModuleLoaderStats();
		const postReadySidecarCount = await (async () => {
			try {
				const startupRuntimeCurrent = params.pluginRuntimeClaim?.isCurrent() !== false;
				const pluginMetadataSnapshot = startupRuntimeCurrent ? params.pluginMetadataSnapshot : params.getCurrentPluginMetadataSnapshot?.();
				return await measureStartup(params.startupTrace, "sidecars.total", () => runtimeDeps.startGatewaySidecars({
					scheduler: params.scheduler,
					restartSentinelContext,
					cfg: startupRuntimeCurrent ? params.gatewayPluginConfigAtStart : params.getConfig(),
					getModelRuntimeConfig: params.getConfig,
					...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {},
					pluginRegistry,
					defaultWorkspaceDir: params.defaultWorkspaceDir,
					deps: params.deps,
					getCronService: params.getCronService,
					startChannels: params.startChannels,
					shouldStartChannels: () => params.isClosing?.() !== true,
					refreshChatMetadata: params.refreshChatMetadata,
					log: params.log,
					logHooks: params.logHooks,
					logChannels: params.logChannels,
					startupTrace: params.startupTrace,
					onChannelsStarted: params.onChannelsStarted,
					onPluginServices: reportPluginServices,
					onPostReadySidecars: params.onPostReadySidecars,
					shouldCreatePostReadySidecars: () => params.isClosing?.() !== true,
					shouldStartPluginServices: (pendingOwner) => {
						const current = params.getCurrentPluginServices?.();
						return params.isClosing?.() !== true && (current === void 0 || current === null || current === pendingOwner);
					},
					...params.pluginRuntimeClaim ? { pluginRuntimeClaim: params.pluginRuntimeClaim } : {},
					broadcastPluginEvent: params.broadcastPluginEvent,
					startupOutcomes,
					mainSessionRecoveryStartupCheckedStorePaths,
					isRestartRecoverySuppressed: params.isRestartRecoverySuppressed,
					waitForPostReadyWork: params.waitForPostReadyWork
				}));
			} catch (error) {
				try {
					await workerEnvironmentSidecar?.stop();
					if (workerEnvironmentSidecar) params.unregisterConnectionDependentSidecar(workerEnvironmentSidecar);
				} catch (cleanupError) {
					params.log.warn(`worker environment cleanup after sidecar startup failure failed: ${String(cleanupError)}`);
				}
				throw error;
			}
		})();
		if (params.isClosing?.()) return pluginRegistry;
		const loaderStatsAfter = getPluginModuleLoaderStats();
		params.startupTrace?.detail("sidecars.plugin-loader", [
			["callsCount", loaderStatsAfter.calls - loaderStatsBefore.calls],
			["nativeHitsCount", loaderStatsAfter.nativeHits - loaderStatsBefore.nativeHits],
			["nativeMissesCount", loaderStatsAfter.nativeMisses - loaderStatsBefore.nativeMisses],
			["sourceTransformForcedCount", loaderStatsAfter.sourceTransformForced - loaderStatsBefore.sourceTransformForced],
			["sourceTransformFallbacksCount", loaderStatsAfter.sourceTransformFallbacks - loaderStatsBefore.sourceTransformFallbacks]
		]);
		let mainSessionRecoverySidecar;
		await startupLog;
		if (params.isClosing?.()) return pluginRegistry;
		try {
			const { scheduleRestartAbortedMainSessionRecovery } = await loadMainSessionRestartRecoveryModule();
			if (params.isClosing?.() !== true) mainSessionRecoverySidecar = scheduleRestartAbortedMainSessionRecovery({
				delayMs: 0,
				getConfig: params.getConfig,
				shouldContinue: () => params.isClosing?.() !== true,
				startupCheckedStorePaths: mainSessionRecoveryStartupCheckedStorePaths,
				waitForStart: params.waitForPostReadyWork,
				gatewayRuntime: params.recoveryRuntime
			});
		} catch (err) {
			params.log.warn(`main-session restart recovery failed to schedule: ${String(err)}`);
		}
		if (params.isClosing?.()) {
			if (mainSessionRecoverySidecar) params.onGatewayLifetimeSidecars(mainSessionRecoverySidecar);
			return pluginRegistry;
		}
		params.unlockStartupMethods();
		const newGatewayLifetimeSidecars = [scheduleGatewayHandlerPrewarm(params), ...mainSessionRecoverySidecar ? [mainSessionRecoverySidecar] : []];
		const transcriptsConfig = params.pluginRuntimeClaim?.isCurrent() === false ? params.getConfig() : params.gatewayPluginConfigAtStart;
		newGatewayLifetimeSidecars.push(scheduleTranscriptsSidecar({
			cfg: transcriptsConfig,
			getConfig: params.getConfig,
			getPluginRegistry: () => params.getCurrentPluginRegistry?.() ?? pluginRegistry,
			lifetimeSignal: getGatewayContextLifetime(params.resolveGatewayContext).signal,
			startupTrace: params.startupTrace,
			log: params.log,
			waitForPostReadyWork: params.waitForPostReadyWork,
			shouldRun: () => params.isClosing?.() !== true
		}));
		params.onGatewayLifetimeSidecars(...newGatewayLifetimeSidecars);
		params.log.info(formatGatewayStartupOutcomes(startupOutcomes.snapshot()));
		params.onSidecarsReady?.();
		try {
			const activateSubagentRegistry = await runtimeDeps.loadSubagentRegistryActivation();
			if (params.isClosing?.() !== true) await activateSubagentRegistry(params.resolveGatewayContext);
		} catch (err) {
			params.log.warn(`subagent restart recovery failed to activate: ${String(err)}`);
		}
		if (params.isClosing?.()) return pluginRegistry;
		logGatewaySidecarsReady({
			log: params.log,
			getReadiness: params.getReadiness,
			startupTrace: params.startupTrace,
			loadedPluginCount: pluginRegistry.plugins.filter((plugin) => plugin.status === "loaded").length,
			postReadySidecarCount: postReadySidecarCount + newGatewayLifetimeSidecars.length + (controlUiAssetsSidecar ? 1 : 0)
		});
		return pluginRegistry;
	});
	const sidecarsPromise = params.trackStartupWork(startSidecars);
	params.trackStartupWork(async (signal) => {
		const sidecarRegistry = await sidecarsPromise;
		if (params.minimalTestGateway || candidateCanary) return;
		await runGatewayStartupObservers({
			registry: sidecarRegistry,
			signal,
			port: params.port,
			config: params.gatewayPluginConfigAtStart,
			workspaceDir: params.defaultWorkspaceDir,
			getCron: () => params.getCronService?.() ?? params.deps.cron,
			isClosing: params.isClosing,
			waitForPostReadyWork: params.waitForPostReadyWork,
			startupTrace: params.startupTrace,
			log: params.log,
			logHooks: params.logHooks,
			createHookRunner: runtimeDeps.createHookRunner,
			refreshLatestUpdateRestartSentinel: () => runtimeDeps.refreshLatestUpdateRestartSentinel(restartSentinelContext.workerContext.environment)
		});
	}).catch((err) => {
		params.log.warn(`gateway sidecars failed to start: ${String(err)}`);
	});
	if (params.sidecarStartup !== "defer") await sidecarsPromise;
	if (!params.minimalTestGateway && !candidateCanary) updateCheck.start();
	const startupSettled = params.sidecarStartup === "defer" ? Promise.all([sidecarsPromise, startupLogSettled.promise]).then(() => void 0) : Promise.resolve();
	startupSettled.catch(() => {});
	return {
		stopGatewayUpdateCheck: updateCheck.stop,
		startupSettled
	};
}
//#endregion
export { startGatewayPostAttachRuntime, startGatewaySidecars };
