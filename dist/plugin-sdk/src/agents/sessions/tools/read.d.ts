import { Type } from "typebox";
import type { AgentTool } from "../../runtime/index.js";
import type { ToolDefinition } from "../extensions/types.js";
import type { ReadToolDetails } from "./tool-contracts.js";
declare const readSchema: Type.TObject<{
    path: Type.TString;
    offset: Type.TOptional<Type.TNumber>;
    limit: Type.TOptional<Type.TNumber>;
}>;
export type { ReadToolDetails, ReadToolInput } from "./tool-contracts.js";
/**
 * Pluggable operations for the read tool.
 * Override these to delegate file reading to remote systems (for example SSH).
 */
export interface ReadOperations {
    /** Resolve a user-supplied path for this read backend. */
    resolvePath?: (filePath: string, cwd: string) => string | Promise<string>;
    /** Decode text bytes for this backend. Custom backends default to UTF-8. */
    decodeText?: (params: {
        buffer: Buffer;
        absolutePath: string;
    }) => string;
    /** Read file contents as a Buffer */
    readFile: (absolutePath: string) => Promise<Buffer>;
    /** Check if file is readable (throw if not) */
    access: (absolutePath: string) => Promise<void>;
    /** Detect image MIME type, return null or undefined for non-images */
    detectImageMimeType?: (absolutePath: string) => Promise<string | null | undefined>;
}
export interface ReadToolOptions {
    /** Whether to auto-resize images to 2000x2000 max. Default: true */
    autoResizeImages?: boolean;
    /** Custom operations for file reading. Default: local filesystem */
    operations?: ReadOperations;
}
export declare function createReadToolDefinition(cwd: string, options?: ReadToolOptions): ToolDefinition<typeof readSchema, ReadToolDetails | undefined>;
export declare function createReadTool(cwd: string, options?: ReadToolOptions): AgentTool<typeof readSchema>;
