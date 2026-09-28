import "./approvals-B-zk4kd_.js";
import "./skill-library-DVzEZ7Hi.js";
import "./environments-BX9CHZ7Z.js";
import "./nodes-Bibk7CGC.js";
import { Static, TSchema, Type } from "typebox";
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
//#region packages/gateway-protocol/src/schema/session-placement.d.ts
declare const SessionPlacementDiskSpaceSchema: Type.TObject<{
  status: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
  availableBytes: Type.TInteger;
  totalBytes: Type.TInteger;
  observedAtMs: Type.TInteger;
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
type SessionPlacementDiskSpace = Static<typeof SessionPlacementDiskSpaceSchema>;
type SessionPlacementRunner = Static<typeof SessionPlacementRunnerSchema>;
type SessionPlacementMachine = Static<typeof SessionPlacementMachineSchema>;
type SessionsReclaimParams = Static<typeof SessionsReclaimParamsSchema>;
type SessionMoveTarget = Static<typeof SessionMoveTargetSchema>;
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
/** Successful gateway hello response with the server protocol and initial state. */
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
        kind: Type.TUnion<[Type.TLiteral<"package">, Type.TLiteral<"git">, Type.TLiteral<"unknown">]>;
        git: Type.TOptional<Type.TUnion<[Type.TObject<{
          currentSha: Type.TOptional<Type.TString>;
          commitAtMs: Type.TOptional<Type.TInteger>;
          installedAtMs: Type.TOptional<Type.TInteger>;
          status: Type.TLiteral<"current">;
        }>, Type.TObject<{
          currentSha: Type.TOptional<Type.TString>;
          commitAtMs: Type.TOptional<Type.TInteger>;
          installedAtMs: Type.TOptional<Type.TInteger>;
          status: Type.TLiteral<"behind">;
          commitsBehind: Type.TInteger;
        }>, Type.TObject<{
          currentSha: Type.TOptional<Type.TString>;
          commitAtMs: Type.TOptional<Type.TInteger>;
          installedAtMs: Type.TOptional<Type.TInteger>;
          status: Type.TLiteral<"ahead">;
          commitsAhead: Type.TInteger;
        }>, Type.TObject<{
          currentSha: Type.TOptional<Type.TString>;
          commitAtMs: Type.TOptional<Type.TInteger>;
          installedAtMs: Type.TOptional<Type.TInteger>;
          status: Type.TLiteral<"diverged">;
          commitsAhead: Type.TInteger;
          commitsBehind: Type.TInteger;
        }>, Type.TObject<{
          currentSha: Type.TOptional<Type.TString>;
          commitAtMs: Type.TOptional<Type.TInteger>;
          installedAtMs: Type.TOptional<Type.TInteger>;
          status: Type.TLiteral<"unavailable">;
          reason: Type.TUnion<[Type.TLiteral<"fetch-failed">, Type.TLiteral<"no-upstream">, Type.TLiteral<"no-upstream-sha">, Type.TLiteral<"comparison-failed">, Type.TLiteral<"git-unavailable">]>;
        }>]>>;
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
  effectiveFastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">]>>;
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
    effectiveFastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">]>>;
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
type ModelChoice = Static<typeof ModelChoiceSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-inference.d.ts
declare const WorkerInferenceStartParamsSchema: Type.TObject<{
  readonly runEpoch: Type.TInteger;
  readonly sessionId: Type.TString;
  readonly runId: Type.TString;
  readonly turnId: Type.TString;
  readonly modelRef: Type.TObject<{
    readonly provider: Type.TString;
    readonly model: Type.TString;
  }>;
  readonly context: Type.TObject<{
    readonly systemPrompt: Type.TOptional<Type.TString>;
    readonly messages: Type.TArray<Type.TUnion<[Type.TObject<{
      readonly role: Type.TLiteral<"user">;
      readonly content: Type.TUnion<[Type.TString, Type.TArray<Type.TUnion<[Type.TObject<{
        readonly type: Type.TLiteral<"text">;
        readonly text: Type.TString;
        readonly textSignature: Type.TOptional<Type.TString>;
      }>, Type.TObject<{
        readonly type: Type.TLiteral<"image">;
        readonly data: Type.TString;
        readonly mimeType: Type.TString;
      }>]>>]>;
      readonly timestamp: Type.TInteger;
      readonly runtimeContextCarrier: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      readonly role: Type.TLiteral<"assistant">;
      readonly content: Type.TArray<Type.TUnion<[Type.TObject<{
        readonly type: Type.TLiteral<"text">;
        readonly text: Type.TString;
        readonly textSignature: Type.TOptional<Type.TString>;
      }>, Type.TObject<{
        readonly type: Type.TLiteral<"thinking">;
        readonly thinking: Type.TString;
        readonly thinkingSignature: Type.TOptional<Type.TString>;
        readonly redacted: Type.TOptional<Type.TBoolean>;
      }>, Type.TObject<{
        readonly type: Type.TLiteral<"toolCall">;
        readonly id: Type.TString;
        readonly name: Type.TString;
        readonly arguments: Type.TRecord<"^.*$", Type.TUnknown>;
        readonly thoughtSignature: Type.TOptional<Type.TString>;
        readonly executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
      }>]>>;
      readonly api: Type.TString;
      readonly provider: Type.TString;
      readonly model: Type.TString;
      readonly responseModel: Type.TOptional<Type.TString>;
      readonly responseId: Type.TOptional<Type.TString>;
      readonly providerReplay: Type.TOptional<Type.TObject<{
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
      readonly usage: Type.TObject<{
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
      readonly timestamp: Type.TInteger;
      readonly diagnostics: Type.TOptional<Type.TArray<Type.TObject<{
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
      readonly stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">, Type.TLiteral<"error">, Type.TLiteral<"aborted">]>;
      readonly errorMessage: Type.TOptional<Type.TString>;
      readonly errorCode: Type.TOptional<Type.TString>;
      readonly errorType: Type.TOptional<Type.TString>;
      readonly errorBody: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      readonly role: Type.TLiteral<"toolResult">;
      readonly toolCallId: Type.TString;
      readonly toolName: Type.TString;
      readonly content: Type.TArray<Type.TUnion<[Type.TObject<{
        readonly type: Type.TLiteral<"text">;
        readonly text: Type.TString;
        readonly textSignature: Type.TOptional<Type.TString>;
      }>, Type.TObject<{
        readonly type: Type.TLiteral<"image">;
        readonly data: Type.TString;
        readonly mimeType: Type.TString;
      }>]>>;
      readonly details: Type.TOptional<Type.TUnknown>;
      readonly isError: Type.TBoolean;
      readonly timestamp: Type.TInteger;
    }>]>>;
    readonly tools: Type.TOptional<Type.TArray<Type.TObject<{
      readonly name: Type.TString;
      readonly description: Type.TString;
      readonly parameters: Type.TUnknown;
    }>>>;
  }>;
  readonly options: Type.TObject<{
    readonly temperature: Type.TOptional<Type.TNumber>;
    readonly maxTokens: Type.TOptional<Type.TInteger>;
    readonly reasoning: Type.TOptional<Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"minimal">, Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">, Type.TLiteral<"xhigh">, Type.TLiteral<"adaptive">, Type.TLiteral<"max">]>>;
    readonly thinkingBudgets: Type.TOptional<Type.TObject<{
      readonly minimal: Type.TOptional<Type.TInteger>;
      readonly low: Type.TOptional<Type.TInteger>;
      readonly medium: Type.TOptional<Type.TInteger>;
      readonly high: Type.TOptional<Type.TInteger>;
      readonly max: Type.TOptional<Type.TInteger>;
    }>>;
  }>;
}>;
declare const WorkerInferenceStartResultSchema: Type.TObject<{
  readonly status: Type.TUnion<[Type.TLiteral<"accepted">, Type.TLiteral<"replayed">]>;
}>;
declare const WorkerInferenceErrorReasonSchema: Type.TUnion<[Type.TLiteral<"model-not-approved">, Type.TLiteral<"invalid-context">, Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"session-not-attached">, Type.TLiteral<"provider-error">, Type.TLiteral<"cancelled">]>;
declare const WorkerInferenceCancelParamsSchema: Type.TObject<{
  readonly runEpoch: Type.TInteger;
  readonly sessionId: Type.TString;
  readonly runId: Type.TString;
  readonly turnId: Type.TString;
}>;
declare const WorkerInferenceCancelResultSchema: Type.TObject<{
  readonly status: Type.TLiteral<"cancelled">;
}>;
declare const WorkerInferenceEventParamsSchema: Type.TObject<{
  readonly runEpoch: Type.TInteger;
  readonly sessionId: Type.TString;
  readonly runId: Type.TString;
  readonly turnId: Type.TString;
  readonly seq: Type.TInteger;
  readonly event: Type.TUnion<[Type.TObject<{
    readonly type: Type.TLiteral<"start">;
    readonly resolvedModel: Type.TObject<{
      readonly api: Type.TString;
      readonly provider: Type.TString;
      readonly model: Type.TString;
    }>;
    readonly timestamp: Type.TInteger;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"text_start">;
    readonly contentIndex: Type.TInteger;
    readonly contentSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"text_delta">;
    readonly contentIndex: Type.TInteger;
    readonly delta: Type.TString;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"text_end">;
    readonly contentIndex: Type.TInteger;
    readonly contentSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"thinking_start">;
    readonly contentIndex: Type.TInteger;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"thinking_delta">;
    readonly contentIndex: Type.TInteger;
    readonly delta: Type.TString;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"thinking_end">;
    readonly contentIndex: Type.TInteger;
    readonly contentSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"toolcall_start">;
    readonly contentIndex: Type.TInteger;
    readonly id: Type.TString;
    readonly toolName: Type.TString;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"toolcall_delta">;
    readonly contentIndex: Type.TInteger;
    readonly delta: Type.TString;
  }>, Type.TObject<{
    readonly type: Type.TLiteral<"toolcall_end">;
    readonly contentIndex: Type.TInteger;
  }>]>;
}>;
declare const WorkerInferenceEventFrameSchema: Type.TObject<{
  readonly type: Type.TLiteral<"event">;
  readonly event: Type.TLiteral<"worker.inference.event">;
  readonly payload: Type.TObject<{
    readonly runEpoch: Type.TInteger;
    readonly sessionId: Type.TString;
    readonly runId: Type.TString;
    readonly turnId: Type.TString;
    readonly seq: Type.TInteger;
    readonly event: Type.TUnion<[Type.TObject<{
      readonly type: Type.TLiteral<"start">;
      readonly resolvedModel: Type.TObject<{
        readonly api: Type.TString;
        readonly provider: Type.TString;
        readonly model: Type.TString;
      }>;
      readonly timestamp: Type.TInteger;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"text_start">;
      readonly contentIndex: Type.TInteger;
      readonly contentSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"text_delta">;
      readonly contentIndex: Type.TInteger;
      readonly delta: Type.TString;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"text_end">;
      readonly contentIndex: Type.TInteger;
      readonly contentSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"thinking_start">;
      readonly contentIndex: Type.TInteger;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"thinking_delta">;
      readonly contentIndex: Type.TInteger;
      readonly delta: Type.TString;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"thinking_end">;
      readonly contentIndex: Type.TInteger;
      readonly contentSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"toolcall_start">;
      readonly contentIndex: Type.TInteger;
      readonly id: Type.TString;
      readonly toolName: Type.TString;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"toolcall_delta">;
      readonly contentIndex: Type.TInteger;
      readonly delta: Type.TString;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"toolcall_end">;
      readonly contentIndex: Type.TInteger;
    }>]>;
  }>;
}>;
declare const WorkerInferenceTerminalOutcomeSchema: Type.TUnion<[Type.TObject<{
  readonly type: Type.TLiteral<"done">;
  readonly message: Type.TObject<{
    readonly role: Type.TLiteral<"assistant">;
    readonly content: Type.TArray<Type.TUnion<[Type.TObject<{
      readonly type: Type.TLiteral<"text">;
      readonly text: Type.TString;
      readonly textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"thinking">;
      readonly thinking: Type.TString;
      readonly thinkingSignature: Type.TOptional<Type.TString>;
      readonly redacted: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"toolCall">;
      readonly id: Type.TString;
      readonly name: Type.TString;
      readonly arguments: Type.TRecord<"^.*$", Type.TUnknown>;
      readonly thoughtSignature: Type.TOptional<Type.TString>;
      readonly executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
    }>]>>;
    readonly api: Type.TString;
    readonly provider: Type.TString;
    readonly model: Type.TString;
    readonly responseModel: Type.TOptional<Type.TString>;
    readonly responseId: Type.TOptional<Type.TString>;
    readonly providerReplay: Type.TOptional<Type.TObject<{
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
    readonly usage: Type.TObject<{
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
    readonly timestamp: Type.TInteger;
    readonly stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">]>;
  }>;
}>, Type.TObject<{
  readonly type: Type.TLiteral<"error">;
  readonly reason: Type.TUnion<[Type.TLiteral<"model-not-approved">, Type.TLiteral<"invalid-context">, Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"session-not-attached">, Type.TLiteral<"provider-error">, Type.TLiteral<"cancelled">]>;
  readonly message: Type.TString;
  readonly usage: Type.TOptional<Type.TObject<{
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
  readonly type: Type.TLiteral<"event">;
  readonly event: Type.TLiteral<"worker.inference.terminal">;
  readonly payload: Type.TObject<{
    readonly runEpoch: Type.TInteger;
    readonly sessionId: Type.TString;
    readonly runId: Type.TString;
    readonly turnId: Type.TString;
    readonly seq: Type.TInteger;
    readonly outcome: Type.TUnion<[Type.TObject<{
      readonly type: Type.TLiteral<"done">;
      readonly message: Type.TObject<{
        readonly role: Type.TLiteral<"assistant">;
        readonly content: Type.TArray<Type.TUnion<[Type.TObject<{
          readonly type: Type.TLiteral<"text">;
          readonly text: Type.TString;
          readonly textSignature: Type.TOptional<Type.TString>;
        }>, Type.TObject<{
          readonly type: Type.TLiteral<"thinking">;
          readonly thinking: Type.TString;
          readonly thinkingSignature: Type.TOptional<Type.TString>;
          readonly redacted: Type.TOptional<Type.TBoolean>;
        }>, Type.TObject<{
          readonly type: Type.TLiteral<"toolCall">;
          readonly id: Type.TString;
          readonly name: Type.TString;
          readonly arguments: Type.TRecord<"^.*$", Type.TUnknown>;
          readonly thoughtSignature: Type.TOptional<Type.TString>;
          readonly executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
        }>]>>;
        readonly api: Type.TString;
        readonly provider: Type.TString;
        readonly model: Type.TString;
        readonly responseModel: Type.TOptional<Type.TString>;
        readonly responseId: Type.TOptional<Type.TString>;
        readonly providerReplay: Type.TOptional<Type.TObject<{
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
        readonly usage: Type.TObject<{
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
        readonly timestamp: Type.TInteger;
        readonly stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">]>;
      }>;
    }>, Type.TObject<{
      readonly type: Type.TLiteral<"error">;
      readonly reason: Type.TUnion<[Type.TLiteral<"model-not-approved">, Type.TLiteral<"invalid-context">, Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"session-not-attached">, Type.TLiteral<"provider-error">, Type.TLiteral<"cancelled">]>;
      readonly message: Type.TString;
      readonly usage: Type.TOptional<Type.TObject<{
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
//#region packages/gateway-protocol/src/schema/board.d.ts
declare const BoardGetParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
type BoardGetParams = Static<typeof BoardGetParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-row.d.ts
declare const SessionPermissionModeSchema: Type.TUnion<[Type.TLiteral<"read-only">, Type.TLiteral<"guarded">, Type.TLiteral<"workspace">, Type.TLiteral<"full">]>;
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
type SessionPermissionMode = Static<typeof SessionPermissionModeSchema>;
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
//#region packages/gateway-protocol/src/schema/tasks.d.ts
declare const TasksHistoryResultSchema: Type.TObject<{
  /** Stable messageId or __openclaw.id anchors refreshes; entry IDs can have sibling rows. */
  messages: Type.TArray<Type.TUnknown>;
  activity: Type.TOptional<Type.TArray<Type.TObject<{
    messageId: Type.TString;
    items: Type.TArray<Type.TObject<{
      itemId: Type.TString;
      phase: Type.TUnion<[Type.TLiteral<"start">, Type.TLiteral<"update">, Type.TLiteral<"end">]>;
      kind: Type.TString;
      title: Type.TString;
      status: Type.TOptional<Type.TUnion<[Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"blocked">]>>;
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
    }>>;
  }>>>;
  nextCursor: Type.TOptional<Type.TString>;
}>;
type TasksHistoryResult = Static<typeof TasksHistoryResultSchema>;
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
//#endregion
//#region packages/gateway-protocol/src/schema/cron.types.d.ts
type CronJob = Static<typeof CronJobSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/devices.d.ts
/** Returns the terminal scope-upgrade state to the identity-bound waiter. */
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
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"blocked">]>>;
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
/** Canonical normalized question shown to an operator. */
declare const QuestionSchema: Type.TObject<{
  questionId: Type.TString;
  header: Type.TString;
  question: Type.TString;
  url: Type.TOptional<Type.TString>;
  options: Type.TArray<Type.TObject<{
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
  }>>;
  multiSelect: Type.TOptional<Type.TBoolean>;
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
    }>>;
    multiSelect: Type.TOptional<Type.TBoolean>;
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
//#region packages/gateway-protocol/src/schema/sessions-list.d.ts
declare const SessionsListParamsSchema: Type.TObject<{
  /** Maximum rows to return; omitted Gateway RPC calls use a bounded default. */
  limit: Type.TOptional<Type.TInteger>;
  offset: Type.TOptional<Type.TInteger>;
  /** Activity age for sortBy: "activity"; otherwise metadata update age. */
  activeMinutes: Type.TOptional<Type.TInteger>;
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
/** Companion answer returned only to the requesting operator. */
declare const SessionsCompanionAskResultSchema: Type.TObject<{
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
type SessionObserverDigest = Static<typeof SessionObserverDigestSchema>;
type SessionsCompanionAskResult = Static<typeof SessionsCompanionAskResultSchema>;
type SessionsCompanionStateResult = Static<typeof SessionsCompanionStateResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/snapshot.d.ts
/** Initial and incremental gateway state snapshot payload. */
declare const SnapshotSchema: Type.TObject<{
  suspension: Type.TOptional<Type.TObject<{
    phase: Type.TUnion<[Type.TLiteral<"accepting">, Type.TLiteral<"preparing">, Type.TLiteral<"draining">, Type.TLiteral<"prepared">]>;
  }>>;
  presence: Type.TArray<Type.TObject<{
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
      kind: Type.TUnion<[Type.TLiteral<"package">, Type.TLiteral<"git">, Type.TLiteral<"unknown">]>;
      git: Type.TOptional<Type.TUnion<[Type.TObject<{
        currentSha: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
        status: Type.TLiteral<"current">;
      }>, Type.TObject<{
        currentSha: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
        status: Type.TLiteral<"behind">;
        commitsBehind: Type.TInteger;
      }>, Type.TObject<{
        currentSha: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
        status: Type.TLiteral<"ahead">;
        commitsAhead: Type.TInteger;
      }>, Type.TObject<{
        currentSha: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
        status: Type.TLiteral<"diverged">;
        commitsAhead: Type.TInteger;
        commitsBehind: Type.TInteger;
      }>, Type.TObject<{
        currentSha: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
        status: Type.TLiteral<"unavailable">;
        reason: Type.TUnion<[Type.TLiteral<"fetch-failed">, Type.TLiteral<"no-upstream">, Type.TLiteral<"no-upstream-sha">, Type.TLiteral<"comparison-failed">, Type.TLiteral<"git-unavailable">]>;
      }>]>>;
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
declare const WorkerIdentifierSchema: Type.TString;
declare const WorkerAdmissionFailureReasonSchema: Type.TUnion<[Type.TLiteral<"invalid-credential">, Type.TLiteral<"credential-expired">, Type.TLiteral<"environment-mismatch">, Type.TLiteral<"environment-unavailable">, Type.TLiteral<"bundle-mismatch">, Type.TLiteral<"version-mismatch">, Type.TLiteral<"session-mismatch">, Type.TLiteral<"placement-mismatch">, Type.TLiteral<"owner-epoch-mismatch">, Type.TLiteral<"rpc-set-mismatch">, Type.TLiteral<"protocol-features-mismatch">]>;
declare const WorkerProtocolCloseReasonSchema: Type.TUnion<[Type.TUnion<[Type.TLiteral<"invalid-credential">, Type.TLiteral<"credential-expired">, Type.TLiteral<"environment-mismatch">, Type.TLiteral<"environment-unavailable">, Type.TLiteral<"bundle-mismatch">, Type.TLiteral<"version-mismatch">, Type.TLiteral<"session-mismatch">, Type.TLiteral<"placement-mismatch">, Type.TLiteral<"owner-epoch-mismatch">, Type.TLiteral<"rpc-set-mismatch">, Type.TLiteral<"protocol-features-mismatch">]>, Type.TLiteral<"admission-rejected">, Type.TLiteral<"invalid-handshake">, Type.TLiteral<"protocol-mismatch">, Type.TLiteral<"gateway-unavailable">, Type.TLiteral<"invalid-frame">, Type.TLiteral<"slow-consumer">, Type.TLiteral<"method-not-allowed">, Type.TLiteral<"invalid-heartbeat">, Type.TLiteral<"credential-replaced">, Type.TLiteral<"gateway-shutdown">]>;
declare const LiveIntegerSchema: Type.TInteger;
declare const LiveSequenceSchema: Type.TInteger;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-admission.d.ts
declare const WORKER_BUNDLE_PREWARM_VERSION = 1;
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
declare const WorkerSessionsSpawnParamsSchema: Type.TObject<{
  toolCallId: Type.TString;
  task: Type.TString;
  label: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  runTimeoutSeconds: Type.TOptional<Type.TInteger>;
}>;
declare const WorkerSessionsSendParamsSchema: Type.TObject<{
  toolCallId: Type.TString;
  sessionKey: Type.TString;
  message: Type.TString;
  timeoutSeconds: Type.TOptional<Type.TInteger>;
}>;
declare const WorkerPortalParamsSchema: Type.TObject<{
  toolCallId: Type.TString;
  action: Type.TUnion<[Type.TLiteral<"open">, Type.TLiteral<"list">, Type.TLiteral<"close">]>;
  port: Type.TOptional<Type.TInteger>;
  title: Type.TOptional<Type.TString>;
  description: Type.TOptional<Type.TString>;
  path: Type.TOptional<Type.TString>;
  id: Type.TOptional<Type.TString>;
}>;
declare const WorkerSessionToolResultSchema: Type.TObject<{
  resultJson: Type.TString;
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
      executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
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
    stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">, Type.TLiteral<"error">, Type.TLiteral<"aborted">]>;
    errorMessage: Type.TOptional<Type.TString>;
    errorCode: Type.TOptional<Type.TString>;
    errorType: Type.TOptional<Type.TString>;
    errorBody: Type.TOptional<Type.TString>;
    timestamp: Type.TInteger;
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
declare const WorkerTranscriptCommitErrorReasonSchema: Type.TUnion<[Type.TLiteral<"stale-base-leaf">, Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"invalid-batch">, Type.TLiteral<"session-not-attached">]>;
declare const WorkerLiveEventSchema: Type.TUnion<[Type.TObject<{
  readonly kind: Type.TLiteral<"assistant">;
  readonly payload: Type.TObject<{
    readonly text: Type.TString;
    readonly delta: Type.TString;
    readonly replace: Type.TOptional<Type.TLiteral<true>>;
    readonly mediaUrls: Type.TOptional<Type.TArray<Type.TString>>;
    readonly phase: Type.TOptional<Type.TUnion<[Type.TLiteral<"commentary">, Type.TLiteral<"final_answer">]>>;
    readonly itemId: Type.TOptional<Type.TString>;
  }>;
}>, Type.TObject<{
  readonly kind: Type.TLiteral<"thinking">;
  readonly payload: Type.TObject<{
    readonly text: Type.TString;
    readonly delta: Type.TString;
  }>;
}>, Type.TObject<{
  readonly kind: Type.TLiteral<"tool">;
  readonly payload: Type.TUnion<[Type.TObject<{
    readonly name: Type.TString;
    readonly toolCallId: Type.TString;
    readonly hideFromChannelProgress: Type.TOptional<Type.TLiteral<true>>;
    readonly phase: Type.TLiteral<"start">;
    readonly args: Type.TUnknown;
  }>, Type.TObject<{
    readonly name: Type.TString;
    readonly toolCallId: Type.TString;
    readonly hideFromChannelProgress: Type.TOptional<Type.TLiteral<true>>;
    readonly phase: Type.TLiteral<"update">;
    readonly partialResult: Type.TUnknown;
  }>, Type.TObject<{
    readonly name: Type.TString;
    readonly toolCallId: Type.TString;
    readonly hideFromChannelProgress: Type.TOptional<Type.TLiteral<true>>;
    readonly phase: Type.TLiteral<"result">;
    readonly meta: Type.TOptional<Type.TString>;
    readonly isError: Type.TBoolean;
    readonly result: Type.TUnknown;
    readonly toolErrorSummary: Type.TOptional<Type.TString>;
  }>]>;
}>, Type.TObject<{
  readonly kind: Type.TLiteral<"approval">;
  readonly payload: Type.TUnion<[Type.TObject<{
    readonly kind: Type.TUnion<[Type.TLiteral<"exec">, Type.TLiteral<"plugin">, Type.TLiteral<"unknown">]>;
    readonly title: Type.TString;
    readonly itemId: Type.TOptional<Type.TString>;
    readonly toolCallId: Type.TOptional<Type.TString>;
    readonly approvalId: Type.TOptional<Type.TString>;
    readonly approvalSlug: Type.TOptional<Type.TString>;
    readonly command: Type.TOptional<Type.TString>;
    readonly host: Type.TOptional<Type.TString>;
    readonly reason: Type.TOptional<Type.TString>;
    readonly scope: Type.TOptional<Type.TUnion<[Type.TLiteral<"turn">, Type.TLiteral<"session">]>>;
    readonly message: Type.TOptional<Type.TString>;
    readonly phase: Type.TLiteral<"requested">;
    readonly status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"unavailable">]>;
  }>, Type.TObject<{
    readonly kind: Type.TUnion<[Type.TLiteral<"exec">, Type.TLiteral<"plugin">, Type.TLiteral<"unknown">]>;
    readonly title: Type.TString;
    readonly itemId: Type.TOptional<Type.TString>;
    readonly toolCallId: Type.TOptional<Type.TString>;
    readonly approvalId: Type.TOptional<Type.TString>;
    readonly approvalSlug: Type.TOptional<Type.TString>;
    readonly command: Type.TOptional<Type.TString>;
    readonly host: Type.TOptional<Type.TString>;
    readonly reason: Type.TOptional<Type.TString>;
    readonly scope: Type.TOptional<Type.TUnion<[Type.TLiteral<"turn">, Type.TLiteral<"session">]>>;
    readonly message: Type.TOptional<Type.TString>;
    readonly phase: Type.TLiteral<"resolved">;
    readonly status: Type.TUnion<[Type.TLiteral<"approved">, Type.TLiteral<"denied">, Type.TLiteral<"failed">]>;
  }>]>;
}>, Type.TObject<{
  readonly kind: Type.TLiteral<"lifecycle">;
  readonly payload: Type.TUnion<[Type.TObject<{
    readonly phase: Type.TLiteral<"start">;
    readonly startedAt: Type.TInteger;
  }>, Type.TObject<{
    readonly selectedProvider: Type.TString;
    readonly selectedModel: Type.TString;
    readonly activeProvider: Type.TString;
    readonly activeModel: Type.TString;
    readonly phase: Type.TLiteral<"fallback">;
    readonly reasonSummary: Type.TString;
    readonly attemptSummaries: Type.TArray<Type.TString>;
    readonly attempts: Type.TArray<Type.TObject<{
      readonly provider: Type.TString;
      readonly model: Type.TString;
      readonly error: Type.TString;
      readonly reason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"tls_certificate">, Type.TLiteral<"context_overflow">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
      readonly authMode: Type.TOptional<Type.TString>;
      readonly status: Type.TOptional<Type.TInteger>;
      readonly code: Type.TOptional<Type.TString>;
    }>>;
  }>, Type.TObject<{
    readonly selectedProvider: Type.TString;
    readonly selectedModel: Type.TString;
    readonly activeProvider: Type.TString;
    readonly activeModel: Type.TString;
    readonly phase: Type.TLiteral<"fallback_cleared">;
    readonly previousActiveModel: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    readonly phase: Type.TLiteral<"fallback_step">;
    readonly fallbackStepType: Type.TLiteral<"fallback_step">;
    readonly fallbackStepFromModel: Type.TString;
    readonly fallbackStepToModel: Type.TOptional<Type.TString>;
    readonly fallbackStepFromFailureReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"tls_certificate">, Type.TLiteral<"context_overflow">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
    readonly fallbackStepFromFailureDetail: Type.TOptional<Type.TString>;
    readonly fallbackStepChainPosition: Type.TOptional<Type.TInteger>;
    readonly fallbackStepFinalOutcome: Type.TUnion<[Type.TLiteral<"next_fallback">, Type.TLiteral<"succeeded">, Type.TLiteral<"chain_exhausted">]>;
  }>, Type.TUnion<[Type.TObject<{
    readonly startedAt: Type.TOptional<Type.TInteger>;
    readonly endedAt: Type.TInteger;
    readonly stopReason: Type.TOptional<Type.TString>;
    readonly yielded: Type.TOptional<Type.TLiteral<true>>;
    readonly timeoutPhase: Type.TOptional<Type.TUnion<[Type.TLiteral<"queue">, Type.TLiteral<"preflight">, Type.TLiteral<"provider">, Type.TLiteral<"post_turn">, Type.TLiteral<"gateway_draining">]>>;
    readonly providerStarted: Type.TOptional<Type.TBoolean>;
    readonly aborted: Type.TOptional<Type.TBoolean>;
    readonly toolErrorSummary: Type.TOptional<Type.TString>;
    readonly livenessState: Type.TOptional<Type.TUnion<[Type.TLiteral<"working">, Type.TLiteral<"paused">, Type.TLiteral<"blocked">, Type.TLiteral<"abandoned">]>>;
    readonly replayInvalid: Type.TOptional<Type.TLiteral<true>>;
    readonly phase: Type.TLiteral<"finishing">;
    readonly error: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    readonly startedAt: Type.TOptional<Type.TInteger>;
    readonly endedAt: Type.TInteger;
    readonly stopReason: Type.TOptional<Type.TString>;
    readonly yielded: Type.TOptional<Type.TLiteral<true>>;
    readonly timeoutPhase: Type.TOptional<Type.TUnion<[Type.TLiteral<"queue">, Type.TLiteral<"preflight">, Type.TLiteral<"provider">, Type.TLiteral<"post_turn">, Type.TLiteral<"gateway_draining">]>>;
    readonly providerStarted: Type.TOptional<Type.TBoolean>;
    readonly aborted: Type.TOptional<Type.TBoolean>;
    readonly toolErrorSummary: Type.TOptional<Type.TString>;
    readonly livenessState: Type.TOptional<Type.TUnion<[Type.TLiteral<"working">, Type.TLiteral<"paused">, Type.TLiteral<"blocked">, Type.TLiteral<"abandoned">]>>;
    readonly replayInvalid: Type.TOptional<Type.TLiteral<true>>;
    readonly phase: Type.TLiteral<"end">;
  }>, Type.TObject<{
    readonly startedAt: Type.TOptional<Type.TInteger>;
    readonly endedAt: Type.TInteger;
    readonly stopReason: Type.TOptional<Type.TString>;
    readonly yielded: Type.TOptional<Type.TLiteral<true>>;
    readonly timeoutPhase: Type.TOptional<Type.TUnion<[Type.TLiteral<"queue">, Type.TLiteral<"preflight">, Type.TLiteral<"provider">, Type.TLiteral<"post_turn">, Type.TLiteral<"gateway_draining">]>>;
    readonly providerStarted: Type.TOptional<Type.TBoolean>;
    readonly aborted: Type.TOptional<Type.TBoolean>;
    readonly toolErrorSummary: Type.TOptional<Type.TString>;
    readonly livenessState: Type.TOptional<Type.TUnion<[Type.TLiteral<"working">, Type.TLiteral<"paused">, Type.TLiteral<"blocked">, Type.TLiteral<"abandoned">]>>;
    readonly replayInvalid: Type.TOptional<Type.TLiteral<true>>;
    readonly phase: Type.TLiteral<"error">;
    readonly error: Type.TString;
    readonly fallbackExhaustedFailure: Type.TOptional<Type.TLiteral<true>>;
  }>]>]>;
}>]>;
declare const WorkerLiveEventParamsSchema: Type.TObject<{
  readonly runEpoch: typeof LiveIntegerSchema;
  readonly lastAckedSeq: typeof LiveIntegerSchema;
  readonly seq: typeof LiveSequenceSchema;
  readonly runId: typeof WorkerIdentifierSchema;
  readonly event: typeof WorkerLiveEventSchema;
}>;
declare const WorkerLiveEventResultSchema: Type.TObject<{
  readonly ackedSeq: Type.TInteger;
}>;
declare const WorkerLiveEventErrorDetailsSchema: Type.TUnion<[Type.TObject<{
  readonly reason: Type.TUnion<[Type.TLiteral<"epoch-mismatch">, Type.TLiteral<"session-not-attached">, Type.TLiteral<"invalid-event">, Type.TLiteral<"capacity-exceeded">]>;
}>, Type.TObject<{
  readonly reason: Type.TLiteral<"resync-required">;
  readonly ackedSeq: Type.TInteger;
  readonly expectedSeq: Type.TInteger;
}>]>;
type WorkerAdmissionHandshake = Static<typeof WorkerAdmissionHandshakeSchema>;
type WorkerConnectParams = Static<typeof WorkerConnectParamsSchema>;
type WorkerAdmissionFailureReason = Static<typeof WorkerAdmissionFailureReasonSchema>;
type WorkerProtocolCloseReason = Static<typeof WorkerProtocolCloseReasonSchema>;
type WorkerSessionsSpawnParams = Static<typeof WorkerSessionsSpawnParamsSchema>;
type WorkerSessionsSendParams = Static<typeof WorkerSessionsSendParamsSchema>;
type WorkerPortalParams = Static<typeof WorkerPortalParamsSchema>;
type WorkerSessionToolResult = Static<typeof WorkerSessionToolResultSchema>;
type WorkerTranscriptCommitParams = Static<typeof WorkerTranscriptCommitParamsSchema>;
type WorkerTranscriptCommitResult = Static<typeof WorkerTranscriptCommitResultSchema>;
type WorkerTranscriptCommitErrorReason = Static<typeof WorkerTranscriptCommitErrorReasonSchema>;
type WorkerLiveEventParams = Static<typeof WorkerLiveEventParamsSchema>;
type WorkerLiveEventResult = Static<typeof WorkerLiveEventResultSchema>;
type WorkerLiveEventErrorDetails = Static<typeof WorkerLiveEventErrorDetailsSchema>;
//#endregion
export { UsersSelectModelAccountResult as $, HelloOk as $t, QuestionRecord as A, SessionPermissionMode as At, ScopeUpgradeResult as B, WorkerInferenceEventParams as Bt, Snapshot as C, SessionsCatalogReadParams as Ct, SessionsListParams as D, TasksHistoryResult as Dt, SessionsCompanionStateResult as E, SessionsCatalogStartTerminalResult as Et, QueueMode as F, WorkerComputerResult as Ft, UsersAuthConnectCatalogResult as G, ModelChoice as Gt, SystemAgentChatQuestion as H, WorkerInferenceStartResult as Ht, HumanMention as I, WorkerInferenceCancelParams as It, UsersGitHubAuthorizePollResult as J, SessionGitHubPublishParams as Jt, UsersAuthConnectStartResult as K, GitHubPublicationPublisher as Kt, MentionsListResult as L, WorkerInferenceCancelResult as Lt, QuestionResolvedEvent as M, SessionRunStatus as Mt, QuestionWaitAnswerResult as N, BoardGetParams as Nt, Question as O, SessionActivitySummary as Ot, AgentActivityItem as P, WorkerComputerParams as Pt, UsersListModelAccountsResult as Q, EventFrame as Qt, UsersMentionableParams as R, WorkerInferenceErrorReason as Rt, TerminalUploadResult as S, SessionsCatalogListResult as St, SessionsCompanionAskResult as T, SessionsCatalogStartTerminalParams as Tt, SystemAgentWizardCancel as U, WorkerInferenceTerminalFrame as Ut, CronJob as V, WorkerInferenceStartParams as Vt, PersonalGitHubStatus as W, WorkerInferenceTerminalOutcome as Wt, UsersLinkAuthProfileResult as X, ConnectParams as Xt, UsersGitHubAuthorizeStartResult as Y, errorShape as Yt, UsersListAuthLinksResult as Z, ErrorShape as Zt, WizardNextResult as _, SessionsCatalogArchiveParams as _t, WorkerLiveEventErrorDetails as a, SessionPlacementRunner as an, ToolsGitHubAuthorizePollResult as at, PortalSummary as b, SessionsCatalogContinueResult as bt, WorkerPortalParams as c, SessionsGoalMutationResult as cn, SessionCatalog as ct, WorkerSessionsSendParams as d, SessionCatalogHost as dt, RequestFrame as en, UsersUnlinkAuthProfileResult as et, WorkerSessionsSpawnParams as f, SessionCatalogLocator as ft, WizardAnswer as g, SessionCatalogTranscriptItem as gt, WorkerTranscriptCommitResult as h, SessionCatalogShareRoute as ht, WorkerConnectParams as i, SessionPlacementMachine as in, SkillsProposalRecordResult as it, QuestionResolveResult as j, SessionRow as jt, QuestionAnswers as k, SessionEntryArchiveReason as kt, WorkerProtocolCloseReason as l, SessionParticipant as ln, SessionCatalogCapabilities as lt, WorkerTranscriptCommitParams as m, SessionCatalogSession as mt, WorkerAdmissionFailureReason as n, SessionMoveTarget as nn, DecisionReceiptV1 as nt, WorkerLiveEventParams as o, SessionsReclaimParams as on, ToolsGitHubAuthorizeStartResult as ot, WorkerTranscriptCommitErrorReason as p, SessionCatalogPullRequestSummary as pt, UsersAuthConnectStatusResult as q, SessionGitHubPublicationResult as qt, WorkerAdmissionHandshake as r, SessionPlacementDiskSpace as rn, AgentSummary as rt, WorkerLiveEventResult as s, SessionGoal as sn, AgentWaitParams as st, WORKER_BUNDLE_PREWARM_VERSION as t, ErrorCodes as tn, ChatAccountSelection as tt, WorkerSessionToolResult as u, SessionParticipantIdentity as un, SessionCatalogDescriptor as ut, WizardStep as v, SessionsCatalogArchiveResult as vt, SessionObserverDigest as w, SessionsCatalogReadResult as wt, TerminalUploadPathStyle as x, SessionsCatalogListParams as xt, PortalOpenResult as y, SessionsCatalogContinueParams as yt, UsersMentionableResult as z, WorkerInferenceEventFrame as zt };