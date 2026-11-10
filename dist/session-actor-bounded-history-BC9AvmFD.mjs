import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { Fn as object, Jn as string, Nt as array, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
import { i as isIndexedSessionEntry } from "./session-entry-codec-DSMJ1XFN.mjs";
import { l as scanSessionTranscriptTree, p as selectSessionTranscriptTreePathNodes } from "./transcript-tree-D61jhi_i.mjs";
import { a as transcriptEventContextEligibility, i as shouldProjectActiveEvent } from "./session-transcript-projection-append-DGPoJ8qL.mjs";
import { c as normalizeVisibleMessageLimit, i as MAX_VISIBLE_MESSAGE_MAX_MESSAGES, n as DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES, r as MAX_VISIBLE_MESSAGE_MAX_BYTES, t as DEFAULT_VISIBLE_MESSAGE_MAX_BYTES } from "./session-accessor.sqlite-visible-cursor-CwElG0zY.mjs";
//#region src/config/sessions/session-bounded-context-selection.ts
/** The newest contiguous eligible rows must fit together with the canonical header. */
function selectBoundedContextRows(rows, headerBytes, limits) {
	if (headerBytes > limits.maxBytes) throw new RangeError("Session transcript header exceeds the active-context byte limit");
	const selectedRows = [];
	let serializedBytes = headerBytes;
	let truncated = false;
	for (const row of rows) {
		if (selectedRows.length >= limits.maxEvents || serializedBytes + row.serialized_bytes > limits.maxBytes) {
			truncated = true;
			break;
		}
		selectedRows.push(row);
		serializedBytes += row.serialized_bytes;
	}
	return {
		selectedRows,
		serializedBytes,
		truncated
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/cache-ttl-checkpoint.ts
const prunedResult = union([object({
	key: string(),
	mode: literal("soft")
}), object({
	key: string(),
	mode: literal("hard"),
	placeholder: string()
})]);
const frozenResult = object({
	key: string(),
	sourceHash: string(),
	texts: array(string()).optional()
});
const snapshotSchema = object({
	prunedToolResults: array(prunedResult),
	ambiguousToolResultBaseKeys: array(string()).default([]),
	frozenToolResults: array(frozenResult).default([])
});
function changesSchema(value) {
	return object({
		set: array(value),
		remove: array(string())
	});
}
const deltaSchema = object({ cacheTtlDelta: object({
	prunedToolResults: changesSchema(prunedResult),
	ambiguousToolResultBaseKeys: changesSchema(string()),
	frozenToolResults: changesSchema(frozenResult)
}) });
const MAX_DELTAS = 31;
const MAX_DELTA_BYTES = 65536;
const projectionFields = [...Object.keys(snapshotSchema.shape), ...Object.keys(deltaSchema.shape)];
function isCacheTtlTouch(data) {
	return isRecord(data) && typeof data.timestamp === "number" && Number.isFinite(data.timestamp) && !projectionFields.some((key) => key in data);
}
function changes(before, after, key) {
	const previous = new Map(before.map((value) => [key(value), value]));
	return {
		set: after.filter((value) => {
			const old = previous.get(key(value));
			previous.delete(key(value));
			return JSON.stringify(old) !== JSON.stringify(value);
		}),
		remove: [...previous.keys()]
	};
}
function prepareCacheTtlCheckpoint(snapshot, previous) {
	if (previous) {
		const keyed = (value) => value.key;
		const delta = { cacheTtlDelta: {
			prunedToolResults: changes(previous.snapshot.prunedToolResults, snapshot.prunedToolResults, keyed),
			ambiguousToolResultBaseKeys: changes(previous.snapshot.ambiguousToolResultBaseKeys, snapshot.ambiguousToolResultBaseKeys, (key) => key),
			frozenToolResults: changes(previous.snapshot.frozenToolResults, snapshot.frozenToolResults, keyed)
		} };
		if (Object.values(delta.cacheTtlDelta).every(({ set, remove }) => !set.length && !remove.length)) return { checkpoint: previous };
		const bytes = previous.bytes + Buffer.byteLength(JSON.stringify(delta));
		if (previous.deltas < MAX_DELTAS && bytes < MAX_DELTA_BYTES) return {
			marker: delta,
			checkpoint: {
				snapshot,
				deltas: previous.deltas + 1,
				bytes
			}
		};
	}
	return {
		marker: snapshot,
		checkpoint: {
			snapshot,
			deltas: 0,
			bytes: 0
		}
	};
}
function applyChanges(values, patch, key) {
	for (const removed of patch.remove) values.delete(removed);
	for (const value of patch.set) values.set(key(value), value);
}
/** Only the supplied active branch participates; legacy full snapshots are checkpoints. */
function readCacheTtlCheckpoint(entries) {
	const deltas = [];
	let damaged = false;
	for (let index = entries.length - 1; index >= 0; index--) {
		const entry = entries[index];
		if (entry?.type === "reset") return;
		if (entry?.type !== "custom" || entry.customType !== "openclaw.cache-ttl") continue;
		const data = entry.data;
		const isDelta = isRecord(data) && "cacheTtlDelta" in data;
		const parsed = isDelta ? deltaSchema.safeParse(data) : snapshotSchema.safeParse(data);
		if (!parsed.success) {
			if (isDelta || !isCacheTtlTouch(data)) {
				deltas.length = 0;
				damaged = true;
			}
			continue;
		}
		if ("cacheTtlDelta" in parsed.data) {
			deltas.push(parsed.data);
			continue;
		}
		if (!deltas.length) return {
			snapshot: parsed.data,
			deltas: damaged ? MAX_DELTAS : 0,
			bytes: 0
		};
		const keyed = (value) => value.key;
		const pruned = new Map(parsed.data.prunedToolResults.map((value) => [value.key, value]));
		const ambiguous = new Map(parsed.data.ambiguousToolResultBaseKeys.map((key) => [key, key]));
		const frozen = new Map(parsed.data.frozenToolResults.map((value) => [value.key, value]));
		let bytes = 0;
		for (const delta of deltas.toReversed()) {
			applyChanges(pruned, delta.cacheTtlDelta.prunedToolResults, keyed);
			applyChanges(ambiguous, delta.cacheTtlDelta.ambiguousToolResultBaseKeys, (key) => key);
			applyChanges(frozen, delta.cacheTtlDelta.frozenToolResults, keyed);
			bytes += Buffer.byteLength(JSON.stringify(delta));
		}
		return {
			snapshot: {
				prunedToolResults: [...pruned.values()],
				ambiguousToolResultBaseKeys: [...ambiguous.values()],
				frozenToolResults: [...frozen.values()]
			},
			deltas: damaged ? MAX_DELTAS : deltas.length,
			bytes
		};
	}
}
/** TTL trims are re-derived; ordinary trims retain only text, never images or tool metadata. */
function serializeCacheTtlToolResultProjections(state) {
	const marks = new Map(state.restoredCacheTtl);
	for (const [key, projection] of state.replacements) if (projection.cacheTtl === "soft") marks.set(key, { mode: "soft" });
	else if (projection.cacheTtl === "hard") {
		const placeholder = projection.content.flatMap((block) => block.type === "text" ? [block.text] : []).join("\n");
		marks.set(key, {
			mode: "hard",
			placeholder
		});
	}
	return {
		prunedToolResults: [...marks].map(([key, mark]) => Object.assign({ key }, mark)),
		ambiguousToolResultBaseKeys: [...state.ambiguousBaseKeys],
		frozenToolResults: [...state.sourceHashByKey].flatMap(([key, sourceHash]) => {
			if (!state.frozen.has(key)) return [];
			const projection = state.replacements.get(key);
			return [{
				key,
				sourceHash,
				...!projection?.cacheTtl && projection ? { texts: projection.content.flatMap((block) => block.type === "text" ? [block.text] : []) } : {}
			}];
		})
	};
}
//#endregion
//#region src/config/sessions/session-cache-ttl-prefix-values.ts
/** Read newest first and stop at the reset or checkpoint that owns this prefix. */
function collectCacheTtlProjectionPrefix(anchor, preceding) {
	if (isIndexedSessionEntry(anchor.entry) && (anchor.entry.type === "reset" || readCacheTtlCheckpoint([anchor.entry]))) return;
	const prefix = [];
	for (const entry of preceding) {
		if (!isIndexedSessionEntry(entry) || entry.type !== "reset" && (entry.type !== "custom" || entry.customType !== "openclaw.cache-ttl" || isCacheTtlTouch(entry.data))) continue;
		if (isRecord(entry)) prefix.push(entry);
		if (entry.type === "reset" || readCacheTtlCheckpoint([entry])) break;
	}
	return prefix.length ? {
		anchorIds: [anchor.id],
		entries: prefix.toReversed()
	} : void 0;
}
//#endregion
//#region src/config/sessions/session-actor-bounded-history.ts
/** Select from bytes already held by the actor, using the same bounded-window policy. */
function readSessionActorBoundedHistory(state, limits) {
	const version = { ...state.hot.transcript.version };
	const maxBytes = normalizeVisibleMessageLimit(limits.maxBytes, DEFAULT_VISIBLE_MESSAGE_MAX_BYTES, MAX_VISIBLE_MESSAGE_MAX_BYTES, "maxBytes");
	const maxEvents = normalizeVisibleMessageLimit(limits.maxEvents, DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES, MAX_VISIBLE_MESSAGE_MAX_MESSAGES, "maxEvents");
	const navigation = scanSessionTranscriptTree(state.events.map((row) => row.event));
	const active = selectSessionTranscriptTreePathNodes(navigation, navigation.leafId).filter((node) => shouldProjectActiveEvent(node.entry)).map((node, activePosition) => {
		const row = state.events[node.index];
		return {
			rawSeq: row.rawSeq,
			event: row.event,
			node,
			activePosition,
			serialized_bytes: row.serializedBytes
		};
	});
	const header = state.events.find((row) => isRecord(row.event) && row.event.type === "session");
	const headerBytes = header ? header.serializedBytes : 0;
	const retained = new Set(state.hot.transcript.modelContext.kind === "resident" ? state.hot.transcript.modelContext.entries.map((entry) => entry.rawSeq) : []);
	const selection = selectBoundedContextRows(active.filter((row) => transcriptEventContextEligibility(row.event) === 1 || retained.has(row.rawSeq)).toReversed(), headerBytes, {
		maxBytes,
		maxEvents
	});
	const { selectedRows } = selection;
	let { serializedBytes, truncated } = selection;
	const boundaries = active.filter(({ event }) => isRecord(event) && (event.type === "reset" || event.type === "compaction"));
	const boundary = boundaries.at(-1);
	const rows = selectedRows.toSorted((left, right) => left.rawSeq - right.rawSeq);
	let injected;
	if (boundary && !selectedRows.includes(boundary)) {
		if (serializedBytes + boundary.serialized_bytes <= maxBytes) {
			injected = boundary;
			rows.unshift(boundary);
			serializedBytes += boundary.serialized_bytes;
		} else truncated = true;
	}
	const parents = new Map(rows.map((row) => [row.node.id, active[row.activePosition - 1]?.node.id ?? null]));
	const opaqueParents = /* @__PURE__ */ new Map();
	let previousId;
	for (const row of rows) {
		const event = row.event;
		if (row === injected) previousId = row.node.id;
		else if (isRecord(event) && "parentId" in event) {
			if (previousId !== void 0 && typeof event.parentId === "string" && event.parentId !== previousId) opaqueParents.set(event.parentId, previousId);
			previousId = row.node.id;
		}
	}
	if (navigation.leafId && navigation.leafId !== previousId) opaqueParents.set(navigation.leafId, previousId ?? null);
	const headerOffset = header ? 1 : 0;
	const firstKeptRanges = /* @__PURE__ */ new Map();
	for (const [endIndex, row] of rows.entries()) {
		const event = row.event;
		if (!isRecord(event) || event.type !== "reset" && event.type !== "compaction" || typeof event.firstKeptEntryId !== "string") continue;
		const first = active.find((candidate) => candidate.node.id === event.firstKeptEntryId);
		if (!first) continue;
		let startIndex = endIndex > 0 && rows[0].rawSeq >= first.rawSeq ? 0 : Math.min(1, endIndex);
		while (startIndex < endIndex && rows[startIndex].rawSeq < first.rawSeq) startIndex++;
		firstKeptRanges.set(row.node.id, {
			startIndex: startIndex + headerOffset,
			endIndex: endIndex + headerOffset
		});
	}
	const cacheTtlProjectionPrefixes = [...injected && isRecord(injected.event) && injected.event.type === "compaction" ? [injected] : [], ...selectedRows.at(-1) ? [selectedRows.at(-1)] : []].flatMap((anchor) => {
		const prefix = collectCacheTtlProjectionPrefix({
			id: anchor.node.id,
			entry: anchor.event
		}, active.slice(0, anchor.activePosition).toReversed().map((row) => row.event));
		return prefix ? [prefix] : [];
	});
	return {
		kind: "bounded",
		snapshot: {
			version,
			activeLeafEntryId: navigation.leafId,
			opaqueParents,
			parents,
			firstKeptRanges,
			persistedSuffixStartSeq: rows[0]?.rawSeq ?? (header ? header.rawSeq + 1 : 0),
			boundaryCount: boundaries.length,
			events: structuredClone([...header ? [header.event] : [], ...rows.map((row) => row.event)]),
			cacheTtlProjectionPrefixes: structuredClone(cacheTtlProjectionPrefixes),
			serializedBytes,
			totalEvents: active.length,
			transcriptMutationAt: version.updatedAt,
			truncated,
			...!truncated && selectedRows.length === active.length ? { completeActivePath: true } : {}
		}
	};
}
//#endregion
export { serializeCacheTtlToolResultProjections as a, readCacheTtlCheckpoint as i, collectCacheTtlProjectionPrefix as n, selectBoundedContextRows as o, prepareCacheTtlCheckpoint as r, readSessionActorBoundedHistory as t };
