/**
 * Model ref auth-profile suffix parser.
 * Splits `provider/model@profile` while preserving model-version and local
 * quantization suffixes that legitimately contain `@`.
 */
/** Split a trailing auth profile suffix from a model ref when one is present. */
export declare function splitTrailingAuthProfile(raw: string): {
    model: string;
    profile?: string;
};
