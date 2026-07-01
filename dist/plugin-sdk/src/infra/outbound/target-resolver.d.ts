import type { ChannelPlugin } from "../../channels/plugins/types.plugin.js";
import type { ChannelDirectoryEntry, ChannelDirectoryEntryKind, ChannelId } from "../../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type RuntimeEnv } from "../../runtime.js";
/** Directory-backed destination kind used by outbound target resolution. */
export type TargetResolveKind = ChannelDirectoryEntryKind | "channel";
/** Strategy for resolving multiple matching directory entries. */
export type ResolveAmbiguousMode = "error" | "best" | "first";
/** Canonical outbound target produced by plugin, directory, or normalized fallback resolution. */
export type ResolvedMessagingTarget = {
    to: string;
    kind: TargetResolveKind;
    display?: string;
    source: "normalized" | "directory";
    resolutionSource: "plugin" | "directory" | "normalized";
};
/** Result of resolving a user-supplied outbound target. */
export type ResolveMessagingTargetResult = {
    ok: true;
    target: ResolvedMessagingTarget;
} | {
    ok: false;
    error: Error;
    candidates?: ChannelDirectoryEntry[];
};
export { maybeResolveIdLikeTarget } from "./target-id-resolution.js";
/** Resolves a channel target using the shared outbound target resolver. */
export declare function resolveChannelTarget(params: {
    cfg: OpenClawConfig;
    channel: ChannelId;
    input: string;
    accountId?: string | null;
    preferredKind?: TargetResolveKind;
    runtime?: RuntimeEnv;
    resolveAmbiguous?: ResolveAmbiguousMode;
    unknownTargetMode?: "error" | "normalized";
    plugin?: ChannelPlugin;
}): Promise<ResolveMessagingTargetResult>;
/** Clears cached directory entries for all channels or one channel/account scope. */
export declare function resetDirectoryCache(params?: {
    channel?: ChannelId;
    accountId?: string | null;
}): void;
/** Formats a resolved target for user-facing summaries. */
export declare function formatTargetDisplay(params: {
    channel: ChannelId;
    target: string;
    display?: string;
    kind?: ChannelDirectoryEntryKind;
}): string;
/** Resolves a user target through id-like, directory, plugin, and normalized fallback paths. */
export declare function resolveMessagingTarget(params: {
    cfg: OpenClawConfig;
    channel: ChannelId;
    input: string;
    accountId?: string | null;
    preferredKind?: TargetResolveKind;
    runtime?: RuntimeEnv;
    resolveAmbiguous?: ResolveAmbiguousMode;
    unknownTargetMode?: "error" | "normalized";
    plugin?: ChannelPlugin;
}): Promise<ResolveMessagingTargetResult>;
/** Looks up a display label for a resolved target id from cached/live directory entries. */
export declare function lookupDirectoryDisplay(params: {
    cfg: OpenClawConfig;
    channel: ChannelId;
    targetId: string;
    accountId?: string | null;
    runtime?: RuntimeEnv;
}): Promise<string | undefined>;
