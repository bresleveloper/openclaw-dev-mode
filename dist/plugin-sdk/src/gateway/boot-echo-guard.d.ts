export declare function setBootEchoContextForSession(sessionKey: string, bootPrompt: string): void;
export declare function clearBootEchoContextForSession(sessionKey: string): void;
export declare function getBootEchoContextForSession(sessionKey: string | undefined): string | undefined;
/**
 * Returns true if `outboundText` contains a contiguous substring of
 * `bootPrompt` of at least `minLen` characters, ignoring leading/trailing
 * whitespace on the boot prompt itself. Short boot prompts (< minLen chars)
 * never trigger to avoid suppressing legitimate short BOOT.md-directed
 * sends like a literal "good morning".
 */
export declare function containsSubstantialBootEcho(outboundText: string, bootPrompt: string, minLen?: number): boolean;
/**
 * Removes any user-supplied outbound text that substantially echoes the
 * active boot prompt. Returns an empty string when an echo is detected so
 * the caller can either drop the send entirely or treat the outbound text
 * as empty. The boot prompt itself is unchanged.
 */
export declare function stripBootEchoFromOutboundText(outboundText: string, bootPrompt: string | undefined): string;
export declare function resetBootEchoContextForTests(): void;
