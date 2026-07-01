/**
 * Compatibility wrapper for account-id normalization.
 *
 * Runtime code imports this utility when it needs the older utils path while
 * the canonical normalization logic lives in routing/account-id.
 */
/** Normalize an optional account id, returning undefined for blank/invalid input. */
export declare function normalizeAccountId(value?: string): string | undefined;
