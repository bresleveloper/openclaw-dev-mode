import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import { existsSync } from "node:fs";
import path from "node:path";
//#region src/state/openclaw-agent-db.paths.ts
const INCOGNITO_AGENT_SQLITE_BASENAME = "incognito-openclaw-agent.sqlite";
var IncognitoAgentDatabasePathCollisionError = class extends Error {
	constructor(pathname) {
		super(`Incognito agent database sentinel path already exists: ${pathname}. This filename is reserved for in-memory incognito state; move or rename the file and retry.`);
		this.name = "IncognitoAgentDatabasePathCollisionError";
		this.path = pathname;
	}
};
function assertIncognitoAgentDatabasePathAvailable(pathname) {
	if (existsSync(pathname)) throw new IncognitoAgentDatabasePathCollisionError(pathname);
}
const agentSqlitePaths = /* @__PURE__ */ new Map();
const agentSqlitePathKeys = agentSqlitePaths.keys();
/** Resolve the SQLite file for one normalized agent id. */
function resolveOpenClawAgentSqlitePath(options) {
	const agentId = normalizeAgentId(options.agentId);
	if (options.path != null) return path.resolve(options.path);
	const stateDir = resolveStateDir(options.env ?? process.env);
	const cacheKey = `${agentId}:${stateDir}`;
	const cached = agentSqlitePaths.get(cacheKey);
	if (cached !== void 0) return cached;
	const resolved = path.resolve(stateDir, "agents", agentId, "agent", "openclaw-agent.sqlite");
	agentSqlitePaths.set(cacheKey, resolved);
	if (agentSqlitePaths.size > 256) {
		const oldest = agentSqlitePathKeys.next();
		if (!oldest.done) agentSqlitePaths.delete(oldest.value);
	}
	return resolved;
}
/** Resolve the lexical sentinel path that keys one agent's process-held incognito database. */
function resolveIncognitoOpenClawAgentSqlitePath(options) {
	return path.join(path.dirname(resolveOpenClawAgentSqlitePath(options)), INCOGNITO_AGENT_SQLITE_BASENAME);
}
/** Identify the reserved incognito sentinel without touching its filesystem path. */
function isIncognitoOpenClawAgentSqlitePath(pathname, options) {
	const resolved = path.resolve(pathname);
	return path.basename(resolved) === "incognito-openclaw-agent.sqlite" && resolved === resolveIncognitoOpenClawAgentSqlitePath(options);
}
//#endregion
export { resolveOpenClawAgentSqlitePath as a, resolveIncognitoOpenClawAgentSqlitePath as i, assertIncognitoAgentDatabasePathAvailable as n, isIncognitoOpenClawAgentSqlitePath as r, INCOGNITO_AGENT_SQLITE_BASENAME as t };
