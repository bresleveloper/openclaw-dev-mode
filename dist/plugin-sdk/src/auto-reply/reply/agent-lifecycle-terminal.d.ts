export type AgentLifecycleTerminalBackstop = {
    emit: (phase: "end" | "error", resultOrError: unknown, extraData?: Record<string, unknown>) => void;
    getDeferredError: () => string | undefined;
    note: (evt: {
        stream: string;
        data: Record<string, unknown>;
    }) => void;
};
export declare function resolveAgentLifecycleTerminalMetadata(meta: unknown): Record<string, unknown>;
export declare function createAgentLifecycleTerminalBackstop(params: {
    runId: string;
    sessionKey?: string;
    startedAt?: number;
    getLifecycleGeneration: () => string;
    resolveAbortLifecycleFields: () => {
        aborted?: true;
        stopReason?: string;
    };
}): AgentLifecycleTerminalBackstop;
