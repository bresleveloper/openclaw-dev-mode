import type { LegacyConfigRule } from "./legacy.shared.js";
import type { LegacyConfigIssue } from "./types.js";
/** Finds legacy config issues using built-in rules plus optional caller rules. */
export declare function findLegacyConfigIssues(raw: unknown, sourceRaw?: unknown, extraRules?: LegacyConfigRule[], _touchedPaths?: ReadonlyArray<ReadonlyArray<string>>): LegacyConfigIssue[];
