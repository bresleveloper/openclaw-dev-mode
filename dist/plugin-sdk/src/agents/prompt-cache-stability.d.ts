/** Normalize structured prompt text before hashing or snapshot comparison. */
export declare function normalizeStructuredPromptSection(text: string): string;
/** Normalize, de-dupe, and sort capability ids for stable prompt payloads. */
export declare function normalizePromptCapabilityIds(capabilities: ReadonlyArray<string>): string[];
