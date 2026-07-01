export type EnvMap = Record<string, string | undefined>;
type AccessSyncFn = (path: string, mode?: number) => void;
export declare function resolveLinuxSystemCaBundle(params?: {
    platform?: NodeJS.Platform;
    accessSync?: AccessSyncFn;
}): string | undefined;
export declare function isNodeVersionManagerRuntime(env?: EnvMap, execPath?: string): boolean;
export declare function resolveAutoNodeExtraCaCerts(params?: {
    env?: EnvMap;
    platform?: NodeJS.Platform;
    execPath?: string;
    accessSync?: AccessSyncFn;
}): string | undefined;
export {};
