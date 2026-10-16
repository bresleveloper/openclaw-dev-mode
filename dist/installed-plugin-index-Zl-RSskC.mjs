import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as getPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { l as normalizeSortedUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-BJGPJZu6.mjs";
import { n as isDeeplyFrozenPlainData } from "./immutable-data-MyNs7ITg.mjs";
import { i as readBundledDiscoveryModeMemoized } from "./bundled-discovery-state-C2EXzdGy.mjs";
import { n as isPathInside } from "./path-safety-6KJ2Rbnw.mjs";
import { f as readPluginCacheFile, l as pluginCacheRealpathSync, s as pluginCacheExistsSync } from "./package-manifest-CEbdS_C4.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { r as hasKind } from "./slots-DarSawuQ.mjs";
import { c as normalizePluginId, f as resolveEffectiveEnableState, p as resolveEffectivePluginActivationState, r as createPluginActivationSource, u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { t as hashJson } from "./installed-plugin-index-hash-N3AVaUCF.mjs";
import { D as resolvePluginCandidateInstallOwner, T as isPluginCandidateInstallOwnerAmbiguous, n as discoverOpenClawPlugins } from "./discovery-Dma3bVNk.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-C9pW4xqI.mjs";
import { n as recordInstalledPluginIndexInstallOwner, r as resolveInstalledPluginIndexInstallOwner, t as isInstalledPluginIndexInstallOwnerAmbiguous } from "./installed-plugin-index-install-owner-CQJv99I6.mjs";
import { a as getPluginInstallRecordMapEntry, c as parsePluginInstallRecordMap, i as createPluginInstallRecordMap, u as setPluginInstallRecordMapEntry } from "./installed-plugin-record-match-DMViKhkx.mjs";
import { t as resolvePluginDoctorContractArtifact } from "./doctor-contract-artifact-xZyiClKv.mjs";
import { t as describePluginInstallSource } from "./install-source-info-CCeEbXFl.mjs";
import { a as resolvePluginManifestInstallOwner } from "./manifest-registry-build-BTWjXT8m.mjs";
import { r as resolveInstalledPluginIndexStorePath } from "./installed-plugin-index-store-path-vGDuKHrq.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-U3x0s0Ho.mjs";
import path from "node:path";
//#region src/plugins/compat/agent-list-runtime-projection-records.ts
const AGENT_LIST_RUNTIME_PROJECTION_COMPAT_RECORDS = [{
	code: "agent-list-runtime-projection",
	status: "deprecated",
	owner: "sdk",
	introduced: "2026-07-27",
	deprecated: "2026-10-02",
	warningStarts: "2026-10-02",
	removeAfter: "2027-01-02",
	replacement: "Canonical `cfg.agents.entries`, or `listAgentIds` / `resolveAgentConfig` from `openclaw/plugin-sdk/agent-runtime`",
	docsPath: "/plugins/sdk-migration/how-to-migrate#agent-roster-config",
	surfaces: ["non-enumerable runtime OpenClawConfig.agents.list projection"],
	diagnostics: ["plugin compatibility registry and migration documentation; no runtime warnings"],
	tests: ["src/config/runtime-overrides.test.ts", "src/plugins/compat/registry.test.ts"],
	releaseNote: "The runtime agents.list projection introduced in #113146 remains untyped compatibility for plugins built against stable SDK releases through 2026.9.x; authored configs use agents.entries without default markers."
}];
//#endregion
//#region src/plugins/compat/deprecation-marking.ts
const MARKING_DATE = "2026-07-25";
const DEPRECATION_MARKING = {
	status: "removal-pending",
	introduced: MARKING_DATE,
	deprecated: MARKING_DATE,
	warningStarts: MARKING_DATE,
	removeAfter: "2026-10-01"
};
/** The elapsed window does not replace each family's required reader-migration proof. */
const DEPRECATION_MARKING_COMPAT_RECORDS = [
	{
		code: "plugin-sdk-channel-setup-input-fields",
		...DEPRECATION_MARKING,
		owner: "channel",
		replacement: "plugin-local setup input intersections that declare each owning channel field; retain each field until a new published-plugin artifact sweep finds no reader",
		docsPath: "/plugins/sdk-migration#published-channel-setup-compatibility",
		surfaces: [
			"ChannelSetupInput.privateKey",
			"ChannelSetupInput.secret",
			"ChannelSetupInput.botToken",
			"ChannelSetupInput.appToken",
			"ChannelSetupInput.signingSecret",
			"ChannelSetupInput.mode",
			"ChannelSetupInput.cliPath",
			"ChannelSetupInput.authDir",
			"ChannelSetupInput.httpUrl",
			"ChannelSetupInput.httpPort",
			"ChannelSetupInput.webhookPath",
			"ChannelSetupInput.webhookUrl",
			"ChannelSetupInput.userId",
			"ChannelSetupInput.accessToken",
			"ChannelSetupInput.password",
			"ChannelSetupInput.deviceName",
			"ChannelSetupInput.url",
			"ChannelSetupInput.baseUrl",
			"ChannelSetupInput.code",
			"ChannelSetupInput.groupChannels",
			"ChannelSetupInput.dmAllowlist",
			"ChannelSetupInput.autoDiscoverChannels"
		],
		diagnostics: ["TypeScript @deprecated annotations on the reader-backed ChannelSetupInput compatibility tier", "published-plugin artifact reader sweep required before field removal"],
		tests: ["src/plugin-sdk/channel-setup.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "ChannelSetupInput keeps its reader-backed channel fields through the dated migration window while plugins move them into plugin-local input types."
	},
	{
		code: "plugin-sdk-broad-runtime-barrels",
		...DEPRECATION_MARKING,
		owner: "sdk",
		replacement: "focused plugin SDK subpaths for each runtime capability; retain until bundled and published plugins no longer import any of the seven broad barrels",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"openclaw/plugin-sdk/agent-runtime",
			"openclaw/plugin-sdk/agent-runtime loadModelCatalog params.useCache",
			"openclaw/plugin-sdk/agent-runtime loadModelCatalog params.cacheOnly",
			"openclaw/plugin-sdk/agent-runtime loadModelCatalog params.metadataSnapshot",
			"openclaw/plugin-sdk/agent-runtime loadModelCatalog",
			"openclaw/plugin-sdk/cli-runtime",
			"openclaw/plugin-sdk/conversation-runtime",
			"openclaw/plugin-sdk/hook-runtime",
			"openclaw/plugin-sdk/media-runtime",
			"openclaw/plugin-sdk/media-runtime buildAgentMediaPayload",
			"openclaw/plugin-sdk/plugin-runtime",
			"openclaw/plugin-sdk/security-runtime"
		],
		diagnostics: ["TypeScript @deprecated annotations on broad plugin SDK barrels", "plugin boundary report compatibility inventory"],
		tests: ["src/plugins/contracts/plugin-sdk-subpaths.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Broad agent, CLI, conversation, hook, media, plugin, and security runtime barrels remain available while bundled and external plugins migrate to focused subpaths."
	},
	{
		code: "plugin-sdk-provider-owned-helper-shims",
		...DEPRECATION_MARKING,
		owner: "provider",
		replacement: "provider-local auth, model, replay, OAuth, and stream helper APIs; retain until every helper is migrated in official providers and absent from published plugins",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"openclaw/plugin-sdk/provider-stream MOONSHOT_THINKING_STREAM_HOOKS",
			"openclaw/plugin-sdk/provider-stream-shared defaultToolStreamExtraParams",
			"openclaw/plugin-sdk/provider-stream-shared stripTrailingAnthropicAssistantPrefillWhenThinking",
			"openclaw/plugin-sdk/provider-stream-shared createAnthropicThinkingPrefillPayloadWrapper",
			"openclaw/plugin-sdk/provider-stream-shared OpenAICompatibleThinkingLevel",
			"openclaw/plugin-sdk/provider-stream-shared isOpenAICompatibleThinkingEnabled",
			"openclaw/plugin-sdk/provider-stream-shared DeepSeekV4ThinkingLevel",
			"openclaw/plugin-sdk/provider-stream-shared DeepSeekV4ReasoningEffort",
			"openclaw/plugin-sdk/provider-stream-shared createDeepSeekV4OpenAICompatibleThinkingWrapper",
			"openclaw/plugin-sdk/provider-stream-shared createThinkingOnlyFinalTextWrapper",
			"openclaw/plugin-sdk/provider-stream-shared createGoogleThinkingPayloadWrapper",
			"openclaw/plugin-sdk/provider-stream-shared createGoogleThinkingStreamWrapper",
			"openclaw/plugin-sdk/provider-model-shared isProxyReasoningUnsupportedModelHint",
			"openclaw/plugin-sdk/provider-model-shared NATIVE_ANTHROPIC_REPLAY_HOOKS",
			"openclaw/plugin-sdk/provider-model-shared PASSTHROUGH_GEMINI_REPLAY_HOOKS",
			"openclaw/plugin-sdk/provider-auth toFormUrlEncoded",
			"openclaw/plugin-sdk/provider-auth generatePkceVerifierChallenge",
			"openclaw/plugin-sdk/provider-oauth-runtime OAuthProvider",
			"openclaw/plugin-sdk/provider-oauth-runtime OAuthProviderInfo"
		],
		diagnostics: ["TypeScript @deprecated annotations naming provider-local replacements", "plugin boundary report compatibility inventory"],
		tests: ["src/plugins/contracts/plugin-sdk-subpaths.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Provider-specific auth, model, replay, OAuth, and stream shortcuts remain as deprecated SDK shims while providers move to their local APIs."
	},
	{
		code: "message-presentation-legacy-bridges",
		...DEPRECATION_MARKING,
		owner: "channel",
		replacement: "MessagePresentation values and channel presentation renderers; retain until reply producers and official channel packages no longer emit or read legacy interactive replies",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"InteractiveReplyButton.value",
			"InteractiveReplyButton.url",
			"InteractiveReplyButton.webApp",
			"InteractiveReplyButton.web_app",
			"InteractiveReplyOption.value",
			"InteractiveReplyButton",
			"InteractiveReplyOption",
			"InteractiveReplyBlock",
			"InteractiveReply",
			"normalizeInteractiveReply",
			"hasInteractiveReplyBlocks",
			"presentationToInteractiveReply",
			"presentationToInteractiveControlsReply",
			"interactiveReplyToPresentation",
			"resolveInteractiveTextFallback",
			"src/auto-reply ReplyPayload.interactive",
			"openclaw/plugin-sdk/reply-payload ReplyPayload.interactive",
			"reduceInteractiveReply",
			"@openclaw/discord buildDiscordInteractiveComponents",
			"@openclaw/slack buildSlackInteractiveBlocks"
		],
		diagnostics: ["TypeScript @deprecated annotations naming MessagePresentation replacements", "plugin boundary report compatibility inventory"],
		tests: [
			"src/interactive/payload.test.ts",
			"src/plugin-sdk/reply-payload.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "Legacy interactive reply values and channel-specific rendering bridges remain available while producers migrate to MessagePresentation."
	},
	{
		code: "plugin-sdk-focused-compat-aliases",
		...DEPRECATION_MARKING,
		owner: "sdk",
		replacement: "the focused replacement named by each TypeScript @deprecated annotation; retain until every enumerated alias has zero bundled and published readers",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"openclaw/plugin-sdk/acp-runtime __testing",
			"openclaw/plugin-sdk/channel-inbound BuildChannelTurnContextParams",
			"openclaw/plugin-sdk/channel-inbound BuiltChannelTurnContext",
			"openclaw/plugin-sdk/channel-inbound buildChannelTurnContext",
			"openclaw/plugin-sdk/channel-inbound finalizeChannelInboundContext",
			"openclaw/plugin-sdk/channel-inbound filterChannelTurnSupplementalContext",
			"openclaw/plugin-sdk/channel-send-result ChannelSendRawResult",
			"openclaw/plugin-sdk/keyed-async-queue KeyedAsyncQueue.getTailMapForTesting",
			"openclaw/plugin-sdk/persistent-dedupe PersistentDedupeLegacyPathOptions.lockOptions",
			"openclaw/plugin-sdk/retry-runtime createTelegramRetryRunner",
			"openclaw/plugin-sdk/ssrf-policy SsrfPolicyOptions.allowPrivateNetwork",
			"openclaw/plugin-sdk/ssrf-policy ssrfPolicyFromAllowPrivateNetwork",
			"openclaw/plugin-sdk/tts-runtime TtsSynthesisStreamResult",
			"openclaw/plugin-sdk/tts-runtime TtsRuntimeFacade._test"
		],
		diagnostics: ["TypeScript @deprecated annotations naming focused replacements", "plugin boundary report compatibility inventory"],
		tests: [
			"src/plugin-sdk/channel-inbound.test.ts",
			"src/plugin-sdk/ssrf-policy.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "Focused SDK compatibility aliases remain available through a dated window while callers adopt their annotated replacements."
	},
	{
		code: "agent-harness-terminal-result-aliases",
		...DEPRECATION_MARKING,
		owner: "agent-runtime",
		replacement: "AgentHarnessAttemptResult.terminal and AgentHarnessDeliveryDefaults.visibleReplies; retain until harness migration verifies that legacy terminal fields and sourceVisibleReplies are unread",
		docsPath: "/plugins/sdk-agent-harness",
		surfaces: [
			"AgentHarnessAttemptResult.aborted",
			"AgentHarnessAttemptResult.externalAbort",
			"AgentHarnessAttemptResult.timedOut",
			"AgentHarnessAttemptResult.idleTimedOut",
			"AgentHarnessAttemptResult.timedOutDuringCompaction",
			"AgentHarnessAttemptResult.timedOutDuringToolExecution",
			"AgentHarnessAttemptResult.timedOutByRunBudget",
			"AgentHarnessAttemptResult.promptError",
			"AgentHarnessAttemptResult.promptErrorSource",
			"AgentHarnessDeliveryDefaults.sourceVisibleReplies"
		],
		diagnostics: ["TypeScript @deprecated annotations on agent harness result and delivery defaults", "plugin boundary report compatibility inventory"],
		tests: ["src/agents/harness/settled-turn-finalization-result.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Agent harness result booleans and sourceVisibleReplies remain available while harnesses migrate to terminal outcomes and visibleReplies."
	},
	{
		code: "official-plugin-export-aliases",
		...DEPRECATION_MARKING,
		owner: "channel",
		replacement: "MessagePresentation renderers and host-owned timeout/runtime behavior; retain until minimum supported official plugin packages no longer import these aliases",
		docsPath: "/plugins/compatibility#current-compatibility-areas",
		surfaces: [
			"@openclaw/discord buildDiscordInteractiveComponents",
			"@openclaw/discord normalizeDiscordListenerTimeoutMs",
			"@openclaw/discord normalizeDiscordInboundWorkerTimeoutMs",
			"@openclaw/discord isAbortError",
			"@openclaw/discord runDiscordTaskWithTimeout",
			"@openclaw/slack buildSlackInteractiveBlocks"
		],
		diagnostics: ["TypeScript @deprecated annotations on published official-plugin exports", "plugin boundary report compatibility inventory"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "Published channel presentation and Discord timeout aliases remain available while consumers move to their canonical exports and host-owned behavior."
	},
	{
		code: "memory-host-compatibility-aliases",
		...DEPRECATION_MARKING,
		owner: "sdk",
		replacement: "canonical memory cache/FTS tables; retain until supported memory integrations are verified to use canonical tables without overrides and legacy table data remains preserved",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: ["@openclaw/memory-host-sdk ensureMemoryIndexSchema.embeddingCacheTable", "@openclaw/memory-host-sdk ensureMemoryIndexSchema.ftsTable"],
		diagnostics: ["TypeScript @deprecated annotations on memory-host SDK compatibility fields", "plugin boundary report memory-host SDK summary"],
		tests: ["packages/memory-host-sdk/src/host/memory-schema.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Memory-host table overrides remain available until supported artifact usage and legacy data preservation are verified."
	},
	{
		code: "plugin-runtime-api-compat-aliases",
		...DEPRECATION_MARKING,
		owner: "plugin-execution",
		replacement: "the namespaced plugin API and focused runtime methods named per surface; retain until all enumerated flat API and runtime aliases have no readers",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"OpenClawPluginApi.registerSessionExtension",
			"OpenClawPluginApi.enqueueNextTurnInjection",
			"OpenClawPluginApi.registerControlUiDescriptor",
			"OpenClawPluginApi.registerRuntimeLifecycle",
			"OpenClawPluginApi.registerAgentEventSubscription",
			"OpenClawPluginApi.emitAgentEvent",
			"OpenClawPluginApi.setRunContext",
			"OpenClawPluginApi.getRunContext",
			"OpenClawPluginApi.clearRunContext",
			"OpenClawPluginApi.registerSessionSchedulerJob",
			"OpenClawPluginApi.registerSessionAction",
			"OpenClawPluginApi.sendSessionAttachment",
			"OpenClawPluginApi.scheduleSessionTurn",
			"OpenClawPluginApi.unscheduleSessionTurnsByTag",
			"PluginHookContext.senderExternalId",
			"PluginAttachmentChannelHints.telegram",
			"PluginAttachmentChannelHints.slack",
			"AgentPromptSurfaceKind pi_main",
			"PluginRuntime.channel.reply.createReplyDispatcherWithTyping",
			"PluginRuntime.channel.reply.resolveHumanDelayConfig",
			"PluginRuntime.channel.reply.dispatchReplyFromConfig",
			"PluginRuntime.channel.reply.finalizeInboundContext",
			"PluginRuntime.channel.media.fetchRemoteMedia",
			"PluginRuntime.channel.session.resolveStorePath",
			"PluginRuntime.channel.session.recordInboundSession",
			"PluginRuntime.channel.inbound.runPreparedReply",
			"PluginRuntime.channel.turn",
			"PluginRuntime.system.requestHeartbeatNow"
		],
		diagnostics: ["TypeScript @deprecated annotations on plugin API and runtime aliases", "plugin boundary report compatibility inventory"],
		tests: [
			"src/plugins/captured-registration.test.ts",
			"src/plugins/runtime/index.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "Flat plugin registration and broad runtime aliases remain available while plugins migrate to namespaced APIs and focused runtime methods."
	},
	{
		code: "plugin-provider-manifest-compat-aliases",
		...DEPRECATION_MARKING,
		owner: "provider",
		replacement: "manifest-owned plugin kind/setup metadata and model catalog registration; retain until providers no longer publish runtime kind or legacy catalog hooks",
		docsPath: "/plugins/sdk-migration#compatibility-policy",
		surfaces: [
			"DefinePluginEntryOptions.kind",
			"SingleProviderPluginOptions.kind",
			"OpenClawPluginDefinition.kind",
			"PluginPackageChannel.cliAddOptions",
			"ProviderPlugin.catalog",
			"ProviderPlugin.staticCatalog",
			"ProviderPlugin.suppressBuiltInModel",
			"ProviderPlugin.augmentModelCatalog",
			"ProviderBuiltInModelSuppressionContext"
		],
		diagnostics: ["TypeScript @deprecated annotations on plugin manifest and provider catalog aliases", "plugin boundary report compatibility inventory"],
		tests: [
			"src/plugins/contracts/package-manifest.contract.test.ts",
			"src/plugins/contracts/provider-catalog-deprecation.contract.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "Runtime plugin kind/setup metadata and provider catalog hooks remain available while plugins migrate ownership into manifests and catalog registrations."
	}
];
//#endregion
//#region src/plugins/compat/media-legacy-projection.ts
/** Named compatibility contract for the shipped parallel media projection. */
const MEDIA_LEGACY_PROJECTION_COMPAT_RECORD = {
	code: "media-legacy-projection",
	status: "removal-pending",
	owner: "sdk",
	introduced: "2026-07-24",
	deprecated: "2026-07-24",
	warningStarts: "2026-07-24",
	removeAfter: "2026-10-01",
	replacement: "ordered `MsgContext.media` / `InboundMediaFacts[]`; typed hook `media` and `originalMedia`; `Attachment*` template variables; and `openclaw/plugin-sdk/media-local-roots`; retain until a clean published-plugin artifact sweep verifies that the legacy media surfaces have no readers",
	docsPath: "/plugins/sdk-migration#media-legacy-projection",
	surfaces: [
		"MsgContext MediaPath/MediaUrl/MediaType and plural/staging fields",
		"openclaw/plugin-sdk/agent-media-payload",
		"ChannelInboundMediaPayload and buildChannelInboundMediaPayload",
		"MediaPayload and buildMediaPayload",
		"message hook mediaPath/mediaUrl/mediaType and plural/original metadata aliases",
		"MediaPath/MediaUrl/MediaType/MediaDir template variables"
	],
	diagnostics: [
		"TypeScript @deprecated annotations naming the facts-first replacement",
		"plugin boundary report compatibility inventory with the approved removeAfter date",
		"SDK, hook, and media template migration documentation"
	],
	tests: [
		"src/sessions/user-turn-transcript.media.test.ts",
		"src/hooks/message-hook-mappers.test.ts",
		"src/media-understanding/runner.cli-audio.test.ts",
		"src/plugins/compat/registry.test.ts",
		"src/plugins/contracts/plugin-sdk-subpaths.test.ts"
	],
	releaseNote: "Legacy parallel media projections remain available as deprecated compatibility while plugins move to ordered facts, typed hook media, Attachment templates, and the focused media-local-roots SDK."
};
//#endregion
//#region src/plugins/compat/mention-inbox-record.ts
const MENTION_INBOX_COMPAT_RECORD = {
	code: "mention-inbox-sync-persistence",
	status: "deprecated",
	owner: "sdk",
	introduced: "2026-10-03",
	deprecated: "2026-10-03",
	warningStarts: "2026-10-03",
	removalGate: "next-plugin-sdk-major",
	replacement: "Await mentionInbox.listAsync(client, publish), mentionInbox.dismissAsync(client, ids, publish), mentionInbox.recordCommittedInputAsync(input), and mentionInbox.invalidateAsync(sessionKey). Publish list/dismiss responses synchronously inside the supplied callback. Retain synchronous methods only for shipped third-party contracts until the next Plugin SDK major and explicit breaking-release approval.",
	docsPath: "/plugins/sdk-migration/how-to-migrate#await-mention-inbox-operations",
	surfaces: [
		"GatewayRequestHandlerOptions.context.mentionInbox.list",
		"GatewayRequestHandlerOptions.context.mentionInbox.dismiss",
		"GatewayRequestHandlerOptions.context.mentionInbox.recordCommittedInput",
		"GatewayRequestHandlerOptions.context.mentionInbox.invalidate",
		"getPluginRuntimeGatewayRequestScope().context.mentionInbox"
	],
	diagnostics: ["TypeScript @deprecated annotations and one DEP_SESSION_PERSISTENCE warning per plugin and method per process; unscoped callers warn once per method"],
	tests: [
		"src/plugins/compat/registry.test.ts",
		"src/plugins/compat/mention-inbox-deprecation.test.ts",
		"src/plugin-sdk/gateway-mention-inbox-compat.test.ts",
		"src/gateway/mention-inbox.test.ts",
		"src/gateway/mention-inbox.compat.test.ts"
	],
	releaseNote: "Mention Inbox reads, dismissals, recording, and invalidation expose awaited worker-backed methods. Synchronous plugin methods retain their existing return values and completion timing until the next Plugin SDK major; stored data, retention, and update behavior are unchanged."
};
//#endregion
//#region src/plugins/compat/plugin-sdk-subpath-records.ts
const PLUGIN_SDK_SUBPATH_SEEDS = [
	{
		code: "plugin-sdk-channel-streaming-subpath",
		subpath: "channel-streaming",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-outbound`",
		releaseNote: "The deprecated `channel-streaming` Plugin SDK subpath was removed; plugins now import channel streaming helpers from `channel-outbound`."
	},
	{
		code: "plugin-sdk-config-runtime-subpath",
		subpath: "config-runtime",
		status: "removed",
		owner: "config",
		replacement: "`api.pluginConfig`, `openclaw/plugin-sdk/config-mutation`, `openclaw/plugin-sdk/runtime-config-snapshot`, and `openclaw/plugin-sdk/config-contracts`",
		releaseNote: "The deprecated `config-runtime` Plugin SDK facade was removed by the approved September 30 retirement; migrate to `api.pluginConfig`, `openclaw/plugin-sdk/config-mutation`, `openclaw/plugin-sdk/runtime-config-snapshot`, and `openclaw/plugin-sdk/config-contracts`."
	},
	{
		code: "plugin-sdk-inbound-reply-dispatch-subpath",
		subpath: "inbound-reply-dispatch",
		owner: "channel",
		removalGate: "next-plugin-sdk-major",
		replacement: "`openclaw/plugin-sdk/channel-inbound` and `openclaw/plugin-sdk/channel-outbound`"
	},
	{
		code: "plugin-sdk-channel-reply-pipeline-subpath",
		subpath: "channel-reply-pipeline",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-outbound`",
		releaseNote: "The deprecated `channel-reply-pipeline` Plugin SDK facade was removed by the approved September 30 retirement; migrate to `openclaw/plugin-sdk/channel-outbound`."
	},
	{
		code: "plugin-sdk-infra-runtime-subpath",
		subpath: "infra-runtime",
		status: "removed",
		owner: "sdk",
		replacement: "focused typed subpaths including `openclaw/plugin-sdk/system-event-runtime`, `openclaw/plugin-sdk/error-runtime`, `openclaw/plugin-sdk/approval-runtime`, and `openclaw/plugin-sdk/ssrf-runtime`; use injected runtime APIs for host operations without a public subpath",
		releaseNote: "The deprecated `infra-runtime` Plugin SDK facade was removed by the approved September 30 retirement; migrate to focused typed subpaths including `openclaw/plugin-sdk/system-event-runtime`, `openclaw/plugin-sdk/error-runtime`, `openclaw/plugin-sdk/approval-runtime`, and `openclaw/plugin-sdk/ssrf-runtime`; use injected runtime APIs for host operations without a public subpath."
	},
	{
		code: "plugin-sdk-text-runtime-subpath",
		subpath: "text-runtime",
		status: "removed",
		owner: "sdk",
		replacement: "`openclaw/plugin-sdk/logging-core`, `openclaw/plugin-sdk/text-chunking`, `openclaw/plugin-sdk/text-utility-runtime`, and `openclaw/plugin-sdk/string-coerce-runtime`",
		releaseNote: "The deprecated `text-runtime` Plugin SDK facade was removed; plugins now import logging, chunking, text utility, and string coercion helpers from their focused subpaths."
	},
	{
		code: "plugin-sdk-channel-secret-runtime-subpath",
		subpath: "channel-secret-runtime",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-secret-basic-runtime` and `openclaw/plugin-sdk/channel-secret-tts-runtime`",
		releaseNote: "The deprecated `channel-secret-runtime` Plugin SDK subpath was removed; plugins now use the focused basic and TTS secret-runtime subpaths."
	},
	{
		code: "plugin-sdk-agent-config-primitives-subpath",
		subpath: "agent-config-primitives",
		status: "removed",
		owner: "config",
		replacement: "`openclaw/plugin-sdk/channel-config-schema`",
		releaseNote: "The deprecated `agent-config-primitives` Plugin SDK subpath was removed; plugins now use maintained config-schema primitives."
	},
	{
		code: "plugin-sdk-matrix-subpath",
		subpath: "matrix",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/run-command`",
		releaseNote: "The deprecated `matrix` Plugin SDK facade was removed; command execution now uses the generic `run-command` subpath."
	},
	{
		code: "plugin-sdk-channel-logging-subpath",
		subpath: "channel-logging",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-inbound` and `openclaw/plugin-sdk/channel-outbound`",
		releaseNote: "The deprecated `channel-logging` Plugin SDK subpath was removed; channel logging helpers now come from the inbound and outbound channel surfaces."
	},
	{
		code: "plugin-sdk-channel-lifecycle-subpath",
		subpath: "channel-lifecycle",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-outbound`",
		releaseNote: "The deprecated `channel-lifecycle` Plugin SDK facade was removed by the approved September 30 retirement; migrate to `openclaw/plugin-sdk/channel-outbound`."
	},
	{
		code: "plugin-sdk-channel-message-subpath",
		subpath: "channel-message",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-outbound` and `openclaw/plugin-sdk/channel-inbound`",
		releaseNote: "The deprecated `channel-message` Plugin SDK facade was removed by the approved September 30 retirement; migrate to `openclaw/plugin-sdk/channel-outbound` and `openclaw/plugin-sdk/channel-inbound`."
	},
	{
		code: "plugin-sdk-group-access-subpath",
		subpath: "group-access",
		status: "removed",
		owner: "channel",
		replacement: "`openclaw/plugin-sdk/channel-ingress-runtime`",
		releaseNote: "The deprecated `group-access` Plugin SDK subpath was removed; plugins now resolve message admission through `channel-ingress-runtime`."
	},
	{
		code: "plugin-sdk-zod-subpath",
		subpath: "zod",
		status: "removed",
		owner: "sdk",
		replacement: "the direct `zod` package import",
		releaseNote: "The deprecated `zod` Plugin SDK re-export was removed; plugins now import `zod` directly."
	}
];
function buildPluginSdkSubpathRecord(seed) {
	const shared = {
		code: seed.code,
		owner: seed.owner,
		introduced: "2026-07-06",
		replacement: seed.replacement,
		docsPath: "/plugins/sdk-migration",
		surfaces: [`openclaw/plugin-sdk/${seed.subpath}`],
		tests: ["src/plugins/compat/registry.test.ts"]
	};
	if ("status" in seed && seed.status === "removed") return {
		...shared,
		status: seed.status,
		diagnostics: ["plugin SDK compatibility registry and migration guide"],
		releaseNote: seed.releaseNote
	};
	return {
		...shared,
		status: "status" in seed ? seed.status : "deprecated",
		deprecated: "2026-07-06",
		warningStarts: "2026-07-06",
		removalGate: "removalGate" in seed ? seed.removalGate : void 0,
		diagnostics: ["repository deprecated API usage guard for core and bundled plugins; no external runtime import warning"]
	};
}
const PLUGIN_SDK_SUBPATH_RECORDS = PLUGIN_SDK_SUBPATH_SEEDS.map(buildPluginSdkSubpathRecord);
const BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATH_SEEDS = [
	{
		subpath: "media-understanding",
		status: "removal-pending",
		removeAfter: "2026-09-30",
		replacement: "`api.registerMediaUnderstandingProvider(...)` with provider-owned request helpers and types from `openclaw/plugin-sdk/plugin-entry`; retain the public subpath through the 2026-09-30 window while official plugin consumers migrate",
		docsPath: "/plugins/architecture"
	},
	{
		subpath: "memory-host-core",
		status: "removal-pending",
		removeAfter: "2026-09-30",
		replacement: "host-prepared memory prompts via `openclaw/plugin-sdk/core` and memory capability registration through the injected plugin API; retain the facade through the 2026-09-30 window and until a focused public-artifact read seam exists",
		docsPath: "/plugins/architecture-internals#context-engine-plugins"
	},
	{
		subpath: "plugin-config-runtime",
		status: "removal-pending",
		removeAfter: "2026-12-01",
		replacement: "`api.pluginConfig`, runtime tool context config, and focused `config-contracts`, `runtime-config-snapshot`, or `config-mutation` subpaths; retain the public subpath through the 2026-12-01 window while official plugin consumers migrate",
		docsPath: "/plugins/sdk-runtime"
	},
	{
		subpath: "tool-plugin",
		status: "deprecated",
		replacement: "retain the public subpath until plugin authoring has a nonexecuting static metadata replacement for `defineToolPlugin`; `getToolPluginMetadata` currently reads metadata only from an already-executed entry",
		docsPath: "/plugins/tool-plugins"
	}
];
function buildPublicSdkSubpathRecord({ subpath, ...compat }) {
	return {
		code: `plugin-sdk-${subpath}-public-demotion`,
		owner: "sdk",
		introduced: "2026-07-15",
		deprecated: "2026-07-15",
		warningStarts: "2026-07-15",
		...compat,
		surfaces: [`openclaw/plugin-sdk/${subpath}`],
		diagnostics: ["registry-backed public SDK demotion window; no external runtime import warning"],
		tests: ["src/plugins/compat/registry.test.ts"]
	};
}
const BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATH_RECORDS = BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATH_SEEDS.map(buildPublicSdkSubpathRecord);
//#endregion
//#region src/plugins/compat/session-persistence-records.ts
const SESSION_PERSISTENCE_COMPAT_RECORDS = [
	{
		code: "native-session-generation-sync-authority",
		status: "deprecated",
		owner: "agent-runtime",
		introduced: "2026-09-22",
		deprecated: "2026-10-03",
		warningStarts: "2026-10-03",
		removalGate: "next-plugin-sdk-major",
		replacement: "Await prepareNativeSessionGenerationAuthority, resolveNativeSessionBindingWithAuthority, and reclaimNativeSessionGenerationWithAuthority with NativeSessionGenerationOperationsV2. Retain released synchronous capture and two-argument mutation callbacks until published official harness readers migrate and a breaking release is explicitly approved.",
		docsPath: "/plugins/sdk-migration/compatibility-policy#native-session-generation-authority",
		surfaces: [
			"captureNativeSessionGenerationAuthority",
			"resolveNativeSessionBinding",
			"reclaimNativeSessionGeneration",
			"NativeSessionGenerationOperations"
		],
		diagnostics: ["TypeScript @deprecated annotations and migration documentation; no runtime warnings"],
		tests: [
			"src/plugin-sdk/agent-harness-session-compat.test.ts",
			"src/agents/harness/native-session/binding-generation.test.ts",
			"src/agents/harness/native-session/binding-generation-authority.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "Native harnesses can admit binding operations through worker-backed session authority. Released official harness plugins retain synchronous authority capture and lineage-checking mutation callbacks across host upgrades."
	},
	{
		code: "session-manager-sync-persistence",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-10-01",
		deprecated: "2026-10-01",
		warningStarts: "2026-10-01",
		removalGate: "next-plugin-sdk-major",
		replacement: "Await the matching Async-suffixed SessionManager method, including the returned rewrite commit. Retain synchronous adapters only for shipped third-party contracts until the next Plugin SDK major and explicit breaking-release approval.",
		docsPath: "/plugins/sdk-migration/how-to-migrate#await-session-transcript-persistence",
		surfaces: [
			"SessionManager.appendMessage",
			"SessionManager.appendMessageWithTranscriptAnchor",
			"SessionManager.appendCompaction",
			"SessionManager.appendResetBoundary",
			"SessionManager.appendCustomEntry",
			"SessionManager.appendSessionInfo",
			"SessionManager.appendCustomMessageEntry",
			"SessionManager.appendLeafControl",
			"SessionManager.appendLabelChange",
			"SessionManager.branch",
			"SessionManager.branchWithSummary",
			"SessionManager.removeTrailingEntries",
			"SessionManager.persist",
			"SessionManager.prepareTranscriptRewrite",
			"SessionManager.appendMessageToTranscript",
			"SessionManager.open",
			"SessionManager.openBounded",
			"SessionManager.openDetachedBounded",
			"SessionManager.openModelContext",
			"SessionManager.setSessionTarget",
			"SessionManager.reloadPersistedTranscript"
		],
		diagnostics: ["TypeScript @deprecated annotations naming awaited twins", "one runtime DEP_SESSION_PERSISTENCE warning per method per process"],
		tests: [
			"src/plugins/compat/registry.test.ts",
			"src/agents/sessions/session-manager-async-entries.test.ts",
			"src/agents/sessions/session-manager-async-message.test.ts",
			"src/agents/sessions/session-manager-maintenance-async.test.ts"
		],
		releaseNote: "Plugins can await SessionManager transcript mutations through the existing SQLite worker. Synchronous methods retain their shipped return values as deprecated third-party adapters until the next Plugin SDK major; storage formats and update behavior are unchanged."
	},
	{
		code: "extension-session-sync-persistence",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-10-01",
		deprecated: "2026-10-01",
		warningStarts: "2026-10-01",
		removalGate: "next-plugin-sdk-major",
		replacement: "Await ExtensionAPI.appendEntryAsync, setSessionNameAsync, and setLabelAsync, and AgentSession.setSessionNameAsync. Existing synchronous third-party methods retain their void return contract until the next Plugin SDK major and explicit breaking-release approval.",
		docsPath: "/plugins/sdk-migration/how-to-migrate#await-extension-session-changes",
		surfaces: [
			"ExtensionAPI.appendEntry",
			"ExtensionAPI.setSessionName",
			"ExtensionAPI.setLabel",
			"AgentSession.setSessionName"
		],
		diagnostics: ["TypeScript @deprecated annotations, migration guide, and once-per-method DEP_SESSION_PERSISTENCE warning"],
		tests: ["src/plugins/compat/registry.test.ts", "src/agents/sessions/sdk.metadata-admission.test.ts"],
		releaseNote: "Extensions can await transcript entries, session names, and labels; the shipped synchronous methods remain third-party compatibility adapters through the next Plugin SDK major."
	},
	{
		code: "provider-replay-sync-persistence",
		status: "deprecated",
		owner: "provider",
		introduced: "2026-10-01",
		deprecated: "2026-10-01",
		warningStarts: "2026-10-01",
		removalGate: "next-plugin-sdk-major",
		replacement: "Use ProviderPlugin.sanitizeReplayHistoryAsync with ProviderSanitizeReplayHistoryContextV2 and await ProviderReplaySessionStateV2.appendCustomEntryAsync; use sanitizeGoogleGeminiReplayHistoryAsync for the shared Gemini implementation. Retain legacy third-party contexts and hooks until the next Plugin SDK major and explicit breaking-release approval.",
		docsPath: "/plugins/sdk-migration/how-to-migrate#await-provider-replay-metadata",
		surfaces: [
			"ProviderPlugin.sanitizeReplayHistory",
			"ProviderReplaySessionState.appendCustomEntry",
			"sanitizeGoogleGeminiReplayHistory"
		],
		diagnostics: ["TypeScript @deprecated annotations, versioned migration guide, and once-per-method DEP_SESSION_PERSISTENCE warning"],
		tests: [
			"src/plugins/compat/registry.test.ts",
			"src/plugins/provider-replay-helpers.test.ts",
			"src/plugins/provider-runtime.test.ts",
			"src/plugin-sdk/provider-model-shared.test.ts"
		],
		releaseNote: "Provider replay hooks can await committed transcript metadata through additive V2 context types. Legacy hooks, context types, and the synchronous Gemini helper remain available for third-party migration through the next Plugin SDK major."
	}
];
//#endregion
//#region src/plugins/compat/watched-sessions.ts
const WATCHED_SESSIONS_COMPAT_RECORD = {
	code: "watched-sessions-sync-harness-context",
	status: "deprecated",
	owner: "sdk",
	introduced: "2026-07-29",
	deprecated: "2026-10-03",
	warningStarts: "2026-10-03",
	removalGate: "next-plugin-sdk-major",
	replacement: "Await prepareWatchedSessionsHarnessContext with an assertCurrent callback bound to the current host capability. The released buildWatchedSessionsHarnessContext retains its synchronous string-or-undefined result until the next Plugin SDK major and explicit breaking-release approval.",
	docsPath: "/plugins/sdk-migration/compatibility-policy#watched-session-harness-context",
	surfaces: ["openclaw/plugin-sdk/agent-harness-runtime.buildWatchedSessionsHarnessContext"],
	diagnostics: ["TypeScript @deprecated annotation and migration documentation; no runtime warnings"],
	tests: [
		"src/plugins/compat/registry.test.ts",
		"src/plugin-sdk/agent-harness-runtime-watched-sessions.test.ts",
		"src/agents/watched-sessions-prompt.test.ts"
	],
	releaseNote: "Harness plugins can await watched-session prompt preparation from worker reads. Bundled harnesses use the awaited helper; the synchronous SDK result remains supported for third-party plugins. Prompt bytes, stored data, and update behavior are unchanged."
};
//#endregion
//#region src/plugins/compat/workspace-mutation-guard.ts
const WORKSPACE_MUTATION_GUARD_COMPAT_RECORD = {
	code: "workspace-mutation-guard-callback",
	status: "deprecated",
	owner: "sdk",
	introduced: "2026-10-02",
	deprecated: "2026-10-02",
	warningStarts: "2026-10-02",
	removalGate: "next-plugin-sdk-major",
	replacement: "Await database preparation before ensureAgentWorkspace and use SQL-free guard.assertHost for live authority. Internal recovery predicates run on the worker transaction connection.",
	docsPath: "/plugins/sdk-migration/how-to-migrate#workspace-mutation-guards",
	surfaces: ["api.runtime.agent.ensureAgentWorkspace.beforePersistentApply"],
	diagnostics: ["@deprecated JSDoc and one DEP_WORKSPACE_MUTATION_GUARD warning per process", "Warning explains before-dispatch timing and deprecated but allowed synchronous OpenClaw DB access"],
	tests: ["src/plugins/runtime/runtime-agent.workspace.test.ts", "src/plugins/compat/registry.test.ts"],
	releaseNote: "Released callbacks and their synchronous OpenClaw DB access remain supported. The legacy check runs once before worker dispatch, outside admission grants; use the typed guard for live revocation at commit. Removal requires the next Plugin SDK major."
};
//#endregion
//#region src/plugins/compat/registry-records.ts
const ACTIVATION_HINT_METADATA = {
	status: "active",
	owner: "plugin-execution",
	introduced: "2026-04-24",
	docsPath: "/plugins/manifest",
	diagnostics: ["activation plan compat reason"],
	tests: ["src/plugins/activation-planner.test.ts"]
};
const PLUGIN_COMPAT_RECORDS = [
	MENTION_INBOX_COMPAT_RECORD,
	WORKSPACE_MUTATION_GUARD_COMPAT_RECORD,
	...SESSION_PERSISTENCE_COMPAT_RECORDS,
	...AGENT_LIST_RUNTIME_PROJECTION_COMPAT_RECORDS,
	WATCHED_SESSIONS_COMPAT_RECORD,
	{
		code: "gateway-placement-sync-results",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-09-07",
		deprecated: "2026-10-02",
		warningStarts: "2026-10-02",
		removalGate: "next-plugin-sdk-major",
		replacement: "Await listPendingWorkspaceResultsAsync, getWorkspaceResultReconcilingSessionIdsAsync, and deferOrphanedRequestsAsync on the Gateway context. Released synchronous methods retain their return values and completion timing until the next Plugin SDK major and explicit breaking-release approval.",
		docsPath: "/plugins/sdk-migration/compatibility-policy#gateway-placement-and-publication-readers",
		surfaces: [
			"GatewayRequestHandlerOptions.context.workerSessionPlacementService.listPendingWorkspaceResults",
			"GatewayRequestHandlerOptions.context.workerSessionPlacementService.getWorkspaceResultReconcilingSessionIds",
			"GatewayRequestHandlerOptions.context.githubPublicationService.deferOrphanedRequests",
			"getPluginRuntimeGatewayRequestScope().context"
		],
		diagnostics: ["TypeScript @deprecated annotations and migration documentation; no runtime warnings"],
		tests: [
			"src/plugin-sdk/gateway-placement-compat.test.ts",
			"src/gateway/worker-environments/placement-store.test.ts",
			"src/gateway/github-publication-boundaries.test.ts",
			"src/gateway/github-repository-publication.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "Placement result readers and GitHub orphan deferral expose awaited methods while retaining the synchronous Gateway-context contracts shipped to plugins in 2026.9.7. Internal placement readers use the SQLite worker; stored data and update behavior are unchanged."
	},
	{
		code: "memory-session-sync-inventory",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-08-09",
		deprecated: "2026-10-01",
		warningStarts: "2026-10-01",
		removalGate: "next-plugin-sdk-major",
		replacement: "Await loadArchivedSessionsAsync and resolveMemorySessionTargetsAsync from memory-core-host-engine-sessions. Synchronous readers retain their existing signatures and results until the next Plugin SDK major.",
		docsPath: "/plugins/sdk-migration/compatibility-policy#memory-session-inventory-readers",
		surfaces: ["loadArchivedSessions", "resolveMemorySessionTargets"],
		diagnostics: ["TypeScript @deprecated annotations and migration documentation; no runtime warnings"],
		tests: [
			"src/plugin-sdk/memory-core-host-engine-sessions.test.ts",
			"src/plugins/compat/registry.test.ts",
			"extensions/memory-core/src/memory-forget.participants.test.ts"
		],
		releaseNote: "Memory archive discovery and forget target selection can be awaited through worker-backed SDK readers; synchronous readers remain compatible until the next Plugin SDK major."
	},
	{
		code: "channel-webhook-listener-config-inputs",
		status: "deprecated",
		owner: "config",
		introduced: "2026-09-26",
		deprecated: "2026-09-26",
		warningStarts: "2026-09-26",
		removalGate: "next-plugin-sdk-major",
		replacement: "Use legacyWebhook for canonical listener config. Doctor migrates stored webhookPort/webhookHost and webhook.port inputs; deprecated optional TypeScript properties preserve config producer source compatibility until an approved SDK major removal.",
		docsPath: "/gateway/doctor/config-migrations#channel-webhook-listeners",
		surfaces: [
			"TelegramAccountConfig.webhookPort",
			"TelegramAccountConfig.webhookHost",
			"FeishuConfig.webhookPort",
			"FeishuConfig.webhookHost",
			"FeishuAccountConfig.webhookPort",
			"FeishuAccountConfig.webhookHost",
			"MSTeamsWebhookConfig.port",
			"NextcloudTalkAccountConfig.webhookPort",
			"NextcloudTalkAccountConfig.webhookHost"
		],
		diagnostics: ["TypeScript @deprecated annotations and plugin-owned Doctor migration"],
		tests: [
			"extensions/telegram/src/doctor.test.ts",
			"extensions/feishu/src/doctor-contract.test.ts",
			"extensions/msteams/config-doctor-api.test.ts",
			"extensions/nextcloud-talk/src/doctor-contract.test.ts"
		]
	},
	{
		code: "conversation-binding-sync-mutations",
		status: "deprecated",
		owner: "channel",
		introduced: "2026-09-20",
		deprecated: "2026-09-20",
		warningStarts: "2026-09-20",
		removalGate: "next-plugin-sdk-major",
		replacement: "Await getSessionBindingService().inspectByConversationAsync, resolveByConversationAsync, touchAsync, resolveRuntimeConversationBindingRouteAsync, and the Async-suffixed thread-binding lifecycle setters. Project prepared inspection facts with inspectRuntimeConversationBindingRoute. Async dispatch retains an explicit synchronous fallback for legacy external adapters; remaining bind/unbind and other storage operations are separate migration work.",
		docsPath: "/plugins/sdk-runtime/channel#awaited-conversation-binding-mutations",
		surfaces: [
			"SessionBindingService.touch",
			"SessionBindingService.resolveByConversation",
			"SessionBindingAdapter.touch",
			"SessionBindingAdapter.resolveByConversation",
			"resolveRuntimeConversationBindingRoute",
			"ChannelConversationBindingSupport.setIdleTimeoutBySessionKey",
			"ChannelConversationBindingSupport.setMaxAgeBySessionKey",
			"api.runtime.channel.threadBindings.setIdleTimeoutBySessionKey",
			"api.runtime.channel.threadBindings.setMaxAgeBySessionKey"
		],
		diagnostics: ["TypeScript @deprecated annotations on synchronous methods; resolver migration is recorded here and in docs while its broad barrel remains deprecated; no runtime warnings"],
		tests: [
			"src/infra/outbound/session-binding-service.test.ts",
			"src/channels/plugins/binding-routing.test.ts",
			"src/channels/plugins/conversation-bindings.test.ts"
		],
		releaseNote: "Plugins can expose explicitly awaited binding mutations and pure ownership inspection; synchronous public methods remain supported while callers and persistence owners migrate."
	},
	...PLUGIN_SDK_SUBPATH_RECORDS,
	...BUNDLED_ONLY_PUBLIC_PLUGIN_SDK_SUBPATH_RECORDS,
	...DEPRECATION_MARKING_COMPAT_RECORDS,
	MEDIA_LEGACY_PROJECTION_COMPAT_RECORD,
	{
		code: "node-workspace-sync-acquisition",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-08-21",
		deprecated: "2026-09-15",
		warningStarts: "2026-09-15",
		removalGate: "next-plugin-sdk-major",
		replacement: "Await context.acquireManagedWorkspaceAsync(request) and release the returned lease in finally. Retain synchronous acquisition for supported external plugins until explicit breaking-release approval.",
		docsPath: "/plugins/sdk-migration/how-to-migrate#managed-node-workspace-acquisition",
		surfaces: ["OpenClawPluginNodeHostCommandContext.acquireManagedWorkspace"],
		diagnostics: ["TypeScript @deprecated annotation and migration documentation; no runtime warnings"],
		tests: [
			"src/node-host/invoke-workspace.test.ts",
			"src/node-host/node-worker-workspace-retention.test.ts",
			"extensions/codex/src/node-exec-server.test.ts"
		],
		releaseNote: "Node-host plugins can await managed workspace acquisition while existing synchronous callers retain their immediate lease contract."
	},
	{
		code: "plugin-state-sync-keyed-store",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-05-29",
		deprecated: "2026-09-11",
		warningStarts: "2026-09-11",
		removalGate: "next-plugin-sdk-major",
		replacement: "`api.runtime.state.openKeyedStore` and `PluginStateKeyedStore`; await operations while keeping transactional callbacks synchronous. Retain the sync adapter until a supported external-plugin migration and explicit breaking-release approval.",
		docsPath: "/plugins/sdk-runtime/state-and-system#synchronous-keyed-store-migration",
		surfaces: [
			"api.runtime.state.openSyncKeyedStore",
			"PluginStateSyncKeyedStore",
			"createPluginStateSyncKeyedStore",
			"PluginStateKeyedStore.update",
			"PluginStateKeyedStore.deleteIf"
		],
		diagnostics: ["TypeScript @deprecated annotations and state-store migration documentation", "plugin compatibility inventory; no new runtime warnings"],
		tests: [
			"src/plugins/compat/registry.test.ts",
			"src/plugin-state/plugin-state-store.test.ts",
			"src/plugin-state/plugin-state-store.runtime.test.ts",
			"test/type-contracts/plugin-state-store-runtime.ts",
			"src/plugins/loader.runtime-registry.test.ts"
		],
		releaseNote: "Synchronous plugin keyed stores remain supported through the next Plugin SDK major while plugins migrate to awaited keyed-store operations; trust eligibility and transactional callbacks are unchanged."
	},
	{
		code: "memory-read-result-statusless-success",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-04-28",
		deprecated: "2026-08-19",
		warningStarts: "2026-08-19",
		removalGate: "next-plugin-sdk-major",
		replacement: "`MemoryReadResult` with explicit `status: \"ok\" | \"not_found\"`",
		docsPath: "/plugins/sdk-migration#memory-read-missing-results",
		surfaces: ["statusless external memory manager read results"],
		diagnostics: ["host memory-manager acquisition adapter"],
		tests: ["src/plugins/memory-runtime.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "External memory managers must return explicit not-found status for absence; statusless results retain legacy successful-read semantics through the next Plugin SDK major."
	},
	{
		code: "context-engine-legacy-host-param-default",
		status: "removed",
		owner: "sdk",
		introduced: "2026-07-29",
		replacement: "`ContextEngineInfo.acceptedHostParams` for restricted projection; omitted declarations receive full host params",
		docsPath: "/concepts/context-engine#the-contextengine-interface",
		surfaces: ["ContextEngineInfo.acceptedHostParams and undeclared-engine default projection"],
		diagnostics: ["plugin compatibility registry and context engine guide"],
		tests: ["src/context-engine/host-param-projection.test.ts"],
		releaseNote: "The undeclared context-engine host-parameter compatibility default was removed; engines without `acceptedHostParams` now receive all current host fields."
	},
	{
		code: "removed-global-api-provider-publication",
		status: "removed",
		owner: "sdk",
		introduced: "2026-05-27",
		replacement: "provider plugins via `api.registerProvider(...)`; host/runtime code registers against its lifecycle-owned `ApiRegistry`",
		docsPath: "/plugins/sdk-migration#process-global-api-provider-publication",
		surfaces: ["openclaw/plugin-sdk/llm registerApiProvider", "openclaw/plugin-sdk/llm unregisterApiProviders"],
		diagnostics: ["plugin SDK compatibility registry and migration guide"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The process-global API-provider publication facade was removed; provider plugins now publish through their lifecycle-owned registration, and host runtimes register directly on their prepared ApiRegistry."
	},
	{
		code: "legacy-deactivate-hook-alias",
		status: "removed",
		owner: "sdk",
		introduced: "2026-05-16",
		replacement: "`gateway_stop` hook",
		docsPath: "/plugins/sdk-migration#deactivate-hook-alias",
		surfaces: ["api.on(\"deactivate\", ...)", "plugin typed hook registration"],
		diagnostics: ["plugin compatibility registry and migration guide"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated `api.on(\"deactivate\", ...)` hook alias was removed; plugins must register cleanup with `gateway_stop`."
	},
	{
		code: "legacy-subagent-spawning-hook",
		status: "removed",
		owner: "sdk",
		introduced: "2026-05-30",
		replacement: "`subagent_spawned` for post-launch observation; core session-binding adapters for thread routing",
		docsPath: "/plugins/hooks#upcoming-deprecations",
		surfaces: [
			"api.on(\"subagent_spawning\", ...)",
			"PluginHookSubagentSpawningEvent",
			"PluginHookSubagentSpawningResult",
			"SubagentLifecycleHookRunner.runSubagentSpawning"
		],
		diagnostics: ["plugin compatibility registry and migration guide"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "`api.on(\"subagent_spawning\", ...)` was removed; core now owns thread-bound subagent routing, and `subagent_spawned` remains available for observation."
	},
	{
		code: "hook-only-plugin-shape",
		status: "active",
		owner: "sdk",
		introduced: "2026-04-24",
		replacement: "explicit capability registration",
		docsPath: "/plugins/sdk-migration",
		surfaces: [
			"plugin shape inspection",
			"plugins inspect",
			"status diagnostics"
		],
		diagnostics: ["plugin compatibility notice"],
		tests: ["src/plugins/status.test.ts", "src/plugins/contracts/shape.contract.test.ts"]
	},
	{
		code: "deprecated-memory-embedding-provider-api",
		status: "removed",
		owner: "sdk",
		introduced: "2026-05-21",
		replacement: "`api.registerEmbeddingProvider(...)` and `contracts.embeddingProviders`",
		docsPath: "/plugins/sdk-migration#memory-embedding-provider-api",
		surfaces: [
			"api.registerMemoryEmbeddingProvider(...)",
			"contracts.memoryEmbeddingProviders",
			"openclaw/plugin-sdk/memory-core-host-engine-embeddings registerMemoryEmbeddingProvider",
			"plugin compatibility registry and migration guide"
		],
		diagnostics: ["plugin compatibility registry and migration guide"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "Memory-specific embedding provider registration was removed; plugins now use the generic embedding provider contract."
	},
	{
		code: "deprecated-session-store-beta5-api",
		status: "removed",
		owner: "sdk",
		introduced: "2026-05-21",
		deprecated: "2026-07-12",
		warningStarts: "2026-07-12",
		replacement: "Use `getSessionEntry(...)` and `listSessionEntries(...)` for reads; `patchSessionEntry(...)`, `upsertSessionEntry(...)`, and `deleteSessionEntry(...)` for row mutations; and session identity with `session-transcript-runtime` for active transcripts. The supported-plugin cutoff excludes v2026.7.1-beta.5 and other packages importing the retired bridge.",
		docsPath: "/plugins/sdk-migration/removed-surfaces#removed-session-and-transcript-file-apis",
		surfaces: [
			"openclaw/plugin-sdk/session-store-runtime loadSessionStore",
			"openclaw/plugin-sdk/session-store-runtime updateSessionStore",
			"openclaw/plugin-sdk/session-store-runtime resolveSessionFilePath",
			"openclaw/plugin-sdk/session-store-runtime resolveSessionStoreEntry",
			"openclaw/plugin-sdk/session-store-runtime LoadSessionStoreOptions",
			"openclaw/plugin-sdk/session-store-runtime UpdateSessionStoreOptions",
			"openclaw package root loadSessionStore",
			"openclaw package root saveSessionStore"
		],
		diagnostics: ["plugin compatibility registry and migration guide"],
		tests: [
			"src/plugin-sdk/session-store-runtime.test.ts",
			"src/index.test.ts",
			"src/plugins/compat/registry.test.ts"
		],
		releaseNote: "The September 30, 2026 approved cutoff retired the beta.5 session-store bridge, its option types, and package-root loadSessionStore/saveSessionStore aliases ahead of the former October 12 window. Plugins must use scoped row APIs and identity-backed transcript APIs; the session-store-runtime subpath and resolveStorePath remain available."
	},
	{
		code: "plugin-sdk-session-agent-resolution-aliases",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-08-29",
		deprecated: "2026-08-29",
		warningStarts: "2026-08-29",
		removeAfter: "2026-11-29",
		replacement: "`resolveSessionAgentIdsStrict` and `resolveSessionAgentIdStrict` with an explicit agent, agent-scoped session key, prepared fallback, or persisted owner",
		docsPath: "/plugins/compatibility#session-agent-resolution-aliases",
		surfaces: [
			"openclaw/plugin-sdk/agent-scope-runtime resolveSessionAgentIds and resolveSessionAgentId",
			"openclaw/plugin-sdk/agent-runtime session-agent resolver aliases",
			"openclaw/plugin-sdk/agent-harness-runtime session-agent resolver aliases",
			"openclaw/plugin-sdk/memory-core-host-runtime-core session-agent resolver alias",
			"openclaw/plugin-sdk/memory-host-core session-agent resolver alias"
		],
		diagnostics: ["TypeScript deprecated SDK alias annotations", "plugin compatibility registry"],
		tests: ["src/plugin-sdk/agent-scope-runtime.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Legacy Plugin SDK session-agent resolver names preserve ambient system-agent fallback while published plugins migrate to strict owner-required aliases."
	},
	{
		code: "agent-harness-credential-prompt-string-argument",
		status: "deprecated",
		owner: "sdk",
		introduced: "2026-08-08",
		deprecated: "2026-09-09",
		warningStarts: "2026-09-09",
		removeAfter: "2026-11-30",
		replacement: "options object `{ controlToolsAvailable }`",
		docsPath: "/plugins/sdk-migration/removed-surfaces#credential-prompt-builder",
		surfaces: ["openclaw/plugin-sdk/agent-harness-runtime buildCredentialSafetyPrompt string argument"],
		diagnostics: ["JSDoc parameter deprecation", "plugin compatibility registry"],
		tests: ["src/agents/credential-safety-prompt.test.ts"],
		releaseNote: "The credential prompt helper remains available with private login-code handoff and capability-aware terminal setup guidance; its ignored legacy string argument is supported through 2026-11-30."
	},
	{
		code: "removed-session-transcript-file-api",
		status: "removed",
		owner: "sdk",
		introduced: "2026-07-01",
		replacement: "session identity (`sessionKey`/`sessionId`), `SessionTranscriptUpdate.target`, and Gateway/runtime session helpers",
		docsPath: "/plugins/sdk-migration#removed-session-and-transcript-file-apis",
		surfaces: [
			"saveSessionStore",
			"resolveSessionTranscriptPathInDir",
			"resolveAndPersistSessionFile",
			"readLatestAssistantTextFromSessionTranscript",
			"SessionTranscriptUpdate.sessionFile",
			"sessionFiles",
			"transcriptPath",
			"sessionFile",
			"plugins inspect compatibility notices"
		],
		diagnostics: ["plugin compatibility notice"],
		tests: ["src/plugins/status.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Session/transcript file APIs were removed with the SQLite session storage flip; plugins now use session identity and Gateway/runtime session helpers."
	},
	{
		code: "hook.before_tool_call.terminal-block-approval",
		status: "active",
		owner: "agent-runtime",
		introduced: "2026-04-29",
		docsPath: "/plugins/hooks",
		surfaces: ["before_tool_call block result", "before_tool_call approval result"],
		diagnostics: ["hook runner contract probe"],
		tests: ["src/agents/agent-tools.before-tool-call.e2e.test.ts"]
	},
	{
		code: "hook.llm-observer.privacy-payload",
		status: "active",
		owner: "agent-runtime",
		introduced: "2026-04-29",
		docsPath: "/plugins/hooks",
		surfaces: [
			"llm_input",
			"llm_output",
			"agent_end",
			"allowConversationAccess"
		],
		diagnostics: ["conversation access hook contract probe"],
		tests: ["src/agents/cli-runner.reliability.test.ts", "src/config/schema.help.quality.test.ts"]
	},
	{
		code: "api.capture.runtime-registrars",
		status: "active",
		owner: "plugin-execution",
		introduced: "2026-04-29",
		docsPath: "/plugins/architecture-internals",
		surfaces: [
			"createCapturedPluginRegistration",
			"capturePluginRegistration",
			"OpenClawPluginApi"
		],
		diagnostics: ["runtime registration capture contract probe"],
		tests: ["src/plugins/captured-registration.test.ts"]
	},
	{
		code: "channel.runtime.envelope-config-metadata",
		status: "active",
		owner: "channel",
		introduced: "2026-04-29",
		docsPath: "/plugins/sdk-channel-plugins",
		surfaces: [
			"api.registerChannel",
			"channel setup metadata",
			"channel message envelope"
		],
		diagnostics: ["channel runtime contract probe"],
		tests: ["src/plugin-sdk/channel-entry-contract.test.ts", "src/plugins/captured-registration.test.ts"]
	},
	{
		code: "whatsapp-web-inbound-flat-message-aliases",
		status: "removed",
		owner: "channel",
		introduced: "2026-05-30",
		replacement: "WhatsApp `WebInboundCallbackMessage` nested contexts: `event`, `payload`, `quote`, `group`, and `platform`",
		docsPath: "/plugins/compatibility",
		surfaces: [
			"@openclaw/whatsapp WebInboundMessage flat fields",
			"WhatsApp monitorWebInbox onMessage callback",
			"WhatsApp monitorWebChannel listenerFactory injected messages"
		],
		diagnostics: ["plugin compatibility registry and compatibility guide"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "WhatsApp WebInboundMessage flat fields were removed; callbacks now receive only nested inbound contexts."
	},
	{
		code: "whatsapp-web-inbound-admission-top-level-fields",
		status: "removed",
		owner: "channel",
		introduced: "2026-06-14",
		replacement: "WhatsApp `WebInboundMessage.admission` fields: `conversation.id`, `accountId`, `ingress.decision`, and `conversation.kind`",
		docsPath: "/plugins/compatibility",
		surfaces: [
			"@openclaw/whatsapp WebInboundMessage top-level admission fields",
			"WhatsApp monitorWebInbox onMessage callback",
			"WhatsApp monitorWebChannel listenerFactory injected messages"
		],
		diagnostics: ["plugin compatibility registry and compatibility guide"],
		tests: ["src/plugins/compat/registry.test.ts"],
		releaseNote: "WhatsApp WebInboundMessage top-level admission fields were removed; callbacks now read the canonical admission envelope."
	},
	{
		code: "sdk-untrusted-context-identifier-aliases",
		status: "removal-pending",
		owner: "sdk",
		introduced: "2026-07-22",
		deprecated: "2026-07-22",
		warningStarts: "2026-07-22",
		removeAfter: "2026-09-08",
		replacement: "`MsgContext.ChannelPromptContext`, `MsgContext.ChannelStructuredContext`, `ChannelStructuredContextEntry`, `SupplementalContextFacts.channelStructuredContext`, and `buildChannelMetadata`; retain the aliases until migration of published plugin readers is verified and explicit breaking-release approval is granted",
		docsPath: "/plugins/compatibility",
		surfaces: [
			"openclaw/plugin-sdk reply-runtime MsgContext.UntrustedContext and UntrustedStructuredContext",
			"openclaw/plugin-sdk reply-runtime UntrustedStructuredContextEntry",
			"openclaw/plugin-sdk channel-inbound SupplementalContextFacts.untrustedContext",
			"openclaw/plugin-sdk security-runtime buildUntrustedChannelMetadata"
		],
		diagnostics: ["TypeScript deprecated SDK alias annotations"],
		tests: ["src/auto-reply/reply/inbound-context.test.ts"],
		releaseNote: "Untrusted-named prompt-context SDK identifiers remain wired as deprecated aliases of the channel-named fields while plugins migrate."
	},
	{
		code: "channel-explicit-target-parser",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-28",
		replacement: "`messaging.targetResolver` for target normalization and `messaging.resolveOutboundSessionRoute` for session/thread identity",
		docsPath: "/plugins/sdk-migration",
		surfaces: [
			"ChannelMessagingAdapter.parseExplicitTarget",
			"openclaw/plugin-sdk/channel-route ChannelRouteExplicitTarget",
			"openclaw/plugin-sdk/channel-route ChannelRouteExplicitTargetParser",
			"openclaw/plugin-sdk/channel-route resolveChannelRouteTargetWithParser"
		],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/channels/plugins/contracts/test-helpers/surface-contract-suite.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "The deprecated channel explicit-target parser was removed; plugins must normalize targets with `messaging.targetResolver` and project session identity with `messaging.resolveOutboundSessionRoute`."
	},
	{
		code: "channel-messaging-targets-subpath",
		status: "removed",
		owner: "sdk",
		introduced: "2026-04-28",
		replacement: "`openclaw/plugin-sdk/channel-targets`",
		docsPath: "/plugins/sdk-migration",
		surfaces: ["openclaw/plugin-sdk/messaging-targets"],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/compat/registry.test.ts", "src/plugins/contracts/plugin-sdk-subpaths.test.ts"],
		releaseNote: "The deprecated `openclaw/plugin-sdk/messaging-targets` subpath was removed; import target helpers from `openclaw/plugin-sdk/channel-targets`."
	},
	{
		code: "bundled-plugin-allowlist",
		status: "active",
		owner: "config",
		introduced: "2026-04-24",
		replacement: "manifest-owned plugin enablement and scoped load plans",
		docsPath: "/plugins/architecture",
		surfaces: [
			"plugins.allow",
			"bundled provider startup",
			"plugins status"
		],
		diagnostics: ["plugin status report"],
		tests: ["src/plugins/status.test.ts", "src/plugins/config-state.test.ts"]
	},
	{
		code: "bundled-plugin-enablement",
		status: "active",
		owner: "config",
		introduced: "2026-04-24",
		replacement: "manifest-owned plugin defaults and scoped load plans",
		docsPath: "/plugins/architecture",
		surfaces: [
			"plugins.entries",
			"bundled provider startup",
			"plugins status"
		],
		diagnostics: ["plugin status report"],
		tests: ["src/plugins/status.test.ts", "src/plugins/config-state.test.ts"]
	},
	{
		code: "activation-agent-harness-hint",
		...ACTIVATION_HINT_METADATA,
		replacement: "top-level `cliBackends[]` for CLI aliases and future `agentRuntime` ownership metadata",
		surfaces: ["activation.onAgentHarnesses", "activation planner"]
	},
	{
		code: "activation-provider-hint",
		...ACTIVATION_HINT_METADATA,
		replacement: "`providers[]` manifest ownership",
		surfaces: ["activation.onProviders", "activation planner"]
	},
	{
		code: "activation-channel-hint",
		...ACTIVATION_HINT_METADATA,
		replacement: "`channels[]` manifest ownership",
		surfaces: ["activation.onChannels", "activation planner"]
	},
	{
		code: "activation-command-hint",
		...ACTIVATION_HINT_METADATA,
		replacement: "`commandAliases` or command contribution metadata",
		surfaces: ["activation.onCommands", "activation planner"]
	},
	{
		code: "activation-route-hint",
		...ACTIVATION_HINT_METADATA,
		replacement: "HTTP route contribution metadata",
		surfaces: ["activation.onRoutes", "activation planner"]
	},
	{
		code: "activation-config-path-hint",
		...ACTIVATION_HINT_METADATA,
		introduced: "2026-04-27",
		replacement: "manifest contribution ownership for root config surfaces",
		surfaces: ["activation.onConfigPaths", "startup plugin selection"],
		tests: ["src/plugins/channel-plugin-ids.test.ts"]
	},
	{
		code: "activation-capability-hint",
		...ACTIVATION_HINT_METADATA,
		replacement: "manifest contribution ownership",
		surfaces: ["activation.onCapabilities", "activation planner"]
	},
	{
		code: "agent-harness-sdk-alias",
		status: "deprecated",
		owner: "agent-runtime",
		introduced: "2026-04-24",
		deprecated: "2026-04-25",
		warningStarts: "2026-04-25",
		replacement: "none yet; retain until a harness subpath ships and external migration is proven",
		docsPath: "/plugins/sdk-agent-harness",
		surfaces: ["openclaw/plugin-sdk/agent-harness", "openclaw/plugin-sdk/agent-harness-runtime"],
		diagnostics: ["plugin SDK compatibility warning"],
		tests: ["src/plugins/contracts/plugin-sdk-subpaths.test.ts"]
	},
	{
		code: "embedded-pi-agent-sdk-aliases",
		status: "removed",
		owner: "agent-runtime",
		introduced: "2026-05-21",
		replacement: "`runEmbeddedAgent` and `EmbeddedAgent*` SDK/runtime names",
		docsPath: "/plugins/sdk-runtime",
		surfaces: [
			"api.runtime.agent.runEmbeddedPiAgent",
			"openclaw/extension-api runEmbeddedPiAgent",
			"openclaw/plugin-sdk/agent-harness-runtime EmbeddedPi* aliases"
		],
		diagnostics: ["plugin SDK compatibility registry"],
		tests: ["src/plugins/runtime/index.test.ts", "src/plugins/contracts/plugin-sdk-subpaths.test.ts"],
		releaseNote: "The legacy `runEmbeddedPiAgent` and `EmbeddedPi*` plugin aliases were removed; plugins must use the neutral embedded-agent names."
	},
	{
		code: "plugin-sdk-shipped-channel-setup-exports",
		status: "deprecated",
		owner: "channel",
		introduced: "2026-07-23",
		deprecated: "2026-07-23",
		warningStarts: "2026-07-23",
		replacement: "retain until supported published packages migrate to plugin-owned config schemas plus generic `openclaw/plugin-sdk/channel-config-schema` and `openclaw/plugin-sdk/setup-runtime` primitives",
		docsPath: "/plugins/sdk-migration#published-channel-setup-compatibility",
		surfaces: [
			"openclaw/plugin-sdk/bundled-channel-config-schema SlackConfigSchema",
			"openclaw/plugin-sdk/bundled-channel-config-schema DiscordConfigSchema",
			"openclaw/plugin-sdk/bundled-channel-config-schema SignalConfigSchema",
			"openclaw/plugin-sdk/bundled-channel-config-schema MSTeamsConfigSchema",
			"openclaw/plugin-sdk/setup-runtime createLegacyCompatChannelDmPolicy",
			"openclaw/plugin-sdk/setup-runtime promptLegacyChannelAllowFromForAccount"
		],
		diagnostics: ["repository deprecated API usage guard for core and bundled plugins; no external runtime import warning"],
		tests: ["src/plugin-sdk/shipped-channel-compat.test.ts", "src/plugins/compat/registry.test.ts"],
		releaseNote: "Published OpenClaw channel packages through 2026.7.1 remain loadable while they migrate to plugin-owned config and setup helpers."
	},
	{
		code: "generated-bundled-channel-config-fallback",
		status: "active",
		owner: "channel",
		introduced: "2026-04-24",
		replacement: "manifest registry `channelConfigs` metadata",
		docsPath: "/plugins/manifest",
		surfaces: ["generated bundled channel config metadata", "channel config validation"],
		diagnostics: ["channel config metadata fallback"],
		tests: ["src/plugins/contracts/config-footprint-guardrails.test.ts"]
	},
	{
		code: "setup-runtime-fallback",
		status: "active",
		owner: "setup",
		introduced: "2026-04-24",
		replacement: "`setup.requiresRuntime: false` with complete setup descriptors",
		docsPath: "/plugins/manifest/setup-and-auth#setup-reference",
		surfaces: ["setup-api runtime fallback", "setup.requiresRuntime omitted"],
		diagnostics: ["setup registry runtime diagnostic"],
		tests: ["src/plugins/setup-registry.test.ts", "src/plugins/setup-registry.runtime.test.ts"]
	}
];
//#endregion
//#region src/plugins/compat/registry.ts
function listPluginCompatRecords() {
	return PLUGIN_COMPAT_RECORDS;
}
//#endregion
//#region src/plugins/installed-plugin-index-policy.ts
/** Hashes plugin compat registry state that can affect installed index validity. */
function resolveCompatRegistryVersion() {
	return hashJson(listPluginCompatRecords().map((record) => ({
		code: record.code,
		status: record.status,
		deprecated: record.deprecated,
		warningStarts: record.warningStarts,
		removeAfter: record.removeAfter,
		removalGate: record.removalGate,
		replacement: record.replacement
	})));
}
/** Hashes config policy inputs that can change installed plugin activation. */
function resolveInstalledPluginIndexPolicyHash(config, env, behavior = {}) {
	const normalized = normalizePluginsConfig(config?.plugins);
	const channelPolicy = {};
	const channels = config?.channels;
	if (channels && typeof channels === "object" && !Array.isArray(channels)) {
		for (const [channelId, value] of Object.entries(channels)) if (value && typeof value === "object" && !Array.isArray(value)) {
			const enabled = value.enabled;
			if (typeof enabled === "boolean") channelPolicy[channelId] = enabled;
		}
	}
	return hashJson({
		plugins: {
			enabled: normalized.enabled,
			allow: normalized.allow,
			deny: normalized.deny,
			bundledDiscovery: readBundledDiscoveryModeMemoized(env, behavior) ?? null,
			slots: normalized.slots,
			entries: Object.fromEntries(Object.entries(normalized.entries).flatMap(([pluginId, entry]) => typeof entry.enabled === "boolean" ? [[pluginId, entry.enabled]] : []).toSorted(([left], [right]) => left.localeCompare(right)))
		},
		channels: Object.fromEntries(Object.entries(channelPolicy).toSorted(([left], [right]) => left.localeCompare(right)))
	});
}
//#endregion
//#region src/plugins/installed-plugin-index-facts.ts
/** Package facts share the existing generation; mutable management inputs stay uncached. */
function getInstalledPluginIndexFacts(index) {
	const entries = getPluginCache().metadata.indexFacts;
	const existing = entries.get(index);
	if (existing) return existing;
	if (!isDeeplyFrozenPlainData(index)) return;
	const facts = {};
	entries.set(index, facts);
	return facts;
}
//#endregion
//#region src/plugins/bundled-compat.ts
/** Returns config with selected bundled plugins explicitly enabled when compat rules require it. */
function withBundledPluginEnablementCompat(params) {
	if (params.pluginIds.length === 0) return params.config;
	const existingEntries = params.config?.plugins?.entries ?? {};
	const selectPlugins = params.activation !== "defaults";
	const forcePluginsEnabled = selectPlugins && params.config?.plugins?.enabled === false;
	const allow = params.config?.plugins?.allow;
	const bypassAllowlist = readBundledDiscoveryModeMemoized(params.env, { artifactPreservingReadOnly: params.artifactPreservingReadOnly }) === "compat";
	const allowSet = !bypassAllowlist && Array.isArray(allow) && allow.length > 0 ? new Set(allow.map((pluginId) => normalizePluginId(pluginId)).filter(Boolean)) : void 0;
	let hasEligiblePlugin = false;
	let changed = false;
	const nextEntries = { ...existingEntries };
	const nextAllow = bypassAllowlist && Array.isArray(allow) ? new Set(allow) : void 0;
	for (const pluginId of params.pluginIds) {
		if (allowSet && !allowSet.has(pluginId)) continue;
		hasEligiblePlugin = true;
		const beforeAllowSize = nextAllow?.size;
		nextAllow?.add(pluginId);
		if (nextAllow && nextAllow.size !== beforeAllowSize) changed = true;
		if (!selectPlugins || existingEntries[pluginId] !== void 0) continue;
		nextEntries[pluginId] = { enabled: true };
		changed = true;
	}
	if (!changed && (!forcePluginsEnabled || !hasEligiblePlugin)) return params.config;
	return {
		...params.config,
		plugins: {
			...params.config?.plugins,
			...forcePluginsEnabled ? { enabled: true } : {},
			...nextAllow ? { allow: [...nextAllow] } : {},
			...selectPlugins ? { entries: nextEntries } : {}
		}
	};
}
//#endregion
//#region src/plugins/bundled-provider-compat.ts
const BUNDLED_PROVIDER_COMPAT_CONTRACT_KEYS = [
	"speechProviders",
	"externalAuthProviders",
	"embeddingProviders",
	"mediaUnderstandingProviders",
	"transcriptSourceProviders",
	"realtimeVoiceProviders",
	"realtimeTranscriptionProviders",
	"imageGenerationProviders",
	"videoGenerationProviders",
	"musicGenerationProviders",
	"webFetchProviders",
	"webSearchProviders",
	"workerProviders",
	"storageProviders",
	"usageProviders",
	"migrationProviders"
];
const BUNDLED_PROVIDER_COMPAT_CONTRACTS = new Set(BUNDLED_PROVIDER_COMPAT_CONTRACT_KEYS);
function isBundledProviderCompatContract(contract) {
	return BUNDLED_PROVIDER_COMPAT_CONTRACTS.has(contract);
}
function isBundledProviderCompatPlugin(plugin) {
	return plugin.origin === "bundled" && ((plugin.providers?.length ?? 0) > 0 || BUNDLED_PROVIDER_COMPAT_CONTRACT_KEYS.some((contract) => (plugin.contracts?.[contract]?.length ?? 0) > 0));
}
//#endregion
//#region src/plugins/installed-plugin-index-install-records.ts
/** Normalizes durable plugin install records into installed-index metadata and back. */
/** Normalizes raw plugin install records into index-safe install record metadata. */
function normalizeInstallRecordMap(records) {
	const normalized = parsePluginInstallRecordMap(records ?? {});
	if (!normalized) throw new Error("Invalid plugin install record map");
	return normalized;
}
function restoreInstallRecordMap(records) {
	const restored = parsePluginInstallRecordMap(records ?? {});
	if (!restored) throw new Error("Invalid persisted plugin install record map");
	return restored;
}
/** Copies canonical install records out of the installed index. */
function extractPluginInstallRecordsFromInstalledPluginIndex(index) {
	const facts = index ? getInstalledPluginIndexFacts(index) : void 0;
	if (!facts) return restoreInstallRecordMap(index?.installRecords);
	const parsed = facts.installRecords ??= restoreInstallRecordMap(index?.installRecords);
	const records = createPluginInstallRecordMap();
	for (const [pluginId, record] of Object.entries(parsed)) setPluginInstallRecordMapEntry(records, pluginId, {
		...record,
		...record.clawhubTrustReasons ? { clawhubTrustReasons: [...record.clawhubTrustReasons] } : {},
		...record.acceptedSurface ? { acceptedSurface: structuredClone(record.acceptedSurface) } : {}
	});
	return records;
}
//#endregion
//#region src/plugins/installed-plugin-index-manifest.ts
/** True when the bundle format permits omitting its manifest file. */
function isOptionalPluginManifestFile(record) {
	return record.format === "bundle" && record.bundleFormat === "claude";
}
/** True when a Claude bundle record omits its optional manifest file. */
function hasOptionalMissingPluginManifestFile(record) {
	return isOptionalPluginManifestFile(record) && !pluginCacheExistsSync(record.manifestPath);
}
//#endregion
//#region src/plugins/installed-plugin-index-record-builder.ts
/** Builds installed-index records from normalized plugin manifest registry entries. */
function buildStartupInfo(record) {
	return {
		sidecar: record.activation?.onStartup === true,
		memory: hasKind(record.kind, "memory"),
		agentHarnesses: normalizeSortedUniqueStringEntries([...record.activation?.onAgentHarnesses ?? [], ...record.cliBackends ?? []]),
		configPaths: normalizeSortedUniqueStringEntries(record.activation?.onConfigPaths)
	};
}
function buildContributionInfo(record) {
	const contracts = Object.fromEntries(Object.entries(record.contracts ?? {}).map(([key, values]) => [key, normalizeSortedUniqueStringEntries(values)]));
	return {
		channels: normalizeSortedUniqueStringEntries(record.channels),
		channelConfigs: normalizeSortedUniqueStringEntries(Object.keys(record.channelConfigs ?? {})),
		providers: normalizeSortedUniqueStringEntries(record.providers),
		modelCatalogProviders: normalizeSortedUniqueStringEntries([
			...Object.keys(record.modelCatalog?.providers ?? {}),
			...Object.keys(record.modelCatalog?.aliases ?? {}),
			...(record.modelCatalog?.suppressions ?? []).map((entry) => entry.provider)
		]),
		modelSupportPrefixes: normalizeSortedUniqueStringEntries(record.modelSupport?.modelPrefixes),
		modelSupportPatterns: normalizeSortedUniqueStringEntries(record.modelSupport?.modelPatterns),
		autoEnableProviderIds: normalizeSortedUniqueStringEntries(record.autoEnableWhenConfiguredProviders),
		commandAliases: normalizeSortedUniqueStringEntries(record.commandAliases?.map((alias) => alias.name)),
		contracts
	};
}
const ACTIVATION_COMPAT_CODES = [
	["onProviders", "activation-provider-hint"],
	["onAgentHarnesses", "activation-agent-harness-hint"],
	["onChannels", "activation-channel-hint"],
	["onCommands", "activation-command-hint"],
	["onRoutes", "activation-route-hint"],
	["onConfigPaths", "activation-config-path-hint"],
	["onCapabilities", "activation-capability-hint"]
];
/** Collects compatibility codes implied by a manifest's legacy or activation surfaces. */
function collectPluginManifestCompatCodes(record) {
	return ACTIVATION_COMPAT_CODES.filter(([key]) => record.activation?.[key]?.length).map(([, code]) => code).toSorted();
}
function resolvePackageJsonRecord(params) {
	const { candidate } = params;
	if (!candidate?.packageDir) return;
	const file = readPluginCacheFile({
		rootDir: candidate.packageDir,
		relativePath: "package.json",
		rejectHardlinks: params.rejectHardlinks
	});
	if (!file.ok) return;
	const rootDir = candidate.rootDir === candidate.packageDir ? file.rootRealPath : pluginCacheRealpathSync(candidate.rootDir) ?? path.resolve(candidate.rootDir);
	if (!isPathInside(rootDir, file.path)) return;
	const packageJsonPath = path.join(file.rootRealPath, "package.json");
	return {
		path: (path.relative(rootDir, packageJsonPath) || "package.json").split(path.sep).join("/"),
		hash: file.hash,
		fileSignature: file.signature
	};
}
function describePackageInstallSource(candidate) {
	const install = candidate?.packageManifest?.install;
	if (!install) return;
	return describePluginInstallSource(install, { expectedPackageName: candidate?.packageName });
}
function normalizePackageChannel(channel) {
	const id = normalizeOptionalString(channel?.id);
	if (!id) return;
	return {
		...structuredClone(channel),
		id
	};
}
function hashManifestlessBundleRecord(record) {
	return hashJson({
		id: record.id,
		name: record.name,
		description: record.description,
		version: record.version,
		format: record.format,
		bundleFormat: record.bundleFormat,
		bundleCapabilities: record.bundleCapabilities ?? [],
		skills: record.skills ?? [],
		settingsFiles: record.settingsFiles ?? [],
		hooks: record.hooks ?? []
	});
}
function readRecordFile(params) {
	const rootDir = params.boundaryRoot ?? params.record.rootDir;
	const file = readPluginCacheFile({
		rootDir,
		relativePath: path.relative(rootDir, params.filePath),
		rejectHardlinks: params.rejectHardlinks,
		...params.required && path.extname(params.filePath) === ".json" ? { maxBytes: 262144 } : {}
	});
	if (file.ok) return file;
	if (params.required) params.diagnostics.push({
		level: "warn",
		pluginId: params.record.id,
		source: params.filePath,
		message: `installed plugin index could not hash ${params.filePath}: ${file.failure.reason}`
	});
}
function buildInstalledPluginIndexRecords(params) {
	const candidateBySource = new Map(params.candidates.map((candidate) => [candidate.source, candidate]));
	const normalizedConfig = normalizePluginsConfig(params.config?.plugins);
	return params.registry.plugins.map((record) => {
		const candidate = candidateBySource.get(record.source);
		const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
			origin: record.origin,
			rootDir: record.rootDir,
			env: params.env
		});
		const installOwner = candidate && isPluginCandidateInstallOwnerAmbiguous(candidate) ? void 0 : resolvePluginManifestInstallOwner(record) ?? (candidate ? resolvePluginCandidateInstallOwner(candidate) : void 0);
		const installRecord = installOwner ? getPluginInstallRecordMapEntry(params.installRecords, installOwner) : void 0;
		const packageInstall = describePackageInstallSource(candidate);
		const packageChannel = normalizePackageChannel(record.packageChannel ?? candidate?.packageManifest?.channel);
		const manifestless = hasOptionalMissingPluginManifestFile(record);
		const manifestFile = manifestless ? void 0 : readRecordFile({
			record,
			filePath: record.manifestPath,
			rejectHardlinks,
			required: true,
			diagnostics: params.diagnostics
		});
		const manifestHash = manifestless ? hashManifestlessBundleRecord(record) : manifestFile?.hash ?? "";
		const doctorContractArtifact = resolvePluginDoctorContractArtifact(record);
		const doctorContractFile = doctorContractArtifact ? readRecordFile({
			record,
			filePath: doctorContractArtifact.modulePath,
			boundaryRoot: doctorContractArtifact.boundaryRoot,
			rejectHardlinks,
			diagnostics: params.diagnostics,
			required: false
		}) : void 0;
		const packageJson = resolvePackageJsonRecord({
			candidate,
			rejectHardlinks
		});
		const enabled = resolveEffectiveEnableState({
			id: record.id,
			origin: record.origin,
			channelIds: record.channels,
			config: normalizedConfig,
			rootConfig: params.config,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(record)
		}).enabled;
		const indexRecord = {
			pluginId: record.id,
			manifestPath: record.manifestPath,
			manifestHash,
			...doctorContractFile ? {
				doctorContractHash: doctorContractFile.hash,
				doctorContractFile: doctorContractFile.signature
			} : {},
			...manifestFile ? { manifestFile: manifestFile.signature } : {},
			source: record.source,
			rootDir: record.rootDir,
			origin: record.origin,
			enabled,
			startup: buildStartupInfo(record),
			contributions: buildContributionInfo(record),
			compat: collectPluginManifestCompatCodes(record)
		};
		if (record.format && record.format !== "openclaw") indexRecord.format = record.format;
		if (record.bundleFormat) indexRecord.bundleFormat = record.bundleFormat;
		if (record.enabledByDefault === true) indexRecord.enabledByDefault = true;
		if (record.enabledByDefaultOnPlatforms?.length) indexRecord.enabledByDefaultOnPlatforms = [...record.enabledByDefaultOnPlatforms];
		if (record.syntheticAuthRefs?.length) indexRecord.syntheticAuthRefs = [...record.syntheticAuthRefs];
		if (record.setupSource) indexRecord.setupSource = record.setupSource;
		if (candidate?.packageName) indexRecord.packageName = candidate.packageName;
		if (candidate?.packageVersion) indexRecord.packageVersion = candidate.packageVersion;
		if (installRecord) indexRecord.installRecordHash = hashJson(installRecord);
		if (packageInstall) indexRecord.packageInstall = packageInstall;
		if (packageChannel) indexRecord.packageChannel = packageChannel;
		if (candidate?.packageManifest?.build) indexRecord.packageBuild = structuredClone(candidate.packageManifest.build);
		if (packageJson) indexRecord.packageJson = packageJson;
		return recordInstalledPluginIndexInstallOwner(indexRecord, installOwner, candidate ? isPluginCandidateInstallOwnerAmbiguous(candidate) : false);
	});
}
//#endregion
//#region src/plugins/installed-plugin-index-types.ts
const INSTALLED_PLUGIN_INDEX_WARNING = "DO NOT EDIT. This file is generated by OpenClaw from plugin manifests, install records, and config policy. Use `openclaw plugins registry --refresh`, `openclaw plugins install/update/uninstall`, or `openclaw plugins enable/disable` instead.";
//#endregion
//#region src/plugins/installed-plugin-index-config-path-scope.ts
/** Compat code marking install records that need config-path activation metadata. */
const CONFIG_PATH_ACTIVATION_COMPAT_CODE = "activation-config-path-hint";
function recordUsesConfigPathActivation(plugin) {
	return plugin.compat.includes(CONFIG_PATH_ACTIVATION_COMPAT_CODE);
}
/** True when an index still has config-path activation records missing startup metadata. */
function hasMissingConfigPathActivationMetadata(index) {
	return index.plugins.some((plugin) => recordUsesConfigPathActivation(plugin) && plugin.startup.configPaths === void 0);
}
/** True when a record migrated config-path activation startup metadata. */
function hasConfigPathActivationMetadataMigration(params) {
	return recordUsesConfigPathActivation(params.previous) && params.previous.startup.configPaths === void 0 && params.current.startup.configPaths !== void 0;
}
//#endregion
//#region src/plugins/installed-plugin-index-invalidation.ts
function diffInstalledPluginIndexInvalidationReasons(previous, current) {
	const reasons = /* @__PURE__ */ new Set();
	if (previous.version !== current.version) reasons.add("missing");
	if (previous.hostContractVersion !== current.hostContractVersion) reasons.add("host-contract-changed");
	if (previous.compatRegistryVersion !== current.compatRegistryVersion) reasons.add("compat-registry-changed");
	if (previous.migrationVersion !== current.migrationVersion) reasons.add("migration");
	if (previous.policyHash !== current.policyHash) reasons.add("policy-changed");
	if (hashJson(previous.installRecords ?? {}) !== hashJson(current.installRecords ?? {})) reasons.add("source-changed");
	const previousByPluginId = new Map(previous.plugins.map((plugin) => [plugin.pluginId, plugin]));
	const currentByPluginId = new Map(current.plugins.map((plugin) => [plugin.pluginId, plugin]));
	for (const [pluginId, previousPlugin] of previousByPluginId) {
		const currentPlugin = currentByPluginId.get(pluginId);
		if (!currentPlugin) {
			reasons.add("source-changed");
			continue;
		}
		if (previousPlugin.rootDir !== currentPlugin.rootDir || previousPlugin.manifestPath !== currentPlugin.manifestPath || previousPlugin.source !== currentPlugin.source || previousPlugin.setupSource !== currentPlugin.setupSource || resolveInstalledPluginIndexInstallOwner(previousPlugin) !== resolveInstalledPluginIndexInstallOwner(currentPlugin) || isInstalledPluginIndexInstallOwnerAmbiguous(previousPlugin) !== isInstalledPluginIndexInstallOwnerAmbiguous(currentPlugin) || previousPlugin.installRecordHash !== currentPlugin.installRecordHash) reasons.add("source-changed");
		if (previousPlugin.enabled !== currentPlugin.enabled) reasons.add("policy-changed");
		if (hasConfigPathActivationMetadataMigration({
			previous: previousPlugin,
			current: currentPlugin
		})) reasons.add("migration");
		if (previousPlugin.manifestHash !== currentPlugin.manifestHash || previousPlugin.doctorContractHash !== currentPlugin.doctorContractHash) reasons.add("stale-manifest");
		if (previousPlugin.packageVersion !== currentPlugin.packageVersion || previousPlugin.packageJson?.path !== currentPlugin.packageJson?.path || previousPlugin.packageJson?.hash !== currentPlugin.packageJson?.hash) reasons.add("stale-package");
	}
	for (const [pluginId, plugin] of currentByPluginId) if (!previousByPluginId.has(pluginId) && plugin.enabled) reasons.add("source-changed");
	return Array.from(reasons).toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region src/plugins/installed-plugin-index.ts
function buildInstalledPluginIndex(params) {
	const env = params.env ?? process.env;
	const installRecords = normalizeInstallRecordMap(params.installRecords ?? loadInstalledPluginIndexInstallRecordsSync({
		env,
		...params.stateDir ? { stateDir: params.stateDir } : {},
		...params.pluginIndexFilePath ? { filePath: params.pluginIndexFilePath } : {}
	}));
	const baseDiscovery = params.candidates ? {
		candidates: params.candidates,
		diagnostics: params.diagnostics ?? []
	} : params.discovery ?? discoverOpenClawPlugins({
		workspaceDir: params.workspaceDir,
		extraPaths: normalizePluginsConfig(params.config?.plugins).loadPaths,
		env,
		installRecords
	});
	const discovery = !params.candidates && params.diagnostics?.length ? {
		...baseDiscovery,
		diagnostics: [...baseDiscovery.diagnostics, ...params.diagnostics]
	} : baseDiscovery;
	const registry = loadPluginManifestRegistryCore({
		registryPath: resolveInstalledPluginIndexStorePath({
			env,
			stateDir: params.stateDir,
			filePath: params.pluginIndexFilePath
		}),
		config: params.config,
		workspaceDir: params.workspaceDir,
		env,
		candidates: discovery.candidates,
		diagnostics: discovery.diagnostics,
		installRecords
	});
	const diagnostics = [...registry.diagnostics ?? []];
	const generatedAtMs = (params.now?.() ?? /* @__PURE__ */ new Date()).getTime();
	const activationConfig = withBundledPluginEnablementCompat({
		config: params.config,
		env,
		pluginIds: registry.plugins.filter(isBundledProviderCompatPlugin).map((plugin) => plugin.id),
		activation: "defaults",
		artifactPreservingReadOnly: params.artifactPreservingReadOnly
	});
	const plugins = buildInstalledPluginIndexRecords({
		candidates: discovery.candidates,
		registry,
		config: activationConfig,
		env,
		diagnostics,
		installRecords
	});
	return {
		index: {
			version: 1,
			warning: INSTALLED_PLUGIN_INDEX_WARNING,
			hostContractVersion: resolveCompatibilityHostVersion(env),
			compatRegistryVersion: resolveCompatRegistryVersion(),
			migrationVersion: 1,
			policyHash: resolveInstalledPluginIndexPolicyHash(params.config, env, { artifactPreservingReadOnly: params.artifactPreservingReadOnly }),
			generatedAtMs,
			...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
			...params.refreshReason ? { refreshReason: params.refreshReason } : {},
			installRecords,
			plugins,
			diagnostics
		},
		discovery: params.candidates ? void 0 : discovery,
		manifestRegistry: registry
	};
}
function loadInstalledPluginIndex(params = {}) {
	return buildInstalledPluginIndex(params).index;
}
function loadInstalledPluginIndexWithDiscovery(params = {}) {
	return buildInstalledPluginIndex(params);
}
/** True when a persisted index cannot represent the requested workspace discovery scope. */
function hasInstalledPluginIndexWorkspaceScopeMismatch(index, workspaceDir) {
	if (workspaceDir !== void 0) return index.workspaceDir !== workspaceDir;
	return index.workspaceDir !== void 0 || index.plugins.some((plugin) => plugin.origin === "workspace");
}
function refreshInstalledPluginIndex(params) {
	return buildInstalledPluginIndex({
		...params,
		refreshReason: params.reason
	}).index;
}
function isInstalledPluginEnabled(index, pluginId, config, env) {
	const record = index.plugins.find((plugin) => plugin.pluginId === pluginId);
	if (!record || !config) return record?.enabled ?? false;
	return createInstalledPluginEnabledPredicate([record], config, env)(pluginId);
}
function isInstalledBundledProvider(record) {
	return isBundledProviderCompatPlugin({
		origin: record.origin,
		providers: record.contributions?.providers,
		contracts: record.contributions?.contracts
	});
}
/** Prepare live policy for one synchronous operation, never across config/root changes. */
function createInstalledPluginEnabledPredicate(plugins, config, env) {
	let source;
	let bundledSource;
	let records;
	return (pluginId) => {
		if (!records) {
			records = /* @__PURE__ */ new Map();
			for (const entry of plugins) if (!records.has(entry.pluginId)) records.set(entry.pluginId, entry);
		}
		const record = records.get(pluginId);
		if (!record || !config) return record?.enabled ?? false;
		let activationSource;
		if (isInstalledBundledProvider(record)) {
			if (!bundledSource) {
				const bundledConfig = withBundledPluginEnablementCompat({
					config,
					env,
					pluginIds: plugins.filter(isInstalledBundledProvider).map((entry) => entry.pluginId),
					activation: "defaults"
				});
				bundledSource = bundledConfig === config ? source ??= createPluginActivationSource({ config }) : createPluginActivationSource({ config: bundledConfig });
			}
			activationSource = bundledSource;
		} else activationSource = source ??= createPluginActivationSource({ config });
		return resolveEffectivePluginActivationState({
			id: record.pluginId,
			origin: record.origin,
			channelIds: record.contributions?.channels,
			config: activationSource.plugins,
			rootConfig: activationSource.rootConfig,
			activationSource,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(record)
		}).enabled;
	};
}
//#endregion
export { getInstalledPluginIndexFacts as _, loadInstalledPluginIndexWithDiscovery as a, hasMissingConfigPathActivationMetadata as c, hasOptionalMissingPluginManifestFile as d, isOptionalPluginManifestFile as f, withBundledPluginEnablementCompat as g, isBundledProviderCompatPlugin as h, loadInstalledPluginIndex as i, INSTALLED_PLUGIN_INDEX_WARNING as l, isBundledProviderCompatContract as m, hasInstalledPluginIndexWorkspaceScopeMismatch as n, refreshInstalledPluginIndex as o, extractPluginInstallRecordsFromInstalledPluginIndex as p, isInstalledPluginEnabled as r, diffInstalledPluginIndexInvalidationReasons as s, createInstalledPluginEnabledPredicate as t, collectPluginManifestCompatCodes as u, resolveCompatRegistryVersion as v, resolveInstalledPluginIndexPolicyHash as y };
