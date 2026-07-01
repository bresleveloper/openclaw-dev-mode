/**
 * Keeps UTF-16 chunk boundaries from separating a supplementary-plane character.
 * A one-unit positive limit still needs to emit an entire surrogate pair.
 */
export declare function avoidTrailingHighSurrogateBreak(text: string, start: number, end: number): number;
/**
 * Splits plain text into size-bounded chunks at readable boundaries.
 *
 * Returns the original text as one chunk when the limit is non-positive.
 */
export declare function chunkText(text: string, limit: number): string[];
