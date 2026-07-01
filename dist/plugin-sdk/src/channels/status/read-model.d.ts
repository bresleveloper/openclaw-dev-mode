import type { ChannelAccountSnapshot } from "../plugins/types.public.js";
export type RuntimeChannelStatusPayload = {
    channelAccounts?: unknown;
};
type RuntimeChannelAccount = Record<string, unknown>;
/** Reads raw runtime account records for one channel from a gateway payload. */
export declare function getRuntimeChannelAccounts(params: {
    payload: unknown;
    channelId: string;
}): RuntimeChannelAccount[];
/** Normalizes gateway channel account snapshots into a channel-id map. */
export declare function normalizeRuntimeChannelAccountSnapshots(payload: unknown): Map<string, ChannelAccountSnapshot[]>;
/** Reports whether a runtime account has usable live credentials. */
export declare function hasRuntimeCredentialAvailable(params: {
    liveAccounts: RuntimeChannelAccount[];
    accountId: string;
}): boolean;
/** Converts configured-but-unavailable credential markers to available. */
export declare function markConfiguredUnavailableCredentialStatusesAvailable(account: unknown): Record<string, unknown>;
/** Merges local and runtime accounts into display rows with source metadata. */
export declare function resolveChannelAccountStatusRows(params: {
    localAccountIds: string[];
    runtimeAccounts: ChannelAccountSnapshot[];
    resolveLocalSnapshot: (accountId: string) => Promise<ChannelAccountSnapshot>;
}): Promise<Array<{
    accountId: string;
    snapshot: ChannelAccountSnapshot;
    source: "gateway" | "config";
}>>;
export {};
