/** Inputs used to format native dependency install/rebuild guidance. */
export type NativeDependencyHintParams = {
    packageName: string;
    manager?: "pnpm" | "npm" | "yarn";
    rebuildCommand?: string;
    approveBuildsCommand?: string;
    downloadCommand?: string;
};
/** Formats concise guidance for installing and rebuilding a native dependency. */
export declare function formatNativeDependencyHint(params: NativeDependencyHintParams): string;
