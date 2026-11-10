import { E as isModelsPlainMachineOutput, G as getCommanderCommandPath, J as getCommanderSubcommandFact, K as getCommanderErrorCommandNames, Y as hasCommanderOptionToken, Z as setCommanderErrorCommand, l as isHelpOrVersionInvocation, o as getVerboseFlag, q as getCommanderErrorCommandPath } from "./argv-C7hqFLn5.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CJfjJu7L.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { r as setVerbose } from "./global-state-BAD7XgmL.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import "./globals-XVSoVbNQ.mjs";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import { r as isJsonOutputModeActive, t as applyResolvedCommandOutputMode } from "./json-output-mode-CjwEBwVY.mjs";
import { t as resolveCliCommandPathPolicy } from "./command-path-policy-u5WGwKHZ.mjs";
import { t as resolveCliStartupPolicy } from "./command-startup-policy-_d9_K0F3.mjs";
import { n as ensureCliExecutionBootstrap, t as applyCliExecutionStartupPresentation } from "./command-execution-startup-CVTKe0ke.mjs";
import { n as resolveCliChannelOptions } from "./channel-options-Q5sJSTQ_.mjs";
import { n as isParentDefaultHelpAction } from "./parent-default-help-udre-2i5.mjs";
import { r as registerCoreCliCommands } from "./command-registry-core-Bci79u3X.mjs";
import { n as setProgramContext } from "./program-context-CFLHovaZ.mjs";
import { r as registerSubCliCommands } from "./register.subclis-D-P6yuJz.mjs";
import { t as isCommandJsonOutputMode } from "./json-mode-BIqJ-P-D.mjs";
import { t as configureProgramHelp } from "./help-CARbRKBi.mjs";
import { t as createCliParseError } from "./error-output-BAM0q47p.mjs";
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
function isGuidedConfigCommandPath(commandPath) {
	const [primary, secondary, extra] = commandPath;
	if (primary !== "config" || extra !== void 0) return false;
	return secondary !== "get" && secondary !== "set" && secondary !== "patch" && secondary !== "unset" && secondary !== "file" && secondary !== "schema" && secondary !== "validate";
}
async function runStateStoreGuard(commandPath) {
	if (resolveCliCommandPathPolicy(commandPath).stateStoreGuard !== "run") return;
	let outcome;
	try {
		const { checkCliGatewayStateDir } = await import("./state-dir-gateway-check-DtbkbMrq.mjs");
		outcome = await checkCliGatewayStateDir({ command: `openclaw ${commandPath.join(" ")}` });
	} catch (error) {
		const { formatErrorMessage } = await import("./infra/errors.js");
		const { logDebug } = await import("./logger-DP5TOTWg.mjs");
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
		const verbose = getVerboseFlag(argv);
		setVerbose(verbose);
		const cliLogLevel = getCliLogLevel(actionCommand);
		if (cliLogLevel) process.env.OPENCLAW_LOG_LEVEL = cliLogLevel;
		if (!verbose) process.env.NODE_NO_WARNINGS ??= "1";
		if (nativeUpdateExecutorCheck || isGuidedConfigCommandPath(commandPath)) return;
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
		const [{ resolvePluginInstallInvalidConfigPolicy }, { resolvePluginInstallPreactionRequest }] = await Promise.all([import("./install-config-BtS5HyRj.mjs"), import("./plugin-install-config-policy-DanhGzkh.mjs")]);
		let allowInvalid = commandPath[0] === "update" || resolvePluginInstallInvalidConfigPolicy(resolvePluginInstallPreactionRequest({
			actionCommand,
			commandPath,
			argv: process.argv
		})) === "allow-plugin-recovery";
		if (commandPath[0] === "gateway" && (commandPath.length === 1 || commandPath.length === 2 && commandPath[1] === "run")) {
			const { prepareGatewayRunBootstrap, recheckGatewayRunBootstrap } = await import("./pre-bootstrap-B-l2TRKm.mjs");
			const { resolveGatewayRunOptions } = await import("./run-options-B9X-7S39.mjs");
			const opts = resolveGatewayRunOptions(actionCommand.opts(), actionCommand);
			allowInvalid ||= opts.allowUnconfigured === true;
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
		if (beforeStatePreparation) {
			const { reloadTrustedGatewayRunEnvironment } = await import("./pre-bootstrap-B-l2TRKm.mjs");
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
		process$1.exitCode = err.exitCode;
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
