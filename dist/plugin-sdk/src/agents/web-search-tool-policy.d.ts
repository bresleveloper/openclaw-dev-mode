import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SandboxToolPolicy } from "./sandbox.js";
export type WebSearchToolPolicyParams = {
    config?: OpenClawConfig;
    modelProvider?: string;
    modelId?: string;
    agentId?: string;
    sessionKey?: string;
    sandboxToolPolicy?: SandboxToolPolicy;
    messageProvider?: string;
    agentAccountId?: string | null;
    groupId?: string | null;
    groupChannel?: string | null;
    groupSpace?: string | null;
    spawnedBy?: string | null;
    senderId?: string | null;
    senderName?: string | null;
    senderUsername?: string | null;
    senderE164?: string | null;
};
type WebSearchToolPolicyResolution = {
    allowed: boolean;
    persistentAllowed: boolean;
};
/** Resolves current and sender-independent policy for the managed web_search tool. */
export declare function resolveWebSearchToolPolicy(params: WebSearchToolPolicyParams): WebSearchToolPolicyResolution;
export {};
