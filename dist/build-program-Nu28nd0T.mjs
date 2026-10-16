import { G as getCommanderErrorCommandNames, J as hasCommanderOptionToken, K as getCommanderErrorCommandPath, T as isModelsPlainMachineOutput, W as getCommanderCommandPath, X as setCommanderErrorCommand, l as isHelpOrVersionInvocation, o as getVerboseFlag, q as getCommanderSubcommandFact } from "./argv-D_Nxd_3s.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CV_-dmd8.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { r as setVerbose } from "./global-state-BAD7XgmL.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import "./globals-BXbZ1A_g.mjs";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import { r as isJsonOutputModeActive, t as applyResolvedCommandOutputMode } from "./json-output-mode-DhC0xNZP.mjs";
import { t as resolveCliCommandPathPolicy } from "./command-path-policy-Cfb4tLrw.mjs";
import { t as resolveCliStartupPolicy } from "./command-startup-policy-BnA40z2t.mjs";
import { n as ensureCliExecutionBootstrap, t as applyCliExecutionStartupPresentation } from "./command-execution-startup-DccTYNhg.mjs";
import { n as resolveCliChannelOptions } from "./channel-options-BqjmBj7f.mjs";
import { n as isParentDefaultHelpAction } from "./parent-default-help-udre-2i5.mjs";
import { r as registerCoreCliCommands } from "./command-registry-core-wSs55KrN.mjs";
import { n as setProgramContext } from "./program-context-VEhF8JxS.mjs";
import { r as registerSubCliCommands } from "./register.subclis-7_xmNmr1.mjs";
import { t as isCommandJsonOutputMode } from "./json-mode-e6DlzpSi.mjs";
import { t as configureProgramHelp } from "./help-C89FSiHx.mjs";
import { t as createCliParseError } from "./error-output-B1kAWZ7y.mjs";
import process$1 from "node:process";
import { Command, CommanderError } from "commander";
//#region src/cli/program/context.ts
/** Create a program context that resolves channel options once on first use. */
function createProgramContext(prepared = {}) {
	let cachedChannelOptions;
	const getChannelOptions = () => cachedChannelOptions ??= resolveCliChannelOptions();
	return {
		...prepared,
		programVersion: VERSION,
		get messageChannelOptions() {
			return getChannelOptions().join("|");
		},
		get agentChannelOptions() {
			return ["last", ...getChannelOptions()].join("|");
		}
	};
}
//#endregion
//#region src/cli/program/openclaw-command.ts
var OpenClawCommand = class OpenClawCommand extends Command {
	createCommand(name) {
		return new OpenClawCommand(name);
	}
	error(message, errorOptions) {
		const restoreErrorCommand = setCommanderErrorCommand(this);
		try {
			return super.error(message, errorOptions);
		} catch (error) {
			if (error instanceof CommanderError && error.exitCode !== 0 && (isJsonOutputModeActive(process.argv) || isCommandJsonOutputMode(this, process.argv))) {
				if (!isCommandJsonOutputMode(this, process.argv) && !hasCommanderOptionToken(this, process.argv, /* @__PURE__ */ new Set(["--json"]), "flag")) {
					applyResolvedCommandOutputMode(false);
					throw error;
				}
				applyResolvedCommandOutputMode(true);
				throw createCliParseError(message, {
					argv: process.argv,
					commandPath: getCommanderErrorCommandPath(this),
					commandNames: getCommanderErrorCommandNames(this)
				}, { humanOutputWritten: true });
			}
			throw error;
		} finally {
			restoreErrorCommand();
		}
	}
	_outputHelpIfRequested(args) {
		const subcommandFact = getCommanderSubcommandFact(this, args);
		if (subcommandFact?.kind === "defer") return;
		if (subcommandFact?.kind === "unknown") this.error(`error: unknown command '${subcommandFact.name}'`, { code: "commander.unknownCommand" });
		super._outputHelpIfRequested(args);
	}
};
//#endregion
//#region src/cli/program/preaction.ts
const HELP_OR_VERSION_FLAGS = /* @__PURE__ */ new Set([
	"-h",
	"--help",
	"-V",
	"--version"
]);
function setProcessTitleForCommand() {
	if (process.title !== "openclaw") process.title = CLI_NAME;
}
function getCliLogLevel(actionCommand) {
	if (actionCommand.getOptionValueSourceWithGlobals("logLevel") !== "cli") return;
	const logLevel = actionCommand.optsWithGlobals().logLevel;
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
async function runStateStoreGuard(commandPath) {
	if (resolveCliCommandPathPolicy(commandPath).stateStoreGuard !== "run") return;
	let outcome;
	try {
		const { checkCliGatewayStateDir } = await import("./state-dir-gateway-check-DI6rXq-A.mjs");
		outcome = await checkCliGatewayStateDir({ command: `openclaw ${commandPath.join(" ")}` });
	} catch (error) {
		const { formatErrorMessage } = await import("./infra/errors.js");
		const { logDebug } = await import("./logger-Bd8sAxqZ.mjs");
		logDebug(`state-store guard unavailable: ${formatErrorMessage(error)}`);
		return;
	}
	if (outcome.kind === "warn") defaultRuntime.log(outcome.message);
	else if (outcome.kind === "refuse") throw new Error(outcome.message);
}
/** Register global pre-action bootstrap hooks for every non-help command invocation. */
function registerPreActionHooks(program, programVersion) {
	program.hook("preAction", async (_thisCommand, actionCommand) => {
		setProcessTitleForCommand();
		const argv = process.argv;
		const helpOrVersionWasOptionValue = hasCommanderOptionToken(actionCommand, argv, HELP_OR_VERSION_FLAGS, "value");
		if (isHelpOrVersionInvocation(argv) && !helpOrVersionWasOptionValue || isBareParentDefaultHelpInvocation(actionCommand, argv)) return;
		const commandPath = getCommanderCommandPath(actionCommand);
		const nativeUpdateExecutorCheck = commandPath.length === 2 && (commandPath[0] === "gateway" || commandPath[0] === "daemon") && [
			"install",
			"restart",
			"stop"
		].includes(commandPath[1] ?? "") && actionCommand.args.length === 0 && actionCommand.getOptionValueSource("updateExecutor") === "cli" && actionCommand.getOptionValue("updateExecutor") === "check";
		const jsonOutputMode = nativeUpdateExecutorCheck || isCommandJsonOutputMode(actionCommand, argv);
		const machineOutputMode = jsonOutputMode || isModelsPlainMachineOutput(argv, actionCommand);
		applyResolvedCommandOutputMode(jsonOutputMode, machineOutputMode);
		const startupPolicy = resolveCliStartupPolicy({
			argv,
			options: actionCommand.opts(),
			commandPath,
			jsonOutputMode,
			machineOutputMode,
			env: process.env,
			nativeUpdateExecutorCheck
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
		if (nativeUpdateExecutorCheck || isGuidedConfigAction(actionCommand) || isGuidedConfigCommandPath(commandPath)) return;
		await runStateStoreGuard(commandPath);
		if (startupPolicy.skipConfigGuard) {
			await ensureCliExecutionBootstrap({
				runtime: defaultRuntime,
				commandPath,
				startupPolicy,
				skipConfigGuard: true
			});
			return;
		}
		let beforeStatePreparation;
		const [{ resolvePluginInstallInvalidConfigPolicy }, { resolvePluginInstallPreactionRequest }] = await Promise.all([import("./install-config-ColnVLb1.mjs"), import("./plugin-install-config-policy-Cpnkf83S.mjs")]);
		let allowInvalid = commandPath[0] === "update" || resolvePluginInstallInvalidConfigPolicy(resolvePluginInstallPreactionRequest({
			actionCommand,
			commandPath,
			argv: process.argv
		})) === "allow-plugin-recovery";
		if (isGatewayRunAction(actionCommand)) {
			const { prepareGatewayRunBootstrap, recheckGatewayRunBootstrap } = await import("./pre-bootstrap-DigA57gy.mjs");
			const { resolveGatewayRunOptions } = await import("./run-options-B9X-7S39.mjs");
			const resolvedOptions = resolveGatewayRunOptions(actionCommand.opts(), actionCommand);
			allowInvalid ||= resolvedOptions.allowUnconfigured === true;
			const opts = resolvedOptions;
			if (!await prepareGatewayRunBootstrap({
				opts,
				runtime: defaultRuntime
			})) return;
			beforeStatePreparation = (snapshot) => recheckGatewayRunBootstrap({
				opts,
				runtime: defaultRuntime,
				...snapshot ? { snapshot } : {}
			});
		}
		await ensureCliExecutionBootstrap({
			runtime: defaultRuntime,
			commandPath,
			startupPolicy,
			allowInvalid,
			...beforeStatePreparation ? { beforeStatePreparation } : {}
		});
		if (beforeStatePreparation && isGatewayRunAction(actionCommand)) {
			const { reloadTrustedGatewayRunEnvironment } = await import("./pre-bootstrap-DigA57gy.mjs");
			await reloadTrustedGatewayRunEnvironment({ runtime: defaultRuntime });
		}
	});
}
//#endregion
//#region src/cli/program/build-program.ts
function buildProgram(prepared) {
	const program = new OpenClawCommand();
	program.enablePositionalOptions();
	program.exitOverride((err) => {
		process$1.exitCode = typeof err.exitCode === "number" ? err.exitCode : 1;
		throw err;
	});
	const ctx = createProgramContext(prepared);
	const argv = process$1.argv;
	setProgramContext(program, ctx);
	configureProgramHelp(program, ctx);
	registerPreActionHooks(program, ctx.programVersion);
	registerCoreCliCommands(program, ctx, argv);
	registerSubCliCommands(program, argv);
	return program;
}
//#endregion
export { buildProgram };
