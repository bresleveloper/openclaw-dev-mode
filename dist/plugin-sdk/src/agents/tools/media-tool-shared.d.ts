import type { AgentModelConfig } from "../../config/types.agents-shared.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SsrFPolicy } from "../../infra/net/ssrf.js";
import type { Model } from "../../llm/types.js";
import type { AuthProfileStore } from "../auth-profiles/types.js";
import type { ImageModelConfig } from "./image-tool.helpers.js";
import { type ToolModelConfig } from "./model-config.helpers.js";
type TextToolAttempt = {
    provider: string;
    model: string;
    error: string;
};
type TextToolResult = {
    text: string;
    provider: string;
    model: string;
    attempts: TextToolAttempt[];
};
type GenerationModelRef = {
    provider: string;
    model: string;
};
type ParseGenerationModelRef = (raw: string | undefined) => GenerationModelRef | null;
type MediaReferenceDetailEntry = {
    rewrittenFrom?: string;
};
type TaskRunDetailHandle = {
    taskId: string;
    runId: string;
};
export declare const REMOTE_MEDIA_READ_IDLE_TIMEOUT_MS = 120000;
/**
 * Applies an image-editing model as the agent default without mutating the loaded config.
 */
export declare function applyImageModelConfigDefaults(cfg: OpenClawConfig | undefined, imageModelConfig: ImageModelConfig): OpenClawConfig | undefined;
/**
 * Applies an image-generation model as the agent default for downstream tool calls.
 */
export declare function applyImageGenerationModelConfigDefaults(cfg: OpenClawConfig | undefined, imageGenerationModelConfig: ToolModelConfig): OpenClawConfig | undefined;
/**
 * Applies a video-generation model as the agent default for downstream tool calls.
 */
export declare function applyVideoGenerationModelConfigDefaults(cfg: OpenClawConfig | undefined, videoGenerationModelConfig: ToolModelConfig): OpenClawConfig | undefined;
/**
 * Applies a music-generation model as the agent default for downstream tool calls.
 */
export declare function applyMusicGenerationModelConfigDefaults(cfg: OpenClawConfig | undefined, musicGenerationModelConfig: ToolModelConfig): OpenClawConfig | undefined;
/**
 * Reads an optional generation timeout while preserving common tool parameter validation.
 */
export declare function readGenerationTimeoutMs(args: Record<string, unknown>): number | undefined;
/**
 * Resolves the shared remote-media SSRF policy used by media tools that fetch URLs.
 */
export declare function resolveRemoteMediaSsrfPolicy(cfg: OpenClawConfig | undefined): SsrFPolicy | undefined;
type CapabilityProvider = {
    id: string;
    aliases?: string[];
    defaultModel?: string;
    models?: readonly string[];
    isConfigured?: (ctx: {
        cfg?: OpenClawConfig;
        agentDir?: string;
    }) => boolean;
};
type CapabilityProviderSource = CapabilityProvider[] | (() => CapabilityProvider[]);
type GenerationCapabilityProviderKey = "imageGenerationProviders" | "videoGenerationProviders" | "musicGenerationProviders";
/**
 * Checks whether a generation provider is usable from either its custom readiness hook or
 * the generic tool auth profile/config lookup.
 */
export declare function isCapabilityProviderConfigured<T extends CapabilityProvider>(params: {
    providers: T[];
    provider?: T;
    providerId?: string;
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    agentDir?: string;
    authStore?: AuthProfileStore;
}): boolean;
/**
 * Resolves the provider implied by a model override or configured primary model.
 */
export declare function resolveSelectedCapabilityProvider<T extends CapabilityProvider>(params: {
    providers: T[];
    modelConfig: ToolModelConfig;
    modelOverride?: string;
    parseModelRef: ParseGenerationModelRef;
}): T | undefined;
/**
 * Builds the model config for a generation tool from explicit config first, then configured
 * provider defaults ordered around the agent's primary provider.
 */
export declare function resolveCapabilityModelConfigForTool(params: {
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    agentDir?: string;
    authStore?: AuthProfileStore;
    modelConfig?: AgentModelConfig;
    providers: CapabilityProviderSource;
}): ToolModelConfig | null;
/**
 * Reports whether a generation tool should be offered for the current config and auth state.
 */
export declare function hasGenerationToolAvailability(params: {
    cfg?: OpenClawConfig;
    agentDir?: string;
    workspaceDir?: string;
    authStore?: AuthProfileStore;
    modelConfig?: AgentModelConfig;
    providers?: CapabilityProvider[] | (() => CapabilityProvider[]);
    providerKey: GenerationCapabilityProviderKey;
}): boolean;
/**
 * Reads a constrained generation action and raises a tool-input error for invalid values.
 */
export declare function resolveGenerateAction<TAction extends string>(params: {
    args: Record<string, unknown>;
    allowed: readonly TAction[];
    defaultAction: TAction;
}): TAction;
/**
 * Reads boolean tool parameters from either canonical or snake_case keys.
 */
export declare function readBooleanToolParam(params: Record<string, unknown>, key: string): boolean | undefined;
/**
 * Normalizes singular/plural media reference parameters into a deduped, bounded list.
 */
export declare function normalizeMediaReferenceInputs(params: {
    args: Record<string, unknown>;
    singularKey: string;
    pluralKey: string;
    maxCount: number;
    label: string;
}): string[];
/**
 * Builds result detail fields for one or many rewritten media references.
 */
export declare function buildMediaReferenceDetails<T extends MediaReferenceDetailEntry>(params: {
    entries: readonly T[];
    singleKey: string;
    pluralKey: string;
    getResolvedInput: (entry: T) => string | undefined;
    singleRewriteKey?: string;
}): Record<string, unknown>;
/**
 * Adds task/run provenance details when an async media generation handle is present.
 */
export declare function buildTaskRunDetails(handle: TaskRunDetailHandle | null | undefined): Record<string, unknown>;
/**
 * Resolves host-local read roots for tools that accept filesystem media references.
 */
export declare function resolveMediaToolLocalRoots(workspaceDirRaw: string | undefined, options?: {
    workspaceOnly?: boolean;
    cfg?: OpenClawConfig;
    channelId?: string | null;
    accountId?: string | null;
}, _mediaSources?: readonly string[]): string[];
/**
 * Resolves channel-scoped inbound attachment roots separately from host-local roots.
 */
export declare function resolveMediaToolInboundRoots(options?: {
    workspaceOnly?: boolean;
    cfg?: OpenClawConfig;
    channelId?: string | null;
    accountId?: string | null;
}): string[];
/**
 * Resolves the effective prompt and optional model override from common media tool args.
 */
export declare function resolvePromptAndModelOverride(args: Record<string, unknown>, defaultPrompt: string): {
    prompt: string;
    modelOverride?: string;
};
/**
 * Wraps a generated text result in the common tool result shape with model attempt details.
 */
export declare function buildTextToolResult(result: TextToolResult, extraDetails: Record<string, unknown>): {
    content: Array<{
        type: "text";
        text: string;
    }>;
    details: Record<string, unknown>;
};
/**
 * Resolves a catalog model while supporting registries that index model ids with provider prefixes.
 */
export declare function resolveModelFromRegistry(params: {
    modelRegistry: {
        find: (provider: string, modelId: string) => unknown;
    };
    provider: string;
    modelId: string;
}): Model;
/**
 * Loads the runtime API key for a resolved model and caches it in per-run auth storage.
 */
export declare function resolveModelRuntimeApiKey(params: {
    model: Model;
    cfg: OpenClawConfig | undefined;
    agentDir: string;
    authStorage: {
        setRuntimeApiKey: (provider: string, apiKey: string) => void;
    };
}): Promise<string>;
export {};
