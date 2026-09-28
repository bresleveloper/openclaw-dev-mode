import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-CGmhv_zp.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/plugin-instance-scope.ts
const pluginInstanceState = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceState"), () => ({
	records: /* @__PURE__ */ new WeakMap(),
	values: /* @__PURE__ */ new WeakMap()
}));
const pluginInvocationContext = resolveGlobalSingleton(Symbol.for("openclaw.pluginInvocationContext"), () => new AsyncLocalStorage());
function resolvePluginInstanceOwner(record, registry) {
	let owner = pluginInstanceState.records.get(record);
	if (!owner) {
		owner = {
			record,
			registry,
			revoked: false
		};
		pluginInstanceState.records.set(record, owner);
	}
	return owner;
}
/** Record and resource keys resolve the same owner through adoption and failed registration. */
function getPluginInstanceOwner(instance) {
	return pluginInstanceState.records.get(instance);
}
/** Direct SDK registrars retain the same owner as registrations made through api. */
function wrapCurrentPluginInstance(value, host) {
	const owner = pluginInstanceInvocation.getStore()?.instance;
	return owner ? owner.wrap(value) : host ? host(value) : value;
}
/** Teardown admission comes from the host owner, never a plugin method name. */
function runPluginCleanup(value, run) {
	const instance = pluginInstanceState.values.get(value);
	return instance ? instance.runCleanup(run) : run();
}
/** Named SDK slots share only within the exact managed plugin instance. */
function getPluginInstanceRuntimeSlot(key) {
	const owner = pluginInstanceInvocation.getStore()?.instance;
	if (!owner) return;
	let slot = owner.slots.get(key);
	if (!slot) owner.slots.set(key, slot = { runtime: null });
	return slot;
}
function getPluginInstance(record) {
	return pluginInstanceState.records.get(record)?.instance;
}
/** Exact owner of a callable public view; never inferred from a plugin id or path. */
function getPluginValueInstance(value) {
	return pluginInstanceState.values.get(value);
}
/** Host consumers retain the exact stream owner until their terminal work settles. */
function runPluginStreamConsumer(stream, consume) {
	const instance = getPluginValueInstance(stream);
	return instance ? instance.runConsumer(consume) : consume();
}
//#endregion
export { pluginInstanceState as a, runPluginCleanup as c, getPluginValueInstance as i, runPluginStreamConsumer as l, getPluginInstanceOwner as n, pluginInvocationContext as o, getPluginInstanceRuntimeSlot as r, resolvePluginInstanceOwner as s, getPluginInstance as t, wrapCurrentPluginInstance as u };
