/** Subsystem logger for CLI backend execution diagnostics. */
export declare const cliBackendLog: import("../../logging/subsystem.js").SubsystemLogger;
/** Env var that enables CLI backend output logging. */
export declare const CLI_BACKEND_LOG_OUTPUT_ENV = "OPENCLAW_CLI_BACKEND_LOG_OUTPUT";
/** Legacy env var accepted for Claude CLI output logging. */
export declare const LEGACY_CLAUDE_CLI_LOG_OUTPUT_ENV = "OPENCLAW_CLAUDE_CLI_LOG_OUTPUT";
/** Return a compact byte/hash summary for CLI backend output. */
export declare function formatCliBackendOutputDigest(text: string): string;
