import { type ZodTypeAny } from "zod";
import type { JsonSchemaObject } from "../shared/json-schema.types.js";
import type { PluginConfigUiHint } from "./manifest-types.js";
import type { OpenClawPluginConfigSchema } from "./types.js";
type BuildPluginConfigSchemaOptions = {
    uiHints?: Record<string, PluginConfigUiHint>;
    safeParse?: OpenClawPluginConfigSchema["safeParse"];
};
type BuildJsonPluginConfigSchemaOptions = {
    cacheKey?: string;
    uiHints?: Record<string, PluginConfigUiHint>;
    safeParse?: OpenClawPluginConfigSchema["safeParse"];
};
/** Build a plugin config schema from JSON Schema with runtime validation/default support. */
export declare function buildJsonPluginConfigSchema(schema: JsonSchemaObject, options?: BuildJsonPluginConfigSchemaOptions): OpenClawPluginConfigSchema;
/** Build a plugin config schema from Zod, exporting JSON Schema when the Zod runtime supports it. */
export declare function buildPluginConfigSchema(schema: ZodTypeAny, options?: BuildPluginConfigSchemaOptions): OpenClawPluginConfigSchema;
/** Return a schema for plugins that intentionally accept no config keys. */
export declare function emptyPluginConfigSchema(): OpenClawPluginConfigSchema;
export {};
