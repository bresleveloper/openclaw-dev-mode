/** Resolve a non-negative integer option or return the fallback. */
export declare function resolveNonNegativeIntegerOption(value: number, fallback: number): number;
/** Resolve an integer option with a minimum bound or return the fallback. */
export declare function resolveIntegerOption(value: number, fallback: number, params: {
    min: number;
}): number;
