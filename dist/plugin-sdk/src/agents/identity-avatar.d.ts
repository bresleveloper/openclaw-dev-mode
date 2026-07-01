import type { OpenClawConfig } from "../config/types.openclaw.js";
export type AgentAvatarResolution = {
    kind: "none";
    reason: string;
    source?: string;
} | {
    kind: "local";
    filePath: string;
    source: string;
} | {
    kind: "remote";
    url: string;
    source: string;
} | {
    kind: "data";
    url: string;
    source: string;
};
type AgentAvatarPublicSourceInput = {
    kind: AgentAvatarResolution["kind"];
    source?: string | null;
};
/** Return a safe public description of the configured avatar source. */
export declare function resolvePublicAgentAvatarSource(resolved: AgentAvatarPublicSourceInput): string | undefined;
/** Resolve the effective avatar for an agent, including config and IDENTITY.md. */
export declare function resolveAgentAvatar(cfg: OpenClawConfig, agentId: string, opts?: {
    includeUiOverride?: boolean;
}): AgentAvatarResolution;
export {};
