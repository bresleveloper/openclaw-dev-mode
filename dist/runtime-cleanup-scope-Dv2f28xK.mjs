import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as isAsyncWorkScopeActiveHere, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { t as LegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-DBY7FuQ8.mjs";
import { o as registerSignalExitGate, r as installCliSignalExitHandlers } from "./signal-exit-barrier-DtR3X_NN.mjs";
import "./plugin-source-capture-context-BeR5LVZ8.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/cli/plugin-invocation-resources.ts
/** The executable owns installed command callbacks until their actual work and cleanup settle. */
var CliPluginInvocationResources = class {
	constructor() {
		this.work = new AsyncWorkScope();
		this.resources = /* @__PURE__ */ new Set();
		this.registrations = /* @__PURE__ */ new Set();
		this.registrationErrors = [];
		this.phase = "open";
		this.runCleanup = (run) => this.work.track(run);
	}
	run(run) {
		if (this.phase !== "open") return Promise.reject(/* @__PURE__ */ new Error("Plugin CLI invocation is closed"));
		return this.work.track(run);
	}
	adopt(resource) {
		if (this.phase !== "open") throw new Error("Plugin CLI invocation is closed");
		this.resources.add(resource);
	}
	acquire(load) {
		if (this.phase !== "open" && !(this.phase === "cleanup" && isAsyncWorkScopeActiveHere(this.work))) return Promise.reject(/* @__PURE__ */ new Error("Plugin CLI invocation is closed"));
		return this.work.track(async () => {
			const acquisition = await load();
			this.resources.add(acquisition);
			return acquisition.registry;
		});
	}
	register(run) {
		const pending = this.run(run);
		this.registrations.add(pending);
		pending.then(() => this.registrations.delete(pending), (error) => {
			this.registrationErrors.push(error);
			this.registrations.delete(pending);
		});
	}
	async waitForRegistrations() {
		while (this.registrations.size > 0) await Promise.allSettled(this.registrations);
		if (this.registrationErrors.length > 0) throw new AggregateError(this.registrationErrors, "CLI command registration failed");
	}
	/** Stop admission and cancel cooperating work; final release still owns cleanup ordering. */
	beginClose(reason) {
		if (this.phase === "open") this.phase = "cleanup";
		this.work.beginClose(reason);
	}
	/** Settle admitted work before callers close the resources that work depends on. */
	async settleWork() {
		this.beginClose();
		await this.work.runWhenIdle(() => {});
	}
	release() {
		if (!this.released) {
			if (this.phase === "open") this.phase = "cleanup";
			this.released = Promise.resolve().then(() => this.releaseResources());
		}
		return this.released;
	}
	async releaseResources() {
		this.beginClose();
		const results = await this.work.runWhenIdle(() => {
			this.phase = "disposing";
			return Promise.allSettled([...this.resources].map((acquisition) => this.work.track(() => acquisition.release())));
		});
		await this.work.drain();
		this.phase = "closed";
		this.resources.clear();
		const failures = results.filter((result) => result.status === "rejected");
		if (failures.length > 0) throw new AggregateError(failures.map((failure) => failure.reason), "Plugin CLI registration resources could not all be disposed");
	}
};
//#endregion
//#region src/cli/runtime-cleanup-scope.ts
const scope = resolveGlobalSingleton(Symbol.for("openclaw.cliRuntimeCleanup"), () => new AsyncLocalStorage());
function withCliProcessScope(run) {
	return scope.run("process", run);
}
function hasCliProcessScope() {
	return scope.getStore() !== void 0;
}
/** Caller-owned programs and Gateway boot have no executable resource owner. */
function getCliPluginInvocationResources() {
	const current = scope.getStore();
	return current && current !== "process" ? current.pluginResources : void 0;
}
/** Finalizers own their Windows descendants until executable process exit. */
async function retainCliProcessJobUntilExit() {
	if (process.platform !== "win32" || !hasCliProcessScope()) return;
	const { retainWindowsProcessJobUntilExit } = await import("./service-child-windows-job-native-BnfvgP0E.mjs");
	retainWindowsProcessJobUntilExit();
}
async function withCliCommandCleanup(gatewayRun, run) {
	if (gatewayRun) return scope.run(void 0, () => run());
	if (scope.getStore() !== "process") return run();
	const { GatewayScheduler } = await import("./infra/gateway-scheduler.js");
	const { runCliDisposerAfterPending } = await import("./runtime-cleanup-DuanI9Zf.mjs");
	const { closeOpenClawStateDatabaseAsync } = await import("./openclaw-state-db-cache-CDpUFjDp.mjs");
	const { closeDefaultRetainedNativeWorkerSource } = await import("./worker-native-lifecycle-CdF-oH9b.mjs");
	const { closeSkillsWatchers } = await import("./refresh-C3a1Ipyv.mjs");
	const pluginResources = new CliPluginInvocationResources();
	const releaseSignals = installCliSignalExitHandlers();
	pluginResources.adopt({ release: async () => releaseSignals() });
	const sdkResourceHost = new LegacyPluginSdkResourceHost();
	const scheduler = new GatewayScheduler();
	sdkResourceHost.bindScheduler(scheduler);
	pluginResources.adopt({ release: () => sdkResourceHost.close() });
	pluginResources.adopt({ release: () => scheduler.stop() });
	const cleanup = {
		scheduler,
		harnesses: /* @__PURE__ */ new Map(),
		registries: /* @__PURE__ */ new Set(),
		closeSkillsWatchers,
		pluginResources
	};
	const finished = createDeferredCore();
	const releaseExitGate = registerSignalExitGate(finished.promise, (signal) => {
		pluginResources.beginClose(new DOMException(`CLI stopping${signal ? ` (${signal})` : ""}`, "AbortError"));
		scheduler.stop();
	});
	try {
		return await sdkResourceHost.run(() => scope.run(cleanup, async () => {
			try {
				return await run(cleanup);
			} finally {
				await runCliDisposerAfterPending("shared-state", async () => {
					await closeOpenClawStateDatabaseAsync();
					await closeDefaultRetainedNativeWorkerSource();
				});
			}
		}));
	} finally {
		releaseExitGate();
		finished.resolve();
	}
}
function retainCliRegistryHarnesses(registry, dispose, retain) {
	const current = scope.getStore();
	if (!current || current === "process") return;
	for (const { harness } of registry.agentHarnesses) {
		if (!current.registries.has(registry)) {
			const release = retain();
			if (release) current.pluginResources?.adopt({ release: async () => {
				await release();
			} });
		}
		current.registries.add(registry);
		if (!current.harnesses.has(harness)) current.harnesses.set(harness, AsyncLocalStorage.bind(() => current.pluginResources ? current.pluginResources.runCleanup(() => dispose(harness)) : dispose(harness)));
	}
}
//#endregion
export { withCliCommandCleanup as a, retainCliRegistryHarnesses as i, hasCliProcessScope as n, withCliProcessScope as o, retainCliProcessJobUntilExit as r, getCliPluginInvocationResources as t };
