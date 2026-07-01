import type { OpenClawConfig } from "../config/types.openclaw.js";
/**
 * Emits device pairing repair guidance from live gateway state or local pairing files.
 *
 * Remote gateways only report through the gateway API; local gateways can fall back to on-disk
 * pairing state when the gateway is down.
 */
export declare function noteDevicePairingHealth(params: {
    cfg: OpenClawConfig;
    healthOk: boolean;
}): Promise<void>;
