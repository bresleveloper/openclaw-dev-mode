/** Per-session async queue that serializes ACP runtime operations and exposes queue depth. */
export declare class SessionActorQueue {
    private readonly queue;
    private readonly pendingBySession;
    getTailMapForTesting(): Map<string, Promise<void>>;
    getTotalPendingCount(): number;
    run<T>(actorKey: string, op: () => Promise<T>): Promise<T>;
}
