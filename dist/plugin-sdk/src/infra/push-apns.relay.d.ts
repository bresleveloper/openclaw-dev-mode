import type { GatewayConfig } from "../config/types.gateway.js";
import { type DeviceIdentity } from "./device-identity.js";
type ApnsRelayPushType = "alert" | "background";
type ApnsRelayEnvironment = "production" | "sandbox";
/** Resolved APNs relay endpoint and client timeout for gateway-originated sends. */
export type ApnsRelayConfig = {
    baseUrl: string;
    timeoutMs: number;
};
type ApnsRelayConfigResolution = {
    ok: true;
    value: ApnsRelayConfig;
} | {
    ok: false;
    error: string;
};
type ApnsRelayConfigResolutionOptions = {
    registrationRelayOrigin?: string;
};
/** Normalized relay response after the hosted relay has attempted an APNs send. */
export type ApnsRelayPushResponse = {
    ok: boolean;
    status: number;
    apnsId?: string;
    reason?: string;
    environment?: ApnsRelayEnvironment;
    tokenSuffix?: string;
};
/** Test/integration seam for sending a signed APNs relay request. */
export type ApnsRelayRequestSender = (params: {
    relayConfig: ApnsRelayConfig;
    sendGrant: string;
    relayHandle: string;
    gatewayDeviceId: string;
    signature: string;
    signedAtMs: number;
    bodyJson: string;
    pushType: ApnsRelayPushType;
    priority: "10" | "5";
    payload: object;
}) => Promise<ApnsRelayPushResponse>;
/** Hosted APNs relay origin used only when registrations prove they were minted there. */
export declare const DEFAULT_APNS_RELAY_BASE_URL = "https://ios-push-relay.openclaw.ai";
export declare const DEFAULT_APNS_SANDBOX_RELAY_BASE_URL = "https://ios-push-relay-sandbox.openclaw.ai";
/** Validate and canonicalize an APNs relay base URL for config and registration origins. */
export declare function normalizeApnsRelayBaseUrl(baseUrl: string, env?: NodeJS.ProcessEnv): {
    ok: true;
    value: string;
} | {
    ok: false;
    error: string;
};
/** Resolve the relay endpoint from env/config and require it to match relay-minted registrations. */
export declare function resolveApnsRelayConfigFromEnv(env?: NodeJS.ProcessEnv, gatewayConfig?: GatewayConfig, options?: ApnsRelayConfigResolutionOptions): ApnsRelayConfigResolution;
/** Sign and send an APNs relay push using the gateway device identity. */
export declare function sendApnsRelayPush(params: {
    relayConfig: ApnsRelayConfig;
    sendGrant: string;
    relayHandle: string;
    pushType: ApnsRelayPushType;
    priority: "10" | "5";
    payload: object;
    gatewayIdentity?: Pick<DeviceIdentity, "deviceId" | "privateKeyPem">;
    requestSender?: ApnsRelayRequestSender;
}): Promise<ApnsRelayPushResponse>;
export {};
