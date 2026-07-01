/**
 * Subagent spawn ownership resolver.
 *
 * Resolves which session controls spawn state, thread binding, and completion delivery.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
export type SubagentSpawnOwnership = {
    controllerSessionKey: string;
    threadBindingRequesterSessionKey: string;
    completionRequesterSessionKey: string;
    completionRequesterDisplayKey: string;
};
/** Normalizes requester/completion owner aliases into internal and display session keys. */
export declare function resolveSubagentSpawnOwnership(params: {
    cfg: OpenClawConfig;
    agentSessionKey?: string;
    completionOwnerKey?: string;
}): SubagentSpawnOwnership;
