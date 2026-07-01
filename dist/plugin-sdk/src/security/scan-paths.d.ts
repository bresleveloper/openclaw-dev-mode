/** Path containment helpers re-exported for security scanners. */
export { isPathInside, isPathInsideWithRealpath } from "../infra/path-safety.js";
/** Return true for extension paths intentionally skipped by source scanners. */
export declare function extensionUsesSkippedScannerPath(entry: string): boolean;
