// extensions/memory-lancedb/lancedb-schema.ts
const MEMORY_TABLE_NAME = "memories";
const MEMORY_AGENT_ID_COLUMN = "agentId";
const MEMORY_QUERY_COLUMNS = [
	"id",
	"text",
	"importance",
	"category",
	"createdAt"
];
function quoteLanceSqlString(value) {
	return `'${value.replaceAll("'", "''")}'`;
}
function memoryAgentPredicate(agentId) {
	return `${MEMORY_AGENT_ID_COLUMN} = ${quoteLanceSqlString(agentId)}`;
}
function hasAgentScopeColumn(schema) {
	return schema.fields.some((field) => field.name === MEMORY_AGENT_ID_COLUMN);
}
function legacyMemorySchemaError() {
	return /* @__PURE__ */ new Error("memory-lancedb: the existing memory table predates per-agent isolation. Run \"openclaw doctor --fix\" to assign legacy rows to the default agent, then restart OpenClaw.");
}
export { legacyMemorySchemaError as a, hasAgentScopeColumn as i, MEMORY_QUERY_COLUMNS as n, memoryAgentPredicate as o, MEMORY_TABLE_NAME as r, quoteLanceSqlString as s, MEMORY_AGENT_ID_COLUMN as t };
