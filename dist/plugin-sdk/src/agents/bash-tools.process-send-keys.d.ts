/**
 * Send-keys support for process-controlled PTY sessions.
 * Encodes symbolic keys, hex bytes, and literal input before writing to a
 * live process stdin.
 */
import type { ProcessSession } from "./bash-process-registry.js";
import type { AgentToolResult } from "./runtime/index.js";
/** Writable stdin surface shared by child-process and PTY session records. */
export type WritableStdin = {
    write: (data: string, cb?: (err?: Error | null) => void) => void;
    end: () => void;
    destroyed?: boolean;
    writable?: boolean;
    writableEnded?: boolean;
    writableFinished?: boolean;
};
/** Encode and write requested key data into a running process session. */
export declare function handleProcessSendKeys(params: {
    sessionId: string;
    session: ProcessSession;
    stdin: WritableStdin;
    keys?: string[];
    hex?: string[];
    literal?: string;
}): Promise<AgentToolResult<unknown>>;
