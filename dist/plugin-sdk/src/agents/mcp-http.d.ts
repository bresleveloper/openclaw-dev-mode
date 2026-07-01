/** Supported HTTP-based MCP transport flavors. */
export type HttpMcpTransportType = "sse" | "streamable-http";
type HttpMcpServerLaunchConfig = {
    transportType: HttpMcpTransportType;
    url: string;
    headers?: Record<string, string>;
};
type HttpMcpServerLaunchResult = {
    ok: true;
    config: HttpMcpServerLaunchConfig;
} | {
    ok: false;
    reason: string;
};
/** Normalizes an HTTP MCP server config record into a launchable transport config. */
export declare function resolveHttpMcpServerLaunchConfig(raw: unknown, options?: {
    transportType?: HttpMcpTransportType;
    onDroppedHeader?: (key: string, value: unknown) => void;
    onMalformedHeaders?: (value: unknown) => void;
}): HttpMcpServerLaunchResult;
/** Describes an HTTP MCP server launch config without leaking URL credentials. */
export declare function describeHttpMcpServerLaunchConfig(config: HttpMcpServerLaunchConfig): string;
export {};
