import type { SecurityAuditFinding, SecurityAuditReport } from "./audit.types.js";
/**
 * Convert optional deep gateway probe results into security audit findings.
 * This keeps CLI/audit callers aligned on check ids, titles, and remediation text.
 */
export declare function collectDeepProbeFindings(params: {
    deep?: SecurityAuditReport["deep"];
    authWarning?: string;
}): SecurityAuditFinding[];
