import { c as redactSensitiveText } from "./redact-B9QQ4Wyz.js";
import { s as configureAcpErrorRedactor } from "./errors-B427VheH.js";
import "./src-B1_yUTPt.js";
//#region src/acp/runtime/errors.ts
/** ACP runtime error exports wired to OpenClaw secret redaction. */
configureAcpErrorRedactor(redactSensitiveText);
//#endregion
export {};
