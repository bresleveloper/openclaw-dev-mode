import { type NodeApprovalScope } from "./node-pairing-authz.js";
type NodeDeclaredSurface = {
    nodeId: string;
    clientId?: string;
    clientMode?: string;
    displayName?: string;
    platform?: string;
    version?: string;
    coreVersion?: string;
    uiVersion?: string;
    deviceFamily?: string;
    modelIdentifier?: string;
    caps?: string[];
    commands?: string[];
    permissions?: Record<string, boolean>;
    remoteIp?: string;
};
type NodeApprovedSurface = NodeDeclaredSurface;
/** Node-declared pairing surface before approval. */
export type NodePairingRequestInput = NodeDeclaredSurface & {
    silent?: boolean;
};
/** Pending node pairing request awaiting operator approval. */
export type NodePairingPendingRequest = NodePairingRequestInput & {
    requestId: string;
    silent?: boolean;
    ts: number;
};
export type NodePairingPendingSnapshot = Pick<NodePairingPendingRequest, "requestId" | "nodeId"> & {
    revision?: string;
};
/** Opaque claim preventing approval while a reconnect resolves stale pending state. */
export type NodePairingCleanupClaim = {
    baseDir: string | undefined;
    generation: number;
    nodeId: string;
    pendingPath: string;
    observed: NodePairingPendingSnapshot[];
};
/** Pending request summary returned when a new approval surface supersedes older requests. */
export type NodePairingSupersededRequest = Pick<NodePairingPendingRequest, "requestId" | "nodeId">;
/** Result for creating or refreshing a pending node pairing request. */
export type RequestNodePairingResult = {
    status: "pending";
    request: NodePairingPendingRequest;
    created: boolean;
    superseded?: NodePairingSupersededRequest[];
};
type NodePairingPendingEntry = NodePairingPendingRequest & {
    requiredApproveScopes: NodeApprovalScope[];
};
/** Approved node record with its pairing token and persisted capability surface. */
export type NodePairingPairedNode = NodeApprovedSurface & {
    token: string;
    bins?: string[];
    createdAtMs: number;
    approvedAtMs: number;
    lastConnectedAtMs?: number;
    lastSeenAtMs?: number;
    lastSeenReason?: string;
};
type NodePairingList = {
    pending: NodePairingPendingEntry[];
    paired: NodePairingPairedNode[];
};
type ApprovedNodePairingResult = {
    requestId: string;
    node: NodePairingPairedNode;
};
type ForbiddenNodePairingResult = {
    status: "forbidden";
    missingScope: string;
};
type ApproveNodePairingResult = ApprovedNodePairingResult | ForbiddenNodePairingResult | null;
export declare function listNodePairing(baseDir?: string): Promise<NodePairingList>;
/** Snapshot pairing state and claim current pending revisions for one paired reconnect. */
export declare function beginNodePairingConnect(nodeId: string, baseDir?: string): Promise<{
    pairedNode: NodePairingPairedNode | null;
    cleanupClaim?: NodePairingCleanupClaim;
}>;
/** Release a reconnect cleanup claim without changing pending pairing state. */
export declare function releaseNodePairingCleanupClaim(claim: NodePairingCleanupClaim): Promise<void>;
/** Delete pending revisions claimed by a reconnect after hello succeeds. */
export declare function finalizeNodePairingCleanupClaim(claim: NodePairingCleanupClaim): Promise<NodePairingSupersededRequest[]>;
/** Create or refresh a pending node pairing request for operator approval. */
export declare function requestNodePairing(req: NodePairingRequestInput, baseDir?: string): Promise<RequestNodePairingResult>;
/** Reuse an unchanged reconnect request without refreshing or writing pairing state. */
export declare function reusePendingNodePairingForReconnect(req: NodePairingRequestInput, cleanupClaim: NodePairingCleanupClaim | undefined, baseDir?: string): Promise<RequestNodePairingResult | null>;
/** Approve a pending node request when caller scopes cover the requested command surface. */
export declare function approveNodePairing(requestId: string, options: {
    callerScopes?: readonly string[];
}, baseDir?: string): Promise<ApproveNodePairingResult>;
/** Reject a pending node pairing request. */
export declare function rejectNodePairing(requestId: string, baseDir?: string): Promise<{
    requestId: string;
    nodeId: string;
} | null>;
/** Remove a paired node without disturbing unrelated pending requests. */
export declare function removePairedNode(nodeId: string, baseDir?: string): Promise<{
    nodeId: string;
} | null>;
/** Verify a paired node token and return the approved node record on success. */
export declare function verifyNodeToken(nodeId: string, token: string, baseDir?: string): Promise<{
    ok: boolean;
    node?: NodePairingPairedNode;
}>;
/** Update non-auth metadata for a paired node heartbeat/status refresh. */
export declare function updatePairedNodeMetadata(nodeId: string, patch: Partial<Omit<NodePairingPairedNode, "nodeId" | "token" | "createdAtMs" | "approvedAtMs">>, baseDir?: string): Promise<boolean>;
/** Rename a paired node display name while preserving token and approval metadata. */
export declare function renamePairedNode(nodeId: string, displayName: string, baseDir?: string): Promise<NodePairingPairedNode | null>;
export {};
