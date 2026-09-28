import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { C as parseParentLinkedOpaqueEntry, S as parseOpaqueLeafEntry, x as isIndexedSessionEntry } from "./transcript-payload-qsg5dB6v.mjs";
import { r as isSessionTranscriptSideAppendEntry } from "./transcript-tree-3xvvNd9-.mjs";
//#region src/config/sessions/session-entry-navigation.ts
/** Physical replay traversal stops on unknown rows; budget exhaustion retains the current ID. */
function* walkSessionCurrentTurn(initialParentId, ancestorLimit) {
	let parentId = initialParentId;
	let remainingAncestors = ancestorLimit;
	while (parentId && remainingAncestors-- > 0) {
		const parent = yield parentId;
		if (!parent || parent.id !== parentId || !parent.traversable) break;
		parentId = parent.parentId;
	}
	return parentId;
}
function resolveSessionCanonicalParentId(parentId, byId, opaqueParentsById) {
	let seen;
	let currentId = parentId;
	while (currentId && !byId.has(currentId)) {
		if (seen?.has(currentId)) return null;
		(seen ??= /* @__PURE__ */ new Set()).add(currentId);
		currentId = opaqueParentsById.get(currentId) ?? null;
	}
	return currentId;
}
/** Opaque keep markers retain the same canonical ancestry as session replay. */
function resolveOpaqueSessionFirstKeptEntryId(params) {
	const { firstKeptEntryId, byId, opaqueParentsById } = params;
	const parent = resolveSessionCanonicalParentId(firstKeptEntryId, byId, opaqueParentsById);
	if (parent !== null) return parent;
	const seen = /* @__PURE__ */ new Set();
	let currentId = params.parentId;
	let firstCanonicalDescendant;
	while (currentId && !seen.has(currentId)) {
		if (currentId === firstKeptEntryId) {
			if (firstCanonicalDescendant) return firstCanonicalDescendant;
			break;
		}
		seen.add(currentId);
		const entry = byId.get(currentId);
		if (entry) {
			firstCanonicalDescendant = entry.id;
			currentId = entry.parentId;
		} else currentId = opaqueParentsById.get(currentId) ?? null;
	}
	for (const entry of params.entries()) {
		const ancestors = /* @__PURE__ */ new Set();
		let parentId = entry.parentId;
		while (parentId && opaqueParentsById.has(parentId) && !ancestors.has(parentId)) {
			if (parentId === firstKeptEntryId) return entry.id;
			ancestors.add(parentId);
			parentId = opaqueParentsById.get(parentId) ?? null;
		}
	}
	return params.fallbackParentId ?? void 0;
}
/** Normalize selected branch boundaries before choosing or hydrating model context. */
function normalizeSessionContextEntryBoundaries(entries, navigation) {
	if (!entries.some((entry) => isRecord(entry) && (entry.type === "compaction" || entry.type === "reset") && typeof entry.firstKeptEntryId === "string")) return entries.slice();
	const byId = /* @__PURE__ */ new Map();
	const opaqueParentsById = /* @__PURE__ */ new Map();
	for (const node of navigation) if (isIndexedSessionEntry(node.entry)) byId.set(node.id, {
		id: node.id,
		parentId: node.parentId
	});
	else opaqueParentsById.set(node.id, node.parentId);
	return entries.map((entry) => {
		if (!isIndexedSessionEntry(entry) || entry.type !== "compaction" && entry.type !== "reset" || entry.firstKeptEntryId === void 0 || byId.has(entry.firstKeptEntryId) || !opaqueParentsById.has(entry.firstKeptEntryId)) return entry;
		const parentId = resolveSessionCanonicalParentId(entry.parentId, byId, opaqueParentsById);
		const firstKeptEntryId = resolveOpaqueSessionFirstKeptEntryId({
			firstKeptEntryId: entry.firstKeptEntryId,
			parentId,
			fallbackParentId: parentId,
			byId,
			opaqueParentsById,
			entries: () => byId.values()
		});
		return firstKeptEntryId ? {
			...entry,
			firstKeptEntryId
		} : entry;
	});
}
/** One navigation owner for runtime sessions and streaming transcript operations. */
var SessionEntryNavigation = class {
	constructor() {
		this.byId = /* @__PURE__ */ new Map();
		this.opaqueParentsById = /* @__PURE__ */ new Map();
		this.logicalParentsById = /* @__PURE__ */ new Map();
		this.invalidLeafControlIds = /* @__PURE__ */ new Set();
		this.labelsById = /* @__PURE__ */ new Map();
		this.labelTimestampsById = /* @__PURE__ */ new Map();
		this.leafId = null;
		this.appendParentId = null;
		this.resetDescendantIds = /* @__PURE__ */ new Set();
	}
	clearNavigation() {
		this.byId.clear();
		this.opaqueParentsById.clear();
		this.logicalParentsById.clear();
		this.invalidLeafControlIds.clear();
		this.labelsById.clear();
		this.labelTimestampsById.clear();
		this.leafId = null;
		this.appendParentId = null;
		this.appendMode = void 0;
		this.latestResetId = void 0;
		this.resetDescendantIds.clear();
	}
	finishNavigation() {
		this.latestResetId = void 0;
		this.resetDescendantIds.clear();
	}
	resolveOpaqueLeafTargetId(targetId) {
		if (targetId === null || this.byId.has(targetId)) return targetId;
		return this.resolveCanonicalParentId(targetId);
	}
	resolveOpaqueAppendParentId(parentId) {
		if (parentId === null || this.byId.has(parentId) || this.opaqueParentsById.has(parentId)) return parentId;
		return this.resolveCanonicalParentId(parentId);
	}
	resolveOpaqueLeafControl(leafEntry) {
		if (!leafEntry) return;
		const isKnownReference = (id) => id === null || this.byId.has(id) || this.opaqueParentsById.has(id) && !this.invalidLeafControlIds.has(id);
		if (!isKnownReference(leafEntry.targetId) || leafEntry.appendParentId !== void 0 && !isKnownReference(leafEntry.appendParentId)) return;
		const leafId = this.resolveOpaqueLeafTargetId(leafEntry.targetId);
		return {
			leafId,
			appendParentId: leafEntry.appendParentId === void 0 ? leafId : this.resolveOpaqueAppendParentId(leafEntry.appendParentId),
			...leafEntry.appendMode ? { appendMode: leafEntry.appendMode } : {}
		};
	}
	appendOpaqueNavigationRecord(opaqueRecord) {
		const leafEntry = parseOpaqueLeafEntry(opaqueRecord);
		if (leafEntry) {
			const leafState = this.resolveOpaqueLeafControl(leafEntry);
			if (!leafState) {
				this.invalidLeafControlIds.add(leafEntry.id);
				this.opaqueParentsById.set(leafEntry.id, this.resolveOpaqueAppendParentId(leafEntry.parentId));
				return;
			}
			const effectiveLeafState = this.latestResetId !== void 0 && (leafState.leafId === null || !this.resetDescendantIds.has(leafState.leafId)) ? {
				leafId: this.leafId,
				appendParentId: this.leafId
			} : leafState;
			this.opaqueParentsById.set(leafEntry.id, effectiveLeafState.leafId);
			if (this.latestResetId !== void 0 && effectiveLeafState.leafId !== null && this.resetDescendantIds.has(effectiveLeafState.leafId)) this.resetDescendantIds.add(leafEntry.id);
			this.leafId = effectiveLeafState.leafId;
			this.appendParentId = effectiveLeafState.appendParentId;
			this.appendMode = effectiveLeafState.appendMode;
			return;
		}
		const link = parseParentLinkedOpaqueEntry(opaqueRecord);
		if (link) {
			this.opaqueParentsById.set(link.id, link.parentId);
			if (this.latestResetId !== void 0 && link.parentId !== null && this.resetDescendantIds.has(link.parentId)) this.resetDescendantIds.add(link.id);
			this.appendParentId = link.id;
		}
	}
	appendCanonicalNavigationEntry(entry, hasParentId = Object.hasOwn(entry, "parentId")) {
		if (entry.type === "label" && !this.byId.has(entry.targetId)) {
			this.opaqueParentsById.set(entry.id, this.resolveCanonicalParentId(entry.parentId));
			return;
		}
		if (this.latestResetId !== void 0 && !isSessionTranscriptSideAppendEntry(entry) && (entry.parentId === null || !this.resetDescendantIds.has(entry.parentId)) || !hasParentId || !isSessionTranscriptSideAppendEntry(entry) && entry.parentId === this.appendParentId && this.leafId !== this.appendParentId) this.logicalParentsById.set(entry.id, this.leafId);
		this.byId.set(entry.id, entry);
		if (entry.type === "reset") {
			this.latestResetId = entry.id;
			this.resetDescendantIds.clear();
			this.resetDescendantIds.add(entry.id);
		} else {
			const logicalParentId = this.logicalParentsById.has(entry.id) ? this.logicalParentsById.get(entry.id) ?? null : entry.parentId;
			if (this.latestResetId !== void 0 && logicalParentId !== null && this.resetDescendantIds.has(logicalParentId)) this.resetDescendantIds.add(entry.id);
		}
		this.appendParentId = entry.id;
		if (isSessionTranscriptSideAppendEntry(entry)) this.appendMode = "side";
		else {
			this.leafId = entry.id;
			this.appendMode = void 0;
		}
		if (entry.type === "label") {
			if (entry.label) {
				this.labelsById.set(entry.targetId, entry.label);
				this.labelTimestampsById.set(entry.targetId, entry.timestamp);
			} else {
				this.labelsById.delete(entry.targetId);
				this.labelTimestampsById.delete(entry.targetId);
			}
		}
	}
	resolveCanonicalParentId(parentId) {
		return resolveSessionCanonicalParentId(parentId, this.byId, this.opaqueParentsById);
	}
	resolveEntryParentId(entry) {
		return this.logicalParentsById.has(entry.id) ? this.logicalParentsById.get(entry.id) ?? null : this.resolveCanonicalParentId(entry.parentId);
	}
	normalizeEntryParent(entry) {
		const parentId = this.resolveEntryParentId(entry);
		let normalized = parentId === entry.parentId ? entry : {
			...entry,
			parentId
		};
		if (normalized.parentId === normalized.id) normalized = {
			...normalized,
			parentId: null
		};
		return normalized;
	}
	getBranch(fromId) {
		const path = [];
		const seen = /* @__PURE__ */ new Set();
		let currentId = fromId ?? this.leafId;
		while (currentId && !seen.has(currentId)) {
			seen.add(currentId);
			const current = this.byId.get(currentId);
			if (current) {
				const normalizedCurrent = this.normalizeEntryParent(current);
				path.push(normalizedCurrent);
				currentId = normalizedCurrent.parentId;
			} else currentId = this.opaqueParentsById.get(currentId) ?? null;
		}
		path.reverse();
		return path;
	}
};
//#endregion
export { walkSessionCurrentTurn as i, normalizeSessionContextEntryBoundaries as n, resolveOpaqueSessionFirstKeptEntryId as r, SessionEntryNavigation as t };
