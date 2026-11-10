import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import "./diagnostic-events-C91J-XX8.mjs";
import "./subsystem-mStysHHC.mjs";
import "./diagnostic-llm-content-P2SGagoP.mjs";
//#region src/plugin-sdk/diagnostic-runtime.ts
const LOW_CARDINALITY_DIAGNOSTIC_VALUE_RE = /^[A-Za-z0-9_.:-]{1,120}$/u;
function normalizeDiagnosticValue(value, fallback = "unknown") {
	if (!value) return fallback;
	const redacted = redactSensitiveText(value.trim());
	const redactedLower = redacted.toLowerCase();
	if (redactedLower.startsWith("agent:") || redactedLower.includes(":agent:")) return fallback;
	return LOW_CARDINALITY_DIAGNOSTIC_VALUE_RE.test(redacted) ? redacted : fallback;
}
function normalizeDiagnosticLane(value, fallback = "unknown") {
	if (!value) return fallback;
	const redacted = redactSensitiveText(value.trim());
	if (redacted.toLowerCase().startsWith("agent:")) return fallback;
	const scopedLaneIndex = redacted.indexOf(":");
	const lane = scopedLaneIndex >= 0 ? redacted.slice(0, scopedLaneIndex) : redacted;
	return LOW_CARDINALITY_DIAGNOSTIC_VALUE_RE.test(lane) ? lane : fallback;
}
//#endregion
export { normalizeDiagnosticValue as n, normalizeDiagnosticLane as t };
