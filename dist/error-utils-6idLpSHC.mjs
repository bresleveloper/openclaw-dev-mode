import { o as formatErrorMessage$1 } from "./error-coercion-C787aVxk.mjs";
import { b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
//#region packages/memory-host-sdk/src/host/error-utils.ts
/** Format memory-host errors through the canonical formatter and redaction policy. */
function formatErrorMessage(err) {
	return formatErrorMessage$1(err, { redact: redactToolPayloadText });
}
//#endregion
export { formatErrorMessage as t };
