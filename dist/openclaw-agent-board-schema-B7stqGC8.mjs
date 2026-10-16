import { t as extractSqliteTableSchema } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BcJs-SM4.mjs";
//#region src/state/openclaw-agent-board-schema.ts
const BOARD_WIDGETS_SCHEMA_START = "CREATE TABLE IF NOT EXISTS board_widgets (";
const BOARD_WIDGETS_MIGRATION_TABLE = "board_widgets_plugin_kind_migration_new";
const PLUGIN_CONTENT_KIND_CLAUSE_PATTERN = /content_kind\s+IN\s*\(\s*'html'\s*,\s*'mcp-app'\s*,\s*'plugin'\s*\)/iu;
const PLUGIN_PAYLOAD_BRANCH_PATTERN = /\s+OR\s+\(content_kind\s*=\s*'plugin'\s+AND\s+html\s+IS\s+NULL\s+AND\s+descriptor_json\s+IS\s+NOT\s+NULL\s+AND\s+view_generation\s+IS\s+NULL\)/iu;
const OPENCLAW_AGENT_BOARD_SCHEMA_SQL = extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "board_tabs", {
	endMarker: "CREATE TABLE IF NOT EXISTS session_progress_cards (",
	includeEndMarker: false,
	errorMessage: "OpenClaw agent board schema markers are missing from the canonical schema."
});
const AGENT_V14_BOARD_SCHEMA_SQL = OPENCLAW_AGENT_BOARD_SCHEMA_SQL;
const OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL = OPENCLAW_AGENT_SCHEMA_SQL.replace(OPENCLAW_AGENT_BOARD_SCHEMA_SQL, "");
function canonicalBoardWidgetsCreateSql() {
	return extractSqliteTableSchema(OPENCLAW_AGENT_BOARD_SCHEMA_SQL, "board_widgets", {
		endMarker: "CREATE INDEX IF NOT EXISTS idx_agent_board_widgets_tab_position",
		includeEndMarker: false,
		errorMessage: "OpenClaw agent board widget schema markers are missing."
	}).trim();
}
function legacyBoardWidgetsCreateSql() {
	const canonical = canonicalBoardWidgetsCreateSql();
	const legacy = canonical.replace(PLUGIN_CONTENT_KIND_CLAUSE_PATTERN, "content_kind IN ('html', 'mcp-app')").replace(PLUGIN_PAYLOAD_BRANCH_PATTERN, "");
	if (legacy === canonical) throw new Error("OpenClaw agent board widget legacy schema derivation failed.");
	return legacy;
}
function normalizeBoardWidgetsCreateSql(sql) {
	return sql.replace(/^CREATE TABLE(?: IF NOT EXISTS)?\s+(?:board_widgets|"board_widgets"|`board_widgets`|\[board_widgets\])\s*\(/iu, "CREATE TABLE board_widgets (").replace(/\s+/gu, " ").replace(/;\s*$/u, "").trim();
}
/** Repair the v14 board constraint inside the caller's schema/write transaction. */
function ensureOpenClawAgentBoardSchemaInTransaction(db) {
	if (!db.isTransaction) throw new Error("board schema ensure requires an active transaction");
	db.exec(OPENCLAW_AGENT_BOARD_SCHEMA_SQL);
	const row = db.prepare("SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = 'board_widgets'").get();
	if (typeof row?.sql !== "string") throw new Error("OpenClaw agent board widget schema is missing after ensure.");
	const normalizedSchema = normalizeBoardWidgetsCreateSql(row.sql);
	if (normalizedSchema === normalizeBoardWidgetsCreateSql(canonicalBoardWidgetsCreateSql())) return;
	if (normalizedSchema !== normalizeBoardWidgetsCreateSql(legacyBoardWidgetsCreateSql())) throw new Error("OpenClaw agent board widget schema has an unsupported content-kind constraint.");
	if (db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?").get(BOARD_WIDGETS_MIGRATION_TABLE)) throw new Error(`OpenClaw agent board migration table already exists: ${BOARD_WIDGETS_MIGRATION_TABLE}`);
	const migrationCreateSql = canonicalBoardWidgetsCreateSql().replace(BOARD_WIDGETS_SCHEMA_START, `CREATE TABLE ${BOARD_WIDGETS_MIGRATION_TABLE} (`);
	db.exec(`
    ${migrationCreateSql}
    INSERT INTO ${BOARD_WIDGETS_MIGRATION_TABLE} (
      session_key, name, tab_id, title, content_kind, html, descriptor_json, sha256,
      view_generation, revision, size_w, size_h, position, manifest, grant_state,
      granted_sha, created_by, created_at, updated_at
    )
    SELECT
      session_key, name, tab_id, title, content_kind, html, descriptor_json, sha256,
      view_generation, revision, size_w, size_h, position, manifest, grant_state,
      granted_sha, created_by, created_at, updated_at
    FROM board_widgets;
    DROP TABLE board_widgets;
    ALTER TABLE ${BOARD_WIDGETS_MIGRATION_TABLE} RENAME TO board_widgets;
  `);
	db.exec(OPENCLAW_AGENT_BOARD_SCHEMA_SQL);
}
//#endregion
export { OPENCLAW_AGENT_SCHEMA_WITHOUT_BOARD_SQL as n, ensureOpenClawAgentBoardSchemaInTransaction as r, AGENT_V14_BOARD_SCHEMA_SQL as t };
