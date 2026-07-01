import { isRecord } from "../../../utils.js";
import type { ChannelAccountSnapshot, ChannelStatusIssue } from "../types.public.js";
export { isRecord };
/**
 * Normalizes optional string metadata in status issue helpers.
 */
export declare function asString(value: unknown): string | undefined;
/**
 * Formats optional match metadata for status issue messages.
 */
export declare function formatMatchMetadata(params: {
    matchKey?: unknown;
    matchSource?: unknown;
}): string | undefined;
/**
 * Appends formatted match metadata to a status issue message.
 */
export declare function appendMatchMetadata(message: string, params: {
    matchKey?: unknown;
    matchSource?: unknown;
}): string;
/**
 * Resolves the account id for enabled, configured account snapshots.
 */
export declare function resolveEnabledConfiguredAccountId(account: {
    accountId?: unknown;
    enabled?: unknown;
    configured?: unknown;
}): string | null;
/**
 * Collects status issues only for enabled account snapshots.
 */
export declare function collectIssuesForEnabledAccounts<T extends {
    accountId?: unknown;
    enabled?: unknown;
}>(params: {
    accounts: ChannelAccountSnapshot[];
    readAccount: (value: ChannelAccountSnapshot) => T | null;
    collectIssues: (params: {
        account: T;
        accountId: string;
        issues: ChannelStatusIssue[];
    }) => void;
}): ChannelStatusIssue[];
