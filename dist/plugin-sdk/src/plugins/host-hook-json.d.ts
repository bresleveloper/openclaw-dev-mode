/** JSON primitive values accepted across plugin host-hook boundaries. */
export type PluginJsonPrimitive = string | number | boolean | null;
/** Bounded JSON value shape accepted from plugin hooks. */
export type PluginJsonValue = PluginJsonPrimitive | PluginJsonValue[] | {
    [key: string]: PluginJsonValue;
};
/** Resource limits for untrusted plugin JSON payload validation. */
export type PluginJsonValueLimits = {
    maxDepth: number;
    maxNodes: number;
    maxObjectKeys: number;
    maxStringLength: number;
    maxSerializedBytes: number;
};
/** Default safety limits for plugin JSON hook payloads. */
export declare const PLUGIN_JSON_VALUE_LIMITS: PluginJsonValueLimits;
/** Validates that a plugin hook payload is finite, plain JSON under size limits. */
export declare function isPluginJsonValue(value: unknown): value is PluginJsonValue;
