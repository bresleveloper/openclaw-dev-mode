import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as trackAsyncWork, t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-CH4zOUb4.mjs";
import { i as hasRetainedPluginRuntimeCloseError, n as PluginRuntimeCloseRetainedError, t as PluginRuntimeCloseCompletedError } from "./runtime-close-error-DPmgR5gM.mjs";
import { l as pluginInvocationContext, n as getPluginInstance, o as getPluginValueInstance } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { S as markPluginRegistriesRetired } from "./registry-lifecycle-Dekhrk9Y.mjs";
//#region src/plugins/plugin-invocation-scope.ts
/** Host teardown may cross exact plugin owners after ordinary admission closes. */
async function runPluginCleanupScope(values, run) {
	const instances = new Set(values.map(getPluginValueInstance).filter((instance) => instance !== void 0));
	const parent = pluginInvocationContext.getStore();
	let closed = false;
	const assertOpen = () => {
		if (closed) throw new Error("Plugin cleanup scope is closed");
	};
	const bindings = new Map([...instances].map((instance) => [instance, {
		run: (operation) => {
			assertOpen();
			return instance.runCleanup(operation);
		},
		wrap: (value) => {
			assertOpen();
			return instance.wrap(value);
		}
	}]));
	try {
		return await pluginInvocationContext.run({ lookup: (instance) => {
			const binding = bindings.get(instance);
			if (binding) assertOpen();
			return binding ?? parent?.lookup(instance);
		} }, run);
	} finally {
		closed = true;
	}
}
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
	/** Open retained consumers are drained by a reload that reserved their instance. */
	get holdsPendingReplacement() {
		return !this.closed && [...this.consumers.keys()].some((instance) => instance.replacementPending);
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
	const records = [
		...registry.plugins.filter((record) => record.status === "loaded"),
		...registry.decisionProviders.map(({ host }) => host.record),
		...registry.channels.flatMap(({ borrowedRuntimeRecord }) => borrowedRuntimeRecord ?? [])
	];
	for (const record of records) {
		const instance = getPluginInstance(record);
		if (instance) instances.add(instance);
	}
	const values = [
		...registry.tools.map(({ factory }) => factory),
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
	if (failures.length > 0) throw new (failures.some(hasRetainedPluginRuntimeCloseError) ? AggregateError : PluginRuntimeCloseCompletedError)(failures, "Plugin inspection resources could not all be disposed");
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
export { runPluginCleanupScope as a, collectRegistryInvocationInstances as i, getPluginRegistryInspectionResources as n, PluginInvocationScope as r, PluginRegistryInspectionResources as t };
