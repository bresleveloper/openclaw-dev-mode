import { z } from "zod";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
//#region extensions/voice-call/src/types.ts
const ProviderNameSchema = z.enum([
	"telnyx",
	"twilio",
	"plivo",
	"mock"
]);
const EndReasonSchema = z.enum([
	"completed",
	"hangup-user",
	"hangup-bot",
	"timeout",
	"error",
	"failed",
	"no-answer",
	"busy",
	"voicemail"
]);
const CallStateSchema = z.enum([
	"initiated",
	"ringing",
	"answered",
	"active",
	"speaking",
	"listening",
	...EndReasonSchema.options
]);
const TerminalStates = new Set(EndReasonSchema.options);
const CallDirectionSchema = z.enum(["outbound", "inbound"]);
const TranscriptEntrySchema = z.object({
	timestamp: z.number(),
	speaker: z.enum(["bot", "user"]),
	text: z.string(),
	isFinal: z.boolean().default(true)
});
const CallRecordSchema = z.object({
	callId: z.string(),
	providerCallId: z.string().optional(),
	provider: ProviderNameSchema,
	direction: CallDirectionSchema,
	state: CallStateSchema,
	from: z.string(),
	to: z.string(),
	sessionKey: z.string().optional(),
	/** Agent selected when the call was created. Optional for legacy records. */
	agentId: z.string().optional(),
	startedAt: z.number(),
	answeredAt: z.number().optional(),
	endedAt: z.number().optional(),
	endReason: EndReasonSchema.optional(),
	transcript: z.array(TranscriptEntrySchema).default([]),
	processedEventIds: z.array(z.string()).default([]),
	metadata: z.record(z.string(), z.unknown()).optional()
});
//#endregion
//#region extensions/voice-call/src/runtime-state.ts
const { setRuntime: setVoiceCallStateRuntime, tryGetRuntime: getOptionalVoiceCallStateRuntime } = createPluginRuntimeStore({
	pluginId: "voice-call-state",
	errorMessage: "Voice Call state runtime not initialized"
});
//#endregion
//#region extensions/voice-call/src/manager/replay-keys.ts
/** Match the existing voice-call webhook replay-cache cardinality. */
const MAX_MANAGER_REPLAY_KEYS = 1e4;
function pruneOldestEntries(keys, maxEntries) {
	while (keys.size > maxEntries) {
		const oldest = keys.keys().next().value;
		if (oldest === void 0) break;
		keys.delete(oldest);
	}
}
/** Remember one manager replay key without refreshing duplicate insertion order. */
function rememberManagerReplayKey(keys, key, maxEntries = MAX_MANAGER_REPLAY_KEYS) {
	keys.add(key);
	pruneOldestEntries(keys, maxEntries);
}
/** Append one per-call replay key and retain only the newest bounded suffix. */
function appendCallReplayKey(keys, key, maxEntries = 500) {
	keys.push(key);
	trimCallReplayKeys(keys, maxEntries);
}
/** Normalize restored or externally constructed call replay history in place. */
function trimCallReplayKeys(keys, maxEntries = 500) {
	const overflow = keys.length - maxEntries;
	if (overflow > 0) keys.splice(0, overflow);
}
/**
* Reserve one rejected provider call. The token prevents a stale failed
* hangup from deleting a newer reservation after bounded eviction and reuse.
*/
function reserveRejectedProviderCall(calls, providerCallId, maxEntries = MAX_MANAGER_REPLAY_KEYS) {
	if (calls.has(providerCallId)) return;
	const reservation = Symbol(providerCallId);
	calls.set(providerCallId, reservation);
	pruneOldestEntries(calls, maxEntries);
	return reservation;
}
/** Release a rejected-call reservation only when the failing attempt still owns it. */
function releaseRejectedProviderCall(calls, providerCallId, reservation) {
	if (calls.get(providerCallId) === reservation) calls.delete(providerCallId);
}
//#endregion
//#region extensions/voice-call/src/manager/store.ts
/** Plugin state namespace for call record event metadata. */
const CALL_RECORD_EVENTS_NAMESPACE = "call-record-events";
/** Plugin state namespace for base64 call record event chunks. */
const CALL_RECORD_EVENT_CHUNKS_NAMESPACE = "call-record-event-chunks";
/** Maximum retained call record events. */
const MAX_CALL_RECORD_EVENTS = 1e3;
/** Extra metadata entries retained so pruning can safely trim oldest rows. */
const CALL_RECORD_EVENT_META_MAX_ENTRIES = 1100;
/** Maximum chunks allowed for one persisted call record event. */
const MAX_CHUNKS_PER_CALL_RECORD_EVENT = 48;
const CALL_RECORD_CHUNK_MAX_ENTRIES = 48048;
/** Raw UTF-8 bytes stored per call record chunk before base64 encoding. */
const RAW_CALL_RECORD_CHUNK_BYTES = 48128;
const CALL_RECORD_READ_BATCH_KEYS = 128;
let callRecordEventSequence = 0;
/** Return the pre-SQLite JSONL call log path for migration/compat checks. */
function resolveVoiceCallLegacyCallLogPath(storePath) {
	return path.join(storePath, "calls.jsonl");
}
/** Build env for plugin state stores rooted at the voice-call store path. */
function resolvePluginStateEnv(storePath) {
	return {
		...process.env,
		OPENCLAW_STATE_DIR: storePath
	};
}
/** Open the plugin state stores when the runtime is available. */
function createCallRecordStateStores(storePath, stateRuntime) {
	const runtime = stateRuntime ? { state: stateRuntime } : getOptionalVoiceCallStateRuntime();
	if (!runtime) throw new Error("Voice Call state runtime not initialized");
	const env = resolvePluginStateEnv(storePath);
	return {
		events: runtime.state.openKeyedStore({
			namespace: CALL_RECORD_EVENTS_NAMESPACE,
			maxEntries: CALL_RECORD_EVENT_META_MAX_ENTRIES,
			env
		}),
		chunks: runtime.state.openKeyedStore({
			namespace: CALL_RECORD_EVENT_CHUNKS_NAMESPACE,
			maxEntries: CALL_RECORD_CHUNK_MAX_ENTRIES,
			env
		})
	};
}
/** Open call stores and log failures instead of breaking restore paths. */
function tryCreateCallRecordStateStores(storePath, stateRuntime) {
	try {
		return createCallRecordStateStores(storePath, stateRuntime);
	} catch (err) {
		console.error("[voice-call] Failed to open SQLite call record store:", err);
		return null;
	}
}
/** Build the stable storage key for one chunk of an event. */
function buildChunkKey(eventKey, index) {
	return `${eventKey}:chunk:${String(index).padStart(4, "0")}`;
}
/** Build a deterministic key for one legacy JSONL line. */
function buildVoiceCallLegacyJsonlEventKey(line, index) {
	return `jsonl:${String(index).padStart(8, "0")}:${createHash("sha256").update(line).digest("hex")}`;
}
/** Allocate monotonic ordering metadata for newly persisted call records. */
function nextCallRecordOrder() {
	const sequence = callRecordEventSequence;
	callRecordEventSequence = (callRecordEventSequence + 1) % 1e6;
	return {
		persistedAt: Date.now(),
		sequence
	};
}
/** Build a unique event key that preserves timestamp and sequence ordering. */
function buildNewEventKey(order) {
	return `event:${order.persistedAt.toString(36)}:${String(order.sequence).padStart(6, "0")}:${randomUUID()}`;
}
/** Recover the sequence segment from newer event keys. */
function parseEventKeySequence(key) {
	const sequence = /^event:[^:]+:(\d+):/.exec(key)?.[1];
	return sequence ? Number.parseInt(sequence, 10) : 0;
}
/** Parse a stored call record line from v2 envelope or legacy raw-call JSON. */
function parseVoiceCallRecordLine(line, sequence = 0) {
	if (!line.trim()) return null;
	try {
		const parsed = JSON.parse(line);
		if (parsed && typeof parsed === "object" && parsed.version === 2) {
			const envelope = parsed;
			return {
				call: CallRecordSchema.parse(envelope.call),
				persistedAt: typeof envelope.persistedAt === "number" && Number.isFinite(envelope.persistedAt) ? envelope.persistedAt : 0,
				sequence: typeof envelope.sequence === "number" && Number.isFinite(envelope.sequence) ? envelope.sequence : sequence,
				orderKey: ""
			};
		}
		return {
			call: CallRecordSchema.parse(parsed),
			persistedAt: 0,
			sequence,
			orderKey: ""
		};
	} catch {
		return null;
	}
}
/** Count storage chunks needed for a call record. */
function countCallRecordChunks(call) {
	return Math.max(1, Math.ceil(Buffer.byteLength(JSON.stringify(call), "utf8") / RAW_CALL_RECORD_CHUNK_BYTES));
}
/** Truncate oversized call records to fit the bounded plugin state chunk budget. */
function prepareVoiceCallRecordForStorage(call) {
	let boundedCall = call;
	if (call.processedEventIds.length > 500) {
		boundedCall = {
			...call,
			processedEventIds: [...call.processedEventIds]
		};
		trimCallReplayKeys(boundedCall.processedEventIds);
	}
	if (countCallRecordChunks(boundedCall) <= MAX_CHUNKS_PER_CALL_RECORD_EVENT) return boundedCall;
	const transcriptEntries = boundedCall.transcript.length;
	const metadata = {
		...boundedCall.metadata,
		voiceCallPersistence: {
			transcriptTruncated: true,
			originalTranscriptEntries: transcriptEntries
		}
	};
	const candidateInputs = [
		{
			transcript: call.transcript.slice(-20),
			metadata
		},
		{
			transcript: [],
			metadata
		},
		{
			transcript: [],
			metadata: { voiceCallPersistence: {
				transcriptTruncated: true,
				originalTranscriptEntries: transcriptEntries,
				metadataTruncated: true
			} }
		}
	];
	for (const candidateInput of candidateInputs) {
		const candidate = CallRecordSchema.parse({
			...boundedCall,
			...candidateInput
		});
		if (countCallRecordChunks(candidate) <= MAX_CHUNKS_PER_CALL_RECORD_EVENT) return candidate;
	}
	return boundedCall;
}
/** Encode one bounded record; chunks are produced only when requested by the writer. */
function encodeCallRecordEvent(call) {
	const serialized = JSON.stringify(prepareVoiceCallRecordForStorage(call));
	const buffer = Buffer.from(serialized, "utf8");
	const chunkCount = Math.max(1, Math.ceil(buffer.byteLength / RAW_CALL_RECORD_CHUNK_BYTES));
	if (chunkCount > MAX_CHUNKS_PER_CALL_RECORD_EVENT) throw new Error(`voice-call record exceeds SQLite chunk limit (${chunkCount}/${MAX_CHUNKS_PER_CALL_RECORD_EVENT})`);
	return {
		meta: {
			chunkCount,
			byteLength: buffer.byteLength
		},
		chunk(index) {
			return {
				index,
				dataBase64: buffer.subarray(index * RAW_CALL_RECORD_CHUNK_BYTES, (index + 1) * RAW_CALL_RECORD_CHUNK_BYTES).toString("base64")
			};
		}
	};
}
/** Register a serialized call record event and its chunks, then prune old events. */
async function registerCallRecordEvent(stores, eventKey, call, order) {
	const encoded = encodeCallRecordEvent(call);
	for (let index = 0; index < encoded.meta.chunkCount; index += 1) await stores.chunks.register(buildChunkKey(eventKey, index), encoded.chunk(index));
	await stores.events.register(eventKey, {
		...encoded.meta,
		persistedAt: order.persistedAt,
		sequence: order.sequence
	});
	await pruneCallRecordEvents(stores);
}
/** Delete metadata and all chunk rows for one call record event. */
async function deleteCallRecordEventRows(stores, eventKey) {
	const meta = await stores.events.lookup(eventKey);
	await stores.events.delete(eventKey);
	if (!meta) return;
	for (let index = 0; index < meta.chunkCount; index += 1) await stores.chunks.delete(buildChunkKey(eventKey, index));
}
/** Keep only the newest bounded call record events. */
async function pruneCallRecordEvents(stores) {
	if (stores.events.count && await stores.events.count() <= 1e3) return;
	const rows = await stores.events.entries();
	if (rows.length <= 1e3) return;
	const sorted = rows.toSorted((a, b) => a.createdAt - b.createdAt || a.key.localeCompare(b.key));
	for (const row of sorted.slice(0, rows.length - MAX_CALL_RECORD_EVENTS)) await deleteCallRecordEventRows(stores, row.key);
}
function isValidCallRecordChunkCount(chunkCount) {
	return Number.isSafeInteger(chunkCount) && chunkCount >= 1 && chunkCount <= MAX_CHUNKS_PER_CALL_RECORD_EVENT;
}
/** Read and reassemble one chunked call record event. */
async function readCallRecordEvent(stores, eventKey, meta, records) {
	if (!isValidCallRecordChunkCount(meta.chunkCount)) return null;
	const chunks = [];
	for (let index = 0; index < meta.chunkCount; index += 1) {
		const result = records?.[index];
		if (result && !result.ok) throw result.error;
		const chunk = records ? result?.value : await stores.chunks.lookup(buildChunkKey(eventKey, index));
		if (!chunk || chunk.index !== index) return null;
		chunks.push(Buffer.from(chunk.dataBase64, "base64"));
	}
	return parseVoiceCallRecordLine(Buffer.concat(chunks, meta.byteLength).toString("utf8"))?.call ?? null;
}
/** Read all persisted call records in stable persisted order. */
async function readCallRecordEvents(stores) {
	const entries = (await stores.events.entries()).toSorted((a, b) => a.createdAt - b.createdAt || a.key.localeCompare(b.key));
	const sqliteCalls = [];
	let batchEnd = 0;
	let chunkOffset = 0;
	let chunkRecords;
	for (const [entryIndex, entry] of entries.entries()) {
		if (entryIndex >= batchEnd && stores.chunks.lookupMany) {
			const keys = [];
			for (let next = entryIndex;; next++) {
				const row = entries[next];
				if (!row) break;
				const chunkCount = row.value?.chunkCount;
				if (!isValidCallRecordChunkCount(chunkCount) || keys.length + chunkCount > CALL_RECORD_READ_BATCH_KEYS) break;
				for (let index = 0; index < chunkCount; index++) keys.push(buildChunkKey(row.key, index));
				batchEnd = next + 1;
			}
			chunkRecords = keys.length > 0 ? await stores.chunks.lookupMany(keys) : void 0;
			chunkOffset = 0;
		}
		const records = chunkRecords?.slice(chunkOffset, chunkOffset + entry.value.chunkCount);
		const call = await readCallRecordEvent(stores, entry.key, entry.value, records);
		if (chunkRecords) chunkOffset += entry.value.chunkCount;
		if (call) sqliteCalls.push({
			call,
			persistedAt: entry.value.persistedAt ?? entry.createdAt,
			sequence: entry.value.sequence ?? parseEventKeySequence(entry.key),
			orderKey: entry.key
		});
	}
	return sqliteCalls.toSorted((a, b) => a.persistedAt - b.persistedAt || a.sequence - b.sequence || a.orderKey.localeCompare(b.orderKey)).map((entry) => entry.call);
}
/** Persist one call record event to plugin state. */
async function persistCallRecord(storePath, call, stateRuntime) {
	try {
		const stores = createCallRecordStateStores(storePath, stateRuntime);
		const order = nextCallRecordOrder();
		await registerCallRecordEvent(stores, buildNewEventKey(order), call, order);
	} catch (err) {
		console.error("[voice-call] Failed to persist call record:", err);
		throw err;
	}
}
/** Restore nonterminal active calls and provider/event indexes from persisted records. */
async function loadActiveCallsFromStore(storePath, stateRuntime) {
	const stores = tryCreateCallRecordStateStores(storePath, stateRuntime);
	let calls = [];
	try {
		calls = stores ? await readCallRecordEvents(stores) : [];
	} catch (err) {
		console.error("[voice-call] Failed to read SQLite call records:", err);
	}
	if (calls.length === 0) return {
		activeCalls: /* @__PURE__ */ new Map(),
		providerCallIdMap: /* @__PURE__ */ new Map(),
		processedEventIds: /* @__PURE__ */ new Set()
	};
	const callMap = /* @__PURE__ */ new Map();
	for (const call of calls) {
		callMap.delete(call.callId);
		callMap.set(call.callId, call);
	}
	const activeCalls = /* @__PURE__ */ new Map();
	const providerCallIdMap = /* @__PURE__ */ new Map();
	const processedEventIds = /* @__PURE__ */ new Set();
	for (const [callId, call] of callMap) {
		trimCallReplayKeys(call.processedEventIds);
		for (const eventId of call.processedEventIds) rememberManagerReplayKey(processedEventIds, eventId);
		if (TerminalStates.has(call.state)) continue;
		activeCalls.set(callId, call);
		if (call.providerCallId) providerCallIdMap.set(call.providerCallId, callId);
	}
	return {
		activeCalls,
		providerCallIdMap,
		processedEventIds
	};
}
async function readCallHistoryFromStore(storePath, stateRuntime) {
	const stores = tryCreateCallRecordStateStores(storePath, stateRuntime);
	if (stores) try {
		return await readCallRecordEvents(stores);
	} catch (err) {
		console.error("[voice-call] Failed to read SQLite call history:", err);
	}
	return [];
}
/** Resolve an internal ID or retained provider alias to its newest logical call snapshot. */
async function findCallInStore(storePath, callId, stateRuntime) {
	const calls = await readCallRecordEvents(createCallRecordStateStores(storePath, stateRuntime));
	const match = calls.findLast((call) => call.callId === callId) ?? calls.findLast((call) => call.providerCallId === callId);
	return match ? calls.findLast((call) => call.callId === match.callId) : void 0;
}
/** Return the newest persisted call history rows up to the requested limit. */
async function getCallHistoryFromStore(storePath, limit = 50, stateRuntime) {
	if (limit <= 0) return [];
	return (await readCallHistoryFromStore(storePath, stateRuntime)).slice(-limit);
}
//#endregion
//#region extensions/voice-call/src/store-path.ts
/** Resolve the plugin-owned store below OpenClaw's canonical state directory. */
function resolveDefaultVoiceCallStoreDir(env = process.env) {
	return path.join(resolveStateDir(env), "voice-calls");
}
//#endregion
export { releaseRejectedProviderCall as _, CALL_RECORD_EVENT_META_MAX_ENTRIES as a, setVoiceCallStateRuntime as b, buildVoiceCallLegacyJsonlEventKey as c, getCallHistoryFromStore as d, loadActiveCallsFromStore as f, appendCallReplayKey as g, resolveVoiceCallLegacyCallLogPath as h, CALL_RECORD_EVENT_CHUNKS_NAMESPACE as i, encodeCallRecordEvent as l, persistCallRecord as m, CALL_RECORD_CHUNK_MAX_ENTRIES as n, MAX_CALL_RECORD_EVENTS as o, parseVoiceCallRecordLine as p, CALL_RECORD_EVENTS_NAMESPACE as r, buildChunkKey as s, resolveDefaultVoiceCallStoreDir as t, findCallInStore as u, rememberManagerReplayKey as v, TerminalStates as x, reserveRejectedProviderCall as y };
