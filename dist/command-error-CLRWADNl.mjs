import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as stripAnsi, n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
//#region src/process/command-error.ts
const COMMAND_ERROR_NAME = "CommandExecutionError";
const COMMAND_ERROR_HEADER_RE = /^(?:Error:\s*)?.+ failed \((?:timed out after [\d.]+ seconds|timed out waiting for output|output limit exceeded|exit code -?\d+|terminated|signal SIG[A-Z0-9]+)(?:; signal SIG[A-Z0-9]+)?\):?$/u;
function formatCommandErrorForUser(text) {
	const lines = text.trim().split(/\r?\n/u);
	const header = lines[0] ?? "";
	if (!header.startsWith(`${COMMAND_ERROR_NAME}: `) && !COMMAND_ERROR_HEADER_RE.test(header)) return;
	const summary = [header, lines.length > 1 ? lines.at(-1)?.trim() : void 0].filter(Boolean).join(" ").replace(/\s+/gu, " ").trim();
	return summary.length > 500 ? `${truncateUtf16Safe(summary, 497)}...` : summary;
}
function formatCommandOutput(output, maxChars = 800) {
	const lines = stripAnsi(output.toString()).replace(/(^|[^\r])\r+(?=\n|$)/g, "$1").replace(/(^|\n)[^\n]*\r/g, "$1").trim().split("\n");
	const tail = lines.slice(-12).map(sanitizeTerminalText).join("\n");
	return `${lines.length > 12 || tail.length > maxChars ? "…\n" : ""}${sliceUtf16Safe(tail, Math.max(0, tail.length - maxChars))}`;
}
/** Use an operation label, never argv that may contain credentials. */
function formatCommandResult(command, result) {
	const label = truncateUtf16Safe(sanitizeForLog(command.replace(/[\r\n]+/g, " ")), 256);
	const termination = result.outputLimitExceeded ? "output-limit" : result.termination;
	const signal = result.signal ? `, signal=${result.signal}` : "";
	const killed = result.killed ? ", killed=true" : "";
	return [`${label} ${result.code === 0 ? "exited" : "failed"} (code=${result.code}, termination=${termination}${signal}${killed})`, ...["stderr", "stdout"].flatMap((stream) => {
		const output = formatCommandOutput(result[stream]);
		return output ? [`${stream}: ${output}`] : [];
	})].join("\n");
}
function createCommandError(command, result, options) {
	const stderr = formatCommandOutput(result.stderr, 2e3);
	const stdout = formatCommandOutput(result.stdout, 2e3);
	let detail = stderr || stdout;
	if (stderr && stdout) {
		const budget = 1983;
		const first = Math.min(stderr.length, Math.max(Math.ceil(budget / 2), budget - stdout.length));
		const tail = (output, limit) => output.length <= limit ? output : `…\n${sliceUtf16Safe(output, 2 - limit)}`;
		detail = `stderr: ${tail(stderr, first)}\nstdout: ${tail(stdout, budget - first)}`;
	}
	const signal = result.signal ? `signal ${result.signal}` : "";
	const limited = "outputLimitExceeded" in result && result.outputLimitExceeded ? "output limit exceeded" : "";
	const exitReason = limited || (!signal && result.code !== null ? `exit code ${result.code}` : "");
	const reason = [{
		timeout: `timed out after ${options.timeoutMs / 1e3} seconds`,
		"no-output-timeout": "timed out waiting for output",
		"output-limit": "output limit exceeded",
		exit: exitReason,
		error: exitReason,
		signal: limited || (!signal ? "terminated" : "")
	}[result.termination], signal].filter(Boolean).join("; ");
	const label = truncateUtf16Safe(stripAnsi(command).replace(/[\r\n]+/g, " "), 256);
	const error = /* @__PURE__ */ new Error(`${label} failed${reason ? ` (${reason})` : ""}${detail ? `:\n${detail}` : ""}`);
	error.name = COMMAND_ERROR_NAME;
	return error;
}
//#endregion
export { formatCommandResult as i, formatCommandErrorForUser as n, formatCommandOutput as r, createCommandError as t };
