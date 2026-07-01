import { type NodeMatchCandidate } from "./node-match.js";
type ResolveNodeFromListOptions<TNode extends NodeMatchCandidate> = {
    allowDefault?: boolean;
    pickDefaultNode?: (nodes: TNode[]) => TNode | null;
};
/** Resolves a user query to a node id, optionally using a caller-defined blank-query default. */
export declare function resolveNodeIdFromNodeList<TNode extends NodeMatchCandidate>(nodes: TNode[], query?: string, options?: ResolveNodeFromListOptions<TNode>): string;
/** Resolves a full node entry, preserving synthetic defaults returned by the picker. */
export declare function resolveNodeFromNodeList<TNode extends NodeMatchCandidate>(nodes: TNode[], query?: string, options?: ResolveNodeFromListOptions<TNode>): TNode;
export {};
