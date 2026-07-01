import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type RequiredCompletionTerminalResult } from "../../tasks/task-completion-contract.js";
import { type DeliveryContext } from "../../utils/delivery-context.js";
import { type AgentGeneratedAttachment } from "../generated-attachments.js";
import { type AgentInternalEvent } from "../internal-events.js";
/** Handle for a detached media generation task registered in the task ledger. */
export type MediaGenerationTaskHandle = {
    taskId: string;
    runId: string;
    requesterSessionKey: string;
    requesterOrigin?: DeliveryContext;
    taskLabel: string;
};
/** Schedules detached media generation work. */
export type MediaGenerateBackgroundScheduler = (work: () => Promise<void>) => void;
/** Optional callback invoked when async media generation starts. */
export type MediaGenerateAsyncStartCallback = (message: string) => Promise<void> | void;
/** Returns whether a media generation request should detach for a session. */
export declare function shouldDetachMediaGenerationTask(sessionKey: string | undefined): boolean;
/** Successful media generation output used to complete and wake detached tasks. */
type MediaGenerationExecutionResult = {
    provider: string;
    model: string;
    count: number;
    paths: string[];
    wakeResult: string;
    attachments?: AgentGeneratedAttachment[];
    mediaUrls?: string[];
};
type CreateMediaGenerationTaskRunParams = {
    sessionKey?: string;
    requesterOrigin?: DeliveryContext;
    prompt: string;
    providerId?: string;
};
type RecordMediaGenerationTaskProgressParams = {
    handle: MediaGenerationTaskHandle | null;
    progressSummary: string;
    eventSummary?: string;
};
type CompleteMediaGenerationTaskRunParams = {
    handle: MediaGenerationTaskHandle | null;
    provider: string;
    model: string;
    count: number;
    paths: string[];
    terminalResult?: RequiredCompletionTerminalResult;
};
type FailMediaGenerationTaskRunParams = {
    handle: MediaGenerationTaskHandle | null;
    error: unknown;
};
type WakeMediaGenerationTaskCompletionParams = {
    config?: OpenClawConfig;
    handle: MediaGenerationTaskHandle | null;
    status: "ok" | "error";
    statusLabel: string;
    result: string;
    attachments?: AgentGeneratedAttachment[];
    mediaUrls?: string[];
    statsLine?: string;
};
type MediaGenerationTaskLifecycle = {
    createTaskRun: (params: CreateMediaGenerationTaskRunParams) => MediaGenerationTaskHandle | null;
    recordTaskProgress: (params: RecordMediaGenerationTaskProgressParams) => void;
    completeTaskRun: (params: CompleteMediaGenerationTaskRunParams) => void;
    failTaskRun: (params: FailMediaGenerationTaskRunParams) => void;
    wakeTaskCompletion: (params: WakeMediaGenerationTaskCompletionParams) => Promise<boolean>;
};
/** Periodically refreshes task progress while a media generation operation runs. */
export declare function withMediaGenerationTaskKeepalive<T>(params: {
    handle: MediaGenerationTaskHandle | null;
    progressSummary: string;
    eventSummary?: string;
    run: () => Promise<T>;
}): Promise<T>;
/** Creates the default microtask scheduler for detached media generation jobs. */
export declare function createDefaultMediaGenerateBackgroundScheduler(params: {
    toolName: string;
    onCrash: (message: string, meta?: Record<string, unknown>) => void;
}): MediaGenerateBackgroundScheduler;
/** Builds the immediate tool result returned after a background media task starts. */
export declare function buildMediaGenerationStartedToolResult(params: {
    toolName: string;
    generationLabel: string;
    completionLabel: string;
    taskHandle: MediaGenerationTaskHandle | null;
    detailExtras?: Record<string, unknown>;
    messages?: Array<string | undefined>;
}): {
    content: {
        type: "text";
        text: string;
    }[];
    details: {
        async: boolean;
        status: string;
        taskId?: string | undefined;
        runId?: string | undefined;
        task?: {
            taskId: string;
            runId: string;
        } | undefined;
    };
};
/** Notifies an optional async-start observer and logs callback failures. */
export declare function notifyMediaGenerationAsyncTaskStarted(params: {
    callback?: MediaGenerateAsyncStartCallback;
    message: string;
    toolName: string;
    handle: MediaGenerationTaskHandle | null;
    onFailure: (message: string, meta?: Record<string, unknown>) => void;
}): Promise<void>;
/** Schedules media generation work and wires result/failure handling into task lifecycle. */
export declare function scheduleMediaGenerationTaskCompletion<T extends MediaGenerationExecutionResult>(params: {
    lifecycle: MediaGenerationTaskLifecycle;
    handle: MediaGenerationTaskHandle | null;
    scheduleBackgroundWork: MediaGenerateBackgroundScheduler;
    progressSummary: string;
    config?: OpenClawConfig;
    toolName: string;
    run: () => Promise<T>;
    onWakeFailure: (message: string, meta?: Record<string, unknown>) => void;
}): void;
/** Creates a tool-specific detached media generation lifecycle facade. */
export declare function createMediaGenerationTaskLifecycle(params: {
    toolName: string;
    taskKind: string;
    label: string;
    queuedProgressSummary: string;
    generatedLabel: string;
    failureProgressSummary: string;
    eventSource: AgentInternalEvent["source"];
    announceType: string;
    completionLabel: string;
}): MediaGenerationTaskLifecycle;
export {};
