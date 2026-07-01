import type { OpenClawConfig } from "../config/types.openclaw.js";
/**
 * Collect enabled insecure/dangerous config flags for audit warnings and gateway tool previews.
 * Plugin flags use current metadata when requested, then fall back to resolving manifest contracts.
 */
export declare function collectEnabledInsecureOrDangerousFlags(cfg: OpenClawConfig, options?: {
    preferCurrentPluginMetadataSnapshot?: boolean;
}): string[];
