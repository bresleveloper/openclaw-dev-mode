import type { ToolDetailMode } from "./tool-display-exec.js";
type ToolDisplay = {
    name: string;
    emoji: string;
    title: string;
    label: string;
    verb?: string;
    detail?: string;
};
/** Resolves the display model for a tool invocation. */
export declare function resolveToolDisplay(params: {
    name?: string;
    args?: unknown;
    meta?: string;
    detailMode?: ToolDetailMode;
}): ToolDisplay;
/** Formats and redacts detail text for display. */
export declare function formatToolDetail(display: ToolDisplay): string | undefined;
/** Builds the compact one-line summary shown in transcripts and logs. */
export declare function formatToolSummary(display: ToolDisplay): string;
export {};
