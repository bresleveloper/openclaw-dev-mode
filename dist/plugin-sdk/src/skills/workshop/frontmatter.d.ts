type ProposalFrontmatter = {
    name: string;
    description: string;
};
/** Renders proposal markdown while preserving allowed original frontmatter fields. */
export declare function renderProposalMarkdown(params: {
    name: string;
    description: string;
    content: string;
    fallbackFrontmatterContent?: string;
    version?: string;
    date?: string;
}): string;
export declare function readProposalFrontmatter(content: string): ProposalFrontmatter | null;
export declare function stripProposalFrontmatterForSkill(content: string): string;
export {};
