import type { ChildProcess } from "node:child_process";
export declare function shouldDetachChildForProcessTree(): boolean;
export declare function signalChildProcessTree(child: Pick<ChildProcess, "kill" | "pid">, signal: "SIGTERM" | "SIGKILL"): void;
export declare function forceKillChildProcessTree(child: Pick<ChildProcess, "kill" | "pid">): void;
