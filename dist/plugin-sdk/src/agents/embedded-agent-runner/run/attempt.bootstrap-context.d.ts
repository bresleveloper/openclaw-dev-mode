import type { EmbeddedContextFile } from "../../embedded-agent-helpers.js";
/**
 * Returns whether a session should receive primary bootstrap context. Subagents
 * and ACP worker sessions inherit/run their own context path instead of getting
 * the top-level bootstrap payload again.
 */
export declare function isPrimaryBootstrapRun(sessionKey?: string): boolean;
/**
 * Rewrites injected context file paths when a bootstrap assembled in one
 * workspace is replayed in another. Files outside the source workspace keep
 * their original absolute path to avoid manufacturing unsafe relative paths.
 */
export declare function remapInjectedContextFilesToWorkspace(params: {
    files: EmbeddedContextFile[];
    sourceWorkspaceDir: string;
    targetWorkspaceDir: string;
}): EmbeddedContextFile[];
