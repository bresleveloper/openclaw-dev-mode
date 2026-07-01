/**
 * Music-generation task status adapters. The module specializes the shared
 * media-generation task helpers with music task ids, duplicate guards, and
 * user-facing status text.
 */
import type { TaskRecord } from "../tasks/task-registry.types.js";
/** Task kind used for music generation task registry records. */
export declare const MUSIC_GENERATION_TASK_KIND = "music_generation";
/** Finds an active music generation task for a session. */
export declare function findActiveMusicGenerationTaskForSession(sessionKey?: string): TaskRecord | undefined;
/** Finds a recent duplicate-guard music generation task for a session/request. */
export declare function findDuplicateGuardMusicGenerationTaskForSession(sessionKey?: string, params?: {
    prompt?: string;
    requestKey?: string;
}): TaskRecord | undefined;
/** Builds structured status details for a music generation task. */
export declare function buildMusicGenerationTaskStatusDetails(task: TaskRecord): Record<string, unknown>;
/** Builds user-facing status text for a music generation task. */
export declare function buildMusicGenerationTaskStatusText(task: TaskRecord, params?: {
    duplicateGuard?: boolean;
}): string;
/** Builds prompt context describing an active music generation task for a session. */
export declare function buildActiveMusicGenerationTaskPromptContextForSession(sessionKey?: string): string | undefined;
