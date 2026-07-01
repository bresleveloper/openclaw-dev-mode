import { type GatewayBonjourBeacon, type GatewayDiscoveryResolvedEndpoint } from "./bonjour-discovery.js";
type GatewayDiscoveryTarget = {
    title: string;
    domain: string;
    endpoint: GatewayDiscoveryResolvedEndpoint | null;
    wsUrl: string | null;
    sshPort: number | null;
    sshTarget: string | null;
};
/** Build normalized connection details for a discovered gateway beacon. */
export declare function buildGatewayDiscoveryTarget(beacon: GatewayBonjourBeacon, opts?: {
    sshUser?: string | null;
}): GatewayDiscoveryTarget;
/** Build the compact label shown in discovery lists. */
export declare function buildGatewayDiscoveryLabel(beacon: GatewayBonjourBeacon): string;
/** Serialize a beacon with resolved websocket information for CLI/UI output. */
export declare function serializeGatewayDiscoveryBeacon(beacon: GatewayBonjourBeacon): {
    instanceName: string;
    displayName: string | null;
    domain: string | null;
    host: string | null;
    lanHost: string | null;
    tailnetDns: string | null;
    gatewayPort: number | null;
    sshPort: number | null;
    wsUrl: string | null;
};
export {};
