import { r as GuardedFetchOptions } from "./fetch-guard-BKvfwdRa.js";
//#region src/infra/net/undici-runtime.d.ts
/** Runtime-loaded undici constructors/functions used where static imports would affect globals. */
type UndiciRuntimeDeps = {
  Agent: typeof import("undici").Agent;
  EnvHttpProxyAgent: typeof import("undici").EnvHttpProxyAgent;
  FormData?: typeof import("undici").FormData;
  ProxyAgent: typeof import("undici").ProxyAgent;
  fetch: typeof import("undici").fetch;
};
type UndiciEnvHttpProxyAgentOptions = ConstructorParameters<UndiciRuntimeDeps["EnvHttpProxyAgent"]>[0];
type UndiciProxyAgentOptions = ConstructorParameters<UndiciRuntimeDeps["ProxyAgent"]>[0];
/** Loads undici lazily, allowing tests to inject constructors without global side effects. */
/**
 * Creates an EnvHttpProxyAgent with OpenClaw proxy TLS, IP-safe proxy pools,
 * timeout propagation, and HTTP/1-only dispatch.
 */
declare function createHttp1EnvHttpProxyAgent(options?: UndiciEnvHttpProxyAgentOptions, timeoutMs?: number): import("undici").EnvHttpProxyAgent;
/**
 * Creates a fixed ProxyAgent with the same HTTP/1, managed TLS, timeout, and
 * IP-safe proxy connection policy used by env proxy dispatchers.
 */
declare function createHttp1ProxyAgent(options: UndiciProxyAgentOptions, timeoutMs?: number): import("undici").ProxyAgent;
//#endregion
//#region src/infra/net/proxy/proxy-tls.d.ts
/** TLS trust material passed to proxy clients for OpenClaw-managed HTTPS proxies. */
type ManagedProxyTlsOptions = Readonly<{
  ca?: string;
}>;
//#endregion
//#region src/infra/net/proxy/managed-proxy-undici.d.ts
type ManagedProxyTlsEnv = NodeJS.ProcessEnv;
type ResolveActiveManagedProxyTlsOptionsParams = {
  proxyUrl?: string;
  env?: ManagedProxyTlsEnv;
};
type AddActiveManagedProxyTlsOptionsParams = {
  env?: ManagedProxyTlsEnv;
};
/** Resolves managed proxy TLS trust only when the target proxy is OpenClaw's active proxy. */
declare function resolveActiveManagedProxyTlsOptions(params?: ResolveActiveManagedProxyTlsOptionsParams): ManagedProxyTlsOptions | undefined;
/** Adds active managed proxy TLS options to env proxy agent options. */
declare function addActiveManagedProxyTlsOptions(options: undefined, params?: AddActiveManagedProxyTlsOptionsParams): {
  proxyTls: ManagedProxyTlsOptions;
} | undefined;
/** Adds active managed proxy TLS options to explicit proxy agent options. */
declare function addActiveManagedProxyTlsOptions<TOptions extends object>(options: TOptions, params?: AddActiveManagedProxyTlsOptionsParams): TOptions | (TOptions & {
  proxyTls: Record<string, unknown>;
});
declare function addActiveManagedProxyTlsOptions<TOptions extends object>(options: TOptions | undefined, params?: AddActiveManagedProxyTlsOptionsParams): TOptions | (TOptions & {
  proxyTls: Record<string, unknown>;
}) | {
  proxyTls: ManagedProxyTlsOptions;
} | undefined;
//#endregion
//#region src/plugin-sdk/fetch-runtime.d.ts
type GuardedFetchPresetOptions = Omit<GuardedFetchOptions, "mode" | "proxy" | "dangerouslyAllowEnvProxyWithoutPinnedDns">;
/** Apply the trusted-env-proxy guarded fetch preset without exposing raw mode strings to plugins. */
declare function withTrustedEnvProxyGuardedFetchMode(params: GuardedFetchPresetOptions): GuardedFetchOptions;
//#endregion
export { createHttp1ProxyAgent as a, createHttp1EnvHttpProxyAgent as i, addActiveManagedProxyTlsOptions as n, resolveActiveManagedProxyTlsOptions as r, withTrustedEnvProxyGuardedFetchMode as t };