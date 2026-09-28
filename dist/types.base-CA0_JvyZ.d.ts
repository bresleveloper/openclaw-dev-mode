import { a as ChannelStreamingProgressSchema, i as ChannelStreamingPreviewSchema, n as ChannelPreviewStreamingConfigSchema, s as UnifiedStreamingModeSchema } from "./zod-schema.channel-messaging-common-DVuikTk7.js";
import { a as ContextVisibilityModeSchema, b as TypingModeSchema, c as GroupPolicySchema, d as MarkdownConfigSchema, i as ChannelStreamingBlockSchema, l as HumanDelaySchema, m as ReplyToModeSchema, n as BlockStreamingCoalesceSchema, o as DmPolicySchema, r as ChannelDeliveryStreamingConfigSchema, t as BlockStreamingChunkSchema, v as TextChunkModeSchema } from "./zod-schema.core-CFOD6InI.js";
import { z } from "zod";
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
/** Session-key ownership model for inbound messages. */
type SessionScope = "per-sender" | "global";
/** DM session-key granularity across peers, channels, and accounts. */
type DmScope = "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer";
type GroupScope = "main" | "per-group";
/** Which source messages outbound replies should thread or quote against. */
type ReplyToMode = z.input<typeof ReplyToModeSchema>;
/** Group-chat admission policy for channels with allowlists. */
type GroupPolicy = z.input<typeof GroupPolicySchema>;
/** Direct-message admission policy for channels with pairing/allowlists. */
type DmPolicy = z.input<typeof DmPolicySchema>;
/** How much non-allowlisted context is visible to an agent. */
type ContextVisibilityMode = z.input<typeof ContextVisibilityModeSchema>;
/** Text splitting strategy for outbound channel delivery. */
type TextChunkMode = z.input<typeof TextChunkModeSchema>;
/** Preview/progress delivery mode while an agent response is still streaming. */
type StreamingMode = z.input<typeof UnifiedStreamingModeSchema>;
/** How command text is represented in streaming progress previews. */
type ChannelStreamingCommandTextMode = NonNullable<z.input<typeof ChannelStreamingProgressSchema>["commandText"]>;
type BlockStreamingCoalesceConfig = z.input<typeof BlockStreamingCoalesceSchema>;
type BlockStreamingChunkConfig = z.input<typeof BlockStreamingChunkSchema>;
type ChannelStreamingProgressConfig = z.input<typeof ChannelStreamingProgressSchema>;
type ChannelStreamingPreviewConfig = z.input<typeof ChannelStreamingPreviewSchema>;
type ChannelStreamingBlockConfig = z.input<typeof ChannelStreamingBlockSchema>;
type SchemaChannelStreamingConfig = z.input<typeof ChannelPreviewStreamingConfigSchema>;
type ChannelStreamingConfig<TProgress extends ChannelStreamingProgressConfig = ChannelStreamingProgressConfig> = Omit<SchemaChannelStreamingConfig, "progress"> & {
  /** Prefer a channel's native streaming transport over its portable draft path. */
  nativeTransport?: boolean;
  progress?: TProgress;
};
type ChannelDeliveryStreamingConfig = z.input<typeof ChannelDeliveryStreamingConfigSchema>;
/** Streaming subset used by channels that render visible preview/progress replies. */
type ChannelPreviewStreamingConfig = Pick<ChannelStreamingConfig, "mode" | "chunkMode" | "preview" | "progress" | "block">;
type MarkdownConfig = NonNullable<z.input<typeof MarkdownConfigSchema>>;
type MarkdownTableMode = NonNullable<MarkdownConfig["tables"]>;
type HumanDelayConfig = z.input<typeof HumanDelaySchema>;
type SessionSchemaInput = NonNullable<z.input<typeof SessionSchema>>;
type SessionResetConfig = NonNullable<SessionSchemaInput["reset"]>;
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
export { TextChunkMode as A, ReplyToMode as C, SessionScope as D, SessionResetConfig as E, SessionThreadBindingsConfig as O, MarkdownTableMode as S, SessionMaintenanceMode as T, GroupScope as _, ChannelDeliveryStreamingConfig as a, LoggingConfig as b, ChannelStreamingCommandTextMode as c, ChannelStreamingProgressConfig as d, ContextVisibilityMode as f, GroupPolicy as g, DmScope as h, BlockStreamingCoalesceConfig as i, TypingMode as j, StreamingMode as k, ChannelStreamingConfig as l, DmPolicy as m, AuditConfig as n, ChannelPreviewStreamingConfig as o, DiagnosticsConfig as p, BlockStreamingChunkConfig as r, ChannelStreamingBlockConfig as s, AgentElevatedAllowFromConfig as t, ChannelStreamingPreviewConfig as u, HumanDelayConfig as v, SessionConfig as w, MarkdownConfig as x, IdentityConfig as y };