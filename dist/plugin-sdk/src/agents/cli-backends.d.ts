import type { CliBackendConfig } from "../config/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ContextEngineHostCapability } from "../context-engine/types.js";
import { resolveRuntimeCliBackends } from "../plugins/cli-backends.runtime.js";
import { resolvePluginSetupCliBackend, resolvePluginSetupRegistry } from "../plugins/setup-registry.js";
import type { CliBackendAuthEpochMode, CliBundleMcpMode, CliBackendPlugin, CliBackendNativeToolMode, CliBackendSideQuestionToolMode, PluginTextTransforms } from "../plugins/types.js";
type CliBackendsDeps = {
    resolvePluginSetupCliBackend: typeof resolvePluginSetupCliBackend;
    resolvePluginSetupRegistry: typeof resolvePluginSetupRegistry;
    resolveRuntimeCliBackends: typeof resolveRuntimeCliBackends;
};
/** Fully merged CLI backend definition used by agent runner execution. */
export type ResolvedCliBackend = {
    id: string;
    modelProvider?: string;
    config: CliBackendConfig;
    bundleMcp: boolean;
    bundleMcpMode?: CliBundleMcpMode;
    pluginId?: string;
    transformSystemPrompt?: CliBackendPlugin["transformSystemPrompt"];
    textTransforms?: PluginTextTransforms;
    defaultAuthProfileId?: string;
    authEpochMode?: CliBackendAuthEpochMode;
    contextEngineHostCapabilities?: readonly ContextEngineHostCapability[];
    ownsNativeCompaction?: boolean;
    prepareExecution?: CliBackendPlugin["prepareExecution"];
    resolveExecutionArgs?: CliBackendPlugin["resolveExecutionArgs"];
    nativeToolMode?: CliBackendNativeToolMode;
    sideQuestionToolMode?: CliBackendSideQuestionToolMode;
};
type ResolvedCliBackendLiveTest = {
    defaultModelRef?: string;
    defaultImageProbe: boolean;
    defaultMcpProbe: boolean;
    dockerNpmPackage?: string;
    dockerBinaryName?: string;
};
/** Binding between a model provider and the CLI runtime that serves it. */
export type CliRuntimeModelBackendBinding = {
    provider: string;
    runtime: string;
    pluginId?: string;
};
/** Lists model-provider to CLI-runtime bindings from runtime and optional setup registries. */
export declare function listCliRuntimeModelBackendBindings(params?: {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    includeSetupRegistry?: boolean;
}): CliRuntimeModelBackendBinding[];
/** Lists CLI runtime ids that alias canonical model providers. */
export declare function listCliRuntimeProviderIds(params?: {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    includeSetupRegistry?: boolean;
}): string[];
/** Resolves the canonical model provider served by a CLI runtime id. */
export declare function resolveCliRuntimeCanonicalProvider(params: {
    runtime: string | undefined;
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    includeSetupRegistry?: boolean;
}): string | undefined;
/** Resolves the binding for one provider/runtime pair when registered. */
export declare function resolveCliRuntimeModelBackendBinding(params: {
    provider: string | undefined;
    runtime: string | undefined;
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): CliRuntimeModelBackendBinding | undefined;
/** Checks whether a runtime is registered to serve a model provider. */
export declare function isCliRuntimeModelBackendForProvider(params: {
    provider: string | undefined;
    runtime: string | undefined;
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): boolean;
/** Resolves live-test defaults advertised by a CLI backend plugin. */
export declare function resolveCliBackendLiveTest(provider: string): ResolvedCliBackendLiveTest | null;
/** Resolves the executable CLI backend config after plugin defaults and user overrides. */
export declare function resolveCliBackendConfig(provider: string, cfg?: OpenClawConfig, options?: {
    agentId?: string;
}): ResolvedCliBackend | null;
/** Test-only dependency controls for CLI backend registry resolution. */
export declare const testing: {
    readonly resetDepsForTest: () => void;
    readonly setDepsForTest: (deps: Partial<CliBackendsDeps>) => void;
};
export { testing as __testing };
