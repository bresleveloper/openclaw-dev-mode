/** Parses Linux mountinfo content into absolute mount points. */
export declare function parseLinuxMountInfoMountPoints(mountInfo: string): Set<string>;
/** True when a path appears to be a mounted bundled source overlay. */
export declare function isBundledSourceOverlayPath(params: {
    sourcePath: string;
    mountPoints?: ReadonlySet<string>;
}): boolean;
/** Lists source overlay directories that shadow packaged bundled plugin dirs. */
export declare function listBundledSourceOverlayDirs(params: {
    bundledRoot?: string;
    env?: NodeJS.ProcessEnv;
    mountPoints?: ReadonlySet<string>;
}): string[];
