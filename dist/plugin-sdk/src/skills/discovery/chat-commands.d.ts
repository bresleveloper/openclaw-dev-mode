import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SkillCommandSpec } from "../types.js";
export { listReservedChatSlashCommandNames, resolveSkillCommandInvocation, } from "./chat-command-invocation.js";
export declare function listSkillCommandsForWorkspace(params: {
    workspaceDir: string;
    cfg: OpenClawConfig;
    agentId?: string;
    skillFilter?: string[];
}): SkillCommandSpec[];
declare function dedupeBySkillName(commands: SkillCommandSpec[]): SkillCommandSpec[];
export declare function listSkillCommandsForAgents(params: {
    cfg: OpenClawConfig;
    agentIds?: string[];
}): SkillCommandSpec[];
export declare const testing: {
    dedupeBySkillName: typeof dedupeBySkillName;
};
export { testing as __testing };
