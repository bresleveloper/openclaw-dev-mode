import type { OpenClawConfig } from "../config/config.js";
import type { MemoryPluginPublicArtifact } from "../plugins/memory-state.js";
export * from "./memory-core-host-runtime-core.js";
/** Lists public memory artifacts for one workspace, including notes and event logs. */
export declare function listMemoryWorkspacePublicArtifacts(params: {
    workspaceDir: string;
    agentIds: string[];
}): Promise<MemoryPluginPublicArtifact[]>;
/** Lists public memory artifacts across all configured memory workspaces. */
export declare function listMemoryHostPublicArtifacts(params: {
    cfg: OpenClawConfig;
}): Promise<MemoryPluginPublicArtifact[]>;
