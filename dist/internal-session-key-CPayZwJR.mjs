import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getNodeSqliteKysely, c as prepareSqliteQuerySync, l as prepareSqliteQueryTakeFirstSync, n as createSqliteQueryCache, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { a as readSqliteDataVersion, i as readSqliteCacheDataVersion, n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { g as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import "./openclaw-agent-db-contract-ClUH-Vmp.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { r as SessionParticipantIdentitySchema } from "./session-participant-CA6bsNes.mjs";
import { Compile } from "typebox/schema";
//#region src/config/sessions/session-accessor.sqlite-entry-revision.ts
const sessionNodesGenerationTrackerSchemaVersions = /* @__PURE__ */ new WeakMap();
const generationQuery = createSqliteQueryCache((database) => prepareSqliteQueryTakeFirstSync(database, () => getNodeSqliteKysely(database).withSchema("temp").selectFrom("openclaw_session_nodes_cache_generation").select("generation").where("id", "=", 1)));
function ensureSessionNodesGenerationTracker(database) {
	const schema = getAdmittedSqliteSchemaFacts(database);
	if (!schema) throw new Error("SQLite session entry caching requires admitted schema facts");
	const { schemaVersion } = schema;
	const trackedSchemaVersion = sessionNodesGenerationTrackerSchemaVersions.get(database);
	if (trackedSchemaVersion === schemaVersion) return;
	const hasParticipants = schema.tables.has("session_participants");
	database.exec(`
    CREATE TEMP TABLE IF NOT EXISTS openclaw_session_nodes_cache_generation (id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1), generation INTEGER NOT NULL) STRICT;
    INSERT OR IGNORE INTO openclaw_session_nodes_cache_generation (id, generation) VALUES (1, 0);
    ${trackedSchemaVersion === void 0 ? "" : "UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1;"}
    ${["session_nodes", "session_participants"].map((table) => {
		const operations = [
			"insert",
			"update",
			"delete"
		];
		const drop = operations.map((operation) => `DROP TRIGGER IF EXISTS openclaw_${table}_cache_generation_${operation};`);
		const create = table === "session_nodes" || hasParticipants ? operations.map((operation) => `CREATE TEMP TRIGGER openclaw_${table}_cache_generation_${operation}
              AFTER ${operation.toUpperCase()} ON main.${table} BEGIN UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;`) : [];
		return [...drop, ...create].join("\n");
	}).join("\n")}
  `);
	if (!database.isTransaction) sessionNodesGenerationTrackerSchemaVersions.set(database, schemaVersion);
	else stageSqliteTransactionState(database, {
		stage: () => sessionNodesGenerationTrackerSchemaVersions.set(database, schemaVersion),
		rollback: () => sessionNodesGenerationTrackerSchemaVersions.delete(database),
		commit: () => {}
	});
}
function readSessionNodesGeneration(database) {
	ensureSessionNodesGenerationTracker(database);
	const row = generationQuery(database)();
	if (typeof row?.generation !== "number") throw new Error("SQLite session_nodes cache generation is unavailable");
	return row.generation;
}
function readSessionEntryCacheValidityToken(database, mode = "fresh") {
	return {
		dataVersion: mode === "cached" ? readSqliteCacheDataVersion(database) : readSqliteDataVersion(database),
		sessionNodesGeneration: readSessionNodesGeneration(database)
	};
}
function cacheValidityTokensEqual(left, right) {
	return left.dataVersion === right.dataVersion && left.sessionNodesGeneration === right.sessionNodesGeneration;
}
var SessionEntryRevisionConflictError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "invalid_state";
	}
};
/** Reuse prepared facts until this connection observes a write, then compare only their predicate. */
function createSessionEntryRevisionGuard(database, assertSourceCurrent, matches) {
	let verified;
	return () => {
		assertSourceCurrent();
		const before = readSessionEntryCacheValidityToken(database);
		if (verified && cacheValidityTokensEqual(verified, before)) {
			assertSourceCurrent();
			return;
		}
		verified = void 0;
		if (!matches()) throw new SessionEntryRevisionConflictError("Prepared session entry facts are no longer current");
		const after = readSessionEntryCacheValidityToken(database);
		assertSourceCurrent();
		if (!cacheValidityTokensEqual(before, after)) throw new SessionEntryRevisionConflictError("Session entry facts changed during their mutation check");
		if (!database.isTransaction) verified = after;
		else stageSqliteTransactionState(database, {
			stage: () => {
				verified = after;
			},
			rollback: () => {
				verified = void 0;
			},
			commit: () => {}
		});
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-cache-state.ts
const sessionEntryCaches = /* @__PURE__ */ new WeakMap();
function publishTrackedCacheUpdate(database, publish, stage) {
	let settle;
	if (stageSqliteTransactionState(database.db, {
		stage: () => {
			settle = stage?.();
		},
		rollback: () => settle?.(),
		commit: () => {
			try {
				publish();
			} finally {
				settle?.();
			}
		}
	})) return true;
	if (database.db.isTransaction) throw new Error("SQLite session entry writes must use runOpenClawAgentWriteTransaction for cache publication");
	publish();
	return false;
}
/** Participant display facts may be borrowed in a transaction only at its native revision. */
function readCurrentSessionEntryCacheParticipants(database, sessionKey) {
	const cached = sessionEntryCaches.get(database);
	const entry = cached?.entries.get(sessionKey);
	if (!cached || !entry || !getAdmittedSqliteSchemaFacts(database) || !cacheValidityTokensEqual(cached.validityToken, readSessionEntryCacheValidityToken(database, "cached"))) return;
	return entry.participants ? {
		participants: entry.participants.map(({ identity }) => ({ identity: { ...identity } })),
		participantCount: entry.participantCount
	} : {};
}
//#endregion
//#region src/config/sessions/session-participant-identity.ts
let identityValidator;
function participantIdentityNamespace(identity) {
	if (identity.type === "profile" || identity.type === "agent") return JSON.stringify({ type: identity.type });
	if (identity.type === "remote") return JSON.stringify({
		type: identity.type,
		pluginId: identity.pluginId,
		domain: identity.domain,
		idKind: identity.idKind
	});
	if (identity.type === "observation") return JSON.stringify({
		type: identity.type,
		pluginId: identity.pluginId,
		accountId: identity.accountId,
		senderKind: identity.senderKind
	});
	return JSON.stringify({
		type: identity.type,
		actorType: identity.actorType,
		source: identity.source
	});
}
function readParticipantIdentity(namespace, id) {
	const parsed = JSON.parse(namespace);
	if (isRecord(parsed)) {
		const identity = {
			...parsed,
			id
		};
		if ((identityValidator ??= Compile(SessionParticipantIdentitySchema)).Check(identity)) return identity;
	}
	throw new Error("Session participant identity is invalid; run openclaw doctor --fix.");
}
/** Inputs/aliases sum; retried cross-store copies retain the largest recorded aggregate. */
function mergeParticipantAggregate(current, incoming, mode) {
	if (!current) return incoming;
	return {
		contribution_count: mode === "sum" ? current.contribution_count + incoming.contribution_count : Math.max(current.contribution_count, incoming.contribution_count),
		first_prompted_at: current.first_prompted_at === null || incoming.first_prompted_at === null ? null : Math.min(current.first_prompted_at, incoming.first_prompted_at),
		last_prompted_at: current.last_prompted_at === null ? incoming.last_prompted_at : incoming.last_prompted_at === null ? current.last_prompted_at : Math.max(current.last_prompted_at, incoming.last_prompted_at)
	};
}
//#endregion
//#region src/config/sessions/session-participant-prepared-read.ts
let preparedRead;
/** Only synchronous materialization borrows facts; transaction authority always reads its owner. */
function withPreparedSessionParticipants(read, consume) {
	const previous = preparedRead;
	preparedRead = read;
	try {
		const value = consume();
		if (isPromiseLike(value)) {
			Promise.resolve(value).catch(() => {});
			throw new Error("Prepared participant consumers must remain synchronous");
		}
		return value;
	} finally {
		preparedRead = previous;
	}
}
function readPreparedSessionParticipants(database, sessionKey) {
	if (!preparedRead || database.isTransaction) return;
	const identity = findOpenClawAgentDatabaseIdentity({ db: database })?.identity;
	if (identity === void 0) return;
	const projection = preparedRead(identity, sessionKey);
	return projection && {
		...projection.participants ? { participants: projection.participants.map(({ identity: participantIdentity }) => ({ identity: { ...participantIdentity } })) } : {},
		...projection.participantCount === void 0 ? {} : { participantCount: projection.participantCount }
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-participant-projection.ts
function selectParticipantRows(database) {
	return getNodeSqliteKysely(database).selectFrom("session_participants").selectAll().orderBy("session_key").orderBy("first_prompted_at").orderBy("actor_id").orderBy("identity_namespace");
}
function prepareSingleSessionParticipantQuery(database) {
	return prepareSqliteQuerySync(database, (parameter) => selectParticipantRows(database).where("session_key", "=", parameter((sessionKey) => sessionKey)));
}
const singleSessionParticipantQuery = createSqliteQueryCache(prepareSingleSessionParticipantQuery);
function readParticipantRows(database, sessionKeys) {
	const sessionKey = sessionKeys?.length === 1 ? sessionKeys[0] : void 0;
	if (sessionKey !== void 0) return singleSessionParticipantQuery(database)(sessionKey).rows;
	let query = selectParticipantRows(database);
	if (sessionKeys) query = query.where("session_key", "in", sqliteStringSet(sessionKeys));
	return executeSqliteQuerySync(database, query).rows;
}
function readParticipantRecord(row) {
	return {
		identity: readParticipantIdentity(row.identity_namespace, row.actor_id),
		contributionCount: row.contribution_count,
		firstPromptedAt: row.first_prompted_at,
		lastPromptedAt: row.last_prompted_at
	};
}
function participantRecordsBySessionKey(database, sessionKeys) {
	const records = /* @__PURE__ */ new Map();
	if (!tableExists(database, "session_participants")) return records;
	for (const row of readParticipantRows(database, sessionKeys)) {
		const participants = records.get(row.session_key) ?? [];
		participants.push(readParticipantRecord(row));
		records.set(row.session_key, participants);
	}
	return records;
}
function participantProjection(records) {
	if (records.length === 0) return {};
	return {
		participants: records.map(({ identity }) => ({ identity })),
		participantCount: records.length
	};
}
function withProjectedParticipants(entry, records) {
	return records.length ? {
		...entry,
		...participantProjection(records)
	} : entry;
}
function readSqliteSessionParticipantProjection(database, sessionKey) {
	return readPreparedSessionParticipants(database, sessionKey) ?? readCurrentSessionEntryCacheParticipants(database, sessionKey) ?? participantProjection(participantRecordsBySessionKey(database, [sessionKey]).get(sessionKey) ?? []);
}
function projectSqliteSessionParticipants(database, sessionKey, entry) {
	const prepared = readPreparedSessionParticipants(database, sessionKey) ?? readCurrentSessionEntryCacheParticipants(database, sessionKey);
	if (prepared) return prepared.participants ? {
		...entry,
		...prepared
	} : entry;
	return withProjectedParticipants(entry, participantRecordsBySessionKey(database, [sessionKey]).get(sessionKey) ?? []);
}
/** Acquire one fresh cohort lazily, then decode only the requested session's participants. */
function prepareSqliteSessionParticipantProjection(database, sessionKeys) {
	let rowsByKey;
	let acquisitionFailed = false;
	return (sessionKey, entry) => {
		const prepared = readPreparedSessionParticipants(database, sessionKey);
		if (prepared) return prepared.participants ? {
			...entry,
			...prepared
		} : entry;
		if (!rowsByKey && !acquisitionFailed) try {
			const rows = tableExists(database, "session_participants") ? readParticipantRows(database, sessionKeys) : [];
			rowsByKey = /* @__PURE__ */ new Map();
			for (const row of rows) {
				const participants = rowsByKey.get(row.session_key) ?? [];
				participants.push(row);
				rowsByKey.set(row.session_key, participants);
			}
		} catch {
			acquisitionFailed = true;
		}
		if (acquisitionFailed) return projectSqliteSessionParticipants(database, sessionKey, entry);
		return withProjectedParticipants(entry, (rowsByKey?.get(sessionKey) ?? []).map(readParticipantRecord));
	};
}
function projectSqliteSessionParticipantsBatch(database, entries) {
	const prepared = /* @__PURE__ */ new Map();
	for (const [sessionKey, entry] of entries) {
		const projection = readPreparedSessionParticipants(database, sessionKey);
		if (!projection) break;
		prepared.set(sessionKey, projection.participants ? {
			...entry,
			...projection
		} : entry);
	}
	if (prepared.size === entries.size) return prepared;
	const records = participantRecordsBySessionKey(database, [...entries.keys()]);
	const projected = new Map(entries);
	for (const [sessionKey, participants] of records) {
		const entry = entries.get(sessionKey);
		if (entry) projected.set(sessionKey, withProjectedParticipants(entry, participants));
	}
	return projected;
}
//#endregion
//#region src/config/sessions/internal-session-key.ts
const INTERNAL_SESSION_EFFECTS_SEGMENT = "internal-session-effects";
const INTERNAL_SESSION_EFFECTS_REST_PREFIX = `${INTERNAL_SESSION_EFFECTS_SEGMENT}:`;
function normalizeInternalRunId(runId) {
	return `${runId.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 48) || "run"}-${sha256Hex(runId).slice(0, 16)}`;
}
/** Resolves the hidden SQLite session identity owned by one internal-effects run. */
function resolveInternalSessionEffectsIdentity(params) {
	const suffix = normalizeInternalRunId(params.runId);
	const keySuffix = params.incognito ? `incognito-${suffix}` : suffix.startsWith("incognito-") ? `legacy-${suffix}` : suffix;
	return {
		sessionId: `${INTERNAL_SESSION_EFFECTS_SEGMENT}-${suffix}`,
		sessionKey: `agent:${normalizeAgentId(params.agentId)}:${INTERNAL_SESSION_EFFECTS_SEGMENT}:${keySuffix}`
	};
}
/** Returns true for SQLite entries that exist only to contain suppressed run effects. */
function isInternalSessionEffectsKey(sessionKey) {
	if (!sessionKey.startsWith("agent:")) return false;
	const agentEnd = sessionKey.indexOf(":", 6);
	return agentEnd >= 0 && sessionKey.startsWith(INTERNAL_SESSION_EFFECTS_REST_PREFIX, agentEnd + 1);
}
//#endregion
export { projectSqliteSessionParticipants as a, withPreparedSessionParticipants as c, publishTrackedCacheUpdate as d, sessionEntryCaches as f, readSessionNodesGeneration as g, readSessionEntryCacheValidityToken as h, prepareSqliteSessionParticipantProjection as i, mergeParticipantAggregate as l, createSessionEntryRevisionGuard as m, resolveInternalSessionEffectsIdentity as n, projectSqliteSessionParticipantsBatch as o, cacheValidityTokensEqual as p, participantRecordsBySessionKey as r, readSqliteSessionParticipantProjection as s, isInternalSessionEffectsKey as t, participantIdentityNamespace as u };
