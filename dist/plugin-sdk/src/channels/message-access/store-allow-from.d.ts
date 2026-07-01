import type { PairingChannel } from "../../pairing/pairing-store.types.js";
/**
 * Read pairing-store allowlist entries when a direct-message policy permits
 * store fallback.
 */
export declare function readChannelIngressStoreAllowFromForDmPolicy(params: {
    provider: PairingChannel;
    accountId: string;
    dmPolicy?: string | null;
    shouldRead?: boolean | null;
    readStore?: (provider: PairingChannel, accountId: string) => Promise<string[]>;
}): Promise<string[]>;
