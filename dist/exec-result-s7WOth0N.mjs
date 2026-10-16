import { r as collectNestedErrorCandidates, u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/process/exec-result.ts
const commandCleanupUncertain = Symbol.for("openclaw.command-cleanup-uncertain");
const commandCleanupMessage = "Command cleanup could not confirm that owned work stopped";
function isCanonicalCommandProcessCleanupError(candidate) {
	try {
		return Object.getOwnPropertyDescriptor(candidate, commandCleanupUncertain)?.value === true;
	} catch {
		return false;
	}
}
/** An admitted command may still write; callers must retain its artifacts for recovery. */
var CommandProcessCleanupError = class extends Error {
	constructor(options) {
		let message = commandCleanupMessage;
		for (const candidate of collectNestedErrorCandidates(options?.cause)) {
			if (!isCanonicalCommandProcessCleanupError(candidate)) continue;
			try {
				const detail = Object.getOwnPropertyDescriptor(candidate, "message")?.value;
				if (typeof detail === "string" && detail.trim() && detail !== commandCleanupMessage) {
					message = detail;
					break;
				}
			} catch {}
		}
		super(message, options);
		this.code = "ERR_COMMAND_PROCESS_CLEANUP_UNCERTAIN";
		this.cleanup = "uncertain";
		this.name = "CommandProcessCleanupError";
		Object.defineProperty(this, commandCleanupUncertain, { value: true });
	}
};
/** Preserve canonical cleanup classification across cause chains and module copies. */
function hasCommandProcessCleanupError(error) {
	return collectNestedErrorCandidates(error).some(isCanonicalCommandProcessCleanupError);
}
const commandFailureOutcome = Symbol.for("openclaw.command-process-outcome");
/** Lifecycle facts stay private; callers retain the original error and its diagnostics. */
function recordCommandProcessFailure(error, outcome) {
	const failure = toErrorObject(error, "Command failed");
	const target = Object.isExtensible(failure) ? failure : new Error(failure.message, { cause: failure });
	return Object.defineProperty(target, commandFailureOutcome, {
		value: Object.freeze({ ...outcome }),
		configurable: true
	});
}
function readCommandProcessFailure(error) {
	for (const cause of collectNestedErrorCandidates(error)) try {
		const outcome = isRecord(cause) ? Object.getOwnPropertyDescriptor(cause, commandFailureOutcome)?.value : void 0;
		if (isRecord(outcome) && (outcome.pid === void 0 || typeof outcome.pid === "number" && Number.isSafeInteger(outcome.pid) && outcome.pid > 0) && (outcome.code === null || typeof outcome.code === "number") && (outcome.inputReleased === void 0 || typeof outcome.inputReleased === "boolean") && (outcome.cleanup === void 0 || outcome.cleanup === "normal" || outcome.cleanup === "cooperative" || outcome.cleanup === "forced" || outcome.cleanup === "uncertain") && (outcome.termination === "exit" || outcome.termination === "signal" || outcome.termination === "timeout" || outcome.termination === "no-output-timeout")) return {
			pid: outcome.pid,
			code: outcome.code,
			cleanup: outcome.cleanup,
			termination: outcome.termination,
			inputReleased: outcome.inputReleased
		};
	} catch {
		return;
	}
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
export { isPlainCommandSignalFailure as a, resolveProcessExitCode as c, isPlainCommandExitFailure as i, createSanitizedCommandError as n, readCommandProcessFailure as o, hasCommandProcessCleanupError as r, recordCommandProcessFailure as s, CommandProcessCleanupError as t };
