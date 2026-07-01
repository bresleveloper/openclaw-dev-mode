interface FsLike {
    readdir(dir: string, options: {
        withFileTypes: true;
    }): Promise<readonly DirentLike[]>;
    lstat(file: string): Promise<StatsLike>;
    readlink(file: string): Promise<string>;
    stat(file: string): Promise<unknown>;
    rm(file: string, options: {
        force: true;
    }): Promise<void>;
    unlink?(file: string): Promise<void>;
}
interface DirentLike {
    name: string;
    isDirectory(): boolean;
    isSymbolicLink(): boolean;
}
interface StatsLike {
    isSymbolicLink(): boolean;
}
export interface StalePluginRuntimeSymlink {
    /** Package or scoped package name for the stale symlink. */
    readonly name: string;
    /** Symlink path under the containing node_modules directory. */
    readonly path: string;
    /** Resolved target that is missing or belongs to stale cleanup roots. */
    readonly target: string;
}
export interface PluginRuntimeSymlinkOptions {
    /** Filesystem adapter for tests and doctor cleanup callers. */
    readonly fs?: FsLike;
    /** Roots already classified as stale by plugin dependency cleanup. */
    readonly staleRoots?: readonly string[];
}
/** Find global node_modules symlinks that still point at stale plugin-runtime deps. */
export declare function collectStalePluginRuntimeSymlinks(packageRoot: string | null | undefined, options?: PluginRuntimeSymlinkOptions): Promise<StalePluginRuntimeSymlink[]>;
/** Emit a doctor note describing stale plugin-runtime symlinks, if any exist. */
export declare function noteStalePluginRuntimeSymlinks(packageRoot: string | null | undefined, options?: PluginRuntimeSymlinkOptions & {
    readonly noteFn?: (message: string, title?: string) => void;
    readonly shortenPath?: (value: string) => string;
}): Promise<void>;
/** Remove stale plugin-runtime symlinks and report changes/warnings. */
export declare function removeStalePluginRuntimeSymlinks(packageRoot: string | null | undefined, options?: PluginRuntimeSymlinkOptions): Promise<{
    changes: string[];
    warnings: string[];
}>;
export {};
