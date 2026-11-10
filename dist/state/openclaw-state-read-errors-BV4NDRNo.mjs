import { f as formatErrorMessage$1 } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { g as redactSensitiveText } from "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
//#region src/infra/errors.ts
function formatErrorMessage(err) {
	return formatErrorMessage$1(err, { redact: redactSensitiveText });
}
//#endregion
export { formatErrorMessage as t };
