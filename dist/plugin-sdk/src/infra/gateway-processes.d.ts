/** Read command argv for a PID using the current platform's process APIs. */
export declare function readGatewayProcessArgsSync(pid: number): string[] | null;
/** Signal a PID only after its argv matches a gateway process. */
export declare function signalVerifiedGatewayPidSync(pid: number, signal: "SIGTERM" | "SIGUSR1"): void;
/** Find listener PIDs on `port` and keep only verified gateway processes. */
export declare function findVerifiedGatewayListenerPidsOnPortSync(port: number): number[];
/** Format gateway PIDs for human-facing diagnostics. */
export declare function formatGatewayPidList(pids: number[]): string;
