import { D as ChannelOutboundTargetMode } from "./types.core-BBGk7pBn.js";
import { a as SourceReplyDeliveryMode, c as InputProvenance, s as PromptImageOrderEntry } from "./types-DNy-f8Hr.js";
import { m as PluginHookChannelContext } from "./templating-KsALmYhy.js";
import { i as OpenClawConfig, tn as AgentDefaultsConfig } from "./types.openclaw-R57aE8ho.js";
import { t as FastMode } from "./string-coerce-DJnd-JG-.js";
import { a as AuthProfileFailureReason, c as OAuthCredential, d as TokenCredential, i as AuthProfileCredential, n as AuthProfileBlockedReason, o as AuthProfileIdRepairResult, r as AuthProfileBlockedSource, s as AuthProfileStore, t as ApiKeyCredential, u as ProfileUsageStats } from "./types-nLOnyeRM.js";
import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";
import { t as PluginManifestRecord } from "./manifest-registry-B03IrHXx.js";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-DJKUP8I2.js";
import { o as resolveAgentIdFromSessionKey } from "./session-key-fJM_U9Lv.js";
import { a as SessionEntry } from "./types-CmP2mjUp.js";
import { f as ThinkLevel$1, m as VerboseLevel } from "./commands-registry.types-PmUlyXxc.js";
import { $u as resolveProfilesUnavailableReason, Ad as AuthProfileEligibilityReasonCode, Au as hasUsableCustomProviderApiKey, Bs as appendCronStyleCurrentTimeLine, Bu as formatMissingAuthError, Cd as dedupeProfileIds, Cu as canUseProfileAsProviderEntryApiKey, Dd as ExternalCliAuthDiscovery, Du as hasAvailableAuthForProvider, Ed as resolveApiKeyForProfile, Eu as getCustomProviderApiKey, Fd as resolveProviderAuthAliasMap, Fu as resolveUsableCustomProviderApiKey, Gu as EnvApiKeyResult, Hd as CODEX_CLI_PROFILE_ID, Hu as isProviderAuthError, Id as resolveProviderIdForAuth, Iu as shouldPreferExplicitConfigApiKeyAuth, Jl as AgentInternalEvent, Ju as clearAuthProfileCooldown, Ku as resolveEnvApiKey, Ld as AuthCredentialReasonCode, Lu as MissingProviderAuthError, Md as resolveAuthProfileOrder, Mu as resolveModelAuthMode, Nd as ProviderAuthAliasLookupParams, Nu as resolveProviderEntryApiKeyBinding, Od as formatAuthDoctorHint, Ou as hasRuntimeAvailableProviderAuth, Pd as resetProviderAuthAliasMapCacheForTest, Pu as resolveProviderEntryApiKeyProfileReference, Qu as resolveProfileUnusableUntilForDisplay, Ru as ProviderAuthError, Sd as upsertAuthProfileWithLock, Su as applyLocalNoAuthHeaderOverride, Td as refreshOAuthCredentialForRuntime, Tu as getApiKeyForModel, Uu as requireApiKey, Vd as CLAUDE_CLI_PROFILE_ID, Vs as resolveCronStyleNow, Vu as isMissingProviderAuthError, Wu as resolveAwsSdkEnvVarName, Xu as markAuthProfileCooldown, Yu as markAuthProfileBlockedUntil, Zu as markAuthProfileFailure, _d as suggestOAuthProfileIdForLegacyDefault, _u as ModelAuthMode, au as AgentStreamParams, bd as setAuthProfileOrder, bu as RuntimeProviderAuthLookup, cd as loadAuthProfileStore, dd as loadAuthProfileStoreWithoutExternalProfiles, du as PreparedSimpleCompletionModelForAgent, ed as clearExpiredCooldowns, fd as replaceRuntimeAuthProfileStoreSnapshots, fu as SimpleCompletionModelOptions, gd as repairOAuthProfileIdMismatch, gu as resolveSimpleCompletionSelectionForAgent, hu as prepareSimpleCompletionModelForAgent, id as ensureAuthProfileStore, if as MessagingToolSend, iu as EmbeddedBlockChunker, jd as resolveAuthProfileEligibility, ju as resolveApiKeyForProvider, kd as resolveAuthProfileDisplayLabel, ku as hasSyntheticLocalProviderAuthConfig, ld as loadAuthProfileStoreForRuntime, lu as AgentSimpleCompletionSelection, md as saveAuthProfileStore, mu as prepareSimpleCompletionModel, nd as isProfileInCooldown, od as ensureAuthProfileStoreWithoutExternalProfiles, ou as ClientToolDefinition, pd as resolvePersistedAuthProfileOwnerAgentDir, pu as completeWithPreparedSimpleCompletionModel, ql as PromptMode, qu as calculateAuthProfileCooldownMs, rd as clearRuntimeAuthProfileStoreSnapshots, rf as EmbeddedAgentRunMeta, ru as BlockReplyChunking, sd as findPersistedAuthProfileCredential, su as ExecElevatedDefaults, td as getSoonestCooldownExpiry, ud as loadAuthProfileStoreForSecretsRuntime, uu as PreparedSimpleCompletionModel, vd as markAuthProfileSuccess, vu as ProviderCredentialPrecedence, wd as listProfilesForProvider, wu as createRuntimeProviderAuthLookup, xd as upsertAuthProfile, xu as applyAuthHeaderOverride, yu as ProviderEntryApiKeyBindingResolution, zd as TokenExpiryState, zs as CronStyleNow, zu as ResolvedProviderAuth } from "./types-CXLy55Xw.js";
import { A as textResult, C as readPositiveIntegerParam, D as readStringParam, E as readStringOrNumberParam, O as scheduleToolProgress, S as readNumberParam, T as readStringArrayParam, _ as normalizeToolModelOverride, a as PublicToolProgress, b as readFiniteNumberParam, c as ToolAuthorizationError, d as createActionGate, f as emitToolProgress, g as jsonResult, h as imageResultFromFile, i as AvailableTag, j as toolProgressResult, k as stringifyToolPayload, l as ToolInputError, m as imageResult, n as AgentToolWithMeta, o as ReactionParams, p as failedTextResult, r as AnyAgentTool, s as StringParamOptions, t as ActionGate, u as asToolParamsRecord, v as parseAvailableTags, w as readReactionParams, x as readNonNegativeIntegerParam, y as payloadTextResult } from "./common-DDc8qh0a.js";
import { n as ModelInputType, t as ModelCatalogEntry } from "./model-catalog.types-ZNtJaKv-.js";
import { Ai as AuthStorage, Ci as ModelRegistry, Ii as PluginModelCatalogMetadataSnapshot } from "./index-DuSCzBZB.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER, t as DEFAULT_CONTEXT_TOKENS } from "./defaults-6FEupg54.js";
import { A as listAgentIds, C as resolveSessionAgentIds, D as setAgentEffectiveModelPrimary, E as resolveSubagentModelFallbacksOverride, F as resolveDefaultAgentDir, I as resolveDefaultAgentId, L as hasSessionAutoModelFallbackProvenance, M as resolveAgentContextLimits, N as resolveAgentDir, O as ResolvedAgentConfig, P as resolveAgentWorkspaceDir, S as resolveSessionAgentId, T as resolveSubagentModelConfigSelectionResult, _ as resolveAgentSkillsFilter, a as clearAutoFallbackPrimaryProbeSelection, b as resolveFallbackAgentId, c as hasLegacyAutoFallbackWithoutOrigin, d as resolveAgentExecutionContract, f as resolveAgentExplicitModelPrimary, g as resolveAgentModelPrimary, h as resolveAgentModelFallbacksOverride, i as SubagentModelConfigSelectionSource, j as resolveAgentConfig, k as listAgentEntries, l as markAutoFallbackPrimaryProbe, m as resolveAgentIdsByWorkspacePath, n as AutoFallbackPrimaryProbe, o as entryMatchesAutoFallbackPrimaryProbe, p as resolveAgentIdByWorkspacePath, r as SubagentModelConfigSelectionResult, s as hasConfiguredModelFallbacks, t as AgentModelPrimaryWriteTarget, u as resolveAgentEffectiveModelPrimary, v as resolveAutoFallbackPrimaryProbe, w as resolveSubagentModelConfigSelection, x as resolveRunModelFallbacksOverride, y as resolveEffectiveModelFallbacks } from "./agent-scope-BAv_on9b.js";
import { d as resolveAgentIdentity, f as resolveEffectiveMessagesConfig, g as resolveResponsePrefix, h as resolveMessagePrefix, m as resolveIdentityNamePrefix, p as resolveHumanDelayConfig, u as resolveAckReaction } from "./ack-reactions-B81WyFEh.js";
import { a as normalizeTimestamp, c as withNormalizedTimestamp, i as formatUserTime, n as TimeFormatPreference, o as resolveUserTimeFormat, r as formatDateStamp, s as resolveUserTimezone, t as ResolvedTimeFormat } from "./date-time-C_aF3jiN.js";
import { t as CliDeps } from "./deps.types-BdV6g6qp.js";
import { o as OutboundSessionContext } from "./delivery-queue-fUfq0LUt.js";
import { l as projectOutboundPayloadPlanForJson } from "./deliver-BvKw5JrY.js";
import { n as AcpSessionResolution, t as AcpSessionManager } from "./manager.core-BpSsS0Sk.js";
import { a as legacyModelKey, c as normalizeProviderId, i as findNormalizedProviderValue, l as normalizeProviderIdForAuth, n as ModelRef, o as modelKey, r as findNormalizedProviderKey, s as normalizeModelRef, t as ModelManifestNormalizationContext, u as parseModelRef } from "./model-selection-normalize-CFMbPrLu.js";
import { t as resolveOpenClawAgentDir } from "./agent-dir-compat-ochOeoeD.js";
import { a as JsonValue, c as ToolAvailabilityExpression, d as ToolExecutorRef, f as ToolOwnerRef, h as ToolUnavailableReason, i as JsonPrimitive, l as ToolAvailabilitySignal, m as ToolPlanEntry, n as HiddenToolPlanEntry, o as ToolAvailabilityContext, p as ToolPlan, r as JsonObject, s as ToolAvailabilityDiagnostic, t as BuildToolPlanOptions, u as ToolDescriptor } from "./types-vMGofiDd.js";
import { _ as resolveNonEnvSecretRefHeaderValueMarker, a as NON_ENV_SECRETREF_MARKER, c as SECRETREF_ENV_HEADER_MARKER_PREFIX, d as isNonSecretApiKeyMarker, f as isOAuthApiKeyMarker, g as resolveNonEnvSecretRefApiKeyMarker, h as resolveEnvSecretRefHeaderValueMarker, i as MINIMAX_OAUTH_MARKER, l as isAwsSdkAuthMarker, m as listKnownNonSecretApiKeyMarkers, n as CUSTOM_LOCAL_AUTH_MARKER, o as OAUTH_API_KEY_MARKER_PREFIX, p as isSecretRefHeaderValueMarker, r as GCP_VERTEX_CREDENTIALS_MARKER, s as OLLAMA_LOCAL_AUTH_MARKER, t as CODEX_APP_SERVER_AUTH_MARKER, u as isKnownEnvApiKeyMarker, v as resolveOAuthApiKeyMarker } from "./model-auth-markers-BhPapeFt.js";
import { A as resolveThinkingDefaultWithRuntimeCatalog, C as inferUniqueProviderFromConfiguredModels, D as resolveHooksGmailModel, E as resolveConfiguredModelRef, O as resolveModelRefFromString, S as inferUniqueProviderFromCatalog, T as resolveBareModelDefaultProvider, _ as ModelAliasIndex, a as normalizeStoredOverrideModel, b as buildConfiguredModelCatalog, c as resolveConfiguredSubagentSpawnModelSelection, d as resolvePersistedOverrideModelRef, f as resolvePersistedSelectedModelRef, g as isCliProvider, h as resolveSubagentSpawnModelSelection, i as getModelRefStatus, k as resolveThinkingDefault, l as resolveDefaultModelForAgent, m as resolveSubagentConfiguredModelSelection, n as buildAllowedModelSet, o as resolveAllowedModelRef, p as resolveReasoningDefault, r as canonicalizeCaseOnlyCatalogModelRef, s as resolveAllowlistModelKey, t as ThinkLevel, u as resolvePersistedModelRef, v as ModelRefStatus, w as normalizeModelSelection, x as buildModelAliasIndex, y as buildConfiguredAllowlistKeys } from "./model-selection-BLfHfjou.js";
import { l as stripMinimaxToolCallXml, s as stripDowngradedToolCallText } from "./assistant-visible-text-BkPy-bj_.js";
import { a as extractThinkingFromTaggedStream, c as inferToolMetaFromArgs, d as sanitizeAssistantVisibleStreamText, f as splitThinkingTaggedText, i as extractAssistantVisibleText, l as isAssistantMessage, m as stripModelSpecialTokens, n as extractAssistantText, o as extractThinkingFromTaggedText, p as stripThinkingTagsFromText, r as extractAssistantThinking, s as formatReasoningMessage, t as THINKING_TAG_SCAN_RE, u as promoteThinkingTagsToBlocks } from "./embedded-agent-utils-7715WwWM.js";
import { a as resolveSandboxPath, i as resolveSandboxInputPath, n as assertSandboxPath, o as resolveSandboxedMediaSource, r as resolveAllowedManagedMediaPath, t as assertMediaNotDataUrl } from "./sandbox-paths-DAVxv7sM.js";
import { a as optionalPositiveIntegerSchema, i as optionalNonNegativeIntegerSchema, n as channelTargetsSchema, o as optionalStringEnum, r as optionalFiniteNumberSchema, s as stringEnum, t as channelTargetSchema } from "./typebox-WKHUFEwH.js";
import { a as normalizeCacheKey, c as resolveCacheTtlMs, d as withTimeout, f as writeCache, g as withTrustedWebToolsEndpoint, h as withStrictWebToolsEndpoint, i as ReadResponseTextResult, l as resolvePositiveTimeoutSeconds, m as withSelfHostedWebToolsEndpoint, n as DEFAULT_CACHE_TTL_MINUTES, o as readCache, p as fetchWithWebToolsNetworkGuard, r as DEFAULT_TIMEOUT_SECONDS, s as readResponseText, t as CacheEntry, u as resolveTimeoutSeconds } from "./web-shared-BA33fpFU.js";
import { a as normalizeWhitespace, i as markdownToText, n as extractBasicHtmlContent, o as truncateText, r as htmlToMarkdown, t as ExtractMode } from "./web-fetch-utils-Cx-FHkJu.js";
import { A as setTtsProvider, B as TtsDirectiveParseResult, C as resolveTtsProviderOrder, D as setTtsEnabled, E as setTtsAutoMode, F as textToSpeechStream, I as textToSpeechTelephony, L as ResolvedTtsConfig, M as synthesizeSpeech, N as testApi, O as setTtsMaxLength, P as textToSpeech, R as ResolvedTtsModelOverrides, S as resolveTtsPrefsPath, T as setSummarizationEnabled, _ as listTtsPersonas, a as TtsSynthesisStreamResult, b as resolveTtsAutoMode, c as getLastTtsAttempt, d as getTtsPersona, f as getTtsProvider, g as listSpeechVoices, h as isTtsProviderConfigured, i as TtsSynthesisResult, j as streamSpeech, k as setTtsPersona, l as getResolvedSpeechProviderConfig, m as isTtsEnabled, n as TtsResult, o as TtsTelephonyResult, p as isSummarizationEnabled, r as TtsStreamResult, s as buildTtsSystemPromptHint, u as getTtsMaxLength, v as maybeApplyTtsToPayload, w as setLastTtsAttempt, x as resolveTtsConfig, y as resolveExplicitTtsOverrides, z as TtsDirectiveOverrides } from "./tts-runtime-DwcpSQY7.js";

//#region src/agents/auth-profiles/path-resolve.d.ts
/** Resolve the user-facing auth profile database path. */
declare function resolveAuthStorePathForDisplay(agentDir?: string): string;
//#endregion
//#region src/agents/identity-avatar.d.ts
type AgentAvatarResolution = {
  kind: "none";
  reason: string;
  source?: string;
} | {
  kind: "local";
  filePath: string;
  source: string;
} | {
  kind: "remote";
  url: string;
  source: string;
} | {
  kind: "data";
  url: string;
  source: string;
};
type AgentAvatarPublicSourceInput = {
  kind: AgentAvatarResolution["kind"];
  source?: string | null;
};
/** Return a safe public description of the configured avatar source. */
declare function resolvePublicAgentAvatarSource(resolved: AgentAvatarPublicSourceInput): string | undefined;
/** Resolve the effective avatar for an agent, including config and IDENTITY.md. */
declare function resolveAgentAvatar(cfg: OpenClawConfig, agentId: string, opts?: {
  includeUiOverride?: boolean;
}): AgentAvatarResolution;
//#endregion
//#region src/agents/agent-auth-credentials.d.ts
type AgentApiKeyCredential = {
  type: "api_key";
  key: string;
};
type AgentOAuthCredential = {
  type: "oauth";
  access: string;
  refresh: string;
  expires: number;
};
/** Credential value shape consumed by agent runtimes after auth-profile normalization. */
type AgentCredential = AgentApiKeyCredential | AgentOAuthCredential;
type AgentCredentialMap = Record<string, AgentCredential>;
//#endregion
//#region src/agents/agent-auth-discovery-core.d.ts
/** Options for discovering env-backed credentials during agent auth discovery. */
type AgentDiscoveryAuthLookupOptions = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
};
/** Adds provider credentials resolvable from env/config without mutating existing credentials. */
declare function addEnvBackedAgentCredentials(credentials: AgentCredentialMap, options?: AgentDiscoveryAuthLookupOptions): AgentCredentialMap;
//#endregion
//#region src/agents/agent-auth-discovery.d.ts
/** Options for discovering credentials without prompting for secret material. */
type DiscoverAuthStorageOptions = {
  externalCli?: ExternalCliAuthDiscovery;
  readOnly?: boolean;
  skipExternalAuthProfiles?: boolean;
  skipCredentials?: boolean;
  syntheticAuthProviderRefs?: Iterable<string>;
} & AgentDiscoveryAuthLookupOptions;
/** Resolves agent credentials from auth profiles, env, and synthetic auth hooks. */
declare function resolveAgentCredentialsForDiscovery(agentDir: string, options?: DiscoverAuthStorageOptions): AgentCredentialMap;
declare namespace agent_model_discovery_d_exports {
  export { DiscoverAuthStorageOptions, addEnvBackedAgentCredentials, discoverAuthStorage, discoverModels, normalizeDiscoveredAgentModel, resolveAgentCredentialsForDiscovery };
}
type DiscoverModelsOptions = {
  config?: OpenClawConfig;
  providerFilter?: string;
  pluginMetadataSnapshot?: PluginModelCatalogMetadataSnapshot;
  workspaceDir?: string;
  normalizeModels?: boolean;
};
/** Applies plugin model normalization and transport hooks to discovered agent models. */
declare function normalizeDiscoveredAgentModel<T>(value: T, agentDir: string): T;
/** Creates auth storage for model discovery from stored and env-backed credentials. */
/** Builds auth storage for model discovery without prompting for secrets. */
declare function discoverAuthStorage(agentDir: string, options?: DiscoverAuthStorageOptions): AuthStorage;
/** Creates the model registry used by agent model discovery. */
/** Creates a model registry for one agent directory, optionally filtered and plugin-normalized. */
declare function discoverModels(authStorage: AuthStorage, agentDir: string, options?: DiscoverModelsOptions): ModelRegistry;
//#endregion
//#region src/agents/model-catalog-lookup.d.ts
/** Returns whether a catalog entry declares support for an input modality. */
declare function modelSupportsInput(entry: ModelCatalogEntry | undefined, input: ModelInputType): boolean;
/** Finds a provider-qualified model entry in a catalog. */
declare function findModelInCatalog(catalog: ModelCatalogEntry[], provider: string, modelId: string): ModelCatalogEntry | undefined;
/** Finds a model entry, requiring uniqueness when provider is omitted. */
declare function findModelCatalogEntry(catalog: ModelCatalogEntry[], params: {
  provider?: string;
  modelId: string;
}): ModelCatalogEntry | undefined;
//#endregion
//#region src/agents/model-catalog.d.ts
type AgentDiscoveryModule = typeof agent_model_discovery_d_exports;
declare function resetModelCatalogCache(): void;
declare function resetModelCatalogCacheForTest(): void;
declare function setModelCatalogImportForTest(loader?: () => Promise<AgentDiscoveryModule>): void;
declare function loadManifestModelCatalog(params: {
  config: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  fallbackToMetadataScan?: boolean;
  metadataSnapshot?: PluginMetadataSnapshot;
}): ModelCatalogEntry[];
declare function loadModelCatalog(params?: {
  config?: OpenClawConfig;
  useCache?: boolean;
  cacheOnly?: boolean;
  readOnly?: boolean;
  metadataSnapshot?: PluginMetadataSnapshot;
}): Promise<ModelCatalogEntry[]>;
/**
 * Check if a model supports image input based on its catalog entry.
 */
declare function modelSupportsVision(entry: ModelCatalogEntry | undefined): boolean;
/**
 * Check if a model supports native document/PDF input based on its catalog entry.
 */
declare function modelSupportsDocument(entry: ModelCatalogEntry | undefined): boolean;
//#endregion
//#region src/agents/model-catalog-scope.d.ts
/** Resolves provider/model refs used to scope model catalog discovery. */
declare function resolveModelCatalogScope(params: {
  cfg?: OpenClawConfig;
  provider: string;
  model: string;
}): {
  providerRefs: string[];
  modelRefs: string[];
};
/** Extracts provider ids from resolved catalog scope refs for discovery calls. */
declare function resolveProviderDiscoveryProviderIdsForCatalogScope(params: {
  providerRefs?: readonly string[];
  modelRefs?: readonly string[];
}): string[] | undefined;
//#endregion
//#region src/tools/availability.d.ts
/** Evaluate one descriptor against runtime context and return hidden-tool diagnostics. */
declare function evaluateToolAvailability(params: {
  descriptor: ToolDescriptor;
  context?: ToolAvailabilityContext;
}): readonly ToolAvailabilityDiagnostic[];
//#endregion
//#region src/tools/descriptors.d.ts
/**
 * Identity helpers for authoring tool descriptors with stable inferred types.
 *
 * Callers use these at declaration sites so descriptor arrays keep readonly
 * shapes while still validating against the public ToolDescriptor contract.
 */
/** Define one tool descriptor without changing its runtime shape. */
declare function defineToolDescriptor(descriptor: ToolDescriptor): ToolDescriptor;
/** Define a readonly descriptor list without changing runtime order or entries. */
declare function defineToolDescriptors(descriptors: readonly ToolDescriptor[]): readonly ToolDescriptor[];
//#endregion
//#region src/tools/diagnostics.d.ts
/**
 * Diagnostics used when descriptor planning violates tool contract invariants.
 *
 * These are programmer errors, not availability diagnostics, so callers can
 * distinguish broken tool registration from intentionally hidden tools.
 */
/** Stable contract error code emitted by the tool planner. */
type ToolPlanContractErrorCode = "duplicate-tool-name" | "missing-executor";
/** Error thrown when a visible tool plan cannot be built from descriptors. */
declare class ToolPlanContractError extends Error {
  readonly code: ToolPlanContractErrorCode;
  readonly toolName: string;
  constructor(params: {
    code: ToolPlanContractErrorCode;
    toolName: string;
    message: string;
  });
}
//#endregion
//#region src/tools/execution.d.ts
/**
 * Formatting helpers for tool executor references.
 *
 * Executor refs are closed discriminated unions; the formatted string is for
 * diagnostics/logging and must not become a parser contract.
 */
/** Render an executor ref as a compact diagnostic label. */
declare function formatToolExecutorRef(ref: ToolExecutorRef): string;
//#endregion
//#region src/tools/planner.d.ts
/** Build the visible and hidden tool plan for a runtime context. */
declare function buildToolPlan(options: BuildToolPlanOptions): ToolPlan;
//#endregion
//#region src/tools/protocol.d.ts
type ToolProtocolDescriptor = {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: JsonObject;
};
declare function toToolProtocolDescriptor(entry: ToolPlanEntry): ToolProtocolDescriptor;
declare function toToolProtocolDescriptors(entries: readonly ToolPlanEntry[]): readonly ToolProtocolDescriptor[];
//#endregion
//#region src/agents/spawned-context.d.ts
type SpawnedRunMetadata = {
  spawnedBy?: string | null;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  workspaceDir?: string | null;
};
//#endregion
//#region src/agents/command/types.d.ts
/** Image content block for Claude API multimodal messages. */
type ImageContent = {
  type: "image";
  data: string;
  mimeType: string;
};
/** Metadata overrides for trusted internal agent command callers. */
type AgentCommandResultMetaOverrides = {
  transport?: "embedded";
  fallbackFrom?: "gateway";
  fallbackReason?: "gateway_timeout";
  fallbackSessionId?: string;
  fallbackSessionKey?: string;
};
/** ACP turn source markers accepted by trusted command callsites. */
type AcpTurnSource = "manual_spawn";
/** Channel/account/thread context carried into an agent run. */
type AgentRunContext = {
  messageChannel?: string;
  accountId?: string;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  currentChannelId?: string; /** Transport-native chat/conversation ID for plugin hook identity context. */
  chatId?: string; /** Channel-specific sender/chat metadata for plugin hook identity context. */
  channelContext?: PluginHookChannelContext;
  currentThreadTs?: string;
  currentInboundAudio?: boolean;
  senderId?: string | null;
  replyToMode?: "off" | "first" | "all" | "batched";
  hasRepliedRef?: {
    value: boolean;
  };
};
/** Full trusted option surface for running an agent command. */
type AgentCommandOpts = {
  message: string; /** User-visible transcript body; defaults to message and excludes runtime-only context. */
  transcriptMessage?: string; /** Optional image attachments for multimodal messages. */
  images?: ImageContent[]; /** Original inline/offloaded attachment order for inbound images. */
  imageOrder?: PromptImageOrderEntry[]; /** Optional client-provided tools (OpenResponses hosted tools). */
  clientTools?: ClientToolDefinition[]; /** Agent id override (must exist in config). */
  agentId?: string; /** Per-run provider override. */
  provider?: string; /** Per-run model override. */
  model?: string;
  to?: string;
  sessionId?: string;
  sessionKey?: string;
  thinking?: string;
  thinkingOnce?: string;
  verbose?: string;
  json?: boolean;
  timeout?: string;
  deliver?: boolean; /** Override delivery target (separate from session routing). */
  replyTo?: string; /** Override delivery channel (separate from session routing). */
  replyChannel?: string; /** Override delivery account id (separate from session routing). */
  replyAccountId?: string; /** Override delivery thread/topic id (separate from session routing). */
  threadId?: string | number; /** Message channel context. */
  messageChannel?: string; /** Tool-policy/output surface context. Defaults to messageChannel. */
  messageProvider?: string; /** Delivery channel. */
  channel?: string; /** Account ID for multi-account channel routing. */
  accountId?: string; /** Context for embedded run routing (channel/account/thread). */
  runContext?: AgentRunContext; /** Device-scoped operator session allowed to review approvals initiated by this run. */
  approvalReviewerDeviceId?: string; /** Internal trusted exec approval follow-up elevated defaults. */
  bashElevated?: ExecElevatedDefaults; /** Trusted sender identity bit for command/channel-action auth; defaults true for local CLI calls. */
  senderIsOwner?: boolean; /** Whether this caller is authorized to use provider/model per-run overrides. */
  allowModelOverride?: boolean; /** Optional runtime tool allow-list; when set, only these tools are exposed for this run. */
  toolsAllow?: string[]; /** Group/spawn metadata for subagent policy inheritance and routing context. */
  groupId?: SpawnedRunMetadata["groupId"];
  groupChannel?: SpawnedRunMetadata["groupChannel"];
  groupSpace?: SpawnedRunMetadata["groupSpace"];
  spawnedBy?: SpawnedRunMetadata["spawnedBy"];
  deliveryTargetMode?: ChannelOutboundTargetMode;
  bestEffortDeliver?: boolean;
  abortSignal?: AbortSignal;
  lane?: string;
  runId?: string; /** Immutable gateway lifecycle ownership captured when this run was admitted. */
  lifecycleGeneration?: string;
  extraSystemPrompt?: string; /** Bootstrap workspace context injection mode for this run. */
  bootstrapContextMode?: "full" | "lightweight"; /** Run kind hint for bootstrap context behavior. */
  bootstrapContextRunKind?: "default" | "heartbeat" | "cron";
  internalEvents?: AgentInternalEvent[];
  inputProvenance?: InputProvenance; /** Internal runs can execute against a session without updating visible status/model/usage. */
  sessionEffects?: "visible" | "internal"; /** Internal handoffs can write transcript turns without changing user-facing model/usage state. */
  preserveUserFacingSessionModelState?: boolean; /** Visible source replies must be sent through the message tool when set. */
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode; /** Internal runs can omit the channel message tool entirely. */
  disableMessageTool?: boolean; /** Gateway ingress that already persisted visible activity can skip the duplicate pre-run touch. */
  skipInitialSessionTouch?: boolean; /** Per-call stream param overrides (best-effort). */
  streamParams?: AgentStreamParams; /** Resolved per-run fast mode from channel/directive handling. */
  fastMode?: FastMode; /** Resolved per-run auto cutoff seconds for fast mode. */
  fastModeAutoOnSeconds?: number; /** Explicit workspace directory override (for subagents to inherit parent workspace). */
  workspaceDir?: SpawnedRunMetadata["workspaceDir"]; /** Explicit task working directory for this run. Bootstrap still uses workspaceDir. */
  cwd?: string; /** Force bundled MCP teardown when a one-shot local run completes. */
  cleanupBundleMcpOnRunEnd?: boolean; /** Force long-lived CLI live session teardown when a one-shot local run completes. */
  cleanupCliLiveSessionOnRunEnd?: boolean; /** Mark explicit one-shot local CLI runs so plugin tools can release resources promptly. */
  oneShotCliRun?: boolean; /** Internal local CLI callers can annotate result metadata before JSON/text output. */
  resultMetaOverrides?: AgentCommandResultMetaOverrides; /** Called when the actual run model is selected, including fallback retries. */
  onActiveModelSelected?: (ctx: {
    provider: string;
    model: string;
  }) => void; /** Called when compaction rotates the active run onto a successor session. */
  onSessionIdChanged?: (sessionId: string) => void; /** Internal one-shot model probe mode: no tools, no workspace/chat prompt policy. */
  modelRun?: boolean; /** Internal prompt-mode override for trusted local/gateway callsites. */
  promptMode?: PromptMode; /** Internal ACP-ready session turn source. Manual spawn turns bypass only the dispatch gate. */
  acpTurnSource?: AcpTurnSource; /** Internal handoffs can feed the model without writing the synthetic prompt to transcript. */
  suppressPromptPersistence?: boolean;
};
/** Restricted option surface for external ingress callsites. */
type AgentCommandIngressOpts = Omit<AgentCommandOpts, "senderIsOwner" | "allowModelOverride" | "resultMetaOverrides"> & {
  /** Trusted sender identity bit for command/channel-action auth; defaults false for ingress. */senderIsOwner?: boolean; /** Ingress callsites must always pass explicit model-override authorization state. */
  allowModelOverride: boolean;
};
//#endregion
//#region src/agents/agent-runtime-config.d.ts
/** Loads runtime/source config and resolves command SecretRefs when the agent path needs them. */
declare function resolveAgentRuntimeConfig(runtime: RuntimeEnv, params?: {
  runtimeTargetsChannelSecrets?: boolean;
}): Promise<{
  loadedRaw: OpenClawConfig;
  sourceConfig: OpenClawConfig;
  cfg: OpenClawConfig;
}>;
//#endregion
//#region src/agents/agent-command.d.ts
declare function resolveExplicitAgentCommandSessionKey(params: {
  rawExplicitSessionKey?: string;
  agentIdOverride?: string;
  shouldScopeDefaultAgentKey?: boolean;
  cfg: OpenClawConfig;
}): string | undefined;
declare function prepareAgentCommandExecution(opts: AgentCommandOpts, runtime: RuntimeEnv): Promise<{
  opts: AgentCommandOpts;
  body: string;
  transcriptBody: string;
  cfg: OpenClawConfig;
  configuredThinkingCatalog: ModelCatalogEntry[];
  normalizedSpawned: {
    spawnedBy?: string;
    groupId?: string;
    groupChannel?: string;
    groupSpace?: string;
    workspaceDir?: string;
  };
  agentCfg: AgentDefaultsConfig | undefined;
  thinkOverride: ThinkLevel$1 | undefined;
  thinkOnce: ThinkLevel$1 | undefined;
  verboseOverride: VerboseLevel | undefined;
  timeoutMs: number;
  runTimeoutOverrideMs: number | undefined;
  sessionId: string;
  sessionKey: string | undefined;
  sessionEntry: SessionEntry | undefined;
  sessionStore: Record<string, SessionEntry> | undefined;
  storePath: string;
  isNewSession: boolean;
  persistedThinking: ThinkLevel$1 | undefined;
  persistedVerbose: VerboseLevel | undefined;
  sessionAgentId: string;
  outboundSession: OutboundSessionContext | undefined;
  workspaceDir: string;
  cwd: string | undefined;
  agentDir: string;
  pluginsEnabled: boolean;
  manifestMetadataSnapshot: PluginMetadataSnapshot | undefined;
  modelManifestContext: {
    manifestPlugins: readonly PluginManifestRecord[];
  };
  runId: string;
  isSubagentLane: boolean;
  acpManager: AcpSessionManager;
  acpResolution: AcpSessionResolution | null;
}>;
/** Runs an agent turn from CLI/runtime options against the resolved session and model policy. */
declare function agentCommand(opts: AgentCommandOpts, runtime?: RuntimeEnv, deps?: CliDeps): Promise<{
  payloads: ReturnType<typeof projectOutboundPayloadPlanForJson>;
  meta: EmbeddedAgentRunMeta & AgentCommandResultMetaOverrides;
  didSendViaMessagingTool?: boolean;
  messagingToolSentTexts?: string[];
  messagingToolSentMediaUrls?: string[];
  messagingToolSentTargets?: MessagingToolSend[];
  deliverySucceeded?: boolean;
  deliveryStatus?: {
    requested: true;
    attempted: boolean;
    status: "sent" | "suppressed" | "partial_failed" | "failed";
    succeeded: true | false | "partial";
    error?: true;
    errorMessage?: string;
    reason?: string;
    resultCount?: number;
    sentBeforeError?: true;
    payloadOutcomes?: {
      index: number;
      status: "failed" | "sent" | "suppressed";
      reason?: string;
      resultCount?: number;
      sentBeforeError?: boolean;
      stage?: string;
      error?: string;
      hookEffect?: {
        cancelReason?: string;
        metadata?: Record<string, unknown>;
      };
    }[];
  };
}>;
/** Runs an agent turn from an inbound channel/gateway ingress context. */
declare function agentCommandFromIngress(opts: AgentCommandIngressOpts, runtime?: RuntimeEnv, deps?: CliDeps): Promise<{
  payloads: ReturnType<typeof projectOutboundPayloadPlanForJson>;
  meta: EmbeddedAgentRunMeta & AgentCommandResultMetaOverrides;
  didSendViaMessagingTool?: boolean;
  messagingToolSentTexts?: string[];
  messagingToolSentMediaUrls?: string[];
  messagingToolSentTargets?: MessagingToolSend[];
  deliverySucceeded?: boolean;
  deliveryStatus?: {
    requested: true;
    attempted: boolean;
    status: "sent" | "suppressed" | "partial_failed" | "failed";
    succeeded: true | false | "partial";
    error?: true;
    errorMessage?: string;
    reason?: string;
    resultCount?: number;
    sentBeforeError?: true;
    payloadOutcomes?: {
      index: number;
      status: "failed" | "sent" | "suppressed";
      reason?: string;
      resultCount?: number;
      sentBeforeError?: boolean;
      stage?: string;
      error?: string;
      hookEffect?: {
        cancelReason?: string;
        metadata?: Record<string, unknown>;
      };
    }[];
  };
}>;
declare const testing: {
  resolveAgentRuntimeConfig: typeof resolveAgentRuntimeConfig;
  prepareAgentCommandExecution: typeof prepareAgentCommandExecution;
  resolveExplicitAgentCommandSessionKey: typeof resolveExplicitAgentCommandSessionKey;
};
//#endregion
export { ActionGate, AgentAvatarResolution, AgentModelPrimaryWriteTarget, AgentSimpleCompletionSelection, AgentToolWithMeta, AnyAgentTool, type ApiKeyCredential, type AuthCredentialReasonCode, type AuthProfileBlockedReason, type AuthProfileBlockedSource, type AuthProfileCredential, type AuthProfileEligibilityReasonCode, type AuthProfileFailureReason, type AuthProfileIdRepairResult, type AuthProfileStore, AutoFallbackPrimaryProbe, AvailableTag, BlockReplyChunking, type BuildToolPlanOptions, CLAUDE_CLI_PROFILE_ID, CODEX_APP_SERVER_AUTH_MARKER, CODEX_CLI_PROFILE_ID, CUSTOM_LOCAL_AUTH_MARKER, CacheEntry, CronStyleNow, DEFAULT_CACHE_TTL_MINUTES, DEFAULT_CONTEXT_TOKENS, DEFAULT_MODEL, DEFAULT_PROVIDER, DEFAULT_TIMEOUT_SECONDS, EmbeddedBlockChunker, type EnvApiKeyResult, ExtractMode, GCP_VERTEX_CREDENTIALS_MARKER, type HiddenToolPlanEntry, type JsonObject, type JsonPrimitive, type JsonValue, MINIMAX_OAUTH_MARKER, MissingProviderAuthError, type ModelAliasIndex, ModelAuthMode, type ModelCatalogEntry, type ModelInputType, type ModelManifestNormalizationContext, type ModelRef, type ModelRefStatus, NON_ENV_SECRETREF_MARKER, OAUTH_API_KEY_MARKER_PREFIX, type OAuthCredential, OLLAMA_LOCAL_AUTH_MARKER, PreparedSimpleCompletionModel, PreparedSimpleCompletionModelForAgent, type ProfileUsageStats, ProviderAuthAliasLookupParams, ProviderAuthError, ProviderCredentialPrecedence, ProviderEntryApiKeyBindingResolution, PublicToolProgress, ReactionParams, ReadResponseTextResult, type ResolvedAgentConfig, type ResolvedProviderAuth, ResolvedTimeFormat, type ResolvedTtsConfig, type ResolvedTtsModelOverrides, RuntimeProviderAuthLookup, SECRETREF_ENV_HEADER_MARKER_PREFIX, SimpleCompletionModelOptions, StringParamOptions, SubagentModelConfigSelectionResult, SubagentModelConfigSelectionSource, THINKING_TAG_SCAN_RE, ThinkLevel, TimeFormatPreference, type TokenCredential, type TokenExpiryState, ToolAuthorizationError, type ToolAvailabilityContext, type ToolAvailabilityDiagnostic, type ToolAvailabilityExpression, type ToolAvailabilitySignal, type ToolDescriptor, type ToolExecutorRef, ToolInputError, type ToolOwnerRef, type ToolPlan, ToolPlanContractError, type ToolPlanEntry, type ToolUnavailableReason, type TtsDirectiveOverrides, type TtsDirectiveParseResult, type TtsResult, type TtsStreamResult, type TtsSynthesisResult, type TtsSynthesisStreamResult, type TtsTelephonyResult, setModelCatalogImportForTest as __setModelCatalogImportForTest, setModelCatalogImportForTest, testing as __testing, testing, testApi as _test, testApi, agentCommand, agentCommandFromIngress, appendCronStyleCurrentTimeLine, applyAuthHeaderOverride, applyLocalNoAuthHeaderOverride, asToolParamsRecord, assertMediaNotDataUrl, assertSandboxPath, buildAllowedModelSet, buildConfiguredAllowlistKeys, buildConfiguredModelCatalog, buildModelAliasIndex, buildToolPlan, buildTtsSystemPromptHint, calculateAuthProfileCooldownMs, canUseProfileAsProviderEntryApiKey, canonicalizeCaseOnlyCatalogModelRef, channelTargetSchema, channelTargetsSchema, clearAuthProfileCooldown, clearAutoFallbackPrimaryProbeSelection, clearExpiredCooldowns, clearRuntimeAuthProfileStoreSnapshots, completeWithPreparedSimpleCompletionModel, createActionGate, createRuntimeProviderAuthLookup, dedupeProfileIds, defineToolDescriptor, defineToolDescriptors, emitToolProgress, ensureAuthProfileStore, ensureAuthProfileStoreWithoutExternalProfiles, entryMatchesAutoFallbackPrimaryProbe, evaluateToolAvailability, extractAssistantText, extractAssistantThinking, extractAssistantVisibleText, extractBasicHtmlContent, extractThinkingFromTaggedStream, extractThinkingFromTaggedText, failedTextResult, fetchWithWebToolsNetworkGuard, findModelCatalogEntry, findModelInCatalog, findNormalizedProviderKey, findNormalizedProviderValue, findPersistedAuthProfileCredential, formatAuthDoctorHint, formatDateStamp, formatMissingAuthError, formatReasoningMessage, formatToolExecutorRef, formatUserTime, getApiKeyForModel, getCustomProviderApiKey, getLastTtsAttempt, getModelRefStatus, getResolvedSpeechProviderConfig, getSoonestCooldownExpiry, getTtsMaxLength, getTtsPersona, getTtsProvider, hasAvailableAuthForProvider, hasConfiguredModelFallbacks, hasLegacyAutoFallbackWithoutOrigin, hasRuntimeAvailableProviderAuth, hasSessionAutoModelFallbackProvenance, hasSyntheticLocalProviderAuthConfig, hasUsableCustomProviderApiKey, htmlToMarkdown, imageResult, imageResultFromFile, inferToolMetaFromArgs, inferUniqueProviderFromCatalog, inferUniqueProviderFromConfiguredModels, isAssistantMessage, isAwsSdkAuthMarker, isCliProvider, isKnownEnvApiKeyMarker, isMissingProviderAuthError, isNonSecretApiKeyMarker, isOAuthApiKeyMarker, isProfileInCooldown, isProviderAuthError, isSecretRefHeaderValueMarker, isSummarizationEnabled, isTtsEnabled, isTtsProviderConfigured, jsonResult, legacyModelKey, listAgentEntries, listAgentIds, listKnownNonSecretApiKeyMarkers, listProfilesForProvider, listSpeechVoices, listTtsPersonas, loadAuthProfileStore, loadAuthProfileStoreForRuntime, loadAuthProfileStoreForSecretsRuntime, loadAuthProfileStoreWithoutExternalProfiles, loadManifestModelCatalog, loadModelCatalog, markAuthProfileBlockedUntil, markAuthProfileCooldown, markAuthProfileFailure, markAuthProfileSuccess, markAutoFallbackPrimaryProbe, markdownToText, maybeApplyTtsToPayload, modelKey, modelSupportsDocument, modelSupportsInput, modelSupportsVision, normalizeCacheKey, normalizeModelRef, normalizeModelSelection, normalizeProviderId, normalizeProviderIdForAuth, normalizeStoredOverrideModel, normalizeTimestamp, normalizeToolModelOverride, normalizeWhitespace, optionalFiniteNumberSchema, optionalNonNegativeIntegerSchema, optionalPositiveIntegerSchema, optionalStringEnum, parseAvailableTags, parseModelRef, payloadTextResult, prepareSimpleCompletionModel, prepareSimpleCompletionModelForAgent, promoteThinkingTagsToBlocks, readCache, readFiniteNumberParam, readNonNegativeIntegerParam, readNumberParam, readPositiveIntegerParam, readReactionParams, readResponseText, readStringArrayParam, readStringOrNumberParam, readStringParam, refreshOAuthCredentialForRuntime, repairOAuthProfileIdMismatch, replaceRuntimeAuthProfileStoreSnapshots, requireApiKey, resetModelCatalogCache, resetModelCatalogCacheForTest, resetProviderAuthAliasMapCacheForTest, resolveAckReaction, resolveAgentAvatar, resolveAgentConfig, resolveAgentContextLimits, resolveAgentDir, resolveAgentEffectiveModelPrimary, resolveAgentExecutionContract, resolveAgentExplicitModelPrimary, resolveAgentIdByWorkspacePath, resolveAgentIdFromSessionKey, resolveAgentIdentity, resolveAgentIdsByWorkspacePath, resolveAgentModelFallbacksOverride, resolveAgentModelPrimary, resolveAgentSkillsFilter, resolveAgentWorkspaceDir, resolveAllowedManagedMediaPath, resolveAllowedModelRef, resolveAllowlistModelKey, resolveApiKeyForProfile, resolveApiKeyForProvider, resolveAuthProfileDisplayLabel, resolveAuthProfileEligibility, resolveAuthProfileOrder, resolveAuthStorePathForDisplay, resolveAutoFallbackPrimaryProbe, resolveAwsSdkEnvVarName, resolveBareModelDefaultProvider, resolveCacheTtlMs, resolveConfiguredModelRef, resolveConfiguredSubagentSpawnModelSelection, resolveCronStyleNow, resolveDefaultAgentDir, resolveDefaultAgentId, resolveDefaultModelForAgent, resolveEffectiveMessagesConfig, resolveEffectiveModelFallbacks, resolveEnvApiKey, resolveEnvSecretRefHeaderValueMarker, resolveExplicitTtsOverrides, resolveFallbackAgentId, resolveHooksGmailModel, resolveHumanDelayConfig, resolveIdentityNamePrefix, resolveMessagePrefix, resolveModelAuthMode, resolveModelCatalogScope, resolveModelRefFromString, resolveNonEnvSecretRefApiKeyMarker, resolveNonEnvSecretRefHeaderValueMarker, resolveOAuthApiKeyMarker, resolveOpenClawAgentDir, resolvePersistedAuthProfileOwnerAgentDir, resolvePersistedModelRef, resolvePersistedOverrideModelRef, resolvePersistedSelectedModelRef, resolvePositiveTimeoutSeconds, resolveProfileUnusableUntilForDisplay, resolveProfilesUnavailableReason, resolveProviderAuthAliasMap, resolveProviderDiscoveryProviderIdsForCatalogScope, resolveProviderEntryApiKeyBinding, resolveProviderEntryApiKeyProfileReference, resolveProviderIdForAuth, resolvePublicAgentAvatarSource, resolveReasoningDefault, resolveResponsePrefix, resolveRunModelFallbacksOverride, resolveSandboxInputPath, resolveSandboxPath, resolveSandboxedMediaSource, resolveSessionAgentId, resolveSessionAgentIds, resolveSimpleCompletionSelectionForAgent, resolveSubagentConfiguredModelSelection, resolveSubagentModelConfigSelection, resolveSubagentModelConfigSelectionResult, resolveSubagentModelFallbacksOverride, resolveSubagentSpawnModelSelection, resolveThinkingDefault, resolveThinkingDefaultWithRuntimeCatalog, resolveTimeoutSeconds, resolveTtsAutoMode, resolveTtsConfig, resolveTtsPrefsPath, resolveTtsProviderOrder, resolveUsableCustomProviderApiKey, resolveUserTimeFormat, resolveUserTimezone, sanitizeAssistantVisibleStreamText, saveAuthProfileStore, scheduleToolProgress, setAgentEffectiveModelPrimary, setAuthProfileOrder, setLastTtsAttempt, setSummarizationEnabled, setTtsAutoMode, setTtsEnabled, setTtsMaxLength, setTtsPersona, setTtsProvider, shouldPreferExplicitConfigApiKeyAuth, splitThinkingTaggedText, streamSpeech, stringEnum, stringifyToolPayload, stripDowngradedToolCallText, stripMinimaxToolCallXml, stripModelSpecialTokens, stripThinkingTagsFromText, suggestOAuthProfileIdForLegacyDefault, synthesizeSpeech, textResult, textToSpeech, textToSpeechStream, textToSpeechTelephony, toToolProtocolDescriptor, toToolProtocolDescriptors, toolProgressResult, truncateText, upsertAuthProfile, upsertAuthProfileWithLock, withNormalizedTimestamp, withSelfHostedWebToolsEndpoint, withStrictWebToolsEndpoint, withTimeout, withTrustedWebToolsEndpoint, writeCache };