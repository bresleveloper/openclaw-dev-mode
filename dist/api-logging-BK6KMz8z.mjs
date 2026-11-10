import { a as extractErrorCode, r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
//#region extensions/telegram/src/api-logging.ts
const fallbackLogger = createSubsystemLogger("telegram/api");
function formatTransportDiagnostics(error) {
	const fields = {};
	for (const candidate of collectErrorGraphCandidates(error, (current) => [
		current.cause,
		current.error,
		current.reason,
		...Array.isArray(current.errors) ? current.errors : []
	])) {
		const code = extractErrorCode(candidate);
		if (!fields.code && code && /^(?:E[A-Z0-9_]{1,63}|UND_ERR_[A-Z0-9_]{1,56})$/.test(code)) fields.code = code;
		const syscall = isRecord(candidate) ? candidate.syscall : void 0;
		if (!fields.syscall && typeof syscall === "string" && /^(?:connect|read|write|recv|send|recvfrom|sendto|getaddrinfo|getnameinfo)$/.test(syscall)) fields.syscall = syscall;
	}
	return fields.code || fields.syscall ? ` transport=${JSON.stringify(fields)}` : "";
}
async function withTelegramApiErrorLogging(params) {
	const { operation, fn, runtime, logger, shouldLog } = params;
	try {
		return await fn();
	} catch (err) {
		if (!shouldLog || shouldLog(err)) {
			const transport = formatTransportDiagnostics(err);
			const errText = transport ? `network request failed${transport}` : formatErrorMessage(err);
			(logger ?? runtime?.error ?? ((message) => fallbackLogger.error(message)))(`telegram ${operation} failed: ${errText}`);
		}
		throw err;
	}
}
//#endregion
export { withTelegramApiErrorLogging as t };
