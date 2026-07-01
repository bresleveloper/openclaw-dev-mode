/**
 * Lists env vars worth importing from login-shell fallback for this config load.
 *
 * Provider/channel helpers inspect the current environment so optional plugin
 * and auth aliases only trigger shell probing when their configured keys matter.
 */
export declare function resolveShellEnvExpectedKeys(env: NodeJS.ProcessEnv): string[];
