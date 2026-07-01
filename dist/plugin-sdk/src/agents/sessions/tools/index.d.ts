/**
 * Session tool public barrel.
 *
 * Re-exports built-in tool factories, operation interfaces, contracts, and shared truncation helpers.
 */
export { type BashSpawnContext, type BashSpawnHook, type BashToolOptions, createBashTool, createBashToolDefinition, createLocalBashOperations, } from "./bash.js";
export type { BashOperations } from "./bash-operations.js";
export type { BashToolDetails, BashToolInput, EditToolDetails, EditToolInput, FindToolDetails, FindToolInput, GrepToolDetails, GrepToolInput, LsToolDetails, LsToolInput, ReadToolDetails, ReadToolInput, WriteToolInput, } from "./tool-contracts.js";
export { createEditTool, createEditToolDefinition, type EditOperations, type EditToolOptions, } from "./edit.js";
export { withFileMutationQueue } from "./file-mutation-queue.js";
export { createFindTool, createFindToolDefinition, type FindOperations, type FindToolOptions, } from "./find.js";
export { createGrepTool, createGrepToolDefinition, type GrepOperations, type GrepToolOptions, } from "./grep.js";
export { createLsTool, createLsToolDefinition, type LsOperations, type LsToolOptions, } from "./ls.js";
export { createReadTool, createReadToolDefinition, type ReadOperations, type ReadToolOptions, } from "./read.js";
export { DEFAULT_MAX_BYTES, DEFAULT_MAX_LINES, formatSize, type TruncationOptions, type TruncationResult, truncateHead, truncateLine, truncateTail, } from "./truncate.js";
export { createWriteTool, createWriteToolDefinition, type WriteOperations, type WriteToolOptions, } from "./write.js";
import type { AgentTool } from "../../runtime/index.js";
import type { ToolDefinition } from "../extensions/types.js";
import { type BashToolOptions } from "./bash.js";
import { type EditToolOptions } from "./edit.js";
import { type FindToolOptions } from "./find.js";
import { type GrepToolOptions } from "./grep.js";
import { type LsToolOptions } from "./ls.js";
import { type ReadToolOptions } from "./read.js";
import { type WriteToolOptions } from "./write.js";
/**
 * Public factory barrel for the built-in coding and read-only session tools.
 *
 * Keep grouped creators here so callers can request stable tool sets without importing each
 * individual implementation module.
 */
export type Tool = AgentTool;
export type ToolDef = ToolDefinition;
export type ToolName = "read" | "bash" | "edit" | "write" | "grep" | "find" | "ls";
export declare const allToolNames: Set<ToolName>;
export interface ToolsOptions {
    read?: ReadToolOptions;
    bash?: BashToolOptions;
    write?: WriteToolOptions;
    edit?: EditToolOptions;
    grep?: GrepToolOptions;
    find?: FindToolOptions;
    ls?: LsToolOptions;
}
/** Creates one tool definition by stable built-in tool name. */
export declare function createToolDefinition(toolName: ToolName, cwd: string, options?: ToolsOptions): ToolDef;
/** Creates one executable built-in tool by stable tool name. */
export declare function createTool(toolName: ToolName, cwd: string, options?: ToolsOptions): Tool;
/** Creates the mutable coding tool definitions used by agent coding sessions. */
export declare function createCodingToolDefinitions(cwd: string, options?: ToolsOptions): ToolDef[];
/** Creates read-only discovery tool definitions for restricted sessions. */
export declare function createReadOnlyToolDefinitions(cwd: string, options?: ToolsOptions): ToolDef[];
/** Creates all built-in tool definitions keyed by tool name. */
export declare function createAllToolDefinitions(cwd: string, options?: ToolsOptions): Record<ToolName, ToolDef>;
/** Creates the mutable coding tools used by local agent sessions. */
export declare function createCodingTools(cwd: string, options?: ToolsOptions): Tool[];
/** Creates read-only discovery tools for restricted sessions. */
export declare function createReadOnlyTools(cwd: string, options?: ToolsOptions): Tool[];
/** Creates all built-in tools keyed by tool name. */
export declare function createAllTools(cwd: string, options?: ToolsOptions): Record<ToolName, Tool>;
