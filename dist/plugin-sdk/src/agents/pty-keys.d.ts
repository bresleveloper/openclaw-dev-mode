type KeyEncodingRequest = {
    keys?: string[];
    hex?: string[];
    literal?: string;
};
type KeyEncodingResult = {
    data: string;
    warnings: string[];
};
/** True when request keys depend on normal vs application cursor-key mode. */
export declare function hasCursorModeSensitiveKeys(request: KeyEncodingRequest): boolean;
/** Encodes literal, hex, and named key tokens into one PTY input string. */
export declare function encodeKeySequence(request: KeyEncodingRequest, cursorKeyMode?: "normal" | "application"): KeyEncodingResult;
/** Wraps pasted text in bracketed-paste markers when enabled. */
export declare function encodePaste(text: string, bracketed?: boolean): string;
export {};
