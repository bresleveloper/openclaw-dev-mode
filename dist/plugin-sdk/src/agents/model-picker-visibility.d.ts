import type { OpenClawConfig } from "../config/types.openclaw.js";
/** True for retired provider ids that should stay out of model selection surfaces. */
export declare function isRetiredModelPickerProvider(provider: string): boolean;
/** Creates a provider visibility predicate for model picker rendering. */
export declare function createModelPickerVisibleProviderPredicate(params?: {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    includeSetupRegistry?: boolean;
}): (provider: string) => boolean;
