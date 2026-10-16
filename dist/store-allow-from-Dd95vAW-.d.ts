import { t as PairingChannel } from "./pairing-store.types-D3p0FhGO.js";
//#region src/channels/message-access/store-allow-from.d.ts
/**
 * Read pairing-store allowlist entries when a direct-message policy permits
 * store fallback.
 */
declare function readChannelIngressStoreAllowFromForDmPolicy(params: {
  provider: PairingChannel;
  accountId: string;
  dmPolicy?: string | null;
  shouldRead?: boolean | null;
  readStore?: (provider: PairingChannel, accountId: string) => Promise<string[]>;
}): Promise<string[]>;
//#endregion
export { readChannelIngressStoreAllowFromForDmPolicy as t };