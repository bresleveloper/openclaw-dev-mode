import { r as OpenClawConfig } from "../types.openclaw-D8uW-XQA.js";
import { n as SkillCommandSpec } from "../types-BLzNI-JA.js";
/** Builds the compact slash-command help text shown by `/help`. */
export declare function buildHelpMessage(cfg?: OpenClawConfig): string;
/** Options for rendering `/commands` output for a specific channel surface. */
type CommandsMessageOptions = {
  page?: number;
  surface?: string;
  forcePaginatedList?: boolean;
};
/** Rendered `/commands` text plus pagination metadata for channel-native lists. */
type CommandsMessageResult = {
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
export type { CommandsMessageOptions, CommandsMessageResult };