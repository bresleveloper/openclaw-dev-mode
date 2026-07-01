import { requireApiKey } from "../../../../src/agents/model-auth-runtime-shared.js";
import type { resolveApiKeyForProvider as ResolveApiKeyForProvider } from "../../../../src/agents/model-auth.js";
export { requireApiKey };
/** Resolve a provider API key through the core model-auth runtime. */
export declare const resolveApiKeyForProvider: typeof ResolveApiKeyForProvider;
