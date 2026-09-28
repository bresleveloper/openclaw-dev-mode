import { a as addTimerTimeoutGraceMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as trackAsyncWork } from "./async-work-scope-CWk2dk1h.mjs";
import { t as resolvePluginReturnPromise } from "./plugin-return-value-CKL2xLy9.mjs";
import { a as getGatewayContextResolver, i as getGatewayContextLifetime, r as getCanonicalGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import "./gateway-request-scope-BLBH-Gpf.mjs";
import { r as STATE_DIR } from "./paths-DehQwyE0.mjs";
import { c as runPluginCleanup, t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { H as markTrustedOtelDiagnosticListener, S as registerDiagnosticTracePropagationBridge, b as waitForDiagnosticEventsDrained, g as onTrustedInternalDiagnosticEvent, s as emitTrustedDiagnosticEventWithPrivateData } from "./diagnostic-events-CVabF32H.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { s as resolveRuntimeServiceBuildId } from "./version-BkM1aB4w.mjs";
import { c as getPluginRecordRegistry, d as isPluginRecordActive } from "./registry-lifecycle-xdpzLZzd.mjs";
import { n as getPluginRegistryRuntime } from "./registry-runtime-binding-i7RQa2C4.mjs";
import { t as encodeStartupTraceSegment } from "./startup-trace-segment-Cd4cVDJE.mjs";
import { r as normalizeCronJobPatch, t as normalizeCronJobCreate } from "./normalize-_k1oAXPq.mjs";
import { i as recordDiagnosticExporterHealth } from "./diagnostic-stability-BaUvRyHr.mjs";
import { i as withPluginHttpRouteRegistry } from "./http-registry-Am1C83T4.mjs";
import { t as createPluginServiceGatewayEvents } from "./gateway-events-DP7ZxbjB.mjs";
import { t as createPluginServiceHealthReporter } from "./service-health-CNd0D8uW.mjs";
import { t as createPluginRuntimeCapabilityLease } from "./capability-lease-Dybi4lS4.mjs";
import { t as getGatewayProcessInstanceId } from "./process-instance-CwB3RMsz.mjs";
import { randomUUID } from "node:crypto";
//#region src/plugins/service-cron.ts
function createPluginServiceCronGetter(params) {
	let current;
	const assertServiceActive = () => {
		params.lease.assertActive("cron scheduler");
		if (params.isStopping()) throw new Error("Plugin service cron scheduler is stopping");
	};
	return () => {
		assertServiceActive();
		const cron = params.getCron();
		if (!cron) return;
		if (current?.cron === cron) return current.service;
		const commitGuard = () => {
			assertServiceActive();
			if (params.getCron() !== cron) throw new Error("Plugin service cron scheduler was replaced");
		};
		const service = {
			isEnabled: async () => {
				commitGuard();
				const { enabled } = await cron.status();
				commitGuard();
				return enabled;
			},
			list: async (opts) => {
				commitGuard();
				const jobs = await cron.list(opts);
				commitGuard();
				return jobs;
			},
			add: async (input) => {
				commitGuard();
				const normalized = normalizeCronJobCreate(input);
				if (!normalized) throw new Error("Plugin service cron create input is invalid");
				return await cron.add(normalized, { commitGuard });
			},
			update: async (id, patch) => {
				commitGuard();
				const normalized = normalizeCronJobPatch(patch);
				if (!normalized) throw new Error("Plugin service cron update input is invalid");
				return await cron.update(id, normalized, { commitGuard });
			},
			remove: async (id) => {
				commitGuard();
				return await cron.remove(id, { commitGuard });
			},
			removeStaleJobFamily: async (family) => {
				commitGuard();
				return await cron.removeStaleJobFamily(family, { commitGuard });
			}
		};
		current = {
			cron,
			service
		};
		return service;
	};
}
//#endregion
//#region src/plugins/service-nodes.ts
/** Issue node access owned by one service, independent of incoming RPC scopes. */
function createPluginServiceNodeInvoker(options) {
	const { registry, record, lease } = options;
	const runtime = getPluginRegistryRuntime(registry);
	const resolver = runtime && getGatewayContextResolver(runtime);
	const gatewayOwner = resolver && getCanonicalGatewayContextResolver(resolver);
	if (!resolver || !gatewayOwner) return;
	const lifetime = new AbortController();
	const instance = getPluginInstance(record);
	const signals = [lifetime.signal, getGatewayContextLifetime(gatewayOwner).signal];
	if (instance) signals.push(instance.lifecycle.signal);
	const stop = lease.retain(() => lifetime.abort(/* @__PURE__ */ new Error("Plugin service node access stopped")));
	const prepare = (request, duplex = false) => {
		const signal = AbortSignal.any(request.signal ? [...signals, request.signal] : signals);
		const assertCurrent = () => {
			signal.throwIfAborted();
			lease.assertActive("node access");
			if (options.isStopping() || !isPluginRecordActive(registry, record)) throw new Error("Plugin service node access is no longer active");
			const commands = getPluginRecordRegistry(registry, record).nodeHostCommands.filter((entry) => entry.command.command === request.command);
			if (commands.length !== 1 || commands[0]?.pluginId !== record.id) throw new Error(`Plugin service cannot invoke unowned node command: ${request.command}`);
			if (duplex && commands[0].command.duplex !== true && commands[0].command.duplex !== "optional") throw new Error(`Plugin service node command must declare duplex: true or "optional": ${request.command}`);
		};
		assertCurrent();
		return {
			signal,
			assertCurrent
		};
	};
	const invoke = async (request, authority, stream, streamSignal) => {
		const { assertCurrent } = authority;
		const signal = streamSignal ?? authority.signal;
		assertCurrent();
		const [{ dispatchGatewayRequestInProcess }, { createSyntheticPluginRuntimeClient }] = await Promise.all([import("./server-in-process-dispatch-DRfYl8Ja.mjs"), import("./server-plugin-runtime-client-BccniFxz.mjs")]);
		assertCurrent();
		const context = resolver();
		if (!context) throw new Error("Plugin service Gateway is unavailable");
		const client = createSyntheticPluginRuntimeClient({
			operatorRoleActor: { kind: "system" },
			pluginRuntimeOwnerId: record.id,
			nodeInvokeApprovalSessionKey: request.sessionKey,
			scopes: ["operator.write"]
		});
		if (stream) client.internal = {
			...client.internal,
			nodeInvokeStream: stream
		};
		const result = await dispatchGatewayRequestInProcess("node.invoke", {
			nodeId: request.nodeId,
			command: request.command,
			params: request.params,
			timeoutMs: request.timeoutMs,
			idempotencyKey: request.idempotencyKey || randomUUID(),
			...request.sessionKey ? { sessionKey: request.sessionKey } : {}
		}, {
			client,
			context,
			methodRegistry: context.getGatewayMethodRegistry?.(),
			requestIdPrefix: "plugin-service-node",
			signal,
			timeoutMs: request.timeoutMs !== void 0 && Number.isFinite(request.timeoutMs) && request.timeoutMs > 0 ? addTimerTimeoutGraceMs(request.timeoutMs) : void 0
		});
		assertCurrent();
		return result;
	};
	return {
		stop,
		async invoke(request) {
			return await invoke(request, prepare(request));
		},
		async openDuplex(request) {
			const authority = prepare(request, true);
			const { openOwnedGatewayNodeDuplex } = await import("./server-plugins-node-runtime-kAJAGDZL.mjs");
			authority.assertCurrent();
			const context = resolver();
			if (!context?.nodeRegistry) throw new Error("Plugin service Gateway node registry is unavailable");
			const boundAuthority = {
				signal: authority.signal,
				assertCurrent() {
					authority.assertCurrent();
					request.assertCurrent?.();
					if (resolver() !== context) throw new Error("Plugin service Gateway changed during node invocation");
				}
			};
			return await openOwnedGatewayNodeDuplex({
				params: request,
				context,
				...boundAuthority,
				invokeNode: (params, stream, signal) => invoke(params, boundAuthority, stream, signal)
			});
		}
	};
}
//#endregion
//#region src/plugins/services.ts
const log = createSubsystemLogger("plugins");
const PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS = 5e3;
var PluginServiceTimeoutError = class extends Error {};
var PluginServiceStopPendingError = class extends Error {
	constructor(message, settled, cause) {
		super(message, { cause });
		this.settled = settled;
		settled.catch(() => {});
	}
};
/** Observe only an issued service stop; mixed or permanent failures remain barriers. */
function getPluginServiceCleanupSettlement(error) {
	if (!(error instanceof AggregateError) || error.errors.length === 0 || !error.errors.every((failure) => failure instanceof PluginServiceStopPendingError)) return;
	const settled = Promise.all(error.errors.map((failure) => failure.settled)).then(() => {});
	settled.catch(() => {});
	return {
		error,
		settled
	};
}
const serviceOwners = /* @__PURE__ */ new WeakMap();
function preparePluginServicesOwner(registry, previousHandle) {
	const ownedServices = [];
	const previous = previousHandle && serviceOwners.get(previousHandle);
	const owner = {
		services: ownedServices,
		attempts: previous?.attempts ?? /* @__PURE__ */ new WeakMap(),
		registrations: new Set(registry.services),
		stopped: /* @__PURE__ */ new Set(),
		closed: false
	};
	if (previous) for (const registration of owner.registrations) {
		previous.registrations.delete(registration);
		const entry = owner.attempts.get(registration);
		if (!entry) continue;
		const source = entry.owner;
		source.registrations.delete(registration);
		source.services.splice(source.services.indexOf(entry), 1);
		if (source.stopped.has(registration) && entry.cleaned && !entry.startup) {
			owner.attempts.delete(registration);
			continue;
		}
		if (source.stopped.has(registration)) owner.stopped.add(registration);
		entry.owner = owner;
		ownedServices.push(entry);
	}
	return {
		ownedServices,
		owner
	};
}
function startPluginServices(params) {
	const preparedOwner = preparePluginServicesOwner(params.registry, params.previous);
	return startPreparedPluginServices({
		registry: params.registry,
		initialConfig: params.config,
		workspaceDir: params.workspaceDir,
		startupTrace: params.startupTrace,
		broadcastPluginEvent: params.broadcastPluginEvent,
		getCronService: params.getCronService,
		oneShotStopTimeouts: params.oneShotStopTimeouts,
		throwOnStartError: params.throwOnStartError,
		preparedOwner,
		publication: { callback: params.onHandle }
	});
}
async function startPreparedPluginServices({ registry, initialConfig, workspaceDir, startupTrace, broadcastPluginEvent, getCronService, oneShotStopTimeouts, throwOnStartError, preparedOwner, publication }) {
	const { ownedServices, owner } = preparedOwner;
	const canStart = (registration) => !owner.closed && owner.registrations.has(registration) && !owner.stopped.has(registration);
	const runBeforeDeadline = async (run, deadline, label, serviceOwner) => {
		const operation = Promise.resolve(run());
		if (deadline === void 0) return operation;
		const remaining = deadline - Date.now();
		const timeoutError = () => new PluginServiceTimeoutError(`${label} timed out after ${Math.max(0, remaining)}ms${serviceOwner ? ` (${serviceOwner})` : ""}`);
		let timer;
		try {
			await Promise.race([operation, remaining <= 0 ? Promise.reject(timeoutError()) : new Promise((_, reject) => {
				timer = setTimeout(() => reject(timeoutError()), remaining);
				timer.unref?.();
			})]);
		} finally {
			clearTimeout(timer);
		}
	};
	const stopService = async (entry, failures, deadline, beforeStop) => {
		entry.stopRequested = true;
		entry.stopNodeInvocations?.();
		const recordFailure = (error) => {
			if (!failures) return;
			if (deadline === void 0) {
				failures.push(error);
				return;
			}
			const message = `plugin service stop failed (plugin=${entry.pluginId}, service=${entry.id}): ${error instanceof PluginServiceTimeoutError ? error.message : `rejected: ${formatErrorMessage(error)}`}`;
			failures.push(error instanceof PluginServiceTimeoutError && entry.stopping ? new PluginServiceStopPendingError(message, entry.stopping.then(async () => {
				await entry.cleanupReporting;
				if (entry.cleanupErrors.length) throw new AggregateError(entry.cleanupErrors, message);
			}), error) : new Error(message, { cause: error }));
		};
		try {
			const invokeStop = () => {
				const record = entry.registry.plugins.find((candidate) => candidate.id === entry.pluginId);
				const stopRegistry = record ? getPluginRecordRegistry(entry.registry, record) : entry.registry;
				return withPluginHttpRouteRegistry(stopRegistry, () => entry.stop?.(), entry.lease);
			};
			const cleanup = () => {
				if (!entry.stopping) try {
					const ready = beforeStop ? beforeStop.then(() => entry.startup) : entry.startup;
					const stop = () => ready ? ready.then(invokeStop) : Promise.resolve(invokeStop());
					const stopping = entry.startupConsumer ? entry.startupConsumer.close(async () => {
						await stop();
					}) : stop();
					entry.stopping = stopping;
					stopping.then(() => {
						entry.cleaned = entry.cleanupErrors.length === 0;
					}, () => {});
				} catch (error) {
					const failure = createDeferredCore();
					failure.reject(error);
					entry.stopping = failure.promise;
				}
				const cleanupPromise = entry.stopping;
				trackAsyncWork(() => cleanupPromise).catch(() => {});
				return cleanupPromise;
			};
			await runBeforeDeadline(cleanup, deadline, entry.startup ? "plugin service startup settlement" : "plugin service stop");
			await entry.cleanupReporting;
			entry.cleanupErrors.forEach(recordFailure);
		} catch (err) {
			if (entry.cleanupErrors.includes(err)) {
				await entry.cleanupReporting;
				entry.cleanupErrors.forEach(recordFailure);
				return;
			}
			if (!entry.startup) entry.health.reportFailure(err);
			log.warn(`plugin service stop failed (${entry.id}): ${formatErrorMessage(err)}`);
			if (!(err instanceof PluginServiceTimeoutError)) throw err;
			recordFailure(err);
		} finally {
			entry.lease.revoke();
		}
	};
	const stopServices = async (reversed, strict, failures, deadline) => {
		const oneShotTimeouts = deadline === void 0 ? oneShotStopTimeouts : void 0;
		const afterDrain = oneShotTimeouts ? reversed : reversed.filter((entry) => entry.diagnosticsExporter);
		const producers = oneShotTimeouts ? [] : reversed.filter((entry) => !entry.diagnosticsExporter);
		for (const entry of producers) await stopService(entry, failures, deadline);
		let exporterReady;
		if (afterDrain.length > 0) {
			const owners = afterDrain.map((entry) => `plugin=${entry.pluginId}, service=${entry.id}`).join("; ");
			const draining = Promise.allSettled([...afterDrain.map((entry) => entry.startup), ...producers.map((entry) => entry.stopping)]).then(() => runBeforeDeadline(waitForDiagnosticEventsDrained, oneShotTimeouts ? Date.now() + oneShotTimeouts.eventDrainMs : deadline, "plugin diagnostic event drain", owners));
			exporterReady = draining.catch(() => {});
			try {
				await runBeforeDeadline(() => draining, deadline, "plugin diagnostic event drain", owners);
			} catch (error) {
				if (!strict && !oneShotTimeouts) throw error;
				failures.push(error);
			}
		}
		const stopDeadline = oneShotTimeouts ? Date.now() + oneShotTimeouts.serviceStopMs : deadline;
		for (const entry of afterDrain) await stopService(entry, failures, stopDeadline, exporterReady);
	};
	let reloadTail = Promise.resolve();
	const handle = {
		reload: (config, serviceIds) => {
			const reloading = reloadTail.then(async () => {
				await startupSettled;
				if (owner.closed) throw new Error("Plugin services are stopping");
				const selected = ownedServices.filter((entry) => serviceIds.has(entry.id));
				if (selected.some((entry) => owner.stopped.has(entry.registration))) throw new Error("Plugin services are stopping");
				for (const entry of selected) {
					entry.reloading = reloading;
					entry.stopRequested = true;
					entry.stopNodeInvocations?.();
				}
				const failures = [];
				try {
					await stopServices(selected.toReversed(), true, failures, Date.now() + PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS);
					if (failures.length > 0) throw new AggregateError(failures, "plugin service reload cleanup failed");
					for (const entry of selected) {
						if (!canStart(entry.registration)) continue;
						if (!await startService(entry.registration, config, failures)) throw new AggregateError(failures, "plugin service reload startup failed");
					}
				} finally {
					for (const entry of selected) if (entry.reloading === reloading) delete entry.reloading;
				}
			});
			reloadTail = reloading.catch(() => {});
			return reloading;
		},
		stop: (options) => {
			owner.closed ||= options?.pluginIds === void 0;
			for (const registration of owner.registrations) if (!options?.pluginIds || options.pluginIds.has(registration.pluginId)) owner.stopped.add(registration);
			const selected = ownedServices.filter((entry) => !options?.pluginIds || options.pluginIds.has(entry.pluginId));
			for (const entry of selected) {
				entry.stopRequested = true;
				entry.stopNodeInvocations?.();
			}
			const strict = options?.strict === true;
			const deadline = strict ? options.deadlineAtMs : void 0;
			return Promise.resolve().then(async () => {
				const failures = [];
				await stopServices(selected.toReversed(), strict, failures, deadline);
				if (strict && failures.length > 0) throw new AggregateError(failures, "plugin service replacement cleanup failed");
				return failures.length > 0 ? { errors: failures } : void 0;
			});
		}
	};
	serviceOwners.set(handle, owner);
	publication.callback?.(handle);
	publication.callback = void 0;
	const startService = async (entry, config, failures, candidate = false) => {
		const { service, id } = entry;
		const record = registry.plugins.find((plugin) => plugin.id === entry.pluginId);
		const instance = record && getPluginInstance(record);
		const runServiceCleanup = (run) => instance ? instance.runCleanup(run) : runPluginCleanup(service, run);
		const traceName = `sidecars.plugin-services.${encodeStartupTraceSegment(entry.pluginId)}.${encodeStartupTraceSegment(entry.id)}`;
		const lease = createPluginRuntimeCapabilityLease("plugin service");
		const gatewayEvents = createPluginServiceGatewayEvents({
			pluginId: entry.pluginId,
			broadcast: broadcastPluginEvent,
			lease
		});
		const { health, revoke } = createPluginServiceHealthReporter(entry);
		lease.retain(revoke);
		const getCron = getCronService ? createPluginServiceCronGetter({
			getCron: getCronService,
			lease,
			isStopping: () => ownedService.owner.closed || ownedService.stopRequested
		}) : void 0;
		const nodeInvoker = record ? createPluginServiceNodeInvoker({
			registry,
			record,
			lease,
			isStopping: () => ownedService.owner.closed || ownedService.stopRequested
		}) : void 0;
		const isDiagnosticsExporter = entry?.pluginId === entry?.id && (entry?.id === "diagnostics-otel" || entry?.id === "diagnostics-prometheus");
		const isOtelExporter = isDiagnosticsExporter && entry.id === "diagnostics-otel";
		const internalDiagnostics = isDiagnosticsExporter && (entry?.origin === "bundled" || entry?.trustedOfficialInstall === true) ? {
			getRuntimeIdentity: () => {
				lease.assertActive("runtime diagnostic identity");
				const buildId = resolveRuntimeServiceBuildId();
				return {
					processInstanceId: getGatewayProcessInstanceId(),
					...buildId ? { buildId } : {}
				};
			},
			emit: (event, privateData) => {
				lease.assertActive("internal diagnostic emitter");
				emitTrustedDiagnosticEventWithPrivateData(event, privateData);
			},
			onEvent: (listener, filter, options) => {
				lease.assertActive("internal diagnostic listener");
				const trustedListener = isOtelExporter ? markTrustedOtelDiagnosticListener(listener) : listener;
				return lease.retain(onTrustedInternalDiagnosticEvent(trustedListener, filter, options));
			},
			registerTracePropagationBridge: (bridge) => {
				lease.assertActive("diagnostic trace propagation bridge");
				return lease.retain(registerDiagnosticTracePropagationBridge(bridge));
			},
			reportExporterHealth: (update) => {
				if (lease.isActive()) recordDiagnosticExporterHealth(entry.id, update);
			}
		} : void 0;
		const scopeTraceName = (name) => `${traceName}.${name.split(".").map(encodeStartupTraceSegment).join(".")}`;
		const serviceContext = {
			config,
			workspaceDir,
			stateDir: STATE_DIR,
			logger: {
				info: (msg) => log.info(msg),
				warn: (msg) => log.warn(msg),
				error: (msg) => log.error(msg),
				debug: (msg) => log.debug(msg)
			},
			serviceHealth: health,
			...getCron ? { getCron } : {},
			...nodeInvoker ? {
				invokeNode: nodeInvoker.invoke,
				openNodeDuplex: nodeInvoker.openDuplex
			} : {},
			...gatewayEvents ? { gatewayEvents } : {},
			...startupTrace ? { startupTrace: {
				measure: (name, run) => startupTrace.measure(scopeTraceName(name), run),
				...startupTrace.detail ? { detail: (name, metrics) => startupTrace.detail?.(scopeTraceName(name), metrics) } : {}
			} } : {},
			...internalDiagnostics ? { internalDiagnostics } : {}
		};
		const recordCleanupFailure = (error) => {
			ownedService.cleanupErrors.push(error);
			health.reportFailure(error);
			log.warn(`plugin service stop failed (${id}): ${formatErrorMessage(error)}`);
		};
		const ownedService = {
			owner,
			cleaned: false,
			cleanupErrors: [],
			id,
			pluginId: entry.pluginId,
			registration: entry,
			registry,
			stopRequested: false,
			stopNodeInvocations: nodeInvoker?.stop,
			diagnosticsExporter: serviceContext.internalDiagnostics !== void 0,
			stop: service.stop ? () => runServiceCleanup(() => {
				try {
					const result = service.stop?.(serviceContext);
					const completion = resolvePluginReturnPromise(result);
					if (!completion) return result;
					ownedService.cleanupReporting = completion.catch(recordCleanupFailure);
					ownedService.cleanupReporting.catch(() => {});
					return completion;
				} catch (error) {
					return recordCleanupFailure(error);
				}
			}) : void 0,
			health,
			lease
		};
		const existingIndex = ownedServices.findIndex((current) => current.registration === entry);
		if (existingIndex >= 0) ownedServices[existingIndex] = ownedService;
		else {
			const declarationIndex = registry.services.indexOf(entry);
			const following = ownedServices.findIndex((current) => registry.services.indexOf(current.registration) > declarationIndex);
			ownedServices.splice(following < 0 ? ownedServices.length : following, 0, ownedService);
		}
		owner.attempts.set(entry, ownedService);
		try {
			const invokeStart = async () => {
				const settled = createDeferredCore();
				ownedService.startup = settled.promise;
				try {
					ownedService.startupConsumer = instance?.retainConsumer();
					const start = () => service.start(serviceContext);
					await withPluginHttpRouteRegistry(registry, () => ownedService.startupConsumer ? ownedService.startupConsumer.run(start) : start(), lease);
				} finally {
					ownedService.startupConsumer?.release();
					ownedService.startupConsumer = void 0;
					ownedService.startup = void 0;
					settled.resolve();
				}
			};
			await runBeforeDeadline(() => startupTrace ? startupTrace.measure(traceName, invokeStart) : invokeStart(), candidate ? Date.now() + PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS : void 0, "plugin service startup", `${entry.pluginId}/${id}`);
		} catch (err) {
			failures?.push(err);
			serviceContext.serviceHealth?.reportFailure(err);
			log.error(`plugin service failed (${id}, plugin=${entry.pluginId}, root=${entry.rootDir ?? "unknown"}): ${formatErrorMessage(err)}`);
			if (candidate && err instanceof PluginServiceTimeoutError) {
				ownedService.owner.stopped.add(entry);
				ownedService.lease.revoke();
				stopService(ownedService).catch(() => {});
				return false;
			}
			await stopService(ownedService, failures, Date.now() + PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS);
			return false;
		}
		return true;
	};
	let failedCount = 0;
	const startupSettled = (async () => {
		for (const entry of registry.services) {
			if (owner.closed) break;
			if (!canStart(entry)) {
				if (throwOnStartError && owner.stopped.has(entry)) throw new Error(`Previous plugin service cleanup remains pending (${entry.pluginId}/${entry.id})`);
				continue;
			}
			const retained = ownedServices.find((service) => service.registration === entry);
			if (retained) {
				const reloading = retained.reloading;
				if (!reloading) continue;
				await reloading;
				if (!canStart(entry)) continue;
			}
			const failures = [];
			if (!await startService(entry, initialConfig, failures, throwOnStartError === true)) {
				failedCount += 1;
				if (throwOnStartError) throw new AggregateError(failures, "plugin services failed to start");
			}
		}
	})();
	await startupSettled;
	startupTrace?.detail?.("sidecars.plugin-services.summary", [
		["serviceCount", registry.services.length],
		["startedCount", ownedServices.length - failedCount],
		["failedCount", failedCount]
	]);
	return handle;
}
//#endregion
export { getPluginServiceCleanupSettlement as n, startPluginServices as r, PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS as t };
