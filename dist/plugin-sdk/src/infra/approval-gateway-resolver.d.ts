import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ExecApprovalDecision } from "./exec-approvals.js";
type ResolveApprovalOverGatewayParams = {
    cfg: OpenClawConfig;
    approvalId: string;
    decision: ExecApprovalDecision;
    senderId?: string | null;
    allowPluginFallback?: boolean;
    resolveMethod?: "plugin";
    gatewayUrl?: string;
    clientDisplayName?: string;
};
/** Resolves an exec or plugin approval id through the operator approvals gateway. */
export declare function resolveApprovalOverGateway(params: ResolveApprovalOverGatewayParams): Promise<void>;
export {};
