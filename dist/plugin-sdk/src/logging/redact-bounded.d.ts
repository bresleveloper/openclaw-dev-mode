type BoundedRedactOptions = {
    chunkThreshold?: number;
    chunkSize?: number;
};
/** Applies a regex replacement in chunks once input crosses the redaction size threshold. */
export declare function replacePatternBounded(text: string, pattern: RegExp, replacer: Parameters<string["replace"]>[1], options?: BoundedRedactOptions): string;
export {};
