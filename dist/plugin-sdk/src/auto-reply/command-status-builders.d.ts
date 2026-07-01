import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SkillCommandSpec } from "../skills/types.js";
/** Builds the compact slash-command help text shown by `/help`. */
export declare function buildHelpMessage(cfg?: OpenClawConfig): string;
/** Options for rendering `/commands` output for a specific channel surface. */
export type CommandsMessageOptions = {
    page?: number;
    surface?: string;
    forcePaginatedList?: boolean;
};
/** Rendered `/commands` text plus pagination metadata for channel-native lists. */
export type CommandsMessageResult = {
    text: string;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
};
/** Builds `/commands` text, returning only the rendered message body. */
export declare function buildCommandsMessage(cfg?: OpenClawConfig, skillCommands?: SkillCommandSpec[], options?: CommandsMessageOptions): string;
/** Builds `/commands` text and pagination metadata for surfaces with native list controls. */
export declare function buildCommandsMessagePaginated(cfg?: OpenClawConfig, skillCommands?: SkillCommandSpec[], options?: CommandsMessageOptions): CommandsMessageResult;
