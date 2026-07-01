/** Returns whether approval replies can route back to the turn's initiating surface. */
export declare function hasApprovalTurnSourceRoute(params: {
    turnSourceChannel?: string | null;
    turnSourceAccountId?: string | null;
    approvalKind?: "exec" | "plugin";
}): boolean;
