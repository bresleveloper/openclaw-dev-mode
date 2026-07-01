import type { OpenClawConfig } from "../../../config/types.openclaw.js";
/** Run common compatibility migrations before caller-specific setup/channel passes. */
export declare function normalizeBaseCompatibilityConfigValues(cfg: OpenClawConfig, changes: string[], afterBrowser?: (config: OpenClawConfig) => OpenClawConfig): OpenClawConfig;
