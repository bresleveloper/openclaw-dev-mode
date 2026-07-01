import type { OpenClawConfig } from "./types.js";
/** Returns true when a dotenv value is only a shell reference, not an expanded secret. */
export declare function isUnresolvedShellReference(value: string): boolean;
type ParsedStateDirDotEnv = {
    /** Keys whose values are persisted to the managed service environment. */
    entries: Record<string, string>;
    /**
     * Keys that were dropped because their entire value was an unresolved shell
     * reference ($VAR, ${VAR}, or $(cmd)). These are still OpenClaw-managed keys:
     * a previously generated env file may carry a stale literal reference for them
     * that must be removed on re-stage rather than preserved as an operator secret.
     */
    skippedShellReferenceKeys: string[];
};
/**
 * Read and parse the state-dir `.env`, returning both the persisted entries and
 * the keys that were skipped because they held unresolved shell references. The
 * skipped keys are surfaced so generated service env files can remove stale
 * literal references for keys OpenClaw previously managed.
 */
export declare function readStateDirDotEnvFromStateDir(stateDir: string): ParsedStateDirDotEnv;
/**
 * Read and parse `~/.openclaw/.env` (or `$OPENCLAW_STATE_DIR/.env`), returning
 * a filtered record of key-value pairs suitable for a managed service
 * environment source.
 */
export declare function readStateDirDotEnvVars(env: Record<string, string | undefined>): Record<string, string>;
/** Split view of durable gateway service env sources before precedence is applied. */
export type DurableServiceEnvVarSources = {
    stateDirDotEnvEnvironment: Record<string, string>;
    configEnvironment: Record<string, string>;
    durableEnvironment: Record<string, string>;
};
/** Collects durable service env vars from state-dir `.env` and config, preserving each source. */
export declare function collectDurableServiceEnvVarSources(params: {
    env: Record<string, string | undefined>;
    config?: OpenClawConfig;
}): DurableServiceEnvVarSources;
/**
 * Durable service env sources survive beyond the invoking shell and are safe to
 * persist into owner-only gateway service environment sources.
 *
 * Precedence:
 * 1. state-dir `.env` file vars
 * 2. config service env vars
 */
export declare function collectDurableServiceEnvVars(params: {
    env: Record<string, string | undefined>;
    config?: OpenClawConfig;
}): Record<string, string>;
export {};
