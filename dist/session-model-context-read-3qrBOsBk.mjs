import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as isIndexedSessionEntry, o as parseOpaqueLeafEntry, s as parseParentLinkedOpaqueEntry } from "./session-entry-codec-DSMJ1XFN.mjs";
import { r as classifyToolUseResultPairing } from "./tool-result-pairing-B20tITEh.mjs";
import { a as isCompactionReplayCheckpoint, i as projectSessionEntryMessage, n as iterateSessionContextEntries } from "./session-BEAHkH3E.mjs";
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
	recordResetDescendant(id, parentId) {
		if (parentId !== null && this.resetDescendantIds.has(parentId)) this.resetDescendantIds.add(id);
	}
	resolveOpaqueLeafTargetId(targetId) {
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
			this.recordResetDescendant(leafEntry.id, effectiveLeafState.leafId);
			this.leafId = effectiveLeafState.leafId;
			this.appendParentId = effectiveLeafState.appendParentId;
			this.appendMode = effectiveLeafState.appendMode;
			return;
		}
		const link = parseParentLinkedOpaqueEntry(opaqueRecord);
		if (link) {
			this.opaqueParentsById.set(link.id, link.parentId);
			this.recordResetDescendant(link.id, link.parentId);
			this.appendParentId = link.id;
		}
	}
	appendCanonicalNavigationEntry(entry, hasParentId = Object.hasOwn(entry, "parentId")) {
		if (entry.type === "label" && !this.byId.has(entry.targetId)) {
			this.opaqueParentsById.set(entry.id, entry.parentId);
			return;
		}
		const sideAppend = entry.appendMode === "side";
		if (this.latestResetId !== void 0 && !sideAppend && (entry.parentId === null || !this.resetDescendantIds.has(entry.parentId)) || !hasParentId || !sideAppend && entry.parentId === this.appendParentId && this.leafId !== this.appendParentId) this.logicalParentsById.set(entry.id, this.leafId);
		this.byId.set(entry.id, entry);
		if (entry.type === "reset") {
			this.latestResetId = entry.id;
			this.resetDescendantIds.clear();
			this.resetDescendantIds.add(entry.id);
		} else {
			const logicalParentId = this.logicalParentsById.has(entry.id) ? this.logicalParentsById.get(entry.id) ?? null : entry.parentId;
			this.recordResetDescendant(entry.id, logicalParentId);
		}
		this.appendParentId = entry.id;
		if (sideAppend) this.appendMode = "side";
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
		const resolvedParentId = this.resolveEntryParentId(entry);
		const parentId = resolvedParentId === entry.id ? null : resolvedParentId;
		return parentId === entry.parentId ? entry : {
			...entry,
			parentId
		};
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
//#region src/config/sessions/session-model-context-window.ts
/** Select an owned suffix before SQLite payloads can enter JavaScript or cross a worker. */
function selectBoundedModelRequests(requests, readSizes, limits) {
	const boundary = requests.find(({ entry }) => entry.type === "compaction" || entry.type === "reset");
	const candidates = requests.filter((request) => request !== boundary);
	const candidateLimit = limits.maxEvents - (boundary ? 1 : 0);
	const sizingCandidates = candidateLimit > 0 ? candidates.slice(-candidateLimit) : [];
	const sizes = readSizes(boundary ? [boundary, ...sizingCandidates] : sizingCandidates);
	let bytes = boundary ? sizes.get(boundary.entry) : 0;
	let events = boundary ? 1 : 0;
	if (bytes > limits.maxBytes || events > limits.maxEvents) throw new RangeError("Required session context boundary exceeds the model-context limit");
	const replacements = /* @__PURE__ */ new Map();
	let candidateBytes = [...sizes.values()].reduce((total, size) => total + size, 0);
	if (limits.toolResultOverflow === "omit" && candidateBytes > limits.maxBytes) {
		const omissions = sizingCandidates.flatMap((request) => {
			const { entry } = request;
			if (entry.type !== "message" || entry.message.role !== "toolResult") return [];
			const message = entry.message;
			return [{
				...request,
				toolResultOmission: `Tool result body omitted from this bounded context: ${JSON.stringify(message.toolName)} (call ${JSON.stringify(message.toolCallId)}), original model-context event ${sizes.get(entry)} bytes. The full result remains in the session transcript. Do not infer its outcome or repeat the operation from this notice.`
			}];
		});
		const omittedSizes = readSizes(omissions);
		const savings = (request) => sizes.get(request.entry) - omittedSizes.get(request.entry);
		for (const omission of omissions.toSorted((a, b) => savings(b) - savings(a))) {
			if (candidateBytes <= limits.maxBytes) break;
			const saved = savings(omission);
			if (saved > 0) {
				replacements.set(omission.entry, {
					request: omission,
					savedBytes: saved
				});
				sizes.set(omission.entry, omittedSizes.get(omission.entry));
				candidateBytes -= saved;
			}
		}
	}
	const capacity = limits.maxBytes - bytes;
	let totalBytes = candidateBytes - bytes;
	const byteLimited = totalBytes > capacity;
	let byteLimit = limits.maxBytes;
	if (byteLimited) {
		for (const size of readSizes(candidates.slice(0, -sizingCandidates.length)).values()) totalBytes += size;
		const step = Math.max(1, Math.floor(capacity / 4));
		byteLimit = bytes + totalBytes - Math.ceil((totalBytes - capacity) / step) * step;
	}
	let cut = candidates.length;
	let fallbackCut = cut;
	for (const request of sizingCandidates.toReversed()) {
		const size = sizes.get(request.entry);
		if (bytes + size > limits.maxBytes || events + 1 > limits.maxEvents) break;
		bytes += size;
		events += 1;
		fallbackCut -= 1;
		if (bytes <= byteLimit) cut -= 1;
	}
	if (cut === 0) return requests.map((request) => replacements.get(request.entry)?.request ?? request);
	const turnStarts = byteLimited ? candidates.flatMap(({ entry }, index) => entry.type === "message" && entry.message.role === "user" ? [index] : []) : [];
	const alignToTurn = (index) => turnStarts.find((start) => start >= index) ?? index;
	cut = alignToTurn(cut);
	const messages = candidates.flatMap(({ entry }) => {
		const message = entry.type === "message" ? entry.message : projectSessionEntryMessage(entry);
		return message ? [message] : [];
	});
	const positions = /* @__PURE__ */ new Map();
	for (const [index, { entry }] of candidates.entries()) if (entry.type === "message") positions.set(entry.message, index);
	const original = classifyToolUseResultPairing(messages);
	const owners = /* @__PURE__ */ new Map();
	for (const frame of original.frames) {
		const start = positions.get(frame.assistant);
		for (const occurrence of frame.occurrences) if (occurrence.sourceResult) {
			owners.set(occurrence.sourceResult, frame.assistant);
			const end = positions.get(occurrence.sourceResult);
			if (start < cut && cut <= end) cut = alignToTurn(end + 1);
			if (start < fallbackCut && fallbackCut <= end) fallbackCut = end + 1;
		}
	}
	const latestTurnStart = turnStarts.at(-1) ?? candidates.length;
	const trailingPromptOnly = latestTurnStart === candidates.length - 1 && cut === latestTurnStart;
	let selected = candidates.slice(cut === candidates.length || cut > latestTurnStart || trailingPromptOnly ? fallbackCut : cut);
	let retainedBytes = boundary ? sizes.get(boundary.entry) : 0;
	for (const request of selected) retainedBytes += sizes.get(request.entry);
	for (const request of selected.toReversed()) {
		const replacement = replacements.get(request.entry);
		if (!replacement) continue;
		if (retainedBytes + replacement.savedBytes <= limits.maxBytes) {
			replacements.delete(request.entry);
			retainedBytes += replacement.savedBytes;
		}
	}
	selected = selected.map((request) => replacements.get(request.entry)?.request ?? request);
	if (selected.length === 0) throw new RangeError("The latest messages exceed this session's context limit. Start a new session with a brief summary to continue.");
	const selectedMessages = selected.flatMap(({ entry }) => entry.type === "message" ? [entry.message] : []);
	const selectedOwners = /* @__PURE__ */ new Map();
	for (const frame of classifyToolUseResultPairing(selectedMessages).frames) for (const occurrence of frame.occurrences) if (occurrence.sourceResult) selectedOwners.set(occurrence.sourceResult, frame.assistant);
	for (const message of selectedMessages) if (message.role === "toolResult" && owners.get(message) !== selectedOwners.get(message)) throw new RangeError("Session context limit would change tool-result ownership");
	return boundary ? [boundary, ...selected] : selected;
}
//#endregion
//#region src/config/sessions/session-model-context-read.ts
/** Select before reading payloads; durable and memory backends share context projection. */
function projectSessionModelContext({ header, entries, readModelEntries, readModelEntrySizes, version }, limits) {
	const requests = [];
	for (const { entry, context } of iterateSessionContextEntries(entries)) {
		const omitCheckpoint = context !== "current" && entry.type === "message" && entry.message.role === "assistant" && isCompactionReplayCheckpoint(entry.message.providerReplay);
		requests.push({
			entry,
			omitCheckpoint
		});
	}
	const payloads = readModelEntries(limits ? selectBoundedModelRequests(requests, readModelEntrySizes, limits) : requests);
	let contextEntries;
	if (limits) {
		const model = entries.findLast((entry) => entry.type === "model_change" || entry.type === "message" && entry.message.role === "assistant");
		const thinking = entries.findLast((entry) => entry.type === "thinking_level_change");
		const detached = entries.flatMap((entry) => {
			const payload = payloads.get(entry);
			if (payload) return [payload];
			if (entry === thinking || entry === model && entry.type === "model_change") return [entry];
			if (entry === model && entry.type === "message" && entry.message.role === "assistant") return [{
				type: "model_change",
				id: entry.id,
				parentId: entry.parentId,
				timestamp: entry.timestamp,
				provider: entry.message.provider,
				modelId: entry.message.model
			}];
			return [];
		});
		const boundaryIndex = detached.findIndex((entry) => entry.type === "compaction" || entry.type === "reset");
		const boundary = detached[boundaryIndex];
		if (boundary?.type === "compaction" || boundary?.type === "reset") boundary.firstKeptEntryId = detached.slice(0, boundaryIndex).find((entry) => entry.type === "message" || entry.type === "custom_message" || entry.type === "branch_summary")?.id ?? boundary.id;
		contextEntries = detached.map((entry, index) => {
			entry.parentId = detached[index - 1]?.id ?? null;
			return entry;
		});
	} else contextEntries = entries.map((entry) => payloads.get(entry) ?? entry);
	return {
		events: [...header ? [header] : [], ...contextEntries],
		version
	};
}
//#endregion
export { walkSessionCurrentTurn as a, resolveOpaqueSessionFirstKeptEntryId as i, SessionEntryNavigation as n, normalizeSessionContextEntryBoundaries as r, projectSessionModelContext as t };
