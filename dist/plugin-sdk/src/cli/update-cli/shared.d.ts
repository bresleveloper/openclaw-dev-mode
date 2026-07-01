import { readPackageName, readPackageVersion } from "../../infra/package-json.js";
import { type CommandRunner, type GlobalInstallManager } from "../../infra/update-global.js";
import type { UpdateStepProgress, UpdateStepResult } from "../../infra/update-runner.js";
export type UpdateCommandOptions = {
    json?: boolean;
    restart?: boolean;
    dryRun?: boolean;
    channel?: string;
    tag?: string;
    timeout?: string;
    yes?: boolean;
};
export type UpdateStatusOptions = {
    json?: boolean;
    timeout?: string;
};
export type UpdateFinalizeOptions = {
    json?: boolean;
    channel?: string;
    timeout?: string;
    yes?: boolean;
    restart?: boolean;
};
export type UpdateWizardOptions = {
    timeout?: string;
};
/** Parse a CLI timeout in seconds, exiting through the runtime on invalid input. */
export declare function parseTimeoutMsOrExit(timeout?: string): number | undefined | null;
export declare const DEFAULT_PACKAGE_NAME = "openclaw";
/** Normalize a CLI tag/version/spec into the npm target form accepted by update flows. */
export declare function normalizeTag(value?: string | null): string | null;
export { readPackageName, readPackageVersion };
/** Resolve an npm dist-tag or explicit version into a concrete package version. */
export declare function resolveTargetVersion(tag: string, timeoutMs?: number, options?: {
    spec?: string;
    command?: string;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
}): Promise<string | null>;
/** Return true when `root` is a local git checkout directory. */
export declare function isGitCheckout(root: string): Promise<boolean>;
/** Return true only for existing directories with no entries. */
export declare function isEmptyDir(targetPath: string): Promise<boolean>;
/** Resolve the checkout path used by source-based self-update. */
export declare function resolveGitInstallDir(): string;
/** Prefer the current Node executable, falling back to `node` when run through another shim. */
export declare function resolveNodeRunner(): string;
/** Locate the installed OpenClaw package root that should receive update operations. */
export declare function resolveUpdateRoot(): Promise<string>;
/** Run one update subprocess and report bounded stdout/stderr tails to progress listeners. */
export declare function runUpdateStep(params: {
    name: string;
    argv: string[];
    cwd?: string;
    timeoutMs: number;
    progress?: UpdateStepProgress;
    env?: NodeJS.ProcessEnv;
}): Promise<UpdateStepResult>;
/** Ensure the configured source-update directory exists and points at an OpenClaw checkout. */
export declare function ensureGitCheckout(params: {
    dir: string;
    timeoutMs: number;
    progress?: UpdateStepProgress;
    env?: NodeJS.ProcessEnv;
}): Promise<UpdateStepResult | null>;
/** Detect the package manager that owns a global/package OpenClaw install. */
export declare function resolveGlobalManager(params: {
    root: string;
    installKind: "git" | "package" | "unknown";
    timeoutMs: number;
}): Promise<GlobalInstallManager>;
/** Best-effort refresh of shell completion state after a successful update. */
export declare function tryWriteCompletionCache(root: string, jsonMode: boolean): Promise<void>;
/** Adapter used by global-install detection helpers to execute bounded subprocess probes. */
export declare function createGlobalCommandRunner(): CommandRunner;
