import { t as JsonSchemaObject } from "./json-schema.types-z_ZXZBRr.js";
import { n as ChannelConfigSchema, r as ChannelConfigUiHint } from "./types.config-D1pSqbn8.js";
import { ZodRawShape, ZodTypeAny, z } from "zod";

//#region src/channels/plugins/config-schema.d.ts
type ExtendableZodObject = ZodTypeAny & {
  extend: (shape: Record<string, ZodTypeAny>) => ZodTypeAny;
};
/** Shared allowlist entry shape for channel sender/user ids. */
/** Optional allowlist array used by channel config schema builders. */
declare const AllowFromListSchema: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
/** Build the common nested DM config block used by channel account schemas. */
declare function buildNestedDmConfigSchema(extraShape?: ZodRawShape): z.ZodOptional<z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  policy: z.ZodOptional<z.ZodEnum<{
    pairing: "pairing";
    allowlist: "allowlist";
    open: "open";
    disabled: "disabled";
  }>>;
  allowFrom: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
}, z.core.$strip>>;
/** Add `accounts` catchall and `defaultAccount` fields to a channel account schema. */
declare function buildCatchallMultiAccountChannelSchema<T extends ExtendableZodObject>(accountSchema: T): T;
type BuildChannelConfigSchemaOptions = {
  uiHints?: Record<string, ChannelConfigUiHint>;
};
type BuildJsonChannelConfigSchemaOptions = {
  cacheKey?: string;
  uiHints?: Record<string, ChannelConfigUiHint>;
  runtime?: ChannelConfigSchema["runtime"];
};
/** Build a channel config schema from JSON Schema with runtime validation/default support. */
declare function buildJsonChannelConfigSchema(schema: JsonSchemaObject, options?: BuildJsonChannelConfigSchemaOptions): ChannelConfigSchema;
/** Build a channel config schema from Zod, exporting JSON Schema when available. */
declare function buildChannelConfigSchema(schema: ZodTypeAny, options?: BuildChannelConfigSchemaOptions): ChannelConfigSchema;
/** Return a channel config schema for channels that intentionally accept no config keys. */
declare function emptyChannelConfigSchema(): ChannelConfigSchema;
//#endregion
export { buildNestedDmConfigSchema as a, buildJsonChannelConfigSchema as i, buildCatchallMultiAccountChannelSchema as n, emptyChannelConfigSchema as o, buildChannelConfigSchema as r, AllowFromListSchema as t };