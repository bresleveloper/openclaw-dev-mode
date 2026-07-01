import { Type } from "typebox";
import type { AgentTool } from "../../runtime/index.js";
import type { ToolDefinition } from "../extensions/types.js";
import type { BashOperations } from "./bash-operations.js";
import type { BashToolDetails } from "./tool-contracts.js";
declare const bashSchema: Type.TObject<{
    command: Type.TString;
    timeout: Type.TOptional<Type.TNumber>;
}>;
export type { BashToolDetails, BashToolInput } from "./tool-contracts.js";
export type { BashOperations } from "./bash-operations.js";
export declare function resolveBashTimeoutMs(timeoutSeconds: unknown): number | undefined;
/**
 * Create bash operations using OpenClaw runtime's built-in local shell execution backend.
 *
 * This is useful for extensions that intercept user_bash and still want OpenClaw runtime's
 * standard local shell behavior while wrapping or rewriting commands.
 */
export declare function createLocalBashOperations(options?: {
    shellPath?: string;
}): BashOperations;
export interface BashSpawnContext {
    command: string;
    cwd: string;
    env: NodeJS.ProcessEnv;
}
export type BashSpawnHook = (context: BashSpawnContext) => BashSpawnContext;
export interface BashToolOptions {
    /** Custom operations for command execution. Default: local shell */
    operations?: BashOperations;
    /** Command prefix prepended to every command (for example shell setup commands) */
    commandPrefix?: string;
    /** Optional explicit shell path from settings */
    shellPath?: string;
    /** Hook to adjust command, cwd, or env before execution */
    spawnHook?: BashSpawnHook;
}
type BashRenderState = {
    startedAt: number | undefined;
    endedAt: number | undefined;
    interval: NodeJS.Timeout | undefined;
};
export declare function createBashToolDefinition(cwd: string, options?: BashToolOptions): ToolDefinition<typeof bashSchema, BashToolDetails | undefined, BashRenderState>;
export declare function createBashTool(cwd: string, options?: BashToolOptions): AgentTool<typeof bashSchema>;
