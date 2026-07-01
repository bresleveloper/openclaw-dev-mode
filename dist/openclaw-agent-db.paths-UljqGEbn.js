import { s as resolveOpenClawStateSqliteDir } from "./openclaw-state-db-gblCDNfo.js";
import { u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import path from "node:path";
//#region src/state/openclaw-agent-db.paths.ts
/** Resolve the SQLite file for one normalized agent id. */
function resolveOpenClawAgentSqlitePath(options) {
	const agentId = normalizeAgentId(options.agentId);
	return path.resolve(options.path ?? path.join(path.dirname(resolveOpenClawStateSqliteDir(options.env ?? process.env)), "agents", agentId, "agent", "openclaw-agent.sqlite"));
}
//#endregion
export { resolveOpenClawAgentSqlitePath as t };
