import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as SessionCanonicalKeyMigrationRequiredError } from "./session-canonical-key-error-YHax-6is.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as readOpenClawAgentDatabaseIdentity, i as isOpenClawAgentDatabasePathCurrent } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { D as classifyOpenClawAgentDatabaseReadError, O as isOpenClawAgentDatabaseReadOpenFailure } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { d as readWithCanonicalSessionAdmission, f as readWithCanonicalSessionReaderContinuation, r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-B7chVWi3.mjs";
import { n as captureMemoryExactSessionReader, t as assertMemoryExactReadSource } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as assertCapturedSessionEntryReadSource } from "./session-entry-read-source-CtAlEtSu.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { a as readExactSessionEntryCandidatesInDatabase } from "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { c as readQualifiedSessionEntryRow, o as readExactSessionEntryRow, p as readSessionEntryRow, u as readSessionEntryByIdInDatabase } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
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
	const memory = captureMemoryExactSessionReader({
		...scope,
		agentId: options.databaseAgentId ?? scope.agentId
	});
	if (memory) {
		const normalizedKey = scope.sessionKey.trim();
		const existing = memory.read(normalizedKey, options.readOnly ? options.projection : "full");
		if (memory.source) options.onReadSource?.(memory.source);
		return {
			existing,
			legacyKeys: [],
			normalizedKey
		};
	}
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
		let selected;
		let failure;
		if (options.onReadError && !options.readFacts) try {
			assertCanonicalSqliteSessionKeysCurrent(database);
		} catch (error) {
			if (!(error instanceof SessionCanonicalKeyMigrationRequiredError)) throw error;
			failure = { error };
		}
		if (!failure) try {
			const projection = options.readOnly ? options.projection : "full";
			if (options.readFacts) {
				const entry = options.readFacts(database, resolved.sessionKey, projection);
				selected = entry ? {
					entry,
					row: { session_key: resolved.sessionKey }
				} : void 0;
			} else selected = options.keyFormat === "agent-qualified" ? readQualifiedSessionEntryRow(database, resolved.agentId, resolved.sessionKey, {
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
		const readOnly = (database) => options.readFacts ? read(database) : readWithCanonicalSessionReaderContinuation(database, options.continuation, () => read(database));
		if (options.capturedDatabase) return readOnly(options.capturedDatabase);
		const result = withOpenClawAgentDatabaseReadOnly(readOnly, toDatabaseOptions(resolved));
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
function loadSessionEntryReadOnlyResultInScope(scope, continuation, onReadSource, readFacts, capturedDatabase) {
	try {
		return ok(resolveSessionEntry(scope, {
			readOnly: true,
			databaseAgentId: scope.databaseAgentId,
			projection: scope.projection,
			continuation,
			onReadSource,
			readFacts,
			capturedDatabase,
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
	const memory = captureMemoryExactSessionReader("readSource" in scope ? {
		agentId: scope.readSource.agentId,
		storePath: scope.readSource.path,
		sessionKey
	} : {
		...scope,
		sessionKey
	});
	if (memory) {
		assertMemoryExactReadSource(scope.expectedSource, memory.source);
		const entries = sessionKeys.flatMap((key) => {
			const entry = memory.read(key, scope.projection);
			if (!entry) return [];
			return [{
				sessionKey: key,
				entry
			}];
		});
		if (memory.source) scope.onReadSource?.(memory.source);
		return entries;
	}
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
		const projection = scope.projection;
		const entries = sessionKeys.flatMap((key) => {
			const entry = readExactSessionEntryRow(database, key, projection, "canonical")?.entry;
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
	const memory = captureMemoryExactSessionReader(scope);
	if (memory) {
		const entries = memory.entries("list").toSorted((left, right) => (scope.orderBy === "updatedAt" ? right.entry.updatedAt - left.entry.updatedAt : 0) || (left.sessionKey < right.sessionKey ? -1 : left.sessionKey > right.sessionKey ? 1 : 0));
		const selected = (scope.orderBy ? void 0 : entries.find(({ entry }) => entry.sessionId === scope.sessionId)) ?? entries.find(({ entry }) => entry.sessionId.trim() === scope.sessionId);
		if (!selected) return;
		const entry = memory.read(selected.sessionKey, scope.projection);
		return entry ? {
			sessionKey: selected.sessionKey,
			entry
		} : void 0;
	}
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
	const memory = captureMemoryExactSessionReader(scope);
	if (memory) {
		const entry = memory.read(scope.sessionKey, scope.projection);
		return entry ? {
			sessionKey: scope.sessionKey,
			entry
		} : void 0;
	}
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
			const memory = captureMemoryExactSessionReader({
				...scope,
				sessionKey
			});
			if (memory) {
				results[index] = ok(sessionKeys.flatMap((key) => {
					const entry = memory.read(key, scope.projection === "delivery" ? "list" : scope.projection);
					if (!entry) return [];
					if (scope.projection !== "delivery") return [{
						sessionKey: key,
						entry
					}];
					const { sessionId, updatedAt, delivery, groupId } = entry;
					return [{
						sessionKey: key,
						entry: {
							sessionId,
							updatedAt,
							delivery,
							groupId
						}
					}];
				}));
				if (memory.source) scope.onReadSource?.(memory.source);
				continue;
			}
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
			try {
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
			} catch (error) {
				if (sqlitePrimaryResultCode(error) === 1) throw new SessionEntryDataReadError(error, database.db);
				throw error;
			}
		}), group.options);
		if (!read.found) {
			if (read.reason !== "database-missing") throw new SessionMetadataUnavailableError(read.reason);
			for (const { index } of group.requests) results[index] = ok([]);
		}
	} catch (error) {
		let readError = error;
		if (error instanceof SessionEntryDataReadError) {
			error.assertSettled();
			readError = error.readError;
		}
		for (const { index } of group.requests) results[index] = err(readError);
	}
	return scopes.map((_, index) => expectDefined(results[index], "exact session batch read result"));
}
//#endregion
export { loadExactSessionEntryReadOnly as a, loadSessionEntryReadOnlyResultInScope as c, loadExactSessionEntryFromStoreReadOnly as i, resolveSessionEntry as l, loadExactSessionEntryCandidates as n, loadSessionEntryByIdReadOnly as o, loadExactSessionEntryCandidatesReadOnlyBatch as r, loadSessionEntryReadOnlyInScope as s, loadExactSessionEntry as t };
