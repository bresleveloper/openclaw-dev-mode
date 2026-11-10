import { o as runWithSqliteCleanup } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { r as resolveDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { t as admitSqliteSchema } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { t as assertNoActiveSqliteReaders } from "./sqlite-reader-lifecycle-Cw11HwJP.mjs";
import { n as SqliteRepairableForeignKeyError, r as assertSqliteIntegrity } from "./sqlite-integrity-06TCB-az.mjs";
import { m as openClawStateDatabaseCache } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as createStateSchemaAdmission, r as assertSupportedStateSchemaVersion } from "./openclaw-state-db-schema-version-CcCTuttF.mjs";
import { a as isExistingOpenClawStateSchema, n as assertOpenClawStateSchemaRepairAllowed } from "./openclaw-state-db-schema-policy-CuEyLsE2.mjs";
import { n as closeTrackedStateDatabase, r as openTrackedStateDatabase } from "./openclaw-state-db-handle-B6qa1Bui.mjs";
import { n as assertStateDatabaseIntegrityOnce } from "./openclaw-state-db-integrity-admission-BHpYd_s7.mjs";
import { c as getCanonicalSqliteNamedIndexContracts, l as getCanonicalSqliteTableNames, n as assertSqliteSchemaContains } from "./sqlite-schema-contract-C7_zBR7q.mjs";
import { w as assertOpenClawStateDatabaseOwner } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { n as withStateDatabaseSchemaMaintenance } from "./state-database-maintenance-DQhfapFw.mjs";
import { n as assertOpenClawStateWriteAllowed } from "./openclaw-state-ownership-SRnMuR_a.mjs";
import { t as assertExistingOpenClawStateRuntimeSchema } from "./openclaw-state-db-existing-schema-BmPsgSiy.mjs";
import { n as runManagedStateTransaction } from "./openclaw-state-db-transaction-BR8tupS1.mjs";
import { t as createSqliteSchemaEnsurer } from "./sqlite-schema-ensure-CwIgvH1h.mjs";
import { t as recoverOrphanTaskDeliveryRows } from "./openclaw-state-db-task-delivery-recovery-DFOfs6Y-.mjs";
import { n as runUpdateDoctorAttributedStateWrite } from "./update-doctor-migration-attribution-BZIaEHed.mjs";
import fs from "node:fs";
import { createHash } from "node:crypto";
//#region src/state/openclaw-state-db-existing-write.ts
function assertExistingOpenClawStateSchemaMetadata(db, pathname, version) {
	const metadata = assertOpenClawStateDatabaseOwner(db, { pathname });
	if (version < 1 || metadata?.schema_version !== version) throw new Error("Existing-state schema metadata is inconsistent.");
}
/** Validate only the stable storage subset used by an existing-schema owner.
* This read neither repairs nor grants write authority; callers retain their
* actual handle, generation, lease and publication checks. */
function assertExistingOpenClawStateSchema(db, pathname, schemaSql, compatibility) {
	const version = assertSupportedStateSchemaVersion(db, pathname);
	assertExistingOpenClawStateSchemaMetadata(db, pathname, version);
	assertStateDatabaseIntegrityOnce(db, pathname);
	assertSqliteSchemaContains(db, pathname, schemaSql, compatibility);
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
		return runWithSqliteCleanup({ release: writer.close }, "Existing-state write", () => writer.run(operation, options));
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
	const admission = createStateSchemaAdmission(`state.subset:${createHash("sha256").update(JSON.stringify([contract.schemaSql, contract.schemaCompatibility])).digest("hex")}`, (value) => typeof value === "number" ? value : void 0);
	const ensureAdditiveSchema = contract.initializeAdditiveSchema ? createSqliteSchemaEnsurer(() => contract.schemaSql, {
		tables: getCanonicalSqliteTableNames(contract.schemaSql),
		indexes: getCanonicalSqliteNamedIndexContracts(contract.schemaSql).map(({ name }) => name)
	}) : void 0;
	let closed = false;
	const close = () => {
		closed = true;
		if (!db.isOpen) return;
		clearNodeSqliteKyselyCacheForDatabase(db);
		closeTrackedStateDatabase(db);
	};
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
			const busyTimeoutMs = currentOptions.busyTimeoutMs ?? contract.busyTimeoutMs ?? 5e3;
			setSqliteBusyTimeout(db, busyTimeoutMs);
			const write = () => runManagedStateTransaction(db, () => {
				assertSameFile();
				assertOpenClawStateWriteAllowed({
					database: db,
					databasePath: pathname,
					env: currentEnv
				});
				const priorVersion = admission.get(db);
				const needsAdmission = priorVersion === void 0;
				if (existingSchema) assertExistingOpenClawStateRuntimeSchema(db, pathname);
				const validate = () => assertExistingOpenClawStateSchema(db, pathname, needsAdmission && contract.initializeAdditiveSchema ? "" : contract.schemaSql, contract.schemaCompatibility);
				let version;
				let recoveryChanges = [];
				if (priorVersion !== void 0) version = priorVersion;
				else try {
					version = validate();
				} catch (error) {
					if (!contract.recoverTaskDeliveryOrphans || !(error instanceof SqliteRepairableForeignKeyError)) throw error;
					recoveryChanges = recoverOrphanTaskDeliveryRows(db, pathname);
					version = validate();
				}
				if (needsAdmission && contract.initializeAdditiveSchema) {
					assertSqliteSchemaContains(db, pathname, contract.schemaSql, {
						...contract.schemaCompatibility,
						allowedMissingTables: getCanonicalSqliteTableNames(contract.schemaSql)
					});
					admitSqliteSchema(db);
					ensureAdditiveSchema?.(db);
					assertSqliteSchemaContains(db, pathname, contract.schemaSql, contract.schemaCompatibility);
				}
				if (needsAdmission) {
					admitSqliteSchema(db);
					admission.publish(db, version);
				}
				const value = operation({
					db,
					path: pathname,
					recoveryChanges
				});
				assertSameFile();
				if (contract.recoverTaskDeliveryOrphans) assertSqliteIntegrity(db, pathname);
				return value;
			}, {
				beginLockFailureReporting: contract.beginLockFailureReporting,
				busyTimeoutMs,
				databaseLabel: pathname,
				operationLabel: contract.operationLabel
			});
			return contract.attributeUpdateWrite ? runUpdateDoctorAttributedStateWrite(db, pathname, write, close) : write();
		},
		assertSettled() {
			assertSameFile();
			assertTransactionUsable(db);
			if (db.isOpen && db.isTransaction) throw new Error("Existing-state writer retained an unsettled transaction");
			if (db.isOpen) assertNoActiveSqliteReaders(db, "Existing-state writer");
		},
		close
	};
}
//#endregion
export { runExistingOpenClawStateWriteTransaction as n, openExistingOpenClawStateWriter as t };
