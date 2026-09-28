import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { t as installCliSignalExitHandlers } from "./signal-exit-barrier-BG0KH3HC.mjs";
import "./plugin-source-capture-context-B73e-LdE.mjs";
import { t as LegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-Bm9V3G-F.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/cli/plugin-invocation-resources.ts
/** The executable owns installed command callbacks until their actual work and cleanup settle. */
var CliPluginInvocationResources = class {
	constructor() {
		this.work = new AsyncWorkScope();
		this.resources = /* @__PURE__ */ new Set();
		this.registrations = /* @__PURE__ */ new Set();
		this.registrationErrors = [];
		this.closing = false;
		this.runCleanup = (run) => this.work.track(run);
	}
	run(run) {
		if (this.closing) return Promise.reject(/* @__PURE__ */ new Error("Plugin CLI invocation is closed"));
		return this.work.track(run);
	}
	adopt(resource) {
		if (this.closing) throw new Error("Plugin CLI invocation is closed");
		this.resources.add(resource);
	}
	acquire(load) {
		return this.run(async () => {
			const acquisition = await load();
			this.resources.add(acquisition);
			if (this.closing) throw new Error("Plugin CLI invocation closed during registry acquisition");
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
	release() {
		if (!this.released) {
			this.closing = true;
			this.released = Promise.resolve().then(() => this.releaseResources());
		}
		return this.released;
	}
	async releaseResources() {
		this.work.beginClose();
		const results = await this.work.runWhenIdle(() => Promise.allSettled([...this.resources].map((acquisition) => this.work.track(() => acquisition.release()))));
		await this.work.drain();
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
	const [{ default: koffi }, { retainWindowsProcessJobUntilExit }] = await Promise.all([import("koffi"), import("./service-child-windows-job-native-Bu4DFlkW.mjs")]);
	retainWindowsProcessJobUntilExit(koffi);
}
function withCliCommandCleanup(gatewayRun, run) {
	if (gatewayRun) return scope.run(void 0, () => run());
	if (scope.getStore() !== "process") return run();
	const pluginResources = new CliPluginInvocationResources();
	const releaseSignals = installCliSignalExitHandlers();
	pluginResources.adopt({ release: async () => releaseSignals() });
	const sdkResourceHost = new LegacyPluginSdkResourceHost();
	pluginResources.adopt({ release: () => sdkResourceHost.close() });
	const cleanup = {
		harnesses: /* @__PURE__ */ new Map(),
		registries: /* @__PURE__ */ new Set(),
		pluginResources
	};
	return sdkResourceHost.run(() => scope.run(cleanup, () => run(cleanup)));
}
function retainCliRegistryHarnesses(registry, dispose) {
	const current = scope.getStore();
	if (!current || current === "process") return;
	for (const { harness } of registry.agentHarnesses) {
		current.registries.add(registry);
		if (!current.harnesses.has(harness)) current.harnesses.set(harness, AsyncLocalStorage.bind(() => current.pluginResources ? current.pluginResources.runCleanup(() => dispose(harness)) : dispose(harness)));
	}
}
//#endregion
export { withCliCommandCleanup as a, retainCliRegistryHarnesses as i, hasCliProcessScope as n, withCliProcessScope as o, retainCliProcessJobUntilExit as r, getCliPluginInvocationResources as t };
