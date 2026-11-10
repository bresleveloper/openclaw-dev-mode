import { dt as formatErrorMessage$1, r as redactSensitiveText } from "./redact-tYkqLD33.mjs";
//#region src/infra/errors.ts
function formatErrorMessage(err) {
	return formatErrorMessage$1(err, { redact: redactSensitiveText });
}
function formatErrorMessageWithCode(err) {
	return formatErrorMessage$1(err, {
		includeCode: true,
		redact: redactSensitiveText
	});
}
//#endregion
export { formatErrorMessageWithCode as n, formatErrorMessage as t };
