/** Canonical root memory file name used by current workspaces. */
export declare const CANONICAL_ROOT_MEMORY_FILENAME = "MEMORY.md";
/** Legacy root memory file name kept out of auxiliary scans. */
export declare const LEGACY_ROOT_MEMORY_FILENAME = "memory.md";
/** Resolves the canonical root memory file path for a workspace. */
export declare function resolveCanonicalRootMemoryPath(workspaceDir: string): string;
/** Resolves the legacy root memory file path for a workspace. */
export declare function resolveLegacyRootMemoryPath(workspaceDir: string): string;
/** Resolves the repair directory used while migrating root memory files. */
export declare function resolveRootMemoryRepairDir(workspaceDir: string): string;
/** Checks for an exact directory entry without case-folded path lookup. */
export declare function exactWorkspaceEntryExists(dir: string, name: string): Promise<boolean>;
/** Resolves the canonical root memory file only when it is a real file, not a symlink. */
export declare function resolveCanonicalRootMemoryFile(workspaceDir: string): Promise<string | null>;
/** Skips legacy/repair root memory paths when scanning workspace memory files. */
export declare function shouldSkipRootMemoryAuxiliaryPath(params: {
    workspaceDir: string;
    absPath: string;
}): boolean;
