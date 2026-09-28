import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { _ as toAgentStoreSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
//#region src/infra/heartbeat-events.ts
const TARGET_NONE_MESSAGE = "Heartbeat delivery is disabled by configuration (target: none).";
const NO_ROUTE_MESSAGE = "Heartbeat has no delivery route yet. Message your bot once, or set agents.defaults.heartbeat.target.";
function resolveIndicatorType(status) {
	switch (status) {
		case "ok-empty":
		case "ok-token": return "ok";
		case "sent": return "alert";
		case "failed": return "error";
		case "skipped": return;
	}
	throw new Error("Unsupported heartbeat status");
}
const state = resolveGlobalSingleton(Symbol.for("openclaw.heartbeatEvents.state"), () => ({
	lastHeartbeat: null,
	listeners: /* @__PURE__ */ new Set()
}));
function emitHeartbeatEvent(evt) {
	const enriched = {
		ts: Date.now(),
		...evt,
		...evt.message === void 0 && evt.reason === "target-none" ? { message: TARGET_NONE_MESSAGE } : evt.message === void 0 && evt.reason === "no-route" ? { message: NO_ROUTE_MESSAGE } : {}
	};
	state.lastHeartbeat = enriched;
	notifyListeners(state.listeners, enriched);
}
function onHeartbeatEvent(listener) {
	return registerListener(state.listeners, listener);
}
function getLastHeartbeatEvent() {
	return state.lastHeartbeat;
}
function resetHeartbeatEventsForTest() {
	state.lastHeartbeat = null;
	state.listeners.clear();
}
//#endregion
//#region src/infra/system-event-ownership.ts
const stores = resolveGlobalSingleton(Symbol.for("openclaw.systemEventStores"), () => ({ owners: /* @__PURE__ */ new Map() }), () => {
	stores.resolve = void 0;
}, "close-only");
function getSystemEventStorePath(sessionKey, agentId) {
	try {
		return stores.resolve?.(sessionKey, agentId);
	} catch {
		return;
	}
}
function isSystemEventStoreCurrent(sessionKey, storePath, agentId) {
	return !sessionKey || storePath !== null && (!stores.resolve || storePath !== void 0 && storePath === getSystemEventStorePath(sessionKey, agentId));
}
/** The accepted Gateway store selection owns retirement; same-store handoff retains its facts. */
function publishSystemEventStoreResolver(resolve) {
	stores.resolve = resolve;
	for (const retire of stores.owners.values()) retire();
}
function registerSystemEventStoreOwner(key, retire) {
	stores.owners.set(key, retire);
}
function recordSystemEventStoreReplaced() {
	emitHeartbeatEvent({
		status: "skipped",
		reason: "store-replaced",
		message: "Dropped: session store replaced."
	});
}
/** Queue identity is scoped without rewriting the caller's persisted session key. */
function resolveSystemEventQueueKey(sessionKey, agentId) {
	if (!sessionKey.trim()) throw new Error("system events require a sessionKey");
	const owner = resolveAgentIdFromSessionKey(sessionKey, agentId);
	if (agentId && owner !== normalizeAgentId(agentId)) throw new Error("System event owner does not match its session key.");
	return toAgentStoreSessionKey({
		agentId: owner,
		requestKey: sessionKey
	});
}
function withSystemEventOwner(options, agentId) {
	return {
		...options,
		sessionKey: resolveSystemEventQueueKey(options.sessionKey, agentId)
	};
}
//#endregion
export { registerSystemEventStoreOwner as a, emitHeartbeatEvent as c, resetHeartbeatEventsForTest as d, resolveIndicatorType as f, recordSystemEventStoreReplaced as i, getLastHeartbeatEvent as l, isSystemEventStoreCurrent as n, resolveSystemEventQueueKey as o, publishSystemEventStoreResolver as r, withSystemEventOwner as s, getSystemEventStorePath as t, onHeartbeatEvent as u };
