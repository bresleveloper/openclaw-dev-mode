import fs from "node:fs";
import { resolveOpenClawPackageRootSync } from "../../infra/openclaw-root.js";
/** Return true when private QA CLI routes should be exposed. */
export declare function isPrivateQaCliEnabled(env?: NodeJS.ProcessEnv): boolean;
/** Load the private QA module from a source checkout or throw a user-facing availability error. */
export declare function loadPrivateQaCliModule(params?: {
    env?: NodeJS.ProcessEnv;
    cwd?: string;
    argv1?: string;
    moduleUrl?: string;
    resolvePackageRootSync?: typeof resolveOpenClawPackageRootSync;
    existsSync?: typeof fs.existsSync;
    importModule?: (specifier: string) => Promise<Record<string, unknown>>;
}): Promise<Record<string, unknown>>;
