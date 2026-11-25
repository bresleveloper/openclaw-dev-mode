import { $p as buildTelegramRoutingTarget, $u as probeTelegram, Bh as TelegramTextEntity, Cj as ChannelStatusIssue, Fy as TelegramButtonStyle, Gh as hasBotMention, Hh as buildSenderName, Jp as TelegramReplyTarget, Kh as isBinaryContent, LA as ChannelOutboundAdapter, Ly as TelegramInlineButtons, Qf as sendLocationTelegram, Qp as buildTelegramParentPeer, Qu as TelegramProbeOptions, Uh as extractTelegramLocation, Vh as buildSenderLabel, Vy as ReplyPayload, Wh as getTelegramTextParts, Xn as parseTelegramTopicConversation, Xp as buildTelegramGroupFrom, Yn as ParsedTelegramTopicConversation, Yp as buildGroupLabel, Zf as sendMessageTelegram, Zp as buildTelegramGroupPeerId, Zu as TelegramProbe, _y as resolveTelegramAccountConfig, am as resolveTelegramForumThreadId, cm as withResolvedTelegramForumFlag, cy as TelegramPollActionGateState, dy as resolveDefaultTelegramAccountId, em as buildTelegramThreadParams, fj as ChannelGroupContext, fv as TelegramThreadSpec, fy as resolveTelegramAccount, gy as mergeTelegramAccountConfig, hy as listTelegramAccountIds, iA as ChannelPlugin, im as resolveTelegramForumFlag, lj as ChannelDirectoryEntry, lm as resolveTelegramPreviewStreamMode, lp as TelegramSendOpts, ly as createTelegramActionGate, my as resolveTelegramPollActionGateState, nm as describeReplyTarget, oj as ChannelAccountSnapshot, om as resolveTelegramGroupAllowFromContext, op as reactMessageTelegram, or as buildTelegramExecApprovalPendingPayload, oy as ResolvedTelegramAccount, py as resolveTelegramMediaRuntimeOptions, qh as normalizeForwardedContext, rm as extractTelegramForumFlag, sm as resolveTelegramThreadSpec, sr as shouldSuppressTelegramExecApprovalForwardingFallback, sy as TelegramMediaRuntimeOptions, tm as buildTypingThreadParams, um as StickerMetadata, uy as listEnabledTelegramAccounts, vy as TelegramTokenResolution, zh as TelegramForwardedContext } from "../../config-contracts-hzlacViZ.js";
import { $n as GroupToolPolicyConfig, Ht as TelegramNetworkConfig, Vt as TelegramInlineButtonsScope, Xt as ResolvedReactionLevel$1, Yt as ReactionLevel, r as OpenClawConfig, zt as TelegramExecApprovalConfig } from "../../types.openclaw-D8uW-XQA.js";
import { v as MarkdownTableMode } from "../../types.base-BJujKINr.js";
import { S as parseStrictInteger } from "../../string-normalization-WLO1L8BY.js";
import { b as ExecApprovalRequest, d as PluginApprovalRequest, o as SystemAgentApprovalRequest } from "../../approval-types-Bh5AmS0_.js";
import "../../reply-runtime-Yj9dU15I.js";
import "../../routing-BRs-dbBJ.js";
import { C as normalizeTelegramCommandName, S as normalizeTelegramCommandDescription, _ as parseModelCallbackData, a as buildTelegramModelsProviderChannelData, b as TelegramCustomCommandInput, c as ParsedModelCallback, d as buildBrowseProvidersButton, f as buildModelSelectionCallbackData, g as getModelsPageSize, h as calculateTotalPages, i as buildCommandsPaginationKeyboard, l as ProviderInfo, m as buildProviderKeyboard, n as TelegramInteractiveHandlerRegistration, o as ButtonRow, p as buildModelsKeyboard, r as TelegramInteractiveHandlerResult, s as ModelsKeyboardParams, t as TelegramInteractiveHandlerContext, u as ResolveModelSelectionResult, v as resolveModelSelection, w as resolveTelegramCustomCommands, x as TelegramCustomCommandIssue, y as TELEGRAM_COMMAND_NAME_PATTERN } from "../../interactive-dispatch-C4I-LXju.js";
import { h as DirectoryConfigParams } from "../../directory-config-helpers-RgY9hW-S.js";
import { Message as TelegramBotMessage, Update as TelegramBotUpdate } from "grammy/types";
export declare function parseTelegramReplyToMessageId(replyToId?: unknown): number | undefined;
export declare function parseTelegramThreadId(threadId?: string | number | null): number | undefined;
type TelegramTarget = {
  chatId: string;
  messageThreadId?: number;
  directMessagesTopicId?: number;
  chatType: "direct" | "group" | "unknown";
};
export declare function stripTelegramInternalPrefixes(to: string): string;
export declare function normalizeTelegramChatId(raw: string): string | undefined;
export declare function isNumericTelegramChatId(raw: string): boolean;
export declare function normalizeTelegramLookupTarget(raw: string): string | undefined;
/**
 * Supported delivery targets:
 * - `chatId` (plain chat ID, t.me link, @username, or internal prefixes like `telegram:...`)
 * - `chatId:topicId` (numeric topic/thread ID)
 * - `chatId:topic:topicId` (explicit topic marker; preferred)
 * - `chatId:direct-topic:topicId` (channel Direct Messages topic)
 */
export declare function parseTelegramTarget(to: string): TelegramTarget;
export declare function resolveTelegramTargetChatType(target: string): "direct" | "group" | "unknown";
export declare const telegramPlugin: ChannelPlugin<ResolvedTelegramAccount, TelegramProbe, unknown, 1>;
export declare const telegramSetupPlugin: ChannelPlugin<ResolvedTelegramAccount, TelegramProbe>;
type TelegramCredentialStatus = ResolvedTelegramAccount["tokenStatus"];
type TelegramAccountInspection = ResolvedTelegramAccount & {
  configured: boolean;
  stateReason?: string;
};
type InspectedTelegramAccount = TelegramAccountInspection & {
  mode: "webhook" | "polling";
  allowUnmentionedGroups: boolean;
};
declare function readTelegramAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  envToken?: string | null;
}): TelegramAccountInspection;
export declare function inspectTelegramAccount(params: Parameters<typeof readTelegramAccount>[0]): InspectedTelegramAccount;
export declare function resolveTelegramAutoThreadId(params: {
  to: string;
  toolContext?: {
    currentThreadTs?: string;
    currentChannelId?: string;
  };
}): string | undefined;
export declare function normalizeTelegramAllowFromEntry(raw: unknown): string;
export declare function isNumericTelegramUserId(raw: string): boolean;
export declare function isNumericTelegramSenderUserId(raw: string): boolean;
export declare function resolveTelegramChatLookupFetch(params?: {
  proxyUrl?: string;
  network?: TelegramNetworkConfig;
}): typeof fetch;
export declare function lookupTelegramChatId(params: {
  token: string;
  chatId: string;
  signal?: AbortSignal;
  apiRoot?: string;
  proxyUrl?: string;
  network?: TelegramNetworkConfig;
  timeoutSeconds?: unknown;
}): Promise<string | null>;
export declare function fetchTelegramChatId(params: {
  token: string;
  chatId: string;
  signal?: AbortSignal;
  apiRoot?: string;
  fetchImpl?: typeof fetch;
  timeoutSeconds?: unknown;
}): Promise<string | null>;
export declare function resolveTelegramDirectPeerId(params: {
  chatId: number | string;
  senderId?: number | string | null;
}): string;
export declare const listTelegramDirectoryPeersFromConfig: (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
export declare const listTelegramDirectoryGroupsFromConfig: (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
export declare function resolveTelegramExecApprovalConfig(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): TelegramExecApprovalConfig | undefined;
export declare function getTelegramExecApprovalApprovers(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): string[];
export declare function isTelegramExecApprovalTargetRecipient(params: {
  cfg: OpenClawConfig;
  senderId?: string | null;
  accountId?: string | null;
}): boolean;
export declare const isTelegramExecApprovalClientEnabled: (input: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}) => boolean;
export declare const isTelegramExecApprovalApprover: (input: {
  cfg: OpenClawConfig;
  accountId?: string | null;
} & {
  senderId?: string | null;
}) => boolean;
export declare const isTelegramExecApprovalAuthorizedSender: (input: {
  cfg: OpenClawConfig;
  accountId?: string | null;
} & {
  senderId?: string | null;
}) => boolean;
export declare const resolveTelegramExecApprovalTarget: (input: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}) => "both" | "channel" | "dm";
export declare const shouldHandleTelegramExecApprovalRequest: (input: {
  cfg: OpenClawConfig;
  accountId?: string | null;
} & {
  request: ExecApprovalRequest | PluginApprovalRequest | SystemAgentApprovalRequest;
}) => Promise<boolean>;
export declare function shouldInjectTelegramExecApprovalButtons(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  to: string;
}): boolean;
export declare const shouldSuppressLocalTelegramExecApprovalPrompt: (input: {
  cfg: OpenClawConfig;
  accountId?: string | null;
} & {
  payload: ReplyPayload;
}) => boolean;
export declare const isTelegramExecApprovalHandlerConfigured: (input: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}) => boolean;
export declare function resolveTelegramGroupRequireMention(params: ChannelGroupContext): boolean | undefined;
export declare function resolveTelegramGroupToolPolicy(params: ChannelGroupContext): GroupToolPolicyConfig | undefined;
export declare function resolveTelegramInlineButtonsConfigScope(capabilities: unknown): TelegramInlineButtonsScope | undefined;
export declare function resolveTelegramInlineButtonsScopeFromCapabilities(capabilities: unknown): TelegramInlineButtonsScope;
export declare function resolveTelegramInlineButtonsScope(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): TelegramInlineButtonsScope;
export declare function isTelegramInlineButtonsEnabled(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): boolean;
export declare function normalizeTelegramMessagingTarget(raw: string): string | undefined;
export declare function looksLikeTelegramTargetId(raw: string): boolean;
export declare const TELEGRAM_TEXT_CHUNK_LIMIT = 4000;
type TelegramSendFn = typeof sendMessageTelegram;
type TelegramReactionFn = typeof reactMessageTelegram;
type TelegramLocationFn = typeof sendLocationTelegram;
export declare function sendTelegramPayloadMessages(params: {
  send: TelegramSendFn;
  sendLocation: TelegramLocationFn;
  react: TelegramReactionFn;
  to: string;
  payload: ReplyPayload;
  baseOpts: Omit<NonNullable<TelegramSendOpts>, "buttons" | "mediaUrl" | "mediaUrls" | "quoteText">;
}): Promise<Awaited<ReturnType<TelegramSendFn>>>;
export declare const telegramOutbound: ChannelOutboundAdapter;
type TelegramReactionLevel = ReactionLevel;
type ResolvedReactionLevel = ResolvedReactionLevel$1;
export declare function resolveTelegramReactionLevel(params: {
  cfg: OpenClawConfig;
  accountId?: string;
}): ResolvedReactionLevel;
export declare function collectTelegramSecurityAuditFindings(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  account: ResolvedTelegramAccount;
}): Promise<{
  checkId: string;
  severity: "info" | "warn" | "critical";
  title: string;
  detail: string;
  remediation?: string;
}[]>;
interface CachedSticker {
  fileId: string;
  fileUniqueId: string;
  emoji?: string;
  setName?: string;
  description: string;
  cachedAt: string;
  receivedFrom?: string;
}
export declare function getCachedSticker(fileUniqueId: string): Promise<CachedSticker | null>;
export declare function cacheSticker(sticker: CachedSticker): Promise<void>;
export declare function searchStickers(query: string, limit?: number): Promise<CachedSticker[]>;
export declare function getAllCachedStickers(): Promise<CachedSticker[]>;
export declare function getCacheStats(): Promise<{
  count: number;
  oldestAt?: string;
  newestAt?: string;
}>;
interface DescribeStickerParams {
  imagePath: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  agentId?: string;
}
/**
 * Describe a sticker image using vision API.
 * Uses the shared image-model policy, then describes the sticker once.
 * Returns null if no model is selected or description fails.
 */
export declare function describeStickerImage(params: DescribeStickerParams): Promise<string | null>;
export declare function collectTelegramStatusIssues(accounts: ChannelAccountSnapshot[]): ChannelStatusIssue[];
type TelegramOffsetRotationReason = "bot-id-changed" | "token-rotated" | "legacy-state";
type TelegramUpdateOffsetRotationInfo = {
  reason: TelegramOffsetRotationReason;
  previousBotId: string | null;
  currentBotId: string;
  staleLastUpdateId: number;
};
export declare function readTelegramUpdateOffset(params: {
  accountId?: string;
  botToken?: string;
  env?: NodeJS.ProcessEnv;
  onRotationDetected?: (info: TelegramUpdateOffsetRotationInfo) => void | Promise<void>;
}): Promise<number | null>;
export declare function writeTelegramUpdateOffset(params: {
  accountId?: string;
  updateId: number;
  botToken?: string;
  env?: NodeJS.ProcessEnv;
}): Promise<void>;
export declare function deleteTelegramUpdateOffset(params: {
  accountId?: string;
  env?: NodeJS.ProcessEnv;
}): Promise<void>;
export declare function escapeTelegramHtml(text: string): string;
type TelegramFormattedChunk = {
  html: string;
  text: string;
};
export declare function markdownToTelegramHtml(markdown: string, options?: {
  tableMode?: MarkdownTableMode;
  wrapFileRefs?: boolean;
}): string;
export declare function splitTelegramHtmlChunks(html: string, limit: number): string[];
export declare function markdownToTelegramChunks(markdown: string, limit: number, options?: {
  tableMode?: MarkdownTableMode;
}): TelegramFormattedChunk[];
export declare function markdownToTelegramHtmlChunks(markdown: string, limit: number, options?: {
  tableMode?: MarkdownTableMode;
}): string[];
export { type ButtonRow, type CachedSticker, type DescribeStickerParams, type InspectedTelegramAccount, type ModelsKeyboardParams, type ParsedModelCallback, type ParsedTelegramTopicConversation, type ProviderInfo, type ResolveModelSelectionResult, type ResolvedReactionLevel, type ResolvedTelegramAccount, type StickerMetadata, TELEGRAM_COMMAND_NAME_PATTERN, type TelegramBotMessage, type TelegramBotUpdate, type TelegramButtonStyle, type TelegramCredentialStatus, type TelegramCustomCommandInput, type TelegramCustomCommandIssue, type TelegramFormattedChunk, type TelegramForwardedContext, type TelegramInlineButtons, type TelegramInteractiveHandlerContext, type TelegramInteractiveHandlerRegistration, type TelegramInteractiveHandlerResult, type TelegramMediaRuntimeOptions, type TelegramPollActionGateState, type TelegramProbe, type TelegramProbeOptions, type TelegramReactionLevel, type TelegramReplyTarget, type TelegramTarget, type TelegramTextEntity, type TelegramThreadSpec, type TelegramTokenResolution, buildBrowseProvidersButton, buildCommandsPaginationKeyboard, buildGroupLabel, buildModelSelectionCallbackData, buildModelsKeyboard, buildProviderKeyboard, buildSenderLabel, buildSenderName, buildTelegramExecApprovalPendingPayload, buildTelegramGroupFrom, buildTelegramGroupPeerId, buildTelegramModelsProviderChannelData, buildTelegramParentPeer, buildTelegramRoutingTarget, buildTelegramThreadParams, buildTypingThreadParams, calculateTotalPages, createTelegramActionGate, describeReplyTarget, extractTelegramForumFlag, extractTelegramLocation, getModelsPageSize, getTelegramTextParts, hasBotMention, isBinaryContent, listEnabledTelegramAccounts, listTelegramAccountIds, mergeTelegramAccountConfig, normalizeForwardedContext, normalizeTelegramCommandDescription, normalizeTelegramCommandName, parseStrictInteger as normalizeTelegramReplyToMessageId, parseStrictInteger as resolveTelegramReplyId, parseModelCallbackData, parseTelegramTopicConversation, probeTelegram, resolveDefaultTelegramAccountId, resolveModelSelection, resolveTelegramAccount, resolveTelegramAccountConfig, resolveTelegramCustomCommands, resolveTelegramForumFlag, resolveTelegramForumThreadId, resolveTelegramGroupAllowFromContext, resolveTelegramMediaRuntimeOptions, resolveTelegramPollActionGateState, resolveTelegramPreviewStreamMode as resolveTelegramStreamMode, resolveTelegramThreadSpec, shouldSuppressTelegramExecApprovalForwardingFallback, withResolvedTelegramForumFlag };