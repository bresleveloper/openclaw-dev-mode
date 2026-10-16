import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/state/agent-database-path-discovery.ts
/** Keep directory spellings until the consuming owner validates database identity. */
async function listDefaultAgentDatabasePaths(stateDir) {
	let entries;
	try {
		entries = await fs.readdir(path.join(stateDir, "agents"), { withFileTypes: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return [];
		throw error;
	}
	return entries.filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => ({
		agentId: entry.name,
		path: path.resolve(stateDir, "agents", entry.name, "agent", "openclaw-agent.sqlite")
	}));
}
//#endregion
export { listDefaultAgentDatabasePaths as t };
