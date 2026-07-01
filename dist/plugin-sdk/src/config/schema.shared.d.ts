type JsonSchemaObject = {
    type?: string | string[];
    properties?: Record<string, JsonSchemaObject>;
    additionalProperties?: JsonSchemaObject | boolean;
    items?: JsonSchemaObject | JsonSchemaObject[];
    anyOf?: JsonSchemaObject[];
    allOf?: JsonSchemaObject[];
    oneOf?: JsonSchemaObject[];
};
/** Deep-clone schema payloads before callers mutate plugin or base schema fragments. */
export declare function cloneSchema<T>(value: T): T;
/** Narrow unknown JSON-schema fragments to non-array objects. */
export declare function asSchemaObject(value: unknown): object | null;
/** Return whether a schema node exposes nested fields through properties, items, or unions. */
export declare function schemaHasChildren(schema: JsonSchemaObject): boolean;
/** Find the most specific wildcard UI hint that matches a concrete config path. */
export declare function findWildcardHintMatch<T>(params: {
    uiHints: Record<string, T>;
    path: string;
    splitPath: (path: string) => string[];
}): {
    path: string;
    hint: T;
} | null;
export {};
