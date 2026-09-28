import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as formatUncaughtError, t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as UpdateSchemaRefusalError } from "./openclaw-update-schema-refusal-CIfR48BB.mjs";
import { a as isGatewayTransportError } from "./transport-error-C-c71VUr.mjs";
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
function isGatewayExplicitAuthCliError(error) {
	return error instanceof Error && error.name === "GatewayExplicitAuthRequiredError";
}
function isAgentSelectionCliError(error) {
	return error instanceof Error && error.name === "AgentSelectionRequiredError";
}
function isImmutableConfigCliError(error) {
	return error instanceof Error && (error.name === "ConfigReadOnlyError" || error.name === "NixModeConfigMutationError");
}
function isExpectedCliError(error) {
	return error instanceof ExpectedCliError || isGatewayCredentialsCliError(error) || isGatewayExplicitAuthCliError(error) || isImmutableConfigCliError(error) || isAgentSelectionCliError(error) || isGatewayTransportError(error);
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
	if (isExpectedCliError(options.error)) {
		const output = resolveExpectedCliOutput(options.error);
		return output.humanOutputWritten ? [] : output.humanOutput.trimEnd().split("\n");
	}
	const env = options.env ?? process.env;
	const showDebugDetails = shouldShowDebugDetails(options.argv, env);
	const lines = [`[openclaw] ${options.title}`, `[openclaw] Reason: ${formatCliOperatorError(options.error, {
		argv: options.argv,
		env
	})}`];
	if (showDebugDetails) {
		lines.push("[openclaw] Stack:");
		pushPrefixed(lines, formatUncaughtError(options.error));
	} else lines.push("[openclaw] Debug: set OPENCLAW_DEBUG=1 to include the stack trace.");
	if (options.includeDoctorHint !== false) lines.push(`[openclaw] Try: ${formatCliCommand("openclaw doctor", env)}`);
	lines.push(`[openclaw] Help: ${formatCliCommand("openclaw --help", env)}`);
	return lines;
}
//#endregion
export { isExpectedCliError as a, recordCliGatewayRunFailure as c, formatCliOperatorError as i, rethrowExpectedCliError as l, formatCliFailureLines as n, isGatewayCredentialsCliError as o, formatCliJsonFailure as r, readCliGatewayRunFailure as s, ExpectedCliError as t };
