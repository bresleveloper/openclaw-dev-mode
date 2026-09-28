import { Static, Type } from "typebox";
import { z } from "zod";
import "json5";
import "@openclaw/fs-safe/config";
import "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/secret";
import "kysely";
import "execa";
//#endregion
//#region packages/llm-core/src/model-data.d.ts
declare const MODEL_DATA_THINKING_FORMATS: readonly ["openai", "openrouter", "deepseek", "together", "qwen", "qwen-chat-template", "zai"];
type ModelDataThinkingFormat = (typeof MODEL_DATA_THINKING_FORMATS)[number];
type ModelDataImageInputConfig = {
  /** Provider-documented maximum encoded image payload size. */
  maxBytes?: number;
  /** Provider-documented maximum accepted input pixels. */
  maxPixels?: number;
  /** Provider-documented maximum accepted width/height in pixels. */
  maxSidePx?: number;
  /** Preferred resize side for the default balanced compression policy. */
  preferredSidePx?: number;
  /** Token accounting style, used as documentation for provider-owned policy. */
  tokenMode?: "tile" | "detail" | "provider";
};
type ModelDataMediaInputConfig = {
  /** Image input limits and accounting hints for this model. */
  image?: ModelDataImageInputConfig;
};
/** Per-million-token rates for separately billed token buckets. */
type ModelDataCostRates = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
type ModelDataRawPricingTier = ModelDataCostRates & {
  /** Half-open prompt-token interval; `[start]` is an open-ended upper tier. */
  range: [number, number] | [number];
};
type ModelRoutingSortConfig = {
  /** The sorting metric: "price", "throughput", "latency". */
  by?: string;
  /** Partitioning strategy: "model" (default) or "none". */
  partition?: string | null;
};
type ModelRoutingMaxPrice = {
  /** Price per million prompt tokens. */
  prompt?: number | string;
  /** Price per million completion tokens. */
  completion?: number | string;
  /** Price per image. */
  image?: number | string;
  /** Price per audio unit. */
  audio?: number | string;
  /** Price per request. */
  request?: number | string;
};
/** Percentile targets in the owning field's throughput or latency units. */
type ModelRoutingPercentiles = {
  p50?: number;
  p75?: number;
  p90?: number;
  p99?: number;
};
//#endregion
//#region src/shared/silent-reply-policy.d.ts
type SilentReplyPolicy = "allow" | "disallow";
type SilentReplyConversationType = "direct" | "group" | "internal";
type SilentReplyPolicyShape = Partial<Record<Exclude<SilentReplyConversationType, "direct">, SilentReplyPolicy>>;
//#endregion
//#region src/transcripts/config.d.ts
/**
 * Configuration normalization for transcript capture/import.
 *
 * Raw config can contain optional auto-start provider locators; resolution
 * returns bounded defaults and drops malformed entries before runtime startup.
 */
/** Raw auto-start transcript source entry from config. */
type TranscriptsAutoStartConfig = {
  providerId: string;
  whenOccupied?: boolean;
  sessionId?: string;
  title?: string;
  accountId?: string;
  guildId?: string;
  channelId?: string;
  meetingUrl?: string;
};
/** Raw transcripts config block. */
type TranscriptsConfig = {
  enabled?: boolean;
  autoStart?: TranscriptsAutoStartConfig[];
};
//#endregion
//#region src/config/zod-schema.root-support.d.ts
declare const AccessGroupsSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
  type: z.ZodLiteral<"discord.channelAudience">;
  guildId: z.ZodString;
  channelId: z.ZodString;
  membership: z.ZodOptional<z.ZodLiteral<"canViewChannel">>;
}, z.core.$strict>, z.ZodObject<{
  type: z.ZodLiteral<"message.senders">;
  members: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>;
}, z.core.$strict>], "type">>>;
declare const TalkSchema: z.ZodObject<{
  agentId: z.ZodOptional<z.ZodString>;
  provider: z.ZodOptional<z.ZodString>;
  providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
  }, z.core.$catchall<z.ZodUnknown>>>>;
  realtime: z.ZodOptional<z.ZodObject<{
    provider: z.ZodOptional<z.ZodString>;
    providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
    }, z.core.$catchall<z.ZodUnknown>>>>;
    model: z.ZodOptional<z.ZodString>;
    speakerVoice: z.ZodOptional<z.ZodString>;
    speakerVoiceId: z.ZodOptional<z.ZodString>;
    instructions: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodEnum<{
      realtime: "realtime";
      "stt-tts": "stt-tts";
      transcription: "transcription";
    }>>;
    transport: z.ZodOptional<z.ZodEnum<{
      "gateway-relay": "gateway-relay";
      "managed-room": "managed-room";
      "provider-websocket": "provider-websocket";
      webrtc: "webrtc";
    }>>;
    vadThreshold: z.ZodOptional<z.ZodNumber>;
    silenceDurationMs: z.ZodOptional<z.ZodNumber>;
    prefixPaddingMs: z.ZodOptional<z.ZodNumber>;
    reasoningEffort: z.ZodOptional<z.ZodString>;
    brain: z.ZodOptional<z.ZodEnum<{
      "agent-consult": "agent-consult";
      "direct-tools": "direct-tools";
      none: "none";
    }>>;
    consultRouting: z.ZodOptional<z.ZodEnum<{
      "force-agent-consult": "force-agent-consult";
      "provider-direct": "provider-direct";
    }>>;
  }, z.core.$strict>>;
  consultThinkingLevel: z.ZodOptional<z.ZodEnum<{
    adaptive: "adaptive";
    high: "high";
    low: "low";
    max: "max";
    medium: "medium";
    minimal: "minimal";
    off: "off";
    ultra: "ultra";
    xhigh: "xhigh";
  }>>;
  consultFastMode: z.ZodOptional<z.ZodBoolean>;
  speechLocale: z.ZodOptional<z.ZodString>;
  interruptOnSpeech: z.ZodOptional<z.ZodBoolean>;
  silenceTimeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
declare const McpConfigSchema: z.ZodOptional<z.ZodObject<{
  sessionIdleTtlMs: z.ZodOptional<z.ZodNumber>;
  servers: z.ZodOptional<z.ZodPreprocess<z.ZodRecord<z.ZodType<string, unknown, z.core.$ZodTypeInternals<string, unknown>>, z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    command: z.ZodOptional<z.ZodString>;
    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
    cwd: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    transport: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"stdio">, z.ZodLiteral<"sse">, z.ZodLiteral<"streamable-http">]>>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
    connectionTimeoutMs: z.ZodOptional<z.ZodNumber>;
    requestTimeoutMs: z.ZodOptional<z.ZodNumber>;
    supportsParallelToolCalls: z.ZodOptional<z.ZodBoolean>;
    auth: z.ZodOptional<z.ZodLiteral<"oauth">>;
    oauth: z.ZodOptional<z.ZodObject<{
      identity: z.ZodOptional<z.ZodEnum<{
        "per-requester": "per-requester";
        shared: "shared";
      }>>;
      authProfileId: z.ZodOptional<z.ZodString>;
      scope: z.ZodOptional<z.ZodString>;
      redirectUrl: z.ZodOptional<z.ZodString>;
      clientMetadataUrl: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    sslVerify: z.ZodOptional<z.ZodBoolean>;
    clientCert: z.ZodOptional<z.ZodString>;
    clientKey: z.ZodOptional<z.ZodString>;
    toolFilter: z.ZodOptional<z.ZodObject<{
      include: z.ZodOptional<z.ZodArray<z.ZodString>>;
      exclude: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    codex: z.ZodOptional<z.ZodObject<{
      agents: z.ZodOptional<z.ZodArray<z.ZodString>>;
      defaultToolsApprovalMode: z.ZodOptional<z.ZodEnum<{
        approve: "approve";
        auto: "auto";
        prompt: "prompt";
      }>>;
    }, z.core.$strict>>;
  }, z.core.$catchall<z.ZodUnknown>>>, unknown>>;
  apps: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    sandboxOrigin: z.ZodOptional<z.ZodString>;
    sandboxPort: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
declare const NodeHostSchema: z.ZodOptional<z.ZodObject<{
  autoUpdate: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  agentRuns: z.ZodOptional<z.ZodObject<{
    claude: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  workerRuns: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    capacity: z.ZodOptional<z.ZodNumber>;
    isolation: z.ZodOptional<z.ZodEnum<{
      container: "container";
      none: "none";
    }>>;
    containerImage: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  browserProxy: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowProfiles: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  mcp: z.ZodOptional<z.ZodObject<{
    servers: z.ZodOptional<z.ZodPreprocess<z.ZodRecord<z.ZodType<string, unknown, z.core.$ZodTypeInternals<string, unknown>>, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      command: z.ZodOptional<z.ZodString>;
      args: z.ZodOptional<z.ZodArray<z.ZodString>>;
      env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
      cwd: z.ZodOptional<z.ZodString>;
      url: z.ZodOptional<z.ZodString>;
      transport: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"stdio">, z.ZodLiteral<"sse">, z.ZodLiteral<"streamable-http">]>>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
      connectionTimeoutMs: z.ZodOptional<z.ZodNumber>;
      requestTimeoutMs: z.ZodOptional<z.ZodNumber>;
      supportsParallelToolCalls: z.ZodOptional<z.ZodBoolean>;
      auth: z.ZodOptional<z.ZodLiteral<"oauth">>;
      oauth: z.ZodOptional<z.ZodObject<{
        identity: z.ZodOptional<z.ZodEnum<{
          "per-requester": "per-requester";
          shared: "shared";
        }>>;
        authProfileId: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodString>;
        redirectUrl: z.ZodOptional<z.ZodString>;
        clientMetadataUrl: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      sslVerify: z.ZodOptional<z.ZodBoolean>;
      clientCert: z.ZodOptional<z.ZodString>;
      clientKey: z.ZodOptional<z.ZodString>;
      toolFilter: z.ZodOptional<z.ZodObject<{
        include: z.ZodOptional<z.ZodArray<z.ZodString>>;
        exclude: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      codex: z.ZodOptional<z.ZodObject<{
        agents: z.ZodOptional<z.ZodArray<z.ZodString>>;
        defaultToolsApprovalMode: z.ZodOptional<z.ZodEnum<{
          approve: "approve";
          auto: "auto";
          prompt: "prompt";
        }>>;
      }, z.core.$strict>>;
    }, z.core.$catchall<z.ZodUnknown>>>, unknown>>;
  }, z.core.$strict>>;
  skills: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.access-groups.d.ts
type AccessGroupsConfig = NonNullable<z.input<typeof AccessGroupsSchema>>;
//#endregion
//#region packages/acp-core/src/runtime/types.d.ts
/** Runtime update tags emitted by ACP adapters; unknown backend tags are passed through. */
type AcpSessionUpdateTag = "agent_message_chunk" | "agent_thought_chunk" | "tool_call" | "tool_call_update" | "usage_update" | "available_commands_update" | "current_mode_update" | "config_option_update" | "session_info_update" | "plan" | (string & {});
//#endregion
//#region src/config/zod-schema.channel-bot-loop.d.ts
declare const ChannelBotLoopProtectionSchema: z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
  windowSeconds: z.ZodOptional<z.ZodNumber>;
  cooldownSeconds: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
//#endregion
//#region src/config/zod-schema.channel-messaging-common.d.ts
declare const ChannelStreamingPreviewSchema: z.ZodObject<{
  chunk: z.ZodOptional<z.ZodObject<{
    minChars: z.ZodOptional<z.ZodNumber>;
    maxChars: z.ZodOptional<z.ZodNumber>;
    breakPreference: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"paragraph">, z.ZodLiteral<"newline">, z.ZodLiteral<"sentence">]>>;
  }, z.core.$strict>>;
  toolProgress: z.ZodOptional<z.ZodBoolean>;
  commandText: z.ZodOptional<z.ZodEnum<{
    raw: "raw";
    status: "status";
  }>>;
}, z.core.$strict>;
declare const ChannelStreamingProgressSchema: z.ZodObject<{
  label: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<false>]>>;
  labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
  maxLines: z.ZodOptional<z.ZodNumber>;
  maxLineChars: z.ZodOptional<z.ZodNumber>;
  toolProgress: z.ZodOptional<z.ZodBoolean>;
  commandText: z.ZodOptional<z.ZodEnum<{
    raw: "raw";
    status: "status";
  }>>;
  commentary: z.ZodOptional<z.ZodBoolean>;
  narration: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
declare const ChannelPreviewStreamingConfigSchema: z.ZodObject<{
  mode: z.ZodOptional<z.ZodEnum<{
    block: "block";
    off: "off";
    partial: "partial";
    progress: "progress";
  }>>;
  chunkMode: z.ZodOptional<z.ZodEnum<{
    length: "length";
    newline: "newline";
  }>>;
  preview: z.ZodOptional<z.ZodObject<{
    chunk: z.ZodOptional<z.ZodObject<{
      minChars: z.ZodOptional<z.ZodNumber>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      breakPreference: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"paragraph">, z.ZodLiteral<"newline">, z.ZodLiteral<"sentence">]>>;
    }, z.core.$strict>>;
    toolProgress: z.ZodOptional<z.ZodBoolean>;
    commandText: z.ZodOptional<z.ZodEnum<{
      raw: "raw";
      status: "status";
    }>>;
  }, z.core.$strict>>;
  progress: z.ZodOptional<z.ZodObject<{
    label: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<false>]>>;
    labels: z.ZodOptional<z.ZodArray<z.ZodString>>;
    maxLines: z.ZodOptional<z.ZodNumber>;
    maxLineChars: z.ZodOptional<z.ZodNumber>;
    toolProgress: z.ZodOptional<z.ZodBoolean>;
    commandText: z.ZodOptional<z.ZodEnum<{
      raw: "raw";
      status: "status";
    }>>;
    commentary: z.ZodOptional<z.ZodBoolean>;
    narration: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  block: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    coalesce: z.ZodOptional<z.ZodObject<{
      minChars: z.ZodOptional<z.ZodNumber>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      idleMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
}, z.core.$strict>;
/** Canonical optional account contract shared by bundled messaging channels. */
declare const CommonChannelAccountSchema: z.ZodObject<{
  name: z.ZodOptional<z.ZodString>;
  capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
  markdown: z.ZodOptional<z.ZodObject<{
    tables: z.ZodOptional<z.ZodEnum<{
      block: "block";
      bullets: "bullets";
      code: "code";
      off: "off";
    }>>;
  }, z.core.$strict>>;
  configWrites: z.ZodOptional<z.ZodBoolean>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  dmPolicy: z.ZodOptional<z.ZodEnum<{
    allowlist: "allowlist";
    disabled: "disabled";
    open: "open";
    pairing: "pairing";
  }>>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  defaultTo: z.ZodOptional<z.ZodString>;
  groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  groupPolicy: z.ZodOptional<z.ZodEnum<{
    allowlist: "allowlist";
    disabled: "disabled";
    open: "open";
  }>>;
  mentionPatterns: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
    allowIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    denyIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  contextVisibility: z.ZodOptional<z.ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  historyLimit: z.ZodOptional<z.ZodNumber>;
  dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
  dms: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    historyLimit: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>>>;
  textChunkLimit: z.ZodOptional<z.ZodNumber>;
  streaming: z.ZodOptional<z.ZodObject<{
    chunkMode: z.ZodOptional<z.ZodEnum<{
      length: "length";
      newline: "newline";
    }>>;
    block: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      coalesce: z.ZodOptional<z.ZodObject<{
        minChars: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        idleMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  heartbeatVisibility: z.ZodOptional<z.ZodObject<{
    showOk: z.ZodOptional<z.ZodBoolean>;
    showAlerts: z.ZodOptional<z.ZodBoolean>;
    useIndicator: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  healthMonitor: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  responsePrefix: z.ZodOptional<z.ZodString>;
  mediaMaxMb: z.ZodOptional<z.ZodNumber>;
  replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
}, z.core.$strict>;
//#endregion
//#region src/config/zod-schema.messages.d.ts
declare const GroupChatSchema: z.ZodOptional<z.ZodObject<{
  mentionPatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
  historyLimit: z.ZodOptional<z.ZodNumber>;
  unmentionedInbound: z.ZodOptional<z.ZodEnum<{
    room_event: "room_event";
    user_request: "user_request";
  }>>;
  visibleReplies: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
    automatic: "automatic";
    message_tool: "message_tool";
  }>, z.ZodBoolean]>>;
}, z.core.$strict>>;
declare const DmConfigSchema: z.ZodObject<{
  historyLimit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
declare const ProviderCommandsSchema: z.ZodOptional<z.ZodObject<{
  native: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
  nativeSkills: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
}, z.core.$strict>>;
declare const MessagesSchema: z.ZodOptional<z.ZodObject<{
  visibleReplies: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
    automatic: "automatic";
    message_tool: "message_tool";
  }>, z.ZodBoolean]>>;
  responsePrefix: z.ZodOptional<z.ZodString>;
  usageTemplate: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>;
  responseUsage: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
    full: "full";
    off: "off";
    on: "on";
    tokens: "tokens";
  }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
    full: "full";
    off: "off";
    on: "on";
    tokens: "tokens";
  }>>]>>;
  groupChat: z.ZodOptional<z.ZodObject<{
    mentionPatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
    historyLimit: z.ZodOptional<z.ZodNumber>;
    unmentionedInbound: z.ZodOptional<z.ZodEnum<{
      room_event: "room_event";
      user_request: "user_request";
    }>>;
    visibleReplies: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
      automatic: "automatic";
      message_tool: "message_tool";
    }>, z.ZodBoolean]>>;
  }, z.core.$strict>>;
  queue: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
    byChannel: z.ZodOptional<z.ZodObject<{
      whatsapp: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      telegram: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      discord: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      irc: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      googlechat: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      slack: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      mattermost: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      signal: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      imessage: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      msteams: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      webchat: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      matrix: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
    }, z.core.$strict>>;
    debounceMsByChannel: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    cap: z.ZodOptional<z.ZodNumber>;
    drop: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"old">, z.ZodLiteral<"new">, z.ZodLiteral<"summarize">]>>;
  }, z.core.$strict>>;
  inbound: z.ZodOptional<z.ZodObject<{
    debounceMs: z.ZodOptional<z.ZodNumber>;
    byChannel: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
  }, z.core.$strict>>;
  ackReaction: z.ZodOptional<z.ZodString>;
  ackReactionScope: z.ZodOptional<z.ZodEnum<{
    all: "all";
    direct: "direct";
    "group-all": "group-all";
    "group-mentions": "group-mentions";
    none: "none";
    off: "off";
  }>>;
  statusReactions: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
declare const BroadcastSchema: z.ZodOptional<z.ZodObject<{
  strategy: z.ZodOptional<z.ZodEnum<{
    parallel: "parallel";
    sequential: "sequential";
  }>>;
}, z.core.$catchall<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodObject<{
  agents: z.ZodArray<z.ZodString>;
  mentionGating: z.ZodOptional<z.ZodBoolean>;
  maxRounds: z.ZodOptional<z.ZodNumber>;
  maxTurns: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>]>>>>;
//#endregion
//#region src/config/zod-schema.core.d.ts
/** Canonical operator-configurable SSRF policy shared by network-capable surfaces. */
declare const SsrFPolicyConfigSchema: z.ZodObject<{
  dangerouslyAllowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
  allowRfc2544BenchmarkRange: z.ZodOptional<z.ZodBoolean>;
  allowIpv6UniqueLocalRange: z.ZodOptional<z.ZodBoolean>;
  allowedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
  blockedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
/** Schema for the top-level `secrets` config block. */
declare const SecretsConfigSchema: z.ZodOptional<z.ZodObject<{
  egressProxy: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowedHosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
    bypassHosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  providers: z.ZodOptional<z.ZodObject<{}, z.core.$catchall<z.ZodUnion<readonly [z.ZodObject<{
    source: z.ZodLiteral<"env">;
    allowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>, z.ZodObject<{
    source: z.ZodLiteral<"file">;
    path: z.ZodString;
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"singleValue">, z.ZodLiteral<"json">]>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    maxBytes: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>, z.ZodUnion<readonly [z.ZodObject<{
    source: z.ZodLiteral<"exec">;
    command: z.ZodString;
    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    noOutputTimeoutMs: z.ZodOptional<z.ZodNumber>;
    maxOutputBytes: z.ZodOptional<z.ZodNumber>;
    jsonOnly: z.ZodOptional<z.ZodBoolean>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    passEnv: z.ZodOptional<z.ZodArray<z.ZodString>>;
    trustedDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>, z.ZodObject<{
    source: z.ZodLiteral<"exec">;
    pluginIntegration: z.ZodObject<{
      pluginId: z.ZodString;
      integrationId: z.ZodString;
    }, z.core.$strict>;
  }, z.core.$strict>]>, z.ZodObject<{
    source: z.ZodLiteral<"store">;
  }, z.core.$strict>]>>>>;
  defaults: z.ZodOptional<z.ZodObject<{
    env: z.ZodOptional<z.ZodString>;
    file: z.ZodOptional<z.ZodString>;
    exec: z.ZodOptional<z.ZodString>;
    store: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
declare const ModelsConfigSchema: z.ZodOptional<z.ZodObject<{
  mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"merge">, z.ZodLiteral<"replace">]>>;
  providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    baseUrl: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
    auth: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"api-key">, z.ZodLiteral<"aws-sdk">, z.ZodLiteral<"oauth">, z.ZodLiteral<"token">]>>;
    api: z.ZodOptional<z.ZodEnum<{
      "anthropic-messages": "anthropic-messages";
      "azure-openai-responses": "azure-openai-responses";
      "bedrock-converse-stream": "bedrock-converse-stream";
      "github-copilot": "github-copilot";
      "google-generative-ai": "google-generative-ai";
      "google-vertex": "google-vertex";
      ollama: "ollama";
      "openai-chatgpt-responses": "openai-chatgpt-responses";
      "openai-completions": "openai-completions";
      "openai-responses": "openai-responses";
      "pi-messages": "pi-messages";
    }>>;
    maxTokens: z.ZodOptional<z.ZodNumber>;
    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
    region: z.ZodOptional<z.ZodString>;
    injectNumCtxForOpenAICompat: z.ZodOptional<z.ZodBoolean>;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    agentRuntime: z.ZodOptional<z.ZodObject<{
      id: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    localService: z.ZodOptional<z.ZodObject<{
      command: z.ZodString;
      args: z.ZodOptional<z.ZodArray<z.ZodString>>;
      cwd: z.ZodOptional<z.ZodString>;
      env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      healthUrl: z.ZodOptional<z.ZodString>;
      readyTimeoutMs: z.ZodOptional<z.ZodNumber>;
      idleStopMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>>;
    authHeader: z.ZodOptional<z.ZodBoolean>;
    request: z.ZodOptional<z.ZodObject<{
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>>;
      auth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
        mode: z.ZodLiteral<"provider-default">;
      }, z.core.$strict>, z.ZodObject<{
        mode: z.ZodLiteral<"authorization-bearer">;
        token: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>;
      }, z.core.$strict>, z.ZodObject<{
        mode: z.ZodLiteral<"header">;
        headerName: z.ZodString;
        value: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>;
        prefix: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>]>>;
      proxy: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
        mode: z.ZodLiteral<"env-proxy">;
        tls: z.ZodOptional<z.ZodObject<{
          ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          serverName: z.ZodOptional<z.ZodString>;
          insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
      }, z.core.$strict>, z.ZodObject<{
        mode: z.ZodLiteral<"explicit-proxy">;
        url: z.ZodString;
        tls: z.ZodOptional<z.ZodObject<{
          ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          serverName: z.ZodOptional<z.ZodString>;
          insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
      }, z.core.$strict>]>>;
      tls: z.ZodOptional<z.ZodObject<{
        ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>;
        cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>;
        key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>;
        passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>;
        serverName: z.ZodOptional<z.ZodString>;
        insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      allowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    models: z.ZodOptional<z.ZodArray<z.ZodObject<{
      id: z.ZodString;
      name: z.ZodString;
      api: z.ZodOptional<z.ZodEnum<{
        "anthropic-messages": "anthropic-messages";
        "azure-openai-responses": "azure-openai-responses";
        "bedrock-converse-stream": "bedrock-converse-stream";
        "github-copilot": "github-copilot";
        "google-generative-ai": "google-generative-ai";
        "google-vertex": "google-vertex";
        ollama: "ollama";
        "openai-chatgpt-responses": "openai-chatgpt-responses";
        "openai-completions": "openai-completions";
        "openai-responses": "openai-responses";
        "pi-messages": "pi-messages";
      }>>;
      baseUrl: z.ZodOptional<z.ZodString>;
      reasoning: z.ZodOptional<z.ZodBoolean>;
      input: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"text">, z.ZodLiteral<"image">, z.ZodLiteral<"video">, z.ZodLiteral<"audio">]>>>;
      cost: z.ZodOptional<z.ZodObject<{
        input: z.ZodOptional<z.ZodNumber>;
        output: z.ZodOptional<z.ZodNumber>;
        cacheRead: z.ZodOptional<z.ZodNumber>;
        cacheWrite: z.ZodOptional<z.ZodNumber>;
        tieredPricing: z.ZodOptional<z.ZodArray<z.ZodObject<{
          input: z.ZodNumber;
          output: z.ZodNumber;
          cacheRead: z.ZodNumber;
          cacheWrite: z.ZodNumber;
          range: z.ZodUnion<readonly [z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, z.ZodTuple<[z.ZodNumber], null>]>;
        }, z.core.$strict>>>;
      }, z.core.$strict>>;
      contextWindow: z.ZodOptional<z.ZodNumber>;
      contextTokens: z.ZodOptional<z.ZodNumber>;
      maxTokens: z.ZodOptional<z.ZodNumber>;
      thinkingLevelMap: z.ZodOptional<z.ZodObject<{
        off: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        minimal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        low: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        medium: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        high: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        xhigh: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        max: z.ZodOptional<z.ZodNullable<z.ZodString>>;
      }, z.core.$strict>>;
      params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      agentRuntime: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      compat: z.ZodOptional<z.ZodObject<{
        supportsStore: z.ZodOptional<z.ZodBoolean>;
        supportsPromptCacheKey: z.ZodOptional<z.ZodBoolean>;
        supportsResponsesContinuation: z.ZodOptional<z.ZodBoolean>;
        supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
        supportsReasoningEffort: z.ZodOptional<z.ZodBoolean>;
        supportsTemperature: z.ZodOptional<z.ZodBoolean>;
        supportsInstructions: z.ZodOptional<z.ZodBoolean>;
        supportsUsageInStreaming: z.ZodOptional<z.ZodBoolean>;
        supportsTools: z.ZodOptional<z.ZodBoolean>;
        codeMode: z.ZodOptional<z.ZodEnum<{
          capable: "capable";
          preferred: "preferred";
        }>>;
        supportsStrictMode: z.ZodOptional<z.ZodBoolean>;
        supportsJsonSchemaResponseFormat: z.ZodOptional<z.ZodBoolean>;
        requiresStringContent: z.ZodOptional<z.ZodBoolean>;
        strictMessageKeys: z.ZodOptional<z.ZodBoolean>;
        visibleReasoningDetailTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        supportedReasoningEfforts: z.ZodOptional<z.ZodArray<z.ZodString>>;
        reasoningEffortMap: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        maxTokensField: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"max_completion_tokens">, z.ZodLiteral<"max_tokens">]>>;
        thinkingFormat: z.ZodOptional<z.ZodEnum<{
          deepseek: "deepseek";
          openai: "openai";
          openrouter: "openrouter";
          qwen: "qwen";
          "qwen-chat-template": "qwen-chat-template";
          together: "together";
          zai: "zai";
        }>>;
        requiresToolResultName: z.ZodOptional<z.ZodBoolean>;
        requiresAssistantAfterToolResult: z.ZodOptional<z.ZodBoolean>;
        requiresThinkingAsText: z.ZodOptional<z.ZodBoolean>;
        requiresReasoningContentOnAssistantMessages: z.ZodOptional<z.ZodBoolean>;
        toolSchemaProfile: z.ZodOptional<z.ZodString>;
        unsupportedToolSchemaKeywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
        toolCallArgumentsEncoding: z.ZodOptional<z.ZodString>;
        requiresOpenAiAnthropicToolPayload: z.ZodOptional<z.ZodBoolean>;
        openRouterRouting: z.ZodOptional<z.ZodObject<{
          allow_fallbacks: z.ZodOptional<z.ZodBoolean>;
          require_parameters: z.ZodOptional<z.ZodBoolean>;
          data_collection: z.ZodOptional<z.ZodEnum<{
            allow: "allow";
            deny: "deny";
          }>>;
          zdr: z.ZodOptional<z.ZodBoolean>;
          enforce_distillable_text: z.ZodOptional<z.ZodBoolean>;
          order: z.ZodOptional<z.ZodArray<z.ZodString>>;
          only: z.ZodOptional<z.ZodArray<z.ZodString>>;
          ignore: z.ZodOptional<z.ZodArray<z.ZodString>>;
          quantizations: z.ZodOptional<z.ZodArray<z.ZodString>>;
          sort: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
            by: z.ZodOptional<z.ZodString>;
            partition: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          }, z.core.$strict>]>>;
          max_price: z.ZodOptional<z.ZodObject<{
            prompt: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            completion: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            image: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            audio: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            request: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
          }, z.core.$strict>>;
          preferred_min_throughput: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodObject<{
            p50: z.ZodOptional<z.ZodNumber>;
            p75: z.ZodOptional<z.ZodNumber>;
            p90: z.ZodOptional<z.ZodNumber>;
            p99: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>]>>;
          preferred_max_latency: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodObject<{
            p50: z.ZodOptional<z.ZodNumber>;
            p75: z.ZodOptional<z.ZodNumber>;
            p90: z.ZodOptional<z.ZodNumber>;
            p99: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>]>>;
        }, z.core.$strict>>;
        vercelGatewayRouting: z.ZodOptional<z.ZodObject<{
          only: z.ZodOptional<z.ZodArray<z.ZodString>>;
          order: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        zaiToolStream: z.ZodOptional<z.ZodBoolean>;
        cacheControlFormat: z.ZodOptional<z.ZodLiteral<"anthropic">>;
        sendSessionAffinityHeaders: z.ZodOptional<z.ZodBoolean>;
        sendSessionIdHeader: z.ZodOptional<z.ZodBoolean>;
        supportsEagerToolInputStreaming: z.ZodOptional<z.ZodBoolean>;
        supportsLongCacheRetention: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      mediaInput: z.ZodOptional<z.ZodObject<{
        image: z.ZodOptional<z.ZodObject<{
          maxBytes: z.ZodOptional<z.ZodNumber>;
          maxPixels: z.ZodOptional<z.ZodNumber>;
          maxSidePx: z.ZodOptional<z.ZodNumber>;
          preferredSidePx: z.ZodOptional<z.ZodNumber>;
          tokenMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"tile">, z.ZodLiteral<"detail">, z.ZodLiteral<"provider">]>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      metadataSource: z.ZodOptional<z.ZodLiteral<"models-add">>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>>;
  catalogRefresh: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    url: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
declare const ReplyToModeSchema: z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>;
declare const TypingModeSchema: z.ZodUnion<readonly [z.ZodLiteral<"never">, z.ZodLiteral<"instant">, z.ZodLiteral<"thinking">, z.ZodLiteral<"message">]>;
declare const GroupPolicySchema: z.ZodEnum<{
  allowlist: "allowlist";
  disabled: "disabled";
  open: "open";
}>;
declare const DmPolicySchema: z.ZodEnum<{
  allowlist: "allowlist";
  disabled: "disabled";
  open: "open";
  pairing: "pairing";
}>;
declare const ContextVisibilityModeSchema: z.ZodEnum<{
  all: "all";
  allowlist: "allowlist";
  allowlist_quote: "allowlist_quote";
}>;
declare const BlockStreamingCoalesceSchema: z.ZodObject<{
  minChars: z.ZodOptional<z.ZodNumber>;
  maxChars: z.ZodOptional<z.ZodNumber>;
  idleMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
/** Delivery-only nested streaming config for channels without preview modes. */
declare const ChannelDeliveryStreamingConfigSchema: z.ZodObject<{
  chunkMode: z.ZodOptional<z.ZodEnum<{
    length: "length";
    newline: "newline";
  }>>;
  block: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    coalesce: z.ZodOptional<z.ZodObject<{
      minChars: z.ZodOptional<z.ZodNumber>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      idleMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
}, z.core.$strict>;
declare const BlockStreamingChunkSchema: z.ZodObject<{
  minChars: z.ZodOptional<z.ZodNumber>;
  maxChars: z.ZodOptional<z.ZodNumber>;
  breakPreference: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"paragraph">, z.ZodLiteral<"newline">, z.ZodLiteral<"sentence">]>>;
}, z.core.$strict>;
declare const TtsConfigSchema: z.ZodOptional<z.ZodObject<{
  auto: z.ZodOptional<z.ZodEnum<{
    always: "always";
    inbound: "inbound";
    off: "off";
    tagged: "tagged";
  }>>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  mode: z.ZodOptional<z.ZodEnum<{
    all: "all";
    final: "final";
  }>>;
  provider: z.ZodOptional<z.ZodString>;
  persona: z.ZodOptional<z.ZodString>;
  personas: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    provider: z.ZodOptional<z.ZodString>;
    fallbackPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"preserve-persona">, z.ZodLiteral<"provider-defaults">, z.ZodLiteral<"fail">]>>;
    providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
    }, z.core.$catchall<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnknown>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>>>>;
  }, z.core.$strict>>>;
  summaryModel: z.ZodOptional<z.ZodString>;
  modelOverrides: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowText: z.ZodOptional<z.ZodBoolean>;
    allowProvider: z.ZodOptional<z.ZodBoolean>;
    allowVoice: z.ZodOptional<z.ZodBoolean>;
    allowModelId: z.ZodOptional<z.ZodBoolean>;
    allowVoiceSettings: z.ZodOptional<z.ZodBoolean>;
    allowNormalization: z.ZodOptional<z.ZodBoolean>;
    allowSeed: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
  }, z.core.$catchall<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnknown>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>>>>;
  maxTextLength: z.ZodOptional<z.ZodNumber>;
  timeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>>;
declare const HumanDelaySchema: z.ZodObject<{
  mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"natural">, z.ZodLiteral<"custom">]>>;
  minMs: z.ZodOptional<z.ZodNumber>;
  maxMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
//#endregion
//#region src/config/zod-schema.logging.d.ts
declare const DiagnosticsConfigSchema: z.ZodOptional<z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  flags: z.ZodOptional<z.ZodArray<z.ZodString>>;
  otel: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    endpoint: z.ZodOptional<z.ZodString>;
    tracesEndpoint: z.ZodOptional<z.ZodString>;
    metricsEndpoint: z.ZodOptional<z.ZodString>;
    logsEndpoint: z.ZodOptional<z.ZodString>;
    protocol: z.ZodOptional<z.ZodLiteral<"http/protobuf">>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    serviceName: z.ZodOptional<z.ZodString>;
    metricNamePrefix: z.ZodOptional<z.ZodString>;
    traces: z.ZodOptional<z.ZodBoolean>;
    metrics: z.ZodOptional<z.ZodBoolean>;
    logs: z.ZodOptional<z.ZodBoolean>;
    logsExporter: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"otlp">, z.ZodLiteral<"stdout">, z.ZodLiteral<"both">]>>;
    sampleRate: z.ZodOptional<z.ZodNumber>;
    flushIntervalMs: z.ZodOptional<z.ZodNumber>;
    captureContent: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  cacheTrace: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
declare const LoggingConfigSchema: z.ZodOptional<z.ZodObject<{
  level: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"silent">, z.ZodLiteral<"fatal">, z.ZodLiteral<"error">, z.ZodLiteral<"warn">, z.ZodLiteral<"info">, z.ZodLiteral<"debug">, z.ZodLiteral<"trace">]>>;
  file: z.ZodOptional<z.ZodString>;
  maxFileBytes: z.ZodOptional<z.ZodNumber>;
  consoleLevel: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"silent">, z.ZodLiteral<"fatal">, z.ZodLiteral<"error">, z.ZodLiteral<"warn">, z.ZodLiteral<"info">, z.ZodLiteral<"debug">, z.ZodLiteral<"trace">]>>;
  consoleStyle: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pretty">, z.ZodLiteral<"json">]>>;
  redactPatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
  audit: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    executionIdentity: z.ZodOptional<z.ZodBoolean>;
    messages: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"direct">, z.ZodLiteral<"all">]>>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/zod-schema.session-config.d.ts
declare const SessionSchema: z.ZodOptional<z.ZodObject<{
  scope: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"per-sender">, z.ZodLiteral<"global">]>>;
  dmScope: z.ZodOptional<z.ZodEnum<{
    main: "main";
    "per-account-channel-peer": "per-account-channel-peer";
    "per-channel-peer": "per-channel-peer";
    "per-peer": "per-peer";
  }>>;
  groupScope: z.ZodOptional<z.ZodEnum<{
    main: "main";
    "per-group": "per-group";
  }>>;
  notifyOnCreate: z.ZodOptional<z.ZodBoolean>;
  identityLinks: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
  resetTriggers: z.ZodOptional<z.ZodArray<z.ZodString>>;
  reset: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
    atHour: z.ZodOptional<z.ZodNumber>;
    idleMinutes: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  resetByType: z.ZodOptional<z.ZodObject<{
    direct: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
      atHour: z.ZodOptional<z.ZodNumber>;
      idleMinutes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    group: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
      atHour: z.ZodOptional<z.ZodNumber>;
      idleMinutes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    thread: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
      atHour: z.ZodOptional<z.ZodNumber>;
      idleMinutes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  resetByChannel: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
    atHour: z.ZodOptional<z.ZodNumber>;
    idleMinutes: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>>;
  store: z.ZodOptional<z.ZodString>;
  mainKey: z.ZodOptional<z.ZodString>;
  sendPolicy: z.ZodOptional<z.ZodOptional<z.ZodObject<{
    default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
    rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
      action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
      match: z.ZodOptional<z.ZodObject<{
        channel: z.ZodOptional<z.ZodString>;
        chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
        keyPrefix: z.ZodOptional<z.ZodString>;
        rawKeyPrefix: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>>;
  threadBindings: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    idleHours: z.ZodOptional<z.ZodNumber>;
    maxAgeHours: z.ZodOptional<z.ZodNumber>;
    spawnSessions: z.ZodOptional<z.ZodBoolean>;
    defaultSpawnContext: z.ZodOptional<z.ZodEnum<{
      fork: "fork";
      isolated: "isolated";
    }>>;
  }, z.core.$strict>>;
  sharing: z.ZodOptional<z.ZodObject<{
    readOnly: z.ZodOptional<z.ZodBoolean>;
    suggest: z.ZodOptional<z.ZodBoolean>;
    drafts: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  maintenance: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodEnum<{
      enforce: "enforce";
      warn: "warn";
    }>>;
    coldStorage: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      afterDays: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    pruneAfter: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    archiveDashboardAfter: z.ZodOptional<z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodLiteral<false>, z.ZodLiteral<0>]>>;
    maxEntries: z.ZodOptional<z.ZodNumber>;
    preserveRecent: z.ZodOptional<z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodLiteral<false>]>>;
    resetArchiveRetention: z.ZodOptional<z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodLiteral<false>]>>;
    maxDiskBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodLiteral<false>]>>;
    highWaterBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.base.d.ts
/** Typing indicator timing policy shared by channel configs. */
type TypingMode = z.input<typeof TypingModeSchema>;
/** DM session-key granularity across peers, channels, and accounts. */
type DmScope = "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer";
/** Which source messages outbound replies should thread or quote against. */
type ReplyToMode = z.input<typeof ReplyToModeSchema>;
/** Group-chat admission policy for channels with allowlists. */
type GroupPolicy = z.input<typeof GroupPolicySchema>;
/** Direct-message admission policy for channels with pairing/allowlists. */
type DmPolicy = z.input<typeof DmPolicySchema>;
/** How much non-allowlisted context is visible to an agent. */
type ContextVisibilityMode = z.input<typeof ContextVisibilityModeSchema>;
type BlockStreamingCoalesceConfig = z.input<typeof BlockStreamingCoalesceSchema>;
type BlockStreamingChunkConfig = z.input<typeof BlockStreamingChunkSchema>;
type ChannelStreamingProgressConfig = z.input<typeof ChannelStreamingProgressSchema>;
type ChannelStreamingPreviewConfig = z.input<typeof ChannelStreamingPreviewSchema>;
type SchemaChannelStreamingConfig = z.input<typeof ChannelPreviewStreamingConfigSchema>;
type ChannelStreamingConfig<TProgress extends ChannelStreamingProgressConfig = ChannelStreamingProgressConfig> = Omit<SchemaChannelStreamingConfig, "progress"> & {
  /** Prefer a channel's native streaming transport over its portable draft path. */
  nativeTransport?: boolean;
  progress?: TProgress;
};
type ChannelDeliveryStreamingConfig = z.input<typeof ChannelDeliveryStreamingConfigSchema>;
/** Streaming subset used by channels that render visible preview/progress replies. */
type ChannelPreviewStreamingConfig = Pick<ChannelStreamingConfig, "mode" | "chunkMode" | "preview" | "progress" | "block">;
type HumanDelayConfig = z.input<typeof HumanDelaySchema>;
type SessionSchemaInput = NonNullable<z.input<typeof SessionSchema>>;
type SessionThreadBindingsConfig = NonNullable<SessionSchemaInput["threadBindings"]>;
type SessionConfig = SessionSchemaInput;
type SessionMaintenanceConfig = NonNullable<SessionSchemaInput["maintenance"]>;
type SessionMaintenanceMode = NonNullable<SessionMaintenanceConfig["mode"]>;
type AgentElevatedAllowFromConfig = Partial<Record<string, Array<string | number>>>;
type IdentityConfig = {
  name?: string;
  theme?: string;
  emoji?: string;
  /** Avatar image: workspace-relative path, http(s) URL, or data URI. */
  avatar?: string;
};
type LoggingConfig = NonNullable<z.input<typeof LoggingConfigSchema>>;
type DiagnosticsConfig = NonNullable<z.input<typeof DiagnosticsConfigSchema>>;
type AuditConfig = NonNullable<LoggingConfig["audit"]>;
//#endregion
//#region src/config/types.bot-loop-protection.d.ts
type ChannelBotLoopProtectionConfig = z.input<typeof ChannelBotLoopProtectionSchema>;
//#endregion
//#region src/config/zod-schema.channels.d.ts
/** Optional heartbeat visibility controls shared by channel schemas. */
declare const ChannelHeartbeatVisibilitySchema: z.ZodOptional<z.ZodObject<{
  showOk: z.ZodOptional<z.ZodBoolean>;
  showAlerts: z.ZodOptional<z.ZodBoolean>;
  useIndicator: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.channel-health.d.ts
type ChannelHeartbeatVisibilityConfig = NonNullable<z.input<typeof ChannelHeartbeatVisibilitySchema>>;
//#endregion
//#region src/config/zod-schema.approvals.d.ts
/** Native exec approval mode accepted by config. */
declare const NativeExecApprovalEnableModeSchema: z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>;
declare const ApprovalsSchema: z.ZodOptional<z.ZodObject<{
  exec: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"targets">, z.ZodLiteral<"both">]>>;
    agentFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
    sessionFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
    targets: z.ZodOptional<z.ZodArray<z.ZodObject<{
      channel: z.ZodString;
      to: z.ZodString;
      accountId: z.ZodOptional<z.ZodString>;
      threadId: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
  plugin: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"targets">, z.ZodLiteral<"both">]>>;
    agentFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
    sessionFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
    targets: z.ZodOptional<z.ZodArray<z.ZodObject<{
      channel: z.ZodString;
      to: z.ZodString;
      accountId: z.ZodOptional<z.ZodString>;
      threadId: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.approvals.d.ts
type NativeExecApprovalEnableMode = z.input<typeof NativeExecApprovalEnableModeSchema>;
type ApprovalsConfig = NonNullable<z.input<typeof ApprovalsSchema>>;
//#endregion
//#region src/config/types.messages.d.ts
type DefinedSchemaInput<T extends z.ZodType> = NonNullable<z.input<T>>;
type GroupChatSchemaInput = DefinedSchemaInput<typeof GroupChatSchema>;
type GroupChatConfig = Omit<GroupChatSchemaInput, "visibleReplies"> & {
  visibleReplies?: "automatic" | "message_tool";
};
type DmConfig = DefinedSchemaInput<typeof DmConfigSchema>;
type BroadcastGroupConfig = Exclude<DefinedSchemaInput<typeof BroadcastSchema>[string], string[]>;
type BroadcastEntry = string[] | BroadcastGroupConfig;
type BroadcastStrategy = NonNullable<DefinedSchemaInput<typeof BroadcastSchema>["strategy"]>;
type BroadcastConfig = {
  strategy?: BroadcastStrategy;
  /**
   * Map channel-qualified peer IDs to participant arrays or bounded group options.
   * Unqualified WhatsApp peer arrays retain single-pass behavior.
   *
   * Note: the index signature includes `undefined` so `strategy?: ...` remains type-safe.
   */
  [peerId: string]: BroadcastEntry | BroadcastStrategy | undefined;
};
type MessagesSchemaInput = DefinedSchemaInput<typeof MessagesSchema>;
type MessagesConfig = Omit<MessagesSchemaInput, "groupChat" | "visibleReplies"> & {
  /** @deprecated Doctor-only legacy input. */
  removeAckAfterReply?: boolean;
  visibleReplies?: "automatic" | "message_tool";
  groupChat?: GroupChatConfig;
};
type NativeCommandsSetting = boolean | "auto";
type CommandAllowFrom = Record<string, Array<string | number>>;
type CommandsConfig = {
  /** @deprecated Doctor-only legacy input. */
  ownerDisplay?: "raw" | "hash";
  /** @deprecated Doctor-only legacy input. */
  ownerDisplaySecret?: string;
  native?: NativeCommandsSetting;
  nativeSkills?: NativeCommandsSetting;
  text?: boolean;
  bash?: boolean;
  bashForegroundMs?: number;
  config?: boolean;
  mcp?: boolean;
  plugins?: boolean;
  debug?: boolean;
  restart?: boolean;
  ownerAllowFrom?: Array<string | number>;
  allowFrom?: CommandAllowFrom;
};
type ProviderCommandsConfig = DefinedSchemaInput<typeof ProviderCommandsSchema>;
//#endregion
//#region src/config/types.channel-messaging-common.d.ts
type SchemaCommonChannelMessagingConfig = z.input<typeof CommonChannelAccountSchema>;
type CommonChannelMessagingConfig<TCapabilities = string[], TAllowFromEntry = string | number, TDefaultTo = string, TStreaming = ChannelDeliveryStreamingConfig> = Omit<SchemaCommonChannelMessagingConfig, "capabilities" | "allowFrom" | "defaultTo" | "groupAllowFrom" | "dms" | "streaming"> & {
  capabilities?: TCapabilities;
  allowFrom?: TAllowFromEntry[];
  defaultTo?: TDefaultTo;
  groupAllowFrom?: TAllowFromEntry[];
  dms?: Record<string, DmConfig>;
  streaming?: TStreaming;
  /** @deprecated Doctor-only legacy input. */
  heartbeat?: ChannelHeartbeatVisibilityConfig;
};
type ChannelExecApprovalTarget = "dm" | "channel" | "both";
type ChannelExecApprovalConfig<TApprover = string | number> = {
  enabled?: NativeExecApprovalEnableMode;
  approvers?: TApprover[];
  agentFilter?: string[];
  sessionFilter?: string[];
  target?: ChannelExecApprovalTarget;
};
type ChannelBotInteractionConfig<TAllowBots = boolean | "mentions"> = {
  allowBots?: TAllowBots;
  botLoopProtection?: ChannelBotLoopProtectionConfig;
  dangerouslyAllowNameMatching?: boolean;
};
type ChannelReadReceiptConfig = {
  sendReadReceipts?: boolean;
};
type ChannelReactionConfig<TNotification = never, TLevel = never, TAckReaction = never, TAllowlist extends boolean = false> = {
  reactionNotifications?: TNotification;
  reactionLevel?: TLevel;
  ackReaction?: TAckReaction;
} & (TAllowlist extends true ? {
  reactionAllowlist?: Array<string | number>;
} : Record<never, never>);
//#endregion
//#region src/config/types.discord-presence.d.ts
type DiscordPresenceEventsConfig = {
  /** Enable online-presence system events for this guild. Default: true when configured. */
  enabled?: boolean;
  /** Discord channel ID that receives the routed agent wake. */
  channelId: string;
  /** Optional immutable Discord user ID allowlist. Omit to include all human members. */
  users?: string[];
  /**
   * Suppress presence-derived online events for this many seconds after a new Gateway
   * session while guild presence state is rebuilt. 0 disables. Default: 300.
   */
  reconnectSuppressSeconds?: number;
  /** Maximum queued online events for this guild per burst window. Default: 8. */
  burstLimit?: number;
  /** Sliding burst-detection window in seconds. Default: 60. */
  burstWindowSeconds?: number;
};
//#endregion
//#region src/secrets/ref-contract.d.ts
/** Supported secret reference backends in config. */
type SecretRefSource = "env" | "file" | "exec" | "store";
/**
 * Stable identifier for a secret in a configured source.
 * Examples:
 * - env source: provider "default", id "OPENAI_API_KEY"
 * - file source: provider "mounted-json", id "/providers/openai/apiKey"
 * - exec source: provider "vault", id "openai/api-key"
 * - store source: provider "default", id "OPENAI_API_KEY"
 */
type SecretRef = {
  source: SecretRefSource;
  provider: string;
  id: string;
};
/** Secret-bearing config input: either a literal string or a structured SecretRef. */
type SecretInput = string | SecretRef;
//#endregion
//#region src/config/types.secrets.d.ts
type SecretsConfig = NonNullable<z.input<typeof SecretsConfigSchema>>;
//#endregion
//#region src/infra/exec-safe-bin-policy-profiles.d.ts
type SafeBinProfileFixture = {
  minPositional?: number;
  maxPositional?: number;
  allowedValueFlags?: readonly string[];
  deniedFlags?: readonly string[];
};
//#endregion
//#region src/config/types.provider-request.d.ts
/** Authentication override applied to provider requests after model/provider defaults resolve. */
type ConfiguredProviderRequestAuth = {
  mode: "provider-default";
} | {
  mode: "authorization-bearer";
  token: SecretInput;
} | {
  mode: "header";
  headerName: string;
  value: SecretInput;
  prefix?: string;
};
/** TLS material and verification knobs for provider or proxy connections. */
type ConfiguredProviderRequestTls = {
  ca?: SecretInput;
  cert?: SecretInput;
  key?: SecretInput;
  passphrase?: SecretInput;
  serverName?: string;
  insecureSkipVerify?: boolean;
};
/** Proxy selection for provider requests, including optional TLS settings for proxy transport. */
type ConfiguredProviderRequestProxy = {
  mode: "env-proxy";
  tls?: ConfiguredProviderRequestTls;
} | {
  mode: "explicit-proxy";
  url: string;
  tls?: ConfiguredProviderRequestTls;
};
/** Shared provider request overrides used by model providers and media/tool providers. */
type ConfiguredProviderRequest = {
  headers?: Record<string, SecretInput>;
  auth?: ConfiguredProviderRequestAuth;
  proxy?: ConfiguredProviderRequestProxy;
  tls?: ConfiguredProviderRequestTls;
};
/** Model-provider request overrides plus the private-network opt-in used by model transports. */
type ConfiguredModelProviderRequest = ConfiguredProviderRequest & {
  allowPrivateNetwork?: boolean;
};
//#endregion
//#region src/config/zod-schema.agent-runtime.d.ts
declare const HeartbeatSchema: z.ZodOptional<z.ZodObject<{
  every: z.ZodOptional<z.ZodString>;
  activeHours: z.ZodOptional<z.ZodObject<{
    start: z.ZodOptional<z.ZodString>;
    end: z.ZodOptional<z.ZodString>;
    timezone: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  model: z.ZodOptional<z.ZodString>;
  session: z.ZodOptional<z.ZodString>;
  target: z.ZodOptional<z.ZodString>;
  directPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"block">]>>;
  to: z.ZodOptional<z.ZodString>;
  accountId: z.ZodOptional<z.ZodString>;
  prompt: z.ZodOptional<z.ZodString>;
  timeoutSeconds: z.ZodOptional<z.ZodNumber>;
  lightContext: z.ZodOptional<z.ZodBoolean>;
  isolatedSession: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>>;
declare const AgentContextLimitsSchema: z.ZodOptional<z.ZodObject<{
  memoryGetMaxChars: z.ZodOptional<z.ZodNumber>;
  postCompactionMaxChars: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>>;
declare const ToolPolicySchema: z.ZodOptional<z.ZodObject<{
  allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>>;
declare const AgentSandboxSchema: z.ZodOptional<z.ZodObject<{
  mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"non-main">, z.ZodLiteral<"all">]>>;
  backend: z.ZodOptional<z.ZodString>;
  workspaceAccess: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"ro">, z.ZodLiteral<"rw">]>>;
  sessionToolsVisibility: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"spawned">, z.ZodLiteral<"all">]>>;
  scope: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"agent">, z.ZodLiteral<"shared">]>>;
  workspaceRoot: z.ZodOptional<z.ZodString>;
  docker: z.ZodOptional<z.ZodObject<{
    image: z.ZodOptional<z.ZodString>;
    containerPrefix: z.ZodOptional<z.ZodString>;
    workdir: z.ZodOptional<z.ZodString>;
    readOnlyRoot: z.ZodOptional<z.ZodBoolean>;
    tmpfs: z.ZodOptional<z.ZodArray<z.ZodString>>;
    network: z.ZodOptional<z.ZodString>;
    user: z.ZodOptional<z.ZodString>;
    capDrop: z.ZodOptional<z.ZodArray<z.ZodString>>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    setupCommand: z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>, z.ZodTransform<string, string | string[]>>, z.ZodString>>;
    pidsLimit: z.ZodOptional<z.ZodNumber>;
    memory: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    memorySwap: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    cpus: z.ZodOptional<z.ZodNumber>;
    gpus: z.ZodOptional<z.ZodString>;
    ulimits: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodObject<{
      soft: z.ZodOptional<z.ZodNumber>;
      hard: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>>;
    seccompProfile: z.ZodOptional<z.ZodString>;
    apparmorProfile: z.ZodOptional<z.ZodString>;
    dns: z.ZodOptional<z.ZodArray<z.ZodString>>;
    extraHosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
    binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    dangerouslyAllowReservedContainerTargets: z.ZodOptional<z.ZodBoolean>;
    dangerouslyAllowExternalBindSources: z.ZodOptional<z.ZodBoolean>;
    dangerouslyAllowContainerNamespaceJoin: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  ssh: z.ZodOptional<z.ZodObject<{
    target: z.ZodOptional<z.ZodString>;
    command: z.ZodOptional<z.ZodString>;
    workspaceRoot: z.ZodOptional<z.ZodString>;
    strictHostKeyChecking: z.ZodOptional<z.ZodBoolean>;
    updateHostKeys: z.ZodOptional<z.ZodBoolean>;
    identityFile: z.ZodOptional<z.ZodString>;
    certificateFile: z.ZodOptional<z.ZodString>;
    knownHostsFile: z.ZodOptional<z.ZodString>;
    identityData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
    certificateData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
    knownHostsData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
  }, z.core.$strict>>;
  browser: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    image: z.ZodOptional<z.ZodString>;
    containerPrefix: z.ZodOptional<z.ZodString>;
    network: z.ZodOptional<z.ZodString>;
    cdpPort: z.ZodOptional<z.ZodNumber>;
    cdpSourceRange: z.ZodOptional<z.ZodString>;
    vncPort: z.ZodOptional<z.ZodNumber>;
    noVncPort: z.ZodOptional<z.ZodNumber>;
    headless: z.ZodOptional<z.ZodBoolean>;
    noVncEnabled: z.ZodOptional<z.ZodBoolean>;
    allowHostControl: z.ZodOptional<z.ZodBoolean>;
    autoStart: z.ZodOptional<z.ZodBoolean>;
    autoStartTimeoutMs: z.ZodOptional<z.ZodNumber>;
    binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  prune: z.ZodOptional<z.ZodObject<{
    idleHours: z.ZodOptional<z.ZodNumber>;
    maxAgeDays: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
declare const AgentEntrySchema: z.ZodObject<{
  id: z.ZodString;
  name: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  workspace: z.ZodOptional<z.ZodString>;
  cwd: z.ZodOptional<z.ZodString>;
  agentDir: z.ZodOptional<z.ZodString>;
  model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    primary: z.ZodOptional<z.ZodString>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>]>>;
  utilityModel: z.ZodOptional<z.ZodString>;
  decisionModel: z.ZodOptional<z.ZodString>;
  models: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    alias: z.ZodOptional<z.ZodString>;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    agentRuntime: z.ZodOptional<z.ZodObject<{
      id: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    pickerRuntimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    codeMode: z.ZodOptional<z.ZodBoolean>;
    streaming: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>>;
  modelPolicy: z.ZodOptional<z.ZodObject<{
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  thinkingDefault: z.ZodOptional<z.ZodEnum<{
    adaptive: "adaptive";
    high: "high";
    low: "low";
    max: "max";
    medium: "medium";
    minimal: "minimal";
    off: "off";
    ultra: "ultra";
    xhigh: "xhigh";
  }>>;
  verboseDefault: z.ZodOptional<z.ZodEnum<{
    full: "full";
    off: "off";
    on: "on";
  }>>;
  toolProgressDetail: z.ZodOptional<z.ZodEnum<{
    explain: "explain";
    raw: "raw";
  }>>;
  reasoningDefault: z.ZodOptional<z.ZodEnum<{
    off: "off";
    on: "on";
    stream: "stream";
  }>>;
  fastModeDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
  contextInjection: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"always">, z.ZodLiteral<"continuation-skip">, z.ZodLiteral<"never">]>>;
  bootstrapMaxChars: z.ZodOptional<z.ZodNumber>;
  bootstrapTotalMaxChars: z.ZodOptional<z.ZodNumber>;
  experimental: z.ZodOptional<z.ZodObject<{
    localModelLean: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
  subagents: z.ZodOptional<z.ZodObject<{
    delegationMode: z.ZodOptional<z.ZodEnum<{
      prefer: "prefer";
      suggest: "suggest";
    }>>;
    allowAgents: z.ZodOptional<z.ZodArray<z.ZodString>>;
    model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
      primary: z.ZodOptional<z.ZodString>;
      fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>]>>;
    thinking: z.ZodOptional<z.ZodString>;
    requireAgentId: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  embeddedAgent: z.ZodOptional<z.ZodObject<{
    executionContract: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"strict-agentic">]>>;
  }, z.core.$strict>>;
  params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  runtime: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"embedded">;
  }, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"acp">;
    acp: z.ZodOptional<z.ZodObject<{
      agent: z.ZodOptional<z.ZodString>;
      backend: z.ZodOptional<z.ZodString>;
      mode: z.ZodOptional<z.ZodEnum<{
        oneshot: "oneshot";
        persistent: "persistent";
      }>>;
      cwd: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>]>>;
  memory: z.ZodOptional<z.ZodObject<{
    search: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      rememberAcrossConversations: z.ZodOptional<z.ZodBoolean>;
      sources: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"memory">, z.ZodLiteral<"sessions">]>>>;
      extraPaths: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        path: z.ZodString;
        pattern: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>]>>>;
      multimodal: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        modalities: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"image">, z.ZodLiteral<"audio">, z.ZodLiteral<"all">]>>>;
        maxFileBytes: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      experimental: z.ZodOptional<z.ZodObject<{
        sessionMemory: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      provider: z.ZodOptional<z.ZodString>;
      remote: z.ZodOptional<z.ZodObject<{
        baseUrl: z.ZodOptional<z.ZodString>;
        apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        batch: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      fallback: z.ZodOptional<z.ZodString>;
      model: z.ZodOptional<z.ZodString>;
      inputType: z.ZodOptional<z.ZodString>;
      queryInputType: z.ZodOptional<z.ZodString>;
      documentInputType: z.ZodOptional<z.ZodString>;
      outputDimensionality: z.ZodOptional<z.ZodNumber>;
      local: z.ZodOptional<z.ZodObject<{
        modelPath: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      store: z.ZodOptional<z.ZodObject<{
        fts: z.ZodOptional<z.ZodObject<{
          tokenizer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"unicode61">, z.ZodLiteral<"trigram">]>>;
        }, z.core.$strict>>;
        vector: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          extensionPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      query: z.ZodOptional<z.ZodObject<{
        maxResults: z.ZodOptional<z.ZodNumber>;
        minScore: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      cache: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  humanDelay: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"natural">, z.ZodLiteral<"custom">]>>;
    minMs: z.ZodOptional<z.ZodNumber>;
    maxMs: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  typingMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"never">, z.ZodLiteral<"instant">, z.ZodLiteral<"thinking">, z.ZodLiteral<"message">]>>;
  tts: z.ZodOptional<z.ZodObject<{
    auto: z.ZodOptional<z.ZodEnum<{
      always: "always";
      inbound: "inbound";
      off: "off";
      tagged: "tagged";
    }>>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    mode: z.ZodOptional<z.ZodEnum<{
      all: "all";
      final: "final";
    }>>;
    provider: z.ZodOptional<z.ZodString>;
    persona: z.ZodOptional<z.ZodString>;
    personas: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      label: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      provider: z.ZodOptional<z.ZodString>;
      fallbackPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"preserve-persona">, z.ZodLiteral<"provider-defaults">, z.ZodLiteral<"fail">]>>;
      providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>;
      }, z.core.$catchall<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnknown>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>>>>;
    }, z.core.$strict>>>;
    summaryModel: z.ZodOptional<z.ZodString>;
    modelOverrides: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      allowText: z.ZodOptional<z.ZodBoolean>;
      allowProvider: z.ZodOptional<z.ZodBoolean>;
      allowVoice: z.ZodOptional<z.ZodBoolean>;
      allowModelId: z.ZodOptional<z.ZodBoolean>;
      allowVoiceSettings: z.ZodOptional<z.ZodBoolean>;
      allowNormalization: z.ZodOptional<z.ZodBoolean>;
      allowSeed: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
    }, z.core.$catchall<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnknown>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>>>>;
    maxTextLength: z.ZodOptional<z.ZodNumber>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    prefsPath: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  skillsLimits: z.ZodOptional<z.ZodObject<{
    maxSkillsPromptChars: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  contextLimits: z.ZodOptional<z.ZodObject<{
    memoryGetMaxChars: z.ZodOptional<z.ZodNumber>;
    postCompactionMaxChars: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  heartbeat: z.ZodOptional<z.ZodObject<{
    every: z.ZodOptional<z.ZodString>;
    activeHours: z.ZodOptional<z.ZodObject<{
      start: z.ZodOptional<z.ZodString>;
      end: z.ZodOptional<z.ZodString>;
      timezone: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    model: z.ZodOptional<z.ZodString>;
    session: z.ZodOptional<z.ZodString>;
    target: z.ZodOptional<z.ZodString>;
    directPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"block">]>>;
    to: z.ZodOptional<z.ZodString>;
    accountId: z.ZodOptional<z.ZodString>;
    prompt: z.ZodOptional<z.ZodString>;
    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
    lightContext: z.ZodOptional<z.ZodBoolean>;
    isolatedSession: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  identity: z.ZodOptional<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    theme: z.ZodOptional<z.ZodString>;
    emoji: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  groupChat: z.ZodOptional<z.ZodObject<{
    mentionPatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
    historyLimit: z.ZodOptional<z.ZodNumber>;
    unmentionedInbound: z.ZodOptional<z.ZodEnum<{
      room_event: "room_event";
      user_request: "user_request";
    }>>;
  }, z.core.$strict>>;
  sandbox: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"non-main">, z.ZodLiteral<"all">]>>;
    backend: z.ZodOptional<z.ZodString>;
    workspaceAccess: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"ro">, z.ZodLiteral<"rw">]>>;
    sessionToolsVisibility: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"spawned">, z.ZodLiteral<"all">]>>;
    scope: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"agent">, z.ZodLiteral<"shared">]>>;
    workspaceRoot: z.ZodOptional<z.ZodString>;
    docker: z.ZodOptional<z.ZodObject<{
      image: z.ZodOptional<z.ZodString>;
      containerPrefix: z.ZodOptional<z.ZodString>;
      workdir: z.ZodOptional<z.ZodString>;
      readOnlyRoot: z.ZodOptional<z.ZodBoolean>;
      tmpfs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      network: z.ZodOptional<z.ZodString>;
      user: z.ZodOptional<z.ZodString>;
      capDrop: z.ZodOptional<z.ZodArray<z.ZodString>>;
      env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      setupCommand: z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>, z.ZodTransform<string, string | string[]>>, z.ZodString>>;
      pidsLimit: z.ZodOptional<z.ZodNumber>;
      memory: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      memorySwap: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      cpus: z.ZodOptional<z.ZodNumber>;
      gpus: z.ZodOptional<z.ZodString>;
      ulimits: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodObject<{
        soft: z.ZodOptional<z.ZodNumber>;
        hard: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>]>>>;
      seccompProfile: z.ZodOptional<z.ZodString>;
      apparmorProfile: z.ZodOptional<z.ZodString>;
      dns: z.ZodOptional<z.ZodArray<z.ZodString>>;
      extraHosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
      binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
      dangerouslyAllowReservedContainerTargets: z.ZodOptional<z.ZodBoolean>;
      dangerouslyAllowExternalBindSources: z.ZodOptional<z.ZodBoolean>;
      dangerouslyAllowContainerNamespaceJoin: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    ssh: z.ZodOptional<z.ZodObject<{
      target: z.ZodOptional<z.ZodString>;
      command: z.ZodOptional<z.ZodString>;
      workspaceRoot: z.ZodOptional<z.ZodString>;
      strictHostKeyChecking: z.ZodOptional<z.ZodBoolean>;
      updateHostKeys: z.ZodOptional<z.ZodBoolean>;
      identityFile: z.ZodOptional<z.ZodString>;
      certificateFile: z.ZodOptional<z.ZodString>;
      knownHostsFile: z.ZodOptional<z.ZodString>;
      identityData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
      certificateData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
      knownHostsData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
    }, z.core.$strict>>;
    browser: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      image: z.ZodOptional<z.ZodString>;
      containerPrefix: z.ZodOptional<z.ZodString>;
      network: z.ZodOptional<z.ZodString>;
      cdpPort: z.ZodOptional<z.ZodNumber>;
      cdpSourceRange: z.ZodOptional<z.ZodString>;
      vncPort: z.ZodOptional<z.ZodNumber>;
      noVncPort: z.ZodOptional<z.ZodNumber>;
      headless: z.ZodOptional<z.ZodBoolean>;
      noVncEnabled: z.ZodOptional<z.ZodBoolean>;
      allowHostControl: z.ZodOptional<z.ZodBoolean>;
      autoStart: z.ZodOptional<z.ZodBoolean>;
      autoStartTimeoutMs: z.ZodOptional<z.ZodNumber>;
      binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    prune: z.ZodOptional<z.ZodObject<{
      idleHours: z.ZodOptional<z.ZodNumber>;
      maxAgeDays: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  tools: z.ZodOptional<z.ZodObject<{
    profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    byProvider: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
    }, z.core.$strict>>>;
    toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>>;
    codeMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
      executor: z.ZodOptional<z.ZodEnum<{
        node: "node";
        quickjs: "quickjs";
      }>>;
      mode: z.ZodOptional<z.ZodLiteral<"only">>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
      memoryLimitBytes: z.ZodOptional<z.ZodNumber>;
      maxOutputBytes: z.ZodOptional<z.ZodNumber>;
      maxSnapshotBytes: z.ZodOptional<z.ZodNumber>;
      maxPendingToolCalls: z.ZodOptional<z.ZodNumber>;
      snapshotTtlSeconds: z.ZodOptional<z.ZodNumber>;
      searchDefaultLimit: z.ZodOptional<z.ZodNumber>;
      maxSearchLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>;
    swarm: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      maxConcurrent: z.ZodOptional<z.ZodNumber>;
      maxChildrenPerGroup: z.ZodOptional<z.ZodNumber>;
      maxTotalPerGroup: z.ZodOptional<z.ZodNumber>;
      waitTimeoutSecondsMax: z.ZodOptional<z.ZodNumber>;
      defaultAgentId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>]>>;
    elevated: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      allowFrom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>>;
    }, z.core.$strict>>;
    exec: z.ZodOptional<z.ZodObject<{
      host: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        gateway: "gateway";
        node: "node";
        sandbox: "sandbox";
      }>>;
      mode: z.ZodOptional<z.ZodEnum<{
        allowlist: "allowlist";
        ask: "ask";
        auto: "auto";
        deny: "deny";
        full: "full";
      }>>;
      security: z.ZodOptional<z.ZodEnum<{
        allowlist: "allowlist";
        deny: "deny";
        full: "full";
      }>>;
      ask: z.ZodOptional<z.ZodEnum<{
        always: "always";
        off: "off";
        "on-miss": "on-miss";
      }>>;
      node: z.ZodOptional<z.ZodString>;
      pathPrepend: z.ZodOptional<z.ZodArray<z.ZodString>>;
      safeBins: z.ZodOptional<z.ZodArray<z.ZodString>>;
      strictInlineEval: z.ZodOptional<z.ZodBoolean>;
      commandHighlighting: z.ZodOptional<z.ZodBoolean>;
      grantExpiryDays: z.ZodOptional<z.ZodNumber>;
      safeBinTrustedDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      safeBinProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        minPositional: z.ZodOptional<z.ZodNumber>;
        maxPositional: z.ZodOptional<z.ZodNumber>;
        allowedValueFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deniedFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>>;
      reviewer: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
          primary: z.ZodOptional<z.ZodString>;
          fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>]>>;
        thinking: z.ZodOptional<z.ZodEnum<{
          high: "high";
          low: "low";
          max: "max";
          medium: "medium";
          minimal: "minimal";
          xhigh: "xhigh";
        }>>;
        fastMode: z.ZodOptional<z.ZodBoolean>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      backgroundMs: z.ZodOptional<z.ZodNumber>;
      approvalRunningNoticeMs: z.ZodOptional<z.ZodNumber>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      cleanupMs: z.ZodOptional<z.ZodNumber>;
      notifyOnExit: z.ZodOptional<z.ZodBoolean>;
      notifyOnExitEmptySuccess: z.ZodOptional<z.ZodBoolean>;
      applyPatch: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        workspaceOnly: z.ZodOptional<z.ZodBoolean>;
        allowModels: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    github: z.ZodOptional<z.ZodObject<{
      profileId: z.ZodString;
      kind: z.ZodOptional<z.ZodLiteral<"oauth">>;
      gitAuthor: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    fs: z.ZodOptional<z.ZodObject<{
      workspaceOnly: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    loopDetection: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    message: z.ZodOptional<z.ZodObject<{
      crossContext: z.ZodOptional<z.ZodObject<{
        allowWithinProvider: z.ZodOptional<z.ZodBoolean>;
        allowAcrossProviders: z.ZodOptional<z.ZodBoolean>;
        marker: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          prefix: z.ZodOptional<z.ZodString>;
          suffix: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      actions: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      broadcast: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    sandbox: z.ZodOptional<z.ZodObject<{
      tools: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
}, z.core.$strict>;
declare const ToolsSchema: z.ZodOptional<z.ZodObject<{
  profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
  allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
  byProvider: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
  }, z.core.$strict>>>;
  toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>>>;
  web: z.ZodOptional<z.ZodObject<{
    search: z.ZodOptional<z.ZodPreprocess<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      provider: z.ZodOptional<z.ZodString>;
      maxResults: z.ZodOptional<z.ZodNumber>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      cacheTtlMinutes: z.ZodOptional<z.ZodNumber>;
      openaiCodex: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"cached">, z.ZodLiteral<"live">]>>;
        allowedDomains: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[] | undefined, string[]>>>;
        contextSize: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"low">, z.ZodLiteral<"medium">, z.ZodLiteral<"high">]>>;
        userLocation: z.ZodOptional<z.ZodPipe<z.ZodObject<{
          country: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
          region: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
          city: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
          timezone: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
        }, z.core.$strict>, z.ZodTransform<{
          country?: string | undefined;
          region?: string | undefined;
          city?: string | undefined;
          timezone?: string | undefined;
        } | undefined, {
          country?: string | undefined;
          region?: string | undefined;
          city?: string | undefined;
          timezone?: string | undefined;
        }>>>;
      }, z.core.$strict>>;
    }, z.core.$catchall<z.ZodUnknown>>, unknown>>;
    fetch: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      provider: z.ZodOptional<z.ZodString>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      maxCharsCap: z.ZodOptional<z.ZodNumber>;
      maxResponseBytes: z.ZodOptional<z.ZodNumber>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      cacheTtlMinutes: z.ZodOptional<z.ZodNumber>;
      maxRedirects: z.ZodOptional<z.ZodNumber>;
      userAgent: z.ZodOptional<z.ZodString>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      readability: z.ZodOptional<z.ZodBoolean>;
      useTrustedEnvProxy: z.ZodOptional<z.ZodBoolean>;
      ssrfPolicy: z.ZodOptional<z.ZodObject<{
        dangerouslyAllowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
        allowRfc2544BenchmarkRange: z.ZodOptional<z.ZodBoolean>;
        allowIpv6UniqueLocalRange: z.ZodOptional<z.ZodBoolean>;
        allowedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
        blockedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  github: z.ZodOptional<z.ZodObject<{
    profileId: z.ZodString;
    kind: z.ZodOptional<z.ZodLiteral<"oauth">>;
    gitAuthor: z.ZodOptional<z.ZodObject<{
      name: z.ZodOptional<z.ZodString>;
      email: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  media: z.ZodOptional<z.ZodObject<{
    models: z.ZodOptional<z.ZodArray<z.ZodOptional<z.ZodObject<{
      prompt: z.ZodOptional<z.ZodString>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      language: z.ZodOptional<z.ZodString>;
      providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
      baseUrl: z.ZodOptional<z.ZodString>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      request: z.ZodOptional<z.ZodObject<{
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>>;
        auth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
          mode: z.ZodLiteral<"provider-default">;
        }, z.core.$strict>, z.ZodObject<{
          mode: z.ZodLiteral<"authorization-bearer">;
          token: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>;
        }, z.core.$strict>, z.ZodObject<{
          mode: z.ZodLiteral<"header">;
          headerName: z.ZodString;
          value: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>;
          prefix: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>]>>;
        proxy: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
          mode: z.ZodLiteral<"env-proxy">;
          tls: z.ZodOptional<z.ZodObject<{
            ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            serverName: z.ZodOptional<z.ZodString>;
            insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>, z.ZodObject<{
          mode: z.ZodLiteral<"explicit-proxy">;
          url: z.ZodString;
          tls: z.ZodOptional<z.ZodObject<{
            ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            serverName: z.ZodOptional<z.ZodString>;
            insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>]>>;
        tls: z.ZodOptional<z.ZodObject<{
          ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          serverName: z.ZodOptional<z.ZodString>;
          insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      provider: z.ZodOptional<z.ZodString>;
      model: z.ZodOptional<z.ZodString>;
      capabilities: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"image">, z.ZodLiteral<"audio">, z.ZodLiteral<"video">]>>>;
      type: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"provider">, z.ZodLiteral<"cli">]>>;
      command: z.ZodOptional<z.ZodString>;
      args: z.ZodOptional<z.ZodArray<z.ZodString>>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      maxBytes: z.ZodOptional<z.ZodNumber>;
      profile: z.ZodOptional<z.ZodString>;
      preferredProfile: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>>;
    concurrency: z.ZodOptional<z.ZodNumber>;
    image: z.ZodOptional<z.ZodOptional<z.ZodObject<{
      prompt: z.ZodOptional<z.ZodString>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      language: z.ZodOptional<z.ZodString>;
      providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
      baseUrl: z.ZodOptional<z.ZodString>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      request: z.ZodOptional<z.ZodObject<{
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>>;
        auth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
          mode: z.ZodLiteral<"provider-default">;
        }, z.core.$strict>, z.ZodObject<{
          mode: z.ZodLiteral<"authorization-bearer">;
          token: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>;
        }, z.core.$strict>, z.ZodObject<{
          mode: z.ZodLiteral<"header">;
          headerName: z.ZodString;
          value: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>;
          prefix: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>]>>;
        proxy: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
          mode: z.ZodLiteral<"env-proxy">;
          tls: z.ZodOptional<z.ZodObject<{
            ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            serverName: z.ZodOptional<z.ZodString>;
            insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>, z.ZodObject<{
          mode: z.ZodLiteral<"explicit-proxy">;
          url: z.ZodString;
          tls: z.ZodOptional<z.ZodObject<{
            ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            serverName: z.ZodOptional<z.ZodString>;
            insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>]>>;
        tls: z.ZodOptional<z.ZodObject<{
          ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          serverName: z.ZodOptional<z.ZodString>;
          insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      enabled: z.ZodOptional<z.ZodBoolean>;
      preferredModel: z.ZodOptional<z.ZodString>;
      scope: z.ZodOptional<z.ZodObject<{
        default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
        rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
          action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
          match: z.ZodOptional<z.ZodObject<{
            channel: z.ZodOptional<z.ZodString>;
            chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
            keyPrefix: z.ZodOptional<z.ZodString>;
            rawKeyPrefix: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>>;
        }, z.core.$strict>>>;
      }, z.core.$strict>>;
      maxBytes: z.ZodOptional<z.ZodNumber>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      attachments: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"all">]>>;
        maxAttachments: z.ZodOptional<z.ZodNumber>;
        prefer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"last">, z.ZodLiteral<"path">, z.ZodLiteral<"url">]>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>>;
    audio: z.ZodOptional<z.ZodOptional<z.ZodObject<{
      prompt: z.ZodOptional<z.ZodString>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      language: z.ZodOptional<z.ZodString>;
      providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
      baseUrl: z.ZodOptional<z.ZodString>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      request: z.ZodOptional<z.ZodObject<{
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>>;
        auth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
          mode: z.ZodLiteral<"provider-default">;
        }, z.core.$strict>, z.ZodObject<{
          mode: z.ZodLiteral<"authorization-bearer">;
          token: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>;
        }, z.core.$strict>, z.ZodObject<{
          mode: z.ZodLiteral<"header">;
          headerName: z.ZodString;
          value: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>;
          prefix: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>]>>;
        proxy: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
          mode: z.ZodLiteral<"env-proxy">;
          tls: z.ZodOptional<z.ZodObject<{
            ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            serverName: z.ZodOptional<z.ZodString>;
            insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>, z.ZodObject<{
          mode: z.ZodLiteral<"explicit-proxy">;
          url: z.ZodString;
          tls: z.ZodOptional<z.ZodObject<{
            ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            serverName: z.ZodOptional<z.ZodString>;
            insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>]>>;
        tls: z.ZodOptional<z.ZodObject<{
          ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          serverName: z.ZodOptional<z.ZodString>;
          insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      enabled: z.ZodOptional<z.ZodBoolean>;
      preferredModel: z.ZodOptional<z.ZodString>;
      scope: z.ZodOptional<z.ZodObject<{
        default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
        rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
          action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
          match: z.ZodOptional<z.ZodObject<{
            channel: z.ZodOptional<z.ZodString>;
            chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
            keyPrefix: z.ZodOptional<z.ZodString>;
            rawKeyPrefix: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>>;
        }, z.core.$strict>>>;
      }, z.core.$strict>>;
      maxBytes: z.ZodOptional<z.ZodNumber>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      attachments: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"all">]>>;
        maxAttachments: z.ZodOptional<z.ZodNumber>;
        prefer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"last">, z.ZodLiteral<"path">, z.ZodLiteral<"url">]>>;
      }, z.core.$strict>>;
      echoTranscript: z.ZodOptional<z.ZodBoolean>;
      echoFormat: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
    video: z.ZodOptional<z.ZodOptional<z.ZodObject<{
      prompt: z.ZodOptional<z.ZodString>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      language: z.ZodOptional<z.ZodString>;
      providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
      baseUrl: z.ZodOptional<z.ZodString>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      request: z.ZodOptional<z.ZodObject<{
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>>;
        auth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
          mode: z.ZodLiteral<"provider-default">;
        }, z.core.$strict>, z.ZodObject<{
          mode: z.ZodLiteral<"authorization-bearer">;
          token: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>;
        }, z.core.$strict>, z.ZodObject<{
          mode: z.ZodLiteral<"header">;
          headerName: z.ZodString;
          value: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>;
          prefix: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>]>>;
        proxy: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
          mode: z.ZodLiteral<"env-proxy">;
          tls: z.ZodOptional<z.ZodObject<{
            ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            serverName: z.ZodOptional<z.ZodString>;
            insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>, z.ZodObject<{
          mode: z.ZodLiteral<"explicit-proxy">;
          url: z.ZodString;
          tls: z.ZodOptional<z.ZodObject<{
            ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            serverName: z.ZodOptional<z.ZodString>;
            insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>]>>;
        tls: z.ZodOptional<z.ZodObject<{
          ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          serverName: z.ZodOptional<z.ZodString>;
          insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      enabled: z.ZodOptional<z.ZodBoolean>;
      preferredModel: z.ZodOptional<z.ZodString>;
      scope: z.ZodOptional<z.ZodObject<{
        default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
        rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
          action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
          match: z.ZodOptional<z.ZodObject<{
            channel: z.ZodOptional<z.ZodString>;
            chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
            keyPrefix: z.ZodOptional<z.ZodString>;
            rawKeyPrefix: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>>;
        }, z.core.$strict>>>;
      }, z.core.$strict>>;
      maxBytes: z.ZodOptional<z.ZodNumber>;
      maxChars: z.ZodOptional<z.ZodNumber>;
      attachments: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"all">]>>;
        maxAttachments: z.ZodOptional<z.ZodNumber>;
        prefer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"last">, z.ZodLiteral<"path">, z.ZodLiteral<"url">]>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
  links: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    scope: z.ZodOptional<z.ZodObject<{
      default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
      rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
        action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
        match: z.ZodOptional<z.ZodObject<{
          channel: z.ZodOptional<z.ZodString>;
          chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
          keyPrefix: z.ZodOptional<z.ZodString>;
          rawKeyPrefix: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>>>;
    }, z.core.$strict>>;
    maxLinks: z.ZodOptional<z.ZodNumber>;
    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
    models: z.ZodOptional<z.ZodArray<z.ZodObject<{
      type: z.ZodOptional<z.ZodLiteral<"cli">>;
      command: z.ZodString;
      args: z.ZodOptional<z.ZodArray<z.ZodString>>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
  sessions: z.ZodOptional<z.ZodObject<{
    visibility: z.ZodOptional<z.ZodEnum<{
      agent: "agent";
      all: "all";
      self: "self";
      tree: "tree";
    }>>;
  }, z.core.$strict>>;
  loopDetection: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  toolSearch: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    mode: z.ZodOptional<z.ZodEnum<{
      code: "code";
      directory: "directory";
      tools: "tools";
    }>>;
    codeTimeoutMs: z.ZodOptional<z.ZodNumber>;
    searchDefaultLimit: z.ZodOptional<z.ZodNumber>;
    maxSearchLimit: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>]>>;
  codeMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">, z.ZodObject<{
    enabled: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
    executor: z.ZodOptional<z.ZodEnum<{
      node: "node";
      quickjs: "quickjs";
    }>>;
    mode: z.ZodOptional<z.ZodLiteral<"only">>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    memoryLimitBytes: z.ZodOptional<z.ZodNumber>;
    maxOutputBytes: z.ZodOptional<z.ZodNumber>;
    maxSnapshotBytes: z.ZodOptional<z.ZodNumber>;
    maxPendingToolCalls: z.ZodOptional<z.ZodNumber>;
    snapshotTtlSeconds: z.ZodOptional<z.ZodNumber>;
    searchDefaultLimit: z.ZodOptional<z.ZodNumber>;
    maxSearchLimit: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>]>>;
  swarm: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    maxConcurrent: z.ZodOptional<z.ZodNumber>;
    maxChildrenPerGroup: z.ZodOptional<z.ZodNumber>;
    maxTotalPerGroup: z.ZodOptional<z.ZodNumber>;
    waitTimeoutSecondsMax: z.ZodOptional<z.ZodNumber>;
    defaultAgentId: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>]>>;
  message: z.ZodOptional<z.ZodObject<{
    crossContext: z.ZodOptional<z.ZodObject<{
      allowWithinProvider: z.ZodOptional<z.ZodBoolean>;
      allowAcrossProviders: z.ZodOptional<z.ZodBoolean>;
      marker: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        prefix: z.ZodOptional<z.ZodString>;
        suffix: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    actions: z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    broadcast: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  agentToAgent: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  elevated: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowFrom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>>;
  }, z.core.$strict>>;
  exec: z.ZodOptional<z.ZodObject<{
    host: z.ZodOptional<z.ZodEnum<{
      auto: "auto";
      gateway: "gateway";
      node: "node";
      sandbox: "sandbox";
    }>>;
    mode: z.ZodOptional<z.ZodEnum<{
      allowlist: "allowlist";
      ask: "ask";
      auto: "auto";
      deny: "deny";
      full: "full";
    }>>;
    security: z.ZodOptional<z.ZodEnum<{
      allowlist: "allowlist";
      deny: "deny";
      full: "full";
    }>>;
    ask: z.ZodOptional<z.ZodEnum<{
      always: "always";
      off: "off";
      "on-miss": "on-miss";
    }>>;
    node: z.ZodOptional<z.ZodString>;
    pathPrepend: z.ZodOptional<z.ZodArray<z.ZodString>>;
    safeBins: z.ZodOptional<z.ZodArray<z.ZodString>>;
    strictInlineEval: z.ZodOptional<z.ZodBoolean>;
    commandHighlighting: z.ZodOptional<z.ZodBoolean>;
    grantExpiryDays: z.ZodOptional<z.ZodNumber>;
    safeBinTrustedDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
    safeBinProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      minPositional: z.ZodOptional<z.ZodNumber>;
      maxPositional: z.ZodOptional<z.ZodNumber>;
      allowedValueFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deniedFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>;
    reviewer: z.ZodOptional<z.ZodObject<{
      model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        primary: z.ZodOptional<z.ZodString>;
        fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>]>>;
      thinking: z.ZodOptional<z.ZodEnum<{
        high: "high";
        low: "low";
        max: "max";
        medium: "medium";
        minimal: "minimal";
        xhigh: "xhigh";
      }>>;
      fastMode: z.ZodOptional<z.ZodBoolean>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    backgroundMs: z.ZodOptional<z.ZodNumber>;
    approvalRunningNoticeMs: z.ZodOptional<z.ZodNumber>;
    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
    cleanupMs: z.ZodOptional<z.ZodNumber>;
    notifyOnExit: z.ZodOptional<z.ZodBoolean>;
    notifyOnExitEmptySuccess: z.ZodOptional<z.ZodBoolean>;
    applyPatch: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      workspaceOnly: z.ZodOptional<z.ZodBoolean>;
      allowModels: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  fs: z.ZodOptional<z.ZodObject<{
    workspaceOnly: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  subagents: z.ZodOptional<z.ZodObject<{
    tools: z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  sandbox: z.ZodOptional<z.ZodObject<{
    tools: z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  sessions_spawn: z.ZodOptional<z.ZodObject<{
    attachments: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      maxTotalBytes: z.ZodOptional<z.ZodNumber>;
      maxFiles: z.ZodOptional<z.ZodNumber>;
      maxFileBytes: z.ZodOptional<z.ZodNumber>;
      retainOnSessionKeep: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  updatePlan: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>>;
//#endregion
//#region src/config/zod-schema.memory-search.d.ts
declare const MemorySearchSchema: z.ZodOptional<z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  rememberAcrossConversations: z.ZodOptional<z.ZodBoolean>;
  sources: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"memory">, z.ZodLiteral<"sessions">]>>>;
  extraPaths: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    path: z.ZodString;
    pattern: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>]>>>;
  multimodal: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    modalities: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"image">, z.ZodLiteral<"audio">, z.ZodLiteral<"all">]>>>;
    maxFileBytes: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  experimental: z.ZodOptional<z.ZodObject<{
    sessionMemory: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  provider: z.ZodOptional<z.ZodString>;
  remote: z.ZodOptional<z.ZodObject<{
    baseUrl: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    batch: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  fallback: z.ZodOptional<z.ZodString>;
  model: z.ZodOptional<z.ZodString>;
  inputType: z.ZodOptional<z.ZodString>;
  queryInputType: z.ZodOptional<z.ZodString>;
  documentInputType: z.ZodOptional<z.ZodString>;
  outputDimensionality: z.ZodOptional<z.ZodNumber>;
  local: z.ZodOptional<z.ZodObject<{
    modelPath: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  store: z.ZodOptional<z.ZodObject<{
    fts: z.ZodOptional<z.ZodObject<{
      tokenizer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"unicode61">, z.ZodLiteral<"trigram">]>>;
    }, z.core.$strict>>;
    vector: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      extensionPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  query: z.ZodOptional<z.ZodObject<{
    maxResults: z.ZodOptional<z.ZodNumber>;
    minScore: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  cache: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
type MemorySearchConfigInput = NonNullable<z.input<typeof MemorySearchSchema>>;
//#endregion
//#region src/config/types.memory.d.ts
/** Citation rendering mode for memory-injected context. */
type MemoryCitationsMode = "auto" | "on" | "off";
/** Top-level memory config block. */
type MemoryConfig = {
  citations?: MemoryCitationsMode;
  /** Shared embedding/search defaults. Per-agent overrides live under agents.entries.*.memory.search. */
  search?: MemorySearchConfig;
};
type MemorySearchConfig = Omit<MemorySearchConfigInput, "store"> & {
  /** Preserve legacy embedding-cache authoring accepted by Doctor migrations. */
  store?: NonNullable<MemorySearchConfigInput["store"]> & {
    cache?: {
      enabled?: boolean;
      maxEntries?: number;
    };
  };
};
//#endregion
//#region src/config/types.tools.d.ts
type SchemaToolsConfig = NonNullable<z.input<typeof ToolsSchema>>;
type ParsedToolsConfig = NonNullable<z.output<typeof ToolsSchema>>;
type SchemaMediaConfig = NonNullable<SchemaToolsConfig["media"]>;
type SchemaAudioConfig = NonNullable<SchemaMediaConfig["audio"]>;
type MediaUnderstandingScopeConfig = NonNullable<SchemaAudioConfig["scope"]>;
type MediaUnderstandingModelConfig = Omit<NonNullable<NonNullable<SchemaMediaConfig["models"]>[number]>, "request"> & {
  request?: ConfiguredProviderRequest;
};
type MediaUnderstandingConfig = Omit<SchemaAudioConfig, "scope" | "request"> & {
  scope?: MediaUnderstandingScopeConfig;
  request?: ConfiguredProviderRequest;
  /** Ordered model list (fallbacks in order). */
  models?: MediaUnderstandingModelConfig[];
};
/** Per-capability defaults and policy. Models live only in tools.media.models. */
type MediaUnderstandingCapabilityConfig = Omit<MediaUnderstandingConfig, "models">;
type LinkToolsConfig = Omit<NonNullable<SchemaToolsConfig["links"]>, "scope"> & {
  scope?: MediaUnderstandingScopeConfig;
};
type MediaToolsConfig = {
  /** Canonical model list for image/audio/video, selected by capability tags. */
  models?: MediaUnderstandingModelConfig[];
  /** Max concurrent media understanding runs. */
  concurrency?: number;
  image?: MediaUnderstandingCapabilityConfig;
  audio?: MediaUnderstandingCapabilityConfig;
  video?: MediaUnderstandingCapabilityConfig;
};
type ToolAllowDenyPolicyConfig = NonNullable<z.input<typeof ToolPolicySchema>>;
type GroupToolPolicyConfig = ToolAllowDenyPolicyConfig;
/**
 * Per-sender overrides.
 *
 * Prefer explicit key prefixes:
 * - channel:<channelId>:<senderId>
 * - id:<senderId>
 * - e164:<phone>
 * - username:<handle>
 * - name:<display-name>
 * - * (wildcard)
 *
 * Legacy unprefixed keys are supported for backward compatibility and are matched as senderId only.
 */
type GroupToolPolicyBySenderConfig = Record<string, GroupToolPolicyConfig>;
type ExecToolConfig = Omit<NonNullable<SchemaToolsConfig["exec"]>, "safeBinProfiles"> & {
  /** Preserve readonly authoring fixtures accepted by the safe-bin policy owner. */
  safeBinProfiles?: Record<string, SafeBinProfileFixture>;
};
type AgentToolsConfig = Omit<NonNullable<z.input<typeof AgentEntrySchema>["tools"]>, "toolsBySender" | "exec" | "elevated"> & {
  toolsBySender?: GroupToolPolicyBySenderConfig;
  exec?: ExecToolConfig;
  elevated?: {
    enabled?: boolean;
    allowFrom?: AgentElevatedAllowFromConfig;
  };
};
type ToolsConfig = Omit<SchemaToolsConfig, "toolsBySender" | "media" | "web" | "exec" | "elevated" | "links"> & {
  toolsBySender?: GroupToolPolicyBySenderConfig;
  media?: MediaToolsConfig;
  exec?: ExecToolConfig;
  elevated?: AgentToolsConfig["elevated"];
  links?: LinkToolsConfig;
  web?: NonNullable<ParsedToolsConfig["web"]>;
};
//#endregion
//#region src/config/types.tts.d.ts
type TtsConfigInput = NonNullable<z.input<typeof TtsConfigSchema>>;
type TtsProviderConfigInput = NonNullable<TtsConfigInput["providers"]>[string];
type TtsAutoMode = NonNullable<TtsConfigInput["auto"]>;
type TtsProviderConfig = Record<string, unknown> & Pick<TtsProviderConfigInput, "apiKey">;
type TtsProviderConfigMap = Record<string, TtsProviderConfig>;
type TtsPersonaConfigInput = NonNullable<TtsConfigInput["personas"]>[string];
type TtsPersonaConfig = Omit<TtsPersonaConfigInput, "providers"> & {
  providers?: TtsProviderConfigMap;
};
type TtsConfig = Omit<TtsConfigInput, "personas" | "providers"> & {
  personas?: Record<string, TtsPersonaConfig>;
  providers?: TtsProviderConfigMap;
};
//#endregion
//#region src/config/types.discord.d.ts
type DiscordChannelStreamingConfig = Omit<ChannelPreviewStreamingConfig, "progress"> & {
  progress?: ChannelStreamingProgressConfig;
};
type DiscordPluralKitConfig = {
  enabled?: boolean;
  token?: string;
};
type DiscordMentionAliasesConfig = Record<string, string>;
type DiscordDmConfig = {
  /** If false, ignore all incoming Discord DMs. Default: true. */
  enabled?: boolean;
  /** If true, allow group DMs (default: false). */
  groupEnabled?: boolean;
  /** Optional allowlist for group DM channels (ids or slugs). */
  groupChannels?: string[];
};
type DiscordGuildChannelConfig = {
  requireMention?: boolean;
  /**
   * If true, drop messages addressed to another identity by mention or bot reply, but not this
   * bot (not @everyone/@here).
   * Default: false.
   */
  ignoreOtherMentions?: boolean;
  /** Optional tool policy overrides for this channel. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  /** If specified, only load these skills for this channel. Omit = all skills; empty = no skills. */
  skills?: string[];
  /** If false, disable the bot for this channel. */
  enabled?: boolean;
  /** Optional allowlist for channel senders (ids or names). */
  users?: string[];
  /** Optional allowlist for channel senders by role ID. */
  roles?: string[];
  /** Optional system prompt snippet for this channel. */
  systemPrompt?: string;
  /** If false, omit thread starter context for this channel (default: true). */
  includeThreadStarter?: boolean;
  /** If true, automatically create a thread for each new message in this channel. */
  autoThread?: boolean;
  /** Archive duration (minutes) for auto-created threads. Valid values: 60, 1440, 4320, 10080. */
  autoArchiveDuration?: "60" | "1440" | "4320" | "10080" | 60 | 1440 | 4320 | 10080;
  /** Naming strategy for auto-created threads. "message" uses message text; "generated" renames with an LLM title. */
  autoThreadName?: "message" | "generated";
};
type DiscordReactionNotificationMode = "off" | "own" | "all" | "allowlist";
type DiscordGuildEntry = {
  slug?: string;
  requireMention?: boolean;
  /**
   * If true, drop messages addressed to another identity by mention or bot reply, but not this
   * bot (not @everyone/@here).
   * Default: false.
   */
  ignoreOtherMentions?: boolean;
  /** Optional tool policy overrides for this guild (used when channel override is missing). */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  /** Reaction notification mode (off|own|all|allowlist). Default: own. */
  reactionNotifications?: DiscordReactionNotificationMode;
  /** Optional allowlist for guild senders (ids or names). */
  users?: string[];
  /** Optional allowlist for guild senders by role ID. */
  roles?: string[];
  presenceEvents?: DiscordPresenceEventsConfig;
  channels?: Record<string, DiscordGuildChannelConfig>;
};
type DiscordActionConfig = {
  reactions?: boolean;
  stickers?: boolean;
  polls?: boolean;
  permissions?: boolean;
  messages?: boolean;
  threads?: boolean;
  pins?: boolean;
  search?: boolean;
  memberInfo?: boolean;
  roleInfo?: boolean;
  roles?: boolean;
  channelInfo?: boolean;
  voiceStatus?: boolean;
  events?: boolean;
  moderation?: boolean;
  emojiUploads?: boolean;
  stickerUploads?: boolean;
  channels?: boolean;
  /** Enable bot presence/activity changes (default: false). */
  presence?: boolean;
};
type DiscordIntentsConfig = {
  /**
   * Request the privileged Message Content intent. Disable only for mention-only guild operation;
   * Discord still includes content in DMs and messages that explicitly mention the bot. Default: true.
   */
  messageContent?: boolean;
  /** Enable Guild Presences privileged intent (requires Portal opt-in). Default: false. */
  presence?: boolean;
  /** Enable Guild Members privileged intent (requires Portal opt-in). Default: false. */
  guildMembers?: boolean;
  /** Enable Guild Voice States intent. Defaults to voice.enabled, unless explicitly set. */
  voiceStates?: boolean;
};
type DiscordVoiceAutoJoinConfig = {
  /** Guild ID that owns the voice channel. */
  guildId: string;
  /** Voice channel ID to join. */
  channelId: string;
  /** Join and remain connected only while at least one human is in the channel. Default: false. */
  whenOccupied?: boolean;
};
type DiscordVoiceAllowedChannelConfig = {
  /** Guild ID that owns the voice channel. */
  guildId: string;
  /** Voice channel ID allowed for realtime voice sessions. */
  channelId: string;
};
type DiscordVoiceMode = "stt-tts" | "agent-proxy" | "bidi";
type DiscordVoiceRealtimeConsultPolicy = "auto" | "always";
type DiscordVoiceRealtimeToolPolicy = "safe-read-only" | "owner" | "none";
type DiscordVoiceRealtimeBootstrapContextFile = "IDENTITY.md" | "USER.md" | "SOUL.md";
type DiscordVoiceRealtimeConfig = {
  /** Realtime voice provider id, for example "openai". */
  provider?: string;
  /** Provider realtime session model, for example "gpt-realtime-2.1". */
  model?: string;
  /** Provider realtime output voice name, for example "cedar". */
  speakerVoice?: string;
  /** Provider realtime output voice id. */
  speakerVoiceId?: string;
  /** System instructions passed to the realtime provider. */
  instructions?: string;
  /** Tool policy for bidi realtime consult calls. */
  toolPolicy?: DiscordVoiceRealtimeToolPolicy;
  /** Whether bidi should force the OpenClaw agent brain for every substantive turn. */
  consultPolicy?: DiscordVoiceRealtimeConsultPolicy;
  /** OpenAI agent-proxy wake-name policy. Unset adapts to the room: off for one human, on for two or more. True always requires; false never requires. */
  requireWakeName?: boolean;
  /** Wake names that allow OpenAI agent-proxy realtime Discord voice to respond when the gate is active. Defaults to the routed agent name plus OpenClaw, or the agent id plus OpenClaw. */
  wakeNames?: string[];
  /** Agent profile bootstrap files to include in realtime provider instructions. Defaults to IDENTITY.md, USER.md, and SOUL.md; set [] to disable. */
  bootstrapContextFiles?: DiscordVoiceRealtimeBootstrapContextFile[];
  /** Allow Discord speaker-start events to interrupt active realtime playback. */
  bargeIn?: boolean;
  /** Minimum assistant playback duration before a barge-in truncates audio. Default: 250ms; set 0 for immediate interruption. */
  minBargeInAudioEndMs?: number;
  /** Debounce window before buffered transcripts are sent to the OpenClaw agent. */
  debounceMs?: number;
  /** Provider-specific realtime voice config keyed by provider id. */
  providers?: Record<string, Record<string, unknown> | undefined>;
};
type DiscordVoiceAgentSessionConfig = {
  /** Which OpenClaw conversation should receive voice turns. Default: "voice". */
  mode?: "voice" | "target";
  /** Discord target used when mode is "target", for example "channel:123". */
  target?: string;
};
type DiscordVoiceConfig = {
  /** Enable Discord voice channel conversations (default: true). */
  enabled?: boolean;
  /** Voice conversation mode. Default: agent-proxy. */
  mode?: DiscordVoiceMode;
  /** Route voice turns through an existing OpenClaw Discord conversation. */
  agentSession?: DiscordVoiceAgentSessionConfig;
  /** Optional LLM model override for Discord voice channel responses. */
  model?: string;
  /** Realtime provider settings for agent-proxy or bidi modes. */
  realtime?: DiscordVoiceRealtimeConfig;
  /** Voice channels to join automatically, optionally only while occupied. */
  autoJoin?: DiscordVoiceAutoJoinConfig[];
  /** If false, configured followUsers are ignored without removing the saved user list. */
  followUsersEnabled?: boolean;
  /** Discord user IDs whose current voice channel the bot should follow. */
  followUsers?: string[];
  /** Voice channels the bot is allowed to join or remain in. Unset means any voice channel is allowed. */
  allowedChannels?: DiscordVoiceAllowedChannelConfig[];
  /** Enable/disable DAVE end-to-end encryption (default: true; Discord may require this). */
  daveEncryption?: boolean;
  /** Consecutive decrypt failures before DAVE session reinitialization (default: 24). */
  decryptionFailureTolerance?: number;
  /** Initial @discordjs/voice Ready wait in milliseconds (default: 30000). */
  connectTimeoutMs?: number;
  /** Grace period for Discord voice reconnect signalling after a disconnect (default: 15000). */
  reconnectGraceMs?: number;
  /** Silence grace after Discord reports a speaker ended before finalizing STT capture (default: 2000). */
  captureSilenceGraceMs?: number;
  /** Optional TTS overrides for Discord voice output. */
  tts?: TtsConfig;
};
type DiscordExecApprovalConfig = ChannelExecApprovalConfig<string> & {
  /** Delete approval DMs after approval, denial, or timeout. Default: false. */
  cleanupAfterResolve?: boolean;
};
type DiscordAgentComponentsConfig = {
  /** Enable agent-controlled interactive components (buttons, select menus). Default: true. */
  enabled?: boolean;
  /** Time in milliseconds before sent Discord component callbacks expire. Default: 1800000. */
  ttlMs?: number;
};
type DiscordThreadBindingsConfig = {
  /** Enable Discord thread binding features. Overrides session.threadBindings.enabled. */
  enabled?: boolean;
  /** Inactivity window in hours. Set 0 to disable. Default: 24. */
  idleHours?: number;
  /** Hard max age in hours. Set 0 to disable. Default: 0. */
  maxAgeHours?: number;
  /** Allow session spawns to create and bind Discord threads. Default: true. */
  spawnSessions?: boolean;
  /** Default context mode for native subagents. Default: fork. */
  defaultSpawnContext?: "isolated" | "fork";
};
type DiscordSlashCommandConfig = {
  /** Reply ephemerally (default: true). */
  ephemeral?: boolean;
};
type DiscordThreadConfig = {
  /** If true, Discord thread sessions inherit the parent channel transcript. Default: false. */
  inheritParent?: boolean;
};
type DiscordAutoPresenceConfig = {
  /** Enable automatic runtime/quota-based Discord presence updates. Default: false. */
  enabled?: boolean;
  /** Poll interval for evaluating runtime availability state (ms). Default: 30000. */
  intervalMs?: number;
  /** Minimum spacing between actual gateway presence updates (ms). Default: 15000. */
  minUpdateIntervalMs?: number;
  /** Optional custom status text while runtime is healthy; supports plain text. */
  /** Optional custom status text while runtime/quota state is degraded or unknown. */
  /** Optional custom status text while runtime detects quota/token exhaustion. */
  /** @deprecated Doctor-only legacy input. */
  exhaustedText?: string;
};
type DiscordAccountConfig = Omit<CommonChannelMessagingConfig<string[], string, string, DiscordChannelStreamingConfig>, "groupAllowFrom"> & ChannelBotInteractionConfig & ChannelReactionConfig<never, never, string> & {
  /** Post a room-specific introduction when joining a group. Default: true. */
  joinIntro?: boolean;
  /** Override native command registration for Discord (bool or "auto"). */
  commands?: ProviderCommandsConfig;
  token?: SecretInput;
  /** Optional Discord application/client ID. Set this when REST application lookup is blocked. */
  applicationId?: string;
  activities?: {
    clientSecret?: string;
    applicationId?: string;
  };
  /** HTTP(S) proxy URL for Discord gateway WebSocket connections. */
  proxy?: string;
  /**
   * Deterministic outbound @handle rewrites for known Discord users.
   * Keys are handles without the leading @; values are Discord user IDs.
   */
  mentionAliases?: DiscordMentionAliasesConfig;
  /**
   * Suppress Discord-generated link embeds for outbound messages. Default: true.
   * Explicit `embeds` payloads are still sent normally.
   */
  suppressEmbeds?: boolean;
  /**
   * Soft max line count per Discord message.
   * Discord clients can clip/collapse very tall messages; splitting by lines
   * keeps replies readable in-channel. Default: 17.
   */
  maxLinesPerMessage?: number;
  /** Per-action tool gating (default: true for all). */
  actions?: DiscordActionConfig;
  /** Thread session behavior. */
  thread?: DiscordThreadConfig;
  dm?: DiscordDmConfig;
  /** New per-guild config keyed by guild id or slug. */
  guilds?: Record<string, DiscordGuildEntry>;
  /** Exec approval forwarding configuration. */
  execApprovals?: DiscordExecApprovalConfig;
  /** Agent-controlled interactive components (buttons, select menus). */
  agentComponents?: DiscordAgentComponentsConfig;
  /** Discord UI customization (components, modals, etc.). */
  /** Slash command configuration. */
  slashCommand?: DiscordSlashCommandConfig;
  /** Thread binding lifecycle settings. */
  threadBindings?: DiscordThreadBindingsConfig;
  /** Privileged Gateway Intents (must also be enabled in Discord Developer Portal). */
  intents?: DiscordIntentsConfig;
  /** Voice channel conversation settings. */
  voice?: DiscordVoiceConfig;
  /** PluralKit identity resolution for proxied messages. */
  pluralkit?: DiscordPluralKitConfig;
  /** When to send ack reactions for this Discord account. Overrides messages.ackReactionScope. */
  ackReactionScope?: "group-mentions" | "group-all" | "direct" | "all" | "off" | "none";
  /** Bot activity status text (e.g. "Watching X"). */
  activity?: string;
  /** Bot status (online|dnd|idle|invisible). Defaults to online when presence is configured. */
  status?: "online" | "dnd" | "idle" | "invisible";
  /** Automatic runtime/quota presence signaling (status text + status mapping). */
  autoPresence?: DiscordAutoPresenceConfig;
  /** Activity type (0=Game, 1=Streaming, 2=Listening, 3=Watching, 4=Custom, 5=Competing). Defaults to 4 (Custom) when activity is set. */
  activityType?: 0 | 1 | 2 | 3 | 4 | 5;
  /** Streaming URL (Twitch/YouTube). Required when activityType=1. */
  activityUrl?: string;
  /**
   * Legacy compatibility block. Discord no longer enforces channel-owned
   * timeouts for queued inbound agent runs.
   */
  inboundWorker?: {
    /**
     * Ignored. Queued Discord agent runs are governed by the session/tool/runtime
     * lifecycle, not by Discord channel config.
     */
    runTimeoutMs?: number;
  };
};
type DiscordConfig = {
  /** Optional per-account Discord configuration (multi-account). */
  accounts?: Record<string, DiscordAccountConfig>;
  /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & DiscordAccountConfig;
//#endregion
//#region src/config/zod-schema.providers-googlechat.d.ts
declare const GoogleChatConfigSchema: z.ZodObject<{
  dmPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    allowlist: "allowlist";
    disabled: "disabled";
    open: "open";
    pairing: "pairing";
  }>>>;
  groupPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    allowlist: "allowlist";
    disabled: "disabled";
    open: "open";
  }>>>;
  name: z.ZodOptional<z.ZodString>;
  capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
  markdown: z.ZodOptional<z.ZodObject<{
    tables: z.ZodOptional<z.ZodEnum<{
      block: "block";
      bullets: "bullets";
      code: "code";
      off: "off";
    }>>;
  }, z.core.$strict>>;
  configWrites: z.ZodOptional<z.ZodBoolean>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  defaultTo: z.ZodOptional<z.ZodString>;
  groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
  contextVisibility: z.ZodOptional<z.ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  historyLimit: z.ZodOptional<z.ZodNumber>;
  dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
  dms: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    historyLimit: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>>>;
  textChunkLimit: z.ZodOptional<z.ZodNumber>;
  streaming: z.ZodOptional<z.ZodObject<{
    chunkMode: z.ZodOptional<z.ZodEnum<{
      length: "length";
      newline: "newline";
    }>>;
    block: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      coalesce: z.ZodOptional<z.ZodObject<{
        minChars: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        idleMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  heartbeatVisibility: z.ZodOptional<z.ZodObject<{
    showOk: z.ZodOptional<z.ZodBoolean>;
    showAlerts: z.ZodOptional<z.ZodBoolean>;
    useIndicator: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  healthMonitor: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  responsePrefix: z.ZodOptional<z.ZodString>;
  mediaMaxMb: z.ZodOptional<z.ZodNumber>;
  replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
  allowBots: z.ZodOptional<z.ZodBoolean>;
  botLoopProtection: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
    windowSeconds: z.ZodOptional<z.ZodNumber>;
    cooldownSeconds: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  dangerouslyAllowNameMatching: z.ZodOptional<z.ZodBoolean>;
  requireMention: z.ZodOptional<z.ZodBoolean>;
  groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    requireMention: z.ZodOptional<z.ZodBoolean>;
    botLoopProtection: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
      windowSeconds: z.ZodOptional<z.ZodNumber>;
      cooldownSeconds: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    users: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    systemPrompt: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>>>;
  serviceAccount: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>, z.ZodDiscriminatedUnion<[z.ZodObject<{
    source: z.ZodLiteral<"env">;
    provider: z.ZodString;
    id: z.ZodString;
  }, z.core.$strict>, z.ZodObject<{
    source: z.ZodLiteral<"file">;
    provider: z.ZodString;
    id: z.ZodString;
  }, z.core.$strict>, z.ZodObject<{
    source: z.ZodLiteral<"exec">;
    provider: z.ZodString;
    id: z.ZodString;
  }, z.core.$strict>, z.ZodObject<{
    source: z.ZodLiteral<"store">;
    provider: z.ZodString;
    id: z.ZodString;
  }, z.core.$strict>], "source">]>>;
  serviceAccountFile: z.ZodOptional<z.ZodString>;
  audienceType: z.ZodOptional<z.ZodEnum<{
    "app-url": "app-url";
    "project-number": "project-number";
  }>>;
  audience: z.ZodOptional<z.ZodString>;
  appPrincipal: z.ZodOptional<z.ZodString>;
  webhookPath: z.ZodOptional<z.ZodString>;
  webhookUrl: z.ZodOptional<z.ZodString>;
  botUser: z.ZodOptional<z.ZodString>;
  dm: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  typingIndicator: z.ZodOptional<z.ZodEnum<{
    message: "message";
    none: "none";
    reaction: "reaction";
  }>>;
  accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    markdown: z.ZodOptional<z.ZodObject<{
      tables: z.ZodOptional<z.ZodEnum<{
        block: "block";
        bullets: "bullets";
        code: "code";
        off: "off";
      }>>;
    }, z.core.$strict>>;
    configWrites: z.ZodOptional<z.ZodBoolean>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    dmPolicy: z.ZodOptional<z.ZodEnum<{
      allowlist: "allowlist";
      disabled: "disabled";
      open: "open";
      pairing: "pairing";
    }>>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    defaultTo: z.ZodOptional<z.ZodString>;
    groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    groupPolicy: z.ZodOptional<z.ZodEnum<{
      allowlist: "allowlist";
      disabled: "disabled";
      open: "open";
    }>>;
    contextVisibility: z.ZodOptional<z.ZodEnum<{
      all: "all";
      allowlist: "allowlist";
      allowlist_quote: "allowlist_quote";
    }>>;
    historyLimit: z.ZodOptional<z.ZodNumber>;
    dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
    dms: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      historyLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>>;
    textChunkLimit: z.ZodOptional<z.ZodNumber>;
    streaming: z.ZodOptional<z.ZodObject<{
      chunkMode: z.ZodOptional<z.ZodEnum<{
        length: "length";
        newline: "newline";
      }>>;
      block: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        coalesce: z.ZodOptional<z.ZodObject<{
          minChars: z.ZodOptional<z.ZodNumber>;
          maxChars: z.ZodOptional<z.ZodNumber>;
          idleMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    heartbeatVisibility: z.ZodOptional<z.ZodObject<{
      showOk: z.ZodOptional<z.ZodBoolean>;
      showAlerts: z.ZodOptional<z.ZodBoolean>;
      useIndicator: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    healthMonitor: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    responsePrefix: z.ZodOptional<z.ZodString>;
    mediaMaxMb: z.ZodOptional<z.ZodNumber>;
    replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
    allowBots: z.ZodOptional<z.ZodBoolean>;
    botLoopProtection: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
      windowSeconds: z.ZodOptional<z.ZodNumber>;
      cooldownSeconds: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    dangerouslyAllowNameMatching: z.ZodOptional<z.ZodBoolean>;
    requireMention: z.ZodOptional<z.ZodBoolean>;
    groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      requireMention: z.ZodOptional<z.ZodBoolean>;
      botLoopProtection: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
        windowSeconds: z.ZodOptional<z.ZodNumber>;
        cooldownSeconds: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      users: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
      systemPrompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>>;
    serviceAccount: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
    serviceAccountFile: z.ZodOptional<z.ZodString>;
    audienceType: z.ZodOptional<z.ZodEnum<{
      "app-url": "app-url";
      "project-number": "project-number";
    }>>;
    audience: z.ZodOptional<z.ZodString>;
    appPrincipal: z.ZodOptional<z.ZodString>;
    webhookPath: z.ZodOptional<z.ZodString>;
    webhookUrl: z.ZodOptional<z.ZodString>;
    botUser: z.ZodOptional<z.ZodString>;
    dm: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    typingIndicator: z.ZodOptional<z.ZodEnum<{
      message: "message";
      none: "none";
      reaction: "reaction";
    }>>;
  }, z.core.$strict>>>>;
  defaultAccount: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
//#endregion
//#region src/config/types.googlechat.d.ts
type GoogleChatSchemaInput = z.input<typeof GoogleChatConfigSchema>;
type GoogleChatAccountSchemaInput = Omit<GoogleChatSchemaInput, "accounts" | "defaultAccount">;
type GoogleChatGroupConfig = NonNullable<NonNullable<GoogleChatAccountSchemaInput["groups"]>[string]>;
type GoogleChatCompatibilityConfig = Pick<CommonChannelMessagingConfig, "dms" | "heartbeat">;
type GoogleChatAccountConfig = Omit<GoogleChatAccountSchemaInput, "groups" | "dms"> & GoogleChatCompatibilityConfig & {
  groups?: Record<string, GoogleChatGroupConfig>;
};
type GoogleChatConfig = Omit<GoogleChatSchemaInput, "accounts" | "groups" | "dms"> & GoogleChatAccountConfig & {
  accounts?: Record<string, GoogleChatAccountConfig>;
};
//#endregion
//#region src/config/types.imessage.d.ts
/** Private-API and helper actions the iMessage runtime may expose to agents. */
type IMessageActionConfig = {
  reactions?: boolean;
  edit?: boolean;
  unsend?: boolean;
  reply?: boolean;
  sendWithEffect?: boolean;
  renameGroup?: boolean;
  setGroupIcon?: boolean;
  addParticipant?: boolean;
  removeParticipant?: boolean;
  leaveGroup?: boolean;
  sendAttachment?: boolean;
  polls?: boolean;
};
/** Inbound tapback notification policy. */
type IMessageReactionNotificationMode = "off" | "own" | "all";
type IMessageSendTransport = "auto" | "bridge" | "applescript";
/** Per-account iMessage runtime/config shape. */
type IMessageAccountConfig = Omit<CommonChannelMessagingConfig, "mentionPatterns" | "replyToMode"> & ChannelReadReceiptConfig & ChannelReactionConfig<IMessageReactionNotificationMode> & {
  /** imsg CLI binary path (default: imsg). */
  cliPath?: string;
  /** Optional Messages db path override. */
  dbPath?: string;
  /** Remote SSH host token for SCP attachment fetches (`host` or `user@host`). */
  remoteHost?: string;
  /** Enable or disable private API message actions. */
  actions?: IMessageActionConfig;
  /** Optional default send service (imessage|sms|auto). */
  service?: "imessage" | "sms" | "auto";
  /** Preferred imsg RPC send transport. Default: auto. */
  sendTransport?: IMessageSendTransport;
  /** Optional default region (used when sending SMS). */
  region?: string;
  /** Include attachments + reactions in watch payloads. */
  includeAttachments?: boolean;
  /** Allowed local iMessage attachment roots (supports single-segment `*` wildcards). */
  attachmentRoots?: string[];
  /** Allowed remote iMessage attachment roots for SCP fetches (supports `*`). */
  remoteAttachmentRoots?: string[];
  /** Timeout for probe/RPC operations in milliseconds (default: 10000). */
  probeTimeoutMs?: number;
  /**
   * Merge consecutive same-sender DM rows from `chat.db` into a single agent
   * turn, so Apple's split-send (`<command> <URL>` arriving as two separate
   * rows several seconds apart) lands as one merged message. DM-only — group chats
   * keep instant per-message dispatch. Widens the default inbound debounce
   * window to 7000 ms when enabled without an explicit
   * `messages.inbound.byChannel.imessage` or global
   * `messages.inbound.debounceMs`. Default: `false`.
   */
  groups?: Record<string, {
    requireMention?: boolean;
    tools?: GroupToolPolicyConfig;
    toolsBySender?: GroupToolPolicyBySenderConfig;
    /**
     * Per-group system prompt. Injected into the agent's system prompt on
     * every turn that handles a message in that group. Matches the shape
     * already supported by Discord, Telegram, IRC, Slack, GoogleChat, and
     * other group-capable channels. The wildcard `groups["*"]` entry is
     * also honored.
     */
    systemPrompt?: string;
  }>;
  /**
   * Catchup: replay inbound messages that arrived in `chat.db` while the
   * gateway was offline (crash, restart, mac sleep). Disabled by default.
   * See https://github.com/openclaw/openclaw/issues/78649.
   */
  catchup?: {
    /** Master switch. Default `false`. */
    enabled?: boolean;
    /**
     * Maximum age of replayable messages in minutes. Messages older than
     * `now - maxAgeMinutes` are skipped even when the cursor is older.
     * Defense against runaway replay (the inverse of #62761). Default
     * `120` (2 h). Clamp `[1, 720]`.
     */
    maxAgeMinutes?: number;
    /**
     * Maximum messages to replay per catchup pass. Default `50`. Clamp
     * `[1, 500]`.
     */
    perRunLimit?: number;
    /**
     * On first run when no cursor exists, look back this many minutes.
     * Default `30`.
     */
    firstRunLookbackMinutes?: number;
    /**
     * Per-message retry ceiling. After this many consecutive failed
     * dispatch attempts against the same message guid, catchup logs a
     * `warn` and force-advances the cursor past the wedged message.
     * Default `10`. Clamp `[1, 1000]`.
     */
    maxFailureRetries?: number;
  };
};
/** Top-level iMessage config, with optional account map layered over default account fields. */
type IMessageConfig = {
  /** Optional per-account iMessage configuration (multi-account). */
  accounts?: Record<string, IMessageAccountConfig>;
  /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & IMessageAccountConfig;
//#endregion
//#region src/config/zod-schema.implicit-mentions.d.ts
declare const ChannelImplicitMentionsSchema: z.ZodObject<{
  replyToBot: z.ZodOptional<z.ZodBoolean>;
  quotedBot: z.ZodOptional<z.ZodBoolean>;
  threadParticipation: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
//#endregion
//#region src/config/types.implicit-mentions.d.ts
type ChannelImplicitMentionsConfig = z.input<typeof ChannelImplicitMentionsSchema>;
//#endregion
//#region src/config/types.irc.d.ts
type IrcAccountConfig = Omit<CommonChannelMessagingConfig, "mentionPatterns"> & {
  /** IRC server hostname (example: irc.example.com). */
  host?: string;
  /** IRC server port (default: 6697 with TLS, otherwise 6667). */
  port?: number;
  /** Use TLS for IRC connection (default: true). */
  tls?: boolean;
  /** IRC nickname to identify this bot. */
  nick?: string;
  /** IRC USER field username (defaults to nick). */
  username?: string;
  /** IRC USER field realname (default: OpenClaw). */
  realname?: string;
  /** Optional IRC server password (sensitive). */
  password?: string;
  /** Optional file path containing IRC server password. */
  passwordFile?: string;
  /** Optional NickServ identify/register settings. */
  nickserv?: {
    /** Enable NickServ identify/register after connect (default: enabled when password is set). */
    enabled?: boolean;
    /** NickServ service nick (default: NickServ). */
    service?: string;
    /** NickServ password (sensitive). */
    password?: string;
    /** Optional file path containing NickServ password. */
    passwordFile?: string;
    /** If true, send NickServ REGISTER on connect. */
    register?: boolean;
    /** Email used with NickServ REGISTER. */
    registerEmail?: string;
  };
  /** Auto-join channel list at connect (example: ["#openclaw"]). */
  channels?: string[];
  /** Outbound text chunk size (chars). Default: 350. */
  textChunkLimit?: number;
  groups?: Record<string, {
    requireMention?: boolean;
    tools?: GroupToolPolicyConfig;
    toolsBySender?: GroupToolPolicyBySenderConfig;
    allowFrom?: Array<string | number>;
    skills?: string[];
    enabled?: boolean;
    systemPrompt?: string;
  }>;
};
type IrcConfig = {
  /** Optional per-account IRC configuration (multi-account). */
  accounts?: Record<string, IrcAccountConfig>;
  /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & IrcAccountConfig;
//#endregion
//#region src/config/types.msteams.d.ts
type MSTeamsWebhookConfig = {
  /** Port for the webhook server. Default: 3978. */
  port?: number;
  /** Path for the messages endpoint. Default: /api/messages. */
  path?: string;
};
/** Teams SDK cloud environment. Public cloud is the default. */
type MSTeamsCloudName = "Public" | "USGov" | "USGovDoD" | "China";
/**
 * Bot Framework OAuth SSO configuration for Microsoft Teams.
 *
 * When enabled, the plugin handles the `signin/tokenExchange` and
 * `signin/verifyState` invoke activities that Teams sends after an
 * `oauthCard` is presented to the user. The exchanged user token is
 * persisted via the Bot Framework User Token service so downstream
 * tools can call Microsoft Graph with delegated permissions.
 *
 * Prerequisites (Azure portal):
 * - The bot's Azure AD (Entra) app is configured with an exposed API
 *   scope (for example `access_as_user`) and lists the Teams client
 *   IDs in `knownClientApplications`.
 * - The Bot Framework channel registration has an OAuth Connection
 *   Setting whose name matches `connectionName` below, pointing at
 *   the same Azure AD app.
 */
type MSTeamsSsoConfig = {
  /** If true, handle signin/tokenExchange + signin/verifyState invokes. Default: false. */
  enabled?: boolean;
  /**
   * Name of the OAuth connection configured on the Bot Framework channel
   * registration (Azure Bot resource). Required when `enabled` is true.
   */
  connectionName?: string;
};
/** Reply style for MS Teams messages. */
type MSTeamsReplyStyle = "thread" | "top-level";
/** Channel-level config for MS Teams. */
type MSTeamsChannelConfig = {
  /** Require @mention to respond. Default: true. */
  requireMention?: boolean;
  /** Optional tool policy overrides for this channel. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  /** Reply style: "thread" replies to the message, "top-level" posts a new message. */
  replyStyle?: MSTeamsReplyStyle;
};
/** Team-level config for MS Teams. */
type MSTeamsTeamConfig = {
  /** Default requireMention for channels in this team. */
  requireMention?: boolean;
  /** Default tool policy for channels in this team. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  /** Default reply style for channels in this team. */
  replyStyle?: MSTeamsReplyStyle;
  /** Per-channel overrides. Key is conversation ID (e.g., "19:...@thread.tacv2"). */
  channels?: Record<string, MSTeamsChannelConfig>;
};
type MSTeamsConfig = Omit<CommonChannelMessagingConfig<string[], string, string, ChannelPreviewStreamingConfig>, "mentionPatterns" | "name" | "replyToMode"> & Pick<ChannelBotInteractionConfig<boolean>, "dangerouslyAllowNameMatching"> & {
  /** Azure Bot App ID (from Azure Bot registration). */
  appId?: string;
  /** Azure Bot App Password / Client Secret. */
  appPassword?: SecretInput;
  /** Azure AD Tenant ID (for single-tenant bots). */
  tenantId?: string;
  /** Teams SDK cloud environment. Default: Public. */
  cloud?: MSTeamsCloudName;
  /**
   * Bot Connector service URL used by SDK proactive sends/edits/deletes.
   * Set with `cloud` for USGov/DoD SDK clouds; set alone for GCC.
   */
  serviceUrl?: string;
  /**
   * Authentication type.
   * - `"secret"` (default): uses `appPassword` (client secret).
   * - `"federated"`: uses workload identity / managed identity / certificate.
   */
  authType?: "secret" | "federated";
  /** Path to a PEM certificate file for certificate-based auth. Used when `authType` is `"federated"`. */
  certificatePath?: string;
  /** Certificate thumbprint (hex SHA-1) for certificate-based auth. */
  certificateThumbprint?: string;
  /** If `true`, use Azure Managed Identity (system- or user-assigned) instead of a certificate. */
  useManagedIdentity?: boolean;
  /** User-assigned managed-identity client ID. When omitted with `useManagedIdentity: true`, system-assigned identity is used. */
  managedIdentityClientId?: string;
  /** Webhook server configuration. */
  webhook?: MSTeamsWebhookConfig;
  /** Send native Teams typing indicator before replies. Default: true for groups/channels; DMs use informative stream status. */
  typingIndicator?: boolean;
  /**
   * Allowed host suffixes for inbound attachment downloads.
   * Use ["*"] to allow any host (not recommended).
   */
  mediaAllowHosts?: Array<string>;
  /**
   * Allowed host suffixes for attaching Authorization headers to inbound media retries.
   * Use specific hosts only; avoid multi-tenant suffixes.
   */
  mediaAuthAllowHosts?: Array<string>;
  /**
   * Query Graph for channel/group media when Bot Framework HTML omits file markers.
   * Requires the documented Graph permissions and adds one message lookup per
   * otherwise unresolved HTML activity. Default: false.
   */
  graphMediaFallback?: boolean;
  /** Default: require @mention to respond in channels/groups. */
  requireMention?: boolean;
  /** Default reply style: "thread" replies to the message, "top-level" posts a new message. */
  replyStyle?: MSTeamsReplyStyle;
  /** Per-team config. Key is team ID (from the /team/ URL path segment). */
  teams?: Record<string, MSTeamsTeamConfig>;
  /** SharePoint site ID for file uploads in group chats/channels (e.g., "contoso.sharepoint.com,guid1,guid2"). */
  sharePointSiteId?: string;
  /** Show a welcome Adaptive Card when the bot is added to a 1:1 chat. Default: true. */
  welcomeCard?: boolean;
  /** Custom prompt starter labels shown on the welcome card. */
  promptStarters?: string[];
  /** Show a welcome message when the bot is added to a group chat. Default: false. */
  groupWelcomeCard?: boolean;
  /** Enable the Teams feedback loop (thumbs up/down) on AI-generated messages. Default: true. */
  feedbackEnabled?: boolean;
  /** Enable background reflection when a user gives negative feedback. Default: true. */
  feedbackReflection?: boolean;
  /** Minimum interval (ms) between reflections per session. Default: 300000 (5 min). */
  feedbackReflectionCooldownMs?: number;
  /** Delegated auth settings for user-scoped Graph API actions (e.g., reactions). */
  delegatedAuth?: {
    /** Enable delegated auth (user sign-in for Graph actions that need user scope). */
    enabled?: boolean;
    /** Additional scopes to request during OAuth consent. */
    scopes?: string[];
  };
  /** Bot Framework OAuth SSO (signin/tokenExchange + signin/verifyState) settings. */
  sso?: MSTeamsSsoConfig;
};
//#endregion
//#region src/config/types.signal.d.ts
type SignalReactionNotificationMode = "off" | "own" | "all" | "allowlist";
type SignalReactionLevel = "off" | "ack" | "minimal" | "extensive";
type SignalTransportConfig = {
  kind: "managed-native";
  /** Optional signal-cli config directory path (passed as --config). */
  configPath?: string;
  /** Opt-in absolute POSIX UNIX socket path; excludes HTTP options. */
  socketPath?: string;
  /** Native daemon connection URL when it differs from the managed bind endpoint. */
  url?: string;
  /** HTTP host for the managed signal-cli daemon (default 127.0.0.1). */
  httpHost?: string;
  /** HTTP port for the managed signal-cli daemon (default 8080). */
  httpPort?: number;
  /** signal-cli binary path (default: signal-cli). */
  cliPath?: string;
  /** Max time to wait for signal-cli daemon startup (ms, cap 120000). */
  startupTimeoutMs?: number;
  receiveMode?: "on-start" | "manual";
  ignoreStories?: boolean;
} | {
  kind: "external-native";
  /** Base URL for an externally managed native signal-cli HTTP daemon. */
  url: string;
} | {
  kind: "container";
  /** Base URL for bbernhard/signal-cli-rest-api. */
  url: string;
};
type SignalGroupConfig = {
  requireMention?: boolean;
  /** Emit internal message hooks for mention-skipped group messages. */
  ingest?: boolean;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
};
type SignalAccountConfig = Omit<CommonChannelMessagingConfig, "mentionPatterns"> & ChannelReadReceiptConfig & ChannelReactionConfig<SignalReactionNotificationMode, SignalReactionLevel, never, true> & {
  /** Optional explicit E.164 account for signal-cli. */
  account?: string;
  /** Optional account UUID for signal-cli (used for loop protection). */
  accountUuid?: string;
  /** Concrete transport owned by this account. Defaults to managed native signal-cli. */
  transport?: SignalTransportConfig;
  /** Skip downloading inbound Signal attachments. */
  ignoreAttachments?: boolean;
  /** OpenClaw-side target aliases keyed by friendly name. */
  aliases?: Record<string, string>;
  /** Per-group overrides keyed by Signal group id (or "*"). */
  groups?: Record<string, SignalGroupConfig>;
  /** Optional per-chat-type native reply quoting overrides. */
  replyToModeByChatType?: Partial<Record<"direct" | "group", ReplyToMode>>;
  /** Action toggles for message tool capabilities. */
  actions?: {
    /** Enable/disable sending reactions via message tool (default: true). */
    reactions?: boolean;
  };
};
type SignalConfig = {
  /** Optional per-account Signal configuration (multi-account). */
  accounts?: Record<string, SignalAccountConfig>;
  /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & SignalAccountConfig;
//#endregion
//#region src/config/types.slack.d.ts
type SlackDmConfig = {
  /** If false, ignore all incoming Slack DMs. Default: true. */
  enabled?: boolean;
  /** If true, allow group DMs (default: false). */
  groupEnabled?: boolean;
  /** Optional allowlist for group DM channels (ids or slugs). */
  groupChannels?: Array<string | number>;
};
type SlackChannelConfig = {
  /** If false, disable the bot in this channel. */
  enabled?: boolean;
  /** Require mentioning the bot to trigger replies. */
  requireMention?: boolean;
  /**
   * Ignore room messages that mention another user or user group but not this bot.
   * Requires a resolved bot user ID. Default: false.
   */
  ignoreOtherMentions?: boolean;
  /** Override Slack reply/thread behavior for this channel. */
  replyToMode?: ReplyToMode;
  /** Optional tool policy overrides for this channel. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  /** Allow bot-authored messages to trigger replies (default: false). Set to "mentions" to only allow bot messages that @mention this bot. */
  allowBots?: boolean | "mentions";
  /** Sliding-window bot-pair loop guard for accepted bot-authored Slack messages. */
  botLoopProtection?: ChannelBotLoopProtectionConfig;
  /** Allowlist of users that can invoke the bot in this channel. */
  users?: Array<string | number>;
  /** Optional skill filter for this channel. */
  skills?: string[];
  /** Optional system prompt for this channel. */
  systemPrompt?: string;
  /** Slack presence polling and agent wake mode for this channel. */
  presenceEvents?: SlackPresenceEventsConfig;
};
type SlackPresenceEventsMode = "off" | "auto" | "on";
type SlackPresenceEventsConfig = {
  /** Presence wake mode. Default: off. */
  mode?: SlackPresenceEventsMode;
  /** Override the default presence-event guidance. Empty omits guidance. Maximum: 20,000 characters. */
  prompt?: string;
};
type SlackReactionNotificationMode = "off" | "own" | "all" | "allowlist";
type SlackStreamingProgressConfig = ChannelStreamingProgressConfig & {
  /** Slack progress presentation. "compact" keeps one editable text draft. Default: "card". */
  style?: "card" | "compact";
  /** Use Slack-native task cards for card-style progress. Default: true. */
  nativeTaskCards?: boolean;
};
type SlackChannelStreamingConfig = ChannelStreamingConfig<SlackStreamingProgressConfig>;
type SlackExecApprovalConfig = ChannelExecApprovalConfig;
type SlackCapabilitiesConfig = string[];
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
  /** Enable handling for the configured slash command (default: false). */
  enabled?: boolean;
  /** Slash command name (default: "openclaw"). */
  name?: string;
  /** Session key prefix for slash commands (default: "slack:slash"). */
  sessionPrefix?: string;
  /** Reply ephemerally (default: true). */
  ephemeral?: boolean;
};
type SlackThreadConfig = {
  /** Scope for thread history context (thread|channel). Default: thread. */
  historyScope?: "thread" | "channel";
  /** If true, thread sessions inherit the parent channel transcript. Default: false. */
  inheritParent?: boolean;
  /** Maximum number of thread messages to fetch as context when starting a new thread session (default: 20). Set to 0 to disable thread history fetching. */
  initialHistoryLimit?: number;
};
type SlackRelayConfig = {
  /** Full relay websocket URL, including the route path. */
  url?: string;
  /** Bearer token used to authenticate the gateway websocket to the Slack relay. */
  authToken?: SecretInput;
  /** Gateway destination id registered with openclaw-slack-router. */
  gatewayId?: string;
};
type SlackAccountConfig = Omit<CommonChannelMessagingConfig<SlackCapabilitiesConfig, string | number, string, SlackChannelStreamingConfig>, "groupAllowFrom"> & ChannelBotInteractionConfig & ChannelReactionConfig<SlackReactionNotificationMode, never, string, true> & {
  /** Post a room-specific introduction when joining a group. Default: true. */
  joinIntro?: boolean;
  /** @deprecated Doctor-only legacy input. */
  identity?: "bot" | "user";
  /** @deprecated Doctor-only legacy input. */
  socketMode?: {
    clientPingTimeout?: number;
    serverPingTimeout?: number;
    pingPongLoggingEnabled?: boolean;
  };
  /** Slack author identity. Default: bot. */
  postAs?: "bot" | "user";
  /** Slack connection mode (socket|http|relay). Default: socket. */
  mode?: "socket" | "http" | "relay";
  /** Slack SDK Socket Mode transport options. Ignored in HTTP mode. */
  /** Relay-delivered Slack event source. Used when mode is "relay". */
  relay?: SlackRelayConfig;
  /** Slack signing secret (required for HTTP mode). */
  signingSecret?: SecretInput;
  /** Slack Events API webhook path (default: /slack/events). */
  webhookPath?: string;
  /** Slack-native exec approval delivery + approver authorization. */
  execApprovals?: SlackExecApprovalConfig;
  /** Override native command registration for Slack (bool or "auto"). */
  commands?: ProviderCommandsConfig;
  botToken?: SecretInput;
  appToken?: SecretInput;
  userToken?: SecretInput;
  /** If true, restrict user token to read operations only. Default: true. */
  userTokenReadOnly?: boolean;
  /** Default mention requirement for channel messages (default: true). */
  requireMention?: boolean;
  /** Implicit mention policy for replies, quotes, and participated threads. */
  implicitMentions?: ChannelImplicitMentionsConfig;
  /** Pass through Slack chat.postMessage link unfurl control. Default: false. */
  unfurlLinks?: boolean;
  /** Pass through Slack chat.postMessage media unfurl control. Omitted by default. */
  unfurlMedia?: boolean;
  /**
   * Optional per-chat-type reply threading overrides.
   * Example: { direct: "all", group: "first", channel: "off" }.
   */
  replyToModeByChatType?: Partial<Record<"direct" | "group" | "channel", ReplyToMode>>;
  /** Thread session behavior. */
  thread?: SlackThreadConfig;
  /** Poll Slack presence and wake the routed agent on away-to-active transitions. Default: off. */
  presenceEvents?: SlackPresenceEventsConfig;
  actions?: SlackActionConfig;
  slashCommand?: SlackSlashCommandConfig;
  dm?: SlackDmConfig;
  channels?: Record<string, SlackChannelConfig>;
  /** Reaction emoji added while processing a reply (e.g. "hourglass_flowing_sand"). Removed when done. Useful as a typing indicator fallback when assistant mode is not enabled. */
  typingReaction?: string;
};
type SlackConfig = {
  /** Optional per-account Slack configuration (multi-account). */
  accounts?: Record<string, SlackAccountConfig>;
  /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & SlackAccountConfig;
//#endregion
//#region src/config/types.telegram.d.ts
type TelegramActionConfig = {
  reactions?: boolean;
  sendMessage?: boolean;
  /** Enable poll creation. Requires sendMessage to also be enabled. */
  poll?: boolean;
  deleteMessage?: boolean;
  editMessage?: boolean;
  /** Enable sticker actions (send and search). */
  sticker?: boolean;
  /** Enable forum topic creation. */
  createForumTopic?: boolean;
  /** Enable forum topic editing (rename / change icon). */
  editForumTopic?: boolean;
};
type TelegramThreadBindingsConfig = SessionThreadBindingsConfig;
type TelegramNetworkConfig = {
  /** Override Node's autoSelectFamily behavior (true = enable, false = disable). */
  autoSelectFamily?: boolean;
  /**
   * DNS result order for network requests ("ipv4first" | "verbatim").
   * Set to "ipv4first" to prioritize IPv4 addresses and work around IPv6 issues.
   * Default: "ipv4first" on Node 22+ to avoid common fetch failures.
   */
  dnsResultOrder?: "ipv4first" | "verbatim";
  /**
   * Dangerous opt-in for Telegram media downloads in trusted fake-IP or
   * transparent-proxy environments that resolve api.telegram.org to
   * private/internal/special-use addresses.
   */
  dangerouslyAllowPrivateNetwork?: boolean;
};
type TelegramInlineButtonsScope = "off" | "dm" | "group" | "all" | "allowlist";
type TelegramPreviewStreamingConfig = Omit<ChannelPreviewStreamingConfig, "preview"> & {
  preview?: ChannelStreamingPreviewConfig;
};
type TelegramExecApprovalConfig = ChannelExecApprovalConfig;
type TelegramCapabilitiesConfig = string[] | {
  inlineButtons?: TelegramInlineButtonsScope;
};
/** Custom command definition for Telegram bot menu. */
type TelegramCustomCommand = {
  /** Command name (without leading /). */
  command: string;
  /** Description shown in Telegram command menu. */
  description: string;
};
type TelegramAccountConfig = CommonChannelMessagingConfig<TelegramCapabilitiesConfig, string | number, string | number, TelegramPreviewStreamingConfig> & ChannelReactionConfig<"off" | "own" | "all", "off" | "ack" | "minimal" | "extensive", string> & {
  /** Post a room-specific introduction when joining a group. Default: true. */
  joinIntro?: boolean;
  /** Telegram-native exec approval delivery + approver authorization. */
  execApprovals?: TelegramExecApprovalConfig;
  /** Override native command registration for Telegram (bool or "auto"). */
  commands?: ProviderCommandsConfig;
  /** Custom commands to register in Telegram's command menu (merged with native). */
  customCommands?: TelegramCustomCommand[];
  botToken?: SecretInput;
  /** Path to a regular file containing the bot token; symlinks are rejected. */
  tokenFile?: string;
  groups?: Record<string, TelegramGroupConfig>;
  /** Per-DM configuration for Telegram DM topics (key is chat ID). */
  direct?: Record<string, TelegramDirectConfig>;
  /**
   * Use Telegram Bot API 10.3 rich messages for text sends and edits.
   * When false (default), falls back to HTML/plain text formatting via sendMessage.
   * Set to true to enable native tables, details, and rich media via sendRichMessage.
   * Note: Some Telegram clients (Web, Desktop, older mobile) do NOT support
   * sendRichMessage and will show "This message is not supported" errors.
   * Default: false.
   */
  richMessages?: boolean;
  /** Network transport overrides for Telegram. */
  network?: TelegramNetworkConfig;
  proxy?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  webhookPath?: string;
  /** Local webhook listener bind host (default: 127.0.0.1). */
  webhookHost?: string;
  /** Local webhook listener bind port (default: 8787). */
  webhookPort?: number;
  /** Path to the self-signed certificate (PEM) to upload to Telegram during webhook registration. */
  webhookCertPath?: string;
  /** Per-action tool gating (default: true for all). */
  actions?: TelegramActionConfig;
  /** Telegram thread/conversation binding overrides. */
  threadBindings?: TelegramThreadBindingsConfig;
  /**
   * Controls which user reactions trigger notifications:
   * - "off" (default): ignore all reactions
   * - "own": notify when users react to bot messages
   * - "all": notify agent of all reactions
   */
  /**
   * Controls agent's reaction capability:
   * - "off": agent cannot react
   * - "ack" (default): bot sends acknowledgment reactions (👀 while processing)
   * - "minimal": agent can react sparingly (guideline: 1 per 5-10 exchanges)
   * - "extensive": agent can react liberally when appropriate
   */
  /** Controls whether link previews are shown in outbound messages. Default: true. */
  linkPreview?: boolean;
  /** Send Telegram bot error replies silently (no notification sound). Default: false. */
  silentErrorReplies?: boolean;
  /** Controls outbound error reporting: always, once per cooldown window, or silent. */
  errorPolicy?: "always" | "once" | "silent";
  /**
   * Per-channel outbound response prefix override.
   *
   * Account values take precedence over the channel-level value.
   * Use `""` to explicitly disable a global prefix for this channel.
   * Use `"auto"` to derive `[{identity.name}]` from the routed agent.
   */
  /**
   * Per-channel ack reaction override.
   * Telegram expects unicode emoji (e.g., "👀") rather than shortcodes.
   */
  /** Custom Telegram Bot API root URL (e.g. "https://my-proxy.example.com" or a local Bot API server), not a /bot<TOKEN> endpoint. */
  apiRoot?: string;
  /** Trusted local filesystem roots for self-hosted Telegram Bot API absolute file_path values. */
  trustedLocalFileRoots?: string[];
  /** Auto-rename DM forum topics on first message using LLM. Default: true. */
  autoTopicLabel?: AutoTopicLabelConfig;
};
type TelegramTopicConfig = {
  requireMention?: boolean;
  /** Emit internal message hooks for mention-skipped topic messages. */
  ingest?: boolean;
  /** Per-topic override for group message policy (open|disabled|allowlist). */
  groupPolicy?: GroupPolicy;
  /** If specified, only load these skills for this topic. Omit = all skills; empty = no skills. */
  skills?: string[];
  /** If false, disable the bot for this topic. */
  enabled?: boolean;
  /** Optional allowlist for topic senders (numeric Telegram user IDs). */
  allowFrom?: Array<string | number>;
  /** Optional system prompt snippet for this topic. */
  systemPrompt?: string;
  /** If true, skip automatic voice-note transcription for mention detection in this topic. */
  disableAudioPreflight?: boolean;
  /** Route this topic to a specific agent (overrides group-level and binding routing). */
  agentId?: string;
  /** Controls outbound error reporting for this topic. */
  errorPolicy?: "always" | "once" | "silent";
};
type TelegramGroupConfig = {
  requireMention?: boolean;
  /** Emit internal message hooks for mention-skipped group messages. */
  ingest?: boolean;
  /** Per-group override for group message policy (open|disabled|allowlist). */
  groupPolicy?: GroupPolicy;
  /** Optional tool policy overrides for this group. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  /** If specified, only load these skills for this group (when no topic). Omit = all skills; empty = no skills. */
  skills?: string[];
  /** Per-topic configuration (key is message_thread_id as string, or "*" for topic defaults). */
  topics?: Record<string, TelegramTopicConfig>;
  /** If false, disable the bot for this group (and its topics). */
  enabled?: boolean;
  /** Optional allowlist for group senders (numeric Telegram user IDs). */
  allowFrom?: Array<string | number>;
  /** Optional system prompt snippet for this group. */
  systemPrompt?: string;
  /** If true, skip automatic voice-note transcription for mention detection in this group. */
  disableAudioPreflight?: boolean;
  /** Controls outbound error reporting for this group. */
  errorPolicy?: "always" | "once" | "silent";
};
/** Config for LLM-based auto-topic labeling. */
type AutoTopicLabelConfig = boolean | {
  enabled?: boolean;
  /** Custom prompt for LLM-based topic naming. */
  prompt?: string;
};
type TelegramDirectConfig = {
  /** Per-DM override for DM message policy (open|disabled|allowlist). */
  dmPolicy?: DmPolicy;
  /** Optional tool policy overrides for this DM. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  /** If specified, only load these skills for this DM (when no topic). Omit = all skills; empty = no skills. */
  skills?: string[];
  /** Per-topic configuration for DM topics (key is message_thread_id as string, or "*" for topic defaults). */
  topics?: Record<string, TelegramTopicConfig>;
  /** If false, disable the bot for this DM (and its topics). */
  enabled?: boolean;
  /** If true, require messages to be from a topic when topics are enabled. */
  requireTopic?: boolean;
  /** Optional allowlist for DM senders (numeric Telegram user IDs). */
  allowFrom?: Array<string | number>;
  /** Optional system prompt snippet for this DM. */
  systemPrompt?: string;
  /** Controls outbound error reporting for this DM. */
  errorPolicy?: "always" | "once" | "silent";
  /** Auto-rename DM forum topics on first message using LLM. Default: true. */
  autoTopicLabel?: AutoTopicLabelConfig;
};
type TelegramConfig = {
  /** Optional per-account Telegram configuration (multi-account). */
  accounts?: Record<string, TelegramAccountConfig>;
  /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & TelegramAccountConfig;
//#endregion
//#region src/config/zod-schema.providers-whatsapp.d.ts
declare const WhatsAppConfigSchema: z.ZodObject<{
  dmPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    allowlist: "allowlist";
    disabled: "disabled";
    open: "open";
    pairing: "pairing";
  }>>>;
  groupPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    allowlist: "allowlist";
    disabled: "disabled";
    open: "open";
  }>>>;
  capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
  markdown: z.ZodOptional<z.ZodObject<{
    tables: z.ZodOptional<z.ZodEnum<{
      block: "block";
      bullets: "bullets";
      code: "code";
      off: "off";
    }>>;
  }, z.core.$strict>>;
  configWrites: z.ZodOptional<z.ZodBoolean>;
  enabled: z.ZodOptional<z.ZodBoolean>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodString>>;
  defaultTo: z.ZodOptional<z.ZodString>;
  groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodString>>;
  mentionPatterns: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
    allowIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    denyIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  contextVisibility: z.ZodOptional<z.ZodEnum<{
    all: "all";
    allowlist: "allowlist";
    allowlist_quote: "allowlist_quote";
  }>>;
  historyLimit: z.ZodOptional<z.ZodNumber>;
  dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
  dms: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    historyLimit: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>>>;
  textChunkLimit: z.ZodOptional<z.ZodNumber>;
  streaming: z.ZodOptional<z.ZodObject<{
    chunkMode: z.ZodOptional<z.ZodEnum<{
      length: "length";
      newline: "newline";
    }>>;
    block: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      coalesce: z.ZodOptional<z.ZodObject<{
        minChars: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        idleMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  heartbeatVisibility: z.ZodOptional<z.ZodObject<{
    showOk: z.ZodOptional<z.ZodBoolean>;
    showAlerts: z.ZodOptional<z.ZodBoolean>;
    useIndicator: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  healthMonitor: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  responsePrefix: z.ZodOptional<z.ZodString>;
  replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
  sendReadReceipts: z.ZodOptional<z.ZodBoolean>;
  selfChatMode: z.ZodOptional<z.ZodBoolean>;
  groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    requireMention: z.ZodOptional<z.ZodBoolean>;
    tools: z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>>;
    systemPrompt: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>>>;
  direct: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    systemPrompt: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>>>;
  pluginHooks: z.ZodOptional<z.ZodObject<{
    messageReceived: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
    capabilities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    markdown: z.ZodOptional<z.ZodObject<{
      tables: z.ZodOptional<z.ZodEnum<{
        block: "block";
        bullets: "bullets";
        code: "code";
        off: "off";
      }>>;
    }, z.core.$strict>>;
    configWrites: z.ZodOptional<z.ZodBoolean>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    dmPolicy: z.ZodOptional<z.ZodEnum<{
      allowlist: "allowlist";
      disabled: "disabled";
      open: "open";
      pairing: "pairing";
    }>>;
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodString>>;
    defaultTo: z.ZodOptional<z.ZodString>;
    groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodString>>;
    groupPolicy: z.ZodOptional<z.ZodEnum<{
      allowlist: "allowlist";
      disabled: "disabled";
      open: "open";
    }>>;
    mentionPatterns: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
      allowIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
      denyIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    contextVisibility: z.ZodOptional<z.ZodEnum<{
      all: "all";
      allowlist: "allowlist";
      allowlist_quote: "allowlist_quote";
    }>>;
    historyLimit: z.ZodOptional<z.ZodNumber>;
    dmHistoryLimit: z.ZodOptional<z.ZodNumber>;
    dms: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      historyLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>>;
    textChunkLimit: z.ZodOptional<z.ZodNumber>;
    streaming: z.ZodOptional<z.ZodObject<{
      chunkMode: z.ZodOptional<z.ZodEnum<{
        length: "length";
        newline: "newline";
      }>>;
      block: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        coalesce: z.ZodOptional<z.ZodObject<{
          minChars: z.ZodOptional<z.ZodNumber>;
          maxChars: z.ZodOptional<z.ZodNumber>;
          idleMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    heartbeatVisibility: z.ZodOptional<z.ZodObject<{
      showOk: z.ZodOptional<z.ZodBoolean>;
      showAlerts: z.ZodOptional<z.ZodBoolean>;
      useIndicator: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    healthMonitor: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    responsePrefix: z.ZodOptional<z.ZodString>;
    replyToMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
    sendReadReceipts: z.ZodOptional<z.ZodBoolean>;
    selfChatMode: z.ZodOptional<z.ZodBoolean>;
    groups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
      requireMention: z.ZodOptional<z.ZodBoolean>;
      tools: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>>>;
      systemPrompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>>;
    direct: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      systemPrompt: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>>;
    pluginHooks: z.ZodOptional<z.ZodObject<{
      messageReceived: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    name: z.ZodOptional<z.ZodString>;
    authDir: z.ZodOptional<z.ZodString>;
    mediaMaxMb: z.ZodOptional<z.ZodNumber>;
    reactionLevel: z.ZodOptional<z.ZodEnum<{
      ack: "ack";
      extensive: "extensive";
      minimal: "minimal";
      off: "off";
    }>>;
  }, z.core.$strict>>>>;
  defaultAccount: z.ZodOptional<z.ZodString>;
  mediaMaxMb: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
  actions: z.ZodOptional<z.ZodObject<{
    reactions: z.ZodOptional<z.ZodBoolean>;
    sendMessage: z.ZodOptional<z.ZodBoolean>;
    polls: z.ZodOptional<z.ZodBoolean>;
    calls: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  reactionLevel: z.ZodOptional<z.ZodEnum<{
    ack: "ack";
    extensive: "extensive";
    minimal: "minimal";
    off: "off";
  }>>;
}, z.core.$strict>;
//#endregion
//#region src/config/types.whatsapp.d.ts
type WhatsAppSchemaInput = z.input<typeof WhatsAppConfigSchema>;
type WhatsAppSchemaAccountConfig = NonNullable<NonNullable<WhatsAppSchemaInput["accounts"]>[string]>;
type LegacyWhatsAppConfig = Pick<CommonChannelMessagingConfig, "dms" | "heartbeat"> & {
  /** @deprecated Doctor-only legacy input. */
  messagePrefix?: string;
};
type WhatsAppGroupSchemaInput = NonNullable<NonNullable<WhatsAppSchemaInput["groups"]>[string]>;
type WhatsAppGroupConfig = Omit<WhatsAppGroupSchemaInput, "toolsBySender"> & {
  systemPrompt?: string;
  toolsBySender?: GroupToolPolicyBySenderConfig;
};
type WhatsAppDirectConfig = NonNullable<NonNullable<WhatsAppSchemaInput["direct"]>[string]>;
type WhatsAppAckReactionConfig = {
  emoji?: string;
  direct?: boolean;
  group?: "always" | "mentions" | "never";
};
type WhatsAppNarrowedConfig = {
  groups?: Record<string, WhatsAppGroupConfig>;
  direct?: Record<string, WhatsAppDirectConfig>;
  ackReaction?: WhatsAppAckReactionConfig;
};
type WhatsAppAccountConfig = Omit<WhatsAppSchemaAccountConfig, keyof WhatsAppNarrowedConfig | keyof LegacyWhatsAppConfig> & WhatsAppNarrowedConfig & LegacyWhatsAppConfig;
type WhatsAppConfig = Omit<WhatsAppSchemaInput, "accounts" | keyof WhatsAppNarrowedConfig | keyof LegacyWhatsAppConfig> & WhatsAppNarrowedConfig & LegacyWhatsAppConfig & {
  accounts?: Record<string, WhatsAppAccountConfig>;
};
//#endregion
//#region src/config/types.channels.d.ts
type ChannelDefaultsConfig = {
  /** @deprecated Doctor-only legacy input. */
  heartbeat?: ChannelHeartbeatVisibilityConfig;
  /** Default group-chat admission policy inherited by channels that support groups. */
  groupPolicy?: GroupPolicy;
  /** Default history/context visibility inherited by channel configs. */
  contextVisibility?: ContextVisibilityMode;
  /** Default heartbeat visibility for all channels. */
  heartbeatVisibility?: ChannelHeartbeatVisibilityConfig;
  /** Default pair loop guard settings for channels that support bot loop protection. */
  botLoopProtection?: ChannelBotLoopProtectionConfig;
  /** Default implicit-mention policy inherited by supporting channels. */
  implicitMentions?: ChannelImplicitMentionsConfig;
};
/** Provider/channel/target model override map used by channel dispatch. Keys are channel-specific group IDs, thread IDs, channel names, or DM peer identifiers (see docs/gateway/config-channels.md). */
type ChannelModelByChannelConfig = Record<string, Record<string, string>>;
/** JSON-compatible open-world channel section for plugin ids unknown to core. */
type OpenWorldChannelConfig = ReturnType<typeof JSON.parse>;
interface ChannelsConfig {
  /** Shared defaults inherited by channel sections unless they override them. */
  defaults?: ChannelDefaultsConfig;
  /** Map provider -> channel id / DM peer id -> model override. See docs/gateway/config-channels.md for supported key forms. */
  modelByChannel?: ChannelModelByChannelConfig;
  discord?: DiscordConfig;
  googlechat?: GoogleChatConfig;
  imessage?: IMessageConfig;
  irc?: IrcConfig;
  msteams?: MSTeamsConfig;
  signal?: SignalConfig;
  slack?: SlackConfig;
  telegram?: TelegramConfig;
  whatsapp?: WhatsAppConfig;
  /**
   * Channel sections are plugin-owned and keyed by arbitrary channel ids.
   * Open-world config keeps SDK/plugin-owned sections ergonomic for dynamic ids.
   */
  [key: string]: OpenWorldChannelConfig;
}
//#endregion
//#region src/config/zod-schema.root-shape.d.ts
declare const OpenClawSchemaShape: {
  $schema: z.ZodOptional<z.ZodString>;
  meta: z.ZodOptional<z.ZodObject<{
    lastTouchedVersion: z.ZodOptional<z.ZodString>;
    migrations: z.ZodOptional<z.ZodObject<{
      modelPolicyAllowlist: z.ZodOptional<z.ZodLiteral<true>>;
      utilityModelSeparation: z.ZodOptional<z.ZodLiteral<true>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  env: z.ZodOptional<z.ZodObject<{
    shellEnv: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    vars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
  }, z.core.$strict>>;
  wizard: z.ZodOptional<z.ZodObject<{
    accessMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"full">, z.ZodLiteral<"guarded">]>>;
    appRecommendations: z.ZodOptional<z.ZodBoolean>;
    lastRunAt: z.ZodOptional<z.ZodString>;
    lastRunVersion: z.ZodOptional<z.ZodString>;
    lastRunCommit: z.ZodOptional<z.ZodString>;
    lastRunCommand: z.ZodOptional<z.ZodString>;
    lastRunMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"local">, z.ZodLiteral<"remote">]>>;
    securityAcknowledgedAt: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  diagnostics: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    flags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    otel: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      endpoint: z.ZodOptional<z.ZodString>;
      tracesEndpoint: z.ZodOptional<z.ZodString>;
      metricsEndpoint: z.ZodOptional<z.ZodString>;
      logsEndpoint: z.ZodOptional<z.ZodString>;
      protocol: z.ZodOptional<z.ZodLiteral<"http/protobuf">>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      serviceName: z.ZodOptional<z.ZodString>;
      metricNamePrefix: z.ZodOptional<z.ZodString>;
      traces: z.ZodOptional<z.ZodBoolean>;
      metrics: z.ZodOptional<z.ZodBoolean>;
      logs: z.ZodOptional<z.ZodBoolean>;
      logsExporter: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"otlp">, z.ZodLiteral<"stdout">, z.ZodLiteral<"both">]>>;
      sampleRate: z.ZodOptional<z.ZodNumber>;
      flushIntervalMs: z.ZodOptional<z.ZodNumber>;
      captureContent: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    cacheTrace: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  logging: z.ZodOptional<z.ZodObject<{
    level: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"silent">, z.ZodLiteral<"fatal">, z.ZodLiteral<"error">, z.ZodLiteral<"warn">, z.ZodLiteral<"info">, z.ZodLiteral<"debug">, z.ZodLiteral<"trace">]>>;
    file: z.ZodOptional<z.ZodString>;
    maxFileBytes: z.ZodOptional<z.ZodNumber>;
    consoleLevel: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"silent">, z.ZodLiteral<"fatal">, z.ZodLiteral<"error">, z.ZodLiteral<"warn">, z.ZodLiteral<"info">, z.ZodLiteral<"debug">, z.ZodLiteral<"trace">]>>;
    consoleStyle: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pretty">, z.ZodLiteral<"json">]>>;
    redactPatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
    audit: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      executionIdentity: z.ZodOptional<z.ZodBoolean>;
      messages: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"direct">, z.ZodLiteral<"all">]>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  update: z.ZodOptional<z.ZodObject<{
    channel: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"stable">, z.ZodLiteral<"extended-stable">, z.ZodLiteral<"beta">, z.ZodLiteral<"dev">]>>;
    checkOnStart: z.ZodOptional<z.ZodBoolean>;
    auto: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  telemetry: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    consentedAt: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  browser: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allowSystemProfileImport: z.ZodOptional<z.ZodBoolean>;
    evaluateEnabled: z.ZodOptional<z.ZodBoolean>;
    cdpUrl: z.ZodOptional<z.ZodString>;
    executablePath: z.ZodOptional<z.ZodString>;
    headless: z.ZodOptional<z.ZodBoolean>;
    noSandbox: z.ZodOptional<z.ZodBoolean>;
    attachOnly: z.ZodOptional<z.ZodBoolean>;
    defaultProfile: z.ZodOptional<z.ZodString>;
    snapshotDefaults: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodLiteral<"efficient">>;
    }, z.core.$strict>>;
    ssrfPolicy: z.ZodOptional<z.ZodObject<{
      dangerouslyAllowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
      allowRfc2544BenchmarkRange: z.ZodOptional<z.ZodBoolean>;
      allowIpv6UniqueLocalRange: z.ZodOptional<z.ZodBoolean>;
      allowedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
      blockedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    profiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      cdpPort: z.ZodOptional<z.ZodNumber>;
      cdpUrl: z.ZodOptional<z.ZodString>;
      userDataDir: z.ZodOptional<z.ZodString>;
      mcpCommand: z.ZodOptional<z.ZodString>;
      mcpArgs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      driver: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"openclaw">, z.ZodLiteral<"clawd">, z.ZodLiteral<"existing-session">, z.ZodLiteral<"extension">]>>;
      headless: z.ZodOptional<z.ZodBoolean>;
      executablePath: z.ZodOptional<z.ZodString>;
      attachOnly: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>>;
    extraArgs: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tabCleanup: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    extensionRelay: z.ZodOptional<z.ZodObject<{
      allowLegacyAuth: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  ui: z.ZodOptional<z.ZodObject<{
    seamColor: z.ZodOptional<z.ZodString>;
    prefs: z.ZodOptional<z.ZodObject<{
      theme: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"claw">, z.ZodLiteral<"knot">, z.ZodLiteral<"dash">, z.ZodLiteral<"absolutely">, z.ZodLiteral<"tide">, z.ZodLiteral<"beacon">, z.ZodLiteral<"phosphor">, z.ZodLiteral<"crt">, z.ZodLiteral<"manuscript">, z.ZodLiteral<"rose">, z.ZodLiteral<"miami">, z.ZodLiteral<"custom">]>>;
      themeMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"light">, z.ZodLiteral<"dark">, z.ZodLiteral<"system">]>>;
      accent: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"theme">, z.ZodString]>>;
      locale: z.ZodOptional<z.ZodString>;
      chatShowThinking: z.ZodOptional<z.ZodBoolean>;
      chatShowToolCalls: z.ZodOptional<z.ZodBoolean>;
      chatPersistCommentary: z.ZodOptional<z.ZodBoolean>;
      chatSendShortcut: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"enter">, z.ZodLiteral<"modifier-enter">]>>;
      chatFollowUpMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"queue">]>>;
      sidebarEntries: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  secrets: z.ZodOptional<z.ZodObject<{
    egressProxy: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      allowedHosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
      bypassHosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    providers: z.ZodOptional<z.ZodObject<{}, z.core.$catchall<z.ZodUnion<readonly [z.ZodObject<{
      source: z.ZodLiteral<"env">;
      allowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      path: z.ZodString;
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"singleValue">, z.ZodLiteral<"json">]>>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
      maxBytes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodUnion<readonly [z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      command: z.ZodString;
      args: z.ZodOptional<z.ZodArray<z.ZodString>>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
      noOutputTimeoutMs: z.ZodOptional<z.ZodNumber>;
      maxOutputBytes: z.ZodOptional<z.ZodNumber>;
      jsonOnly: z.ZodOptional<z.ZodBoolean>;
      env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      passEnv: z.ZodOptional<z.ZodArray<z.ZodString>>;
      trustedDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      pluginIntegration: z.ZodObject<{
        pluginId: z.ZodString;
        integrationId: z.ZodString;
      }, z.core.$strict>;
    }, z.core.$strict>]>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
    }, z.core.$strict>]>>>>;
    defaults: z.ZodOptional<z.ZodObject<{
      env: z.ZodOptional<z.ZodString>;
      file: z.ZodOptional<z.ZodString>;
      exec: z.ZodOptional<z.ZodString>;
      store: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  auth: z.ZodOptional<z.ZodObject<{
    profiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      provider: z.ZodString;
      mode: z.ZodUnion<readonly [z.ZodLiteral<"api_key">, z.ZodLiteral<"aws-sdk">, z.ZodLiteral<"oauth">, z.ZodLiteral<"token">]>;
      email: z.ZodOptional<z.ZodString>;
      displayName: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
    order: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
  }, z.core.$strict>>;
  accessGroups: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"discord.channelAudience">;
    guildId: z.ZodString;
    channelId: z.ZodString;
    membership: z.ZodOptional<z.ZodLiteral<"canViewChannel">>;
  }, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"message.senders">;
    members: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>;
  }, z.core.$strict>], "type">>>;
  acp: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    dispatch: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    backend: z.ZodOptional<z.ZodString>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    defaultAgent: z.ZodOptional<z.ZodString>;
    allowedAgents: z.ZodOptional<z.ZodArray<z.ZodString>>;
    stream: z.ZodOptional<z.ZodObject<{
      repeatSuppression: z.ZodOptional<z.ZodBoolean>;
      deliveryMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"live">, z.ZodLiteral<"final_only">]>>;
      tagVisibility: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
    }, z.core.$strict>>;
    runtime: z.ZodOptional<z.ZodObject<{
      installCommand: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  models: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"merge">, z.ZodLiteral<"replace">]>>;
    providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      baseUrl: z.ZodOptional<z.ZodString>;
      apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
      auth: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"api-key">, z.ZodLiteral<"aws-sdk">, z.ZodLiteral<"oauth">, z.ZodLiteral<"token">]>>;
      api: z.ZodOptional<z.ZodEnum<{
        "anthropic-messages": "anthropic-messages";
        "azure-openai-responses": "azure-openai-responses";
        "bedrock-converse-stream": "bedrock-converse-stream";
        "github-copilot": "github-copilot";
        "google-generative-ai": "google-generative-ai";
        "google-vertex": "google-vertex";
        ollama: "ollama";
        "openai-chatgpt-responses": "openai-chatgpt-responses";
        "openai-completions": "openai-completions";
        "openai-responses": "openai-responses";
        "pi-messages": "pi-messages";
      }>>;
      maxTokens: z.ZodOptional<z.ZodNumber>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      region: z.ZodOptional<z.ZodString>;
      injectNumCtxForOpenAICompat: z.ZodOptional<z.ZodBoolean>;
      params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      agentRuntime: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      localService: z.ZodOptional<z.ZodObject<{
        command: z.ZodString;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        cwd: z.ZodOptional<z.ZodString>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        healthUrl: z.ZodOptional<z.ZodString>;
        readyTimeoutMs: z.ZodOptional<z.ZodNumber>;
        idleStopMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>>;
      authHeader: z.ZodOptional<z.ZodBoolean>;
      request: z.ZodOptional<z.ZodObject<{
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>>;
        auth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
          mode: z.ZodLiteral<"provider-default">;
        }, z.core.$strict>, z.ZodObject<{
          mode: z.ZodLiteral<"authorization-bearer">;
          token: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>;
        }, z.core.$strict>, z.ZodObject<{
          mode: z.ZodLiteral<"header">;
          headerName: z.ZodString;
          value: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>;
          prefix: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>]>>;
        proxy: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
          mode: z.ZodLiteral<"env-proxy">;
          tls: z.ZodOptional<z.ZodObject<{
            ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            serverName: z.ZodOptional<z.ZodString>;
            insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>, z.ZodObject<{
          mode: z.ZodLiteral<"explicit-proxy">;
          url: z.ZodString;
          tls: z.ZodOptional<z.ZodObject<{
            ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            serverName: z.ZodOptional<z.ZodString>;
            insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>]>>;
        tls: z.ZodOptional<z.ZodObject<{
          ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          serverName: z.ZodOptional<z.ZodString>;
          insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        allowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      models: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        api: z.ZodOptional<z.ZodEnum<{
          "anthropic-messages": "anthropic-messages";
          "azure-openai-responses": "azure-openai-responses";
          "bedrock-converse-stream": "bedrock-converse-stream";
          "github-copilot": "github-copilot";
          "google-generative-ai": "google-generative-ai";
          "google-vertex": "google-vertex";
          ollama: "ollama";
          "openai-chatgpt-responses": "openai-chatgpt-responses";
          "openai-completions": "openai-completions";
          "openai-responses": "openai-responses";
          "pi-messages": "pi-messages";
        }>>;
        baseUrl: z.ZodOptional<z.ZodString>;
        reasoning: z.ZodOptional<z.ZodBoolean>;
        input: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"text">, z.ZodLiteral<"image">, z.ZodLiteral<"video">, z.ZodLiteral<"audio">]>>>;
        cost: z.ZodOptional<z.ZodObject<{
          input: z.ZodOptional<z.ZodNumber>;
          output: z.ZodOptional<z.ZodNumber>;
          cacheRead: z.ZodOptional<z.ZodNumber>;
          cacheWrite: z.ZodOptional<z.ZodNumber>;
          tieredPricing: z.ZodOptional<z.ZodArray<z.ZodObject<{
            input: z.ZodNumber;
            output: z.ZodNumber;
            cacheRead: z.ZodNumber;
            cacheWrite: z.ZodNumber;
            range: z.ZodUnion<readonly [z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>, z.ZodTuple<[z.ZodNumber], null>]>;
          }, z.core.$strict>>>;
        }, z.core.$strict>>;
        contextWindow: z.ZodOptional<z.ZodNumber>;
        contextTokens: z.ZodOptional<z.ZodNumber>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        thinkingLevelMap: z.ZodOptional<z.ZodObject<{
          off: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          minimal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          low: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          medium: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          high: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          xhigh: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          max: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>>;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        agentRuntime: z.ZodOptional<z.ZodObject<{
          id: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        compat: z.ZodOptional<z.ZodObject<{
          supportsStore: z.ZodOptional<z.ZodBoolean>;
          supportsPromptCacheKey: z.ZodOptional<z.ZodBoolean>;
          supportsResponsesContinuation: z.ZodOptional<z.ZodBoolean>;
          supportsDeveloperRole: z.ZodOptional<z.ZodBoolean>;
          supportsReasoningEffort: z.ZodOptional<z.ZodBoolean>;
          supportsTemperature: z.ZodOptional<z.ZodBoolean>;
          supportsInstructions: z.ZodOptional<z.ZodBoolean>;
          supportsUsageInStreaming: z.ZodOptional<z.ZodBoolean>;
          supportsTools: z.ZodOptional<z.ZodBoolean>;
          codeMode: z.ZodOptional<z.ZodEnum<{
            capable: "capable";
            preferred: "preferred";
          }>>;
          supportsStrictMode: z.ZodOptional<z.ZodBoolean>;
          supportsJsonSchemaResponseFormat: z.ZodOptional<z.ZodBoolean>;
          requiresStringContent: z.ZodOptional<z.ZodBoolean>;
          strictMessageKeys: z.ZodOptional<z.ZodBoolean>;
          visibleReasoningDetailTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
          supportedReasoningEfforts: z.ZodOptional<z.ZodArray<z.ZodString>>;
          reasoningEffortMap: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
          maxTokensField: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"max_completion_tokens">, z.ZodLiteral<"max_tokens">]>>;
          thinkingFormat: z.ZodOptional<z.ZodEnum<{
            deepseek: "deepseek";
            openai: "openai";
            openrouter: "openrouter";
            qwen: "qwen";
            "qwen-chat-template": "qwen-chat-template";
            together: "together";
            zai: "zai";
          }>>;
          requiresToolResultName: z.ZodOptional<z.ZodBoolean>;
          requiresAssistantAfterToolResult: z.ZodOptional<z.ZodBoolean>;
          requiresThinkingAsText: z.ZodOptional<z.ZodBoolean>;
          requiresReasoningContentOnAssistantMessages: z.ZodOptional<z.ZodBoolean>;
          toolSchemaProfile: z.ZodOptional<z.ZodString>;
          unsupportedToolSchemaKeywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
          toolCallArgumentsEncoding: z.ZodOptional<z.ZodString>;
          requiresOpenAiAnthropicToolPayload: z.ZodOptional<z.ZodBoolean>;
          openRouterRouting: z.ZodOptional<z.ZodObject<{
            allow_fallbacks: z.ZodOptional<z.ZodBoolean>;
            require_parameters: z.ZodOptional<z.ZodBoolean>;
            data_collection: z.ZodOptional<z.ZodEnum<{
              allow: "allow";
              deny: "deny";
            }>>;
            zdr: z.ZodOptional<z.ZodBoolean>;
            enforce_distillable_text: z.ZodOptional<z.ZodBoolean>;
            order: z.ZodOptional<z.ZodArray<z.ZodString>>;
            only: z.ZodOptional<z.ZodArray<z.ZodString>>;
            ignore: z.ZodOptional<z.ZodArray<z.ZodString>>;
            quantizations: z.ZodOptional<z.ZodArray<z.ZodString>>;
            sort: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
              by: z.ZodOptional<z.ZodString>;
              partition: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strict>]>>;
            max_price: z.ZodOptional<z.ZodObject<{
              prompt: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
              completion: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
              image: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
              audio: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
              request: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            }, z.core.$strict>>;
            preferred_min_throughput: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodObject<{
              p50: z.ZodOptional<z.ZodNumber>;
              p75: z.ZodOptional<z.ZodNumber>;
              p90: z.ZodOptional<z.ZodNumber>;
              p99: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>]>>;
            preferred_max_latency: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodObject<{
              p50: z.ZodOptional<z.ZodNumber>;
              p75: z.ZodOptional<z.ZodNumber>;
              p90: z.ZodOptional<z.ZodNumber>;
              p99: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>]>>;
          }, z.core.$strict>>;
          vercelGatewayRouting: z.ZodOptional<z.ZodObject<{
            only: z.ZodOptional<z.ZodArray<z.ZodString>>;
            order: z.ZodOptional<z.ZodArray<z.ZodString>>;
          }, z.core.$strict>>;
          zaiToolStream: z.ZodOptional<z.ZodBoolean>;
          cacheControlFormat: z.ZodOptional<z.ZodLiteral<"anthropic">>;
          sendSessionAffinityHeaders: z.ZodOptional<z.ZodBoolean>;
          sendSessionIdHeader: z.ZodOptional<z.ZodBoolean>;
          supportsEagerToolInputStreaming: z.ZodOptional<z.ZodBoolean>;
          supportsLongCacheRetention: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        mediaInput: z.ZodOptional<z.ZodObject<{
          image: z.ZodOptional<z.ZodObject<{
            maxBytes: z.ZodOptional<z.ZodNumber>;
            maxPixels: z.ZodOptional<z.ZodNumber>;
            maxSidePx: z.ZodOptional<z.ZodNumber>;
            preferredSidePx: z.ZodOptional<z.ZodNumber>;
            tokenMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"tile">, z.ZodLiteral<"detail">, z.ZodLiteral<"provider">]>>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
        metadataSource: z.ZodOptional<z.ZodLiteral<"models-add">>;
      }, z.core.$strict>>>;
    }, z.core.$strict>>>;
    catalogRefresh: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      url: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  nodeHost: z.ZodOptional<z.ZodObject<{
    autoUpdate: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    agentRuns: z.ZodOptional<z.ZodObject<{
      claude: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    workerRuns: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      capacity: z.ZodOptional<z.ZodNumber>;
      isolation: z.ZodOptional<z.ZodEnum<{
        container: "container";
        none: "none";
      }>>;
      containerImage: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    browserProxy: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      allowProfiles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    mcp: z.ZodOptional<z.ZodObject<{
      servers: z.ZodOptional<z.ZodPreprocess<z.ZodRecord<z.ZodType<string, unknown, z.core.$ZodTypeInternals<string, unknown>>, z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        command: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
        cwd: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        transport: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"stdio">, z.ZodLiteral<"sse">, z.ZodLiteral<"streamable-http">]>>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
        connectionTimeoutMs: z.ZodOptional<z.ZodNumber>;
        requestTimeoutMs: z.ZodOptional<z.ZodNumber>;
        supportsParallelToolCalls: z.ZodOptional<z.ZodBoolean>;
        auth: z.ZodOptional<z.ZodLiteral<"oauth">>;
        oauth: z.ZodOptional<z.ZodObject<{
          identity: z.ZodOptional<z.ZodEnum<{
            "per-requester": "per-requester";
            shared: "shared";
          }>>;
          authProfileId: z.ZodOptional<z.ZodString>;
          scope: z.ZodOptional<z.ZodString>;
          redirectUrl: z.ZodOptional<z.ZodString>;
          clientMetadataUrl: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        sslVerify: z.ZodOptional<z.ZodBoolean>;
        clientCert: z.ZodOptional<z.ZodString>;
        clientKey: z.ZodOptional<z.ZodString>;
        toolFilter: z.ZodOptional<z.ZodObject<{
          include: z.ZodOptional<z.ZodArray<z.ZodString>>;
          exclude: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        codex: z.ZodOptional<z.ZodObject<{
          agents: z.ZodOptional<z.ZodArray<z.ZodString>>;
          defaultToolsApprovalMode: z.ZodOptional<z.ZodEnum<{
            approve: "approve";
            auto: "auto";
            prompt: "prompt";
          }>>;
        }, z.core.$strict>>;
      }, z.core.$catchall<z.ZodUnknown>>>, unknown>>;
    }, z.core.$strict>>;
    skills: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  agents: z.ZodOptional<z.ZodObject<{
    ownership: z.ZodOptional<z.ZodLiteral<"explicit">>;
    defaults: z.ZodOptional<z.ZodLazy<z.ZodOptional<z.ZodObject<{
      params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        primary: z.ZodOptional<z.ZodString>;
        fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>]>>;
      modelSelectionScope: z.ZodOptional<z.ZodEnum<{
        agent: "agent";
        global: "global";
        session: "session";
      }>>;
      utilityModel: z.ZodOptional<z.ZodString>;
      decisionModel: z.ZodOptional<z.ZodString>;
      imageModel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        primary: z.ZodOptional<z.ZodString>;
        fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>]>>;
      mediaModels: z.ZodOptional<z.ZodObject<{
        image: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
          primary: z.ZodOptional<z.ZodString>;
          fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>]>>;
        video: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
          primary: z.ZodOptional<z.ZodString>;
          fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>]>>;
        music: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
          primary: z.ZodOptional<z.ZodString>;
          fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>]>>;
      }, z.core.$strict>>;
      voiceModel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        primary: z.ZodOptional<z.ZodString>;
        fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>]>>;
      pdfModel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        primary: z.ZodOptional<z.ZodString>;
        fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>]>>;
      pdfMaxMb: z.ZodOptional<z.ZodNumber>;
      pdfMaxPages: z.ZodOptional<z.ZodNumber>;
      models: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        alias: z.ZodOptional<z.ZodString>;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        agentRuntime: z.ZodOptional<z.ZodObject<{
          id: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        pickerRuntimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        codeMode: z.ZodOptional<z.ZodBoolean>;
        streaming: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>>;
      modelPolicy: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      workspace: z.ZodOptional<z.ZodString>;
      cwd: z.ZodOptional<z.ZodString>;
      skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
      silentReply: z.ZodOptional<z.ZodObject<{
        group: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"disallow">]>>;
        internal: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"disallow">]>>;
      }, z.core.$strict>>;
      repoRoot: z.ZodOptional<z.ZodString>;
      skipBootstrap: z.ZodOptional<z.ZodBoolean>;
      skipOptionalBootstrapFiles: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        "HEARTBEAT.md": "HEARTBEAT.md";
        "IDENTITY.md": "IDENTITY.md";
        "SOUL.md": "SOUL.md";
        "USER.md": "USER.md";
      }>>>;
      contextInjection: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"always">, z.ZodLiteral<"continuation-skip">, z.ZodLiteral<"never">]>>;
      bootstrapMaxChars: z.ZodOptional<z.ZodNumber>;
      bootstrapTotalMaxChars: z.ZodOptional<z.ZodNumber>;
      experimental: z.ZodOptional<z.ZodObject<{
        localModelLean: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      userTimezone: z.ZodOptional<z.ZodString>;
      startupContext: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        applyOn: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"new">, z.ZodLiteral<"reset">]>>>;
        dailyMemoryDays: z.ZodOptional<z.ZodNumber>;
        maxFileBytes: z.ZodOptional<z.ZodNumber>;
        maxFileChars: z.ZodOptional<z.ZodNumber>;
        maxTotalChars: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      contextPruning: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"cache-ttl">]>>;
        ttl: z.ZodOptional<z.ZodString>;
        tools: z.ZodOptional<z.ZodObject<{
          allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
          deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        hardClear: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          placeholder: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      compaction: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"safeguard">]>>;
        provider: z.ZodOptional<z.ZodString>;
        thinkingLevel: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
          adaptive: "adaptive";
          high: "high";
          low: "low";
          max: "max";
          medium: "medium";
          minimal: "minimal";
          off: "off";
          ultra: "ultra";
          xhigh: "xhigh";
        }>, z.ZodLiteral<"inherit">]>>;
        keepRecentTokens: z.ZodOptional<z.ZodNumber>;
        identifierPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"strict">, z.ZodLiteral<"off">]>>;
        recentTurnsPreserve: z.ZodOptional<z.ZodNumber>;
        qualityGuard: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          maxRetries: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
        midTurnPrecheck: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        postIndexSync: z.ZodOptional<z.ZodEnum<{
          async: "async";
          await: "await";
          off: "off";
        }>>;
        postCompactionSections: z.ZodOptional<z.ZodArray<z.ZodString>>;
        model: z.ZodOptional<z.ZodString>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        memoryFlush: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          model: z.ZodOptional<z.ZodString>;
          softThresholdTokens: z.ZodOptional<z.ZodNumber>;
          forceFlushTranscriptBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
        }, z.core.$strict>>;
        maxActiveTranscriptBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
        notifyUser: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      embeddedAgent: z.ZodOptional<z.ZodObject<{
        projectSettingsPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"trusted">, z.ZodLiteral<"sanitize">, z.ZodLiteral<"ignore">]>>;
        executionContract: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"strict-agentic">]>>;
        cyberFailover: z.ZodOptional<z.ZodObject<{
          mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"off">]>>;
          model: z.ZodOptional<z.ZodString>;
          cooloffMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      thinkingDefault: z.ZodOptional<z.ZodEnum<{
        adaptive: "adaptive";
        high: "high";
        low: "low";
        max: "max";
        medium: "medium";
        minimal: "minimal";
        off: "off";
        ultra: "ultra";
        xhigh: "xhigh";
      }>>;
      fastModeDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
      verboseDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">, z.ZodLiteral<"full">]>>;
      toolProgressDetail: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"explain">, z.ZodLiteral<"raw">]>>;
      reasoningDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">, z.ZodLiteral<"stream">]>>;
      elevatedDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">, z.ZodLiteral<"ask">, z.ZodLiteral<"full">]>>;
      blockStreamingDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">]>>;
      blockStreamingBreak: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"text_end">, z.ZodLiteral<"message_end">]>>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      mediaMaxMb: z.ZodOptional<z.ZodNumber>;
      imageMaxDimensionPx: z.ZodOptional<z.ZodNumber>;
      imageQuality: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        balanced: "balanced";
        efficient: "efficient";
        high: "high";
      }>>;
      typingIntervalSeconds: z.ZodOptional<z.ZodNumber>;
      systemAgent: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      authInheritance: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      sessionStore: z.ZodOptional<z.ZodObject<{
        agentId: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      maxConcurrent: z.ZodOptional<z.ZodNumber>;
      subagents: z.ZodOptional<z.ZodObject<{
        delegationMode: z.ZodOptional<z.ZodEnum<{
          prefer: "prefer";
          suggest: "suggest";
        }>>;
        allowAgents: z.ZodOptional<z.ZodArray<z.ZodString>>;
        maxConcurrent: z.ZodOptional<z.ZodNumber>;
        maxSpawnDepth: z.ZodOptional<z.ZodNumber>;
        maxChildrenPerAgent: z.ZodOptional<z.ZodNumber>;
        archiveAfterMinutes: z.ZodOptional<z.ZodNumber>;
        model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
          primary: z.ZodOptional<z.ZodString>;
          fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>]>>;
        thinking: z.ZodOptional<z.ZodString>;
        runTimeoutSeconds: z.ZodOptional<z.ZodNumber>;
        announceTimeoutMs: z.ZodOptional<z.ZodNumber>;
        requireAgentId: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      contextLimits: z.ZodOptional<z.ZodObject<{
        memoryGetMaxChars: z.ZodOptional<z.ZodNumber>;
        postCompactionMaxChars: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      blockStreamingChunk: z.ZodOptional<z.ZodObject<{
        minChars: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        breakPreference: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"paragraph">, z.ZodLiteral<"newline">, z.ZodLiteral<"sentence">]>>;
      }, z.core.$strict>>;
      blockStreamingCoalesce: z.ZodOptional<z.ZodObject<{
        minChars: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        idleMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      humanDelay: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"natural">, z.ZodLiteral<"custom">]>>;
        minMs: z.ZodOptional<z.ZodNumber>;
        maxMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      typingMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"never">, z.ZodLiteral<"instant">, z.ZodLiteral<"thinking">, z.ZodLiteral<"message">]>>;
      heartbeat: z.ZodOptional<z.ZodObject<{
        every: z.ZodOptional<z.ZodString>;
        activeHours: z.ZodOptional<z.ZodObject<{
          start: z.ZodOptional<z.ZodString>;
          end: z.ZodOptional<z.ZodString>;
          timezone: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        model: z.ZodOptional<z.ZodString>;
        session: z.ZodOptional<z.ZodString>;
        target: z.ZodOptional<z.ZodString>;
        directPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"block">]>>;
        to: z.ZodOptional<z.ZodString>;
        accountId: z.ZodOptional<z.ZodString>;
        prompt: z.ZodOptional<z.ZodString>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        lightContext: z.ZodOptional<z.ZodBoolean>;
        isolatedSession: z.ZodOptional<z.ZodBoolean>;
        agentId: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      sandbox: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"non-main">, z.ZodLiteral<"all">]>>;
        backend: z.ZodOptional<z.ZodString>;
        workspaceAccess: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"ro">, z.ZodLiteral<"rw">]>>;
        sessionToolsVisibility: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"spawned">, z.ZodLiteral<"all">]>>;
        scope: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"agent">, z.ZodLiteral<"shared">]>>;
        workspaceRoot: z.ZodOptional<z.ZodString>;
        docker: z.ZodOptional<z.ZodObject<{
          image: z.ZodOptional<z.ZodString>;
          containerPrefix: z.ZodOptional<z.ZodString>;
          workdir: z.ZodOptional<z.ZodString>;
          readOnlyRoot: z.ZodOptional<z.ZodBoolean>;
          tmpfs: z.ZodOptional<z.ZodArray<z.ZodString>>;
          network: z.ZodOptional<z.ZodString>;
          user: z.ZodOptional<z.ZodString>;
          capDrop: z.ZodOptional<z.ZodArray<z.ZodString>>;
          env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
          setupCommand: z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>, z.ZodTransform<string, string | string[]>>, z.ZodString>>;
          pidsLimit: z.ZodOptional<z.ZodNumber>;
          memory: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
          memorySwap: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
          cpus: z.ZodOptional<z.ZodNumber>;
          gpus: z.ZodOptional<z.ZodString>;
          ulimits: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodObject<{
            soft: z.ZodOptional<z.ZodNumber>;
            hard: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>]>>>;
          seccompProfile: z.ZodOptional<z.ZodString>;
          apparmorProfile: z.ZodOptional<z.ZodString>;
          dns: z.ZodOptional<z.ZodArray<z.ZodString>>;
          extraHosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
          binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
          dangerouslyAllowReservedContainerTargets: z.ZodOptional<z.ZodBoolean>;
          dangerouslyAllowExternalBindSources: z.ZodOptional<z.ZodBoolean>;
          dangerouslyAllowContainerNamespaceJoin: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        ssh: z.ZodOptional<z.ZodObject<{
          target: z.ZodOptional<z.ZodString>;
          command: z.ZodOptional<z.ZodString>;
          workspaceRoot: z.ZodOptional<z.ZodString>;
          strictHostKeyChecking: z.ZodOptional<z.ZodBoolean>;
          updateHostKeys: z.ZodOptional<z.ZodBoolean>;
          identityFile: z.ZodOptional<z.ZodString>;
          certificateFile: z.ZodOptional<z.ZodString>;
          knownHostsFile: z.ZodOptional<z.ZodString>;
          identityData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          certificateData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          knownHostsData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
        }, z.core.$strict>>;
        browser: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          image: z.ZodOptional<z.ZodString>;
          containerPrefix: z.ZodOptional<z.ZodString>;
          network: z.ZodOptional<z.ZodString>;
          cdpPort: z.ZodOptional<z.ZodNumber>;
          cdpSourceRange: z.ZodOptional<z.ZodString>;
          vncPort: z.ZodOptional<z.ZodNumber>;
          noVncPort: z.ZodOptional<z.ZodNumber>;
          headless: z.ZodOptional<z.ZodBoolean>;
          noVncEnabled: z.ZodOptional<z.ZodBoolean>;
          allowHostControl: z.ZodOptional<z.ZodBoolean>;
          autoStart: z.ZodOptional<z.ZodBoolean>;
          autoStartTimeoutMs: z.ZodOptional<z.ZodNumber>;
          binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        prune: z.ZodOptional<z.ZodObject<{
          idleHours: z.ZodOptional<z.ZodNumber>;
          maxAgeDays: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>>>;
    entries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodPreprocess<z.ZodObject<{
      name: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      workspace: z.ZodOptional<z.ZodString>;
      cwd: z.ZodOptional<z.ZodString>;
      agentDir: z.ZodOptional<z.ZodString>;
      model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        primary: z.ZodOptional<z.ZodString>;
        fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>]>>;
      utilityModel: z.ZodOptional<z.ZodString>;
      decisionModel: z.ZodOptional<z.ZodString>;
      models: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        alias: z.ZodOptional<z.ZodString>;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        agentRuntime: z.ZodOptional<z.ZodObject<{
          id: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        pickerRuntimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        codeMode: z.ZodOptional<z.ZodBoolean>;
        streaming: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>>;
      modelPolicy: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      thinkingDefault: z.ZodOptional<z.ZodEnum<{
        adaptive: "adaptive";
        high: "high";
        low: "low";
        max: "max";
        medium: "medium";
        minimal: "minimal";
        off: "off";
        ultra: "ultra";
        xhigh: "xhigh";
      }>>;
      verboseDefault: z.ZodOptional<z.ZodEnum<{
        full: "full";
        off: "off";
        on: "on";
      }>>;
      toolProgressDetail: z.ZodOptional<z.ZodEnum<{
        explain: "explain";
        raw: "raw";
      }>>;
      reasoningDefault: z.ZodOptional<z.ZodEnum<{
        off: "off";
        on: "on";
        stream: "stream";
      }>>;
      fastModeDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
      contextInjection: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"always">, z.ZodLiteral<"continuation-skip">, z.ZodLiteral<"never">]>>;
      bootstrapMaxChars: z.ZodOptional<z.ZodNumber>;
      bootstrapTotalMaxChars: z.ZodOptional<z.ZodNumber>;
      experimental: z.ZodOptional<z.ZodObject<{
        localModelLean: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
      subagents: z.ZodOptional<z.ZodObject<{
        delegationMode: z.ZodOptional<z.ZodEnum<{
          prefer: "prefer";
          suggest: "suggest";
        }>>;
        allowAgents: z.ZodOptional<z.ZodArray<z.ZodString>>;
        model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
          primary: z.ZodOptional<z.ZodString>;
          fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>]>>;
        thinking: z.ZodOptional<z.ZodString>;
        requireAgentId: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      embeddedAgent: z.ZodOptional<z.ZodObject<{
        executionContract: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"strict-agentic">]>>;
      }, z.core.$strict>>;
      params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      runtime: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"embedded">;
      }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"acp">;
        acp: z.ZodOptional<z.ZodObject<{
          agent: z.ZodOptional<z.ZodString>;
          backend: z.ZodOptional<z.ZodString>;
          mode: z.ZodOptional<z.ZodEnum<{
            oneshot: "oneshot";
            persistent: "persistent";
          }>>;
          cwd: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>]>>;
      memory: z.ZodOptional<z.ZodObject<{
        search: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          rememberAcrossConversations: z.ZodOptional<z.ZodBoolean>;
          sources: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"memory">, z.ZodLiteral<"sessions">]>>>;
          extraPaths: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
            path: z.ZodString;
            pattern: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>]>>>;
          multimodal: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            modalities: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"image">, z.ZodLiteral<"audio">, z.ZodLiteral<"all">]>>>;
            maxFileBytes: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>>;
          experimental: z.ZodOptional<z.ZodObject<{
            sessionMemory: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
          provider: z.ZodOptional<z.ZodString>;
          remote: z.ZodOptional<z.ZodObject<{
            baseUrl: z.ZodOptional<z.ZodString>;
            apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            batch: z.ZodOptional<z.ZodObject<{
              enabled: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
          }, z.core.$strict>>;
          fallback: z.ZodOptional<z.ZodString>;
          model: z.ZodOptional<z.ZodString>;
          inputType: z.ZodOptional<z.ZodString>;
          queryInputType: z.ZodOptional<z.ZodString>;
          documentInputType: z.ZodOptional<z.ZodString>;
          outputDimensionality: z.ZodOptional<z.ZodNumber>;
          local: z.ZodOptional<z.ZodObject<{
            modelPath: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>>;
          store: z.ZodOptional<z.ZodObject<{
            fts: z.ZodOptional<z.ZodObject<{
              tokenizer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"unicode61">, z.ZodLiteral<"trigram">]>>;
            }, z.core.$strict>>;
            vector: z.ZodOptional<z.ZodObject<{
              enabled: z.ZodOptional<z.ZodBoolean>;
              extensionPath: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
          }, z.core.$strict>>;
          query: z.ZodOptional<z.ZodObject<{
            maxResults: z.ZodOptional<z.ZodNumber>;
            minScore: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>>;
          cache: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      humanDelay: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"natural">, z.ZodLiteral<"custom">]>>;
        minMs: z.ZodOptional<z.ZodNumber>;
        maxMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      typingMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"never">, z.ZodLiteral<"instant">, z.ZodLiteral<"thinking">, z.ZodLiteral<"message">]>>;
      tts: z.ZodOptional<z.ZodObject<{
        auto: z.ZodOptional<z.ZodEnum<{
          always: "always";
          inbound: "inbound";
          off: "off";
          tagged: "tagged";
        }>>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        mode: z.ZodOptional<z.ZodEnum<{
          all: "all";
          final: "final";
        }>>;
        provider: z.ZodOptional<z.ZodString>;
        persona: z.ZodOptional<z.ZodString>;
        personas: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
          label: z.ZodOptional<z.ZodString>;
          description: z.ZodOptional<z.ZodString>;
          provider: z.ZodOptional<z.ZodString>;
          fallbackPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"preserve-persona">, z.ZodLiteral<"provider-defaults">, z.ZodLiteral<"fail">]>>;
          providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
          }, z.core.$catchall<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnknown>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>>>>;
        }, z.core.$strict>>>;
        summaryModel: z.ZodOptional<z.ZodString>;
        modelOverrides: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          allowText: z.ZodOptional<z.ZodBoolean>;
          allowProvider: z.ZodOptional<z.ZodBoolean>;
          allowVoice: z.ZodOptional<z.ZodBoolean>;
          allowModelId: z.ZodOptional<z.ZodBoolean>;
          allowVoiceSettings: z.ZodOptional<z.ZodBoolean>;
          allowNormalization: z.ZodOptional<z.ZodBoolean>;
          allowSeed: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
          apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
        }, z.core.$catchall<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnknown>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>>>>;
        maxTextLength: z.ZodOptional<z.ZodNumber>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        prefsPath: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      skillsLimits: z.ZodOptional<z.ZodObject<{
        maxSkillsPromptChars: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      contextLimits: z.ZodOptional<z.ZodObject<{
        memoryGetMaxChars: z.ZodOptional<z.ZodNumber>;
        postCompactionMaxChars: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      heartbeat: z.ZodOptional<z.ZodObject<{
        every: z.ZodOptional<z.ZodString>;
        activeHours: z.ZodOptional<z.ZodObject<{
          start: z.ZodOptional<z.ZodString>;
          end: z.ZodOptional<z.ZodString>;
          timezone: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
        model: z.ZodOptional<z.ZodString>;
        session: z.ZodOptional<z.ZodString>;
        target: z.ZodOptional<z.ZodString>;
        directPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"block">]>>;
        to: z.ZodOptional<z.ZodString>;
        accountId: z.ZodOptional<z.ZodString>;
        prompt: z.ZodOptional<z.ZodString>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        lightContext: z.ZodOptional<z.ZodBoolean>;
        isolatedSession: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      identity: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        theme: z.ZodOptional<z.ZodString>;
        emoji: z.ZodOptional<z.ZodString>;
        avatar: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      groupChat: z.ZodOptional<z.ZodObject<{
        mentionPatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
        historyLimit: z.ZodOptional<z.ZodNumber>;
        unmentionedInbound: z.ZodOptional<z.ZodEnum<{
          room_event: "room_event";
          user_request: "user_request";
        }>>;
      }, z.core.$strict>>;
      sandbox: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"non-main">, z.ZodLiteral<"all">]>>;
        backend: z.ZodOptional<z.ZodString>;
        workspaceAccess: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"ro">, z.ZodLiteral<"rw">]>>;
        sessionToolsVisibility: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"spawned">, z.ZodLiteral<"all">]>>;
        scope: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"agent">, z.ZodLiteral<"shared">]>>;
        workspaceRoot: z.ZodOptional<z.ZodString>;
        docker: z.ZodOptional<z.ZodObject<{
          image: z.ZodOptional<z.ZodString>;
          containerPrefix: z.ZodOptional<z.ZodString>;
          workdir: z.ZodOptional<z.ZodString>;
          readOnlyRoot: z.ZodOptional<z.ZodBoolean>;
          tmpfs: z.ZodOptional<z.ZodArray<z.ZodString>>;
          network: z.ZodOptional<z.ZodString>;
          user: z.ZodOptional<z.ZodString>;
          capDrop: z.ZodOptional<z.ZodArray<z.ZodString>>;
          env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
          setupCommand: z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>, z.ZodTransform<string, string | string[]>>, z.ZodString>>;
          pidsLimit: z.ZodOptional<z.ZodNumber>;
          memory: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
          memorySwap: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
          cpus: z.ZodOptional<z.ZodNumber>;
          gpus: z.ZodOptional<z.ZodString>;
          ulimits: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodObject<{
            soft: z.ZodOptional<z.ZodNumber>;
            hard: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>]>>>;
          seccompProfile: z.ZodOptional<z.ZodString>;
          apparmorProfile: z.ZodOptional<z.ZodString>;
          dns: z.ZodOptional<z.ZodArray<z.ZodString>>;
          extraHosts: z.ZodOptional<z.ZodArray<z.ZodString>>;
          binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
          dangerouslyAllowReservedContainerTargets: z.ZodOptional<z.ZodBoolean>;
          dangerouslyAllowExternalBindSources: z.ZodOptional<z.ZodBoolean>;
          dangerouslyAllowContainerNamespaceJoin: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        ssh: z.ZodOptional<z.ZodObject<{
          target: z.ZodOptional<z.ZodString>;
          command: z.ZodOptional<z.ZodString>;
          workspaceRoot: z.ZodOptional<z.ZodString>;
          strictHostKeyChecking: z.ZodOptional<z.ZodBoolean>;
          updateHostKeys: z.ZodOptional<z.ZodBoolean>;
          identityFile: z.ZodOptional<z.ZodString>;
          certificateFile: z.ZodOptional<z.ZodString>;
          knownHostsFile: z.ZodOptional<z.ZodString>;
          identityData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          certificateData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
          knownHostsData: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>;
        }, z.core.$strict>>;
        browser: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          image: z.ZodOptional<z.ZodString>;
          containerPrefix: z.ZodOptional<z.ZodString>;
          network: z.ZodOptional<z.ZodString>;
          cdpPort: z.ZodOptional<z.ZodNumber>;
          cdpSourceRange: z.ZodOptional<z.ZodString>;
          vncPort: z.ZodOptional<z.ZodNumber>;
          noVncPort: z.ZodOptional<z.ZodNumber>;
          headless: z.ZodOptional<z.ZodBoolean>;
          noVncEnabled: z.ZodOptional<z.ZodBoolean>;
          allowHostControl: z.ZodOptional<z.ZodBoolean>;
          autoStart: z.ZodOptional<z.ZodBoolean>;
          autoStartTimeoutMs: z.ZodOptional<z.ZodNumber>;
          binds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        prune: z.ZodOptional<z.ZodObject<{
          idleHours: z.ZodOptional<z.ZodNumber>;
          maxAgeDays: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      tools: z.ZodOptional<z.ZodObject<{
        profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
        byProvider: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
          allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
          alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
          deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
          profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
        }, z.core.$strict>>>;
        toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
          allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
          alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
          deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>>>;
        codeMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">, z.ZodObject<{
          enabled: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
          executor: z.ZodOptional<z.ZodEnum<{
            node: "node";
            quickjs: "quickjs";
          }>>;
          mode: z.ZodOptional<z.ZodLiteral<"only">>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
          memoryLimitBytes: z.ZodOptional<z.ZodNumber>;
          maxOutputBytes: z.ZodOptional<z.ZodNumber>;
          maxSnapshotBytes: z.ZodOptional<z.ZodNumber>;
          maxPendingToolCalls: z.ZodOptional<z.ZodNumber>;
          snapshotTtlSeconds: z.ZodOptional<z.ZodNumber>;
          searchDefaultLimit: z.ZodOptional<z.ZodNumber>;
          maxSearchLimit: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>]>>;
        swarm: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          maxConcurrent: z.ZodOptional<z.ZodNumber>;
          maxChildrenPerGroup: z.ZodOptional<z.ZodNumber>;
          maxTotalPerGroup: z.ZodOptional<z.ZodNumber>;
          waitTimeoutSecondsMax: z.ZodOptional<z.ZodNumber>;
          defaultAgentId: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>]>>;
        elevated: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          allowFrom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>>;
        }, z.core.$strict>>;
        exec: z.ZodOptional<z.ZodObject<{
          host: z.ZodOptional<z.ZodEnum<{
            auto: "auto";
            gateway: "gateway";
            node: "node";
            sandbox: "sandbox";
          }>>;
          mode: z.ZodOptional<z.ZodEnum<{
            allowlist: "allowlist";
            ask: "ask";
            auto: "auto";
            deny: "deny";
            full: "full";
          }>>;
          security: z.ZodOptional<z.ZodEnum<{
            allowlist: "allowlist";
            deny: "deny";
            full: "full";
          }>>;
          ask: z.ZodOptional<z.ZodEnum<{
            always: "always";
            off: "off";
            "on-miss": "on-miss";
          }>>;
          node: z.ZodOptional<z.ZodString>;
          pathPrepend: z.ZodOptional<z.ZodArray<z.ZodString>>;
          safeBins: z.ZodOptional<z.ZodArray<z.ZodString>>;
          strictInlineEval: z.ZodOptional<z.ZodBoolean>;
          commandHighlighting: z.ZodOptional<z.ZodBoolean>;
          grantExpiryDays: z.ZodOptional<z.ZodNumber>;
          safeBinTrustedDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
          safeBinProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            minPositional: z.ZodOptional<z.ZodNumber>;
            maxPositional: z.ZodOptional<z.ZodNumber>;
            allowedValueFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
            deniedFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
          }, z.core.$strict>>>;
          reviewer: z.ZodOptional<z.ZodObject<{
            model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
              primary: z.ZodOptional<z.ZodString>;
              fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
            }, z.core.$strict>]>>;
            thinking: z.ZodOptional<z.ZodEnum<{
              high: "high";
              low: "low";
              max: "max";
              medium: "medium";
              minimal: "minimal";
              xhigh: "xhigh";
            }>>;
            fastMode: z.ZodOptional<z.ZodBoolean>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>>;
          backgroundMs: z.ZodOptional<z.ZodNumber>;
          approvalRunningNoticeMs: z.ZodOptional<z.ZodNumber>;
          timeoutSeconds: z.ZodOptional<z.ZodNumber>;
          cleanupMs: z.ZodOptional<z.ZodNumber>;
          notifyOnExit: z.ZodOptional<z.ZodBoolean>;
          notifyOnExitEmptySuccess: z.ZodOptional<z.ZodBoolean>;
          applyPatch: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            workspaceOnly: z.ZodOptional<z.ZodBoolean>;
            allowModels: z.ZodOptional<z.ZodArray<z.ZodString>>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
        github: z.ZodOptional<z.ZodObject<{
          profileId: z.ZodString;
          kind: z.ZodOptional<z.ZodLiteral<"oauth">>;
          gitAuthor: z.ZodOptional<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
        fs: z.ZodOptional<z.ZodObject<{
          workspaceOnly: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        loopDetection: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        message: z.ZodOptional<z.ZodObject<{
          crossContext: z.ZodOptional<z.ZodObject<{
            allowWithinProvider: z.ZodOptional<z.ZodBoolean>;
            allowAcrossProviders: z.ZodOptional<z.ZodBoolean>;
            marker: z.ZodOptional<z.ZodObject<{
              enabled: z.ZodOptional<z.ZodBoolean>;
              prefix: z.ZodOptional<z.ZodString>;
              suffix: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
          }, z.core.$strict>>;
          actions: z.ZodOptional<z.ZodObject<{
            allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
          }, z.core.$strict>>;
          broadcast: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
        sandbox: z.ZodOptional<z.ZodObject<{
          tools: z.ZodOptional<z.ZodObject<{
            allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
            alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
            deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      default: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>, unknown>>>;
  }, z.core.$strict>>;
  worktreeRoot: z.ZodOptional<z.ZodString>;
  worktreeAcceleration: z.ZodOptional<z.ZodBoolean>;
  tools: z.ZodOptional<z.ZodObject<{
    profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    byProvider: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      profile: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"minimal">, z.ZodLiteral<"coding">, z.ZodLiteral<"messaging">, z.ZodLiteral<"full">]>>;
    }, z.core.$strict>>>;
    toolsBySender: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>>>;
    web: z.ZodOptional<z.ZodObject<{
      search: z.ZodOptional<z.ZodPreprocess<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        provider: z.ZodOptional<z.ZodString>;
        maxResults: z.ZodOptional<z.ZodNumber>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        cacheTtlMinutes: z.ZodOptional<z.ZodNumber>;
        openaiCodex: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"cached">, z.ZodLiteral<"live">]>>;
          allowedDomains: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[] | undefined, string[]>>>;
          contextSize: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"low">, z.ZodLiteral<"medium">, z.ZodLiteral<"high">]>>;
          userLocation: z.ZodOptional<z.ZodPipe<z.ZodObject<{
            country: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
            region: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
            city: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
            timezone: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
          }, z.core.$strict>, z.ZodTransform<{
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
            timezone?: string | undefined;
          } | undefined, {
            country?: string | undefined;
            region?: string | undefined;
            city?: string | undefined;
            timezone?: string | undefined;
          }>>>;
        }, z.core.$strict>>;
      }, z.core.$catchall<z.ZodUnknown>>, unknown>>;
      fetch: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        provider: z.ZodOptional<z.ZodString>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        maxCharsCap: z.ZodOptional<z.ZodNumber>;
        maxResponseBytes: z.ZodOptional<z.ZodNumber>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        cacheTtlMinutes: z.ZodOptional<z.ZodNumber>;
        maxRedirects: z.ZodOptional<z.ZodNumber>;
        userAgent: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        readability: z.ZodOptional<z.ZodBoolean>;
        useTrustedEnvProxy: z.ZodOptional<z.ZodBoolean>;
        ssrfPolicy: z.ZodOptional<z.ZodObject<{
          dangerouslyAllowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
          allowRfc2544BenchmarkRange: z.ZodOptional<z.ZodBoolean>;
          allowIpv6UniqueLocalRange: z.ZodOptional<z.ZodBoolean>;
          allowedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
          blockedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    github: z.ZodOptional<z.ZodObject<{
      profileId: z.ZodString;
      kind: z.ZodOptional<z.ZodLiteral<"oauth">>;
      gitAuthor: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    media: z.ZodOptional<z.ZodObject<{
      models: z.ZodOptional<z.ZodArray<z.ZodOptional<z.ZodObject<{
        prompt: z.ZodOptional<z.ZodString>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        language: z.ZodOptional<z.ZodString>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
        baseUrl: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        request: z.ZodOptional<z.ZodObject<{
          headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>>;
          auth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
            mode: z.ZodLiteral<"provider-default">;
          }, z.core.$strict>, z.ZodObject<{
            mode: z.ZodLiteral<"authorization-bearer">;
            token: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>;
          }, z.core.$strict>, z.ZodObject<{
            mode: z.ZodLiteral<"header">;
            headerName: z.ZodString;
            value: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>;
            prefix: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>]>>;
          proxy: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
            mode: z.ZodLiteral<"env-proxy">;
            tls: z.ZodOptional<z.ZodObject<{
              ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              serverName: z.ZodOptional<z.ZodString>;
              insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
          }, z.core.$strict>, z.ZodObject<{
            mode: z.ZodLiteral<"explicit-proxy">;
            url: z.ZodString;
            tls: z.ZodOptional<z.ZodObject<{
              ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              serverName: z.ZodOptional<z.ZodString>;
              insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
          }, z.core.$strict>]>>;
          tls: z.ZodOptional<z.ZodObject<{
            ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            serverName: z.ZodOptional<z.ZodString>;
            insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
        provider: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        capabilities: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"image">, z.ZodLiteral<"audio">, z.ZodLiteral<"video">]>>>;
        type: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"provider">, z.ZodLiteral<"cli">]>>;
        command: z.ZodOptional<z.ZodString>;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        maxBytes: z.ZodOptional<z.ZodNumber>;
        profile: z.ZodOptional<z.ZodString>;
        preferredProfile: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>>>;
      concurrency: z.ZodOptional<z.ZodNumber>;
      image: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        prompt: z.ZodOptional<z.ZodString>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        language: z.ZodOptional<z.ZodString>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
        baseUrl: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        request: z.ZodOptional<z.ZodObject<{
          headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>>;
          auth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
            mode: z.ZodLiteral<"provider-default">;
          }, z.core.$strict>, z.ZodObject<{
            mode: z.ZodLiteral<"authorization-bearer">;
            token: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>;
          }, z.core.$strict>, z.ZodObject<{
            mode: z.ZodLiteral<"header">;
            headerName: z.ZodString;
            value: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>;
            prefix: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>]>>;
          proxy: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
            mode: z.ZodLiteral<"env-proxy">;
            tls: z.ZodOptional<z.ZodObject<{
              ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              serverName: z.ZodOptional<z.ZodString>;
              insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
          }, z.core.$strict>, z.ZodObject<{
            mode: z.ZodLiteral<"explicit-proxy">;
            url: z.ZodString;
            tls: z.ZodOptional<z.ZodObject<{
              ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              serverName: z.ZodOptional<z.ZodString>;
              insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
          }, z.core.$strict>]>>;
          tls: z.ZodOptional<z.ZodObject<{
            ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            serverName: z.ZodOptional<z.ZodString>;
            insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        preferredModel: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodObject<{
          default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
          rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
            action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
            match: z.ZodOptional<z.ZodObject<{
              channel: z.ZodOptional<z.ZodString>;
              chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
              keyPrefix: z.ZodOptional<z.ZodString>;
              rawKeyPrefix: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
          }, z.core.$strict>>>;
        }, z.core.$strict>>;
        maxBytes: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        attachments: z.ZodOptional<z.ZodObject<{
          mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"all">]>>;
          maxAttachments: z.ZodOptional<z.ZodNumber>;
          prefer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"last">, z.ZodLiteral<"path">, z.ZodLiteral<"url">]>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>>;
      audio: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        prompt: z.ZodOptional<z.ZodString>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        language: z.ZodOptional<z.ZodString>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
        baseUrl: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        request: z.ZodOptional<z.ZodObject<{
          headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>>;
          auth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
            mode: z.ZodLiteral<"provider-default">;
          }, z.core.$strict>, z.ZodObject<{
            mode: z.ZodLiteral<"authorization-bearer">;
            token: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>;
          }, z.core.$strict>, z.ZodObject<{
            mode: z.ZodLiteral<"header">;
            headerName: z.ZodString;
            value: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>;
            prefix: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>]>>;
          proxy: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
            mode: z.ZodLiteral<"env-proxy">;
            tls: z.ZodOptional<z.ZodObject<{
              ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              serverName: z.ZodOptional<z.ZodString>;
              insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
          }, z.core.$strict>, z.ZodObject<{
            mode: z.ZodLiteral<"explicit-proxy">;
            url: z.ZodString;
            tls: z.ZodOptional<z.ZodObject<{
              ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              serverName: z.ZodOptional<z.ZodString>;
              insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
          }, z.core.$strict>]>>;
          tls: z.ZodOptional<z.ZodObject<{
            ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            serverName: z.ZodOptional<z.ZodString>;
            insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        preferredModel: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodObject<{
          default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
          rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
            action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
            match: z.ZodOptional<z.ZodObject<{
              channel: z.ZodOptional<z.ZodString>;
              chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
              keyPrefix: z.ZodOptional<z.ZodString>;
              rawKeyPrefix: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
          }, z.core.$strict>>>;
        }, z.core.$strict>>;
        maxBytes: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        attachments: z.ZodOptional<z.ZodObject<{
          mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"all">]>>;
          maxAttachments: z.ZodOptional<z.ZodNumber>;
          prefer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"last">, z.ZodLiteral<"path">, z.ZodLiteral<"url">]>>;
        }, z.core.$strict>>;
        echoTranscript: z.ZodOptional<z.ZodBoolean>;
        echoFormat: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>>;
      video: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        prompt: z.ZodOptional<z.ZodString>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
        language: z.ZodOptional<z.ZodString>;
        providerOptions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>>;
        baseUrl: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        request: z.ZodOptional<z.ZodObject<{
          headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
            source: z.ZodLiteral<"env">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"file">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"exec">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>, z.ZodObject<{
            source: z.ZodLiteral<"store">;
            provider: z.ZodString;
            id: z.ZodString;
          }, z.core.$strict>], "source">]>>>;
          auth: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
            mode: z.ZodLiteral<"provider-default">;
          }, z.core.$strict>, z.ZodObject<{
            mode: z.ZodLiteral<"authorization-bearer">;
            token: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>;
          }, z.core.$strict>, z.ZodObject<{
            mode: z.ZodLiteral<"header">;
            headerName: z.ZodString;
            value: z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>;
            prefix: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>]>>;
          proxy: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
            mode: z.ZodLiteral<"env-proxy">;
            tls: z.ZodOptional<z.ZodObject<{
              ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              serverName: z.ZodOptional<z.ZodString>;
              insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
          }, z.core.$strict>, z.ZodObject<{
            mode: z.ZodLiteral<"explicit-proxy">;
            url: z.ZodString;
            tls: z.ZodOptional<z.ZodObject<{
              ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
                source: z.ZodLiteral<"env">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"file">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"exec">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>, z.ZodObject<{
                source: z.ZodLiteral<"store">;
                provider: z.ZodString;
                id: z.ZodString;
              }, z.core.$strict>], "source">]>>;
              serverName: z.ZodOptional<z.ZodString>;
              insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strict>>;
          }, z.core.$strict>]>>;
          tls: z.ZodOptional<z.ZodObject<{
            ca: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            cert: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            key: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            passphrase: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
              source: z.ZodLiteral<"env">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"file">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"exec">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>, z.ZodObject<{
              source: z.ZodLiteral<"store">;
              provider: z.ZodString;
              id: z.ZodString;
            }, z.core.$strict>], "source">]>>;
            serverName: z.ZodOptional<z.ZodString>;
            insecureSkipVerify: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        preferredModel: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodObject<{
          default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
          rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
            action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
            match: z.ZodOptional<z.ZodObject<{
              channel: z.ZodOptional<z.ZodString>;
              chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
              keyPrefix: z.ZodOptional<z.ZodString>;
              rawKeyPrefix: z.ZodOptional<z.ZodString>;
            }, z.core.$strict>>;
          }, z.core.$strict>>>;
        }, z.core.$strict>>;
        maxBytes: z.ZodOptional<z.ZodNumber>;
        maxChars: z.ZodOptional<z.ZodNumber>;
        attachments: z.ZodOptional<z.ZodObject<{
          mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"all">]>>;
          maxAttachments: z.ZodOptional<z.ZodNumber>;
          prefer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"first">, z.ZodLiteral<"last">, z.ZodLiteral<"path">, z.ZodLiteral<"url">]>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>>;
    }, z.core.$strict>>;
    links: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      scope: z.ZodOptional<z.ZodObject<{
        default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
        rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
          action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
          match: z.ZodOptional<z.ZodObject<{
            channel: z.ZodOptional<z.ZodString>;
            chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
            keyPrefix: z.ZodOptional<z.ZodString>;
            rawKeyPrefix: z.ZodOptional<z.ZodString>;
          }, z.core.$strict>>;
        }, z.core.$strict>>>;
      }, z.core.$strict>>;
      maxLinks: z.ZodOptional<z.ZodNumber>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      models: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodOptional<z.ZodLiteral<"cli">>;
        command: z.ZodString;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>>;
    }, z.core.$strict>>;
    sessions: z.ZodOptional<z.ZodObject<{
      visibility: z.ZodOptional<z.ZodEnum<{
        agent: "agent";
        all: "all";
        self: "self";
        tree: "tree";
      }>>;
    }, z.core.$strict>>;
    loopDetection: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    toolSearch: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      mode: z.ZodOptional<z.ZodEnum<{
        code: "code";
        directory: "directory";
        tools: "tools";
      }>>;
      codeTimeoutMs: z.ZodOptional<z.ZodNumber>;
      searchDefaultLimit: z.ZodOptional<z.ZodNumber>;
      maxSearchLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>;
    codeMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
      executor: z.ZodOptional<z.ZodEnum<{
        node: "node";
        quickjs: "quickjs";
      }>>;
      mode: z.ZodOptional<z.ZodLiteral<"only">>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
      memoryLimitBytes: z.ZodOptional<z.ZodNumber>;
      maxOutputBytes: z.ZodOptional<z.ZodNumber>;
      maxSnapshotBytes: z.ZodOptional<z.ZodNumber>;
      maxPendingToolCalls: z.ZodOptional<z.ZodNumber>;
      snapshotTtlSeconds: z.ZodOptional<z.ZodNumber>;
      searchDefaultLimit: z.ZodOptional<z.ZodNumber>;
      maxSearchLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>;
    swarm: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      maxConcurrent: z.ZodOptional<z.ZodNumber>;
      maxChildrenPerGroup: z.ZodOptional<z.ZodNumber>;
      maxTotalPerGroup: z.ZodOptional<z.ZodNumber>;
      waitTimeoutSecondsMax: z.ZodOptional<z.ZodNumber>;
      defaultAgentId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>]>>;
    message: z.ZodOptional<z.ZodObject<{
      crossContext: z.ZodOptional<z.ZodObject<{
        allowWithinProvider: z.ZodOptional<z.ZodBoolean>;
        allowAcrossProviders: z.ZodOptional<z.ZodBoolean>;
        marker: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          prefix: z.ZodOptional<z.ZodString>;
          suffix: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      actions: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      broadcast: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    agentToAgent: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    elevated: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      allowFrom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>>;
    }, z.core.$strict>>;
    exec: z.ZodOptional<z.ZodObject<{
      host: z.ZodOptional<z.ZodEnum<{
        auto: "auto";
        gateway: "gateway";
        node: "node";
        sandbox: "sandbox";
      }>>;
      mode: z.ZodOptional<z.ZodEnum<{
        allowlist: "allowlist";
        ask: "ask";
        auto: "auto";
        deny: "deny";
        full: "full";
      }>>;
      security: z.ZodOptional<z.ZodEnum<{
        allowlist: "allowlist";
        deny: "deny";
        full: "full";
      }>>;
      ask: z.ZodOptional<z.ZodEnum<{
        always: "always";
        off: "off";
        "on-miss": "on-miss";
      }>>;
      node: z.ZodOptional<z.ZodString>;
      pathPrepend: z.ZodOptional<z.ZodArray<z.ZodString>>;
      safeBins: z.ZodOptional<z.ZodArray<z.ZodString>>;
      strictInlineEval: z.ZodOptional<z.ZodBoolean>;
      commandHighlighting: z.ZodOptional<z.ZodBoolean>;
      grantExpiryDays: z.ZodOptional<z.ZodNumber>;
      safeBinTrustedDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      safeBinProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        minPositional: z.ZodOptional<z.ZodNumber>;
        maxPositional: z.ZodOptional<z.ZodNumber>;
        allowedValueFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deniedFlags: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>>;
      reviewer: z.ZodOptional<z.ZodObject<{
        model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
          primary: z.ZodOptional<z.ZodString>;
          fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>]>>;
        thinking: z.ZodOptional<z.ZodEnum<{
          high: "high";
          low: "low";
          max: "max";
          medium: "medium";
          minimal: "minimal";
          xhigh: "xhigh";
        }>>;
        fastMode: z.ZodOptional<z.ZodBoolean>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      backgroundMs: z.ZodOptional<z.ZodNumber>;
      approvalRunningNoticeMs: z.ZodOptional<z.ZodNumber>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      cleanupMs: z.ZodOptional<z.ZodNumber>;
      notifyOnExit: z.ZodOptional<z.ZodBoolean>;
      notifyOnExitEmptySuccess: z.ZodOptional<z.ZodBoolean>;
      applyPatch: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        workspaceOnly: z.ZodOptional<z.ZodBoolean>;
        allowModels: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    fs: z.ZodOptional<z.ZodObject<{
      workspaceOnly: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    subagents: z.ZodOptional<z.ZodObject<{
      tools: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    sandbox: z.ZodOptional<z.ZodObject<{
      tools: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        alsoAllow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    sessions_spawn: z.ZodOptional<z.ZodObject<{
      attachments: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        maxTotalBytes: z.ZodOptional<z.ZodNumber>;
        maxFiles: z.ZodOptional<z.ZodNumber>;
        maxFileBytes: z.ZodOptional<z.ZodNumber>;
        retainOnSessionKeep: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    updatePlan: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  security: z.ZodOptional<z.ZodObject<{
    audit: z.ZodOptional<z.ZodObject<{
      suppressions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        checkId: z.ZodString;
        titleIncludes: z.ZodOptional<z.ZodString>;
        detailIncludes: z.ZodOptional<z.ZodString>;
        reason: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>>;
    }, z.core.$strict>>;
    installPolicy: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      targets: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"skill">, z.ZodLiteral<"plugin">]>>>;
      exec: z.ZodOptional<z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        command: z.ZodString;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        noOutputTimeoutMs: z.ZodOptional<z.ZodNumber>;
        maxOutputBytes: z.ZodOptional<z.ZodNumber>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        passEnv: z.ZodOptional<z.ZodArray<z.ZodString>>;
        trustedDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  bindings: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodOptional<z.ZodLiteral<"route">>;
    agentId: z.ZodString;
    comment: z.ZodOptional<z.ZodString>;
    match: z.ZodObject<{
      channel: z.ZodString;
      accountId: z.ZodOptional<z.ZodString>;
      peer: z.ZodOptional<z.ZodObject<{
        kind: z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>;
        id: z.ZodString;
      }, z.core.$strict>>;
      guildId: z.ZodOptional<z.ZodString>;
      teamId: z.ZodOptional<z.ZodString>;
      roles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
    session: z.ZodOptional<z.ZodObject<{
      dmScope: z.ZodOptional<z.ZodEnum<{
        main: "main";
        "per-account-channel-peer": "per-account-channel-peer";
        "per-channel-peer": "per-channel-peer";
        "per-peer": "per-peer";
      }>>;
      groupScope: z.ZodOptional<z.ZodEnum<{
        main: "main";
        "per-group": "per-group";
      }>>;
    }, z.core.$strict>>;
  }, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"acp">;
    agentId: z.ZodString;
    comment: z.ZodOptional<z.ZodString>;
    match: z.ZodObject<{
      channel: z.ZodString;
      accountId: z.ZodOptional<z.ZodString>;
      peer: z.ZodOptional<z.ZodObject<{
        kind: z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>;
        id: z.ZodString;
      }, z.core.$strict>>;
      guildId: z.ZodOptional<z.ZodString>;
      teamId: z.ZodOptional<z.ZodString>;
      roles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
    acp: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodEnum<{
        oneshot: "oneshot";
        persistent: "persistent";
      }>>;
      label: z.ZodOptional<z.ZodString>;
      cwd: z.ZodOptional<z.ZodString>;
      backend: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>]>>>;
  broadcast: z.ZodOptional<z.ZodObject<{
    strategy: z.ZodOptional<z.ZodEnum<{
      parallel: "parallel";
      sequential: "sequential";
    }>>;
  }, z.core.$catchall<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodObject<{
    agents: z.ZodArray<z.ZodString>;
    mentionGating: z.ZodOptional<z.ZodBoolean>;
    maxRounds: z.ZodOptional<z.ZodNumber>;
    maxTurns: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>]>>>>;
  attachments: z.ZodOptional<z.ZodObject<{
    ttlHours: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  messages: z.ZodOptional<z.ZodObject<{
    visibleReplies: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
      automatic: "automatic";
      message_tool: "message_tool";
    }>, z.ZodBoolean]>>;
    responsePrefix: z.ZodOptional<z.ZodString>;
    usageTemplate: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>;
    responseUsage: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
      full: "full";
      off: "off";
      on: "on";
      tokens: "tokens";
    }>, z.ZodRecord<z.ZodString, z.ZodEnum<{
      full: "full";
      off: "off";
      on: "on";
      tokens: "tokens";
    }>>]>>;
    groupChat: z.ZodOptional<z.ZodObject<{
      mentionPatterns: z.ZodOptional<z.ZodArray<z.ZodString>>;
      historyLimit: z.ZodOptional<z.ZodNumber>;
      unmentionedInbound: z.ZodOptional<z.ZodEnum<{
        room_event: "room_event";
        user_request: "user_request";
      }>>;
      visibleReplies: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        automatic: "automatic";
        message_tool: "message_tool";
      }>, z.ZodBoolean]>>;
    }, z.core.$strict>>;
    queue: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      byChannel: z.ZodOptional<z.ZodObject<{
        whatsapp: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
        telegram: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
        discord: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
        irc: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
        googlechat: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
        slack: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
        mattermost: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
        signal: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
        imessage: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
        msteams: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
        webchat: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
        matrix: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"steer">, z.ZodLiteral<"followup">, z.ZodLiteral<"collect">, z.ZodLiteral<"interrupt">]>>;
      }, z.core.$strict>>;
      debounceMsByChannel: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
      cap: z.ZodOptional<z.ZodNumber>;
      drop: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"old">, z.ZodLiteral<"new">, z.ZodLiteral<"summarize">]>>;
    }, z.core.$strict>>;
    inbound: z.ZodOptional<z.ZodObject<{
      debounceMs: z.ZodOptional<z.ZodNumber>;
      byChannel: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    }, z.core.$strict>>;
    ackReaction: z.ZodOptional<z.ZodString>;
    ackReactionScope: z.ZodOptional<z.ZodEnum<{
      all: "all";
      direct: "direct";
      "group-all": "group-all";
      "group-mentions": "group-mentions";
      none: "none";
      off: "off";
    }>>;
    statusReactions: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  tts: z.ZodOptional<z.ZodObject<{
    auto: z.ZodOptional<z.ZodEnum<{
      always: "always";
      inbound: "inbound";
      off: "off";
      tagged: "tagged";
    }>>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    mode: z.ZodOptional<z.ZodEnum<{
      all: "all";
      final: "final";
    }>>;
    provider: z.ZodOptional<z.ZodString>;
    persona: z.ZodOptional<z.ZodString>;
    personas: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      label: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      provider: z.ZodOptional<z.ZodString>;
      fallbackPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"preserve-persona">, z.ZodLiteral<"provider-defaults">, z.ZodLiteral<"fail">]>>;
      providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>;
      }, z.core.$catchall<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnknown>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>>>>;
    }, z.core.$strict>>>;
    summaryModel: z.ZodOptional<z.ZodString>;
    modelOverrides: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      allowText: z.ZodOptional<z.ZodBoolean>;
      allowProvider: z.ZodOptional<z.ZodBoolean>;
      allowVoice: z.ZodOptional<z.ZodBoolean>;
      allowModelId: z.ZodOptional<z.ZodBoolean>;
      allowVoiceSettings: z.ZodOptional<z.ZodBoolean>;
      allowNormalization: z.ZodOptional<z.ZodBoolean>;
      allowSeed: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
    }, z.core.$catchall<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnknown>, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>>>>;
    maxTextLength: z.ZodOptional<z.ZodNumber>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  commands: z.ZodDefault<z.ZodOptional<z.ZodObject<{
    native: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>>;
    nativeSkills: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>>;
    text: z.ZodOptional<z.ZodBoolean>;
    bash: z.ZodOptional<z.ZodBoolean>;
    bashForegroundMs: z.ZodOptional<z.ZodNumber>;
    config: z.ZodOptional<z.ZodBoolean>;
    mcp: z.ZodOptional<z.ZodBoolean>;
    plugins: z.ZodOptional<z.ZodBoolean>;
    debug: z.ZodOptional<z.ZodBoolean>;
    restart: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    ownerAllowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
    allowFrom: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>>>;
  }, z.core.$strict>>>;
  approvals: z.ZodOptional<z.ZodObject<{
    exec: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"targets">, z.ZodLiteral<"both">]>>;
      agentFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
      sessionFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
      targets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        channel: z.ZodString;
        to: z.ZodString;
        accountId: z.ZodOptional<z.ZodString>;
        threadId: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      }, z.core.$strict>>>;
    }, z.core.$strict>>;
    plugin: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"session">, z.ZodLiteral<"targets">, z.ZodLiteral<"both">]>>;
      agentFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
      sessionFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
      targets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        channel: z.ZodString;
        to: z.ZodString;
        accountId: z.ZodOptional<z.ZodString>;
        threadId: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      }, z.core.$strict>>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  session: z.ZodOptional<z.ZodObject<{
    scope: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"per-sender">, z.ZodLiteral<"global">]>>;
    dmScope: z.ZodOptional<z.ZodEnum<{
      main: "main";
      "per-account-channel-peer": "per-account-channel-peer";
      "per-channel-peer": "per-channel-peer";
      "per-peer": "per-peer";
    }>>;
    groupScope: z.ZodOptional<z.ZodEnum<{
      main: "main";
      "per-group": "per-group";
    }>>;
    notifyOnCreate: z.ZodOptional<z.ZodBoolean>;
    identityLinks: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
    resetTriggers: z.ZodOptional<z.ZodArray<z.ZodString>>;
    reset: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
      atHour: z.ZodOptional<z.ZodNumber>;
      idleMinutes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    resetByType: z.ZodOptional<z.ZodObject<{
      direct: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
        atHour: z.ZodOptional<z.ZodNumber>;
        idleMinutes: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      group: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
        atHour: z.ZodOptional<z.ZodNumber>;
        idleMinutes: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      thread: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
        atHour: z.ZodOptional<z.ZodNumber>;
        idleMinutes: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    resetByChannel: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"daily">, z.ZodLiteral<"idle">]>>;
      atHour: z.ZodOptional<z.ZodNumber>;
      idleMinutes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>>;
    store: z.ZodOptional<z.ZodString>;
    mainKey: z.ZodOptional<z.ZodString>;
    sendPolicy: z.ZodOptional<z.ZodOptional<z.ZodObject<{
      default: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
      rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
        action: z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>;
        match: z.ZodOptional<z.ZodObject<{
          channel: z.ZodOptional<z.ZodString>;
          chatType: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>>;
          keyPrefix: z.ZodOptional<z.ZodString>;
          rawKeyPrefix: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>>>;
    }, z.core.$strict>>>;
    threadBindings: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      idleHours: z.ZodOptional<z.ZodNumber>;
      maxAgeHours: z.ZodOptional<z.ZodNumber>;
      spawnSessions: z.ZodOptional<z.ZodBoolean>;
      defaultSpawnContext: z.ZodOptional<z.ZodEnum<{
        fork: "fork";
        isolated: "isolated";
      }>>;
    }, z.core.$strict>>;
    sharing: z.ZodOptional<z.ZodObject<{
      readOnly: z.ZodOptional<z.ZodBoolean>;
      suggest: z.ZodOptional<z.ZodBoolean>;
      drafts: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    maintenance: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodEnum<{
        enforce: "enforce";
        warn: "warn";
      }>>;
      coldStorage: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        afterDays: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      pruneAfter: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      archiveDashboardAfter: z.ZodOptional<z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodLiteral<false>, z.ZodLiteral<0>]>>;
      maxEntries: z.ZodOptional<z.ZodNumber>;
      preserveRecent: z.ZodOptional<z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodLiteral<false>]>>;
      resetArchiveRetention: z.ZodOptional<z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>, z.ZodLiteral<false>]>>;
      maxDiskBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodLiteral<false>]>>;
      highWaterBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  cron: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    skipMissedJobs: z.ZodOptional<z.ZodBoolean>;
    triggers: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    webhookToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
    webhookSsrfPolicy: z.ZodOptional<z.ZodObject<{
      dangerouslyAllowPrivateNetwork: z.ZodOptional<z.ZodBoolean>;
      allowRfc2544BenchmarkRange: z.ZodOptional<z.ZodBoolean>;
      allowIpv6UniqueLocalRange: z.ZodOptional<z.ZodBoolean>;
      allowedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
      blockedHostnames: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    sessionRetention: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<false>]>>;
    failureAlert: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      after: z.ZodOptional<z.ZodNumber>;
      cooldownMs: z.ZodOptional<z.ZodNumber>;
      includeSkipped: z.ZodOptional<z.ZodBoolean>;
      mode: z.ZodOptional<z.ZodEnum<{
        announce: "announce";
        webhook: "webhook";
      }>>;
      accountId: z.ZodOptional<z.ZodString>;
      channel: z.ZodOptional<z.ZodString>;
      to: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  transcripts: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    autoStart: z.ZodOptional<z.ZodArray<z.ZodObject<{
      providerId: z.ZodString;
      whenOccupied: z.ZodOptional<z.ZodBoolean>;
      sessionId: z.ZodOptional<z.ZodString>;
      title: z.ZodOptional<z.ZodString>;
      accountId: z.ZodOptional<z.ZodString>;
      guildId: z.ZodOptional<z.ZodString>;
      channelId: z.ZodOptional<z.ZodString>;
      meetingUrl: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
  hooks: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    path: z.ZodOptional<z.ZodString>;
    token: z.ZodOptional<z.ZodString>;
    defaultSessionKey: z.ZodOptional<z.ZodString>;
    allowRequestSessionKey: z.ZodOptional<z.ZodBoolean>;
    allowedSessionKeyPrefixes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    allowedAgentIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    presets: z.ZodOptional<z.ZodArray<z.ZodString>>;
    transformsDir: z.ZodOptional<z.ZodString>;
    mappings: z.ZodOptional<z.ZodArray<z.ZodOptional<z.ZodObject<{
      id: z.ZodOptional<z.ZodString>;
      match: z.ZodOptional<z.ZodObject<{
        path: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>>;
      action: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"wake">, z.ZodLiteral<"agent">]>>;
      wakeMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"now">, z.ZodLiteral<"next-heartbeat">]>>;
      name: z.ZodOptional<z.ZodString>;
      agentId: z.ZodOptional<z.ZodString>;
      sessionKey: z.ZodOptional<z.ZodString>;
      sessionMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"isolated">, z.ZodLiteral<"persistent">]>>;
      messageTemplate: z.ZodOptional<z.ZodString>;
      textTemplate: z.ZodOptional<z.ZodString>;
      forEach: z.ZodOptional<z.ZodString>;
      deliver: z.ZodOptional<z.ZodBoolean>;
      allowUnsafeExternalContent: z.ZodOptional<z.ZodBoolean>;
      channel: z.ZodOptional<z.ZodString>;
      to: z.ZodOptional<z.ZodString>;
      model: z.ZodOptional<z.ZodString>;
      thinking: z.ZodOptional<z.ZodString>;
      timeoutSeconds: z.ZodOptional<z.ZodNumber>;
      transform: z.ZodOptional<z.ZodObject<{
        module: z.ZodString;
        export: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
    }, z.core.$strict>>>>;
    gmail: z.ZodOptional<z.ZodObject<{
      account: z.ZodOptional<z.ZodString>;
      label: z.ZodOptional<z.ZodString>;
      topic: z.ZodOptional<z.ZodString>;
      subscription: z.ZodOptional<z.ZodString>;
      pushToken: z.ZodOptional<z.ZodString>;
      hookUrl: z.ZodOptional<z.ZodString>;
      includeBody: z.ZodOptional<z.ZodBoolean>;
      maxBytes: z.ZodOptional<z.ZodNumber>;
      renewEveryMinutes: z.ZodOptional<z.ZodNumber>;
      allowUnsafeExternalContent: z.ZodOptional<z.ZodBoolean>;
      serve: z.ZodOptional<z.ZodObject<{
        bind: z.ZodOptional<z.ZodString>;
        port: z.ZodOptional<z.ZodNumber>;
        path: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      tailscale: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"serve">, z.ZodLiteral<"funnel">]>>;
        path: z.ZodOptional<z.ZodString>;
        target: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      model: z.ZodOptional<z.ZodString>;
      thinking: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"minimal">, z.ZodLiteral<"low">, z.ZodLiteral<"medium">, z.ZodLiteral<"high">]>>;
    }, z.core.$strict>>;
    internal: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      entries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      }, z.core.$loose>>>;
      load: z.ZodOptional<z.ZodObject<{
        extraDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  channels: z.ZodType<ChannelsConfig | undefined, unknown, z.core.$ZodTypeInternals<ChannelsConfig | undefined, unknown>>;
  discovery: z.ZodOptional<z.ZodObject<{
    wideArea: z.ZodOptional<z.ZodObject<{
      domain: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    mdns: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodEnum<{
        full: "full";
        minimal: "minimal";
        off: "off";
      }>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  talk: z.ZodOptional<z.ZodObject<{
    agentId: z.ZodOptional<z.ZodString>;
    provider: z.ZodOptional<z.ZodString>;
    providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
    }, z.core.$catchall<z.ZodUnknown>>>>;
    realtime: z.ZodOptional<z.ZodObject<{
      provider: z.ZodOptional<z.ZodString>;
      providers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>;
      }, z.core.$catchall<z.ZodUnknown>>>>;
      model: z.ZodOptional<z.ZodString>;
      speakerVoice: z.ZodOptional<z.ZodString>;
      speakerVoiceId: z.ZodOptional<z.ZodString>;
      instructions: z.ZodOptional<z.ZodString>;
      mode: z.ZodOptional<z.ZodEnum<{
        realtime: "realtime";
        "stt-tts": "stt-tts";
        transcription: "transcription";
      }>>;
      transport: z.ZodOptional<z.ZodEnum<{
        "gateway-relay": "gateway-relay";
        "managed-room": "managed-room";
        "provider-websocket": "provider-websocket";
        webrtc: "webrtc";
      }>>;
      vadThreshold: z.ZodOptional<z.ZodNumber>;
      silenceDurationMs: z.ZodOptional<z.ZodNumber>;
      prefixPaddingMs: z.ZodOptional<z.ZodNumber>;
      reasoningEffort: z.ZodOptional<z.ZodString>;
      brain: z.ZodOptional<z.ZodEnum<{
        "agent-consult": "agent-consult";
        "direct-tools": "direct-tools";
        none: "none";
      }>>;
      consultRouting: z.ZodOptional<z.ZodEnum<{
        "force-agent-consult": "force-agent-consult";
        "provider-direct": "provider-direct";
      }>>;
    }, z.core.$strict>>;
    consultThinkingLevel: z.ZodOptional<z.ZodEnum<{
      adaptive: "adaptive";
      high: "high";
      low: "low";
      max: "max";
      medium: "medium";
      minimal: "minimal";
      off: "off";
      ultra: "ultra";
      xhigh: "xhigh";
    }>>;
    consultFastMode: z.ZodOptional<z.ZodBoolean>;
    speechLocale: z.ZodOptional<z.ZodString>;
    interruptOnSpeech: z.ZodOptional<z.ZodBoolean>;
    silenceTimeoutMs: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  gateway: z.ZodOptional<z.ZodObject<{
    port: z.ZodOptional<z.ZodNumber>;
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"local">, z.ZodLiteral<"remote">]>>;
    bind: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"lan">, z.ZodLiteral<"loopback">, z.ZodLiteral<"custom">, z.ZodLiteral<"tailnet">]>>;
    customBindHost: z.ZodOptional<z.ZodString>;
    publicOrigin: z.ZodOptional<z.ZodString>;
    portals: z.ZodOptional<z.ZodObject<{
      ingress: z.ZodOptional<z.ZodObject<{
        domain: z.ZodString;
        port: z.ZodNumber;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    controlUi: z.ZodOptional<z.ZodObject<{
      dangerouslyDisableDeviceAuth: z.ZodOptional<z.ZodBoolean>;
      enabled: z.ZodOptional<z.ZodBoolean>;
      basePath: z.ZodOptional<z.ZodString>;
      experimental: z.ZodOptional<z.ZodObject<{
        customPlugins: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      root: z.ZodOptional<z.ZodString>;
      environment: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        color: z.ZodEnum<{
          amber: "amber";
          blue: "blue";
          coral: "coral";
          gray: "gray";
          green: "green";
          pink: "pink";
          purple: "purple";
          red: "red";
          teal: "teal";
        }>;
      }, z.core.$strict>>;
      communityInvite: z.ZodOptional<z.ZodBoolean>;
      github: z.ZodOptional<z.ZodObject<{
        token: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>;
      }, z.core.$strict>>;
      sessionObserver: z.ZodOptional<z.ZodBoolean>;
      embedSandbox: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"strict">, z.ZodLiteral<"scripts">, z.ZodLiteral<"trusted">]>>;
      allowExternalEmbedUrls: z.ZodOptional<z.ZodBoolean>;
      automaticallyFetchFavicons: z.ZodOptional<z.ZodBoolean>;
      allowedOrigins: z.ZodOptional<z.ZodArray<z.ZodString>>;
      dangerouslyAllowHostHeaderOriginFallback: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    cliAgents: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    terminal: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      shell: z.ZodOptional<z.ZodString>;
      detachedSessionTimeoutSeconds: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    auth: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"token">, z.ZodLiteral<"password">, z.ZodLiteral<"trusted-proxy">]>>;
      token: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
      password: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
      allowTailscale: z.ZodOptional<z.ZodBoolean>;
      identityScopes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodEnum<{
        "operator.admin": "operator.admin";
        "operator.approvals": "operator.approvals";
        "operator.pairing": "operator.pairing";
        "operator.questions": "operator.questions";
        "operator.read": "operator.read";
        "operator.sessions.read": "operator.sessions.read";
        "operator.sessions.write": "operator.sessions.write";
        "operator.talk": "operator.talk";
        "operator.talk.secrets": "operator.talk.secrets";
        "operator.write": "operator.write";
      }>>>>;
      rateLimit: z.ZodOptional<z.ZodObject<{
        maxAttempts: z.ZodOptional<z.ZodNumber>;
        windowMs: z.ZodOptional<z.ZodNumber>;
        lockoutMs: z.ZodOptional<z.ZodNumber>;
        exemptLoopback: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      trustedProxy: z.ZodOptional<z.ZodObject<{
        userHeader: z.ZodString;
        requiredHeaders: z.ZodOptional<z.ZodArray<z.ZodString>>;
        allowUsers: z.ZodOptional<z.ZodArray<z.ZodString>>;
        allowLoopback: z.ZodOptional<z.ZodBoolean>;
        cloudflareAccessOidc: z.ZodOptional<z.ZodObject<{
          issuer: z.ZodString;
          providerId: z.ZodString;
          githubAccountIdClaim: z.ZodString;
        }, z.core.$strict>>;
        deviceAutoApprove: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          scopes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    roles: z.ZodOptional<z.ZodObject<{
      default: z.ZodString;
      definitions: z.ZodRecord<z.ZodString, z.ZodObject<{
        sessions: z.ZodObject<{
          others: z.ZodEnum<{
            none: "none";
            suggest: "suggest";
            view: "view";
            write: "write";
          }>;
        }, z.core.$strict>;
        sandbox: z.ZodOptional<z.ZodEnum<{
          inherit: "inherit";
          required: "required";
        }>>;
        agents: z.ZodUnion<readonly [z.ZodLiteral<"*">, z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>]>;
        scopes: z.ZodPipe<z.ZodArray<z.ZodEnum<{
          "operator.admin": "operator.admin";
          "operator.approvals": "operator.approvals";
          "operator.pairing": "operator.pairing";
          "operator.questions": "operator.questions";
          "operator.read": "operator.read";
          "operator.sessions.read": "operator.sessions.read";
          "operator.sessions.write": "operator.sessions.write";
          "operator.talk": "operator.talk";
          "operator.talk.secrets": "operator.talk.secrets";
          "operator.write": "operator.write";
        }>>, z.ZodTransform<("operator.admin" | "operator.approvals" | "operator.pairing" | "operator.questions" | "operator.read" | "operator.sessions.read" | "operator.sessions.write" | "operator.talk" | "operator.talk.secrets" | "operator.write")[], ("operator.admin" | "operator.approvals" | "operator.pairing" | "operator.questions" | "operator.read" | "operator.sessions.read" | "operator.sessions.write" | "operator.talk" | "operator.talk.secrets" | "operator.write")[]>>;
        accessPolicyPlugin: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    trustedProxies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    allowRealIpFallback: z.ZodOptional<z.ZodBoolean>;
    tools: z.ZodOptional<z.ZodObject<{
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    tailscale: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"serve">, z.ZodLiteral<"funnel">]>>;
      preserveFunnel: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    remote: z.ZodOptional<z.ZodObject<{
      url: z.ZodOptional<z.ZodString>;
      transport: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"ssh">, z.ZodLiteral<"direct">]>>;
      remotePort: z.ZodOptional<z.ZodNumber>;
      token: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
      password: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
      edgeAuth: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>>;
      tlsFingerprint: z.ZodOptional<z.ZodString>;
      sshTarget: z.ZodOptional<z.ZodString>;
      sshIdentity: z.ZodOptional<z.ZodString>;
      sshHostKeyPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"strict">, z.ZodLiteral<"openssh">]>>;
    }, z.core.$strict>>;
    reload: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"hybrid">]>>;
    }, z.core.$strict>>;
    tls: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      autoGenerate: z.ZodOptional<z.ZodBoolean>;
      certPath: z.ZodOptional<z.ZodString>;
      keyPath: z.ZodOptional<z.ZodString>;
      caPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    http: z.ZodOptional<z.ZodObject<{
      endpoints: z.ZodOptional<z.ZodObject<{
        chatCompletions: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          images: z.ZodOptional<z.ZodObject<{
            allowUrl: z.ZodOptional<z.ZodBoolean>;
            urlAllowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
            allowedMimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
            maxBytes: z.ZodOptional<z.ZodNumber>;
            maxRedirects: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
        responses: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          maxUrlParts: z.ZodOptional<z.ZodNumber>;
          files: z.ZodOptional<z.ZodObject<{
            allowUrl: z.ZodOptional<z.ZodBoolean>;
            urlAllowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
            allowedMimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
            maxBytes: z.ZodOptional<z.ZodNumber>;
            maxRedirects: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
            maxChars: z.ZodOptional<z.ZodNumber>;
            pdf: z.ZodOptional<z.ZodObject<{
              maxPages: z.ZodOptional<z.ZodNumber>;
              maxPixels: z.ZodOptional<z.ZodNumber>;
              minTextChars: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strict>>;
          }, z.core.$strict>>;
          images: z.ZodOptional<z.ZodObject<{
            allowUrl: z.ZodOptional<z.ZodBoolean>;
            urlAllowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
            allowedMimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
            maxBytes: z.ZodOptional<z.ZodNumber>;
            maxRedirects: z.ZodOptional<z.ZodNumber>;
            timeoutMs: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      securityHeaders: z.ZodOptional<z.ZodObject<{
        strictTransportSecurity: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<false>]>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    push: z.ZodOptional<z.ZodObject<{
      apns: z.ZodOptional<z.ZodObject<{
        relay: z.ZodOptional<z.ZodObject<{
          baseUrl: z.ZodOptional<z.ZodString>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    nodes: z.ZodOptional<z.ZodObject<{
      browser: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"manual">, z.ZodLiteral<"off">]>>;
        node: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      pairing: z.ZodOptional<z.ZodObject<{
        autoApproveLocal: z.ZodOptional<z.ZodBoolean>;
        autoApproveCidrs: z.ZodOptional<z.ZodArray<z.ZodString>>;
        sshVerify: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
          user: z.ZodOptional<z.ZodString>;
          identity: z.ZodOptional<z.ZodString>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
          cidrs: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>]>>;
      }, z.core.$strict>>;
      pluginTools: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      allowSkills: z.ZodOptional<z.ZodBoolean>;
      commands: z.ZodOptional<z.ZodObject<{
        allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
        deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  cloudWorkers: z.ZodOptional<z.ZodObject<{
    desktop: z.ZodOptional<z.ZodBoolean>;
    preparedPool: z.ZodOptional<z.ZodObject<{
      maxTotal: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    projectProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    profiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      provider: z.ZodString;
      install: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        bundle: "bundle";
        npm: "npm";
      }>>>;
      suspendAfter: z.ZodOptional<z.ZodString>;
      readyWorkers: z.ZodOptional<z.ZodNumber>;
      settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
  desktop: z.ZodOptional<z.ZodObject<{
    host: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodBoolean;
      managed: z.ZodOptional<z.ZodBoolean>;
      port: z.ZodOptional<z.ZodNumber>;
      passwordFile: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  memory: z.ZodOptional<z.ZodObject<{
    citations: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"on">, z.ZodLiteral<"off">]>>;
    search: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      rememberAcrossConversations: z.ZodOptional<z.ZodBoolean>;
      sources: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"memory">, z.ZodLiteral<"sessions">]>>>;
      extraPaths: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        path: z.ZodString;
        pattern: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>]>>>;
      multimodal: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        modalities: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"image">, z.ZodLiteral<"audio">, z.ZodLiteral<"all">]>>>;
        maxFileBytes: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      experimental: z.ZodOptional<z.ZodObject<{
        sessionMemory: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      provider: z.ZodOptional<z.ZodString>;
      remote: z.ZodOptional<z.ZodObject<{
        baseUrl: z.ZodOptional<z.ZodString>;
        apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
          source: z.ZodLiteral<"env">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"file">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"exec">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>, z.ZodObject<{
          source: z.ZodLiteral<"store">;
          provider: z.ZodString;
          id: z.ZodString;
        }, z.core.$strict>], "source">]>>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        batch: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      fallback: z.ZodOptional<z.ZodString>;
      model: z.ZodOptional<z.ZodString>;
      inputType: z.ZodOptional<z.ZodString>;
      queryInputType: z.ZodOptional<z.ZodString>;
      documentInputType: z.ZodOptional<z.ZodString>;
      outputDimensionality: z.ZodOptional<z.ZodNumber>;
      local: z.ZodOptional<z.ZodObject<{
        modelPath: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      store: z.ZodOptional<z.ZodObject<{
        fts: z.ZodOptional<z.ZodObject<{
          tokenizer: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"unicode61">, z.ZodLiteral<"trigram">]>>;
        }, z.core.$strict>>;
        vector: z.ZodOptional<z.ZodObject<{
          enabled: z.ZodOptional<z.ZodBoolean>;
          extensionPath: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      query: z.ZodOptional<z.ZodObject<{
        maxResults: z.ZodOptional<z.ZodNumber>;
        minScore: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
      cache: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  mcp: z.ZodOptional<z.ZodObject<{
    sessionIdleTtlMs: z.ZodOptional<z.ZodNumber>;
    servers: z.ZodOptional<z.ZodPreprocess<z.ZodRecord<z.ZodType<string, unknown, z.core.$ZodTypeInternals<string, unknown>>, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      command: z.ZodOptional<z.ZodString>;
      args: z.ZodOptional<z.ZodArray<z.ZodString>>;
      env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
      cwd: z.ZodOptional<z.ZodString>;
      url: z.ZodOptional<z.ZodString>;
      transport: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"stdio">, z.ZodLiteral<"sse">, z.ZodLiteral<"streamable-http">]>>;
      headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
      connectionTimeoutMs: z.ZodOptional<z.ZodNumber>;
      requestTimeoutMs: z.ZodOptional<z.ZodNumber>;
      supportsParallelToolCalls: z.ZodOptional<z.ZodBoolean>;
      auth: z.ZodOptional<z.ZodLiteral<"oauth">>;
      oauth: z.ZodOptional<z.ZodObject<{
        identity: z.ZodOptional<z.ZodEnum<{
          "per-requester": "per-requester";
          shared: "shared";
        }>>;
        authProfileId: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodString>;
        redirectUrl: z.ZodOptional<z.ZodString>;
        clientMetadataUrl: z.ZodOptional<z.ZodString>;
      }, z.core.$strict>>;
      sslVerify: z.ZodOptional<z.ZodBoolean>;
      clientCert: z.ZodOptional<z.ZodString>;
      clientKey: z.ZodOptional<z.ZodString>;
      toolFilter: z.ZodOptional<z.ZodObject<{
        include: z.ZodOptional<z.ZodArray<z.ZodString>>;
        exclude: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      codex: z.ZodOptional<z.ZodObject<{
        agents: z.ZodOptional<z.ZodArray<z.ZodString>>;
        defaultToolsApprovalMode: z.ZodOptional<z.ZodEnum<{
          approve: "approve";
          auto: "auto";
          prompt: "prompt";
        }>>;
      }, z.core.$strict>>;
    }, z.core.$catchall<z.ZodUnknown>>>, unknown>>;
    apps: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      sandboxOrigin: z.ZodOptional<z.ZodString>;
      sandboxPort: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  skills: z.ZodOptional<z.ZodObject<{
    allowBundled: z.ZodOptional<z.ZodArray<z.ZodString>>;
    load: z.ZodOptional<z.ZodObject<{
      extraDirs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      allowSymlinkTargets: z.ZodOptional<z.ZodArray<z.ZodString>>;
      watch: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    install: z.ZodOptional<z.ZodObject<{
      preferBrew: z.ZodOptional<z.ZodBoolean>;
      nodeManager: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"npm">, z.ZodLiteral<"pnpm">, z.ZodLiteral<"yarn">, z.ZodLiteral<"bun">]>>;
      allowUploadedArchives: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    limits: z.ZodOptional<z.ZodObject<{
      maxCandidatesPerRoot: z.ZodOptional<z.ZodNumber>;
      maxSkillsLoadedPerSource: z.ZodOptional<z.ZodNumber>;
      maxSkillsInPrompt: z.ZodOptional<z.ZodNumber>;
      maxSkillsPromptChars: z.ZodOptional<z.ZodNumber>;
      maxSkillFileBytes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    workshop: z.ZodOptional<z.ZodObject<{
      autonomous: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"propose">, z.ZodLiteral<"auto">]>>;
      }, z.core.$strict>>;
      approvalPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"auto">]>>;
      maxPending: z.ZodOptional<z.ZodNumber>;
      maxSkillBytes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    entries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      apiKey: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
      env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
      config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
  plugins: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    load: z.ZodOptional<z.ZodObject<{
      paths: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    slots: z.ZodOptional<z.ZodObject<{
      memory: z.ZodOptional<z.ZodString>;
      contextEngine: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    entries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      hooks: z.ZodOptional<z.ZodObject<{
        allowPromptInjection: z.ZodOptional<z.ZodBoolean>;
        allowConversationAccess: z.ZodOptional<z.ZodBoolean>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        timeouts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
      }, z.core.$strict>>;
      subagent: z.ZodOptional<z.ZodObject<{
        allowModelOverride: z.ZodOptional<z.ZodBoolean>;
        allowedModels: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
      llm: z.ZodOptional<z.ZodObject<{
        allowModelOverride: z.ZodOptional<z.ZodBoolean>;
        allowedModels: z.ZodOptional<z.ZodArray<z.ZodString>>;
        allowedCompletionModels: z.ZodOptional<z.ZodArray<z.ZodString>>;
        allowAuthProfileOverride: z.ZodOptional<z.ZodBoolean>;
        allowAgentIdOverride: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strict>>;
      config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>;
  surfaces: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    silentReply: z.ZodOptional<z.ZodObject<{
      group: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"disallow">]>>;
      internal: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"disallow">]>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>>;
  proxy: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    proxyUrl: z.ZodOptional<z.ZodURL>;
    tls: z.ZodOptional<z.ZodObject<{
      caFile: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    loopbackMode: z.ZodOptional<z.ZodEnum<{
      block: "block";
      "gateway-only": "gateway-only";
      proxy: "proxy";
    }>>;
  }, z.core.$strict>>;
};
//#endregion
//#region src/config/types.acp.d.ts
type SchemaAcpConfig = NonNullable<z.input<typeof OpenClawSchemaShape.acp>>;
type AcpStreamConfig = Omit<NonNullable<SchemaAcpConfig["stream"]>, "tagVisibility"> & {
  tagVisibility?: Partial<Record<AcpSessionUpdateTag, boolean>>;
};
type AcpConfig = Omit<SchemaAcpConfig, "stream"> & {
  stream?: AcpStreamConfig;
};
//#endregion
//#region src/config/zod-schema.agent-entry-base.d.ts
declare const AgentRuntimePolicySchema: z.ZodOptional<z.ZodObject<{
  id: z.ZodOptional<z.ZodString>;
}, z.core.$strict>>;
declare const AgentEntryBaseSchema: z.ZodObject<{
  id: z.ZodString;
  name: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  workspace: z.ZodOptional<z.ZodString>;
  cwd: z.ZodOptional<z.ZodString>;
  agentDir: z.ZodOptional<z.ZodString>;
  model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    primary: z.ZodOptional<z.ZodString>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>]>>;
  utilityModel: z.ZodOptional<z.ZodString>;
  decisionModel: z.ZodOptional<z.ZodString>;
  models: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    alias: z.ZodOptional<z.ZodString>;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    agentRuntime: z.ZodOptional<z.ZodObject<{
      id: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    pickerRuntimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    codeMode: z.ZodOptional<z.ZodBoolean>;
    streaming: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>>;
  modelPolicy: z.ZodOptional<z.ZodObject<{
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  thinkingDefault: z.ZodOptional<z.ZodEnum<{
    adaptive: "adaptive";
    high: "high";
    low: "low";
    max: "max";
    medium: "medium";
    minimal: "minimal";
    off: "off";
    ultra: "ultra";
    xhigh: "xhigh";
  }>>;
  verboseDefault: z.ZodOptional<z.ZodEnum<{
    full: "full";
    off: "off";
    on: "on";
  }>>;
  toolProgressDetail: z.ZodOptional<z.ZodEnum<{
    explain: "explain";
    raw: "raw";
  }>>;
  reasoningDefault: z.ZodOptional<z.ZodEnum<{
    off: "off";
    on: "on";
    stream: "stream";
  }>>;
  fastModeDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
  contextInjection: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"always">, z.ZodLiteral<"continuation-skip">, z.ZodLiteral<"never">]>>;
  bootstrapMaxChars: z.ZodOptional<z.ZodNumber>;
  bootstrapTotalMaxChars: z.ZodOptional<z.ZodNumber>;
  experimental: z.ZodOptional<z.ZodObject<{
    localModelLean: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
  subagents: z.ZodOptional<z.ZodObject<{
    delegationMode: z.ZodOptional<z.ZodEnum<{
      prefer: "prefer";
      suggest: "suggest";
    }>>;
    allowAgents: z.ZodOptional<z.ZodArray<z.ZodString>>;
    model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
      primary: z.ZodOptional<z.ZodString>;
      fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>]>>;
    thinking: z.ZodOptional<z.ZodString>;
    requireAgentId: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  embeddedAgent: z.ZodOptional<z.ZodObject<{
    executionContract: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"strict-agentic">]>>;
  }, z.core.$strict>>;
  params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  runtime: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"embedded">;
  }, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"acp">;
    acp: z.ZodOptional<z.ZodObject<{
      agent: z.ZodOptional<z.ZodString>;
      backend: z.ZodOptional<z.ZodString>;
      mode: z.ZodOptional<z.ZodEnum<{
        oneshot: "oneshot";
        persistent: "persistent";
      }>>;
      cwd: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>]>>;
}, z.core.$strict>;
//#endregion
//#region src/config/zod-schema.agent-model.d.ts
declare const AgentToolModelSchema: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
  primary: z.ZodOptional<z.ZodString>;
  fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
  timeoutMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>]>;
//#endregion
//#region src/config/types.agents-shared.d.ts
/** Tool-specific model selector with an optional capability timeout override. */
type AgentToolModelConfig = z.input<typeof AgentToolModelSchema>;
/** Runtime selection policy attached to providers, models, and agent defaults. */
type AgentRuntimePolicyConfig = NonNullable<z.input<typeof AgentRuntimePolicySchema>>;
/** Per-agent sandbox policy shared by embedded agents and sandbox backends. */
type AgentSandboxConfig = NonNullable<z.output<typeof AgentSandboxSchema>>;
//#endregion
//#region src/config/zod-schema.agent-defaults-base.d.ts
declare const AgentDefaultsBaseSchema: z.ZodObject<{
  params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    primary: z.ZodOptional<z.ZodString>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>]>>;
  modelSelectionScope: z.ZodOptional<z.ZodEnum<{
    agent: "agent";
    global: "global";
    session: "session";
  }>>;
  utilityModel: z.ZodOptional<z.ZodString>;
  decisionModel: z.ZodOptional<z.ZodString>;
  imageModel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    primary: z.ZodOptional<z.ZodString>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>]>>;
  mediaModels: z.ZodOptional<z.ZodObject<{
    image: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
      primary: z.ZodOptional<z.ZodString>;
      fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>;
    video: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
      primary: z.ZodOptional<z.ZodString>;
      fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>;
    music: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
      primary: z.ZodOptional<z.ZodString>;
      fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
      timeoutMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>]>>;
  }, z.core.$strict>>;
  voiceModel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    primary: z.ZodOptional<z.ZodString>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>]>>;
  pdfModel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    primary: z.ZodOptional<z.ZodString>;
    fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>]>>;
  pdfMaxMb: z.ZodOptional<z.ZodNumber>;
  pdfMaxPages: z.ZodOptional<z.ZodNumber>;
  models: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    alias: z.ZodOptional<z.ZodString>;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    agentRuntime: z.ZodOptional<z.ZodObject<{
      id: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    pickerRuntimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    codeMode: z.ZodOptional<z.ZodBoolean>;
    streaming: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>>;
  modelPolicy: z.ZodOptional<z.ZodObject<{
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  workspace: z.ZodOptional<z.ZodString>;
  cwd: z.ZodOptional<z.ZodString>;
  skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
  silentReply: z.ZodOptional<z.ZodObject<{
    group: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"disallow">]>>;
    internal: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"disallow">]>>;
  }, z.core.$strict>>;
  repoRoot: z.ZodOptional<z.ZodString>;
  skipBootstrap: z.ZodOptional<z.ZodBoolean>;
  skipOptionalBootstrapFiles: z.ZodOptional<z.ZodArray<z.ZodEnum<{
    "HEARTBEAT.md": "HEARTBEAT.md";
    "IDENTITY.md": "IDENTITY.md";
    "SOUL.md": "SOUL.md";
    "USER.md": "USER.md";
  }>>>;
  contextInjection: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"always">, z.ZodLiteral<"continuation-skip">, z.ZodLiteral<"never">]>>;
  bootstrapMaxChars: z.ZodOptional<z.ZodNumber>;
  bootstrapTotalMaxChars: z.ZodOptional<z.ZodNumber>;
  experimental: z.ZodOptional<z.ZodObject<{
    localModelLean: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  userTimezone: z.ZodOptional<z.ZodString>;
  startupContext: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    applyOn: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodLiteral<"new">, z.ZodLiteral<"reset">]>>>;
    dailyMemoryDays: z.ZodOptional<z.ZodNumber>;
    maxFileBytes: z.ZodOptional<z.ZodNumber>;
    maxFileChars: z.ZodOptional<z.ZodNumber>;
    maxTotalChars: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  contextPruning: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"cache-ttl">]>>;
    ttl: z.ZodOptional<z.ZodString>;
    tools: z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    hardClear: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      placeholder: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  compaction: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"safeguard">]>>;
    provider: z.ZodOptional<z.ZodString>;
    thinkingLevel: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
      adaptive: "adaptive";
      high: "high";
      low: "low";
      max: "max";
      medium: "medium";
      minimal: "minimal";
      off: "off";
      ultra: "ultra";
      xhigh: "xhigh";
    }>, z.ZodLiteral<"inherit">]>>;
    keepRecentTokens: z.ZodOptional<z.ZodNumber>;
    identifierPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"strict">, z.ZodLiteral<"off">]>>;
    recentTurnsPreserve: z.ZodOptional<z.ZodNumber>;
    qualityGuard: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      maxRetries: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
    midTurnPrecheck: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    postIndexSync: z.ZodOptional<z.ZodEnum<{
      async: "async";
      await: "await";
      off: "off";
    }>>;
    postCompactionSections: z.ZodOptional<z.ZodArray<z.ZodString>>;
    model: z.ZodOptional<z.ZodString>;
    timeoutSeconds: z.ZodOptional<z.ZodNumber>;
    memoryFlush: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
      model: z.ZodOptional<z.ZodString>;
      softThresholdTokens: z.ZodOptional<z.ZodNumber>;
      forceFlushTranscriptBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    }, z.core.$strict>>;
    maxActiveTranscriptBytes: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    notifyUser: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  embeddedAgent: z.ZodOptional<z.ZodObject<{
    projectSettingsPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"trusted">, z.ZodLiteral<"sanitize">, z.ZodLiteral<"ignore">]>>;
    executionContract: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"default">, z.ZodLiteral<"strict-agentic">]>>;
    cyberFailover: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"off">]>>;
      model: z.ZodOptional<z.ZodString>;
      cooloffMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  thinkingDefault: z.ZodOptional<z.ZodEnum<{
    adaptive: "adaptive";
    high: "high";
    low: "low";
    max: "max";
    medium: "medium";
    minimal: "minimal";
    off: "off";
    ultra: "ultra";
    xhigh: "xhigh";
  }>>;
  fastModeDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
  verboseDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">, z.ZodLiteral<"full">]>>;
  toolProgressDetail: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"explain">, z.ZodLiteral<"raw">]>>;
  reasoningDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">, z.ZodLiteral<"stream">]>>;
  elevatedDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">, z.ZodLiteral<"ask">, z.ZodLiteral<"full">]>>;
  blockStreamingDefault: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"on">]>>;
  blockStreamingBreak: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"text_end">, z.ZodLiteral<"message_end">]>>;
  timeoutSeconds: z.ZodOptional<z.ZodNumber>;
  mediaMaxMb: z.ZodOptional<z.ZodNumber>;
  imageMaxDimensionPx: z.ZodOptional<z.ZodNumber>;
  imageQuality: z.ZodOptional<z.ZodEnum<{
    auto: "auto";
    balanced: "balanced";
    efficient: "efficient";
    high: "high";
  }>>;
  typingIntervalSeconds: z.ZodOptional<z.ZodNumber>;
  systemAgent: z.ZodOptional<z.ZodObject<{
    agentId: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  authInheritance: z.ZodOptional<z.ZodObject<{
    agentId: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  sessionStore: z.ZodOptional<z.ZodObject<{
    agentId: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  maxConcurrent: z.ZodOptional<z.ZodNumber>;
  subagents: z.ZodOptional<z.ZodObject<{
    delegationMode: z.ZodOptional<z.ZodEnum<{
      prefer: "prefer";
      suggest: "suggest";
    }>>;
    allowAgents: z.ZodOptional<z.ZodArray<z.ZodString>>;
    maxConcurrent: z.ZodOptional<z.ZodNumber>;
    maxSpawnDepth: z.ZodOptional<z.ZodNumber>;
    maxChildrenPerAgent: z.ZodOptional<z.ZodNumber>;
    archiveAfterMinutes: z.ZodOptional<z.ZodNumber>;
    model: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
      primary: z.ZodOptional<z.ZodString>;
      fallbacks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>]>>;
    thinking: z.ZodOptional<z.ZodString>;
    runTimeoutSeconds: z.ZodOptional<z.ZodNumber>;
    announceTimeoutMs: z.ZodOptional<z.ZodNumber>;
    requireAgentId: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
}, z.core.$strict>;
//#endregion
//#region src/config/types.agent-defaults.d.ts
type SchemaAgentDefaultsConfig = z.input<typeof AgentDefaultsBaseSchema>;
type AgentModelEntryConfig = NonNullable<SchemaAgentDefaultsConfig["models"]>[string];
type AgentContextLimitsConfig = NonNullable<z.input<typeof AgentContextLimitsSchema>>;
type AgentDefaultsConfig = SchemaAgentDefaultsConfig & {
  /** @deprecated Doctor-only legacy input. */
  imageGenerationModel?: AgentToolModelConfig;
  /** @deprecated Doctor-only legacy input. */
  videoGenerationModel?: AgentToolModelConfig;
  /** @deprecated Doctor-only legacy input. */
  musicGenerationModel?: AgentToolModelConfig;
  /** @deprecated Doctor-only legacy input. */
  envelopeTimezone?: string;
  /** @deprecated Doctor-only legacy input. */
  envelopeTimestamp?: "on" | "off";
  /** @deprecated Doctor-only legacy input. */
  envelopeElapsed?: "on" | "off";
  /** @deprecated Doctor-only legacy input. */
  timeFormat?: "auto" | "12" | "24";
  /** @deprecated Doctor-only legacy input. */
  promptOverlays?: {
    gpt5?: {
      personality?: "friendly" | "on" | "off";
    };
  };
  /**
   * @deprecated Legacy raw config accepted only by doctor/migration repair.
   * Normal schema parsing rejects this key; use per-model agentRuntime instead.
   */
  agentRuntime?: AgentRuntimePolicyConfig;
  contextLimits?: AgentContextLimitsConfig;
  blockStreamingChunk?: BlockStreamingChunkConfig;
  blockStreamingCoalesce?: BlockStreamingCoalesceConfig;
  humanDelay?: HumanDelayConfig;
  typingMode?: TypingMode;
  heartbeat?: NonNullable<z.input<typeof HeartbeatSchema>> & {
    agentId?: string;
  };
  sandbox?: AgentSandboxConfig;
};
//#endregion
//#region src/config/types.skills.d.ts
type SkillsSchemaInput = NonNullable<z.input<typeof OpenClawSchemaShape.skills>>;
/** Per-skill runtime override keyed by skill name or source-specific skill key. */
type SkillConfig = Omit<NonNullable<SkillsSchemaInput["entries"]>[string], "apiKey"> & {
  /** Optional secret made available to the skill runtime through skill env handling. */
  apiKey?: SecretInput;
};
/** Limits that bound skill discovery and model-facing prompt expansion. */
type SkillsLimitsConfig = NonNullable<SkillsSchemaInput["limits"]>;
/** Top-level skills config block in openclaw config. */
type SkillsConfig = Omit<SkillsSchemaInput, "entries"> & {
  entries?: Record<string, SkillConfig>;
};
//#endregion
//#region src/config/zod-schema.agents.d.ts
declare const BindingsSchema: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
  type: z.ZodOptional<z.ZodLiteral<"route">>;
  agentId: z.ZodString;
  comment: z.ZodOptional<z.ZodString>;
  match: z.ZodObject<{
    channel: z.ZodString;
    accountId: z.ZodOptional<z.ZodString>;
    peer: z.ZodOptional<z.ZodObject<{
      kind: z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>;
      id: z.ZodString;
    }, z.core.$strict>>;
    guildId: z.ZodOptional<z.ZodString>;
    teamId: z.ZodOptional<z.ZodString>;
    roles: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>;
  session: z.ZodOptional<z.ZodObject<{
    dmScope: z.ZodOptional<z.ZodEnum<{
      main: "main";
      "per-account-channel-peer": "per-account-channel-peer";
      "per-channel-peer": "per-channel-peer";
      "per-peer": "per-peer";
    }>>;
    groupScope: z.ZodOptional<z.ZodEnum<{
      main: "main";
      "per-group": "per-group";
    }>>;
  }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
  type: z.ZodLiteral<"acp">;
  agentId: z.ZodString;
  comment: z.ZodOptional<z.ZodString>;
  match: z.ZodObject<{
    channel: z.ZodString;
    accountId: z.ZodOptional<z.ZodString>;
    peer: z.ZodOptional<z.ZodObject<{
      kind: z.ZodUnion<readonly [z.ZodLiteral<"direct">, z.ZodLiteral<"group">, z.ZodLiteral<"channel">]>;
      id: z.ZodString;
    }, z.core.$strict>>;
    guildId: z.ZodOptional<z.ZodString>;
    teamId: z.ZodOptional<z.ZodString>;
    roles: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>;
  acp: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodEnum<{
      oneshot: "oneshot";
      persistent: "persistent";
    }>>;
    label: z.ZodOptional<z.ZodString>;
    cwd: z.ZodOptional<z.ZodString>;
    backend: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
}, z.core.$strict>]>>>;
//#endregion
//#region src/config/types.agents.d.ts
type SchemaAgentBinding = NonNullable<z.input<typeof BindingsSchema>>[number];
type AgentRouteBinding = Extract<SchemaAgentBinding, {
  type?: "route";
}>;
type AgentAcpBinding = Extract<SchemaAgentBinding, {
  type: "acp";
}>;
type AgentBinding = AgentRouteBinding | AgentAcpBinding;
type AgentConfig = z.input<typeof AgentEntryBaseSchema> & {
  /** @deprecated Raw legacy list compatibility only; canonical agents.entries rejects this key. */
  default?: boolean;
  /**
   * @deprecated Legacy raw config accepted only by doctor/migration repair.
   * Normal schema parsing rejects this key; use per-model agentRuntime instead.
   */
  agentRuntime?: AgentModelEntryConfig["agentRuntime"];
  /** @deprecated Legacy per-agent compaction config is kept for raw doctor migration/repair. */
  compaction?: AgentDefaultsConfig["compaction"];
  memory?: {
    search?: MemorySearchConfig;
  };
  humanDelay?: HumanDelayConfig;
  typingMode?: AgentDefaultsConfig["typingMode"];
  tts?: TtsConfig & {
    prefsPath?: string;
  };
  skillsLimits?: Pick<SkillsLimitsConfig, "maxSkillsPromptChars">;
  contextLimits?: AgentContextLimitsConfig;
  heartbeat?: Omit<NonNullable<AgentDefaultsConfig["heartbeat"]>, "agentId">;
  identity?: IdentityConfig;
  groupChat?: Omit<GroupChatConfig, "visibleReplies">;
  /** Optional per-agent sandbox overrides. */
  sandbox?: AgentSandboxConfig;
  tools?: AgentToolsConfig;
};
type AgentEntryConfig = Omit<AgentConfig, "id">;
type AgentsConfig = {
  ownership?: "explicit";
  defaults?: AgentDefaultsConfig;
  entries?: Record<string, AgentEntryConfig>;
  /** Internal non-serialized projection materialized by validation for ID-based runtime code. */
  list?: AgentConfig[];
};
//#endregion
//#region src/config/types.auth.d.ts
type AuthProfileConfig = {
  /** Provider id this auth profile can satisfy. */
  provider: string;
  /**
   * Auth route selected by this profile id.
   * - api_key: static provider API key
   * - oauth: refreshable OAuth credentials (access+refresh+expires)
   * - token: static bearer-style token (optionally expiring; no refresh)
   * - aws-sdk: AWS SDK default credential chain (no secret in auth-profiles.json)
   */
  mode: "api_key" | "aws-sdk" | "oauth" | "token";
  /** Optional account email shown in profile selection/status surfaces. */
  email?: string;
  /** Optional human-readable label shown in profile selection/status surfaces. */
  displayName?: string;
};
type AuthConfig = {
  /** Named auth profiles keyed by profile id. */
  profiles?: Record<string, AuthProfileConfig>;
  /** Preferred profile order per provider id. */
  order?: Record<string, string[]>;
};
//#endregion
//#region src/config/types.ssrf.d.ts
type SsrFPolicyConfig = z.input<typeof SsrFPolicyConfigSchema>;
//#endregion
//#region src/config/types.browser.d.ts
type BrowserSchemaInput = NonNullable<z.input<typeof OpenClawSchemaShape.browser>>;
type BrowserProfileConfig = NonNullable<BrowserSchemaInput["profiles"]>[string] & {
  /** @deprecated Doctor-only legacy input; canonical schema rejects this field. */
  color?: string;
};
type BrowserSsrFPolicyConfig = SsrFPolicyConfig;
type BrowserConfig = Omit<BrowserSchemaInput, "profiles" | "ssrfPolicy"> & {
  /** @deprecated Doctor-only legacy input; canonical schema rejects this field. */
  color?: string;
  /** Named browser profiles with explicit CDP ports or URLs. */
  profiles?: Record<string, BrowserProfileConfig>;
  /** SSRF policy for browser navigation/open-tab operations. */
  ssrfPolicy?: BrowserSsrFPolicyConfig;
};
//#endregion
//#region src/config/zod-schema.cloud-workers.d.ts
declare const CloudWorkersConfigSchema: z.ZodOptional<z.ZodObject<{
  desktop: z.ZodOptional<z.ZodBoolean>;
  preparedPool: z.ZodOptional<z.ZodObject<{
    maxTotal: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  projectProfiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
  profiles: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
    provider: z.ZodString;
    install: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
      bundle: "bundle";
      npm: "npm";
    }>>>;
    suspendAfter: z.ZodOptional<z.ZodString>;
    readyWorkers: z.ZodOptional<z.ZodNumber>;
    settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strict>>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.cloud-workers.d.ts
type CloudWorkersConfig = NonNullable<z.input<typeof CloudWorkersConfigSchema>>;
//#endregion
//#region src/config/types.cron.d.ts
type CronSchemaInput = NonNullable<z.input<typeof OpenClawSchemaShape.cron>>;
type CronConfig = Omit<CronSchemaInput, "webhookToken" | "webhookSsrfPolicy"> & {
  /** Bearer token for cron webhook POST delivery. */
  webhookToken?: SecretInput;
  /** SSRF policy for all outbound cron webhook deliveries. */
  webhookSsrfPolicy?: SsrFPolicyConfig;
};
//#endregion
//#region src/config/zod-schema.desktop.d.ts
declare const DesktopConfigSchema: z.ZodOptional<z.ZodObject<{
  host: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodBoolean;
    managed: z.ZodOptional<z.ZodBoolean>;
    port: z.ZodOptional<z.ZodNumber>;
    passwordFile: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.desktop.d.ts
type DesktopConfig = NonNullable<z.input<typeof DesktopConfigSchema>>;
//#endregion
//#region src/config/zod-schema.gateway.d.ts
declare const GatewayConfigSchema: z.ZodOptional<z.ZodObject<{
  port: z.ZodOptional<z.ZodNumber>;
  mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"local">, z.ZodLiteral<"remote">]>>;
  bind: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"lan">, z.ZodLiteral<"loopback">, z.ZodLiteral<"custom">, z.ZodLiteral<"tailnet">]>>;
  customBindHost: z.ZodOptional<z.ZodString>;
  publicOrigin: z.ZodOptional<z.ZodString>;
  portals: z.ZodOptional<z.ZodObject<{
    ingress: z.ZodOptional<z.ZodObject<{
      domain: z.ZodString;
      port: z.ZodNumber;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  controlUi: z.ZodOptional<z.ZodObject<{
    dangerouslyDisableDeviceAuth: z.ZodOptional<z.ZodBoolean>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    basePath: z.ZodOptional<z.ZodString>;
    experimental: z.ZodOptional<z.ZodObject<{
      customPlugins: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    root: z.ZodOptional<z.ZodString>;
    environment: z.ZodOptional<z.ZodObject<{
      label: z.ZodString;
      color: z.ZodEnum<{
        amber: "amber";
        blue: "blue";
        coral: "coral";
        gray: "gray";
        green: "green";
        pink: "pink";
        purple: "purple";
        red: "red";
        teal: "teal";
      }>;
    }, z.core.$strict>>;
    communityInvite: z.ZodOptional<z.ZodBoolean>;
    github: z.ZodOptional<z.ZodObject<{
      token: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
        source: z.ZodLiteral<"env">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"file">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"exec">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>, z.ZodObject<{
        source: z.ZodLiteral<"store">;
        provider: z.ZodString;
        id: z.ZodString;
      }, z.core.$strict>], "source">]>>;
    }, z.core.$strict>>;
    sessionObserver: z.ZodOptional<z.ZodBoolean>;
    embedSandbox: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"strict">, z.ZodLiteral<"scripts">, z.ZodLiteral<"trusted">]>>;
    allowExternalEmbedUrls: z.ZodOptional<z.ZodBoolean>;
    automaticallyFetchFavicons: z.ZodOptional<z.ZodBoolean>;
    allowedOrigins: z.ZodOptional<z.ZodArray<z.ZodString>>;
    dangerouslyAllowHostHeaderOriginFallback: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  cliAgents: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  terminal: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    shell: z.ZodOptional<z.ZodString>;
    detachedSessionTimeoutSeconds: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strict>>;
  auth: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"none">, z.ZodLiteral<"token">, z.ZodLiteral<"password">, z.ZodLiteral<"trusted-proxy">]>>;
    token: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
    password: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
    allowTailscale: z.ZodOptional<z.ZodBoolean>;
    identityScopes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodEnum<{
      "operator.admin": "operator.admin";
      "operator.approvals": "operator.approvals";
      "operator.pairing": "operator.pairing";
      "operator.questions": "operator.questions";
      "operator.read": "operator.read";
      "operator.sessions.read": "operator.sessions.read";
      "operator.sessions.write": "operator.sessions.write";
      "operator.talk": "operator.talk";
      "operator.talk.secrets": "operator.talk.secrets";
      "operator.write": "operator.write";
    }>>>>;
    rateLimit: z.ZodOptional<z.ZodObject<{
      maxAttempts: z.ZodOptional<z.ZodNumber>;
      windowMs: z.ZodOptional<z.ZodNumber>;
      lockoutMs: z.ZodOptional<z.ZodNumber>;
      exemptLoopback: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    trustedProxy: z.ZodOptional<z.ZodObject<{
      userHeader: z.ZodString;
      requiredHeaders: z.ZodOptional<z.ZodArray<z.ZodString>>;
      allowUsers: z.ZodOptional<z.ZodArray<z.ZodString>>;
      allowLoopback: z.ZodOptional<z.ZodBoolean>;
      cloudflareAccessOidc: z.ZodOptional<z.ZodObject<{
        issuer: z.ZodString;
        providerId: z.ZodString;
        githubAccountIdClaim: z.ZodString;
      }, z.core.$strict>>;
      deviceAutoApprove: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        scopes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  roles: z.ZodOptional<z.ZodObject<{
    default: z.ZodString;
    definitions: z.ZodRecord<z.ZodString, z.ZodObject<{
      sessions: z.ZodObject<{
        others: z.ZodEnum<{
          none: "none";
          suggest: "suggest";
          view: "view";
          write: "write";
        }>;
      }, z.core.$strict>;
      sandbox: z.ZodOptional<z.ZodEnum<{
        inherit: "inherit";
        required: "required";
      }>>;
      agents: z.ZodUnion<readonly [z.ZodLiteral<"*">, z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>]>;
      scopes: z.ZodPipe<z.ZodArray<z.ZodEnum<{
        "operator.admin": "operator.admin";
        "operator.approvals": "operator.approvals";
        "operator.pairing": "operator.pairing";
        "operator.questions": "operator.questions";
        "operator.read": "operator.read";
        "operator.sessions.read": "operator.sessions.read";
        "operator.sessions.write": "operator.sessions.write";
        "operator.talk": "operator.talk";
        "operator.talk.secrets": "operator.talk.secrets";
        "operator.write": "operator.write";
      }>>, z.ZodTransform<("operator.admin" | "operator.approvals" | "operator.pairing" | "operator.questions" | "operator.read" | "operator.sessions.read" | "operator.sessions.write" | "operator.talk" | "operator.talk.secrets" | "operator.write")[], ("operator.admin" | "operator.approvals" | "operator.pairing" | "operator.questions" | "operator.read" | "operator.sessions.read" | "operator.sessions.write" | "operator.talk" | "operator.talk.secrets" | "operator.write")[]>>;
      accessPolicyPlugin: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  trustedProxies: z.ZodOptional<z.ZodArray<z.ZodString>>;
  allowRealIpFallback: z.ZodOptional<z.ZodBoolean>;
  tools: z.ZodOptional<z.ZodObject<{
    deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  tailscale: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"serve">, z.ZodLiteral<"funnel">]>>;
    preserveFunnel: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  remote: z.ZodOptional<z.ZodObject<{
    url: z.ZodOptional<z.ZodString>;
    transport: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"ssh">, z.ZodLiteral<"direct">]>>;
    remotePort: z.ZodOptional<z.ZodNumber>;
    token: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
    password: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>;
    edgeAuth: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodDiscriminatedUnion<[z.ZodObject<{
      source: z.ZodLiteral<"env">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"file">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"exec">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodLiteral<"store">;
      provider: z.ZodString;
      id: z.ZodString;
    }, z.core.$strict>], "source">]>>>;
    tlsFingerprint: z.ZodOptional<z.ZodString>;
    sshTarget: z.ZodOptional<z.ZodString>;
    sshIdentity: z.ZodOptional<z.ZodString>;
    sshHostKeyPolicy: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"strict">, z.ZodLiteral<"openssh">]>>;
  }, z.core.$strict>>;
  reload: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"hybrid">]>>;
  }, z.core.$strict>>;
  tls: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    autoGenerate: z.ZodOptional<z.ZodBoolean>;
    certPath: z.ZodOptional<z.ZodString>;
    keyPath: z.ZodOptional<z.ZodString>;
    caPath: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  http: z.ZodOptional<z.ZodObject<{
    endpoints: z.ZodOptional<z.ZodObject<{
      chatCompletions: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        images: z.ZodOptional<z.ZodObject<{
          allowUrl: z.ZodOptional<z.ZodBoolean>;
          urlAllowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
          allowedMimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
          maxBytes: z.ZodOptional<z.ZodNumber>;
          maxRedirects: z.ZodOptional<z.ZodNumber>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
      responses: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        maxUrlParts: z.ZodOptional<z.ZodNumber>;
        files: z.ZodOptional<z.ZodObject<{
          allowUrl: z.ZodOptional<z.ZodBoolean>;
          urlAllowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
          allowedMimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
          maxBytes: z.ZodOptional<z.ZodNumber>;
          maxRedirects: z.ZodOptional<z.ZodNumber>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
          maxChars: z.ZodOptional<z.ZodNumber>;
          pdf: z.ZodOptional<z.ZodObject<{
            maxPages: z.ZodOptional<z.ZodNumber>;
            maxPixels: z.ZodOptional<z.ZodNumber>;
            minTextChars: z.ZodOptional<z.ZodNumber>;
          }, z.core.$strict>>;
        }, z.core.$strict>>;
        images: z.ZodOptional<z.ZodObject<{
          allowUrl: z.ZodOptional<z.ZodBoolean>;
          urlAllowlist: z.ZodOptional<z.ZodArray<z.ZodString>>;
          allowedMimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
          maxBytes: z.ZodOptional<z.ZodNumber>;
          maxRedirects: z.ZodOptional<z.ZodNumber>;
          timeoutMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
    securityHeaders: z.ZodOptional<z.ZodObject<{
      strictTransportSecurity: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodLiteral<false>]>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  push: z.ZodOptional<z.ZodObject<{
    apns: z.ZodOptional<z.ZodObject<{
      relay: z.ZodOptional<z.ZodObject<{
        baseUrl: z.ZodOptional<z.ZodString>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strict>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
  nodes: z.ZodOptional<z.ZodObject<{
    browser: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"auto">, z.ZodLiteral<"manual">, z.ZodLiteral<"off">]>>;
      node: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    pairing: z.ZodOptional<z.ZodObject<{
      autoApproveLocal: z.ZodOptional<z.ZodBoolean>;
      autoApproveCidrs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      sshVerify: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
        user: z.ZodOptional<z.ZodString>;
        identity: z.ZodOptional<z.ZodString>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        cidrs: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strict>]>>;
    }, z.core.$strict>>;
    pluginTools: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    allowSkills: z.ZodOptional<z.ZodBoolean>;
    commands: z.ZodOptional<z.ZodObject<{
      allow: z.ZodOptional<z.ZodArray<z.ZodString>>;
      deny: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.gateway.d.ts
type GatewayConfigInput = NonNullable<z.input<typeof GatewayConfigSchema>>;
type TalkConfigInput = z.input<typeof TalkSchema>;
type WideAreaDiscoveryConfig = {
  /** Optional unicast DNS-SD domain (e.g. "openclaw.internal"). */
  domain?: string;
};
/** mDNS/Bonjour metadata exposure level for local gateway discovery. */
type MdnsDiscoveryMode = "off" | "minimal" | "full";
type MdnsDiscoveryConfig = {
  /**
   * mDNS/Bonjour discovery broadcast mode (default: minimal).
   * - off: disable mDNS entirely
   * - minimal: omit cliPath/sshPort from TXT records
   * - full: include cliPath/sshPort in TXT records
   */
  mode?: MdnsDiscoveryMode;
};
type DiscoveryConfig = {
  /** Wide-area DNS-SD discovery settings. */
  wideArea?: WideAreaDiscoveryConfig;
  /** Local mDNS/Bonjour discovery settings. */
  mdns?: MdnsDiscoveryConfig;
};
type TalkConfig = TalkConfigInput;
type GatewayControlUiConfig = Omit<NonNullable<GatewayConfigInput["controlUi"]>, "github" | "dangerouslyDisableDeviceAuth"> & {
  /** @deprecated Doctor-only legacy input. */
  chatMessageMaxWidth?: string;
  /**
   * @deprecated Upgrade-only transport input. Retained so releases that shipped
   * this break-glass flag can migrate an unpaired browser safely.
   */
  dangerouslyDisableDeviceAuth?: boolean;
  github?: {
    token?: SecretInput;
  };
};
type GatewayAuthConfig = Omit<NonNullable<GatewayConfigInput["auth"]>, "token" | "password"> & {
  token?: SecretInput;
  password?: SecretInput;
};
type GatewayTailscaleConfig = Omit<NonNullable<GatewayConfigInput["tailscale"]>, "preserveFunnel"> & {
  /** @deprecated Migrate to `mode="funnel"`, which uses managed ingress. */
  preserveFunnel?: boolean;
};
/** Gateway config reload strategy for managed installs. */
type GatewayReloadMode = "off" | "restart" | "hot" | "hybrid";
type GatewayReloadConfig = {
  /** Reload strategy for config changes (default: hybrid). */
  mode?: GatewayReloadMode;
};
type GatewayNodesConfig = NonNullable<GatewayConfigInput["nodes"]> & {
  /** @deprecated Doctor-only legacy input. */
  skills?: {
    enabled?: boolean;
  };
  /** @deprecated Doctor-only legacy input. */
  allowCommands?: string[];
  /** @deprecated Doctor-only legacy input. */
  denyCommands?: string[];
};
/** Optional named operator-role policies for Gateway deployments shared by a team. */
type GatewayOperatorRolesConfig = Omit<NonNullable<GatewayConfigInput["roles"]>, "default"> & {
  /** Required validated default for profiles without a valid assigned role. */
  default?: string;
};
type GatewayConfig = Omit<GatewayConfigInput, "controlUi" | "nodes" | "roles" | "reload" | "auth" | "tailscale"> & {
  auth?: GatewayAuthConfig;
  controlUi?: GatewayControlUiConfig;
  nodes?: GatewayNodesConfig;
  roles?: GatewayOperatorRolesConfig;
  reload?: GatewayReloadConfig;
  tailscale?: GatewayTailscaleConfig;
};
//#endregion
//#region src/config/zod-schema.installs.d.ts
declare const StrictPluginInstallRecordSchema: z.ZodObject<{
  spec: z.ZodOptional<z.ZodString>;
  sourcePath: z.ZodOptional<z.ZodString>;
  installPath: z.ZodOptional<z.ZodString>;
  version: z.ZodOptional<z.ZodString>;
  resolvedName: z.ZodOptional<z.ZodString>;
  resolvedVersion: z.ZodOptional<z.ZodString>;
  resolvedSpec: z.ZodOptional<z.ZodString>;
  integrity: z.ZodOptional<z.ZodString>;
  shasum: z.ZodOptional<z.ZodString>;
  resolvedAt: z.ZodOptional<z.ZodString>;
  installedAt: z.ZodOptional<z.ZodString>;
  clawhubUrl: z.ZodOptional<z.ZodString>;
  clawhubPackage: z.ZodOptional<z.ZodString>;
  clawhubFamily: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"code-plugin">, z.ZodLiteral<"bundle-plugin">]>>;
  clawhubChannel: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"official">, z.ZodLiteral<"community">, z.ZodLiteral<"private">]>>;
  clawhubTrustDisposition: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"clean">, z.ZodLiteral<"review-recommended">, z.ZodLiteral<"review-required">, z.ZodLiteral<"blocked">]>>;
  clawhubTrustScanStatus: z.ZodOptional<z.ZodString>;
  clawhubTrustModerationState: z.ZodOptional<z.ZodString>;
  clawhubTrustReasons: z.ZodOptional<z.ZodArray<z.ZodString>>;
  clawhubTrustPending: z.ZodOptional<z.ZodBoolean>;
  clawhubTrustStale: z.ZodOptional<z.ZodBoolean>;
  clawhubTrustCheckedAt: z.ZodOptional<z.ZodString>;
  clawhubTrustAcknowledgedAt: z.ZodOptional<z.ZodString>;
  artifactKind: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"legacy-zip">, z.ZodLiteral<"npm-pack">]>>;
  artifactFormat: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"zip">, z.ZodLiteral<"tgz">]>>;
  npmIntegrity: z.ZodOptional<z.ZodString>;
  npmShasum: z.ZodOptional<z.ZodString>;
  npmTarballName: z.ZodOptional<z.ZodString>;
  clawpackSha256: z.ZodOptional<z.ZodString>;
  clawpackSpecVersion: z.ZodOptional<z.ZodNumber>;
  clawpackManifestSha256: z.ZodOptional<z.ZodString>;
  clawpackSize: z.ZodOptional<z.ZodNumber>;
  gitUrl: z.ZodOptional<z.ZodString>;
  gitRef: z.ZodOptional<z.ZodString>;
  gitCommit: z.ZodOptional<z.ZodString>;
  source: z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodLiteral<"npm">, z.ZodLiteral<"archive">, z.ZodLiteral<"path">, z.ZodLiteral<"clawhub">, z.ZodLiteral<"git">]>, z.ZodLiteral<"marketplace">]>;
  marketplaceName: z.ZodOptional<z.ZodString>;
  marketplaceSource: z.ZodOptional<z.ZodString>;
  marketplacePlugin: z.ZodOptional<z.ZodString>;
  acceptedSurface: z.ZodOptional<z.ZodObject<{
    channels: z.ZodArray<z.ZodString>;
    providers: z.ZodArray<z.ZodString>;
    tools: z.ZodArray<z.ZodString>;
    contracts: z.ZodArray<z.ZodString>;
    hooks: z.ZodArray<z.ZodString>;
    mcpServers: z.ZodArray<z.ZodString>;
    cliCommands: z.ZodArray<z.ZodString>;
    cliBackends: z.ZodArray<z.ZodString>;
    skills: z.ZodArray<z.ZodString>;
    dangerousConfigFlags: z.ZodArray<z.ZodString>;
  }, z.core.$strict>>;
  acceptedSurfaceHash: z.ZodOptional<z.ZodString>;
  acceptedSurfaceAt: z.ZodOptional<z.ZodString>;
  acceptedSurfaceIntegrity: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type PluginInstallRecord = z.infer<typeof StrictPluginInstallRecordSchema>;
//#endregion
//#region src/config/zod-schema.hooks.d.ts
declare const HookMappingSchema: z.ZodOptional<z.ZodObject<{
  id: z.ZodOptional<z.ZodString>;
  match: z.ZodOptional<z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  action: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"wake">, z.ZodLiteral<"agent">]>>;
  wakeMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"now">, z.ZodLiteral<"next-heartbeat">]>>;
  name: z.ZodOptional<z.ZodString>;
  agentId: z.ZodOptional<z.ZodString>;
  sessionKey: z.ZodOptional<z.ZodString>;
  sessionMode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"isolated">, z.ZodLiteral<"persistent">]>>;
  messageTemplate: z.ZodOptional<z.ZodString>;
  textTemplate: z.ZodOptional<z.ZodString>;
  forEach: z.ZodOptional<z.ZodString>;
  deliver: z.ZodOptional<z.ZodBoolean>;
  allowUnsafeExternalContent: z.ZodOptional<z.ZodBoolean>;
  channel: z.ZodOptional<z.ZodString>;
  to: z.ZodOptional<z.ZodString>;
  model: z.ZodOptional<z.ZodString>;
  thinking: z.ZodOptional<z.ZodString>;
  timeoutSeconds: z.ZodOptional<z.ZodNumber>;
  transform: z.ZodOptional<z.ZodObject<{
    module: z.ZodString;
    export: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
}, z.core.$strict>>;
type HookMappingConfigInput = NonNullable<z.input<typeof HookMappingSchema>>;
//#endregion
//#region src/config/types.hooks.d.ts
type HookMappingConfig = Omit<HookMappingConfigInput, "channel"> & {
  /** Preserve channel-id autocomplete while allowing runtime plugin channels. */
  channel?: "last" | (string & {});
};
type HooksSchemaInput = NonNullable<z.input<typeof OpenClawSchemaShape.hooks>>;
type HooksConfig = Omit<HooksSchemaInput, "mappings"> & {
  mappings?: HookMappingConfig[];
};
//#endregion
//#region src/config/zod-schema.mcp-server.d.ts
declare const McpServerSchema: z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  command: z.ZodOptional<z.ZodString>;
  args: z.ZodOptional<z.ZodArray<z.ZodString>>;
  env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
  cwd: z.ZodOptional<z.ZodString>;
  url: z.ZodOptional<z.ZodString>;
  transport: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"stdio">, z.ZodLiteral<"sse">, z.ZodLiteral<"streamable-http">]>>;
  headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
  connectionTimeoutMs: z.ZodOptional<z.ZodNumber>;
  requestTimeoutMs: z.ZodOptional<z.ZodNumber>;
  supportsParallelToolCalls: z.ZodOptional<z.ZodBoolean>;
  auth: z.ZodOptional<z.ZodLiteral<"oauth">>;
  oauth: z.ZodOptional<z.ZodObject<{
    identity: z.ZodOptional<z.ZodEnum<{
      "per-requester": "per-requester";
      shared: "shared";
    }>>;
    authProfileId: z.ZodOptional<z.ZodString>;
    scope: z.ZodOptional<z.ZodString>;
    redirectUrl: z.ZodOptional<z.ZodString>;
    clientMetadataUrl: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  sslVerify: z.ZodOptional<z.ZodBoolean>;
  clientCert: z.ZodOptional<z.ZodString>;
  clientKey: z.ZodOptional<z.ZodString>;
  toolFilter: z.ZodOptional<z.ZodObject<{
    include: z.ZodOptional<z.ZodArray<z.ZodString>>;
    exclude: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  codex: z.ZodOptional<z.ZodObject<{
    agents: z.ZodOptional<z.ZodArray<z.ZodString>>;
    defaultToolsApprovalMode: z.ZodOptional<z.ZodEnum<{
      approve: "approve";
      auto: "auto";
      prompt: "prompt";
    }>>;
  }, z.core.$strict>>;
}, z.core.$catchall<z.ZodUnknown>>;
type McpServerConfigInput = z.input<typeof McpServerSchema>;
//#endregion
//#region src/config/types.mcp.d.ts
type McpServerConfig = McpServerConfigInput;
type McpConfigSchemaInput = NonNullable<z.input<typeof McpConfigSchema>>;
type McpConfig = Omit<McpConfigSchemaInput, "servers"> & {
  servers?: Record<string, McpServerConfig>;
};
//#endregion
//#region packages/llm-core/src/utils/provider-refusal.d.ts
/** Provider-authored findings; continuation is offered only after explicit user review. */
type ProviderRefusalReview = {
  explanation: string;
  continuation?: {
    message: string;
  };
  errorType?: string;
};
//#endregion
//#region packages/llm-core/src/utils/diagnostics.d.ts
interface DiagnosticErrorInfo {
  name?: string;
  message: string;
  stack?: string;
  code?: string | number;
}
interface AssistantMessageDiagnostic {
  type: string;
  timestamp: number;
  error?: DiagnosticErrorInfo;
  details?: Record<string, unknown>;
}
//#endregion
//#region packages/llm-core/src/types.d.ts
/** Provider API families with first-class request/stream adapters in OpenClaw. */
type KnownApi = "openai-completions" | "mistral-conversations" | "openai-responses" | "azure-openai-responses" | "openai-chatgpt-responses" | "anthropic-messages" | "bedrock-converse-stream" | "google-generative-ai" | "google-vertex";
/** Provider API id; custom providers can use ids outside the built-in set. */
type Api = KnownApi | (string & {});
/** Provider id used for routing, diagnostics, and config lookups. */
type Provider = string;
/** Plain assistant/user text content block. */
interface TextContent {
  type: "text";
  text: string;
  textSignature?: string;
}
/** Provider reasoning/thinking content block, including opaque replay signatures. */
interface ThinkingContent {
  type: "thinking";
  thinking: string;
  thinkingSignature?: string;
  /** When true, the thinking content was redacted by safety filters. The opaque
   *  encrypted payload is stored in `thinkingSignature` so it can be passed back
   *  to the API for multi-turn continuity. */
  redacted?: boolean;
}
/** Opaque provider-owned state that must survive transcript replay without being rendered. */
interface ProviderReplayState {
  v: 1;
  type: string;
  id?: string;
  data: string;
  replayIndex?: number;
  provider: Provider;
  api: Api;
  model: string;
  baseUrlHash?: string;
  sessionHash?: string;
  authProfileHash?: string;
}
/** Base64 image content block with MIME type metadata. */
interface ImageContent {
  type: "image";
  data: string;
  mimeType: string;
}
/** Normalized assistant tool call emitted by providers or repaired from text. */
interface ToolCall {
  /** The provider completed this call and permits generation to continue without its result. */
  async?: true;
  type: "toolCall";
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  thoughtSignature?: string;
  executionMode?: "sequential" | "parallel";
}
/** Normalized token and cost accounting for a provider response. */
interface Usage {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  /** Whether the provider reported a cache-read/write token split. */
  cacheTelemetry?: {
    state: "available" | "unavailable";
  };
  /** Subset of `cacheWrite` written with 1-hour retention when reported. */
  cacheWrite1h?: number;
  /** Exact context snapshot for the final provider iteration. */
  contextUsage?: {
    state: "available";
    promptTokens: number;
    totalTokens: number;
  } | {
    state: "unavailable";
  };
  totalTokens: number;
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    total: number;
    /** Provenance for the recorded total cost; provider-billed totals are authoritative. */
    totalOrigin?: "provider-billed";
  };
}
/** Per-million-token rates for separately billed token buckets. */
type ModelCostRates = ModelDataCostRates;
type RawPricingTier = ModelDataRawPricingTier;
type RawModelCostConfig = ModelCostRates & {
  tieredPricing?: RawPricingTier[];
};
/** Normalized assistant stop reasons across text providers. */
type StopReason = "stop" | "length" | "toolUse" | "error" | "aborted";
/** User turn in a text-model conversation. */
interface UserMessage {
  role: "user";
  content: string | (TextContent | ImageContent)[];
  timestamp: number;
  /**
   * Marks a user message carrying runtime context. Provider replay policy decides
   * whether the carrier is transient or retained append-only; only retained
   * carriers are stable prompt-cache anchors.
   */
  runtimeContextCarrier?: boolean;
}
/** Assistant turn, including provider identity and final stop state. */
type AssistantDeliveryTtsFacts = {
  tagged: true;
  text?: string;
  directives?: Array<{
    provider?: string;
    values: Record<string, string>;
  }>;
};
interface AssistantMessage {
  role: "assistant";
  content: (TextContent | ThinkingContent | ToolCall)[];
  openclawDelivery?: {
    audioAsVoice?: true;
    /** Exact media directives consumed by the managed-media transcript rewrite owner. */
    mediaUrls?: string[];
    replyToCurrent?: true;
    replyToId?: string;
    /** Provider text phase is unresolved until the assistant turn reaches terminal state. */
    textPhaseRequiresTerminal?: true;
    /** Parsed once at the assistant write boundary; delivery resolves policy from these facts. */
    tts?: AssistantDeliveryTtsFacts;
  };
  api: Api;
  provider: Provider;
  model: string;
  responseModel?: string;
  responseId?: string;
  providerReplay?: ProviderReplayState;
  turnId?: string;
  diagnostics?: AssistantMessageDiagnostic[];
  usage: Usage;
  stopReason: StopReason;
  /** A completed provider response can explicitly request another inference with false. */
  endTurn?: boolean;
  errorMessage?: string;
  errorCode?: string;
  errorType?: string;
  errorBody?: string;
  timestamp: number;
}
/** Tool result turn that answers a prior assistant tool call. */
interface ToolResultMessage<TDetails = unknown> {
  role: "toolResult";
  toolCallId: string;
  toolName: string;
  content: (TextContent | ImageContent)[];
  details?: TDetails;
  isError: boolean;
  timestamp: number;
}
/** Any text-model conversation message supported by LLM core. */
type Message = UserMessage | AssistantMessage | ToolResultMessage;
/**
 * Compatibility settings for OpenAI-compatible completions APIs.
 * Use this to override URL-based auto-detection for custom providers.
 */
interface OpenAICompletionsCompat {
  /** Whether the provider supports the `store` field. Default: auto-detected from URL. */
  supportsStore?: boolean;
  /** Whether the provider supports the `developer` role (vs `system`). Default: auto-detected from URL. */
  supportsDeveloperRole?: boolean;
  /** Whether the provider supports `reasoning_effort`. Default: auto-detected from URL. */
  supportsReasoningEffort?: boolean;
  /** Provider-native reasoning efforts accepted by the model. Overrides known model defaults. */
  supportedReasoningEfforts?: string[];
  /** Per-level reasoning effort overrides, e.g. map "off" to "low" for models that cannot disable thinking. */
  reasoningEffortMap?: Record<string, string>;
  /** Whether the provider supports `stream_options: { include_usage: true }` for token usage in streaming responses. Default: true. */
  supportsUsageInStreaming?: boolean;
  /** Which field to use for max tokens. Default: auto-detected from URL. */
  maxTokensField?: "max_completion_tokens" | "max_tokens";
  /** Whether tool results require the `name` field. Default: auto-detected from URL. */
  requiresToolResultName?: boolean;
  /** Whether a user message after tool results requires an assistant message in between. Default: auto-detected from URL. */
  requiresAssistantAfterToolResult?: boolean;
  /** Whether thinking blocks must be converted to text blocks with <thinking> delimiters. Default: auto-detected from URL. */
  requiresThinkingAsText?: boolean;
  /** Whether all replayed assistant messages must include an empty reasoning_content field when reasoning is enabled. Default: auto-detected from URL. */
  requiresReasoningContentOnAssistantMessages?: boolean;
  /** Format for reasoning/thinking parameter. "openai" uses reasoning_effort, "openrouter" uses reasoning: { effort }, "deepseek" uses thinking: { type } plus reasoning_effort, "together" uses reasoning: { enabled } plus reasoning_effort when supported, "zai" uses top-level enable_thinking: boolean, "qwen" uses top-level enable_thinking: boolean, and "qwen-chat-template" uses chat_template_kwargs.enable_thinking. Default: "openai". */
  thinkingFormat?: ModelDataThinkingFormat;
  /** OpenRouter-specific routing preferences. Only used when baseUrl points to OpenRouter. */
  openRouterRouting?: OpenRouterRouting;
  /** Vercel AI Gateway routing preferences. Only used when baseUrl points to Vercel AI Gateway. */
  vercelGatewayRouting?: VercelGatewayRouting;
  /** Whether z.ai supports top-level `tool_stream: true` for streaming tool call deltas. Default: false. */
  zaiToolStream?: boolean;
  /** Whether the provider supports the `strict` field in tool definitions. Default: true. */
  supportsStrictMode?: boolean;
  /** Whether the provider supports JSON Schema through `response_format`. Default: false for unknown compatible endpoints. */
  supportsJsonSchemaResponseFormat?: boolean;
  /** Cache control convention for prompt caching. "anthropic" applies Anthropic-style `cache_control` markers to the system prompt, last tool definition, and last user/assistant text content. */
  cacheControlFormat?: "anthropic";
  /** Whether to send known session-affinity headers (`session_id`, `x-client-request-id`, `x-session-affinity`) from `options.sessionId` when caching is enabled. Default: false. */
  sendSessionAffinityHeaders?: boolean;
  /** Whether the provider supports OpenAI-style `prompt_cache_key`. Default: false for third-party completions providers. */
  supportsPromptCacheKey?: boolean;
  /** Whether the provider supports long prompt cache retention (`prompt_cache_retention: "24h"` or Anthropic-style `cache_control.ttl: "1h"`, depending on format). Default: true. */
  supportsLongCacheRetention?: boolean;
}
/**
 * OpenRouter provider routing preferences.
 * Controls which upstream providers OpenRouter routes requests to.
 * Sent as the `provider` field in the OpenRouter API request body.
 * Own member declarations preserve existing module-augmentation semantics.
 * @see https://openrouter.ai/docs/guides/routing/provider-selection
 */
interface OpenRouterRouting {
  /** Whether to allow backup providers to serve requests. Default: true. */
  allow_fallbacks?: boolean;
  /** Whether to filter providers to only those that support all parameters in the request. Default: false. */
  require_parameters?: boolean;
  /** Data collection setting. "allow" (default): allow providers that may store/train on data. "deny": only use providers that don't collect user data. */
  data_collection?: "deny" | "allow";
  /** Whether to restrict routing to only ZDR (Zero Data Retention) endpoints. */
  zdr?: boolean;
  /** Whether to restrict routing to only models that allow text distillation. */
  enforce_distillable_text?: boolean;
  /** An ordered list of provider names/slugs to try in sequence, falling back to the next if unavailable. */
  order?: string[];
  /** List of provider names/slugs to exclusively allow for this request. */
  only?: string[];
  /** List of provider names/slugs to skip for this request. */
  ignore?: string[];
  /** A list of quantization levels to filter providers by (e.g., ["fp16", "bf16", "fp8", "fp6", "int8", "int4", "fp4", "fp32"]). */
  quantizations?: string[];
  /** Sorting strategy. Can be a string (e.g., "price", "throughput", "latency") or an object with `by` and `partition`. */
  sort?: string | ModelRoutingSortConfig;
  /** Maximum price per million tokens (USD). */
  max_price?: ModelRoutingMaxPrice;
  /** Preferred minimum throughput (tokens/second). Can be a number (applies to p50) or an object with percentile-specific cutoffs. */
  preferred_min_throughput?: number | ModelRoutingPercentiles;
  /** Preferred maximum latency (seconds). Can be a number (applies to p50) or an object with percentile-specific cutoffs. */
  preferred_max_latency?: number | ModelRoutingPercentiles;
}
/**
 * Vercel AI Gateway routing preferences.
 * Controls which upstream providers the gateway routes requests to.
 * @see https://vercel.com/docs/ai-gateway/models-and-providers/provider-options
 */
interface VercelGatewayRouting {
  /** List of provider slugs to exclusively use for this request (e.g., ["bedrock", "anthropic"]). */
  only?: string[];
  /** List of provider slugs to try in order (e.g., ["anthropic", "openai"]). */
  order?: string[];
}
//#endregion
//#region src/config/types.models.d.ts
type ModelsSchemaInput = NonNullable<z.input<typeof ModelsConfigSchema>>;
type ModelProviderSchemaInput = NonNullable<ModelsSchemaInput["providers"]>[string];
type ModelDefinitionSchemaInput = NonNullable<ModelProviderSchemaInput["models"]>[number];
/** Provider/model compatibility switches consumed by request builders and tool schema adapters. */
type ModelCompatConfig = Omit<NonNullable<ModelDefinitionSchemaInput["compat"]>, "openRouterRouting" | "vercelGatewayRouting"> & Pick<OpenAICompletionsCompat, "openRouterRouting" | "vercelGatewayRouting">;
type ModelMediaInputConfig = ModelDataMediaInputConfig;
type ModelDefinitionConfig = Omit<ModelDefinitionSchemaInput, "reasoning" | "input" | "cost" | "maxTokens" | "agentRuntime" | "mediaInput" | "compat"> & {
  /** Whether the model supports reasoning/thinking controls. */
  reasoning: boolean;
  /** Supported input modalities for routing and media-tool selection. */
  input: NonNullable<ModelDefinitionSchemaInput["input"]>;
  /** Token pricing in USD per million tokens. */
  cost: RawModelCostConfig;
  /** Maximum completion/output token budget. */
  maxTokens: number;
  /** Optional agent execution runtime override for this provider/model pair. */
  agentRuntime?: AgentRuntimePolicyConfig;
  /** Provider compatibility flags for payload shaping and feature gating. */
  compat?: ModelCompatConfig;
  /** Media input limits used by routing and preflight compression. */
  mediaInput?: ModelMediaInputConfig;
};
type ModelProviderConfig = Omit<ModelProviderSchemaInput, "baseUrl" | "models" | "apiKey" | "headers" | "request" | "agentRuntime"> & {
  /** Provider API base URL. */
  baseUrl: string;
  /** API key or secret reference for this provider. */
  apiKey?: SecretInput;
  /** Secret-bearing headers merged into provider requests. */
  headers?: Record<string, SecretInput>;
  /** Provider request transport/retry overrides. */
  request?: ConfiguredModelProviderRequest;
  /** Optional default agent execution runtime for models under this provider. */
  agentRuntime?: AgentRuntimePolicyConfig;
  /** Model catalog entries exposed by this provider. */
  models: ModelDefinitionConfig[];
};
type ModelsConfig = Omit<ModelsSchemaInput, "providers"> & {
  /** Configured provider catalog keyed by provider id. */
  providers?: Record<string, ModelProviderConfig>;
};
//#endregion
//#region src/config/types.node-host.d.ts
type NodeHostSchemaInput = NonNullable<z.input<typeof NodeHostSchema>>;
type NodeHostConfig = Omit<NodeHostSchemaInput, "mcp"> & {
  mcp?: {
    servers?: Record<string, McpServerConfig>;
  };
};
//#endregion
//#region src/config/types.plugins.d.ts
type PluginsSchemaInput = NonNullable<z.input<typeof OpenClawSchemaShape.plugins>>;
type PluginsConfig = PluginsSchemaInput & {
  /**
   * Internal transient carrier for plugin install records during command flows.
   * This is intentionally omitted from the config schema and must not be
   * persisted to openclaw.json.
   */
  installs?: Record<string, PluginInstallRecord>;
};
//#endregion
//#region src/config/zod-schema.telemetry.d.ts
declare const TelemetryConfigSchema: z.ZodOptional<z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  consentedAt: z.ZodOptional<z.ZodString>;
}, z.core.$strict>>;
//#endregion
//#region src/config/types.telemetry.d.ts
type TelemetryConfig = NonNullable<z.input<typeof TelemetryConfigSchema>>;
//#endregion
//#region src/config/zod-schema.proxy.d.ts
declare const ProxyConfigSchema: z.ZodOptional<z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  proxyUrl: z.ZodOptional<z.ZodURL>;
  tls: z.ZodOptional<z.ZodObject<{
    caFile: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  loopbackMode: z.ZodOptional<z.ZodEnum<{
    block: "block";
    "gateway-only": "gateway-only";
    proxy: "proxy";
  }>>;
}, z.core.$strict>>;
type ProxyConfig = z.infer<typeof ProxyConfigSchema>;
//#endregion
//#region src/config/types.openclaw.d.ts
/** One persisted suppression for a known security audit finding. */
type SecurityAuditSuppression = {
  /** Exact security audit check id to suppress. */
  checkId: string;
  /** Optional case-insensitive substring required in the finding title. */
  titleIncludes?: string;
  /** Optional case-insensitive substring required in the finding detail. */
  detailIncludes?: string;
  /** Operator rationale for accepting this standing finding. */
  reason?: string;
};
type SecurityConfig = {
  /** Security audit policy and accepted standing findings. */
  audit?: {
    /** Accepted security audit findings to omit from active summary/findings. */
    suppressions?: SecurityAuditSuppression[];
  };
  installPolicy?: {
    /**
     * Enable operator-owned install policy. When true without an exec command,
     * install/update attempts fail closed for supported targets.
     */
    enabled?: boolean;
    /** Supported install targets. Omit to cover every supported target. */
    targets?: Array<"skill" | "plugin">;
    /**
     * Trusted local policy command. Transport intentionally mirrors exec
     * SecretRef provider fields: absolute command, no shell, bounded output,
     * explicit env allowlist, and secure path checks.
     */
    exec?: {
      source: "exec";
      command: string;
      args?: string[];
      timeoutMs?: number;
      noOutputTimeoutMs?: number;
      maxOutputBytes?: number;
      env?: Record<string, string>;
      passEnv?: string[];
      trustedDirs?: string[];
    };
  };
};
type SurfaceConfigEntry = {
  /** Surface-specific silent reply policy for channels or UI integrations. */
  silentReply?: SilentReplyPolicyShape;
};
/** Top-level OpenClaw config as read from user/project config files. */
type OpenClawConfig = {
  /** @deprecated Doctor-only legacy input. */
  audit?: AuditConfig;
  /** JSON schema URL used by editors and generated config files. */
  $schema?: string;
  meta?: {
    /** Last OpenClaw version that wrote this config. */
    lastTouchedVersion?: string;
    /** One-time doctor migrations already applied to this config. */
    migrations?: {
      modelPolicyAllowlist?: true;
      utilityModelSeparation?: true;
    };
  };
  /** Authentication provider/profile configuration. */
  auth?: AuthConfig;
  /** Named access groups used by channel/provider policy allowlists. */
  accessGroups?: AccessGroupsConfig;
  /** ACP integration settings. */
  acp?: AcpConfig;
  env?: {
    /** Opt-in: import missing secrets from a login shell environment (interactive for Bash). */
    shellEnv?: {
      enabled?: boolean;
      /** Timeout for the login shell exec (ms). Default: 15000. */
      timeoutMs?: number;
    };
    /** Inline env vars to apply when not already present in the process env. */
    vars?: Record<string, string>;
    /** Sugar: allow env vars directly under env (string values only). */
    [key: string]: string | Record<string, string> | {
      enabled?: boolean;
      timeoutMs?: number;
    } | undefined;
  };
  wizard?: {
    /** Guided-onboarding discovery consent: "full" scans silently, "guarded" asks first. */
    accessMode?: "full" | "guarded";
    /** Offer installed-application plugin and skill recommendations during onboarding. */
    appRecommendations?: boolean;
    lastRunAt?: string;
    lastRunVersion?: string;
    lastRunCommit?: string;
    lastRunCommand?: string;
    lastRunMode?: "local" | "remote";
    securityAcknowledgedAt?: string;
  };
  /** Diagnostics, tracing, and stability debugging settings. */
  diagnostics?: DiagnosticsConfig;
  /** Log sink, level, rotation, and redaction settings. */
  logging?: LoggingConfig;
  /** Security audit suppressions and security policy settings. */
  security?: SecurityConfig;
  update?: {
    /** Update channel for git + npm installs ("stable", "extended-stable", "beta", or "dev"). */
    channel?: "stable" | "extended-stable" | "beta" | "dev";
    /** Check for updates on gateway start; disabling also prevents anonymous update pings. */
    checkOnStart?: boolean;
    /** Core auto-update policy for package installs. */
    auto?: {
      /** Enable background auto-update checks and apply logic. Default: false. */
      enabled?: boolean;
    };
  };
  /** Explicit operator consent for anonymous feature statistics in the daily update check. */
  telemetry?: TelemetryConfig;
  /** Browser automation and browser plugin integration settings. */
  browser?: BrowserConfig;
  ui?: {
    /** Accent color for OpenClaw UI chrome (hex). */
    seamColor?: string;
    /**
     * Operator display preferences. Canonical config home so agents can
     * change them through the approval gate and clients stay in sync; the
     * Control UI mirrors them into browser storage for instant boot.
     */
    prefs?: {
      /** Control UI theme. */
      theme?: "claw" | "knot" | "dash" | "absolutely" | "tide" | "beacon" | "phosphor" | "crt" | "manuscript" | "rose" | "miami" | "custom";
      /** Light/dark preference. */
      themeMode?: "light" | "dark" | "system";
      /** Control UI accent: #RRGGBB, or "theme" to bypass inherited accent colors. */
      accent?: string;
      /** BCP 47 UI locale, e.g. "en" or "pt-BR". */
      locale?: string;
      /** Show model thinking output in chat. */
      chatShowThinking?: boolean;
      /** Show tool call cards in chat. */
      chatShowToolCalls?: boolean;
      /** Keep model commentary in Control UI transcripts after a run. */
      chatPersistCommentary?: boolean;
      /** Chat send shortcut: Enter sends, or modifier+Enter sends. */
      chatSendShortcut?: "enter" | "modifier-enter";
      /** Follow-up handling while a run is active; unset uses the server queue mode. */
      chatFollowUpMode?: "steer" | "queue";
      /** Ordered page and pinned-session entries shown in the Control UI sidebar. */
      sidebarEntries?: string[];
    };
  };
  /** Secret providers, defaults, and ref-resolution settings. */
  secrets?: SecretsConfig;
  /** Skill loading and bundled skill configuration. */
  skills?: SkillsConfig;
  /** Plugin registry/install/runtime configuration. */
  plugins?: PluginsConfig;
  /** Per-surface policy keyed by channel/UI/runtime surface id. */
  surfaces?: Record<string, SurfaceConfigEntry>;
  /** Model providers, model catalog, pricing, and catalog merge policy. */
  models?: ModelsConfig;
  /** Node-host pairing and remote command node settings. */
  nodeHost?: NodeHostConfig;
  /** Agent definitions, defaults, bindings, and runtime policy. */
  agents?: AgentsConfig;
  /** Global root for new managed worktrees. Defaults to <state-dir>/worktrees; accepts ~. */
  worktreeRoot?: string;
  /** Use filesystem acceleration for new worktrees when supported (default: true). */
  worktreeAcceleration?: boolean;
  /** Tool exposure, policy, web/media tools, exec, and code-mode settings. */
  tools?: ToolsConfig;
  /** Legacy/direct agent bindings used by runtime resolution. */
  bindings?: AgentBinding[];
  /** Broadcast command and delivery settings. */
  broadcast?: BroadcastConfig;
  attachments?: {
    /** Optional retention window for persisted inbound media cleanup. */
    ttlHours?: number;
  };
  /** Message formatting, delivery, and action settings. */
  messages?: MessagesConfig;
  /** Shared text-to-speech defaults. Agent and channel overrides layer over this config. */
  tts?: TtsConfig;
  /** Chat command settings. */
  commands?: CommandsConfig;
  /** Human approval workflow settings. */
  approvals?: ApprovalsConfig;
  /** Session keying, reset, maintenance, send-policy, and thread-binding settings. */
  session?: SessionConfig;
  /** Channel defaults, built-in channel sections, and plugin-owned channel config. */
  channels?: ChannelsConfig;
  /** Cron schedule and retention settings. */
  cron?: CronConfig;
  /** Transcript persistence and export settings. */
  transcripts?: TranscriptsConfig;
  /** Runtime hook registration and queue behavior. */
  hooks?: HooksConfig;
  /** Network discovery and service advertisement settings. */
  discovery?: DiscoveryConfig;
  /** Voice/talk mode configuration. */
  talk?: TalkConfig;
  /** Gateway server, auth, UI, node-pairing, and dispatch settings. */
  gateway?: GatewayConfig;
  /** Opt-in cloud-worker provider profiles. */
  cloudWorkers?: CloudWorkersConfig;
  /** Experimental desktop sources owned by the gateway host. */
  desktop?: DesktopConfig;
  /** Memory indexing/search configuration. */
  memory?: MemoryConfig;
  /** MCP client/server and Codex MCP approval configuration. */
  mcp?: McpConfig;
  /** Network-level SSRF protection via an operator-managed forward proxy. */
  proxy?: ProxyConfig;
};
//#endregion
//#region src/runtime.d.ts
type RuntimeExitOptions = {
  /** Route ANSI terminal-reset bytes away from structured stdout when needed. */
  resetStream?: NodeJS.WriteStream;
};
type RuntimeEnv = {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  /**
   * Exit the process after restoring terminal state.
   * Pass `resetStream` to route the ANSI reset sequence to a specific
   * stream (e.g. stderr) when structured output on stdout must stay clean.
   */
  exit: (code: number, opts?: RuntimeExitOptions) => void;
};
//#endregion
//#region src/infra/sqlite-reader-lifecycle.d.ts
type SqliteReaderOwner = {
  operation: string;
  ownerKind: "main" | "worker";
  actorId?: number;
};
type SqliteReaderDiagnostic = SqliteReaderOwner & {
  kind: "iterator";
  connectionId: number;
  threadId: number;
  ageMs: number;
  idleMs: number;
};
type SqliteReaderDiagnostics = {
  scope: "current-thread";
  blockingOwner: "unknown";
  nativeStatements: "unobserved";
  threadId: number;
  observedAtMs: number;
  connectionCount: number;
  readerCount: number;
  connections: Array<SqliteReaderOwner & {
    connectionId: number;
    threadId: number;
    ageMs: number;
    transactionOpen: boolean;
    trackedReaders: number;
  }>;
  activeReaders: SqliteReaderDiagnostic[];
};
//#endregion
//#region src/infra/sqlite-wal-checkpoint.d.ts
type SqliteWalHealth = {
  state: "complete" | "blocked" | "error";
  observedAtMs: number;
  walBytes: number | null;
  databaseBytes: number | null;
  logFrames: number | null;
  checkpointedFrames: number | null;
  lastCompletedAtMs: number | null;
  consecutiveBlocked: number;
  warning: boolean;
  error?: string;
  activeReaders?: SqliteReaderDiagnostic[];
  readerDiagnostics?: Array<Omit<SqliteReaderDiagnostics, "activeReaders">>;
};
//#endregion
//#region src/config/io.runtime.d.ts
declare function loadConfig$1(options?: {
  skipPluginValidation?: boolean;
  pin?: boolean;
  skipShellEnvFallback?: boolean;
}): OpenClawConfig;
//#endregion
//#region src/config/sessions/provider-review.types.d.ts
/** Runtime-authored precaution for one failed turn in this session generation. */
type SessionProviderReview = {
  id: string;
  sessionId: string;
  runId: string;
  provider: string;
  model: string;
  runtimeId: string;
  api?: string;
  review?: ProviderRefusalReview;
  nativeThreadId?: string;
  nativeTurnId?: string;
};
//#endregion
//#region src/config/sessions/activity-summary.d.ts
declare const ActivitySummarySchema: z.ZodObject<{
  version: z.ZodLiteral<1>;
  formatRevision: z.ZodOptional<z.ZodNumber>;
  text: z.ZodString;
  updatedAt: z.ZodNumber;
  sessionId: z.ZodString;
  lifecycleRevision: z.ZodOptional<z.ZodString>;
  generation: z.ZodNullable<z.ZodString>;
  maxSeq: z.ZodNullable<z.ZodNumber>;
  leafEntryId: z.ZodNullable<z.ZodString>;
  coveredMessages: z.ZodNumber;
  totalMessages: z.ZodNumber;
  omittedContent: z.ZodBoolean;
}, z.core.$strip>;
type SessionActivitySummary = z.infer<typeof ActivitySummarySchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/skill-library.d.ts
declare const SkillLibrarySelectionSchema: Type.TObject<{
  skillId: Type.TString;
  revision: Type.TString;
  /** Persisted command identity: library collisions never shadow workspace names. */
  name: Type.TString;
  ownerProfileId: Type.TUnion<[Type.TString, Type.TNull]>;
}>;
type SkillLibrarySelection = Static<typeof SkillLibrarySelectionSchema>;
//#endregion
//#region src/security/external-content-source.d.ts
/** Hook session sources that carry untrusted external content into agent prompts. */
type HookExternalContentSource = "email" | "gmail" | "webhook";
//#endregion
//#region packages/gateway-protocol/src/schema/session-participant.d.ts
declare const SessionParticipantSchema: Type.TObject<{
  identity: Type.TUnion<[Type.TObject<{
    type: Type.TLiteral<"profile">;
    id: Type.TString;
  }>, Type.TObject<{
    type: Type.TLiteral<"agent">;
    id: Type.TString;
  }>, Type.TObject<{
    type: Type.TLiteral<"remote">;
    pluginId: Type.TString;
    domain: Type.TString;
    idKind: Type.TString;
    id: Type.TString;
  }>, Type.TObject<{
    type: Type.TLiteral<"observation">;
    pluginId: Type.TUnion<[Type.TString, Type.TNull]>;
    accountId: Type.TUnion<[Type.TString, Type.TNull]>;
    senderKind: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"bot">, Type.TLiteral<"unknown">]>;
    id: Type.TString;
  }>, Type.TObject<{
    type: Type.TLiteral<"legacy">;
    actorType: Type.TString;
    source: Type.TUnion<[Type.TString, Type.TNull]>;
    id: Type.TString;
  }>]>;
  label: Type.TOptional<Type.TString>;
  avatarUrl: Type.TOptional<Type.TString>;
}>;
type SessionParticipant = Static<typeof SessionParticipantSchema>;
//#endregion
//#region src/config/sessions/session-entry-provenance.d.ts
/** Kept aligned with SessionStateActorType (src/sessions/session-state-event-kinds.ts); not imported to avoid layering config/sessions onto src/sessions. */
type SessionActor = {
  type: "human" | "agent" | "system";
  id?: string;
  label?: string;
};
/** Only trusted creation owners may stamp a Gateway profile namespace. */
type SessionCreatedActor = SessionActor & ({
  type: "human";
  source: "profile" | "channel" | "unknown";
} | {
  type: "agent" | "system";
});
type SessionOwnerAssignment = {
  actor: SessionActor;
  assignedBy?: SessionActor;
  assignedAt?: number;
};
type SessionCreatedVia = "operator" | "spawn" | "channel" | "cron" | "talk" | "run" | "plugin" | "internal";
type SessionEntryProvenance = {
  /** Plugin id that owns this session through a trusted runtime creation seam. */
  pluginOwnerId?: string;
  /** External hook source that has contributed content to this transcript. */
  hookExternalContentSource?: HookExternalContentSource;
};
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-goal.d.ts
declare const SessionGoalSchema: Type.TObject<{
  schemaVersion: Type.TLiteral<1>;
  id: Type.TString;
  objective: Type.TString;
  status: Type.TUnion<[Type.TLiteral<"active">, Type.TLiteral<"paused">, Type.TLiteral<"blocked">, Type.TLiteral<"usage_limited">, Type.TLiteral<"budget_limited">, Type.TLiteral<"complete">]>;
  createdAt: Type.TNumber;
  updatedAt: Type.TNumber;
  tokenStart: Type.TNumber;
  tokenStartFresh: Type.TOptional<Type.TBoolean>;
  tokensUsed: Type.TNumber;
  tokenBudget: Type.TOptional<Type.TNumber>;
  continuationTurns: Type.TNumber;
  lastStatusNote: Type.TOptional<Type.TString>;
  pausedAt: Type.TOptional<Type.TNumber>;
  blockedAt: Type.TOptional<Type.TNumber>;
  completedAt: Type.TOptional<Type.TNumber>;
  usageLimitedAt: Type.TOptional<Type.TNumber>;
  budgetLimitedAt: Type.TOptional<Type.TNumber>;
}>;
type SessionGoal = Static<typeof SessionGoalSchema>;
declare const SessionsGoalMutationResultSchema: Type.TObject<{
  operationId: Type.TString;
  action: Type.TUnion<[Type.TLiteral<"start">, Type.TLiteral<"edit">, Type.TLiteral<"pause">, Type.TLiteral<"resume">, Type.TLiteral<"complete">, Type.TLiteral<"block">, Type.TLiteral<"clear">]>;
  sessionId: Type.TString;
  goalId: Type.TString;
  goal: Type.TOptional<Type.TObject<{
    schemaVersion: Type.TLiteral<1>;
    id: Type.TString;
    objective: Type.TString;
    status: Type.TUnion<[Type.TLiteral<"active">, Type.TLiteral<"paused">, Type.TLiteral<"blocked">, Type.TLiteral<"usage_limited">, Type.TLiteral<"budget_limited">, Type.TLiteral<"complete">]>;
    createdAt: Type.TNumber;
    updatedAt: Type.TNumber;
    tokenStart: Type.TNumber;
    tokenStartFresh: Type.TOptional<Type.TBoolean>;
    tokensUsed: Type.TNumber;
    tokenBudget: Type.TOptional<Type.TNumber>;
    continuationTurns: Type.TNumber;
    lastStatusNote: Type.TOptional<Type.TString>;
    pausedAt: Type.TOptional<Type.TNumber>;
    blockedAt: Type.TOptional<Type.TNumber>;
    completedAt: Type.TOptional<Type.TNumber>;
    usageLimitedAt: Type.TOptional<Type.TNumber>;
    budgetLimitedAt: Type.TOptional<Type.TNumber>;
  }>>;
  runId: Type.TOptional<Type.TString>;
  replayed: Type.TOptional<Type.TLiteral<true>>;
  status: Type.TUnion<[Type.TLiteral<"started">, Type.TLiteral<"updated">, Type.TLiteral<"cleared">]>;
}>;
type SessionsGoalMutationResult = Static<typeof SessionsGoalMutationResultSchema>;
//#endregion
//#region src/config/sessions/goals-operations.types.d.ts
type SessionGoalOperationResult = Omit<SessionsGoalMutationResult, "replayed">;
type SessionTranscriptTurnMutationResult = {
  result: SessionGoalOperationResult;
  replayed: boolean;
};
//#endregion
//#region src/channels/inbound-event/kind.d.ts
/**
 * High-level inbound event class used to separate actionable user requests from room activity.
 */
type InboundEventKind = "user_request" | "room_event";
//#endregion
//#region src/gateway/ui-command-target.types.d.ts
/** Presentation destination captured from the requesting Control UI, never model arguments. */
type GatewayUiCommandTarget = Readonly<{
  connId: string;
  profileId?: string;
}>;
//#endregion
//#region packages/media-understanding-common/src/types.d.ts
/** Kind of media-understanding output produced for an attachment. */
type MediaUnderstandingKind = "audio.transcription" | "video.description" | "image.description";
/** Capability exposed by a media-understanding provider. */
type MediaUnderstandingCapability = "image" | "audio" | "video";
/** Normalized text output produced by media understanding. */
type MediaUnderstandingOutput = {
  kind: MediaUnderstandingKind;
  attachmentIndex: number;
  text: string;
  provider: string;
  model?: string;
  requestedBackend?: string;
  observedBackend?: string;
};
//#endregion
//#region src/media-understanding/types.d.ts
type MediaUnderstandingDecisionOutcome = "success" | "failed" | "skipped" | "disabled" | "no-attachment" | "scope-deny";
type MediaUnderstandingModelDecision = {
  provider?: string;
  model?: string;
  requestedBackend?: string;
  observedBackend?: string;
  type: "provider" | "cli";
  outcome: "success" | "skipped" | "failed";
  reason?: string;
};
type MediaUnderstandingAttachmentDecision = {
  attachmentIndex: number;
  attempts: MediaUnderstandingModelDecision[];
  chosen?: MediaUnderstandingModelDecision;
};
type MediaAttachmentDisposition = {
  kind: "handled";
} | {
  kind: "handed-to-native-vision";
} | {
  kind: "not-selected";
} | {
  kind: "capability-disabled";
} | {
  kind: "no-model";
} | {
  kind: "scope-denied";
} | {
  kind: "failed";
  reason?: string;
};
type MediaAttachmentProcessing = "completed" | "omitted";
type MediaUnderstandingDecision = {
  capability: MediaUnderstandingCapability;
  outcome: MediaUnderstandingDecisionOutcome;
  attachments: MediaUnderstandingAttachmentDecision[];
  attachmentDispositions?: Record<number, MediaAttachmentDisposition>;
  attachmentProcessing?: Record<number, MediaAttachmentProcessing>;
  nativeVisionActive?: boolean;
};
//#endregion
//#region packages/media-core/src/constants.d.ts
/** Canonical media families used by attachment facts, routing, and MIME classification. */
type MediaKind = "image" | "audio" | "video" | "document" | "sticker" | "unknown";
//#endregion
//#region src/media/prompt-image-order.d.ts
/** Tracks whether prompt images stayed inline or were offloaded while preserving model order. */
type PromptImageOrderEntry = "inline" | "offloaded";
//#endregion
//#region src/media/media-facts.d.ts
/** One ordered runtime attachment; array position is its alignment identity. */
type MediaFact = {
  path?: string;
  url?: string;
  contentType?: string;
  kind?: MediaKind;
  fileName?: string;
  /** Composer attachment provenance for display; never part of model input. */
  origin?: "paste" | "file";
  sizeBytes?: number;
  durationMs?: number;
  width?: number;
  height?: number;
  transcribed?: boolean;
  messageId?: string;
  workspaceDir?: string;
  /** Internal proof that this exact fact was covered by a legacy staged projection. */
  staged?: boolean;
  hydrationSuppressed?: boolean;
};
//#endregion
//#region src/plugins/hook-channel-context.types.d.ts
interface PluginHookChannelSenderContext {
  /** Channel-scoped sender ID, matching `ctx.senderId` when both are present. */
  id?: string;
  [key: string]: unknown;
}
interface PluginHookChannelChatContext {
  /** Transport-native conversation ID, matching `ctx.chatId` when both are present. */
  id?: string;
  [key: string]: unknown;
}
interface PluginHookChannelContext {
  /** Sender metadata supplied by the originating channel. */
  sender?: PluginHookChannelSenderContext;
  /** Chat/conversation metadata supplied by the originating channel. */
  chat?: PluginHookChannelChatContext;
}
//#endregion
//#region packages/agent-core/src/types.d.ts
interface BashExecutionMessage {
  /** Harness role for shell command transcripts. */
  role: "bashExecution";
  /** Command line that was executed. */
  command: string;
  /** Captured command output, usually already truncated for context. */
  output: string;
  /** Process exit code when the command reached process exit. */
  exitCode: number | undefined;
  /** True when the command was interrupted before normal completion. */
  cancelled: boolean;
  /** True when output was shortened for transcript/context storage. */
  truncated: boolean;
  /** Optional path containing the complete output when truncation occurred. */
  fullOutputPath?: string;
  /** Millisecond timestamp for transcript ordering. */
  timestamp: number;
  /** Exclude this command transcript from model context while keeping it in session history. */
  excludeFromContext?: boolean;
}
interface CustomMessage<T = unknown> {
  /** Harness role for application-defined transcript content. */
  role: "custom";
  /** Application-defined discriminator for rendering or handling this message. */
  customType: string;
  /** Content replayed into model context when this message is included. */
  content: string | (TextContent | ImageContent)[];
  /** Whether UI surfaces should display this message. */
  display: boolean;
  /** Keep display-only application activity out of future model context. */
  excludeFromContext?: boolean;
  /** Optional application-specific metadata. */
  details?: T;
  /** Millisecond timestamp for transcript ordering. */
  timestamp: number;
}
interface BranchSummaryMessage {
  /** Harness role for summaries produced when returning from another branch. */
  role: "branchSummary";
  /** Summary text inserted back into model context. */
  summary: string;
  /** Entry id of the branch root or source leaf being summarized. */
  fromId: string;
  /** Millisecond timestamp for transcript ordering. */
  timestamp: number;
}
interface CompactionSummaryMessage {
  /** Harness role for summaries that replace compacted transcript history. */
  role: "compactionSummary";
  /** Summary text inserted back into model context. */
  summary: string;
  /** Estimated context tokens before compaction. */
  tokensBefore: number;
  /** Timestamp may be numeric in memory or string when loaded from older persisted rows. */
  timestamp: number | string;
  /** Optional estimated context tokens after compaction. */
  tokensAfter?: number;
  /** Optional first retained entry id from the compaction range. */
  firstKeptEntryId?: string;
  /** Optional implementation-specific compaction metadata. */
  details?: unknown;
}
/**
 * Extensible interface for custom app and harness messages.
 * Apps can extend via declaration merging.
 */
interface CustomAgentMessages {
  bashExecution: BashExecutionMessage;
  custom: CustomMessage;
  branchSummary: BranchSummaryMessage;
  compactionSummary: CompactionSummaryMessage;
}
/**
 * AgentMessage: Union of LLM messages + custom messages.
 * This abstraction allows apps to add custom message types while maintaining
 * type safety and compatibility with the base LLM messages.
 */
type AgentMessage = Message | CustomAgentMessages[keyof CustomAgentMessages];
//#endregion
//#region src/sessions/input-provenance.d.ts
declare const INPUT_PROVENANCE_KIND_VALUES: readonly ["external_user", "inter_session", "internal_system"];
type InputProvenanceKind = (typeof INPUT_PROVENANCE_KIND_VALUES)[number];
type InputProvenance = {
  kind: InputProvenanceKind;
  originSessionId?: string;
  sourceSessionKey?: string;
  sourceChannel?: string;
  sourceTool?: string;
  sourceRole?: "subagent";
  sourcePromptPrefix?: string;
  jobId?: string;
  runId?: string;
};
//#endregion
//#region src/auto-reply/command-turn-context.d.ts
type BaseCommandTurnContext = {
  commandName?: string;
  body?: string;
};
type NativeCommandTurnContext = BaseCommandTurnContext & {
  kind: "native";
  source: "native";
  authorized: boolean;
};
type TextSlashCommandTurnContext = BaseCommandTurnContext & {
  kind: "text-slash";
  source: "text";
  authorized: boolean;
};
type NormalCommandTurnContext = BaseCommandTurnContext & {
  kind: "normal";
  source: "message";
  authorized: false;
};
type CommandTurnContext = NativeCommandTurnContext | TextSlashCommandTurnContext | NormalCommandTurnContext;
//#endregion
//#region src/auto-reply/commands-args.types.d.ts
/** Primitive values accepted by parsed auto-reply command args. */
type CommandArgValue = string | number | boolean | bigint;
/** Named parsed auto-reply command values. */
type CommandArgValues = Record<string, CommandArgValue>;
/** Parsed command argument bundle with raw source and structured values. */
type CommandArgs = {
  raw?: string;
  values?: CommandArgValues;
};
//#endregion
//#region src/auto-reply/group-thread.types.d.ts
type ResolvedGroupThreadConfig = {
  agents: string[];
  unknownAgentIds: string[];
  qualified: boolean;
  configuredAgentCount: number;
  mentionGating: boolean;
  maxRounds: number;
  maxTurns: number;
  strategy: BroadcastStrategy;
};
type GroupThreadMentionFacts = {
  channel: string;
  peerId: string;
  group: ResolvedGroupThreadConfig;
  mentionedAgentIds: string[];
};
//#endregion
//#region src/auto-reply/reply/history.types.d.ts
/** Normalized history message used when building reply context. */
type HistoryEntry = {
  sender: string;
  body: string;
  timestamp?: number;
  messageId?: string;
  media?: HistoryMediaEntry[];
};
/** Media metadata attached to a normalized history message. */
type HistoryMediaEntry = Pick<MediaFact, "contentType" | "durationMs" | "height" | "kind" | "messageId" | "path" | "url" | "width">;
//#endregion
//#region src/channels/streaming.d.ts
type AgentPlanStepStatus = "pending" | "in_progress" | "completed";
type AgentPlanStep = {
  step: string;
  status: AgentPlanStepStatus;
};
//#endregion
//#region src/auto-reply/source-reply-delivery-mode.types.d.ts
/** Per-turn authority for automatic replies versus explicit message-tool sends. */
type SourceReplyDeliveryMode = "automatic" | "message_tool_only";
//#endregion
//#region src/plugin-sdk/channel-route.d.ts
/** Coarse chat shape used when a channel can distinguish direct, group, and broadcast targets. */
type ChannelRouteChatType = "direct" | "group" | "channel";
/** Provider-specific thread kind carried with normalized channel routes. */
type ChannelRouteThreadKind = "topic" | "thread" | "reply";
/** Describes which runtime surface supplied a channel route thread id. */
type ChannelRouteThreadSource = "explicit" | "target" | "session" | "turn";
/** Normalized channel route used for comparison, binding, and dedupe helpers. */
type ChannelRouteRef = {
  /** Lowercase channel id such as `slack`, `telegram`, or `discord`. */
  channel?: string;
  /** Normalized account/profile id when a channel supports multiple accounts. */
  accountId?: string;
  target?: {
    /** Canonical destination id used for route equality and delivery. */
    to: string;
    /** Original destination text when provider target grammar differs from the canonical id. */
    rawTo?: string;
    /** Coarse destination shape used by channels with different direct/group/broadcast rules. */
    chatType?: ChannelRouteChatType;
  };
  thread?: {
    /** Provider thread/topic/root id; strings are preserved when providers use opaque ids. */
    id: string | number;
    /** Provider-specific thread family for channels that distinguish topics, replies, and threads. */
    kind?: ChannelRouteThreadKind;
    /** Runtime source that supplied the thread id, used when callers need route provenance. */
    source?: ChannelRouteThreadSource;
  };
};
/** Loose route input accepted at SDK boundaries before normalization. */
type ChannelRouteRefInput = {
  /** Raw channel id; normalized to lowercase. */
  channel?: unknown;
  /** Raw account/profile id; normalized with account-id rules when string. */
  accountId?: unknown;
  /** Raw destination id before trimming and route-key normalization. */
  to?: unknown;
  /** Provider-specific target text retained when different from `to`. */
  rawTo?: unknown;
  /** Coarse destination shape supplied by channels that distinguish target kinds. */
  chatType?: ChannelRouteChatType;
  /** Raw provider thread/topic/root id before route-key normalization. */
  threadId?: unknown;
  /** Provider-specific thread family carried with the normalized thread id. */
  threadKind?: ChannelRouteThreadKind;
  /** Runtime surface that supplied the thread id. */
  threadSource?: ChannelRouteThreadSource;
};
/** Raw outbound target input shape used by helpers that do not need thread metadata source. */
type ChannelRouteTargetInput = Pick<ChannelRouteRefInput, "channel" | "accountId" | "to" | "rawTo" | "chatType" | "threadId">;
//#endregion
//#region src/utils/delivery-context.types.d.ts
/** Deferred outbound delivery intent attached to a session or task. */
type DeliveryIntentRef = {
  /** Stable queue/work item id. */
  id: string;
  /** Intent family; currently scoped to outbound queue delivery. */
  kind: "outbound_queue";
  /** Whether queueing is mandatory or best-effort for this delivery. */
  queuePolicy?: "required" | "best_effort";
};
/** Canonical channel delivery target shared by sessions, cron, tasks, and plugins. */
type DeliveryContext = Pick<ChannelRouteTargetInput, "accountId" | "channel" | "threadId" | "to"> & {
  /** Channel/plugin id that owns the delivery target. */
  channel?: string;
  /** Channel-local destination id, preserved with channel-specific casing. */
  to?: string;
  /** Optional channel account/workspace id. */
  accountId?: string;
  /** Optional thread/topic id nested under `to`. */
  threadId?: string | number;
  /** Optional queued-delivery intent associated with this context. */
  deliveryIntent?: DeliveryIntentRef;
};
//#endregion
//#region src/config/sessions/restart-recovery-types.d.ts
/** Exact task and requester generation captured by the admitted host completion turn. */
type HarnessCompletionRecovery = {
  taskId: string;
  /** Terminal outcome captured when this completion input was admitted. */
  taskStatus: "succeeded" | "failed";
  taskRunId: string;
  sourceRunId: string;
  requesterSessionKey: string;
  requesterAgentId: string;
  sessionId: string;
  /** Absence is an expected absent revision, not a wildcard. */
  lifecycleRevision?: string;
};
type RestartRecoveryBeforeAgentReplyState = "admitted" | "pending" | "continue" | "handled-silent" | "handled-reply" | "handled-unrecoverable";
type RestartRecoveryTerminalDeliveryEvidenceResult = {
  /** The terminal result was captured even when it contained no visible or delivery evidence. */
  captured?: true;
  payloads?: Array<{
    mediaUrls?: string[];
    visible?: boolean;
  }>;
  payloadsTruncated?: true;
  deliveryStatus?: {
    status: "failed" | "partial_failed" | "sent" | "suppressed";
    resultCount?: number;
    errorMessage?: string;
    payloadOutcomes?: Array<{
      index: number;
      status: "failed" | "sent" | "suppressed";
      sentBeforeError?: boolean;
    }>;
  };
  messagingToolSentTargets?: Array<{
    provider?: string;
    accountId?: string;
    to?: string;
    threadId?: string;
    threadImplicit?: boolean;
    threadSuppressed?: boolean;
    mediaUrls?: string[];
    visible?: boolean;
    /** Explicit false remains progress-only after a restart. */
    sourceReplyFinal?: boolean;
  }>;
  messagingToolSentTargetsTruncated?: true;
  /** Aggregate committed sends were not all represented by route-checkable target records. */
  messagingToolAggregateEvidenceUnaccounted?: true;
  /** The terminal run reported a committed effect that makes fresh replay unsafe. */
  restartUnsafeSideEffectsDetected?: true;
};
type RestartRecoveryTerminalDeliveryEvidence = RestartRecoveryTerminalDeliveryEvidenceResult & {
  runId: string;
  harnessCompletion?: HarnessCompletionRecovery;
  deliveryContext?: DeliveryContext;
  /** Identified queue completion retained before its exact harness task settles. */
  durableFinalReceipt?: {
    intentId: string;
    deliveryId: string;
    platformMessageId: string;
  };
  /** Actual completion run; a resumed run can differ from its queued source. */
  transcriptRunId?: string;
};
/** Durable ownership and idempotency state for gateway restart recovery. */
type SessionRestartRecoveryState = {
  restartRecoveryBeforeAgentReplyState?: RestartRecoveryBeforeAgentReplyState;
  /** Durable pre/post boundary around the terminal external send. */
  restartRecoveryDeliveryReceiptState?: "terminal-pending" | "delivered-terminal";
  /** Exact agent tool call whose terminal external send owns the receipt. */
  restartRecoveryDeliveryToolCallId?: string;
  restartRecoveryDeliveryContext?: DeliveryContext;
  /** Exact host-owned media allowlist for a generated-media recovery run. */
  restartRecoveryDeliveryMediaUrls?: string[];
  /** Keeps the message tool absent while a generated-media recovery run is resumed. */
  restartRecoveryDisableMessageTool?: true;
  /** Suppresses visible text when a recovery attempt repairs only missing media. */
  restartRecoverySuppressTextDelivery?: true;
  restartRecoveryDeliveryRequestFingerprint?: string;
  restartRecoveryDeliveryRunId?: string;
  restartRecoveryDeliverySourceRunId?: string;
  restartRecoveryHarnessCompletion?: HarnessCompletionRecovery;
  restartRecoveryRequesterAccountId?: string;
  restartRecoveryRequesterSenderId?: string;
  restartRecoverySameChannelThreadRequired?: true;
  restartRecoverySourceIngress?: "channel" | "control-ui" | "internal";
  restartRecoverySourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  restartRecoveryTerminalDeliveryEvidence?: RestartRecoveryTerminalDeliveryEvidence[];
  restartRecoveryTerminalRunIds?: string[];
};
//#endregion
//#region src/channels/location.d.ts
/** Normalized source kind for channel-provided geographic locations. */
type LocationSource = "pin" | "place" | "live";
/** Channel-neutral location payload passed from plugins into shared prompt rendering. */
type NormalizedLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  name?: string;
  address?: string;
  isLive?: boolean;
  source?: LocationSource;
  caption?: string;
};
/** Portable outbound location fields supported by channel send adapters. */
type OutboundLocation = Pick<NormalizedLocation, "latitude" | "longitude" | "accuracy" | "name" | "address">;
//#endregion
//#region src/infra/approval-types.d.ts
type ChannelApprovalKind = "exec" | "plugin" | "system-agent";
//#endregion
//#region src/interactive/payload.d.ts
type InteractiveButtonStyle = "primary" | "secondary" | "success" | "danger";
/** Visual tone for a portable message presentation. */
type MessagePresentationTone = "info" | "success" | "warning" | "danger" | "neutral";
type QuestionPresentationAction = {
  /** Resolve one declared choice. */
  type: "question";
  questionId: string;
  optionValue: string;
} | {
  /** Switch this question to its free-text answer path. */
  type: "question";
  questionId: string;
  intent: "custom-input";
};
/** Core-owned model-picker action; channels serialize it only inside private envelopes. */
type ModelPickerAction = ({
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "show-providers";
  cursor?: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "show-models";
  providerToken: string;
  cursor?: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "show-recents";
  cursor?: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "choose-model";
  providerToken: string;
  modelToken: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "choose-runtime";
  providerToken: string;
  modelToken: string;
  runtimeToken: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "reset";
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "cancel";
}) & {
  /** Legacy command/callback payload fields are deliberately unavailable on picker actions. */
  readonly command?: never;
  readonly value?: never;
};
/** Portable typed action behind a button or select option. */
type MessagePresentationAction = {
  /** Run a core/plugin slash command through the target channel's native command path. */
  type: "command";
  command: string;
} | {
  /** Opaque callback value interpreted by the target channel/plugin. */
  type: "callback";
  value: string;
} | ModelPickerAction | {
  /** Resolve one durable operator approval without exposing transport callback data. */
  type: "approval";
  approvalId: string;
  approvalKind: ChannelApprovalKind;
  decision: "allow-once" | "allow-always" | "deny";
} | QuestionPresentationAction | {
  /** Open a normal external link. */
  type: "url";
  url: string;
} | {
  /** Launch a channel-native web app. */
  type: "web-app";
  /** External web app URL for channels that launch web apps by URL. */
  url: string;
  /** OpenClaw hosted-widget ID whose launch mechanics are owned by the channel. */
  widgetId?: string;
} | {
  /** Launch a channel-native web app. */
  type: "web-app";
  /** External web app URL for channels that launch web apps by URL. */
  url?: string;
  /** OpenClaw hosted-widget ID whose launch mechanics are owned by the channel. */
  widgetId: string;
};
/** Portable action control rendered as a button or link by channel adapters. */
type MessagePresentationButton = {
  /** User-visible button label. */
  label: string;
  /** Typed action sent when the button is pressed. */
  action?: MessagePresentationAction;
  /**
   * Legacy opaque callback value sent when the button is pressed.
   * Prefer action for new presentation controls.
   * @deprecated Use action.
   */
  value?: string;
  /** @deprecated Use an action with type "url". */
  url?: string;
  /** @deprecated Use an action with type "web-app". */
  webApp?: {
    url: string;
  };
  /**
   * @deprecated Use an action with type "web-app". Accepted for legacy JSON payloads only.
   */
  web_app?: {
    url: string;
  };
  /** Higher-priority buttons are kept first when channel limits require truncation. */
  priority?: number;
  /** Disable the button when the target channel supports disabled controls. */
  disabled?: boolean;
  /** Keep this action available after a successful interaction when the target channel supports it. */
  reusable?: boolean;
  /** Optional visual style hint; unsupported channels ignore or normalize it. */
  style?: InteractiveButtonStyle;
};
/** Portable select/menu option. */
type MessagePresentationOption = {
  /** User-visible option label. */
  label: string;
  /** Typed action sent when the option is selected. */
  action?: Extract<MessagePresentationAction, {
    type: "command" | "callback" | "model-picker";
  }>;
  /** @deprecated Use action. */
  value?: string;
};
type LegacyInteractiveReplyOption = MessagePresentationOption;
type LegacyInteractiveReplyTextBlock = {
  type: "text";
  text: string;
};
type LegacyInteractiveReplySelectBlock = {
  type: "select";
  placeholder?: string;
  options: LegacyInteractiveReplyOption[];
};
type LegacyInteractiveReplyBlock = LegacyInteractiveReplyTextBlock | MessagePresentationButtonsBlock | LegacyInteractiveReplySelectBlock;
type LegacyInteractiveReply = {
  blocks: LegacyInteractiveReplyBlock[];
};
/** @deprecated Use MessagePresentation. */
type InteractiveReply = LegacyInteractiveReply;
type MessagePresentationTextBlock = {
  type: "text";
  /** Primary markdown-ish text rendered in the message body. */
  text: string;
};
type MessagePresentationContextBlock = {
  type: "context";
  /** Lower-emphasis contextual text, or normal text on channels without context support. */
  text: string;
};
type MessagePresentationDividerBlock = {
  type: "divider";
};
type MessagePresentationButtonsBlock = {
  type: "buttons";
  /** Button row candidates; core may split or truncate them for channel limits. */
  buttons: MessagePresentationButton[];
};
type MessagePresentationSelectBlock = {
  type: "select";
  /** Optional prompt shown above or inside the select control. */
  placeholder?: string;
  /** Menu options; core may truncate them for channel limits. */
  options: MessagePresentationOption[];
};
type MessagePresentationChartSegment = {
  /** Category label shown in the chart legend. */
  label: string;
  /** Positive segment magnitude. */
  value: number;
};
type MessagePresentationChartSeries = {
  /** Unique series name shown in the chart legend. */
  name: string;
  /** One finite value for each chart category, in category order. */
  values: number[];
};
type MessagePresentationChartBlock = {
  type: "chart";
  chartType: "pie";
  /** Short chart heading. */
  title: string;
  segments: MessagePresentationChartSegment[];
} | {
  type: "chart";
  chartType: "bar" | "area" | "line";
  /** Short chart heading. */
  title: string;
  /** Ordered categories shared by every series. */
  categories: string[];
  series: MessagePresentationChartSeries[];
  xLabel?: string;
  yLabel?: string;
};
/** Scalar cell value supported by portable table presentations. */
type MessagePresentationTableCell = string | number;
/** Portable table rendered natively where supported and linearly elsewhere. */
type MessagePresentationTableBlock = {
  type: "table";
  /** Short table heading used by native renderers and fallback text. */
  caption: string;
  /** Unique ordered column labels shared by every row. */
  headers: string[];
  /** Rows whose width exactly matches the header count. */
  rows: MessagePresentationTableCell[][];
  /** Optional column whose cells should be rendered as row headers. */
  rowHeaderColumnIndex?: number;
};
type MessagePresentationBlock = MessagePresentationTextBlock | MessagePresentationContextBlock | MessagePresentationDividerBlock | MessagePresentationButtonsBlock | MessagePresentationSelectBlock | MessagePresentationChartBlock | MessagePresentationTableBlock;
type MessagePresentation = {
  /** Optional short heading rendered before blocks when the channel supports it. */
  title?: string;
  /** Optional severity/status tone for renderers that support toned presentations. */
  tone?: MessagePresentationTone;
  /** Ordered portable blocks rendered or downgraded by the target channel adapter. */
  blocks: MessagePresentationBlock[];
};
type ReplyPayloadDeliveryPin = {
  enabled: boolean;
  notify?: boolean;
  required?: boolean;
};
type ReplyPayloadDelivery = {
  pin?: boolean | ReplyPayloadDeliveryPin;
};
//#endregion
//#region src/shared/reply-payload.types.d.ts
type ReplyMediaAttachment = {
  type?: "image" | "audio" | "video" | "file";
  path?: string;
  url?: string;
  mediaUrl?: string;
  filePath?: string;
  mimeType?: string;
  name?: string;
  sizeBytes?: number;
  durationMs?: number;
  width?: number;
  height?: number;
  /** Internal per-URL trust carried until mixed media is split for history projection. */
  trustedLocalMedia?: boolean;
};
/** Metadata for audio-only media that supplements already-visible assistant text. */
type ReplyPayloadTtsSupplement = {
  spokenText: string;
  visibleTextAlreadyDelivered?: boolean;
};
/** Channel-agnostic assistant reply payload. */
type ReplyPayload = {
  text?: string;
  /** Visible body a channel adapter may use when native structured content requires text. */
  fallbackText?: {
    text: string;
    /** Batch payload replaced when the adapter adopts this fallback body. */
    replacesPayloadIndex?: number;
  };
  mediaUrl?: string;
  mediaUrls?: string[];
  /** Prepared metadata aligned with mediaUrls for client-facing history projection. */
  attachments?: ReplyMediaAttachment[];
  /** Internal-only trust signal for gateway webchat local media embedding. */
  trustedLocalMedia?: boolean;
  /** Treat media as live-only content and avoid persisting the underlying media reference. */
  sensitiveMedia?: boolean;
  /** Channel-agnostic rich presentation. Core degrades or asks the channel renderer to map it. */
  presentation?: MessagePresentation;
  /** Runtime-authored text is the exact fallback, not additional native presentation content. */
  presentationTextMode?: "fallback";
  /** Channel-agnostic delivery preferences, e.g. pin the sent message when supported. */
  delivery?: ReplyPayloadDelivery;
  /**
   * @deprecated Use presentation.
   *
   * Internal legacy representation used by existing approval/reply helpers during migration.
   */
  interactive?: InteractiveReply;
  btw?: {
    question: string;
  };
  replyToId?: string;
  replyToTag?: boolean;
  /** True when [[reply_to_current]] was present but not yet mapped to a message id. */
  replyToCurrent?: boolean;
  /** Send audio as voice message (bubble) instead of audio file. Defaults to false. */
  audioAsVoice?: boolean;
  /** Send video media as a round video note when the channel supports it. */
  videoAsNote?: boolean;
  /** Channel-neutral geographic location or named place. */
  location?: OutboundLocation;
  /**
   * Text synthesized into an audio-only TTS payload. Exposed to hooks for
   * archival/search use when no visible channel text is sent.
   */
  spokenText?: string;
  /**
   * Marks a TTS media payload as supplemental audio for assistant text that is
   * already visible through streaming or transcript projection.
   */
  ttsSupplement?: ReplyPayloadTtsSupplement;
  isError?: boolean;
  /** Marks this payload as a reasoning/thinking block. Channels that do not
   *  have a dedicated reasoning lane (e.g. WhatsApp, web) should suppress it. */
  isReasoning?: boolean;
  /** Marks pre-tool commentary (💬) — a display lane, suppressed unless the channel opts in. */
  isCommentary?: boolean;
  /** Reasoning stream text is a complete replacement snapshot, not a delta. */
  isReasoningSnapshot?: boolean;
  /** Marks this payload as a compaction status notice (start/end).
   *  Should be excluded from TTS transcript accumulation so compaction
   *  status lines are not synthesised into the spoken assistant reply. */
  isCompactionNotice?: boolean;
  /** Marks this payload as a model-fallback transition/recovery notice. */
  isFallbackNotice?: boolean;
  /** Marks this payload as transient status, not assistant answer content. */
  isStatusNotice?: boolean;
  /** Channel-specific payload data (per-channel envelope). */
  channelData?: Record<string, unknown>;
};
//#endregion
//#region src/auto-reply/templating.d.ts
/** Valid message channels for routing. */
type OriginatingChannelType = string & {
  readonly __originatingChannelBrand?: never;
};
type MentionSource = "explicit_bot" | "subteam" | "mention_pattern" | "implicit_thread" | "command_bypass" | "none";
type InboundSourceModality = "text" | "voice" | "audio" | "image" | "video" | "document";
type StickerContextMetadata = {
  cachedDescription?: string;
  emoji?: string;
  setName?: string;
  description?: string;
  fileId?: string;
  fileUniqueId?: string;
  uniqueFileId?: string;
  isAnimated?: boolean;
  isVideo?: boolean;
} & Record<string, unknown>;
type ChannelStructuredContextEntry = {
  label: string;
  source?: string;
  type?: string;
  payload: unknown;
  /** Keeps this provider-owned window independent of bounded canonical transcript enrichment. */
  sessionTranscriptMode?: "preserve";
  /** Internal exact-id hints for canonical transcript/live-cache deduplication. */
  sessionTranscriptDedupeMessageIds?: string[];
  /** Internal visible-text hints for legacy assistant rows without transcript ids. */
  sessionTranscriptAssistantTextDedupeKeys?: string[];
};
type SessionTranscriptContext = {
  chatWindow?: boolean;
  historyLimit: number;
  /** A platform-selected recent window keeps its configured bound and does not merge transcript rows. */
  historyKind?: "pending" | "recent";
  beforeTimestampMs?: number;
  minTimestampMs?: number;
  senderLabels?: {
    assistant: string;
    user: string;
  };
};
/** @deprecated Use ChannelStructuredContextEntry. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
type UntrustedStructuredContextEntry = ChannelStructuredContextEntry;
/** Structured supplemental facts projected into prompt context by inbound finalization. */
type SupplementalContextFacts = {
  quote?: {
    id?: string;
    fullId?: string;
    body?: string;
    sender?: string;
    senderAllowed?: boolean;
    isExternal?: boolean;
    isQuote?: boolean;
  };
  forwarded?: {
    from?: string;
    fromType?: string;
    fromId?: string;
    date?: number;
    senderAllowed?: boolean;
  };
  thread?: {
    id?: string;
    starterBody?: string;
    historyBody?: string;
    label?: string;
    parentSessionKey?: string;
    modelParentSessionKey?: string;
    senderAllowed?: boolean;
  };
  channelStructuredContext?: ChannelStructuredContextEntry[];
  /** @deprecated Use channelStructuredContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  untrustedContext?: ChannelStructuredContextEntry[];
  groupSystemPrompt?: string;
  /** Prompt-like group metadata from user-controlled sources; never enters the system prompt. */
  untrustedGroupSystemPrompt?: string;
};
/** Canonical normalized inbound text populated once by `finalizeInboundContext`. */
type CanonicalInboundText = {
  /** Clean text used for command and directive parsing. */
  commandText: string;
  /** Prompt-facing text used for the agent turn. */
  agentText: string;
  /** Normalized visible/raw inbound text before command-specific projection. */
  rawText: string;
};
/** Raw inbound message context accepted from channels before finalization. */
type MsgContext = Partial<CanonicalInboundText> & {
  Body?: string;
  InboundEventKind?: InboundEventKind;
  /**
   * Agent prompt body (may include envelope/history/context). Prefer this for prompt shaping.
   * Should use real newlines (`\n`), not escaped `\\n`.
   */
  BodyForAgent?: string;
  /**
   * Recent chat history for context (untrusted user content). Prefer passing this
   * as structured context blocks in the user prompt rather than rendering plaintext envelopes.
   */
  InboundHistory?: HistoryEntry[];
  /** Internal facts used to merge canonical transcript turns before dispatch. */
  SessionTranscriptContext?: SessionTranscriptContext;
  /**
   * @deprecated Use CommandBody.
   *
   * Raw message body without structural context (history, sender labels).
   * Legacy alias for CommandBody. Falls back to Body if not set.
   */
  RawBody?: string;
  /**
   * Prefer for command detection; RawBody is treated as legacy alias.
   */
  CommandBody?: string;
  /**
   * Command parsing body. Prefer this over CommandBody/RawBody when set.
   * Should be the "clean" text (no history/sender context).
   */
  BodyForCommands?: string;
  CommandArgs?: CommandArgs;
  From?: string;
  To?: string;
  SessionKey?: string;
  /**
   * Resolved agent scope for canonical session keys that do not encode the agent
   * id, such as selected-agent global sessions.
   */
  AgentId?: string;
  /** Participant mention facts prepared once from the physical inbound message. */
  GroupThread?: GroupThreadMentionFacts;
  /** Effective routed DM scope, including binding overrides. */
  DmScope?: DmScope;
  /**
   * Session-like key used for runtime policy (sandbox/tool policy) when the
   * conversation key intentionally remains broader, such as a main-session DM.
   */
  RuntimePolicySessionKey?: string;
  /** Provider account id (multi-account). */
  AccountId?: string;
  ParentSessionKey?: string;
  /**
   * Session key used only for inheriting session-scoped model/provider
   * overrides. Unlike ParentSessionKey, this must not trigger transcript
   * forking or parent-session lifecycle behavior.
   */
  ModelParentSessionKey?: string;
  MessageSid?: string;
  /** Provider-specific full message id when MessageSid is a shortened alias. */
  MessageSidFull?: string;
  MessageSids?: string[];
  MessageSidFirst?: string;
  MessageSidLast?: string;
  AmbientTranscriptWatermarkKey?: string;
  AmbientTranscriptBody?: string;
  AmbientTranscriptMessageId?: string;
  AmbientTranscriptTimestampMs?: number;
  AmbientTranscriptPreviousMessageId?: string;
  AmbientTranscriptPreviousTimestampMs?: number;
  /** Per-turn reply-threading overrides. */
  ReplyThreading?: ReplyThreadingPolicy;
  /** Effective channel reply mode prepared for this turn. */
  ReplyToMode?: ReplyToMode;
  ReplyToId?: string;
  /**
   * Root message id for thread reconstruction (used by Feishu for root_id).
   * When a message is part of a thread, this is the id of the first message.
   */
  RootMessageId?: string;
  /** Provider-specific full reply-to id when ReplyToId is a shortened alias. */
  ReplyToIdFull?: string;
  ReplyToBody?: string;
  ReplyToQuoteText?: string;
  ReplyToSender?: string;
  ReplyChain?: Array<{
    messageId?: string;
    threadId?: string;
    sender?: string;
    senderId?: string;
    senderUsername?: string;
    timestamp?: number;
    body?: string;
    isQuote?: boolean;
    mediaType?: string;
    mediaPath?: string;
    mediaRef?: string;
    replyToId?: string;
    forwardedFrom?: string;
    forwardedFromId?: string;
    forwardedFromUsername?: string;
    forwardedDate?: number;
  }>;
  ReplyToIsQuote?: boolean;
  /** Forward origin from the reply target (when reply_to_message is a forwarded message). */
  ReplyToForwardedFrom?: string;
  ReplyToForwardedFromType?: string;
  ReplyToForwardedFromId?: string;
  ReplyToForwardedFromUsername?: string;
  ReplyToForwardedFromTitle?: string;
  ReplyToForwardedDate?: number;
  ForwardedFrom?: string;
  ForwardedFromType?: string;
  ForwardedFromId?: string;
  ForwardedFromUsername?: string;
  ForwardedFromTitle?: string;
  ForwardedFromSignature?: string;
  ForwardedFromChatType?: string;
  ForwardedFromMessageId?: number;
  ForwardedDate?: number;
  ThreadStarterBody?: string;
  /** Full thread history when starting a new thread session. */
  ThreadHistoryBody?: string;
  IsFirstThreadTurn?: boolean;
  ThreadLabel?: string;
  /** @deprecated Use `media?.[0]?.path`. */
  MediaPath?: string;
  /** @deprecated Use `media?.[0]?.url`. */
  MediaUrl?: string;
  /** @deprecated Use `media?.[0]?.contentType` or `.kind`. */
  MediaType?: string;
  /** @deprecated Derive the directory from `media?.[0]?.path` at the consuming boundary. */
  MediaDir?: string;
  /** @deprecated Use `media?.map((entry) => entry.path)`. */
  MediaPaths?: string[];
  /** @deprecated Use `media?.map((entry) => entry.url)`. */
  MediaUrls?: string[];
  /** @deprecated Use `media?.map((entry) => entry.contentType ?? entry.kind)`. */
  MediaTypes?: string[];
  /** Ordered current-turn media facts; array position is attachment identity. */
  media?: MediaFact[];
  /** Original message modality before transcription or other media normalization. */
  SourceModality?: InboundSourceModality;
  /** @deprecated Use each media fact's `workspaceDir`. */
  MediaWorkspaceDir?: string;
  /** Attachment indexes whose audio was already transcribed before media understanding runs. */
  /** @deprecated Use each media fact's `transcribed` field. */
  MediaTranscribedIndexes?: number[];
  /**
   * Marker: skip downstream stageSandboxMedia. chat.send RPC sets this so
   * staging runs synchronously before respond() and surfaces 5xx to the
   * client; any later failure only reaches the broadcast channel.
   */
  /** @deprecated Use each media fact's `workspaceDir` or `staged` proof. */
  MediaStaged?: boolean;
  /** Telegram sticker metadata (emoji, set name, file IDs, cached description). */
  Sticker?: StickerContextMetadata;
  /** True when current-turn sticker media is present in structured facts. */
  StickerMediaIncluded?: boolean;
  /** Skip automatic understanding for the current sticker because its cached description is used. */
  SkipStickerMediaUnderstanding?: boolean;
  OutputDir?: string;
  OutputBase?: string;
  /** Remote host for SCP when media lives on a different machine (e.g., openclaw@192.168.64.3). */
  MediaRemoteHost?: string;
  Transcript?: string;
  MediaUnderstanding?: MediaUnderstandingOutput[];
  MediaUnderstandingDecisions?: MediaUnderstandingDecision[];
  LinkUnderstanding?: string[];
  Prompt?: string;
  MaxChars?: number;
  ChatType?: string;
  /** Trusted channel-configured policy for this admitted conversation turn. */
  ConversationToolPolicy?: GroupToolPolicyConfig;
  /** Human label for envelope headers (conversation label, not sender). */
  ConversationLabel?: string;
  GroupSubject?: string;
  /** Human label for channel-like group conversations (e.g. #general, #support). */
  GroupChannel?: string;
  GroupSpace?: string;
  /** Trusted provider role ids for the sender in this group turn. */
  MemberRoleIds?: string[];
  GroupMembers?: string;
  GroupSystemPrompt?: string;
  /**
   * Canonical inbound supplemental facts for new channel code. `finalizeInboundContext`
   * projects these to the existing flat reply/forward/thread/group prompt fields.
   */
  SupplementalContext?: SupplementalContextFacts;
  /** Channel-provided metadata that must not be treated as system instructions. */
  ChannelPromptContext?: string[];
  /** @deprecated Use ChannelPromptContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  UntrustedContext?: string[];
  /** Structured channel metadata rendered by prompt assembly as fenced JSON. */
  ChannelStructuredContext?: ChannelStructuredContextEntry[];
  /** @deprecated Use ChannelStructuredContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  UntrustedStructuredContext?: UntrustedStructuredContextEntry[];
  /** System-attached provenance for the current inbound message. */
  InputProvenance?: InputProvenance;
  /** Internal wake cause, independent of transport, transcript provenance, and execution authority. */
  InternalTurnSource?: "heartbeat" | "cron" | "exec" | "progress-card-refresh";
  /** Explicit owner allowlist overrides (trusted, configuration-derived). */
  OwnerAllowFrom?: Array<string | number>;
  SenderName?: string;
  SenderId?: string;
  /** Trusted in-process creation provenance; never populated from channel payloads. */
  SessionCreation?: {
    skillLibrarySelections?: SkillLibrarySelection[];
    via: SessionCreatedVia;
    actor?: SessionCreatedActor;
    sandbox?: "required";
  };
  SenderUsername?: string;
  SenderTag?: string;
  SenderE164?: string;
  SenderIsBot?: boolean;
  /** Channel-ingress fact: sender is the operator's own account (from-me). */
  SenderIsSelf?: boolean;
  Timestamp?: number;
  LocationLat?: number;
  LocationLon?: number;
  LocationAccuracy?: number;
  LocationName?: string;
  LocationAddress?: string;
  LocationSource?: string;
  LocationIsLive?: boolean;
  LocationLivePeriodSeconds?: number;
  LocationCaption?: string;
  /** Stable identity of the provider update that carried this message. */
  ProviderUpdateId?: string;
  /** Provider update kind, for example `message` or `edited_message`. */
  ProviderUpdateKind?: string;
  /** Provider-native timestamp for the original message. */
  ProviderMessageTimestamp?: number;
  /** Provider-native timestamp for an edited message update. */
  ProviderEditTimestamp?: number;
  /** Provider label. */
  Provider?: string;
  /** Provider surface label. Prefer this over `Provider` when available. */
  Surface?: string;
  /** Platform bot username when command mentions should be normalized. */
  BotUsername?: string;
  WasMentioned?: boolean;
  /** Effective channel-owned mention policy before any plugin-binding bypass. */
  GroupRequireMention?: boolean;
  /** True when this turn explicitly mentioned the current bot target. */
  ExplicitlyMentionedBot?: boolean;
  /** Provider-native explicit user mention ids present on this turn. */
  MentionedUserIds?: string[];
  /** Provider-native explicit user-group/subteam mention ids present on this turn. */
  MentionedSubteamIds?: string[];
  /** Provider-native implicit mention wake reasons present on this turn. */
  ImplicitMentionKinds?: string[];
  /** Provider-native source that caused the current mention decision. */
  MentionSource?: MentionSource;
  CommandAuthorized?: boolean;
  CommandTurn?: CommandTurnContext;
  CommandSource?: "text" | "native";
  CommandInterpretationSuppressed?: boolean;
  CommandTargetSessionKey?: string;
  /**
   * Internal flag: command handling prepared trailing prompt text for ACP dispatch.
   * Used for `/new <prompt>` and `/reset <prompt>` on ACP-bound sessions.
   */
  AcpDispatchTailAfterReset?: boolean;
  /** Gateway client scopes when the message originates from the gateway. */
  GatewayClientScopes?: string[];
  /** Gateway client capabilities when the message originates from the gateway. */
  GatewayClientCaps?: string[];
  /** Server-bound requesting browser; never sourced from message text or rendered into prompts. */
  GatewayUiCommandTarget?: GatewayUiCommandTarget;
  /** Run-scoped plugin tool bindings; never rendered into prompt text. */
  GatewayRunToolBindings?: Readonly<Record<string, unknown>>;
  /** Gateway device id allowed to review approvals initiated by this turn. */
  ApprovalReviewerDeviceId?: string;
  /** Thread identifier (Telegram topic id or Matrix thread event id). */
  MessageThreadId?: string | number;
  /** Provider-native thread target for reply delivery without making the session thread-scoped. */
  TransportThreadId?: string | number;
  /** Platform-native channel/conversation id (e.g. Slack DM channel "D…" id). */
  NativeChannelId?: string;
  /** Channel-owned local conversation image reference; never rendered into prompt text. */
  ConversationAvatar?: string;
  /** Channel-owned metadata exposed to plugin hook context, not prompt text. */
  ChannelContext?: PluginHookChannelContext;
  /** Provider-native chat/conversation id used by channel plugins that expose `chat_id`. */
  ChatId?: string;
  /** Stable provider-native direct-peer id when a DM room/user mapping must survive later writes. */
  NativeDirectUserId?: string;
  /** Telegram forum supergroup marker. */
  IsForum?: boolean;
  /** Human-readable Telegram forum topic name (cached from service messages). */
  TopicName?: string;
  /** Warning: DM has topics enabled but this message is not in a topic. */
  TopicRequiredButMissing?: boolean;
  /**
   * Originating channel for reply routing.
   * When set, replies should be routed back to this provider
   * instead of using lastChannel from the session.
   */
  OriginatingChannel?: OriginatingChannelType;
  /**
   * Originating destination for reply routing.
   * The chat/channel/user ID where the reply should be sent.
   */
  OriginatingTo?: string;
  /**
   * True when the current turn intentionally requested external delivery to
   * OriginatingChannel/OriginatingTo, rather than inheriting stale session route metadata.
   */
  ExplicitDeliverRoute?: boolean;
  /**
   * Internal proof that the channel ingress owner admitted this sender/event.
   * Correlation interceptors must fail closed when this proof is absent.
   */
  InboundAccessAuthorized?: boolean;
  /** Internal marker that channel ingress authoritatively observed route-context facts. */
  ConversationRouteContextObserved?: boolean;
  /** Canonical peer used by route selection; delivery targets may use a different namespace. */
  ConversationRoutePeerId?: string;
  /**
   * Internal flag for channels that emit message_received through a channel-specific
   * privacy gate before entering the shared reply dispatcher.
   */
  SuppressMessageReceivedHooks?: boolean;
  /**
   * Provider-specific parent conversation id for threaded contexts.
   * For Discord threads, this is the parent channel id.
   */
  ThreadParentId?: string;
  /**
   * Messages from hooks to be included in the response.
   * Used for hook confirmation messages like "Session context saved to memory".
   */
  HookMessages?: string[];
};
type RuntimeMediaContextKey = "MediaPath" | "MediaUrl" | "MediaType" | "MediaDir" | "MediaPaths" | "MediaUrls" | "MediaTypes" | "MediaWorkspaceDir" | "MediaTranscribedIndexes" | "MediaStaged";
/** Internal inbound context; legacy media fields exist only on the shipped SDK adapter. */
type RuntimeMsgContext = Omit<MsgContext, RuntimeMediaContextKey>;
type NonTemplateContextKey = "ConversationAvatar";
type TemplateContext = Omit<RuntimeMsgContext, NonTemplateContextKey> & {
  BodyStripped?: string;
  SessionId?: string;
  IsNewSession?: string;
  /** Local path for the attachment currently being processed. */
  AttachmentPath?: string;
  /** Original URL/reference for the attachment currently being processed. */
  AttachmentUrl?: string;
  /** MIME content type for the attachment currently being processed. */
  AttachmentContentType?: string;
  /** Directory containing AttachmentPath. */
  AttachmentDir?: string;
  /** Stable zero-based source fact index for the attachment currently being processed. */
  AttachmentIndex?: number;
  /** @deprecated Use AttachmentPath. */
  MediaPath?: string;
  /** @deprecated Use AttachmentUrl. */
  MediaUrl?: string;
  /** @deprecated Use AttachmentContentType. */
  MediaType?: string;
  /** @deprecated Use AttachmentDir. */
  MediaDir?: string;
};
declare function applyTemplate$1(str: string | undefined, ctx: TemplateContext): string;
//#endregion
//#region src/config/sessions/session-transcript-turn-lifecycle.types.d.ts
/** Authoritative lifecycle snapshot required for an atomic transcript admission. */
type SessionTranscriptTurnExpectedState = {
  /** Rejects a run-owned turn after another admitted run takes writer ownership. */
  expectedWriterRunId?: string;
  abortedLastRun: boolean | undefined;
  /** Fences recovery-only transcript writes against concurrent ownership changes. */
  mainRestartRecoveryCycleId: string | undefined;
  mainRestartRecoveryRevision: number | undefined;
  restartRecoveryBeforeAgentReplyState: SessionRestartRecoveryState["restartRecoveryBeforeAgentReplyState"];
  restartRecoveryDeliveryReceiptState: SessionRestartRecoveryState["restartRecoveryDeliveryReceiptState"];
  restartRecoveryDeliveryToolCallId: SessionRestartRecoveryState["restartRecoveryDeliveryToolCallId"];
  restartRecoveryDeliveryRequestFingerprint: SessionRestartRecoveryState["restartRecoveryDeliveryRequestFingerprint"];
  restartRecoveryDeliveryRunId: SessionRestartRecoveryState["restartRecoveryDeliveryRunId"];
  restartRecoveryDeliverySourceRunId: SessionRestartRecoveryState["restartRecoveryDeliverySourceRunId"];
  restartRecoveryRequesterAccountId: SessionRestartRecoveryState["restartRecoveryRequesterAccountId"];
  restartRecoveryRequesterSenderId: SessionRestartRecoveryState["restartRecoveryRequesterSenderId"];
  restartRecoverySameChannelThreadRequired: SessionRestartRecoveryState["restartRecoverySameChannelThreadRequired"];
  restartRecoverySourceIngress: SessionRestartRecoveryState["restartRecoverySourceIngress"];
  restartRecoverySourceReplyDeliveryMode: SessionRestartRecoveryState["restartRecoverySourceReplyDeliveryMode"];
  restartRecoveryTerminalRunIds: SessionRestartRecoveryState["restartRecoveryTerminalRunIds"];
  status: PersistedSessionRunStatus | undefined;
};
/** Lifecycle fields committed with an accepted transcript turn. */
type SessionTranscriptTurnLifecyclePatch = {
  abortedLastRun?: boolean;
  endedAt?: number;
  lifecycleRunId?: InternalSessionEntry["lifecycleRunId"];
  lastRunId?: InternalSessionEntry["lastRunId"];
  lastRunError?: InternalSessionEntry["lastRunError"];
  pendingFinalDelivery?: InternalSessionEntry["pendingFinalDelivery"];
  mainRestartRecovery?: InternalSessionEntry["mainRestartRecovery"];
  restartRecoveryBeforeAgentReplyState?: SessionRestartRecoveryState["restartRecoveryBeforeAgentReplyState"];
  restartRecoveryDeliveryReceiptState?: SessionRestartRecoveryState["restartRecoveryDeliveryReceiptState"];
  restartRecoveryDeliveryToolCallId?: SessionRestartRecoveryState["restartRecoveryDeliveryToolCallId"];
  restartRecoveryDeliveryContext?: SessionRestartRecoveryState["restartRecoveryDeliveryContext"];
  restartRecoveryDeliveryRequestFingerprint?: SessionRestartRecoveryState["restartRecoveryDeliveryRequestFingerprint"];
  restartRecoveryDeliveryRunId?: SessionRestartRecoveryState["restartRecoveryDeliveryRunId"];
  restartRecoveryDeliverySourceRunId?: SessionRestartRecoveryState["restartRecoveryDeliverySourceRunId"];
  restartRecoveryRequesterAccountId?: SessionRestartRecoveryState["restartRecoveryRequesterAccountId"];
  restartRecoveryRequesterSenderId?: SessionRestartRecoveryState["restartRecoveryRequesterSenderId"];
  restartRecoverySameChannelThreadRequired?: SessionRestartRecoveryState["restartRecoverySameChannelThreadRequired"];
  restartRecoverySourceIngress?: SessionRestartRecoveryState["restartRecoverySourceIngress"];
  restartRecoverySourceReplyDeliveryMode?: SessionRestartRecoveryState["restartRecoverySourceReplyDeliveryMode"];
  restartRecoveryForceSafeTools?: InternalSessionEntry["restartRecoveryForceSafeTools"];
  restartRecoveryRuns?: InternalSessionEntry["restartRecoveryRuns"];
  /** Durable tombstones merged with the fresh row inside the SQLite write transaction. */
  restartRecoveryTerminalRunIds?: SessionRestartRecoveryState["restartRecoveryTerminalRunIds"];
  runtimeMs?: number;
  startedAt?: number;
  status?: PersistedSessionRunStatus;
  updatedAt?: number;
};
//#endregion
//#region src/config/sessions/store-maintenance.d.ts
type SessionMaintenanceWarning = {
  activeSessionKey: string;
  activeUpdatedAt?: number;
  totalEntries: number;
  pruneAfterMs: number;
  maxEntries: number;
  wouldPrune: boolean;
  wouldCap: boolean;
  capOutcome?: "archive" | "remove" | null;
  pruneOutcome?: "archive" | "remove" | null;
};
type ResolvedSessionMaintenanceConfig = {
  mode: SessionMaintenanceMode;
  pruneAfterMs: number;
  archiveDashboardAfterMs: number | null;
  maxEntries: number;
  modelRunPruneAfterMs: number;
  preserveRecentMs?: number | null;
  resetArchiveRetentionMs: number | null;
  maxDiskBytes: number | null;
  highWaterBytes: number | null;
};
//#endregion
//#region src/config/sessions/transcript-entry-anchor.d.ts
/** Immutable transcript identity issued by the SQLite append transaction. */
type TranscriptEntryAnchor = Readonly<{
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
  generation: string;
  entryId: string;
  rawSeq: number;
  effectiveParentId: string | null;
  activeMessagePosition: number;
  idempotencyKey?: string;
}>;
/** Current user row bound to one recorder-owned logical turn. */
type TranscriptTurnAdmission = TranscriptEntryAnchor & Readonly<{
  logicalTurnId: string;
  role: "user";
}>;
//#endregion
//#region src/config/sessions/cli-history-boundary.d.ts
/** Private proof of the account that owns every covered transcript event. */
type CliHistoryBoundary = {
  version: 1;
  sessionId: string;
  state: "unknown";
} | {
  version: 1;
  sessionId: string;
  state: "known";
  authFingerprint: string;
  generation: string | null;
  maxSeq: number | null;
  writerRunId: string;
};
//#endregion
//#region src/config/sessions/session-diff-baseline-capture.d.ts
type SessionDiffBaselineCapture = {
  version: 1;
  captureId: string;
  status: "pending" | "unavailable";
};
//#endregion
//#region packages/acp-core/src/types.d.ts
type SessionAcpIdentitySource = "ensure" | "status" | "event";
type SessionAcpIdentityState = "pending" | "resolved";
type SessionAcpIdentity = {
  /** Pending identities may expose provisional ids; resolved identities are safe for resume output. */
  state: SessionAcpIdentityState;
  acpxRecordId?: string;
  acpxSessionId?: string;
  agentSessionId?: string;
  /** Runtime lifecycle point that last supplied the identity fields. */
  source: SessionAcpIdentitySource;
  lastUpdatedAt: number;
};
type AcpSessionRuntimeOptions = {
  /**
   * ACP runtime mode set via session/set_mode (for example: "plan", "normal", "auto").
   */
  runtimeMode?: string;
  /** ACP runtime config option: model id. */
  model?: string;
  /** ACP runtime config option: thinking/reasoning effort. */
  thinking?: string;
  /** Working directory override for ACP session turns. */
  cwd?: string;
  /** ACP runtime config option: permission profile id. */
  permissionProfile?: string;
  /** ACP runtime config option: per-turn timeout in seconds. */
  timeoutSeconds?: number;
  /** Backend-specific option bag mapped through session/set_config_option. */
  backendExtras?: Record<string, string>;
};
type SessionAcpMeta = {
  backend: string;
  agent: string;
  runtimeSessionName: string;
  /** Canonical backend/agent ids used for resume hints and thread/status details. */
  identity?: SessionAcpIdentity;
  mode: "persistent" | "oneshot";
  runtimeOptions?: AcpSessionRuntimeOptions;
  cwd?: string;
  state: "idle" | "running" | "error";
  lastActivityAt: number;
  lastError?: string;
};
//#endregion
//#region packages/normalization-core/src/string-coerce.d.ts
type FastMode = boolean | "auto";
//#endregion
//#region packages/gateway-protocol/src/session-agent-status.d.ts
declare const SESSION_AGENT_ATTENTION_ICON_IDS: readonly ["hand", "key", "alert", "flag", "lock", "hourglass"];
type SessionAgentAttentionIconId = (typeof SESSION_AGENT_ATTENTION_ICON_IDS)[number];
type SessionAgentStatus = {
  note: string;
  expiresAt: number;
  attention?: SessionAgentAttentionIconId;
};
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-row.d.ts
declare const SessionRunStatusSchema: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"failed">, Type.TLiteral<"killed">, Type.TLiteral<"timeout">]>;
declare const SessionEntryArchiveReasonSchema: Type.TUnion<[Type.TLiteral<"manual">, Type.TLiteral<"active-session-cap">, Type.TLiteral<"age-retention">, Type.TLiteral<"stale-dashboard">, Type.TLiteral<"restart-recovery">]>;
/** Stable Gateway session row fields; mutation envelopes may add null tombstones. */
declare const SessionRowSchema: Type.TObject<{
  key: Type.TString;
  sessionId: Type.TOptional<Type.TString>;
  incognito: Type.TOptional<Type.TLiteral<true>>;
  kind: Type.TUnion<[Type.TLiteral<"direct">, Type.TLiteral<"group">, Type.TLiteral<"global">, Type.TLiteral<"unknown">]>;
  label: Type.TOptional<Type.TString>;
  autoLabel: Type.TOptional<Type.TString>;
  icon: Type.TOptional<Type.TString>;
  /** Named sidebar tint from SESSION_COLOR_IDS; clients map names to theme hues. */
  color: Type.TOptional<Type.TString>;
  channelAvatarUrl: Type.TOptional<Type.TString>;
  boardFace: Type.TOptional<Type.TUnion<[Type.TLiteral<"chat">, Type.TLiteral<"dashboard">]>>;
  /** Shared dashboard default; absent means split. */
  boardPresentation: Type.TOptional<Type.TUnion<[Type.TLiteral<"split">, Type.TLiteral<"expanded">]>>;
  displayName: Type.TOptional<Type.TString>;
  derivedTitle: Type.TOptional<Type.TString>;
  lastMessagePreview: Type.TOptional<Type.TString>;
  channel: Type.TOptional<Type.TString>;
  /** Stable non-sensitive facts derived from the canonical session route. */
  classification: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  accountId: Type.TOptional<Type.TString>;
  peerKind: Type.TOptional<Type.TString>;
  isMain: Type.TOptional<Type.TBoolean>;
  isBackground: Type.TOptional<Type.TBoolean>;
  chatType: Type.TOptional<Type.TUnion<[Type.TLiteral<"direct">, Type.TLiteral<"group">, Type.TLiteral<"channel">]>>;
  activitySummary: Type.TOptional<Type.TObject<{
    canEnsure: Type.TOptional<Type.TBoolean>;
    text: Type.TOptional<Type.TString>;
    updatedAt: Type.TOptional<Type.TInteger>;
    state: Type.TUnion<[Type.TLiteral<"current">, Type.TLiteral<"stale">, Type.TLiteral<"updating">, Type.TLiteral<"unavailable">]>;
  }>>;
  updatedAt: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
  /** Gateway sampling time, retained when a read reuses a cached projection. */
  snapshotAt: Type.TOptional<Type.TNumber>;
  /** Personal list preference for the authenticated viewer; not session visibility. */
  hiddenFromInvolvingMe: Type.TOptional<Type.TBoolean>;
  archived: Type.TOptional<Type.TBoolean>;
  archivedAt: Type.TOptional<Type.TNumber>;
  archivedBy: Type.TOptional<Type.TObject<{
    type: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
    label: Type.TOptional<Type.TString>;
    /** Durable profile avatar route; absent for actors without a stored profile avatar. */
    avatarUrl: Type.TOptional<Type.TString>;
    /** Display identity is separate from the actor fields used by ownership policy. */
    identity: Type.TOptional<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"profile">;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"agent">;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"remote">;
      pluginId: Type.TString;
      domain: Type.TString;
      idKind: Type.TString;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"observation">;
      pluginId: Type.TUnion<[Type.TString, Type.TNull]>;
      accountId: Type.TUnion<[Type.TString, Type.TNull]>;
      senderKind: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"bot">, Type.TLiteral<"unknown">]>;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"legacy">;
      actorType: Type.TString;
      source: Type.TUnion<[Type.TString, Type.TNull]>;
      id: Type.TString;
    }>]>>;
  }>>;
  archiveReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"manual">, Type.TLiteral<"active-session-cap">, Type.TLiteral<"age-retention">, Type.TLiteral<"stale-dashboard">, Type.TLiteral<"restart-recovery">]>>;
  pinned: Type.TOptional<Type.TBoolean>;
  pinnedAt: Type.TOptional<Type.TNumber>;
  unread: Type.TOptional<Type.TBoolean>;
  lastReadAt: Type.TOptional<Type.TNumber>;
  markedUnreadAt: Type.TOptional<Type.TNumber>;
  lastActivityAt: Type.TOptional<Type.TNumber>;
  lastInteractionAt: Type.TOptional<Type.TNumber>;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"failed">, Type.TLiteral<"killed">, Type.TLiteral<"timeout">]>>;
  lastRunError: Type.TOptional<Type.TString>;
  providerReview: Type.TOptional<Type.TObject<{
    id: Type.TString;
    runId: Type.TString;
    explanation: Type.TOptional<Type.TString>;
    continuationMessage: Type.TOptional<Type.TString>;
    canContinue: Type.TBoolean;
  }>>;
  /** Exact run that produced the latest terminal lifecycle projection. */
  lastRunId: Type.TOptional<Type.TString>;
  restartRecoveryStatus: Type.TOptional<Type.TLiteral<"tombstoned">>;
  activeLeafEntryId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  spawnedBy: Type.TOptional<Type.TString>;
  parentSessionKey: Type.TOptional<Type.TString>;
  parentSessionId: Type.TOptional<Type.TString>;
  controlOwnerSessionKey: Type.TOptional<Type.TString>;
  childSessions: Type.TOptional<Type.TArray<Type.TString>>;
  forkedFromParent: Type.TOptional<Type.TBoolean>;
  spawnDepth: Type.TOptional<Type.TNumber>;
  subagentRole: Type.TOptional<Type.TUnion<[Type.TLiteral<"orchestrator">, Type.TLiteral<"leaf">]>>;
  subagentControlScope: Type.TOptional<Type.TUnion<[Type.TLiteral<"children">, Type.TLiteral<"none">]>>;
  swarmGroupId: Type.TOptional<Type.TString>;
  /** Requester-owned execution counts; never child content or parent synthesis status. */
  swarm: Type.TOptional<Type.TObject<{
    groups: Type.TArray<Type.TObject<{
      groupId: Type.TString;
      createdAt: Type.TNumber;
      children: Type.TOptional<Type.TArray<Type.TObject<{
        sessionKey: Type.TString;
        status: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"failed">]>;
      }>>>;
      queued: Type.TInteger;
      running: Type.TInteger;
      done: Type.TInteger;
      failed: Type.TInteger;
    }>>;
    otherActiveGroups: Type.TInteger;
  }>>;
  worktree: Type.TOptional<Type.TObject<{
    id: Type.TString;
    branch: Type.TString;
    repoRoot: Type.TString;
  }>>;
  repositoryWorkspaceId: Type.TOptional<Type.TString>;
  repository: Type.TOptional<Type.TObject<{
    url: Type.TString;
    ref: Type.TOptional<Type.TString>;
    branch: Type.TString;
  }>>;
  execNode: Type.TOptional<Type.TString>;
  execCwd: Type.TOptional<Type.TString>;
  spawnedWorkspaceDir: Type.TOptional<Type.TString>;
  spawnedCwd: Type.TOptional<Type.TString>;
  /** Persisted project registry association, distinct from a cloud repository workspace. */
  projectId: Type.TOptional<Type.TString>;
  /** Persisted task cwd or spawned workspace; no filesystem resolution is implied. */
  workspaceDir: Type.TOptional<Type.TString>;
  permissionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"read-only">, Type.TLiteral<"guarded">, Type.TLiteral<"workspace">, Type.TLiteral<"full">]>>;
  /** Authorized per-chat containment opt-out; omission follows configured sandbox policy. */
  sandboxMode: Type.TOptional<Type.TLiteral<"off">>;
  /** Administrator consent to the exact external runtime's own permissions for this incarnation. */
  nativeRuntimeConsent: Type.TOptional<Type.TString>;
  permissionModePending: Type.TOptional<Type.TBoolean>;
  sessionRoot: Type.TOptional<Type.TString>;
  createdVia: Type.TOptional<Type.TUnion<[Type.TLiteral<"operator">, Type.TLiteral<"spawn">, Type.TLiteral<"channel">, Type.TLiteral<"cron">, Type.TLiteral<"talk">, Type.TLiteral<"run">, Type.TLiteral<"plugin">, Type.TLiteral<"internal">]>>;
  createdActor: Type.TOptional<Type.TObject<{
    type: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
    label: Type.TOptional<Type.TString>;
    /** Durable profile avatar route; absent for actors without a stored profile avatar. */
    avatarUrl: Type.TOptional<Type.TString>;
    /** Display identity is separate from the actor fields used by ownership policy. */
    identity: Type.TOptional<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"profile">;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"agent">;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"remote">;
      pluginId: Type.TString;
      domain: Type.TString;
      idKind: Type.TString;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"observation">;
      pluginId: Type.TUnion<[Type.TString, Type.TNull]>;
      accountId: Type.TUnion<[Type.TString, Type.TNull]>;
      senderKind: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"bot">, Type.TLiteral<"unknown">]>;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"legacy">;
      actorType: Type.TString;
      source: Type.TUnion<[Type.TString, Type.TNull]>;
      id: Type.TString;
    }>]>>;
  }>>;
  owner: Type.TOptional<Type.TObject<{
    actor: Type.TObject<{
      type: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
      label: Type.TOptional<Type.TString>;
      /** Durable profile avatar route; absent for actors without a stored profile avatar. */
      avatarUrl: Type.TOptional<Type.TString>;
      /** Display identity is separate from the actor fields used by ownership policy. */
      identity: Type.TOptional<Type.TUnion<[Type.TObject<{
        type: Type.TLiteral<"profile">;
        id: Type.TString;
      }>, Type.TObject<{
        type: Type.TLiteral<"agent">;
        id: Type.TString;
      }>, Type.TObject<{
        type: Type.TLiteral<"remote">;
        pluginId: Type.TString;
        domain: Type.TString;
        idKind: Type.TString;
        id: Type.TString;
      }>, Type.TObject<{
        type: Type.TLiteral<"observation">;
        pluginId: Type.TUnion<[Type.TString, Type.TNull]>;
        accountId: Type.TUnion<[Type.TString, Type.TNull]>;
        senderKind: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"bot">, Type.TLiteral<"unknown">]>;
        id: Type.TString;
      }>, Type.TObject<{
        type: Type.TLiteral<"legacy">;
        actorType: Type.TString;
        source: Type.TUnion<[Type.TString, Type.TNull]>;
        id: Type.TString;
      }>]>>;
    }>;
    assignedBy: Type.TOptional<Type.TObject<{
      type: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
      label: Type.TOptional<Type.TString>;
      /** Durable profile avatar route; absent for actors without a stored profile avatar. */
      avatarUrl: Type.TOptional<Type.TString>;
      /** Display identity is separate from the actor fields used by ownership policy. */
      identity: Type.TOptional<Type.TUnion<[Type.TObject<{
        type: Type.TLiteral<"profile">;
        id: Type.TString;
      }>, Type.TObject<{
        type: Type.TLiteral<"agent">;
        id: Type.TString;
      }>, Type.TObject<{
        type: Type.TLiteral<"remote">;
        pluginId: Type.TString;
        domain: Type.TString;
        idKind: Type.TString;
        id: Type.TString;
      }>, Type.TObject<{
        type: Type.TLiteral<"observation">;
        pluginId: Type.TUnion<[Type.TString, Type.TNull]>;
        accountId: Type.TUnion<[Type.TString, Type.TNull]>;
        senderKind: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"bot">, Type.TLiteral<"unknown">]>;
        id: Type.TString;
      }>, Type.TObject<{
        type: Type.TLiteral<"legacy">;
        actorType: Type.TString;
        source: Type.TUnion<[Type.TString, Type.TNull]>;
        id: Type.TString;
      }>]>>;
    }>>;
    assignedAt: Type.TOptional<Type.TNumber>;
  }>>;
  participants: Type.TOptional<Type.TArray<Type.TObject<{
    identity: Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"profile">;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"agent">;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"remote">;
      pluginId: Type.TString;
      domain: Type.TString;
      idKind: Type.TString;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"observation">;
      pluginId: Type.TUnion<[Type.TString, Type.TNull]>;
      accountId: Type.TUnion<[Type.TString, Type.TNull]>;
      senderKind: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"bot">, Type.TLiteral<"unknown">]>;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"legacy">;
      actorType: Type.TString;
      source: Type.TUnion<[Type.TString, Type.TNull]>;
      id: Type.TString;
    }>]>;
    label: Type.TOptional<Type.TString>;
    avatarUrl: Type.TOptional<Type.TString>;
  }>>>;
  expandedParticipants: Type.TOptional<Type.TArray<Type.TObject<{
    identity: Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"profile">;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"agent">;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"remote">;
      pluginId: Type.TString;
      domain: Type.TString;
      idKind: Type.TString;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"observation">;
      pluginId: Type.TUnion<[Type.TString, Type.TNull]>;
      accountId: Type.TUnion<[Type.TString, Type.TNull]>;
      senderKind: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"bot">, Type.TLiteral<"unknown">]>;
      id: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"legacy">;
      actorType: Type.TString;
      source: Type.TUnion<[Type.TString, Type.TNull]>;
      id: Type.TString;
    }>]>;
    label: Type.TOptional<Type.TString>;
    avatarUrl: Type.TOptional<Type.TString>;
  }>>>;
  participantCount: Type.TOptional<Type.TInteger>;
  visibility: Type.TOptional<Type.TUnion<[Type.TLiteral<"shared">, Type.TLiteral<"read-only">, Type.TLiteral<"suggest">, Type.TLiteral<"draft">]>>;
  sharingRole: Type.TOptional<Type.TUnion<[Type.TLiteral<"admin">, Type.TLiteral<"owner">, Type.TLiteral<"member">, Type.TLiteral<"viewer">]>>;
  createdAt: Type.TOptional<Type.TNumber>;
  forkSource: Type.TOptional<Type.TObject<{
    sessionKey: Type.TString;
    sessionId: Type.TString;
    entryId: Type.TOptional<Type.TString>;
  }>>;
  previousSessionId: Type.TOptional<Type.TString>;
  inputTokens: Type.TOptional<Type.TNumber>;
  outputTokens: Type.TOptional<Type.TNumber>;
  totalTokens: Type.TOptional<Type.TNumber>;
  totalTokensFresh: Type.TOptional<Type.TBoolean>;
  contextTokens: Type.TOptional<Type.TNumber>;
  estimatedCostUsd: Type.TOptional<Type.TNumber>;
  model: Type.TOptional<Type.TString>;
  modelProvider: Type.TOptional<Type.TString>;
  /** Runtime model serving this session while it differs from the selected model. */
  activeModel: Type.TOptional<Type.TString>;
  activeModelProvider: Type.TOptional<Type.TString>;
  /** Effective override provenance; null means configured default, omission means not projected. */
  modelOverrideSource: Type.TOptional<Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"auto">, Type.TLiteral<"inherited">, Type.TNull]>>;
  toolOverrides: Type.TOptional<Type.TObject<{
    mcpServers: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
    mcpToolsDeny: Type.TOptional<Type.TRecord<"^.*$", Type.TArray<Type.TString>>>;
    skills: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
    webSearch: Type.TOptional<Type.TBoolean>;
  }>>;
}>;
type SessionRunStatus = Static<typeof SessionRunStatusSchema>;
type SessionRow = Static<typeof SessionRowSchema>;
type SessionEntryArchiveReason = Static<typeof SessionEntryArchiveReasonSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/human-mentions.d.ts
/** Explicit selections bound to UTF-16 offsets in the submitted message text. */
declare const HumanMentionSchema: Type.TObject<{
  profileId: Type.TString;
  start: Type.TInteger;
  end: Type.TInteger;
}>;
type HumanMention = Static<typeof HumanMentionSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/logs-chat.d.ts
declare const QUEUE_MODES: readonly ["steer", "followup", "collect", "interrupt"];
type QueueMode = (typeof QUEUE_MODES)[number];
//#endregion
//#region packages/gateway-protocol/src/schema/sessions.d.ts
/** Live session status judgment broadcast to subscribed operator clients. */
declare const SessionObserverDigestSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  lifecycleRevision: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  revision: Type.TInteger;
  updatedAt: Type.TInteger;
  headline: Type.TString;
  assessment: Type.TOptional<Type.TString>;
  health: Type.TUnion<[Type.TLiteral<"on-track">, Type.TLiteral<"grinding">, Type.TLiteral<"stuck">, Type.TLiteral<"waiting-on-user">, Type.TLiteral<"wrapping-up">, Type.TLiteral<"done">, Type.TLiteral<"failed">]>;
  planProgress: Type.TOptional<Type.TObject<{
    completed: Type.TInteger;
    total: Type.TInteger;
  }>>;
}>;
type SessionObserverDigest = Static<typeof SessionObserverDigestSchema>;
//#endregion
//#region src/channels/chat-type.d.ts
/**
 * Normalized conversation kind shared by channel routing, sessions, and SDK helpers.
 */
type ChatType = "direct" | "group" | "channel";
//#endregion
//#region src/cron/scheduled-tool-policy.d.ts
/** Closed, server-authored origin of an account-scoped scheduled tool cap. */
type CronScheduledToolCallerOrigin = {
  kind: "external";
  channel: string;
} | {
  kind: "local";
} | {
  kind: "unknown";
};
/**
 * Restrict-only execution target for a job's exec grant, captured from a
 * creator surface whose only exec capability was host-pinned. New pinned jobs
 * persist this as part of a grant-coupled envelope; unmarked legacy jobs keep
 * baseline exec behavior.
 */
type CronToolsAllowExecTarget = {
  version: 1;
  host: "gateway";
  /** Mandatory approval floor inherited from the captured creator surface. */
  ask?: "always";
};
/** Persisted proof that this job was created with an exact exec restriction. */
type CronToolsAllowExecTargetRequirement = {
  version: 1;
  target: CronToolsAllowExecTarget;
  grantIndex: number;
  recoveryRequired?: never;
} | {
  version: 1;
  target?: never;
  recoveryRequired: true;
};
/** Server-authored provenance for a persisted scheduled tool-cap authority envelope. */
type CronScheduledToolPolicy = {
  version: 1;
  mode: "trusted";
  ownerSessionKey?: never;
  ownerAccountId?: never;
} | {
  version: 1;
  mode: "account";
  ownerSessionKey: string;
  ownerAccountId: string;
};
//#endregion
//#region src/shared/session-types.d.ts
/** Per-session Control UI face preference carried by session list rows. */
type SessionBoardFace = "chat" | "dashboard";
//#endregion
//#region src/config/sessions/main-session-recovery.types.d.ts
type MainRestartRecoveryState = {
  /** Stable identity for one interrupted episode; prevents clear-and-rewedge ABA matches. */
  cycleId: string;
  /** Monotonic identity for observations within the current recovery cycle. */
  revision: number;
  /** Attempts charged when their reservation is persisted, before dispatch. */
  chargedAttempts: number;
  /** Last attempt observed starting a backend turn; later startup failures get a fresh budget. */
  startedAttempt?: number;
  /** Private safe token for one recovered outer turn; raw identity refs never enter session state. */
  executionIdentity?: {
    tokenVersion: 1;
    contextId: string;
    executionId: string;
    runId: string;
    createdAt: number;
  };
  reservation?: {
    runId: string;
    attempt: number;
    lifecycleGeneration: string;
  };
  foregroundClaims?: {
    lifecycleGeneration: string;
    tokens: string[];
    /** Run identity for claims that have crossed the actual agent-run boundary. */
    runIdsByClaimId?: Record<string, string>;
  };
  tombstone?: {
    reason: string;
    /** Durable successor returned when an explicit rollover request is retried. */
    recoveredSessionId?: string;
    recoveredSessionKey?: string;
  };
};
//#endregion
//#region src/config/sessions/pending-final-delivery-types.d.ts
type PendingFinalDeliveryState = {
  createdAt: number;
  context?: DeliveryContext;
  intentId?: string;
  deliveries?: Array<{
    id: string;
    state: "prepared" | "queued" | "delivered" | "suppressed" | "unknown";
  }>;
} & ({
  kind: "replayable";
  text: string;
} | {
  kind: "transport-only";
});
/**
 * Owed user-visible notice that a final's delivery outcome stayed unknown.
 * Settled unknown custody records the debt here; the next same-route turn
 * sends it once, so an ambiguous loss never ends silently.
 */
type PendingDeliveryNoticeState = {
  createdAt: number;
  context: DeliveryContext;
  intentId: string;
  state: "owed" | "unresolved" | "acknowledged";
};
//#endregion
//#region src/config/sessions/session-model-fallback.d.ts
type AgentPatchedSessionModelFallback = {
  prevModel: string;
  prevProvider: string;
  prevModelOverride?: string;
  prevProviderOverride?: string;
  prevModelOverrideSource?: "auto" | "user" | "default";
  prevModelOverrideRouteResolution?: "resolved";
  prevModelOverrideFallbackOriginProvider?: string;
  prevModelOverrideFallbackOriginModel?: string;
  prevAuthProfileOverride?: string;
  prevAuthProfileOverrideSource?: "auto" | "user" | "user-link";
  prevAuthProfileOverrideCompactionCount?: number;
  prevContextWindow?: string;
  prevThinkingLevel?: string;
  lastValidatedPatchTs?: number;
  ts: number;
  source: "agent-patch";
};
//#endregion
//#region src/agents/sessions/source-info.d.ts
/**
 * Source metadata helpers for session resources.
 *
 * Tracks where prompts, skills, and extension-provided assets came from for diagnostics and UI.
 */
type SourceScope = "user" | "project" | "temporary";
type SourceOrigin = "package" | "top-level";
interface PathMetadata {
  source: string;
  scope: SourceScope;
  origin: SourceOrigin;
  baseDir?: string;
}
interface SourceInfo extends PathMetadata {
  path: string;
}
//#endregion
//#region src/skills/loading/skill-contract.d.ts
interface Skill {
  name: string;
  /** Human-readable title from the first Markdown H1, falling back to the identifier. */
  displayName?: string;
  description: string;
  /** Additional loading guidance rendered with the location in full and compact catalogs. */
  locationNote?: string;
  /** Prepared instructions for transferred bundles or non-filesystem locators such as node://. */
  readContent?: string;
  /** Prepared runtime identity of instruction bytes, or the complete delivered bundle tree. */
  contentHash?: string;
  filePath: string;
  baseDir: string;
  /** Assigned by Gateway discovery, never accepted from the workspace provider. */
  fileHost?: "gateway" | "workspace";
  /** @deprecated Ignored; retained for API compatibility until the next Plugin SDK major. */
  promptVersion?: string;
  sourceInfo: SourceInfo;
  disableModelInvocation: boolean;
  source: string;
}
//#endregion
//#region src/config/sessions/session-prompt-types.d.ts
type SessionSkillPromptRef = {
  version: 1;
  algorithm: "sha256";
  hash: string;
  bytes: number;
};
type SessionSkillSnapshot = {
  librarySelections?: SkillLibrarySelection[];
  prompt: string;
  /** Persisted stores may replace large duplicate prompts with a content-addressed blob ref. */
  promptRef?: SessionSkillPromptRef;
  skills: Array<{
    name: string;
    primaryEnv?: string;
    requiredEnv?: string[];
  }>;
  /** Normalized agent-level filter used to build this snapshot; undefined means unrestricted. */
  skillFilter?: string[];
  /** Effective node-exec eligibility used to select connected node-hosted skills. */
  nodeSkillsEligibility?: {
    canExec: boolean;
    node?: string;
  };
  /**
   * Runtime-only, never persisted. Carries the full parsed Skill[] (including
   * each SKILL.md body) so the embedded runner can skip a workspace skill
   * scan within a turn. Persistence projections strip it before committing
   * session state. On a cold session resume this is undefined and
   * src/skills/runtime/embedded-run-entries.ts rebuilds it from disk.
   */
  resolvedSkills?: Skill[];
  version?: number;
};
//#endregion
//#region src/config/sessions/session-system-prompt-report.d.ts
/** Persisted size and provenance summary for one assembled system prompt. */
type SessionSystemPromptReport = {
  source: "run" | "estimate";
  generatedAt: number;
  sessionId?: string;
  sessionKey?: string;
  provider?: string;
  model?: string;
  workspaceDir?: string;
  bootstrapMaxChars?: number;
  bootstrapTotalMaxChars?: number;
  bootstrapTruncation?: {
    warningMode?: "off" | "once" | "always";
    warningShown?: boolean;
    promptWarningSignature?: string;
    warningSignaturesSeen?: string[];
    truncatedFiles?: number;
    nearLimitFiles?: number;
    totalNearLimit?: boolean;
  };
  sandbox?: {
    mode?: string;
    sandboxed?: boolean;
  };
  systemPrompt: {
    chars: number;
    projectContextChars: number;
    nonProjectContextChars: number;
    hash?: string;
  };
  currentTurn?: {
    kind?: "user_request" | "room_event";
    promptChars: number;
    runtimeContextChars: number;
    modelOnlyPromptChars?: number;
  };
  injectedWorkspaceFiles: Array<{
    name: string;
    path: string;
    missing: boolean;
    rawChars: number;
  } & ({
    injectionStatus?: "verified";
    injectedChars: number;
    truncated: boolean;
  } | {
    injectionStatus: "native_unverified";
    injectedChars: null;
    truncated: null;
  })>;
  skills: {
    promptChars: number;
    hash?: string;
    entries: Array<{
      name: string;
      blockChars: number;
    }>;
  };
  tools: {
    listChars: number;
    schemaChars: number;
    entries: Array<{
      name: string;
      summaryChars: number;
      summaryHash?: string;
      schemaChars: number;
      schemaHash?: string;
      propertiesCount?: number | null;
    }>;
  };
};
//#endregion
//#region src/config/sessions/session-tool-overrides.d.ts
type SessionToolOverrides = {
  mcpServers?: Record<string, boolean>;
  mcpToolsDeny?: Record<string, string[]>;
  skills?: Record<string, boolean>;
  webSearch?: boolean;
};
//#endregion
//#region src/config/sessions/session-worktree-intent.d.ts
/** Private source selection accepted under the session creation lifecycle lock. */
type PendingSessionWorktree = {
  workspace?: string;
  /** Source custody accepted by the locked creation owner, not public request input. */
  source?: {
    kind: "project" | "worktree";
    id: string;
  };
  name?: string;
  baseRef?: string;
  /** Verified commit used for checkout while baseRef remains user-facing metadata. */
  baseCommit?: string;
  titleSource: string;
};
//#endregion
//#region src/config/sessions/types.d.ts
type SessionScope = "per-sender" | "global";
type SessionChatType = ChatType;
type PersistedSessionRunStatus = SessionRunStatus | "interrupted";
declare const SESSION_TOTAL_TOKENS_VERSION: 1;
type SessionOrigin = {
  label?: string;
  provider?: string;
  surface?: string;
  chatType?: SessionChatType;
  from?: string;
  to?: string;
  nativeChannelId?: string;
  nativeDirectUserId?: string;
  avatar?: string;
  accountId?: string;
  threadId?: string | number;
};
/** Canonical persisted delivery ownership for one session. */
type SessionDeliveryState = {
  kind: "none";
} | {
  kind: "internal";
} | {
  kind: "external";
  route: ChannelRouteRef;
  context: DeliveryContext;
  origin: SessionOrigin;
};
/**
 * Durable transcript-repair record: an assistant final that was delivered to
 * the user but could not be appended to the canonical transcript. Kept
 * separate from `pendingFinalDelivery` so transport-replay cleanup never drops
 * the only copy of the missing assistant turn.
 */
type PendingTranscriptRepairState = {
  /** Stable identity for retry-safe transcript insertion. */
  id: string;
  text: string;
  provider?: string;
  model?: string;
  createdAt: number;
};
type FallbackNoticeState = {
  kind: "active";
  selectedModel: string;
  activeModel: string;
  reason?: string;
};
type MemoryFlushState = {
  kind: "succeeded";
  compactionCount: number;
} | {
  kind: "failed";
  compactionCount?: number;
  failureCount: number;
};
type CliSessionReseedReceipt = {
  version: 1;
  promptHash: string;
  localSessionId: string;
  userTurnDisposition: "persisted" | "omitted";
};
type SessionDiffBaseline = {
  version: 1;
  sessionId: string;
  root: string;
  files: Array<{
    path: string;
    fingerprint: string;
  }>;
  /** Some checkout entries could not be fingerprinted without exceeding diff safety caps. */
  truncated?: true;
};
type CliSessionBinding = {
  sessionId: string;
  /** Last successful assistant boundary accepted by the backend's resume contract. */
  resumeCheckpointId?: string;
  /** Resume with the backend's fork argument once, then clear before process start. */
  forkNextResume?: true;
  /** Trust an explicitly attached CLI session even when auth, prompt, or MCP fingerprints drift. */
  forceReuse?: boolean;
  authProfileId?: string;
  authEpoch?: string;
  authEpochVersion?: number;
  extraSystemPromptHash?: string;
  messageToolPolicyHash?: string;
  promptToolNamesHash?: string;
  cwdHash?: string;
  mcpConfigHash?: string;
  mcpResumeHash?: string;
  /** Identifies one synthetic history prompt and the trusted local handling of its user turn. */
  reseedReceipt?: CliSessionReseedReceipt;
};
type AcpSessionBinding = {
  acpBackendId: string;
  acpAgentId: string;
  agentSessionId: string;
};
type SessionContextBudgetStatusRoute = "fits" | "compact_only" | "truncate_tool_results_only" | "compact_then_truncate";
type SessionContextBudgetStatus = {
  schemaVersion: 1;
  source: "pre-prompt-estimate";
  updatedAt: number;
  provider: string;
  model: string;
  route: SessionContextBudgetStatusRoute;
  shouldCompact: boolean;
  estimatedPromptTokens: number;
  contextTokenBudget: number;
  promptBudgetBeforeReserve: number;
  reserveTokens: number;
  effectiveReserveTokens: number;
  remainingPromptBudgetTokens: number;
  overflowTokens: number;
  toolResultReducibleChars: number;
  messageCount: number;
  unwindowedMessageCount: number;
  sessionId?: string;
};
type AmbientTranscriptWatermark = {
  sessionId: string;
  messageId: string;
  timestampMs?: number;
  updatedAt: number;
};
type SessionPluginDebugEntry = {
  pluginId: string;
  lines: string[];
};
type SessionPluginJsonValue = string | number | boolean | null | SessionPluginJsonValue[] | {
  [key: string]: SessionPluginJsonValue;
};
type SessionPluginNextTurnInjection = {
  id: string;
  pluginId: string;
  pluginName?: string;
  text: string;
  idempotencyKey?: string;
  placement: "prepend_context" | "append_context";
  ttlMs?: number;
  createdAt: number;
  metadata?: SessionPluginJsonValue;
};
type SubagentRecoveryState = {
  /** Consecutive accepted automatic orphan-recovery resumes in the rapid re-wedge window. */
  automaticAttempts?: number;
  /** Timestamp (ms) of the latest accepted automatic orphan-recovery resume. */
  lastAttemptAt?: number;
  /** Registry run id that triggered the latest automatic orphan-recovery resume. */
  lastRunId?: string;
  /** Visible execution retained while the recovered run uses an internal transcript. */
  sessionLifecycleRunId?: string;
  /** Timestamp (ms) when automatic recovery was tombstoned for this session. */
  wedgedAt?: number;
  /** Human-readable reason automatic recovery was tombstoned. */
  wedgedReason?: string;
};
type LaneExecutionState = "active" | "draining" | "suspended" | "resuming" | "circuit_open" | "failed_handoff";
interface QuotaSuspension {
  schemaVersion: 1;
  suspendedAt: number;
  reason: "quota_exhausted" | "manual" | "circuit_open";
  failedProvider: string;
  failedModel: string;
  /** Recovery briefing text injected into the next attempt when state === "resuming". */
  summary?: string;
  /** Opaque pointer to an external snapshot blob (path/key); not the briefing text itself. */
  snapshotRef?: string;
  /**
   * @deprecated Lane suspension was removed; nothing writes this anymore. Kept only to
   * hold the shipped SDK surface stable; drop at the next surface window.
   */
  laneId?: string;
  expectedResumeBy?: number;
  state: LaneExecutionState;
}
type RestartRecoveryRun = {
  runId: string;
  lifecycleGeneration: string;
};
type SessionEntryCore = SessionRestartRecoveryState & SessionEntryProvenance & Pick<SessionRow, "permissionMode" | "sandboxMode" | "nativeRuntimeConsent" | "sessionRoot"> & {
  /** Collaboration mode. Missing legacy values are equivalent to "shared". */
  visibility?: NonNullable<SessionRow["visibility"]>;
  /**
   * Last delivered heartbeat payload (used to suppress duplicate heartbeat notifications).
   * Stored on the main session entry.
   */
  lastHeartbeatText?: string;
  /** Timestamp (ms) when lastHeartbeatText was delivered. */
  lastHeartbeatSentAt?: number;
  /**
   * Base session key for heartbeat-created isolated sessions.
   * When present, `<base>:heartbeat` is a synthetic isolated session rather than
   * a real user/session-scoped key that merely happens to end with `:heartbeat`.
   */
  heartbeatIsolatedBaseSessionKey?: string;
  /** Legacy heartbeat task timestamps consumed and cleared only by doctor migration. */
  heartbeatTaskState?: Record<string, number>;
  /** Plugin-owned session state, grouped by plugin id then extension namespace. */
  pluginExtensions?: Record<string, Record<string, SessionPluginJsonValue>>;
  /** Trusted session initialization is incomplete; all work admission stays blocked. */
  initializationPending?: true;
  /** Top-level SessionEntry mirror slots owned by plugin session extensions. */
  pluginExtensionSlotKeys?: Record<string, Record<string, string>>;
  /** Durable one-shot prompt additions drained before the next agent turn. */
  pluginNextTurnInjections?: Record<string, SessionPluginNextTurnInjection[]>;
  sessionId: string;
  updatedAt: number;
  /** Process-lifetime session whose entry and transcript stay in the in-memory agent database. */
  incognito?: true;
  /** Opaque owner revision used to reject stale lifecycle mutations. */
  lifecycleRevision?: string;
  /** Current provider precaution; only its acknowledged continuation may start work. */
  providerReview?: SessionProviderReview;
  /** Timestamp (ms) when the session was archived from active session lists. */
  archivedAt?: number;
  /** Actor that archived the session; cleared when the session is restored. */
  archivedBy?: SessionActor;
  /** Stable lifecycle cause; absent values are legacy archives and remain manually protected. */
  archiveReason?: SessionEntryArchiveReason;
  /** Timestamp (ms) when the session was pinned for quick access. */
  pinnedAt?: number;
  /** Timestamp (ms) when an operator client last marked the session read. */
  lastReadAt?: number;
  /** Agent-declared sidebar presence; projection drops it after expiresAt. */
  agentStatus?: SessionAgentStatus;
  /** Latest utility-model status judgment for idle session status surfaces. */
  observerDigest?: SessionObserverDigest;
  /** Versioned, reconstructible Activity recap; never authoritative task status. */
  activitySummary?: SessionActivitySummary;
  /** Timestamp (ms) when an operator explicitly marked the session unread; cleared on read. */
  markedUnreadAt?: number;
  /** Timestamp (ms) of the latest completed agent run; metadata patches do not update it. */
  lastActivityAt?: number;
  /** Parent session key that spawned this session (used for sandbox session-tool scoping). */
  spawnedBy?: string;
  /** Immutable session key authorized to receive this child's completion handoff. */
  completionOwnerSessionKey?: string;
  /** Workspace inherited by spawned sessions and reused on later turns for the same child session. */
  spawnedWorkspaceDir?: string;
  /** Task working directory inherited by spawned sessions and reused on later turns. */
  spawnedCwd?: string;
  /** Content-free fingerprints for checkout changes that predate this session generation. */
  sessionDiffBaseline?: SessionDiffBaseline;
  /**
   * Managed worktree bound to this session; set with spawnedCwd at worktree
   * creation and cleared together when a plain New Chat detaches the checkout.
   */
  worktree?: {
    id: string;
    branch: string;
    repoRoot: string;
    /** Durable skill workspace prepared when this session runs from a managed worktree. */
    canonicalWorkspaceDir?: string;
  };
  /** Project registry id selected when this logical session node was created. */
  projectId?: string;
  /** Durable cloud repository owner; never identifies a Gateway filesystem path. */
  repositoryWorkspaceId?: string;
  /** Explicit parent session linkage for dashboard-created child sessions. */
  parentSessionKey?: string;
  /** Exact parent incarnation captured when this child was created. */
  parentSessionId?: string;
  /** How this session node came to exist; written once and retained across sessionId rotations. */
  createdVia?: SessionCreatedVia;
  /** Actor that caused node creation, with an optional profile, session, or sender id; written once. */
  createdActor?: SessionCreatedActor;
  /** Creation-only sandbox requirement; existing unstamped sessions always remain unstamped. */
  sandbox?: "required";
  /** Mutable responsibility, projected from SQLite; absent means createdActor owns the session. */
  owner?: SessionOwnerAssignment;
  /** Retained identities, projected from the participant table before display truncation. */
  participants?: SessionParticipant[];
  /** Raw retained identity count, including the owner, for admission-bound coverage. */
  participantCount?: number;
  /** Node creation time (ms); unlike sessionStartedAt, survives sessionId rotations. */
  createdAt?: number;
  /** Exact source generation and optional cut entry for an actual transcript-copy fork. */
  forkSource?: {
    sessionKey: string;
    sessionId: string;
    entryId?: string;
  };
  /** Session id of the prior transcript generation under this same session key. */
  previousSessionId?: string;
  /** Thread parent-seeding settled marker; also set when seeding is deliberately skipped. */
  forkedFromParent?: boolean;
  /** Subagent spawn depth (0 = main, 1 = sub-agent, 2 = sub-sub-agent). */
  spawnDepth?: number;
  /** Explicit role assigned at spawn time for subagent tool policy/control decisions. */
  subagentRole?: "orchestrator" | "leaf";
  /** Explicit control scope assigned at spawn time for subagent control decisions. */
  subagentControlScope?: "children" | "none";
  /** Version of the requester tool-policy snapshot captured when this child was spawned. */
  inheritedToolPolicyVersion?: 1;
  /** Session-scoped tool deny entries inherited from the caller that created this session. */
  inheritedToolDeny?: string[];
  /** Session-scoped tool allow entries inherited from the caller that created this session. */
  inheritedToolAllow?: string[];
  systemSent?: boolean;
  abortedLastRun?: boolean;
  /** Interrupted run generations whose late lifecycle events must be ignored. */
  restartRecoveryRuns?: RestartRecoveryRun[];
  /** Keeps automatic restart recovery limited to replay-safe tools until the run terminates. */
  restartRecoveryForceSafeTools?: true;
  /** Durable guard state for automatic subagent orphan recovery. */
  subagentRecovery?: SubagentRecoveryState;
  /** Quota cascade protection and state-aware failover status. */
  quotaSuspension?: QuotaSuspension;
  /** Core-owned durable goal state for this thread/session. */
  goal?: SessionGoal;
  /** Timestamp (ms) when the current sessionId first became active. */
  sessionStartedAt?: number;
  /** Stable usage lineage key for transcript-backed rollups across sessionId rotations. */
  usageFamilyKey?: string;
  /** Session ids known to belong to this usage lineage, including archived predecessors. */
  usageFamilySessionIds?: string[];
  /** Timestamp (ms) of the last user/channel interaction that should extend idle lifetime. */
  lastInteractionAt?: number;
  /** Stable first-run start time for subagent sessions, persisted after completion. */
  startedAt?: number;
  /** Latest completed run end time for subagent sessions, persisted after completion. */
  endedAt?: number;
  /** Accumulated runtime across subagent follow-up runs, persisted after completion. */
  runtimeMs?: number;
  /** Final persisted subagent run status, used after in-memory run archival. */
  status?: PersistedSessionRunStatus;
  /** Compact user-facing reason for the latest failed or timed-out run. */
  lastRunError?: string;
  /**
   * Session-level stop cutoff captured when /stop is received.
   * Messages at/before this boundary are skipped to avoid replaying
   * queued pre-stop backlog.
   */
  abortCutoffMessageSid?: string;
  /** Epoch ms cutoff paired with abortCutoffMessageSid when available. */
  abortCutoffTimestamp?: number;
  chatType?: SessionChatType;
  contextWindow?: string;
  thinkingLevel?: string;
  /**
   * Exact isolated-cron continuation policy. Only hidden `:run:` session rows
   * carry this while detached generated-media work may still wake the run.
   */
  cronRunContinuation?: {
    lifecycleRevision: string;
    phase: "running" | "ready" | "continuing";
    /** True only after this row's session changes were projected to the stable cron row. */
    basePersisted?: boolean;
    ownerRunId?: string;
    /** Gateway lifecycle generation that owns a continuing claim. */
    ownerLifecycleGeneration?: string;
    /** CLI backend whose native session must exist before media work detaches. */
    cliExecutionProvider?: string;
    toolsAllow?: string[];
    toolsAllowIsDefault?: boolean;
    /** Exact server-stamped authority provenance copied from the owning cron job. */
    scheduledToolPolicy?: CronScheduledToolPolicy;
    /** Restrict-only exec pin copied from the owning cron job's cap. */
    toolsAllowExecTarget?: CronToolsAllowExecTarget;
    /** Expected pin copied with the cap so detached continuation loss fails closed. */
    toolsAllowExecTargetRequirement?: CronToolsAllowExecTargetRequirement;
    /** Store-private origin paired with an account scheduled-tool policy. */
    scheduledToolCallerOrigin?: CronScheduledToolCallerOrigin;
    cliSessionBindingFacts?: {
      extraSystemPromptStatic?: string;
      sourceReplyDeliveryMode?: "automatic" | "message_tool_only";
      requireExplicitMessageTarget?: boolean;
    };
  };
  fastMode?: FastMode;
  toolOverrides?: SessionToolOverrides;
  /** Swarm group for collector-mode child sessions. */
  swarmGroupId?: string;
  /** Marks non-interactive collector-mode child sessions. */
  swarmCollector?: boolean;
  /** JSON Schema exposed through the synthetic structured_output tool. */
  swarmOutputSchema?: Record<string, unknown>;
  verboseLevel?: string;
  traceLevel?: string;
  reasoningLevel?: string;
  elevatedLevel?: string;
  ttsAuto?: TtsAutoMode;
  /** Hash of the latest assistant reply that was sent through `/tts latest`. */
  lastTtsReadLatestHash?: string;
  /** Timestamp (ms) when `/tts latest` last sent audio for this session. */
  lastTtsReadLatestAt?: number;
  execHost?: string;
  execNode?: string;
  /** Working directory interpreted only by the bound exec node. */
  execCwd?: string;
  responseUsage?: "on" | "off" | "tokens" | "full";
  providerOverride?: string;
  modelOverride?: string;
  /** Session-scoped agent runtime/harness override selected with the model picker. */
  agentRuntimeOverride?: string;
  /**
   * Tracks whether the persisted model selection came from an explicit user
   * action (`/model`, `sessions.patch`), a temporary runtime fallback, or an
   * explicit configured-default selection that blocks parent inheritance.
   */
  modelOverrideSource?: "auto" | "user" | "default";
  /** Present only when providerOverride/modelOverride are a canonical route pair. */
  modelOverrideRouteResolution?: "resolved";
  /** Selected model that produced the current auto fallback override. */
  modelOverrideFallbackOriginProvider?: string;
  modelOverrideFallbackOriginModel?: string;
  /** One-run rollback guard for a model selected by the agent sessions tool. */
  modelFallback?: AgentPatchedSessionModelFallback;
  authProfileOverride?: string;
  authProfileOverrideSource?: "auto" | "user" | "user-link";
  authProfileOverrideCompactionCount?: number;
  /**
   * Set on explicit user-driven session model changes (for example `/model`
   * and `sessions.patch`) during an active run. The embedded runner checks
   * this flag to decide whether to throw `LiveSessionModelSwitchError`.
   * System-initiated fallbacks (rate-limit retry rotation) never set this
   * flag, so they are never mistaken for user-initiated switches.
   */
  liveModelSwitchPending?: boolean;
  groupActivation?: "mention" | "always";
  groupActivationNeedsSystemIntro?: boolean;
  sendPolicy?: "allow" | "deny";
  queueMode?: QueueMode;
  queueDebounceMs?: number;
  queueCap?: number;
  queueDrop?: "old" | "new" | "summarize";
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  pendingFinalDelivery?: PendingFinalDeliveryState;
  pendingDeliveryNotice?: PendingDeliveryNoticeState;
  /**
   * Ordered durable backlog of delivered assistant finals that failed to
   * reach the canonical transcript. Session admission restores each item
   * before another turn can extend that transcript. Kept as a list so
   * independently admitted writers never overwrite an earlier reply.
   */
  pendingTranscriptRepair?: PendingTranscriptRepairState[];
  /**
   * Whether totalTokens reflects a fresh context snapshot for the latest run.
   * Undefined means legacy/unknown freshness; false forces consumers to treat
   * totalTokens as stale/unknown for context-utilization displays.
   */
  totalTokensFresh?: boolean;
  /** Version 1 records totalTokens as the current prompt/context snapshot only. */
  totalTokensVersion?: typeof SESSION_TOTAL_TOKENS_VERSION;
  estimatedCostUsd?: number;
  cacheRead?: number;
  cacheWrite?: number;
  modelProvider?: string;
  model?: string;
  /**
   * Prevents OpenClaw model changes and automatic maintenance eviction until
   * the owning harness explicitly retires the session.
   */
  modelSelectionLocked?: boolean;
  /**
   * Embedded agent harness selected for this session id.
   * Prevents config/env changes from moving an existing transcript between
   * incompatible runtime harnesses.
   */
  agentHarnessId?: string;
  fallbackNotice?: FallbackNoticeState;
  contextTokens?: number;
  /** Origin of the persisted context window; `resolved` is legacy/unverified. */
  contextTokensSource?: "runtime" | "runtime-configured" | "resolved" | "resolved-v1";
  contextBudgetStatus?: SessionContextBudgetStatus;
  compactionCount?: number;
  memoryFlush?: MemoryFlushState;
  cliSessionIds?: Record<string, string>;
  cliSessionBindings?: Record<string, CliSessionBinding>;
  /** Initialization fence for seeding canonical ACP metadata; cleared after creation. */
  acpSessionBinding?: AcpSessionBinding;
  claudeCliSessionId?: string;
  label?: string;
  /** Automatic device name; never claims a custom label or overrides a generated title. */
  autoLabel?: string;
  /** Persistent sidebar emoji, named glyph, or canonical SVG image data URL. */
  icon?: string;
  /** Named sidebar tint (SESSION_COLOR_IDS); palette mirrors Claude Code /color for import. */
  color?: string;
  /** User-defined organization bucket for session lists; unrelated to chat groupId/groupChannel. */
  category?: string;
  /** Preferred Control UI face when a caller opens this session without explicit face intent. */
  boardFace?: SessionBoardFace;
  /** Shared dashboard presentation default; absence uses the built-in split view. */
  boardPresentation?: NonNullable<SessionRow["boardPresentation"]>;
  displayName?: string;
  /** Canonical delivery state. Legacy delivery fields are migrated by `openclaw doctor --fix`. */
  delivery?: SessionDeliveryState;
  groupId?: string;
  subject?: string;
  /** Display-only topic name; subject remains the group name used for routing. */
  topicName?: string;
  groupChannel?: string;
  space?: string;
  /** Last ambient room message durably appended to this transcript, keyed by channel scope. */
  ambientTranscriptWatermarks?: Record<string, AmbientTranscriptWatermark>;
  skillsSnapshot?: SessionSkillSnapshot;
  /** Explicit authorized immutable library pins; current speakers never replace this selection. */
  skillLibrarySelections?: SkillLibrarySelection[];
  systemPromptReport?: SessionSystemPromptReport;
  /**
   * Generic plugin-owned runtime debug entries shown in verbose status surfaces.
   * Each plugin owns and may overwrite only its own entry between turns.
   */
  pluginDebugEntries?: SessionPluginDebugEntry[];
  acp?: SessionAcpMeta;
};
interface SessionEntry extends SessionEntryCore {}
/** Internal durable fields excluded from public/plugin session projections. */
type SessionProfileInvolvement = {
  hidden: boolean;
  updatedAt: number;
  /** Original committed source ordering, retained when the person hides the session. */
  lastMention?: {
    generation: string;
    sequence: number;
    timestamp: number;
  };
};
type InternalSessionEntryCore = SessionEntryCore & {
  /** Personal discovery state, never participation, attribution, or sharing authority. */
  profileInvolvement?: {
    key: string;
    profiles: Record<string, SessionProfileInvolvement>;
  };
  /** Transcript-wide account provenance; native binding replacement must not replace it. */
  cliHistoryBoundary?: CliHistoryBoundary;
  /** Explicit world-readable publication, bound to one transcript generation. */
  publicShare?: {
    id: string;
    sessionId: string;
    createdAt: number;
  };
  /** Run that owns the current non-terminal Gateway lifecycle projection. */
  lifecycleRunId?: string;
  /** Exact run that produced the latest terminal Gateway lifecycle projection. */
  lastRunId?: string;
  /** Run admitted by the session lane; overwritten at admission and checked by transcript writes. */
  activeWriterRunId?: string;
  /** Canonical remote repository awaiting preparation by this exact session generation. */
  pendingProjectGitUrl?: string;
  /** Authorized worktree intent awaiting preparation by an admitted turn. */
  pendingWorktree?: PendingSessionWorktree;
  /** Suppresses repeated byte-triggered compaction after an oversized successor was observed. */
  transcriptByteCompactionLatch?: {
    activeBytes: number;
    sessionId: string;
    maxBytes: number;
  };
  /** Private per-generation ownership for the pre-runtime checkout baseline capture. */
  sessionDiffBaselineCapture?: SessionDiffBaselineCapture;
  mainRestartRecovery?: MainRestartRecoveryState;
};
interface InternalSessionEntry extends InternalSessionEntryCore {}
//#endregion
//#region src/sessions/provider-review.d.ts
declare const acknowledgmentBrand: unique symbol;
/** Host-issued capability; serialized request metadata cannot create one. */
interface ProviderReviewAcknowledgment {
  readonly [acknowledgmentBrand]: true;
  readonly read: () => Readonly<{
    review: Readonly<SessionProviderReview>;
    phase: "pending" | "accepted";
  }>;
  readonly assertRuntime: (runtime: {
    provider: string;
    model: string;
    runtimeId: string;
    api?: string;
    assertCurrent: () => void;
  }) => Promise<void>;
  readonly acceptNativeTurn: (accepted: {
    nativeThreadId: string;
    nativeTurnId: string;
    assertCurrent: () => void;
  }) => Promise<void>;
}
//#endregion
//#region packages/normalization-core/src/agent-run-terminal-outcome.d.ts
declare const AGENT_RUN_TIMEOUT_PHASES: readonly ["queue", "preflight", "provider", "post_turn", "gateway_draining"];
type AgentRunTimeoutPhase = (typeof AGENT_RUN_TIMEOUT_PHASES)[number];
type AgentRunWaitStatus = "ok" | "error" | "timeout";
type AgentRunTerminalReason = "completed" | "hard_timeout" | "timed_out" | "superseded" | "cancelled" | "aborted" | "blocked" | "abandoned" | "failed";
type AgentRunTerminalFacts = {
  reason: AgentRunTerminalReason;
  status: AgentRunWaitStatus;
  stopReason?: string;
  livenessState?: string;
  timeoutPhase?: AgentRunTimeoutPhase;
  providerStarted?: boolean;
};
//#endregion
//#region src/agents/agent-run-terminal-outcome.types.d.ts
/** Normalized terminal outcome for an agent run. */
type AgentRunTerminalOutcome = AgentRunTerminalFacts & {
  error?: string;
  startedAt?: number;
  endedAt?: number;
};
//#endregion
//#region src/audit/execution-identity-admission.d.ts
declare const ExecutionIdentityAdmissionTokenSchema: Type.TObject<{
  tokenVersion: Type.TLiteral<1>;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  createdAt: Type.TInteger;
}>;
type ExecutionIdentityAdmissionToken = Static<typeof ExecutionIdentityAdmissionTokenSchema>;
//#endregion
//#region src/infra/outbound/reply-payload-parts.d.ts
/** Derived sendability facts for text/media outbound payload delivery. */
type SendableOutboundReplyParts = {
  /** Raw text selected for delivery before trimming. */
  text: string;
  /** Text after trimming whitespace for sendability checks. */
  trimmedText: string;
  /** Normalized non-empty media URLs. */
  mediaUrls: string[];
  /** Number of normalized media URLs. */
  mediaCount: number;
  /** Whether trimmed text is sendable. */
  hasText: boolean;
  /** Whether at least one media URL is sendable. */
  hasMedia: boolean;
  /** Whether the payload has any sendable text or media. */
  hasContent: boolean;
};
/** Prepared payload entry that keeps source indexing plus reusable projections. */
type OutboundPayloadPlan = {
  sourceIndex: number;
  payload: ReplyPayload;
  parts: SendableOutboundReplyParts;
  hasPresentation: boolean;
  hasInteractive: boolean;
  hasChannelData: boolean;
};
//#endregion
//#region src/sessions/user-turn-transcript.types.d.ts
type UserTurnSessionEntry = SessionEntry;
type PersistedUserTurnMessage = Extract<AgentMessage, {
  role: "user";
}> & {
  display?: false;
  excludeFromContext?: true;
  /** Private transcript correlation; never authorizes an execution. */
  idempotencyKey?: string;
  provenance?: InputProvenance;
  __openclaw?: Record<string, unknown> & {
    humanMentions?: readonly HumanMention[];
  };
};
type UserTurnTranscriptUpdateMode = "inline" | "none";
type UserTurnBeforeMessageWrite = (params: {
  message: PersistedUserTurnMessage;
  agentId?: string;
  sessionKey?: string;
}) => AgentMessage | null;
type UserTurnTranscriptPersistenceTarget = {
  sessionId: string;
  expectedSessionId?: string;
  initialSessionEntry?: SessionEntry;
  sessionKey: string;
  sessionEntry: UserTurnSessionEntry | undefined;
  sessionStore?: Record<string, UserTurnSessionEntry>;
  storePath?: string;
  agentId: string;
  threadId?: string | number;
  cwd?: string;
  config?: unknown;
  beforeMessageWrite?: UserTurnBeforeMessageWrite;
};
type UserTurnTranscriptTarget = UserTurnTranscriptPersistenceTarget;
type UserTurnTranscriptAdmissionReceipt = TranscriptTurnAdmission;
type UserTurnTranscriptPersistResult = {
  sessionTurnMutationResult?: SessionTranscriptTurnMutationResult;
  /** True only when this call inserted the transcript message. */
  appended?: boolean;
  sessionFile: string;
  sessionEntry: UserTurnSessionEntry | undefined;
  messageId: string;
  message: PersistedUserTurnMessage;
  admission: UserTurnTranscriptAdmissionReceipt;
};
type UserTurnTranscriptTargetResolver = UserTurnTranscriptTarget | (() => UserTurnTranscriptTarget | undefined | Promise<UserTurnTranscriptTarget | undefined>);
type UserTurnTranscriptRecorder = {
  readonly message: PersistedUserTurnMessage | undefined;
  resolveMessage: () => Promise<PersistedUserTurnMessage | undefined>;
  /** Committed input, accepted pending custody, and blocked notices are exempt. */
  assertOriginalInputCommit?: () => void;
  /** Durable input custody leaves the active transcript unchanged until execution owns it. */
  stageApproved?: (options: {
    runId: string;
    assertCurrent: () => void;
    assertAdmittedCurrent?: () => void;
    assertCompletionCurrent?: () => void;
  }) => Promise<boolean>;
  getProcessingCompletion?: () => AgentRunTerminalOutcome | undefined;
  completeProcessing?: (outcome: AgentRunTerminalOutcome) => AgentRunTerminalOutcome | undefined;
  getPendingInputMessage?: () => PersistedUserTurnMessage | undefined;
  isPendingInputConsumed?: () => boolean;
  withPendingInput?: <T>(run: () => T) => T;
  finishPendingInput?: (disposition: "cancelled" | "interrupted") => void;
  /** Replaces generated current-turn text before runtime persistence/provider submission. */
  replaceTextBeforePersistence?: (text: string) => void;
  /** Confirms exact-run steering provenance after transcript commitment is proven. */
  confirmSteerTargetRunIdForPersistence?: (targetRunId: string) => Promise<void>;
  getPersistedMessage?: () => PersistedUserTurnMessage | undefined;
  getAdmissionReceipt: () => UserTurnTranscriptAdmissionReceipt | undefined;
  setAdmissionHandler?: (handler: (admission: UserTurnTranscriptAdmissionReceipt) => void) => void;
  markSentToProvider?: () => void;
  markRuntimePersistencePending: (pending: Promise<void>) => void;
  markRuntimePersisted: (message?: PersistedUserTurnMessage, anchor?: TranscriptEntryAnchor | UserTurnTranscriptAdmissionReceipt, persistence?: {
    appended: boolean;
  }) => void;
  markBlocked: () => void;
  hasPersisted: () => boolean;
  isBlocked: () => boolean;
  hasRuntimePersistencePending: () => boolean;
  waitForRuntimePersistence: () => Promise<void>;
  persistApproved: (params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
    cwd?: string;
    expectedSessionId?: string;
    expectedSessionState?: SessionTranscriptTurnExpectedState;
    sessionLifecyclePatch?: SessionTranscriptTurnLifecyclePatch;
    /** Allow a later explicit persistence attempt when this attempt appends nothing. */
    retryIfUnpersisted?: boolean;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
  persistBlocked: (message: PersistedUserTurnMessage, params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
    cwd?: string;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
  persistFallback: (params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
    cwd?: string;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
};
//#endregion
//#region src/auto-reply/reply/typing.d.ts
/** Controller for channel typing indicator lifecycle during a reply run. */
type TypingController = {
  onReplyStart: () => Promise<void>;
  startTypingLoop: () => Promise<void>;
  startTypingOnText: (text?: string) => Promise<void>;
  refreshTypingTtl: () => void;
  isActive: () => boolean;
  markRunComplete: () => void;
  markDispatchIdle: () => void;
  cleanup: () => void;
};
//#endregion
//#region src/auto-reply/get-reply-options.types.d.ts
/** A successful runtime append, independent of optional active-path projection anchors. */
type ReplyDispatchAssistantTranscript = Pick<TranscriptEntryAnchor, "agentId" | "sessionId" | "sessionKey" | "storePath"> & {
  messageId: string;
  anchor?: TranscriptEntryAnchor;
  idempotencyKey: string;
};
type ReplyDispatchRun = {
  completionSource: "reply-dispatch";
  getResult: () => {
    assistantTranscript?: ReplyDispatchAssistantTranscript;
    terminalOutcome?: AgentRunTerminalOutcome;
  };
};
type BlockReplyContext = {
  abortSignal?: AbortSignal;
  timeoutMs?: number;
  /** Source assistant message index from the upstream stream, when available. */
  assistantMessageIndex?: number;
  /** @internal Stable durable outbound intent owned by the producing runtime. */
  deliveryIntentId?: string;
};
/** Context passed to onModelSelected callback with actual model used. */
type ModelSelectedContext = {
  provider: string;
  model: string;
  thinkLevel: string | undefined;
};
/** Typing indicator class for channel-owned UX policy. */
type TypingPolicy = "auto" | "user_message" | "system_event" | "internal_webchat" | "heartbeat";
/** Per-turn policy for source-message reply threading. */
type ReplyThreadingPolicy = {
  /** Override implicit reply-to-current behavior for the current turn. */
  implicitCurrentMessage?: "default" | "allow" | "deny";
};
/** Action sink available for model-proposed follow-up tasks during this turn. */
type TaskSuggestionDeliveryMode = "gateway";
/** Correlates queued reply ownership transfer with later delivery drains. */
type QueuedReplyDeliveryCorrelation = {
  begin: () => (() => void) | void;
};
/**
 * Exclusive: each lifecycle is its own collect-admission identity.
 * Cancel-only: share collect identity via ownerKey (gateway chat.send).
 */
type TurnAdoptionAdmission = "exclusive" | "cancel-only";
/**
 * Canonical turn-ownership lifecycle (adopt / defer / abandon / settle).
 * Single surface for durable ingress, gateway cancel identity, and reply-lane transfer.
 */
type TurnAdoptionLifecycle = {
  /**
   * Admission isolation mode (closed). Exclusive isolates collect identity per
   * lifecycle; cancel-only shares via ownerKey. Never inferred from onAbandoned.
   * Durable ingress sets exclusive; gateway cancel identity sets cancel-only.
   */
  admission?: TurnAdoptionAdmission;
  /** Transcript branch leaf from which this turn was admitted. */
  originatingLeafEntryId?: string | null;
  onAdopted: () => void | Promise<void>;
  /** Return false to reject followup enqueue. */
  onDeferred?: () => boolean | void;
  /** Pre-adoption liveness while waiting for reply-lane admission or preflight compaction. */
  onDeferredHeartbeat?: () => void;
  /** Requested cadence for pre-adoption heartbeats. */
  deferredHeartbeatIntervalMs?: number;
  /** Deferred turn finished without owning the reply lane. */
  onAbandoned?: () => void;
  /** Always fires when the followup ownership cycle ends (admitted or not). Gateway cleanup. */
  onSettled?: () => void;
  /** Retires cancellation ownership while retaining live identity. */
  onCancellationRetired?: () => void;
  /** Stable cancellation owner for collect-mode batches. */
  ownerKey?: string;
  abortSignal?: AbortSignal;
  /** Ephemeral fact: a direct local operator turn lost fresh cron authority when queued. */
  cronCreatorAuthorityUnavailable?: "queued-local-operator";
};
/** Partial assistant payload emitted during streaming or replacement updates. */
type PartialReplyPayload = {
  /**
   * Sanitized text, which may be an enumerable memoized getter. Content materializes on first
   * read: direct-delivery consumers pay per partial, while throttled consumers pay per flush.
   */
  text?: ReplyPayload["text"];
  mediaUrls?: ReplyPayload["mediaUrls"];
  delta?: string;
  replace?: true;
};
type ReasoningStreamPayload = Pick<ReplyPayload, "text" | "mediaUrls" | "isReasoning" | "isReasoningSnapshot"> & {
  requiresReasoningProgressOptIn?: boolean;
};
type ReasoningProgressPayload = {
  progressTokens: number;
};
/** Return false until the channel has accepted operator-visible progress. */
type ProgressCallbackResult = boolean | void;
/** Reply generation options shared by auto-reply, webchat, channels, and tests. */
type GetReplyOptions = {
  /** Host-issued capability for the exact findings acknowledged by the current operator. */
  providerReviewAcknowledgment?: ProviderReviewAcknowledgment;
  /** Channel-owned participant name encoding for source replies sent through message actions. */
  groupThreadReplyFormatter?: (text: string, participant: {
    agentId: string;
    name: string;
  }) => string;
  /** Override run id for agent events (defaults to random UUID). */
  runId?: string;
  /** Stable provider prompt-cache affinity key; distinct from run id/idempotency. */
  promptCacheKey?: string;
  /** Abort signal for the underlying agent run. */
  abortSignal?: AbortSignal;
  /** Ephemeral channel owner check for a targeted Stop; never serialized as authority. */
  isCommandTargetCurrent?: () => boolean;
  /** Optional inbound images (used for webchat attachments). */
  images?: ImageContent[];
  /** Original inline/offloaded attachment order for inbound images. */
  imageOrder?: PromptImageOrderEntry[];
  /** Ordered media facts whose model-facing text projection is already present in the prompt. */
  media?: MediaFact[];
  /**
   * Notifies when an agent run starts. Return "reply-dispatch" synchronously to accept
   * completion ownership offered in options; all other legacy callback results are ignored.
   */
  onAgentRunStart?: (runId: string, executionIdentityToken?: ExecutionIdentityAdmissionToken, options?: ReplyDispatchRun) => unknown;
  /** Reports the terminal agent-run classification to the shared dispatch owner. */
  onAgentRunTerminalOutcome?: (outcome: "completed" | "failed") => void;
  /**
   * Canonical adoption lifecycle (adopted / deferred / abandoned / settled + pre-adoption abort).
   */
  turnAdoptionLifecycle?: TurnAdoptionLifecycle;
  /** Shared lifecycle owner for the current user-turn transcript append. */
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder;
  /** Gateway-owned start-or-steer decision for this turn. */
  messageInjectionDisposition?: "none" | "accepted" | "rejected";
  /** Current user turn is already durable; replay it without appending another copy. */
  suppressNextUserMessagePersistence?: boolean;
  onReplyStart?: () => Promise<void> | void;
  /** Called when the typing controller cleans up (e.g., run ended with NO_REPLY). */
  onTypingCleanup?: () => void;
  onTypingController?: (typing: TypingController) => void;
  /** If false, send only the initial typing signal without periodic keepalive refreshes. */
  typingKeepalive?: boolean;
  isHeartbeat?: boolean;
  /** Policy-level typing control for run classes (user/system/internal/heartbeat). */
  typingPolicy?: TypingPolicy;
  /** Force-disable typing indicators for this run (system/internal/cross-channel routes). */
  suppressTyping?: boolean;
  /** Resolved heartbeat model override (provider/model string from merged per-agent config). */
  heartbeatModelOverride?: string;
  /** One-shot thinking level override for this run; does not persist to the session. */
  thinkingLevelOverride?: string;
  /** One-shot fast-mode override for this run; does not persist to the session. */
  fastModeOverride?: FastMode;
  /** One-shot auto fast-mode cutoff override in seconds; does not persist to the session. */
  fastModeAutoOnSecondsOverride?: number;
  /** Controls bootstrap workspace context injection (default: full). */
  bootstrapContextMode?: "full" | "lightweight";
  /** If true, run the model without OpenClaw tools for this turn. */
  disableTools?: boolean;
  /** Runtime tool allow-list for this turn. Empty means no tools. */
  toolsAllow?: string[];
  /** If true, include the heartbeat response tool for structured heartbeat outcomes. */
  enableHeartbeatTool?: boolean;
  /** If true, keep the heartbeat response tool available even under narrow tool profiles. */
  forceHeartbeatTool?: boolean;
  /**
   * @deprecated Ignored. The tool-failure warning is delivered whenever a run ends
   * without a reply and cannot be suppressed. Kept only so plugin-sdk callers that
   * still pass it keep compiling; removed in the first stable release after 2026.10.
   */
  suppressToolErrorWarnings?: boolean;
  /**
   * If true, dispatch skips default tool/progress text messages and expects the
   * channel to surface progress via its own streaming/edit UX.
   */
  suppressDefaultToolProgressMessages?: boolean;
  /** Suppress standalone tool/progress text even when verbose progress is enabled. */
  suppressToolProgressMessages?: boolean;
  /** Allow channel-owned tool lifecycle feedback while text progress remains hidden. */
  allowToolLifecycleWhenProgressHidden?: boolean;
  /**
   * Called before dispatch with a live getter for whether verbose standalone
   * progress messages are active for this run. Channels that render tool or
   * commentary progress inside an ephemeral streaming draft should yield those
   * draft lines while the getter returns true, so progress is not rendered in
   * both lanes at once.
   */
  onVerboseProgressVisibility?: (isActive: () => boolean) => void;
  /** Preserve source-event callback start order for stateful channel progress renderers. */
  preserveProgressCallbackStartOrder?: boolean;
  onPartialReply?: (payload: PartialReplyPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onReasoningStream?: (payload: ReasoningStreamPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onReasoningProgress?: (payload: ReasoningProgressPayload) => Promise<void> | void;
  streamReasoningInNonStreamModes?: boolean;
  /** Called when a thinking/reasoning block ends. */
  onReasoningEnd?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a new assistant message starts (e.g., after tool call or thinking block). */
  onAssistantMessageStart?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called synchronously when a block reply is logically emitted, before async
   * delivery drains. Useful for channels that need to rotate preview state at
   * block boundaries without waiting for transport acks. */
  onBlockReplyQueued?: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onBlockReply?: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<void> | void;
  /** Receives a block whose producer has already resolved inline directives. */
  onPreparedBlockReply?: (plan: OutboundPayloadPlan, context?: BlockReplyContext) => Promise<void> | void;
  onToolResult?: (payload: ReplyPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a tool phase starts/updates, before summary payloads are emitted. */
  onToolStart?: (payload: {
    itemId?: string;
    toolCallId?: string;
    name?: string;
    phase?: string;
    args?: Record<string, unknown>;
    detailMode?: "explain" | "raw";
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a concrete work item starts, updates, or completes. */
  onItemEvent?: (payload: {
    itemId?: string;
    toolCallId?: string;
    kind?: string;
    title?: string;
    name?: string;
    phase?: string;
    status?: string;
    summary?: string;
    progressText?: string;
    meta?: string;
    commandBearing?: boolean;
    approvalId?: string;
    approvalSlug?: string;
    suppressDurableProgress?: true;
    hideFromChannelProgress?: boolean;
    suppressChannelProgress?: boolean;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /**
   * Called when the utility-model narration of the in-progress turn changes.
   * Providing this callback opts the channel into progress narration; core
   * only generates narration when a utility model resolves (explicit
   * config or the provider-declared default; utilityModel: "" disables).
   * An empty text clears narration; a retained model preamble still wins before
   * the channel falls back to raw tool progress.
   */
  onNarrationUpdate?: (payload: {
    text: string;
  }) => Promise<void> | void;
  /** Channel-owned final and queued-turn boundaries for the current narrator. */
  onProgressNarratorLifecycle?: (lifecycle: {
    beginTurn: () => void;
    stopTurn: () => void;
  }) => void;
  /** False while utility-model narration has no visible progress draft. */
  isProgressDraftVisible?: () => boolean;
  /**
   * Omit exec/bash command text from narration model input, mirroring the
   * channel's `streaming.progress.commandText: "status"` display policy so
   * narration never receives more command detail than the draft shows.
   */
  narrationHideCommandText?: boolean;
  /** In progress mode, classify Claude pre-tool text; true also renders it as commentary. */
  commentaryProgressEnabled?: boolean;
  /** Bridge typed preambles to a channel-owned progress headline without commentary. */
  progressPreambleEnabled?: boolean;
  /** Deliver durable reasoning payloads to channels that own a separate reasoning lane. */
  reasoningPayloadsEnabled?: boolean;
  /** Deliver durable commentary (💬) payloads to channels that own a separate commentary lane. */
  commentaryPayloadsEnabled?: boolean;
  /** Optional turn-frozen commentary owner; visibility is live by default.
   * With the static opt-in and this callback, core freezes, evaluates once, and snapshots. */
  shouldDeliverCommentaryPayloads?: () => boolean;
  /** Called when the agent emits a structured plan update. */
  onPlanUpdate?: (payload: {
    phase?: string;
    title?: string;
    explanation?: string;
    /** Prepared literal text; unmarked explanations retain authored Markdown. */
    explanationFormat?: "plain";
    steps?: AgentPlanStep[];
    source?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when an approval becomes pending or resolves. */
  onApprovalEvent?: (payload: {
    phase?: string;
    kind?: string;
    status?: string;
    title?: string;
    itemId?: string;
    toolCallId?: string;
    approvalId?: string;
    approvalSlug?: string;
    command?: string;
    host?: string;
    reason?: string;
    scope?: "turn" | "session";
    message?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when command output streams or completes. */
  onCommandOutput?: (payload: {
    itemId?: string;
    phase?: string;
    title?: string;
    toolCallId?: string;
    name?: string;
    output?: string;
    status?: string;
    exitCode?: number | null;
    durationMs?: number;
    cwd?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a patch completes with a file summary. */
  onPatchSummary?: (payload: {
    itemId?: string;
    phase?: string;
    title?: string;
    toolCallId?: string;
    name?: string;
    added?: string[];
    modified?: string[];
    deleted?: string[];
    summary?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when context auto-compaction starts (allows UX feedback during the pause). */
  onCompactionStart?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when context auto-compaction ends; omitted outcome means completed for legacy callers. */
  onCompactionEnd?: (payload?: {
    completed: boolean;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when the actual model is selected (including after fallback).
   * Use this to get model/provider/thinkLevel for responsePrefix template interpolation. */
  onModelSelected?: (ctx: ModelSelectedContext) => void;
  /**
   * Controls whether normal assistant replies are automatically delivered to
   * the source conversation. `message_tool_only` prefers message-tool visible
   * delivery and keeps normal final text, block output, and preview output
   * private unless dispatch explicitly marks a source reply as deliverable.
   */
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  /** Enables task-suggestion tools only when the initiating surface can action Gateway events. */
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
  /** Starts delivery tracking when this turn later drains as a queued followup. */
  queuedDeliveryCorrelations?: QueuedReplyDeliveryCorrelation[];
  /** Called after a queued followup owns the reply lane, before its model run starts. */
  onQueuedFollowupAdmitted?: () => Promise<void> | void;
  /** Called after an admitted queued followup finishes, including failed attempts. */
  onQueuedFollowupSettled?: () => Promise<void> | void;
  /** Allow channel-owned progress UI while final/source reply delivery remains message-tool-only. */
  allowProgressCallbacksWhenSourceDeliverySuppressed?: boolean;
  /** Called when a suppressed source reply mode observes visible delivery through another path. */
  onObservedReplyDelivery?: () => Promise<void> | void;
  /** Emit tool result summaries for channel-owned progress UI even when verbose is off. */
  forceToolResultProgress?: boolean;
  disableBlockStreaming?: boolean;
  /** Timeout for block reply delivery (ms). */
  blockReplyTimeoutMs?: number;
  /** If provided, only load these skills for this session (empty = no skills). */
  skillFilter?: string[];
  /** Mutable ref to track if a reply was sent (for Slack "first" threading mode). */
  hasRepliedRef?: {
    value: boolean;
  };
  /** Override agent timeout in seconds (0 = no timeout). Threads through to resolveAgentTimeoutMs. */
  timeoutOverrideSeconds?: number;
  /** Millisecond run timeout override; takes precedence over seconds (0 = no timeout). */
  timeoutOverrideMs?: number;
};
//#endregion
//#region src/auto-reply/reply/get-reply.d.ts
declare function getReplyFromConfig$2(ctx: RuntimeMsgContext, options?: GetReplyOptions, configOverride?: OpenClawConfig): Promise<ReplyPayload | ReplyPayload[] | undefined>;
//#endregion
//#region src/cli/outbound-send-mapping.d.ts
type CliOutboundSendSource = {
  [channelId: string]: unknown;
};
//#endregion
//#region src/cli/deps.types.d.ts
/** CLI dependency bag currently used by outbound send command plumbing. */
type CliDeps = CliOutboundSendSource;
//#endregion
//#region src/cli/deps.d.ts
declare function createDefaultDeps$1(): CliDeps;
//#endregion
//#region src/cli/prompt.d.ts
/** Prompts for yes/no input, honoring global `--yes` before opening stdin. */
declare function promptYesNo$2(question: string, defaultYes?: boolean): Promise<boolean>;
//#endregion
//#region src/cli/wait.d.ts
declare function waitForever$1(): Promise<void>;
//#endregion
//#region src/config/sessions/paths.d.ts
/** Resolves fixed literal paths without an owner; derived or templated paths require agentId. */
declare function resolveSessionStorePathCore(store?: string, opts?: {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
}): string;
//#endregion
//#region src/config/sessions/session-key.d.ts
/**
 * Derives the raw session bucket from message context before agent/main-key normalization.
 *
 * Direct chats use sender identity, groups use channel-owned group keys, and global scope bypasses
 * sender routing entirely.
 */
declare function deriveSessionKey$1(scope: SessionScope, ctx: MsgContext): string;
/**
 * Resolves the persisted session-store key for an inbound message.
 *
 * Explicit session keys pass through the compatibility normalizer, direct chats collapse to the
 * agent's canonical main bucket, and group/channel sessions stay isolated under the same agent.
 */
declare function resolveSessionKey$1(scope: SessionScope, ctx: MsgContext, mainKey?: string, agentId?: string): string;
//#endregion
//#region src/process/exec-output.d.ts
type CommandOutputCaptureMode = "head" | "tail" | "discard";
type CommandOutputStream = "stdout" | "stderr";
type CommandOutputCaptureOption = CommandOutputCaptureMode | {
  stdout?: CommandOutputCaptureMode;
  stderr?: CommandOutputCaptureMode;
};
type CommandOutputLimitOption = boolean | {
  stdout?: boolean;
  stderr?: boolean;
  combined?: boolean;
};
type CommandOutputErrorOption = boolean | {
  stdout?: boolean;
  stderr?: boolean;
};
type PreserveOutputLine = (line: string, stream: CommandOutputStream) => boolean;
//#endregion
//#region src/process/exec-result.d.ts
type SpawnResult = {
  pid?: number;
  stdout: string;
  stderr: string;
  stdoutTruncatedBytes?: number;
  stderrTruncatedBytes?: number;
  preservedStdoutLines?: string[];
  preservedStderrLines?: string[];
  code: number | null;
  signal: NodeJS.Signals | null;
  killed: boolean;
  /** The runner accepted cancellation and requested termination, independent of the OS signal. */
  killIssuedByAbort?: boolean;
  /** Completion of this invocation's cleanup; never an escaped-descendant inventory. */
  cleanup?: "normal" | "cooperative" | "forced" | "uncertain";
  termination: "exit" | "timeout" | "no-output-timeout" | "signal";
  noOutputTimedOut?: boolean;
  outputLimitExceeded?: boolean;
  outputErrorStream?: "stdout" | "stderr";
};
//#endregion
//#region src/process/exec-runner.d.ts
type CommandOptions = {
  timeoutMs?: number;
  cwd?: string;
  input?: string | Uint8Array;
  /** Borrow a caller-owned descriptor as stdin without buffering or piping its bytes. */
  stdinFileDescriptor?: number;
  /** Synchronous admission with the spawned PID and argv, before input is released. */
  beforeInput?: (pid: number, argv?: readonly string[]) => void;
  baseEnv?: NodeJS.ProcessEnv;
  env?: NodeJS.ProcessEnv;
  windowsVerbatimArguments?: boolean;
  noOutputTimeoutMs?: number;
  signal?: AbortSignal;
  maxOutputBytes?: number | {
    stdout?: number;
    stderr?: number;
  };
  maxCombinedOutputBytes?: number;
  outputCapture?: CommandOutputCaptureOption;
  /** Observe raw output without owning child lifecycle. Return false to stop the command. */
  onOutputChunk?: (chunk: Buffer, stream: CommandOutputStream) => boolean | void;
  /** Accept a successful exit when only the selected diagnostic output stream failed. */
  tolerateOutputError?: {
    stdout?: boolean;
    stderr?: boolean;
  };
  /** Terminate when the selected output stream emits an error. */
  terminateOnOutputError?: CommandOutputErrorOption;
  terminateOnOutputLimit?: CommandOutputLimitOption;
  maxPreservedOutputLines?: number;
  preserveOutputLine?: PreserveOutputLine;
  killProcessTree?: boolean;
  /** Join owned descendants even after a successful root exits. */
  requireProcessTreeExtinction?: boolean;
  /** Initial signal for direct-child and graceful process-group cancellation. */
  killSignal?: NodeJS.Signals | number;
  /** Grace between graceful termination and the force-kill fallback. */
  killGraceMs?: number;
};
declare function runCommandWithTimeout$2(argv: string[], optionsOrTimeout: number | CommandOptions): Promise<SpawnResult>;
//#endregion
//#region src/process/exec.d.ts
type RunExecOptions = {
  timeoutMs?: number;
  maxBuffer?: number;
  logOutput?: boolean;
  cwd?: string;
  baseEnv?: NodeJS.ProcessEnv;
  env?: NodeJS.ProcessEnv;
  input?: string | Uint8Array;
  stdinFileDescriptor?: number;
  signal?: AbortSignal;
  /** Observe received bytes without changing buffering, completion or cancellation. */
  onOutputChunk?: (chunk: Buffer, stream: CommandOutputStream) => void;
};
declare function runExec$2(command: string, args: string[], opts?: number | RunExecOptions): Promise<{
  stdout: string;
  stderr: string;
}>;
//#endregion
//#region src/infra/binaries.d.ts
declare function ensureBinary$2(name: string, exec?: typeof runExec$2, runtime?: RuntimeEnv): Promise<void>;
//#endregion
//#region src/infra/ports.d.ts
declare class PortInUseError$1 extends Error {
  port: number;
  details?: string;
  constructor(port: number, details?: string);
}
declare function describePortOwner$1(port: number): Promise<string | undefined>;
/** Probes Node's wildcard bind by default; callers may scope checks to their owned interface. */
declare function ensurePortAvailable$1(port: number, host?: string, signal?: AbortSignal): Promise<void>;
declare function handlePortError$1(err: unknown, port: number, context: string, runtime?: RuntimeEnv): Promise<never>;
//#endregion
//#region src/config/sessions/disk-budget.types.d.ts
type SessionDiskBudgetSweepResult = {
  totalBytesBefore: number;
  totalBytesAfter: number;
  removedFiles: number;
  removedEntries: number;
  freedBytes: number;
  maxBytes: number;
  highWaterBytes: number;
  overBudget: boolean;
  deferredReason?: "checkpoint-incomplete";
  checkpoint?: SqliteWalHealth;
  walBytesBefore?: number;
  walBytesAfter?: number;
};
//#endregion
//#region src/config/sessions/store-maintenance-operations.d.ts
type SessionMaintenanceApplyReport = {
  mode: ResolvedSessionMaintenanceConfig["mode"];
  beforeCount: number;
  afterCount: number;
  archived: number;
  capArchived: number;
  modelRunPruned: number;
  pruned: number;
  capped: number;
  diskBudget: SessionDiskBudgetSweepResult | null;
};
//#endregion
//#region src/infra/state-migrations.legacy-session-store.d.ts
type LegacySessionStoreLoadOptions = {
  skipCache?: boolean;
  maintenanceConfig?: ResolvedSessionMaintenanceConfig;
  runMaintenance?: boolean;
  clone?: boolean;
  hydrateSkillPromptRefs?: boolean;
};
type LegacySessionStoreSaveOptions = {
  skipMaintenance?: boolean;
  takeCacheOwnership?: boolean;
  activeSessionKey?: string;
  onWarn?: (warning: SessionMaintenanceWarning) => void | Promise<void>;
  onMaintenanceApplied?: (report: SessionMaintenanceApplyReport) => void | Promise<void>;
  maintenanceOverride?: Partial<ResolvedSessionMaintenanceConfig>;
  maintenanceConfig?: ResolvedSessionMaintenanceConfig;
  singleEntryPersistence?: {
    sessionKey: string;
    entry: SessionEntry;
  };
  requireWriteSuccess?: boolean;
};
declare function loadLegacySessionStore(storePath: string, options?: LegacySessionStoreLoadOptions): Record<string, SessionEntry>;
declare function saveLegacySessionStore(storePath: string, store: Record<string, SessionEntry>, options?: LegacySessionStoreSaveOptions): Promise<void>;
//#endregion
//#region src/plugins/runtime/runtime-web-channel-plugin.d.ts
/** Package-root embedding API; runtime instances and cold callers share the public-surface loader. */
declare function monitorWebChannel$2(...args: unknown[]): Promise<unknown>;
//#endregion
//#region src/utils.d.ts
/** Normalizes phone-like input into the loose E.164 shape used by channel helpers. */
declare function normalizeE164$1(number: string): string;
declare namespace library_d_exports {
  export { PortInUseError$1 as PortInUseError, applyTemplate$1 as applyTemplate, createDefaultDeps$1 as createDefaultDeps, deriveSessionKey$1 as deriveSessionKey, describePortOwner$1 as describePortOwner, ensureBinary$1 as ensureBinary, ensurePortAvailable$1 as ensurePortAvailable, getReplyFromConfig$1 as getReplyFromConfig, handlePortError$1 as handlePortError, loadConfig$1 as loadConfig, loadLegacySessionStore as loadSessionStore, monitorWebChannel$1 as monitorWebChannel, normalizeE164$1 as normalizeE164, promptYesNo$1 as promptYesNo, resolveSessionKey$1 as resolveSessionKey, resolveSessionStorePathCore as resolveStorePath, runCommandWithTimeout$1 as runCommandWithTimeout, runExec$1 as runExec, saveSessionStore$1 as saveSessionStore, waitForever$1 as waitForever };
}
type GetReplyFromConfig = typeof getReplyFromConfig$2;
type PromptYesNo = typeof promptYesNo$2;
type EnsureBinary = typeof ensureBinary$2;
type RunExec = typeof runExec$2;
type RunCommandWithTimeout = typeof runCommandWithTimeout$2;
type MonitorWebChannel = typeof monitorWebChannel$2;
declare const getReplyFromConfig$1: GetReplyFromConfig;
declare const promptYesNo$1: PromptYesNo;
declare const ensureBinary$1: EnsureBinary;
declare const runExec$1: RunExec;
declare const runCommandWithTimeout$1: RunCommandWithTimeout;
declare const monitorWebChannel$1: MonitorWebChannel;
/**
 * @deprecated Legacy sessions.json compatibility for package-root consumers.
 * Use SQLite-backed session APIs. Remove after 2026-10-12, once the v2026.7.x
 * upgrade window no longer requires the legacy doctor importer.
 */
declare function saveSessionStore$1(storePath: string, store: Parameters<typeof saveLegacySessionStore>[1], options?: LegacySessionStoreSaveOptions): Promise<void>;
//#endregion
//#region src/index.d.ts
type LegacyCliDeps = {
  runCli: (argv: string[], options?: {
    retainConsoleRoutingUntilProcessExit?: boolean;
  }) => Promise<void>;
};
type LibraryExports = typeof library_d_exports;
export declare let applyTemplate: LibraryExports["applyTemplate"];
export declare let createDefaultDeps: LibraryExports["createDefaultDeps"];
export declare let deriveSessionKey: LibraryExports["deriveSessionKey"];
export declare let describePortOwner: LibraryExports["describePortOwner"];
export declare let ensureBinary: LibraryExports["ensureBinary"];
export declare let ensurePortAvailable: LibraryExports["ensurePortAvailable"];
export declare let getReplyFromConfig: LibraryExports["getReplyFromConfig"];
export declare let handlePortError: LibraryExports["handlePortError"];
export declare let loadConfig: LibraryExports["loadConfig"];
/** @deprecated Use SQLite-backed session APIs. Scheduled for removal after 2026-10-12. */
export declare let loadSessionStore: LibraryExports["loadSessionStore"];
export declare let monitorWebChannel: LibraryExports["monitorWebChannel"];
export declare let normalizeE164: LibraryExports["normalizeE164"];
export declare let PortInUseError: LibraryExports["PortInUseError"];
export declare let promptYesNo: LibraryExports["promptYesNo"];
export declare let resolveSessionKey: LibraryExports["resolveSessionKey"];
export declare let resolveStorePath: LibraryExports["resolveStorePath"];
export declare let runCommandWithTimeout: LibraryExports["runCommandWithTimeout"];
export declare let runExec: LibraryExports["runExec"];
/** @deprecated Use SQLite-backed session APIs. Scheduled for removal after 2026-10-12. */
export declare let saveSessionStore: LibraryExports["saveSessionStore"];
export declare let waitForever: LibraryExports["waitForever"];
export declare function runLegacyCliEntry(argv?: string[], deps?: LegacyCliDeps, options?: {
  retainConsoleRoutingUntilProcessExit?: boolean;
}): Promise<void>;
//#endregion