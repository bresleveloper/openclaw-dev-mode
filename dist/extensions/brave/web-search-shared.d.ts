import { Il as WebSearchProviderPlugin } from "../../types-BVLQjFJF.js";
//#region extensions/brave/web-search-shared.d.ts
/** Canonical config path for the Brave Search API key. */
declare const BRAVE_CREDENTIAL_PATH = "plugins.entries.brave.config.webSearch.apiKey";
/** Resolve legacy top-level Brave credentials from old web-search config. */
declare function resolveLegacyTopLevelBraveCredential(config: unknown): {
  path: string;
  value: unknown;
} | undefined;
/** Resolve Brave credentials from current plugin config or legacy fallback. */
declare function resolveConfiguredBraveCredential(config: unknown): unknown;
/** Build the common Brave provider metadata without the runtime tool executor. */
declare function buildBraveWebSearchProviderBase(): Omit<WebSearchProviderPlugin, "createTool">;
//#endregion
export { BRAVE_CREDENTIAL_PATH, buildBraveWebSearchProviderBase, resolveConfiguredBraveCredential, resolveLegacyTopLevelBraveCredential };