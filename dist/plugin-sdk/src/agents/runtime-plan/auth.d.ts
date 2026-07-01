/**
 * Builds auth forwarding decisions for prepared runtime plans. Provider aliases
 * and harness auth owners are resolved before session auth profiles can be
 * safely forwarded.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { PluginMetadataSnapshot } from "../../plugins/plugin-metadata-snapshot.types.js";
import type { AgentRuntimeAuthPlan } from "./types.js";
/** Builds the auth forwarding plan for one resolved agent runtime. */
export declare function buildAgentRuntimeAuthPlan(params: {
    provider: string;
    authProfileProvider?: string;
    authProfileMode?: string;
    sessionAuthProfileId?: string;
    sessionAuthProfileCandidateIds?: string[];
    config?: OpenClawConfig;
    workspaceDir?: string;
    metadataSnapshot?: Pick<PluginMetadataSnapshot, "plugins">;
    providerAuthAliasesEnabled?: boolean;
    harnessId?: string;
    harnessRuntime?: string;
    allowHarnessAuthProfileForwarding?: boolean;
}): AgentRuntimeAuthPlan;
