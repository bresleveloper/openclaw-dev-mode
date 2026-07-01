import type { OpenClawConfig } from "../config/types.openclaw.js";
/**
 * Model reference used by security audit findings.
 * `id` is the normalized provider/model key; `source` is the config path shown in diagnostics.
 */
export type AuditModelRef = {
    id: string;
    source: string;
};
/**
 * Collect every configured primary and fallback model that security audits should classify.
 * Agent-specific refs keep source labels precise so findings point at the risky override.
 */
export declare function collectAuditModelRefs(cfg: OpenClawConfig): AuditModelRef[];
