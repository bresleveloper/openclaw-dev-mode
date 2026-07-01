import type { SkillSnapshot } from "../../skills/types.js";
/** Returns whether a resolved skill file is readable before linking it into the Claude plugin. */
export declare function isClaudeCliSkillFileAccessible(skillFilePath: string): boolean;
/** Prepares Claude CLI `--plugin-dir` args for the current session skill snapshot. */
export declare function prepareClaudeCliSkillsPlugin(params: {
    backendId: string;
    skillsSnapshot?: SkillSnapshot;
}): Promise<{
    args: string[];
    cleanup: () => Promise<void>;
    pluginDir?: string;
}>;
