/** Sets a test-owned env key; callers must capture/restore the key scope. */
export declare function setTestEnvValue(key: string, value: string): void;
/** Deletes a test-owned env key; callers must capture/restore the key scope. */
export declare function deleteTestEnvValue(key: string): void;
/** Captures selected process.env keys so tests can restore exact prior state. */
export declare function captureEnv(keys: string[]): {
    restore(): void;
};
export declare function createPathResolutionEnv(homeDir: string, env?: Record<string, string | undefined>): NodeJS.ProcessEnv;
export declare function withPathResolutionEnv<T>(homeDir: string, env: Record<string, string | undefined>, fn: (resolvedEnv: NodeJS.ProcessEnv) => T): T;
export declare function captureFullEnv(): {
    restore(): void;
};
export declare function withEnv<T>(env: Record<string, string | undefined>, fn: () => T): T;
export declare function withEnvAsync<T>(env: Record<string, string | undefined>, fn: () => Promise<T>): Promise<T>;
