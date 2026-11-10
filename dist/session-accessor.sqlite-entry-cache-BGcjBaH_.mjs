import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { A as readSqliteDatabaseWriteRevision, k as readSqliteDatabaseSiblingWriteRevision } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as getAdmittedSqliteSchemaFacts, p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { r as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { r as readOpenClawAgentDatabase } from "./openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { t as collectSessionEntryLookupKeys } from "./store-entry-CUxN9KZj.mjs";
import { c as publishSessionSharingEntryChange, i as emitPreparedSessionSharingChange } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { i as publishTrackedCacheUpdate, l as readSessionEntryCacheValidityToken, o as sessionEntryCaches, s as cacheValidityTokensEqual, u as readSessionNodesGeneration } from "./session-participant-identity-Btc25HNW.mjs";
import { t as captureSessionEntryPublicationSource } from "./session-entry-publication-source-BkCFKM-k.mjs";
import { r as readSqliteSessionOwner, t as hasSqliteSessionOwnerColumns } from "./session-accessor.sqlite-owner-projection-BFkJufPp.mjs";
import { n as parseSessionEntryJson, r as selectSessionEntryRows } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-B7chVWi3.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { i as projectSqliteSessionParticipantsBatch, o as readSqliteSessionParticipantProjection } from "./session-accessor.sqlite-participant-projection-B8eNZYGT.mjs";
import { _ as validateDeliveryCanonicalSessionEntry, i as prepareExactSessionEntryRowReads } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
import { toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-entry-cache-projection.ts
function loadSessionEntrySnapshot(database, projection = "list", prepared, deferParticipants = false) {
	const metadata = prepared?.writeRevision !== void 0 && prepared.writeRevision === readSqliteDatabaseWriteRevision(database.db) ? prepared : void 0;
	const parsedEntries = metadata?.entries ?? /* @__PURE__ */ new Map();
	const keys = metadata?.keys ?? [];
	if (!metadata) for (const row of iterateSqliteQuerySync(database.db, selectSessionEntryRows(database, projection).select(["current_session_id", "updated_at"]).orderBy("session_key"))) {
		keys.push(row.session_key);
		const entry = parseSessionEntryJson(row, projection);
		if (entry) parsedEntries.set(row.session_key, entry);
	}
	return {
		entries: deferParticipants ? parsedEntries : projectSqliteSessionParticipantsBatch(database.db, parsedEntries),
		keys
	};
}
function readSessionEntrySideMetadata(database, sessionKey, participants) {
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
		...participants ?? readSqliteSessionParticipantProjection(database.db, sessionKey)
	};
}
function projectSessionEntryCacheMetadata(entry, sideMetadata) {
	const projected = {
		...entry,
		...sideMetadata
	};
	for (const field of [
		"owner",
		"participants",
		"participantCount"
	]) if (sideMetadata[field] === void 0) delete projected[field];
	return freezeJsonSnapshot(projected);
}
function projectSessionEntryCacheUpdate(entryJson, sideMetadata, snapshotEntry, snapshots) {
	const parsedEntry = parseSessionEntryJson({ entry_json: entryJson }, "list");
	if (parsedEntry && snapshotEntry) {
		const cold = snapshots !== void 0 ? Object.fromEntries(snapshots.map(({ field, valueJson }) => [field, JSON.parse(valueJson)])) : structuredClone({
			...snapshotEntry.sessionDiffBaseline !== void 0 ? { sessionDiffBaseline: snapshotEntry.sessionDiffBaseline } : {},
			...snapshotEntry.skillsSnapshot !== void 0 ? { skillsSnapshot: snapshotEntry.skillsSnapshot } : {},
			...snapshotEntry.systemPromptReport !== void 0 ? { systemPromptReport: snapshotEntry.systemPromptReport } : {}
		});
		Object.assign(parsedEntry, cold);
	}
	return parsedEntry ? projectSessionEntryCacheMetadata(parsedEntry, sideMetadata) : void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-cache.ts
/** Reuse only complete, current metadata; exact reads still own misses and invalid rows. */
function readCachedExactSessionEntries(database, sessionKeys, clone) {
	const cached = sessionEntryCaches.get(database.db);
	if (!cached || database.db.isTransaction) return;
	if ([...new Set(sessionKeys.map(toUSVString))].some((key) => !cached.entries.has(key))) return;
	const validityToken = cached.validityToken;
	try {
		if (!cacheValidityTokensEqual(validityToken, readSessionEntryCacheValidityToken(database.db))) return;
		const entries = /* @__PURE__ */ new Map();
		for (const sessionKey of new Set(sessionKeys)) {
			const key = toUSVString(sessionKey);
			const entry = cached.entries.get(key);
			entries.set(sessionKey, validateDeliveryCanonicalSessionEntry(key, clone ? structuredClone(entry) : entry));
		}
		return entries;
	} catch {
		sessionEntryCaches.delete(database.db);
		return;
	}
}
/** Decode one admitted physical store without changing exact per-request error isolation. */
function readExactSessionEntryCandidatesInDatabase(database, requests, projection, options = {}) {
	const entries = /* @__PURE__ */ new Map();
	const validationKeys = (sessionKey) => options.validation === "canonical" ? [.../* @__PURE__ */ new Set([sessionKey, ...collectSessionEntryLookupKeys(sessionKey)])] : [sessionKey];
	const keys = [...new Set(requests.flatMap((request) => request.flatMap(validationKeys)))];
	const cachedEntries = projection === "list" && options.validation === void 0 ? readCachedExactSessionEntries(database, keys, options.clone !== false) : void 0;
	let readPrepared;
	if (cachedEntries) readPrepared = (sessionKey) => cachedEntries.get(sessionKey);
	else {
		const readRows = prepareExactSessionEntryRowReads(database, keys, projection, options.validation);
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
			for (const candidate of validationKeys(sessionKey)) {
				const checked = readEntry(candidate);
				if (!checked.ok) return err(checked.error);
			}
			const entry = readEntry(sessionKey);
			if (!entry.ok) return err(entry.error);
			if (entry.value) matches.push(entry.value);
		}
		return ok(matches);
	});
}
/** Capture the preimage before a prepared write; settle its generation after commit. */
function prepareSessionEntryCacheWrite(database) {
	const before = !readSessionActorTransactionState(database) && sessionEntryCaches.has(database.db) && getAdmittedSqliteSchemaFacts(database.db) ? readSessionNodesGeneration(database.db) : void 0;
	return () => {
		if (before === void 0 || !getAdmittedSqliteSchemaFacts(database.db)) {
			sessionEntryCaches.delete(database.db);
			return;
		}
		return {
			before,
			after: readSessionNodesGeneration(database.db)
		};
	};
}
/** Bracket one accessor-owned row write so its publication cannot hide earlier raw DML. */
function trackSessionEntryCacheWrite(database, write) {
	const complete = prepareSessionEntryCacheWrite(database);
	write();
	return complete();
}
/** The transcript owner certifies only writes that leave node and participant metadata unchanged. */
function preserveSessionEntryCacheAcrossWrite(database, write) {
	const writeGeneration = trackSessionEntryCacheWrite(database, write);
	if (writeGeneration) publishTrackedCacheUpdate(database, () => {
		const cached = sessionEntryCaches.get(database.db);
		if (cached) advanceSessionEntryCacheGeneration(cached, writeGeneration);
	});
}
function readSessionEntryCache(database, options) {
	return runSqliteReadOperationSync(database.db, () => {
		const projection = options.projection;
		const prepared = assertCanonicalSqliteSessionKeysCurrent(database, projection !== "full");
		if (!options.cache || options.deferParticipants || options.latest || projection === "full" || database.db.isTransaction || !getAdmittedSqliteSchemaFacts(database.db)) return loadSessionEntrySnapshot(database, projection, prepared, options.deferParticipants);
		const validityToken = readSessionEntryCacheValidityToken(database.db);
		const cached = sessionEntryCaches.get(database.db);
		if (cached && cacheValidityTokensEqual(cached.validityToken, validityToken)) return cached;
		const loaded = loadSessionEntrySnapshot(database, options.projection, prepared);
		for (const entry of loaded.entries.values()) freezeJsonSnapshot(entry);
		const next = {
			...loaded,
			validityToken
		};
		if (cacheValidityTokensEqual(validityToken, readSessionEntryCacheValidityToken(database.db))) sessionEntryCaches.set(database.db, next);
		else sessionEntryCaches.delete(database.db);
		return next;
	});
}
function advanceSessionEntryCacheGeneration(cached, writeGeneration) {
	if (cached.validityToken.sessionNodesGeneration === writeGeneration.before) cached.validityToken = {
		...cached.validityToken,
		sessionNodesGeneration: writeGeneration.after
	};
}
function publishSqliteSessionEntryCacheUpsert(database, update, writeGeneration) {
	const owner = sessionEntryCaches.get(database.db);
	if (!owner) return;
	const { sessionKey } = update;
	let sideMetadata;
	let entry;
	try {
		const retained = update.entry && owner.validityToken.sessionNodesGeneration === writeGeneration.before && owner.validityToken.siblingWriteRevision !== void 0 && owner.validityToken.siblingWriteRevision === readSqliteDatabaseSiblingWriteRevision(database.db) ? owner.entries.get(sessionKey) : void 0;
		sideMetadata = readSessionEntrySideMetadata(database, sessionKey, retained ? {
			participants: retained.participants,
			participantCount: retained.participantCount
		} : void 0);
		entry = update.entry ? projectSessionEntryCacheUpdate(update.entryJson, sideMetadata) : void 0;
	} catch {
		publishTrackedCacheUpdate(database, () => sessionEntryCaches.delete(database.db));
		return;
	}
	publishTrackedCacheUpdate(database, () => {
		const cached = sessionEntryCaches.get(database.db);
		if (!cached) return;
		let publishedEntry = entry;
		const currentEntry = cached.entries.get(sessionKey);
		if (!update.entry && currentEntry) publishedEntry = projectSessionEntryCacheMetadata(currentEntry, sideMetadata);
		if (!publishedEntry) {
			sessionEntryCaches.delete(database.db);
			return;
		}
		if (!cached.entries.has(sessionKey) && !cached.keys.includes(sessionKey)) cached.keys = [...cached.keys, sessionKey].toSorted();
		cached.entries.set(sessionKey, publishedEntry);
		advanceSessionEntryCacheGeneration(cached, writeGeneration);
	});
	return {
		sideMetadata,
		entry
	};
}
function publishSessionEntryCacheInvalidation(database, update, writeGeneration) {
	let facts = update.facts;
	const cached = writeGeneration ? publishSqliteSessionEntryCacheUpsert(database, update, writeGeneration) : void 0;
	if (!writeGeneration) publishTrackedCacheUpdate(database, () => sessionEntryCaches.delete(database.db));
	if (facts?.kind === "participants" && cached) facts = {
		kind: "participants",
		projection: {
			participants: cached.sideMetadata.participants,
			participantCount: cached.sideMetadata.participantCount
		}
	};
	const entry = update.entry ? cached?.entry ?? projectSessionEntryCacheUpdate(update.entryJson, update.sideMetadata) : void 0;
	const fullEntry = update.entry && update.snapshotEntry ? projectSessionEntryCacheUpdate(update.entryJson, cached?.sideMetadata ?? update.sideMetadata, update.snapshotEntry, update.snapshots) : void 0;
	publishSessionSharingEntryChange(database, {
		...update,
		facts,
		...entry ? { entry } : {}
	});
	const identity = findOpenClawAgentDatabaseIdentity(database);
	const sharingChange = update.sharingUnchanged || facts?.kind === "unchanged" || facts?.kind === "participants" ? "unchanged" : "changed";
	emitPreparedSessionSharingChange(database, update.sessionKey, database.agentId, facts, identity && entry ? {
		kind: "metadata",
		sharingChange,
		previous: update.previousEntry && {
			sessionId: update.previousEntry.sessionId,
			lifecycleRevision: update.previousEntry.lifecycleRevision
		},
		prepared: {
			source: captureSessionEntryPublicationSource(database.db, {
				...identity,
				...writeGeneration ? { revision: writeGeneration.after } : {}
			}),
			entries: /* @__PURE__ */ new Map([[update.sessionKey, entry]]),
			...fullEntry ? { fullEntries: /* @__PURE__ */ new Map([[update.sessionKey, fullEntry]]) } : {}
		}
	} : {
		kind: "marker",
		sharingChange
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
		emitPreparedSessionSharingChange(database, sessionKey, database.agentId, {
			kind: "participants",
			projectionChanged: false
		}, {
			kind: "marker",
			sharingChange: "unchanged"
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
export { readExactSessionEntryCandidatesInDatabase as a, projectSessionEntryCacheUpdate as c, publishSessionEntryCacheParticipantUpdate as i, preserveSessionEntryCacheAcrossWrite as n, readSessionEntryCache as o, publishSessionEntryCacheInvalidation as r, trackSessionEntryCacheWrite as s, prepareSessionEntryCacheWrite as t };
