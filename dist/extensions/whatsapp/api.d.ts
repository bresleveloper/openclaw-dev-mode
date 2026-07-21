import { t as ChannelPlugin } from "../../types.plugin-DeFN_A48.js";
import { l as normalizeE164, p as resolveUserPath } from "../../utils-CFyao__w.js";
import { a as listWhatsAppAuthDirs, c as resolveWhatsAppMediaMaxBytes, i as listEnabledWhatsAppAccounts, l as listAccountIds, n as ResolvedWhatsAppAccount, o as resolveWhatsAppAccount, r as hasAnyWhatsAppAuth, s as resolveWhatsAppAuthDir, t as DEFAULT_WHATSAPP_MEDIA_MAX_MB, u as resolveDefaultWhatsAppAccountId } from "../../accounts-BSZnUeqA.js";
import { t as whatsappPlugin } from "../../channel-Bvc_cEWE.js";
import { t as whatsappSetupPlugin } from "../../channel.setup-CDjbmxmw.js";
import { t as DEFAULT_WEB_MEDIA_BYTES } from "../../constants-DyY8ENiv.js";
import { a as resolveWhatsAppOutboundTarget, c as WebInboundMsg, d as resolveWhatsAppGroupToolPolicy, l as WebMonitorTuning, o as WebChannelHealthState, s as WebChannelStatus, t as resolveWhatsAppGroupIntroHint, u as resolveWhatsAppGroupRequireMention } from "../../runtime-api-CfoGZcJC.js";
import { A as isSelfChatMode, D as JidToE164Options, F as toWhatsappJidWithLid, M as markdownToWhatsApp, N as resolveJidToE164, O as WebChannel, P as toWhatsappJid, j as jidToE164, k as assertWebChannel } from "../../session-errors-UAdbjcYp.js";
import { a as WebInboundCallbackMessage, c as WebListenerCloseReason, d as WhatsAppInboundAdmission, i as LegacyFlatWebInboundMessage, l as WhatsAppStructuredContactContext, n as ActiveWebSendOptions, o as WebInboundMessage, s as WebInboundMessageInput, t as ActiveWebListener } from "../../types-DMofNBEx.js";
import { n as listWhatsAppDirectoryPeersFromConfig, t as listWhatsAppDirectoryGroupsFromConfig } from "../../directory-config-BUYy_TDi.js";
import { a as normalizeWhatsAppMessagingTarget, i as normalizeWhatsAppAllowFromEntries, n as isWhatsAppUserTarget, o as normalizeWhatsAppTarget, r as looksLikeWhatsAppTargetId, t as isWhatsAppGroupJid } from "../../normalize-target-DDUW9UxI.js";
import { t as resolveWhatsAppInboundPolicy } from "../../inbound-policy-CuXhAPW8.js";

//#region extensions/whatsapp/src/command-policy.d.ts
declare const whatsappCommandPolicy: NonNullable<ChannelPlugin["commands"]>;
//#endregion
//#region extensions/whatsapp/src/outbound-send-deps.d.ts
declare const WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS: readonly ["sendWhatsApp"];
//#endregion
//#region extensions/whatsapp/src/inbound/access-control.d.ts
declare const testing: {
  resolveWhatsAppInboundPolicy: typeof resolveWhatsAppInboundPolicy;
};
//#endregion
//#region extensions/whatsapp/src/qa-driver.runtime.d.ts
type WhatsAppQaDriverObservedMessageKind = "media" | "location" | "poll" | "reaction" | "text" | "unknown";
type WhatsAppQaDriverQuotedMessage = {
  messageId?: string;
  participant?: string;
  text?: string;
};
type WhatsAppQaDriverObservedReaction = {
  emoji: string;
  fromMe?: boolean;
  messageId?: string;
  participant?: string;
};
type WhatsAppQaDriverObservedPoll = {
  options: string[];
  question?: string;
};
type WhatsAppQaDriverObservedMessage = {
  fromJid?: string;
  fromPhoneE164?: string | null;
  hasMedia?: boolean;
  kind: WhatsAppQaDriverObservedMessageKind;
  mediaFileName?: string;
  mediaType?: string;
  messageId?: string;
  observedAt: string;
  participantJid?: string;
  poll?: WhatsAppQaDriverObservedPoll;
  quoted?: WhatsAppQaDriverQuotedMessage;
  reaction?: WhatsAppQaDriverObservedReaction;
  text: string;
};
type WhatsAppQaDriverSendTextOptions = Pick<ActiveWebSendOptions, "quotedMessageKey">;
type WhatsAppQaDriverSendMediaOptions = Pick<ActiveWebSendOptions, "asDocument" | "fileName" | "gifPlayback" | "quotedMessageKey">;
type WhatsAppQaDriverSendReactionOptions = {
  fromMe: boolean;
  participant?: string;
};
type WhatsAppQaDriverSession = {
  close: () => Promise<void>;
  getObservedMessages: () => WhatsAppQaDriverObservedMessage[];
  sendContact: (to: string, contact: {
    displayName: string;
    vcard: string;
  }) => Promise<{
    messageId?: string;
  }>;
  sendLocation: (to: string, location: {
    address?: string;
    degreesLatitude: number;
    degreesLongitude: number;
    name?: string;
  }) => Promise<{
    messageId?: string;
  }>;
  sendMedia: (to: string, text: string, mediaBuffer: Buffer, mediaType: string, options?: WhatsAppQaDriverSendMediaOptions) => Promise<{
    messageId?: string;
  }>;
  sendPoll: (to: string, poll: {
    maxSelections?: number;
    options: string[];
    question: string;
  }) => Promise<{
    messageId?: string;
  }>;
  sendReaction: (chatJid: string, messageId: string, emoji: string, options: WhatsAppQaDriverSendReactionOptions) => Promise<{
    messageId?: string;
  }>;
  sendSticker: (to: string, stickerBuffer: Buffer, options?: {
    mimetype?: string;
  }) => Promise<{
    messageId?: string;
  }>;
  sendText: (to: string, text: string, options?: WhatsAppQaDriverSendTextOptions) => Promise<{
    messageId?: string;
  }>;
  waitForMessage: (params: {
    match: (message: WhatsAppQaDriverObservedMessage) => boolean;
    observedAfter?: Date;
    timeoutMs: number;
  }) => Promise<WhatsAppQaDriverObservedMessage>;
};
declare function startWhatsAppQaDriverSession(params: {
  authDir: string;
  connectionTimeoutMs?: number;
  waitForPendingNotifications?: boolean;
}): Promise<WhatsAppQaDriverSession>;
//#endregion
export { type ActiveWebListener, type ActiveWebSendOptions, DEFAULT_WEB_MEDIA_BYTES, DEFAULT_WHATSAPP_MEDIA_MAX_MB, type JidToE164Options, type LegacyFlatWebInboundMessage, type ResolvedWhatsAppAccount, WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS, type WebChannel, type WebChannelHealthState, type WebChannelStatus, type WebInboundCallbackMessage, type WebInboundMessage, type WebInboundMessageInput, type WebInboundMsg, type WebListenerCloseReason, type WebMonitorTuning, type WhatsAppInboundAdmission, type WhatsAppQaDriverObservedMessage, type WhatsAppQaDriverSession, type WhatsAppStructuredContactContext, assertWebChannel, hasAnyWhatsAppAuth, isSelfChatMode, isWhatsAppGroupJid, isWhatsAppUserTarget, jidToE164, listEnabledWhatsAppAccounts, listAccountIds as listWhatsAppAccountIds, listWhatsAppAuthDirs, listWhatsAppDirectoryGroupsFromConfig, listWhatsAppDirectoryPeersFromConfig, looksLikeWhatsAppTargetId, markdownToWhatsApp, normalizeE164, normalizeWhatsAppAllowFromEntries, normalizeWhatsAppMessagingTarget, normalizeWhatsAppTarget, resolveDefaultWhatsAppAccountId, resolveJidToE164, resolveUserPath, resolveWhatsAppAccount, resolveWhatsAppAuthDir, resolveWhatsAppGroupIntroHint, resolveWhatsAppGroupRequireMention, resolveWhatsAppGroupToolPolicy, resolveWhatsAppMediaMaxBytes, resolveWhatsAppOutboundTarget, startWhatsAppQaDriverSession, toWhatsappJid, toWhatsappJidWithLid, testing as whatsappAccessControlTesting, whatsappCommandPolicy, whatsappPlugin, whatsappSetupPlugin };