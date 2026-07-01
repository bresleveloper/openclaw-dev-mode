import { type MediaGenerationTaskHandle } from "./media-generate-background-shared.js";
export type MusicGenerationTaskHandle = MediaGenerationTaskHandle;
/** Shared lifecycle configured with music-specific status text and event metadata. */
export declare const musicGenerationTaskLifecycle: {
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
/** Creates a queued music-generation background task run. */
export declare const createMusicGenerationTaskRun: (...params: Parameters<typeof musicGenerationTaskLifecycle.createTaskRun>) => MediaGenerationTaskHandle | null;
/** Records progress for an active music-generation task. */
export declare const recordMusicGenerationTaskProgress: (...params: Parameters<typeof musicGenerationTaskLifecycle.recordTaskProgress>) => void;
/** Marks a music-generation task complete and stores generated attachment metadata. */
export declare const completeMusicGenerationTaskRun: (...params: Parameters<typeof musicGenerationTaskLifecycle.completeTaskRun>) => void;
/** Marks a music-generation task failed and emits task status updates. */
export declare const failMusicGenerationTaskRun: (...params: Parameters<typeof musicGenerationTaskLifecycle.failTaskRun>) => void;
