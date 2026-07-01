import { SILENT_REPLY_TOKEN } from "../../../auto-reply/tokens.js";
import type { EmbeddedRunLivenessState } from "../types.js";
import type { EmbeddedRunAttemptResult } from "./types.js";
type ReplayMetadataAttempt = Pick<EmbeddedRunAttemptResult, "toolMetas" | "didSendViaMessagingTool" | "messagingToolSentTexts" | "messagingToolSentMediaUrls" | "successfulCronAdds"> & Partial<Pick<EmbeddedRunAttemptResult, "messagingToolSentTargets" | "acceptedSessionSpawns">>;
type IncompleteTurnAttempt = Pick<EmbeddedRunAttemptResult, "assistantTexts" | "clientToolCalls" | "currentAttemptAssistant" | "yieldDetected" | "didSendDeterministicApprovalPrompt" | "heartbeatToolResponse" | "toolMediaUrls" | "toolAudioAsVoice" | "toolTrustedLocalMedia" | "hasToolMediaBlockReply" | "didDeliverSourceReplyViaMessageTool" | "messagingToolSourceReplyPayloads" | "didSendViaMessagingTool" | "messagingToolSentTexts" | "messagingToolSentMediaUrls" | "messagingToolSentTargets" | "lastToolError" | "lastAssistant" | "itemLifecycle" | "replayMetadata" | "promptErrorSource" | "timedOutDuringCompaction" | "toolMetas"> & Partial<Pick<EmbeddedRunAttemptResult, "acceptedSessionSpawns">>;
type SilentToolResultAttempt = Pick<EmbeddedRunAttemptResult, "clientToolCalls" | "yieldDetected" | "didSendDeterministicApprovalPrompt" | "lastToolError" | "messagesSnapshot" | "toolMetas">;
type RunLivenessAttempt = Pick<EmbeddedRunAttemptResult, "lastAssistant" | "promptErrorSource" | "replayMetadata" | "timedOutDuringCompaction">;
export declare function isIncompleteTerminalAssistantTurn(params: {
    hasAssistantVisibleText: boolean;
    hasTerminalOutput?: boolean;
    lastAssistant?: {
        stopReason?: string;
    } | null;
}): boolean;
export declare const DEFAULT_REASONING_ONLY_RETRY_LIMIT = 2;
export declare const DEFAULT_EMPTY_RESPONSE_RETRY_LIMIT = 1;
export declare const REASONING_ONLY_RETRY_INSTRUCTION = "The previous assistant turn recorded reasoning but did not produce a user-visible answer. Continue from that partial turn and produce the visible answer now. Do not restate the reasoning or restart from scratch.";
export declare const EMPTY_RESPONSE_RETRY_INSTRUCTION = "The previous attempt did not produce a user-visible answer. Continue from the current state and produce the visible answer now. Do not restart from scratch.";
/**
 * Marks whether retrying the attempt can safely replay the prompt. Concrete
 * tool-instance policy, async work, committed delivery, spawned sessions, and
 * cron writes all contribute side-effect evidence.
 */
export declare function buildAttemptReplayMetadata(params: ReplayMetadataAttempt): EmbeddedRunAttemptResult["replayMetadata"];
/** Falls back to replay-unsafe metadata when older attempt records lack replay details. */
export declare function resolveAttemptReplayMetadata(attempt: {
    replayMetadata?: EmbeddedRunAttemptResult["replayMetadata"] | null;
}): EmbeddedRunAttemptResult["replayMetadata"];
type TerminalAttemptState = Pick<EmbeddedRunAttemptResult, "clientToolCalls" | "yieldDetected" | "didSendDeterministicApprovalPrompt" | "heartbeatToolResponse" | "lastToolError" | "toolMediaUrls" | "toolAudioAsVoice" | "toolTrustedLocalMedia" | "hasToolMediaBlockReply" | "didDeliverSourceReplyViaMessageTool" | "messagingToolSourceReplyPayloads" | "successfulCronAdds"> & Partial<Pick<EmbeddedRunAttemptResult, "acceptedSessionSpawns" | "messagingToolSentTexts" | "messagingToolSentMediaUrls" | "messagingToolSentTargets">> & {
    toolMetas?: readonly {
        asyncStarted?: boolean;
    }[];
};
export declare function hasAttemptTerminalState(attempt: TerminalAttemptState): boolean;
/**
 * Builds the user-visible incomplete-turn warning when a terminal attempt did
 * not produce a safe final assistant response and no committed delivery/progress
 * already completed the task.
 */
export declare function resolveIncompleteTurnPayloadText(params: {
    payloadCount: number;
    aborted: boolean;
    externalAbort: boolean;
    timedOut: boolean;
    attempt: IncompleteTurnAttempt;
}): string | null;
/**
 * Allows one retry when the provider returned no assistant turn at all and the
 * attempt has no side effects, active lifecycle items, delivery, or terminal
 * assistant/tool state.
 */
export declare function shouldRetryMissingAssistantTurn(params: {
    payloadCount: number;
    aborted: boolean;
    promptError?: unknown;
    timedOut: boolean;
    attempt: IncompleteTurnAttempt;
}): boolean;
/** Emits the silent-reply token for cron turns whose last successful tool result is silent. */
export declare function resolveSilentToolResultReplyPayload(params: {
    isCronTrigger: boolean;
    payloadCount: number;
    aborted: boolean;
    timedOut: boolean;
    attempt: SilentToolResultAttempt;
}): {
    text: typeof SILENT_REPLY_TOKEN;
} | null;
/**
 * Marks replay invalid whenever the recorded attempt might not be safe to
 * replay or the current run ended in a compaction/incomplete-turn state that
 * needs a fresh prompt boundary.
 */
export declare function resolveReplayInvalidFlag(params: {
    attempt: RunLivenessAttempt;
    incompleteTurnText?: string | null;
}): boolean;
/** Classifies the persisted run state used by session recovery and resume logic. */
export declare function resolveRunLivenessState(params: {
    payloadCount: number;
    aborted: boolean;
    timedOut: boolean;
    attempt: RunLivenessAttempt;
    incompleteTurnText?: string | null;
}): EmbeddedRunLivenessState;
export declare function shouldRetrySilentErrorAssistantTurn(params: {
    attempt: Pick<EmbeddedRunAttemptResult, "assistantTexts" | "clientToolCalls" | "yieldDetected" | "didSendDeterministicApprovalPrompt" | "heartbeatToolResponse" | "lastToolError" | "toolMediaUrls" | "toolAudioAsVoice" | "toolTrustedLocalMedia" | "didDeliverSourceReplyViaMessageTool" | "messagingToolSourceReplyPayloads" | "replayMetadata">;
    assistant: EmbeddedRunAttemptResult["lastAssistant"] | null | undefined;
}): boolean;
/** Allows configured silent handling for replay-safe empty, reasoning-only, or explicit silent turns. */
export declare function shouldTreatEmptyAssistantReplyAsSilent(params: {
    allowEmptyAssistantReplyAsSilent?: boolean;
    payloadCount: number;
    aborted: boolean;
    timedOut: boolean;
    attempt: IncompleteTurnAttempt;
}): boolean;
/**
 * Builds the retry instruction for reasoning-only turns that consumed provider
 * output budget but produced no visible assistant text.
 */
export declare function resolveReasoningOnlyRetryInstruction(params: {
    provider?: string;
    modelId?: string;
    modelApi?: string;
    executionContract?: string;
    aborted: boolean;
    timedOut: boolean;
    attempt: IncompleteTurnAttempt;
}): string | null;
/**
 * Builds the retry instruction for empty assistant turns when the provider/model
 * is eligible for non-visible turn recovery.
 */
export declare function resolveEmptyResponseRetryInstruction(params: {
    provider?: string;
    modelId?: string;
    modelApi?: string;
    executionContract?: string;
    payloadCount: number;
    aborted: boolean;
    timedOut: boolean;
    attempt: IncompleteTurnAttempt;
}): string | null;
export {};
