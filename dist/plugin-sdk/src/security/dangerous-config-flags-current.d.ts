import type { OpenClawConfig } from "../config/types.openclaw.js";
/**
 * Collect dangerous flags using the gateway's current plugin metadata snapshot when it is complete.
 * Returns undefined when any configured plugin is missing so callers can use manifest discovery.
 */
export declare function collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot(cfg: OpenClawConfig): string[] | undefined;
