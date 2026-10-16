import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/service-scheduler-binding.ts
const current = resolveGlobalSingleton(Symbol.for("openclaw.pluginServiceSchedulerBinding"), () => new AsyncLocalStorage());
const getPluginServiceSchedulerBinding = () => current.getStore();
function withPluginServiceSchedulerBinding(binding, run) {
	return current.run(binding, run);
}
function withPluginServiceScheduler(scheduler, run) {
	return withPluginServiceSchedulerBinding(() => scheduler, run);
}
/** Published factories borrow their caller's admitted lifetime; no process owner is inferred. */
function resolvePluginServiceScheduler(scheduler) {
	const owner = scheduler ?? current.getStore()?.();
	if (!owner) throw new Error("Plugin service scheduler requires a bound service, account, or CLI owner");
	if (owner.signal.aborted) throw new Error("Plugin service scheduler is closed");
	return owner;
}
//#endregion
export { withPluginServiceSchedulerBinding as i, resolvePluginServiceScheduler as n, withPluginServiceScheduler as r, getPluginServiceSchedulerBinding as t };
