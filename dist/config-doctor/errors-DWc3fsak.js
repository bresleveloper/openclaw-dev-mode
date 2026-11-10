import "./runtime-doctor-migrations-Bq3PkBbD.js";
import { i as redactSensitiveText, v as formatErrorMessage$1 } from "./subsystem-CkEsEQPK.js";
//#region src/infra/errors.ts
function formatErrorMessage(err) {
	return formatErrorMessage$1(err, { redact: redactSensitiveText });
}
//#endregion
export { formatErrorMessage as t };
