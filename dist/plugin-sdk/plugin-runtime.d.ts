import { d as ReplyPayload } from "./types-DNy-f8Hr.js";
import { h as PluginHookChannelSenderContext, m as PluginHookChannelContext, p as PluginHookChannelChatContext } from "./templating-KsALmYhy.js";
import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { _ as PluginFormat, g as PluginDiagnostic, h as PluginConfigUiHint, m as PluginBundleFormat, u as PluginKind } from "./manifest-registry-B03IrHXx.js";
import { t as PluginOrigin } from "./plugin-origin.types-DOQEvsWL.js";
import { $ as PluginHookModelCallEndedEvent, $t as PluginHookMessageSendingResult, A as PluginHookBeforeMessageWriteEvent, At as PluginHookToolResultPersistResult, B as PluginHookGatewayCronJob, Bt as PluginAgentTurnPrepareEvent, C as PluginHookBeforeInstallContext, Ct as PluginHookSubagentSpawningResult, D as PluginHookBeforeInstallResult, Dt as PluginHookToolKind, E as PluginHookBeforeInstallRequest, Et as PluginHookToolInputKind, F as PluginHookCronChangedEvent, Ft as PromptInjectionHookName, G as PluginHookGatewayCronUpdateInput, Gt as PluginNextTurnInjectionEnqueueResult, H as PluginHookGatewayCronRemoveResult, Ht as PluginHeartbeatPromptContributionEvent, I as PluginHookDeprecation, It as isConversationHookName, J as PluginHookHandlerMap, Jt as PluginHookInboundClaimContext, K as PluginHookGatewayStartEvent, Kt as PluginNextTurnInjectionRecord, L as PluginHookGatewayContext, Lt as isDeprecatedPluginHookName, M as PluginHookBeforeResetEvent, Mt as PluginInstallRequestKind, N as PluginHookBeforeToolCallEvent, Nt as PluginInstallSourcePathKind, O as PluginHookBeforeInstallSkill, Ot as PluginHookToolResultPersistContext, P as PluginHookContextWindowSource, Pt as PluginInstallTargetType, Q as PluginHookModelCallBaseEvent, Qt as PluginHookMessageSendingEvent, R as PluginHookGatewayCronCreateInput, Rt as isPluginHookName, S as PluginHookBeforeInstallBuiltinScan, St as PluginHookSubagentSpawningEvent, T as PluginHookBeforeInstallPlugin, Tt as PluginHookToolContext, U as PluginHookGatewayCronRunStatus, Ut as PluginHeartbeatPromptContributionResult, V as PluginHookGatewayCronJobState, Vt as PluginAgentTurnPrepareResult, W as PluginHookGatewayCronService, Wt as PluginNextTurnInjection, X as PluginHookLlmInputEvent, Xt as PluginHookMessageContext, Y as PluginHookInboundClaimResult, Yt as PluginHookInboundClaimEvent, Z as PluginHookLlmOutputEvent, Zt as PluginHookMessageReceivedEvent, _ as PluginHookBeforeAgentRunResult, _t as PluginHookSubagentContext, a as DeprecatedPluginHookName, an as PluginHookBeforeToolCallResult, at as PluginHookReplyDispatchResult, b as PluginHookBeforeDispatchEvent, bt as PluginHookSubagentEndedEvent, c as PluginHookAfterCompactionEvent, cn as PluginHookBeforeAgentStartOverrideResult, ct as PluginHookReplyPayloadSendingEvent, d as PluginHookAgentEndEvent, dn as PluginHookBeforeModelResolveEvent, dt as PluginHookResolveExecEnvContext, en as PluginHookMessageSentEvent, et as PluginHookModelCallStartedEvent, f as PluginHookBeforeAgentFinalizeEvent, fn as PluginHookBeforeModelResolveResult, ft as PluginHookResolveExecEnvEvent, g as PluginHookBeforeAgentRunEvent, gt as PluginHookSessionStartEvent, h as PluginHookBeforeAgentReplyResult, hn as stripPromptMutationFieldsFromLegacyHookResult, ht as PluginHookSessionEndReason, i as DEPRECATED_PLUGIN_HOOK_NAMES, in as PluginApprovalResolutions, it as PluginHookReplyDispatchEvent, j as PluginHookBeforeMessageWriteResult, jt as PluginInstallFinding, k as PluginHookBeforeInstallSkillInstallSpec, kt as PluginHookToolResultPersistEvent, l as PluginHookAfterToolCallEvent, ln as PluginHookBeforeAgentStartResult, lt as PluginHookReplyPayloadSendingResult, m as PluginHookBeforeAgentReplyEvent, mn as PluginHookBeforePromptBuildResult, mt as PluginHookSessionEndEvent, n as ConversationHookName, nt as PluginHookRegistration, o as PLUGIN_HOOK_NAMES, on as PLUGIN_PROMPT_MUTATION_RESULT_FIELDS, ot as PluginHookReplyPayload, p as PluginHookBeforeAgentFinalizeResult, pn as PluginHookBeforePromptBuildEvent, pt as PluginHookSessionContext, q as PluginHookGatewayStopEvent, qt as PluginJsonValue, r as DEPRECATED_PLUGIN_HOOKS, rn as PluginApprovalResolution, rt as PluginHookReplyDispatchContext, s as PROMPT_INJECTION_HOOK_NAMES, sn as PluginHookBeforeAgentStartEvent, st as PluginHookReplyPayloadSendingContext, t as CONVERSATION_HOOK_NAMES, tt as PluginHookName, u as PluginHookAgentContext, un as PluginHookBeforeModelResolveAttachment, ut as PluginHookReplyUsageState, v as PluginHookBeforeCompactionEvent, vt as PluginHookSubagentDeliveryTargetEvent, w as PluginHookBeforeInstallEvent, wt as PluginHookSubagentTargetKind, x as PluginHookBeforeDispatchResult, xt as PluginHookSubagentSpawnedEvent, y as PluginHookBeforeDispatchContext, yt as PluginHookSubagentDeliveryTargetResult, z as PluginHookGatewayCronDeliveryStatus, zt as isPromptInjectionHookName } from "./hook-types-D7oQwM1Q.js";
import { $ as OpenClawPluginService, $d as ProviderResolveExternalOAuthProfilesContext, $n as PluginRuntime, $t as ProviderModelSelectedContext, A as OpenClawPluginDefinition, Ai as CliBackendAuthEpochMode, Al as WebFetchProviderPlugin, An as ProviderResolvePromptOverlayContext, At as ProviderAuthOptionBag, B as OpenClawPluginModule, Bi as CliBackendThinkingLevel, Bl as WebSearchRuntimeMetadataContext, Bn as ProviderTransportTurnState, Bt as ProviderCatalogResult, C as OpenClawPluginApi, Cc as RuntimeLogger, Ci as PluginToolMetadataRegistration, Cn as ProviderReplaySanitizeMode, Ct as PluginTranscriptsSourceProviderEntry, D as OpenClawPluginCliRegistrar, Dl as WebFetchCredentialResolutionSource, Dn as ProviderResolveAuthProfileIdContext, Dt as ProviderAuthKind, E as OpenClawPluginCliContext, El as PluginWebSearchProviderEntry, En as ProviderReplayToolCallIdMode, Et as ProviderAuthDoctorHintContext, F as OpenClawPluginHttpRouteHandler, Fi as CliBackendPrepareExecutionContext, Fl as WebSearchProviderId, Fn as ProviderRuntimeProviderConfig, Ft as ProviderBuiltInModelSuppressionResult, G as OpenClawPluginNodeInvokePolicyApprovalRuntime, Gd as ProviderThinkingPolicyContext, Gi as AgentToolResultMiddlewareContext, Gn as RealtimeTranscriptionProviderPlugin, Gt as ProviderDiscoveryOrder, H as OpenClawPluginNodeHostCommand, Hi as PluginTextReplacement, Hn as ProviderValidateReplayTurnsContext, Ht as ProviderCreateStreamFnContext, I as OpenClawPluginHttpRouteMatch, Ii as CliBackendPreparedExecution, Il as WebSearchProviderPlugin, In as ProviderSanitizeReplayHistoryContext, It as ProviderCacheTtlEligibilityContext, J as OpenClawPluginNodeInvokeTransportResult, Ji as AgentToolResultMiddlewareOptions, Jn as TranscriptSourceProvider, Jt as ProviderExtraParamsForTransportResult, K as OpenClawPluginNodeInvokePolicyContext, Kd as ProviderThinkingProfile, Ki as AgentToolResultMiddlewareEvent, Kn as RealtimeVoiceProviderPlugin, Kt as ProviderDiscoveryResult, L as OpenClawPluginHttpRouteParams, Li as CliBackendResolveExecutionArgs, Ll as WebSearchProviderSetupContext, Ln as ProviderSystemPromptContributionContext, Lt as ProviderCapabilities, M as OpenClawPluginGatewayRuntimeScopeSurface, Mi as CliBackendNativeToolMode, Ml as WebFetchRuntimeMetadataContext, Mn as ProviderResolveUsageAuthContext, Mt as ProviderBuildMissingAuthMessageContext, N as OpenClawPluginHostedMediaResolver, Ni as CliBackendNormalizeConfigContext, Nl as WebSearchCredentialResolutionSource, Nn as ProviderResolveWebSocketSessionPolicyContext, Nt as ProviderBuildUnknownModelHintContext, O as OpenClawPluginCommandDefinition, Ol as WebFetchProviderContext, On as ProviderResolveDynamicModelContext, Ot as ProviderAuthMethod, P as OpenClawPluginHttpRouteAuth, Pi as CliBackendPlugin, Pl as WebSearchProviderContext, Pn as ProviderResolvedUsageAuth, Pt as ProviderBuiltInModelSuppressionContext, Q as OpenClawPluginSecurityAuditContext, Qd as ProviderResolveExternalAuthProfilesContext, Qt as ProviderFollowupFallbackRouteResult, R as OpenClawPluginHttpRouteUpgradeHandler, Ri as CliBackendResolveExecutionArgsContext, Rl as WebSearchProviderToolDefinition, Rn as ProviderToolSchemaDiagnostic, Rt as ProviderCatalogContext, S as OpenClawPluginAgentEventsApi, Si as PluginSessionTurnUnscheduleByTagResult, Sn as ProviderReplayPolicyContext, St as PluginTextTransformRegistration, T as OpenClawPluginCliCommandDescriptor, Ta as AgentHarness, Tl as PluginWebFetchProviderEntry, Tn as ProviderReplaySessionState, Tt as ProviderAuthContext, U as OpenClawPluginNodeInvokeApprovalDecision, Ui as PluginTextTransforms, Un as ProviderWebSocketSessionPolicy, Ut as ProviderDeferSyntheticProfileAuthContext, V as OpenClawPluginNodeCliFeatureOptions, Vi as CliBundleMcpMode, Vn as ProviderUsageAuthToken, Vt as ProviderCreateEmbeddingProviderContext, W as OpenClawPluginNodeInvokePolicy, Wd as ProviderDefaultThinkingPolicyContext, Wi as AgentToolResultMiddleware, Wn as ProviderWrapStreamFnContext, Wt as ProviderDiscoveryContext, X as OpenClawPluginRunContextApi, Xd as ProviderExternalAuthProfile, Xi as AgentToolResultMiddlewareRuntime, Xn as UnifiedModelCatalogProviderPlugin, Xt as ProviderFetchUsageSnapshotContext, Y as OpenClawPluginReloadRegistration, Yi as AgentToolResultMiddlewareResult, Yn as UnifiedModelCatalogProviderContext, Yt as ProviderFailoverErrorContext, Z as OpenClawPluginSecurityAuditCollector, Zd as ProviderExternalOAuthProfile, Zi as OpenClawAgentToolResult, Zn as VideoGenerationProviderPlugin, Zt as ProviderFollowupFallbackRouteContext, _ as MigrationSummary, _i as PluginSessionExtensionRegistration, _n as ProviderPrepareRuntimeAuthContext, _t as PluginRealtimeVoiceProviderEntry, a as ImageGenerationProviderPlugin, ai as PluginAgentEventEmitResult, an as ProviderNormalizeToolSchemasContext, at as PluginCommandContext, b as OpenClawGatewayDiscoveryService, bi as PluginSessionTurnScheduleParams, bn as ProviderReasoningOutputModeContext, bt as PluginSetupAutoEnableProbe, c as MigrationDetection, ci as PluginRunContextGetParams, cn as ProviderPlugin, ct as PluginCommandResult, d as MigrationItemKind, di as PluginSessionActionContext, dl as OpenClawPluginActiveModelContext, dn as ProviderPluginWizard, dt as PluginEmbeddingProvider, ef as ProviderResolveSyntheticAuthContext, en as ProviderModernModelPolicyContext, et as OpenClawPluginServiceContext, f as MigrationItemStatus, fi as PluginSessionActionRegistration, fl as OpenClawPluginHookOptions, fn as ProviderPluginWizardModelPicker, ft as PluginInteractiveHandlerRegistration, g as MigrationProviderPreparation, gi as PluginSessionExtensionProjection, gn as ProviderPrepareExtraParamsContext, gt as PluginRealtimeTranscriptionProviderEntry, h as MigrationProviderPlugin, hi as PluginSessionAttachmentResult, hl as OpenClawPluginToolOptions, hn as ProviderPrepareDynamicModelContext, ht as PluginLogger, i as AgentPromptSurfaceKind, ii as PluginAgentEventEmitParams, in as ProviderNormalizeResolvedModelContext, it as OpenClawPluginSessionWorkflowApi, j as OpenClawPluginGatewayMethod, ji as CliBackendExecutionMode, jl as WebFetchProviderToolDefinition, jn as ProviderResolveTransportTurnStateContext, jt as ProviderAuthResult, k as OpenClawPluginConfigSchema, kl as WebFetchProviderId, kn as ProviderResolveNonInteractiveApiKeyParams, kt as ProviderAuthMethodNonInteractiveContext, l as MigrationItem, li as PluginRunContextPatch, ln as ProviderPluginCatalog, lt as PluginConfigMigration, m as MigrationProviderContext, mi as PluginSessionAttachmentParams, ml as OpenClawPluginToolFactory, mn as ProviderPreferRuntimeResolvedModelContext, mt as PluginInteractiveRegistration, n as AgentPromptGuidance, ni as ProviderNormalizeConfigContext, nn as ProviderNonInteractiveApiKeyResult, nt as OpenClawPluginSessionControlsApi, o as MediaUnderstandingProviderPlugin, oi as PluginAgentEventSubscriptionRegistration, on as ProviderNormalizeTransportContext, ot as PluginCommandDiagnosticsSession, p as MigrationPlan, pi as PluginSessionActionResult, pl as OpenClawPluginToolContext, pn as ProviderPluginWizardSetup, pt as PluginInteractiveHandlerResult, q as OpenClawPluginNodeInvokePolicyResult, qd as ProviderRuntimeModel, qi as AgentToolResultMiddlewareHarness, qn as SpeechProviderPlugin, qt as ProviderExtraParamsForTransportContext, r as AgentPromptGuidanceEntry, ri as ProviderResolveConfigApiKeyContext, rn as ProviderNormalizeModelIdContext, rt as OpenClawPluginSessionStateApi, s as MigrationApplyResult, si as PluginControlUiDescriptor, sn as ProviderOAuthProfileIdRepair, st as PluginCommandHandler, t as AGENT_PROMPT_SURFACE_KINDS, tf as ProviderSyntheticAuthResult, ti as ProviderApplyConfigDefaultsContext, tn as ProviderNonInteractiveApiKeyCredentialParams, tt as OpenClawPluginSessionApi, u as MigrationItemAction, ui as PluginRuntimeLifecycleRegistration, un as ProviderPluginDiscovery, ut as PluginConfigValidation, v as MusicGenerationProviderPlugin, vi as PluginSessionSchedulerJobHandle, vn as ProviderPreparedRuntimeAuth, vt as PluginRegistrationMode, w as OpenClawPluginChannelRegistration, wi as PluginTrustedToolPolicyRegistration, wn as ProviderReplaySessionEntry, wt as ProviderAugmentModelCatalogContext, x as OpenClawPluginAgentApi, xi as PluginSessionTurnUnscheduleByTagParams, xn as ProviderReplayPolicy, xt as PluginSpeechProviderEntry, y as OpenClawGatewayDiscoveryAdvertiseContext, yi as PluginSessionSchedulerJobRegistration, yn as ProviderReasoningOutputMode, yt as PluginSetupAutoEnableContext, z as OpenClawPluginLifecycleApi, zi as CliBackendSideQuestionToolMode, zl as WebSearchProviderToolExecutionContext, zn as ProviderTransformSystemPromptContext, zt as ProviderCatalogOrder } from "./types-CXLy55Xw.js";
import { a as PluginConversationBindingResolvedEvent, i as PluginConversationBindingResolutionDecision, n as PluginConversationBindingRequestParams, r as PluginConversationBindingRequestResult, t as PluginConversationBinding } from "./conversation-binding.types-A1VoWklm.js";
import { r as AnyAgentTool } from "./common-DDc8qh0a.js";
import { a as GatewayRequestOptions, t as GatewayRequestContext } from "./types-Bk57zmpP.js";
import { a as resetGlobalHookRunner, i as initializeGlobalHookRunner, n as getGlobalPluginRegistry, o as runGlobalGatewayStopSafely, r as hasGlobalHooks, t as getGlobalHookRunner } from "./hook-runner-global-D0n0-eba.js";
import { n as listProviderPluginCommandSpecs, t as getPluginCommandSpecs } from "./command-specs-Kq5903ih.js";
import { p as requestPluginConversationBinding } from "./conversation-binding-Dte-2_br.js";
import { t as normalizePluginHttpPath } from "./http-path-BQYXN9ah.js";
import { n as registerPluginHttpRoute, r as withPluginHttpRouteRegistry, t as PluginHttpRouteHandler } from "./http-registry-rjRz3-ry.js";

//#region src/plugins/command-registry-state.d.ts
type RegisteredPluginCommand = OpenClawPluginCommandDefinition & {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
  trustedOwnerStatusExposure?: true;
};
declare function clearPluginCommands(): void;
declare function clearPluginCommandsForPlugin(pluginId: string): void;
declare function listRegisteredPluginAgentPromptGuidance(params?: {
  surface?: AgentPromptSurfaceKind;
  includeLegacyGlobalGuidance?: boolean;
}): string[];
//#endregion
//#region src/plugins/command-registration.d.ts
/** Result returned when a plugin command registration succeeds or fails validation. */
type CommandRegistrationResult = {
  ok: boolean;
  error?: string;
};
/** Validates user-visible command names before plugin registration accepts them. */
declare function validateCommandName(name: string, opts?: {
  allowReservedCommandNames?: boolean;
}): string | null;
/**
 * Validate a plugin command definition without registering it.
 * Returns an error message if invalid, or null if valid.
 * Shared by both the global registration path and snapshot (non-activating) loads.
 */
declare function validatePluginCommandDefinition(command: OpenClawPluginCommandDefinition, opts?: {
  allowReservedCommandNames?: boolean;
}): string | null;
declare function registerPluginCommand(pluginId: string, command: OpenClawPluginCommandDefinition, opts?: {
  pluginName?: string;
  pluginRoot?: string;
  allowReservedCommandNames?: boolean;
  allowOwnerStatusExposure?: boolean;
}): CommandRegistrationResult;
//#endregion
//#region src/plugins/commands.d.ts
/**
 * Check if a command body matches a registered plugin command.
 * Returns the command definition and parsed args if matched.
 *
 * Note: If a command has `acceptsArgs: false` and the user provides arguments,
 * the command will not match. This allows the message to fall through to
 * built-in handlers or the agent. Document this behavior to plugin authors.
 */
declare function matchPluginCommand(commandBody: string, options?: {
  channel?: string;
}): {
  command: RegisteredPluginCommand;
  args?: string;
} | null;
declare function resolveBindingConversationFromCommand(params: {
  config?: OpenClawConfig;
  channel: string;
  senderId?: string;
  from?: string;
  to?: string;
  accountId?: string;
  messageThreadId?: string | number;
  threadParentId?: string;
}): {
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
  threadId?: string | number;
} | null;
/**
 * Execute a plugin command handler.
 *
 * Note: Plugin authors should still validate and sanitize ctx.args for their
 * specific use case. This function provides basic defense-in-depth sanitization.
 */
declare function executePluginCommand(params: {
  command: RegisteredPluginCommand;
  args?: string;
  senderId?: string;
  channel: string;
  channelId?: PluginCommandContext["channelId"];
  isAuthorizedSender: boolean;
  senderIsOwner?: boolean;
  gatewayClientScopes?: PluginCommandContext["gatewayClientScopes"]; /** Host-resolved agent authority for plugin-owned or non-agent-shaped session keys. */
  agentId?: string;
  sessionKey?: PluginCommandContext["sessionKey"];
  sessionId?: PluginCommandContext["sessionId"];
  sessionFile?: PluginCommandContext["sessionFile"];
  authProfileId?: string;
  commandBody: string;
  config: OpenClawConfig;
  from?: PluginCommandContext["from"];
  to?: PluginCommandContext["to"];
  accountId?: PluginCommandContext["accountId"];
  messageThreadId?: PluginCommandContext["messageThreadId"];
  threadParentId?: PluginCommandContext["threadParentId"];
  diagnosticsSessions?: PluginCommandContext["diagnosticsSessions"];
  diagnosticsUploadApproved?: PluginCommandContext["diagnosticsUploadApproved"];
  diagnosticsPreviewOnly?: PluginCommandContext["diagnosticsPreviewOnly"];
  diagnosticsPrivateRouted?: PluginCommandContext["diagnosticsPrivateRouted"];
}): Promise<PluginCommandResult>;
/**
 * List all registered plugin commands.
 * Used for /help and /commands output.
 */
declare function listPluginCommands(): Array<{
  name: string;
  description: string;
  pluginId: string;
  acceptsArgs: boolean;
}>;
declare const testing: {
  resolveBindingConversationFromCommand: typeof resolveBindingConversationFromCommand;
};
//#endregion
//#region src/plugins/interactive-binding-helpers.d.ts
type RegisteredInteractiveMetadata = {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
};
type PluginBindingConversation = Parameters<typeof requestPluginConversationBinding>[0]["conversation"];
declare function createInteractiveConversationBindingHelpers(params: {
  registration: RegisteredInteractiveMetadata;
  senderId?: string;
  conversation: PluginBindingConversation;
}): {
  requestConversationBinding: (binding?: PluginConversationBindingRequestParams) => Promise<{
    status: "bound";
    binding: PluginConversationBinding;
  } | {
    status: "pending";
    approvalId: string;
    reply: ReplyPayload;
  } | {
    status: "error";
    message: string;
  }>;
  detachConversationBinding: () => Promise<{
    removed: boolean;
  }>;
  getCurrentConversationBinding: () => Promise<PluginConversationBinding | null>;
};
//#endregion
//#region src/plugins/interactive-state.d.ts
/** Registered interactive handler with owning plugin metadata. */
type RegisteredInteractiveHandler = PluginInteractiveHandlerRegistration & {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
};
//#endregion
//#region src/plugins/interactive-registry.d.ts
/** Registration result for plugin interactive namespace handlers. */
type InteractiveRegistrationResult = {
  ok: boolean;
  error?: string;
};
/** Registers one plugin interactive namespace for a channel. */
declare function registerPluginInteractiveHandler(pluginId: string, registration: PluginInteractiveHandlerRegistration, opts?: {
  pluginName?: string;
  pluginRoot?: string;
}): InteractiveRegistrationResult;
/** Clears all active plugin interactive handlers. */
declare function clearPluginInteractiveHandlers(): void;
/** Clears active interactive handlers owned by one plugin. */
declare function clearPluginInteractiveHandlersForPlugin(pluginId: string): void;
//#endregion
//#region src/plugins/interactive.d.ts
type InteractiveDispatchResult<TResult = unknown> = {
  matched: false;
  handled: false;
  duplicate: false;
} | {
  matched: true;
  handled: boolean;
  duplicate: boolean;
  result?: TResult;
};
type PluginInteractiveDispatchRegistration = {
  channel: string;
  namespace: string;
};
/** Resolved interactive handler match passed to plugin callback dispatch. */
type PluginInteractiveMatch<TRegistration extends PluginInteractiveDispatchRegistration> = {
  registration: RegisteredInteractiveHandler & TRegistration;
  namespace: string;
  payload: string;
};
/** Dispatches one interactive callback payload to a matching plugin handler. */
declare function dispatchPluginInteractiveHandler<TRegistration extends PluginInteractiveDispatchRegistration, TResult extends {
  handled?: boolean;
} | void = {
  handled?: boolean;
} | void>(params: {
  channel: TRegistration["channel"];
  data: string;
  dedupeId?: string;
  onMatched?: () => Promise<void> | void;
  invoke: (match: PluginInteractiveMatch<TRegistration>) => Promise<TResult> | TResult;
}): Promise<InteractiveDispatchResult<TResult>>;
//#endregion
//#region src/plugins/lazy-service-module.d.ts
type LazyServiceModule = Record<string, unknown>;
type LazyPluginServiceHandle = {
  stop: () => Promise<void>;
};
declare function defaultLoadOverrideModule(specifier: string, importModule?: (specifier: string) => Promise<LazyServiceModule>): Promise<LazyServiceModule>;
declare function startLazyPluginServiceModule(params: {
  skipEnvVar?: string;
  overrideEnvVar?: string;
  validateOverrideSpecifier?: (specifier: string) => string;
  loadDefaultModule: () => Promise<LazyServiceModule>;
  loadOverrideModule?: (specifier: string) => Promise<LazyServiceModule>;
  startExportNames: string[];
  stopExportNames?: string[];
}): Promise<LazyPluginServiceHandle | null>;
//#endregion
//#region src/plugins/runtime/gateway-request-scope.d.ts
type PluginRuntimeGatewayRequestScope = {
  context?: GatewayRequestContext;
  client?: GatewayRequestOptions["client"];
  isWebchatConnect: GatewayRequestOptions["isWebchatConnect"];
  pluginId?: string;
  pluginSource?: string;
  gatewayMethodDispatchAllowed?: boolean;
};
/**
 * Returns the current plugin gateway request scope when called from a plugin request handler.
 */
declare function getPluginRuntimeGatewayRequestScope(): PluginRuntimeGatewayRequestScope | undefined;
//#endregion
export { AGENT_PROMPT_SURFACE_KINDS, type AgentHarness, AgentPromptGuidance, AgentPromptGuidanceEntry, AgentPromptSurfaceKind, type AgentToolResultMiddleware, type AgentToolResultMiddlewareContext, type AgentToolResultMiddlewareEvent, type AgentToolResultMiddlewareHarness, type AgentToolResultMiddlewareOptions, type AgentToolResultMiddlewareResult, type AgentToolResultMiddlewareRuntime, type AnyAgentTool, CONVERSATION_HOOK_NAMES, type CliBackendAuthEpochMode, type CliBackendExecutionMode, type CliBackendNativeToolMode, type CliBackendNormalizeConfigContext, type CliBackendPlugin, type CliBackendPrepareExecutionContext, type CliBackendPreparedExecution, type CliBackendResolveExecutionArgs, type CliBackendResolveExecutionArgsContext, type CliBackendSideQuestionToolMode, type CliBackendThinkingLevel, type CliBundleMcpMode, ConversationHookName, DEPRECATED_PLUGIN_HOOKS, DEPRECATED_PLUGIN_HOOK_NAMES, DeprecatedPluginHookName, ImageGenerationProviderPlugin, type InteractiveRegistrationResult, LazyPluginServiceHandle, MediaUnderstandingProviderPlugin, MigrationApplyResult, MigrationDetection, MigrationItem, MigrationItemAction, MigrationItemKind, MigrationItemStatus, MigrationPlan, MigrationProviderContext, MigrationProviderPlugin, MigrationProviderPreparation, MigrationSummary, MusicGenerationProviderPlugin, type OpenClawAgentToolResult, OpenClawGatewayDiscoveryAdvertiseContext, OpenClawGatewayDiscoveryService, type OpenClawPluginActiveModelContext, OpenClawPluginAgentApi, OpenClawPluginAgentEventsApi, OpenClawPluginApi, OpenClawPluginChannelRegistration, OpenClawPluginCliCommandDescriptor, OpenClawPluginCliContext, OpenClawPluginCliRegistrar, OpenClawPluginCommandDefinition, OpenClawPluginConfigSchema, OpenClawPluginDefinition, OpenClawPluginGatewayMethod, OpenClawPluginGatewayRuntimeScopeSurface, type OpenClawPluginHookOptions, OpenClawPluginHostedMediaResolver, OpenClawPluginHttpRouteAuth, OpenClawPluginHttpRouteHandler, OpenClawPluginHttpRouteMatch, OpenClawPluginHttpRouteParams, OpenClawPluginHttpRouteUpgradeHandler, OpenClawPluginLifecycleApi, OpenClawPluginModule, OpenClawPluginNodeCliFeatureOptions, OpenClawPluginNodeHostCommand, OpenClawPluginNodeInvokeApprovalDecision, OpenClawPluginNodeInvokePolicy, OpenClawPluginNodeInvokePolicyApprovalRuntime, OpenClawPluginNodeInvokePolicyContext, OpenClawPluginNodeInvokePolicyResult, OpenClawPluginNodeInvokeTransportResult, OpenClawPluginReloadRegistration, OpenClawPluginRunContextApi, OpenClawPluginSecurityAuditCollector, OpenClawPluginSecurityAuditContext, OpenClawPluginService, OpenClawPluginServiceContext, OpenClawPluginSessionApi, OpenClawPluginSessionControlsApi, OpenClawPluginSessionStateApi, OpenClawPluginSessionWorkflowApi, type OpenClawPluginToolContext, type OpenClawPluginToolFactory, type OpenClawPluginToolOptions, PLUGIN_HOOK_NAMES, PLUGIN_PROMPT_MUTATION_RESULT_FIELDS, PROMPT_INJECTION_HOOK_NAMES, type PluginAgentEventEmitParams, type PluginAgentEventEmitResult, type PluginAgentEventSubscriptionRegistration, type PluginAgentTurnPrepareEvent, type PluginAgentTurnPrepareResult, type PluginApprovalResolution, PluginApprovalResolutions, type PluginBundleFormat, PluginCommandContext, PluginCommandDiagnosticsSession, PluginCommandHandler, PluginCommandResult, PluginConfigMigration, type PluginConfigUiHint, PluginConfigValidation, type PluginControlUiDescriptor, type PluginConversationBinding, type PluginConversationBindingRequestParams, type PluginConversationBindingRequestResult, type PluginConversationBindingResolutionDecision, type PluginConversationBindingResolvedEvent, type PluginDiagnostic, PluginEmbeddingProvider, type PluginFormat, type PluginHeartbeatPromptContributionEvent, type PluginHeartbeatPromptContributionResult, PluginHookAfterCompactionEvent, PluginHookAfterToolCallEvent, PluginHookAgentContext, PluginHookAgentEndEvent, PluginHookBeforeAgentFinalizeEvent, PluginHookBeforeAgentFinalizeResult, PluginHookBeforeAgentReplyEvent, PluginHookBeforeAgentReplyResult, PluginHookBeforeAgentRunEvent, PluginHookBeforeAgentRunResult, type PluginHookBeforeAgentStartEvent, type PluginHookBeforeAgentStartOverrideResult, type PluginHookBeforeAgentStartResult, PluginHookBeforeCompactionEvent, PluginHookBeforeDispatchContext, PluginHookBeforeDispatchEvent, PluginHookBeforeDispatchResult, PluginHookBeforeInstallBuiltinScan, PluginHookBeforeInstallContext, PluginHookBeforeInstallEvent, PluginHookBeforeInstallPlugin, PluginHookBeforeInstallRequest, PluginHookBeforeInstallResult, PluginHookBeforeInstallSkill, PluginHookBeforeInstallSkillInstallSpec, PluginHookBeforeMessageWriteEvent, PluginHookBeforeMessageWriteResult, type PluginHookBeforeModelResolveAttachment, type PluginHookBeforeModelResolveEvent, type PluginHookBeforeModelResolveResult, type PluginHookBeforePromptBuildEvent, type PluginHookBeforePromptBuildResult, PluginHookBeforeResetEvent, PluginHookBeforeToolCallEvent, type PluginHookBeforeToolCallResult, type PluginHookChannelChatContext, type PluginHookChannelContext, type PluginHookChannelSenderContext, PluginHookContextWindowSource, PluginHookCronChangedEvent, PluginHookDeprecation, PluginHookGatewayContext, PluginHookGatewayCronCreateInput, PluginHookGatewayCronDeliveryStatus, PluginHookGatewayCronJob, PluginHookGatewayCronJobState, PluginHookGatewayCronRemoveResult, PluginHookGatewayCronRunStatus, PluginHookGatewayCronService, PluginHookGatewayCronUpdateInput, PluginHookGatewayStartEvent, PluginHookGatewayStopEvent, PluginHookHandlerMap, type PluginHookInboundClaimContext, type PluginHookInboundClaimEvent, PluginHookInboundClaimResult, PluginHookLlmInputEvent, PluginHookLlmOutputEvent, type PluginHookMessageContext, type PluginHookMessageReceivedEvent, type PluginHookMessageSendingEvent, type PluginHookMessageSendingResult, type PluginHookMessageSentEvent, PluginHookModelCallBaseEvent, PluginHookModelCallEndedEvent, PluginHookModelCallStartedEvent, PluginHookName, PluginHookRegistration, PluginHookReplyDispatchContext, PluginHookReplyDispatchEvent, PluginHookReplyDispatchResult, PluginHookReplyPayload, PluginHookReplyPayloadSendingContext, PluginHookReplyPayloadSendingEvent, PluginHookReplyPayloadSendingResult, PluginHookReplyUsageState, PluginHookResolveExecEnvContext, PluginHookResolveExecEnvEvent, PluginHookSessionContext, PluginHookSessionEndEvent, PluginHookSessionEndReason, PluginHookSessionStartEvent, PluginHookSubagentContext, PluginHookSubagentDeliveryTargetEvent, PluginHookSubagentDeliveryTargetResult, PluginHookSubagentEndedEvent, PluginHookSubagentSpawnedEvent, PluginHookSubagentSpawningEvent, PluginHookSubagentSpawningResult, PluginHookSubagentTargetKind, PluginHookToolContext, PluginHookToolInputKind, PluginHookToolKind, PluginHookToolResultPersistContext, PluginHookToolResultPersistEvent, PluginHookToolResultPersistResult, PluginHttpRouteHandler, PluginInstallFinding, PluginInstallRequestKind, PluginInstallSourcePathKind, PluginInstallTargetType, PluginInteractiveHandlerRegistration, PluginInteractiveHandlerResult, PluginInteractiveMatch, PluginInteractiveRegistration, type PluginJsonValue, type PluginKind, PluginLogger, type PluginNextTurnInjection, type PluginNextTurnInjectionEnqueueResult, type PluginNextTurnInjectionRecord, type PluginOrigin, PluginRealtimeTranscriptionProviderEntry, PluginRealtimeVoiceProviderEntry, PluginRegistrationMode, type PluginRunContextGetParams, type PluginRunContextPatch, type PluginRuntime, type PluginRuntimeLifecycleRegistration, type PluginSessionActionContext, type PluginSessionActionRegistration, type PluginSessionActionResult, type PluginSessionAttachmentParams, type PluginSessionAttachmentResult, type PluginSessionExtensionProjection, type PluginSessionExtensionRegistration, type PluginSessionSchedulerJobHandle, type PluginSessionSchedulerJobRegistration, type PluginSessionTurnScheduleParams, type PluginSessionTurnUnscheduleByTagParams, type PluginSessionTurnUnscheduleByTagResult, PluginSetupAutoEnableContext, PluginSetupAutoEnableProbe, PluginSpeechProviderEntry, type PluginTextReplacement, PluginTextTransformRegistration, type PluginTextTransforms, type PluginToolMetadataRegistration, PluginTranscriptsSourceProviderEntry, type PluginTrustedToolPolicyRegistration, type PluginWebFetchProviderEntry, type PluginWebSearchProviderEntry, PromptInjectionHookName, type ProviderApplyConfigDefaultsContext, ProviderAugmentModelCatalogContext, ProviderAuthContext, ProviderAuthDoctorHintContext, ProviderAuthKind, ProviderAuthMethod, ProviderAuthMethodNonInteractiveContext, ProviderAuthOptionBag, ProviderAuthResult, ProviderBuildMissingAuthMessageContext, ProviderBuildUnknownModelHintContext, ProviderBuiltInModelSuppressionContext, ProviderBuiltInModelSuppressionResult, ProviderCacheTtlEligibilityContext, ProviderCapabilities, ProviderCatalogContext, ProviderCatalogOrder, ProviderCatalogResult, ProviderCreateEmbeddingProviderContext, ProviderCreateStreamFnContext, type ProviderDefaultThinkingPolicyContext, ProviderDeferSyntheticProfileAuthContext, ProviderDiscoveryContext, ProviderDiscoveryOrder, ProviderDiscoveryResult, type ProviderExternalAuthProfile, type ProviderExternalOAuthProfile, ProviderExtraParamsForTransportContext, ProviderExtraParamsForTransportResult, ProviderFailoverErrorContext, ProviderFetchUsageSnapshotContext, ProviderFollowupFallbackRouteContext, ProviderFollowupFallbackRouteResult, ProviderModelSelectedContext, ProviderModernModelPolicyContext, ProviderNonInteractiveApiKeyCredentialParams, ProviderNonInteractiveApiKeyResult, type ProviderNormalizeConfigContext, ProviderNormalizeModelIdContext, ProviderNormalizeResolvedModelContext, ProviderNormalizeToolSchemasContext, ProviderNormalizeTransportContext, ProviderOAuthProfileIdRepair, ProviderPlugin, ProviderPluginCatalog, ProviderPluginDiscovery, ProviderPluginWizard, ProviderPluginWizardModelPicker, ProviderPluginWizardSetup, ProviderPreferRuntimeResolvedModelContext, ProviderPrepareDynamicModelContext, ProviderPrepareExtraParamsContext, ProviderPrepareRuntimeAuthContext, ProviderPreparedRuntimeAuth, ProviderReasoningOutputMode, ProviderReasoningOutputModeContext, ProviderReplayPolicy, ProviderReplayPolicyContext, ProviderReplaySanitizeMode, ProviderReplaySessionEntry, ProviderReplaySessionState, ProviderReplayToolCallIdMode, ProviderResolveAuthProfileIdContext, type ProviderResolveConfigApiKeyContext, ProviderResolveDynamicModelContext, type ProviderResolveExternalAuthProfilesContext, type ProviderResolveExternalOAuthProfilesContext, ProviderResolveNonInteractiveApiKeyParams, ProviderResolvePromptOverlayContext, type ProviderResolveSyntheticAuthContext, ProviderResolveTransportTurnStateContext, ProviderResolveUsageAuthContext, ProviderResolveWebSocketSessionPolicyContext, ProviderResolvedUsageAuth, type ProviderRuntimeModel, ProviderRuntimeProviderConfig, ProviderSanitizeReplayHistoryContext, type ProviderSyntheticAuthResult, ProviderSystemPromptContributionContext, type ProviderThinkingPolicyContext, type ProviderThinkingProfile, ProviderToolSchemaDiagnostic, ProviderTransformSystemPromptContext, ProviderTransportTurnState, ProviderUsageAuthToken, ProviderValidateReplayTurnsContext, ProviderWebSocketSessionPolicy, ProviderWrapStreamFnContext, RealtimeTranscriptionProviderPlugin, RealtimeVoiceProviderPlugin, type RuntimeLogger, SpeechProviderPlugin, TranscriptSourceProvider, UnifiedModelCatalogProviderContext, UnifiedModelCatalogProviderPlugin, VideoGenerationProviderPlugin, type WebFetchCredentialResolutionSource, type WebFetchProviderContext, type WebFetchProviderId, type WebFetchProviderPlugin, type WebFetchProviderToolDefinition, type WebFetchRuntimeMetadataContext, type WebSearchCredentialResolutionSource, type WebSearchProviderContext, type WebSearchProviderId, type WebSearchProviderPlugin, type WebSearchProviderSetupContext, type WebSearchProviderToolDefinition, type WebSearchProviderToolExecutionContext, type WebSearchRuntimeMetadataContext, testing as __testing, testing, clearPluginCommands, clearPluginCommandsForPlugin, clearPluginInteractiveHandlers, clearPluginInteractiveHandlersForPlugin, createInteractiveConversationBindingHelpers, defaultLoadOverrideModule, dispatchPluginInteractiveHandler, executePluginCommand, getGlobalHookRunner, getGlobalPluginRegistry, getPluginCommandSpecs, getPluginRuntimeGatewayRequestScope, hasGlobalHooks, initializeGlobalHookRunner, isConversationHookName, isDeprecatedPluginHookName, isPluginHookName, isPromptInjectionHookName, listPluginCommands, listProviderPluginCommandSpecs, listRegisteredPluginAgentPromptGuidance, matchPluginCommand, normalizePluginHttpPath, registerPluginCommand, registerPluginHttpRoute, registerPluginInteractiveHandler, resetGlobalHookRunner, runGlobalGatewayStopSafely, startLazyPluginServiceModule, stripPromptMutationFieldsFromLegacyHookResult, validateCommandName, validatePluginCommandDefinition, withPluginHttpRouteRegistry };