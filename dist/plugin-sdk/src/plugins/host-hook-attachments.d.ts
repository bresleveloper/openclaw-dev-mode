import * as fsPromises from "node:fs/promises";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginAttachmentChannelHints, PluginSessionAttachmentCaptionFormat, PluginSessionAttachmentParams, PluginSessionAttachmentResult } from "./host-hooks.js";
import type { PluginOrigin } from "./plugin-origin.types.js";
/** Filesystem adapter used by attachment MIME probes and tests. */
export declare const attachmentProbeFs: {
    open: (...args: Parameters<typeof fsPromises.open>) => Promise<fsPromises.FileHandle>;
};
type ResolvedAttachmentDelivery = {
    parseMode?: "HTML";
    escapePlainHtmlCaption?: boolean;
    disableNotification?: boolean;
    forceDocumentMime?: string;
    threadTs?: string;
};
/** Resolves channel-specific attachment delivery options from caption format and hints. */
export declare function resolveAttachmentDelivery(params: {
    channel: string;
    captionFormat?: PluginSessionAttachmentCaptionFormat;
    channelHints?: PluginAttachmentChannelHints;
}): ResolvedAttachmentDelivery;
/** Resolves the thread id used when delivering a plugin session attachment. */
export declare function resolveSessionAttachmentThreadId(params: {
    deliveryThreadId?: unknown;
    explicitThreadId?: unknown;
    fallbackThreadId?: unknown;
    hintThreadTs?: string;
}): string | number | undefined;
/** Sends a bundled-plugin session attachment through the session's active delivery route. */
export declare function sendPluginSessionAttachment(params: PluginSessionAttachmentParams & {
    config?: OpenClawConfig;
    origin?: PluginOrigin;
}): Promise<PluginSessionAttachmentResult>;
export {};
