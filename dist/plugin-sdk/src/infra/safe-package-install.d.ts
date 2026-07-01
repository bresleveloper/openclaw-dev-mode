import type { NpmProjectInstallEnvOptions } from "./npm-install-env.js";
type SafeNpmInstallEnvOptions = NpmProjectInstallEnvOptions & {
    ignoreWorkspaces?: boolean;
    legacyPeerDeps?: boolean;
    packageLock?: boolean;
    quiet?: boolean;
};
type SafeNpmInstallArgsOptions = {
    ignoreWorkspaces?: boolean;
    legacyPeerDeps?: boolean;
    loglevel?: "error" | "silent";
    noAudit?: boolean;
    noFund?: boolean;
    omitDev?: boolean;
    omitPeer?: boolean;
};
/**
 * Creates a project-local npm install environment for untrusted package dirs.
 * It disables lifecycle scripts, global/workspace leakage, prompts, and noisy
 * npm features while preserving caller-supplied process env values.
 */
export declare function createSafeNpmInstallEnv(env: NodeJS.ProcessEnv, options?: SafeNpmInstallEnvOptions): NodeJS.ProcessEnv;
/**
 * Builds npm install argv that mirrors the safe environment defaults.
 * Callers opt into dependency omission, legacy peer resolution, and quiet flags.
 */
export declare function createSafeNpmInstallArgs(options?: SafeNpmInstallArgsOptions): string[];
export {};
