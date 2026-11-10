import { On as PluginInstallRecord, Si as PluginManifestSetupProvider, _i as PluginManifestModelIdNormalizationProvider, ai as PluginDiagnostic, bi as PluginManifestProviderEndpoint, wi as ChannelAccountKeyPolicy, xi as PluginManifestProviderRequestProvider } from "./types-D7I_F5Ux.js";
import { t as SchemaContract } from "./schema-contract-v05QRSzC.js";
import "./openclaw-state-db-CsmosWKr.js";
import { c as PluginPackageInstall, i as PluginDiscoveryResult, n as PluginManifestRegistry, o as OpenClawPackageBuild, s as PluginPackageChannel, t as PluginManifestRecord } from "./manifest-registry-DcAsDGQ5.js";
import { z } from "zod";
//#region src/plugins/compat/registry-records.d.ts
declare const PLUGIN_COMPAT_RECORDS: readonly [...({
  readonly code: "agent-harness-sync-tool-construction";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-09-08";
  readonly deprecated: "2026-10-04";
  readonly warningStarts: "2026-10-04";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await hostCapabilities.createToolSurfaceAsync, createOpenClawCodingToolsAsync, or createAgentHarnessToolSurfaceRuntimeAsync with the existing arguments. Released synchronous factories retain their array results and completion timing through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#harness-tool-construction";
  readonly surfaces: readonly ["AgentHarnessHostCapabilities.createToolSurface", "openclaw/plugin-sdk/agent-harness.createOpenClawCodingTools", "openclaw/plugin-sdk/agent-harness-tool-runtime.createAgentHarnessToolSurfaceRuntime"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and migration documentation; bounded capability-family warnings on legacy preparation"];
  readonly tests: readonly ["src/plugin-sdk/agent-harness-async-compat.test.ts", "src/agents/harness/host-capability.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Harness tool construction exposes awaited factories that read fresh exec policy through the existing worker and preserve live host authority. Synchronous SDK factories remain compatible; stored data and update behavior are unchanged.";
} | {
  readonly code: "agent-harness-tool-argument-redaction";
  readonly status: "removed";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-10-11";
  readonly removeAfter: "2026-10-10";
  readonly replacement: "None; pass tool arguments unchanged. Secret masking belongs in diagnostics.";
  readonly docsPath: "/plugins/sdk-migration/removed-surfaces#tool-argument-redaction";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-harness-runtime.sanitizeToolArgs"];
  readonly diagnostics: readonly ["plugin SDK shipped-surface guard and migration guide"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "test/scripts/plugin-sdk-shipped-surface.test.ts"];
  readonly releaseNote: "Peter approved immediate removal of automatic tool argument and result masking on 2026-10-11. Drop sanitizeToolArgs imports and pass arguments unchanged; logging and diagnostic masking remains available.";
} | {
  readonly code: "agent-harness-sdk-alias";
  readonly status: "deprecated";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-04-24";
  readonly deprecated: "2026-04-25";
  readonly warningStarts: "2026-04-25";
  readonly replacement: "none yet; retain until a harness subpath ships and external migration is proven";
  readonly docsPath: "/plugins/sdk-agent-harness";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-harness", "openclaw/plugin-sdk/agent-harness-runtime"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/contracts/plugin-sdk-subpaths.test.ts"];
} | {
  readonly code: "agent-list-runtime-projection";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-07-27";
  readonly deprecated: "2026-10-02";
  readonly warningStarts: "2026-10-02";
  readonly removeAfter: "2027-01-02";
  readonly replacement: "Canonical `cfg.agents.entries`, or `listAgentIds` / `resolveAgentConfig` from `openclaw/plugin-sdk/agent-runtime`";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#agent-roster-config";
  readonly surfaces: readonly ["non-enumerable runtime OpenClawConfig.agents.list projection"];
  readonly diagnostics: readonly ["plugin compatibility registry and migration documentation; no runtime warnings"];
  readonly tests: readonly ["src/config/runtime-overrides.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The runtime agents.list projection introduced in #113146 remains untyped compatibility for plugins built against stable SDK releases through 2026.9.x; authored configs use agents.entries without default markers.";
} | {
  readonly code: "assistant-text-phase-terminal-hint";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-08-17";
  readonly deprecated: "2026-10-11";
  readonly warningStarts: "2026-10-11";
  readonly removalGate: "stable-deprecation-period";
  readonly replacement: "Omit textPhaseRequiresTerminal; unphased text is never retroactively classified.";
  readonly docsPath: "/concepts/streaming#text-phases-and-final-replies";
  readonly surfaces: readonly ["AssistantMessage.openclawDelivery.textPhaseRequiresTerminal"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotation; no runtime warning for the ignored field"];
  readonly tests: readonly ["src/plugin-sdk/assistant-message-compat.test.ts"];
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly deprecated: "2026-10-13";
  readonly warningStarts: "2026-10-13";
  readonly removeAfter: "2026-12-31";
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and actionable once-per-plugin-and-capability-family warnings per process on legacy use"];
  readonly code: "provider-model-capabilities-sync-read";
  readonly introduced: "2026-09-08";
  readonly replacement: "Await loadOpenRouterModelCapabilities(modelId), then read getLoadedOpenRouterModelCapabilities(modelId). The synchronous getter remains compatible through 2026-12-31; removal ships in the first January 2027 stable release.";
  readonly docsPath: "/plugins/sdk-migration/sqlite-async";
  readonly surfaces: readonly ["openclaw/plugin-sdk/provider-stream.getOpenRouterModelCapabilities", "openclaw/plugin-sdk/provider-stream-family.getOpenRouterModelCapabilities"];
  readonly tests: readonly ["src/agents/embedded-agent-runner/openrouter-model-capabilities.test.ts", "src/plugins/compat/registry.test.ts"];
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-13";
  readonly deprecated: "2026-10-13";
  readonly warningStarts: "2026-10-13";
  readonly removeAfter: "2026-12-31";
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and actionable once-per-plugin-and-capability-family warnings per process on legacy use"];
  readonly code: "session-store-sync-readers";
  readonly replacement: "Await getSessionEntryAsync, getConversationSessionAsync, readAmbientTranscriptWatermarkAsync, and loadTranscriptEvents. Synchronous readers retain their results during the stable deprecation period. Current entry lookup is not a substitute for historical transcript-key resolution.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-session-and-transcript-readers";
  readonly surfaces: readonly ["openclaw/plugin-sdk/session-store-runtime.getSessionEntry", "openclaw/plugin-sdk/session-store-runtime.getConversationSession", "openclaw/plugin-sdk/session-store-runtime.readAmbientTranscriptWatermark", "openclaw/plugin-sdk/session-store-runtime.loadTranscriptEventsSync", "api.runtime.agent.session.getSessionEntry", "api.runtime.agent.session.getConversationSession"];
  readonly tests: readonly ["src/plugin-sdk/session-store-runtime.async.test.ts", "src/plugins/compat/registry.test.ts"];
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-13";
  readonly deprecated: "2026-10-13";
  readonly warningStarts: "2026-10-13";
  readonly removeAfter: "2026-12-31";
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and actionable once-per-plugin-and-capability-family warnings per process on legacy use"];
  readonly code: "transcript-session-key-sync-resolution";
  readonly replacement: "Await resolveTranscriptSessionKeyBySessionIdAsync from session-store-runtime. It preserves exact historical session-window resolution, including session IDs no longer selected by the current entry.";
  readonly docsPath: "/plugins/sdk-migration/async-transcript-and-tts";
  readonly surfaces: readonly ["openclaw/plugin-sdk/session-store-runtime.resolveTranscriptSessionKeyBySessionId"];
  readonly tests: readonly ["src/plugin-sdk/session-store-runtime.async.test.ts", "src/plugins/compat/registry.test.ts"];
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-13";
  readonly deprecated: "2026-10-13";
  readonly warningStarts: "2026-10-13";
  readonly removeAfter: "2026-12-31";
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and actionable once-per-plugin-and-capability-family warnings per process on legacy use"];
  readonly code: "pending-input-sync-completion";
  readonly replacement: "Await SessionPendingInputReceipt.completeAsync or UserTurnTranscriptRecorder.completeProcessingAsync before publishing completion. Await waitForPendingInputSettlement when supplied before releasing session admission. Bundled plugins target the current host and use the async companions directly; do not retry async failures synchronously.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-session-transcript-persistence";
  readonly surfaces: readonly ["SessionPendingInputReceipt.complete", "UserTurnTranscriptRecorder.completeProcessing"];
  readonly tests: readonly ["src/config/sessions/session-pending-input-operations.test.ts", "src/plugins/compat/registry.test.ts"];
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-13";
  readonly deprecated: "2026-10-13";
  readonly warningStarts: "2026-10-13";
  readonly removeAfter: "2026-12-31";
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and actionable once-per-plugin-and-capability-family warnings per process on legacy use"];
  readonly code: "session-catalog-sync-preparation";
  readonly replacement: "Await readSessionTranscriptCatalogTitleAsync, prepareSessionCatalogSourceActorProjector, and prepareSessionCatalogGitHubLinker from session-transcript-runtime. Project the prepared facts synchronously and retain current disclosure authority at publication.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#prepare-session-catalog-identities";
  readonly surfaces: readonly ["openclaw/plugin-sdk/session-transcript-runtime.readSessionTranscriptCatalogTitle", "openclaw/plugin-sdk/session-transcript-runtime.createSessionCatalogSourceActorProjector", "openclaw/plugin-sdk/session-transcript-runtime.createSessionCatalogGitHubLinker"];
  readonly tests: readonly ["src/gateway/session-catalog-identity.test.ts", "src/plugins/compat/registry.test.ts"];
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-13";
  readonly deprecated: "2026-10-13";
  readonly warningStarts: "2026-10-13";
  readonly removeAfter: "2026-12-31";
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and actionable once-per-plugin-and-capability-family warnings per process on legacy use"];
  readonly code: "channel-policy-sync-preparation";
  readonly replacement: "Await resolveCommandAuthorizationAsync, resolveStoredModelOverrideAsync, resolveCommandArgMenuAsync, inspectConversationBindingAsync, and loadExecApprovalsReadOnlyAsync. Prepared results never replace live authorization at command execution or external side effects.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#migrate-inspection-authorization-and-approval-factories";
  readonly surfaces: readonly ["openclaw/plugin-sdk/command-auth-native.resolveCommandAuthorization", "openclaw/plugin-sdk/command-auth-native.resolveStoredModelOverride", "openclaw/plugin-sdk/command-auth-native.resolveCommandArgMenu", "openclaw/plugin-sdk/conversation-binding-inspection-runtime.inspectConversationBinding", "openclaw/plugin-sdk/exec-approvals-runtime.loadExecApprovals"];
  readonly tests: readonly ["src/plugin-sdk/command-auth-native.test.ts", "src/plugins/compat/registry.test.ts"];
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-13";
  readonly deprecated: "2026-10-13";
  readonly warningStarts: "2026-10-13";
  readonly removeAfter: "2026-12-31";
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and actionable once-per-plugin-and-capability-family warnings per process on legacy use"];
  readonly code: "approval-routing-sync-preparation";
  readonly replacement: "Use the Async-suffixed approval factories and resolvers, then await their returned eligibility and routing callbacks. Reuse resolveApprovalRequestSessionDeliveryAsync facts for one route decision. Factories remain synchronous; Async names describe their awaited callbacks. Keep live approval and delivery authority at the effect boundary.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#migrate-inspection-authorization-and-approval-factories";
  readonly surfaces: readonly ["openclaw/plugin-sdk/approval-delivery-runtime.createApproverRestrictedNativeApprovalCapability", "openclaw/plugin-sdk/approval-handler-runtime.createChannelApprovalNativeRuntimeAdapter", "openclaw/plugin-sdk/approval-handler-adapter-runtime.createLazyChannelApprovalNativeRuntimeAdapter", "openclaw/plugin-sdk/approval-delivery-runtime.createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutes", "openclaw/plugin-sdk/approval-native-runtime.createNativeApprovalChannelRouteGates", "openclaw/plugin-sdk/approval-native-runtime.createChannelNativeOriginTargetResolver", "openclaw/plugin-sdk/approval-client-runtime.createChannelExecApprovalProfile", "openclaw/plugin-sdk/approval-native-runtime.createChannelApproverDmTargetResolver", "openclaw/plugin-sdk/approval-native-runtime.createNativeApprovalForwardingFallbackSuppressor", "openclaw/plugin-sdk/approval-runtime.resolveExecApprovalSessionTarget", "openclaw/plugin-sdk/approval-runtime.resolveApprovalRequestSessionTarget", "openclaw/plugin-sdk/approval-runtime.resolveApprovalRequestOriginTarget", "openclaw/plugin-sdk/approval-native-runtime.resolveApprovalRequestAccountId", "openclaw/plugin-sdk/approval-native-runtime.resolveApprovalRequestChannelAccountId", "openclaw/plugin-sdk/approval-runtime.doesApprovalRequestMatchChannelAccount", "openclaw/plugin-sdk/approval-native-runtime.doesApprovalRequestSelectChannelAccount"];
  readonly tests: readonly ["src/plugin-sdk/approval-native-helpers.test.ts", "src/plugin-sdk/approval-delivery-helpers.test.ts", "src/plugins/compat/registry.test.ts"];
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-13";
  readonly deprecated: "2026-10-13";
  readonly warningStarts: "2026-10-13";
  readonly removeAfter: "2026-12-31";
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and actionable once-per-plugin-and-capability-family warnings per process on legacy use"];
  readonly code: "debug-proxy-sync-capture";
  readonly replacement: "Acquire acquireDebugProxyCaptureStoreAsync, await store operations, and await lease.release in finally. Use createDebugProxyCaptureReaderAsync and await reads. Use initializeDebugProxyCaptureAsync, captureHttpExchangeAsync, captureWsEventAsync, and finalizeDebugProxyCaptureAsync, including the context captureWsEventAsync companion. Do not fire and forget persistence or fall back after an async failure.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-debug-proxy-capture";
  readonly surfaces: readonly ["openclaw/plugin-sdk/proxy-capture.DebugProxyCaptureReader", "openclaw/plugin-sdk/proxy-capture.DebugProxyCaptureStore", "openclaw/plugin-sdk/proxy-capture.getDebugProxyCaptureStore", "openclaw/plugin-sdk/proxy-capture.acquireDebugProxyCaptureStore", "openclaw/plugin-sdk/proxy-capture.closeDebugProxyCaptureStore", "openclaw/plugin-sdk/proxy-capture.createDebugProxyCaptureReader", "openclaw/plugin-sdk/proxy-capture.initializeDebugProxyCapture", "openclaw/plugin-sdk/proxy-capture.captureHttpExchange", "openclaw/plugin-sdk/proxy-capture.captureWsEvent", "openclaw/plugin-sdk/proxy-capture.finalizeDebugProxyCapture", "DebugProxyCaptureContext.captureWsEvent"];
  readonly tests: readonly ["src/proxy-capture/store.async.test.ts", "src/proxy-capture/runtime.lifecycle.test.ts", "src/plugins/compat/registry.test.ts"];
} | {
  readonly code: "auth-profile-sync-operations";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-01";
  readonly deprecated: "2026-10-11";
  readonly warningStarts: "2026-10-11";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await the Async-suffixed auth-store, snapshot-publication, AuthStorage, profile-upsert, provider-availability, profile-metadata, model-auth, model-header, provider-selection, and TTS methods. For secret-read preparation, use loadAuthProfileStoreForRuntimeAsync from agent-runtime with readOnly: true and allowKeychainPrompt: false. Replace saveAuthProfileStore with the owner-backed updateAuthProfileStoreWithLock from provider-auth. Public database-path displays retire after 2026-12-31 with no public async path replacement; display provider/profile identifiers instead. Bundled callers use AuthStorage.resolvePathForDisplayAsync from the private agent-sessions surface for exact selected paths. Use resolveProviderAuthProfileMetadataAsync from provider-auth-runtime for profile metadata. Implement isConfiguredAsync for media, speech, and realtime providers, and resolveConfigAsync for realtime voice providers. For internal realtime hooks, implement isBrowserSessionConfiguredAsync, isGatewayRelayConfiguredAsync, and resolveBrowserSessionCapabilitiesAsync. Released synchronous methods retain their signatures, immediate results, and completion timing through 2026-12-31; removal ships in the first January 2027 stable release.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-auth-profile-and-provider-availability-operations";
  readonly surfaces: readonly ["openclaw/plugin-sdk/provider-auth ensureAuthProfileStore", "openclaw/plugin-sdk/provider-auth ensureAuthProfileStoreForLocalUpdate", "openclaw/plugin-sdk/provider-auth upsertAuthProfile", "openclaw/plugin-sdk/provider-auth upsertApiKeyProfile", "openclaw/plugin-sdk/provider-auth-api-key upsertApiKeyProfile", "openclaw/plugin-sdk/provider-auth isProviderApiKeyConfigured", "openclaw/plugin-sdk/provider-auth isProviderAuthProfileConfigured", "openclaw/plugin-sdk/provider-auth listUsableProviderAuthProfileIds", "openclaw/plugin-sdk/provider-auth-runtime resolveProviderAuthProfileMetadata", "openclaw/plugin-sdk/agent-runtime ensureAuthProfileStore", "openclaw/plugin-sdk/agent-runtime loadAuthProfileStoreWithoutExternalProfiles", "openclaw/plugin-sdk/agent-runtime loadAuthProfileStoreForRuntime", "openclaw/plugin-sdk/agent-runtime replaceRuntimeAuthProfileStoreSnapshots", "openclaw/plugin-sdk/agent-runtime loadAuthProfileStoreForSecretsRuntime", "openclaw/plugin-sdk/agent-runtime saveAuthProfileStore", "openclaw/plugin-sdk/agent-runtime resolveAuthStorePathForDisplay", "openclaw/plugin-sdk/agent-runtime findPersistedAuthProfileCredential", "openclaw/plugin-sdk/agent-runtime resolvePersistedAuthProfileOwnerAgentDir", "openclaw/plugin-sdk/agent-sessions ModelRegistry.create", "openclaw/plugin-sdk/agent-sessions ModelRegistry.refresh", "openclaw/plugin-sdk/agent-sessions ModelRegistry.unregisterProvider", "openclaw/plugin-sdk/agent-sessions AuthStorage.forAgent", "openclaw/plugin-sdk/agent-sessions AuthStorage.create", "openclaw/plugin-sdk/agent-sessions AuthStorage.reload", "openclaw/plugin-sdk/agent-sessions AuthStorage.set", "openclaw/plugin-sdk/agent-sessions AuthStorage.remove", "openclaw/plugin-sdk/agent-sessions AuthStorage.logout", "openclaw/plugin-sdk/agent-harness-runtime resolveModelAuthMode", "openclaw/plugin-sdk/models-provider-runtime formatModelsAvailableHeader", "openclaw/plugin-sdk/image-generation-core resolveCapabilityModelCandidates", "openclaw/plugin-sdk/provider-selection-runtime resolveConfiguredCapabilityProvider", "openclaw/plugin-sdk/realtime-voice resolveConfiguredRealtimeVoiceProvider", "openclaw/plugin-sdk/tts-runtime getTtsProvider", "openclaw/plugin-sdk/tts-runtime isTtsProviderConfigured", "openclaw/plugin-sdk/tts-runtime resolveExplicitTtsOverrides", "openclaw/plugin-sdk/agent-runtime getTtsProvider", "PluginRuntime.modelAuth.ensureAuthProfileStore", "PluginRuntime.modelAuth.isProviderApiKeyConfigured", "PluginRuntime.agent.resolveCliBackendDispatchEligibility", "ImageGenerationProvider.isConfigured", "MusicGenerationProvider.isConfigured", "VideoGenerationProvider.isConfigured", "SpeechProviderPlugin.isConfigured", "RealtimeTranscriptionProviderPlugin.isConfigured", "RealtimeVoiceProviderPlugin.isConfigured", "RealtimeVoiceProviderPlugin.resolveConfig", "InternalRealtimeVoiceProviderApi.isBrowserSessionConfigured", "InternalRealtimeVoiceProviderApi.isGatewayRelayConfigured", "InternalRealtimeVoiceProviderApi.resolveBrowserSessionCapabilities"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and migration documentation", "Synchronous auth storage entrypoints warn once per plugin and capability family on use"];
  readonly tests: readonly ["src/agents/auth-profiles.sqlite-store.test.ts", "src/plugin-sdk/provider-auth-runtime.test.ts", "src/agents/sessions/auth-storage.test.ts", "src/agents/auth-profiles/paths-direct-import.test.ts", "src/agents/embedded-agent-runner/cli-backend-dispatch.test.ts", "src/media-generation/runtime-shared.test.ts", "src/plugin-sdk/provider-selection-runtime.test.ts", "src/talk/provider-resolver.test.ts", "src/tts/provider-registry.test.ts", "src/tts/tts-runtime-personas.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Auth-profile reads and writes, provider availability, and model selection use the existing database workers. Bundled callers await the new APIs; released synchronous contracts remain supported through 2026-12-31. Stored data, schemas, and update behavior are unchanged.";
} | {
  readonly code: "conversation-binding-sync-persistence";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-09-08";
  readonly deprecated: "2026-10-09";
  readonly warningStarts: "2026-10-09";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Use createAccountScopedConversationBindingManagerV2, iMessage createIMessageConversationBindingManagerV2, registerSessionBindingAdapterV2, and awaited service list/resolve/touch methods. V2 adapters supply a coherent inspection snapshot with its current-source assertion. Legacy synchronous operations preserve completion and expiry semantics through 2026-12-31; removal ships in the first January 2027 stable release.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-plugin-state-and-conversation-bindings";
  readonly surfaces: readonly ["openclaw/plugin-sdk/thread-bindings-runtime.createAccountScopedConversationBindingManager", "@openclaw/imessage api.createIMessageConversationBindingManager", "AccountScopedConversationBindingManager.getByConversationId", "AccountScopedConversationBindingManager.listBySessionKey", "AccountScopedConversationBindingManager.bindConversation", "AccountScopedConversationBindingManager.touchConversation", "AccountScopedConversationBindingManager.unbindConversation", "AccountScopedConversationBindingManager.unbindBySessionKey", "SessionBindingAdapter.listBySession", "SessionBindingAdapter.inspectByConversation", "openclaw/plugin-sdk/conversation-runtime.registerSessionBindingAdapter", "SessionBindingService.listBySession", "SessionBindingService.resolveByConversation", "SessionBindingService.touch", "openclaw/plugin-sdk/session-binding-runtime.inspectSessionBindingByConversation", "openclaw/plugin-sdk/conversation-runtime.resolveRuntimeConversationBindingRoute"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and one shared runtime warning per plugin and capability family on legacy use"];
  readonly tests: readonly ["src/plugin-sdk/state-binding.released-compat.test.ts", "src/infra/outbound/session-binding-service.async-read.test.ts", "src/infra/outbound/current-conversation-bindings.worker.test.ts", "src/infra/outbound/account-scoped-conversation-bindings.test.ts"];
  readonly releaseNote: "Bundled conversation bindings await worker-owned mutations and expiry reads. Released synchronous adapters remain compatible; storage formats, retention, and update behavior are unchanged.";
} | {
  readonly code: "native-session-binding-sync-persistence";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-09-08";
  readonly deprecated: "2026-10-09";
  readonly warningStarts: "2026-10-09";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Use createNativeSessionBindingLifecycleV2 and resolvePreparedNativeSessionBinding with the worker-backed binding store, and release the prepared capture after terminal cleanup. Implement AgentHarness.resolveSessionRuntimeOwnershipAsync for preparation. Released synchronous authority factories remain deprecated compatibility adapters.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-plugin-state-and-conversation-bindings";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-harness-session-runtime.createNativeSessionBindingLifecycle", "openclaw/plugin-sdk/agent-harness-session-runtime.NativeSessionBindingStateStore", "openclaw/plugin-sdk/agent-harness-session-runtime.resolveNativeSessionBindingWithAuthority", "AgentHarness.resolveSessionRuntimeOwnership"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and the shared per-plugin capability-family warning budget"];
  readonly tests: readonly ["extensions/codex/harness.test.ts", "src/agents/embedded-agent-runner/run/model-setup.ownership.test.ts", "src/gateway/session-row-projection.worker-read.test.ts"];
  readonly releaseNote: "Native harness binding preparation and ordinary durable settlement use workers. Host-selected initialization, incognito, and mixed legacy deletion transactions retain their explicit native atomic settlement; no schema or update migration is required.";
} | {
  readonly code: "approval-event-sync-publication";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-09-08";
  readonly deprecated: "2026-10-10";
  readonly warningStarts: "2026-10-10";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await approvalEvents.publishRequestedAsync. The legacy publisher retains synchronous delivery counts for synchronous subscribers and refuses async eligibility before delivery; removed in the first January 2027 stable release after the final compatibility day, 2026-12-31.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-gateway-approval-publication";
  readonly surfaces: readonly ["GatewayRequestHandlerOptions.context.approvalEvents.publishRequested"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotation and the shared capability-family warning"];
  readonly tests: readonly ["src/gateway/server-instance-runtime.test.ts", "src/plugin-sdk/state-binding.released-compat.test.ts"];
  readonly releaseNote: "Gateway approval publication awaits native eligibility while retaining the released synchronous publisher type and old publisher objects.";
} | {
  readonly code: "channel-pairing-sync-allowlist";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-04-03";
  readonly deprecated: "2026-10-03";
  readonly warningStarts: "2026-10-03";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await readChannelAllowFromStore from channel-pairing. The released synchronous reader retains its signature and native behavior through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#channel-pairing-allowlists";
  readonly surfaces: readonly ["openclaw/plugin-sdk/channel-pairing.readChannelAllowFromStoreSync"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotation and migration documentation; bounded capability-family warnings on legacy preparation"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugin-sdk/channel-pairing-allowlist.test.ts", "src/pairing/pairing-allowlist.worker.test.ts"];
  readonly releaseNote: "Channel ingress reads pairing allowlists through the shared-state reader. Bundled callers await the existing async API; the synchronous SDK reader remains compatible. Missing-store reads grant no permission and no longer initialize storage.";
} | {
  readonly code: "cron-store-sync-path";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-11";
  readonly deprecated: "2026-10-11";
  readonly warningStarts: "2026-10-11";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await resolveCronStorePathAsync(storePath) from openclaw/plugin-sdk/cron-store-runtime. The synchronous resolveCronStorePath(storePath) retains its existing return value through 2026-12-31; removal ships in the first January 2027 stable release.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#cron-store-path-resolution";
  readonly surfaces: readonly ["openclaw/plugin-sdk/cron-store-runtime resolveCronStorePath"];
  readonly diagnostics: readonly ["Bounded DEP_PLUGIN_SDK warning for synchronous cron path resolution"];
  readonly tests: readonly ["src/plugin-sdk/cron-store-compat.test.ts", "src/cron/store/config-state.test.ts"];
  readonly releaseNote: "Runtime cron path selection uses the shared-state worker. Plugins can await resolveCronStorePathAsync; synchronous path resolution remains supported with a deprecation warning. Stored cron data and update behavior are unchanged.";
} | {
  readonly code: "memory-session-sync-inventory";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-08-09";
  readonly deprecated: "2026-10-01";
  readonly warningStarts: "2026-10-01";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await loadArchivedSessionsAsync and resolveMemorySessionTargetsAsync from memory-core-host-engine-sessions. Synchronous readers retain their existing signatures and results through 2026-12-31.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#memory-session-inventory-readers";
  readonly surfaces: readonly ["openclaw/plugin-sdk/memory-core-host-engine-sessions.loadArchivedSessions", "openclaw/plugin-sdk/memory-core-host-engine-sessions.resolveMemorySessionTargets"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations, migration documentation, and a runtime warning once per plugin and family"];
  readonly tests: readonly ["src/plugin-sdk/memory-core-host-engine-sessions.test.ts", "src/plugins/compat/registry.test.ts", "extensions/memory-core/src/memory-forget.sources.test.ts"];
  readonly releaseNote: "Memory archive discovery and forget target selection can be awaited through worker-backed SDK readers; synchronous readers remain compatible through 2026-12-31.";
} | {
  readonly code: "memory-session-sync-metadata";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-08-26";
  readonly deprecated: "2026-10-11";
  readonly warningStarts: "2026-10-11";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await loadMemorySessionMetadataAsync and loadMemorySessionMetadataBatchAsync from memory-core-host-engine-sessions. Bundled ingestion uses the history worker; the synchronous metadata reader retains its signature through 2026-12-31.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#memory-session-inventory-readers";
  readonly surfaces: readonly ["openclaw/plugin-sdk/memory-core-host-engine-sessions.loadMemorySessionMetadata"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations, migration documentation, and one shared DEP_PLUGIN_SDK warning per plugin and memory-session family on main-thread legacy use"];
  readonly tests: readonly ["src/plugin-sdk/memory-core-host-engine-sessions.test.ts", "src/plugins/compat/registry.test.ts", "extensions/memory-core/src/session-ingestion.test.ts"];
  readonly releaseNote: "Memory metadata readers have awaited replacements backed by the history worker; bundled ingestion no longer reads SQLite on the Gateway thread.";
} | {
  readonly code: "mention-inbox-sync-persistence";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-03";
  readonly deprecated: "2026-10-03";
  readonly warningStarts: "2026-10-03";
  readonly removalGate: "stable-deprecation-period";
  readonly replacement: "Await mentionInbox.listAsync(client, publish), mentionInbox.dismissAsync(client, ids, publish), mentionInbox.recordCommittedInputAsync(input), and mentionInbox.invalidateAsync(sessionKey). Publish list/dismiss responses synchronously inside the supplied callback. Deprecated synchronous signatures remain until an announced later ordinary stable release; list/dismiss return UNAVAILABLE, invalidate throws migration guidance, and recordCommittedInput queues the worker operation after commit.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-mention-inbox-operations";
  readonly surfaces: readonly ["GatewayRequestHandlerOptions.context.mentionInbox.list", "GatewayRequestHandlerOptions.context.mentionInbox.dismiss", "GatewayRequestHandlerOptions.context.mentionInbox.recordCommittedInput", "GatewayRequestHandlerOptions.context.mentionInbox.invalidate", "getPluginRuntimeGatewayRequestScope().context.mentionInbox"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations, explicit migration-directed rejection, and one DEP_SESSION_PERSISTENCE warning per plugin and capability family per process; unscoped callers share one SDK-level family warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugins/compat/mention-inbox-deprecation.test.ts", "src/plugin-sdk/gateway-mention-inbox-compat.test.ts", "src/gateway/mention-inbox.test.ts", "src/gateway/mention-inbox.compat.test.ts"];
  readonly releaseNote: "Mention Inbox reads, dismissals, recording, and invalidation expose awaited worker-backed methods. Synchronous list/dismiss return UNAVAILABLE and invalidate throws with awaited migration guidance. Legacy recording queues the worker operation after an enclosing commit; await recordCommittedInputAsync for completion. Their TypeScript signatures remain deprecated until an announced later ordinary stable release; stored data, retention, and update behavior are unchanged.";
} | {
  readonly code: "model-account-connect-sync-persistence";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-03";
  readonly deprecated: "2026-10-03";
  readonly warningStarts: "2026-10-03";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await modelAccountConnectService.listLinksAsync, linkAsync, unlinkAsync, listAsync, selectAsync, statusAsync, and cancelAsync with the existing arguments. Retain synchronous methods and their completion timing for shipped third-party contracts through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-personal-model-account-operations";
  readonly surfaces: readonly ["GatewayRequestHandlerOptions.context.modelAccountConnectService.listLinks", "GatewayRequestHandlerOptions.context.modelAccountConnectService.link", "GatewayRequestHandlerOptions.context.modelAccountConnectService.unlink", "GatewayRequestHandlerOptions.context.modelAccountConnectService.list", "GatewayRequestHandlerOptions.context.modelAccountConnectService.select", "GatewayRequestHandlerOptions.context.modelAccountConnectService.status", "GatewayRequestHandlerOptions.context.modelAccountConnectService.cancel", "getPluginRuntimeGatewayRequestScope().context.modelAccountConnectService"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and one DEP_SESSION_PERSISTENCE warning per plugin and capability family per process; unscoped callers share one SDK-level family warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugins/compat/model-account-connect-deprecation.test.ts", "src/plugin-sdk/gateway-model-account-connect-compat.test.ts", "src/gateway/server-methods/users-auth-connect.test.ts"];
  readonly releaseNote: "Personal model-account control-plane operations expose awaited worker-backed methods. Synchronous plugin methods retain their existing arguments, return values, and completion timing through 2026-12-31; RPC envelopes, stored data, retention, and update behavior are unchanged.";
} | {
  readonly code: "native-approval-commit-guard";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-09-04";
  readonly deprecated: "2026-10-09";
  readonly warningStarts: "2026-10-09";
  readonly removalGate: "stable-deprecation-period";
  readonly replacement: "Use host-bound api.runtime.gateway.request approval methods. Released opaque approval commit guards run at the worker precommit boundary; they cannot read uncommitted transaction state. Final effect-time authority checks remain synchronous and current.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#use-worker-owned-approval-requests";
  readonly surfaces: readonly ["GatewayRequestHandlerOptions.sessionMutationCommitGuard for approval methods"];
  readonly diagnostics: readonly ["Shared per-plugin capability-family warning on legacy callback use"];
  readonly tests: readonly ["src/plugin-sdk/exec-approval-compat.test.ts", "src/gateway/server-plugin-in-process-dispatch.commit-guards.test.ts"];
  readonly releaseNote: "Bundled approval requests, including reads that expire rows, execute in workers; released opaque commit guards use the same worker precommit boundary.";
} | {
  readonly code: "plugin-sdk-private-runtime-shipped-exports";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-15";
  readonly deprecated: "2026-10-15";
  readonly warningStarts: "2026-10-15";
  readonly removeAfter: "2027-01-15";
  readonly replacement: "Import the helper from a typed public SDK subpath that exports it, or keep a plugin-local copy; these JavaScript-only runtime facades are not a typed third-party contract";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#private-runtime-facade-exports";
  readonly surfaces: readonly ["openclaw/plugin-sdk/acp-runtime.getAcpRuntimeBackend", "openclaw/plugin-sdk/approval-reaction-runtime.readApprovalReactionDeliveryMetadata", "openclaw/plugin-sdk/fetch-runtime.hasEnvHttpProxyConfigured", "openclaw/plugin-sdk/image-generation-core.resolveAgentModelPrimaryValue", "openclaw/plugin-sdk/image-generation-core.resolveApiKeyForProvider", "openclaw/plugin-sdk/memory-core-host-engine-embeddings.fetchRemoteEmbeddingVectors", "openclaw/plugin-sdk/memory-core-host-engine-embeddings.listMemoryEmbeddingProviders", "openclaw/plugin-sdk/memory-core-host-engine-storage.chunkMarkdown", "openclaw/plugin-sdk/memory-core-host-engine-storage.ensureDir", "openclaw/plugin-sdk/memory-core-host-runtime-files.listMemoryFiles", "openclaw/plugin-sdk/memory-core-host-runtime-files.normalizeExtraMemoryPaths", "openclaw/plugin-sdk/poll-runtime.resolvePollMaxSelections", "openclaw/plugin-sdk/provider-stream.createOpenRouterSystemCacheWrapper", "openclaw/plugin-sdk/provider-stream.resolveMoonshotThinkingType", "openclaw/plugin-sdk/provider-web-fetch.enablePluginInConfig", "openclaw/plugin-sdk/provider-web-fetch.jsonResult", "openclaw/plugin-sdk/provider-web-fetch.withTrustedWebToolsEndpoint", "openclaw/plugin-sdk/provider-web-fetch.wrapExternalContent", "openclaw/plugin-sdk/provider-web-fetch.wrapWebContent", "openclaw/plugin-sdk/provider-web-search.DEFAULT_TIMEOUT_SECONDS", "openclaw/plugin-sdk/provider-web-search.markdownToText", "openclaw/plugin-sdk/provider-web-search.setScopedCredentialValue", "openclaw/plugin-sdk/provider-web-search.setTopLevelCredentialValue", "openclaw/plugin-sdk/retry-runtime.createRateLimitRetryRunner", "openclaw/plugin-sdk/speech.readResponseTextLimited", "openclaw/plugin-sdk/speech.truncateErrorDetail", "openclaw/plugin-sdk/thread-bindings-runtime.resolveThreadBindingConversationIdFromBindingId", "openclaw/plugin-sdk/thread-bindings-runtime.resolveThreadBindingFarewellText", "openclaw/plugin-sdk/thread-bindings-runtime.resolveThreadBindingLifecycle"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and the private runtime shipped-export contract test"];
  readonly tests: readonly ["src/plugin-sdk/private-runtime-shipped-exports.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Runtime exports that published plugins import from JavaScript-only `openclaw/plugin-sdk/*` facades, such as `readApprovalReactionDeliveryMetadata`, are restored after 2026.10.5 betas removed them; they remain deprecated through 2027-01-15.";
} | {
  code: "plugin-sdk-advertised-lan-host" | "plugin-sdk-allowlist-resolution-entry-mapper" | "plugin-sdk-computer-use-validator-compiler" | "plugin-sdk-json-file-fallback-reader" | "plugin-sdk-persistent-dedupe-legacy-json-migration" | "plugin-sdk-provider-auth-copilot-helpers" | "plugin-sdk-secret-input-mode-normalizer" | "plugin-sdk-stoppable-passive-monitor";
  status: "removed";
  owner: "channel" | "provider" | "sdk";
  introduced: string;
  removeAfter: "2026-10-01" | "2026-10-04";
  replacement: "None; advertised LAN host discovery is host-owned and has no public SDK replacement." | "None; plugins that read JSON artifacts must own parsing, fallback, and file-existence handling." | "None; project BasicAllowlistResolutionEntry fields in the consuming plugin." | "None; the legacy JSON migration was retired. Runtime dedupe continues through the SQLite-backed persistent-dedupe APIs." | "None; validate plugin-owned input as the exported SecretInputMode values plaintext or ref." | "Provider-local auth APIs for GitHub Copilot; none in the public SDK. Third-party plugins must own their provider-specific token exchange and caching." | "Use Compile(schema).Check from `typebox/compile` with the schemas exported by `openclaw/plugin-sdk/computer-use`." | "Use `openclaw/plugin-sdk/channel-outbound.runPassiveAccountLifecycle` with stop: (monitor) => monitor.stop().";
  docsPath: string;
  surfaces: string[];
  diagnostics: string[];
  tests: string[];
  releaseNote: string;
} | {
  code: "plugin-sdk-agent-config-primitives-subpath" | "plugin-sdk-channel-lifecycle-subpath" | "plugin-sdk-channel-logging-subpath" | "plugin-sdk-channel-message-subpath" | "plugin-sdk-channel-reply-pipeline-subpath" | "plugin-sdk-channel-secret-runtime-subpath" | "plugin-sdk-channel-streaming-subpath" | "plugin-sdk-command-auth-subpath" | "plugin-sdk-config-runtime-subpath" | "plugin-sdk-discord-subpath" | "plugin-sdk-group-access-subpath" | "plugin-sdk-inbound-reply-dispatch-subpath" | "plugin-sdk-infra-runtime-subpath" | "plugin-sdk-matrix-subpath" | "plugin-sdk-telegram-account-subpath" | "plugin-sdk-text-runtime-subpath" | "plugin-sdk-zod-subpath";
  owner: "channel" | "config" | "sdk";
  introduced: string;
  replacement: "`api.pluginConfig`, `openclaw/plugin-sdk/config-mutation`, `openclaw/plugin-sdk/runtime-config-snapshot`, and `openclaw/plugin-sdk/config-contracts`" | "`openclaw/plugin-sdk/channel-config-schema`" | "`openclaw/plugin-sdk/channel-inbound` and `openclaw/plugin-sdk/channel-outbound`" | "`openclaw/plugin-sdk/channel-ingress-runtime`" | "`openclaw/plugin-sdk/channel-ingress-runtime` for sender authorization; matching named exports from `openclaw/plugin-sdk/command-auth-native`, `openclaw/plugin-sdk/command-status`, `openclaw/plugin-sdk/models-provider-runtime`, and `openclaw/plugin-sdk/channel-inbound`; adapt legacy authorization types to the ingress contract" | "`openclaw/plugin-sdk/channel-outbound`" | "`openclaw/plugin-sdk/channel-outbound` and `openclaw/plugin-sdk/channel-inbound`" | "`openclaw/plugin-sdk/channel-secret-basic-runtime` and `openclaw/plugin-sdk/channel-secret-tts-runtime`" | "`openclaw/plugin-sdk/logging-core`, `openclaw/plugin-sdk/text-chunking`, `openclaw/plugin-sdk/text-utility-runtime`, and `openclaw/plugin-sdk/string-coerce-runtime`" | "`openclaw/plugin-sdk/run-command`" | "focused typed subpaths including `openclaw/plugin-sdk/system-event-runtime`, `openclaw/plugin-sdk/error-runtime`, `openclaw/plugin-sdk/approval-runtime`, and `openclaw/plugin-sdk/ssrf-runtime`; use injected runtime APIs for host operations without a public subpath" | "generic channel contracts and injected runtime helpers for external plugins; the Telegram plugin's `api.ts` for repository consumers" | "matching named exports from `openclaw/plugin-sdk/channel-contract`, `openclaw/plugin-sdk/channel-core`, `openclaw/plugin-sdk/channel-plugin-common`, `openclaw/plugin-sdk/channel-status`, or `openclaw/plugin-sdk/config-contracts`; external plugins use generic channel contracts and the injected runtime for channel-owned behavior" | "the direct `zod` package import";
  docsPath: string;
  surfaces: string[];
  tests: string[];
  status: "removed";
  removeAfter: "2026-09-30" | "2026-10-01" | undefined;
  diagnostics: string[];
  releaseNote: "The deprecated `agent-config-primitives` Plugin SDK subpath was removed; plugins now use maintained config-schema primitives." | "The deprecated `channel-lifecycle` Plugin SDK facade was removed in e649be315d751c0f633209f75e9adaa47681727c by the approved September 30 retirement; migrate to `openclaw/plugin-sdk/channel-outbound`." | "The deprecated `channel-logging` Plugin SDK subpath was removed; channel logging helpers now come from the inbound and outbound channel surfaces." | "The deprecated `channel-message` Plugin SDK facade was removed in e649be315d751c0f633209f75e9adaa47681727c by the approved September 30 retirement; migrate to `openclaw/plugin-sdk/channel-outbound` and `openclaw/plugin-sdk/channel-inbound`." | "The deprecated `channel-reply-pipeline` Plugin SDK facade was removed in e649be315d751c0f633209f75e9adaa47681727c by the approved September 30 retirement; migrate to `openclaw/plugin-sdk/channel-outbound`." | "The deprecated `channel-secret-runtime` Plugin SDK subpath was removed; plugins now use the focused basic and TTS secret-runtime subpaths." | "The deprecated `channel-streaming` Plugin SDK subpath was removed; plugins now import channel streaming helpers from `channel-outbound`." | "The deprecated `command-auth` Plugin SDK facade was removed in 0d530ea5b0a991735c14e0e6e9711bd26c0c6d7d with SDK-owner approval on October 2, 2026; migrate to focused command and channel contracts as described in the import-path reference." | "The deprecated `config-runtime` Plugin SDK facade was removed in e649be315d751c0f633209f75e9adaa47681727c by the approved September 30 retirement; migrate to `api.pluginConfig`, `openclaw/plugin-sdk/config-mutation`, `openclaw/plugin-sdk/runtime-config-snapshot`, and `openclaw/plugin-sdk/config-contracts`." | "The deprecated `discord` Plugin SDK facade was removed in 0d530ea5b0a991735c14e0e6e9711bd26c0c6d7d with SDK-owner approval on October 2, 2026; repository consumers use the Discord plugin's `api.ts` / `runtime-api.ts`, while external plugins use generic channel contracts and the injected runtime." | "The deprecated `group-access` Plugin SDK subpath was removed; plugins now resolve message admission through `channel-ingress-runtime`." | "The deprecated `infra-runtime` Plugin SDK facade was removed in e649be315d751c0f633209f75e9adaa47681727c by the approved September 30 retirement; migrate to focused typed subpaths including `openclaw/plugin-sdk/system-event-runtime`, `openclaw/plugin-sdk/error-runtime`, `openclaw/plugin-sdk/approval-runtime`, and `openclaw/plugin-sdk/ssrf-runtime`; use injected runtime APIs for host operations without a public subpath." | "The deprecated `matrix` Plugin SDK facade was removed; command execution now uses the generic `run-command` subpath." | "The deprecated `telegram-account` Plugin SDK facade was removed in 0d530ea5b0a991735c14e0e6e9711bd26c0c6d7d with SDK-owner approval on October 2, 2026; migrate account resolution and types to generic channel contracts and injected runtime helpers." | "The deprecated `text-runtime` Plugin SDK facade was removed; plugins now import logging, chunking, text utility, and string coercion helpers from their focused subpaths." | "The deprecated `zod` Plugin SDK re-export was removed; plugins now import `zod` directly.";
} | {
  code: "plugin-sdk-agent-config-primitives-subpath" | "plugin-sdk-channel-lifecycle-subpath" | "plugin-sdk-channel-logging-subpath" | "plugin-sdk-channel-message-subpath" | "plugin-sdk-channel-reply-pipeline-subpath" | "plugin-sdk-channel-secret-runtime-subpath" | "plugin-sdk-channel-streaming-subpath" | "plugin-sdk-command-auth-subpath" | "plugin-sdk-config-runtime-subpath" | "plugin-sdk-discord-subpath" | "plugin-sdk-group-access-subpath" | "plugin-sdk-inbound-reply-dispatch-subpath" | "plugin-sdk-infra-runtime-subpath" | "plugin-sdk-matrix-subpath" | "plugin-sdk-telegram-account-subpath" | "plugin-sdk-text-runtime-subpath" | "plugin-sdk-zod-subpath";
  owner: "channel" | "config" | "sdk";
  introduced: string;
  replacement: "`api.pluginConfig`, `openclaw/plugin-sdk/config-mutation`, `openclaw/plugin-sdk/runtime-config-snapshot`, and `openclaw/plugin-sdk/config-contracts`" | "`openclaw/plugin-sdk/channel-config-schema`" | "`openclaw/plugin-sdk/channel-inbound` and `openclaw/plugin-sdk/channel-outbound`" | "`openclaw/plugin-sdk/channel-ingress-runtime`" | "`openclaw/plugin-sdk/channel-ingress-runtime` for sender authorization; matching named exports from `openclaw/plugin-sdk/command-auth-native`, `openclaw/plugin-sdk/command-status`, `openclaw/plugin-sdk/models-provider-runtime`, and `openclaw/plugin-sdk/channel-inbound`; adapt legacy authorization types to the ingress contract" | "`openclaw/plugin-sdk/channel-outbound`" | "`openclaw/plugin-sdk/channel-outbound` and `openclaw/plugin-sdk/channel-inbound`" | "`openclaw/plugin-sdk/channel-secret-basic-runtime` and `openclaw/plugin-sdk/channel-secret-tts-runtime`" | "`openclaw/plugin-sdk/logging-core`, `openclaw/plugin-sdk/text-chunking`, `openclaw/plugin-sdk/text-utility-runtime`, and `openclaw/plugin-sdk/string-coerce-runtime`" | "`openclaw/plugin-sdk/run-command`" | "focused typed subpaths including `openclaw/plugin-sdk/system-event-runtime`, `openclaw/plugin-sdk/error-runtime`, `openclaw/plugin-sdk/approval-runtime`, and `openclaw/plugin-sdk/ssrf-runtime`; use injected runtime APIs for host operations without a public subpath" | "generic channel contracts and injected runtime helpers for external plugins; the Telegram plugin's `api.ts` for repository consumers" | "matching named exports from `openclaw/plugin-sdk/channel-contract`, `openclaw/plugin-sdk/channel-core`, `openclaw/plugin-sdk/channel-plugin-common`, `openclaw/plugin-sdk/channel-status`, or `openclaw/plugin-sdk/config-contracts`; external plugins use generic channel contracts and the injected runtime for channel-owned behavior" | "the direct `zod` package import";
  docsPath: string;
  surfaces: string[];
  tests: string[];
  status: "deprecated" | "removed";
  deprecated: string;
  warningStarts: string;
  removalGate: "stable-deprecation-period" | undefined;
  diagnostics: string[];
} | {
  status: "removal-pending";
  removeAfter: "2026-09-30";
  replacement: "`api.registerMediaUnderstandingProvider(...)` with provider-owned request helpers and types from `openclaw/plugin-sdk/plugin-entry`; retain the public subpath through the 2026-09-30 window while official plugin consumers migrate";
  docsPath: "/plugins/architecture";
  code: "plugin-sdk-media-understanding-public-demotion" | "plugin-sdk-memory-host-core-public-demotion" | "plugin-sdk-plugin-config-runtime-public-demotion" | "plugin-sdk-tool-plugin-public-demotion";
  owner: "sdk";
  introduced: string;
  deprecated: string;
  warningStarts: string;
  surfaces: string[];
  diagnostics: string[];
  tests: string[];
} | {
  status: "removal-pending";
  removeAfter: "2026-09-30";
  replacement: "host-prepared memory prompts via `openclaw/plugin-sdk/core` and memory capability registration through the injected plugin API; retain the facade through the 2026-09-30 window and until a focused public-artifact read seam exists";
  docsPath: "/plugins/architecture-internals#context-engine-plugins";
  code: "plugin-sdk-media-understanding-public-demotion" | "plugin-sdk-memory-host-core-public-demotion" | "plugin-sdk-plugin-config-runtime-public-demotion" | "plugin-sdk-tool-plugin-public-demotion";
  owner: "sdk";
  introduced: string;
  deprecated: string;
  warningStarts: string;
  surfaces: string[];
  diagnostics: string[];
  tests: string[];
} | {
  status: "removal-pending";
  removeAfter: "2026-12-01";
  replacement: "`api.pluginConfig`, runtime tool context config, and focused `config-contracts`, `runtime-config-snapshot`, or `config-mutation` subpaths; retain the public subpath through the 2026-12-01 window while official plugin consumers migrate";
  docsPath: "/plugins/sdk-runtime";
  code: "plugin-sdk-media-understanding-public-demotion" | "plugin-sdk-memory-host-core-public-demotion" | "plugin-sdk-plugin-config-runtime-public-demotion" | "plugin-sdk-tool-plugin-public-demotion";
  owner: "sdk";
  introduced: string;
  deprecated: string;
  warningStarts: string;
  surfaces: string[];
  diagnostics: string[];
  tests: string[];
} | {
  status: "deprecated";
  replacement: "retain the public subpath until plugin authoring has a nonexecuting static metadata replacement for `defineToolPlugin`; `getToolPluginMetadata` currently reads metadata only from an already-executed entry";
  docsPath: "/plugins/tool-plugins";
  code: "plugin-sdk-media-understanding-public-demotion" | "plugin-sdk-memory-host-core-public-demotion" | "plugin-sdk-plugin-config-runtime-public-demotion" | "plugin-sdk-tool-plugin-public-demotion";
  owner: "sdk";
  introduced: string;
  deprecated: string;
  warningStarts: string;
  surfaces: string[];
  diagnostics: string[];
  tests: string[];
} | {
  readonly code: "reply-dispatch-progress-receipt-handoff";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-09-19";
  readonly deprecated: "2026-10-06";
  readonly warningStarts: "2026-10-06";
  readonly removalGate: "stable-deprecation-period";
  readonly replacement: "Adapt editable progress cards through ReplyDispatchRuntimeInfo.adoptProgressDraft. The released receipt-based adoptProgressContinuation type is retained until an announced later ordinary stable release and explicit maintainer approval; the host never offers it, so adapters keep ordinary waiting-reply delivery.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#progress-card-handoff";
  readonly surfaces: readonly ["openclaw/plugin-sdk/reply-runtime.ReplyDispatchRuntimeInfo.adoptProgressContinuation"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotation and migration documentation; no runtime warnings"];
  readonly tests: readonly ["src/plugin-sdk/shipped-channel-compat.test.ts", "src/auto-reply/reply/dispatch-from-config.continuation-settlement.test.ts"];
} | {
  readonly code: "runtime-config-sync-load";
  readonly status: "deprecated";
  readonly owner: "config";
  readonly introduced: "2026-04-27";
  readonly deprecated: "2026-10-11";
  readonly warningStarts: "2026-10-11";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Use readRuntimeConfig for the already prepared runtime snapshot. At a cold preparation boundary, await captureRuntimeConfigAsyncReader()() first or use its returned config. The released getRuntimeConfig keeps its synchronous cold-load behavior through 2026-12-31; removal ships in the first January 2027 stable release.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#read-prepared-runtime-config";
  readonly surfaces: readonly ["openclaw/plugin-sdk/runtime-config-snapshot.getRuntimeConfig", "openclaw/plugin-sdk/memory-core-host-runtime-core.getRuntimeConfig"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotation and one DEP_SESSION_PERSISTENCE warning per plugin and runtime-config family per process on legacy use"];
  readonly tests: readonly ["src/config/runtime-snapshot.test.ts", "src/config/io.runtime-async.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Runtime config readers consume prepared snapshots without synchronous storage access. Cold callers can await the existing preparation owner, while the deprecated SDK getter retains its released completion contract. Stored config and update behavior are unchanged.";
} | {
  readonly code: "reply-tool-authority-sync-preparation";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-04";
  readonly deprecated: "2026-10-04";
  readonly warningStarts: "2026-10-04";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await the Async reply-operation, fingerprint, and V2 queue companions. Question dispatchers await authority.assertCurrentAsync after transport preparation and assert current authority immediately before I/O. Released synchronous contracts remain through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-reply-tool-authority";
  readonly surfaces: readonly ["EmbeddedRunAttemptParams.replyOperation", "EmbeddedRunAttemptParamsV2.replyOperation", "AgentHarnessAttemptParams.replyOperation", "AgentHarnessAttemptParamsV2.replyOperation", "ReplyToolAuthoritySnapshot.fingerprint and project", "ReplyBackendMessageInjectionV2.queueMessage, claimPendingUserInputAnswer, and cancelPendingUserInput", "AgentQuestionDispatcher.authority.assertCurrent"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and bounded warnings on legacy preparation or injection fallbacks; supported prepared projections and live effect assertions remain silent"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugin-sdk/reply-tool-authority-compat.test.ts"];
  readonly releaseNote: "Reply tool authority preparation gains awaited session-reader paths while retaining released synchronous snapshot, operation, and dispatcher contracts. Legacy external V2 dispatchers retain fresh native authority checks; schema, retention, and update behavior are unchanged.";
} | {
  readonly code: "session-transcript-sync-statistics";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly removeAfter: "2026-12-31";
  readonly introduced: "2026-07-11";
  readonly deprecated: "2026-10-11";
  readonly warningStarts: "2026-10-11";
  readonly replacement: "Await readTranscriptStatsAsync from session-store-runtime, or readTranscriptStatsBatchReadOnlyAsync and statSessionEntry from memory-core-host-engine-sessions. Batch reads preserve input order, duplicate IDs, and null results for unavailable stores through the existing history worker. Worker-local kernels and supplied statistics may retain direct synchronous reads; legacy main-thread SDK calls remain compatible through 2026-12-31.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-transcript-statistics";
  readonly surfaces: readonly ["openclaw/plugin-sdk/session-store-runtime.readTranscriptStatsSync", "openclaw/plugin-sdk/memory-core-host-engine-sessions.readTranscriptStatsBatchReadOnlySync", "openclaw/plugin-sdk/memory-core-host-engine-sessions.statSessionEntrySync"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and one shared DEP_PLUGIN_SDK warning per plugin and session-store family on main-thread legacy use; worker-local reads do not warn"];
  readonly tests: readonly ["src/plugin-sdk/session-store-runtime.stats.test.ts", "src/plugins/compat/registry.test.ts", "packages/memory-host-sdk/src/host/session-files.test.ts"];
  readonly releaseNote: "Plugins can await single or batched transcript statistics without running durable SQLite on the Gateway thread. Existing synchronous signatures remain available through 2026-12-31. Stored data, retention, and update behavior are unchanged.";
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly removeAfter: "2026-12-31";
  readonly code: "session-store-sync-listing";
  readonly introduced: "2026-09-08";
  readonly deprecated: "2026-10-11";
  readonly warningStarts: "2026-10-11";
  readonly replacement: "Await listSessionEntriesAsync with an explicit agentId for read-only metadata; use getSessionEntryAsync for complete entries. Retain final deletion and disclosure authority at the effect boundary. The synchronous listing remains compatible through 2026-12-31.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-session-metadata-listings";
  readonly surfaces: readonly ["openclaw/plugin-sdk/session-store-runtime.listSessionEntries", "api.runtime.agent.session.listSessionEntries"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and one shared DEP_PLUGIN_SDK warning per plugin and session-store family per process on legacy use"];
  readonly tests: readonly ["src/plugin-sdk/session-store-runtime.async.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Plugins can list current session metadata through the existing session worker without loading saved prompts or creating missing databases. Bundled Discord thread-close and Codex pre-archive enumeration use the async API; the released synchronous contract remains available. Stored data and update behavior are unchanged.";
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly removeAfter: "2026-12-31";
  readonly code: "github-publication-native-callbacks";
  readonly introduced: "2026-08-19";
  readonly deprecated: "2026-10-09";
  readonly warningStarts: "2026-10-09";
  readonly replacement: "Use requestForSessionV2 and requestForClaimV2 with the host-provided GitHubPublicationRequesterV2, and requestPersonalForSessionV2 and confirmPersonalV2 with PersonalGitHubSessionActionV2. Await deferClaimPreparationAsync, deferOrphanedRequestsAsync, listUnreportedResultsAsync, markReportedAsync, readAsync, and personalStatusAsync. Legacy publication methods retain their signatures but fail at invocation. On githubOAuthService, await cancelAuthorizationAsync and retireProfileAsync; on its personal service, await cancelAuthorizationAsync and disconnectAsync. These OAuth compatibility methods retain synchronous completion. Deprecated signatures will be removed in the first January 2027 stable release after the final compatibility day, 2026-12-31.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-github-publication-operations";
  readonly surfaces: readonly ["GatewayRequestHandlerOptions.context.githubPublicationService.requestForSession", "GatewayRequestHandlerOptions.context.githubPublicationService.requestForClaim", "GatewayRequestHandlerOptions.context.githubPublicationService.requestPersonalForSession", "GatewayRequestHandlerOptions.context.githubPublicationService.confirmPersonal", "GatewayRequestHandlerOptions.context.githubPublicationService.deferClaimPreparation", "GatewayRequestHandlerOptions.context.githubPublicationService.deferOrphanedRequests", "GatewayRequestHandlerOptions.context.githubPublicationService.listUnreportedResults", "GatewayRequestHandlerOptions.context.githubPublicationService.markReported", "GatewayRequestHandlerOptions.context.githubPublicationService.personalStatus", "GatewayRequestHandlerOptions.context.githubOAuthService.cancelAuthorization", "GatewayRequestHandlerOptions.context.githubOAuthService.retireProfile", "GatewayRequestHandlerOptions.context.githubOAuthService.personal.cancelAuthorization", "GatewayRequestHandlerOptions.context.githubOAuthService.personal.disconnect", "GitHubPublicationRequester", "GitHubPublicationRequesterPolicy", "PersonalGitHubSessionAction", "getPluginRuntimeGatewayRequestScope().context.githubPublicationService", "getPluginRuntimeGatewayRequestScope().context.githubOAuthService.personal"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations naming the V2 or Async replacement; one shared runtime DEP_PLUGIN_SDK warning per plugin and github-publication family per process, including bounded unscoped SDK use"];
  readonly tests: readonly ["src/plugin-sdk/gateway-placement-compat.test.ts", "src/state/github-publication.worker.test.ts", "src/gateway/github-publication-admission.test.ts", "src/gateway/server-methods/users-github.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "GitHub publication adds required V2 requester capabilities and worker-owned request, lifecycle, execution, recovery, and reporting commands. Legacy publication methods retain their signatures but fail at invocation with migration guidance until removal in an announced later stable release. Personal connection cancellation and disconnection add awaited worker methods while retaining their released synchronous contracts; schemas, stored data, retention, and update behavior are unchanged.";
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly removeAfter: "2026-12-31";
  readonly code: "session-store-opaque-mutations";
  readonly introduced: "2026-09-08";
  readonly deprecated: "2026-10-09";
  readonly warningStarts: "2026-10-09";
  readonly replacement: "Use prepareSessionEntryPatch for host preparation followed by an exact-snapshot conditional commit, applySessionEntryPatch for data-only patches, and updateLastRouteWithAuthority for guarded route updates. Legacy opaque transaction guards retain their ordering and will be removed in the first January 2027 stable release after the final compatibility day, 2026-12-31.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#prepare-session-entry-changes";
  readonly surfaces: readonly ["openclaw/plugin-sdk/session-store-runtime.patchSessionEntry", "openclaw/plugin-sdk/session-store-runtime.updateSessionStoreEntry", "openclaw/plugin-sdk/session-store-runtime.updateLastRoute.assertCommitAllowed", "api.runtime.agent.session.patchSessionEntry", "api.runtime.agent.session.updateSessionStoreEntry", "api.runtime.channel.session.updateLastRoute.assertCommitAllowed"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and one shared DEP_PLUGIN_SDK warning per plugin and session-store family per process on legacy use"];
  readonly tests: readonly ["src/plugin-sdk/session-persistence-compat.test.ts", "src/plugin-sdk/session-store-runtime.worker-patch.test.ts", "src/plugin-sdk/session-store-runtime.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Plugins can prepare entry changes outside SQLite or submit conditional data patches to the existing worker. Public upserts and transcript watermarks use typed worker reducers. Released callback contracts remain compatible; native incognito and cross-store adapters retain their separate cutover boundaries.";
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly removeAfter: "2026-12-31";
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and migration documentation; bounded capability-family warnings on legacy preparation"];
  readonly code: "codex-transcript-sync-validation";
  readonly introduced: "2026-09-08";
  readonly deprecated: "2026-10-06";
  readonly warningStarts: "2026-10-06";
  readonly replacement: "Await readCodexSessionContextProjection for retained worker projection and final validation. Keep the released synchronous validators through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major. readCodexSessionContext remains a supported synchronous worker reader with its released three-argument generic result contract.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-session-transcript-persistence";
  readonly surfaces: readonly ["openclaw/plugin-sdk/codex-session-transcript-runtime.validateCodexSessionTranscriptReadAdmission", "openclaw/plugin-sdk/codex-session-transcript-runtime.validateCodexSessionTranscriptContextVersion"];
  readonly tests: readonly ["src/plugin-sdk/codex-session-transcript-runtime.compat.test.ts", "src/config/sessions/session-transcript-context-read.worker.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Codex history validates retained worker projections off the Gateway thread while preserving the released synchronous reader and validator signatures. Storage and update behavior are unchanged.";
} | {
  readonly code: "deprecated-session-store-beta5-api";
  readonly status: "removed";
  readonly removeAfter: "2026-09-30";
  readonly owner: "sdk";
  readonly introduced: "2026-05-21";
  readonly deprecated: "2026-07-12";
  readonly warningStarts: "2026-07-12";
  readonly replacement: "Use `getSessionEntryAsync(...)` and `listSessionEntriesAsync(...)` for reads; `prepareSessionEntryPatch(...)`, `applySessionEntryPatch(...)`, `upsertSessionEntry(...)`, and `deleteSessionEntry(...)` for row mutations; and session identity with `session-transcript-runtime` for active transcripts. The supported-plugin cutoff excludes v2026.7.1-beta.5 and other packages importing the retired bridge.";
  readonly docsPath: "/plugins/sdk-migration/removed-surfaces#removed-session-and-transcript-file-apis";
  readonly surfaces: readonly ["openclaw/plugin-sdk/session-store-runtime loadSessionStore", "openclaw/plugin-sdk/session-store-runtime updateSessionStore", "openclaw/plugin-sdk/session-store-runtime resolveSessionFilePath", "openclaw/plugin-sdk/session-store-runtime resolveSessionStoreEntry", "openclaw/plugin-sdk/session-store-runtime LoadSessionStoreOptions", "openclaw/plugin-sdk/session-store-runtime UpdateSessionStoreOptions", "openclaw package root loadSessionStore", "openclaw package root saveSessionStore"];
  readonly diagnostics: readonly ["plugin compatibility registry and migration guide"];
  readonly tests: readonly ["src/plugin-sdk/session-store-runtime.test.ts", "src/index.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The September 30, 2026 approved cutoff in 1783c5fd6fc5b03d2b376ba7cbbab4461940207e retired the beta.5 session-store bridge, its option types, and package-root loadSessionStore/saveSessionStore aliases ahead of the former October 12 window. Plugins must use scoped row APIs and identity-backed transcript APIs; the session-store-runtime subpath and resolveStorePath remain available.";
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly removeAfter: "2026-12-31";
  readonly code: "transcript-lock-sync-message-preparation";
  readonly introduced: "2026-09-08";
  readonly deprecated: "2026-10-05";
  readonly warningStarts: "2026-10-08";
  readonly replacement: "Use withSessionTranscriptWrite (or withCodexSessionTranscriptMirrorWrite) with preparation.prepareMessage and preparation.source. Legacy lock and opaque callback forms retain durable transaction ordering through 2026-12-31; incognito targets reject them with migration guidance.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-locked-transcript-preparation";
  readonly surfaces: readonly ["SessionTranscriptWriteLockContext.appendMessage.prepareMessageAfterIdempotencyCheck", "CodexSessionTranscriptMirrorWriteLockContext.appendMessageWithMessageSequence.prepareMessageAfterIdempotencyCheck", "SessionTranscriptWriteLockContext.appendMessage.beforeFreshMessageCommit", "CodexSessionTranscriptMirrorWriteLockContext.appendMessageWithMessageSequence.beforeFreshMessageCommit", "openclaw/plugin-sdk/session-transcript-runtime.withSessionTranscriptWriteLock", "openclaw/plugin-sdk/codex-session-transcript-runtime.withCodexSessionTranscriptMirrorWriteLock"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations; one runtime warning per plugin for legacy transcript callbacks/locks; incognito targets receive an actionable replacement error"];
  readonly tests: readonly ["src/plugin-sdk/session-transcript-lock.native.test.ts", "src/plugin-sdk/session-transcript-preparation-compat.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Transcript writes have an optimistic, actor-compatible preparation contract. Legacy durable callbacks/locks retain transaction ordering; incognito callers migrate to preparation options. Stored data and update behavior are unchanged, and ordinary incognito routing stays host-owned.";
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly removeAfter: "2026-12-31";
  readonly code: "session-upstream-links-sync-persistence";
  readonly introduced: "2026-07-14";
  readonly deprecated: "2026-10-05";
  readonly warningStarts: "2026-10-05";
  readonly replacement: "Await upsertSessionUpstreamLinkAsync and deleteSessionUpstreamLinkAsync from session-catalog. Official harnesses await the native initializer's linkAsync method. Retain the synchronous signatures and completion timing shipped in v2026.9.8 through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-session-upstream-links";
  readonly surfaces: readonly ["openclaw/plugin-sdk/session-catalog.upsertSessionUpstreamLink", "openclaw/plugin-sdk/session-catalog.deleteSessionUpstreamLink", "openclaw/plugin-sdk/agent-harness-session-runtime.createNativeSessionInitializationOwner().prepare().link"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and one shared DEP_SESSION_PERSISTENCE warning per plugin and upstream-link capability family; unscoped consumers share one SDK-level warning"];
  readonly tests: readonly ["src/plugin-sdk/session-catalog-upstream-compat.test.ts", "src/plugin-sdk/agent-harness-session-compat.test.ts", "src/sessions/session-upstream-links.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Bundled session adoption and native initialization await upstream-link writes through the shared-state worker. Released synchronous SDK methods remain compatible through 2026-12-31; schemas, stored data, retention, and update behavior are unchanged.";
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly removeAfter: "2026-12-31";
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and migration documentation; bounded capability-family warnings on legacy preparation"];
  readonly code: "session-observer-progress-sync-reads";
  readonly introduced: "2026-09-08";
  readonly deprecated: "2026-10-04";
  readonly warningStarts: "2026-10-04";
  readonly replacement: "Await sessionObserver.handleEventAsync, getCompanionSnapshotAsync, and disposeAsync. Use reply_dispatch shouldSendToolSummariesAsync/shouldSendFullToolDetailsAsync and onVerboseProgressVisibilityAsync. Retain synchronous contracts through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-session-observer-and-progress-visibility";
  readonly surfaces: readonly ["GatewayRequestHandlerOptions.context.sessionObserver.handleEvent", "GatewayRequestHandlerOptions.context.sessionObserver.getCompanionSnapshot", "GatewayRequestHandlerOptions.context.sessionObserver.dispose", "PluginHookReplyDispatchEvent.shouldSendToolSummaries", "PluginHookReplyDispatchEvent.shouldSendFullToolDetails", "GetReplyOptions.onVerboseProgressVisibility", "tryDispatchAcpReplyHook boolean-only event inputs"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugin-sdk/reply-runtime.contract.test.ts", "src/plugin-sdk/gateway-session-observer-compat.test.ts", "src/plugin-sdk/acp-runtime.test.ts", "src/gateway/session-observer.test.ts"];
  readonly releaseNote: "Session observer lifecycle and progress visibility expose awaited worker-backed methods. Released synchronous observer methods, reply-hook booleans, and visibility callbacks remain compatible; schemas, stored data, retention, and update behavior are unchanged.";
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly removeAfter: "2026-12-31";
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and migration documentation; bounded capability-family warnings on legacy preparation"];
  readonly code: "channel-inbound-sync-envelope-timestamps";
  readonly introduced: "2026-10-05";
  readonly deprecated: "2026-10-05";
  readonly warningStarts: "2026-10-05";
  readonly replacement: "Await readSessionUpdatedAtAsync, createChannelInboundEnvelopeBuilderAsync, or resolveInboundSessionEnvelopeContextAsync at each message's formatting boundary. Resolve routes through resolveAgentRoute and use dispatchInboundDirectDm. Retain the synchronous signatures and callback timing shipped in 2026.9.8 through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#inbound-envelope-timestamps";
  readonly surfaces: readonly ["openclaw/plugin-sdk/session-store-runtime.readSessionUpdatedAt", "api.runtime.channel.session.readSessionUpdatedAt", "openclaw/plugin-sdk/channel-inbound.createChannelInboundEnvelopeBuilder", "openclaw/plugin-sdk/channel-inbound.resolveChannelInboundRouteEnvelope", "openclaw/plugin-sdk/channel-inbound.resolveInboundSessionEnvelopeContext", "openclaw/plugin-sdk/channel-inbound.dispatchInboundDirectDmWithRuntime", "openclaw/plugin-sdk/inbound-envelope.createInboundEnvelopeBuilder", "openclaw/plugin-sdk/inbound-envelope.resolveInboundRouteEnvelopeBuilder", "openclaw/plugin-sdk/inbound-envelope.resolveInboundRouteEnvelopeBuilderWithRuntime"];
  readonly tests: readonly ["src/plugin-sdk/shipped-channel-compat.test.ts", "src/channels/inbound-event/envelope.test.ts", "src/channels/inbound-event/envelope.worker.test.ts", "src/plugin-sdk/direct-dm.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Bundled channels prepare activity timestamps through the existing session reader while released plugins retain their synchronous envelope callbacks. Stored data, schemas, retention, and update behavior are unchanged.";
} | {
  readonly status: "deprecated";
  readonly removeAfter: "2026-12-31";
  readonly code: "reply-run-start-unprepared-transcript";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-10-04";
  readonly deprecated: "2026-10-04";
  readonly warningStarts: "2026-10-04";
  readonly replacement: "Use onPreparedAgentRunStart with a required transcriptStart field, forwarding the complete notification and synchronous return value. Bundled runtimes prepare the facts asynchronously; retain the released onAgentRunStart callback and omitted-facts synchronous read through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#reply-run-start-transcript-facts";
  readonly surfaces: readonly ["openclaw/plugin-sdk/reply-runtime.GetReplyOptions.onAgentRunStart", "PluginHookReplyDispatchContext.onAgentRunStart"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotation and one runtime DEP_SESSION_PERSISTENCE warning per plugin and callback family per process"];
  readonly tests: readonly ["src/plugin-sdk/reply-runtime.contract.test.ts", "src/gateway/server-methods/chat-send-reply-dispatch.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Reply runtimes can pass prepared transcript boundaries without Gateway-thread reads. Released plugin callbacks keep their arguments and synchronous completion acknowledgment; stored data and update behavior are unchanged.";
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly removeAfter: "2026-12-31";
  readonly code: "session-manager-sync-context-read";
  readonly introduced: "2026-10-04";
  readonly deprecated: "2026-10-04";
  readonly warningStarts: "2026-10-04";
  readonly replacement: "Await SessionManager.readSessionContextAsync for full-fidelity context consumption. The synchronous reader retains its shipped result through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-session-transcript-persistence";
  readonly surfaces: readonly ["SessionManager.readSessionContext"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotation and one runtime DEP_SESSION_PERSISTENCE warning per plugin and capability family per process"];
  readonly tests: readonly ["src/plugin-sdk/agent-sessions.context-compat.test.ts", "src/agents/sessions/session-manager-incognito.test.ts", "src/agents/sessions/session-manager-model-context-snapshot.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Plugins can await full-fidelity SessionManager context reads and asynchronous consumers. Owner and admission checks cover consumption; later transcript writes do not invalidate the captured snapshot. The synchronous reader remains available through 2026-12-31. Storage and update behavior are unchanged.";
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly removeAfter: "2026-12-31";
  readonly code: "session-reset-freshness-sync-read";
  readonly introduced: "2026-10-05";
  readonly deprecated: "2026-10-05";
  readonly warningStarts: "2026-10-05";
  readonly replacement: "Await runtime.channel.session.resolveEntryResetFreshnessAsync. The released synchronous resolveEntryResetFreshness method retains its parameters and result through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-migration#session-reset-freshness";
  readonly surfaces: readonly ["api.runtime.channel.session.resolveEntryResetFreshness"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotation and migration documentation; bounded capability-family warnings on legacy preparation"];
  readonly tests: readonly ["src/plugin-sdk/session-reset-freshness-compat.test.ts", "src/config/sessions/entry-freshness.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Channel plugins can await session reset freshness through the transcript worker. Existing plugins retain the synchronous method and reset policy; stored data and update behavior are unchanged.";
} | {
  readonly status: "deprecated";
  readonly removeAfter: "2026-12-31";
  readonly code: "agent-end-sync-side-effects";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-05-30";
  readonly deprecated: "2026-10-04";
  readonly warningStarts: "2026-10-04";
  readonly replacement: "Await runAgentEndSideEffectsAsync before releasing the turn lease. The released runAgentEndSideEffects helper retains its synchronous void result and scheduling behavior through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-agent-harness/attempt-runtime#agent-end-side-effects";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-harness-runtime.runAgentEndSideEffects"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotation and migration documentation; bounded capability-family warnings on legacy preparation"];
  readonly tests: readonly ["src/plugin-sdk/agent-harness-runtime.test.ts", "src/agents/harness/agent-end-side-effects.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Harness plugins can await transcript-anchor preparation before releasing turn authority. The synchronous agent-end helper remains compatible for published plugins; stored data and update behavior are unchanged.";
} | {
  readonly status: "deprecated";
  readonly removeAfter: "2026-12-31";
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and migration documentation; bounded capability-family warnings on legacy preparation"];
  readonly code: "native-session-generation-sync-authority";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-09-22";
  readonly deprecated: "2026-10-03";
  readonly warningStarts: "2026-10-03";
  readonly replacement: "Await retainNativeSessionGenerationAuthority, resolvePreparedNativeSessionBinding, and reclaimNativeSessionGenerationWithAuthority. Release prepared captures after terminal cleanup. Released synchronous capture and two-argument mutation callbacks remain deprecated while published official harness readers migrate.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#native-session-generation-authority";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-harness-session-runtime.captureNativeSessionGenerationAuthority", "openclaw/plugin-sdk/agent-harness-session-runtime.resolveNativeSessionBinding", "openclaw/plugin-sdk/agent-harness-session-runtime.reclaimNativeSessionGeneration", "openclaw/plugin-sdk/agent-harness-session-runtime.NativeSessionGenerationOperations"];
  readonly tests: readonly ["src/plugin-sdk/agent-harness-session-compat.test.ts", "src/agents/harness/native-session/binding-generation.test.ts", "src/agents/harness/native-session/binding-generation-authority.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Native harnesses can admit binding operations through worker-backed session authority. Released official harness plugins retain synchronous authority capture and lineage-checking mutation callbacks across host upgrades.";
} | {
  readonly status: "deprecated";
  readonly removeAfter: "2026-12-31";
  readonly code: "native-session-deletion-unbound-callbacks";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-08-26";
  readonly deprecated: "2026-10-11";
  readonly warningStarts: "2026-10-11";
  readonly replacement: "Pass participants from createNativeSessionBindingLifecycleV2.withDeletion for reversible stored bindings or createNativeSessionCommitFinalizer for commit-only cleanup. Factory-produced participants and the existing harness hooks remain supported; direct unbound callbacks retain synchronous commit and rollback through 2026-12-31.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#replace-unbound-native-session-deletion-callbacks";
  readonly surfaces: readonly ["AgentHarnessSessionDeletionMutation unbound commit/rollback callbacks", "AgentHarness.withSessionDeletion unbound mutation argument", "AgentHarness.withSessionContextReset unbound mutation argument"];
  readonly diagnostics: readonly ["TypeScript contract documentation and one shared DEP_SESSION_PERSISTENCE warning per plugin and native-session-deletion family per process, emitted only for unbound callbacks"];
  readonly tests: readonly ["src/config/sessions/session-native-binding.reclamation.test.ts", "src/config/sessions/session-native-binding.settlement.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Session replacement can settle typed native bindings through the existing worker transaction. Unbound synchronous harness callbacks are deprecated with supported factory replacements; stored data and update behavior are unchanged.";
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly removeAfter: "2026-12-31";
  readonly code: "session-manager-sync-persistence";
  readonly introduced: "2026-10-01";
  readonly deprecated: "2026-10-01";
  readonly warningStarts: "2026-10-01";
  readonly replacement: "Await the matching Async-suffixed SessionManager method, including the returned rewrite commit. For resolveCurrentTurnEntryId with includeOmittedCustomMessages, await openAsync and traverse the complete view without that option. Shipped synchronous adapters remain compatible during their deprecation period and will be removed in the first January 2027 stable release after the final compatibility day, 2026-12-31.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-session-transcript-persistence";
  readonly surfaces: readonly ["SessionManager.appendMessage", "SessionManager.appendMessageWithTranscriptAnchor", "SessionManager.appendCompaction", "SessionManager.appendResetBoundary", "SessionManager.appendCustomEntry", "SessionManager.appendSessionInfo", "SessionManager.appendCustomMessageEntry", "SessionManager.appendLeafControl", "SessionManager.appendLabelChange", "SessionManager.branch", "SessionManager.branchWithSummary", "SessionManager.removeTrailingEntries", "SessionManager.persist", "SessionManager.prepareTranscriptRewrite", "SessionManager.appendMessageToTranscript", "SessionManager.open", "SessionManager.openBounded", "SessionManager.openDetachedBounded", "SessionManager.openModelContext", "SessionManager.setSessionTarget", "SessionManager.reloadPersistedTranscript", "SessionManager.resolveCurrentTurnEntryId.includeOmittedCustomMessages"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations naming awaited twins", "one runtime DEP_SESSION_PERSISTENCE warning per plugin and capability family per process"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/agents/sessions/session-manager-async-entries.test.ts", "src/agents/sessions/session-manager-async-message.test.ts", "src/agents/sessions/session-manager-maintenance-async.test.ts"];
  readonly releaseNote: "Plugins can await SessionManager transcript mutations through the existing SQLite worker. Synchronous methods retain their shipped return values as deprecated third-party adapters through 2026-12-31; storage formats and update behavior are unchanged.";
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly removeAfter: "2026-12-31";
  readonly code: "extension-session-sync-persistence";
  readonly introduced: "2026-10-01";
  readonly deprecated: "2026-10-01";
  readonly warningStarts: "2026-10-01";
  readonly replacement: "Await ExtensionAPI.appendEntryAsync, setSessionNameAsync, and setLabelAsync, and AgentSession.setSessionNameAsync. Existing synchronous third-party methods retain their void return contract through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-extension-session-changes";
  readonly surfaces: readonly ["ExtensionAPI.appendEntry", "ExtensionAPI.setSessionName", "ExtensionAPI.setLabel", "AgentSession.setSessionName"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations, migration guide, and shared once-per-plugin-and-family DEP_SESSION_PERSISTENCE warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/agents/sessions/sdk.metadata-admission.test.ts"];
  readonly releaseNote: "Extensions can await transcript entries, session names, and labels; the shipped synchronous methods remain third-party compatibility adapters through 2026-12-31.";
} | {
  readonly status: "deprecated";
  readonly removeAfter: "2026-12-31";
  readonly code: "provider-replay-sync-persistence";
  readonly owner: "provider";
  readonly introduced: "2026-10-01";
  readonly deprecated: "2026-10-01";
  readonly warningStarts: "2026-10-01";
  readonly replacement: "Use ProviderPlugin.sanitizeReplayHistoryAsync with ProviderSanitizeReplayHistoryContextV2 and await ProviderReplaySessionStateV2.appendCustomEntryAsync; use sanitizeGoogleGeminiReplayHistoryAsync for the shared Gemini implementation. Retain legacy third-party contexts and hooks through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-provider-replay-metadata";
  readonly surfaces: readonly ["ProviderPlugin.sanitizeReplayHistory", "ProviderReplaySessionState.appendCustomEntry", "openclaw/plugin-sdk/provider-model-shared.sanitizeGoogleGeminiReplayHistory", "ProviderSanitizeReplayHistoryContext", "ProviderReplaySessionState"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations, versioned migration guide, and shared once-per-plugin-and-family DEP_SESSION_PERSISTENCE warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugins/provider-replay-helpers.test.ts", "src/plugins/provider-runtime.test.ts", "src/plugin-sdk/provider-model-shared.test.ts"];
  readonly releaseNote: "Provider replay hooks can await committed transcript metadata through additive V2 context types. Legacy hooks, context types, and the synchronous Gemini helper remain available for third-party migration through 2026-12-31.";
} | {
  readonly code: "agent-execution-preparation-released-signature";
  readonly status: "active";
  readonly owner: "sdk";
  readonly introduced: "2026-10-06";
  readonly replacement: "Keep the execution input shapes shipped in v2026.9.9 and v2026.10.1-beta.1 by openOpenClawAgentSqliteWorkerStore, including the beta capturePreparedGenerationClaim method for parameter-derived types. Private native-adoption capabilities are not plugin requirements. The released two-argument prepare contract remains supported without migration or deprecation; host admission reuses the native owner’s published schema facts.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#agent-execution-preparation-compatibility";
  readonly surfaces: readonly ["openclaw/plugin-sdk/sqlite-runtime.openOpenClawAgentSqliteWorkerStore publicationSource.execution", "openclaw/plugin-sdk/sqlite-runtime.openOpenClawAgentSqliteWorkerStore publicationSource.execution.prepare"];
  readonly diagnostics: readonly ["SDK type assertions and compatibility documentation; no runtime warnings"];
  readonly tests: readonly ["src/plugin-sdk/sqlite-runtime.preparation-compat.test.ts", "src/state/openclaw-agent-execution.creation-witness.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Agent execution and host admission reuse completed native preparation and published schema facts. Released execution objects do not require private host capabilities; preparation calls and implementations retain their Promise contract. Schemas, stored data, and update behavior are unchanged.";
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly removeAfter: "2026-12-31";
  readonly code: "acp-session-sync-read";
  readonly introduced: "2026-09-04";
  readonly deprecated: "2026-10-11";
  readonly warningStarts: "2026-10-11";
  readonly replacement: "Await readAcpSessionEntryAsync. Bundled consumers use the existing worker-backed reader; the released synchronous reader keeps its result contract through 2026-12-31; removal ships in the first January 2027 stable release.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#acp-metadata-binding-compatibility";
  readonly surfaces: readonly ["openclaw/plugin-sdk/acp-runtime.readAcpSessionEntry", "AcpSessionManager.resolveSession"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotation and one shared DEP_PLUGIN_SDK warning per plugin and ACP-session family per process on legacy use"];
  readonly tests: readonly ["src/plugin-sdk/acp-runtime.test.ts", "src/acp/runtime/session-meta-read.test.ts"];
  readonly releaseNote: "ACP session reads run through the existing worker. Bundled callers await metadata while the released synchronous SDK reader remains deprecated and supported; schemas, stored data, and update behavior are unchanged.";
} | {
  readonly code: "acp-session-metadata-released-signatures";
  readonly status: "active";
  readonly owner: "sdk";
  readonly introduced: "2026-10-04";
  readonly replacement: "Keep the released one-argument ACP reader and manager read/write injection signatures. Internal actor bindings are not plugin arguments; actor activation must preserve these callable contracts. The APIs remain supported and are not deprecated.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#acp-metadata-binding-compatibility";
  readonly surfaces: readonly ["openclaw/plugin-sdk/acp-runtime.readAcpSessionEntryAsync", "AcpSessionManagerDeps.loadSessionEntryAsync", "AcpSessionManagerDeps.upsertSessionMeta"];
  readonly diagnostics: readonly ["SDK type assertions and compatibility documentation; no runtime warnings"];
  readonly tests: readonly ["src/plugin-sdk/acp-runtime.test.ts", "src/acp/runtime/session-meta-read.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Released ACP readers and manager injection callbacks keep their one-argument contracts while incognito sessions use the internal memory actor.";
} | {
  readonly code: "memory-session-released-signatures";
  readonly status: "active";
  readonly owner: "sdk";
  readonly introduced: "2026-10-05";
  readonly replacement: "Keep the released Memory entry, corpus, and reset-recall reader signatures. Internal actor sources are not plugin arguments; actor activation must preserve the existing Promise results and synchronous message observers. These APIs remain supported and are not deprecated.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#memory-session-binding-compatibility";
  readonly surfaces: readonly ["openclaw/plugin-sdk/memory-core-host-engine-sessions.buildSessionEntry", "openclaw/plugin-sdk/memory-core-host-engine-sessions.listSessionTranscriptCorpusEntriesForAgent", "openclaw/plugin-sdk/memory-core-host-engine-sessions.readSessionResetRecallCutoff"];
  readonly diagnostics: readonly ["SDK type assertions and compatibility documentation; no runtime warnings"];
  readonly tests: readonly ["src/plugin-sdk/memory-core-host-engine-sessions.contract.test.ts", "src/config/sessions/session-actor-memory-corpus.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Released Memory readers retain their argument and return contracts while incognito reads use the internal memory actor. Durable storage and update behavior are unchanged.";
} | {
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly removeAfter: "2026-12-31";
  readonly code: "transcript-strict-sync-message-preparation";
  readonly introduced: "2026-09-08";
  readonly deprecated: "2026-10-05";
  readonly warningStarts: "2026-10-08";
  readonly replacement: "Use preparation.prepareMessage and preparation.source with appendSessionTranscriptMessageByIdentityStrict or appendSessionTranscriptMessageByIdentity. Legacy opaque callbacks retain durable transaction ordering through 2026-12-31; incognito targets reject them with migration guidance.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-strict-transcript-message-preparation";
  readonly surfaces: readonly ["appendSessionTranscriptMessageByIdentityStrict.prepareMessageAfterIdempotencyCheck", "appendSessionTranscriptMessageByIdentityStrict.beforeFreshMessageCommit", "appendSessionTranscriptMessageByIdentity.prepareMessageAfterIdempotencyCheck", "appendSessionTranscriptMessageByIdentity.beforeFreshMessageCommit"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations; one runtime warning per plugin shared with legacy transcript locks; incognito targets receive an actionable replacement error"];
  readonly tests: readonly ["src/plugin-sdk/session-transcript-runtime.worker-preparation.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Strict and ordinary transcript appends accept prepared source authority and awaited message preparation. Legacy durable callbacks remain compatible through 2026-12-31; stored data and update behavior are unchanged.";
} | {
  readonly code: "session-transcript-sync-view";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-11";
  readonly deprecated: "2026-10-11";
  readonly warningStarts: "2026-10-11";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await loadCombinedSessionStoreForGatewayAsync from openclaw/plugin-sdk/session-transcript-hit. The synchronous export retains its complete, non-incognito view through 2026-12-31; removal ships in the first January 2027 stable release.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#session-transcript-search-views";
  readonly surfaces: readonly ["openclaw/plugin-sdk/session-transcript-hit loadCombinedSessionStoreForGateway"];
  readonly diagnostics: readonly ["Bounded DEP_PLUGIN_SDK warning for synchronous session transcript views"];
  readonly tests: readonly ["src/plugin-sdk/session-transcript-hit.projection.test.ts"];
} | {
  readonly code: "skill-command-discovery-sync";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-04-02";
  readonly deprecated: "2026-10-11";
  readonly warningStarts: "2026-10-11";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await prepareSkillCommandsForAgents or prepareSkillCommandsForWorkspace. Synchronous list methods retain their array results through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#await-skill-command-discovery";
  readonly surfaces: readonly ["openclaw/plugin-sdk/skill-commands-runtime.listSkillCommandsForAgents", "openclaw/plugin-sdk/skill-commands-runtime.listSkillCommandsForWorkspace", "openclaw/plugin-sdk/command-auth-native.listSkillCommandsForAgents"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and one runtime warning per plugin and capability family"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/skills/discovery/chat-commands.discovery.test.ts", "extensions/discord/src/monitor/provider.commands.test.ts", "extensions/telegram/src/bot-native-commands.registry.test.ts"];
  readonly releaseNote: "Native command discovery awaits managed-library selection through the existing worker. Bundled channels use the async methods; synchronous SDK methods remain available during their migration window.";
} | {
  readonly code: "sqlite-runtime-native-access";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-09-09";
  readonly deprecated: "2026-10-09";
  readonly warningStarts: "2026-10-09";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Use openOpenClawAgentSqliteWorkerStoreV2 with required live authority and serializable domain commands. Worker backends use sqlite-worker-runtime primitives; explicit readOnly inspection and offline Doctor maintenance retain their native contracts. Native callbacks are not serialized or moved by adding await. Released calls retain their signatures and synchronous transaction ordering through the deprecation period and are removed in the first January 2027 stable release after the final compatibility day, 2026-12-31.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#replace-native-sqlite-runtime-writes";
  readonly surfaces: readonly ["openclaw/plugin-sdk/sqlite-runtime.openNodeSqliteDatabase writable handles", "openclaw/plugin-sdk/sqlite-runtime.openOpenClawAgentSqliteWorkerStore publicationSource.DatabaseSync", "openclaw/plugin-sdk/sqlite-runtime.openOpenClawAgentDatabase", "openclaw/plugin-sdk/sqlite-runtime.borrowOpenClawAgentDatabase", "openclaw/plugin-sdk/sqlite-runtime.withOpenClawAgentDatabaseAsync", "openclaw/plugin-sdk/sqlite-runtime.withOpenClawAgentDatabaseWrite", "openclaw/plugin-sdk/sqlite-runtime.runOpenClawAgentWriteAdmission", "openclaw/plugin-sdk/sqlite-runtime.runSqliteImmediateTransaction", "openclaw/plugin-sdk/sqlite-runtime.runSqliteImmediateTransactionSync", "openclaw/plugin-sdk/sqlite-runtime.executeSqliteQuerySync", "openclaw/plugin-sdk/sqlite-runtime.executeSqliteQueryTakeFirstSync", "openclaw/plugin-sdk/sqlite-runtime.iterateSqliteQuerySync", "openclaw/plugin-sdk/sqlite-runtime.prepareSqliteQuerySync", "openclaw/plugin-sdk/sqlite-runtime.getNodeSqliteKysely"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and one shared warning per plugin identity and capability family on actual legacy use; unscoped consumers share a bounded SDK warning"];
  readonly tests: readonly ["src/plugin-sdk/sqlite-runtime.legacy-compat.test.ts", "src/plugin-sdk/sqlite-runtime.preparation-compat.test.ts", "src/state/openclaw-agent-worker-store.test.ts"];
  readonly releaseNote: "Agent SQLite plugins can prepare and write through the canonical worker without borrowing a writable host handle. Memory Core uses worker commands for vector, metadata, origin, standing-intent and forget mutations. Raw SDK compatibility remains available through the deprecation period and is removed in the first January 2027 stable release after the final compatibility day, 2026-12-31; schemas, stored data and update behavior are unchanged.";
} | {
  readonly code: "tts-preferences-sync-resolution";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-03";
  readonly deprecated: "2026-10-03";
  readonly warningStarts: "2026-10-03";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await resolveTtsPrefsPathAsync(config) for the machine-owned path. For prompt hints, await the public api.runtime.tts.buildSystemPromptHintAsync method. Bundled plugins can also await private prepareTtsPreferences and pass preparedTtsPreferences to the supported synchronous hint overload. The unprepared synchronous hint and preference-path calls remain compatible through 2026-12-31; removal ships in the first January 2027 stable release.";
  readonly docsPath: "/plugins/sdk-migration/async-transcript-and-tts";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-runtime resolveTtsPrefsPath", "openclaw/plugin-sdk/tts-runtime resolveTtsPrefsPath", "openclaw/plugin-sdk/tts-runtime buildTtsSystemPromptHint"];
  readonly diagnostics: readonly ["Bounded DEP_PLUGIN_SDK warning for legacy path resolution and unprepared synchronous hint calls; prepared hints remain silent"];
  readonly tests: readonly ["src/plugin-sdk/tts-preferences-compat.test.ts", "src/tts/tts-preferences.worker.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Host TTS dispatch reuses worker-prepared preference paths while released plugin calls retain synchronous preference resolution. Preference-file reads, stored data, and update behavior are unchanged.";
} | {
  readonly code: "watched-sessions-sync-harness-context";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-07-29";
  readonly deprecated: "2026-10-03";
  readonly warningStarts: "2026-10-03";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await prepareWatchedSessionsHarnessContext with an assertCurrent callback bound to the current host capability. The released buildWatchedSessionsHarnessContext retains its synchronous string-or-undefined result through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#watched-session-harness-context";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-harness-runtime.buildWatchedSessionsHarnessContext"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotation and migration documentation; bounded capability-family warnings on legacy preparation"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugin-sdk/agent-harness-runtime-watched-sessions.test.ts", "src/agents/watched-sessions-prompt.test.ts"];
  readonly releaseNote: "Harness plugins can await watched-session prompt preparation from worker reads. Bundled harnesses use the awaited helper; the synchronous SDK result remains supported for third-party plugins. Prompt bytes, stored data, and update behavior are unchanged.";
} | {
  readonly code: "web-search-sync-provider-list";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-11";
  readonly deprecated: "2026-10-11";
  readonly warningStarts: "2026-10-11";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await runtime.webSearch.listProvidersAsync(params). The synchronous listProviders(params) retains its return shape through 2026-12-31; removal ships in the first January 2027 stable release.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#web-search-provider-lists";
  readonly surfaces: readonly ["PluginRuntime.webSearch.listProviders"];
  readonly diagnostics: readonly ["Bounded DEP_PLUGIN_SDK warning for synchronous web-search provider lists"];
  readonly tests: readonly ["src/web-search/runtime-discovery.test.ts", "src/plugins/runtime/index.test.ts"];
  readonly releaseNote: "Web-search provider lists have an asynchronous runtime API that prepares discovery policy through the shared-state worker. The synchronous plugin API remains supported with a deprecation warning.";
} | {
  readonly code: "workspace-mutation-guard-callback";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-02";
  readonly deprecated: "2026-10-02";
  readonly warningStarts: "2026-10-02";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await database preparation before ensureAgentWorkspace and use SQL-free guard.assertHost for live authority. Internal recovery predicates run on the worker transaction connection.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#workspace-mutation-guards";
  readonly surfaces: readonly ["api.runtime.agent.ensureAgentWorkspace.beforePersistentApply"];
  readonly diagnostics: readonly ["@deprecated JSDoc and one DEP_WORKSPACE_MUTATION_GUARD warning per process", "Warning explains before-dispatch timing and deprecated but allowed synchronous OpenClaw DB access"];
  readonly tests: readonly ["src/plugins/runtime/runtime-agent.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Released callbacks and their synchronous OpenClaw DB access remain supported. The legacy check runs once before worker dispatch, outside admission grants; use the typed guard for live revocation at commit. Removal ships in the first January 2027 stable release after the final compatibility day, 2026-12-31.";
} | {
  readonly code: "plugin-sdk-session-header-link";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-10-01";
  readonly deprecated: "2026-10-12";
  readonly warningStarts: "2026-10-12";
  readonly removeAfter: "2027-01-12";
  readonly replacement: "Register a plugin-owned `session-header` accessory that renders its own content; the host no longer supplies session conversation-link metadata";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#session-header-link-helper";
  readonly surfaces: readonly ["openclaw/plugin-sdk/control-ui.createSessionHeaderLink"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotation and shipped Plugin SDK surface check"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "`createSessionHeaderLink` from 2026.10.1 remains importable but renders nothing, because session conversation links were retired.";
  readonly removalGate?: undefined;
} | {
  readonly code: "gateway-placement-sync-results";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-09-07";
  readonly deprecated: "2026-10-02";
  readonly warningStarts: "2026-10-02";
  readonly removalGate: "stable-deprecation-period";
  readonly replacement: "Await getManyAsync, retireSessionPlacementAsync, listPendingWorkspaceResultsAsync, getWorkspaceResultReconcilingSessionIdsAsync, getAdmittedDeviceSessionCountsAsync, and deferOrphanedRequestsAsync on the Gateway context. For placement standing-grant preparation, await resolveBindingAsync, retainAsync, and validateAsync. Placement get/getMany read committed in-process receipts only; cold reads require getAsync/getManyAsync. Synchronous placement inventories and writes retain their deprecated signatures but fail with migration guidance; use listAsync, listForReconcileAsync, clearLocalTurnClaimsAfterRestartAsync, retireSessionPlacementAsync, and the result-reader replacements. Other listed surfaces follow their owner-specific migration contracts.";
  readonly docsPath: "/plugins/sdk-migration/compatibility-policy#gateway-placement-and-publication-readers";
  readonly surfaces: readonly ["GatewayRequestHandlerOptions.context.workerSessionPlacementService.getMany", "GatewayRequestHandlerOptions.context.workerSessionPlacementService.retireSessionPlacement", "GatewayRequestHandlerOptions.context.workerSessionPlacementService.clearLocalTurnClaimsAfterRestart", "GatewayRequestHandlerOptions.context.workerPlacementDispatchService.getAdmittedDeviceSessionCounts", "GatewayRequestHandlerOptions.context.placementStandingGrants.resolveBinding", "GatewayRequestHandlerOptions.context.placementStandingGrants.retain", "GatewayRequestHandlerOptions.context.placementStandingGrants.validate", "GatewayRequestHandlerOptions.context.workerSessionPlacementService.listPendingWorkspaceResults", "GatewayRequestHandlerOptions.context.workerSessionPlacementService.getWorkspaceResultReconcilingSessionIds", "GatewayRequestHandlerOptions.context.githubPublicationService.deferOrphanedRequests", "getPluginRuntimeGatewayRequestScope().context"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and migration documentation; placement reads, retirement, and restart clearing warn once per plugin and capability family on legacy use, while GitHub orphan deferral shares the github-publication family warning"];
  readonly tests: readonly ["src/plugin-sdk/gateway-placement-compat.test.ts", "src/gateway/worker-environments/placement-store.test.ts", "src/gateway/worker-environments/placement-turn-claims.worker.test.ts", "src/gateway/operator-approval-placement-grants.test.ts", "src/gateway/worker-environments/device-placement-demand.test.ts", "src/gateway/github-publication-boundaries.test.ts", "src/gateway/github-repository-publication.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Placement reads, retirement, device demand, standing-grant preparation, and GitHub orphan deferral expose awaited methods while retaining the synchronous Gateway-context contracts shipped to plugins in 2026.9.7, 2026.9.8, and 2026.10.1-beta.1. Internal placement operations use the SQLite worker; stored data and update behavior are unchanged.";
  readonly removeAfter?: undefined;
} | {
  readonly code: "channel-webhook-listener-config-inputs";
  readonly status: "deprecated";
  readonly owner: "config";
  readonly introduced: "2026-09-26";
  readonly deprecated: "2026-09-26";
  readonly warningStarts: "2026-09-26";
  readonly removalGate: "stable-deprecation-period";
  readonly replacement: "Use legacyWebhook for canonical listener config. Doctor migrates stored webhookPort/webhookHost and webhook.port inputs; deprecated optional TypeScript properties preserve config producer source compatibility until an approved ordinary stable removal.";
  readonly docsPath: "/gateway/doctor/config-migrations#channel-webhook-listeners";
  readonly surfaces: readonly ["TelegramAccountConfig.webhookPort", "TelegramAccountConfig.webhookHost", "FeishuConfig.webhookPort", "FeishuConfig.webhookHost", "FeishuAccountConfig.webhookPort", "FeishuAccountConfig.webhookHost", "MSTeamsWebhookConfig.port", "NextcloudTalkAccountConfig.webhookPort", "NextcloudTalkAccountConfig.webhookHost"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and plugin-owned Doctor migration"];
  readonly tests: readonly ["extensions/telegram/src/doctor.test.ts", "extensions/feishu/src/doctor-contract.test.ts", "extensions/msteams/config-doctor-api.test.ts", "extensions/nextcloud-talk/src/doctor-contract.test.ts"];
  readonly removeAfter?: undefined;
  readonly releaseNote?: undefined;
} | {
  readonly removalGate?: undefined;
  readonly code: "conversation-binding-sync-mutations";
  readonly status: "deprecated";
  readonly owner: "channel";
  readonly introduced: "2026-09-20";
  readonly deprecated: "2026-09-20";
  readonly warningStarts: "2026-09-20";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await getSessionBindingService().bind, unbind, inspectByConversationAsync, resolveByConversationAsync, touchAsync, resolveRuntimeConversationBindingRouteAsync, and the Async-suffixed thread-binding lifecycle setters. Bundled current-conversation mutations and session listings use the existing worker owner. Project prepared inspection facts with inspectRuntimeConversationBindingRoute. Legacy external adapters retain their synchronous projection contract.";
  readonly docsPath: "/plugins/sdk-runtime/channel#awaited-conversation-binding-mutations";
  readonly surfaces: readonly ["SessionBindingService.touch", "SessionBindingService.resolveByConversation", "SessionBindingAdapter.touch", "SessionBindingAdapter.resolveByConversation", "resolveRuntimeConversationBindingRoute", "ChannelConversationBindingSupport.setIdleTimeoutBySessionKey", "ChannelConversationBindingSupport.setMaxAgeBySessionKey", "api.runtime.channel.threadBindings.setIdleTimeoutBySessionKey", "api.runtime.channel.threadBindings.setMaxAgeBySessionKey", "@openclaw/discord.setThreadBindingIdleTimeoutBySessionKey", "@openclaw/discord.setThreadBindingMaxAgeBySessionKey", "@openclaw/telegram.setTelegramThreadBindingIdleTimeoutBySessionKey", "@openclaw/telegram.setTelegramThreadBindingMaxAgeBySessionKey", "@openclaw/matrix.setMatrixThreadBindingIdleTimeoutBySessionKey", "@openclaw/matrix.setMatrixThreadBindingMaxAgeBySessionKey"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and bounded capability-family warnings on legacy binding calls"];
  readonly tests: readonly ["src/infra/outbound/session-binding-service.test.ts", "src/channels/plugins/binding-routing.test.ts", "src/channels/plugins/conversation-bindings.test.ts"];
  readonly releaseNote: "Plugins can expose explicitly awaited binding mutations and pure ownership inspection; synchronous public methods remain supported while callers and persistence owners migrate.";
})[], {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "plugin-sdk-channel-setup-input-fields";
  readonly owner: "channel";
  readonly replacement: "plugin-local setup input intersections that declare each owning channel field; retain each field until a new published-plugin artifact sweep finds no reader";
  readonly docsPath: "/plugins/sdk-migration#published-channel-setup-compatibility";
  readonly surfaces: readonly ["ChannelSetupInput.privateKey", "ChannelSetupInput.secret", "ChannelSetupInput.botToken", "ChannelSetupInput.appToken", "ChannelSetupInput.signingSecret", "ChannelSetupInput.mode", "ChannelSetupInput.cliPath", "ChannelSetupInput.authDir", "ChannelSetupInput.httpUrl", "ChannelSetupInput.httpPort", "ChannelSetupInput.webhookPath", "ChannelSetupInput.webhookUrl", "ChannelSetupInput.userId", "ChannelSetupInput.accessToken", "ChannelSetupInput.password", "ChannelSetupInput.deviceName", "ChannelSetupInput.url", "ChannelSetupInput.baseUrl", "ChannelSetupInput.code", "ChannelSetupInput.groupChannels", "ChannelSetupInput.dmAllowlist", "ChannelSetupInput.autoDiscoverChannels"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on the reader-backed ChannelSetupInput compatibility tier", "published-plugin artifact reader sweep required before field removal"];
  readonly tests: readonly ["src/plugin-sdk/channel-setup.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "ChannelSetupInput keeps its reader-backed channel fields through the dated migration window while plugins move them into plugin-local input types.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "plugin-sdk-broad-runtime-barrels";
  readonly owner: "sdk";
  readonly replacement: "focused plugin SDK subpaths for each runtime capability; retain until bundled and published plugins no longer import any of the seven broad barrels";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-runtime", "openclaw/plugin-sdk/agent-runtime loadModelCatalog params.useCache", "openclaw/plugin-sdk/agent-runtime loadModelCatalog params.cacheOnly", "openclaw/plugin-sdk/agent-runtime loadModelCatalog params.metadataSnapshot", "openclaw/plugin-sdk/agent-runtime loadModelCatalog", "openclaw/plugin-sdk/cli-runtime", "openclaw/plugin-sdk/conversation-runtime", "openclaw/plugin-sdk/hook-runtime", "openclaw/plugin-sdk/media-runtime", "openclaw/plugin-sdk/media-runtime buildAgentMediaPayload", "openclaw/plugin-sdk/plugin-runtime", "openclaw/plugin-sdk/security-runtime"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on broad plugin SDK barrels", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugins/contracts/plugin-sdk-subpaths.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Broad agent, CLI, conversation, hook, media, plugin, and security runtime barrels remain available while bundled and external plugins migrate to focused subpaths.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "plugin-sdk-provider-owned-helper-shims";
  readonly owner: "provider";
  readonly replacement: "provider-local auth, model, replay, OAuth, and stream helper APIs; retain until every helper is migrated in official providers and absent from published plugins";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["openclaw/plugin-sdk/provider-stream MOONSHOT_THINKING_STREAM_HOOKS", "openclaw/plugin-sdk/provider-stream-shared defaultToolStreamExtraParams", "openclaw/plugin-sdk/provider-stream-shared stripTrailingAnthropicAssistantPrefillWhenThinking", "openclaw/plugin-sdk/provider-stream-shared createAnthropicThinkingPrefillPayloadWrapper", "openclaw/plugin-sdk/provider-stream-shared OpenAICompatibleThinkingLevel", "openclaw/plugin-sdk/provider-stream-shared isOpenAICompatibleThinkingEnabled", "openclaw/plugin-sdk/provider-stream-shared DeepSeekV4ThinkingLevel", "openclaw/plugin-sdk/provider-stream-shared DeepSeekV4ReasoningEffort", "openclaw/plugin-sdk/provider-stream-shared createDeepSeekV4OpenAICompatibleThinkingWrapper", "openclaw/plugin-sdk/provider-stream-shared createThinkingOnlyFinalTextWrapper", "openclaw/plugin-sdk/provider-stream-shared createGoogleThinkingPayloadWrapper", "openclaw/plugin-sdk/provider-stream-shared createGoogleThinkingStreamWrapper", "openclaw/plugin-sdk/provider-model-shared isProxyReasoningUnsupportedModelHint", "openclaw/plugin-sdk/provider-model-shared NATIVE_ANTHROPIC_REPLAY_HOOKS", "openclaw/plugin-sdk/provider-model-shared PASSTHROUGH_GEMINI_REPLAY_HOOKS", "openclaw/plugin-sdk/provider-auth toFormUrlEncoded", "openclaw/plugin-sdk/provider-auth generatePkceVerifierChallenge", "openclaw/plugin-sdk/provider-oauth-runtime OAuthProvider", "openclaw/plugin-sdk/provider-oauth-runtime OAuthProviderInfo"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations naming provider-local replacements", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugins/contracts/plugin-sdk-subpaths.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Provider-specific auth, model, replay, OAuth, and stream shortcuts remain as deprecated SDK shims while providers move to their local APIs.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "message-presentation-legacy-bridges";
  readonly owner: "channel";
  readonly replacement: "MessagePresentation values and channel presentation renderers; retain until reply producers and official channel packages no longer emit or read legacy interactive replies";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["InteractiveReplyButton.value", "InteractiveReplyButton.url", "InteractiveReplyButton.webApp", "InteractiveReplyButton.web_app", "InteractiveReplyOption.value", "InteractiveReplyButton", "InteractiveReplyOption", "InteractiveReplyBlock", "InteractiveReply", "normalizeInteractiveReply", "hasInteractiveReplyBlocks", "presentationToInteractiveReply", "presentationToInteractiveControlsReply", "interactiveReplyToPresentation", "resolveInteractiveTextFallback", "src/auto-reply ReplyPayload.interactive", "openclaw/plugin-sdk/reply-payload ReplyPayload.interactive", "reduceInteractiveReply", "@openclaw/discord buildDiscordInteractiveComponents", "@openclaw/slack buildSlackInteractiveBlocks"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations naming MessagePresentation replacements", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/interactive/payload.test.ts", "src/plugin-sdk/reply-payload.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Legacy interactive reply values and channel-specific rendering bridges remain available while producers migrate to MessagePresentation.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "plugin-sdk-focused-compat-aliases";
  readonly owner: "sdk";
  readonly replacement: "the focused replacement named by each TypeScript @deprecated annotation; retain until every enumerated alias has zero bundled and published readers";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["openclaw/plugin-sdk/acp-runtime __testing", "openclaw/plugin-sdk/channel-inbound BuildChannelTurnContextParams", "openclaw/plugin-sdk/channel-inbound BuiltChannelTurnContext", "openclaw/plugin-sdk/channel-inbound buildChannelTurnContext", "openclaw/plugin-sdk/channel-inbound finalizeChannelInboundContext", "openclaw/plugin-sdk/channel-inbound filterChannelTurnSupplementalContext", "openclaw/plugin-sdk/channel-send-result ChannelSendRawResult", "openclaw/plugin-sdk/keyed-async-queue KeyedAsyncQueue.getTailMapForTesting", "openclaw/plugin-sdk/persistent-dedupe PersistentDedupeLegacyPathOptions.lockOptions", "openclaw/plugin-sdk/retry-runtime createTelegramRetryRunner", "openclaw/plugin-sdk/ssrf-policy SsrfPolicyOptions.allowPrivateNetwork", "openclaw/plugin-sdk/ssrf-policy ssrfPolicyFromAllowPrivateNetwork", "openclaw/plugin-sdk/tts-runtime TtsSynthesisStreamResult", "openclaw/plugin-sdk/tts-runtime TtsRuntimeFacade._test"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations naming focused replacements", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugin-sdk/channel-inbound.test.ts", "src/plugin-sdk/ssrf-policy.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Focused SDK compatibility aliases remain available through a dated window while callers adopt their annotated replacements.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "agent-harness-terminal-result-aliases";
  readonly owner: "agent-runtime";
  readonly replacement: "AgentHarnessAttemptResult.terminal and AgentHarnessDeliveryDefaults.visibleReplies; retain until harness migration verifies that legacy terminal fields and sourceVisibleReplies are unread";
  readonly docsPath: "/plugins/sdk-agent-harness";
  readonly surfaces: readonly ["AgentHarnessAttemptResult.aborted", "AgentHarnessAttemptResult.externalAbort", "AgentHarnessAttemptResult.timedOut", "AgentHarnessAttemptResult.idleTimedOut", "AgentHarnessAttemptResult.timedOutDuringCompaction", "AgentHarnessAttemptResult.timedOutDuringToolExecution", "AgentHarnessAttemptResult.timedOutByRunBudget", "AgentHarnessAttemptResult.promptError", "AgentHarnessAttemptResult.promptErrorSource", "AgentHarnessDeliveryDefaults.sourceVisibleReplies"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on agent harness result and delivery defaults", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/agents/harness/settled-turn-finalization-result.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Agent harness result booleans and sourceVisibleReplies remain available while harnesses migrate to terminal outcomes and visibleReplies.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "official-plugin-export-aliases";
  readonly owner: "channel";
  readonly replacement: "MessagePresentation renderers and host-owned timeout/runtime behavior; retain until minimum supported official plugin packages no longer import these aliases";
  readonly docsPath: "/plugins/compatibility#current-compatibility-areas";
  readonly surfaces: readonly ["@openclaw/discord buildDiscordInteractiveComponents", "@openclaw/discord normalizeDiscordListenerTimeoutMs", "@openclaw/discord normalizeDiscordInboundWorkerTimeoutMs", "@openclaw/discord isAbortError", "@openclaw/discord runDiscordTaskWithTimeout", "@openclaw/slack buildSlackInteractiveBlocks"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on published official-plugin exports", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Published channel presentation and Discord timeout aliases remain available while consumers move to their canonical exports and host-owned behavior.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "memory-host-compatibility-aliases";
  readonly owner: "sdk";
  readonly replacement: "canonical memory cache/FTS tables; retain until supported memory integrations are verified to use canonical tables without overrides and legacy table data remains preserved";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["@openclaw/memory-host-sdk ensureMemoryIndexSchema.embeddingCacheTable", "@openclaw/memory-host-sdk ensureMemoryIndexSchema.ftsTable"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on memory-host SDK compatibility fields", "plugin boundary report memory-host SDK summary"];
  readonly tests: readonly ["packages/memory-host-sdk/src/host/memory-schema.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Memory-host table overrides remain available until supported artifact usage and legacy data preservation are verified.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "plugin-runtime-api-compat-aliases";
  readonly owner: "plugin-execution";
  readonly replacement: "the namespaced plugin API and focused runtime methods named per surface; retain until all enumerated flat API and runtime aliases have no readers";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["OpenClawPluginApi.registerSessionExtension", "OpenClawPluginApi.enqueueNextTurnInjection", "OpenClawPluginApi.registerControlUiDescriptor", "OpenClawPluginApi.registerRuntimeLifecycle", "OpenClawPluginApi.registerAgentEventSubscription", "OpenClawPluginApi.emitAgentEvent", "OpenClawPluginApi.setRunContext", "OpenClawPluginApi.getRunContext", "OpenClawPluginApi.clearRunContext", "OpenClawPluginApi.registerSessionSchedulerJob", "OpenClawPluginApi.registerSessionAction", "OpenClawPluginApi.sendSessionAttachment", "OpenClawPluginApi.scheduleSessionTurn", "OpenClawPluginApi.unscheduleSessionTurnsByTag", "PluginHookContext.senderExternalId", "PluginAttachmentChannelHints.telegram", "PluginAttachmentChannelHints.slack", "AgentPromptSurfaceKind pi_main", "PluginRuntime.channel.reply.createReplyDispatcherWithTyping", "PluginRuntime.channel.reply.resolveHumanDelayConfig", "PluginRuntime.channel.reply.dispatchReplyFromConfig", "PluginRuntime.channel.reply.finalizeInboundContext", "PluginRuntime.channel.media.fetchRemoteMedia", "PluginRuntime.channel.session.resolveStorePath", "PluginRuntime.channel.session.recordInboundSession", "PluginRuntime.channel.inbound.runPreparedReply", "PluginRuntime.channel.turn", "PluginRuntime.system.requestHeartbeatNow"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on plugin API and runtime aliases", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugins/captured-registration.test.ts", "src/plugins/runtime/index.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Flat plugin registration and broad runtime aliases remain available while plugins migrate to namespaced APIs and focused runtime methods.";
}, {
  readonly status: "removal-pending";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly code: "plugin-provider-manifest-compat-aliases";
  readonly owner: "provider";
  readonly replacement: "manifest-owned plugin kind/setup metadata and model catalog registration; retain until providers no longer publish runtime kind or legacy catalog hooks";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["DefinePluginEntryOptions.kind", "SingleProviderPluginOptions.kind", "OpenClawPluginDefinition.kind", "PluginPackageChannel.cliAddOptions", "ProviderPlugin.catalog", "ProviderPlugin.staticCatalog", "ProviderPlugin.suppressBuiltInModel", "ProviderPlugin.augmentModelCatalog", "ProviderBuiltInModelSuppressionContext"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on plugin manifest and provider catalog aliases", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugins/contracts/package-manifest.contract.test.ts", "src/plugins/contracts/provider-catalog-deprecation.contract.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Runtime plugin kind/setup metadata and provider catalog hooks remain available while plugins migrate ownership into manifests and catalog registrations.";
}, {
  readonly code: "media-legacy-projection";
  readonly status: "removal-pending";
  readonly owner: "sdk";
  readonly introduced: "2026-07-24";
  readonly deprecated: "2026-07-24";
  readonly warningStarts: "2026-07-24";
  readonly removeAfter: "2026-10-01";
  readonly replacement: "ordered `MsgContext.media` / `InboundMediaFacts[]`; typed hook `media` and `originalMedia`; `Attachment*` template variables; and `openclaw/plugin-sdk/media-local-roots`; retain until a clean published-plugin artifact sweep verifies that the legacy media surfaces have no readers";
  readonly docsPath: "/plugins/sdk-migration#media-legacy-projection";
  readonly surfaces: readonly ["MsgContext MediaPath/MediaUrl/MediaType and plural/staging fields", "openclaw/plugin-sdk/agent-media-payload", "ChannelInboundMediaPayload and buildChannelInboundMediaPayload", "MediaPayload and buildMediaPayload", "message hook mediaPath/mediaUrl/mediaType and plural/original metadata aliases", "MediaPath/MediaUrl/MediaType/MediaDir template variables"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations naming the facts-first replacement", "plugin boundary report compatibility inventory with the approved removeAfter date", "SDK, hook, and media template migration documentation"];
  readonly tests: readonly ["src/sessions/user-turn-transcript.media.test.ts", "src/hooks/message-hook-mappers.test.ts", "src/media-understanding/runner.cli-audio.test.ts", "src/plugins/compat/registry.test.ts", "src/plugins/contracts/plugin-sdk-subpaths.test.ts"];
  readonly releaseNote: "Legacy parallel media projections remain available as deprecated compatibility while plugins move to ordered facts, typed hook media, Attachment templates, and the focused media-local-roots SDK.";
}, {
  readonly code: "node-workspace-sync-acquisition";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-08-21";
  readonly deprecated: "2026-09-15";
  readonly warningStarts: "2026-09-15";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Await context.acquireManagedWorkspaceAsync(request) and release the returned lease in finally. Retain synchronous acquisition for supported external plugins through 2026-12-31; removal ships in the first January 2027 stable release.";
  readonly docsPath: "/plugins/sdk-migration/how-to-migrate#managed-node-workspace-acquisition";
  readonly surfaces: readonly ["OpenClawPluginNodeHostCommandContext.acquireManagedWorkspace"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotation and bounded capability-family warning on legacy workspace acquisition"];
  readonly tests: readonly ["src/node-host/invoke-workspace.test.ts", "src/node-host/node-worker-workspace-retention.test.ts", "extensions/codex/src/node-exec-server.test.ts"];
  readonly releaseNote: "Node-host plugins can await managed workspace acquisition while existing synchronous callers retain their immediate lease contract.";
}, {
  readonly code: "plugin-state-sync-keyed-store";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-05-29";
  readonly deprecated: "2026-09-11";
  readonly warningStarts: "2026-09-11";
  readonly removeAfter: "2026-12-31";
  readonly replacement: "Use api.runtime.state.openKeyedStoreV2 or createPluginStateKeyedStoreV2, await data-only operations, and replace update/deleteIf closures with observe/compareAndApply. Synchronous methods retain commit-before-return through 2026-12-31; removal ships in the first January 2027 stable release without an SDK major.";
  readonly docsPath: "/plugins/sdk-runtime/state-and-system#synchronous-keyed-store-migration";
  readonly surfaces: readonly ["api.runtime.state.openSyncKeyedStore", "PluginStateSyncKeyedStore", "createPluginStateSyncKeyedStore", "PluginStateSyncKeyedStore.register", "PluginStateSyncKeyedStore.registerIfAbsent", "PluginStateSyncKeyedStore.update", "PluginStateSyncKeyedStore.deleteIf", "PluginStateSyncKeyedStore.lookup", "PluginStateSyncKeyedStore.lookupMany", "PluginStateSyncKeyedStore.consume", "PluginStateSyncKeyedStore.delete", "PluginStateSyncKeyedStore.entries", "PluginStateSyncKeyedStore.count", "PluginStateSyncKeyedStore.clear", "PluginStateKeyedStore.update", "PluginStateKeyedStore.deleteIf"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and state-store migration documentation", "plugin compatibility inventory; legacy writer migrations use the shared once-per-plugin-and-capability-family warning policy"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugin-state/plugin-state-store.test.ts", "src/plugin-state/plugin-state-store.runtime.test.ts", "test/type-contracts/plugin-state-store-runtime.ts", "src/plugins/loader.runtime-registry.test.ts"];
  readonly releaseNote: "Bundled plugins use worker-owned keyed-state operations and conditional prepared writes. Released synchronous stores and opaque callbacks retain their timing with a bounded migration warning; schemas, retention, and update behavior are unchanged.";
}, {
  readonly code: "memory-read-result-statusless-success";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-04-28";
  readonly deprecated: "2026-08-19";
  readonly warningStarts: "2026-08-19";
  readonly removalGate: "stable-deprecation-period";
  readonly replacement: '`MemoryReadResult` with explicit `status: "ok" | "not_found"`';
  readonly docsPath: "/plugins/sdk-migration#memory-read-missing-results";
  readonly surfaces: readonly ["statusless external memory manager read results"];
  readonly diagnostics: readonly ["host memory-manager acquisition adapter"];
  readonly tests: readonly ["src/plugins/memory-runtime.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "External memory managers must return explicit not-found status for absence; statusless results retain legacy successful-read semantics through an announced ordinary stable deprecation window.";
}, {
  readonly code: "context-engine-legacy-host-param-default";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-07-29";
  readonly replacement: "`ContextEngineInfo.acceptedHostParams` for restricted projection; omitted declarations receive full host params";
  readonly docsPath: "/concepts/context-engine#the-contextengine-interface";
  readonly surfaces: readonly ["ContextEngineInfo.acceptedHostParams and undeclared-engine default projection"];
  readonly diagnostics: readonly ["plugin compatibility registry and context engine guide"];
  readonly tests: readonly ["src/context-engine/host-param-projection.test.ts"];
  readonly releaseNote: "The undeclared context-engine host-parameter compatibility default was removed; engines without `acceptedHostParams` now receive all current host fields.";
}, {
  readonly code: "removed-global-api-provider-publication";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-05-27";
  readonly replacement: "provider plugins via `api.registerProvider(...)`; host/runtime code registers against its lifecycle-owned `ApiRegistry`";
  readonly docsPath: "/plugins/sdk-migration#process-global-api-provider-publication";
  readonly surfaces: readonly ["openclaw/plugin-sdk/llm registerApiProvider", "openclaw/plugin-sdk/llm unregisterApiProviders"];
  readonly diagnostics: readonly ["plugin SDK compatibility registry and migration guide"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The process-global API-provider publication facade was removed; provider plugins now publish through their lifecycle-owned registration, and host runtimes register directly on their prepared ApiRegistry.";
}, {
  readonly code: "legacy-deactivate-hook-alias";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-05-16";
  readonly replacement: "`gateway_stop` hook";
  readonly docsPath: "/plugins/sdk-migration#deactivate-hook-alias";
  readonly surfaces: readonly ["api.on(\"deactivate\", ...)", "plugin typed hook registration"];
  readonly diagnostics: readonly ["plugin compatibility registry and migration guide"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: 'The deprecated `api.on("deactivate", ...)` hook alias was removed; plugins must register cleanup with `gateway_stop`.';
}, {
  readonly code: "legacy-subagent-spawning-hook";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-05-30";
  readonly replacement: "`subagent_spawned` for post-launch observation; core session-binding adapters for thread routing";
  readonly docsPath: "/plugins/hooks#upcoming-deprecations";
  readonly surfaces: readonly ["api.on(\"subagent_spawning\", ...)", "PluginHookSubagentSpawningEvent", "PluginHookSubagentSpawningResult", "SubagentLifecycleHookRunner.runSubagentSpawning"];
  readonly diagnostics: readonly ["plugin compatibility registry and migration guide"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: '`api.on("subagent_spawning", ...)` was removed; core now owns thread-bound subagent routing, and `subagent_spawned` remains available for observation.';
}, {
  readonly code: "removed-skill-proposal-hooks";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-09-29";
  readonly removeAfter: "2026-10-07";
  readonly docsPath: "/plugins/sdk-migration/removed-surfaces#skill-workshop-proposal-hooks";
  readonly surfaces: readonly ["api.on(\"skill_proposal_evaluate\", ...)", "api.on(\"skill_proposal_changed\", ...)", "openclaw/plugin-sdk/plugin-entry.PluginHookSkillProposalEvaluateEvent", "openclaw/plugin-sdk/plugin-entry.PluginHookSkillProposalEvaluateResult", "openclaw/plugin-sdk/plugin-entry.PluginHookSkillProposalEvaluationOutcome", "openclaw/plugin-sdk/plugin-entry.PluginHookSkillProposalChangedEvent", "openclaw/plugin-sdk/plugin-entry.PluginHookSkillProposalKind", "openclaw/plugin-sdk/plugin-entry.PluginHookSkillEvaluationFinding", "openclaw/plugin-sdk/plugin-entry.PluginHookSkillBundleFile", "openclaw/plugin-sdk/plugin-entry.PluginHookSkillBundleSnapshot", "PluginHookSkillChangedEvent.proposal"];
  readonly diagnostics: readonly ["plugin compatibility registry and migration guide"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The Skill Workshop `skill_proposal_evaluate` and `skill_proposal_changed` plugin hooks were removed with Workshop proposals; Workshop now applies changes immediately with restorable versions.";
}, {
  readonly code: "hook-only-plugin-shape";
  readonly status: "active";
  readonly owner: "sdk";
  readonly introduced: "2026-04-24";
  readonly replacement: "explicit capability registration";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["plugin shape inspection", "plugins inspect", "status diagnostics"];
  readonly diagnostics: readonly ["plugin compatibility notice"];
  readonly tests: readonly ["src/plugins/status.test.ts", "src/plugins/contracts/shape.contract.test.ts"];
}, {
  readonly code: "deprecated-memory-embedding-provider-api";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-05-21";
  readonly replacement: "`api.registerEmbeddingProvider(...)` and `contracts.embeddingProviders`";
  readonly docsPath: "/plugins/sdk-migration#memory-embedding-provider-api";
  readonly surfaces: readonly ["api.registerMemoryEmbeddingProvider(...)", "contracts.memoryEmbeddingProviders", "openclaw/plugin-sdk/memory-core-host-engine-embeddings registerMemoryEmbeddingProvider", "plugin compatibility registry and migration guide"];
  readonly diagnostics: readonly ["plugin compatibility registry and migration guide"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Memory-specific embedding provider registration was removed; plugins now use the generic embedding provider contract.";
}, {
  readonly code: "plugin-sdk-session-agent-resolution-aliases";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-08-29";
  readonly deprecated: "2026-08-29";
  readonly warningStarts: "2026-08-29";
  readonly removeAfter: "2026-11-29";
  readonly replacement: "`resolveSessionAgentIdsStrict` and `resolveSessionAgentIdStrict` with an explicit agent, agent-scoped session key, prepared fallback, or persisted owner";
  readonly docsPath: "/plugins/compatibility#session-agent-resolution-aliases";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-scope-runtime resolveSessionAgentIds and resolveSessionAgentId", "openclaw/plugin-sdk/agent-runtime session-agent resolver aliases", "openclaw/plugin-sdk/agent-harness-runtime session-agent resolver aliases", "openclaw/plugin-sdk/memory-core-host-runtime-core session-agent resolver alias", "openclaw/plugin-sdk/memory-host-core session-agent resolver alias"];
  readonly diagnostics: readonly ["TypeScript deprecated SDK alias annotations", "plugin compatibility registry"];
  readonly tests: readonly ["src/plugin-sdk/agent-scope-runtime.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Legacy Plugin SDK session-agent resolver names preserve ambient system-agent fallback while published plugins migrate to strict owner-required aliases.";
}, {
  readonly code: "agent-harness-credential-prompt-string-argument";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-08-08";
  readonly deprecated: "2026-09-09";
  readonly warningStarts: "2026-09-09";
  readonly removeAfter: "2026-11-30";
  readonly replacement: "options object `{ controlToolsAvailable }`";
  readonly docsPath: "/plugins/sdk-migration/removed-surfaces#credential-prompt-builder";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-harness-runtime buildCredentialSafetyPrompt string argument"];
  readonly diagnostics: readonly ["JSDoc parameter deprecation", "plugin compatibility registry"];
  readonly tests: readonly ["src/agents/credential-safety-prompt.test.ts"];
  readonly releaseNote: "The credential prompt helper remains available with private login-code handoff and capability-aware terminal setup guidance; its ignored legacy string argument is supported through 2026-11-30.";
}, {
  readonly code: "removed-session-transcript-file-api";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-07-01";
  readonly replacement: "session identity (`sessionKey`/`sessionId`), `SessionTranscriptUpdate.target`, and Gateway/runtime session helpers";
  readonly docsPath: "/plugins/sdk-migration#removed-session-and-transcript-file-apis";
  readonly surfaces: readonly ["saveSessionStore", "resolveSessionTranscriptPathInDir", "resolveAndPersistSessionFile", "readLatestAssistantTextFromSessionTranscript", "SessionTranscriptUpdate.sessionFile", "sessionFiles", "transcriptPath", "sessionFile", "plugins inspect compatibility notices"];
  readonly diagnostics: readonly ["plugin compatibility notice"];
  readonly tests: readonly ["src/plugins/status.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Session/transcript file APIs were removed with the SQLite session storage flip; plugins now use session identity and Gateway/runtime session helpers.";
}, {
  readonly code: "hook.before_tool_call.terminal-block-approval";
  readonly status: "active";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-04-29";
  readonly docsPath: "/plugins/hooks";
  readonly surfaces: readonly ["before_tool_call block result", "before_tool_call approval result"];
  readonly diagnostics: readonly ["hook runner contract check"];
  readonly tests: readonly ["src/agents/agent-tools.before-tool-call.e2e.test.ts"];
}, {
  readonly code: "hook.llm-observer.privacy-payload";
  readonly status: "active";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-04-29";
  readonly docsPath: "/plugins/hooks";
  readonly surfaces: readonly ["llm_input", "llm_output", "agent_end", "allowConversationAccess"];
  readonly diagnostics: readonly ["conversation access hook contract check"];
  readonly tests: readonly ["src/agents/cli-runner.reliability.test.ts", "src/config/schema.help.quality.test.ts"];
}, {
  readonly code: "api.capture.runtime-registrars";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-29";
  readonly docsPath: "/plugins/architecture-internals";
  readonly surfaces: readonly ["createCapturedPluginRegistration", "capturePluginRegistration", "OpenClawPluginApi"];
  readonly diagnostics: readonly ["runtime registration capture contract check"];
  readonly tests: readonly ["src/plugins/captured-registration.test.ts"];
}, {
  readonly code: "channel.runtime.envelope-config-metadata";
  readonly status: "active";
  readonly owner: "channel";
  readonly introduced: "2026-04-29";
  readonly docsPath: "/plugins/sdk-channel-plugins";
  readonly surfaces: readonly ["api.registerChannel", "channel setup metadata", "channel message envelope"];
  readonly diagnostics: readonly ["channel runtime contract check"];
  readonly tests: readonly ["src/plugin-sdk/channel-entry-contract.test.ts", "src/plugins/captured-registration.test.ts"];
}, {
  readonly code: "whatsapp-web-inbound-flat-message-aliases";
  readonly status: "removed";
  readonly owner: "channel";
  readonly introduced: "2026-05-30";
  readonly replacement: "WhatsApp `WebInboundCallbackMessage` nested contexts: `event`, `payload`, `quote`, `group`, and `platform`";
  readonly docsPath: "/plugins/compatibility";
  readonly surfaces: readonly ["@openclaw/whatsapp WebInboundMessage flat fields", "WhatsApp monitorWebInbox onMessage callback", "WhatsApp monitorWebChannel listenerFactory injected messages"];
  readonly diagnostics: readonly ["plugin compatibility registry and compatibility guide"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "WhatsApp WebInboundMessage flat fields were removed; callbacks now receive only nested inbound contexts.";
}, {
  readonly code: "whatsapp-web-inbound-admission-top-level-fields";
  readonly status: "removed";
  readonly owner: "channel";
  readonly introduced: "2026-06-14";
  readonly replacement: "WhatsApp `WebInboundMessage.admission` fields: `conversation.id`, `accountId`, `ingress.decision`, and `conversation.kind`";
  readonly docsPath: "/plugins/compatibility";
  readonly surfaces: readonly ["@openclaw/whatsapp WebInboundMessage top-level admission fields", "WhatsApp monitorWebInbox onMessage callback", "WhatsApp monitorWebChannel listenerFactory injected messages"];
  readonly diagnostics: readonly ["plugin compatibility registry and compatibility guide"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "WhatsApp WebInboundMessage top-level admission fields were removed; callbacks now read the canonical admission envelope.";
}, {
  readonly code: "sdk-untrusted-context-identifier-aliases";
  readonly status: "removal-pending";
  readonly owner: "sdk";
  readonly introduced: "2026-07-22";
  readonly deprecated: "2026-07-22";
  readonly warningStarts: "2026-07-22";
  readonly removeAfter: "2026-09-08";
  readonly replacement: "`MsgContext.ChannelPromptContext`, `MsgContext.ChannelStructuredContext`, `ChannelStructuredContextEntry`, `SupplementalContextFacts.channelStructuredContext`, and `buildChannelMetadata`; retain the aliases until migration of published plugin readers is verified and explicit breaking-release approval is granted";
  readonly docsPath: "/plugins/compatibility";
  readonly surfaces: readonly ["openclaw/plugin-sdk reply-runtime MsgContext.UntrustedContext and UntrustedStructuredContext", "openclaw/plugin-sdk reply-runtime UntrustedStructuredContextEntry", "openclaw/plugin-sdk channel-inbound SupplementalContextFacts.untrustedContext", "openclaw/plugin-sdk security-runtime buildUntrustedChannelMetadata"];
  readonly diagnostics: readonly ["TypeScript deprecated SDK alias annotations"];
  readonly tests: readonly ["src/auto-reply/reply/inbound-context.test.ts"];
  readonly releaseNote: "Untrusted-named prompt-context SDK identifiers remain wired as deprecated aliases of the channel-named fields while plugins migrate.";
}, {
  readonly code: "channel-explicit-target-parser";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-28";
  readonly replacement: "`messaging.targetResolver` for target normalization and `messaging.resolveOutboundSessionRoute` for session/thread identity";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["ChannelMessagingAdapter.parseExplicitTarget", "openclaw/plugin-sdk/channel-route ChannelRouteExplicitTarget", "openclaw/plugin-sdk/channel-route ChannelRouteExplicitTargetParser", "openclaw/plugin-sdk/channel-route resolveChannelRouteTargetWithParser"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/channels/plugins/contracts/test-helpers/surface-contract-suite.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The deprecated channel explicit-target parser was removed; plugins must normalize targets with `messaging.targetResolver` and project session identity with `messaging.resolveOutboundSessionRoute`.";
}, {
  readonly code: "channel-messaging-targets-subpath";
  readonly status: "removed";
  readonly owner: "sdk";
  readonly introduced: "2026-04-28";
  readonly replacement: "`openclaw/plugin-sdk/channel-targets`";
  readonly docsPath: "/plugins/sdk-migration";
  readonly surfaces: readonly ["openclaw/plugin-sdk/messaging-targets"];
  readonly diagnostics: readonly ["plugin SDK compatibility warning"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugins/contracts/plugin-sdk-subpaths.test.ts"];
  readonly releaseNote: "The deprecated `openclaw/plugin-sdk/messaging-targets` subpath was removed; import target helpers from `openclaw/plugin-sdk/channel-targets`.";
}, {
  readonly code: "bundled-plugin-allowlist";
  readonly status: "active";
  readonly owner: "config";
  readonly introduced: "2026-04-24";
  readonly replacement: "manifest-owned plugin enablement and scoped load plans";
  readonly docsPath: "/plugins/architecture";
  readonly surfaces: readonly ["plugins.allow", "bundled provider startup", "plugins status"];
  readonly diagnostics: readonly ["plugin status report"];
  readonly tests: readonly ["src/plugins/status.test.ts", "src/plugins/config-state.test.ts"];
}, {
  readonly code: "bundled-plugin-enablement";
  readonly status: "active";
  readonly owner: "config";
  readonly introduced: "2026-04-24";
  readonly replacement: "manifest-owned plugin defaults and scoped load plans";
  readonly docsPath: "/plugins/architecture";
  readonly surfaces: readonly ["plugins.entries", "bundled provider startup", "plugins status"];
  readonly diagnostics: readonly ["plugin status report"];
  readonly tests: readonly ["src/plugins/status.test.ts", "src/plugins/config-state.test.ts"];
}, {
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly docsPath: "/plugins/manifest";
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
  readonly code: "activation-agent-harness-hint";
  readonly replacement: "top-level `cliBackends[]` for CLI aliases and future `agentRuntime` ownership metadata";
  readonly surfaces: readonly ["activation.onAgentHarnesses", "activation planner"];
}, {
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly docsPath: "/plugins/manifest";
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
  readonly code: "activation-provider-hint";
  readonly replacement: "`providers[]` manifest ownership";
  readonly surfaces: readonly ["activation.onProviders", "activation planner"];
}, {
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly docsPath: "/plugins/manifest";
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
  readonly code: "activation-channel-hint";
  readonly replacement: "`channels[]` manifest ownership";
  readonly surfaces: readonly ["activation.onChannels", "activation planner"];
}, {
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly docsPath: "/plugins/manifest";
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
  readonly code: "activation-command-hint";
  readonly replacement: "`commandAliases` or command contribution metadata";
  readonly surfaces: readonly ["activation.onCommands", "activation planner"];
}, {
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly docsPath: "/plugins/manifest";
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
  readonly code: "activation-route-hint";
  readonly replacement: "HTTP route contribution metadata";
  readonly surfaces: readonly ["activation.onRoutes", "activation planner"];
}, {
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly docsPath: "/plugins/manifest";
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly code: "activation-config-path-hint";
  readonly introduced: "2026-04-27";
  readonly replacement: "manifest contribution ownership for root config surfaces";
  readonly surfaces: readonly ["activation.onConfigPaths", "startup plugin selection"];
  readonly tests: readonly ["src/plugins/channel-plugin-ids.test.ts"];
}, {
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly docsPath: "/plugins/manifest";
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
  readonly code: "activation-capability-hint";
  readonly replacement: "manifest contribution ownership";
  readonly surfaces: readonly ["activation.onCapabilities", "activation planner"];
}, {
  readonly code: "embedded-pi-agent-sdk-aliases";
  readonly status: "removed";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-05-21";
  readonly replacement: "`runEmbeddedAgent` and `EmbeddedAgent*` SDK/runtime names";
  readonly docsPath: "/plugins/sdk-runtime";
  readonly surfaces: readonly ["api.runtime.agent.runEmbeddedPiAgent", "openclaw/extension-api runEmbeddedPiAgent", "openclaw/plugin-sdk/agent-harness-runtime EmbeddedPi* aliases"];
  readonly diagnostics: readonly ["plugin SDK compatibility registry"];
  readonly tests: readonly ["src/plugins/runtime/index.test.ts", "src/plugins/contracts/plugin-sdk-subpaths.test.ts"];
  readonly releaseNote: "The legacy `runEmbeddedPiAgent` and `EmbeddedPi*` plugin aliases were removed; plugins must use the neutral embedded-agent names.";
}, {
  readonly code: "plugin-sdk-shipped-channel-setup-exports";
  readonly status: "deprecated";
  readonly owner: "channel";
  readonly introduced: "2026-07-23";
  readonly deprecated: "2026-07-23";
  readonly warningStarts: "2026-07-23";
  readonly replacement: "retain until supported published packages migrate to plugin-owned config schemas plus generic `openclaw/plugin-sdk/channel-config-schema` and `openclaw/plugin-sdk/setup-runtime` primitives";
  readonly docsPath: "/plugins/sdk-migration#published-channel-setup-compatibility";
  readonly surfaces: readonly ["openclaw/plugin-sdk/bundled-channel-config-schema SlackConfigSchema", "openclaw/plugin-sdk/bundled-channel-config-schema DiscordConfigSchema", "openclaw/plugin-sdk/bundled-channel-config-schema SignalConfigSchema", "openclaw/plugin-sdk/bundled-channel-config-schema MSTeamsConfigSchema", "openclaw/plugin-sdk/setup-runtime createLegacyCompatChannelDmPolicy", "openclaw/plugin-sdk/setup-runtime promptLegacyChannelAllowFromForAccount"];
  readonly diagnostics: readonly ["repository deprecated API usage guard for core and bundled plugins; no external runtime import warning"];
  readonly tests: readonly ["src/plugin-sdk/shipped-channel-compat.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Published OpenClaw channel packages through 2026.7.1 remain loadable while they migrate to plugin-owned config and setup helpers.";
}, {
  readonly code: "generated-bundled-channel-config-fallback";
  readonly status: "active";
  readonly owner: "channel";
  readonly introduced: "2026-04-24";
  readonly replacement: "manifest registry `channelConfigs` metadata";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["generated bundled channel config metadata", "channel config validation"];
  readonly diagnostics: readonly ["channel config metadata fallback"];
  readonly tests: readonly ["src/plugins/contracts/config-footprint-guardrails.test.ts"];
}, {
  readonly code: "setup-runtime-fallback";
  readonly status: "active";
  readonly owner: "setup";
  readonly introduced: "2026-04-24";
  readonly replacement: "`setup.requiresRuntime: false` with complete setup descriptors";
  readonly docsPath: "/plugins/manifest/setup-and-auth#setup-reference";
  readonly surfaces: readonly ["setup-api runtime fallback", "setup.requiresRuntime omitted"];
  readonly diagnostics: readonly ["setup registry runtime diagnostic"];
  readonly tests: readonly ["src/plugins/setup-registry.test.ts", "src/plugins/setup-registry.runtime.test.ts"];
}];
//#endregion
//#region src/plugins/compat/registry.d.ts
type PluginCompatCode = (typeof PLUGIN_COMPAT_RECORDS)[number]["code"];
//#endregion
//#region src/infra/npm-registry-spec.d.ts
/**
 * Parsed registry-only npm spec accepted by plugin install flows.
 * Selectors are limited to exact versions and dist-tags; URL/git/file specs
 * are rejected before they can execute on the gateway host.
 */
type ParsedRegistryNpmSpec = {
  name: string;
  raw: string;
  selector?: string;
  selectorKind: "none" | "exact-version" | "tag";
  selectorIsPrerelease: boolean;
};
//#endregion
//#region src/plugins/install-source-info.types.d.ts
/** Warning emitted while describing plugin package install source metadata. */
type PluginInstallSourceWarning = "invalid-clawhub-spec" | "invalid-npm-spec" | "invalid-default-choice" | "default-choice-missing-source" | "clawhub-spec-floating" | "npm-integrity-without-source" | "npm-spec-floating" | "npm-spec-missing-integrity" | "npm-spec-package-name-mismatch";
/** Pinning state for npm plugin install metadata. */
type PluginInstallNpmPinState = "exact-with-integrity" | "exact-without-integrity" | "floating-with-integrity" | "floating-without-integrity";
/** Parsed npm install source metadata for a plugin package. */
type PluginInstallNpmSourceInfo = {
  spec: string;
  packageName: string;
  expectedPackageName?: string;
  selector?: string;
  selectorKind: ParsedRegistryNpmSpec["selectorKind"];
  exactVersion: boolean;
  expectedIntegrity?: string;
  pinState: PluginInstallNpmPinState;
};
/** Parsed ClawHub install source metadata for a plugin package. */
type PluginInstallClawHubSourceInfo = {
  spec: string;
  packageName: string;
  version?: string;
  exactVersion: boolean;
};
/** Parsed plugin install sources plus validation warnings. */
type PluginInstallSourceInfo = {
  defaultChoice?: PluginPackageInstall["defaultChoice"];
  clawhub?: PluginInstallClawHubSourceInfo;
  npm?: PluginInstallNpmSourceInfo;
  local?: {
    path: string;
  };
  warnings: readonly PluginInstallSourceWarning[];
};
//#endregion
//#region src/plugins/installed-plugin-index-hash.d.ts
/** File metadata signature used to skip unchanged installed plugin files. */
type InstalledPluginFileSignature = {
  size: number;
  mtimeMs: number;
  ctimeMs?: number;
};
//#endregion
//#region src/plugins/plugin-source-admission.types.d.ts
declare const SourceAdmissionReceiptSchema: z.ZodObject<{
  signature: z.ZodString;
  sourceDigest: z.ZodString;
  nativeArtifacts: z.ZodRecord<z.ZodString, z.ZodObject<{
    sourceIdentity: z.ZodString;
    contentHash: z.ZodString;
    sizeBytes: z.ZodNumber;
    capturedPath: z.ZodString;
    namespace: z.ZodString;
    capturedIdentity: z.ZodString;
  }, z.core.$strip>>;
  nativeNamespaces: z.ZodRecord<z.ZodString, z.ZodObject<{
    sourceDirectory: z.ZodString;
    capturedRoot: z.ZodString;
    managed: z.ZodBoolean;
    referenceRoot: z.ZodOptional<z.ZodString>;
    members: z.ZodRecord<z.ZodString, z.ZodObject<{
      source: z.ZodString;
      sourceIdentity: z.ZodString;
      capturedIdentity: z.ZodString;
      boundaryChecked: z.ZodBoolean;
      contentHash: z.ZodOptional<z.ZodString>;
      sizeBytes: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
  }, z.core.$strip>>;
}, z.core.$strip>;
type PluginSourceAdmissionReceipt = SchemaContract<z.infer<typeof SourceAdmissionReceiptSchema>>;
//#endregion
//#region src/plugins/installed-plugin-index-types.d.ts
/** Schema version for installed plugin index files. */
declare const INSTALLED_PLUGIN_INDEX_VERSION = 1;
declare const INSTALLED_PLUGIN_INDEX_MIGRATION_VERSION = 1;
type InstalledPluginIndexRefreshReason = "missing" | "stale-manifest" | "stale-package" | "source-changed" | "policy-changed" | "migration" | "host-contract-changed" | "compat-registry-changed" | "manual";
type InstalledPluginStartupInfo = {
  sidecar: boolean;
  memory: boolean;
  agentHarnesses: readonly string[];
  /**
   * Manifest activation.onConfigPaths copied into the installed index for
   * pre-manifest startup scoping. Missing on older persisted index files.
   */
  configPaths?: readonly string[];
};
type InstalledPluginContributionInfo = {
  channels: readonly string[];
  channelConfigs: readonly string[];
  providers: readonly string[];
  modelCatalogProviders: readonly string[];
  modelSupportPrefixes: readonly string[];
  modelSupportPatterns: readonly string[];
  autoEnableProviderIds: readonly string[];
  commandAliases: readonly string[];
  contracts: Readonly<Record<string, readonly string[]>>;
};
type InstalledPluginInstallRecordInfo = PluginInstallRecord;
type InstalledPluginPackageChannelInfo = PluginPackageChannel;
/** One manifest-backed plugin entry in the generated installed plugin index. */
type InstalledPluginIndexRecord = {
  pluginId: string;
  packageName?: string;
  packageVersion?: string;
  /** Hash of the top-level installRecords entry; used to detect source-changed invalidation. */
  installRecordHash?: string;
  /** Native source admissions survive process restarts while the install owner is unchanged. */
  sourceAdmissions?: Record<string, PluginSourceAdmissionReceipt>;
  /**
   * Package-authored openclaw.install metadata. This describes catalog/package
   * install intent and must not be treated as the durable install record.
   */
  packageInstall?: PluginInstallSourceInfo;
  packageChannel?: InstalledPluginPackageChannelInfo;
  packageBuild?: OpenClawPackageBuild;
  manifestPath: string;
  manifestHash: string;
  /** Hash of the doctor-contract artifact selected by the runtime resolver. */
  doctorContractHash?: string;
  doctorContractFile?: InstalledPluginFileSignature;
  manifestFile?: InstalledPluginFileSignature;
  format?: PluginManifestRecord["format"];
  bundleFormat?: PluginManifestRecord["bundleFormat"];
  source?: string;
  setupSource?: string;
  packageJson?: {
    path: string;
    hash: string;
    fileSignature?: InstalledPluginFileSignature;
  };
  rootDir: string;
  origin: PluginManifestRecord["origin"];
  enabled: boolean;
  enabledByDefault?: boolean;
  enabledByDefaultOnPlatforms?: readonly string[];
  syntheticAuthRefs?: readonly string[];
  startup: InstalledPluginStartupInfo;
  contributions?: InstalledPluginContributionInfo;
  compat: readonly PluginCompatCode[];
};
/** Full installed-index payload used by control-plane plugin registry loading. */
type InstalledPluginIndex = {
  version: typeof INSTALLED_PLUGIN_INDEX_VERSION;
  warning?: string;
  hostContractVersion: string;
  compatRegistryVersion: string;
  migrationVersion: typeof INSTALLED_PLUGIN_INDEX_MIGRATION_VERSION;
  policyHash: string;
  generatedAtMs: number;
  /** Selected workspace used to build this index. Missing for omitted and legacy scopes. */
  workspaceDir?: string;
  refreshReason?: InstalledPluginIndexRefreshReason;
  installRecords: Readonly<Record<string, InstalledPluginInstallRecordInfo>>;
  plugins: readonly InstalledPluginIndexRecord[];
  diagnostics: readonly PluginDiagnostic[];
};
//#endregion
//#region src/plugins/plugin-registry-snapshot.types.d.ts
/** Source class for plugin registry snapshots used by diagnostics and cache decisions. */
type PluginRegistrySnapshotSource = "provided" | "persisted" | "derived";
/** Which registry facts differ for one plugin; the sources alone can be identical. */
type PluginRegistryDifferenceFacet = "record" | "install" | "diagnostics";
type PluginRegistryDifference = {
  pluginId: string;
  changed: readonly PluginRegistryDifferenceFacet[];
  persistedSource: string | null;
  derivedSource: string | null;
};
type PluginRegistrySnapshotDiagnostic = {
  level: "info" | "warn";
  code: "persisted-registry-missing" | "persisted-registry-stale-policy" | "persisted-registry-stale-source";
  message: string;
  differences?: readonly PluginRegistryDifference[];
};
//#endregion
//#region src/plugins/provider-owner-index.d.ts
type DeclaredProviderOwnerIndex = ReadonlyMap<string, ReadonlySet<string>>;
//#endregion
//#region src/plugins/plugin-metadata-snapshot.types.d.ts
type PluginProviderAuthAliasCandidate = {
  plugin: PluginManifestRecord;
  target: string;
  baseUrls?: readonly string[];
  /** First eligible declaration owns public map order, even if a later candidate wins. */
  order: number;
};
type PluginProviderAuthContribution = {
  plugin: PluginManifestRecord;
  envProviders: readonly PluginManifestSetupProvider[];
  evidenceProviders: readonly PluginManifestSetupProvider[];
  fallbackProviderRefs: readonly string[];
};
type PluginMetadataSnapshotOwnerMaps = {
  channels: ReadonlyMap<string, readonly string[]>;
  channelAccountKeyPolicies?: ReadonlyMap<string, ChannelAccountKeyPolicy>;
  channelConfigs: ReadonlyMap<string, readonly string[]>;
  providers: ReadonlyMap<string, readonly string[]>;
  modelCatalogProviders: ReadonlyMap<string, readonly string[]>;
  cliBackends: ReadonlyMap<string, readonly string[]>;
  setupProviders: ReadonlyMap<string, readonly string[]>;
  commandAliases: ReadonlyMap<string, readonly string[]>;
  contracts: ReadonlyMap<string, readonly string[]>;
  /** Empty views must not fall through to process-current model normalization policies. */
  modelIdNormalizationPolicies: ReadonlyMap<string, PluginManifestModelIdNormalizationProvider>;
  providerAuthContributions: readonly PluginProviderAuthContribution[];
  providerAuthAliases?: ReadonlyMap<string, readonly PluginProviderAuthAliasCandidate[]>;
  providerEndpoints?: readonly PluginManifestProviderEndpoint[];
  providerRequests?: ReadonlyMap<string, PluginManifestProviderRequestProvider>;
  providersManagingOwnAvailability?: ReadonlySet<string>;
};
type PluginMetadataSnapshotMetrics = {
  registrySnapshotMs: number;
  manifestRegistryMs: number;
  ownerMapsMs: number;
  totalMs: number;
  indexPluginCount: number;
  manifestPluginCount: number;
};
type PluginMetadataSnapshot = {
  policyHash: string;
  configFingerprint?: string;
  pluginIds?: readonly string[];
  registrySource?: PluginRegistrySnapshotSource;
  workspaceDir?: string;
  index: InstalledPluginIndex;
  /** The original workspace-scoped index described by registrySource, before runtime unions. */
  registryIndex: InstalledPluginIndex;
  registryDiagnostics: readonly PluginRegistrySnapshotDiagnostic[];
  manifestRegistry: PluginManifestRegistry;
  /** Independently validated bundled owners, including packages shadowed by active plugins. */
  bundledManifestRegistry?: PluginManifestRegistry;
  plugins: readonly PluginManifestRecord[];
  diagnostics: readonly PluginDiagnostic[];
  byPluginId: ReadonlyMap<string, PluginManifestRecord>;
  normalizePluginId: (pluginId: string) => string;
  owners: PluginMetadataSnapshotOwnerMaps;
  /** Strict first-winner literal/setup ownership, separate from public alias maps. */
  declaredProviderOwners: DeclaredProviderOwnerIndex;
  metrics: PluginMetadataSnapshotMetrics;
  discovery?: PluginDiscoveryResult;
};
type PluginMetadataRegistryView = Pick<PluginMetadataSnapshot, "index" | "manifestRegistry" | "discovery" | "workspaceDir"> & Partial<Pick<PluginMetadataSnapshot, "declaredProviderOwners" | "normalizePluginId">>;
//#endregion
//#region src/plugins/plugin-registry-snapshot.d.ts
type PluginRegistrySnapshot = InstalledPluginIndex;
//#endregion
export { DeclaredProviderOwnerIndex as a, PluginMetadataSnapshotOwnerMaps as i, PluginMetadataRegistryView as n, PluginCompatCode as o, PluginMetadataSnapshot as r, PluginRegistrySnapshot as t };