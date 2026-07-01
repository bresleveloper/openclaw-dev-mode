import type { ApprovalRequest, ApprovalResolved, ExpiredApprovalView, PendingApprovalView, ResolvedApprovalView } from "./approval-view-model.types.js";
/** Builds the presentation model for an unresolved exec or plugin approval. */
export declare function buildPendingApprovalView(request: ApprovalRequest): PendingApprovalView;
/** Builds the presentation model for an approval after a decision was recorded. */
export declare function buildResolvedApprovalView(request: ApprovalRequest, resolved: ApprovalResolved): ResolvedApprovalView;
/** Builds the presentation model shown when an approval can no longer be acted on. */
export declare function buildExpiredApprovalView(request: ApprovalRequest): ExpiredApprovalView;
