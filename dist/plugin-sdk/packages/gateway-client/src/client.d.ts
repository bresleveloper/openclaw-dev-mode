import type { EventFrame, HelloOk } from "@openclaw/gateway-protocol";
import { type GatewayClientMode, type GatewayClientName } from "@openclaw/gateway-protocol/client-info";
export type DeviceIdentity = {
    deviceId: string;
    privateKeyPem: string;
    publicKeyPem: string;
};
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
    /** Called once for expectFinal requests after an accepted response, before the final result. */
    onAccepted?: (payload: unknown) => void;
};
type GatewayClientErrorShape = {
    code?: string;
    message?: string;
    details?: unknown;
    retryable?: boolean;
    retryAfterMs?: number;
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
export declare class GatewayClientRequestError extends Error {
    readonly gatewayCode: string;
    readonly details?: unknown;
    readonly retryable: boolean;
    readonly retryAfterMs?: number;
    constructor(error: GatewayClientErrorShape);
}
export declare function isGatewayConnectAssemblyError(value: unknown): value is Error;
export type GatewayClientOptions = {
    url?: string;
    connectChallengeTimeoutMs?: number;
    /** @deprecated Use connectChallengeTimeoutMs. */
    connectDelayMs?: number;
    /**
     * Server-side pre-auth handshake budget. Config-derived local clients use
     * this to keep the connect-challenge watchdog aligned with the gateway.
     */
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
export declare const GATEWAY_CLOSE_CODE_HINTS: Readonly<Record<number, string>>;
export declare function describeGatewayCloseCode(code: number): string | undefined;
export declare function resolveGatewayClientConnectChallengeTimeoutMs(opts: Pick<GatewayClientOptions, "connectChallengeTimeoutMs" | "connectDelayMs" | "env" | "preauthHandshakeTimeoutMs">): number;
export declare class GatewayClient {
    private ws;
    private opts;
    private deps;
    private pending;
    private backoffMs;
    private closed;
    private lastSeq;
    private connectNonce;
    private connectSent;
    private connectTimer;
    private reconnectTimer;
    private pendingDeviceTokenRetry;
    private deviceTokenRetryBudgetUsed;
    private approvalRuntimeTokenCompatibilityDisabled;
    private approvalRuntimeTokenRetryBudgetUsed;
    private pendingStartupReconnectDelayMs;
    private pendingConnectErrorDetailCode;
    private pendingConnectErrorDetails;
    private lastTick;
    private tickIntervalMs;
    private tickTimer;
    private readonly requestTimeoutMs;
    private pendingStop;
    private socketOpened;
    private transportValidated;
    private helloOkReceived;
    private suppressedTransientPreHelloCleanCloses;
    constructor(opts: GatewayClientOptions);
    start(): void;
    stop(): void;
    stopAndWait(opts?: {
        timeoutMs?: number;
    }): Promise<void>;
    private beginStop;
    private createPendingStop;
    private resolvePendingStop;
    private logDebug;
    private logError;
    private sendConnect;
    private assembleConnectParams;
    private buildDeviceConnectParams;
    private handleConnectFailure;
    private notifyConnectError;
    private notifyHelloOk;
    private notifyReconnectPaused;
    private notifyClose;
    private resolveConnectScopes;
    private loadStoredDeviceAuth;
    private shouldPauseReconnectAfterAuthFailure;
    private shouldRetryWithStoredDeviceToken;
    private shouldRetryWithoutApprovalRuntimeToken;
    private isTrustedDeviceRetryEndpoint;
    private selectConnectAuth;
    private handleMessage;
    private beginPreauthHandshake;
    private clearConnectChallengeTimeout;
    private clearReconnectTimer;
    private armConnectChallengeTimeout;
    private scheduleReconnect;
    private flushPendingErrors;
    private startTickWatch;
    private validateTlsFingerprint;
    request<T = Record<string, unknown>>(method: string, params?: unknown, opts?: GatewayClientRequestOptions): Promise<T>;
}
export {};
