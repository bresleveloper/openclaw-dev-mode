import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { f as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
//#region src/state/openclaw-state-feature-schema.ts
/** Prepare canonical DDL without opening a database; each feature keeps its own handle cache. */
function createOpenClawStateSchemaEnsurer(params) {
	const schema = extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, params.table, {
		endMarker: params.endMarker ?? "\n) STRICT;\n",
		errorMessage: `Canonical state schema markers are missing for ${params.table}`
	});
	const ensuredDatabases = /* @__PURE__ */ new WeakSet();
	return (options = {}) => {
		const database = openOpenClawStateDatabase(options);
		if (ensuredDatabases.has(database.db)) return;
		runOpenClawStateWriteTransaction(({ db }) => {
			db.exec(schema);
		}, options, { operationLabel: params.operationLabel });
		ensuredDatabases.add(database.db);
	};
}
//#endregion
export { createOpenClawStateSchemaEnsurer as t };
