/** Returns the UTF-8 byte length of JSON.stringify(value), falling back to String(value). */
export declare function jsonUtf8Bytes(value: unknown): number;
/** Best-effort byte count result for bounded JSON traversal. */
export type BoundedJsonUtf8Bytes = {
    /** Bytes counted, or a value greater than the requested max when incomplete. */
    bytes: number;
    /** True when traversal completed without unsupported/circular/over-limit input. */
    complete: boolean;
};
/** Returns JSON UTF-8 byte length, or Infinity when the value cannot serialize safely. */
export declare function jsonUtf8BytesOrInfinity(value: unknown): number;
/** Returns the first enumerable own keys in JavaScript enumeration order. */
export declare function firstEnumerableOwnKeys(value: object, maxKeys: number): string[];
/** Counts JSON UTF-8 bytes up to a hard limit without fully serializing large objects. */
export declare function boundedJsonUtf8Bytes(value: unknown, maxBytes: number): BoundedJsonUtf8Bytes;
