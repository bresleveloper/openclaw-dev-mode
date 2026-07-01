/** Normalized stdio MCP server launch config. */
export type StdioMcpServerLaunchConfig = {
    command: string;
    args?: string[];
    env?: Record<string, string>;
    cwd?: string;
};
type StdioMcpServerLaunchResult = {
    ok: true;
    config: StdioMcpServerLaunchConfig;
} | {
    ok: false;
    reason: string;
};
/** Resolve raw MCP server config into a stdio launch config. */
export declare function resolveStdioMcpServerLaunchConfig(raw: unknown, options?: {
    onDroppedEnv?: (key: string, value: unknown) => void;
}): StdioMcpServerLaunchResult;
/** Describe a stdio MCP launch config for diagnostics. */
export declare function describeStdioMcpServerLaunchConfig(config: StdioMcpServerLaunchConfig): string;
export {};
