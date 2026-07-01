/** Session-scoped embedded LSP runtime and tool materialization for agent bundles. */
import { type ChildProcess } from "node:child_process";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type StdioMcpServerLaunchConfig } from "./mcp-stdio.js";
import type { AnyAgentTool } from "./tools/common.js";
type LspServerCapabilities = {
    hoverProvider?: boolean;
    completionProvider?: boolean;
    definitionProvider?: boolean;
    referencesProvider?: boolean;
    diagnosticProvider?: boolean;
    [key: string]: unknown;
};
/** Materialized LSP tools plus session capabilities and cleanup handle. */
export type BundleLspToolRuntime = {
    tools: AnyAgentTool[];
    sessions: Array<{
        serverName: string;
        capabilities: LspServerCapabilities;
    }>;
    dispose: () => Promise<void>;
};
/** Spawns one LSP server process using sanitized host env and Windows shim handling. */
export declare function spawnLspServerProcess(config: StdioMcpServerLaunchConfig): ChildProcess;
export declare function createBundleLspToolRuntime(params: {
    workspaceDir: string;
    cfg?: OpenClawConfig;
    reservedToolNames?: Iterable<string>;
}): Promise<BundleLspToolRuntime>;
export declare function disposeAllBundleLspRuntimes(): Promise<void>;
export {};
