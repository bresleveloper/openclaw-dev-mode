/**
 * Image generation task status helpers.
 *
 * These wrap the shared media task status helpers with image-specific task kind,
 * source id, duplicate-guard timing, and prompt/status wording.
 */
import type { TaskRecord } from "../tasks/task-registry.types.js";
export declare const IMAGE_GENERATION_TASK_KIND = "image_generation";
/** Finds the active image generation task for a session and optional prompt. */
export declare function findActiveImageGenerationTaskForSession(sessionKey?: string, params?: {
    prompt?: string;
}): TaskRecord | undefined;
/** Lists active image generation tasks for a session. */
export declare function listActiveImageGenerationTasksForSession(sessionKey?: string): TaskRecord[];
/** Finds an image generation task that should block duplicate generation. */
export declare function findDuplicateGuardImageGenerationTaskForSession(sessionKey?: string, params?: {
    prompt?: string;
    requestKey?: string;
}): TaskRecord | undefined;
/** Builds structured status details for one image generation task. */
export declare function buildImageGenerationTaskStatusDetails(task: TaskRecord): Record<string, unknown>;
/** Builds structured status details for a list of image generation tasks. */
export declare function buildImageGenerationTaskStatusListDetails(tasks: TaskRecord[]): Record<string, unknown>;
/** Builds user-facing status text for one image generation task. */
export declare function buildImageGenerationTaskStatusText(task: TaskRecord, params?: {
    duplicateGuard?: boolean;
}): string;
/** Builds user-facing status text for active image generation tasks. */
export declare function buildImageGenerationTaskStatusListText(tasks: TaskRecord[]): string;
/** Builds prompt context describing an active image generation task in the session. */
export declare function buildActiveImageGenerationTaskPromptContextForSession(sessionKey?: string): string | undefined;
