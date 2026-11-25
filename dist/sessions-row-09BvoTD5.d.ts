import { Static, Type } from "typebox";
declare const CyberAccessProgramSchema: Type.TUnion<[Type.TLiteral<"standard">, Type.TLiteral<"daybreak_blue">, Type.TLiteral<"daybreak_red">]>;
type CyberAccessProgram = Static<typeof CyberAccessProgramSchema>;
declare const SessionPermissionModeSchema: Type.TUnion<[Type.TLiteral<"read-only">, Type.TLiteral<"guarded">, Type.TLiteral<"workspace">, Type.TLiteral<"full">]>;
declare const SessionRunStatusSchema: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"failed">, Type.TLiteral<"interrupted">, Type.TLiteral<"killed">, Type.TLiteral<"timeout">]>;
declare const SessionEntryArchiveReasonSchema: Type.TUnion<[Type.TLiteral<"manual">, Type.TLiteral<"active-session-cap">, Type.TLiteral<"age-retention">, Type.TLiteral<"stale-dashboard">, Type.TLiteral<"restart-recovery">]>;
declare const SessionToolOverridesSchema: Type.TObject<{
  mcpServers: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
  mcpToolsDeny: Type.TOptional<Type.TRecord<"^.*$", Type.TArray<Type.TString>>>;
  skills: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
  webSearch: Type.TOptional<Type.TBoolean>;
}>;
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
/** Stable Gateway session row fields; mutation envelopes may add null tombstones. */
declare const SessionRowSchema: Type.TObject<{
  key: Type.TString;
  /** Fields outside the requested projection must not clear a client's full-row cache. */
  rowMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"compact">, Type.TLiteral<"dashboard">, Type.TLiteral<"sidebar">]>>;
  /** Response-local indexes into the list's sharedFacts; expand before merging rows. */
  sharedFacts: Type.TOptional<Type.TArray<Type.TInteger>>;
  sessionId: Type.TOptional<Type.TString>;
  /** Incarnation revision for invalidating session-scoped client caches after resets. */
  lifecycleRevision: Type.TOptional<Type.TString>;
  /** Opaque saved model-selection inputs, unaffected by activity or display updates. */
  sessionModelRevision: Type.TOptional<Type.TString>;
  incognito: Type.TOptional<Type.TLiteral<true>>;
  kind: Type.TUnion<[Type.TLiteral<"direct">, Type.TLiteral<"group">, Type.TLiteral<"global">, Type.TLiteral<"unknown">]>;
  label: Type.TOptional<Type.TString>;
  autoLabel: Type.TOptional<Type.TString>;
  icon: Type.TOptional<Type.TString>;
  /** Named sidebar tint from SESSION_COLOR_IDS; clients map names to theme hues. */
  color: Type.TOptional<Type.TString>;
  channelAvatarUrl: Type.TOptional<Type.TString>;
  boardFace: Type.TOptional<Type.TUnion<[Type.TLiteral<"chat">, Type.TLiteral<"dashboard">]>>;
  /** Prepared dashboard membership fact shared by list and change-event rows. */
  hasBoard: Type.TOptional<Type.TBoolean>;
  /** Shared dashboard default; absent means split. */
  boardPresentation: Type.TOptional<Type.TUnion<[Type.TLiteral<"split">, Type.TLiteral<"expanded">]>>;
  displayName: Type.TOptional<Type.TString>;
  /** A title request is currently in flight; runtime-only, never persisted. */
  titlePending: Type.TOptional<Type.TBoolean>;
  derivedTitle: Type.TOptional<Type.TString>;
  lastMessagePreview: Type.TOptional<Type.TString>;
  /** Latest visible assistant text in the bounded transcript preview, with its message time. */
  lastAssistantMessage: Type.TOptional<Type.TObject<{
    text: Type.TString;
    timestamp: Type.TNumber;
  }>>;
  channel: Type.TOptional<Type.TString>;
  /** Stable non-sensitive facts derived from the canonical session route. */
  classification: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  accountId: Type.TOptional<Type.TString>;
  peerKind: Type.TOptional<Type.TString>;
  isMain: Type.TOptional<Type.TBoolean>;
  isBackground: Type.TOptional<Type.TBoolean>;
  /** Conversation owned by a plugin dock rather than ordinary session discovery. */
  isDock: Type.TOptional<Type.TBoolean>;
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
  sidebarRoot: Type.TOptional<Type.TBoolean>;
  pinnedAt: Type.TOptional<Type.TNumber>;
  snoozedUntil: Type.TOptional<Type.TNumber>;
  snoozedAt: Type.TOptional<Type.TNumber>;
  unread: Type.TOptional<Type.TBoolean>;
  lastReadAt: Type.TOptional<Type.TNumber>;
  markedUnreadAt: Type.TOptional<Type.TNumber>;
  lastActivityAt: Type.TOptional<Type.TNumber>;
  lastInteractionAt: Type.TOptional<Type.TNumber>;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"failed">, Type.TLiteral<"interrupted">, Type.TLiteral<"killed">, Type.TLiteral<"timeout">]>>;
  /** Running background exec processes; absent when none remain. */
  backgroundProcessCount: Type.TOptional<Type.TInteger>;
  lastRunError: Type.TOptional<Type.TString>;
  suppressErrorNotice: Type.TOptional<Type.TBoolean>;
  providerReview: Type.TOptional<Type.TObject<{
    id: Type.TString;
    runId: Type.TString;
    explanation: Type.TOptional<Type.TString>;
    continuationMessage: Type.TOptional<Type.TString>;
    canContinue: Type.TBoolean;
  }>>;
  /** Exact run that produced the latest terminal lifecycle projection. */
  lastRunId: Type.TOptional<Type.TString>;
  activeLeafEntryId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  spawnedBy: Type.TOptional<Type.TString>;
  parentSessionKey: Type.TOptional<Type.TString>;
  parentSessionId: Type.TOptional<Type.TString>;
  controlOwnerSessionKey: Type.TOptional<Type.TString>;
  /** Retained owners used by spawnedBy filtering at snapshotAt; empty retires child membership. */
  childOwnerSessionKeys: Type.TOptional<Type.TArray<Type.TString>>;
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
  deviceFolder: Type.TOptional<Type.TObject<{
    deviceId: Type.TString;
    path: Type.TString;
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
  cyberAccessProgram: Type.TOptional<Type.TUnion<[Type.TLiteral<"standard">, Type.TLiteral<"daybreak_blue">, Type.TLiteral<"daybreak_red">]>>;
  permissionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"read-only">, Type.TLiteral<"guarded">, Type.TLiteral<"workspace">, Type.TLiteral<"full">]>>;
  communication: Type.TOptional<Type.TObject<{
    send: Type.TOptional<Type.TUnion<[Type.TLiteral<"always">, Type.TLiteral<"ask">, Type.TLiteral<"never">]>>;
    receive: Type.TOptional<Type.TUnion<[Type.TLiteral<"always">, Type.TLiteral<"ask">, Type.TLiteral<"never">]>>;
  }>>;
  effectiveCommunication: Type.TOptional<Type.TObject<{
    send: Type.TUnion<[Type.TLiteral<"always">, Type.TLiteral<"ask">, Type.TLiteral<"never">]>;
    receive: Type.TUnion<[Type.TLiteral<"always">, Type.TLiteral<"ask">, Type.TLiteral<"never">]>;
  }>>;
  /** Authorized per-chat containment opt-out; omission follows configured sandbox policy. */
  sandboxMode: Type.TOptional<Type.TLiteral<"off">>;
  /** Administrator consent to the exact external runtime's own permissions for this incarnation. */
  nativeRuntimeConsent: Type.TOptional<Type.TString>;
  permissionModePending: Type.TOptional<Type.TBoolean>;
  sessionRoot: Type.TOptional<Type.TString>;
  createdVia: Type.TOptional<Type.TUnion<[Type.TLiteral<"operator">, Type.TLiteral<"spawn">, Type.TLiteral<"channel">, Type.TLiteral<"cron">, Type.TLiteral<"talk">, Type.TLiteral<"run">, Type.TLiteral<"plugin">, Type.TLiteral<"internal">]>>;
  /** Immutable presentation surface; independent of creation provenance. */
  createdSurface: Type.TOptional<Type.TLiteral<"plugin-dock">>;
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
  /** Recipient-local workspace admission; null clears a previous read restriction. */
  workspaceReadDisabledReason: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  createdAt: Type.TOptional<Type.TNumber>;
  forkSource: Type.TOptional<Type.TObject<{
    sessionKey: Type.TString;
    sessionId: Type.TString;
    entryId: Type.TOptional<Type.TString>;
  }>>;
  previousSessionId: Type.TOptional<Type.TString>;
  inputTokens: Type.TOptional<Type.TNumber>;
  outputTokens: Type.TOptional<Type.TNumber>;
  usageReport: Type.TOptional<Type.TObject<{
    state: Type.TUnion<[Type.TLiteral<"available">, Type.TLiteral<"unavailable">]>;
  }>>;
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
type SessionCreatedActor = Static<typeof SessionCreatedActorSchema>;
type SessionPermissionMode = Static<typeof SessionPermissionModeSchema>;
type SessionRunStatus = Static<typeof SessionRunStatusSchema>;
type SessionToolOverrides = Static<typeof SessionToolOverridesSchema>;
type SessionRow = Static<typeof SessionRowSchema>;
type SessionEntryArchiveReason = Static<typeof SessionEntryArchiveReasonSchema>;
export { SessionRow as a, SessionPermissionMode as i, SessionCreatedActor as n, SessionRunStatus as o, SessionEntryArchiveReason as r, SessionToolOverrides as s, CyberAccessProgram as t };