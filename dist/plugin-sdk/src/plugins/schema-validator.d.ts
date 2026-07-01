import type { JsonSchemaObject } from "../shared/json-schema.types.js";
/**
 * JSON Schema document accepted by plugin config and SDK runtime validation.
 * Boolean schemas are valid draft-style schemas and must remain accepted here.
 */
export type JsonSchemaValue = JsonSchemaObject | boolean;
/**
 * Sanitized validation error surfaced to config diagnostics, gateway hooks, and SDK callers.
 * `path`/`message` stay raw for programmatic handling; `text` is terminal-safe display text.
 */
export type JsonSchemaValidationError = {
    path: string;
    message: string;
    text: string;
    additionalProperty?: string;
    allowedValues?: string[];
    allowedValuesHiddenCount?: number;
};
/**
 * Validate a plugin-owned value against a JSON Schema, optionally hydrating schema defaults.
 * The cache key is caller-owned so repeated plugin/schema validations can reuse compiled TypeBox validators.
 */
export declare function validateJsonSchemaValue(params: {
    schema: JsonSchemaValue;
    cacheKey: string;
    value: unknown;
    applyDefaults?: boolean;
    cache?: boolean;
}): {
    ok: true;
    value: unknown;
} | {
    ok: false;
    errors: JsonSchemaValidationError[];
};
