/**
 * Resolves transcript persistence policy for a single embedded-agent attempt.
 */
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import type { AgentRuntimePlan } from "../../runtime-plan/types.js";
import { type TranscriptPolicy } from "../../transcript-policy.js";
type AttemptRuntimeModelContext = NonNullable<Parameters<AgentRuntimePlan["transcript"]["resolvePolicy"]>[0]>;
/**
 * Resolves the transcript policy for an embedded attempt. RuntimePlan owns the
 * policy when present; otherwise the older provider/config/env resolver remains
 * the compatibility path for callers that have not produced a runtime plan yet.
 */
export declare function resolveAttemptTranscriptPolicy(params: {
    runtimePlan?: AgentRuntimePlan;
    runtimePlanModelContext: AttemptRuntimeModelContext;
    provider: string;
    modelId: string;
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): TranscriptPolicy;
export {};
