import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as addGatewayClientOptions } from "./gateway-rpc-Wcwajg7Y.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-C0bJ9VIR.mjs";
import { n as formatHelpExamples, t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { n as parseStrictPositiveIntOption, t as collectOption } from "./helpers-CZZt1vds.mjs";
//#region src/cli/program/register.backup.ts
function backupAction(load) {
	return (opts) => runCommandWithRuntime(defaultRuntime, async () => {
		await (await load())(defaultRuntime, opts);
	});
}
function registerBackupCommand(program) {
	const backup = program.command("backup").description("Create, verify, and restore backup archives and SQLite snapshots").addHelpText("after", () => formatDocsHelp("/cli/backup"));
	backup.command("create").description("Write a backup archive for config, credentials, sessions, and workspaces").action(backupAction(async () => (await import("./backup-Yqzw4yS3.mjs")).backupCreateCommand)).option("--output <path>", "Archive path or destination directory").option("--to <location>", "Upload the verified archive to a storage location").option("--claim-namespace", "Deliberately take over the backup namespace for this installation").option("--namespace <name>", "Backup namespace (default: sanitized hostname)").option("--keep-daily <n>", "Retain the newest backup in N daily UTC buckets").option("--keep-weekly <n>", "Retain the newest backup in N weekly UTC buckets").option("--keep-monthly <n>", "Retain the newest backup in N monthly UTC buckets").option("--json", "Output JSON", false).option("--dry-run", "Print the backup plan without writing the archive", false).option("--verify", "Verify the archive after writing it", false).option("--only-config", "Back up only the active JSON config file", false).option("--no-include-workspace", "Exclude workspace directories from the backup").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw backup create", "Create a timestamped backup in the current directory."],
		["openclaw backup create --output ~/Backups", "Write the archive into an existing backup directory."],
		["openclaw backup create --dry-run --json", "Preview the archive plan without writing any files."],
		["openclaw backup create --verify", "Create the archive and immediately validate its manifest and payload layout."],
		["openclaw backup create --no-include-workspace", "Back up state/config without agent workspace files."],
		["openclaw backup create --only-config", "Back up only the active JSON config file."]
	])}`);
	for (const operation of ["verify", "restore"]) {
		const restore = operation === "restore";
		const command = backup.command(`${operation} <archive>`).description(restore ? "Restore a verified backup archive to a fresh staging directory" : "Validate a backup archive and its embedded manifest").option("--from <location>", "Read a backup key or latest from a storage location").option("--namespace <name>", "Backup namespace (default: sanitized hostname)");
		if (restore) command.requiredOption("--target <dir>", "Fresh target directory; non-empty directories are refused");
		command.option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples(restore ? [["openclaw backup restore ~/Backups/latest.tar.gz --target ./restored-openclaw", "Verify, then extract the whole archive into a fresh staging directory."], ["openclaw backup restore ~/Backups/latest.tar.gz --target ./restored-openclaw --json", "Emit machine-readable restore details and rollback warnings."]] : [["openclaw backup verify ./2026-03-09T08-00-00.000+08-00-openclaw-backup.tar.gz", "Check that the archive structure and manifest are intact."], ["openclaw backup verify ~/Backups/latest.tar.gz --json", "Emit machine-readable verification output."]])}`).action((archive, opts) => runCommandWithRuntime(defaultRuntime, async () => {
			if (opts.from !== void 0) {
				const remote = await import("./backup-remote-qvQ_224k.mjs");
				await (restore ? remote.backupRemoteRestoreCommand : remote.backupRemoteVerifyCommand)(defaultRuntime, {
					...opts,
					archive
				});
				return;
			}
			if (opts.namespace) throw new Error("--namespace requires --from <location>.");
			await (restore ? (await import("./backup-restore-Bz0gbUph.mjs")).backupRestoreCommand : (await import("./backup-verify-DEhecj-d.mjs")).backupVerifyCommand)(defaultRuntime, {
				...opts,
				archive
			});
		}));
	}
	backup.command("list").description("List archives in a storage location").action(backupAction(async () => (await import("./backup-remote-qvQ_224k.mjs")).backupListCommand)).requiredOption("--from <location>", "Storage location name").option("--namespace <name>", "Backup namespace (default: sanitized hostname)").option("--json", "Output JSON", false);
	backup.command("record").description("Record an external backup job outcome").action(backupAction(async () => (await import("./backup-record-BP9NlpgV.mjs")).backupRecordCommand)).requiredOption("--status <status>", "ok or failed").requiredOption("--target <label>", "External backup target label").option("--bytes <n>", "Backup size in bytes").option("--error <text>", "Failure details").option("--json", "Output JSON", false);
	registerBackupSqliteCommands(backup);
	registerBackupGitCommands(backup);
	registerBackupScheduleCommands(backup);
}
function registerBackupScheduleCommands(backup) {
	addGatewayClientOptions(backup.command("enable").description("Provision a Gateway automation for offsite or Git backups").action(backupAction(async () => (await import("./backup-schedule-BansbmN8.mjs")).backupEnableCommand)).option("--repository <path>", "Git backup repository directory").option("--to <location>", "Storage location for offsite archive backups").option("--claim-namespace", "Deliberately take over the backup namespace on each scheduled run").option("--namespace <name>", "Backup namespace (default: sanitized hostname)").option("--no-include-workspace", "Exclude workspace directories from offsite archives").option("--keep-daily <n>", "Retain the newest backup in N daily UTC buckets").option("--keep-weekly <n>", "Retain the newest backup in N weekly UTC buckets").option("--keep-monthly <n>", "Retain the newest backup in N monthly UTC buckets").option("--every <duration>", "Backup interval", "24h").option("--push", "Push the current branch to origin after each backup", false).option("--exclude-secrets", "Omit credential-bearing database tables", false).option("--include-secrets", "Keep credential-bearing tables in pushed scheduled backups", false).option("--global-only", "Back up only the shared state database", false).option("--agent <id>", "Back up only one agent database"));
	addGatewayClientOptions(backup.command("disable").description("Remove both scheduled backup modes, or the selected mode").action(backupAction(async () => (await import("./backup-schedule-BansbmN8.mjs")).backupDisableCommand)).option("--offsite", "Disable only offsite archive backups", false).option("--git", "Disable only Git backups", false));
}
function registerBackupGitCommands(backup) {
	const git = backup.command("git").description("Create and restore reproducible versioned SQLite dumps in Git").action(() => {
		git.outputHelp();
		process.exitCode = 1;
	});
	git.command("init").description("Initialize or adopt an operator-owned Git backup repository").action(backupAction(async () => (await import("./backup-git-BBoe-6ev.mjs")).backupGitInitCommand)).requiredOption("--repository <path>", "Git backup repository directory").option("--remote <url>", "Add the remote as origin").option("--json", "Output JSON", false);
	git.command("create").description("Dump selected OpenClaw databases and commit one Git revision").requiredOption("--repository <path>", "Git backup repository directory").option("--all", "Back up the shared database and every registered agent database", false).option("--global", "Back up the shared OpenClaw state database", false).option("--agent <id>", "Back up an agent database (repeatable)", collectOption, []).option("--push", "Push the current branch to origin", false).option("--exclude-secrets", "Omit credential-bearing database tables", false).option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupGitCreateCommand } = await import("./backup-git-BBoe-6ev.mjs");
			const { agent: agents, ...options } = opts;
			await backupGitCreateCommand(defaultRuntime, {
				...options,
				agents
			});
		});
	});
	git.command("log").description("Show Git backup commits").action(backupAction(async () => (await import("./backup-git-BBoe-6ev.mjs")).backupGitLogCommand)).requiredOption("--repository <path>", "Git backup repository directory").option("--limit <n>", "Maximum commits to show", (value) => parseStrictPositiveIntOption(value, "--limit"), 20).option("--json", "Output JSON", false);
	for (const operation of ["verify", "restore"]) {
		const restore = operation === "restore";
		const verb = restore ? "Restore" : "Verify";
		const command = git.command(operation).description(restore ? "Restore one database snapshot from a Git ref to a fresh SQLite file" : "Restore and verify one database snapshot from a Git ref").action(backupAction(async () => {
			const commands = await import("./backup-git-BBoe-6ev.mjs");
			return restore ? commands.backupGitRestoreCommand : commands.backupGitVerifyCommand;
		})).requiredOption("--repository <path>", "Git backup repository directory");
		if (restore) command.requiredOption("--target <path>", "Fresh target path; existing files and sidecars are refused");
		command.option("--ref <commit>", `Commit or ref to ${operation}`, "HEAD").option("--global", `${verb} the shared state database`, false).option("--agent <id>", `${verb} one agent database`).option("--json", "Output JSON", false);
	}
}
function registerBackupSqliteCommands(backup) {
	const sqlite = backup.command("sqlite").description("Create, list, verify, and restore SQLite snapshots").action(() => {
		sqlite.outputHelp();
		process.exitCode = 1;
	});
	sqlite.command("create").description("Create a compact, verified snapshot of an OpenClaw SQLite database").action(backupAction(async () => (await import("./backup-sqlite-D82vj3E6.mjs")).backupSqliteCreateCommand)).option("--global", "Snapshot the shared OpenClaw state database", false).option("--agent <id>", "Snapshot one per-agent OpenClaw database").requiredOption("--repository <path>", "Snapshot repository directory").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([["openclaw backup sqlite create --global --repository ~/Backups/openclaw-sqlite", "Snapshot the shared state database."], ["openclaw backup sqlite create --agent main --repository ~/Backups/openclaw-sqlite", "Snapshot the main agent database."]])}`);
	sqlite.command("list").description("List committed snapshots in a repository").action(backupAction(async () => (await import("./backup-sqlite-D82vj3E6.mjs")).backupSqliteListCommand)).requiredOption("--repository <path>", "Snapshot repository directory").option("--json", "Output JSON", false);
	for (const operation of ["verify", "restore"]) {
		const restore = operation === "restore";
		const command = sqlite.command(`${operation} <snapshot>`).description(restore ? "Restore a verified snapshot to a new SQLite database path" : "Verify a snapshot manifest, artifact hash, SQLite integrity, and database owner");
		if (restore) command.requiredOption("--target <path>", "Fresh target path; existing files and sidecars are refused");
		else command.option("--scratch <path>", "Existing private directory for verification copies");
		command.option("--json", "Output JSON", false).action((snapshot, opts) => runCommandWithRuntime(defaultRuntime, async () => {
			const commands = await import("./backup-sqlite-D82vj3E6.mjs");
			await (restore ? commands.backupSqliteRestoreCommand : commands.backupSqliteVerifyCommand)(defaultRuntime, snapshot, opts);
		}));
	}
}
//#endregion
export { registerBackupCommand };
