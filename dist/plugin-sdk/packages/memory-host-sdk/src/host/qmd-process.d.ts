export type CliSpawnInvocation = {
    command: string;
    argv: string[];
    shell?: boolean;
    windowsHide?: boolean;
};
export type QmdBinaryUnavailableReason = "binary" | "workspace-cwd";
export type QmdBinaryUnavailable = {
    available: false;
    /**
     * Optional for source compatibility with older plugin SDK callers that
     * returned only `{ available: false, error }`.
     */
    reason?: QmdBinaryUnavailableReason;
    error: string;
};
export type QmdBinaryAvailability = {
    available: true;
} | QmdBinaryUnavailable;
export declare function resolveQmdBinaryUnavailableReason(result: QmdBinaryUnavailable): QmdBinaryUnavailableReason;
export declare function resolveCliSpawnInvocation(params: {
    command: string;
    args: string[];
    env: NodeJS.ProcessEnv;
    packageName: string;
}): CliSpawnInvocation;
export declare function checkQmdBinaryAvailability(params: {
    command: string;
    env: NodeJS.ProcessEnv;
    cwd?: string;
    timeoutMs?: number;
}): Promise<QmdBinaryAvailability>;
export declare function runCliCommand(params: {
    commandSummary: string;
    spawnInvocation: CliSpawnInvocation;
    env: NodeJS.ProcessEnv;
    cwd: string;
    timeoutMs?: number;
    maxOutputChars: number;
    discardStdout?: boolean;
    /**
     * Caller-owned cancellation. When the signal aborts, the spawned child is
     * killed immediately and the call rejects, so a caller that already stopped
     * waiting (for example after its own deadline) does not leave an orphaned
     * process running for the full command timeout.
     */
    signal?: AbortSignal;
}): Promise<{
    stdout: string;
    stderr: string;
}>;
