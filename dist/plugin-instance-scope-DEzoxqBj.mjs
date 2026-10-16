import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-CH4zOUb4.mjs";
import { r as createPluginValueInstances } from "./plugin-instance-owned-values-kZIH8zYk.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/plugin-instance-scope.ts
const pluginInstanceState = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceState"), () => ({
	records: /* @__PURE__ */ new WeakMap(),
	values: createPluginValueInstances()
}));
const pluginInvocationContext = resolveGlobalSingleton(Symbol.for("openclaw.pluginInvocationContext"), () => new AsyncLocalStorage());
/** Current work that a pending reload drain is joining, through nested calls or retained scopes. */
function currentPluginWorkHoldsPendingReplacement() {
	for (let call = pluginInstanceInvocation.getStore(); call; call = call.parent) if (call.instance.holdsPendingReplacement(call.token)) return true;
	return pluginInvocationContext.getStore()?.holdsPendingReplacement === true;
}
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
/**
* Checks the exact invocation authority currently carrying plugin runtime scope.
*
* A plugin ID is stable across replacement, so it cannot fence delayed work by
* itself. The invocation token and instance lifecycle together identify the
* still-admitted instance that may read prepared capability inputs.
*/
function hasCurrentPluginInstanceAuthority(pluginId) {
	const instance = pluginInstanceInvocation.getStore()?.instance;
	return instance?.pluginId === pluginId && instance.hasActiveCall && instance.acceptingCalls && !instance.owner?.revoked && !instance.lifecycle.signal.aborted;
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
/** Only a view's creating instance may restore the original passed back to it. */
function getPluginOriginalValue(value, instance) {
	return pluginInstanceState.values.getOriginal(value, instance);
}
/** The caller must have created this object; foreign plugin objects remain unmodified. */
function setPluginOriginalValue(value, original, instance) {
	pluginInstanceState.values.setOriginal(value, original, instance);
}
/** Host consumers retain the exact stream owner until their terminal work settles. */
function runPluginStreamConsumer(stream, consume) {
	const instance = getPluginValueInstance(stream);
	return instance ? instance.runConsumer(consume) : consume();
}
//#endregion
export { getPluginOriginalValue as a, pluginInstanceState as c, runPluginCleanup as d, runPluginStreamConsumer as f, getPluginInstanceRuntimeSlot as i, pluginInvocationContext as l, wrapCurrentPluginInstance as m, getPluginInstance as n, getPluginValueInstance as o, setPluginOriginalValue as p, getPluginInstanceOwner as r, hasCurrentPluginInstanceAuthority as s, currentPluginWorkHoldsPendingReplacement as t, resolvePluginInstanceOwner as u };
