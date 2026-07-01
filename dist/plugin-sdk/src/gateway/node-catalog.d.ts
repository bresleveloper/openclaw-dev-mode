import { type PairedDevice } from "../infra/device-pairing.js";
import type { NodePairingPairedNode, NodePairingPendingRequest } from "../infra/node-pairing.js";
import type { NodeListNode } from "../shared/node-list-types.js";
import type { NodeSession } from "./node-registry.js";
type KnownNodeDevicePairingSource = {
    nodeId: string;
    displayName?: string;
    platform?: string;
    clientId?: string;
    clientMode?: string;
    remoteIp?: string;
    approvedAtMs?: number;
    lastSeenAtMs?: number;
    lastSeenReason?: string;
};
type KnownNodeApprovedSource = {
    nodeId: string;
    displayName?: string;
    platform?: string;
    version?: string;
    coreVersion?: string;
    uiVersion?: string;
    remoteIp?: string;
    deviceFamily?: string;
    modelIdentifier?: string;
    caps: string[];
    commands: string[];
    permissions?: Record<string, boolean>;
    approvedAtMs?: number;
    lastConnectedAtMs?: number;
    lastSeenAtMs?: number;
    lastSeenReason?: string;
};
type KnownNodePendingSource = {
    requestId: string;
    nodeId: string;
    displayName?: string;
    platform?: string;
    version?: string;
    coreVersion?: string;
    uiVersion?: string;
    clientId?: string;
    clientMode?: string;
    remoteIp?: string;
    deviceFamily?: string;
    modelIdentifier?: string;
    caps: string[];
    commands: string[];
    permissions?: Record<string, boolean>;
};
type KnownNodeEntry = {
    nodeId: string;
    devicePairing?: KnownNodeDevicePairingSource;
    nodePairing?: KnownNodeApprovedSource;
    pendingNodePairing?: KnownNodePendingSource;
    live?: NodeSession;
    effective: NodeListNode;
};
type KnownNodeCatalog = {
    entriesById: Map<string, KnownNodeEntry>;
};
/** Builds a node catalog keyed by node id from pairing stores and live sessions. */
export declare function createKnownNodeCatalog(params: {
    pairedDevices: readonly PairedDevice[];
    pairedNodes?: readonly NodePairingPairedNode[];
    pendingNodes?: readonly NodePairingPendingRequest[];
    connectedNodes: readonly NodeSession[];
}): KnownNodeCatalog;
/** Lists known nodes with connected nodes first and deterministic display ordering. */
export declare function listKnownNodes(catalog: KnownNodeCatalog): NodeListNode[];
/** Returns the merged catalog entry for diagnostics that need source details. */
export declare function getKnownNodeEntry(catalog: KnownNodeCatalog, nodeId: string): KnownNodeEntry | null;
/** Returns the effective node row shown to gateway clients. */
export declare function getKnownNode(catalog: KnownNodeCatalog, nodeId: string): NodeListNode | null;
export {};
