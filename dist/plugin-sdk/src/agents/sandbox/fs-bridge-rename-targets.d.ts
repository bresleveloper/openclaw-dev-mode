/**
 * Shared writable-target resolution for sandbox fs bridge rename operations.
 */
/** Resolves both rename endpoints and verifies write access before command execution. */
export declare function resolveWritableRenameTargets<T extends {
    containerPath: string;
}>(params: {
    from: string;
    to: string;
    cwd?: string;
    action?: string;
    resolveTarget: (params: {
        filePath: string;
        cwd?: string;
    }) => T;
    ensureWritable: (target: T, action: string) => void;
}): {
    from: T;
    to: T;
};
/** Adapter used by bridge implementations that pass resolver callbacks separately. */
export declare function resolveWritableRenameTargetsForBridge<T extends {
    containerPath: string;
}>(params: {
    from: string;
    to: string;
    cwd?: string;
    action?: string;
}, resolveTarget: (params: {
    filePath: string;
    cwd?: string;
}) => T, ensureWritable: (target: T, action: string) => void): {
    from: T;
    to: T;
};
/** Creates a reusable resolver bound to a bridge's target and permission helpers. */
export declare function createWritableRenameTargetResolver<T extends {
    containerPath: string;
}>(resolveTarget: (params: {
    filePath: string;
    cwd?: string;
}) => T, ensureWritable: (target: T, action: string) => void): (params: {
    from: string;
    to: string;
    cwd?: string;
}) => {
    from: T;
    to: T;
};
