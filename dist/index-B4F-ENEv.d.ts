import "./config-BMeMhJQO.js";
import "./channels-DhQONOcd.js";
import "./exec-approvals-D599mwQY.js";
import "./skill-library-DVzEZ7Hi.js";
import "./users-7cqSxgr5.js";
import "./nodes-CeEfavZI.js";
import { Static, TObject, TSchema, TString, Type } from "typebox";
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
type SessionCreatedActor = Static<typeof SessionCreatedActorSchema>;
type SessionConversationLink = Static<typeof SessionConversationLinkSchema>;
type SessionPermissionMode = Static<typeof SessionPermissionModeSchema>;
type SessionOwner = Static<typeof SessionOwnerSchema>;
type SessionRunStatus = Static<typeof SessionRunStatusSchema>;
type SessionRow = Static<typeof SessionRowSchema>;
type SessionEntryArchiveReason = Static<typeof SessionEntryArchiveReasonSchema>;
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
//#region packages/gateway-protocol/src/gateway-error-details.d.ts
/** Gateway JSON-RPC style error codes shared by clients and server handlers. */
declare const ErrorCodes: {
  /** @deprecated Retained for source compatibility; no current server emitter. */
  readonly NOT_LINKED: "NOT_LINKED";
  /** Device exists but still needs an explicit pairing approval. */
  readonly NOT_PAIRED: "NOT_PAIRED";
  /** @deprecated Retained for source compatibility; no current server emitter. */
  readonly AGENT_TIMEOUT: "AGENT_TIMEOUT";
  /** Request payload failed protocol validation or method preconditions. */
  readonly INVALID_REQUEST: "INVALID_REQUEST";
  /** Authenticated caller lacks permission for the requested operation. */
  readonly FORBIDDEN: "FORBIDDEN";
  /** Approval resolution referenced a missing or expired approval request. */
  readonly APPROVAL_NOT_FOUND: "APPROVAL_NOT_FOUND";
  /** Gateway service or required backend is temporarily unavailable. */
  readonly UNAVAILABLE: "UNAVAILABLE";
};
/** Closed set of canonical gateway error code strings. */
type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
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
declare const HelloOkSchema: Type.TObject<{
  type: Type.TLiteral<"hello-ok">;
  protocol: Type.TInteger;
  server: Type.TObject<{
    version: Type.TString;
    buildId: Type.TOptional<Type.TString>;
    bootId: Type.TOptional<Type.TString>;
    controlUiBuildSource: Type.TOptional<Type.TUnion<[Type.TLiteral<"bundled">, Type.TLiteral<"configured">]>>;
    connId: Type.TString;
  }>;
  features: Type.TObject<{
    methods: Type.TArray<Type.TString>;
    events: Type.TArray<Type.TString>;
    capabilities: Type.TOptional<Type.TArray<Type.TString>>;
  }>;
  snapshot: Type.TObject<{
    suspension: Type.TOptional<Type.TObject<{
      phase: Type.TUnion<[Type.TLiteral<"accepting">, Type.TLiteral<"preparing">, Type.TLiteral<"draining">, Type.TLiteral<"prepared">]>;
    }>>;
    presence: Type.TArray<Type.TObject<{
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
      ts: Type.TInteger;
      onlineSince: Type.TOptional<Type.TInteger>;
      lastActivityAt: Type.TOptional<Type.TInteger>;
      connectionLastActivityAt: Type.TOptional<Type.TInteger>;
      deviceId: Type.TOptional<Type.TString>;
      roles: Type.TOptional<Type.TArray<Type.TString>>;
      scopes: Type.TOptional<Type.TArray<Type.TString>>;
      instanceId: Type.TOptional<Type.TString>;
      user: Type.TOptional<Type.TObject<{
        id: Type.TString;
        identity: Type.TOptional<Type.TObject<{
          type: Type.TLiteral<"profile">;
          id: Type.TString;
        }>>;
        email: Type.TOptional<Type.TString>;
        name: Type.TOptional<Type.TString>;
        avatarUrl: Type.TOptional<Type.TString>;
      }>>;
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
  controlUiUrl: Type.TOptional<Type.TString>;
  controlUiTabs: Type.TOptional<Type.TArray<Type.TObject<{
    pluginId: Type.TString;
    id: Type.TString;
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
    icon: Type.TOptional<Type.TString>;
    path: Type.TOptional<Type.TString>;
    placement: Type.TOptional<Type.TString>;
    slug: Type.TOptional<Type.TString>;
    requiresGatewayAuth: Type.TOptional<Type.TBoolean>;
    group: Type.TOptional<Type.TUnion<[Type.TLiteral<"control">, Type.TLiteral<"agent">]>>;
    order: Type.TOptional<Type.TNumber>;
  }>>>;
  controlUiWidgetKinds: Type.TOptional<Type.TArray<Type.TObject<{
    pluginId: Type.TString;
    kind: Type.TString;
    label: Type.TString;
  }>>>;
  controlUiLinkReaders: Type.TOptional<Type.TArray<Type.TObject<{
    pluginId: Type.TString;
    id: Type.TString;
    label: Type.TString;
    icon: Type.TOptional<Type.TString>;
    linkReader: Type.TObject<{
      hosts: Type.TArray<Type.TString>;
      pathPattern: Type.TString;
      detailMethod: Type.TString;
      previewMethod: Type.TOptional<Type.TString>;
      imageMethod: Type.TOptional<Type.TString>;
    }>;
  }>>>;
  pluginSurfaceUrls: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  auth: Type.TObject<{
    method: Type.TOptional<Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"token">, Type.TLiteral<"password">, Type.TLiteral<"tailscale">, Type.TLiteral<"device-token">, Type.TLiteral<"bootstrap-token">, Type.TLiteral<"trusted-proxy">]>>;
    deviceToken: Type.TOptional<Type.TString>;
    recoveryMigrationAllowed: Type.TOptional<Type.TLiteral<true>>;
    recoveryScope: Type.TOptional<Type.TString>;
    role: Type.TString;
    scopes: Type.TArray<Type.TString>;
    sessionCap: Type.TOptional<Type.TUnion<[Type.TLiteral<"write">, Type.TLiteral<"suggest">, Type.TLiteral<"view">, Type.TLiteral<"none">]>>;
    issuedAtMs: Type.TOptional<Type.TInteger>;
    deviceTokens: Type.TOptional<Type.TArray<Type.TObject<{
      deviceToken: Type.TString;
      role: Type.TString;
      scopes: Type.TArray<Type.TString>;
      issuedAtMs: Type.TInteger;
    }>>>;
  }>;
  policy: Type.TObject<{
    maxPayload: Type.TInteger;
    maxBufferedBytes: Type.TInteger;
    tickIntervalMs: Type.TInteger;
    attachments: Type.TOptional<Type.TObject<{
      maxBytes: Type.TInteger;
      maxImageBytes: Type.TInteger;
    }>>;
    allowedSessionVisibilities: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"shared">, Type.TLiteral<"read-only">, Type.TLiteral<"suggest">, Type.TLiteral<"draft">]>>>;
    hasMultipleSessionSharingIdentities: Type.TOptional<Type.TBoolean>;
  }>;
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
/** Server event frame envelope; `event` selects the payload validator. */
declare const EventFrameSchema: Type.TObject<{
  type: Type.TLiteral<"event">;
  event: Type.TString;
  payload: Type.TOptional<Type.TUnknown>;
  seq: Type.TOptional<Type.TInteger>;
  stateVersion: Type.TOptional<Type.TObject<{
    presence: Type.TInteger;
    health: Type.TInteger;
  }>>;
  recipientProfileId: Type.TOptional<Type.TString>;
}>;
type ConnectParams = Static<typeof ConnectParamsSchema>;
type HelloOk = Static<typeof HelloOkSchema>;
type ErrorShape = Static<typeof ErrorShapeSchema>;
type RequestFrame = Static<typeof RequestFrameSchema>;
type ResponseFrame = Static<typeof ResponseFrameSchema>;
type EventFrame = Static<typeof EventFrameSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/error-codes.d.ts
/** Builds the canonical gateway error payload while preserving optional retry metadata. */
declare function errorShape(code: ErrorCode, message: string, opts?: {
  details?: unknown;
  retryable?: boolean;
  retryAfterMs?: number;
}): ErrorShape;
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
//#region packages/gateway-protocol/src/schema/board.d.ts
declare const BoardGetParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
type BoardGetParams = Static<typeof BoardGetParamsSchema>;
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
declare const SessionCatalogLocatorSchema: Type.TObject<{
  catalogId: Type.TString;
  hostId: Type.TString;
  threadId: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  sourceHomeId: Type.TOptional<Type.TString>;
}>;
declare const SessionCatalogCapabilitiesSchema: Type.TObject<{
  continueSession: Type.TBoolean;
  archive: Type.TBoolean;
  createSession: Type.TOptional<Type.TObject<{
    model: Type.TString;
    startTerminal: Type.TOptional<Type.TBoolean>;
  }>>;
  openTerminal: Type.TOptional<Type.TBoolean>;
  startTerminal: Type.TOptional<Type.TBoolean>;
}>;
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
declare const SessionCatalogDescriptorSchema: Type.TObject<{
  id: Type.TString;
  label: Type.TString;
  capabilities: Type.TObject<{
    continueSession: Type.TBoolean;
    archive: Type.TBoolean;
    createSession: Type.TOptional<Type.TObject<{
      model: Type.TString;
      startTerminal: Type.TOptional<Type.TBoolean>;
    }>>;
    openTerminal: Type.TOptional<Type.TBoolean>;
    startTerminal: Type.TOptional<Type.TBoolean>;
  }>;
}>;
declare const SessionCatalogPullRequestSummarySchema: Type.TObject<{
  numbers: Type.TArray<Type.TInteger>;
  state: Type.TUnion<[Type.TLiteral<"open">, Type.TLiteral<"draft">, Type.TLiteral<"merged">, Type.TLiteral<"closed">]>;
}>;
declare const SessionCatalogSessionSchema: Type.TObject<{
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
declare const SessionCatalogSchema: Type.TObject<{
  id: Type.TString;
  label: Type.TString;
  capabilities: Type.TObject<{
    continueSession: Type.TBoolean;
    archive: Type.TBoolean;
    createSession: Type.TOptional<Type.TObject<{
      model: Type.TString;
      startTerminal: Type.TOptional<Type.TBoolean>;
    }>>;
    openTerminal: Type.TOptional<Type.TBoolean>;
    startTerminal: Type.TOptional<Type.TBoolean>;
  }>;
  shareRoute: Type.TOptional<Type.TObject<{
    kind: Type.TLiteral<"thread-id-prefix">;
    routeSegment: Type.TString;
    hostId: Type.TString;
    identifierAlphabet: Type.TLiteral<"lowercase-hex">;
    fullLength: Type.TLiteral<32>;
    minPrefixLength: Type.TLiteral<12>;
    lookup: Type.TLiteral<"catalog-list-search-by-thread-id-prefix">;
    ambiguity: Type.TLiteral<"multiple-results-or-next-cursor">;
  }>>;
  hosts: Type.TArray<Type.TObject<{
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
  }>>;
  error: Type.TOptional<Type.TObject<{
    code: Type.TString;
    message: Type.TString;
  }>>;
}>;
declare const SessionsCatalogListParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  progressId: Type.TOptional<Type.TString>;
  /** Opt into pending hosts completed by incremental publications for this progressId. */
  allowPartialResults: Type.TOptional<Type.TBoolean>;
  search: Type.TOptional<Type.TString>;
  limitPerHost: Type.TOptional<Type.TInteger>;
  hostIds: Type.TOptional<Type.TArray<Type.TString>>;
  catalogId: Type.TOptional<Type.TString>;
  /** Return catalog labels and capabilities with empty hosts, without listing sessions. */
  metadataOnly: Type.TOptional<Type.TBoolean>;
  cursors: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
}>;
declare const SessionsCatalogListResultSchema: Type.TObject<{
  catalogs: Type.TArray<Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    capabilities: Type.TObject<{
      continueSession: Type.TBoolean;
      archive: Type.TBoolean;
      createSession: Type.TOptional<Type.TObject<{
        model: Type.TString;
        startTerminal: Type.TOptional<Type.TBoolean>;
      }>>;
      openTerminal: Type.TOptional<Type.TBoolean>;
      startTerminal: Type.TOptional<Type.TBoolean>;
    }>;
    shareRoute: Type.TOptional<Type.TObject<{
      kind: Type.TLiteral<"thread-id-prefix">;
      routeSegment: Type.TString;
      hostId: Type.TString;
      identifierAlphabet: Type.TLiteral<"lowercase-hex">;
      fullLength: Type.TLiteral<32>;
      minPrefixLength: Type.TLiteral<12>;
      lookup: Type.TLiteral<"catalog-list-search-by-thread-id-prefix">;
      ambiguity: Type.TLiteral<"multiple-results-or-next-cursor">;
    }>>;
    hosts: Type.TArray<Type.TObject<{
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
    }>>;
    error: Type.TOptional<Type.TObject<{
      code: Type.TString;
      message: Type.TString;
    }>>;
  }>>;
}>;
declare const SessionCatalogTranscriptItemSchema: Type.TObject<{
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
declare const SessionsCatalogContinueResultSchema: Type.TObject<{
  sessionKey: Type.TString;
}>;
declare const SessionsCatalogArchiveParamsSchema: Type.TObject<{
  catalogId: Type.TString;
  hostId: Type.TString;
  threadId: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  sourceHomeId: Type.TOptional<Type.TString>;
  confirmNoOtherRunner: Type.TLiteral<true>;
}>;
declare const SessionsCatalogArchiveResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
}>;
declare const SessionsCatalogStartTerminalParamsSchema: Type.TObject<{
  catalogId: Type.TString;
  hostId: Type.TOptional<Type.TString>;
  agentId: Type.TString;
  cwd: Type.TString;
  initialMessage: Type.TOptional<Type.TString>;
}>;
declare const SessionsCatalogStartTerminalResultSchema: Type.TObject<{
  sessionId: Type.TString;
  agentId: Type.TString;
  shell: Type.TString;
  cwd: Type.TString;
  confined: Type.TBoolean;
  title: Type.TOptional<Type.TString>;
}>;
type SessionCatalogCapabilities = Static<typeof SessionCatalogCapabilitiesSchema>;
type SessionCatalogShareRoute = Static<typeof SessionCatalogShareRouteSchema>;
type SessionCatalogLocator = Static<typeof SessionCatalogLocatorSchema>;
type SessionCatalogDescriptor = Static<typeof SessionCatalogDescriptorSchema>;
type SessionCatalogPullRequestSummary = Static<typeof SessionCatalogPullRequestSummarySchema>;
type SessionCatalogSession = Static<typeof SessionCatalogSessionSchema>;
type SessionCatalogHost = Static<typeof SessionCatalogHostSchema>;
type SessionCatalog = Static<typeof SessionCatalogSchema>;
type SessionsCatalogListParams = Static<typeof SessionsCatalogListParamsSchema>;
type SessionsCatalogListResult = Static<typeof SessionsCatalogListResultSchema>;
type SessionCatalogTranscriptItem = Static<typeof SessionCatalogTranscriptItemSchema>;
type SessionsCatalogReadParams = Static<typeof SessionsCatalogReadParamsSchema>;
type SessionsCatalogReadResult = Static<typeof SessionsCatalogReadResultSchema>;
type SessionsCatalogContinueParams = Static<typeof SessionsCatalogContinueParamsSchema>;
type SessionsCatalogContinueResult = Static<typeof SessionsCatalogContinueResultSchema>;
type SessionsCatalogArchiveParams = Static<typeof SessionsCatalogArchiveParamsSchema>;
type SessionsCatalogArchiveResult = Static<typeof SessionsCatalogArchiveResultSchema>;
type SessionsCatalogStartTerminalParams = Static<typeof SessionsCatalogStartTerminalParamsSchema>;
type SessionsCatalogStartTerminalResult = Static<typeof SessionsCatalogStartTerminalResultSchema>;
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
declare const DevicePairRequestedEventSchema: Type.TObject<{
  requestId: Type.TString;
  deviceId: Type.TString;
  publicKey: Type.TString;
  displayName: Type.TOptional<Type.TString>;
  platform: Type.TOptional<Type.TString>;
  deviceFamily: Type.TOptional<Type.TString>;
  clientId: Type.TOptional<Type.TString>;
  clientMode: Type.TOptional<Type.TString>;
  browserOrigin: Type.TOptional<Type.TString>;
  role: Type.TOptional<Type.TString>;
  roles: Type.TOptional<Type.TArray<Type.TString>>;
  scopes: Type.TOptional<Type.TArray<Type.TString>>;
  remoteIp: Type.TOptional<Type.TString>;
  silent: Type.TOptional<Type.TBoolean>;
  isRepair: Type.TOptional<Type.TBoolean>;
  ts: Type.TInteger;
}>;
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
//#region packages/gateway-protocol/src/schema/questions.d.ts
declare const QuestionResourceInputSchema: Type.TObject<{
  viewId: Type.TOptional<Type.TString>;
  selection: Type.TUnion<[Type.TLiteral<"explicit">, Type.TLiteral<"implicit">]>;
  userOptions: Type.TOptional<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
    accept: Type.TOptional<Type.TArray<Type.TString>>;
  }>>;
}>;
declare const QuestionOptionSchema: Type.TObject<{
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
}>;
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
type QuestionResourceInput = Static<typeof QuestionResourceInputSchema>;
type QuestionOption = Static<typeof QuestionOptionSchema>;
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
export { SessionCatalogPullRequestSummary as $, SessionsReclaimParams as $t, HumanMention as A, WorkerInferenceTerminalFrame as At, SystemAgentWizardCancel as B, ErrorShape as Bt, QuestionRecord as C, WorkerInferenceCancelParams as Ct, QuestionWaitAnswerResult as D, WorkerInferenceEventParams as Dt, QuestionResourceInput as E, WorkerInferenceEventFrame as Et, ScopeUpgradeResult as F, GitHubPublicationPublisher as Ft, ToolsGitHubAuthorizeStartResult as G, ErrorCodes as Gt, AgentSummary as H, HelloOk as Ht, CronJob as I, SessionGitHubPublicationResult as It, SessionCatalog as J, SessionPlacementDiskSpace as Jt, AgentParamsSchema as K, SessionMoveTarget as Kt, CronRunLogEntry as L, SessionGitHubPublishParams as Lt, UsersMentionableParams as M, ModelChoice as Mt, UsersMentionableResult as N, ModelsListParams as Nt, AgentActivityItem as O, WorkerInferenceStartParams as Ot, DevicePairRequestedEventSchema as P, ModelsListResult as Pt, SessionCatalogLocator as Q, SessionPlacementWorkerRuntimeInstall as Qt, CronUpdateParams as R, errorShape as Rt, QuestionOption as S, WorkerGatewayToolUpdateFrame as St, QuestionResolvedEvent as T, WorkerInferenceErrorReason as Tt, SkillsProposalRecordResult as U, RequestFrame as Ut, DecisionReceiptV1 as V, EventFrame as Vt, ToolsGitHubAuthorizePollResult as W, ResponseFrame as Wt, SessionCatalogDescriptor as X, SessionPlacementMove as Xt, SessionCatalogCapabilities as Y, SessionPlacementMachine as Yt, SessionCatalogHost as Z, SessionPlacementRunner as Zt, TerminalUploadResult as _, SessionParticipantIdentity as _n, WorkerComputerParams as _t, WorkerLiveEventParams as a, SessionsListParams as an, SessionsCatalogContinueParams as at, Question as b, WorkerGatewayToolCancelParams as bt, WorkerTranscriptCommitErrorReason as c, SessionActivitySummary as cn, SessionsCatalogListResult as ct, WizardAnswer as d, SessionEntryArchiveReason as dn, SessionsCatalogStartTerminalParams as dt, SessionCompanionExchange as en, SessionCatalogSession as et, WizardNextResult as f, SessionOwner as fn, SessionsCatalogStartTerminalResult as ft, TerminalUploadPathStyle as g, SessionParticipant as gn, ComputerInvokeParams as gt, PortalSummary as h, SessionRunStatus as hn, BoardGetParams as ht, WorkerLiveEventErrorDetails as i, SessionsCompanionStateResult as in, SessionsCatalogArchiveResult as it, MentionsListResult as j, WorkerInferenceTerminalOutcome as jt, QueueMode as k, WorkerInferenceStartResult as kt, WorkerTranscriptCommitParams as l, SessionConversationLink as ln, SessionsCatalogReadParams as lt, PortalOpenResult as m, SessionRow as mn, TranscriptUtterance as mt, WorkerAdmissionHandshake as n, SessionObserverHealth as nn, SessionCatalogTranscriptItem as nt, WorkerLiveEventResult as o, SessionGoal as on, SessionsCatalogContinueResult as ot, WizardStep as p, SessionPermissionMode as pn, TranscriptSessionSummary as pt, AgentWaitParams as q, SessionPlacement as qt, WorkerConnectParams as r, SessionsAssignOwnerParams as rn, SessionsCatalogArchiveParams as rt, WorkerProtocolCloseReason as s, SessionsGoalMutationResult as sn, SessionsCatalogListParams as st, WorkerAdmissionFailureReason as t, SessionObserverDigest as tn, SessionCatalogShareRoute as tt, WorkerTranscriptCommitResult as u, SessionCreatedActor as un, SessionsCatalogReadResult as ut, PresenceEntry as v, SessionPerson as vn, WorkerComputerResult as vt, QuestionResolveResult as w, WorkerInferenceCancelResult as wt, QuestionAnswers as x, WorkerGatewayToolInvokeParams as xt, Snapshot as y, AgentToolSurfacePresentation as yt, SystemAgentChatQuestion as z, ConnectParams as zt };