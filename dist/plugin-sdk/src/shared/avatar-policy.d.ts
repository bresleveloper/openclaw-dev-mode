/**
 * Shared avatar source policy for config validation, agent identity loading,
 * gateway uploads, and Control UI rendering hints.
 */
/** Maximum avatar payload size accepted by local file and gateway upload paths. */
export declare const AVATAR_MAX_BYTES: number;
/** Resolves a local avatar file MIME type from its extension. */
export declare function resolveAvatarMime(filePath: string): string;
/** Detects any data URL value before image-specific validation. */
export declare function isAvatarDataUrl(value: string): boolean;
/** Detects image data URLs accepted by avatar sources. */
export declare function isAvatarImageDataUrl(value: string): boolean;
/** Detects remote HTTP(S) avatar URLs. */
export declare function isAvatarHttpUrl(value: string): boolean;
/** Detects URI-scheme-like avatar values, including non-HTTP schemes. */
export declare function hasAvatarUriScheme(value: string): boolean;
/** Detects Windows absolute paths so they are not mistaken for URI schemes. */
export declare function isWindowsAbsolutePath(value: string): boolean;
/** Accepts workspace-relative avatar paths while rejecting home paths and URI values. */
export declare function isWorkspaceRelativeAvatarPath(value: string): boolean;
/** Checks that a resolved avatar path remains inside its configured root. */
export declare function isPathWithinRoot(rootDir: string, targetPath: string): boolean;
/** Heuristically detects strings that look like local avatar file paths. */
export declare function looksLikeAvatarPath(value: string): boolean;
/** Restricts local avatar files to image extensions that can be safely served inline. */
export declare function isSupportedLocalAvatarExtension(filePath: string): boolean;
