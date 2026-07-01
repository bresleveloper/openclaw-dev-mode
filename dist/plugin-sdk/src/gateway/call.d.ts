import { type GatewayClientMode, type GatewayClientName } from "../../packages/gateway-protocol/src/client-info.js";
import { resolveConfigPath as resolveConfigPathFromPaths, resolveGatewayPort as resolveGatewayPortFromPaths, resolveStateDir as resolveStateDirFromPaths } from "../config/paths.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { loadDeviceAuthToken } from "../infra/device-auth-store.js";
import { loadOrCreateDeviceIdentity, type DeviceIdentity } from "../infra/device-identity.js";
import { loadGatewayTlsRuntime } from "../infra/tls/gateway.js";
import { GatewayClient, type GatewayClientOptions, type GatewayClientRequestOptions } from "./client.js";
import { type GatewayConnectionDetails } from "./connection-details.js";
import { resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs.js";
import { type ExplicitGatewayAuth } from "./credentials.js";
import { type OperatorScope } from "./method-scopes.js";
export type { GatewayConnectionDetails };
export type GatewayRequestFunction = <T = Record<string, unknown>>(method: string, params?: unknown, opts?: GatewayClientRequestOptions) => Promise<T>;
type CallGatewayBaseOptions = {
    url?: string;
    token?: string;
    password?: string;
    tlsFingerprint?: string;
    config?: OpenClawConfig;
    method: string;
    params?: unknown;
    expectFinal?: boolean;
    timeoutMs?: number;
    signal?: AbortSignal;
    onAccepted?: GatewayClientRequestOptions["onAccepted"];
    onSignalAbort?: (request: GatewayRequestFunction) => Promise<void> | void;
    clientName?: GatewayClientName;
    clientDisplayName?: string;
    clientVersion?: string;
    platform?: string;
    mode?: GatewayClientMode;
    approvalRuntimeToken?: string;
    useStoredDeviceAuth?: boolean;
    requiredStoredDeviceAuthScopes?: OperatorScope[];
    requireLocalBackendSharedAuth?: boolean;
    deviceIdentity?: DeviceIdentity | null;
    instanceId?: string;
    minProtocol?: number;
    maxProtocol?: number;
    requiredMethods?: string[];
    /**
     * Overrides the config path shown in connection error details.
     * Does not affect config loading; callers still control auth via opts.token/password/env/config.
     */
    configPath?: string;
    /**
     * Explicit local gateway port for command-line overrides such as `gateway health --port`.
     * Bypasses OPENCLAW_GATEWAY_URL and OPENCLAW_GATEWAY_PORT for this call only.
     */
    localPortOverride?: number;
};
export type CallGatewayCliOptions = CallGatewayBaseOptions & {
    scopes?: OperatorScope[];
};
export type CallGatewayOptions = CallGatewayBaseOptions & {
    scopes?: OperatorScope[];
};
export type GatewayTransportErrorKind = "closed" | "timeout";
export declare class GatewayTransportError extends Error {
    readonly kind: GatewayTransportErrorKind;
    readonly connectionDetails: GatewayConnectionDetails;
    readonly code?: number;
    readonly reason?: string;
    readonly timeoutMs?: number;
    constructor(params: {
        kind: GatewayTransportErrorKind;
        message: string;
        connectionDetails: GatewayConnectionDetails;
        code?: number;
        reason?: string;
        timeoutMs?: number;
    });
}
export declare class GatewayCredentialsRequiredError extends Error {
    readonly method: string;
    readonly configPath: string;
    constructor(params: {
        method: string;
        configPath: string;
    });
}
export declare class GatewayExplicitAuthRequiredError extends Error {
    constructor(message: string);
}
export declare class GatewayStoredDeviceAuthUnavailableError extends Error {
    constructor(message: string);
}
export declare class GatewayLocalBackendSharedAuthUnavailableError extends Error {
    constructor(message: string);
}
export type GatewayTransportErrorJson = {
    ok: false;
    error: {
        type: "gateway_transport_error";
        kind: GatewayTransportErrorKind;
        message: string;
        code?: number;
        reason?: string;
        timeoutMs?: number;
    };
    gateway: {
        url: string;
        urlSource: string;
        bindDetail?: string;
        remoteFallbackNote?: string;
    };
};
export type GatewayClientRequestErrorJson = {
    ok: false;
    error: {
        type: "gateway_request_error";
        code: string;
        message: string;
        details?: unknown;
        retryable: boolean;
        retryAfterMs?: number;
    };
};
export type GatewayProbeConnectionDetails = GatewayConnectionDetails & {
    tlsFingerprint?: string;
    preauthHandshakeTimeoutMs?: number;
};
export declare function formatGatewayTransportErrorJson(value: unknown): GatewayTransportErrorJson | null;
export declare function formatGatewayClientRequestErrorJson(value: unknown): GatewayClientRequestErrorJson | null;
export declare function isGatewayTransportError(value: unknown): value is GatewayTransportError;
export declare function isGatewayCredentialsRequiredError(value: unknown): value is GatewayCredentialsRequiredError;
export declare function isGatewayExplicitAuthRequiredError(value: unknown): value is GatewayExplicitAuthRequiredError;
declare const defaultCreateGatewayClient: (opts: GatewayClientOptions) => GatewayClient;
type GatewayRuntimeConfigLoader = () => OpenClawConfig | Promise<OpenClawConfig>;
declare const defaultGatewayCallDeps: {
    createGatewayClient: typeof defaultCreateGatewayClient;
    getRuntimeConfig: GatewayRuntimeConfigLoader;
    loadOrCreateDeviceIdentity: typeof loadOrCreateDeviceIdentity;
    resolveGatewayPort: typeof resolveGatewayPortFromPaths;
    resolveConfigPath: typeof resolveConfigPathFromPaths;
    resolveStateDir: typeof resolveStateDirFromPaths;
    loadGatewayTlsRuntime: typeof loadGatewayTlsRuntime;
    loadDeviceAuthToken: typeof loadDeviceAuthToken;
};
export declare function buildGatewayConnectionDetails(options?: {
    config?: OpenClawConfig;
    url?: string;
    configPath?: string;
    urlSource?: "cli" | "env";
    ignoreEnvUrlOverride?: boolean;
    localPortOverride?: number;
}): GatewayConnectionDetails;
export declare const testing: {
    setDepsForTests(deps: Partial<typeof defaultGatewayCallDeps> | undefined): void;
    resetDepsForTests(): void;
};
export type { ExplicitGatewayAuth } from "./credentials.js";
export declare function resolveExplicitGatewayAuth(opts?: ExplicitGatewayAuth): ExplicitGatewayAuth;
export declare function ensureExplicitGatewayAuth(params: {
    urlOverride?: string;
    urlOverrideSource?: "cli" | "env";
    explicitAuth?: ExplicitGatewayAuth;
    resolvedAuth?: ExplicitGatewayAuth;
    errorHint: string;
    configPath?: string;
}): void;
export { resolveGatewayCredentialsWithSecretInputs };
export declare function buildGatewayProbeConnectionDetails(opts?: Pick<CallGatewayBaseOptions, "config" | "configPath" | "localPortOverride" | "password" | "tlsFingerprint" | "token" | "url">): Promise<GatewayProbeConnectionDetails>;
export declare function callGatewayCli<T = Record<string, unknown>>(opts: CallGatewayCliOptions): Promise<T>;
export declare function callGatewayLeastPrivilege<T = Record<string, unknown>>(opts: CallGatewayBaseOptions): Promise<T>;
export declare function callGateway<T = Record<string, unknown>>(opts: CallGatewayOptions): Promise<T>;
export declare function randomIdempotencyKey(): `${string}-${string}-${string}-${string}-${string}`;
export { testing as __testing };
