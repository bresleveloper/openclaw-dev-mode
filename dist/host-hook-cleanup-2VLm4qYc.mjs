import { A as appendPluginInstanceCleanupFailures } from "./plugin-cache-A1nT2dqa.mjs";
import { c as runPluginCleanup, t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { s as getRuntimeConfigSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { c as getPluginRecordRegistry } from "./registry-lifecycle-BhTDZAHB.mjs";
import { A as cleanupPluginSessionSchedulerJobs, F as preparePluginRunContextCleanup, P as makePluginSessionSchedulerJobKey, l as getActivePluginRegistry, z as withPluginRunContextCleanup } from "./runtime-BvdPUus5.mjs";
import { n as withPluginHostCleanupTimeout } from "./host-hook-cleanup-timeout-CuGfY1se.mjs";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-BFwcs62N.mjs";
import { t as normalizeSessionEntrySlotKey } from "./session-entry-slot-keys-CAUcdkW5.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync } from "./targets-Dmb8-YXN.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { m as cleanupPluginHostSessionStore } from "./session-accessor.reset-0gTJAhVB.mjs";
//#region src/plugins/host-hook-cleanup.ts
const log = createSubsystemLogger("plugins/cleanup");
function shouldCleanPlugin(pluginId, filterPluginId) {
	return !filterPluginId || pluginId === filterPluginId;
}
async function clearPluginSessionStores(params) {
	if (!params.pluginId && !params.sessionKey || params.mode === "promoted-slots" && params.sessionEntrySlotKeys?.size === 0) return 0;
	const storeTargets = params.storeTargets ?? params.resolveStoreTargets?.() ?? resolveAllAgentSessionStoreTargetsSync(params.cfg);
	let cleared = 0;
	for (const target of storeTargets) {
		if (params.shouldCleanup && !params.shouldCleanup()) break;
		if (readAgentDatabaseAdmissionRefusal(target.agentId)) continue;
		cleared += await cleanupPluginHostSessionStore({
			agentId: target.agentId,
			storePath: target.storePath,
			mode: params.mode,
			pluginId: params.pluginId,
			sessionKey: params.sessionKey,
			sessionEntrySlotKeys: params.sessionEntrySlotKeys,
			preserveLockedHarnessIds: params.preserveLockedHarnessIds,
			shouldCleanup: params.shouldCleanup
		});
	}
	return cleared;
}
function collectSessionEntrySlotKeys(registry, pluginId) {
	const slotKeys = /* @__PURE__ */ new Set();
	for (const registration of registry?.sessionExtensions ?? []) {
		if (!shouldCleanPlugin(registration.pluginId, pluginId)) continue;
		const slotKey = registration.extension.sessionEntrySlotKey;
		if (slotKey === void 0) continue;
		const normalized = normalizeSessionEntrySlotKey(slotKey);
		if (normalized.ok) slotKeys.add(normalized.key);
	}
	return slotKeys;
}
function collectAgentHarnessIds(registry, pluginId) {
	const harnessIds = /* @__PURE__ */ new Set();
	for (const registration of registry?.agentHarnesses ?? []) {
		if (!shouldCleanPlugin(registration.pluginId, pluginId)) continue;
		const harnessId = normalizeOptionalAgentRuntimeId(registration.harness.id);
		if (harnessId) harnessIds.add(harnessId);
	}
	return harnessIds;
}
/** Runs persistent and in-memory cleanup for a plugin, session, or host lifecycle event. */
async function runPluginHostCleanup(params) {
	const failures = [];
	const shouldCleanup = params.shouldCleanup ?? (() => true);
	if (!shouldCleanup()) return {
		cleanupCount: 0,
		failures
	};
	return withPluginRunContextCleanup(params, async (clearRunContext) => {
		const registry = params.registry;
		const cleanupRegistry = registry ?? getActivePluginRegistry();
		const sessionEntrySlotKeys = collectSessionEntrySlotKeys(cleanupRegistry, params.pluginId);
		const preserveLockedHarnessIds = params.reason === "disable" ? collectAgentHarnessIds(cleanupRegistry, params.pluginId) : void 0;
		const restartPromotedSessionEntrySlotKeys = params.restartPromotedSessionEntrySlotKeys ?? sessionEntrySlotKeys;
		let cleanupCount = 0;
		if (!params.skipPersistentSessionState && shouldCleanup()) try {
			cleanupCount = await clearPluginSessionStores({
				cfg: params.cfg ?? getRuntimeConfig(),
				mode: params.reason === "restart" ? "promoted-slots" : "plugin-owned-state",
				pluginId: params.pluginId,
				sessionKey: params.sessionKey,
				sessionEntrySlotKeys: params.reason === "restart" ? restartPromotedSessionEntrySlotKeys : sessionEntrySlotKeys,
				preserveLockedHarnessIds,
				storeTargets: params.sessionStoreTargets,
				resolveStoreTargets: params.resolveSessionStoreTargets,
				shouldCleanup
			});
		} catch (error) {
			failures.push({
				pluginId: params.pluginId ?? "plugin-host",
				hookId: "session-store",
				error
			});
		}
		if (registry) {
			const context = {
				reason: params.reason,
				sessionKey: params.sessionKey
			};
			const cleanups = [...registry.sessionExtensions.map(({ pluginId, extension }) => ({
				pluginId,
				hookId: `session:${extension.namespace}`,
				cleanup: extension.cleanup,
				context
			})), ...registry.runtimeLifecycles.map(({ pluginId, lifecycle }) => ({
				pluginId,
				hookId: `runtime:${lifecycle.id}`,
				cleanup: lifecycle.cleanup,
				context: {
					...context,
					runId: params.runId
				}
			}))];
			for (const { pluginId, hookId, cleanup, context: cleanupContext } of cleanups) {
				if (!shouldCleanup()) return {
					cleanupCount,
					failures
				};
				if (!cleanup || !shouldCleanPlugin(pluginId, params.pluginId)) continue;
				try {
					await withPluginHostCleanupTimeout(hookId, () => runPluginCleanup(cleanup, () => cleanup(cleanupContext)));
					cleanupCount += 1;
				} catch (error) {
					failures.push({
						pluginId,
						hookId,
						error
					});
				}
			}
			const schedulerFailures = await cleanupPluginSessionSchedulerJobs({
				pluginId: params.pluginId,
				reason: params.reason,
				sessionKey: params.sessionKey,
				records: registry.sessionSchedulerJobs,
				preserveJobIds: params.preserveSchedulerJobIds,
				cleanupOwnerRegistry: registry,
				preserveOwnerRegistry: params.preserveSchedulerOwnerRegistry,
				shouldCleanup
			});
			failures.push(...schedulerFailures);
		}
		if (params.reason !== "restart" && shouldCleanup()) {
			const registrySchedulerJobKeys = new Set((registry?.sessionSchedulerJobs ?? []).filter((record) => !params.pluginId || record.pluginId === params.pluginId).map((record) => ({
				pluginId: record.pluginId,
				jobId: typeof record.job.id === "string" ? record.job.id.trim() : ""
			})).filter(({ jobId }) => jobId.length > 0).map(({ pluginId, jobId }) => makePluginSessionSchedulerJobKey(pluginId, jobId)));
			const runtimeSchedulerFailures = await cleanupPluginSessionSchedulerJobs({
				pluginId: params.pluginId,
				reason: params.reason,
				sessionKey: params.sessionKey,
				preserveJobIds: params.preserveSchedulerJobIds,
				excludeJobKeys: registrySchedulerJobKeys,
				cleanupOwnerRegistry: registry ?? void 0,
				shouldCleanup
			});
			failures.push(...runtimeSchedulerFailures);
		}
		if (shouldCleanup() && (params.pluginId || params.runId) && (params.reason !== "restart" || params.runId)) clearRunContext();
		return {
			cleanupCount,
			failures
		};
	});
}
function collectHostHookPluginIds(registry) {
	return [
		...registry.sessionExtensions,
		...registry.runtimeLifecycles,
		...registry.agentEventSubscriptions,
		...registry.sessionSchedulerJobs
	].map((registration) => registration.pluginId);
}
function collectLoadedPluginIds(registry) {
	return new Set(registry.plugins.filter((plugin) => plugin.status === "loaded").map((plugin) => plugin.id));
}
function collectSchedulerJobIds(registry, pluginId) {
	return new Set((registry?.sessionSchedulerJobs ?? []).filter((registration) => registration.pluginId === pluginId).map((registration) => typeof registration.job.id === "string" ? registration.job.id.trim() : "").filter(Boolean));
}
function collectRestartPromotedSessionEntrySlotKeys(previousRegistry, nextRegistry, pluginId) {
	const staleSlotKeys = collectSessionEntrySlotKeys(previousRegistry, pluginId);
	const preservedSlotKeys = collectSessionEntrySlotKeys(nextRegistry, pluginId);
	for (const slotKey of preservedSlotKeys) staleSlotKeys.delete(slotKey);
	return staleSlotKeys;
}
/** Prepares one retirement; each waiter keeps its caller's exact instance admission. */
function createPluginHostRegistryRetirement(params) {
	const previousRegistry = params.previousRegistry;
	const shouldCleanup = params.shouldCleanup ?? (() => true);
	if (!previousRegistry || previousRegistry === params.nextRegistry || !shouldCleanup()) return async () => ({
		cleanupCount: 0,
		failures: []
	});
	const cfg = params.cfg ?? getRuntimeConfigSnapshot() ?? void 0;
	const runContextCleanup = preparePluginRunContextCleanup();
	const nextPluginIds = params.nextRegistry ? collectLoadedPluginIds(params.nextRegistry) : /* @__PURE__ */ new Set();
	const hostPluginIds = /* @__PURE__ */ new Set([...collectLoadedPluginIds(previousRegistry), ...collectHostHookPluginIds(previousRegistry)]);
	const previousPluginIds = /* @__PURE__ */ new Set([...previousRegistry.plugins.map((record) => record.id), ...hostPluginIds]);
	let sessionStoreTargets;
	const resolveSessionStoreTargets = () => sessionStoreTargets ??= resolveAllAgentSessionStoreTargetsSync(cfg ?? getRuntimeConfig());
	const waits = [];
	for (const pluginId of previousPluginIds) {
		const record = previousRegistry.plugins.find((entry) => entry.id === pluginId);
		if (record && (getPluginRecordRegistry(previousRegistry, record) !== previousRegistry || params.nextRegistry?.plugins.includes(record))) continue;
		const instance = record ? getPluginInstance(record) : void 0;
		const restarted = params.skipPersistentSessionState || nextPluginIds.has(pluginId);
		let result = {
			cleanupCount: 0,
			failures: []
		};
		const cleanup = hostPluginIds.has(pluginId) ? () => runContextCleanup(async () => {
			result = await runPluginHostCleanup({
				cfg,
				registry: previousRegistry,
				pluginId,
				reason: restarted ? "restart" : "disable",
				preserveSchedulerJobIds: restarted ? collectSchedulerJobIds(params.nextRegistry, pluginId) : void 0,
				shouldCleanup,
				restartPromotedSessionEntrySlotKeys: restarted ? collectRestartPromotedSessionEntrySlotKeys(previousRegistry, params.nextRegistry, pluginId) : void 0,
				preserveSchedulerOwnerRegistry: restarted ? params.nextRegistry : void 0,
				resolveSessionStoreTargets,
				skipPersistentSessionState: params.skipPersistentSessionState
			});
			for (const failure of result.failures) log.warn(`Plugin ${failure.pluginId} cleanup failed (${failure.hookId}): ${formatErrorMessage(failure.error)}`);
		}) : void 0;
		const completion = instance ? instance.dispose(instance.disposing ? void 0 : cleanup) : Promise.resolve().then(cleanup).then(() => ({ errors: [] }));
		completion.catch(() => {});
		waits.push(async (options) => {
			if (options?.deferConsumers && instance?.hasRetainedConsumers) return {
				...result,
				deferredPluginIds: [pluginId]
			};
			const disposed = await (instance ? instance.dispose() : completion);
			const failures = [...result.failures];
			appendPluginInstanceCleanupFailures(failures, pluginId, disposed);
			return {
				cleanupCount: result.cleanupCount,
				failures
			};
		});
	}
	return async (options) => {
		const results = await Promise.all(waits.map((wait) => wait(options)));
		const deferredPluginIds = results.flatMap((result) => result.deferredPluginIds ?? []);
		return {
			cleanupCount: results.reduce((count, result) => count + result.cleanupCount, 0),
			failures: results.flatMap((result) => result.failures),
			...deferredPluginIds.length ? { deferredPluginIds } : {}
		};
	};
}
//#endregion
export { runPluginHostCleanup as n, createPluginHostRegistryRetirement as t };
