import { type NormalizedUsage } from "../../agents/usage.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { incrementCompactionCount } from "./session-updates.js";
import { persistSessionUsageUpdate } from "./session-usage.js";
type PersistRunSessionUsageParams = Parameters<typeof persistSessionUsageUpdate>[0];
type IncrementRunCompactionCountParams = Omit<Parameters<typeof incrementCompactionCount>[0], "tokensAfter"> & {
    amount?: number;
    cfg?: OpenClawConfig;
    compactionTokensAfter?: number;
    lastCallUsage?: NormalizedUsage;
    contextTokensUsed?: number;
    newSessionId?: string;
    newSessionFile?: string;
};
/** Persists usage accounting for a completed reply run. */
export declare function persistRunSessionUsage(params: PersistRunSessionUsageParams): Promise<void>;
/** Increments compaction count and records the best known post-compaction token total. */
export declare function incrementRunCompactionCount(params: IncrementRunCompactionCountParams): Promise<number | undefined>;
export {};
