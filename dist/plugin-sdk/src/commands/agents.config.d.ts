import { listAgentEntries } from "../agents/agent-scope.js";
import type { AgentIdentityFile } from "../agents/identity-file.js";
import type { IdentityConfig } from "../config/types.base.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
export type AgentSummary = {
    id: string;
    name?: string;
    identityName?: string;
    identityEmoji?: string;
    identitySource?: "identity" | "config";
    workspace: string;
    agentDir: string;
    model?: string;
    bindings: number;
    bindingDetails?: string[];
    routes?: string[];
    providers?: string[];
    isDefault: boolean;
};
type AgentEntry = NonNullable<NonNullable<OpenClawConfig["agents"]>["list"]>[number];
export type AgentIdentity = AgentIdentityFile;
export { listAgentEntries };
/** Find a configured agent entry by normalized id. */
export declare function findAgentEntryIndex(list: AgentEntry[], agentId: string): number;
/** Load non-empty identity metadata from a workspace identity file. */
export declare function loadAgentIdentity(workspace: string): AgentIdentity | null;
/** Build config-derived summaries for text/JSON agent listing. */
export declare function buildAgentSummaries(cfg: OpenClawConfig): AgentSummary[];
/** Add or update one agent entry while preserving the default-agent placeholder when needed. */
export declare function applyAgentConfig(cfg: OpenClawConfig, params: {
    agentId: string;
    name?: string;
    workspace?: string;
    agentDir?: string;
    model?: string;
    identity?: IdentityConfig;
}): OpenClawConfig;
/** Remove an agent and any config references that route or allow traffic to it. */
export declare function pruneAgentConfig(cfg: OpenClawConfig, agentId: string): {
    config: OpenClawConfig;
    removedBindings: number;
    removedAllow: number;
};
