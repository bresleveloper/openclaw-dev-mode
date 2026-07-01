/** Format a clickable terminal link when supported, otherwise return a readable fallback. */
export declare function formatTerminalLink(label: string, url: string, opts?: {
    fallback?: string;
    force?: boolean;
}): string;
