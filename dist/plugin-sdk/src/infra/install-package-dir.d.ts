type InstallSourceHardlinks = "package-manager" | "reject";
/**
 * Publishes a package directory into an install target via a staged copy.
 * Update mode backs up the existing target, runs optional validation hooks,
 * and rolls back when copy, dependency install, or validation fails.
 */
export declare function installPackageDir(params: {
    sourceDir: string;
    targetDir: string;
    mode: "install" | "update";
    timeoutMs: number;
    logger?: {
        info?: (message: string) => void;
        warn?: (message: string) => void;
    };
    copyErrorPrefix: string;
    hasDeps: boolean;
    sourceHardlinks?: InstallSourceHardlinks;
    depsLogMessage: string;
    afterCopy?: (installedDir: string) => void | Promise<void>;
    afterInstall?: (installedDir: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
        code?: string;
    }>;
}): Promise<{
    ok: true;
} | {
    ok: false;
    error: string;
    code?: string;
}>;
/**
 * Installs a manifest-backed package directory while deriving whether npm
 * dependencies must be installed and which hardlink policy is safe to use.
 */
export declare function installPackageDirWithManifestDeps(params: {
    sourceDir: string;
    targetDir: string;
    mode: "install" | "update";
    timeoutMs: number;
    logger?: {
        info?: (message: string) => void;
        warn?: (message: string) => void;
    };
    copyErrorPrefix: string;
    depsLogMessage: string;
    manifestDependencies?: Record<string, unknown>;
    afterCopy?: (installedDir: string) => void | Promise<void>;
    afterInstall?: (installedDir: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
        code?: string;
    }>;
}): Promise<{
    ok: true;
} | {
    ok: false;
    error: string;
    code?: string;
}>;
export {};
