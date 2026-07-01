/** Result from waiting for pending tool tasks before final delivery. */
type PendingToolTaskDrainResult = {
    kind: "settled";
} | {
    kind: "timeout";
    remaining: number;
};
type DrainOptions = {
    tasks: Set<Promise<void>>;
    idleTimeoutMs?: number;
    onTimeout?: (message: string) => void;
};
/** Waits for pending tool tasks to settle or times out to avoid session deadlock. */
export declare function drainPendingToolTasks({ tasks, idleTimeoutMs, onTimeout, }: DrainOptions): Promise<PendingToolTaskDrainResult>;
export {};
