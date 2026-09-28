import { D as resolveExpiresAtMsFromDurationMs, E as resolveDateTimestampMs, g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/node-pending-work.ts
const DEFAULT_STATUS_ITEM_ID = "baseline-status";
const DEFAULT_STATUS_PRIORITY = "default";
const DEFAULT_PRIORITY = "normal";
const DEFAULT_PENDING_WORK_TTL_MS = 864e5;
const DEFAULT_MAX_ITEMS = 4;
const MAX_ITEMS = 10;
const PRIORITY_RANK = {
	high: 3,
	normal: 2,
	default: 1
};
const stateByNodeId = /* @__PURE__ */ new Map();
function getOrCreateState(nodeId, pairingGeneration) {
	let states = stateByNodeId.get(nodeId);
	if (!states) {
		states = /* @__PURE__ */ new Map();
		stateByNodeId.set(nodeId, states);
	}
	let state = states.get(pairingGeneration);
	if (!state) {
		state = {
			revision: 0,
			itemsById: /* @__PURE__ */ new Map(),
			...pairingGeneration ? { pairingGeneration } : {}
		};
		states.set(pairingGeneration, state);
	}
	return state;
}
function pruneExpired(state, nowMs) {
	const validNowMs = asDateTimestampMs(nowMs);
	if (validNowMs === void 0) return false;
	let changed = false;
	for (const [id, item] of state.itemsById) if (item.expiresAtMs !== null && !isFutureDateTimestampMs(item.expiresAtMs, { nowMs: validNowMs })) {
		state.itemsById.delete(id);
		changed = true;
	}
	if (changed) state.revision += 1;
	return changed;
}
function pruneExpiredRetiredGenerations(nodeId, currentPairingGeneration, nowMs) {
	const states = stateByNodeId.get(nodeId);
	if (!states) return;
	for (const [pairingGeneration, state] of states) {
		if (pairingGeneration === currentPairingGeneration) continue;
		pruneExpired(state, nowMs);
		if (state.itemsById.size === 0) states.delete(pairingGeneration);
	}
	if (states.size === 0) stateByNodeId.delete(nodeId);
}
function pruneStateIfEmpty(nodeId, pairingGeneration, state) {
	if (state.itemsById.size === 0) {
		const states = stateByNodeId.get(nodeId);
		states?.delete(pairingGeneration);
		if (states?.size === 0) stateByNodeId.delete(nodeId);
	}
}
function sortedItems(state) {
	return [...state.itemsById.values()].toSorted((a, b) => {
		const priorityDelta = PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
		if (priorityDelta !== 0) return priorityDelta;
		if (a.createdAtMs !== b.createdAtMs) return a.createdAtMs - b.createdAtMs;
		return a.id.localeCompare(b.id);
	});
}
function makeBaselineStatusItem(nowMs) {
	return {
		id: DEFAULT_STATUS_ITEM_ID,
		type: "status.request",
		priority: DEFAULT_STATUS_PRIORITY,
		createdAtMs: resolveDateTimestampMs(nowMs),
		expiresAtMs: null
	};
}
function resolvePendingWorkExpiresAtMs(expiresInMs, nowMs) {
	return resolveExpiresAtMsFromDurationMs(typeof expiresInMs === "number" && Number.isFinite(expiresInMs) ? Math.max(1e3, Math.trunc(expiresInMs)) : DEFAULT_PENDING_WORK_TTL_MS, { nowMs }) ?? 0;
}
function enqueueNodePendingWork(params) {
	const nodeId = params.nodeId.trim();
	if (!nodeId) throw new Error("nodeId required");
	const rawNowMs = Date.now();
	const nowMs = resolveDateTimestampMs(rawNowMs);
	pruneExpiredRetiredGenerations(nodeId, params.pairingGeneration, nowMs);
	const state = getOrCreateState(nodeId, params.pairingGeneration);
	pruneExpired(state, nowMs);
	const existing = [...state.itemsById.values()].find((item) => item.type === params.type);
	if (existing) return {
		revision: state.revision,
		item: existing,
		deduped: true
	};
	const item = {
		id: randomUUID(),
		type: params.type,
		priority: params.priority ?? DEFAULT_PRIORITY,
		createdAtMs: nowMs,
		expiresAtMs: resolvePendingWorkExpiresAtMs(params.expiresInMs, rawNowMs),
		...params.payload ? { payload: params.payload } : {}
	};
	state.itemsById.set(item.id, item);
	state.revision += 1;
	return {
		revision: state.revision,
		item,
		deduped: false
	};
}
/** Clears explicit pending work owned by a removed node pairing. */
function clearNodePendingWork(nodeId, pairingGeneration) {
	const normalizedNodeId = nodeId.trim();
	if (!normalizedNodeId) return false;
	if (pairingGeneration === void 0) return stateByNodeId.delete(normalizedNodeId);
	const states = stateByNodeId.get(normalizedNodeId);
	const deleted = states?.delete(pairingGeneration) ?? false;
	if (states?.size === 0) stateByNodeId.delete(normalizedNodeId);
	return deleted;
}
/** Removes one exact item without disturbing concurrent work in the same generation. */
function removeNodePendingWorkItem(params) {
	const normalizedNodeId = params.nodeId.trim();
	if (!normalizedNodeId || !params.itemId) return false;
	const state = stateByNodeId.get(normalizedNodeId)?.get(params.pairingGeneration);
	if (!state || !state.itemsById.delete(params.itemId)) return false;
	state.revision += 1;
	pruneStateIfEmpty(normalizedNodeId, params.pairingGeneration, state);
	return true;
}
/** Drains pending work for a node, including a baseline status request unless disabled. */
function drainNodePendingWork(nodeId, opts = {}) {
	const normalizedNodeId = nodeId.trim();
	if (!normalizedNodeId) return {
		revision: 0,
		items: [],
		hasMore: false
	};
	const nowMs = resolveDateTimestampMs(opts.nowMs ?? Date.now());
	pruneExpiredRetiredGenerations(normalizedNodeId, opts.pairingGeneration, nowMs);
	const state = stateByNodeId.get(normalizedNodeId)?.get(opts.pairingGeneration);
	if (state) {
		pruneExpired(state, nowMs);
		pruneStateIfEmpty(normalizedNodeId, opts.pairingGeneration, state);
	}
	const revision = state?.revision ?? 0;
	const maxItems = Math.min(MAX_ITEMS, Math.max(1, Math.trunc(opts.maxItems ?? DEFAULT_MAX_ITEMS)));
	const explicitItems = state ? sortedItems(state) : [];
	const items = explicitItems.slice(0, maxItems);
	const hasExplicitStatus = explicitItems.some((item) => item.type === "status.request");
	const includeBaseline = opts.includeDefaultStatus !== false && !hasExplicitStatus;
	if (includeBaseline && items.length < maxItems) items.push(makeBaselineStatusItem(nowMs));
	const explicitReturnedCount = items.filter((item) => item.id !== DEFAULT_STATUS_ITEM_ID).length;
	const baselineIncluded = items.some((item) => item.id === DEFAULT_STATUS_ITEM_ID);
	if (state && explicitReturnedCount > 0) {
		for (const item of items) if (item.id !== DEFAULT_STATUS_ITEM_ID) state.itemsById.delete(item.id);
		state.revision += 1;
		pruneStateIfEmpty(normalizedNodeId, opts.pairingGeneration, state);
	}
	return {
		revision: state?.revision ?? revision,
		items,
		hasMore: explicitItems.length > explicitReturnedCount || includeBaseline && !baselineIncluded
	};
}
//#endregion
export { removeNodePendingWorkItem as i, drainNodePendingWork as n, enqueueNodePendingWork as r, clearNodePendingWork as t };
