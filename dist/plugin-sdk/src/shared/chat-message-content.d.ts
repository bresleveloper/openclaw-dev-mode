/** Returns inline string content or the first array text block without scanning later blocks. */
export declare function extractFirstTextBlock(message: unknown): string | undefined;
export type AssistantPhase = "commentary" | "final_answer";
/** Narrows unknown phase metadata to assistant text phases that affect visibility. */
export declare function normalizeAssistantPhase(value: unknown): AssistantPhase | undefined;
/** Parses assistant text block signatures, preserving legacy raw ids when not JSON encoded. */
export declare function parseAssistantTextSignature(value: unknown): {
    id?: string;
    phase?: AssistantPhase;
} | null;
/** Resolves a message phase only when the top-level phase or all explicit blocks agree. */
export declare function resolveAssistantMessagePhase(message: unknown): AssistantPhase | undefined;
/** Finds assistant phase metadata on event payloads that may wrap message-like records. */
export declare function resolveAssistantEventPhase(data: unknown): AssistantPhase | undefined;
/** Extracts assistant text for a requested phase without mixing legacy and explicitly phased text. */
export declare function extractAssistantTextForPhase(message: unknown, options?: {
    phase?: AssistantPhase;
    sanitizeText?: (text: string) => string;
    joinWith?: string;
}): string | undefined;
/** Returns user-visible assistant text, preferring final answers over legacy unphased text. */
export declare function extractAssistantVisibleText(message: unknown): string | undefined;
