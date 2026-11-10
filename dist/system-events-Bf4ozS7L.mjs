import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton, r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as generateSecureUuid } from "./secure-random-DxCgeORs.mjs";
import { n as getSystemEventStorePath, o as recordSystemEventStoreReplaced, r as isSystemEventStoreCurrent, s as registerSystemEventStoreOwner } from "./system-event-ownership-DAgHWXZ1.mjs";
import { c as execRequestMatches, d as withExecRequestOwners, l as readExecRequestOwners } from "./exec-request-context-CWnK9ayt.mjs";
import { n as channelRouteDedupeKey } from "./channel-route-2bD3dZs2.mjs";
import { c as normalizeDeliveryContext, o as mergeDeliveryContext } from "./delivery-context.shared-I8-iaaj1.mjs";
//#region src/infra/system-events.ts
const MAX_EVENTS = 20;
const log = createSubsystemLogger("system-events");
var SystemEventQueueFullError = class extends Error {
	constructor() {
		super(`System event queue is full (${MAX_EVENTS} pending). Let the session process pending events before retrying the notification.`);
		this.name = "SystemEventQueueFullError";
	}
};
const SYSTEM_EVENT_QUEUES_KEY = Symbol.for("openclaw.systemEvents.queues");
const turnOwners = resolveGlobalSingleton(Symbol.for("openclaw.systemEvents.turnOwners"), () => /* @__PURE__ */ new WeakMap(), (owners) => {
	for (const [key, entry] of queues) {
		const removed = entry.queue.filter((event) => owners.has(event));
		entry.queue = entry.queue.filter((event) => !owners.has(event));
		resetQueueState(key, entry);
		retireSystemEvents(removed);
	}
});
function retireSystemEvents(events) {
	for (const event of events) {
		const owner = turnOwners.get(event);
		if (owner && !owner.started) owner.cancel();
	}
}
function clearSystemEventQueues(value) {
	const removed = [...value.values()].flatMap((entry) => entry.queue.splice(0));
	value.clear();
	retireSystemEvents(removed);
}
const queues = resolveGlobalMap(SYSTEM_EVENT_QUEUES_KEY, clearSystemEventQueues, "close-only");
registerSystemEventStoreOwner(SYSTEM_EVENT_QUEUES_KEY, () => {
	for (const [key, entry] of queues) {
		const removed = entry.queue.filter((event) => !isSystemEventStoreCurrent(key, event.sessionStorePath));
		const retained = entry.queue.filter((event) => isSystemEventStoreCurrent(key, event.sessionStorePath));
		if (retained.length === entry.queue.length) continue;
		entry.queue = retained;
		resetQueueState(key, entry);
		retireSystemEvents(removed);
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
	const key = requireSessionKey(sessionKey);
	const entry = queues.get(key);
	if (entry) {
		const cancelled = entry.queue.filter((event) => readExecRequestOwners(event)?.some((owner) => owner.signal.aborted));
		if (cancelled.length > 0) {
			entry.queue = entry.queue.filter((event) => !cancelled.includes(event));
			resetQueueState(key, entry);
			retireSystemEvents(cancelled);
		}
	}
	return queues.get(key);
}
function getOrCreateSessionQueue(key) {
	const existing = getSessionQueue(key);
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
function enqueueSystemEventEntry(text, options, receiptOptions) {
	const event = enqueueOwnedSystemEventEntry(text, options, receiptOptions);
	return event ? cloneSystemEvent(event) : null;
}
/** Host-owned admission must report capacity refusal before claiming the occurrence. */
function enqueueRequiredSystemEventEntry(text, options, receiptOptions) {
	const event = enqueueOwnedSystemEventEntry(text, options, {
		...receiptOptions,
		throwOnFull: true
	});
	return event ? cloneSystemEvent(event) : null;
}
function enqueueOwnedSystemEventEntry(text, options, receiptOptions) {
	const key = requireSessionKey(options.sessionKey);
	if (readExecRequestOwners(options)?.some((owner) => owner.signal.aborted)) return null;
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
	} else if (receiptOptions?.allowDuplicate !== true) {
		const duplicate = (event) => event !== void 0 && event.text === cleaned && matches(event);
		if (normalizedContextKey === null ? duplicate(entry.queue.at(-1)) : entry.queue.some(duplicate)) return null;
	}
	if (entry.queue.length >= MAX_EVENTS && !(options.replace && entry.queue.some(matches))) {
		const error = new SystemEventQueueFullError();
		log.warn(error.message, { sessionKey: key });
		if (receiptOptions?.throwOnFull) throw error;
		return null;
	}
	const replaced = options.replace ? entry.queue.filter(matches) : [];
	if (replaced.length > 0) entry.queue = entry.queue.filter((event) => !matches(event));
	if (normalizedContextKey !== null) entry.lastContextKey = normalizedContextKey;
	const event = withExecRequestOwners({
		id: generateSecureUuid(),
		text: cleaned,
		ts: Date.now(),
		...sessionStorePath === void 0 ? {} : { sessionStorePath },
		contextKey: normalizedContextKey,
		deliveryContext: normalizedDeliveryContext,
		...options.fromConversationTurn ? { fromConversationTurn: true } : {}
	}, readExecRequestOwners(options));
	entry.queue.push(event);
	retireSystemEvents(replaced);
	return event;
}
function enqueueSystemEvent(text, options) {
	return enqueueOwnedSystemEventEntry(text, options) !== null;
}
/** Transfer one bounded set of exact occurrences to ordinary session admission. */
function claimSystemEventTurn(sessionKey, occurrences, cancel, agentId) {
	const key = requireSessionKey(sessionKey);
	if (agentId && parseAgentSessionKey(key)?.agentId !== agentId) return;
	const queue = getSessionQueue(key)?.queue;
	const ids = new Set(occurrences.map((occurrence) => occurrence.id));
	if (!queue || ids.size === 0 || ids.size > MAX_EVENTS || ids.size !== occurrences.length || ids.has(void 0)) return;
	const events = [];
	for (const occurrence of occurrences) {
		const event = queue.find((entry) => entry.id === occurrence.id);
		if (!event || turnOwners.has(event)) return;
		events.push(event);
	}
	let cancelled = false;
	const owner = {
		cancel: () => {
			if (!cancelled) {
				cancelled = true;
				cancel();
			}
		},
		started: false
	};
	for (const event of events) turnOwners.set(event, owner);
	const currentEvents = () => {
		const current = getSessionQueue(key)?.queue;
		return owner.started ? [] : events.filter((event) => turnOwners.get(event) === owner && current?.includes(event));
	};
	return {
		start() {
			if (currentEvents().length !== events.length) throw new Error("Session event occurrence was cancelled before admission");
			owner.started = true;
			consumeSelectedSystemEventEntries(key, events);
		},
		cancel: () => consumeSelectedSystemEventEntries(key, currentEvents()).length > 0,
		/** Rejected adoption returns the surviving originals to passive custody. */
		release() {
			const current = currentEvents();
			for (const event of current) turnOwners.delete(event);
			return current.length > 0;
		}
	};
}
function isSystemEventTurnOwned(sessionKey, occurrence) {
	const event = getSessionQueue(sessionKey)?.queue.find((entry) => entry.id === occurrence.id);
	return event !== void 0 && turnOwners.has(event);
}
/** Enqueues one occurrence and returns one-use removal ownership for its UUID. */
function enqueueSystemEventWithReceipt(text, options, receiptOptions) {
	const event = enqueueOwnedSystemEventEntry(text, options, {
		...receiptOptions,
		throwOnFull: true
	});
	if (!event) return null;
	const sessionKey = requireSessionKey(options.sessionKey);
	return () => consumeSelectedSystemEventEntries(sessionKey, [event]).length > 0;
}
function drainSystemEventEntries(sessionKey) {
	return drainSystemEventsWith(sessionKey, cloneSystemEvent);
}
function drainSystemEventsWith(sessionKey, project) {
	const key = requireSessionKey(sessionKey);
	const entry = getSessionQueue(key);
	if (!entry || entry.queue.length === 0) return [];
	const removed = entry.queue.splice(0);
	entry.lastContextKey = null;
	queues.delete(key);
	retireSystemEvents(removed);
	return removed.map(project);
}
function areDeliveryContextsEqual(left, right) {
	if (!left && !right) return true;
	if (!left || !right) return false;
	return channelRouteDedupeKey(left) === channelRouteDedupeKey(right);
}
function matchesConsumedSystemEvent(queued, consumed) {
	if (consumed.id !== void 0) return queued.id === consumed.id;
	return queued.text === consumed.text && queued.ts === consumed.ts && (queued.contextKey ?? null) === (consumed.contextKey ?? null) && areDeliveryContextsEqual(queued.deliveryContext, consumed.deliveryContext);
}
function resetQueueState(key, entry) {
	if (entry.queue.length === 0) {
		entry.lastContextKey = null;
		queues.delete(key);
		return;
	}
	entry.lastContextKey = entry.queue.findLast((event) => event.contextKey != null)?.contextKey ?? null;
}
function consumeSelectedSystemEventEntries(sessionKey, consumedEntries, options) {
	const key = requireSessionKey(sessionKey);
	const entry = getSessionQueue(key);
	if (!entry || entry.queue.length === 0 || consumedEntries.length === 0) return [];
	const deferredIds = new Set(options?.deferredEventIds);
	const selected = [];
	const retired = [];
	for (const consumed of consumedEntries) {
		const index = entry.queue.findIndex((event) => matchesConsumedSystemEvent(event, consumed));
		if (index === -1) continue;
		const event = entry.queue[index];
		if (event) {
			if (!event.id || !deferredIds.has(event.id)) {
				entry.queue.splice(index, 1);
				retired.push(event);
			}
			selected.push(cloneSystemEvent(event));
		}
	}
	resetQueueState(key, entry);
	retireSystemEvents(retired);
	return selected;
}
function drainSystemEvents(sessionKey) {
	return drainSystemEventsWith(sessionKey, (event) => event.text);
}
function peekSystemEventEntries(sessionKey) {
	return getSessionQueue(sessionKey)?.queue.map(cloneSystemEvent) ?? [];
}
/** Routed completions retain request ownership after process output expires. Stop is a cold path. */
function peekExecRequestSystemEventEntries(target) {
	const selected = [];
	for (const sessionKey of queues.keys()) {
		const events = peekSystemEventEntries(sessionKey).filter((event) => readExecRequestOwners(event)?.some((owner) => execRequestMatches(owner, target)));
		if (events.length > 0) selected.push({
			sessionKey,
			events
		});
	}
	return selected;
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
function peekDeliverableSystemEventEntries(sessionKey) {
	return peekSystemEventEntries(sessionKey).filter((event) => !event.deliveryHeld && !isSystemEventTurnOwned(sessionKey, event));
}
function holdSystemEventDelivery(sessionKey, attempted) {
	for (const event of getSessionQueue(sessionKey)?.queue ?? []) if (attempted.some((candidate) => matchesConsumedSystemEvent(event, candidate))) event.deliveryHeld = true;
}
//#endregion
export { peekSystemEvents as _, drainSystemEvents as a, enqueueSystemEventEntry as c, holdSystemEventDelivery as d, isSystemEventContextChanged as f, peekSystemEventEntries as g, peekExecRequestSystemEventEntries as h, drainSystemEventEntries as i, enqueueSystemEventWithReceipt as l, peekDeliverableSystemEventEntries as m, claimSystemEventTurn as n, enqueueRequiredSystemEventEntry as o, isSystemEventTurnOwned as p, consumeSelectedSystemEventEntries as r, enqueueSystemEvent as s, SystemEventQueueFullError as t, hasSystemEvents as u, resolveSystemEventDeliveryContext as v };
