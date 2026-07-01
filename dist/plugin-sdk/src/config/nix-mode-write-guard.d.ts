/** Agent-first Nix install docs shown when runtime config writes are blocked. */
export declare const NIX_OPENCLAW_AGENT_FIRST_URL = "https://github.com/openclaw/nix-openclaw#quick-start";
/** Public OpenClaw Nix overview shown with immutable-config errors. */
export declare const OPENCLAW_NIX_OVERVIEW_URL = "https://docs.openclaw.ai/install/nix";
/** Error thrown when a mutating config path is attempted while Nix owns config state. */
export declare class NixModeConfigMutationError extends Error {
    readonly code = "OPENCLAW_NIX_MODE_CONFIG_IMMUTABLE";
    constructor(params?: {
        configPath?: string;
    });
}
/** Build the operator-facing immutable-config message for Nix-managed installs. */
export declare function formatNixModeConfigMutationMessage(params?: {
    configPath?: string;
}): string;
/** Throw when the current environment marks OpenClaw config as Nix-managed and immutable. */
export declare function assertConfigWriteAllowedInCurrentMode(params?: {
    configPath?: string;
    env?: NodeJS.ProcessEnv;
}): void;
