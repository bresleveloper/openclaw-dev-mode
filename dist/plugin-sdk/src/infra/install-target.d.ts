/** Resolves and verifies an install target directory under a canonical base directory. */
export declare function resolveCanonicalInstallTarget(params: {
    baseDir: string;
    id: string;
    invalidNameMessage: string;
    boundaryLabel: string;
    nameEncoder?: (id: string) => string;
}): Promise<{
    ok: true;
    targetDir: string;
} | {
    ok: false;
    error: string;
}>;
/** Ensures install mode does not overwrite an existing target; update mode may reuse it. */
export declare function ensureInstallTargetAvailable(params: {
    mode: "install" | "update";
    targetDir: string;
    alreadyExistsError: string;
}): Promise<{
    ok: true;
} | {
    ok: false;
    error: string;
}>;
