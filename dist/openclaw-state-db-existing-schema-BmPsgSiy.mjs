import "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as classifySqliteTableReadError } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { c as publishStateRuntimeSchemaAdmission, i as readStateSchemaContentVersion, o as getStateRuntimeSchemaAdmission, r as assertSupportedStateSchemaVersion, s as getStateSchemaVersionAdmission } from "./openclaw-state-db-schema-version-CcCTuttF.mjs";
import { t as assertOpenClawStateRuntimeIntegrity } from "./openclaw-state-db-integrity-admission-BHpYd_s7.mjs";
import { s as createSqliteTableContractReader, u as readSqliteSchemaCookie } from "./sqlite-schema-contract-C7_zBR7q.mjs";
import { n as assertNoLegacyStateRuntimeRepair, t as assertCurrentStateRuntimeSchema } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
//#region src/state/openclaw-state-db-existing-schema.ts
/** Metadata is validated with the physical database's first runtime admission. */
function assertExistingOpenClawStateRuntimeMetadata(database, pathname) {
	if (getStateRuntimeSchemaAdmission(database)) {
		const version = getStateSchemaVersionAdmission(database)?.userVersion;
		if (version !== void 0) return version;
	}
	const version = assertSupportedStateSchemaVersion(database, pathname);
	if (readStateSchemaContentVersion(database) !== 22) throw new Error(`Existing shared-state database ${pathname} requires schema migration by its owning installation; run openclaw doctor --fix there before using it.`);
	let metadata;
	try {
		metadata = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("schema_meta").select(["role", "schema_version"]).where("meta_key", "=", "primary").limit(1));
	} catch (error) {
		throw classifySqliteTableReadError(database, "schema_meta", [
			"meta_key",
			"role",
			"schema_version"
		], error);
	}
	if (metadata?.role !== "global" || metadata.schema_version !== version) throw new Error(`Existing shared-state database ${pathname} has inconsistent ownership or schema metadata.`);
	return version;
}
/** Validate an existing runtime schema without applying repairs. */
function assertExistingOpenClawStateRuntimeSchema(database, pathname, integrity, integrityPolicy) {
	const admitted = getStateRuntimeSchemaAdmission(database) ? getAdmittedSqliteSchemaFacts(database) : void 0;
	if (admitted) {
		assertOpenClawStateRuntimeIntegrity(database, pathname, admitted, integrity, integrityPolicy)?.();
		return;
	}
	let publishIntegrity;
	runSqliteDeferredTransactionSync(database, () => {
		const userVersion = assertExistingOpenClawStateRuntimeMetadata(database, pathname);
		const currentCookie = readSqliteSchemaCookie(database);
		if (typeof currentCookie !== "number") throw new Error(`Existing shared-state database ${pathname} schema version is unavailable.`);
		publishIntegrity = assertOpenClawStateRuntimeIntegrity(database, pathname, {
			schemaVersion: currentCookie,
			userVersion
		}, integrity, integrityPolicy);
		const readTable = createSqliteTableContractReader(database);
		assertCurrentStateRuntimeSchema(database, pathname, readTable);
		assertNoLegacyStateRuntimeRepair(database, pathname);
	}, { operationLabel: "state.admission.existing-schema" });
	publishIntegrity?.();
	publishStateRuntimeSchemaAdmission(database, true);
}
//#endregion
export { assertExistingOpenClawStateRuntimeSchema as t };
