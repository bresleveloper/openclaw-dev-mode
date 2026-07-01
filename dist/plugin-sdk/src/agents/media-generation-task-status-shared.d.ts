import type { TaskRecord } from "../tasks/task-registry.types.js";
/** Builds a stable request key for media generation duplicate detection. */
export declare function buildMediaGenerationRequestKey(value: Record<string, unknown>): string;
/** Records a just-started media task so duplicate guards work before persistence. */
export declare function recordRecentMediaGenerationTaskStartForSession(params: {
    sessionKey?: string;
    taskKind: string;
    sourcePrefix: string;
    taskId: string;
    runId?: string;
    taskLabel: string;
    requestKey?: string;
    providerId?: string;
    progressSummary: string;
    nowMs?: number;
}): void;
/** Finds a recent started media task from memory or persisted task state. */
export declare function findRecentStartedMediaGenerationTaskForSession(params: {
    sessionKey?: string;
    taskKind: string;
    sourcePrefix: string;
    taskLabel?: string;
    maxAgeMs: number;
    requestKey?: string;
    nowMs?: number;
}): TaskRecord | undefined;
/** Clears in-memory duplicate guards between tests. */
export declare function resetRecentMediaGenerationDuplicateGuardsForTests(): void;
/** Finds the highest-priority active media generation task for a session. */
export declare function findActiveMediaGenerationTaskForSession(params: {
    sessionKey?: string;
    taskKind: string;
    sourcePrefix: string;
    taskLabel?: string;
}): TaskRecord | undefined;
/** Lists active media generation tasks for a session, preferring running tasks. */
export declare function listActiveMediaGenerationTasksForSession(params: {
    sessionKey?: string;
    taskKind: string;
    sourcePrefix: string;
    taskLabel?: string;
}): TaskRecord[];
/** Finds a task that should block duplicate media generation for a session. */
export declare function findDuplicateGuardMediaGenerationTaskForSession(params: {
    sessionKey?: string;
    taskKind: string;
    sourcePrefix: string;
    taskLabel?: string;
    requestKey?: string;
    maxAgeMs: number;
}): TaskRecord | undefined;
/** Builds structured status details for one media generation task. */
export declare function buildMediaGenerationTaskStatusDetails(params: {
    task: TaskRecord;
    sourcePrefix: string;
}): Record<string, unknown>;
/** Builds structured status details for a list of media generation tasks. */
export declare function buildMediaGenerationTaskStatusListDetails(params: {
    tasks: TaskRecord[];
    sourcePrefix: string;
}): Record<string, unknown>;
/** Builds user-facing status text for one media generation task. */
export declare function buildMediaGenerationTaskStatusText(params: {
    task: TaskRecord;
    sourcePrefix: string;
    nounLabel: string;
    toolName: string;
    completionLabel: string;
    duplicateGuard?: boolean;
}): string;
/** Builds user-facing status text for multiple active media generation tasks. */
export declare function buildMediaGenerationTaskStatusListText(params: {
    tasks: TaskRecord[];
    sourcePrefix: string;
    nounLabel: string;
    toolName: string;
    completionLabel: string;
}): string;
/** Builds prompt context warning an agent about an active media generation task. */
export declare function buildActiveMediaGenerationTaskPromptContextForSession(params: {
    sessionKey?: string;
    taskKind: string;
    sourcePrefix: string;
    nounLabel: string;
    toolName: string;
    completionLabel: string;
}): string | undefined;
