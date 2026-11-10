import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { Et as _enum, Jn as string, Nt as array, Pn as number, Sn as looseObject, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { o as getNodeSqliteKysely, p as sql, t as compileSqliteQueryBindings } from "./kysely-sync-9fPQaMlh.mjs";
import { o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as BoundedSerialQueue } from "./bounded-serial-queue-DwVtVuRa.mjs";
//#region src/talk/voice-transcript.ts
/** Transcript row identity shared by persistence and live relay captions. */
function voiceTranscriptEventId(voiceSessionId, entryId) {
	return `voice:${voiceSessionId}:${entryId}`;
}
function buildPersistedVoiceMessage(params) {
	const provenance = {
		kind: "realtime_voice",
		sourceChannel: "talk"
	};
	if (params.role === "user") return {
		role: "user",
		content: [{
			type: "text",
			text: params.text
		}],
		timestamp: params.timestamp,
		provenance
	};
	return {
		role: "assistant",
		content: [{
			type: "text",
			text: params.text
		}],
		api: "realtime",
		provider: params.provider,
		model: "realtime-voice",
		stopReason: "stop",
		timestamp: params.timestamp,
		provenance
	};
}
const VOICE_TRANSCRIPT_MAX_CHARS = 8e3;
const VOICE_TRANSCRIPT_QUEUE_MAX_PENDING = 40;
const VOICE_TRANSCRIPT_QUEUE_MAX_PENDING_CHARS = VOICE_TRANSCRIPT_QUEUE_MAX_PENDING * VOICE_TRANSCRIPT_MAX_CHARS;
const VOICE_TRANSCRIPT_QUEUE_OVERFLOW_MESSAGE = "Voice transcript persistence could not keep up; the realtime session was stopped.";
function normalizeVoiceTranscriptText(text) {
	return truncateUtf16Safe(text.trim(), VOICE_TRANSCRIPT_MAX_CHARS);
}
const VOICE_TRANSCRIPT_QUEUE_POLICY = {
	maxPendingCount: VOICE_TRANSCRIPT_QUEUE_MAX_PENDING,
	maxEntryChars: VOICE_TRANSCRIPT_MAX_CHARS,
	overflowMessage: VOICE_TRANSCRIPT_QUEUE_OVERFLOW_MESSAGE,
	createQueue: () => new BoundedSerialQueue({
		maxPendingCount: VOICE_TRANSCRIPT_QUEUE_MAX_PENDING,
		maxPendingWeight: VOICE_TRANSCRIPT_QUEUE_MAX_PENDING_CHARS
	})
};
var VoiceTranscriptOperationRegistry = class {
	constructor() {
		this.owners = /* @__PURE__ */ new Map();
	}
	getOrCreate(key) {
		const existing = this.owners.get(key);
		if (existing) return existing;
		const created = { queue: VOICE_TRANSCRIPT_QUEUE_POLICY.createQueue() };
		this.owners.set(key, created);
		return created;
	}
	cleanup(key, owner) {
		if (this.owners.get(key) === owner && !owner.closePromise && owner.queue.isIdle && !owner.queue.didOverflow) this.owners.delete(key);
	}
	async run(key, operation, options = {}) {
		const owner = this.getOrCreate(key);
		if (owner.closePromise) throw new Error("voice transcript persistence session is closing");
		const admission = owner.queue.enqueue(operation, options);
		if (admission.accepted) {
			admission.completion.then(() => this.cleanup(key, owner), () => this.cleanup(key, owner));
			return await admission.completion;
		}
		throw new Error(owner.queue.didOverflow ? "voice transcript persistence queue capacity exceeded" : "voice transcript persistence session is closed");
	}
	async close(key, operation) {
		const owner = this.getOrCreate(key);
		if (!owner.closePromise) {
			owner.queue.seal();
			owner.closePromise = owner.queue.flush({ requireSuccess: true }).then(operation);
		}
		try {
			await owner.closePromise;
		} finally {
			if (this.owners.get(key) === owner) this.owners.delete(key);
		}
	}
	async flush(key) {
		await this.owners.get(key)?.queue.flush({ requireSuccess: true });
	}
	clear() {
		this.owners.clear();
	}
};
//#endregion
//#region src/talk/client-voice-session-store.ts
const VOICE_SESSION_CACHE_SCOPE = "talk-client-voice-sessions";
const VOICE_SESSION_STALE_AFTER_MS = 216e5;
const TRANSCRIPT_FAILURE_KEY_PATTERN = /^[0-9a-f]{64}$/;
const clientVoiceToolEffectSchema = looseObject({
	runId: string(),
	toolName: string(),
	startedAt: number(),
	status: _enum([
		"started",
		"succeeded",
		"failed",
		"cancelled",
		"blocked"
	])
});
const clientVoiceSessionRecordSchema = looseObject({
	version: literal(1),
	voiceSessionId: string(),
	agentId: string(),
	sessionKey: string(),
	provider: string().refine((value) => value.trim().length > 0).transform((value) => value.trim()).optional(),
	origin: _enum(["client", "relay"]),
	status: _enum(["open", "closed"]),
	createdAt: number(),
	updatedAt: number(),
	consultRunIds: unknown().optional().transform((value) => Array.isArray(value) ? value.filter((entry) => typeof entry === "string") : []),
	effects: unknown().optional().transform((value) => Array.isArray(value) ? value.flatMap((entry) => {
		const parsed = clientVoiceToolEffectSchema.safeParse(entry);
		return parsed.success ? [parsed.data] : [];
	}) : []),
	transcriptFailureKeys: unknown().optional().transform((value) => value ?? []).pipe(array(string().regex(TRANSCRIPT_FAILURE_KEY_PATTERN)).max(41).refine((keys) => new Set(keys).size === keys.length))
});
function parseStoredVoiceSessionRecord(valueJson) {
	if (typeof valueJson !== "string") return;
	try {
		const parsed = clientVoiceSessionRecordSchema.safeParse(JSON.parse(valueJson));
		return parsed.success ? parsed.data : void 0;
	} catch {
		return;
	}
}
function readVoiceSessionRecord(agentId, voiceSessionId, options) {
	return readVoiceSessionRecordInTransaction(openOpenClawAgentDatabase({
		...options,
		agentId
	}), voiceSessionId);
}
function voiceSessionRowsQuery(database) {
	return getNodeSqliteKysely(database.db).selectFrom("cache_entries").select("value_json").where("scope", "=", sql.lit(VOICE_SESSION_CACHE_SCOPE));
}
function readVoiceSessionRecordInTransaction(database, voiceSessionId) {
	const { compiled, bind } = compileSqliteQueryBindings(() => voiceSessionRowsQuery(database).where("key", "=", voiceSessionId));
	return parseStoredVoiceSessionRecord(database.db.prepare(compiled.sql).get(...bind())?.value_json);
}
/** Synchronous tool policy reads the current record without a separate freshness probe. */
function readVoiceSessionFacts(agentId, voiceSessionId, options) {
	const record = readVoiceSessionRecord(agentId, voiceSessionId, options);
	return record && Object.freeze({
		agentId: record.agentId,
		sessionKey: record.sessionKey,
		origin: record.origin,
		status: record.status,
		transcriptCapable: record.transcriptCapable,
		hasUserTranscript: record.hasUserTranscript
	});
}
function readOwnedVoiceSessionFacts(params, options) {
	const record = readVoiceSessionFacts(params.agentId, params.voiceSessionId, options);
	if (!record) throw new Error("voice session not found");
	assertVoiceSessionOwnership(record, params);
	return record;
}
function writeVoiceSessionRecordInTransaction(database, record) {
	const { compiled, bind } = compileSqliteQueryBindings((p) => getNodeSqliteKysely(database.db).insertInto("cache_entries").values({
		scope: VOICE_SESSION_CACHE_SCOPE,
		key: p((value) => value.voiceSessionId),
		value_json: p((value) => JSON.stringify(value)),
		blob: null,
		expires_at: null,
		updated_at: p((value) => value.updatedAt)
	}).onConflict((conflict) => conflict.columns(["scope", "key"]).doUpdateSet((eb) => ({
		value_json: eb.ref("excluded.value_json"),
		updated_at: eb.ref("excluded.updated_at")
	}))));
	database.db.prepare(compiled.sql).run(...bind(record));
}
function assertVoiceSessionOwnership(record, params) {
	if (record.agentId !== params.agentId || record.sessionKey !== params.sessionKey) throw new Error("voice session does not belong to this agent session");
}
function operationKey(agentId, voiceSessionId) {
	return `${agentId}\0${voiceSessionId}`;
}
//#endregion
export { readOwnedVoiceSessionFacts as a, voiceSessionRowsQuery as c, VoiceTranscriptOperationRegistry as d, buildPersistedVoiceMessage as f, parseStoredVoiceSessionRecord as i, writeVoiceSessionRecordInTransaction as l, voiceTranscriptEventId as m, assertVoiceSessionOwnership as n, readVoiceSessionRecord as o, normalizeVoiceTranscriptText as p, operationKey as r, readVoiceSessionRecordInTransaction as s, VOICE_SESSION_STALE_AFTER_MS as t, VOICE_TRANSCRIPT_QUEUE_POLICY as u };
