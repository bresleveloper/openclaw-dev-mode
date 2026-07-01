/**
 * Cleanup helper for subagent sessions. It deletes child session state through
 * the gateway and preserves lifecycle-hook behavior for session-mode spawns.
 */
import type { callGateway as defaultCallGateway } from "../gateway/call.js";
import type { SpawnSubagentMode } from "./subagent-spawn.types.js";
type CallGateway = typeof defaultCallGateway;
/** Deletes a child subagent session and optionally emits session-mode lifecycle hooks. */
export declare function deleteSubagentSessionForCleanup(params: {
    callGateway: CallGateway;
    childSessionKey: string;
    spawnMode?: SpawnSubagentMode;
    onError?: (error: unknown) => void;
}): Promise<void>;
export {};
