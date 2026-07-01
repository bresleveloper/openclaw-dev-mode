/** Detects legacy SecretRef env markers in config values. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type SecretRef } from "../config/types.secrets.js";
/** Legacy marker string found on a registered secret target, with parsed ref when possible. */
export type LegacySecretRefEnvMarkerCandidate = {
    path: string;
    pathSegments: string[];
    value: string;
    ref: SecretRef | null;
};
/**
 * Finds legacy env marker strings on registered secret targets without mutating config.
 */
export declare function collectLegacySecretRefEnvMarkerCandidates(config: OpenClawConfig): LegacySecretRefEnvMarkerCandidate[];
/**
 * Converts parseable legacy env marker strings into structured env SecretRef objects.
 */
export declare function migrateLegacySecretRefEnvMarkers(config: OpenClawConfig): {
    config: OpenClawConfig;
    changes: string[];
};
