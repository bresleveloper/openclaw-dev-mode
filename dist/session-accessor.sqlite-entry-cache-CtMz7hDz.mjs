import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as readSqliteDataVersion } from "./node-sqlite-BO6jRFcG.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { n as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { r as readOpenClawAgentDatabase } from "./openclaw-agent-db-readonly-open-_lavN1YB.mjs";
import { m as readSqliteSessionParticipantProjection, o as readExactSessionEntryRow, p as projectSqliteSessionParticipantsBatch, r as prepareExactSessionEntryRowReads, u as validateDeliveryCanonicalSessionEntry } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { a as selectSessionEntryRows, c as hasSqliteSessionOwnerColumns, r as parseSessionEntryJson, u as readSqliteSessionOwner } from "./session-accessor.sqlite-status-DxkjEBwE.mjs";
import { i as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-BBylVEaq.mjs";
import { r as listSessionMembersInDatabase } from "./session-sharing-store.kernel-Dh3YMern.mjs";
import { toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-entry-cache.ts
const sessionEntryCaches = /* @__PURE__ */ new WeakMap();
const preparedSharingReads = resolveGlobalSingleton(Symbol.for("openclaw.preparedSessionSharingReads"), () => /* @__PURE__ */ new Map());
const preparedSharingChanges = resolveGlobalSingleton(Symbol.for("openclaw.preparedSessionSharingChanges"), () => /* @__PURE__ */ new WeakSet());
/** Private owner metadata follows the original event object without changing its public fields. */
function isPreparedSessionSharingChange(change) {
	return preparedSharingChanges.has(change);
}
function emitPreparedSessionSharingChange(database, sessionKey, agentId = database.agentId, facts) {
	const change = {
		agentId,
		storePath: database.path,
		sessionKey,
		...facts ? { facts } : { factsInvalidated: true }
	};
	preparedSharingChanges.add(change);
	sessionChanges.emit(change, database.db);
}
function projectSessionSharingEntry(entry) {
	return {
		sessionId: entry.sessionId,
		updatedAt: entry.updatedAt,
		lifecycleRevision: entry.lifecycleRevision,
		visibility: entry.visibility,
		incognito: entry.incognito,
		createdActor: entry.createdActor ? { ...entry.createdActor } : void 0,
		sandbox: entry.sandbox
	};
}
/** The existing entry writer advances retained facts before any commit observer can reenter. */
function retainPreparedSessionSharingFacts(params) {
	const key = `${params.databaseIdentity}\0${params.sessionKey}`;
	const read = { facts: {
		entry: params.entry,
		membership: params.membership
	} };
	const reads = preparedSharingReads.get(key) ?? /* @__PURE__ */ new Set();
	reads.add(read);
	preparedSharingReads.set(key, reads);
	let active = true;
	return {
		readCurrent: () => read.facts,
		release: () => {
			if (!active) return;
			active = false;
			read.facts = void 0;
			reads.delete(read);
			if (reads.size === 0 && preparedSharingReads.get(key) === reads) preparedSharingReads.delete(key);
		}
	};
}
function retainedSharingReads(database, sessionKey) {
	const identity = findOpenClawAgentDatabaseIdentity(database)?.identity;
	return typeof identity === "string" ? preparedSharingReads.get(`file:${identity}\0${sessionKey}`) : void 0;
}
const incognitoSharingEntries = resolveGlobalSingleton(Symbol.for("openclaw.incognitoSessionSharingEntries"), () => /* @__PURE__ */ new WeakMap());
function readCommittedIncognitoSessionSharing(database, sessionKey) {
	return incognitoSharingEntries.get(database)?.get(sessionKey);
}
function publishSessionSharingMemberChange(database, sessionKey, member, agentId = database.agentId) {
	publishTrackedCacheUpdate(database, () => {
		const update = (facts) => {
			if (facts.entry?.sessionId !== member.sessionId) return facts;
			const membership = new Set(facts.membership);
			if (member.present) membership.add(member.identityId);
			else membership.delete(member.identityId);
			return {
				...facts,
				membership
			};
		};
		for (const read of retainedSharingReads(database, sessionKey) ?? []) if (read.facts) read.facts = update(read.facts);
		if (!database.db.location()) {
			const current = incognitoSharingEntries.get(database.db)?.get(sessionKey);
			if (current) incognitoSharingEntries.get(database.db)?.set(sessionKey, update(current));
		}
	});
	emitPreparedSessionSharingChange(database, sessionKey, agentId, member);
}
/** Commit-driven projections borrow owner memory; ordinary reads still validate SQLite. */
function readCommittedSessionEntryCache(database) {
	return sessionEntryCaches.get(database)?.entries;
}
/** A settled worker with an unknown write outcome cannot publish a trustworthy field patch. */
function discardCommittedSessionEntryCache(database) {
	sessionEntryCaches.delete(database);
}
const sessionNodesGenerationTrackerSchemaVersions = /* @__PURE__ */ new WeakMap();
function ensureSessionNodesGenerationTracker(database) {
	const schemaRow = database.prepare("PRAGMA schema_version").get();
	if (typeof schemaRow.schema_version !== "number") throw new Error("SQLite did not return a numeric PRAGMA schema_version");
	const trackedSchemaVersion = sessionNodesGenerationTrackerSchemaVersions.get(database);
	if (trackedSchemaVersion === schemaRow.schema_version) return;
	const hasParticipants = tableExists(database, "session_participants");
	database.exec(`
    CREATE TEMP TABLE IF NOT EXISTS openclaw_session_nodes_cache_generation (id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1), generation INTEGER NOT NULL) STRICT;
    INSERT OR IGNORE INTO openclaw_session_nodes_cache_generation (id, generation) VALUES (1, 0);
    ${trackedSchemaVersion === void 0 ? "" : "UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1;"}
    DROP TRIGGER IF EXISTS openclaw_session_nodes_cache_generation_insert;
    DROP TRIGGER IF EXISTS openclaw_session_nodes_cache_generation_update;
    DROP TRIGGER IF EXISTS openclaw_session_nodes_cache_generation_delete;
    CREATE TEMP TRIGGER openclaw_session_nodes_cache_generation_insert
      AFTER INSERT ON main.session_nodes BEGIN UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    CREATE TEMP TRIGGER openclaw_session_nodes_cache_generation_update
      AFTER UPDATE ON main.session_nodes BEGIN UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    CREATE TEMP TRIGGER openclaw_session_nodes_cache_generation_delete
      AFTER DELETE ON main.session_nodes BEGIN UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    DROP TRIGGER IF EXISTS openclaw_session_participants_cache_generation_insert;
    DROP TRIGGER IF EXISTS openclaw_session_participants_cache_generation_update;
    DROP TRIGGER IF EXISTS openclaw_session_participants_cache_generation_delete;
    ${hasParticipants ? `
    CREATE TEMP TRIGGER openclaw_session_participants_cache_generation_insert
      AFTER INSERT ON main.session_participants BEGIN UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    CREATE TEMP TRIGGER openclaw_session_participants_cache_generation_update
      AFTER UPDATE ON main.session_participants BEGIN UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    CREATE TEMP TRIGGER openclaw_session_participants_cache_generation_delete
      AFTER DELETE ON main.session_participants BEGIN UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    ` : ""}
  `);
	if (!database.isTransaction) sessionNodesGenerationTrackerSchemaVersions.set(database, schemaRow.schema_version);
	else {
		const version = schemaRow.schema_version;
		stageSqliteTransactionState(database, {
			stage: () => sessionNodesGenerationTrackerSchemaVersions.set(database, version),
			rollback: () => sessionNodesGenerationTrackerSchemaVersions.delete(database),
			commit: () => {}
		});
	}
}
function readSessionNodesGeneration(database) {
	ensureSessionNodesGenerationTracker(database);
	const row = database.prepare("SELECT generation FROM temp.openclaw_session_nodes_cache_generation WHERE id = 1").get();
	if (typeof row.generation !== "number") throw new Error("SQLite session_nodes cache generation is unavailable");
	return row.generation;
}
function readSessionEntryCacheValidityToken(database) {
	return {
		dataVersion: readSqliteDataVersion(database),
		sessionNodesGeneration: readSessionNodesGeneration(database)
	};
}
function cacheValidityTokensEqual(left, right) {
	return left.dataVersion === right.dataVersion && left.sessionNodesGeneration === right.sessionNodesGeneration;
}
/** Reuse only complete, current metadata; exact reads still own misses and invalid rows. */
function readCachedExactSessionEntries(database, sessionKeys) {
	const cached = sessionEntryCaches.get(database.db);
	if (!cached || database.db.isTransaction) return;
	const keys = [...new Set(sessionKeys.map(toUSVString))];
	if (keys.some((key) => !cached.entries.has(key))) return;
	const validityToken = cached.validityToken;
	try {
		if (!cacheValidityTokensEqual(validityToken, readSessionEntryCacheValidityToken(database.db))) return;
		const rows = executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_nodes").select([
			"session_key",
			"current_session_id",
			"updated_at"
		]).where("session_key", "in", sqliteStringSet(keys))).rows;
		if (rows.length !== keys.length) return;
		const rowsByKey = new Map(rows.map((row) => [row.session_key, row]));
		const entries = /* @__PURE__ */ new Map();
		for (const sessionKey of new Set(sessionKeys)) {
			const key = toUSVString(sessionKey);
			const row = rowsByKey.get(key);
			const entry = cached.entries.get(key);
			if (!row || !entry || entry.sessionId !== row.current_session_id || entry.updatedAt !== row.updated_at) return;
			entries.set(sessionKey, validateDeliveryCanonicalSessionEntry(key, structuredClone(entry)));
		}
		return sessionEntryCaches.get(database.db) === cached && cacheValidityTokensEqual(validityToken, readSessionEntryCacheValidityToken(database.db)) ? entries : void 0;
	} catch {
		return;
	}
}
/** Decode one admitted physical store without changing exact per-request error isolation. */
function readExactSessionEntryCandidatesInDatabase(database, requests, projection) {
	const entries = /* @__PURE__ */ new Map();
	const keys = [...new Set(requests.flat())];
	const cachedEntries = projection === "list" ? readCachedExactSessionEntries(database, keys) : void 0;
	let readPrepared;
	if (cachedEntries) readPrepared = (sessionKey) => cachedEntries.get(sessionKey);
	else {
		const readRows = prepareExactSessionEntryRowReads(database, keys, projection);
		readPrepared = (sessionKey) => readRows(sessionKey)?.entry;
	}
	const readEntry = (sessionKey) => {
		const cached = entries.get(sessionKey);
		if (cached) return cached;
		let result;
		try {
			const entry = readOpenClawAgentDatabase(database, () => readPrepared(sessionKey)).value;
			result = ok(entry ? {
				sessionKey,
				entry
			} : void 0);
		} catch (error) {
			result = err(error);
		}
		entries.set(sessionKey, result);
		return result;
	};
	return requests.map((sessionKeys) => {
		const matches = [];
		for (const sessionKey of sessionKeys) {
			const entry = readEntry(sessionKey);
			if (!entry.ok) return err(entry.error);
			if (entry.value) matches.push(entry.value);
		}
		return ok(matches);
	});
}
/** Bracket one accessor-owned row write so its publication cannot hide earlier raw DML. */
function trackSessionEntryCacheWrite(database, write) {
	const before = sessionEntryCaches.has(database.db) ? readSessionNodesGeneration(database.db) : void 0;
	write();
	if (before === void 0) return;
	return {
		before,
		after: readSessionNodesGeneration(database.db)
	};
}
function loadSessionEntrySnapshot(database, projection = "list", prepared, fullEntryKeys, deferParticipants = false) {
	const metadata = !fullEntryKeys && prepared && prepared.dataVersion === readSqliteDataVersion(database.db) ? prepared : void 0;
	const parsedEntries = metadata?.entries ?? /* @__PURE__ */ new Map();
	const keys = metadata?.keys ?? [];
	if (!metadata) for (const row of iterateSqliteQuerySync(database.db, selectSessionEntryRows(database, projection, fullEntryKeys ? [...fullEntryKeys] : []).select("updated_at").orderBy("session_key"))) {
		keys.push(row.session_key);
		const entry = parseSessionEntryJson(row, fullEntryKeys?.has(row.session_key) ? "full" : projection);
		if (entry) parsedEntries.set(row.session_key, entry);
	}
	return {
		entries: deferParticipants ? parsedEntries : projectSqliteSessionParticipantsBatch(database.db, parsedEntries),
		keys
	};
}
function readSessionEntryCache(database, options) {
	const prepared = assertCanonicalSqliteSessionKeysCurrent(database, void 0, options.projection !== "full" && !options.fullEntryKeys);
	if (!options.cache || options.deferParticipants || options.fullEntryKeys || options.latest || options.projection === "full" || database.db.isTransaction) return loadSessionEntrySnapshot(database, options.projection, prepared, options.fullEntryKeys ? new Set(options.fullEntryKeys) : void 0, options.deferParticipants);
	const validityToken = readSessionEntryCacheValidityToken(database.db);
	const cached = sessionEntryCaches.get(database.db);
	if (cached && cacheValidityTokensEqual(cached.validityToken, validityToken)) return cached;
	const next = {
		...loadSessionEntrySnapshot(database, options.projection, prepared),
		validityToken
	};
	sessionEntryCaches.set(database.db, next);
	return next;
}
function publishTrackedCacheUpdate(database, publish) {
	if (stageSqliteTransactionState(database.db, {
		stage: () => {},
		rollback: () => {},
		commit: publish
	})) return;
	if (database.db.isTransaction) throw new Error("SQLite session entry writes must use runOpenClawAgentWriteTransaction for cache publication");
	publish();
}
function readSessionEntrySideMetadata(database, sessionKey) {
	const ownerRow = hasSqliteSessionOwnerColumns(database.db) ? executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_nodes").select([
		"owner_actor_type",
		"owner_actor_id",
		"owner_assigned_by_type",
		"owner_assigned_by_id",
		"owner_assigned_at"
	]).where("session_key", "=", sessionKey).limit(1)).rows[0] : void 0;
	const owner = ownerRow ? readSqliteSessionOwner(ownerRow) : void 0;
	return {
		...owner ? { owner } : {},
		...readSqliteSessionParticipantProjection(database.db, sessionKey)
	};
}
function projectSessionEntryCacheUpdate(sourceEntry, sideMetadata) {
	const { skillsSnapshot: _skills, systemPromptReport: _report, ...metadata } = sourceEntry;
	const parsedEntry = parseSessionEntryJson({ entry_json: JSON.stringify(metadata) });
	return parsedEntry ? {
		...parsedEntry,
		...sideMetadata
	} : void 0;
}
function advanceSessionEntryCacheGeneration(cached, writeGeneration) {
	if (cached.validityToken.sessionNodesGeneration === writeGeneration.before) cached.validityToken = {
		...cached.validityToken,
		sessionNodesGeneration: writeGeneration.after
	};
}
function publishSqliteSessionEntryCacheUpsert(database, update, writeGeneration) {
	if (!sessionEntryCaches.get(database.db)) return;
	const { sessionKey } = update;
	let sideMetadata;
	let entry;
	try {
		sideMetadata = readSessionEntrySideMetadata(database, sessionKey);
		entry = update.entry ? projectSessionEntryCacheUpdate(update.entry, sideMetadata) : void 0;
	} catch {
		publishTrackedCacheUpdate(database, () => sessionEntryCaches.delete(database.db));
		return;
	}
	publishTrackedCacheUpdate(database, () => {
		const cached = sessionEntryCaches.get(database.db);
		if (!cached) return;
		let publishedEntry = entry;
		const currentEntry = cached.entries.get(sessionKey);
		if (!update.entry && currentEntry && sideMetadata) {
			const { owner: _owner, participants: _participants, participantCount: _count, ...metadata } = currentEntry;
			publishedEntry = {
				...metadata,
				...sideMetadata
			};
		}
		if (!publishedEntry) {
			sessionEntryCaches.delete(database.db);
			return;
		}
		if (!cached.entries.has(sessionKey) && !cached.keys.includes(sessionKey)) cached.keys = [...cached.keys, sessionKey].toSorted();
		cached.entries.set(sessionKey, publishedEntry);
		advanceSessionEntryCacheGeneration(cached, writeGeneration);
	});
	return sideMetadata;
}
function publishSessionEntryCacheInvalidation(database, update, writeGeneration) {
	let facts = update.facts;
	const sharingUnchanged = facts?.kind === "unchanged" || facts?.kind === "participants" || facts?.kind === "category";
	const incognito = !database.db.location();
	const sharingEntry = update.entry ? projectSessionSharingEntry(update.entry) : void 0;
	if (!sharingUnchanged) publishTrackedCacheUpdate(database, () => {
		for (const read of retainedSharingReads(database, update.sessionKey) ?? []) {
			const previous = read.facts;
			read.facts = sharingEntry && previous?.entry && previous.entry.sessionId === sharingEntry.sessionId && previous.entry.lifecycleRevision === sharingEntry.lifecycleRevision ? {
				entry: sharingEntry,
				membership: previous.membership
			} : void 0;
		}
	});
	if (incognito && !sharingUnchanged) {
		let current;
		try {
			const entry = update.entry ?? readExactSessionEntryRow(database, update.sessionKey, "list")?.entry;
			current = entry ? {
				entry: projectSessionSharingEntry(entry),
				membership: new Set(listSessionMembersInDatabase(database, update.sessionKey).map((member) => member.identityId))
			} : void 0;
		} catch {}
		publishTrackedCacheUpdate(database, () => {
			let entries = incognitoSharingEntries.get(database.db);
			if (!entries && current) {
				entries = /* @__PURE__ */ new Map();
				incognitoSharingEntries.set(database.db, entries);
			}
			if (current) entries?.set(update.sessionKey, current);
			else entries?.delete(update.sessionKey);
		});
	}
	if (writeGeneration) {
		const metadata = publishSqliteSessionEntryCacheUpsert(database, update, writeGeneration);
		if (facts?.kind === "participants" && metadata) facts = {
			kind: "participants",
			projection: {
				participants: metadata.participants,
				participantCount: metadata.participantCount
			}
		};
	} else publishTrackedCacheUpdate(database, () => sessionEntryCaches.delete(database.db));
	emitPreparedSessionSharingChange(database, update.sessionKey, database.agentId, facts);
}
/** The category worker publishes only its changed field; native freshness tokens still expose other commits. */
function publishSessionEntryCacheCategoryUpdate(database, rows, category) {
	publishTrackedCacheUpdate(database, () => {
		const cached = sessionEntryCaches.get(database.db);
		for (const { sessionKey, sessionId } of rows) {
			const current = cached?.entries.get(sessionKey);
			if (!current || current.sessionId !== sessionId) continue;
			const next = { ...current };
			if (category === void 0) delete next.category;
			else next.category = category;
			cached?.entries.set(sessionKey, next);
		}
	});
}
/** Refresh participant projections without reloading unchanged session-entry JSON. */
function publishSessionEntryCacheParticipantUpdate(database, sessionKey, params) {
	const { writeGeneration, projectionChanged } = params;
	if (!projectionChanged) {
		if (writeGeneration) publishTrackedCacheUpdate(database, () => {
			const cached = sessionEntryCaches.get(database.db);
			if (cached) advanceSessionEntryCacheGeneration(cached, writeGeneration);
		});
		return;
	}
	let facts = { kind: "participants" };
	if (!writeGeneration) try {
		facts = {
			kind: "participants",
			projection: readSqliteSessionParticipantProjection(database.db, sessionKey)
		};
	} catch {}
	publishSessionEntryCacheInvalidation(database, {
		sessionKey,
		facts
	}, writeGeneration);
}
//#endregion
export { publishSessionEntryCacheInvalidation as a, readCommittedIncognitoSessionSharing as c, readSessionEntryCache as d, retainPreparedSessionSharingFacts as f, publishSessionEntryCacheCategoryUpdate as i, readCommittedSessionEntryCache as l, isPreparedSessionSharingChange as n, publishSessionEntryCacheParticipantUpdate as o, trackSessionEntryCacheWrite as p, projectSessionSharingEntry as r, publishSessionSharingMemberChange as s, discardCommittedSessionEntryCache as t, readExactSessionEntryCandidatesInDatabase as u };
