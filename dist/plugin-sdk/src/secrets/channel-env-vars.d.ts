import type { OpenClawConfig } from "../config/types.openclaw.js";
export { isSafeChannelEnvVarTriggerName } from "./channel-env-var-names.js";
type ChannelEnvVarLookupParams = {
    /** Config snapshot used to discover enabled/installed plugin manifests. */
    config?: OpenClawConfig;
    /** Workspace root used for local plugin metadata discovery. */
    workspaceDir?: string;
    /** Env snapshot used by metadata loading; defaults to process env. */
    env?: NodeJS.ProcessEnv;
};
/**
 * Resolves plugin-declared channel environment variable names keyed by channel id.
 * The result is deterministic so env-shell docs and prompt snapshots stay stable.
 */
export declare function resolveChannelEnvVars(params?: ChannelEnvVarLookupParams): Record<string, readonly string[]>;
/**
 * Returns the declared env var names for one channel id.
 */
export declare function getChannelEnvVars(channelId: string, params?: ChannelEnvVarLookupParams): string[];
/**
 * Lists every known channel env var name across installed plugin metadata.
 */
export declare function listKnownChannelEnvVarNames(params?: ChannelEnvVarLookupParams): string[];
