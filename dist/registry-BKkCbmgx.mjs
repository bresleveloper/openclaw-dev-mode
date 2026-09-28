import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as trackAsyncWork, n as captureAsyncWorkTracker, r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-CGmhv_zp.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as hasNonEmptyString } from "./string-coerce-CIXf7egm.mjs";
import { t as PluginRuntimeCloseRetainedError } from "./runtime-close-error-CYO2S35x.mjs";
import { n as getProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { n as isAbortError, t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { c as runPluginCleanup, i as getPluginValueInstance, o as pluginInvocationContext, t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { n as defaultSlotIdForKey } from "./slots-D4OMSTbt.mjs";
import { h as resolveSelectedContextEnginePluginIdFromConfig, l as normalizePluginsConfig, s as normalizePluginId } from "./config-state-BEAL5gWH.mjs";
import { g as markPluginRegistriesRetired } from "./registry-lifecycle-xdpzLZzd.mjs";
import { l as getActivePluginRegistry, y as requireActivePluginRegistry } from "./runtime-B2zZQffc.mjs";
import { i as markRuntimeCompactionDelegate, n as inheritRuntimeCompactionDelegate } from "./compaction-watchdog-j-VZv3iA.mjs";
import { n as createCorePluginStateSyncKeyedStore } from "./plugin-state-store-CgyXRuSI.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
//#region src/context-engine/context-engine-abort.ts
function contextEngineAbortSignal(methodParams) {
	const signal = methodParams?.abortSignal;
	if (!signal || typeof signal !== "object" || !("aborted" in signal)) return;
	const abortSignal = signal;
	if (!abortSignal.aborted) return abortSignal;
	const reason = abortSignal.reason;
	throw reason instanceof Error ? reason : createAbortError(String(reason || "Context engine operation aborted."));
}
function isContextEngineAbortRejection(error, signal) {
	if (!signal?.aborted) return false;
	if (error === signal.reason || isAbortError(error)) return true;
	const seen = /* @__PURE__ */ new Set();
	for (let current = error; current instanceof Error && !seen.has(current); current = current.cause) {
		seen.add(current);
		if (current.cause === signal.reason) return true;
	}
	return false;
}
//#endregion
//#region src/plugin-state/runtime-health-store.ts
const currentProcessToken = randomUUID();
function hasValidEnvelope(value) {
	if (!value || typeof value !== "object") return false;
	const record = value;
	return typeof record.processId === "number" && Number.isInteger(record.processId) && record.processId > 0 && typeof record.processToken === "string" && record.processToken.length > 0 && (record.processStartTime === null || typeof record.processStartTime === "number" && Number.isFinite(record.processStartTime) && record.processStartTime >= 0) && typeof record.failedAtMs === "number" && Number.isFinite(record.failedAtMs);
}
/** Builds the common health envelope for records owned by this process. */
function createRuntimeHealthRecordEnvelope(failedAt) {
	return {
		processId: process.pid,
		processToken: currentProcessToken,
		processStartTime: getProcessStartTime(process.pid),
		failedAtMs: failedAt.getTime()
	};
}
function processLooksLive(record) {
	if (record.processId === process.pid) return record.processToken === currentProcessToken;
	const currentStartTime = getProcessStartTime(record.processId);
	return currentStartTime !== null && currentStartTime === record.processStartTime;
}
/** Opens a SQLite-backed health record namespace shared across runtime processes. */
function createRuntimeHealthStore(options) {
	const openStore = () => createCorePluginStateSyncKeyedStore({
		ownerId: options.ownerId,
		namespace: options.namespace,
		maxEntries: options.maxEntries,
		...options.ttlMs != null ? { defaultTtlMs: options.ttlMs } : {}
	});
	const normalize = (value) => hasValidEnvelope(value) ? options.normalizeRecord(value) : void 0;
	return {
		register(key, record) {
			openStore().register(key, record);
		},
		list() {
			try {
				const byGroup = /* @__PURE__ */ new Map();
				for (const entry of openStore().entries()) {
					const record = normalize(entry.value);
					if (!record || !processLooksLive(record)) continue;
					const groupKey = options.displayKey(record);
					const existing = byGroup.get(groupKey);
					if (!existing || (options.pick === "latest" ? record.failedAtMs > existing.failedAtMs : record.failedAtMs < existing.failedAtMs)) byGroup.set(groupKey, record);
				}
				return [...byGroup.values()];
			} catch {
				return [];
			}
		},
		clearForProcess(processId, matches) {
			try {
				const store = openStore();
				for (const entry of store.entries()) {
					const record = normalize(entry.value);
					if (record?.processId === processId && (!matches || matches(record))) store.delete(entry.key);
				}
			} catch {}
		}
	};
}
//#endregion
//#region src/context-engine/quarantine-health.ts
const quarantineStore = createRuntimeHealthStore({
	ownerId: "core:context-engine-quarantine-health",
	namespace: "runtime-quarantines",
	maxEntries: 64,
	normalizeRecord: (value) => {
		if (!hasNonEmptyString(value.engineId) || !hasNonEmptyString(value.operation) || !hasNonEmptyString(value.reason)) return;
		return {
			engineId: value.engineId,
			operation: value.operation,
			reason: value.reason,
			failedAtMs: value.failedAtMs,
			processId: value.processId,
			processToken: value.processToken,
			processStartTime: value.processStartTime,
			...hasNonEmptyString(value.owner) ? { owner: value.owner } : {}
		};
	},
	displayKey: (record) => record.engineId,
	pick: "earliest"
});
function recordPersistedContextEngineQuarantine(quarantine) {
	const record = {
		engineId: quarantine.engineId,
		operation: quarantine.operation,
		reason: quarantine.reason,
		...createRuntimeHealthRecordEnvelope(quarantine.failedAt),
		...quarantine.owner ? { owner: quarantine.owner } : {}
	};
	quarantineStore.register(JSON.stringify([record.engineId, record.processId]), record);
}
function listPersistedContextEngineQuarantines() {
	return quarantineStore.list().map(({ engineId, operation, reason, owner, failedAtMs }) => {
		const quarantine = {
			engineId,
			operation,
			reason,
			failedAt: new Date(failedAtMs)
		};
		if (owner) quarantine.owner = owner;
		return quarantine;
	});
}
function clearPersistedContextEngineQuarantineForProcess(engineId, processId) {
	quarantineStore.clearForProcess(processId, engineId === void 0 ? void 0 : (record) => record.engineId === engineId);
}
//#endregion
//#region src/context-engine/registry-adoption.ts
function canAdoptRuntimeContextEngineFromRoot(params) {
	if (!params.pluginId) return false;
	const targetPlugin = params.targetRegistry.plugins.find((plugin) => plugin.id === params.pluginId);
	const runtimePlugin = params.runtimeRegistry.plugins.find((plugin) => plugin.id === params.pluginId);
	return Boolean(targetPlugin && runtimePlugin && targetPlugin.status === "loaded" && runtimePlugin.status === "loaded" && targetPlugin.source === runtimePlugin.source);
}
/**
* Scoped production handles stay in discovery mode so full-only plugins cannot
* mutate process-global backends. Runtime context engines are adopted from the
* composition-root registry instead of re-running `registrationMode: "full"`.
*/
function adoptRuntimeContextEngineRegistrations(targetRegistry, runtimeRegistry) {
	let adopted;
	const takeAdopted = () => {
		adopted ??= new Map(targetRegistry.contextEngines);
		return adopted;
	};
	for (const [id, runtime] of runtimeRegistry.contextEngines) {
		if (runtime.lifecycle !== "runtime") continue;
		const target = targetRegistry.contextEngines.get(id);
		if (target?.lifecycle === "runtime") continue;
		if (target && target.owner !== runtime.owner) continue;
		if (!canAdoptRuntimeContextEngineFromRoot({
			pluginId: pluginIdFromContextEngineOwner(runtime.owner),
			targetRegistry,
			runtimeRegistry
		})) continue;
		takeAdopted().set(id, runtime);
	}
	if (!adopted) return targetRegistry;
	return {
		...targetRegistry,
		contextEngines: adopted
	};
}
function pluginIdFromContextEngineOwner(owner) {
	if (!owner.startsWith("plugin:")) return;
	return owner.slice(7).trim() || void 0;
}
//#endregion
//#region src/context-engine/registry-contract.ts
const CONTEXT_ENGINE_HOST_PARAMS = new Set("sessionKey prompt runtimeSettings sessionTarget runtimeContext abortSignal".split(" "));
function projectContextEngineHostParams(engine, methodName, params) {
	const accepted = engine.info.acceptedHostParams;
	if (!accepted) return params;
	return Object.fromEntries(Object.entries(params).filter(([key]) => accepted.includes(key) || !CONTEXT_ENGINE_HOST_PARAMS.has(key) || methodName === "compact" && key === "abortSignal"));
}
function describeResolvedContextEngineContractError(engineId, engine) {
	const candidate = asOptionalObjectRecord(engine);
	if (!candidate) return `Context engine "${engineId}" factory returned ${JSON.stringify(engine)} instead of a ContextEngine object.`;
	const issues = [];
	const info = asOptionalObjectRecord(candidate.info);
	if (!info) issues.push("missing info");
	else for (const field of ["id", "name"]) {
		const value = info[field];
		if (typeof value !== "string" || !value.trim()) issues.push(`missing info.${field}`);
	}
	for (const method of [
		"ingest",
		"assemble",
		"compact"
	]) if (typeof candidate[method] !== "function") issues.push(`missing ${method}()`);
	return issues.length === 0 ? null : `Context engine "${engineId}" factory returned an invalid ContextEngine: ${issues.join(", ")}.`;
}
//#endregion
//#region src/context-engine/registry-selection.ts
/** Applies canonical plugin policy to a registered engine without changing its engine ID. */
function resolveEffectiveContextEngineId(config, entries) {
	const plugins = normalizePluginsConfig(config?.plugins);
	const engineId = plugins.slots.contextEngine;
	const defaultEngineId = defaultSlotIdForKey("contextEngine");
	if (!engineId || engineId === defaultEngineId) return defaultEngineId;
	const entry = entries.get(engineId);
	const pluginId = (entry && pluginIdFromContextEngineOwner(entry.owner)) ?? engineId;
	return resolveSelectedContextEnginePluginIdFromConfig(plugins, normalizePluginId(pluginId)) ? engineId : defaultEngineId;
}
//#endregion
//#region src/plugins/plugin-invocation-scope.ts
/** Finite execution custody for one host-selected registry and its exact instances. */
var PluginInvocationScope = class PluginInvocationScope {
	constructor(registry, instances, options = {}) {
		this.registry = registry;
		this.bindings = /* @__PURE__ */ new Map();
		this.consumers = /* @__PURE__ */ new Map();
		this.closed = false;
		this.consumerKind = options.kind ?? "work";
		try {
			for (const instance of new Set(instances)) if (options.retained) {
				const acquire = () => instance.retainConsumer((run) => this.run(run), registry, this.consumerKind);
				const parent = options.parent?.consumer(instance);
				const consumer = parent ? parent.run(acquire) : acquire();
				this.consumers.set(instance, consumer);
				this.bindings.set(instance, consumer);
			} else this.bindings.set(instance, {
				run: (run) => this.run(() => instance.runInRegistry(registry, run)),
				wrap: instance.createRegistryView(registry, (run) => this.run(run))
			});
		} catch (error) {
			this.release();
			throw error;
		}
	}
	consumer(instance) {
		this.assertOpen();
		return this.consumers.get(instance);
	}
	assertOpen() {
		if (this.closed) throw new Error("Plugin invocation scope is closed");
	}
	lookup(instance) {
		const binding = this.bindings.get(instance);
		if (binding) this.assertOpen();
		return binding;
	}
	run(run) {
		this.assertOpen();
		return pluginInvocationContext.run(this, run);
	}
	wrap(value) {
		if (!value || typeof value !== "object" && typeof value !== "function") return value;
		const instance = getPluginValueInstance(value);
		return instance ? this.lookup(instance)?.wrap(value) ?? value : value;
	}
	/** Transfer custody before revoking callbacks captured by ordinary engine operations. */
	beginCleanup() {
		this.assertOpen();
		const cleanup = new PluginInvocationScope(this.registry, this.bindings.keys());
		const finished = createDeferredCore();
		const closed = Promise.all([...this.consumers].map(([instance, consumer]) => consumer.close(() => {
			const teardown = pluginInstanceInvocation.getStore();
			if (!teardown) throw new Error("Plugin consumer cleanup has no invocation");
			const run = (operation) => cleanup.run(() => pluginInstanceInvocation.run(teardown, () => instance.runCleanup(operation)));
			cleanup.bindings.set(instance, {
				run,
				wrap: instance.createRegistryView(this.registry, run)
			});
			return finished.promise;
		})));
		closed.catch(() => {});
		this.closed = true;
		return {
			scope: cleanup,
			release: async () => {
				cleanup.release();
				finished.resolve();
				await closed;
			}
		};
	}
	release() {
		if (this.closed) return;
		this.closed = true;
		for (const consumer of this.consumers.values()) consumer.release();
	}
};
/** Enumerate exact instances already represented by this finite registry view. */
function collectRegistryInvocationInstances(registry) {
	const instances = /* @__PURE__ */ new Set();
	for (const record of registry.plugins) {
		const instance = getPluginInstance(record);
		if (instance) instances.add(instance);
	}
	for (const { host } of registry.decisionProviders) {
		const instance = getPluginInstance(host.record);
		if (instance) instances.add(instance);
	}
	for (const entry of registry.channels) {
		const instance = entry.borrowedRuntimeRecord && getPluginInstance(entry.borrowedRuntimeRecord);
		if (instance) instances.add(instance);
	}
	const values = [
		...registry.channels.map(({ plugin }) => plugin),
		...[...registry.contextEngines.values()].map(({ factory }) => factory),
		...registry.widgetPresenters.map(({ presenter }) => presenter),
		...registry.memoryCorpusSupplements.map(({ supplement }) => supplement),
		...registry.memoryPromptPreparations.map(({ prepare }) => prepare),
		...registry.memoryPromptSupplements.map(({ builder }) => builder)
	];
	for (const value of values) {
		const instance = getPluginValueInstance(value);
		if (instance) instances.add(instance);
	}
	return instances;
}
//#endregion
//#region src/plugins/registry-registration-resources.ts
/** Physical registration custody, independent of registry execution authority. */
var PluginRegistrationResourceSource = class {
	#registrations = /* @__PURE__ */ new Map();
	#pending = /* @__PURE__ */ new Set();
	#dependencies = [];
	#cleanupWork = new AsyncWorkScope();
	#claims = 0;
	#closed = false;
	constructor(retire) {
		this.retire = retire;
	}
	acquireClaim(owner) {
		if (this.#closed) throw new Error("Plugin registration resources have been released");
		this.#claims++;
		let release;
		return { release: () => {
			if (!release) {
				const last = --this.#claims === 0;
				this.#closed = last;
				const cleanup = this.#cleanupWork.track(async () => {
					await Promise.resolve();
					const disposals = [...this.#registrations].filter(([, entry]) => entry.rolledBack ? owner === "inspection" : last).map(([pluginId, entry]) => this.#dispose(pluginId, entry));
					await this.#waitForRegistrations();
					const failures = (await Promise.allSettled(disposals)).flatMap((outcome) => outcome.status === "fulfilled" ? outcome.value : [new PluginRuntimeCloseRetainedError(outcome.reason)]);
					if (last) {
						await Promise.allSettled([...this.#registrations].map(([pluginId, entry]) => this.#dispose(pluginId, entry)));
						try {
							await this.retire();
						} catch (error) {
							failures.push(error instanceof Error ? error : new Error("Plugin inspection cleanup failed", { cause: error }));
						} finally {
							await Promise.all([...this.#registrations.values()].map(({ work }) => work.drain()));
						}
						for (const releaseDependency of this.#dependencies.splice(0)) try {
							await releaseDependency();
						} catch (cause) {
							failures.push(new Error("Borrowed plugin registration resources could not be disposed", { cause }));
						}
					}
					return failures;
				});
				release = (async () => {
					try {
						return await cleanup;
					} finally {
						if (last) await this.#cleanupWork.run(() => this.#cleanupWork.drain());
					}
				})();
			}
			return release;
		} };
	}
	/** Acquires custody before publication and relinquishes it after final physical disposal. */
	retainDependency(acquire) {
		if (this.#closed) throw new Error("Plugin registration resources have been released");
		this.#dependencies.push(acquire().release);
	}
	#registration(pluginId) {
		let entry = this.#registrations.get(pluginId);
		if (!entry) {
			entry = {
				disposers: [],
				work: new AsyncWorkScope()
			};
			this.#registrations.set(pluginId, entry);
		}
		return entry;
	}
	runRegistration(pluginId, run, runCleanup) {
		const entry = this.#registration(pluginId);
		entry.runCleanup ??= runCleanup;
		try {
			entry.work.run(run);
		} finally {
			this.#trackRegistration(entry.work.runWhenIdle(() => void 0));
		}
	}
	register(pluginId, disposer) {
		this.#registration(pluginId).disposers.push(disposer);
	}
	trackRegistration(pending) {
		this.#trackRegistration(trackAsyncWork(() => pending));
	}
	#trackRegistration(pending) {
		const completion = pending.then(() => void 0, () => void 0);
		this.#pending.add(completion);
		completion.then(() => this.#pending.delete(completion));
	}
	rollback(pluginId, retire) {
		const entry = this.#registration(pluginId);
		entry.rolledBack = true;
		entry.retire ??= retire;
		this.#dispose(pluginId, entry);
	}
	async #waitForRegistrations() {
		while (this.#pending.size > 0) await Promise.all(this.#pending);
	}
	#pendingWork() {
		return [...this.#registrations.values()].filter((entry) => !entry.disposalStarted).map((entry) => entry.work);
	}
	#dispose(pluginId, entry) {
		return entry.disposal ??= Promise.resolve().then(async () => {
			const signalCleanup = async () => {
				entry.work.beginClose();
				await this.#waitForRegistrations();
				await AsyncWorkScope.runWhenAllIdle(() => this.#pendingWork(), () => void 0);
			};
			await (entry.runCleanup ? entry.runCleanup(signalCleanup) : signalCleanup());
			const failures = [];
			try {
				await AsyncWorkScope.runWhenAllIdle(() => this.#pendingWork(), () => entry.work.track(async () => {
					entry.disposalStarted = true;
					const disposers = entry.disposers.splice(0);
					for (const { id, dispose } of disposers) try {
						await dispose();
					} catch (cause) {
						failures.push(new Error(`Plugin inspection disposal failed: ${pluginId}:${id}`, { cause }));
					}
				}));
				try {
					await entry.work.runWhenIdle(() => entry.retire?.());
				} catch (cause) {
					failures.push(new Error(`Plugin inspection retirement failed: ${pluginId}`, { cause }));
				}
				return failures;
			} finally {
				if (entry.rolledBack) await entry.work.drain();
				else await entry.work.runWhenIdle(() => void 0);
			}
		});
	}
};
//#endregion
//#region src/plugins/registry-inspection-resources.ts
const inspections = resolveGlobalSingleton(Symbol.for("openclaw.pluginRegistryInspectionResources"), () => /* @__PURE__ */ new WeakMap());
function getPluginRegistryInspectionResources(registry) {
	return inspections.get(registry);
}
function throwDisposalFailures(failures) {
	if (failures.length > 0) throw new AggregateError(failures, "Plugin inspection resources could not all be disposed");
}
/** Owns only an explicitly acquired, uncached inspection's registration resources. */
var PluginRegistryInspectionResources = class {
	#rollbackInstances = /* @__PURE__ */ new Set();
	#source = new PluginRegistrationResourceSource(() => this.retire(this.#registry, this.#rollbackInstances));
	#claim = this.#source.acquireClaim("inspection");
	#registries = /* @__PURE__ */ new Set();
	#dependencies = /* @__PURE__ */ new WeakSet();
	#registry;
	#adoptedInvocations;
	#release;
	constructor(retire) {
		this.retire = retire;
	}
	attach(registry) {
		if (this.#release) throw new Error("Plugin inspection resources have been released");
		this.#registry ??= registry;
		this.#registries.add(registry);
		inspections.set(registry, this);
	}
	register(pluginId, disposer) {
		this.#source.register(pluginId, disposer);
	}
	runRegistration(pluginId, run, runCleanup) {
		this.#source.runRegistration(pluginId, run, runCleanup);
	}
	trackRegistration(pending) {
		this.#source.trackRegistration(pending);
	}
	rollback(pluginId, retire, instance) {
		if (instance) this.#rollbackInstances.add(instance);
		this.#source.rollback(pluginId, retire);
	}
	/** Copied callbacks keep their source through this inspection's final disposer. */
	retainDependency(dependency) {
		if (this.#release) throw new Error("Plugin inspection resources have been released");
		if (dependency !== this) {
			this.#source.retainDependency(() => dependency.retain());
			this.#dependencies.add(dependency);
		}
	}
	/** Adopt executable donor custody before the acquired view can escape to a caller. */
	adoptInvocations(registry, donor) {
		if (this.#release || this.#adoptedInvocations) throw new Error("Plugin inspection invocation adoption is closed");
		const primaryInstances = new Set(this.#registry?.plugins.flatMap((record) => {
			const instance = getPluginInstance(record);
			return instance ? [instance] : [];
		}) ?? []);
		const borrowed = [...collectRegistryInvocationInstances(registry)].filter((instance) => !primaryInstances.has(instance));
		const donorSource = donor && getPluginRegistryInspectionResources(donor);
		let physical;
		this.#source.retainDependency(() => ({ release: async () => {
			this.#adoptedInvocations?.release();
			await physical?.release();
		} }));
		if (donorSource && donorSource !== this) {
			physical = donorSource.retain();
			this.#dependencies.add(donorSource);
		}
		this.#adoptedInvocations = new PluginInvocationScope(registry, borrowed, {
			retained: true,
			kind: "custody"
		});
	}
	wrapAdoptedValue(value) {
		return this.#adoptedInvocations ? this.#adoptedInvocations.wrap(value) : value;
	}
	/** Logical use owns its execution consumers separately from this inspection's physical claims. */
	createInvocationScope(registry, instances = collectRegistryInvocationInstances(registry)) {
		if (this.#release) throw new Error("Plugin inspection resources have been released");
		return new PluginInvocationScope(registry, instances, {
			retained: true,
			parent: this.#adoptedInvocations
		});
	}
	/** Recorded coverage survives retirement; retain() still checks this inspection's lifetime. */
	coversSource(source) {
		return source === this || this.#dependencies.has(source);
	}
	/** Retains physical resources without extending this inspection's authority. */
	retain() {
		if (this.#release) throw new Error("Plugin inspection resources have been released");
		const claim = this.#source.acquireClaim("borrower");
		let release;
		return { release: () => release ??= claim.release().then(throwDisposalFailures) };
	}
	release() {
		if (!this.#release) {
			this.#release = this.#claim.release().then(throwDisposalFailures);
			markPluginRegistriesRetired(this.#registries);
			this.#registries.clear();
		}
		return this.#release;
	}
};
//#endregion
//#region src/context-engine/registry.resources.ts
const registrationSources = resolveGlobalSingleton(Symbol.for("openclaw.contextEngineRegistrationSources"), () => /* @__PURE__ */ new WeakMap());
function recordContextEngineRegistrationSource(registration, registry) {
	const resources = getPluginRegistryInspectionResources(registry);
	if (resources) registrationSources.set(registration, resources);
}
var ContextEngineFactoryResources = class {
	constructor(claims, invocations) {
		this.claims = claims;
		this.invocations = invocations;
		this.work = new AsyncWorkScope();
		this.context = this.work.run(() => AsyncLocalStorage.snapshot());
		this.cleanupWork = new AsyncWorkScope();
		this.cleanupContext = this.cleanupWork.run(() => AsyncLocalStorage.snapshot());
		this.parentSignal = getAsyncWorkSignal();
		this.abort = () => {
			this.context(() => this.work.beginClose(this.parentSignal?.reason));
			this.cleanupContext(() => this.cleanupWork.beginClose(this.parentSignal?.reason));
		};
		this.parentSignal?.addEventListener("abort", this.abort, { once: true });
		if (this.parentSignal?.aborted) this.abort();
	}
	run(operation) {
		return this.work.track(() => this.context(() => this.invoke(operation)));
	}
	runCleanup(operation) {
		this.beginCleanup();
		try {
			return this.cleanupWork.run(() => this.cleanupContext(() => this.cleanupInvocations ? this.cleanupInvocations.scope.run(operation) : operation()));
		} finally {
			this.context(() => this.work.beginClose());
		}
	}
	beginCleanup() {
		this.cleanupInvocations ??= this.invocations?.beginCleanup();
	}
	invoke(operation) {
		return this.invocations ? this.invocations.run(operation) : operation();
	}
	wrap(value) {
		return this.invocations ? this.invocations.wrap(value) : value;
	}
	async release() {
		this.parentSignal?.removeEventListener("abort", this.abort);
		this.invocations?.release();
		let failure;
		try {
			await this.cleanupInvocations?.release();
		} catch (error) {
			failure = { error };
		}
		for (const claim of this.claims) try {
			await claim.release();
		} catch (error) {
			failure ??= { error };
		}
		if (failure) throw failure.error;
	}
};
function retainContextEngineFactorySource(registry, registration, primary, abandon) {
	const claims = [];
	try {
		if (primary) claims.push(primary.retain());
		const source = registration && registrationSources.get(registration);
		if (source && !primary?.coversSource(source)) claims.push(source.retain());
		const instances = collectRegistryInvocationInstances(registry);
		if (claims.length === 0 && instances.size === 0) return;
		return new ContextEngineFactoryResources(claims, primary ? primary.createInvocationScope(registry) : new PluginInvocationScope(registry, instances, { retained: registration !== void 0 && getPluginValueInstance(registration.factory) !== void 0 }));
	} catch (error) {
		if (claims.length > 0) abandon(new ContextEngineFactoryResources(claims));
		throw error;
	}
}
/** One instance may come from both factories; every source stays held through shared cleanup. */
async function disposeContextEngineSources(engine, sources, dispose = () => engine?.dispose?.()) {
	if (sources.length === 0) {
		await dispose();
		return;
	}
	for (const source of sources) source.beginCleanup();
	const cleanup = sources[0].cleanupWork.track(() => sources[0].runCleanup(dispose));
	for (const source of sources) source.context(() => source.work.beginClose());
	const [engineResult] = await Promise.allSettled([cleanup]);
	const scopes = sources.flatMap((source) => [source.work, source.cleanupWork]);
	await AsyncWorkScope.runWhenAllIdle(() => scopes, () => {
		for (const source of sources) source.cleanupContext(() => source.cleanupWork.beginClose());
	});
	await AsyncWorkScope.runWhenAllIdle(() => scopes, () => Promise.all(sources.flatMap((source) => [source.context(() => source.work.drain()), source.cleanupContext(() => source.cleanupWork.drain())])));
	const released = await Promise.allSettled(sources.map((source) => source.release()));
	if (engineResult.status === "rejected") throw engineResult.reason;
	for (const result of released) if (result.status === "rejected") throw result.reason;
}
/** Report selection separately while its admitted owner joins failed-factory cleanup. */
async function runContextEngineFactoryResolution(resolve, onCleanupFailure) {
	const reportCleanupFailure = onCleanupFailure ? AsyncLocalStorage.bind(onCleanupFailure) : void 0;
	const result = createDeferredCore();
	const failedSources = [];
	const abandon = (source) => {
		if (source) failedSources.push(disposeContextEngineSources(void 0, [source]).catch((error) => {
			reportCleanupFailure?.();
			console.warn(`[context-engine] Failed factory resource cleanup: ${sanitizeForLog(String(error))}`);
		}));
	};
	captureAsyncWorkTracker()(async () => {
		try {
			result.resolve(await resolve(abandon));
		} catch (error) {
			result.reject(error);
		} finally {
			await Promise.all(failedSources);
		}
	}).catch(result.reject);
	return await result.promise;
}
function retainLogicalTurnContextEngineSources(registry, fallback, configured, abandon) {
	const primary = getPluginRegistryInspectionResources(registry);
	const fallbackSource = retainContextEngineFactorySource(registry, fallback, primary, abandon);
	try {
		return {
			fallback: fallbackSource,
			configured: configured?.lifecycle === "runtime" ? retainContextEngineFactorySource(registry, configured, primary, abandon) : void 0
		};
	} catch (error) {
		return {
			fallback: fallbackSource,
			configuredFailure: { error }
		};
	}
}
async function resolveContextEngineFactory(source, owners, create) {
	const ref = await (source ? source.run(create) : create());
	if (source) {
		const retained = owners.get(ref.engine) ?? [];
		retained.push(source);
		owners.set(ref.engine, retained);
	}
	return ref;
}
/** Foreground engine resolution shares the same factory execution and physical resource owner. */
async function createContextEngineWithResources(registry, registration, create) {
	return await runContextEngineFactoryResolution(async (abandon) => {
		const source = retainContextEngineFactorySource(registry, registration, getPluginRegistryInspectionResources(registry), abandon);
		try {
			return await (source ? source.run(() => create(source)) : create(void 0));
		} catch (error) {
			abandon(source);
			throw error;
		}
	});
}
//#endregion
//#region src/context-engine/registry.ts
const GUARDED_CONTEXT_ENGINE_METHODS = new Set("bootstrap maintain ingest ingestBatch afterTurn commitTurn assemble compact prepareSubagentSpawn onSubagentEnded".split(" "));
const resolvedEngineMetadata = /* @__PURE__ */ new WeakMap();
function inheritCompactionWatchdogOwnership(property, source, wrapped) {
	if (property !== "compact") return wrapped;
	return inheritRuntimeCompactionDelegate(source, wrapped);
}
function wrapResolvedContextEngine(rawEngine, metadata) {
	let disposal;
	const source = metadata.source;
	const engine = source?.wrap(rawEngine) ?? rawEngine;
	const fallback = metadata.defaultEngineId && metadata.factoryCtx && metadata.engineId !== metadata.defaultEngineId ? {
		defaultEngineId: metadata.defaultEngineId,
		factoryCtx: metadata.factoryCtx
	} : void 0;
	let fallbackEnginePromise;
	let resolvedFallbackEngine;
	const getFallbackEngine = fallback ? async () => {
		if (disposal) throw new Error("Context engine has been disposed");
		const resolve = () => resolveDefaultContextEngine(fallback.defaultEngineId, fallback.factoryCtx);
		return await (fallbackEnginePromise ??= (source ? source.run(resolve) : resolve()).then((resolved) => {
			resolvedFallbackEngine = resolved;
			return resolved;
		}));
	} : void 0;
	const disposeOwned = () => {
		if (disposal) return disposal;
		const completion = createDeferredCore();
		disposal = completion.promise;
		(async () => {
			const fallbackResult = fallbackEnginePromise && !resolvedFallbackEngine ? (await Promise.allSettled([fallbackEnginePromise]))[0] : {
				status: "fulfilled",
				value: resolvedFallbackEngine
			};
			const fallbackEngine = fallbackResult.status === "fulfilled" ? fallbackResult.value : void 0;
			const sources = metadata.ownsSource && source ? [source] : [];
			const shared = fallbackEngine && hasSameContextEngineInstance(wrapped, fallbackEngine);
			const fallbackSource = fallbackEngine && resolvedEngineMetadata.get(fallbackEngine)?.source;
			if (shared && fallbackSource) sources.push(fallbackSource);
			const fallbackCleanup = (async () => {
				if (!shared) await fallbackEngine?.dispose?.();
			})();
			const results = await Promise.allSettled([(async () => {
				if (source && !metadata.ownsSource) await source.runCleanup(() => rawEngine.dispose?.());
				else await disposeContextEngineSources(rawEngine, sources, () => source ? rawEngine.dispose?.() : runPluginCleanup(metadata.factory, () => rawEngine.dispose?.()));
			})(), fallbackCleanup]);
			for (const result of [...results, fallbackResult]) if (result.status === "rejected") throw result.reason;
		})().then(completion.resolve, completion.reject);
		return disposal;
	};
	const wrapped = new Proxy(Object.create(engine, { info: { get: () => engine.info } }), { get(_target, property) {
		if (property === "dispose" && (source || fallback)) return disposeOwned;
		if (property === "info") {
			if (!fallback || !getContextEngineQuarantine(metadata.engineId)) return engine.info;
			return resolvedFallbackEngine?.info ?? {
				id: fallback.defaultEngineId,
				name: fallback.defaultEngineId === "legacy" ? "Legacy Context Engine" : `${fallback.defaultEngineId} Context Engine`
			};
		}
		const invokeMember = (run) => property === "dispose" ? runPluginCleanup(metadata.factory, run) : run();
		const method = invokeMember(() => Reflect.get(engine, property, engine));
		if (typeof method !== "function") return method;
		if (!GUARDED_CONTEXT_ENGINE_METHODS.has(property)) return (...args) => invokeMember(() => Reflect.apply(method, engine, args));
		const methodName = property;
		if (!fallback || !getFallbackEngine) {
			const invoke = (params) => method.call(engine, projectContextEngineHostParams(engine, methodName, params));
			return inheritCompactionWatchdogOwnership(property, method, invoke);
		}
		const invokeFallback = async (methodParams) => {
			contextEngineAbortSignal(methodParams);
			return await invokeFallbackContextEngineMethod({
				getFallbackEngine,
				methodName,
				methodParams
			});
		};
		if (getContextEngineQuarantine(metadata.engineId)) return methodName === "compact" ? markRuntimeCompactionDelegate(invokeFallback) : invokeFallback;
		const invoke = async (methodParams) => {
			const abortSignal = contextEngineAbortSignal(methodParams);
			if (getContextEngineQuarantine(metadata.engineId)) return await invokeFallback(methodParams);
			try {
				return await method.call(engine, projectContextEngineHostParams(engine, methodName, methodParams));
			} catch (error) {
				if (isContextEngineAbortRejection(error, abortSignal)) throw error;
				recordContextEngineQuarantine({
					engineId: metadata.engineId,
					owner: metadata.owner,
					operation: methodName,
					error,
					defaultEngineId: fallback.defaultEngineId
				});
				if (methodName === "compact" || methodName === "prepareSubagentSpawn") throw error;
				return await invokeFallback(methodParams).catch(() => {
					throw error;
				});
			}
		};
		return inheritCompactionWatchdogOwnership(property, method, invoke);
	} });
	resolvedEngineMetadata.set(wrapped, {
		...metadata,
		sourceEngine: metadata.sourceEngine ?? resolvedEngineMetadata.get(engine)?.sourceEngine ?? engine
	});
	return wrapped;
}
const CONTEXT_ENGINE_REGISTRY_STATE = Symbol.for("openclaw.contextEngineRegistryState");
const CORE_CONTEXT_ENGINE_OWNER = "core";
const contextEngineRegistryState = resolveGlobalSingleton(CONTEXT_ENGINE_REGISTRY_STATE, () => ({ quarantinedEngines: /* @__PURE__ */ new Map() }));
const getContextEngines = () => requireActivePluginRegistry().contextEngines;
function requireContextEngineOwner(owner) {
	const normalizedOwner = owner.trim();
	if (!normalizedOwner) throw new Error(`registerContextEngineForOwner: owner must be a non-empty string, got ${JSON.stringify(owner)}`);
	return normalizedOwner;
}
function recordContextEngineQuarantine(params) {
	const existing = contextEngineRegistryState.quarantinedEngines.get(params.engineId);
	if (existing) return existing;
	const quarantine = {
		engineId: params.engineId,
		operation: params.operation,
		reason: params.error instanceof Error ? params.error.message : String(params.error),
		failedAt: /* @__PURE__ */ new Date(),
		...params.owner ? { owner: params.owner } : {}
	};
	contextEngineRegistryState.quarantinedEngines.set(params.engineId, quarantine);
	try {
		recordPersistedContextEngineQuarantine(quarantine);
	} catch {}
	const ownerSuffix = params.owner ? ` owner=${sanitizeForLog(params.owner)}` : "";
	console.error(`[context-engine] Context engine "${sanitizeForLog(params.engineId)}"${ownerSuffix} failed during ${sanitizeForLog(params.operation)}: ${sanitizeForLog(quarantine.reason)}; quarantining it for this process and falling back to default engine "${params.defaultEngineId}".`);
	return quarantine;
}
function getContextEngineQuarantine(engineId) {
	return contextEngineRegistryState.quarantinedEngines.get(engineId);
}
function listContextEngineQuarantines() {
	const quarantines = Array.from(contextEngineRegistryState.quarantinedEngines.values(), ({ failedAt, ...quarantine }) => ({
		...quarantine,
		failedAt: new Date(failedAt)
	}));
	const seenEngineIds = new Set(quarantines.map((entry) => entry.engineId));
	return quarantines.concat(listPersistedContextEngineQuarantines().filter(({ engineId }) => !seenEngineIds.has(engineId)));
}
function clearContextEngineRuntimeQuarantine(engineId) {
	contextEngineRegistryState.quarantinedEngines.delete(engineId);
	clearPersistedContextEngineQuarantineForProcess(engineId, process.pid);
}
/**
* Register a context engine implementation under an explicit trusted owner.
*/
function registerContextEngineForOwner(id, factory, owner, opts) {
	const targetRegistry = requireActivePluginRegistry();
	const result = registerContextEngineInRegistry(targetRegistry, id, factory, owner, opts);
	if (result.ok && (opts?.lifecycle ?? "runtime") === "runtime" && getActivePluginRegistry() === targetRegistry) clearContextEngineRuntimeQuarantine(id);
	return result;
}
/** Registers an engine in a registry value while that value is being assembled. */
function registerContextEngineInRegistry(pluginRegistry, id, factory, owner, opts) {
	const normalizedOwner = requireContextEngineOwner(owner);
	const lifecycle = opts?.lifecycle ?? "runtime";
	const registry = pluginRegistry.contextEngines;
	const existing = registry.get(id);
	if (id === defaultSlotIdForKey("contextEngine") && normalizedOwner !== CORE_CONTEXT_ENGINE_OWNER) return {
		ok: false,
		existingOwner: CORE_CONTEXT_ENGINE_OWNER
	};
	if (existing && existing.owner !== normalizedOwner) return {
		ok: false,
		existingOwner: existing.owner
	};
	if (existing?.lifecycle === "runtime" && lifecycle === "readOnlyDiscovery") return { ok: true };
	if (existing && opts?.allowSameOwnerRefresh !== true) return {
		ok: false,
		existingOwner: existing.owner
	};
	const registration = {
		factory,
		owner: normalizedOwner,
		lifecycle
	};
	recordContextEngineRegistrationSource(registration, pluginRegistry);
	registry.set(id, registration);
	return { ok: true };
}
/** Clear runtime quarantine only after a complete builder-local registry becomes active. */
function activateContextEngineRegistrations(pluginRegistry) {
	for (const [id, registration] of pluginRegistry.contextEngines) if (registration.lifecycle === "runtime") clearContextEngineRuntimeQuarantine(id);
}
/** Returns registration metadata so callers can distinguish discovery snapshots from runtime entries. */
function getContextEngineRegistration(id) {
	return getContextEngines().get(id);
}
const listContextEngineIds = () => [...getContextEngines().keys()].toSorted();
/**
* Return the trusted plugin id that registered a resolved context engine.
* Downgraded engines intentionally report no plugin owner.
*/
function resolveContextEngineOwnerPluginId(engine) {
	const metadata = engine ? resolvedEngineMetadata.get(engine) : void 0;
	const owner = metadata && !getContextEngineQuarantine(metadata.engineId) ? metadata.owner : void 0;
	return owner ? pluginIdFromContextEngineOwner(owner) : void 0;
}
const hasSameContextEngineInstance = (left, right) => (resolvedEngineMetadata.get(left)?.sourceEngine ?? left) === (resolvedEngineMetadata.get(right)?.sourceEngine ?? right);
const CONTEXT_ENGINE_FALLBACK_RESULTS = {
	bootstrap: {
		bootstrapped: false,
		reason: "context engine downgraded to legacy"
	},
	maintain: {
		changed: false,
		bytesFreed: 0,
		rewrittenEntries: 0,
		reason: "context engine downgraded to legacy"
	},
	ingest: { ingested: false },
	ingestBatch: { ingestedCount: 0 }
};
async function invokeFallbackContextEngineMethod(params) {
	const fallbackEngine = await params.getFallbackEngine();
	const fallbackMethod = fallbackEngine[params.methodName];
	if (typeof fallbackMethod === "function") return await fallbackMethod.call(fallbackEngine, params.methodParams);
	if (params.methodName === "assemble" || params.methodName === "compact") throw new Error(`No legacy fallback result for ${params.methodName}`);
	const fallbackResult = CONTEXT_ENGINE_FALLBACK_RESULTS[params.methodName];
	return fallbackResult ? { ...fallbackResult } : void 0;
}
function resolvedContextEngineRef(params) {
	const pluginId = pluginIdFromContextEngineOwner(params.owner);
	return Object.freeze({
		engine: params.engine,
		registeredId: params.registeredId,
		...pluginId ? { ownerPluginId: pluginId } : {}
	});
}
async function createOwnedContextEngine(engineId, entry, factoryCtx, options = {}) {
	let engine;
	try {
		engine = await entry.factory(factoryCtx);
		options.onValidation?.();
		const contractError = describeResolvedContextEngineContractError(engineId, engine);
		if (contractError) throw new Error(`${options.contractErrorPrefix ?? ""}${contractError}`);
		return wrapResolvedContextEngine(engine, {
			sourceEngine: resolvedEngineMetadata.get(engine)?.sourceEngine ?? engine,
			source: options.source,
			ownsSource: options.ownsSource,
			engineId,
			owner: entry.owner,
			factory: entry.factory,
			defaultEngineId: options.defaultEngineId,
			factoryCtx
		});
	} catch (error) {
		const dispose = () => engine?.dispose?.();
		await Promise.resolve().then(() => options.source ? options.source.runCleanup(dispose) : runPluginCleanup(entry.factory, dispose)).catch(() => void 0);
		throw error;
	}
}
async function resolveRawContextEngineRef(engineId, factoryCtx, entry, source) {
	if (!entry) throw new Error(`Context engine "${engineId}" is not registered. Available engines: ${listContextEngineIds().join(", ") || "(none)"}`);
	return resolvedContextEngineRef({
		engine: await createOwnedContextEngine(engineId, entry, factoryCtx, { source }),
		registeredId: engineId,
		owner: entry.owner
	});
}
/**
* Resolve fresh engines for one logical turn without consulting or mutating
* process quarantine. A failed configured engine is retried by the next turn.
*/
async function resolveLogicalTurnContextEngines(config, options) {
	return await runContextEngineFactoryResolution(async (abandon) => {
		const defaultEngineId = defaultSlotIdForKey("contextEngine");
		const configuredEngineId = resolveEffectiveContextEngineId(config, getContextEngines());
		const factoryCtx = {
			config,
			agentDir: options?.agentDir,
			workspaceDir: options?.workspaceDir
		};
		const registry = requireActivePluginRegistry();
		const entries = registry.contextEngines;
		const fallbackEntry = entries.get(defaultEngineId);
		const configuredEntry = entries.get(configuredEngineId);
		const sources = retainLogicalTurnContextEngineSources(registry, fallbackEntry, configuredEngineId === defaultEngineId ? void 0 : configuredEntry, abandon);
		const sourceResources = /* @__PURE__ */ new Map();
		let fallback;
		try {
			fallback = await resolveContextEngineFactory(sources.fallback, sourceResources, () => resolveRawContextEngineRef(defaultEngineId, factoryCtx, fallbackEntry, sources.fallback));
		} catch (error) {
			abandon(sources.fallback);
			abandon(sources.configured);
			throw error;
		}
		if (configuredEngineId === defaultEngineId) return {
			configured: fallback,
			configuredId: configuredEngineId,
			fallback,
			sourceResources
		};
		if (!configuredEntry || configuredEntry.lifecycle === "readOnlyDiscovery") return {
			configured: fallback,
			configuredId: configuredEngineId,
			configuredFailure: !configuredEntry ? `context engine "${configuredEngineId}" is not registered` : `context engine "${configuredEngineId}" is available for discovery only`,
			fallback,
			sourceResources
		};
		try {
			if (sources.configuredFailure) throw sources.configuredFailure.error;
			return {
				configured: await resolveContextEngineFactory(sources.configured, sourceResources, () => resolveRawContextEngineRef(configuredEngineId, factoryCtx, configuredEntry, sources.configured)),
				configuredId: configuredEngineId,
				fallback,
				sourceResources
			};
		} catch (error) {
			abandon(sources.configured);
			return {
				configured: fallback,
				configuredId: configuredEngineId,
				configuredFailure: error instanceof Error ? error.message : String(error),
				fallback,
				sourceResources
			};
		}
	}, options?.onCleanupFailure);
}
/**
* Resolve which ContextEngine to use based on plugin slot configuration.
*
* Resolution order:
*   1. `config.plugins.slots.contextEngine` when its plugin policy permits it
*   2. Default slot value ("legacy")
*
* When `config` is provided it is forwarded to the factory as part of a
* {@link ContextEngineFactoryContext}. Additional runtime paths can be
* supplied via `options`. Existing no-arg factories continue to work
* because JavaScript permits extra arguments at call sites.
*
* Non-default engines that fail (unregistered, factory throw, or contract
* violation) are logged and silently replaced by the default engine.
* Host admission/resource failures and owner cancellation propagate without quarantine.
* Default-engine failures also propagate.
*/
async function resolveContextEngine(config, options) {
	const defaultEngineId = defaultSlotIdForKey("contextEngine");
	const engineId = resolveEffectiveContextEngineId(config, getContextEngines());
	const isDefaultEngine = engineId === defaultEngineId;
	const factoryCtx = {
		config,
		agentDir: options?.agentDir,
		workspaceDir: options?.workspaceDir
	};
	if (!isDefaultEngine ? getContextEngineQuarantine(engineId) : void 0) return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
	const entry = getContextEngines().get(engineId);
	if (!entry) {
		if (isDefaultEngine) throw new Error(`Context engine "${engineId}" is not registered. Available engines: ${listContextEngineIds().join(", ") || "(none)"}`);
		recordContextEngineQuarantine({
			engineId,
			operation: "resolve",
			error: "not registered",
			defaultEngineId
		});
		return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
	}
	if (!isDefaultEngine && entry.lifecycle === "readOnlyDiscovery") {
		console.warn(`[context-engine] Context engine "${engineId}" owner=${entry.owner} is registered for read-only discovery only; falling back to default engine "${defaultEngineId}" without quarantine until runtime activation registers it.`);
		return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
	}
	const abortSignal = getAsyncWorkSignal();
	let operation;
	try {
		return await createContextEngineWithResources(requireActivePluginRegistry(), entry, (source) => {
			operation = "factory";
			return createOwnedContextEngine(engineId, entry, factoryCtx, {
				source,
				ownsSource: true,
				defaultEngineId,
				onValidation: () => {
					operation = "contract-validation";
				}
			});
		});
	} catch (error) {
		if (isDefaultEngine || !operation || isContextEngineAbortRejection(error, abortSignal)) throw error;
		recordContextEngineQuarantine({
			engineId,
			owner: entry.owner,
			operation,
			error,
			defaultEngineId
		});
		return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
	}
}
/** Default-engine failures propagate; they cannot select another fallback. */
async function resolveDefaultContextEngine(defaultEngineId, factoryCtx) {
	const defaultEntry = getContextEngines().get(defaultEngineId);
	if (!defaultEntry) throw new Error(`[context-engine] fallback failed: default engine "${defaultEngineId}" is not registered. Available engines: ${listContextEngineIds().join(", ") || "(none)"}`);
	return await createContextEngineWithResources(requireActivePluginRegistry(), defaultEntry, (source) => createOwnedContextEngine(defaultEngineId, defaultEntry, factoryCtx, {
		source,
		ownsSource: true,
		contractErrorPrefix: "[context-engine] "
	}));
}
//#endregion
export { createRuntimeHealthRecordEnvelope as _, registerContextEngineForOwner as a, resolveContextEngineOwnerPluginId as c, PluginRegistryInspectionResources as d, getPluginRegistryInspectionResources as f, adoptRuntimeContextEngineRegistrations as g, CONTEXT_ENGINE_HOST_PARAMS as h, listContextEngineQuarantines as i, resolveLogicalTurnContextEngines as l, collectRegistryInvocationInstances as m, getContextEngineRegistration as n, registerContextEngineInRegistry as o, PluginInvocationScope as p, hasSameContextEngineInstance as r, resolveContextEngine as s, activateContextEngineRegistrations as t, disposeContextEngineSources as u, createRuntimeHealthStore as v, isContextEngineAbortRejection as y };
