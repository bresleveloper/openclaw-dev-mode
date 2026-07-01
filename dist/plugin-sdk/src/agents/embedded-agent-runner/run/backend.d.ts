import type { EmbeddedRunAttemptParams, EmbeddedRunAttemptResult } from "./types.js";
/**
 * Backend bridge for executing one embedded-agent attempt through the selected harness.
 */
export declare function runEmbeddedAttemptWithBackend(params: EmbeddedRunAttemptParams): Promise<EmbeddedRunAttemptResult>;
