import { ot as truncateUtf16Safe } from "./redact-TLu2QTmL.mjs";
import { t as createSubsystemLogger } from "./subsystem-M2sQt_up.mjs";
//#region src/infra/env-log.runtime.ts
const log = createSubsystemLogger("env");
function formatEnvValue(value, redact) {
	if (redact) return "<redacted>";
	const singleLine = value.replace(/\s+/g, " ").trim();
	if (singleLine.length <= 160) return singleLine;
	return `${truncateUtf16Safe(singleLine, 160)}…`;
}
function logAcceptedEnvValue(key, value, description, redact) {
	log.info(`env: ${key}=${formatEnvValue(value, redact)} (${description})`);
}
//#endregion
export { logAcceptedEnvValue };
