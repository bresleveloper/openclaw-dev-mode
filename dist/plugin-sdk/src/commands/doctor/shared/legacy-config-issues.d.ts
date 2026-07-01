import type { LegacyConfigIssue } from "../../../config/types.js";
/** Find legacy config issues using core rules plus relevant channel/plugin doctor contracts. */
export declare function findDoctorLegacyConfigIssues(raw: unknown, sourceRaw?: unknown, touchedPaths?: ReadonlyArray<ReadonlyArray<string>>): LegacyConfigIssue[];
