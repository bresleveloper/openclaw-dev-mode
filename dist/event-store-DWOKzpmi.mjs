import { ni as NEVER } from "./json-schema-processors-C6KO_BFy.mjs";
import { Et as _enum, Jn as string, Nt as array, Pn as number, Sn as looseObject, Yt as discriminatedUnion, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import { c as resolveWorkspaceStateIdentity } from "./workspace-state-identity-hZ7UINpz.mjs";
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
const memoryHostSkippedRecallResultSchema = memoryHostRecallResultSchema.extend({ reason: literal("non-short-term-memory-path") });
const memoryHostPromotionCandidateSchema = looseObject({
	key: string(),
	path: string(),
	startLine: memoryHostFiniteNumberSchema,
	endLine: memoryHostFiniteNumberSchema,
	score: memoryHostFiniteNumberSchema,
	recallCount: memoryHostFiniteNumberSchema
});
function boundedEventItems(itemSchema, message) {
	const itemsSchema = array(itemSchema);
	return array(unknown()).transform((values, context) => {
		const parsed = itemsSchema.safeParse(values.slice(0, MAX_MEMORY_HOST_EVENT_ITEMS));
		if (!parsed.success) {
			context.addIssue({
				code: "custom",
				message
			});
			return NEVER;
		}
		return {
			items: parsed.data,
			truncated: values.length > MAX_MEMORY_HOST_EVENT_ITEMS
		};
	});
}
const memoryHostEventRecordSchema = discriminatedUnion("type", [
	looseObject({
		type: literal("memory.recall.recorded"),
		timestamp: string(),
		storageTruncated: unknown().optional(),
		query: string(),
		resultCount: memoryHostFiniteNumberSchema,
		results: boundedEventItems(memoryHostRecallResultSchema, "invalid recall result")
	}),
	looseObject({
		type: literal("memory.recall.skipped"),
		timestamp: string(),
		storageTruncated: unknown().optional(),
		query: string(),
		reason: literal("non-short-term-memory-path"),
		eligibleResultCount: memoryHostFiniteNumberSchema,
		skippedResultCount: memoryHostFiniteNumberSchema,
		results: boundedEventItems(memoryHostSkippedRecallResultSchema, "invalid skipped recall result")
	}),
	looseObject({
		type: literal("memory.promotion.applied"),
		timestamp: string(),
		storageTruncated: unknown().optional(),
		memoryPath: string(),
		applied: memoryHostFiniteNumberSchema,
		candidates: boundedEventItems(memoryHostPromotionCandidateSchema, "invalid promotion candidate")
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
	return sha256HexPrefixCore(normalizeMemoryHostWorkspaceKey(workspaceDir), WORKSPACE_HASH_BYTES);
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
	let truncated = event.storageTruncated === true;
	const boundText = (text, maxBytes) => {
		const bounded = truncateUtf8(text, maxBytes);
		truncated ||= bounded.truncated;
		return bounded.value;
	};
	const timestamp = boundText(event.timestamp, 128);
	if (event.type === "memory.recall.recorded" || event.type === "memory.recall.skipped") {
		const query = boundText(event.query, MAX_MEMORY_HOST_EVENT_TEXT_BYTES);
		truncated ||= event.results.truncated;
		const results = event.results.items.map((result) => {
			return {
				path: boundText(result.path, MAX_MEMORY_HOST_EVENT_PATH_BYTES),
				startLine: result.startLine,
				endLine: result.endLine,
				score: result.score
			};
		});
		const normalized = event.type === "memory.recall.recorded" ? {
			type: "memory.recall.recorded",
			timestamp,
			query,
			resultCount: event.resultCount,
			results,
			...truncated ? { storageTruncated: true } : {}
		} : {
			type: "memory.recall.skipped",
			timestamp,
			query,
			reason: "non-short-term-memory-path",
			eligibleResultCount: event.eligibleResultCount,
			skippedResultCount: event.skippedResultCount,
			results: results.map((result) => Object.assign(result, { reason: "non-short-term-memory-path" })),
			...truncated ? { storageTruncated: true } : {}
		};
		return Buffer.byteLength(JSON.stringify(normalized), "utf8") <= MAX_MEMORY_HOST_EVENT_JSON_BYTES ? normalized : {
			...normalized,
			results: [],
			storageTruncated: true
		};
	}
	if (event.type === "memory.promotion.applied") {
		const memoryPath = boundText(event.memoryPath, MAX_MEMORY_HOST_EVENT_PATH_BYTES);
		truncated ||= event.candidates.truncated;
		const candidates = event.candidates.items.map((candidate) => {
			return {
				key: boundText(candidate.key, MAX_MEMORY_HOST_EVENT_PATH_BYTES),
				path: boundText(candidate.path, MAX_MEMORY_HOST_EVENT_PATH_BYTES),
				startLine: candidate.startLine,
				endLine: candidate.endLine,
				score: candidate.score,
				recallCount: candidate.recallCount
			};
		});
		const normalized = {
			type: "memory.promotion.applied",
			timestamp,
			memoryPath,
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
	const error = event.error ? boundText(event.error, MAX_MEMORY_HOST_EVENT_TEXT_BYTES) : void 0;
	const inlinePath = event.inlinePath ? boundText(event.inlinePath, MAX_MEMORY_HOST_EVENT_PATH_BYTES) : void 0;
	const reportPath = event.reportPath ? boundText(event.reportPath, MAX_MEMORY_HOST_EVENT_PATH_BYTES) : void 0;
	return {
		type: event.type,
		timestamp,
		phase: event.phase,
		...event.outcome ? { outcome: event.outcome } : {},
		...error ? { error } : {},
		...inlinePath ? { inlinePath } : {},
		...reportPath ? { reportPath } : {},
		lineCount: event.lineCount,
		storageMode: event.storageMode,
		...truncated ? { storageTruncated: true } : {}
	};
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
	await (await import("./plugin-state-store-BLIitk7W.mjs")).registerPluginStateSequencedJournalEntry(journal);
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
	return (await (await import("./plugin-state-store-BLIitk7W.mjs")).pluginStateEntriesInKeyRange(query)).flatMap((entry) => {
		const value = entry.value;
		return value.kind === "event" ? [{
			...entry,
			value
		}] : [];
	}).toReversed();
}
//#endregion
export { normalizeMemoryHostEventRecordForStorage as n, registerMemoryHostEvent as r, listStoredMemoryHostEvents as t };
