import { type ClawHubSkillSecurityVerdictItem } from "../../infra/clawhub.js";
import type { buildWorkspaceSkillStatus } from "../discovery/status.js";
/** ClawHub verdict item shape projected into local security scan verdicts. */
type OpenClawSkillSecurityVerdictItem = Omit<ClawHubSkillSecurityVerdictItem, "decision" | "error" | "security"> & {
    registry: string;
    decision: string;
    securityStatus?: string | null;
    securityPassed?: boolean | null;
    error?: {
        code?: string;
        message?: string;
    };
};
export declare function collectClawHubVerdictTargets(report: ReturnType<typeof buildWorkspaceSkillStatus>): Array<{
    registry: string;
    slug: string;
    version: string;
}>;
export declare function fetchOpenClawSkillSecurityVerdicts(targets: Array<{
    registry: string;
    slug: string;
    version: string;
}>): Promise<OpenClawSkillSecurityVerdictItem[]>;
export {};
