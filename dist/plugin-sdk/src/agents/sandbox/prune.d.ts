import type { SandboxConfig } from "./types.js";
/** Runs sandbox pruning at most once per throttle window. */
export declare function maybePruneSandboxes(cfg: SandboxConfig): Promise<void>;
