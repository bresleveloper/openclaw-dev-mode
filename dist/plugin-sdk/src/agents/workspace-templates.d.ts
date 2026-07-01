/** Resolves the primary workspace-template directory from package, cwd, or fallback paths. */
export declare function resolveWorkspaceTemplateDir(opts?: {
    cwd?: string;
    argv1?: string;
    moduleUrl?: string;
}): Promise<string>;
/** Clears cached workspace-template directory resolution for tests or package moves. */
export declare function resetWorkspaceTemplateDirCache(): void;
/** Resolves all existing workspace-template search directories, including docs templates. */
export declare function resolveWorkspaceTemplateSearchDirs(opts?: {
    cwd?: string;
    argv1?: string;
    moduleUrl?: string;
}): Promise<string[]>;
