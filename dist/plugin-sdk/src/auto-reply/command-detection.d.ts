import type { OpenClawConfig } from "../config/types.js";
import type { CommandNormalizeOptions } from "./commands-registry.types.js";
/** Returns true when text starts with a configured control command alias. */
export declare function hasControlCommand(text?: string, cfg?: OpenClawConfig, options?: CommandNormalizeOptions): boolean;
/** Returns true for exact control commands or abort triggers after metadata stripping. */
export declare function isControlCommandMessage(text?: string, cfg?: OpenClawConfig, options?: CommandNormalizeOptions): boolean;
/**
 * Coarse detection for inline directives/shortcuts (e.g. "hey /status") so channel monitors
 * can decide whether to compute CommandAuthorized for a message.
 *
 * This intentionally errs on the side of false positives; CommandAuthorized only gates
 * command/directive execution, not normal chat replies.
 */
export declare function hasInlineCommandTokens(text?: string): boolean;
/** Returns true when a message may need command authorization metadata. */
export declare function shouldComputeCommandAuthorized(text?: string, cfg?: OpenClawConfig, options?: CommandNormalizeOptions): boolean;
