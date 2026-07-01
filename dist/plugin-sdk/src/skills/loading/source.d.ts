import type { SkillTelemetrySource } from "../types.js";
import type { Skill } from "./skill-contract.js";
/** Returns the stable source label attached to a loaded skill. */
export declare function resolveSkillSource(skill: Skill): string;
export declare function resolveSkillTelemetrySourceValue(value: unknown): SkillTelemetrySource;
export declare function resolveSkillTelemetrySource(skill: Skill): SkillTelemetrySource;
