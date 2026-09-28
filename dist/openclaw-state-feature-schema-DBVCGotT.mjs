import { tt as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
//#region src/state/openclaw-state-feature-schema.ts
/** Prepare canonical DDL without opening a database; each feature keeps its own handle cache. */
function createOpenClawStateSchemaEnsurer(params) {
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(`\nCREATE TABLE IF NOT EXISTS ${params.table} (\n`);
	const endMarker = params.endMarker ?? "\n) STRICT;\n";
	const end = OPENCLAW_STATE_SCHEMA_SQL.indexOf(endMarker, start);
	if (start < 0 || end < start) throw new Error(`Canonical state schema markers are missing for ${params.table}`);
	const schema = OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + endMarker.length);
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
