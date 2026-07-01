import type { OpenClawConfig } from "../../config/types.openclaw.js";
export { createAgentToAgentPolicy, createSessionVisibilityGuard, createSessionVisibilityRowChecker, resolveEffectiveSessionToolsVisibility, } from "../../plugin-sdk/session-visibility.js";
/** Resolves the requester context used to filter sandboxed session-tool access. */
export declare function resolveSandboxedSessionToolContext(params: {
    cfg: OpenClawConfig;
    agentSessionKey?: string;
    sandboxed?: boolean;
}): {
    mainKey: string;
    alias: string;
    visibility: "spawned" | "all";
    requesterInternalKey: string | undefined;
    effectiveRequesterKey: string;
    restrictToSpawned: boolean;
};
