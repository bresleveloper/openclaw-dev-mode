import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";

//#region src/channels/plugins/pairing.types.d.ts
/**
 * Channel pairing hooks used by setup and allowlist approval flows.
 */
type ChannelPairingAdapter = {
  idLabel: string;
  normalizeAllowEntry?: (entry: string) => string;
  notifyApproval?: (params: {
    cfg: OpenClawConfig;
    id: string;
    accountId?: string;
    runtime?: RuntimeEnv;
  }) => Promise<void>;
};
//#endregion
export { ChannelPairingAdapter as t };