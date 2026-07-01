import { type ToolErrorSummary } from "../tool-error-summary.js";
import type { EmbeddedRunFailureSignal } from "./types.js";
/** Resolves fatal cron failure metadata from the last exec-like tool error, if applicable. */
export declare function resolveEmbeddedRunFailureSignal(params: {
    trigger?: string | undefined;
    lastToolError?: ToolErrorSummary | undefined;
}): EmbeddedRunFailureSignal | undefined;
