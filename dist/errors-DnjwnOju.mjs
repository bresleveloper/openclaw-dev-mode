import { i as extractErrorCode, o as formatErrorMessage$1 } from "./error-coercion-C787aVxk.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
//#region src/infra/errors.ts
function readErrorCause(error) {
	if (!error || typeof error !== "object") return;
	return error.cause;
}
function formatErrorMessage(err) {
	return formatErrorMessage$1(err, { redact: redactSensitiveText });
}
function formatErrorMessageWithCode(err) {
	return formatErrorMessage$1(err, {
		includeCode: true,
		redact: redactSensitiveText
	});
}
function formatUncaughtError(err) {
	if (extractErrorCode(err) === "INVALID_CONFIG") return formatErrorMessage(err);
	if (err instanceof Error) {
		const stack = err.stack ?? err.message ?? err.name;
		return redactSensitiveText(stack);
	}
	return formatErrorMessage(err);
}
//#endregion
export { readErrorCause as i, formatErrorMessageWithCode as n, formatUncaughtError as r, formatErrorMessage as t };
