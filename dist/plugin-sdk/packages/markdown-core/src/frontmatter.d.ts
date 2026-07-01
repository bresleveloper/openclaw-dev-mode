type ParsedFrontmatter = Record<string, string>;
/** Parses leading YAML frontmatter into string values used by skill and metadata loaders. */
export declare function parseFrontmatterBlock(content: string): ParsedFrontmatter;
export {};
