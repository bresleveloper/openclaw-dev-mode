import type { OpenClawConfig } from "../config/types.js";
import type { ChatCommandDefinition, CommandDetection, CommandNormalizeOptions } from "./commands-registry.types.js";
/** Normalizes command text to canonical aliases, removing bot mentions when appropriate. */
export declare function normalizeCommandBody(raw: string, options?: CommandNormalizeOptions): string;
/** Returns cached exact and regex detectors for the current command registry instance. */
export declare function getCommandDetection(_cfg?: OpenClawConfig): CommandDetection;
/** Resolves a raw text command to the matching normalized alias when known. */
export declare function maybeResolveTextAlias(raw: string, cfg?: OpenClawConfig): string | null;
/** Resolves a raw text command into its command definition and raw argument tail. */
export declare function resolveTextCommand(raw: string, cfg?: OpenClawConfig): {
    command: ChatCommandDefinition;
    args?: string;
} | null;
