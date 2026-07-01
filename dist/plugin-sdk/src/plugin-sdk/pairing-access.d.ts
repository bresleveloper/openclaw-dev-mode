import type { ChannelId } from "../channels/plugins/types.public.js";
import type { PluginRuntime } from "../plugins/runtime/types.js";
type PairingApi = PluginRuntime["channel"]["pairing"];
type ScopedUpsertInput = Omit<Parameters<PairingApi["upsertPairingRequest"]>[0], "channel" | "accountId">;
/** Scope pairing store operations to one channel/account pair for plugin-facing helpers. */
export declare function createScopedPairingAccess(params: {
    /** Plugin runtime that owns the channel pairing store API. */
    core: PluginRuntime;
    /** Channel id permanently attached to store reads and writes from this helper. */
    channel: ChannelId;
    /** Channel account id normalized once before store operations. */
    accountId: string;
}): {
    /** Normalized account id used by every channel-scoped pairing store operation. */
    accountId: string;
    /** Read allow-list entries for the scoped channel/account pair. */
    readAllowFromStore: () => Promise<string[]>;
    /** Read another channel/account allow-list for DM policy cross-checks. */
    readStoreForDmPolicy: (provider: ChannelId, accountId: string) => Promise<string[]>;
    /** Upsert a pairing request with the scoped channel/account injected. */
    upsertPairingRequest: (input: ScopedUpsertInput) => Promise<{
        code: string;
        created: boolean;
    }>;
};
export {};
