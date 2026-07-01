import type { OpenClawConfig } from "./types.js";
/** Returns whether a config-controlled environment entry is safe to apply at runtime. */
export declare function isConfigRuntimeEnvVarAllowed(key: string, value: string): boolean;
export declare function cloneEnvWithPlatformSemantics(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv;
/** Collects config env vars safe to inject into runtime process environments. */
export declare function collectConfigRuntimeEnvVars(cfg?: OpenClawConfig): Record<string, string>;
/** Collects config env vars safe to persist into managed service environments. */
export declare function collectConfigServiceEnvVars(cfg?: OpenClawConfig): Record<string, string>;
/** Builds a cloned environment with config env vars applied without mutating the base env. */
export declare function createConfigRuntimeEnv(cfg: OpenClawConfig, baseEnv?: NodeJS.ProcessEnv): NodeJS.ProcessEnv;
/** Applies config env vars to an environment without overwriting existing non-empty values. */
export declare function applyConfigEnvVars(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv, options?: {
    lowerPrecedenceEnv?: Readonly<Record<string, string>>;
    onLowerPrecedenceKeysReplaced?: (keys: readonly string[]) => void;
}): void;
