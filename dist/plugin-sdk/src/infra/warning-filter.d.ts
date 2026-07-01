/** Normalized process warning fields used by the shared warning suppressor. */
export type ProcessWarning = {
    code?: string;
    name?: string;
    message?: string;
};
/** Returns whether a process warning matches a known noisy runtime/dependency warning. */
export declare function shouldIgnoreWarning(warning: ProcessWarning): boolean;
/** Installs the global process warning filter once for the current JS realm. */
export declare function installProcessWarningFilter(): void;
