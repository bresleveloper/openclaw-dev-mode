/**
 * Enforces source-managed provider secret ownership rules.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SecretDefaults } from "./models-config.providers.secrets.js";
/**
 * Reapplies source-managed secret markers to normalized provider config.
 *
 * This keeps runtime snapshots from materializing secret refs as plain values after config
 * normalization rewrites provider entries.
 */
type ModelsConfig = NonNullable<OpenClawConfig["models"]>;
/** Preserves source-managed apiKey/header markers from the original provider config. */
export declare function enforceSourceManagedProviderSecrets(params: {
    providers: ModelsConfig["providers"];
    sourceProviders: ModelsConfig["providers"] | undefined;
    sourceSecretDefaults?: SecretDefaults;
    secretRefManagedProviders?: Set<string>;
}): ModelsConfig["providers"];
export {};
