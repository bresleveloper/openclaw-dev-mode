/**
 * Updates static model allowlist entries in agent defaults. Setup uses this
 * helper to keep both raw and canonical provider/model keys present.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Ensures a static model allowlist entry exists in agent defaults. */
export declare function ensureStaticModelAllowlistEntry(params: {
    cfg: OpenClawConfig;
    modelRef: string;
    defaultProvider?: string;
}): OpenClawConfig;
