import type { ChannelDmAllowFromMode } from "../../../channels/plugins/dm-access.js";
export type AllowFromMode = ChannelDmAllowFromMode;
/** Return the allowFrom interpretation mode advertised by a channel's doctor metadata. */
export declare function resolveAllowFromMode(channelName: string): AllowFromMode;
