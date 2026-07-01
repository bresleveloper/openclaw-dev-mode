import type { DeviceIdentity } from "./device-identity.js";
import { type ApnsRelayConfig, type ApnsRelayRequestSender, resolveApnsRelayConfigFromEnv } from "./push-apns.relay.js";
type ApnsEnvironment = "sandbox" | "production";
type ApnsTransport = "direct" | "relay";
type DirectApnsRegistration = {
    nodeId: string;
    transport: "direct";
    token: string;
    topic: string;
    environment: ApnsEnvironment;
    updatedAtMs: number;
};
type RelayApnsRegistration = {
    nodeId: string;
    transport: "relay";
    relayHandle: string;
    sendGrant: string;
    installationId: string;
    topic: string;
    environment: ApnsEnvironment;
    distribution: "official";
    updatedAtMs: number;
    relayOrigin?: string;
    tokenDebugSuffix?: string;
};
/** Stored APNs registration for either direct device tokens or official relay handles. */
export type ApnsRegistration = DirectApnsRegistration | RelayApnsRegistration;
/** Direct APNs provider authentication used to mint ES256 bearer tokens. */
export type ApnsAuthConfig = {
    teamId: string;
    keyId: string;
    privateKey: string;
};
type ApnsAuthConfigResolution = {
    ok: true;
    value: ApnsAuthConfig;
} | {
    ok: false;
    error: string;
};
/** Normalized APNs push result returned to gateway push/nodes methods. */
export type ApnsPushResult = {
    ok: boolean;
    status: number;
    apnsId?: string;
    reason?: string;
    tokenSuffix: string;
    topic: string;
    environment: ApnsEnvironment;
    transport: ApnsTransport;
};
type ApnsPushAlertResult = ApnsPushResult;
type ApnsPushWakeResult = ApnsPushResult;
type ApnsPushType = "alert" | "background";
type ApnsRequestParams = {
    token: string;
    topic: string;
    environment: ApnsEnvironment;
    bearerToken: string;
    payload: object;
    timeoutMs: number;
    pushType: ApnsPushType;
    priority: "10" | "5";
};
type ApnsRequestResponse = {
    status: number;
    apnsId?: string;
    body: string;
};
type ApnsRequestSender = (params: ApnsRequestParams) => Promise<ApnsRequestResponse>;
type RegisterDirectApnsParams = {
    nodeId: string;
    transport?: "direct";
    token: string;
    topic: string;
    environment?: unknown;
    baseDir?: string;
};
type RegisterRelayApnsParams = {
    nodeId: string;
    transport: "relay";
    relayHandle: string;
    sendGrant: string;
    installationId: string;
    topic: string;
    environment?: unknown;
    distribution?: unknown;
    relayOrigin?: unknown;
    tokenDebugSuffix?: unknown;
    baseDir?: string;
};
type RegisterApnsParams = RegisterDirectApnsParams | RegisterRelayApnsParams;
/** Normalizes the APNs environment string accepted by registration inputs. */
export declare function normalizeApnsEnvironment(value: unknown): ApnsEnvironment | null;
/** Persists a validated direct or relay APNs registration for one node id. */
export declare function registerApnsRegistration(params: RegisterApnsParams): Promise<ApnsRegistration>;
/** Loads one normalized APNs registration by node id. */
export declare function loadApnsRegistration(nodeId: string, baseDir?: string): Promise<ApnsRegistration | null>;
/** Loads normalized APNs registrations for the requested node ids, preserving request order. */
export declare function loadApnsRegistrations(nodeIds: readonly string[], baseDir?: string): Promise<Array<{
    nodeId: string;
    registration: ApnsRegistration;
}>>;
/** Clears a registration only if storage still contains the caller's observed value. */
export declare function clearApnsRegistrationIfCurrent(params: {
    nodeId: string;
    registration: ApnsRegistration;
    baseDir?: string;
}): Promise<boolean>;
/** Returns true for APNs responses that mean the direct device token is no longer usable. */
export declare function shouldInvalidateApnsRegistration(result: {
    status: number;
    reason?: string;
}): boolean;
/** Decides whether a failed direct push should clear the persisted registration. */
export declare function shouldClearStoredApnsRegistration(params: {
    registration: ApnsRegistration;
    result: {
        status: number;
        reason?: string;
    };
    overrideEnvironment?: ApnsEnvironment | null;
}): boolean;
/** Resolves direct APNs provider auth from env, accepting inline or file-backed keys. */
export declare function resolveApnsAuthConfigFromEnv(env?: NodeJS.ProcessEnv): Promise<ApnsAuthConfigResolution>;
type ApnsAlertCommonParams = {
    nodeId: string;
    title: string;
    body: string;
    timeoutMs?: number;
};
type DirectApnsAlertParams = ApnsAlertCommonParams & {
    registration: DirectApnsRegistration;
    auth: ApnsAuthConfig;
    requestSender?: ApnsRequestSender;
    relayConfig?: never;
    relayRequestSender?: never;
};
type RelayApnsAlertParams = ApnsAlertCommonParams & {
    registration: RelayApnsRegistration;
    relayConfig: ApnsRelayConfig;
    relayRequestSender?: ApnsRelayRequestSender;
    relayGatewayIdentity?: Pick<DeviceIdentity, "deviceId" | "privateKeyPem">;
    auth?: never;
    requestSender?: never;
};
type ApnsBackgroundWakeCommonParams = {
    nodeId: string;
    wakeReason?: string;
    timeoutMs?: number;
};
type DirectApnsBackgroundWakeParams = ApnsBackgroundWakeCommonParams & {
    registration: DirectApnsRegistration;
    auth: ApnsAuthConfig;
    requestSender?: ApnsRequestSender;
    relayConfig?: never;
    relayRequestSender?: never;
};
type RelayApnsBackgroundWakeParams = ApnsBackgroundWakeCommonParams & {
    registration: RelayApnsRegistration;
    relayConfig: ApnsRelayConfig;
    relayRequestSender?: ApnsRelayRequestSender;
    relayGatewayIdentity?: Pick<DeviceIdentity, "deviceId" | "privateKeyPem">;
    auth?: never;
    requestSender?: never;
};
type ApnsExecApprovalAlertCommonParams = {
    nodeId: string;
    approvalId: string;
    timeoutMs?: number;
};
type DirectApnsExecApprovalAlertParams = ApnsExecApprovalAlertCommonParams & {
    registration: DirectApnsRegistration;
    auth: ApnsAuthConfig;
    requestSender?: ApnsRequestSender;
    relayConfig?: never;
    relayRequestSender?: never;
};
type RelayApnsExecApprovalAlertParams = ApnsExecApprovalAlertCommonParams & {
    registration: RelayApnsRegistration;
    relayConfig: ApnsRelayConfig;
    relayRequestSender?: ApnsRelayRequestSender;
    relayGatewayIdentity?: Pick<DeviceIdentity, "deviceId" | "privateKeyPem">;
    auth?: never;
    requestSender?: never;
};
type ApnsExecApprovalResolvedCommonParams = {
    nodeId: string;
    approvalId: string;
    timeoutMs?: number;
};
type DirectApnsExecApprovalResolvedParams = ApnsExecApprovalResolvedCommonParams & {
    registration: DirectApnsRegistration;
    auth: ApnsAuthConfig;
    requestSender?: ApnsRequestSender;
    relayConfig?: never;
    relayRequestSender?: never;
};
type RelayApnsExecApprovalResolvedParams = ApnsExecApprovalResolvedCommonParams & {
    registration: RelayApnsRegistration;
    relayConfig: ApnsRelayConfig;
    relayRequestSender?: ApnsRelayRequestSender;
    relayGatewayIdentity?: Pick<DeviceIdentity, "deviceId" | "privateKeyPem">;
    auth?: never;
    requestSender?: never;
};
/** Sends a visible APNs alert via direct APNs token or relay registration. */
export declare function sendApnsAlert(params: DirectApnsAlertParams | RelayApnsAlertParams): Promise<ApnsPushAlertResult>;
/** Sends a silent background wake via direct APNs token or relay registration. */
export declare function sendApnsBackgroundWake(params: DirectApnsBackgroundWakeParams | RelayApnsBackgroundWakeParams): Promise<ApnsPushWakeResult>;
/** Sends an exec-approval alert notification via direct APNs or relay. */
export declare function sendApnsExecApprovalAlert(params: DirectApnsExecApprovalAlertParams | RelayApnsExecApprovalAlertParams): Promise<ApnsPushAlertResult>;
/** Sends a silent wake telling the app an exec approval changed state. */
export declare function sendApnsExecApprovalResolvedWake(params: DirectApnsExecApprovalResolvedParams | RelayApnsExecApprovalResolvedParams): Promise<ApnsPushWakeResult>;
export { type ApnsRelayConfig, resolveApnsRelayConfigFromEnv };
