/**
 * Append-only audit log helpers for Crestodian writes.
 *
 * Discovery and read-only commands stay quiet; persistent operations append a
 * JSONL entry under the state directory with config hashes and redacted details.
 */
type CrestodianAuditEntry = {
    timestamp: string;
    operation: string;
    summary: string;
    configPath?: string;
    configHashBefore?: string | null;
    configHashAfter?: string | null;
    details?: Record<string, unknown>;
};
/** Resolve the JSONL audit path for Crestodian persistent operations. */
export declare function resolveCrestodianAuditPath(env?: NodeJS.ProcessEnv, stateDir?: string): string;
/** Append one Crestodian audit entry and return the file path written. */
export declare function appendCrestodianAuditEntry(entry: Omit<CrestodianAuditEntry, "timestamp">, opts?: {
    env?: NodeJS.ProcessEnv;
    auditPath?: string;
}): Promise<string>;
export {};
