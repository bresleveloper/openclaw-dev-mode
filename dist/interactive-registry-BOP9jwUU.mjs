import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { m as wrapCurrentPluginInstance } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { _ as requireActivePluginChannelRegistry, b as resolveDirectPluginRegistrationOwner, p as getPluginRegistrationContext } from "./runtime-DkPagH0y.mjs";
import { n as resolveGlobalDedupeCache } from "./dedupe-5aqLNx3Q.mjs";
//#region src/plugins/interactive-state.ts
const PLUGIN_INTERACTIVE_STATE_KEY = Symbol.for("openclaw.pluginInteractiveState");
const PLUGIN_INTERACTIVE_CALLBACK_DEDUPE_KEY = Symbol.for("openclaw.pluginInteractiveCallbackDedupe");
function getState() {
	const globalStore = globalThis;
	const value = globalStore[PLUGIN_INTERACTIVE_STATE_KEY];
	const state = typeof value === "object" && value !== null ? value : void 0;
	const hydrated = {
		callbackDedupe: resolveGlobalDedupeCache(PLUGIN_INTERACTIVE_CALLBACK_DEDUPE_KEY, {
			ttlMs: 3e5,
			maxSize: 4096
		}),
		inflightCallbackDedupe: state?.inflightCallbackDedupe instanceof Set ? state.inflightCallbackDedupe : /* @__PURE__ */ new Set()
	};
	globalStore[PLUGIN_INTERACTIVE_STATE_KEY] = hydrated;
	return hydrated;
}
/** Claims an interactive callback dedupe key while the callback is in flight. */
function claimPluginInteractiveCallbackDedupe(dedupeKey, now = Date.now()) {
	if (!dedupeKey) return true;
	const state = getState();
	if (state.inflightCallbackDedupe.has(dedupeKey) || state.callbackDedupe.peek(dedupeKey, now)) return false;
	state.inflightCallbackDedupe.add(dedupeKey);
	return true;
}
/** Commits an interactive callback dedupe key after successful handling. */
function commitPluginInteractiveCallbackDedupe(dedupeKey, now = Date.now()) {
	if (!dedupeKey) return;
	const state = getState();
	state.inflightCallbackDedupe.delete(dedupeKey);
	state.callbackDedupe.check(dedupeKey, now);
}
/** Releases an in-flight interactive callback dedupe claim without committing it. */
function releasePluginInteractiveCallbackDedupe(dedupeKey) {
	if (!dedupeKey) return;
	getState().inflightCallbackDedupe.delete(dedupeKey);
}
/** Clears plugin interactive handlers and callback dedupe state. */
function clearPluginInteractiveHandlersState() {
	const state = getState();
	state.callbackDedupe.clear();
	state.inflightCallbackDedupe.clear();
}
//#endregion
//#region src/plugins/interactive-registry.ts
function toPluginInteractiveRegistryKey(channel, namespace) {
	return `${normalizeOptionalLowercaseString(channel) ?? ""}:${namespace.trim()}`;
}
/** Resolves a handler from registry-owned registrations without changing global state. */
function resolvePluginInteractiveRegistrationsMatch(registrations, channel, data) {
	const trimmedData = data.trim();
	if (!trimmedData) return null;
	const separatorIndex = trimmedData.indexOf(":");
	const namespace = separatorIndex >= 0 ? trimmedData.slice(0, separatorIndex) : trimmedData;
	const key = toPluginInteractiveRegistryKey(channel, namespace);
	const registration = registrations.find((entry) => toPluginInteractiveRegistryKey(entry.channel, entry.namespace) === key);
	return registration ? {
		registration,
		namespace,
		payload: separatorIndex >= 0 ? trimmedData.slice(separatorIndex + 1) : ""
	} : null;
}
/** Registers one handler whose lifetime follows its owning plugin registry. */
function registerPluginInteractiveHandlerInRegistry(registry, pluginId, registration, opts) {
	const registrations = registry.interactiveHandlers;
	const namespace = registration.namespace.trim();
	if (!namespace) return {
		ok: false,
		error: "Interactive handler namespace cannot be empty"
	};
	if (!/^[A-Za-z0-9._-]+$/.test(namespace)) return {
		ok: false,
		error: "Interactive handler namespace must contain only letters, numbers, dots, underscores, and hyphens"
	};
	const key = toPluginInteractiveRegistryKey(registration.channel, namespace);
	const existing = registrations.find((entry) => toPluginInteractiveRegistryKey(entry.channel, entry.namespace) === key);
	if (existing) return {
		ok: false,
		error: `Interactive handler namespace "${namespace}" already registered by plugin "${existing.pluginId}"`
	};
	registrations.push({
		...wrapCurrentPluginInstance(registration),
		namespace,
		channel: normalizeOptionalLowercaseString(registration.channel) ?? "",
		pluginId,
		pluginName: opts?.pluginName,
		pluginRoot: opts?.pluginRoot
	});
	return { ok: true };
}
/** Registers one process-global interactive handler. */
function registerPluginInteractiveHandler(pluginId, registration, opts) {
	return registerPluginInteractiveHandlerInRegistry(getPluginRegistrationContext()?.registry ?? requireActivePluginChannelRegistry(), resolveDirectPluginRegistrationOwner(pluginId) ?? pluginId, registration, opts);
}
/** Clears all active plugin interactive handlers. */
function clearPluginInteractiveHandlers() {
	requireActivePluginChannelRegistry().interactiveHandlers.length = 0;
	clearPluginInteractiveHandlersState();
}
//#endregion
export { claimPluginInteractiveCallbackDedupe as a, resolvePluginInteractiveRegistrationsMatch as i, registerPluginInteractiveHandler as n, commitPluginInteractiveCallbackDedupe as o, registerPluginInteractiveHandlerInRegistry as r, releasePluginInteractiveCallbackDedupe as s, clearPluginInteractiveHandlers as t };
