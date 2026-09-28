import { ZodRawShape, ZodTypeAny, z } from "zod";
//#region src/config/zod-schema.channel-bot-loop.d.ts
declare const ChannelBotLoopProtectionSchema: z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  maxEventsPerWindow: z.ZodOptional<z.ZodNumber>;
  windowSeconds: z.ZodOptional<z.ZodNumber>;
  cooldownSeconds: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
//#endregion
//#region src/config/zod-schema.channel-messaging-common.d.ts
declare const UnifiedStreamingModeSchema: z.ZodEnum<{
  block: "block";
  off: "off";
  partial: "partial";
  progress: "progress";
}>;
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
declare const CommonCapabilitiesSchema: z.ZodOptional<z.ZodArray<z.ZodString>>;
declare const CommonIdListSchema: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
declare const CommonDefaultToSchema: z.ZodOptional<z.ZodString>;
declare const CommonMentionPatternsSchema: z.ZodOptional<z.ZodObject<{
  mode: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"allow">, z.ZodLiteral<"deny">]>>;
  allowIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
  denyIn: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>>;
declare const CommonStreamingSchema: z.ZodOptional<z.ZodObject<{
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
declare const CommonMediaMaxMbSchema: z.ZodOptional<z.ZodNumber>;
declare const CommonReplyToModeSchema: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"off">, z.ZodLiteral<"first">, z.ZodLiteral<"all">, z.ZodLiteral<"batched">]>>;
type CommonChannelAccountShapeOptions<TCapabilities extends ZodTypeAny = typeof CommonCapabilitiesSchema, TAllowFrom extends z.ZodType<Array<string | number> | undefined> = typeof CommonIdListSchema, TDefaultTo extends z.ZodType<string | number | undefined> = typeof CommonDefaultToSchema, TGroupAllowFrom extends z.ZodType<Array<string | number> | undefined> = typeof CommonIdListSchema, TMentionPatterns extends ZodTypeAny = typeof CommonMentionPatternsSchema, TStreaming extends ZodTypeAny = typeof CommonStreamingSchema, TMediaMaxMb extends ZodTypeAny = typeof CommonMediaMaxMbSchema, TReplyToMode extends ZodTypeAny = typeof CommonReplyToModeSchema> = {
  omit?: readonly CommonChannelAccountField[];
  capabilities?: TCapabilities;
  allowFrom?: TAllowFrom;
  defaultTo?: TDefaultTo;
  groupAllowFrom?: TGroupAllowFrom;
  mentionPatterns?: TMentionPatterns;
  streaming?: TStreaming;
  mediaMaxMb?: TMediaMaxMb;
  replyToMode?: TReplyToMode;
};
declare function createCommonChannelAccountShape<TCapabilities extends ZodTypeAny = typeof CommonCapabilitiesSchema, TAllowFrom extends z.ZodType<Array<string | number> | undefined> = typeof CommonIdListSchema, TDefaultTo extends z.ZodType<string | number | undefined> = typeof CommonDefaultToSchema, TGroupAllowFrom extends z.ZodType<Array<string | number> | undefined> = typeof CommonIdListSchema, TMentionPatterns extends ZodTypeAny = typeof CommonMentionPatternsSchema, TStreaming extends ZodTypeAny = typeof CommonStreamingSchema, TMediaMaxMb extends ZodTypeAny = typeof CommonMediaMaxMbSchema, TReplyToMode extends ZodTypeAny = typeof CommonReplyToModeSchema>(options: CommonChannelAccountShapeOptions<TCapabilities, TAllowFrom, TDefaultTo, TGroupAllowFrom, TMentionPatterns, TStreaming, TMediaMaxMb, TReplyToMode>): {
  name: z.ZodOptional<z.ZodString>;
  capabilities: TCapabilities;
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
  allowFrom: TAllowFrom;
  defaultTo: TDefaultTo;
  groupAllowFrom: TGroupAllowFrom;
  groupPolicy: z.ZodOptional<z.ZodEnum<{
    allowlist: "allowlist";
    disabled: "disabled";
    open: "open";
  }>>;
  mentionPatterns: TMentionPatterns;
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
  streaming: TStreaming;
  heartbeatVisibility: z.ZodOptional<z.ZodObject<{
    showOk: z.ZodOptional<z.ZodBoolean>;
    showAlerts: z.ZodOptional<z.ZodBoolean>;
    useIndicator: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  healthMonitor: z.ZodOptional<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strict>>;
  responsePrefix: z.ZodOptional<z.ZodString>;
  mediaMaxMb: TMediaMaxMb;
  replyToMode: TReplyToMode;
};
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
type CommonChannelAccountShape = ReturnType<typeof createCommonChannelAccountShape>;
type CommonChannelAccountField = keyof CommonChannelAccountShape;
/** Build optional account leaves and separate root-only policy defaults. */
declare function buildChannelAccountSchemaParts<TCapabilities extends ZodTypeAny = typeof CommonCapabilitiesSchema, TAllowFrom extends z.ZodType<Array<string | number> | undefined> = typeof CommonIdListSchema, TDefaultTo extends z.ZodType<string | number | undefined> = typeof CommonDefaultToSchema, TGroupAllowFrom extends z.ZodType<Array<string | number> | undefined> = typeof CommonIdListSchema, TMentionPatterns extends ZodTypeAny = typeof CommonMentionPatternsSchema, TStreaming extends ZodTypeAny = typeof CommonStreamingSchema, TMediaMaxMb extends ZodTypeAny = typeof CommonMediaMaxMbSchema, TReplyToMode extends ZodTypeAny = typeof CommonReplyToModeSchema, const TOmit extends readonly CommonChannelAccountField[] = []>(options?: Omit<CommonChannelAccountShapeOptions<TCapabilities, TAllowFrom, TDefaultTo, TGroupAllowFrom, TMentionPatterns, TStreaming, TMediaMaxMb, TReplyToMode>, "omit"> & {
  omit?: TOmit;
}): {
  accountShape: Omit<{
    name: z.ZodOptional<z.ZodString>;
    capabilities: TCapabilities;
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
    allowFrom: TAllowFrom;
    defaultTo: TDefaultTo;
    groupAllowFrom: TGroupAllowFrom;
    groupPolicy: z.ZodOptional<z.ZodEnum<{
      allowlist: "allowlist";
      disabled: "disabled";
      open: "open";
    }>>;
    mentionPatterns: TMentionPatterns;
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
    streaming: TStreaming;
    heartbeatVisibility: z.ZodOptional<z.ZodObject<{
      showOk: z.ZodOptional<z.ZodBoolean>;
      showAlerts: z.ZodOptional<z.ZodBoolean>;
      useIndicator: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    healthMonitor: z.ZodOptional<z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    responsePrefix: z.ZodOptional<z.ZodString>;
    mediaMaxMb: TMediaMaxMb;
    replyToMode: TReplyToMode;
  }, TOmit[number]>;
  rootPolicyShape: {
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
  };
};
declare const ChannelDangerouslyAllowNameMatchingSchema: z.ZodOptional<z.ZodBoolean>;
declare const ChannelSendReadReceiptsSchema: z.ZodOptional<z.ZodBoolean>;
/** Build the shared allowBots leaf without widening boolean-only channels. */
type ChannelAllowBotsSchema<TAllowMentions extends boolean | undefined> = TAllowMentions extends true ? z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"mentions">]>> : z.ZodOptional<z.ZodBoolean>;
declare function buildChannelAllowBotsSchema<const TAllowMentions extends boolean | undefined = undefined>(options?: {
  allowMentions?: TAllowMentions;
}): ChannelAllowBotsSchema<TAllowMentions>;
/** Build native exec-approval routing with channel-specific approver ids and extras. */
declare function buildChannelExecApprovalsSchema<T extends ZodRawShape = Record<never, never>>(approverSchema: ZodTypeAny, extraShape?: T): z.ZodOptional<z.ZodObject<{
  enabled: z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodLiteral<"auto">]>>;
  approvers: z.ZodOptional<z.ZodArray<z.ZodTypeAny>>;
  agentFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
  sessionFilter: z.ZodOptional<z.ZodArray<z.ZodString>>;
  target: z.ZodOptional<z.ZodEnum<{
    both: "both";
    channel: "channel";
    dm: "dm";
  }>>;
} & T extends (infer T_1) ? { -readonly [P in keyof T_1]: T_1[P]; } : never, z.core.$strict>>;
type StringEnumValues = readonly [string, string, ...string[]];
type ChannelReactionShapeOptions = {
  notificationModes?: StringEnumValues;
  reactionLevels?: StringEnumValues;
  reactionAllowlist?: boolean;
  ackReaction?: ZodTypeAny;
};
type EnumSchema<TValues extends StringEnumValues> = z.ZodEnum<{ [TValue in TValues[number]]: TValue; }>;
type EnumShape<TValues, TKey extends string> = TValues extends StringEnumValues ? { [TResultKey in TKey]: z.ZodOptional<EnumSchema<TValues>>; } : Record<never, never>;
type ChannelReactionShape<TOptions extends ChannelReactionShapeOptions> = ZodRawShape & EnumShape<TOptions["notificationModes"], "reactionNotifications"> & EnumShape<TOptions["reactionLevels"], "reactionLevel"> & (TOptions["reactionAllowlist"] extends true ? {
  reactionAllowlist: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>>>;
} : Record<never, never>) & (TOptions["ackReaction"] extends ZodTypeAny ? {
  ackReaction: TOptions["ackReaction"];
} : Record<never, never>);
/** Build the repeated reaction leaves while retaining each channel's exact enum. */
declare function buildChannelReactionShape<const TOptions extends ChannelReactionShapeOptions>(options: TOptions): ChannelReactionShape<TOptions>;
//#endregion
export { ChannelStreamingProgressSchema as a, buildChannelAccountSchemaParts as c, buildChannelReactionShape as d, ChannelBotLoopProtectionSchema as f, ChannelStreamingPreviewSchema as i, buildChannelAllowBotsSchema as l, ChannelPreviewStreamingConfigSchema as n, CommonChannelAccountSchema as o, ChannelSendReadReceiptsSchema as r, UnifiedStreamingModeSchema as s, ChannelDangerouslyAllowNameMatchingSchema as t, buildChannelExecApprovalsSchema as u };