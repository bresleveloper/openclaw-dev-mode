/**
 * Video generation task status helpers.
 *
 * These wrap the generic media task status helpers with video-specific kind,
 * source, labels, duplicate-guard timing, and prompt-context wording.
 */
import type { TaskRecord } from "../tasks/task-registry.types.js";
export declare const VIDEO_GENERATION_TASK_KIND = "video_generation";
/** Finds an active video generation task for a session. */
export declare function findActiveVideoGenerationTaskForSession(sessionKey?: string): TaskRecord | undefined;
/** Finds a recent matching video task used to suppress duplicate generation requests. */
export declare function findDuplicateGuardVideoGenerationTaskForSession(sessionKey?: string, params?: {
    prompt?: string;
    requestKey?: string;
}): TaskRecord | undefined;
/** Builds structured status details for a video generation task. */
export declare function buildVideoGenerationTaskStatusDetails(task: TaskRecord): Record<string, unknown>;
/** Builds the user-facing status text for a video generation task. */
export declare function buildVideoGenerationTaskStatusText(task: TaskRecord, params?: {
    duplicateGuard?: boolean;
}): string;
/** Builds prompt context describing an active video generation task in the session. */
export declare function buildActiveVideoGenerationTaskPromptContextForSession(sessionKey?: string): string | undefined;
