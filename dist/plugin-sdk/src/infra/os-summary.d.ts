type OsSummary = {
    platform: NodeJS.Platform;
    arch: string;
    release: string;
    label: string;
};
/** Resolves a compact OS label for diagnostics, logs, and environment summaries. */
export declare function resolveOsSummary(): OsSummary;
export {};
