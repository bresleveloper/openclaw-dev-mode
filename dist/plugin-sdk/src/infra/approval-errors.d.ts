/**
 * Detects approval-not-found failures across gateway error shapes.
 * Kept broad enough for legacy message-only errors emitted before structured codes.
 */
export declare function isApprovalNotFoundError(err: unknown): boolean;
