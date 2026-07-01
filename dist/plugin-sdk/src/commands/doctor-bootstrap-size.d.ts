import type { OpenClawConfig } from "../config/types.openclaw.js";
/**
 * Analyzes configured bootstrap files and emits warnings when injection will truncate content.
 *
 * Returns the raw budget analysis for tests and callers that need structured evidence.
 */
export declare function noteBootstrapFileSize(cfg: OpenClawConfig): Promise<{
    files: ({
        name: string;
        path: string;
        missing: boolean;
        rawChars: number;
        injectedChars: number;
        truncated: boolean;
    } & {
        nearLimit: boolean;
        causes: ("per-file-limit" | "total-limit")[];
    })[];
    truncatedFiles: ({
        name: string;
        path: string;
        missing: boolean;
        rawChars: number;
        injectedChars: number;
        truncated: boolean;
    } & {
        nearLimit: boolean;
        causes: ("per-file-limit" | "total-limit")[];
    })[];
    nearLimitFiles: ({
        name: string;
        path: string;
        missing: boolean;
        rawChars: number;
        injectedChars: number;
        truncated: boolean;
    } & {
        nearLimit: boolean;
        causes: ("per-file-limit" | "total-limit")[];
    })[];
    totalNearLimit: boolean;
    hasTruncation: boolean;
    totals: {
        rawChars: number;
        injectedChars: number;
        truncatedChars: number;
        bootstrapMaxChars: number;
        bootstrapTotalMaxChars: number;
        nearLimitRatio: number;
    };
}>;
