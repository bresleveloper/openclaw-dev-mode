import type { OpenClawConfig } from "../config/config.js";
export declare const DEFAULT_COMMITMENT_MAX_PER_HEARTBEAT = 3;
export declare const DEFAULT_COMMITMENT_EXPIRE_AFTER_HOURS = 72;
type ResolvedCommitmentsConfig = {
    enabled: boolean;
    maxPerDay: number;
    extraction: {
        debounceMs: number;
        batchMaxItems: number;
        queueMaxItems: number;
        confidenceThreshold: number;
        careConfidenceThreshold: number;
        timeoutSeconds: number;
    };
};
/** Resolves commitment extraction config with conservative defaults. */
export declare function resolveCommitmentsConfig(cfg?: OpenClawConfig): ResolvedCommitmentsConfig;
/** Resolves the timezone used when interpreting inferred commitment dates. */
export declare function resolveCommitmentTimezone(cfg?: OpenClawConfig): string;
export {};
