import { type ToolDetailMode } from "./tool-display-exec.js";
type ToolDisplayActionSpec = {
    label?: string;
    detailKeys?: string[];
};
/** Display metadata for a tool and optional per-action labels/details. */
export type ToolDisplaySpec = {
    title?: string;
    label?: string;
    detailKeys?: string[];
    actions?: Record<string, ToolDisplayActionSpec>;
};
/** Normalized display target for code/search bridge tools. */
type ToolSearchCodeDisplayTarget = {
    toolName: string;
    displayToolName?: string;
    displayArgs?: Record<string, unknown>;
    detail?: string;
    bridgeVerb?: "call" | "describe" | "search";
};
type CoerceDisplayValueOptions = {
    includeFalse?: boolean;
    includeZero?: boolean;
    includeNonFinite?: boolean;
    maxStringChars?: number;
    maxArrayEntries?: number;
};
/** Normalize a tool name for fallback display. */
export declare function normalizeToolName(name?: string): string;
/** Convert a tool identifier into a human-readable title. */
export declare function defaultTitle(name: string): string;
/** Resolve display verb/detail from tool args and optional display metadata. */
export declare function resolveToolVerbAndDetailForArgs(params: {
    toolKey: string;
    args?: unknown;
    meta?: string;
    spec?: ToolDisplaySpec;
    fallbackDetailKeys?: string[];
    detailMode: "first" | "summary";
    toolDetailMode?: ToolDetailMode;
    detailCoerce?: CoerceDisplayValueOptions;
    detailMaxEntries?: number;
    detailFormatKey?: (raw: string) => string;
}): {
    verb?: string;
    detail?: string;
};
/** Format a detail path/key into a short display label. */
export declare function formatDetailKey(raw: string, overrides?: Record<string, string>): string;
/** Infer the bridged tool target displayed for tool_search_code snippets. */
export declare function resolveToolSearchCodeDisplayTarget(args: unknown): ToolSearchCodeDisplayTarget | undefined;
/** Normalize final detail text before attaching it to a tool display line. */
export declare function formatToolDetailText(detail: string | undefined, opts?: {
    prefixWithWith?: boolean;
}): string | undefined;
export {};
