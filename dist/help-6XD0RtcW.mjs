import { G as getCommanderErrorCommandPath, R as getCoreCliCommandsWithSubcommands, W as getCommanderErrorCommandNames, _ as getSubCliCommandsWithSubcommands, d as isRootVersionInvocation } from "./argv-IYTsfFsq.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { t as formatConsoleDiagnosticBlock } from "./json-console-line-BEWeG-Rv.mjs";
import { i as tryParseLogLevel, t as ALLOWED_LOG_LEVELS } from "./levels-qpAN12Fm.mjs";
import { n as resolveCommitHash } from "./git-commit-BowlM7El.mjs";
import { n as isRich, r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import { n as formatCliBannerLine, r as hasEmittedCliBanner } from "./banner-Bb5d-DSK.mjs";
import { r as formatCliParseErrorOutput } from "./error-output-CeVjK1MQ.mjs";
import { InvalidArgumentError } from "commander";
//#region src/cli/log-level-option.ts
const CLI_LOG_LEVEL_VALUES = ALLOWED_LOG_LEVELS.join("|");
function parseCliLogLevelOption(value) {
	const parsed = tryParseLogLevel(value);
	if (!parsed) throw new InvalidArgumentError(`Invalid --log-level (use ${CLI_LOG_LEVEL_VALUES})`);
	return parsed;
}
//#endregion
//#region src/cli/program/help.ts
const CLI_NAME_PATTERN = escapeRegExp(CLI_NAME);
const ROOT_COMMANDS_WITH_SUBCOMMANDS = /* @__PURE__ */ new Set([...getCoreCliCommandsWithSubcommands(), ...getSubCliCommandsWithSubcommands()]);
const ROOT_COMMANDS_HINT = "Hint: commands suffixed with * have subcommands. Run <command> --help for details.";
const EXAMPLES = [
	["openclaw onboard", "Run guided setup for a local Gateway, workspace, auth, and channels."],
	["openclaw setup", "Create the baseline config, workspace, and session folders."],
	["openclaw configure", "Change models, Gateway, channels, plugins, skills, and health checks."],
	["openclaw status", "Check Gateway, channel, model, and recent-session status."],
	["openclaw doctor --fix", "Repair common config, service, plugin, and channel problems."],
	["openclaw channels add", "Add or update a chat channel account with guided prompts."],
	["openclaw channels status", "See connected messaging accounts and login state."],
	["openclaw --dev gateway", "Run a dev Gateway (isolated state/config) on ws://127.0.0.1:19001."],
	["openclaw gateway run --force", "Start the Gateway and replace anything bound to its port."],
	["openclaw models status", "Show model/provider auth health before running agents."],
	["openclaw plugins list", "Inspect enabled, disabled, and installed plugins."],
	["openclaw agent --to +15555550123 --message \"Run summary\" --deliver", "Run one agent turn through the Gateway and optionally deliver the reply."],
	["openclaw message send --channel telegram --target @mychat --message \"Hi\"", "Send via your Telegram bot."]
];
function formatProgramHelpOutput(str) {
	let output = str;
	if (new RegExp(`^Usage:\\s+${CLI_NAME_PATTERN}\\s+\\[options\\]\\s+\\[command\\]\\s*$`, "m").test(output) && /^Commands:/m.test(output)) output = output.replace(/^Commands:/m, `Commands:\n  ${theme.muted(ROOT_COMMANDS_HINT)}`);
	return output.replace(/^Usage:/gm, theme.heading("Usage:")).replace(/^Options:/gm, theme.heading("Options:")).replace(/^Commands:/gm, theme.heading("Commands:"));
}
function configureProgramHelp(program, ctx, options) {
	const commandsWithSubcommands = /* @__PURE__ */ new Set([...ROOT_COMMANDS_WITH_SUBCOMMANDS, ...options?.commandsWithSubcommands ?? []]);
	program.name(CLI_NAME).description("").version(ctx.programVersion).option("--container <name>", "Run the CLI inside a running Podman/Docker container named <name> (default: env OPENCLAW_CONTAINER)").option("--dev", "Dev profile: isolate state under ~/.openclaw-dev, default gateway port 19001, and shift derived ports (browser/canvas)").option("--profile <name>", "Use a named profile (isolates OPENCLAW_STATE_DIR/OPENCLAW_CONFIG_PATH under ~/.openclaw-<name>)").option("--log-level <level>", `Global log level override for file + console (${CLI_LOG_LEVEL_VALUES})`, parseCliLogLevelOption);
	program.option("--no-color", "Disable ANSI colors", false);
	program.helpOption("-h, --help", "Display help for command");
	program.helpCommand("help [command]", "Display help for command");
	program.configureHelp({
		sortSubcommands: true,
		sortOptions: true,
		optionTerm: (option) => theme.option(option.flags),
		subcommandTerm: (cmd) => {
			const hasSubcommands = cmd.parent === program && commandsWithSubcommands.has(cmd.name());
			return theme.command(hasSubcommands ? `${cmd.name()} *` : cmd.name());
		}
	});
	program.configureOutput({
		writeOut: (str) => {
			process.stdout.write(formatProgramHelpOutput(str));
		},
		writeErr: (str) => {
			const message = formatProgramHelpOutput(str);
			process.stderr.write(formatConsoleDiagnosticBlock({
				level: "error",
				message
			}));
		},
		outputError: (str, write) => {
			write(formatCliParseErrorOutput(str, {
				argv: process.argv,
				commandPath: getCommanderErrorCommandPath(program),
				commandNames: getCommanderErrorCommandNames(program)
			}));
		}
	});
	if (isRootVersionInvocation(process.argv)) {
		const commit = resolveCommitHash({ moduleUrl: import.meta.url });
		console.log(commit ? `OpenClaw ${ctx.programVersion} (${commit})` : `OpenClaw ${ctx.programVersion}`);
		process.exit(0);
	}
	program.addHelpText("beforeAll", () => {
		if (hasEmittedCliBanner() || process.env.OPENCLAW_SUPPRESS_HELP_BANNER === "1") return "";
		const rich = isRich();
		return `\n${formatCliBannerLine(ctx.programVersion, {
			richTty: rich,
			mode: "default"
		})}\n`;
	});
	const fmtExamples = EXAMPLES.map(([cmd, desc]) => `  ${theme.command(cmd)}\n    ${theme.muted(desc)}`).join("\n");
	program.addHelpText("afterAll", ({ command }) => {
		if (command !== program) return "";
		const docs = formatDocsLink("/cli", "docs.openclaw.ai/cli");
		return `\n${theme.heading("Examples:")}\n${fmtExamples}\n\n${theme.muted("Docs:")} ${docs}\n`;
	});
}
//#endregion
export { formatProgramHelpOutput as n, configureProgramHelp as t };
