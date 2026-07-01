import type { ToolExecutorRef } from "./types.js";
/**
 * Formatting helpers for tool executor references.
 *
 * Executor refs are closed discriminated unions; the formatted string is for
 * diagnostics/logging and must not become a parser contract.
 */
/** Render an executor ref as a compact diagnostic label. */
export declare function formatToolExecutorRef(ref: ToolExecutorRef): string;
