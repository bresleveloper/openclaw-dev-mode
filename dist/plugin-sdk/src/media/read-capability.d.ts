import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { OutboundMediaAccess, OutboundMediaReadFile } from "./load-options.js";
type OutboundHostMediaPolicyContext = {
    sessionKey?: string;
    messageProvider?: string;
    groupId?: string | null;
    groupChannel?: string | null;
    groupSpace?: string | null;
    accountId?: string | null;
    requesterSenderId?: string | null;
    requesterSenderName?: string | null;
    requesterSenderUsername?: string | null;
    requesterSenderE164?: string | null;
};
/** Creates a host reader bound to the agent workspace and configured local-file safety checks. */
export declare function createAgentScopedHostMediaReadFile(params: {
    cfg: OpenClawConfig;
    agentId?: string;
    workspaceDir?: string;
} & OutboundHostMediaPolicyContext): OutboundMediaReadFile | undefined;
/** Resolves roots and optional host read capability for outbound media in an agent context. */
export declare function resolveAgentScopedOutboundMediaAccess(params: {
    cfg: OpenClawConfig;
    agentId?: string;
    mediaSources?: readonly string[];
    workspaceDir?: string;
    mediaAccess?: OutboundMediaAccess;
    mediaReadFile?: OutboundMediaReadFile;
} & OutboundHostMediaPolicyContext): OutboundMediaAccess;
export {};
