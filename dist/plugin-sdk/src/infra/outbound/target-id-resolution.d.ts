import type { ChannelPlugin } from "../../channels/plugins/types.plugin.js";
import type { ChannelDirectoryEntryKind, ChannelId } from "../../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Plugin-resolved destination for a channel target that already looks id-like. */
export type ResolvedIdLikeTarget = {
    to: string;
    kind: ChannelDirectoryEntryKind | "channel";
    display?: string;
    source: "normalized" | "directory";
    resolutionSource: "plugin";
};
/** Resolves an id-like outbound target through the channel plugin directory. */
export declare function maybeResolveIdLikeTarget(params: {
    cfg: OpenClawConfig;
    channel: ChannelId;
    input: string;
    accountId?: string | null;
    preferredKind?: ChannelDirectoryEntryKind | "channel";
    plugin?: ChannelPlugin;
}): Promise<ResolvedIdLikeTarget | undefined>;
