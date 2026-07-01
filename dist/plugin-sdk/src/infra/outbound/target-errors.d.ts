/**
 * Formats the user-facing error shown when no target is available.
 */
export declare function missingTargetMessage(provider: string, hint?: string): string;
/**
 * Builds an Error for missing outbound target failures.
 */
export declare function missingTargetError(provider: string, hint?: string): Error;
/**
 * Formats the user-facing error shown when a target name resolves ambiguously.
 */
export declare function ambiguousTargetMessage(provider: string, raw: string, hint?: string): string;
/**
 * Builds an Error for ambiguous outbound target failures.
 */
export declare function ambiguousTargetError(provider: string, raw: string, hint?: string): Error;
/**
 * Formats the user-facing error shown when no target matches the input.
 */
export declare function unknownTargetMessage(provider: string, raw: string, hint?: string): string;
/**
 * Builds an Error for unknown outbound target failures.
 */
export declare function unknownTargetError(provider: string, raw: string, hint?: string): Error;
