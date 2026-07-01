/**
 * Tool display metadata registry.
 *
 * Agent UIs use this config to map tool names/actions to stable titles,
 * icons, and detail keys without embedding presentation data in tool handlers.
 */
import type { ToolDisplaySpec as ToolDisplaySpecBase } from "./tool-display-common.js";
type ToolDisplaySpec = ToolDisplaySpecBase & {
    emoji?: string;
};
type ToolDisplayConfig = {
    version: number;
    fallback: ToolDisplaySpec;
    tools: Record<string, ToolDisplaySpec>;
};
/** Static display metadata for known tools plus fallback detail-key selection. */
export declare const TOOL_DISPLAY_CONFIG: ToolDisplayConfig;
export {};
