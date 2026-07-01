import type { SkillEntry, SkillInstallSpec } from "../types.js";
import type { SkillInstallResult } from "./install-types.js";
export declare function installDownloadSpec(params: {
    entry: SkillEntry;
    spec: SkillInstallSpec;
    timeoutMs: number;
}): Promise<SkillInstallResult>;
