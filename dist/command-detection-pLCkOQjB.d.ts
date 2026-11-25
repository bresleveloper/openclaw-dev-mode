import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
import "./types-ACDCRjU-.js";
import { a as CommandNormalizeOptions } from "./commands-registry.types-CyQYytP-.js";
/** Returns true when text starts with a configured control command alias. */
declare function hasControlCommand(text?: string, cfg?: OpenClawConfig, options?: CommandNormalizeOptions): boolean;
/** Returns true for exact control commands or abort triggers after metadata stripping. */
declare function isControlCommandMessage(text?: string, cfg?: OpenClawConfig, options?: CommandNormalizeOptions): boolean;
/**
 * Coarse detection for inline directives/shortcuts (e.g. "hey /status") so channel monitors
 * can decide whether to compute CommandAuthorized for a message.
 *
 * This intentionally errs on the side of false positives; CommandAuthorized only gates
 * command/directive execution, not normal chat replies.
 */
declare function hasInlineCommandTokens(text?: string): boolean;
/** Returns true when a message may need command authorization metadata. */
declare function shouldComputeCommandAuthorized(text?: string, cfg?: OpenClawConfig, options?: CommandNormalizeOptions): boolean;
export { shouldComputeCommandAuthorized as i, hasInlineCommandTokens as n, isControlCommandMessage as r, hasControlCommand as t };