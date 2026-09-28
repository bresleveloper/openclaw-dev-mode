import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { a as generateSecureUuid } from "./secure-random-BJtJxP9Y.mjs";
import { n as channelRouteDedupeKey } from "./channel-route-Czo5mOSj.mjs";
import { a as mergeDeliveryContext, s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { a as registerSystemEventStoreOwner, i as recordSystemEventStoreReplaced, n as isSystemEventStoreCurrent, t as getSystemEventStorePath } from "./system-event-ownership-CHVGbaAW.mjs";
//#region src/infra/system-events.ts
const MAX_EVENTS = 20;
const SYSTEM_EVENT_QUEUES_KEY = Symbol.for("openclaw.systemEvents.queues");
const queues = resolveGlobalMap(SYSTEM_EVENT_QUEUES_KEY, "close-only");
registerSystemEventStoreOwner(SYSTEM_EVENT_QUEUES_KEY, () => {
	for (const [key, entry] of queues) {
		const retained = entry.queue.filter((event) => isSystemEventStoreCurrent(key, event.sessionStorePath));
		if (retained.length === entry.queue.length) continue;
		entry.queue = retained;
		resetQueueState(key, entry);
		recordSystemEventStoreReplaced();
	}
});
function requireSessionKey(key) {
	const trimmed = normalizeOptionalString(key) ?? "";
	const parsed = parseAgentSessionKey(trimmed);
	if (!parsed) throw new Error("system events require an agent-qualified sessionKey");
	return `agent:${parsed.agentId}:${parsed.rest}`;
}
function normalizeContextKey(key) {
	return normalizeOptionalLowercaseString(key) ?? null;
}
function getSessionQueue(sessionKey) {
	return queues.get(requireSessionKey(sessionKey));
}
function getOrCreateSessionQueue(key) {
	const existing = queues.get(key);
	if (existing) return existing;
	const created = {
		queue: [],
		lastContextKey: null
	};
	queues.set(key, created);
	return created;
}
function cloneSystemEvent(event) {
	return {
		...event,
		...event.deliveryContext ? { deliveryContext: { ...event.deliveryContext } } : {}
	};
}
function isSystemEventContextChanged(sessionKey, contextKey) {
	const existing = getSessionQueue(sessionKey);
	return normalizeContextKey(contextKey) !== (existing?.lastContextKey ?? null);
}
function enqueueSystemEventEntry(text, options) {
	const event = enqueueOwnedSystemEventEntry(text, options);
	return event ? cloneSystemEvent(event) : null;
}
function enqueueOwnedSystemEventEntry(text, options, receiptOptions) {
	const key = requireSessionKey(options.sessionKey);
	const sessionStorePath = options.sessionStorePath === void 0 ? getSystemEventStorePath(key) : options.sessionStorePath;
	if (!isSystemEventStoreCurrent(key, sessionStorePath)) {
		recordSystemEventStoreReplaced();
		return null;
	}
	const entry = getOrCreateSessionQueue(key);
	const cleaned = text.trim();
	if (!cleaned) return null;
	const normalizedContextKey = normalizeContextKey(options.contextKey);
	const normalizedDeliveryContext = normalizeDeliveryContext(options.deliveryContext);
	const matches = (event) => (event.contextKey ?? null) === normalizedContextKey && areDeliveryContextsEqual(event.deliveryContext, normalizedDeliveryContext);
	if (options.replace) {
		if (normalizedContextKey === null) throw new Error("replaced system events require a contextKey");
		const matching = entry.queue.filter(matches);
		if (matching.length === 1 && matching[0]?.text === cleaned) return null;
		entry.queue = entry.queue.filter((event) => !matches(event));
	} else if (receiptOptions?.allowDuplicate !== true) {
		const duplicate = (event) => event !== void 0 && event.text === cleaned && matches(event);
		if (normalizedContextKey === null ? duplicate(entry.queue.at(-1)) : entry.queue.some(duplicate)) return null;
	}
	if (normalizedContextKey !== null) entry.lastContextKey = normalizedContextKey;
	const event = {
		id: generateSecureUuid(),
		text: cleaned,
		ts: Date.now(),
		...sessionStorePath === void 0 ? {} : { sessionStorePath },
		contextKey: normalizedContextKey,
		deliveryContext: normalizedDeliveryContext
	};
	entry.queue.push(event);
	if (entry.queue.length > MAX_EVENTS) entry.queue.shift();
	return event;
}
function enqueueSystemEvent(text, options) {
	return enqueueOwnedSystemEventEntry(text, options) !== null;
}
/** Enqueues one occurrence and returns one-use removal ownership for its UUID. */
function enqueueSystemEventWithReceipt(text, options, receiptOptions) {
	const event = enqueueOwnedSystemEventEntry(text, options, receiptOptions);
	if (!event) return null;
	const sessionKey = requireSessionKey(options.sessionKey);
	return () => consumeSelectedSystemEventEntries(sessionKey, [event]).length > 0;
}
function drainSystemEventEntries(sessionKey) {
	return drainSystemEventsWith(sessionKey, cloneSystemEvent);
}
function drainSystemEventsWith(sessionKey, project) {
	const key = requireSessionKey(sessionKey);
	const entry = queues.get(key);
	if (!entry || entry.queue.length === 0) return [];
	const out = entry.queue.map(project);
	entry.queue.length = 0;
	entry.lastContextKey = null;
	queues.delete(key);
	return out;
}
function areDeliveryContextsEqual(left, right) {
	if (!left && !right) return true;
	if (!left || !right) return false;
	return channelRouteDedupeKey(left) === channelRouteDedupeKey(right);
}
function areLegacySystemEventsEqual(left, right) {
	return left.text === right.text && left.ts === right.ts && (left.contextKey ?? null) === (right.contextKey ?? null) && areDeliveryContextsEqual(left.deliveryContext, right.deliveryContext);
}
function matchesConsumedSystemEvent(queued, consumed) {
	if (consumed.id !== void 0) return queued.id === consumed.id;
	return areLegacySystemEventsEqual(queued, consumed);
}
function resetQueueState(key, entry) {
	if (entry.queue.length === 0) {
		entry.lastContextKey = null;
		queues.delete(key);
		return;
	}
	for (let index = entry.queue.length - 1; index >= 0; index -= 1) {
		const contextKey = expectDefined(entry.queue[index], "queue entry at index").contextKey ?? null;
		if (contextKey !== null) {
			entry.lastContextKey = contextKey;
			return;
		}
	}
	entry.lastContextKey = null;
}
function consumeSelectedSystemEventEntries(sessionKey, consumedEntries) {
	const key = requireSessionKey(sessionKey);
	const entry = queues.get(key);
	if (!entry || entry.queue.length === 0 || consumedEntries.length === 0) return [];
	const removed = [];
	for (const consumed of consumedEntries) {
		const index = entry.queue.findIndex((event) => matchesConsumedSystemEvent(event, consumed));
		if (index === -1) continue;
		const [event] = entry.queue.splice(index, 1);
		if (event) removed.push(cloneSystemEvent(event));
	}
	resetQueueState(key, entry);
	return removed;
}
function drainSystemEvents(sessionKey) {
	return drainSystemEventsWith(sessionKey, (event) => event.text);
}
function peekSystemEventEntries(sessionKey) {
	return getSessionQueue(sessionKey)?.queue.map(cloneSystemEvent) ?? [];
}
function peekSystemEvents(sessionKey) {
	return getSessionQueue(sessionKey)?.queue.map((event) => event.text) ?? [];
}
function hasSystemEvents(sessionKey) {
	return (getSessionQueue(sessionKey)?.queue.length ?? 0) > 0;
}
function resolveSystemEventDeliveryContext(events) {
	let resolved;
	for (const event of events) resolved = mergeDeliveryContext(event.deliveryContext, resolved);
	return resolved;
}
function resetSystemEventsForTest() {
	queues.clear();
}
//#endregion
export { enqueueSystemEventEntry as a, isSystemEventContextChanged as c, resetSystemEventsForTest as d, resolveSystemEventDeliveryContext as f, enqueueSystemEvent as i, peekSystemEventEntries as l, drainSystemEventEntries as n, enqueueSystemEventWithReceipt as o, drainSystemEvents as r, hasSystemEvents as s, consumeSelectedSystemEventEntries as t, peekSystemEvents as u };
