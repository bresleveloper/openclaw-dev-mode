import type { ProxyConfig } from "../../../config/zod-schema.proxy.js";
/** TLS trust material passed to proxy clients for OpenClaw-managed HTTPS proxies. */
export type ManagedProxyTlsOptions = Readonly<{
    ca?: string;
}>;
/** Resolves the configured managed proxy CA file, with env/CLI override first. */
export declare function resolveManagedProxyCaFile(params: {
    config?: ProxyConfig;
    caFileOverride?: string;
}): string | undefined;
/** Returns a CA file only for HTTPS proxy URLs; HTTP proxies do not need TLS trust. */
export declare function resolveManagedProxyCaFileForUrl(params: {
    proxyUrl: string | undefined;
    config?: ProxyConfig;
    caFileOverride?: string;
}): string | undefined;
/** Loads managed proxy TLS options asynchronously for startup paths. */
export declare function loadManagedProxyTlsOptions(caFile: string | undefined): Promise<ManagedProxyTlsOptions | undefined>;
/** Loads managed proxy TLS options synchronously for inherited child-process routing. */
export declare function loadManagedProxyTlsOptionsSync(caFile: string | undefined): ManagedProxyTlsOptions | undefined;
