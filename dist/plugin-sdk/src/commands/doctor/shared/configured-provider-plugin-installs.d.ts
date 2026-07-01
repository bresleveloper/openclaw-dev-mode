import type { OpenClawConfig } from "../../../config/types.openclaw.js";
/** Lists external provider plugins implied by configured auth profiles and model refs. */
export declare function collectConfiguredProviderPluginIds(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): string[];
