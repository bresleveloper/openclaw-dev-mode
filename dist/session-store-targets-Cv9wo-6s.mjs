import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { l as resolveSessionStoreTargets } from "./targets-DJGC6v85.mjs";
import "./sessions-CnzPI1yx.mjs";
import { t as ExpectedCliError } from "./failure-output-CpIKhMiV.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/session-store-targets.ts
const SESSION_STORE_SELECTION_CONTEXT = {
	surface: "session-store selection",
	hint: "Pass --agent <id> to select one agent, or --all-agents to include every configured agent."
};
function resolveExplicitSessionStorePath(params) {
	const storePath = path.resolve(params.storePath);
	const resolvedPath = resolveSqliteTargetFromSessionStorePath(storePath, { agentId: params.agentId }).path;
	const displayTarget = storePath === resolvedPath ? resolvedPath : `${resolvedPath} (resolved from --store ${JSON.stringify(params.inputStorePath)})`;
	let stat;
	try {
		stat = fs.statSync(resolvedPath);
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") throw new Error(`Session store target does not exist: ${displayTarget}. Pass a selector whose resolved SQLite target exists.`, { cause: error });
		throw new Error(`Could not inspect session store target ${displayTarget}: ${formatErrorMessage(error)}`, { cause: error });
	}
	if (!stat.isFile()) throw new Error(`Session store target is not a regular file: ${displayTarget}. Pass a selector whose resolved SQLite target is a regular file.`);
	let database;
	try {
		database = openNodeSqliteDatabase(resolvedPath, { readOnly: true });
		const applicationTables = database.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").all();
		if (applicationTables.length > 0 && !applicationTables.some((row) => row.name === "schema_meta")) throw new Error("the SQLite file has application tables but no OpenClaw schema metadata");
	} catch (error) {
		throw new Error(`Session store target is not a session store: ${displayTarget}. ${formatErrorMessage(error)}. Pass a legacy store selector or SQLite target reported by openclaw sessions or openclaw status.`, { cause: error });
	} finally {
		database?.close();
	}
	return storePath;
}
/** Selection failures reach the root CLI handler for shared JSON output and cleanup. */
function resolveCommandSessionStoreTargets(params) {
	try {
		const targets = resolveSessionStoreTargets(params.cfg, params.opts);
		if (!params.opts.store) return targets;
		const target = targets[0];
		if (!target) throw new Error("Explicit session store selection did not resolve a target.");
		return [{
			...target,
			storePath: resolveExplicitSessionStorePath({
				...target,
				inputStorePath: params.opts.store
			})
		}];
	} catch (error) {
		if (error instanceof AgentSelectionRequiredError) throw new AgentSelectionRequiredError(error.agentIds, SESSION_STORE_SELECTION_CONTEXT);
		const message = formatErrorMessage(error);
		throw new ExpectedCliError({
			message,
			humanOutput: message,
			machineOutput: message
		});
	}
}
//#endregion
export { resolveExplicitSessionStorePath as n, resolveCommandSessionStoreTargets as t };
