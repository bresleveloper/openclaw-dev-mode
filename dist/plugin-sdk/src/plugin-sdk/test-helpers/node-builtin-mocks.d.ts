type MockFactory<TModule extends object> = Partial<TModule> | ((actual: TModule) => Partial<TModule>);
export declare function mockNodeBuiltinModule<TModule extends object>(loadActual: () => Promise<TModule>, factory: MockFactory<TModule>, options?: {
    mirrorToDefault?: boolean;
}): Promise<TModule>;
export declare function mockNodeChildProcessSpawnSync(spawnSync: (...args: unknown[]) => unknown, loadActual?: () => Promise<typeof import("node:child_process")>): Promise<typeof import("node:child_process")>;
export declare function mockNodeChildProcessExecFile(execFile: typeof import("node:child_process").execFile, loadActual?: () => Promise<typeof import("node:child_process")>): Promise<typeof import("node:child_process")>;
export {};
