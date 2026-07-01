/** Parses, clones, verifies, and installs plugin packages from Git specs. */
import "../infra/fs-safe-defaults.js";
import { type InstallSafetyOverrides } from "./install-security-scan.js";
import { type InstallPluginResult } from "./install.js";
type PluginInstallLogger = {
    info?: (message: string) => void;
    warn?: (message: string) => void;
};
/** Resolved Git source metadata persisted into plugin install records. */
export type GitPluginResolution = {
    url: string;
    ref?: string;
    commit?: string;
    resolvedAt: string;
};
export type GitPluginInstallResult = (Extract<InstallPluginResult, {
    ok: true;
}> & {
    git: GitPluginResolution;
}) | Extract<InstallPluginResult, {
    ok: false;
}>;
/** Normalized Git plugin install spec accepted by the Git installer. */
export type ParsedGitPluginSpec = {
    input: string;
    url: string;
    ref?: string;
    label: string;
    normalizedSpec: string;
};
/** Returns true for full commit SHAs that do not require branch/tag drift checks. */
export declare function isImmutableGitCommitRef(ref: string | undefined): boolean;
export declare function parseGitPluginSpec(raw: string): ParsedGitPluginSpec | null;
export declare function installPluginFromGitSpec(params: InstallSafetyOverrides & {
    spec: string;
    extensionsDir?: string;
    gitDir?: string;
    timeoutMs?: number;
    logger?: PluginInstallLogger;
    mode?: "install" | "update";
    dryRun?: boolean;
    expectedPluginId?: string;
}): Promise<GitPluginInstallResult>;
export {};
