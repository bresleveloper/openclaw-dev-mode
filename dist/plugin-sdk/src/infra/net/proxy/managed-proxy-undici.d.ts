import type { EnvHttpProxyAgent } from "undici";
import { type ManagedProxyTlsOptions } from "./proxy-tls.js";
type ManagedEnvHttpProxyAgentOptions = ConstructorParameters<typeof EnvHttpProxyAgent>[0];
type ManagedProxyTlsEnv = NodeJS.ProcessEnv;
type ResolveActiveManagedProxyTlsOptionsParams = {
    proxyUrl?: string;
    env?: ManagedProxyTlsEnv;
};
type AddActiveManagedProxyTlsOptionsParams = {
    env?: ManagedProxyTlsEnv;
};
/** Resolves managed proxy TLS trust only when the target proxy is OpenClaw's active proxy. */
export declare function resolveActiveManagedProxyTlsOptions(params?: ResolveActiveManagedProxyTlsOptionsParams): ManagedProxyTlsOptions | undefined;
/** Adds active managed proxy TLS options to env proxy agent options. */
export declare function addActiveManagedProxyTlsOptions(options: undefined, params?: AddActiveManagedProxyTlsOptionsParams): {
    proxyTls: ManagedProxyTlsOptions;
} | undefined;
/** Adds active managed proxy TLS options to explicit proxy agent options. */
export declare function addActiveManagedProxyTlsOptions<TOptions extends object>(options: TOptions, params?: AddActiveManagedProxyTlsOptionsParams): TOptions | (TOptions & {
    proxyTls: Record<string, unknown>;
});
export declare function addActiveManagedProxyTlsOptions<TOptions extends object>(options: TOptions | undefined, params?: AddActiveManagedProxyTlsOptionsParams): TOptions | (TOptions & {
    proxyTls: Record<string, unknown>;
}) | {
    proxyTls: ManagedProxyTlsOptions;
} | undefined;
/** Resolves env proxy options with managed proxy TLS attached when applicable. */
export declare function resolveManagedEnvHttpProxyAgentOptions(env?: NodeJS.ProcessEnv): ManagedEnvHttpProxyAgentOptions | undefined;
export {};
