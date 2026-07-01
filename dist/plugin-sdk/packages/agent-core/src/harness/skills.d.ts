import type { Skill } from "./types.js";
/** Format a skill invocation prompt, optionally appending additional user instructions. */
export declare function formatSkillInvocation(skill: Skill, additionalInstructions?: string): string;
