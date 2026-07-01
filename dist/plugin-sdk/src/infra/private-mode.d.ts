/**
 * Applies a private POSIX mode, reporting unsupported filesystems without
 * weakening real permission failures.
 */
export declare function applyPrivateModeSync(target: string, mode: number): {
    applied: true;
} | {
    applied: false;
    error: unknown;
};
