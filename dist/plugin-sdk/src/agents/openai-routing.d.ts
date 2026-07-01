import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Canonical provider id for OpenAI-hosted model routes. */
export declare const OPENAI_PROVIDER_ID = "openai";
export declare const OPENAI_CODEX_PROVIDER_ID = "openai";
/** Returns true for provider ids that normalize to OpenAI. */
export declare function isOpenAIProvider(provider: string | undefined): boolean;
/** Returns whether OpenAI should use the Codex runtime default for this config. */
export declare function openAIProviderUsesCodexRuntimeByDefault(params: {
    provider?: string;
    config?: OpenClawConfig;
}): boolean;
/** Parses the provider portion from a provider/model ref. */
export declare function parseModelRefProvider(value: unknown): string | undefined;
/** Returns true when selected model config should ensure the Codex plugin exists. */
export declare function modelSelectionShouldEnsureCodexPlugin(params: {
    model?: string;
    config?: OpenClawConfig;
}): boolean;
/** Lists auth-profile providers for an OpenAI runtime route. */
export declare function listOpenAIAuthProfileProvidersForAgentRuntime(params: {
    provider: string;
    harnessRuntime?: string;
    agentHarnessId?: string;
    config?: OpenClawConfig;
}): string[];
/** Resolves the provider id passed to OpenAI runtime auth/execution paths. */
export declare function resolveOpenAIRuntimeProvider(params: {
    provider: string;
    harnessRuntime?: string;
    agentHarnessId?: string;
    authProfileProvider?: string;
    authProfileId?: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
}): string;
/** Resolves the selected provider id displayed for OpenAI runtime routes. */
export declare function resolveSelectedOpenAIRuntimeProvider(params: {
    provider: string;
    harnessRuntime?: string;
    agentHarnessId?: string;
    authProfileProvider?: string;
    authProfileId?: string;
    config?: OpenClawConfig;
    workspaceDir?: string;
}): string;
/** Resolves the config provider used for context-window lookup. */
export declare function resolveContextConfigProviderForRuntime(params: {
    provider: string;
    runtimeId?: string;
    config?: OpenClawConfig;
}): string;
