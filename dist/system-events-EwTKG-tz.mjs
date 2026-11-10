import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import "./io-DIF-KW3P.mjs";
import { c as resolveSystemEventQueueKey } from "./system-event-ownership-DAgHWXZ1.mjs";
import { _ as peekSystemEvents, a as drainSystemEvents, c as enqueueSystemEventEntry, f as isSystemEventContextChanged, g as peekSystemEventEntries, i as drainSystemEventEntries, r as consumeSelectedSystemEventEntries, s as enqueueSystemEvent, u as hasSystemEvents } from "./system-events-Bf4ozS7L.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-CHYPkxYr.mjs";
//#region src/plugins/runtime/system-events.ts
/** Published SDK aliases resolve here; the process queues retain only qualified identities. */
function resolveSystemEventSessionKey(sessionKey, agentId) {
	const explicitOwner = agentId === void 0 ? void 0 : normalizeAgentIdStrict(agentId);
	if (explicitOwner && !explicitOwner.ok) throw new Error("Invalid system event agentId.");
	const normalizedAgentId = explicitOwner?.value;
	if (parseAgentSessionKey(sessionKey)) return resolveSystemEventQueueKey(sessionKey, normalizedAgentId);
	const cfg = readRuntimeConfig();
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
const consumeSelectedSystemEventEntriesFromSdk = (key, entries, options) => consumeSelectedSystemEventEntries(resolveSystemEventSessionKey(key), entries, options);
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
