/**
 * Scrubs pre-redactor config audit records or previews the number of affected entries.
 *
 * The rewrite aborts if new records are appended while doctor is processing the JSONL file, so
 * live gateways do not lose audit entries during cleanup.
 */
export declare function maybeScrubConfigAuditLog(params: {
    shouldRepair: boolean;
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
    doctorFixCommand?: string;
}): Promise<void>;
