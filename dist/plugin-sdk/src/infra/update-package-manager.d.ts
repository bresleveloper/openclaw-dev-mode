type BuildManager = "pnpm" | "bun" | "npm";
type UpdatePackageManagerRequirement = "allow-fallback" | "require-preferred";
export type UpdatePackageManagerFailureReason = "preferred-manager-unavailable" | "pnpm-corepack-enable-failed" | "pnpm-corepack-missing" | "pnpm-npm-bootstrap-failed";
export type PackageManagerCommandRunner = (argv: string[], options: {
    timeoutMs: number;
    env?: NodeJS.ProcessEnv;
}) => Promise<{
    stdout: string;
    stderr: string;
    code: number | null;
}>;
type ResolvedBuildManager = {
    kind: "resolved";
    manager: BuildManager;
    preferred: BuildManager;
    fallback: boolean;
    env?: NodeJS.ProcessEnv;
    cleanup?: () => Promise<void>;
} | {
    kind: "missing-required";
    preferred: BuildManager;
    reason: UpdatePackageManagerFailureReason;
};
/** Resolve the package manager and environment to use for an update build. */
export declare function resolveUpdateBuildManager(runCommand: PackageManagerCommandRunner, root: string, timeoutMs: number, baseEnv?: NodeJS.ProcessEnv, requirement?: UpdatePackageManagerRequirement): Promise<ResolvedBuildManager>;
/** Build argv for running a package-manager script. */
export declare function managerScriptArgs(manager: BuildManager, script: string, args?: string[]): string[];
/** Build argv for installing dependencies with a package manager. */
export declare function managerInstallArgs(manager: BuildManager, opts?: {
    compatFallback?: boolean;
}): string[];
/** Build argv for installing dependencies while skipping lifecycle scripts. */
export declare function managerInstallIgnoreScriptsArgs(manager: BuildManager): string[] | null;
export {};
