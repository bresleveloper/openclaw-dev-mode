import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Build a concise user-facing hint for recovering provider authentication. */
export declare function buildProviderAuthRecoveryHint(params: {
    provider: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    includeConfigure?: boolean;
    includeEnvVar?: boolean;
}): string;
