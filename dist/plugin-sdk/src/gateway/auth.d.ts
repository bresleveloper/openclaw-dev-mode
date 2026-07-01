import type { IncomingMessage } from "node:http";
import type { GatewayAuthConfig } from "../config/types.gateway.js";
import { type TailscaleWhoisIdentity } from "../infra/tailscale.js";
import { type AuthRateLimiter } from "./auth-rate-limit.js";
import type { ResolvedGatewayAuth } from "./auth-resolve.js";
export { resolveEffectiveSharedGatewayAuth, resolveGatewayAuth, type EffectiveSharedGatewayAuth, type ResolvedGatewayAuth, type ResolvedGatewayAuthMode, type ResolvedGatewayAuthModeSource, } from "./auth-resolve.js";
/** Normalized outcome for gateway shared-secret, Tailscale, device, and proxy auth. */
export type GatewayAuthResult = {
    ok: boolean;
    method?: "none" | "token" | "password" | "tailscale" | "device-token" | "bootstrap-token" | "trusted-proxy";
    user?: string;
    reason?: string;
    /** Present when the request was blocked by the rate limiter. */
    rateLimited?: boolean;
    /** Milliseconds the client should wait before retrying (when rate-limited). */
    retryAfterMs?: number;
};
type ConnectAuth = {
    token?: string;
    password?: string;
};
export type GatewayAuthSurface = "http" | "ws-control-ui";
/** Inputs needed to authorize one HTTP or websocket gateway connection. */
export type AuthorizeGatewayConnectParams = {
    auth: ResolvedGatewayAuth;
    connectAuth?: ConnectAuth | null;
    req?: IncomingMessage;
    trustedProxies?: string[];
    tailscaleWhois?: TailscaleWhoisLookup;
    /**
     * Explicit auth surface. HTTP keeps Tailscale forwarded-header auth disabled.
     * WS Control UI enables it intentionally for tokenless trusted-host login.
     */
    authSurface?: GatewayAuthSurface;
    /** Optional rate limiter instance; when provided, failed attempts are tracked per IP. */
    rateLimiter?: AuthRateLimiter;
    /** Client IP used for rate-limit tracking. Falls back to proxy-aware request IP resolution. */
    clientIp?: string;
    /** Optional limiter scope; defaults to shared-secret auth scope. */
    rateLimitScope?: string;
    /** Trust X-Real-IP only when explicitly enabled. */
    allowRealIpFallback?: boolean;
    /** Optional browser-origin policy for trusted-proxy HTTP requests. */
    browserOriginPolicy?: {
        requestHost?: string;
        origin?: string;
        allowedOrigins?: string[];
        allowHostHeaderOriginFallback?: boolean;
    };
};
type TailscaleWhoisLookup = (ip: string) => Promise<TailscaleWhoisIdentity | null>;
/** Detect forwarded/proxy headers that make loopback requests ineligible for direct-local auth. */
/** Return true when forwarded headers make loopback direct-local auth unsafe. */
export declare function hasForwardedRequestHeaders(req?: IncomingMessage): boolean;
/** Return whether a request is a clean loopback request without forwarded identity headers. */
export declare function isLocalDirectRequest(req?: IncomingMessage, _trustedProxies?: string[], _allowRealIpFallback?: boolean): boolean;
/** Validate that the selected gateway auth mode has the required resolved credentials/config. */
export declare function assertGatewayAuthConfigured(auth: ResolvedGatewayAuth, rawAuthConfig?: GatewayAuthConfig | null): void;
/** Authorize a gateway connection, including rate-limit handling around shared-secret failures. */
export declare function authorizeGatewayConnect(params: AuthorizeGatewayConnectParams): Promise<GatewayAuthResult>;
/** Authorize an HTTP gateway request with Tailscale forwarded-header auth disabled. */
export declare function authorizeHttpGatewayConnect(params: Omit<AuthorizeGatewayConnectParams, "authSurface">): Promise<GatewayAuthResult>;
/** Authorize a Control UI websocket request with the WS-specific auth surface. */
export declare function authorizeWsControlUiGatewayConnect(params: Omit<AuthorizeGatewayConnectParams, "authSurface">): Promise<GatewayAuthResult>;
