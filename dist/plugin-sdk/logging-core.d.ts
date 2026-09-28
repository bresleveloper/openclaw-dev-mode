import { n as RuntimeEnv } from "../runtime-DlqUc5_p.js";
import { n as createSubsystemLogger } from "../subsystem-RmDRaRJV.js";
import { n as redactSensitiveText, r as redactToolPayloadText, t as redactSensitiveFieldValue } from "../redact-CMkWZvEP.js";
import { a as stopDiagnosticHeartbeat, i as startDiagnosticHeartbeat, n as logWebhookProcessed, r as logWebhookReceived, t as logWebhookError } from "../diagnostic-Bk73WzfR.js";
import { n as getChildLogger, o as LoggerSettings, t as LoggerResolvedSettings } from "../logger-CuvgFFqc.js";
//#region src/logger.d.ts
export declare function logInfo(message: string, runtime?: RuntimeEnv): void;
export declare function logError(message: string, runtime?: RuntimeEnv): void;
export declare function logDebug(message: string): void;
//#endregion
//#region packages/normalization-core/src/node-crypto.d.ts
/** Redacts an identifier to a stable hash label, or "-" for missing values. */
export declare function redactIdentifier(value: string | undefined, opts?: {
  len?: number;
}): string;
//#endregion
export { type LoggerResolvedSettings, type LoggerSettings, createSubsystemLogger, getChildLogger, logWebhookError, logWebhookProcessed, logWebhookReceived, redactSensitiveFieldValue, redactSensitiveText, redactToolPayloadText, startDiagnosticHeartbeat, stopDiagnosticHeartbeat };