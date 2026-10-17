import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { l as getActivePluginRegistry, p as getPluginRegistrationContext, v as requireActivePluginRegistry } from "./runtime-DfYPSUKC.mjs";
//#region src/plugins/legacy-internal-hook-state.ts
function listActiveRegistrations() {
	return getActivePluginRegistry()?.legacyInternalHooks ?? [];
}
function listLegacyPluginInternalHooks(event) {
	return listActiveRegistrations().filter((registration) => registration.event === event).map((registration) => registration.handler);
}
function listLegacyPluginInternalHookEventKeys() {
	return [...new Set(listActiveRegistrations().map((registration) => registration.event))];
}
function clearLegacyPluginInternalHooks() {
	const context = getPluginRegistrationContext();
	(context?.registry ?? requireActivePluginRegistry()).legacyInternalHooks.length = 0;
}
//#endregion
//#region src/hooks/internal-hooks.ts
const handlers = resolveGlobalSingleton(Symbol.for("openclaw.internalHookHandlers"), () => /* @__PURE__ */ new Map());
const internalHooksEnabledState = resolveGlobalSingleton(Symbol.for("openclaw.internalHooksEnabled"), () => ({ enabled: true }));
const log = createSubsystemLogger("internal-hooks");
/** Register for a family (e.g. "command") or an exact action (e.g. "command:new"). */
function registerInternalHook(eventKey, handler) {
	if (!handlers.has(eventKey)) handlers.set(eventKey, []);
	handlers.get(eventKey).push(handler);
}
function unregisterInternalHook(eventKey, handler) {
	const eventHandlers = handlers.get(eventKey);
	if (!eventHandlers) return;
	const index = eventHandlers.indexOf(handler);
	if (index !== -1) eventHandlers.splice(index, 1);
	if (eventHandlers.length === 0) handlers.delete(eventKey);
}
function clearInternalHooks() {
	handlers.clear();
	clearLegacyPluginInternalHooks();
}
function setInternalHooksEnabled(enabled) {
	internalHooksEnabledState.enabled = enabled;
}
function getRegisteredEventKeys() {
	return [.../* @__PURE__ */ new Set([...handlers.keys(), ...listLegacyPluginInternalHookEventKeys()])];
}
function hasInternalHookListeners(type, action) {
	return (handlers.get(type)?.length ?? 0) + listLegacyPluginInternalHooks(type).length > 0 || (handlers.get(`${type}:${action}`)?.length ?? 0) + listLegacyPluginInternalHooks(`${type}:${action}`).length > 0;
}
/** Dispatch family handlers before exact-action handlers, in registration order; isolate errors. */
async function triggerInternalHook(event) {
	if (!internalHooksEnabledState.enabled) return;
	const specificKey = `${event.type}:${event.action}`;
	const allHandlers = [
		...handlers.get(event.type) ?? [],
		...listLegacyPluginInternalHooks(event.type),
		...handlers.get(specificKey) ?? [],
		...listLegacyPluginInternalHooks(specificKey)
	];
	for (const handler of allHandlers) try {
		await handler(event);
	} catch (err) {
		const message = formatErrorMessage(err);
		log.error(`Hook error [${event.type}:${event.action}]: ${message}`);
	}
}
function createInternalHookEvent(type, action, sessionKey, context = {}) {
	return {
		type,
		action,
		sessionKey,
		context,
		timestamp: /* @__PURE__ */ new Date(),
		messages: []
	};
}
function hasHookEventContext(event, type, action) {
	return event.type === type && event.action === action && event.context !== null && typeof event.context === "object";
}
function isAgentBootstrapEvent(event) {
	return hasHookEventContext(event, "agent", "bootstrap") && typeof event.context.workspaceDir === "string" && Array.isArray(event.context.bootstrapFiles);
}
function isGatewayStartupEvent(event) {
	return hasHookEventContext(event, "gateway", "startup");
}
function isSessionPatchEvent(event) {
	if (!hasHookEventContext(event, "session", "patch")) return false;
	const context = event.context;
	return typeof context.patch === "object" && context.patch !== null && typeof context.cfg === "object" && context.cfg !== null && typeof context.sessionEntry === "object" && context.sessionEntry !== null;
}
//#endregion
export { isAgentBootstrapEvent as a, registerInternalHook as c, unregisterInternalHook as d, hasInternalHookListeners as i, setInternalHooksEnabled as l, createInternalHookEvent as n, isGatewayStartupEvent as o, getRegisteredEventKeys as r, isSessionPatchEvent as s, clearInternalHooks as t, triggerInternalHook as u };
