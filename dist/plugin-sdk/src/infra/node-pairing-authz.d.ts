/** Operator scopes required to approve a pending node pairing surface. */
export type NodeApprovalScope = "operator.pairing" | "operator.write" | "operator.admin";
/** Map declared node commands to the least operator scopes needed for approval. */
export declare function resolveNodePairApprovalScopes(commands: unknown): NodeApprovalScope[];
