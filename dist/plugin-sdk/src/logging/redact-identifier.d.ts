/** Returns a stable sha256 hex prefix for non-secret identifier correlation. */
export declare function sha256HexPrefix(value: string, len?: number): string;
/** Redacts an identifier to a stable hash label, or "-" for missing values. */
export declare function redactIdentifier(value: string | undefined, opts?: {
    len?: number;
}): string;
