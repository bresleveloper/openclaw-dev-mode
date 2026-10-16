import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { t as classifySqliteTableReadError } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { l as readSqliteSchemaCookie, o as createSqliteTableContractReader } from "./sqlite-schema-contract-BTxZz0OV.mjs";
import { i as readStateSchemaMigrationVersion, n as assertSupportedStateSchemaVersion } from "./openclaw-state-db-schema-version-CGQ4F6pb.mjs";
import { n as assertNoLegacyStateRuntimeRepair, t as assertCurrentStateRuntimeSchema } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-GtqcmwG3.mjs";
//#region src/state/openclaw-state-db-existing-schema.ts
const validatedSchemas = /* @__PURE__ */ new WeakMap();
/** Recheck mutable metadata within the caller's admission transaction. */
function assertExistingOpenClawStateRuntimeMetadata(database, pathname) {
	const version = assertSupportedStateSchemaVersion(database, pathname);
	if (readStateSchemaMigrationVersion(database) !== 20) throw new Error(`Existing shared-state database ${pathname} requires schema migration by its owning installation; run openclaw doctor --fix there before using it.`);
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
/** Prove the existing runtime contract without certifying this release's repairs. */
function assertExistingOpenClawStateRuntimeSchema(database, pathname) {
	const schemaCookie = runSqliteDeferredTransactionSync(database, () => {
		assertExistingOpenClawStateRuntimeMetadata(database, pathname);
		const currentCookie = readSqliteSchemaCookie(database);
		if (typeof currentCookie !== "number") throw new Error(`Existing shared-state database ${pathname} schema version is unavailable.`);
		const cached = validatedSchemas.get(database);
		if (cached?.cookie !== currentCookie) {
			cached?.unregister();
			validatedSchemas.delete(database);
			assertSqliteIntegrity(database, pathname);
			const readTable = createSqliteTableContractReader(database);
			assertCurrentStateRuntimeSchema(database, pathname, readTable);
			assertNoLegacyStateRuntimeRepair(database, pathname);
		}
		return currentCookie;
	});
	if (!database.isTransaction && validatedSchemas.get(database)?.cookie !== schemaCookie) {
		const unregister = registerNodeSqliteDisposeCallback(database, () => {
			validatedSchemas.delete(database);
			unregister();
		});
		validatedSchemas.set(database, {
			cookie: schemaCookie,
			unregister
		});
	}
}
//#endregion
export { assertExistingOpenClawStateRuntimeSchema as n, assertExistingOpenClawStateRuntimeMetadata as t };
