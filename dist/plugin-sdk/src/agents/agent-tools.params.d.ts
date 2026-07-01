/**
 * Shared validation for model-supplied tool parameters.
 * Converts malformed file-tool arguments into retryable errors and fixes the
 * specific XML suffix and Office-extension corruption seen in path arguments.
 */
import type { AnyAgentTool } from "./agent-tools.types.js";
export type RequiredParamGroup = {
    keys: readonly string[];
    allowEmpty?: boolean;
    label?: string;
    validator?: (record: Record<string, unknown>) => boolean;
};
declare function hasValidEditReplacements(record: Record<string, unknown>): boolean;
/** Required parameter groups for file-style tools that need retry guidance. */
export declare const REQUIRED_PARAM_GROUPS: {
    readonly read: readonly [{
        readonly keys: readonly ["path"];
        readonly label: "path";
    }];
    readonly write: readonly [{
        readonly keys: readonly ["path"];
        readonly label: "path";
    }, {
        readonly keys: readonly ["content"];
        readonly label: "content";
    }];
    readonly edit: readonly [{
        readonly keys: readonly ["path"];
        readonly label: "path";
    }, {
        readonly keys: readonly ["edits"];
        readonly label: "edits";
        readonly validator: typeof hasValidEditReplacements;
    }];
};
/** Return a record view of model-supplied tool params when possible. */
export declare function getToolParamsRecord(params: unknown): Record<string, unknown> | undefined;
/** Strip extra closing markers sometimes produced in XML arg_value path params. */
export declare function stripMalformedXmlArgValueSuffix(value: string): string;
/** Normalize known model-hallucinated Office/codex path extensions. */
export declare function normalizeHallucinatedOfficePathExtension(value: string): string;
/** Normalize model-supplied file-tool path params without touching payload text. */
export declare function normalizeFileToolPathParam(value: string): string;
/** Strip malformed XML suffixes from selected string fields without mutating input. */
export declare function stripMalformedXmlArgValueSuffixFromKeys<T extends Record<string, unknown>>(record: T, keys: readonly string[]): T;
/** Normalize selected file-tool path fields without mutating input. */
export declare function normalizeFileToolPathParamsFromKeys<T extends Record<string, unknown>>(record: T, keys: readonly string[]): T;
/** Throw actionable retry guidance when required tool params are missing. */
export declare function assertRequiredParams(record: Record<string, unknown> | undefined, groups: readonly RequiredParamGroup[], toolName: string): void;
/** Wrap a tool execute function with required-parameter validation. */
export declare function wrapToolParamValidation(tool: AnyAgentTool, requiredParamGroups?: readonly RequiredParamGroup[]): AnyAgentTool;
export {};
