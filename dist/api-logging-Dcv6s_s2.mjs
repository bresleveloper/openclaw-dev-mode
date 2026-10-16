import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./runtime-env-BjPzo7IN.mjs";
//#region extensions/telegram/src/api-logging.ts
const fallbackLogger = createSubsystemLogger("telegram/api");
async function withTelegramApiErrorLogging({ operation, fn, runtime, logger, shouldLog }) {
	try {
		return await fn();
	} catch (err) {
		if (!shouldLog || shouldLog(err)) {
			const errText = formatErrorMessage(err);
			(logger ?? runtime?.error ?? ((message) => fallbackLogger.error(message)))(`telegram ${operation} failed: ${errText}`);
		}
		throw err;
	}
}
//#endregion
export { withTelegramApiErrorLogging as t };
