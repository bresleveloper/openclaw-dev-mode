import type { ProviderRuntimeModel } from "./provider-runtime-model.types.js";
import type { ProviderResolveDynamicModelContext } from "./types.js";
/** True when an id matches a normalized exact value or value prefix. */
export declare function matchesExactOrPrefix(id: string, values: readonly string[]): boolean;
/** Clones the first available template model and patches it for a dynamic model id. */
export declare function cloneFirstTemplateModel(params: {
    providerId: string;
    modelId: string;
    templateIds: readonly string[];
    ctx: ProviderResolveDynamicModelContext;
    patch?: Partial<ProviderRuntimeModel>;
}): ProviderRuntimeModel | undefined;
