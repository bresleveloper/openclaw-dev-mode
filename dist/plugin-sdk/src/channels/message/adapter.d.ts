/**
 * Channel message adapter definition helper.
 *
 * Supplies manual receive acknowledgement defaults while preserving adapter-specific types.
 */
import type { ChannelMessageAdapter, ChannelMessageAdapterShape } from "./types.js";
declare const defaultManualReceiveAdapter: {
    readonly defaultAckPolicy: "manual";
    readonly supportedAckPolicies: readonly ["manual"];
};
type ChannelMessageAdapterWithDefaultReceive<TAdapter extends ChannelMessageAdapterShape> = TAdapter & {
    receive: TAdapter["receive"] extends undefined ? typeof defaultManualReceiveAdapter : NonNullable<TAdapter["receive"]>;
};
/** Defines a message adapter while defaulting receive acknowledgement to manual. */
export declare function defineChannelMessageAdapter<const TAdapter extends ChannelMessageAdapterShape>(adapter: TAdapter): ChannelMessageAdapter<ChannelMessageAdapterWithDefaultReceive<TAdapter>>;
export {};
