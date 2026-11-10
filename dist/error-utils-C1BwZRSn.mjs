import { s as formatErrorMessage$1 } from "./error-coercion-BwMr25F8.mjs";
import { u as redactToolPayloadText } from "./redact-BcXJu5HP.mjs";
//#region packages/memory-host-sdk/src/host/error-utils.ts
/** Format memory-host errors through the canonical formatter and redaction policy. */
function formatErrorMessage(err) {
	return formatErrorMessage$1(err, { redact: redactToolPayloadText });
}
//#endregion
export { formatErrorMessage as t };
