import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-B1TtVu8E.mjs";
import { w as withStateSchemaFence } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { n as assertSqliteIntegrity, t as SqliteRepairableForeignKeyError } from "./sqlite-integrity-B4lhf3Iz.mjs";
import { C as closeTrackedStateDatabase, p as openClawStateDatabaseCache, w as openTrackedStateDatabase } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { c as readSqliteSchemaCookie, s as getCanonicalSqliteTableNames, t as assertSqliteSchemaContains } from "./sqlite-schema-contract-BFcZzasN.mjs";
import { n as assertSupportedStateSchemaVersion } from "./openclaw-state-db-schema-version-DX12nO8l.mjs";
import { i as isExistingOpenClawStateSchema, n as assertOpenClawStateSchemaRepairAllowed } from "./openclaw-state-db-schema-policy-BpQ7rCsk.mjs";
import { D as assertOpenClawStateDatabaseOwner, o as assertExistingOpenClawStateRuntimeSchema } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { a as assertOpenClawStateWriteAllowed, f as runWithOpenClawStateWriteAccess } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import { F as runCoordinatedStateTransaction, I as withSharedStateWriteCoordinator, d as recoverOrphanTaskDeliveryRows } from "./openclaw-state-db-BFK9cMiV.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/state/openclaw-state-db-existing-write.ts
/** Validate only the stable storage subset used by an existing-schema owner.
* This read neither repairs nor grants write authority; callers retain their
* actual handle, generation, lease and publication checks. */
function assertExistingOpenClawStateSchema(db, pathname, schemaSql) {
	const version = assertSupportedStateSchemaVersion(db, pathname);
	assertOpenClawStateDatabaseOwner(db, { pathname });
	const metadata = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("schema_meta").select("schema_version").where("meta_key", "=", "primary"));
	if (version < 1 || metadata?.schema_version !== version) throw new Error("Existing-state schema metadata is inconsistent.");
	assertSqliteIntegrity(db, pathname);
	assertSqliteSchemaContains(db, pathname, schemaSql);
	return version;
}
/** A synchronous write to an already-compatible, caller-owned schema subset.
* No database bootstrap, schema repair, journal-mode setup, cached publication or WAL timer.
* First-use owners may install their declared additive tables; existing objects
* must already match. This never opens or migrates the full runtime schema.
* The real handle and write coordinators cover open, transaction, and close.
*/
function runExistingOpenClawStateWriteTransaction(operation, options, contract) {
	if (options.database || options.readOnly) throw new Error("Existing-state writes require their own tracked writable connection.");
	const env = options.env ?? process.env;
	const busyTimeoutMs = contract.busyTimeoutMs ?? 5e3;
	const pathname = path.resolve(options.path ?? resolveOpenClawStateSqlitePath(env));
	const existingSchema = isExistingOpenClawStateSchema(pathname);
	if (contract.recoverTaskDeliveryOrphans) assertOpenClawStateSchemaRepairAllowed(pathname);
	const original = fs.lstatSync(pathname);
	if (!original.isFile()) throw new Error("Existing-state write requires a regular database file.");
	const assertSameFile = () => {
		const current = fs.lstatSync(pathname);
		if (!current.isFile() || current.dev !== original.dev || current.ino !== original.ino) throw new Error("Existing-state database generation changed.");
	};
	const write = () => withSharedStateWriteCoordinator({
		databasePath: pathname,
		busyTimeoutMs
	}, () => runWithOpenClawStateWriteAccess({
		databasePath: pathname,
		env,
		busyTimeoutMs
	}, contract.operationLabel, () => {
		assertSameFile();
		openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env);
		const db = openTrackedStateDatabase(pathname, {
			existingOnly: true,
			...contract.recoverTaskDeliveryOrphans ? { enableForeignKeyConstraints: false } : {}
		});
		try {
			setSqliteBusyTimeout(db, busyTimeoutMs);
			return runCoordinatedStateTransaction(db, () => {
				assertSameFile();
				assertOpenClawStateWriteAllowed({
					database: db,
					databasePath: pathname,
					env
				});
				if (existingSchema) assertExistingOpenClawStateRuntimeSchema(db, pathname);
				const validate = () => assertExistingOpenClawStateSchema(db, pathname, contract.initializeAdditiveSchema ? "" : contract.schemaSql);
				let version;
				let recoveryChanges = [];
				try {
					version = validate();
				} catch (error) {
					if (!contract.recoverTaskDeliveryOrphans || !(error instanceof SqliteRepairableForeignKeyError)) throw error;
					recoveryChanges = recoverOrphanTaskDeliveryRows(db, pathname);
					version = validate();
				}
				if (contract.initializeAdditiveSchema) {
					assertSqliteSchemaContains(db, pathname, contract.schemaSql, { allowedMissingTables: getCanonicalSqliteTableNames(contract.schemaSql) });
					db.exec(contract.schemaSql);
					assertSqliteSchemaContains(db, pathname, contract.schemaSql);
				}
				const schemaVersion = readSqliteSchemaCookie(db);
				const result = operation({
					db,
					path: pathname,
					recoveryChanges
				});
				assertSameFile();
				if (readSqliteUserVersion(db) !== version || readSqliteSchemaCookie(db) !== schemaVersion) throw new Error("Existing-state transaction cannot migrate schema.");
				if (contract.recoverTaskDeliveryOrphans) assertSqliteIntegrity(db, pathname);
				return result;
			}, {
				busyTimeoutMs,
				databaseLabel: pathname,
				operationLabel: contract.operationLabel
			});
		} finally {
			clearNodeSqliteKyselyCacheForDatabase(db);
			closeTrackedStateDatabase(db);
		}
	}));
	return contract.recoverTaskDeliveryOrphans ? withStateSchemaFence({ databasePath: pathname }, write) : write();
}
//#endregion
export { runExistingOpenClawStateWriteTransaction as t };
