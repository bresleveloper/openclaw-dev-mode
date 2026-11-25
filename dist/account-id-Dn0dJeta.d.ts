declare const DEFAULT_ACCOUNT_ID = "default";
declare function normalizeAccountId(value: string | undefined | null): string;
declare function normalizeOptionalAccountId(value: string | undefined | null): string | undefined;
export { normalizeAccountId as n, normalizeOptionalAccountId as r, DEFAULT_ACCOUNT_ID as t };