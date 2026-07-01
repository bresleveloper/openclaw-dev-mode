import type { OpenClawConfig } from "../../config/types.openclaw.js";
export declare function resolveAllowedSkillSymlinkTargetRealPaths(config?: OpenClawConfig): string[];
export declare function findContainingAllowedSkillSymlinkTarget(rootRealPaths: readonly string[], candidateRealPath: string): string | null;
export declare function tryRealpath(filePath: string): string | null;
