import { fetchWithSsrFGuard, shouldUseEnvHttpProxyForUrl } from "./openclaw-runtime-network.js";
import type { SsrFPolicy } from "./ssrf-policy.js";
/** Proxy mode used only for URLs that the runtime classified as env-proxy safe. */
export declare const MEMORY_REMOTE_TRUSTED_ENV_PROXY_MODE = "trusted_env_proxy";
/** Build an SSRF allow policy from a configured remote base URL. */
export declare const buildRemoteBaseUrlPolicy: (baseUrl: string) => SsrFPolicy | undefined;
/** Execute a remote HTTP request under SSRF guard and always release the response handle. */
export declare function withRemoteHttpResponse<T>(params: {
    url: string;
    init?: RequestInit;
    signal?: AbortSignal;
    ssrfPolicy?: SsrFPolicy;
    fetchImpl?: typeof fetch;
    fetchWithSsrFGuardImpl?: typeof fetchWithSsrFGuard;
    shouldUseEnvHttpProxyForUrlImpl?: typeof shouldUseEnvHttpProxyForUrl;
    auditContext?: string;
    onResponse: (response: Response) => Promise<T>;
}): Promise<T>;
