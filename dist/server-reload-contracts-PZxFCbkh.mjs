import { j as PluginInstanceDrainTimeoutError } from "./plugin-cache-BbahpD-b.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as getPluginInstance } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { $ as withPluginHostCleanupTimeout, Q as PluginHostCleanupTimeoutError, o as disposePluginRegistryInstances } from "./runtime-DkPagH0y.mjs";
import { i as withPluginHttpRouteRegistry } from "./http-registry-eGHR5upq.mjs";
import { i as collectRegistryInvocationInstances } from "./registry-inspection-resources-COvkPmap.mjs";
import { t as createHookRunner } from "./hooks-CU2qx9-T.mjs";
import { n as getPreparedModelRuntimePluginGeneration, t as getPreparedModelRuntimeBorrowedSnapshot } from "./prepared-model-runtime-generation-scope-D16PssC2.mjs";
import { n as getPluginServiceCleanupSettlement, t as PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS } from "./services-Do95f9n7.mjs";
//#region src/gateway/server-plugin-reload-cleanup.ts
const PLUGIN_RELOAD_ADMITTED_WORK_TIMEOUT_MS = 6e4;
var PluginAdmittedWorkTimeoutError = class extends Error {
	constructor(pluginIds, instances, cause) {
		const ids = [...pluginIds].join(", ");
		super(`plugin ${ids} admitted work did not settle within 60s; the previous plugin generation stays active. Use \`openclaw plugins reload ${[...pluginIds].join(" ")} --wait\` to wait until it finishes. If an agent turn holds this plugin, end that turn first or use the plugins tool with action reloadAndResume; waiting inside the same turn cannot make progress.`, { cause });
		this.instances = instances;
	}
};
/** Owns resource handoff and rejected-registration cleanup for one reload transaction. */
function createPluginReloadCleanup({ previousRegistry, changedPluginIds, port, pluginWorkspaceDir, getCron, abortSignal, log, recordCleanup, recordWarning, retainRetirement, waitForDrain = false }) {
	let pendingServiceCleanup;
	let admittedWorkDeadlineAtMs;
	let retainedWorkQueued = false;
	const quiescedInstances = [];
	const attempt = async (errors, run) => {
		try {
			await run();
		} catch (error) {
			errors.push(error);
		}
	};
	const drainInstances = async (registry, pluginIds, includeConsumers = true, signal) => {
		for (const record of registry.plugins) {
			if (!pluginIds.has(record.id)) continue;
			signal?.throwIfAborted();
			const drain = () => getPluginInstance(record)?.drain({
				includeConsumers,
				signal
			});
			const result = signal ? await drain() : await withPluginHostCleanupTimeout(`plugin ${record.id} admitted work`, drain);
			if (result?.errors.length) throw new AggregateError(result.errors, `Plugin ${record.id} work did not drain`);
		}
	};
	const admittedWorkDeadline = () => waitForDrain ? void 0 : admittedWorkDeadlineAtMs ??= Date.now() + PLUGIN_RELOAD_ADMITTED_WORK_TIMEOUT_MS;
	const observeDrain = async (label, signal, deadlineAtMs, run) => {
		const observation = new AbortController();
		const currentSignal = AbortSignal.any([signal, observation.signal]);
		try {
			if (deadlineAtMs === void 0) await run(currentSignal);
			else await withPluginHostCleanupTimeout(label, () => run(currentSignal), Math.max(0, deadlineAtMs - Date.now()));
		} finally {
			observation.abort();
		}
	};
	const drainWithDeadline = async (pluginIds, signal, reportStatus, phase) => {
		const deadlineAtMs = phase === "reloading" ? admittedWorkDeadline() : Date.now() + PLUGIN_RELOAD_ADMITTED_WORK_TIMEOUT_MS;
		reportStatus({
			phase,
			pluginIds: [...changedPluginIds],
			deadlineAtMs,
			reason: phase === "recovering" ? "Waiting for cleanup and admitted work before restoring the previous plugin runtime." : `Waiting for admitted work of plugin ${[...pluginIds].join(", ")} before replacing it.`
		});
		try {
			await observeDrain("previous plugin admitted work", signal, deadlineAtMs, async (current) => {
				if (phase === "recovering" && pendingServiceCleanup) await racePromiseWithAbortSignal(pendingServiceCleanup.settled, current);
				await drainInstances(previousRegistry, pluginIds, phase === "recovering", current);
			});
		} catch (error) {
			if (phase === "recovering" && error instanceof PluginHostCleanupTimeoutError) throw new Error("Previous plugin work did not settle before the recovery deadline", { cause: error });
			throw error;
		}
	};
	const disposeInstances = async (registry, pluginIds) => {
		const failures = [];
		for (const record of registry.plugins) {
			if (!pluginIds.has(record.id)) continue;
			await attempt(failures, async () => {
				const errors = await withPluginHostCleanupTimeout(`plugin ${record.id} resources`, async () => {
					const instance = getPluginInstance(record);
					return collectResourceFailures((await instance?.dispose(instance.disposing ? void 0 : async () => {
						const { runPluginHostLifecycleCleanup } = await import("./host-hook-cleanup-CUJLfuLk.mjs");
						const host = await runPluginHostLifecycleCleanup({
							registry,
							pluginId: record.id,
							reason: "restart"
						});
						recordCleanup(host);
						if (host.failures.length) throw new AggregateError(host.failures.map(({ error }) => error), `Plugin ${record.id} lifecycle cleanup failed`);
					}))?.errors ?? []);
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
	const previousInstances = (pluginIds) => previousRegistry.plugins.flatMap((record) => {
		const instance = pluginIds.has(record.id) && getPluginInstance(record);
		return instance ? [instance] : [];
	});
	const drainRetainedWork = async (pluginIds, signal, reportStatus, { includeConsumers = false, includeCalls = false } = {}) => {
		const instances = previousInstances(pluginIds);
		const count = instances.reduce((total, instance) => total + instance.retainedWorkCount + (includeCalls ? instance.ordinaryCallCount : 0), 0);
		if (!count) return;
		retainedWorkQueued = true;
		const deadlineAtMs = admittedWorkDeadline();
		const reason = `Plugin replacement queued behind ${count} ${includeCalls ? "admitted" : "retained"} work item(s) for plugin ${[...pluginIds].join(", ")}; ${waitForDrain ? "waiting until they finish or the request is cancelled" : "applies when they finish within the 60s drain budget"}.`;
		reportStatus({
			phase: "reloading",
			pluginIds: [...changedPluginIds],
			deadlineAtMs,
			reason
		});
		log.info(reason);
		try {
			await observeDrain("retained plugin work", signal, deadlineAtMs, (current) => Promise.all(instances.map((instance) => instance.waitForRetainedWork(current, {
				includeConsumers,
				includeCalls
			}))));
		} catch (error) {
			if (error instanceof PluginHostCleanupTimeoutError) throw new PluginAdmittedWorkTimeoutError(pluginIds, instances, error);
			throw error;
		}
	};
	return {
		attempt,
		drainRetainedWork,
		stopPreviousServices: async (services, strict, pluginIds = changedPluginIds) => {
			try {
				await services?.stop({
					strict: true,
					deadlineAtMs: Date.now() + PLUGIN_SERVICE_REPLACEMENT_STOP_TIMEOUT_MS,
					pluginIds
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
		assertResourceHandoff: (pluginIds) => {
			const releases = [];
			const generation = getPreparedModelRuntimePluginGeneration();
			const heldInstances = generation && getPreparedModelRuntimeBorrowedSnapshot(generation) ? new Set([generation.pluginRegistry, generation.inboundPluginRegistry].flatMap((registry) => registry ? Array.from(collectRegistryInvocationInstances(registry)) : [])) : void 0;
			for (const record of previousRegistry.plugins) if (pluginIds.has(record.id)) {
				const instance = getPluginInstance(record);
				if (instance?.hasActiveCall) throw new Error(`Plugin ${record.id} cannot replace itself from its own active call; retry after the call finishes.`);
				if (instance && heldInstances?.has(instance)) throw new Error(`Plugin ${record.id} cannot replace itself from its own active turn; retry after the turn finishes.`);
			}
			for (const instance of previousInstances(pluginIds)) releases.push(instance.reserveReplacement());
			return () => releases.forEach((release) => release());
		},
		drainInstances,
		drainMemory: async (drain) => {
			try {
				const result = await drain();
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
		},
		quiesceInstances: () => {
			for (const record of previousRegistry.plugins) {
				const instance = changedPluginIds.has(record.id) && getPluginInstance(record);
				if (instance && instance.quiesce()) quiescedInstances.push(instance);
			}
		},
		drainBeforeReplacement: async (pluginIds, signal, reportStatus, checkpoint) => {
			await drainRetainedWork(pluginIds, signal, reportStatus, {
				includeConsumers: true,
				includeCalls: true
			});
			await checkpoint();
			if (retainedWorkQueued) recordWarning("Plugin replacement waited for retained work to finish.");
			try {
				if (pluginIds.size) await drainWithDeadline(pluginIds, signal, reportStatus, "reloading");
			} catch (error) {
				if (error instanceof PluginHostCleanupTimeoutError) throw new PluginAdmittedWorkTimeoutError(pluginIds, previousInstances(pluginIds), error);
				throw error;
			}
		},
		resumeInstances: () => quiescedInstances.forEach((instance) => instance.resume()),
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
//#region src/gateway/server-reload-contracts.ts
var GatewayHotReloadCancelledError = class extends Error {
	constructor() {
		super("config hot reload cancelled by config supersession or in-process restart");
		this.name = "GatewayHotReloadCancelledError";
	}
};
var GatewayHotReloadRecoveryError = class extends Error {
	constructor(surface) {
		super(`config hot reload committed but could not schedule recovery for ${surface}`);
		this.name = "GatewayHotReloadRecoveryError";
	}
};
var GatewayReloadRequiresRecoveryOwnerError = class extends Error {
	constructor(surface) {
		super(`config reload requires a managed gateway restart owner for ${surface}`);
		this.name = "GatewayReloadRequiresRecoveryOwnerError";
	}
};
var GatewayHotReloadStaleSecretsError = class extends Error {
	constructor() {
		super("runtime secrets changed while config hot reload was deferred");
		this.name = "GatewayHotReloadStaleSecretsError";
	}
};
var GatewayConfigReloadSupersededError = class extends Error {
	constructor() {
		super("config reload superseded by a newer runtime config source");
		this.name = "GatewayConfigReloadSupersededError";
	}
};
function assertConfigReloadWriteSnapshot(snapshot) {
	if (!snapshot.exists || !snapshot.valid) throw new Error("Config write snapshot is missing or invalid; runtime application refused.");
}
function createReloadCancellationError(superseded) {
	return superseded ? new GatewayConfigReloadSupersededError() : new GatewayHotReloadCancelledError();
}
function assertReloadPublicationCurrent(publicationCurrent, restartStopped) {
	if (!publicationCurrent || restartStopped) throw createReloadCancellationError(!publicationCurrent);
}
//#endregion
export { assertConfigReloadWriteSnapshot as a, PluginAdmittedWorkTimeoutError as c, GatewayReloadRequiresRecoveryOwnerError as i, createPluginReloadCleanup as l, GatewayHotReloadRecoveryError as n, assertReloadPublicationCurrent as o, GatewayHotReloadStaleSecretsError as r, createReloadCancellationError as s, GatewayConfigReloadSupersededError as t, createPluginReloadDiagnostics as u };
