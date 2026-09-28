import { a as writeRuntimeJson, o as writeRuntimeStdout, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { a as OPENCLAW_DATABASE_SCHEMA_DOCS_URL } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.mjs";
import path from "node:path";
//#region src/cli/program/register.database.ts
function writeDatabaseError(error, json) {
	const message = formatErrorMessage(error);
	if (json) writeRuntimeJson(defaultRuntime, { error: message });
	else defaultRuntime.error(message);
	defaultRuntime.exit(1);
}
async function runDatabasePreflight(databasePath, options) {
	const result = options.agentId === void 0 ? await (await import("./openclaw-database-preflight-DwZaE6VW.mjs")).preflightOpenClawStateDatabasePath(databasePath) : await (await import("./openclaw-agent-schema-inspection-_Lczqddn.mjs")).preflightOpenClawAgentDatabasePath(databasePath, options.agentId);
	if (options.json) writeRuntimeJson(defaultRuntime, result);
	else {
		const detail = result.reason ?? result.issues[0]?.message;
		writeRuntimeStdout(defaultRuntime, `Database preflight: ${result.status} (found ${result.foundVersion ?? "unknown"}, target ${result.targetVersion}).${detail ? `\n${detail}` : ""}\nSee ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.\n`);
	}
	if (result.status === "incompatible" || result.status === "indeterminate") defaultRuntime.exit(1);
}
async function runDatabaseOwnership(options) {
	try {
		const databasePath = path.resolve(resolveOpenClawStateSqlitePath(process.env));
		const ownership = options.manager !== void 0 ? (await import("./openclaw-state-ownership-operations-BAL6AzuN.mjs")).claimOpenClawStateOwnership(options.manager, {
			path: databasePath,
			env: process.env
		}) : (await import("./openclaw-state-ownership-BKoHPgJO.mjs")).inspectOpenClawStateOwnershipAtPath(databasePath);
		const status = ownership ? {
			status: "external",
			ownership
		} : { status: "unowned" };
		if (options.json) {
			writeRuntimeJson(defaultRuntime, {
				databasePath,
				...status
			});
			return;
		}
		const message = status.status === "external" ? `Shared state is externally owned by ${status.ownership.managerId}.` : "Shared state is not externally owned.";
		writeRuntimeStdout(defaultRuntime, `${message}\nSee ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.\n`);
	} catch (error) {
		writeDatabaseError(error, options.json === true);
	}
}
function registerDatabaseCommand(program) {
	const database = program.command("database").description("Inspect database schema compatibility and shared-state write ownership").addHelpText("after", `\nDocs: ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}\n`);
	database.command("preflight").description("Compare one copied SQLite file with this release's state schema").argument("<path>", "explicit copied SQLite database path").option("--json", "emit machine-readable JSON", false).action(runDatabasePreflight);
	database.command("preflight-agent").description("Compare one copied agent SQLite file with this release's agent schema and owner").argument("<path>", "explicit copied agent SQLite database path").requiredOption("--agent-id <id>", "exact canonical agent owner ID").option("--json", "emit machine-readable JSON", false).action(runDatabasePreflight);
	const ownership = database.command("ownership").description("Inspect or claim write ownership");
	ownership.command("status").description("Show durable shared-state write ownership").option("--json", "emit machine-readable JSON", false).action(runDatabaseOwnership);
	ownership.command("claim").description("Claim shared-state writes for the active external supervisor").requiredOption("--manager <id>", "stable external manager identifier").option("--json", "emit machine-readable JSON", false).action(runDatabaseOwnership);
	applyParentDefaultHelpAction(ownership);
	applyParentDefaultHelpAction(database);
}
//#endregion
export { registerDatabaseCommand };
