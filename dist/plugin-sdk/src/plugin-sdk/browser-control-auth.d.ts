import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Browser control credentials resolved from config, env, or generated setup state. */
export type BrowserControlAuth = {
    /** Bearer token accepted by the browser control HTTP surface. */
    token?: string;
    /** Password fallback for deployments that expose password-based browser control auth. */
    password?: string;
};
/** Inputs used when resolving or creating browser control auth for the active config. */
type EnsureBrowserControlAuthParams = {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
};
/** Resolved auth plus the generated token when this call created one. */
type EnsureBrowserControlAuthResult = {
    auth: BrowserControlAuth;
    generatedToken?: string;
};
/** Resolves browser control auth from config/env without generating new credentials. */
export declare function resolveBrowserControlAuth(cfg?: OpenClawConfig, env?: NodeJS.ProcessEnv): BrowserControlAuth;
/** Returns whether browser control auth should be generated for this environment. */
export declare function shouldAutoGenerateBrowserAuth(env: NodeJS.ProcessEnv): boolean;
/** Ensures browser control auth exists, returning any token generated during the call. */
export declare function ensureBrowserControlAuth(params: EnsureBrowserControlAuthParams): Promise<EnsureBrowserControlAuthResult>;
export {};
