/**
 * Encodes one JSON Pointer path token using RFC 6901 escaping.
 */
export declare function encodeJsonPointerToken(token: string): string;
/**
 * Reads a value from a JSON-like document using an absolute JSON Pointer.
 * Missing segments throw by default; `onMissing: "undefined"` is for optional probes.
 */
export declare function readJsonPointer(root: unknown, pointer: string, options?: {
    onMissing?: "throw" | "undefined";
}): unknown;
