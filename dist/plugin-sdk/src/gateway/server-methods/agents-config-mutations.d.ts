import type { IdentityConfig } from "../../config/types.base.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
export type AgentDeleteMutationResult = {
    workspaceDir: string;
    agentDir: string;
    sessionsDir: string;
    removedBindings: number;
};
/** Typed precondition failure surfaced by agent mutation handlers as gateway errors. */
export declare class AgentConfigPreconditionError extends Error {
    readonly kind: "already-exists" | "not-found";
    readonly agentId: string;
    constructor(kind: "already-exists" | "not-found", agentId: string);
}
/** Checks the current config snapshot for a concrete agent entry. */
export declare function isConfiguredAgent(cfg: OpenClawConfig, agentId: string): boolean;
/** Adds a new agent entry through the retrying config mutation path. */
export declare function createAgentConfigEntry(params: {
    agentId: string;
    name: string;
    workspace: string;
    model?: string;
    identity?: IdentityConfig;
    agentDir: string;
}): Promise<void>;
/** Updates an existing agent entry while preserving omitted fields. */
export declare function updateAgentConfigEntry(params: {
    agentId: string;
    name?: string;
    workspace?: string;
    model?: string;
    identity?: IdentityConfig;
}): Promise<void>;
/** Removes an agent entry and returns filesystem roots the caller should clean up. */
export declare function deleteAgentConfigEntry(params: {
    agentId: string;
}): Promise<{
    nextConfig: OpenClawConfig;
    result: AgentDeleteMutationResult | undefined;
}>;
