import { s as getVerboseFlag, u as isHelpOrVersionInvocation } from "./argv-D0lt4C2b.js";
import { n as resolveCliName } from "./cli-name-CAJoj2J5.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-B68_W0LA.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import { r as setVerbose } from "./global-state-BAD7XgmL.js";
import "./globals-BWmHKFNH.js";
import { n as resolveCliChannelOptions } from "./channel-options-DBTkIiOH.js";
import { n as isParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.js";
import { n as ensureCliExecutionBootstrap, r as resolveCliExecutionStartupContext, t as applyCliExecutionStartupPresentation } from "./command-execution-startup-C8XyqPFW.js";
import { n as shouldBypassConfigGuardForCommandPath } from "./command-startup-policy-DF4M6mzu.js";
import { n as setProgramContext } from "./program-context-VEhF8JxS.js";
import { t as isCommandJsonOutputMode } from "./json-mode-DcPvCz3Z.js";
import { n as resolvePluginInstallPreactionRequest, t as resolvePluginInstallInvalidConfigPolicy } from "./plugin-install-config-policy-DDi482qi.js";
import { t as forceFreePort } from "./ports-7_RmLNe5.js";
import { t as registerProgramCommands } from "./command-registry-BlfuEz2k.js";
import { t as configureProgramHelp } from "./help-Y8oZawvj.js";
import process$1 from "node:process";
import { Command } from "commander";
//#region src/cli/program/context.ts
/** Create a program context that resolves channel options once on first use. */
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
//#region src/cli/program/preaction.ts
function setProcessTitleForCommand(actionCommand) {
	let current = actionCommand;
	while (current.parent && current.parent.parent) current = current.parent;
	const name = current.name();
	const cliName = resolveCliName();
	if (!name || name === cliName) return;
	process.title = `${cliName}-${name}`;
}
function shouldAllowInvalidConfigForAction(actionCommand, commandPath) {
	return resolvePluginInstallInvalidConfigPolicy(resolvePluginInstallPreactionRequest({
		actionCommand,
		commandPath,
		argv: process.argv
	})) === "allow-plugin-recovery";
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
function isBareParentDefaultHelpInvocation(actionCommand, argv) {
	if (!isParentDefaultHelpAction(actionCommand)) return false;
	const { commandPath } = resolveCliArgvInvocation(argv);
	const [primary, extra] = commandPath;
	if (extra !== void 0 || !primary) return false;
	return primary === actionCommand.name() || actionCommand.aliases().includes(primary);
}
function isGuidedConfigAction(actionCommand) {
	return actionCommand.name() === "config" && !actionCommand.parent?.parent;
}
function isGuidedConfigCommandPath(commandPath) {
	const [primary, secondary, extra] = commandPath;
	if (primary !== "config" || extra !== void 0) return false;
	return secondary !== "get" && secondary !== "set" && secondary !== "patch" && secondary !== "unset" && secondary !== "file" && secondary !== "schema" && secondary !== "validate";
}
function isGatewayRunAction(actionCommand) {
	if (actionCommand.name() === "gateway") return actionCommand.parent?.parent === null;
	return actionCommand.name() === "run" && actionCommand.parent?.name() === "gateway" && actionCommand.parent.parent?.parent === null;
}
/** Register global pre-action bootstrap hooks for every non-help command invocation. */
function registerPreActionHooks(program, programVersion) {
	program.hook("preAction", async (_thisCommand, actionCommand) => {
		setProcessTitleForCommand(actionCommand);
		const argv = process.argv;
		if (isHelpOrVersionInvocation(argv) || isBareParentDefaultHelpInvocation(actionCommand, argv)) return;
		const { commandPath, startupPolicy } = resolveCliExecutionStartupContext({
			argv,
			jsonOutputMode: isCommandJsonOutputMode(actionCommand, argv),
			env: process.env
		});
		await applyCliExecutionStartupPresentation({
			startupPolicy,
			version: programVersion
		});
		const verbose = getVerboseFlag(argv, { includeDebug: true });
		setVerbose(verbose);
		const cliLogLevel = getCliLogLevel(actionCommand);
		if (cliLogLevel) process.env.OPENCLAW_LOG_LEVEL = cliLogLevel;
		if (!verbose) process.env.NODE_NO_WARNINGS ??= "1";
		if (shouldBypassConfigGuardForCommandPath(commandPath) || isGuidedConfigAction(actionCommand) || isGuidedConfigCommandPath(commandPath)) return;
		let beforeStateMigrations;
		if (isGatewayRunAction(actionCommand)) {
			const { prepareGatewayRunBootstrap, recheckGatewayRunBootstrap } = await import("./pre-bootstrap-C0APoXqt.js");
			const { resolveGatewayRunOptions } = await import("./run-options-BZEL7PKh.js");
			const resolvedOptions = resolveGatewayRunOptions(actionCommand.opts(), actionCommand);
			const opts = {
				force: resolvedOptions.force === true,
				reset: resolvedOptions.reset === true
			};
			if (!await prepareGatewayRunBootstrap({
				opts,
				runtime: defaultRuntime
			})) return;
			beforeStateMigrations = (snapshot) => recheckGatewayRunBootstrap({
				opts,
				runtime: defaultRuntime,
				...snapshot ? { snapshot } : {}
			});
		}
		await ensureCliExecutionBootstrap({
			runtime: defaultRuntime,
			commandPath,
			startupPolicy,
			allowInvalid: shouldAllowInvalidConfigForAction(actionCommand, commandPath),
			...beforeStateMigrations ? { beforeStateMigrations } : {},
			skipConfigGuard: shouldBypassConfigGuardForCommandPath(commandPath)
		});
		if (beforeStateMigrations) {
			const { reloadTrustedGatewayRunEnvironment } = await import("./pre-bootstrap-C0APoXqt.js");
			await reloadTrustedGatewayRunEnvironment({ runtime: defaultRuntime });
		}
	});
}
//#endregion
//#region src/cli/program/build-program.ts
function buildProgram() {
	const program = new Command();
	program.enablePositionalOptions();
	program.exitOverride((err) => {
		process$1.exitCode = typeof err.exitCode === "number" ? err.exitCode : 1;
		throw err;
	});
	const ctx = createProgramContext();
	const argv = process$1.argv;
	setProgramContext(program, ctx);
	configureProgramHelp(program, ctx);
	registerPreActionHooks(program, ctx.programVersion);
	registerProgramCommands(program, ctx, argv);
	return program;
}
//#endregion
export { buildProgram, forceFreePort };
