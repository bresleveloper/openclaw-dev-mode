type RelativePathOptions = {
    allowRoot?: boolean;
    cwd?: string;
    boundaryLabel?: string;
    includeRootInError?: boolean;
};
/**
 * Return a workspace-relative path for a candidate path after rejecting paths
 * that escape the workspace root.
 */
export declare function toRelativeWorkspacePath(root: string, candidate: string, options?: Pick<RelativePathOptions, "allowRoot" | "cwd">): string;
/**
 * Return a sandbox-relative path for a candidate path after rejecting paths that
 * escape the sandbox root. Errors include the sandbox root for operator clarity.
 */
export declare function toRelativeSandboxPath(root: string, candidate: string, options?: Pick<RelativePathOptions, "allowRoot" | "cwd">): string;
/** Resolve a user-supplied path against `cwd` using the sandbox input rules. */
export declare function resolvePathFromInput(filePath: string, cwd: string): string;
export {};
