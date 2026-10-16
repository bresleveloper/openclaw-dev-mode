import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { f as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import path from "node:path";
//#region src/skills/workshop/store-sqlite-schema.ts
const SCHEMA_SQL = [...[
	"skill_workshop_proposals",
	"skill_workshop_collection_reviews",
	"skill_workshop_proposal_rollbacks",
	"skill_workshop_proposal_events"
].map((table) => extractSqliteTableSchema(OPENCLAW_STATE_SCHEMA_SQL, table)), `CREATE INDEX IF NOT EXISTS idx_skill_workshop_proposal_events_proposal
  ON skill_workshop_proposal_events(proposal_id, sequence);`].join("\n");
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
function databaseOptions(options = {}) {
	if (options.stateDir) return {
		...options.env ? { env: options.env } : {},
		path: path.join(path.resolve(options.stateDir), "state", "openclaw.sqlite")
	};
	return options.env ? { env: options.env } : {};
}
function ensureSkillWorkshopSchemaInDatabase(database, dbOptions, assertWrite) {
	if (ensuredDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		assertWrite?.(db, "transaction");
		db.exec(SCHEMA_SQL);
		assertWrite?.(db, "commit");
	}, dbOptions, { operationLabel: "skill-workshop.schema.ensure" });
	ensuredDatabases.add(database.db);
}
//#endregion
export { ensureSkillWorkshopSchemaInDatabase as n, databaseOptions as t };
