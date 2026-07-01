import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AssistantMessage } from "../../llm/types.js";
/** Normalized PDF model preference used by tool registration and execution. */
type PdfModelConfig = {
    primary?: string;
    fallbacks?: string[];
};
/** Reads `pdf` and `pdfs` tool arguments into a trimmed, de-duplicated PDF input list. */
export declare function resolvePdfInputs(record: Record<string, unknown>): string[];
/** Checks whether a provider supports native PDF document input. */
export declare function providerSupportsNativePdf(provider: string): boolean;
/** Parses a page range string into sorted, unique, 1-based page numbers within `maxPages`. */
export declare function parsePageRange(range: string, maxPages: number): number[];
/** Converts a provider assistant message into PDF text or throws a model-labelled failure. */
export declare function coercePdfAssistantText(params: {
    message: AssistantMessage;
    provider: string;
    model: string;
}): string;
/** Reads configured PDF primary/fallback models from agent defaults. */
export declare function coercePdfModelConfig(cfg?: OpenClawConfig): PdfModelConfig;
/** Caps requested PDF response tokens to the selected model's advertised maximum. */
export declare function resolvePdfToolMaxTokens(modelMaxTokens: number | undefined, requestedMaxTokens?: number): number;
export {};
