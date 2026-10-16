import { o as getRootOptionAwareCommandPath } from "./cli-root-options-DGcy1qRg.mjs";
import { r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { s as isInvalidConfigError } from "./io.invalid-config-BzeD3bi5.mjs";
import { a as isGatewayTransportError } from "./transport-error-CsYJ5b9e.mjs";
import { r as formatUncaughtError, t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as UpdateSchemaRefusalError } from "./openclaw-update-schema-refusal-M64rViod.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
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
		super(params.message);
		this.name = "ExpectedCliError";
		this.humanOutput = params.humanOutput;
		this.humanOutputWritten = params.humanOutputWritten ?? false;
		this.machineOutput = params.machineOutput;
		this.matches = params.matches;
	}
};
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
	const stateBusy = collectNestedErrorCandidates(options.error).some((error) => error instanceof Error && error.name === "GatewayStateOwnerContentionError");
	if (!showDebugDetails && !showUpdateDiagnostics) {
		if (options.error instanceof UpdateSchemaRefusalError || options.error instanceof Error && (options.error.name === "DoctorUnreadableStateDatabaseError" || options.error.name === "OpenClawDatabaseSchemaPreflightError")) {
			const lines = ["[openclaw] OpenClaw needs a manual recovery step."];
			lines.push(`[openclaw] Reason: ${formatCliOperatorError(options.error, {
				argv: options.argv,
				env
			})}`);
			return lines;
		}
		const showReason = isInvalidConfigError(options.error) ? !options.error.diagnosticEmitted : isUpdateCommand || isPluginUpdateCommand;
		return [
			`[openclaw] ${options.title}`,
			...showReason ? [`[openclaw] Reason: ${formatCliOperatorError(options.error, {
				argv: options.argv,
				env
			})}`] : [],
			stateBusy ? "[openclaw] Another OpenClaw process is using your data. Wait for it to finish before trying again." : options.includeDoctorHint === false ? `[openclaw] For details, open Settings → Logs in the Control UI or run \`${formatCliCommand("openclaw logs --follow", env)}\`.` : `[openclaw] For help, run \`${formatCliCommand("openclaw doctor", env)}\`.`
		];
	}
	const lines = [`[openclaw] ${options.title}`, `[openclaw] Reason: ${formatCliOperatorError(options.error, {
		argv: options.argv,
		env
	})}`];
	if (showDebugDetails) {
		lines.push("[openclaw] Stack:");
		pushPrefixed(lines, formatUncaughtError(options.error));
	}
	if (options.includeDoctorHint !== false && !stateBusy) lines.push(`[openclaw] Try: ${formatCliCommand("openclaw doctor", env)}`);
	lines.push(`[openclaw] Help: ${formatCliCommand("openclaw --help", env)}`);
	return lines;
}
//#endregion
export { isExpectedCliError as a, recordCliGatewayRunFailure as c, formatCliOperatorError as i, rethrowExpectedCliError as l, formatCliFailureLines as n, isGatewayCredentialsCliError as o, formatCliJsonFailure as r, readCliGatewayRunFailure as s, ExpectedCliError as t };
