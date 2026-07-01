/** Agent-facing summary of a reconnectable background process session. */
export type ActiveProcessSessionReference = {
    sessionId: string;
    status: "running";
    pid?: number;
    startedAt: number;
    runtimeMs: number;
    cwd?: string;
    command: string;
    name: string;
    tail?: string;
    truncated: boolean;
};
/** List active background process sessions for one scope key, newest first. */
export declare function listActiveProcessSessionReferences(params: {
    scopeKey?: string;
    now?: number;
    limit?: number;
}): ActiveProcessSessionReference[];
