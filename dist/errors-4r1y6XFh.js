import { c as redactSensitiveText } from "./redact-CQ2tlRRk.js";
import { s as configureAcpErrorRedactor } from "./errors-Cr5wPlui.js";
import "./src-lzPZ9DmH.js";
//#region src/acp/runtime/errors.ts
/** ACP runtime error exports wired to OpenClaw secret redaction. */
configureAcpErrorRedactor(redactSensitiveText);
//#endregion
export {};
