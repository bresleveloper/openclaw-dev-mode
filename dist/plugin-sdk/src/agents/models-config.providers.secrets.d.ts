import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { AuthProfileStore } from "./auth-profiles/types.js";
import { type ProviderApiKeyResolver, type ProviderAuthResolver } from "./models-config.providers.secret-helpers.js";
export type { ProviderApiKeyResolver, ProviderAuthResolver, ProviderConfig, SecretDefaults, } from "./models-config.providers.secret-helpers.js";
export { normalizeApiKeyConfig, resolveMissingProviderApiKey, } from "./models-config.providers.secret-helpers.js";
type AuthProfileStoreInput = AuthProfileStore | (() => AuthProfileStore);
/** Create a resolver that returns redacted API-key markers for provider discovery. */
export declare function createProviderApiKeyResolver(env: NodeJS.ProcessEnv, authStoreInput: AuthProfileStoreInput, config?: OpenClawConfig): ProviderApiKeyResolver;
/** Create a resolver that reports provider auth mode and provenance. */
export declare function createProviderAuthResolver(env: NodeJS.ProcessEnv, authStoreInput: AuthProfileStoreInput, config?: OpenClawConfig): ProviderAuthResolver;
