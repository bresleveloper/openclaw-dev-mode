import { E as ReplyToMode } from "./types.base-DD09OBJd.js";
import { n as PollInput } from "./polls-CfHkU59X.js";
import { P as MessageReceipt } from "./types-TsxybTb_.js";
import { n as NormalizedLocation } from "./location-Nlme7YFG.js";
import { c as WAMessageKey, n as WhatsAppReplyContext, o as AnyMessageContent, r as WhatsAppSelfIdentity, s as MiscMessageGenerationOptions, t as WhatsAppIdentity } from "./identity-DCTSP_rK.js";
import { C as ResolvedChannelMessageIngress } from "./index-BtHCe7NJ.js";
//#region extensions/whatsapp/src/inbound/admission-types.d.ts
type DeprecatedWebInboundAdmissionTopLevelFields = {
  /** @deprecated Use `admission.conversation.id`. */from: string; /** @deprecated Use `admission.conversation.id`. */
  conversationId: string; /** @deprecated Use `admission.accountId`. */
  accountId: string;
  /**
   * @deprecated Use `admission.ingress.decision === "allow"`.
   *
   * Set by the real inbound monitor after access-control / pairing checks pass.
   * On messages with `admission`, this is a derived compatibility view; writes
   * are retained only for legacy inputs without an admission envelope.
   */
  accessControlPassed?: boolean; /** @deprecated Use `admission.conversation.kind`. */
  chatType: "direct" | "group";
};
//#endregion
//#region extensions/whatsapp/src/inbound/admission.d.ts
type WhatsAppInboundIngressDecision = Pick<ResolvedChannelMessageIngress["ingress"], "admission" | "decision" | "decisiveGateId" | "reasonCode">;
type WhatsAppInboundSenderAccess = Pick<ResolvedChannelMessageIngress["senderAccess"], "allowed" | "decision" | "reasonCode" | "providerMissingFallbackApplied">;
type WhatsAppInboundCommandAccess = Pick<ResolvedChannelMessageIngress["commandAccess"], "requested" | "authorized" | "shouldBlockControlCommand" | "reasonCode">;
type WhatsAppInboundActivationAccess = Pick<ResolvedChannelMessageIngress["activationAccess"], "ran" | "allowed" | "shouldSkip" | "reasonCode">;
/**
 * Public-safe accepted inbound facts resolved by access control.
 *
 * Keep this as an admission envelope around canonical channel ingress
 * projections. Later PRs can migrate consumers to these projections without
 * publishing raw allowlist material or session-dependent post-admission state.
 */
type WhatsAppInboundAdmission = {
  accountId: string;
  isSelfChat: boolean;
  account: {
    accountId: string;
    name?: string;
    enabled: boolean;
    sendReadReceipts: boolean;
    selfChatMode?: boolean;
    replyToMode?: ReplyToMode;
  };
  conversation: {
    kind: "direct" | "group";
    id: string;
    groupSessionId: string;
  };
  sender: {
    id: string;
    isSamePhone: boolean;
  };
  ingress: WhatsAppInboundIngressDecision;
  senderAccess: WhatsAppInboundSenderAccess;
  commandAccess: WhatsAppInboundCommandAccess;
  activationAccess: WhatsAppInboundActivationAccess;
};
//#endregion
//#region extensions/whatsapp/src/inbound/send-result.d.ts
type WhatsAppSendKind = "contact" | "location" | "media" | "poll" | "reaction" | "sticker" | "text";
type WhatsAppSendKey = Omit<Pick<WAMessageKey, "fromMe" | "id" | "participant" | "remoteJid">, "id"> & {
  id: string;
};
type WhatsAppSendResult = {
  kind: WhatsAppSendKind;
  messageId: string;
  receipt?: MessageReceipt;
  keys: WhatsAppSendKey[];
  providerAccepted: boolean;
};
//#endregion
//#region extensions/whatsapp/src/inbound/types.d.ts
type WebListenerCloseReason = {
  status?: number;
  isLoggedOut: boolean;
  error?: unknown;
};
type ActiveWebSendOptions = {
  quotedMessageKey?: {
    id: string;
    remoteJid: string;
    fromMe: boolean;
    participant?: string;
    messageText?: string;
  };
  gifPlayback?: boolean;
  accountId?: string;
  fileName?: string;
  asDocument?: boolean;
};
type ActiveWebListener = {
  assertSendReady?: (to: string) => Promise<void>;
  sendMessage: (to: string, text: string, mediaBuffer?: Buffer, mediaType?: string, options?: ActiveWebSendOptions) => Promise<WhatsAppSendResult>;
  sendPoll: (to: string, poll: PollInput) => Promise<WhatsAppSendResult>;
  sendReaction: (chatJid: string, messageId: string, emoji: string, fromMe: boolean, participant?: string) => Promise<WhatsAppSendResult>;
  sendComposingTo: (to: string) => Promise<void>;
  close?: () => Promise<void>;
};
type WhatsAppStructuredContactContext = {
  kind: "contact" | "contacts";
  total: number;
  contacts: Array<{
    name?: string;
    phones?: string[];
  }>;
};
type WhatsAppInboundEvent = {
  id?: string;
  timestamp?: number;
  isBatched?: boolean;
};
type WhatsAppInboundQuote = {
  context?: WhatsAppReplyContext;
  id?: string;
  body?: string;
  sender?: {
    displayName?: string;
    jid?: string;
    e164?: string;
  };
};
type WhatsAppInboundGroupContext = {
  subject?: string;
  participants?: string[];
  mentions?: {
    text?: string[];
    jids?: string[];
  };
};
type WhatsAppInboundPayload = {
  body: string;
  commandBody?: string;
  media?: {
    path?: string;
    type?: string;
    fileName?: string;
    url?: string;
  };
  location?: NormalizedLocation;
  untrustedStructuredContext?: Array<{
    label: string;
    source?: string;
    type?: string;
    payload: unknown;
  }>;
};
type WhatsAppInboundPlatform = {
  chatJid: string;
  recipientJid: string;
  sender?: WhatsAppIdentity;
  senderJid?: string;
  senderE164?: string;
  senderName?: string;
  pushName?: string;
  self?: WhatsAppSelfIdentity;
  selfJid?: string | null;
  selfLid?: string | null;
  selfE164?: string | null;
  fromMe?: boolean;
  sendComposing: () => Promise<void>;
  reply: (text: string, options?: MiscMessageGenerationOptions) => Promise<WhatsAppSendResult>;
  sendMedia: (payload: AnyMessageContent, options?: MiscMessageGenerationOptions) => Promise<WhatsAppSendResult>;
};
type DeprecatedWebInboundMessageFlatAliases = {
  /** @deprecated Use `event.id`. */id?: string; /** @deprecated Use `platform.recipientJid`. */
  to: string; /** @deprecated Use `payload.body`. */
  body: string; /** @deprecated Use `platform.pushName`. */
  pushName?: string; /** @deprecated Use `event.timestamp`. */
  timestamp?: number; /** @deprecated Use `platform.chatJid`. */
  chatId: string; /** @deprecated Use `platform.sender`. */
  sender?: WhatsAppIdentity; /** @deprecated Use `platform.senderJid`. */
  senderJid?: string; /** @deprecated Use `platform.senderE164`. */
  senderE164?: string; /** @deprecated Use `platform.senderName`. */
  senderName?: string; /** @deprecated Use `quote.context`. */
  replyTo?: WhatsAppReplyContext; /** @deprecated Use `quote.id`. */
  replyToId?: string; /** @deprecated Use `quote.body`. */
  replyToBody?: string; /** @deprecated Use `quote.sender.displayName`. */
  replyToSender?: string; /** @deprecated Use `quote.sender.jid`. */
  replyToSenderJid?: string; /** @deprecated Use `quote.sender.e164`. */
  replyToSenderE164?: string; /** @deprecated Use `group.subject`. */
  groupSubject?: string; /** @deprecated Use `group.participants`. */
  groupParticipants?: string[]; /** @deprecated Use `group.mentions.jids`. */
  mentions?: string[]; /** @deprecated Use `group.mentions.jids`. */
  mentionedJids?: string[]; /** @deprecated Use `platform.self`. */
  self?: WhatsAppSelfIdentity; /** @deprecated Use `platform.selfJid`. */
  selfJid?: string | null; /** @deprecated Use `platform.selfLid`. */
  selfLid?: string | null; /** @deprecated Use `platform.selfE164`. */
  selfE164?: string | null; /** @deprecated Use `platform.fromMe`. */
  fromMe?: boolean; /** @deprecated Use `payload.location`. */
  location?: NormalizedLocation; /** @deprecated Use `platform.sendComposing`. */
  sendComposing: () => Promise<void>; /** @deprecated Use `platform.reply`. */
  reply: (text: string, options?: MiscMessageGenerationOptions) => Promise<WhatsAppSendResult>; /** @deprecated Use `platform.sendMedia`. */
  sendMedia: (payload: AnyMessageContent, options?: MiscMessageGenerationOptions) => Promise<WhatsAppSendResult>; /** @deprecated Use `payload.media.path`. */
  mediaPath?: string; /** @deprecated Use `payload.media.type`. */
  mediaType?: string; /** @deprecated Use `payload.media.fileName`. */
  mediaFileName?: string; /** @deprecated Use `payload.media.url`. */
  mediaUrl?: string; /** @deprecated Use `payload.untrustedStructuredContext`. */
  untrustedStructuredContext?: Array<{
    label: string;
    source?: string;
    type?: string;
    payload: unknown;
  }>; /** @deprecated Use `event.isBatched`. */
  isBatched?: boolean;
};
type WebInboundCallbackMessageCommon = {
  quote?: WhatsAppInboundQuote;
  group?: WhatsAppInboundGroupContext;
  wasMentioned?: boolean;
  groupMention?: {
    wasMentioned: boolean;
    requireMention: boolean;
  };
};
type WebInboundCallbackAdmissionFields = ({
  admission: WhatsAppInboundAdmission;
} & Partial<DeprecatedWebInboundAdmissionTopLevelFields>) | ({
  admission?: WhatsAppInboundAdmission;
} & DeprecatedWebInboundAdmissionTopLevelFields);
type WebInboundCallbackMessage = WebInboundCallbackMessageCommon & WebInboundCallbackAdmissionFields & {
  event: WhatsAppInboundEvent;
  payload: WhatsAppInboundPayload;
  platform: WhatsAppInboundPlatform;
};
type WebInboundMessage = WebInboundCallbackMessage & DeprecatedWebInboundAdmissionTopLevelFields & DeprecatedWebInboundMessageFlatAliases;
type AdmittedWebInboundMessage = Omit<WebInboundMessage, keyof DeprecatedWebInboundAdmissionTopLevelFields | "admission"> & {
  admission: WhatsAppInboundAdmission;
};
type LegacyFlatWebInboundMessage = DeprecatedWebInboundAdmissionTopLevelFields & Pick<WebInboundCallbackMessageCommon, "wasMentioned"> & {
  admission?: WhatsAppInboundAdmission;
} & DeprecatedWebInboundMessageFlatAliases & {
  event?: never;
  payload?: never;
  platform?: never;
  quote?: never;
  group?: never;
};
type WebInboundMessageInput = LegacyFlatWebInboundMessage | WebInboundCallbackMessage;
//#endregion
export { WebInboundCallbackMessage as a, WebListenerCloseReason as c, WhatsAppInboundAdmission as d, LegacyFlatWebInboundMessage as i, WhatsAppStructuredContactContext as l, ActiveWebSendOptions as n, WebInboundMessage as o, AdmittedWebInboundMessage as r, WebInboundMessageInput as s, ActiveWebListener as t, WhatsAppSendResult as u };