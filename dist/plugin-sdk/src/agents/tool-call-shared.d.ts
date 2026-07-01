/** Normalize an optional iterable of allowed tool names for lookup. */
export declare function normalizeAllowedToolNames(allowedToolNames?: Iterable<string>): Set<string> | null;
/** Return whether a model-supplied tool call name is syntactically and policy allowed. */
export declare function isAllowedToolCallName(name: unknown, allowedToolNames: Set<string> | null): boolean;
