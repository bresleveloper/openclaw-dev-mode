/** Resolves entry emoji/homepage with metadata taking precedence over frontmatter aliases. */
export declare function resolveEmojiAndHomepage(params: {
    metadata?: {
        emoji?: string;
        homepage?: string;
    } | null;
    frontmatter?: {
        emoji?: string;
        homepage?: string;
        website?: string;
        url?: string;
    } | null;
}): {
    emoji?: string;
    homepage?: string;
};
