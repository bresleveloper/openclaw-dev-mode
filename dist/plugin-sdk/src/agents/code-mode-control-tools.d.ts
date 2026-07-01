import type { AnyAgentTool } from "./tools/common.js";
/** Model-visible Code Mode exec tool name. */
export declare const CODE_MODE_EXEC_TOOL_NAME = "exec";
/** Model-visible Code Mode wait tool name. */
export declare const CODE_MODE_WAIT_TOOL_NAME = "wait";
/** Hook metadata kind for Code Mode exec tools. */
export declare const CODE_MODE_EXEC_TOOL_KIND = "code_mode_exec";
/** Hook metadata kind type for Code Mode exec tools. */
export type CodeModeExecToolKind = typeof CODE_MODE_EXEC_TOOL_KIND;
/** Source language accepted by the Code Mode exec tool. */
export type CodeModeExecToolInputKind = "javascript" | "typescript";
/** Metadata attached to before-tool-call events for Code Mode exec. */
export type CodeModeExecHookMetadata = {
    toolKind: CodeModeExecToolKind;
    toolInputKind?: CodeModeExecToolInputKind;
};
/** Mark a tool as owned by code mode control flow. */
export declare function markCodeModeControlTool<T extends AnyAgentTool>(tool: T): T;
/** Return whether a tool was marked as code-mode owned. */
export declare function isCodeModeControlTool(tool: AnyAgentTool): boolean;
/** Build before-tool-call metadata for a marked code-mode exec tool. */
export declare function getCodeModeExecBeforeHookMetadata(params: {
    tool: AnyAgentTool;
    params: unknown;
}): CodeModeExecHookMetadata | undefined;
/** Build before-tool-call metadata when only the tool kind is available. */
export declare function getCodeModeExecBeforeHookMetadataForToolKind(params: {
    toolKind: unknown;
    params: unknown;
}): CodeModeExecHookMetadata | undefined;
/** Normalize before-hook params for a marked code-mode exec tool. */
export declare function normalizeCodeModeExecBeforeHookParams(params: {
    tool: AnyAgentTool;
    params: unknown;
}): unknown;
/** Normalize before-hook params when only the code-mode tool kind is available. */
export declare function normalizeCodeModeExecBeforeHookParamsForToolKind(params: {
    toolKind: unknown;
    params: unknown;
}): unknown;
/** Reconcile hook-adjusted `code` and `command` fields after code-mode normalization. */
export declare function reconcileCodeModeExecBeforeHookParams(params: {
    tool: AnyAgentTool;
    originalParams: unknown;
    hookParams: unknown;
    adjustedParams: unknown;
}): unknown;
