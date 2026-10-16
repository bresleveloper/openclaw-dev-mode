//#region src/infra/home-dir.d.ts
/** Resolves the effective home or falls back to cwd when no home source exists. */
declare function resolveRequiredHomeDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves a user path against the effective home, preserving an empty input. */
declare function resolveUserPath(input: string, env?: NodeJS.ProcessEnv, homedir?: () => string): string;
//#endregion
export { resolveUserPath as n, resolveRequiredHomeDir as t };