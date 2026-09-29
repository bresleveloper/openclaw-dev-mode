import { o as UPDATE_OPTION_SPECS } from "./config-output-mode-DrhJ7F5x.mjs";
import { r as defaultRuntime, t as ExitError } from "./runtime-BC29JSZp.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { r as isJsonOutputModeActive } from "./json-output-mode-DRPBa2uN.mjs";
import "./update-post-core-context-B2x24New.mjs";
import { t as formatHelpExamples } from "./help-format-Ctl5AOqy.mjs";
import { t as getProgramContext } from "./program-context-VEhF8JxS.mjs";
//#region src/cli/update-cli.ts
function inheritedUpdateJson(command) {
	return Boolean(inheritOptionFromParent(command, "json"));
}
function handleUpdateCommandError(error) {
	if (error instanceof ExitError || isJsonOutputModeActive(process.argv)) throw error;
	defaultRuntime.error(formatErrorMessage(error));
	defaultRuntime.exit(1);
}
function inheritedUpdateTimeout(opts, command) {
	const timeout = opts.timeout;
	if (timeout !== void 0) return timeout;
	return inheritOptionFromParent(command, "timeout");
}
function requiredUpdateLeafString(opts, key) {
	const value = opts[key];
	if (typeof value !== "string") throw new Error(`Missing required update option --${key.replaceAll(/[A-Z]/g, "-$&").toLowerCase()}`);
	return value;
}
function createUpdateLeafAction(action, options = {}) {
	return async (opts, command) => {
		try {
			if (inheritOptionFromParent(command, "reapplyLocalOverrides")) throw new Error(`--reapply-local-overrides is not supported for openclaw update ${command.name()}. Use it with openclaw update.`);
			if (!options.supportsDryRun && inheritOptionFromParent(command, "dryRun")) throw new Error(`--dry-run is not supported for \`openclaw update ${command.name()}\`. Run \`openclaw update --dry-run\` instead.`);
			await action(opts, command);
		} catch (err) {
			handleUpdateCommandError(err);
		}
	};
}
function registerUpdateFinalizationCommand(update, name, hidden) {
	update.command(name, { hidden }).description("Reconcile abandoned updates or repair post-update doctor and plugin convergence").option("--json", "Output result as JSON", false).option("--channel <stable|extended-stable|beta|dev>", "Persist update channel before repair").option("--timeout <seconds>", "Override per-phase repair deadlines in seconds").option("--yes", "Skip confirmation prompts (non-interactive)", false).option("--accept-capabilities", "Accept widened plugin capabilities", false).option("--no-restart", "Skip update activation; Doctor may restore a service it stops").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw update repair", "Reconcile abandoned runs or repair post-update state."],
		["openclaw update repair --accept-capabilities", "Accept reviewed plugin capability changes during repair."],
		["openclaw update repair --channel beta", "Repair against the beta update channel."],
		["openclaw update repair --json", "JSON output for automation."]
	])}\n\n${theme.heading("Notes:")}\n${theme.muted("- Reconciles abandoned runs when the Gateway is healthy; otherwise repairs post-update state")}\n${theme.muted("- Runs Doctor repair and plugin convergence; repair restores only a service it stops")}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/update", "docs.openclaw.ai/cli/update")}`).action(createUpdateLeafAction(async (opts, actionCommand) => {
		await (hidden ? (await import("./update-command-finalize-B9iNq9Km.mjs")).updateFinalizeCommand : (await import("./update-repair-command-ByWiSGj7.mjs")).updateRepairCommand)({
			json: Boolean(opts.json) || inheritedUpdateJson(actionCommand),
			channel: opts.channel ?? inheritOptionFromParent(actionCommand, "channel"),
			timeout: inheritedUpdateTimeout(opts, actionCommand),
			yes: Boolean(opts.yes) || Boolean(inheritOptionFromParent(actionCommand, "yes")),
			acceptCapabilities: Boolean(opts.acceptCapabilities) || Boolean(inheritOptionFromParent(actionCommand, "acceptCapabilities")),
			restart: false,
			deferCompletionCache: hidden && process.env["OPENCLAW_UPDATE_POST_CORE"]?.trim() === "1"
		});
	}));
}
/** Attach the update command group to the root CLI. */
function registerUpdateCli(program) {
	program.enablePositionalOptions();
	const update = program.command("update").description("Update OpenClaw and inspect update channel status");
	for (const [flags, description, defaultValue] of UPDATE_OPTION_SPECS) update.option(flags, description, defaultValue);
	update.addHelpText("after", () => {
		const fmtExamples = [
			["openclaw update", "Update a source checkout (git)"],
			["openclaw update --channel extended-stable", "Switch to the monthly supported npm channel"],
			["openclaw update --channel beta", "Switch to beta channel (git + npm)"],
			["openclaw update --channel dev", "Switch to dev channel (git + npm)"],
			["openclaw update --tag beta", "One-off update to a dist-tag or version"],
			["openclaw update --dry-run", "Preview actions without changing anything"],
			["openclaw update --no-restart", "Update without restarting the service"],
			["openclaw update --json", "Output result as JSON"],
			["openclaw update --yes", "Non-interactive (accept downgrade prompts)"],
			["openclaw update --accept-capabilities", "Accept reviewed plugin capability changes"],
			["openclaw update repair", "Repair stranded post-update plugin state"],
			["openclaw update wizard", "Interactive update wizard"],
			["openclaw --update", "Shorthand for openclaw update"]
		].map(([cmd, desc]) => `  ${theme.command(cmd)} ${theme.muted(`# ${desc}`)}`).join("\n");
		return `
${theme.heading("What this does:")}
  - Git checkouts: fetches, rebases, installs deps, builds, and runs doctor
  - npm installs: updates via detected package manager

${theme.heading("Switch channels:")}
  - Use --channel stable|extended-stable|beta|dev to persist the update channel in config
  - Run openclaw update status to see the active channel and source
  - Use --tag <dist-tag|version|spec> for a one-off package update without persisting
  - Use --channel dev for the moving GitHub main checkout; package installs reject --tag main

${theme.heading("Non-interactive:")}
  - Use --yes to accept downgrade prompts
  - Use --accept-capabilities to accept each plugin's reviewed capability changes
  - Combine with --channel/--tag/--no-restart/--json/--timeout as needed
  - Use --dry-run to preview actions without writing config/installing/restarting

${theme.heading("Examples:")}
${fmtExamples}

${theme.heading("Notes:")}
  - Switch channels with --channel stable|extended-stable|beta|dev
  - For global installs: auto-updates via detected package manager when possible (see docs/install/updating.md)
  - Downgrades require confirmation (can break configuration)
  - Skips update if the working directory has uncommitted changes

${theme.muted("Docs:")} ${formatDocsLink("/cli/update", "docs.openclaw.ai/cli/update")}`;
	}).action(async (opts) => {
		try {
			const { updateCommand } = await import("./update-command-Bj4tqy4V.mjs");
			await updateCommand({
				runtimeRecoveryEnv: getProgramContext(program)?.runtimeRecoveryEnv,
				json: Boolean(opts.json),
				restart: Boolean(opts.restart),
				reapplyLocalOverrides: Boolean(opts.reapplyLocalOverrides),
				dryRun: Boolean(opts.dryRun),
				channel: opts.channel,
				tag: opts.tag,
				timeout: opts.timeout,
				yes: Boolean(opts.yes),
				acceptCapabilities: Boolean(opts.acceptCapabilities)
			});
		} catch (err) {
			handleUpdateCommandError(err);
		}
	});
	update.command("cleanup").description("Retire verified update recovery originals after acknowledging rollback loss").option("--dry-run", "Inspect recovery metadata without writes", false).option("--json", "Output one JSON result; never implies consent", false).option("--yes", "Acknowledge permanent loss of the selected rollback originals", false).action(createUpdateLeafAction(async (opts, command) => {
		for (const key of [
			"channel",
			"tag",
			"timeout",
			"restart",
			"acceptCapabilities"
		]) if (update.getOptionValueSource(key) && update.getOptionValueSource(key) !== "default") throw new Error(`--${key === "restart" ? "no-restart" : key === "acceptCapabilities" ? "accept-capabilities" : key} is not supported for openclaw update cleanup.`);
		const { updateCleanupCommand } = await import("./cleanup-P7kz49ZD.mjs");
		await updateCleanupCommand({
			dryRun: Boolean(opts.dryRun) || Boolean(inheritOptionFromParent(command, "dryRun")),
			json: Boolean(opts.json) || inheritedUpdateJson(command),
			yes: Boolean(opts.yes) || Boolean(inheritOptionFromParent(command, "yes"))
		});
	}, { supportsDryRun: true }));
	registerUpdateFinalizationCommand(update, "repair", false);
	registerUpdateFinalizationCommand(update, "finalize", true);
	update.command("migration-plan", { hidden: true }).description("Plan Doctor-owned state migrations against an isolated snapshot").requiredOption("--snapshot-home <path>", "Copied environment home").requiredOption("--snapshot-config <path>", "Copied OpenClaw config").requiredOption("--snapshot-state <path>", "Copied OpenClaw state directory").option("--dry-run", "Accepted for parity; migration planning is always read-only", true).option("--json", "Output result as JSON", true).action(createUpdateLeafAction(async (opts) => {
		const { updateMigrationPlanCommand } = await import("./update-command-migration-plan-B6UO9PuN.mjs");
		await updateMigrationPlanCommand({
			snapshotConfig: requiredUpdateLeafString(opts, "snapshotConfig"),
			snapshotHome: requiredUpdateLeafString(opts, "snapshotHome"),
			snapshotState: requiredUpdateLeafString(opts, "snapshotState")
		});
	}, { supportsDryRun: true }));
	update.command("wizard").description("Interactive update wizard").option("--accept-capabilities", "Accept widened plugin capabilities", false).option("--timeout <seconds>", "Timeout for each update step in seconds (default: 1800)").addHelpText("after", `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/update", "docs.openclaw.ai/cli/update")}\n`).action(createUpdateLeafAction(async (opts, command) => {
		const { updateWizardCommand } = await import("./wizard-DSYEXm3a.mjs");
		await updateWizardCommand({
			runtimeRecoveryEnv: getProgramContext(program)?.runtimeRecoveryEnv,
			timeout: inheritedUpdateTimeout(opts, command),
			acceptCapabilities: Boolean(opts.acceptCapabilities) || Boolean(inheritOptionFromParent(command, "acceptCapabilities"))
		});
	}));
	update.command("status").description("Show update channel and version status").option("--json", "Output result as JSON", false).option("--timeout <seconds>", "Timeout for update checks in seconds (default: 3)").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw update status", "Show channel + version status."],
		["openclaw update status --json", "JSON output."],
		["openclaw update status --timeout 10", "Custom timeout."]
	])}\n\n${theme.heading("Notes:")}\n${theme.muted("- Shows current update channel (stable/extended-stable/beta/dev) and source")}\n${theme.muted("- Includes git tag/branch/SHA for source checkouts")}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/update", "docs.openclaw.ai/cli/update")}`).action(createUpdateLeafAction(async (opts, command) => {
		const { updateStatusCommand } = await import("./status-CJHtHeCU.mjs");
		await updateStatusCommand({
			json: Boolean(opts.json) || inheritedUpdateJson(command),
			timeout: inheritedUpdateTimeout(opts, command)
		});
	}));
}
//#endregion
export { registerUpdateCli };
