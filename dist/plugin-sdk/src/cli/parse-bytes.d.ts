type BytesParseOptions = {
    defaultUnit?: "b" | "kb" | "mb" | "gb" | "tb";
};
/** Parse a non-negative byte size with optional binary units like kb, mb, gb, or tb. */
export declare function parseByteSize(raw: string, opts?: BytesParseOptions): number;
export {};
