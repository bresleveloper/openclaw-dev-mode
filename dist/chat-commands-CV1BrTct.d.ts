import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { k as SessionEntry } from "./reply-payload-DazZPys5.js";
import { v as PluginMetadataSnapshot } from "./io-CwO8iq4h.js";
import { No as ExecPolicyOverrides, Po as ExecSessionDefaults } from "./agent-harness-runtime-DZjstJNb.js";
import { n as SkillCommandSpec } from "./types-D0Cawybo.js";
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
/** Synchronous public SDK contract; remote workspace menus are deferred. */
declare function listSkillCommandsForWorkspace(params: WorkspaceSkillCommandParams): SkillCommandSpec[];
type AgentSkillCommandParams = {
  cfg: OpenClawConfig;
  agentIds?: string[];
  sessionEntry?: ExecSessionDefaults & Pick<SessionEntry, "skillLibrarySelections" | "skillsSnapshot">;
  sessionKey?: string;
  execOverrides?: ExecPolicyOverrides;
};
/** Synchronous public SDK contract for native command consumers. */
declare function listSkillCommandsForAgents(params: AgentSkillCommandParams): SkillCommandSpec[];
//#endregion
export { listSkillCommandsForWorkspace as n, listSkillCommandsForAgents as t };