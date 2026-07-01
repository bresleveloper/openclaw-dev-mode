/** Normalizes a container path and treats "." as the container root. */
export declare function normalizeContainerPath(value: string): string;
/** Returns whether target is lexically inside root after container-path normalization. */
export declare function isPathInsideContainerRoot(root: string, target: string): boolean;
/** Returns whether a relative path would escape its container root. */
export declare function relativePathEscapesContainerRoot(relativePath: string): boolean;
