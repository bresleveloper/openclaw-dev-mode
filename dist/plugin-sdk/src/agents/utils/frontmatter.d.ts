/** Parsed frontmatter metadata plus the remaining document body. */
type ParsedFrontmatter<T extends Record<string, unknown>> = {
    frontmatter: T;
    body: string;
};
/** Parses optional YAML frontmatter from Markdown-like content. */
export declare const parseFrontmatter: <T extends Record<string, unknown> = Record<string, unknown>>(content: string) => ParsedFrontmatter<T>;
/** Removes YAML frontmatter from content when a complete frontmatter block exists. */
export declare const stripFrontmatter: (content: string) => string;
export {};
