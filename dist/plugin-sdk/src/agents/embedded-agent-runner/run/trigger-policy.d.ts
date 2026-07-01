/**
 * Resolves trigger-specific prompt injection behavior.
 */
import type { EmbeddedRunTrigger } from "./params.js";
/**
 * Decides whether a run trigger should add the heartbeat-specific prompt
 * instruction. Unknown or omitted triggers fall back to the user-prompt shape
 * so non-heartbeat runs do not get scheduler wording.
 */
export declare function shouldInjectHeartbeatPromptForTrigger(trigger?: EmbeddedRunTrigger): boolean;
