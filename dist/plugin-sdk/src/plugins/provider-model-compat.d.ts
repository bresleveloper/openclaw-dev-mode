import type { ModelCompatConfig } from "../config/types.models.js";
import type { Model } from "../llm/types.js";
export declare function extractModelCompat(modelOrCompat: {
    compat?: unknown;
} | ModelCompatConfig | undefined): ModelCompatConfig | undefined;
/** @deprecated Provider-owned model compat helper; do not use from third-party plugins. */
export declare function applyModelCompatPatch<T extends {
    compat?: ModelCompatConfig;
}>(model: T, patch: Partial<ModelCompatConfig> & Record<string, unknown>): T;
export declare function hasToolSchemaProfile(modelOrCompat: {
    compat?: unknown;
} | ModelCompatConfig | undefined, profile: string): boolean;
export declare function hasNativeWebSearchTool(modelOrCompat: {
    compat?: unknown;
} | ModelCompatConfig | undefined): boolean;
export declare function resolveToolCallArgumentsEncoding(modelOrCompat: {
    compat?: unknown;
} | ModelCompatConfig | undefined): ModelCompatConfig["toolCallArgumentsEncoding"] | undefined;
export declare function resolveUnsupportedToolSchemaKeywords(modelOrCompat: {
    compat?: unknown;
} | ModelCompatConfig | undefined): ReadonlySet<string>;
export declare function shouldOmitEmptyArrayItems(modelOrCompat: {
    compat?: unknown;
} | ModelCompatConfig | undefined): boolean;
export declare function normalizeModelCompat(model: Model): Model;
