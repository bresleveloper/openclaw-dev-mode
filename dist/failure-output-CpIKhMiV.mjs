import { o as getRootOptionAwareCommandPath } from "./cli-root-options-DGcy1qRg.mjs";
import { r as isForegroundGatewayRunArgv } from "./gateway-run-argv-uoU8-Fwk.mjs";
import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { r as formatUncaughtError, t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as UpdateSchemaRefusalError } from "./openclaw-update-schema-refusal-C8zbzbYZ.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { s as isInvalidConfigError } from "./io.invalid-config-CsqYoW4w.mjs";
import { s as isGatewayTransportError } from "./transport-error-VfHcwKpH.mjs";
//#region src/cli/failure-output.ts
const gatewayRunFailures = /* @__PURE__ */ new WeakMap();
/** Agent dispatch supplies observed Gateway IDs; error identity and human output stay intact. */
function recordCliGatewayRunFailure(error, runId) {
	if (error instanceof Error && runId) gatewayRunFailures.set(error, {
		runId,
		origin: "gateway"
	});
}
/** Human diagnostics (agent transport-loss hint) read back the run identity recorded at dispatch. */
function readCliGatewayRunFailure(error) {
	return error instanceof Error ? gatewayRunFailures.get(error) : void 0;
}
var ExpectedCliError = class extends Error {
	constructor(params) {
		super(params.message, params.cause === void 0 ? void 0 : { cause: params.cause });
		this.name = "ExpectedCliError";
		this.humanOutput = params.humanOutput;
		this.humanOutputWritten = params.humanOutputWritten ?? false;
		this.machineOutput = params.machineOutput;
		this.matches = params.matches;
	}
};
function throwExpectedCliError(message) {
	throw new ExpectedCliError({
		message,
		humanOutput: message,
		machineOutput: message
	});
}
function isGatewayCredentialsCliError(error) {
	if (!(error instanceof Error)) return false;
	return error.name === "GatewayCredentialsRequiredError" && "method" in error && typeof error.method === "string" && "configPath" in error && typeof error.configPath === "string";
}
const EXPECTED_CLI_ERROR_NAMES = /* @__PURE__ */ new Set([
	"GatewayExplicitAuthRequiredError",
	"AgentSelectionRequiredError",
	"ConfigReadOnlyError",
	"NixModeConfigMutationError",
	"LocalStateOwnerError"
]);
function isExpectedCliError(error) {
	return error instanceof ExpectedCliError || isGatewayCredentialsCliError(error) || error instanceof Error && EXPECTED_CLI_ERROR_NAMES.has(error.name) || isGatewayTransportError(error);
}
/**
* Plugin actions and command hooks report their failure message like core command
* boundaries; the root renderer still owns JSON envelopes and exit codes.
*/
function toPluginCommandFailure(error) {
	if (isExpectedCliError(error) || error instanceof Error && (error.name === "CommanderError" || error.name === "ExitError")) return error;
	const commanderCode = error !== null && typeof error === "object" && "code" in error && typeof error.code === "string" && error.code.startsWith("commander.");
	if (shouldShowDebugDetails() && !commanderCode) return error;
	const message = formatCliOperatorError(error);
	return new ExpectedCliError({
		message,
		humanOutput: message,
		machineOutput: message,
		cause: error
	});
}
function rethrowExpectedCliError(error) {
	if (isExpectedCliError(error)) throw error;
}
function resolveExpectedCliOutput(error) {
	return error instanceof ExpectedCliError ? error : {
		humanOutput: error.message,
		humanOutputWritten: false,
		machineOutput: error.message
	};
}
/** Canonical machine-readable failure envelope for CLI-owned errors. */
function formatCliJsonFailure(error, options = {}) {
	const message = isExpectedCliError(error) ? formatErrorMessage(resolveExpectedCliOutput(error).machineOutput.trimEnd()) : formatCliOperatorError(error, options);
	return {
		ok: false,
		...readCliGatewayRunFailure(error),
		error: {
			type: "cli_error",
			message,
			...error instanceof ExpectedCliError && error.matches ? { matches: error.matches } : {},
			...error instanceof UpdateSchemaRefusalError ? {
				code: error.code,
				databases: error.databases,
				updaterVersion: error.updaterVersion,
				targetVersion: error.targetVersion,
				commands: error.commands
			} : {}
		}
	};
}
function hasDebugArg(argv) {
	for (const arg of argv ?? []) {
		if (arg === "--") return false;
		if (arg === "--debug" || arg === "--verbose") return true;
	}
	return false;
}
function shouldShowDebugDetails(argv = process.argv, env = process.env) {
	return hasDebugArg(argv) || isTruthyEnvValue(env.OPENCLAW_DEBUG);
}
function formatCliOperatorError(error, options = {}) {
	const value = !shouldShowDebugDetails(options.argv, options.env) && error instanceof Error ? error.message || error.name || "Error" : error;
	return formatErrorMessage(value);
}
function pushPrefixed(out, value) {
	for (const line of value.split("\n")) if (line.trim().length > 0) out.push(`[openclaw] ${line}`);
}
function formatCliFailureLines(options) {
	const env = options.env ?? process.env;
	const argv = options.argv ?? process.argv;
	const showDebugDetails = shouldShowDebugDetails(options.argv, env);
	const commandPath = getRootOptionAwareCommandPath(argv, 2);
	const isUpdateCommand = commandPath[0] === "update";
	const isPluginUpdateCommand = commandPath[0] === "plugins" && commandPath[1] === "update";
	const showUpdateDiagnostics = ["0", "1"].includes(env.OPENCLAW_UPDATE_IN_PROGRESS ?? "");
	if (isGatewayTransportError(options.error) && !showDebugDetails && !showUpdateDiagnostics && !isUpdateCommand) {
		const error = options.error;
		return [
			error.kind === "timeout" ? "OpenClaw took too long to respond." : error.requestDispatched ? "Lost the connection to OpenClaw." : "Couldn't connect to OpenClaw.",
			...error.requestDispatched ? ["Your request may have completed. Check its result before trying again."] : [],
			`Check the Control UI or run \`${formatCliCommand("openclaw gateway status", options.env)}\` in your terminal.`
		];
	}
	if (isExpectedCliError(options.error)) {
		const output = resolveExpectedCliOutput(options.error);
		return output.humanOutputWritten ? [] : output.humanOutput.trimEnd().split("\n");
	}
	const errors = collectNestedErrorCandidates(options.error);
	const stateBusy = errors.some((error) => error instanceof Error && error.name === "GatewayStateOwnerContentionError");
	const stateRefusal = errors.find((error) => error instanceof Error && error.name === "StateDatabaseAccessError");
	const reason = (error) => `[openclaw] Reason: ${formatCliOperatorError(error, {
		argv,
		env
	})}`;
	if (!showDebugDetails && !showUpdateDiagnostics) {
		if (options.error instanceof UpdateSchemaRefusalError || options.error instanceof Error && (options.error.name === "DoctorUnreadableStateDatabaseError" || options.error.name === "OpenClawDatabaseSchemaPreflightError")) return ["[openclaw] OpenClaw needs a manual recovery step.", reason(options.error)];
		if (stateRefusal) return [`[openclaw] ${options.title}`, reason(stateRefusal)];
		const showReason = isInvalidConfigError(options.error) ? !options.error.diagnosticEmitted : isUpdateCommand || isPluginUpdateCommand || isForegroundGatewayRunArgv(argv);
		return [
			`[openclaw] ${options.title}`,
			...showReason ? [reason(options.error)] : [],
			stateBusy ? "[openclaw] Another OpenClaw process is using your data. Wait for it to finish before trying again." : options.includeDoctorHint === false ? `[openclaw] For details, open Settings → Logs in the Control UI or run \`${formatCliCommand("openclaw logs --follow", env)}\`.` : `[openclaw] For help, run \`${formatCliCommand("openclaw doctor", env)}\`.`
		];
	}
	const lines = [`[openclaw] ${options.title}`, reason(options.error)];
	if (showDebugDetails) {
		lines.push("[openclaw] Stack:");
		pushPrefixed(lines, formatUncaughtError(options.error));
	}
	if (options.includeDoctorHint !== false && !stateBusy) lines.push(`[openclaw] Try: ${formatCliCommand("openclaw doctor", env)}`);
	lines.push(`[openclaw] Help: ${formatCliCommand("openclaw --help", env)}`);
	return lines;
}
//#endregion
export { isExpectedCliError as a, recordCliGatewayRunFailure as c, toPluginCommandFailure as d, formatCliOperatorError as i, rethrowExpectedCliError as l, formatCliFailureLines as n, isGatewayCredentialsCliError as o, formatCliJsonFailure as r, readCliGatewayRunFailure as s, ExpectedCliError as t, throwExpectedCliError as u };
