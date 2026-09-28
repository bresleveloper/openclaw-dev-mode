import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
//#region src/process/exec-result.ts
const commandCleanupUncertain = Symbol.for("openclaw.command-cleanup-uncertain");
/** An admitted command may still write; callers must retain its artifacts for recovery. */
var CommandProcessCleanupError = class extends Error {
	constructor(options) {
		super("Command cleanup could not confirm that owned work stopped", options);
		this.code = "ERR_COMMAND_PROCESS_CLEANUP_UNCERTAIN";
		this.cleanup = "uncertain";
		this.name = "CommandProcessCleanupError";
		Object.defineProperty(this, commandCleanupUncertain, { value: true });
	}
};
/** Preserve canonical cleanup classification across cause chains and module copies. */
function hasCommandProcessCleanupError(error) {
	return collectNestedErrorCandidates(error).some((candidate) => {
		try {
			return Object.getOwnPropertyDescriptor(candidate, commandCleanupUncertain)?.value === true;
		} catch {
			return false;
		}
	});
}
function createSanitizedCommandError(result) {
	const code = typeof result.code === "string" ? result.code : void 0;
	const exitCode = typeof result.exitCode === "number" ? result.exitCode : void 0;
	const signal = typeof result.signal === "string" ? result.signal : void 0;
	const message = result.timedOut ? "Command timed out" : result.isMaxBuffer ? "Command output exceeded its capture limit" : result.isCanceled ? "Command was canceled" : result.isTerminated ? `Command was terminated${signal ? ` by ${signal}` : ""}` : exitCode !== void 0 && exitCode !== 0 ? `Command exited with code ${exitCode}` : `Command failed during launch or output capture${code ? ` (${code})` : ""}`;
	return Object.assign(new Error(message), {
		...code ? { code } : {},
		...exitCode !== void 0 ? { exitCode } : {},
		...signal ? { signal } : {}
	});
}
function isPlainCommandExitFailure(result) {
	return result.failed && typeof result.exitCode === "number" && result.exitCode !== 0 && result.signal === void 0 && result.cause === void 0 && !result.timedOut && !result.isCanceled && !result.isMaxBuffer && !result.isTerminated;
}
function isPlainCommandSignalFailure(result) {
	return result.failed && result.exitCode === void 0 && typeof result.signal === "string" && result.cause === void 0 && !result.timedOut && !result.isCanceled && !result.isMaxBuffer && result.isTerminated === true;
}
function resolveProcessExitCode(params) {
	return params.explicitCode ?? params.childExitCode ?? (params.usesWindowsExitCodeShim && params.resolvedSignal == null && !params.timedOut && !params.noOutputTimedOut && !params.killIssuedByTimeout && !params.killIssuedByAbort ? 0 : null);
}
//#endregion
export { isPlainCommandSignalFailure as a, isPlainCommandExitFailure as i, createSanitizedCommandError as n, resolveProcessExitCode as o, hasCommandProcessCleanupError as r, CommandProcessCleanupError as t };
