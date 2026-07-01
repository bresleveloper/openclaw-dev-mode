import type { AnyAgentTool } from "./agent-tools.types.js";
import type { ImageSanitizationLimits } from "./image-sanitization.js";
import type { SandboxFsBridge } from "./sandbox/fs-bridge.js";
export { REQUIRED_PARAM_GROUPS, assertRequiredParams, getToolParamsRecord, wrapToolParamValidation, } from "./agent-tools.params.js";
type OpenClawReadToolOptions = {
    modelContextWindowTokens?: number;
    imageSanitization?: ImageSanitizationLimits;
};
/** Wrap a file tool so path params stay inside the workspace root. */
export declare function wrapToolWorkspaceRootGuard(tool: AnyAgentTool, root: string): AnyAgentTool;
/** Resolve a model-supplied file path against the host workspace root. */
export declare function resolveToolPathAgainstWorkspaceRoot(params: {
    filePath: string;
    root: string;
    containerWorkdir?: string;
}): string;
type MemoryFlushAppendOnlyWriteOptions = {
    root: string;
    relativePath: string;
    containerWorkdir?: string;
    sandbox?: {
        root: string;
        bridge: SandboxFsBridge;
    };
};
/** Restrict a write tool to appending memory-flush content to one path. */
export declare function wrapToolMemoryFlushAppendOnlyWrite(tool: AnyAgentTool, options: MemoryFlushAppendOnlyWriteOptions): AnyAgentTool;
/** Wrap a file tool with workspace guards and optional container path mapping. */
export declare function wrapToolWorkspaceRootGuardWithOptions(tool: AnyAgentTool, root: string, options?: {
    additionalRoots?: readonly string[];
    additionalContainerMounts?: readonly {
        containerRoot: string;
        hostRoot: string;
    }[];
    containerWorkdir?: string;
    pathParamKeys?: readonly string[];
    normalizeGuardedPathParams?: boolean;
}): AnyAgentTool;
type SandboxToolParams = {
    root: string;
    bridge: SandboxFsBridge;
    modelContextWindowTokens?: number;
    imageSanitization?: ImageSanitizationLimits;
};
/** Create a sandbox-backed read tool with OpenClaw result normalization. */
export declare function createSandboxedReadTool(params: SandboxToolParams): AnyAgentTool;
/** Create a sandbox-backed write tool with required-parameter validation. */
export declare function createSandboxedWriteTool(params: SandboxToolParams): AnyAgentTool;
/** Create a sandbox-backed edit tool with required-parameter validation. */
export declare function createSandboxedEditTool(params: SandboxToolParams): AnyAgentTool;
/** Create a host workspace write tool using guarded filesystem operations. */
export declare function createHostWorkspaceWriteTool(root: string, options?: {
    workspaceOnly?: boolean;
}): AnyAgentTool;
/** Create a host workspace edit tool using guarded filesystem operations. */
export declare function createHostWorkspaceEditTool(root: string, options?: {
    workspaceOnly?: boolean;
}): AnyAgentTool;
/** Wrap the base read tool with OpenClaw paging, MIME, and image handling. */
export declare function createOpenClawReadTool(base: AnyAgentTool, options?: OpenClawReadToolOptions): AnyAgentTool;
