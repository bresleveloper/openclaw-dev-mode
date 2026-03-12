import { B as hasRootVersionAlias, L as getVerboseFlag, M as getCommandPathWithRootOptions, O as tryParseLogLevel, R as hasFlag, T as ALLOWED_LOG_LEVELS, c as setVerbose, m as theme, p as isRich, r as isDevMode, z as hasHelpOrVersion } from "./globals-DtwqVhkV.js";
import "./paths-BfR2LXbA.js";
import { p as defaultRuntime } from "./subsystem-CkDRqDzV.js";
import "./boolean-DTgd5CzD.js";
import { i as isTruthyEnvValue } from "./entry.js";
import "./auth-profiles-CIqoN6FN.js";
import { n as replaceCliName, r as resolveCliName } from "./command-format-BTnLVWI8.js";
import "./agent-scope-BAb0j1gt.js";
import { c as escapeRegExp } from "./utils-DMInpDZe.js";
import "./boundary-file-read-DM07oBuv.js";
import "./logger-GQFppKMT.js";
import "./exec-DDBrWr4H.js";
import "./github-copilot-token-B_S63apr.js";
import "./env-overrides-BD1bOZrq.js";
import { t as VERSION } from "./version-BvA7WhZA.js";
import "./runtime-overrides-CGfXKBb_.js";
import "./registry-DznR2BDN.js";
import "./skills-DZCrHNdp.js";
import "./frontmatter-D1I3WE8J.js";
import "./plugins-CjLMQbHJ.js";
import "./windows-spawn-D2jCT_tt.js";
import "./redact-DnTfDLlu.js";
import "./path-alias-guards-BAfWVs88.js";
import "./errors-D6OHuY6d.js";
import "./send-BsspxCzG.js";
import "./send-zGJnEJ2h.js";
import "./compact-D7FmBOIi.js";
import "./paths-B52CESY4.js";
import "./chat-envelope-DZwp6OvC.js";
import "./models-config-CgYIAjpL.js";
import "./tokens-DlJSUh2B.js";
import "./with-timeout-BkPFXDKx.js";
import "./deliver-BBVbYNZl.js";
import "./diagnostic-BgzUMGxw.js";
import "./send-C30ZEgKY.js";
import "./pi-model-discovery-N8VeGFSt.js";
import "./exec-approvals-allowlist-BFQyzfY0.js";
import "./exec-safe-bin-runtime-policy-JIvK4NYP.js";
import "./model-catalog-ABQggSsr.js";
import "./fetch-BNo-TKiW.js";
import "./audio-transcription-runner-aawySreQ.js";
import "./fetch-guard-DfcVqBbv.js";
import "./image-D8LO-CO5.js";
import "./tool-display-B4YdJGcN.js";
import "./api-key-rotation-DmIVW9sh.js";
import "./proxy-fetch-wuVrlEmU.js";
import "./ir-D7O7NHen.js";
import "./render-DIsvUmKZ.js";
import "./target-errors-Cd8b6anp.js";
import "./commands-CwtsDdaQ.js";
import "./commands-registry-B6Tu3P-e.js";
import "./session-cost-usage-BqCSF78X.js";
import "./session-utils-Byo4TGCQ.js";
import { n as resolveCommitHash } from "./git-commit-BPpI_qkj.js";
import "./sqlite-Bqsue8ZW.js";
import "./call-B28h9L2b.js";
import "./pi-tools.policy-BakY2muG.js";
import "./fetch-BhUTuYqs.js";
import "./pairing-store-afyqjg4D.js";
import "./exec-approvals-BZxwpxPb.js";
import "./nodes-screen-CBcHhTJX.js";
import "./restart-DQH7Yikr.js";
import "./system-run-command-CPtKcdih.js";
import "./skill-commands-3lKJ1bA0.js";
import "./workspace-dirs-BYV9O2SH.js";
import "./pairing-token-BzOmgvEq.js";
import "./channel-activity-5EA8FJ8k.js";
import "./tables-gTnrqBY-.js";
import "./runtime-web-tools-BLhk2bwq.js";
import "./runtime-BXiwDtum.js";
import "./stagger-B-xCbBoK.js";
import "./channel-selection-iBIRb_3m.js";
import "./plugin-auto-enable-CIwNgqs-.js";
import "./send-CoQdqhec.js";
import "./outbound-attachment-B7a-XtfD.js";
import "./delivery-queue-DoXxnK-F.js";
import "./send-BB9-a7dX.js";
import "./fetch-BXEZfVK2.js";
import "./timeouts-Cku3qerp.js";
import "./command-secret-targets-D-ZwQMW3.js";
import "./connection-auth-BW2kdKuY.js";
import "./onboard-helpers-Dxc5qfRZ.js";
import "./prompt-style-DjT2g1_v.js";
import "./pairing-labels-DP2OEfMM.js";
import "./search-manager-1h3uBAK6.js";
import "./manager-BrGg7Zo_.js";
import "./memory-cli-00BaWePz.js";
import { t as formatDocsLink } from "./links-y9BHyNI9.js";
import "./cli-utils-CHV3_ffN.js";
import "./help-format-DFZn5_Pb.js";
import "./progress-DD4pMDZr.js";
import "./plugin-registry-DsSp4OHc.js";
import { n as resolveCliChannelOptions } from "./channel-options-IPg8YWnY.js";
import { t as getSubCliCommandsWithSubcommands } from "./register.subclis-CMGai_CB.js";
import { a as registerProgramCommands, r as getCoreCliCommandsWithSubcommands } from "./command-registry-DU5EOlRF.js";
import { r as setProgramContext } from "./program-context-B3MpsCuz.js";
import "./ports-u8jAZ2R5.js";
import { n as formatCliBannerLine, r as hasEmittedCliBanner, t as emitCliBanner } from "./banner-DhjR43ba.js";
import { Command, InvalidArgumentError } from "commander";
//#region src/cli/program/context.ts
function createProgramContext() {
	let cachedChannelOptions;
	const getChannelOptions = () => {
		if (cachedChannelOptions === void 0) cachedChannelOptions = resolveCliChannelOptions();
		return cachedChannelOptions;
	};
	return {
		programVersion: VERSION,
		get channelOptions() {
			return getChannelOptions();
		},
		get messageChannelOptions() {
			return getChannelOptions().join("|");
		},
		get agentChannelOptions() {
			return ["last", ...getChannelOptions()].join("|");
		}
	};
}
//#endregion
//#region src/cli/log-level-option.ts
const CLI_LOG_LEVEL_VALUES = ALLOWED_LOG_LEVELS.join("|");
function parseCliLogLevelOption(value) {
	const parsed = tryParseLogLevel(value);
	if (!parsed) throw new InvalidArgumentError(`Invalid --log-level (use ${CLI_LOG_LEVEL_VALUES})`);
	return parsed;
}
//#endregion
//#region src/cli/program/help.ts
const CLI_NAME = resolveCliName();
const CLI_NAME_PATTERN = escapeRegExp(CLI_NAME);
const ROOT_COMMANDS_WITH_SUBCOMMANDS = new Set([...getCoreCliCommandsWithSubcommands(), ...getSubCliCommandsWithSubcommands()]);
const ROOT_COMMANDS_HINT = "Hint: commands suffixed with * have subcommands. Run <command> --help for details.";
const EXAMPLES = [
	["openclaw models --help", "Show detailed help for the models command."],
	["openclaw channels login --verbose", "Link personal WhatsApp Web and show QR + connection logs."],
	["openclaw message send --target +15555550123 --message \"Hi\" --json", "Send via your web session and print JSON result."],
	["openclaw gateway --port 18789", "Run the WebSocket Gateway locally."],
	["openclaw --dev gateway", "Run a dev Gateway (isolated state/config) on ws://127.0.0.1:19001."],
	["openclaw gateway --force", "Kill anything bound to the default gateway port, then start it."],
	["openclaw gateway ...", "Gateway control via WebSocket."],
	["openclaw agent --to +15555550123 --message \"Run summary\" --deliver", "Talk directly to the agent using the Gateway; optionally send the WhatsApp reply."],
	["openclaw message send --channel telegram --target @mychat --message \"Hi\"", "Send via your Telegram bot."]
];
function configureProgramHelp(program, ctx) {
	program.name(CLI_NAME).description("").version(ctx.programVersion).option("--dev", "Dev profile: isolate state under ~/.openclaw-dev, default gateway port 19001, and shift derived ports (browser/canvas)").option("--profile <name>", "Use a named profile (isolates OPENCLAW_STATE_DIR/OPENCLAW_CONFIG_PATH under ~/.openclaw-<name>)").option("--log-level <level>", `Global log level override for file + console (${CLI_LOG_LEVEL_VALUES})`, parseCliLogLevelOption);
	program.option("--no-color", "Disable ANSI colors", false);
	program.helpOption("-h, --help", "Display help for command");
	program.helpCommand("help [command]", "Display help for command");
	program.configureHelp({
		sortSubcommands: true,
		sortOptions: true,
		optionTerm: (option) => theme.option(option.flags),
		subcommandTerm: (cmd) => {
			const hasSubcommands = cmd.parent === program && ROOT_COMMANDS_WITH_SUBCOMMANDS.has(cmd.name());
			return theme.command(hasSubcommands ? `${cmd.name()} *` : cmd.name());
		}
	});
	const formatHelpOutput = (str) => {
		let output = str;
		if (new RegExp(`^Usage:\\s+${CLI_NAME_PATTERN}\\s+\\[options\\]\\s+\\[command\\]\\s*$`, "m").test(output) && /^Commands:/m.test(output)) output = output.replace(/^Commands:/m, `Commands:\n  ${theme.muted(ROOT_COMMANDS_HINT)}`);
		return output.replace(/^Usage:/gm, theme.heading("Usage:")).replace(/^Options:/gm, theme.heading("Options:")).replace(/^Commands:/gm, theme.heading("Commands:"));
	};
	program.configureOutput({
		writeOut: (str) => {
			process.stdout.write(formatHelpOutput(str));
		},
		writeErr: (str) => {
			process.stderr.write(formatHelpOutput(str));
		},
		outputError: (str, write) => write(theme.error(str))
	});
	if (hasFlag(process.argv, "-V") || hasFlag(process.argv, "--version") || hasRootVersionAlias(process.argv)) {
		const commit = resolveCommitHash({ moduleUrl: import.meta.url });
		console.log(commit ? `OpenClaw ${ctx.programVersion} (${commit})` : `OpenClaw ${ctx.programVersion}`);
		process.exit(0);
	}
	program.addHelpText("beforeAll", () => {
		if (hasEmittedCliBanner()) return "";
		const rich = isRich();
		return `\n${formatCliBannerLine(ctx.programVersion, { richTty: rich })}\n`;
	});
	const fmtExamples = EXAMPLES.map(([cmd, desc]) => `  ${theme.command(replaceCliName(cmd, CLI_NAME))}\n    ${theme.muted(desc)}`).join("\n");
	program.addHelpText("afterAll", ({ command }) => {
		if (command !== program) return "";
		const docs = formatDocsLink("/cli", "docs.openclaw.ai/cli");
		return `\n${theme.heading("Examples:")}\n${fmtExamples}\n\n${theme.muted("Docs:")} ${docs}\n`;
	});
}
//#endregion
//#region src/cli/program/preaction.ts
function setProcessTitleForCommand(actionCommand) {
	let current = actionCommand;
	while (current.parent && current.parent.parent) current = current.parent;
	const name = current.name();
	const cliName = resolveCliName();
	if (!name || name === cliName) return;
	process.title = `${cliName}-${name}`;
}
const PLUGIN_REQUIRED_COMMANDS = new Set([
	"message",
	"channels",
	"directory",
	"agents",
	"configure",
	"onboard",
	"status",
	"health"
]);
const CONFIG_GUARD_BYPASS_COMMANDS = new Set([
	"backup",
	"doctor",
	"completion",
	"secrets"
]);
const JSON_PARSE_ONLY_COMMANDS = new Set(["config set"]);
let configGuardModulePromise;
let pluginRegistryModulePromise;
function shouldBypassConfigGuard(commandPath) {
	const [primary, secondary] = commandPath;
	if (!primary) return false;
	if (CONFIG_GUARD_BYPASS_COMMANDS.has(primary)) return true;
	if (primary === "config" && secondary === "validate") return true;
	return false;
}
function loadConfigGuardModule() {
	configGuardModulePromise ??= import("./config-guard-KXojcRPx.js").then((n) => n.t);
	return configGuardModulePromise;
}
function loadPluginRegistryModule() {
	pluginRegistryModulePromise ??= import("./plugin-registry-DsSp4OHc.js").then((n) => n.n);
	return pluginRegistryModulePromise;
}
function getRootCommand(command) {
	let current = command;
	while (current.parent) current = current.parent;
	return current;
}
function getCliLogLevel(actionCommand) {
	const root = getRootCommand(actionCommand);
	if (typeof root.getOptionValueSource !== "function") return;
	if (root.getOptionValueSource("logLevel") !== "cli") return;
	const logLevel = root.opts().logLevel;
	return typeof logLevel === "string" ? logLevel : void 0;
}
function isJsonOutputMode(commandPath, argv) {
	if (!hasFlag(argv, "--json")) return false;
	const key = `${commandPath[0] ?? ""} ${commandPath[1] ?? ""}`.trim();
	if (JSON_PARSE_ONLY_COMMANDS.has(key)) return false;
	return true;
}
function registerPreActionHooks(program, programVersion) {
	program.hook("preAction", async (_thisCommand, actionCommand) => {
		setProcessTitleForCommand(actionCommand);
		const argv = process.argv;
		if (hasHelpOrVersion(argv)) return;
		const commandPath = getCommandPathWithRootOptions(argv, 2);
		if (!(isTruthyEnvValue(process.env.OPENCLAW_HIDE_BANNER) || commandPath[0] === "update" || commandPath[0] === "completion" || commandPath[0] === "plugins" && commandPath[1] === "update")) emitCliBanner(programVersion);
		const verbose = getVerboseFlag(argv, { includeDebug: true });
		setVerbose(verbose);
		if (isDevMode()) try {
			const { loadConfig } = await import("./auth-profiles-CIqoN6FN.js").then((n) => n.xo);
			const cfg = loadConfig();
			const { setConfigOverride } = await import("./runtime-overrides-CGfXKBb_.js").then((n) => n.i);
			const path = await import("node:path");
			const { fileURLToPath } = await import("node:url");
			const thisDir = path.dirname(fileURLToPath(import.meta.url));
			const hubPluginPath = path.resolve(thisDir, "../../../dev-mode/hub");
			const currentPaths = cfg.plugins?.load?.paths ?? [];
			if (!currentPaths.includes(hubPluginPath)) setConfigOverride("plugins.load.paths", [...currentPaths, hubPluginPath]);
		} catch (err) {
			console.error(`[dev-mode] Failed to register hub plugin: ${err instanceof Error ? err.message : String(err)}`);
		}
		const cliLogLevel = getCliLogLevel(actionCommand);
		if (cliLogLevel) process.env.OPENCLAW_LOG_LEVEL = cliLogLevel;
		if (!verbose) process.env.NODE_NO_WARNINGS ??= "1";
		if (shouldBypassConfigGuard(commandPath)) return;
		const suppressDoctorStdout = isJsonOutputMode(commandPath, argv);
		const { ensureConfigReady } = await loadConfigGuardModule();
		await ensureConfigReady({
			runtime: defaultRuntime,
			commandPath,
			...suppressDoctorStdout ? { suppressDoctorStdout: true } : {}
		});
		if (PLUGIN_REQUIRED_COMMANDS.has(commandPath[0])) {
			const { ensurePluginRegistryLoaded } = await loadPluginRegistryModule();
			ensurePluginRegistryLoaded();
		}
	});
}
//#endregion
//#region src/cli/program/build-program.ts
function buildProgram() {
	const program = new Command();
	const ctx = createProgramContext();
	const argv = process.argv;
	setProgramContext(program, ctx);
	configureProgramHelp(program, ctx);
	registerPreActionHooks(program, ctx.programVersion);
	registerProgramCommands(program, ctx, argv);
	return program;
}
//#endregion
export { buildProgram };
