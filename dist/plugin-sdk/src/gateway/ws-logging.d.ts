/**
 * Runtime control for gateway WebSocket logging verbosity.
 */
export type GatewayWsLogStyle = "auto" | "full" | "compact";
/** Overrides gateway WebSocket log formatting for tests or explicit runtime config. */
export declare function setGatewayWsLogStyle(style: GatewayWsLogStyle): void;
/** Returns the active gateway WebSocket log style. */
export declare function getGatewayWsLogStyle(): GatewayWsLogStyle;
export declare const DEFAULT_WS_SLOW_MS = 50;
