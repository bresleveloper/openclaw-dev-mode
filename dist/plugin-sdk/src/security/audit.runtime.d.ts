type RunSecurityAudit = typeof import("./audit.js").runSecurityAudit;
/** Runtime facade for the full security audit entrypoint. */
export declare function runSecurityAudit(...args: Parameters<RunSecurityAudit>): ReturnType<RunSecurityAudit>;
export {};
