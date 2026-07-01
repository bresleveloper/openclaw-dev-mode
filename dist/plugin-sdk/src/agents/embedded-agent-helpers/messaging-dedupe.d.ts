/**
 * Normalize text for duplicate comparison.
 * - Trims whitespace
 * - Lowercases
 * - Strips emoji (Emoji_Presentation and Extended_Pictographic)
 * - Collapses multiple spaces to single space
 */
export declare function normalizeTextForComparison(text: string): string;
/** Compare already-normalized message text against prior sends. */
export declare function isMessagingToolDuplicateNormalized(normalized: string, normalizedSentTexts: string[]): boolean;
/** Return true when raw message text duplicates a prior sent message. */
export declare function isMessagingToolDuplicate(text: string, sentTexts: string[]): boolean;
