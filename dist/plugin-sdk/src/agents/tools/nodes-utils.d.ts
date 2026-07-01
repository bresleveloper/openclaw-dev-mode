import type { NodeListNode } from "../../shared/node-list-types.js";
import { type GatewayCallOptions } from "./gateway.js";
export type { NodeListNode };
type DefaultNodeFallback = "none" | "first";
type DefaultNodeSelectionOptions = {
    capability?: string;
    fallback?: DefaultNodeFallback;
    preferLocalMac?: boolean;
};
/** Selects the implicit node target when a tool call omits an explicit node query. */
export declare function selectDefaultNodeFromList(nodes: NodeListNode[], options?: DefaultNodeSelectionOptions): NodeListNode | null;
/** Lists Gateway nodes, falling back to paired-node records for older Gateway versions. */
export declare function listNodes(opts: GatewayCallOptions): Promise<NodeListNode[]>;
/** Resolves a node id from an already-loaded node list using shared node matching rules. */
export declare function resolveNodeIdFromList(nodes: NodeListNode[], query?: string, allowDefault?: boolean): string;
/** Loads nodes from the Gateway and resolves the requested or default node id. */
export declare function resolveNodeId(opts: GatewayCallOptions, query?: string, allowDefault?: boolean): Promise<string>;
/** Loads nodes from the Gateway and returns the requested or default node record. */
export declare function resolveNode(opts: GatewayCallOptions, query?: string, allowDefault?: boolean): Promise<NodeListNode>;
