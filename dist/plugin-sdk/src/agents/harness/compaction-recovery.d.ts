/**
 * Native harness compaction recovery helpers.
 *
 * CLI compaction uses these guards to recognize thread-binding failures that can
 * fall back to context-engine compaction after clearing stale session bindings.
 */
import type { EmbeddedAgentCompactResult } from "../embedded-agent-runner/types.js";
/** Returns whether a native harness failure reason indicates a recoverable binding issue. */
export declare function isRecoverableNativeHarnessBindingReason(reason: unknown): boolean;
/** Returns whether a compact result failed due to a recoverable native binding issue. */
export declare function isRecoverableNativeHarnessBindingFailure(result: EmbeddedAgentCompactResult | undefined): boolean;
