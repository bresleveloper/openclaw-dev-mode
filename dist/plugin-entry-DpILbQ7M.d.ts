import { Bt as PluginAgentTurnPrepareEvent$1, Gt as PluginNextTurnInjectionEnqueueResult$1, Ht as PluginHeartbeatPromptContributionEvent$1, Kt as PluginNextTurnInjectionRecord$1, Ut as PluginHeartbeatPromptContributionResult$1, Vt as PluginAgentTurnPrepareResult$1, Wt as PluginNextTurnInjection$1, qt as PluginJsonValue$1 } from "./hook-types-mbU3l3kV.js";
import { $ as OpenClawPluginService$1, A as OpenClawPluginDefinition$1, Bn as ProviderTransportTurnState$1, Bt as ProviderCatalogResult$1, C as OpenClawPluginApi$1, Ci as PluginSessionTurnUnscheduleByTagParams$1, Cu as ProviderThinkingProfile$1, Da as AgentHarness$1, Ei as PluginTrustedToolPolicyRegistration$1, Et as ProviderAuthDoctorHintContext$1, F as OpenClawPluginHttpRouteHandler$1, Ft as ProviderBuiltInModelSuppressionResult$1, Gn as RealtimeTranscriptionProviderPlugin$1, H as OpenClawPluginNodeHostCommand$1, Hn as ProviderValidateReplayTurnsContext$1, In as ProviderSanitizeReplayHistoryContext$1, It as ProviderCacheTtlEligibilityContext$1, Jn as TranscriptSourceProvider$1, K as OpenClawPluginNodeInvokePolicyContext$1, Mn as ProviderResolveUsageAuthContext$1, Mt as ProviderBuildMissingAuthMessageContext$1, Nn as ProviderResolveWebSocketSessionPolicyContext$1, Nt as ProviderBuildUnknownModelHintContext$1, O as OpenClawPluginCommandDefinition$1, On as ProviderResolveDynamicModelContext$1, Ot as ProviderAuthMethod$1, Pn as ProviderResolvedUsageAuth$1, Pt as ProviderBuiltInModelSuppressionContext$1, Q as OpenClawPluginSecurityAuditContext$1, Rn as ProviderToolSchemaDiagnostic$1, Rt as ProviderCatalogContext$1, Si as PluginSessionTurnScheduleParams$1, Sn as ProviderReplayPolicyContext$1, Su as ProviderThinkingPolicyContext$1, Ti as PluginToolMetadataRegistration$1, Tn as ProviderReplaySessionState$1, Tt as ProviderAuthContext$1, Un as ProviderWebSocketSessionPolicy$1, Ut as ProviderDeferSyntheticProfileAuthContext$1, Vn as ProviderUsageAuthToken$1, W as OpenClawPluginNodeInvokePolicy$1, Wn as ProviderWrapStreamFnContext$1, Wt as ProviderDiscoveryContext$1, Xn as UnifiedModelCatalogProviderPlugin$1, Xt as ProviderFetchUsageSnapshotContext$1, Y as OpenClawPluginReloadRegistration$1, Yn as UnifiedModelCatalogProviderContext$1, Yt as ProviderFailoverErrorContext$1, Z as OpenClawPluginSecurityAuditCollector$1, _ as MigrationSummary$1, _i as PluginSessionAttachmentResult$1, _n as ProviderPrepareRuntimeAuthContext$1, ai as ProviderResolveConfigApiKeyContext$1, an as ProviderNormalizeToolSchemasContext$1, at as PluginCommandContext$1, b as OpenClawGatewayDiscoveryService$1, bi as PluginSessionSchedulerJobHandle$1, bn as ProviderReasoningOutputModeContext$1, c as MigrationDetection$1, ci as PluginAgentEventSubscriptionRegistration$1, ct as PluginCommandResult$1, di as PluginRunContextPatch$1, en as ProviderModernModelPolicyContext$1, et as OpenClawPluginServiceContext$1, fi as PluginRuntimeLifecycleRegistration$1, gi as PluginSessionAttachmentParams$1, gn as ProviderPrepareExtraParamsContext$1, h as MigrationProviderPlugin$1, hi as PluginSessionActionResult$1, hl as OpenClawPluginToolFactory$1, hn as ProviderPrepareDynamicModelContext$1, ht as PluginLogger$1, i as AgentPromptSurfaceKind$1, ii as ProviderNormalizeConfigContext$1, in as ProviderNormalizeResolvedModelContext$1, jn as ProviderResolveTransportTurnStateContext$1, jt as ProviderAuthResult$1, k as OpenClawPluginConfigSchema$1, kt as ProviderAuthMethodNonInteractiveContext$1, l as MigrationItem$1, li as PluginControlUiDescriptor$1, m as MigrationProviderContext$1, mi as PluginSessionActionRegistration$1, ml as OpenClawPluginToolContext$1, n as AgentPromptGuidance$1, o as MediaUnderstandingProviderPlugin$1, oi as PluginAgentEventEmitParams$1, on as ProviderNormalizeTransportContext$1, p as MigrationPlan$1, pi as PluginSessionActionContext$1, q as OpenClawPluginNodeInvokePolicyResult$1, qn as SpeechProviderPlugin$1, r as AgentPromptGuidanceEntry$1, ri as ProviderApplyConfigDefaultsContext$1, rn as ProviderNormalizeModelIdContext$1, s as MigrationApplyResult$1, si as PluginAgentEventEmitResult$1, ui as PluginRunContextGetParams$1, vi as PluginSessionExtensionProjection$1, vn as ProviderPreparedRuntimeAuth$1, wi as PluginSessionTurnUnscheduleByTagResult$1, wn as ProviderReplaySessionEntry$1, wt as ProviderAugmentModelCatalogContext$1, xi as PluginSessionSchedulerJobRegistration$1, xn as ProviderReplayPolicy$1, xu as ProviderDefaultThinkingPolicyContext$1, y as OpenClawGatewayDiscoveryAdvertiseContext$1, yi as PluginSessionExtensionRegistration$1, yn as ProviderReasoningOutputMode$1 } from "./types-BVLQjFJF.js";
import { r as AnyAgentTool$1 } from "./common-DDc8qh0a.js";

//#region src/plugin-sdk/plugin-entry.d.ts
type AnyAgentTool = AnyAgentTool$1;
type AgentHarness = AgentHarness$1;
type AgentPromptGuidance = AgentPromptGuidance$1;
type AgentPromptGuidanceEntry = AgentPromptGuidanceEntry$1;
type AgentPromptSurfaceKind = AgentPromptSurfaceKind$1;
type MediaUnderstandingProviderPlugin = MediaUnderstandingProviderPlugin$1;
type TranscriptSourceProvider = TranscriptSourceProvider$1;
type MigrationApplyResult = MigrationApplyResult$1;
type MigrationDetection = MigrationDetection$1;
type MigrationItem = MigrationItem$1;
type MigrationPlan = MigrationPlan$1;
type MigrationProviderContext = MigrationProviderContext$1;
type MigrationProviderPlugin = MigrationProviderPlugin$1;
type MigrationSummary = MigrationSummary$1;
type OpenClawPluginApi = OpenClawPluginApi$1;
type OpenClawPluginCommandDefinition = OpenClawPluginCommandDefinition$1;
type OpenClawPluginConfigSchema = OpenClawPluginConfigSchema$1;
type OpenClawPluginDefinition = OpenClawPluginDefinition$1;
type OpenClawPluginHttpRouteHandler = OpenClawPluginHttpRouteHandler$1;
type OpenClawPluginNodeHostCommand = OpenClawPluginNodeHostCommand$1;
type OpenClawPluginNodeInvokePolicy = OpenClawPluginNodeInvokePolicy$1;
type OpenClawPluginNodeInvokePolicyContext = OpenClawPluginNodeInvokePolicyContext$1;
type OpenClawPluginNodeInvokePolicyResult = OpenClawPluginNodeInvokePolicyResult$1;
type OpenClawPluginReloadRegistration = OpenClawPluginReloadRegistration$1;
type OpenClawPluginSecurityAuditCollector = OpenClawPluginSecurityAuditCollector$1;
type OpenClawPluginSecurityAuditContext = OpenClawPluginSecurityAuditContext$1;
type OpenClawPluginService = OpenClawPluginService$1;
type OpenClawPluginServiceContext = OpenClawPluginServiceContext$1;
type OpenClawPluginToolContext = OpenClawPluginToolContext$1;
type OpenClawPluginToolFactory = OpenClawPluginToolFactory$1;
type PluginLogger = PluginLogger$1;
type ProviderAugmentModelCatalogContext = ProviderAugmentModelCatalogContext$1;
type ProviderAuthContext = ProviderAuthContext$1;
type ProviderAuthDoctorHintContext = ProviderAuthDoctorHintContext$1;
type ProviderAuthMethod = ProviderAuthMethod$1;
type ProviderAuthMethodNonInteractiveContext = ProviderAuthMethodNonInteractiveContext$1;
type ProviderAuthResult = ProviderAuthResult$1;
type ProviderApplyConfigDefaultsContext = ProviderApplyConfigDefaultsContext$1;
type ProviderBuildMissingAuthMessageContext = ProviderBuildMissingAuthMessageContext$1;
type ProviderBuildUnknownModelHintContext = ProviderBuildUnknownModelHintContext$1;
type ProviderBuiltInModelSuppressionContext = ProviderBuiltInModelSuppressionContext$1;
type ProviderBuiltInModelSuppressionResult = ProviderBuiltInModelSuppressionResult$1;
type ProviderCacheTtlEligibilityContext = ProviderCacheTtlEligibilityContext$1;
type ProviderCatalogContext = ProviderCatalogContext$1;
type ProviderCatalogResult = ProviderCatalogResult$1;
type ProviderDeferSyntheticProfileAuthContext = ProviderDeferSyntheticProfileAuthContext$1;
type ProviderDefaultThinkingPolicyContext = ProviderDefaultThinkingPolicyContext$1;
type ProviderDiscoveryContext = ProviderDiscoveryContext$1;
type ProviderFailoverErrorContext = ProviderFailoverErrorContext$1;
type ProviderFetchUsageSnapshotContext = ProviderFetchUsageSnapshotContext$1;
type ProviderModernModelPolicyContext = ProviderModernModelPolicyContext$1;
type ProviderNormalizeConfigContext = ProviderNormalizeConfigContext$1;
type ProviderNormalizeToolSchemasContext = ProviderNormalizeToolSchemasContext$1;
type ProviderNormalizeTransportContext = ProviderNormalizeTransportContext$1;
type ProviderResolveConfigApiKeyContext = ProviderResolveConfigApiKeyContext$1;
type ProviderNormalizeModelIdContext = ProviderNormalizeModelIdContext$1;
type ProviderNormalizeResolvedModelContext = ProviderNormalizeResolvedModelContext$1;
type ProviderPrepareDynamicModelContext = ProviderPrepareDynamicModelContext$1;
type ProviderPrepareExtraParamsContext = ProviderPrepareExtraParamsContext$1;
type ProviderPrepareRuntimeAuthContext = ProviderPrepareRuntimeAuthContext$1;
type ProviderPreparedRuntimeAuth = ProviderPreparedRuntimeAuth$1;
type ProviderReasoningOutputMode = ProviderReasoningOutputMode$1;
type ProviderReasoningOutputModeContext = ProviderReasoningOutputModeContext$1;
type ProviderReplayPolicy = ProviderReplayPolicy$1;
type ProviderReplayPolicyContext = ProviderReplayPolicyContext$1;
type ProviderReplaySessionEntry = ProviderReplaySessionEntry$1;
type ProviderReplaySessionState = ProviderReplaySessionState$1;
type RealtimeTranscriptionProviderPlugin = RealtimeTranscriptionProviderPlugin$1;
type ProviderResolvedUsageAuth = ProviderResolvedUsageAuth$1;
type ProviderUsageAuthToken = ProviderUsageAuthToken$1;
type ProviderResolveDynamicModelContext = ProviderResolveDynamicModelContext$1;
type ProviderResolveTransportTurnStateContext = ProviderResolveTransportTurnStateContext$1;
type ProviderResolveWebSocketSessionPolicyContext = ProviderResolveWebSocketSessionPolicyContext$1;
type ProviderSanitizeReplayHistoryContext = ProviderSanitizeReplayHistoryContext$1;
type ProviderTransportTurnState = ProviderTransportTurnState$1;
type ProviderToolSchemaDiagnostic = ProviderToolSchemaDiagnostic$1;
type ProviderResolveUsageAuthContext = ProviderResolveUsageAuthContext$1;
type ProviderThinkingProfile = ProviderThinkingProfile$1;
type ProviderThinkingPolicyContext = ProviderThinkingPolicyContext$1;
type ProviderValidateReplayTurnsContext = ProviderValidateReplayTurnsContext$1;
type ProviderWebSocketSessionPolicy = ProviderWebSocketSessionPolicy$1;
type ProviderWrapStreamFnContext = ProviderWrapStreamFnContext$1;
type UnifiedModelCatalogProviderContext = UnifiedModelCatalogProviderContext$1;
type UnifiedModelCatalogProviderPlugin = UnifiedModelCatalogProviderPlugin$1;
type OpenClawGatewayDiscoveryAdvertiseContext = OpenClawGatewayDiscoveryAdvertiseContext$1;
type OpenClawGatewayDiscoveryService = OpenClawGatewayDiscoveryService$1;
type SpeechProviderPlugin = SpeechProviderPlugin$1;
type PluginCommandContext = PluginCommandContext$1;
type PluginCommandResult = PluginCommandResult$1;
type PluginAgentEventEmitParams = PluginAgentEventEmitParams$1;
type PluginAgentEventEmitResult = PluginAgentEventEmitResult$1;
type PluginAgentEventSubscriptionRegistration = PluginAgentEventSubscriptionRegistration$1;
type PluginAgentTurnPrepareEvent = PluginAgentTurnPrepareEvent$1;
type PluginAgentTurnPrepareResult = PluginAgentTurnPrepareResult$1;
type PluginControlUiDescriptor = PluginControlUiDescriptor$1;
type PluginHeartbeatPromptContributionEvent = PluginHeartbeatPromptContributionEvent$1;
type PluginHeartbeatPromptContributionResult = PluginHeartbeatPromptContributionResult$1;
type PluginJsonValue = PluginJsonValue$1;
type PluginNextTurnInjection = PluginNextTurnInjection$1;
type PluginNextTurnInjectionEnqueueResult = PluginNextTurnInjectionEnqueueResult$1;
type PluginNextTurnInjectionRecord = PluginNextTurnInjectionRecord$1;
type PluginRunContextGetParams = PluginRunContextGetParams$1;
type PluginRunContextPatch = PluginRunContextPatch$1;
type PluginRuntimeLifecycleRegistration = PluginRuntimeLifecycleRegistration$1;
type PluginSessionActionContext = PluginSessionActionContext$1;
type PluginSessionActionRegistration = PluginSessionActionRegistration$1;
type PluginSessionActionResult = PluginSessionActionResult$1;
type PluginSessionAttachmentParams = PluginSessionAttachmentParams$1;
type PluginSessionAttachmentResult = PluginSessionAttachmentResult$1;
type PluginSessionSchedulerJobHandle = PluginSessionSchedulerJobHandle$1;
type PluginSessionSchedulerJobRegistration = PluginSessionSchedulerJobRegistration$1;
type PluginSessionTurnScheduleParams = PluginSessionTurnScheduleParams$1;
type PluginSessionTurnUnscheduleByTagParams = PluginSessionTurnUnscheduleByTagParams$1;
type PluginSessionTurnUnscheduleByTagResult = PluginSessionTurnUnscheduleByTagResult$1;
type PluginSessionExtensionRegistration = PluginSessionExtensionRegistration$1;
type PluginSessionExtensionProjection = PluginSessionExtensionProjection$1;
type PluginToolMetadataRegistration = PluginToolMetadataRegistration$1;
type PluginTrustedToolPolicyRegistration = PluginTrustedToolPolicyRegistration$1;
/** Options for a plugin entry that registers providers, tools, commands, or services. */
type DefinePluginEntryOptions = {
  id: string;
  name: string;
  description: string;
  /**
   * @deprecated Declare exclusive plugin kind in `openclaw.plugin.json` via
   * manifest `kind`. Runtime-entry `kind` remains only as a compatibility
   * fallback for older plugins.
   */
  kind?: OpenClawPluginDefinition["kind"];
  configSchema?: OpenClawPluginConfigSchema | (() => OpenClawPluginConfigSchema);
  reload?: OpenClawPluginDefinition["reload"];
  nodeHostCommands?: OpenClawPluginDefinition["nodeHostCommands"];
  securityAuditCollectors?: OpenClawPluginDefinition["securityAuditCollectors"];
  register: (api: OpenClawPluginApi) => void;
};
/** Normalized object shape that OpenClaw loads from a plugin entry module. */
type DefinedPluginEntry = {
  id: string;
  name: string;
  description: string;
  configSchema: OpenClawPluginConfigSchema;
  register: NonNullable<OpenClawPluginDefinition["register"]>;
} & Pick<OpenClawPluginDefinition, "kind" | "reload" | "nodeHostCommands" | "securityAuditCollectors">;
/**
 * Canonical entry helper for non-channel plugins.
 *
 * Use this for provider, tool, command, service, memory, and context-engine
 * plugins. Channel plugins should use `defineChannelPluginEntry(...)` from
 * `openclaw/plugin-sdk/core` so they inherit the channel capability wiring.
 */
declare function definePluginEntry({
  id,
  name,
  description,
  kind,
  configSchema,
  reload,
  nodeHostCommands,
  securityAuditCollectors,
  register
}: DefinePluginEntryOptions): DefinedPluginEntry;
//#endregion
export { PluginSessionAttachmentParams as $, ProviderThinkingProfile as $t, OpenClawPluginToolContext as A, ProviderNormalizeConfigContext as At, PluginHeartbeatPromptContributionEvent as B, ProviderReasoningOutputModeContext as Bt, OpenClawPluginNodeInvokePolicyContext as C, ProviderCatalogResult as Ct, OpenClawPluginSecurityAuditContext as D, ProviderFailoverErrorContext as Dt, OpenClawPluginSecurityAuditCollector as E, ProviderDiscoveryContext as Et, PluginAgentTurnPrepareEvent as F, ProviderPrepareDynamicModelContext as Ft, PluginNextTurnInjectionEnqueueResult as G, ProviderResolveConfigApiKeyContext as Gt, PluginJsonValue as H, ProviderReplayPolicyContext as Ht, PluginAgentTurnPrepareResult as I, ProviderPrepareExtraParamsContext as It, PluginRunContextPatch as J, ProviderResolveUsageAuthContext as Jt, PluginNextTurnInjectionRecord as K, ProviderResolveDynamicModelContext as Kt, PluginCommandContext as L, ProviderPrepareRuntimeAuthContext as Lt, PluginAgentEventEmitParams as M, ProviderNormalizeResolvedModelContext as Mt, PluginAgentEventEmitResult as N, ProviderNormalizeToolSchemasContext as Nt, OpenClawPluginService as O, ProviderFetchUsageSnapshotContext as Ot, PluginAgentEventSubscriptionRegistration as P, ProviderNormalizeTransportContext as Pt, PluginSessionActionResult as Q, ProviderThinkingPolicyContext as Qt, PluginCommandResult as R, ProviderPreparedRuntimeAuth as Rt, OpenClawPluginNodeInvokePolicy as S, ProviderCatalogContext as St, OpenClawPluginReloadRegistration as T, ProviderDeferSyntheticProfileAuthContext as Tt, PluginLogger as U, ProviderReplaySessionEntry as Ut, PluginHeartbeatPromptContributionResult as V, ProviderReplayPolicy as Vt, PluginNextTurnInjection as W, ProviderReplaySessionState as Wt, PluginSessionActionContext as X, ProviderResolvedUsageAuth as Xt, PluginRuntimeLifecycleRegistration as Y, ProviderResolveWebSocketSessionPolicyContext as Yt, PluginSessionActionRegistration as Z, ProviderSanitizeReplayHistoryContext as Zt, OpenClawPluginCommandDefinition as _, ProviderBuildMissingAuthMessageContext as _t, AnyAgentTool as a, ProviderWrapStreamFnContext as an, PluginSessionTurnScheduleParams as at, OpenClawPluginHttpRouteHandler as b, ProviderBuiltInModelSuppressionResult as bt, MigrationDetection as c, TranscriptSourceProvider as cn, PluginToolMetadataRegistration as ct, MigrationProviderContext as d, definePluginEntry as dn, ProviderAugmentModelCatalogContext as dt, ProviderToolSchemaDiagnostic as en, PluginSessionAttachmentResult as et, MigrationProviderPlugin as f, ProviderAuthContext as ft, OpenClawPluginApi as g, ProviderAuthResult as gt, OpenClawGatewayDiscoveryService as h, ProviderAuthMethodNonInteractiveContext as ht, AgentPromptSurfaceKind as i, ProviderWebSocketSessionPolicy as in, PluginSessionSchedulerJobRegistration as it, OpenClawPluginToolFactory as j, ProviderNormalizeModelIdContext as jt, OpenClawPluginServiceContext as k, ProviderModernModelPolicyContext as kt, MigrationItem as l, UnifiedModelCatalogProviderContext as ln, PluginTrustedToolPolicyRegistration as lt, OpenClawGatewayDiscoveryAdvertiseContext as m, ProviderAuthMethod as mt, AgentPromptGuidance as n, ProviderUsageAuthToken as nn, PluginSessionExtensionRegistration as nt, MediaUnderstandingProviderPlugin as o, RealtimeTranscriptionProviderPlugin as on, PluginSessionTurnUnscheduleByTagParams as ot, MigrationSummary as p, ProviderAuthDoctorHintContext as pt, PluginRunContextGetParams as q, ProviderResolveTransportTurnStateContext as qt, AgentPromptGuidanceEntry as r, ProviderValidateReplayTurnsContext as rn, PluginSessionSchedulerJobHandle as rt, MigrationApplyResult as s, SpeechProviderPlugin as sn, PluginSessionTurnUnscheduleByTagResult as st, AgentHarness as t, ProviderTransportTurnState as tn, PluginSessionExtensionProjection as tt, MigrationPlan as u, UnifiedModelCatalogProviderPlugin as un, ProviderApplyConfigDefaultsContext as ut, OpenClawPluginConfigSchema as v, ProviderBuildUnknownModelHintContext as vt, OpenClawPluginNodeInvokePolicyResult as w, ProviderDefaultThinkingPolicyContext as wt, OpenClawPluginNodeHostCommand as x, ProviderCacheTtlEligibilityContext as xt, OpenClawPluginDefinition as y, ProviderBuiltInModelSuppressionContext as yt, PluginControlUiDescriptor as z, ProviderReasoningOutputMode as zt };