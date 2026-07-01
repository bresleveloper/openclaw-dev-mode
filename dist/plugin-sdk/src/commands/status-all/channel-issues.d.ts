/** Groups issue-like rows by channel id while preserving the original issue order per channel. */
export declare function groupChannelIssuesByChannel<T extends {
    channel: string;
}>(issues: readonly T[]): Map<string, T[]>;
