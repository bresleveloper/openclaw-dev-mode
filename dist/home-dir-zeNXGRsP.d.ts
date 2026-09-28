//#region src/infra/home-dir.d.ts
/** Resolves the effective home or falls back to cwd when no home source exists. */
declare function resolveRequiredHomeDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves the OS home or falls back to cwd when no OS home source exists. */
declare function resolveRequiredOsHomeDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Expands leading `~`, `~/`, or `~\` with the effective home when one is known. */
declare function expandHomePrefix(input: string, opts?: {
  home?: string;
  env?: NodeJS.ProcessEnv;
  homedir?: () => string;
}): string;
/** Resolves a user-supplied path after trimming and expanding against the effective home. */
declare function resolveHomeRelativePath(input: string, opts?: {
  env?: NodeJS.ProcessEnv;
  homedir?: () => string;
}): string;
/** Resolves a user path against the effective home, preserving an empty input. */
declare function resolveUserPath(input: string, env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves a user-supplied path against the OS home, ignoring OPENCLAW_HOME. */
declare function resolveOsHomeRelativePath(input: string, opts?: {
  env?: NodeJS.ProcessEnv;
  homedir?: () => string;
}): string;
//#endregion
export { resolveRequiredOsHomeDir as a, resolveRequiredHomeDir as i, resolveHomeRelativePath as n, resolveUserPath as o, resolveOsHomeRelativePath as r, expandHomePrefix as t };