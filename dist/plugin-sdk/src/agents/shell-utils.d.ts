import { type KillProcessTreeOptions } from "../process/kill-tree.js";
export interface ShellConfig {
    shell: string;
    args: string[];
}
export declare function resolvePowerShellPath(): string;
export declare function getPosixShellArgs(shellPath: string): string[];
export declare function resolveWindowsBashPath(env?: NodeJS.ProcessEnv): string | undefined;
export declare function getShellConfig(customShellPath?: string): ShellConfig;
export declare function getBashShellConfig(customShellPath?: string): ShellConfig;
export declare function resolveShellFromPath(name: string, env?: NodeJS.ProcessEnv): string | undefined;
export declare function resolveShellFromWhich(name: string): string | undefined;
export declare function detectRuntimeShell(): string | undefined;
export declare function sanitizeBinaryOutput(text: string): string;
export declare function getShellEnv(): NodeJS.ProcessEnv;
export declare function killProcessTree(pid: number, opts?: KillProcessTreeOptions): void;
