type OriginCheckResult = {
    ok: true;
    matchedBy: "allowlist" | "host-header-fallback" | "private-same-origin" | "local-loopback";
} | {
    ok: false;
    reason: string;
};
/** Validate a browser Origin against explicit allowlist, same-host, and local dev rules. */
export declare function checkBrowserOrigin(params: {
    requestHost?: string;
    origin?: string;
    allowedOrigins?: string[];
    allowHostHeaderOriginFallback?: boolean;
    isLocalClient?: boolean;
}): OriginCheckResult;
export {};
