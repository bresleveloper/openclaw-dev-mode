import { Type } from "typebox";
import type { AgentTool } from "../../runtime/index.js";
import type { ToolDefinition } from "../extensions/types.js";
declare const writeSchema: Type.TObject<{
    path: Type.TString;
    content: Type.TString;
}>;
export type { WriteToolInput } from "./tool-contracts.js";
/**
 * Pluggable operations for the write tool.
 * Override these to delegate file writing to remote systems (for example SSH).
 */
export interface WriteOperations {
    /** Write content to a file */
    writeFile: (absolutePath: string, content: string) => Promise<void>;
    /** Create directory recursively */
    mkdir: (dir: string) => Promise<void>;
    /** Optional readback used to recover when a write succeeded but the tool aborted before returning */
    readFile?: (absolutePath: string) => Promise<Buffer | string>;
    /** Optional stat used to avoid reporting success for files that already matched before execution */
    statFile?: (absolutePath: string) => Promise<WriteToolFileStat | null>;
}
export interface WriteToolOptions {
    /** Custom operations for file writing. Default: local filesystem */
    operations?: WriteOperations;
}
type WriteToolFileStat = {
    type: "file" | "directory" | "other";
    size: number;
    mtimeMs?: number;
};
export declare function createWriteToolDefinition(cwd: string, options?: WriteToolOptions): ToolDefinition<typeof writeSchema, undefined>;
export declare function createWriteTool(cwd: string, options?: WriteToolOptions): AgentTool<typeof writeSchema>;
