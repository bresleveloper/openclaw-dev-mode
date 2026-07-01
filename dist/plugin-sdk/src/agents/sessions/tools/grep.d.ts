import { Type } from "typebox";
import type { AgentTool } from "../../runtime/index.js";
import type { ToolDefinition } from "../extensions/types.js";
import type { GrepToolDetails } from "./tool-contracts.js";
declare const grepSchema: Type.TObject<{
    pattern: Type.TString;
    path: Type.TOptional<Type.TString>;
    glob: Type.TOptional<Type.TString>;
    ignoreCase: Type.TOptional<Type.TBoolean>;
    literal: Type.TOptional<Type.TBoolean>;
    context: Type.TOptional<Type.TNumber>;
    limit: Type.TOptional<Type.TNumber>;
}>;
export type { GrepToolDetails, GrepToolInput } from "./tool-contracts.js";
/**
 * Pluggable operations for the grep tool.
 * Override these to delegate search to remote systems (for example SSH).
 */
export interface GrepOperations {
    /** Check if path is a directory. Throws if path does not exist. */
    isDirectory: (absolutePath: string) => Promise<boolean> | boolean;
    /** Read file contents for context lines */
    readFile: (absolutePath: string) => Promise<string> | string;
}
export interface GrepToolOptions {
    /** Custom operations for grep. Default: local filesystem plus ripgrep */
    operations?: GrepOperations;
}
export declare function createGrepToolDefinition(cwd: string, options?: GrepToolOptions): ToolDefinition<typeof grepSchema, GrepToolDetails | undefined>;
export declare function createGrepTool(cwd: string, options?: GrepToolOptions): AgentTool<typeof grepSchema>;
