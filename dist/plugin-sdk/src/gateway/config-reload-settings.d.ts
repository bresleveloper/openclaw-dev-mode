import type { GatewayReloadMode } from "../config/types.gateway.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type GatewayReloadSettings = {
    mode: GatewayReloadMode;
    debounceMs: number;
};
/** Resolves gateway reload mode/debounce from config with bounded defaults. */
export declare function resolveGatewayReloadSettings(cfg: OpenClawConfig): GatewayReloadSettings;
export {};
