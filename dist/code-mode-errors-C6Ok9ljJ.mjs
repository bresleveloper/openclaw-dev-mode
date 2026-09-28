import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
//#region src/agents/code-mode-errors.ts
function isRuntimeInterruptedError(error) {
	return (error instanceof Error ? error.message : error) === "interrupted";
}
function codeModeFailureCode(error) {
	if (isRuntimeInterruptedError(error)) return "timeout";
	return error instanceof ToolInputError ? "invalid_input" : "internal_error";
}
function codeModeFailureMessage(error) {
	return isRuntimeInterruptedError(error) ? "code mode timeout exceeded" : formatErrorMessage(error);
}
function normalizeCodeModeTimeoutResult(result) {
	return result.status === "failed" && result.code === "timeout" && !String(result.error).includes("timeout exceeded") ? {
		...result,
		error: "code mode timeout exceeded"
	} : result;
}
var CodeModeHeadlessAbortError = class extends Error {
	constructor(message = "code mode execution aborted") {
		super(message);
		this.name = "CodeModeHeadlessAbortError";
	}
};
var CodeModeHeadlessTimeoutError = class extends Error {
	constructor(message = "code mode headless wall-clock timeout exceeded") {
		super(message);
		this.name = "CodeModeHeadlessTimeoutError";
	}
};
//#endregion
export { normalizeCodeModeTimeoutResult as a, codeModeFailureMessage as i, CodeModeHeadlessTimeoutError as n, codeModeFailureCode as r, CodeModeHeadlessAbortError as t };
