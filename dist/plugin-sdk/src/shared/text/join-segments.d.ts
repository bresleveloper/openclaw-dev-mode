/** Concatenates two optional text blocks, preserving the right block's explicit empty string. */
export declare function concatOptionalTextSegments(params: {
    left?: string;
    right?: string;
    separator?: string;
}): string | undefined;
/** Joins non-empty string segments, optionally trimming each segment before presence checks. */
export declare function joinPresentTextSegments(segments: ReadonlyArray<string | null | undefined>, options?: {
    separator?: string;
    trim?: boolean;
}): string | undefined;
