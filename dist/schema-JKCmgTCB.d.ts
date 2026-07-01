import { Static, TSchema, Type } from "typebox";

//#region packages/gateway-protocol/src/schema/agent.d.ts
/** Stream event emitted by the agent runtime over the gateway protocol. */
declare const AgentEventSchema: Type.TObject<{
  runId: Type.TString;
  seq: Type.TInteger;
  stream: Type.TString;
  ts: Type.TInteger;
  spawnedBy: Type.TOptional<Type.TString>;
  isHeartbeat: Type.TOptional<Type.TBoolean>;
  data: Type.TRecord<"^.*$", Type.TUnknown>;
}>;
/** Request to execute a channel message action through a configured adapter. */
declare const MessageActionParamsSchema: Type.TObject<{
  channel: Type.TString;
  action: Type.TString;
  params: Type.TRecord<"^.*$", Type.TUnknown>;
  accountId: Type.TOptional<Type.TString>;
  requesterAccountId: Type.TOptional<Type.TString>;
  requesterSenderId: Type.TOptional<Type.TString>;
  senderIsOwner: Type.TOptional<Type.TBoolean>;
  sessionKey: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  inboundTurnKind: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  toolContext: Type.TOptional<Type.TObject<{
    currentChannelId: Type.TOptional<Type.TString>;
    currentMessagingTarget: Type.TOptional<Type.TString>;
    currentGraphChannelId: Type.TOptional<Type.TString>;
    currentChannelProvider: Type.TOptional<Type.TString>;
    currentThreadTs: Type.TOptional<Type.TString>;
    currentMessageId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    replyToMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"first">, Type.TLiteral<"all">, Type.TLiteral<"batched">]>>;
    hasRepliedRef: Type.TOptional<Type.TObject<{
      value: Type.TBoolean;
    }>>;
    sameChannelThreadRequired: Type.TOptional<Type.TBoolean>;
    skipCrossContextDecoration: Type.TOptional<Type.TBoolean>;
  }>>;
  idempotencyKey: Type.TString;
}>;
/** Outbound send request shared by channel adapters. */
declare const SendParamsSchema: Type.TObject<{
  to: Type.TString;
  message: Type.TOptional<Type.TString>;
  mediaUrl: Type.TOptional<Type.TString>;
  mediaUrls: Type.TOptional<Type.TArray<Type.TString>>; /** Base64 attachment payload for gateway-local media materialization. */
  buffer: Type.TOptional<Type.TString>; /** Optional filename for a base64 attachment payload. */
  filename: Type.TOptional<Type.TString>; /** Optional MIME type for a base64 attachment payload. */
  contentType: Type.TOptional<Type.TString>;
  asVoice: Type.TOptional<Type.TBoolean>;
  gifPlayback: Type.TOptional<Type.TBoolean>;
  channel: Type.TOptional<Type.TString>;
  accountId: Type.TOptional<Type.TString>; /** Optional agent id for per-agent media root resolution on gateway sends. */
  agentId: Type.TOptional<Type.TString>; /** Reply target message id for native quoted/threaded sends where supported. */
  replyToId: Type.TOptional<Type.TString>; /** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */
  threadId: Type.TOptional<Type.TString>; /** Force document-style media sends where supported. */
  forceDocument: Type.TOptional<Type.TBoolean>; /** Send silently (no notification) where supported. */
  silent: Type.TOptional<Type.TBoolean>; /** Channel-specific parse mode for formatted text. */
  parseMode: Type.TOptional<Type.TLiteral<"HTML">>; /** Optional session key for mirroring delivered output back into the transcript. */
  sessionKey: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
}>;
/** Poll creation request for adapters that support native polls. */
declare const PollParamsSchema: Type.TObject<{
  to: Type.TString;
  question: Type.TString;
  options: Type.TArray<Type.TString>;
  maxSelections: Type.TOptional<Type.TInteger>; /** Poll duration in seconds (channel-specific limits may apply). */
  durationSeconds: Type.TOptional<Type.TInteger>;
  durationHours: Type.TOptional<Type.TInteger>; /** Send silently (no notification) where supported. */
  silent: Type.TOptional<Type.TBoolean>; /** Poll anonymity where supported (e.g. Telegram polls default to anonymous). */
  isAnonymous: Type.TOptional<Type.TBoolean>; /** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */
  threadId: Type.TOptional<Type.TString>;
  channel: Type.TOptional<Type.TString>;
  accountId: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
}>;
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
  cleanupBundleMcpOnRunEnd: Type.TOptional<Type.TBoolean>;
  modelRun: Type.TOptional<Type.TBoolean>;
  promptMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"full">, Type.TLiteral<"minimal">, Type.TLiteral<"none">]>>;
  extraSystemPrompt: Type.TOptional<Type.TString>;
  bootstrapContextMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"full">, Type.TLiteral<"lightweight">]>>;
  bootstrapContextRunKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"default">, Type.TLiteral<"heartbeat">, Type.TLiteral<"cron">]>>;
  acpTurnSource: Type.TOptional<Type.TLiteral<"manual_spawn">>;
  internalRuntimeHandoffId: Type.TOptional<Type.TString>;
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
    attachments: Type.TOptional<Type.TArray<Type.TObject<{
      type: Type.TOptional<Type.TString>;
      path: Type.TOptional<Type.TString>;
      url: Type.TOptional<Type.TString>;
      mediaUrl: Type.TOptional<Type.TString>;
      filePath: Type.TOptional<Type.TString>;
      mimeType: Type.TOptional<Type.TString>;
      name: Type.TOptional<Type.TString>;
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
  }>>;
  suppressPromptPersistence: Type.TOptional<Type.TBoolean>;
  sessionEffects: Type.TOptional<Type.TUnion<[Type.TLiteral<"visible">, Type.TLiteral<"internal">]>>;
  sourceReplyDeliveryMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"automatic">, Type.TLiteral<"message_tool_only">]>>;
  disableMessageTool: Type.TOptional<Type.TBoolean>;
  voiceWakeTrigger: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
  label: Type.TOptional<Type.TString>;
}>;
/** Identity lookup request for the current or selected agent/session. */
declare const AgentIdentityParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
}>;
/** Public display identity returned for an agent. */
declare const AgentIdentityResultSchema: Type.TObject<{
  agentId: Type.TString;
  name: Type.TOptional<Type.TString>;
  avatar: Type.TOptional<Type.TString>;
  avatarSource: Type.TOptional<Type.TString>;
  avatarStatus: Type.TOptional<Type.TString>;
  avatarReason: Type.TOptional<Type.TString>;
  emoji: Type.TOptional<Type.TString>;
}>;
/** Wake request from external schedulers or devices into an agent session. */
declare const WakeParamsSchema: Type.TObject<{
  mode: Type.TUnion<[Type.TLiteral<"now">, Type.TLiteral<"next-heartbeat">]>;
  text: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  /**
   * Optional agent id paired with `sessionKey`. Routes multi-agent setups
   * to the agent that owns the targeted session — closes the related half
   * of #46886 ("always routes to default agent").
   */
  agentId: Type.TOptional<Type.TString>;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/agents-models-skills.d.ts
/** Condensed agent record returned by list APIs. */
declare const AgentSummarySchema: Type.TObject<{
  id: Type.TString;
  name: Type.TOptional<Type.TString>;
  identity: Type.TOptional<Type.TObject<{
    name: Type.TOptional<Type.TString>;
    theme: Type.TOptional<Type.TString>;
    emoji: Type.TOptional<Type.TString>;
    avatar: Type.TOptional<Type.TString>;
    avatarUrl: Type.TOptional<Type.TString>;
  }>>;
  workspace: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TObject<{
    primary: Type.TOptional<Type.TString>;
    fallbacks: Type.TOptional<Type.TArray<Type.TString>>;
  }>>;
  agentRuntime: Type.TOptional<Type.TObject<{
    id: Type.TString;
    fallback: Type.TOptional<Type.TUnion<[Type.TLiteral<"openclaw">, Type.TLiteral<"none">]>>;
    source: Type.TUnion<[Type.TLiteral<"env">, Type.TLiteral<"agent">, Type.TLiteral<"defaults">, Type.TLiteral<"model">, Type.TLiteral<"provider">, Type.TLiteral<"implicit">]>;
  }>>;
  thinkingLevels: Type.TOptional<Type.TArray<Type.TObject<{
    id: Type.TString;
    label: Type.TString;
  }>>>;
  thinkingOptions: Type.TOptional<Type.TArray<Type.TString>>;
  thinkingDefault: Type.TOptional<Type.TString>;
}>;
/** Empty request payload for listing configured agents. */
declare const AgentsListParamsSchema: Type.TObject<{}>;
/** Agent list result including the default agent and session scoping mode. */
declare const AgentsListResultSchema: Type.TObject<{
  defaultId: Type.TString;
  mainKey: Type.TString;
  scope: Type.TUnion<[Type.TLiteral<"per-sender">, Type.TLiteral<"global">]>;
  agents: Type.TArray<Type.TObject<{
    id: Type.TString;
    name: Type.TOptional<Type.TString>;
    identity: Type.TOptional<Type.TObject<{
      name: Type.TOptional<Type.TString>;
      theme: Type.TOptional<Type.TString>;
      emoji: Type.TOptional<Type.TString>;
      avatar: Type.TOptional<Type.TString>;
      avatarUrl: Type.TOptional<Type.TString>;
    }>>;
    workspace: Type.TOptional<Type.TString>;
    model: Type.TOptional<Type.TObject<{
      primary: Type.TOptional<Type.TString>;
      fallbacks: Type.TOptional<Type.TArray<Type.TString>>;
    }>>;
    agentRuntime: Type.TOptional<Type.TObject<{
      id: Type.TString;
      fallback: Type.TOptional<Type.TUnion<[Type.TLiteral<"openclaw">, Type.TLiteral<"none">]>>;
      source: Type.TUnion<[Type.TLiteral<"env">, Type.TLiteral<"agent">, Type.TLiteral<"defaults">, Type.TLiteral<"model">, Type.TLiteral<"provider">, Type.TLiteral<"implicit">]>;
    }>>;
    thinkingLevels: Type.TOptional<Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
    }>>>;
    thinkingOptions: Type.TOptional<Type.TArray<Type.TString>>;
    thinkingDefault: Type.TOptional<Type.TString>;
  }>>;
}>;
/** Creates a configured agent with workspace, identity, and optional model. */
declare const AgentsCreateParamsSchema: Type.TObject<{
  name: Type.TString;
  workspace: Type.TString;
  model: Type.TOptional<Type.TString>;
  emoji: Type.TOptional<Type.TString>;
  avatar: Type.TOptional<Type.TString>;
}>;
/** Result returned after creating an agent. */
declare const AgentsCreateResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  agentId: Type.TString;
  name: Type.TString;
  workspace: Type.TString;
  model: Type.TOptional<Type.TString>;
}>;
/** Updates mutable agent identity, workspace, and model fields. */
declare const AgentsUpdateParamsSchema: Type.TObject<{
  agentId: Type.TString;
  name: Type.TOptional<Type.TString>;
  workspace: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  emoji: Type.TOptional<Type.TString>;
  avatar: Type.TOptional<Type.TString>;
}>;
/** Result returned after updating an agent. */
declare const AgentsUpdateResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  agentId: Type.TString;
}>;
/** Deletes an agent and optionally its workspace/config files. */
declare const AgentsDeleteParamsSchema: Type.TObject<{
  agentId: Type.TString;
  deleteFiles: Type.TOptional<Type.TBoolean>;
}>;
/** Result returned after deleting an agent and unbinding sessions. */
declare const AgentsDeleteResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  agentId: Type.TString;
  removedBindings: Type.TInteger;
}>;
/** File metadata and optional content for agent-local editable files. */
declare const AgentsFileEntrySchema: Type.TObject<{
  name: Type.TString;
  path: Type.TString;
  missing: Type.TBoolean;
  size: Type.TOptional<Type.TInteger>;
  updatedAtMs: Type.TOptional<Type.TInteger>;
  content: Type.TOptional<Type.TString>;
}>;
/** Lists editable files for one agent. */
declare const AgentsFilesListParamsSchema: Type.TObject<{
  agentId: Type.TString;
}>;
/** Editable file list for an agent workspace. */
declare const AgentsFilesListResultSchema: Type.TObject<{
  agentId: Type.TString;
  workspace: Type.TString;
  files: Type.TArray<Type.TObject<{
    name: Type.TString;
    path: Type.TString;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
  }>>;
}>;
/** Reads one editable agent file by name. */
declare const AgentsFilesGetParamsSchema: Type.TObject<{
  agentId: Type.TString;
  name: Type.TString;
}>;
/** Result for reading one editable agent file. */
declare const AgentsFilesGetResultSchema: Type.TObject<{
  agentId: Type.TString;
  workspace: Type.TString;
  file: Type.TObject<{
    name: Type.TString;
    path: Type.TString;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
  }>;
}>;
/** Writes one editable agent file. */
declare const AgentsFilesSetParamsSchema: Type.TObject<{
  agentId: Type.TString;
  name: Type.TString;
  content: Type.TString;
}>;
/** Result returned after writing an editable agent file. */
declare const AgentsFilesSetResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  agentId: Type.TString;
  workspace: Type.TString;
  file: Type.TObject<{
    name: Type.TString;
    path: Type.TString;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
  }>;
}>;
/** Model catalog request with optional visibility scope. */
declare const ModelsListParamsSchema: Type.TObject<{
  view: Type.TOptional<Type.TUnion<[Type.TLiteral<"default">, Type.TLiteral<"configured">, Type.TLiteral<"all">]>>;
}>;
/** Reads installed skill status, optionally for a selected agent. */
declare const SkillsStatusParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
}>;
/** Starts a chunked skill archive upload. */
declare const SkillsUploadBeginParamsSchema: Type.TObject<{
  kind: Type.TLiteral<"skill-archive">;
  slug: Type.TString;
  sizeBytes: Type.TInteger;
  sha256: Type.TOptional<Type.TString>;
  force: Type.TOptional<Type.TBoolean>;
  idempotencyKey: Type.TOptional<Type.TString>;
}>;
/** Uploads one base64-encoded chunk for a skill archive. */
declare const SkillsUploadChunkParamsSchema: Type.TObject<{
  uploadId: Type.TString;
  offset: Type.TInteger;
  dataBase64: Type.TString;
}>;
/** Commits a completed skill archive upload. */
declare const SkillsUploadCommitParamsSchema: Type.TObject<{
  uploadId: Type.TString;
  sha256: Type.TOptional<Type.TString>;
}>;
/** Installs a skill from legacy install id, ClawHub, or uploaded archive. */
declare const SkillsInstallParamsSchema: Type.TUnion<[Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  name: Type.TString;
  installId: Type.TString;
  dangerouslyForceUnsafeInstall: Type.TOptional<Type.TBoolean>;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>, Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  source: Type.TLiteral<"clawhub">;
  slug: Type.TString;
  version: Type.TOptional<Type.TString>;
  force: Type.TOptional<Type.TBoolean>;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>, Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  source: Type.TLiteral<"upload">;
  uploadId: Type.TString;
  slug: Type.TString;
  force: Type.TOptional<Type.TBoolean>;
  sha256: Type.TOptional<Type.TString>;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>]>;
/** Updates installed skill settings or refreshes ClawHub-installed skills. */
declare const SkillsUpdateParamsSchema: Type.TUnion<[Type.TObject<{
  skillKey: Type.TString;
  enabled: Type.TOptional<Type.TBoolean>;
  apiKey: Type.TOptional<Type.TString>;
  env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
}>, Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  source: Type.TLiteral<"clawhub">;
  slug: Type.TOptional<Type.TString>;
  all: Type.TOptional<Type.TBoolean>;
}>]>;
/** Searches the skill registry. */
declare const SkillsSearchParamsSchema: Type.TObject<{
  query: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
}>;
/** Ranked skill registry search results. */
declare const SkillsSearchResultSchema: Type.TObject<{
  results: Type.TArray<Type.TObject<{
    score: Type.TNumber;
    slug: Type.TString;
    displayName: Type.TString;
    summary: Type.TOptional<Type.TString>;
    version: Type.TOptional<Type.TString>;
    updatedAt: Type.TOptional<Type.TInteger>;
  }>>;
}>;
/** Reads registry detail for one skill slug. */
declare const SkillsDetailParamsSchema: Type.TObject<{
  slug: Type.TString;
}>;
/** Reads current security verdicts for configured skills. */
declare const SkillsSecurityVerdictsParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
}>;
/** Skill registry detail, latest version, metadata, and owner info. */
declare const SkillsDetailResultSchema: Type.TObject<{
  skill: Type.TUnion<[Type.TObject<{
    slug: Type.TString;
    displayName: Type.TString;
    summary: Type.TOptional<Type.TString>;
    tags: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    createdAt: Type.TInteger;
    updatedAt: Type.TInteger;
  }>, Type.TNull]>;
  latestVersion: Type.TOptional<Type.TUnion<[Type.TObject<{
    version: Type.TString;
    createdAt: Type.TInteger;
    changelog: Type.TOptional<Type.TString>;
  }>, Type.TNull]>>;
  metadata: Type.TOptional<Type.TUnion<[Type.TObject<{
    os: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
    systems: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
  }>, Type.TNull]>>;
  owner: Type.TOptional<Type.TUnion<[Type.TObject<{
    handle: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    displayName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    image: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  }>, Type.TNull]>>;
}>;
/** Security verdict report for installed/requested skills. */
declare const SkillsSecurityVerdictsResultSchema: Type.TObject<{
  schema: Type.TLiteral<"openclaw.skills.security-verdicts.v1">;
  items: Type.TArray<Type.TObject<{
    registry: Type.TString;
    ok: Type.TBoolean;
    decision: Type.TString;
    reasons: Type.TArray<Type.TString>;
    requestedSlug: Type.TString;
    requestedVersion: Type.TString;
    slug: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    version: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    displayName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    publisherHandle: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    publisherDisplayName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    createdAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    checkedAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    skillUrl: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    securityAuditUrl: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    securityStatus: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    securityPassed: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TNull]>>;
    error: Type.TOptional<Type.TObject<{
      code: Type.TOptional<Type.TString>;
      message: Type.TOptional<Type.TString>;
    }>>;
  }>>;
}>;
/** Reads the rendered skill card for one installed skill. */
declare const SkillsSkillCardParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  skillKey: Type.TString;
}>;
/** Rendered skill card content and file metadata. */
declare const SkillsSkillCardResultSchema: Type.TObject<{
  schema: Type.TLiteral<"openclaw.skills.skill-card.v1">;
  skillKey: Type.TString;
  path: Type.TString;
  sizeBytes: Type.TInteger;
  content: Type.TString;
}>;
/** Lists skill-workshop proposals for the selected agent scope. */
declare const SkillsProposalsListParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
}>;
/** Proposal manifest response for dashboard/workshop list views. */
declare const SkillsProposalsListResultSchema: Type.TObject<{
  schema: Type.TLiteral<"openclaw.skill-workshop.proposals-manifest.v1">;
  updatedAt: Type.TString;
  proposals: Type.TArray<Type.TObject<{
    id: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"create">, Type.TLiteral<"update">]>;
    status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"applied">, Type.TLiteral<"rejected">, Type.TLiteral<"quarantined">, Type.TLiteral<"stale">]>;
    title: Type.TString;
    description: Type.TString;
    skillName: Type.TString;
    skillKey: Type.TString;
    createdAt: Type.TString;
    updatedAt: Type.TString;
    scanState: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"clean">, Type.TLiteral<"failed">, Type.TLiteral<"quarantined">]>;
  }>>;
}>;
/** Reads a proposal record plus editable draft/support content. */
declare const SkillsProposalInspectParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  proposalId: Type.TString;
}>;
/** Full proposal inspection result used before apply/revise decisions. */
declare const SkillsProposalInspectResultSchema: Type.TObject<{
  record: Type.TObject<{
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
  }>;
  content: Type.TString;
  supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
    path: Type.TString;
    content: Type.TString;
  }>>>;
}>;
/** Creates a proposal for a new skill. */
declare const SkillsProposalCreateParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  name: Type.TString;
  description: Type.TString;
  content: Type.TString;
  supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
    path: Type.TString;
    content: Type.TString;
  }>>>;
  goal: Type.TOptional<Type.TString>;
  evidence: Type.TOptional<Type.TString>;
}>;
/** Creates a proposal to update an existing skill. */
declare const SkillsProposalUpdateParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  skillName: Type.TString;
  description: Type.TOptional<Type.TString>;
  content: Type.TString;
  supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
    path: Type.TString;
    content: Type.TString;
  }>>>;
  goal: Type.TOptional<Type.TString>;
  evidence: Type.TOptional<Type.TString>;
}>;
/** Replaces draft content/support files for an existing proposal. */
declare const SkillsProposalReviseParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  proposalId: Type.TString;
  content: Type.TString;
  supportFiles: Type.TOptional<Type.TArray<Type.TObject<{
    path: Type.TString;
    content: Type.TString;
  }>>>;
  description: Type.TOptional<Type.TString>;
  goal: Type.TOptional<Type.TString>;
  evidence: Type.TOptional<Type.TString>;
}>;
/** Starts an agent turn that revises a pending proposal from natural-language instructions. */
declare const SkillsProposalRequestRevisionParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  targetAgentId: Type.TOptional<Type.TString>;
  proposalId: Type.TString;
  instructions: Type.TString;
  sessionKey: Type.TString;
  sessionId: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
}>;
/** Chat-run acknowledgement returned after queueing a Skill Workshop revision request. */
declare const SkillsProposalRequestRevisionResultSchema: Type.TObject<{
  runId: Type.TString;
  status: Type.TUnion<[Type.TLiteral<"started">, Type.TLiteral<"in_flight">, Type.TLiteral<"ok">, Type.TLiteral<"timeout">, Type.TLiteral<"error">]>;
}>;
/** Shared approve/reject/quarantine action payload for one proposal. */
declare const SkillsProposalActionParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  proposalId: Type.TString;
  reason: Type.TOptional<Type.TString>;
}>;
/** Result returned after applying a skill proposal to disk. */
declare const SkillsProposalApplyResultSchema: Type.TObject<{
  record: Type.TObject<{
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
  }>;
  targetSkillFile: Type.TString;
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
}>;
/** Reads the configured tool catalog for an agent. */
declare const ToolsCatalogParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  includePlugins: Type.TOptional<Type.TBoolean>;
}>;
/** Reads the effective tool set for one session. */
declare const ToolsEffectiveParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TString;
}>;
/** Invokes one tool through the gateway tool dispatcher. */
declare const ToolsInvokeParamsSchema: Type.TObject<{
  name: Type.TString;
  args: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  sessionKey: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  confirm: Type.TOptional<Type.TBoolean>;
  idempotencyKey: Type.TOptional<Type.TString>;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/artifacts.d.ts
/** Public artifact metadata returned before or alongside download data. */
declare const ArtifactSummarySchema: Type.TObject<{
  id: Type.TString;
  type: Type.TString;
  title: Type.TString;
  mimeType: Type.TOptional<Type.TString>;
  sizeBytes: Type.TOptional<Type.TInteger>;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  taskId: Type.TOptional<Type.TString>;
  messageSeq: Type.TOptional<Type.TInteger>;
  source: Type.TOptional<Type.TString>;
  download: Type.TObject<{
    mode: Type.TUnion<[Type.TLiteral<"bytes">, Type.TLiteral<"url">, Type.TLiteral<"unsupported">]>;
  }>;
}>;
/** List request payload for artifacts visible in the selected scope. */
declare const ArtifactsListParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  taskId: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Get request payload for one artifact summary. */
declare const ArtifactsGetParamsSchema: Type.TObject<{
  artifactId: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  taskId: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Download request payload for one artifact. */
declare const ArtifactsDownloadParamsSchema: Type.TObject<{
  artifactId: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  taskId: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/channels.d.ts
/** Reads Talk configuration; secrets are included only for trusted callers. */
declare const TalkConfigParamsSchema: Type.TObject<{
  includeSecrets: Type.TOptional<Type.TBoolean>;
}>;
/** One-shot text-to-speech request with provider-specific voice tuning knobs. */
declare const TalkSpeakParamsSchema: Type.TObject<{
  text: Type.TString;
  voiceId: Type.TOptional<Type.TString>;
  modelId: Type.TOptional<Type.TString>;
  outputFormat: Type.TOptional<Type.TString>;
  speed: Type.TOptional<Type.TNumber>;
  rateWpm: Type.TOptional<Type.TInteger>;
  stability: Type.TOptional<Type.TNumber>;
  similarity: Type.TOptional<Type.TNumber>;
  style: Type.TOptional<Type.TNumber>;
  speakerBoost: Type.TOptional<Type.TBoolean>;
  seed: Type.TOptional<Type.TInteger>;
  normalize: Type.TOptional<Type.TString>;
  language: Type.TOptional<Type.TString>;
  latencyTier: Type.TOptional<Type.TInteger>;
}>;
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
/** Creates a browser-facing Talk client session. */
declare const TalkClientCreateParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  vadThreshold: Type.TOptional<Type.TNumber>;
  silenceDurationMs: Type.TOptional<Type.TInteger>;
  prefixPaddingMs: Type.TOptional<Type.TInteger>;
  reasoningEffort: Type.TOptional<Type.TString>;
  mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>;
  transport: Type.TOptional<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>;
  brain: Type.TOptional<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>;
}>;
/** Tool-call request from a browser/client session back into the agent runtime. */
declare const TalkClientToolCallParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  callId: Type.TString;
  name: Type.TString;
  args: Type.TOptional<Type.TUnknown>;
  relaySessionId: Type.TOptional<Type.TString>;
}>;
/** Agent run identity returned after accepting a Talk client tool call. */
declare const TalkClientToolCallResultSchema: Type.TObject<{
  runId: Type.TString;
  idempotencyKey: Type.TString;
}>;
/** Text steering request for a Talk session bound to an agent turn. */
declare const TalkClientSteerParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  text: Type.TString;
  mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"status">, Type.TLiteral<"steer">, Type.TLiteral<"cancel">, Type.TLiteral<"followup">]>>;
}>;
/** Result of applying agent control to an embedded or reply-backed Talk run. */
declare const TalkAgentControlResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  mode: Type.TUnion<[Type.TLiteral<"status">, Type.TLiteral<"steer">, Type.TLiteral<"cancel">, Type.TLiteral<"followup">]>;
  sessionKey: Type.TString;
  sessionId: Type.TOptional<Type.TString>;
  active: Type.TBoolean;
  queued: Type.TOptional<Type.TBoolean>;
  aborted: Type.TOptional<Type.TBoolean>;
  target: Type.TOptional<Type.TUnion<[Type.TLiteral<"embedded_run">, Type.TLiteral<"reply_run">]>>;
  reason: Type.TOptional<Type.TString>;
  message: Type.TString;
  speak: Type.TBoolean;
  show: Type.TBoolean;
  suppress: Type.TBoolean;
  providerResult: Type.TOptional<Type.TObject<{
    status: Type.TLiteral<"cancelled">;
    message: Type.TString;
  }>>;
  enqueuedAtMs: Type.TOptional<Type.TNumber>;
  deliveredAtMs: Type.TOptional<Type.TNumber>;
}>;
/** Joins an existing managed-room Talk session. */
declare const TalkSessionJoinParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  token: Type.TString;
}>;
/** Creates a gateway-managed Talk session for realtime, transcription, or relay use. */
declare const TalkSessionCreateParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  vadThreshold: Type.TOptional<Type.TNumber>;
  silenceDurationMs: Type.TOptional<Type.TInteger>;
  prefixPaddingMs: Type.TOptional<Type.TInteger>;
  reasoningEffort: Type.TOptional<Type.TString>;
  mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>;
  transport: Type.TOptional<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>;
  brain: Type.TOptional<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>;
  ttlMs: Type.TOptional<Type.TInteger>;
}>;
/** Appends base64 audio to an active Talk session. */
declare const TalkSessionAppendAudioParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  audioBase64: Type.TString;
  timestamp: Type.TOptional<Type.TNumber>;
}>;
/** Starts or advances a Talk turn within a session. */
declare const TalkSessionTurnParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  turnId: Type.TOptional<Type.TString>;
}>;
/** Cancels the active or named Talk turn. */
declare const TalkSessionCancelTurnParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  turnId: Type.TOptional<Type.TString>;
  reason: Type.TOptional<Type.TString>;
}>;
/** Cancels currently streaming Talk output without necessarily ending the turn. */
declare const TalkSessionCancelOutputParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  turnId: Type.TOptional<Type.TString>;
  reason: Type.TOptional<Type.TString>;
}>;
/** Submits a tool result back to a Talk provider session. */
declare const TalkSessionSubmitToolResultParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  callId: Type.TString;
  result: Type.TUnknown;
  options: Type.TOptional<Type.TObject<{
    suppressResponse: Type.TOptional<Type.TBoolean>;
    willContinue: Type.TOptional<Type.TBoolean>;
  }>>;
}>;
/** Steers a managed Talk session by session id rather than transcript key. */
declare const TalkSessionSteerParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  text: Type.TString;
  mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"status">, Type.TLiteral<"steer">, Type.TLiteral<"cancel">, Type.TLiteral<"followup">]>>;
}>;
/** Closes a gateway-managed Talk session. */
declare const TalkSessionCloseParamsSchema: Type.TObject<{
  sessionId: Type.TString;
}>;
/** Empty request payload for reading configured Talk provider capabilities. */
declare const TalkCatalogParamsSchema: Type.TObject<{}>;
/** Provider, mode, transport, and audio-format catalog returned to clients. */
declare const TalkCatalogResultSchema: Type.TObject<{
  modes: Type.TArray<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>;
  transports: Type.TArray<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>;
  brains: Type.TArray<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>;
  speech: Type.TObject<{
    activeProvider: Type.TOptional<Type.TString>;
    providers: Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
      configured: Type.TBoolean;
      models: Type.TOptional<Type.TArray<Type.TString>>;
      voices: Type.TOptional<Type.TArray<Type.TString>>;
      defaultModel: Type.TOptional<Type.TString>;
      modes: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>>;
      transports: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>>;
      brains: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>>;
      inputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
        encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        sampleRateHz: Type.TInteger;
        channels: Type.TInteger;
      }>>>;
      outputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
        encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        sampleRateHz: Type.TInteger;
        channels: Type.TInteger;
      }>>>;
      supportsBrowserSession: Type.TOptional<Type.TBoolean>;
      supportsBargeIn: Type.TOptional<Type.TBoolean>;
      supportsToolCalls: Type.TOptional<Type.TBoolean>;
      supportsVideoFrames: Type.TOptional<Type.TBoolean>;
      supportsSessionResumption: Type.TOptional<Type.TBoolean>;
    }>>;
  }>;
  transcription: Type.TObject<{
    activeProvider: Type.TOptional<Type.TString>;
    providers: Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
      configured: Type.TBoolean;
      models: Type.TOptional<Type.TArray<Type.TString>>;
      voices: Type.TOptional<Type.TArray<Type.TString>>;
      defaultModel: Type.TOptional<Type.TString>;
      modes: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>>;
      transports: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>>;
      brains: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>>;
      inputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
        encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        sampleRateHz: Type.TInteger;
        channels: Type.TInteger;
      }>>>;
      outputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
        encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        sampleRateHz: Type.TInteger;
        channels: Type.TInteger;
      }>>>;
      supportsBrowserSession: Type.TOptional<Type.TBoolean>;
      supportsBargeIn: Type.TOptional<Type.TBoolean>;
      supportsToolCalls: Type.TOptional<Type.TBoolean>;
      supportsVideoFrames: Type.TOptional<Type.TBoolean>;
      supportsSessionResumption: Type.TOptional<Type.TBoolean>;
    }>>;
  }>;
  realtime: Type.TObject<{
    activeProvider: Type.TOptional<Type.TString>;
    providers: Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
      configured: Type.TBoolean;
      models: Type.TOptional<Type.TArray<Type.TString>>;
      voices: Type.TOptional<Type.TArray<Type.TString>>;
      defaultModel: Type.TOptional<Type.TString>;
      modes: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>>;
      transports: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>>;
      brains: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>>;
      inputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
        encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        sampleRateHz: Type.TInteger;
        channels: Type.TInteger;
      }>>>;
      outputAudioFormats: Type.TOptional<Type.TArray<Type.TObject<{
        encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        sampleRateHz: Type.TInteger;
        channels: Type.TInteger;
      }>>>;
      supportsBrowserSession: Type.TOptional<Type.TBoolean>;
      supportsBargeIn: Type.TOptional<Type.TBoolean>;
      supportsToolCalls: Type.TOptional<Type.TBoolean>;
      supportsVideoFrames: Type.TOptional<Type.TBoolean>;
      supportsSessionResumption: Type.TOptional<Type.TBoolean>;
    }>>;
  }>;
}>;
/** Session creation result with transport-specific ids and credentials. */
declare const TalkSessionCreateResultSchema: Type.TObject<{
  sessionId: Type.TString;
  provider: Type.TOptional<Type.TString>;
  mode: Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>;
  transport: Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>;
  brain: Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>;
  relaySessionId: Type.TOptional<Type.TString>;
  transcriptionSessionId: Type.TOptional<Type.TString>;
  handoffId: Type.TOptional<Type.TString>;
  roomId: Type.TOptional<Type.TString>;
  roomUrl: Type.TOptional<Type.TString>;
  token: Type.TOptional<Type.TString>;
  audio: Type.TOptional<Type.TUnknown>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  expiresAt: Type.TOptional<Type.TNumber>;
}>;
/** Result for a Talk turn request, optionally including emitted events. */
declare const TalkSessionTurnResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  turnId: Type.TOptional<Type.TString>;
  events: Type.TOptional<Type.TArray<Type.TObject<{
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
  }>>>;
}>;
/** Managed-room record returned to clients after joining an existing Talk session. */
declare const TalkSessionJoinResultSchema: Type.TObject<{
  id: Type.TString;
  roomId: Type.TString;
  roomUrl: Type.TString;
  sessionKey: Type.TString;
  sessionId: Type.TOptional<Type.TString>;
  channel: Type.TOptional<Type.TString>;
  target: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  mode: Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>;
  transport: Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>;
  brain: Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>;
  createdAt: Type.TNumber;
  expiresAt: Type.TNumber;
  room: Type.TObject<{
    activeClientId: Type.TOptional<Type.TString>;
    activeTurnId: Type.TOptional<Type.TString>;
    recentTalkEvents: Type.TArray<Type.TObject<{
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
    }>>;
  }>;
}>;
/** Generic success result for Talk session lifecycle calls. */
declare const TalkSessionOkResultSchema: Type.TObject<{
  ok: Type.TBoolean;
}>;
/** Union of all browser Talk session setup payloads. */
declare const TalkClientCreateResultSchema: Type.TUnion<[Type.TObject<{
  provider: Type.TString;
  transport: Type.TLiteral<"webrtc">;
  clientSecret: Type.TString;
  offerUrl: Type.TOptional<Type.TString>;
  offerHeaders: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  expiresAt: Type.TOptional<Type.TNumber>;
}>, Type.TObject<{
  provider: Type.TString;
  transport: Type.TLiteral<"provider-websocket">;
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
  roomUrl: Type.TString;
  token: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  expiresAt: Type.TOptional<Type.TNumber>;
}>]>;
/** Full Talk config read result, including related session/UI context. */
declare const TalkConfigResultSchema: Type.TObject<{
  config: Type.TObject<{
    talk: Type.TOptional<Type.TObject<{
      provider: Type.TOptional<Type.TString>;
      providers: Type.TOptional<Type.TRecord<"^.*$", Type.TObject<{
        apiKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TUnion<[Type.TObject<{
          source: Type.TLiteral<"env">;
          provider: Type.TString;
          id: Type.TString;
        }>, Type.TObject<{
          source: Type.TLiteral<"file">;
          provider: Type.TString;
          id: Type.TUnsafe<string>;
        }>, Type.TObject<{
          source: Type.TLiteral<"exec">;
          provider: Type.TString;
          id: Type.TString;
        }>]>]>>;
      }>>>;
      realtime: Type.TOptional<Type.TObject<{
        provider: Type.TOptional<Type.TString>;
        providers: Type.TOptional<Type.TRecord<"^.*$", Type.TObject<{
          apiKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TUnion<[Type.TObject<{
            source: Type.TLiteral<"env">;
            provider: Type.TString;
            id: Type.TString;
          }>, Type.TObject<{
            source: Type.TLiteral<"file">;
            provider: Type.TString;
            id: Type.TUnsafe<string>;
          }>, Type.TObject<{
            source: Type.TLiteral<"exec">;
            provider: Type.TString;
            id: Type.TString;
          }>]>]>>;
        }>>>;
        model: Type.TOptional<Type.TString>;
        speakerVoice: Type.TOptional<Type.TString>;
        speakerVoiceId: Type.TOptional<Type.TString>;
        voice: Type.TOptional<Type.TString>;
        instructions: Type.TOptional<Type.TString>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]>>;
        transport: Type.TOptional<Type.TUnion<[Type.TLiteral<"webrtc">, Type.TLiteral<"provider-websocket">, Type.TLiteral<"gateway-relay">, Type.TLiteral<"managed-room">]>>;
        brain: Type.TOptional<Type.TUnion<[Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]>>;
      }>>;
      resolved: Type.TOptional<Type.TObject<{
        provider: Type.TString;
        config: Type.TObject<{
          apiKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TUnion<[Type.TObject<{
            source: Type.TLiteral<"env">;
            provider: Type.TString;
            id: Type.TString;
          }>, Type.TObject<{
            source: Type.TLiteral<"file">;
            provider: Type.TString;
            id: Type.TUnsafe<string>;
          }>, Type.TObject<{
            source: Type.TLiteral<"exec">;
            provider: Type.TString;
            id: Type.TString;
          }>]>]>>;
        }>;
      }>>;
      consultThinkingLevel: Type.TOptional<Type.TString>;
      consultFastMode: Type.TOptional<Type.TBoolean>;
      speechLocale: Type.TOptional<Type.TString>;
      interruptOnSpeech: Type.TOptional<Type.TBoolean>;
      silenceTimeoutMs: Type.TOptional<Type.TInteger>;
    }>>;
    session: Type.TOptional<Type.TObject<{
      mainKey: Type.TOptional<Type.TString>;
    }>>;
    ui: Type.TOptional<Type.TObject<{
      seamColor: Type.TOptional<Type.TString>;
    }>>;
  }>;
}>;
/** Text-to-speech result with encoded audio and provider output metadata. */
declare const TalkSpeakResultSchema: Type.TObject<{
  audioBase64: Type.TString;
  provider: Type.TString;
  outputFormat: Type.TOptional<Type.TString>;
  voiceCompatible: Type.TOptional<Type.TBoolean>;
  mimeType: Type.TOptional<Type.TString>;
  fileExtension: Type.TOptional<Type.TString>;
}>;
/** Channel status request, optionally probing one channel before returning. */
declare const ChannelsStatusParamsSchema: Type.TObject<{
  probe: Type.TOptional<Type.TBoolean>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  channel: Type.TOptional<Type.TString>;
}>;
/** Full channel status result for dashboard and operator diagnostics. */
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
    lastConnectedAt: Type.TOptional<Type.TInteger>;
    lastError: Type.TOptional<Type.TString>;
    healthState: Type.TOptional<Type.TString>;
    lastStartAt: Type.TOptional<Type.TInteger>;
    lastStopAt: Type.TOptional<Type.TInteger>;
    lastInboundAt: Type.TOptional<Type.TInteger>;
    lastOutboundAt: Type.TOptional<Type.TInteger>;
    lastTransportActivityAt: Type.TOptional<Type.TInteger>;
    busy: Type.TOptional<Type.TBoolean>;
    activeRuns: Type.TOptional<Type.TInteger>;
    lastRunActivityAt: Type.TOptional<Type.TInteger>;
    lastProbeAt: Type.TOptional<Type.TInteger>;
    mode: Type.TOptional<Type.TString>;
    dmPolicy: Type.TOptional<Type.TString>;
    allowFrom: Type.TOptional<Type.TArray<Type.TString>>;
    tokenSource: Type.TOptional<Type.TString>;
    botTokenSource: Type.TOptional<Type.TString>;
    appTokenSource: Type.TOptional<Type.TString>;
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
    reasons: Type.TArray<Type.TUnion<[Type.TLiteral<"event_loop_delay">, Type.TLiteral<"event_loop_utilization">, Type.TLiteral<"cpu">]>>;
    intervalMs: Type.TInteger;
    delayP99Ms: Type.TNumber;
    delayMaxMs: Type.TNumber;
    utilization: Type.TNumber;
    cpuCoreRatio: Type.TNumber;
  }>>;
  partial: Type.TOptional<Type.TBoolean>;
  warnings: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Logs out one channel account. */
declare const ChannelsLogoutParamsSchema: Type.TObject<{
  channel: Type.TString;
  accountId: Type.TOptional<Type.TString>;
}>;
/** Stops one channel account runtime. */
declare const ChannelsStopParamsSchema: Type.TObject<{
  channel: Type.TString;
  accountId: Type.TOptional<Type.TString>;
}>;
/** Starts one channel account runtime. */
declare const ChannelsStartParamsSchema: Type.TObject<{
  channel: Type.TString;
  accountId: Type.TOptional<Type.TString>;
}>;
/** Starts browser/web login for a channel account. */
declare const WebLoginStartParamsSchema: Type.TObject<{
  force: Type.TOptional<Type.TBoolean>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  verbose: Type.TOptional<Type.TBoolean>;
  accountId: Type.TOptional<Type.TString>;
}>;
/** Waits for web login completion or the next QR code. */
declare const WebLoginWaitParamsSchema: Type.TObject<{
  timeoutMs: Type.TOptional<Type.TInteger>;
  accountId: Type.TOptional<Type.TString>;
  currentQrDataUrl: Type.TOptional<Type.TString>;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/commands.d.ts
/** Command catalog request filters. */
declare const CommandsListParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  scope: Type.TOptional<Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"native">, Type.TLiteral<"both">]>>;
  includeArgs: Type.TOptional<Type.TBoolean>;
}>;
/** Bounded command catalog response. */
declare const CommandsListResultSchema: Type.TObject<{
  commands: Type.TArray<Type.TObject<{
    name: Type.TString;
    nativeName: Type.TOptional<Type.TString>;
    textAliases: Type.TOptional<Type.TArray<Type.TString>>;
    description: Type.TString;
    category: Type.TOptional<Type.TUnion<[Type.TLiteral<"session">, Type.TLiteral<"options">, Type.TLiteral<"status">, Type.TLiteral<"management">, Type.TLiteral<"media">, Type.TLiteral<"tools">, Type.TLiteral<"docks">]>>;
    source: Type.TUnion<[Type.TLiteral<"native">, Type.TLiteral<"skill">, Type.TLiteral<"plugin">]>;
    scope: Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"native">, Type.TLiteral<"both">]>;
    acceptsArgs: Type.TBoolean;
    args: Type.TOptional<Type.TArray<Type.TObject<{
      name: Type.TString;
      description: Type.TString;
      type: Type.TUnion<[Type.TLiteral<"string">, Type.TLiteral<"number">, Type.TLiteral<"boolean">]>;
      required: Type.TOptional<Type.TBoolean>;
      choices: Type.TOptional<Type.TArray<Type.TObject<{
        value: Type.TString;
        label: Type.TString;
      }>>>;
      dynamic: Type.TOptional<Type.TBoolean>;
    }>>>;
  }>>;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/config.d.ts
/** Empty request payload for reading the current raw config. */
declare const ConfigGetParamsSchema: Type.TObject<{}>;
/** Full raw config replacement request with optional base hash guard. */
declare const ConfigSetParamsSchema: Type.TObject<{
  raw: Type.TString;
  baseHash: Type.TOptional<Type.TString>;
}>;
/** Raw config apply request that may schedule a restart. */
declare const ConfigApplyParamsSchema: Type.TObject<{
  readonly raw: Type.TString;
  readonly baseHash: Type.TOptional<Type.TString>;
  readonly sessionKey: Type.TOptional<Type.TString>;
  readonly deliveryContext: Type.TOptional<Type.TObject<{
    channel: Type.TOptional<Type.TString>;
    to: Type.TOptional<Type.TString>;
    accountId: Type.TOptional<Type.TString>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
  }>>;
  readonly note: Type.TOptional<Type.TString>;
  readonly restartDelayMs: Type.TOptional<Type.TInteger>;
}>;
/** Raw config patch request that may schedule a restart. */
declare const ConfigPatchParamsSchema: Type.TObject<{
  replacePaths: Type.TOptional<Type.TArray<Type.TString>>;
  raw: Type.TString;
  baseHash: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  deliveryContext: Type.TOptional<Type.TObject<{
    channel: Type.TOptional<Type.TString>;
    to: Type.TOptional<Type.TString>;
    accountId: Type.TOptional<Type.TString>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
  }>>;
  note: Type.TOptional<Type.TString>;
  restartDelayMs: Type.TOptional<Type.TInteger>;
}>;
/** Empty request payload for fetching the generated config schema. */
declare const ConfigSchemaParamsSchema: Type.TObject<{}>;
/** Schema lookup request for one config path. */
declare const ConfigSchemaLookupParamsSchema: Type.TObject<{
  path: Type.TString;
}>;
/** Empty request payload for checking update/restart status. */
declare const UpdateStatusParamsSchema: Type.TObject<{}>;
/** Request payload for running an update/restart flow with optional channel delivery context. */
declare const UpdateRunParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  deliveryContext: Type.TOptional<Type.TObject<{
    channel: Type.TOptional<Type.TString>;
    to: Type.TOptional<Type.TString>;
    accountId: Type.TOptional<Type.TString>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
  }>>;
  note: Type.TOptional<Type.TString>;
  continuationMessage: Type.TOptional<Type.TString>;
  restartDelayMs: Type.TOptional<Type.TInteger>;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>;
/** Full generated config schema response. */
declare const ConfigSchemaResponseSchema: Type.TObject<{
  schema: Type.TUnknown;
  uiHints: Type.TRecord<"^.*$", Type.TObject<{
    label: Type.TOptional<Type.TString>;
    help: Type.TOptional<Type.TString>;
    tags: Type.TOptional<Type.TArray<Type.TString>>;
    group: Type.TOptional<Type.TString>;
    order: Type.TOptional<Type.TInteger>;
    advanced: Type.TOptional<Type.TBoolean>;
    sensitive: Type.TOptional<Type.TBoolean>;
    placeholder: Type.TOptional<Type.TString>;
    itemTemplate: Type.TOptional<Type.TUnknown>;
  }>>;
  version: Type.TString;
  generatedAt: Type.TString;
}>;
/** Schema lookup response for one config path and its immediate children. */
declare const ConfigSchemaLookupResultSchema: Type.TObject<{
  path: Type.TString;
  schema: Type.TUnknown;
  reloadKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"restart">, Type.TLiteral<"hot">, Type.TLiteral<"none">]>>;
  hint: Type.TOptional<Type.TObject<{
    label: Type.TOptional<Type.TString>;
    help: Type.TOptional<Type.TString>;
    tags: Type.TOptional<Type.TArray<Type.TString>>;
    group: Type.TOptional<Type.TString>;
    order: Type.TOptional<Type.TInteger>;
    advanced: Type.TOptional<Type.TBoolean>;
    sensitive: Type.TOptional<Type.TBoolean>;
    placeholder: Type.TOptional<Type.TString>;
    itemTemplate: Type.TOptional<Type.TUnknown>;
  }>>;
  hintPath: Type.TOptional<Type.TString>;
  children: Type.TArray<Type.TObject<{
    key: Type.TString;
    path: Type.TString;
    type: Type.TOptional<Type.TUnion<[Type.TString, Type.TArray<Type.TString>]>>;
    required: Type.TBoolean;
    hasChildren: Type.TBoolean;
    reloadKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"restart">, Type.TLiteral<"hot">, Type.TLiteral<"none">]>>;
    hint: Type.TOptional<Type.TObject<{
      label: Type.TOptional<Type.TString>;
      help: Type.TOptional<Type.TString>;
      tags: Type.TOptional<Type.TArray<Type.TString>>;
      group: Type.TOptional<Type.TString>;
      order: Type.TOptional<Type.TInteger>;
      advanced: Type.TOptional<Type.TBoolean>;
      sensitive: Type.TOptional<Type.TBoolean>;
      placeholder: Type.TOptional<Type.TString>;
      itemTemplate: Type.TOptional<Type.TUnknown>;
    }>>;
    hintPath: Type.TOptional<Type.TString>;
  }>>;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/cron.d.ts
/** Persisted cron job definition returned by scheduler list/get APIs. */
declare const CronJobSchema: Type.TObject<{
  id: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  name: Type.TString;
  description: Type.TOptional<Type.TString>;
  enabled: Type.TBoolean;
  deleteAfterRun: Type.TOptional<Type.TBoolean>;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger;
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
  }>]>;
  sessionTarget: Type.TUnion<[Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]>;
  wakeMode: Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>;
  payload: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"systemEvent">;
    text: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"agentTurn">;
    message: Type.TSchema;
    model: Type.TOptional<Type.TSchema>;
    fallbacks: Type.TOptional<Type.TSchema>;
    thinking: Type.TOptional<Type.TString>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
    lightContext: Type.TOptional<Type.TBoolean>;
    toolsAllow: Type.TOptional<Type.TSchema>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"command">;
    argv: Type.TSchema;
    cwd: Type.TOptional<Type.TString>;
    env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    input: Type.TOptional<Type.TString>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
    outputMaxBytes: Type.TOptional<Type.TInteger>;
  }>]>;
  delivery: Type.TOptional<Type.TUnion<[Type.TObject<{
    to: Type.TOptional<Type.TString>;
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
  }>, Type.TObject<{
    completionDestination: Type.TOptional<Type.TObject<{
      mode: Type.TLiteral<"webhook">;
      to: Type.TString;
    }>>;
    to: Type.TOptional<Type.TString>;
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
  }>, Type.TObject<{
    to: Type.TString;
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
    nextRunAtMs: Type.TOptional<Type.TInteger>;
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
    lastErrorReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
    lastDurationMs: Type.TOptional<Type.TInteger>;
    consecutiveErrors: Type.TOptional<Type.TInteger>;
    consecutiveSkipped: Type.TOptional<Type.TInteger>;
    lastDelivered: Type.TOptional<Type.TBoolean>;
    lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    lastDeliveryError: Type.TOptional<Type.TString>;
    lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
    lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
    lastFailureAlertAtMs: Type.TOptional<Type.TInteger>;
  }>;
}>;
/** Query params for listing cron jobs with filters and pagination. */
declare const CronListParamsSchema: Type.TObject<{
  includeDisabled: Type.TOptional<Type.TBoolean>;
  limit: Type.TOptional<Type.TInteger>;
  offset: Type.TOptional<Type.TInteger>;
  query: Type.TOptional<Type.TString>;
  enabled: Type.TOptional<Type.TUnion<[Type.TLiteral<"all">, Type.TLiteral<"enabled">, Type.TLiteral<"disabled">]>>;
  scheduleKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"all">, Type.TLiteral<"at">, Type.TLiteral<"every">, Type.TLiteral<"cron">]>>;
  lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"all">, Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">, Type.TLiteral<"unknown">]>>;
  sortBy: Type.TOptional<Type.TUnion<[Type.TLiteral<"nextRunAtMs">, Type.TLiteral<"updatedAtMs">, Type.TLiteral<"name">]>>;
  sortDir: Type.TOptional<Type.TUnion<[Type.TLiteral<"asc">, Type.TLiteral<"desc">]>>;
  agentId: Type.TOptional<Type.TString>;
  compact: Type.TOptional<Type.TBoolean>;
}>;
/** Empty request payload for scheduler status. */
declare const CronStatusParamsSchema: Type.TObject<{}>;
/** Looks up a job by stable id or legacy jobId alias. */
declare const CronGetParamsSchema: Type.TUnion<[Type.TObject<{
  id: Type.TString;
}>, Type.TObject<{
  jobId: Type.TString;
}>]>;
/** Creates a scheduled job with schedule, target, payload, and delivery policy. */
declare const CronAddParamsSchema: Type.TObject<{
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
  }>]>;
  sessionTarget: Type.TUnion<[Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]>;
  wakeMode: Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>;
  payload: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"systemEvent">;
    text: Type.TString;
  }>, Type.TObject<{
    kind: Type.TLiteral<"agentTurn">;
    message: Type.TSchema;
    model: Type.TOptional<Type.TSchema>;
    fallbacks: Type.TOptional<Type.TSchema>;
    thinking: Type.TOptional<Type.TString>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
    lightContext: Type.TOptional<Type.TBoolean>;
    toolsAllow: Type.TOptional<Type.TSchema>;
  }>, Type.TObject<{
    kind: Type.TLiteral<"command">;
    argv: Type.TSchema;
    cwd: Type.TOptional<Type.TString>;
    env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    input: Type.TOptional<Type.TString>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
    outputMaxBytes: Type.TOptional<Type.TInteger>;
  }>]>;
  delivery: Type.TOptional<Type.TUnion<[Type.TObject<{
    to: Type.TOptional<Type.TString>;
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
  }>, Type.TObject<{
    completionDestination: Type.TOptional<Type.TObject<{
      mode: Type.TLiteral<"webhook">;
      to: Type.TString;
    }>>;
    to: Type.TOptional<Type.TString>;
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
  }>, Type.TObject<{
    to: Type.TString;
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
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  sessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  description: Type.TOptional<Type.TString>;
  enabled: Type.TOptional<Type.TBoolean>;
  deleteAfterRun: Type.TOptional<Type.TBoolean>;
  name: Type.TString;
}>;
/** Updates a cron job by id or legacy jobId alias. */
declare const CronUpdateParamsSchema: Type.TUnion<[Type.TObject<{
  id: Type.TString;
}>, Type.TObject<{
  jobId: Type.TString;
}>]>;
/** Removes a cron job by id or legacy jobId alias. */
declare const CronRemoveParamsSchema: Type.TUnion<[Type.TObject<{
  id: Type.TString;
}>, Type.TObject<{
  jobId: Type.TString;
}>]>;
/** Runs a cron job immediately or only if due. */
declare const CronRunParamsSchema: Type.TUnion<[Type.TObject<{
  id: Type.TString;
}>, Type.TObject<{
  jobId: Type.TString;
}>]>;
/** Query params for cron run history. */
declare const CronRunsParamsSchema: Type.TObject<{
  scope: Type.TOptional<Type.TUnion<[Type.TLiteral<"job">, Type.TLiteral<"all">]>>;
  id: Type.TOptional<Type.TString>;
  jobId: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
  offset: Type.TOptional<Type.TInteger>;
  statuses: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>>;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"all">, Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
  deliveryStatuses: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>>;
  deliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
  query: Type.TOptional<Type.TString>;
  sortDir: Type.TOptional<Type.TUnion<[Type.TLiteral<"asc">, Type.TLiteral<"desc">]>>;
}>;
//#endregion
//#region packages/gateway-protocol/src/version.d.ts
/** Current gateway protocol version emitted by modern clients and servers. */
declare const PROTOCOL_VERSION: 4;
/** Lowest client protocol version accepted by the gateway. */
declare const MIN_CLIENT_PROTOCOL_VERSION: 4;
/** Lowest lightweight probe protocol version accepted by the gateway. */
declare const MIN_PROBE_PROTOCOL_VERSION: 4;
//#endregion
//#region packages/gateway-protocol/src/schema/protocol-schemas.d.ts
/** Public schema registry keyed by stable protocol schema name. */
declare const ProtocolSchemas: {
  ConnectParams: import("typebox").TObject<{
    minProtocol: import("typebox").TInteger;
    maxProtocol: import("typebox").TInteger;
    client: import("typebox").TObject<{
      id: import("typebox").TEnum<["webchat-ui", "openclaw-control-ui", "openclaw-tui", "webchat", "cli", "gateway-client", "openclaw-macos", "openclaw-ios", "openclaw-android", "node-host", "test", "fingerprint", "openclaw-probe"]>;
      displayName: import("typebox").TOptional<import("typebox").TString>;
      version: import("typebox").TString;
      platform: import("typebox").TString;
      deviceFamily: import("typebox").TOptional<import("typebox").TString>;
      modelIdentifier: import("typebox").TOptional<import("typebox").TString>;
      mode: import("typebox").TEnum<["webchat", "cli", "test", "probe", "ui", "backend", "node"]>;
      instanceId: import("typebox").TOptional<import("typebox").TString>;
    }>;
    caps: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    commands: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    permissions: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TBoolean>>;
    pathEnv: import("typebox").TOptional<import("typebox").TString>;
    role: import("typebox").TOptional<import("typebox").TString>;
    scopes: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    device: import("typebox").TOptional<import("typebox").TObject<{
      id: import("typebox").TString;
      publicKey: import("typebox").TString;
      signature: import("typebox").TString;
      signedAt: import("typebox").TInteger;
      nonce: import("typebox").TString;
    }>>;
    auth: import("typebox").TOptional<import("typebox").TObject<{
      token: import("typebox").TOptional<import("typebox").TString>;
      bootstrapToken: import("typebox").TOptional<import("typebox").TString>;
      deviceToken: import("typebox").TOptional<import("typebox").TString>;
      password: import("typebox").TOptional<import("typebox").TString>;
      approvalRuntimeToken: import("typebox").TOptional<import("typebox").TString>;
    }>>;
    locale: import("typebox").TOptional<import("typebox").TString>;
    userAgent: import("typebox").TOptional<import("typebox").TString>;
  }>;
  HelloOk: import("typebox").TObject<{
    type: import("typebox").TLiteral<"hello-ok">;
    protocol: import("typebox").TInteger;
    server: import("typebox").TObject<{
      version: import("typebox").TString;
      connId: import("typebox").TString;
    }>;
    features: import("typebox").TObject<{
      methods: import("typebox").TArray<import("typebox").TString>;
      events: import("typebox").TArray<import("typebox").TString>;
    }>;
    snapshot: import("typebox").TObject<{
      presence: import("typebox").TArray<import("typebox").TObject<{
        host: import("typebox").TOptional<import("typebox").TString>;
        ip: import("typebox").TOptional<import("typebox").TString>;
        version: import("typebox").TOptional<import("typebox").TString>;
        platform: import("typebox").TOptional<import("typebox").TString>;
        deviceFamily: import("typebox").TOptional<import("typebox").TString>;
        modelIdentifier: import("typebox").TOptional<import("typebox").TString>;
        mode: import("typebox").TOptional<import("typebox").TString>;
        lastInputSeconds: import("typebox").TOptional<import("typebox").TInteger>;
        reason: import("typebox").TOptional<import("typebox").TString>;
        tags: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
        text: import("typebox").TOptional<import("typebox").TString>;
        ts: import("typebox").TInteger;
        deviceId: import("typebox").TOptional<import("typebox").TString>;
        roles: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
        scopes: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
        instanceId: import("typebox").TOptional<import("typebox").TString>;
      }>>;
      health: import("typebox").TAny;
      stateVersion: import("typebox").TObject<{
        presence: import("typebox").TInteger;
        health: import("typebox").TInteger;
      }>;
      uptimeMs: import("typebox").TInteger;
      configPath: import("typebox").TOptional<import("typebox").TString>;
      stateDir: import("typebox").TOptional<import("typebox").TString>;
      sessionDefaults: import("typebox").TOptional<import("typebox").TObject<{
        defaultAgentId: import("typebox").TString;
        mainKey: import("typebox").TString;
        mainSessionKey: import("typebox").TString;
        scope: import("typebox").TOptional<import("typebox").TString>;
      }>>;
      authMode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"none">, import("typebox").TLiteral<"token">, import("typebox").TLiteral<"password">, import("typebox").TLiteral<"trusted-proxy">]>>;
      updateAvailable: import("typebox").TOptional<import("typebox").TObject<{
        currentVersion: import("typebox").TString;
        latestVersion: import("typebox").TString;
        channel: import("typebox").TString;
      }>>;
    }>;
    pluginSurfaceUrls: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TString>>;
    auth: import("typebox").TObject<{
      deviceToken: import("typebox").TOptional<import("typebox").TString>;
      role: import("typebox").TString;
      scopes: import("typebox").TArray<import("typebox").TString>;
      issuedAtMs: import("typebox").TOptional<import("typebox").TInteger>;
      deviceTokens: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
        deviceToken: import("typebox").TString;
        role: import("typebox").TString;
        scopes: import("typebox").TArray<import("typebox").TString>;
        issuedAtMs: import("typebox").TInteger;
      }>>>;
    }>;
    policy: import("typebox").TObject<{
      maxPayload: import("typebox").TInteger;
      maxBufferedBytes: import("typebox").TInteger;
      tickIntervalMs: import("typebox").TInteger;
    }>;
  }>;
  RequestFrame: import("typebox").TObject<{
    type: import("typebox").TLiteral<"req">;
    id: import("typebox").TString;
    method: import("typebox").TString;
    params: import("typebox").TOptional<import("typebox").TUnknown>;
  }>;
  ResponseFrame: import("typebox").TObject<{
    type: import("typebox").TLiteral<"res">;
    id: import("typebox").TString;
    ok: import("typebox").TBoolean;
    payload: import("typebox").TOptional<import("typebox").TUnknown>;
    error: import("typebox").TOptional<import("typebox").TObject<{
      code: import("typebox").TString;
      message: import("typebox").TString;
      details: import("typebox").TOptional<import("typebox").TUnknown>;
      retryable: import("typebox").TOptional<import("typebox").TBoolean>;
      retryAfterMs: import("typebox").TOptional<import("typebox").TInteger>;
    }>>;
  }>;
  EventFrame: import("typebox").TObject<{
    type: import("typebox").TLiteral<"event">;
    event: import("typebox").TString;
    payload: import("typebox").TOptional<import("typebox").TUnknown>;
    seq: import("typebox").TOptional<import("typebox").TInteger>;
    stateVersion: import("typebox").TOptional<import("typebox").TObject<{
      presence: import("typebox").TInteger;
      health: import("typebox").TInteger;
    }>>;
  }>;
  GatewayFrame: import("typebox").TUnion<[import("typebox").TObject<{
    type: import("typebox").TLiteral<"req">;
    id: import("typebox").TString;
    method: import("typebox").TString;
    params: import("typebox").TOptional<import("typebox").TUnknown>;
  }>, import("typebox").TObject<{
    type: import("typebox").TLiteral<"res">;
    id: import("typebox").TString;
    ok: import("typebox").TBoolean;
    payload: import("typebox").TOptional<import("typebox").TUnknown>;
    error: import("typebox").TOptional<import("typebox").TObject<{
      code: import("typebox").TString;
      message: import("typebox").TString;
      details: import("typebox").TOptional<import("typebox").TUnknown>;
      retryable: import("typebox").TOptional<import("typebox").TBoolean>;
      retryAfterMs: import("typebox").TOptional<import("typebox").TInteger>;
    }>>;
  }>, import("typebox").TObject<{
    type: import("typebox").TLiteral<"event">;
    event: import("typebox").TString;
    payload: import("typebox").TOptional<import("typebox").TUnknown>;
    seq: import("typebox").TOptional<import("typebox").TInteger>;
    stateVersion: import("typebox").TOptional<import("typebox").TObject<{
      presence: import("typebox").TInteger;
      health: import("typebox").TInteger;
    }>>;
  }>]>;
  PresenceEntry: import("typebox").TObject<{
    host: import("typebox").TOptional<import("typebox").TString>;
    ip: import("typebox").TOptional<import("typebox").TString>;
    version: import("typebox").TOptional<import("typebox").TString>;
    platform: import("typebox").TOptional<import("typebox").TString>;
    deviceFamily: import("typebox").TOptional<import("typebox").TString>;
    modelIdentifier: import("typebox").TOptional<import("typebox").TString>;
    mode: import("typebox").TOptional<import("typebox").TString>;
    lastInputSeconds: import("typebox").TOptional<import("typebox").TInteger>;
    reason: import("typebox").TOptional<import("typebox").TString>;
    tags: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    text: import("typebox").TOptional<import("typebox").TString>;
    ts: import("typebox").TInteger;
    deviceId: import("typebox").TOptional<import("typebox").TString>;
    roles: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    scopes: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    instanceId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  StateVersion: import("typebox").TObject<{
    presence: import("typebox").TInteger;
    health: import("typebox").TInteger;
  }>;
  Snapshot: import("typebox").TObject<{
    presence: import("typebox").TArray<import("typebox").TObject<{
      host: import("typebox").TOptional<import("typebox").TString>;
      ip: import("typebox").TOptional<import("typebox").TString>;
      version: import("typebox").TOptional<import("typebox").TString>;
      platform: import("typebox").TOptional<import("typebox").TString>;
      deviceFamily: import("typebox").TOptional<import("typebox").TString>;
      modelIdentifier: import("typebox").TOptional<import("typebox").TString>;
      mode: import("typebox").TOptional<import("typebox").TString>;
      lastInputSeconds: import("typebox").TOptional<import("typebox").TInteger>;
      reason: import("typebox").TOptional<import("typebox").TString>;
      tags: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
      text: import("typebox").TOptional<import("typebox").TString>;
      ts: import("typebox").TInteger;
      deviceId: import("typebox").TOptional<import("typebox").TString>;
      roles: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
      scopes: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
      instanceId: import("typebox").TOptional<import("typebox").TString>;
    }>>;
    health: import("typebox").TAny;
    stateVersion: import("typebox").TObject<{
      presence: import("typebox").TInteger;
      health: import("typebox").TInteger;
    }>;
    uptimeMs: import("typebox").TInteger;
    configPath: import("typebox").TOptional<import("typebox").TString>;
    stateDir: import("typebox").TOptional<import("typebox").TString>;
    sessionDefaults: import("typebox").TOptional<import("typebox").TObject<{
      defaultAgentId: import("typebox").TString;
      mainKey: import("typebox").TString;
      mainSessionKey: import("typebox").TString;
      scope: import("typebox").TOptional<import("typebox").TString>;
    }>>;
    authMode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"none">, import("typebox").TLiteral<"token">, import("typebox").TLiteral<"password">, import("typebox").TLiteral<"trusted-proxy">]>>;
    updateAvailable: import("typebox").TOptional<import("typebox").TObject<{
      currentVersion: import("typebox").TString;
      latestVersion: import("typebox").TString;
      channel: import("typebox").TString;
    }>>;
  }>;
  ErrorShape: import("typebox").TObject<{
    code: import("typebox").TString;
    message: import("typebox").TString;
    details: import("typebox").TOptional<import("typebox").TUnknown>;
    retryable: import("typebox").TOptional<import("typebox").TBoolean>;
    retryAfterMs: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
  EnvironmentStatus: import("typebox").TString;
  EnvironmentSummary: import("typebox").TObject<{
    id: import("typebox").TString;
    type: import("typebox").TString;
    label: import("typebox").TOptional<import("typebox").TString>;
    status: import("typebox").TString;
    capabilities: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
  }>;
  EnvironmentsListParams: import("typebox").TObject<{}>;
  EnvironmentsListResult: import("typebox").TObject<{
    environments: import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TString;
      type: import("typebox").TString;
      label: import("typebox").TOptional<import("typebox").TString>;
      status: import("typebox").TString;
      capabilities: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    }>>;
  }>;
  EnvironmentsStatusParams: import("typebox").TObject<{
    environmentId: import("typebox").TString;
  }>;
  EnvironmentsStatusResult: import("typebox").TObject<{
    id: import("typebox").TString;
    type: import("typebox").TString;
    label: import("typebox").TOptional<import("typebox").TString>;
    status: import("typebox").TString;
    capabilities: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
  }>;
  AgentEvent: import("typebox").TObject<{
    runId: import("typebox").TString;
    seq: import("typebox").TInteger;
    stream: import("typebox").TString;
    ts: import("typebox").TInteger;
    spawnedBy: import("typebox").TOptional<import("typebox").TString>;
    isHeartbeat: import("typebox").TOptional<import("typebox").TBoolean>;
    data: import("typebox").TRecord<"^.*$", import("typebox").TUnknown>;
  }>;
  MessageActionParams: import("typebox").TObject<{
    channel: import("typebox").TString;
    action: import("typebox").TString;
    params: import("typebox").TRecord<"^.*$", import("typebox").TUnknown>;
    accountId: import("typebox").TOptional<import("typebox").TString>;
    requesterAccountId: import("typebox").TOptional<import("typebox").TString>;
    requesterSenderId: import("typebox").TOptional<import("typebox").TString>;
    senderIsOwner: import("typebox").TOptional<import("typebox").TBoolean>;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    sessionId: import("typebox").TOptional<import("typebox").TString>;
    inboundTurnKind: import("typebox").TOptional<import("typebox").TString>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    toolContext: import("typebox").TOptional<import("typebox").TObject<{
      currentChannelId: import("typebox").TOptional<import("typebox").TString>;
      currentMessagingTarget: import("typebox").TOptional<import("typebox").TString>;
      currentGraphChannelId: import("typebox").TOptional<import("typebox").TString>;
      currentChannelProvider: import("typebox").TOptional<import("typebox").TString>;
      currentThreadTs: import("typebox").TOptional<import("typebox").TString>;
      currentMessageId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNumber]>>;
      replyToMode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"off">, import("typebox").TLiteral<"first">, import("typebox").TLiteral<"all">, import("typebox").TLiteral<"batched">]>>;
      hasRepliedRef: import("typebox").TOptional<import("typebox").TObject<{
        value: import("typebox").TBoolean;
      }>>;
      sameChannelThreadRequired: import("typebox").TOptional<import("typebox").TBoolean>;
      skipCrossContextDecoration: import("typebox").TOptional<import("typebox").TBoolean>;
    }>>;
    idempotencyKey: import("typebox").TString;
  }>;
  SendParams: import("typebox").TObject<{
    to: import("typebox").TString;
    message: import("typebox").TOptional<import("typebox").TString>;
    mediaUrl: import("typebox").TOptional<import("typebox").TString>;
    mediaUrls: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    buffer: import("typebox").TOptional<import("typebox").TString>;
    filename: import("typebox").TOptional<import("typebox").TString>;
    contentType: import("typebox").TOptional<import("typebox").TString>;
    asVoice: import("typebox").TOptional<import("typebox").TBoolean>;
    gifPlayback: import("typebox").TOptional<import("typebox").TBoolean>;
    channel: import("typebox").TOptional<import("typebox").TString>;
    accountId: import("typebox").TOptional<import("typebox").TString>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    replyToId: import("typebox").TOptional<import("typebox").TString>;
    threadId: import("typebox").TOptional<import("typebox").TString>;
    forceDocument: import("typebox").TOptional<import("typebox").TBoolean>;
    silent: import("typebox").TOptional<import("typebox").TBoolean>;
    parseMode: import("typebox").TOptional<import("typebox").TLiteral<"HTML">>;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    idempotencyKey: import("typebox").TString;
  }>;
  PollParams: import("typebox").TObject<{
    to: import("typebox").TString;
    question: import("typebox").TString;
    options: import("typebox").TArray<import("typebox").TString>;
    maxSelections: import("typebox").TOptional<import("typebox").TInteger>;
    durationSeconds: import("typebox").TOptional<import("typebox").TInteger>;
    durationHours: import("typebox").TOptional<import("typebox").TInteger>;
    silent: import("typebox").TOptional<import("typebox").TBoolean>;
    isAnonymous: import("typebox").TOptional<import("typebox").TBoolean>;
    threadId: import("typebox").TOptional<import("typebox").TString>;
    channel: import("typebox").TOptional<import("typebox").TString>;
    accountId: import("typebox").TOptional<import("typebox").TString>;
    idempotencyKey: import("typebox").TString;
  }>;
  AgentParams: import("typebox").TObject<{
    message: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    provider: import("typebox").TOptional<import("typebox").TString>;
    model: import("typebox").TOptional<import("typebox").TString>;
    to: import("typebox").TOptional<import("typebox").TString>;
    replyTo: import("typebox").TOptional<import("typebox").TString>;
    sessionId: import("typebox").TOptional<import("typebox").TString>;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    thinking: import("typebox").TOptional<import("typebox").TString>;
    deliver: import("typebox").TOptional<import("typebox").TBoolean>;
    attachments: import("typebox").TOptional<import("typebox").TArray<import("typebox").TUnknown>>;
    channel: import("typebox").TOptional<import("typebox").TString>;
    replyChannel: import("typebox").TOptional<import("typebox").TString>;
    accountId: import("typebox").TOptional<import("typebox").TString>;
    replyAccountId: import("typebox").TOptional<import("typebox").TString>;
    threadId: import("typebox").TOptional<import("typebox").TString>;
    groupId: import("typebox").TOptional<import("typebox").TString>;
    groupChannel: import("typebox").TOptional<import("typebox").TString>;
    groupSpace: import("typebox").TOptional<import("typebox").TString>;
    timeout: import("typebox").TOptional<import("typebox").TInteger>;
    bestEffortDeliver: import("typebox").TOptional<import("typebox").TBoolean>;
    lane: import("typebox").TOptional<import("typebox").TString>;
    cleanupBundleMcpOnRunEnd: import("typebox").TOptional<import("typebox").TBoolean>;
    modelRun: import("typebox").TOptional<import("typebox").TBoolean>;
    promptMode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"full">, import("typebox").TLiteral<"minimal">, import("typebox").TLiteral<"none">]>>;
    extraSystemPrompt: import("typebox").TOptional<import("typebox").TString>;
    bootstrapContextMode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"full">, import("typebox").TLiteral<"lightweight">]>>;
    bootstrapContextRunKind: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"default">, import("typebox").TLiteral<"heartbeat">, import("typebox").TLiteral<"cron">]>>;
    acpTurnSource: import("typebox").TOptional<import("typebox").TLiteral<"manual_spawn">>;
    internalRuntimeHandoffId: import("typebox").TOptional<import("typebox").TString>;
    execApprovalFollowupExpectedSessionId: import("typebox").TOptional<import("typebox").TString>;
    internalEvents: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
      type: import("typebox").TLiteral<"task_completion">;
      source: import("typebox").TString;
      childSessionKey: import("typebox").TString;
      childSessionId: import("typebox").TOptional<import("typebox").TString>;
      announceType: import("typebox").TString;
      taskLabel: import("typebox").TString;
      status: import("typebox").TString;
      statusLabel: import("typebox").TString;
      result: import("typebox").TString;
      attachments: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
        type: import("typebox").TOptional<import("typebox").TString>;
        path: import("typebox").TOptional<import("typebox").TString>;
        url: import("typebox").TOptional<import("typebox").TString>;
        mediaUrl: import("typebox").TOptional<import("typebox").TString>;
        filePath: import("typebox").TOptional<import("typebox").TString>;
        mimeType: import("typebox").TOptional<import("typebox").TString>;
        name: import("typebox").TOptional<import("typebox").TString>;
      }>>>;
      mediaUrls: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
      statsLine: import("typebox").TOptional<import("typebox").TString>;
      replyInstruction: import("typebox").TString;
    }>>>;
    inputProvenance: import("typebox").TOptional<import("typebox").TObject<{
      kind: import("typebox").TString;
      originSessionId: import("typebox").TOptional<import("typebox").TString>;
      sourceSessionKey: import("typebox").TOptional<import("typebox").TString>;
      sourceChannel: import("typebox").TOptional<import("typebox").TString>;
      sourceTool: import("typebox").TOptional<import("typebox").TString>;
    }>>;
    suppressPromptPersistence: import("typebox").TOptional<import("typebox").TBoolean>;
    sessionEffects: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"visible">, import("typebox").TLiteral<"internal">]>>;
    sourceReplyDeliveryMode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"automatic">, import("typebox").TLiteral<"message_tool_only">]>>;
    disableMessageTool: import("typebox").TOptional<import("typebox").TBoolean>;
    voiceWakeTrigger: import("typebox").TOptional<import("typebox").TString>;
    idempotencyKey: import("typebox").TString;
    label: import("typebox").TOptional<import("typebox").TString>;
  }>;
  AgentIdentityParams: import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
  }>;
  AgentIdentityResult: import("typebox").TObject<{
    agentId: import("typebox").TString;
    name: import("typebox").TOptional<import("typebox").TString>;
    avatar: import("typebox").TOptional<import("typebox").TString>;
    avatarSource: import("typebox").TOptional<import("typebox").TString>;
    avatarStatus: import("typebox").TOptional<import("typebox").TString>;
    avatarReason: import("typebox").TOptional<import("typebox").TString>;
    emoji: import("typebox").TOptional<import("typebox").TString>;
  }>;
  AgentWaitParams: import("typebox").TObject<{
    runId: import("typebox").TString;
    timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
  WakeParams: import("typebox").TObject<{
    mode: import("typebox").TUnion<[import("typebox").TLiteral<"now">, import("typebox").TLiteral<"next-heartbeat">]>;
    text: import("typebox").TString;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  NodePairRequestParams: import("typebox").TObject<{
    nodeId: import("typebox").TString;
    displayName: import("typebox").TOptional<import("typebox").TString>;
    platform: import("typebox").TOptional<import("typebox").TString>;
    version: import("typebox").TOptional<import("typebox").TString>;
    coreVersion: import("typebox").TOptional<import("typebox").TString>;
    uiVersion: import("typebox").TOptional<import("typebox").TString>;
    deviceFamily: import("typebox").TOptional<import("typebox").TString>;
    modelIdentifier: import("typebox").TOptional<import("typebox").TString>;
    caps: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    commands: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    permissions: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TBoolean>>;
    remoteIp: import("typebox").TOptional<import("typebox").TString>;
    silent: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  NodePairListParams: import("typebox").TObject<{}>;
  NodePairApproveParams: import("typebox").TObject<{
    requestId: import("typebox").TString;
  }>;
  NodePairRejectParams: import("typebox").TObject<{
    requestId: import("typebox").TString;
  }>;
  NodePairRemoveParams: import("typebox").TObject<{
    nodeId: import("typebox").TString;
  }>;
  NodePairVerifyParams: import("typebox").TObject<{
    nodeId: import("typebox").TString;
    token: import("typebox").TString;
  }>;
  NodeRenameParams: import("typebox").TObject<{
    nodeId: import("typebox").TString;
    displayName: import("typebox").TString;
  }>;
  NodeListParams: import("typebox").TObject<{}>;
  NodePendingAckParams: import("typebox").TObject<{
    ids: import("typebox").TArray<import("typebox").TString>;
  }>;
  NodeDescribeParams: import("typebox").TObject<{
    nodeId: import("typebox").TString;
  }>;
  NodeInvokeParams: import("typebox").TObject<{
    nodeId: import("typebox").TString;
    command: import("typebox").TString;
    params: import("typebox").TOptional<import("typebox").TUnknown>;
    timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
    idempotencyKey: import("typebox").TString;
  }>;
  NodeInvokeResultParams: import("typebox").TObject<{
    id: import("typebox").TString;
    nodeId: import("typebox").TString;
    ok: import("typebox").TBoolean;
    payload: import("typebox").TOptional<import("typebox").TUnknown>;
    payloadJSON: import("typebox").TOptional<import("typebox").TString>;
    error: import("typebox").TOptional<import("typebox").TObject<{
      code: import("typebox").TOptional<import("typebox").TString>;
      message: import("typebox").TOptional<import("typebox").TString>;
    }>>;
  }>;
  NodeEventParams: import("typebox").TObject<{
    event: import("typebox").TString;
    payload: import("typebox").TOptional<import("typebox").TUnknown>;
    payloadJSON: import("typebox").TOptional<import("typebox").TString>;
  }>;
  NodeEventResult: import("typebox").TObject<{
    ok: import("typebox").TBoolean;
    event: import("typebox").TString;
    handled: import("typebox").TBoolean;
    reason: import("typebox").TOptional<import("typebox").TString>;
  }>;
  NodePresenceAlivePayload: import("typebox").TObject<{
    trigger: import("typebox").TString;
    sentAtMs: import("typebox").TOptional<import("typebox").TInteger>;
    displayName: import("typebox").TOptional<import("typebox").TString>;
    version: import("typebox").TOptional<import("typebox").TString>;
    platform: import("typebox").TOptional<import("typebox").TString>;
    deviceFamily: import("typebox").TOptional<import("typebox").TString>;
    modelIdentifier: import("typebox").TOptional<import("typebox").TString>;
    pushTransport: import("typebox").TOptional<import("typebox").TString>;
  }>;
  NodePresenceAliveReason: import("typebox").TString;
  NodePendingDrainParams: import("typebox").TObject<{
    maxItems: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
  NodePendingDrainResult: import("typebox").TObject<{
    nodeId: import("typebox").TString;
    revision: import("typebox").TInteger;
    items: import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TString;
      type: import("typebox").TString;
      priority: import("typebox").TString;
      createdAtMs: import("typebox").TInteger;
      expiresAtMs: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TInteger, import("typebox").TNull]>>;
      payload: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TUnknown>>;
    }>>;
    hasMore: import("typebox").TBoolean;
  }>;
  NodePendingEnqueueParams: import("typebox").TObject<{
    nodeId: import("typebox").TString;
    type: import("typebox").TString;
    priority: import("typebox").TOptional<import("typebox").TString>;
    expiresInMs: import("typebox").TOptional<import("typebox").TInteger>;
    wake: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  NodePendingEnqueueResult: import("typebox").TObject<{
    nodeId: import("typebox").TString;
    revision: import("typebox").TInteger;
    queued: import("typebox").TObject<{
      id: import("typebox").TString;
      type: import("typebox").TString;
      priority: import("typebox").TString;
      createdAtMs: import("typebox").TInteger;
      expiresAtMs: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TInteger, import("typebox").TNull]>>;
      payload: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TUnknown>>;
    }>;
    wakeTriggered: import("typebox").TBoolean;
  }>;
  NodeInvokeRequestEvent: import("typebox").TObject<{
    id: import("typebox").TString;
    nodeId: import("typebox").TString;
    command: import("typebox").TString;
    paramsJSON: import("typebox").TOptional<import("typebox").TString>;
    timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
    idempotencyKey: import("typebox").TOptional<import("typebox").TString>;
  }>;
  PushTestParams: import("typebox").TObject<{
    nodeId: import("typebox").TString;
    title: import("typebox").TOptional<import("typebox").TString>;
    body: import("typebox").TOptional<import("typebox").TString>;
    environment: import("typebox").TOptional<import("typebox").TString>;
  }>;
  PushTestResult: import("typebox").TObject<{
    ok: import("typebox").TBoolean;
    status: import("typebox").TInteger;
    apnsId: import("typebox").TOptional<import("typebox").TString>;
    reason: import("typebox").TOptional<import("typebox").TString>;
    tokenSuffix: import("typebox").TString;
    topic: import("typebox").TString;
    environment: import("typebox").TString;
    transport: import("typebox").TString;
  }>;
  SecretsReloadParams: import("typebox").TObject<{}>;
  SecretsResolveParams: import("typebox").TObject<{
    commandName: import("typebox").TString;
    targetIds: import("typebox").TArray<import("typebox").TString>;
    allowedPaths: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    forcedActivePaths: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    optionalActivePaths: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    providerOverrides: import("typebox").TOptional<import("typebox").TObject<{
      webSearch: import("typebox").TOptional<import("typebox").TString>;
      webFetch: import("typebox").TOptional<import("typebox").TString>;
    }>>;
  }>;
  SecretsResolveAssignment: import("typebox").TObject<{
    path: import("typebox").TOptional<import("typebox").TString>;
    pathSegments: import("typebox").TArray<import("typebox").TString>;
    value: import("typebox").TUnknown;
  }>;
  SecretsResolveResult: import("typebox").TObject<{
    ok: import("typebox").TOptional<import("typebox").TBoolean>;
    assignments: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
      path: import("typebox").TOptional<import("typebox").TString>;
      pathSegments: import("typebox").TArray<import("typebox").TString>;
      value: import("typebox").TUnknown;
    }>>>;
    diagnostics: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    inactiveRefPaths: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
  }>;
  SessionsListParams: import("typebox").TObject<{
    limit: import("typebox").TOptional<import("typebox").TInteger>;
    offset: import("typebox").TOptional<import("typebox").TInteger>;
    activeMinutes: import("typebox").TOptional<import("typebox").TInteger>;
    includeGlobal: import("typebox").TOptional<import("typebox").TBoolean>;
    includeUnknown: import("typebox").TOptional<import("typebox").TBoolean>;
    configuredAgentsOnly: import("typebox").TOptional<import("typebox").TBoolean>;
    includeDerivedTitles: import("typebox").TOptional<import("typebox").TBoolean>;
    includeLastMessage: import("typebox").TOptional<import("typebox").TBoolean>;
    label: import("typebox").TOptional<import("typebox").TString>;
    spawnedBy: import("typebox").TOptional<import("typebox").TString>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    search: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SessionsCleanupParams: import("typebox").TObject<{
    agent: import("typebox").TOptional<import("typebox").TString>;
    allAgents: import("typebox").TOptional<import("typebox").TBoolean>;
    enforce: import("typebox").TOptional<import("typebox").TBoolean>;
    activeKey: import("typebox").TOptional<import("typebox").TString>;
    fixMissing: import("typebox").TOptional<import("typebox").TBoolean>;
    fixDmScope: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  SessionsPreviewParams: import("typebox").TObject<{
    keys: import("typebox").TArray<import("typebox").TString>;
    limit: import("typebox").TOptional<import("typebox").TInteger>;
    maxChars: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
  SessionsDescribeParams: import("typebox").TObject<{
    key: import("typebox").TString;
    includeDerivedTitles: import("typebox").TOptional<import("typebox").TBoolean>;
    includeLastMessage: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  SessionsResolveParams: import("typebox").TObject<{
    key: import("typebox").TOptional<import("typebox").TString>;
    sessionId: import("typebox").TOptional<import("typebox").TString>;
    label: import("typebox").TOptional<import("typebox").TString>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    spawnedBy: import("typebox").TOptional<import("typebox").TString>;
    includeGlobal: import("typebox").TOptional<import("typebox").TBoolean>;
    includeUnknown: import("typebox").TOptional<import("typebox").TBoolean>;
    allowMissing: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  SessionCompactionCheckpoint: import("typebox").TObject<{
    checkpointId: import("typebox").TString;
    sessionKey: import("typebox").TString;
    sessionId: import("typebox").TString;
    createdAt: import("typebox").TInteger;
    reason: import("typebox").TUnion<[import("typebox").TLiteral<"manual">, import("typebox").TLiteral<"auto-threshold">, import("typebox").TLiteral<"overflow-retry">, import("typebox").TLiteral<"timeout-retry">]>;
    tokensBefore: import("typebox").TOptional<import("typebox").TInteger>;
    tokensAfter: import("typebox").TOptional<import("typebox").TInteger>;
    summary: import("typebox").TOptional<import("typebox").TString>;
    firstKeptEntryId: import("typebox").TOptional<import("typebox").TString>;
    preCompaction: import("typebox").TObject<{
      sessionId: import("typebox").TString;
      sessionFile: import("typebox").TOptional<import("typebox").TString>;
      leafId: import("typebox").TOptional<import("typebox").TString>;
      entryId: import("typebox").TOptional<import("typebox").TString>;
    }>;
    postCompaction: import("typebox").TObject<{
      sessionId: import("typebox").TString;
      sessionFile: import("typebox").TOptional<import("typebox").TString>;
      leafId: import("typebox").TOptional<import("typebox").TString>;
      entryId: import("typebox").TOptional<import("typebox").TString>;
    }>;
  }>;
  SessionOperationEvent: import("typebox").TObject<{
    operationId: import("typebox").TString;
    operation: import("typebox").TLiteral<"compact">;
    phase: import("typebox").TUnion<[import("typebox").TLiteral<"start">, import("typebox").TLiteral<"end">]>;
    sessionKey: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    ts: import("typebox").TInteger;
    completed: import("typebox").TOptional<import("typebox").TBoolean>;
    reason: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SessionsCompactionListParams: import("typebox").TObject<{
    key: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SessionsCompactionGetParams: import("typebox").TObject<{
    key: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    checkpointId: import("typebox").TString;
  }>;
  SessionsCompactionBranchParams: import("typebox").TObject<{
    key: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    checkpointId: import("typebox").TString;
  }>;
  SessionsCompactionRestoreParams: import("typebox").TObject<{
    key: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    checkpointId: import("typebox").TString;
  }>;
  SessionsCompactionListResult: import("typebox").TObject<{
    ok: import("typebox").TLiteral<true>;
    key: import("typebox").TString;
    checkpoints: import("typebox").TArray<import("typebox").TObject<{
      checkpointId: import("typebox").TString;
      sessionKey: import("typebox").TString;
      sessionId: import("typebox").TString;
      createdAt: import("typebox").TInteger;
      reason: import("typebox").TUnion<[import("typebox").TLiteral<"manual">, import("typebox").TLiteral<"auto-threshold">, import("typebox").TLiteral<"overflow-retry">, import("typebox").TLiteral<"timeout-retry">]>;
      tokensBefore: import("typebox").TOptional<import("typebox").TInteger>;
      tokensAfter: import("typebox").TOptional<import("typebox").TInteger>;
      summary: import("typebox").TOptional<import("typebox").TString>;
      firstKeptEntryId: import("typebox").TOptional<import("typebox").TString>;
      preCompaction: import("typebox").TObject<{
        sessionId: import("typebox").TString;
        sessionFile: import("typebox").TOptional<import("typebox").TString>;
        leafId: import("typebox").TOptional<import("typebox").TString>;
        entryId: import("typebox").TOptional<import("typebox").TString>;
      }>;
      postCompaction: import("typebox").TObject<{
        sessionId: import("typebox").TString;
        sessionFile: import("typebox").TOptional<import("typebox").TString>;
        leafId: import("typebox").TOptional<import("typebox").TString>;
        entryId: import("typebox").TOptional<import("typebox").TString>;
      }>;
    }>>;
  }>;
  SessionsCompactionGetResult: import("typebox").TObject<{
    ok: import("typebox").TLiteral<true>;
    key: import("typebox").TString;
    checkpoint: import("typebox").TObject<{
      checkpointId: import("typebox").TString;
      sessionKey: import("typebox").TString;
      sessionId: import("typebox").TString;
      createdAt: import("typebox").TInteger;
      reason: import("typebox").TUnion<[import("typebox").TLiteral<"manual">, import("typebox").TLiteral<"auto-threshold">, import("typebox").TLiteral<"overflow-retry">, import("typebox").TLiteral<"timeout-retry">]>;
      tokensBefore: import("typebox").TOptional<import("typebox").TInteger>;
      tokensAfter: import("typebox").TOptional<import("typebox").TInteger>;
      summary: import("typebox").TOptional<import("typebox").TString>;
      firstKeptEntryId: import("typebox").TOptional<import("typebox").TString>;
      preCompaction: import("typebox").TObject<{
        sessionId: import("typebox").TString;
        sessionFile: import("typebox").TOptional<import("typebox").TString>;
        leafId: import("typebox").TOptional<import("typebox").TString>;
        entryId: import("typebox").TOptional<import("typebox").TString>;
      }>;
      postCompaction: import("typebox").TObject<{
        sessionId: import("typebox").TString;
        sessionFile: import("typebox").TOptional<import("typebox").TString>;
        leafId: import("typebox").TOptional<import("typebox").TString>;
        entryId: import("typebox").TOptional<import("typebox").TString>;
      }>;
    }>;
  }>;
  SessionsCompactionBranchResult: import("typebox").TObject<{
    ok: import("typebox").TLiteral<true>;
    sourceKey: import("typebox").TString;
    key: import("typebox").TString;
    sessionId: import("typebox").TString;
    checkpoint: import("typebox").TObject<{
      checkpointId: import("typebox").TString;
      sessionKey: import("typebox").TString;
      sessionId: import("typebox").TString;
      createdAt: import("typebox").TInteger;
      reason: import("typebox").TUnion<[import("typebox").TLiteral<"manual">, import("typebox").TLiteral<"auto-threshold">, import("typebox").TLiteral<"overflow-retry">, import("typebox").TLiteral<"timeout-retry">]>;
      tokensBefore: import("typebox").TOptional<import("typebox").TInteger>;
      tokensAfter: import("typebox").TOptional<import("typebox").TInteger>;
      summary: import("typebox").TOptional<import("typebox").TString>;
      firstKeptEntryId: import("typebox").TOptional<import("typebox").TString>;
      preCompaction: import("typebox").TObject<{
        sessionId: import("typebox").TString;
        sessionFile: import("typebox").TOptional<import("typebox").TString>;
        leafId: import("typebox").TOptional<import("typebox").TString>;
        entryId: import("typebox").TOptional<import("typebox").TString>;
      }>;
      postCompaction: import("typebox").TObject<{
        sessionId: import("typebox").TString;
        sessionFile: import("typebox").TOptional<import("typebox").TString>;
        leafId: import("typebox").TOptional<import("typebox").TString>;
        entryId: import("typebox").TOptional<import("typebox").TString>;
      }>;
    }>;
    entry: import("typebox").TObject<{
      sessionId: import("typebox").TString;
      updatedAt: import("typebox").TInteger;
    }>;
  }>;
  SessionsCompactionRestoreResult: import("typebox").TObject<{
    ok: import("typebox").TLiteral<true>;
    key: import("typebox").TString;
    sessionId: import("typebox").TString;
    checkpoint: import("typebox").TObject<{
      checkpointId: import("typebox").TString;
      sessionKey: import("typebox").TString;
      sessionId: import("typebox").TString;
      createdAt: import("typebox").TInteger;
      reason: import("typebox").TUnion<[import("typebox").TLiteral<"manual">, import("typebox").TLiteral<"auto-threshold">, import("typebox").TLiteral<"overflow-retry">, import("typebox").TLiteral<"timeout-retry">]>;
      tokensBefore: import("typebox").TOptional<import("typebox").TInteger>;
      tokensAfter: import("typebox").TOptional<import("typebox").TInteger>;
      summary: import("typebox").TOptional<import("typebox").TString>;
      firstKeptEntryId: import("typebox").TOptional<import("typebox").TString>;
      preCompaction: import("typebox").TObject<{
        sessionId: import("typebox").TString;
        sessionFile: import("typebox").TOptional<import("typebox").TString>;
        leafId: import("typebox").TOptional<import("typebox").TString>;
        entryId: import("typebox").TOptional<import("typebox").TString>;
      }>;
      postCompaction: import("typebox").TObject<{
        sessionId: import("typebox").TString;
        sessionFile: import("typebox").TOptional<import("typebox").TString>;
        leafId: import("typebox").TOptional<import("typebox").TString>;
        entryId: import("typebox").TOptional<import("typebox").TString>;
      }>;
    }>;
    entry: import("typebox").TObject<{
      sessionId: import("typebox").TString;
      updatedAt: import("typebox").TInteger;
    }>;
  }>;
  SessionFileBrowserEntry: import("typebox").TObject<{
    path: import("typebox").TString;
    name: import("typebox").TString;
    kind: import("typebox").TUnion<[import("typebox").TLiteral<"file">, import("typebox").TLiteral<"directory">]>;
    sessionKind: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"modified">, import("typebox").TLiteral<"read">, import("typebox").TLiteral<"mixed">]>>;
    size: import("typebox").TOptional<import("typebox").TInteger>;
    updatedAtMs: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
  SessionFileBrowserResult: import("typebox").TObject<{
    path: import("typebox").TString;
    parentPath: import("typebox").TOptional<import("typebox").TString>;
    search: import("typebox").TOptional<import("typebox").TString>;
    entries: import("typebox").TArray<import("typebox").TObject<{
      path: import("typebox").TString;
      name: import("typebox").TString;
      kind: import("typebox").TUnion<[import("typebox").TLiteral<"file">, import("typebox").TLiteral<"directory">]>;
      sessionKind: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"modified">, import("typebox").TLiteral<"read">, import("typebox").TLiteral<"mixed">]>>;
      size: import("typebox").TOptional<import("typebox").TInteger>;
      updatedAtMs: import("typebox").TOptional<import("typebox").TInteger>;
    }>>;
    truncated: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  SessionFileKind: import("typebox").TUnion<[import("typebox").TLiteral<"modified">, import("typebox").TLiteral<"read">]>;
  SessionFileEntry: import("typebox").TObject<{
    path: import("typebox").TString;
    name: import("typebox").TString;
    kind: import("typebox").TUnion<[import("typebox").TLiteral<"modified">, import("typebox").TLiteral<"read">]>;
    missing: import("typebox").TBoolean;
    size: import("typebox").TOptional<import("typebox").TInteger>;
    updatedAtMs: import("typebox").TOptional<import("typebox").TInteger>;
    content: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SessionFileRelevance: import("typebox").TUnion<[import("typebox").TLiteral<"modified">, import("typebox").TLiteral<"read">, import("typebox").TLiteral<"mixed">]>;
  SessionsFilesListParams: import("typebox").TObject<{
    sessionKey: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    path: import("typebox").TOptional<import("typebox").TString>;
    search: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SessionsFilesListResult: import("typebox").TObject<{
    sessionKey: import("typebox").TString;
    root: import("typebox").TOptional<import("typebox").TString>;
    files: import("typebox").TArray<import("typebox").TObject<{
      path: import("typebox").TString;
      name: import("typebox").TString;
      kind: import("typebox").TUnion<[import("typebox").TLiteral<"modified">, import("typebox").TLiteral<"read">]>;
      missing: import("typebox").TBoolean;
      size: import("typebox").TOptional<import("typebox").TInteger>;
      updatedAtMs: import("typebox").TOptional<import("typebox").TInteger>;
      content: import("typebox").TOptional<import("typebox").TString>;
    }>>;
    browser: import("typebox").TOptional<import("typebox").TObject<{
      path: import("typebox").TString;
      parentPath: import("typebox").TOptional<import("typebox").TString>;
      search: import("typebox").TOptional<import("typebox").TString>;
      entries: import("typebox").TArray<import("typebox").TObject<{
        path: import("typebox").TString;
        name: import("typebox").TString;
        kind: import("typebox").TUnion<[import("typebox").TLiteral<"file">, import("typebox").TLiteral<"directory">]>;
        sessionKind: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"modified">, import("typebox").TLiteral<"read">, import("typebox").TLiteral<"mixed">]>>;
        size: import("typebox").TOptional<import("typebox").TInteger>;
        updatedAtMs: import("typebox").TOptional<import("typebox").TInteger>;
      }>>;
      truncated: import("typebox").TOptional<import("typebox").TBoolean>;
    }>>;
  }>;
  SessionsFilesGetParams: import("typebox").TObject<{
    sessionKey: import("typebox").TString;
    path: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SessionsFilesGetResult: import("typebox").TObject<{
    sessionKey: import("typebox").TString;
    root: import("typebox").TOptional<import("typebox").TString>;
    file: import("typebox").TObject<{
      path: import("typebox").TString;
      name: import("typebox").TString;
      kind: import("typebox").TUnion<[import("typebox").TLiteral<"modified">, import("typebox").TLiteral<"read">]>;
      missing: import("typebox").TBoolean;
      size: import("typebox").TOptional<import("typebox").TInteger>;
      updatedAtMs: import("typebox").TOptional<import("typebox").TInteger>;
      content: import("typebox").TOptional<import("typebox").TString>;
    }>;
  }>;
  SessionsCreateParams: import("typebox").TObject<{
    key: import("typebox").TOptional<import("typebox").TString>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    label: import("typebox").TOptional<import("typebox").TString>;
    model: import("typebox").TOptional<import("typebox").TString>;
    parentSessionKey: import("typebox").TOptional<import("typebox").TString>;
    emitCommandHooks: import("typebox").TOptional<import("typebox").TBoolean>;
    task: import("typebox").TOptional<import("typebox").TString>;
    message: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SessionsSendParams: import("typebox").TObject<{
    key: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    message: import("typebox").TString;
    thinking: import("typebox").TOptional<import("typebox").TString>;
    attachments: import("typebox").TOptional<import("typebox").TArray<import("typebox").TUnknown>>;
    timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
    idempotencyKey: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SessionsMessagesSubscribeParams: import("typebox").TObject<{
    key: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SessionsMessagesUnsubscribeParams: import("typebox").TObject<{
    key: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SessionsAbortParams: import("typebox").TObject<{
    key: import("typebox").TOptional<import("typebox").TString>;
    runId: import("typebox").TOptional<import("typebox").TString>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SessionsPatchParams: import("typebox").TObject<{
    key: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    label: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    thinkingLevel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    fastMode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TBoolean, import("typebox").TLiteral<"auto">, import("typebox").TNull]>>;
    verboseLevel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    traceLevel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    reasoningLevel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    responseUsage: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"off">, import("typebox").TLiteral<"tokens">, import("typebox").TLiteral<"full">, import("typebox").TLiteral<"on">, import("typebox").TNull]>>;
    elevatedLevel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    execHost: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    execSecurity: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    execAsk: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    execNode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    model: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    spawnedBy: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    spawnedWorkspaceDir: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    spawnedCwd: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    spawnDepth: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TInteger, import("typebox").TNull]>>;
    subagentRole: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"orchestrator">, import("typebox").TLiteral<"leaf">, import("typebox").TNull]>>;
    subagentControlScope: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"children">, import("typebox").TLiteral<"none">, import("typebox").TNull]>>;
    inheritedToolAllow: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TArray<import("typebox").TString>, import("typebox").TNull]>>;
    inheritedToolDeny: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TArray<import("typebox").TString>, import("typebox").TNull]>>;
    sendPolicy: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"allow">, import("typebox").TLiteral<"deny">, import("typebox").TNull]>>;
    groupActivation: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"mention">, import("typebox").TLiteral<"always">, import("typebox").TNull]>>;
  }>;
  SessionsPluginPatchParams: import("typebox").TObject<{
    key: import("typebox").TString;
    pluginId: import("typebox").TString;
    namespace: import("typebox").TString;
    value: import("typebox").TOptional<import("typebox").TUnknown>;
    unset: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  SessionsPluginPatchResult: import("typebox").TObject<{
    ok: import("typebox").TLiteral<true>;
    key: import("typebox").TString;
    value: import("typebox").TOptional<import("typebox").TUnknown>;
  }>;
  SessionsResetParams: import("typebox").TObject<{
    key: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    reason: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"new">, import("typebox").TLiteral<"reset">]>>;
  }>;
  SessionsDeleteParams: import("typebox").TObject<{
    key: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    deleteTranscript: import("typebox").TOptional<import("typebox").TBoolean>;
    emitLifecycleHooks: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  SessionsCompactParams: import("typebox").TObject<{
    key: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    maxLines: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
  SessionsUsageParams: import("typebox").TObject<{
    key: import("typebox").TOptional<import("typebox").TString>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    agentScope: import("typebox").TOptional<import("typebox").TLiteral<"all">>;
    startDate: import("typebox").TOptional<import("typebox").TString>;
    endDate: import("typebox").TOptional<import("typebox").TString>;
    mode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"utc">, import("typebox").TLiteral<"gateway">, import("typebox").TLiteral<"specific">]>>;
    range: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"7d">, import("typebox").TLiteral<"30d">, import("typebox").TLiteral<"90d">, import("typebox").TLiteral<"1y">, import("typebox").TLiteral<"all">]>>;
    groupBy: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"instance">, import("typebox").TLiteral<"family">]>>;
    includeHistorical: import("typebox").TOptional<import("typebox").TBoolean>;
    utcOffset: import("typebox").TOptional<import("typebox").TString>;
    limit: import("typebox").TOptional<import("typebox").TInteger>;
    includeContextWeight: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  TaskSummary: import("typebox").TObject<{
    id: import("typebox").TString;
    kind: import("typebox").TOptional<import("typebox").TString>;
    runtime: import("typebox").TOptional<import("typebox").TString>;
    status: import("typebox").TUnion<[import("typebox").TLiteral<"queued">, import("typebox").TLiteral<"running">, import("typebox").TLiteral<"completed">, import("typebox").TLiteral<"failed">, import("typebox").TLiteral<"cancelled">, import("typebox").TLiteral<"timed_out">]>;
    title: import("typebox").TOptional<import("typebox").TString>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    childSessionKey: import("typebox").TOptional<import("typebox").TString>;
    ownerKey: import("typebox").TOptional<import("typebox").TString>;
    runId: import("typebox").TOptional<import("typebox").TString>;
    taskId: import("typebox").TOptional<import("typebox").TString>;
    flowId: import("typebox").TOptional<import("typebox").TString>;
    parentTaskId: import("typebox").TOptional<import("typebox").TString>;
    sourceId: import("typebox").TOptional<import("typebox").TString>;
    createdAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
    updatedAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
    startedAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
    endedAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
    progressSummary: import("typebox").TOptional<import("typebox").TString>;
    terminalSummary: import("typebox").TOptional<import("typebox").TString>;
    error: import("typebox").TOptional<import("typebox").TString>;
  }>;
  TasksListParams: import("typebox").TObject<{
    status: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TUnion<[import("typebox").TLiteral<"queued">, import("typebox").TLiteral<"running">, import("typebox").TLiteral<"completed">, import("typebox").TLiteral<"failed">, import("typebox").TLiteral<"cancelled">, import("typebox").TLiteral<"timed_out">]>, import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"queued">, import("typebox").TLiteral<"running">, import("typebox").TLiteral<"completed">, import("typebox").TLiteral<"failed">, import("typebox").TLiteral<"cancelled">, import("typebox").TLiteral<"timed_out">]>>]>>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    limit: import("typebox").TOptional<import("typebox").TInteger>;
    cursor: import("typebox").TOptional<import("typebox").TString>;
  }>;
  TasksListResult: import("typebox").TObject<{
    tasks: import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TString;
      kind: import("typebox").TOptional<import("typebox").TString>;
      runtime: import("typebox").TOptional<import("typebox").TString>;
      status: import("typebox").TUnion<[import("typebox").TLiteral<"queued">, import("typebox").TLiteral<"running">, import("typebox").TLiteral<"completed">, import("typebox").TLiteral<"failed">, import("typebox").TLiteral<"cancelled">, import("typebox").TLiteral<"timed_out">]>;
      title: import("typebox").TOptional<import("typebox").TString>;
      agentId: import("typebox").TOptional<import("typebox").TString>;
      sessionKey: import("typebox").TOptional<import("typebox").TString>;
      childSessionKey: import("typebox").TOptional<import("typebox").TString>;
      ownerKey: import("typebox").TOptional<import("typebox").TString>;
      runId: import("typebox").TOptional<import("typebox").TString>;
      taskId: import("typebox").TOptional<import("typebox").TString>;
      flowId: import("typebox").TOptional<import("typebox").TString>;
      parentTaskId: import("typebox").TOptional<import("typebox").TString>;
      sourceId: import("typebox").TOptional<import("typebox").TString>;
      createdAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
      updatedAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
      startedAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
      endedAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
      progressSummary: import("typebox").TOptional<import("typebox").TString>;
      terminalSummary: import("typebox").TOptional<import("typebox").TString>;
      error: import("typebox").TOptional<import("typebox").TString>;
    }>>;
    nextCursor: import("typebox").TOptional<import("typebox").TString>;
  }>;
  TasksGetParams: import("typebox").TObject<{
    taskId: import("typebox").TString;
  }>;
  TasksGetResult: import("typebox").TObject<{
    task: import("typebox").TObject<{
      id: import("typebox").TString;
      kind: import("typebox").TOptional<import("typebox").TString>;
      runtime: import("typebox").TOptional<import("typebox").TString>;
      status: import("typebox").TUnion<[import("typebox").TLiteral<"queued">, import("typebox").TLiteral<"running">, import("typebox").TLiteral<"completed">, import("typebox").TLiteral<"failed">, import("typebox").TLiteral<"cancelled">, import("typebox").TLiteral<"timed_out">]>;
      title: import("typebox").TOptional<import("typebox").TString>;
      agentId: import("typebox").TOptional<import("typebox").TString>;
      sessionKey: import("typebox").TOptional<import("typebox").TString>;
      childSessionKey: import("typebox").TOptional<import("typebox").TString>;
      ownerKey: import("typebox").TOptional<import("typebox").TString>;
      runId: import("typebox").TOptional<import("typebox").TString>;
      taskId: import("typebox").TOptional<import("typebox").TString>;
      flowId: import("typebox").TOptional<import("typebox").TString>;
      parentTaskId: import("typebox").TOptional<import("typebox").TString>;
      sourceId: import("typebox").TOptional<import("typebox").TString>;
      createdAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
      updatedAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
      startedAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
      endedAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
      progressSummary: import("typebox").TOptional<import("typebox").TString>;
      terminalSummary: import("typebox").TOptional<import("typebox").TString>;
      error: import("typebox").TOptional<import("typebox").TString>;
    }>;
  }>;
  TasksCancelParams: import("typebox").TObject<{
    taskId: import("typebox").TString;
    reason: import("typebox").TOptional<import("typebox").TString>;
  }>;
  TasksCancelResult: import("typebox").TObject<{
    found: import("typebox").TBoolean;
    cancelled: import("typebox").TBoolean;
    reason: import("typebox").TOptional<import("typebox").TString>;
    task: import("typebox").TOptional<import("typebox").TObject<{
      id: import("typebox").TString;
      kind: import("typebox").TOptional<import("typebox").TString>;
      runtime: import("typebox").TOptional<import("typebox").TString>;
      status: import("typebox").TUnion<[import("typebox").TLiteral<"queued">, import("typebox").TLiteral<"running">, import("typebox").TLiteral<"completed">, import("typebox").TLiteral<"failed">, import("typebox").TLiteral<"cancelled">, import("typebox").TLiteral<"timed_out">]>;
      title: import("typebox").TOptional<import("typebox").TString>;
      agentId: import("typebox").TOptional<import("typebox").TString>;
      sessionKey: import("typebox").TOptional<import("typebox").TString>;
      childSessionKey: import("typebox").TOptional<import("typebox").TString>;
      ownerKey: import("typebox").TOptional<import("typebox").TString>;
      runId: import("typebox").TOptional<import("typebox").TString>;
      taskId: import("typebox").TOptional<import("typebox").TString>;
      flowId: import("typebox").TOptional<import("typebox").TString>;
      parentTaskId: import("typebox").TOptional<import("typebox").TString>;
      sourceId: import("typebox").TOptional<import("typebox").TString>;
      createdAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
      updatedAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
      startedAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
      endedAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TInteger]>>;
      progressSummary: import("typebox").TOptional<import("typebox").TString>;
      terminalSummary: import("typebox").TOptional<import("typebox").TString>;
      error: import("typebox").TOptional<import("typebox").TString>;
    }>>;
  }>;
  ConfigGetParams: import("typebox").TObject<{}>;
  ConfigSetParams: import("typebox").TObject<{
    raw: import("typebox").TString;
    baseHash: import("typebox").TOptional<import("typebox").TString>;
  }>;
  ConfigApplyParams: import("typebox").TObject<{
    readonly raw: import("typebox").TString;
    readonly baseHash: import("typebox").TOptional<import("typebox").TString>;
    readonly sessionKey: import("typebox").TOptional<import("typebox").TString>;
    readonly deliveryContext: import("typebox").TOptional<import("typebox").TObject<{
      channel: import("typebox").TOptional<import("typebox").TString>;
      to: import("typebox").TOptional<import("typebox").TString>;
      accountId: import("typebox").TOptional<import("typebox").TString>;
      threadId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNumber]>>;
    }>>;
    readonly note: import("typebox").TOptional<import("typebox").TString>;
    readonly restartDelayMs: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
  ConfigPatchParams: import("typebox").TObject<{
    replacePaths: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    raw: import("typebox").TString;
    baseHash: import("typebox").TOptional<import("typebox").TString>;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    deliveryContext: import("typebox").TOptional<import("typebox").TObject<{
      channel: import("typebox").TOptional<import("typebox").TString>;
      to: import("typebox").TOptional<import("typebox").TString>;
      accountId: import("typebox").TOptional<import("typebox").TString>;
      threadId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNumber]>>;
    }>>;
    note: import("typebox").TOptional<import("typebox").TString>;
    restartDelayMs: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
  ConfigSchemaParams: import("typebox").TObject<{}>;
  ConfigSchemaLookupParams: import("typebox").TObject<{
    path: import("typebox").TString;
  }>;
  ConfigSchemaResponse: import("typebox").TObject<{
    schema: import("typebox").TUnknown;
    uiHints: import("typebox").TRecord<"^.*$", import("typebox").TObject<{
      label: import("typebox").TOptional<import("typebox").TString>;
      help: import("typebox").TOptional<import("typebox").TString>;
      tags: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
      group: import("typebox").TOptional<import("typebox").TString>;
      order: import("typebox").TOptional<import("typebox").TInteger>;
      advanced: import("typebox").TOptional<import("typebox").TBoolean>;
      sensitive: import("typebox").TOptional<import("typebox").TBoolean>;
      placeholder: import("typebox").TOptional<import("typebox").TString>;
      itemTemplate: import("typebox").TOptional<import("typebox").TUnknown>;
    }>>;
    version: import("typebox").TString;
    generatedAt: import("typebox").TString;
  }>;
  ConfigSchemaLookupResult: import("typebox").TObject<{
    path: import("typebox").TString;
    schema: import("typebox").TUnknown;
    reloadKind: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"restart">, import("typebox").TLiteral<"hot">, import("typebox").TLiteral<"none">]>>;
    hint: import("typebox").TOptional<import("typebox").TObject<{
      label: import("typebox").TOptional<import("typebox").TString>;
      help: import("typebox").TOptional<import("typebox").TString>;
      tags: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
      group: import("typebox").TOptional<import("typebox").TString>;
      order: import("typebox").TOptional<import("typebox").TInteger>;
      advanced: import("typebox").TOptional<import("typebox").TBoolean>;
      sensitive: import("typebox").TOptional<import("typebox").TBoolean>;
      placeholder: import("typebox").TOptional<import("typebox").TString>;
      itemTemplate: import("typebox").TOptional<import("typebox").TUnknown>;
    }>>;
    hintPath: import("typebox").TOptional<import("typebox").TString>;
    children: import("typebox").TArray<import("typebox").TObject<{
      key: import("typebox").TString;
      path: import("typebox").TString;
      type: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TArray<import("typebox").TString>]>>;
      required: import("typebox").TBoolean;
      hasChildren: import("typebox").TBoolean;
      reloadKind: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"restart">, import("typebox").TLiteral<"hot">, import("typebox").TLiteral<"none">]>>;
      hint: import("typebox").TOptional<import("typebox").TObject<{
        label: import("typebox").TOptional<import("typebox").TString>;
        help: import("typebox").TOptional<import("typebox").TString>;
        tags: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
        group: import("typebox").TOptional<import("typebox").TString>;
        order: import("typebox").TOptional<import("typebox").TInteger>;
        advanced: import("typebox").TOptional<import("typebox").TBoolean>;
        sensitive: import("typebox").TOptional<import("typebox").TBoolean>;
        placeholder: import("typebox").TOptional<import("typebox").TString>;
        itemTemplate: import("typebox").TOptional<import("typebox").TUnknown>;
      }>>;
      hintPath: import("typebox").TOptional<import("typebox").TString>;
    }>>;
  }>;
  WizardStartParams: import("typebox").TObject<{
    mode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"local">, import("typebox").TLiteral<"remote">]>>;
    workspace: import("typebox").TOptional<import("typebox").TString>;
  }>;
  WizardNextParams: import("typebox").TObject<{
    sessionId: import("typebox").TString;
    answer: import("typebox").TOptional<import("typebox").TObject<{
      stepId: import("typebox").TString;
      value: import("typebox").TOptional<import("typebox").TUnknown>;
    }>>;
  }>;
  WizardCancelParams: import("typebox").TObject<{
    sessionId: import("typebox").TString;
  }>;
  WizardStatusParams: import("typebox").TObject<{
    sessionId: import("typebox").TString;
  }>;
  WizardStep: import("typebox").TObject<{
    id: import("typebox").TString;
    type: import("typebox").TUnion<[import("typebox").TLiteral<"note">, import("typebox").TLiteral<"select">, import("typebox").TLiteral<"text">, import("typebox").TLiteral<"confirm">, import("typebox").TLiteral<"multiselect">, import("typebox").TLiteral<"progress">, import("typebox").TLiteral<"action">]>;
    title: import("typebox").TOptional<import("typebox").TString>;
    message: import("typebox").TOptional<import("typebox").TString>;
    format: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"plain">]>>;
    options: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
      value: import("typebox").TUnknown;
      label: import("typebox").TString;
      hint: import("typebox").TOptional<import("typebox").TString>;
    }>>>;
    initialValue: import("typebox").TOptional<import("typebox").TUnknown>;
    placeholder: import("typebox").TOptional<import("typebox").TString>;
    sensitive: import("typebox").TOptional<import("typebox").TBoolean>;
    executor: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"gateway">, import("typebox").TLiteral<"client">]>>;
  }>;
  WizardNextResult: import("typebox").TObject<{
    done: import("typebox").TBoolean;
    step: import("typebox").TOptional<import("typebox").TObject<{
      id: import("typebox").TString;
      type: import("typebox").TUnion<[import("typebox").TLiteral<"note">, import("typebox").TLiteral<"select">, import("typebox").TLiteral<"text">, import("typebox").TLiteral<"confirm">, import("typebox").TLiteral<"multiselect">, import("typebox").TLiteral<"progress">, import("typebox").TLiteral<"action">]>;
      title: import("typebox").TOptional<import("typebox").TString>;
      message: import("typebox").TOptional<import("typebox").TString>;
      format: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"plain">]>>;
      options: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
        value: import("typebox").TUnknown;
        label: import("typebox").TString;
        hint: import("typebox").TOptional<import("typebox").TString>;
      }>>>;
      initialValue: import("typebox").TOptional<import("typebox").TUnknown>;
      placeholder: import("typebox").TOptional<import("typebox").TString>;
      sensitive: import("typebox").TOptional<import("typebox").TBoolean>;
      executor: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"gateway">, import("typebox").TLiteral<"client">]>>;
    }>>;
    status: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"running">, import("typebox").TLiteral<"done">, import("typebox").TLiteral<"cancelled">, import("typebox").TLiteral<"error">]>>;
    error: import("typebox").TOptional<import("typebox").TString>;
  }>;
  WizardStartResult: import("typebox").TObject<{
    done: import("typebox").TBoolean;
    step: import("typebox").TOptional<import("typebox").TObject<{
      id: import("typebox").TString;
      type: import("typebox").TUnion<[import("typebox").TLiteral<"note">, import("typebox").TLiteral<"select">, import("typebox").TLiteral<"text">, import("typebox").TLiteral<"confirm">, import("typebox").TLiteral<"multiselect">, import("typebox").TLiteral<"progress">, import("typebox").TLiteral<"action">]>;
      title: import("typebox").TOptional<import("typebox").TString>;
      message: import("typebox").TOptional<import("typebox").TString>;
      format: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"plain">]>>;
      options: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
        value: import("typebox").TUnknown;
        label: import("typebox").TString;
        hint: import("typebox").TOptional<import("typebox").TString>;
      }>>>;
      initialValue: import("typebox").TOptional<import("typebox").TUnknown>;
      placeholder: import("typebox").TOptional<import("typebox").TString>;
      sensitive: import("typebox").TOptional<import("typebox").TBoolean>;
      executor: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"gateway">, import("typebox").TLiteral<"client">]>>;
    }>>;
    status: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"running">, import("typebox").TLiteral<"done">, import("typebox").TLiteral<"cancelled">, import("typebox").TLiteral<"error">]>>;
    error: import("typebox").TOptional<import("typebox").TString>;
    sessionId: import("typebox").TString;
  }>;
  WizardStatusResult: import("typebox").TObject<{
    status: import("typebox").TUnion<[import("typebox").TLiteral<"running">, import("typebox").TLiteral<"done">, import("typebox").TLiteral<"cancelled">, import("typebox").TLiteral<"error">]>;
    error: import("typebox").TOptional<import("typebox").TString>;
  }>;
  TalkModeParams: import("typebox").TObject<{
    enabled: import("typebox").TBoolean;
    phase: import("typebox").TOptional<import("typebox").TString>;
  }>;
  TalkEvent: import("typebox").TObject<{
    id: import("typebox").TString;
    type: import("typebox").TUnion<[import("typebox").TLiteral<"session.started">, import("typebox").TLiteral<"session.ready">, import("typebox").TLiteral<"session.closed">, import("typebox").TLiteral<"session.error">, import("typebox").TLiteral<"session.replaced">, import("typebox").TLiteral<"turn.started">, import("typebox").TLiteral<"turn.ended">, import("typebox").TLiteral<"turn.cancelled">, import("typebox").TLiteral<"capture.started">, import("typebox").TLiteral<"capture.stopped">, import("typebox").TLiteral<"capture.cancelled">, import("typebox").TLiteral<"capture.once">, import("typebox").TLiteral<"input.audio.delta">, import("typebox").TLiteral<"input.audio.committed">, import("typebox").TLiteral<"transcript.delta">, import("typebox").TLiteral<"transcript.done">, import("typebox").TLiteral<"output.text.delta">, import("typebox").TLiteral<"output.text.done">, import("typebox").TLiteral<"output.audio.started">, import("typebox").TLiteral<"output.audio.delta">, import("typebox").TLiteral<"output.audio.done">, import("typebox").TLiteral<"tool.call">, import("typebox").TLiteral<"tool.progress">, import("typebox").TLiteral<"tool.result">, import("typebox").TLiteral<"tool.error">, import("typebox").TLiteral<"usage.metrics">, import("typebox").TLiteral<"latency.metrics">, import("typebox").TLiteral<"health.changed">]>;
    sessionId: import("typebox").TString;
    turnId: import("typebox").TOptional<import("typebox").TString>;
    captureId: import("typebox").TOptional<import("typebox").TString>;
    seq: import("typebox").TInteger;
    timestamp: import("typebox").TString;
    mode: import("typebox").TUnion<[import("typebox").TLiteral<"realtime">, import("typebox").TLiteral<"stt-tts">, import("typebox").TLiteral<"transcription">]>;
    transport: import("typebox").TUnion<[import("typebox").TLiteral<"webrtc">, import("typebox").TLiteral<"provider-websocket">, import("typebox").TLiteral<"gateway-relay">, import("typebox").TLiteral<"managed-room">]>;
    brain: import("typebox").TUnion<[import("typebox").TLiteral<"agent-consult">, import("typebox").TLiteral<"direct-tools">, import("typebox").TLiteral<"none">]>;
    provider: import("typebox").TOptional<import("typebox").TString>;
    final: import("typebox").TOptional<import("typebox").TBoolean>;
    callId: import("typebox").TOptional<import("typebox").TString>;
    itemId: import("typebox").TOptional<import("typebox").TString>;
    parentId: import("typebox").TOptional<import("typebox").TString>;
    payload: import("typebox").TUnknown;
  }>;
  TalkCatalogParams: import("typebox").TObject<{}>;
  TalkCatalogResult: import("typebox").TObject<{
    modes: import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"realtime">, import("typebox").TLiteral<"stt-tts">, import("typebox").TLiteral<"transcription">]>>;
    transports: import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"webrtc">, import("typebox").TLiteral<"provider-websocket">, import("typebox").TLiteral<"gateway-relay">, import("typebox").TLiteral<"managed-room">]>>;
    brains: import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"agent-consult">, import("typebox").TLiteral<"direct-tools">, import("typebox").TLiteral<"none">]>>;
    speech: import("typebox").TObject<{
      activeProvider: import("typebox").TOptional<import("typebox").TString>;
      providers: import("typebox").TArray<import("typebox").TObject<{
        id: import("typebox").TString;
        label: import("typebox").TString;
        configured: import("typebox").TBoolean;
        models: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
        voices: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
        defaultModel: import("typebox").TOptional<import("typebox").TString>;
        modes: import("typebox").TOptional<import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"realtime">, import("typebox").TLiteral<"stt-tts">, import("typebox").TLiteral<"transcription">]>>>;
        transports: import("typebox").TOptional<import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"webrtc">, import("typebox").TLiteral<"provider-websocket">, import("typebox").TLiteral<"gateway-relay">, import("typebox").TLiteral<"managed-room">]>>>;
        brains: import("typebox").TOptional<import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"agent-consult">, import("typebox").TLiteral<"direct-tools">, import("typebox").TLiteral<"none">]>>>;
        inputAudioFormats: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
          encoding: import("typebox").TUnion<[import("typebox").TLiteral<"pcm16">, import("typebox").TLiteral<"g711_ulaw">]>;
          sampleRateHz: import("typebox").TInteger;
          channels: import("typebox").TInteger;
        }>>>;
        outputAudioFormats: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
          encoding: import("typebox").TUnion<[import("typebox").TLiteral<"pcm16">, import("typebox").TLiteral<"g711_ulaw">]>;
          sampleRateHz: import("typebox").TInteger;
          channels: import("typebox").TInteger;
        }>>>;
        supportsBrowserSession: import("typebox").TOptional<import("typebox").TBoolean>;
        supportsBargeIn: import("typebox").TOptional<import("typebox").TBoolean>;
        supportsToolCalls: import("typebox").TOptional<import("typebox").TBoolean>;
        supportsVideoFrames: import("typebox").TOptional<import("typebox").TBoolean>;
        supportsSessionResumption: import("typebox").TOptional<import("typebox").TBoolean>;
      }>>;
    }>;
    transcription: import("typebox").TObject<{
      activeProvider: import("typebox").TOptional<import("typebox").TString>;
      providers: import("typebox").TArray<import("typebox").TObject<{
        id: import("typebox").TString;
        label: import("typebox").TString;
        configured: import("typebox").TBoolean;
        models: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
        voices: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
        defaultModel: import("typebox").TOptional<import("typebox").TString>;
        modes: import("typebox").TOptional<import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"realtime">, import("typebox").TLiteral<"stt-tts">, import("typebox").TLiteral<"transcription">]>>>;
        transports: import("typebox").TOptional<import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"webrtc">, import("typebox").TLiteral<"provider-websocket">, import("typebox").TLiteral<"gateway-relay">, import("typebox").TLiteral<"managed-room">]>>>;
        brains: import("typebox").TOptional<import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"agent-consult">, import("typebox").TLiteral<"direct-tools">, import("typebox").TLiteral<"none">]>>>;
        inputAudioFormats: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
          encoding: import("typebox").TUnion<[import("typebox").TLiteral<"pcm16">, import("typebox").TLiteral<"g711_ulaw">]>;
          sampleRateHz: import("typebox").TInteger;
          channels: import("typebox").TInteger;
        }>>>;
        outputAudioFormats: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
          encoding: import("typebox").TUnion<[import("typebox").TLiteral<"pcm16">, import("typebox").TLiteral<"g711_ulaw">]>;
          sampleRateHz: import("typebox").TInteger;
          channels: import("typebox").TInteger;
        }>>>;
        supportsBrowserSession: import("typebox").TOptional<import("typebox").TBoolean>;
        supportsBargeIn: import("typebox").TOptional<import("typebox").TBoolean>;
        supportsToolCalls: import("typebox").TOptional<import("typebox").TBoolean>;
        supportsVideoFrames: import("typebox").TOptional<import("typebox").TBoolean>;
        supportsSessionResumption: import("typebox").TOptional<import("typebox").TBoolean>;
      }>>;
    }>;
    realtime: import("typebox").TObject<{
      activeProvider: import("typebox").TOptional<import("typebox").TString>;
      providers: import("typebox").TArray<import("typebox").TObject<{
        id: import("typebox").TString;
        label: import("typebox").TString;
        configured: import("typebox").TBoolean;
        models: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
        voices: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
        defaultModel: import("typebox").TOptional<import("typebox").TString>;
        modes: import("typebox").TOptional<import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"realtime">, import("typebox").TLiteral<"stt-tts">, import("typebox").TLiteral<"transcription">]>>>;
        transports: import("typebox").TOptional<import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"webrtc">, import("typebox").TLiteral<"provider-websocket">, import("typebox").TLiteral<"gateway-relay">, import("typebox").TLiteral<"managed-room">]>>>;
        brains: import("typebox").TOptional<import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"agent-consult">, import("typebox").TLiteral<"direct-tools">, import("typebox").TLiteral<"none">]>>>;
        inputAudioFormats: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
          encoding: import("typebox").TUnion<[import("typebox").TLiteral<"pcm16">, import("typebox").TLiteral<"g711_ulaw">]>;
          sampleRateHz: import("typebox").TInteger;
          channels: import("typebox").TInteger;
        }>>>;
        outputAudioFormats: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
          encoding: import("typebox").TUnion<[import("typebox").TLiteral<"pcm16">, import("typebox").TLiteral<"g711_ulaw">]>;
          sampleRateHz: import("typebox").TInteger;
          channels: import("typebox").TInteger;
        }>>>;
        supportsBrowserSession: import("typebox").TOptional<import("typebox").TBoolean>;
        supportsBargeIn: import("typebox").TOptional<import("typebox").TBoolean>;
        supportsToolCalls: import("typebox").TOptional<import("typebox").TBoolean>;
        supportsVideoFrames: import("typebox").TOptional<import("typebox").TBoolean>;
        supportsSessionResumption: import("typebox").TOptional<import("typebox").TBoolean>;
      }>>;
    }>;
  }>;
  TalkClientCreateParams: import("typebox").TObject<{
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    provider: import("typebox").TOptional<import("typebox").TString>;
    model: import("typebox").TOptional<import("typebox").TString>;
    voice: import("typebox").TOptional<import("typebox").TString>;
    vadThreshold: import("typebox").TOptional<import("typebox").TNumber>;
    silenceDurationMs: import("typebox").TOptional<import("typebox").TInteger>;
    prefixPaddingMs: import("typebox").TOptional<import("typebox").TInteger>;
    reasoningEffort: import("typebox").TOptional<import("typebox").TString>;
    mode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"realtime">, import("typebox").TLiteral<"stt-tts">, import("typebox").TLiteral<"transcription">]>>;
    transport: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"webrtc">, import("typebox").TLiteral<"provider-websocket">, import("typebox").TLiteral<"gateway-relay">, import("typebox").TLiteral<"managed-room">]>>;
    brain: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"agent-consult">, import("typebox").TLiteral<"direct-tools">, import("typebox").TLiteral<"none">]>>;
  }>;
  TalkClientCreateResult: import("typebox").TUnion<[import("typebox").TObject<{
    provider: import("typebox").TString;
    transport: import("typebox").TLiteral<"webrtc">;
    clientSecret: import("typebox").TString;
    offerUrl: import("typebox").TOptional<import("typebox").TString>;
    offerHeaders: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TString>>;
    model: import("typebox").TOptional<import("typebox").TString>;
    voice: import("typebox").TOptional<import("typebox").TString>;
    expiresAt: import("typebox").TOptional<import("typebox").TNumber>;
  }>, import("typebox").TObject<{
    provider: import("typebox").TString;
    transport: import("typebox").TLiteral<"provider-websocket">;
    protocol: import("typebox").TString;
    clientSecret: import("typebox").TString;
    websocketUrl: import("typebox").TString;
    audio: import("typebox").TObject<{
      inputEncoding: import("typebox").TUnion<[import("typebox").TLiteral<"pcm16">, import("typebox").TLiteral<"g711_ulaw">]>;
      inputSampleRateHz: import("typebox").TInteger;
      outputEncoding: import("typebox").TUnion<[import("typebox").TLiteral<"pcm16">, import("typebox").TLiteral<"g711_ulaw">]>;
      outputSampleRateHz: import("typebox").TInteger;
    }>;
    initialMessage: import("typebox").TOptional<import("typebox").TUnknown>;
    model: import("typebox").TOptional<import("typebox").TString>;
    voice: import("typebox").TOptional<import("typebox").TString>;
    expiresAt: import("typebox").TOptional<import("typebox").TNumber>;
  }>, import("typebox").TObject<{
    provider: import("typebox").TString;
    transport: import("typebox").TLiteral<"gateway-relay">;
    relaySessionId: import("typebox").TString;
    audio: import("typebox").TObject<{
      inputEncoding: import("typebox").TUnion<[import("typebox").TLiteral<"pcm16">, import("typebox").TLiteral<"g711_ulaw">]>;
      inputSampleRateHz: import("typebox").TInteger;
      outputEncoding: import("typebox").TUnion<[import("typebox").TLiteral<"pcm16">, import("typebox").TLiteral<"g711_ulaw">]>;
      outputSampleRateHz: import("typebox").TInteger;
    }>;
    model: import("typebox").TOptional<import("typebox").TString>;
    voice: import("typebox").TOptional<import("typebox").TString>;
    expiresAt: import("typebox").TOptional<import("typebox").TNumber>;
  }>, import("typebox").TObject<{
    provider: import("typebox").TString;
    transport: import("typebox").TLiteral<"managed-room">;
    roomUrl: import("typebox").TString;
    token: import("typebox").TOptional<import("typebox").TString>;
    model: import("typebox").TOptional<import("typebox").TString>;
    voice: import("typebox").TOptional<import("typebox").TString>;
    expiresAt: import("typebox").TOptional<import("typebox").TNumber>;
  }>]>;
  TalkClientSteerParams: import("typebox").TObject<{
    sessionKey: import("typebox").TString;
    text: import("typebox").TString;
    mode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"status">, import("typebox").TLiteral<"steer">, import("typebox").TLiteral<"cancel">, import("typebox").TLiteral<"followup">]>>;
  }>;
  TalkAgentControlResult: import("typebox").TObject<{
    ok: import("typebox").TBoolean;
    mode: import("typebox").TUnion<[import("typebox").TLiteral<"status">, import("typebox").TLiteral<"steer">, import("typebox").TLiteral<"cancel">, import("typebox").TLiteral<"followup">]>;
    sessionKey: import("typebox").TString;
    sessionId: import("typebox").TOptional<import("typebox").TString>;
    active: import("typebox").TBoolean;
    queued: import("typebox").TOptional<import("typebox").TBoolean>;
    aborted: import("typebox").TOptional<import("typebox").TBoolean>;
    target: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"embedded_run">, import("typebox").TLiteral<"reply_run">]>>;
    reason: import("typebox").TOptional<import("typebox").TString>;
    message: import("typebox").TString;
    speak: import("typebox").TBoolean;
    show: import("typebox").TBoolean;
    suppress: import("typebox").TBoolean;
    providerResult: import("typebox").TOptional<import("typebox").TObject<{
      status: import("typebox").TLiteral<"cancelled">;
      message: import("typebox").TString;
    }>>;
    enqueuedAtMs: import("typebox").TOptional<import("typebox").TNumber>;
    deliveredAtMs: import("typebox").TOptional<import("typebox").TNumber>;
  }>;
  TalkClientToolCallParams: import("typebox").TObject<{
    sessionKey: import("typebox").TString;
    callId: import("typebox").TString;
    name: import("typebox").TString;
    args: import("typebox").TOptional<import("typebox").TUnknown>;
    relaySessionId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  TalkClientToolCallResult: import("typebox").TObject<{
    runId: import("typebox").TString;
    idempotencyKey: import("typebox").TString;
  }>;
  TalkConfigParams: import("typebox").TObject<{
    includeSecrets: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  TalkConfigResult: import("typebox").TObject<{
    config: import("typebox").TObject<{
      talk: import("typebox").TOptional<import("typebox").TObject<{
        provider: import("typebox").TOptional<import("typebox").TString>;
        providers: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TObject<{
          apiKey: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TUnion<[import("typebox").TObject<{
            source: import("typebox").TLiteral<"env">;
            provider: import("typebox").TString;
            id: import("typebox").TString;
          }>, import("typebox").TObject<{
            source: import("typebox").TLiteral<"file">;
            provider: import("typebox").TString;
            id: import("typebox").TUnsafe<string>;
          }>, import("typebox").TObject<{
            source: import("typebox").TLiteral<"exec">;
            provider: import("typebox").TString;
            id: import("typebox").TString;
          }>]>]>>;
        }>>>;
        realtime: import("typebox").TOptional<import("typebox").TObject<{
          provider: import("typebox").TOptional<import("typebox").TString>;
          providers: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TObject<{
            apiKey: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TUnion<[import("typebox").TObject<{
              source: import("typebox").TLiteral<"env">;
              provider: import("typebox").TString;
              id: import("typebox").TString;
            }>, import("typebox").TObject<{
              source: import("typebox").TLiteral<"file">;
              provider: import("typebox").TString;
              id: import("typebox").TUnsafe<string>;
            }>, import("typebox").TObject<{
              source: import("typebox").TLiteral<"exec">;
              provider: import("typebox").TString;
              id: import("typebox").TString;
            }>]>]>>;
          }>>>;
          model: import("typebox").TOptional<import("typebox").TString>;
          speakerVoice: import("typebox").TOptional<import("typebox").TString>;
          speakerVoiceId: import("typebox").TOptional<import("typebox").TString>;
          voice: import("typebox").TOptional<import("typebox").TString>;
          instructions: import("typebox").TOptional<import("typebox").TString>;
          mode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"realtime">, import("typebox").TLiteral<"stt-tts">, import("typebox").TLiteral<"transcription">]>>;
          transport: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"webrtc">, import("typebox").TLiteral<"provider-websocket">, import("typebox").TLiteral<"gateway-relay">, import("typebox").TLiteral<"managed-room">]>>;
          brain: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"agent-consult">, import("typebox").TLiteral<"direct-tools">, import("typebox").TLiteral<"none">]>>;
        }>>;
        resolved: import("typebox").TOptional<import("typebox").TObject<{
          provider: import("typebox").TString;
          config: import("typebox").TObject<{
            apiKey: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TUnion<[import("typebox").TObject<{
              source: import("typebox").TLiteral<"env">;
              provider: import("typebox").TString;
              id: import("typebox").TString;
            }>, import("typebox").TObject<{
              source: import("typebox").TLiteral<"file">;
              provider: import("typebox").TString;
              id: import("typebox").TUnsafe<string>;
            }>, import("typebox").TObject<{
              source: import("typebox").TLiteral<"exec">;
              provider: import("typebox").TString;
              id: import("typebox").TString;
            }>]>]>>;
          }>;
        }>>;
        consultThinkingLevel: import("typebox").TOptional<import("typebox").TString>;
        consultFastMode: import("typebox").TOptional<import("typebox").TBoolean>;
        speechLocale: import("typebox").TOptional<import("typebox").TString>;
        interruptOnSpeech: import("typebox").TOptional<import("typebox").TBoolean>;
        silenceTimeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
      }>>;
      session: import("typebox").TOptional<import("typebox").TObject<{
        mainKey: import("typebox").TOptional<import("typebox").TString>;
      }>>;
      ui: import("typebox").TOptional<import("typebox").TObject<{
        seamColor: import("typebox").TOptional<import("typebox").TString>;
      }>>;
    }>;
  }>;
  TalkSessionAppendAudioParams: import("typebox").TObject<{
    sessionId: import("typebox").TString;
    audioBase64: import("typebox").TString;
    timestamp: import("typebox").TOptional<import("typebox").TNumber>;
  }>;
  TalkSessionCancelOutputParams: import("typebox").TObject<{
    sessionId: import("typebox").TString;
    turnId: import("typebox").TOptional<import("typebox").TString>;
    reason: import("typebox").TOptional<import("typebox").TString>;
  }>;
  TalkSessionCancelTurnParams: import("typebox").TObject<{
    sessionId: import("typebox").TString;
    turnId: import("typebox").TOptional<import("typebox").TString>;
    reason: import("typebox").TOptional<import("typebox").TString>;
  }>;
  TalkSessionCreateParams: import("typebox").TObject<{
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    spawnedBy: import("typebox").TOptional<import("typebox").TString>;
    provider: import("typebox").TOptional<import("typebox").TString>;
    model: import("typebox").TOptional<import("typebox").TString>;
    voice: import("typebox").TOptional<import("typebox").TString>;
    vadThreshold: import("typebox").TOptional<import("typebox").TNumber>;
    silenceDurationMs: import("typebox").TOptional<import("typebox").TInteger>;
    prefixPaddingMs: import("typebox").TOptional<import("typebox").TInteger>;
    reasoningEffort: import("typebox").TOptional<import("typebox").TString>;
    mode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"realtime">, import("typebox").TLiteral<"stt-tts">, import("typebox").TLiteral<"transcription">]>>;
    transport: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"webrtc">, import("typebox").TLiteral<"provider-websocket">, import("typebox").TLiteral<"gateway-relay">, import("typebox").TLiteral<"managed-room">]>>;
    brain: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"agent-consult">, import("typebox").TLiteral<"direct-tools">, import("typebox").TLiteral<"none">]>>;
    ttlMs: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
  TalkSessionCreateResult: import("typebox").TObject<{
    sessionId: import("typebox").TString;
    provider: import("typebox").TOptional<import("typebox").TString>;
    mode: import("typebox").TUnion<[import("typebox").TLiteral<"realtime">, import("typebox").TLiteral<"stt-tts">, import("typebox").TLiteral<"transcription">]>;
    transport: import("typebox").TUnion<[import("typebox").TLiteral<"webrtc">, import("typebox").TLiteral<"provider-websocket">, import("typebox").TLiteral<"gateway-relay">, import("typebox").TLiteral<"managed-room">]>;
    brain: import("typebox").TUnion<[import("typebox").TLiteral<"agent-consult">, import("typebox").TLiteral<"direct-tools">, import("typebox").TLiteral<"none">]>;
    relaySessionId: import("typebox").TOptional<import("typebox").TString>;
    transcriptionSessionId: import("typebox").TOptional<import("typebox").TString>;
    handoffId: import("typebox").TOptional<import("typebox").TString>;
    roomId: import("typebox").TOptional<import("typebox").TString>;
    roomUrl: import("typebox").TOptional<import("typebox").TString>;
    token: import("typebox").TOptional<import("typebox").TString>;
    audio: import("typebox").TOptional<import("typebox").TUnknown>;
    model: import("typebox").TOptional<import("typebox").TString>;
    voice: import("typebox").TOptional<import("typebox").TString>;
    expiresAt: import("typebox").TOptional<import("typebox").TNumber>;
  }>;
  TalkSessionJoinParams: import("typebox").TObject<{
    sessionId: import("typebox").TString;
    token: import("typebox").TString;
  }>;
  TalkSessionJoinResult: import("typebox").TObject<{
    id: import("typebox").TString;
    roomId: import("typebox").TString;
    roomUrl: import("typebox").TString;
    sessionKey: import("typebox").TString;
    sessionId: import("typebox").TOptional<import("typebox").TString>;
    channel: import("typebox").TOptional<import("typebox").TString>;
    target: import("typebox").TOptional<import("typebox").TString>;
    provider: import("typebox").TOptional<import("typebox").TString>;
    model: import("typebox").TOptional<import("typebox").TString>;
    voice: import("typebox").TOptional<import("typebox").TString>;
    mode: import("typebox").TUnion<[import("typebox").TLiteral<"realtime">, import("typebox").TLiteral<"stt-tts">, import("typebox").TLiteral<"transcription">]>;
    transport: import("typebox").TUnion<[import("typebox").TLiteral<"webrtc">, import("typebox").TLiteral<"provider-websocket">, import("typebox").TLiteral<"gateway-relay">, import("typebox").TLiteral<"managed-room">]>;
    brain: import("typebox").TUnion<[import("typebox").TLiteral<"agent-consult">, import("typebox").TLiteral<"direct-tools">, import("typebox").TLiteral<"none">]>;
    createdAt: import("typebox").TNumber;
    expiresAt: import("typebox").TNumber;
    room: import("typebox").TObject<{
      activeClientId: import("typebox").TOptional<import("typebox").TString>;
      activeTurnId: import("typebox").TOptional<import("typebox").TString>;
      recentTalkEvents: import("typebox").TArray<import("typebox").TObject<{
        id: import("typebox").TString;
        type: import("typebox").TUnion<[import("typebox").TLiteral<"session.started">, import("typebox").TLiteral<"session.ready">, import("typebox").TLiteral<"session.closed">, import("typebox").TLiteral<"session.error">, import("typebox").TLiteral<"session.replaced">, import("typebox").TLiteral<"turn.started">, import("typebox").TLiteral<"turn.ended">, import("typebox").TLiteral<"turn.cancelled">, import("typebox").TLiteral<"capture.started">, import("typebox").TLiteral<"capture.stopped">, import("typebox").TLiteral<"capture.cancelled">, import("typebox").TLiteral<"capture.once">, import("typebox").TLiteral<"input.audio.delta">, import("typebox").TLiteral<"input.audio.committed">, import("typebox").TLiteral<"transcript.delta">, import("typebox").TLiteral<"transcript.done">, import("typebox").TLiteral<"output.text.delta">, import("typebox").TLiteral<"output.text.done">, import("typebox").TLiteral<"output.audio.started">, import("typebox").TLiteral<"output.audio.delta">, import("typebox").TLiteral<"output.audio.done">, import("typebox").TLiteral<"tool.call">, import("typebox").TLiteral<"tool.progress">, import("typebox").TLiteral<"tool.result">, import("typebox").TLiteral<"tool.error">, import("typebox").TLiteral<"usage.metrics">, import("typebox").TLiteral<"latency.metrics">, import("typebox").TLiteral<"health.changed">]>;
        sessionId: import("typebox").TString;
        turnId: import("typebox").TOptional<import("typebox").TString>;
        captureId: import("typebox").TOptional<import("typebox").TString>;
        seq: import("typebox").TInteger;
        timestamp: import("typebox").TString;
        mode: import("typebox").TUnion<[import("typebox").TLiteral<"realtime">, import("typebox").TLiteral<"stt-tts">, import("typebox").TLiteral<"transcription">]>;
        transport: import("typebox").TUnion<[import("typebox").TLiteral<"webrtc">, import("typebox").TLiteral<"provider-websocket">, import("typebox").TLiteral<"gateway-relay">, import("typebox").TLiteral<"managed-room">]>;
        brain: import("typebox").TUnion<[import("typebox").TLiteral<"agent-consult">, import("typebox").TLiteral<"direct-tools">, import("typebox").TLiteral<"none">]>;
        provider: import("typebox").TOptional<import("typebox").TString>;
        final: import("typebox").TOptional<import("typebox").TBoolean>;
        callId: import("typebox").TOptional<import("typebox").TString>;
        itemId: import("typebox").TOptional<import("typebox").TString>;
        parentId: import("typebox").TOptional<import("typebox").TString>;
        payload: import("typebox").TUnknown;
      }>>;
    }>;
  }>;
  TalkSessionTurnParams: import("typebox").TObject<{
    sessionId: import("typebox").TString;
    turnId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  TalkSessionTurnResult: import("typebox").TObject<{
    ok: import("typebox").TBoolean;
    turnId: import("typebox").TOptional<import("typebox").TString>;
    events: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TString;
      type: import("typebox").TUnion<[import("typebox").TLiteral<"session.started">, import("typebox").TLiteral<"session.ready">, import("typebox").TLiteral<"session.closed">, import("typebox").TLiteral<"session.error">, import("typebox").TLiteral<"session.replaced">, import("typebox").TLiteral<"turn.started">, import("typebox").TLiteral<"turn.ended">, import("typebox").TLiteral<"turn.cancelled">, import("typebox").TLiteral<"capture.started">, import("typebox").TLiteral<"capture.stopped">, import("typebox").TLiteral<"capture.cancelled">, import("typebox").TLiteral<"capture.once">, import("typebox").TLiteral<"input.audio.delta">, import("typebox").TLiteral<"input.audio.committed">, import("typebox").TLiteral<"transcript.delta">, import("typebox").TLiteral<"transcript.done">, import("typebox").TLiteral<"output.text.delta">, import("typebox").TLiteral<"output.text.done">, import("typebox").TLiteral<"output.audio.started">, import("typebox").TLiteral<"output.audio.delta">, import("typebox").TLiteral<"output.audio.done">, import("typebox").TLiteral<"tool.call">, import("typebox").TLiteral<"tool.progress">, import("typebox").TLiteral<"tool.result">, import("typebox").TLiteral<"tool.error">, import("typebox").TLiteral<"usage.metrics">, import("typebox").TLiteral<"latency.metrics">, import("typebox").TLiteral<"health.changed">]>;
      sessionId: import("typebox").TString;
      turnId: import("typebox").TOptional<import("typebox").TString>;
      captureId: import("typebox").TOptional<import("typebox").TString>;
      seq: import("typebox").TInteger;
      timestamp: import("typebox").TString;
      mode: import("typebox").TUnion<[import("typebox").TLiteral<"realtime">, import("typebox").TLiteral<"stt-tts">, import("typebox").TLiteral<"transcription">]>;
      transport: import("typebox").TUnion<[import("typebox").TLiteral<"webrtc">, import("typebox").TLiteral<"provider-websocket">, import("typebox").TLiteral<"gateway-relay">, import("typebox").TLiteral<"managed-room">]>;
      brain: import("typebox").TUnion<[import("typebox").TLiteral<"agent-consult">, import("typebox").TLiteral<"direct-tools">, import("typebox").TLiteral<"none">]>;
      provider: import("typebox").TOptional<import("typebox").TString>;
      final: import("typebox").TOptional<import("typebox").TBoolean>;
      callId: import("typebox").TOptional<import("typebox").TString>;
      itemId: import("typebox").TOptional<import("typebox").TString>;
      parentId: import("typebox").TOptional<import("typebox").TString>;
      payload: import("typebox").TUnknown;
    }>>>;
  }>;
  TalkSessionSteerParams: import("typebox").TObject<{
    sessionId: import("typebox").TString;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    text: import("typebox").TString;
    mode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"status">, import("typebox").TLiteral<"steer">, import("typebox").TLiteral<"cancel">, import("typebox").TLiteral<"followup">]>>;
  }>;
  TalkSessionSubmitToolResultParams: import("typebox").TObject<{
    sessionId: import("typebox").TString;
    callId: import("typebox").TString;
    result: import("typebox").TUnknown;
    options: import("typebox").TOptional<import("typebox").TObject<{
      suppressResponse: import("typebox").TOptional<import("typebox").TBoolean>;
      willContinue: import("typebox").TOptional<import("typebox").TBoolean>;
    }>>;
  }>;
  TalkSessionCloseParams: import("typebox").TObject<{
    sessionId: import("typebox").TString;
  }>;
  TalkSessionOkResult: import("typebox").TObject<{
    ok: import("typebox").TBoolean;
  }>;
  TalkSpeakParams: import("typebox").TObject<{
    text: import("typebox").TString;
    voiceId: import("typebox").TOptional<import("typebox").TString>;
    modelId: import("typebox").TOptional<import("typebox").TString>;
    outputFormat: import("typebox").TOptional<import("typebox").TString>;
    speed: import("typebox").TOptional<import("typebox").TNumber>;
    rateWpm: import("typebox").TOptional<import("typebox").TInteger>;
    stability: import("typebox").TOptional<import("typebox").TNumber>;
    similarity: import("typebox").TOptional<import("typebox").TNumber>;
    style: import("typebox").TOptional<import("typebox").TNumber>;
    speakerBoost: import("typebox").TOptional<import("typebox").TBoolean>;
    seed: import("typebox").TOptional<import("typebox").TInteger>;
    normalize: import("typebox").TOptional<import("typebox").TString>;
    language: import("typebox").TOptional<import("typebox").TString>;
    latencyTier: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
  TalkSpeakResult: import("typebox").TObject<{
    audioBase64: import("typebox").TString;
    provider: import("typebox").TString;
    outputFormat: import("typebox").TOptional<import("typebox").TString>;
    voiceCompatible: import("typebox").TOptional<import("typebox").TBoolean>;
    mimeType: import("typebox").TOptional<import("typebox").TString>;
    fileExtension: import("typebox").TOptional<import("typebox").TString>;
  }>;
  ChannelsStatusParams: import("typebox").TObject<{
    probe: import("typebox").TOptional<import("typebox").TBoolean>;
    timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
    channel: import("typebox").TOptional<import("typebox").TString>;
  }>;
  ChannelsStatusResult: import("typebox").TObject<{
    ts: import("typebox").TInteger;
    channelOrder: import("typebox").TArray<import("typebox").TString>;
    channelLabels: import("typebox").TRecord<"^.*$", import("typebox").TString>;
    channelDetailLabels: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TString>>;
    channelSystemImages: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TString>>;
    channelMeta: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TString;
      label: import("typebox").TString;
      detailLabel: import("typebox").TString;
      systemImage: import("typebox").TOptional<import("typebox").TString>;
    }>>>;
    channels: import("typebox").TRecord<"^.*$", import("typebox").TUnknown>;
    channelAccounts: import("typebox").TRecord<"^.*$", import("typebox").TArray<import("typebox").TObject<{
      accountId: import("typebox").TString;
      name: import("typebox").TOptional<import("typebox").TString>;
      enabled: import("typebox").TOptional<import("typebox").TBoolean>;
      configured: import("typebox").TOptional<import("typebox").TBoolean>;
      linked: import("typebox").TOptional<import("typebox").TBoolean>;
      running: import("typebox").TOptional<import("typebox").TBoolean>;
      connected: import("typebox").TOptional<import("typebox").TBoolean>;
      reconnectAttempts: import("typebox").TOptional<import("typebox").TInteger>;
      lastConnectedAt: import("typebox").TOptional<import("typebox").TInteger>;
      lastError: import("typebox").TOptional<import("typebox").TString>;
      healthState: import("typebox").TOptional<import("typebox").TString>;
      lastStartAt: import("typebox").TOptional<import("typebox").TInteger>;
      lastStopAt: import("typebox").TOptional<import("typebox").TInteger>;
      lastInboundAt: import("typebox").TOptional<import("typebox").TInteger>;
      lastOutboundAt: import("typebox").TOptional<import("typebox").TInteger>;
      lastTransportActivityAt: import("typebox").TOptional<import("typebox").TInteger>;
      busy: import("typebox").TOptional<import("typebox").TBoolean>;
      activeRuns: import("typebox").TOptional<import("typebox").TInteger>;
      lastRunActivityAt: import("typebox").TOptional<import("typebox").TInteger>;
      lastProbeAt: import("typebox").TOptional<import("typebox").TInteger>;
      mode: import("typebox").TOptional<import("typebox").TString>;
      dmPolicy: import("typebox").TOptional<import("typebox").TString>;
      allowFrom: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
      tokenSource: import("typebox").TOptional<import("typebox").TString>;
      botTokenSource: import("typebox").TOptional<import("typebox").TString>;
      appTokenSource: import("typebox").TOptional<import("typebox").TString>;
      baseUrl: import("typebox").TOptional<import("typebox").TString>;
      allowUnmentionedGroups: import("typebox").TOptional<import("typebox").TBoolean>;
      cliPath: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
      dbPath: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
      port: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TInteger, import("typebox").TNull]>>;
      probe: import("typebox").TOptional<import("typebox").TUnknown>;
      audit: import("typebox").TOptional<import("typebox").TUnknown>;
      application: import("typebox").TOptional<import("typebox").TUnknown>;
    }>>>;
    channelDefaultAccountId: import("typebox").TRecord<"^.*$", import("typebox").TString>;
    eventLoop: import("typebox").TOptional<import("typebox").TObject<{
      degraded: import("typebox").TBoolean;
      reasons: import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"event_loop_delay">, import("typebox").TLiteral<"event_loop_utilization">, import("typebox").TLiteral<"cpu">]>>;
      intervalMs: import("typebox").TInteger;
      delayP99Ms: import("typebox").TNumber;
      delayMaxMs: import("typebox").TNumber;
      utilization: import("typebox").TNumber;
      cpuCoreRatio: import("typebox").TNumber;
    }>>;
    partial: import("typebox").TOptional<import("typebox").TBoolean>;
    warnings: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
  }>;
  ChannelsStartParams: import("typebox").TObject<{
    channel: import("typebox").TString;
    accountId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  ChannelsStopParams: import("typebox").TObject<{
    channel: import("typebox").TString;
    accountId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  ChannelsLogoutParams: import("typebox").TObject<{
    channel: import("typebox").TString;
    accountId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  WebLoginStartParams: import("typebox").TObject<{
    force: import("typebox").TOptional<import("typebox").TBoolean>;
    timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
    verbose: import("typebox").TOptional<import("typebox").TBoolean>;
    accountId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  WebLoginWaitParams: import("typebox").TObject<{
    timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
    accountId: import("typebox").TOptional<import("typebox").TString>;
    currentQrDataUrl: import("typebox").TOptional<import("typebox").TString>;
  }>;
  AgentSummary: import("typebox").TObject<{
    id: import("typebox").TString;
    name: import("typebox").TOptional<import("typebox").TString>;
    identity: import("typebox").TOptional<import("typebox").TObject<{
      name: import("typebox").TOptional<import("typebox").TString>;
      theme: import("typebox").TOptional<import("typebox").TString>;
      emoji: import("typebox").TOptional<import("typebox").TString>;
      avatar: import("typebox").TOptional<import("typebox").TString>;
      avatarUrl: import("typebox").TOptional<import("typebox").TString>;
    }>>;
    workspace: import("typebox").TOptional<import("typebox").TString>;
    model: import("typebox").TOptional<import("typebox").TObject<{
      primary: import("typebox").TOptional<import("typebox").TString>;
      fallbacks: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    }>>;
    agentRuntime: import("typebox").TOptional<import("typebox").TObject<{
      id: import("typebox").TString;
      fallback: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"openclaw">, import("typebox").TLiteral<"none">]>>;
      source: import("typebox").TUnion<[import("typebox").TLiteral<"env">, import("typebox").TLiteral<"agent">, import("typebox").TLiteral<"defaults">, import("typebox").TLiteral<"model">, import("typebox").TLiteral<"provider">, import("typebox").TLiteral<"implicit">]>;
    }>>;
    thinkingLevels: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TString;
      label: import("typebox").TString;
    }>>>;
    thinkingOptions: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    thinkingDefault: import("typebox").TOptional<import("typebox").TString>;
  }>;
  AgentsCreateParams: import("typebox").TObject<{
    name: import("typebox").TString;
    workspace: import("typebox").TString;
    model: import("typebox").TOptional<import("typebox").TString>;
    emoji: import("typebox").TOptional<import("typebox").TString>;
    avatar: import("typebox").TOptional<import("typebox").TString>;
  }>;
  AgentsCreateResult: import("typebox").TObject<{
    ok: import("typebox").TLiteral<true>;
    agentId: import("typebox").TString;
    name: import("typebox").TString;
    workspace: import("typebox").TString;
    model: import("typebox").TOptional<import("typebox").TString>;
  }>;
  AgentsUpdateParams: import("typebox").TObject<{
    agentId: import("typebox").TString;
    name: import("typebox").TOptional<import("typebox").TString>;
    workspace: import("typebox").TOptional<import("typebox").TString>;
    model: import("typebox").TOptional<import("typebox").TString>;
    emoji: import("typebox").TOptional<import("typebox").TString>;
    avatar: import("typebox").TOptional<import("typebox").TString>;
  }>;
  AgentsUpdateResult: import("typebox").TObject<{
    ok: import("typebox").TLiteral<true>;
    agentId: import("typebox").TString;
  }>;
  AgentsDeleteParams: import("typebox").TObject<{
    agentId: import("typebox").TString;
    deleteFiles: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  AgentsDeleteResult: import("typebox").TObject<{
    ok: import("typebox").TLiteral<true>;
    agentId: import("typebox").TString;
    removedBindings: import("typebox").TInteger;
  }>;
  AgentsFileEntry: import("typebox").TObject<{
    name: import("typebox").TString;
    path: import("typebox").TString;
    missing: import("typebox").TBoolean;
    size: import("typebox").TOptional<import("typebox").TInteger>;
    updatedAtMs: import("typebox").TOptional<import("typebox").TInteger>;
    content: import("typebox").TOptional<import("typebox").TString>;
  }>;
  AgentsFilesListParams: import("typebox").TObject<{
    agentId: import("typebox").TString;
  }>;
  AgentsFilesListResult: import("typebox").TObject<{
    agentId: import("typebox").TString;
    workspace: import("typebox").TString;
    files: import("typebox").TArray<import("typebox").TObject<{
      name: import("typebox").TString;
      path: import("typebox").TString;
      missing: import("typebox").TBoolean;
      size: import("typebox").TOptional<import("typebox").TInteger>;
      updatedAtMs: import("typebox").TOptional<import("typebox").TInteger>;
      content: import("typebox").TOptional<import("typebox").TString>;
    }>>;
  }>;
  AgentsFilesGetParams: import("typebox").TObject<{
    agentId: import("typebox").TString;
    name: import("typebox").TString;
  }>;
  AgentsFilesGetResult: import("typebox").TObject<{
    agentId: import("typebox").TString;
    workspace: import("typebox").TString;
    file: import("typebox").TObject<{
      name: import("typebox").TString;
      path: import("typebox").TString;
      missing: import("typebox").TBoolean;
      size: import("typebox").TOptional<import("typebox").TInteger>;
      updatedAtMs: import("typebox").TOptional<import("typebox").TInteger>;
      content: import("typebox").TOptional<import("typebox").TString>;
    }>;
  }>;
  AgentsFilesSetParams: import("typebox").TObject<{
    agentId: import("typebox").TString;
    name: import("typebox").TString;
    content: import("typebox").TString;
  }>;
  AgentsFilesSetResult: import("typebox").TObject<{
    ok: import("typebox").TLiteral<true>;
    agentId: import("typebox").TString;
    workspace: import("typebox").TString;
    file: import("typebox").TObject<{
      name: import("typebox").TString;
      path: import("typebox").TString;
      missing: import("typebox").TBoolean;
      size: import("typebox").TOptional<import("typebox").TInteger>;
      updatedAtMs: import("typebox").TOptional<import("typebox").TInteger>;
      content: import("typebox").TOptional<import("typebox").TString>;
    }>;
  }>;
  ArtifactSummary: import("typebox").TObject<{
    id: import("typebox").TString;
    type: import("typebox").TString;
    title: import("typebox").TString;
    mimeType: import("typebox").TOptional<import("typebox").TString>;
    sizeBytes: import("typebox").TOptional<import("typebox").TInteger>;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    runId: import("typebox").TOptional<import("typebox").TString>;
    taskId: import("typebox").TOptional<import("typebox").TString>;
    messageSeq: import("typebox").TOptional<import("typebox").TInteger>;
    source: import("typebox").TOptional<import("typebox").TString>;
    download: import("typebox").TObject<{
      mode: import("typebox").TUnion<[import("typebox").TLiteral<"bytes">, import("typebox").TLiteral<"url">, import("typebox").TLiteral<"unsupported">]>;
    }>;
  }>;
  ArtifactsListParams: import("typebox").TObject<{
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    runId: import("typebox").TOptional<import("typebox").TString>;
    taskId: import("typebox").TOptional<import("typebox").TString>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  ArtifactsListResult: import("typebox").TObject<{
    artifacts: import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TString;
      type: import("typebox").TString;
      title: import("typebox").TString;
      mimeType: import("typebox").TOptional<import("typebox").TString>;
      sizeBytes: import("typebox").TOptional<import("typebox").TInteger>;
      sessionKey: import("typebox").TOptional<import("typebox").TString>;
      runId: import("typebox").TOptional<import("typebox").TString>;
      taskId: import("typebox").TOptional<import("typebox").TString>;
      messageSeq: import("typebox").TOptional<import("typebox").TInteger>;
      source: import("typebox").TOptional<import("typebox").TString>;
      download: import("typebox").TObject<{
        mode: import("typebox").TUnion<[import("typebox").TLiteral<"bytes">, import("typebox").TLiteral<"url">, import("typebox").TLiteral<"unsupported">]>;
      }>;
    }>>;
  }>;
  ArtifactsGetParams: import("typebox").TObject<{
    artifactId: import("typebox").TString;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    runId: import("typebox").TOptional<import("typebox").TString>;
    taskId: import("typebox").TOptional<import("typebox").TString>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  ArtifactsGetResult: import("typebox").TObject<{
    artifact: import("typebox").TObject<{
      id: import("typebox").TString;
      type: import("typebox").TString;
      title: import("typebox").TString;
      mimeType: import("typebox").TOptional<import("typebox").TString>;
      sizeBytes: import("typebox").TOptional<import("typebox").TInteger>;
      sessionKey: import("typebox").TOptional<import("typebox").TString>;
      runId: import("typebox").TOptional<import("typebox").TString>;
      taskId: import("typebox").TOptional<import("typebox").TString>;
      messageSeq: import("typebox").TOptional<import("typebox").TInteger>;
      source: import("typebox").TOptional<import("typebox").TString>;
      download: import("typebox").TObject<{
        mode: import("typebox").TUnion<[import("typebox").TLiteral<"bytes">, import("typebox").TLiteral<"url">, import("typebox").TLiteral<"unsupported">]>;
      }>;
    }>;
  }>;
  ArtifactsDownloadParams: import("typebox").TObject<{
    artifactId: import("typebox").TString;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    runId: import("typebox").TOptional<import("typebox").TString>;
    taskId: import("typebox").TOptional<import("typebox").TString>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  ArtifactsDownloadResult: import("typebox").TObject<{
    artifact: import("typebox").TObject<{
      id: import("typebox").TString;
      type: import("typebox").TString;
      title: import("typebox").TString;
      mimeType: import("typebox").TOptional<import("typebox").TString>;
      sizeBytes: import("typebox").TOptional<import("typebox").TInteger>;
      sessionKey: import("typebox").TOptional<import("typebox").TString>;
      runId: import("typebox").TOptional<import("typebox").TString>;
      taskId: import("typebox").TOptional<import("typebox").TString>;
      messageSeq: import("typebox").TOptional<import("typebox").TInteger>;
      source: import("typebox").TOptional<import("typebox").TString>;
      download: import("typebox").TObject<{
        mode: import("typebox").TUnion<[import("typebox").TLiteral<"bytes">, import("typebox").TLiteral<"url">, import("typebox").TLiteral<"unsupported">]>;
      }>;
    }>;
    encoding: import("typebox").TOptional<import("typebox").TLiteral<"base64">>;
    data: import("typebox").TOptional<import("typebox").TString>;
    url: import("typebox").TOptional<import("typebox").TString>;
  }>;
  AgentsListParams: import("typebox").TObject<{}>;
  AgentsListResult: import("typebox").TObject<{
    defaultId: import("typebox").TString;
    mainKey: import("typebox").TString;
    scope: import("typebox").TUnion<[import("typebox").TLiteral<"per-sender">, import("typebox").TLiteral<"global">]>;
    agents: import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TString;
      name: import("typebox").TOptional<import("typebox").TString>;
      identity: import("typebox").TOptional<import("typebox").TObject<{
        name: import("typebox").TOptional<import("typebox").TString>;
        theme: import("typebox").TOptional<import("typebox").TString>;
        emoji: import("typebox").TOptional<import("typebox").TString>;
        avatar: import("typebox").TOptional<import("typebox").TString>;
        avatarUrl: import("typebox").TOptional<import("typebox").TString>;
      }>>;
      workspace: import("typebox").TOptional<import("typebox").TString>;
      model: import("typebox").TOptional<import("typebox").TObject<{
        primary: import("typebox").TOptional<import("typebox").TString>;
        fallbacks: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
      }>>;
      agentRuntime: import("typebox").TOptional<import("typebox").TObject<{
        id: import("typebox").TString;
        fallback: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"openclaw">, import("typebox").TLiteral<"none">]>>;
        source: import("typebox").TUnion<[import("typebox").TLiteral<"env">, import("typebox").TLiteral<"agent">, import("typebox").TLiteral<"defaults">, import("typebox").TLiteral<"model">, import("typebox").TLiteral<"provider">, import("typebox").TLiteral<"implicit">]>;
      }>>;
      thinkingLevels: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
        id: import("typebox").TString;
        label: import("typebox").TString;
      }>>>;
      thinkingOptions: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
      thinkingDefault: import("typebox").TOptional<import("typebox").TString>;
    }>>;
  }>;
  ModelChoice: import("typebox").TObject<{
    id: import("typebox").TString;
    name: import("typebox").TString;
    provider: import("typebox").TString;
    alias: import("typebox").TOptional<import("typebox").TString>;
    available: import("typebox").TOptional<import("typebox").TBoolean>;
    contextWindow: import("typebox").TOptional<import("typebox").TInteger>;
    reasoning: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  ModelsListParams: import("typebox").TObject<{
    view: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"default">, import("typebox").TLiteral<"configured">, import("typebox").TLiteral<"all">]>>;
  }>;
  ModelsListResult: import("typebox").TObject<{
    models: import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TString;
      name: import("typebox").TString;
      provider: import("typebox").TString;
      alias: import("typebox").TOptional<import("typebox").TString>;
      available: import("typebox").TOptional<import("typebox").TBoolean>;
      contextWindow: import("typebox").TOptional<import("typebox").TInteger>;
      reasoning: import("typebox").TOptional<import("typebox").TBoolean>;
    }>>;
  }>;
  CommandEntry: import("typebox").TObject<{
    name: import("typebox").TString;
    nativeName: import("typebox").TOptional<import("typebox").TString>;
    textAliases: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    description: import("typebox").TString;
    category: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"session">, import("typebox").TLiteral<"options">, import("typebox").TLiteral<"status">, import("typebox").TLiteral<"management">, import("typebox").TLiteral<"media">, import("typebox").TLiteral<"tools">, import("typebox").TLiteral<"docks">]>>;
    source: import("typebox").TUnion<[import("typebox").TLiteral<"native">, import("typebox").TLiteral<"skill">, import("typebox").TLiteral<"plugin">]>;
    scope: import("typebox").TUnion<[import("typebox").TLiteral<"text">, import("typebox").TLiteral<"native">, import("typebox").TLiteral<"both">]>;
    acceptsArgs: import("typebox").TBoolean;
    args: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
      name: import("typebox").TString;
      description: import("typebox").TString;
      type: import("typebox").TUnion<[import("typebox").TLiteral<"string">, import("typebox").TLiteral<"number">, import("typebox").TLiteral<"boolean">]>;
      required: import("typebox").TOptional<import("typebox").TBoolean>;
      choices: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
        value: import("typebox").TString;
        label: import("typebox").TString;
      }>>>;
      dynamic: import("typebox").TOptional<import("typebox").TBoolean>;
    }>>>;
  }>;
  CommandsListParams: import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
    provider: import("typebox").TOptional<import("typebox").TString>;
    scope: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"text">, import("typebox").TLiteral<"native">, import("typebox").TLiteral<"both">]>>;
    includeArgs: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  CommandsListResult: import("typebox").TObject<{
    commands: import("typebox").TArray<import("typebox").TObject<{
      name: import("typebox").TString;
      nativeName: import("typebox").TOptional<import("typebox").TString>;
      textAliases: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
      description: import("typebox").TString;
      category: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"session">, import("typebox").TLiteral<"options">, import("typebox").TLiteral<"status">, import("typebox").TLiteral<"management">, import("typebox").TLiteral<"media">, import("typebox").TLiteral<"tools">, import("typebox").TLiteral<"docks">]>>;
      source: import("typebox").TUnion<[import("typebox").TLiteral<"native">, import("typebox").TLiteral<"skill">, import("typebox").TLiteral<"plugin">]>;
      scope: import("typebox").TUnion<[import("typebox").TLiteral<"text">, import("typebox").TLiteral<"native">, import("typebox").TLiteral<"both">]>;
      acceptsArgs: import("typebox").TBoolean;
      args: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
        name: import("typebox").TString;
        description: import("typebox").TString;
        type: import("typebox").TUnion<[import("typebox").TLiteral<"string">, import("typebox").TLiteral<"number">, import("typebox").TLiteral<"boolean">]>;
        required: import("typebox").TOptional<import("typebox").TBoolean>;
        choices: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
          value: import("typebox").TString;
          label: import("typebox").TString;
        }>>>;
        dynamic: import("typebox").TOptional<import("typebox").TBoolean>;
      }>>>;
    }>>;
  }>;
  SkillsStatusParams: import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  ToolsCatalogParams: import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
    includePlugins: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  ToolCatalogProfile: import("typebox").TObject<{
    id: import("typebox").TUnion<[import("typebox").TLiteral<"minimal">, import("typebox").TLiteral<"coding">, import("typebox").TLiteral<"messaging">, import("typebox").TLiteral<"full">]>;
    label: import("typebox").TString;
  }>;
  ToolCatalogEntry: import("typebox").TObject<{
    id: import("typebox").TString;
    label: import("typebox").TString;
    description: import("typebox").TString;
    source: import("typebox").TUnion<[import("typebox").TLiteral<"core">, import("typebox").TLiteral<"plugin">]>;
    pluginId: import("typebox").TOptional<import("typebox").TString>;
    optional: import("typebox").TOptional<import("typebox").TBoolean>;
    risk: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"low">, import("typebox").TLiteral<"medium">, import("typebox").TLiteral<"high">]>>;
    tags: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    defaultProfiles: import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"minimal">, import("typebox").TLiteral<"coding">, import("typebox").TLiteral<"messaging">, import("typebox").TLiteral<"full">]>>;
  }>;
  ToolCatalogGroup: import("typebox").TObject<{
    id: import("typebox").TString;
    label: import("typebox").TString;
    source: import("typebox").TUnion<[import("typebox").TLiteral<"core">, import("typebox").TLiteral<"plugin">]>;
    pluginId: import("typebox").TOptional<import("typebox").TString>;
    tools: import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TString;
      label: import("typebox").TString;
      description: import("typebox").TString;
      source: import("typebox").TUnion<[import("typebox").TLiteral<"core">, import("typebox").TLiteral<"plugin">]>;
      pluginId: import("typebox").TOptional<import("typebox").TString>;
      optional: import("typebox").TOptional<import("typebox").TBoolean>;
      risk: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"low">, import("typebox").TLiteral<"medium">, import("typebox").TLiteral<"high">]>>;
      tags: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
      defaultProfiles: import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"minimal">, import("typebox").TLiteral<"coding">, import("typebox").TLiteral<"messaging">, import("typebox").TLiteral<"full">]>>;
    }>>;
  }>;
  ToolsCatalogResult: import("typebox").TObject<{
    agentId: import("typebox").TString;
    profiles: import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TUnion<[import("typebox").TLiteral<"minimal">, import("typebox").TLiteral<"coding">, import("typebox").TLiteral<"messaging">, import("typebox").TLiteral<"full">]>;
      label: import("typebox").TString;
    }>>;
    groups: import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TString;
      label: import("typebox").TString;
      source: import("typebox").TUnion<[import("typebox").TLiteral<"core">, import("typebox").TLiteral<"plugin">]>;
      pluginId: import("typebox").TOptional<import("typebox").TString>;
      tools: import("typebox").TArray<import("typebox").TObject<{
        id: import("typebox").TString;
        label: import("typebox").TString;
        description: import("typebox").TString;
        source: import("typebox").TUnion<[import("typebox").TLiteral<"core">, import("typebox").TLiteral<"plugin">]>;
        pluginId: import("typebox").TOptional<import("typebox").TString>;
        optional: import("typebox").TOptional<import("typebox").TBoolean>;
        risk: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"low">, import("typebox").TLiteral<"medium">, import("typebox").TLiteral<"high">]>>;
        tags: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
        defaultProfiles: import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"minimal">, import("typebox").TLiteral<"coding">, import("typebox").TLiteral<"messaging">, import("typebox").TLiteral<"full">]>>;
      }>>;
    }>>;
  }>;
  ToolsEffectiveParams: import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
    sessionKey: import("typebox").TString;
  }>;
  ToolsEffectiveEntry: import("typebox").TObject<{
    id: import("typebox").TString;
    label: import("typebox").TString;
    description: import("typebox").TString;
    rawDescription: import("typebox").TString;
    source: import("typebox").TUnion<[import("typebox").TLiteral<"core">, import("typebox").TLiteral<"plugin">, import("typebox").TLiteral<"channel">, import("typebox").TLiteral<"mcp">]>;
    pluginId: import("typebox").TOptional<import("typebox").TString>;
    channelId: import("typebox").TOptional<import("typebox").TString>;
    risk: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"low">, import("typebox").TLiteral<"medium">, import("typebox").TLiteral<"high">]>>;
    tags: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
  }>;
  ToolsEffectiveGroup: import("typebox").TObject<{
    id: import("typebox").TUnion<[import("typebox").TLiteral<"core">, import("typebox").TLiteral<"plugin">, import("typebox").TLiteral<"channel">, import("typebox").TLiteral<"mcp">]>;
    label: import("typebox").TString;
    source: import("typebox").TUnion<[import("typebox").TLiteral<"core">, import("typebox").TLiteral<"plugin">, import("typebox").TLiteral<"channel">, import("typebox").TLiteral<"mcp">]>;
    tools: import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TString;
      label: import("typebox").TString;
      description: import("typebox").TString;
      rawDescription: import("typebox").TString;
      source: import("typebox").TUnion<[import("typebox").TLiteral<"core">, import("typebox").TLiteral<"plugin">, import("typebox").TLiteral<"channel">, import("typebox").TLiteral<"mcp">]>;
      pluginId: import("typebox").TOptional<import("typebox").TString>;
      channelId: import("typebox").TOptional<import("typebox").TString>;
      risk: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"low">, import("typebox").TLiteral<"medium">, import("typebox").TLiteral<"high">]>>;
      tags: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    }>>;
  }>;
  ToolsEffectiveNotice: import("typebox").TObject<{
    id: import("typebox").TString;
    severity: import("typebox").TUnion<[import("typebox").TLiteral<"info">, import("typebox").TLiteral<"warning">]>;
    message: import("typebox").TString;
  }>;
  ToolsEffectiveResult: import("typebox").TObject<{
    agentId: import("typebox").TString;
    profile: import("typebox").TString;
    groups: import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TUnion<[import("typebox").TLiteral<"core">, import("typebox").TLiteral<"plugin">, import("typebox").TLiteral<"channel">, import("typebox").TLiteral<"mcp">]>;
      label: import("typebox").TString;
      source: import("typebox").TUnion<[import("typebox").TLiteral<"core">, import("typebox").TLiteral<"plugin">, import("typebox").TLiteral<"channel">, import("typebox").TLiteral<"mcp">]>;
      tools: import("typebox").TArray<import("typebox").TObject<{
        id: import("typebox").TString;
        label: import("typebox").TString;
        description: import("typebox").TString;
        rawDescription: import("typebox").TString;
        source: import("typebox").TUnion<[import("typebox").TLiteral<"core">, import("typebox").TLiteral<"plugin">, import("typebox").TLiteral<"channel">, import("typebox").TLiteral<"mcp">]>;
        pluginId: import("typebox").TOptional<import("typebox").TString>;
        channelId: import("typebox").TOptional<import("typebox").TString>;
        risk: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"low">, import("typebox").TLiteral<"medium">, import("typebox").TLiteral<"high">]>>;
        tags: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
      }>>;
    }>>;
    notices: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TString;
      severity: import("typebox").TUnion<[import("typebox").TLiteral<"info">, import("typebox").TLiteral<"warning">]>;
      message: import("typebox").TString;
    }>>>;
  }>;
  ToolsInvokeParams: import("typebox").TObject<{
    name: import("typebox").TString;
    args: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TUnknown>>;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    confirm: import("typebox").TOptional<import("typebox").TBoolean>;
    idempotencyKey: import("typebox").TOptional<import("typebox").TString>;
  }>;
  ToolsInvokeError: import("typebox").TObject<{
    code: import("typebox").TString;
    message: import("typebox").TString;
    details: import("typebox").TOptional<import("typebox").TUnknown>;
  }>;
  ToolsInvokeResult: import("typebox").TObject<{
    ok: import("typebox").TBoolean;
    toolName: import("typebox").TString;
    output: import("typebox").TOptional<import("typebox").TUnknown>;
    requiresApproval: import("typebox").TOptional<import("typebox").TBoolean>;
    approvalId: import("typebox").TOptional<import("typebox").TString>;
    source: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"core">, import("typebox").TLiteral<"plugin">, import("typebox").TLiteral<"mcp">, import("typebox").TLiteral<"channel">, import("typebox").TString]>>;
    error: import("typebox").TOptional<import("typebox").TObject<{
      code: import("typebox").TString;
      message: import("typebox").TString;
      details: import("typebox").TOptional<import("typebox").TUnknown>;
    }>>;
  }>;
  SkillsBinsParams: import("typebox").TObject<{}>;
  SkillsBinsResult: import("typebox").TObject<{
    bins: import("typebox").TArray<import("typebox").TString>;
  }>;
  SkillsSearchParams: import("typebox").TObject<{
    query: import("typebox").TOptional<import("typebox").TString>;
    limit: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
  SkillsSearchResult: import("typebox").TObject<{
    results: import("typebox").TArray<import("typebox").TObject<{
      score: import("typebox").TNumber;
      slug: import("typebox").TString;
      displayName: import("typebox").TString;
      summary: import("typebox").TOptional<import("typebox").TString>;
      version: import("typebox").TOptional<import("typebox").TString>;
      updatedAt: import("typebox").TOptional<import("typebox").TInteger>;
    }>>;
  }>;
  SkillsDetailParams: import("typebox").TObject<{
    slug: import("typebox").TString;
  }>;
  SkillsDetailResult: import("typebox").TObject<{
    skill: import("typebox").TUnion<[import("typebox").TObject<{
      slug: import("typebox").TString;
      displayName: import("typebox").TString;
      summary: import("typebox").TOptional<import("typebox").TString>;
      tags: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TString>>;
      createdAt: import("typebox").TInteger;
      updatedAt: import("typebox").TInteger;
    }>, import("typebox").TNull]>;
    latestVersion: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TObject<{
      version: import("typebox").TString;
      createdAt: import("typebox").TInteger;
      changelog: import("typebox").TOptional<import("typebox").TString>;
    }>, import("typebox").TNull]>>;
    metadata: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TObject<{
      os: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TArray<import("typebox").TString>, import("typebox").TNull]>>;
      systems: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TArray<import("typebox").TString>, import("typebox").TNull]>>;
    }>, import("typebox").TNull]>>;
    owner: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TObject<{
      handle: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
      displayName: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
      image: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    }>, import("typebox").TNull]>>;
  }>;
  SkillsProposalsListParams: import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SkillsProposalsListResult: import("typebox").TObject<{
    schema: import("typebox").TLiteral<"openclaw.skill-workshop.proposals-manifest.v1">;
    updatedAt: import("typebox").TString;
    proposals: import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TString;
      kind: import("typebox").TUnion<[import("typebox").TLiteral<"create">, import("typebox").TLiteral<"update">]>;
      status: import("typebox").TUnion<[import("typebox").TLiteral<"pending">, import("typebox").TLiteral<"applied">, import("typebox").TLiteral<"rejected">, import("typebox").TLiteral<"quarantined">, import("typebox").TLiteral<"stale">]>;
      title: import("typebox").TString;
      description: import("typebox").TString;
      skillName: import("typebox").TString;
      skillKey: import("typebox").TString;
      createdAt: import("typebox").TString;
      updatedAt: import("typebox").TString;
      scanState: import("typebox").TUnion<[import("typebox").TLiteral<"pending">, import("typebox").TLiteral<"clean">, import("typebox").TLiteral<"failed">, import("typebox").TLiteral<"quarantined">]>;
    }>>;
  }>;
  SkillsProposalInspectParams: import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
    proposalId: import("typebox").TString;
  }>;
  SkillsProposalInspectResult: import("typebox").TObject<{
    record: import("typebox").TObject<{
      schema: import("typebox").TLiteral<"openclaw.skill-workshop.proposal.v1">;
      id: import("typebox").TString;
      kind: import("typebox").TUnion<[import("typebox").TLiteral<"create">, import("typebox").TLiteral<"update">]>;
      status: import("typebox").TUnion<[import("typebox").TLiteral<"pending">, import("typebox").TLiteral<"applied">, import("typebox").TLiteral<"rejected">, import("typebox").TLiteral<"quarantined">, import("typebox").TLiteral<"stale">]>;
      title: import("typebox").TString;
      description: import("typebox").TString;
      createdAt: import("typebox").TString;
      updatedAt: import("typebox").TString;
      createdBy: import("typebox").TUnion<[import("typebox").TLiteral<"skill-workshop">, import("typebox").TLiteral<"cli">, import("typebox").TLiteral<"gateway">]>;
      origin: import("typebox").TOptional<import("typebox").TObject<{
        agentId: import("typebox").TOptional<import("typebox").TString>;
        sessionKey: import("typebox").TOptional<import("typebox").TString>;
        runId: import("typebox").TOptional<import("typebox").TString>;
        messageId: import("typebox").TOptional<import("typebox").TString>;
      }>>;
      proposedVersion: import("typebox").TString;
      draftFile: import("typebox").TLiteral<"PROPOSAL.md">;
      draftHash: import("typebox").TString;
      supportFiles: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
        path: import("typebox").TString;
        sizeBytes: import("typebox").TInteger;
        hash: import("typebox").TString;
        targetExisted: import("typebox").TOptional<import("typebox").TBoolean>;
        targetContentHash: import("typebox").TOptional<import("typebox").TString>;
      }>>>;
      target: import("typebox").TObject<{
        skillName: import("typebox").TString;
        skillKey: import("typebox").TString;
        skillDir: import("typebox").TString;
        skillFile: import("typebox").TString;
        source: import("typebox").TOptional<import("typebox").TString>;
        currentContentHash: import("typebox").TOptional<import("typebox").TString>;
      }>;
      scan: import("typebox").TObject<{
        state: import("typebox").TUnion<[import("typebox").TLiteral<"pending">, import("typebox").TLiteral<"clean">, import("typebox").TLiteral<"failed">, import("typebox").TLiteral<"quarantined">]>;
        scannedAt: import("typebox").TString;
        critical: import("typebox").TInteger;
        warn: import("typebox").TInteger;
        info: import("typebox").TInteger;
        findings: import("typebox").TArray<import("typebox").TObject<{
          ruleId: import("typebox").TString;
          severity: import("typebox").TUnion<[import("typebox").TLiteral<"info">, import("typebox").TLiteral<"warn">, import("typebox").TLiteral<"critical">]>;
          file: import("typebox").TString;
          line: import("typebox").TInteger;
          message: import("typebox").TString;
          evidence: import("typebox").TString;
        }>>;
      }>;
      goal: import("typebox").TOptional<import("typebox").TString>;
      evidence: import("typebox").TOptional<import("typebox").TString>;
      appliedAt: import("typebox").TOptional<import("typebox").TString>;
      rejectedAt: import("typebox").TOptional<import("typebox").TString>;
      quarantinedAt: import("typebox").TOptional<import("typebox").TString>;
      staleAt: import("typebox").TOptional<import("typebox").TString>;
      statusReason: import("typebox").TOptional<import("typebox").TString>;
    }>;
    content: import("typebox").TString;
    supportFiles: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
      path: import("typebox").TString;
      content: import("typebox").TString;
    }>>>;
  }>;
  SkillsProposalCreateParams: import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
    name: import("typebox").TString;
    description: import("typebox").TString;
    content: import("typebox").TString;
    supportFiles: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
      path: import("typebox").TString;
      content: import("typebox").TString;
    }>>>;
    goal: import("typebox").TOptional<import("typebox").TString>;
    evidence: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SkillsProposalUpdateParams: import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
    skillName: import("typebox").TString;
    description: import("typebox").TOptional<import("typebox").TString>;
    content: import("typebox").TString;
    supportFiles: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
      path: import("typebox").TString;
      content: import("typebox").TString;
    }>>>;
    goal: import("typebox").TOptional<import("typebox").TString>;
    evidence: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SkillsProposalReviseParams: import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
    proposalId: import("typebox").TString;
    content: import("typebox").TString;
    supportFiles: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
      path: import("typebox").TString;
      content: import("typebox").TString;
    }>>>;
    description: import("typebox").TOptional<import("typebox").TString>;
    goal: import("typebox").TOptional<import("typebox").TString>;
    evidence: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SkillsProposalRequestRevisionParams: import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
    targetAgentId: import("typebox").TOptional<import("typebox").TString>;
    proposalId: import("typebox").TString;
    instructions: import("typebox").TString;
    sessionKey: import("typebox").TString;
    sessionId: import("typebox").TOptional<import("typebox").TString>;
    idempotencyKey: import("typebox").TString;
  }>;
  SkillsProposalRequestRevisionResult: import("typebox").TObject<{
    runId: import("typebox").TString;
    status: import("typebox").TUnion<[import("typebox").TLiteral<"started">, import("typebox").TLiteral<"in_flight">, import("typebox").TLiteral<"ok">, import("typebox").TLiteral<"timeout">, import("typebox").TLiteral<"error">]>;
  }>;
  SkillsProposalActionParams: import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
    proposalId: import("typebox").TString;
    reason: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SkillsProposalApplyResult: import("typebox").TObject<{
    record: import("typebox").TObject<{
      schema: import("typebox").TLiteral<"openclaw.skill-workshop.proposal.v1">;
      id: import("typebox").TString;
      kind: import("typebox").TUnion<[import("typebox").TLiteral<"create">, import("typebox").TLiteral<"update">]>;
      status: import("typebox").TUnion<[import("typebox").TLiteral<"pending">, import("typebox").TLiteral<"applied">, import("typebox").TLiteral<"rejected">, import("typebox").TLiteral<"quarantined">, import("typebox").TLiteral<"stale">]>;
      title: import("typebox").TString;
      description: import("typebox").TString;
      createdAt: import("typebox").TString;
      updatedAt: import("typebox").TString;
      createdBy: import("typebox").TUnion<[import("typebox").TLiteral<"skill-workshop">, import("typebox").TLiteral<"cli">, import("typebox").TLiteral<"gateway">]>;
      origin: import("typebox").TOptional<import("typebox").TObject<{
        agentId: import("typebox").TOptional<import("typebox").TString>;
        sessionKey: import("typebox").TOptional<import("typebox").TString>;
        runId: import("typebox").TOptional<import("typebox").TString>;
        messageId: import("typebox").TOptional<import("typebox").TString>;
      }>>;
      proposedVersion: import("typebox").TString;
      draftFile: import("typebox").TLiteral<"PROPOSAL.md">;
      draftHash: import("typebox").TString;
      supportFiles: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
        path: import("typebox").TString;
        sizeBytes: import("typebox").TInteger;
        hash: import("typebox").TString;
        targetExisted: import("typebox").TOptional<import("typebox").TBoolean>;
        targetContentHash: import("typebox").TOptional<import("typebox").TString>;
      }>>>;
      target: import("typebox").TObject<{
        skillName: import("typebox").TString;
        skillKey: import("typebox").TString;
        skillDir: import("typebox").TString;
        skillFile: import("typebox").TString;
        source: import("typebox").TOptional<import("typebox").TString>;
        currentContentHash: import("typebox").TOptional<import("typebox").TString>;
      }>;
      scan: import("typebox").TObject<{
        state: import("typebox").TUnion<[import("typebox").TLiteral<"pending">, import("typebox").TLiteral<"clean">, import("typebox").TLiteral<"failed">, import("typebox").TLiteral<"quarantined">]>;
        scannedAt: import("typebox").TString;
        critical: import("typebox").TInteger;
        warn: import("typebox").TInteger;
        info: import("typebox").TInteger;
        findings: import("typebox").TArray<import("typebox").TObject<{
          ruleId: import("typebox").TString;
          severity: import("typebox").TUnion<[import("typebox").TLiteral<"info">, import("typebox").TLiteral<"warn">, import("typebox").TLiteral<"critical">]>;
          file: import("typebox").TString;
          line: import("typebox").TInteger;
          message: import("typebox").TString;
          evidence: import("typebox").TString;
        }>>;
      }>;
      goal: import("typebox").TOptional<import("typebox").TString>;
      evidence: import("typebox").TOptional<import("typebox").TString>;
      appliedAt: import("typebox").TOptional<import("typebox").TString>;
      rejectedAt: import("typebox").TOptional<import("typebox").TString>;
      quarantinedAt: import("typebox").TOptional<import("typebox").TString>;
      staleAt: import("typebox").TOptional<import("typebox").TString>;
      statusReason: import("typebox").TOptional<import("typebox").TString>;
    }>;
    targetSkillFile: import("typebox").TString;
  }>;
  SkillsProposalRecordResult: import("typebox").TObject<{
    schema: import("typebox").TLiteral<"openclaw.skill-workshop.proposal.v1">;
    id: import("typebox").TString;
    kind: import("typebox").TUnion<[import("typebox").TLiteral<"create">, import("typebox").TLiteral<"update">]>;
    status: import("typebox").TUnion<[import("typebox").TLiteral<"pending">, import("typebox").TLiteral<"applied">, import("typebox").TLiteral<"rejected">, import("typebox").TLiteral<"quarantined">, import("typebox").TLiteral<"stale">]>;
    title: import("typebox").TString;
    description: import("typebox").TString;
    createdAt: import("typebox").TString;
    updatedAt: import("typebox").TString;
    createdBy: import("typebox").TUnion<[import("typebox").TLiteral<"skill-workshop">, import("typebox").TLiteral<"cli">, import("typebox").TLiteral<"gateway">]>;
    origin: import("typebox").TOptional<import("typebox").TObject<{
      agentId: import("typebox").TOptional<import("typebox").TString>;
      sessionKey: import("typebox").TOptional<import("typebox").TString>;
      runId: import("typebox").TOptional<import("typebox").TString>;
      messageId: import("typebox").TOptional<import("typebox").TString>;
    }>>;
    proposedVersion: import("typebox").TString;
    draftFile: import("typebox").TLiteral<"PROPOSAL.md">;
    draftHash: import("typebox").TString;
    supportFiles: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
      path: import("typebox").TString;
      sizeBytes: import("typebox").TInteger;
      hash: import("typebox").TString;
      targetExisted: import("typebox").TOptional<import("typebox").TBoolean>;
      targetContentHash: import("typebox").TOptional<import("typebox").TString>;
    }>>>;
    target: import("typebox").TObject<{
      skillName: import("typebox").TString;
      skillKey: import("typebox").TString;
      skillDir: import("typebox").TString;
      skillFile: import("typebox").TString;
      source: import("typebox").TOptional<import("typebox").TString>;
      currentContentHash: import("typebox").TOptional<import("typebox").TString>;
    }>;
    scan: import("typebox").TObject<{
      state: import("typebox").TUnion<[import("typebox").TLiteral<"pending">, import("typebox").TLiteral<"clean">, import("typebox").TLiteral<"failed">, import("typebox").TLiteral<"quarantined">]>;
      scannedAt: import("typebox").TString;
      critical: import("typebox").TInteger;
      warn: import("typebox").TInteger;
      info: import("typebox").TInteger;
      findings: import("typebox").TArray<import("typebox").TObject<{
        ruleId: import("typebox").TString;
        severity: import("typebox").TUnion<[import("typebox").TLiteral<"info">, import("typebox").TLiteral<"warn">, import("typebox").TLiteral<"critical">]>;
        file: import("typebox").TString;
        line: import("typebox").TInteger;
        message: import("typebox").TString;
        evidence: import("typebox").TString;
      }>>;
    }>;
    goal: import("typebox").TOptional<import("typebox").TString>;
    evidence: import("typebox").TOptional<import("typebox").TString>;
    appliedAt: import("typebox").TOptional<import("typebox").TString>;
    rejectedAt: import("typebox").TOptional<import("typebox").TString>;
    quarantinedAt: import("typebox").TOptional<import("typebox").TString>;
    staleAt: import("typebox").TOptional<import("typebox").TString>;
    statusReason: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SkillsSecurityVerdictsParams: import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SkillsSecurityVerdictsResult: import("typebox").TObject<{
    schema: import("typebox").TLiteral<"openclaw.skills.security-verdicts.v1">;
    items: import("typebox").TArray<import("typebox").TObject<{
      registry: import("typebox").TString;
      ok: import("typebox").TBoolean;
      decision: import("typebox").TString;
      reasons: import("typebox").TArray<import("typebox").TString>;
      requestedSlug: import("typebox").TString;
      requestedVersion: import("typebox").TString;
      slug: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
      version: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
      displayName: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
      publisherHandle: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
      publisherDisplayName: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
      createdAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TInteger, import("typebox").TNull]>>;
      checkedAt: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TInteger, import("typebox").TNull]>>;
      skillUrl: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
      securityAuditUrl: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
      securityStatus: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
      securityPassed: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TBoolean, import("typebox").TNull]>>;
      error: import("typebox").TOptional<import("typebox").TObject<{
        code: import("typebox").TOptional<import("typebox").TString>;
        message: import("typebox").TOptional<import("typebox").TString>;
      }>>;
    }>>;
  }>;
  SkillsSkillCardParams: import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
    skillKey: import("typebox").TString;
  }>;
  SkillsSkillCardResult: import("typebox").TObject<{
    schema: import("typebox").TLiteral<"openclaw.skills.skill-card.v1">;
    skillKey: import("typebox").TString;
    path: import("typebox").TString;
    sizeBytes: import("typebox").TInteger;
    content: import("typebox").TString;
  }>;
  SkillsUploadBeginParams: import("typebox").TObject<{
    kind: import("typebox").TLiteral<"skill-archive">;
    slug: import("typebox").TString;
    sizeBytes: import("typebox").TInteger;
    sha256: import("typebox").TOptional<import("typebox").TString>;
    force: import("typebox").TOptional<import("typebox").TBoolean>;
    idempotencyKey: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SkillsUploadChunkParams: import("typebox").TObject<{
    uploadId: import("typebox").TString;
    offset: import("typebox").TInteger;
    dataBase64: import("typebox").TString;
  }>;
  SkillsUploadCommitParams: import("typebox").TObject<{
    uploadId: import("typebox").TString;
    sha256: import("typebox").TOptional<import("typebox").TString>;
  }>;
  SkillsInstallParams: import("typebox").TUnion<[import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
    name: import("typebox").TString;
    installId: import("typebox").TString;
    dangerouslyForceUnsafeInstall: import("typebox").TOptional<import("typebox").TBoolean>;
    timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
  }>, import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
    source: import("typebox").TLiteral<"clawhub">;
    slug: import("typebox").TString;
    version: import("typebox").TOptional<import("typebox").TString>;
    force: import("typebox").TOptional<import("typebox").TBoolean>;
    timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
  }>, import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
    source: import("typebox").TLiteral<"upload">;
    uploadId: import("typebox").TString;
    slug: import("typebox").TString;
    force: import("typebox").TOptional<import("typebox").TBoolean>;
    sha256: import("typebox").TOptional<import("typebox").TString>;
    timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
  }>]>;
  SkillsUpdateParams: import("typebox").TUnion<[import("typebox").TObject<{
    skillKey: import("typebox").TString;
    enabled: import("typebox").TOptional<import("typebox").TBoolean>;
    apiKey: import("typebox").TOptional<import("typebox").TString>;
    env: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TString>>;
  }>, import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
    source: import("typebox").TLiteral<"clawhub">;
    slug: import("typebox").TOptional<import("typebox").TString>;
    all: import("typebox").TOptional<import("typebox").TBoolean>;
  }>]>;
  CronJob: import("typebox").TObject<{
    id: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    name: import("typebox").TString;
    description: import("typebox").TOptional<import("typebox").TString>;
    enabled: import("typebox").TBoolean;
    deleteAfterRun: import("typebox").TOptional<import("typebox").TBoolean>;
    createdAtMs: import("typebox").TInteger;
    updatedAtMs: import("typebox").TInteger;
    schedule: import("typebox").TUnion<[import("typebox").TObject<{
      kind: import("typebox").TLiteral<"at">;
      at: import("typebox").TString;
    }>, import("typebox").TObject<{
      kind: import("typebox").TLiteral<"every">;
      everyMs: import("typebox").TInteger;
      anchorMs: import("typebox").TOptional<import("typebox").TInteger>;
    }>, import("typebox").TObject<{
      kind: import("typebox").TLiteral<"cron">;
      expr: import("typebox").TString;
      tz: import("typebox").TOptional<import("typebox").TString>;
      staggerMs: import("typebox").TOptional<import("typebox").TInteger>;
    }>]>;
    sessionTarget: import("typebox").TUnion<[import("typebox").TLiteral<"main">, import("typebox").TLiteral<"isolated">, import("typebox").TLiteral<"current">, import("typebox").TString]>;
    wakeMode: import("typebox").TUnion<[import("typebox").TLiteral<"next-heartbeat">, import("typebox").TLiteral<"now">]>;
    payload: import("typebox").TUnion<[import("typebox").TObject<{
      kind: import("typebox").TLiteral<"systemEvent">;
      text: import("typebox").TString;
    }>, import("typebox").TObject<{
      kind: import("typebox").TLiteral<"agentTurn">;
      message: TSchema;
      model: import("typebox").TOptional<TSchema>;
      fallbacks: import("typebox").TOptional<TSchema>;
      thinking: import("typebox").TOptional<import("typebox").TString>;
      timeoutSeconds: import("typebox").TOptional<import("typebox").TNumber>;
      allowUnsafeExternalContent: import("typebox").TOptional<import("typebox").TBoolean>;
      lightContext: import("typebox").TOptional<import("typebox").TBoolean>;
      toolsAllow: import("typebox").TOptional<TSchema>;
    }>, import("typebox").TObject<{
      kind: import("typebox").TLiteral<"command">;
      argv: TSchema;
      cwd: import("typebox").TOptional<import("typebox").TString>;
      env: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TString>>;
      input: import("typebox").TOptional<import("typebox").TString>;
      timeoutSeconds: import("typebox").TOptional<import("typebox").TNumber>;
      noOutputTimeoutSeconds: import("typebox").TOptional<import("typebox").TNumber>;
      outputMaxBytes: import("typebox").TOptional<import("typebox").TInteger>;
    }>]>;
    delivery: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TObject<{
      to: import("typebox").TOptional<import("typebox").TString>;
      channel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"last">, import("typebox").TString]>>;
      threadId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNumber]>>;
      accountId: import("typebox").TOptional<import("typebox").TString>;
      bestEffort: import("typebox").TOptional<import("typebox").TBoolean>;
      failureDestination: import("typebox").TOptional<import("typebox").TObject<{
        channel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"last">, import("typebox").TString]>>;
        to: import("typebox").TOptional<import("typebox").TString>;
        accountId: import("typebox").TOptional<import("typebox").TString>;
        mode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"announce">, import("typebox").TLiteral<"webhook">]>>;
      }>>;
      mode: import("typebox").TLiteral<"none">;
    }>, import("typebox").TObject<{
      completionDestination: import("typebox").TOptional<import("typebox").TObject<{
        mode: import("typebox").TLiteral<"webhook">;
        to: import("typebox").TString;
      }>>;
      to: import("typebox").TOptional<import("typebox").TString>;
      channel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"last">, import("typebox").TString]>>;
      threadId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNumber]>>;
      accountId: import("typebox").TOptional<import("typebox").TString>;
      bestEffort: import("typebox").TOptional<import("typebox").TBoolean>;
      failureDestination: import("typebox").TOptional<import("typebox").TObject<{
        channel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"last">, import("typebox").TString]>>;
        to: import("typebox").TOptional<import("typebox").TString>;
        accountId: import("typebox").TOptional<import("typebox").TString>;
        mode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"announce">, import("typebox").TLiteral<"webhook">]>>;
      }>>;
      mode: import("typebox").TLiteral<"announce">;
    }>, import("typebox").TObject<{
      to: import("typebox").TString;
      channel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"last">, import("typebox").TString]>>;
      threadId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNumber]>>;
      accountId: import("typebox").TOptional<import("typebox").TString>;
      bestEffort: import("typebox").TOptional<import("typebox").TBoolean>;
      failureDestination: import("typebox").TOptional<import("typebox").TObject<{
        channel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"last">, import("typebox").TString]>>;
        to: import("typebox").TOptional<import("typebox").TString>;
        accountId: import("typebox").TOptional<import("typebox").TString>;
        mode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"announce">, import("typebox").TLiteral<"webhook">]>>;
      }>>;
      mode: import("typebox").TLiteral<"webhook">;
    }>]>>;
    failureAlert: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<false>, import("typebox").TObject<{
      after: import("typebox").TOptional<import("typebox").TInteger>;
      channel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"last">, import("typebox").TString]>>;
      to: import("typebox").TOptional<import("typebox").TString>;
      cooldownMs: import("typebox").TOptional<import("typebox").TInteger>;
      includeSkipped: import("typebox").TOptional<import("typebox").TBoolean>;
      mode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"announce">, import("typebox").TLiteral<"webhook">]>>;
      accountId: import("typebox").TOptional<import("typebox").TString>;
    }>]>>;
    state: import("typebox").TObject<{
      nextRunAtMs: import("typebox").TOptional<import("typebox").TInteger>;
      runningAtMs: import("typebox").TOptional<import("typebox").TInteger>;
      lastRunAtMs: import("typebox").TOptional<import("typebox").TInteger>;
      lastRunStatus: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"ok">, import("typebox").TLiteral<"error">, import("typebox").TLiteral<"skipped">]>>;
      lastStatus: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"ok">, import("typebox").TLiteral<"error">, import("typebox").TLiteral<"skipped">]>>;
      lastError: import("typebox").TOptional<import("typebox").TString>;
      lastDiagnostics: import("typebox").TOptional<import("typebox").TObject<{
        summary: import("typebox").TOptional<import("typebox").TString>;
        entries: import("typebox").TArray<import("typebox").TObject<{
          ts: import("typebox").TInteger;
          source: import("typebox").TUnion<[import("typebox").TLiteral<"cron-preflight">, import("typebox").TLiteral<"cron-setup">, import("typebox").TLiteral<"model-preflight">, import("typebox").TLiteral<"agent-run">, import("typebox").TLiteral<"tool">, import("typebox").TLiteral<"exec">, import("typebox").TLiteral<"delivery">]>;
          severity: import("typebox").TUnion<[import("typebox").TLiteral<"info">, import("typebox").TLiteral<"warn">, import("typebox").TLiteral<"error">]>;
          message: import("typebox").TString;
          toolName: import("typebox").TOptional<import("typebox").TString>;
          exitCode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TNumber, import("typebox").TNull]>>;
          truncated: import("typebox").TOptional<import("typebox").TBoolean>;
        }>>;
      }>>;
      lastDiagnosticSummary: import("typebox").TOptional<import("typebox").TString>;
      lastErrorReason: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"auth">, import("typebox").TLiteral<"auth_permanent">, import("typebox").TLiteral<"format">, import("typebox").TLiteral<"rate_limit">, import("typebox").TLiteral<"overloaded">, import("typebox").TLiteral<"billing">, import("typebox").TLiteral<"server_error">, import("typebox").TLiteral<"timeout">, import("typebox").TLiteral<"model_not_found">, import("typebox").TLiteral<"session_expired">, import("typebox").TLiteral<"empty_response">, import("typebox").TLiteral<"no_error_details">, import("typebox").TLiteral<"unclassified">, import("typebox").TLiteral<"unknown">]>>;
      lastDurationMs: import("typebox").TOptional<import("typebox").TInteger>;
      consecutiveErrors: import("typebox").TOptional<import("typebox").TInteger>;
      consecutiveSkipped: import("typebox").TOptional<import("typebox").TInteger>;
      lastDelivered: import("typebox").TOptional<import("typebox").TBoolean>;
      lastDeliveryStatus: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"delivered">, import("typebox").TLiteral<"not-delivered">, import("typebox").TLiteral<"unknown">, import("typebox").TLiteral<"not-requested">]>>;
      lastDeliveryError: import("typebox").TOptional<import("typebox").TString>;
      lastFailureNotificationDelivered: import("typebox").TOptional<import("typebox").TBoolean>;
      lastFailureNotificationDeliveryStatus: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"delivered">, import("typebox").TLiteral<"not-delivered">, import("typebox").TLiteral<"unknown">, import("typebox").TLiteral<"not-requested">]>>;
      lastFailureNotificationDeliveryError: import("typebox").TOptional<import("typebox").TString>;
      lastFailureAlertAtMs: import("typebox").TOptional<import("typebox").TInteger>;
    }>;
  }>;
  CronListParams: import("typebox").TObject<{
    includeDisabled: import("typebox").TOptional<import("typebox").TBoolean>;
    limit: import("typebox").TOptional<import("typebox").TInteger>;
    offset: import("typebox").TOptional<import("typebox").TInteger>;
    query: import("typebox").TOptional<import("typebox").TString>;
    enabled: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"all">, import("typebox").TLiteral<"enabled">, import("typebox").TLiteral<"disabled">]>>;
    scheduleKind: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"all">, import("typebox").TLiteral<"at">, import("typebox").TLiteral<"every">, import("typebox").TLiteral<"cron">]>>;
    lastRunStatus: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"all">, import("typebox").TLiteral<"ok">, import("typebox").TLiteral<"error">, import("typebox").TLiteral<"skipped">, import("typebox").TLiteral<"unknown">]>>;
    sortBy: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"nextRunAtMs">, import("typebox").TLiteral<"updatedAtMs">, import("typebox").TLiteral<"name">]>>;
    sortDir: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"asc">, import("typebox").TLiteral<"desc">]>>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    compact: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  CronStatusParams: import("typebox").TObject<{}>;
  CronGetParams: import("typebox").TUnion<[import("typebox").TObject<{
    id: import("typebox").TString;
  }>, import("typebox").TObject<{
    jobId: import("typebox").TString;
  }>]>;
  CronAddParams: import("typebox").TObject<{
    schedule: import("typebox").TUnion<[import("typebox").TObject<{
      kind: import("typebox").TLiteral<"at">;
      at: import("typebox").TString;
    }>, import("typebox").TObject<{
      kind: import("typebox").TLiteral<"every">;
      everyMs: import("typebox").TInteger;
      anchorMs: import("typebox").TOptional<import("typebox").TInteger>;
    }>, import("typebox").TObject<{
      kind: import("typebox").TLiteral<"cron">;
      expr: import("typebox").TString;
      tz: import("typebox").TOptional<import("typebox").TString>;
      staggerMs: import("typebox").TOptional<import("typebox").TInteger>;
    }>]>;
    sessionTarget: import("typebox").TUnion<[import("typebox").TLiteral<"main">, import("typebox").TLiteral<"isolated">, import("typebox").TLiteral<"current">, import("typebox").TString]>;
    wakeMode: import("typebox").TUnion<[import("typebox").TLiteral<"next-heartbeat">, import("typebox").TLiteral<"now">]>;
    payload: import("typebox").TUnion<[import("typebox").TObject<{
      kind: import("typebox").TLiteral<"systemEvent">;
      text: import("typebox").TString;
    }>, import("typebox").TObject<{
      kind: import("typebox").TLiteral<"agentTurn">;
      message: TSchema;
      model: import("typebox").TOptional<TSchema>;
      fallbacks: import("typebox").TOptional<TSchema>;
      thinking: import("typebox").TOptional<import("typebox").TString>;
      timeoutSeconds: import("typebox").TOptional<import("typebox").TNumber>;
      allowUnsafeExternalContent: import("typebox").TOptional<import("typebox").TBoolean>;
      lightContext: import("typebox").TOptional<import("typebox").TBoolean>;
      toolsAllow: import("typebox").TOptional<TSchema>;
    }>, import("typebox").TObject<{
      kind: import("typebox").TLiteral<"command">;
      argv: TSchema;
      cwd: import("typebox").TOptional<import("typebox").TString>;
      env: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TString>>;
      input: import("typebox").TOptional<import("typebox").TString>;
      timeoutSeconds: import("typebox").TOptional<import("typebox").TNumber>;
      noOutputTimeoutSeconds: import("typebox").TOptional<import("typebox").TNumber>;
      outputMaxBytes: import("typebox").TOptional<import("typebox").TInteger>;
    }>]>;
    delivery: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TObject<{
      to: import("typebox").TOptional<import("typebox").TString>;
      channel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"last">, import("typebox").TString]>>;
      threadId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNumber]>>;
      accountId: import("typebox").TOptional<import("typebox").TString>;
      bestEffort: import("typebox").TOptional<import("typebox").TBoolean>;
      failureDestination: import("typebox").TOptional<import("typebox").TObject<{
        channel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"last">, import("typebox").TString]>>;
        to: import("typebox").TOptional<import("typebox").TString>;
        accountId: import("typebox").TOptional<import("typebox").TString>;
        mode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"announce">, import("typebox").TLiteral<"webhook">]>>;
      }>>;
      mode: import("typebox").TLiteral<"none">;
    }>, import("typebox").TObject<{
      completionDestination: import("typebox").TOptional<import("typebox").TObject<{
        mode: import("typebox").TLiteral<"webhook">;
        to: import("typebox").TString;
      }>>;
      to: import("typebox").TOptional<import("typebox").TString>;
      channel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"last">, import("typebox").TString]>>;
      threadId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNumber]>>;
      accountId: import("typebox").TOptional<import("typebox").TString>;
      bestEffort: import("typebox").TOptional<import("typebox").TBoolean>;
      failureDestination: import("typebox").TOptional<import("typebox").TObject<{
        channel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"last">, import("typebox").TString]>>;
        to: import("typebox").TOptional<import("typebox").TString>;
        accountId: import("typebox").TOptional<import("typebox").TString>;
        mode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"announce">, import("typebox").TLiteral<"webhook">]>>;
      }>>;
      mode: import("typebox").TLiteral<"announce">;
    }>, import("typebox").TObject<{
      to: import("typebox").TString;
      channel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"last">, import("typebox").TString]>>;
      threadId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNumber]>>;
      accountId: import("typebox").TOptional<import("typebox").TString>;
      bestEffort: import("typebox").TOptional<import("typebox").TBoolean>;
      failureDestination: import("typebox").TOptional<import("typebox").TObject<{
        channel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"last">, import("typebox").TString]>>;
        to: import("typebox").TOptional<import("typebox").TString>;
        accountId: import("typebox").TOptional<import("typebox").TString>;
        mode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"announce">, import("typebox").TLiteral<"webhook">]>>;
      }>>;
      mode: import("typebox").TLiteral<"webhook">;
    }>]>>;
    failureAlert: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<false>, import("typebox").TObject<{
      after: import("typebox").TOptional<import("typebox").TInteger>;
      channel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"last">, import("typebox").TString]>>;
      to: import("typebox").TOptional<import("typebox").TString>;
      cooldownMs: import("typebox").TOptional<import("typebox").TInteger>;
      includeSkipped: import("typebox").TOptional<import("typebox").TBoolean>;
      mode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"announce">, import("typebox").TLiteral<"webhook">]>>;
      accountId: import("typebox").TOptional<import("typebox").TString>;
    }>]>>;
    agentId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    sessionKey: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    description: import("typebox").TOptional<import("typebox").TString>;
    enabled: import("typebox").TOptional<import("typebox").TBoolean>;
    deleteAfterRun: import("typebox").TOptional<import("typebox").TBoolean>;
    name: import("typebox").TString;
  }>;
  CronUpdateParams: import("typebox").TUnion<[import("typebox").TObject<{
    id: import("typebox").TString;
  }>, import("typebox").TObject<{
    jobId: import("typebox").TString;
  }>]>;
  CronRemoveParams: import("typebox").TUnion<[import("typebox").TObject<{
    id: import("typebox").TString;
  }>, import("typebox").TObject<{
    jobId: import("typebox").TString;
  }>]>;
  CronRunParams: import("typebox").TUnion<[import("typebox").TObject<{
    id: import("typebox").TString;
  }>, import("typebox").TObject<{
    jobId: import("typebox").TString;
  }>]>;
  CronRunsParams: import("typebox").TObject<{
    scope: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"job">, import("typebox").TLiteral<"all">]>>;
    id: import("typebox").TOptional<import("typebox").TString>;
    jobId: import("typebox").TOptional<import("typebox").TString>;
    runId: import("typebox").TOptional<import("typebox").TString>;
    limit: import("typebox").TOptional<import("typebox").TInteger>;
    offset: import("typebox").TOptional<import("typebox").TInteger>;
    statuses: import("typebox").TOptional<import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"ok">, import("typebox").TLiteral<"error">, import("typebox").TLiteral<"skipped">]>>>;
    status: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"all">, import("typebox").TLiteral<"ok">, import("typebox").TLiteral<"error">, import("typebox").TLiteral<"skipped">]>>;
    deliveryStatuses: import("typebox").TOptional<import("typebox").TArray<import("typebox").TUnion<[import("typebox").TLiteral<"delivered">, import("typebox").TLiteral<"not-delivered">, import("typebox").TLiteral<"unknown">, import("typebox").TLiteral<"not-requested">]>>>;
    deliveryStatus: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"delivered">, import("typebox").TLiteral<"not-delivered">, import("typebox").TLiteral<"unknown">, import("typebox").TLiteral<"not-requested">]>>;
    query: import("typebox").TOptional<import("typebox").TString>;
    sortDir: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"asc">, import("typebox").TLiteral<"desc">]>>;
  }>;
  CronRunLogEntry: import("typebox").TObject<{
    ts: import("typebox").TInteger;
    jobId: import("typebox").TString;
    action: import("typebox").TLiteral<"finished">;
    status: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"ok">, import("typebox").TLiteral<"error">, import("typebox").TLiteral<"skipped">]>>;
    error: import("typebox").TOptional<import("typebox").TString>;
    errorReason: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"auth">, import("typebox").TLiteral<"auth_permanent">, import("typebox").TLiteral<"format">, import("typebox").TLiteral<"rate_limit">, import("typebox").TLiteral<"overloaded">, import("typebox").TLiteral<"billing">, import("typebox").TLiteral<"server_error">, import("typebox").TLiteral<"timeout">, import("typebox").TLiteral<"model_not_found">, import("typebox").TLiteral<"session_expired">, import("typebox").TLiteral<"empty_response">, import("typebox").TLiteral<"no_error_details">, import("typebox").TLiteral<"unclassified">, import("typebox").TLiteral<"unknown">]>>;
    summary: import("typebox").TOptional<import("typebox").TString>;
    diagnostics: import("typebox").TOptional<import("typebox").TObject<{
      summary: import("typebox").TOptional<import("typebox").TString>;
      entries: import("typebox").TArray<import("typebox").TObject<{
        ts: import("typebox").TInteger;
        source: import("typebox").TUnion<[import("typebox").TLiteral<"cron-preflight">, import("typebox").TLiteral<"cron-setup">, import("typebox").TLiteral<"model-preflight">, import("typebox").TLiteral<"agent-run">, import("typebox").TLiteral<"tool">, import("typebox").TLiteral<"exec">, import("typebox").TLiteral<"delivery">]>;
        severity: import("typebox").TUnion<[import("typebox").TLiteral<"info">, import("typebox").TLiteral<"warn">, import("typebox").TLiteral<"error">]>;
        message: import("typebox").TString;
        toolName: import("typebox").TOptional<import("typebox").TString>;
        exitCode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TNumber, import("typebox").TNull]>>;
        truncated: import("typebox").TOptional<import("typebox").TBoolean>;
      }>>;
    }>>;
    delivered: import("typebox").TOptional<import("typebox").TBoolean>;
    deliveryStatus: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"delivered">, import("typebox").TLiteral<"not-delivered">, import("typebox").TLiteral<"unknown">, import("typebox").TLiteral<"not-requested">]>>;
    deliveryError: import("typebox").TOptional<import("typebox").TString>;
    failureNotificationDelivery: import("typebox").TOptional<import("typebox").TObject<{
      delivered: import("typebox").TOptional<import("typebox").TBoolean>;
      status: import("typebox").TUnion<[import("typebox").TLiteral<"delivered">, import("typebox").TLiteral<"not-delivered">, import("typebox").TLiteral<"unknown">, import("typebox").TLiteral<"not-requested">]>;
      error: import("typebox").TOptional<import("typebox").TString>;
    }>>;
    sessionId: import("typebox").TOptional<import("typebox").TString>;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    runId: import("typebox").TOptional<import("typebox").TString>;
    runAtMs: import("typebox").TOptional<import("typebox").TInteger>;
    durationMs: import("typebox").TOptional<import("typebox").TInteger>;
    nextRunAtMs: import("typebox").TOptional<import("typebox").TInteger>;
    model: import("typebox").TOptional<import("typebox").TString>;
    provider: import("typebox").TOptional<import("typebox").TString>;
    usage: import("typebox").TOptional<import("typebox").TObject<{
      input_tokens: import("typebox").TOptional<import("typebox").TNumber>;
      output_tokens: import("typebox").TOptional<import("typebox").TNumber>;
      total_tokens: import("typebox").TOptional<import("typebox").TNumber>;
      cache_read_tokens: import("typebox").TOptional<import("typebox").TNumber>;
      cache_write_tokens: import("typebox").TOptional<import("typebox").TNumber>;
    }>>;
    jobName: import("typebox").TOptional<import("typebox").TString>;
  }>;
  LogsTailParams: import("typebox").TObject<{
    cursor: import("typebox").TOptional<import("typebox").TInteger>;
    limit: import("typebox").TOptional<import("typebox").TInteger>;
    maxBytes: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
  LogsTailResult: import("typebox").TObject<{
    file: import("typebox").TString;
    cursor: import("typebox").TInteger;
    size: import("typebox").TInteger;
    lines: import("typebox").TArray<import("typebox").TString>;
    truncated: import("typebox").TOptional<import("typebox").TBoolean>;
    reset: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  ExecApprovalsGetParams: import("typebox").TObject<{}>;
  ExecApprovalsSetParams: import("typebox").TObject<{
    file: import("typebox").TObject<{
      version: import("typebox").TLiteral<1>;
      socket: import("typebox").TOptional<import("typebox").TObject<{
        path: import("typebox").TOptional<import("typebox").TString>;
        token: import("typebox").TOptional<import("typebox").TString>;
      }>>;
      defaults: import("typebox").TOptional<import("typebox").TObject<{
        security: import("typebox").TOptional<import("typebox").TString>;
        ask: import("typebox").TOptional<import("typebox").TString>;
        askFallback: import("typebox").TOptional<import("typebox").TString>;
        autoAllowSkills: import("typebox").TOptional<import("typebox").TBoolean>;
      }>>;
      agents: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TObject<{
        allowlist: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
          id: import("typebox").TOptional<import("typebox").TString>;
          pattern: import("typebox").TString;
          source: import("typebox").TOptional<import("typebox").TLiteral<"allow-always">>;
          commandText: import("typebox").TOptional<import("typebox").TString>;
          argPattern: import("typebox").TOptional<import("typebox").TString>;
          lastUsedAt: import("typebox").TOptional<import("typebox").TInteger>;
          lastUsedCommand: import("typebox").TOptional<import("typebox").TString>;
          lastResolvedPath: import("typebox").TOptional<import("typebox").TString>;
        }>>>;
        security: import("typebox").TOptional<import("typebox").TString>;
        ask: import("typebox").TOptional<import("typebox").TString>;
        askFallback: import("typebox").TOptional<import("typebox").TString>;
        autoAllowSkills: import("typebox").TOptional<import("typebox").TBoolean>;
      }>>>;
    }>;
    baseHash: import("typebox").TOptional<import("typebox").TString>;
  }>;
  ExecApprovalsNodeGetParams: import("typebox").TObject<{
    nodeId: import("typebox").TString;
  }>;
  ExecApprovalsNodeSetParams: import("typebox").TObject<{
    nodeId: import("typebox").TString;
    file: import("typebox").TObject<{
      version: import("typebox").TLiteral<1>;
      socket: import("typebox").TOptional<import("typebox").TObject<{
        path: import("typebox").TOptional<import("typebox").TString>;
        token: import("typebox").TOptional<import("typebox").TString>;
      }>>;
      defaults: import("typebox").TOptional<import("typebox").TObject<{
        security: import("typebox").TOptional<import("typebox").TString>;
        ask: import("typebox").TOptional<import("typebox").TString>;
        askFallback: import("typebox").TOptional<import("typebox").TString>;
        autoAllowSkills: import("typebox").TOptional<import("typebox").TBoolean>;
      }>>;
      agents: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TObject<{
        allowlist: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
          id: import("typebox").TOptional<import("typebox").TString>;
          pattern: import("typebox").TString;
          source: import("typebox").TOptional<import("typebox").TLiteral<"allow-always">>;
          commandText: import("typebox").TOptional<import("typebox").TString>;
          argPattern: import("typebox").TOptional<import("typebox").TString>;
          lastUsedAt: import("typebox").TOptional<import("typebox").TInteger>;
          lastUsedCommand: import("typebox").TOptional<import("typebox").TString>;
          lastResolvedPath: import("typebox").TOptional<import("typebox").TString>;
        }>>>;
        security: import("typebox").TOptional<import("typebox").TString>;
        ask: import("typebox").TOptional<import("typebox").TString>;
        askFallback: import("typebox").TOptional<import("typebox").TString>;
        autoAllowSkills: import("typebox").TOptional<import("typebox").TBoolean>;
      }>>>;
    }>;
    baseHash: import("typebox").TOptional<import("typebox").TString>;
  }>;
  ExecApprovalsSnapshot: import("typebox").TObject<{
    path: import("typebox").TString;
    exists: import("typebox").TBoolean;
    hash: import("typebox").TString;
    file: import("typebox").TObject<{
      version: import("typebox").TLiteral<1>;
      socket: import("typebox").TOptional<import("typebox").TObject<{
        path: import("typebox").TOptional<import("typebox").TString>;
        token: import("typebox").TOptional<import("typebox").TString>;
      }>>;
      defaults: import("typebox").TOptional<import("typebox").TObject<{
        security: import("typebox").TOptional<import("typebox").TString>;
        ask: import("typebox").TOptional<import("typebox").TString>;
        askFallback: import("typebox").TOptional<import("typebox").TString>;
        autoAllowSkills: import("typebox").TOptional<import("typebox").TBoolean>;
      }>>;
      agents: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TObject<{
        allowlist: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
          id: import("typebox").TOptional<import("typebox").TString>;
          pattern: import("typebox").TString;
          source: import("typebox").TOptional<import("typebox").TLiteral<"allow-always">>;
          commandText: import("typebox").TOptional<import("typebox").TString>;
          argPattern: import("typebox").TOptional<import("typebox").TString>;
          lastUsedAt: import("typebox").TOptional<import("typebox").TInteger>;
          lastUsedCommand: import("typebox").TOptional<import("typebox").TString>;
          lastResolvedPath: import("typebox").TOptional<import("typebox").TString>;
        }>>>;
        security: import("typebox").TOptional<import("typebox").TString>;
        ask: import("typebox").TOptional<import("typebox").TString>;
        askFallback: import("typebox").TOptional<import("typebox").TString>;
        autoAllowSkills: import("typebox").TOptional<import("typebox").TBoolean>;
      }>>>;
    }>;
  }>;
  ExecApprovalGetParams: import("typebox").TObject<{
    id: import("typebox").TString;
  }>;
  ExecApprovalRequestParams: import("typebox").TObject<{
    id: import("typebox").TOptional<import("typebox").TString>;
    command: import("typebox").TOptional<import("typebox").TString>;
    commandArgv: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    systemRunPlan: import("typebox").TOptional<import("typebox").TObject<{
      argv: import("typebox").TArray<import("typebox").TString>;
      cwd: import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>;
      commandText: import("typebox").TString;
      commandPreview: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
      agentId: import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>;
      sessionKey: import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>;
      mutableFileOperand: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TObject<{
        argvIndex: import("typebox").TInteger;
        path: import("typebox").TString;
        sha256: import("typebox").TString;
      }>, import("typebox").TNull]>>;
    }>>;
    env: import("typebox").TOptional<import("typebox").TRecord<"^.*$", import("typebox").TString>>;
    cwd: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    nodeId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    host: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    security: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    ask: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    warningText: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    unavailableDecisions: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    commandSpans: import("typebox").TOptional<import("typebox").TArray<import("typebox").TObject<{
      startIndex: import("typebox").TInteger;
      endIndex: import("typebox").TInteger;
    }>>>;
    agentId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    resolvedPath: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    sessionKey: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    turnSourceChannel: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    turnSourceTo: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    turnSourceAccountId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNull]>>;
    turnSourceThreadId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNumber, import("typebox").TNull]>>;
    approvalReviewerDeviceIds: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    requireDeliveryRoute: import("typebox").TOptional<import("typebox").TBoolean>;
    suppressDelivery: import("typebox").TOptional<import("typebox").TBoolean>;
    timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
    twoPhase: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  ExecApprovalResolveParams: import("typebox").TObject<{
    id: import("typebox").TString;
    decision: import("typebox").TString;
  }>;
  PluginApprovalRequestParams: import("typebox").TObject<{
    pluginId: import("typebox").TOptional<import("typebox").TString>;
    title: import("typebox").TString;
    description: import("typebox").TString;
    severity: import("typebox").TOptional<import("typebox").TString>;
    toolName: import("typebox").TOptional<import("typebox").TString>;
    toolCallId: import("typebox").TOptional<import("typebox").TString>;
    allowedDecisions: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    turnSourceChannel: import("typebox").TOptional<import("typebox").TString>;
    turnSourceTo: import("typebox").TOptional<import("typebox").TString>;
    turnSourceAccountId: import("typebox").TOptional<import("typebox").TString>;
    turnSourceThreadId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNumber]>>;
    timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
    twoPhase: import("typebox").TOptional<import("typebox").TBoolean>;
  }>;
  PluginApprovalResolveParams: import("typebox").TObject<{
    id: import("typebox").TString;
    decision: import("typebox").TString;
  }>;
  PluginControlUiDescriptor: import("typebox").TObject<{
    id: import("typebox").TString;
    pluginId: import("typebox").TString;
    pluginName: import("typebox").TOptional<import("typebox").TString>;
    surface: import("typebox").TUnion<[import("typebox").TLiteral<"session">, import("typebox").TLiteral<"tool">, import("typebox").TLiteral<"run">, import("typebox").TLiteral<"settings">]>;
    label: import("typebox").TString;
    description: import("typebox").TOptional<import("typebox").TString>;
    placement: import("typebox").TOptional<import("typebox").TString>;
    schema: import("typebox").TOptional<import("typebox").TUnknown>;
    requiredScopes: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
  }>;
  PluginsSessionActionFailureResult: import("typebox").TObject<{
    ok: import("typebox").TLiteral<false>;
    error: import("typebox").TString;
    code: import("typebox").TOptional<import("typebox").TString>;
    details: import("typebox").TOptional<import("typebox").TUnknown>;
  }>;
  PluginsSessionActionParams: import("typebox").TObject<{
    pluginId: import("typebox").TString;
    actionId: import("typebox").TString;
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    payload: import("typebox").TOptional<import("typebox").TUnknown>;
  }>;
  PluginsSessionActionResult: import("typebox").TUnion<[import("typebox").TObject<{
    ok: import("typebox").TLiteral<true>;
    result: import("typebox").TOptional<import("typebox").TUnknown>;
    continueAgent: import("typebox").TOptional<import("typebox").TBoolean>;
    reply: import("typebox").TOptional<import("typebox").TUnknown>;
  }>, import("typebox").TObject<{
    ok: import("typebox").TLiteral<false>;
    error: import("typebox").TString;
    code: import("typebox").TOptional<import("typebox").TString>;
    details: import("typebox").TOptional<import("typebox").TUnknown>;
  }>]>;
  PluginsSessionActionSuccessResult: import("typebox").TObject<{
    ok: import("typebox").TLiteral<true>;
    result: import("typebox").TOptional<import("typebox").TUnknown>;
    continueAgent: import("typebox").TOptional<import("typebox").TBoolean>;
    reply: import("typebox").TOptional<import("typebox").TUnknown>;
  }>;
  PluginsUiDescriptorsParams: import("typebox").TObject<{}>;
  PluginsUiDescriptorsResult: import("typebox").TObject<{
    ok: import("typebox").TLiteral<true>;
    descriptors: import("typebox").TArray<import("typebox").TObject<{
      id: import("typebox").TString;
      pluginId: import("typebox").TString;
      pluginName: import("typebox").TOptional<import("typebox").TString>;
      surface: import("typebox").TUnion<[import("typebox").TLiteral<"session">, import("typebox").TLiteral<"tool">, import("typebox").TLiteral<"run">, import("typebox").TLiteral<"settings">]>;
      label: import("typebox").TString;
      description: import("typebox").TOptional<import("typebox").TString>;
      placement: import("typebox").TOptional<import("typebox").TString>;
      schema: import("typebox").TOptional<import("typebox").TUnknown>;
      requiredScopes: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    }>>;
  }>;
  DevicePairListParams: import("typebox").TObject<{}>;
  DevicePairApproveParams: import("typebox").TObject<{
    requestId: import("typebox").TString;
  }>;
  DevicePairRejectParams: import("typebox").TObject<{
    requestId: import("typebox").TString;
  }>;
  DevicePairRemoveParams: import("typebox").TObject<{
    deviceId: import("typebox").TString;
  }>;
  DeviceTokenRotateParams: import("typebox").TObject<{
    deviceId: import("typebox").TString;
    role: import("typebox").TString;
    scopes: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
  }>;
  DeviceTokenRevokeParams: import("typebox").TObject<{
    deviceId: import("typebox").TString;
    role: import("typebox").TString;
  }>;
  DevicePairRequestedEvent: import("typebox").TObject<{
    requestId: import("typebox").TString;
    deviceId: import("typebox").TString;
    publicKey: import("typebox").TString;
    displayName: import("typebox").TOptional<import("typebox").TString>;
    platform: import("typebox").TOptional<import("typebox").TString>;
    deviceFamily: import("typebox").TOptional<import("typebox").TString>;
    clientId: import("typebox").TOptional<import("typebox").TString>;
    clientMode: import("typebox").TOptional<import("typebox").TString>;
    role: import("typebox").TOptional<import("typebox").TString>;
    roles: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    scopes: import("typebox").TOptional<import("typebox").TArray<import("typebox").TString>>;
    remoteIp: import("typebox").TOptional<import("typebox").TString>;
    silent: import("typebox").TOptional<import("typebox").TBoolean>;
    isRepair: import("typebox").TOptional<import("typebox").TBoolean>;
    ts: import("typebox").TInteger;
  }>;
  DevicePairResolvedEvent: import("typebox").TObject<{
    requestId: import("typebox").TString;
    deviceId: import("typebox").TString;
    decision: import("typebox").TString;
    ts: import("typebox").TInteger;
  }>;
  ChatHistoryParams: import("typebox").TObject<{
    sessionKey: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    limit: import("typebox").TOptional<import("typebox").TInteger>;
    maxChars: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
  ChatMetadataParams: import("typebox").TObject<{
    agentId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  ChatMessageGetParams: import("typebox").TObject<{
    sessionKey: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    messageId: import("typebox").TString;
    maxChars: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
  ChatMessageGetResult: import("typebox").TObject<{
    ok: import("typebox").TBoolean;
    message: import("typebox").TOptional<import("typebox").TUnknown>;
    unavailableReason: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"not_found">, import("typebox").TLiteral<"oversized">, import("typebox").TLiteral<"not_visible">]>>;
  }>;
  ChatSendParams: import("typebox").TObject<{
    sessionKey: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    sessionId: import("typebox").TOptional<import("typebox").TString>;
    message: import("typebox").TString;
    thinking: import("typebox").TOptional<import("typebox").TString>;
    fastMode: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TBoolean, import("typebox").TLiteral<"auto">]>>;
    fastAutoOnSeconds: import("typebox").TOptional<import("typebox").TInteger>;
    deliver: import("typebox").TOptional<import("typebox").TBoolean>;
    originatingChannel: import("typebox").TOptional<import("typebox").TString>;
    originatingTo: import("typebox").TOptional<import("typebox").TString>;
    originatingAccountId: import("typebox").TOptional<import("typebox").TString>;
    originatingThreadId: import("typebox").TOptional<import("typebox").TString>;
    attachments: import("typebox").TOptional<import("typebox").TArray<import("typebox").TUnknown>>;
    timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
    systemInputProvenance: import("typebox").TOptional<import("typebox").TObject<{
      kind: import("typebox").TString;
      originSessionId: import("typebox").TOptional<import("typebox").TString>;
      sourceSessionKey: import("typebox").TOptional<import("typebox").TString>;
      sourceChannel: import("typebox").TOptional<import("typebox").TString>;
      sourceTool: import("typebox").TOptional<import("typebox").TString>;
    }>>;
    systemProvenanceReceipt: import("typebox").TOptional<import("typebox").TString>;
    suppressCommandInterpretation: import("typebox").TOptional<import("typebox").TBoolean>;
    idempotencyKey: import("typebox").TString;
  }>;
  ChatAbortParams: import("typebox").TObject<{
    sessionKey: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    runId: import("typebox").TOptional<import("typebox").TString>;
  }>;
  ChatInjectParams: import("typebox").TObject<{
    sessionKey: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    message: import("typebox").TString;
    label: import("typebox").TOptional<import("typebox").TString>;
  }>;
  ChatDeltaEvent: import("typebox").TObject<{
    state: import("typebox").TLiteral<"delta">;
    message: import("typebox").TOptional<import("typebox").TUnknown>;
    deltaText: import("typebox").TString;
    replace: import("typebox").TOptional<import("typebox").TBoolean>;
    usage: import("typebox").TOptional<import("typebox").TUnknown>;
    runId: import("typebox").TString;
    sessionKey: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    spawnedBy: import("typebox").TOptional<import("typebox").TString>;
    seq: import("typebox").TInteger;
  }>;
  ChatFinalEvent: import("typebox").TObject<{
    state: import("typebox").TLiteral<"final">;
    message: import("typebox").TOptional<import("typebox").TUnknown>;
    usage: import("typebox").TOptional<import("typebox").TUnknown>;
    stopReason: import("typebox").TOptional<import("typebox").TString>;
    runId: import("typebox").TString;
    sessionKey: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    spawnedBy: import("typebox").TOptional<import("typebox").TString>;
    seq: import("typebox").TInteger;
  }>;
  ChatAbortedEvent: import("typebox").TObject<{
    state: import("typebox").TLiteral<"aborted">;
    message: import("typebox").TOptional<import("typebox").TUnknown>;
    stopReason: import("typebox").TOptional<import("typebox").TString>;
    runId: import("typebox").TString;
    sessionKey: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    spawnedBy: import("typebox").TOptional<import("typebox").TString>;
    seq: import("typebox").TInteger;
  }>;
  ChatErrorEvent: import("typebox").TObject<{
    state: import("typebox").TLiteral<"error">;
    message: import("typebox").TOptional<import("typebox").TUnknown>;
    errorMessage: import("typebox").TOptional<import("typebox").TString>;
    errorKind: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"refusal">, import("typebox").TLiteral<"timeout">, import("typebox").TLiteral<"rate_limit">, import("typebox").TLiteral<"context_length">, import("typebox").TLiteral<"unknown">]>>;
    usage: import("typebox").TOptional<import("typebox").TUnknown>;
    stopReason: import("typebox").TOptional<import("typebox").TString>;
    runId: import("typebox").TString;
    sessionKey: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    spawnedBy: import("typebox").TOptional<import("typebox").TString>;
    seq: import("typebox").TInteger;
  }>;
  ChatEvent: import("typebox").TUnion<[import("typebox").TObject<{
    state: import("typebox").TLiteral<"delta">;
    message: import("typebox").TOptional<import("typebox").TUnknown>;
    deltaText: import("typebox").TString;
    replace: import("typebox").TOptional<import("typebox").TBoolean>;
    usage: import("typebox").TOptional<import("typebox").TUnknown>;
    runId: import("typebox").TString;
    sessionKey: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    spawnedBy: import("typebox").TOptional<import("typebox").TString>;
    seq: import("typebox").TInteger;
  }>, import("typebox").TObject<{
    state: import("typebox").TLiteral<"final">;
    message: import("typebox").TOptional<import("typebox").TUnknown>;
    usage: import("typebox").TOptional<import("typebox").TUnknown>;
    stopReason: import("typebox").TOptional<import("typebox").TString>;
    runId: import("typebox").TString;
    sessionKey: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    spawnedBy: import("typebox").TOptional<import("typebox").TString>;
    seq: import("typebox").TInteger;
  }>, import("typebox").TObject<{
    state: import("typebox").TLiteral<"aborted">;
    message: import("typebox").TOptional<import("typebox").TUnknown>;
    stopReason: import("typebox").TOptional<import("typebox").TString>;
    runId: import("typebox").TString;
    sessionKey: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    spawnedBy: import("typebox").TOptional<import("typebox").TString>;
    seq: import("typebox").TInteger;
  }>, import("typebox").TObject<{
    state: import("typebox").TLiteral<"error">;
    message: import("typebox").TOptional<import("typebox").TUnknown>;
    errorMessage: import("typebox").TOptional<import("typebox").TString>;
    errorKind: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TLiteral<"refusal">, import("typebox").TLiteral<"timeout">, import("typebox").TLiteral<"rate_limit">, import("typebox").TLiteral<"context_length">, import("typebox").TLiteral<"unknown">]>>;
    usage: import("typebox").TOptional<import("typebox").TUnknown>;
    stopReason: import("typebox").TOptional<import("typebox").TString>;
    runId: import("typebox").TString;
    sessionKey: import("typebox").TString;
    agentId: import("typebox").TOptional<import("typebox").TString>;
    spawnedBy: import("typebox").TOptional<import("typebox").TString>;
    seq: import("typebox").TInteger;
  }>]>;
  UpdateStatusParams: import("typebox").TObject<{}>;
  UpdateRunParams: import("typebox").TObject<{
    sessionKey: import("typebox").TOptional<import("typebox").TString>;
    deliveryContext: import("typebox").TOptional<import("typebox").TObject<{
      channel: import("typebox").TOptional<import("typebox").TString>;
      to: import("typebox").TOptional<import("typebox").TString>;
      accountId: import("typebox").TOptional<import("typebox").TString>;
      threadId: import("typebox").TOptional<import("typebox").TUnion<[import("typebox").TString, import("typebox").TNumber]>>;
    }>>;
    note: import("typebox").TOptional<import("typebox").TString>;
    continuationMessage: import("typebox").TOptional<import("typebox").TString>;
    restartDelayMs: import("typebox").TOptional<import("typebox").TInteger>;
    timeoutMs: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
  TickEvent: import("typebox").TObject<{
    ts: import("typebox").TInteger;
  }>;
  ShutdownEvent: import("typebox").TObject<{
    reason: import("typebox").TString;
    restartExpectedMs: import("typebox").TOptional<import("typebox").TInteger>;
  }>;
};
//#endregion
//#region packages/gateway-protocol/src/schema/types.d.ts
/** Stable schema names registered in the protocol schema registry. */
type ProtocolSchemaName = keyof typeof ProtocolSchemas;
/** Inferred TypeScript type for a named TypeBox protocol schema. */
type SchemaType<TName extends ProtocolSchemaName> = Static<(typeof ProtocolSchemas)[TName]>;
/** Connection handshake, envelope, snapshot, and shared error wire types. */
type ConnectParams = SchemaType<"ConnectParams">;
type HelloOk = SchemaType<"HelloOk">;
type RequestFrame = SchemaType<"RequestFrame">;
type ResponseFrame = SchemaType<"ResponseFrame">;
type EventFrame = SchemaType<"EventFrame">;
type GatewayFrame = SchemaType<"GatewayFrame">;
type Snapshot = SchemaType<"Snapshot">;
type PresenceEntry = SchemaType<"PresenceEntry">;
type ErrorShape = SchemaType<"ErrorShape">;
type StateVersion = SchemaType<"StateVersion">;
/** Environment status RPC payloads used by CLI and Control UI surfaces. */
type EnvironmentStatus = SchemaType<"EnvironmentStatus">;
type EnvironmentSummary = SchemaType<"EnvironmentSummary">;
type EnvironmentsListParams = SchemaType<"EnvironmentsListParams">;
type EnvironmentsListResult = SchemaType<"EnvironmentsListResult">;
type EnvironmentsStatusParams = SchemaType<"EnvironmentsStatusParams">;
type EnvironmentsStatusResult = SchemaType<"EnvironmentsStatusResult">;
/** Agent activity, identity, send, poll, wait, and wake protocol payloads. */
type AgentEvent = SchemaType<"AgentEvent">;
type AgentIdentityParams = SchemaType<"AgentIdentityParams">;
type AgentIdentityResult = SchemaType<"AgentIdentityResult">;
type PollParams = SchemaType<"PollParams">;
type AgentWaitParams = SchemaType<"AgentWaitParams">;
type WakeParams = SchemaType<"WakeParams">;
/** Node pairing, presence, invoke, and pending-queue protocol payloads. */
type NodePairRequestParams = SchemaType<"NodePairRequestParams">;
type NodePairListParams = SchemaType<"NodePairListParams">;
type NodePairApproveParams = SchemaType<"NodePairApproveParams">;
type NodePairRejectParams = SchemaType<"NodePairRejectParams">;
type NodePairRemoveParams = SchemaType<"NodePairRemoveParams">;
type NodePairVerifyParams = SchemaType<"NodePairVerifyParams">;
type NodeListParams = SchemaType<"NodeListParams">;
type NodeInvokeParams = SchemaType<"NodeInvokeParams">;
type NodeInvokeResultParams = SchemaType<"NodeInvokeResultParams">;
type NodeEventParams = SchemaType<"NodeEventParams">;
type NodeEventResult = SchemaType<"NodeEventResult">;
type NodePresenceAlivePayload = SchemaType<"NodePresenceAlivePayload">;
type NodePresenceAliveReason = SchemaType<"NodePresenceAliveReason">;
type NodePendingDrainParams = SchemaType<"NodePendingDrainParams">;
type NodePendingDrainResult = SchemaType<"NodePendingDrainResult">;
type NodePendingEnqueueParams = SchemaType<"NodePendingEnqueueParams">;
type NodePendingEnqueueResult = SchemaType<"NodePendingEnqueueResult">;
/** Session lifecycle, message routing, compaction, patch, and usage payloads. */
type SessionsListParams = SchemaType<"SessionsListParams">;
type SessionsCleanupParams = SchemaType<"SessionsCleanupParams">;
type SessionsPreviewParams = SchemaType<"SessionsPreviewParams">;
type SessionsDescribeParams = SchemaType<"SessionsDescribeParams">;
type SessionsResolveParams = SchemaType<"SessionsResolveParams">;
type SessionOperationEvent = SchemaType<"SessionOperationEvent">;
type SessionsPatchParams = SchemaType<"SessionsPatchParams">;
type SessionsResetParams = SchemaType<"SessionsResetParams">;
type SessionsDeleteParams = SchemaType<"SessionsDeleteParams">;
type SessionsCompactParams = SchemaType<"SessionsCompactParams">;
type SessionsUsageParams = SchemaType<"SessionsUsageParams">;
/** Task ledger query and cancellation payloads. */
type TaskSummary = SchemaType<"TaskSummary">;
type TasksListParams = SchemaType<"TasksListParams">;
type TasksListResult = SchemaType<"TasksListResult">;
type TasksGetParams = SchemaType<"TasksGetParams">;
type TasksGetResult = SchemaType<"TasksGetResult">;
type TasksCancelParams = SchemaType<"TasksCancelParams">;
type TasksCancelResult = SchemaType<"TasksCancelResult">;
/** Config read/write/schema payloads plus update status and run controls. */
type ConfigGetParams = SchemaType<"ConfigGetParams">;
type ConfigSetParams = SchemaType<"ConfigSetParams">;
type ConfigApplyParams = SchemaType<"ConfigApplyParams">;
type ConfigPatchParams = SchemaType<"ConfigPatchParams">;
type ConfigSchemaParams = SchemaType<"ConfigSchemaParams">;
type ConfigSchemaResponse = SchemaType<"ConfigSchemaResponse">;
type UpdateStatusParams = SchemaType<"UpdateStatusParams">;
/** Wizard setup flow payloads exchanged by CLI, UI, and gateway. */
type WizardStartParams = SchemaType<"WizardStartParams">;
type WizardNextParams = SchemaType<"WizardNextParams">;
type WizardCancelParams = SchemaType<"WizardCancelParams">;
type WizardStatusParams = SchemaType<"WizardStatusParams">;
type WizardStep = SchemaType<"WizardStep">;
type WizardNextResult = SchemaType<"WizardNextResult">;
type WizardStartResult = SchemaType<"WizardStartResult">;
type WizardStatusResult = SchemaType<"WizardStatusResult">;
type TalkModeParams = SchemaType<"TalkModeParams">;
type TalkCatalogParams = SchemaType<"TalkCatalogParams">;
type TalkCatalogResult = SchemaType<"TalkCatalogResult">;
type TalkConfigParams = SchemaType<"TalkConfigParams">;
type TalkConfigResult = SchemaType<"TalkConfigResult">;
type TalkClientCreateParams = SchemaType<"TalkClientCreateParams">;
type TalkClientCreateResult = SchemaType<"TalkClientCreateResult">;
type TalkClientSteerParams = SchemaType<"TalkClientSteerParams">;
type TalkAgentControlResult = SchemaType<"TalkAgentControlResult">;
type TalkClientToolCallParams = SchemaType<"TalkClientToolCallParams">;
type TalkClientToolCallResult = SchemaType<"TalkClientToolCallResult">;
type TalkSessionCreateParams = SchemaType<"TalkSessionCreateParams">;
type TalkSessionCreateResult = SchemaType<"TalkSessionCreateResult">;
type TalkSessionJoinParams = SchemaType<"TalkSessionJoinParams">;
type TalkSessionJoinResult = SchemaType<"TalkSessionJoinResult">;
type TalkSessionAppendAudioParams = SchemaType<"TalkSessionAppendAudioParams">;
type TalkSessionTurnParams = SchemaType<"TalkSessionTurnParams">;
type TalkSessionCancelTurnParams = SchemaType<"TalkSessionCancelTurnParams">;
type TalkSessionCancelOutputParams = SchemaType<"TalkSessionCancelOutputParams">;
type TalkSessionTurnResult = SchemaType<"TalkSessionTurnResult">;
type TalkSessionSteerParams = SchemaType<"TalkSessionSteerParams">;
type TalkSessionSubmitToolResultParams = SchemaType<"TalkSessionSubmitToolResultParams">;
type TalkSessionCloseParams = SchemaType<"TalkSessionCloseParams">;
type TalkSessionOkResult = SchemaType<"TalkSessionOkResult">;
type TalkSpeakParams = SchemaType<"TalkSpeakParams">;
type TalkSpeakResult = SchemaType<"TalkSpeakResult">;
/** Channel control and web-login payloads. */
type ChannelsStatusParams = SchemaType<"ChannelsStatusParams">;
type ChannelsStatusResult = SchemaType<"ChannelsStatusResult">;
type ChannelsStartParams = SchemaType<"ChannelsStartParams">;
type ChannelsStopParams = SchemaType<"ChannelsStopParams">;
type ChannelsLogoutParams = SchemaType<"ChannelsLogoutParams">;
type WebLoginStartParams = SchemaType<"WebLoginStartParams">;
type WebLoginWaitParams = SchemaType<"WebLoginWaitParams">;
/** Agent config-file CRUD and artifact download/list payloads. */
type AgentSummary = SchemaType<"AgentSummary">;
type AgentsFileEntry = SchemaType<"AgentsFileEntry">;
type AgentsCreateParams = SchemaType<"AgentsCreateParams">;
type AgentsCreateResult = SchemaType<"AgentsCreateResult">;
type AgentsUpdateParams = SchemaType<"AgentsUpdateParams">;
type AgentsUpdateResult = SchemaType<"AgentsUpdateResult">;
type AgentsDeleteParams = SchemaType<"AgentsDeleteParams">;
type AgentsDeleteResult = SchemaType<"AgentsDeleteResult">;
type AgentsFilesListParams = SchemaType<"AgentsFilesListParams">;
type AgentsFilesListResult = SchemaType<"AgentsFilesListResult">;
type AgentsFilesGetParams = SchemaType<"AgentsFilesGetParams">;
type AgentsFilesGetResult = SchemaType<"AgentsFilesGetResult">;
type AgentsFilesSetParams = SchemaType<"AgentsFilesSetParams">;
type AgentsFilesSetResult = SchemaType<"AgentsFilesSetResult">;
type SessionFileKind = SchemaType<"SessionFileKind">;
type SessionFileRelevance = SchemaType<"SessionFileRelevance">;
type SessionFileEntry = SchemaType<"SessionFileEntry">;
type SessionFileBrowserEntry = SchemaType<"SessionFileBrowserEntry">;
type SessionFileBrowserResult = SchemaType<"SessionFileBrowserResult">;
type SessionsFilesListParams = SchemaType<"SessionsFilesListParams">;
type SessionsFilesListResult = SchemaType<"SessionsFilesListResult">;
type SessionsFilesGetParams = SchemaType<"SessionsFilesGetParams">;
type SessionsFilesGetResult = SchemaType<"SessionsFilesGetResult">;
type ArtifactSummary = SchemaType<"ArtifactSummary">;
type ArtifactsListParams = SchemaType<"ArtifactsListParams">;
type ArtifactsListResult = SchemaType<"ArtifactsListResult">;
type ArtifactsGetParams = SchemaType<"ArtifactsGetParams">;
type ArtifactsGetResult = SchemaType<"ArtifactsGetResult">;
type ArtifactsDownloadParams = SchemaType<"ArtifactsDownloadParams">;
type ArtifactsDownloadResult = SchemaType<"ArtifactsDownloadResult">;
/** Model, command, plugin UI action, tool catalog, and skill workshop payloads. */
type AgentsListParams = SchemaType<"AgentsListParams">;
type AgentsListResult = SchemaType<"AgentsListResult">;
type ChatMetadataParams = SchemaType<"ChatMetadataParams">;
type CommandEntry = SchemaType<"CommandEntry">;
type CommandsListParams = SchemaType<"CommandsListParams">;
type CommandsListResult = SchemaType<"CommandsListResult">;
type PluginsSessionActionParams = SchemaType<"PluginsSessionActionParams">;
type PluginsSessionActionResult = SchemaType<"PluginsSessionActionResult">;
type SkillsStatusParams = SchemaType<"SkillsStatusParams">;
type ToolsCatalogParams = SchemaType<"ToolsCatalogParams">;
type ToolsCatalogResult = SchemaType<"ToolsCatalogResult">;
type ToolsEffectiveParams = SchemaType<"ToolsEffectiveParams">;
type ToolsEffectiveResult = SchemaType<"ToolsEffectiveResult">;
type ToolsInvokeParams = SchemaType<"ToolsInvokeParams">;
type ToolsInvokeResult = SchemaType<"ToolsInvokeResult">;
type SkillsBinsParams = SchemaType<"SkillsBinsParams">;
type SkillsBinsResult = SchemaType<"SkillsBinsResult">;
type SkillsSearchParams = SchemaType<"SkillsSearchParams">;
type SkillsSearchResult = SchemaType<"SkillsSearchResult">;
type SkillsDetailParams = SchemaType<"SkillsDetailParams">;
type SkillsDetailResult = SchemaType<"SkillsDetailResult">;
type SkillsProposalsListParams = SchemaType<"SkillsProposalsListParams">;
type SkillsProposalsListResult = SchemaType<"SkillsProposalsListResult">;
type SkillsProposalInspectParams = SchemaType<"SkillsProposalInspectParams">;
type SkillsProposalInspectResult = SchemaType<"SkillsProposalInspectResult">;
type SkillsProposalCreateParams = SchemaType<"SkillsProposalCreateParams">;
type SkillsProposalUpdateParams = SchemaType<"SkillsProposalUpdateParams">;
type SkillsProposalReviseParams = SchemaType<"SkillsProposalReviseParams">;
type SkillsProposalRequestRevisionParams = SchemaType<"SkillsProposalRequestRevisionParams">;
type SkillsProposalRequestRevisionResult = SchemaType<"SkillsProposalRequestRevisionResult">;
type SkillsProposalActionParams = SchemaType<"SkillsProposalActionParams">;
type SkillsProposalApplyResult = SchemaType<"SkillsProposalApplyResult">;
type SkillsProposalRecordResult = SchemaType<"SkillsProposalRecordResult">;
type SkillsSecurityVerdictsParams = SchemaType<"SkillsSecurityVerdictsParams">;
type SkillsSecurityVerdictsResult = SchemaType<"SkillsSecurityVerdictsResult">;
type SkillsSkillCardParams = SchemaType<"SkillsSkillCardParams">;
type SkillsSkillCardResult = SchemaType<"SkillsSkillCardResult">;
type SkillsUploadBeginParams = SchemaType<"SkillsUploadBeginParams">;
type SkillsUploadChunkParams = SchemaType<"SkillsUploadChunkParams">;
type SkillsUploadCommitParams = SchemaType<"SkillsUploadCommitParams">;
type SkillsInstallParams = SchemaType<"SkillsInstallParams">;
type SkillsUpdateParams = SchemaType<"SkillsUpdateParams">;
/** Cron scheduler and run-log payloads. */
type CronJob = SchemaType<"CronJob">;
type CronListParams = SchemaType<"CronListParams">;
type CronStatusParams = SchemaType<"CronStatusParams">;
type CronGetParams = SchemaType<"CronGetParams">;
type CronAddParams = SchemaType<"CronAddParams">;
type CronUpdateParams = SchemaType<"CronUpdateParams">;
type CronRemoveParams = SchemaType<"CronRemoveParams">;
type CronRunParams = SchemaType<"CronRunParams">;
type CronRunsParams = SchemaType<"CronRunsParams">;
type CronRunLogEntry = SchemaType<"CronRunLogEntry">;
/** Logs and approval payloads for chat, exec commands, plugins, and devices. */
type LogsTailParams = SchemaType<"LogsTailParams">;
type LogsTailResult = SchemaType<"LogsTailResult">;
type ExecApprovalsGetParams = SchemaType<"ExecApprovalsGetParams">;
type ExecApprovalsSetParams = SchemaType<"ExecApprovalsSetParams">;
type ExecApprovalsSnapshot = SchemaType<"ExecApprovalsSnapshot">;
type ExecApprovalGetParams = SchemaType<"ExecApprovalGetParams">;
type ExecApprovalRequestParams = SchemaType<"ExecApprovalRequestParams">;
type ExecApprovalResolveParams = SchemaType<"ExecApprovalResolveParams">;
type DevicePairListParams = SchemaType<"DevicePairListParams">;
type DevicePairApproveParams = SchemaType<"DevicePairApproveParams">;
type DevicePairRejectParams = SchemaType<"DevicePairRejectParams">;
type ChatInjectParams = SchemaType<"ChatInjectParams">;
type ChatEvent = SchemaType<"ChatEvent">;
/** Gateway update and process lifecycle event payloads. */
type UpdateRunParams = SchemaType<"UpdateRunParams">;
type TickEvent = SchemaType<"TickEvent">;
type ShutdownEvent = SchemaType<"ShutdownEvent">;
//#endregion
//#region packages/gateway-protocol/src/schema/error-codes.d.ts
/** Gateway JSON-RPC style error codes shared by clients and server handlers. */
declare const ErrorCodes: {
  /** Client has not completed account/device linking for this gateway. */readonly NOT_LINKED: "NOT_LINKED"; /** Device exists but still needs an explicit pairing approval. */
  readonly NOT_PAIRED: "NOT_PAIRED"; /** Agent turn exceeded the gateway wait window. */
  readonly AGENT_TIMEOUT: "AGENT_TIMEOUT"; /** Request payload failed protocol validation or method preconditions. */
  readonly INVALID_REQUEST: "INVALID_REQUEST"; /** Approval resolution referenced a missing or expired approval request. */
  readonly APPROVAL_NOT_FOUND: "APPROVAL_NOT_FOUND"; /** Gateway service or required backend is temporarily unavailable. */
  readonly UNAVAILABLE: "UNAVAILABLE";
};
/** Closed set of canonical gateway error code strings. */
type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
/** Builds the canonical gateway error payload while preserving optional retry metadata. */
declare function errorShape(code: ErrorCode, message: string, opts?: {
  details?: unknown;
  retryable?: boolean;
  retryAfterMs?: number;
}): ErrorShape;
//#endregion
//#region packages/gateway-protocol/src/schema/environments.d.ts
/**
 * Environment inventory protocol schemas.
 *
 * Environments are runtime targets such as local hosts, VMs, or remote workers;
 * this schema layer only describes their gateway-visible status summary.
 */
/** Runtime availability state for an environment target. */
declare const EnvironmentStatusSchema: Type.TString;
/** Public environment summary shown in listings and status responses. */
declare const EnvironmentSummarySchema: Type.TObject<{
  id: Type.TString;
  type: Type.TString;
  label: Type.TOptional<Type.TString>;
  status: Type.TString;
  capabilities: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Empty request payload for listing known environments. */
declare const EnvironmentsListParamsSchema: Type.TObject<{}>;
/** List response containing all gateway-visible environment summaries. */
declare const EnvironmentsListResultSchema: Type.TObject<{
  environments: Type.TArray<Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    label: Type.TOptional<Type.TString>;
    status: Type.TString;
    capabilities: Type.TOptional<Type.TArray<Type.TString>>;
  }>>;
}>;
/** Status lookup request for one environment id. */
declare const EnvironmentsStatusParamsSchema: Type.TObject<{
  environmentId: Type.TString;
}>;
/** Status lookup result for one environment id. */
declare const EnvironmentsStatusResultSchema: Type.TObject<{
  id: Type.TString;
  type: Type.TString;
  label: Type.TOptional<Type.TString>;
  status: Type.TString;
  capabilities: Type.TOptional<Type.TArray<Type.TString>>;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/exec-approvals.d.ts
/** Empty request payload for reading local exec approval policy. */
declare const ExecApprovalsGetParamsSchema: Type.TObject<{}>;
/** Local exec approval policy write request with optional base hash guard. */
declare const ExecApprovalsSetParamsSchema: Type.TObject<{
  file: Type.TObject<{
    version: Type.TLiteral<1>;
    socket: Type.TOptional<Type.TObject<{
      path: Type.TOptional<Type.TString>;
      token: Type.TOptional<Type.TString>;
    }>>;
    defaults: Type.TOptional<Type.TObject<{
      security: Type.TOptional<Type.TString>;
      ask: Type.TOptional<Type.TString>;
      askFallback: Type.TOptional<Type.TString>;
      autoAllowSkills: Type.TOptional<Type.TBoolean>;
    }>>;
    agents: Type.TOptional<Type.TRecord<"^.*$", Type.TObject<{
      allowlist: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TOptional<Type.TString>;
        pattern: Type.TString;
        source: Type.TOptional<Type.TLiteral<"allow-always">>;
        commandText: Type.TOptional<Type.TString>;
        argPattern: Type.TOptional<Type.TString>;
        lastUsedAt: Type.TOptional<Type.TInteger>;
        lastUsedCommand: Type.TOptional<Type.TString>;
        lastResolvedPath: Type.TOptional<Type.TString>;
      }>>>;
      security: Type.TOptional<Type.TString>;
      ask: Type.TOptional<Type.TString>;
      askFallback: Type.TOptional<Type.TString>;
      autoAllowSkills: Type.TOptional<Type.TBoolean>;
    }>>>;
  }>;
  baseHash: Type.TOptional<Type.TString>;
}>;
/** Lookup request for one pending exec approval by id. */
declare const ExecApprovalGetParamsSchema: Type.TObject<{
  id: Type.TString;
}>;
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
  unavailableDecisions: Type.TOptional<Type.TArray<Type.TString>>;
  commandSpans: Type.TOptional<Type.TArray<Type.TObject<{
    startIndex: Type.TInteger;
    endIndex: Type.TInteger;
  }>>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  resolvedPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  sessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceChannel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceTo: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceAccountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceThreadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber, Type.TNull]>>;
  approvalReviewerDeviceIds: Type.TOptional<Type.TArray<Type.TString>>;
  requireDeliveryRoute: Type.TOptional<Type.TBoolean>;
  suppressDelivery: Type.TOptional<Type.TBoolean>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  twoPhase: Type.TOptional<Type.TBoolean>;
}>;
/** Reviewer decision payload for one pending exec approval. */
declare const ExecApprovalResolveParamsSchema: Type.TObject<{
  id: Type.TString;
  decision: Type.TString;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/frames.d.ts
/**
 * Top-level gateway frame schemas.
 *
 * These are the WebSocket envelope contracts; method/event payload schemas live
 * in feature-specific modules and are referenced by runtime validators.
 */
/** Periodic server heartbeat event payload. */
declare const TickEventSchema: Type.TObject<{
  ts: Type.TInteger;
}>;
/** Server shutdown notice event payload. */
declare const ShutdownEventSchema: Type.TObject<{
  reason: Type.TString;
  restartExpectedMs: Type.TOptional<Type.TInteger>;
}>;
/** Initial client hello/connect payload sent before the gateway accepts frames. */
declare const ConnectParamsSchema: Type.TObject<{
  minProtocol: Type.TInteger;
  maxProtocol: Type.TInteger;
  client: Type.TObject<{
    id: Type.TEnum<["webchat-ui", "openclaw-control-ui", "openclaw-tui", "webchat", "cli", "gateway-client", "openclaw-macos", "openclaw-ios", "openclaw-android", "node-host", "test", "fingerprint", "openclaw-probe"]>;
    displayName: Type.TOptional<Type.TString>;
    version: Type.TString;
    platform: Type.TString;
    deviceFamily: Type.TOptional<Type.TString>;
    modelIdentifier: Type.TOptional<Type.TString>;
    mode: Type.TEnum<["webchat", "cli", "test", "probe", "ui", "backend", "node"]>;
    instanceId: Type.TOptional<Type.TString>;
  }>;
  caps: Type.TOptional<Type.TArray<Type.TString>>;
  commands: Type.TOptional<Type.TArray<Type.TString>>;
  permissions: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
  pathEnv: Type.TOptional<Type.TString>;
  role: Type.TOptional<Type.TString>;
  scopes: Type.TOptional<Type.TArray<Type.TString>>;
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
  }>>;
  locale: Type.TOptional<Type.TString>;
  userAgent: Type.TOptional<Type.TString>;
}>;
/** Successful gateway hello response with negotiated protocol and initial state. */
declare const HelloOkSchema: Type.TObject<{
  type: Type.TLiteral<"hello-ok">;
  protocol: Type.TInteger;
  server: Type.TObject<{
    version: Type.TString;
    connId: Type.TString;
  }>;
  features: Type.TObject<{
    methods: Type.TArray<Type.TString>;
    events: Type.TArray<Type.TString>;
  }>;
  snapshot: Type.TObject<{
    presence: Type.TArray<Type.TObject<{
      host: Type.TOptional<Type.TString>;
      ip: Type.TOptional<Type.TString>;
      version: Type.TOptional<Type.TString>;
      platform: Type.TOptional<Type.TString>;
      deviceFamily: Type.TOptional<Type.TString>;
      modelIdentifier: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TString>;
      lastInputSeconds: Type.TOptional<Type.TInteger>;
      reason: Type.TOptional<Type.TString>;
      tags: Type.TOptional<Type.TArray<Type.TString>>;
      text: Type.TOptional<Type.TString>;
      ts: Type.TInteger;
      deviceId: Type.TOptional<Type.TString>;
      roles: Type.TOptional<Type.TArray<Type.TString>>;
      scopes: Type.TOptional<Type.TArray<Type.TString>>;
      instanceId: Type.TOptional<Type.TString>;
    }>>;
    health: Type.TAny;
    stateVersion: Type.TObject<{
      presence: Type.TInteger;
      health: Type.TInteger;
    }>;
    uptimeMs: Type.TInteger;
    configPath: Type.TOptional<Type.TString>;
    stateDir: Type.TOptional<Type.TString>;
    sessionDefaults: Type.TOptional<Type.TObject<{
      defaultAgentId: Type.TString;
      mainKey: Type.TString;
      mainSessionKey: Type.TString;
      scope: Type.TOptional<Type.TString>;
    }>>;
    authMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"token">, Type.TLiteral<"password">, Type.TLiteral<"trusted-proxy">]>>;
    updateAvailable: Type.TOptional<Type.TObject<{
      currentVersion: Type.TString;
      latestVersion: Type.TString;
      channel: Type.TString;
    }>>;
  }>;
  pluginSurfaceUrls: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  auth: Type.TObject<{
    deviceToken: Type.TOptional<Type.TString>;
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
}>;
/** Server response frame envelope paired with a prior request id. */
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
}>;
declare const GatewayFrameSchema: Type.TUnion<[Type.TObject<{
  type: Type.TLiteral<"req">;
  id: Type.TString;
  method: Type.TString;
  params: Type.TOptional<Type.TUnknown>;
}>, Type.TObject<{
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
}>, Type.TObject<{
  type: Type.TLiteral<"event">;
  event: Type.TString;
  payload: Type.TOptional<Type.TUnknown>;
  seq: Type.TOptional<Type.TInteger>;
  stateVersion: Type.TOptional<Type.TObject<{
    presence: Type.TInteger;
    health: Type.TInteger;
  }>>;
}>]>;
//#endregion
//#region packages/gateway-protocol/src/schema/logs-chat.d.ts
/** Cursor-based request for the gateway log tail endpoint. */
declare const LogsTailParamsSchema: Type.TObject<{
  cursor: Type.TOptional<Type.TInteger>;
  limit: Type.TOptional<Type.TInteger>;
  maxBytes: Type.TOptional<Type.TInteger>;
}>;
/** Gateway log tail payload returned to dashboard clients. */
declare const LogsTailResultSchema: Type.TObject<{
  file: Type.TString;
  cursor: Type.TInteger;
  size: Type.TInteger;
  lines: Type.TArray<Type.TString>;
  truncated: Type.TOptional<Type.TBoolean>;
  reset: Type.TOptional<Type.TBoolean>;
}>;
/** Session-scoped history request used by WebChat and native WebSocket clients. */
declare const ChatHistoryParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
  maxChars: Type.TOptional<Type.TInteger>;
}>;
/** Lightweight chat metadata request; optional agent scope keeps selector state explicit. */
declare const ChatMetadataParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
}>;
/** User-to-agent send request; idempotency key lets clients safely retry transport failures. */
declare const ChatSendParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  message: Type.TString;
  thinking: Type.TOptional<Type.TString>;
  fastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">]>>;
  fastAutoOnSeconds: Type.TOptional<Type.TInteger>;
  deliver: Type.TOptional<Type.TBoolean>;
  originatingChannel: Type.TOptional<Type.TString>;
  originatingTo: Type.TOptional<Type.TString>;
  originatingAccountId: Type.TOptional<Type.TString>;
  originatingThreadId: Type.TOptional<Type.TString>;
  attachments: Type.TOptional<Type.TArray<Type.TUnknown>>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  systemInputProvenance: Type.TOptional<Type.TObject<{
    kind: Type.TString;
    originSessionId: Type.TOptional<Type.TString>;
    sourceSessionKey: Type.TOptional<Type.TString>;
    sourceChannel: Type.TOptional<Type.TString>;
    sourceTool: Type.TOptional<Type.TString>;
  }>>;
  systemProvenanceReceipt: Type.TOptional<Type.TString>;
  suppressCommandInterpretation: Type.TOptional<Type.TBoolean>;
  idempotencyKey: Type.TString;
}>;
/** Inserts an operator-visible synthetic message into an existing chat transcript. */
declare const ChatInjectParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  message: Type.TString;
  label: Type.TOptional<Type.TString>;
}>;
/** Public chat stream event union consumed by gateway protocol validators. */
declare const ChatEventSchema: Type.TUnion<[Type.TObject<{
  state: Type.TLiteral<"delta">;
  message: Type.TOptional<Type.TUnknown>;
  deltaText: Type.TString;
  replace: Type.TOptional<Type.TBoolean>;
  usage: Type.TOptional<Type.TUnknown>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>, Type.TObject<{
  state: Type.TLiteral<"final">;
  message: Type.TOptional<Type.TUnknown>;
  usage: Type.TOptional<Type.TUnknown>;
  stopReason: Type.TOptional<Type.TString>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>, Type.TObject<{
  state: Type.TLiteral<"aborted">;
  message: Type.TOptional<Type.TUnknown>;
  stopReason: Type.TOptional<Type.TString>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>, Type.TObject<{
  state: Type.TLiteral<"error">;
  message: Type.TOptional<Type.TUnknown>;
  errorMessage: Type.TOptional<Type.TString>;
  errorKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"refusal">, Type.TLiteral<"timeout">, Type.TLiteral<"rate_limit">, Type.TLiteral<"context_length">, Type.TLiteral<"unknown">]>>;
  usage: Type.TOptional<Type.TUnknown>;
  stopReason: Type.TOptional<Type.TString>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>]>;
//#endregion
//#region packages/gateway-protocol/src/schema/nodes.d.ts
/** Reasons a node can report itself alive without implying an operator action. */
declare const NodePresenceAliveReasonSchema: Type.TString;
/** Presence heartbeat payload sent by remote nodes to refresh gateway state. */
declare const NodePresenceAlivePayloadSchema: Type.TObject<{
  trigger: Type.TString;
  sentAtMs: Type.TOptional<Type.TInteger>;
  displayName: Type.TOptional<Type.TString>;
  version: Type.TOptional<Type.TString>;
  platform: Type.TOptional<Type.TString>;
  deviceFamily: Type.TOptional<Type.TString>;
  modelIdentifier: Type.TOptional<Type.TString>;
  pushTransport: Type.TOptional<Type.TString>;
}>;
/** Normalized result for node-originated events after gateway dispatch. */
declare const NodeEventResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  event: Type.TString;
  handled: Type.TBoolean;
  reason: Type.TOptional<Type.TString>;
}>;
/** Pairing request metadata advertised by a node before trust is granted. */
declare const NodePairRequestParamsSchema: Type.TObject<{
  nodeId: Type.TString;
  displayName: Type.TOptional<Type.TString>;
  platform: Type.TOptional<Type.TString>;
  version: Type.TOptional<Type.TString>;
  coreVersion: Type.TOptional<Type.TString>;
  uiVersion: Type.TOptional<Type.TString>;
  deviceFamily: Type.TOptional<Type.TString>;
  modelIdentifier: Type.TOptional<Type.TString>;
  caps: Type.TOptional<Type.TArray<Type.TString>>;
  commands: Type.TOptional<Type.TArray<Type.TString>>;
  permissions: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
  remoteIp: Type.TOptional<Type.TString>;
  silent: Type.TOptional<Type.TBoolean>;
}>;
/** Lists pending node-pairing requests. */
declare const NodePairListParamsSchema: Type.TObject<{}>;
/** Approves a pending node-pairing request by request id. */
declare const NodePairApproveParamsSchema: Type.TObject<{
  requestId: Type.TString;
}>;
/** Rejects a pending node-pairing request by request id. */
declare const NodePairRejectParamsSchema: Type.TObject<{
  requestId: Type.TString;
}>;
/** Removes an already paired node from the gateway trust set. */
declare const NodePairRemoveParamsSchema: Type.TObject<{
  nodeId: Type.TString;
}>;
/** Verifies node ownership with a short-lived pairing token. */
declare const NodePairVerifyParamsSchema: Type.TObject<{
  nodeId: Type.TString;
  token: Type.TString;
}>;
/** Lists paired nodes known to the gateway. */
declare const NodeListParamsSchema: Type.TObject<{}>;
/** Acknowledges queued node work that the node has consumed. */
declare const NodePendingAckParamsSchema: Type.TObject<{
  ids: Type.TArray<Type.TString>;
}>;
/** Invokes a command on a paired node; idempotency allows safe retries. */
declare const NodeInvokeParamsSchema: Type.TObject<{
  nodeId: Type.TString;
  command: Type.TString;
  params: Type.TOptional<Type.TUnknown>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  idempotencyKey: Type.TString;
}>;
/** Request for a bounded batch of queued work assigned to the calling node. */
declare const NodePendingDrainParamsSchema: Type.TObject<{
  maxItems: Type.TOptional<Type.TInteger>;
}>;
/** Drain response with a revision marker for node queue state. */
declare const NodePendingDrainResultSchema: Type.TObject<{
  nodeId: Type.TString;
  revision: Type.TInteger;
  items: Type.TArray<Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    priority: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    payload: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  }>>;
  hasMore: Type.TBoolean;
}>;
/** Enqueues gateway-initiated work for a paired node. */
declare const NodePendingEnqueueParamsSchema: Type.TObject<{
  nodeId: Type.TString;
  type: Type.TString;
  priority: Type.TOptional<Type.TString>;
  expiresInMs: Type.TOptional<Type.TInteger>;
  wake: Type.TOptional<Type.TBoolean>;
}>;
/** Enqueue result echoes queue revision and whether wake delivery was attempted. */
declare const NodePendingEnqueueResultSchema: Type.TObject<{
  nodeId: Type.TString;
  revision: Type.TInteger;
  queued: Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    priority: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    payload: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  }>;
  wakeTriggered: Type.TBoolean;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/push.d.ts
/** Request payload for sending a test APNS notification to one node. */
declare const PushTestParamsSchema: Type.TObject<{
  nodeId: Type.TString;
  title: Type.TOptional<Type.TString>;
  body: Type.TOptional<Type.TString>;
  environment: Type.TOptional<Type.TString>;
}>;
/** Result payload from an APNS push test, including provider status and transport. */
declare const PushTestResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  status: Type.TInteger;
  apnsId: Type.TOptional<Type.TString>;
  reason: Type.TOptional<Type.TString>;
  tokenSuffix: Type.TString;
  topic: Type.TString;
  environment: Type.TString;
  transport: Type.TString;
}>;
/** Empty request payload for fetching the Web Push VAPID public key. */
declare const WebPushVapidPublicKeyParamsSchema: Type.TObject<{}>;
/** Browser Web Push subscription payload registered with the gateway. */
declare const WebPushSubscribeParamsSchema: Type.TObject<{
  endpoint: Type.TString;
  keys: Type.TObject<{
    p256dh: Type.TString;
    auth: Type.TString;
  }>;
}>;
/** Browser Web Push endpoint removal payload. */
declare const WebPushUnsubscribeParamsSchema: Type.TObject<{
  endpoint: Type.TString;
}>;
/** Request payload for sending a test Web Push notification to current subscriptions. */
declare const WebPushTestParamsSchema: Type.TObject<{
  title: Type.TOptional<Type.TString>;
  body: Type.TOptional<Type.TString>;
}>;
/** Empty request type for fetching the Web Push VAPID public key. */
type WebPushVapidPublicKeyParams = Record<string, never>;
/** Browser PushSubscription subset persisted by the gateway. */
type WebPushSubscribeParams = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};
/** Browser PushSubscription endpoint removal request. */
type WebPushUnsubscribeParams = {
  endpoint: string;
};
/** Optional title/body overrides for a Web Push test notification. */
type WebPushTestParams = {
  title?: string;
  body?: string;
};
//#endregion
//#region packages/gateway-protocol/src/schema/sessions.d.ts
/** Session file grouping used by the Control UI session workspace rail. */
declare const SessionFileKindSchema: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
/** Session relevance marker for browser entries. */
declare const SessionFileRelevanceSchema: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]>;
/** One file path referenced by a session transcript. */
declare const SessionFileEntrySchema: Type.TObject<{
  path: Type.TString;
  name: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
  missing: Type.TBoolean;
  size: Type.TOptional<Type.TInteger>;
  updatedAtMs: Type.TOptional<Type.TInteger>;
  content: Type.TOptional<Type.TString>;
}>;
/** One file or folder in the session-rooted browser. */
declare const SessionFileBrowserEntrySchema: Type.TObject<{
  path: Type.TString;
  name: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
  sessionKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]>>;
  size: Type.TOptional<Type.TInteger>;
  updatedAtMs: Type.TOptional<Type.TInteger>;
}>;
/** Folder listing or search result rooted at the session workspace. */
declare const SessionFileBrowserResultSchema: Type.TObject<{
  path: Type.TString;
  parentPath: Type.TOptional<Type.TString>;
  search: Type.TOptional<Type.TString>;
  entries: Type.TArray<Type.TObject<{
    path: Type.TString;
    name: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
    sessionKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]>>;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
  }>>;
  truncated: Type.TOptional<Type.TBoolean>;
}>;
/** Lists files touched by a session transcript. */
declare const SessionsFilesListParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  path: Type.TOptional<Type.TString>;
  search: Type.TOptional<Type.TString>;
}>;
/** File references visible in one session workspace. */
declare const SessionsFilesListResultSchema: Type.TObject<{
  sessionKey: Type.TString;
  root: Type.TOptional<Type.TString>;
  files: Type.TArray<Type.TObject<{
    path: Type.TString;
    name: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
  }>>;
  browser: Type.TOptional<Type.TObject<{
    path: Type.TString;
    parentPath: Type.TOptional<Type.TString>;
    search: Type.TOptional<Type.TString>;
    entries: Type.TArray<Type.TObject<{
      path: Type.TString;
      name: Type.TString;
      kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
      sessionKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]>>;
      size: Type.TOptional<Type.TInteger>;
      updatedAtMs: Type.TOptional<Type.TInteger>;
    }>>;
    truncated: Type.TOptional<Type.TBoolean>;
  }>>;
}>;
/** Reads one session-referenced file by path. */
declare const SessionsFilesGetParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  path: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Result for reading one session-referenced file. */
declare const SessionsFilesGetResultSchema: Type.TObject<{
  sessionKey: Type.TString;
  root: Type.TOptional<Type.TString>;
  file: Type.TObject<{
    path: Type.TString;
    name: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
  }>;
}>;
/** Lists sessions with optional scope, activity, label, and preview filters. */
declare const SessionsListParamsSchema: Type.TObject<{
  /**
   * Maximum rows to return. Omitted Gateway RPC calls use a bounded default
   * to keep large session stores from monopolizing the event loop.
   */
  limit: Type.TOptional<Type.TInteger>;
  offset: Type.TOptional<Type.TInteger>;
  activeMinutes: Type.TOptional<Type.TInteger>;
  includeGlobal: Type.TOptional<Type.TBoolean>;
  includeUnknown: Type.TOptional<Type.TBoolean>;
  /**
   * Limit returned agent-scoped rows to agents currently present in config.
   * Broad disk discovery remains the default for recovery/ACP consumers.
   */
  configuredAgentsOnly: Type.TOptional<Type.TBoolean>;
  /**
   * Read first 8KB of each session transcript to derive title from first user message.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeDerivedTitles: Type.TOptional<Type.TBoolean>;
  /**
   * Read last 16KB of each session transcript to extract most recent message preview.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeLastMessage: Type.TOptional<Type.TBoolean>;
  label: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  search: Type.TOptional<Type.TString>;
}>;
/** Repairs or removes invalid session records from the selected agent scope. */
declare const SessionsCleanupParamsSchema: Type.TObject<{
  agent: Type.TOptional<Type.TString>;
  allAgents: Type.TOptional<Type.TBoolean>;
  enforce: Type.TOptional<Type.TBoolean>;
  activeKey: Type.TOptional<Type.TString>;
  fixMissing: Type.TOptional<Type.TBoolean>;
  fixDmScope: Type.TOptional<Type.TBoolean>;
}>;
/** Reads short previews for selected session keys. */
declare const SessionsPreviewParamsSchema: Type.TObject<{
  keys: Type.TArray<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
  maxChars: Type.TOptional<Type.TInteger>;
}>;
/** Describes one session and optional derived title/last-message previews. */
declare const SessionsDescribeParamsSchema: Type.TObject<{
  key: Type.TString;
  includeDerivedTitles: Type.TOptional<Type.TBoolean>;
  includeLastMessage: Type.TOptional<Type.TBoolean>;
}>;
/** Resolves a session by key, raw session id, label, or parent/agent scope. */
declare const SessionsResolveParamsSchema: Type.TObject<{
  key: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  label: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  includeGlobal: Type.TOptional<Type.TBoolean>;
  includeUnknown: Type.TOptional<Type.TBoolean>; /** Return a successful `{ ok: false }` response when the selector does not match a session. */
  allowMissing: Type.TOptional<Type.TBoolean>;
}>;
/** Creates or adopts a session with optional model, label, and parent linkage. */
declare const SessionsCreateParamsSchema: Type.TObject<{
  key: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  label: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  parentSessionKey: Type.TOptional<Type.TString>;
  emitCommandHooks: Type.TOptional<Type.TBoolean>;
  task: Type.TOptional<Type.TString>;
  message: Type.TOptional<Type.TString>;
}>;
/** Sends one message into an existing session. */
declare const SessionsSendParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  message: Type.TString;
  thinking: Type.TOptional<Type.TString>;
  attachments: Type.TOptional<Type.TArray<Type.TUnknown>>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  idempotencyKey: Type.TOptional<Type.TString>;
}>;
/** Aborts the active or named run for a session. */
declare const SessionsAbortParamsSchema: Type.TObject<{
  key: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Mutable per-session preferences and routing metadata. */
declare const SessionsPatchParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  label: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  thinkingLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  fastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">, Type.TNull]>>;
  verboseLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  traceLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  reasoningLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  responseUsage: Type.TOptional<Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"tokens">, Type.TLiteral<"full">, Type.TLiteral<"on">, Type.TNull]>>;
  elevatedLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execHost: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execSecurity: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execAsk: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execNode: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  model: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  spawnedBy: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  spawnedWorkspaceDir: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  spawnedCwd: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  spawnDepth: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
  subagentRole: Type.TOptional<Type.TUnion<[Type.TLiteral<"orchestrator">, Type.TLiteral<"leaf">, Type.TNull]>>;
  subagentControlScope: Type.TOptional<Type.TUnion<[Type.TLiteral<"children">, Type.TLiteral<"none">, Type.TNull]>>;
  inheritedToolAllow: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
  inheritedToolDeny: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
  sendPolicy: Type.TOptional<Type.TUnion<[Type.TLiteral<"allow">, Type.TLiteral<"deny">, Type.TNull]>>;
  groupActivation: Type.TOptional<Type.TUnion<[Type.TLiteral<"mention">, Type.TLiteral<"always">, Type.TNull]>>;
}>;
/** Updates or clears one plugin namespace value on a session record. */
declare const SessionsPluginPatchParamsSchema: Type.TObject<{
  key: Type.TString;
  pluginId: Type.TString;
  namespace: Type.TString;
  value: Type.TOptional<Type.TUnknown>;
  unset: Type.TOptional<Type.TBoolean>;
}>;
/** Resets a session to a new or reset transcript state. */
declare const SessionsResetParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  reason: Type.TOptional<Type.TUnion<[Type.TLiteral<"new">, Type.TLiteral<"reset">]>>;
}>;
/** Deletes a session record and optionally its transcript. */
declare const SessionsDeleteParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  deleteTranscript: Type.TOptional<Type.TBoolean>;
  emitLifecycleHooks: Type.TOptional<Type.TBoolean>;
}>;
/** Requests manual compaction for a session transcript. */
declare const SessionsCompactParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  maxLines: Type.TOptional<Type.TInteger>;
}>;
/** Lists compaction checkpoints for one session. */
declare const SessionsCompactionListParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Reads one compaction checkpoint by id. */
declare const SessionsCompactionGetParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  checkpointId: Type.TString;
}>;
/** Creates a new branch from a compaction checkpoint. */
declare const SessionsCompactionBranchParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  checkpointId: Type.TString;
}>;
/** Restores an existing session to a compaction checkpoint. */
declare const SessionsCompactionRestoreParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  checkpointId: Type.TString;
}>;
/** Usage report query across one session, one agent, or all agent sessions. */
declare const SessionsUsageParamsSchema: Type.TObject<{
  /** Specific session key to analyze; if omitted returns sessions for the effective agent. */key: Type.TOptional<Type.TString>; /** Agent scope for list-style usage queries. */
  agentId: Type.TOptional<Type.TString>; /** Explicit all-agent scope for list-style usage queries. */
  agentScope: Type.TOptional<Type.TLiteral<"all">>; /** Start date for range filter (YYYY-MM-DD). */
  startDate: Type.TOptional<Type.TString>; /** End date for range filter (YYYY-MM-DD). */
  endDate: Type.TOptional<Type.TString>; /** How start/end dates should be interpreted. Defaults to UTC when omitted. */
  mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"utc">, Type.TLiteral<"gateway">, Type.TLiteral<"specific">]>>; /** Preset range for usage queries when explicit start/end dates are omitted. */
  range: Type.TOptional<Type.TUnion<[Type.TLiteral<"7d">, Type.TLiteral<"30d">, Type.TLiteral<"90d">, Type.TLiteral<"1y">, Type.TLiteral<"all">]>>; /** Usage row grouping. `family` rolls up known rotated session ids for a logical key. */
  groupBy: Type.TOptional<Type.TUnion<[Type.TLiteral<"instance">, Type.TLiteral<"family">]>>; /** Backward-compatible alias for requesting family grouping. */
  includeHistorical: Type.TOptional<Type.TBoolean>; /** UTC offset to use when mode is `specific` (for example, UTC-4 or UTC+5:30). */
  utcOffset: Type.TOptional<Type.TString>; /** Maximum sessions to return (default 50). */
  limit: Type.TOptional<Type.TInteger>; /** Include context weight breakdown (systemPromptReport). */
  includeContextWeight: Type.TOptional<Type.TBoolean>;
}>;
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
  host: Type.TOptional<Type.TString>;
  ip: Type.TOptional<Type.TString>;
  version: Type.TOptional<Type.TString>;
  platform: Type.TOptional<Type.TString>;
  deviceFamily: Type.TOptional<Type.TString>;
  modelIdentifier: Type.TOptional<Type.TString>;
  mode: Type.TOptional<Type.TString>;
  lastInputSeconds: Type.TOptional<Type.TInteger>;
  reason: Type.TOptional<Type.TString>;
  tags: Type.TOptional<Type.TArray<Type.TString>>;
  text: Type.TOptional<Type.TString>;
  ts: Type.TInteger;
  deviceId: Type.TOptional<Type.TString>;
  roles: Type.TOptional<Type.TArray<Type.TString>>;
  scopes: Type.TOptional<Type.TArray<Type.TString>>;
  instanceId: Type.TOptional<Type.TString>;
}>;
/** Monotonic version counters for snapshot subtrees. */
declare const StateVersionSchema: Type.TObject<{
  presence: Type.TInteger;
  health: Type.TInteger;
}>;
/** Initial and incremental gateway state snapshot payload. */
declare const SnapshotSchema: Type.TObject<{
  presence: Type.TArray<Type.TObject<{
    host: Type.TOptional<Type.TString>;
    ip: Type.TOptional<Type.TString>;
    version: Type.TOptional<Type.TString>;
    platform: Type.TOptional<Type.TString>;
    deviceFamily: Type.TOptional<Type.TString>;
    modelIdentifier: Type.TOptional<Type.TString>;
    mode: Type.TOptional<Type.TString>;
    lastInputSeconds: Type.TOptional<Type.TInteger>;
    reason: Type.TOptional<Type.TString>;
    tags: Type.TOptional<Type.TArray<Type.TString>>;
    text: Type.TOptional<Type.TString>;
    ts: Type.TInteger;
    deviceId: Type.TOptional<Type.TString>;
    roles: Type.TOptional<Type.TArray<Type.TString>>;
    scopes: Type.TOptional<Type.TArray<Type.TString>>;
    instanceId: Type.TOptional<Type.TString>;
  }>>;
  health: Type.TAny;
  stateVersion: Type.TObject<{
    presence: Type.TInteger;
    health: Type.TInteger;
  }>;
  uptimeMs: Type.TInteger;
  configPath: Type.TOptional<Type.TString>;
  stateDir: Type.TOptional<Type.TString>;
  sessionDefaults: Type.TOptional<Type.TObject<{
    defaultAgentId: Type.TString;
    mainKey: Type.TString;
    mainSessionKey: Type.TString;
    scope: Type.TOptional<Type.TString>;
  }>>;
  authMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"token">, Type.TLiteral<"password">, Type.TLiteral<"trusted-proxy">]>>;
  updateAvailable: Type.TOptional<Type.TObject<{
    currentVersion: Type.TString;
    latestVersion: Type.TString;
    channel: Type.TString;
  }>>;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/tasks.d.ts
/** Public task summary returned by task list/get/cancel responses. */
declare const TaskSummarySchema: Type.TObject<{
  id: Type.TString;
  kind: Type.TOptional<Type.TString>;
  runtime: Type.TOptional<Type.TString>;
  status: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>;
  title: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  childSessionKey: Type.TOptional<Type.TString>;
  ownerKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  taskId: Type.TOptional<Type.TString>;
  flowId: Type.TOptional<Type.TString>;
  parentTaskId: Type.TOptional<Type.TString>;
  sourceId: Type.TOptional<Type.TString>;
  createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
  updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
  startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
  endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
  progressSummary: Type.TOptional<Type.TString>;
  terminalSummary: Type.TOptional<Type.TString>;
  error: Type.TOptional<Type.TString>;
}>;
/** Task list filters with bounded pagination. */
declare const TasksListParamsSchema: Type.TObject<{
  status: Type.TOptional<Type.TUnion<[Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>, Type.TArray<Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>>]>>;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
  cursor: Type.TOptional<Type.TString>;
}>;
/** Task list page response. */
declare const TasksListResultSchema: Type.TObject<{
  tasks: Type.TArray<Type.TObject<{
    id: Type.TString;
    kind: Type.TOptional<Type.TString>;
    runtime: Type.TOptional<Type.TString>;
    status: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>;
    title: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    childSessionKey: Type.TOptional<Type.TString>;
    ownerKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    flowId: Type.TOptional<Type.TString>;
    parentTaskId: Type.TOptional<Type.TString>;
    sourceId: Type.TOptional<Type.TString>;
    createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    progressSummary: Type.TOptional<Type.TString>;
    terminalSummary: Type.TOptional<Type.TString>;
    error: Type.TOptional<Type.TString>;
  }>>;
  nextCursor: Type.TOptional<Type.TString>;
}>;
/** Lookup request for one task id. */
declare const TasksGetParamsSchema: Type.TObject<{
  taskId: Type.TString;
}>;
/** Lookup result for one task summary. */
declare const TasksGetResultSchema: Type.TObject<{
  task: Type.TObject<{
    id: Type.TString;
    kind: Type.TOptional<Type.TString>;
    runtime: Type.TOptional<Type.TString>;
    status: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>;
    title: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    childSessionKey: Type.TOptional<Type.TString>;
    ownerKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    flowId: Type.TOptional<Type.TString>;
    parentTaskId: Type.TOptional<Type.TString>;
    sourceId: Type.TOptional<Type.TString>;
    createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    progressSummary: Type.TOptional<Type.TString>;
    terminalSummary: Type.TOptional<Type.TString>;
    error: Type.TOptional<Type.TString>;
  }>;
}>;
/** Cancel request for one task id with optional operator reason. */
declare const TasksCancelParamsSchema: Type.TObject<{
  taskId: Type.TString;
  reason: Type.TOptional<Type.TString>;
}>;
/** Cancel result, including the task snapshot when it was found. */
declare const TasksCancelResultSchema: Type.TObject<{
  found: Type.TBoolean;
  cancelled: Type.TBoolean;
  reason: Type.TOptional<Type.TString>;
  task: Type.TOptional<Type.TObject<{
    id: Type.TString;
    kind: Type.TOptional<Type.TString>;
    runtime: Type.TOptional<Type.TString>;
    status: Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"completed">, Type.TLiteral<"failed">, Type.TLiteral<"cancelled">, Type.TLiteral<"timed_out">]>;
    title: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    childSessionKey: Type.TOptional<Type.TString>;
    ownerKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    flowId: Type.TOptional<Type.TString>;
    parentTaskId: Type.TOptional<Type.TString>;
    sourceId: Type.TOptional<Type.TString>;
    createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    progressSummary: Type.TOptional<Type.TString>;
    terminalSummary: Type.TOptional<Type.TString>;
    error: Type.TOptional<Type.TString>;
  }>>;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/plugins.d.ts
/** Empty request payload for listing plugin UI descriptors. */
declare const PluginsUiDescriptorsParamsSchema: Type.TObject<{}>;
/** Response payload containing all plugin UI descriptors visible to the client. */
declare const PluginsUiDescriptorsResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  descriptors: Type.TArray<Type.TObject<{
    id: Type.TString;
    pluginId: Type.TString;
    pluginName: Type.TOptional<Type.TString>;
    surface: Type.TUnion<[Type.TLiteral<"session">, Type.TLiteral<"tool">, Type.TLiteral<"run">, Type.TLiteral<"settings">]>;
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
    placement: Type.TOptional<Type.TString>;
    schema: Type.TOptional<Type.TUnknown>;
    requiredScopes: Type.TOptional<Type.TArray<Type.TString>>;
  }>>;
}>;
/** Request payload for invoking one plugin-owned session action. */
declare const PluginsSessionActionParamsSchema: Type.TObject<{
  pluginId: Type.TString;
  actionId: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  payload: Type.TOptional<Type.TUnknown>;
}>;
/** Discriminated plugin action result returned to gateway clients. */
declare const PluginsSessionActionResultSchema: Type.TUnion<[Type.TObject<{
  ok: Type.TLiteral<true>;
  result: Type.TOptional<Type.TUnknown>;
  continueAgent: Type.TOptional<Type.TBoolean>;
  reply: Type.TOptional<Type.TUnknown>;
}>, Type.TObject<{
  ok: Type.TLiteral<false>;
  error: Type.TString;
  code: Type.TOptional<Type.TString>;
  details: Type.TOptional<Type.TUnknown>;
}>]>;
//#endregion
//#region packages/gateway-protocol/src/schema/wizard.d.ts
/** Starts a setup wizard, optionally scoped to a local or remote workspace. */
declare const WizardStartParamsSchema: Type.TObject<{
  mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"local">, Type.TLiteral<"remote">]>>;
  workspace: Type.TOptional<Type.TString>;
}>;
/** Advances a wizard session, with an answer when the previous step requested input. */
declare const WizardNextParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  answer: Type.TOptional<Type.TObject<{
    stepId: Type.TString;
    value: Type.TOptional<Type.TUnknown>;
  }>>;
}>;
/** Cancels an active wizard session. */
declare const WizardCancelParamsSchema: Type.TObject<{
  sessionId: Type.TString;
}>;
/** Reads status for an active or recently completed wizard session. */
declare const WizardStatusParamsSchema: Type.TObject<{
  sessionId: Type.TString;
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
  }>>;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"cancelled">, Type.TLiteral<"error">]>>;
  error: Type.TOptional<Type.TString>;
}>;
/** Result returned when a wizard session is created. */
declare const WizardStartResultSchema: Type.TObject<{
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
  }>>;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"cancelled">, Type.TLiteral<"error">]>>;
  error: Type.TOptional<Type.TString>;
  sessionId: Type.TString;
}>;
/** Minimal status poll result used when the client does not need the next step. */
declare const WizardStatusResultSchema: Type.TObject<{
  status: Type.TUnion<[Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"cancelled">, Type.TLiteral<"error">]>;
  error: Type.TOptional<Type.TString>;
}>;
//#endregion
export { WebPushSubscribeParamsSchema as $, ConfigPatchParamsSchema as $a, TalkSessionCloseParams as $i, DevicePairListParams as $n, AgentsFilesGetResultSchema as $o, SessionsFilesGetResult as $r, AgentIdentityResult as $t, SessionsCompactParamsSchema as A, WizardCancelParams as Aa, SkillsSkillCardParams as Ai, ChatInjectParams as An, TalkSessionCreateResultSchema as Ao, NodePendingDrainParams as Ar, SkillsStatusParamsSchema as As, ErrorShapeSchema as At, SessionsFilesListParamsSchema as B, MIN_PROBE_PROTOCOL_VERSION as Ba, TalkCatalogParams as Bi, ConfigSetParams as Bn, WebLoginStartParamsSchema as Bo, RequestFrame as Br, AgentIdentityResultSchema as Bs, ExecApprovalResolveParamsSchema as Bt, SessionFileBrowserEntrySchema as C, ToolsInvokeParams as Ca, SkillsProposalUpdateParams as Ci, ArtifactsListResult as Cn, TalkConfigResultSchema as Co, NodeListParams as Cr, SkillsProposalsListResultSchema as Cs, ChatHistoryParamsSchema as Ct, SessionFileRelevanceSchema as D, WakeParams as Da, SkillsSearchResult as Di, ChannelsStatusResult as Dn, TalkSessionCancelTurnParamsSchema as Do, NodePairRemoveParams as Dr, SkillsSecurityVerdictsResultSchema as Ds, LogsTailParamsSchema as Dt, SessionFileKindSchema as E, UpdateStatusParams as Ea, SkillsSearchParams as Ei, ChannelsStatusParams as En, TalkSessionCancelOutputParamsSchema as Eo, NodePairRejectParams as Er, SkillsSecurityVerdictsParamsSchema as Es, ChatSendParamsSchema as Et, SessionsCreateParamsSchema as F, WizardStatusParams as Fa, SkillsUploadChunkParams as Fi, ConfigApplyParams as Fn, TalkSessionSubmitToolResultParamsSchema as Fo, NodePresenceAliveReason as Fr, ToolsCatalogParamsSchema as Fs, ResponseFrameSchema as Ft, SessionsPreviewParamsSchema as G, CronListParamsSchema as Ga, TalkClientToolCallParams as Gi, CronListParams as Gn, ArtifactsListParamsSchema as Go, SessionFileKind as Gr, WakeParamsSchema as Gs, EnvironmentsListParamsSchema as Gt, SessionsListParamsSchema as H, CronAddParamsSchema as Ha, TalkClientCreateParams as Hi, CronAddParams as Hn, ArtifactSummarySchema as Ho, SessionFileBrowserEntry as Hr, MessageActionParamsSchema as Hs, ExecApprovalsSetParamsSchema as Ht, SessionsDeleteParamsSchema as I, WizardStatusResult as Ia, SkillsUploadCommitParams as Ii, ConfigGetParams as In, TalkSessionTurnParamsSchema as Io, PluginsSessionActionParams as Ir, ToolsEffectiveParamsSchema as Is, ShutdownEventSchema as It, SessionsSendParamsSchema as J, CronRunsParamsSchema as Ja, TalkConfigResult as Ji, CronRunParams as Jn, AgentsCreateResultSchema as Jo, SessionsCleanupParams as Jr, EnvironmentsStatusResultSchema as Jt, SessionsResetParamsSchema as K, CronRemoveParamsSchema as Ka, TalkClientToolCallResult as Ki, CronRemoveParams as Kn, AgentSummarySchema as Ko, SessionFileRelevance as Kr, EnvironmentsListResultSchema as Kt, SessionsDescribeParamsSchema as L, WizardStep as La, Snapshot as Li, ConfigPatchParams as Ln, TalkSessionTurnResultSchema as Lo, PluginsSessionActionResult as Lr, ToolsInvokeParamsSchema as Ls, TickEventSchema as Lt, SessionsCompactionGetParamsSchema as M, WizardNextResult as Ma, SkillsStatusParams as Mi, CommandEntry as Mn, TalkSessionJoinResultSchema as Mo, NodePendingEnqueueParams as Mr, SkillsUploadBeginParamsSchema as Ms, GatewayFrameSchema as Mt, SessionsCompactionListParamsSchema as N, WizardStartParams as Na, SkillsUpdateParams as Ni, CommandsListParams as Nn, TalkSessionOkResultSchema as No, NodePendingEnqueueResult as Nr, SkillsUploadChunkParamsSchema as Ns, HelloOkSchema as Nt, SessionsAbortParamsSchema as O, WebLoginStartParams as Oa, SkillsSecurityVerdictsParams as Oi, ChannelsStopParams as On, TalkSessionCloseParamsSchema as Oo, NodePairRequestParams as Or, SkillsSkillCardParamsSchema as Os, LogsTailResultSchema as Ot, SessionsCompactionRestoreParamsSchema as P, WizardStartResult as Pa, SkillsUploadBeginParams as Pi, CommandsListResult as Pn, TalkSessionSteerParamsSchema as Po, NodePresenceAlivePayload as Pr, SkillsUploadCommitParamsSchema as Ps, RequestFrameSchema as Pt, WebPushSubscribeParams as Q, ConfigGetParamsSchema as Qa, TalkSessionCancelTurnParams as Qi, DevicePairApproveParams as Qn, AgentsFilesGetParamsSchema as Qo, SessionsFilesGetParams as Qr, AgentIdentityParams as Qt, SessionsFilesGetParamsSchema as R, ProtocolSchemas as Ra, StateVersion as Ri, ConfigSchemaParams as Rn, TalkSpeakParamsSchema as Ro, PollParams as Rr, AgentEventSchema as Rs, ExecApprovalGetParamsSchema as Rt, StateVersionSchema as S, ToolsEffectiveResult as Sa, SkillsProposalReviseParams as Si, ArtifactsListParams as Sn, TalkConfigParamsSchema as So, NodeInvokeResultParams as Sr, SkillsProposalsListParamsSchema as Ss, ChatEventSchema as St, SessionFileEntrySchema as T, UpdateRunParams as Ta, SkillsProposalsListResult as Ti, ChannelsStartParams as Tn, TalkSessionAppendAudioParamsSchema as To, NodePairListParams as Tr, SkillsSearchResultSchema as Ts, ChatMetadataParamsSchema as Tt, SessionsPatchParamsSchema as U, CronGetParamsSchema as Ua, TalkClientCreateResult as Ui, CronGetParams as Un, ArtifactsDownloadParamsSchema as Uo, SessionFileBrowserResult as Ur, PollParamsSchema as Us, EnvironmentStatusSchema as Ut, SessionsFilesListResultSchema as V, PROTOCOL_VERSION as Va, TalkCatalogResult as Vi, ConnectParams as Vn, WebLoginWaitParamsSchema as Vo, ResponseFrame as Vr, AgentParamsSchema as Vs, ExecApprovalsGetParamsSchema as Vt, SessionsPluginPatchParamsSchema as W, CronJobSchema as Wa, TalkClientSteerParams as Wi, CronJob as Wn, ArtifactsGetParamsSchema as Wo, SessionFileEntry as Wr, SendParamsSchema as Ws, EnvironmentSummarySchema as Wt, PushTestParamsSchema as X, CronUpdateParamsSchema as Xa, TalkSessionAppendAudioParams as Xi, CronStatusParams as Xn, AgentsDeleteResultSchema as Xo, SessionsDeleteParams as Xr, errorShape as Xt, SessionsUsageParamsSchema as Y, CronStatusParamsSchema as Ya, TalkModeParams as Yi, CronRunsParams as Yn, AgentsDeleteParamsSchema as Yo, SessionsCompactParams as Yr, ErrorCodes as Yt, PushTestResultSchema as Z, ConfigApplyParamsSchema as Za, TalkSessionCancelOutputParams as Zi, CronUpdateParams as Zn, AgentsFileEntrySchema as Zo, SessionsDescribeParams as Zr, AgentEvent as Zt, TasksGetResultSchema as _, TasksListResult as _a, SkillsProposalInspectParams as _i, ArtifactSummary as _n, TalkClientCreateParamsSchema as _o, LogsTailParams as _r, SkillsProposalRecordResultSchema as _s, NodePendingDrainResultSchema as _t, WizardStartResultSchema as a, TalkSessionSteerParams as aa, SessionsResetParams as ai, AgentsDeleteResult as an, UpdateRunParamsSchema as ao, EnvironmentsStatusParams as ar, AgentsListResultSchema as as, WebPushVapidPublicKeyParamsSchema as at, PresenceEntrySchema as b, ToolsCatalogResult as ba, SkillsProposalRequestRevisionParams as bi, ArtifactsGetParams as bn, TalkClientToolCallParamsSchema as bo, NodeEventResult as br, SkillsProposalReviseParamsSchema as bs, NodePresenceAlivePayloadSchema as bt, WizardStepSchema as c, TalkSessionTurnResult as ca, ShutdownEvent as ci, AgentsFilesGetResult as cn, CommandsListResultSchema as co, EventFrame as cr, ModelsListParamsSchema as cs, NodeListParamsSchema as ct, PluginsUiDescriptorsParamsSchema as d, TaskSummary as da, SkillsDetailParams as di, AgentsFilesSetParams as dn, ChannelsStatusParamsSchema as do, ExecApprovalResolveParams as dr, SkillsInstallParamsSchema as ds, NodePairRejectParamsSchema as dt, TalkSessionCreateParams as ea, SessionsFilesListParams as ei, AgentSummary as en, ConfigSchemaLookupParamsSchema as eo, DevicePairRejectParams as er, AgentsFilesListParamsSchema as es, WebPushTestParams as et, PluginsUiDescriptorsResultSchema as f, TasksCancelParams as fa, SkillsDetailResult as fi, AgentsFilesSetResult as fn, ChannelsStatusResultSchema as fo, ExecApprovalsGetParams as fr, SkillsProposalActionParamsSchema as fs, NodePairRemoveParamsSchema as ft, TasksGetParamsSchema as g, TasksListParams as ga, SkillsProposalCreateParams as gi, AgentsUpdateResult as gn, TalkCatalogResultSchema as go, HelloOk as gr, SkillsProposalInspectResultSchema as gs, NodePendingDrainParamsSchema as gt, TasksCancelResultSchema as h, TasksGetResult as ha, SkillsProposalApplyResult as hi, AgentsUpdateParams as hn, TalkCatalogParamsSchema as ho, GatewayFrame as hr, SkillsProposalInspectParamsSchema as hs, NodePendingAckParamsSchema as ht, WizardStartParamsSchema as i, TalkSessionOkResult as ia, SessionsPreviewParams as ii, AgentsDeleteParams as in, ConfigSetParamsSchema as io, EnvironmentsListResult as ir, AgentsListParamsSchema as is, WebPushVapidPublicKeyParams as it, SessionsCompactionBranchParamsSchema as j, WizardNextParams as ja, SkillsSkillCardResult as ji, ChatMetadataParams as jn, TalkSessionJoinParamsSchema as jo, NodePendingDrainResult as jr, SkillsUpdateParamsSchema as js, EventFrameSchema as jt, SessionsCleanupParamsSchema as k, WebLoginWaitParams as ka, SkillsSecurityVerdictsResult as ki, ChatEvent as kn, TalkSessionCreateParamsSchema as ko, NodePairVerifyParams as kr, SkillsSkillCardResultSchema as ks, ConnectParamsSchema as kt, PluginsSessionActionParamsSchema as l, TalkSpeakParams as la, SkillsBinsParams as li, AgentsFilesListParams as ln, ChannelsLogoutParamsSchema as lo, ExecApprovalGetParams as lr, SkillsDetailParamsSchema as ls, NodePairApproveParamsSchema as lt, TasksCancelParamsSchema as m, TasksGetParams as ma, SkillsProposalActionParams as mi, AgentsListResult as mn, TalkAgentControlResultSchema as mo, ExecApprovalsSnapshot as mr, SkillsProposalCreateParamsSchema as ms, NodePairVerifyParamsSchema as mt, WizardNextParamsSchema as n, TalkSessionJoinParams as na, SessionsListParams as ni, AgentsCreateParams as nn, ConfigSchemaParamsSchema as no, EnvironmentSummary as nr, AgentsFilesSetParamsSchema as ns, WebPushUnsubscribeParams as nt, WizardStatusParamsSchema as o, TalkSessionSubmitToolResultParams as oa, SessionsResolveParams as oi, AgentsFileEntry as on, UpdateStatusParamsSchema as oo, EnvironmentsStatusResult as or, AgentsUpdateParamsSchema as os, NodeEventResultSchema as ot, TaskSummarySchema as p, TasksCancelResult as pa, SkillsInstallParams as pi, AgentsListParams as pn, ChannelsStopParamsSchema as po, ExecApprovalsSetParams as pr, SkillsProposalApplyResultSchema as ps, NodePairRequestParamsSchema as pt, SessionsResolveParamsSchema as q, CronRunParamsSchema as qa, TalkConfigParams as qi, CronRunLogEntry as qn, AgentsCreateParamsSchema as qo, SessionOperationEvent as qr, EnvironmentsStatusParamsSchema as qt, WizardNextResultSchema as r, TalkSessionJoinResult as ra, SessionsPatchParams as ri, AgentsCreateResult as rn, ConfigSchemaResponseSchema as ro, EnvironmentsListParams as rr, AgentsFilesSetResultSchema as rs, WebPushUnsubscribeParamsSchema as rt, WizardStatusResultSchema as s, TalkSessionTurnParams as sa, SessionsUsageParams as si, AgentsFilesGetParams as sn, CommandsListParamsSchema as so, ErrorShape as sr, AgentsUpdateResultSchema as ss, NodeInvokeParamsSchema as st, WizardCancelParamsSchema as t, TalkSessionCreateResult as ta, SessionsFilesListResult as ti, AgentWaitParams as tn, ConfigSchemaLookupResultSchema as to, EnvironmentStatus as tr, AgentsFilesListResultSchema as ts, WebPushTestParamsSchema as tt, PluginsSessionActionResultSchema as u, TalkSpeakResult as ua, SkillsBinsResult as ui, AgentsFilesListResult as un, ChannelsStartParamsSchema as uo, ExecApprovalRequestParams as ur, SkillsDetailResultSchema as us, NodePairListParamsSchema as ut, TasksListParamsSchema as v, TickEvent as va, SkillsProposalInspectResult as vi, ArtifactsDownloadParams as vn, TalkClientCreateResultSchema as vo, LogsTailResult as vr, SkillsProposalRequestRevisionParamsSchema as vs, NodePendingEnqueueParamsSchema as vt, SessionFileBrowserResultSchema as w, ToolsInvokeResult as wa, SkillsProposalsListParams as wi, ChannelsLogoutParams as wn, TalkEventSchema as wo, NodePairApproveParams as wr, SkillsSearchParamsSchema as ws, ChatInjectParamsSchema as wt, SnapshotSchema as x, ToolsEffectiveParams as xa, SkillsProposalRequestRevisionResult as xi, ArtifactsGetResult as xn, TalkClientToolCallResultSchema as xo, NodeInvokeParams as xr, SkillsProposalUpdateParamsSchema as xs, NodePresenceAliveReasonSchema as xt, TasksListResultSchema as y, ToolsCatalogParams as ya, SkillsProposalRecordResult as yi, ArtifactsDownloadResult as yn, TalkClientSteerParamsSchema as yo, NodeEventParams as yr, SkillsProposalRequestRevisionResultSchema as ys, NodePendingEnqueueResultSchema as yt, SessionsFilesGetResultSchema as z, MIN_CLIENT_PROTOCOL_VERSION as za, TalkAgentControlResult as zi, ConfigSchemaResponse as zn, TalkSpeakResultSchema as zo, PresenceEntry as zr, AgentIdentityParamsSchema as zs, ExecApprovalRequestParamsSchema as zt };