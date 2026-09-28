import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { t as addGatewayClientOptions } from "./gateway-rpc-DXO3PHhc.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import { t as formatHelpExamples } from "./help-format-Ctl5AOqy.mjs";
import { n as parseStrictPositiveIntOption } from "./helpers-BuPKARfv.mjs";
//#region src/cli/program/register.backup.ts
/** Register backup create/verify subcommands. */
function registerBackupCommand(program) {
	const backup = program.command("backup").description("Create, verify, and restore backup archives and SQLite snapshots").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/backup", "docs.openclaw.ai/cli/backup")}\n`);
	backup.command("create").description("Write a backup archive for config, credentials, sessions, and workspaces").option("--output <path>", "Archive path or destination directory").option("--json", "Output JSON", false).option("--dry-run", "Print the backup plan without writing the archive", false).option("--verify", "Verify the archive after writing it", false).option("--only-config", "Back up only the active JSON config file", false).option("--no-include-workspace", "Exclude workspace directories from the backup").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw backup create", "Create a timestamped backup in the current directory."],
		["openclaw backup create --output ~/Backups", "Write the archive into an existing backup directory."],
		["openclaw backup create --dry-run --json", "Preview the archive plan without writing any files."],
		["openclaw backup create --verify", "Create the archive and immediately validate its manifest and payload layout."],
		["openclaw backup create --no-include-workspace", "Back up state/config without agent workspace files."],
		["openclaw backup create --only-config", "Back up only the active JSON config file."]
	])}`).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupCreateCommand } = await import("./backup-gbHu880O.mjs");
			await backupCreateCommand(defaultRuntime, {
				output: opts.output,
				json: Boolean(opts.json),
				dryRun: Boolean(opts.dryRun),
				verify: Boolean(opts.verify),
				onlyConfig: Boolean(opts.onlyConfig),
				includeWorkspace: opts.includeWorkspace
			});
		});
	});
	backup.command("verify <archive>").description("Validate a backup archive and its embedded manifest").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([["openclaw backup verify ./2026-03-09T08-00-00.000+08-00-openclaw-backup.tar.gz", "Check that the archive structure and manifest are intact."], ["openclaw backup verify ~/Backups/latest.tar.gz --json", "Emit machine-readable verification output."]])}`).action(async (archive, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupVerifyCommand } = await import("./backup-verify-CDR36X2Y.mjs");
			await backupVerifyCommand(defaultRuntime, {
				archive,
				json: Boolean(opts.json)
			});
		});
	});
	backup.command("restore <archive>").description("Restore a verified backup archive to a fresh staging directory").requiredOption("--target <dir>", "Fresh target directory; non-empty directories are refused").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([["openclaw backup restore ~/Backups/latest.tar.gz --target ./restored-openclaw", "Verify, then extract the whole archive into a fresh staging directory."], ["openclaw backup restore ~/Backups/latest.tar.gz --target ./restored-openclaw --json", "Emit machine-readable restore details and rollback warnings."]])}`).action(async (archive, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupRestoreCommand } = await import("./backup-restore-Dk3iF9uz.mjs");
			await backupRestoreCommand(defaultRuntime, {
				archive,
				target: opts.target,
				json: Boolean(opts.json)
			});
		});
	});
	registerBackupSqliteCommands(backup);
	registerBackupGitCommands(backup);
	registerBackupScheduleCommands(backup);
}
function collectAgent(value, previous) {
	return [...previous, value];
}
function registerBackupScheduleCommands(backup) {
	addGatewayClientOptions(backup.command("enable").description("Provision a Gateway automation for scheduled Git backups").requiredOption("--repository <path>", "Git backup repository directory").option("--every <duration>", "Backup interval", "24h").option("--push", "Push the current branch to origin after each backup", false).option("--exclude-secrets", "Omit credential-bearing database tables", false).option("--include-secrets", "Keep credential-bearing tables in pushed scheduled backups", false).option("--global-only", "Back up only the shared state database", false).option("--agent <id>", "Back up only one agent database").action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupEnableCommand } = await import("./backup-schedule-CUhQhvzc.mjs");
			await backupEnableCommand(defaultRuntime, opts);
		});
	}));
	addGatewayClientOptions(backup.command("disable").description("Remove the scheduled Git backup automation").action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupDisableCommand } = await import("./backup-schedule-CUhQhvzc.mjs");
			await backupDisableCommand(defaultRuntime, opts);
		});
	}));
}
function registerBackupGitCommands(backup) {
	const git = backup.command("git").description("Create and restore deterministic versioned SQLite dumps in Git").action(() => {
		git.outputHelp();
		process.exitCode = 1;
	});
	git.command("init").description("Initialize or adopt an operator-owned Git backup repository").requiredOption("--repository <path>", "Git backup repository directory").option("--remote <url>", "Add the remote as origin").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupGitInitCommand } = await import("./backup-git-CROl6xEc.mjs");
			await backupGitInitCommand(defaultRuntime, opts);
		});
	});
	git.command("create").description("Dump selected OpenClaw databases and commit one Git revision").requiredOption("--repository <path>", "Git backup repository directory").option("--all", "Back up the shared database and every registered agent database", false).option("--global", "Back up the shared OpenClaw state database", false).option("--agent <id>", "Back up an agent database (repeatable)", collectAgent, []).option("--push", "Push the current branch to origin", false).option("--exclude-secrets", "Omit credential-bearing database tables", false).option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupGitCreateCommand } = await import("./backup-git-CROl6xEc.mjs");
			await backupGitCreateCommand(defaultRuntime, {
				repository: opts.repository,
				all: Boolean(opts.all),
				global: Boolean(opts.global),
				agents: opts.agent,
				push: Boolean(opts.push),
				excludeSecrets: Boolean(opts.excludeSecrets),
				json: Boolean(opts.json)
			});
		});
	});
	git.command("log").description("Show Git backup commits").requiredOption("--repository <path>", "Git backup repository directory").option("--limit <n>", "Maximum commits to show", (value) => parseStrictPositiveIntOption(value, "--limit"), 20).option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupGitLogCommand } = await import("./backup-git-CROl6xEc.mjs");
			await backupGitLogCommand(defaultRuntime, opts);
		});
	});
	git.command("verify").description("Restore and verify one database snapshot from a Git ref").requiredOption("--repository <path>", "Git backup repository directory").option("--ref <commit>", "Commit or ref to verify", "HEAD").option("--global", "Verify the shared state database", false).option("--agent <id>", "Verify one agent database").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupGitVerifyCommand } = await import("./backup-git-CROl6xEc.mjs");
			await backupGitVerifyCommand(defaultRuntime, opts);
		});
	});
	git.command("restore").description("Restore one database snapshot from a Git ref to a fresh SQLite file").requiredOption("--repository <path>", "Git backup repository directory").requiredOption("--target <path>", "Fresh target path; existing files and sidecars are refused").option("--ref <commit>", "Commit or ref to restore", "HEAD").option("--global", "Restore the shared state database", false).option("--agent <id>", "Restore one agent database").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupGitRestoreCommand } = await import("./backup-git-CROl6xEc.mjs");
			await backupGitRestoreCommand(defaultRuntime, opts);
		});
	});
}
function registerBackupSqliteCommands(backup) {
	const sqlite = backup.command("sqlite").description("Create, list, verify, and restore SQLite snapshots").action(() => {
		sqlite.outputHelp();
		process.exitCode = 1;
	});
	sqlite.command("create").description("Create a compact, verified snapshot of an OpenClaw SQLite database").option("--global", "Snapshot the shared OpenClaw state database", false).option("--agent <id>", "Snapshot one per-agent OpenClaw database").requiredOption("--repository <path>", "Snapshot repository directory").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([["openclaw backup sqlite create --global --repository ~/Backups/openclaw-sqlite", "Snapshot the shared state database."], ["openclaw backup sqlite create --agent main --repository ~/Backups/openclaw-sqlite", "Snapshot the main agent database."]])}`).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupSqliteCreateCommand } = await import("./backup-sqlite-DKCLkB3-.mjs");
			await backupSqliteCreateCommand(defaultRuntime, {
				global: Boolean(opts.global),
				agent: opts.agent,
				repository: opts.repository,
				json: Boolean(opts.json)
			});
		});
	});
	sqlite.command("list").description("List committed snapshots in a repository").requiredOption("--repository <path>", "Snapshot repository directory").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupSqliteListCommand } = await import("./backup-sqlite-DKCLkB3-.mjs");
			await backupSqliteListCommand(defaultRuntime, {
				repository: opts.repository,
				json: Boolean(opts.json)
			});
		});
	});
	sqlite.command("verify <snapshot>").description("Verify a snapshot manifest, artifact hash, SQLite integrity, and database owner").option("--scratch <path>", "Existing private directory for verification copies").option("--json", "Output JSON", false).action(async (snapshot, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupSqliteVerifyCommand } = await import("./backup-sqlite-DKCLkB3-.mjs");
			await backupSqliteVerifyCommand(defaultRuntime, snapshot, {
				scratch: opts.scratch,
				json: Boolean(opts.json)
			});
		});
	});
	sqlite.command("restore <snapshot>").description("Restore a verified snapshot to a new SQLite database path").requiredOption("--target <path>", "Fresh target path; existing files and sidecars are refused").option("--json", "Output JSON", false).action(async (snapshot, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupSqliteRestoreCommand } = await import("./backup-sqlite-DKCLkB3-.mjs");
			await backupSqliteRestoreCommand(defaultRuntime, snapshot, {
				target: opts.target,
				json: Boolean(opts.json)
			});
		});
	});
}
//#endregion
export { registerBackupCommand };
