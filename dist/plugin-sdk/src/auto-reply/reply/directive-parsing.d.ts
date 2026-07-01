/** Low-level token scanning helpers for inline directive parsers. */
export declare function skipDirectiveArgPrefix(raw: string): number;
/** Reads the next non-whitespace directive token and returns the next scan index. */
export declare function takeDirectiveToken(raw: string, startIndex: number): {
    token: string | null;
    nextIndex: number;
};
