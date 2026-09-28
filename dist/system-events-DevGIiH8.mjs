import { r as normalizeAgentIdStrict } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
import { o as resolveSystemEventQueueKey } from "./system-event-ownership-CHVGbaAW.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-De-bcoks.mjs";
import { a as enqueueSystemEventEntry, c as isSystemEventContextChanged, i as enqueueSystemEvent, l as peekSystemEventEntries, n as drainSystemEventEntries, r as drainSystemEvents, s as hasSystemEvents, t as consumeSelectedSystemEventEntries, u as peekSystemEvents } from "./system-events-ANKIkU0W.mjs";
//#region src/plugins/runtime/system-events.ts
/** Published SDK aliases resolve here; the process queues retain only qualified identities. */
function resolveSystemEventSessionKey(sessionKey, agentId) {
	const explicitOwner = agentId === void 0 ? void 0 : normalizeAgentIdStrict(agentId);
	if (explicitOwner && !explicitOwner.ok) throw new Error("Invalid system event agentId.");
	const normalizedAgentId = explicitOwner?.value;
	if (parseAgentSessionKey(sessionKey)) return resolveSystemEventQueueKey(sessionKey, normalizedAgentId);
	const cfg = getRuntimeConfig();
	const owner = resolveSessionAgentId({
		config: cfg,
		sessionKey,
		agentId: normalizedAgentId
	});
	return resolveSystemEventQueueKey(canonicalizeMainSessionAlias({
		cfg,
		agentId: owner,
		sessionKey
	}), owner);
}
const enqueueSystemEventFromSdk = (text, { agentId, ...options }) => enqueueSystemEvent(text, {
	...options,
	sessionKey: resolveSystemEventSessionKey(options.sessionKey, agentId)
});
const enqueueSystemEventEntryFromSdk = (text, options) => enqueueSystemEventEntry(text, {
	...options,
	sessionKey: resolveSystemEventSessionKey(options.sessionKey)
});
function enqueueRoutedSystemEvent(text, route, options = {}) {
	if (!route.agentId.trim()) throw new Error("routed system events require route.agentId");
	return enqueueSystemEventFromSdk(text, {
		...options,
		sessionKey: route.sessionKey,
		agentId: route.agentId
	});
}
const consumeSelectedSystemEventEntriesFromSdk = (key, entries) => consumeSelectedSystemEventEntries(resolveSystemEventSessionKey(key), entries);
const drainSystemEventEntriesFromSdk = (key) => drainSystemEventEntries(resolveSystemEventSessionKey(key));
const drainSystemEventsFromSdk = (key) => drainSystemEvents(resolveSystemEventSessionKey(key));
const hasSystemEventsFromSdk = (key) => hasSystemEvents(resolveSystemEventSessionKey(key));
const isSystemEventContextChangedFromSdk = (key, context) => isSystemEventContextChanged(resolveSystemEventSessionKey(key), context);
function peekSystemEventEntriesFromSdk(key, agentId) {
	return peekSystemEventEntries(resolveSystemEventSessionKey(key, agentId));
}
const peekSystemEventsFromSdk = (key) => peekSystemEvents(resolveSystemEventSessionKey(key));
//#endregion
export { enqueueSystemEventEntryFromSdk as a, isSystemEventContextChangedFromSdk as c, enqueueRoutedSystemEvent as i, peekSystemEventEntriesFromSdk as l, drainSystemEventEntriesFromSdk as n, enqueueSystemEventFromSdk as o, drainSystemEventsFromSdk as r, hasSystemEventsFromSdk as s, consumeSelectedSystemEventEntriesFromSdk as t, peekSystemEventsFromSdk as u };
