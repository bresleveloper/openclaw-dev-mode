import type { ContextPruningToolMatch } from "./settings.js";
/** Build a deny-first allowlist predicate for context-prunable tool names. */
export declare function makeToolPrunablePredicate(match: ContextPruningToolMatch): (toolName: string) => boolean;
