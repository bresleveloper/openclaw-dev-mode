import { _n as PluginManifestSetupProvider, gn as PluginManifestProviderRequestProvider, hn as PluginManifestProviderEndpoint, j as PluginInstallRecord, nn as PluginDiagnostic, pn as PluginManifestModelIdNormalizationProvider, r as OpenClawConfig, t as ConfigFileSnapshot, yn as ChannelAccountKeyPolicy } from "./types.openclaw-LzSbb55e.js";
import "./types.secrets-BR-Cncxg.js";
import "./types-BnfxNjkF.js";
import { c as PluginPackageInstall, i as PluginDiscoveryResult, n as PluginManifestRegistry, o as OpenClawPackageBuild, s as PluginPackageChannel, t as PluginManifestRecord } from "./manifest-registry-CMnhqUB6.js";
import "./openclaw-state-db-CMVCVfJm.js";
import { z } from "zod";
import "json5";
//#region src/infra/deferred-plugin-migrations.d.ts
declare const deferredPluginMigrationSchema: z.ZodObject<{
  pluginId: z.ZodString;
  reason: z.ZodString;
  command: z.ZodString;
  requiresStateMigration: z.ZodOptional<z.ZodLiteral<true>>;
  requiresDoctorInspection: z.ZodOptional<z.ZodLiteral<true>>;
  configPaths: z.ZodOptional<z.ZodArray<z.ZodArray<z.ZodString>>>;
  validationExcludedPaths: z.ZodOptional<z.ZodArray<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
type DeferredPluginMigration = z.infer<typeof deferredPluginMigrationSchema>;
//#endregion
//#region src/plugins/compat/registry-records.d.ts
declare const PLUGIN_COMPAT_RECORDS: readonly [{
  readonly code: "conversation-binding-sync-mutations";
  readonly status: "deprecated";
  readonly owner: "channel";
  readonly introduced: "2026-09-20";
  readonly deprecated: "2026-09-20";
  readonly warningStarts: "2026-09-20";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "Await getSessionBindingService().inspectByConversationAsync, resolveByConversationAsync, touchAsync, resolveRuntimeConversationBindingRouteAsync, and the Async-suffixed thread-binding lifecycle setters. Project prepared inspection facts with inspectRuntimeConversationBindingRoute. Async dispatch retains an explicit synchronous fallback for legacy external adapters; remaining bind/unbind and other storage operations are separate migration work.";
  readonly docsPath: "/plugins/sdk-runtime/channel#awaited-conversation-binding-mutations";
  readonly surfaces: readonly ["SessionBindingService.touch", "SessionBindingService.resolveByConversation", "SessionBindingAdapter.touch", "SessionBindingAdapter.resolveByConversation", "resolveRuntimeConversationBindingRoute", "ChannelConversationBindingSupport.setIdleTimeoutBySessionKey", "ChannelConversationBindingSupport.setMaxAgeBySessionKey", "api.runtime.channel.threadBindings.setIdleTimeoutBySessionKey", "api.runtime.channel.threadBindings.setMaxAgeBySessionKey"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on synchronous methods; resolver migration is recorded here and in docs while its broad barrel remains deprecated; no runtime warnings"];
  readonly tests: readonly ["src/infra/outbound/session-binding-service.test.ts", "src/channels/plugins/binding-routing.test.ts", "src/channels/plugins/conversation-bindings.test.ts"];
  readonly releaseNote: "Plugins can expose explicitly awaited binding mutations and pure ownership inspection; synchronous public methods remain supported while callers and persistence owners migrate.";
}, ...({
  code: "plugin-sdk-agent-config-primitives-subpath" | "plugin-sdk-channel-logging-subpath" | "plugin-sdk-channel-secret-runtime-subpath" | "plugin-sdk-channel-streaming-subpath" | "plugin-sdk-group-access-subpath" | "plugin-sdk-matrix-subpath" | "plugin-sdk-text-runtime-subpath" | "plugin-sdk-zod-subpath";
  status: "removed";
  owner: "channel" | "config" | "sdk";
  introduced: string;
  replacement: "`openclaw/plugin-sdk/channel-config-schema`" | "`openclaw/plugin-sdk/channel-inbound` and `openclaw/plugin-sdk/channel-outbound`" | "`openclaw/plugin-sdk/channel-ingress-runtime`" | "`openclaw/plugin-sdk/channel-outbound`" | "`openclaw/plugin-sdk/channel-secret-basic-runtime` and `openclaw/plugin-sdk/channel-secret-tts-runtime`" | "`openclaw/plugin-sdk/logging-core`, `openclaw/plugin-sdk/text-chunking`, `openclaw/plugin-sdk/text-utility-runtime`, and `openclaw/plugin-sdk/string-coerce-runtime`" | "`openclaw/plugin-sdk/run-command`" | "the direct `zod` package import";
  docsPath: string;
  surfaces: string[];
  diagnostics: string[];
  tests: string[];
  releaseNote: "The deprecated `agent-config-primitives` Plugin SDK subpath was removed; plugins now use maintained config-schema primitives." | "The deprecated `channel-logging` Plugin SDK subpath was removed; channel logging helpers now come from the inbound and outbound channel surfaces." | "The deprecated `channel-secret-runtime` Plugin SDK subpath was removed; plugins now use the focused basic and TTS secret-runtime subpaths." | "The deprecated `channel-streaming` Plugin SDK subpath was removed; plugins now import channel streaming helpers from `channel-outbound`." | "The deprecated `group-access` Plugin SDK subpath was removed; plugins now resolve message admission through `channel-ingress-runtime`." | "The deprecated `matrix` Plugin SDK facade was removed; command execution now uses the generic `run-command` subpath." | "The deprecated `text-runtime` Plugin SDK facade was removed; plugins now import logging, chunking, text utility, and string coercion helpers from their focused subpaths." | "The deprecated `zod` Plugin SDK re-export was removed; plugins now import `zod` directly.";
  deprecated?: undefined;
  warningStarts?: undefined;
  removeAfter?: undefined;
  removalGate?: undefined;
} | {
  releaseNote?: undefined;
  code: "plugin-sdk-channel-lifecycle-subpath" | "plugin-sdk-channel-message-subpath" | "plugin-sdk-channel-reply-pipeline-subpath" | "plugin-sdk-config-runtime-subpath" | "plugin-sdk-inbound-reply-dispatch-subpath" | "plugin-sdk-infra-runtime-subpath";
  status: "deprecated" | "removal-pending";
  owner: "channel" | "config" | "sdk";
  introduced: string;
  deprecated: string;
  warningStarts: string;
  removeAfter: "2026-10-01" | undefined;
  removalGate: "next-plugin-sdk-major" | undefined;
  replacement: "`api.pluginConfig`, `openclaw/plugin-sdk/config-mutation`, `openclaw/plugin-sdk/runtime-config-snapshot`, and `openclaw/plugin-sdk/config-contracts`; retain until supported external plugin migration is verified" | "`openclaw/plugin-sdk/channel-inbound` and `openclaw/plugin-sdk/channel-outbound`" | "`openclaw/plugin-sdk/channel-outbound` and `openclaw/plugin-sdk/channel-inbound`; retain until supported external plugin migration is verified" | "`openclaw/plugin-sdk/channel-outbound`; retain until supported external plugin migration is verified" | "focused subpaths including `openclaw/plugin-sdk/delivery-queue-runtime`, `openclaw/plugin-sdk/diagnostic-runtime`, `openclaw/plugin-sdk/error-runtime`, `openclaw/plugin-sdk/exec-approvals-runtime`, `openclaw/plugin-sdk/fetch-runtime`, and `openclaw/plugin-sdk/ssrf-runtime`; retain until supported external plugin migration is verified and system-event snapshot inspection and consumption have a modern public replacement";
  docsPath: string;
  surfaces: string[];
  diagnostics: string[];
  tests: string[];
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
})[], {
  readonly code: "plugin-sdk-channel-setup-input-fields";
  readonly status: "deprecated";
  readonly owner: "channel";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly replacement: "plugin-local setup input intersections that declare each owning channel field";
  readonly docsPath: "/plugins/sdk-migration#published-channel-setup-compatibility";
  readonly surfaces: readonly ["ChannelSetupInput.privateKey", "ChannelSetupInput.secret", "ChannelSetupInput.botToken", "ChannelSetupInput.appToken", "ChannelSetupInput.signingSecret", "ChannelSetupInput.mode", "ChannelSetupInput.cliPath", "ChannelSetupInput.authDir", "ChannelSetupInput.httpUrl", "ChannelSetupInput.httpPort", "ChannelSetupInput.webhookPath", "ChannelSetupInput.webhookUrl", "ChannelSetupInput.userId", "ChannelSetupInput.accessToken", "ChannelSetupInput.password", "ChannelSetupInput.deviceName", "ChannelSetupInput.url", "ChannelSetupInput.baseUrl", "ChannelSetupInput.code", "ChannelSetupInput.groupChannels", "ChannelSetupInput.dmAllowlist", "ChannelSetupInput.autoDiscoverChannels"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on the reader-backed ChannelSetupInput compatibility tier", "published-plugin artifact reader sweep required before field removal"];
  readonly tests: readonly ["src/plugin-sdk/channel-setup.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "ChannelSetupInput keeps its reader-backed channel fields through the dated migration window while plugins move them into plugin-local input types.";
}, {
  readonly code: "plugin-sdk-broad-runtime-barrels";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly replacement: "focused plugin SDK subpaths for each runtime capability";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["openclaw/plugin-sdk/agent-runtime", "openclaw/plugin-sdk/agent-runtime loadModelCatalog params.useCache", "openclaw/plugin-sdk/agent-runtime loadModelCatalog params.cacheOnly", "openclaw/plugin-sdk/agent-runtime loadModelCatalog params.metadataSnapshot", "openclaw/plugin-sdk/agent-runtime loadModelCatalog", "openclaw/plugin-sdk/cli-runtime", "openclaw/plugin-sdk/conversation-runtime", "openclaw/plugin-sdk/hook-runtime", "openclaw/plugin-sdk/media-runtime", "openclaw/plugin-sdk/media-runtime buildAgentMediaPayload", "openclaw/plugin-sdk/plugin-runtime", "openclaw/plugin-sdk/security-runtime"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on broad plugin SDK barrels", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugins/contracts/plugin-sdk-subpaths.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Broad agent, CLI, conversation, hook, media, plugin, and security runtime barrels remain available while bundled and external plugins migrate to focused subpaths.";
}, {
  readonly code: "plugin-sdk-provider-owned-helper-shims";
  readonly status: "deprecated";
  readonly owner: "provider";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly replacement: "provider-local auth, model, replay, OAuth, and stream helper APIs";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["openclaw/plugin-sdk/provider-stream GOOGLE_THINKING_STREAM_HOOKS", "openclaw/plugin-sdk/provider-stream KILOCODE_THINKING_STREAM_HOOKS", "openclaw/plugin-sdk/provider-stream MOONSHOT_THINKING_STREAM_HOOKS", "openclaw/plugin-sdk/provider-stream MINIMAX_FAST_MODE_STREAM_HOOKS", "openclaw/plugin-sdk/provider-stream OPENAI_RESPONSES_STREAM_HOOKS", "openclaw/plugin-sdk/provider-stream OPENROUTER_THINKING_STREAM_HOOKS", "openclaw/plugin-sdk/provider-stream TOOL_STREAM_DEFAULT_ON_HOOKS", "openclaw/plugin-sdk/provider-stream-shared defaultToolStreamExtraParams", "openclaw/plugin-sdk/provider-stream-shared stripTrailingAnthropicAssistantPrefillWhenThinking", "openclaw/plugin-sdk/provider-stream-shared createAnthropicThinkingPrefillPayloadWrapper", "openclaw/plugin-sdk/provider-stream-shared OpenAICompatibleThinkingLevel", "openclaw/plugin-sdk/provider-stream-shared isOpenAICompatibleThinkingEnabled", "openclaw/plugin-sdk/provider-stream-shared DeepSeekV4ThinkingLevel", "openclaw/plugin-sdk/provider-stream-shared DeepSeekV4ReasoningEffort", "openclaw/plugin-sdk/provider-stream-shared createDeepSeekV4OpenAICompatibleThinkingWrapper", "openclaw/plugin-sdk/provider-stream-shared createThinkingOnlyFinalTextWrapper", "openclaw/plugin-sdk/provider-stream-shared createGoogleThinkingPayloadWrapper", "openclaw/plugin-sdk/provider-stream-shared createGoogleThinkingStreamWrapper", "openclaw/plugin-sdk/provider-model-shared isProxyReasoningUnsupportedModelHint", "openclaw/plugin-sdk/provider-model-shared OPENAI_COMPATIBLE_REPLAY_HOOKS", "openclaw/plugin-sdk/provider-model-shared ANTHROPIC_BY_MODEL_REPLAY_HOOKS", "openclaw/plugin-sdk/provider-model-shared NATIVE_ANTHROPIC_REPLAY_HOOKS", "openclaw/plugin-sdk/provider-model-shared PASSTHROUGH_GEMINI_REPLAY_HOOKS", "openclaw/plugin-sdk/provider-auth DEFAULT_COPILOT_API_BASE_URL", "openclaw/plugin-sdk/provider-auth deriveCopilotApiBaseUrlFromToken", "openclaw/plugin-sdk/provider-auth resolveCopilotApiToken", "openclaw/plugin-sdk/provider-auth-copilot-cache CachedCopilotToken", "openclaw/plugin-sdk/oauth-utils toFormUrlEncoded", "openclaw/plugin-sdk/oauth-utils generatePkceVerifierChallenge", "openclaw/plugin-sdk/provider-oauth-runtime OAuthProvider", "openclaw/plugin-sdk/provider-oauth-runtime OAuthProviderInfo"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations naming provider-local replacements", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugins/contracts/plugin-sdk-subpaths.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Provider-specific auth, model, replay, OAuth, and stream shortcuts remain as deprecated SDK shims while providers move to their local APIs.";
}, {
  readonly code: "message-presentation-legacy-bridges";
  readonly status: "deprecated";
  readonly owner: "channel";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly replacement: "MessagePresentation values and channel presentation renderers";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["InteractiveReplyButton.value", "InteractiveReplyButton.url", "InteractiveReplyButton.webApp", "InteractiveReplyButton.web_app", "InteractiveReplyOption.value", "InteractiveReplyButton", "InteractiveReplyOption", "InteractiveReplyBlock", "InteractiveReply", "normalizeInteractiveReply", "hasInteractiveReplyBlocks", "presentationToInteractiveReply", "presentationToInteractiveControlsReply", "interactiveReplyToPresentation", "resolveInteractiveTextFallback", "src/auto-reply ReplyPayload.interactive", "openclaw/plugin-sdk/reply-payload ReplyPayload.interactive", "reduceInteractiveReply", "@openclaw/discord buildDiscordInteractiveComponents", "@openclaw/slack buildSlackInteractiveBlocks", "@openclaw/telegram buildTelegramInteractiveButtons"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations naming MessagePresentation replacements", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/interactive/payload.test.ts", "src/plugin-sdk/reply-payload.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Legacy interactive reply values and channel-specific rendering bridges remain available while producers migrate to MessagePresentation.";
}, {
  readonly code: "plugin-sdk-focused-compat-aliases";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly replacement: "the focused replacement named by each TypeScript @deprecated annotation";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["openclaw/plugin-sdk/acp-runtime __testing", "openclaw/plugin-sdk/approval-reaction-runtime", "openclaw/plugin-sdk/channel-inbound BuildChannelTurnContextParams", "openclaw/plugin-sdk/channel-inbound BuiltChannelTurnContext", "openclaw/plugin-sdk/channel-inbound buildChannelTurnContext", "openclaw/plugin-sdk/channel-inbound finalizeChannelInboundContext", "openclaw/plugin-sdk/channel-inbound filterChannelTurnSupplementalContext", "openclaw/plugin-sdk/channel-send-result ChannelSendRawResult", "openclaw/plugin-sdk/command-auth", "openclaw/plugin-sdk/command-auth ResolveSenderCommandAuthorizationParams", "openclaw/plugin-sdk/command-auth resolveCommandAuthorizedFromAuthorizers", "openclaw/plugin-sdk/command-auth CommandAuthorizationRuntime", "openclaw/plugin-sdk/command-auth ResolveSenderCommandAuthorizationWithRuntimeParams", "openclaw/plugin-sdk/command-auth resolveDirectDmAuthorizationOutcome", "openclaw/plugin-sdk/command-auth resolveSenderCommandAuthorizationWithRuntime", "openclaw/plugin-sdk/command-auth resolveSenderCommandAuthorization", "openclaw/plugin-sdk/keyed-async-queue KeyedAsyncQueue.getTailMapForTesting", "openclaw/plugin-sdk/persistent-dedupe PersistentDedupeLegacyPathOptions.lockOptions", "openclaw/plugin-sdk/retry-runtime createTelegramRetryRunner", "openclaw/plugin-sdk/ssrf-policy SsrfPolicyOptions.allowPrivateNetwork", "openclaw/plugin-sdk/ssrf-policy ssrfPolicyFromAllowPrivateNetwork", "openclaw/plugin-sdk/tts-runtime TtsSynthesisStreamResult", "openclaw/plugin-sdk/tts-runtime TtsRuntimeFacade._test"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations naming focused replacements", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugin-sdk/channel-inbound.test.ts", "src/plugin-sdk/command-auth.test.ts", "src/plugin-sdk/ssrf-policy.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Focused SDK compatibility aliases remain available through a dated window while callers adopt their annotated replacements.";
}, {
  readonly code: "agent-harness-terminal-result-aliases";
  readonly status: "deprecated";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly replacement: "AgentHarnessAttemptResult.terminal and AgentHarnessDeliveryDefaults.visibleReplies";
  readonly docsPath: "/plugins/sdk-agent-harness";
  readonly surfaces: readonly ["AgentHarnessAttemptResult.aborted", "AgentHarnessAttemptResult.externalAbort", "AgentHarnessAttemptResult.timedOut", "AgentHarnessAttemptResult.idleTimedOut", "AgentHarnessAttemptResult.timedOutDuringCompaction", "AgentHarnessAttemptResult.timedOutDuringToolExecution", "AgentHarnessAttemptResult.timedOutByRunBudget", "AgentHarnessAttemptResult.promptError", "AgentHarnessAttemptResult.promptErrorSource", "AgentHarnessDeliveryDefaults.sourceVisibleReplies"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on agent harness result and delivery defaults", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/agents/harness/settled-turn-finalization-result.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Agent harness result booleans and sourceVisibleReplies remain available while harnesses migrate to terminal outcomes and visibleReplies.";
}, {
  readonly code: "official-plugin-export-aliases";
  readonly status: "deprecated";
  readonly owner: "channel";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly replacement: "the canonical testing export, MessagePresentation renderers, and host-owned timeout/runtime behavior";
  readonly docsPath: "/plugins/compatibility#current-compatibility-areas";
  readonly surfaces: readonly ["@openclaw/google-meet __testing", "@openclaw/discord buildDiscordInteractiveComponents", "@openclaw/discord normalizeDiscordListenerTimeoutMs", "@openclaw/discord normalizeDiscordInboundWorkerTimeoutMs", "@openclaw/discord isAbortError", "@openclaw/discord runDiscordTaskWithTimeout", "@openclaw/slack buildSlackInteractiveBlocks"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on published official-plugin exports", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["extensions/google-meet/index.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Published Google Meet testing, channel presentation, and Discord timeout aliases remain available while consumers move to their canonical exports and host-owned behavior.";
}, {
  readonly code: "memory-host-compatibility-aliases";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly replacement: "canonical memory cache/FTS tables and getRuntimeConfig or caller-provided config";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["@openclaw/memory-host-sdk ensureMemoryIndexSchema.embeddingCacheTable", "@openclaw/memory-host-sdk ensureMemoryIndexSchema.ftsTable", "@openclaw/memory-host-sdk/runtime-core loadConfig", "@openclaw/memory-host-sdk/host/openclaw-runtime loadConfig"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on memory-host SDK compatibility fields", "plugin boundary report memory-host SDK summary"];
  readonly tests: readonly ["packages/memory-host-sdk/src/host/memory-schema.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Memory-host cache-table overrides and runtime config reload aliases remain available while callers migrate to canonical tables and prepared config.";
}, {
  readonly code: "plugin-runtime-api-compat-aliases";
  readonly status: "deprecated";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly replacement: "the namespaced plugin API and focused runtime methods named per surface";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["OpenClawPluginApi.registerSessionExtension", "OpenClawPluginApi.enqueueNextTurnInjection", "OpenClawPluginApi.registerControlUiDescriptor", "OpenClawPluginApi.registerRuntimeLifecycle", "OpenClawPluginApi.registerAgentEventSubscription", "OpenClawPluginApi.emitAgentEvent", "OpenClawPluginApi.setRunContext", "OpenClawPluginApi.getRunContext", "OpenClawPluginApi.clearRunContext", "OpenClawPluginApi.registerSessionSchedulerJob", "OpenClawPluginApi.registerSessionAction", "OpenClawPluginApi.sendSessionAttachment", "OpenClawPluginApi.scheduleSessionTurn", "OpenClawPluginApi.unscheduleSessionTurnsByTag", "PluginHookContext.senderExternalId", "PluginAttachmentChannelHints.telegram", "PluginAttachmentChannelHints.slack", "AgentPromptSurfaceKind pi_main", "PluginRuntime.channel.reply.createReplyDispatcherWithTyping", "PluginRuntime.channel.reply.resolveHumanDelayConfig", "PluginRuntime.channel.reply.dispatchReplyFromConfig", "PluginRuntime.channel.reply.finalizeInboundContext", "PluginRuntime.channel.media.fetchRemoteMedia", "PluginRuntime.channel.session.resolveStorePath", "PluginRuntime.channel.session.recordInboundSession", "PluginRuntime.channel.inbound.runPreparedReply", "PluginRuntime.channel.turn", "PluginRuntime.system.requestHeartbeatNow"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on plugin API and runtime aliases", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugins/captured-registration.test.ts", "src/plugins/runtime/index.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Flat plugin registration and broad runtime aliases remain available while plugins migrate to namespaced APIs and focused runtime methods.";
}, {
  readonly code: "plugin-provider-manifest-compat-aliases";
  readonly status: "deprecated";
  readonly owner: "provider";
  readonly introduced: "2026-07-25";
  readonly deprecated: "2026-07-25";
  readonly warningStarts: "2026-07-25";
  readonly removeAfter: "2026-10-01";
  readonly replacement: "manifest-owned plugin kind/setup metadata and model catalog registration";
  readonly docsPath: "/plugins/sdk-migration#compatibility-policy";
  readonly surfaces: readonly ["DefinePluginEntryOptions.kind", "SingleProviderPluginOptions.kind", "OpenClawPluginDefinition.kind", "PluginPackageChannel.cliAddOptions", "ProviderPlugin.catalog", "ProviderPlugin.staticCatalog", "ProviderPlugin.suppressBuiltInModel", "ProviderPlugin.augmentModelCatalog", "ProviderBuiltInModelSuppressionContext"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations on plugin manifest and provider catalog aliases", "plugin boundary report compatibility inventory"];
  readonly tests: readonly ["src/plugins/contracts/package-manifest.contract.test.ts", "src/plugins/contracts/provider-catalog-deprecation.contract.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "Runtime plugin kind/setup metadata and provider catalog hooks remain available while plugins migrate ownership into manifests and catalog registrations.";
}, {
  readonly code: "media-legacy-projection";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-07-24";
  readonly deprecated: "2026-07-24";
  readonly warningStarts: "2026-07-24";
  readonly removeAfter: "2026-10-01";
  readonly replacement: "ordered `MsgContext.media` / `InboundMediaFacts[]`; typed hook `media` and `originalMedia`; `Attachment*` template variables; and `openclaw/plugin-sdk/media-local-roots`";
  readonly docsPath: "/plugins/sdk-migration#media-legacy-projection";
  readonly surfaces: readonly ["MsgContext MediaPath/MediaUrl/MediaType and plural/staging fields", "openclaw/plugin-sdk/agent-media-payload", "ChannelInboundMediaPayload and buildChannelInboundMediaPayload", "MediaPayload and buildMediaPayload", "message hook mediaPath/mediaUrl/mediaType and plural/original metadata aliases", "MediaPath/MediaUrl/MediaType/MediaDir template variables"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations naming the facts-first replacement", "plugin boundary report compatibility inventory with the approved removeAfter date", "SDK, hook, and media template migration documentation"];
  readonly tests: readonly ["src/sessions/user-turn-transcript.media.test.ts", "src/hooks/message-hook-mappers.test.ts", "src/media-understanding/runner.cli-audio.test.ts", "src/plugins/compat/registry.test.ts", "src/plugins/contracts/plugin-sdk-subpaths.test.ts"];
  readonly releaseNote: "Legacy parallel media projections remain available as deprecated compatibility while plugins move to ordered facts, typed hook media, Attachment templates, and the focused media-local-roots SDK.";
}, {
  readonly code: "plugin-tasks-sync-reads";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-09-12";
  readonly deprecated: "2026-09-12";
  readonly warningStarts: "2026-09-12";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "Await the 14 read methods on api.runtime.tasks.async.runs, flows, and managedFlows, plus createManaged, tryCreateManaged, setWaiting, resume, finish, fail, requestCancel, and runTask on api.runtime.tasks.async.managedFlows. Reconcile outcome-unknown errors before retrying creation or child linkage. Retain synchronous methods until supported external-plugin migration and explicit breaking-release approval; native cancellation remains on the existing surface.";
  readonly docsPath: "/plugins/sdk-runtime/background-work";
  readonly surfaces: readonly ["api.runtime.tasks.runs get/list/findLatest/resolve", "api.runtime.tasks.flows get/list/findLatest/resolve/getTaskSummary", "api.runtime.tasks.managedFlows get/list/findLatest/resolve/getTaskSummary", "api.runtime.tasks.managedFlows createManaged/tryCreateManaged/setWaiting/resume/finish/fail/requestCancel/runTask"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and migration documentation; no runtime warnings"];
  readonly tests: readonly ["src/infra/sqlite-worker-task-runtime.test.ts", "src/infra/sqlite-worker-managed-task-link.test.ts", "extensions/webhooks/index.test.ts"];
  readonly releaseNote: "Plugins can opt into worker-backed task and flow reads plus managed-flow writes and child linkage through tasks.async while synchronous methods remain available for external compatibility. Cold registry and configuration preparation remains synchronous.";
}, {
  readonly code: "plugin-state-sync-keyed-store";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-05-29";
  readonly deprecated: "2026-09-11";
  readonly warningStarts: "2026-09-11";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "`api.runtime.state.openKeyedStore` and `PluginStateKeyedStore`; await operations while keeping transactional callbacks synchronous. Retain the sync adapter until a supported external-plugin migration and explicit breaking-release approval.";
  readonly docsPath: "/plugins/sdk-runtime/state-and-system#synchronous-keyed-store-migration";
  readonly surfaces: readonly ["api.runtime.state.openSyncKeyedStore", "PluginStateSyncKeyedStore", "createPluginStateSyncKeyedStore", "PluginStateKeyedStore.update", "PluginStateKeyedStore.deleteIf"];
  readonly diagnostics: readonly ["TypeScript @deprecated annotations and state-store migration documentation", "plugin compatibility inventory; no new runtime warnings"];
  readonly tests: readonly ["src/plugins/compat/registry.test.ts", "src/plugin-state/plugin-state-store.test.ts", "src/plugin-state/plugin-state-store.runtime.test.ts", "src/plugin-sdk/plugin-state-store-runtime.test.ts", "src/plugins/loader.runtime-registry.test.ts"];
  readonly releaseNote: "Synchronous plugin keyed stores remain supported through the next Plugin SDK major while plugins migrate to awaited keyed-store operations; trust eligibility and transactional callbacks are unchanged.";
}, {
  readonly code: "memory-read-result-statusless-success";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-04-28";
  readonly deprecated: "2026-08-19";
  readonly warningStarts: "2026-08-19";
  readonly removalGate: "next-plugin-sdk-major";
  readonly replacement: "`MemoryReadResult` with explicit `status: \"ok\" | \"not_found\"`";
  readonly docsPath: "/plugins/sdk-migration#memory-read-missing-results";
  readonly surfaces: readonly ["statusless external memory manager read results"];
  readonly diagnostics: readonly ["host memory-manager acquisition adapter"];
  readonly tests: readonly ["src/plugins/memory-runtime.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "External memory managers must return explicit not-found status for absence; statusless results retain legacy successful-read semantics through the next Plugin SDK major.";
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
  readonly releaseNote: "The deprecated `api.on(\"deactivate\", ...)` hook alias was removed; plugins must register cleanup with `gateway_stop`.";
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
  readonly releaseNote: "`api.on(\"subagent_spawning\", ...)` was removed; core now owns thread-bound subagent routing, and `subagent_spawned` remains available for observation.";
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
  readonly code: "deprecated-session-store-beta5-api";
  readonly status: "deprecated";
  readonly owner: "sdk";
  readonly introduced: "2026-05-21";
  readonly deprecated: "2026-07-12";
  readonly warningStarts: "2026-07-12";
  readonly removeAfter: "2026-10-12";
  readonly replacement: "`getSessionEntry(...)`, `listSessionEntries(...)`, and row-level session mutations";
  readonly docsPath: "/plugins/sdk-migration#removed-session-and-transcript-file-apis";
  readonly surfaces: readonly ["openclaw/plugin-sdk/session-store-runtime loadSessionStore", "openclaw/plugin-sdk/session-store-runtime updateSessionStore", "openclaw/plugin-sdk/session-store-runtime resolveSessionFilePath", "openclaw/plugin-sdk/session-store-runtime resolveSessionStoreEntry", "openclaw package root loadSessionStore", "openclaw package root saveSessionStore"];
  readonly diagnostics: readonly ["plugin SDK deprecation"];
  readonly tests: readonly ["src/plugin-sdk/session-store-runtime.test.ts", "src/index.test.ts", "src/plugins/compat/registry.test.ts"];
  readonly releaseNote: "The beta.5 session-store import set and package-root whole-store aliases remain available while official plugins and package consumers migrate to row-level session access.";
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
  readonly diagnostics: readonly ["hook runner contract probe"];
  readonly tests: readonly ["src/plugins/hooks.security.test.ts", "src/agents/agent-tools.before-tool-call.e2e.test.ts"];
}, {
  readonly code: "hook.llm-observer.privacy-payload";
  readonly status: "active";
  readonly owner: "agent-runtime";
  readonly introduced: "2026-04-29";
  readonly docsPath: "/plugins/hooks";
  readonly surfaces: readonly ["llm_input", "llm_output", "agent_end", "allowConversationAccess"];
  readonly diagnostics: readonly ["conversation access hook contract probe"];
  readonly tests: readonly ["src/agents/cli-runner.reliability.test.ts", "src/config/schema.help.quality.test.ts"];
}, {
  readonly code: "api.capture.runtime-registrars";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-29";
  readonly docsPath: "/plugins/architecture-internals";
  readonly surfaces: readonly ["createCapturedPluginRegistration", "capturePluginRegistration", "OpenClawPluginApi"];
  readonly diagnostics: readonly ["runtime registration capture contract probe"];
  readonly tests: readonly ["src/plugins/captured-registration.test.ts"];
}, {
  readonly code: "channel.runtime.envelope-config-metadata";
  readonly status: "active";
  readonly owner: "channel";
  readonly introduced: "2026-04-29";
  readonly docsPath: "/plugins/sdk-channel-plugins";
  readonly surfaces: readonly ["api.registerChannel", "channel setup metadata", "channel message envelope"];
  readonly diagnostics: readonly ["channel runtime contract probe"];
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
  readonly code: "bundled-channel-sdk-compat-facades";
  readonly status: "active";
  readonly owner: "sdk";
  readonly introduced: "2026-04-28";
  readonly replacement: "generic channel SDK subpaths or plugin-local `api.ts` / `runtime-api.ts` barrels for new plugins";
  readonly docsPath: "/plugins/sdk-overview";
  readonly surfaces: readonly ["openclaw/plugin-sdk/discord component message helpers", "openclaw/plugin-sdk/telegram-account resolveTelegramAccount"];
  readonly diagnostics: readonly ["plugin SDK compatibility registry"];
  readonly tests: readonly ["src/plugin-sdk/discord.test.ts", "src/plugin-sdk/telegram-account.test.ts", "src/plugins/contracts/plugin-sdk-package-contract-guardrails.test.ts"];
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
  readonly code: "activation-agent-harness-hint";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly replacement: "top-level `cliBackends[]` for CLI aliases and future `agentRuntime` ownership metadata";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["activation.onAgentHarnesses", "activation planner"];
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
}, {
  readonly code: "activation-provider-hint";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly replacement: "`providers[]` manifest ownership";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["activation.onProviders", "activation planner"];
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
}, {
  readonly code: "activation-channel-hint";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly replacement: "`channels[]` manifest ownership";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["activation.onChannels", "activation planner"];
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
}, {
  readonly code: "activation-command-hint";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly replacement: "`commandAliases` or command contribution metadata";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["activation.onCommands", "activation planner"];
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
}, {
  readonly code: "activation-route-hint";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly replacement: "HTTP route contribution metadata";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["activation.onRoutes", "activation planner"];
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
}, {
  readonly code: "activation-config-path-hint";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-27";
  readonly replacement: "manifest contribution ownership for root config surfaces";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["activation.onConfigPaths", "startup plugin selection"];
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/channel-plugin-ids.test.ts"];
}, {
  readonly code: "activation-capability-hint";
  readonly status: "active";
  readonly owner: "plugin-execution";
  readonly introduced: "2026-04-24";
  readonly replacement: "manifest contribution ownership";
  readonly docsPath: "/plugins/manifest";
  readonly surfaces: readonly ["activation.onCapabilities", "activation planner"];
  readonly diagnostics: readonly ["activation plan compat reason"];
  readonly tests: readonly ["src/plugins/activation-planner.test.ts"];
}, {
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
/** Parsed local install source metadata for a plugin package. */
type PluginInstallLocalSourceInfo = {
  path: string;
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
  local?: PluginInstallLocalSourceInfo;
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
type InstalledPluginInstallRecordInfo = Pick<PluginInstallRecord, "source" | "spec" | "sourcePath" | "installPath" | "version" | "resolvedName" | "resolvedVersion" | "resolvedSpec" | "integrity" | "shasum" | "resolvedAt" | "installedAt" | "clawhubUrl" | "clawhubPackage" | "clawhubFamily" | "clawhubChannel" | "clawhubTrustDisposition" | "clawhubTrustScanStatus" | "clawhubTrustModerationState" | "clawhubTrustReasons" | "clawhubTrustPending" | "clawhubTrustStale" | "clawhubTrustCheckedAt" | "clawhubTrustAcknowledgedAt" | "artifactKind" | "artifactFormat" | "npmIntegrity" | "npmShasum" | "npmTarballName" | "clawpackSha256" | "clawpackSpecVersion" | "clawpackManifestSha256" | "clawpackSize" | "gitUrl" | "gitRef" | "gitCommit" | "marketplaceName" | "marketplaceSource" | "marketplacePlugin" | "acceptedSurface" | "acceptedSurfaceHash" | "acceptedSurfaceAt" | "acceptedSurfaceIntegrity">;
type InstalledPluginPackageChannelInfo = PluginPackageChannel;
/** One manifest-backed plugin entry in the generated installed plugin index. */
type InstalledPluginIndexRecord = {
  pluginId: string;
  packageName?: string;
  packageVersion?: string;
  /**
   * Legacy embedded install record accepted when reading earlier index files.
   * New index writes keep install records in InstalledPluginIndex.installRecords.
   */
  installRecord?: InstalledPluginInstallRecordInfo;
  /** Hash of the top-level installRecords entry; used to detect source-changed invalidation. */
  installRecordHash?: string;
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
type PluginMetadataRegistryView = Pick<PluginMetadataSnapshot, "index" | "manifestRegistry" | "discovery" | "workspaceDir"> & Partial<Pick<PluginMetadataSnapshot, "declaredProviderOwners">>;
//#endregion
//#region src/plugins/plugin-registry-snapshot.d.ts
type PluginRegistrySnapshot = InstalledPluginIndex;
//#endregion
//#region src/config/mutation-types.d.ts
/** Selects whether a mutation starts from runtime or source config shape. */
type ConfigMutationBase = "runtime" | "source";
//#endregion
//#region src/config/runtime-snapshot.d.ts
type RuntimeConfigSnapshotRefreshOptions = {
  includeAuthStoreRefs?: boolean;
  requireImmediateApplication?: boolean;
};
type ConfigWriteAfterWrite = {
  mode: "auto";
} | {
  mode: "restart";
  reason: string;
} | {
  mode: "none";
  reason: string;
};
type ConfigWriteFollowUp = {
  mode: "auto";
  requiresRestart: false;
} | {
  mode: "none";
  reason: string;
  requiresRestart: false;
} | {
  mode: "restart";
  reason: string;
  requiresRestart: true;
};
declare function setRuntimeConfigSnapshot(config: OpenClawConfig, sourceConfig?: OpenClawConfig): void;
declare function clearRuntimeConfigSnapshot(): void;
declare function getRuntimeConfigSnapshot(): OpenClawConfig | null;
declare function getRuntimeConfigSourceSnapshot(): OpenClawConfig | null;
declare function selectApplicableRuntimeConfig(params: {
  inputConfig?: OpenClawConfig;
  runtimeConfig?: OpenClawConfig | null;
  runtimeSourceConfig?: OpenClawConfig | null;
}): OpenClawConfig | undefined;
/** Bind a retained consumer to its current runtime owner while preserving scoped configs. */
declare function createRuntimeConfigReader(inputConfig: OpenClawConfig): () => OpenClawConfig;
//#endregion
//#region src/config/io.types.d.ts
declare const configWriteCommittedSnapshot: unique symbol;
type ConfigWriteResult = {
  persistedHash: string;
  persistedConfig: OpenClawConfig;
  /** Exact resolved source accepted before commit; absent for legacy custom writers. */
  persistedSourceConfig?: OpenClawConfig;
  /** Internal receipt from the committed inputs, independent of later filesystem reads. */
  [configWriteCommittedSnapshot]?: {
    hash: string;
    sourceConfig: OpenClawConfig;
  };
};
type ConfigWriteAuditOrigin = "doctor" | "system-agent" | "config-rpc" | "plugin-install" | "cli";
type ConfigWriteOptions = {
  /** Candidate's source/runtime basis within its write snapshot; omitted inputs use active globals. */
  inputBase?: ConfigMutationBase;
  /** Semantic writer label recorded in the config audit journal. */
  auditOrigin?: ConfigWriteAuditOrigin;
  /** Read-time env snapshot used to validate `${VAR}` restoration decisions. */
  envSnapshotForRestore?: Record<string, string | undefined>;
  /** Only use envSnapshotForRestore for the config path that produced it. */
  expectedConfigPath?: string;
  /** Internal write destination captured by readConfigFileSnapshotForWrite(). */
  ownedConfigPathForWrite?: string;
  /** Rechecks that the config path captured at mutation start is still active. */
  assertConfigPathForWrite?: () => void;
  /** Internal synchronous live-owner assertion checked at guarded publication effects. */
  assertCurrent?: () => void;
  /** Paths that must be removed from the persisted payload. */
  unsetPaths?: string[][];
  /** Caller-authored paths that stay persisted even when equal to defaults. */
  explicitSetPaths?: readonly (readonly string[])[];
  /** Source-shaped values paired with explicitSetPaths. */
  explicitSetValueSource?: OpenClawConfig;
  /** Persist roster format without treating every leaf as an explicit value edit. */
  persistCanonicalAgentRoster?: boolean;
  /** Agent ids that this write intentionally removes from the canonical roster. */
  allowedAgentRosterRemovals?: readonly string[];
  /** Permit explicit local overrides below an ancestor $include without flattening it. */
  allowIncludeAncestorExplicitSetPaths?: boolean;
  /** Fresh snapshot fast path for an immediate write. */
  baseSnapshot?: ConfigFileSnapshot;
  /** Plugin metadata paired with baseSnapshot. */
  basePluginMetadataSnapshot?: PluginMetadataSnapshot;
  /** Skip the runtime refresh tail when no runtime snapshot is active. */
  skipRuntimeSnapshotRefresh?: boolean;
  /** Controls for the active runtime snapshot refresh. */
  runtimeRefresh?: RuntimeConfigSnapshotRefreshOptions;
  /** Allow intentionally destructive full-config writes. */
  allowDestructiveWrite?: boolean;
  /** Allow an intentional size drop while retaining other destructive guards. */
  allowConfigSizeDrop?: boolean;
  /** Suppress human-readable overwrite and anomaly logs. */
  skipOutputLogs?: boolean;
  /** Runtime reload intent for committed-write observers. */
  afterWrite?: ConfigWriteAfterWrite;
  /** Doctor-only legacy root keys retained on disk but excluded from validation. */
  preservedLegacyRootKeys?: readonly string[];
  /** Skip plugin-aware validation for bounded repair migrations only. */
  skipPluginValidation?: boolean;
  /** Disable observation during mutation snapshots and canonical rereads, not write auditing. */
  observe?: boolean;
  /** Preserve an older writer version during update handoff writes. */
  lastTouchedVersionOverride?: string;
  /** Optional runtime candidate preflight; the runtime writer composes its own preflight. */
  preCommitRuntimePreflight?: (sourceConfig: OpenClawConfig) => Promise<unknown>;
  /** Prepare authority before the synchronous root-file publication phase. */
  beforeCommit?: () => void | Promise<void>;
  /** Snapshot-time hashes for include files that mutation writers may update. */
  includeFileHashesForWrite?: Record<string, string>;
  /** Snapshot-time canonical include targets that writers may update. */
  includeFileTargetsForWrite?: Record<string, string>;
};
type ReadConfigFileSnapshotForWriteResult = {
  snapshot: ConfigFileSnapshot;
  writeOptions: ConfigWriteOptions;
};
type ConfigSnapshotReadMeasure = <T>(name: string, run: () => T | Promise<T>) => Promise<T>;
type ConfigSnapshotReadOptions = {
  deferredPluginMigrations?: readonly DeferredPluginMigration[];
  measure?: ConfigSnapshotReadMeasure;
  observe?: boolean;
  isolateEnv?: boolean;
  lowerPrecedenceEnv?: Readonly<Record<string, string>>;
  allowCurrentPluginMetadata?: boolean;
  recoverSuspicious?: boolean;
  allowSuspiciousRecovery?: (candidate: OpenClawConfig, current: OpenClawConfig) => boolean | Promise<boolean>;
  /** Controls whether snapshot validation resolves plugin metadata and defaults. */
  pluginValidation?: "full" | "skip" | "core-only";
  skipPluginValidation?: boolean;
  preservedLegacyRootKeys?: readonly string[];
  suppressFutureVersionWarning?: boolean;
};
//#endregion
//#region src/config/io.runtime.d.ts
declare function clearConfigCache(): void;
declare function loadConfig(options?: {
  skipPluginValidation?: boolean;
  pin?: boolean;
  skipShellEnvFallback?: boolean;
}): OpenClawConfig;
declare function getRuntimeConfig(options?: {
  skipPluginValidation?: boolean;
  pin?: boolean;
  skipShellEnvFallback?: boolean;
}): OpenClawConfig;
declare function readConfigFileSnapshot(options?: ConfigSnapshotReadOptions): Promise<ConfigFileSnapshot>;
declare function readConfigFileSnapshotForWrite(options?: {
  skipPluginValidation?: boolean;
  observe?: boolean;
}): Promise<ReadConfigFileSnapshotForWriteResult>;
declare function writeConfigFile(cfg: OpenClawConfig, options?: ConfigWriteOptions): Promise<ConfigWriteResult>;
//#endregion
export { PluginCompatCode as C, DeclaredProviderOwnerIndex as S, ConfigMutationBase as _, readConfigFileSnapshotForWrite as a, PluginMetadataSnapshot as b, ConfigWriteResult as c, clearRuntimeConfigSnapshot as d, createRuntimeConfigReader as f, setRuntimeConfigSnapshot as g, selectApplicableRuntimeConfig as h, readConfigFileSnapshot as i, ConfigWriteAfterWrite as l, getRuntimeConfigSourceSnapshot as m, getRuntimeConfig as n, writeConfigFile as o, getRuntimeConfigSnapshot as p, loadConfig as r, ConfigWriteOptions as s, clearConfigCache as t, ConfigWriteFollowUp as u, PluginRegistrySnapshot as v, PluginMetadataSnapshotOwnerMaps as x, PluginMetadataRegistryView as y };