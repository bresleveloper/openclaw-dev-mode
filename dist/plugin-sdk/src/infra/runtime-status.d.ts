type RuntimeStatusFormatInput = {
    status?: string;
    pid?: number;
    state?: string;
    details?: string[];
};
/** Formats runtime health/status text with optional pid, state, and extra diagnostic details. */
export declare function formatRuntimeStatusWithDetails({ status, pid, state, details, }: RuntimeStatusFormatInput): string;
export {};
