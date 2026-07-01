import type { AuthProfileCredential } from "../../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Controls how much auth provenance is shown in directive status output. */
export type ModelAuthDetailMode = "compact" | "verbose";
/** Resolves the displayed auth source for a provider without exposing secrets. */
export declare const resolveAuthLabel: (provider: string, cfg: OpenClawConfig, modelsPath: string, agentDir?: string, mode?: ModelAuthDetailMode, workspaceDir?: string, options?: {
    acceptedProfileTypes?: readonly AuthProfileCredential["type"][];
}) => Promise<{
    label: string;
    source: string;
}>;
/** Formats an auth label plus source for one-line status output. */
export declare const formatAuthLabel: (auth: {
    label: string;
    source: string;
}) => string;
