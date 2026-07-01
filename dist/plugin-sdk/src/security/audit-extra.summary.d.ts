import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Lightweight audit finding shape used by summary-only audit helpers. */
export type SecurityAuditFinding = {
    checkId: string;
    severity: "info" | "warn" | "critical";
    title: string;
    detail: string;
    remediation?: string;
};
/** Produce a concise inventory of major security-relevant surfaces. */
export declare function collectAttackSurfaceSummaryFindings(cfg: OpenClawConfig): SecurityAuditFinding[];
/** Flag small-parameter models when they retain web/browser tool exposure. */
export declare function collectSmallModelRiskFindings(params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
}): SecurityAuditFinding[];
