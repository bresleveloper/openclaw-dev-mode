/** Find an existing Claude `--mcp-config` argument value. */
export declare function findClaudeMcpConfigPath(args?: string[]): string | undefined;
/** Return Claude args with OpenClaw's strict MCP config path injected. */
export declare function injectClaudeMcpConfigArgs(args: string[] | undefined, mcpConfigPath: string): string[];
/** Writes the active per-attempt capture token into OpenClaw's generated Claude MCP config. */
export declare function writeClaudeMcpCaptureConfig(params: {
    mcpConfigPath: string;
    captureKey: string;
}): Promise<void>;
