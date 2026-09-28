import { i as getNodeSqliteKysely } from "./kysely-sync-Bn6Qrpbz.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import path from "node:path";
//#region src/skills/workshop/store-sqlite-schema.ts
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS skill_workshop_proposals (
  proposal_id TEXT NOT NULL PRIMARY KEY,
  record_json TEXT NOT NULL,
  owner_agent_id TEXT,
  kind TEXT NOT NULL CHECK (kind IN ('create', 'update')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'applied', 'rejected', 'quarantined', 'stale')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  draft_hash TEXT NOT NULL,
  origin_agent_id TEXT,
  origin_session_key TEXT,
  origin_run_id TEXT,
  origin_message_id TEXT,
  applied_at TEXT,
  rejected_at TEXT,
  quarantined_at TEXT,
  stale_at TEXT,
  status_reason TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS skill_workshop_collection_reviews (
  review_id TEXT NOT NULL PRIMARY KEY,
  owner_agent_id TEXT NOT NULL,
  backup_id TEXT NOT NULL,
  create_time INTEGER NOT NULL,
  kept_names_json TEXT NOT NULL,
  written_names_json TEXT NOT NULL,
  dropped_json TEXT NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS skill_workshop_proposal_rollbacks (
  proposal_id TEXT NOT NULL PRIMARY KEY,
  written_at TEXT NOT NULL,
  target_skill_file TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update')),
  previous_content_hash TEXT,
  previous_content TEXT,
  support_files_json TEXT,
  FOREIGN KEY (proposal_id) REFERENCES skill_workshop_proposals(proposal_id) ON DELETE CASCADE
) STRICT;

CREATE TABLE IF NOT EXISTS skill_workshop_proposal_events (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL UNIQUE,
  proposal_id TEXT NOT NULL,
  proposed_version TEXT NOT NULL,
  revision_hash TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'created',
    'revised',
    'evaluation_completed',
    'applied',
    'rejected',
    'quarantined',
    'stale'
  )),
  occurred_at TEXT NOT NULL,
  actor_json TEXT NOT NULL,
  correlation_id TEXT,
  payload_json TEXT,
  FOREIGN KEY (proposal_id) REFERENCES skill_workshop_proposals(proposal_id) ON DELETE CASCADE
) STRICT;

CREATE INDEX IF NOT EXISTS idx_skill_workshop_proposal_events_proposal
  ON skill_workshop_proposal_events(proposal_id, sequence);
`;
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
function databaseOptions(options = {}) {
	if (options.stateDir) return {
		...options.env ? { env: options.env } : {},
		path: path.join(path.resolve(options.stateDir), "state", "openclaw.sqlite")
	};
	return options.env ? { env: options.env } : {};
}
function ensureSkillWorkshopSchema(options = {}) {
	const dbOptions = databaseOptions(options);
	ensureSkillWorkshopSchemaInDatabase(openOpenClawStateDatabase(dbOptions), dbOptions);
}
function ensureSkillWorkshopSchemaInDatabase(database, dbOptions) {
	if (ensuredDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(SCHEMA_SQL);
	}, dbOptions, { operationLabel: "skill-workshop.schema.ensure" });
	ensuredDatabases.add(database.db);
}
function openSkillWorkshopStore(options = {}) {
	ensureSkillWorkshopSchema(options);
	const database = openOpenClawStateDatabase(databaseOptions(options));
	return {
		database,
		kysely: getNodeSqliteKysely(database.db)
	};
}
//#endregion
export { openSkillWorkshopStore as i, ensureSkillWorkshopSchema as n, ensureSkillWorkshopSchemaInDatabase as r, databaseOptions as t };
