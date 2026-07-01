import type { SkillCommandSpec } from "../types.js";
/** Lists slash command names reserved by built-in chat commands and callers. */
export declare function listReservedChatSlashCommandNames(extraNames?: string[]): Set<string>;
export declare function resolveSkillCommandInvocation(params: {
    commandBodyNormalized: string;
    skillCommands: SkillCommandSpec[];
}): {
    command: SkillCommandSpec;
    args?: string;
} | null;
