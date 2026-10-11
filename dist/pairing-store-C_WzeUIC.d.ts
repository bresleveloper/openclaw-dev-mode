import { A as ChannelPairingAdapter } from "./types.adapters-IC4-T9eq.js";
import { n as PairingChannel } from "./pairing-messages-DiONVw10.js";
//#region src/pairing/pairing-store.d.ts
declare function readChannelAllowFromStore(channel: PairingChannel, env?: NodeJS.ProcessEnv, accountId?: string): Promise<string[]>;
declare function readChannelAllowFromStoreSync(channel: PairingChannel, env?: NodeJS.ProcessEnv, accountId?: string): string[];
declare function upsertChannelPairingRequest(params: {
  channel: PairingChannel;
  id: string | number;
  accountId: string;
  meta?: Record<string, string | undefined | null>;
  env?: NodeJS.ProcessEnv;
  /** Extension channels can pass their adapter directly to bypass registry lookup. */
  pairingAdapter?: ChannelPairingAdapter;
}): Promise<{
  code: string;
  created: boolean;
}>;
//#endregion
export { readChannelAllowFromStoreSync as n, upsertChannelPairingRequest as r, readChannelAllowFromStore as t };