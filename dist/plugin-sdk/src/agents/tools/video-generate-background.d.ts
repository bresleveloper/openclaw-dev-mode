import { type MediaGenerationTaskHandle } from "./media-generate-background-shared.js";
export type VideoGenerationTaskHandle = MediaGenerationTaskHandle;
/** Shared lifecycle configured with video-specific status text and event metadata. */
export declare const videoGenerationTaskLifecycle: {
    createTaskRun: (params: {
        sessionKey?: string;
        requesterOrigin?: import("../subagent-announce-origin.ts").DeliveryContext;
        prompt: string;
        providerId?: string;
    }) => MediaGenerationTaskHandle | null;
    recordTaskProgress: (params: {
        handle: MediaGenerationTaskHandle | null;
        progressSummary: string;
        eventSummary?: string;
    }) => void;
    completeTaskRun: (params: {
        handle: MediaGenerationTaskHandle | null;
        provider: string;
        model: string;
        count: number;
        paths: string[];
        terminalResult?: import("../../tasks/task-completion-contract.ts").RequiredCompletionTerminalResult;
    }) => void;
    failTaskRun: (params: {
        handle: MediaGenerationTaskHandle | null;
        error: unknown;
    }) => void;
    wakeTaskCompletion: (params: {
        config?: import("../../config/types.openclaw.ts").OpenClawConfig;
        handle: MediaGenerationTaskHandle | null;
        status: "ok" | "error";
        statusLabel: string;
        result: string;
        attachments?: import("../generated-attachments.ts").AgentGeneratedAttachment[];
        mediaUrls?: string[];
        statsLine?: string;
    }) => Promise<boolean>;
};
/** Creates a queued video-generation background task run. */
export declare const createVideoGenerationTaskRun: (...params: Parameters<typeof videoGenerationTaskLifecycle.createTaskRun>) => MediaGenerationTaskHandle | null;
/** Records progress for an active video-generation task. */
export declare const recordVideoGenerationTaskProgress: (...params: Parameters<typeof videoGenerationTaskLifecycle.recordTaskProgress>) => void;
/** Marks a video-generation task complete and stores generated attachment metadata. */
export declare const completeVideoGenerationTaskRun: (...params: Parameters<typeof videoGenerationTaskLifecycle.completeTaskRun>) => void;
/** Marks a video-generation task failed and emits task status updates. */
export declare const failVideoGenerationTaskRun: (...params: Parameters<typeof videoGenerationTaskLifecycle.failTaskRun>) => void;
