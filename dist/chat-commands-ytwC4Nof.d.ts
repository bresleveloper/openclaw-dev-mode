import { M as OpenClawConfig } from "./types-D7I_F5Ux.js";
import { Q_ as ExecSessionDefaults, Z_ as ExecPolicyOverrides, n as SessionEntry } from "./config-contracts-CY87ANNp.js";
import { r as PluginMetadataSnapshot } from "./plugin-metadata-snapshot-C_ou8VB5.js";
import { n as SkillCommandSpec } from "./types-CeA70ktN.js";
//#region src/skills/discovery/chat-commands.d.ts
type WorkspaceSkillCommandParams = {
  workspaceDir: string;
  cfg: OpenClawConfig;
  agentId?: string;
  skillFilter?: string[];
  sessionEntry?: ExecSessionDefaults & Pick<SessionEntry, "skillLibrarySelections" | "skillsSnapshot">;
  sessionKey?: string;
  execOverrides?: ExecPolicyOverrides;
  includeAllowlistHidden?: boolean;
  pluginMetadataSnapshot?: PluginMetadataSnapshot;
};
/** @deprecated Await prepareSkillCommandsForWorkspace; final compatibility day: 2026-12-31. */
declare function listSkillCommandsForWorkspace(params: WorkspaceSkillCommandParams): SkillCommandSpec[];
declare function prepareSkillCommandsForWorkspace(params: WorkspaceSkillCommandParams, assertCurrent?: () => void): Promise<SkillCommandSpec[]>;
type AgentSkillCommandParams = {
  cfg: OpenClawConfig;
  agentIds?: string[];
  sessionEntry?: ExecSessionDefaults & Pick<SessionEntry, "skillLibrarySelections" | "skillsSnapshot">;
  sessionKey?: string;
  execOverrides?: ExecPolicyOverrides;
};
/** @deprecated Await prepareSkillCommandsForAgents; final compatibility day: 2026-12-31. */
declare function listSkillCommandsForAgents(params: AgentSkillCommandParams): SkillCommandSpec[];
declare function prepareSkillCommandsForAgents(params: AgentSkillCommandParams & {
  signal?: AbortSignal;
}): Promise<SkillCommandSpec[]>;
//#endregion
export { prepareSkillCommandsForWorkspace as i, listSkillCommandsForWorkspace as n, prepareSkillCommandsForAgents as r, listSkillCommandsForAgents as t };