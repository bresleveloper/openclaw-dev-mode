import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { t as assertNoActiveSqliteReaders } from "./sqlite-reader-lifecycle-CYQdd96B.mjs";
import { n as getAdmittedSqliteSchemaFacts, t as admitSqliteSchema } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { t as assertTransactionUsable } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { r as resolveDatabasePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { c as getCanonicalSqliteTableNames, l as readSqliteSchemaCookie, t as assertSqliteSchemaContains } from "./sqlite-schema-contract-BTxZz0OV.mjs";
import { n as assertSupportedStateSchemaVersion } from "./openclaw-state-db-schema-version-CGQ4F6pb.mjs";
import { x as assertOpenClawStateDatabaseOwner } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { n as assertSqliteIntegrity, t as SqliteRepairableForeignKeyError } from "./sqlite-integrity-GtqcmwG3.mjs";
import { C as closeTrackedStateDatabase, f as openClawStateDatabaseCache, w as openTrackedStateDatabase } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { a as isExistingOpenClawStateSchema, n as assertOpenClawStateSchemaRepairAllowed } from "./openclaw-state-db-schema-policy-BxAJZRG6.mjs";
import { n as assertOpenClawStateWriteAllowed, u as withStateDatabaseSchemaMaintenance } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import { n as assertExistingOpenClawStateRuntimeSchema, t as assertExistingOpenClawStateRuntimeMetadata } from "./openclaw-state-db-existing-schema-C4QR2GGf.mjs";
import { n as runManagedStateTransaction } from "./openclaw-state-db-transaction-LzNJgkWu.mjs";
import { t as recoverOrphanTaskDeliveryRows } from "./openclaw-state-db-task-delivery-recovery-B96Pa83y.mjs";
import fs from "node:fs";
//#region src/state/openclaw-state-db-existing-write.ts
function assertExistingOpenClawStateSchemaMetadata(db, pathname, version) {
	const metadata = assertOpenClawStateDatabaseOwner(db, { pathname });
	if (version < 1 || metadata?.schema_version !== version) throw new Error("Existing-state schema metadata is inconsistent.");
}
/** Validate only the stable storage subset used by an existing-schema owner.
* This read neither repairs nor grants write authority; callers retain their
* actual handle, generation, lease and publication checks. */
function assertExistingOpenClawStateSchema(db, pathname, schemaSql) {
	const version = assertSupportedStateSchemaVersion(db, pathname);
	assertExistingOpenClawStateSchemaMetadata(db, pathname, version);
	assertSqliteIntegrity(db, pathname);
	assertSqliteSchemaContains(db, pathname, schemaSql);
	return version;
}
/** A synchronous write to an already-compatible, caller-owned schema subset.
* No database bootstrap, schema repair, journal-mode setup, cached publication or WAL timer.
* First-use owners may install their declared additive tables; existing objects
* must already match. This never opens or migrates the full runtime schema.
* The admitted native connection owns transaction serialization.
*/
function runExistingOpenClawStateWriteTransaction(operation, options, contract) {
	const prepared = prepareExistingOpenClawStateWriter(options, contract);
	const write = () => {
		const writer = createExistingOpenClawStateWriter(prepared, contract);
		try {
			return writer.run(operation, options);
		} finally {
			writer.close();
		}
	};
	return contract.recoverTaskDeliveryOrphans ? withStateDatabaseSchemaMaintenance({ databasePath: prepared.pathname }, write) : write();
}
/** Retain the admitted subset connection without bootstrapping the runtime schema. */
function openExistingOpenClawStateWriter(options, contract) {
	return createExistingOpenClawStateWriter(prepareExistingOpenClawStateWriter(options, contract), contract);
}
function prepareExistingOpenClawStateWriter(options, contract) {
	if (options.database || options.readOnly) throw new Error("Existing-state writes require their own tracked writable connection.");
	const env = options.env ?? process.env;
	const pathname = resolveDatabasePath({
		path: options.path,
		env
	});
	isExistingOpenClawStateSchema(pathname);
	if (contract.recoverTaskDeliveryOrphans) assertOpenClawStateSchemaRepairAllowed(pathname);
	const original = fs.lstatSync(pathname);
	if (!original.isFile()) throw new Error("Existing-state write requires a regular database file.");
	return {
		env,
		pathname,
		original
	};
}
function createExistingOpenClawStateWriter({ env, pathname, original }, contract) {
	const assertSameFile = () => {
		const current = fs.lstatSync(pathname);
		if (!current.isFile() || current.dev !== original.dev || current.ino !== original.ino) throw new Error("Existing-state database generation changed.");
	};
	assertSameFile();
	openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
	const db = openTrackedStateDatabase(pathname, {
		existingOnly: true,
		...contract.recoverTaskDeliveryOrphans ? { enableForeignKeyConstraints: false } : {}
	});
	let closed = false;
	let admitted;
	return {
		run(operation, currentOptions) {
			if (closed || !db.isOpen) throw new Error("Existing-state writer is closed.");
			if (currentOptions.database || currentOptions.readOnly) throw new Error("Existing-state writes require their own tracked writable connection.");
			const currentEnv = currentOptions.env ?? process.env;
			if (resolveDatabasePath({
				path: currentOptions.path,
				env: currentEnv
			}) !== pathname) throw new Error("Existing-state writer cannot change its database path.");
			assertSameFile();
			const existingSchema = isExistingOpenClawStateSchema(pathname);
			if (admitted && existingSchema !== admitted.existingSchema) throw new Error("Existing-state writer schema admission changed.");
			if (admitted) getAdmittedSqliteSchemaFacts(db);
			const busyTimeoutMs = currentOptions.busyTimeoutMs ?? contract.busyTimeoutMs ?? 5e3;
			setSqliteBusyTimeout(db, busyTimeoutMs);
			let pendingAdmission;
			const result = runManagedStateTransaction(db, () => {
				assertSameFile();
				assertOpenClawStateWriteAllowed({
					database: db,
					databasePath: pathname,
					env: currentEnv
				});
				let needsAdmission = !admitted;
				if (admitted) {
					const facts = getAdmittedSqliteSchemaFacts(db);
					if (!facts) throw new Error("Existing-state writer schema facts are unavailable.");
					needsAdmission = facts.userVersion !== admitted.version || facts.schemaVersion !== admitted.cookie;
				}
				if (needsAdmission && existingSchema) assertExistingOpenClawStateRuntimeSchema(db, pathname);
				const validate = () => assertExistingOpenClawStateSchema(db, pathname, !admitted && contract.initializeAdditiveSchema ? "" : contract.schemaSql);
				let version;
				let recoveryChanges = [];
				if (admitted && !needsAdmission) {
					if (existingSchema) version = assertExistingOpenClawStateRuntimeMetadata(db, pathname);
					else {
						version = assertSupportedStateSchemaVersion(db, pathname);
						assertExistingOpenClawStateSchemaMetadata(db, pathname, version);
					}
				} else try {
					version = validate();
				} catch (error) {
					if (!contract.recoverTaskDeliveryOrphans || !(error instanceof SqliteRepairableForeignKeyError)) throw error;
					recoveryChanges = recoverOrphanTaskDeliveryRows(db, pathname);
					version = validate();
				}
				if (!admitted && contract.initializeAdditiveSchema) {
					assertSqliteSchemaContains(db, pathname, contract.schemaSql, { allowedMissingTables: getCanonicalSqliteTableNames(contract.schemaSql) });
					db.exec(contract.schemaSql);
					assertSqliteSchemaContains(db, pathname, contract.schemaSql);
				}
				const schemaVersion = readSqliteSchemaCookie(db);
				if (typeof schemaVersion !== "number") throw new Error("Existing-state schema version is unavailable.");
				if (needsAdmission) {
					admitSqliteSchema(db);
					pendingAdmission = {
						version,
						cookie: schemaVersion,
						existingSchema
					};
				}
				const value = operation({
					db,
					path: pathname,
					recoveryChanges
				});
				assertSameFile();
				if (readSqliteUserVersion(db) !== version || readSqliteSchemaCookie(db) !== schemaVersion) throw new Error("Existing-state transaction cannot migrate schema.");
				if (contract.recoverTaskDeliveryOrphans) assertSqliteIntegrity(db, pathname);
				return value;
			}, {
				busyTimeoutMs,
				databaseLabel: pathname,
				operationLabel: contract.operationLabel
			});
			if (pendingAdmission) admitted = pendingAdmission;
			return result;
		},
		assertSettled() {
			assertSameFile();
			assertTransactionUsable(db);
			if (db.isOpen && db.isTransaction) throw new Error("Existing-state writer retained an unsettled transaction");
			if (db.isOpen) assertNoActiveSqliteReaders(db, "Existing-state writer");
		},
		close() {
			closed = true;
			clearNodeSqliteKyselyCacheForDatabase(db);
			closeTrackedStateDatabase(db);
		}
	};
}
//#endregion
export { runExistingOpenClawStateWriteTransaction as n, openExistingOpenClawStateWriter as t };
