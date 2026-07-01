import type { OpenClawConfig } from "./types.openclaw.js";
export declare const AUTO_MANAGED_CONFIG_META_PATHS: readonly [readonly ["meta", "lastTouchedVersion"], readonly ["meta", "lastTouchedAt"]];
export declare function stampConfigWriteMetadata(cfg: OpenClawConfig, now?: string, version?: string): OpenClawConfig;
