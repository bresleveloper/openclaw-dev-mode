/** Generates a cryptographically secure UUID for runtime ids and cache keys. */
export declare function generateSecureUuid(): string;
/** Generates a URL-safe cryptographic token from the requested byte count. */
export declare function generateSecureToken(bytes?: number): string;
/** Generates a hex-encoded cryptographic token from the requested byte count. */
export declare function generateSecureHex(bytes?: number): string;
/** Returns a cryptographically secure fraction in the range [0, 1). */
export declare function generateSecureFraction(): number;
/** Generates a cryptographically secure integer in `[0, maxExclusive)`. */
export declare function generateSecureInt(maxExclusive: number): number;
/** Generates a cryptographically secure integer in `[minInclusive, maxExclusive)`. */
export declare function generateSecureInt(minInclusive: number, maxExclusive: number): number;
