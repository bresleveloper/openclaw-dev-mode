/**
 * Runtime-only owner display secret retention for config IO.
 * Generated secrets stay in memory by config path and are never written back into config files.
 */
import type { OpenClawConfig } from "./types.openclaw.js";
/** Runtime-only owner display secrets keyed by config path during config IO. */
export type OwnerDisplaySecretRuntimeState = {
    pendingByPath: Map<string, string>;
};
/** Retains generated owner display secrets in memory without persisting them into config. */
export declare function retainGeneratedOwnerDisplaySecret(params: {
    config: OpenClawConfig;
    configPath: string;
    generatedSecret?: string;
    state: OwnerDisplaySecretRuntimeState;
}): OpenClawConfig;
