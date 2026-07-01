import type { SubagentRunRecord } from "./subagent-registry.types.js";
/** Loads subagent runs from sqlite, importing and deleting the legacy JSON store when needed. */
export declare function loadSubagentRegistryFromSqlite(): Map<string, SubagentRunRecord>;
/** Saves the complete subagent run snapshot to sqlite and prunes rows not in the snapshot. */
export declare function saveSubagentRegistryToSqlite(runs: Map<string, SubagentRunRecord>): void;
