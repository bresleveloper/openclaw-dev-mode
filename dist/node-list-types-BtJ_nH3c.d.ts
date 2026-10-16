import { Bt as SessionMaintenanceMode, C as TextContent, D as ToolResultMessage, Dt as GroupToolPolicyConfig, E as Tool, N as GatewayOperatorRoleDefinition, Nt as DmScope, S as StreamFn$1, St as TtsAutoMode, T as ThinkingLevelMap, _ as Message, b as SimpleStreamOptions, d as AssistantMessage, f as AssistantMessageEvent, g as ImageContent, ht as BroadcastStrategy, mt as CommonChannelGroupConfig, n as OpenClawConfig, pt as SecretRef, s as ModelProviderConfig, v as Model, yt as SchemaContract, zt as ReplyToMode } from "./types.openclaw-C-OasKBU.js";
import { z } from "zod";
import { Static, TSchema, Type } from "typebox";
import { DatabaseSync } from "node:sqlite";
import "@openclaw/fs-safe/advanced";
import { ColumnType, Selectable } from "kysely";
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
//#region src/config/zod-schema.sandbox.d.ts
declare const SandboxDockerSchema: z.ZodOptional<z.ZodObject<{
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
//#endregion
//#region src/config/types.sandbox.d.ts
type SandboxDockerSettings = NonNullable<z.output<typeof SandboxDockerSchema>>;
//#endregion
//#region src/channels/ids.d.ts
type ChatChannelId = string;
//#endregion
//#region src/channels/plugins/channel-id.types.d.ts
/**
 * Channel id accepted by plugin helpers, covering built-in chat ids and external plugin ids.
 */
type ChannelId = ChatChannelId | (string & {});
//#endregion
//#region src/config/channel-groups.d.ts
type ChannelGroupConfig = Pick<CommonChannelGroupConfig, "requireMention" | "tools" | "toolsBySender"> & {
  requireMentionInBotThreads?: boolean;
  ingest?: boolean;
};
//#endregion
//#region src/config/group-policy.d.ts
type ChannelGroupPolicy = {
  allowlistEnabled: boolean;
  allowed: boolean;
  groupConfig?: ChannelGroupConfig;
  defaultConfig?: ChannelGroupConfig;
};
declare function resolveChannelGroupPolicy(params: {
  cfg: OpenClawConfig;
  channel: ChannelId;
  groupId?: string | null;
  accountId?: string | null;
  groupIdCaseInsensitive?: boolean;
  /** When true, sender-level filtering (groupAllowFrom) is configured upstream. */
  hasGroupAllowFrom?: boolean;
}): ChannelGroupPolicy;
declare function resolveChannelGroupRequireMention(params: {
  cfg: OpenClawConfig;
  channel: ChannelId;
  groupId?: string | null;
  accountId?: string | null;
  groupIdCaseInsensitive?: boolean;
  requireMentionOverride?: boolean;
  configuredGroupDefaultsToNoMention?: boolean;
  overrideOrder?: "before-config" | "after-config";
}): boolean;
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
type SessionActivitySummary$1 = z.infer<typeof ActivitySummarySchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/skill-library.d.ts
declare const SkillLibraryFileSchema: Type.TObject<{
  path: Type.TString;
  content: Type.TString;
  encoding: Type.TOptional<Type.TUnion<[Type.TLiteral<"utf8">, Type.TLiteral<"base64">]>>;
  executable: Type.TOptional<Type.TBoolean>;
}>;
declare const SkillLibrarySelectionSchema: Type.TObject<{
  skillId: Type.TString;
  revision: Type.TString;
  /** Persisted command identity: library collisions never shadow workspace names. */
  name: Type.TString;
  ownerProfileId: Type.TUnion<[Type.TString, Type.TNull]>;
}>;
type SkillLibraryFile = Static<typeof SkillLibraryFileSchema>;
type SkillLibrarySelection = Static<typeof SkillLibrarySelectionSchema>;
type SkillLibraryEntry = {
  skillId: string;
  slug: string;
  name: string;
  description: string;
  ownerProfileId: string | null;
  ownerLabel: string;
  authorProfileId: string;
  shared: boolean;
  enabled: boolean;
  removed: boolean;
  revision: string;
  createdAt: number;
  updatedAt: number;
  canEdit: boolean;
};
type SkillsLibraryListResult = {
  entries: SkillLibraryEntry[];
  profileId: string | null;
  multipleProfiles: boolean;
  defaultTarget: "workspace" | "personal" | "unavailable";
  canManageWorkspace: boolean;
  defaultSelectionLimit: number;
  defaultSelectionNotice?: string;
  session?: {
    sessionKey: string;
    selections: Array<SkillLibrarySelection & {
      slug: string;
      description: string;
      ownerLabel: string;
    }>;
    attachable: SkillLibraryEntry[];
  };
};
type SkillsLibraryReadResult = {
  entry: SkillLibraryEntry;
  content: string;
  files: SkillLibraryFile[];
  revisions: Array<{
    revision: string;
    createdAt: number;
  }>;
};
type SkillsLibraryReceipt = {
  state: "published" | "unchanged" | "removed";
  target: "personal" | "team";
  entry: SkillLibraryEntry;
  sessionActivation: "new-sessions";
  nextAction: string;
};
type SkillsLibraryActivateResult = {
  sessionKey: string;
  selections: SkillLibrarySelection[];
  sessionActivation: "next-turn";
};
//#endregion
//#region packages/gateway-protocol/src/schema/session-participant.d.ts
/** Product identity, independent of display metadata and authorization. */
declare const SessionParticipantIdentitySchema: Type.TUnion<[Type.TObject<{
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
type SessionParticipantIdentity = Static<typeof SessionParticipantIdentitySchema>;
type SessionParticipant = Static<typeof SessionParticipantSchema>;
declare const SessionPersonSchema: Type.TObject<{
  identity: Type.TObject<{
    type: Type.TLiteral<"profile">;
    id: Type.TString;
  }>;
  label: Type.TOptional<Type.TString>;
  avatarUrl: Type.TOptional<Type.TString>;
  sessionCount: Type.TInteger;
}>;
type SessionPerson = Static<typeof SessionPersonSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-row.d.ts
declare const SessionPermissionModeSchema: Type.TUnion<[Type.TLiteral<"read-only">, Type.TLiteral<"guarded">, Type.TLiteral<"workspace">, Type.TLiteral<"full">]>;
/** Channel-owned destination for returning to the conversation that launched a session. */
declare const SessionConversationLinkSchema: Type.TObject<{
  url: Type.TString;
  label: Type.TString;
}>;
declare const SessionRunStatusSchema: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"failed">, Type.TLiteral<"interrupted">, Type.TLiteral<"killed">, Type.TLiteral<"timeout">]>;
declare const SessionEntryArchiveReasonSchema: Type.TUnion<[Type.TLiteral<"manual">, Type.TLiteral<"active-session-cap">, Type.TLiteral<"age-retention">, Type.TLiteral<"stale-dashboard">, Type.TLiteral<"restart-recovery">]>;
/** Projected actor that caused a session node to be created. */
declare const SessionCreatedActorSchema: Type.TObject<{
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
/** Mutable responsibility for one session; actor display data is projected at read time. */
declare const SessionOwnerSchema: Type.TObject<{
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
}>;
/** Stable Gateway session row fields; mutation envelopes may add null tombstones. */
declare const SessionRowSchema: Type.TObject<{
  key: Type.TString;
  /** Detail fields omitted in compact lists must not clear a client's full-row cache. */
  rowMode: Type.TOptional<Type.TLiteral<"compact">>;
  sessionId: Type.TOptional<Type.TString>;
  incognito: Type.TOptional<Type.TLiteral<true>>;
  kind: Type.TUnion<[Type.TLiteral<"direct">, Type.TLiteral<"group">, Type.TLiteral<"global">, Type.TLiteral<"unknown">]>;
  label: Type.TOptional<Type.TString>;
  autoLabel: Type.TOptional<Type.TString>;
  icon: Type.TOptional<Type.TString>;
  /** Named sidebar tint from SESSION_COLOR_IDS; clients map names to theme hues. */
  color: Type.TOptional<Type.TString>;
  channelAvatarUrl: Type.TOptional<Type.TString>;
  conversationLink: Type.TOptional<Type.TObject<{
    url: Type.TString;
    label: Type.TString;
  }>>;
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
  /** Connection-scoped presentation identity on full event ancestor rows. */
  ancestorRevision: Type.TOptional<Type.TString>;
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
  snoozedUntil: Type.TOptional<Type.TNumber>;
  snoozedAt: Type.TOptional<Type.TNumber>;
  unread: Type.TOptional<Type.TBoolean>;
  lastReadAt: Type.TOptional<Type.TNumber>;
  markedUnreadAt: Type.TOptional<Type.TNumber>;
  lastActivityAt: Type.TOptional<Type.TNumber>;
  lastInteractionAt: Type.TOptional<Type.TNumber>;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"failed">, Type.TLiteral<"interrupted">, Type.TLiteral<"killed">, Type.TLiteral<"timeout">]>>;
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
  /** Recipient-local send admission; null explicitly clears a previous restriction. */
  sendDisabledReason: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
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
type SessionCreatedActor$1 = Static<typeof SessionCreatedActorSchema>;
type SessionConversationLink = Static<typeof SessionConversationLinkSchema>;
type SessionPermissionMode = Static<typeof SessionPermissionModeSchema>;
type SessionOwner = Static<typeof SessionOwnerSchema>;
type SessionRunStatus = Static<typeof SessionRunStatusSchema>;
type SessionRow = Static<typeof SessionRowSchema>;
type SessionEntryArchiveReason = Static<typeof SessionEntryArchiveReasonSchema>;
//#endregion
//#region src/security/external-content-source.d.ts
/** Hook session sources that carry untrusted external content into agent prompts. */
type HookExternalContentSource = "email" | "gmail" | "webhook";
//#endregion
//#region src/config/sessions/session-entry-provenance.d.ts
/** Persisted identity excludes display-only actor projections. */
type SessionActor = SchemaContract<Pick<SessionCreatedActor$1, "type" | "id" | "label">>;
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
type SessionCreatedVia = NonNullable<SessionRow["createdVia"]>;
type SessionEntryProvenance = {
  /** First channel-supplied launch destination, inherited by explicitly created children. */
  conversationLink?: SessionConversationLink;
  /** Human contributor candidates captured once by trusted delegation; not participant activity. */
  inheritedGitContributorProfileIds?: string[];
  /** Plugin id that owns this session through a trusted runtime creation seam. */
  pluginOwnerId?: string;
  /** External hook source that has contributed content to this transcript. */
  hookExternalContentSource?: HookExternalContentSource;
};
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-activity-summary.d.ts
declare const SessionActivitySummarySchema: Type.TObject<{
  /** Caller-specific participation permission; operator.write is required separately. */
  canEnsure: Type.TOptional<Type.TBoolean>;
  text: Type.TOptional<Type.TString>;
  updatedAt: Type.TOptional<Type.TInteger>;
  state: Type.TUnion<[Type.TLiteral<"current">, Type.TLiteral<"stale">, Type.TLiteral<"updating">, Type.TLiteral<"unavailable">]>;
}>;
type SessionActivitySummary = Static<typeof SessionActivitySummarySchema>;
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
//#region packages/gateway-protocol/src/schema/sessions-list.d.ts
declare const SessionsListParamsSchema: Type.TObject<{
  /** Omit detail-only capability metadata; sessions.describe retains the full row. */
  rowMode: Type.TOptional<Type.TLiteral<"compact">>;
  /** Maximum rows to return; omitted Gateway RPC calls use a bounded default. */
  limit: Type.TOptional<Type.TInteger>;
  offset: Type.TOptional<Type.TInteger>;
  /** Activity age for sortBy: "activity"; otherwise metadata update age. */
  activeMinutes: Type.TOptional<Type.TInteger>;
  /** Strictly ascending epoch-ms bucket boundaries in the caller's local time zone. */
  activityPulseBoundaries: Type.TOptional<Type.TArray<Type.TNumber>>;
  /** Select sessions with current direct running or queued work before pagination. */
  activeOnly: Type.TOptional<Type.TBoolean>;
  /** Require a real user/channel interaction; excludes synthetic isolated heartbeat rows. */
  requireLastInteraction: Type.TOptional<Type.TBoolean>;
  sortBy: Type.TOptional<Type.TUnion<[Type.TLiteral<"updatedAt">, Type.TLiteral<"lastInteractionAt">, Type.TLiteral<"activity">]>>;
  includeGlobal: Type.TOptional<Type.TBoolean>;
  includeUnknown: Type.TOptional<Type.TBoolean>;
  /** Exclude subagent sessions before facets and pagination. */
  excludeSubagents: Type.TOptional<Type.TBoolean>;
  /** Exclude automation roots as well as individual cron runs. */
  excludeCron: Type.TOptional<Type.TBoolean>;
  /** Exclude machine-created probe/system sessions using recorded provenance. */
  excludeSystem: Type.TOptional<Type.TBoolean>;
  /** Limit agent-scoped rows to agents currently present in config. */
  configuredAgentsOnly: Type.TOptional<Type.TBoolean>;
  /**
   * Read a bounded transcript head projection to derive a title from the first user message.
   * Use `limit` to bound projection work on large stores.
   */
  includeDerivedTitles: Type.TOptional<Type.TBoolean>;
  /**
   * Read a bounded transcript tail projection for the latest visible user or assistant text.
   * The returned short preview excludes tool, system, reasoning, and silent rows.
   */
  includeLastMessage: Type.TOptional<Type.TBoolean>;
  /** Include the durable Activity recap and its canonical transcript freshness. */
  includeActivitySummary: Type.TOptional<Type.TBoolean>;
  label: Type.TOptional<Type.TString>;
  /** Exact project registry association stored on the session, not its repository workspace ID. */
  projectId: Type.TOptional<Type.TString>;
  /** Exact stored task cwd, falling back to the stored spawned workspace; never resolves paths. */
  workspaceDir: Type.TOptional<Type.TString>;
  /** Exact custom sidebar category; an empty string selects ungrouped sessions. */
  group: Type.TOptional<Type.TString>;
  /** Filter by the canonical root-session pin state. */
  pinned: Type.TOptional<Type.TBoolean>;
  /** Limit rows to sessions with an explicitly stored Control UI face preference. */
  boardFace: Type.TOptional<Type.TUnion<[Type.TLiteral<"chat">, Type.TLiteral<"dashboard">]>>;
  /** Limit rows by whether a persisted session dashboard exists. */
  hasBoard: Type.TOptional<Type.TBoolean>;
  /** Filter rows by their immutable creator provenance. */
  creatorId: Type.TOptional<Type.TString>;
  /** Filter rows by their current assignable owner identity. */
  ownerId: Type.TOptional<Type.TString>;
  /** Prepend the authenticated viewer's owned rows to the normal first page. */
  ownerFirst: Type.TOptional<Type.TBoolean>;
  /** Limit rows to sessions owned by or previously prompted by the authenticated viewer. */
  involvingMe: Type.TOptional<Type.TBoolean>;
  /** Qualified human-profile relationship, independent of id-only actor filters. */
  profileRelation: Type.TOptional<Type.TObject<{
    profileId: Type.TString;
    relationship: Type.TUnion<[Type.TLiteral<"owned">, Type.TLiteral<"created">, Type.TLiteral<"involving">]>;
  }>>;
  /** Profile association filter, applied to visible retained identities before pagination. */
  involvingProfileId: Type.TOptional<Type.TString>;
  /** Include a bounded people facet over visible matching sessions before the profile filter. */
  includePeople: Type.TOptional<Type.TBoolean>;
  /**
   * Include complete per-profile ownership counts over caller-visible matching sessions before
   * pagination. Open counts only unarchived sessions; running excludes queued and descendant work.
   * All list filters still apply; omit agentId for a cross-agent summary.
   */
  includeOwnerSessionCounts: Type.TOptional<Type.TBoolean>;
  spawnedBy: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  search: Type.TOptional<Type.TString>;
  /**
   * True lists archived sessions; "all" lists archived and active;
   * false or omitted lists active sessions.
   */
  archived: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"all">]>>;
}>;
type SessionsListParams = Static<typeof SessionsListParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/sessions.d.ts
/** Trajectory judgment produced for one observed agent session. */
declare const SessionObserverHealthSchema: Type.TUnion<[Type.TLiteral<"on-track">, Type.TLiteral<"grinding">, Type.TLiteral<"stuck">, Type.TLiteral<"waiting-on-user">, Type.TLiteral<"wrapping-up">, Type.TLiteral<"done">, Type.TLiteral<"failed">]>;
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
/** One bounded question/answer exchange in the ephemeral session companion. */
declare const SessionCompanionExchangeSchema: Type.TObject<{
  question: Type.TString;
  answer: Type.TString;
  ts: Type.TInteger;
}>;
/** Current bounded exchanges for one session companion thread. */
declare const SessionsCompanionStateResultSchema: Type.TObject<{
  exchanges: Type.TArray<Type.TObject<{
    question: Type.TString;
    answer: Type.TString;
    ts: Type.TInteger;
  }>>;
}>;
/** Reassigns mutable session responsibility without changing provenance or sharing authority. */
declare const SessionsAssignOwnerParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  owner: Type.TObject<{
    type: Type.TUnion<[Type.TLiteral<"agent">, Type.TLiteral<"human">]>;
    id: Type.TString;
  }>;
}>;
type SessionObserverHealth = Static<typeof SessionObserverHealthSchema>;
type SessionObserverDigest = Static<typeof SessionObserverDigestSchema>;
type SessionCompanionExchange = Static<typeof SessionCompanionExchangeSchema>;
type SessionsCompanionStateResult = Static<typeof SessionsCompanionStateResultSchema>;
type SessionsAssignOwnerParams = Static<typeof SessionsAssignOwnerParamsSchema>;
//#endregion
//#region src/config/sessions/goals-operations.types.d.ts
type SessionGoalOperationResult = Omit<SessionsGoalMutationResult, "replayed">;
declare const SESSION_GOAL_OPERATION_ERROR_CODES: readonly ["expired", "operation-conflict", "session-rebound", "goal-rebound", "capacity", "receipt-invalid", "invalid"];
type SessionGoalOperationErrorCode = (typeof SESSION_GOAL_OPERATION_ERROR_CODES)[number];
type SessionTranscriptTurnMutationResult = {
  result: SessionGoalOperationResult;
  replayed: boolean;
};
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
//#region src/infra/sqlite-worker-identity.d.ts
type DatabaseFileIdentity = Readonly<{
  key: string;
  birthtime?: string;
}>;
type DatabasePathIdentity = DatabaseFileIdentity & Readonly<{
  canonicalPath: string;
}>;
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
//#region packages/normalization-core/src/result.d.ts
/** Result of a fallible operation. Expected failures use the `ok: false` arm. */
type Result<TValue, TError> = {
  ok: true;
  value: TValue;
} | {
  ok: false;
  error: TError;
};
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
//#region src/agents/auth-profiles/credential-schema.d.ts
/** Provider-owned fields retained with OAuth material through storage and refresh. */
declare const oauthCredentialMetadataSchema: z.ZodObject<{
  idToken: z.ZodOptional<z.ZodString>;
  clientId: z.ZodOptional<z.ZodString>;
  authorizationScope: z.ZodOptional<z.ZodString>;
  grantedScope: z.ZodOptional<z.ZodString>;
  enterpriseUrl: z.ZodOptional<z.ZodString>;
  projectId: z.ZodOptional<z.ZodString>;
  accountId: z.ZodOptional<z.ZodString>;
  chatgptPlanType: z.ZodOptional<z.ZodString>;
  subscriptionType: z.ZodOptional<z.ZodString>;
  rateLimitTier: z.ZodOptional<z.ZodString>;
  tokenEndpoint: z.ZodOptional<z.ZodString>;
  deviceAuthorizationEndpoint: z.ZodOptional<z.ZodString>;
  issuer: z.ZodOptional<z.ZodString>;
  authFlow: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
type OAuthCredentialMetadata = z.infer<typeof oauthCredentialMetadataSchema>;
/** Current inline credentials, without legacy aliases or host-owned secret references. */
declare const inlineAuthProfileCredentialSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
  provider: z.ZodString;
  email: z.ZodOptional<z.ZodString>;
  displayName: z.ZodOptional<z.ZodString>;
  copyToAgents: z.ZodOptional<z.ZodBoolean>;
  type: z.ZodLiteral<"api_key">;
  key: z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>, z.ZodString>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strict>, z.ZodObject<{
  provider: z.ZodString;
  email: z.ZodOptional<z.ZodString>;
  displayName: z.ZodOptional<z.ZodString>;
  copyToAgents: z.ZodOptional<z.ZodBoolean>;
  type: z.ZodLiteral<"token">;
  token: z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>, z.ZodString>;
  expires: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodObject<{
  idToken: z.ZodOptional<z.ZodString>;
  clientId: z.ZodOptional<z.ZodString>;
  authorizationScope: z.ZodOptional<z.ZodString>;
  grantedScope: z.ZodOptional<z.ZodString>;
  enterpriseUrl: z.ZodOptional<z.ZodString>;
  projectId: z.ZodOptional<z.ZodString>;
  accountId: z.ZodOptional<z.ZodString>;
  chatgptPlanType: z.ZodOptional<z.ZodString>;
  subscriptionType: z.ZodOptional<z.ZodString>;
  rateLimitTier: z.ZodOptional<z.ZodString>;
  tokenEndpoint: z.ZodOptional<z.ZodString>;
  deviceAuthorizationEndpoint: z.ZodOptional<z.ZodString>;
  issuer: z.ZodOptional<z.ZodString>;
  authFlow: z.ZodOptional<z.ZodString>;
  provider: z.ZodString;
  email: z.ZodOptional<z.ZodString>;
  displayName: z.ZodOptional<z.ZodString>;
  copyToAgents: z.ZodOptional<z.ZodBoolean>;
  type: z.ZodLiteral<"oauth">;
  access: z.ZodString;
  refresh: z.ZodString;
  expires: z.ZodNumber;
}, z.core.$strict>], "type">;
//#endregion
//#region src/agents/auth-profiles/legacy-oauth-ref.d.ts
/** Legacy OAuth ref source persisted by older credential stores. */
declare const LEGACY_OAUTH_REF_SOURCE = "openclaw-credentials";
/** Legacy OAuth ref provider persisted by older credential stores. */
declare const LEGACY_OAUTH_REF_PROVIDER = "openai-codex";
type LegacyOAuthRef = {
  source: typeof LEGACY_OAUTH_REF_SOURCE;
  provider: typeof LEGACY_OAUTH_REF_PROVIDER;
  id: string;
};
//#endregion
//#region src/agents/auth-profiles/types.d.ts
type InlineAuthProfileCredential = z.infer<typeof inlineAuthProfileCredentialSchema>;
/** API-key credential with optional secret reference indirection. */
type ApiKeyCredential = SchemaContract<Omit<Extract<InlineAuthProfileCredential, {
  type: "api_key";
}>, "key">> & {
  key?: string;
  keyRef?: SecretRef;
};
/** Static token credential that OpenClaw does not refresh. */
type TokenCredential = SchemaContract<Omit<Extract<InlineAuthProfileCredential, {
  type: "token";
}>, "token">> & {
  token?: string;
  tokenRef?: SecretRef;
};
/**
 * Refreshable OAuth credential plus provider metadata and legacy references.
 * OAuth refresh tokens are not portable by default. Provider-owned flows may
 * set copyToAgents only when copying refresh material across agents is known safe.
 */
type OAuthCredential = OAuthCredentialMetadata & SchemaContract<Omit<Extract<InlineAuthProfileCredential, {
  type: "oauth";
}>, keyof OAuthCredentialMetadata>> & {
  oauthRef?: LegacyOAuthRef;
};
type SavedSetupCredential = {
  apiKeyHeader?: true;
  agentRuntimeId?: string;
  replacement: boolean;
  modelRef: string;
  /** Setup validates the connection config when retrying, outside auth hot paths. */
  configJson: string;
  authChoice?: string;
  pluginId?: string;
};
/** Credential variants supported by auth profiles. */
type AuthProfileCredential = (ApiKeyCredential | TokenCredential | OAuthCredential) & {
  /** Replacement credentials stay unavailable until their verified connection is activated. */
  setup?: SavedSetupCredential;
};
/** Closed reasons that drive cooldown, disable, and failure counters. */
type AuthProfileFailureReason = "auth" | "auth_permanent" | "format" | "overloaded" | "rate_limit" | "billing" | "timeout" | "model_not_found" | "session_expired" | "empty_response" | "no_error_details" | "unclassified" | "unknown";
/** Optional host diagnostic attached to a canonical cooldown reason. */
type AuthProfileCooldownClassification = "wham_token_expired" | "wham_account_dead";
/** Profile-wide blocked reason reported by provider usage probes. */
type AuthProfileBlockedReason = "subscription_limit";
/** Source that marked a profile as blocked. */
type AuthProfileBlockedSource = "codex_rate_limits" | "wham";
/** Per-profile usage statistics for round-robin and cooldown tracking */
type ProfileUsageStats = {
  lastUsed?: number;
  blockedUntil?: number;
  blockedReason?: AuthProfileBlockedReason;
  blockedSource?: AuthProfileBlockedSource;
  blockedModel?: string;
  blockedScope?: "model";
  cooldownUntil?: number;
  cooldownReason?: AuthProfileFailureReason;
  cooldownClassification?: AuthProfileCooldownClassification;
  cooldownModel?: string;
  disabledUntil?: number;
  disabledReason?: AuthProfileFailureReason;
  errorCount?: number;
  failureCounts?: Partial<Record<AuthProfileFailureReason, number>>;
  lastFailureAt?: number;
  /** Most recent quota probe or successful provider use. */
  lastProbeAt?: number;
};
/** Durable, non-secret auth profile selection state. */
type AuthProfileState = {
  /**
   * Optional per-agent preferred profile order overrides.
   * This lets you lock/override auth rotation for a specific agent without
   * changing the global config.
   */
  order?: Record<string, string[]>;
  lastGood?: Record<string, string>;
  /** Usage statistics per profile for round-robin rotation */
  usageStats?: Record<string, ProfileUsageStats>;
};
/** Persisted credential payload without runtime-only selection state. */
type AuthProfileSecretsStore = {
  version: number;
  profiles: Record<string, AuthProfileCredential>;
};
/** Effective in-memory auth store combining credentials, state, and overlays. */
type AuthProfileStore = AuthProfileSecretsStore & AuthProfileState & {
  /** Runtime-only provenance for credentials cloned from persisted auth stores. */
  runtimePersistedProfileIds?: string[];
  /** Runtime-only provenance for external OAuth profiles overlaid onto this store. */
  runtimeExternalProfileIds?: string[];
  /** True when the runtime external profile set was freshly resolved, even if empty. */
  runtimeExternalProfileIdsAuthoritative?: boolean;
};
/** Physical origin of a canonical credential selected into a session read view. */
type AuthProfileCredentialSource = {
  readonly databasePath: string;
  readonly provider: string;
};
/** Internal effective-store ownership metadata; never exposed through the plugin SDK. */
type RuntimeAuthProfileStore = AuthProfileStore & {
  /** Physical sources of the selected rows; retained only in session read views. */
  runtimeCredentialSources?: Record<string, AuthProfileCredentialSource>;
  /** Runtime-only built-in CLI winners; internal provenance, never exposed or persisted. */
  runtimeExternalCliProfileIds?: string[];
  runtimeLocalProfileIds?: string[];
  /** Provider orders stored by this owner; [] means no local override, even with inherited priority. */
  runtimeLocalOrderProviderIds?: string[];
  runtimeInheritsMainState?: boolean;
};
//#endregion
//#region src/agents/provider-request-config.types.d.ts
/** Auth override accepted from sanitized provider/model request config. */
type ProviderRequestAuthOverride = {
  mode: "provider-default";
} | {
  mode: "authorization-bearer";
  token: string;
} | {
  mode: "header";
  headerName: string;
  value: string;
  prefix?: string;
};
/** TLS override accepted from sanitized provider/model request config. */
type ProviderRequestTlsOverride = {
  ca?: string;
  cert?: string;
  key?: string;
  passphrase?: string;
  serverName?: string;
  insecureSkipVerify?: boolean;
};
/** Proxy override accepted from sanitized provider/model request config. */
type ProviderRequestProxyOverride = {
  mode: "env-proxy";
  tls?: ProviderRequestTlsOverride;
} | {
  mode: "explicit-proxy";
  url: string;
  tls?: ProviderRequestTlsOverride;
};
/** Transport override block shared by provider and model request config. */
type ProviderRequestTransportOverrides = {
  headers?: Record<string, string>;
  auth?: ProviderRequestAuthOverride;
  proxy?: ProviderRequestProxyOverride;
  tls?: ProviderRequestTlsOverride;
};
/** Model-scoped transport overrides, including private-network policy. */
type ModelProviderRequestTransportOverrides = ProviderRequestTransportOverrides & {
  allowPrivateNetwork?: boolean;
};
//#endregion
//#region src/media-understanding/types.d.ts
/** Agent-owned runtime handle carried opaquely through media provider requests. */
type MediaPreparedModelRuntime = Readonly<{
  agentDir: string;
  workspaceDir?: string;
  config: OpenClawConfig;
  createStores: () => unknown;
}>;
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
type MediaUnderstandingProviderRequestAuth = {
  kind: "api-key";
  apiKey: string;
  source?: string;
} | {
  kind: "none";
  source: string;
};
type AudioTranscriptionRequest = MediaUnderstandingProviderRequest & {
  language?: string;
  query?: Record<string, string | number | boolean>;
};
type MediaUnderstandingProviderRequest = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
  /** Compatibility field for existing providers; prefer auth.kind/apiKey. */
  apiKey: string;
  auth?: MediaUnderstandingProviderRequestAuth;
  baseUrl?: string;
  headers?: Record<string, string>;
  request?: ModelProviderRequestTransportOverrides;
  model?: string;
  prompt?: string;
  timeoutMs: number;
  signal?: AbortSignal;
  fetchFn?: typeof fetch;
};
type MediaUnderstandingTextResult = {
  text: string;
  model?: string;
};
type AudioTranscriptionResult = MediaUnderstandingTextResult;
type AudioTranscriptionContext = Omit<AudioTranscriptionRequest, "apiKey" | "auth"> & {
  cfg: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  profile?: string;
  preferredProfile?: string;
};
type VideoDescriptionRequest = MediaUnderstandingProviderRequest;
type VideoDescriptionResult = MediaUnderstandingTextResult;
type ImageDescriptionRequest = ImagesDescriptionInput & Omit<ImagesDescriptionRequest, "images">;
type ImagesDescriptionInput = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
};
type ImagesDescriptionRequest = {
  images: ImagesDescriptionInput[];
  model: string;
  provider: string;
  prompt?: string;
  maxTokens?: number;
  timeoutMs: number;
  signal?: AbortSignal;
  profile?: string;
  preferredProfile?: string;
  authStore?: AuthProfileStore;
  agentId?: string;
  agentDir: string;
  workspaceDir?: string;
  preparedModelRuntime?: MediaPreparedModelRuntime;
  cfg: OpenClawConfig;
};
type ImageDescriptionResult = MediaUnderstandingTextResult;
type ImagesDescriptionResult = ImageDescriptionResult;
type StructuredExtractionTextInput = {
  type: "text";
  text: string;
};
type StructuredExtractionImageInput = ImagesDescriptionInput & {
  type: "image";
};
type StructuredExtractionInput = StructuredExtractionTextInput | StructuredExtractionImageInput;
type StructuredExtractionRequest = {
  /** Image-first extraction input; callers must include at least one image. */
  input: StructuredExtractionInput[];
  instructions: string;
  schemaName?: string;
  jsonSchema?: unknown;
  jsonMode?: boolean;
  timeoutMs: number;
  signal?: AbortSignal;
  profile?: string;
  preferredProfile?: string;
  authStore?: AuthProfileStore;
  agentDir: string;
  cfg: OpenClawConfig;
  model: string;
  provider: string;
};
type StructuredExtractionResult = {
  text: string;
  parsed?: unknown;
  model?: string;
  provider?: string;
  contentType?: "json" | "text";
};
type MediaUnderstandingDocumentModelDefaults = {
  textExtraction?: string;
  image?: string | false;
};
type MediaUnderstandingProviderAuthContext = {
  config?: OpenClawConfig;
  provider: string;
  providerConfig?: ModelProviderConfig;
};
type MediaUnderstandingProviderAuthResult = {
  kind: "none";
  source: string;
} | {
  kind: "api-key";
  apiKey: string;
  source: string;
  mode?: "api-key";
};
type MediaUnderstandingProviderSyntheticAuthResult = {
  apiKey: string;
  source: string;
  mode: "api-key";
};
type MediaUnderstandingProvider = {
  id: string;
  capabilities?: MediaUnderstandingCapability[];
  defaultModels?: Partial<Record<MediaUnderstandingCapability, string>>;
  autoPriority?: Partial<Record<MediaUnderstandingCapability, number>>;
  nativeDocumentInputs?: Array<"pdf">;
  documentModels?: Partial<Record<"pdf", MediaUnderstandingDocumentModelDefaults>>;
  resolveAuth?: (ctx: MediaUnderstandingProviderAuthContext) => MediaUnderstandingProviderAuthResult | null | undefined;
  /** @deprecated Use resolveAuth. */
  resolveSyntheticAuth?: (ctx: MediaUnderstandingProviderAuthContext) => MediaUnderstandingProviderSyntheticAuthResult | null | undefined;
  transcribeAudio?: (req: AudioTranscriptionRequest) => Promise<AudioTranscriptionResult>;
  /** Called after file loading. Result.error is only a rejection before audio upload;
   * upload/HTTP failures must throw and stop automatic provider selection. */
  transcribeAudioWithContext?: (req: AudioTranscriptionContext) => Promise<Result<AudioTranscriptionResult, unknown>>;
  describeVideo?: (req: VideoDescriptionRequest) => Promise<VideoDescriptionResult>;
  describeImage?: (req: ImageDescriptionRequest) => Promise<ImageDescriptionResult>;
  describeImages?: (req: ImagesDescriptionRequest) => Promise<ImagesDescriptionResult>;
  extractStructured?: (req: StructuredExtractionRequest) => Promise<StructuredExtractionResult>;
};
//#endregion
//#region packages/media-core/src/constants.d.ts
/** Canonical media families used by attachment facts, routing, and MIME classification. */
type MediaKind = "image" | "audio" | "video" | "document" | "sticker" | "unknown";
/** Maps a MIME type to the media family used for size limits and routing. */
declare function mediaKindFromMime(mime?: string | null): MediaKind | undefined;
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
type MediaFactInput = { [Key in keyof MediaFact]?: MediaFact[Key] | null; };
declare const LEGACY_MEDIA_CONTEXT_KEYS: readonly ["MediaPath", "MediaPaths", "MediaUrl", "MediaUrls", "MediaType", "MediaTypes", "MediaDir", "MediaTranscribedIndexes", "MediaStaged", "MediaWorkspaceDir"];
type LegacyMediaContextKey = (typeof LEGACY_MEDIA_CONTEXT_KEYS)[number];
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
/**
 * Stream function used by the agent loop.
 *
 * Contract:
 * - Must not throw or return a rejected promise for request/model/runtime failures.
 * - Must return an AssistantMessageEventStream.
 * - Failures must be encoded in the returned stream via protocol events and a
 *   final AssistantMessage with stopReason "error" or "aborted" and errorMessage.
 */
type StreamFn = StreamFn$1;
/**
 * Configuration for how tool calls from a single assistant message are executed.
 *
 * - "sequential": prepare, execute, and finalize each call before the next; steering can skip the tail after one call starts.
 * - "parallel": prepare calls sequentially, then execute allowed tools concurrently without steering skips.
 *   `tool_execution_end` is emitted in tool completion order after each tool is finalized,
 *   while tool-result message artifacts are emitted later in assistant source order.
 */
type ToolExecutionMode = "sequential" | "parallel";
/**
 * Controls how many queued user messages are injected when the agent loop reaches a queue drain point.
 *
 * - "all": drain and inject every queued message at that point.
 * - "one-at-a-time": drain and inject only the oldest queued message, leaving the rest queued for later drain points.
 */
type QueueMode$1 = "all" | "one-at-a-time";
/** A single tool call content block emitted by an assistant message. */
type AgentToolCall = Extract<AssistantMessage["content"][number], {
  type: "toolCall";
}>;
/**
 * Result returned from `beforeToolCall`.
 *
 * Returning `{ block: true }` prevents the tool from executing. The loop emits an error tool result instead.
 * `reason` becomes the text shown in that error result. If omitted, a default blocked message is used.
 */
interface BeforeToolCallResult {
  block?: boolean;
  reason?: string;
}
/** A call participating in an internal whole-batch admission check. */
interface InternalToolBatchCall {
  toolCall: AgentToolCall;
  /** Validated arguments, or the raw arguments when validation rejected the call. */
  args: unknown;
  /** Resolved tool identity for OpenClaw-owned argument canonicalization. */
  tool?: AgentTool;
  /**
   * Error result for a call rejected by argument validation. It never executes;
   * the batch lifecycle commits it at its assistant-order launch position.
   */
  validationFailure?: AgentToolResult<unknown>;
}
/** Typed core signal used to recover once from a critical tool loop. */
interface ToolLoopIntervention {
  kind: "critical-tool-loop";
  toolCallId: string;
  toolName: string;
  actionKey: string;
  detector: string;
  count: number;
  reason: string;
}
/** Bucketed feedback for an admitted call, not a veto or recovery attempt. */
interface ToolLoopWarning {
  kind: "tool-loop-warning";
  toolCallId: string;
  count: number;
}
/** Context for OpenClaw-owned whole-batch tool admission. */
interface InternalBeforeToolBatchContext {
  assistantMessage: AssistantMessage;
  calls: InternalToolBatchCall[];
  context: AgentContext;
}
/** Result of OpenClaw-owned whole-batch tool admission. */
type InternalBeforeToolBatchResult = {
  intervention: ToolLoopIntervention;
  warnings?: never;
} | {
  intervention?: never;
  warnings?: ToolLoopWarning[];
};
interface DeferredToolCallContext {
  /** The assistant message that requested the tool call. */
  assistantMessage: AssistantMessage;
  /** The raw tool call block from `assistantMessage.content`. */
  toolCall: AgentToolCall;
  /** Current agent context when the hook runs. */
  context: AgentContext;
}
/**
 * Partial override returned from `afterToolCall`.
 *
 * Merge semantics are field-by-field:
 * - `content`: if provided, replaces the tool result content array in full
 * - `details`: if provided, replaces the tool result details value in full
 * - `isError`: if provided, replaces the tool result error flag
 * - `terminate`: if provided, replaces the early-termination hint
 *
 * Omitted fields keep the original executed tool result values.
 * There is no deep merge for `content` or `details`.
 */
interface AfterToolCallResult {
  content?: (TextContent | ImageContent)[];
  details?: unknown;
  isError?: boolean;
  /**
   * Hint that the agent should stop after the current tool batch.
   * Early termination only happens when every finalized tool result in the batch sets this to true.
   */
  terminate?: boolean;
}
/** Context passed to `beforeToolCall`. */
interface BeforeToolCallContext extends DeferredToolCallContext {
  /** Validated tool arguments for the target tool schema. */
  args: unknown;
}
/** Context passed to `afterToolCall`. */
interface AfterToolCallContext extends BeforeToolCallContext {
  /** The executed tool result before unknown `afterToolCall` overrides are applied. */
  result: AgentToolResult<unknown>;
  /** Whether the executed tool result is currently treated as an error. */
  isError: boolean;
}
/**
 * Context passed to `afterToolOutcome` after every finalized tool outcome.
 *
 * Unlike `afterToolCall`, this hook also observes failures that prevented
 * execution. `args` contains validated arguments when execution reached the
 * prepared state, otherwise the raw model arguments.
 */
interface AfterToolOutcomeContext extends AfterToolCallContext {
  /** Whether the tool implementation started executing. */
  executionStarted: boolean;
  /** Typed pre-execution failure provenance when available. */
  errorKind?: "argument-validation";
}
/** Context passed to `shouldStopAfterTurn`. */
interface ShouldStopAfterTurnContext {
  /** The assistant message that completed the turn. */
  message: AssistantMessage;
  /** Tool result messages passed to the preceding `turn_end` event. */
  toolResults: ToolResultMessage[];
  /** Current agent context after the turn's assistant message and tool results have been appended. */
  context: AgentContext;
  /** Messages that this loop invocation will return if it exits at this point. Prompt runs include the initial prompt messages; continuation runs do not include pre-existing context messages. */
  newMessages: AgentMessage[];
}
/** Replacement runtime state used by the agent loop before starting another provider request. */
type AgentLoopContinuationUpdate = Pick<AgentContext, "systemPrompt" | "tools">;
interface AgentLoopTurnUpdate {
  /** Commit accepted steering and settle this invocation without another model request. */
  stop?: boolean;
  /** Prepare only an admitted continuation, after its queued input has been emitted. */
  prepareContinuation?: (context: AgentContext) => AgentLoopContinuationUpdate | Promise<AgentLoopContinuationUpdate>;
  /** Context for the next provider request. */
  context?: AgentContext;
  /** Model for the next provider request. */
  model?: Model;
  /** Thinking level for the next provider request. */
  thinkingLevel?: ThinkingLevel;
}
interface PrepareNextTurnContext extends ShouldStopAfterTurnContext {}
/** @internal Mutable one-shot budget shared by prompt retries in one Agent run. */
type ToolLoopRecoveryState = {
  criticalToolLoopSeen: boolean;
};
interface AgentLoopConfig extends SimpleStreamOptions {
  model: Model;
  /** Logical thinking level retained across model changes before provider mapping. */
  thinkingLevel?: ThinkingLevel;
  /**
   * Converts AgentMessage[] to LLM-compatible Message[] before each LLM call.
   *
   * Each AgentMessage must be converted to a UserMessage, AssistantMessage, or ToolResultMessage
   * that the LLM can understand. AgentMessages that cannot be converted (e.g., UI-only notifications,
   * status messages) should be filtered out.
   *
   * Contract: must not throw or reject. Return a safe fallback value instead.
   * Throwing interrupts the low-level agent loop without producing a normal event sequence.
   *
   * @example
   * ```typescript
   * convertToLlm: (messages) => messages.flatMap(m => {
   *   if (m.role === "custom") {
   *     // Convert custom message to user message
   *     return [{ role: "user", content: m.content, timestamp: m.timestamp }];
   *   }
   *   if (m.role === "notification") {
   *     // Filter out UI-only messages
   *     return [];
   *   }
   *   // Pass through standard LLM messages
   *   return [m];
   * })
   * ```
   */
  convertToLlm: (messages: AgentMessage[]) => Message[] | Promise<Message[]>;
  /**
   * Optional transform applied to the context before `convertToLlm`.
   *
   * Use this for operations that work at the AgentMessage level:
   * - Context window management (pruning old messages)
   * - Injecting context from external sources
   *
   * Contract: must not throw or reject. Return the original messages or another
   * safe fallback value instead.
   *
   * @example
   * ```typescript
   * transformContext: async (messages) => {
   *   if (estimateTokens(messages) > MAX_TOKENS) {
   *     return pruneOldMessages(messages);
   *   }
   *   return messages;
   * }
   * ```
   */
  transformContext?: (messages: AgentMessage[], signal?: AbortSignal) => Promise<AgentMessage[]>;
  /**
   * Resolves an API key dynamically for each LLM call.
   *
   * Useful for short-lived OAuth tokens (e.g., GitHub Copilot) that may expire
   * during long-running tool execution phases.
   *
   * Contract: must not throw or reject. Return undefined when no key is available.
   */
  getApiKey?: (provider: string) => Promise<string | undefined> | string | undefined;
  /**
   * Called after each turn fully completes and `turn_end` has been emitted.
   *
   * If it returns true, the loop emits `agent_end` and exits before polling steering or follow-up queues,
   * without starting another LLM call. Steering already drained at a tool checkpoint takes precedence,
   * so this hook is deferred until that steering turn completes.
   *
   * Use this to request a graceful stop after the current turn, e.g. before context gets too full.
   *
   * Contract: must not throw or reject. Throwing interrupts the low-level agent loop without producing a normal event sequence.
   */
  shouldStopAfterTurn?: (context: ShouldStopAfterTurnContext) => boolean | Promise<boolean>;
  /**
   * Called after `turn_end` and before the loop decides whether another provider request should start.
   * Return replacement context/model/thinking state to affect the next turn in this run.
   * Return undefined to keep using the current context/config.
   */
  prepareNextTurn?: (context: PrepareNextTurnContext) => AgentLoopTurnUpdate | undefined | Promise<AgentLoopTurnUpdate | undefined>;
  /**
   * Returns steering messages to inject into the conversation mid-run.
   *
   * After a call from the assistant message actually starts, sequential execution
   * checks before each later call, including again after asynchronous preparation.
   * Streamed batches share that started state. Parallel batches never steering-skip.
   * Both modes check after a batch settles, before stop hooks. Drained messages
   * follow tool results before the next LLM call; already-running calls continue.
   *
   * Once a check returns messages, the loop carries that exact result to the
   * next turn without polling again. This preserves queue drain ordering.
   *
   * Use this for "steering" the agent while it's working.
   *
   * Contract: must not throw or reject. Resolve to [] when no steering messages are available.
   */
  getSteeringMessages?: () => Promise<AgentMessage[]>;
  /**
   * Returns follow-up messages to process after the agent would otherwise stop.
   *
   * Called when the agent has no more tool calls and no steering messages.
   * If messages are returned, they're added to the context and the agent
   * continues with another turn.
   *
   * Use this for follow-up messages that should wait until the agent finishes.
   *
   * Contract: must not throw or reject. Return [] when no follow-up messages are available.
   */
  getFollowUpMessages?: () => Promise<AgentMessage[]>;
  /** Consumes the cancellation fact for a previously drained queue message. */
  consumeQueuedMessageCancellation?: (message: AgentMessage) => boolean;
  /**
   * Tool execution mode.
   * - "sequential": execute calls one by one; after one starts, steering can skip later calls
   * - "parallel": preflight tool calls sequentially, then execute allowed tools concurrently;
   *   steering is checked after settlement without skipping prepared calls;
   *   emit `tool_execution_end` in tool completion order after each tool is finalized,
   *   then emit tool-result message artifacts later in assistant source order
   *
   * Default: "parallel"
   */
  toolExecution?: ToolExecutionMode;
  /**
   * Called before a tool is executed, after arguments have been validated.
   *
   * Return `{ block: true }` to prevent execution. The loop emits an error tool result instead.
   * The hook receives the agent abort signal and is responsible for honoring it.
   */
  beforeToolCall?: (context: BeforeToolCallContext, signal?: AbortSignal) => Promise<BeforeToolCallResult | undefined>;
  /** @internal OpenClaw-owned batch admission. Not a plugin or session SDK hook. */
  beforeToolBatch?: (context: InternalBeforeToolBatchContext, signal?: AbortSignal) => Promise<InternalBeforeToolBatchResult | undefined>;
  /** @internal Preserves the one-shot recovery budget across Agent.continue() retries. */
  toolLoopRecoveryState?: ToolLoopRecoveryState;
  /**
   * Hydrates an already-authorized tool that was deferred out of the current
   * provider-visible tool set. Return undefined for every other unknown name so
   * the loop keeps the normal "Tool <name> not found" result. Thrown or rejected
   * failures become error tool results for the requested call.
   */
  resolveDeferredTool?: (context: DeferredToolCallContext, signal?: AbortSignal) => Promise<AgentTool | undefined> | AgentTool | undefined;
  /**
   * Called after a tool finishes executing, before `tool_execution_end` and tool-result message events are emitted.
   *
   * Return an `AfterToolCallResult` to override parts of the executed tool result:
   * - `content` replaces the full content array
   * - `details` replaces the full details payload
   * - `isError` replaces the error flag
   * - `terminate` replaces the early-termination hint
   *
   * Any omitted fields keep their original values. No deep merge is performed.
   * The hook receives the agent abort signal and is responsible for honoring it.
   */
  afterToolCall?: (context: AfterToolCallContext, signal?: AbortSignal) => Promise<AfterToolCallResult | undefined>;
  /**
   * Called after every tool outcome is finalized, including failures that
   * prevented execution. It runs after `afterToolCall` for executed tools.
   */
  afterToolOutcome?: (context: AfterToolOutcomeContext, signal?: AbortSignal) => Promise<AfterToolCallResult | undefined>;
}
/**
 * Thinking/reasoning level for models that support it.
 * Note: "xhigh" is only supported by selected model families. Use model thinking-level metadata
 * from openclaw/plugin-sdk/llm to detect support for a concrete model.
 */
type ThinkingLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max";
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
/**
 * Public agent state.
 *
 * `tools` and `messages` use accessor properties so implementations can copy
 * assigned arrays before storing them.
 */
interface AgentState {
  /** System prompt sent with each model request. */
  systemPrompt: string;
  /** Active model used for future turns. */
  model: Model;
  /** Requested reasoning level for future turns. */
  thinkingLevel: ThinkingLevel;
  /** Available tools. Assigning a new array copies the top-level array. */
  set tools(tools: AgentTool[]);
  get tools(): AgentTool[];
  /** Conversation transcript. Assigning a new array copies the top-level array. */
  set messages(messages: AgentMessage[]);
  get messages(): AgentMessage[];
  /**
   * True while the agent is processing a prompt or continuation.
   *
   * This remains true until awaited `agent_end` listeners settle.
   */
  readonly isStreaming: boolean;
  /** Partial assistant message for the current streamed response, if any. */
  readonly streamingMessage?: AgentMessage;
  /** Tool call ids currently executing. */
  readonly pendingToolCalls: ReadonlySet<string>;
  /** Error message from the most recent failed or aborted assistant turn, if any. */
  readonly errorMessage?: string;
}
/** Channel-safe progress text emitted by a running tool. */
interface AgentToolProgress {
  /** Public text suitable for user-facing progress surfaces. */
  text: string;
  /** Tool progress is rendered by channel progress UIs. */
  visibility: "channel";
  /** Progress text must not contain secrets, private args, or fetched content. */
  privacy: "public";
  /** Optional stable id for progress line replacement. */
  id?: string;
}
/** Final or partial result produced by a tool. */
interface AgentToolResult<T> {
  /** Text or image content returned to the model. */
  content: (TextContent | ImageContent)[];
  /** Arbitrary structured details for logs or UI rendering. */
  details: T;
  /** Optional public progress hint for partial tool updates; never model content. */
  progress?: AgentToolProgress;
  /**
   * Hint that the agent should stop after the current tool batch.
   * Early termination only happens when every finalized tool result in the batch sets this to true.
   */
  terminate?: boolean;
}
/** Callback used by tools to stream partial execution updates. */
type AgentToolUpdateCallback<T = unknown> = (partialResult: AgentToolResult<T>) => void;
/** Origin class for tool output that can taint later model-authored content in the same turn. */
type ToolResultContentSource = "network";
/** Tool definition used by the agent runtime. */
interface AgentTool<TParameters extends TSchema = TSchema, TDetails = unknown> extends Tool<TParameters> {
  /** Human-readable label for UI display. */
  label: string;
  /** Optional schema for the structured `AgentToolResult.details` value. */
  outputSchema?: TSchema;
  /** Preserve lifecycle telemetry without rendering transient channel progress. */
  hideFromChannelProgress?: boolean;
  /** Tool results contain externally controlled network content. */
  resultContentSource?: ToolResultContentSource;
  /**
   * Optional compatibility shim for raw tool-call arguments before schema validation.
   * Must return an object that matches `TParameters`.
   */
  prepareArguments?: (args: unknown) => Static<TParameters>;
  /** Execute the tool call. Throw on failure instead of encoding errors in `content`. */
  execute: (toolCallId: string, params: Static<TParameters>, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<TDetails>) => Promise<AgentToolResult<TDetails>>;
  /**
   * Per-tool execution mode override.
   * - "sequential": this tool must execute one at a time with other tool calls.
   * - "parallel": this tool can execute concurrently with other tool calls.
   *
   * If omitted, the default execution mode applies.
   */
  executionMode?: ToolExecutionMode;
}
/** Context snapshot passed into the low-level agent loop. */
interface AgentContext {
  /** System prompt included with the request. */
  systemPrompt: string;
  /** Transcript visible to the model. */
  messages: AgentMessage[];
  /** Tools available for this run. */
  tools?: AgentTool[];
}
/**
 * Events emitted by the Agent for UI updates.
 *
 * `agent_end` is the last event emitted for a run, but awaited `Agent.subscribe()`
 * listeners for that event are still part of run settlement. The agent becomes
 * idle only after those listeners finish.
 */
type AgentEvent = {
  type: "agent_start";
} | {
  type: "agent_end";
  messages: AgentMessage[];
} | {
  type: "turn_start";
} | {
  type: "turn_end";
  message: AgentMessage;
  toolResults: ToolResultMessage[];
} | {
  type: "message_start";
  message: AgentMessage;
} | {
  type: "message_update";
  message: AgentMessage;
  assistantMessageEvent: AssistantMessageEvent;
} | {
  type: "message_end";
  message: AgentMessage;
} | {
  type: "tool_execution_start";
  toolCallId: string;
  toolName: string;
  args: unknown;
  hideFromChannelProgress?: boolean;
} | {
  type: "tool_execution_update";
  toolCallId: string;
  toolName: string;
  args: unknown;
  partialResult: unknown;
  hideFromChannelProgress?: boolean;
} | {
  type: "tool_execution_end";
  toolCallId: string;
  toolName: string;
  result: unknown;
  isError: boolean;
  /** False when resolution, preparation, validation, policy, or queued steering prevented execution. */
  executionStarted?: boolean;
  /** Typed pre-execution failure provenance for safe downstream diagnostics. */
  errorKind?: "argument-validation";
  hideFromChannelProgress?: boolean;
};
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
type CommandTurnKind = "native" | "text-slash" | "normal";
type CommandTurnContext = {
  commandName?: string;
  body?: string;
} & ({
  kind: "native";
  source: "native";
  authorized: boolean;
} | {
  kind: "text-slash";
  source: "text";
  authorized: boolean;
} | {
  kind: "normal";
  source: "message";
  authorized: false;
});
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
//#region packages/normalization-core/src/string-coerce.d.ts
type FastMode = boolean | "auto" | "ultrafast";
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
declare const ExecutionIdentityAdmissionEnvelopeSchema: Type.TObject<{
  envelopeVersion: Type.TLiteral<1>;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  createdAt: Type.TInteger;
  runtimeInstanceId: Type.TString;
  agentId: Type.TString;
  ingress: Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"local-cli">, Type.TLiteral<"gateway-client">, Type.TLiteral<"channel">, Type.TLiteral<"api">, Type.TLiteral<"schedule">, Type.TLiteral<"webhook">, Type.TLiteral<"task">, Type.TLiteral<"subagent">, Type.TLiteral<"acp">, Type.TLiteral<"worker">, Type.TLiteral<"plugin">, Type.TLiteral<"recovery">, Type.TLiteral<"system">]>;
    boundary: Type.TString;
    state: Type.TUnion<[Type.TLiteral<"present">, Type.TLiteral<"absent">, Type.TLiteral<"unknown">, Type.TLiteral<"unsupported">]>;
    rawSourceRef: Type.TOptional<Type.TString>;
  }>;
  runtime: Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"embedded">, Type.TLiteral<"worker">, Type.TLiteral<"plugin-harness">, Type.TLiteral<"acp">]>;
  }>;
  invoker: Type.TOptional<Type.TUnion<[Type.TObject<{
    state: Type.TLiteral<"present">;
    kind: Type.TUnion<[Type.TLiteral<"person">, Type.TLiteral<"agent">, Type.TLiteral<"service">, Type.TLiteral<"schedule">, Type.TLiteral<"webhook">, Type.TLiteral<"system">, Type.TLiteral<"local-account">, Type.TLiteral<"runtime">]>;
    rawPrincipalRef: Type.TString;
    displayLabel: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    state: Type.TLiteral<"unknown">;
  }>]>>;
  applicableGrants: Type.TArray<Type.TObject<{
    rawGrantRef: Type.TString;
    state: Type.TUnion<[Type.TLiteral<"present">, Type.TLiteral<"absent">, Type.TLiteral<"unknown">, Type.TLiteral<"unsupported">]>;
  }>>;
  assurance: Type.TArray<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"durable-profile">, Type.TLiteral<"trusted-proxy">, Type.TLiteral<"tailscale-whois">, Type.TLiteral<"device-proof">, Type.TLiteral<"channel-admission">, Type.TLiteral<"local-process">, Type.TLiteral<"spawn-lineage">, Type.TLiteral<"worker-admission">, Type.TLiteral<"runtime-binding">, Type.TLiteral<"other">]>;
    rawEvidenceRef: Type.TString;
    strength: Type.TUnion<[Type.TLiteral<"self-asserted">, Type.TLiteral<"boundary-verified">, Type.TLiteral<"cryptographic">]>;
  }>>;
}>;
declare const ExecutionIdentityAdmissionTokenSchema: Type.TObject<{
  tokenVersion: Type.TLiteral<1>;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  createdAt: Type.TInteger;
}>;
type ExecutionIdentityAdmissionEnvelope = Static<typeof ExecutionIdentityAdmissionEnvelopeSchema>;
type ExecutionIdentityAdmissionFacts = Omit<ExecutionIdentityAdmissionEnvelope, "envelopeVersion" | "contextId" | "executionId" | "createdAt" | "runtimeInstanceId" | "ingress" | "applicableGrants" | "assurance"> & {
  ingress: Omit<ExecutionIdentityAdmissionEnvelope["ingress"], "state"> & {
    state?: ExecutionIdentityAdmissionEnvelope["ingress"]["state"];
  };
  applicableGrants?: ExecutionIdentityAdmissionEnvelope["applicableGrants"];
  assurance?: ExecutionIdentityAdmissionEnvelope["assurance"];
};
type ExecutionIdentityAdmissionToken = Static<typeof ExecutionIdentityAdmissionTokenSchema>;
//#endregion
//#region src/channels/progress-draft-diffstat.d.ts
type ChannelProgressDraftDiffStat = Readonly<{
  files: number;
  added: number;
  removed: number;
}>;
//#endregion
//#region src/channels/progress-draft-lines.d.ts
type ChannelProgressDraftLine = {
  /** Stable line id used to update an existing progress line in place. */
  id?: string;
  /** Progress event family that produced this line. */
  kind: "tool" | "item" | "plan" | "approval" | "command-output" | "patch";
  /** Rendered line text before final draft truncation/prefix formatting. */
  text: string;
  /** Human-readable label for UI renderers. */
  label: string;
  /** Optional leading icon for rich or plain progress renderers. */
  icon?: string;
  /** Compact detail text separated from label/icon. */
  detail?: string;
  /** Optional lifecycle status, such as completed or exit code. */
  status?: string;
  /** Completion metadata for authored text; never rendered as a tool status. */
  complete?: boolean;
  /** Normalized tool name when the line represents tool work. */
  toolName?: string;
  /** Whether final formatting should add a bullet/line prefix. */
  prefix?: boolean;
};
//#endregion
//#region src/channels/streaming.d.ts
type AgentPlanStepStatus = "pending" | "in_progress" | "completed";
type AgentPlanStep = {
  step: string;
  status: AgentPlanStepStatus;
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
/** Exact accepted transcript range, inclusive of admission and terminal. */
type TranscriptTurnBoundary = Readonly<{
  admission: TranscriptTurnAdmission;
  terminal: TranscriptEntryAnchor;
}>;
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
//#region packages/gateway-protocol/src/schema/approvals.d.ts
declare const ApprovalDecisionSchema: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>;
declare const ApprovalTerminalReasonSchema: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"timeout">, Type.TLiteral<"malformed-verdict">, Type.TLiteral<"no-route">, Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">, Type.TLiteral<"storage-corrupt">]>;
/**
 * Owner-declared blast-radius facts for a pending approval. Variants are
 * named schemas so native protocol generators emit the discriminated union.
 */
declare const ApprovalScopeSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"message-send">;
  target: Type.TString;
  recipientCount: Type.TInteger;
  recipients: Type.TOptional<Type.TArray<Type.TString>>;
  audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"payment">;
  amount: Type.TString;
  currency: Type.TString;
  target: Type.TString;
}>, Type.TObject<{
  kind: Type.TLiteral<"external-post">;
  target: Type.TString;
  visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
}>, Type.TObject<{
  kind: Type.TLiteral<"standing-grant">;
  automation: Type.TString;
  command: Type.TString;
  expiresInDays: Type.TOptional<Type.TInteger>;
}>]>;
declare const ApprovalPresentationSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"exec">;
  commandText: Type.TString;
  commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  scope: Type.TOptional<Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"message-send">;
    target: Type.TString;
    recipientCount: Type.TInteger;
    recipients: Type.TOptional<Type.TArray<Type.TString>>;
    audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"payment">;
    amount: Type.TString;
    currency: Type.TString;
    target: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"external-post">;
    target: Type.TString;
    visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"standing-grant">;
    automation: Type.TString;
    command: Type.TString;
    expiresInDays: Type.TOptional<Type.TInteger>;
  }>]>>;
  allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"plugin">;
  title: Type.TString;
  description: Type.TString;
  detail: Type.TOptional<Type.TString>;
  severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
  pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  scope: Type.TOptional<Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"message-send">;
    target: Type.TString;
    recipientCount: Type.TInteger;
    recipients: Type.TOptional<Type.TArray<Type.TString>>;
    audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"payment">;
    amount: Type.TString;
    currency: Type.TString;
    target: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"external-post">;
    target: Type.TString;
    visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"standing-grant">;
    automation: Type.TString;
    command: Type.TString;
    expiresInDays: Type.TOptional<Type.TInteger>;
  }>]>>;
  allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
  externalResolution: Type.TOptional<Type.TObject<{
    label: Type.TString;
    decisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>>;
  }>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"system-agent">;
  title: Type.TString;
  description: Type.TString;
  proposalHash: Type.TString;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
}>]>;
/** Authoritative pending approval set returned when a session stream subscribes. */
declare const SessionApprovalReplaySchema: Type.TObject<{
  sessionKey: Type.TString;
  updatedAtMs: Type.TInteger;
  approvals: Type.TArray<Type.TObject<{
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      scope: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"message-send">;
        target: Type.TString;
        recipientCount: Type.TInteger;
        recipients: Type.TOptional<Type.TArray<Type.TString>>;
        audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"payment">;
        amount: Type.TString;
        currency: Type.TString;
        target: Type.TString;
      }>, Type.TObject<{
        kind: Type.TLiteral<"external-post">;
        target: Type.TString;
        visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"standing-grant">;
        automation: Type.TString;
        command: Type.TString;
        expiresInDays: Type.TOptional<Type.TInteger>;
      }>]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      detail: Type.TOptional<Type.TString>;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      scope: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"message-send">;
        target: Type.TString;
        recipientCount: Type.TInteger;
        recipients: Type.TOptional<Type.TArray<Type.TString>>;
        audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"payment">;
        amount: Type.TString;
        currency: Type.TString;
        target: Type.TString;
      }>, Type.TObject<{
        kind: Type.TLiteral<"external-post">;
        target: Type.TString;
        visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
      }>, Type.TObject<{
        kind: Type.TLiteral<"standing-grant">;
        automation: Type.TString;
        command: Type.TString;
        expiresInDays: Type.TOptional<Type.TInteger>;
      }>]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
      externalResolution: Type.TOptional<Type.TObject<{
        label: Type.TString;
        decisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>>;
      }>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
    status: Type.TLiteral<"pending">;
    /** Canonical raising session when projected into a session-scoped reviewer surface. */
    sourceSessionKey: Type.TOptional<Type.TString>;
  }>>;
  truncated: Type.TBoolean;
}>;
type ApprovalDecision = Static<typeof ApprovalDecisionSchema>;
type ApprovalTerminalReason = Static<typeof ApprovalTerminalReasonSchema>;
type ApprovalScope$1 = Static<typeof ApprovalScopeSchema>;
type ApprovalPresentation = Static<typeof ApprovalPresentationSchema>;
type SessionApprovalReplay = Static<typeof SessionApprovalReplaySchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/exec-approvals.d.ts
/** Pending command execution approval request shown to reviewers. */
declare const ExecApprovalRequestParamsSchema: Type.TObject<{
  id: Type.TOptional<Type.TString>;
  command: Type.TOptional<Type.TString>;
  commandArgv: Type.TOptional<Type.TArray<Type.TString>>;
  systemRunPlan: Type.TOptional<Type.TObject<{
    argv: Type.TArray<Type.TString>;
    cwd: Type.TUnion<[Type.TString, Type.TNull]>;
    commandText: Type.TString;
    commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    agentId: Type.TUnion<[Type.TString, Type.TNull]>;
    sessionKey: Type.TUnion<[Type.TString, Type.TNull]>;
    policySnapshot: Type.TOptional<Type.TObject<{
      security: Type.TUnion<[Type.TLiteral<"deny">, Type.TLiteral<"allowlist">, Type.TLiteral<"full">]>;
      ask: Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"on-miss">, Type.TLiteral<"always">]>;
      askFallback: Type.TUnion<[Type.TLiteral<"deny">, Type.TLiteral<"allowlist">, Type.TLiteral<"full">]>;
      autoAllowSkills: Type.TBoolean;
      allowlistRules: Type.TArray<Type.TObject<{
        pattern: Type.TString;
        argPattern: Type.TOptional<Type.TString>;
        source: Type.TOptional<Type.TLiteral<"allow-always">>;
      }>>;
    }>>;
    mutableFileOperand: Type.TOptional<Type.TUnion<[Type.TObject<{
      argvIndex: Type.TInteger;
      path: Type.TString;
      sha256: Type.TString;
    }>, Type.TNull]>>;
  }>>;
  env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  cwd: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  security: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  ask: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  scope: Type.TOptional<Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"message-send">;
    target: Type.TString;
    recipientCount: Type.TInteger;
    recipients: Type.TOptional<Type.TArray<Type.TString>>;
    audience: Type.TOptional<Type.TUnion<[Type.TLiteral<"internal">, Type.TLiteral<"external">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"payment">;
    amount: Type.TString;
    currency: Type.TString;
    target: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"external-post">;
    target: Type.TString;
    visibility: Type.TUnion<[Type.TLiteral<"public">, Type.TLiteral<"restricted">]>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"standing-grant">;
    automation: Type.TString;
    command: Type.TString;
    expiresInDays: Type.TOptional<Type.TInteger>;
  }>]>>;
  unavailableDecisions: Type.TOptional<Type.TArray<Type.TString>>;
  commandSpans: Type.TOptional<Type.TArray<Type.TObject<{
    startIndex: Type.TInteger;
    endIndex: Type.TInteger;
  }>>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  resolvedPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  sessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  sessionId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  runId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  toolCallId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceChannel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceTo: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceAccountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceThreadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber, Type.TNull]>>;
  approvalReviewerDeviceIds: Type.TOptional<Type.TArray<Type.TString>>;
  requireDeliveryRoute: Type.TOptional<Type.TBoolean>;
  suppressDelivery: Type.TOptional<Type.TBoolean>;
  deliverToApprovalClientsOnly: Type.TOptional<Type.TBoolean>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  twoPhase: Type.TOptional<Type.TBoolean>;
}>;
type ExecApprovalRequestParams = Static<typeof ExecApprovalRequestParamsSchema>;
//#endregion
//#region src/infra/command-analysis/explain.d.ts
/** Compact command explanation summary shown in approval UI. */
type CommandExplanationSummary = {
  commandCount: number;
  nestedCommandCount: number;
  riskKinds: string[];
  warningLines: string[];
};
//#endregion
//#region src/infra/exec-approval-policy-snapshot.d.ts
type PolicySnapshot = SchemaContract<NonNullable<NonNullable<ExecApprovalRequestParams["systemRunPlan"]>["policySnapshot"]>>;
type ExecApprovalPolicyRule = PolicySnapshot["allowlistRules"][number];
type ExecApprovalPolicySnapshot = Omit<PolicySnapshot, "allowlistRules"> & {
  allowlistRules: readonly ExecApprovalPolicyRule[];
};
//#endregion
//#region src/infra/exec-approvals-core.d.ts
type ExecHost = "sandbox" | "gateway" | "node";
type ExecTarget = "auto" | ExecHost;
type ExecSecurity = "deny" | "allowlist" | "full";
type ExecAsk = "off" | "on-miss" | "always";
type ExecMode = "deny" | "allowlist" | "ask" | "auto" | "full";
type ExecApprovalDecision = "allow-once" | "allow-always" | "deny";
type ExecApprovalUnavailableDecision = "allow-always";
type SystemRunApprovalBinding = Pick<SystemRunApprovalPlan, "argv" | "cwd" | "agentId" | "sessionKey"> & {
  envHash: string | null;
};
type SystemRunApprovalPlan = SchemaContract<Omit<NonNullable<ExecApprovalRequestParams["systemRunPlan"]>, "policySnapshot">> & {
  policySnapshot?: ExecApprovalPolicySnapshot;
};
type ExecApprovalCommandSpan = NonNullable<ExecApprovalRequestParams["commandSpans"]>[number];
/** Cron job identity recorded at approval creation for a cron isolated run. */
type ExecApprovalCronExecutionSource = {
  jobId: string;
  jobConfigRevision: string;
};
type ExecApprovalRequestPayload = {
  command: string;
  commandPreview?: string | null;
  commandArgv?: string[];
  envKeys?: string[];
  systemRunBinding?: SystemRunApprovalBinding | null;
  systemRunPlan?: SystemRunApprovalPlan | null;
  cwd?: string | null;
  nodeId?: string | null;
  host?: string | null;
  security?: string | null;
  ask?: string | null;
  warningText?: string | null;
  /** Owner-declared blast-radius facts; display-only, never authorization. */
  scope?: ApprovalScope$1 | null;
  commandAnalysis?: CommandExplanationSummary | null;
  commandSpans?: ExecApprovalCommandSpan[];
  unavailableDecisions?: readonly ExecApprovalUnavailableDecision[];
  allowedDecisions?: readonly ExecApprovalDecision[];
  agentId?: string | null;
  resolvedPath?: string | null;
  sessionKey?: string | null;
  sessionId?: string | null;
  runId?: string | null;
  toolCallId?: string | null;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
  /** Gateway-recorded cron source; never taken from client request params. */
  cronExecutionSource?: ExecApprovalCronExecutionSource | null;
  /** Exact operation binding prepared at creation for standing-grant minting. */
  cronOperationBinding?: string | null;
};
type ExecApprovalRequest = {
  /** Descriptive wire metadata; readers derive it from the payload when absent. */
  approvalKind?: "exec";
  id: string;
  request: ExecApprovalRequestPayload;
  createdAtMs: number;
  expiresAtMs: number;
};
type ExecApprovalResolved = {
  id: string;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  ts: number;
  request?: ExecApprovalRequest["request"];
};
//#endregion
//#region src/infra/approval-scope.d.ts
type ApprovalScope = Static<typeof ApprovalScopeSchema>;
//#endregion
//#region src/infra/plugin-approvals.d.ts
type PluginApprovalActionView = {
  kind?: "command" | "decision";
  label: string;
  command: string;
  decision?: ExecApprovalDecision;
  style?: "primary" | "secondary" | "success" | "danger";
};
/** Gateway-minted placement identity; plugin and RPC callers never supply this authority. */
type PluginApprovalPlacementGrantBinding = {
  pluginId: string;
  command: string;
  approvalScope: string;
  agentId: string;
  sessionKey: string;
  sessionId: string;
  nodeId: string;
  pairingGeneration: string;
  environmentId: string;
  ownerEpoch: number;
  placementGeneration: number;
  cwd: string;
};
type PluginApprovalRequestPayload = {
  pluginId?: string | null;
  title: string;
  description: string;
  detail?: string | null;
  severity?: "info" | "warning" | "critical" | null;
  /** Owner-declared blast-radius facts; display-only, never authorization. */
  scope?: ApprovalScope | null;
  toolName?: string | null;
  toolCallId?: string | null;
  /** Trusted harness-selected policy subject; distinct from display-only toolName. */
  policySubject?: {
    pluginKey: string;
    tool?: string;
  };
  /** Exact MCP persistence intent; the host separately binds live tool-call proof. */
  mcpTool?: {
    server: string;
    tool: string;
  };
  allowedDecisions?: readonly ExecApprovalDecision[] | null;
  /** Trusted in-process metadata; public Gateway callers cannot submit this field. */
  externalResolution?: {
    label: string;
    decisions?: readonly ("allow-once" | "allow-always")[];
  } | null;
  actions?: readonly PluginApprovalActionView[] | null;
  agentId?: string | null;
  sessionKey?: string | null;
  /** Host-derived source run; never accepted from plugin approval RPC params. */
  runId?: string | null;
  /** Host-derived grant binding; never accepted from plugin approval RPC params. */
  placementGrant?: PluginApprovalPlacementGrantBinding | null;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
};
/** Timed plugin approval request persisted while awaiting a decision. */
type PluginApprovalRequest = {
  /** Descriptive wire metadata; readers derive it from the payload when absent. */
  approvalKind?: "plugin";
  id: string;
  request: PluginApprovalRequestPayload;
  createdAtMs: number;
  expiresAtMs: number;
};
type PluginApprovalResolved = {
  id: string;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  ts: number;
  request?: PluginApprovalRequestPayload;
};
//#endregion
//#region src/infra/system-agent-approvals.d.ts
type SystemAgentApprovalRequestPayload = {
  title: string;
  description: string;
  command: string;
  proposalHash: string;
  allowedDecisions: readonly ExecApprovalDecision[];
  agentId?: string | null;
  sessionKey?: string | null;
  sessionId: string;
  runId?: string | null;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
};
type SystemAgentApprovalRequest = {
  approvalKind?: "system-agent";
  id: string;
  request: SystemAgentApprovalRequestPayload;
  createdAtMs: number;
  expiresAtMs: number;
};
type SystemAgentApprovalApplicationStatus = "applied" | "not-applied";
type SystemAgentApprovalResolved = {
  id: string;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  ts: number;
  request?: SystemAgentApprovalRequestPayload;
  applicationStatus?: SystemAgentApprovalApplicationStatus;
  terminalStatus?: "expired" | "cancelled";
};
//#endregion
//#region src/infra/approval-types.d.ts
type ChannelApprovalKind = "exec" | "plugin" | "system-agent";
/** Backward-compatible request shape accepted from Gateway events and replay. */
type ApprovalRequestInput = ExecApprovalRequest | PluginApprovalRequest | SystemAgentApprovalRequest;
type ApprovalResolved = ExecApprovalResolved | PluginApprovalResolved | SystemAgentApprovalResolved;
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
  intent: "show-providers";
  cursor?: string;
} | {
  intent: "show-models";
  providerToken: string;
  cursor?: string;
} | {
  intent: "show-recents";
  cursor?: string;
} | {
  intent: "choose-model";
  providerToken: string;
  modelToken: string;
} | {
  intent: "choose-runtime";
  providerToken: string;
  modelToken: string;
  runtimeToken: string;
} | {
  intent: "reset";
} | {
  intent: "cancel";
}) & {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
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
//#region src/infra/outbound/reply-payload-parts.d.ts
/** Derived sendability facts for text/media outbound payload delivery. */
type SendableOutboundReplyParts = {
  text: string;
  trimmedText: string;
  /** Normalized non-empty media URLs. */
  mediaUrls: string[];
  mediaCount: number;
  hasText: boolean;
  hasMedia: boolean;
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
//#region packages/gateway-protocol/src/schema/session-placement.d.ts
declare const SessionPlacementDiskSpaceSchema: Type.TObject<{
  status: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
  availableBytes: Type.TInteger;
  totalBytes: Type.TInteger;
  observedAtMs: Type.TInteger;
}>;
declare const SessionPlacementWorkerRuntimeInstallSchema: Type.TObject<{
  phase: Type.TUnion<[Type.TLiteral<"transferring">, Type.TLiteral<"installing">]>;
  transferredBytes: Type.TInteger;
  totalBytes: Type.TInteger;
  startedAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
}>;
declare const SessionPlacementRunnerSchema: Type.TObject<{
  kind: Type.TLiteral<"device">;
  status: Type.TUnion<[Type.TLiteral<"available">, Type.TLiteral<"offline">]>;
  deviceId: Type.TOptional<Type.TString>;
}>;
declare const SessionPlacementMachineSchema: Type.TObject<{
  class: Type.TOptional<Type.TString>;
  os: Type.TOptional<Type.TString>;
  osLabel: Type.TOptional<Type.TString>;
  cpu: Type.TOptional<Type.TInteger>;
  memoryGb: Type.TOptional<Type.TInteger>;
}>;
/** Gateway-visible placement projection; `state` remains the closed discriminator. */
declare const SessionPlacementSchema: Type.TUnion<[Type.TObject<{
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  state: Type.TLiteral<"local">;
}>, Type.TObject<{
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  state: Type.TLiteral<"requested">;
}>, Type.TObject<{
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  providerId: Type.TOptional<Type.TString>;
  profileId: Type.TOptional<Type.TString>;
  machine: Type.TOptional<Type.TObject<{
    class: Type.TOptional<Type.TString>;
    os: Type.TOptional<Type.TString>;
    osLabel: Type.TOptional<Type.TString>;
    cpu: Type.TOptional<Type.TInteger>;
    memoryGb: Type.TOptional<Type.TInteger>;
  }>>;
  state: Type.TLiteral<"provisioning">;
  environmentId: Type.TOptional<Type.TString>;
  workerRuntimeInstall: Type.TOptional<Type.TObject<{
    phase: Type.TUnion<[Type.TLiteral<"transferring">, Type.TLiteral<"installing">]>;
    transferredBytes: Type.TInteger;
    totalBytes: Type.TInteger;
    startedAtMs: Type.TInteger;
    updatedAtMs: Type.TInteger;
  }>>;
}>, Type.TObject<{
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  providerId: Type.TOptional<Type.TString>;
  profileId: Type.TOptional<Type.TString>;
  machine: Type.TOptional<Type.TObject<{
    class: Type.TOptional<Type.TString>;
    os: Type.TOptional<Type.TString>;
    osLabel: Type.TOptional<Type.TString>;
    cpu: Type.TOptional<Type.TInteger>;
    memoryGb: Type.TOptional<Type.TInteger>;
  }>>;
  state: Type.TLiteral<"syncing">;
  environmentId: Type.TString;
  workerBundleHash: Type.TString;
}>, Type.TObject<{
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  workspaceBaseManifestRef: Type.TString;
  remoteWorkspaceDir: Type.TString;
  providerId: Type.TOptional<Type.TString>;
  profileId: Type.TOptional<Type.TString>;
  machine: Type.TOptional<Type.TObject<{
    class: Type.TOptional<Type.TString>;
    os: Type.TOptional<Type.TString>;
    osLabel: Type.TOptional<Type.TString>;
    cpu: Type.TOptional<Type.TInteger>;
    memoryGb: Type.TOptional<Type.TInteger>;
  }>>;
  state: Type.TLiteral<"starting">;
  environmentId: Type.TString;
  workerBundleHash: Type.TString;
}>, Type.TObject<{
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  workspaceBaseManifestRef: Type.TString;
  remoteWorkspaceDir: Type.TString;
  lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
  lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
  diskSpace: Type.TOptional<Type.TObject<{
    status: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    availableBytes: Type.TInteger;
    totalBytes: Type.TInteger;
    observedAtMs: Type.TInteger;
  }>>;
  providerId: Type.TOptional<Type.TString>;
  profileId: Type.TOptional<Type.TString>;
  machine: Type.TOptional<Type.TObject<{
    class: Type.TOptional<Type.TString>;
    os: Type.TOptional<Type.TString>;
    osLabel: Type.TOptional<Type.TString>;
    cpu: Type.TOptional<Type.TInteger>;
    memoryGb: Type.TOptional<Type.TInteger>;
  }>>;
  workspaceResultConflict: Type.TOptional<Type.TObject<{
    paths: Type.TArray<Type.TString>;
    stagedResultRef: Type.TString;
    totalCount: Type.TOptional<Type.TInteger>;
  }>>;
  workspaceResultReconciling: Type.TOptional<Type.TLiteral<true>>;
  state: Type.TLiteral<"active">;
  environmentId: Type.TString;
  activeOwnerEpoch: Type.TInteger;
  workerBundleHash: Type.TString;
  runner: Type.TOptional<Type.TObject<{
    kind: Type.TLiteral<"device">;
    status: Type.TUnion<[Type.TLiteral<"available">, Type.TLiteral<"offline">]>;
    deviceId: Type.TOptional<Type.TString>;
  }>>;
  workerRuntimeInstall: Type.TOptional<Type.TObject<{
    phase: Type.TUnion<[Type.TLiteral<"transferring">, Type.TLiteral<"installing">]>;
    transferredBytes: Type.TInteger;
    totalBytes: Type.TInteger;
    startedAtMs: Type.TInteger;
    updatedAtMs: Type.TInteger;
  }>>;
}>, Type.TObject<{
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  workspaceBaseManifestRef: Type.TString;
  remoteWorkspaceDir: Type.TString;
  lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
  lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
  diskSpace: Type.TOptional<Type.TObject<{
    status: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    availableBytes: Type.TInteger;
    totalBytes: Type.TInteger;
    observedAtMs: Type.TInteger;
  }>>;
  providerId: Type.TOptional<Type.TString>;
  profileId: Type.TOptional<Type.TString>;
  machine: Type.TOptional<Type.TObject<{
    class: Type.TOptional<Type.TString>;
    os: Type.TOptional<Type.TString>;
    osLabel: Type.TOptional<Type.TString>;
    cpu: Type.TOptional<Type.TInteger>;
    memoryGb: Type.TOptional<Type.TInteger>;
  }>>;
  workspaceResultConflict: Type.TOptional<Type.TObject<{
    paths: Type.TArray<Type.TString>;
    stagedResultRef: Type.TString;
    totalCount: Type.TOptional<Type.TInteger>;
  }>>;
  workspaceResultReconciling: Type.TOptional<Type.TLiteral<true>>;
  state: Type.TLiteral<"draining">;
  environmentId: Type.TString;
  activeOwnerEpoch: Type.TInteger;
  workerBundleHash: Type.TString;
}>, Type.TObject<{
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  workspaceBaseManifestRef: Type.TString;
  remoteWorkspaceDir: Type.TString;
  lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
  lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
  diskSpace: Type.TOptional<Type.TObject<{
    status: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
    availableBytes: Type.TInteger;
    totalBytes: Type.TInteger;
    observedAtMs: Type.TInteger;
  }>>;
  providerId: Type.TOptional<Type.TString>;
  profileId: Type.TOptional<Type.TString>;
  machine: Type.TOptional<Type.TObject<{
    class: Type.TOptional<Type.TString>;
    os: Type.TOptional<Type.TString>;
    osLabel: Type.TOptional<Type.TString>;
    cpu: Type.TOptional<Type.TInteger>;
    memoryGb: Type.TOptional<Type.TInteger>;
  }>>;
  workspaceResultConflict: Type.TOptional<Type.TObject<{
    paths: Type.TArray<Type.TString>;
    stagedResultRef: Type.TString;
    totalCount: Type.TOptional<Type.TInteger>;
  }>>;
  state: Type.TLiteral<"reconciling">;
  environmentId: Type.TString;
  activeOwnerEpoch: Type.TInteger;
  workerBundleHash: Type.TString;
}>, Type.TObject<{
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
  lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
  providerId: Type.TOptional<Type.TString>;
  profileId: Type.TOptional<Type.TString>;
  machine: Type.TOptional<Type.TObject<{
    class: Type.TOptional<Type.TString>;
    os: Type.TOptional<Type.TString>;
    osLabel: Type.TOptional<Type.TString>;
    cpu: Type.TOptional<Type.TInteger>;
    memoryGb: Type.TOptional<Type.TInteger>;
  }>>;
  workspaceResultConflict: Type.TOptional<Type.TObject<{
    paths: Type.TArray<Type.TString>;
    stagedResultRef: Type.TString;
    totalCount: Type.TOptional<Type.TInteger>;
  }>>;
  environmentId: Type.TOptional<Type.TString>;
  activeOwnerEpoch: Type.TOptional<Type.TInteger>;
  workspaceBaseManifestRef: Type.TOptional<Type.TString>;
  remoteWorkspaceDir: Type.TOptional<Type.TString>;
  workerBundleHash: Type.TOptional<Type.TString>;
  terminalReason: Type.TOptional<Type.TString>;
  terminalAtMs: Type.TOptional<Type.TInteger>;
  state: Type.TLiteral<"reclaimed">;
}>, Type.TObject<{
  generation: Type.TInteger;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  stateChangedAtMs: Type.TInteger;
  lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
  lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
  providerId: Type.TOptional<Type.TString>;
  profileId: Type.TOptional<Type.TString>;
  machine: Type.TOptional<Type.TObject<{
    class: Type.TOptional<Type.TString>;
    os: Type.TOptional<Type.TString>;
    osLabel: Type.TOptional<Type.TString>;
    cpu: Type.TOptional<Type.TInteger>;
    memoryGb: Type.TOptional<Type.TInteger>;
  }>>;
  workspaceResultConflict: Type.TOptional<Type.TObject<{
    paths: Type.TArray<Type.TString>;
    stagedResultRef: Type.TString;
    totalCount: Type.TOptional<Type.TInteger>;
  }>>;
  environmentId: Type.TOptional<Type.TString>;
  activeOwnerEpoch: Type.TOptional<Type.TInteger>;
  workspaceBaseManifestRef: Type.TOptional<Type.TString>;
  remoteWorkspaceDir: Type.TOptional<Type.TString>;
  workerBundleHash: Type.TOptional<Type.TString>;
  terminalReason: Type.TOptional<Type.TString>;
  terminalAtMs: Type.TOptional<Type.TInteger>;
  state: Type.TLiteral<"failed">;
  recoveryError: Type.TString;
  recoveryAction: Type.TOptional<Type.TEnum<["restart", "stop-first"]>>;
  retryOnSend: Type.TOptional<Type.TLiteral<true>>;
}>]>;
/** Stops a worker or explicitly recovers one failed placement onto the Gateway. */
declare const SessionsReclaimParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  recoverToGateway: Type.TOptional<Type.TObject<{
    expectedGeneration: Type.TInteger;
  }>>;
}>;
/** Closed destination union for session placement moves. */
declare const SessionMoveTargetSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"gateway">;
}>, Type.TObject<{
  kind: Type.TLiteral<"profile">;
  profileId: Type.TString;
  machineClass: Type.TOptional<Type.TString>;
  os: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  kind: Type.TLiteral<"device">;
  deviceId: Type.TString;
}>]>;
/** Durable operator-visible progress for one placement move intent. */
declare const SessionPlacementMoveSchema: Type.TObject<{
  target: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"gateway">;
  }>, Type.TObject<{
    kind: Type.TLiteral<"profile">;
    profileId: Type.TString;
    machineClass: Type.TOptional<Type.TString>;
    os: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"device">;
    deviceId: Type.TString;
  }>]>;
  updatedAtMs: Type.TInteger;
  error: Type.TOptional<Type.TString>;
}>;
type SessionPlacement = Static<typeof SessionPlacementSchema>;
type SessionPlacementDiskSpace = Static<typeof SessionPlacementDiskSpaceSchema>;
type SessionPlacementWorkerRuntimeInstall = Static<typeof SessionPlacementWorkerRuntimeInstallSchema>;
type SessionPlacementRunner = Static<typeof SessionPlacementRunnerSchema>;
type SessionPlacementMachine = Static<typeof SessionPlacementMachineSchema>;
type SessionsReclaimParams = Static<typeof SessionsReclaimParamsSchema>;
type SessionMoveTarget = Static<typeof SessionMoveTargetSchema>;
type SessionPlacementMove = Static<typeof SessionPlacementMoveSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/frames.d.ts
/** Initial client hello/connect payload sent before the gateway accepts frames. */
declare const ConnectParamsSchema: Type.TObject<{
  minProtocol: Type.TInteger;
  maxProtocol: Type.TInteger;
  client: Type.TObject<{
    id: Type.TEnum<["openclaw-android", "openclaw-browser-copilot", "cli", "openclaw-control-ui", "fingerprint", "gateway-client", "openclaw-ios", "openclaw-linux", "openclaw-macos", "node-host", "openclaw-probe", "test", "openclaw-tui", "openclaw-watchos", "webchat", "webchat-ui", "openclaw-worker"]>;
    displayName: Type.TOptional<Type.TString>;
    version: Type.TString;
    buildId: Type.TOptional<Type.TString>;
    platform: Type.TString;
    deviceFamily: Type.TOptional<Type.TString>;
    modelIdentifier: Type.TOptional<Type.TString>;
    /** Self-reported IANA zone. Bounded because the longest real name is well under this cap. */
    timeZone: Type.TOptional<Type.TString>;
    mode: Type.TEnum<["backend", "cli", "node", "probe", "test", "ui", "webchat", "worker"]>;
    instanceId: Type.TOptional<Type.TString>;
  }>;
  caps: Type.TOptional<Type.TArray<Type.TString>>;
  commands: Type.TOptional<Type.TArray<Type.TString>>;
  /** Additive Computer Use declaration; the owning core contract validates its bounded shape. */
  computerUse: Type.TOptional<Type.TUnknown>;
  /** @deprecated Accepted for the shipped v1 node-host envelope; current hosts use runner inventory. */
  workerRuns: Type.TOptional<Type.TObject<{
    bundleHash: Type.TString;
    openclawVersion: Type.TString;
    protocolFeatures: Type.TArray<Type.TString>;
    bundlePrewarm: Type.TOptional<Type.TInteger>;
  }>>;
  permissions: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
  pathEnv: Type.TOptional<Type.TString>;
  role: Type.TOptional<Type.TString>;
  scopes: Type.TOptional<Type.TArray<Type.TString>>;
  /** Initial catalog read scope; method authorization still owns access. */
  modelCatalog: Type.TOptional<Type.TUnion<[Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    shortId: Type.TString;
    slugHint: Type.TOptional<Type.TString>;
  }>]>>;
  device: Type.TOptional<Type.TObject<{
    id: Type.TString;
    publicKey: Type.TString;
    signature: Type.TString;
    signedAt: Type.TInteger;
    nonce: Type.TString;
  }>>;
  auth: Type.TOptional<Type.TObject<{
    token: Type.TOptional<Type.TString>;
    bootstrapToken: Type.TOptional<Type.TString>;
    deviceToken: Type.TOptional<Type.TString>;
    password: Type.TOptional<Type.TString>;
    approvalRuntimeToken: Type.TOptional<Type.TString>;
    agentRuntimeIdentityToken: Type.TOptional<Type.TString>;
  }>>;
  locale: Type.TOptional<Type.TString>;
  userAgent: Type.TOptional<Type.TString>;
}>;
/** Standard structured error shape used in response frames and connect failures. */
declare const ErrorShapeSchema: Type.TObject<{
  code: Type.TString;
  message: Type.TString;
  details: Type.TOptional<Type.TUnknown>;
  retryable: Type.TOptional<Type.TBoolean>;
  retryAfterMs: Type.TOptional<Type.TInteger>;
}>;
/** Client request frame envelope; `method` selects the payload validator. */
declare const RequestFrameSchema: Type.TObject<{
  type: Type.TLiteral<"req">;
  id: Type.TString;
  method: Type.TString;
  params: Type.TOptional<Type.TUnknown>;
  traceparent: Type.TOptional<Type.TString>;
  expectedProfileId: Type.TOptional<Type.TString>;
}>;
declare const ResponseFrameSchema: Type.TObject<{
  type: Type.TLiteral<"res">;
  id: Type.TString;
  ok: Type.TBoolean;
  payload: Type.TOptional<Type.TUnknown>;
  error: Type.TOptional<Type.TObject<{
    code: Type.TString;
    message: Type.TString;
    details: Type.TOptional<Type.TUnknown>;
    retryable: Type.TOptional<Type.TBoolean>;
    retryAfterMs: Type.TOptional<Type.TInteger>;
  }>>;
}>;
type ConnectParams = Static<typeof ConnectParamsSchema>;
type ErrorShape = Static<typeof ErrorShapeSchema>;
type RequestFrame = Static<typeof RequestFrameSchema>;
type ResponseFrame = Static<typeof ResponseFrameSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/session-github-publication.d.ts
declare const GitHubPublicationPublisherSchema: Type.TObject<{
  accountId: Type.TInteger;
  login: Type.TString;
  source: Type.TUnion<[Type.TLiteral<"personal">, Type.TLiteral<"system-detected">, Type.TLiteral<"system-configured">, Type.TLiteral<"agent-override">]>;
}>;
declare const SessionGitHubPublishParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
  title: Type.TOptional<Type.TString>;
  body: Type.TOptional<Type.TString>;
  selection: Type.TOptional<Type.TUnion<[Type.TObject<{
    source: Type.TLiteral<"shared">;
    expected: Type.TOptional<Type.TObject<{
      accountId: Type.TInteger;
      login: Type.TString;
      source: Type.TUnion<[Type.TLiteral<"system-detected">, Type.TLiteral<"system-configured">, Type.TLiteral<"agent-override">]>;
    }>>;
  }>, Type.TObject<{
    source: Type.TLiteral<"personal">;
    generation: Type.TString;
    account: Type.TObject<{
      accountId: Type.TInteger;
      login: Type.TString;
    }>;
  }>]>>;
}>;
declare const SessionGitHubPublicationResultSchema: Type.TUnion<[Type.TObject<{
  requestId: Type.TString;
  publisher: Type.TOptional<Type.TObject<{
    accountId: Type.TInteger;
    login: Type.TString;
    source: Type.TUnion<[Type.TLiteral<"personal">, Type.TLiteral<"system-detected">, Type.TLiteral<"system-configured">, Type.TLiteral<"agent-override">]>;
  }>>;
  effect: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"push">, Type.TLiteral<"pull_request">]>;
    status: Type.TUnion<[Type.TLiteral<"dispatched">, Type.TLiteral<"observed">]>;
    headCommit: Type.TOptional<Type.TString>;
    url: Type.TOptional<Type.TString>;
  }>>;
  status: Type.TLiteral<"requested">;
  message: Type.TString;
}>, Type.TObject<{
  requestId: Type.TString;
  publisher: Type.TOptional<Type.TObject<{
    accountId: Type.TInteger;
    login: Type.TString;
    source: Type.TUnion<[Type.TLiteral<"personal">, Type.TLiteral<"system-detected">, Type.TLiteral<"system-configured">, Type.TLiteral<"agent-override">]>;
  }>>;
  effect: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"push">, Type.TLiteral<"pull_request">]>;
    status: Type.TUnion<[Type.TLiteral<"dispatched">, Type.TLiteral<"observed">]>;
    headCommit: Type.TOptional<Type.TString>;
    url: Type.TOptional<Type.TString>;
  }>>;
  status: Type.TLiteral<"publishing">;
  message: Type.TString;
}>, Type.TObject<{
  requestId: Type.TString;
  publisher: Type.TOptional<Type.TObject<{
    accountId: Type.TInteger;
    login: Type.TString;
    source: Type.TUnion<[Type.TLiteral<"personal">, Type.TLiteral<"system-detected">, Type.TLiteral<"system-configured">, Type.TLiteral<"agent-override">]>;
  }>>;
  effect: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"push">, Type.TLiteral<"pull_request">]>;
    status: Type.TUnion<[Type.TLiteral<"dispatched">, Type.TLiteral<"observed">]>;
    headCommit: Type.TOptional<Type.TString>;
    url: Type.TOptional<Type.TString>;
  }>>;
  status: Type.TLiteral<"published">;
  url: Type.TString;
  repository: Type.TString;
  branch: Type.TString;
  headCommit: Type.TString;
}>, Type.TObject<{
  requestId: Type.TString;
  publisher: Type.TOptional<Type.TObject<{
    accountId: Type.TInteger;
    login: Type.TString;
    source: Type.TUnion<[Type.TLiteral<"personal">, Type.TLiteral<"system-detected">, Type.TLiteral<"system-configured">, Type.TLiteral<"agent-override">]>;
  }>>;
  effect: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"push">, Type.TLiteral<"pull_request">]>;
    status: Type.TUnion<[Type.TLiteral<"dispatched">, Type.TLiteral<"observed">]>;
    headCommit: Type.TOptional<Type.TString>;
    url: Type.TOptional<Type.TString>;
  }>>;
  status: Type.TLiteral<"failed">;
  code: Type.TUnion<[Type.TLiteral<"identity_changed">, Type.TLiteral<"identity_unavailable">, Type.TLiteral<"session_changed">, Type.TLiteral<"workspace_changed">, Type.TLiteral<"not_git">, Type.TLiteral<"not_github">, Type.TLiteral<"no_changes">, Type.TLiteral<"push_rejected">, Type.TLiteral<"github_rejected">, Type.TLiteral<"unavailable">]>;
  message: Type.TString;
  nextAction: Type.TString;
}>, Type.TObject<{
  requestId: Type.TString;
  publisher: Type.TOptional<Type.TObject<{
    accountId: Type.TInteger;
    login: Type.TString;
    source: Type.TUnion<[Type.TLiteral<"personal">, Type.TLiteral<"system-detected">, Type.TLiteral<"system-configured">, Type.TLiteral<"agent-override">]>;
  }>>;
  effect: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"push">, Type.TLiteral<"pull_request">]>;
    status: Type.TUnion<[Type.TLiteral<"dispatched">, Type.TLiteral<"observed">]>;
    headCommit: Type.TOptional<Type.TString>;
    url: Type.TOptional<Type.TString>;
  }>>;
  status: Type.TLiteral<"needs_confirmation">;
  message: Type.TString;
}>]>;
type GitHubPublicationPublisher = Static<typeof GitHubPublicationPublisherSchema>;
type SessionGitHubPublishParams = Static<typeof SessionGitHubPublishParamsSchema>;
type SessionGitHubPublicationResult = Static<typeof SessionGitHubPublicationResultSchema>;
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
//#region packages/gateway-protocol/src/schema/model-catalog.d.ts
/** Model catalog request with optional visibility scope. */
declare const ModelsListParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  authProfileId: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  includeDetails: Type.TOptional<Type.TBoolean>;
  includeProviderCapabilities: Type.TOptional<Type.TBoolean>;
  /** Include global default-model previews, independent of agent/session overrides. */
  includeDefaultModels: Type.TOptional<Type.TBoolean>;
  /** Reuse prepared/cached facts without starting provider discovery. */
  preparedOnly: Type.TOptional<Type.TBoolean>;
  /** Force replacement of a completed full-catalog generation. */
  refresh: Type.TOptional<Type.TBoolean>;
  view: Type.TOptional<Type.TUnion<[Type.TLiteral<"default">, Type.TLiteral<"configured">, Type.TLiteral<"provider-config">, Type.TLiteral<"all">]>>;
}>;
declare const ModelChoiceSchema: Type.TObject<{
  available: Type.TOptional<Type.TBoolean>;
  /** Scoped manual-choice permission; separate from runtime readiness and automatic selection. */
  manualSelectionAllowed: Type.TOptional<Type.TBoolean>;
  unavailableReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"missing-auth">, Type.TLiteral<"auth-failed">, Type.TLiteral<"cooldown">]>>;
  /** Earliest known retry time in epoch milliseconds, only for unavailable models. */
  unavailableUntil: Type.TOptional<Type.TInteger>;
  contextWindow: Type.TOptional<Type.TInteger>;
  contextTokens: Type.TOptional<Type.TInteger>;
  local: Type.TOptional<Type.TBoolean>;
  contextWindows: Type.TOptional<Type.TArray<Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    contextWindow: Type.TInteger;
  }>>>;
  contextWindowDefault: Type.TOptional<Type.TString>;
  reasoning: Type.TOptional<Type.TBoolean>;
  thinkingLevels: Type.TOptional<Type.TArray<Type.TObject<{
    id: Type.TString;
    label: Type.TString;
  }>>>;
  thinkingDefault: Type.TOptional<Type.TString>;
  effectiveFastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">, Type.TLiteral<"ultrafast">]>>;
  /** Account-scoped service tiers advertised for this selected runtime. Missing means unknown. */
  serviceTiers: Type.TOptional<Type.TArray<Type.TString>>;
  /** Local selected-request applicability, not preference or upstream fulfillment. */
  supportsFastMode: Type.TOptional<Type.TBoolean>;
  supportsTools: Type.TOptional<Type.TBoolean>;
  input: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"image">, Type.TLiteral<"audio">, Type.TLiteral<"video">, Type.TLiteral<"document">]>>>;
  id: Type.TString;
  name: Type.TString;
  provider: Type.TString;
  alias: Type.TOptional<Type.TString>;
  tags: Type.TOptional<Type.TArray<Type.TString>>;
  agentRuntime: Type.TOptional<Type.TObject<{
    id: Type.TString;
    fallback: Type.TOptional<Type.TUnion<[Type.TLiteral<"openclaw">, Type.TLiteral<"none">]>>;
    cloudPlacementSupported: Type.TOptional<Type.TBoolean>;
    cloudPlacementExecutionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"worker-turn">, Type.TLiteral<"remote-exec">]>>;
    devicePlacement: Type.TOptional<Type.TObject<{
      requiredNodeCommands: Type.TArray<Type.TString>;
      consumesWorkerSlot: Type.TBoolean;
    }>>;
    devicePlacementSupported: Type.TOptional<Type.TBoolean>;
    source: Type.TUnion<[Type.TLiteral<"env">, Type.TLiteral<"agent">, Type.TLiteral<"defaults">, Type.TLiteral<"model">, Type.TLiteral<"provider">, Type.TLiteral<"implicit">, Type.TLiteral<"session">, Type.TLiteral<"session-key">]>;
  }>>;
  apiKeySupported: Type.TOptional<Type.TBoolean>;
  runtimeChoices: Type.TOptional<Type.TArray<Type.TObject<{
    available: Type.TOptional<Type.TBoolean>;
    /** Scoped manual-choice permission; separate from runtime readiness and automatic selection. */
    manualSelectionAllowed: Type.TOptional<Type.TBoolean>;
    /** Earliest known retry time in epoch milliseconds, only for unavailable models. */
    unavailableUntil: Type.TOptional<Type.TInteger>;
    contextWindow: Type.TOptional<Type.TInteger>;
    contextTokens: Type.TOptional<Type.TInteger>;
    local: Type.TOptional<Type.TBoolean>;
    contextWindows: Type.TOptional<Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
      contextWindow: Type.TInteger;
    }>>>;
    contextWindowDefault: Type.TOptional<Type.TString>;
    reasoning: Type.TOptional<Type.TBoolean>;
    thinkingLevels: Type.TOptional<Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
    }>>>;
    thinkingDefault: Type.TOptional<Type.TString>;
    effectiveFastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">, Type.TLiteral<"ultrafast">]>>;
    /** Account-scoped service tiers advertised for this selected runtime. Missing means unknown. */
    serviceTiers: Type.TOptional<Type.TArray<Type.TString>>;
    /** Local selected-request applicability, not preference or upstream fulfillment. */
    supportsFastMode: Type.TOptional<Type.TBoolean>;
    supportsTools: Type.TOptional<Type.TBoolean>;
    input: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"image">, Type.TLiteral<"audio">, Type.TLiteral<"video">, Type.TLiteral<"document">]>>>;
    agentRuntime: Type.TObject<{
      id: Type.TString;
      fallback: Type.TOptional<Type.TUnion<[Type.TLiteral<"openclaw">, Type.TLiteral<"none">]>>;
      cloudPlacementSupported: Type.TOptional<Type.TBoolean>;
      cloudPlacementExecutionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"worker-turn">, Type.TLiteral<"remote-exec">]>>;
      devicePlacement: Type.TOptional<Type.TObject<{
        requiredNodeCommands: Type.TArray<Type.TString>;
        consumesWorkerSlot: Type.TBoolean;
      }>>;
      devicePlacementSupported: Type.TOptional<Type.TBoolean>;
      source: Type.TUnion<[Type.TLiteral<"env">, Type.TLiteral<"agent">, Type.TLiteral<"defaults">, Type.TLiteral<"model">, Type.TLiteral<"provider">, Type.TLiteral<"implicit">, Type.TLiteral<"session">, Type.TLiteral<"session-key">]>;
    }>;
    unavailableReason: Type.TOptional<Type.TUnion<[Type.TUnion<[Type.TLiteral<"missing-auth">, Type.TLiteral<"auth-failed">, Type.TLiteral<"cooldown">]>, Type.TLiteral<"unsupported-runtime">]>>;
  }>>>;
}>;
declare const ModelsListResultSchema: Type.TObject<{
  models: Type.TArray<Type.TObject<{
    available: Type.TOptional<Type.TBoolean>;
    /** Scoped manual-choice permission; separate from runtime readiness and automatic selection. */
    manualSelectionAllowed: Type.TOptional<Type.TBoolean>;
    unavailableReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"missing-auth">, Type.TLiteral<"auth-failed">, Type.TLiteral<"cooldown">]>>;
    /** Earliest known retry time in epoch milliseconds, only for unavailable models. */
    unavailableUntil: Type.TOptional<Type.TInteger>;
    contextWindow: Type.TOptional<Type.TInteger>;
    contextTokens: Type.TOptional<Type.TInteger>;
    local: Type.TOptional<Type.TBoolean>;
    contextWindows: Type.TOptional<Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
      contextWindow: Type.TInteger;
    }>>>;
    contextWindowDefault: Type.TOptional<Type.TString>;
    reasoning: Type.TOptional<Type.TBoolean>;
    thinkingLevels: Type.TOptional<Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
    }>>>;
    thinkingDefault: Type.TOptional<Type.TString>;
    effectiveFastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">, Type.TLiteral<"ultrafast">]>>;
    /** Account-scoped service tiers advertised for this selected runtime. Missing means unknown. */
    serviceTiers: Type.TOptional<Type.TArray<Type.TString>>;
    /** Local selected-request applicability, not preference or upstream fulfillment. */
    supportsFastMode: Type.TOptional<Type.TBoolean>;
    supportsTools: Type.TOptional<Type.TBoolean>;
    input: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"image">, Type.TLiteral<"audio">, Type.TLiteral<"video">, Type.TLiteral<"document">]>>>;
    id: Type.TString;
    name: Type.TString;
    provider: Type.TString;
    alias: Type.TOptional<Type.TString>;
    tags: Type.TOptional<Type.TArray<Type.TString>>;
    agentRuntime: Type.TOptional<Type.TObject<{
      id: Type.TString;
      fallback: Type.TOptional<Type.TUnion<[Type.TLiteral<"openclaw">, Type.TLiteral<"none">]>>;
      cloudPlacementSupported: Type.TOptional<Type.TBoolean>;
      cloudPlacementExecutionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"worker-turn">, Type.TLiteral<"remote-exec">]>>;
      devicePlacement: Type.TOptional<Type.TObject<{
        requiredNodeCommands: Type.TArray<Type.TString>;
        consumesWorkerSlot: Type.TBoolean;
      }>>;
      devicePlacementSupported: Type.TOptional<Type.TBoolean>;
      source: Type.TUnion<[Type.TLiteral<"env">, Type.TLiteral<"agent">, Type.TLiteral<"defaults">, Type.TLiteral<"model">, Type.TLiteral<"provider">, Type.TLiteral<"implicit">, Type.TLiteral<"session">, Type.TLiteral<"session-key">]>;
    }>>;
    apiKeySupported: Type.TOptional<Type.TBoolean>;
    runtimeChoices: Type.TOptional<Type.TArray<Type.TObject<{
      available: Type.TOptional<Type.TBoolean>;
      /** Scoped manual-choice permission; separate from runtime readiness and automatic selection. */
      manualSelectionAllowed: Type.TOptional<Type.TBoolean>;
      /** Earliest known retry time in epoch milliseconds, only for unavailable models. */
      unavailableUntil: Type.TOptional<Type.TInteger>;
      contextWindow: Type.TOptional<Type.TInteger>;
      contextTokens: Type.TOptional<Type.TInteger>;
      local: Type.TOptional<Type.TBoolean>;
      contextWindows: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TString;
        label: Type.TString;
        contextWindow: Type.TInteger;
      }>>>;
      contextWindowDefault: Type.TOptional<Type.TString>;
      reasoning: Type.TOptional<Type.TBoolean>;
      thinkingLevels: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TString;
        label: Type.TString;
      }>>>;
      thinkingDefault: Type.TOptional<Type.TString>;
      effectiveFastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">, Type.TLiteral<"ultrafast">]>>;
      /** Account-scoped service tiers advertised for this selected runtime. Missing means unknown. */
      serviceTiers: Type.TOptional<Type.TArray<Type.TString>>;
      /** Local selected-request applicability, not preference or upstream fulfillment. */
      supportsFastMode: Type.TOptional<Type.TBoolean>;
      supportsTools: Type.TOptional<Type.TBoolean>;
      input: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"image">, Type.TLiteral<"audio">, Type.TLiteral<"video">, Type.TLiteral<"document">]>>>;
      agentRuntime: Type.TObject<{
        id: Type.TString;
        fallback: Type.TOptional<Type.TUnion<[Type.TLiteral<"openclaw">, Type.TLiteral<"none">]>>;
        cloudPlacementSupported: Type.TOptional<Type.TBoolean>;
        cloudPlacementExecutionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"worker-turn">, Type.TLiteral<"remote-exec">]>>;
        devicePlacement: Type.TOptional<Type.TObject<{
          requiredNodeCommands: Type.TArray<Type.TString>;
          consumesWorkerSlot: Type.TBoolean;
        }>>;
        devicePlacementSupported: Type.TOptional<Type.TBoolean>;
        source: Type.TUnion<[Type.TLiteral<"env">, Type.TLiteral<"agent">, Type.TLiteral<"defaults">, Type.TLiteral<"model">, Type.TLiteral<"provider">, Type.TLiteral<"implicit">, Type.TLiteral<"session">, Type.TLiteral<"session-key">]>;
      }>;
      unavailableReason: Type.TOptional<Type.TUnion<[Type.TUnion<[Type.TLiteral<"missing-auth">, Type.TLiteral<"auth-failed">, Type.TLiteral<"cooldown">]>, Type.TLiteral<"unsupported-runtime">]>>;
    }>>>;
  }>>;
  /** The Gateway owns role restrictions and the effective permitted reset target. */
  modelSelectionPolicy: Type.TOptional<Type.TObject<{
    restricted: Type.TLiteral<true>;
    defaultModel: Type.TUnion<[Type.TString, Type.TNull]>;
  }>>;
  /** Manifest-owned decision choices, separate from conversational model routing. */
  decisionModels: Type.TOptional<Type.TArray<Type.TObject<{
    id: Type.TString;
    provider: Type.TString;
    name: Type.TString;
    pluginId: Type.TString;
    capabilities: Type.TOptional<Type.TObject<{
      questionTypes: Type.TArray<Type.TUnion<[Type.TLiteral<"boolean">, Type.TLiteral<"choice">, Type.TLiteral<"score">]>>;
      maxQuestions: Type.TOptional<Type.TInteger>;
      maxChoiceAlternatives: Type.TOptional<Type.TInteger>;
      maxScoreLevels: Type.TOptional<Type.TInteger>;
      maxInputTokens: Type.TOptional<Type.TInteger>;
      inputTokenScope: Type.TOptional<Type.TUnion<[Type.TLiteral<"encoded-question">, Type.TLiteral<"state-plus-each-criterion">]>>;
      requiresBooleanCriteria: Type.TOptional<Type.TBoolean>;
      confidence: Type.TOptional<Type.TUnion<[Type.TLiteral<"provider-specific">, Type.TLiteral<"none">]>>;
    }>>;
  }>>>;
  defaultModels: Type.TOptional<Type.TObject<{
    /** Auto preview from agents.defaults.model, even when utility routing is explicit or disabled. */
    automaticUtilityModel: Type.TUnion<[Type.TString, Type.TNull]>;
    /** Route the utility model in effect (automatic or explicit) runs on; absent when disabled. */
    utilityRuntime: Type.TOptional<Type.TObject<{
      id: Type.TString;
      kind: Type.TUnion<[Type.TLiteral<"api">, Type.TLiteral<"cli">, Type.TLiteral<"harness">]>;
      label: Type.TString;
    }>>;
  }>>;
  refreshFailed: Type.TOptional<Type.TBoolean>;
  pendingProviders: Type.TOptional<Type.TArray<Type.TString>>;
  accountSelection: Type.TOptional<Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"automatic">;
    label: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"personal">;
    label: Type.TString;
    authProfileId: Type.TOptional<Type.TString>;
    source: Type.TOptional<Type.TUnion<[Type.TLiteral<"auto">, Type.TLiteral<"user">, Type.TLiteral<"user-link">]>>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"shared">;
    label: Type.TString;
    authProfileId: Type.TString;
    source: Type.TOptional<Type.TUnion<[Type.TLiteral<"auto">, Type.TLiteral<"user">, Type.TLiteral<"user-link">]>>;
  }>]>>;
  providerOutcomes: Type.TOptional<Type.TArray<Type.TObject<{
    provider: Type.TString;
    profileId: Type.TOptional<Type.TString>;
    status: Type.TUnion<[Type.TLiteral<"ready">, Type.TLiteral<"auth-rejected">, Type.TLiteral<"unavailable">]>;
  }>>>;
}>;
type ModelChoice = Static<typeof ModelChoiceSchema>;
type ModelsListResult = Static<typeof ModelsListResultSchema>;
type ModelsListParams = Static<typeof ModelsListParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-inference.d.ts
declare const WorkerInferenceStartParamsSchema: Type.TObject<{
  runEpoch: Type.TInteger;
  sessionId: Type.TString;
  runId: Type.TString;
  turnId: Type.TString;
  modelRef: Type.TObject<{
    provider: Type.TString;
    model: Type.TString;
  }>;
  context: Type.TObject<{
    systemPrompt: Type.TOptional<Type.TString>;
    messages: Type.TArray<Type.TUnion<[Type.TObject<{
      role: Type.TLiteral<"user">;
      content: Type.TUnion<[Type.TString, Type.TArray<Type.TObject<{
        type: Type.TLiteral<"text">;
        text: Type.TString;
        textSignature: Type.TOptional<Type.TString>;
      }>>]>;
      timestamp: Type.TInteger;
      runtimeContext: Type.TObject<{
        retained: Type.TOptional<Type.TBoolean>;
      }>;
    }>, Type.TObject<{
      role: Type.TLiteral<"user">;
      content: Type.TUnion<[Type.TString, Type.TArray<Type.TUnion<[Type.TObject<{
        type: Type.TLiteral<"text">;
        text: Type.TString;
        textSignature: Type.TOptional<Type.TString>;
      }>, Type.TObject<{
        type: Type.TLiteral<"image">;
        data: Type.TString;
        mimeType: Type.TString;
      }>]>>]>;
      timestamp: Type.TInteger;
    }>, Type.TObject<{
      role: Type.TLiteral<"assistant">;
      content: Type.TArray<Type.TUnion<[Type.TObject<{
        type: Type.TLiteral<"text">;
        text: Type.TString;
        textSignature: Type.TOptional<Type.TString>;
      }>, Type.TObject<{
        type: Type.TLiteral<"thinking">;
        thinking: Type.TString;
        thinkingSignature: Type.TOptional<Type.TString>;
        redacted: Type.TOptional<Type.TBoolean>;
      }>, Type.TObject<{
        type: Type.TLiteral<"toolCall">;
        id: Type.TString;
        name: Type.TString;
        arguments: Type.TRecord<"^.*$", Type.TUnknown>;
        thoughtSignature: Type.TOptional<Type.TString>;
        executionMode: Type.TOptional<Type.TEnum<["sequential", "parallel"]>>;
      }>]>>;
      api: Type.TString;
      provider: Type.TString;
      model: Type.TString;
      responseModel: Type.TOptional<Type.TString>;
      responseId: Type.TOptional<Type.TString>;
      providerReplay: Type.TOptional<Type.TObject<{
        v: Type.TLiteral<1>;
        type: Type.TString;
        id: Type.TOptional<Type.TString>;
        data: Type.TString;
        replayIndex: Type.TOptional<Type.TInteger>;
        provider: Type.TString;
        api: Type.TString;
        model: Type.TString;
        baseUrlHash: Type.TOptional<Type.TString>;
        sessionHash: Type.TOptional<Type.TString>;
        authProfileHash: Type.TOptional<Type.TString>;
      }>>;
      usage: Type.TObject<{
        input: Type.TNumber;
        output: Type.TNumber;
        cacheRead: Type.TNumber;
        cacheWrite: Type.TNumber;
        contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
          state: Type.TLiteral<"available">;
          promptTokens: Type.TNumber;
          totalTokens: Type.TNumber;
        }>, Type.TObject<{
          state: Type.TLiteral<"unavailable">;
        }>]>>;
        totalTokens: Type.TNumber;
        cost: Type.TObject<{
          input: Type.TNumber;
          output: Type.TNumber;
          cacheRead: Type.TNumber;
          cacheWrite: Type.TNumber;
          total: Type.TNumber;
          totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
        }>;
      }>;
      timestamp: Type.TInteger;
      diagnostics: Type.TOptional<Type.TArray<Type.TObject<{
        type: Type.TString;
        timestamp: Type.TInteger;
        error: Type.TOptional<Type.TObject<{
          name: Type.TOptional<Type.TString>;
          message: Type.TString;
          stack: Type.TOptional<Type.TString>;
          code: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
        }>>;
        details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
      }>>>;
      stopReason: Type.TEnum<["stop", "length", "toolUse", "error", "aborted"]>;
      errorMessage: Type.TOptional<Type.TString>;
      errorCode: Type.TOptional<Type.TString>;
      errorType: Type.TOptional<Type.TString>;
      errorBody: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      role: Type.TLiteral<"toolResult">;
      toolCallId: Type.TString;
      toolName: Type.TString;
      content: Type.TArray<Type.TUnion<[Type.TObject<{
        type: Type.TLiteral<"text">;
        text: Type.TString;
        textSignature: Type.TOptional<Type.TString>;
      }>, Type.TObject<{
        type: Type.TLiteral<"image">;
        data: Type.TString;
        mimeType: Type.TString;
      }>]>>;
      details: Type.TOptional<Type.TUnknown>;
      isError: Type.TBoolean;
      timestamp: Type.TInteger;
    }>]>>;
    tools: Type.TOptional<Type.TArray<Type.TObject<{
      name: Type.TString;
      description: Type.TString;
      parameters: Type.TUnknown;
    }>>>;
  }>;
  options: Type.TObject<{
    temperature: Type.TOptional<Type.TNumber>;
    maxTokens: Type.TOptional<Type.TInteger>;
    reasoning: Type.TOptional<Type.TEnum<["off", "minimal", "low", "medium", "high", "xhigh", "adaptive", "max"]>>;
    thinkingBudgets: Type.TOptional<Type.TObject<{
      minimal: Type.TOptional<Type.TInteger>;
      low: Type.TOptional<Type.TInteger>;
      medium: Type.TOptional<Type.TInteger>;
      high: Type.TOptional<Type.TInteger>;
      max: Type.TOptional<Type.TInteger>;
    }>>;
  }>;
}>;
declare const WorkerInferenceStartResultSchema: Type.TObject<{
  status: Type.TEnum<["accepted", "replayed"]>;
}>;
declare const WorkerInferenceErrorReasonSchema: Type.TEnum<["model-not-approved", "invalid-context", "epoch-mismatch", "session-not-attached", "provider-error", "cancelled"]>;
declare const WorkerInferenceCancelParamsSchema: Type.TObject<{
  runEpoch: Type.TInteger;
  sessionId: Type.TString;
  runId: Type.TString;
  turnId: Type.TString;
}>;
declare const WorkerInferenceCancelResultSchema: Type.TObject<{
  status: Type.TLiteral<"cancelled">;
}>;
declare const WorkerInferenceEventParamsSchema: Type.TObject<{
  runEpoch: Type.TInteger;
  sessionId: Type.TString;
  runId: Type.TString;
  turnId: Type.TString;
  seq: Type.TInteger;
  event: Type.TUnion<[Type.TObject<{
    type: Type.TLiteral<"start">;
    resolvedModel: Type.TObject<{
      api: Type.TString;
      provider: Type.TString;
      model: Type.TString;
    }>;
    timestamp: Type.TInteger;
  }>, Type.TObject<{
    type: Type.TLiteral<"text_start">;
    contentIndex: Type.TInteger;
  } & {
    contentSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    type: Type.TLiteral<"text_delta">;
    contentIndex: Type.TInteger;
  } & {
    delta: Type.TString;
  }>, Type.TObject<{
    type: Type.TLiteral<"text_end">;
    contentIndex: Type.TInteger;
  } & {
    contentSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    type: Type.TLiteral<"thinking_start">;
    contentIndex: Type.TInteger;
  }>, Type.TObject<{
    type: Type.TLiteral<"thinking_delta">;
    contentIndex: Type.TInteger;
  } & {
    delta: Type.TString;
  }>, Type.TObject<{
    type: Type.TLiteral<"thinking_end">;
    contentIndex: Type.TInteger;
  } & {
    contentSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    type: Type.TLiteral<"toolcall_start">;
    contentIndex: Type.TInteger;
  } & {
    id: Type.TString;
    toolName: Type.TString;
  }>, Type.TObject<{
    type: Type.TLiteral<"toolcall_delta">;
    contentIndex: Type.TInteger;
  } & {
    delta: Type.TString;
  }>, Type.TObject<{
    type: Type.TLiteral<"toolcall_end">;
    contentIndex: Type.TInteger;
  }>]>;
}>;
declare const WorkerInferenceEventFrameSchema: Type.TObject<{
  type: Type.TLiteral<"event">;
  event: Type.TLiteral<"worker.inference.event">;
  payload: Type.TObject<{
    runEpoch: Type.TInteger;
    sessionId: Type.TString;
    runId: Type.TString;
    turnId: Type.TString;
    seq: Type.TInteger;
    event: Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"start">;
      resolvedModel: Type.TObject<{
        api: Type.TString;
        provider: Type.TString;
        model: Type.TString;
      }>;
      timestamp: Type.TInteger;
    }>, Type.TObject<{
      type: Type.TLiteral<"text_start">;
      contentIndex: Type.TInteger;
    } & {
      contentSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"text_delta">;
      contentIndex: Type.TInteger;
    } & {
      delta: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"text_end">;
      contentIndex: Type.TInteger;
    } & {
      contentSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"thinking_start">;
      contentIndex: Type.TInteger;
    }>, Type.TObject<{
      type: Type.TLiteral<"thinking_delta">;
      contentIndex: Type.TInteger;
    } & {
      delta: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"thinking_end">;
      contentIndex: Type.TInteger;
    } & {
      contentSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"toolcall_start">;
      contentIndex: Type.TInteger;
    } & {
      id: Type.TString;
      toolName: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"toolcall_delta">;
      contentIndex: Type.TInteger;
    } & {
      delta: Type.TString;
    }>, Type.TObject<{
      type: Type.TLiteral<"toolcall_end">;
      contentIndex: Type.TInteger;
    }>]>;
  }>;
}>;
declare const WorkerInferenceTerminalOutcomeSchema: Type.TUnion<[Type.TObject<{
  type: Type.TLiteral<"done">;
  message: Type.TObject<{
    role: Type.TLiteral<"assistant">;
    content: Type.TArray<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"text">;
      text: Type.TString;
      textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"thinking">;
      thinking: Type.TString;
      thinkingSignature: Type.TOptional<Type.TString>;
      redacted: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      type: Type.TLiteral<"toolCall">;
      id: Type.TString;
      name: Type.TString;
      arguments: Type.TRecord<"^.*$", Type.TUnknown>;
      thoughtSignature: Type.TOptional<Type.TString>;
      executionMode: Type.TOptional<Type.TEnum<["sequential", "parallel"]>>;
    }>]>>;
    api: Type.TString;
    provider: Type.TString;
    model: Type.TString;
    responseModel: Type.TOptional<Type.TString>;
    responseId: Type.TOptional<Type.TString>;
    providerReplay: Type.TOptional<Type.TObject<{
      v: Type.TLiteral<1>;
      type: Type.TString;
      id: Type.TOptional<Type.TString>;
      data: Type.TString;
      replayIndex: Type.TOptional<Type.TInteger>;
      provider: Type.TString;
      api: Type.TString;
      model: Type.TString;
      baseUrlHash: Type.TOptional<Type.TString>;
      sessionHash: Type.TOptional<Type.TString>;
      authProfileHash: Type.TOptional<Type.TString>;
    }>>;
    usage: Type.TObject<{
      input: Type.TNumber;
      output: Type.TNumber;
      cacheRead: Type.TNumber;
      cacheWrite: Type.TNumber;
      contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
        state: Type.TLiteral<"available">;
        promptTokens: Type.TNumber;
        totalTokens: Type.TNumber;
      }>, Type.TObject<{
        state: Type.TLiteral<"unavailable">;
      }>]>>;
      totalTokens: Type.TNumber;
      cost: Type.TObject<{
        input: Type.TNumber;
        output: Type.TNumber;
        cacheRead: Type.TNumber;
        cacheWrite: Type.TNumber;
        total: Type.TNumber;
        totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
      }>;
    }>;
    timestamp: Type.TInteger;
    stopReason: Type.TEnum<["stop", "length", "toolUse"]>;
  }>;
}>, Type.TObject<{
  type: Type.TLiteral<"error">;
  reason: Type.TEnum<["model-not-approved", "invalid-context", "epoch-mismatch", "session-not-attached", "provider-error", "cancelled"]>;
  message: Type.TString;
  usage: Type.TOptional<Type.TObject<{
    input: Type.TNumber;
    output: Type.TNumber;
    cacheRead: Type.TNumber;
    cacheWrite: Type.TNumber;
    contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
      state: Type.TLiteral<"available">;
      promptTokens: Type.TNumber;
      totalTokens: Type.TNumber;
    }>, Type.TObject<{
      state: Type.TLiteral<"unavailable">;
    }>]>>;
    totalTokens: Type.TNumber;
    cost: Type.TObject<{
      input: Type.TNumber;
      output: Type.TNumber;
      cacheRead: Type.TNumber;
      cacheWrite: Type.TNumber;
      total: Type.TNumber;
      totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
    }>;
  }>>;
}>]>;
declare const WorkerInferenceTerminalFrameSchema: Type.TObject<{
  type: Type.TLiteral<"event">;
  event: Type.TLiteral<"worker.inference.terminal">;
  payload: Type.TObject<{
    runEpoch: Type.TInteger;
    sessionId: Type.TString;
    runId: Type.TString;
    turnId: Type.TString;
    seq: Type.TInteger;
    outcome: Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"done">;
      message: Type.TObject<{
        role: Type.TLiteral<"assistant">;
        content: Type.TArray<Type.TUnion<[Type.TObject<{
          type: Type.TLiteral<"text">;
          text: Type.TString;
          textSignature: Type.TOptional<Type.TString>;
        }>, Type.TObject<{
          type: Type.TLiteral<"thinking">;
          thinking: Type.TString;
          thinkingSignature: Type.TOptional<Type.TString>;
          redacted: Type.TOptional<Type.TBoolean>;
        }>, Type.TObject<{
          type: Type.TLiteral<"toolCall">;
          id: Type.TString;
          name: Type.TString;
          arguments: Type.TRecord<"^.*$", Type.TUnknown>;
          thoughtSignature: Type.TOptional<Type.TString>;
          executionMode: Type.TOptional<Type.TEnum<["sequential", "parallel"]>>;
        }>]>>;
        api: Type.TString;
        provider: Type.TString;
        model: Type.TString;
        responseModel: Type.TOptional<Type.TString>;
        responseId: Type.TOptional<Type.TString>;
        providerReplay: Type.TOptional<Type.TObject<{
          v: Type.TLiteral<1>;
          type: Type.TString;
          id: Type.TOptional<Type.TString>;
          data: Type.TString;
          replayIndex: Type.TOptional<Type.TInteger>;
          provider: Type.TString;
          api: Type.TString;
          model: Type.TString;
          baseUrlHash: Type.TOptional<Type.TString>;
          sessionHash: Type.TOptional<Type.TString>;
          authProfileHash: Type.TOptional<Type.TString>;
        }>>;
        usage: Type.TObject<{
          input: Type.TNumber;
          output: Type.TNumber;
          cacheRead: Type.TNumber;
          cacheWrite: Type.TNumber;
          contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
            state: Type.TLiteral<"available">;
            promptTokens: Type.TNumber;
            totalTokens: Type.TNumber;
          }>, Type.TObject<{
            state: Type.TLiteral<"unavailable">;
          }>]>>;
          totalTokens: Type.TNumber;
          cost: Type.TObject<{
            input: Type.TNumber;
            output: Type.TNumber;
            cacheRead: Type.TNumber;
            cacheWrite: Type.TNumber;
            total: Type.TNumber;
            totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
          }>;
        }>;
        timestamp: Type.TInteger;
        stopReason: Type.TEnum<["stop", "length", "toolUse"]>;
      }>;
    }>, Type.TObject<{
      type: Type.TLiteral<"error">;
      reason: Type.TEnum<["model-not-approved", "invalid-context", "epoch-mismatch", "session-not-attached", "provider-error", "cancelled"]>;
      message: Type.TString;
      usage: Type.TOptional<Type.TObject<{
        input: Type.TNumber;
        output: Type.TNumber;
        cacheRead: Type.TNumber;
        cacheWrite: Type.TNumber;
        contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
          state: Type.TLiteral<"available">;
          promptTokens: Type.TNumber;
          totalTokens: Type.TNumber;
        }>, Type.TObject<{
          state: Type.TLiteral<"unavailable">;
        }>]>>;
        totalTokens: Type.TNumber;
        cost: Type.TObject<{
          input: Type.TNumber;
          output: Type.TNumber;
          cacheRead: Type.TNumber;
          cacheWrite: Type.TNumber;
          total: Type.TNumber;
          totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
        }>;
      }>>;
    }>]>;
  }>;
}>;
type WorkerInferenceStartParams = Static<typeof WorkerInferenceStartParamsSchema>;
type WorkerInferenceStartResult = Static<typeof WorkerInferenceStartResultSchema>;
type WorkerInferenceErrorReason = Static<typeof WorkerInferenceErrorReasonSchema>;
type WorkerInferenceCancelParams = Static<typeof WorkerInferenceCancelParamsSchema>;
type WorkerInferenceCancelResult = Static<typeof WorkerInferenceCancelResultSchema>;
type WorkerInferenceEventParams = Static<typeof WorkerInferenceEventParamsSchema>;
type WorkerInferenceEventFrame = Static<typeof WorkerInferenceEventFrameSchema>;
type WorkerInferenceTerminalOutcome = Static<typeof WorkerInferenceTerminalOutcomeSchema>;
type WorkerInferenceTerminalFrame = Static<typeof WorkerInferenceTerminalFrameSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-gateway-tool.d.ts
declare const AgentToolSurfacePresentationSchema: Type.TObject<{
  codeMode: Type.TObject<{
    enabled: Type.TBoolean;
    executor: Type.TEnum<["node", "quickjs"]>;
    mode: Type.TLiteral<"only">;
    timeoutMs: Type.TInteger;
    memoryLimitBytes: Type.TInteger;
    maxOutputBytes: Type.TInteger;
    maxSnapshotBytes: Type.TInteger;
    maxPendingToolCalls: Type.TInteger;
    snapshotTtlSeconds: Type.TInteger;
    searchDefaultLimit: Type.TInteger;
    maxSearchLimit: Type.TInteger;
  }>;
  toolSearch: Type.TObject<{
    enabled: Type.TBoolean;
    mode: Type.TEnum<["tools", "directory"]>;
    searchDefaultLimit: Type.TInteger;
    maxSearchLimit: Type.TInteger;
  }>;
  forceDirectMessageTool: Type.TBoolean;
  skills: Type.TOptional<Type.TArray<Type.TObject<{
    name: Type.TString;
    description: Type.TString;
    location: Type.TString;
  }>>>;
}>;
type AgentToolSurfacePresentation = Static<typeof AgentToolSurfacePresentationSchema>;
declare const WorkerGatewayToolInvokeParamsSchema: Type.TObject<{
  generation: Type.TString;
  toolId: Type.TString;
  toolCallId: Type.TString;
  arguments: Type.TRecord<"^.*$", Type.TUnknown>;
}>;
declare const WorkerGatewayToolCancelParamsSchema: Type.TObject<{
  generation: Type.TString;
  toolCallId: Type.TString;
}>;
declare const WorkerGatewayToolUpdateFrameSchema: Type.TObject<{
  type: Type.TLiteral<"event">;
  event: Type.TLiteral<"worker.gatewayTool.update">;
  payload: Type.TObject<{
    generation: Type.TString;
    toolCallId: Type.TString;
    seq: Type.TInteger;
    result: Type.TObject<{
      content: Type.TArray<Type.TUnion<[Type.TObject<{
        type: Type.TLiteral<"text">;
        text: Type.TString;
        textSignature: Type.TOptional<Type.TString>;
      }>, Type.TObject<{
        type: Type.TLiteral<"image">;
        data: Type.TString;
        mimeType: Type.TString;
      }>]>>;
      details: Type.TOptional<Type.TUnknown>;
      isError: Type.TOptional<Type.TBoolean>;
      terminate: Type.TOptional<Type.TBoolean>;
      progress: Type.TOptional<Type.TObject<{
        text: Type.TString;
        visibility: Type.TLiteral<"channel">;
        privacy: Type.TLiteral<"public">;
        id: Type.TOptional<Type.TString>;
      }>>;
    }>;
  }>;
}>;
type WorkerGatewayToolInvokeParams = Static<typeof WorkerGatewayToolInvokeParamsSchema>;
type WorkerGatewayToolCancelParams = Static<typeof WorkerGatewayToolCancelParamsSchema>;
type WorkerGatewayToolUpdateFrame = Static<typeof WorkerGatewayToolUpdateFrameSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-computer.d.ts
declare const WorkerComputerParamsSchema: Type.TObject<{
  command: Type.TEnum<["screen.snapshot", "computer.act"]>;
  paramsJson: Type.TString;
  timeoutMs: Type.TOptional<Type.TInteger>;
  idempotencyKey: Type.TOptional<Type.TString>;
}>;
declare const WorkerComputerResultSchema: Type.TObject<{
  resultJson: Type.TString;
}>;
type WorkerComputerParams = Static<typeof WorkerComputerParamsSchema>;
type WorkerComputerResult = Static<typeof WorkerComputerResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/computer.d.ts
declare const ComputerInvokeParamsSchema: Type.TObject<{
  command: Type.TEnum<["screen.snapshot", "computer.act"]>;
  params: Type.TRecord<"^.*$", Type.TUnknown>;
  generation: Type.TString;
  timeoutMs: Type.TOptional<Type.TInteger>;
  idempotencyKey: Type.TString;
}>;
type ComputerInvokeParams = Static<typeof ComputerInvokeParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/transcripts.d.ts
declare const TranscriptSessionSummarySchema: Type.TObject<{
  selector: Type.TString;
  sessionId: Type.TString;
  title: Type.TOptional<Type.TString>;
  providerId: Type.TString;
  providerName: Type.TOptional<Type.TString>;
  source: Type.TObject<{
    providerId: Type.TString;
    kind: Type.TOptional<Type.TUnion<[Type.TLiteral<"live-audio">, Type.TLiteral<"live-caption">, Type.TLiteral<"posthoc-transcript">, Type.TLiteral<"recording-stt">]>>;
    accountId: Type.TOptional<Type.TString>;
    guildId: Type.TOptional<Type.TString>;
    channelId: Type.TOptional<Type.TString>;
    meetingUrl: Type.TOptional<Type.TString>;
    threadTs: Type.TOptional<Type.TString>;
    fileId: Type.TOptional<Type.TString>;
  }>;
  startedAt: Type.TString;
  stoppedAt: Type.TOptional<Type.TString>;
  active: Type.TBoolean;
  utteranceCount: Type.TInteger;
  participants: Type.TArray<Type.TString>;
  hasSummary: Type.TBoolean;
  summarySource: Type.TOptional<Type.TUnion<[Type.TLiteral<"model">, Type.TLiteral<"heuristic">]>>;
  overview: Type.TOptional<Type.TString>;
  agentId: Type.TUnion<[Type.TString, Type.TNull]>;
  updatedAt: Type.TString;
  lastUtteranceAt: Type.TUnion<[Type.TString, Type.TNull]>;
  activeSubscription: Type.TBoolean;
}>;
declare const TranscriptUtteranceSchema: Type.TObject<{
  sequence: Type.TInteger;
  id: Type.TOptional<Type.TString>;
  startedAt: Type.TOptional<Type.TString>;
  endedAt: Type.TOptional<Type.TString>;
  speakerId: Type.TOptional<Type.TString>;
  speakerLabel: Type.TOptional<Type.TString>;
  text: Type.TString;
  final: Type.TOptional<Type.TBoolean>;
}>;
type TranscriptSessionSummary = Static<typeof TranscriptSessionSummarySchema>;
type TranscriptUtterance = Static<typeof TranscriptUtteranceSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-catalog.d.ts
declare const SessionCatalogShareRouteSchema: Type.TObject<{
  kind: Type.TLiteral<"thread-id-prefix">;
  routeSegment: Type.TString;
  hostId: Type.TString;
  identifierAlphabet: Type.TLiteral<"lowercase-hex">;
  fullLength: Type.TLiteral<32>;
  minPrefixLength: Type.TLiteral<12>;
  lookup: Type.TLiteral<"catalog-list-search-by-thread-id-prefix">;
  ambiguity: Type.TLiteral<"multiple-results-or-next-cursor">;
}>;
declare const SessionCatalogHostSchema: Type.TObject<{
  hostId: Type.TString;
  label: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"node">]>;
  connected: Type.TBoolean;
  /** First snapshot is still loading; retain prior rows until the host publication arrives. */
  pending: Type.TOptional<Type.TBoolean>;
  nodeId: Type.TOptional<Type.TString>;
  canStartTerminal: Type.TOptional<Type.TBoolean>;
  sessions: Type.TArray<Type.TObject<{
    threadId: Type.TString;
    sourceHomeId: Type.TOptional<Type.TString>;
    name: Type.TOptional<Type.TString>;
    /** Named tint imported from the source CLI session (SESSION_COLOR_IDS). */
    color: Type.TOptional<Type.TString>;
    cwd: Type.TOptional<Type.TString>;
    status: Type.TString;
    createdAt: Type.TOptional<Type.TNumber>;
    updatedAt: Type.TOptional<Type.TNumber>;
    recencyAt: Type.TOptional<Type.TNumber>;
    source: Type.TOptional<Type.TString>;
    modelProvider: Type.TOptional<Type.TString>;
    cliVersion: Type.TOptional<Type.TString>;
    gitBranch: Type.TOptional<Type.TString>;
    customGroup: Type.TOptional<Type.TString>;
    pullRequest: Type.TOptional<Type.TObject<{
      numbers: Type.TArray<Type.TInteger>;
      state: Type.TUnion<[Type.TLiteral<"open">, Type.TLiteral<"draft">, Type.TLiteral<"merged">, Type.TLiteral<"closed">]>;
    }>>;
    archived: Type.TBoolean;
    sessionKey: Type.TOptional<Type.TString>;
    createdActor: Type.TOptional<Type.TObject<{
      type: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
      label: Type.TOptional<Type.TString>;
      avatarUrl: Type.TOptional<Type.TString>;
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
    canContinue: Type.TBoolean;
    canArchive: Type.TBoolean;
    canOpenTerminal: Type.TOptional<Type.TBoolean>;
  }>>;
  nextCursor: Type.TOptional<Type.TString>;
  error: Type.TOptional<Type.TObject<{
    code: Type.TString;
    message: Type.TString;
  }>>;
}>;
declare const SessionsCatalogReadParamsSchema: Type.TObject<{
  catalogId: Type.TString;
  hostId: Type.TString;
  threadId: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  sourceHomeId: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
  cursor: Type.TOptional<Type.TString>;
}>;
declare const SessionsCatalogReadResultSchema: Type.TObject<{
  hostId: Type.TString;
  label: Type.TOptional<Type.TString>;
  threadId: Type.TString;
  items: Type.TArray<Type.TObject<{
    id: Type.TOptional<Type.TString>;
    type: Type.TUnion<[Type.TLiteral<"userMessage">, Type.TLiteral<"agentMessage">, Type.TLiteral<"reasoning">, Type.TLiteral<"toolCall">, Type.TLiteral<"toolResult">, Type.TLiteral<"other">]>;
    text: Type.TOptional<Type.TString>;
    timestamp: Type.TOptional<Type.TString>;
    model: Type.TOptional<Type.TString>;
    /** Source-supplied attribution, independent of the viewer and session adopter. */
    sender: Type.TOptional<Type.TObject<{
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
    }>>;
    truncated: Type.TOptional<Type.TBoolean>;
    raw: Type.TOptional<Type.TUnknown>;
  }>>;
  nextCursor: Type.TOptional<Type.TString>;
}>;
declare const SessionsCatalogContinueParamsSchema: Type.TObject<{
  catalogId: Type.TString;
  hostId: Type.TString;
  threadId: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  sourceHomeId: Type.TOptional<Type.TString>;
}>;
declare const SessionsCatalogArchiveParamsSchema: Type.TObject<{
  catalogId: Type.TString;
  hostId: Type.TString;
  threadId: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  sourceHomeId: Type.TOptional<Type.TString>;
  confirmNoOtherRunner: Type.TLiteral<true>;
}>;
type SessionCatalogShareRoute = Static<typeof SessionCatalogShareRouteSchema>;
type SessionCatalogHost = Static<typeof SessionCatalogHostSchema>;
type SessionsCatalogReadParams = Static<typeof SessionsCatalogReadParamsSchema>;
type SessionsCatalogReadResult = Static<typeof SessionsCatalogReadResultSchema>;
type SessionsCatalogContinueParams = Static<typeof SessionsCatalogContinueParamsSchema>;
type SessionsCatalogArchiveParams = Static<typeof SessionsCatalogArchiveParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/agent.d.ts
/** Main agent-run request accepted by the gateway. */
declare const AgentParamsSchema: Type.TObject<{
  message: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  to: Type.TOptional<Type.TString>;
  replyTo: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  expectedExistingSessionId: Type.TOptional<Type.TString>;
  expectedExistingSessionLifecycleRevision: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  thinking: Type.TOptional<Type.TString>;
  deliver: Type.TOptional<Type.TBoolean>;
  attachments: Type.TOptional<Type.TArray<Type.TUnknown>>;
  channel: Type.TOptional<Type.TString>;
  replyChannel: Type.TOptional<Type.TString>;
  accountId: Type.TOptional<Type.TString>;
  replyAccountId: Type.TOptional<Type.TString>;
  threadId: Type.TOptional<Type.TString>;
  groupId: Type.TOptional<Type.TString>;
  groupChannel: Type.TOptional<Type.TString>;
  groupSpace: Type.TOptional<Type.TString>;
  timeout: Type.TOptional<Type.TInteger>;
  bestEffortDeliver: Type.TOptional<Type.TBoolean>;
  lane: Type.TOptional<Type.TString>;
  cwd: Type.TOptional<Type.TString>;
  cleanupBundleMcpOnRunEnd: Type.TOptional<Type.TBoolean>;
  modelRun: Type.TOptional<Type.TBoolean>;
  promptMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"full">, Type.TLiteral<"minimal">, Type.TLiteral<"none">]>>;
  extraSystemPrompt: Type.TOptional<Type.TString>;
  bootstrapContextMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"full">, Type.TLiteral<"lightweight">]>>;
  bootstrapContextRunKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"default">, Type.TLiteral<"heartbeat">, Type.TLiteral<"cron">]>>;
  acpTurnSource: Type.TOptional<Type.TLiteral<"manual_spawn">>;
  internalRuntimeHandoffId: Type.TOptional<Type.TString>;
  internalExecutionIdentityRetry: Type.TOptional<Type.TBoolean>;
  /** Exact durable recovery attempt that owns any post-admission identity bind. */
  internalExecutionIdentityRecoveryAttempt: Type.TOptional<Type.TInteger>;
  execApprovalFollowupExpectedSessionId: Type.TOptional<Type.TString>;
  internalEvents: Type.TOptional<Type.TArray<Type.TObject<{
    type: Type.TLiteral<"task_completion">;
    source: Type.TString;
    childSessionKey: Type.TString;
    childSessionId: Type.TOptional<Type.TString>;
    announceType: Type.TString;
    taskLabel: Type.TString;
    status: Type.TString;
    statusLabel: Type.TString;
    result: Type.TString;
    noVisibleResult: Type.TOptional<Type.TBoolean>;
    modelRouteChange: Type.TOptional<Type.TString>;
    attachments: Type.TOptional<Type.TArray<Type.TObject<{
      type: Type.TOptional<Type.TString>;
      path: Type.TOptional<Type.TString>;
      url: Type.TOptional<Type.TString>;
      mediaUrl: Type.TOptional<Type.TString>;
      filePath: Type.TOptional<Type.TString>;
      mimeType: Type.TOptional<Type.TString>;
      name: Type.TOptional<Type.TString>;
      sizeBytes: Type.TOptional<Type.TNumber>;
      durationMs: Type.TOptional<Type.TNumber>;
      width: Type.TOptional<Type.TNumber>;
      height: Type.TOptional<Type.TNumber>;
    }>>>;
    mediaUrls: Type.TOptional<Type.TArray<Type.TString>>;
    statsLine: Type.TOptional<Type.TString>;
    replyInstruction: Type.TString;
  }>>>;
  inputProvenance: Type.TOptional<Type.TObject<{
    kind: Type.TString;
    originSessionId: Type.TOptional<Type.TString>;
    sourceSessionKey: Type.TOptional<Type.TString>;
    sourceChannel: Type.TOptional<Type.TString>;
    sourceTool: Type.TOptional<Type.TString>;
    sourceRole: Type.TOptional<Type.TLiteral<"subagent">>;
    sourcePromptPrefix: Type.TOptional<Type.TString>;
    jobId: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
  }>>;
  suppressPromptPersistence: Type.TOptional<Type.TBoolean>;
  sessionEffects: Type.TOptional<Type.TUnion<[Type.TLiteral<"visible">, Type.TLiteral<"internal">]>>;
  sourceReplyDeliveryMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"automatic">, Type.TLiteral<"message_tool_only">]>>;
  disableMessageTool: Type.TOptional<Type.TBoolean>;
  swarmCollector: Type.TOptional<Type.TBoolean>;
  swarmOutputSchema: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  forceRestartSafeTools: Type.TOptional<Type.TBoolean>;
  forceCodeModeTools: Type.TOptional<Type.TBoolean>;
  voiceWakeTrigger: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
  label: Type.TOptional<Type.TString>;
}>;
/** Waits for a submitted agent run to complete or time out. */
declare const AgentWaitParamsSchema: Type.TObject<{
  runId: Type.TString;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>;
type AgentWaitParams = Static<typeof AgentWaitParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/agents-models-skills.d.ts
/** Condensed agent record returned by list APIs. */
declare const AgentSummarySchema: Type.TObject<{
  id: Type.TString;
  /** Effective explicit utility model; absent for automatic or disabled utility routing. */
  utilityModel: Type.TOptional<Type.TString>;
  status: Type.TOptional<Type.TLiteral<"degraded">>;
  admissionRefusal: Type.TOptional<Type.TUnion<[Type.TObject<{
    agentId: Type.TString;
    paths: Type.TArray<Type.TString>;
    reason: Type.TString;
    repairHint: Type.TString;
    embeddedOwnerId: Type.TString;
    code: Type.TLiteral<"agent-database-ownership-mismatch">;
  }>, Type.TObject<{
    agentId: Type.TString;
    paths: Type.TArray<Type.TString>;
    reason: Type.TString;
    repairHint: Type.TString;
    code: Type.TUnion<[Type.TLiteral<"agent-database-inspection-pending">, Type.TLiteral<"agent-database-inspection-failed">]>;
  }>]>>;
  kind: Type.TOptional<Type.TUnion<[Type.TLiteral<"agent">, Type.TLiteral<"system">]>>;
  createdVia: Type.TOptional<Type.TUnion<[Type.TLiteral<"operator">, Type.TLiteral<"agent">, Type.TLiteral<"claw">]>>;
  creatorAgentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  createdAt: Type.TOptional<Type.TInteger>;
  name: Type.TOptional<Type.TString>;
  identity: Type.TOptional<Type.TObject<{
    name: Type.TOptional<Type.TString>;
    theme: Type.TOptional<Type.TString>;
    emoji: Type.TOptional<Type.TString>;
    avatar: Type.TOptional<Type.TString>;
    avatarUrl: Type.TOptional<Type.TString>;
  }>>;
  workspace: Type.TOptional<Type.TString>;
  workspaceGit: Type.TOptional<Type.TBoolean>;
  model: Type.TOptional<Type.TObject<{
    primary: Type.TOptional<Type.TString>;
    fallbacks: Type.TOptional<Type.TArray<Type.TString>>;
  }>>;
  agentRuntime: Type.TOptional<Type.TObject<{
    id: Type.TString;
    fallback: Type.TOptional<Type.TUnion<[Type.TLiteral<"openclaw">, Type.TLiteral<"none">]>>;
    cloudPlacementSupported: Type.TOptional<Type.TBoolean>;
    cloudPlacementExecutionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"worker-turn">, Type.TLiteral<"remote-exec">]>>;
    devicePlacement: Type.TOptional<Type.TObject<{
      requiredNodeCommands: Type.TArray<Type.TString>;
      consumesWorkerSlot: Type.TBoolean;
    }>>;
    devicePlacementSupported: Type.TOptional<Type.TBoolean>;
    source: Type.TUnion<[Type.TLiteral<"env">, Type.TLiteral<"agent">, Type.TLiteral<"defaults">, Type.TLiteral<"model">, Type.TLiteral<"provider">, Type.TLiteral<"implicit">, Type.TLiteral<"session">, Type.TLiteral<"session-key">]>;
  }>>;
  thinkingLevels: Type.TOptional<Type.TArray<Type.TObject<{
    id: Type.TString;
    label: Type.TString;
  }>>>;
  thinkingOptions: Type.TOptional<Type.TArray<Type.TString>>;
  thinkingDefault: Type.TOptional<Type.TString>;
  defaultPermissionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"read-only">, Type.TLiteral<"guarded">, Type.TLiteral<"workspace">, Type.TLiteral<"full">]>>;
}>;
/** Proposal record result returned after non-apply proposal actions. */
declare const SkillsProposalRecordResultSchema: Type.TObject<{
  schema: Type.TLiteral<"openclaw.skill-workshop.proposal.v1">;
  id: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"create">, Type.TLiteral<"update">]>;
  status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"applied">, Type.TLiteral<"rejected">, Type.TLiteral<"quarantined">, Type.TLiteral<"stale">]>;
  title: Type.TString;
  description: Type.TString;
  createdAt: Type.TString;
  updatedAt: Type.TString;
  createdBy: Type.TUnion<[Type.TLiteral<"skill-workshop">, Type.TLiteral<"cli">, Type.TLiteral<"gateway">]>;
  origin: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    messageId: Type.TOptional<Type.TString>;
  }>>;
  proposedVersion: Type.TString;
  draftFile: Type.TLiteral<"PROPOSAL.md">;
  draftHash: Type.TString;
  supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
    path: Type.TString;
    sizeBytes: Type.TInteger;
    hash: Type.TString;
    targetExisted: Type.TOptional<Type.TBoolean>;
    targetContentHash: Type.TOptional<Type.TString>;
  }>>>;
  target: Type.TObject<{
    skillName: Type.TString;
    skillKey: Type.TString;
    skillDir: Type.TString;
    skillFile: Type.TString;
    source: Type.TOptional<Type.TString>;
    currentContentHash: Type.TOptional<Type.TString>;
  }>;
  scan: Type.TObject<{
    state: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"clean">, Type.TLiteral<"failed">, Type.TLiteral<"quarantined">]>;
    scannedAt: Type.TString;
    critical: Type.TInteger;
    warn: Type.TInteger;
    info: Type.TInteger;
    findings: Type.TArray<Type.TObject<{
      ruleId: Type.TString;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"critical">]>;
      file: Type.TString;
      line: Type.TInteger;
      message: Type.TString;
      evidence: Type.TString;
    }>>;
  }>;
  goal: Type.TOptional<Type.TString>;
  evidence: Type.TOptional<Type.TString>;
  appliedAt: Type.TOptional<Type.TString>;
  rejectedAt: Type.TOptional<Type.TString>;
  quarantinedAt: Type.TOptional<Type.TString>;
  staleAt: Type.TOptional<Type.TString>;
  statusReason: Type.TOptional<Type.TString>;
  evaluation: Type.TOptional<Type.TObject<{
    id: Type.TString;
    proposedVersion: Type.TString;
    revisionHash: Type.TString;
    trigger: Type.TUnion<[Type.TLiteral<"manual">, Type.TLiteral<"apply">]>;
    startedAt: Type.TString;
    completedAt: Type.TString;
    correlationId: Type.TOptional<Type.TString>;
    targetTreeSha256: Type.TOptional<Type.TString>;
    outcomes: Type.TArray<Type.TUnion<[Type.TObject<{
      pluginId: Type.TString;
      pluginVersion: Type.TOptional<Type.TString>;
      evaluatorId: Type.TString;
      status: Type.TLiteral<"completed">;
      result: Type.TObject<{
        summary: Type.TOptional<Type.TString>;
        findings: Type.TOptional<Type.TArray<Type.TObject<{
          ruleId: Type.TString;
          severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"critical">]>;
          message: Type.TString;
          file: Type.TOptional<Type.TString>;
          line: Type.TOptional<Type.TInteger>;
        }>>>;
        metrics: Type.TOptional<Type.TRecord<"^.*$", Type.TUnion<[Type.TString, Type.TNumber, Type.TBoolean]>>>;
        evaluatorVersion: Type.TOptional<Type.TString>;
        mode: Type.TOptional<Type.TString>;
        decision: Type.TOptional<Type.TUnion<[Type.TLiteral<"pass">, Type.TLiteral<"revise">, Type.TLiteral<"block">]>>;
        decisionReason: Type.TOptional<Type.TString>;
      }>;
    }>, Type.TObject<{
      pluginId: Type.TString;
      pluginVersion: Type.TOptional<Type.TString>;
      evaluatorId: Type.TString;
      status: Type.TLiteral<"skipped">;
    }>, Type.TObject<{
      pluginId: Type.TString;
      pluginVersion: Type.TOptional<Type.TString>;
      evaluatorId: Type.TString;
      status: Type.TLiteral<"error">;
      error: Type.TString;
    }>]>>;
  }>>;
}>;
declare const ToolsGitHubAuthorizeStartResultSchema: Type.TObject<{
  requestId: Type.TString;
  userCode: Type.TString;
  verificationUri: Type.TLiteral<"https://github.com/login/device">;
  expiresInMs: Type.TInteger;
  pollAfterMs: Type.TInteger;
}>;
declare const ToolsGitHubAuthorizePollResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"pending">;
  retryAfterMs: Type.TInteger;
}>, Type.TObject<{
  status: Type.TLiteral<"slow_down">;
  retryAfterMs: Type.TInteger;
}>, Type.TObject<{
  status: Type.TLiteral<"access_denied">;
}>, Type.TObject<{
  status: Type.TLiteral<"expired">;
}>, Type.TObject<{
  status: Type.TLiteral<"incorrect_device_code">;
}>, Type.TObject<{
  status: Type.TLiteral<"network_error">;
  retryAfterMs: Type.TInteger;
}>, Type.TObject<{
  status: Type.TLiteral<"failed">;
  reason: Type.TUnion<[Type.TLiteral<"identity_changed">, Type.TLiteral<"setup_failed">]>;
}>, Type.TObject<{
  status: Type.TLiteral<"success">;
  githubStatus: Type.TObject<{
    agentId: Type.TString;
    selectedScope: Type.TUnion<[Type.TLiteral<"system">, Type.TLiteral<"agent">]>;
    selected: Type.TObject<{
      scope: Type.TUnion<[Type.TLiteral<"system">, Type.TLiteral<"agent">]>;
      configured: Type.TBoolean;
      identity: Type.TUnion<[Type.TObject<{
        source: Type.TUnion<[Type.TLiteral<"system-detected">, Type.TLiteral<"system-configured">, Type.TLiteral<"agent-override">]>;
        credentialKind: Type.TUnion<[Type.TLiteral<"native">, Type.TLiteral<"managed-pat">, Type.TLiteral<"managed-oauth">]>;
        credentialState: Type.TUnion<[Type.TLiteral<"available">, Type.TLiteral<"unavailable">, Type.TLiteral<"configured_unavailable">, Type.TLiteral<"unverified">, Type.TLiteral<"rate_limited">]>;
        account: Type.TUnion<[Type.TObject<{
          login: Type.TString;
        }>, Type.TNull]>;
        gitAuthor: Type.TObject<{
          name: Type.TUnion<[Type.TString, Type.TNull]>;
          email: Type.TUnion<[Type.TString, Type.TNull]>;
        }>;
        evidence: Type.TUnion<[Type.TLiteral<"github-api">, Type.TLiteral<"none">, Type.TLiteral<"unverified">, Type.TLiteral<"rate-limited">]>;
        accessExpiresAtMs: Type.TUnion<[Type.TInteger, Type.TNull]>;
        refreshState: Type.TUnion<[Type.TLiteral<"not_applicable">, Type.TLiteral<"available">, Type.TLiteral<"expired">, Type.TLiteral<"unavailable">, Type.TLiteral<"refreshing">, Type.TLiteral<"failed">]>;
        oauthScopes: Type.TArray<Type.TString>;
        repositoryGrants: Type.TLiteral<"unknown">;
      }>, Type.TNull]>;
    }>;
    effective: Type.TObject<{
      source: Type.TUnion<[Type.TLiteral<"system-detected">, Type.TLiteral<"system-configured">, Type.TLiteral<"agent-override">]>;
      credentialKind: Type.TUnion<[Type.TLiteral<"native">, Type.TLiteral<"managed-pat">, Type.TLiteral<"managed-oauth">]>;
      credentialState: Type.TUnion<[Type.TLiteral<"available">, Type.TLiteral<"unavailable">, Type.TLiteral<"configured_unavailable">, Type.TLiteral<"unverified">, Type.TLiteral<"rate_limited">]>;
      account: Type.TUnion<[Type.TObject<{
        login: Type.TString;
      }>, Type.TNull]>;
      gitAuthor: Type.TObject<{
        name: Type.TUnion<[Type.TString, Type.TNull]>;
        email: Type.TUnion<[Type.TString, Type.TNull]>;
      }>;
      evidence: Type.TUnion<[Type.TLiteral<"github-api">, Type.TLiteral<"none">, Type.TLiteral<"unverified">, Type.TLiteral<"rate-limited">]>;
      accessExpiresAtMs: Type.TUnion<[Type.TInteger, Type.TNull]>;
      refreshState: Type.TUnion<[Type.TLiteral<"not_applicable">, Type.TLiteral<"available">, Type.TLiteral<"expired">, Type.TLiteral<"unavailable">, Type.TLiteral<"refreshing">, Type.TLiteral<"failed">]>;
      oauthScopes: Type.TArray<Type.TString>;
      repositoryGrants: Type.TLiteral<"unknown">;
    }>;
  }>;
}>]>;
type AgentSummary = Static<typeof AgentSummarySchema>;
type ToolsGitHubAuthorizeStartResult = Static<typeof ToolsGitHubAuthorizeStartResultSchema>;
type ToolsGitHubAuthorizePollResult = Static<typeof ToolsGitHubAuthorizePollResultSchema>;
type SkillsProposalRecordResult = Static<typeof SkillsProposalRecordResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/audit-run.d.ts
declare const DecisionReceiptV1Schema: Type.TObject<{
  schemaVersion: Type.TLiteral<1>;
  receiptId: Type.TString;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  actionId: Type.TOptional<Type.TString>;
  occurredAt: Type.TInteger;
  action: Type.TObject<{
    family: Type.TString;
    operation: Type.TString;
    resourceRef: Type.TOptional<Type.TString>;
    targetRef: Type.TOptional<Type.TString>;
    summary: Type.TOptional<Type.TString>;
  }>;
  decision: Type.TObject<{
    outcome: Type.TUnion<[Type.TLiteral<"allowed">, Type.TLiteral<"denied">, Type.TLiteral<"not-applicable">, Type.TLiteral<"unknown">]>;
    reasonCode: Type.TString;
  }>;
  enforcement: Type.TObject<{
    coverageState: Type.TUnion<[Type.TLiteral<"enforced">, Type.TLiteral<"attribution-only">, Type.TLiteral<"unattributed">, Type.TLiteral<"unknown">, Type.TLiteral<"unsupported">]>;
    evaluatorRef: Type.TOptional<Type.TString>;
    policyRefs: Type.TArray<Type.TString>;
    grantRefs: Type.TArray<Type.TString>;
    contextFieldsUsed: Type.TArray<Type.TString>;
  }>;
  source: Type.TObject<{
    owner: Type.TString;
    recordRef: Type.TString;
    decisionBoundary: Type.TString;
  }>;
  missingEvidence: Type.TArray<Type.TString>;
  remediation: Type.TArray<Type.TObject<{
    code: Type.TString;
    text: Type.TString;
  }>>;
}>;
type DecisionReceiptV1 = Static<typeof DecisionReceiptV1Schema>;
//#endregion
//#region packages/gateway-protocol/src/schema/model-account-selection.d.ts
/** Configured preference only; provider failover can use a different account. */
declare const ChatAccountSelectionSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"automatic">;
  label: Type.TString;
}>, Type.TObject<{
  kind: Type.TLiteral<"personal">;
  label: Type.TString;
  authProfileId: Type.TOptional<Type.TString>;
  source: Type.TOptional<Type.TUnion<[Type.TLiteral<"auto">, Type.TLiteral<"user">, Type.TLiteral<"user-link">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"shared">;
  label: Type.TString;
  authProfileId: Type.TString;
  source: Type.TOptional<Type.TUnion<[Type.TLiteral<"auto">, Type.TLiteral<"user">, Type.TLiteral<"user-link">]>>;
}>]>;
type ChatAccountSelection = Static<typeof ChatAccountSelectionSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/users.d.ts
declare const UsersListModelAccountsResultSchema: Type.TObject<{
  profileId: Type.TString;
  accounts: Type.TArray<Type.TObject<{
    authProfileId: Type.TString;
    provider: Type.TString;
    label: Type.TString;
    authType: Type.TUnion<[Type.TLiteral<"api_key">, Type.TLiteral<"oauth">, Type.TLiteral<"token">]>;
    selected: Type.TBoolean;
  }>>;
  nextCursor: Type.TOptional<Type.TString>;
  links: Type.TArray<Type.TObject<{
    provider: Type.TString;
    authProfileId: Type.TString;
    updatedAt: Type.TInteger;
  }>>;
}>;
declare const UsersSelectModelAccountResultSchema: Type.TObject<{
  links: Type.TArray<Type.TObject<{
    provider: Type.TString;
    authProfileId: Type.TString;
    updatedAt: Type.TInteger;
  }>>;
}>;
declare const UsersListAuthLinksResultSchema: Type.TObject<{
  links: Type.TArray<Type.TObject<{
    provider: Type.TString;
    authProfileId: Type.TString;
    updatedAt: Type.TInteger;
  }>>;
}>;
declare const UsersLinkAuthProfileResultSchema: Type.TObject<{
  links: Type.TArray<Type.TObject<{
    provider: Type.TString;
    authProfileId: Type.TString;
    updatedAt: Type.TInteger;
  }>>;
}>;
declare const UsersUnlinkAuthProfileResultSchema: Type.TObject<{
  links: Type.TArray<Type.TObject<{
    provider: Type.TString;
    authProfileId: Type.TString;
    updatedAt: Type.TInteger;
  }>>;
}>;
declare const UsersAuthConnectCatalogResultSchema: Type.TObject<{
  providers: Type.TArray<Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    methods: Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
      hint: Type.TOptional<Type.TString>;
    }>>;
  }>>;
}>;
declare const UsersAuthConnectStartResultSchema: Type.TObject<{
  connectId: Type.TString;
  expiresAtMs: Type.TInteger;
}>;
declare const UsersAuthConnectStatusResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"pending">;
  step: Type.TOptional<Type.TObject<{
    id: Type.TString;
    type: Type.TUnion<[Type.TLiteral<"note">, Type.TLiteral<"select">, Type.TLiteral<"text">, Type.TLiteral<"confirm">, Type.TLiteral<"multiselect">, Type.TLiteral<"progress">, Type.TLiteral<"action">]>;
    title: Type.TOptional<Type.TString>;
    message: Type.TOptional<Type.TString>;
    format: Type.TOptional<Type.TUnion<[Type.TLiteral<"plain">]>>;
    options: Type.TOptional<Type.TArray<Type.TObject<{
      value: Type.TUnknown;
      label: Type.TString;
      hint: Type.TOptional<Type.TString>;
    }>>>;
    initialValue: Type.TOptional<Type.TUnknown>;
    placeholder: Type.TOptional<Type.TString>;
    sensitive: Type.TOptional<Type.TBoolean>;
    executor: Type.TOptional<Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"client">]>>;
    externalUrl: Type.TOptional<Type.TString>;
    deviceCode: Type.TOptional<Type.TObject<{
      code: Type.TString;
      expiresInMinutes: Type.TOptional<Type.TInteger>;
      message: Type.TOptional<Type.TString>;
    }>>;
  }>>;
  error: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  status: Type.TLiteral<"connected">;
  authProfileId: Type.TString;
  links: Type.TArray<Type.TObject<{
    provider: Type.TString;
    authProfileId: Type.TString;
    updatedAt: Type.TInteger;
  }>>;
}>, Type.TObject<{
  status: Type.TLiteral<"cancelled">;
}>, Type.TObject<{
  status: Type.TLiteral<"expired">;
}>, Type.TObject<{
  status: Type.TLiteral<"failed">;
  reason: Type.TUnion<[Type.TLiteral<"exchange">, Type.TLiteral<"identity">, Type.TLiteral<"authority">, Type.TLiteral<"unavailable">]>;
}>]>;
type UsersListModelAccountsResult = Static<typeof UsersListModelAccountsResultSchema>;
type UsersSelectModelAccountResult = Static<typeof UsersSelectModelAccountResultSchema>;
type UsersAuthConnectStartResult = Static<typeof UsersAuthConnectStartResultSchema>;
type UsersAuthConnectCatalogResult = Static<typeof UsersAuthConnectCatalogResultSchema>;
type UsersAuthConnectStatusResult = Static<typeof UsersAuthConnectStatusResultSchema>;
type UsersListAuthLinksResult = Static<typeof UsersListAuthLinksResultSchema>;
type UsersLinkAuthProfileResult = Static<typeof UsersLinkAuthProfileResultSchema>;
type UsersUnlinkAuthProfileResult = Static<typeof UsersUnlinkAuthProfileResultSchema>;
declare const UsersGitHubAuthorizeStartResultSchema: Type.TObject<{
  requestId: Type.TString;
  userCode: Type.TString;
  verificationUri: Type.TLiteral<"https://github.com/login/device">;
  expiresInMs: Type.TInteger;
  pollAfterMs: Type.TInteger;
}>;
declare const PersonalGitHubStatusSchema: Type.TObject<{
  state: Type.TUnion<[Type.TLiteral<"connected">, Type.TLiteral<"disconnected">, Type.TLiteral<"unavailable">]>;
  generation: Type.TUnion<[Type.TString, Type.TNull]>;
  account: Type.TUnion<[Type.TObject<{
    accountId: Type.TInteger;
    login: Type.TString;
  }>, Type.TNull]>;
  accessExpiresAtMs: Type.TUnion<[Type.TInteger, Type.TNull]>;
  refreshState: Type.TUnion<[Type.TLiteral<"available">, Type.TLiteral<"refreshing">, Type.TLiteral<"expired">, Type.TLiteral<"failed">, Type.TLiteral<"not_applicable">]>;
  pending: Type.TUnion<[Type.TObject<{
    requestId: Type.TString;
    userCode: Type.TString;
    verificationUri: Type.TLiteral<"https://github.com/login/device">;
    expiresInMs: Type.TInteger;
    pollAfterMs: Type.TInteger;
  }>, Type.TNull]>;
}>;
declare const UsersGitHubAuthorizePollResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"pending">;
  retryAfterMs: Type.TInteger;
}>, Type.TObject<{
  status: Type.TLiteral<"slow_down">;
  retryAfterMs: Type.TInteger;
}>, Type.TObject<{
  status: Type.TLiteral<"access_denied">;
}>, Type.TObject<{
  status: Type.TLiteral<"expired">;
}>, Type.TObject<{
  status: Type.TLiteral<"incorrect_device_code">;
}>, Type.TObject<{
  status: Type.TLiteral<"network_error">;
  retryAfterMs: Type.TInteger;
}>, Type.TObject<{
  status: Type.TLiteral<"failed">;
  reason: Type.TUnion<[Type.TLiteral<"identity_changed">, Type.TLiteral<"setup_failed">]>;
}>, Type.TObject<{
  status: Type.TLiteral<"success">;
  personal: Type.TObject<{
    state: Type.TUnion<[Type.TLiteral<"connected">, Type.TLiteral<"disconnected">, Type.TLiteral<"unavailable">]>;
    generation: Type.TUnion<[Type.TString, Type.TNull]>;
    account: Type.TUnion<[Type.TObject<{
      accountId: Type.TInteger;
      login: Type.TString;
    }>, Type.TNull]>;
    accessExpiresAtMs: Type.TUnion<[Type.TInteger, Type.TNull]>;
    refreshState: Type.TUnion<[Type.TLiteral<"available">, Type.TLiteral<"refreshing">, Type.TLiteral<"expired">, Type.TLiteral<"failed">, Type.TLiteral<"not_applicable">]>;
    pending: Type.TUnion<[Type.TObject<{
      requestId: Type.TString;
      userCode: Type.TString;
      verificationUri: Type.TLiteral<"https://github.com/login/device">;
      expiresInMs: Type.TInteger;
      pollAfterMs: Type.TInteger;
    }>, Type.TNull]>;
  }>;
}>]>;
type PersonalGitHubStatus = Static<typeof PersonalGitHubStatusSchema>;
type UsersGitHubAuthorizeStartResult = Static<typeof UsersGitHubAuthorizeStartResultSchema>;
type UsersGitHubAuthorizePollResult = Static<typeof UsersGitHubAuthorizePollResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/channels.d.ts
/** Canonical Talk event envelope emitted to browser, relay, and channel consumers. */
declare const TalkEventSchema: Type.TObject<{
  id: Type.TString;
  type: Type.TUnion<[Type.TLiteral<"session.started">, Type.TLiteral<"session.ready">, Type.TLiteral<"session.closed">, Type.TLiteral<"session.error">, Type.TLiteral<"session.replaced">, Type.TLiteral<"turn.started">, Type.TLiteral<"turn.ended">, Type.TLiteral<"turn.cancelled">, Type.TLiteral<"capture.started">, Type.TLiteral<"capture.stopped">, Type.TLiteral<"capture.cancelled">, Type.TLiteral<"capture.once">, Type.TLiteral<"input.audio.delta">, Type.TLiteral<"input.audio.committed">, Type.TLiteral<"transcript.delta">, Type.TLiteral<"transcript.done">, Type.TLiteral<"output.text.delta">, Type.TLiteral<"output.text.done">, Type.TLiteral<"output.audio.started">, Type.TLiteral<"output.audio.delta">, Type.TLiteral<"output.audio.done">, Type.TLiteral<"tool.call">, Type.TLiteral<"tool.progress">, Type.TLiteral<"tool.result">, Type.TLiteral<"tool.error">, Type.TLiteral<"usage.metrics">, Type.TLiteral<"latency.metrics">, Type.TLiteral<"health.changed">]>;
  sessionId: Type.TString;
  turnId: Type.TOptional<Type.TString>;
  captureId: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
  timestamp: Type.TString;
  mode: Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>;
  transport: Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>;
  brain: Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>;
  provider: Type.TOptional<Type.TString>;
  final: Type.TOptional<Type.TBoolean>;
  callId: Type.TOptional<Type.TString>;
  itemId: Type.TOptional<Type.TString>;
  parentId: Type.TOptional<Type.TString>;
  payload: Type.TUnknown;
}>;
declare const TalkClientCreateResultSchema: Type.TUnion<[Type.TObject<{
  provider: Type.TString;
  transport: Type.TLiteral<"webrtc">;
  voiceSessionId: Type.TString;
  clientSecret: Type.TString;
  offerUrl: Type.TOptional<Type.TString>;
  offerHeaders: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  expiresAt: Type.TOptional<Type.TNumber>;
  clientControl: Type.TOptional<Type.TObject<{
    owner: Type.TLiteral<"gateway">;
  }>>;
}>, Type.TObject<{
  provider: Type.TString;
  transport: Type.TLiteral<"provider-websocket">;
  voiceSessionId: Type.TString;
  protocol: Type.TString;
  clientSecret: Type.TString;
  websocketUrl: Type.TString;
  audio: Type.TObject<{
    inputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
    inputSampleRateHz: Type.TInteger;
    outputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
    outputSampleRateHz: Type.TInteger;
  }>;
  initialMessage: Type.TOptional<Type.TUnknown>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  expiresAt: Type.TOptional<Type.TNumber>;
}>, Type.TObject<{
  provider: Type.TString;
  transport: Type.TLiteral<"gateway-relay">;
  voiceSessionId: Type.TOptional<Type.TString>;
  relaySessionId: Type.TString;
  audio: Type.TObject<{
    inputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
    inputSampleRateHz: Type.TInteger;
    outputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
    outputSampleRateHz: Type.TInteger;
  }>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  expiresAt: Type.TOptional<Type.TNumber>;
}>, Type.TObject<{
  provider: Type.TString;
  transport: Type.TLiteral<"managed-room">;
  voiceSessionId: Type.TOptional<Type.TString>;
  roomUrl: Type.TString;
  token: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  expiresAt: Type.TOptional<Type.TNumber>;
}>]>;
declare const ChannelsStatusResultSchema: Type.TObject<{
  ts: Type.TInteger;
  channelOrder: Type.TArray<Type.TString>;
  channelLabels: Type.TRecord<"^.*$", Type.TString>;
  channelDetailLabels: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  channelSystemImages: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  channelMeta: Type.TOptional<Type.TArray<Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    detailLabel: Type.TString;
    systemImage: Type.TOptional<Type.TString>;
  }>>>;
  channels: Type.TRecord<"^.*$", Type.TUnknown>;
  channelAccounts: Type.TRecord<"^.*$", Type.TArray<Type.TObject<{
    accountId: Type.TString;
    name: Type.TOptional<Type.TString>;
    enabled: Type.TOptional<Type.TBoolean>;
    configured: Type.TOptional<Type.TBoolean>;
    linked: Type.TOptional<Type.TBoolean>;
    running: Type.TOptional<Type.TBoolean>;
    connected: Type.TOptional<Type.TBoolean>;
    reconnectAttempts: Type.TOptional<Type.TInteger>;
    lastConnectedAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    lastError: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    healthState: Type.TOptional<Type.TString>;
    lastStartAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    lastStopAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    lastInboundAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    lastOutboundAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    lastTransportActivityAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    busy: Type.TOptional<Type.TBoolean>;
    activeRuns: Type.TOptional<Type.TInteger>;
    lastRunActivityAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    activeRunStartedAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    lastProbeAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    mode: Type.TOptional<Type.TString>;
    dmPolicy: Type.TOptional<Type.TString>;
    allowFrom: Type.TOptional<Type.TArray<Type.TString>>;
    tokenSource: Type.TOptional<Type.TString>;
    botTokenSource: Type.TOptional<Type.TString>;
    appTokenSource: Type.TOptional<Type.TString>;
    credentialSource: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    audienceType: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    audience: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    webhookPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    webhookUrl: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    baseUrl: Type.TOptional<Type.TString>;
    allowUnmentionedGroups: Type.TOptional<Type.TBoolean>;
    cliPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    dbPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    port: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    probe: Type.TOptional<Type.TUnknown>;
    audit: Type.TOptional<Type.TUnknown>;
    application: Type.TOptional<Type.TUnknown>;
  }>>>;
  channelDefaultAccountId: Type.TRecord<"^.*$", Type.TString>;
  eventLoop: Type.TOptional<Type.TObject<{
    degraded: Type.TBoolean;
    degradedSinceMs: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    reasons: Type.TArray<Type.TUnion<[Type.TLiteral<"event_loop_delay">, Type.TLiteral<"event_loop_utilization">, Type.TLiteral<"cpu">]>>;
    delayP99Ms: Type.TNumber;
    delayMaxMs: Type.TNumber;
    utilization: Type.TNumber;
    cpuCoreRatio: Type.TNumber;
    cpuBreakdown: Type.TOptional<Type.TObject<{
      mainThreadCoreRatio: Type.TOptional<Type.TNumber>;
      workerCoreRatio: Type.TOptional<Type.TNumber>;
      otherThreadsCoreRatio: Type.TOptional<Type.TNumber>;
      hostUtilization: Type.TOptional<Type.TNumber>;
      hostCpuCount: Type.TOptional<Type.TInteger>;
    }>>;
    intervalMs: Type.TInteger;
  }>>;
  partial: Type.TOptional<Type.TBoolean>;
  warnings: Type.TOptional<Type.TArray<Type.TString>>;
  statusIssues: Type.TOptional<Type.TArray<Type.TObject<{
    channel: Type.TString;
    accountId: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"intent">, Type.TLiteral<"permissions">, Type.TLiteral<"config">, Type.TLiteral<"auth">, Type.TLiteral<"runtime">]>;
    message: Type.TString;
    fix: Type.TOptional<Type.TString>;
  }>>>;
}>;
type TalkEvent = Static<typeof TalkEventSchema>;
type TalkClientCreateResult = Static<typeof TalkClientCreateResultSchema>;
type ChannelsStatusResult = Static<typeof ChannelsStatusResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/openclaw.d.ts
declare const SystemAgentWizardCancelSchema: Type.TObject<{
  /** The visible step this action belongs to; stale controls must not affect a newer step. */
  stepId: Type.TString;
}>;
/**
 * Structured choice attached to a chat reply. Card-capable clients render the
 * options and send back `reply` (default: `label`) as the next message; text
 * clients ignore this and use the reply prose, which always stands alone.
 */
declare const SystemAgentChatQuestionSchema: Type.TObject<{
  id: Type.TString;
  header: Type.TString;
  question: Type.TString;
  options: Type.TArray<Type.TObject<{
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
    recommended: Type.TOptional<Type.TBoolean>;
    /** Message text a client sends when this option is chosen; defaults to label. */
    reply: Type.TOptional<Type.TString>;
  }>>;
  /** Free-text answers are also accepted for this question. */
  isOther: Type.TOptional<Type.TBoolean>;
  /** Client-owned action for the visible skip control; omitted means send a reply. */
  skipAction: Type.TOptional<Type.TLiteral<"exit">>;
}>;
type SystemAgentWizardCancel = Static<typeof SystemAgentWizardCancelSchema>;
type SystemAgentChatQuestion = Static<typeof SystemAgentChatQuestionSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/cron.d.ts
/** Persisted cron job definition returned by scheduler list/get APIs. */
declare const CronJobSchema: Type.TObject<{
  id: Type.TString;
  declarationKey: Type.TOptional<Type.TString>;
  displayName: Type.TOptional<Type.TString>;
  owner: Type.TOptional<Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    accountId: Type.TOptional<Type.TString>;
  }>>;
  scheduledToolPolicy: Type.TOptional<Type.TUnion<[Type.TObject<{
    version: Type.TLiteral<1>;
    mode: Type.TLiteral<"trusted">;
  }>, Type.TObject<{
    version: Type.TLiteral<1>;
    mode: Type.TLiteral<"account">;
    ownerSessionKey: Type.TString;
    ownerAccountId: Type.TString;
  }>]>>;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  name: Type.TString;
  description: Type.TOptional<Type.TString>;
  enabled: Type.TBoolean;
  deleteAfterRun: Type.TOptional<Type.TBoolean>;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
  /** Opaque Gateway-computed token for the job definition, excluding scheduler state. */
  configRevision: Type.TOptional<Type.TString>;
  schedule: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"at">;
    at: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"every">;
    everyMs: Type.TInteger;
    anchorMs: Type.TOptional<Type.TInteger>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"cron">;
    expr: Type.TString;
    tz: Type.TOptional<Type.TString>;
    staggerMs: Type.TOptional<Type.TInteger>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"on-exit">;
    command: Type.TString;
    cwd: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"stream">;
    command: Type.TArray<Type.TString>;
    cwd: Type.TOptional<Type.TString>;
    mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"line">, Type.TLiteral<"match">]>>;
    match: Type.TOptional<Type.TString>;
    batchMs: Type.TOptional<Type.TInteger>;
    maxBatchBytes: Type.TOptional<Type.TInteger>;
  }>]>;
  pacing: Type.TOptional<Type.TObject<{
    min: Type.TOptional<Type.TString>;
    max: Type.TOptional<Type.TString>;
  }>>;
  trigger: Type.TOptional<Type.TObject<{
    script: Type.TString;
    once: Type.TOptional<Type.TBoolean>;
  }>>;
  sessionTarget: Type.TUnion<[Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]>;
  wakeMode: Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>;
  payload: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"systemEvent">;
    text: Type.TString;
    toolsAllow: Type.TOptional<Type.TArray<Type.TString>>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"agentTurn">;
    message: Type.TString;
    model: Type.TOptional<Type.TString>;
    fallbacks: Type.TOptional<Type.TArray<Type.TString>>;
    thinking: Type.TOptional<Type.TString>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
    lightContext: Type.TOptional<Type.TBoolean>;
    toolsAllow: Type.TOptional<Type.TArray<Type.TString>>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"command">;
    argv: Type.TArray<Type.TString>;
    cwd: Type.TOptional<Type.TString>;
    env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    input: Type.TOptional<Type.TString>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
    outputMaxBytes: Type.TOptional<Type.TInteger>;
    toolsAllow: Type.TOptional<Type.TArray<Type.TString>>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"script">;
    script: Type.TString;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    toolBudget: Type.TOptional<Type.TInteger>;
    toolsAllow: Type.TOptional<Type.TArray<Type.TString>>;
    toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"heartbeat">;
  }>]>;
  delivery: Type.TOptional<Type.TUnion<[Type.TObject<{
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    accountId: Type.TOptional<Type.TString>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    }>>;
    mode: Type.TLiteral<"none">;
    to: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    accountId: Type.TOptional<Type.TString>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    }>>;
    mode: Type.TLiteral<"announce">;
    completionDestination: Type.TOptional<Type.TObject<{
      mode: Type.TLiteral<"webhook">;
      to: Type.TString;
    }>>;
    to: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    accountId: Type.TOptional<Type.TString>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    }>>;
    mode: Type.TLiteral<"webhook">;
    to: Type.TString;
  }>]>>;
  failureAlert: Type.TOptional<Type.TUnion<[Type.TLiteral<false>, Type.TObject<{
    after: Type.TOptional<Type.TInteger>;
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    to: Type.TOptional<Type.TString>;
    cooldownMs: Type.TOptional<Type.TInteger>;
    includeSkipped: Type.TOptional<Type.TBoolean>;
    mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    accountId: Type.TOptional<Type.TString>;
  }>]>>;
  state: Type.TObject<{
    lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
    lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
    lastFailureAlertAtMs: Type.TOptional<Type.TInteger>;
    lastTriggerEvalAtMs: Type.TOptional<Type.TInteger>;
    triggerEvalCount: Type.TOptional<Type.TInteger>;
    lastTriggerFireAtMs: Type.TOptional<Type.TInteger>;
    triggerState: Type.TOptional<Type.TUnknown>;
    streamStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"starting">, Type.TLiteral<"running">, Type.TLiteral<"restarting">, Type.TLiteral<"stopped">, Type.TLiteral<"disabled">, Type.TLiteral<"error">]>>;
    streamError: Type.TOptional<Type.TString>;
    streamConsecutiveFailures: Type.TOptional<Type.TInteger>;
    streamRestartExhausted: Type.TOptional<Type.TBoolean>;
    nextRunAtMs: Type.TOptional<Type.TInteger>;
    scheduleActivatedAtMs: Type.TOptional<Type.TInteger>;
    runningAtMs: Type.TOptional<Type.TInteger>;
    lastRunAtMs: Type.TOptional<Type.TInteger>;
    lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
    lastStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
    lastError: Type.TOptional<Type.TString>;
    lastDiagnostics: Type.TOptional<Type.TObject<{
      summary: Type.TOptional<Type.TString>;
      entries: Type.TArray<Type.TObject<{
        ts: Type.TInteger;
        source: Type.TUnion<[Type.TLiteral<"cron-preflight">, Type.TLiteral<"cron-setup">, Type.TLiteral<"model-preflight">, Type.TLiteral<"agent-run">, Type.TLiteral<"tool">, Type.TLiteral<"exec">, Type.TLiteral<"delivery">]>;
        severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"error">]>;
        message: Type.TString;
        toolName: Type.TOptional<Type.TString>;
        exitCode: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
        truncated: Type.TOptional<Type.TBoolean>;
      }>>;
    }>>;
    lastDiagnosticSummary: Type.TOptional<Type.TString>;
    lastErrorReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"tls_certificate">, Type.TLiteral<"context_overflow">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
    lastDurationMs: Type.TOptional<Type.TInteger>;
    consecutiveErrors: Type.TOptional<Type.TInteger>;
    scheduleErrorCount: Type.TOptional<Type.TInteger>;
    autoDisabled: Type.TOptional<Type.TObject<{
      reason: Type.TUnion<[Type.TLiteral<"consecutive-failures">, Type.TLiteral<"schedule-errors">]>;
      atMs: Type.TInteger;
      consecutiveErrors: Type.TInteger;
    }>>;
    consecutiveSkipped: Type.TOptional<Type.TInteger>;
    lastDelivered: Type.TOptional<Type.TBoolean>;
    lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    lastDeliveryError: Type.TOptional<Type.TString>;
    deliverySuppressionReason: Type.TOptional<Type.TString>;
    streamSourceIdentity: Type.TOptional<Type.TString>;
    streamDroppedBatches: Type.TOptional<Type.TInteger>;
    streamCoalescedBatches: Type.TOptional<Type.TInteger>;
    streamLastStartedAtMs: Type.TOptional<Type.TInteger>;
    streamLastExitAtMs: Type.TOptional<Type.TInteger>;
  }>;
  nextRunAtMs: Type.TOptional<Type.TInteger>;
  lastRunAtMs: Type.TOptional<Type.TInteger>;
  lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
  lastRunError: Type.TOptional<Type.TString>;
  lastDelivered: Type.TOptional<Type.TBoolean>;
  lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
  lastDeliveryError: Type.TOptional<Type.TString>;
  deliverySuppressionReason: Type.TOptional<Type.TString>;
  lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
  lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
  lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
}>;
/** Updates a cron job by id or legacy jobId alias. */
declare const CronUpdateParamsSchema: Type.TUnion<[Type.TObject<{
  id: Type.TString;
} & {
  readonly patch: Type.TObject<{
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    sessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    description: Type.TOptional<Type.TString>;
    enabled: Type.TOptional<Type.TBoolean>;
    deleteAfterRun: Type.TOptional<Type.TBoolean>;
    name: Type.TOptional<Type.TString>;
    displayName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    schedule: Type.TOptional<Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"at">;
      at: Type.TString;
    }>, Type.TObject<{
      kind: Type.TLiteral<"every">;
      everyMs: Type.TInteger;
      anchorMs: Type.TOptional<Type.TInteger>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"cron">;
      expr: Type.TString;
      tz: Type.TOptional<Type.TString>;
      staggerMs: Type.TOptional<Type.TInteger>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"on-exit">;
      command: Type.TString;
      cwd: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"stream">;
      command: Type.TArray<Type.TString>;
      cwd: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"line">, Type.TLiteral<"match">]>>;
      match: Type.TOptional<Type.TString>;
      batchMs: Type.TOptional<Type.TInteger>;
      maxBatchBytes: Type.TOptional<Type.TInteger>;
    }>]>>;
    pacing: Type.TOptional<Type.TUnion<[Type.TObject<{
      min: Type.TOptional<Type.TString>;
      max: Type.TOptional<Type.TString>;
    }>, Type.TNull]>>;
    trigger: Type.TOptional<Type.TUnion<[Type.TObject<{
      script: Type.TString;
      once: Type.TOptional<Type.TBoolean>;
    }>, Type.TNull]>>;
    sessionTarget: Type.TOptional<Type.TUnion<[Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]>>;
    wakeMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>>;
    payload: Type.TOptional<Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"systemEvent">;
      text: Type.TOptional<Type.TString>;
      toolsAllow: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"agentTurn">;
      message: Type.TOptional<Type.TString>;
      model: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      fallbacks: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
      thinking: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      timeoutSeconds: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
      allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
      lightContext: Type.TOptional<Type.TBoolean>;
      toolsAllow: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"command">;
      argv: Type.TOptional<Type.TArray<Type.TString>>;
      cwd: Type.TOptional<Type.TString>;
      env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
      input: Type.TOptional<Type.TString>;
      timeoutSeconds: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
      noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
      outputMaxBytes: Type.TOptional<Type.TInteger>;
      toolsAllow: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"script">;
      script: Type.TOptional<Type.TString>;
      timeoutSeconds: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
      toolBudget: Type.TOptional<Type.TInteger>;
      toolsAllow: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>]>>;
    delivery: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TUnion<[Type.TUnion<[Type.TLiteral<"last">, Type.TString]>, Type.TNull]>>;
      threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber, Type.TNull]>>;
      accountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      bestEffort: Type.TOptional<Type.TBoolean>;
      failureDestination: Type.TOptional<Type.TUnion<[Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TUnion<[Type.TLiteral<"last">, Type.TString]>, Type.TNull]>>;
        to: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        accountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">, Type.TNull]>>;
      }>, Type.TNull]>>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
      completionDestination: Type.TOptional<Type.TUnion<[Type.TObject<{
        mode: Type.TLiteral<"webhook">;
        to: Type.TString;
      }>, Type.TNull]>>;
      to: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    }>>;
    failureAlert: Type.TOptional<Type.TUnion<[Type.TLiteral<false>, Type.TObject<{
      after: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
      channel: Type.TOptional<Type.TUnion<[Type.TUnion<[Type.TLiteral<"last">, Type.TString]>, Type.TNull]>>;
      to: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      cooldownMs: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
      includeSkipped: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TNull]>>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">, Type.TNull]>>;
      accountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    }>, Type.TNull]>>;
    state: Type.TOptional<Type.TObject<{
      lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
      lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
      lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
      lastFailureAlertAtMs: Type.TOptional<Type.TInteger>;
      lastTriggerEvalAtMs: Type.TOptional<Type.TInteger>;
      triggerEvalCount: Type.TOptional<Type.TInteger>;
      lastTriggerFireAtMs: Type.TOptional<Type.TInteger>;
      triggerState: Type.TOptional<Type.TUnknown>;
      streamStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"starting">, Type.TLiteral<"running">, Type.TLiteral<"restarting">, Type.TLiteral<"stopped">, Type.TLiteral<"disabled">, Type.TLiteral<"error">]>>;
      streamError: Type.TOptional<Type.TString>;
      streamConsecutiveFailures: Type.TOptional<Type.TInteger>;
      streamRestartExhausted: Type.TOptional<Type.TBoolean>;
      nextRunAtMs: Type.TOptional<Type.TInteger>;
      runningAtMs: Type.TOptional<Type.TInteger>;
      lastRunAtMs: Type.TOptional<Type.TInteger>;
      lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
      lastStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
      lastError: Type.TOptional<Type.TString>;
      lastErrorReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"tls_certificate">, Type.TLiteral<"context_overflow">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
      lastDurationMs: Type.TOptional<Type.TInteger>;
      consecutiveErrors: Type.TOptional<Type.TInteger>;
      consecutiveSkipped: Type.TOptional<Type.TInteger>;
      lastDelivered: Type.TOptional<Type.TBoolean>;
      lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
      lastDeliveryError: Type.TOptional<Type.TString>;
      streamDroppedBatches: Type.TOptional<Type.TInteger>;
      streamCoalescedBatches: Type.TOptional<Type.TInteger>;
      streamLastStartedAtMs: Type.TOptional<Type.TInteger>;
      streamLastExitAtMs: Type.TOptional<Type.TInteger>;
    }>>;
  }>;
  /** Rejects the patch when the current definition does not match the caller's token. */
  readonly expectedConfigRevision: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  jobId: Type.TString;
} & {
  readonly patch: Type.TObject<{
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    sessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    description: Type.TOptional<Type.TString>;
    enabled: Type.TOptional<Type.TBoolean>;
    deleteAfterRun: Type.TOptional<Type.TBoolean>;
    name: Type.TOptional<Type.TString>;
    displayName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    schedule: Type.TOptional<Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"at">;
      at: Type.TString;
    }>, Type.TObject<{
      kind: Type.TLiteral<"every">;
      everyMs: Type.TInteger;
      anchorMs: Type.TOptional<Type.TInteger>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"cron">;
      expr: Type.TString;
      tz: Type.TOptional<Type.TString>;
      staggerMs: Type.TOptional<Type.TInteger>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"on-exit">;
      command: Type.TString;
      cwd: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"stream">;
      command: Type.TArray<Type.TString>;
      cwd: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"line">, Type.TLiteral<"match">]>>;
      match: Type.TOptional<Type.TString>;
      batchMs: Type.TOptional<Type.TInteger>;
      maxBatchBytes: Type.TOptional<Type.TInteger>;
    }>]>>;
    pacing: Type.TOptional<Type.TUnion<[Type.TObject<{
      min: Type.TOptional<Type.TString>;
      max: Type.TOptional<Type.TString>;
    }>, Type.TNull]>>;
    trigger: Type.TOptional<Type.TUnion<[Type.TObject<{
      script: Type.TString;
      once: Type.TOptional<Type.TBoolean>;
    }>, Type.TNull]>>;
    sessionTarget: Type.TOptional<Type.TUnion<[Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]>>;
    wakeMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>>;
    payload: Type.TOptional<Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"systemEvent">;
      text: Type.TOptional<Type.TString>;
      toolsAllow: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"agentTurn">;
      message: Type.TOptional<Type.TString>;
      model: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      fallbacks: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
      thinking: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      timeoutSeconds: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
      allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
      lightContext: Type.TOptional<Type.TBoolean>;
      toolsAllow: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"command">;
      argv: Type.TOptional<Type.TArray<Type.TString>>;
      cwd: Type.TOptional<Type.TString>;
      env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
      input: Type.TOptional<Type.TString>;
      timeoutSeconds: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
      noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
      outputMaxBytes: Type.TOptional<Type.TInteger>;
      toolsAllow: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"script">;
      script: Type.TOptional<Type.TString>;
      timeoutSeconds: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
      toolBudget: Type.TOptional<Type.TInteger>;
      toolsAllow: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
      toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
    }>]>>;
    delivery: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TUnion<[Type.TUnion<[Type.TLiteral<"last">, Type.TString]>, Type.TNull]>>;
      threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber, Type.TNull]>>;
      accountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      bestEffort: Type.TOptional<Type.TBoolean>;
      failureDestination: Type.TOptional<Type.TUnion<[Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TUnion<[Type.TLiteral<"last">, Type.TString]>, Type.TNull]>>;
        to: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        accountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">, Type.TNull]>>;
      }>, Type.TNull]>>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
      completionDestination: Type.TOptional<Type.TUnion<[Type.TObject<{
        mode: Type.TLiteral<"webhook">;
        to: Type.TString;
      }>, Type.TNull]>>;
      to: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    }>>;
    failureAlert: Type.TOptional<Type.TUnion<[Type.TLiteral<false>, Type.TObject<{
      after: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
      channel: Type.TOptional<Type.TUnion<[Type.TUnion<[Type.TLiteral<"last">, Type.TString]>, Type.TNull]>>;
      to: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      cooldownMs: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
      includeSkipped: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TNull]>>;
      mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">, Type.TNull]>>;
      accountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    }>, Type.TNull]>>;
    state: Type.TOptional<Type.TObject<{
      lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
      lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
      lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
      lastFailureAlertAtMs: Type.TOptional<Type.TInteger>;
      lastTriggerEvalAtMs: Type.TOptional<Type.TInteger>;
      triggerEvalCount: Type.TOptional<Type.TInteger>;
      lastTriggerFireAtMs: Type.TOptional<Type.TInteger>;
      triggerState: Type.TOptional<Type.TUnknown>;
      streamStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"starting">, Type.TLiteral<"running">, Type.TLiteral<"restarting">, Type.TLiteral<"stopped">, Type.TLiteral<"disabled">, Type.TLiteral<"error">]>>;
      streamError: Type.TOptional<Type.TString>;
      streamConsecutiveFailures: Type.TOptional<Type.TInteger>;
      streamRestartExhausted: Type.TOptional<Type.TBoolean>;
      nextRunAtMs: Type.TOptional<Type.TInteger>;
      runningAtMs: Type.TOptional<Type.TInteger>;
      lastRunAtMs: Type.TOptional<Type.TInteger>;
      lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
      lastStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
      lastError: Type.TOptional<Type.TString>;
      lastErrorReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"tls_certificate">, Type.TLiteral<"context_overflow">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
      lastDurationMs: Type.TOptional<Type.TInteger>;
      consecutiveErrors: Type.TOptional<Type.TInteger>;
      consecutiveSkipped: Type.TOptional<Type.TInteger>;
      lastDelivered: Type.TOptional<Type.TBoolean>;
      lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
      lastDeliveryError: Type.TOptional<Type.TString>;
      streamDroppedBatches: Type.TOptional<Type.TInteger>;
      streamCoalescedBatches: Type.TOptional<Type.TInteger>;
      streamLastStartedAtMs: Type.TOptional<Type.TInteger>;
      streamLastExitAtMs: Type.TOptional<Type.TInteger>;
    }>>;
  }>;
  /** Rejects the patch when the current definition does not match the caller's token. */
  readonly expectedConfigRevision: Type.TOptional<Type.TString>;
}>]>;
/** One persisted cron run history entry. */
declare const CronRunLogEntrySchema: Type.TObject<{
  ts: Type.TInteger;
  jobId: Type.TString;
  action: Type.TLiteral<"finished">;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
  completionStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"succeeded">, Type.TLiteral<"failed">, Type.TLiteral<"unknown">]>>;
  error: Type.TOptional<Type.TString>;
  errorReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"tls_certificate">, Type.TLiteral<"context_overflow">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
  summary: Type.TOptional<Type.TString>;
  diagnostics: Type.TOptional<Type.TObject<{
    summary: Type.TOptional<Type.TString>;
    entries: Type.TArray<Type.TObject<{
      ts: Type.TInteger;
      source: Type.TUnion<[Type.TLiteral<"cron-preflight">, Type.TLiteral<"cron-setup">, Type.TLiteral<"model-preflight">, Type.TLiteral<"agent-run">, Type.TLiteral<"tool">, Type.TLiteral<"exec">, Type.TLiteral<"delivery">]>;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"error">]>;
      message: Type.TString;
      toolName: Type.TOptional<Type.TString>;
      exitCode: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
      truncated: Type.TOptional<Type.TBoolean>;
    }>>;
  }>>;
  delivered: Type.TOptional<Type.TBoolean>;
  deliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
  deliveryError: Type.TOptional<Type.TString>;
  deliverySuppressionReason: Type.TOptional<Type.TString>;
  failureNotificationDelivery: Type.TOptional<Type.TObject<{
    delivered: Type.TOptional<Type.TBoolean>;
    status: Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>;
    error: Type.TOptional<Type.TString>;
  }>>;
  delivery: Type.TOptional<Type.TObject<{
    intended: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TString>;
      to: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      accountId: Type.TOptional<Type.TString>;
      threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
      source: Type.TOptional<Type.TUnion<[Type.TLiteral<"explicit">, Type.TLiteral<"last">]>>;
    }>>;
    resolved: Type.TOptional<Type.TObject<{
      channel: Type.TOptional<Type.TString>;
      to: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      accountId: Type.TOptional<Type.TString>;
      threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
      source: Type.TOptional<Type.TUnion<[Type.TLiteral<"explicit">, Type.TLiteral<"last">]>>;
      ok: Type.TBoolean;
      error: Type.TOptional<Type.TString>;
    }>>;
    messageToolSentTo: Type.TOptional<Type.TArray<Type.TObject<{
      channel: Type.TString;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      threadId: Type.TOptional<Type.TString>;
    }>>>;
    fallbackUsed: Type.TOptional<Type.TBoolean>;
    delivered: Type.TOptional<Type.TBoolean>;
  }>>;
  sessionId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  runAtMs: Type.TOptional<Type.TInteger>;
  durationMs: Type.TOptional<Type.TInteger>;
  nextRunAtMs: Type.TOptional<Type.TInteger>;
  triggerFired: Type.TOptional<Type.TBoolean>;
  model: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  usage: Type.TOptional<Type.TObject<{
    input_tokens: Type.TOptional<Type.TNumber>;
    output_tokens: Type.TOptional<Type.TNumber>;
    total_tokens: Type.TOptional<Type.TNumber>;
    cache_read_tokens: Type.TOptional<Type.TNumber>;
    cache_write_tokens: Type.TOptional<Type.TNumber>;
  }>>;
  jobName: Type.TOptional<Type.TString>;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/cron.types.d.ts
type CronJob = Static<typeof CronJobSchema>;
type CronUpdateParams = Static<typeof CronUpdateParamsSchema>;
type CronRunLogEntry = Static<typeof CronRunLogEntrySchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/environments.d.ts
/** Operational desktop state reported by the current native node connection. */
declare const DesktopAvailabilitySchema: Type.TObject<{
  state: Type.TUnion<[Type.TLiteral<"locked">, Type.TLiteral<"unlocked">, Type.TLiteral<"unknown">]>;
}>;
type DesktopAvailability = Static<typeof DesktopAvailabilitySchema>;
/** Durable lifecycle states for plugin-provisioned worker environments. */
declare const WorkerEnvironmentStateSchema: Type.TUnion<[Type.TLiteral<"requested">, Type.TLiteral<"provisioning">, Type.TLiteral<"bootstrapping">, Type.TLiteral<"ready">, Type.TLiteral<"attached">, Type.TLiteral<"idle">, Type.TLiteral<"draining">, Type.TLiteral<"destroying">, Type.TLiteral<"destroyed">, Type.TLiteral<"failed">, Type.TLiteral<"orphaned">]>;
/** Process-local SSH tunnel connectivity for a worker environment. */
declare const WorkerTunnelStatusSchema: Type.TUnion<[Type.TLiteral<"stopped">, Type.TLiteral<"connecting">, Type.TLiteral<"connected">, Type.TLiteral<"reconnecting">]>;
/** Placement execution modes shared by runtime requirements and worker providers. */
declare const WorkerExecutionModeSchema: Type.TUnion<[Type.TLiteral<"worker-turn">, Type.TLiteral<"remote-exec">]>;
declare const WorkerDesktopLaunchResultSchema: Type.TObject<{
  app: Type.TUnion<[Type.TLiteral<"browser">, Type.TLiteral<"terminal">]>;
  status: Type.TLiteral<"ready">;
}>;
type WorkerEnvironmentState = Static<typeof WorkerEnvironmentStateSchema>;
type WorkerTunnelStatus = Static<typeof WorkerTunnelStatusSchema>;
type WorkerExecutionMode = Static<typeof WorkerExecutionModeSchema>;
type WorkerDesktopLaunchResult = Static<typeof WorkerDesktopLaunchResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/devices.d.ts
declare const ScopeUpgradeResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"approved">;
  requestId: Type.TString;
  deviceToken: Type.TString;
  scopes: Type.TArray<Type.TString>;
}>, Type.TObject<{
  status: Type.TLiteral<"rejected">;
  requestId: Type.TString;
}>, Type.TObject<{
  status: Type.TLiteral<"expired">;
  requestId: Type.TString;
}>]>;
type ScopeUpgradeResult = Static<typeof ScopeUpgradeResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/human-mentions.d.ts
/** Explicit selections bound to UTF-16 offsets in the submitted message text. */
declare const HumanMentionSchema: Type.TObject<{
  profileId: Type.TString;
  start: Type.TInteger;
  end: Type.TInteger;
}>;
declare const UsersMentionableParamsSchema: Type.TUnion<[Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  query: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  agentId: Type.TString;
  visibility: Type.TOptional<Type.TUnion<[Type.TLiteral<"shared">, Type.TLiteral<"read-only">, Type.TLiteral<"suggest">, Type.TLiteral<"draft">]>>;
  query: Type.TOptional<Type.TString>;
}>]>;
declare const UsersMentionableResultSchema: Type.TObject<{
  users: Type.TArray<Type.TObject<{
    profileId: Type.TString;
    displayName: Type.TString;
    avatarUrl: Type.TOptional<Type.TString>;
    online: Type.TBoolean;
  }>>;
  truncated: Type.TBoolean;
}>;
declare const MentionsListResultSchema: Type.TObject<{
  gatewayInstanceId: Type.TString;
  revision: Type.TInteger;
  items: Type.TArray<Type.TObject<{
    id: Type.TString;
    senderProfileId: Type.TString;
    senderLabel: Type.TString;
    senderAvatarUrl: Type.TOptional<Type.TString>;
    sessionKey: Type.TString;
    agentId: Type.TString;
    sessionTitle: Type.TString;
    messageId: Type.TString;
    createdAt: Type.TInteger;
    expiresAt: Type.TInteger;
    excerpt: Type.TOptional<Type.TString>;
  }>>;
}>;
type HumanMention = Static<typeof HumanMentionSchema>;
type UsersMentionableParams = Static<typeof UsersMentionableParamsSchema>;
type UsersMentionableResult = Static<typeof UsersMentionableResultSchema>;
type MentionsListResult = Static<typeof MentionsListResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/logs-chat.d.ts
declare const AgentActivityItemSchema: Type.TObject<{
  itemId: Type.TString;
  phase: Type.TUnion<[Type.TLiteral<"start">, Type.TLiteral<"update">, Type.TLiteral<"end">]>;
  kind: Type.TString;
  title: Type.TString;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"blocked">, Type.TLiteral<"skipped">]>>;
  name: Type.TOptional<Type.TString>;
  meta: Type.TOptional<Type.TString>;
  commandBearing: Type.TOptional<Type.TBoolean>;
  toolCallId: Type.TOptional<Type.TString>;
  startedAt: Type.TOptional<Type.TNumber>;
  endedAt: Type.TOptional<Type.TNumber>;
  error: Type.TOptional<Type.TString>;
  summary: Type.TOptional<Type.TString>;
  progressText: Type.TOptional<Type.TString>;
  suppressChannelProgress: Type.TOptional<Type.TBoolean>;
  hideFromChannelProgress: Type.TOptional<Type.TBoolean>;
  approvalId: Type.TOptional<Type.TString>;
  approvalSlug: Type.TOptional<Type.TString>;
}>;
type AgentActivityItem = Static<typeof AgentActivityItemSchema>;
declare const QUEUE_MODES: readonly ["steer", "followup", "collect", "interrupt"];
type QueueMode = (typeof QUEUE_MODES)[number];
//#endregion
//#region packages/gateway-protocol/src/schema/nodes.d.ts
declare const NodeHostStatsPayloadSchema: Type.TRefine<Type.TObject<{
  cpuCount: Type.TInteger;
  loadAverage: Type.TOptional<Type.TTuple<[Type.TNumber, Type.TNumber, Type.TNumber]>>;
  memoryTotalBytes: Type.TInteger;
  memoryFreeBytes: Type.TInteger;
  diskTotalBytes: Type.TOptional<Type.TInteger>;
  diskAvailableBytes: Type.TOptional<Type.TInteger>;
}>>;
/** Agent-visible tool descriptor advertised by a connected node. */
declare const NodePluginToolDescriptorSchema: Type.TObject<{
  pluginId: Type.TString;
  name: Type.TString;
  description: Type.TString;
  parameters: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  command: Type.TOptional<Type.TString>;
  mcp: Type.TOptional<Type.TObject<{
    server: Type.TString;
    tool: Type.TString;
  }>>;
}>;
type NodePluginToolDescriptor = Static<typeof NodePluginToolDescriptorSchema>;
/** Agent-visible skill descriptor advertised by a connected node. */
declare const NodeSkillDescriptorSchema: Type.TObject<{
  name: Type.TString;
  description: Type.TString;
  content: Type.TString;
}>;
type NodeSkillDescriptor = Static<typeof NodeSkillDescriptorSchema>;
type NodeHostStatsPayload = Static<typeof NodeHostStatsPayloadSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/questions.d.ts
/** Canonical normalized question shown to an operator. */
declare const QuestionSchema: Type.TObject<{
  questionId: Type.TString;
  header: Type.TString;
  question: Type.TString;
  url: Type.TOptional<Type.TString>;
  options: Type.TArray<Type.TObject<{
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
    value: Type.TOptional<Type.TString>;
    thumbnail: Type.TOptional<Type.TString>;
    resourceUri: Type.TOptional<Type.TString>;
    preview: Type.TOptional<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"mcp_app_tool">;
      name: Type.TString;
      arguments: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    }>, Type.TObject<{
      type: Type.TLiteral<"resource_link">;
      uri: Type.TString;
      name: Type.TString;
      title: Type.TOptional<Type.TString>;
      description: Type.TOptional<Type.TString>;
      mimeType: Type.TOptional<Type.TString>;
    }>]>>;
  }>>;
  presentation: Type.TOptional<Type.TLiteral<"form">>;
  resource: Type.TOptional<Type.TObject<{
    viewId: Type.TOptional<Type.TString>;
    selection: Type.TUnion<[Type.TLiteral<"explicit">, Type.TLiteral<"implicit">]>;
    userOptions: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
      accept: Type.TOptional<Type.TArray<Type.TString>>;
    }>>;
  }>>;
  multiSelect: Type.TOptional<Type.TBoolean>;
  answerFormat: Type.TOptional<Type.TLiteral<"lines">>;
  allowEmpty: Type.TOptional<Type.TBoolean>;
  defaultAnswers: Type.TOptional<Type.TArray<Type.TString>>;
  isOther: Type.TOptional<Type.TBoolean>;
  isSecret: Type.TOptional<Type.TBoolean>;
  secretStore: Type.TOptional<Type.TObject<{
    name: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"secret">, Type.TLiteral<"env">]>;
    allowedHosts: Type.TOptional<Type.TArray<Type.TString>>;
    reason: Type.TOptional<Type.TString>;
  }>>;
  secretStoreExisting: Type.TOptional<Type.TObject<{
    updatedAtMs: Type.TInteger;
    updatedBy: Type.TOptional<Type.TString>;
  }>>;
}>;
declare const QuestionAnswersSchema: Type.TObject<{
  answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
}>;
/**
 * One pending or recently resolved transient question request. Flat object with
 * optional terminal fields (exec-approval record precedent): native protocol
 * codegen cannot emit per-status object unions, and the manager owns the
 * status/answers invariant (answers present only when status is "answered").
 */
declare const QuestionRecordSchema: Type.TObject<{
  id: Type.TString;
  questions: Type.TArray<Type.TObject<{
    questionId: Type.TString;
    header: Type.TString;
    question: Type.TString;
    url: Type.TOptional<Type.TString>;
    options: Type.TArray<Type.TObject<{
      label: Type.TString;
      description: Type.TOptional<Type.TString>;
      value: Type.TOptional<Type.TString>;
      thumbnail: Type.TOptional<Type.TString>;
      resourceUri: Type.TOptional<Type.TString>;
      preview: Type.TOptional<Type.TUnion<[Type.TObject<{
        type: Type.TLiteral<"mcp_app_tool">;
        name: Type.TString;
        arguments: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
      }>, Type.TObject<{
        type: Type.TLiteral<"resource_link">;
        uri: Type.TString;
        name: Type.TString;
        title: Type.TOptional<Type.TString>;
        description: Type.TOptional<Type.TString>;
        mimeType: Type.TOptional<Type.TString>;
      }>]>>;
    }>>;
    presentation: Type.TOptional<Type.TLiteral<"form">>;
    resource: Type.TOptional<Type.TObject<{
      viewId: Type.TOptional<Type.TString>;
      selection: Type.TUnion<[Type.TLiteral<"explicit">, Type.TLiteral<"implicit">]>;
      userOptions: Type.TOptional<Type.TObject<{
        kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
        accept: Type.TOptional<Type.TArray<Type.TString>>;
      }>>;
    }>>;
    multiSelect: Type.TOptional<Type.TBoolean>;
    answerFormat: Type.TOptional<Type.TLiteral<"lines">>;
    allowEmpty: Type.TOptional<Type.TBoolean>;
    defaultAnswers: Type.TOptional<Type.TArray<Type.TString>>;
    isOther: Type.TOptional<Type.TBoolean>;
    isSecret: Type.TOptional<Type.TBoolean>;
    secretStore: Type.TOptional<Type.TObject<{
      name: Type.TString;
      kind: Type.TUnion<[Type.TLiteral<"secret">, Type.TLiteral<"env">]>;
      allowedHosts: Type.TOptional<Type.TArray<Type.TString>>;
      reason: Type.TOptional<Type.TString>;
    }>>;
    secretStoreExisting: Type.TOptional<Type.TObject<{
      updatedAtMs: Type.TInteger;
      updatedBy: Type.TOptional<Type.TString>;
    }>>;
  }>>;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"answered">, Type.TLiteral<"cancelled">, Type.TLiteral<"expired">]>;
  answers: Type.TOptional<Type.TObject<{
    answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
  }>>;
  resolvedBy: Type.TOptional<Type.TString>;
}>;
declare const QuestionWaitAnswerResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"pending">;
}>, Type.TObject<{
  status: Type.TLiteral<"answered">;
  answers: Type.TObject<{
    answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
  }>;
  resolutionId: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  status: Type.TLiteral<"cancelled">;
}>, Type.TObject<{
  status: Type.TLiteral<"expired">;
}>]>;
declare const QuestionResolveResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"answered">;
  answers: Type.TObject<{
    answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
  }>;
}>, Type.TObject<{
  status: Type.TLiteral<"cancelled">;
}>]>;
declare const QuestionResolvedEventSchema: Type.TUnion<[Type.TObject<{
  id: Type.TString;
  status: Type.TLiteral<"answered">;
  answers: Type.TObject<{
    answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
  }>;
}>, Type.TObject<{
  id: Type.TString;
  status: Type.TLiteral<"cancelled">;
}>, Type.TObject<{
  id: Type.TString;
  status: Type.TLiteral<"expired">;
}>]>;
type Question = Static<typeof QuestionSchema>;
type QuestionAnswers = Static<typeof QuestionAnswersSchema>;
type QuestionRecord = Static<typeof QuestionRecordSchema>;
type QuestionWaitAnswerResult = Static<typeof QuestionWaitAnswerResultSchema>;
type QuestionResolveResult = Static<typeof QuestionResolveResultSchema>;
type QuestionResolvedEvent = Static<typeof QuestionResolvedEventSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/snapshot.d.ts
/**
 * Gateway state snapshot schemas.
 *
 * Snapshots are sent during hello and later event streams; they summarize node
 * presence, health, session defaults, and version counters for clients.
 */
/** One gateway-visible presence record for a node/client/runtime. */
declare const PresenceEntrySchema: Type.TObject<{
  /** Gateway-assigned id for this connection; changes after reconnect. */
  connectionId: Type.TOptional<Type.TString>;
  host: Type.TOptional<Type.TString>;
  clientId: Type.TOptional<Type.TString>;
  ip: Type.TOptional<Type.TString>;
  version: Type.TOptional<Type.TString>;
  platform: Type.TOptional<Type.TString>;
  deviceFamily: Type.TOptional<Type.TString>;
  modelIdentifier: Type.TOptional<Type.TString>;
  timeZone: Type.TOptional<Type.TString>;
  mode: Type.TOptional<Type.TString>;
  lastInputSeconds: Type.TOptional<Type.TInteger>;
  reason: Type.TOptional<Type.TString>;
  tags: Type.TOptional<Type.TArray<Type.TString>>;
  text: Type.TOptional<Type.TString>;
  /** Heartbeat freshness, not online duration or user activity. */
  ts: Type.TInteger;
  /** Server timestamps for the person's continuous online interval and last accepted activity. */
  onlineSince: Type.TOptional<Type.TInteger>;
  lastActivityAt: Type.TOptional<Type.TInteger>;
  /** Latest accepted OpenClaw interaction on this connection, independent of person timing. */
  connectionLastActivityAt: Type.TOptional<Type.TInteger>;
  deviceId: Type.TOptional<Type.TString>;
  roles: Type.TOptional<Type.TArray<Type.TString>>;
  scopes: Type.TOptional<Type.TArray<Type.TString>>;
  instanceId: Type.TOptional<Type.TString>;
  user: Type.TOptional<Type.TObject<{
    /** Canonical profile id when resolved, otherwise authenticated identity; grouping also uses identity qualification. */
    id: Type.TString;
    identity: Type.TOptional<Type.TObject<{
      type: Type.TLiteral<"profile">;
      id: Type.TString;
    }>>;
    email: Type.TOptional<Type.TString>;
    name: Type.TOptional<Type.TString>;
    avatarUrl: Type.TOptional<Type.TString>;
  }>>;
  /** Sessions this connection declares it is viewing, independent of transport subscriptions. Sorted lexicographically. */
  watchedSessions: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Initial and incremental gateway state snapshot payload. */
declare const SnapshotSchema: Type.TObject<{
  suspension: Type.TOptional<Type.TObject<{
    phase: Type.TUnion<[Type.TLiteral<"accepting">, Type.TLiteral<"preparing">, Type.TLiteral<"draining">, Type.TLiteral<"prepared">]>;
  }>>;
  presence: Type.TArray<Type.TObject<{
    /** Gateway-assigned id for this connection; changes after reconnect. */
    connectionId: Type.TOptional<Type.TString>;
    host: Type.TOptional<Type.TString>;
    clientId: Type.TOptional<Type.TString>;
    ip: Type.TOptional<Type.TString>;
    version: Type.TOptional<Type.TString>;
    platform: Type.TOptional<Type.TString>;
    deviceFamily: Type.TOptional<Type.TString>;
    modelIdentifier: Type.TOptional<Type.TString>;
    timeZone: Type.TOptional<Type.TString>;
    mode: Type.TOptional<Type.TString>;
    lastInputSeconds: Type.TOptional<Type.TInteger>;
    reason: Type.TOptional<Type.TString>;
    tags: Type.TOptional<Type.TArray<Type.TString>>;
    text: Type.TOptional<Type.TString>;
    /** Heartbeat freshness, not online duration or user activity. */
    ts: Type.TInteger;
    /** Server timestamps for the person's continuous online interval and last accepted activity. */
    onlineSince: Type.TOptional<Type.TInteger>;
    lastActivityAt: Type.TOptional<Type.TInteger>;
    /** Latest accepted OpenClaw interaction on this connection, independent of person timing. */
    connectionLastActivityAt: Type.TOptional<Type.TInteger>;
    deviceId: Type.TOptional<Type.TString>;
    roles: Type.TOptional<Type.TArray<Type.TString>>;
    scopes: Type.TOptional<Type.TArray<Type.TString>>;
    instanceId: Type.TOptional<Type.TString>;
    user: Type.TOptional<Type.TObject<{
      /** Canonical profile id when resolved, otherwise authenticated identity; grouping also uses identity qualification. */
      id: Type.TString;
      identity: Type.TOptional<Type.TObject<{
        type: Type.TLiteral<"profile">;
        id: Type.TString;
      }>>;
      email: Type.TOptional<Type.TString>;
      name: Type.TOptional<Type.TString>;
      avatarUrl: Type.TOptional<Type.TString>;
    }>>;
    /** Sessions this connection declares it is viewing, independent of transport subscriptions. Sorted lexicographically. */
    watchedSessions: Type.TOptional<Type.TArray<Type.TString>>;
  }>>;
  health: Type.TObject<{
    ok: Type.TOptional<Type.TLiteral<true>>;
    ts: Type.TOptional<Type.TInteger>;
    durationMs: Type.TOptional<Type.TInteger>;
    eventLoop: Type.TOptional<Type.TObject<{
      degraded: Type.TBoolean;
      degradedSinceMs: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
      reasons: Type.TArray<Type.TUnion<[Type.TLiteral<"event_loop_delay">, Type.TLiteral<"event_loop_utilization">, Type.TLiteral<"cpu">]>>;
      intervalMs: Type.TNumber;
      delayP99Ms: Type.TNumber;
      delayMaxMs: Type.TNumber;
      utilization: Type.TNumber;
      cpuCoreRatio: Type.TNumber;
      cpuBreakdown: Type.TOptional<Type.TObject<{
        mainThreadCoreRatio: Type.TOptional<Type.TNumber>;
        workerCoreRatio: Type.TOptional<Type.TNumber>;
        otherThreadsCoreRatio: Type.TOptional<Type.TNumber>;
        hostUtilization: Type.TOptional<Type.TNumber>;
        hostCpuCount: Type.TOptional<Type.TInteger>;
      }>>;
    }>>;
    plugins: Type.TOptional<Type.TObject<{
      loaded: Type.TArray<Type.TString>;
      errors: Type.TArray<Type.TObject<{
        id: Type.TString;
        origin: Type.TString;
        activated: Type.TBoolean;
        activationSource: Type.TOptional<Type.TString>;
        activationReason: Type.TOptional<Type.TString>;
        failurePhase: Type.TOptional<Type.TString>;
        error: Type.TString;
      }>>;
      unavailable: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TString;
        state: Type.TLiteral<"configured-unavailable">;
        diagnostic: Type.TObject<{
          kind: Type.TLiteral<"plugin-verification">;
          reason: Type.TString;
          detail: Type.TString;
        }>;
      }>>>;
    }>>;
    contextEngines: Type.TOptional<Type.TObject<{
      quarantined: Type.TArray<Type.TObject<{
        engineId: Type.TString;
        owner: Type.TOptional<Type.TString>;
        operation: Type.TString;
        reason: Type.TString;
        failedAt: Type.TInteger;
      }>>;
    }>>;
    deliveryQueues: Type.TOptional<Type.TObject<{
      failed: Type.TArray<Type.TObject<{
        queueName: Type.TString;
        count: Type.TInteger;
        oldestFailedAt: Type.TOptional<Type.TInteger>;
      }>>;
      ingressFailed: Type.TOptional<Type.TArray<Type.TObject<{
        channelId: Type.TString;
        accountId: Type.TString;
        count: Type.TInteger;
        oldestFailedAt: Type.TOptional<Type.TInteger>;
      }>>>;
      ingressPressure: Type.TOptional<Type.TArray<Type.TObject<{
        channelId: Type.TString;
        accountId: Type.TString;
        laneCount: Type.TInteger;
        pendingCount: Type.TInteger;
        claimedCount: Type.TInteger;
        blockedCount: Type.TInteger;
        oldestReceivedAt: Type.TInteger;
      }>>>;
    }>>;
    modelPricing: Type.TOptional<Type.TObject<{
      state: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"degraded">, Type.TLiteral<"disabled">]>;
      sources: Type.TArray<Type.TObject<{
        source: Type.TUnion<[Type.TLiteral<"openrouter">, Type.TLiteral<"litellm">, Type.TLiteral<"bootstrap">, Type.TLiteral<"refresh">]>;
        state: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"degraded">]>;
        lastFailureAt: Type.TOptional<Type.TInteger>;
        detail: Type.TOptional<Type.TString>;
      }>>;
      lastFailureAt: Type.TOptional<Type.TInteger>;
      detail: Type.TOptional<Type.TString>;
    }>>;
    configReload: Type.TOptional<Type.TObject<{
      hotReloadStatus: Type.TUnion<[Type.TLiteral<"active">, Type.TLiteral<"disabled">]>;
    }>>;
    childRuntime: Type.TOptional<Type.TObject<{
      execPath: Type.TString;
      available: Type.TBoolean;
    }>>;
    channels: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    channelOrder: Type.TOptional<Type.TArray<Type.TString>>;
    channelLabels: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    heartbeatSeconds: Type.TOptional<Type.TInteger>;
    defaultAgentId: Type.TOptional<Type.TString>;
    agents: Type.TOptional<Type.TArray<Type.TObject<{
      agentId: Type.TString;
      name: Type.TOptional<Type.TString>;
      isDefault: Type.TBoolean;
      heartbeat: Type.TObject<{
        enabled: Type.TBoolean;
        every: Type.TString;
        everyMs: Type.TUnion<[Type.TInteger, Type.TNull]>;
        prompt: Type.TString;
        target: Type.TString;
        model: Type.TOptional<Type.TString>;
        session: Type.TOptional<Type.TString>;
        ackMaxChars: Type.TInteger;
      }>;
      sessions: Type.TObject<{
        path: Type.TString;
        count: Type.TInteger;
        recent: Type.TArray<Type.TObject<{
          key: Type.TString;
          updatedAt: Type.TUnion<[Type.TInteger, Type.TNull]>;
          age: Type.TUnion<[Type.TInteger, Type.TNull]>;
        }>>;
      }>;
    }>>>;
    sessions: Type.TOptional<Type.TObject<{
      path: Type.TString;
      count: Type.TInteger;
      recent: Type.TArray<Type.TObject<{
        key: Type.TString;
        updatedAt: Type.TUnion<[Type.TInteger, Type.TNull]>;
        age: Type.TUnion<[Type.TInteger, Type.TNull]>;
      }>>;
    }>>;
  }>;
  stateVersion: Type.TObject<{
    presence: Type.TInteger;
    health: Type.TInteger;
  }>;
  uptimeMs: Type.TInteger;
  /** Resolved source-config revision accepted by the active Gateway runtime. */
  appliedConfigHash: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  configPath: Type.TOptional<Type.TString>;
  stateDir: Type.TOptional<Type.TString>;
  sessionDefaults: Type.TOptional<Type.TObject<{
    defaultAgentId: Type.TString;
    modelConfigured: Type.TOptional<Type.TBoolean>;
    ownership: Type.TOptional<Type.TUnion<[Type.TLiteral<"sole">, Type.TLiteral<"legacy">, Type.TLiteral<"explicit">]>>;
    selectionRequired: Type.TOptional<Type.TBoolean>;
    mainKey: Type.TString;
    mainSessionKey: Type.TString;
    scope: Type.TOptional<Type.TString>;
  }>>;
  /** Credential-free browser sign-in endpoint advertised to authenticated operators. */
  controlUiIdentityUrl: Type.TOptional<Type.TString>;
  authMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"token">, Type.TLiteral<"password">, Type.TLiteral<"trusted-proxy">]>>;
  updateAvailable: Type.TOptional<Type.TObject<{
    currentVersion: Type.TString;
    latestVersion: Type.TString;
    channel: Type.TString;
    currentSha: Type.TOptional<Type.TString>;
    upstreamRef: Type.TOptional<Type.TString>;
    upstreamSha: Type.TOptional<Type.TString>;
    repositoryUrl: Type.TOptional<Type.TString>;
    commitsBehind: Type.TOptional<Type.TInteger>;
    commits: Type.TOptional<Type.TArray<Type.TObject<{
      sha: Type.TString;
      subject: Type.TString;
    }>>>;
  }>>;
  updateSchedule: Type.TOptional<Type.TObject<{
    channel: Type.TString;
    autoEnabled: Type.TBoolean;
    install: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"package">, Type.TLiteral<"git">, Type.TLiteral<"immutable">, Type.TLiteral<"unknown">]>;
      git: Type.TOptional<Type.TUnion<[Type.TObject<{
        currentSha: Type.TOptional<Type.TString>;
        upstreamSha: Type.TOptional<Type.TString>;
        repositoryUrl: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
        status: Type.TLiteral<"current">;
      }>, Type.TObject<{
        currentSha: Type.TOptional<Type.TString>;
        upstreamSha: Type.TOptional<Type.TString>;
        repositoryUrl: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
        status: Type.TLiteral<"behind">;
        commitsBehind: Type.TInteger;
      }>, Type.TObject<{
        currentSha: Type.TOptional<Type.TString>;
        upstreamSha: Type.TOptional<Type.TString>;
        repositoryUrl: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
        status: Type.TLiteral<"ahead">;
        commitsAhead: Type.TInteger;
      }>, Type.TObject<{
        currentSha: Type.TOptional<Type.TString>;
        upstreamSha: Type.TOptional<Type.TString>;
        repositoryUrl: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
        status: Type.TLiteral<"diverged">;
        commitsAhead: Type.TInteger;
        commitsBehind: Type.TInteger;
      }>, Type.TObject<{
        currentSha: Type.TOptional<Type.TString>;
        upstreamSha: Type.TOptional<Type.TString>;
        repositoryUrl: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
        status: Type.TLiteral<"unavailable">;
        reason: Type.TUnion<[Type.TLiteral<"fetch-failed">, Type.TLiteral<"no-upstream">, Type.TLiteral<"no-upstream-sha">, Type.TLiteral<"comparison-failed">, Type.TLiteral<"git-unavailable">]>;
      }>]>>;
      immutable: Type.TOptional<Type.TObject<{
        root: Type.TString;
        currentSha: Type.TString;
        currentPath: Type.TString;
        activationEnabled: Type.TOptional<Type.TBoolean>;
        activation: Type.TOptional<Type.TObject<{
          operationId: Type.TString;
          phase: Type.TUnion<[Type.TLiteral<"prepared">, Type.TLiteral<"draining">, Type.TLiteral<"stopping">, Type.TLiteral<"stopped">, Type.TLiteral<"publishing">, Type.TLiteral<"starting">, Type.TLiteral<"verifying">, Type.TLiteral<"rollback-stopping">, Type.TLiteral<"rollback-publishing">, Type.TLiteral<"rollback-starting">, Type.TLiteral<"rolled-back">, Type.TLiteral<"recovery-required">]>;
          previousSha: Type.TString;
          candidateSha: Type.TString;
        }>>;
        lastActivation: Type.TOptional<Type.TObject<{
          operationId: Type.TString;
          outcome: Type.TUnion<[Type.TLiteral<"succeeded">, Type.TLiteral<"rolled-back">]>;
          selectedSha: Type.TString;
          verifiedAtMs: Type.TInteger;
        }>>;
        prepared: Type.TOptional<Type.TObject<{
          sha: Type.TString;
          path: Type.TString;
          buildDigest: Type.TString;
          preparedAtMs: Type.TInteger;
        }>>;
      }>>;
    }>>;
    target: Type.TOptional<Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"package">;
      version: Type.TString;
    }>, Type.TObject<{
      kind: Type.TLiteral<"git">;
      upstreamRef: Type.TString;
      upstreamSha: Type.TString;
      commitsBehind: Type.TInteger;
    }>]>>;
    campaign: Type.TOptional<Type.TObject<{
      id: Type.TString;
      state: Type.TUnion<[Type.TLiteral<"waiting-for-idle">, Type.TLiteral<"countdown">, Type.TLiteral<"applying">]>;
      announcedAtMs: Type.TInteger;
      applyAtMs: Type.TOptional<Type.TInteger>;
      holdUntilMs: Type.TOptional<Type.TInteger>;
      forceAtMs: Type.TInteger;
      updatedAtMs: Type.TInteger;
    }>>;
  }>>;
}>;
type Snapshot = Static<typeof SnapshotSchema>;
type PresenceEntry = Static<typeof PresenceEntrySchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/terminal.d.ts
/** Absolute temporary path pasted into the active terminal after upload. */
declare const TerminalUploadResultSchema: Type.TObject<{
  path: Type.TString;
  size: Type.TInteger;
  /** Explicit path insertion contract for a native CLI rather than a shell. */
  uploadPathStyle: Type.TOptional<Type.TLiteral<"native">>;
}>;
type TerminalUploadResult = Static<typeof TerminalUploadResultSchema>;
type TerminalUploadPathStyle = NonNullable<TerminalUploadResult["uploadPathStyle"]>;
//#endregion
//#region packages/gateway-protocol/src/schema/portals.d.ts
declare const PortalSummarySchema: Type.TObject<{
  id: Type.TString;
  title: Type.TString;
  port: Type.TInteger;
  listenPort: Type.TInteger;
  publicUrl: Type.TString;
  path: Type.TOptional<Type.TString>;
  description: Type.TOptional<Type.TString>;
  origin: Type.TOptional<Type.TString>;
  createdAtMs: Type.TInteger;
  tokenQuery: Type.TOptional<Type.TString>;
  url: Type.TOptional<Type.TString>;
}>;
declare const PortalOpenResultSchema: Type.TObject<{
  id: Type.TString;
  title: Type.TString;
  port: Type.TInteger;
  listenPort: Type.TInteger;
  publicUrl: Type.TString;
  path: Type.TOptional<Type.TString>;
  description: Type.TOptional<Type.TString>;
  origin: Type.TOptional<Type.TString>;
  createdAtMs: Type.TInteger;
  tokenQuery: Type.TString;
  url: Type.TString;
}>;
type PortalSummary = Static<typeof PortalSummarySchema>;
type PortalOpenResult = Static<typeof PortalOpenResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/wizard.d.ts
/** Client answer payload for the current wizard step. */
declare const WizardAnswerSchema: Type.TObject<{
  stepId: Type.TString;
  value: Type.TOptional<Type.TUnknown>;
}>;
/** UI contract for one wizard step rendered by gateway clients. */
declare const WizardStepSchema: Type.TObject<{
  id: Type.TString;
  type: Type.TUnion<[Type.TLiteral<"note">, Type.TLiteral<"select">, Type.TLiteral<"text">, Type.TLiteral<"confirm">, Type.TLiteral<"multiselect">, Type.TLiteral<"progress">, Type.TLiteral<"action">]>;
  title: Type.TOptional<Type.TString>;
  message: Type.TOptional<Type.TString>;
  format: Type.TOptional<Type.TUnion<[Type.TLiteral<"plain">]>>;
  options: Type.TOptional<Type.TArray<Type.TObject<{
    value: Type.TUnknown;
    label: Type.TString;
    hint: Type.TOptional<Type.TString>;
  }>>>;
  initialValue: Type.TOptional<Type.TUnknown>;
  placeholder: Type.TOptional<Type.TString>;
  sensitive: Type.TOptional<Type.TBoolean>;
  executor: Type.TOptional<Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"client">]>>;
  externalUrl: Type.TOptional<Type.TString>;
  deviceCode: Type.TOptional<Type.TObject<{
    code: Type.TString;
    expiresInMinutes: Type.TOptional<Type.TInteger>;
    message: Type.TOptional<Type.TString>;
  }>>;
}>;
/** Result after advancing a wizard session. */
declare const WizardNextResultSchema: Type.TObject<{
  done: Type.TBoolean;
  step: Type.TOptional<Type.TObject<{
    id: Type.TString;
    type: Type.TUnion<[Type.TLiteral<"note">, Type.TLiteral<"select">, Type.TLiteral<"text">, Type.TLiteral<"confirm">, Type.TLiteral<"multiselect">, Type.TLiteral<"progress">, Type.TLiteral<"action">]>;
    title: Type.TOptional<Type.TString>;
    message: Type.TOptional<Type.TString>;
    format: Type.TOptional<Type.TUnion<[Type.TLiteral<"plain">]>>;
    options: Type.TOptional<Type.TArray<Type.TObject<{
      value: Type.TUnknown;
      label: Type.TString;
      hint: Type.TOptional<Type.TString>;
    }>>>;
    initialValue: Type.TOptional<Type.TUnknown>;
    placeholder: Type.TOptional<Type.TString>;
    sensitive: Type.TOptional<Type.TBoolean>;
    executor: Type.TOptional<Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"client">]>>;
    externalUrl: Type.TOptional<Type.TString>;
    deviceCode: Type.TOptional<Type.TObject<{
      code: Type.TString;
      expiresInMinutes: Type.TOptional<Type.TInteger>;
      message: Type.TOptional<Type.TString>;
    }>>;
  }>>;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"cancelled">, Type.TLiteral<"error">]>>;
  error: Type.TOptional<Type.TString>;
  channels: Type.TOptional<Type.TArray<Type.TString>>;
  accounts: Type.TOptional<Type.TArray<Type.TObject<{
    channel: Type.TString;
    accountId: Type.TString;
  }>>>;
  preparedModelRef: Type.TOptional<Type.TString>;
  modelActivation: Type.TOptional<Type.TObject<{
    modelRef: Type.TString;
    modelTarget: Type.TOptional<Type.TLiteral<"utility">>;
    gatewayRestartRequired: Type.TOptional<Type.TLiteral<true>>;
  }>>;
  activationRejection: Type.TOptional<Type.TObject<{
    disposition: Type.TLiteral<"rejected-before-promotion">;
    status: Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"rate_limit">, Type.TLiteral<"billing">, Type.TLiteral<"timeout">, Type.TLiteral<"format">, Type.TLiteral<"unavailable">, Type.TLiteral<"unknown">]>;
  }>>;
}>;
type WizardAnswer = Static<typeof WizardAnswerSchema>;
type WizardStep = Static<typeof WizardStepSchema>;
type WizardNextResult = Static<typeof WizardNextResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-protocol-primitives.d.ts
declare const WorkerAdmissionFailureReasonSchema: Type.TUnion<[Type.TLiteral<"invalid-credential">, Type.TLiteral<"credential-expired">, Type.TLiteral<"environment-mismatch">, Type.TLiteral<"environment-unavailable">, Type.TLiteral<"bundle-mismatch">, Type.TLiteral<"version-mismatch">, Type.TLiteral<"session-mismatch">, Type.TLiteral<"placement-mismatch">, Type.TLiteral<"owner-epoch-mismatch">, Type.TLiteral<"rpc-set-mismatch">, Type.TLiteral<"protocol-features-mismatch">]>;
declare const WorkerProtocolCloseReasonSchema: Type.TUnion<[Type.TUnion<[Type.TLiteral<"invalid-credential">, Type.TLiteral<"credential-expired">, Type.TLiteral<"environment-mismatch">, Type.TLiteral<"environment-unavailable">, Type.TLiteral<"bundle-mismatch">, Type.TLiteral<"version-mismatch">, Type.TLiteral<"session-mismatch">, Type.TLiteral<"placement-mismatch">, Type.TLiteral<"owner-epoch-mismatch">, Type.TLiteral<"rpc-set-mismatch">, Type.TLiteral<"protocol-features-mismatch">]>, Type.TLiteral<"admission-rejected">, Type.TLiteral<"invalid-handshake">, Type.TLiteral<"protocol-mismatch">, Type.TLiteral<"gateway-unavailable">, Type.TLiteral<"invalid-frame">, Type.TLiteral<"slow-consumer">, Type.TLiteral<"method-not-allowed">, Type.TLiteral<"invalid-heartbeat">, Type.TLiteral<"credential-replaced">, Type.TLiteral<"gateway-shutdown">]>;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-admission.d.ts
/** Build identity presented by a worker before the gateway admits it. */
declare const WorkerAdmissionHandshakeSchema: Type.TObject<{
  bundleHash: Type.TString;
  openclawVersion: Type.TString;
  protocolFeatures: Type.TArray<Type.TString>;
  bundlePrewarm: Type.TOptional<Type.TInteger>;
}>;
/** Dedicated first-frame payload accepted only on the worker ingress. */
declare const WorkerConnectParamsSchema: Type.TObject<{
  minProtocol: Type.TInteger;
  maxProtocol: Type.TInteger;
  client: Type.TObject<{
    id: Type.TLiteral<"openclaw-worker">;
    version: Type.TString;
    platform: Type.TString;
    mode: Type.TLiteral<"worker">;
  }>;
  role: Type.TLiteral<"worker">;
  admission: Type.TUnion<[Type.TObject<{
    environmentId: Type.TString;
    credential: Type.TString;
    ownerEpoch: Type.TInteger;
    rpcSetVersion: Type.TInteger;
    handshake: Type.TObject<{
      bundleHash: Type.TString;
      openclawVersion: Type.TString;
      protocolFeatures: Type.TArray<Type.TString>;
      bundlePrewarm: Type.TOptional<Type.TInteger>;
    }>;
    sessionId: Type.TNull;
    runId: Type.TNull;
  }>, Type.TObject<{
    environmentId: Type.TString;
    credential: Type.TString;
    ownerEpoch: Type.TInteger;
    rpcSetVersion: Type.TInteger;
    handshake: Type.TObject<{
      bundleHash: Type.TString;
      openclawVersion: Type.TString;
      protocolFeatures: Type.TArray<Type.TString>;
      bundlePrewarm: Type.TOptional<Type.TInteger>;
    }>;
    sessionId: Type.TString;
    runId: Type.TString;
  }>]>;
}>;
declare const WorkerTranscriptCommitParamsSchema: Type.TObject<{
  runEpoch: Type.TInteger;
  seq: Type.TInteger;
  baseLeafId: Type.TUnion<[Type.TString, Type.TNull]>;
  messages: Type.TArray<Type.TUnion<[Type.TObject<{
    role: Type.TLiteral<"user">;
    content: Type.TArray<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"text">;
      text: Type.TString;
      textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"image">;
      data: Type.TString;
      mimeType: Type.TString;
    }>]>>;
    timestamp: Type.TInteger;
  }>, Type.TObject<{
    role: Type.TLiteral<"assistant">;
    content: Type.TArray<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"text">;
      text: Type.TString;
      textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"thinking">;
      thinking: Type.TString;
      thinkingSignature: Type.TOptional<Type.TString>;
      redacted: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      type: Type.TLiteral<"toolCall">;
      id: Type.TString;
      name: Type.TString;
      arguments: Type.TRecord<"^.*$", Type.TUnknown>;
      thoughtSignature: Type.TOptional<Type.TString>;
      executionMode: Type.TOptional<Type.TEnum<["sequential", "parallel"]>>;
    }>]>>;
    api: Type.TString;
    provider: Type.TString;
    model: Type.TString;
    responseModel: Type.TOptional<Type.TString>;
    responseId: Type.TOptional<Type.TString>;
    providerReplay: Type.TOptional<Type.TObject<{
      v: Type.TLiteral<1>;
      type: Type.TString;
      id: Type.TOptional<Type.TString>;
      data: Type.TString;
      replayIndex: Type.TOptional<Type.TInteger>;
      provider: Type.TString;
      api: Type.TString;
      model: Type.TString;
      baseUrlHash: Type.TOptional<Type.TString>;
      sessionHash: Type.TOptional<Type.TString>;
      authProfileHash: Type.TOptional<Type.TString>;
    }>>;
    usage: Type.TObject<{
      input: Type.TNumber;
      output: Type.TNumber;
      cacheRead: Type.TNumber;
      cacheWrite: Type.TNumber;
      contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
        state: Type.TLiteral<"available">;
        promptTokens: Type.TNumber;
        totalTokens: Type.TNumber;
      }>, Type.TObject<{
        state: Type.TLiteral<"unavailable">;
      }>]>>;
      totalTokens: Type.TNumber;
      cost: Type.TObject<{
        input: Type.TNumber;
        output: Type.TNumber;
        cacheRead: Type.TNumber;
        cacheWrite: Type.TNumber;
        total: Type.TNumber;
        totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
      }>;
    }>;
    timestamp: Type.TInteger;
    diagnostics: Type.TOptional<Type.TArray<Type.TObject<{
      type: Type.TString;
      timestamp: Type.TInteger;
      error: Type.TOptional<Type.TObject<{
        name: Type.TOptional<Type.TString>;
        message: Type.TString;
        stack: Type.TOptional<Type.TString>;
        code: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
      }>>;
      details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    }>>>;
    stopReason: Type.TEnum<["stop", "length", "toolUse", "error", "aborted"]>;
    errorMessage: Type.TOptional<Type.TString>;
    errorCode: Type.TOptional<Type.TString>;
    errorType: Type.TOptional<Type.TString>;
    errorBody: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    role: Type.TLiteral<"toolResult">;
    toolCallId: Type.TString;
    toolName: Type.TString;
    content: Type.TArray<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"text">;
      text: Type.TString;
      textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"image">;
      data: Type.TString;
      mimeType: Type.TString;
    }>]>>;
    details: Type.TOptional<Type.TUnknown>;
    isError: Type.TBoolean;
    timestamp: Type.TInteger;
  }>]>>;
}>;
declare const WorkerTranscriptCommitResultSchema: Type.TObject<{
  entryIds: Type.TArray<Type.TString>;
  newLeafId: Type.TString;
}>;
declare const WorkerTranscriptCommitErrorReasonSchema: Type.TEnum<["stale-base-leaf", "epoch-mismatch", "invalid-batch", "session-not-attached"]>;
declare const WorkerLiveEventParamsSchema: Type.TObject<{
  runEpoch: Type.TInteger;
  lastAckedSeq: Type.TInteger;
  seq: Type.TInteger;
  runId: Type.TString;
  event: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"assistant">;
    payload: Type.TObject<{
      text: Type.TString;
      delta: Type.TString;
      replace: Type.TOptional<Type.TLiteral<true>>;
      mediaUrls: Type.TOptional<Type.TArray<Type.TString>>;
      phase: Type.TOptional<Type.TEnum<["commentary", "final_answer"]>>;
      itemId: Type.TOptional<Type.TString>;
    }>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"thinking">;
    payload: Type.TObject<{
      text: Type.TString;
      delta: Type.TString;
    }>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"tool">;
    payload: Type.TUnion<[Type.TObject<{
      name: Type.TString;
      toolCallId: Type.TString;
      hideFromChannelProgress: Type.TOptional<Type.TLiteral<true>>;
      phase: Type.TLiteral<"start">;
      args: Type.TUnknown;
    }>, Type.TObject<{
      name: Type.TString;
      toolCallId: Type.TString;
      hideFromChannelProgress: Type.TOptional<Type.TLiteral<true>>;
      phase: Type.TLiteral<"update">;
      partialResult: Type.TUnknown;
    }>, Type.TObject<{
      name: Type.TString;
      toolCallId: Type.TString;
      hideFromChannelProgress: Type.TOptional<Type.TLiteral<true>>;
      phase: Type.TLiteral<"result">;
      meta: Type.TOptional<Type.TString>;
      isError: Type.TBoolean;
      result: Type.TUnknown;
      toolErrorSummary: Type.TOptional<Type.TString>;
    }>]>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"approval">;
    payload: Type.TUnion<[Type.TObject<{
      kind: Type.TEnum<["exec", "plugin", "unknown"]>;
      title: Type.TString;
      itemId: Type.TOptional<Type.TString>;
      toolCallId: Type.TOptional<Type.TString>;
      approvalId: Type.TOptional<Type.TString>;
      approvalSlug: Type.TOptional<Type.TString>;
      command: Type.TOptional<Type.TString>;
      host: Type.TOptional<Type.TString>;
      reason: Type.TOptional<Type.TString>;
      scope: Type.TOptional<Type.TEnum<["turn", "session"]>>;
      message: Type.TOptional<Type.TString>;
      phase: Type.TLiteral<"requested">;
      status: Type.TEnum<["pending", "unavailable"]>;
    }>, Type.TObject<{
      kind: Type.TEnum<["exec", "plugin", "unknown"]>;
      title: Type.TString;
      itemId: Type.TOptional<Type.TString>;
      toolCallId: Type.TOptional<Type.TString>;
      approvalId: Type.TOptional<Type.TString>;
      approvalSlug: Type.TOptional<Type.TString>;
      command: Type.TOptional<Type.TString>;
      host: Type.TOptional<Type.TString>;
      reason: Type.TOptional<Type.TString>;
      scope: Type.TOptional<Type.TEnum<["turn", "session"]>>;
      message: Type.TOptional<Type.TString>;
      phase: Type.TLiteral<"resolved">;
      status: Type.TEnum<["approved", "denied", "failed"]>;
    }>]>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"lifecycle">;
    payload: Type.TUnion<[Type.TObject<{
      phase: Type.TLiteral<"start">;
      startedAt: Type.TInteger;
    }>, Type.TObject<{
      selectedProvider: Type.TString;
      selectedModel: Type.TString;
      activeProvider: Type.TString;
      activeModel: Type.TString;
      phase: Type.TLiteral<"fallback">;
      reasonSummary: Type.TString;
      attemptSummaries: Type.TArray<Type.TString>;
      attempts: Type.TArray<Type.TObject<{
        provider: Type.TString;
        model: Type.TString;
        error: Type.TString;
        reason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"tls_certificate">, Type.TLiteral<"context_overflow">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
        authMode: Type.TOptional<Type.TString>;
        status: Type.TOptional<Type.TInteger>;
        code: Type.TOptional<Type.TString>;
      }>>;
    }>, Type.TObject<{
      selectedProvider: Type.TString;
      selectedModel: Type.TString;
      activeProvider: Type.TString;
      activeModel: Type.TString;
      phase: Type.TLiteral<"fallback_cleared">;
      previousActiveModel: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      phase: Type.TLiteral<"fallback_step">;
      fallbackStepType: Type.TLiteral<"fallback_step">;
      fallbackStepFromModel: Type.TString;
      fallbackStepToModel: Type.TOptional<Type.TString>;
      fallbackStepFromFailureReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"tls_certificate">, Type.TLiteral<"context_overflow">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
      fallbackStepFromFailureDetail: Type.TOptional<Type.TString>;
      fallbackStepChainPosition: Type.TOptional<Type.TInteger>;
      fallbackStepFinalOutcome: Type.TEnum<["next_fallback", "succeeded", "chain_exhausted"]>;
    }>, Type.TUnion<[Type.TObject<{
      startedAt: Type.TOptional<Type.TInteger>;
      endedAt: Type.TInteger;
      stopReason: Type.TOptional<Type.TString>;
      yielded: Type.TOptional<Type.TLiteral<true>>;
      timeoutPhase: Type.TOptional<Type.TEnum<["queue", "preflight", "provider", "post_turn", "gateway_draining"]>>;
      providerStarted: Type.TOptional<Type.TBoolean>;
      aborted: Type.TOptional<Type.TBoolean>;
      toolErrorSummary: Type.TOptional<Type.TString>;
      livenessState: Type.TOptional<Type.TEnum<["working", "paused", "blocked", "abandoned"]>>;
      replayInvalid: Type.TOptional<Type.TLiteral<true>>;
      phase: Type.TLiteral<"finishing">;
      error: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      startedAt: Type.TOptional<Type.TInteger>;
      endedAt: Type.TInteger;
      stopReason: Type.TOptional<Type.TString>;
      yielded: Type.TOptional<Type.TLiteral<true>>;
      timeoutPhase: Type.TOptional<Type.TEnum<["queue", "preflight", "provider", "post_turn", "gateway_draining"]>>;
      providerStarted: Type.TOptional<Type.TBoolean>;
      aborted: Type.TOptional<Type.TBoolean>;
      toolErrorSummary: Type.TOptional<Type.TString>;
      livenessState: Type.TOptional<Type.TEnum<["working", "paused", "blocked", "abandoned"]>>;
      replayInvalid: Type.TOptional<Type.TLiteral<true>>;
      phase: Type.TLiteral<"end">;
    }>, Type.TObject<{
      startedAt: Type.TOptional<Type.TInteger>;
      endedAt: Type.TInteger;
      stopReason: Type.TOptional<Type.TString>;
      yielded: Type.TOptional<Type.TLiteral<true>>;
      timeoutPhase: Type.TOptional<Type.TEnum<["queue", "preflight", "provider", "post_turn", "gateway_draining"]>>;
      providerStarted: Type.TOptional<Type.TBoolean>;
      aborted: Type.TOptional<Type.TBoolean>;
      toolErrorSummary: Type.TOptional<Type.TString>;
      livenessState: Type.TOptional<Type.TEnum<["working", "paused", "blocked", "abandoned"]>>;
      replayInvalid: Type.TOptional<Type.TLiteral<true>>;
      phase: Type.TLiteral<"error">;
      error: Type.TString;
      fallbackExhaustedFailure: Type.TOptional<Type.TLiteral<true>>;
    }>]>]>;
  }>]>;
}>;
declare const WorkerLiveEventResultSchema: Type.TObject<{
  ackedSeq: Type.TInteger;
}>;
declare const WorkerLiveEventErrorDetailsSchema: Type.TUnion<[Type.TObject<{
  reason: Type.TEnum<["epoch-mismatch", "session-not-attached", "invalid-event", "capacity-exceeded"]>;
}>, Type.TObject<{
  reason: Type.TLiteral<"resync-required">;
  ackedSeq: Type.TInteger;
  expectedSeq: Type.TInteger;
}>]>;
type WorkerAdmissionHandshake = Static<typeof WorkerAdmissionHandshakeSchema>;
type WorkerConnectParams = Static<typeof WorkerConnectParamsSchema>;
type WorkerAdmissionFailureReason = Static<typeof WorkerAdmissionFailureReasonSchema>;
type WorkerProtocolCloseReason = Static<typeof WorkerProtocolCloseReasonSchema>;
type WorkerTranscriptCommitParams = Static<typeof WorkerTranscriptCommitParamsSchema>;
type WorkerTranscriptCommitResult = Static<typeof WorkerTranscriptCommitResultSchema>;
type WorkerTranscriptCommitErrorReason = Static<typeof WorkerTranscriptCommitErrorReasonSchema>;
type WorkerLiveEventParams = Static<typeof WorkerLiveEventParamsSchema>;
type WorkerLiveEventResult = Static<typeof WorkerLiveEventResultSchema>;
type WorkerLiveEventErrorDetails = Static<typeof WorkerLiveEventErrorDetailsSchema>;
//#endregion
//#region packages/gateway-protocol/src/client-info.d.ts
/** Canonical client ids accepted in gateway hello/connect payloads. */
declare const GATEWAY_CLIENT_IDS: {
  readonly WEBCHAT_UI: "webchat-ui";
  readonly CONTROL_UI: "openclaw-control-ui";
  readonly BROWSER_COPILOT: "openclaw-browser-copilot";
  readonly TUI: "openclaw-tui";
  readonly WEBCHAT: "webchat";
  readonly CLI: "cli";
  readonly GATEWAY_CLIENT: "gateway-client";
  readonly MACOS_APP: "openclaw-macos";
  readonly LINUX_APP: "openclaw-linux";
  readonly IOS_APP: "openclaw-ios";
  readonly WATCHOS_APP: "openclaw-watchos";
  readonly ANDROID_APP: "openclaw-android";
  readonly NODE_HOST: "node-host";
  readonly WORKER: "openclaw-worker";
  readonly TEST: "test";
  readonly FINGERPRINT: "fingerprint";
  readonly PROBE: "openclaw-probe";
};
/** Stable gateway client ids used on the wire during hello/connect handshakes. */
type GatewayClientId = (typeof GATEWAY_CLIENT_IDS)[keyof typeof GATEWAY_CLIENT_IDS];
/** Compatibility alias for internal callers that still use "name" terminology. */
type GatewayClientName = GatewayClientId;
/** Coarse modes let policy group clients without matching every product id. */
declare const GATEWAY_CLIENT_MODES: {
  readonly WEBCHAT: "webchat";
  readonly CLI: "cli";
  readonly UI: "ui";
  readonly BACKEND: "backend";
  readonly NODE: "node";
  readonly WORKER: "worker";
  readonly PROBE: "probe";
  readonly TEST: "test";
};
/** Coarse client category used for gateway policy and diagnostics. */
type GatewayClientMode = (typeof GATEWAY_CLIENT_MODES)[keyof typeof GATEWAY_CLIENT_MODES];
/** Client metadata sent during gateway connection setup. */
type GatewayClientInfo = {
  /** Stable product/client identifier from `GATEWAY_CLIENT_IDS`. */
  id: GatewayClientId;
  /** Human-readable label for diagnostics; not used for policy decisions. */
  displayName?: string;
  /** Client app or package version reported by the connecting process. */
  version: string;
  /** Exact immutable artifact identity when the client can report one. */
  buildId?: string;
  /** Runtime platform string, such as `darwin`, `ios`, `android`, or `web`. */
  platform: string;
  /** Optional device family used by native clients for display and routing hints. */
  deviceFamily?: string;
  /** Native hardware/model identifier when available. */
  modelIdentifier?: string;
  /** Self-reported IANA time zone, such as `Europe/Vienna`, for presence display. */
  timeZone?: string;
  /** Coarse category from `GATEWAY_CLIENT_MODES` for policy and diagnostics. */
  mode: GatewayClientMode;
  /** Per-installation or per-process id used to distinguish same-product clients. */
  instanceId?: string;
};
/** Capability flags a client may advertise during the gateway handshake. */
declare const GATEWAY_CLIENT_CAPS: {
  readonly AGENT_KIND: "agent-kind";
  readonly APPROVALS: "approvals";
  readonly CHAT_ONLY_ASSISTANT_TEXT: "chat-only-assistant-text";
  readonly EXEC_APPROVALS: "exec-approvals";
  readonly INLINE_WIDGETS: "inline-widgets";
  readonly MODEL_CATALOG_SNAPSHOT: "model-catalog-snapshot";
  readonly MODEL_SELECTION_POLICY: "model-selection-policy";
  readonly RUN_TOOL_BINDINGS: "run-tool-bindings";
  readonly SESSION_SCOPED_EVENTS: "session-scoped-events";
  readonly SKILL_CURATOR_LIVE_INVENTORY: "skill-curator-live-inventory";
  readonly PLUGIN_APPROVALS: "plugin-approvals";
  readonly TASK_SUGGESTIONS: "task-suggestions";
  readonly TERMINAL_OFFSET_SEQ: "terminal-offset-seq";
  readonly TERMINAL_SESSION_METADATA: "terminal-session-metadata";
  readonly TERMINAL_UPLOAD_PATH_STYLE: "terminal-upload-path-style";
  readonly TOOL_EVENTS: "tool-events";
  readonly UI_COMMANDS: "ui-commands";
  readonly ULTRAFAST: "ultrafast";
  readonly USAGE_REFRESHING: "usage-refreshing";
};
/** Optional capability advertised by clients during gateway handshake. */
type GatewayClientCap = (typeof GATEWAY_CLIENT_CAPS)[keyof typeof GATEWAY_CLIENT_CAPS];
//#endregion
//#region src/chat/message-client-source.d.ts
/** Reported transport facts, separate from authenticated sender identity. */
type MessageClientSource = Pick<GatewayClientInfo, "id" | "mode" | "displayName">;
//#endregion
//#region src/chat/sender-identity.d.ts
type TranscriptSenderIdentity = Extract<SessionParticipantIdentity, {
  type: "profile" | "remote" | "observation";
}>;
//#endregion
//#region packages/gateway-protocol/src/chat-work-context.d.ts
/** Bounded, untrusted send-time reference data; never routing or authorization. */
declare const CHAT_WORK_CONTEXT_LIMITS: {
  readonly page: 64;
  readonly title: 96;
  readonly sessionKey: 192;
  readonly sessionId: 64;
  readonly agentId: 64;
  readonly workspace: 224;
  readonly file: 224;
  readonly selection: 640;
};
type ChatWorkContext = {
  page: string;
  detail?: Readonly<Record<string, string>>;
} & Partial<Record<Exclude<keyof typeof CHAT_WORK_CONTEXT_LIMITS, "page">, string>>;
//#endregion
//#region src/chat/work-context.d.ts
type AttachedChatWorkContext = {
  snapshot: ChatWorkContext;
  text: string;
};
//#endregion
//#region src/auto-reply/source-reply-delivery-mode.types.d.ts
/** Per-turn authority for automatic replies versus explicit message-tool sends. */
type SourceReplyDeliveryMode = "automatic" | "message_tool_only";
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
//#region src/sessions/user-turn-transcript.types.d.ts
type PersistedUserTurnMediaInput = Pick<MediaFactInput, "contentType" | "durationMs" | "fileName" | "origin" | "height" | "hydrationSuppressed" | "messageId" | "path" | "sizeBytes" | "transcribed" | "url" | "width"> & {
  kind?: string | null;
  workspaceDir?: string | null;
};
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
type UserTurnInput = Pick<PersistedUserTurnMessage, "display" | "excludeFromContext"> & {
  text?: string | null;
  /** Authored text and its captured reference; model content stays unchanged. */
  workContext?: AttachedChatWorkContext;
  /** Explicit human selections bound to UTF-16 offsets in text. */
  mentions?: readonly HumanMention[];
  media?: readonly PersistedUserTurnMediaInput[] | null;
  /** Restart-safe native image placement; model-visible prompt bytes remain separate. */
  mediaImageLayout?: {
    slots: readonly {
      kind: "inline" | "offloaded";
      factIndex?: number;
    }[];
    suppressedFactIndexes?: readonly number[];
  } | null;
  timestamp?: number;
  idempotencyKey?: string;
  /** Durable transcript message reference used to render and hydrate replies. */
  replyToId?: string;
  /** Bounded display fallback for replies whose target is outside loaded history. */
  replyToPreview?: {
    text: string;
    senderLabel?: string | null;
  } | null;
  senderIsOwner?: boolean;
  provenance?: InputProvenance;
  /** Identity is producer-owned attribution; labels remain editable display metadata. */
  sender?: {
    id?: string | null;
    name?: string | null;
    username?: string | null;
    identity?: TranscriptSenderIdentity;
  } | null;
  /** Durable transport correlation; stored privately and never rendered into model input. */
  transport?: {
    /** Reported client sources retained through collection; never sender authority. */
    clients?: readonly MessageClientSource[];
    channel?: string;
    conversationRef?: string;
    messageId?: string;
    replyToId?: string;
    threadId?: string;
  };
};
type UserTurnTranscriptUpdateMode = "inline" | "none";
type UserTurnBeforeMessageWrite = (params: {
  message: PersistedUserTurnMessage;
  agentId?: string;
  sessionKey?: string;
}) => AgentMessage | null;
type UserTurnTranscriptTarget = {
  sessionId: string;
  expectedSessionId?: string;
  initialSessionEntry?: SessionEntry;
  sessionKey: string;
  sessionEntry: SessionEntry | undefined;
  sessionStore?: Record<string, SessionEntry>;
  storePath?: string;
  agentId: string;
  threadId?: string | number;
  cwd?: string;
  config?: unknown;
  beforeMessageWrite?: UserTurnBeforeMessageWrite;
};
type UserTurnTranscriptAdmissionReceipt = TranscriptTurnAdmission;
/** Native producer facts for the current host-admitted prompt; never a message replacement. */
type UserTurnTranscriptAnnotation = Readonly<{
  mirrorIdentity: string;
  upstreamUserText: string;
  mirrorOrigin: string;
  mirrorSourceFingerprint: string;
}>;
type UserTurnTranscriptPersistResult = {
  sessionTurnMutationResult?: SessionTranscriptTurnMutationResult;
  /** True only when this call inserted the transcript message. */
  appended?: boolean;
  sessionFile: string;
  sessionEntry: SessionEntry | undefined;
  messageId: string;
  message: PersistedUserTurnMessage;
  admission: UserTurnTranscriptAdmissionReceipt;
};
type UserTurnTranscriptTargetResolver = UserTurnTranscriptTarget | (() => UserTurnTranscriptTarget | undefined | Promise<UserTurnTranscriptTarget | undefined>);
type UserTurnPersistenceOptions = {
  target?: UserTurnTranscriptTargetResolver;
  updateMode?: UserTurnTranscriptUpdateMode;
  cwd?: string;
};
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
  /** Released synchronous SDK contract; internal recorders use completeProcessingAsync. */
  completeProcessing?: (outcome: AgentRunTerminalOutcome) => AgentRunTerminalOutcome | undefined;
  completeProcessingAsync?: (outcome: AgentRunTerminalOutcome) => Promise<AgentRunTerminalOutcome | undefined>;
  getPendingInputMessage?: () => PersistedUserTurnMessage | undefined;
  isPendingInputConsumed?: () => boolean;
  withPendingInput?: <T>(run: () => T) => T;
  finishPendingInput?: (disposition: "cancelled" | "interrupted") => void;
  /** Join accepted completion and disposition writes before releasing the turn's admission. */
  waitForPendingInputSettlement?: () => Promise<void>;
  /** Replaces generated current-turn text before runtime persistence/provider submission. */
  replaceTextBeforePersistence?: (text: string) => void;
  /** Confirms exact-run steering provenance after transcript commitment is proven. */
  confirmSteerTargetRunIdForPersistence?: (targetRunId: string) => Promise<void>;
  getPersistedMessage?: () => PersistedUserTurnMessage | undefined;
  /**
   * Freeze model-facing text on the canonical user record before its first provider dispatch.
   * `requestLocal` applies the same redaction but leaves the stored record unchanged.
   */
  captureModelPromptProjection?: (text: string, assertCurrent: () => void, options?: {
    requestLocal?: boolean;
  }) => Promise<PersistedUserTurnMessage>;
  getAdmissionReceipt: () => UserTurnTranscriptAdmissionReceipt | undefined;
  /** Persistence and `waitForRuntimePersistence` settle the handler's write and reject on its failure. */
  setAdmissionHandler?: (handler: (admission: UserTurnTranscriptAdmissionReceipt) => void | Promise<void>) => void;
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
  persistApproved: (params?: UserTurnPersistenceOptions & {
    expectedSessionId?: string;
    expectedSessionState?: SessionTranscriptTurnExpectedState;
    sessionLifecyclePatch?: SessionTranscriptTurnLifecyclePatch;
    /** Allow a later explicit persistence attempt when this attempt appends nothing. */
    retryIfUnpersisted?: boolean;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
  persistBlocked: (message: PersistedUserTurnMessage, params?: UserTurnPersistenceOptions) => Promise<UserTurnTranscriptPersistResult | undefined>;
  persistFallback: (params?: UserTurnPersistenceOptions) => Promise<UserTurnTranscriptPersistResult | undefined>;
};
//#endregion
//#region src/channels/progress-draft-compositor.types.d.ts
type ChannelProgressDraftCompositorLine = string | ChannelProgressDraftLine;
type ChannelProgressDraftCompositorSnapshot = Readonly<{
  lines: readonly ChannelProgressDraftCompositorLine[];
  label?: string;
  statusHeadline?: string;
  statusHeadlineFormat?: "plain";
  plan?: readonly AgentPlanStep[];
  planExplanation?: string;
  planExplanationFormat?: "plain";
  preparedBlocks?: readonly {
    text: string;
    format: "plain" | "markdown";
  }[];
  diffStat?: ChannelProgressDraftDiffStat;
}>;
//#endregion
//#region src/channels/progress-continuation.d.ts
/** Positive platform evidence plus data-only presentation state, never a transport callback. */
type ProgressContinuationReceipt = {
  channel: string;
  accountId?: string;
  to: string;
  threadId?: string | number;
  messageId: string;
  text: string;
  snapshot: ChannelProgressDraftCompositorSnapshot;
};
type ProgressContinuationCapability = {
  adopt: (this: void, receipt: ProgressContinuationReceipt) => Promise<boolean>;
  close: () => void;
};
//#endregion
//#region packages/model-catalog-core/src/model-catalog-refs.d.ts
type ProviderModelRef = {
  provider: string;
  model: string;
};
//#endregion
//#region src/infra/agent-run-authority.types.d.ts
/** Exact admitted-run claim shared by the registry and its subordinate approval leases. */
type AgentRunDelegatedAuthority = Readonly<{
  operationalRunInstance: Readonly<{
    instanceId: string;
    runId: string;
  }>;
  lifecycleGeneration: string;
  claimId: string;
}>;
//#endregion
//#region src/auto-reply/thinking.shared.d.ts
/** Canonical thinking level values accepted by chat commands and session state. */
declare const ALL_THINKING_LEVELS: readonly ["off", "minimal", "low", "medium", "high", "xhigh", "adaptive", "max", "ultra"];
type ThinkLevel = (typeof ALL_THINKING_LEVELS)[number];
type VerboseLevel = "off" | "on" | "full";
type ReasoningLevel = "off" | "on" | "stream";
/** Prepared model catalog fields reused while choosing and dispatching a queued runtime. */
type ThinkingCatalogEntry = {
  provider: string;
  id: string;
  nativeRuntime?: string;
  api?: string;
  baseUrl?: string;
  contextWindow?: number;
  contextTokens?: number;
  reasoning?: boolean;
  configuredReasoning?: boolean;
  /** Concrete runtime owner of thinking policy; internal and never project to clients. */
  thinkingPolicyProvider?: string;
  thinkingLevelMap?: ThinkingLevelMap;
  input?: readonly ("text" | "image" | "audio" | "video" | "document")[];
  params?: Record<string, unknown>;
  compat?: {
    thinkingFormat?: string;
    supportsReasoningEffort?: boolean;
    supportedReasoningEfforts?: readonly string[] | null;
    reasoningEffortMap?: Record<string, string>;
  } | null;
};
//#endregion
//#region src/infra/agent-run-registry.types.d.ts
type AgentRunModel = {
  provider: string;
  model: string;
};
type ProjectedAgentRunState = "queued" | "running" | "capacity-wait";
type ProjectedAgentRunIndex = {
  modelsBySessionId: ReadonlyMap<string, AgentRunModel | null>;
  sessionKeys: ReadonlyMap<string, ProjectedAgentRunState>;
  sessionIds: ReadonlyMap<string, ProjectedAgentRunState>;
  ownerlessSessionKeys: ReadonlyMap<string, ProjectedAgentRunState>;
  ownerlessSessionIds: ReadonlyMap<string, ProjectedAgentRunState>;
};
//#endregion
//#region src/plugins/gateway-access-policy.types.d.ts
type GatewayAccessGrantRef = Readonly<{
  pluginId: string;
  grantId: string;
}>;
/** Additional access held by an authenticated person, independent of a transport. */
type PluginGatewayAccessAuthority = Readonly<{
  /** Stable UUID for one uninterrupted grant, if the policy supports durable requests. */
  grantId?: string;
  assertCurrent: () => void;
  signal: AbortSignal;
}>;
type GatewayAccessPolicyContext = {
  config: OpenClawConfig;
  /** The person's effective operator role explicitly names this policy's plugin. */
  requiredByRole: boolean;
  profile: {
    profileId: string;
    emails: readonly string[];
    githubAccountIds?: readonly number[];
    assignedRole: string | null;
  };
};
type PluginGatewayAccessPolicy = {
  /** Return no authority when inapplicable; an explicit role binding still requires authority. */
  authorize: (context: GatewayAccessPolicyContext) => PluginGatewayAccessAuthority | undefined;
  /**
   * Check the original grant even if the current role is exempt. Return undefined
   * only for a definitively ended grant; throw while its state is unavailable.
   */
  resume?: (context: GatewayAccessPolicyContext & {
    grantId: string;
  }) => PluginGatewayAccessAuthority | undefined;
};
//#endregion
//#region src/agents/operator-model-policy.types.d.ts
type PreparedOperatorModelPolicy = Readonly<{
  /** Ordered concrete choices for Default and automatic fallback; never a global catalog. */
  models: readonly ProviderModelRef[];
  /** Compares resolved logical identities, preserving provider/auth routing. */
  allows: (ref: ProviderModelRef) => boolean;
}>;
declare namespace admitted_run_context_d_exports {
  export { AdmittedRunContext, AdmittedRunOperatorAuthority, OperationalRunInstanceRef, PreparedAgentRunAdmission, assertAdmittedRunOperatorAuthority, assertOperatorModelAllowed, bindOperatorModelExecution, closeAdmittedRunDelegatedAuthority, createAdmittedRunOperatorAuthority, createExecutionIdentityRecoveryAdmission, createOperationalRunInstanceRef, getAdmittedRunDelegatedAuthority, getAdmittedRunSource, prepareAgentRunAdmission, prepareSystemAgentRunAdmission, readAdmittedRunOperatorAuthority, readPreparedRunOperatorAuthority, readRunOperatorAuthority, resolveAdmittedRunActiveAssertion, resolvePreparedRunAdmission, retainAdmittedRunBeforeToolCallRecovery };
}
/** Operational lifecycle correlation. This is never identity or authorization evidence. */
type OperationalRunInstanceRef = Readonly<{
  instanceId: string;
  runId: string;
}>;
/** Exact context carried by one admitted execution and every retry/fallback it owns. */
type AdmittedRunContext = Readonly<{
  operationalRunInstance: OperationalRunInstanceRef;
  /** Scheduler-authored ingress authority, independent of optional audit collection. */
  admissionSource?: "operator-schedule" | "requester-schedule";
  executionIdentityToken?: ExecutionIdentityAdmissionToken;
}>;
type AdmittedRunOperatorAuthority = Readonly<{
  profileId: string;
  scopes: readonly string[];
  /** Original access dependency; null is proven independent, undefined is unclassified. */
  gatewayAccessGrant?: GatewayAccessGrantRef | null;
  assertCurrent: () => void;
  signal?: AbortSignal;
  /** Opaque original source identity used only to compare compatible queued input. */
  source?: object;
  /** Retains the original source independently of a foreground run or request. */
  retain?: () => () => void;
  /** Live assignment from the original prepared profile lease. */
  readCurrentRoleAssignment?: (this: void) => string | null;
  /** Verified primary login from the same live profile authority. */
  readCurrentGithubLogin?: (this: void) => string | null;
  /** Prepared role permissions; source-policy changes revoke the owning authority. */
  rolePolicy?: Readonly<{
    sessionAccessCap: GatewayOperatorRoleDefinition["sessions"]["others"];
    sandboxRequired: boolean;
    agents: "*" | readonly string[];
  }>;
  modelPolicy?: PreparedOperatorModelPolicy;
  /** Committed policy changes invalidate only executions using a removed model. */
  onModelPolicyChanged?: (listener: () => void) => () => void;
}>;
/** Host-only construction; public reply options cannot manufacture a source capability. */
declare function createAdmittedRunOperatorAuthority(source: AdmittedRunOperatorAuthority): AdmittedRunOperatorAuthority;
declare function assertAdmittedRunOperatorAuthority(authority: unknown): asserts authority is AdmittedRunOperatorAuthority;
/** Selection never grants authority; callers must pass the original host-issued source. */
declare function assertOperatorModelAllowed(authority: AdmittedRunOperatorAuthority | undefined, model: ProviderModelRef | undefined): void;
/** Keeps one selected model current without revoking other work from the same source. */
declare function bindOperatorModelExecution(authority: AdmittedRunOperatorAuthority | undefined, model: ProviderModelRef | undefined, mapAuthorizationError?: (error: unknown) => Error): Readonly<{
  signal: AbortSignal;
  assertCurrent: () => void;
  release: () => void;
}> | undefined;
/** Prepared and admitted paths share the same source throughout retries and detached work. */
declare function readRunOperatorAuthority(params: {
  preparedRunAdmission?: PreparedAgentRunAdmission;
  admittedRunContext?: AdmittedRunContext;
}): AdmittedRunOperatorAuthority | undefined;
type PreparedAgentRunAdmission = Readonly<{
  operationalRunInstance: OperationalRunInstanceRef;
  /** Exact post-prepare owner; repeated fallback/retry returns the same object. */
  admit: (runtimeKind: ExecutionIdentityAdmissionFacts["runtime"]["kind"], runtimeInstanceId?: string) => Promise<AdmittedRunContext>;
  /** Checks latched source revocation after normal close; never grants execution authority. */
  assertSourceCurrent: () => void;
  /** Host-only source restriction available before the runtime prepares its tools. */
  readOperatorAuthority?: () => AdmittedRunOperatorAuthority | undefined;
  /** Idempotently closes the exact delegated approval lease, if admission occurred. */
  close: () => void;
}>;
/** Reads the immutable outer-run authority without reviving a closed claim. */
declare function getAdmittedRunDelegatedAuthority(context: AdmittedRunContext): AgentRunDelegatedAuthority | undefined;
/** Captures the operator's source lifetime from a live run, including for detached children. */
declare function readAdmittedRunOperatorAuthority(context: AdmittedRunContext | undefined): AdmittedRunOperatorAuthority | undefined;
/** Reads the same source ceiling used by admission without minting run authority. */
declare function readPreparedRunOperatorAuthority(prepared: PreparedAgentRunAdmission | undefined): AdmittedRunOperatorAuthority | undefined;
/** Reads the original admission source only through its exact live authority. */
declare function getAdmittedRunSource(authority: AgentRunDelegatedAuthority | undefined): AdmittedRunContext["admissionSource"];
/** Captures an exact admitted-run assertion for work that may cross an await boundary. */
declare function resolveAdmittedRunActiveAssertion(context: AdmittedRunContext, signal?: AbortSignal): (() => void) | undefined;
/** Idempotently compare-releases the authority captured by this admission. */
declare function closeAdmittedRunDelegatedAuthority(context: AdmittedRunContext): boolean;
type AdmittedRunBeforeToolCallRecovery = Readonly<{
  assertActive: () => void;
  release: () => void;
}>;
/** Recovery-only lease for the already-created native pre-tool policy callback. */
declare function retainAdmittedRunBeforeToolCallRecovery(context: AdmittedRunContext): AdmittedRunBeforeToolCallRecovery | undefined;
type ExecutionIdentityRecoveryAdmission = Readonly<{
  /** Recovery retries never manufacture replacement identity when exact evidence is absent. */
  retryOnly: boolean;
  consume: (runId: string) => Readonly<{
    accepted: boolean;
    token?: ExecutionIdentityAdmissionToken;
  }>;
}>;
/** Creates a one-shot recovery admission owned by the durable recovery resolver. */
declare function createExecutionIdentityRecoveryAdmission(params: {
  retryOnly: boolean;
  token?: ExecutionIdentityAdmissionToken;
  expectedOperationalRunId?: string;
}): ExecutionIdentityRecoveryAdmission;
declare function createOperationalRunInstanceRef(runId: string): OperationalRunInstanceRef;
/** Prepares a system-owned run without selecting its eventual execution runtime early. */
declare function prepareSystemAgentRunAdmission(cfg: OpenClawConfig, runId: string, agentId: string, boundary: string, assertSourceCurrent?: () => void, operatorAuthority?: AdmittedRunOperatorAuthority): PreparedAgentRunAdmission;
/**
 * Freezes ingress facts before preparation while deferring allocation/capture until the
 * authoritative runtime owner is selected immediately before execution.
 */
declare function prepareAgentRunAdmission(params: {
  cfg: OpenClawConfig;
  admissionSource?: AdmittedRunContext["admissionSource"];
  facts: Omit<ExecutionIdentityAdmissionFacts, "runtime">;
  operationalRunInstance: OperationalRunInstanceRef;
  recovery?: ExecutionIdentityRecoveryAdmission;
  onAdmitted?: (context: AdmittedRunContext) => void | Promise<void>;
  assertSourceCurrent?: () => void;
  operatorAuthority?: AdmittedRunOperatorAuthority;
}): PreparedAgentRunAdmission;
/** Resolves a host-only continuation or validates an already-admitted internal caller. */
declare function resolvePreparedRunAdmission(params: {
  runId: string;
  runtimeKind: ExecutionIdentityAdmissionFacts["runtime"]["kind"];
  runtimeInstanceId?: string;
  admittedRunContext?: AdmittedRunContext;
  preparedRunAdmission?: PreparedAgentRunAdmission;
}): Promise<AdmittedRunContext>;
//#endregion
//#region src/logging/levels.d.ts
declare const ALLOWED_LOG_LEVELS: readonly ["silent", "fatal", "error", "warn", "info", "debug", "trace"];
type LogLevel = (typeof ALLOWED_LOG_LEVELS)[number];
//#endregion
//#region src/logging/subsystem.d.ts
type SubsystemLogger = {
  subsystem: string;
  isEnabled: (level: LogLevel, target?: "any" | "console" | "file") => boolean;
  trace: (message: string, meta?: Record<string, unknown>) => void;
  debug: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
  fatal: (message: string, meta?: Record<string, unknown>) => void;
  raw: (message: string) => void;
  child: (name: string) => SubsystemLogger;
};
//#endregion
//#region src/infra/sqlite-transaction.d.ts
type SqliteTransactionOptions = {
  /** Already-started BEGIN budget, carried between workers in the same process. */
  beginDeadlineNs?: bigint;
  busyTimeoutMs?: number;
  databaseLabel?: string;
  /** Prepared identifiers and counts only; never transcript or session payloads. */
  diagnosticContext?: Readonly<Record<string, string | number | boolean | null | undefined>>;
  logger?: Pick<SubsystemLogger, "warn">;
  operationLabel?: string;
  slowTransactionHoldMs?: number;
  /** Enclose the physical commit in an owner's synchronous authority guard. */
  withCommit?: (commit: () => void) => void;
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
type SqliteWalCheckpointMode = "PASSIVE" | "FULL" | "RESTART" | "TRUNCATE";
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
type SqliteWalCheckpointSnapshot = {
  health: SqliteWalHealth;
  observedAtNs: bigint;
  lastCompletedAtNs?: bigint;
};
//#endregion
//#region src/infra/sqlite-wal-reclamation.d.ts
type SqliteWalReclamationOptions = {
  maxPages?: number;
  checkpointMode?: SqliteWalCheckpointMode;
  beforeMutation?: () => void;
  onCommit?: () => void;
  afterCommit?: () => void;
};
type SqliteWalReclamationResult = {
  checkpointCompleted: boolean;
  checkpoint?: SqliteWalCheckpointSnapshot;
  freePagesBefore: number | null;
  remainingFreePages: number | null;
  checkpointCalls: number;
  checkpointIncomplete: number;
  checkpointMs: number;
  checkpointMaxMs: number;
  queryMs: number;
  vacuumMs: number;
  vacuumPasses: number;
  vacuumPagesRequested: number;
};
//#endregion
//#region src/infra/sqlite-wal-write-admission.d.ts
type SqliteWalPeriodicRequest = {
  maxPages: number;
  checkpointMode: SqliteWalCheckpointMode;
  checkpoint?: SqliteWalCheckpointSnapshot;
};
type SqliteWalPeriodicResult = {
  reclaimedPages: number;
  checkpoint?: SqliteWalCheckpointSnapshot;
};
//#endregion
//#region src/infra/sqlite-wal.d.ts
type SqliteWalMaintenance = {
  /** Last maintenance observation; reading it never checkpoints or probes storage. */
  readonly health?: SqliteWalHealth;
  checkpoint: () => boolean;
  maintainPeriodic?: (request: SqliteWalPeriodicRequest, admit?: (stage: "transaction" | "commit") => void) => SqliteWalPeriodicResult;
  reclaimFreePages: (options?: SqliteWalReclamationOptions) => SqliteWalReclamationResult;
  /** Inspect this retained WAL connection, independently of checkpoint completion elsewhere. */
  inspectIdle?: () => "healthy" | "retire";
  /** Retire timer admission and join accepted maintenance before closing its database. */
  stop: () => Promise<void>;
  /** Final checkpoint; synchronous exit cleanup cancels work without joining it. */
  close: (options?: {
    checkpointMode?: SqliteWalCheckpointMode;
  }) => boolean;
};
//#endregion
//#region src/state/openclaw-state-db-contract.d.ts
/** Open shared SQLite database handle plus WAL maintenance lifecycle. */
type OpenClawStateDatabase = {
  db: DatabaseSync;
  path: string;
  walMaintenance: SqliteWalMaintenance;
};
/** Options for resolving or overriding the shared state database path. */
type OpenClawStateDatabaseOptions = {
  env?: NodeJS.ProcessEnv;
  path?: string;
  database?: OpenClawStateDatabase;
  readOnly?: boolean;
  /** Additional known agent stores can only make first-use classification more conservative. */
  initializationAgentPaths?: readonly string[];
};
//#endregion
//#region src/state/openclaw-state-db-async-lifecycle.d.ts
type OpenClawStateDatabaseReadAdmission = {
  readonly databasePath: string;
  /** Stable across first creation and aliases; coordinates work but grants no authority. */
  readonly coordinationKey: string;
  readonly identity: DatabasePathIdentity;
  assertCurrent: () => void;
};
//#endregion
//#region src/state/openclaw-state-db-cache.d.ts
declare const { touch: touchStateDatabase, retain: retainOpenClawStateDatabaseForIdle }: {
  touch: (database: OpenClawStateDatabase) => void;
  retain(this: void, database: OpenClawStateDatabase): () => void;
};
declare const { register: registerStateDatabaseWalAdmission, readHealth: readOpenClawStateWalHealth, ownRetirement: ownStateDatabaseRetirement, stop: stopOpenClawStateDatabaseMaintenance }: {
  ownRetirement(this: void, database: OpenClawStateDatabase, close: () => Promise<void>): () => void;
  stop(this: void, pathname?: string, identity?: DatabasePathIdentity): Promise<void>;
  register(this: void, database: OpenClawStateDatabase, identity: DatabasePathIdentity, admission: OpenClawStateDatabaseReadAdmission, env: NodeJS.ProcessEnv): void;
  readHealth(this: void): SqliteWalHealth | undefined;
};
/** Retain one exact canonical native owner; only the final reference retires its handle. */
declare const { retain: retainOpenClawStateDatabase, borrowForRead: borrowOpenClawStateDatabaseForAsyncRead, retainForIndependentRead: retainOpenClawStateDatabaseForIndependentRead }: {
  retain: (database: OpenClawStateDatabase) => {
    release(): void;
    releaseAsync(): Promise<void>;
  };
  retainForIndependentRead(this: void, pathname: string, ownership?: "cached-read"): {
    assertCurrent: () => void;
    observe(): void;
    release: () => void;
  } | undefined;
  borrowForRead(this: void, pathname: string, ownership?: "cached-read"): {
    assertCurrent: () => void;
    observe(): void;
    release: () => void;
    database: OpenClawStateDatabase;
  } | undefined;
};
//#endregion
//#region .artifacts/kysely/openclaw-state-db.generated.d.ts
type Generated<T> = T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;
interface AcpReplayEvents {
  at: number;
  estimated_bytes: Generated<number>;
  run_id: string | null;
  seq: number;
  session_id: string;
  session_key: string;
  update_json: string;
}
interface AcpReplaySessions {
  complete: number;
  created_at: number;
  cwd: string;
  estimated_bytes: Generated<number>;
  next_seq: number;
  session_id: string;
  session_key: string;
  updated_at: number;
}
interface AcpSessions {
  agent: string;
  backend: string;
  cwd: string | null;
  identity_json: string | null;
  last_activity_at: number;
  last_error: string | null;
  mode: string;
  runtime_options_json: string | null;
  runtime_session_name: string;
  session_id: string | null;
  session_key: string;
  state: string;
  updated_at: number;
}
interface AgentDatabaseLeases {
  agent_id: string;
  lease_id: string;
  opened_at: number;
  owner_pid: number;
  owner_start_time: number | null;
  path: string;
}
interface AgentDatabases {
  agent_id: string;
  last_seen_at: number;
  path: string;
  schema_version: number;
  size_bytes: number | null;
}
interface AgentDeletionJournal {
  agent_dir: string;
  agent_id: string;
  cleanup_completed: Generated<number>;
  cleanup_paths_json: Generated<string>;
  created_at: number;
  database_paths_json: Generated<string>;
  delete_files: Generated<number>;
  operation_id: Generated<string>;
  sessions_dir: string;
  workspace_dir: string;
}
interface AgentProvenance {
  agent_id: string;
  created_at_ms: number;
  created_via: string;
  creator_agent_id: string | null;
}
interface ApnsRegistrationTombstones {
  deleted_at_ms: number;
  node_id: string;
}
interface ApnsRegistrations {
  distribution: string | null;
  environment: string;
  installation_id: string | null;
  node_id: string;
  relay_handle: string | null;
  relay_origin: string | null;
  send_grant: string | null;
  token: string | null;
  token_debug_suffix: string | null;
  topic: string;
  transport: string;
  updated_at_ms: number;
}
interface AuditEvents {
  account_ref: string | null;
  action: string;
  actor_id: string;
  actor_type: string;
  agent_id: string | null;
  channel: string | null;
  conversation_kind: string | null;
  conversation_ref: string | null;
  delivery_kind: string | null;
  direction: string | null;
  duration_ms: number | null;
  error_code: string | null;
  event_id: string;
  failure_stage: string | null;
  kind: string;
  message_outcome: string | null;
  message_ref: string | null;
  occurred_at: number;
  reason_code: string | null;
  result_count: number | null;
  run_id: string | null;
  schema_version: Generated<number>;
  sequence: Generated<number>;
  session_id: string | null;
  session_key: string | null;
  source_id: string;
  source_sequence: number;
  status: string;
  target_ref: string | null;
  tool_call_id: string | null;
  tool_name: string | null;
}
interface AuditIdentityKeys {
  created_at: number;
  id: Generated<number>;
  key: Uint8Array;
  key_id: string;
}
interface BackupRuns {
  archive_path: string;
  created_at: number;
  id: string;
  manifest_json: string;
  status: string;
}
interface CaptureBlobs {
  blob_id: string;
  content_type: string | null;
  created_at: number;
  data: Uint8Array;
  encoding: string;
  sha256: string;
  size_bytes: number;
}
interface CaptureEvents {
  close_code: number | null;
  content_type: string | null;
  data_blob_id: string | null;
  data_sha256: string | null;
  data_text: string | null;
  direction: string;
  error_text: string | null;
  flow_id: string;
  headers_json: string | null;
  host: string | null;
  id: Generated<number>;
  kind: string;
  meta_json: string | null;
  method: string | null;
  path: string | null;
  protocol: string;
  session_id: string;
  source_process: string;
  source_scope: string;
  status: number | null;
  ts: number;
}
interface CaptureSessions {
  ended_at: number | null;
  id: string;
  mode: string;
  proxy_url: string | null;
  source_process: string;
  source_scope: string;
  started_at: number;
}
interface ChannelIngressEvents {
  account_id: string;
  attempts: Generated<number>;
  channel_id: string;
  claim_owner: string | null;
  claim_token: string | null;
  claimed_at: number | null;
  completed_at: number | null;
  completed_metadata_json: string | null;
  event_id: string;
  failed_at: number | null;
  failed_reason: string | null;
  lane_key: string | null;
  last_attempt_at: number | null;
  last_error: string | null;
  metadata_json: string | null;
  payload_json: string;
  queue_name: string;
  received_at: number;
  status: string;
  updated_at: number;
}
interface ChannelPairingAllowEntries {
  account_id: string;
  channel_key: string;
  entry: string;
  sort_order: number;
  updated_at: number;
}
interface ChannelPairingRequests {
  account_id: string;
  channel_key: string;
  code: string;
  created_at: string;
  last_seen_at: string;
  meta_json: string | null;
  request_id: string;
}
interface ClawCronRefs {
  agent_id: string;
  created_at_ms: number;
  declaration_key: string;
  error: string | null;
  job_json: string;
  manifest_id: string;
  scheduler_job_id: string | null;
  schema_version: string;
  status: string;
  updated_at_ms: number;
}
interface ClawInstalls {
  added_at_ms: number;
  agent_config_digest: string;
  agent_id: string;
  agent_owned_paths_json: string;
  bootstrap_content_digest: string | null;
  bootstrap_source_path: string | null;
  claw_name: string;
  claw_version: string;
  integrity: string;
  integrity_kind: string;
  manifest_path: string;
  manifest_schema_version: number;
  package_root: string;
  plan_integrity: string;
  schema_version: string;
  source_byte_length: number;
  source_kind: string;
  status: string;
  updated_at_ms: number;
  workspace: string;
}
interface ClawMcpServerRefs {
  agent_id: string;
  config_digest: string;
  created_at_ms: number;
  error: string | null;
  independent_owner: Generated<number>;
  name: string;
  origin: string;
  relationship: string;
  schema_version: string;
  status: string;
  updated_at_ms: number;
}
interface ClawPackageRefs {
  agent_id: string;
  claw_name: string;
  extension_adapter_identity: string | null;
  extension_detected_format: string | null;
  extension_format: string | null;
  extension_id: string | null;
  extension_mapped_json: string | null;
  extension_unavailable_json: string | null;
  independent_owner: number;
  installed_at_ms: number;
  origin: string;
  package_integrity: string;
  package_kind: string;
  package_ref: string;
  package_source: string;
  package_status: string;
  package_version: string;
  relationship: string;
  schema_version: string;
  updated_at_ms: number;
}
interface ClawWorkspaceFiles {
  agent_id: string;
  content_digest: string;
  created_at_ms: number;
  schema_version: string;
  source_path: string;
  status: string;
  target_path: string;
  updated_at_ms: number;
  workspace: string;
}
interface ClawhubPromotionClaims {
  claimed_at_ms: number;
  ends_at_ms: number;
  model_keys_json: string;
  provider: string | null;
  slug: string;
}
interface ConfigHealthEntries {
  config_path: string;
  last_known_good_json: string | null;
  last_observed_suspicious_signature: string | null;
  last_promoted_good_json: string | null;
  updated_at_ms: number;
}
interface ConfigMachineState {
  state_key: string;
  updated_at_ms: number;
  value_json: string;
}
interface ConfigRevisionKeys {
  hmac_key: Uint8Array;
  id: Generated<number>;
}
interface CronJobRuntimeAuthorities {
  authority_input_fingerprint: string | null;
  authority_json: string | null;
  job_id: string;
  recovery_required: number;
  store_key: string;
}
interface CronJobScratch {
  content: string | null;
  job_id: string;
  revision: number;
  source_sha256: string | null;
  store_key: string;
  updated_at_ms: number;
}
interface CronJobs {
  agent_id: string | null;
  declaration_key: string | null;
  description: string | null;
  enabled: number;
  grant_definition_generation: number | null;
  grant_definition_revision: string | null;
  grant_definition_updated_at: number | null;
  job_id: string;
  job_json: string;
  name: string;
  owner_agent_id: string | null;
  payload_kind: string;
  runtime_updated_at_ms: number | null;
  schedule_identity: string | null;
  sort_order: Generated<number>;
  state_json: Generated<string>;
  store_key: string;
  updated_at: number;
}
interface CronRunReceipts {
  agent_id: string;
  config_revision: string;
  delivery_attempt_state: Generated<string>;
  error_text: string | null;
  finished_at_ms: number | null;
  job_id: string;
  owner_pid: number;
  owner_start_time: number | null;
  receipt_id: string;
  request_run_id: string | null;
  started_at_ms: number;
  status: string;
  store_key: string;
}
interface CronRunTriggerStateRetirements {
  receipt_id: string;
}
interface CurrentConversationBindings {
  account_id: string;
  binding_id: string;
  binding_key: string;
  bound_at: number;
  channel: string;
  conversation_id: string;
  conversation_kind: string;
  expires_at: number | null;
  metadata_json: string | null;
  parent_conversation_id: string | null;
  record_json: string;
  status: string;
  target_kind: string;
  target_session_key: string;
  updated_at: number;
}
interface DeliveryQueueEntries {
  account_id: string | null;
  channel: string | null;
  enqueued_at: number;
  entry_json: string;
  entry_kind: string | null;
  failed_at: number | null;
  id: string;
  last_attempt_at: number | null;
  last_error: string | null;
  platform_send_started_at: number | null;
  queue_name: string;
  recovery_state: string | null;
  retry_count: Generated<number>;
  session_key: string | null;
  status: string;
  target: string | null;
  updated_at: number;
}
interface DeviceAuthTokens {
  device_id: string;
  role: string;
  scopes_json: string;
  token: string;
  updated_at_ms: number;
}
interface DeviceBootstrapTokens {
  device_id: string | null;
  issued_at_ms: number;
  last_used_at_ms: number | null;
  pending_profile_json: string | null;
  profile_json: string | null;
  public_key: string | null;
  redeemed_profile_json: string | null;
  setup_id: string | null;
  token: string;
  token_key: string;
  ts: number;
}
interface DeviceIdentities {
  created_at_ms: number;
  device_id: string;
  identity_key: string;
  private_key_pem: string;
  public_key_pem: string;
  updated_at_ms: number;
}
interface DevicePairSetupCompletions {
  access: string;
  completed_at_ms: number;
  delivery_state: string;
  device_id: string;
  device_name: string | null;
  retain_until_ms: number;
  setup_id: string;
}
interface DevicePairingJoinCodes {
  created_at_ms: number | null;
  expires_at_ms: number | null;
  payload_json: string | null;
  shortcode: string | null;
}
interface DevicePairingPaired {
  approved_at_ms: number;
  approved_scopes_json: string | null;
  approved_via: string | null;
  browser_origin: string | null;
  client_id: string | null;
  client_mode: string | null;
  created_at_ms: number;
  device_family: string | null;
  device_id: string;
  display_name: string | null;
  last_seen_at_ms: number | null;
  last_seen_reason: string | null;
  node_surface_json: string | null;
  operator_label: string | null;
  pending_node_surface_json: string | null;
  platform: string | null;
  public_key: string;
  remote_ip: string | null;
  role: string | null;
  roles_json: string | null;
  scopes_json: string | null;
  tokens_json: string | null;
}
interface DevicePairingPending {
  browser_origin: string | null;
  client_id: string | null;
  client_mode: string | null;
  device_family: string | null;
  device_id: string;
  display_name: string | null;
  is_repair: number | null;
  platform: string | null;
  public_key: string;
  refreshed_at_ms: number | null;
  remote_ip: string | null;
  request_id: string;
  role: string | null;
  roles_json: string | null;
  scopes_json: string | null;
  silent: number | null;
  ts: number;
}
interface DiagnosticEvents {
  created_at: number;
  event_key: string;
  payload_json: string;
  scope: string;
  sequence: Generated<number>;
}
interface ExecApprovalsConfig {
  agent_count: number;
  allowlist_count: number;
  auto_allow_skills: number | null;
  config_key: string;
  default_ask: string | null;
  default_ask_fallback: string | null;
  default_security: string | null;
  has_socket_token: number;
  raw_json: string;
  socket_path: string | null;
  updated_at_ms: number;
}
interface ExecutionDecisionFacts {
  action_family: string;
  action_id: string | null;
  context_id: string;
  coverage_state: string;
  decision_outcome: string;
  execution_id: string;
  occurred_at: number;
  owner: string;
  reason_code: string;
  receipt_bytes: number;
  receipt_id: string;
  receipt_json: string;
  run_id: string;
  source_ref: string;
}
interface ExecutionIdentityContexts {
  context_bytes: number;
  context_id: string;
  context_json: string;
  coverage_state: string;
  created_at: number;
  execution_id: string;
  run_id: string;
}
interface ExecutionOwnerLifecycleBindings {
  context_id: string;
  execution_id: string;
  owner_id: string;
  owner_kind: string;
}
interface FleetCells {
  container_name: string;
  created_at_ms: number;
  data_dir: string;
  host_port: number;
  image: string;
  runtime: string;
  tenant_id: string;
}
interface FlowRuns {
  blocked_summary: string | null;
  blocked_task_id: string | null;
  cancel_requested_at: number | null;
  controller_id: string | null;
  created_at: number;
  current_step: string | null;
  ended_at: number | null;
  flow_id: string;
  goal: string;
  notify_policy: string;
  owner_key: string;
  requester_origin_json: string | null;
  revision: Generated<number>;
  shape: string | null;
  state_json: string | null;
  status: string;
  sync_mode: Generated<string>;
  updated_at: number;
  wait_json: string | null;
}
interface GatewayBootLifecycle {
  boot_id: string;
  completed_at_ms: number | null;
  outcome: string | null;
  pid: number;
  reason: string | null;
  started_at_ms: number;
  startup_reason: string | null;
}
interface GatewayOriginDeviceTokens {
  device_id: string;
  gateway_scope: string;
  role: string;
  scopes_json: string;
  token: string;
  updated_at_ms: number;
}
interface GatewayRestartHandoff {
  created_at: number;
  expires_at: number;
  handoff_key: string;
  intent_id: string;
  kind: string;
  pid: number;
  process_instance_id: string | null;
  reason: string | null;
  restart_kind: string;
  restart_trace_last_at: number | null;
  restart_trace_started_at: number | null;
  source: string;
  supervisor_mode: string;
  updated_at_ms: number;
  version: number;
}
interface GatewayRestartIntent {
  created_at: number;
  force: number | null;
  intent_key: string;
  kind: string;
  pid: number;
  reason: string | null;
  updated_at_ms: number;
  wait_ms: number | null;
}
interface GatewayRestartSentinel {
  continuation_json: string | null;
  delivery_account_id: string | null;
  delivery_channel: string | null;
  delivery_to: string | null;
  doctor_hint: string | null;
  kind: string;
  message: string | null;
  payload_json: string;
  sentinel_key: string;
  session_key: string | null;
  stats_json: string | null;
  status: string;
  thread_id: string | null;
  ts: number;
  updated_at_ms: number;
  version: number;
}
interface GithubPersonalPublicationRequests {
  agent_id: string;
  base_branch: string;
  body: string | null;
  branch: string;
  connection_generation: string;
  created_at_ms: number;
  effect_state: string | null;
  error_code: string | null;
  execution_id: string | null;
  gateway_instance_id: string | null;
  head_commit: string | null;
  idempotency_key: string;
  identity_account_id: number;
  identity_login: string;
  identity_profile_id: string;
  identity_source: string;
  last_effect: string | null;
  next_action: string | null;
  owner_profile_id: string;
  pull_request_url: string | null;
  push_repository: string;
  reported_at_ms: number | null;
  repository: string;
  repository_fingerprint: string;
  request_digest: string;
  request_id: string;
  session_id: string;
  session_key: string;
  source_head_commit: string;
  source_index_tree: string;
  status: string;
  title: string | null;
  updated_at_ms: number;
  workspace_tree: string;
  worktree_id: string;
}
interface GithubPublicationRequests {
  agent_id: string;
  base_branch: string | null;
  body: string | null;
  branch: string;
  claim_id: string | null;
  created_at_ms: number;
  environment_id: string | null;
  error_code: string | null;
  gateway_instance_id: string | null;
  head_commit: string | null;
  idempotency_key: string;
  identity_account_id: number;
  identity_login: string;
  identity_profile_id: string | null;
  identity_source: string;
  next_action: string | null;
  owner_epoch: number | null;
  placement_generation: number | null;
  pull_request_url: string | null;
  reported_at_ms: number | null;
  repository: string | null;
  repository_fingerprint: string;
  request_digest: string;
  request_id: string;
  run_id: string | null;
  session_id: string;
  session_key: string;
  source_head_commit: string | null;
  source_index_tree: string | null;
  status: string;
  title: string | null;
  updated_at_ms: number;
  workspace_tree: string | null;
  worktree_id: string;
}
interface GithubPublicationSessionLifecycles {
  lifecycle_revision: string | null;
  publication_kind: string;
  request_id: string;
  requester_authority_json: string | null;
}
interface GithubRepositoryPublicationRequests {
  agent_id: string;
  base_branch: string | null;
  body: string | null;
  branch: string;
  checkpoint_digest: string | null;
  checkpoint_ref: string | null;
  claim_id: string | null;
  connection_generation: string | null;
  created_at_ms: number;
  effect_state: string | null;
  environment_id: string | null;
  error_code: string | null;
  execution_id: string | null;
  gateway_instance_id: string | null;
  head_commit: string | null;
  idempotency_key: string;
  identity_account_id: number;
  identity_login: string;
  identity_profile_id: string | null;
  identity_source: string;
  last_effect: string | null;
  next_action: string | null;
  owner_epoch: number | null;
  owner_profile_id: string | null;
  placement_generation: number | null;
  previous_head_commit: string | null;
  pull_request_url: string | null;
  push_repository: string | null;
  pushed_head_commit: string | null;
  reported_at_ms: number | null;
  repository: string | null;
  request_digest: string;
  request_id: string;
  requester_authority_json: string | null;
  run_id: string | null;
  session_id: string;
  session_key: string;
  session_lifecycle_revision: string | null;
  source_head_commit: string | null;
  source_index_tree: string | null;
  status: string;
  title: string | null;
  updated_at_ms: number;
  workspace_id: string;
  workspace_tree: string | null;
}
interface LocalWorkspaceProjections {
  agent_id: string;
  base_commit: string;
  baseline_json: string | null;
  baseline_ref: string | null;
  created_at_ms: number;
  journal_json: string | null;
  journal_pack: Uint8Array | null;
  lifecycle_revision: string | null;
  paused_runtimes_json: string | null;
  pending_ref: string | null;
  pending_target: string | null;
  projection_path: string;
  revision: Generated<number>;
  session_id: string;
  session_key: string;
  source_paths_json: string;
  worktree_id: string;
}
interface MacosPortGuardianRecords {
  command: string;
  mode: string;
  pid: Generated<number>;
  port: number;
  timestamp: number;
}
interface ManagedOutgoingImageRecords {
  agent_id: string | null;
  alt: string;
  attachment_id: string;
  cleanup_pending: Generated<number>;
  created_at: string;
  message_id: string | null;
  original_content_type: string;
  original_filename: string | null;
  original_height: number | null;
  original_media_id: string;
  original_media_root: string;
  original_media_subdir: string;
  original_size_bytes: number | null;
  original_width: number | null;
  record_json: string;
  retention_class: string | null;
  session_key: string;
  updated_at: string | null;
}
interface McpOauthPendingAuthorizations {
  create_time: number;
  state: string;
  store_key: string;
}
interface McpOauthStores {
  format_version: number;
  store_json: string;
  store_key: string;
  updated_at: number;
}
interface MeetingTranscriptSessions {
  created_at_ms: number;
  export_key: string;
  export_manifest_json: Generated<string>;
  export_pending_json: Generated<string>;
  metadata_json: string | null;
  next_utterance_seq: Generated<number>;
  provider_id: string;
  selector: string;
  session_id: string;
  session_slug: string;
  source_json: string;
  started_at: string;
  stopped_at: string | null;
  title: string | null;
  updated_at_ms: number;
}
interface MeetingTranscriptSummaries {
  generated_at: string | null;
  markdown: string | null;
  session_id: string;
  session_started_at: string;
  summary_json: string | null;
  utterance_count: number;
}
interface MeetingTranscriptUtterances {
  ended_at: string | null;
  final: number | null;
  metadata_json: string | null;
  sequence: number;
  session_id: string;
  session_started_at: string;
  speaker_id: string | null;
  speaker_label: string | null;
  started_at: string | null;
  text: string;
  utterance_id: string | null;
}
interface MigrationRuns {
  finished_at: number | null;
  id: string;
  report_json: string;
  started_at: number;
  status: string;
}
interface MigrationSources {
  imported_at: number;
  last_run_id: string;
  migration_kind: string;
  removed_source: Generated<number>;
  report_json: string;
  source_key: string;
  source_path: string;
  source_record_count: number | null;
  source_sha256: string | null;
  source_size_bytes: number | null;
  status: string;
  target_table: string;
}
interface NativeHookRelayBridges {
  expires_at_ms: number;
  hostname: string;
  pid: number;
  port: number;
  relay_id: string;
  token: string;
  updated_at_ms: number;
}
interface NodeWorkerLaunchCleanup {
  cleanup_mode: string;
  launch_id: string;
  lineage_settled: number | null;
}
interface NodeWorkerLaunchContainers {
  container_json: string | null;
  launch_id: string;
}
interface NodeWorkerLaunchProcessScopes {
  descendants_reaped: number | null;
  launch_id: string;
  scope_kind: string;
}
interface NodeWorkerLaunches {
  completed_at_ms: number | null;
  created_at_ms: number;
  environment_id: string;
  error_text: string | null;
  gateway_namespace: string;
  launch_id: string;
  owner_epoch: number;
  placement_generation: number;
  plan_hash: string;
  result_json: string | null;
  run_id: string;
  session_id: string;
  state: string;
  supervisor_pid: number;
  supervisor_start_time: number;
  updated_at_ms: number;
  worker_pid: number | null;
  worker_start_time: number | null;
}
interface NodeWorkerPreparedWorkspaces {
  bound_at_ms: number | null;
  cache_key: string;
  created_at_ms: number;
  environment_id: string;
  gateway_namespace: string;
  home_dir: string;
  owner_epoch: number | null;
  preparation_key: string;
  prepared_manifest_ref: string;
  retired_at_ms: number | null;
  session_id: string | null;
  session_key: string | null;
  source_manifest_ref: string;
  state: string;
  workspace_dir: string;
}
interface NodeWorkerTurns {
  completed_at_ms: number | null;
  created_at_ms: number;
  error_text: string | null;
  owner_launch_id: string;
  plan_hash: string;
  result_json: string | null;
  run_id: string;
  state: string;
  turn_id: string;
  updated_at_ms: number;
}
interface OfficialExternalPluginCatalogSnapshots {
  body: string;
  checksum: string;
  etag: string | null;
  feed_url: string;
  last_modified: string | null;
  saved_at: string;
  status: number;
  trust_key_id: string | null;
  trust_mode: string | null;
  trust_signature_count: number | null;
  trust_threshold: number | null;
  trust_verified_at: string | null;
  updated_at_ms: number;
}
interface OperatorApprovalExecutionIdentities {
  approval_id: string;
  source_context_id: string;
  source_execution_id: string;
}
interface OperatorApprovalStandingGrantGenerations {
  grant_id: string;
  job_definition_generation: number;
}
interface OperatorApprovalStandingGrants {
  agent_id: string;
  created_at_ms: number;
  cron_job_id: string;
  expires_at_ms: number | null;
  grant_id: string;
  job_config_revision: string;
  last_used_at_ms: number | null;
  minted_by_approval_id: string;
  operation_binding: string;
  revoked_at_ms: number | null;
  revoked_by: string | null;
  use_count: Generated<number>;
}
interface OperatorApprovals {
  approval_id: string;
  audience_session_keys_json: string;
  consumed_at_ms: number | null;
  consumed_by: string | null;
  created_at_ms: number;
  decision: string | null;
  expires_at_ms: number;
  kind: string;
  presentation_json: string;
  requested_by_client_id: string | null;
  requested_by_device_id: string | null;
  requested_by_device_token_auth: Generated<number>;
  resolution_ref: string;
  resolved_at_ms: number | null;
  resolver_id: string | null;
  resolver_kind: string | null;
  reviewer_device_ids_json: string;
  runtime_epoch: string;
  source_agent_id: string | null;
  source_run_id: string | null;
  source_session_id: string | null;
  source_session_key: string | null;
  source_tool_call_id: string | null;
  source_tool_name: string | null;
  status: string;
  terminal_reason: string | null;
  updated_at_ms: number;
}
interface OutboundMediaProvenance {
  created_at_ms: number;
  kind: string;
  realpath: string;
  sha256: string;
  size_bytes: number;
  version: number;
}
interface OutboundMessageExecutionBindings {
  context_id: string;
  event_id: string;
  execution_id: string;
  run_id: string;
}
interface OutboundMessageProgress {
  account_ref: string | null;
  action: string;
  actor_id: string;
  actor_type: string;
  agent_id: string | null;
  channel: string;
  context_id: string | null;
  conversation_kind: string;
  conversation_ref: string | null;
  duration_ms: number | null;
  execution_id: string | null;
  occurred_at: number;
  outcome: string;
  progress_id: string;
  run_id: string | null;
  schema_version: number;
  sequence: Generated<number>;
  source_id: string;
  source_sequence: number;
  target_ref: string | null;
}
interface PluginBindingApprovals {
  account_id: string;
  approved_at: number;
  channel: string;
  plugin_id: string;
  plugin_name: string | null;
  plugin_root: string;
}
interface PluginBlobEntries {
  blob: Uint8Array;
  created_at: number;
  entry_key: string;
  expires_at: number | null;
  metadata_json: string;
  namespace: string;
  plugin_id: string;
}
interface PluginStateEntries {
  created_at: number;
  entry_key: string;
  expires_at: number | null;
  namespace: string;
  plugin_id: string;
  value_json: string;
}
interface Projects {
  created_at_ms: number;
  display_name: string;
  id: string;
  origin_url: string | null;
  repo_root: string;
  source: string;
  updated_at_ms: number;
}
interface SandboxRegistryEntries {
  backend_id: string | null;
  cdp_port: number | null;
  config_hash: string | null;
  config_label_kind: string | null;
  container_name: string;
  created_at_ms: number | null;
  entry_json: string;
  image: string | null;
  last_used_at_ms: number | null;
  no_vnc_port: number | null;
  registry_kind: string;
  runtime_label: string | null;
  session_key: string | null;
  updated_at: number;
}
interface SchemaMeta {
  agent_id: string | null;
  app_version: string | null;
  created_at: number;
  meta_key: string;
  role: string;
  schema_version: number;
  updated_at: number;
}
interface SecretStoreEntries {
  allowed_hosts: string | null;
  created_at_ms: number;
  deleted_at_ms: number | null;
  kind: string;
  name: string;
  scope_id: string;
  scope_kind: string;
  updated_at_ms: number;
  updated_by: string | null;
  value: string;
}
interface SessionGroups {
  created_at: number;
  cwd: string | null;
  name: string;
  position: number;
  worktree: number | null;
}
interface SessionRepositoryWorkspaces {
  agent_id: string;
  base_commit: string | null;
  base_manifest_hash: string | null;
  branch: string;
  checkpoint_ref: string | null;
  created_at_ms: number;
  manifest_hash: string | null;
  requested_ref: string | null;
  revision: number;
  run_setup_script: Generated<number>;
  session_key: string;
  updated_at_ms: number;
  url: string;
  workspace_id: string;
}
interface SessionStateEvents {
  actor_id: string | null;
  actor_type: string;
  agent_id: string;
  dedupe_key: string | null;
  kind: string;
  occurred_at: number;
  payload_json: string | null;
  run_id: string | null;
  sequence: Generated<number>;
  session_id: string | null;
  session_key: string;
  summary: string;
}
interface SessionStateHeads {
  agent_id: string;
  last_sequence: number;
  pruned_max_sequence: Generated<number>;
  session_key: string;
  updated_at: number;
}
interface SessionUpstreamLinks {
  agent_id: string;
  catalog_id: string;
  created_at: number;
  host_id: string;
  last_marker_json: string | null;
  last_scanned_at: number | null;
  session_key: string;
  thread_id: string;
  updated_at: number;
  upstream_kind: string;
  upstream_ref_json: string | null;
}
interface SessionWatchCursors {
  last_seen_sequence: Generated<number>;
  material_sequence: Generated<number>;
  notified_sequence: Generated<number>;
  provenance: Generated<string>;
  target_session_key: string;
  updated_at: number;
  watcher_session_key: string;
  watcher_store_path: string | null;
}
interface SkillLibraryEntries {
  author_profile_id: string;
  created_at: number;
  current_revision: string;
  enabled: number;
  owner_profile_id: string | null;
  removed: number;
  shared: number;
  skill_id: string;
  slug: string;
  updated_at: number;
}
interface SkillLibraryEvents {
  action: string;
  actor_profile_id: string;
  created_at: number;
  event_id: string;
  revision: string;
  skill_id: string;
}
interface SkillLibraryRevisions {
  created_at: number;
  description: string;
  files_json: string;
  revision: string;
  skill_id: string;
}
interface SkillLibraryUploads {
  archive_blob: Uint8Array;
  expires_at: number;
  owner_profile_id: string;
  published_skill_id: string | null;
  sha256: string;
  size_bytes: number;
  slug: string;
  upload_id: string;
}
interface SkillUploadChunks {
  byte_offset: number;
  chunk_blob: Uint8Array;
  size_bytes: number;
  upload_id: string;
}
interface SkillUploads {
  actual_sha256: string | null;
  archive_blob: Uint8Array;
  committed: number;
  committed_at: number | null;
  created_at: number;
  expires_at: number;
  force: number;
  idempotency_key_hash: string | null;
  kind: string;
  received_bytes: number;
  sha256: string | null;
  size_bytes: number;
  slug: string;
  upload_id: string;
}
interface SkillUsage {
  first_used_at_ms: number;
  last_agent_id: string | null;
  last_used_at_ms: number;
  skill_file: string;
  skill_key: string;
  skill_name: string;
  skill_source: string;
  use_count: number;
}
interface SkillWorkshopCollectionReviews {
  backup_id: string;
  create_time: number;
  dropped_json: string;
  kept_names_json: string;
  owner_agent_id: string;
  review_id: string;
  written_names_json: string;
}
interface SkillWorkshopProposalEvents {
  actor_json: string;
  correlation_id: string | null;
  event_id: string;
  event_type: string;
  occurred_at: string;
  payload_json: string | null;
  proposal_id: string;
  proposed_version: string;
  revision_hash: string;
  sequence: Generated<number>;
}
interface SkillWorkshopProposalRollbacks {
  action: string;
  previous_content: string | null;
  previous_content_hash: string | null;
  proposal_id: string;
  support_files_json: string | null;
  target_skill_file: string;
  written_at: string;
}
interface SkillWorkshopProposals {
  applied_at: string | null;
  created_at: string;
  draft_hash: string;
  kind: string;
  origin_agent_id: string | null;
  origin_message_id: string | null;
  origin_run_id: string | null;
  origin_session_key: string | null;
  owner_agent_id: string | null;
  proposal_id: string;
  quarantined_at: string | null;
  record_json: string;
  rejected_at: string | null;
  stale_at: string | null;
  status: string;
  status_reason: string | null;
  updated_at: string;
}
interface StateLeases {
  created_at: number;
  expires_at: number | null;
  heartbeat_at: number | null;
  lease_key: string;
  owner: string;
  payload_json: string | null;
  scope: string;
  updated_at: number;
}
interface SubagentRuns {
  child_session_key: string;
  controller_session_key: string | null;
  controller_store_path: string | null;
  created_at: number;
  payload_json: Generated<string>;
  requester_session_key: string;
  requester_store_path: string | null;
  run_id: string;
}
interface TaskDeliveryState {
  last_notified_event_at: number | null;
  requester_origin_json: string | null;
  task_id: string;
}
interface TaskRuns {
  agent_id: string | null;
  child_session_key: string | null;
  cleanup_after: number | null;
  created_at: number;
  delivery_status: string;
  detail_json: string | null;
  ended_at: number | null;
  error: string | null;
  execution_owner_host: string | null;
  execution_owner_pid: number | null;
  execution_owner_start_identity: number | null;
  label: string | null;
  last_event_at: number | null;
  last_tool_name: string | null;
  notify_policy: string;
  owner_key: string;
  parent_flow_id: string | null;
  parent_task_id: string | null;
  progress_summary: string | null;
  requester_agent_id: string | null;
  requester_session_key: string | null;
  run_id: string | null;
  runtime: string;
  scope_kind: string;
  source_id: string | null;
  started_at: number | null;
  status: string;
  task: string;
  task_id: string;
  task_kind: string | null;
  terminal_outcome: string | null;
  terminal_summary: string | null;
  tool_use_count: number | null;
}
interface UpdateRuns {
  after_json: string;
  before_json: string;
  confirmed_at_ms: number | null;
  created_at_ms: number;
  downtime_ms: number | null;
  finished_at_ms: number | null;
  origin_json: string;
  phase: string;
  reason: string | null;
  repair_json: string;
  run_id: string;
  status: string;
  steps_json: string;
  target_json: string;
  trigger: string;
  updated_at_ms: number;
  verification_json: string;
}
interface UserPreferences {
  pref_key: string;
  profile_id: string;
  updated_at_ms: number;
  value_json: string;
}
interface UserProfileIdentities {
  authorization_basis_json: string | null;
  authorization_id: string | null;
  canonical_login: string | null;
  created_at: number;
  profile_id: string;
  provider: string;
  subject: string;
}
interface WebPushApprovalDeliveries {
  approval_id: string;
  device_id: string;
  prepared_at_ms: number;
  subscription_id: string;
  user_profile_id: string | null;
}
interface WebPushSubscriptions {
  auth: string;
  created_at_ms: number;
  device_id: string | null;
  endpoint: string;
  endpoint_hash: string;
  p256dh: string;
  preferences_json: string | null;
  subscription_id: string;
  updated_at_ms: number;
  user_profile_id: string | null;
}
interface WorkerEnvironmentCredentials {
  bundle_hash: string;
  credential_hash: string;
  delivered_at_ms: number | null;
  environment_id: string;
  expires_at_ms: number;
  owner_epoch: number;
  rpc_set_version: number;
  session_id: string | null;
}
interface WorkerEnvironmentSshFallbackPorts {
  environment_id: string;
  port: number;
  position: number;
}
interface WorkerEnvironments {
  attached_session_ids_json: Generated<string>;
  bootstrap_bundle_hash: string | null;
  bootstrap_install_kind: string | null;
  bootstrap_openclaw_version: string | null;
  bootstrap_protocol_features_json: string | null;
  created_at_ms: number;
  desktop_json: string | null;
  destroy_requested_at_ms: number | null;
  environment_id: string;
  idle_since_at_ms: number | null;
  last_activated_at_ms: number | null;
  last_error: string | null;
  lease_id: string | null;
  node_device_id: string | null;
  node_setup_id: string | null;
  owner_epoch: Generated<number>;
  preparation_consumed_at_ms: number | null;
  preparation_demand_at_ms: number | null;
  preparation_expires_at_ms: number | null;
  preparation_key: string | null;
  preparation_purpose: string | null;
  profile_id: string;
  profile_snapshot_json: string;
  provider_id: string;
  provision_operation_id: string;
  shared_host: number | null;
  ssh_host: string | null;
  ssh_host_key: string | null;
  ssh_key_ref_json: string | null;
  ssh_port: number | null;
  ssh_user: string | null;
  state: string;
  state_changed_at_ms: number;
  teardown_terminal_state: string | null;
  updated_at_ms: number;
}
interface WorkerInferenceTurns {
  created_at_ms: number;
  environment_id: string;
  request_hash: string;
  run_epoch: number;
  run_id: string;
  session_id: string;
  state: string;
  terminal_json: string | null;
  turn_id: string;
  updated_at_ms: number;
}
interface WorkerSessionPlacementMoves {
  abandon_source: number | null;
  created_at_ms: number;
  last_error: string | null;
  operation_id: string;
  session_id: string;
  source_environment_id: string;
  source_generation: number;
  source_owner_epoch: number;
  target_id: string | null;
  target_kind: string;
  target_machine_class: string | null;
  target_os: string | null;
  updated_at_ms: number;
}
interface WorkerSessionPlacements {
  active_owner_epoch: number | null;
  agent_id: string;
  created_at_ms: number;
  environment_id: string | null;
  execution_mode: string | null;
  last_live_event_ack_cursor: number | null;
  last_transcript_ack_cursor: number | null;
  recovery_error: string | null;
  remote_workspace_dir: string | null;
  session_id: string;
  session_key: string;
  state: string;
  state_changed_at_ms: number;
  terminal_at_ms: number | null;
  terminal_reason: string | null;
  transition_generation: Generated<number>;
  turn_claim_generation: number | null;
  turn_claim_id: string | null;
  turn_claim_owner: string | null;
  turn_claim_owner_epoch: number | null;
  turn_claim_run_id: string | null;
  updated_at_ms: number;
  worker_bundle_hash: string | null;
  workspace_base_manifest_ref: string | null;
}
interface WorkerSessionToolOperations {
  child_session_key: string | null;
  created_at_ms: number;
  gateway_instance_id: string;
  operation_seed: string;
  request_digest: string;
  result_json: string | null;
  source_claim_id: string;
  source_session_id: string;
  status: string;
  tool_call_id: string;
  tool_name: string;
  updated_at_ms: number;
}
interface WorkerTranscriptCommitHeads {
  environment_id: string;
  next_seq: number;
  run_epoch: number;
  session_id: string;
  updated_at_ms: number;
}
interface WorkerTranscriptCommits {
  created_at_ms: number;
  request_hash: string;
  result_json: string | null;
  run_epoch: number;
  seq: number;
  session_id: string;
  state: string;
  updated_at_ms: number;
}
interface WorkerTurnToolAuthorities {
  claim_id: string;
  environment_id: string;
  owner_epoch: number;
  placement_generation: number;
  run_id: string;
  session_id: string;
  tool_names_json: string;
  updated_at_ms: number;
}
interface WorkerWorkspacePendingResults {
  claim_id: string;
  created_at_ms: number;
  environment_id: string;
  gateway_instance_id: string;
  owner_epoch: number;
  placement_generation: number;
  recovery_requested_at_ms: number | null;
  repository_workspace_id: string | null;
  run_id: string;
  session_id: string;
  staged_result_ref: string | null;
  workspace_accepted_at_ms: number | null;
}
interface WorkerWorkspaceReconciliations {
  base_manifest_ref: string;
  base_pack: Uint8Array;
  created_at_ms: number;
  current_manifest_ref: string;
  environment_id: string;
  owner_epoch: number;
  placement_generation: number;
  plan_json: string;
  session_id: string;
}
interface WorkspaceGeneratedBootstrapHashes {
  filename: string;
  sha256: string;
  workspace_key: string;
}
interface WorkspacePathAliases {
  alias_key: string;
  alias_path: string;
  updated_at_ms: number;
  workspace_key: string;
  workspace_path: string;
}
interface WorkspaceSetupState {
  attestation_updated_at_ms: number | null;
  attested_at_ms: number | null;
  bootstrap_seeded_at: string | null;
  setup_completed_at: string | null;
  updated_at: number | null;
  version: number | null;
  workspace_key: string;
  workspace_path: string | null;
}
interface WorktreeProvisionedFileChunks {
  chunk_index: number;
  data: Uint8Array;
  path: string;
  worktree_id: string;
}
interface WorktreeTemplates {
  backend: string;
  cache_key: string;
  common_dir: string;
  content_key: string;
  created_at: number;
  id: string;
  last_used_at: number;
  path: string;
  repo_root: string;
  source_commit: string;
  status: string;
  worktree_root: string;
}
interface Worktrees {
  base_ref: string;
  branch: string;
  created_at: number;
  gc_protection_json: string | null;
  id: string;
  last_active_at: number;
  owner_id: string | null;
  owner_kind: string;
  path: string;
  provisioned_paths_json: string | null;
  removed_at: number | null;
  repo_fingerprint: string;
  repo_root: string;
  run_end_cleanup_json: string | null;
  snapshot_ref: string | null;
}
interface DB {
  acp_replay_events: AcpReplayEvents;
  acp_replay_sessions: AcpReplaySessions;
  acp_sessions: AcpSessions;
  agent_database_leases: AgentDatabaseLeases;
  agent_databases: AgentDatabases;
  agent_deletion_journal: AgentDeletionJournal;
  agent_provenance: AgentProvenance;
  apns_registration_tombstones: ApnsRegistrationTombstones;
  apns_registrations: ApnsRegistrations;
  audit_events: AuditEvents;
  audit_identity_keys: AuditIdentityKeys;
  backup_runs: BackupRuns;
  capture_blobs: CaptureBlobs;
  capture_events: CaptureEvents;
  capture_sessions: CaptureSessions;
  channel_ingress_events: ChannelIngressEvents;
  channel_pairing_allow_entries: ChannelPairingAllowEntries;
  channel_pairing_requests: ChannelPairingRequests;
  claw_cron_refs: ClawCronRefs;
  claw_installs: ClawInstalls;
  claw_mcp_server_refs: ClawMcpServerRefs;
  claw_package_refs: ClawPackageRefs;
  claw_workspace_files: ClawWorkspaceFiles;
  clawhub_promotion_claims: ClawhubPromotionClaims;
  config_health_entries: ConfigHealthEntries;
  config_machine_state: ConfigMachineState;
  config_revision_keys: ConfigRevisionKeys;
  cron_job_runtime_authorities: CronJobRuntimeAuthorities;
  cron_job_scratch: CronJobScratch;
  cron_jobs: CronJobs;
  cron_run_receipts: CronRunReceipts;
  cron_run_trigger_state_retirements: CronRunTriggerStateRetirements;
  current_conversation_bindings: CurrentConversationBindings;
  delivery_queue_entries: DeliveryQueueEntries;
  device_auth_tokens: DeviceAuthTokens;
  device_bootstrap_tokens: DeviceBootstrapTokens;
  device_identities: DeviceIdentities;
  device_pair_setup_completions: DevicePairSetupCompletions;
  device_pairing_join_codes: DevicePairingJoinCodes;
  device_pairing_paired: DevicePairingPaired;
  device_pairing_pending: DevicePairingPending;
  diagnostic_events: DiagnosticEvents;
  exec_approvals_config: ExecApprovalsConfig;
  execution_decision_facts: ExecutionDecisionFacts;
  execution_identity_contexts: ExecutionIdentityContexts;
  execution_owner_lifecycle_bindings: ExecutionOwnerLifecycleBindings;
  fleet_cells: FleetCells;
  flow_runs: FlowRuns;
  gateway_boot_lifecycle: GatewayBootLifecycle;
  gateway_origin_device_tokens: GatewayOriginDeviceTokens;
  gateway_restart_handoff: GatewayRestartHandoff;
  gateway_restart_intent: GatewayRestartIntent;
  gateway_restart_sentinel: GatewayRestartSentinel;
  github_personal_publication_requests: GithubPersonalPublicationRequests;
  github_publication_requests: GithubPublicationRequests;
  github_publication_session_lifecycles: GithubPublicationSessionLifecycles;
  github_repository_publication_requests: GithubRepositoryPublicationRequests;
  local_workspace_projections: LocalWorkspaceProjections;
  macos_port_guardian_records: MacosPortGuardianRecords;
  managed_outgoing_image_records: ManagedOutgoingImageRecords;
  mcp_oauth_pending_authorizations: McpOauthPendingAuthorizations;
  mcp_oauth_stores: McpOauthStores;
  meeting_transcript_sessions: MeetingTranscriptSessions;
  meeting_transcript_summaries: MeetingTranscriptSummaries;
  meeting_transcript_utterances: MeetingTranscriptUtterances;
  migration_runs: MigrationRuns;
  migration_sources: MigrationSources;
  native_hook_relay_bridges: NativeHookRelayBridges;
  node_worker_launch_cleanup: NodeWorkerLaunchCleanup;
  node_worker_launch_containers: NodeWorkerLaunchContainers;
  node_worker_launch_process_scopes: NodeWorkerLaunchProcessScopes;
  node_worker_launches: NodeWorkerLaunches;
  node_worker_prepared_workspaces: NodeWorkerPreparedWorkspaces;
  node_worker_turns: NodeWorkerTurns;
  official_external_plugin_catalog_snapshots: OfficialExternalPluginCatalogSnapshots;
  operator_approval_execution_identities: OperatorApprovalExecutionIdentities;
  operator_approval_standing_grant_generations: OperatorApprovalStandingGrantGenerations;
  operator_approval_standing_grants: OperatorApprovalStandingGrants;
  operator_approvals: OperatorApprovals;
  outbound_media_provenance: OutboundMediaProvenance;
  outbound_message_execution_bindings: OutboundMessageExecutionBindings;
  outbound_message_progress: OutboundMessageProgress;
  plugin_binding_approvals: PluginBindingApprovals;
  plugin_blob_entries: PluginBlobEntries;
  plugin_state_entries: PluginStateEntries;
  projects: Projects;
  sandbox_registry_entries: SandboxRegistryEntries;
  schema_meta: SchemaMeta;
  secret_store_entries: SecretStoreEntries;
  session_groups: SessionGroups;
  session_repository_workspaces: SessionRepositoryWorkspaces;
  session_state_events: SessionStateEvents;
  session_state_heads: SessionStateHeads;
  session_upstream_links: SessionUpstreamLinks;
  session_watch_cursors: SessionWatchCursors;
  skill_library_entries: SkillLibraryEntries;
  skill_library_events: SkillLibraryEvents;
  skill_library_revisions: SkillLibraryRevisions;
  skill_library_uploads: SkillLibraryUploads;
  skill_upload_chunks: SkillUploadChunks;
  skill_uploads: SkillUploads;
  skill_usage: SkillUsage;
  skill_workshop_collection_reviews: SkillWorkshopCollectionReviews;
  skill_workshop_proposal_events: SkillWorkshopProposalEvents;
  skill_workshop_proposal_rollbacks: SkillWorkshopProposalRollbacks;
  skill_workshop_proposals: SkillWorkshopProposals;
  state_leases: StateLeases;
  subagent_runs: SubagentRuns;
  task_delivery_state: TaskDeliveryState;
  task_runs: TaskRuns;
  update_runs: UpdateRuns;
  user_preferences: UserPreferences;
  user_profile_identities: UserProfileIdentities;
  web_push_approval_deliveries: WebPushApprovalDeliveries;
  web_push_subscriptions: WebPushSubscriptions;
  worker_environment_credentials: WorkerEnvironmentCredentials;
  worker_environment_ssh_fallback_ports: WorkerEnvironmentSshFallbackPorts;
  worker_environments: WorkerEnvironments;
  worker_inference_turns: WorkerInferenceTurns;
  worker_session_placement_moves: WorkerSessionPlacementMoves;
  worker_session_placements: WorkerSessionPlacements;
  worker_session_tool_operations: WorkerSessionToolOperations;
  worker_transcript_commit_heads: WorkerTranscriptCommitHeads;
  worker_transcript_commits: WorkerTranscriptCommits;
  worker_turn_tool_authorities: WorkerTurnToolAuthorities;
  worker_workspace_pending_results: WorkerWorkspacePendingResults;
  worker_workspace_reconciliations: WorkerWorkspaceReconciliations;
  workspace_generated_bootstrap_hashes: WorkspaceGeneratedBootstrapHashes;
  workspace_path_aliases: WorkspacePathAliases;
  workspace_setup_state: WorkspaceSetupState;
  worktree_provisioned_file_chunks: WorktreeProvisionedFileChunks;
  worktree_templates: WorktreeTemplates;
  worktrees: Worktrees;
}
//#endregion
//#region src/state/user-profiles.types.d.ts
type UserProfileIdentity = {
  profileId: string;
  role: string | null;
  githubLogin?: string | null;
  aliases: ReadonlySet<string>;
};
//#endregion
//#region src/state/user-channel-identities.d.ts
declare const commandReferenceSchema: z.ZodUnion<readonly [z.ZodObject<{
  version: z.ZodLiteral<1>;
  id: z.ZodUUID;
}, z.core.$strict>, z.ZodObject<{
  id: z.ZodUUID;
  version: z.ZodLiteral<2>;
}, z.core.$strict>]>;
type CommandOwnerReference = Readonly<z.infer<typeof commandReferenceSchema>>;
//#endregion
//#region src/auto-reply/command-owner-authority.d.ts
type CommandOwnerAssertion = (() => void) & {
  readonly recoveryReference?: CommandOwnerReference | null;
};
//#endregion
//#region src/auto-reply/reply-payload.d.ts
type ReplyMediaFailureCode = "file-not-found" | "unsupported-format" | "delivery-failed" | "invalid-reference";
/** Producer-owned outcome for one attachment that could not be delivered. */
type ReplyMediaFailure = {
  code: ReplyMediaFailureCode;
  kind: "image" | "audio" | "video" | "document";
  label: string;
  mimeType?: string;
};
/** Reply policy facts that provider adapters use to resolve the final transport route. */
type ReplyDeliveryContext = {
  chatType?: "direct" | "group" | "channel" | null;
  replyToMode: ReplyToMode;
};
/** WeakMap-backed metadata attached to payload objects without changing wire shape. */
type SessionWriterDeliveryAuthority = {
  agentId?: string;
  /** Captured admitted completion authority, retained by the durable queue. */
  harnessCompletion?: HarnessCompletionRecovery;
  expectedLifecycleRevision?: string;
  expectedSessionId: string;
  expectedWriterRunId?: string;
  sessionKey: string;
  storePath?: string;
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
/** An accepted visible work session and its canonical Control UI link. */
type VisibleWorkSession = {
  sessionKey: string;
  url: string;
  label?: string;
};
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
  /** Reports visible work sessions this agent run spawned, in acceptance order. */
  onVisibleWorkSessions?: (sessions: readonly VisibleWorkSession[]) => void;
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
  /** Wording only; heartbeat visibility/suppression semantics stay on isHeartbeat. */
  useHeartbeatFailureCopy?: boolean;
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
  InternalTurnSource?: "heartbeat" | "cron" | "exec" | "event" | "progress-card-refresh";
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
  /** Display-only launch destination; not delivery routing or prompt content. */
  ConversationLink?: SessionConversationLink;
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
type FinalizedMsgContext = Omit<MsgContext, "CommandAuthorized"> & {
  /**
   * Always set by finalizeInboundContext().
   * Default-deny: missing/undefined becomes false.
   */
  CommandAuthorized: boolean;
  /**
   * Populated by finalizeInboundContext(); optional for public SDK
   * compatibility with existing plugin-constructed finalized contexts.
   */
  CommandTurn?: CommandTurnContext;
};
type RuntimeMediaContextKey = "MediaPath" | "MediaUrl" | "MediaType" | "MediaDir" | "MediaPaths" | "MediaUrls" | "MediaTypes" | "MediaWorkspaceDir" | "MediaTranscribedIndexes" | "MediaStaged";
/** Internal inbound context; legacy media fields exist only on the shipped SDK adapter. */
type RuntimeMsgContext = Omit<MsgContext, RuntimeMediaContextKey>;
type FinalizedRuntimeMsgContext = Omit<RuntimeMsgContext, "CommandAuthorized" | keyof CanonicalInboundText> & CanonicalInboundText & {
  CommandAuthorized: boolean;
  CommandTurn?: CommandTurnContext;
};
type NonTemplateContextKey = "ConversationAvatar" | "ConversationLink";
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
//#endregion
//#region src/sessions/session-row-changes.d.ts
type SessionRowFacts = {
  kind: "unchanged";
} | {
  kind: "entry";
  previousSessionId: string | undefined;
  sessionId: string;
  category: string | null;
  clearMembers: boolean;
} | {
  kind: "member";
  sessionId: string;
  identityId: string;
  present: boolean;
} | {
  kind: "owner";
  sessionId: string;
  lifecycleRevision: string | null;
  owner: SessionEntry["owner"];
} | {
  kind: "participants";
  /** Participant history belongs to the logical key, across transcript replacements. */
  projection?: Pick<SessionEntry, "participants" | "participantCount">;
} | {
  kind: "category";
  sessionId: string;
  category: string | null;
} | {
  kind: "removed";
};
type SessionRowChange = {
  sessionKey: string;
  agentId?: string;
  storePath?: string;
  scope?: "automation" | "runtime" | "session-entry";
  /** Category uncertainty cannot change identity or lineage; other storage outcomes can. */
  factsInvalidated?: true | "category";
  /** Omission is a metadata notification; storage owners publish their changed facts. */
  facts?: SessionRowFacts;
} | {
  all: true;
  scope: string | {
    agentId?: string;
    storePath?: string;
    topology?: true;
  };
  factsInvalidated?: true;
};
//#endregion
//#region src/state/openclaw-agent-db-contract.d.ts
/** Open per-agent SQLite database handle plus lifecycle maintenance. */
type OpenClawAgentDatabase = {
  agentId: string;
  db: DatabaseSync;
  path: string;
  walMaintenance: SqliteWalMaintenance;
};
/** Options for resolving and opening one agent database. */
type OpenClawAgentDatabaseOptions = OpenClawStateDatabaseOptions & {
  agentId: string;
};
/** Internal Doctor custody; never part of the plugin-facing database options. */
type OpenClawAgentDatabaseRepairAdmission = {
  /** Bind repair admission to the physical database inspected and backed up by its owner. */
  expectedIdentity?: DatabaseFileIdentity;
  /** Live caller authority for native open and schema/registry admission mutations. */
  assertCurrent?: () => void;
};
/** Shared-state registry row describing an agent database seen by this process. */
type OpenClawRegisteredAgentDatabase = {
  agentId: string;
  path: string;
  schemaVersion: number;
  lastSeenAt: number;
  sizeBytes: number | null;
};
type OpenClawAgentDatabaseRegistrationCommit = Readonly<{
  agentId: string;
  agentPath: string;
  stateDatabasePath: string;
  stateDatabaseIdentity: string;
}>;
type OpenClawAgentDatabaseRegistrationObserver = {
  starting?: () => void;
  committed?: (receipt: OpenClawAgentDatabaseRegistrationCommit) => void;
};
//#endregion
//#region src/state/openclaw-agent-db-validation-cache.d.ts
type OpenClawAgentDatabaseValidation = {
  agentId: string;
  identity: string;
  /** Shared with admitted workers so owner invalidation revokes borrowed proof. */
  valid: SharedArrayBuffer;
  /** First full canonical proof; subsequent changes remain visible through the pending table. */
  canonicalReady: SharedArrayBuffer;
};
//#endregion
//#region src/state/openclaw-quarantine-store.d.ts
type OpenClawAgentIntegrityVerification = {
  path: string;
  dev: string;
  ino: string;
  app_version: string;
  verified_at: number;
  clean_close: number;
};
//#endregion
//#region src/state/openclaw-agent-db-lease.d.ts
type OpenClawAgentIntegrityVerificationReceiver = (record: OpenClawAgentIntegrityVerification | undefined, canReuseRuntimeIntegrity: boolean, invalidated: boolean) => void;
type OpenClawAgentDatabaseWorkerLeaseReceipt = {
  leaseId: string;
  agentId: string;
  path: string;
  ownerPid: number;
  ownerStartTime: number | null;
  sharedStatePath: string;
  sharedStateIdentity: string;
};
/** Preparation grants no access; claim repeats admission on the captured shared owner. */
declare function prepareOpenClawAgentDatabaseWorkerLease(params: {
  agentId: string;
  path: string;
  env?: NodeJS.ProcessEnv;
}, sharedDatabase: OpenClawStateDatabase, leaseId: string): {
  receipt: OpenClawAgentDatabaseWorkerLeaseReceipt;
  validation?: OpenClawAgentDatabaseValidation;
  claim(onVerification?: OpenClawAgentIntegrityVerificationReceiver): string;
};
//#endregion
//#region src/state/openclaw-agent-db-admission.d.ts
/** Denial still invokes run under admission, with a throwing authority check, to permit cleanup. */
type OpenClawAgentDatabaseWriteAdmission = <T>(run: (assertCurrent: () => void, validation?: OpenClawAgentDatabaseValidation) => T | Promise<T>) => Promise<T>;
//#endregion
//#region src/state/openclaw-agent-db.d.ts
declare const { openOpenClawAgentDatabase, runOpenClawAgentWriteTransaction, withOpenClawAgentDatabaseAsync, withOpenClawAgentDatabaseAdmission }: {
  openOpenClawAgentDatabase: (options: OpenClawAgentDatabaseOptions, preparedLease?: ReturnType<typeof prepareOpenClawAgentDatabaseWorkerLease>, registrationObserver?: OpenClawAgentDatabaseRegistrationObserver) => OpenClawAgentDatabase;
  runOpenClawAgentWriteTransaction: <T>(operation: (database: OpenClawAgentDatabase) => T, options: OpenClawAgentDatabaseOptions, transactionOptions?: Pick<SqliteTransactionOptions, "busyTimeoutMs" | "operationLabel" | "slowTransactionHoldMs" | "diagnosticContext"> & {
    repairAdmission?: OpenClawAgentDatabaseRepairAdmission;
  }) => T;
  withOpenClawAgentDatabaseAsync: <T>(inputOptions: OpenClawAgentDatabaseOptions, operation: (database: OpenClawAgentDatabase) => T | Promise<T>, assertCurrent?: () => void, signal?: AbortSignal) => Promise<T>;
  withOpenClawAgentDatabaseAdmission: <T>(inputOptions: OpenClawAgentDatabaseOptions, withAdmission: OpenClawAgentDatabaseWriteAdmission, operation: (database: OpenClawAgentDatabase) => T | Promise<T>) => Promise<T>;
};
//#endregion
//#region src/config/sessions/store-maintenance.d.ts
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
type ResolvedSessionMaintenanceConfigInput = Omit<ResolvedSessionMaintenanceConfig, "archiveDashboardAfterMs" | "modelRunPruneAfterMs"> & Partial<Pick<ResolvedSessionMaintenanceConfig, "archiveDashboardAfterMs" | "modelRunPruneAfterMs">>;
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-cache.types.d.ts
type SessionSharingEntry = Pick<InternalSessionEntry, "sessionId" | "previousSessionId" | "updatedAt" | "createdAt" | "initializationPending" | "providerReview" | "mainRestartRecovery" | "modelSelectionLocked" | "pendingProjectGitUrl" | "pendingWorktree" | "lifecycleRevision" | "lifecycleRunId" | "activeWriterRunId" | "subagentRecovery" | "archivedAt" | "repositoryWorkspaceId" | "visibility" | "incognito" | "createdActor" | "owner" | "sandbox" | "spawnedBy" | "spawnDepth" | "parentSessionKey" | "sessionStartedAt">;
type SessionEntryPublicationSource = {
  identity: string | symbol;
  birthtime: string | undefined;
  incarnation: string;
  filename: string;
  revision?: number;
};
//#endregion
//#region src/config/sessions/session-accessor.types.d.ts
/**
 * Session access API for callers that need entries or transcripts without
 * depending on the persisted store layout. Callers provide stable session
 * identity, and this module resolves the current entry/transcript target while
 * preserving canonical-key, transcript-linking, and update-notification rules.
 *
 * This accessor is the permanent storage-neutral domain boundary for
 * session/transcript runtime access. Legacy JSON import remains doctor-only.
 */
type SessionAccessScope = {
  /** Agent owner used when the session key does not already encode one. */
  agentId?: string;
  /**
   * Set false only for internal read-only hot paths that will not retain or
   * mutate the returned entry.
   */
  clone?: boolean;
  /** Configured default owner for fixed-store SQLite target derivation. */
  defaultAgentId?: string;
  /** Environment override used when resolving agent-scoped store paths in tests/tools. */
  env?: NodeJS.ProcessEnv;
  /** Set false for metadata-only reads that do not need hydrated prompt refs. */
  hydrateSkillPromptRefs?: boolean;
  /** Use latest when the caller must bypass any in-process metadata snapshot. */
  readConsistency?: "latest";
  /** Canonical or alias session key for the entry being read or written. */
  sessionKey: string;
  /** Explicit store path for callers that already resolved the owning store. */
  storePath?: string;
};
type SessionTranscriptAccessScope = Omit<SessionAccessScope, "sessionKey"> & {
  /** Deprecated transcript locator from older file-backed call sites. */
  sessionFile?: string;
  /** Runtime session id used to resolve the transcript identity. */
  sessionId: string;
  /** Required when resolving through session metadata; optional for legacy locators. */
  sessionKey?: string;
  /** Channel thread suffix used when deriving topic transcript paths. */
  threadId?: string | number;
};
type SessionTranscriptWriteScope = Omit<SessionTranscriptAccessScope, "sessionId"> & {
  /** Optional for appenders that resolve it from the session entry. */
  sessionId?: string;
  /** Optional run-owned fence checked inside the transcript write transaction. */
  expectedWriterRunId?: string;
  /** Optional lifecycle fence paired with sessionId for run-owned writes. */
  expectedLifecycleRevision?: string;
  /** Exact owner facts, including absent fields, checked inside the write transaction. */
  expectedOwner?: Pick<InternalSessionEntry, "lifecycleRevision" | "activeWriterRunId">;
};
type SessionEntrySummary = {
  /** Persisted key for the entry. */
  sessionKey: string;
  /** Entry value cloned from the backing store unless the caller requested borrowed reads. */
  entry: InternalSessionEntry;
};
/** Raw transcript record for non-message events; message records use appendTranscriptMessage. */
type TranscriptEvent = unknown;
type TranscriptMessageAppendOptions<TMessage> = {
  /** Rebase a stale explicit parent when the current tail still descends from it. */
  appendIntent?: "active-branch";
  /** Runtime config used for message redaction and transcript header metadata. */
  config?: OpenClawConfig;
  /** Working directory recorded in a newly created transcript header. */
  cwd?: string;
  /** How duplicate message idempotency keys are detected before append. */
  idempotencyLookup?: "scan" | "scan-assistant" | "caller-checked";
  /** Reject the append when the transcript changed since the caller loaded it. */
  expectedMutationAt?: number | null;
  /** Provider/channel message payload to persist. */
  message: TMessage;
  /** Testable timestamp override for the generated transcript entry. */
  now?: number;
  /** Existing transcript event id owned by a caller with its own session tree. */
  eventId?: string;
  /** Existing parent id owned by a caller with its own session tree. */
  parentId?: string | null;
  /** Optional finalizer that runs after duplicate detection but before persistence. */
  prepareMessageAfterIdempotencyCheck?: (message: TMessage) => TMessage | undefined;
  /** Synchronous assertion after replay, custody, preparation, and redaction, before insertion. */
  beforeFreshMessageCommit?: () => void;
  /** Allow append without parent-link migration for large legacy linear transcripts. */
  useRawWhenLinear?: boolean;
};
type TranscriptMessageAppendResult<TMessage> = {
  /** False when idempotency lookup found an existing transcript message. */
  appended: boolean;
  /** Redacted message payload as persisted or replayed from the transcript. */
  message: TMessage;
  /** Existing or newly generated transcript message id. */
  messageId: string;
  /** Parent id actually used by the durable transcript append. */
  effectiveParentId?: string | null;
  /** Authoritative immutable identity issued by the append transaction. */
  anchor?: TranscriptEntryAnchor;
};
interface SessionTranscriptRuntimeTarget {
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
}
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
/** Runtime selection metadata for an agent row. */
type GatewayAgentRuntime = NonNullable<AgentSummary["agentRuntime"]>;
/** Thinking-level option exposed to UI clients. */
type GatewayThinkingLevelOption = NonNullable<AgentSummary["thinkingLevels"]>[number];
type GatewayContextWindowOption = NonNullable<ModelChoice["contextWindows"]>[number];
/** Assignable identity returned by the complete session-owner facet. */
type SessionOwnerFacetIdentity = SessionsAssignOwnerParams["owner"] & Pick<SessionCreatedActor$1, "label" | "avatarUrl" | "identity">;
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
  /** Discovery provenance for collision diagnostics, never read authority. */
  discoveryRoot?: {
    path: string;
    worktree: boolean;
  };
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
  /** Runtime-only model-discoverable catalog before prompt budgeting; never persisted. */
  discoverySkills?: Skill[];
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
type SessionChatType = ChatType;
type PersistedSessionRunStatus = SessionRunStatus;
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
  /** Epoch ms wake time; suppresses the active session in sidebar lists until then. */
  snoozedUntil?: number;
  /** Server-stamped epoch ms when the current snooze was set. */
  snoozedAt?: number;
  /** Timestamp (ms) when an operator client last marked the session read. */
  lastReadAt?: number;
  /** Agent-declared sidebar presence; projection drops it after expiresAt. */
  agentStatus?: SessionAgentStatus;
  /** Latest utility-model status judgment for idle session status surfaces. */
  observerDigest?: SessionObserverDigest;
  /** Versioned, reconstructible Activity recap; never authoritative task status. */
  activitySummary?: SessionActivitySummary$1;
  /** Timestamp (ms) when an operator explicitly marked the session unread; cleared on read. */
  markedUnreadAt?: number;
  /** Timestamp (ms) of the latest completed agent run; metadata patches do not update it. */
  lastActivityAt?: number;
  /** Parent session key that spawned this session (used for sandbox session-tool scoping). */
  spawnedBy?: string;
  /** Host-captured owner status of the spawning invocation; never inferred from child launch authority. */
  spawnedBySenderIsOwner?: boolean;
  /** Parent session id captured with the spawn authority receipt; navigation uses parentSessionId. */
  spawnedBySessionId?: string;
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
  /** Exact parent lifecycle captured for native spawn authority, including same-id resets. */
  parentSessionLifecycleRevision?: string;
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
type GroupKeyResolution = {
  key: string;
  channel?: string;
  id?: string;
  chatType?: SessionChatType;
};
//#endregion
//#region src/plugins/computer-use-contract.d.ts
declare const COMPUTER_USE_V2_ACTION_NAMES: readonly ["screenshot", "left_click", "right_click", "middle_click", "double_click", "triple_click", "mouse_move", "left_click_drag", "left_mouse_down", "left_mouse_up", "scroll", "type", "key", "hold_key", "wait", "list_apps", "list_windows", "get_accessibility_tree", "get_cursor_position", "get_window_state", "launch_app", "kill_app", "bring_to_front", "set_value", "zoom", "get_browser_state", "browser_prepare", "browser_navigate", "browser_click", "browser_type", "browser_dialog", "browser_set_input_files", "browser_download", "browser_pointer", "escalate_scope", "get_recording_state", "start_recording", "stop_recording", "replay_trajectory", "invoke_menu"];
type ComputerUseV2ActionName = (typeof COMPUTER_USE_V2_ACTION_NAMES)[number];
declare const ComputerUseCapabilityDescriptorSchema: Type.TObject<{
  contractVersion: Type.TLiteral<2>;
  provider: Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    generation: Type.TString;
  }>;
  actions: Type.TArray<Type.TEnum<["screenshot", "left_click", "right_click", "middle_click", "double_click", "triple_click", "mouse_move", "left_click_drag", "left_mouse_down", "left_mouse_up", "scroll", "type", "key", "hold_key", "wait", "list_apps", "list_windows", "get_accessibility_tree", "get_cursor_position", "get_window_state", "launch_app", "kill_app", "bring_to_front", "set_value", "zoom", "get_browser_state", "browser_prepare", "browser_navigate", "browser_click", "browser_type", "browser_dialog", "browser_set_input_files", "browser_download", "browser_pointer", "escalate_scope", "get_recording_state", "start_recording", "stop_recording", "replay_trajectory", "invoke_menu"]>>;
  targets: Type.TArray<Type.TEnum<["screen", "window", "element", "browser"]>>;
  deliveryModes: Type.TArray<Type.TEnum<["background", "foreground"]>>;
  observations: Type.TArray<Type.TEnum<["image", "accessibility", "browser"]>>;
  features: Type.TObject<{
    recording: Type.TBoolean;
    agentCursor: Type.TBoolean;
    multiDisplay: Type.TBoolean;
  }>;
}>;
type ComputerUseCapabilityDescriptor = Static<typeof ComputerUseCapabilityDescriptorSchema>;
//#endregion
//#region src/shared/node-host-stats.d.ts
type NodeHostStats = NodeHostStatsPayload & {
  updatedAtMs: number;
};
//#endregion
//#region src/shared/node-list-types.d.ts
type NodeWorkerBundleStatus = {
  status: "installed";
  version: string;
} | {
  status: "missing";
};
//#endregion
export { ReasoningStreamPayload as $, mediaKindFromMime as $i, SessionCatalogShareRoute as $n, SystemAgentApprovalRequest as $r, WizardStep as $t, SessionTranscriptWriteScope as A, SessionOwner as Aa, CommandTurnKind as Ai, SystemAgentWizardCancel as An, RequestFrame as Ar, ChannelProgressDraftCompositorSnapshot as At, SessionRowChange as B, SkillsLibraryReceipt as Ba, BashExecutionMessage as Bi, UsersLinkAuthProfileResult as Bn, OutboundPayloadPlan as Br, GatewayClientName as Bt, CronScheduledToolPolicy as C, SessionsListParams as Ca, ExecutionIdentityAdmissionToken as Ci, WorkerEnvironmentState as Cn, ModelsListParams as Cr, ReasoningLevel as Ct, SessionAcpMeta as D, SessionCreatedVia as Da, HistoryEntry as Di, CronRunLogEntry as Dn, SessionGitHubPublishParams as Dr, AgentRunDelegatedAuthority as Dt, ChatType as E, SessionCreatedActor as Ea, ProviderReviewAcknowledgment as Ei, CronJob as En, SessionGitHubPublicationResult as Er, VerboseLevel as Et, SessionSharingEntry as F, SkillLibraryFile as Fa, AgentMessage as Fi, UsersAuthConnectCatalogResult as Fn, SessionPlacementMachine as Fr, SourceReplyDeliveryMode as Ft, MsgContext as G, SandboxDockerSettings as Ga, ThinkingLevel as Gi, ChatAccountSelection as Gn, MessagePresentationAction as Gr, WorkerLiveEventParams as Gt, FinalizedRuntimeMsgContext as H, resolveChannelGroupRequireMention as Ha, PrepareNextTurnContext as Hi, UsersListModelAccountsResult as Hn, ReplyPayload as Hr, WorkerAdmissionHandshake as Ht, ResolvedSessionMaintenanceConfigInput as I, SkillLibrarySelection as Ia, AgentState as Ii, UsersAuthConnectStartResult as In, SessionPlacementMove as Ir, TranscriptSenderIdentity as It, SupplementalContextFacts as J, PluginHookChannelContext as Ji, ToolsGitHubAuthorizePollResult as Jn, ReplyPayloadDeliveryPin as Jr, WorkerTranscriptCommitErrorReason as Jt, OriginatingChannelType as K, ProviderRefusalReview as Ka, ToolExecutionMode as Ki, DecisionReceiptV1 as Kn, MessagePresentationButton as Kr, WorkerLiveEventResult as Kt, OpenClawAgentDatabase as L, SkillsLibraryActivateResult as La, AgentTool as Li, UsersAuthConnectStatusResult as Ln, SessionPlacementRunner as Lr, GATEWAY_CLIENT_IDS as Lt, TranscriptMessageAppendOptions as M, SessionRow as Ma, AgentEvent as Mi, TalkClientCreateResult as Mn, SessionMoveTarget as Mr, UserTurnTranscriptAdmissionReceipt as Mt, TranscriptMessageAppendResult as N, SessionParticipant as Na, AgentLoopConfig as Ni, TalkEvent as Nn, SessionPlacement as Nr, UserTurnTranscriptAnnotation as Nt, SessionEntrySummary as O, HookExternalContentSource as Oa, HistoryMediaEntry as Oi, CronUpdateParams as On, ConnectParams as Or, ProviderModelRef as Ot, SessionEntryPublicationSource as P, SessionPerson as Pa, AgentLoopTurnUpdate as Pi, PersonalGitHubStatus as Pn, SessionPlacementDiskSpace as Pr, UserTurnTranscriptRecorder as Pt, PartialReplyPayload as Q, MediaKind as Qi, SessionCatalogHost as Qn, SystemAgentApprovalApplicationStatus as Qr, WizardNextResult as Qt, OpenClawAgentDatabaseOptions as R, SkillsLibraryListResult as Ra, AgentToolResult as Ri, UsersGitHubAuthorizePollResult as Rn, SessionPlacementWorkerRuntimeInstall as Rr, GatewayClientCap as Rt, CronScheduledToolCallerOrigin as S, SessionsCompanionStateResult as Sa, AgentPlanStep as Si, WorkerDesktopLaunchResult as Sn, ModelChoice as Sr, ProjectedAgentRunIndex as St, CronToolsAllowExecTargetRequirement as T, SessionActivitySummary as Ta, FastMode as Ti, WorkerTunnelStatus as Tn, GitHubPublicationPublisher as Tr, ThinkingCatalogEntry as Tt, InboundSourceModality as U, ChannelId as Ua, QueueMode$1 as Ui, UsersSelectModelAccountResult as Un, LegacyInteractiveReply as Ur, WorkerConnectParams as Ut, FinalizedMsgContext as V, resolveChannelGroupPolicy as Va, CustomMessage as Vi, UsersListAuthLinksResult as Vn, ReplyMediaAttachment as Vr, WorkerAdmissionFailureReason as Vt, MentionSource as W, ChatChannelId as Wa, StreamFn as Wi, UsersUnlinkAuthProfileResult as Wn, MessagePresentation as Wr, WorkerLiveEventErrorDetails as Wt, BlockReplyContext as X, MediaFact as Xi, AgentParamsSchema as Xn, ApprovalResolved as Xr, WorkerTranscriptCommitResult as Xt, TemplateContext as Y, LegacyMediaContextKey as Yi, ToolsGitHubAuthorizeStartResult as Yn, ApprovalRequestInput as Yr, WorkerTranscriptCommitParams as Yt, GetReplyOptions as Z, PromptImageOrderEntry as Zi, AgentWaitParams as Zn, ChannelApprovalKind as Zr, WizardAnswer as Zt, SourceInfo as _, ChannelRouteRef as _a, ApprovalTerminalReason as _i, MentionsListResult as _n, WorkerInferenceEventParams as _r, PreparedAgentRunAdmission as _t, CliSessionBinding as a, ProviderRequestTransportOverrides as aa, ApprovalScope as ai, Snapshot as an, TranscriptUtterance as ar, CommandOwnerAssertion as at, GatewayThinkingLevelOption as b, SessionObserverDigest as ba, TranscriptTurnAdmission as bi, ScopeUpgradeResult as bn, WorkerInferenceTerminalFrame as br, PluginGatewayAccessAuthority as bt, SessionContextBudgetStatus as c, AuthProfileCredentialSource as ca, ExecApprovalRequestPayload as ci, QuestionRecord as cn, WorkerComputerResult as cr, WorkerEnvironments as ct, SessionPluginJsonValue as d, RuntimeAuthProfileStore as da, ExecMode as di, QuestionWaitAnswerResult as dn, WorkerGatewayToolInvokeParams as dr, OpenClawStateDatabaseOptions as dt, ImagesDescriptionInput as ea, SystemAgentApprovalRequestPayload as ei, PortalOpenResult as en, SessionsCatalogArchiveParams as er, TaskSuggestionDeliveryMode as et, SessionProfileInvolvement as f, MediaUnderstandingOutput as fa, ExecSecurity as fi, NodeHostStatsPayload as fn, WorkerGatewayToolUpdateFrame as fr, SubsystemLogger as ft, PathMetadata as g, DeliveryContext as ga, ApprovalPresentation as gi, QueueMode as gn, WorkerInferenceEventFrame as gr, OperationalRunInstanceRef as gt, Skill as h, InboundEventKind as ha, ApprovalDecision as hi, AgentActivityItem as hn, WorkerInferenceErrorReason as hr, AdmittedRunOperatorAuthority as ht, ComputerUseV2ActionName as i, ModelProviderRequestTransportOverrides as ia, PluginApprovalResolved as ii, PresenceEntry as in, TranscriptSessionSummary as ir, SessionWriterDeliveryAuthority as it, TranscriptEvent as j, SessionPermissionMode as ja, InputProvenance as ji, ChannelsStatusResult as jn, ResponseFrame as jr, UserTurnInput as jt, SessionTranscriptRuntimeTarget as k, SessionConversationLink as ka, CommandTurnContext as ki, SystemAgentChatQuestion as kn, ErrorShape as kr, ProgressContinuationCapability as kt, SessionEntry as l, AuthProfileStore as la, ExecApprovalResolved as li, QuestionResolveResult as ln, AgentToolSurfacePresentation as lr, OpenClawStateDatabaseReadAdmission as lt, SessionSystemPromptReport as m, GatewayUiCommandTarget as ma, CommandExplanationSummary as mi, NodeSkillDescriptor as mn, WorkerInferenceCancelResult as mr, AdmittedRunContext as mt, NodeHostStats as n, MediaUnderstandingProvider as na, PluginApprovalRequest as ni, TerminalUploadPathStyle as nn, SessionsCatalogReadParams as nr, ReplyDeliveryContext as nt, GroupKeyResolution as o, ApiKeyCredential as oa, ExecApprovalDecision as oi, Question as on, ComputerInvokeParams as or, UserProfileIdentity as ot, SessionToolOverrides as p, Result as pa, ExecTarget as pi, NodePluginToolDescriptor as pn, WorkerInferenceCancelParams as pr, LogLevel as pt, SessionTranscriptContext as q, ToolLoopWarning as qi, SkillsProposalRecordResult as qn, ReplyPayloadDelivery as qr, WorkerProtocolCloseReason as qt, ComputerUseCapabilityDescriptor as r, StructuredExtractionRequest as ra, PluginApprovalRequestPayload as ri, TerminalUploadResult as rn, SessionsCatalogReadResult as rr, ReplyMediaFailure as rt, InternalSessionEntry as s, AuthProfileCredential as sa, ExecApprovalRequest as si, QuestionAnswers as sn, WorkerComputerParams as sr, DB as st, NodeWorkerBundleStatus as t, MediaUnderstandingDecision as ta, SystemAgentApprovalResolved as ti, PortalSummary as tn, SessionsCatalogContinueParams as tr, TurnAdoptionLifecycle as tt, SessionOrigin as u, OAuthCredential as ua, ExecAsk as ui, QuestionResolvedEvent as un, WorkerGatewayToolCancelParams as ur, OpenClawStateDatabase as ut, GatewayAgentRuntime as v, SessionGoalOperationErrorCode as va, SessionApprovalReplay as vi, UsersMentionableParams as vn, WorkerInferenceStartParams as vr, admitted_run_context_d_exports as vt, CronToolsAllowExecTarget as w, SessionGoal as wa, AgentRunTimeoutPhase as wi, WorkerExecutionMode as wn, ModelsListResult as wr, ThinkLevel as wt, SessionOwnerFacetIdentity as x, SessionObserverHealth as xa, TranscriptTurnBoundary as xi, DesktopAvailability as xn, WorkerInferenceTerminalOutcome as xr, PluginGatewayAccessPolicy as xt, GatewayContextWindowOption as y, SessionCompanionExchange as ya, TranscriptEntryAnchor as yi, UsersMentionableResult as yn, WorkerInferenceStartResult as yr, GatewayAccessGrantRef as yt, OpenClawRegisteredAgentDatabase as z, SkillsLibraryReadResult as za, AgentToolUpdateCallback as zi, UsersGitHubAuthorizeStartResult as zn, SessionsReclaimParams as zr, GatewayClientMode as zt };