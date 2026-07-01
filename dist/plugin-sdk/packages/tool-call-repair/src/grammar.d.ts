/** Legacy marker some models emit after a serialized JSON tool request. */
export declare const END_TOOL_REQUEST = "[END_TOOL_REQUEST]";
/** Harmony stream marker that introduces the target channel before a tool call. */
export declare const HARMONY_CHANNEL_MARKER = "<|channel|>";
/** Harmony stream marker that may separate the header from the JSON payload. */
export declare const HARMONY_MESSAGE_MARKER = "<|message|>";
/** Harmony stream marker that may close a serialized tool-call payload. */
export declare const HARMONY_CALL_MARKER = "<|call|>";
/** Accepts either a complete literal or a still-streaming prefix of that literal. */
export declare function matchesLiteralPrefix(text: string, literal: string): boolean;
/** Tool names in bracket/plain-text repairs intentionally match provider-safe ids only. */
export declare function isPlainTextToolNameChar(char: string | undefined): boolean;
/** XML-ish function tags allow namespace punctuation used by some model families. */
export declare function isXmlishNameChar(char: string | undefined): boolean;
/** Skips spaces and tabs only, preserving line boundaries for grammar decisions. */
export declare function skipHorizontalWhitespace(text: string, start: number): number;
/** Skips all JavaScript whitespace when line structure is no longer meaningful. */
export declare function skipWhitespace(text: string, start: number): number;
/** Consumes either Unix or Windows line endings and returns the first offset after them. */
export declare function consumeLineBreak(text: string, start: number): number | null;
/** Finds the exclusive end offset of a balanced JSON object starting at `start`. */
export declare function findJsonObjectEnd(text: string, start: number, maxPayloadBytes?: number): number | null;
/** Consumes one optional line break after a repaired serialized tool-call fragment. */
export declare function skipSerializedToolCallTrailingLineBreak(text: string, cursor: number): number;
/** Accepts the legacy closing markers models append after JSON tool-call payloads. */
export declare function consumeJsonToolClosingMarker(text: string, cursor: number): number;
/** Finds JSON after bracketed tool syntax such as `[tool_name]\n{...}`. */
export declare function findBracketedJsonPayloadStart(text: string): number | null;
/** Finds JSON after Harmony channel/tool headers while tolerating optional message markers. */
export declare function findHarmonyJsonPayloadStart(text: string): number | null;
/** Case-insensitive marker compare for ASCII protocol tags without locale rules. */
export declare function startsWithAsciiMarkerIgnoreCase(text: string, cursor: number, marker: string): boolean;
/** Case-insensitive marker search for ASCII protocol tags without allocating regexes. */
export declare function indexOfAsciiMarkerIgnoreCase(text: string, marker: string, start: number): number;
/** Returns the end offset for a complete XML-ish or bracketed plain-text tool call. */
export declare function findXmlishToolCallEnd(text: string): number | null;
