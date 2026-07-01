/** Narrows plain objects that carry the minimum SecretRef fields used by redaction. */
export declare function isSecretRefShape(value: Record<string, unknown>): value is Record<string, unknown> & {
    source: string;
    id: string;
};
/** Redacts a SecretRef id while preserving non-secret structural fields for restore matching. */
export declare function redactSecretRefId(params: {
    value: Record<string, unknown> & {
        source: string;
        id: string;
    };
    values: string[];
    redactedSentinel: string;
    isEnvVarPlaceholder: (value: string) => boolean;
}): Record<string, unknown>;
