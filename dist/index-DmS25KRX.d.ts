import { Q as WebPushSubscribeParams, et as WebPushTestParams, it as WebPushVapidPublicKeyParams, nt as WebPushUnsubscribeParams } from "./schema-JKCmgTCB.js";

//#region packages/gateway-protocol/src/index.d.ts
/** Normalized validation error shape exposed by every protocol validator. */
type ValidationError = {
  /** Failed schema keyword, when the validator can report one. */keyword?: string; /** JSON-pointer path to the failing data location. */
  instancePath?: string; /** JSON-pointer path to the failing schema location. */
  schemaPath?: string; /** Validator-specific keyword parameters for richer diagnostics. */
  params?: Record<string, unknown>; /** Human-readable validation message. */
  message?: string;
};
/** Runtime validator shape shared by gateway clients and server handlers. */
type ProtocolValidator<T = unknown> = ((data: unknown) => data is T) & {
  /** Last validation errors, matching Ajv-style caller expectations. */errors: ValidationError[] | null; /** Original schema used by the validator, exposed for diagnostics/tests. */
  schema: unknown;
};
declare const validateCommandsListParams: ProtocolValidator<{
  scope?: "text" | "native" | "both" | undefined;
  agentId?: string | undefined;
  provider?: string | undefined;
  includeArgs?: boolean | undefined;
}>;
declare const validateConnectParams: ProtocolValidator<{
  caps?: string[] | undefined;
  commands?: string[] | undefined;
  permissions?: Record<string, boolean> | undefined;
  pathEnv?: string | undefined;
  role?: string | undefined;
  scopes?: string[] | undefined;
  device?: {
    id: string;
    publicKey: string;
    signature: string;
    signedAt: number;
    nonce: string;
  } | undefined;
  auth?: {
    token?: string | undefined;
    bootstrapToken?: string | undefined;
    deviceToken?: string | undefined;
    password?: string | undefined;
    approvalRuntimeToken?: string | undefined;
  } | undefined;
  locale?: string | undefined;
  userAgent?: string | undefined;
  minProtocol: number;
  maxProtocol: number;
  client: {
    displayName?: string | undefined;
    deviceFamily?: string | undefined;
    modelIdentifier?: string | undefined;
    instanceId?: string | undefined;
    id: "webchat-ui" | "openclaw-control-ui" | "openclaw-tui" | "webchat" | "cli" | "gateway-client" | "openclaw-macos" | "openclaw-ios" | "openclaw-android" | "node-host" | "test" | "fingerprint" | "openclaw-probe";
    version: string;
    platform: string;
    mode: "webchat" | "cli" | "test" | "ui" | "backend" | "node" | "probe";
  };
}>;
declare const validateRequestFrame: ProtocolValidator<{
  params?: unknown;
  type: "req";
  id: string;
  method: string;
}>;
declare const validateResponseFrame: ProtocolValidator<{
  error?: {
    details?: unknown;
    retryable?: boolean | undefined;
    retryAfterMs?: number | undefined;
    message: string;
    code: string;
  } | undefined;
  payload?: unknown;
  type: "res";
  id: string;
  ok: boolean;
}>;
declare const validateEventFrame: ProtocolValidator<{
  stateVersion?: {
    presence: number;
    health: number;
  } | undefined;
  payload?: unknown;
  seq?: number | undefined;
  type: "event";
  event: string;
}>;
declare const validateMessageActionParams: ProtocolValidator<{
  accountId?: string | undefined;
  requesterAccountId?: string | undefined;
  requesterSenderId?: string | undefined;
  senderIsOwner?: boolean | undefined;
  sessionKey?: string | undefined;
  sessionId?: string | undefined;
  inboundTurnKind?: string | undefined;
  agentId?: string | undefined;
  toolContext?: {
    currentChannelId?: string | undefined;
    currentMessagingTarget?: string | undefined;
    currentGraphChannelId?: string | undefined;
    currentChannelProvider?: string | undefined;
    currentThreadTs?: string | undefined;
    currentMessageId?: string | number | undefined;
    replyToMode?: "off" | "first" | "all" | "batched" | undefined;
    hasRepliedRef?: {
      value: boolean;
    } | undefined;
    sameChannelThreadRequired?: boolean | undefined;
    skipCrossContextDecoration?: boolean | undefined;
  } | undefined;
  params: Record<string, unknown>;
  channel: string;
  action: string;
  idempotencyKey: string;
}>;
declare const validateSendParams: ProtocolValidator<unknown>;
declare const validatePollParams: ProtocolValidator<{
  channel?: string | undefined;
  accountId?: string | undefined;
  threadId?: string | undefined;
  silent?: boolean | undefined;
  maxSelections?: number | undefined;
  durationSeconds?: number | undefined;
  durationHours?: number | undefined;
  isAnonymous?: boolean | undefined;
  options: string[];
  idempotencyKey: string;
  to: string;
  question: string;
}>;
declare const validateAgentParams: ProtocolValidator<unknown>;
declare const validateAgentIdentityParams: ProtocolValidator<{
  sessionKey?: string | undefined;
  agentId?: string | undefined;
}>;
declare const validateAgentWaitParams: ProtocolValidator<{
  timeoutMs?: number | undefined;
  runId: string;
}>;
declare const validateWakeParams: ProtocolValidator<{
  sessionKey?: string | undefined;
  agentId?: string | undefined;
  mode: "now" | "next-heartbeat";
  text: string;
}>;
declare const validateAgentsListParams: ProtocolValidator<object>;
declare const validateAgentsCreateParams: ProtocolValidator<{
  model?: string | undefined;
  avatar?: string | undefined;
  emoji?: string | undefined;
  name: string;
  workspace: string;
}>;
declare const validateAgentsUpdateParams: ProtocolValidator<{
  model?: string | undefined;
  name?: string | undefined;
  avatar?: string | undefined;
  emoji?: string | undefined;
  workspace?: string | undefined;
  agentId: string;
}>;
declare const validateAgentsDeleteParams: ProtocolValidator<{
  deleteFiles?: boolean | undefined;
  agentId: string;
}>;
declare const validateAgentsFilesListParams: ProtocolValidator<{
  agentId: string;
}>;
declare const validateAgentsFilesGetParams: ProtocolValidator<{
  agentId: string;
  name: string;
}>;
declare const validateAgentsFilesSetParams: ProtocolValidator<{
  agentId: string;
  name: string;
  content: string;
}>;
declare const validateArtifactsListParams: ProtocolValidator<{
  runId?: string | undefined;
  sessionKey?: string | undefined;
  agentId?: string | undefined;
  taskId?: string | undefined;
}>;
declare const validateArtifactsGetParams: ProtocolValidator<{
  runId?: string | undefined;
  sessionKey?: string | undefined;
  agentId?: string | undefined;
  taskId?: string | undefined;
  artifactId: string;
}>;
declare const validateArtifactsDownloadParams: ProtocolValidator<{
  runId?: string | undefined;
  sessionKey?: string | undefined;
  agentId?: string | undefined;
  taskId?: string | undefined;
  artifactId: string;
}>;
declare const validateNodePairRequestParams: ProtocolValidator<{
  version?: string | undefined;
  displayName?: string | undefined;
  platform?: string | undefined;
  deviceFamily?: string | undefined;
  modelIdentifier?: string | undefined;
  caps?: string[] | undefined;
  commands?: string[] | undefined;
  permissions?: Record<string, boolean> | undefined;
  silent?: boolean | undefined;
  coreVersion?: string | undefined;
  uiVersion?: string | undefined;
  remoteIp?: string | undefined;
  nodeId: string;
}>;
declare const validateNodePairListParams: ProtocolValidator<object>;
declare const validateNodePairApproveParams: ProtocolValidator<{
  requestId: string;
}>;
declare const validateNodePairRejectParams: ProtocolValidator<{
  requestId: string;
}>;
declare const validateNodePairRemoveParams: ProtocolValidator<{
  nodeId: string;
}>;
declare const validateNodePairVerifyParams: ProtocolValidator<{
  token: string;
  nodeId: string;
}>;
declare const validateNodeRenameParams: ProtocolValidator<{
  displayName: string;
  nodeId: string;
}>;
declare const validateNodeListParams: ProtocolValidator<object>;
declare const validateEnvironmentsListParams: ProtocolValidator<object>;
declare const validateEnvironmentsStatusParams: ProtocolValidator<{
  environmentId: string;
}>;
declare const validateNodePendingAckParams: ProtocolValidator<{
  ids: string[];
}>;
declare const validateNodeDescribeParams: ProtocolValidator<{
  nodeId: string;
}>;
declare const validateNodeInvokeParams: ProtocolValidator<{
  params?: unknown;
  timeoutMs?: number | undefined;
  idempotencyKey: string;
  nodeId: string;
  command: string;
}>;
declare const validateNodeInvokeResultParams: ProtocolValidator<{
  error?: {
    message?: string | undefined;
    code?: string | undefined;
  } | undefined;
  payload?: unknown;
  payloadJSON?: string | undefined;
  id: string;
  ok: boolean;
  nodeId: string;
}>;
declare const validateNodeEventParams: ProtocolValidator<{
  payload?: unknown;
  payloadJSON?: string | undefined;
  event: string;
}>;
declare const validateNodeEventResult: ProtocolValidator<{
  reason?: string | undefined;
  ok: boolean;
  event: string;
  handled: boolean;
}>;
declare const validateNodePresenceAlivePayload: ProtocolValidator<{
  version?: string | undefined;
  displayName?: string | undefined;
  platform?: string | undefined;
  deviceFamily?: string | undefined;
  modelIdentifier?: string | undefined;
  sentAtMs?: number | undefined;
  pushTransport?: string | undefined;
  trigger: string;
}>;
declare const validateNodePendingDrainParams: ProtocolValidator<{
  maxItems?: number | undefined;
}>;
declare const validateNodePendingEnqueueParams: ProtocolValidator<{
  priority?: string | undefined;
  expiresInMs?: number | undefined;
  wake?: boolean | undefined;
  type: string;
  nodeId: string;
}>;
declare const validatePushTestParams: ProtocolValidator<{
  title?: string | undefined;
  body?: string | undefined;
  environment?: string | undefined;
  nodeId: string;
}>;
declare const validateWebPushVapidPublicKeyParams: ProtocolValidator<WebPushVapidPublicKeyParams>;
declare const validateWebPushSubscribeParams: ProtocolValidator<WebPushSubscribeParams>;
declare const validateWebPushUnsubscribeParams: ProtocolValidator<WebPushUnsubscribeParams>;
declare const validateWebPushTestParams: ProtocolValidator<WebPushTestParams>;
declare const validateSecretsResolveParams: ProtocolValidator<{
  allowedPaths?: string[] | undefined;
  forcedActivePaths?: string[] | undefined;
  optionalActivePaths?: string[] | undefined;
  providerOverrides?: {
    webSearch?: string | undefined;
    webFetch?: string | undefined;
  } | undefined;
  commandName: string;
  targetIds: string[];
}>;
declare const validateSecretsResolveResult: ProtocolValidator<{
  ok?: boolean | undefined;
  assignments?: {
    path?: string | undefined;
    value: unknown;
    pathSegments: string[];
  }[] | undefined;
  diagnostics?: string[] | undefined;
  inactiveRefPaths?: string[] | undefined;
}>;
declare const validateSessionsListParams: ProtocolValidator<{
  search?: string | undefined;
  label?: string | undefined;
  spawnedBy?: string | undefined;
  agentId?: string | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  activeMinutes?: number | undefined;
  includeGlobal?: boolean | undefined;
  includeUnknown?: boolean | undefined;
  configuredAgentsOnly?: boolean | undefined;
  includeDerivedTitles?: boolean | undefined;
  includeLastMessage?: boolean | undefined;
}>;
declare const validateSessionsCleanupParams: ProtocolValidator<{
  agent?: string | undefined;
  allAgents?: boolean | undefined;
  enforce?: boolean | undefined;
  activeKey?: string | undefined;
  fixMissing?: boolean | undefined;
  fixDmScope?: boolean | undefined;
}>;
declare const validateSessionsPreviewParams: ProtocolValidator<{
  limit?: number | undefined;
  maxChars?: number | undefined;
  keys: string[];
}>;
declare const validateSessionsDescribeParams: ProtocolValidator<{
  includeDerivedTitles?: boolean | undefined;
  includeLastMessage?: boolean | undefined;
  key: string;
}>;
declare const validateSessionsResolveParams: ProtocolValidator<{
  key?: string | undefined;
  label?: string | undefined;
  spawnedBy?: string | undefined;
  sessionId?: string | undefined;
  agentId?: string | undefined;
  includeGlobal?: boolean | undefined;
  includeUnknown?: boolean | undefined;
  allowMissing?: boolean | undefined;
}>;
declare const validateSessionsFilesListParams: ProtocolValidator<{
  path?: string | undefined;
  search?: string | undefined;
  agentId?: string | undefined;
  sessionKey: string;
}>;
declare const validateSessionsFilesGetParams: ProtocolValidator<{
  agentId?: string | undefined;
  path: string;
  sessionKey: string;
}>;
declare const validateSessionsCreateParams: ProtocolValidator<{
  message?: string | undefined;
  key?: string | undefined;
  label?: string | undefined;
  agentId?: string | undefined;
  model?: string | undefined;
  parentSessionKey?: string | undefined;
  emitCommandHooks?: boolean | undefined;
  task?: string | undefined;
}>;
declare const validateSessionsSendParams: ProtocolValidator<{
  agentId?: string | undefined;
  idempotencyKey?: string | undefined;
  thinking?: string | undefined;
  attachments?: unknown[] | undefined;
  timeoutMs?: number | undefined;
  message: string;
  key: string;
}>;
declare const validateSessionsMessagesSubscribeParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
}>;
declare const validateSessionsMessagesUnsubscribeParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
}>;
declare const validateSessionsAbortParams: ProtocolValidator<{
  key?: string | undefined;
  runId?: string | undefined;
  agentId?: string | undefined;
}>;
declare const validateSessionsPatchParams: ProtocolValidator<{
  label?: string | null | undefined;
  spawnedBy?: string | null | undefined;
  agentId?: string | undefined;
  model?: string | null | undefined;
  thinkingLevel?: string | null | undefined;
  fastMode?: boolean | "auto" | null | undefined;
  verboseLevel?: string | null | undefined;
  traceLevel?: string | null | undefined;
  reasoningLevel?: string | null | undefined;
  responseUsage?: "off" | "full" | "tokens" | "on" | null | undefined;
  elevatedLevel?: string | null | undefined;
  execHost?: string | null | undefined;
  execSecurity?: string | null | undefined;
  execAsk?: string | null | undefined;
  execNode?: string | null | undefined;
  spawnedWorkspaceDir?: string | null | undefined;
  spawnedCwd?: string | null | undefined;
  spawnDepth?: number | null | undefined;
  subagentRole?: "orchestrator" | "leaf" | null | undefined;
  subagentControlScope?: "none" | "children" | null | undefined;
  inheritedToolAllow?: string[] | null | undefined;
  inheritedToolDeny?: string[] | null | undefined;
  sendPolicy?: "allow" | "deny" | null | undefined;
  groupActivation?: "mention" | "always" | null | undefined;
  key: string;
}>;
declare const validateSessionsPluginPatchParams: ProtocolValidator<{
  value?: unknown;
  unset?: boolean | undefined;
  key: string;
  pluginId: string;
  namespace: string;
}>;
declare const validateSessionsResetParams: ProtocolValidator<{
  reason?: "new" | "reset" | undefined;
  agentId?: string | undefined;
  key: string;
}>;
declare const validateSessionsDeleteParams: ProtocolValidator<{
  agentId?: string | undefined;
  deleteTranscript?: boolean | undefined;
  emitLifecycleHooks?: boolean | undefined;
  key: string;
}>;
declare const validateSessionsCompactParams: ProtocolValidator<{
  agentId?: string | undefined;
  maxLines?: number | undefined;
  key: string;
}>;
declare const validateSessionsCompactionListParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
}>;
declare const validateSessionsCompactionGetParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
  checkpointId: string;
}>;
declare const validateSessionsCompactionBranchParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
  checkpointId: string;
}>;
declare const validateSessionsCompactionRestoreParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
  checkpointId: string;
}>;
declare const validateSessionsUsageParams: ProtocolValidator<{
  key?: string | undefined;
  mode?: "utc" | "gateway" | "specific" | undefined;
  agentId?: string | undefined;
  limit?: number | undefined;
  agentScope?: "all" | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  range?: "all" | "7d" | "30d" | "90d" | "1y" | undefined;
  groupBy?: "instance" | "family" | undefined;
  includeHistorical?: boolean | undefined;
  utcOffset?: string | undefined;
  includeContextWeight?: boolean | undefined;
}>;
declare const validateTasksListParams: ProtocolValidator<{
  status?: "queued" | "completed" | "running" | "failed" | "cancelled" | "timed_out" | ("queued" | "completed" | "running" | "failed" | "cancelled" | "timed_out")[] | undefined;
  sessionKey?: string | undefined;
  agentId?: string | undefined;
  limit?: number | undefined;
  cursor?: string | undefined;
}>;
declare const validateTasksGetParams: ProtocolValidator<{
  taskId: string;
}>;
declare const validateTasksCancelParams: ProtocolValidator<{
  reason?: string | undefined;
  taskId: string;
}>;
declare const validateConfigGetParams: ProtocolValidator<object>;
declare const validateConfigSetParams: ProtocolValidator<{
  baseHash?: string | undefined;
  raw: string;
}>;
declare const validateConfigApplyParams: ProtocolValidator<{
  readonly sessionKey?: string | undefined;
  readonly baseHash?: string | undefined;
  readonly deliveryContext?: {
    channel?: string | undefined;
    accountId?: string | undefined;
    to?: string | undefined;
    threadId?: string | number | undefined;
  } | undefined;
  readonly note?: string | undefined;
  readonly restartDelayMs?: number | undefined;
  readonly raw: string;
}>;
declare const validateConfigPatchParams: ProtocolValidator<{
  sessionKey?: string | undefined;
  baseHash?: string | undefined;
  deliveryContext?: {
    channel?: string | undefined;
    accountId?: string | undefined;
    to?: string | undefined;
    threadId?: string | number | undefined;
  } | undefined;
  note?: string | undefined;
  restartDelayMs?: number | undefined;
  replacePaths?: string[] | undefined;
  raw: string;
}>;
declare const validateConfigSchemaParams: ProtocolValidator<object>;
declare const validateConfigSchemaLookupParams: ProtocolValidator<{
  path: string;
}>;
declare const validateConfigSchemaLookupResult: ProtocolValidator<{
  reloadKind?: "none" | "restart" | "hot" | undefined;
  hint?: {
    tags?: string[] | undefined;
    label?: string | undefined;
    help?: string | undefined;
    group?: string | undefined;
    order?: number | undefined;
    advanced?: boolean | undefined;
    sensitive?: boolean | undefined;
    placeholder?: string | undefined;
    itemTemplate?: unknown;
  } | undefined;
  hintPath?: string | undefined;
  path: string;
  children: {
    type?: string | string[] | undefined;
    reloadKind?: "none" | "restart" | "hot" | undefined;
    hint?: {
      tags?: string[] | undefined;
      label?: string | undefined;
      help?: string | undefined;
      group?: string | undefined;
      order?: number | undefined;
      advanced?: boolean | undefined;
      sensitive?: boolean | undefined;
      placeholder?: string | undefined;
      itemTemplate?: unknown;
    } | undefined;
    hintPath?: string | undefined;
    path: string;
    key: string;
    required: boolean;
    hasChildren: boolean;
  }[];
  schema: unknown;
}>;
declare const validateWizardStartParams: ProtocolValidator<{
  mode?: "local" | "remote" | undefined;
  workspace?: string | undefined;
}>;
declare const validateWizardNextParams: ProtocolValidator<{
  answer?: {
    value?: unknown;
    stepId: string;
  } | undefined;
  sessionId: string;
}>;
declare const validateWizardCancelParams: ProtocolValidator<{
  sessionId: string;
}>;
declare const validateWizardStatusParams: ProtocolValidator<{
  sessionId: string;
}>;
declare const validateTalkModeParams: ProtocolValidator<{
  phase?: string | undefined;
  enabled: boolean;
}>;
declare const validateTalkEvent: ProtocolValidator<{
  provider?: string | undefined;
  turnId?: string | undefined;
  captureId?: string | undefined;
  final?: boolean | undefined;
  callId?: string | undefined;
  itemId?: string | undefined;
  parentId?: string | undefined;
  type: "session.started" | "session.ready" | "session.closed" | "session.error" | "session.replaced" | "turn.started" | "turn.ended" | "turn.cancelled" | "capture.started" | "capture.stopped" | "capture.cancelled" | "capture.once" | "input.audio.delta" | "input.audio.committed" | "transcript.delta" | "transcript.done" | "output.text.delta" | "output.text.done" | "output.audio.started" | "output.audio.delta" | "output.audio.done" | "tool.call" | "tool.progress" | "tool.result" | "tool.error" | "usage.metrics" | "latency.metrics" | "health.changed";
  id: string;
  mode: "realtime" | "stt-tts" | "transcription";
  payload: unknown;
  seq: number;
  sessionId: string;
  transport: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room";
  timestamp: string;
  brain: "none" | "agent-consult" | "direct-tools";
}>;
declare const validateTalkCatalogParams: ProtocolValidator<object>;
declare const validateTalkCatalogResult: ProtocolValidator<{
  realtime: {
    activeProvider?: string | undefined;
    providers: {
      modes?: ("realtime" | "stt-tts" | "transcription")[] | undefined;
      transports?: ("webrtc" | "provider-websocket" | "gateway-relay" | "managed-room")[] | undefined;
      brains?: ("none" | "agent-consult" | "direct-tools")[] | undefined;
      models?: string[] | undefined;
      voices?: string[] | undefined;
      defaultModel?: string | undefined;
      inputAudioFormats?: {
        encoding: "pcm16" | "g711_ulaw";
        sampleRateHz: number;
        channels: number;
      }[] | undefined;
      outputAudioFormats?: {
        encoding: "pcm16" | "g711_ulaw";
        sampleRateHz: number;
        channels: number;
      }[] | undefined;
      supportsBrowserSession?: boolean | undefined;
      supportsBargeIn?: boolean | undefined;
      supportsToolCalls?: boolean | undefined;
      supportsVideoFrames?: boolean | undefined;
      supportsSessionResumption?: boolean | undefined;
      id: string;
      label: string;
      configured: boolean;
    }[];
  };
  transcription: {
    activeProvider?: string | undefined;
    providers: {
      modes?: ("realtime" | "stt-tts" | "transcription")[] | undefined;
      transports?: ("webrtc" | "provider-websocket" | "gateway-relay" | "managed-room")[] | undefined;
      brains?: ("none" | "agent-consult" | "direct-tools")[] | undefined;
      models?: string[] | undefined;
      voices?: string[] | undefined;
      defaultModel?: string | undefined;
      inputAudioFormats?: {
        encoding: "pcm16" | "g711_ulaw";
        sampleRateHz: number;
        channels: number;
      }[] | undefined;
      outputAudioFormats?: {
        encoding: "pcm16" | "g711_ulaw";
        sampleRateHz: number;
        channels: number;
      }[] | undefined;
      supportsBrowserSession?: boolean | undefined;
      supportsBargeIn?: boolean | undefined;
      supportsToolCalls?: boolean | undefined;
      supportsVideoFrames?: boolean | undefined;
      supportsSessionResumption?: boolean | undefined;
      id: string;
      label: string;
      configured: boolean;
    }[];
  };
  modes: ("realtime" | "stt-tts" | "transcription")[];
  transports: ("webrtc" | "provider-websocket" | "gateway-relay" | "managed-room")[];
  brains: ("none" | "agent-consult" | "direct-tools")[];
  speech: {
    activeProvider?: string | undefined;
    providers: {
      modes?: ("realtime" | "stt-tts" | "transcription")[] | undefined;
      transports?: ("webrtc" | "provider-websocket" | "gateway-relay" | "managed-room")[] | undefined;
      brains?: ("none" | "agent-consult" | "direct-tools")[] | undefined;
      models?: string[] | undefined;
      voices?: string[] | undefined;
      defaultModel?: string | undefined;
      inputAudioFormats?: {
        encoding: "pcm16" | "g711_ulaw";
        sampleRateHz: number;
        channels: number;
      }[] | undefined;
      outputAudioFormats?: {
        encoding: "pcm16" | "g711_ulaw";
        sampleRateHz: number;
        channels: number;
      }[] | undefined;
      supportsBrowserSession?: boolean | undefined;
      supportsBargeIn?: boolean | undefined;
      supportsToolCalls?: boolean | undefined;
      supportsVideoFrames?: boolean | undefined;
      supportsSessionResumption?: boolean | undefined;
      id: string;
      label: string;
      configured: boolean;
    }[];
  };
}>;
declare const validateTalkConfigParams: ProtocolValidator<{
  includeSecrets?: boolean | undefined;
}>;
declare const validateTalkConfigResult: ProtocolValidator<{
  config: {
    ui?: {
      seamColor?: string | undefined;
    } | undefined;
    talk?: {
      provider?: string | undefined;
      realtime?: {
        mode?: "realtime" | "stt-tts" | "transcription" | undefined;
        provider?: string | undefined;
        model?: string | undefined;
        transport?: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room" | undefined;
        brain?: "none" | "agent-consult" | "direct-tools" | undefined;
        providers?: Record<string, {
          apiKey?: string | {
            id: string;
            source: "env";
            provider: string;
          } | {
            id: string;
            source: "file";
            provider: string;
          } | {
            id: string;
            source: "exec";
            provider: string;
          } | undefined;
        }> | undefined;
        voice?: string | undefined;
        speakerVoice?: string | undefined;
        speakerVoiceId?: string | undefined;
        instructions?: string | undefined;
      } | undefined;
      providers?: Record<string, {
        apiKey?: string | {
          id: string;
          source: "env";
          provider: string;
        } | {
          id: string;
          source: "file";
          provider: string;
        } | {
          id: string;
          source: "exec";
          provider: string;
        } | undefined;
      }> | undefined;
      resolved?: {
        provider: string;
        config: {
          apiKey?: string | {
            id: string;
            source: "env";
            provider: string;
          } | {
            id: string;
            source: "file";
            provider: string;
          } | {
            id: string;
            source: "exec";
            provider: string;
          } | undefined;
        };
      } | undefined;
      consultThinkingLevel?: string | undefined;
      consultFastMode?: boolean | undefined;
      speechLocale?: string | undefined;
      interruptOnSpeech?: boolean | undefined;
      silenceTimeoutMs?: number | undefined;
    } | undefined;
    session?: {
      mainKey?: string | undefined;
    } | undefined;
  };
}>;
declare const validateTalkClientCreateParams: ProtocolValidator<{
  mode?: "realtime" | "stt-tts" | "transcription" | undefined;
  sessionKey?: string | undefined;
  provider?: string | undefined;
  model?: string | undefined;
  transport?: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room" | undefined;
  brain?: "none" | "agent-consult" | "direct-tools" | undefined;
  voice?: string | undefined;
  vadThreshold?: number | undefined;
  silenceDurationMs?: number | undefined;
  prefixPaddingMs?: number | undefined;
  reasoningEffort?: string | undefined;
}>;
declare const validateTalkClientCreateResult: ProtocolValidator<{
  model?: string | undefined;
  voice?: string | undefined;
  offerUrl?: string | undefined;
  offerHeaders?: Record<string, string> | undefined;
  expiresAt?: number | undefined;
  provider: string;
  transport: "webrtc";
  clientSecret: string;
} | {
  model?: string | undefined;
  voice?: string | undefined;
  expiresAt?: number | undefined;
  initialMessage?: unknown;
  protocol: string;
  provider: string;
  audio: {
    inputEncoding: "pcm16" | "g711_ulaw";
    inputSampleRateHz: number;
    outputEncoding: "pcm16" | "g711_ulaw";
    outputSampleRateHz: number;
  };
  transport: "provider-websocket";
  clientSecret: string;
  websocketUrl: string;
} | {
  model?: string | undefined;
  voice?: string | undefined;
  expiresAt?: number | undefined;
  provider: string;
  audio: {
    inputEncoding: "pcm16" | "g711_ulaw";
    inputSampleRateHz: number;
    outputEncoding: "pcm16" | "g711_ulaw";
    outputSampleRateHz: number;
  };
  transport: "gateway-relay";
  relaySessionId: string;
} | {
  token?: string | undefined;
  model?: string | undefined;
  voice?: string | undefined;
  expiresAt?: number | undefined;
  provider: string;
  transport: "managed-room";
  roomUrl: string;
}>;
declare const validateTalkClientToolCallParams: ProtocolValidator<{
  relaySessionId?: string | undefined;
  args?: unknown;
  sessionKey: string;
  name: string;
  callId: string;
}>;
declare const validateTalkClientToolCallResult: ProtocolValidator<{
  runId: string;
  idempotencyKey: string;
}>;
declare const validateTalkClientSteerParams: ProtocolValidator<{
  mode?: "status" | "steer" | "cancel" | "followup" | undefined;
  text: string;
  sessionKey: string;
}>;
declare const validateTalkAgentControlResult: ProtocolValidator<{
  target?: "embedded_run" | "reply_run" | undefined;
  reason?: string | undefined;
  sessionId?: string | undefined;
  queued?: boolean | undefined;
  aborted?: boolean | undefined;
  providerResult?: {
    message: string;
    status: "cancelled";
  } | undefined;
  enqueuedAtMs?: number | undefined;
  deliveredAtMs?: number | undefined;
  message: string;
  mode: "status" | "steer" | "cancel" | "followup";
  ok: boolean;
  sessionKey: string;
  active: boolean;
  speak: boolean;
  show: boolean;
  suppress: boolean;
}>;
declare const validateTalkSessionCreateParams: ProtocolValidator<{
  mode?: "realtime" | "stt-tts" | "transcription" | undefined;
  spawnedBy?: string | undefined;
  sessionKey?: string | undefined;
  provider?: string | undefined;
  model?: string | undefined;
  transport?: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room" | undefined;
  brain?: "none" | "agent-consult" | "direct-tools" | undefined;
  voice?: string | undefined;
  vadThreshold?: number | undefined;
  silenceDurationMs?: number | undefined;
  prefixPaddingMs?: number | undefined;
  reasoningEffort?: string | undefined;
  ttlMs?: number | undefined;
}>;
declare const validateTalkSessionCreateResult: ProtocolValidator<{
  token?: string | undefined;
  provider?: string | undefined;
  model?: string | undefined;
  audio?: unknown;
  voice?: string | undefined;
  expiresAt?: number | undefined;
  relaySessionId?: string | undefined;
  roomUrl?: string | undefined;
  transcriptionSessionId?: string | undefined;
  handoffId?: string | undefined;
  roomId?: string | undefined;
  mode: "realtime" | "stt-tts" | "transcription";
  sessionId: string;
  transport: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room";
  brain: "none" | "agent-consult" | "direct-tools";
}>;
declare const validateTalkSessionJoinParams: ProtocolValidator<{
  token: string;
  sessionId: string;
}>;
declare const validateTalkSessionJoinResult: ProtocolValidator<{
  target?: string | undefined;
  channel?: string | undefined;
  sessionId?: string | undefined;
  provider?: string | undefined;
  model?: string | undefined;
  voice?: string | undefined;
  id: string;
  mode: "realtime" | "stt-tts" | "transcription";
  sessionKey: string;
  transport: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room";
  createdAt: number;
  brain: "none" | "agent-consult" | "direct-tools";
  expiresAt: number;
  roomUrl: string;
  roomId: string;
  room: {
    activeClientId?: string | undefined;
    activeTurnId?: string | undefined;
    recentTalkEvents: {
      provider?: string | undefined;
      turnId?: string | undefined;
      captureId?: string | undefined;
      final?: boolean | undefined;
      callId?: string | undefined;
      itemId?: string | undefined;
      parentId?: string | undefined;
      type: "session.started" | "session.ready" | "session.closed" | "session.error" | "session.replaced" | "turn.started" | "turn.ended" | "turn.cancelled" | "capture.started" | "capture.stopped" | "capture.cancelled" | "capture.once" | "input.audio.delta" | "input.audio.committed" | "transcript.delta" | "transcript.done" | "output.text.delta" | "output.text.done" | "output.audio.started" | "output.audio.delta" | "output.audio.done" | "tool.call" | "tool.progress" | "tool.result" | "tool.error" | "usage.metrics" | "latency.metrics" | "health.changed";
      id: string;
      mode: "realtime" | "stt-tts" | "transcription";
      payload: unknown;
      seq: number;
      sessionId: string;
      transport: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room";
      timestamp: string;
      brain: "none" | "agent-consult" | "direct-tools";
    }[];
  };
}>;
declare const validateTalkSessionAppendAudioParams: ProtocolValidator<{
  timestamp?: number | undefined;
  sessionId: string;
  audioBase64: string;
}>;
declare const validateTalkSessionTurnParams: ProtocolValidator<{
  turnId?: string | undefined;
  sessionId: string;
}>;
declare const validateTalkSessionCancelTurnParams: ProtocolValidator<{
  reason?: string | undefined;
  turnId?: string | undefined;
  sessionId: string;
}>;
declare const validateTalkSessionCancelOutputParams: ProtocolValidator<{
  reason?: string | undefined;
  turnId?: string | undefined;
  sessionId: string;
}>;
declare const validateTalkSessionTurnResult: ProtocolValidator<{
  events?: {
    provider?: string | undefined;
    turnId?: string | undefined;
    captureId?: string | undefined;
    final?: boolean | undefined;
    callId?: string | undefined;
    itemId?: string | undefined;
    parentId?: string | undefined;
    type: "session.started" | "session.ready" | "session.closed" | "session.error" | "session.replaced" | "turn.started" | "turn.ended" | "turn.cancelled" | "capture.started" | "capture.stopped" | "capture.cancelled" | "capture.once" | "input.audio.delta" | "input.audio.committed" | "transcript.delta" | "transcript.done" | "output.text.delta" | "output.text.done" | "output.audio.started" | "output.audio.delta" | "output.audio.done" | "tool.call" | "tool.progress" | "tool.result" | "tool.error" | "usage.metrics" | "latency.metrics" | "health.changed";
    id: string;
    mode: "realtime" | "stt-tts" | "transcription";
    payload: unknown;
    seq: number;
    sessionId: string;
    transport: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room";
    timestamp: string;
    brain: "none" | "agent-consult" | "direct-tools";
  }[] | undefined;
  turnId?: string | undefined;
  ok: boolean;
}>;
declare const validateTalkSessionSteerParams: ProtocolValidator<{
  mode?: "status" | "steer" | "cancel" | "followup" | undefined;
  sessionKey?: string | undefined;
  text: string;
  sessionId: string;
}>;
declare const validateTalkSessionSubmitToolResultParams: ProtocolValidator<{
  options?: {
    suppressResponse?: boolean | undefined;
    willContinue?: boolean | undefined;
  } | undefined;
  sessionId: string;
  result: unknown;
  callId: string;
}>;
declare const validateTalkSessionCloseParams: ProtocolValidator<{
  sessionId: string;
}>;
declare const validateTalkSessionOkResult: ProtocolValidator<{
  ok: boolean;
}>;
declare const validateTalkSpeakParams: ProtocolValidator<{
  normalize?: string | undefined;
  voiceId?: string | undefined;
  modelId?: string | undefined;
  outputFormat?: string | undefined;
  speed?: number | undefined;
  rateWpm?: number | undefined;
  stability?: number | undefined;
  similarity?: number | undefined;
  style?: number | undefined;
  speakerBoost?: boolean | undefined;
  seed?: number | undefined;
  language?: string | undefined;
  latencyTier?: number | undefined;
  text: string;
}>;
declare const validateTalkSpeakResult: ProtocolValidator<{
  mimeType?: string | undefined;
  outputFormat?: string | undefined;
  voiceCompatible?: boolean | undefined;
  fileExtension?: string | undefined;
  provider: string;
  audioBase64: string;
}>;
declare const validateChannelsStatusParams: ProtocolValidator<{
  probe?: boolean | undefined;
  channel?: string | undefined;
  timeoutMs?: number | undefined;
}>;
declare const validateChannelsStartParams: ProtocolValidator<{
  accountId?: string | undefined;
  channel: string;
}>;
declare const validateChannelsStopParams: ProtocolValidator<{
  accountId?: string | undefined;
  channel: string;
}>;
declare const validateChannelsLogoutParams: ProtocolValidator<{
  accountId?: string | undefined;
  channel: string;
}>;
declare const validateModelsListParams: ProtocolValidator<{
  view?: "default" | "all" | "configured" | undefined;
}>;
declare const validateSkillsStatusParams: ProtocolValidator<{
  agentId?: string | undefined;
}>;
declare const validateToolsCatalogParams: ProtocolValidator<{
  agentId?: string | undefined;
  includePlugins?: boolean | undefined;
}>;
declare const validateToolsEffectiveParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey: string;
}>;
declare const validateToolsInvokeParams: ProtocolValidator<{
  sessionKey?: string | undefined;
  agentId?: string | undefined;
  idempotencyKey?: string | undefined;
  confirm?: boolean | undefined;
  args?: Record<string, unknown> | undefined;
  name: string;
}>;
declare const validateSkillsBinsParams: ProtocolValidator<object>;
declare const validateSkillsInstallParams: ProtocolValidator<{
  agentId?: string | undefined;
  timeoutMs?: number | undefined;
  dangerouslyForceUnsafeInstall?: boolean | undefined;
  name: string;
  installId: string;
} | {
  version?: string | undefined;
  agentId?: string | undefined;
  timeoutMs?: number | undefined;
  force?: boolean | undefined;
  source: "clawhub";
  slug: string;
} | {
  agentId?: string | undefined;
  timeoutMs?: number | undefined;
  force?: boolean | undefined;
  sha256?: string | undefined;
  source: "upload";
  slug: string;
  uploadId: string;
}>;
declare const validateSkillsUploadBeginParams: ProtocolValidator<{
  idempotencyKey?: string | undefined;
  force?: boolean | undefined;
  sha256?: string | undefined;
  kind: "skill-archive";
  sizeBytes: number;
  slug: string;
}>;
declare const validateSkillsUploadChunkParams: ProtocolValidator<{
  offset: number;
  uploadId: string;
  dataBase64: string;
}>;
declare const validateSkillsUploadCommitParams: ProtocolValidator<{
  sha256?: string | undefined;
  uploadId: string;
}>;
declare const validateSkillsUpdateParams: ProtocolValidator<{
  enabled?: boolean | undefined;
  env?: Record<string, string> | undefined;
  apiKey?: string | undefined;
  skillKey: string;
} | {
  agentId?: string | undefined;
  all?: boolean | undefined;
  slug?: string | undefined;
  source: "clawhub";
}>;
declare const validateSkillsSearchParams: ProtocolValidator<{
  limit?: number | undefined;
  query?: string | undefined;
}>;
declare const validateSkillsDetailParams: ProtocolValidator<{
  slug: string;
}>;
declare const validateSkillsProposalsListParams: ProtocolValidator<{
  agentId?: string | undefined;
}>;
declare const validateSkillsProposalInspectParams: ProtocolValidator<{
  agentId?: string | undefined;
  proposalId: string;
}>;
declare const validateSkillsProposalCreateParams: ProtocolValidator<{
  agentId?: string | undefined;
  supportFiles?: {
    path: string;
    content: string;
  }[] | undefined;
  evidence?: string | undefined;
  goal?: string | undefined;
  description: string;
  name: string;
  content: string;
}>;
declare const validateSkillsProposalUpdateParams: ProtocolValidator<{
  description?: string | undefined;
  agentId?: string | undefined;
  supportFiles?: {
    path: string;
    content: string;
  }[] | undefined;
  evidence?: string | undefined;
  goal?: string | undefined;
  content: string;
  skillName: string;
}>;
declare const validateSkillsProposalReviseParams: ProtocolValidator<{
  description?: string | undefined;
  agentId?: string | undefined;
  supportFiles?: {
    path: string;
    content: string;
  }[] | undefined;
  evidence?: string | undefined;
  goal?: string | undefined;
  content: string;
  proposalId: string;
}>;
declare const validateSkillsProposalRequestRevisionParams: ProtocolValidator<{
  sessionId?: string | undefined;
  agentId?: string | undefined;
  targetAgentId?: string | undefined;
  sessionKey: string;
  idempotencyKey: string;
  instructions: string;
  proposalId: string;
}>;
declare const validateSkillsProposalActionParams: ProtocolValidator<{
  reason?: string | undefined;
  agentId?: string | undefined;
  proposalId: string;
}>;
declare const validateSkillsSecurityVerdictsParams: ProtocolValidator<{
  agentId?: string | undefined;
}>;
declare const validateSkillsSkillCardParams: ProtocolValidator<{
  agentId?: string | undefined;
  skillKey: string;
}>;
declare const validateCronListParams: ProtocolValidator<{
  enabled?: "enabled" | "all" | "disabled" | undefined;
  agentId?: string | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  compact?: boolean | undefined;
  query?: string | undefined;
  lastRunStatus?: "error" | "unknown" | "ok" | "all" | "skipped" | undefined;
  includeDisabled?: boolean | undefined;
  scheduleKind?: "every" | "at" | "all" | "cron" | undefined;
  sortBy?: "name" | "updatedAtMs" | "nextRunAtMs" | undefined;
  sortDir?: "asc" | "desc" | undefined;
}>;
declare const validateCronStatusParams: ProtocolValidator<object>;
declare const validateCronGetParams: ProtocolValidator<{
  id: string;
} | {
  jobId: string;
}>;
declare const validateCronAddParams: ProtocolValidator<{
  enabled?: boolean | undefined;
  description?: string | undefined;
  sessionKey?: string | null | undefined;
  agentId?: string | null | undefined;
  deleteAfterRun?: boolean | undefined;
  delivery?: {
    channel?: string | undefined;
    accountId?: string | undefined;
    to?: string | undefined;
    threadId?: string | number | undefined;
    bestEffort?: boolean | undefined;
    failureDestination?: {
      mode?: "announce" | "webhook" | undefined;
      channel?: string | undefined;
      accountId?: string | undefined;
      to?: string | undefined;
    } | undefined;
    mode: "none";
  } | {
    channel?: string | undefined;
    accountId?: string | undefined;
    to?: string | undefined;
    threadId?: string | number | undefined;
    bestEffort?: boolean | undefined;
    failureDestination?: {
      mode?: "announce" | "webhook" | undefined;
      channel?: string | undefined;
      accountId?: string | undefined;
      to?: string | undefined;
    } | undefined;
    completionDestination?: {
      mode: "webhook";
      to: string;
    } | undefined;
    mode: "announce";
  } | {
    channel?: string | undefined;
    accountId?: string | undefined;
    threadId?: string | number | undefined;
    bestEffort?: boolean | undefined;
    failureDestination?: {
      mode?: "announce" | "webhook" | undefined;
      channel?: string | undefined;
      accountId?: string | undefined;
      to?: string | undefined;
    } | undefined;
    mode: "webhook";
    to: string;
  } | undefined;
  failureAlert?: false | {
    mode?: "announce" | "webhook" | undefined;
    channel?: string | undefined;
    accountId?: string | undefined;
    to?: string | undefined;
    after?: number | undefined;
    cooldownMs?: number | undefined;
    includeSkipped?: boolean | undefined;
  } | undefined;
  payload: {
    text: string;
    kind: "systemEvent";
  } | {
    model?: unknown;
    thinking?: string | undefined;
    fallbacks?: unknown;
    timeoutSeconds?: number | undefined;
    allowUnsafeExternalContent?: boolean | undefined;
    lightContext?: boolean | undefined;
    toolsAllow?: unknown;
    message: unknown;
    kind: "agentTurn";
  } | {
    input?: string | undefined;
    env?: Record<string, string> | undefined;
    timeoutSeconds?: number | undefined;
    cwd?: string | undefined;
    noOutputTimeoutSeconds?: number | undefined;
    outputMaxBytes?: number | undefined;
    kind: "command";
    argv: unknown;
  };
  name: string;
  schedule: {
    at: string;
    kind: "at";
  } | {
    anchorMs?: number | undefined;
    kind: "every";
    everyMs: number;
  } | {
    tz?: string | undefined;
    staggerMs?: number | undefined;
    kind: "cron";
    expr: string;
  };
  sessionTarget: string;
  wakeMode: "now" | "next-heartbeat";
}>;
declare const validateCronUpdateParams: ProtocolValidator<{
  id: string;
} | {
  jobId: string;
}>;
declare const validateCronRemoveParams: ProtocolValidator<{
  id: string;
} | {
  jobId: string;
}>;
declare const validateCronRunParams: ProtocolValidator<{
  id: string;
} | {
  jobId: string;
}>;
declare const validateCronRunsParams: ProtocolValidator<{
  id?: string | undefined;
  scope?: "all" | "job" | undefined;
  status?: "error" | "ok" | "all" | "skipped" | undefined;
  runId?: string | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  query?: string | undefined;
  sortDir?: "asc" | "desc" | undefined;
  jobId?: string | undefined;
  statuses?: ("error" | "ok" | "skipped")[] | undefined;
  deliveryStatuses?: ("unknown" | "delivered" | "not-delivered" | "not-requested")[] | undefined;
  deliveryStatus?: "unknown" | "delivered" | "not-delivered" | "not-requested" | undefined;
}>;
declare const validateDevicePairListParams: ProtocolValidator<object>;
declare const validateDevicePairApproveParams: ProtocolValidator<{
  requestId: string;
}>;
declare const validateDevicePairRejectParams: ProtocolValidator<{
  requestId: string;
}>;
declare const validateDevicePairRemoveParams: ProtocolValidator<{
  deviceId: string;
}>;
declare const validateDeviceTokenRotateParams: ProtocolValidator<{
  scopes?: string[] | undefined;
  role: string;
  deviceId: string;
}>;
declare const validateDeviceTokenRevokeParams: ProtocolValidator<{
  role: string;
  deviceId: string;
}>;
declare const validateExecApprovalsGetParams: ProtocolValidator<object>;
declare const validateExecApprovalsSetParams: ProtocolValidator<{
  baseHash?: string | undefined;
  file: {
    defaults?: {
      security?: string | undefined;
      ask?: string | undefined;
      askFallback?: string | undefined;
      autoAllowSkills?: boolean | undefined;
    } | undefined;
    agents?: Record<string, {
      security?: string | undefined;
      ask?: string | undefined;
      askFallback?: string | undefined;
      autoAllowSkills?: boolean | undefined;
      allowlist?: {
        id?: string | undefined;
        source?: "allow-always" | undefined;
        commandText?: string | undefined;
        argPattern?: string | undefined;
        lastUsedAt?: number | undefined;
        lastUsedCommand?: string | undefined;
        lastResolvedPath?: string | undefined;
        pattern: string;
      }[] | undefined;
    }> | undefined;
    socket?: {
      path?: string | undefined;
      token?: string | undefined;
    } | undefined;
    version: 1;
  };
}>;
declare const validateExecApprovalGetParams: ProtocolValidator<{
  id: string;
}>;
declare const validateExecApprovalRequestParams: ProtocolValidator<{
  id?: string | undefined;
  env?: Record<string, string> | undefined;
  host?: string | null | undefined;
  sessionKey?: string | null | undefined;
  agentId?: string | null | undefined;
  timeoutMs?: number | undefined;
  nodeId?: string | null | undefined;
  command?: string | undefined;
  cwd?: string | null | undefined;
  security?: string | null | undefined;
  ask?: string | null | undefined;
  commandArgv?: string[] | undefined;
  systemRunPlan?: {
    commandPreview?: string | null | undefined;
    mutableFileOperand?: {
      path: string;
      sha256: string;
      argvIndex: number;
    } | null | undefined;
    sessionKey: string | null;
    agentId: string | null;
    argv: string[];
    cwd: string | null;
    commandText: string;
  } | undefined;
  warningText?: string | null | undefined;
  unavailableDecisions?: string[] | undefined;
  commandSpans?: {
    startIndex: number;
    endIndex: number;
  }[] | undefined;
  resolvedPath?: string | null | undefined;
  turnSourceChannel?: string | null | undefined;
  turnSourceTo?: string | null | undefined;
  turnSourceAccountId?: string | null | undefined;
  turnSourceThreadId?: string | number | null | undefined;
  approvalReviewerDeviceIds?: string[] | undefined;
  requireDeliveryRoute?: boolean | undefined;
  suppressDelivery?: boolean | undefined;
  twoPhase?: boolean | undefined;
}>;
declare const validateExecApprovalResolveParams: ProtocolValidator<{
  id: string;
  decision: string;
}>;
declare const validatePluginApprovalRequestParams: ProtocolValidator<{
  sessionKey?: string | undefined;
  agentId?: string | undefined;
  timeoutMs?: number | undefined;
  pluginId?: string | undefined;
  severity?: string | undefined;
  toolName?: string | undefined;
  turnSourceChannel?: string | undefined;
  turnSourceTo?: string | undefined;
  turnSourceAccountId?: string | undefined;
  turnSourceThreadId?: string | number | undefined;
  twoPhase?: boolean | undefined;
  toolCallId?: string | undefined;
  allowedDecisions?: string[] | undefined;
  title: string;
  description: string;
}>;
declare const validatePluginApprovalResolveParams: ProtocolValidator<{
  id: string;
  decision: string;
}>;
declare const validatePluginsUiDescriptorsParams: ProtocolValidator<object>;
declare const validatePluginsUiDescriptorsResult: ProtocolValidator<{
  ok: true;
  descriptors: {
    description?: string | undefined;
    schema?: unknown;
    pluginName?: string | undefined;
    placement?: string | undefined;
    requiredScopes?: string[] | undefined;
    id: string;
    label: string;
    pluginId: string;
    surface: "session" | "tool" | "run" | "settings";
  }[];
}>;
declare const validatePluginsSessionActionParams: ProtocolValidator<{
  payload?: unknown;
  sessionKey?: string | undefined;
  pluginId: string;
  actionId: string;
}>;
declare const validatePluginsSessionActionResult: ProtocolValidator<{
  result?: unknown;
  continueAgent?: boolean | undefined;
  reply?: unknown;
  ok: true;
} | {
  code?: string | undefined;
  details?: unknown;
  error: string;
  ok: false;
}>;
declare const validateExecApprovalsNodeGetParams: ProtocolValidator<{
  nodeId: string;
}>;
declare const validateExecApprovalsNodeSetParams: ProtocolValidator<{
  baseHash?: string | undefined;
  file: {
    defaults?: {
      security?: string | undefined;
      ask?: string | undefined;
      askFallback?: string | undefined;
      autoAllowSkills?: boolean | undefined;
    } | undefined;
    agents?: Record<string, {
      security?: string | undefined;
      ask?: string | undefined;
      askFallback?: string | undefined;
      autoAllowSkills?: boolean | undefined;
      allowlist?: {
        id?: string | undefined;
        source?: "allow-always" | undefined;
        commandText?: string | undefined;
        argPattern?: string | undefined;
        lastUsedAt?: number | undefined;
        lastUsedCommand?: string | undefined;
        lastResolvedPath?: string | undefined;
        pattern: string;
      }[] | undefined;
    }> | undefined;
    socket?: {
      path?: string | undefined;
      token?: string | undefined;
    } | undefined;
    version: 1;
  };
  nodeId: string;
}>;
declare const validateLogsTailParams: ProtocolValidator<{
  limit?: number | undefined;
  cursor?: number | undefined;
  maxBytes?: number | undefined;
}>;
declare const validateChatHistoryParams: ProtocolValidator<unknown>;
declare const validateChatMetadataParams: ProtocolValidator<{
  agentId?: string | undefined;
}>;
declare const validateChatMessageGetParams: ProtocolValidator<unknown>;
declare const validateChatSendParams: ProtocolValidator<unknown>;
declare const validateChatAbortParams: ProtocolValidator<{
  runId?: string | undefined;
  agentId?: string | undefined;
  sessionKey: string;
}>;
declare const validateChatInjectParams: ProtocolValidator<{
  label?: string | undefined;
  agentId?: string | undefined;
  message: string;
  sessionKey: string;
}>;
declare const validateChatEvent: ProtocolValidator<unknown>;
declare const validateChatMessageGetResult: ProtocolValidator<unknown>;
declare const validateUpdateStatusParams: ProtocolValidator<object>;
declare const validateUpdateRunParams: ProtocolValidator<{
  sessionKey?: string | undefined;
  timeoutMs?: number | undefined;
  deliveryContext?: {
    channel?: string | undefined;
    accountId?: string | undefined;
    to?: string | undefined;
    threadId?: string | number | undefined;
  } | undefined;
  note?: string | undefined;
  restartDelayMs?: number | undefined;
  continuationMessage?: string | undefined;
}>;
declare const validateWebLoginStartParams: ProtocolValidator<{
  accountId?: string | undefined;
  timeoutMs?: number | undefined;
  force?: boolean | undefined;
  verbose?: boolean | undefined;
}>;
declare const validateWebLoginWaitParams: ProtocolValidator<{
  accountId?: string | undefined;
  timeoutMs?: number | undefined;
  currentQrDataUrl?: string | undefined;
}>;
/** Convert validator errors into compact operator-facing failure text. */
declare function formatValidationErrors(errors: ValidationError[] | null | undefined): string;
type SessionsPatchResult = {
  ok: true;
  path: string;
  key: string;
  entry: Record<string, unknown>;
  resolved?: {
    modelProvider?: string;
    model?: string;
    agentRuntime?: GatewayAgentRuntime;
  };
};
type GatewayAgentRuntime = {
  id: string;
  fallback?: "openclaw" | "none";
  source: "env" | "agent" | "defaults" | "model" | "provider" | "implicit" | "session-key";
};
//#endregion
export { validateEnvironmentsListParams as $, validateTalkSpeakParams as $n, validateSessionsFilesListParams as $t, validateCommandsListParams as A, validateTalkCatalogResult as An, validatePluginApprovalResolveParams as At, validateCronGetParams as B, validateTalkSessionAppendAudioParams as Bn, validateSecretsResolveResult as Bt, validateChatEvent as C, validateSkillsStatusParams as Cn, validateNodePairVerifyParams as Ct, validateChatMessageGetResult as D, validateSkillsUploadCommitParams as Dn, validateNodePresenceAlivePayload as Dt, validateChatMessageGetParams as E, validateSkillsUploadChunkParams as En, validateNodePendingEnqueueParams as Et, validateConfigSchemaLookupResult as F, validateTalkClientToolCallResult as Fn, validatePollParams as Ft, validateCronStatusParams as G, validateTalkSessionCreateResult as Gn, validateSessionsCompactionBranchParams as Gt, validateCronRemoveParams as H, validateTalkSessionCancelTurnParams as Hn, validateSessionsAbortParams as Ht, validateConfigSchemaParams as I, validateTalkConfigParams as In, validatePushTestParams as It, validateDevicePairListParams as J, validateTalkSessionOkResult as Jn, validateSessionsCompactionRestoreParams as Jt, validateCronUpdateParams as K, validateTalkSessionJoinParams as Kn, validateSessionsCompactionGetParams as Kt, validateConfigSetParams as L, validateTalkConfigResult as Ln, validateRequestFrame as Lt, validateConfigGetParams as M, validateTalkClientCreateResult as Mn, validatePluginsSessionActionResult as Mt, validateConfigPatchParams as N, validateTalkClientSteerParams as Nn, validatePluginsUiDescriptorsParams as Nt, validateChatMetadataParams as O, validateTalkAgentControlResult as On, validateNodeRenameParams as Ot, validateConfigSchemaLookupParams as P, validateTalkClientToolCallParams as Pn, validatePluginsUiDescriptorsResult as Pt, validateDeviceTokenRotateParams as Q, validateTalkSessionTurnResult as Qn, validateSessionsFilesGetParams as Qt, validateConnectParams as R, validateTalkEvent as Rn, validateResponseFrame as Rt, validateChatAbortParams as S, validateSkillsSkillCardParams as Sn, validateNodePairRequestParams as St, validateChatInjectParams as T, validateSkillsUploadBeginParams as Tn, validateNodePendingDrainParams as Tt, validateCronRunParams as U, validateTalkSessionCloseParams as Un, validateSessionsCleanupParams as Ut, validateCronListParams as V, validateTalkSessionCancelOutputParams as Vn, validateSendParams as Vt, validateCronRunsParams as W, validateTalkSessionCreateParams as Wn, validateSessionsCompactParams as Wt, validateDevicePairRemoveParams as X, validateTalkSessionSubmitToolResultParams as Xn, validateSessionsDeleteParams as Xt, validateDevicePairRejectParams as Y, validateTalkSessionSteerParams as Yn, validateSessionsCreateParams as Yt, validateDeviceTokenRevokeParams as Z, validateTalkSessionTurnParams as Zn, validateSessionsDescribeParams as Zt, validateArtifactsListParams as _, validateSkillsProposalReviseParams as _n, validateWizardNextParams as _r, validateNodeListParams as _t, validateAgentIdentityParams as a, validateSessionsPreviewParams as an, validateToolsEffectiveParams as ar, validateExecApprovalsGetParams as at, validateChannelsStatusParams as b, validateSkillsSearchParams as bn, validateNodePairRejectParams as bt, validateAgentsCreateParams as c, validateSessionsSendParams as cn, validateUpdateStatusParams as cr, validateExecApprovalsSetParams as ct, validateAgentsFilesListParams as d, validateSkillsDetailParams as dn, validateWebLoginWaitParams as dr, validateModelsListParams as dt, validateSessionsListParams as en, validateTalkSpeakResult as er, validateEnvironmentsStatusParams as et, validateAgentsFilesSetParams as f, validateSkillsInstallParams as fn, validateWebPushSubscribeParams as fr, validateNodeDescribeParams as ft, validateArtifactsGetParams as g, validateSkillsProposalRequestRevisionParams as gn, validateWizardCancelParams as gr, validateNodeInvokeResultParams as gt, validateArtifactsDownloadParams as h, validateSkillsProposalInspectParams as hn, validateWebPushVapidPublicKeyParams as hr, validateNodeInvokeParams as ht, formatValidationErrors as i, validateSessionsPluginPatchParams as in, validateToolsCatalogParams as ir, validateExecApprovalResolveParams as it, validateConfigApplyParams as j, validateTalkClientCreateParams as jn, validatePluginsSessionActionParams as jt, validateChatSendParams as k, validateTalkCatalogParams as kn, validatePluginApprovalRequestParams as kt, validateAgentsDeleteParams as l, validateSessionsUsageParams as ln, validateWakeParams as lr, validateLogsTailParams as lt, validateAgentsUpdateParams as m, validateSkillsProposalCreateParams as mn, validateWebPushUnsubscribeParams as mr, validateNodeEventResult as mt, SessionsPatchResult as n, validateSessionsMessagesUnsubscribeParams as nn, validateTasksGetParams as nr, validateExecApprovalGetParams as nt, validateAgentParams as o, validateSessionsResetParams as on, validateToolsInvokeParams as or, validateExecApprovalsNodeGetParams as ot, validateAgentsListParams as p, validateSkillsProposalActionParams as pn, validateWebPushTestParams as pr, validateNodeEventParams as pt, validateDevicePairApproveParams as q, validateTalkSessionJoinResult as qn, validateSessionsCompactionListParams as qt, ValidationError as r, validateSessionsPatchParams as rn, validateTasksListParams as rr, validateExecApprovalRequestParams as rt, validateAgentWaitParams as s, validateSessionsResolveParams as sn, validateUpdateRunParams as sr, validateExecApprovalsNodeSetParams as st, ProtocolValidator as t, validateSessionsMessagesSubscribeParams as tn, validateTasksCancelParams as tr, validateEventFrame as tt, validateAgentsFilesGetParams as u, validateSkillsBinsParams as un, validateWebLoginStartParams as ur, validateMessageActionParams as ut, validateChannelsLogoutParams as v, validateSkillsProposalUpdateParams as vn, validateWizardStartParams as vr, validateNodePairApproveParams as vt, validateChatHistoryParams as w, validateSkillsUpdateParams as wn, validateNodePendingAckParams as wt, validateChannelsStopParams as x, validateSkillsSecurityVerdictsParams as xn, validateNodePairRemoveParams as xt, validateChannelsStartParams as y, validateSkillsProposalsListParams as yn, validateWizardStatusParams as yr, validateNodePairListParams as yt, validateCronAddParams as z, validateTalkModeParams as zn, validateSecretsResolveParams as zt };