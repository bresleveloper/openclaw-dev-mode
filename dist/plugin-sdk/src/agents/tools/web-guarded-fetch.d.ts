import { type GuardedFetchOptions, type GuardedFetchResult } from "../../infra/net/fetch-guard.js";
type WebToolGuardedFetchOptions = Omit<GuardedFetchOptions, "mode" | "proxy" | "dangerouslyAllowEnvProxyWithoutPinnedDns"> & {
    timeoutSeconds?: number;
    useEnvProxy?: boolean;
};
type WebToolEndpointFetchOptions = Omit<WebToolGuardedFetchOptions, "policy" | "useEnvProxy">;
/** Runs a guarded fetch with strict or trusted-env-proxy web tool policy. */
export declare function fetchWithWebToolsNetworkGuard(params: WebToolGuardedFetchOptions): Promise<GuardedFetchResult>;
/** Runs a fetch for trusted endpoints, allowing env proxy with pinned-host policy. */
export declare function withTrustedWebToolsEndpoint<T>(params: WebToolEndpointFetchOptions, run: (result: {
    response: Response;
    finalUrl: string;
}) => Promise<T>): Promise<T>;
/** Runs a fetch for configured self-hosted endpoints with private-network access allowed. */
export declare function withSelfHostedWebToolsEndpoint<T>(params: WebToolEndpointFetchOptions, run: (result: {
    response: Response;
    finalUrl: string;
}) => Promise<T>): Promise<T>;
/** Runs a fetch under strict SSRF protection without env proxy trust. */
export declare function withStrictWebToolsEndpoint<T>(params: WebToolEndpointFetchOptions, run: (result: {
    response: Response;
    finalUrl: string;
}) => Promise<T>): Promise<T>;
export {};
