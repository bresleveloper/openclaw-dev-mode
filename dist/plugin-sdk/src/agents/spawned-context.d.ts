import type { OpenClawConfig } from "../config/types.openclaw.js";
export type SpawnedRunMetadata = {
    spawnedBy?: string | null;
    groupId?: string | null;
    groupChannel?: string | null;
    groupSpace?: string | null;
    workspaceDir?: string | null;
};
export type SpawnedToolContext = {
    agentGroupId?: string | null;
    agentGroupChannel?: string | null;
    agentGroupSpace?: string | null;
    agentMemberRoleIds?: string[];
    workspaceDir?: string;
    inheritedToolAllowlist?: string[];
    inheritedToolDenylist?: string[];
};
type NormalizedSpawnedRunMetadata = {
    spawnedBy?: string;
    groupId?: string;
    groupChannel?: string;
    groupSpace?: string;
    workspaceDir?: string;
};
/** Normalize optional spawn metadata fields from persisted or tool-provided input. */
export declare function normalizeSpawnedRunMetadata(value?: SpawnedRunMetadata | null): NormalizedSpawnedRunMetadata;
/** Project tool runtime context down to the persisted spawned-run metadata shape. */
export declare function mapToolContextToSpawnedRunMetadata(value?: SpawnedToolContext | null): Pick<NormalizedSpawnedRunMetadata, "groupId" | "groupChannel" | "groupSpace" | "workspaceDir">;
/** Resolve which workspace a spawned run should inherit. */
export declare function resolveSpawnedWorkspaceInheritance(params: {
    config: OpenClawConfig;
    targetAgentId?: string;
    requesterSessionKey?: string;
    explicitWorkspaceDir?: string | null;
}): string | undefined;
/** Return a spawned run's ingress workspace override only for child runs. */
export declare function resolveIngressWorkspaceOverrideForSpawnedRun(metadata?: Pick<SpawnedRunMetadata, "spawnedBy" | "workspaceDir"> | null): string | undefined;
export {};
