import { n as ApiRegistry } from "./api-registry-C2T3lTV7.mjs";
import { n as clampOpenAIPromptCacheKey, t as OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH } from "./openai-prompt-cache-C4RHdN4n.mjs";
//#region packages/ai/src/providers/register-builtins.d.ts
/** Source id used for built-in API provider registrations. */
export declare const BUILT_IN_API_PROVIDER_SOURCE_ID = "core:built-in";
/** Registers every built-in API provider in one runtime registry. */
export declare function registerBuiltInApiProviders(registry: ApiRegistry): void;
/** Restores the built-in provider registry state for tests. */
export declare function resetApiProviders(registry: ApiRegistry): void;
//#endregion
export { OPENAI_PROMPT_CACHE_KEY_MAX_LENGTH, clampOpenAIPromptCacheKey };