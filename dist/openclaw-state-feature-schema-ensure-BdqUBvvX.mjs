import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { r as ensureStatePostgresFragment } from "./openclaw-state-db-engine-DST3Q_pv.mjs";
import { t as createSqliteSchemaEnsurer } from "./sqlite-schema-ensure-CwIgvH1h.mjs";
import { t as getOpenClawStateFeatureSchemaSql } from "./openclaw-state-feature-schema-CYc16G0w.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
//#region src/state/openclaw-state-feature-schema-ensure.ts
/** Prepare canonical DDL without opening a database; each feature keeps its own handle cache. */
function createOpenClawStateSchemaEnsurer(params) {
	const schema = getOpenClawStateFeatureSchemaSql(params.table, {
		endMarker: params.endMarker ?? "\n) STRICT;\n",
		errorMessage: `Canonical state schema markers are missing for ${params.table}`
	});
	const ensure = createSqliteSchemaEnsurer(() => schema, {
		tables: [params.table, ...params.additionalTables ?? []],
		indexes: params.indexes
	});
	const ensuredDatabases = /* @__PURE__ */ new WeakSet();
	return (options = {}) => {
		const database = openOpenClawStateDatabase(options);
		if (!isPostgresSqlConnection(database.db) && ensuredDatabases.has(database.db)) return;
		runOpenClawStateWriteTransaction(({ db }) => {
			if (isPostgresSqlConnection(db)) ensureStatePostgresFragment(db, params.table);
			else ensure(db);
		}, options, { operationLabel: params.operationLabel });
		ensuredDatabases.add(database.db);
	};
}
//#endregion
export { createOpenClawStateSchemaEnsurer as t };
