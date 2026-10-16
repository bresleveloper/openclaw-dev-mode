import "../types.openclaw-DWWUw8hA.js";
import { ft as OriginatingChannelType, st as FinalizedMsgContext } from "../reply-payload-DazZPys5.js";
import "../index-B4F-ENEv.js";
import { Z as PluginHookInboundMessageMetadata, et as PluginHookMessageContext, it as MessageHookMediaFact, n as initializeGlobalHookRunner, nt as PluginHookMessageSentEvent, r as resetGlobalHookRunner, tt as PluginHookMessageReceivedEvent } from "../hook-runner-global-Jvv9WFUW.js";
import { a as InternalHookEvent, o as InternalHookEventType, s as InternalHookHandler } from "../workspace-BKLUW5Z-.js";
//#region src/hooks/fire-and-forget.d.ts
/** Queue limits for bounded fire-and-forget hook execution. */
type FireAndForgetBoundedHookOptions = {
  maxConcurrency?: number;
  maxQueue?: number;
  timeoutMs?: number;
};
/** Run a hook promise without awaiting it, logging rejection safely. */
export declare function fireAndForgetHook(task: Promise<unknown>, label: string, logger?: (message: string) => void): void;
/** Queue a fire-and-forget hook with bounded concurrency, queue depth, and timeout logs. */
export declare function fireAndForgetBoundedHook(task: () => Promise<unknown>, label: string, logger?: (message: string) => void, options?: FireAndForgetBoundedHookOptions): void;
//#endregion
//#region src/hooks/internal-hooks.d.ts
type MessageReceivedHookContext = {
  /** Sender identifier (e.g., phone number, user ID) */
  from: string;
  content: string;
  /** Unix timestamp when the message was received */
  timestamp?: number;
  /** Channel identifier (for example "chat" or "support-chat") */
  channelId: string;
  /** Provider account ID for multi-account setups */
  accountId?: string;
  conversationId?: string;
  /** Message ID from the provider */
  messageId?: string;
  /** Staged, locally usable attachments in stable source order. */
  media?: MessageHookMediaFact[];
  /** Original attachment facts when local staging has not completed yet. */
  originalMedia?: MessageHookMediaFact[];
  /** True when originalMedia is present but media is withheld pending staging. */
  mediaStagingPending?: boolean;
  /** Additional provider-specific metadata */
  metadata?: Record<string, unknown>;
};
type MessageSentHookContext = Pick<MessageReceivedHookContext, "content" | "channelId" | "accountId" | "conversationId" | "messageId"> & {
  to: string;
  success: boolean;
  /** Error message if sending failed */
  error?: string;
  /** Whether this message was sent in a group/channel context */
  isGroup?: boolean;
  /** Group or channel identifier, if applicable */
  groupId?: string;
};
/** Register for a family (e.g. "command") or an exact action (e.g. "command:new"). */
export declare function registerInternalHook(eventKey: string, handler: InternalHookHandler): void;
export declare function clearInternalHooks(): void;
/** Dispatch family handlers before exact-action handlers, in registration order; isolate errors. */
export declare function triggerInternalHook(event: InternalHookEvent): Promise<void>;
export declare function createInternalHookEvent(type: InternalHookEventType, action: string, sessionKey: string, context?: Record<string, unknown>): InternalHookEvent;
//#endregion
//#region src/hooks/message-hook-mappers.d.ts
type CanonicalSentMessageHookContext = MessageSentHookContext & Pick<PluginHookMessageContext, "sessionKey" | "runId" | "trace" | "callDepth">;
declare function deriveInboundMessageHookContextBase(ctx: FinalizedMsgContext, overrides?: {
  content?: string;
  messageId?: string;
}): {
  from: string;
  to: string | undefined;
  content: string;
  body: string | undefined;
  bodyForAgent: string | undefined;
  transcript: string | undefined;
  timestamp: number | undefined;
  channelId: string;
  accountId: string | undefined;
  conversationId: string | undefined;
  sessionKey: string | undefined;
  agentId: string | undefined;
  messageId: string | undefined;
  senderId: string | undefined;
  senderName: string | undefined;
  senderUsername: string | undefined;
  senderE164: string | undefined;
  replyToId: string | undefined;
  replyToIdFull: string | undefined;
  replyToBody: string | undefined;
  replyToSender: string | undefined;
  replyToIsQuote: boolean | undefined;
  provider: string | undefined;
  surface: string | undefined;
  threadId: string | number | undefined;
  threadParentId: string | undefined;
  media?: MessageHookMediaFact[] | undefined;
  mediaPath: string | undefined;
  mediaUrl: string | undefined;
  mediaType: string | undefined;
  mediaPaths: string[] | undefined;
  mediaUrls: string[] | undefined;
  mediaTypes: string[] | undefined;
  originatingChannel: OriginatingChannelType | undefined;
  originatingTo: string | undefined;
  guildId: string | undefined;
  channelName: string | undefined;
  isGroup: boolean;
  groupId: string | undefined;
  topicName: string | undefined;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number | undefined;
    name?: string | undefined;
    address?: string | undefined;
    source?: "live" | "pin" | "place" | undefined;
    isLive?: boolean | undefined;
    livePeriodSeconds?: number | undefined;
    caption?: string | undefined;
  } | undefined;
  providerUpdate?: {
    id: string;
    kind: string;
    messageId?: string | undefined;
    messageTimestamp?: number | undefined;
    editedTimestamp?: number | undefined;
  } | undefined;
};
type DerivedInboundMessageHookContext = ReturnType<typeof deriveInboundMessageHookContextBase>;
type InboundMessageHookMetadataFields = Pick<PluginHookInboundMessageMetadata, "mediaPath" | "mediaUrl" | "mediaType" | "mediaPaths" | "mediaUrls" | "mediaTypes" | "originalMediaPath" | "originalMediaUrl" | "originalMediaType" | "originalMediaPaths" | "originalMediaUrls" | "originalMediaTypes" | "mediaStagingPending">;
type CanonicalInboundMessageHookContext = Pick<DerivedInboundMessageHookContext, "from" | "content" | "channelId" | "isGroup"> & Partial<DerivedInboundMessageHookContext> & Partial<Pick<PluginHookMessageContext, "runId" | "trace" | "callDepth">> & Partial<InboundMessageHookMetadataFields> & {
  originalMedia?: MessageHookMediaFact[];
  mediaRemoteHost?: string;
};
export declare function deriveInboundMessageHookContext(ctx: FinalizedMsgContext, overrides?: {
  content?: string;
  messageId?: string;
}): CanonicalInboundMessageHookContext;
export declare function buildCanonicalSentMessageHookContext(params: CanonicalSentMessageHookContext): CanonicalSentMessageHookContext;
export declare function toPluginMessageContext(canonical: CanonicalInboundMessageHookContext | CanonicalSentMessageHookContext): PluginHookMessageContext;
export declare function toPluginMessageReceivedEvent(canonical: CanonicalInboundMessageHookContext): PluginHookMessageReceivedEvent;
export declare function toPluginMessageSentEvent(canonical: CanonicalSentMessageHookContext): PluginHookMessageSentEvent;
export declare function toInternalMessageReceivedContext(canonical: CanonicalInboundMessageHookContext): MessageReceivedHookContext;
export declare function toInternalMessageSentContext(canonical: CanonicalSentMessageHookContext): MessageSentHookContext;
//#endregion
export { initializeGlobalHookRunner, resetGlobalHookRunner };