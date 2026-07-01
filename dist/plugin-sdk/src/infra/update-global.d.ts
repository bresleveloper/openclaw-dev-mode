/** Supported package managers for OpenClaw global install and update flows. */
export type GlobalInstallManager = "npm" | "pnpm" | "bun";
/** Runs package-manager commands with timeout and environment control. */
export type CommandRunner = (argv: string[], options: {
    timeoutMs: number;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
}) => Promise<{
    stdout: string;
    stderr: string;
    code: number | null;
    signal?: NodeJS.Signals | null;
    killed?: boolean;
    termination?: "exit" | "timeout" | "no-output-timeout" | "signal";
}>;
type ResolvedGlobalInstallCommand = {
    manager: GlobalInstallManager;
    command: string;
};
/**
 * Resolved package-manager command plus the root paths used for install,
 * verification, and staged package swaps.
 */
export type ResolvedGlobalInstallTarget = ResolvedGlobalInstallCommand & {
    globalRoot: string | null;
    packageRoot: string | null;
    directNodeModulesRoot?: boolean;
};
/** npm-compatible spec used when the user asks to install the moving main branch. */
export declare const OPENCLAW_MAIN_PACKAGE_SPEC = "github:openclaw/openclaw#main";
/** npm prefix layout paths needed to install, stage, and expose global bins. */
export type NpmGlobalPrefixLayout = {
    prefix: string;
    globalRoot: string;
    binDir: string;
};
/** Returns true when a user target requests the moving main-branch package spec. */
export declare function isMainPackageTarget(value: string): boolean;
/**
 * Returns true for targets that should pass through as package-manager specs
 * rather than being treated as registry dist-tags.
 */
export declare function isExplicitPackageInstallSpec(value: string): boolean;
/**
 * Extracts a pinned installed version from package specs like `openclaw@1.2.3`.
 * Moving tags, URLs, git refs, and aliases return null because they cannot be
 * compared reliably after install.
 */
export declare function resolveExpectedInstalledVersionFromSpec(packageName: string, spec: string): string | null;
/**
 * Verifies that a global package root looks like a packaged OpenClaw install
 * and, when supplied, matches the expected concrete version.
 */
export declare function collectInstalledGlobalPackageErrors(params: {
    packageRoot: string;
    expectedVersion?: string | null;
}): Promise<string[]>;
/**
 * Returns true when a target can be resolved through npm registry metadata.
 * Explicit tarball, URL, git, and main-branch specs bypass registry lookup.
 */
export declare function canResolveRegistryVersionForPackageTarget(value: string): boolean;
/**
 * Converts a user tag or explicit package target into the package-manager spec
 * used by global install commands.
 */
export declare function resolveGlobalInstallSpec(params: {
    packageName: string;
    tag: string;
    env?: NodeJS.ProcessEnv;
}): string;
/**
 * Builds the package-manager environment used for global installs.
 * It keeps caller env values, adds platform-specific install defaults, and
 * disables npm/corepack prompts that would otherwise hang unattended updates.
 */
export declare function createGlobalInstallEnv(env?: NodeJS.ProcessEnv): Promise<NodeJS.ProcessEnv | undefined>;
/**
 * Infers npm prefix, package root, and bin paths from an npm global root.
 * Direct `node_modules` roots are accepted only when the caller opts into them.
 */
export declare function resolveNpmGlobalPrefixLayoutFromGlobalRoot(globalRoot?: string | null, options?: {
    allowDirectNodeModulesRoot?: boolean;
}): NpmGlobalPrefixLayout | null;
/**
 * Derives npm's global package and bin directories from a prefix root.
 * Used for staged installs where OpenClaw creates the prefix itself.
 */
export declare function resolveNpmGlobalPrefixLayoutFromPrefix(prefix: string): NpmGlobalPrefixLayout;
/**
 * Resolves pnpm's global-dir from its active `node_modules` root.
 * Versioned pnpm layouts put packages under `<globalDir>/<version>/node_modules`.
 */
export declare function resolvePnpmGlobalDirFromGlobalRoot(globalRoot?: string | null): string | null;
/**
 * Resolves the package-manager command to execute for a global install.
 * npm may use the npm binary beside an existing package root when available.
 */
export declare function resolveGlobalInstallCommand(manager: GlobalInstallManager, pkgRoot?: string | null): ResolvedGlobalInstallCommand;
/**
 * Reads the global `node_modules` root for a package manager command.
 * Bun uses its deterministic install root because it has no `root -g` command.
 */
export declare function resolveGlobalRoot(managerOrCommand: GlobalInstallManager | ResolvedGlobalInstallCommand, runCommand: CommandRunner, timeoutMs: number, pkgRoot?: string | null): Promise<string | null>;
/**
 * Resolves the effective global install target, honoring an existing package
 * root when requested and detecting pnpm or bun layouts before command probes.
 */
export declare function resolveGlobalInstallTarget(params: {
    manager: GlobalInstallManager | ResolvedGlobalInstallCommand;
    runCommand: CommandRunner;
    timeoutMs: number;
    pkgRoot?: string | null;
    honorPackageRoot?: boolean;
}): Promise<ResolvedGlobalInstallTarget>;
/**
 * Identifies which global package manager owns an existing package root.
 * Command probes are checked first, then pnpm/bun layout fingerprints.
 */
export declare function detectGlobalInstallManagerForRoot(runCommand: CommandRunner, pkgRoot: string, timeoutMs: number): Promise<GlobalInstallManager | null>;
/**
 * Detects an installed global OpenClaw package by probing package-manager roots
 * when no trusted package root is already available.
 */
export declare function detectGlobalInstallManagerByPresence(runCommand: CommandRunner, timeoutMs: number): Promise<GlobalInstallManager | null>;
/**
 * Builds the primary package-manager argv for a global OpenClaw install.
 * npm receives quiet/freshness-bypass flags; pnpm source installs allow builds.
 */
export declare function globalInstallArgs(managerOrCommand: GlobalInstallManager | ResolvedGlobalInstallCommand, spec: string, pkgRoot?: string | null, installPrefix?: string | null): string[];
/**
 * Builds npm's retry argv without optional dependencies.
 * Non-npm managers have no equivalent fallback and return null.
 */
export declare function globalInstallFallbackArgs(managerOrCommand: GlobalInstallManager | ResolvedGlobalInstallCommand, spec: string, pkgRoot?: string | null, installPrefix?: string | null): string[] | null;
/** Removes leftover hidden global package directories from interrupted renames. */
export declare function cleanupGlobalRenameDirs(params: {
    globalRoot: string;
    packageName: string;
}): Promise<{
    removed: string[];
}>;
export {};
