/** Formatter applied to highlighted text segments. */
export type HighlightFormatter = (text: string) => string;
/** Mapping from highlight.js scope names to text formatters. */
export type HighlightTheme = Partial<Record<string, HighlightFormatter>>;
/** Options used when highlighting code and rendering themed text. */
export interface HighlightOptions {
    language?: string;
    ignoreIllegals?: boolean;
    languageSubset?: string[];
    theme?: HighlightTheme;
}
/** Renders highlight.js span HTML into themed plain text. */
export declare function renderHighlightedHtml(html: string, theme?: HighlightTheme): string;
/** Highlights code using an explicit language or highlight.js auto-detection. */
export declare function highlight(code: string, options?: HighlightOptions): string;
/** Returns whether highlight.js has a registered language by this name. */
export declare function supportsLanguage(name: string): boolean;
