import { B as isDoctorMachineOutput } from "./argv-IYTsfFsq.mjs";
import { r as defaultRuntime, t as ExitError } from "./runtime-BC29JSZp.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-f6PhkiZS.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as nodeRuntimeFailure, n as detectCurrentSqliteCapabilities } from "./node-sqlite-DWn4GVXM.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { t as hasExplicitOptions } from "./command-options-BDuSHeWG.mjs";
import { r as formatCliJsonFailure } from "./failure-output-Cct-llrO.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import { n as setCommandJsonMode } from "./json-mode-BYKm3vNF.mjs";
//#region src/cli/program/register.maintenance.ts
const STATE_SQLITE_CONFLICTING_OPTION_NAMES = [
	"workspaceSuggestions",
	"yes",
	"repair",
	"fix",
	"force",
	"nonInteractive",
	"generateGatewayToken",
	"allowExec",
	"deep",
	"lint",
	"postUpgrade",
	"sessionSqlite",
	"sessionSqliteStore",
	"sessionSqliteAgent",
	"sessionSqliteAllAgents",
	"githubIssue",
	"severityMin",
	"all",
	"skip",
	"only"
];
function exitDoctorError(error, json) {
	if (json) defaultRuntime.writeJson(formatCliJsonFailure(error));
	else defaultRuntime.error(formatErrorMessage(error));
	exitCliAfterOutput(defaultRuntime, 2);
}
/** Register maintenance commands that inspect or mutate local OpenClaw state. */
function registerMaintenanceCommands(program, ctx) {
	const doctor = program.command("doctor").description("Health checks + quick fixes for the gateway and channels").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/doctor", "docs.openclaw.ai/cli/doctor")}\n`).option("--no-workspace-suggestions", "Disable workspace memory system suggestions", true).option("--yes", "Accept defaults without prompting", false).option("--repair", "Apply recommended repairs without prompting", false).option("--fix", "Apply recommended repairs (alias for --repair)", false).option("--force", "Allow aggressive repair choices (with --fix, preserves service definitions)", false).option("--non-interactive", "Run without prompts (safe migrations only)", false).option("--generate-gateway-token", "Generate and configure a gateway token", false).option("--allow-exec", "Allow doctor to execute exec SecretRefs while verifying configured secrets", false).option("--deep", "Scan system services for extra gateway installs", false).option("--lint", "Run read-only health checks and report findings", false).option("--post-upgrade", "Emit plugin-compat findings only (machine-readable with --json)", false).option("--session-sqlite <mode>", "Run session SQLite migration mode (dry-run|import|validate|inspect|compact|restore|recover)").option("--state-sqlite <mode>", "Run shared state SQLite maintenance mode (compact)").option("--session-sqlite-store <path>", "With --session-sqlite: inspect one session store").option("--session-sqlite-agent <id>", "With --session-sqlite: inspect one agent").option("--session-sqlite-all-agents", "With --session-sqlite: inspect configured and discovered agent stores", false).option("--github-issue", "With --session-sqlite recover: prepare and optionally create an openclaw/openclaw issue", false).option("--json", "Emit JSON; bare --json runs advisory read-only health checks", false).option("--severity-min <level>", "With --lint: drop findings below this severity (info|warning|error)").option("--all", "With --lint: run all registered checks, including opt-in checks", false).option("--skip <id>", "With --lint: skip a specific check id (repeatable)", (v, prev) => [...prev, v], []).option("--only <id>", "With --lint: run only the specified check id (repeatable)", (v, prev) => [...prev, v], []).action(async (opts, command) => {
		if (typeof opts.stateSqlite === "string" && hasExplicitOptions(command, STATE_SQLITE_CONFLICTING_OPTION_NAMES)) return exitDoctorError("doctor shared-state SQLite maintenance can only be combined with --json.", opts.json === true);
		if (hasSessionSqliteOnlyDoctorOptions(opts)) return exitDoctorError("doctor session SQLite options require --session-sqlite. Use `openclaw doctor --session-sqlite dry-run ...`.", opts.json === true || opts.lint === true && !process.stdout.isTTY);
		const jsonImpliesLint = opts.json === true && opts.lint !== true && opts.postUpgrade !== true && typeof opts.stateSqlite !== "string" && typeof opts.sessionSqlite !== "string";
		const unsupportedNode = !process.versions.bun && Boolean(nodeRuntimeFailure(process.versions.node, await detectCurrentSqliteCapabilities()));
		const lintMode = opts.lint === true || unsupportedNode ? "--lint" : jsonImpliesLint ? "--json" : void 0;
		const mutationOption = opts.repair === true || opts.fix === true || opts.force === true ? "--repair, --fix, or --force" : opts.yes === true ? "--yes" : opts.generateGatewayToken === true ? "--generate-gateway-token" : typeof opts.sessionSqlite === "string" ? `--session-sqlite ${opts.sessionSqlite}` : void 0;
		if (lintMode && mutationOption) return exitDoctorError(`doctor ${lintMode} runs read-only lint checks and cannot be combined with ${mutationOption}.`, opts.json === true || !process.stdout.isTTY);
		const stateSqlite = parseDoctorStateSqliteMode(opts.stateSqlite, opts.json === true);
		const sessionSqlite = parseDoctorSessionSqliteMode(opts.sessionSqlite, opts.json === true);
		if (opts.githubIssue === true && sessionSqlite !== "recover") return exitDoctorError("--github-issue requires --session-sqlite recover.", opts.json === true);
		if ([
			opts.lint === true,
			opts.postUpgrade === true,
			stateSqlite !== void 0,
			sessionSqlite !== void 0,
			opts.repair === true || opts.fix === true || opts.force === true || opts.generateGatewayToken === true
		].filter(Boolean).length > 1) return exitDoctorError("doctor operations are mutually exclusive: choose one of --lint, --fix/--repair, --post-upgrade, --state-sqlite, or --session-sqlite.", opts.json === true || opts.lint === true && !process.stdout.isTTY);
		if (opts.lint !== true && hasLintOnlyDoctorOptions(opts)) return exitDoctorError("doctor lint options require --lint. Use `openclaw doctor --lint ...`.", opts.json === true);
		try {
			if (lintMode) {
				const { runDoctorLintCli } = await import("./doctor-lint-BxuZz8BI.mjs");
				const exitCode = await runDoctorLintCli(defaultRuntime, {
					json: Boolean(opts.json),
					severityMin: typeof opts.severityMin === "string" ? opts.severityMin : void 0,
					includeAllChecks: Boolean(opts.all),
					skipIds: Array.isArray(opts.skip) ? opts.skip : [],
					onlyIds: Array.isArray(opts.only) ? opts.only : [],
					allowExec: Boolean(opts.allowExec),
					deep: Boolean(opts.deep)
				});
				exitCliAfterOutput(defaultRuntime, jsonImpliesLint ? 0 : exitCode);
			}
			return await runCommandWithRuntime(defaultRuntime, async () => {
				const { doctorCommand } = await import("./doctor-CWg1-CE5.mjs");
				await doctorCommand(defaultRuntime, {
					workspaceSuggestions: opts.workspaceSuggestions,
					yes: Boolean(opts.yes),
					repair: Boolean(opts.repair) || Boolean(opts.fix),
					force: Boolean(opts.force),
					nonInteractive: Boolean(opts.nonInteractive),
					generateGatewayToken: Boolean(opts.generateGatewayToken),
					allowExec: Boolean(opts.allowExec),
					deep: Boolean(opts.deep),
					postUpgrade: Boolean(opts.postUpgrade),
					...stateSqlite ? { stateSqlite } : {},
					...sessionSqlite ? { sessionSqlite } : {},
					...typeof opts.sessionSqliteStore === "string" ? { sessionSqliteStore: opts.sessionSqliteStore } : {},
					...typeof opts.sessionSqliteAgent === "string" ? { sessionSqliteAgent: opts.sessionSqliteAgent } : {},
					sessionSqliteAllAgents: Boolean(opts.sessionSqliteAllAgents),
					sessionSqliteGithubIssue: Boolean(opts.githubIssue),
					json: Boolean(opts.json)
				}, ctx?.doctorDatabasePreflight);
				exitCliAfterOutput(defaultRuntime, 0);
			});
		} catch (error) {
			if (error instanceof ExitError || !lintMode && !opts.json) throw error;
			if (lintMode && (opts.json === true || !process.stdout.isTTY)) {
				const { formatDoctorLintFailure } = await import("./doctor-lint-output-CsHy0dnM.mjs");
				defaultRuntime.writeJson(formatDoctorLintFailure(error));
				exitCliAfterOutput(defaultRuntime, 2);
			}
			exitDoctorError(error, opts.json === true || !process.stdout.isTTY);
		}
	});
	setCommandJsonMode(doctor, "output", isDoctorMachineOutput);
	program.command("triage").description("Collect sanitized diagnostics and open a local coding agent for repair").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/triage", "docs.openclaw.ai/cli/triage")}\n`).option("--json", "Output sanitized handoff paths, finding counts, and commands as JSON", false).option("--no-export", "Skip the sanitized diagnostics archive").option("--agent <name>", "Select a coding agent (claude|codex|cursor|grok|kimi|muse|opencode|pi|qwen)").option("--run", "Run one embedded agent turn after verifying model inference", false).option("--non-interactive", "Prepare diagnostics without prompting or starting an agent", false).option("--update-result <path>", "Include update-failure diagnostics from this JSON artifact").action(async (opts) => {
		if (opts.json === true && opts.run === true) return exitDoctorError("triage --json cannot be combined with --run.", true);
		if (opts.nonInteractive === true && opts.run === true) return exitDoctorError("triage --non-interactive cannot be combined with --run.", false);
		const agent = opts.agent;
		if (opts.run === true && agent !== void 0) return exitDoctorError("triage --run cannot be combined with --agent.", opts.json === true);
		if (agent !== void 0 && agent !== "claude" && agent !== "codex" && agent !== "cursor" && agent !== "grok" && agent !== "kimi" && agent !== "muse" && agent !== "opencode" && agent !== "pi" && agent !== "qwen") return exitDoctorError("Invalid --agent. Use claude, codex, cursor, grok, kimi, muse, opencode, pi, or qwen.", opts.json === true);
		return await runCommandWithRuntime(defaultRuntime, async () => {
			const { triageCommand } = await import("./triage-kb06Lo9W.mjs");
			await triageCommand(defaultRuntime, {
				json: opts.json === true,
				noExport: opts.export === false,
				run: opts.run === true,
				...opts.nonInteractive === true ? { nonInteractive: true } : {},
				...typeof opts.updateResult === "string" ? { updateResult: opts.updateResult } : {},
				...agent ? { agent } : {}
			});
		}, opts.json ? (err) => exitDoctorError(formatErrorMessage(err), true) : void 0);
	});
	program.command("dashboard").description("Open the Control UI with your current token").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/dashboard", "docs.openclaw.ai/cli/dashboard")}\n`).option("--no-open", "Print URL but do not launch a browser").option("--json", "Output dashboard connection details as JSON", false).option("--yes", "Start/install the gateway without prompting when needed", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { dashboardCommand } = await import("./dashboard-Dtw9AYs7.mjs");
			await dashboardCommand(defaultRuntime, {
				json: Boolean(opts.json),
				noOpen: opts.open === false,
				yes: Boolean(opts.yes)
			});
		});
	});
	program.command("reset").description("Reset local config/state (keeps the CLI installed)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/reset", "docs.openclaw.ai/cli/reset")}\n`).option("--scope <scope>", "config|config+creds+sessions|full (default: interactive prompt)").option("--yes", "Skip confirmation prompts", false).option("--non-interactive", "Disable prompts (requires --scope + --yes)", false).option("--dry-run", "Print actions without removing files", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { resetCommand } = await import("./reset-vMPQAbeK.mjs");
			await resetCommand(defaultRuntime, {
				scope: opts.scope,
				yes: Boolean(opts.yes),
				nonInteractive: Boolean(opts.nonInteractive),
				dryRun: Boolean(opts.dryRun)
			});
		});
	});
	program.command("uninstall").description("Uninstall the gateway service + local data").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/uninstall", "docs.openclaw.ai/cli/uninstall")}\n`).option("--service", "Remove the gateway service", false).option("--state", "Remove state + config", false).option("--workspace", "Remove workspace dirs", false).option("--app", "Remove the macOS app", false).option("--all", "Remove service + state + workspace + app", false).option("--yes", "Skip confirmation prompts", false).option("--non-interactive", "Disable prompts (requires --yes)", false).option("--dry-run", "Print actions without removing files", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { uninstallCommand } = await import("./uninstall-D475LgYW.mjs");
			await uninstallCommand(defaultRuntime, {
				service: Boolean(opts.service),
				state: Boolean(opts.state),
				workspace: Boolean(opts.workspace),
				app: Boolean(opts.app),
				all: Boolean(opts.all),
				yes: Boolean(opts.yes),
				nonInteractive: Boolean(opts.nonInteractive),
				dryRun: Boolean(opts.dryRun)
			});
		});
	});
}
function hasLintOnlyDoctorOptions(opts) {
	return typeof opts.severityMin === "string" || opts.all === true || Array.isArray(opts.skip) && opts.skip.length > 0 || Array.isArray(opts.only) && opts.only.length > 0;
}
function hasSessionSqliteOnlyDoctorOptions(opts) {
	return typeof opts.sessionSqlite !== "string" && (typeof opts.sessionSqliteAgent === "string" || opts.githubIssue === true || opts.sessionSqliteAllAgents === true || typeof opts.sessionSqliteStore === "string");
}
function parseDoctorStateSqliteMode(value, json) {
	if (value === void 0 || value === "compact") return value;
	return exitDoctorError("Invalid --state-sqlite mode. Use compact.", json);
}
function parseDoctorSessionSqliteMode(value, json) {
	if (value === void 0 || value === "dry-run" || value === "import" || value === "validate" || value === "inspect" || value === "compact" || value === "restore" || value === "recover") return value;
	return exitDoctorError("Invalid --session-sqlite mode. Use dry-run, import, validate, inspect, compact, restore, or recover.", json);
}
//#endregion
export { registerMaintenanceCommands };
