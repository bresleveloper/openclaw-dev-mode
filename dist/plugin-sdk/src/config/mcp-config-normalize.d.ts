type ConfigMcpServers = Record<string, Record<string, unknown>>;
type OpenClawMcpHttpTransport = "sse" | "streamable-http";
/** Maps CLI-native MCP type aliases to OpenClaw HTTP transport names. */
export declare function resolveOpenClawMcpTransportAlias(value: unknown): OpenClawMcpHttpTransport | undefined;
/** Checks whether a raw MCP `type` value is a legacy CLI alias OpenClaw can rewrite. */
export declare function isKnownCliMcpTypeAlias(value: unknown): boolean;
/**
 * Converts operator-friendly MCP server aliases into canonical config keys.
 *
 * Existing canonical fields win over legacy snake_case or `type` aliases so
 * repeated configure commands cannot overwrite already-normalized choices.
 */
export declare function canonicalizeConfiguredMcpServer(server: Record<string, unknown>): Record<string, unknown>;
/** Returns a cloned map of object-shaped MCP server configs, dropping invalid entries. */
export declare function normalizeConfiguredMcpServers(value: unknown): ConfigMcpServers;
export {};
