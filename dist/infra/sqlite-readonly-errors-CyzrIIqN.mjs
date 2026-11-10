import { f as redactSensitiveText, it as formatErrorMessage$1 } from "./sqlite-readonly-subsystem-DxzYbxOQ.mjs";
//#region src/infra/errors.ts
function formatErrorMessage(err) {
	return formatErrorMessage$1(err, { redact: redactSensitiveText });
}
//#endregion
export { formatErrorMessage as t };
