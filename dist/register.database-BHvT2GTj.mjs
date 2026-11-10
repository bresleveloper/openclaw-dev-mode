import { o as writeRuntimeJson, r as defaultRuntime, s as writeRuntimeStdout } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { o as OPENCLAW_DATABASE_SCHEMA_DOCS_URL } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { r as formatCliJsonFailure } from "./failure-output-CpIKhMiV.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-udre-2i5.mjs";
import path from "node:path";
import { Option } from "commander";
//#region src/cli/program/register.database.ts
function writeDatabaseError(error, json) {
	if (json) writeRuntimeJson(defaultRuntime, formatCliJsonFailure(error));
	else defaultRuntime.error(formatErrorMessage(error));
	defaultRuntime.exit(1);
}
async function runDatabasePreflight(databasePath, options) {
	const result = options.agentId === void 0 ? await (await import("./openclaw-database-preflight-D3lTU13W.mjs")).preflightOpenClawStateDatabasePath(databasePath) : await (await import("./openclaw-agent-schema-inspection-753u3h4x.mjs")).preflightOpenClawAgentDatabasePath(databasePath, options.agentId);
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
		const managerId = options.manager;
		const ownership = managerId !== void 0 ? await (await import("./local-state-owner-DLqjNnxj.mjs")).runWithLocalStateOwner({
			method: "database.ownership.claim",
			params: { manager: managerId },
			target: databasePath,
			onForeignOwner: async () => {
				throw new Error("Cannot claim shared-state ownership while a Gateway or embedded agent is running. Stop the Gateway through the external supervisor and stop any embedded agents, then retry the ownership claim.");
			},
			runLocal: async ({ env, assertCurrent }) => {
				const { claimOpenClawStateOwnership } = await import("./openclaw-state-ownership-operations-CQM35y6u.mjs");
				assertCurrent();
				return claimOpenClawStateOwnership(managerId, {
					path: databasePath,
					env
				});
			}
		}) : (await import("./openclaw-state-ownership-DRkI5Egf.mjs")).inspectOpenClawStateOwnershipAtPath(databasePath);
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
	const database = program.command("database").description("Inspect database compatibility, manage ownership, and port workboard stores").addHelpText("after", `\nDocs: ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}\n`);
	database.command("port").description("Port all existing workboard stores offline between SQLite and PostgreSQL").addOption(new Option("--to <postgres|sqlite>", "destination engine").choices(["postgres", "sqlite"])).option("--dry-run", "inspect prerequisites without creating port artifacts", false).option("--json", "emit machine-readable JSON", false).addOption(new Option("--resume <manifest>", "resume an interrupted port").conflicts([
		"rollback",
		"to",
		"dryRun"
	])).addOption(new Option("--rollback <manifest>", "restore an interrupted port's complete original set").conflicts(["to", "dryRun"])).hook("preAction", (command) => {
		const { to, resume, rollback } = command.opts();
		if (!to && !resume && !rollback) command.error("Specify --to postgres|sqlite, --resume, or --rollback.");
	}).action(async (options) => {
		try {
			const { doctorDatabasePort } = await import("./doctor-database-port-CxWCegZa.mjs");
			const result = await doctorDatabasePort(options);
			if (options.json) writeRuntimeJson(defaultRuntime, result);
			else writeRuntimeStdout(defaultRuntime, `Database port: ${result.phase} (${result.engine}${"to" in result ? ` → ${result.to}` : ""}); ${result.stores.length} workboard stores.\n${"remainingSqlite" in result ? `${result.remainingSqlite.length} other stores remain on SQLite.\n` : ""}${"backup" in result ? `Original backup: ${result.backup}\n${result.restart}\n` : ""}${"verification" in result ? `${result.verification}\n` : ""}`);
		} catch (error) {
			writeDatabaseError(error, options.json === true);
		}
	});
	database.command("restore-migration-backup").description("Restore a scoped migration backup's tables and schema version while offline").argument("<backup>", "table-scoped pre-migration SQLite backup").argument("<database>", "original SQLite database; undeclared tables are preserved").option("--json", "emit machine-readable JSON", false).action(async (backupPath, sourcePath, options) => {
		try {
			const { restoreDoctorMigrationBackup } = await import("./doctor-migration-backup-restore-CeJBE5PI.mjs");
			const result = await restoreDoctorMigrationBackup({
				sourcePath,
				backupPath
			});
			if (options.json) writeRuntimeJson(defaultRuntime, result);
			else writeRuntimeStdout(defaultRuntime, `Restored scoped migration backup: ${backupPath}\n`);
		} catch (error) {
			writeDatabaseError(error, options.json === true);
		}
	});
	database.command("preflight").description("Compare one copied SQLite file with this release's state schema").argument("<path>", "explicit copied SQLite database path").option("--json", "emit machine-readable JSON", false).action(runDatabasePreflight);
	database.command("preflight-agent").description("Compare one copied agent SQLite file with this release's agent schema and owner").argument("<path>", "explicit copied agent SQLite database path").requiredOption("--agent-id <id>", "exact agent owner ID").option("--json", "emit machine-readable JSON", false).action(runDatabasePreflight);
	database.command("verify-preservation").description("Compare retained recovery captures without changing state or authorizing activation").argument("<original-manifest>", "sealed original recovery manifest").argument("<candidate-manifest>", "sealed capture after migration").requiredOption("--original-sha256 <digest>", "original manifest digest recorded before migration").requiredOption("--candidate-sha256 <digest>", "candidate manifest digest").option("--json", "emit machine-readable JSON", false).action(async (originalPath, candidatePath, options) => {
		try {
			const ref = (manifestPath, manifestSha256) => ({
				manifestPath: path.resolve(manifestPath),
				directory: path.dirname(path.resolve(manifestPath)),
				manifestSha256
			});
			const { inspectDoctorMigrationPreservation } = await import("./doctor-migration-preservation-aJ1N7T5-.mjs");
			const result = await inspectDoctorMigrationPreservation({
				original: ref(originalPath, options.originalSha256),
				candidate: ref(candidatePath, options.candidateSha256)
			});
			if (options.json) writeRuntimeJson(defaultRuntime, result);
			else writeRuntimeStdout(defaultRuntime, `Migration preservation: ${result.status}; ${result.databases} databases, ${result.files} files. Inspection only.\n${result.warnings.join("\n")}\n`);
		} catch (error) {
			writeDatabaseError(error, options.json === true);
		}
	});
	const ownership = database.command("ownership").description("Inspect or claim write ownership");
	ownership.command("status").description("Show durable shared-state write ownership").option("--json", "emit machine-readable JSON", false).action(runDatabaseOwnership);
	ownership.command("claim").description("Claim shared-state writes for the active external supervisor").requiredOption("--manager <id>", "stable external manager identifier").option("--json", "emit machine-readable JSON", false).action(runDatabaseOwnership);
	applyParentDefaultHelpAction(ownership);
	applyParentDefaultHelpAction(database);
}
//#endregion
export { registerDatabaseCommand };
