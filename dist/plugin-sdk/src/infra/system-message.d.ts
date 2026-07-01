export declare const SYSTEM_MARK = "\u2699\uFE0F";
/** Return true when text already carries the system-message prefix. */
export declare function hasSystemMark(text: string): boolean;
/** Prefix non-empty text as a system message without double-prefixing. */
export declare function prefixSystemMessage(text: string): string;
