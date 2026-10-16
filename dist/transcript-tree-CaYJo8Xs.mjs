import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/config/sessions/transcript-tree.ts
function isCanonicalSessionEntryType(value) {
	switch (value) {
		case "message":
		case "thinking_level_change":
		case "model_change":
		case "compaction":
		case "reset":
		case "branch_summary":
		case "custom":
		case "custom_message":
		case "label":
		case "session_info": return true;
		default: return false;
	}
}
function isCanonicalSessionTranscriptEntry(record) {
	return isRecord(record) && isCanonicalSessionEntryType(record.type);
}
function isSessionTranscriptSideAppendEntry(record) {
	return isCanonicalSessionTranscriptEntry(record) && record.appendMode === "side";
}
function isSessionTranscriptLeafControl(record) {
	return isRecord(record) && record.type === "leaf" && parseSessionTranscriptTreeEntry(record) !== void 0;
}
/**
* Parse one parent-linked transcript row.
*
* Leaf rows are navigation controls: they select targetId as the active leaf,
* and descendants that reference the marker continue through that same target.
*/
function parseSessionTranscriptTreeEntry(record) {
	if (!isRecord(record) || record.type === "session" || !Object.hasOwn(record, "parentId")) return;
	const id = readNonBlankString(record.id);
	const parentId = record.parentId === null ? null : readNonBlankString(record.parentId) ?? void 0;
	if (!id || parentId === void 0) return;
	if (record.type === "leaf") {
		const targetId = record.targetId === null ? null : readNonBlankString(record.targetId) ?? void 0;
		const appendParentId = record.appendParentId === void 0 ? targetId : record.appendParentId === null ? null : readNonBlankString(record.appendParentId) ?? void 0;
		const appendMode = record.appendMode === void 0 ? void 0 : record.appendMode === "side" ? "side" : null;
		return targetId === void 0 || appendParentId === void 0 || appendMode === null ? void 0 : {
			id,
			parentId: targetId,
			leafId: targetId,
			appendParentId,
			...appendMode ? { appendMode } : {}
		};
	}
	return {
		id,
		parentId,
		leafId: isCanonicalSessionTranscriptEntry(record) && record.appendMode !== "side" ? id : void 0,
		appendParentId: id,
		...record.appendMode === "side" ? { appendMode: record.appendMode } : {}
	};
}
function parseParentlessCanonicalEntry(record, parentId) {
	if (!isCanonicalSessionTranscriptEntry(record) || Object.hasOwn(record, "parentId")) return;
	const id = readNonBlankString(record.id);
	return id ? {
		id,
		parentId,
		leafId: record.appendMode === "side" ? void 0 : id,
		appendParentId: id,
		...record.appendMode === "side" ? { appendMode: record.appendMode } : {}
	} : void 0;
}
function resolveCanonicalParentId(parentId, byId) {
	let seen;
	let currentId = parentId;
	while (currentId !== null) {
		if (seen?.has(currentId)) return currentId;
		const parent = byId.get(currentId);
		if (!parent || !isSessionTranscriptLeafControl(parent.entry)) return currentId;
		(seen ??= /* @__PURE__ */ new Set()).add(currentId);
		currentId = parent.parentId;
	}
	return null;
}
function scanSessionTranscriptTree(entries) {
	const nodes = [];
	const byId = /* @__PURE__ */ new Map();
	return {
		nodes,
		byId,
		...scanSessionTranscriptNavigation(entries, {
			byId,
			addNode: (node) => nodes.push(node),
			resetDescendantIds: /* @__PURE__ */ new Set(),
			invalidLeafControlIds: /* @__PURE__ */ new Set()
		})
	};
}
/** Resolves the active branch leaf from the same transcript tree used by branch listing. */
function resolveSessionTranscriptActiveLeafEntryId(events) {
	return scanSessionTranscriptTree(events).leafId ?? void 0;
}
function scanSessionTranscriptNavigation(entries, storage) {
	const { byId, resetDescendantIds, invalidLeafControlIds } = storage;
	let leafId = null;
	let appendParentId = null;
	let hasLeafControl = false;
	let hasLeafUpdate = false;
	let hasExplicitLeafUpdate = false;
	let hasInvalidLeafControl = false;
	let latestResetId;
	let nextIndex = 0;
	for (const entry of entries) {
		const index = nextIndex++;
		let explicitTreeEntry = parseSessionTranscriptTreeEntry(entry);
		if (latestResetId && leafId !== null && explicitTreeEntry?.leafId !== void 0 && isSessionTranscriptLeafControl(entry) && (explicitTreeEntry.leafId === null || !resetDescendantIds.has(explicitTreeEntry.leafId))) explicitTreeEntry = {
			...explicitTreeEntry,
			parentId: leafId,
			leafId,
			appendParentId: leafId
		};
		const isKnownLeafReference = (id) => id === null || byId.has(id) && !invalidLeafControlIds.has(id);
		if (explicitTreeEntry?.leafId !== void 0 && isSessionTranscriptLeafControl(entry) && (!isKnownLeafReference(explicitTreeEntry.leafId) || !isKnownLeafReference(explicitTreeEntry.appendParentId)) && explicitTreeEntry) {
			hasInvalidLeafControl = true;
			invalidLeafControlIds.add(explicitTreeEntry.id);
			const rawParentId = entry.parentId;
			const node = {
				...explicitTreeEntry,
				parentId: rawParentId,
				leafId: void 0,
				appendParentId,
				entry,
				index
			};
			storage.addNode(node);
			byId.set(node.id, node);
			continue;
		}
		let treeEntry = explicitTreeEntry ?? parseParentlessCanonicalEntry(entry, leafId);
		if (treeEntry && isCanonicalSessionTranscriptEntry(entry)) {
			const canonicalParentIsStale = explicitTreeEntry && treeEntry.parentId !== null && !byId.has(treeEntry.parentId) && leafId !== null;
			const normalizedParentId = resolveCanonicalParentId(latestResetId !== void 0 && treeEntry.appendMode !== "side" && (treeEntry.parentId === null || !resetDescendantIds.has(treeEntry.parentId)) ? leafId : treeEntry.appendMode !== "side" && canonicalParentIsStale ? leafId : explicitTreeEntry && treeEntry.appendMode !== "side" && treeEntry.parentId === appendParentId && leafId !== appendParentId ? leafId : treeEntry.parentId, byId);
			if (normalizedParentId !== treeEntry.parentId) treeEntry = {
				...treeEntry,
				parentId: normalizedParentId
			};
		}
		if (!treeEntry) continue;
		const node = {
			...treeEntry,
			entry,
			index
		};
		storage.addNode(node);
		byId.set(node.id, node);
		if (isRecord(entry) && entry.type === "reset") {
			latestResetId = node.id;
			resetDescendantIds.clear();
			resetDescendantIds.add(node.id);
		} else if (latestResetId !== void 0 && node.parentId !== null && resetDescendantIds.has(node.parentId)) resetDescendantIds.add(node.id);
		appendParentId = node.appendParentId;
		if (node.leafId !== void 0) {
			leafId = node.leafId;
			hasLeafUpdate = true;
			if (explicitTreeEntry) hasExplicitLeafUpdate = true;
		}
		if (isSessionTranscriptLeafControl(entry)) hasLeafControl = true;
	}
	return {
		leafId,
		appendParentId,
		hasLeafControl,
		hasLeafUpdate,
		hasExplicitLeafUpdate,
		hasInvalidLeafControl
	};
}
function selectSessionTranscriptActiveEntries(params) {
	const records = params.entries.map(params.recordOf);
	const tree = params.tree ?? scanSessionTranscriptTree(records);
	if (params.failClosedOnInvalidLeafControl === true && tree.hasInvalidLeafControl) return [];
	if (!tree.hasExplicitLeafUpdate) return [...params.entries];
	const activePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	return [...selectSessionTranscriptActiveEntryIndexes({
		tree,
		entryCount: params.entries.length,
		recordAt: (index) => records[index],
		readPath: (leafId) => leafId === tree.leafId ? activePath : selectSessionTranscriptTreePathNodes(tree, leafId)
	})].flatMap((index) => {
		const entry = params.entries[index];
		return entry === void 0 ? [] : [entry];
	});
}
/** Selection policy is shared by memory readers and bounded, disk-backed archive readers. */
function* selectSessionTranscriptActiveEntryIndexes(params) {
	if (!params.tree.hasExplicitLeafUpdate) {
		for (let index = 0; index < params.entryCount; index += 1) yield index;
		return;
	}
	const activePath = params.readPath(params.tree.leafId);
	let firstActiveNode;
	for (const node of activePath) {
		firstActiveNode = node;
		break;
	}
	for (let index = (firstActiveNode?.index ?? 0) - 1; index >= 0; index -= 1) {
		const record = params.recordAt(index);
		if (!isRecord(record) || record.type !== "compaction" && record.type !== "reset") continue;
		if (record.type === "reset") {
			const resetId = readNonBlankString(record.id);
			const firstKeptEntryId = readNonBlankString(record.firstKeptEntryId);
			if (resetId && firstKeptEntryId) {
				let kept = false;
				for (const node of params.readPath(resetId)) {
					kept ||= node.id === firstKeptEntryId;
					if (kept) yield node.index;
				}
				if (kept) break;
			}
		}
		yield index;
		break;
	}
	for (const node of params.readPath(params.tree.leafId)) yield node.index;
}
function selectSessionTranscriptTreeTipNodes(tree) {
	const referencedParents = new Set(tree.nodes.flatMap((node) => isSessionTranscriptLeafControl(node.entry) || node.parentId === null ? [] : [node.parentId]));
	return tree.nodes.filter((node) => !isSessionTranscriptLeafControl(node.entry) && (node.id === tree.leafId || !referencedParents.has(node.id)));
}
/** Select one normalized path, retaining a reachable suffix after missing ancestors. */
function selectSessionTranscriptTreePathNodes(tree, leafId) {
	const path = [];
	return visitSessionTranscriptTreePathNodes(tree.byId, leafId, /* @__PURE__ */ new Set(), (node) => {
		path.push(node);
	}) ? path.toReversed() : [];
}
/** Visits leaf to root. Callers must discard every visited node when a cycle is found. */
function visitSessionTranscriptTreePathNodes(byId, leafId, seen, visit) {
	let currentId = leafId;
	while (currentId) {
		if (seen.has(currentId)) return false;
		seen.add(currentId);
		const current = byId.get(currentId);
		if (!current) break;
		if (!isSessionTranscriptLeafControl(current.entry)) visit(current);
		currentId = current.parentId;
	}
	return true;
}
/** Merge normalized paths in original file order and expose their retained parent links. */
function mergeSessionTranscriptTreePaths(paths) {
	const selectedById = /* @__PURE__ */ new Map();
	for (const path of paths) {
		let selectedParentId = null;
		for (const node of path) {
			selectedById.set(node.id, {
				...node,
				selectedParentId
			});
			selectedParentId = node.id;
		}
	}
	return [...selectedById.values()].toSorted((left, right) => left.index - right.index);
}
/**
* Build a copy-safe branch from the visible path and the opaque append suffix.
*
* Hidden canonical append ancestors must not leak into forks or repairs. Keep
* only opaque cursor records after the last canonical ancestor and reparent
* that suffix onto the selected visible path.
*/
function mergeSessionTranscriptVisiblePathWithOpaqueAppendPath(params) {
	const nodes = mergeSessionTranscriptTreePaths([params.visiblePath]);
	const selectedIds = new Set(nodes.map((node) => node.id));
	let opaqueStart = params.appendPath.length;
	for (; opaqueStart > 0; opaqueStart -= 1) {
		const node = params.appendPath[opaqueStart - 1];
		if (!node || selectedIds.has(node.id) || isCanonicalSessionTranscriptEntry(node.entry)) break;
	}
	let selectedParentId = nodes.at(-1)?.id ?? null;
	for (let index = opaqueStart; index < params.appendPath.length; index += 1) {
		const node = params.appendPath[index];
		nodes.push({
			...node,
			selectedParentId
		});
		selectedIds.add(node.id);
		selectedParentId = node.id;
	}
	return {
		nodes,
		appendParentId: params.appendParentId === null ? null : selectedIds.has(params.appendParentId) ? params.appendParentId : nodes.at(-1)?.id ?? null
	};
}
/**
* Select the effective branch only when the transcript contains leaf controls.
*
* Legacy flat readers can keep their existing behavior when this returns
* undefined. Once navigation controls exist, returning the selected path keeps
* side branches out of prompts and hooks even after later active-branch appends.
*/
function selectSessionTranscriptLeafControlledPath(entries) {
	const tree = scanSessionTranscriptTree(entries);
	if (!tree.hasLeafControl) return;
	return selectSessionTranscriptActiveEntries({
		entries,
		recordOf: (entry) => entry,
		tree
	}).map((entry) => {
		const node = isRecord(entry) ? tree.byId.get(readNonBlankString(entry.id) ?? "") : void 0;
		if (!node || !isRecord(entry) || entry.parentId === node.parentId) return entry;
		return Object.assign({}, entry, { parentId: node.parentId });
	});
}
//#endregion
export { mergeSessionTranscriptVisiblePathWithOpaqueAppendPath as a, scanSessionTranscriptNavigation as c, selectSessionTranscriptActiveEntryIndexes as d, selectSessionTranscriptLeafControlledPath as f, visitSessionTranscriptTreePathNodes as h, mergeSessionTranscriptTreePaths as i, scanSessionTranscriptTree as l, selectSessionTranscriptTreeTipNodes as m, isSessionTranscriptLeafControl as n, parseSessionTranscriptTreeEntry as o, selectSessionTranscriptTreePathNodes as p, isSessionTranscriptSideAppendEntry as r, resolveSessionTranscriptActiveLeafEntryId as s, isCanonicalSessionTranscriptEntry as t, selectSessionTranscriptActiveEntries as u };
