import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { i as readLegacyMigrationReceiptFromDatabase, n as markLegacyMigrationSourceRemovedInDatabase, o as recordLegacyMigrationReceipt } from "./state-migrations.receipts-gEcgM3Aq.mjs";
import { n as parseMcpOAuthStoreJson } from "./mcp-oauth-store.kernel-C3O_QZCi.mjs";
//#region src/infra/state-migrations.mcp-oauth.worker.ts
const MIGRATION_KIND = "legacy-mcp-oauth-json";
function importAndRecordReceiptInDatabase(db, params) {
	const { sourceKey, storeKey, now } = params;
	const runId = `${sourceKey}:${params.sourceSha256.slice(0, 16)}`;
	const stateDb = getNodeSqliteKysely(db);
	if (readLegacyMigrationReceiptFromDatabase(db, sourceKey)) return {
		sourceKey,
		imported: false
	};
	const existingStore = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("mcp_oauth_stores").selectAll().where("store_key", "=", storeKey));
	let importedLegacyState;
	if (existingStore) {
		if (existingStore.format_version !== 1) throw new Error("canonical MCP OAuth store has an unsupported format version");
		const canonicalStore = parseMcpOAuthStoreJson(storeKey, existingStore.store_json);
		const canMergeLegacyState = canonicalStore.credentialState === "uninitialized";
		const legacyStore = { ...params.store };
		if (canonicalStore.pendingAuthorizationChallenge?.resourceMetadataUrl) delete legacyStore.discoveryState;
		importedLegacyState = canMergeLegacyState && Object.keys(legacyStore).some((key) => !Object.hasOwn(canonicalStore, key));
		if (importedLegacyState) {
			const mergedStore = {
				...legacyStore,
				...canonicalStore
			};
			delete mergedStore.credentialState;
			executeSqliteQuerySync(db, stateDb.updateTable("mcp_oauth_stores").set({
				store_json: JSON.stringify(mergedStore),
				updated_at: now
			}).where("store_key", "=", storeKey));
		}
	} else {
		importedLegacyState = true;
		executeSqliteQuerySync(db, stateDb.insertInto("mcp_oauth_stores").values({
			store_key: storeKey,
			format_version: 1,
			store_json: JSON.stringify(params.store),
			updated_at: now
		}));
	}
	const verified = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("mcp_oauth_stores").selectAll().where("store_key", "=", storeKey));
	if (!verified || verified.format_version !== 1) throw new Error("SQLite verification failed for an MCP OAuth store");
	parseMcpOAuthStoreJson(storeKey, verified.store_json);
	const reportJson = JSON.stringify({
		source: MIGRATION_KIND,
		target: "mcp_oauth_stores",
		storeKey,
		sourceSha256: params.sourceSha256,
		importedRecordCount: importedLegacyState ? 1 : 0,
		preservedSqliteRecordCount: existingStore ? 1 : 0
	});
	recordLegacyMigrationReceipt(db, {
		sourceKey,
		migrationKind: MIGRATION_KIND,
		sourcePath: params.sourcePath,
		targetTable: "mcp_oauth_stores",
		sourceSha256: params.sourceSha256,
		sourceSizeBytes: params.sourceSizeBytes,
		sourceRecordCount: 1,
		runId,
		now,
		reportJson
	});
	return {
		sourceKey,
		imported: importedLegacyState
	};
}
/** Doctor's original maintenance owner authorizes this separate migration family. */
function migrationWrite(operation, recordReceipt) {
	return (input, { open }) => {
		const database = open();
		return runOpenClawStateWriteTransaction(({ db }) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: void 0
			});
			const result = operation(db, input);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			recordReceipt?.(db, result);
			return result;
		}, {
			database,
			path: database.path,
			env: getSqliteWorkerStateContext().environment
		});
	};
}
const legacyMcpOAuthOperations = {
	"legacyMcpOAuth.readReceipt": (input, { open }) => readLegacyMigrationReceiptFromDatabase(open().db, input.sourceKey),
	"legacyMcpOAuth.import": migrationWrite(importAndRecordReceiptInDatabase, deferSqliteWorkerCommitReceipt),
	"legacyMcpOAuth.markRemoved": migrationWrite((db, input) => {
		markLegacyMigrationSourceRemovedInDatabase(db, input.sourceKey);
	})
};
//#endregion
export { legacyMcpOAuthOperations };
