import "./fs-safe-defaults.js";
import { replaceFileAtomic as replaceFileAtomicBase, type MovePathWithCopyFallbackOptions as BaseMovePathWithCopyFallbackOptions } from "@openclaw/fs-safe/atomic";
export { replaceDirectoryAtomic, replaceFileAtomicSync, type ReplaceFileAtomicFileSystem, type ReplaceFileAtomicOptions, type ReplaceFileAtomicResult, type ReplaceFileAtomicSyncFileSystem, type ReplaceFileAtomicSyncOptions, } from "@openclaw/fs-safe/atomic";
/** Atomic file replacement primitive re-exported through the fs-safe defaults shim. */
export declare const replaceFileAtomic: typeof replaceFileAtomicBase;
/** Options for moving paths while optionally rejecting hardlinked source files. */
export type MovePathWithCopyFallbackOptions = BaseMovePathWithCopyFallbackOptions & {
    sourceHardlinks?: "allow" | "reject";
};
/**
 * Moves a path using fs-safe's copy fallback, with an OpenClaw hardlink guard
 * for install/update flows that must not preserve package-manager links.
 */
export declare function movePathWithCopyFallback(options: MovePathWithCopyFallbackOptions): Promise<void>;
