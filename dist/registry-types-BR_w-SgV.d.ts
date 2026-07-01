import { _ as PluginDiagnostic, a as PluginDependencyStatus, d as PluginKind, g as PluginConfigUiHint, h as PluginBundleFormat, s as PluginManifestContracts, v as PluginFormat } from "./manifest-registry-CggWNHxH.js";
import { t as JsonSchemaObject } from "./json-schema.types-z_ZXZBRr.js";
import { t as PluginOrigin$1 } from "./plugin-origin.types-DOQEvsWL.js";
import { i as PluginCompatCode } from "./installed-plugin-index-types-CgTwVkzp.js";
import { t as ChannelPlugin$1 } from "./types.plugin-DvEuFaxA.js";
import { nt as PluginHookRegistration$1 } from "./hook-types-mbU3l3kV.js";
import { $ as OpenClawPluginService$1, $n as PluginRuntime, Al as WebFetchProviderPlugin$1, D as OpenClawPluginCliRegistrar$1, Da as AgentHarness, Ei as PluginTrustedToolPolicyRegistration, F as OpenClawPluginHttpRouteHandler$1, Gn as RealtimeTranscriptionProviderPlugin$1, H as OpenClawPluginNodeHostCommand, I as OpenClawPluginHttpRouteMatch$1, Ii as CliBackendPlugin$1, Il as WebSearchProviderPlugin$1, Jn as TranscriptSourceProvider$1, Ki as AgentToolResultMiddleware, Kn as RealtimeVoiceProviderPlugin$1, M as OpenClawPluginGatewayRuntimeScopeSurface$1, N as OpenClawPluginHostedMediaResolver$1, O as OpenClawPluginCommandDefinition$1, Oi as CodexAppServerExtensionFactory, P as OpenClawPluginHttpRouteAuth$1, Qi as AgentToolResultMiddlewareRuntime, R as OpenClawPluginHttpRouteUpgradeHandler$1, St as PluginTextTransformRegistration$1, T as OpenClawPluginCliCommandDescriptor$1, Ti as PluginToolMetadataRegistration, W as OpenClawPluginNodeInvokePolicy, Xn as UnifiedModelCatalogProviderPlugin$1, Y as OpenClawPluginReloadRegistration$1, Z as OpenClawPluginSecurityAuditCollector$1, Zn as VideoGenerationProviderPlugin$1, a as ImageGenerationProviderPlugin$1, b as OpenClawGatewayDiscoveryService$1, ci as PluginAgentEventSubscriptionRegistration, cn as ProviderPlugin$1, fi as PluginRuntimeLifecycleRegistration, h as MigrationProviderPlugin$1, hl as OpenClawPluginToolFactory$1, ht as PluginLogger$1, li as PluginControlUiDescriptor, mi as PluginSessionActionRegistration, o as MediaUnderstandingProviderPlugin$1, po as MemoryEmbeddingProviderAdapter, qn as SpeechProviderPlugin$1, v as MusicGenerationProviderPlugin$1, xi as PluginSessionSchedulerJobRegistration, yi as PluginSessionExtensionRegistration } from "./types-BVLQjFJF.js";
import { a as PluginConversationBindingResolvedEvent$1 } from "./conversation-binding.types-BOz_kKQY.js";
import { b as CronServiceContract, h as GatewayMethodDescriptor, i as GatewayRequestHandlers } from "./types-BS4MjsWH.js";
import { t as HookEntry } from "./types-BCpQVPCb.js";
import { r as EmbeddingProviderAdapter } from "./embedding-providers-DHBi6CBi.js";
import { a as PluginActivationSource } from "./config-state-Csr49Yba.js";

//#region src/plugins/registry-types.d.ts
type ChannelPlugin = ChannelPlugin$1;
type CliBackendPlugin = CliBackendPlugin$1;
type ImageGenerationProviderPlugin = ImageGenerationProviderPlugin$1;
type MediaUnderstandingProviderPlugin = MediaUnderstandingProviderPlugin$1;
type TranscriptSourceProvider = TranscriptSourceProvider$1;
type MusicGenerationProviderPlugin = MusicGenerationProviderPlugin$1;
type OpenClawPluginCliCommandDescriptor = OpenClawPluginCliCommandDescriptor$1;
type OpenClawPluginCliRegistrar = OpenClawPluginCliRegistrar$1;
type OpenClawPluginCommandDefinition = OpenClawPluginCommandDefinition$1;
type OpenClawPluginGatewayRuntimeScopeSurface = OpenClawPluginGatewayRuntimeScopeSurface$1;
type OpenClawGatewayDiscoveryService = OpenClawGatewayDiscoveryService$1;
type OpenClawPluginHttpRouteAuth = OpenClawPluginHttpRouteAuth$1;
type OpenClawPluginHttpRouteHandler = OpenClawPluginHttpRouteHandler$1;
type OpenClawPluginHttpRouteUpgradeHandler = OpenClawPluginHttpRouteUpgradeHandler$1;
type OpenClawPluginHttpRouteMatch = OpenClawPluginHttpRouteMatch$1;
type OpenClawPluginHostedMediaResolver = OpenClawPluginHostedMediaResolver$1;
type OpenClawPluginReloadRegistration = OpenClawPluginReloadRegistration$1;
type OpenClawPluginSecurityAuditCollector = OpenClawPluginSecurityAuditCollector$1;
type OpenClawPluginService = OpenClawPluginService$1;
type OpenClawPluginToolFactory = OpenClawPluginToolFactory$1;
type PluginConversationBindingResolvedEvent = PluginConversationBindingResolvedEvent$1;
type TypedPluginHookRegistration = PluginHookRegistration$1;
type PluginLogger = PluginLogger$1;
type PluginOrigin = PluginOrigin$1;
type PluginTextTransformRegistration = PluginTextTransformRegistration$1;
type MigrationProviderPlugin = MigrationProviderPlugin$1;
type ProviderPlugin = ProviderPlugin$1;
type RealtimeTranscriptionProviderPlugin = RealtimeTranscriptionProviderPlugin$1;
type RealtimeVoiceProviderPlugin = RealtimeVoiceProviderPlugin$1;
type SpeechProviderPlugin = SpeechProviderPlugin$1;
type VideoGenerationProviderPlugin = VideoGenerationProviderPlugin$1;
type WebFetchProviderPlugin = WebFetchProviderPlugin$1;
type WebSearchProviderPlugin = WebSearchProviderPlugin$1;
type UnifiedModelCatalogProviderPlugin = UnifiedModelCatalogProviderPlugin$1;
/** Agent tool factory registered by one plugin runtime. */
type PluginToolRegistration = {
  pluginId: string;
  pluginName?: string;
  factory: OpenClawPluginToolFactory;
  names: string[];
  declaredNames?: string[];
  optional: boolean;
  source: string;
  rootDir?: string;
};
type PluginCliRegistration = {
  pluginId: string;
  pluginName?: string;
  register: OpenClawPluginCliRegistrar;
  parentPath: string[];
  commands: string[];
  descriptors: OpenClawPluginCliCommandDescriptor[];
  source: string;
  rootDir?: string;
};
/** Gateway HTTP route registered by a plugin runtime. */
type PluginHttpRouteRegistration = {
  pluginId?: string;
  path: string;
  handler: OpenClawPluginHttpRouteHandler;
  handleUpgrade?: OpenClawPluginHttpRouteUpgradeHandler;
  auth: OpenClawPluginHttpRouteAuth;
  match: OpenClawPluginHttpRouteMatch;
  gatewayRuntimeScopeSurface?: OpenClawPluginGatewayRuntimeScopeSurface;
  gatewayMethodDispatchAllowed?: boolean;
  nodeCapability?: {
    surface: string;
    ttlMs?: number;
  };
  source?: string;
};
type PluginHostedMediaResolverRegistration = {
  pluginId: string;
  pluginName?: string;
  resolver: OpenClawPluginHostedMediaResolver;
  source: string;
  rootDir?: string;
};
type PluginChannelRegistration = {
  pluginId: string;
  pluginName?: string;
  plugin: ChannelPlugin;
  source: string;
  rootDir?: string;
};
type PluginChannelSetupRegistration = {
  pluginId: string;
  pluginName?: string;
  plugin: ChannelPlugin;
  source: string;
  enabled: boolean;
  rootDir?: string;
};
type PluginProviderRegistration = {
  pluginId: string;
  pluginName?: string;
  provider: ProviderPlugin;
  source: string;
  rootDir?: string;
};
type PluginModelCatalogProviderRegistration = {
  pluginId: string;
  pluginName?: string;
  provider: UnifiedModelCatalogProviderPlugin;
  source: string;
  rootDir?: string;
};
type PluginCliBackendRegistration = {
  pluginId: string;
  pluginName?: string;
  backend: CliBackendPlugin;
  source: string;
  rootDir?: string;
};
type PluginTextTransformsRegistration = {
  pluginId: string;
  pluginName?: string;
  transforms: PluginTextTransformRegistration;
  source: string;
  rootDir?: string;
};
type PluginOwnedProviderRegistration<T extends {
  id: string;
}> = {
  pluginId: string;
  pluginName?: string;
  provider: T;
  source: string;
  rootDir?: string;
};
type PluginSpeechProviderRegistration = PluginOwnedProviderRegistration<SpeechProviderPlugin>;
type PluginEmbeddingProviderRegistration = PluginOwnedProviderRegistration<EmbeddingProviderAdapter>;
type PluginRealtimeTranscriptionProviderRegistration = PluginOwnedProviderRegistration<RealtimeTranscriptionProviderPlugin>;
type PluginRealtimeVoiceProviderRegistration = PluginOwnedProviderRegistration<RealtimeVoiceProviderPlugin>;
type PluginMediaUnderstandingProviderRegistration = PluginOwnedProviderRegistration<MediaUnderstandingProviderPlugin>;
type PluginTranscriptsSourceProviderRegistration = PluginOwnedProviderRegistration<TranscriptSourceProvider>;
type PluginImageGenerationProviderRegistration = PluginOwnedProviderRegistration<ImageGenerationProviderPlugin>;
type PluginVideoGenerationProviderRegistration = PluginOwnedProviderRegistration<VideoGenerationProviderPlugin>;
type PluginMusicGenerationProviderRegistration = PluginOwnedProviderRegistration<MusicGenerationProviderPlugin>;
type PluginWebFetchProviderRegistration = PluginOwnedProviderRegistration<WebFetchProviderPlugin>;
type PluginWebSearchProviderRegistration = PluginOwnedProviderRegistration<WebSearchProviderPlugin>;
type PluginMigrationProviderRegistration = PluginOwnedProviderRegistration<MigrationProviderPlugin>;
type PluginMemoryEmbeddingProviderRegistration = PluginOwnedProviderRegistration<MemoryEmbeddingProviderAdapter>;
type PluginCodexAppServerExtensionFactoryRegistration = {
  pluginId: string;
  pluginName?: string;
  rawFactory: CodexAppServerExtensionFactory;
  factory: CodexAppServerExtensionFactory;
  source: string;
  rootDir?: string;
};
type PluginAgentToolResultMiddlewareRegistration = {
  pluginId: string;
  pluginName?: string;
  rawHandler: AgentToolResultMiddleware;
  handler: AgentToolResultMiddleware;
  runtimes: AgentToolResultMiddlewareRuntime[];
  source: string;
  rootDir?: string;
};
type PluginAgentHarnessRegistration = {
  pluginId: string;
  pluginName?: string;
  harness: AgentHarness;
  source: string;
  rootDir?: string;
};
type PluginHookRegistration = {
  pluginId: string;
  entry: HookEntry;
  events: string[];
  source: string;
  rootDir?: string;
};
type PluginServiceRegistration = {
  pluginId: string;
  pluginName?: string;
  service: OpenClawPluginService;
  source: string;
  origin: PluginOrigin;
  trustedOfficialInstall?: boolean;
  rootDir?: string;
};
type PluginGatewayDiscoveryServiceRegistration = {
  pluginId: string;
  pluginName?: string;
  service: OpenClawGatewayDiscoveryService;
  source: string;
  rootDir?: string;
};
type PluginReloadRegistration = {
  pluginId: string;
  pluginName?: string;
  registration: OpenClawPluginReloadRegistration;
  source: string;
  rootDir?: string;
};
type PluginNodeHostCommandRegistration = {
  pluginId: string;
  pluginName?: string;
  command: OpenClawPluginNodeHostCommand;
  source: string;
  rootDir?: string;
};
type PluginNodeInvokePolicyRegistration = {
  pluginId: string;
  pluginName?: string;
  policy: OpenClawPluginNodeInvokePolicy;
  pluginConfig?: Record<string, unknown>;
  source: string;
  rootDir?: string;
};
type PluginSecurityAuditCollectorRegistration = {
  pluginId: string;
  pluginName?: string;
  collector: OpenClawPluginSecurityAuditCollector;
  source: string;
  rootDir?: string;
};
type PluginCommandRegistration = {
  pluginId: string;
  pluginName?: string;
  command: OpenClawPluginCommandDefinition;
  source: string;
  rootDir?: string;
};
type PluginSessionExtensionRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  extension: PluginSessionExtensionRegistration;
  source: string;
  rootDir?: string;
};
type PluginTrustedToolPolicyRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  policy: PluginTrustedToolPolicyRegistration;
  origin?: PluginRecord["origin"];
  source: string;
  rootDir?: string;
};
type PluginToolMetadataRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  metadata: PluginToolMetadataRegistration;
  source: string;
  rootDir?: string;
};
type PluginControlUiDescriptorRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  descriptor: PluginControlUiDescriptor;
  source: string;
  rootDir?: string;
};
type PluginRuntimeLifecycleRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  lifecycle: PluginRuntimeLifecycleRegistration;
  source: string;
  rootDir?: string;
};
type PluginAgentEventSubscriptionRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  subscription: PluginAgentEventSubscriptionRegistration;
  source: string;
  rootDir?: string;
};
type PluginSessionSchedulerJobRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  job: PluginSessionSchedulerJobRegistration;
  generation?: number;
  source: string;
  rootDir?: string;
};
type PluginSessionActionRegistryRegistration = {
  pluginId: string;
  pluginName?: string;
  action: PluginSessionActionRegistration;
  source: string;
  rootDir?: string;
};
type PluginConversationBindingResolvedHandlerRegistration = {
  pluginId: string;
  pluginName?: string;
  pluginRoot?: string;
  handler: (event: PluginConversationBindingResolvedEvent) => void | Promise<void>;
  source: string;
  rootDir?: string;
};
type PluginRecord = {
  id: string;
  name: string;
  version?: string;
  packageName?: string;
  description?: string;
  format?: PluginFormat;
  bundleFormat?: PluginBundleFormat;
  bundleCapabilities?: string[];
  kind?: PluginKind | PluginKind[];
  source: string;
  rootDir?: string;
  origin: PluginOrigin;
  workspaceDir?: string;
  trustedOfficialInstall?: boolean;
  enabled: boolean;
  explicitlyEnabled?: boolean;
  activated?: boolean;
  imported?: boolean;
  compat?: readonly PluginCompatCode[];
  activationSource?: PluginActivationSource;
  activationReason?: string;
  status: "loaded" | "disabled" | "error";
  error?: string;
  failedAt?: Date;
  failurePhase?: "validation" | "load" | "register";
  toolNames: string[];
  hookNames: string[];
  channelIds: string[];
  cliBackendIds: string[];
  providerIds: string[];
  syntheticAuthRefs?: string[];
  embeddingProviderIds: string[];
  speechProviderIds: string[];
  realtimeTranscriptionProviderIds: string[];
  realtimeVoiceProviderIds: string[];
  mediaUnderstandingProviderIds: string[];
  transcriptSourceProviderIds: string[];
  imageGenerationProviderIds: string[];
  videoGenerationProviderIds: string[];
  musicGenerationProviderIds: string[];
  webFetchProviderIds: string[];
  webSearchProviderIds: string[];
  migrationProviderIds: string[];
  contextEngineIds?: string[];
  memoryEmbeddingProviderIds: string[];
  agentHarnessIds: string[];
  cliCommands: string[];
  services: string[];
  gatewayDiscoveryServiceIds: string[];
  commands: string[];
  httpRoutes: number;
  hookCount: number;
  configSchema: boolean;
  configUiHints?: Record<string, PluginConfigUiHint>;
  configJsonSchema?: JsonSchemaObject;
  contracts?: PluginManifestContracts;
  memorySlotSelected?: boolean;
  dependencyStatus?: PluginDependencyStatus;
};
type PluginRegistry = {
  plugins: PluginRecord[];
  tools: PluginToolRegistration[];
  hooks: PluginHookRegistration[];
  typedHooks: TypedPluginHookRegistration[];
  channels: PluginChannelRegistration[];
  channelSetups: PluginChannelSetupRegistration[];
  providers: PluginProviderRegistration[];
  modelCatalogProviders: PluginModelCatalogProviderRegistration[];
  cliBackends?: PluginCliBackendRegistration[];
  textTransforms: PluginTextTransformsRegistration[];
  embeddingProviders: PluginEmbeddingProviderRegistration[];
  speechProviders: PluginSpeechProviderRegistration[];
  realtimeTranscriptionProviders: PluginRealtimeTranscriptionProviderRegistration[];
  realtimeVoiceProviders: PluginRealtimeVoiceProviderRegistration[];
  mediaUnderstandingProviders: PluginMediaUnderstandingProviderRegistration[];
  transcriptSourceProviders: PluginTranscriptsSourceProviderRegistration[];
  imageGenerationProviders: PluginImageGenerationProviderRegistration[];
  videoGenerationProviders: PluginVideoGenerationProviderRegistration[];
  musicGenerationProviders: PluginMusicGenerationProviderRegistration[];
  webFetchProviders: PluginWebFetchProviderRegistration[];
  webSearchProviders: PluginWebSearchProviderRegistration[];
  migrationProviders: PluginMigrationProviderRegistration[];
  codexAppServerExtensionFactories: PluginCodexAppServerExtensionFactoryRegistration[];
  agentToolResultMiddlewares: PluginAgentToolResultMiddlewareRegistration[];
  memoryEmbeddingProviders: PluginMemoryEmbeddingProviderRegistration[];
  agentHarnesses: PluginAgentHarnessRegistration[];
  gatewayHandlers: GatewayRequestHandlers;
  gatewayMethodDescriptors: GatewayMethodDescriptor[];
  coreGatewayMethodNames?: string[];
  httpRoutes: PluginHttpRouteRegistration[];
  hostedMediaResolvers?: PluginHostedMediaResolverRegistration[];
  cliRegistrars: PluginCliRegistration[];
  reloads?: PluginReloadRegistration[];
  nodeHostCommands?: PluginNodeHostCommandRegistration[];
  nodeInvokePolicies?: PluginNodeInvokePolicyRegistration[];
  securityAuditCollectors?: PluginSecurityAuditCollectorRegistration[];
  services: PluginServiceRegistration[];
  gatewayDiscoveryServices: PluginGatewayDiscoveryServiceRegistration[];
  commands: PluginCommandRegistration[];
  sessionExtensions?: PluginSessionExtensionRegistryRegistration[];
  trustedToolPolicies?: PluginTrustedToolPolicyRegistryRegistration[];
  toolMetadata?: PluginToolMetadataRegistryRegistration[];
  controlUiDescriptors?: PluginControlUiDescriptorRegistryRegistration[];
  runtimeLifecycles?: PluginRuntimeLifecycleRegistryRegistration[];
  agentEventSubscriptions?: PluginAgentEventSubscriptionRegistryRegistration[];
  sessionSchedulerJobs?: PluginSessionSchedulerJobRegistryRegistration[];
  sessionActions?: PluginSessionActionRegistryRegistration[];
  conversationBindingResolvedHandlers: PluginConversationBindingResolvedHandlerRegistration[];
  diagnostics: PluginDiagnostic[];
};
type PluginRegistryParams = {
  logger: PluginLogger;
  coreGatewayHandlers?: GatewayRequestHandlers;
  coreGatewayMethodNames?: readonly string[];
  runtime: PluginRuntime;
  hostServices?: {
    /** May be a live accessor; plugin APIs must read it at call time. */cron?: CronServiceContract;
  };
  activateGlobalSideEffects?: boolean;
};
//#endregion
export { PluginRegistry as n, PluginRegistryParams as r, PluginHttpRouteRegistration as t };