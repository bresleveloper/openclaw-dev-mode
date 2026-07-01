/**
 * Public SDK facade for Anthropic Vertex implicit provider discovery and config helpers.
 */
import type { ModelProviderConfig } from "../config/types.js";
type FacadeModule = {
    resolveAnthropicVertexClientRegion: (params?: {
        baseUrl?: string;
        env?: NodeJS.ProcessEnv;
    }) => string;
    resolveAnthropicVertexProjectId: (env?: NodeJS.ProcessEnv) => string | undefined;
    buildAnthropicVertexProvider: (params?: {
        env?: NodeJS.ProcessEnv;
    }) => ModelProviderConfig;
    resolveImplicitAnthropicVertexProvider: (params?: {
        env?: NodeJS.ProcessEnv;
    }) => ModelProviderConfig | null;
    mergeImplicitAnthropicVertexProvider: (params: {
        existing?: ModelProviderConfig;
        implicit: ModelProviderConfig;
    }) => ModelProviderConfig;
};
/** Resolves the Anthropic Vertex region through the activated bundled provider facade. */
export declare const resolveAnthropicVertexClientRegion: FacadeModule["resolveAnthropicVertexClientRegion"];
/** Resolves the Anthropic Vertex project id through the activated provider facade. */
export declare const resolveAnthropicVertexProjectId: FacadeModule["resolveAnthropicVertexProjectId"];
export {};
