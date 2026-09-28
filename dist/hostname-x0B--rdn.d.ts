import "./fs-safe-defaults-ypw0M2Xi.js";
import { assertNoWindowsNetworkPath, basenameFromMediaSource, hasEncodedFileUrlSeparator, isWindowsNetworkPath, safeFileURLToPath, trySafeFileURLToPath } from "@openclaw/fs-safe/advanced";
//#region src/infra/net/proxy-env.d.ts
declare const PROXY_ENV_KEYS: readonly ["HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "http_proxy", "https_proxy", "all_proxy"];
/** Return whether any supported proxy environment variable is non-blank. */
declare function hasProxyEnvConfigured(env?: NodeJS.ProcessEnv): boolean;
/** Explicit proxy option shape accepted by undici EnvHttpProxyAgent. */
type EnvHttpProxyAgentProxyOptions = {
  /** Proxy URL used for HTTP requests. */
  httpProxy?: string;
  /** Proxy URL used for HTTPS requests. */
  httpsProxy?: string;
};
/**
 * Match undici EnvHttpProxyAgent semantics for env-based HTTP/S proxy selection:
 * - lower-case vars take precedence over upper-case
 * - HTTPS requests prefer https_proxy/HTTPS_PROXY, then fall back to http_proxy/HTTP_PROXY
 * - ALL_PROXY is ignored by EnvHttpProxyAgent
 */
declare function resolveEnvHttpProxyUrl(protocol: "http" | "https", env?: NodeJS.ProcessEnv): string | undefined;
/** Return whether EnvHttpProxyAgent-style HTTP/S proxy resolution finds a proxy URL. */
declare function hasEnvHttpProxyConfigured(protocol?: "http" | "https", env?: NodeJS.ProcessEnv): boolean;
/**
 * Build explicit options for undici's EnvHttpProxyAgent.
 *
 * EnvHttpProxyAgent does not read ALL_PROXY itself, but it accepts explicit
 * HTTP/HTTPS proxy overrides. Keep this helper separate from the
 * HTTP(S)-only URL helpers so SSRF trusted-env proxy gates do not widen.
 */
declare function resolveEnvHttpProxyAgentOptions(env?: NodeJS.ProcessEnv): EnvHttpProxyAgentProxyOptions | undefined;
/** Return whether explicit EnvHttpProxyAgent options can be built from the environment. */
declare function hasEnvHttpProxyAgentConfigured(env?: NodeJS.ProcessEnv): boolean;
/** Return whether a target URL should use configured HTTP/S env proxy variables. */
declare function shouldUseEnvHttpProxyForUrl(targetUrl: string, env?: NodeJS.ProcessEnv): boolean;
/**
 * Check whether a target URL should bypass the HTTP proxy per NO_PROXY env var.
 *
 * Mirrors undici EnvHttpProxyAgent semantics
 * (`undici/lib/dispatcher/env-http-proxy-agent.js`):
 * - Entries separated by commas OR whitespace (undici splits on `/[,\s]/`)
 * - Case-insensitive
 * - A single trailing DNS dot is ignored in both hosts and entries
 * - Lower-case `no_proxy` shadows upper-case `NO_PROXY`, including blank values
 * - Empty or missing → no bypass
 * - Bare `*` value → bypass everything
 * - Exact hostname match
 * - Leading-dot match (`.example.com` matches `foo.example.com`)
 * - Leading `*.` wildcard match (`*.example.com` matches `foo.example.com`);
 *   undici normalizes via `.replace(/^\*?\./, '')`, so the bare domain also
 *   matches (kept in sync with that behavior)
 * - Subdomain suffix match (`openai.com` matches `api.openai.com`)
 * - Optional `:port` suffix; when present, must match target port
 * - IPv6 literals in bracketed (`[::1]`) or bare (`::1`) form
 * - OpenClaw extension: IPv4 CIDR and octet-wildcard entries
 *   (`100.64.0.0/10`, `100.64.*`) bypass the trusted env proxy mode before
 *   undici's EnvHttpProxyAgent is selected.
 *
 * Undici does not export its matcher, so this is a targeted reimplementation
 * kept in sync with the upstream file above. Paired with
 * `hasEnvHttpProxyConfigured` this gates the trusted-env-proxy auto-upgrade
 * in provider HTTP helpers; see openclaw#64974 review thread on NO_PROXY
 * SSRF bypass.
 */
declare function matchesNoProxy(targetUrl: string | URL, env?: NodeJS.ProcessEnv): boolean;
//#endregion
//#region src/infra/net/hostname.d.ts
/** Normalize a hostname for policy comparisons. */
declare function normalizeHostname(hostname: string): string;
//#endregion
export { isWindowsNetworkPath as a, EnvHttpProxyAgentProxyOptions as c, hasEnvHttpProxyConfigured as d, hasProxyEnvConfigured as f, shouldUseEnvHttpProxyForUrl as g, resolveEnvHttpProxyUrl as h, hasEncodedFileUrlSeparator as i, PROXY_ENV_KEYS as l, resolveEnvHttpProxyAgentOptions as m, assertNoWindowsNetworkPath as n, safeFileURLToPath as o, matchesNoProxy as p, basenameFromMediaSource as r, trySafeFileURLToPath as s, normalizeHostname as t, hasEnvHttpProxyAgentConfigured as u };