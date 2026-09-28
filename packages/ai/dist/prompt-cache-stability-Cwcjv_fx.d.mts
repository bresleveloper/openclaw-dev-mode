//#region packages/ai/src/utils/prompt-cache-stability.d.ts
/** Canonicalizes provider tool order without relying on host locale settings. */
declare function sortPromptCacheToolsByName<T extends {
  readonly name?: string;
  readonly wireName?: string;
  readonly description?: string;
}>(tools: readonly T[]): T[];
/** Normalize structured prompt text before hashing or snapshot comparison. */
declare function normalizeStructuredPromptSection(text: string): string;
/** Normalize, de-dupe, and sort capability ids for stable prompt payloads. */
declare function normalizePromptCapabilityIds(capabilities: ReadonlyArray<string>): string[];
//#endregion
export { normalizeStructuredPromptSection as n, sortPromptCacheToolsByName as r, normalizePromptCapabilityIds as t };