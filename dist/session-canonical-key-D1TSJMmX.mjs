import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, l as prepareSqliteQueryTakeFirstSync, n as createSqliteQueryCache, o as iterateSqliteQuerySync, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { a as readSqliteDataVersion, n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { a as withSqlitePostCommitPublications, i as stageSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { _ as isOpenClawAgentDatabasePathCurrent, b as assertCanonicalSessionValidationSchema, g as findOpenClawAgentDatabaseIdentity, i as getOpenClawAgentDatabaseValidation, o as hasOpenClawAgentCanonicalValidation, t as adoptOpenClawAgentDatabaseValidation, u as markOpenClawAgentCanonicalValidation } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { i as normalizeMainKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as parseSqliteSessionEntryRecord } from "./session-entry-json-CtwFM7Hi.mjs";
import { n as sessionEntrySnapshotColumns, t as attachSessionEntrySnapshots } from "./session-entry-snapshots-DO3oGsuC.mjs";
import { a as normalizeStoreSessionKey, o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-Bb_svqyv.mjs";
import { n as projectSqliteSessionOwner, t as hasSqliteSessionOwnerColumns } from "./session-accessor.sqlite-owner-projection-EwCluh1i.mjs";
import { i as projectCanonicalSessionEntryShape } from "./store-entry-shape-BzuAi3ao.mjs";
//#region src/config/sessions/session-canonical-row.ts
var SessionCanonicalKeyMigrationRequiredError = class extends Error {
	constructor(detail) {
		super(`${detail}; stop the Gateway and run openclaw doctor --fix`);
		this.code = "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED";
		this.name = "SessionCanonicalKeyMigrationRequiredError";
	}
};
function canonicalSessionKeyMigrationRequiredError(detail) {
	return new SessionCanonicalKeyMigrationRequiredError(detail);
}
/** One validator serves full Doctor scans, pending rows, and final writer certification. */
function validateCanonicalSessionRow(row, mode = "admission") {
	const record = row.entry_valid === 1 || mode === "read" && row.entry_valid === 0 ? parseSqliteSessionEntryRecord({
		entry_json: row.entry_json,
		current_session_id: row.current_session_id
	}) : null;
	return validateCanonicalSessionRowEntry(row, record ? projectCanonicalSessionEntryShape(record) : null, mode);
}
/** Exact readers validate the entry decoded from the same selected row. */
function validateCanonicalSessionRowEntry(row, entry, mode = "admission") {
	if (row.entry_json === "{}" && row.entry_valid === -1 && row.retained_window_id === row.current_session_id) return;
	if (!entry || row.entry_valid !== 1 && (mode !== "read" || row.entry_valid !== 0)) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
	if ((row.parent_session_key ?? void 0) !== (entry.parentSessionKey ?? entry.spawnedBy ?? void 0) || (row.spawned_by ?? void 0) !== (entry.spawnedBy ?? void 0) || (row.fork_source_session_key ?? void 0) !== (entry.forkSource?.sessionKey ?? void 0)) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
	const deliveryCanonicalKey = resolveDeliveryProvenCanonicalSessionKey(row.session_key, entry);
	if (deliveryCanonicalKey !== row.session_key) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${deliveryCanonicalKey}`);
	const trimmed = row.session_key.trim();
	const parsed = parseAgentSessionKey(trimmed);
	if (row.session_key !== trimmed || normalizeStoreSessionKey(trimmed) !== trimmed || !parsed && trimmed !== "global" && trimmed !== "unknown") throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${trimmed || row.session_key}`);
	for (const lineageKey of [
		row.parent_session_key,
		row.spawned_by,
		row.fork_source_session_key
	]) {
		if (!lineageKey) continue;
		const normalized = normalizeStoreSessionKey(lineageKey);
		const lineageParsed = parseAgentSessionKey(normalized);
		if (normalized !== lineageKey || !lineageParsed && normalized !== "global" && normalized !== "unknown") throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${normalized || lineageKey}`);
	}
	return entry;
}
//#endregion
//#region src/config/sessions/session-canonical-validation-deferral.ts
const deferral = resolveGlobalSingleton(Symbol.for("openclaw.canonicalSessionValidationDeferral"), () => ({}));
var CanonicalSessionValidationDeferred = class extends Error {
	constructor() {
		super("Canonical session validation requires asynchronous readiness");
	}
};
/** Only initial asynchronous admission may defer; committed mutation guards stay synchronous. */
function deferCanonicalSessionValidation(database) {
	const scope = deferral.current;
	if (!scope) return;
	const pathname = database.db.location();
	if (!pathname) return;
	scope.pending ??= {
		agentId: database.agentId,
		path: pathname
	};
	throw new CanonicalSessionValidationDeferred();
}
function withCanonicalSessionValidationDeferral(read) {
	const previous = deferral.current;
	const scope = {};
	let asynchronousResult = false;
	deferral.current = scope;
	try {
		const value = read();
		if (isPromiseLike(value)) {
			asynchronousResult = true;
			Promise.resolve(value).catch(() => {});
			throw new Error("Canonical session validation deferral callbacks must remain synchronous");
		}
		if (scope.pending) return {
			kind: "pending",
			database: scope.pending
		};
		return {
			kind: "complete",
			value
		};
	} catch (error) {
		if (scope.pending && !asynchronousResult) return {
			kind: "pending",
			database: scope.pending
		};
		throw error;
	} finally {
		deferral.current = previous;
	}
}
//#endregion
//#region src/config/sessions/session-canonical-key.ts
const mainKeyReader = createSqliteQueryCache((db) => prepareSqliteQueryTakeFirstSync(db, () => getNodeSqliteKysely(db).selectFrom("session_key_contract").select("main_key").where("id", "=", 1)));
const readerAdmissions = resolveGlobalSingleton(Symbol.for("openclaw.canonicalSessionReaderAdmissions"), () => /* @__PURE__ */ new WeakMap());
const canonicalReadScope = resolveGlobalSingleton(Symbol.for("openclaw.canonicalSessionReadScope"), () => ({}));
/** Only first admission needs a shared snapshot; warm materialized reads keep their existing cost. */
function readWithCanonicalSessionAdmission(database, read) {
	if (database.db.isTransaction) return read();
	const previous = canonicalReadScope.current;
	const scope = { database: database.db };
	canonicalReadScope.current = scope;
	try {
		return read();
	} catch (error) {
		if (scope.snapshotRequired === void 0 || error !== scope.snapshotRequired) throw error;
	} finally {
		canonicalReadScope.current = previous;
	}
	return withSqlitePostCommitPublications(database.db, () => runSqliteDeferredTransactionSync(database.db, read));
}
function rememberReaderAdmission(database, proof) {
	let cell = readerAdmissions.get(database);
	if (!cell) {
		cell = {
			committed: false,
			continuations: /* @__PURE__ */ new Set()
		};
		readerAdmissions.set(database, cell);
		const owned = cell;
		const unregister = registerNodeSqliteDisposeCallback(database, () => {
			revokeReaderContinuations(owned);
			readerAdmissions.delete(database);
			unregister();
		});
	}
	const owned = cell;
	const previous = owned.proof;
	const previouslyCommitted = owned.committed;
	if (database.isTransaction) {
		if (!stageSqliteTransactionState(database, {
			stage: () => {
				revokeReaderContinuations(owned);
				owned.proof = proof;
				owned.committed = false;
			},
			rollback: () => {
				if (readerAdmissions.get(database) === owned && owned.proof === proof) {
					revokeReaderContinuations(owned);
					owned.proof = previous;
					owned.committed = previouslyCommitted;
				}
			},
			commit: () => {
				if (readerAdmissions.get(database) === owned && owned.proof === proof) owned.committed = true;
			}
		})) {
			revokeReaderContinuations(owned);
			owned.proof = void 0;
			owned.committed = false;
		}
	} else {
		revokeReaderContinuations(owned);
		owned.proof = proof;
		owned.committed = true;
	}
}
function revokeReaderContinuations(cell) {
	for (const live of cell.continuations) Atomics.store(new Int32Array(live), 0, 0);
	cell.continuations.clear();
}
function isReaderContinuationLive(receipt) {
	return Atomics.load(new Int32Array(receipt.live), 0) === 1 && Atomics.load(new Int32Array(receipt.validation.valid), 0) === 1 && Atomics.load(new Int32Array(receipt.validation.canonicalReady), 0) === 1 === receipt.canonicalReady;
}
function matchesReaderContinuationDatabase(database, receipt) {
	const identity = findOpenClawAgentDatabaseIdentity(database);
	return database.db.isOpen && database.agentId === receipt.agentId && identity?.identity === receipt.identity && identity.birthtime === receipt.birthtime && isOpenClawAgentDatabasePathCurrent({
		db: database.db,
		path: database.path ?? identity.filename
	}) && receipt.validation.agentId === receipt.agentId && receipt.validation.identity === receipt.identity && isReaderContinuationLive(receipt);
}
/** Borrow only existing committed admission; capture never opens or queries SQLite. */
function captureCanonicalSessionReaderContinuation(database) {
	const cell = readerAdmissions.get(database.db);
	const proof = cell?.proof;
	if (!database.db.isOpen || database.db.isTransaction || !cell?.committed || !proof) return;
	const validation = getOpenClawAgentDatabaseValidation(database);
	const identity = findOpenClawAgentDatabaseIdentity(database);
	if (!validation || validation !== proof.physicalValidation || typeof identity?.identity !== "string") return;
	const receipt = {
		agentId: database.agentId,
		identity: identity.identity,
		birthtime: identity.birthtime,
		mainKey: proof.mainKey,
		canonicalReady: proof.canonicalReady,
		validation,
		live: new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)
	};
	Atomics.store(new Int32Array(receipt.live), 0, 1);
	const isCurrent = () => database.db.isOpen && !database.db.isTransaction && readerAdmissions.get(database.db) === cell && cell.proof === proof && cell.committed && getOpenClawAgentDatabaseValidation(database) === validation && matchesReaderContinuationDatabase(database, receipt);
	if (!isCurrent()) return;
	cell.continuations.add(receipt.live);
	return {
		receipt,
		assertCurrent: () => {
			if (!isCurrent()) throw new Error("Canonical session reader continuation is no longer current");
		},
		release: () => {
			Atomics.store(new Int32Array(receipt.live), 0, 0);
			cell.continuations.delete(receipt.live);
		}
	};
}
/** Continue one retained reader without admitting unrelated reads on a pooled handle. */
function readWithCanonicalSessionReaderContinuation(database, receipt, read) {
	const identity = findOpenClawAgentDatabaseIdentity(database);
	if (!receipt || database.db.isTransaction || !identity || !matchesReaderContinuationDatabase(database, receipt) || !adoptOpenClawAgentDatabaseValidation({
		...database,
		path: database.path ?? identity.filename
	}, receipt.validation)) return readWithCanonicalSessionAdmission(database, read);
	const scope = {
		database: database.db,
		continuation: receipt
	};
	const assertCurrent = () => {
		if (scope.usedContinuation && !matchesReaderContinuationDatabase(database, receipt)) throw new Error("Canonical session reader continuation is no longer current");
	};
	const value = withSqlitePostCommitPublications(database.db, () => runSqliteDeferredTransactionSync(database.db, () => {
		const previous = canonicalReadScope.current;
		canonicalReadScope.current = scope;
		try {
			const result = read();
			assertCurrent();
			return result;
		} finally {
			canonicalReadScope.current = previous;
		}
	}));
	assertCurrent();
	return value;
}
function isCanonicalSessionKey(sessionKey) {
	const trimmed = sessionKey.trim();
	if (!trimmed || sessionKey !== trimmed) return false;
	if (normalizeStoreSessionKey(sessionKey) !== sessionKey) return false;
	const parsed = parseAgentSessionKey(trimmed);
	return trimmed === "global" || trimmed === "unknown" || parsed !== null && trimmed.startsWith(`agent:${parsed.agentId}:`);
}
function assertCanonicalSessionKeyWrite(sessionKey, expectedAgentId) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!isCanonicalSessionKey(sessionKey) || expectedAgentId && parsed && parsed.agentId !== normalizeAgentId(expectedAgentId)) throw canonicalSessionKeyMigrationRequiredError(`refusing non-canonical session key write ${sessionKey}`);
}
function readCanonicalSessionMainKey(database) {
	return normalizeMainKey(mainKeyReader(database.db)()?.main_key);
}
function assertCanonicalSessionEntryLineageWrite(entry) {
	const sessionKeys = [
		entry.parentSessionKey,
		entry.spawnedBy,
		entry.forkSource?.sessionKey
	].filter((sessionKey) => sessionKey !== void 0);
	for (const sessionKey of sessionKeys) assertCanonicalSessionKeyWrite(sessionKey);
}
/** Query shape shared by complete inventories and bounded canonical validation. */
function canonicalSessionValidationQuery(database, options = {}) {
	return getNodeSqliteKysely(database.db).selectFrom("session_nodes").leftJoin("session_windows as retained_window", (join) => join.onRef("retained_window.session_id", "=", "session_nodes.current_session_id").onRef("retained_window.session_key", "=", "session_nodes.session_key")).select([
		"session_nodes.session_key",
		"session_nodes.current_session_id",
		"session_nodes.entry_valid",
		"session_nodes.entry_json",
		"session_nodes.fork_source_session_key",
		"session_nodes.parent_session_key",
		"session_nodes.spawned_by",
		"retained_window.session_id as retained_window_id"
	]).$if(Boolean(options.metadata), (query) => query.select("session_nodes.updated_at")).$if(Boolean(options.metadata) && hasSqliteSessionOwnerColumns(database.db), (query) => query.select([
		"session_nodes.owner_actor_type",
		"session_nodes.owner_actor_id",
		"session_nodes.owner_assigned_by_type",
		"session_nodes.owner_assigned_by_id",
		"session_nodes.owner_assigned_at"
	])).orderBy("session_nodes.session_key");
}
/** Older supported maintenance readers keep their existing full-validation path. */
function hasCanonicalSessionValidationProjection(database) {
	if ((getAdmittedSqliteSchemaFacts(database.db)?.userVersion ?? readSqliteUserVersion(database.db)) < 21) return false;
	assertCanonicalSessionValidationSchema(database.db);
	return true;
}
function scanCanonicalSqliteSessionEntries(database, visit, metadata) {
	let count = 0;
	for (const row of iterateSqliteQuerySync(database.db, canonicalSessionValidationQuery(database, { metadata: Boolean(metadata) }).$if(Boolean(visit), (query) => query.select(sessionEntrySnapshotColumns)))) {
		metadata?.keys.push(row.session_key);
		const entry = validateCanonicalSessionRow(row);
		if (!entry) continue;
		if (metadata && entry.updatedAt === row.updated_at) {
			const { sessionDiffBaseline: _baseline, skillsSnapshot: _skills, systemPromptReport: _report, ...listEntry } = entry;
			metadata.entries.set(row.session_key, projectSqliteSessionOwner(listEntry, row));
		}
		if (visit) visit({
			entry: attachSessionEntrySnapshots(entry, row),
			sessionKey: row.session_key
		});
		count += 1;
	}
	return count;
}
/** Exact reads validate their snapshot without admitting unrelated persisted rows. */
function assertCanonicalSqliteSessionRowsCurrent(database, sessionKeys) {
	for (const row of iterateSqliteQuerySync(database.db, canonicalSessionValidationQuery(database).where("session_nodes.session_key", "in", sqliteStringSet(sessionKeys)))) validateCanonicalSessionRow(row, "read");
}
/** Validate the root's database and key together within its synchronous writer transaction. */
function assertCanonicalSqliteSessionRootWrite(database, sessionKey) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	assertCanonicalSessionKeyWrite(sessionKey);
}
function assertCanonicalSqliteSessionKeysCurrent(database, collectMetadata = false) {
	const incremental = hasCanonicalSessionValidationProjection(database);
	const identity = findOpenClawAgentDatabaseIdentity(database);
	const pathname = database.path ?? identity?.filename;
	const physicalValidation = pathname ? getOpenClawAgentDatabaseValidation({
		...database,
		path: pathname
	}) : void 0;
	const storedMainKey = readCanonicalSessionMainKey(database);
	const canonicalReady = hasOpenClawAgentCanonicalValidation(database);
	const readScope = canonicalReadScope.current;
	const continuation = readScope?.database === database.db ? readScope.continuation : void 0;
	if (readScope && continuation && physicalValidation && continuation.mainKey === storedMainKey && continuation.canonicalReady === canonicalReady && matchesReaderContinuationDatabase(database, continuation)) {
		readScope.usedContinuation = true;
		return;
	}
	const admitted = readerAdmissions.get(database.db)?.proof;
	if (admitted?.mainKey === storedMainKey && admitted.physicalValidation === physicalValidation && admitted.canonicalReady === canonicalReady) return;
	if (readScope?.database === database.db && !database.db.isTransaction) {
		readScope.snapshotRequired ??= /* @__PURE__ */ new Error("Canonical session read requires an admission snapshot");
		throw readScope.snapshotRequired;
	}
	const remember = () => rememberReaderAdmission(database.db, {
		mainKey: storedMainKey,
		physicalValidation,
		canonicalReady: hasOpenClawAgentCanonicalValidation(database)
	});
	if (incremental) {
		if (!(typeof identity?.identity === "symbol") && !canonicalReady) {
			deferCanonicalSessionValidation(database);
			const metadata = collectMetadata ? {
				dataVersion: readSqliteDataVersion(database.db),
				entries: /* @__PURE__ */ new Map(),
				keys: []
			} : void 0;
			scanCanonicalSqliteSessionEntries(database, void 0, metadata);
			markOpenClawAgentCanonicalValidation(database);
			remember();
			return metadata;
		}
		const pending = getNodeSqliteKysely(database.db).selectFrom("session_canonical_validation_pending").select("session_key");
		if (!executeSqliteQueryTakeFirstSync(database.db, pending.limit(1))) {
			remember();
			return;
		}
		deferCanonicalSessionValidation(database);
		if (!collectMetadata) {
			const query = canonicalSessionValidationQuery(database).where("session_nodes.session_key", "in", pending);
			for (const row of iterateSqliteQuerySync(database.db, query)) validateCanonicalSessionRow(row);
			remember();
			return;
		}
	}
	const metadata = collectMetadata ? {
		dataVersion: readSqliteDataVersion(database.db),
		entries: /* @__PURE__ */ new Map(),
		keys: []
	} : void 0;
	scanCanonicalSqliteSessionEntries(database, void 0, metadata);
	remember();
	return metadata;
}
function setCanonicalSqliteSessionMainKey(database, mainKey) {
	const canonicalMainKey = normalizeMainKey(mainKey);
	const db = getNodeSqliteKysely(database.db);
	if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_key_contract").select("main_key").where("id", "=", 1))?.main_key === canonicalMainKey) return;
	executeSqliteQuerySync(database.db, db.insertInto("session_key_contract").values({
		id: 1,
		main_key: canonicalMainKey,
		updated_at: Date.now()
	}).onConflict((conflict) => conflict.column("id").doUpdateSet({
		main_key: canonicalMainKey,
		updated_at: Date.now()
	})));
	const admission = readerAdmissions.get(database.db);
	if (admission) {
		revokeReaderContinuations(admission);
		admission.proof = void 0;
		admission.committed = false;
	}
}
//#endregion
export { validateCanonicalSessionRow as _, assertCanonicalSqliteSessionRowsCurrent as a, hasCanonicalSessionValidationProjection as c, readWithCanonicalSessionReaderContinuation as d, scanCanonicalSqliteSessionEntries as f, canonicalSessionKeyMigrationRequiredError as g, SessionCanonicalKeyMigrationRequiredError as h, assertCanonicalSqliteSessionRootWrite as i, readCanonicalSessionMainKey as l, withCanonicalSessionValidationDeferral as m, assertCanonicalSessionKeyWrite as n, canonicalSessionValidationQuery as o, setCanonicalSqliteSessionMainKey as p, assertCanonicalSqliteSessionKeysCurrent as r, captureCanonicalSessionReaderContinuation as s, assertCanonicalSessionEntryLineageWrite as t, readWithCanonicalSessionAdmission as u, validateCanonicalSessionRowEntry as v };
