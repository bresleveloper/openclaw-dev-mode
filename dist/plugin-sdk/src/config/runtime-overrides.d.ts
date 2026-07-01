import type { OpenClawConfig } from "./types.js";
type OverrideTree = Record<string, unknown>;
/** Return the process-local runtime override tree used by debug config commands. */
export declare function getConfigOverrides(): OverrideTree;
/** Clear all process-local runtime overrides. Intended for debug reset flows and tests. */
export declare function resetConfigOverrides(): void;
/** Set one runtime override at a parsed config path after sanitizing object values. */
export declare function setConfigOverride(pathRaw: string, value: unknown): {
    ok: boolean;
    error?: string;
};
/** Remove one runtime override path and report whether an override was present. */
export declare function unsetConfigOverride(pathRaw: string): {
    ok: boolean;
    removed: boolean;
    error?: string;
};
/** Merge the current runtime overrides over a loaded config without mutating the input config. */
export declare function applyConfigOverrides(cfg: OpenClawConfig): OpenClawConfig;
export {};
