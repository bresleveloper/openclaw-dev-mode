import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
//#region src/logging/code-mode-diagnostic.ts
const MAX_NAMES = 24;
const MAX_NAME_LENGTH = 80;
const failureLog = createSubsystemLogger("agents/code-mode");
/** Record the producer's cause before guest projection or output budgeting. */
function logCodeModeFailure(error, context) {
	const cause = error instanceof Error && error.cause instanceof Error ? error.cause : error;
	const record = isRecord(cause) ? cause : void 0;
	const name = cause instanceof Error ? cause.name : record?.name;
	const message = cause instanceof Error ? cause.message : record?.message;
	const stack = cause instanceof Error ? cause.stack : record?.stack;
	failureLog.error("Code Mode execution failed", {
		...context,
		errorName: typeof name === "string" ? name : "Error",
		errorCode: typeof record?.code === "string" ? record.code : void 0,
		error: typeof message === "string" ? message : formatErrorMessage(error),
		stack: typeof stack === "string" ? stack.split("\n").slice(0, 12).join("\n") : void 0
	});
}
function isCodeModeDiagnosticEnabled() {
	return isTruthyEnvValue(process.env.OPENCLAW_DEBUG_CODE_MODE);
}
function logCodeModeDiagnostic(log, boundary, fields) {
	if (!isCodeModeDiagnosticEnabled()) return;
	const bounded = Object.fromEntries(Object.entries(fields).map(([key, value]) => {
		if (Array.isArray(value)) {
			const names = [...new Set(value.map((name) => name.slice(0, MAX_NAME_LENGTH)))];
			names.sort((left, right) => left.localeCompare(right));
			return [key, names.slice(0, MAX_NAMES)];
		}
		return [key, typeof value === "string" ? value.slice(0, MAX_NAME_LENGTH) : value];
	}));
	log.info(`code-mode diagnostic ${JSON.stringify({
		boundary,
		...bounded
	})}`);
}
//#endregion
export { logCodeModeDiagnostic as n, logCodeModeFailure as r, isCodeModeDiagnosticEnabled as t };
