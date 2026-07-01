import { type UpdateChannel } from "./update-channels.js";
export type PackageManager = "pnpm" | "bun" | "npm" | "unknown";
export type GitUpdateStatus = {
    root: string;
    sha: string | null;
    tag: string | null;
    branch: string | null;
    upstream: string | null;
    dirty: boolean | null;
    ahead: number | null;
    behind: number | null;
    fetchOk: boolean | null;
    error?: string;
};
export type DepsStatus = {
    manager: PackageManager;
    status: "ok" | "missing" | "stale" | "unknown";
    lockfilePath: string | null;
    markerPath: string | null;
    reason?: string;
};
export type RegistryStatus = {
    latestVersion: string | null;
    tag?: string;
    error?: string;
};
export type NpmTagStatus = {
    tag: string;
    version: string | null;
    error?: string;
};
export type NpmPackageTargetStatus = {
    target: string;
    version: string | null;
    nodeEngine: string | null;
    error?: string;
};
export type UpdateCheckResult = {
    root: string | null;
    installKind: "git" | "package" | "unknown";
    packageManager: PackageManager;
    git?: GitUpdateStatus;
    deps?: DepsStatus;
    registry?: RegistryStatus;
};
type NpmMetadataCommandRunner = (argv: string[], options: {
    timeoutMs: number;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    maxOutputBytes?: number;
}) => Promise<{
    stdout: string;
    stderr: string;
    code: number | null;
}>;
export declare function formatGitInstallLabel(update: UpdateCheckResult): string | null;
export declare function checkGitUpdateStatus(params: {
    root: string;
    timeoutMs?: number;
    fetch?: boolean;
}): Promise<GitUpdateStatus>;
export declare function checkDepsStatus(params: {
    root: string;
    manager: PackageManager;
}): Promise<DepsStatus>;
export declare function fetchNpmLatestVersion(params?: {
    timeoutMs?: number;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    runCommand?: NpmMetadataCommandRunner;
}): Promise<RegistryStatus>;
export declare function fetchNpmRegistryVersionForChannel(params: {
    channel: UpdateChannel;
    timeoutMs?: number;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    runCommand?: NpmMetadataCommandRunner;
}): Promise<RegistryStatus>;
export declare function fetchNpmPackageTargetStatus(params: {
    target: string;
    timeoutMs?: number;
    spec?: string;
    command?: string;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    runCommand?: NpmMetadataCommandRunner;
}): Promise<NpmPackageTargetStatus>;
export declare function fetchNpmTagVersion(params: {
    tag: string;
    timeoutMs?: number;
    spec?: string;
    command?: string;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    runCommand?: NpmMetadataCommandRunner;
}): Promise<NpmTagStatus>;
export declare function resolveNpmChannelTag(params: {
    channel: UpdateChannel;
    timeoutMs?: number;
    command?: string;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    runCommand?: NpmMetadataCommandRunner;
}): Promise<{
    tag: string;
    version: string | null;
}>;
export declare function compareSemverStrings(a: string | null, b: string | null): number | null;
export declare function checkUpdateStatus(params: {
    root: string | null;
    timeoutMs?: number;
    fetchGit?: boolean;
    includeRegistry?: boolean;
    registryChannel?: UpdateChannel;
}): Promise<UpdateCheckResult>;
export {};
