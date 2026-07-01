/**
 * Resolves per-attempt runtime decisions from config and channel context.
 */
import type { OpenClawConfig } from "../../../config/config.js";
import type { EmbeddedRunAttemptParams } from "./types.js";
/**
 * Builds the session write-lock timing for a live embedded attempt. The lock is
 * capped by compaction time because cleanup may keep writing after model abort,
 * but should not inherit the much larger full run timeout.
 */
export declare function resolveEmbeddedAttemptSessionWriteLockOptions(params: {
    config?: OpenClawConfig;
    compactionTimeoutMs: number;
    env?: NodeJS.ProcessEnv;
}): {
    timeoutMs: number;
    staleMs: number;
    maxHoldMs: number;
};
/**
 * Returns the auth profile id that should be attached to model-stream
 * provenance. Only runtime-forwarded ids are exposed; raw request auth ids can
 * represent local caller state rather than provider-visible credentials.
 */
export declare function resolveAttemptStreamAuthProfileId(params: Pick<EmbeddedRunAttemptParams, "authProfileId" | "runtimePlan">): string | undefined;
/**
 * Resolves the consecutive unknown-tool threshold for the provider stream
 * guard. The guard remains active even when generic loop detection is disabled
 * because an unregistered tool call is an objective dead end for this run.
 */
export declare function resolveUnknownToolGuardThreshold(loopDetection?: {
    enabled?: boolean;
    unknownToolThreshold?: number;
}): number;
/**
 * Skips `llm_output` hooks only when `before_agent_run` blocked the prompt
 * before any model submission; later prompt errors can still have model output
 * or tool state that downstream hooks need to observe.
 */
export declare function shouldRunLlmOutputHooksForAttempt(params: {
    promptErrorSource: string | null;
}): boolean;
/**
 * Chooses the provider label used by tool-policy messages. Message providers
 * are more specific than transport channels, while channel remains the fallback
 * for older callers that do not split those concepts.
 */
export declare function resolveAttemptToolPolicyMessageProvider(params: {
    messageProvider?: string;
    messageChannel?: string;
}): string | undefined;
