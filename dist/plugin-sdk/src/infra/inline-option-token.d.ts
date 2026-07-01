/** Parsed command-line option token, preserving whether `=` appeared in the original token. */
export type InlineOptionToken = {
    name: string;
    hasInlineValue: false;
} | {
    name: string;
    hasInlineValue: true;
    inlineValue: string;
};
/** Splits one CLI-style option token into its flag name and optional inline value. */
export declare function parseInlineOptionToken(token: string): InlineOptionToken;
