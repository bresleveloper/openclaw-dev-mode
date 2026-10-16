//#region src/state/openclaw-agent-db-additive-columns.ts
const SESSION_OWNER_COLUMN_DEFINITIONS = [
	{
		columnName: "owner_actor_type",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_actor_id",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_assigned_by_type",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_assigned_by_id",
		dataType: "TEXT",
		tableName: "session_nodes"
	},
	{
		columnName: "owner_assigned_at",
		dataType: "INTEGER",
		tableName: "session_nodes"
	}
];
const LEGACY_ACP_MIGRATION_COLUMN_DEFINITION = {
	columnName: "legacy_acp_migration_json",
	dataType: "TEXT",
	tableName: "session_nodes"
};
const CANONICAL_READY_COLUMN_DEFINITION = {
	columnName: "canonical_ready",
	dataType: "TEXT",
	tableName: "session_key_contract"
};
const FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS = [
	...SESSION_OWNER_COLUMN_DEFINITIONS,
	LEGACY_ACP_MIGRATION_COLUMN_DEFINITION,
	CANONICAL_READY_COLUMN_DEFINITION
];
//#endregion
export { SESSION_OWNER_COLUMN_DEFINITIONS as i, FIRST_USE_ADDITIVE_AGENT_COLUMN_DEFINITIONS as n, LEGACY_ACP_MIGRATION_COLUMN_DEFINITION as r, CANONICAL_READY_COLUMN_DEFINITION as t };
