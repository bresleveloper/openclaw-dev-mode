import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./session-entry-codec-DSMJ1XFN.mjs";
import { n as projectModelContextMessages } from "./model-context-message-CFPsc6fp.mjs";
import { f as selectSessionTranscriptLeafControlledPath } from "./transcript-tree-D61jhi_i.mjs";
import { s as stripCompactionReplayCheckpointInPlace, t as buildSessionContext$1 } from "./session-BEAHkH3E.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { t as uuidv7 } from "./uuid-BDgsQUmZ.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/sessions/session-manager-id.ts
function createManagedSessionId() {
	return uuidv7();
}
function generateSessionEntryId() {
	return randomUUID();
}
//#endregion
//#region src/agents/sessions/session-manager-codec.ts
function isTalkRealtimeVoiceEntry(entry) {
	if (entry.type !== "message" || entry.message.role !== "user" && entry.message.role !== "assistant") return false;
	const provenance = Reflect.get(entry.message, "provenance");
	return isRecord(provenance) && provenance.kind === "realtime_voice" && provenance.sourceChannel === "talk";
}
function isSessionContextMetadataEntry(entry) {
	return entry.type === "thinking_level_change" || entry.type === "model_change" || entry.type === "custom" || entry.type === "label" || entry.type === "session_info";
}
function migrateSessionFileEntryToCurrentVersion(entry, originalIndex, state) {
	if (state.sourceVersion < 2) {
		if (entry.type === "session") entry.version = 2;
		else {
			entry.id = state.createEntryId(originalIndex);
			entry.parentId = state.previousId;
			state.previousId = entry.id;
			if (entry.type === "compaction") {
				const compaction = entry;
				if (typeof compaction.firstKeptEntryIndex === "number") {
					const firstKeptEntryId = state.resolveOriginalEntryId?.(compaction.firstKeptEntryIndex);
					if (firstKeptEntryId) compaction.firstKeptEntryId = firstKeptEntryId;
					delete compaction.firstKeptEntryIndex;
				}
			}
		}
	}
	if (state.sourceVersion < 3) {
		if (entry.type === "session") entry.version = 3;
		else if (entry.type === "message" && entry.message) {
			const message = entry.message;
			if (message.role === "hookMessage") {
				message.role = "custom";
				message.customType ||= "hook";
			}
		}
	}
}
function migrateToCurrentVersion(entries, entriesByOriginalIndex) {
	const version = entries.find((entry) => entry.type === "session")?.version ?? 1;
	if (version >= 3) return false;
	const state = {
		createEntryId: generateSessionEntryId,
		previousId: null,
		resolveOriginalEntryId: (originalIndex) => {
			const targetEntry = entriesByOriginalIndex ? entriesByOriginalIndex[originalIndex] : entries[originalIndex];
			return targetEntry && targetEntry.type !== "session" ? targetEntry.id : void 0;
		},
		sourceVersion: version
	};
	for (const [index, entry] of entries.entries()) migrateSessionFileEntryToCurrentVersion(entry, index, state);
	return true;
}
function migrateSessionEntries(entries) {
	migrateToCurrentVersion(entries);
}
function getLatestCompactionEntry(entries) {
	const boundary = entries.findLast((entry) => entry.type === "reset" || entry.type === "compaction");
	return boundary?.type === "compaction" ? boundary : null;
}
function cloneSessionModelContextEntries(header, branch) {
	const events = [...header ? [header] : [], ...branch];
	for (let index = 0; index < events.length; index++) {
		const entry = events[index];
		if (entry.type === "message") {
			const message = projectModelContextMessages([entry.message])[0];
			if (message !== entry.message) events[index] = {
				...entry,
				message
			};
		}
	}
	return structuredClone(events);
}
function buildSessionContext(entries, leafId, byIdInput) {
	let contextEntries = entries;
	let contextById = byIdInput;
	if (leafId === void 0) {
		const selectedEntries = selectSessionTranscriptLeafControlledPath(entries);
		if (selectedEntries !== void 0) {
			contextEntries = selectedEntries;
			contextById = void 0;
		}
	}
	const byId = contextById ?? new Map(contextEntries.map((entry) => [entry.id, entry]));
	if (leafId === null) return {
		messages: [],
		thinkingLevel: "off",
		model: null
	};
	let leaf = leafId ? byId.get(leafId) : void 0;
	leaf ??= contextEntries.at(-1);
	if (!leaf) return {
		messages: [],
		thinkingLevel: "off",
		model: null
	};
	const path = [];
	const seen = /* @__PURE__ */ new Set();
	let current = leaf;
	while (current && !seen.has(current.id)) {
		seen.add(current.id);
		path.push(current);
		current = current.parentId ? byId.get(current.parentId) : void 0;
	}
	path.reverse();
	return buildSessionContext$1(path);
}
function parseSessionEntries(content) {
	const entries = [];
	let skipped = 0;
	for (const line of content.trim().split("\n")) {
		if (!line.trim()) continue;
		try {
			entries.push(normalizeLoadedFileEntry(JSON.parse(line)));
		} catch {
			skipped += 1;
		}
	}
	if (skipped > 0) logWarn(`parseJsonlEntries: skipped ${skipped} malformed JSONL line(s) — ${entries.length} valid entries were loaded`);
	return entries;
}
function normalizeLoadedFileEntry(entry) {
	if (!isRecord(entry) || entry.type !== "message" || !isRecord(entry.message)) return entry;
	const message = entry.message;
	if ((message.role === "assistant" || message.role === "toolResult") && typeof message.content === "string") {
		message.content = [{
			type: "text",
			text: message.content
		}];
		stripCompactionReplayCheckpointInPlace(message);
	} else if (message.role === "toolResult" && isRecord(message.content)) message.content = [message.content];
	return entry;
}
//#endregion
export { isTalkRealtimeVoiceEntry as a, migrateToCurrentVersion as c, createManagedSessionId as d, generateSessionEntryId as f, isSessionContextMetadataEntry as i, normalizeLoadedFileEntry as l, cloneSessionModelContextEntries as n, migrateSessionEntries as o, getLatestCompactionEntry as r, migrateSessionFileEntryToCurrentVersion as s, buildSessionContext as t, parseSessionEntries as u };
