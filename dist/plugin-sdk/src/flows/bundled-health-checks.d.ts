import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Registers bundled health checks that are explicitly enabled by config and owner policy. */
export declare function registerBundledHealthChecks(params: {
    cfg: OpenClawConfig;
    cwd?: string;
}): void;
