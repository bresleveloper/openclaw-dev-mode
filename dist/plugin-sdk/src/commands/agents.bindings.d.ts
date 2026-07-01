import type { AgentRouteBinding } from "../config/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ChannelChoice } from "./onboard-types.js";
export { describeBinding } from "./agents.binding-format.js";
/** Merge new route bindings into config while reporting adds, upgrades, skips, and conflicts. */
export declare function applyAgentBindings(cfg: OpenClawConfig, bindings: AgentRouteBinding[]): {
    config: OpenClawConfig;
    added: AgentRouteBinding[];
    updated: AgentRouteBinding[];
    skipped: AgentRouteBinding[];
    conflicts: Array<{
        binding: AgentRouteBinding;
        existingAgentId: string;
    }>;
};
/** Remove matching route bindings from config without disturbing non-route binding entries. */
export declare function removeAgentBindings(cfg: OpenClawConfig, bindings: AgentRouteBinding[]): {
    config: OpenClawConfig;
    removed: AgentRouteBinding[];
    missing: AgentRouteBinding[];
    conflicts: Array<{
        binding: AgentRouteBinding;
        existingAgentId: string;
    }>;
};
export declare function buildChannelBindings(params: {
    agentId: string;
    selection: ChannelChoice[];
    config: OpenClawConfig;
    accountIds?: Partial<Record<ChannelChoice, string>>;
}): AgentRouteBinding[];
export declare function parseBindingSpecs(params: {
    agentId: string;
    specs?: string[];
    config: OpenClawConfig;
}): {
    bindings: AgentRouteBinding[];
    errors: string[];
};
