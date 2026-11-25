import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import { g as IdentityConfig, h as HumanDelayConfig } from "./types.base-BJujKINr.js";
/**
 * Shared channel diagnostic formatters exposed through the plugin SDK.
 * Keep messages compact and stable enough for plugin logs without making them machine contracts.
 */
type LogFn = (message: string) => void;
declare function logInboundDrop(params: {
  log: LogFn;
  channel: string;
  reason: string;
  target?: string;
  /** Deduplicate by channel, reason, and caller-owned account/conversation scope. */
  onceKey?: string;
  /** Actionable operator guidance; never include message bodies or sender details. */
  hint?: string;
}): void;
declare function logTypingFailure(params: {
  log: LogFn;
  channel: string;
  target?: string;
  action?: "start" | "stop";
  error: unknown;
}): void;
declare function logAckFailure(params: {
  log: LogFn;
  channel: string;
  target?: string;
  error: unknown;
}): void;
/** Resolve the configured identity block for one agent. */
declare function resolveAgentIdentity(cfg: OpenClawConfig, agentId: string): IdentityConfig | undefined;
/** Resolve the acknowledgement reaction using account, channel, global, then identity fallback. */
declare function resolveAckReaction(cfg: OpenClawConfig, agentId: string, opts?: {
  channel?: string;
  accountId?: string;
}): string;
/** Build the automatic `[name]` prefix for an agent identity. */
declare function resolveIdentityNamePrefix(cfg: OpenClawConfig, agentId: string): string | undefined;
/** Resolve message and response prefix values together for channel delivery. */
declare function resolveEffectiveMessagesConfig(cfg: OpenClawConfig, agentId: string, opts?: {
  hasAllowFrom?: boolean;
  fallbackMessagePrefix?: string;
  channel?: string;
  accountId?: string;
}): {
  messagePrefix: string;
  responsePrefix?: string;
};
/** Resolve per-agent human-delay settings over global agent defaults. */
declare function resolveHumanDelayConfig(cfg: OpenClawConfig, agentId: string): HumanDelayConfig | undefined;
type AckReactionScope = "all" | "direct" | "group-all" | "group-mentions" | "off" | "none";
type AckReactionHandle = {
  ackReactionPromise: Promise<boolean>;
  ackReactionValue: string;
  remove: () => Promise<void>;
};
/**
 * Inputs for the reusable direct/group/mention gate shared by channel plugins.
 *
 * `effectiveWasMentioned` should already include any channel-specific mention
 * normalization. `shouldBypassMention` is only for an earlier channel gate that
 * proved the active conversation, such as a group activation state.
 */
type AckReactionGateParams = {
  scope: AckReactionScope | undefined;
  inboundEventKind?: "user_request" | "room_event";
  isDirect: boolean;
  isGroup: boolean;
  isMentionableGroup: boolean;
  canDetectMention: boolean;
  effectiveWasMentioned: boolean;
  shouldBypassMention?: boolean;
};
declare function shouldAckReaction(params: AckReactionGateParams): boolean;
declare function createAckReactionHandle(params: {
  ackReactionValue: string;
  send: () => Promise<void>;
  remove: () => Promise<void>;
  onSendError?: (err: unknown) => void;
}): AckReactionHandle | null;
declare function removeAckReactionAfterReply(params: {
  removeAfterReply: boolean;
  ackReactionPromise: Promise<boolean> | null;
  ackReactionValue: string | null;
  remove: () => Promise<void>;
  onError?: (err: unknown) => void;
}): void;
declare function removeAckReactionHandleAfterReply(params: {
  removeAfterReply: boolean;
  ackReaction: AckReactionHandle | null | undefined;
  onError?: (err: unknown) => void;
}): void;
declare function missingTargetError(provider: string, hint?: string): Error;
type StatusReactionAdapter = {
  setReaction: (emoji: string) => Promise<void>;
  /** Clear all status reactions for single-slot platforms such as WhatsApp. */
  clearReaction?: () => Promise<void>;
  /** Remove a specific reaction emoji (optional — needed for Discord-style platforms). */
  removeReaction?: (emoji: string) => Promise<void>;
};
type StatusReactionEmojis = Partial<typeof DEFAULT_EMOJIS>;
type StatusReactionTiming = Partial<typeof DEFAULT_TIMING>;
type StatusReactionController = {
  setQueued: () => Promise<void> | void;
  setThinking: () => Promise<void> | void;
  setTool: (toolName?: string) => Promise<void> | void;
  setCompacting: () => Promise<void> | void;
  /** Cancel any pending debounced emoji (useful before forcing a state transition). */
  cancelPending: () => void;
  setDone: () => Promise<void>;
  setError: () => Promise<void>;
  clear: () => Promise<void>;
  restoreInitial: () => Promise<void>;
};
declare const DEFAULT_EMOJIS: {
  queued: string;
  thinking: string;
  tool: string;
  coding: string;
  web: string;
  deploy: string;
  build: string;
  concierge: string;
  done: string;
  error: string;
  stallSoft: string;
  stallHard: string;
  compacting: string;
};
declare const DEFAULT_TIMING: {
  debounceMs: number;
  stallSoftMs: number;
  stallHardMs: number;
  doneHoldMs: number;
  errorHoldMs: number;
};
declare const CODING_TOOL_TOKENS: string[];
declare const WEB_TOOL_TOKENS: string[];
declare const DEPLOY_TOOL_TOKENS: string[];
declare const BUILD_TOOL_TOKENS: string[];
declare const CONCIERGE_TOOL_TOKENS: string[];
declare function resolveToolEmoji(toolName: string | undefined, emojis: Required<StatusReactionEmojis>, emojiOverrides?: StatusReactionEmojis): string;
/** Defer reaction removal until cleanup to avoid flicker without atomic replacement. */
declare function createStatusReactionController(params: {
  enabled: boolean;
  adapter: StatusReactionAdapter;
  initialEmoji: string;
  /** Acknowledgement keeps one working reaction; only actual errors replace it. */
  presentation?: "activity" | "acknowledgement";
  emojis?: StatusReactionEmojis;
  timing?: StatusReactionTiming;
  onError?: (err: unknown) => void;
}): StatusReactionController;
/** @deprecated Owner policy moved into the WhatsApp plugin (#121257). */
type WhatsAppAckReactionMode = "always" | "mentions" | "never";
/**
 * @deprecated Load-only bridge: the published WhatsApp channel package
 * (2026.7.2-beta.7 and earlier) imports this at module top level, so removing
 * it makes the installed plugin fail to load after a core upgrade. Behavior
 * preserved verbatim from the pre-#121257 owner. Remove once managed releases
 * have replaced the old npm latest/extended-stable packages and their upgrade
 * window has closed.
 */
declare function shouldAckReactionForWhatsApp(params: {
  emoji: string;
  isDirect: boolean;
  isGroup: boolean;
  directEnabled: boolean;
  groupMode: WhatsAppAckReactionMode;
  wasMentioned: boolean;
  groupActivated: boolean;
}): boolean;
export { logAckFailure as A, shouldAckReaction as C, resolveHumanDelayConfig as D, resolveEffectiveMessagesConfig as E, logTypingFailure as M, resolveIdentityNamePrefix as O, removeAckReactionHandleAfterReply as S, resolveAgentIdentity as T, AckReactionGateParams as _, CONCIERGE_TOOL_TOKENS as a, createAckReactionHandle as b, DEPLOY_TOOL_TOKENS as c, StatusReactionEmojis as d, StatusReactionTiming as f, missingTargetError as g, resolveToolEmoji as h, CODING_TOOL_TOKENS as i, logInboundDrop as j, LogFn as k, StatusReactionAdapter as l, createStatusReactionController as m, shouldAckReactionForWhatsApp as n, DEFAULT_EMOJIS as o, WEB_TOOL_TOKENS as p, BUILD_TOOL_TOKENS as r, DEFAULT_TIMING as s, WhatsAppAckReactionMode as t, StatusReactionController as u, AckReactionHandle as v, resolveAckReaction as w, removeAckReactionAfterReply as x, AckReactionScope as y };