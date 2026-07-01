import { R as StreamingMode, T as ReplyToMode, _ as GroupPolicy, d as ContextVisibilityMode, h as DmPolicy, l as ChannelStreamingPreviewConfig, o as ChannelStreamingBlockConfig, u as ChannelStreamingProgressConfig, x as MarkdownConfig, z as TextChunkMode } from "./types.base-DmKdGokm.js";
import { d as SecretInput } from "./types.secrets-C15Z_eLX.js";
import { a as GroupToolPolicyBySenderConfig, o as GroupToolPolicyConfig } from "./types.tools-tYxTcHXF.js";

//#region src/config/types.queue.d.ts
/** Queue handling mode for inbound channel messages. */
type QueueMode = "steer" | "followup" | "collect" | "interrupt";
type QueueDropPolicy = "old" | "new" | "summarize";
type QueueModeByProvider = {
  whatsapp?: QueueMode;
  telegram?: QueueMode;
  discord?: QueueMode;
  irc?: QueueMode;
  googlechat?: QueueMode;
  slack?: QueueMode;
  mattermost?: QueueMode;
  signal?: QueueMode;
  imessage?: QueueMode;
  msteams?: QueueMode;
  webchat?: QueueMode;
  matrix?: QueueMode;
};
//#endregion
//#region src/config/types.tts.d.ts
type TtsProvider = string;
type TtsMode = "final" | "all";
type TtsAutoMode = "off" | "always" | "inbound" | "tagged";
type TtsModelOverrideConfig = {
  /** Enable model-provided overrides for TTS. */enabled?: boolean; /** Allow model-provided TTS text blocks. */
  allowText?: boolean; /** Allow model-provided provider override (default: false). */
  allowProvider?: boolean; /** Allow model-provided voice/voiceId override. */
  allowVoice?: boolean; /** Allow model-provided modelId override. */
  allowModelId?: boolean; /** Allow model-provided voice settings override. */
  allowVoiceSettings?: boolean; /** Allow model-provided normalization or language overrides. */
  allowNormalization?: boolean; /** Allow model-provided seed override. */
  allowSeed?: boolean;
};
type TtsProviderConfigMap = Record<string, Record<string, unknown>>;
type TtsPersonaFallbackPolicy = "preserve-persona" | "provider-defaults" | "fail";
type TtsPersonaPromptConfig = {
  profile?: string;
  scene?: string;
  sampleContext?: string;
  style?: string;
  accent?: string;
  pacing?: string;
  constraints?: string[];
};
type TtsPersonaConfig = {
  label?: string;
  description?: string; /** Preferred provider for this persona. Explicit provider prefs still win. */
  provider?: TtsProvider;
  fallbackPolicy?: TtsPersonaFallbackPolicy;
  prompt?: TtsPersonaPromptConfig; /** Provider-specific persona bindings keyed by speech provider id. */
  providers?: TtsProviderConfigMap;
};
type ResolvedTtsPersona = TtsPersonaConfig & {
  id: string;
};
type TtsConfig = {
  /** Auto-TTS mode (preferred). */auto?: TtsAutoMode; /** @deprecated Use auto. */
  enabled?: boolean; /** Apply TTS to final replies only or to all replies (tool/block/final). */
  mode?: TtsMode; /** Primary TTS provider (fallbacks are automatic). */
  provider?: TtsProvider; /** Active TTS persona id. */
  persona?: string; /** Named TTS personas. */
  personas?: Record<string, TtsPersonaConfig>; /** Optional model override for TTS auto-summary (provider/model or alias). */
  summaryModel?: string; /** Allow the model to override TTS parameters. */
  modelOverrides?: TtsModelOverrideConfig; /** Provider-specific TTS settings keyed by speech provider id. */
  providers?: TtsProviderConfigMap; /** Optional path for local TTS user preferences JSON. */
  prefsPath?: string; /** Hard cap for text sent to TTS (chars). */
  maxTextLength?: number; /** API request timeout (ms). */
  timeoutMs?: number;
};
//#endregion
//#region src/config/types.messages.d.ts
type MentionPatternsMode = "allow" | "deny";
type MentionPatternsPolicyConfig = {
  mode?: MentionPatternsMode;
  allowIn?: string[];
  denyIn?: string[];
};
type GroupChatConfig = {
  mentionPatterns?: string[];
  historyLimit?: number;
  /**
   * Controls how unmentioned always-on group chatter is submitted.
   * Default: "user_request".
   */
  unmentionedInbound?: "user_request" | "room_event";
  /**
   * Controls how group/channel inbound events produce visible room replies. The
   * message-tool mode requires explicit message sends for visible room output;
   * final text stays private when the model misses the tool.
   * Default: "automatic".
   */
  visibleReplies?: "automatic" | "message_tool";
};
type DmConfig = {
  historyLimit?: number;
};
type QueueConfig = {
  mode?: QueueMode;
  byChannel?: QueueModeByProvider;
  debounceMs?: number; /** Per-channel debounce overrides (ms). */
  debounceMsByChannel?: InboundDebounceByProvider;
  cap?: number;
  drop?: QueueDropPolicy;
};
type InboundDebounceByProvider = Record<string, number>;
type InboundDebounceConfig = {
  debounceMs?: number;
  byChannel?: InboundDebounceByProvider;
};
type BroadcastStrategy = "parallel" | "sequential";
type BroadcastConfig = {
  /** Default processing strategy for broadcast peers. */strategy?: BroadcastStrategy;
  /**
   * Map peer IDs to arrays of agent IDs that should ALL process messages.
   *
   * Note: the index signature includes `undefined` so `strategy?: ...` remains type-safe.
   */
  [peerId: string]: string[] | BroadcastStrategy | undefined;
};
type AudioConfig = {
  /** @deprecated Use tools.media.audio.models instead. */transcription?: {
    command: string[];
    timeoutSeconds?: number;
  };
};
type StatusReactionsEmojiConfig = {
  thinking?: string;
  tool?: string;
  coding?: string;
  web?: string;
  deploy?: string;
  build?: string;
  concierge?: string;
  done?: string;
  error?: string;
  stallSoft?: string;
  stallHard?: string;
  compacting?: string;
};
type StatusReactionsTimingConfig = {
  /** Debounce interval for intermediate states (ms). Default: 700. */debounceMs?: number; /** Soft stall warning timeout (ms). Default: 10000. */
  stallSoftMs?: number; /** Hard stall warning timeout (ms). Default: 30000. */
  stallHardMs?: number; /** How long to hold done emoji before cleanup (ms). Default: 1500. */
  doneHoldMs?: number; /** How long to hold error emoji before cleanup (ms). Default: 2500. */
  errorHoldMs?: number;
};
type StatusReactionsConfig = {
  /** Enable lifecycle status reactions (default: false). */enabled?: boolean; /** Override default emojis. */
  emojis?: StatusReactionsEmojiConfig; /** Override default timing. */
  timing?: StatusReactionsTimingConfig;
};
type MessagesConfig = {
  /** @deprecated Use `whatsapp.messagePrefix` (WhatsApp-only inbound prefix). */messagePrefix?: string;
  /**
   * Controls how source inbound events produce visible replies across direct,
   * group, and channel conversations. Group/channel events still default to
   * `groupChat.visibleReplies` when it is set.
   *
   * Default: "automatic". In group/channel rooms, "message_tool" keeps final
   * text private unless the model sends visibly through the message tool.
   */
  visibleReplies?: "automatic" | "message_tool";
  /**
   * Prefix auto-added to all outbound replies.
   *
   * - string: explicit prefix (may include template variables)
   * - special value: `"auto"` derives `[{agents.list[].identity.name}]` for the routed agent (when set)
   *
   * Supported template variables (case-insensitive):
   * - `{model}` - short model name (e.g., `claude-opus-4-6`, `gpt-4o`)
   * - `{modelFull}` - full model identifier (e.g., `anthropic/claude-opus-4-6`)
   * - `{provider}` - provider name (e.g., `anthropic`, `openai`)
   * - `{thinkingLevel}` or `{think}` - current thinking level (`high`, `low`, `off`)
   * - `{identity.name}` or `{identityName}` - agent identity name
   *
   * Example: `"[{model} | think:{thinkingLevel}]"` → `"[claude-opus-4-6 | think:high]"`
   *
   * Unresolved variables remain as literal text (e.g., `{model}` if context unavailable).
   *
   * Default: none
   */
  responsePrefix?: string; /** Custom `/usage full` footer template, inline or JSON file path. */
  usageTemplate?: string | Record<string, unknown>;
  groupChat?: GroupChatConfig;
  queue?: QueueConfig; /** Debounce rapid inbound messages per sender (global + per-channel overrides). */
  inbound?: InboundDebounceConfig; /** Emoji reaction used to acknowledge inbound messages (empty disables). */
  ackReaction?: string; /** When to send ack reactions. Default: "group-mentions". */
  ackReactionScope?: "group-mentions" | "group-all" | "direct" | "all" | "off" | "none"; /** Remove ack reaction after reply is sent (default: false). */
  removeAckAfterReply?: boolean; /** Lifecycle status reactions configuration. */
  statusReactions?: StatusReactionsConfig; /** When true, suppress ⚠️ tool-error warnings from being shown to the user. Default: false. */
  suppressToolErrors?: boolean; /** Text-to-speech settings for outbound replies. */
  tts?: TtsConfig;
};
type NativeCommandsSetting = boolean | "auto";
type CommandOwnerDisplay = "raw" | "hash";
/**
 * Per-provider allowlist for command authorization.
 * Keys are channel IDs (e.g., "discord", "whatsapp") or "*" for global default.
 * Values are arrays of sender IDs allowed to use commands on that channel.
 */
type CommandAllowFrom = Record<string, Array<string | number>>;
type CommandsConfig = {
  /** Enable native command registration when supported (default: "auto"). */native?: NativeCommandsSetting; /** Enable native skill command registration when supported (default: "auto"). */
  nativeSkills?: NativeCommandsSetting; /** Enable text command parsing (default: true). */
  text?: boolean; /** Allow bash chat command (`!`; `/bash` alias) (default: false). */
  bash?: boolean; /** How long bash waits before backgrounding (default: 2000; 0 backgrounds immediately). */
  bashForegroundMs?: number; /** Allow /config command (default: false). */
  config?: boolean; /** Allow /mcp command for OpenClaw-managed MCP settings (default: false). */
  mcp?: boolean; /** Allow /plugins command for plugin listing and enablement toggles (default: false). */
  plugins?: boolean; /** Allow /debug command (default: false). */
  debug?: boolean; /** Allow restart commands/tools (default: true). */
  restart?: boolean; /** Enforce access-group allowlists/policies for commands (default: true). */
  useAccessGroups?: boolean; /** Explicit owner allowlist for owner-scoped commands (channel-native IDs). */
  ownerAllowFrom?: Array<string | number>; /** How owner IDs are rendered in system prompts. */
  ownerDisplay?: CommandOwnerDisplay; /** Secret used to key owner ID hashes when ownerDisplay is "hash". */
  ownerDisplaySecret?: string;
  /**
   * Per-provider allowlist restricting who can use slash commands.
   * If set, overrides the channel's allowFrom for command authorization.
   * Use "*" key for global default, provider-specific keys override the global.
   * Example: { "*": ["user1"], discord: ["user:123"] }
   */
  allowFrom?: CommandAllowFrom;
};
type ProviderCommandsConfig = {
  /** Override native command registration for this provider (bool or "auto"). */native?: NativeCommandsSetting; /** Override native skill command registration for this provider (bool or "auto"). */
  nativeSkills?: NativeCommandsSetting;
};
//#endregion
//#region src/config/types.approvals.d.ts
type NativeExecApprovalEnableMode = boolean | "auto";
type ExecApprovalForwardingMode = "session" | "targets" | "both";
type ExecApprovalForwardTarget = {
  /** Channel id (e.g. "discord", "slack", or plugin channel id). */channel: string; /** Destination id (channel id, user id, etc. depending on channel). */
  to: string; /** Optional account id for multi-account channels. */
  accountId?: string; /** Optional thread id to reply inside a thread. */
  threadId?: string | number;
};
type ExecApprovalForwardingConfig = {
  /** Enable forwarding exec approvals to chat channels. Default: false. */enabled?: boolean; /** Delivery mode (session=origin chat, targets=config targets, both=both). Default: session. */
  mode?: ExecApprovalForwardingMode; /** Only forward approvals for these agent IDs. Omit = all agents. */
  agentFilter?: string[]; /** Only forward approvals matching these session key patterns (substring or regex). */
  sessionFilter?: string[]; /** Explicit delivery targets (used when mode includes targets). */
  targets?: ExecApprovalForwardTarget[];
};
type ApprovalsConfig = {
  exec?: ExecApprovalForwardingConfig;
  plugin?: ExecApprovalForwardingConfig;
};
//#endregion
//#region src/config/types.bot-loop-protection.d.ts
type ChannelBotLoopProtectionConfig = {
  /** Enable pair loop protection for channels that support it. */enabled?: boolean; /** Maximum events a sender/receiver pair may exchange within the window. */
  maxEventsPerWindow?: number; /** Sliding window length in seconds. */
  windowSeconds?: number; /** Cooldown seconds applied to a pair after the limit is hit. */
  cooldownSeconds?: number;
};
//#endregion
//#region src/config/types.channel-health.d.ts
type ChannelHeartbeatVisibilityConfig = {
  /** Show HEARTBEAT_OK acknowledgments in chat (default: false). */showOk?: boolean; /** Show heartbeat alerts with actual content (default: true). */
  showAlerts?: boolean; /** Emit indicator events for UI status display (default: true). */
  useIndicator?: boolean;
};
type ChannelHealthMonitorConfig = {
  /**
   * Enable channel-health-monitor restarts for this channel or account.
   * Inherits the global gateway setting when omitted.
   */
  enabled?: boolean;
};
//#endregion
//#region src/config/types.slack.d.ts
type SlackDmConfig = {
  /** If false, ignore all incoming Slack DMs. Default: true. */enabled?: boolean; /** Direct message access policy (default: pairing). */
  policy?: DmPolicy; /** Allowlist for DM senders (ids). */
  allowFrom?: Array<string | number>; /** If true, allow group DMs (default: false). */
  groupEnabled?: boolean; /** Optional allowlist for group DM channels (ids or slugs). */
  groupChannels?: Array<string | number>; /** @deprecated Prefer channels.slack.replyToModeByChatType.direct. */
  replyToMode?: ReplyToMode;
};
type SlackChannelConfig = {
  /** If false, disable the bot in this channel. */enabled?: boolean; /** Require mentioning the bot to trigger replies. */
  requireMention?: boolean; /** Optional tool policy overrides for this channel. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig; /** Allow bot-authored messages to trigger replies (default: false). Set to "mentions" to only allow bot messages that @mention this bot. */
  allowBots?: boolean | "mentions"; /** Sliding-window bot-pair loop guard for accepted bot-authored Slack messages. */
  botLoopProtection?: ChannelBotLoopProtectionConfig; /** Allowlist of users that can invoke the bot in this channel. */
  users?: Array<string | number>; /** Optional skill filter for this channel. */
  skills?: string[]; /** Optional system prompt for this channel. */
  systemPrompt?: string;
};
type SlackReactionNotificationMode = "off" | "own" | "all" | "allowlist";
type SlackStreamingMode = "off" | "partial" | "block" | "progress";
type SlackStreamingProgressConfig = ChannelStreamingProgressConfig & {
  /** Opt in to Slack-native task cards for progress mode. Default: false. */nativeTaskCards?: boolean;
};
type SlackChannelStreamingConfig = {
  mode?: StreamingMode;
  chunkMode?: TextChunkMode;
  nativeTransport?: boolean;
  preview?: ChannelStreamingPreviewConfig;
  progress?: SlackStreamingProgressConfig;
  block?: ChannelStreamingBlockConfig;
};
type SlackExecApprovalTarget = "dm" | "channel" | "both";
type SlackExecApprovalConfig = {
  /** Enable mode for Slack exec approvals on this account. Default: auto when approvers can be resolved; false disables. */enabled?: NativeExecApprovalEnableMode; /** Slack user IDs allowed to approve exec requests. Optional: falls back to commands.ownerAllowFrom when possible. */
  approvers?: Array<string | number>; /** Only forward approvals for these agent IDs. Omit = all agents. */
  agentFilter?: string[]; /** Only forward approvals matching these session key patterns (substring or regex). */
  sessionFilter?: string[]; /** Where to send approval prompts. Default: "dm". */
  target?: SlackExecApprovalTarget;
};
type SlackCapabilitiesConfig = string[] | {
  interactiveReplies?: boolean;
};
type SlackActionConfig = {
  reactions?: boolean;
  messages?: boolean;
  pins?: boolean;
  search?: boolean;
  permissions?: boolean;
  memberInfo?: boolean;
  channelInfo?: boolean;
  emojiList?: boolean;
};
type SlackSlashCommandConfig = {
  /** Enable handling for the configured slash command (default: false). */enabled?: boolean; /** Slash command name (default: "openclaw"). */
  name?: string; /** Session key prefix for slash commands (default: "slack:slash"). */
  sessionPrefix?: string; /** Reply ephemerally (default: true). */
  ephemeral?: boolean;
};
type SlackThreadConfig = {
  /** Scope for thread history context (thread|channel). Default: thread. */historyScope?: "thread" | "channel"; /** If true, thread sessions inherit the parent channel transcript. Default: false. */
  inheritParent?: boolean; /** Maximum number of thread messages to fetch as context when starting a new thread session (default: 20). Set to 0 to disable thread history fetching. */
  initialHistoryLimit?: number;
  /**
   * If true, require explicit @mention even inside threads where the bot has
   * previously participated. By default (false), replying in a thread where
   * the bot is a participant counts as an implicit mention and bypasses
   * requireMention gating. Set to true to suppress implicit thread mentions
   * so only explicit @bot mentions trigger replies in threads.
   */
  requireExplicitMention?: boolean;
};
type SlackSocketModeConfig = {
  /** Slack SDK pong timeout in milliseconds. Socket Mode only. Default: 15000. */clientPingTimeout?: number; /** Slack SDK server ping timeout in milliseconds. Socket Mode only. */
  serverPingTimeout?: number; /** Enable Slack SDK ping/pong transport logging. Socket Mode only. */
  pingPongLoggingEnabled?: boolean;
};
type SlackRelayConfig = {
  /** Full relay websocket URL, including the route path. */url?: string; /** Bearer token used to authenticate the gateway websocket to the Slack relay. */
  authToken?: SecretInput; /** Gateway destination id registered with openclaw-slack-router. */
  gatewayId?: string;
};
type SlackAccountConfig = {
  /** Optional display name for this account (used in CLI/UI lists). */name?: string; /** Slack connection mode (socket|http|relay). Default: socket. */
  mode?: "socket" | "http" | "relay"; /** Slack SDK Socket Mode transport options. Ignored in HTTP mode. */
  socketMode?: SlackSocketModeConfig; /** Relay-delivered Slack event source. Used when mode is "relay". */
  relay?: SlackRelayConfig; /** Slack signing secret (required for HTTP mode). */
  signingSecret?: SecretInput; /** Slack Events API webhook path (default: /slack/events). */
  webhookPath?: string; /** Optional provider capability tags used for agent/runtime guidance. */
  capabilities?: SlackCapabilitiesConfig; /** Slack-native exec approval delivery + approver authorization. */
  execApprovals?: SlackExecApprovalConfig; /** Markdown formatting overrides (tables). */
  markdown?: MarkdownConfig; /** Override native command registration for Slack (bool or "auto"). */
  commands?: ProviderCommandsConfig; /** Allow channel-initiated config writes (default: true). */
  configWrites?: boolean; /** If false, do not start this Slack account. Default: true. */
  enabled?: boolean;
  botToken?: SecretInput;
  appToken?: SecretInput;
  userToken?: SecretInput; /** If true, restrict user token to read operations only. Default: true. */
  userTokenReadOnly?: boolean; /** Allow bot-authored messages to trigger replies (default: false). Set to "mentions" to only allow bot messages that @mention this bot. */
  allowBots?: boolean | "mentions"; /** Sliding-window bot-pair loop guard for accepted bot-authored Slack messages. */
  botLoopProtection?: ChannelBotLoopProtectionConfig;
  /**
   * Break-glass override: allow mutable identity matching (name/slug) in allowlists.
   * Default behavior is ID-only matching.
   */
  dangerouslyAllowNameMatching?: boolean; /** Default mention requirement for channel messages (default: true). */
  requireMention?: boolean;
  /**
   * Controls how channel messages are handled:
   * - "open": channels bypass allowlists; mention-gating applies
   * - "disabled": block all channel messages
   * - "allowlist": only allow channels present in channels.slack.channels
   */
  groupPolicy?: GroupPolicy; /** Scope configured groupChat mentionPatterns to selected Slack channel IDs. */
  mentionPatterns?: MentionPatternsPolicyConfig; /** Supplemental context visibility policy (all|allowlist|allowlist_quote). */
  contextVisibility?: ContextVisibilityMode; /** Max channel messages to keep as history context (0 disables). */
  historyLimit?: number; /** Max DM turns to keep as history context. */
  dmHistoryLimit?: number; /** Per-DM config overrides keyed by user ID. */
  dms?: Record<string, DmConfig>;
  textChunkLimit?: number; /** Pass through Slack chat.postMessage link unfurl control. Default: false. */
  unfurlLinks?: boolean; /** Pass through Slack chat.postMessage media unfurl control. Omitted by default. */
  unfurlMedia?: boolean; /** Streaming + chunking settings. Prefer this nested shape over legacy flat keys. */
  streaming?: SlackChannelStreamingConfig;
  mediaMaxMb?: number; /** Reaction notification mode (off|own|all|allowlist). Default: own. */
  reactionNotifications?: SlackReactionNotificationMode; /** Allowlist for reaction notifications when mode is allowlist. */
  reactionAllowlist?: Array<string | number>; /** Control reply threading when reply tags are present (off|first|all|batched). */
  replyToMode?: ReplyToMode;
  /**
   * Optional per-chat-type reply threading overrides.
   * Example: { direct: "all", group: "first", channel: "off" }.
   */
  replyToModeByChatType?: Partial<Record<"direct" | "group" | "channel", ReplyToMode>>; /** Thread session behavior. */
  thread?: SlackThreadConfig;
  actions?: SlackActionConfig;
  slashCommand?: SlackSlashCommandConfig;
  /**
   * Canonical DM policy key. Doctor migrates legacy channels.slack.dm.policy here.
   * Legacy key: channels.slack.dm.policy.
   */
  dmPolicy?: DmPolicy;
  /**
   * Canonical DM allowlist. Doctor migrates legacy channels.slack.dm.allowFrom here.
   * Legacy key: channels.slack.dm.allowFrom.
   */
  allowFrom?: Array<string | number>; /** Default delivery target for CLI --deliver when no explicit --reply-to is provided. */
  defaultTo?: string;
  dm?: SlackDmConfig;
  channels?: Record<string, SlackChannelConfig>; /** Heartbeat visibility settings for this channel. */
  heartbeat?: ChannelHeartbeatVisibilityConfig; /** Channel health monitor overrides for this channel/account. */
  healthMonitor?: ChannelHealthMonitorConfig; /** Outbound response prefix override for this channel/account. */
  responsePrefix?: string;
  /**
   * Per-channel ack reaction override.
   * Slack uses shortcodes (e.g., "eyes") rather than unicode emoji.
   */
  ackReaction?: string; /** Reaction emoji added while processing a reply (e.g. "hourglass_flowing_sand"). Removed when done. Useful as a typing indicator fallback when assistant mode is not enabled. */
  typingReaction?: string;
};
type SlackConfig = {
  /** Optional per-account Slack configuration (multi-account). */accounts?: Record<string, SlackAccountConfig>; /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & SlackAccountConfig;
//#endregion
export { TtsProviderConfigMap as $, CommandsConfig as A, QueueConfig as B, ExecApprovalForwardingMode as C, BroadcastStrategy as D, BroadcastConfig as E, MentionPatternsMode as F, TtsAutoMode as G, StatusReactionsEmojiConfig as H, MentionPatternsPolicyConfig as I, TtsModelOverrideConfig as J, TtsConfig as K, MessagesConfig as L, GroupChatConfig as M, InboundDebounceByProvider as N, CommandAllowFrom as O, InboundDebounceConfig as P, TtsProvider as Q, NativeCommandsSetting as R, ExecApprovalForwardingConfig as S, AudioConfig as T, StatusReactionsTimingConfig as U, StatusReactionsConfig as V, ResolvedTtsPersona as W, TtsPersonaFallbackPolicy as X, TtsPersonaConfig as Y, TtsPersonaPromptConfig as Z, ChannelHealthMonitorConfig as _, SlackChannelStreamingConfig as a, ApprovalsConfig as b, SlackExecApprovalConfig as c, SlackRelayConfig as d, QueueDropPolicy as et, SlackSlashCommandConfig as f, SlackThreadConfig as g, SlackStreamingProgressConfig as h, SlackChannelConfig as i, DmConfig as j, CommandOwnerDisplay as k, SlackExecApprovalTarget as l, SlackStreamingMode as m, SlackActionConfig as n, QueueModeByProvider as nt, SlackConfig as o, SlackSocketModeConfig as p, TtsMode as q, SlackCapabilitiesConfig as r, SlackDmConfig as s, SlackAccountConfig as t, QueueMode as tt, SlackReactionNotificationMode as u, ChannelHeartbeatVisibilityConfig as v, NativeExecApprovalEnableMode as w, ExecApprovalForwardTarget as x, ChannelBotLoopProtectionConfig as y, ProviderCommandsConfig as z };