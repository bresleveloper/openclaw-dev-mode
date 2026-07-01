/**
 * System-prompt contribution for routing durable skill edits through the
 * Skill Workshop tool instead of direct filesystem writes.
 */
export declare const SKILL_WORKSHOP_TOOL_NAME = "skill_workshop";
/** Build the system-prompt section for Skill Workshop routing rules. */
export declare function buildSkillWorkshopPromptSection(): string[];
