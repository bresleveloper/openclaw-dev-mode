/**
 * Core plugin SDK contract-test fixture builders and registration helpers.
 */
import type { PluginRegistryParams } from "../../plugins/registry-types.js";
import type { OpenClawPluginApi } from "../plugin-entry.js";
import { createPluginRegistry, registerProviderPlugins as registerProviders, requireRegisteredProvider as requireProvider, type OpenClawConfig, type PluginRecord } from "../testing.js";
export { assertNoImportTimeSideEffects } from "./import-side-effects.js";
import { uniqueSortedStrings } from "./string-utils.js";
export { registerProviders, requireProvider, uniqueSortedStrings };
/** Creates a minimal plugin registry fixture with quiet logger defaults. */
export declare function createPluginRegistryFixture(config?: OpenClawConfig, params?: {
    hostServices?: PluginRegistryParams["hostServices"];
}): {
    config: OpenClawConfig;
    registry: {
        registry: import("../../plugins/registry-types.js").PluginRegistry;
        createApi: (record: PluginRecord, params: {
            config: import("../acpx.ts").OpenClawPluginApi["config"];
            pluginConfig?: Record<string, unknown>;
            hookPolicy?: {
                allowPromptInjection?: boolean;
                allowConversationAccess?: boolean;
                timeoutMs?: number;
                timeouts?: Record<string, number>;
            };
            registrationMode?: import("../plugin-runtime.ts").PluginRegistrationMode;
        }) => import("../acpx.ts").OpenClawPluginApi;
        rollbackPluginGlobalSideEffects: (pluginId: string) => void;
        pushDiagnostic: (diag: import("../plugin-runtime.ts").PluginDiagnostic) => void;
        registerTool: (record: PluginRecord, tool: import("../agent-harness-runtime.ts").AnyAgentTool | import("../core.ts").OpenClawPluginToolFactory, opts?: {
            name?: string;
            names?: string[];
            optional?: boolean;
        }) => void;
        registerChannel: (record: PluginRecord, registration: import("../plugin-runtime.ts").OpenClawPluginChannelRegistration | import("../core.ts").ChannelPlugin, mode?: import("../plugin-runtime.ts").PluginRegistrationMode) => void;
        registerHostedMediaResolver: (record: PluginRecord, resolver: import("../plugin-runtime.ts").OpenClawPluginHostedMediaResolver) => void;
        registerProvider: (record: PluginRecord, provider: import("./provider-catalog.ts").ProviderPlugin) => void;
        registerModelCatalogProvider: (record: PluginRecord, provider: import("../provider-model-shared.ts").UnifiedModelCatalogProviderPlugin) => void;
        registerAgentHarness: (record: PluginRecord, harness: import("../agent-harness-runtime.ts").AgentHarness) => void;
        registerCliBackend: (record: PluginRecord, backend: import("../cli-backend.ts").CliBackendPlugin) => void;
        registerTextTransforms: (record: PluginRecord, transforms: import("../../plugins/registry-types.js").PluginTextTransformsRegistration["transforms"]) => void;
        registerEmbeddingProvider: (record: PluginRecord, adapter: import("../embedding-providers.ts").EmbeddingProviderAdapter) => void;
        registerSpeechProvider: (record: PluginRecord, provider: import("@openclaw/speech-core/api").SpeechProviderPlugin) => void;
        registerRealtimeTranscriptionProvider: (record: PluginRecord, provider: import("../index.ts").RealtimeTranscriptionProviderPlugin) => void;
        registerRealtimeVoiceProvider: (record: PluginRecord, provider: import("../plugin-runtime.ts").RealtimeVoiceProviderPlugin) => void;
        registerMediaUnderstandingProvider: (record: PluginRecord, provider: import("../index.ts").MediaUnderstandingProviderPlugin) => void;
        registerTranscriptSourceProvider: (record: PluginRecord, provider: import("../plugin-runtime.ts").TranscriptSourceProvider) => void;
        registerImageGenerationProvider: (record: PluginRecord, provider: import("../image-generation-core.ts").ImageGenerationProviderPlugin) => void;
        registerVideoGenerationProvider: (record: PluginRecord, provider: import("../plugin-runtime.ts").VideoGenerationProviderPlugin) => void;
        registerMusicGenerationProvider: (record: PluginRecord, provider: import("../music-generation-core.ts").MusicGenerationProviderPlugin) => void;
        registerWebSearchProvider: (record: PluginRecord, provider: import("../plugin-runtime.ts").WebSearchProviderPlugin) => void;
        registerMigrationProvider: (record: PluginRecord, provider: import("../migration.ts").MigrationProviderPlugin) => void;
        registerGatewayMethod: (record: PluginRecord, method: string, handler: import("../../gateway/server-methods/shared-types.ts").GatewayRequestHandler, opts?: {
            scope?: import("../../gateway/operator-scopes.ts").OperatorScope;
        }) => void;
        registerCli: (record: PluginRecord, registrar: import("../plugin-runtime.ts").OpenClawPluginCliRegistrar, opts?: {
            parentPath?: string[];
            commands?: string[];
            descriptors?: import("../plugin-runtime.ts").OpenClawPluginCliCommandDescriptor[];
        }) => void;
        registerReload: (record: PluginRecord, registration: import("../plugin-runtime.ts").OpenClawPluginReloadRegistration) => void;
        registerNodeHostCommand: (record: PluginRecord, nodeCommand: import("../plugin-runtime.ts").OpenClawPluginNodeHostCommand) => void;
        registerSecurityAuditCollector: (record: PluginRecord, collector: import("../plugin-runtime.ts").OpenClawPluginSecurityAuditCollector) => void;
        registerService: (record: PluginRecord, service: import("../acpx.ts").OpenClawPluginService) => void;
        registerCommand: (record: PluginRecord, command: import("../phone-control.ts").OpenClawPluginCommandDefinition) => void;
        registerSessionExtension: (record: PluginRecord, extension: import("../plugin-runtime.ts").PluginSessionExtensionRegistration) => void;
        registerTrustedToolPolicy: (record: PluginRecord, policy: import("../plugin-runtime.ts").PluginTrustedToolPolicyRegistration) => void;
        registerToolMetadata: (record: PluginRecord, metadata: import("../plugin-runtime.ts").PluginToolMetadataRegistration) => void;
        registerControlUiDescriptor: (record: PluginRecord, descriptor: import("../plugin-runtime.ts").PluginControlUiDescriptor) => void;
        registerRuntimeLifecycle: (record: PluginRecord, lifecycle: import("../plugin-runtime.ts").PluginRuntimeLifecycleRegistration) => void;
        registerAgentEventSubscription: (record: PluginRecord, subscription: import("../plugin-runtime.ts").PluginAgentEventSubscriptionRegistration) => void;
        registerSessionSchedulerJob: (record: PluginRecord, job: import("../plugin-runtime.ts").PluginSessionSchedulerJobRegistration) => import("../plugin-runtime.ts").PluginSessionSchedulerJobHandle | undefined;
        registerSessionAction: (record: PluginRecord, action: import("../plugin-runtime.ts").PluginSessionActionRegistration) => void;
        registerHook: (record: PluginRecord, events: string | string[], handler: Parameters<typeof import("../hook-runtime.ts").registerInternalHook>[1], opts: import("../plugin-runtime.ts").OpenClawPluginHookOptions | undefined, config: import("../acpx.ts").OpenClawPluginApi["config"], pluginConfig: unknown) => void;
        registerTypedHook: <K extends import("../plugin-runtime.ts").PluginHookName>(record: PluginRecord, hookName: K, handler: import("../plugin-runtime.ts").PluginHookHandlerMap[K], opts?: {
            priority?: number;
            timeoutMs?: number;
        }, policy?: {
            allowPromptInjection?: boolean;
            allowConversationAccess?: boolean;
            timeoutMs?: number;
            timeouts?: Record<string, number>;
        }) => void;
    };
};
/** Registers one plugin record against a registry fixture and invokes its register hook. */
export declare function registerTestPlugin(params: {
    registry: ReturnType<typeof createPluginRegistry>;
    config: OpenClawConfig;
    record: PluginRecord;
    register(api: OpenClawPluginApi): void;
}): void;
/** Registers a virtual plugin record for tests that do not need a real package path. */
export declare function registerVirtualTestPlugin(params: {
    registry: ReturnType<typeof createPluginRegistry>;
    config: OpenClawConfig;
    id: string;
    name: string;
    source?: string;
    kind?: PluginRecord["kind"];
    contracts?: PluginRecord["contracts"];
    register(this: void, api: OpenClawPluginApi): void;
}): void;
