import type { ParsedSkillFrontmatter } from "../types.js";
import { type Skill } from "./skill-contract.js";
/** Loads skills from a local directory while turning read/parse failures into diagnostics. */
export declare function loadSkillsFromDirSafe(params: {
    dir: string;
    source: string;
    maxBytes?: number;
}): {
    skills: Skill[];
    frontmatterByFilePath: ReadonlyMap<string, ParsedSkillFrontmatter>;
};
export declare function readSkillFrontmatterSafe(params: {
    rootDir: string;
    filePath: string;
    maxBytes?: number;
}): Record<string, string> | null;
