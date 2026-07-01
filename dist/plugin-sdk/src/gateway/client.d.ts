import type { GatewayClientMode, GatewayClientName } from "../../packages/gateway-protocol/src/client-info.js";
import type { EventFrame, HelloOk } from "../../packages/gateway-protocol/src/index.js";
import type { DeviceIdentity } from "../infra/device-identity.js";
export type DeviceAuthTokenRecord = {
    token?: string;
    scopes?: string[];
};
export type GatewayClientHostDeps = {
    loadOrCreateDeviceIdentity?: () => DeviceIdentity | undefined;
    signDevicePayload?: (privateKeyPem: string, payload: string) => string;
    publicKeyRawBase64UrlFromPem?: (publicKeyPem: string) => string;
    loadDeviceAuthToken?: (params: {
        deviceId: string;
        role: string;
        env?: NodeJS.ProcessEnv;
    }) => DeviceAuthTokenRecord | null;
    storeDeviceAuthToken?: (params: {
        deviceId: string;
        role: string;
        token: string;
        scopes: string[];
        env?: NodeJS.ProcessEnv;
    }) => void;
    clearDeviceAuthToken?: (params: {
        deviceId: string;
        role: string;
        env?: NodeJS.ProcessEnv;
    }) => void;
    beforeConnect?: () => void;
    registerGatewayLoopbackBypass?: (url: string) => (() => void) | undefined;
    logDebug?: (message: string) => void;
    logError?: (message: string) => void;
    redactForLog?: (message: string) => string;
    normalizeTlsFingerprint?: (fingerprint: string | undefined) => string;
};
export type GatewayClientRequestOptions = {
    expectFinal?: boolean;
    timeoutMs?: number | null;
    signal?: AbortSignal;
    onAccepted?: (payload: unknown) => void;
};
export type GatewayReconnectPausedInfo = {
    code: number;
    reason: string;
    detailCode: string | null;
};
export type GatewayClientCloseInfo = {
    phase: "pre-hello" | "post-hello";
    socketOpened: boolean;
    transportValidated: boolean;
    transientPreHelloCleanClose: boolean;
};
type GatewayClientErrorShape = {
    message: string;
    code?: string;
    details?: unknown;
    retryable?: boolean;
    retryAfterMs?: number;
};
export declare const GATEWAY_CLOSE_CODE_HINTS: Readonly<Record<number, string>>;
export declare const GatewayClientRequestError: {
    new (error: GatewayClientErrorShape): Error & {
        readonly gatewayCode: string;
        readonly details?: unknown;
        readonly retryable: boolean;
        readonly retryAfterMs?: number;
    };
};
export type GatewayClientRequestError = InstanceType<typeof GatewayClientRequestError>;
export declare function describeGatewayCloseCode(code: number): string | undefined;
export declare function isGatewayConnectAssemblyError(value: unknown): value is Error;
export type GatewayClientOptions = {
    url?: string;
    connectChallengeTimeoutMs?: number;
    /** @deprecated Use connectChallengeTimeoutMs. */
    connectDelayMs?: number;
    preauthHandshakeTimeoutMs?: number;
    tickWatchMinIntervalMs?: number;
    tickWatchTimeoutMs?: number;
    requestTimeoutMs?: number;
    token?: string;
    bootstrapToken?: string;
    deviceToken?: string;
    password?: string;
    approvalRuntimeToken?: string;
    instanceId?: string;
    clientName?: GatewayClientName;
    clientDisplayName?: string;
    clientVersion?: string;
    platform?: string;
    deviceFamily?: string;
    mode?: GatewayClientMode;
    role?: string;
    scopes?: string[];
    caps?: string[];
    commands?: string[];
    permissions?: Record<string, boolean>;
    pathEnv?: string;
    env?: NodeJS.ProcessEnv;
    deviceIdentity?: DeviceIdentity | null;
    hostDeps?: GatewayClientHostDeps;
    minProtocol?: number;
    maxProtocol?: number;
    tlsFingerprint?: string;
    onEvent?: (evt: EventFrame) => void;
    onHelloOk?: (hello: HelloOk) => void;
    onConnectError?: (err: Error) => void;
    onReconnectPaused?: (info: GatewayReconnectPausedInfo) => void;
    onClose?: (code: number, reason: string, info?: GatewayClientCloseInfo) => void;
    onGap?: (info: {
        expected: number;
        received: number;
    }) => void;
};
export type GatewayClientConnectionMetadata = {
    clientName?: GatewayClientName;
    hasDeviceIdentity: boolean;
    mode?: GatewayClientMode;
    preauthHandshakeTimeoutMs?: number;
};
export declare function resolveGatewayClientConnectChallengeTimeoutMs(opts: Pick<GatewayClientOptions, "connectChallengeTimeoutMs" | "connectDelayMs" | "env" | "preauthHandshakeTimeoutMs">): number;
export declare class GatewayClient {
    #private;
    constructor(opts: GatewayClientOptions);
    start(): void;
    stop(): void;
    stopAndWait(opts?: {
        timeoutMs?: number;
    }): Promise<void>;
    request<T = Record<string, unknown>>(method: string, params?: unknown, opts?: GatewayClientRequestOptions): Promise<T>;
    getConnectionMetadata(): GatewayClientConnectionMetadata;
}
export type { DeviceIdentity };
