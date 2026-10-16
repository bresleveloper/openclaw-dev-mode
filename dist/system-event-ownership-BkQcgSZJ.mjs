import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { _ as toAgentStoreSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
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
//#endregion
//#region src/infra/system-event-ownership.ts
const stores = resolveGlobalSingleton(Symbol.for("openclaw.systemEventStores"), () => ({ owners: /* @__PURE__ */ new Map() }), () => {
	stores.resolve = void 0;
	stores.prepare = void 0;
}, "close-only");
function getSystemEventStorePath(sessionKey, agentId) {
	try {
		return stores.resolve?.(sessionKey, agentId);
	} catch {
		return;
	}
}
/** Prepare the current owner's path without invoking its synchronous discovery fallback. */
function prepareSystemEventStorePath(sessionKey, agentId) {
	const resolve = stores.resolve;
	if (!resolve) return;
	return (stores.prepare ? stores.prepare(sessionKey, agentId) : Promise.resolve(resolve(sessionKey, agentId))).then((pathname) => {
		if (stores.resolve !== resolve) throw new Error("System-event store owner changed during path preparation");
		return pathname;
	});
}
function isSystemEventStoreCurrent(sessionKey, storePath, agentId) {
	return !sessionKey || storePath !== null && (!stores.resolve || storePath !== void 0 && storePath === getSystemEventStorePath(sessionKey, agentId));
}
/** A resumed operation must not discover a replacement owner's store on the host. */
function captureSystemEventStoreCurrentCheck(sessionKey, agentId) {
	const resolve = stores.resolve;
	return (storePath) => stores.resolve === resolve && isSystemEventStoreCurrent(sessionKey, storePath, agentId);
}
/** The accepted Gateway store selection owns retirement; same-store handoff retains its facts. */
function publishSystemEventStoreResolver(resolve, prepare) {
	stores.resolve = resolve;
	stores.prepare = prepare;
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
export { publishSystemEventStoreResolver as a, resolveSystemEventQueueKey as c, getLastHeartbeatEvent as d, onHeartbeatEvent as f, prepareSystemEventStorePath as i, withSystemEventOwner as l, getSystemEventStorePath as n, recordSystemEventStoreReplaced as o, resolveIndicatorType as p, isSystemEventStoreCurrent as r, registerSystemEventStoreOwner as s, captureSystemEventStoreCurrentCheck as t, emitHeartbeatEvent as u };
