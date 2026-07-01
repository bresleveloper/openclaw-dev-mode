import type { ChannelId, ChannelMessageActionName } from "../../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type OutboundMediaAccess, type OutboundMediaReadFile } from "../../media/load-options.js";
import { readBooleanParam as readBooleanParamShared } from "../../plugin-sdk/boolean-param.js";
/** Shared boolean param reader used by message-action argument normalization. */
export declare const readBooleanParam: typeof readBooleanParamShared;
type StructuredAttachmentMode = "selected" | "all";
/** Resolves plugin-declared media source param aliases for a message action. */
export declare function resolveExtraActionMediaSourceParamKeys(params: {
    cfg: OpenClawConfig;
    action?: ChannelMessageActionName;
    args: Record<string, unknown>;
    channel?: string;
    accountId?: string | null;
    sessionKey?: string | null;
    sessionId?: string | null;
    agentId?: string | null;
    requesterSenderId?: string | null;
    senderIsOwner?: boolean;
}): string[];
/** Collects candidate media source strings from message-action args. */
export declare function collectActionMediaSourceHints(args: Record<string, unknown>, extraParamKeys?: readonly string[], options?: {
    structuredAttachments?: StructuredAttachmentMode;
}): string[];
/** Media access policy used when hydrating attachment action parameters. */
export type AttachmentMediaPolicy = {
    mode: "sandbox";
    sandboxRoot: string;
} | {
    mode: "host";
    mediaAccess?: OutboundMediaAccess;
    mediaLocalRoots?: readonly string[] | "any";
    mediaReadFile?: OutboundMediaReadFile;
};
/** Chooses sandbox or host media loading policy for attachment hydration. */
export declare function resolveAttachmentMediaPolicy(params: {
    sandboxRoot?: string;
    mediaAccess?: OutboundMediaAccess;
    mediaLocalRoots?: readonly string[] | "any";
    mediaReadFile?: OutboundMediaReadFile;
}): AttachmentMediaPolicy;
/** Rewrites action media params to sandbox-safe paths and rejects data URLs. */
export declare function normalizeSandboxMediaParams(params: {
    args: Record<string, unknown>;
    mediaPolicy: AttachmentMediaPolicy;
    extraParamKeys?: readonly string[];
    structuredAttachments?: StructuredAttachmentMode;
}): Promise<void>;
/** Normalizes a list of media hints against an optional sandbox root. */
export declare function normalizeSandboxMediaList(params: {
    values: string[];
    sandboxRoot?: string;
}): Promise<string[]>;
/** Hydrates attachment-bearing message actions with base64 buffers and metadata. */
export declare function hydrateAttachmentParamsForAction(params: {
    cfg: OpenClawConfig;
    channel: ChannelId;
    accountId?: string | null;
    args: Record<string, unknown>;
    action: ChannelMessageActionName;
    dryRun?: boolean;
    preserveSendBuffer?: boolean;
    mediaPolicy: AttachmentMediaPolicy;
    extraParamKeys?: readonly string[];
}): Promise<void>;
/** Parses a named string param as JSON for structured message action fields. */
export declare function parseJsonMessageParam(params: Record<string, unknown>, key: string): void;
/** Parses the interactive message action param as JSON when provided as a string. */
export declare function parseInteractiveParam(params: Record<string, unknown>): void;
export {};
