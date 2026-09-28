import { ni as NEVER } from "./json-schema-processors-C6KO_BFy.mjs";
import { Et as _enum, Jn as string, Nt as array, Pn as number, Sn as looseObject, Yt as discriminatedUnion, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { c as resolveWorkspaceStateIdentity } from "./workspace-state-identity-CmGr5k4K.mjs";
import { createHash } from "node:crypto";
//#region src/memory-host-sdk/event-store.ts
const MEMORY_HOST_EVENTS_PLUGIN_ID = "memory-core";
const MEMORY_HOST_EVENTS_NAMESPACE = "memory-host.events";
const MEMORY_HOST_EVENT_CURSORS_NAMESPACE = "memory-host.event-cursors";
const MAX_MEMORY_HOST_EVENTS = 1e4;
const MAX_MEMORY_HOST_EVENT_CURSORS = 1e3;
const MAX_MEMORY_HOST_EVENT_JSON_BYTES = 8192;
const MAX_MEMORY_HOST_EVENT_ITEMS = 10;
const MAX_MEMORY_HOST_EVENT_TEXT_BYTES = 2048;
const MAX_MEMORY_HOST_EVENT_PATH_BYTES = 256;
const WORKSPACE_HASH_BYTES = 24;
const memoryHostFiniteNumberSchema = number().finite();
const memoryHostRecallResultSchema = looseObject({
	path: string(),
	startLine: memoryHostFiniteNumberSchema,
	endLine: memoryHostFiniteNumberSchema,
	score: memoryHostFiniteNumberSchema
});
const memoryHostRecallResultsSchema = array(memoryHostRecallResultSchema);
const memoryHostSkippedRecallResultSchema = memoryHostRecallResultSchema.extend({ reason: literal("non-short-term-memory-path") });
const memoryHostSkippedRecallResultsSchema = array(memoryHostSkippedRecallResultSchema);
const boundedRecallResultsSchema = array(unknown()).transform((values, context) => {
	const parsed = memoryHostRecallResultsSchema.safeParse(values.slice(0, MAX_MEMORY_HOST_EVENT_ITEMS));
	if (!parsed.success) {
		context.addIssue({
			code: "custom",
			message: "invalid recall result"
		});
		return NEVER;
	}
	return {
		items: parsed.data,
		truncated: values.length > MAX_MEMORY_HOST_EVENT_ITEMS
	};
});
const boundedSkippedRecallResultsSchema = array(unknown()).transform((values, context) => {
	const parsed = memoryHostSkippedRecallResultsSchema.safeParse(values.slice(0, MAX_MEMORY_HOST_EVENT_ITEMS));
	if (!parsed.success) {
		context.addIssue({
			code: "custom",
			message: "invalid skipped recall result"
		});
		return NEVER;
	}
	return {
		items: parsed.data,
		truncated: values.length > MAX_MEMORY_HOST_EVENT_ITEMS
	};
});
const memoryHostPromotionCandidateSchema = looseObject({
	key: string(),
	path: string(),
	startLine: memoryHostFiniteNumberSchema,
	endLine: memoryHostFiniteNumberSchema,
	score: memoryHostFiniteNumberSchema,
	recallCount: memoryHostFiniteNumberSchema
});
const memoryHostPromotionCandidatesSchema = array(memoryHostPromotionCandidateSchema);
const boundedPromotionCandidatesSchema = array(unknown()).transform((values, context) => {
	const parsed = memoryHostPromotionCandidatesSchema.safeParse(values.slice(0, MAX_MEMORY_HOST_EVENT_ITEMS));
	if (!parsed.success) {
		context.addIssue({
			code: "custom",
			message: "invalid promotion candidate"
		});
		return NEVER;
	}
	return {
		items: parsed.data,
		truncated: values.length > MAX_MEMORY_HOST_EVENT_ITEMS
	};
});
const memoryHostEventRecordSchema = discriminatedUnion("type", [
	looseObject({
		type: literal("memory.recall.recorded"),
		timestamp: string(),
		storageTruncated: unknown().optional(),
		query: string(),
		resultCount: memoryHostFiniteNumberSchema,
		results: boundedRecallResultsSchema
	}),
	looseObject({
		type: literal("memory.recall.skipped"),
		timestamp: string(),
		storageTruncated: unknown().optional(),
		query: string(),
		reason: literal("non-short-term-memory-path"),
		eligibleResultCount: memoryHostFiniteNumberSchema,
		skippedResultCount: memoryHostFiniteNumberSchema,
		results: boundedSkippedRecallResultsSchema
	}),
	looseObject({
		type: literal("memory.promotion.applied"),
		timestamp: string(),
		storageTruncated: unknown().optional(),
		memoryPath: string(),
		applied: memoryHostFiniteNumberSchema,
		candidates: boundedPromotionCandidatesSchema
	}),
	looseObject({
		type: literal("memory.dream.completed"),
		timestamp: string(),
		storageTruncated: unknown().optional(),
		phase: _enum([
			"light",
			"deep",
			"rem"
		]),
		outcome: _enum(["completed", "failed"]).optional(),
		error: string().optional(),
		inlinePath: string().optional(),
		reportPath: string().optional(),
		lineCount: memoryHostFiniteNumberSchema,
		storageMode: _enum([
			"inline",
			"separate",
			"both"
		])
	})
]);
function normalizeMemoryHostWorkspaceKey(workspaceDir) {
	const resolved = resolveWorkspaceStateIdentity(workspaceDir).workspacePath.replace(/\\/g, "/");
	return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
function memoryHostWorkspacePrefix(workspaceDir) {
	return createHash("sha256").update(normalizeMemoryHostWorkspaceKey(workspaceDir)).digest("hex").slice(0, WORKSPACE_HASH_BYTES);
}
function truncateUtf8(value, maxBytes) {
	if (Buffer.byteLength(value, "utf8") <= maxBytes) return {
		value,
		truncated: false
	};
	let low = 0;
	let high = value.length;
	while (low < high) {
		const middle = Math.ceil((low + high) / 2);
		if (Buffer.byteLength(value.slice(0, middle), "utf8") <= maxBytes - 3) low = middle;
		else high = middle - 1;
	}
	const end = low > 0 && /[\uD800-\uDBFF]/u.test(value.charAt(low - 1)) ? low - 1 : low;
	return {
		value: `${value.slice(0, end)}…`,
		truncated: true
	};
}
/** Validate and bound one diagnostic event before storing it in plugin state. */
function normalizeMemoryHostEventRecordForStorage(value) {
	const parsed = memoryHostEventRecordSchema.safeParse(value);
	if (!parsed.success) return null;
	const event = parsed.data;
	const timestamp = truncateUtf8(event.timestamp, 128);
	let truncated = timestamp.truncated || event.storageTruncated === true;
	if (event.type === "memory.recall.recorded" || event.type === "memory.recall.skipped") {
		const query = truncateUtf8(event.query, MAX_MEMORY_HOST_EVENT_TEXT_BYTES);
		truncated ||= query.truncated || event.results.truncated;
		const results = event.results.items.map((result) => {
			const resultPath = truncateUtf8(result.path, MAX_MEMORY_HOST_EVENT_PATH_BYTES);
			truncated ||= resultPath.truncated;
			return {
				path: resultPath.value,
				startLine: result.startLine,
				endLine: result.endLine,
				score: result.score,
				...event.type === "memory.recall.skipped" ? { reason: "non-short-term-memory-path" } : {}
			};
		});
		const normalized = event.type === "memory.recall.recorded" ? {
			type: "memory.recall.recorded",
			timestamp: timestamp.value,
			query: query.value,
			resultCount: event.resultCount,
			results: results.map((result) => ({
				path: result.path,
				startLine: result.startLine,
				endLine: result.endLine,
				score: result.score
			})),
			...truncated ? { storageTruncated: true } : {}
		} : {
			type: "memory.recall.skipped",
			timestamp: timestamp.value,
			query: query.value,
			reason: "non-short-term-memory-path",
			eligibleResultCount: event.eligibleResultCount,
			skippedResultCount: event.skippedResultCount,
			results: results.map((result) => ({
				path: result.path,
				startLine: result.startLine,
				endLine: result.endLine,
				score: result.score,
				reason: "non-short-term-memory-path"
			})),
			...truncated ? { storageTruncated: true } : {}
		};
		return Buffer.byteLength(JSON.stringify(normalized), "utf8") <= MAX_MEMORY_HOST_EVENT_JSON_BYTES ? normalized : {
			...normalized,
			results: [],
			storageTruncated: true
		};
	}
	if (event.type === "memory.promotion.applied") {
		const memoryPath = truncateUtf8(event.memoryPath, MAX_MEMORY_HOST_EVENT_PATH_BYTES);
		truncated ||= memoryPath.truncated || event.candidates.truncated;
		const candidates = event.candidates.items.map((candidate) => {
			const key = truncateUtf8(candidate.key, MAX_MEMORY_HOST_EVENT_PATH_BYTES);
			const candidatePath = truncateUtf8(candidate.path, MAX_MEMORY_HOST_EVENT_PATH_BYTES);
			truncated ||= key.truncated || candidatePath.truncated;
			return {
				key: key.value,
				path: candidatePath.value,
				startLine: candidate.startLine,
				endLine: candidate.endLine,
				score: candidate.score,
				recallCount: candidate.recallCount
			};
		});
		const normalized = {
			type: "memory.promotion.applied",
			timestamp: timestamp.value,
			memoryPath: memoryPath.value,
			applied: event.applied,
			candidates,
			...truncated ? { storageTruncated: true } : {}
		};
		return Buffer.byteLength(JSON.stringify(normalized), "utf8") <= MAX_MEMORY_HOST_EVENT_JSON_BYTES ? normalized : {
			...normalized,
			candidates: [],
			storageTruncated: true
		};
	}
	if (event.type === "memory.dream.completed") {
		const error = event.error ? truncateUtf8(event.error, MAX_MEMORY_HOST_EVENT_TEXT_BYTES) : void 0;
		const inlinePath = event.inlinePath ? truncateUtf8(event.inlinePath, MAX_MEMORY_HOST_EVENT_PATH_BYTES) : void 0;
		const reportPath = event.reportPath ? truncateUtf8(event.reportPath, MAX_MEMORY_HOST_EVENT_PATH_BYTES) : void 0;
		truncated ||= Boolean(error?.truncated || inlinePath?.truncated || reportPath?.truncated);
		return {
			type: event.type,
			timestamp: timestamp.value,
			phase: event.phase,
			...event.outcome ? { outcome: event.outcome } : {},
			...error ? { error: error.value } : {},
			...inlinePath ? { inlinePath: inlinePath.value } : {},
			...reportPath ? { reportPath: reportPath.value } : {},
			lineCount: event.lineCount,
			storageMode: event.storageMode,
			...truncated ? { storageTruncated: true } : {}
		};
	}
	return null;
}
async function registerMemoryHostEvent(params) {
	const event = normalizeMemoryHostEventRecordForStorage(params.event);
	if (!event) throw new TypeError("Memory host event is invalid");
	const workspacePrefix = memoryHostWorkspacePrefix(params.workspaceDir);
	const keyStartInclusive = `${workspacePrefix}:event:`;
	const recordedAt = Date.now();
	const journal = {
		pluginId: MEMORY_HOST_EVENTS_PLUGIN_ID,
		cursorOptions: {
			namespace: MEMORY_HOST_EVENT_CURSORS_NAMESPACE,
			maxEntries: MAX_MEMORY_HOST_EVENT_CURSORS,
			...params.env ? { env: params.env } : {}
		},
		cursorKey: `${workspacePrefix}:cursor`,
		journalOptions: {
			namespace: MEMORY_HOST_EVENTS_NAMESPACE,
			maxEntries: MAX_MEMORY_HOST_EVENTS,
			...params.env ? { env: params.env } : {}
		},
		journalKeyPrefix: `${keyStartInclusive}1:`,
		journalKeyRange: {
			keyStartInclusive,
			keyEndExclusive: `${workspacePrefix}:event;`,
			valueKind: "event"
		},
		journalValue: {
			kind: "event",
			event,
			recordedAt
		}
	};
	await (await import("./plugin-state-store-Bm-w12Xn.mjs")).registerPluginStateSequencedJournalEntry(journal);
}
async function listStoredMemoryHostEvents(params) {
	const limit = Number.isFinite(params.limit) ? Math.max(1, Math.min(MAX_MEMORY_HOST_EVENTS, Math.floor(params.limit))) : MAX_MEMORY_HOST_EVENTS;
	const workspacePrefix = memoryHostWorkspacePrefix(params.workspaceDir);
	const query = {
		pluginId: MEMORY_HOST_EVENTS_PLUGIN_ID,
		namespace: MEMORY_HOST_EVENTS_NAMESPACE,
		keyStartInclusive: `${workspacePrefix}:event:`,
		keyEndExclusive: `${workspacePrefix}:event;`,
		limit,
		order: "desc",
		...params.env ? { env: params.env } : {}
	};
	return (await (await import("./plugin-state-store-Bm-w12Xn.mjs")).pluginStateEntriesInKeyRange(query)).flatMap((entry) => {
		const value = entry.value;
		return value.kind === "event" ? [{
			...entry,
			value
		}] : [];
	}).toReversed();
}
//#endregion
export { normalizeMemoryHostEventRecordForStorage as n, registerMemoryHostEvent as r, listStoredMemoryHostEvents as t };
