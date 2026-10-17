import { s as normalizeOptionalTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-ClVfZRCr.mjs";
import { n as formatHelpExamples } from "./help-format-xds_bDSp.mjs";
import { t as collectOption } from "./helpers-Bbrcmhji.mjs";
import { i as migratePlanCommand, n as migrateDefaultCommand, r as migrateListCommand, t as migrateApplyCommand } from "./migrate-DvXEhf4m.mjs";
//#region src/cli/program/register.migrate.ts
function readMigrationOption(command, name, value) {
	return inheritOptionFromParent(command, name) ?? value;
}
function addMigrationSourceOptions(command) {
	return command.option("--from <path>", "Source directory to migrate from").option("--agent <id>", "Target agent (default: configured default agent)").option("--include-secrets", "Import supported credentials and secrets").option("--no-auth-credentials", "Skip auth credential migration").option("--overwrite", "Overwrite conflicting target files after item-level backups", false);
}
function addMigrationSelectionOptions(command) {
	return command.option("--skill <name>", "Select one skill to migrate by name or item id; repeat for multiple skills", collectOption).option("--plugin <name>", "Select one Codex plugin to migrate by name or item id; repeat for multiple plugins", collectOption).option("--item <id>", "Select one exact migration item id; repeat for multiple items", collectOption);
}
function addVerifyPluginAppsOption(command) {
	return command.option("--verify-plugin-apps", "Codex only: verify source plugin app accessibility with app/installed before planning native plugin activation", false);
}
function addMigrationOptions(command) {
	addMigrationSourceOptions(command).option("--json", "Output JSON", false);
	addMigrationSelectionOptions(command);
	return addVerifyPluginAppsOption(command);
}
function readSharedMigrationOptions(opts, command) {
	const agent = readMigrationOption(command, "agent", opts.agent);
	return {
		source: readMigrationOption(command, "from", opts.from),
		targetAgentId: typeof agent === "string" ? agent : void 0,
		includeSecrets: readMigrationOption(command, "includeSecrets", opts.includeSecrets) === true ? true : void 0,
		authCredentials: readMigrationOption(command, "authCredentials", opts.authCredentials),
		overwrite: Boolean(readMigrationOption(command, "overwrite", opts.overwrite)),
		skills: normalizeOptionalTrimmedStringList(readMigrationOption(command, "skill", opts.skill)),
		plugins: normalizeOptionalTrimmedStringList(readMigrationOption(command, "plugin", opts.plugin)),
		itemIds: normalizeOptionalTrimmedStringList(readMigrationOption(command, "item", opts.item)),
		verifyPluginApps: readMigrationOption(command, "verifyPluginApps", opts.verifyPluginApps) === true,
		json: Boolean(readMigrationOption(command, "json", opts.json))
	};
}
function rejectUnsupportedApplyDryRun(command) {
	if (inheritOptionFromParent(command, "dryRun") === true) throw new Error("--dry-run is not supported for `openclaw migrate apply`. Run `openclaw migrate plan <provider>` or `openclaw migrate <provider> --dry-run` instead.");
}
function registerMigrateCommand(program) {
	const migrate = addMigrationSourceOptions(program.command("migrate").description("Import state from another agent system").argument("[provider]", "Migration provider id, for example hermes")).option("--dry-run", "Preview only; do not apply changes", false).option("--yes", "Apply without prompting after preview", false);
	addMigrationSelectionOptions(migrate).option("--backup-output <path>", "Pre-migration backup archive path or directory").option("--no-backup", "Skip the pre-migration OpenClaw backup").option("--force", "Allow dangerous options such as --no-backup", false).option("--json", "Output JSON", false);
	addVerifyPluginAppsOption(migrate).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw migrate list", "Show available migration providers."],
		["openclaw migrate hermes", "Preview Hermes migration, then prompt before applying."],
		["openclaw migrate hermes --dry-run", "Preview Hermes migration only."],
		["openclaw migrate apply hermes --yes", "Apply Hermes migration non-interactively after writing a verified backup."],
		["openclaw migrate hermes --no-auth-credentials", "Preview and apply Hermes migration while skipping auth credential import."]
	])}`).action(async (provider, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await migrateDefaultCommand(defaultRuntime, {
				provider,
				...readSharedMigrationOptions(opts),
				dryRun: Boolean(opts.dryRun),
				yes: Boolean(opts.yes),
				backupOutput: opts.backupOutput,
				noBackup: opts.backup === false,
				force: Boolean(opts.force)
			});
		});
	});
	migrate.command("list").description("List migration providers").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await migrateListCommand(defaultRuntime, { json: Boolean(readMigrationOption(command, "json", opts.json)) });
		});
	});
	addMigrationOptions(migrate.command("plan <provider>").description("Preview a migration without changing OpenClaw state")).action(async (provider, opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await migratePlanCommand(defaultRuntime, {
				provider,
				...readSharedMigrationOptions(opts, command)
			});
		});
	});
	addMigrationOptions(migrate.command("apply <provider>").description("Apply a migration after a verified backup")).option("--yes", "Apply without prompting", false).option("--backup-output <path>", "Pre-migration backup archive path or directory").option("--no-backup", "Skip the pre-migration OpenClaw backup").option("--force", "Allow dangerous options such as --no-backup", false).action(async (provider, opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			rejectUnsupportedApplyDryRun(command);
			await migrateApplyCommand(defaultRuntime, {
				provider,
				...readSharedMigrationOptions(opts, command),
				yes: Boolean(readMigrationOption(command, "yes", opts.yes)),
				backupOutput: readMigrationOption(command, "backupOutput", opts.backupOutput),
				noBackup: readMigrationOption(command, "backup", opts.backup) === false,
				force: Boolean(readMigrationOption(command, "force", opts.force))
			});
		});
	});
}
//#endregion
export { registerMigrateCommand };
