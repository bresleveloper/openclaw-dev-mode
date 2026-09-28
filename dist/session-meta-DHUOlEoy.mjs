import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { _t as recordLegacyAcpMigrationCompletion, dt as readLegacyAcpMigrationContext, mt as legacyAcpMigrationBindingMatches } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { r as mergeSessionEntry } from "./types-ByCc34Vn.mjs";
import { a as parseAcpDatabaseSessionKeyCandidates, c as selectAcpSessionRow, d as upsertAcpSessionMetaRow, i as legacyAcpDatabaseSessionKeys, l as selectAcpSessionRowForStoreEntry, n as buildAcpDatabaseSessionKey, o as resolveLegacyFreeAcpSessionKey, r as getAcpSessionKysely, s as resolveReadableAcpSessionRow, t as acpSessionRowMatchesEntry, u as selectLegacyFreeAcpSessionRows } from "./session-meta-keys-BA3YapJY.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { r as patchSessionEntryWithKey } from "./session-accessor.entry-BFzDgQIL.mjs";
import { n as resolveSessionStorePathForAcp, r as resolveStoreEntryForSessionKey, t as readSessionEntryFromStore } from "./session-meta-store-DCl8iLym.mjs";
import { n as rowToAcpSessionMeta, t as readAcpSessionMetaForEntry } from "./session-meta-readonly-CY2eWmkz.mjs";
import { randomUUID } from "node:crypto";
//#region src/acp/runtime/session-meta-legacy-cleanup.ts
async function clearLegacyEmbeddedAcpMetadata(params) {
	const sessionKeys = new Set(Array.from(params.sessionKeys, (sessionKey) => sessionKey?.trim()).filter((sessionKey) => Boolean(sessionKey)));
	for (const sessionKey of sessionKeys) await patchSessionEntryWithKey({
		storePath: params.storePath,
		agentId: params.agentId,
		sessionKey
	}, (entry) => {
		if (!entry.acp) return null;
		const next = { ...entry };
		delete next.acp;
		return next;
	}, {
		replaceEntry: true,
		skipMaintenance: true,
		assertCommitAllowed: params.assertCommitAllowed
	});
}
//#endregion
//#region src/acp/runtime/session-meta.ts
function bindAcpSessionMeta(params) {
	return {
		session_key: params.sessionKey,
		session_id: params.lifecycleRevision ?? params.sessionId ?? null,
		backend: params.meta.backend,
		agent: params.meta.agent,
		runtime_session_name: params.meta.runtimeSessionName,
		identity_json: params.meta.identity ? JSON.stringify(params.meta.identity) : null,
		mode: params.meta.mode,
		runtime_options_json: params.meta.runtimeOptions ? JSON.stringify(params.meta.runtimeOptions) : null,
		cwd: params.meta.cwd ?? null,
		state: params.meta.state,
		last_activity_at: params.meta.lastActivityAt,
		last_error: params.meta.lastError ?? null,
		updated_at: params.updatedAt
	};
}
function readAcpSessionMeta(params) {
	return readAcpSessionEntry({
		...params,
		sessionKey: params.sessionKey.trim(),
		clone: false
	})?.acp;
}
function readAcpSessionMetaBatch(params) {
	const result = /* @__PURE__ */ new Map();
	const entriesByKey = /* @__PURE__ */ new Map();
	for (const item of params.entries) {
		const rawSessionKey = item.sessionKey.trim();
		const sessionKey = buildAcpDatabaseSessionKey(rawSessionKey, item.agentId);
		if (item.entry?.acp) {
			result.set(item.entry, item.entry.acp);
			continue;
		}
		const legacyKeys = legacyAcpDatabaseSessionKeys(rawSessionKey, item.agentId, params.cfg);
		const entries = entriesByKey.get(sessionKey) ?? [];
		entries.push({
			entry: item.entry,
			rawSessionKey,
			legacyKeys
		});
		entriesByKey.set(sessionKey, entries);
	}
	if (entriesByKey.size === 0) return result;
	withExistingOpenClawStateDatabaseReadOnly(({ db: database }) => {
		const db = getAcpSessionKysely(database);
		const requestedKeySet = /* @__PURE__ */ new Set();
		for (const [sessionKey, entries] of entriesByKey) {
			requestedKeySet.add(sessionKey);
			for (const item of entries) for (const legacyKey of item.legacyKeys) requestedKeySet.add(legacyKey);
		}
		const requestedKeys = [...requestedKeySet];
		const keyChunks = [];
		for (let index = 0; index < requestedKeys.length; index += 500) keyChunks.push(requestedKeys.slice(index, index + 500));
		const rows = keyChunks.flatMap((chunk) => executeSqliteQuerySync(database, db.selectFrom("acp_sessions").selectAll().where("session_key", "in", chunk)).rows);
		const rowsByKey = new Map(rows.map((row) => [row.session_key, row]));
		const unresolved = [];
		for (const [sessionKey, entries] of entriesByKey) for (const item of entries) {
			const row = [sessionKey, ...item.legacyKeys].map((key) => rowsByKey.get(key)).map((candidateRow) => resolveReadableAcpSessionRow({
				row: candidateRow,
				entry: item.entry
			})).find((candidateRow) => candidateRow !== void 0);
			result.set(item.entry, row ? rowToAcpSessionMeta(row) : void 0);
			const legacyKey = !row && resolveLegacyFreeAcpSessionKey(item.rawSessionKey);
			if (legacyKey) unresolved.push({
				entry: item.entry,
				key: legacyKey
			});
		}
		const legacyRows = selectLegacyFreeAcpSessionRows(database, unresolved.map(({ key }) => key));
		for (const { entry, key } of unresolved) {
			const row = legacyRows.get(key)?.find((candidate) => acpSessionRowMatchesEntry(candidate, entry));
			result.set(entry, row ? rowToAcpSessionMeta(row) : void 0);
		}
	}, {
		env: params.env,
		path: params.databasePath
	});
	return result;
}
function selectAcpSessionRows(options = {}) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => executeSqliteQuerySync(db, getAcpSessionKysely(db).selectFrom("acp_sessions").selectAll().orderBy("last_activity_at", "desc").orderBy("session_key", "asc")).rows, options) ?? [];
}
function writeAcpSessionMetaForMigration(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return;
	const row = bindAcpSessionMeta({
		sessionKey,
		sessionId: params.sessionId,
		lifecycleRevision: params.lifecycleRevision,
		meta: params.meta,
		updatedAt: params.now?.() ?? Date.now()
	});
	runOpenClawStateWriteTransaction((database) => {
		upsertAcpSessionMetaRow(database.db, row);
		for (const identity of parseAcpDatabaseSessionKeyCandidates(sessionKey)) {
			const keys = /* @__PURE__ */ new Set([identity.storeSessionKey, resolveLegacyFreeAcpSessionKey(identity.storeSessionKey)]);
			for (const key of keys) if (key) sessionChanges.emit({
				sessionKey: key,
				agentId: identity.agentId
			}, database.db);
		}
	}, {
		database: params.database,
		env: params.env,
		path: params.databasePath
	});
}
function readAcpSessionEntry(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	const storeEntry = readSessionEntryFromStore(params);
	if (!storeEntry.storePath) return null;
	const acp = readAcpSessionMetaForEntry({
		sessionKey: storeEntry.storeSessionKey,
		agentId: storeEntry.agentId,
		cfg: storeEntry.cfg,
		entry: storeEntry.entry,
		env: params.env,
		databasePath: params.databasePath
	});
	return {
		cfg: storeEntry.cfg,
		agentId: storeEntry.agentId,
		storePath: storeEntry.storePath,
		sessionKey,
		storeSessionKey: storeEntry.storeSessionKey,
		entry: storeEntry.entry,
		acp,
		storeReadFailed: storeEntry.storeReadFailed
	};
}
async function listAcpSessionEntries(params) {
	const cfg = params.cfg ?? getRuntimeConfig();
	const rows = selectAcpSessionRows({
		env: params.env,
		path: params.databasePath
	});
	const entries = [];
	for (const row of rows) for (const databaseIdentity of parseAcpDatabaseSessionKeyCandidates(row.session_key)) {
		const sessionKey = databaseIdentity.storeSessionKey;
		const { agentId, storePath } = resolveSessionStorePathForAcp({
			sessionKey,
			agentId: databaseIdentity.agentId,
			cfg,
			env: params.env
		});
		if (!storePath) continue;
		let storeSessionKey;
		let entry;
		try {
			({storeSessionKey, entry} = resolveStoreEntryForSessionKey({
				...agentId ? { agentId } : {},
				storePath,
				sessionKey,
				...params.clone === false ? { clone: false } : {}
			}));
		} catch {
			continue;
		}
		const readableRow = resolveReadableAcpSessionRow({
			row,
			entry
		});
		if (!entry || !readableRow) continue;
		entries.push({
			cfg,
			agentId,
			storePath,
			sessionKey,
			storeSessionKey,
			entry,
			acp: rowToAcpSessionMeta(readableRow)
		});
		break;
	}
	return entries;
}
function mergeAcpForReturn(entry, acp) {
	return mergeSessionEntry(entry, { acp });
}
function sessionStoreUpdateOptions(params) {
	return {
		activeSessionKey: normalizeLowercaseStringOrEmpty(params.sessionKey),
		...params.skipMaintenance === true ? { skipMaintenance: true } : {},
		...params.takeCacheOwnership === true ? { takeCacheOwnership: true } : {}
	};
}
function consumeLegacyAcpMigrationSources(params) {
	if (!params.entry) return;
	const current = readLegacyAcpMigrationContext(params);
	if (current.sources.length === 0) return;
	if (current.entry?.sessionId !== params.entry.sessionId || current.entry.lifecycleRevision !== params.entry.lifecycleRevision) throw new Error("Canonical ACP session changed before legacy source consumption.");
	for (const source of current.sources) if (legacyAcpMigrationBindingMatches(source, current.entry)) recordLegacyAcpMigrationCompletion(params.database, source, params.now);
}
async function upsertAcpSessionMeta(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	const storeEntry = readSessionEntryFromStore({
		sessionKey,
		agentId: params.agentId,
		cfg: params.cfg,
		env: params.env,
		clone: false
	});
	if (!storeEntry.storePath) return null;
	const { entry, storePath } = storeEntry;
	const storageSessionKey = storeEntry.storeSessionKey;
	const databaseSessionKey = buildAcpDatabaseSessionKey(storageSessionKey, storeEntry.agentId);
	let current;
	let currentRowKey;
	let nextMeta;
	let preparedEntry;
	const updatedAt = params.now?.() ?? Date.now();
	runOpenClawStateWriteTransaction((database) => {
		params.assertCommitAllowed?.();
		const currentRow = selectAcpSessionRowForStoreEntry(database.db, storageSessionKey, storeEntry.agentId, storeEntry.cfg, entry);
		currentRowKey = currentRow?.session_key;
		current = currentRow ? rowToAcpSessionMeta(currentRow) : void 0;
		preparedEntry = mergeSessionEntry(entry, {
			updatedAt,
			...entry ? {} : { lifecycleRevision: randomUUID() }
		});
		nextMeta = params.mutate(current, current ? mergeAcpForReturn(preparedEntry, current) : entry);
	}, {
		env: params.env,
		path: params.databasePath
	});
	const metaToPersist = nextMeta;
	if (metaToPersist === void 0) return current ? mergeAcpForReturn(entry, current) : entry ?? null;
	if (metaToPersist === null) {
		const patched = entry ? await patchSessionEntryWithKey({
			...storeEntry.agentId ? { agentId: storeEntry.agentId } : {},
			storePath: storeEntry.storePath,
			sessionKey: storageSessionKey
		}, (currentEntry) => {
			const next = { ...currentEntry };
			delete next.acp;
			return next;
		}, {
			...sessionStoreUpdateOptions({
				...params,
				sessionKey: storageSessionKey
			}),
			replaceEntry: true,
			assertCommitAllowed: params.assertCommitAllowed
		}) : null;
		runOpenClawStateWriteTransaction((database) => {
			params.assertCommitAllowed?.();
			consumeLegacyAcpMigrationSources({
				database: database.db,
				agentId: storeEntry.agentId,
				storePath,
				sessionKey: patched?.sessionKey ?? storageSessionKey,
				entry: patched?.entry ?? entry,
				env: params.env,
				now: updatedAt
			});
			const sessionKeysToDelete = /* @__PURE__ */ new Set([databaseSessionKey]);
			if (currentRowKey && !resolveLegacyFreeAcpSessionKey(currentRowKey)) sessionKeysToDelete.add(currentRowKey);
			if (patched?.sessionKey) sessionKeysToDelete.add(buildAcpDatabaseSessionKey(patched.sessionKey, storeEntry.agentId));
			for (const aliases of selectLegacyFreeAcpSessionRows(database.db, [storageSessionKey, patched?.sessionKey ?? storageSessionKey]).values()) for (const alias of aliases) if (acpSessionRowMatchesEntry(alias, patched?.entry ?? entry)) sessionKeysToDelete.add(alias.session_key);
			for (const key of sessionKeysToDelete) executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).deleteFrom("acp_sessions").where("session_key", "=", key));
			sessionChanges.emit({
				agentId: storeEntry.agentId,
				sessionKey: patched?.sessionKey ?? storageSessionKey
			}, database.db);
		}, {
			env: params.env,
			path: params.databasePath
		});
		await clearLegacyEmbeddedAcpMetadata({
			agentId: storeEntry.agentId,
			storePath: storeEntry.storePath,
			sessionKeys: [storageSessionKey, patched?.sessionKey],
			assertCommitAllowed: params.assertCommitAllowed
		});
		return patched?.entry ?? null;
	}
	const persisted = await patchSessionEntryWithKey({
		...storeEntry.agentId ? { agentId: storeEntry.agentId } : {},
		storePath: storeEntry.storePath,
		sessionKey: storageSessionKey
	}, (currentEntry) => {
		const next = mergeSessionEntry(currentEntry, { updatedAt });
		delete next.acp;
		return next;
	}, {
		...sessionStoreUpdateOptions({
			...params,
			sessionKey: storageSessionKey
		}),
		fallbackEntry: preparedEntry,
		replaceEntry: true,
		assertCommitAllowed: params.assertCommitAllowed
	});
	if (!persisted) return null;
	await clearLegacyEmbeddedAcpMetadata({
		agentId: storeEntry.agentId,
		storePath: storeEntry.storePath,
		sessionKeys: [storageSessionKey, persisted.sessionKey],
		assertCommitAllowed: params.assertCommitAllowed
	});
	runOpenClawStateWriteTransaction((database) => {
		params.assertCommitAllowed?.();
		consumeLegacyAcpMigrationSources({
			database: database.db,
			agentId: storeEntry.agentId,
			storePath,
			sessionKey: persisted.sessionKey,
			entry: persisted.entry,
			env: params.env,
			now: updatedAt
		});
		const persistedDatabaseSessionKey = buildAcpDatabaseSessionKey(persisted.sessionKey, storeEntry.agentId);
		upsertAcpSessionMetaRow(database.db, bindAcpSessionMeta({
			sessionKey: persistedDatabaseSessionKey,
			sessionId: persisted.entry.sessionId,
			lifecycleRevision: persisted.entry.lifecycleRevision,
			meta: metaToPersist,
			updatedAt: persisted.entry.updatedAt
		}));
		if (persistedDatabaseSessionKey !== databaseSessionKey) executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).deleteFrom("acp_sessions").where("session_key", "=", databaseSessionKey));
		if (currentRowKey && currentRowKey !== persistedDatabaseSessionKey && !resolveLegacyFreeAcpSessionKey(currentRowKey)) executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).deleteFrom("acp_sessions").where("session_key", "=", currentRowKey));
		if (persistedDatabaseSessionKey !== persisted.sessionKey && !resolveLegacyFreeAcpSessionKey(persisted.sessionKey)) {
			const legacyRow = selectAcpSessionRow(database.db, persisted.sessionKey);
			if (legacyRow && acpSessionRowMatchesEntry(legacyRow, persisted.entry)) executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).deleteFrom("acp_sessions").where("session_key", "=", persisted.sessionKey));
		}
		for (const aliases of selectLegacyFreeAcpSessionRows(database.db, [storageSessionKey, persisted.sessionKey]).values()) for (const alias of aliases) if (acpSessionRowMatchesEntry(alias, persisted.entry)) executeSqliteQuerySync(database.db, getAcpSessionKysely(database.db).deleteFrom("acp_sessions").where("session_key", "=", alias.session_key));
		sessionChanges.emit({
			agentId: storeEntry.agentId,
			sessionKey: persisted.sessionKey
		}, database.db);
	}, {
		env: params.env,
		path: params.databasePath
	});
	return mergeAcpForReturn(persisted.entry, metaToPersist);
}
//#endregion
export { upsertAcpSessionMeta as a, readAcpSessionMetaBatch as i, readAcpSessionEntry as n, writeAcpSessionMetaForMigration as o, readAcpSessionMeta as r, listAcpSessionEntries as t };
