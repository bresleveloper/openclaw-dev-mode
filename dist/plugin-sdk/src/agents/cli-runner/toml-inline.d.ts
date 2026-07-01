/** Serialize a supported value into TOML inline syntax. */
export declare function serializeTomlInlineValue(value: unknown): string;
/** Format one CLI config override as `key=value`. */
export declare function formatTomlConfigOverride(key: string, value: unknown): string;
