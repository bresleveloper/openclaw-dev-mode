import type { JsonSchemaObject } from "./json-schema.types.js";
type JsonSchemaValue = JsonSchemaObject | boolean;
/** Repair JSON Schema regex patterns that fail TypeBox's unicode RegExp compile. */
export declare function repairJsonSchemaPatternForUnicodeRegExp(pattern: string): string;
/** Normalize JSON Schema constructs into the TypeBox compiler subset used by plugin validators. */
export declare function normalizeJsonSchemaForTypeBox(schema: JsonSchemaValue): JsonSchemaValue;
/** Return the first structural JSON Schema error that would make validation/defaulting unsafe. */
export declare function findJsonSchemaShapeError(schema: JsonSchemaValue): string | undefined;
/** Apply schema defaults to a config value while preserving caller-owned value shape. */
export declare function applyJsonSchemaDefaults<T>(schema: JsonSchemaValue, value: T): T;
export {};
