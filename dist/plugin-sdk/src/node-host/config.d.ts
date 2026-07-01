/**
 * Persistent node-host identity/config file helpers.
 *
 * Node hosts keep a stable node id and optional Gateway connection metadata in
 * the state directory so reconnects and plugin node commands can identify the host.
 */
/** Gateway endpoint metadata persisted with node-host config. */
export type NodeHostGatewayConfig = {
    host?: string;
    port?: number;
    tls?: boolean;
    tlsFingerprint?: string;
};
type NodeHostConfig = {
    version: 1;
    nodeId: string;
    token?: string;
    displayName?: string;
    gateway?: NodeHostGatewayConfig;
};
/** Load and normalize the node-host config, or null when no readable config exists. */
export declare function loadNodeHostConfig(): Promise<NodeHostConfig | null>;
/** Save node-host config with private file permissions. */
export declare function saveNodeHostConfig(config: NodeHostConfig): Promise<void>;
/** Load or create a node-host config with a stable generated node id. */
export declare function ensureNodeHostConfig(): Promise<NodeHostConfig>;
export {};
