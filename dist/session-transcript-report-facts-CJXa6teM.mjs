import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Yt as discriminatedUnion, kt as _null, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as classifySessionFileEntry, o as parseOpaqueLeafEntry, s as parseParentLinkedOpaqueEntry } from "./session-entry-codec-DSMJ1XFN.mjs";
import { l as isSyntheticMissingToolResult, n as SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY } from "./tool-result-pairing-B20tITEh.mjs";
import { s as readSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
//#region src/config/sessions/session-model-context-navigation.ts
const TRANSCRIPT_NAVIGATION_KEYS = [
	"type",
	"id",
	"parentId",
	"targetId",
	"appendParentId",
	"appendMode"
];
const MODEL_CONTEXT_NAVIGATION_KEYS = [
	...TRANSCRIPT_NAVIGATION_KEYS,
	"timestamp",
	"version",
	"cwd",
	"firstKeptEntryId",
	"reason",
	"tokensBefore",
	"thinkingLevel",
	"provider",
	"modelId",
	"fromId",
	"customType",
	"display",
	"excludeFromContext",
	"label",
	"name"
];
const MODEL_MESSAGE_NAVIGATION_KEYS = [
	"role",
	"provider",
	"model",
	"timestamp",
	"excludeFromContext",
	"toolCallId",
	"toolUseId",
	"tool_call_id",
	"tool_use_id",
	"callId",
	"call_id",
	"toolName",
	"isError",
	"stopReason",
	"customType",
	"display"
];
function pickNavigation(record, keys) {
	return Object.fromEntries(keys.filter((key) => Object.hasOwn(record, key)).map((key) => [key, record[key]]));
}
function projectSessionModelContextNavigation(entry) {
	const projected = {
		...pickNavigation({ ...entry }, MODEL_CONTEXT_NAVIGATION_KEYS),
		type: entry.type,
		id: entry.id,
		parentId: entry.parentId,
		timestamp: entry.timestamp
	};
	if (entry.type === "message") {
		const message = entry.message;
		const original = { ...message };
		const calls = "content" in message && Array.isArray(message.content) ? message.content.flatMap((item) => isRecord(item) && [
			"toolCall",
			"toolUse",
			"functionCall"
		].includes(item.type) ? [pickNavigation(item, [
			"type",
			"id",
			"name"
		])] : []) : [];
		const details = isRecord(original.details) ? original.details : {};
		const operatorKind = original.customType === "openclaw.system-update" && (details.kind === "prompt-update" || details.kind === "runtime-context") ? details.kind : void 0;
		projected.message = {
			...pickNavigation(original, MODEL_MESSAGE_NAVIGATION_KEYS),
			content: calls,
			command: "",
			output: "",
			providerReplay: { type: isRecord(original.providerReplay) ? original.providerReplay.type : null },
			details: {
				[SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY]: isSyntheticMissingToolResult({
					isError: original.isError,
					details: original.details,
					content: original.content
				}),
				...operatorKind ? { kind: operatorKind } : {}
			}
		};
	} else if (entry.type === "compaction" || entry.type === "branch_summary") projected.summary = "";
	else if (entry.type === "custom_message") {
		projected.content = [];
		if (entry.customType === "openclaw.system-update" && isRecord(entry.details) && (entry.details.kind === "prompt-update" || entry.details.kind === "runtime-context")) projected.details = { kind: entry.details.kind };
	} else if (entry.type === "custom" && entry.customType === "openclaw.system-prompt") projected.data = { restart: isRecord(entry.data) && entry.data.restart === true };
	return projected;
}
//#endregion
//#region src/config/sessions/session-transcript-report-facts.ts
const canonicalEntryShape = {
	id: string().min(1),
	parentId: union([string(), _null()]).optional(),
	timestamp: string().optional(),
	appendMode: unknown().optional()
};
const canonicalFactsSchema = object({
	kind: literal("canonical"),
	hasParentId: boolean(),
	entry: discriminatedUnion("type", [
		object({
			...canonicalEntryShape,
			type: literal("message"),
			assistantResponseId: string().optional(),
			assistantRunId: string().optional()
		}),
		object({
			...canonicalEntryShape,
			type: literal("custom_message"),
			customType: string().min(1)
		}),
		object({
			...canonicalEntryShape,
			type: literal("label"),
			targetId: string().min(1),
			label: string().optional()
		}),
		object({
			...canonicalEntryShape,
			type: _enum([
				"thinking_level_change",
				"model_change",
				"compaction",
				"reset",
				"branch_summary",
				"custom",
				"session_info"
			])
		})
	])
}).refine(({ entry, hasParentId }) => hasParentId === (entry.parentId !== void 0));
/** Classify the original parsed row; callers retain the current-header guard. */
function projectSessionTranscriptReportFacts(raw) {
	const { entry, recognized } = classifySessionFileEntry(raw, 3);
	if (!recognized || entry.type === "session") {
		const leaf = parseOpaqueLeafEntry(raw);
		if (leaf) return {
			kind: "leaf",
			entry: leaf
		};
		const link = parseParentLinkedOpaqueEntry(raw);
		return link ? {
			kind: "link",
			...link
		} : { kind: "ignored" };
	}
	const common = {
		id: entry.id,
		parentId: entry.parentId,
		timestamp: entry.timestamp,
		appendMode: entry.appendMode
	};
	const hasParentId = Object.hasOwn(entry, "parentId");
	if (entry.type === "label") return {
		kind: "canonical",
		hasParentId,
		entry: {
			...common,
			type: entry.type,
			targetId: entry.targetId,
			label: entry.label
		}
	};
	if (entry.type === "custom_message") return {
		kind: "canonical",
		hasParentId,
		entry: {
			...common,
			type: entry.type,
			customType: entry.customType
		}
	};
	if (entry.type === "message") return {
		kind: "canonical",
		hasParentId,
		entry: {
			...common,
			type: entry.type,
			...entry.message.role === "assistant" ? {
				assistantRunId: readSessionTranscriptRunId(entry.message),
				...typeof entry.message.responseId === "string" ? { assistantResponseId: entry.message.responseId } : {}
			} : {}
		}
	};
	return {
		kind: "canonical",
		hasParentId,
		entry: {
			...common,
			type: entry.type
		}
	};
}
/** Validate stored facts without reclassifying a synthetic message body. */
function decodeSessionTranscriptReportFacts(value) {
	if (!isRecord(value)) return;
	switch (value.kind) {
		case "canonical": {
			const parsed = canonicalFactsSchema.safeParse(value);
			return parsed.success ? parsed.data : void 0;
		}
		case "leaf": {
			if (!isRecord(value.entry)) return;
			const entry = parseOpaqueLeafEntry({
				...value.entry,
				type: "leaf"
			});
			return entry ? {
				kind: "leaf",
				entry
			} : void 0;
		}
		case "link": {
			const entry = parseParentLinkedOpaqueEntry(value);
			return entry ? {
				kind: "link",
				...entry
			} : void 0;
		}
		case "ignored": return { kind: "ignored" };
		default: return;
	}
}
//#endregion
export { TRANSCRIPT_NAVIGATION_KEYS as a, MODEL_MESSAGE_NAVIGATION_KEYS as i, projectSessionTranscriptReportFacts as n, projectSessionModelContextNavigation as o, MODEL_CONTEXT_NAVIGATION_KEYS as r, decodeSessionTranscriptReportFacts as t };
