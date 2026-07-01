type ShellSnapshotWrapOptions = {
    command: string;
    shell: string;
    shellArgs: string[];
    cwd: string;
    env: Record<string, string | undefined>;
};
export declare function maybeWrapCommandWithShellSnapshot(opts: ShellSnapshotWrapOptions): Promise<string>;
export declare function resetShellSnapshotCacheForTests(): void;
export declare function resolveShellSnapshotDir(env?: Record<string, string | undefined>): string;
export {};
