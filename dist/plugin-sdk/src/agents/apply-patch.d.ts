import { Type } from "typebox";
import type { AgentTool } from "./runtime/index.js";
import type { SandboxFsBridge } from "./sandbox/fs-bridge.js";
export type ApplyPatchSummary = {
    added: string[];
    modified: string[];
    deleted: string[];
};
type ApplyPatchResult = {
    summary: ApplyPatchSummary;
    text: string;
};
type ApplyPatchToolDetails = {
    summary: ApplyPatchSummary;
};
type SandboxApplyPatchConfig = {
    root: string;
    bridge: SandboxFsBridge;
};
type ApplyPatchOptions = {
    cwd: string;
    sandbox?: SandboxApplyPatchConfig;
    /** Restrict patch paths to the workspace root (cwd). Default: true. Set false to opt out. */
    workspaceOnly?: boolean;
    signal?: AbortSignal;
};
declare const applyPatchSchema: Type.TObject<{
    input: Type.TString;
}>;
/** Create the agent tool wrapper for applying patch-envelope input. */
export declare function createApplyPatchTool(options?: {
    cwd?: string;
    sandbox?: SandboxApplyPatchConfig;
    workspaceOnly?: boolean;
}): AgentTool<typeof applyPatchSchema, ApplyPatchToolDetails>;
/** Parse and apply a patch envelope to the configured filesystem target. */
export declare function applyPatch(input: string, options: ApplyPatchOptions): Promise<ApplyPatchResult>;
export {};
