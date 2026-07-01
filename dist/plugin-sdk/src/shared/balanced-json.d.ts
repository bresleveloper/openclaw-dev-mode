/** JSON opening delimiters supported by the balanced-fragment scanner. */
type JsonOpeningDelimiter = "{" | "[";
/** One balanced JSON object/array fragment found inside arbitrary text. */
type BalancedJsonFragment = {
    json: string;
    startIndex: number;
    endIndex: number;
};
/** Extract the first balanced JSON object/array prefix found in text. */
export declare function extractBalancedJsonPrefix(raw: string, opts?: {
    openers?: readonly JsonOpeningDelimiter[];
}): BalancedJsonFragment | null;
/** Extract every balanced JSON object/array fragment from arbitrary text. */
export declare function extractBalancedJsonFragments(raw: string, opts?: {
    openers?: readonly JsonOpeningDelimiter[];
}): BalancedJsonFragment[];
export {};
