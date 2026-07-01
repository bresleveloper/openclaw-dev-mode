import type { OpenClawConfig } from "../../../config/types.openclaw.js";
/** Collect per-agent warnings for active plugin tools rejected by runtime schema projection. */
export declare function collectActiveToolSchemaProjectionWarnings(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): string[];
