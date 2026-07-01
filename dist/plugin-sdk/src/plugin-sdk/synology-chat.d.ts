import type { SecurityAuditFinding } from "../security/audit.types.js";
type FacadeModule = {
    collectSynologyChatSecurityAuditFindings: (params: {
        accountId?: string | null;
        account: {
            accountId?: string;
            dangerouslyAllowNameMatching?: boolean;
        };
        orderedAccountIds: string[];
        hasExplicitAccountPath: boolean;
    }) => SecurityAuditFinding[];
};
/** Collect Synology Chat security findings through the lazy bundled-plugin facade. */
export declare const collectSynologyChatSecurityAuditFindings: FacadeModule["collectSynologyChatSecurityAuditFindings"];
export {};
