import type { OpenClawConfig } from "../config/types.js";
import type { SecurityAuditFinding } from "../security/audit.types.js";
type SecuritySurface = {
    collectFeishuSecurityAuditFindings: (params: {
        cfg: OpenClawConfig;
    }) => SecurityAuditFinding[];
};
/** Collect Feishu plugin security findings through the lazy bundled-plugin facade. */
export declare const collectFeishuSecurityAuditFindings: SecuritySurface["collectFeishuSecurityAuditFindings"];
export {};
