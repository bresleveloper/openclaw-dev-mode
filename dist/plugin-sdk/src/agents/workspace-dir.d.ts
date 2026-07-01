/** Normalizes a workspace directory and rejects filesystem roots. */
export declare function normalizeWorkspaceDir(workspaceDir?: string): string | null;
/** Resolves the effective workspace root, falling back to cwd. */
export declare function resolveWorkspaceRoot(workspaceDir?: string): string;
