/**
 * Shared node-selection policy for CLI, gateway-facing SDK helpers, and plugins.
 *
 * Exact ids, remote IPs, normalized display names, and long id prefixes are the
 * only accepted query shapes; fuzzy ordering lives here so callers agree.
 */
/** Node fields accepted by shared CLI/API node selection helpers. */
export type NodeMatchCandidate = {
    /** Stable node id used for RPC/session routing. */
    nodeId: string;
    /** Human-facing node name used for fuzzy operator input. */
    displayName?: string;
    /** Tailscale or network address accepted as an exact match. */
    remoteIp?: string;
    /** Connected nodes win only after the strongest match type is chosen. */
    connected?: boolean;
    /** Client id used to prefer current OpenClaw nodes over legacy migration ties. */
    clientId?: string;
};
/** Normalizes human node names into stable lookup keys for fuzzy CLI/API matching. */
export declare function normalizeNodeKey(value: string): string;
/** Resolves a single node id or throws an operator-readable unknown/ambiguous-node error. */
export declare function resolveNodeIdFromCandidates(nodes: NodeMatchCandidate[], query: string): string;
