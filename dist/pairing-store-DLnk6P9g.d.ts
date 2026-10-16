import { M as ChannelPairingAdapter } from "./types.adapters-Bo2TMZGx.js";
import { t as PairingChannel } from "./pairing-store.types-D3p0FhGO.js";
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