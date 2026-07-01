import type { TaskRecord, TaskRuntime, TaskStatus } from "../tasks/task-registry.types.js";
/** Find the active queued/running task that matches a session and optional filters. */
export declare function findActiveSessionTask(params: {
    sessionKey?: string;
    runtime?: TaskRuntime;
    taskKind?: string;
    task?: string;
    statuses?: ReadonlySet<TaskStatus>;
    sourceIdPrefix?: string;
}): TaskRecord | undefined;
/** Build tool details that point callers at the already-active async task. */
export declare function buildSessionAsyncTaskStatusDetails(task: TaskRecord): Record<string, unknown>;
