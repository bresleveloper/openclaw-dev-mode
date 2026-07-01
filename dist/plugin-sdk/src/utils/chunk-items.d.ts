/** Splits items into fixed-size chunks, preserving order and returning one row for non-positive sizes. */
export declare function chunkItems<T>(items: readonly T[], size: number): T[][];
