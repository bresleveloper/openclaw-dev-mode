import "./utils-B-DHHhI2.js";
import { _ as formatErrorMessage$1, i as redactSensitiveText } from "./subsystem-CP45WUTs.js";
//#region src/infra/errors.ts
function formatErrorMessage(err) {
	return formatErrorMessage$1(err, { redact: redactSensitiveText });
}
//#endregion
export { formatErrorMessage as t };
