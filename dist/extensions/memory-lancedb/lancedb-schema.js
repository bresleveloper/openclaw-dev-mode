//#region extensions/memory-lancedb/lancedb-schema.ts
const MEMORY_TABLE_NAME = "memories";
const MEMORY_AGENT_ID_COLUMN = "agentId";
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
//#endregion
export { MEMORY_AGENT_ID_COLUMN, MEMORY_TABLE_NAME, hasAgentScopeColumn, legacyMemorySchemaError, memoryAgentPredicate, quoteLanceSqlString };
