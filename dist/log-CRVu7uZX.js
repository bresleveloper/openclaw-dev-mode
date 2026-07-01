import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import crypto from "node:crypto";
//#region src/agents/cli-runner/log.ts
/**
* Shared logging helpers for CLI backend diagnostics.
*/
/** Subsystem logger for CLI backend execution diagnostics. */
const cliBackendLog = createSubsystemLogger("agent/cli-backend");
/** Env var that enables CLI backend output logging. */
const CLI_BACKEND_LOG_OUTPUT_ENV = "OPENCLAW_CLI_BACKEND_LOG_OUTPUT";
/** Legacy env var accepted for Claude CLI output logging. */
const LEGACY_CLAUDE_CLI_LOG_OUTPUT_ENV = "OPENCLAW_CLAUDE_CLI_LOG_OUTPUT";
/** Return a compact byte/hash summary for CLI backend output. */
function formatCliBackendOutputDigest(text) {
	return `outBytes=${Buffer.byteLength(text, "utf8")} outHash=${crypto.createHash("sha256").update(text).digest("hex").slice(0, 12)}`;
}
//#endregion
export { formatCliBackendOutputDigest as i, LEGACY_CLAUDE_CLI_LOG_OUTPUT_ENV as n, cliBackendLog as r, CLI_BACKEND_LOG_OUTPUT_ENV as t };
