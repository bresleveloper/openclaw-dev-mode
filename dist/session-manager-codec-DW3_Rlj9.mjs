import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import "./transcript-payload-qsg5dB6v.mjs";
import { t as buildSessionContext$1 } from "./session-D9cHHQGH.mjs";
import { d as selectSessionTranscriptLeafControlledPath } from "./transcript-tree-3xvvNd9-.mjs";
import { t as uuidv7 } from "./uuid-Du6j8Hxj.mjs";
import { randomUUID } from "node:crypto";
import { stripCompactionReplayCheckpointInPlace } from "@openclaw/ai/transports";
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
function parseSessionEntries(content) {
	return parseJsonlEntries(content);
}
function getLatestCompactionEntry(entries) {
	for (let index = entries.length - 1; index >= 0; index -= 1) {
		const entry = entries[index];
		if (entry.type === "reset") return null;
		if (entry.type === "compaction") return entry;
	}
	return null;
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
	let byId = contextById;
	if (!byId) {
		byId = /* @__PURE__ */ new Map();
		for (const entry of contextEntries) byId.set(entry.id, entry);
	}
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
function parseJsonlEntries(content) {
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
export { migrateSessionEntries as a, normalizeLoadedFileEntry as c, generateSessionEntryId as d, isTalkRealtimeVoiceEntry as i, parseSessionEntries as l, getLatestCompactionEntry as n, migrateSessionFileEntryToCurrentVersion as o, isSessionContextMetadataEntry as r, migrateToCurrentVersion as s, buildSessionContext as t, createManagedSessionId as u };
