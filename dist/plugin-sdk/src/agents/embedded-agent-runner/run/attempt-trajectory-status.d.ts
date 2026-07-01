/**
 * Resolves terminal attempt trajectory status and assistant-visible text.
 */
import { type AcceptedSessionSpawn } from "../../accepted-session-spawn.js";
type AttemptTrajectoryTerminalStatus = "success" | "error" | "interrupted";
/** Terminal error marker for runs that produced no user-visible delivery or durable progress. */
export declare const NON_DELIVERABLE_TERMINAL_TURN_REASON = "non_deliverable_terminal_turn";
/** Normalized terminal status recorded for an embedded run attempt trajectory. */
type AttemptTrajectoryTerminal = {
    status: AttemptTrajectoryTerminalStatus;
    terminalError?: typeof NON_DELIVERABLE_TERMINAL_TURN_REASON;
};
/** Signals that decide whether a completed run attempt has deliverable output. */
export type ResolveAttemptTrajectoryTerminalParams = {
    promptError?: unknown;
    aborted: boolean;
    externalAbort: boolean;
    timedOut: boolean;
    assistantTexts: string[];
    toolMetas: Array<{
        toolName: string;
        meta?: string;
        asyncStarted?: boolean;
        asyncTaskRunId?: string;
        asyncTaskId?: string;
    }>;
    didSendViaMessagingTool: boolean;
    didSendDeterministicApprovalPrompt: boolean;
    messagingToolSentTexts: string[];
    messagingToolSentMediaUrls: string[];
    messagingToolSentTargets: unknown[];
    successfulCronAdds: number;
    synthesizedPayloadCount: number;
    acceptedSessionSpawns?: readonly AcceptedSessionSpawn[];
    heartbeatToolResponse?: unknown;
    clientToolCalls?: Array<unknown>;
    yieldDetected?: boolean;
    lastToolError?: unknown;
    silentExpected?: boolean;
    emptyAssistantReplyIsSilent?: boolean;
    lastAssistantStopReason?: string;
    hasTerminalOutput?: boolean;
};
/**
 * Chooses assistant text that can safely count as terminal output. Provider error
 * and abort stop reasons cannot fall back to the raw last visible text because
 * that text may describe an interrupted generation rather than a completed reply.
 */
export declare function resolveTerminalAssistantTexts(params: {
    assistantTexts: string[];
    lastAssistantStopReason?: string;
    lastAssistantVisibleText?: string;
}): string[];
/**
 * Classifies the final attempt trajectory from visible output, durable side
 * effects, and interruption state. Empty terminal turns are errors unless a
 * caller proves a silent success, message delivery, spawned session, async task,
 * or other durable progress.
 */
export declare function resolveAttemptTrajectoryTerminal(params: ResolveAttemptTrajectoryTerminalParams): AttemptTrajectoryTerminal;
export {};
