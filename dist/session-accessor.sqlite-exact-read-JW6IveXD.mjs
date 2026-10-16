import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { i as executeSqliteQueryTakeFirstSync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { t as assertTransactionUsable } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { C as classifyOpenClawAgentDatabaseReadError, _ as isOpenClawAgentDatabasePathCurrent, v as readOpenClawAgentDatabaseIdentity, w as isOpenClawAgentDatabaseReadOpenFailure } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { s as openOpenClawAgentDatabase } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as withOpenClawAgentDatabaseReadOnly, t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { o as readExactSessionEntryCandidatesInDatabase } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { d as readWithCanonicalSessionReaderContinuation, h as SessionCanonicalKeyMigrationRequiredError, r as assertCanonicalSqliteSessionKeysCurrent, u as readWithCanonicalSessionAdmission } from "./session-canonical-key-D1TSJMmX.mjs";
import { a as readExactSessionEntryRow, c as readSessionEntryByIdInDatabase, l as readSessionEntryRow, s as readQualifiedSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
//#region src/config/sessions/session-accessor.sqlite-exact-read.ts
/** Private prepared reads must reject a different physical owner at the captured path. */
function loadSessionEntryReadOnlyInScope(scope) {
	return resolveSessionEntry(scope, {
		readOnly: true,
		databaseAgentId: scope.databaseAgentId,
		projection: scope.projection
	}).existing;
}
/** Resolves one exact canonical entry without materializing the store. */
function resolveSessionEntry(scope, options = {}) {
	const resolved = options.databaseAgentId && scope.storePath ? {
		...resolveSqliteScope({
			...scope,
			agentId: scope.agentId ?? parseAgentSessionKey(scope.sessionKey)?.agentId ?? options.databaseAgentId,
			storePath: void 0
		}),
		path: scope.storePath,
		databaseAgentId: options.databaseAgentId
	} : resolveSqliteScope(scope);
	if (options.databaseAgentId) resolved.databaseAgentId = options.databaseAgentId;
	const read = (database) => {
		let selected = void 0;
		let failure;
		if (options.onReadError) try {
			assertCanonicalSqliteSessionKeysCurrent(database);
		} catch (error) {
			if (!(error instanceof SessionCanonicalKeyMigrationRequiredError)) throw error;
			failure = { error };
		}
		if (!failure) try {
			const projection = options.readOnly ? options.projection : "full";
			selected = options.keyFormat === "agent-qualified" ? readQualifiedSessionEntryRow(database, resolved.agentId, resolved.sessionKey, {
				allowCanonicalMove: options.allowCanonicalMove,
				projection
			}) : readSessionEntryRow(database, resolved.sessionKey, projection);
		} catch (error) {
			if (!options.onReadError) throw error;
			failure = { error };
		}
		if (options.onReadSource) {
			const source = readOpenClawAgentDatabaseIdentity(database);
			if (!isOpenClawAgentDatabasePathCurrent(database)) throw new Error("Session database physical identity changed during read");
			options.onReadSource({
				agentId: database.agentId,
				path: database.path,
				databaseIdentity: source.identity,
				databaseBirthtime: source.birthtime
			});
		}
		if (failure) options.onReadError(failure.error, database.db);
		return {
			existing: selected?.entry ?? void 0,
			legacyKeys: [],
			normalizedKey: selected?.row.session_key ?? resolved.sessionKey
		};
	};
	if (options.readOnly) {
		const result = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, options.continuation, () => read(database)), toDatabaseOptions(resolved));
		return result.found ? result.value : {
			existing: void 0,
			legacyKeys: [],
			normalizedKey: resolved.sessionKey
		};
	}
	return read(openOpenClawAgentDatabase(toDatabaseOptions(resolved)));
}
var SessionEntryDataReadError = class extends Error {
	constructor(readError, database) {
		const classified = sqlitePrimaryResultCode(readError) === 1 ? classifyOpenClawAgentDatabaseReadError(database, readError) : readError;
		super("Session entry data read failed", { cause: classified });
		this.database = database;
		this.readError = classified;
	}
	assertSettled() {
		assertTransactionUsable(this.database);
		if (this.database.isOpen && this.database.isTransaction) throw this.readError;
	}
};
/** Unreadable stores and rows become data; authority, source checks and cleanup still throw. */
function loadSessionEntryReadOnlyResultInScope(scope, continuation, onReadSource) {
	try {
		return ok(resolveSessionEntry(scope, {
			readOnly: true,
			databaseAgentId: scope.databaseAgentId,
			projection: scope.projection,
			continuation,
			onReadSource,
			onReadError(error, database) {
				throw new SessionEntryDataReadError(error, database);
			}
		}).existing);
	} catch (error) {
		if (error instanceof SessionEntryDataReadError) {
			error.assertSettled();
			return err(error.readError);
		}
		if (isOpenClawAgentDatabaseReadOpenFailure(error)) return err(error);
		throw error;
	}
}
function assertCapturedSessionEntryReadSource(source, database) {
	if (typeof source.databaseIdentity === "string" && (!database || database.path !== source.path)) assertExistingDatabaseIdentity(source.path, `file:${source.databaseIdentity}`);
	if (!database) {
		if (typeof source.databaseIdentity === "symbol") throw new Error("Captured session database is no longer open");
		return;
	}
	const physical = readOpenClawAgentDatabaseIdentity(database);
	if (database.agentId !== source.agentId || physical.identity !== source.databaseIdentity || physical.birthtime !== source.databaseBirthtime || !isOpenClawAgentDatabasePathCurrent(database)) throw new Error("Captured session database changed before read");
}
/** Retained windows occupy a key even when they have no current readable entry. */
function retainSessionEntryKeyAbsence(params) {
	const capturedSource = params.source;
	const source = retainOpenClawAgentDatabaseReadOnly({
		agentId: capturedSource.agentId,
		path: capturedSource.path,
		env: params.env
	});
	if (!source.found) throw new Error("Captured session database is unavailable");
	const assertSourceCurrent = () => {
		source.claim.assertCurrent();
		assertCapturedSessionEntryReadSource(capturedSource, source.database);
	};
	const assertCurrent = () => {
		assertSourceCurrent();
		if (!params.sessionKeys.length) return;
		const occupied = executeSqliteQueryTakeFirstSync(source.database.db, getSessionKysely(source.database.db).selectFrom("session_nodes").select("session_key").where("session_key", "in", sqliteStringSet(params.sessionKeys)).limit(1));
		assertSourceCurrent();
		if (occupied) throw new Error(`Session "${params.canonicalKey}" has ambiguous stored identity. Select an unambiguous session; stored rows and history were not changed.`);
	};
	try {
		assertCurrent();
		return {
			assertCurrent,
			release: source.claim.release
		};
	} catch (error) {
		source.claim.release();
		throw error;
	}
}
/** Loads one exact persisted-key entry from the additive SQLite session store. */
function loadExactSessionEntry(scope) {
	return loadExactSessionEntryCandidates({
		...scope,
		sessionKeys: [scope.sessionKey],
		readOnly: false
	})[0];
}
/** Reads exact candidates for one logical session through a single store admission. */
function loadExactSessionEntryCandidates(scope) {
	const sessionKeys = scope.sessionKeys.map((key) => key.trim()).filter(Boolean);
	const [sessionKey] = sessionKeys;
	if (!sessionKey) return [];
	const options = "readSource" in scope ? {
		agentId: scope.readSource.agentId,
		path: scope.readSource.path,
		...scope.env ? { env: scope.env } : {}
	} : toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey
	}));
	const read = (database) => {
		const physical = readOpenClawAgentDatabaseIdentity(database);
		if (scope.expectedSource) assertCapturedSessionEntryReadSource(scope.expectedSource, database);
		const entries = sessionKeys.flatMap((key) => {
			const entry = readExactSessionEntryRow(database, key, scope.projection, "canonical")?.entry;
			return entry ? [{
				sessionKey: key,
				entry
			}] : [];
		});
		scope.onReadSource?.({
			agentId: database.agentId,
			path: database.path,
			databaseIdentity: physical.identity,
			databaseBirthtime: physical.birthtime
		});
		return entries;
	};
	if (!scope.readOnly) return read(openOpenClawAgentDatabase(options));
	const result = withOpenClawAgentDatabaseReadOnly(read, options);
	return result.found ? result.value : [];
}
/** Loads a visible current ID, falling back to legacy trimmed IDs only on an exact miss. */
function loadSessionEntryByIdReadOnly(scope) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionEntryByIdInDatabase(database, scope), toDatabaseOptions(resolved));
	return result.found ? result.value : void 0;
}
/** Exact persisted-key probe on the read-only handle, for per-row hot paths. */
function loadExactSessionEntryReadOnly(scope) {
	return loadExactSessionEntryCandidates({
		...scope,
		sessionKeys: [scope.sessionKey],
		readOnly: true
	})[0];
}
/** Probe the selected store without rerouting an incognito-shaped key to ephemeral state. */
function loadExactSessionEntryFromStoreReadOnly(scope) {
	const options = toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey: ""
	}));
	return loadExactSessionEntryCandidates({
		readSource: {
			...options,
			path: resolveOpenClawAgentSqlitePath(options)
		},
		projection: scope.projection,
		readOnly: true,
		sessionKeys: [scope.sessionKey]
	})[0];
}
function loadExactSessionEntryCandidatesReadOnlyBatch(scopes) {
	const results = [];
	const targetCache = /* @__PURE__ */ new Map();
	const groups = /* @__PURE__ */ new Map();
	for (const [index, scope] of scopes.entries()) {
		const sessionKeys = scope.sessionKeys.map((key) => key.trim()).filter(Boolean);
		const [sessionKey] = sessionKeys;
		if (!sessionKey) {
			results[index] = ok([]);
			continue;
		}
		try {
			const options = toDatabaseOptions(resolveSqliteScope({
				...scope,
				sessionKey
			}, targetCache));
			const groupKey = [
				options.agentId,
				resolveOpenClawAgentSqlitePath(options),
				scope.projection ?? "full",
				scope.clone !== false
			].join("\0");
			const group = groups.get(groupKey) ?? {
				options,
				projection: scope.projection,
				clone: scope.clone !== false,
				requests: []
			};
			group.requests.push({
				index,
				sessionKeys
			});
			groups.set(groupKey, group);
		} catch (error) {
			results[index] = err(error);
		}
	}
	for (const group of groups.values()) try {
		const read = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionAdmission(database, () => {
			assertCanonicalSqliteSessionKeysCurrent(database);
			const source = {
				agentId: database.agentId,
				path: database.path
			};
			const grouped = readExactSessionEntryCandidatesInDatabase(database, group.requests.map((request) => request.sessionKeys), group.projection, { clone: group.clone });
			for (const [ordinal, request] of group.requests.entries()) {
				const result = grouped[ordinal];
				results[request.index] = result;
				if (result.ok) scopes[request.index].onReadSource?.(source);
			}
		}), group.options);
		if (!read.found) {
			if (read.reason !== "database-missing") throw new SessionMetadataUnavailableError(read.reason);
			for (const { index } of group.requests) results[index] = ok([]);
		}
	} catch (error) {
		for (const { index } of group.requests) results[index] = err(error);
	}
	return scopes.map((_, index) => expectDefined(results[index], "exact session batch read result"));
}
//#endregion
export { loadExactSessionEntryFromStoreReadOnly as a, loadSessionEntryReadOnlyInScope as c, retainSessionEntryKeyAbsence as d, loadExactSessionEntryCandidatesReadOnlyBatch as i, loadSessionEntryReadOnlyResultInScope as l, loadExactSessionEntry as n, loadExactSessionEntryReadOnly as o, loadExactSessionEntryCandidates as r, loadSessionEntryByIdReadOnly as s, assertCapturedSessionEntryReadSource as t, resolveSessionEntry as u };
