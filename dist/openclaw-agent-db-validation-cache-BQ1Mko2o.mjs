import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { i as stageSqliteTransactionState, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { i as tableHasColumn, t as ensureColumn } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-B1TtVu8E.mjs";
import { S as CANONICAL_READY_COLUMN_DEFINITION, i as readOpenClawAgentDatabaseIdentity, n as findOpenClawAgentDatabaseIdentity, r as isOpenClawAgentDatabasePathCurrent } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { t as assertCanonicalSessionValidationSchema } from "./openclaw-agent-canonical-validation-schema-Di3TgIwr.mjs";
import path from "node:path";
//#region src/state/openclaw-agent-canonical-validation-receipt.ts
const receiptSchemas = /* @__PURE__ */ new WeakSet();
function hasReceiptColumn(db) {
	if (receiptSchemas.has(db)) return true;
	const { tableName, columnName } = CANONICAL_READY_COLUMN_DEFINITION;
	const present = tableHasColumn(db, tableName, columnName);
	if (present && !db.isTransaction) receiptSchemas.add(db);
	return present;
}
function physicalReceipt(database) {
	const physical = findOpenClawAgentDatabaseIdentity(database);
	if (!physical || typeof physical.identity !== "string" || !isOpenClawAgentDatabasePathCurrent({
		...database,
		path: physical.filename
	})) return;
	return JSON.stringify([
		1,
		database.agentId,
		physical.identity,
		physical.birthtime
	]);
}
/** Canonical proof follows this file generation; it never certifies physical integrity. */
function hasPersistedOpenClawAgentCanonicalValidation(database) {
	const receipt = physicalReceipt(database);
	if (!receipt || !hasReceiptColumn(database.db)) return false;
	assertCanonicalSessionValidationSchema(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_key_contract").select("canonical_ready").where("id", "=", 1))?.canonical_ready === receipt;
}
/** The certifying writer records proof in the same authorized transaction as its final batch. */
function recordOpenClawAgentCanonicalValidation(database) {
	if (!database.db.isTransaction) throw new Error("Canonical validation receipt requires write admission");
	const receipt = physicalReceipt(database);
	if (!receipt) throw new Error("Canonical validation database owner is no longer current");
	assertCanonicalSessionValidationSchema(database.db);
	if (!hasReceiptColumn(database.db)) {
		const { tableName, columnName, dataType } = CANONICAL_READY_COLUMN_DEFINITION;
		ensureColumn(database.db, tableName, `${columnName} ${dataType}`);
	}
	deferSqlitePostCommitPublication(database.db, () => receiptSchemas.add(database.db));
	executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).updateTable("session_key_contract").set({ canonical_ready: receipt }).where("id", "=", 1));
}
//#endregion
//#region src/state/openclaw-agent-db-validation-cache.ts
const validatedPaths = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseValidatedPaths"), () => /* @__PURE__ */ new Map(), () => clearOpenClawAgentDatabaseValidationCache());
const validationBindings = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseValidationBindings"), () => /* @__PURE__ */ new WeakMap());
function bindValidationLifetime(database, validation) {
	const current = validationBindings.get(database.db);
	if (!database.db.isOpen || current?.validation === validation) return;
	current?.unregister();
	const unregister = registerNodeSqliteDisposeCallback(database.db, (reason) => {
		if (reason === "replace") Atomics.store(new Int32Array(validation.valid), 0, 0);
		validationBindings.delete(database.db);
		unregister();
	});
	validationBindings.set(database.db, {
		validation,
		unregister
	});
}
function matchesValidation(database, validation) {
	return validation.agentId === database.agentId && validation.identity === findOpenClawAgentDatabaseIdentity(database)?.identity && Atomics.load(new Int32Array(validation.valid), 0) === 1;
}
function hasRevokedValidation(pathname) {
	const previous = validatedPaths.get(path.resolve(pathname));
	return previous?.revoked === true || previous?.validation !== void 0 && Atomics.load(new Int32Array(previous.validation.valid), 0) !== 1;
}
function getOpenClawAgentDatabaseValidation(database) {
	const entry = validatedPaths.get(path.resolve(database.path));
	if (!entry?.integrityVerified || !entry.validation || !matchesValidation(database, entry.validation)) return;
	const validation = entry.validation;
	bindValidationLifetime(database, validation);
	return validation;
}
/** The receiving opener must adopt this proof against its own physical file identity. */
function getOpenClawAgentDatabaseValidationForTransfer(database) {
	const entry = validatedPaths.get(path.resolve(database.path));
	if (!entry?.integrityVerified || !entry.validation || entry.validation.agentId !== database.agentId || Atomics.load(new Int32Array(entry.validation.valid), 0) !== 1) return;
	return entry.validation;
}
/** Native admission supplies the checked file identity; no host SQLite handle is needed. */
function captureOpenClawAgentDatabaseValidationTransfer(database) {
	const pathname = path.resolve(database.path);
	const existing = validatedPaths.get(pathname);
	const captured = existing?.agentId === database.agentId ? existing : {
		...existing,
		agentId: database.agentId,
		integrityVerified: existing?.integrityVerified ?? false
	};
	validatedPaths.set(pathname, captured);
	const capturedValidation = captured.validation;
	const wasValid = capturedValidation ? Atomics.load(new Int32Array(capturedValidation.valid), 0) : void 0;
	return (identity, received) => {
		if (validatedPaths.get(pathname) !== captured || capturedValidation && wasValid === 1 && Atomics.load(new Int32Array(capturedValidation.valid), 0) !== 1 || !isRecord(received) || received.agentId !== database.agentId || received.identity !== identity || !(received.valid instanceof SharedArrayBuffer) || received.valid.byteLength !== Int32Array.BYTES_PER_ELEMENT || Atomics.load(new Int32Array(received.valid), 0) !== 1 || !(received.canonicalReady instanceof SharedArrayBuffer) || received.canonicalReady.byteLength !== Int32Array.BYTES_PER_ELEMENT) return false;
		if (wasValid === 1 && captured.integrityVerified && captured.validation?.agentId === database.agentId && captured.validation?.identity === identity) return true;
		const validation = {
			agentId: database.agentId,
			identity,
			valid: received.valid,
			canonicalReady: received.canonicalReady
		};
		if (hasRevokedValidation(pathname)) Atomics.store(new Int32Array(validation.canonicalReady), 0, 0);
		invalidateOpenClawAgentDatabaseValidation(pathname);
		validatedPaths.set(pathname, {
			validation,
			integrityVerified: true
		});
		return true;
	};
}
function canonicalValidationReceipt(database) {
	if (!database.db.isOpen || !findOpenClawAgentDatabaseIdentity(database)) return;
	const pathname = database.path ?? database.db.location();
	if (!pathname) return;
	const validation = validatedPaths.get(path.resolve(pathname))?.validation;
	if (!validation || !matchesValidation({
		...database,
		path: pathname
	}, validation)) return;
	bindValidationLifetime({
		...database,
		path: pathname
	}, validation);
	return validation;
}
/** A clean pending table needs proof from this admitted physical generation. */
function hasOpenClawAgentCanonicalValidation(database) {
	const validation = canonicalValidationReceipt(database);
	if (validation) return Atomics.load(new Int32Array(validation.canonicalReady), 0) === 1 && Atomics.load(new Int32Array(validation.valid), 0) === 1;
	const pathname = database.path ?? findOpenClawAgentDatabaseIdentity(database)?.filename;
	if (!pathname || database.db.isTransaction || validatedPaths.get(path.resolve(pathname))?.validation !== void 0 || hasRevokedValidation(pathname) || !hasPersistedOpenClawAgentCanonicalValidation(database)) return false;
	const canonical = createValidationReceipt({
		...database,
		path: pathname
	}, true);
	validatedPaths.set(path.resolve(pathname), {
		validation: canonical,
		integrityVerified: false
	});
	bindValidationLifetime({
		...database,
		path: pathname
	}, canonical);
	return true;
}
/** Publish successful canonical proof only when its outer transaction has committed. */
function markOpenClawAgentCanonicalValidation(database) {
	const validation = canonicalValidationReceipt(database);
	if (!validation) return false;
	const publish = () => {
		if (Atomics.load(new Int32Array(validation.valid), 0) === 1) Atomics.store(new Int32Array(validation.canonicalReady), 0, 1);
	};
	if (database.db.isTransaction) return stageSqliteTransactionState(database.db, {
		stage: () => {},
		rollback: () => {},
		commit: publish
	});
	publish();
	return Atomics.load(new Int32Array(validation.valid), 0) === 1;
}
function adoptOpenClawAgentDatabaseValidation(database, validation) {
	if (!matchesValidation(database, validation)) return false;
	if (getOpenClawAgentDatabaseValidation(database)) return true;
	if (hasRevokedValidation(database.path)) Atomics.store(new Int32Array(validation.canonicalReady), 0, 0);
	invalidateOpenClawAgentDatabaseValidation(database.path);
	validatedPaths.set(path.resolve(database.path), {
		validation,
		integrityVerified: true
	});
	bindValidationLifetime(database, validation);
	return true;
}
function isOpenClawAgentCanonicalStoreEmpty(database) {
	if (database.db.isTransaction || readSqliteUserVersion(database.db) < 21) return false;
	assertCanonicalSessionValidationSchema(database.db);
	return database.db.prepare(`SELECT
    EXISTS(SELECT 1 FROM session_nodes) OR
    EXISTS(SELECT 1 FROM session_canonical_validation_pending) AS populated`).get()?.populated === 0;
}
function createValidationReceipt(database, canonicalReady) {
	const { identity } = readOpenClawAgentDatabaseIdentity(database);
	if (typeof identity !== "string") throw new Error("Only persistent agent databases retain integrity validation");
	const validation = {
		agentId: database.agentId,
		identity,
		valid: new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT),
		canonicalReady: new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)
	};
	if (canonicalReady) Atomics.store(new Int32Array(validation.canonicalReady), 0, 1);
	Atomics.store(new Int32Array(validation.valid), 0, 1);
	return validation;
}
function setOpenClawAgentDatabaseValidation(database) {
	const revoked = hasRevokedValidation(database.path);
	const validation = createValidationReceipt(database, isOpenClawAgentCanonicalStoreEmpty(database) || !revoked && !database.db.isTransaction && hasPersistedOpenClawAgentCanonicalValidation(database));
	invalidateOpenClawAgentDatabaseValidation(database.path);
	validatedPaths.set(path.resolve(database.path), {
		validation,
		integrityVerified: true
	});
	bindValidationLifetime(database, validation);
	return validation;
}
function invalidateOpenClawAgentDatabaseValidation(pathname) {
	const resolved = path.resolve(pathname);
	const validation = validatedPaths.get(resolved)?.validation;
	if (validation) Atomics.store(new Int32Array(validation.valid), 0, 0);
	validatedPaths.set(resolved, {
		agentId: validatedPaths.get(resolved)?.agentId,
		validation,
		integrityVerified: false,
		revoked: true
	});
}
function invalidateOpenClawAgentDatabaseValidationsForAgent(agentId, removedPaths) {
	for (const pathname of removedPaths) invalidateOpenClawAgentDatabaseValidation(pathname);
	for (const [pathname, entry] of validatedPaths) if (entry.validation?.agentId === agentId || entry.agentId === agentId) invalidateOpenClawAgentDatabaseValidation(pathname);
}
function clearOpenClawAgentDatabaseValidationCache(rootPath) {
	for (const pathname of validatedPaths.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) {
		invalidateOpenClawAgentDatabaseValidation(pathname);
		validatedPaths.delete(pathname);
	}
}
//#endregion
export { getOpenClawAgentDatabaseValidationForTransfer as a, invalidateOpenClawAgentDatabaseValidationsForAgent as c, recordOpenClawAgentCanonicalValidation as d, getOpenClawAgentDatabaseValidation as i, markOpenClawAgentCanonicalValidation as l, captureOpenClawAgentDatabaseValidationTransfer as n, hasOpenClawAgentCanonicalValidation as o, clearOpenClawAgentDatabaseValidationCache as r, invalidateOpenClawAgentDatabaseValidation as s, adoptOpenClawAgentDatabaseValidation as t, setOpenClawAgentDatabaseValidation as u };
