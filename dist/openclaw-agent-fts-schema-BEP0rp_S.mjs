import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BKBD8edk.mjs";
import { r as getSqliteMemorySearchFtsSchemas } from "./sqlite-memory-search-fragments-BWe8Man0.mjs";
//#region src/state/openclaw-agent-fts-schema.ts
/** Static agent DDL and the memory owner's lazily installed FTS definitions. */
const AGENT_FTS_SCHEMAS = [OPENCLAW_AGENT_SCHEMA_SQL, ...getSqliteMemorySearchFtsSchemas()];
//#endregion
export { AGENT_FTS_SCHEMAS as t };
