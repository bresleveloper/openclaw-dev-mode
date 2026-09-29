import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { l as getActivePluginRegistry, m as getPluginRegistrationContext, y as requireActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
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
/**
* Register a hook handler for a specific event type or event:action combination
*
* @param eventKey - Event type (e.g., 'command') or specific action (e.g., 'command:new')
* @param handler - Function to call when the event is triggered
*
* @example
* ```ts
* // Listen to all command events
* registerInternalHook('command', async (event) => {
*   console.log('Command:', event.action);
* });
*
* // Listen only to /new commands
* registerInternalHook('command:new', async (event) => {
*   await saveSessionToMemory(event);
* });
* ```
*/
function registerInternalHook(eventKey, handler) {
	if (!handlers.has(eventKey)) handlers.set(eventKey, []);
	handlers.get(eventKey).push(handler);
}
/**
* Unregister a specific hook handler
*
* @param eventKey - Event key the handler was registered for
* @param handler - The handler function to remove
*/
function unregisterInternalHook(eventKey, handler) {
	const eventHandlers = handlers.get(eventKey);
	if (!eventHandlers) return;
	const index = eventHandlers.indexOf(handler);
	if (index !== -1) eventHandlers.splice(index, 1);
	if (eventHandlers.length === 0) handlers.delete(eventKey);
}
/**
* Clear all registered hooks (useful for testing)
*/
function clearInternalHooks() {
	handlers.clear();
	clearLegacyPluginInternalHooks();
}
function setInternalHooksEnabled(enabled) {
	internalHooksEnabledState.enabled = enabled;
}
/**
* Get all registered event keys (useful for debugging)
*/
function getRegisteredEventKeys() {
	return [.../* @__PURE__ */ new Set([...handlers.keys(), ...listLegacyPluginInternalHookEventKeys()])];
}
function hasInternalHookListeners(type, action) {
	return (handlers.get(type)?.length ?? 0) + listLegacyPluginInternalHooks(type).length > 0 || (handlers.get(`${type}:${action}`)?.length ?? 0) + listLegacyPluginInternalHooks(`${type}:${action}`).length > 0;
}
/**
* Trigger a hook event
*
* Calls all handlers registered for:
* 1. The general event type (e.g., 'command')
* 2. The specific event:action combination (e.g., 'command:new')
*
* Handlers are called in registration order. Errors are caught and logged
* but don't prevent other handlers from running.
*
* @param event - The event to trigger
*/
async function triggerInternalHook(event) {
	if (!internalHooksEnabledState.enabled) return;
	if (!hasInternalHookListeners(event.type, event.action)) return;
	const typeHandlers = [...handlers.get(event.type) ?? [], ...listLegacyPluginInternalHooks(event.type)];
	const specificKey = `${event.type}:${event.action}`;
	const specificHandlers = [...handlers.get(specificKey) ?? [], ...listLegacyPluginInternalHooks(specificKey)];
	const allHandlers = [...typeHandlers, ...specificHandlers];
	for (const handler of allHandlers) try {
		await handler(event);
	} catch (err) {
		const message = formatErrorMessage(err);
		log.error(`Hook error [${event.type}:${event.action}]: ${message}`);
	}
}
/**
* Create a hook event with common fields filled in
*
* @param type - The event type
* @param action - The action within that type
* @param sessionKey - The session key
* @param context - Additional context
*/
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
function isHookEventTypeAndAction(event, type, action) {
	return event.type === type && event.action === action;
}
function getHookContext(event) {
	const context = event.context;
	if (!context || typeof context !== "object") return null;
	return context;
}
function hasStringContextField(context, key) {
	return typeof context[key] === "string";
}
function isAgentBootstrapEvent(event) {
	if (!isHookEventTypeAndAction(event, "agent", "bootstrap")) return false;
	const context = getHookContext(event);
	if (!context) return false;
	if (!hasStringContextField(context, "workspaceDir")) return false;
	return Array.isArray(context.bootstrapFiles);
}
function isGatewayStartupEvent(event) {
	if (!isHookEventTypeAndAction(event, "gateway", "startup")) return false;
	return Boolean(getHookContext(event));
}
function isSessionPatchEvent(event) {
	if (!isHookEventTypeAndAction(event, "session", "patch")) return false;
	const context = getHookContext(event);
	if (!context) return false;
	return typeof context.patch === "object" && context.patch !== null && typeof context.cfg === "object" && context.cfg !== null && typeof context.sessionEntry === "object" && context.sessionEntry !== null;
}
//#endregion
export { isAgentBootstrapEvent as a, registerInternalHook as c, unregisterInternalHook as d, hasInternalHookListeners as i, setInternalHooksEnabled as l, createInternalHookEvent as n, isGatewayStartupEvent as o, getRegisteredEventKeys as r, isSessionPatchEvent as s, clearInternalHooks as t, triggerInternalHook as u };
