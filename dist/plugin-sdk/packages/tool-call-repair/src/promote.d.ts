import { type PlainTextToolCallBlock } from "./payload.js";
/** Resolves model-emitted tool names to the exact names allowed by the provider request. */
export type ToolCallRepairNameResolver = (rawName: string, allowedToolNames: Set<string>) => string | null;
/** Builds a provider-native tool-call block from a repaired plain-text payload. */
export type PromotedPlainTextToolCallBlockFactory = (block: PlainTextToolCallBlock, resolvedName: string) => Record<string, unknown>;
/** Controls when standalone assistant text may be rewritten as tool-call content. */
export type PlainTextToolCallPromotionOptions = {
    allowedStopReasons?: ReadonlySet<unknown>;
    allowedToolNames: Set<string>;
    createToolCallBlock: PromotedPlainTextToolCallBlockFactory;
    isRetainableNonTextBlock?: (block: Record<string, unknown>) => boolean;
    message: unknown;
    requireAssistantRole?: boolean;
    resolveToolName?: ToolCallRepairNameResolver;
};
/** Extracts candidate standalone tool-call text while rejecting mixed unsafe content. */
export declare function extractStandalonePlainTextToolCallText(params: {
    allowOtherNonTextBlocks?: boolean;
    allowedStopReasons?: ReadonlySet<unknown>;
    isRetainableNonTextBlock?: (block: Record<string, unknown>) => boolean;
    message: unknown;
    requireAssistantRole?: boolean;
}): string | undefined;
/** Promotes standalone plain-text tool-call messages into provider-native content blocks. */
export declare function promoteStandalonePlainTextToolCallMessage(options: PlainTextToolCallPromotionOptions): Record<string, unknown> | undefined;
