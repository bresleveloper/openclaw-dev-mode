import type { OpenClawConfig } from "../config/types.openclaw.js";
type AuthProfileConfigProtectionResult = {
    config: OpenClawConfig;
    repairs: string[];
    warnings: string[];
};
/**
 * Restores valid metadata for auth profiles still referenced by active model config.
 *
 * Doctor can rebuild or prune auth config; this guard keeps active profiles usable when their
 * provider/mode metadata can be inferred from the before/after config or profile id.
 */
export declare function protectActiveAuthProfileConfig(params: {
    before: OpenClawConfig;
    after: OpenClawConfig;
}): AuthProfileConfigProtectionResult;
export {};
