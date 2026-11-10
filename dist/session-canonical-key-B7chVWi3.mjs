import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { A as readSqliteDatabaseWriteRevision, R as revokeSqliteDatabaseAdmissions, b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { c as withSqlitePostCommitPublications, r as hasSqlitePostCommitScope, s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { i as getAdmittedSqliteSchemaFacts, o as getSqliteReadScopeRevision } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { i as executeSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely, p as sql, s as iterateSqliteQuerySync, u as prepareSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { t as SessionCanonicalKeyMigrationRequiredError } from "./session-canonical-key-error-YHax-6is.mjs";
import { a as normalizeMainKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { i as isOpenClawAgentDatabasePathCurrent, r as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { c as getOpenClawAgentDatabaseValidation, f as invalidateOpenClawAgentCanonicalValidation, g as markOpenClawAgentCanonicalValidation, n as adoptOpenClawAgentDatabaseValidation, u as hasOpenClawAgentCanonicalValidation, w as assertCanonicalSessionValidationSchema } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { r as parseSqliteSessionEntryRecord } from "./session-entry-json-iiByG7LE.mjs";
import { t as attachSessionEntrySnapshots } from "./session-entry-snapshot-values-CSxUX6LQ.mjs";
import { t as sessionEntrySnapshotColumns } from "./session-entry-snapshots-CwvH1YlE.mjs";
import { a as normalizeStoreSessionKey, o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { n as projectSqliteSessionOwner, t as hasSqliteSessionOwnerColumns } from "./session-accessor.sqlite-owner-projection-BFkJufPp.mjs";
import { i as projectCanonicalSessionEntryShape } from "./store-entry-shape-sjH_uIYB.mjs";
//#region src/config/sessions/session-canonical-row.ts
function canonicalSessionKeyMigrationRequiredError(detail) {
	return new SessionCanonicalKeyMigrationRequiredError(detail);
}
/** One validator serves full Doctor scans, pending rows, and canonical writer inputs. */
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
//#region src/config/sessions/session-canonical-key.ts
const mainKeyReader = createSqliteQueryCache((db) => prepareSqliteQueryTakeFirstSync(db, () => getNodeSqliteKysely(db).selectFrom("session_key_contract").select("main_key").where("id", "=", 1)));
const mainKeyAdmission = {
	name: "canonical-session-main-key",
	read(value) {
		return typeof value === "string" ? value : void 0;
	}
};
const mainKeyPublication = {
	...mainKeyAdmission,
	name: "canonical-session-main-key-write",
	writer: "host"
};
const readerAdmissions = resolveGlobalSingleton(Symbol.for("openclaw.canonicalSessionReaderAdmissions"), () => /* @__PURE__ */ new WeakMap());
const canonicalReadScope = resolveGlobalSingleton(Symbol.for("openclaw.canonicalSessionReadScope"), () => ({}));
function requireCanonicalReadSnapshot(scope) {
	scope.snapshotRequired ??= /* @__PURE__ */ new Error("Canonical session read requires an admission snapshot");
	throw scope.snapshotRequired;
}
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
	return withSqlitePostCommitPublications(sqlPublicationAnchor(database.db), () => runSqliteDeferredTransactionSync(database.db, read));
}
function getReaderAdmissionCell(database) {
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
	return cell;
}
function rememberReaderAdmission(database, proof) {
	const owned = getReaderAdmissionCell(database);
	const previous = owned.proof;
	const previouslyCommitted = owned.committed;
	if (database.isTransaction) {
		if (!stageSqliteTransactionState(sqlPublicationAnchor(database), {
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
	const value = withSqlitePostCommitPublications(sqlPublicationAnchor(database.db), () => runSqliteDeferredTransactionSync(database.db, () => {
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
	return normalizeMainKey(readStoredCanonicalSessionMainKey(database) ?? void 0);
}
function readStoredCanonicalSessionMainKey(database) {
	const pending = readerAdmissions.get(database.db)?.pendingMainKey;
	if (database.db.isTransaction && pending !== void 0) return pending.mainKey;
	const published = getSqliteDatabaseAdmission(database.db, mainKeyPublication);
	if (published !== void 0) return published;
	const admitted = getSqliteDatabaseAdmission(database.db, mainKeyAdmission);
	if (admitted !== void 0) return getSqliteDatabaseAdmission(database.db, mainKeyPublication) ?? admitted;
	const revision = getSqliteReadScopeRevision(database.db);
	const admission = revision ? getReaderAdmissionCell(database.db) : readerAdmissions.get(database.db);
	const policy = admission?.policy;
	if (revision && policy?.revision === revision) return policy.stored;
	const stored = mainKeyReader(database.db)()?.main_key ?? null;
	if (stored !== null) publishSqliteDatabaseAdmission(database.db, mainKeyAdmission, stored);
	const committed = getSqliteDatabaseAdmission(database.db, mainKeyPublication);
	if (committed !== void 0) return committed;
	if (admission) admission.policy = revision && getSqliteReadScopeRevision(database.db) === revision ? {
		revision,
		stored
	} : void 0;
	return stored;
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
/** Validate the root's database and key together within its synchronous writer transaction. */
function assertCanonicalSqliteSessionRootWrite(database, sessionKey) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	assertCanonicalSessionKeyWrite(sessionKey);
}
function assertCanonicalSqliteSessionKeysCurrent(database, collectMetadata = false) {
	const readScope = canonicalReadScope.current;
	const identity = findOpenClawAgentDatabaseIdentity(database);
	const pathname = database.path ?? identity?.filename;
	const physicalValidation = pathname ? getOpenClawAgentDatabaseValidation({
		...database,
		path: pathname
	}) : void 0;
	if (physicalValidation && readScope?.database === database.db && !database.db.isTransaction && !readerAdmissions.get(database.db)?.proof) requireCanonicalReadSnapshot(readScope);
	const incremental = hasCanonicalSessionValidationProjection(database);
	const storedMainKey = readCanonicalSessionMainKey(database);
	const canonicalReady = hasOpenClawAgentCanonicalValidation(database);
	const continuation = readScope?.database === database.db ? readScope.continuation : void 0;
	if (readScope && continuation && physicalValidation && continuation.mainKey === storedMainKey && continuation.canonicalReady === canonicalReady && matchesReaderContinuationDatabase(database, continuation)) {
		readScope.usedContinuation = true;
		return;
	}
	const admitted = readerAdmissions.get(database.db)?.proof;
	if (admitted?.mainKey === storedMainKey && admitted.physicalValidation === physicalValidation && admitted.canonicalReady === canonicalReady) return;
	if (readScope?.database === database.db && !database.db.isTransaction) requireCanonicalReadSnapshot(readScope);
	const remember = () => rememberReaderAdmission(database.db, {
		mainKey: storedMainKey,
		physicalValidation,
		canonicalReady: hasOpenClawAgentCanonicalValidation(database)
	});
	if (incremental) {
		if (canonicalReady) {
			remember();
			return;
		}
	}
	const metadata = collectMetadata ? {
		writeRevision: readSqliteDatabaseWriteRevision(database.db),
		entries: /* @__PURE__ */ new Map(),
		keys: []
	} : void 0;
	scanCanonicalSqliteSessionEntries(database, void 0, metadata);
	if (incremental) markOpenClawAgentCanonicalValidation(database);
	remember();
	return metadata;
}
/** Offline imports and repairs queue unvalidated rows before releasing their custody. */
function markCanonicalSessionValidationPending(database, sessionKeys) {
	const db = getNodeSqliteKysely(database.db);
	const insert = db.insertInto("session_canonical_validation_pending").columns(["session_key"]);
	const pending = sessionKeys ? insert.values(sessionKeys.map((session_key) => ({ session_key }))) : insert.expression(db.selectFrom("session_nodes").select("session_key").where(sql.lit(true)));
	executeSqliteQuerySync(database.db, pending.onConflict((conflict) => conflict.column("session_key").doNothing()));
	invalidateOpenClawAgentCanonicalValidation(database);
}
function setCanonicalSqliteSessionMainKey(database, mainKey) {
	if (database.db.isTransaction && !hasSqlitePostCommitScope(sqlPublicationAnchor(database.db))) throw new Error("Canonical main-key changes require managed transaction publication");
	const canonicalMainKey = normalizeMainKey(mainKey);
	if (readStoredCanonicalSessionMainKey(database) === canonicalMainKey) return;
	const db = getNodeSqliteKysely(database.db);
	markCanonicalSessionValidationPending(database);
	executeSqliteQuerySync(database.db, db.insertInto("session_key_contract").values({
		id: 1,
		main_key: canonicalMainKey,
		updated_at: Date.now()
	}).onConflict((conflict) => conflict.column("id").doUpdateSet({
		main_key: canonicalMainKey,
		updated_at: Date.now()
	})));
	const admission = getReaderAdmissionCell(database.db);
	revokeReaderContinuations(admission);
	admission.proof = void 0;
	admission.committed = false;
	const previous = admission.pendingMainKey;
	const pending = { mainKey: canonicalMainKey };
	const publish = () => publishSqliteDatabaseAdmission(database.db, mainKeyPublication, canonicalMainKey);
	const invalidate = () => {
		admission.pendingMainKey = void 0;
		admission.policy = void 0;
		revokeReaderContinuations(admission);
		admission.proof = void 0;
		admission.committed = false;
		revokeSqliteDatabaseAdmissions(database.db);
	};
	if (!database.db.isTransaction || !stageSqliteTransactionState(sqlPublicationAnchor(database.db), {
		stage: () => {
			admission.pendingMainKey = pending;
		},
		rollback: () => {
			admission.pendingMainKey = previous;
		},
		commit: () => {
			if (admission.pendingMainKey === pending) {
				publish();
				admission.pendingMainKey = void 0;
			}
		},
		invalidate
	})) try {
		publish();
	} catch (error) {
		invalidate();
		throw error;
	}
}
//#endregion
export { validateCanonicalSessionRowEntry as _, canonicalSessionValidationQuery as a, markCanonicalSessionValidationPending as c, readWithCanonicalSessionAdmission as d, readWithCanonicalSessionReaderContinuation as f, validateCanonicalSessionRow as g, canonicalSessionKeyMigrationRequiredError as h, assertCanonicalSqliteSessionRootWrite as i, readCanonicalSessionMainKey as l, setCanonicalSqliteSessionMainKey as m, assertCanonicalSessionKeyWrite as n, captureCanonicalSessionReaderContinuation as o, scanCanonicalSqliteSessionEntries as p, assertCanonicalSqliteSessionKeysCurrent as r, hasCanonicalSessionValidationProjection as s, assertCanonicalSessionEntryLineageWrite as t, readStoredCanonicalSessionMainKey as u };
