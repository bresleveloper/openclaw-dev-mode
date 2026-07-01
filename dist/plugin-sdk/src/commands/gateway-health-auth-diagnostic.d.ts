/** Gateway health auth diagnostic helpers for reachable-but-unauthenticated probes. */
import type { DaemonStatus } from "../cli/daemon-cli/status.gather.js";
type GatewayProbeReachabilityEvidence = NonNullable<DaemonStatus["rpc"]>;
export declare const GATEWAY_HEALTH_CREDENTIALS_REQUIRED_MESSAGE = "Gateway is reachable, but this CLI has no token/password or paired device token for read-scope health RPCs.";
export declare const GATEWAY_HEALTH_CREDENTIALS_REQUIRED_TITLE = "Gateway credentials required";
export declare const GATEWAY_HEALTH_REACHABLE_LINE = "Gateway: reachable";
/**
 * Detects when a daemon probe reached the gateway even if read-scope auth failed.
 */
export declare function gatewayProbeResultSawGateway(status: GatewayProbeReachabilityEvidence): boolean;
/**
 * Builds the health diagnostic emitted when the gateway is reachable but credentials are absent.
 */
export declare function buildCredentialsRequiredHealthDiagnostic(): {
    ok: boolean;
    error: {
        type: string;
        message: string;
    };
    gateway: {
        reachable: boolean;
    };
};
export {};
