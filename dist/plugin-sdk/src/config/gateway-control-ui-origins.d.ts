import type { OpenClawConfig } from "./types.openclaw.js";
/** Non-loopback gateway bind modes that require explicit Control UI allowed origins. */
export type GatewayNonLoopbackBindMode = "lan" | "tailnet" | "custom" | "auto";
/** Narrows arbitrary config/runtime bind values to non-loopback bind modes. */
export declare function isGatewayNonLoopbackBindMode(bind: unknown): bind is GatewayNonLoopbackBindMode;
/** Returns whether Control UI origin config is already explicit enough for non-loopback binds. */
export declare function hasConfiguredControlUiAllowedOrigins(params: {
    allowedOrigins: unknown;
    dangerouslyAllowHostHeaderOriginFallback: unknown;
}): boolean;
/** Resolves the gateway port used when constructing default Control UI origins. */
export declare function resolveGatewayPortWithDefault(port: unknown, fallback?: number): number;
/** Builds loopback plus custom-bind Control UI origins for a resolved gateway port. */
export declare function buildDefaultControlUiAllowedOrigins(params: {
    port: number;
    bind: unknown;
    customBindHost?: string;
}): string[];
/** Seeds safe default Control UI origins before non-loopback gateway startup validation. */
export declare function ensureControlUiAllowedOriginsForNonLoopbackBind(config: OpenClawConfig, opts?: {
    defaultPort?: number;
    requireControlUiEnabled?: boolean;
    /** Resolved runtime bind override. Mirrors Gateway runtime precedence:
     *  explicit CLI/runtime bind wins over gateway.bind. */
    runtimeBind?: unknown;
    /** Resolved runtime port override. Mirrors Gateway runtime precedence:
     *  explicit CLI/runtime port wins over gateway.port. */
    runtimePort?: unknown;
    /** Optional container-detection callback.  When provided and `gateway.bind`
     *  is unset, the function is called to determine whether the runtime will
     *  default to `"auto"` (container) so that origins can be seeded
     *  proactively.  Keeping this as an injected callback avoids a hard
     *  dependency from the config layer on the gateway runtime layer. */
    isContainerEnvironment?: () => boolean;
}): {
    config: OpenClawConfig;
    seededOrigins: string[] | null;
    bind: GatewayNonLoopbackBindMode | null;
};
