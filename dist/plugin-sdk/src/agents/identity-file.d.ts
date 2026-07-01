/** Parsed rich identity values from a workspace `IDENTITY.md` file. */
export type AgentIdentityFile = {
    name?: string;
    emoji?: string;
    theme?: string;
    creature?: string;
    vibe?: string;
    avatar?: string;
};
/** Parse rich identity fields from human-authored markdown content. */
export declare function parseIdentityMarkdown(content: string): AgentIdentityFile;
/** Return true when the parsed identity has any meaningful user-supplied value. */
export declare function identityHasValues(identity: AgentIdentityFile): boolean;
/**
 * Merge writable identity fields into existing IDENTITY.md content, replacing
 * duplicate labels and preserving unrelated markdown.
 */
export declare function mergeIdentityMarkdownContent(content: string | undefined, identity: Pick<AgentIdentityFile, "name" | "theme" | "emoji" | "avatar">): string;
/** Load the workspace identity file when it exists and contains real values. */
export declare function loadAgentIdentityFromWorkspace(workspace: string): AgentIdentityFile | null;
