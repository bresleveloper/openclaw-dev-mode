import type { ConfigFileSnapshot } from "./types.openclaw.js";
/** Dependencies injected into config recovery observation for testable filesystem behavior. */
export type ObserveRecoveryDeps = {
    fs: {
        promises: {
            stat(path: string): Promise<{
                mtimeMs?: number;
                ctimeMs?: number;
                dev?: number | bigint;
                ino?: number | bigint;
                mode?: number;
                nlink?: number;
                uid?: number;
                gid?: number;
            } | null>;
            readFile(path: string, encoding: BufferEncoding): Promise<string>;
            writeFile(path: string, data: string, options?: {
                encoding?: BufferEncoding;
                mode?: number;
                flag?: string;
            }): Promise<unknown>;
            copyFile(src: string, dest: string): Promise<unknown>;
            chmod?(path: string, mode: number): Promise<unknown>;
            mkdir(path: string, options?: {
                recursive?: boolean;
                mode?: number;
            }): Promise<unknown>;
            readdir(path: string): Promise<string[]>;
            rmdir(path: string): Promise<unknown>;
            unlink(path: string): Promise<unknown>;
            appendFile(path: string, data: string, options?: {
                encoding?: BufferEncoding;
                mode?: number;
            }): Promise<unknown>;
        };
        statSync(path: string, options?: {
            throwIfNoEntry?: boolean;
        }): {
            mtimeMs?: number;
            ctimeMs?: number;
            dev?: number | bigint;
            ino?: number | bigint;
            mode?: number;
            nlink?: number;
            uid?: number;
            gid?: number;
        } | null;
        readFileSync(path: string, encoding: BufferEncoding): string;
        writeFileSync(path: string, data: string, options?: {
            encoding?: BufferEncoding;
            mode?: number;
            flag?: string;
        }): unknown;
        copyFileSync(src: string, dest: string): unknown;
        chmodSync?(path: string, mode: number): unknown;
        mkdirSync(path: string, options?: {
            recursive?: boolean;
            mode?: number;
        }): unknown;
        readdirSync(path: string): string[];
        rmdirSync(path: string): unknown;
        unlinkSync(path: string): unknown;
        appendFileSync(path: string, data: string, options?: {
            encoding?: BufferEncoding;
            mode?: number;
        }): unknown;
    };
    json5: {
        parse(value: string): unknown;
    };
    env: NodeJS.ProcessEnv;
    homedir: () => string;
    logger: Pick<typeof console, "warn">;
};
type ConfigReadRecoveryParams = {
    deps: ObserveRecoveryDeps;
    configPath: string;
    raw: string;
    parsed: unknown;
    validateBackup?: (backup: {
        raw: string;
        parsed: unknown;
    }) => Promise<boolean>;
    validateBackupSync?: (backup: {
        raw: string;
        parsed: unknown;
    }) => boolean;
    allowBackupRecovery?: () => Promise<boolean>;
};
type ConfigReadRecoveryResult = {
    raw: string;
    parsed: unknown;
};
export declare function resolveLastKnownGoodConfigPath(configPath: string): string;
export declare function maybeRecoverSuspiciousConfigRead(params: ConfigReadRecoveryParams): Promise<ConfigReadRecoveryResult>;
export declare function maybeRecoverSuspiciousConfigReadSync(params: ConfigReadRecoveryParams): ConfigReadRecoveryResult;
export declare function promoteConfigSnapshotToLastKnownGood(params: {
    deps: ObserveRecoveryDeps;
    snapshot: ConfigFileSnapshot;
    logger?: Pick<typeof console, "warn">;
}): Promise<boolean>;
export declare function recoverConfigFromLastKnownGood(params: {
    deps: ObserveRecoveryDeps;
    snapshot: ConfigFileSnapshot;
    reason: string;
}): Promise<boolean>;
export {};
