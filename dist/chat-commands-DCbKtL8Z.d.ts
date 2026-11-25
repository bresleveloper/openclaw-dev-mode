import { Hl as ExecPolicyOverrides, Ul as ExecSessionDefaults, n as SessionEntry, pk as PluginMetadataSnapshot } from "./config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { n as SkillCommandSpec } from "./types-BLzNI-JA.js";
type WorkspaceSkillCommandParams = {
  workspaceDir: string;
  cfg: OpenClawConfig;
  agentId?: string;
  skillFilter?: string[];
  sessionEntry?: ExecSessionDefaults & Pick<SessionEntry, "skillLibrarySelections" | "skillsSnapshot" | "spawnedCwd" | "worktree" | "projectId">;
  sessionKey?: string;
  execOverrides?: ExecPolicyOverrides;
  includeAllowlistHidden?: boolean;
  pluginMetadataSnapshot?: PluginMetadataSnapshot;
  executionWorkspaceDir?: string;
  executionWorkspaceFileHost?: "gateway";
};
/** @deprecated Await prepareSkillCommandsForWorkspace; final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
declare function listSkillCommandsForWorkspace(params: WorkspaceSkillCommandParams): SkillCommandSpec[];
declare function prepareSkillCommandsForWorkspace(params: WorkspaceSkillCommandParams, assertCurrent?: () => void): Promise<SkillCommandSpec[]>;
type AgentSkillCommandParams = {
  cfg: OpenClawConfig;
  agentIds?: string[];
  sessionEntry?: ExecSessionDefaults & Pick<SessionEntry, "skillLibrarySelections" | "skillsSnapshot" | "spawnedCwd" | "worktree" | "projectId">;
  sessionKey?: string;
  execOverrides?: ExecPolicyOverrides;
  /** Admitted project root for a single-agent catalog; callers own its authorization. */
  executionWorkspaceDir?: string;
  executionWorkspaceFileHost?: "gateway";
};
/** @deprecated Await prepareSkillCommandsForAgents; final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
declare function listSkillCommandsForAgents(params: AgentSkillCommandParams): SkillCommandSpec[];
declare function prepareSkillCommandsForAgents(params: AgentSkillCommandParams & {
  signal?: AbortSignal;
}): Promise<SkillCommandSpec[]>;
export { prepareSkillCommandsForWorkspace as i, listSkillCommandsForWorkspace as n, prepareSkillCommandsForAgents as r, listSkillCommandsForAgents as t };