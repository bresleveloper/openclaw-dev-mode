import type { SessionEntry } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Resolve the display label that describes how a provider is authenticated. */
export declare function resolveModelAuthLabel(params: {
    provider?: string;
    cfg?: OpenClawConfig;
    sessionEntry?: Partial<Pick<SessionEntry, "authProfileOverride">>;
    agentDir?: string;
    workspaceDir?: string;
    includeExternalProfiles?: boolean;
    acceptedProviderIds?: readonly string[];
}): string | undefined;
