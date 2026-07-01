import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SkillCommandSpec } from "../skills/types.js";
import type { ChatCommandDefinition } from "./commands-registry.types.js";
/** Lists built-in commands plus optional skill-provided commands. */
export declare function listChatCommands(params?: {
    skillCommands?: SkillCommandSpec[];
}): ChatCommandDefinition[];
/** Applies config feature flags to command keys that can be operator-disabled. */
export declare function isCommandEnabled(cfg: OpenClawConfig, commandKey: string): boolean;
/** Lists commands visible for a specific config, preserving dynamic skill commands. */
export declare function listChatCommandsForConfig(cfg: OpenClawConfig, params?: {
    skillCommands?: SkillCommandSpec[];
}): ChatCommandDefinition[];
