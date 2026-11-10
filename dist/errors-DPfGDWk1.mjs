import { a as extractErrorCode, s as formatErrorMessage$1 } from "./error-coercion-BwMr25F8.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import "./errno-FR4CRyya.mjs";
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
