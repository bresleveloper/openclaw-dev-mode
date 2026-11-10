import { a as addTimerTimeoutGraceMs } from "./number-coercion-CkhMiRw8.mjs";
import { t as materializeErrorStack } from "./error-graph-internal-oQNz0sbj.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-DjfKDZW8.mjs";
import { r as STATE_DIR } from "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { b as resolvePluginReturnPromise, g as getGatewayContextResolver, h as getGatewayContextLifetime, m as getCanonicalGatewayContextResolver } from "./gateway-request-scope-1BXD1G3l.mjs";
import { C as registerDiagnosticTracePropagationBridge, U as markTrustedOtelDiagnosticListener, _ as onTrustedInternalDiagnosticEvent, c as emitTrustedDiagnosticEventWithPrivateData, x as waitForDiagnosticEventsDrained } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { s as resolveRuntimeServiceBuildId } from "./version-jg_14gWz.mjs";
import { r as readOnlyWorkerScope } from "./sqlite-readonly-worker-context-DNk9aB7C.mjs";
import { a as createLazyRuntimeSurface, n as createLazyRuntimeMethodBinder } from "./lazy-runtime-CJrzFzqU.mjs";
import { l as getPluginRecordRegistry, m as isPluginRecordActive } from "./registry-lifecycle-CjTFYNkp.mjs";
import { d as runPluginCleanup, n as getPluginInstance } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { n as getPluginRegistryRuntime } from "./registry-runtime-binding-i7RQa2C4.mjs";
import { t as runOutsidePluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { i as withPluginHttpRouteRegistry } from "./http-registry-eGHR5upq.mjs";
import { r as withPluginServiceScheduler } from "./service-scheduler-binding-BGIyG3K0.mjs";
import { t as encodeStartupTraceSegment } from "./startup-trace-segment-Cd4cVDJE.mjs";
import { t as createPluginServiceGatewayEvents } from "./gateway-events-BQc8kPt3.mjs";
import { n as recordDiagnosticExporterHealth } from "./diagnostic-stability-BSh4HwPJ.mjs";
import { n as getGatewayControlUiIngressHost } from "./remote-control-ui-ingress-host-CPHalUyp.mjs";
import { r as normalizeCronJobPatch, t as normalizeCronJobCreate } from "./normalize-D_B-pqo1.mjs";
import { n as runOutsideOperatorToolGatewayAuthority } from "./operator-tool-gateway-authority-CgsnCzzP.mjs";
import { t as createScheduledGatewayRunner } from "./scheduled-run-gateway-context-Cs6rVhRo.mjs";
import { t as GatewayControlUiIngressError } from "./gateway-ingress.types-Bor6uDqj.mjs";
import { t as createPluginServiceHealthReporter } from "./service-health-hx2ULuc2.mjs";
import { n as createPluginServiceSchedulerRunner, r as createPluginRuntimeCapabilityLease, t as createPluginServiceScheduler } from "./service-scheduler-Bofi9JCx.mjs";
import { t as getGatewayProcessInstanceId } from "./process-instance-CwB3RMsz.mjs";
import { n as onGatewayWorkMetrics } from "./gateway-work-metrics-CBiRzU68.mjs";
import { randomUUID } from "node:crypto";
//#region src/plugins/service-cron.ts
function createPluginServiceCronGetter(params) {
	const runScheduled = createScheduledGatewayRunner(params.resolveGatewayContext);
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
			readEventSources: async () => {
				commitGuard();
				const sources = await cron.readEventSources(params.pluginId);
				commitGuard();
				return sources;
			},
			runEvent: async (id, input) => {
				commitGuard();
				const initialJob = cron.getJob(id);
				if (!initialJob || initialJob.schedule.kind !== "event" || initialJob.schedule.source !== params.pluginId || initialJob.state.sourceIdentity !== input.sourceIdentity) return { kind: "invalidated" };
				const { assertCurrent, ...event } = input;
				const assertSource = () => {
					commitGuard();
					const job = cron.getJob(id);
					if (!job || job.schedule.kind !== "event" || job.schedule.source !== params.pluginId || job.state.sourceIdentity !== input.sourceIdentity) throw new Error("Plugin automation event source is no longer current");
					assertCurrent();
				};
				return await runScheduled(() => cron.runEvent(id, {
					...event,
					commitGuard: assertSource
				}));
			},
			enqueueRun: async (id, mode) => {
				commitGuard();
				return await runScheduled(() => cron.enqueueRun(id, mode, { commitGuard }));
			},
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
//#region src/plugins/service-automation-capabilities.ts
function createPluginServiceAutomationCapabilities(params) {
	const common = {
		pluginId: params.pluginId,
		lease: params.lease,
		isStopping: params.isStopping,
		resolveGatewayContext: params.resolveGatewayContext
	};
	const getCron = params.getCronService ? createPluginServiceCronGetter({
		...common,
		getCron: params.getCronService
	}) : void 0;
	let mcpEvents;
	if (params.getCronService && params.resolveGatewayContext) {
		const getCronHost = params.getCronService;
		const load = createLazyRuntimeSurface(() => import("./service-mcp-events-CW0uer2-.mjs"), (module) => module.createPluginServiceMcpEvents({
			...common,
			getCron: getCronHost
		}));
		mcpEvents = { prepareSource: createLazyRuntimeMethodBinder(load)((service) => service.prepareSource) };
	}
	return {
		getCron,
		mcpEvents
	};
}
//#endregion
//#region src/plugins/service-control-ui-ingress.ts
/** Bind remote ingress to the admitted service, never the calling tool's authority. */
function createPluginServiceControlUiIngress(options) {
	const { registry, record, lease } = options;
	if (record.origin !== "bundled" && record.trustedOfficialInstall !== true) return;
	const runtime = getPluginRegistryRuntime(registry);
	const resolver = runtime && getGatewayContextResolver(runtime);
	const gatewayOwner = resolver && getCanonicalGatewayContextResolver(resolver);
	const host = gatewayOwner && getGatewayControlUiIngressHost(gatewayOwner);
	if (!resolver || !gatewayOwner || !host) return;
	const lifetime = new AbortController();
	const instance = getPluginInstance(record);
	const signal = AbortSignal.any([
		lifetime.signal,
		host.signal,
		getGatewayContextLifetime(gatewayOwner).signal,
		...instance ? [instance.lifecycle.signal] : []
	]);
	const assertCurrent = () => {
		signal.throwIfAborted();
		lease.assertActive("Control UI ingress");
		if (options.isStopping() || !isPluginRecordActive(registry, record) || getGatewayControlUiIngressHost(gatewayOwner) !== host || !resolver()) throw new GatewayControlUiIngressError("closed", "Plugin Control UI ingress is no longer active");
	};
	const stop = async () => {
		lifetime.abort(new GatewayControlUiIngressError("closed", "Plugin Control UI ingress stopped"));
	};
	lease.retain(() => void stop());
	const hostFactory = async () => {
		const { createGatewayControlUiIngressFactory } = await import("./remote-control-ui-ingress-JOcxf1Yk.mjs");
		return createGatewayControlUiIngressFactory({
			pluginId: record.id,
			signal,
			assertCurrent,
			host
		});
	};
	return {
		stop,
		factory: {
			capabilityVersion: 2,
			open: async (input) => (await hostFactory()).open(input),
			bindPrincipal: async (input) => (await hostFactory()).bindPrincipal(input)
		}
	};
}
//#endregion
//#region src/plugins/service-diagnostics.ts
function createPluginServiceDiagnostics(entry, lease) {
	if (!(entry.pluginId === entry.id && (entry.id === "diagnostics-otel" || entry.id === "diagnostics-prometheus")) || entry.origin !== "bundled" && entry.trustedOfficialInstall !== true) return;
	const isOtelExporter = entry.id === "diagnostics-otel";
	return {
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
		onGatewayWorkMetrics: (listener) => {
			lease.assertActive("gateway work metrics listener");
			return lease.retain(onGatewayWorkMetrics(listener));
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
	const stop = lease.retain(() => {
		lifetime.abort(/* @__PURE__ */ new Error("Plugin service node access stopped"));
		materializeErrorStack(lifetime.signal.reason);
	});
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
		const [{ dispatchGatewayRequestInProcess }, { createSyntheticPluginRuntimeClient }] = await Promise.all([import("./server-in-process-dispatch-CnXRjf5L.mjs"), import("./server-plugin-runtime-client-BrWhqpzp.mjs")]);
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
			const { openOwnedGatewayNodeDuplex } = await import("./server-plugins-node-runtime-DKAojyKQ.mjs");
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
	const previous = previousHandle && serviceOwners.get(previousHandle);
	const owner = {
		services: [],
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
		owner.services.push(entry);
	}
	return owner;
}
function startPluginServices({ previous, onHandle, ...params }) {
	return startPreparedPluginServices({
		...params,
		owner: preparePluginServicesOwner(params.registry, previous),
		publication: { callback: onHandle }
	});
}
async function startPreparedPluginServices({ scheduler, registry, config: initialConfig, workspaceDir, startupTrace, broadcastPluginEvent, getCronService, oneShotStopTimeouts, deferStartForPluginIds, throwOnStartError, owner, publication }) {
	const { services: ownedServices } = owner;
	const canStart = (registration) => !owner.closed && owner.registrations.has(registration) && !owner.stopped.has(registration);
	const runBeforeDeadline = async (run, deadline, label, serviceOwner) => {
		const operation = Promise.resolve(run());
		if (deadline === void 0) return operation;
		const remaining = deadline - performance.now();
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
		entry.scheduling.scheduler.beginClose();
		entry.stopNodeInvocations?.();
		entry.stopControlUiIngress?.();
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
				const scheduled = entry.scheduling.close();
				const ingress = entry.stopControlUiIngress?.();
				const cleanup = () => withPluginHttpRouteRegistry(stopRegistry, () => entry.stop?.(), entry.lease);
				return scheduled || ingress ? Promise.resolve().then(async () => {
					try {
						return await cleanup();
					} finally {
						await scheduled;
						await ingress;
					}
				}) : cleanup();
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
			log.warn(`plugin service degraded (plugin=${entry.pluginId}, service=${entry.id}): ${formatErrorMessage(err)}`);
			if (!(err instanceof PluginServiceTimeoutError)) throw err;
			recordFailure(err);
		} finally {
			entry.lease.revoke();
		}
	};
	const stopServices = async (reversed, strict, failures, deadline) => {
		const resolveDeadline = () => typeof deadline === "function" ? deadline() : deadline;
		const oneShotTimeouts = deadline === void 0 ? oneShotStopTimeouts : void 0;
		const afterDrain = oneShotTimeouts ? reversed : reversed.filter((entry) => entry.diagnosticsExporter);
		const producers = oneShotTimeouts ? [] : reversed.filter((entry) => !entry.diagnosticsExporter);
		for (const entry of producers) await stopService(entry, failures, resolveDeadline());
		let exporterReady;
		if (afterDrain.length > 0) {
			const owners = afterDrain.map((entry) => `plugin=${entry.pluginId}, service=${entry.id}`).join("; ");
			const draining = Promise.allSettled([...afterDrain.map((entry) => entry.startup), ...producers.map((entry) => entry.stopping)]).then(() => runBeforeDeadline(waitForDiagnosticEventsDrained, oneShotTimeouts ? performance.now() + oneShotTimeouts.eventDrainMs : resolveDeadline(), "plugin diagnostic event drain", owners));
			exporterReady = draining.catch(() => {});
			try {
				await runBeforeDeadline(() => draining, resolveDeadline(), "plugin diagnostic event drain", owners);
			} catch (error) {
				log.warn(`plugin diagnostic event drain failed (${owners}): ${formatErrorMessage(error)}`);
				if (!strict && !oneShotTimeouts) throw error;
				failures?.push(error);
			}
		}
		const stopDeadline = oneShotTimeouts && performance.now() + oneShotTimeouts.serviceStopMs;
		for (const entry of afterDrain) await stopService(entry, failures, stopDeadline ?? resolveDeadline(), exporterReady);
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
					entry.scheduling.scheduler.beginClose();
					entry.stopNodeInvocations?.();
					entry.stopControlUiIngress?.();
				}
				try {
					await stopServices(selected.toReversed(), true, void 0, () => performance.now() + PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS);
					for (const entry of selected) {
						if (!entry.cleaned || !canStart(entry.registration)) continue;
						await startService(entry.registration, config);
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
				entry.scheduling.scheduler.beginClose();
				entry.stopNodeInvocations?.();
				entry.stopControlUiIngress?.();
			}
			const strict = options?.strict === true;
			const deadline = strict && options?.deadlineAtMs !== void 0 ? performance.now() + Math.max(0, options.deadlineAtMs - Date.now()) : void 0;
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
		const runInServiceContext = instance?.lifecycle.runInBackgroundContext ?? ((run) => readOnlyWorkerScope.exit(run));
		const runServiceCleanup = (run) => instance ? instance.runCleanup(() => runInServiceContext(run)) : runPluginCleanup(service, run);
		const traceName = `sidecars.plugin-services.${encodeStartupTraceSegment(entry.pluginId)}.${encodeStartupTraceSegment(entry.id)}`;
		const lease = createPluginRuntimeCapabilityLease("plugin service");
		const gatewayEvents = createPluginServiceGatewayEvents({
			pluginId: entry.pluginId,
			broadcast: broadcastPluginEvent,
			lease
		});
		const { health, revoke } = createPluginServiceHealthReporter(entry);
		lease.retain(revoke);
		const runtime = getPluginRegistryRuntime(registry);
		const scheduling = runInServiceContext(() => createPluginServiceScheduler(scheduler, createPluginServiceSchedulerRunner({
			registry,
			record,
			instance,
			lease
		})));
		const resolveGatewayContext = runtime ? getGatewayContextResolver(runtime) : void 0;
		const runServiceStart = runInServiceContext(() => createScheduledGatewayRunner(resolveGatewayContext));
		const { getCron, mcpEvents } = createPluginServiceAutomationCapabilities({
			pluginId: entry.pluginId,
			lease,
			getCronService,
			resolveGatewayContext,
			isStopping: () => ownedService.owner.closed || ownedService.stopRequested
		});
		const nodeInvoker = record ? createPluginServiceNodeInvoker({
			registry,
			record,
			lease,
			isStopping: () => ownedService.owner.closed || ownedService.stopRequested
		}) : void 0;
		const internalDiagnostics = createPluginServiceDiagnostics(entry, lease);
		const controlUiIngress = record ? createPluginServiceControlUiIngress({
			registry,
			record,
			lease,
			isStopping: () => ownedService.owner.closed || ownedService.stopRequested
		}) : void 0;
		const scopeTraceName = (name) => `${traceName}.${name.split(".").map(encodeStartupTraceSegment).join(".")}`;
		const serviceContext = {
			scheduler: scheduling.scheduler,
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
			...mcpEvents ? { mcpEvents } : {},
			...nodeInvoker ? {
				invokeNode: nodeInvoker.invoke,
				openNodeDuplex: nodeInvoker.openDuplex
			} : {},
			...gatewayEvents ? { gatewayEvents } : {},
			...controlUiIngress ? { controlUiIngress: controlUiIngress.factory } : {},
			...startupTrace ? { startupTrace: {
				measure: (name, run) => startupTrace.measure(scopeTraceName(name), run),
				...startupTrace.detail ? { detail: (name, metrics) => startupTrace.detail?.(scopeTraceName(name), metrics) } : {}
			} } : {},
			...internalDiagnostics ? { internalDiagnostics } : {}
		};
		const recordCleanupFailure = (error) => {
			ownedService.cleanupErrors.push(error);
			health.reportFailure(error);
			log.warn(`plugin service degraded (plugin=${entry.pluginId}, service=${id}): ${formatErrorMessage(error)}`);
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
			stopControlUiIngress: controlUiIngress?.stop,
			diagnosticsExporter: serviceContext.internalDiagnostics !== void 0,
			stop: service.stop ? () => runServiceCleanup(() => {
				try {
					const result = withPluginServiceScheduler(scheduling.scheduler, () => service.stop?.(serviceContext));
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
			lease,
			scheduling
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
					const start = () => withPluginServiceScheduler(scheduling.scheduler, () => service.start(serviceContext));
					await runOutsideOperatorToolGatewayAuthority(() => runOutsidePluginRuntimeGenerationScope(() => pluginInstanceInvocation.exit(() => runServiceStart(async () => withPluginHttpRouteRegistry(registry, () => ownedService.startupConsumer ? ownedService.startupConsumer.run(start) : start(), lease)))));
				} finally {
					ownedService.startupConsumer?.release();
					ownedService.startupConsumer = void 0;
					ownedService.startup = void 0;
					settled.resolve();
				}
			};
			await runBeforeDeadline(() => startupTrace ? startupTrace.measure(traceName, invokeStart) : invokeStart(), candidate ? performance.now() + PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS : void 0, "plugin service startup", `${entry.pluginId}/${id}`);
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
			await stopService(ownedService, failures, performance.now() + PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS);
			return false;
		}
		return true;
	};
	let failedCount = 0;
	const startupSettled = (async () => {
		const reloads = new Map(ownedServices.map((entry) => [entry.registration, entry.reloading]));
		for (const entry of registry.services) {
			if (owner.closed) break;
			if (deferStartForPluginIds?.has(entry.pluginId)) continue;
			if (!canStart(entry)) {
				if (throwOnStartError && owner.stopped.has(entry)) throw new Error(`Previous plugin service cleanup remains pending (${entry.pluginId}/${entry.id})`);
				continue;
			}
			const retained = ownedServices.find((service) => service.registration === entry);
			if (retained) {
				const reloading = reloads.get(entry);
				if (!reloading) continue;
				await reloading;
				if (!retained.cleaned || !canStart(entry)) continue;
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
