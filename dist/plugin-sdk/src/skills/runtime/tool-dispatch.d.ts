import type { AnyAgentTool } from "../../agents/agent-tools.types.js";
import type { SessionEntry } from "../../config/sessions.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SkillCommandSpec } from "../types.js";
type SkillDispatchMessageContext = {
    surface?: string;
    provider?: string;
    accountId?: string;
    senderId?: string;
    senderName?: string;
    senderUsername?: string;
    senderE164?: string;
    originatingTo?: string;
    to?: string;
    messageThreadId?: string | number;
    memberRoleIds?: string[];
};
/**
 * Policy-enforcement seam for skill `command-dispatch: tool` invocations.
 * Keep this aligned with the normal tool surfaces so GHSA-mhm4-93fw-4qr2
 * stays closed across allow/deny, group, sandbox, and subagent policy layers.
 */
export declare function resolveSkillDispatchTools(params: {
    message: SkillDispatchMessageContext;
    cfg: OpenClawConfig;
    agentId: string;
    agentDir?: string;
    sessionEntry?: SessionEntry;
    sessionKey: string;
    workspaceDir: string;
    provider: string;
    model: string;
    senderId?: string;
    currentChannelId?: string;
    skillCommand?: Pick<SkillCommandSpec, "name" | "skillName" | "skillSource"> & {
        toolName?: string;
    };
    groupId?: string;
}): AnyAgentTool[];
export {};
