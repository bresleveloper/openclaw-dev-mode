import type { SessionSystemPromptReport } from "../../config/sessions/types.js";
type ContextTreemapSessionStats = {
    cachedContextTokens: number | null;
    contextWindowTokens: number | null;
};
/** Renders a prompt context treemap PNG and returns the written file path. */
export declare function renderContextTreemapPng(params: {
    report: SessionSystemPromptReport;
    session: ContextTreemapSessionStats;
}): Promise<{
    path: string;
    trackedChars: number;
    caption: string;
}>;
export {};
